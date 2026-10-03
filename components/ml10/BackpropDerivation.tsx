"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Formula, Hint, Scroller } from "./ui";

interface Step {
  key: string;
  head: string;
  formula: React.ReactNode;
  note: React.ReactNode;
  body: string;
  /** 그림에서 강조할 구간 */
  phase: "forward" | "output" | "hidden" | "back" | "update";
}

const STEPS: Step[] = [
  {
    key: "E",
    head: "① 현재 입력 x에 대한 오차함수",
    phase: "forward",
    formula: (
      <>
        E(x, θ) = ½(tₖ − yₖ)² = ½(tₖ − fₖ(x, θ))² = ½(tₖ − φᵒ(uₖᵒ))²
      </>
    ),
    note: "식 11-9 — 온라인 학습 모드이므로 데이터 하나, 출력 뉴런 하나를 중심으로 둔다",
    body: "다층 퍼셉트론의 학습에서는 학습 데이터 전체를 한꺼번에 쓰는 대신 한 번에 하나의 데이터만 사용하는 온라인 학습을 수행합니다. 그래서 전체 평균 제곱 오차 대신 데이터 하나에 대한 오차함수를 쓰고, 계산을 간단히 하기 위해 k번째 출력 노드 yₖ 하나를 중심으로 식을 유도합니다.",
  },
  {
    key: "v",
    head: "② 은닉층 → 출력층 가중치 vⱼₖ의 편미분",
    phase: "output",
    formula: (
      <>
        ∂E/∂vⱼₖ = (∂E/∂uₖᵒ)(∂uₖᵒ/∂vⱼₖ) = δₖzⱼ
      </>
    ),
    note: "식 11-10 — δₖ = −φᵒ′(uₖᵒ)(tₖ − yₖ)",
    body: "vⱼₖ는 uₖᵒ를 통해서만 오차에 영향을 주므로 두 조각으로 나눕니다. uₖᵒ = Σⱼ vⱼₖzⱼ + v₀ₖ이므로 ∂uₖᵒ/∂vⱼₖ는 그냥 zⱼ입니다. 남은 ∂E/∂uₖᵒ를 δₖ라 쓰면, δₖ는 목표 출력값과 실제 출력값의 차이 (tₖ − yₖ)에 비례하는 값이 됩니다.",
  },
  {
    key: "phi",
    head: "③ 비례상수 φᵒ′(uₖᵒ)는 활성화 함수에 따라 달라진다",
    phase: "output",
    formula: (
      <>
        시그모이드 φᵒ′(uₖᵒ) = (1 − yₖ)yₖ &nbsp;·&nbsp; 하이퍼탄젠트 φᵒ′(uₖᵒ) = (1 − yₖ)(1 + yₖ)
      </>
    ),
    note: "둘 다 출력값 yₖ만으로 간단히 계산된다",
    body: "출력 뉴런의 활성화 함수를 미분한 값입니다. 시그모이드와 하이퍼탄젠트 모두 미분값이 출력값 yₖ만으로 표현되므로, 전방향 계산에서 이미 구해 둔 yₖ를 그대로 재사용할 수 있습니다.",
  },
  {
    key: "w",
    head: "④ 입력층 → 은닉층 가중치 wᵢⱼ의 편미분",
    phase: "hidden",
    formula: <>∂E/∂wᵢⱼ = (∂E/∂uⱼʰ)(∂uⱼʰ/∂wᵢⱼ) = δⱼxᵢ</>,
    note: "식 11-11 — 모양은 ②와 똑같지만 δⱼ를 아직 모른다",
    body: "wᵢⱼ는 오차함수 계산에 직접 들어가지 않고 출력 노드를 한 번 더 거쳐서 계산되므로 바로 편미분하기 어렵습니다. 그래서 체인 규칙으로 풀어 ∂uⱼʰ/∂wᵢⱼ와 ∂E/∂uⱼʰ로 나눕니다. 앞쪽은 쉽게 xᵢ로 얻어지지만, δⱼ로 쓴 ∂E/∂uⱼʰ의 계산이 조금 복잡합니다.",
  },
  {
    key: "chain",
    head: "⑤ δⱼ도 체인 규칙으로 한 번 더 풀어쓴다",
    phase: "back",
    formula: (
      <>
        δⱼ = ∂E/∂uⱼʰ = Σ<sub>k=1</sub><sup>M</sup> (∂E/∂uₖᵒ)(∂uₖᵒ/∂uⱼʰ)
      </>
    ),
    note: "식 11-12 — ∂E/∂uₖᵒ는 ②에서 구한 δₖ 그 자체",
    body: "uⱼʰ는 출력 뉴런 하나가 아니라 모든 출력 뉴런의 가중합 uₖᵒ(k = 1, …, M)를 계산하는 데 쓰입니다. 따라서 모든 출력 뉴런을 거쳐 가는 경로를 전부 더해야 합니다. 이때 ∂E/∂uₖᵒ는 이미 계산해 둔 δₖ이므로 새로 구할 필요가 없습니다.",
  },
  {
    key: "duo",
    head: "⑥ ∂uₖᵒ/∂uⱼʰ 계산",
    phase: "back",
    formula: (
      <>
        uₖᵒ = Σ<sub>j=1</sub><sup>m</sup> vⱼₖ φʰ(uⱼʰ) + v₀ₖ &nbsp;⟹&nbsp; ∂uₖᵒ/∂uⱼʰ = φʰ′(uⱼʰ) vⱼₖ
      </>
    ),
    note: "식 11-13, 11-14 — zⱼ 자리에 φʰ(uⱼʰ)를 집어넣고 미분",
    body: "uₖᵒ의 식에서 zⱼ를 φʰ(uⱼʰ)로 되돌려 쓰면 uⱼʰ에 대해 바로 미분할 수 있습니다. 합 안에서 uⱼʰ를 포함하는 항은 j번째 항 하나뿐이므로, 미분값은 vⱼₖ에 활성화 함수의 미분값 φʰ′(uⱼʰ)를 곱한 것이 됩니다.",
  },
  {
    key: "dj",
    head: "⑦ 정리 — 오류가 거꾸로 전파된다",
    phase: "back",
    formula: (
      <>
        δⱼ = φʰ′(uⱼʰ) Σ<sub>k=1</sub><sup>M</sup> δₖ vⱼₖ
      </>
    ),
    note: "식 11-15 — 오류 역전파 학습 알고리즘의 핵심",
    body: "∂E/∂uⱼʰ는 결국 j번째 은닉 뉴런이 출력값의 오차에 어느 정도 영향을 미치고 있는지를 뜻합니다. uⱼʰ는 모든 출력 뉴런의 가중합을 계산하는 데 쓰이므로, 각각의 출력 뉴런이 오차에 미치는 영향 δₖ에 가중치 vⱼₖ를 곱한 값을 모두 더해 얻습니다. 결국 출력 뉴런의 오차 δₖ가 은닉 뉴런에 거꾸로 전파되어 오는 형태입니다.",
  },
  {
    key: "upd",
    head: "⑧ 가중치 수정식",
    phase: "update",
    formula: (
      <>
        Δvⱼₖ = −η ∂E/∂vⱼₖ = −η δₖzⱼ &nbsp;·&nbsp; Δwᵢⱼ = −η ∂E/∂wᵢⱼ = −η δⱼxᵢ
      </>
    ),
    note: "기울기 강하 학습법의 일반식 (식 11-8)에 ②와 ④를 대입",
    body: "출력 뉴런으로의 가중치 vⱼₖ는 각 출력 노드의 출력값과 목표 출력값의 차이 δₖ에 비례하는 만큼 수정합니다. 각 은닉 뉴런으로의 가중치 wᵢⱼ는 각 출력 뉴런이 오차에 미치는 영향 δₖ에 가중치 vⱼₖ를 곱해 모두 더한 값에 비례하여 수정합니다.",
  },
];

