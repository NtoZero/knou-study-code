"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import {
  Card,
  CardTitle,
  Formula,
  Hint,
  Slider,
  ComputedNote,
  Scroller,
  Tag,
  fmt,
  q12,
} from "@/components/dlShared/ui";
import { EPS, gradJ, START } from "@/components/dl5/optimizers";

const ETA = 0.1; // 강의록 AdaGrad·RMSProp 예시의 학습률
const STEPS = 100;

interface Row {
  /** i = 1 성분의 경사 */
  g1: number;
  s1: number;
  /** 그 걸음에 실제로 적용된 학습률 η/√(s₁+ε) */
  lr1: number;
  lr2: number;
}

/** 강의록 예시(η = 0.1, x(0) = [−5 4]ᵀ)를 그대로 돌리며 s와 유효 학습률을 기록 */
function runAccum(kind: "adagrad" | "rmsprop", rho: number): Row[] {
  let x1 = START[0];
  let x2 = START[1];
  let s1 = 0;
  let s2 = 0;
  const rows: Row[] = [];
  for (let t = 1; t <= STEPS; t++) {
    const [g1, g2] = gradJ(x1, x2);
    if (kind === "adagrad") {
      s1 = q12(s1 + g1 * g1);
      s2 = q12(s2 + g2 * g2);
    } else {
      s1 = q12(rho * s1 + (1 - rho) * g1 * g1);
      s2 = q12(rho * s2 + (1 - rho) * g2 * g2);
    }
    const lr1 = q12(ETA / q12(Math.sqrt(s1 + EPS)));
    const lr2 = q12(ETA / q12(Math.sqrt(s2 + EPS)));
    x1 = q12(x1 - lr1 * g1);
    x2 = q12(x2 - lr2 * g2);
    rows.push({ g1, s1, lr1, lr2 });
  }
  return rows;
}

function r2(v: number) {
  return Math.round(v * 100) / 100;
}

