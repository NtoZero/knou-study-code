"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

const qaExchanges = [
  {
    question: "당신이 좋아하는 계절은 무엇인가요?",
    humanAnswer: "저는 가을을 좋아합니다. 단풍이 아름답고 선선한 바람이 좋거든요.",
    computerAnswer: "저는 봄을 좋아합니다. 새로운 시작의 느낌이 들어서 마음이 설레요.",
  },
  {
    question: "14와 27의 합은 얼마인가요?",
    humanAnswer: "음... 41인가요? 아, 아니 41이 맞아요.",
    computerAnswer: "41입니다. 단순한 덧셈이네요.",
  },
  {
    question: "셰익스피어의 소네트에 대해 어떻게 생각하나요?",
    humanAnswer: "사랑과 시간의 흐름을 아름답게 표현한 작품이라고 생각해요.",
    computerAnswer: "인간의 감정을 섬세하게 포착한 문학 작품으로, 시대를 초월한 가치가 있습니다.",
  },
];

const scenarios = [
  {
    label: "통과(Passed)",
    description:
      "심문자가 컴퓨터와 인간을 구분하지 못함. 컴퓨터는 인간처럼 자연스럽게 대화하며 감정 표현, 실수, 주관적 의견 등을 보여줌.",
    result: "컴퓨터가 생각할 수 있다고 판단 가능",
    color: "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700",
    textColor: "text-green-700 dark:text-green-300",
  },
  {
    label: "실패(Failed)",
    description:
      "심문자가 컴퓨터를 식별해냄. 컴퓨터가 지나치게 정확하거나, 반복적 패턴, 감정적 깊이 부족 등의 단서를 노출.",
    result: "컴퓨터가 생각한다고 볼 수 없음",
    color: "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700",
    textColor: "text-red-700 dark:text-red-300",
  },
];

export default function TuringTestDemo() {
  const [revealedQA, setRevealedQA] = useState<number | null>(null);
  const [scenarioIdx, setScenarioIdx] = useState(0);

  return (
    <section>
      <SectionTitle
        title="튜링 테스트 (Turing Test)"
        subtitle="Alan Turing이 컴퓨터의 지능적 행동 능력을 평가하기 위해 제안한 방법. 평가자가 가려진 사람과 컴퓨터를 대상으로 대화하여 구분하는 검사."
      />

      {/* 3 Roles Diagram */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-center text-sm font-semibold text-gray-500">
          튜링 테스트 구조
        </h3>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-12">
          {/* Person A */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex w-40 flex-col items-center rounded-xl border-2 border-indigo-300 bg-indigo-50 p-4 dark:border-indigo-600 dark:bg-indigo-950"
          >
            <div className="mb-2 text-3xl">👤</div>
            <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
              A (인간)
            </span>
            <span className="mt-1 text-xs text-gray-500">
              자연스러운 대화
            </span>
          </motion.div>

          {/* Interrogator C */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex w-40 flex-col items-center rounded-xl border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-600 dark:bg-amber-950"
          >
            <div className="mb-2 text-3xl">🔍</div>
            <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
              C (심문자)
            </span>
            <span className="mt-1 text-center text-xs text-gray-500">
              텍스트로만 소통하며 A, B를 구분 시도
            </span>
          </motion.div>

          {/* Computer B */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex w-40 flex-col items-center rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-600 dark:bg-emerald-950"
          >
            <div className="mb-2 text-3xl">🖥️</div>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
              B (컴퓨터)
            </span>
            <span className="mt-1 text-xs text-gray-500">
              인간처럼 대화 시도
            </span>
          </motion.div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          심문자 C는 A와 B에게 텍스트로만 질문하며, 누가 인간이고 누가 컴퓨터인지 판별
        </div>
      </div>

      {/* Q&A Exchanges */}
      <div className="mb-8">
        <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          대화 예시{" "}
          <span className="font-normal text-gray-400">
            (클릭하여 응답 확인)
          </span>
        </h3>
        <div className="space-y-3">
          {qaExchanges.map((qa, i) => (
            <div key={i}>
              <button
                onClick={() => setRevealedQA(revealedQA === i ? null : i)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Q: {qa.question}
                  </span>
                  <motion.span
                    animate={{ rotate: revealedQA === i ? 180 : 0 }}
                    className="text-gray-400"
                  >
                    ▼
                  </motion.span>
                </div>
              </button>
              <AnimatePresence>
                {revealedQA === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-2 border border-t-0 border-gray-200 bg-gray-50 p-4 sm:grid-cols-2 dark:border-gray-700 dark:bg-gray-800">
                      <div className="rounded-lg bg-indigo-50 p-3 dark:bg-indigo-900/20">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          A (인간)
                        </span>
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                          {qa.humanAnswer}
                        </p>
                      </div>
                      <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          B (컴퓨터)
                        </span>
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                          {qa.computerAnswer}
                        </p>
                      </div>
                    </div>
                    <div className="border border-t-0 border-gray-200 bg-amber-50 p-3 text-center text-xs text-amber-700 dark:border-gray-700 dark:bg-amber-900/20 dark:text-amber-300">
                      심문자 C: 누가 인간이고 누가 컴퓨터일까?
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Toggle */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          테스트 결과 시나리오
        </h3>
        <div className="mb-4 flex gap-2">
          {scenarios.map((s, i) => (
            <button
              key={i}
              onClick={() => setScenarioIdx(i)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                scenarioIdx === i
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={scenarioIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`rounded-lg border p-4 ${scenarios[scenarioIdx].color}`}
          >
            <p className={`text-sm font-medium ${scenarios[scenarioIdx].textColor}`}>
              {scenarios[scenarioIdx].description}
            </p>
            <p className="mt-3 text-sm font-bold text-gray-800 dark:text-gray-200">
              결론: {scenarios[scenarioIdx].result}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 rounded-lg bg-indigo-50 p-3 dark:bg-indigo-900/20">
          <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
            Turing의 핵심 통찰: 심문자가 컴퓨터와 인간을 구분할 수 없다면, 그
            기계는 &quot;생각할 수 있다&quot;고 볼 수 있다.
          </p>
        </div>
      </div>
    </section>
  );
}
