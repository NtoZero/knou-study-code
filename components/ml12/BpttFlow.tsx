"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Formula, Hint, Scroller, Slider } from "./ui";

const SUB = "₀₁₂₃₄₅₆₇₈₉";
const sub = (n: number) =>
  String(n)
    .split("")
    .map((d) => SUB[Number(d)])
    .join("");

const COL = 76;
const LEFT = 48;
const R = 13;

export default function BpttFlow() {
  const [t, setT] = useState(5);
  const width = LEFT + COL * (t - 1) + 40;
  const yX = 196;
  const yH = 132;
  const yHat = 74;
  const yL = 28;

  /** 식 12-13 — 시점 t의 손실이 시점 1까지 거슬러 가는 연쇄법칙 */
  const chain = [
    "∂L/∂h₁",
    `(∂L/∂y${sub(t)}) (∂y${sub(t)}/∂h₁)`,
    `(∂L/∂y${sub(t)}) (∂y${sub(t)}/∂h${sub(t)}) (∂h${sub(t)}/∂h${sub(t - 1)}) ⋯ (∂h₂/∂h₁)`,
  ];

  return (
    <section id="bptt" className="scroll-mt-32">
      <SectionTitle
        title="RNN의 학습 — 시간 역전파(BPTT)"
        subtitle="매 시각의 손실을 더하고, 그 기울기를 시간을 거슬러 전달합니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.4.2 RNN 학습 — 지도학습",
            slides: "RNN 학습 — 학습 데이터집합",
          }}
        >
          <Card>
            <CardTitle>RNN은 지도학습 모델</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              RNN은 시간 순서대로 주어지는 학습 데이터 집합 D = {"{"}(x_i, y_i){"}"} (i = 1, ⋯, N)을
              사용하여 지도학습을 수행하는 모델입니다. 즉, 입력 데이터와 해당 입력에 대한{" "}
              <strong>목표 출력값이 함께 주어집니다</strong>.
            </p>
            <div className="mt-2">
              <Hint>
                RNN이 실제로 계산될 때는 한 번에 하나씩 시간순으로 순차적으로 처리하기보다,{" "}
                <strong>일정 구간을 정하여 펼친 상태의 네트워크를 구성하여 계산</strong>합니다. 아래
                그림에서 슬라이더로 조절하는 것이 바로 그 구간의 길이입니다.
              </Hint>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.4.2 — RNN에서의 손실함수(그림 12-25), 식 12-12",
            slides: "RNN 학습 — 손실함수 · 시간 역전파 학습 알고리즘",
          }}
        >
          <Card>
            <CardTitle>매 순간의 손실을 모두 더한 것이 전체 손실</CardTitle>
            <div className="mb-3">
              <Slider
                label="펼친 구간의 길이 t"
                value={t}
                min={3}
                max={7}
                step={1}
                onChange={setT}
                display={`t = ${t}`}
              />
            </div>

            <Scroller>
              <svg viewBox={`0 0 ${width} 220`} className="h-auto w-full" style={{ minWidth: 430 }}>
                {/* 초기 상태 */}
                <circle cx={16} cy={yH} r={11} className="fill-gray-200 stroke-gray-400 dark:fill-gray-700" strokeWidth={1.3} />
                <text x={16} y={yH + 4} textAnchor="middle" className="fill-gray-600 text-[8px] font-bold">
                  h₀
                </text>

                {Array.from({ length: t }, (_, i) => {
                  const x = LEFT + i * COL;
                  const last = i === t - 1;
                  return (
                    <g key={i}>
                      {/* 전방향 */}
                      <line
                        x1={i === 0 ? 27 : x - COL + R}
                        y1={yH}
                        x2={x - R}
                        y2={yH}
                        stroke="#6b7280"
                        strokeWidth={1.6}
                        markerEnd="url(#bptt-fwd)"
                      />
                      {/* 역전파 신호 */}
                      <line
                        x1={i === 0 ? 27 : x - COL + R}
                        y1={yH + 15}
                        x2={x - R}
                        y2={yH + 15}
                        stroke="#ef4444"
                        strokeWidth={1.8}
                        strokeDasharray="4 3"
                        markerStart="url(#bptt-back)"
                      />
                      <line x1={x} y1={yX - R} x2={x} y2={yH + R} stroke="#6b7280" strokeWidth={1.4} />
                      <line x1={x} y1={yH - R} x2={x} y2={yHat + R} stroke="#6b7280" strokeWidth={1.4} />
                      <line
                        x1={x}
                        y1={yHat - R}
                        x2={x}
                        y2={yL + 12}
                        stroke="#ef4444"
                        strokeWidth={1.6}
                        strokeDasharray="4 3"
                        markerEnd="url(#bptt-back-end)"
                      />

                      <circle cx={x} cy={yX} r={R} fill="#dcfce7" stroke="#16a34a" strokeWidth={1.4} />
                      <text x={x} y={yX + 4} textAnchor="middle" className="fill-gray-700 text-[8.5px] font-bold">
                        x{sub(i + 1)}
                      </text>

                      <rect
                        x={x - 20}
                        y={yH - 13}
                        width={40}
                        height={26}
                        rx={6}
                        fill="#fee2e2"
                        stroke="#ef4444"
                        strokeWidth={1.3}
                      />
                      <text x={x} y={yH + 4} textAnchor="middle" className="fill-red-700 text-[8.5px] font-bold">
                        tanh
                      </text>

                      <circle cx={x} cy={yHat} r={R} fill="#fef9c3" stroke="#ca8a04" strokeWidth={1.4} />
                      <text x={x} y={yHat + 4} textAnchor="middle" className="fill-gray-700 text-[8.5px] font-bold">
                        ŷ{sub(i + 1)}
                      </text>

                      <rect
                        x={x - 15}
                        y={yL - 11}
                        width={30}
                        height={22}
                        rx={5}
                        className="fill-white stroke-gray-400 dark:fill-gray-900"
                        strokeWidth={1.3}
                      />
                      <text x={x} y={yL + 4} textAnchor="middle" className="fill-gray-700 text-[9px] font-bold dark:fill-gray-200">
                        L{sub(i + 1)}
                      </text>
                      {last && (
                        <text x={x + 22} y={yL + 4} className="fill-red-500 text-[9px] font-bold">
                          ← 여기서 시작
                        </text>
                      )}
                    </g>
                  );
                })}

                <text x={4} y={yH + 32} className="fill-red-500 text-[8.5px] font-bold">
                  역전파 신호
                </text>
                <text x={4} y={yX + 4} className="fill-gray-400 text-[8.5px]">
                  입력
                </text>

                <defs>
                  <marker id="bptt-fwd" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                    <path d="M0,0 L6,3 L0,6 z" fill="#6b7280" />
                  </marker>
                  <marker id="bptt-back" markerWidth={6} markerHeight={6} refX={1} refY={3} orient="auto">
                    <path d="M6,0 L0,3 L6,6 z" fill="#ef4444" />
                  </marker>
                  <marker id="bptt-back-end" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                    <path d="M6,0 L0,3 L6,6 z" fill="#ef4444" />
                  </marker>
                </defs>
              </svg>
            </Scroller>

            <div className="mt-3 space-y-2">
              <Formula note="식 12-12 — 각 시간의 손실을 모두 더한 것">
                L(W) = Σ(i = 1 … {t}) L_i(W)
              </Formula>
              <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                L_i(W)는 시간 i에서 실제 출력값 ŷ_i와 목표 출력값 y_i의 오류를 평가하는 함수로,
                이런 손실함수로는 <strong>평균 제곱 오차, 크로스 엔트로피(교차 엔트로피), 로그
                우도</strong> 등이 사용됩니다. RNN의 학습은 손실함수 L(W)를 최소로 하는 최적의
                매개변수 W를 찾는 것입니다.
              </p>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.4.2 — 시간 역전파(BPTT) 학습 알고리즘, 식 12-13",
            slides: "RNN 학습 — BPTT: Backpropagation Through Time",
          }}
        >
          <Card>
            <CardTitle>왜 오류 역전파를 그대로 쓸 수 없는가</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              RNN은 <strong>시간성 정보를 가지므로</strong> MLP에 적용되었던 오류 역전파 학습
              알고리즘을 그대로 적용할 수 없고, 이를 개조한{" "}
              <strong>시간 역전파(Backpropagation Through Time, BPTT) 학습 알고리즘</strong>이
              사용됩니다.
            </p>
            <div className="mt-3 space-y-1">
              <p className="text-[11px] font-semibold text-gray-500">
                시점 i = t에서 얻어진 손실에 대해 시점 i = 1까지 역전파되는 기울기 (식 12-13)
              </p>
              <Scroller>
                <div className="min-w-[340px] space-y-1 rounded-lg bg-gray-50 p-3 font-mono text-[11.5px] leading-6 dark:bg-gray-800/60">
                  {chain.map((line, i) => (
                    <div key={line} className="whitespace-nowrap">
                      <span className="mr-2 inline-block w-12 text-gray-400">
                        {i === 0 ? "" : "="}
                      </span>
                      <span
                        className={
                          i === chain.length - 1
                            ? "font-bold text-red-500"
                            : "text-gray-700 dark:text-gray-200"
                        }
                      >
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
              </Scroller>
            </div>
            <div className="mt-3">
              <Hint>
                마지막 줄에서 <strong>∂h_k/∂h_(k−1) 꼴의 항이 {t - 1}개</strong> 연달아 곱해지고
                있습니다. 펼친 구간 t를 늘리면 곱해지는 항의 개수가 그대로 늘어납니다. 다음 절에서
                이 곱이 일으키는 문제를 직접 계산해 봅니다.
              </Hint>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
