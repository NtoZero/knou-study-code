"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

const approaches = [
  {
    id: "symbolic",
    label: "기호처리 AI",
    color: "bg-indigo-500",
    sections: [
      {
        title: "물리적 기호 시스템 가설",
        author: "Herbert A. Simon, Allen Newell",
        content:
          "물리적 기호 시스템은 일반적인 지능적 행동을 위한 필요 충분한 수단을 가지고 있다.",
        significance:
          "인간이 행하는 지능적 작업을 수행하는 프로그램 작성이 가능하다는 믿음의 근거",
      },
    ],
    examples: [
      "일반문제풀이기 (GPS) — 범용 문제 해결 시도",
      "전문가 시스템 — 특정 분야 지식의 규칙 기반 추론 (Dendral, MYCIN)",
    ],
    keyIdea:
      "기호를 조작하는 시스템이 지능적 행동을 할 수 있다는 관점. 논리적 규칙과 기호 표현을 통해 지식을 처리.",
    perspectives: [
      {
        name: "계산심리학",
        desc: "사람과 동일한 방식으로 행동하는 프로그램을 통해 인간의 지능적 행동을 이해",
      },
      {
        name: "기계지능",
        desc: "컴퓨터로 프로그래밍할 수 있는 영역을 인간 작업영역으로 확장",
      },
    ],
  },
  {
    id: "statistical",
    label: "확률 및 통계",
    color: "bg-emerald-500",
    sections: [],
    examples: [
      "회귀분석 — 변수 간 관계를 수학적 모델로 표현",
      "베이즈 분류기 — 확률 기반 분류 알고리즘",
      "결정트리 — 조건 분기를 통한 의사결정",
      "서포트 벡터 머신 (SVM) — 데이터 분류를 위한 최적 경계면 탐색",
    ],
    keyIdea:
      "불확실성이 내재하는 추론 문제와 데이터 기반 예측·분류 문제에 확률 및 통계 이론을 활용하는 접근.",
    perspectives: [],
  },
  {
    id: "connectionism",
    label: "연결주의",
    color: "bg-violet-500",
    sections: [],
    examples: [
      "인공 신경망 (Artificial Neural Network) — 뉴런 간 연결 가중치 학습",
      "딥러닝 (Deep Learning) — 다층 신경망을 통한 특징 자동 추출",
      "퍼셉트론 (초기 모델) → 다층 퍼셉트론 → 합성곱 신경망 → 트랜스포머",
    ],
    keyIdea:
      "두뇌의 신경 체계에 착안한 접근. 인공 신경망과 딥러닝을 통해 데이터로부터 패턴을 학습.",
    perspectives: [],
  },
];

const learningMethods = [
  {
    method: "직접적인 지식의 전달",
    desc: "사람이 직접 지식이나 규칙을 시스템에 입력. 전문가 시스템 등에서 사용.",
    icon: "📝",
  },
  {
    method: "귀납적 지식 형성",
    desc: "많은 데이터(사례)로부터 일반적인 패턴이나 규칙을 스스로 학습. 머신러닝의 핵심.",
    icon: "📊",
  },
  {
    method: "외부의 긍정적/부정적 반응",
    desc: "행동에 대한 보상이나 페널티를 통해 최적 전략을 학습. 강화학습.",
    icon: "🎯",
  },
];

export default function AIApproaches() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section>
      <SectionTitle
        title="인공지능의 접근 방향"
        subtitle="기호처리 AI, 확률/통계적 접근, 연결주의 — 세 가지 주요 접근 방향과 머신러닝"
      />

      {/* 3-tab toggle */}
      <div className="mb-6 flex flex-wrap gap-2">
        {approaches.map((a, i) => (
          <button
            key={a.id}
            onClick={() => setActiveTab(i)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === i
                ? `${a.color} text-white`
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={approaches[activeTab].id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            {/* Key Idea */}
            <div className="mb-5 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <h4 className="mb-1 text-xs font-bold uppercase text-gray-500">
                핵심 개념
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {approaches[activeTab].keyIdea}
              </p>
            </div>

            {/* Symbolic AI special sections */}
            {approaches[activeTab].sections.map((section, i) => (
              <div
                key={i}
                className="mb-5 rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-700 dark:bg-indigo-900/20"
              >
                <h4 className="font-bold text-indigo-700 dark:text-indigo-300">
                  {section.title}
                </h4>
                <p className="mt-1 text-xs text-gray-500">{section.author}</p>
                <blockquote className="mt-3 border-l-2 border-indigo-300 pl-3 text-sm italic text-gray-700 dark:text-gray-300">
                  &ldquo;{section.content}&rdquo;
                </blockquote>
                <div className="mt-3 rounded bg-indigo-100 p-2 text-xs font-medium text-indigo-700 dark:bg-indigo-800/40 dark:text-indigo-300">
                  의의: {section.significance}
                </div>
              </div>
            ))}

            {/* Perspectives (Symbolic AI only) */}
            {approaches[activeTab].perspectives.length > 0 && (
              <div className="mb-5">
                <h4 className="mb-3 text-xs font-bold uppercase text-gray-500">
                  AI 접근 관점
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {approaches[activeTab].perspectives.map((p) => (
                    <div
                      key={p.name}
                      className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800"
                    >
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {p.name}
                      </span>
                      <p className="mt-1 text-xs text-gray-500">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Examples */}
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase text-gray-500">
                대표 기법/시스템
              </h4>
              <ul className="space-y-2">
                {approaches[activeTab].examples.map((ex, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Machine Learning Section */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-2 font-bold text-gray-800 dark:text-gray-200">
          머신러닝 (Machine Learning)
        </h3>
        <p className="mb-5 text-sm text-gray-500">
          수집된 정보로부터 문제풀이에 필요한 지식을 습득하여 시스템 스스로 행동을
          향상시키는 과정
        </p>

        <h4 className="mb-3 text-xs font-bold uppercase text-gray-500">
          학습 방식 3가지
        </h4>
        <div className="grid gap-4 sm:grid-cols-3">
          {learningMethods.map((lm) => (
            <motion.div
              key={lm.method}
              whileHover={{ scale: 1.02 }}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800"
            >
              <span className="text-2xl">{lm.icon}</span>
              <h4 className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                {lm.method}
              </h4>
              <p className="mt-1 text-xs text-gray-500">{lm.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Intelligence definition */}
      <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-700 dark:bg-indigo-900/20">
        <h3 className="mb-2 text-sm font-bold text-indigo-700 dark:text-indigo-300">
          지능(Intelligence)의 정의
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>문제해결 능력</strong>, <strong>학습 능력</strong>,{" "}
          <strong>지식 활용 능력</strong>, <strong>인지 능력</strong>, 다양한 상황에 대한{" "}
          <strong>적응 능력</strong> 등을 포괄하는 개념.
        </p>
        <div className="mt-3 text-xs text-gray-500">
          지능이 사용되는 문제의 예: 도형 패턴 인식 문제(IQ 테스트형 배열 추론),
          필기 숫자 인식 문제(MNIST 데이터 집합)
        </div>
      </div>
    </section>
  );
}
