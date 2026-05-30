"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import QuizChoiceExplanation from "@/components/aiReview/QuizChoiceExplanation";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question:
      "대규모 데이터 집합으로부터 일반화하여 습득한 지식을 바탕으로 새로운 데이터를 제공할 수 있도록 설계된 인공지능을 의미하는 것은?",
    options: [
      "약한 인공지능",
      "강한 인공지능",
      "생성형 인공지능",
      "지식기반 시스템",
    ],
    correctIndex: 2,
    explanation:
      "대규모 데이터 집합을 대상으로 학습함으로써 이를 일반화하여 데이터에 내재한 패턴이나 구조를 습득함으로써 이를 바탕으로 새로운 데이터를 생성할 수 있도록 설계된 인공지능을 생성형 인공지능이라고 한다.",
  },
  {
    id: 2,
    question: "다음 중 물리적 기호시스템 가설의 의의에 해당되는 것은?",
    options: [
      "컴퓨터는 인간보다 계산 능력이 우수하다.",
      "인간이 행하는 지능적 작업을 수행하는 프로그램 작성이 가능하다는 믿음의 근거이다.",
      "컴퓨터는 수치 데이터의 계산만 할 수 있다.",
      "2진수를 이용하여 기호를 표현할 수 있다.",
    ],
    correctIndex: 1,
    explanation:
      "물리적 기호시스템 가설이란 앨런 뉴웰과 허버트 사이먼이 \"물리적 기호 시스템은 일반적인 지능적 행동을 위한 필요 충분한 수단을 가지고 있다\"라고 제시한 가설로서, 인간이 행하는 지능적 작업을 수행하는 프로그램을 작성할 수 있다는 가능성에 대한 믿음의 근원이다.",
  },
  {
    id: 3,
    question:
      "지식을 어떻게 체계화하고 지식 베이스에 축적하며, 축적된 지식을 어떻게 이용하는가를 연구하는 학문을 일컫는 것은?",
    options: ["지식공학", "논리학", "데이터베이스", "알고리즘"],
    correctIndex: 0,
    explanation:
      "지식공학은 지식을 체계적으로 수집하여 지식베이스를 구축하는 것, 축적된 지식을 이용한 추론 과정 등을 연구하는 분야를 의미하며, 이러한 역할을 하는 사람을 지식공학자라고 한다.",
  },
  {
    id: 4,
    question: "인공지능의 겨울이 도래한 주된 원인이 아닌 것은?",
    options: [
      "컴퓨터 성능 한계",
      "퍼셉트론 XOR 한계",
      "GPGPU 기술 발전",
      "결과물의 유용성 부족",
    ],
    correctIndex: 2,
    explanation:
      "GPGPU 기술 발전은 AI 겨울의 원인이 아니라, 오히려 AI 부흥의 핵심 요인 중 하나이다. 계산능력의 비약적 증대를 가능하게 했다.",
  },
  {
    id: 5,
    question: "연결주의(Connectionism) 접근의 핵심은?",
    options: [
      "기호 조작",
      "신경망과 딥러닝",
      "규칙 기반 추론",
      "확률적 분류",
    ],
    correctIndex: 1,
    explanation:
      "연결주의는 두뇌의 신경 체계에 착안하여 인공 신경망(artificial neural network)과 딥러닝(deep learning)을 통해 데이터로부터 패턴을 학습하는 접근 방향이다.",
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

  const handleReset = () => {
    setAnswers({});
    setRevealed({});
  };

  const totalAnswered = Object.keys(revealed).length;
  const totalCorrect = questions.filter(
    (q) => revealed[q.id] && answers[q.id] === q.correctIndex
  ).length;

  return (
    <section>
      <SectionTitle
        title="연습문제"
        subtitle="1강 인공지능의 개요 핵심 내용을 확인하는 퀴즈"
      />

      {/* Score bar */}
      {totalAnswered > 0 && (
        <div className="mb-6 flex items-center justify-between rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
            {totalCorrect}/{totalAnswered} 정답
            {totalAnswered === questions.length && (
              <span className="ml-2">
                ({Math.round((totalCorrect / questions.length) * 100)}%)
              </span>
            )}
          </span>
          <button
            onClick={handleReset}
            className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-600"
          >
            다시 풀기
          </button>
        </div>
      )}

      <div className="space-y-6">
        {questions.map((q) => {
          const isRevealed = revealed[q.id];
          const selected = answers[q.id];
          const isCorrect = selected === q.correctIndex;

          return (
            <div
              key={q.id}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
            >
              <h4 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-200">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
                  {q.id}
                </span>
                {q.question}
              </h4>

              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  let optClass =
                    "border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700";

                  if (isRevealed) {
                    if (i === q.correctIndex) {
                      optClass =
                        "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/30";
                    } else if (i === selected && !isCorrect) {
                      optClass =
                        "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/30";
                    } else {
                      optClass =
                        "border-gray-200 bg-gray-50 opacity-50 dark:border-gray-700 dark:bg-gray-800";
                    }
                  } else if (selected === i) {
                    optClass =
                      "border-indigo-300 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-900/30";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(q.id, i)}
                      disabled={isRevealed}
                      className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${optClass}`}
                    >
                      <span className="mr-2 font-medium text-gray-500">
                        {String.fromCharCode(9312 + i)}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {opt}
                      </span>
                      {isRevealed && i === q.correctIndex && (
                        <span className="ml-2 text-green-600 dark:text-green-400">
                          &#10003;
                        </span>
                      )}
                      {isRevealed && i === selected && !isCorrect && i !== q.correctIndex && (
                        <span className="ml-2 text-red-600 dark:text-red-400">
                          &#10007;
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Submit button */}
              {!isRevealed && selected !== undefined && (
                <button
                  onClick={() => handleReveal(q.id)}
                  className="mt-3 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
                >
                  정답 확인
                </button>
              )}

              {/* Explanation */}
              <AnimatePresence>
                {isRevealed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`mt-3 rounded-lg p-3 text-sm ${
                        isCorrect
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                          : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                      }`}
                    >
                      <p className="font-bold">{isCorrect ? "정답!" : "오답"}</p>
                      <QuizChoiceExplanation
                        correct={isCorrect}
                        choiceText={q.options[selected ?? q.correctIndex]}
                        correctChoiceText={q.options[q.correctIndex]}
                        basisText={q.explanation}
                        wrongRule={`정답 선택지 "${q.options[q.correctIndex]}"이 설명하는 강의 개념과 선택한 보기의 개념을 비교한다.`}
                      />
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
