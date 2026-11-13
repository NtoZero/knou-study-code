"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Scroller, Tag } from "@/components/dlShared/ui";
import { F, Slider2, Cell, r2 } from "@/components/dl2/ui2";

type LayerRole = "input" | "hidden" | "output";

const ROLE_TEXT: Record<LayerRole, { title: string; body: string }> = {
  input: {
    title: "입력층",
    body: "표본의 특징 x₁ … x_d 가 그대로 들어오는 자리입니다. 가중합도 활성함수도 거치지 않습니다.",
  },
  hidden: {
    title: "은닉층 (hidden layer)",
    body: "입력층과 출력층 사이에 있는 층입니다. 이 층의 출력 o_j 가 어떤 값이어야 하는지는 학습 데이터에 적혀 있지 않습니다 — 직접적인 레이블이 제공되지 않습니다.",
  },
  output: {
    title: "출력층",
    body: "모델의 예측 ŷ₁ … ŷ_N 을 내놓는 층입니다. 학습 데이터의 레이블 y 는 이 층에 대해서만 주어집니다.",
  },
};

export default function MlpStructure() {
  const [hiddenCount, setHiddenCount] = useState(2);
  const [units, setUnits] = useState(4);
  const [role, setRole] = useState<LayerRole>("hidden");

  const cols: { role: LayerRole; n: number; label: string }[] = [
    { role: "input", n: 3, label: "입력층" },
    ...Array.from({ length: hiddenCount }, (_, i) => ({
      role: "hidden" as LayerRole,
      n: units,
      label: `은닉층 ${i + 1}`,
    })),
    { role: "output", n: 2, label: "출력층" },
  ];

  const W = 420;
  const H = 210;
  const gapX = cols.length > 1 ? (W - 80) / (cols.length - 1) : 0;
  const cx = (i: number) => r2(40 + gapX * i);
  const cy = (n: number, j: number) => r2(H / 2 + (j - (n - 1) / 2) * Math.min(42, 150 / n));

  return (
    <section id="mlp-structure" className="scroll-mt-32">
      <SectionTitle
        title="다층 퍼셉트론(MLP)의 구조"
        subtitle="입력층과 출력층 사이에 1개 이상의 층이 있는 피드포워드 신경망"
      />

      <Sourced
        refs={{
          slides: "1. 다층 퍼셉트론(Multi-Layer Perceptron, MLP) — 입력층과 출력층 사이에 1개 이상의 층이 있는 피드포워드 신경망",
        }}
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <Card className="min-w-0">
            <CardTitle>층을 눌러 그 층이 하는 일을 보기</CardTitle>
            <Scroller>
              <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[400px]" role="img">
                <title>입력층, 은닉층, 출력층으로 이루어진 다층 퍼셉트론</title>
                {/* 연결선 — 앞 층의 모든 유닛이 뒤 층의 모든 유닛에 연결된다 */}
                {cols.slice(0, -1).map((c, i) =>
                  Array.from({ length: c.n }).map((_, a) =>
                    Array.from({ length: cols[i + 1].n }).map((_, b) => (
                      <line
                        key={`${i}-${a}-${b}`}
                        x1={cx(i) + 13}
                        y1={cy(c.n, a)}
                        x2={cx(i + 1) - 13}
                        y2={cy(cols[i + 1].n, b)}
                        strokeWidth="0.7"
                        className="stroke-gray-300 dark:stroke-gray-700"
                      />
                    )),
                  ),
                )}
                {cols.map((c, i) => (
                  <g
                    key={`${c.label}-${i}`}
                    onClick={() => setRole(c.role)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={cx(i) - 24}
                      y={14}
                      width="48"
                      height={H - 20}
                      rx="8"
                      className={
                        role === c.role
                          ? "fill-indigo-50 dark:fill-indigo-950/50"
                          : "fill-transparent"
                      }
                    />
                    {Array.from({ length: c.n }).map((_, j) => (
                      <circle
                        key={j}
                        cx={cx(i)}
                        cy={cy(c.n, j)}
                        r="12"
                        strokeWidth="1.6"
                        className={
                          role === c.role
                            ? "fill-white stroke-indigo-500 dark:fill-gray-900 dark:stroke-indigo-400"
                            : "fill-white stroke-gray-300 dark:fill-gray-900 dark:stroke-gray-600"
                        }
                      />
                    ))}
                    <text
                      x={cx(i)}
                      y={H - 1}
                      textAnchor="middle"
                      className={`text-[9px] font-bold ${
                        role === c.role ? "fill-indigo-500" : "fill-gray-400"
                      }`}
                    >
                      {c.label}
                    </text>
                  </g>
                ))}
              </svg>
            </Scroller>

            <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
              <Slider2
                label="은닉층 수"
                value={hiddenCount}
                min={1}
                max={3}
                step={1}
                onChange={setHiddenCount}
                display={`${hiddenCount}개`}
              />
              <Slider2
                label="은닉층 유닛 수"
                value={units}
                min={2}
                max={6}
                step={1}
                onChange={setUnits}
                display={`${units}개`}
              />
            </div>
            <Hint>
              앞 층의 모든 유닛이 뒤 층의 모든 유닛에 연결되고, 신호는 입력 쪽에서 출력 쪽으로만
              흐릅니다 — 되돌아오는 순환 연결이 없는 피드포워드 구조입니다.
            </Hint>
          </Card>

          <div className="min-w-0 space-y-3">
            <Card>
              <div className="mb-2 flex items-center gap-2">
                <Tag tone={role === "hidden" ? "rose" : "gray"}>{ROLE_TEXT[role].title}</Tag>
              </div>
              <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
                {ROLE_TEXT[role].body}
              </p>
            </Card>

            <Card>
              <CardTitle>표기 약속</CardTitle>
              <div className="space-y-2">
                <F note="L번째 층 j번 뉴런의 가중합 — 앞 층 출력에 가중치를 곱해 모두 더하고 바이어스를 더한 값">
                  u<sub>j</sub><sup>(L)</sup> = Σ<sub>i</sub> o<sub>i</sub><sup>(L−1)</sup>{" "}
                  w<sub>ij</sub><sup>(L)</sup> + b<sub>j</sub><sup>(L)</sup>
                </F>
                <F note="그 가중합을 활성함수에 통과시킨 값이 그 뉴런의 출력">
                  o<sub>j</sub><sup>(L)</sup> = φ( u<sub>j</sub><sup>(L)</sup> )
                </F>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                <Cell label="위첨자 (L)" value="층 번호" />
                <Cell label="아래첨자 ij" value="i→j 연결" />
                <Cell label="ŷ" value="출력층 출력" />
              </div>
            </Card>
          </div>
        </div>
      </Sourced>
    </section>
  );
}
