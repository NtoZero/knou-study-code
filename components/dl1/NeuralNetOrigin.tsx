"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Tag, Scroller } from "@/components/dlShared/ui";

type PartId = "dendrite" | "soma" | "axon" | "synapse";

const parts: {
  id: PartId;
  ko: string;
  en: string;
  what: string;
  mirror: string;
}[] = [
  {
    id: "dendrite",
    ko: "수상돌기",
    en: "dendrite",
    what: "앞선 신경세포가 보낸 신호를 받아들이는 가지.",
    mirror: "인공 뉴런에서 입력 x₁ … x_d 가 들어오는 자리.",
  },
  {
    id: "soma",
    ko: "신경세포체",
    en: "soma",
    what: "받아들인 신호를 모아 처리하는 몸통.",
    mirror: "가중합 ∑ 과 활성함수 φ 가 놓이는 자리.",
  },
  {
    id: "axon",
    ko: "축삭돌기",
    en: "axon",
    what: "처리한 결과를 다음 신경세포 쪽으로 길게 내보내는 통로.",
    mirror: "뉴런의 출력 ŷ 가 다음 층으로 나가는 자리.",
  },
  {
    id: "synapse",
    ko: "시냅스",
    en: "synapse",
    what: "축삭돌기 끝과 다음 신경세포가 만나 신호를 건네주는 접점.",
    mirror: "노드와 노드를 잇는 연결, 즉 가중치 w 가 붙는 자리.",
  },
];

const timeline: {
  year: string;
  who: string;
  head: string;
  body: string[];
  quote?: string;
  tone: "rise" | "fall";
  lecture?: string;
}[] = [
  {
    year: "1943",
    who: "Warren McCulloch · Walter Pitts",
    head: "‘임계치 논리(threshold logic)’ 알고리즘을 바탕으로 한 신경망 계산 모델 제안",
    body: [
      "신경세포에 임계치 이상의 입력이 전달되면 활성화되어 출력을 낸다는 계산 구조.",
    ],
    tone: "rise",
    lecture: "임계치 이상의 입력이 오면 세포가 활성화되어 출력을 내는 계단 구조를 제안한 것",
  },
  {
    year: "1949",
    who: "Donald Hebb",
    head: "헵의 학습(Hebbian learning) 이론 제시",
    body: ["함께 활성화되는 두 뉴런 사이의 연결을 강화해 나가며 학습한다는 발상."],
    quote: "Neurons that fire together, wire together.",
    tone: "rise",
  },
  {
    year: "1957",
    who: "Frank Rosenblatt",
    head: "퍼셉트론(Perceptron) 학습 모델 발표",
    body: ["이진 분류기를 학습할 수 있는 학습 모델."],
    tone: "rise",
  },
  {
    year: "1958",
    who: "Mark I Perceptron",
    head: "퍼셉트론을 하드웨어로 구현",
    body: ["이 성과를 두고 당시 신문에 다음과 같은 평가가 실림."],
    quote:
      "걷고, 말하고, 보고, 쓰고, 스스로를 복제하고, 자신의 존재를 의식할 수 있을 것으로 기대되는 전자 컴퓨터의 배아(embryo) — The New York Times (1958)",
    tone: "rise",
    lecture: "시각적인 패턴을 인식하는 용도에서 의미 있는 성과를 보여 주었다고 설명",
  },
  {
    year: "1969",
    who: "Marvin Minsky 등",
    head: "단층 퍼셉트론의 한계를 지적",
    body: [
      "단층 퍼셉트론은 배타적 논리합(XOR)과 같은 간단한 문제도 해결하지 못함 — 『Perceptrons: An Introduction to Computational Geometry』",
      "신경망의 연구가 침체기에 들어서게 됨.",
    ],
    tone: "fall",
    lecture: "다층으로 구성하면 풀 수 있었지만 그 학습 방법이 없었고, 연구비가 급감해 침체기로 이어졌다고 설명",
  },
  {
    year: "1974 · 1986",
    who: "Paul Werbos · David Rumelhart 등",
    head: "역전파(backpropagation) 알고리즘 — 다층 퍼셉트론 구조의 학습 방법이 발표됨",
    body: ["신경망의 가능성에 대한 기대가 높아지며, 신경망 분야의 연구가 활발하게 이루어짐."],
    tone: "rise",
  },
];

