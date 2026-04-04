"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answerIdx: number;
  explanation: string;
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 경험적 탐색에 대한 설명으로 옳은 것은?",
    options: [
      "균일비용 탐색은 경험적 탐색 방법에 해당된다.",
      "경험적 지식을 이용하여 현 상태에서 목표에 도달하는 데 필요한 경로비용을 예측하여 탐색에 활용한다.",
      "경험적 탐색은 항상 최적 경로를 탐색하는 것을 보장한다.",
      "경험적 탐색은 초기상태로부터 현 상태에 도달하는 경로비용은 탐색에 고려하지 않는다.",
    ],
    answerIdx: 1,
    explanation:
      "경험적 탐색은 경험적 지식(rule of thumb)을 평가함수에 반영하여 목표까지의 경로비용을 예측하고 탐색에 활용하는 방법. 균일비용 탐색은 경험적 탐색이 아니며, 항상 최적을 보장하지는 않음.",
  },
  {
    id: 2,
    question: "언덕오르기 탐색에 대한 올바른 설명은?",
    options: [
      "최적 경로를 탐색하기 위한 알고리즘이다.",
      "출발노드로부터 목표노드까지의 전체 경로 비용을 고려한다.",
      "너비우선 탐색과 유사한 순서로 탐색한다.",
      "현재 상태를 확장하여 생성된 후계노드들 중에서 다음 확장할 노드를 선택한다.",
    ],
    answerIdx: 3,
    explanation:
      "언덕오르기 탐색은 현재 상태를 확장하여 후계노드 중 ĥ(n)이 최소인 노드를 선택. g(n)은 고려하지 않으며, 깊이우선 탐색과 유사한 순서. 최적 경로를 보장하지 않음.",
  },
  {
    id: 3,
    question:
      "평가함수가 전역최소치에 해당되는 해를 구하기 위한 모의 담금질에 대한 올바른 설명은?",
    options: [
      "어느 시점에서든 평가함숫값이 감소하는 상태로만 이동한다.",
      "해를 매우 빠르게 탐색할 수 있는 알고리즘이다.",
      "현재상태보다 평가함숫값이 더 높은 상태로 이동할 확률은 시간에 따라 감소한다.",
      "초기상태로부터 목표상태에 이르는 가장 최적의 경로를 따라 이동한다.",
    ],
    answerIdx: 2,
    explanation:
      "모의 담금질은 ΔE ≥ 0(악화)일 때 확률 e^(-ΔE/T)로 이동을 허용하며, 온도 T가 시간에 따라 감소하므로 악화 방향 이동 확률도 점차 감소. 이를 통해 지역최소치를 탈출하고 전역최소치에 수렴.",
  },
  {
    id: 4,
    question: "A* 알고리즘에서 OPEN 리스트에 존재하는 노드 n의 평가함수는?",
    options: ["g(n)", "ĥ(n)", "ĝ(n)+h(n)", "g(n)+ĥ(n)"],
    answerIdx: 3,
    explanation:
      "A* 알고리즘의 평가함수는 f̂(n) = g(n) + ĥ(n). 출발노드에서 n까지의 실제 경로비용 g(n)과 n에서 목표까지의 예측비용 ĥ(n)의 합.",
  },
  {
    id: 5,
    question:
      "A* 알고리즘에서 최소비용 경로를 탐색하려면 항상 성립해야 하는 조건은?",
    options: ["ĥ(n) ≤ h(n)", "ĥ(n) ≥ h(n)", "g(n) ≤ ĥ(n)", "ĝ(n) = 0"],
    answerIdx: 0,
    explanation:
      "허용적(admissible) 휴리스틱 조건: 예측비용 ĥ(n)이 항상 실제 비용 h(n) 이하여야 A*가 최소비용 경로를 보장. 직선거리는 이 조건을 자연스럽게 만족.",
  },
];

export default function QuizSection() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleSelect = (qId: number, optIdx: number) => {
    if (revealed[qId]) return;
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleReveal = (qId: number) => {
    setRevealed((prev) => ({ ...prev, [qId]: true }));
  };

  const totalCorrect = questions.filter(
    (q) => revealed[q.id] && answers[q.id] === q.answerIdx
  ).length;
  const totalRevealed = Object.keys(revealed).length;

  const resetAll = () => {
    setAnswers({});
    setRevealed({});
  };

  return (
    <section>
      <SectionTitle
        title="5. 연습문제"
        subtitle="3강 핵심 내용을 점검하는 퀴즈 (5문항)"
      />

      {totalRevealed > 0 && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-800 dark:bg-teal-900/20">
          <span className="text-sm font-bold text-teal-700 dark:text-teal-300">
            정답: {totalCorrect} / {totalRevealed}
          </span>
          {totalRevealed === questions.length && (
            <button
              onClick={resetAll}
              className="rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-600"
            >
              다시 풀기
            </button>
          )}
        </div>
      )}

      <div className="space-y-6">
        {questions.map((q) => {
          const userAnswer = answers[q.id];
          const isRevealed = revealed[q.id];
          const isCorrect = userAnswer === q.answerIdx;

          return (
            <div
              key={q.id}
              className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900"
            >
              <h4 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">
                Q{q.id}. {q.question}
              </h4>

              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isSelected = userAnswer === oi;
                  const isAnswer = q.answerIdx === oi;

                  let borderClass = "border-gray-200 dark:border-gray-700";
                  let bgClass =
                    "bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800";

                  if (isRevealed && isAnswer) {
                    borderClass = "border-green-400 dark:border-green-600";
                    bgClass = "bg-green-50 dark:bg-green-900/20";
                  } else if (isRevealed && isSelected && !isCorrect) {
                    borderClass = "border-red-400 dark:border-red-600";
                    bgClass = "bg-red-50 dark:bg-red-900/20";
                  } else if (isSelected && !isRevealed) {
                    borderClass = "border-teal-400 dark:border-teal-600";
                    bgClass = "bg-teal-50 dark:bg-teal-900/20";
                  }

                  return (
                    <button
                      key={oi}
                      onClick={() => handleSelect(q.id, oi)}
                      disabled={isRevealed}
                      className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${borderClass} ${bgClass} disabled:cursor-default`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          isSelected && !isRevealed
                            ? "bg-teal-500 text-white"
                            : isRevealed && isAnswer
                              ? "bg-green-500 text-white"
                              : isRevealed && isSelected
                                ? "bg-red-500 text-white"
                                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {oi + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-2">
                {!isRevealed && (
                  <button
                    onClick={() => handleReveal(q.id)}
                    disabled={userAnswer === undefined}
                    className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 disabled:opacity-40"
                  >
                    정답 확인
                  </button>
                )}
              </div>

              <AnimatePresence>
                {isRevealed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`mt-4 rounded-lg p-3 ${
                        isCorrect
                          ? "bg-green-50 dark:bg-green-900/20"
                          : "bg-red-50 dark:bg-red-900/20"
                      }`}
                    >
                      <p
                        className={`mb-1 text-sm font-bold ${
                          isCorrect
                            ? "text-green-700 dark:text-green-300"
                            : "text-red-700 dark:text-red-300"
                        }`}
                      >
                        {isCorrect ? "정답!" : `오답 (정답: ${q.answerIdx + 1}번)`}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {q.explanation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
