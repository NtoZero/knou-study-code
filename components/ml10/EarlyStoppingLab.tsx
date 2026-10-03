"use client";

import { useEffect, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Hint, Scroller, Slider } from "./ui";
import {
  LINEAR,
  TANH,
  fmt,
  forward,
  initMlp,
  meanSquaredError,
  mulberry32,
  onlineStep,
  type Sample,
} from "./mlpCore";

const EPOCHS = 800;
const SNAP = 20;
const H_NODES = 16;
const ETA = 0.1;
const NOISE = 0.8;
const N_TRAIN = 8;
const GRID = 60;

interface Result {
  train: Sample[];
  trainCurve: number[];
  validCurve: number[];
  best: number;
  snaps: number[][];
}

function experiment(): Result {
  const rng = mulberry32(7);
  const train: Sample[] = [];
  for (let i = 0; i < N_TRAIN; i += 1) {
    const x = -3 + (6 * i) / (N_TRAIN - 1);
    train.push({ x: [x / 3], t: [Math.sin(x) + (rng() * 2 - 1) * NOISE] });
  }
  const valid: Sample[] = [];
  for (let i = 0; i < 60; i += 1) {
    const x = -3 + (6 * i) / 59;
    valid.push({ x: [x / 3], t: [Math.sin(x)] });
  }
  const net = initMlp(1, H_NODES, 1, mulberry32(13), {
    scale: 0.5,
    hidden: TANH,
    output: LINEAR,
  });

  const trainCurve: number[] = [];
  const validCurve: number[] = [];
  const snaps: number[][] = [];
  const gridX = Array.from({ length: GRID }, (_, i) => -3 + (6 * i) / (GRID - 1));

  // 데이터를 정해진 차례대로 하나씩 넣는 온라인 학습. 순서를 섞지 않아야
  // 에포크마다의 오차가 톱니 없이 떨어져 두 곡선의 모양을 비교할 수 있다.
  for (let ep = 0; ep < EPOCHS; ep += 1) {
    for (const s of train) onlineStep(net, s, ETA);
    trainCurve.push(meanSquaredError(net, train));
    validCurve.push(meanSquaredError(net, valid));
    if (ep % SNAP === 0) snaps.push(gridX.map((x) => forward(net, [x / 3]).y[0]));
  }
  let best = 0;
  for (let i = 1; i < validCurve.length; i += 1) if (validCurve[i] < validCurve[best]) best = i;
  return { train, trainCurve, validCurve, best, snaps };
}

const CW = 440;
const CH = 180;
const CPAD = { l: 38, r: 12, t: 14, b: 26 };

const FW = 260;
const FH = 170;
const FPAD = { l: 26, r: 10, t: 12, b: 20 };