const PHASE_LABEL: Record<Step["phase"], string> = {
  forward: "전방향 계산",
  output: "출력층 가중치",
  hidden: "은닉층 가중치",
  back: "역방향 전파",
  update: "가중치 수정",
};

export default function BackpropDerivation() {
  const [i, setI] = useState(0);
  const s = STEPS[i];
  const backward = s.phase === "back" || s.phase === "update";
  const outHot = s.phase === "output" || backward;

  return (
    <section id="backprop-derivation" className="scroll-mt-32">
      <SectionTitle
        title="오류 역전파 학습 알고리즘의 유도"
        subtitle="연쇄 규칙으로 한 칸씩 풀어 δₖ와 δⱼ를 얻는 과정"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "11.3.1 다층 퍼셉트론의 학습 — 오류 역전파 유도(식 11-9 ~ 11-15)",
            slides: "오류역전파 학습",
            lecture: "수식을 다 따라가지 못하더라도 '오차가 거꾸로 전파된다'는 개념만은 반드시 가져가라고 거듭 강조",
          }}
        >
          <Card>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-sky-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                {i + 1} / {STEPS.length}
              </span>
              <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700 dark:bg-sky-950/50 dark:text-sky-200">
                {PHASE_LABEL[s.phase]}
              </span>
              <div className="ml-auto flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setI((v) => Math.max(0, v - 1))}
                  disabled={i === 0}
                  className="rounded-lg border border-gray-200 p-1.5 text-gray-500 disabled:opacity-30 dark:border-gray-700"
                  aria-label="이전 단계"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setI((v) => Math.min(STEPS.length - 1, v + 1))}
                  disabled={i === STEPS.length - 1}
                  className="rounded-lg border border-gray-200 p-1.5 text-gray-500 disabled:opacity-30 dark:border-gray-700"
                  aria-label="다음 단계"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <h4 className="mb-2 text-sm font-bold text-gray-800 dark:text-gray-100">{s.head}</h4>
            <Formula note={s.note}>{s.formula}</Formula>
            <p className="mt-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">{s.body}</p>

            <Scroller>
              <svg viewBox="0 0 440 170" className="mt-4 h-auto w-full min-w-[400px]">
                {/* 입력 → 은닉 */}
                {[52, 112].map((iy, a) =>
                  [44, 85, 126].map((hy, b) => (
                    <line
                      key={`w${a}${b}`}
                      x1={66}
                      y1={iy}
                      x2={166}
                      y2={hy}
                      stroke={s.phase === "hidden" ? "#dc2626" : "#cbd5e1"}
                      strokeWidth={s.phase === "hidden" ? 1.6 : 0.8}
                    />
                  )),
                )}
                {/* 은닉 → 출력 */}
                {[44, 85, 126].map((hy, b) =>
                  [60, 110].map((oy, c) => (
                    <line
                      key={`v${b}${c}`}
                      x1={194}
                      y1={hy}
                      x2={294}
                      y2={oy}
                      stroke={outHot ? "#dc2626" : "#cbd5e1"}
                      strokeWidth={outHot ? 1.6 : 0.8}
                    />
                  )),
                )}
                {/* 역방향 화살표 */}
                {backward &&
                  [60, 110].map((oy, c) => (
                    <line
                      key={`b${c}`}
                      x1={288}
                      y1={oy}
                      x2={200}
                      y2={85}
                      stroke="#dc2626"
                      strokeWidth={2.2}
                      strokeDasharray="5 3"
                      markerEnd="url(#bp-arrow)"
                      opacity={0.85}
                    />
                  ))}
                <defs>
                  <marker id="bp-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#dc2626" />
                  </marker>
                </defs>

                {[52, 112].map((iy, a) => (
                  <g key={`xi${a}`}>
                    <circle cx={52} cy={iy} r={14} fill="#f1f5f9" stroke="#64748b" />
                    <text x={52} y={iy + 4} fontSize="10" textAnchor="middle" fill="#334155">
                      x{a === 0 ? "₁" : "ᵢ"}
                    </text>
                  </g>
                ))}
                {[44, 85, 126].map((hy, b) => (
                  <g key={`zj${b}`}>
                    <circle
                      cx={180}
                      cy={hy}
                      r={14}
                      fill={backward && b === 1 ? "#fee2e2" : "#e0f2fe"}
                      stroke={backward && b === 1 ? "#dc2626" : "#0284c7"}
                      strokeWidth={backward && b === 1 ? 2 : 1}
                    />
                    <text x={180} y={hy + 4} fontSize="10" textAnchor="middle" fill="#075985">
                      z{b === 1 ? "ⱼ" : b === 0 ? "₁" : "ₘ"}
                    </text>
                  </g>
                ))}
                {[60, 110].map((oy, c) => (
                  <g key={`yk${c}`}>
                    <circle
                      cx={308}
                      cy={oy}
                      r={14}
                      fill={outHot ? "#fee2e2" : "#bae6fd"}
                      stroke={outHot ? "#dc2626" : "#0369a1"}
                      strokeWidth={outHot ? 2 : 1}
                    />
                    <text x={308} y={oy + 4} fontSize="10" textAnchor="middle" fill="#075985">
                      y{c === 0 ? "₁" : "ₖ"}
                    </text>
                    <text x={348} y={oy + 4} fontSize="10" textAnchor="middle" fill={outHot ? "#dc2626" : "#94a3b8"}>
                      δ{c === 0 ? "₁" : "ₖ"}
                    </text>
                    <text x={392} y={oy + 4} fontSize="10" textAnchor="middle" fill="#64748b">
                      t{c === 0 ? "₁" : "ₖ"}
                    </text>
                  </g>
                ))}
                {backward && (
                  <text x={180} y={154} fontSize="10" textAnchor="middle" fill="#dc2626">
                    δⱼ = φʰ′(uⱼʰ) Σₖ δₖvⱼₖ
                  </text>
                )}
                <text x={52} y={154} fontSize="9" textAnchor="middle" fill="#94a3b8">
                  입력층
                </text>
                <text x={308} y={154} fontSize="9" textAnchor="middle" fill="#94a3b8">
                  출력층
                </text>
              </svg>
            </Scroller>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {STEPS.map((st, k) => (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => setI(k)}
                  className={`h-1.5 flex-1 min-w-[18px] rounded-full ${
                    k === i ? "bg-sky-600" : k < i ? "bg-sky-200 dark:bg-sky-900" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                  aria-label={`${k + 1}단계`}
                />
              ))}
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "11.3.1 — 오류 역전파 계산의 개념도(그림 11-14)",
          }}
        >
          <Card>
            <CardTitle>왜 '역전파'라고 부르는가</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              출력층에서 계산된 오차 δₖ를 은닉층에서 다시 재사용함으로써 중복 계산을 피할 수 있다는 것이
              이 알고리즘의 핵심적인 특징입니다. 단순히 그대로 전달되는 것이 아니라 <strong>가중치 vⱼₖ를 곱한
              뒤 모두 더하는 형태</strong>로 전파됩니다. 은닉층이 여러 개 있더라도 같은 방식으로 오류가 계산되어
              역방향으로 계속 전달됩니다.
            </p>
            <Hint>
              은닉층의 활성화 함수로 비선형함수를 쓰는 이유가 여기서도 보입니다. φʰ′(uⱼʰ)가 전파되는 오류에
              곱해지므로, 이 미분값이 0에 가까워지면 역전파되는 오류도 함께 작아집니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
