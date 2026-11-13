"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Scroller, Chip, ComputedNote } from "@/components/dlShared/ui";

/** 숫자 7을 28×28 격자에 그린 모양 — 강의록의 입력 그림을 작게 흉내 낸 것 */
const SEVEN: [number, number][] = (() => {
  const cells: [number, number][] = [];
  for (let c = 6; c <= 20; c += 1) {
    cells.push([6, c]);
    cells.push([7, c]);
  }
  for (let r = 8; r <= 22; r += 1) {
    const c = Math.round(20 - (r - 8) * 0.62);
    cells.push([r, c]);
    cells.push([r, c - 1]);
  }
  for (let c = 9; c <= 15; c += 1) {
    cells.push([14, c]);
  }
  return cells;
})();

const stages = [
  {
    n: 0,
    label: "은닉층 없음",
    head: "입력 784개를 곧장 10개의 출력 노드에 연결",
    body:
      "28×28 격자로 표현한 입력 784개가 그대로 0~9를 맡은 출력 노드 10개에 연결된 구조.",
    lecture:
      "같은 ‘7’이라도 쓰는 모양이 제각각이라, 한 층만으로 숫자를 알아보게 하기는 상당히 어렵다고 짚음",
  },
  {
    n: 1,
    label: "은닉층 1개",
    head: "중간 층이 획 같은 ‘특징’에 반응하도록 훈련됨",
    body:
      "중간에 층을 하나 두면, 그 층의 뉴런들이 0~9를 바로 맞히는 대신 입력에 들어 있는 특징적인 요소에 반응하도록 훈련됨.",
    lecture:
      "어떤 뉴런은 가로 획, 어떤 뉴런은 대각선 획에 잘 반응하는 식 — 다만 어느 뉴런이 무엇에 반응할지는 초기값과 데이터에 따라 달라지는 ‘개념적인 설명’이라고 못 박음",
  },
  {
    n: 2,
    label: "은닉층 2개",
    head: "앞 층이 찾은 특징을 결합해 더 복합적인 특징을 만듦",
    body:
      "층을 더 쌓으면 앞 층에서 찾아낸 특징들을 결합해 더 고차원적인 특징을 만들어 낼 수 있음. 많은 수의 층으로 구성하면 더욱 높은 차원의 표현이 가능함 → 심층 신경망(deep neural network).",
    lecture: "실제 문제에서는 층이 한두 개가 아니라 100개, 200개까지 쌓이기도 한다고 언급",
  },
];

const limits: { key: string; detail: string }[] = [
  {
    key: "부족한 학습 데이터",
    detail: "데이터가 부족하면 그것으로 훈련해 낼 수 있는 모델의 성능에 한계가 생김.",
  },
  {
    key: "불안정한 경사",
    detail:
      "경사의 값이 너무 작아지거나 반대로 너무 커지면 훈련이 잘 이루어지지 못함. 층의 수가 많을수록 이 문제가 크게 나타남.",
  },
  {
    key: "과적합",
    detail:
      "특정 훈련 데이터에 너무 잘 맞춰진 나머지 그 밖의 일반적인 문제에서는 오히려 잘 동작하지 못하는 문제.",
  },
  {
    key: "방대한 계산량",
    detail: "층의 수도 많고 학습할 데이터의 양도 많아지면 계산량이 그만큼 커짐.",
  },
];

