"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Hint, Scroller, Slider } from "./ui";

const SUB = "₀₁₂₃₄₅₆₇₈₉";
const sub = (n: number) =>
  String(n)
    .split("")
    .map((d) => SUB[Number(d)])
    .join("");

/** 식 12-9 — 순환식을 k번 전개한 모습 */
function expand(t: number, depth: number) {
  let s = depth >= t ? `h${sub(0)}` : `h${sub(t - depth)}`;
  for (let k = depth; k >= 1; k -= 1) {
    s = `f_W(${s}, x${sub(t - k + 1)})`;
  }
  return s;
}

const COL = 84;
const LEFT = 56;
const Y_X = 182;
const Y_H = 112;
const Y_Y = 36;
const R = 15;

export default function RnnRepresentation() {
  const [t, setT] = useState(4);
  const [shareOn, setShareOn] = useState(true);

  const width = LEFT + COL * t + 28;
  const cols = Array.from({ length: t }, (_, i) => LEFT + COL * i);
  const shareStroke = shareOn ? "#ef4444" : "#9ca3af";
  const shareFill = shareOn ? "fill-red-500" : "fill-gray-400";

  return (
    <section id="rnn-representation" className="scroll-mt-32">
      <SectionTitle
        title="RNN의 표현 방법과 계산 과정"
        subtitle="축약된 표현을 시간의 흐름에 따라 옆으로 펼치면 가중치 공유가 눈에 보입니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.4.1 — RNN의 표현 방법(그림 12-20), 식 12-9",
            slides: "RNN의 표현 방법 — 축약된 표현 / 펼친 구조",
          }}
        >
          <Card>
            <CardTitle>축약된 표현을 펼치면</CardTitle>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[150px_minmax(0,1fr)]">
              <div>
                <p className="mb-1 text-center text-[11.5px] font-bold text-gray-600 dark:text-gray-300">
                  (a) 축약 표현
                </p>
                <svg viewBox="0 0 150 200" className="h-auto w-full max-w-[150px]">
                  <line x1={75} y1={160} x2={75} y2={120} stroke="#9ca3af" strokeWidth={1.4} />
                  <line x1={75} y1={90} x2={75} y2={54} stroke="#9ca3af" strokeWidth={1.4} />
                  <path
                    d="M 62 100 C 24 100, 24 60, 62 72"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={2.6}
                    markerEnd="url(#rep-arrow)"
                  />
                  <defs>
                    <marker id="rep-arrow" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                      <path d="M0,0 L6,3 L0,6 z" fill="#ef4444" />
                    </marker>
                  </defs>
                  <circle cx={75} cy={175} r={15} fill="#dcfce7" stroke="#16a34a" strokeWidth={1.5} />
                  <text x={75} y={179} textAnchor="middle" className="fill-gray-700 text-[10px] font-bold">
                    x
                  </text>
                  <circle cx={75} cy={105} r={15} fill="#dbeafe" stroke="#2563eb" strokeWidth={1.5} />
                  <text x={75} y={109} textAnchor="middle" className="fill-gray-700 text-[10px] font-bold">
                    h
                  </text>
                  <circle cx={75} cy={39} r={15} fill="#fef9c3" stroke="#ca8a04" strokeWidth={1.5} />
                  <text x={75} y={43} textAnchor="middle" className="fill-gray-700 text-[10px] font-bold">
                    y
                  </text>
                  <text x={82} y={140} className="fill-gray-400 text-[9px] font-semibold">
                    W_xh
                  </text>
                  <text x={82} y={74} className="fill-gray-400 text-[9px] font-semibold">
                    W_hy
                  </text>
                  <text x={6} y={60} className="fill-red-500 text-[9px] font-bold">
                    W_hh
                  </text>
                </svg>
              </div>

              <div>
                <p className="mb-1 text-center text-[11.5px] font-bold text-gray-600 dark:text-gray-300">
                  (b) 전개된 구조 — 시간의 흐름에 따라 옆으로 펼친 것
                </p>
                <Scroller>
                  <svg
                    viewBox={`0 0 ${width} 210`}
                    className="h-auto w-full"
                    style={{ minWidth: Math.min(width * 1.6, 520) }}
                  >
                    {/* h₀ */}
                    <circle cx={22} cy={Y_H} r={R} fill="#e5e7eb" stroke="#9ca3af" strokeWidth={1.4} />
                    <text x={22} y={Y_H + 4} textAnchor="middle" className="fill-gray-600 text-[9px] font-bold">
                      h{sub(0)}
                    </text>

                    {cols.map((x, i) => (
                      <g key={x}>
                        <line x1={x} y1={Y_X - R} x2={x} y2={Y_H + R} stroke="#9ca3af" strokeWidth={1.3} />
                        <line x1={x} y1={Y_H - R} x2={x} y2={Y_Y + R} stroke="#9ca3af" strokeWidth={1.3} />
                        <line
                          x1={i === 0 ? 22 + R : cols[i - 1] + R}
                          y1={Y_H}
                          x2={x - R}
                          y2={Y_H}
                          stroke={shareStroke}
                          strokeWidth={2.2}
                        />
                        <circle cx={x} cy={Y_X} r={R} fill="#dcfce7" stroke="#16a34a" strokeWidth={1.4} />
                        <text x={x} y={Y_X + 4} textAnchor="middle" className="fill-gray-700 text-[9px] font-bold">
                          x{sub(i + 1)}
                        </text>
                        <motion.circle
                          initial={false}
                          cx={x}
                          cy={Y_H}
                          r={R}
                          fill="#dbeafe"
                          stroke="#2563eb"
                          strokeWidth={1.4}
                        />
                        <text x={x} y={Y_H + 4} textAnchor="middle" className="fill-gray-700 text-[9px] font-bold">
                          h{sub(i + 1)}
                        </text>
                        <circle cx={x} cy={Y_Y} r={R} fill="#fef9c3" stroke="#ca8a04" strokeWidth={1.4} />
                        <text x={x} y={Y_Y + 4} textAnchor="middle" className="fill-gray-700 text-[9px] font-bold">
                          y{sub(i + 1)}
                        </text>
                        {/* 가중치 이름 — 모든 시각에서 같은 값 */}
                        <text
                          x={x + 4}
                          y={(Y_X + Y_H) / 2 + 4}
                          className={`${shareFill} text-[8px] font-bold`}
                        >
                          W_xh
                        </text>
                        <text
                          x={x + 4}
                          y={(Y_H + Y_Y) / 2 + 4}
                          className={`${shareFill} text-[8px] font-bold`}
                        >
                          W_hy
                        </text>
                        <text
                          x={x - COL / 2 - 10}
                          y={Y_H - 7}
                          className={`${shareFill} text-[8px] font-bold`}
                        >
                          W_hh
                        </text>
                      </g>
                    ))}
                    <text x={6} y={202} className="fill-gray-400 text-[9px]">
                      시간 →
                    </text>
                  </svg>
                </Scroller>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                  <Slider
                    label="펼칠 시각의 수 t"
                    value={t}
                    min={2}
                    max={6}
                    step={1}
                    onChange={setT}
                    display={`t = ${t}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShareOn((v) => !v)}
                    aria-pressed={shareOn}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                      shareOn
                        ? "border-red-500 bg-red-500 text-white"
                        : "border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    }`}
                  >
                    공유되는 가중치 강조
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              전개된 그림을 통해 RNN의 각 층은 시간의 흐름에 따라 새로운 입력을 받고 있지만,{" "}
              <strong>실제로는 같은 층이기 때문에 가중치가 공유되고 있음</strong>을 알 수 있습니다.
              축약된 그림을 보면 마치 입력층과 은닉층이 하나의 노드(셀)로 구성된 것처럼 보이지만,
              실제로는 입력층과 은닉층은 다차원 벡터를 처리할 수 있도록 노드의 집합으로
              이루어집니다.
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.4.1 — 식 12-9 순환식의 전개",
            slides: "RNN의 표현 방법 — 펼친 구조",
          }}
        >
          <Card>
            <CardTitle>순환식을 한 줄씩 전개하면</CardTitle>
            <Scroller>
              <div className="min-w-[320px] space-y-1 rounded-lg bg-gray-50 p-3 font-mono text-[11.5px] leading-6 dark:bg-gray-800/60">
                {Array.from({ length: t }, (_, k) => k + 1).map((depth) => (
                  <div key={depth} className="whitespace-nowrap">
                    <span className="mr-2 inline-block w-12 text-gray-400">
                      {depth === 1 ? `h${sub(t)} =` : "="}
                    </span>
                    <span
                      className={
                        depth === t
                          ? "font-bold text-red-500"
                          : "text-gray-700 dark:text-gray-200"
                      }
                    >
                      {expand(t, depth)}
                    </span>
                  </div>
                ))}
              </div>
            </Scroller>
            <div className="mt-2">
              <Hint>
                마지막 줄은 시각 t의 은닉 상태가 결국 h₀부터 x_t까지 <strong>모든 입력</strong>을
                거쳐 만들어졌음을 보여 줍니다. 같은 함수 f_W가 {t}번 겹쳐 적용되었고, 그때마다 같은
                가중치 W가 쓰였습니다.
              </Hint>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.4.1 — RNN의 순차적인 계산 과정(그림 12-21)",
            slides: "RNN의 계산 과정 — 가중치 공유 · 순차적인 계산",
          }}
        >
          <Card>
            <CardTitle>순차적인 계산 — 앞의 결과가 나와야 다음을 계산한다</CardTitle>
            <Scroller>
              <svg viewBox="0 0 440 110" className="h-auto w-full min-w-[400px]">
                {Array.from({ length: 4 }, (_, i) => {
                  const x = 70 + i * 92;
                  return (
                    <g key={x}>
                      <rect
                        x={x - 20}
                        y={44}
                        width={40}
                        height={26}
                        rx={6}
                        fill="#fee2e2"
                        stroke="#ef4444"
                        strokeWidth={1.4}
                      />
                      <text x={x} y={61} textAnchor="middle" className="fill-red-700 text-[10px] font-bold">
                        f_W
                      </text>
                      <line x1={x} y1={92} x2={x} y2={74} stroke="#9ca3af" strokeWidth={1.3} />
                      <text x={x} y={104} textAnchor="middle" className="fill-gray-500 text-[9px] font-semibold">
                        x{sub(i + 1)}
                      </text>
                      <line x1={x} y1={40} x2={x} y2={24} stroke="#9ca3af" strokeWidth={1.3} />
                      <text x={x} y={18} textAnchor="middle" className="fill-gray-500 text-[9px] font-semibold">
                        y{sub(i + 1)}
                      </text>
                      <line
                        x1={x + 20}
                        y1={57}
                        x2={x + 72}
                        y2={57}
                        stroke="#ef4444"
                        strokeWidth={2}
                        markerEnd="url(#seq-arrow)"
                      />
                      <text x={x + 46} y={50} textAnchor="middle" className="fill-red-500 text-[9px] font-bold">
                        h{sub(i + 1)}
                      </text>
                    </g>
                  );
                })}
                <text x={16} y={61} className="fill-gray-500 text-[9px] font-semibold">
                  h₀ →
                </text>
                <defs>
                  <marker id="seq-arrow" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                    <path d="M0,0 L6,3 L0,6 z" fill="#ef4444" />
                  </marker>
                </defs>
              </svg>
            </Scroller>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg bg-red-50/70 px-3 py-2 dark:bg-red-950/30">
                <p className="text-[12px] font-bold text-red-600 dark:text-red-300">가중치 공유</p>
                <p className="mt-0.5 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  네 칸에 그려진 f_W는 모두 같은 가중치 W를 쓰는 같은 함수입니다. 시각이 늘어도
                  학습할 가중치의 수는 늘지 않습니다.
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/60">
                <p className="text-[12px] font-bold text-gray-700 dark:text-gray-200">순차적인 계산</p>
                <p className="mt-0.5 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  h₂를 계산하려면 h₁이 먼저 나와야 합니다. 시각을 건너뛰거나 한꺼번에 계산할 수
                  없습니다.
                </p>
              </div>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