export default function NeuralNetOrigin() {
  const [part, setPart] = useState<PartId>("soma");
  const [open, setOpen] = useState<number>(2);
  const sel = parts.find((p) => p.id === part)!;

  const partFill = (id: PartId) =>
    id === part ? "#14b8a6" : "#cbd5e1";

  return (
    <section id="artificial-neural-network" className="scroll-mt-32">
      <SectionTitle
        title="인공 신경망이란"
        subtitle="두뇌의 신경 시스템에서 무엇을 가져왔고, 어떤 연구를 거쳐 왔는지 짚어 봅니다"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "1. 인공 신경망 — 인공 신경망(artificial neural networks)이란?",
            lecture: "생물학적 신경망과 완전히 동일한 것은 아니며, 그 계산 구조를 지능적 처리에 활용하는 것",
          }}
        >
          <Card>
            <CardTitle>인간과 동물의 두뇌를 구성하는 생물학적 신경 시스템의 원리를 바탕으로 설계된 계산 시스템</CardTitle>
            <p className="mb-3 text-[13px] leading-6 text-gray-600 dark:text-gray-300">
              아래 그림에서 <b>부위를 눌러 보세요.</b> 생물학적 신경세포의 어느 자리가 인공 뉴런의 어느
              요소에 대응되는지 바뀝니다.
            </p>

            <Scroller>
              <svg viewBox="0 0 420 160" className="h-auto w-[420px] min-w-[420px]">
                {/* 수상돌기 */}
                <g onClick={() => setPart("dendrite")} className="cursor-pointer">
                  <circle cx={44} cy={80} r={26} fill="transparent" />
                  {[
                    [20, 52],
                    [16, 80],
                    [22, 108],
                    [38, 44],
                  ].map(([x, y], i) => (
                    <line
                      key={i}
                      x1={60}
                      y1={80}
                      x2={x}
                      y2={y}
                      stroke={partFill("dendrite")}
                      strokeWidth={3}
                      strokeLinecap="round"
                    />
                  ))}
                </g>
                {/* 신경세포체 */}
                <g onClick={() => setPart("soma")} className="cursor-pointer">
                  <ellipse cx={72} cy={80} rx={18} ry={15} fill={partFill("soma")} />
                  <circle cx={72} cy={80} r={5} className="fill-white dark:fill-gray-900" />
                </g>
                {/* 축삭돌기 */}
                <g onClick={() => setPart("axon")} className="cursor-pointer">
                  <path
                    d="M90 80 C 140 60, 180 100, 232 80"
                    fill="none"
                    stroke={partFill("axon")}
                    strokeWidth={5}
                    strokeLinecap="round"
                  />
                </g>
                {/* 시냅스 */}
                <g onClick={() => setPart("synapse")} className="cursor-pointer">
                  <circle cx={240} cy={80} r={11} fill={partFill("synapse")} />
                  <circle cx={240} cy={80} r={4} className="fill-white dark:fill-gray-900" />
                </g>
                {/* 다음 신경세포 */}
                <ellipse cx={272} cy={80} rx={14} ry={12} className="fill-gray-300 dark:fill-gray-600" />
                {[
                  [300, 54],
                  [306, 80],
                  [300, 106],
                ].map(([x, y], i) => (
                  <line
                    key={i}
                    x1={286}
                    y1={80}
                    x2={x}
                    y2={y}
                    className="stroke-gray-300 dark:stroke-gray-600"
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                ))}

                <text x={30} y={132} className="fill-gray-500 text-[9px]">수상돌기</text>
                <text x={56} y={30} className="fill-gray-500 text-[9px]">신경세포체</text>
                <text x={142} y={118} className="fill-gray-500 text-[9px]">축삭돌기</text>
                <text x={222} y={36} className="fill-gray-500 text-[9px]">시냅스</text>

                {/* 인공 뉴런 쪽 */}
                <line x1={330} y1={80} x2={352} y2={80} className="stroke-gray-400" strokeWidth={1.5} />
                <polygon points="352,76 360,80 352,84" className="fill-gray-400" />
                <g>
                  <circle
                    cx={386}
                    cy={48}
                    r={9}
                    fill={part === "dendrite" ? "#14b8a6" : "#cbd5e1"}
                  />
                  <circle
                    cx={386}
                    cy={80}
                    r={9}
                    fill={part === "soma" ? "#14b8a6" : "#cbd5e1"}
                  />
                  <circle
                    cx={386}
                    cy={112}
                    r={9}
                    fill={part === "axon" ? "#14b8a6" : "#cbd5e1"}
                  />
                  {[48, 112].map((y) => (
                    <line
                      key={y}
                      x1={386}
                      y1={y}
                      x2={386}
                      y2={80}
                      stroke={part === "synapse" ? "#14b8a6" : "#cbd5e1"}
                      strokeWidth={part === "synapse" ? 3 : 1.5}
                    />
                  ))}
                </g>
                <text x={366} y={140} className="fill-gray-500 text-[9px]">인공 신경망</text>
              </svg>
            </Scroller>

            <AnimatePresence mode="wait">
              <motion.div
                key={part}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="mt-3 rounded-lg bg-teal-50 p-3 dark:bg-teal-950/40"
              >
                <p className="text-[13px] font-bold text-teal-800 dark:text-teal-200">
                  {sel.ko} ({sel.en})
                </p>
                <p className="mt-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">{sel.what}</p>
                <p className="mt-1 text-[12.5px] leading-6 text-teal-700 dark:text-teal-300">
                  → {sel.mirror}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {parts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPart(p.id)}
                  aria-pressed={p.id === part}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    p.id === part
                      ? "border-teal-600 bg-teal-600 text-white"
                      : "border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  }`}
                >
                  {p.ko}
                </button>
              ))}
            </div>

            <Hint>
              강의에서는 &lsquo;생물학적 신경망과 완전히 동일한 것은 아니고, 그 계산 구조를 지능적 처리에
              활용하는 것&rsquo;이라고 선을 그었습니다. 위의 대응은 자리를 맞춰 본 것이지 같은 구현이라는
              뜻은 아닙니다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "1. 인공 신경망 — 초기의 신경망 연구 / 퍼셉트론의 한계 / 역전파(backpropagation) 알고리즘",
          }}
        >
          <Card>
            <CardTitle>초기의 신경망 연구에서 역전파까지</CardTitle>
            <p className="mb-3 text-[13px] leading-6 text-gray-600 dark:text-gray-300">
              연도를 눌러 펼쳐 보세요. 기대가 올라간 때와 꺾인 때가 번갈아 나옵니다.
            </p>

            {/* 기대 곡선 */}
            <Scroller>
              <svg viewBox="0 0 420 70" className="h-auto w-[420px] min-w-[420px]">
                <polyline
                  points="20,50 90,34 160,24 230,18 300,58 390,22"
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth={2}
                />
                {[20, 90, 160, 230, 300, 390].map((x, i) => (
                  <g key={x} onClick={() => setOpen(i)} className="cursor-pointer">
                    <circle
                      cx={x}
                      cy={[50, 34, 24, 18, 58, 22][i]}
                      r={open === i ? 7 : 4.5}
                      fill={timeline[i].tone === "fall" ? "#f43f5e" : "#14b8a6"}
                    />
                    <text x={x} y={68} textAnchor="middle" className="fill-gray-500 text-[8px]">
                      {timeline[i].year}
                    </text>
                  </g>
                ))}
              </svg>
            </Scroller>

            <div className="mt-2 space-y-2">
              {timeline.map((t, i) => {
                const isOpen = open === i;
                return (
                  <div
                    key={t.year}
                    className={`overflow-hidden rounded-lg border ${
                      isOpen
                        ? t.tone === "fall"
                          ? "border-rose-300 dark:border-rose-800"
                          : "border-teal-300 dark:border-teal-800"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="flex w-full items-center gap-2 p-2.5 text-left"
                    >
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[11px] font-bold ${
                          t.tone === "fall"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-200"
                            : "bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-200"
                        }`}
                      >
                        {t.year}
                      </span>
                      <span className="min-w-0 flex-1 text-[12.5px] font-semibold text-gray-800 dark:text-gray-100">
                        {t.who}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-gray-100 px-3 pb-3 pt-2 dark:border-gray-800">
                            <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-100">
                              {t.head}
                            </p>
                            {t.body.map((b) => (
                              <p
                                key={b}
                                className="mt-1 text-[12.5px] leading-6 text-gray-600 dark:text-gray-300"
                              >
                                {b}
                              </p>
                            ))}
                            {t.quote && (
                              <p className="mt-2 border-l-2 border-gray-300 pl-2 text-[12px] italic leading-6 text-gray-500 dark:border-gray-600 dark:text-gray-400">
                                “{t.quote}”
                              </p>
                            )}
                            {t.lecture && (
                              <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[12px] leading-6 text-rose-700 dark:text-rose-300">
                                <Tag tone="rose">강의 강조</Tag>
                                {t.lecture}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