export default function DepthAndRepresentation() {
  const [stage, setStage] = useState(0);
  const [limit, setLimit] = useState<string | null>(null);
  const cur = stages[stage];

  const inputRows = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "⋮", "782", "783"];
  const outY = (i: number) => 18 + i * 20;

  return (
    <section id="depth-and-representation" className="scroll-mt-32">
      <SectionTitle
        title="층을 쌓으면 무엇이 달라지나"
        subtitle="숫자 ‘7’을 알아보는 신경망으로 층과 표현력의 관계를 봅니다"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "2. 딥러닝 — 신경망의 층과 표현력",
            lecture: "층의 수를 늘릴수록 신경망의 표현력은 증가한다",
          }}
        >
          <Card>
            <CardTitle>층을 하나씩 더해 보기</CardTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              {stages.map((s, i) => (
                <Chip key={s.n} active={stage === i} onClick={() => setStage(i)}>
                  {s.label}
                </Chip>
              ))}
            </div>

            <Scroller>
              <svg viewBox="0 0 440 230" className="h-auto w-[440px] min-w-[440px]">
                {/* 28×28 입력 이미지 */}
                <rect x={8} y={40} width={112} height={112} className="fill-gray-900" />
                {SEVEN.map(([r, c], i) => (
                  <rect key={i} x={8 + c * 4} y={40 + r * 4} width={4} height={4} fill="#f8fafc" />
                ))}
                <text x={64} y={168} textAnchor="middle" className="fill-gray-500 text-[9px]">
                  28 × 28
                </text>

                {/* 입력 벡터 */}
                {inputRows.map((t, i) => (
                  <g key={t}>
                    <rect x={134} y={14 + i * 15} width={26} height={13} className="fill-gray-800" />
                    <text
                      x={147}
                      y={24 + i * 15}
                      textAnchor="middle"
                      className="fill-white text-[7px]"
                    >
                      {t}
                    </text>
                  </g>
                ))}
                <text x={147} y={212} textAnchor="middle" className="fill-gray-500 text-[9px]">
                  입력 784개
                </text>

                {/* 은닉층 */}
                {Array.from({ length: stage }).map((_, L) => {
                  const cx = 214 + L * 70;
                  return (
                    <g key={L}>
                      {[0, 1, 2, 3, 4].map((k) => (
                        <circle
                          key={k}
                          cx={cx}
                          cy={28 + k * 38}
                          r={8}
                          className="fill-teal-100 stroke-teal-500 dark:fill-teal-950"
                          strokeWidth={1.2}
                        />
                      ))}
                      <text x={cx} y={212} textAnchor="middle" className="fill-teal-600 text-[9px]">
                        은닉층 {L + 1}
                      </text>
                    </g>
                  );
                })}

                {/* 연결선 */}
                {stage === 0
                  ? [0, 3, 6, 9, 11].map((i) =>
                      [0, 3, 7, 9].map((o) => (
                        <line
                          key={`${i}-${o}`}
                          x1={160}
                          y1={20 + i * 15}
                          x2={366}
                          y2={outY(o)}
                          stroke="#0d9488"
                          strokeOpacity={0.25}
                          strokeWidth={0.6}
                        />
                      )),
                    )
                  : null}
                {stage > 0
                  ? [0, 3, 6, 9, 11].map((i) =>
                      [0, 1, 2, 3, 4].map((k) => (
                        <line
                          key={`a${i}-${k}`}
                          x1={160}
                          y1={20 + i * 15}
                          x2={206}
                          y2={28 + k * 38}
                          stroke="#0d9488"
                          strokeOpacity={0.25}
                          strokeWidth={0.6}
                        />
                      )),
                    )
                  : null}
                {stage === 2
                  ? [0, 1, 2, 3, 4].map((k) =>
                      [0, 1, 2, 3, 4].map((k2) => (
                        <line
                          key={`b${k}-${k2}`}
                          x1={222}
                          y1={28 + k * 38}
                          x2={276}
                          y2={28 + k2 * 38}
                          stroke="#0d9488"
                          strokeOpacity={0.25}
                          strokeWidth={0.6}
                        />
                      )),
                    )
                  : null}
                {stage > 0
                  ? [0, 1, 2, 3, 4].map((k) =>
                      [0, 3, 7, 9].map((o) => (
                        <line
                          key={`c${k}-${o}`}
                          x1={214 + (stage - 1) * 70 + 8}
                          y1={28 + k * 38}
                          x2={366}
                          y2={outY(o)}
                          stroke="#0d9488"
                          strokeOpacity={0.25}
                          strokeWidth={0.6}
                        />
                      )),
                    )
                  : null}

                {/* 출력층 */}
                {Array.from({ length: 10 }).map((_, o) => (
                  <g key={o}>
                    <circle
                      cx={375}
                      cy={outY(o)}
                      r={8}
                      fill={o === 7 ? "#9a3412" : "transparent"}
                      className={o === 7 ? "" : "stroke-gray-400"}
                      strokeWidth={1.2}
                    />
                    <text
                      x={375}
                      y={outY(o) + 3}
                      textAnchor="middle"
                      className={o === 7 ? "fill-white text-[9px] font-bold" : "fill-gray-500 text-[9px]"}
                    >
                      {o}
                    </text>
                  </g>
                ))}
                <text x={375} y={212} textAnchor="middle" className="fill-gray-500 text-[9px]">
                  출력 10개
                </text>
              </svg>
            </Scroller>

            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60"
              >
                <p className="text-[13px] font-bold text-gray-800 dark:text-gray-100">{cur.head}</p>
                <p className="mt-1 text-[12.5px] leading-6 text-gray-600 dark:text-gray-300">
                  {cur.body}
                </p>
                <p className="mt-2 text-[12px] leading-6 text-rose-700 dark:text-rose-300">
                  강의 강조 · {cur.lecture}
                </p>
              </motion.div>
            </AnimatePresence>

            <ComputedNote>
              그림의 은닉층 뉴런 5개와 연결선은 보기 쉽도록 이 페이지에서 줄여 그린 것입니다. 강의에서 든
              예는 은닉층 하나에 뉴런 128개였습니다.
            </ComputedNote>
          </Card>
        </Sourced>

        <Sourced refs={{ slides: "2. 딥러닝 — 딥러닝(deep learning)" }}>
          <Card>
            <CardTitle>딥러닝(deep learning)</CardTitle>
            <p className="rounded-lg bg-teal-50 p-3 text-[13px] leading-6 text-teal-900 dark:bg-teal-950/40 dark:text-teal-100">
              심층 신경망을 기반으로 데이터를 학습하여 다양한 문제를 해결하기 위한 이론과 기술을 연구하는
              <b> 기계학습의 한 분야</b>.
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-semibold text-gray-700 dark:text-gray-200">
              <Layers size={13} className="text-teal-500" />
              학습 성능을 제한하는 제반 문제의 개선이 필요함
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {limits.map((l) => (
                <Chip
                  key={l.key}
                  active={limit === l.key}
                  onClick={() => setLimit(limit === l.key ? null : l.key)}
                >
                  {l.key}
                </Chip>
              ))}
            </div>
            <AnimatePresence initial={false}>
              {limit && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <span className="mt-2 block rounded-lg bg-gray-50 p-3 text-[12.5px] leading-6 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
                    {limits.find((l) => l.key === limit)?.detail}
                  </span>
                </motion.p>
              )}
            </AnimatePresence>
            <Hint>
              여기 적힌 네 가지는 4강·5강에서 학습 기술로 다시 다루는 항목입니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
