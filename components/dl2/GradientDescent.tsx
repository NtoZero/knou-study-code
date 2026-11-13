"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Scroller, ComputedNote, fmt, q12 } from "@/components/dlShared/ui";
import { F, Slider2, Chip2, Cell, r2, sig } from "@/components/dl2/ui2";

/** 이 페이지에서 정한 예시 손실면 — E(w₁, w₂) = w₁² + 4w₂² */
const E = (a: number, b: number) => q12(a * a + 4 * b * b);
const GRAD = (a: number, b: number) => [q12(2 * a), q12(8 * b)];
const START: [number, number] = [-1.5, 1.0];

function path(eta: number, steps: number) {
  const pts: [number, number][] = [[q12(START[0]), q12(START[1])]];
  let [a, b] = pts[0];
  for (let i = 0; i < steps; i++) {
    const [ga, gb] = GRAD(a, b);
    a = q12(a - eta * ga);
    b = q12(b - eta * gb);
    if (!Number.isFinite(a) || !Number.isFinite(b) || Math.abs(a) > 8 || Math.abs(b) > 8) {
      pts.push([q12(Math.max(-8, Math.min(8, a))), q12(Math.max(-8, Math.min(8, b)))]);
      break;
    }
    pts.push([a, b]);
  }
  return pts;
}