export default function AdagradRmsprop() {
  const [rho, setRho] = useState(0.9);
  const [step, setStep] = useState(12);

  const ada = useMemo(() => runAccum("adagrad", rho), [rho]);
  const rms = useMemo(() => runAccum("rmsprop", rho), [rho]);

  const aNow = ada[step - 1];
  const rNow = rms[step - 1];

  // 유효 학습률 곡선 (첫 성분)
  const VIEW_W = 420;
  const VIEW_H = 170;
  const maxLr = 0.12;
  const px = (t: number) => r2(36 + ((t - 1) / (STEPS - 1)) * (VIEW_W - 50));
  const py = (v: number) => r2(14 + (1 - Math.min(v, maxLr) / maxLr) * (VIEW_H - 40));
  const path = (rows: Row[]) =>
    rows.map((r, i) => `${i === 0 ? "M" : "L"}${px(i + 1)},${py(r.lr1)}`).join(" ");

  return (
    <section id="adagrad-rmsprop" className="scroll-mt-32">
      <SectionTitle
        title="AdaGrad와 RMSProp"
        subtitle="학습률을 파라미터마다 다르게, 그리고 너무 작아지지 않게"
      />

      <div className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <Sourced
            className="min-w-0"
            refs={{
              slides: "AdaGrad",
              lecture: "그대로 쓰는 사례는 없음",
            }}
          >
            <Card className="h-full">
              <CardTitle>AdaGrad(Adaptive Gradient)</CardTitle>
              <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
                학습률을 적응적으로 적용하기 위한 최적화 방법. <b>변화가 큰 파라미터의 학습률은 작게</b>, 변화가
                작은 파라미터의 학습률은 크게 함으로써 파라미터가 보다 균형 있게 최적화될 수 있게 함.
              </p>
              <div className="mt-3 space-y-2">
                <Formula>sᵢ(t) = sᵢ(t−1) + {"{"}∇ᵢJ(w(t)){"}"}²</Formula>
                <Formula note="ε: 분모가 0이 되는 것을 막는 아주 작은 값">
                  wᵢ(t+1) = wᵢ(t) − η / √(sᵢ(t)+ε) · ∇ᵢJ(w(t))
                </Formula>
              </div>
              <p className="mt-3 rounded-lg bg-rose-50 px-2.5 py-2 text-[12px] leading-5 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
                sᵢ(t)가 점점 커져 <b>학습률이 매우 작아지는 문제</b>가 있음.
              </p>
            </Card>
          </Sourced>

          <Sourced
            className="min-w-0"
            refs={{
              slides: "RMSProp",
              lecture: "오래된 값은 지수적 소멸",
            }}
          >
            <Card className="h-full">
              <CardTitle>RMSProp(Root Mean Square Propagation)</CardTitle>
              <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
                AdaGrad에서 학습률이 지나치게 작아지는 문제를 방지함. ∇ᵢJ(w(t))의 제곱을 지수적으로 감소시켜
                누적함 — <b>지수 가중 이동평균</b>.
              </p>
              <div className="mt-3 space-y-2">
                <Formula>sᵢ(t) = ρ·sᵢ(t−1) + (1−ρ)·{"{"}∇ᵢJ(w(t)){"}"}²</Formula>
                <Formula note="ρ: 감쇠율">wᵢ(t+1) = wᵢ(t) − η / √(sᵢ(t)+ε) · ∇ᵢJ(w(t))</Formula>
              </div>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11.5px] leading-5 text-gray-100">
{`from tensorflow.keras import optimizers
optimizer = optimizers.RMSprop(0.01, rho=0.9)`}
              </pre>
            </Card>
          </Sourced>
        </div>

        <Sourced
          refs={{
            slides: "Adagrad·RMSProp 예시",
          }}
        >
          <Card>
            <CardTitle>누적값 s와 실제로 적용되는 학습률 — 직접 움직여 보기</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              강의록의 예시(J(x) = x₁² + 2x₂² − x₁x₂, η = 0.1, x(0) = [−5 4]ᵀ)를 그대로 돌리며, 첫 번째 성분의
              누적값 s₁(t)와 그 걸음에 실제로 적용된 학습률 η/√(s₁(t)+ε)를 기록한 것임.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <Slider
                label={<span>걸음 t</span>}
                value={step}
                min={1}
                max={STEPS}
                step={1}
                onChange={setStep}
                display={`${step} / ${STEPS}`}
              />
              <Slider
                label={<span>RMSProp의 감쇠율 ρ</span>}
                value={rho}
                min={0.5}
                max={0.99}
                step={0.01}
                onChange={setRho}
                display={fmt(rho, 2)}
              />
            </div>

            <Scroller>
              <svg
                viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                className="mt-4 h-auto w-full min-w-[360px]"
                role="img"
                aria-label="걸음에 따른 유효 학습률 변화 — AdaGrad는 0으로 내려가고 RMSProp은 일정 수준을 유지"
              >
                <line x1="36" y1={VIEW_H - 26} x2={VIEW_W - 14} y2={VIEW_H - 26} stroke="#cbd5e1" strokeWidth="1" />
                <line x1="36" y1="12" x2="36" y2={VIEW_H - 26} stroke="#cbd5e1" strokeWidth="1" />
                <text x="2" y="18" className="fill-gray-400 text-[9px]">
                  {fmt(maxLr, 2)}
                </text>
                <text x="12" y={VIEW_H - 28} className="fill-gray-400 text-[9px]">
                  0
                </text>
                <text x={VIEW_W - 44} y={VIEW_H - 10} className="fill-gray-400 text-[9px]">
                  걸음 t
                </text>
                <text x="36" y={VIEW_H - 10} className="fill-gray-400 text-[9px]">
                  η/√(s₁+ε)
                </text>

                <path d={path(ada)} fill="none" stroke="#f59e0b" strokeWidth="2" />
                <path d={path(rms)} fill="none" stroke="#10b981" strokeWidth="2" />

                <line
                  x1={px(step)}
                  y1="12"
                  x2={px(step)}
                  y2={VIEW_H - 26}
                  stroke="#8b5cf6"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <circle cx={px(step)} cy={py(aNow.lr1)} r="4" fill="#f59e0b" />
                <circle cx={px(step)} cy={py(rNow.lr1)} r="4" fill="#10b981" />
              </svg>
            </Scroller>

            <div className="mt-2 flex flex-wrap gap-3 text-[11px]">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-5 bg-amber-500" /> AdaGrad
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-5 bg-emerald-500" /> RMSProp (ρ = {fmt(rho, 2)})
              </span>
            </div>

            <Scroller>
              <table className="mt-4 w-full min-w-[420px] border-collapse text-[12px]">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                    <th className="py-1.5 pr-2 font-semibold">t = {step}에서</th>
                    <th className="py-1.5 pr-2 font-semibold">누적값 s₁(t)</th>
                    <th className="py-1.5 pr-2 font-semibold">적용된 학습률 η/√(s₁+ε)</th>
                    <th className="py-1.5 font-semibold">처음(η = 0.1) 대비</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-200">
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 pr-2">
                      <Tag>AdaGrad</Tag>
                    </td>
                    <td className="py-2 pr-2 font-mono">{fmt(aNow.s1, 2)}</td>
                    <td className="py-2 pr-2 font-mono">{fmt(aNow.lr1, 5)}</td>
                    <td className="py-2 font-mono">{fmt((aNow.lr1 / ETA) * 100, 1)}%</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-2">
                      <Tag tone="teal">RMSProp</Tag>
                    </td>
                    <td className="py-2 pr-2 font-mono">{fmt(rNow.s1, 2)}</td>
                    <td className="py-2 pr-2 font-mono">{fmt(rNow.lr1, 5)}</td>
                    <td className="py-2 font-mono">{fmt((rNow.lr1 / ETA) * 100, 1)}%</td>
                  </tr>
                </tbody>
              </table>
            </Scroller>

            <Hint>
              AdaGrad는 경사 제곱을 계속 더하기만 하므로 s가 단조 증가하고, 학습률은 0을 향해 줄어든다. RMSProp은
              이전 s에 ρ를, 새 경사 제곱에 (1−ρ)를 곱해 섞으므로 오래된 값이 지수적으로 사라진다. ρ를 낮추면 최근
              경사의 비중이 커진다.
            </Hint>

            <ComputedNote>
              표와 곡선의 수치는 강의록 예시의 식·설정으로 이 페이지에서 직접 계산한 값임. 강의록에는 이 중간 수치가
              적혀 있지 않음.
            </ComputedNote>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
