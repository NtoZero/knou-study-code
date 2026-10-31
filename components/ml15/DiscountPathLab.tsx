"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ConceptRows, Formula, Hint, P, Scroller, Slider, fmtQ } from "./ui";

/**
 * 14.2.1 Q-학습 — 할인된 미래 보상과 더 좋은 경로의 선택 (그림 14-10, 식 14-13 ~ 14-17).
 * 상태 11에서 목표 16까지: 실선 11-15-16, 점선 11-10-14-15-16.
 */

const N = 4;
const TRAPS = new Set([6, 9, 12]);
const SHORT = [11, 15, 16];
const LONG = [11, 10, 14, 15, 16];

function center(s: number): [number, number] {
  const r = Math.floor((s - 1) / N);
  const c = (s - 1) % N;
  return [c * 60 + 30, r * 60 + 30];
}

/** 교재 계산 순서 (γ = 0.9) */
const WALK = [
  {
    cell: 11,
    eq: "식 14-15",
    lines: [
      "Q̂(11, D) ← r + γ max Q̂(15, a′)",
      "= 0 + 0.9 × max{Q̂(15, R), Q̂(15, L), Q̂(15, U), Q̂(15, D)}",
      "= 0 + 0.9 × max{1, 0, 0, 0} = 0 + 0.9 × 1 = 0.9",
    ],
    note: "실선 경로. Q̂(15, R) = 1은 이미 구해져 있다.",
  },
  {
    cell: 14,
    eq: "점선 경로",
    lines: ["Q̂(14, R) = 0 + 0.9 × max{1, 0, 0, 0} = 0.9"],
    note: "점선 경로도 같은 방법으로 15에서 한 칸 거꾸로 온다.",
  },
  {
    cell: 10,
    eq: "식 14-16",
    lines: [
      "Q̂(10, D) ← r + γ max Q̂(14, a′)",
      "= 0 + 0.9 × max{Q̂(14, R), Q̂(14, L), Q̂(14, U), Q̂(14, D)}",
      "= 0 + 0.9 × max{0.9, 0, 0, 0} = 0 + 0.9 × 0.9 = 0.81",
    ],
    note: "한 칸 더 멀어질 때마다 0.9가 한 번 더 곱해진다.",
  },
  {
    cell: 11,
    eq: "식 14-17",
    lines: [
      "Q̂(11, L) ← r + γ max Q̂(10, a′)",
      "= 0 + 0.9 × max{Q̂(10, R), Q̂(10, L), Q̂(10, U), Q̂(10, D)}",
      "= 0 + 0.9 × max{0, 0, 0, 0.81} = 0 + 0.9 × 0.81 = 0.729",
    ],
    note: "상태 11에서 D는 0.9, L은 0.729 — 아래쪽으로 15만 거치는 경로가 더 좋다.",
  },
];