export default function GradientDescent() {
  const [eta, setEta] = useState(0.1);
  const [steps, setSteps] = useState(8);
  const [act, setAct] = useState<"sigmoid" | "step">("sigmoid");
  const [u, setU] = useState(1);

  const pts = path(eta, steps);
  const last = pts[pts.length - 1];
  const diverged = Math.abs(last[0]) > 4 || Math.abs(last[1]) > 4;

  // 손실면 그림 좌표 — w ∈ [−2, 2] 을 0..200 으로
  const SX = (v: number) => r2(((v + 2) / 4) * 200);
  const SY = (v: number) => r2(200 - ((v + 2) / 4) * 200);

  // 활성함수 그림
  const phi = sig(u);
  const dphi = q12(phi * (1 - phi));
  const AX = (v: number) => r2(((v + 6) / 12) * 200);
  const AY = (v: number) => r2(110 - v * 90);
  const curve = Array.from({ length: 61 }, (_, i) => {
    const x = q12(-6 + i * 0.2);
    const yv = act === "sigmoid" ? sig(x) : x >= 0 ? 1 : 0;
    return `${AX(x)},${AY(yv)}`;
  }).join(" ");
  const dcurve = Array.from({ length: 61 }, (_, i) => {
    const x = q12(-6 + i * 0.2);
    const s = sig(x);
    return `${AX(x)},${AY(q12(s * (1 - s)))}`;
  }).join(" ");

  return (
    <section id="gradient-descent" className="scroll-mt-32">
      <SectionTitle
        title="무엇을 줄이고, 어떻게 줄이는가"
        subtitle="손실함수를 정하고, 그 기울기의 음의 방향으로 파라미터를 옮깁니다"
      />

      <Sourced
        refs={{
          slides: "2. 다층 퍼셉트론의 학습 — 경사 하강법을 이용한 파라미터 최적화",
          lecture: "편미분을 구하는 게 필요한데, 손실함수를 직접 미분하기는 만만치 않다",
        }}
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <Card className="min-w-0">
            <CardTitle>손실함수와 갱신 규칙</CardTitle>
            <div className="space-y-2">
              <F note="출력층 N개 출력과 레이블의 오차 제곱합의 절반">
                E(ŷ, y) = ½ Σ<sub>k=1</sub><sup>N</sup> (ŷ<sub>k</sub> − y<sub>k</sub>)²
              </F>
              <F note="∇E의 음의 방향으로 파라미터를 업데이트함">
                w₁ ← w₁ − η ∂E/∂w₁ , w₂ ← w₂ − η ∂E/∂w₂
              </F>
            </div>
            <Hint>
              손실함수는 모델이 얼마나 예측을 잘하고 있는지 평가하는 함수이고, 학습은 이 값을
              최소화하는 파라미터를 찾는 최적화입니다. η는 학습률입니다.
            </Hint>

            <div className="mt-4 space-y-2.5">
              <Slider2
                label="학습률 η"
                value={eta}
                min={0.02}
                max={0.3}
                step={0.01}
                onChange={setEta}
                display={fmt(eta, 2)}
              />
              <Slider2
                label="걸음 수"
                value={steps}
                min={0}
                max={25}
                step={1}
                onChange={setSteps}
                display={`${steps}걸음`}
              />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1.5">
              <Cell label="w₁" value={fmt(last[0], 3)} highlight />
              <Cell label="w₂" value={fmt(last[1], 3)} highlight />
              <Cell
                label="손실 E"
                value={fmt(E(last[0], last[1]), 4)}
                highlight={!diverged}
                tone={diverged ? "rose" : "indigo"}
              />
            </div>
            {diverged && (
              <p className="mt-2 rounded-lg bg-rose-50 px-2.5 py-1.5 text-[11px] leading-5 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                학습률이 커서 목표를 지나치며 값이 튕겨 나가고 있습니다.
              </p>
            )}
            <ComputedNote>
              이 손실면 E = w₁² + 4w₂² 과 시작점은 경사 하강의 움직임을 보여주려고 이 페이지에서
              정한 예시입니다. 강의록에는 등고선 그림과 갱신 식만 나옵니다.
            </ComputedNote>
          </Card>

          <Card className="min-w-0">
            <CardTitle>등고선 위를 내려가는 경로</CardTitle>
            <Scroller>
              <svg viewBox="0 0 215 215" className="h-auto w-full min-w-[230px]" role="img">
                <title>손실함수 등고선 위에서 경사 하강법이 그리는 경로</title>
                <rect
                  x="0"
                  y="0"
                  width="200"
                  height="200"
                  rx="6"
                  className="fill-emerald-50 dark:fill-emerald-950/30"
                />
                {[3.2, 2.2, 1.4, 0.8, 0.35, 0.1].map((lv, i) => (
                  <ellipse
                    key={lv}
                    cx={SX(0)}
                    cy={SY(0)}
                    rx={r2((Math.sqrt(lv) / 4) * 200)}
                    ry={r2((Math.sqrt(lv / 4) / 4) * 200)}
                    fill="none"
                    strokeWidth="1"
                    className="stroke-emerald-400/70 dark:stroke-emerald-700"
                    opacity={0.4 + i * 0.08}
                  />
                ))}
                <polyline
                  points={pts.map(([a, b]) => `${SX(a)},${SY(b)}`).join(" ")}
                  fill="none"
                  strokeWidth="1.8"
                  className="stroke-indigo-500"
                />
                {pts.map(([a, b], i) => (
                  <circle
                    key={i}
                    cx={SX(a)}
                    cy={SY(b)}
                    r={i === pts.length - 1 ? 4 : 2.2}
                    className={i === pts.length - 1 ? "fill-indigo-600" : "fill-indigo-400"}
                  />
                ))}
                <circle cx={SX(0)} cy={SY(0)} r="3.2" className="fill-rose-500" />
                <text x={SX(0) + 6} y={SY(0) - 5} className="fill-rose-500 text-[9px] font-bold">
                  목표
                </text>
                <text x="4" y="211" className="fill-gray-500 text-[9px]">
                  w₁ →
                </text>
                <text x="150" y="211" className="fill-gray-500 text-[9px]">
                  ↑ w₂
                </text>
              </svg>
            </Scroller>
            <Hint>학습률을 키우면 빨리 내려가지만, 너무 키우면 목표를 지나쳐 튕깁니다.</Hint>
          </Card>
        </div>
      </Sourced>

      <Sourced
        className="mt-4"
        refs={{
          slides: "2. 다층 퍼셉트론의 학습 — 활성함수가 미분 가능해야 함 / 시그모이드 함수는 u의 전 범위에서 미분 가능함",
          lecture: "계단 함수는 미분이 0이거나 구할 수 없어 경사 하강법을 적용할 수 없다",
        }}
      >
        <Card>
          <CardTitle>그래서 활성함수가 미분 가능해야 한다</CardTitle>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap gap-2">
                <Chip2 active={act === "sigmoid"} onClick={() => setAct("sigmoid")}>
                  시그모이드
                </Chip2>
                <Chip2 active={act === "step"} onClick={() => setAct("step")}>
                  단위 계단 함수
                </Chip2>
              </div>
              <div className="space-y-2">
                <F>φ(u) = 1 / (1 + e⁻ᵘ)</F>
                <F note="시그모이드의 미분은 자기 출력만으로 구해진다">
                  dφ(u)/du = φ(u)&#123;1 − φ(u)&#125;
                </F>
              </div>
              <Slider2
                label="u"
                value={u}
                min={-6}
                max={6}
                step={0.1}
                onChange={setU}
                display={fmt(u, 1)}
              />
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <Cell
                  label="φ(u)"
                  value={act === "sigmoid" ? fmt(phi, 4) : u >= 0 ? "1" : "0"}
                  highlight
                />
                <Cell
                  label="dφ/du"
                  value={act === "sigmoid" ? fmt(dphi, 4) : u === 0 ? "정의 안 됨" : "0"}
                  highlight={act === "sigmoid"}
                  tone={act === "sigmoid" ? "indigo" : "rose"}
                />
              </div>
              {act === "step" && (
                <p className="mt-2 rounded-lg bg-rose-50 px-2.5 py-1.5 text-[11px] leading-5 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                  기울기가 0이거나 구할 수 없으니, 경사 하강법으로 옮길 방향을 알 수 없습니다.
                </p>
              )}
            </div>

            <Scroller>
              <svg viewBox="0 0 215 140" className="h-auto w-full min-w-[230px]" role="img">
                <title>선택한 활성함수의 곡선과 시그모이드의 미분 곡선</title>
                <line x1="0" y1={AY(0)} x2="200" y2={AY(0)} className="stroke-gray-300" />
                <line x1={AX(0)} y1="10" x2={AX(0)} y2="125" className="stroke-gray-300" />
                <polyline points={curve} fill="none" strokeWidth="2" className="stroke-indigo-500" />
                {act === "sigmoid" && (
                  <polyline
                    points={dcurve}
                    fill="none"
                    strokeWidth="1.6"
                    strokeDasharray="4 3"
                    className="stroke-rose-500"
                  />
                )}
                <line
                  x1={AX(u)}
                  y1="10"
                  x2={AX(u)}
                  y2="125"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  className="stroke-gray-400"
                />
                <circle
                  cx={AX(u)}
                  cy={AY(act === "sigmoid" ? phi : u >= 0 ? 1 : 0)}
                  r="4"
                  className="fill-indigo-600"
                />
                {act === "sigmoid" && (
                  <circle cx={AX(u)} cy={AY(dphi)} r="3.5" className="fill-rose-500" />
                )}
                <text x="4" y="22" className="fill-indigo-500 text-[9px] font-bold">
                  φ(u)
                </text>
                {act === "sigmoid" && (
                  <text x="4" y="34" className="fill-rose-500 text-[9px] font-bold">
                    dφ/du
                  </text>
                )}
                <text x="178" y={AY(0) + 12} className="fill-gray-500 text-[9px]">
                  u
                </text>
              </svg>
            </Scroller>
          </div>
        </Card>
      </Sourced>
    </section>
  );
}
