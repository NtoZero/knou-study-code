"use client";

import { useState } from "react";
import { Play, RotateCcw, ChevronRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Formula, Hint, Scroller, Tag } from "@/components/dlShared/ui";

/** 강의록 그림과 같은 층 구성: 입력층 + 1~4층 + 5층(출력층) */
const layers = [
  { name: "입력층", n: 9 },
  { name: "1층", n: 8 },
  { name: "2층", n: 8 },
  { name: "3층", n: 8 },
  { name: "4층", n: 8 },
  { name: "5층(출력층)", n: 5 },
];

const r2 = (v: number) => Math.round(v * 100) / 100;

const colX = (i: number) => 34 + i * 64;
const nodeY = (n: number, k: number) => r2(22 + ((160 - 22) * k) / Math.max(1, n - 1));

export default function FeedforwardNetwork() {
  const [reached, setReached] = useState(0);

  return (
    <section id="feedforward-network" className="scroll-mt-32">
      <SectionTitle
        title="피드포워드 신경망과 단층 퍼셉트론"
        subtitle="신호가 입력층에서 출력층 쪽으로만 흐르는 구조를 확인합니다"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "1. 피드포워드 신경망 — 입력층에서 출력층 방향으로 뉴런 층의 연결이 이루어지는 구조",
            lecture: "뉴런의 출력이 다시 되먹임되는 구조는 리커런트 신경망이라 부르며 나중에 다룬다고 예고",
          }}
        >
          <Card>
            <CardTitle>입력층에서 출력층 방향으로 뉴런 층의 연결이 이루어지는 구조</CardTitle>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setReached(Math.min(layers.length - 1, reached + 1))}
                disabled={reached >= layers.length - 1}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
              >
                <Play size={12} />
                다음 층으로 전달
              </button>
              <button
                type="button"
                onClick={() => setReached(0)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 dark:border-gray-700"
              >
                <RotateCcw size={12} />
                처음부터
              </button>
              <span className="text-[11px] text-gray-500">
                지금 신호가 닿은 곳: <b>{layers[reached].name}</b>
              </span>
            </div>

            <Scroller>
              <svg viewBox="0 0 400 200" className="h-auto w-[400px] min-w-[400px]">
                {layers.slice(0, -1).map((L, i) => {
                  const next = layers[i + 1];
                  const on = i + 1 <= reached;
                  return (
                    <g key={`e${i}`}>
                      {Array.from({ length: L.n }).map((_, a) =>
                        Array.from({ length: next.n }).map((_, b) => (
                          <line
                            key={`${a}-${b}`}
                            x1={colX(i)}
                            y1={nodeY(L.n, a)}
                            x2={colX(i + 1)}
                            y2={nodeY(next.n, b)}
                            stroke={on ? "#0d9488" : "#cbd5e1"}
                            strokeOpacity={on ? 0.45 : 0.3}
                            strokeWidth={on ? 0.7 : 0.4}
                          />
                        )),
                      )}
                    </g>
                  );
                })}
                {layers.map((L, i) => (
                  <g key={L.name}>
                    {Array.from({ length: L.n }).map((_, k) => (
                      <circle
                        key={k}
                        cx={colX(i)}
                        cy={nodeY(L.n, k)}
                        r={5.5}
                        fill={
                          i <= reached
                            ? i === 0
                              ? "#6366f1"
                              : i === layers.length - 1
                                ? "#fb7185"
                                : "#14b8a6"
                            : "#ffffff"
                        }
                        className={i <= reached ? "" : "stroke-gray-400 dark:fill-gray-900"}
                        strokeWidth={1}
                      />
                    ))}
                    <text
                      x={colX(i)}
                      y={182}
                      textAnchor="middle"
                      className={`text-[8.5px] ${
                        i <= reached ? "fill-teal-600 font-bold" : "fill-gray-400"
                      }`}
                    >
                      {L.name}
                    </text>
                  </g>
                ))}
                <line x1={30} y1={194} x2={366} y2={194} className="stroke-orange-400" strokeWidth={2} />
                <polygon points="366,190 376,194 366,198" className="fill-orange-400" />
              </svg>
            </Scroller>

            <Hint>
              값이 입력층에서 출력층 방향으로만 전달되기 때문에 피드포워드 신경망이라고 부릅니다. 어떤
              뉴런의 출력이 다시 되먹임되는 구조는 리커런트 신경망으로, 이 강의 범위 밖입니다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "2. 단층 퍼셉트론(Single-layer perceptron) — 한 개의 층으로 구성된 가장 기본적인 피드포워드 신경망 구조",
          }}
        >
          <Card>
            <CardTitle>단층 퍼셉트론 — 층이 하나뿐인 피드포워드 신경망</CardTitle>

            <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-gray-600 dark:text-gray-300">
              <Tag tone="teal">피드포워드 신경망</Tag>
              <ChevronRight size={13} className="text-gray-400" />
              <Tag tone="teal">층이 한 개</Tag>
              <ChevronRight size={13} className="text-gray-400" />
              <Tag tone="teal">활성함수는 단위 계단 함수</Tag>
            </div>

            <Scroller>
              <svg viewBox="0 0 380 170" className="mt-3 h-auto w-[380px] min-w-[380px]">
                {[40, 78, 126].map((y, i) => (
                  <g key={y}>
                    <text x={24} y={y + 4} textAnchor="middle" className="fill-gray-600 text-[11px] dark:fill-gray-300">
                      {i === 2 ? "x_d" : `x${i + 1}`}
                    </text>
                    <line x1={38} y1={y} x2={158} y2={83} className="stroke-gray-500" strokeWidth={1.2} />
                    <text x={92} y={r2(y + (83 - y) * 0.4) - 5} textAnchor="middle" className="fill-rose-500 text-[9px]">
                      {i === 2 ? "w_d" : `w${i + 1}`}
                    </text>
                  </g>
                ))}
                <text x={24} y={104} textAnchor="middle" className="fill-gray-400 text-[11px]">
                  ⋮
                </text>

                <text x={168} y={160} textAnchor="middle" className="fill-gray-600 text-[10px] dark:fill-gray-300">
                  1
                </text>
                <line x1={168} y1={150} x2={168} y2={100} className="stroke-rose-500" strokeWidth={1.4} />
                <text x={176} y={130} className="fill-rose-600 text-[10px]">
                  b (바이어스)
                </text>

                <circle cx={172} cy={83} r={17} className="fill-gray-100 stroke-gray-400 dark:fill-gray-800" />
                <text x={172} y={89} textAnchor="middle" className="fill-gray-700 text-[14px] dark:fill-gray-200">
                  ∑
                </text>
                <line x1={189} y1={83} x2={222} y2={83} className="stroke-gray-400" strokeWidth={1.2} />
                <text x={205} y={75} textAnchor="middle" className="fill-gray-500 text-[10px]">
                  u
                </text>
                <rect x={222} y={66} width={34} height={34} rx={4} className="fill-gray-100 stroke-gray-400 dark:fill-gray-800" />
                {/* 계단 함수 아이콘 */}
                <polyline points="228,94 238,94 238,74 250,74" fill="none" className="stroke-gray-700 dark:stroke-gray-200" strokeWidth={1.6} />
                <line x1={256} y1={83} x2={300} y2={83} className="stroke-gray-400" strokeWidth={1.2} />
                <polygon points="300,79 310,83 300,87" className="fill-gray-400" />
                <text x={326} y={88} textAnchor="middle" className="fill-gray-700 text-[12px] dark:fill-gray-200">
                  ŷ
                </text>
                <text x={24} y={16} textAnchor="middle" className="fill-emerald-600 text-[9px]">입력</text>
                <text x={92} y={16} textAnchor="middle" className="fill-rose-500 text-[9px]">가중치</text>
                <text x={326} y={16} textAnchor="middle" className="fill-emerald-600 text-[9px]">출력</text>
                <text x={239} y={116} textAnchor="middle" className="fill-gray-500 text-[9px]">φ_step(u)</text>
              </svg>
            </Scroller>

            <Formula note="u 는 입력의 가중합에 바이어스를 더한 값 (u = wᵀx + b)">
              ŷ = φ_step(u) ,&nbsp;&nbsp; u = Σ&nbsp;wᵢ&nbsp;xᵢ + b
            </Formula>

            <Hint>
              로젠블랫이 제안한 퍼셉트론 모델은 활성함수로 단위 계단 함수를 썼습니다. 그래서 출력 ŷ 는 0
              또는 1뿐이고, 이 점이 뒤에서 일반화 오류 문제로 이어집니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
