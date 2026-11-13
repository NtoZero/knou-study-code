"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Scroller, Tag } from "@/components/dlShared/ui";
import { F, Chip2, Cell, r2 } from "@/components/dl2/ui2";

/** 강의록 그림의 네 점. 이름도 강의록 표기를 따른다. */
const PTS = [
  { name: "a", x1: 0, x2: 0 },
  { name: "b", x1: 1, x2: 1 },
  { name: "c", x1: 0, x2: 1 },
  { name: "d", x1: 1, x2: 0 },
];

/** 강의록에 적힌 파라미터 그대로 */
const step = (v: number) => (v >= 0 ? 1 : 0);
const o1of = (x1: number, x2: number) => step(x1 + x2 - 0.5);
const o2of = (x1: number, x2: number) => step(x1 + x2 - 1.5);
const yof = (o1: number, o2: number) => step(o1 - o2 - 0.5);

export default function XorTwoLayers() {
  const [sel, setSel] = useState(0);
  const p = PTS[sel];
  const o1 = o1of(p.x1, p.x2);
  const o2 = o2of(p.x1, p.x2);
  const y = yof(o1, o2);
  const target = p.x1 + p.x2 === 1 ? 1 : 0;

  const SX = (v: number) => r2(28 + ((v + 0.4) / 2) * 120);
  const SY = (v: number) => r2(148 - ((v + 0.4) / 2) * 120);

  return (
    <section id="xor-two-layers" className="scroll-mt-32">
      <SectionTitle
        title="층을 하나 더 쌓으면 풀리는 이유"
        subtitle="은닉층이 입력 공간을 (o₁, o₂) 공간으로 바꿔 놓습니다"
      />

      <Sourced
        refs={{
          slides: "2. 다층 퍼셉트론을 이용한 문제 해결 — 층을 추가하면 다양한 경계의 표현이 가능함",
          lecture: "o₁, o₂ 공간으로 변환하면 a·b와 c·d를 직선 하나로 가를 수 있다",
        }}
      >
        <div className="space-y-4">
          <Card>
            <CardTitle>네 점 중 하나를 눌러 따라가 보기</CardTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              {PTS.map((q, i) => (
                <Chip2 key={q.name} active={sel === i} onClick={() => setSel(i)}>
                  {q.name} ({q.x1}, {q.x2})
                </Chip2>
              ))}
            </div>

            <Scroller>
              <svg viewBox="0 0 440 180" className="h-auto w-full min-w-[420px]" role="img">
                <title>두 개의 은닉 뉴런과 하나의 출력 뉴런으로 구성한 XOR 신경망</title>
                {/* 연결선 */}
                {[
                  { x1: 48, y1: 55, x2: 150, y2: 50 },
                  { x1: 48, y1: 55, x2: 150, y2: 130 },
                  { x1: 48, y1: 135, x2: 150, y2: 50 },
                  { x1: 48, y1: 135, x2: 150, y2: 130 },
                ].map((l, i) => (
                  <line key={i} {...l} strokeWidth="1.4" className="stroke-gray-400" />
                ))}
                <line x1="196" y1="50" x2="300" y2="90" strokeWidth="1.4" className="stroke-gray-400" />
                <line x1="196" y1="130" x2="300" y2="90" strokeWidth="1.4" className="stroke-gray-400" />

                {/* 입력 */}
                {[
                  { cy: 55, label: "x₁", v: p.x1 },
                  { cy: 135, label: "x₂", v: p.x2 },
                ].map((n) => (
                  <g key={n.label}>
                    <circle
                      cx="30"
                      cy={n.cy}
                      r="17"
                      className="fill-white stroke-gray-300 dark:fill-gray-900 dark:stroke-gray-600"
                      strokeWidth="1.5"
                    />
                    <text
                      x="30"
                      y={n.cy + 4}
                      textAnchor="middle"
                      className="fill-gray-700 text-[12px] font-bold dark:fill-gray-100"
                    >
                      {n.v}
                    </text>
                    <text
                      x="30"
                      y={n.cy - 23}
                      textAnchor="middle"
                      className="fill-gray-500 text-[9px]"
                    >
                      {n.label}
                    </text>
                  </g>
                ))}

                {/* 은닉층 */}
                {[
                  { cy: 50, label: "o₁", v: o1, bias: "−0.5" },
                  { cy: 130, label: "o₂", v: o2, bias: "−1.5" },
                ].map((n) => (
                  <g key={n.label}>
                    <circle
                      cx="173"
                      cy={n.cy}
                      r={n.v === 1 ? 20.5 : 19}
                      className={`transition-all duration-200 ${
                        n.v === 1
                          ? "fill-indigo-100 stroke-indigo-500 dark:fill-indigo-950 dark:stroke-indigo-400"
                          : "fill-white stroke-gray-300 dark:fill-gray-900 dark:stroke-gray-600"
                      }`}
                      strokeWidth="1.8"
                    />
                    <text
                      x="173"
                      y={n.cy + 5}
                      textAnchor="middle"
                      className="fill-gray-800 text-[13px] font-bold dark:fill-gray-100"
                    >
                      {n.v}
                    </text>
                    <text
                      x="173"
                      y={n.cy - 25}
                      textAnchor="middle"
                      className="fill-gray-500 text-[9px]"
                    >
                      {n.label} (b = {n.bias})
                    </text>
                  </g>
                ))}
                <text x="222" y="54" className="fill-indigo-500 text-[9px] font-bold">
                  +1
                </text>
                <text x="222" y="128" className="fill-rose-500 text-[9px] font-bold">
                  −1
                </text>

                {/* 출력층 */}
                <circle
                  cx="320"
                  cy="90"
                  r={y === 1 ? 22.5 : 21}
                  className={`transition-all duration-200 ${
                    y === 1
                      ? "fill-indigo-100 stroke-indigo-500 dark:fill-indigo-950 dark:stroke-indigo-400"
                      : "fill-white stroke-gray-300 dark:fill-gray-900 dark:stroke-gray-600"
                  }`}
                  strokeWidth="1.8"
                />
                <text
                  x="320"
                  y="96"
                  textAnchor="middle"
                  className="fill-gray-800 text-[15px] font-bold dark:fill-gray-100"
                >
                  {y}
                </text>
                <text x="320" y="62" textAnchor="middle" className="fill-gray-500 text-[9px]">
                  ŷ (b = −0.5)
                </text>
                <text x="352" y="95" className="fill-gray-500 text-[10px]">
                  → 레이블 {target}
                </text>
                <text x="352" y="110" className="fill-emerald-600 text-[10px] font-bold">
                  {y === target ? "일치" : "불일치"}
                </text>
              </svg>
            </Scroller>

            <div className="mt-2 grid grid-cols-3 gap-2">
              <F>o₁ = step(x₁ + x₂ − 0.5)</F>
              <F>o₂ = step(x₁ + x₂ − 1.5)</F>
              <F>ŷ = step(o₁ − o₂ − 0.5)</F>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
            <Card className="min-w-0">
              <CardTitle>입력 공간 (x₁, x₂)</CardTitle>
              <Scroller>
                <svg viewBox="0 0 180 170" className="h-auto w-full min-w-[180px]" role="img">
                  <title>입력 공간에 그려진 두 은닉 뉴런의 경계선</title>
                  <line
                    x1={SX(-0.4)}
                    y1={SY(0)}
                    x2={SX(1.6)}
                    y2={SY(0)}
                    className="stroke-gray-400"
                  />
                  <line
                    x1={SX(0)}
                    y1={SY(-0.4)}
                    x2={SX(0)}
                    y2={SY(1.6)}
                    className="stroke-gray-400"
                  />
                  {/* x₁ + x₂ − 0.5 = 0 */}
                  <line
                    x1={SX(-0.4)}
                    y1={SY(0.9)}
                    x2={SX(0.9)}
                    y2={SY(-0.4)}
                    strokeWidth="1.8"
                    strokeDasharray="4 3"
                    className="stroke-indigo-500"
                  />
                  <text x={SX(-0.35)} y={SY(1.05)} className="fill-indigo-500 text-[8px]">
                    x₁+x₂−0.5=0
                  </text>
                  {/* x₁ + x₂ − 1.5 = 0 */}
                  <line
                    x1={SX(0.0)}
                    y1={SY(1.5)}
                    x2={SX(1.6)}
                    y2={SY(-0.1)}
                    strokeWidth="1.8"
                    strokeDasharray="4 3"
                    className="stroke-rose-500"
                  />
                  <text x={SX(0.75)} y={SY(1.5)} className="fill-rose-500 text-[8px]">
                    x₁+x₂−1.5=0
                  </text>
                  {PTS.map((q, i) => (
                    <g key={q.name}>
                      <circle
                        cx={SX(q.x1)}
                        cy={SY(q.x2)}
                        r={i === sel ? 7 : 4.5}
                        className={
                          i === sel
                            ? "fill-indigo-500"
                            : "fill-gray-300 dark:fill-gray-600"
                        }
                      />
                      <text
                        x={SX(q.x1) + 9}
                        y={SY(q.x2) - 7}
                        className="fill-gray-500 text-[9px] font-bold"
                      >
                        {q.name}
                      </text>
                    </g>
                  ))}
                </svg>
              </Scroller>
            </Card>

            <div className="flex min-w-0 items-center justify-center">
              <div className="flex flex-col items-center gap-1 text-indigo-500">
                <ArrowRight size={20} className="max-md:rotate-90" />
                <span className="text-[10px] font-semibold">은닉층이 바꾼다</span>
              </div>
            </div>

            <Card className="min-w-0">
              <CardTitle>은닉층 출력 공간 (o₁, o₂)</CardTitle>
              <Scroller>
                <svg viewBox="0 0 180 170" className="h-auto w-full min-w-[180px]" role="img">
                  <title>은닉층 출력 공간에서 직선 하나로 갈리는 네 점</title>
                  <line
                    x1={SX(-0.4)}
                    y1={SY(0)}
                    x2={SX(1.6)}
                    y2={SY(0)}
                    className="stroke-gray-400"
                  />
                  <line
                    x1={SX(0)}
                    y1={SY(-0.4)}
                    x2={SX(0)}
                    y2={SY(1.6)}
                    className="stroke-gray-400"
                  />
                  {/* o₁ − o₂ − 0.5 = 0 → o₂ = o₁ − 0.5 */}
                  <line
                    x1={SX(0.1)}
                    y1={SY(-0.4)}
                    x2={SX(1.6)}
                    y2={SY(1.1)}
                    strokeWidth="1.8"
                    strokeDasharray="4 3"
                    className="stroke-indigo-500"
                  />
                  <text x={SX(0.55)} y={SY(-0.25)} className="fill-indigo-500 text-[8px]">
                    o₁−o₂−0.5=0
                  </text>
                  {PTS.map((q, i) => {
                    const a = o1of(q.x1, q.x2);
                    const bb = o2of(q.x1, q.x2);
                    return (
                      <g key={q.name}>
                        <circle
                          cx={SX(a)}
                          cy={SY(bb)}
                          r={i === sel ? 7 : 4.5}
                          className={
                            i === sel ? "fill-indigo-500" : "fill-gray-300 dark:fill-gray-600"
                          }
                        />
                        <text
                          x={SX(a) + 9}
                          y={SY(bb) - 7 + (q.name === "d" ? 16 : 0)}
                          className="fill-gray-500 text-[9px] font-bold"
                        >
                          {q.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </Scroller>
              <Hint>c와 d는 모두 (1, 0)으로 겹칩니다. 그래서 a·b와 c·d를 직선 하나로 가릅니다.</Hint>
            </Card>
          </div>
        </div>
      </Sourced>

      <Sourced
        className="mt-4"
        refs={{ slides: "2. 다층 퍼셉트론을 이용한 문제 해결 — 레이블이 제공되지 않는 내부 층의 학습 알고리즘이 필요함" }}
      >
        <Card className="border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30">
          <div className="flex flex-wrap items-center gap-2">
            <Tag>다음 문제</Tag>
            <p className="min-w-0 flex-1 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              위 가중치는 사람이 직접 정한 값입니다. 학습 데이터에는 출력층 레이블만 있고 은닉층
              o₁·o₂가 어떤 값이어야 하는지는 적혀 있지 않습니다.{" "}
              <strong>레이블이 제공되지 않는 내부 층의 학습 알고리즘</strong>이 필요하고, 그것이
              역전파입니다.
            </p>
          </div>
        </Card>
      </Sourced>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Cell label="x₁, x₂" value={`${p.x1}, ${p.x2}`} highlight />
        <Cell label="o₁" value={o1} highlight={o1 === 1} />
        <Cell label="o₂" value={o2} highlight={o2 === 1} />
        <Cell label="ŷ / 레이블" value={`${y} / ${target}`} highlight={y === target} />
      </div>
    </section>
  );
}
