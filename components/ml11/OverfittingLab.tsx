"use client";

import { useEffect, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, Formula, Hint, Scroller, Slider } from "./ui";
import { OF, OF_GRID, fmt, makeData, runOverfit, type OfMode, type OfRun } from "./nets";

interface ModeDef {
  key: OfMode;
  label: string;
  title: string;
  desc: string;
  min: number;
  max: number;
  step: number;
  def: number;
  unit: (v: number) => string;
  refs: { textbook: string; slides: string };
}

const MODES: ModeDef[] = [
  {
    key: "none",
    label: "규제 없음",
    title: "① 조기 종료 early stopping",
    desc:
      "학습이 진행되는 과정에서 과다적합이 발생하기 전에 학습을 종료하는 방법. 학습 데이터와 별도로 검증용 데이터 집합을 마련하여 한 번 혹은 여러 차례의 학습 에포크를 수행할 때마다 검증 데이터 집합에 대한 오차를 확인하여, 오차가 증가하는 시점을 종료 시점으로 결정한다.",
    min: 0,
    max: 0,
    step: 1,
    def: 0,
    unit: () => "—",
    refs: { textbook: "12.2.3 (1) 조기 종료(그림 12-7)", slides: "과다적합의 해결책 ① 조기 종료" },
  },
  {
    key: "reg",
    label: "정규항 추가",
    title: "② 정규항 regularization term",
    desc:
      "가중치가 너무 크게 되면 복잡한 형태의 함수가 생성되어 과다적합이 발생한다는 사실에 착안하여, 학습하는 동안 가중치가 지나치게 커지는 것을 방지하기 위해 원래 오차함수에 가중치 벡터의 2차 노름에 해당하는 정규항을 추가한다.",
    min: 0,
    max: 0.008,
    step: 0.001,
    def: 0.005,
    unit: (v) => `λ = ${v.toFixed(3)}`,
    refs: { textbook: "12.2.3 (2) 정규항 추가(식 12-5)", slides: "과다적합의 해결책 ② 정규항" },
  },
  {
    key: "drop",
    label: "드롭아웃",
    title: "③ 드롭아웃 dropout",
    desc:
      "학습 과정에서 가중치를 수정할 때 임의로 선택한 은닉 노드의 일부를 제외하는 것. 랜덤하게 선택된 일부 파라미터들이 학습에 참여하지 못하므로 전체 모델이 가지는 복잡도보다 낮은 모델로 학습하는 효과를 가지며, 작은 모델의 앙상블 평균과 유사한 효과를 통해 일반화 성능을 향상한다.",
    min: 0,
    max: 0.4,
    step: 0.05,
    def: 0.1,
    unit: (v) => `제외 비율 ${(v * 100).toFixed(0)}%`,
    refs: { textbook: "12.2.3 (3) 드롭아웃(그림 12-8)", slides: "과다적합의 해결책 ③ 드롭아웃" },
  },
  {
    key: "aug",
    label: "데이터 증대",
    title: "④ 데이터 증대 data augmentation",
    desc:
      "학습 데이터가 충분하지 못한 경우에도 과다적합이 발생한다. 원래 데이터에 대해 인위적인 변형을 가하여 추가적인 데이터를 생성해서 많은 학습 데이터를 만들어 사용한다. 영상 데이터라면 크기 조정, 회전, 위치 이동, 자르기 등의 연산으로 변형된 이미지를 만든다.",
    min: 0.025,
    max: 0.15,
    step: 0.025,
    def: 0.1,
    unit: (v) => `위치 이동 ±${v.toFixed(3)}`,
    refs: { textbook: "12.2.3 (4) 데이터 증대", slides: "과다적합의 해결책 ④ 데이터 증대" },
  },
];

const W = 440;
const H = 185;
const PAD = { l: 40, r: 12, t: 14, b: 26 };
const Y_MAX = 0.35;

const FW = 270;
const FH = 175;
const FPAD = { l: 26, r: 10, t: 12, b: 20 };