export default function EarlyStoppingLab() {
  const [res, setRes] = useState<Result | null>(null);
  const [epoch, setEpoch] = useState(300);

  useEffect(() => {
    setRes(experiment());
  }, []);

  return (
    <section id="early-stopping" className="scroll-mt-32">
      <SectionTitle
        title="학습 종료점의 문제와 조기 종료"
        subtitle="검증 데이터의 오차가 다시 커지는 지점을 실제로 학습시켜 찾습니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "11.3.2 학습의 고려사항 — 학습 종료점의 문제(그림 11-16)",
            slides: "MLP 학습의 고려사항 — 학습 종료점의 문제",
          }}
        >
          <Card>
            <CardTitle>검증 데이터 집합을 따로 두는 이유</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              많은 경우 원하는 학습 오차를 시작 전에 알기는 힘들며, 학습 오차가 작다고 해서 항상 좋은 결과를
              주는 것도 아니므로 <strong>과다적합을 피할 수 있는 적절한 학습 종료 시점</strong>을 결정할
              필요가 있습니다. 이를 위해 학습 데이터 집합 외에 검증 데이터 집합을 따로 두고, 학습이 진행되는
              동안 검증 집합에 대한 오차도 함께 계산합니다. 학습 오차는 계속 줄어드는 반면 검증 오차는 어느
              시점에서 다시 증가하게 되는데, 그 시점이 과다적합이 발생하는 지점이므로 거기서 학습을 완료하는
              것이 가장 바람직합니다.
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "11.3.2 — 학습곡선과 학습 종료 시점",
            slides: "MLP 학습의 고려사항 — 검증 데이터 집합을 사용하는 방법",
          }}
        >
          <Card>
            <CardTitle>직접 학습시켜 본 두 오차 곡선</CardTitle>
            {!res ? (
              <p className="py-8 text-center text-xs text-gray-400">학습 중…</p>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                  <Scroller>
                    <svg viewBox={`0 0 ${CW} ${CH}`} className="h-auto w-full min-w-[400px]">
                      {(() => {
                        const yMax = 0.22;
                        const px = (e: number) => CPAD.l + (e / (EPOCHS - 1)) * (CW - CPAD.l - CPAD.r);
                        const py = (v: number) =>
                          CH - CPAD.b - (Math.min(v, yMax) / yMax) * (CH - CPAD.t - CPAD.b);
                        const line = (arr: number[]) =>
                          arr.map((v, i) => `${px(i)},${py(v)}`).join(" ");
                        return (
                          <>
                            <rect
                              x={px(res.best)}
                              y={CPAD.t}
                              width={CW - CPAD.r - px(res.best)}
                              height={CH - CPAD.t - CPAD.b}
                              fill="#fecaca"
                              opacity={0.3}
                            />
                            <text
                              x={(px(res.best) + CW - CPAD.r) / 2}
                              y={CPAD.t + 12}
                              fontSize="10"
                              textAnchor="middle"
                              fill="#dc2626"
                            >
                              과다적합 구간
                            </text>
                            <line x1={CPAD.l} y1={CH - CPAD.b} x2={CW - CPAD.r} y2={CH - CPAD.b} stroke="#cbd5e1" />
                            <line x1={CPAD.l} y1={CPAD.t} x2={CPAD.l} y2={CH - CPAD.b} stroke="#cbd5e1" />
                            {[0, 0.05, 0.1, 0.15, 0.2].map((v) => (
                              <g key={v}>
                                <line x1={CPAD.l - 3} y1={py(v)} x2={CPAD.l} y2={py(v)} stroke="#cbd5e1" />
                                <text x={CPAD.l - 5} y={py(v) + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
                                  {v.toFixed(2)}
                                </text>
                              </g>
                            ))}
                            <polyline points={line(res.trainCurve)} fill="none" stroke="#0284c7" strokeWidth={1.8} />
                            <polyline
                              points={line(res.validCurve)}
                              fill="none"
                              stroke="#dc2626"
                              strokeWidth={1.8}
                              strokeDasharray="5 3"
                            />
                            <line
                              x1={px(res.best)}
                              y1={CPAD.t}
                              x2={px(res.best)}
                              y2={CH - CPAD.b}
                              stroke="#16a34a"
                              strokeWidth={1.5}
                            />
                            <text x={px(res.best)} y={CH - 14} fontSize="9" textAnchor="middle" fill="#16a34a">
                              종료 시점 {res.best}
                            </text>
                            <line
                              x1={px(epoch)}
                              y1={CPAD.t}
                              x2={px(epoch)}
                              y2={CH - CPAD.b}
                              stroke="#475569"
                              strokeWidth={1}
                              strokeDasharray="2 3"
                            />
                            <text x={CW - CPAD.r} y={CH - 4} fontSize="9" textAnchor="end" fill="#94a3b8">
                              τ (학습 에포크 수)
                            </text>
                            <text x={CPAD.l + 4} y={CPAD.t + 9} fontSize="9" fill="#94a3b8">
                              오차
                            </text>
                          </>
                        );
                      })()}
                    </svg>
                    <div className="mt-1 flex flex-wrap gap-3 pl-9 text-[10px]">
                      <span className="flex items-center gap-1 text-sky-600">
                        <span className="inline-block h-0.5 w-4 bg-sky-600" />
                        학습 오차
                      </span>
                      <span className="flex items-center gap-1 text-rose-600">
                        <span className="inline-block h-0.5 w-4 border-t border-dashed border-rose-600" />
                        검증 오차
                      </span>
                    </div>
                  </Scroller>

                  <div className="space-y-3">
                    <Slider
                      label="지금 멈춘다면 (에포크)"
                      value={epoch}
                      min={0}
                      max={EPOCHS - 1}
                      step={10}
                      onChange={setEpoch}
                      display={epoch}
                    />
                    <Scroller>
                      <svg viewBox={`0 0 ${FW} ${FH}`} className="h-auto w-full min-w-[240px]">
                        {(() => {
                          const fx = (x: number) => FPAD.l + ((x + 3) / 6) * (FW - FPAD.l - FPAD.r);
                          const fy = (y: number) =>
                            FH - FPAD.b - ((Math.max(-2, Math.min(2, y)) + 2) / 4) * (FH - FPAD.t - FPAD.b);
                          const snapIdx = Math.min(Math.floor(epoch / SNAP), res.snaps.length - 1);
                          const curve = res.snaps[snapIdx];
                          const gridX = Array.from({ length: GRID }, (_, i) => -3 + (6 * i) / (GRID - 1));
                          const best = res.snaps[Math.min(Math.floor(res.best / SNAP), res.snaps.length - 1)];
                          return (
                            <>
                              <line x1={FPAD.l} y1={fy(0)} x2={FW - FPAD.r} y2={fy(0)} stroke="#e2e8f0" />
                              <polyline
                                points={gridX.map((x) => `${fx(x)},${fy(Math.sin(x))}`).join(" ")}
                                fill="none"
                                stroke="#94a3b8"
                                strokeWidth={1.2}
                                strokeDasharray="4 3"
                              />
                              <polyline
                                points={gridX.map((x, i) => `${fx(x)},${fy(best[i])}`).join(" ")}
                                fill="none"
                                stroke="#16a34a"
                                strokeWidth={1.2}
                                opacity={0.6}
                              />
                              <polyline
                                points={gridX.map((x, i) => `${fx(x)},${fy(curve[i])}`).join(" ")}
                                fill="none"
                                stroke="#0284c7"
                                strokeWidth={2}
                              />
                              {res.train.map((s, i) => (
                                <circle
                                  key={i}
                                  cx={fx(s.x[0] * 3)}
                                  cy={fy(s.t[0])}
                                  r={3.5}
                                  fill="#ffffff"
                                  stroke="#dc2626"
                                  strokeWidth={1.6}
                                />
                              ))}
                              <text x={FPAD.l} y={FH - 5} fontSize="8" fill="#94a3b8">
                                x
                              </text>
                            </>
                          );
                        })()}
                      </svg>
                    </Scroller>
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      <span className="text-gray-500">— — 참값</span>
                      <span className="text-green-600">— 종료 시점의 근사</span>
                      <span className="text-sky-600">— 지금 에포크의 근사</span>
                      <span className="text-rose-600">○ 학습 데이터 8개</span>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-2.5 font-mono text-[10.5px] leading-5 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      <div>에포크 {epoch}</div>
                      <div>학습 오차 = {fmt(res.trainCurve[epoch], 5)}</div>
                      <div>
                        검증 오차 = {fmt(res.validCurve[epoch], 5)}
                        {epoch > res.best && (
                          <span className="ml-1 text-rose-600">
                            (최소보다 {fmt(res.validCurve[epoch] / res.validCurve[res.best], 2)}배)
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-green-700 dark:text-green-400">
                        검증 오차 최소 = 에포크 {res.best}, {fmt(res.validCurve[res.best], 5)}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                  학습 오차는 에포크 {res.trainCurve.length - 1}까지 {fmt(res.trainCurve[0], 4)}에서{" "}
                  {fmt(res.trainCurve[res.trainCurve.length - 1], 4)}로 계속 줄어듭니다. 반면 검증 오차는 에포크{" "}
                  {res.best}에서 {fmt(res.validCurve[res.best], 4)}로 최소가 된 뒤 다시 커져 마지막에는{" "}
                  {fmt(res.validCurve[res.validCurve.length - 1], 4)}가 됩니다. 오른쪽 그림에서 에포크를 끝까지
                  밀어 보면, 근사 곡선이 학습 데이터 8개의 잡음까지 따라가느라 참값에서 멀어지는 것이 보입니다.
                </p>

                <ComputedNote>
                  이 수치는 이 페이지에서 직접 학습시켜 얻은 값입니다. 학습 데이터는 sin 곡선에 잡음을 더한
                  {" "}{N_TRAIN}개, 검증 데이터는 잡음 없는 60개, 은닉 노드 {H_NODES}개(하이퍼탄젠트),
                  출력 노드는 선형 함수, 학습률 {ETA}입니다. 교재·강의록에는 같은 모양의 곡선 그림만 있고
                  수치는 제시되지 않습니다.
                </ComputedNote>
              </>
            )}
            <Hint>
              여기서 쓴 검증 데이터는 학습에 쓰이지 않습니다. 학습 오차만 보고 있으면 멈춰야 할 지점을 알 수
              없다는 것이 이 그림의 요점입니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
