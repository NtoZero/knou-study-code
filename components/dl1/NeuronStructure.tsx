"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import {
  Card,
  CardTitle,
  Formula,
  Hint,
  Slider,
  Scroller,
  ComputedNote,
  Tag,
  fmt,
  q12,
} from "@/components/dlShared/ui";

const r2 = (v: number) => Math.round(v * 100) / 100;

export default function NeuronStructure() {
  const [x, setX] = useState<number[]>([1, 0.5, -1]);
  const [w, setW] = useState<number[]>([0.8, -0.6, 0.4]);
  const [b, setB] = useState(0.2);
  const [asWeight, setAsWeight] = useState(false);

  const terms = x.map((xi, i) => q12(xi * w[i]));
  const dot = q12(terms.reduce((a, c) => a + c, 0));
  const u = q12(dot + b);
  const yhat = u >= 0 ? 1 : 0;

  const setAt = (arr: number[], i: number, v: number) => arr.map((o, k) => (k === i ? v : o));

  const yIn = [40, 80, 120];
  const stroke = (wi: number) => Math.max(0.8, Math.min(4.5, Math.abs(wi) * 4));

  return (
    <section id="neuron-structure" className="scroll-mt-32">
      <SectionTitle
        title="뉴런 하나가 하는 일"
        subtitle="가중합을 구하고 활성함수를 거쳐 출력을 만드는, 아주 단순한 처리입니다"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "1. 뉴런의 기본 구조 — 인공 뉴런",
            lecture: "뉴런은 복잡한 계산을 하는 것이 아니라, 가중합을 구해 0을 기준으로 억제하거나 활성화할 뿐",
          }}
        >
          <Card>
            <CardTitle>입력 · 가중치 · 바이어스 · 활성함수</CardTitle>

            <Formula note="뉴런의 출력 — 가중합 u 를 활성함수 φ 에 통과시킨 값">
              u = Σ&nbsp;wᵢ&nbsp;xᵢ + b &nbsp;&nbsp;,&nbsp;&nbsp; ŷ = φ(u)
            </Formula>

            <Scroller>
              <svg viewBox="0 0 400 180" className="mt-3 h-auto w-[400px] min-w-[400px]">
                {/* 입력 */}
                {x.map((xi, i) => (
                  <g key={i}>
                    <text x={22} y={yIn[i] + 4} textAnchor="middle" className="fill-gray-600 text-[11px] dark:fill-gray-300">
                      x{i + 1}
                    </text>
                    <text x={22} y={yIn[i] + 17} textAnchor="middle" className="fill-gray-400 text-[8px]">
                      {fmt(xi, 2)}
                    </text>
                    <line
                      x1={36}
                      y1={yIn[i]}
                      x2={176}
                      y2={80}
                      stroke={w[i] >= 0 ? "#0d9488" : "#f43f5e"}
                      strokeWidth={stroke(w[i])}
                      strokeOpacity={0.8}
                    />
                    <text
                      x={100}
                      y={r2(yIn[i] + ((80 - yIn[i]) * 0.45)) - 5}
                      textAnchor="middle"
                      className="fill-gray-500 text-[9px]"
                    >
                      w{i + 1}={fmt(w[i], 2)}
                    </text>
                  </g>
                ))}

                {/* 바이어스 */}
                <text x={186} y={168} textAnchor="middle" className="fill-gray-500 text-[10px]">
                  1
                </text>
                <line x1={186} y1={158} x2={186} y2={100} className="stroke-amber-500" strokeWidth={1.6} />
                <text x={200} y={134} className="fill-amber-600 text-[10px]">
                  b={fmt(b, 2)}
                </text>

                {/* 합산 · 활성함수 */}
                <circle cx={190} cy={80} r={18} className="fill-gray-100 stroke-gray-400 dark:fill-gray-800" />
                <text x={190} y={86} textAnchor="middle" className="fill-gray-700 text-[14px] dark:fill-gray-200">
                  ∑
                </text>
                <line x1={208} y1={80} x2={248} y2={80} className="stroke-gray-400" strokeWidth={1.4} />
                <text x={228} y={72} textAnchor="middle" className="fill-gray-500 text-[10px]">
                  u={fmt(u, 2)}
                </text>
                <circle cx={266} cy={80} r={18} className="fill-gray-100 stroke-gray-400 dark:fill-gray-800" />
                <text x={266} y={86} textAnchor="middle" className="fill-gray-700 text-[14px] dark:fill-gray-200">
                  φ
                </text>
                <line x1={284} y1={80} x2={330} y2={80} className="stroke-gray-400" strokeWidth={1.4} />
                <polygon points="330,76 340,80 330,84" className="fill-gray-400" />
                <circle cx={364} cy={80} r={16} fill={yhat === 1 ? "#14b8a6" : "#94a3b8"} />
                <text x={364} y={85} textAnchor="middle" className="fill-white text-[12px] font-bold">
                  {yhat}
                </text>
                <text x={364} y={116} textAnchor="middle" className="fill-gray-500 text-[9px]">
                  ŷ
                </text>

                <text x={22} y={16} textAnchor="middle" className="fill-gray-500 text-[9px]">
                  입력 x
                </text>
                <text x={110} y={16} textAnchor="middle" className="fill-gray-500 text-[9px]">
                  가중치 w
                </text>
              </svg>
            </Scroller>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-gray-500">입력 x</p>
                {x.map((xi, i) => (
                  <Slider
                    key={i}
                    label={`x${i + 1}`}
                    value={xi}
                    min={-2}
                    max={2}
                    step={0.1}
                    onChange={(v) => setX(setAt(x, i, r2(v)))}
                    display={fmt(xi, 2)}
                  />
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-gray-500">가중치 w · 바이어스 b</p>
                {w.map((wi, i) => (
                  <Slider
                    key={i}
                    label={`w${i + 1}`}
                    value={wi}
                    min={-2}
                    max={2}
                    step={0.1}
                    onChange={(v) => setW(setAt(w, i, r2(v)))}
                    display={fmt(wi, 2)}
                  />
                ))}
                <Slider
                  label="b (바이어스)"
                  value={b}
                  min={-3}
                  max={3}
                  step={0.1}
                  onChange={(v) => setB(r2(v))}
                  display={fmt(b, 2)}
                />
              </div>
            </div>

            <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
              <p className="font-mono text-[12px] leading-6 text-gray-700 dark:text-gray-200">
                u = {x.map((xi, i) => `(${fmt(xi, 2)})·(${fmt(w[i], 2)})`).join(" + ")} + {fmt(b, 2)}
              </p>
              <p className="mt-1 font-mono text-[12px] leading-6 text-gray-700 dark:text-gray-200">
                &nbsp;&nbsp;= {terms.map((t) => fmt(t, 3)).join(" + ")} + {fmt(b, 2)} ={" "}
                <b>{fmt(u, 3)}</b>
              </p>
              <p className="mt-2 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                u {u >= 0 ? "≥" : "<"} 0 이므로 단위 계단 함수를 쓰면 ŷ = <b>{yhat}</b> —{" "}
                {yhat === 1 ? "뉴런이 활성화되어 출력을 냄" : "출력이 억제됨"}
              </p>
            </div>

            <ComputedNote>
              위 슬라이더의 숫자는 이 페이지에서 정한 예시 값입니다. 강의록에는 특정 수치가 아니라 구조와
              수식만 제시되어 있습니다.
            </ComputedNote>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "1. 뉴런의 기본 구조 — 활성함수(activation function) / 바이어스(bias)",
            lecture: "바이어스는 항상 1인 입력에 b라는 가중치가 곱해지는 것으로 생각해도 된다",
          }}
        >
          <Card>
            <CardTitle>활성함수와 바이어스는 각각 무엇을 맡나</CardTitle>
            <div className="space-y-2">
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="mb-1 flex items-center gap-2 text-[13px] font-bold text-gray-800 dark:text-gray-100">
                  <Tag tone="teal">활성함수 φ(u)</Tag>
                </p>
                <p className="text-[12.5px] leading-6 text-gray-600 dark:text-gray-300">
                  뉴런의 입력 가중합을 출력으로 변환하는 함수. 일반적으로 <b>비선형</b> 특성을 갖는 함수를
                  사용하며, u의 값이 0보다 작으면 출력을 억제하고 0보다 크면 출력을 내도록 설계함.
                </p>
                <Hint>
                  강의에서는 선형 함수를 쓰면 층을 여러 개 쌓아도 한 층으로 축약되어 버려서, 층을 쌓아 얻을
                  이점이 사라진다고 설명했습니다.
                </Hint>
              </div>

              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="mb-1 flex items-center gap-2 text-[13px] font-bold text-gray-800 dark:text-gray-100">
                  <Tag tone="teal">바이어스 b</Tag>
                </p>
                <p className="text-[12.5px] leading-6 text-gray-600 dark:text-gray-300">
                  뉴런이 활성화되는 <b>wᵀx의 레벨을 조정</b>함. 활성함수의 기준점은 u = 0 이지만, b가
                  더해지므로 가중합 wᵀx 가 얼마일 때 활성화될지는 b가 정한다.
                </p>

                <button
                  type="button"
                  onClick={() => setAsWeight(!asWeight)}
                  className="mt-2 rounded-full border border-teal-500 px-3 py-1 text-[11px] font-semibold text-teal-700 dark:text-teal-300"
                >
                  {asWeight ? "원래 식으로 보기" : "‘항상 1인 입력의 가중치’로 보기"}
                </button>

                <div className="mt-2">
                  {asWeight ? (
                    <Formula note="입력이 늘 1인 연결을 하나 더 그려 두면, b도 다른 가중치와 똑같이 다룰 수 있다">
                      u = w₁x₁ + ⋯ + w_d x_d + b·1
                    </Formula>
                  ) : (
                    <Formula note="활성화 여부를 가르는 기준은 u = 0">
                      wᵀx {b >= 0 ? "≥" : ">"} {fmt(-b, 2)} 이면 활성화 (u = wᵀx + {fmt(b, 2)} ≥ 0)
                    </Formula>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