export default function OverfittingLab() {
  const [mode, setMode] = useState<OfMode>("none");
  const [params, setParams] = useState<Record<string, number>>(
    Object.fromEntries(MODES.map((m) => [m.key, m.def])),
  );
  const [res, setRes] = useState<OfRun | null>(null);
  const [table, setTable] = useState<{ key: OfMode; run: OfRun }[] | null>(null);
  const { train } = makeData();
  const def = MODES.find((m) => m.key === mode)!;
  const param = params[mode];

  useEffect(() => {
    setRes(null);
    const id = window.setTimeout(() => setRes(runOverfit(mode, param)), 80);
    return () => window.clearTimeout(id);
  }, [mode, param]);

  useEffect(() => {
    const id = window.setTimeout(
      () => setTable(MODES.map((m) => ({ key: m.key, run: runOverfit(m.key, m.def) }))),
      500,
    );
    return () => window.clearTimeout(id);
  }, []);

  const pxRaw = (e: number) => PAD.l + (e / (OF.epochs - 1)) * (W - PAD.l - PAD.r);
  const pyRaw = (v: number) => H - PAD.b - (Math.min(v, Y_MAX) / Y_MAX) * (H - PAD.t - PAD.b);
  const fx = (x: number) => FPAD.l + ((x + 3) / 6) * (FW - FPAD.l - FPAD.r);
  const fy = (y: number) =>
    FH - FPAD.b - ((Math.max(-2.2, Math.min(2.2, y)) + 2.2) / 4.4) * (FH - FPAD.t - FPAD.b);
  const px = (v: number) => Math.round(pxRaw(v) * 100) / 100;
  const py = (v: number) => Math.round(pyRaw(v) * 100) / 100;

  return (
    <section id="overfitting" className="scroll-mt-32">
      <SectionTitle
        title="과다적합과 네 가지 해결책"
        subtitle="학습 데이터 8개에 잡음을 섞어 일부러 과다적합을 만든 뒤, 네 기법을 차례로 걸어 봅니다"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "12.2.3 과다적합", slides: "(3) 과다적합" }}>
          <Card>
            <CardTitle>무엇이 문제인가</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              과다적합 문제는 <strong>학습 데이터에 포함된 노이즈까지 학습하게 되어 새로운 테스트 데이터에
              대하여 정확도가 떨어지는 현상</strong>으로, 딥러닝에서와 같이 신경망의 복잡도가 높을수록 발생할
              가능성이 커집니다. 가중치의 개수가 많아지면 표현 효율은 향상되지만, 동시에 과다적합이 발생할
              가능성도 높아집니다.
            </p>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "12.2.3 — 네 가지 해결책", slides: "과다적합의 해결책 ①~④" }}>
          <Card>
            <CardTitle>기법을 하나씩 걸어 보기</CardTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              {MODES.map((m) => (
                <Chip key={m.key} active={mode === m.key} onClick={() => setMode(m.key)}>
                  {m.label}
                </Chip>
              ))}
            </div>

            <div className="mb-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <p className="text-[12.5px] font-bold text-gray-800 dark:text-gray-100">{def.title}</p>
              <p className="mt-1 text-[12px] leading-5 text-gray-600 dark:text-gray-300">{def.desc}</p>
              {mode === "reg" && (
                <Formula className="mt-2" note="식 12-5 — λ는 정규항의 영향을 조정하는 사용자 정의 파라미터">
                  E_reg(X; θ) = E_sqr(X; θ) + λ‖θ‖²
                </Formula>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_290px]">
              <Scroller>
                {!res ? (
                  <p className="py-16 text-center text-xs text-gray-400">학습 중…</p>
                ) : (
                  <>
                    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[400px]">
                      <rect
                        x={px(res.best)}
                        y={PAD.t}
                        width={W - PAD.r - px(res.best)}
                        height={H - PAD.t - PAD.b}
                        fill="#fecaca"
                        opacity={0.28}
                      />
                      <text
                        x={(px(res.best) + W - PAD.r) / 2}
                        y={PAD.t + 11}
                        fontSize="9"
                        textAnchor="middle"
                        fill="#dc2626"
                      >
                        과다적합 구간
                      </text>
                      <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="#cbd5e1" />
                      <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="#cbd5e1" />
                      {[0, 0.1, 0.2, 0.3].map((v) => (
                        <g key={v}>
                          <line x1={PAD.l - 3} y1={py(v)} x2={PAD.l} y2={py(v)} stroke="#cbd5e1" />
                          <text x={PAD.l - 5} y={py(v) + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
                            {v.toFixed(1)}
                          </text>
                        </g>
                      ))}
                      <polyline
                        points={res.trainCurve.map((v, i) => `${px(i)},${py(v)}`).join(" ")}
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth={1.6}
                      />
                      <polyline
                        points={res.validCurve.map((v, i) => `${px(i)},${py(v)}`).join(" ")}
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth={1.6}
                        strokeDasharray="5 3"
                      />
                      <line
                        x1={px(res.best)}
                        y1={PAD.t}
                        x2={px(res.best)}
                        y2={H - PAD.b}
                        stroke="#16a34a"
                        strokeWidth={1.5}
                      />
                      <text x={px(res.best)} y={H - 14} fontSize="9" textAnchor="middle" fill="#16a34a">
                        종료 시점 {res.best}
                      </text>
                      <text x={W - PAD.r} y={H - 4} fontSize="9" textAnchor="end" fill="#94a3b8">
                        τ (학습 에포크 수)
                      </text>
                      <text x={PAD.l + 4} y={PAD.t + 9} fontSize="9" fill="#94a3b8">
                        오차
                      </text>
                    </svg>
                    <div className="mt-1 flex flex-wrap gap-3 pl-10 text-[10px]">
                      <span className="flex items-center gap-1 text-sky-600">
                        <span className="inline-block h-0.5 w-4 bg-sky-600" />
                        학습 오차
                      </span>
                      <span className="flex items-center gap-1 text-rose-600">
                        <span className="inline-block h-0.5 w-4 border-t border-dashed border-rose-600" />
                        검증 오차
                      </span>
                    </div>
                  </>
                )}
              </Scroller>

              <div className="space-y-3">
                {def.max > 0 && (
                  <Slider
                    label="기법의 세기"
                    value={param}
                    min={def.min}
                    max={def.max}
                    step={def.step}
                    onChange={(v) => setParams((p) => ({ ...p, [mode]: v }))}
                    display={def.unit(param)}
                  />
                )}
                {res && (
                  <>
                    <Scroller>
                      <svg viewBox={`0 0 ${FW} ${FH}`} className="h-auto w-full min-w-[250px]">
                        <line x1={FPAD.l} y1={fy(0)} x2={FW - FPAD.r} y2={fy(0)} stroke="#e2e8f0" />
                        <polyline
                          points={OF_GRID.map((x) => `${fx(x)},${fy(Math.sin(x))}`).join(" ")}
                          fill="none"
                          stroke="#94a3b8"
                          strokeWidth={1.2}
                          strokeDasharray="4 3"
                        />
                        <polyline
                          points={OF_GRID.map((x, i) => `${fx(x)},${fy(res.fitted[i])}`).join(" ")}
                          fill="none"
                          stroke="#dc2626"
                          strokeWidth={1.4}
                          opacity={0.7}
                        />
                        <polyline
                          points={OF_GRID.map((x, i) => `${fx(x)},${fy(res.fittedBest[i])}`).join(" ")}
                          fill="none"
                          stroke="#16a34a"
                          strokeWidth={2}
                        />
                        {train.map((s, i) => (
                          <circle
                            key={i}
                            cx={fx(s[0] * 3)}
                            cy={fy(s[1])}
                            r={3.4}
                            fill="#ffffff"
                            stroke="#0f172a"
                            strokeWidth={1.4}
                          />
                        ))}
                      </svg>
                    </Scroller>
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      <span className="text-gray-500">— — 참값 sin x</span>
                      <span className="text-green-600">— 종료 시점의 근사</span>
                      <span className="text-rose-600">— 끝까지 학습한 근사</span>
                      <span className="text-gray-700 dark:text-gray-200">○ 학습 데이터 {OF.points}개</span>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-2.5 font-mono text-[10.5px] leading-5 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      <div>검증 오차 최소 = {fmt(res.validCurve[res.best], 4)} (에포크 {res.best})</div>
                      <div>끝까지 학습한 검증 오차 = {fmt(res.validCurve[OF.epochs - 1], 4)}</div>
                      <div>끝까지 학습한 학습 오차 = {fmt(res.trainCurve[OF.epochs - 1], 4)}</div>
                      <div>‖θ‖² = {fmt(res.norm, 1)}</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {table && (
              <Scroller>
                <table className="mt-4 w-full min-w-[520px] text-[11.5px]">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                      <th className="px-2 py-1.5 font-semibold">기법</th>
                      <th className="px-2 py-1.5 font-semibold">세기</th>
                      <th className="px-2 py-1.5 font-semibold">검증 오차 최소</th>
                      <th className="px-2 py-1.5 font-semibold">그때의 에포크</th>
                      <th className="px-2 py-1.5 font-semibold">끝까지 학습한 검증 오차</th>
                      <th className="px-2 py-1.5 font-semibold">‖θ‖²</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.map((row) => {
                      const m = MODES.find((x) => x.key === row.key)!;
                      return (
                        <tr key={row.key} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="px-2 py-1.5 font-semibold">{m.label}</td>
                          <td className="px-2 py-1.5 font-mono text-[10.5px]">{m.unit(m.def)}</td>
                          <td className="px-2 py-1.5 font-mono">{fmt(row.run.validCurve[row.run.best], 4)}</td>
                          <td className="px-2 py-1.5 font-mono">{row.run.best}</td>
                          <td className="px-2 py-1.5 font-mono">
                            {fmt(row.run.validCurve[OF.epochs - 1], 4)}
                          </td>
                          <td className="px-2 py-1.5 font-mono">{fmt(row.run.norm, 1)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Scroller>
            )}

            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              규제를 걸지 않으면 학습 오차는 끝까지 줄지만 검증 오차는 어느 시점부터 다시 커집니다. 그 최소
              지점이 조기 종료의 종료 시점입니다. 정규항을 걸면 ‖θ‖²이 눈에 띄게 작아지고 — 가중치가 작아지므로
              근사 곡선도 단순해집니다. 다만 λ를 계속 키운다고 ‖θ‖²이 끝없이 줄지는 않습니다. λ가 커지면 남은
              가중치들이 오차를 맞추려고 다시 커지는 지점이 있어, 슬라이더를 끝까지 밀면 값이 조금 되오릅니다. 드롭아웃은 매 수정마다 다른 노드가 빠지므로 곡선이 많이 흔들리는 대신
              검증 오차의 최소값을 끌어내립니다. 데이터 증대는 같은 목표값을 조금씩 다른 입력 위치에서 학습시켜
              잡음 하나하나를 외우기 어렵게 만듭니다.
            </p>

            <Hint>
              네 기법은 서로 배타적이지 않습니다. 드롭아웃처럼 학습 곡선이 흔들리는 기법일수록 조기 종료와 함께
              써야 검증 오차가 가장 작은 지점을 붙잡을 수 있습니다.
            </Hint>

            <ComputedNote>
              이 수치는 이 페이지에서 직접 학습시켜 얻은 값입니다. 학습 데이터는 sin 곡선에 ±{OF.noise}의 잡음을
              더한 {OF.points}개, 검증 데이터는 잡음 없는 80개, 은닉 노드 {OF.hidden}개(하이퍼탄젠트), 출력은 선형
              함수, 학습률 {OF.eta}, {OF.epochs} 에포크입니다. 교재·강의록에는 조기 종료의 곡선 그림과 드롭아웃
              개념도만 있고 수치는 제시되지 않습니다.
            </ComputedNote>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
