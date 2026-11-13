"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Formula, Hint, Chip, Slider, ComputedNote, Scroller, fmt, q12 } from "@/components/dlShared/ui";

type Mode = "l2" | "l1";

/** 규제를 걸기 전의 가중치 — 이 페이지에서 정한 예시 */
const W0 = [1.6, -0.9, 0.35, -0.12, 0.04];

function r2(v: number) {
  return Math.round(v * 100) / 100;
}

/** λ만큼 규제를 걸고 여러 걸음 업데이트했을 때 가중치가 어떻게 줄어드는지 */
function shrink(mode: Mode, lam: number, steps: number): number[] {
  let w = W0.slice();
  for (let t = 0; t < steps; t++) {
    w = w.map((v) => {
      if (mode === "l2") return q12(v * (1 - lam));
      // ℓ1은 크기와 무관하게 일정량씩 줄어들어 작은 가중치가 먼저 0에 닿는다
      const next = Math.abs(v) - lam;
      return q12(next <= 0 ? 0 : Math.sign(v) * next);
    });
  }
  return w;
}

export default function WeightRegularization() {
  const [mode, setMode] = useState<Mode>("l2");
  const [lam, setLam] = useState(0.05);

  const STEPS = 20;
  const w = shrink(mode, lam, STEPS);
  const l1 = q12(w.reduce((a, v) => a + Math.abs(v), 0));
  const l2 = q12(Math.sqrt(w.reduce((a, v) => a + v * v, 0)));
  const zeros = w.filter((v) => v === 0).length;

  const maxBar = 1.8;

  return (
    <section id="weight-regularization" className="scroll-mt-32">
      <SectionTitle
        title="가중치의 규제"
        subtitle="가중치가 큰 값을 갖지 못하게 눌러 모델의 복잡도를 제한한다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            slides: "가중치 감쇠(weight decay)",
            lecture: "출력이 불안정하게 커짐",
          }}
        >
          <Card>
            <CardTitle>가중치 감쇠(weight decay)</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              신경망의 가중치가 작은 값을 갖도록 억제함으로써 네트워크의 복잡도에 제한을 가하는 것.
            </p>
            <div className="mt-3">
              <Formula note="갱신 때마다 w에 (1−λ)를 곱해 조금씩 줄인다">
                w(t+1) = (1−λ)·w(t) − η∇J(w(t))
              </Formula>
            </div>
            <p className="mt-3 rounded-lg bg-violet-50 px-3 py-2 text-[12.5px] leading-6 text-violet-900 dark:bg-violet-950/40 dark:text-violet-100">
              <b>AdamW</b>: 가중치 감쇠를 포함하는 Adam 최적화의 변형.
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "ℓ₁ 규제 및 ℓ₂ 규제",
            lecture: "SGD에서는 가중치 감쇠와 동등",
          }}
        >
          <Card>
            <CardTitle>ℓ₁ 규제 및 ℓ₂ 규제</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              최적화를 위한 목적함수에 손실함수와 더불어 가중치 <b>w</b>의 크기에 따른 불이익(penalty) 항을 추가하는
              규제 방법. w의 크기가 크면 불이익 항의 값이 커지고, 목적함수의 값이 커지므로 <b>w의 크기가
              작아지도록</b> 최적화가 진행됨.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Chip active={mode === "l2"} onClick={() => setMode("l2")}>
                ℓ₂ 규제
              </Chip>
              <Chip active={mode === "l1"} onClick={() => setMode("l1")}>
                ℓ₁ 규제
              </Chip>
            </div>

            <div className="mt-3 space-y-2">
              {mode === "l2" ? (
                <>
                  <Formula note="E(w): 손실함수">J(w) = (1/N_B)·Σ Eᵢ(w) + λ‖w‖₂²</Formula>
                  <Formula>‖w‖₂ = √(w₁² + w₂² + ⋯ + w_d²)</Formula>
                </>
              ) : (
                <>
                  <Formula note="E(w): 손실함수">J(w) = (1/N_B)·Σ Eᵢ(w) + λ‖w‖₁</Formula>
                  <Formula>‖w‖₁ = |w₁| + |w₂| + ⋯ + |w_d|</Formula>
                </>
              )}
            </div>

            <div className="mt-4">
              <Slider
                label={<span>규제 계수 λ</span>}
                value={lam}
                min={0}
                max={0.2}
                step={0.005}
                onChange={setLam}
                display={fmt(lam, 3)}
              />
            </div>

            <Scroller>
              <div className="mt-3 min-w-[320px] space-y-1.5">
                {W0.map((orig, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-8 shrink-0 text-right font-mono text-[11px] text-gray-500">w{i + 1}</span>
                    <div className="relative h-5 flex-1 rounded bg-gray-100 dark:bg-gray-800">
                      <div
                        className="absolute top-0 h-5 rounded bg-gray-300 dark:bg-gray-700"
                        style={{
                          left: "50%",
                          width: `${r2((Math.abs(orig) / maxBar) * 50)}%`,
                          transform: orig < 0 ? "translateX(-100%)" : undefined,
                        }}
                      />
                      <div
                        className={`absolute top-0 h-5 rounded transition-all ${
                          w[i] === 0 ? "bg-rose-400" : "bg-violet-500"
                        }`}
                        style={{
                          left: "50%",
                          width: `${r2((Math.abs(w[i]) / maxBar) * 50)}%`,
                          transform: w[i] < 0 ? "translateX(-100%)" : undefined,
                        }}
                      />
                      <div className="absolute left-1/2 top-0 h-5 w-px bg-gray-400" />
                    </div>
                    <span className="w-28 shrink-0 font-mono text-[11px] text-gray-600 dark:text-gray-300">
                      {fmt(orig, 2)} → {fmt(w[i], 3)}
                    </span>
                  </div>
                ))}
              </div>
            </Scroller>

            <div className="mt-3 flex flex-wrap gap-2 text-[11.5px]">
              <span className="rounded-full bg-gray-100 px-2.5 py-1 font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                ‖w‖₁ = {fmt(l1, 3)}
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                ‖w‖₂ = {fmt(l2, 3)}
              </span>
              <span className="rounded-full bg-rose-50 px-2.5 py-1 font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-200">
                0이 된 가중치 {zeros}개
              </span>
            </div>

            <Hint>
              {mode === "l2"
                ? "ℓ₂는 크기에 비례해 줄이므로 큰 가중치부터 많이 깎이고, 작은 가중치는 좀처럼 0이 되지 않는다. 기본적인 SGD를 사용하는 경우 ℓ₂ 규제는 가중치 감쇠와 동등하나, RMSProp·Adam 등에서는 ℓ₂ 규제와 가중치 감쇠가 다르다."
                : "ℓ₁은 크기와 무관하게 일정량씩 줄이므로 작은 가중치가 먼저 0에 닿는다. 영향이 작은 특징을 아예 제거하는 성질이 여기서 나온다."}
            </Hint>

            <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11.5px] leading-5 text-gray-100">
{`from tensorflow.keras import layers, regularizers
d_layer = layers.Dense(3, activation='relu',
                       kernel_regularizer=regularizers.L2(0.01))`}
            </pre>

            <ComputedNote>
              막대의 가중치 값·걸음 수({STEPS}회)는 두 규제의 성질 차이를 보여 주기 위해 이 페이지에서 정한
              예시임. 강의록에는 이런 수치 예가 없음.
            </ComputedNote>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