export default function DiscountPathLab() {
  const [gamma, setGamma] = useState(0.9);
  const [step, setStep] = useState(0);

  const qShort = gamma; // Q̂(11, D) = 0 + γ × 1
  const qLong = gamma ** 3; // Q̂(11, L) = γ × γ × γ × 1
  const verdict =
    Math.abs(qShort - qLong) < 1e-12
      ? "같다 — 두 경로를 구분하지 못한다"
      : qShort > qLong
        ? "D(실선)가 더 크다 — 짧은 경로가 더 좋은 것으로 평가된다"
        : "L(점선)이 더 크다";

  const pathD = (p: number[]) => p.map((s, i) => `${i === 0 ? "M" : "L"} ${center(s).join(" ")}`).join(" ");
  const w = WALK[step];

  return (
    <section id="discount" className="scroll-mt-32">
      <SectionTitle
        title="더 좋은 경로에 대한 선택 — 할인된 미래 보상"
        subtitle="해가 둘 이상일 때, 짧은 경로가 더 좋게 평가되도록 만드는 장치"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "14.2.1 Q-학습 — 식 14-13 · 14-14", slides: "더 좋은 경로에 대한 선택 — 할인된 미래 보상", lecture: "직관적으로 빨간(짧은) 경로가 초록 경로보다 좋다고 느끼는데, 갱신 규칙에 γ만 곱해 주면 그 짧은 경로가 더 큰 값을 갖게 된다고 설명" }}>
          <Card>
            <CardTitle>할인된 미래 보상 discounted future reward</CardTitle>
            <Formula note="(식 14-13) 미래 보상에 할인율 γ를 적용한 것 — (식 14-4)의 총할인 보상과 개념적으로 동일">
              Gₜ = Rₜ + γRₜ₊₁ + γ²Rₜ₊₂ + ⋯ + γⁿ⁻ᵗRₙ = Rₜ + γGₜ₊₁
            </Formula>
            <div className="mt-2">
              <Formula note="(식 14-14) 할인율을 적용한 Q-함수의 갱신 규칙 — 알고리즘 ③-4 단계에서 사용">
                Q̂(s, a) = r + γ max_a′ Q̂(s′, a′)
              </Formula>
            </div>
            <div className="mt-3">
              <ConceptRows
                rows={[
                  {
                    k: "직관",
                    v: "Gₜ = Rₜ + γGₜ₊₁ — 지금 받는 보상에, 한 걸음 뒤부터의 수익을 γ만큼 줄여 더한다. 그래서 목표에서 한 칸 멀어질 때마다 γ가 한 번 더 곱해지고, 먼 길은 그만큼 작은 값을 받는다.",
                  },
                  {
                    k: "오답 기준",
                    v: "할인율이 없는 Q̂(s, a) = r + max Q̂(s′, a′)로는 경로 길이와 상관없이 모두 1이 되어 빠른(짧은) 경로를 가려낼 수 없다.",
                  },
                ]}
              />
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "14.2.1 Q-학습 — 그림 14-10", slides: "더 좋은 경로에 대한 선택 — 상태 11에서의 Q-값", lecture: "상태 11에서 아래쪽(0.9)이 왼쪽(0.729)보다 크므로 빨간 경로가 더 좋다고 판정한다고 정리" }}>
          <Card>
            <CardTitle>상태 11에서 목표까지 — 실선과 점선</CardTitle>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[auto_minmax(0,1fr)]">
              <Scroller>
                <svg viewBox="0 0 240 240" width="240" height="240" className="mx-auto" role="img" aria-label="두 경로">
                  {Array.from({ length: 16 }, (_, i) => i + 1).map((s) => {
                    const r = Math.floor((s - 1) / N);
                    const c = (s - 1) % N;
                    return (
                      <g key={s}>
                        <rect
                          x={c * 60}
                          y={r * 60}
                          width="60"
                          height="60"
                          className={
                            TRAPS.has(s)
                              ? "fill-orange-200 stroke-gray-400 dark:fill-orange-900/60"
                              : s === 16
                                ? "fill-yellow-200 stroke-gray-400 dark:fill-yellow-700/60"
                                : s === 1
                                  ? "fill-green-100 stroke-gray-400 dark:fill-green-900/40"
                                  : "fill-white stroke-gray-400 dark:fill-gray-900"
                          }
                        />
                        <text x={c * 60 + 4} y={r * 60 + 12} className="fill-gray-600 text-[10px] font-bold dark:fill-gray-300">
                          {s}
                        </text>
                      </g>
                    );
                  })}
                  <path d={pathD(LONG)} fill="none" className="stroke-emerald-600" strokeWidth="3" strokeDasharray="6 4" />
                  <path d={pathD(SHORT)} fill="none" className="stroke-red-600" strokeWidth="3" />
                  {(
                    [
                      [15, 1, "R"],
                      [11, qShort, "D"],
                      [14, gamma, "R"],
                      [10, gamma ** 2, "D"],
                      [11, qLong, "L"],
                    ] as [number, number, string][]
                  ).map(([s, v, a]) => {
                    const [x, y] = center(s);
                    const dx = a === "L" ? -14 : a === "R" ? 12 : 0;
                    const dy = a === "D" ? 16 : a === "L" ? -10 : -8;
                    return (
                      <g key={`${s}${a}`}>
                        <rect x={x + dx - 17} y={y + dy - 9} width="34" height="14" rx="3"
                          className={a === "D" && s === 11 ? "fill-red-600" : s === 15 ? "fill-gray-700" : "fill-emerald-600"} />
                        <text x={x + dx} y={y + dy + 2} textAnchor="middle" className="fill-white text-[9px] font-bold">
                          {fmtQ(v, 3)}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </Scroller>
              <div className="min-w-0 space-y-3">
                <Slider
                  label="할인율 γ"
                  value={gamma}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={setGamma}
                  display={gamma.toFixed(2)}
                />
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-md bg-red-50 p-2 dark:bg-red-950/40">
                    <p className="text-[10.5px] text-red-700 dark:text-red-300">실선 11 → 15 → 16</p>
                    <p className="font-mono text-[12px] text-gray-700 dark:text-gray-200">Q̂(11, D) = γ</p>
                    <p className="font-mono text-[15px] font-bold">{fmtQ(qShort)}</p>
                  </div>
                  <div className="rounded-md bg-emerald-50 p-2 dark:bg-emerald-950/40">
                    <p className="text-[10.5px] text-emerald-700 dark:text-emerald-300">점선 11 → 10 → 14 → 15 → 16</p>
                    <p className="font-mono text-[12px] text-gray-700 dark:text-gray-200">Q̂(11, L) = γ³</p>
                    <p className="font-mono text-[15px] font-bold">{fmtQ(qLong)}</p>
                  </div>
                </div>
                <motion.p
                  key={verdict}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-md bg-gray-50 p-2 text-[12.5px] font-semibold text-gray-700 dark:bg-gray-800/60 dark:text-gray-200"
                >
                  상태 11에서 비교: {verdict}
                </motion.p>
                <Hint>
                  γ를 1로 올려 보자. 둘 다 1이 되어 구분이 사라진다. γ를 0으로 내리면 이번에는 둘 다 0이
                  되어 역시 구분하지 못한다. 0 &lt; γ &lt; 1일 때만 짧은 쪽이 더 큰 값을 받는다.
                </Hint>
              </div>
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "14.2.1 Q-학습 — 식 14-15 ~ 14-17", slides: "더 좋은 경로에 대한 선택 — 상태 11에서의 Q-값 (γ = 0.9)" }}>
          <Card>
            <CardTitle>교재 계산을 한 줄씩 (γ = 0.9)</CardTitle>
            <div className="mb-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="rounded-md border border-gray-200 p-1 disabled:opacity-30 dark:border-gray-700"
                aria-label="이전 계산"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-[11px] text-gray-500">
                {step + 1} / {WALK.length} · {w.eq}
              </span>
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(WALK.length - 1, s + 1))}
                disabled={step === WALK.length - 1}
                className="rounded-md border border-gray-200 p-1 disabled:opacity-30 dark:border-gray-700"
                aria-label="다음 계산"
              >
                <ChevronRight size={14} />
              </button>
            </div>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-1 rounded-lg bg-cyan-50/60 p-3 dark:bg-cyan-950/30"
            >
              {w.lines.map((l) => (
                <p key={l} className="font-mono text-[12px] text-cyan-900 dark:text-cyan-100">
                  {l}
                </p>
              ))}
              <p className="pt-1 text-[12px] text-gray-600 dark:text-gray-300">{w.note}</p>
            </motion.div>
            <div className="mt-3">
              <P>
                정리하면 상태 11을 기점으로 Q-값은 D 쪽 0.9, L 쪽 0.729가 되고, 상태 11에서 15만 거치도록
                아래쪽으로 이동하는 경로가 더 좋은 것임을 알 수 있다.
              </P>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
