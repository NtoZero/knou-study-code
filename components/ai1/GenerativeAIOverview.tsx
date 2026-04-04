"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

const tabs = ["생성형 AI 개요", "문제점", "AI 분류"] as const;

const aiTypes = [
  {
    category: "챗봇 (Chatbot)",
    examples: ["ChatGPT", "Copilot", "Gemini"],
    icon: "💬",
    color: "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700",
  },
  {
    category: "Text-to-Image",
    examples: ["DALL-E", "Midjourney", "Stable Diffusion"],
    icon: "🎨",
    color: "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700",
  },
  {
    category: "Text-to-Video",
    examples: ["Sora", "Runway"],
    icon: "🎬",
    color: "bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700",
  },
];

const problems = [
  {
    title: "윤리적 문제",
    desc: "편향된 콘텐츠 생성, 딥페이크 등 사회적 문제 유발 가능",
    icon: "⚖️",
    color: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  },
  {
    title: "환각 (Hallucination)",
    desc: "사실과 다르거나 비논리적인 정보를 생성하는 현상",
    icon: "👻",
    color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
  },
  {
    title: "책임 소재 불분명",
    desc: "부정확하거나 해로운 내용에 대한 책임이 불분명",
    icon: "❓",
    color: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
  },
  {
    title: "설명 가능성 부족",
    desc: "정보 생성 및 결정 과정의 투명성과 신뢰성 부족",
    icon: "🔍",
    color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
  },
];

const capabilities = [
  { name: "지식 기반 동작 능력", icon: "📚" },
  { name: "데이터 분석 및 예측 능력", icon: "📊" },
  { name: "학습 능력", icon: "🎓" },
  { name: "사물 인지 능력", icon: "👁️" },
  { name: "자연어 이해·구사 능력", icon: "🗣️" },
  { name: "창조 능력", icon: "💡" },
  { name: "감성지능", icon: "❤️" },
];

export default function GenerativeAIOverview() {
  const [activeTab, setActiveTab] = useState(0);
  const [showStrong, setShowStrong] = useState(false);

  return (
    <section>
      <SectionTitle
        title="생성형 인공지능과 AI 분류"
        subtitle="대규모 데이터 집합을 학습하여 데이터에 내재한 패턴이나 구조를 습득하고 새로운 데이터를 생성하는 AI"
      />

      {/* Tab buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === i
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 0 && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* 판별 vs 생성 모델 */}
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <h3 className="mb-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                판별 모델 vs 생성 모델
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/20">
                  <h4 className="mb-2 font-semibold text-blue-700 dark:text-blue-300">
                    판별 모델 (Discriminative)
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    입력 데이터가 어떤 범주에 속하는지 <strong>분류(classify)</strong>하는
                    모델. 기존 데이터의 경계를 학습하여 새로운 데이터를 분류.
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <span className="rounded bg-blue-200 px-2 py-1 dark:bg-blue-800">
                      입력 X
                    </span>
                    <span>→</span>
                    <span className="rounded bg-blue-300 px-2 py-1 dark:bg-blue-700">
                      분류 결과 Y
                    </span>
                  </div>
                </div>
                <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-700 dark:bg-indigo-900/20">
                  <h4 className="mb-2 font-semibold text-indigo-700 dark:text-indigo-300">
                    생성 모델 (Generative)
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    데이터의 분포를 학습하여 <strong>새로운 데이터를 생성</strong>하는
                    모델. 학습된 패턴과 구조를 기반으로 새로운 콘텐츠를 만들어냄.
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <span className="rounded bg-indigo-200 px-2 py-1 dark:bg-indigo-800">
                      학습 데이터
                    </span>
                    <span>→</span>
                    <span className="rounded bg-indigo-300 px-2 py-1 dark:bg-indigo-700">
                      새로운 데이터 생성
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 유형 카드 */}
            <div className="grid gap-4 sm:grid-cols-3">
              {aiTypes.map((type) => (
                <motion.div
                  key={type.category}
                  whileHover={{ scale: 1.02 }}
                  className={`rounded-xl border p-5 ${type.color}`}
                >
                  <span className="text-2xl">{type.icon}</span>
                  <h4 className="mt-2 font-bold text-gray-800 dark:text-gray-200">
                    {type.category}
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {type.examples.map((ex) => (
                      <span
                        key={ex}
                        className="rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800/70 dark:text-gray-300"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 1 && (
          <motion.div
            key="problems"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {problems.map((prob) => (
                <motion.div
                  key={prob.title}
                  whileHover={{ scale: 1.02 }}
                  className={`rounded-xl border p-5 ${prob.color}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{prob.icon}</span>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">
                      {prob.title}
                    </h4>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    {prob.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 2 && (
          <motion.div
            key="classification"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* 약한 AI vs 강한 AI 토글 */}
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <h3 className="mb-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                약한 AI vs 강한 AI (AGI)
              </h3>
              <div className="mb-4 flex items-center gap-3">
                <span
                  className={`text-sm font-medium ${!showStrong ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`}
                >
                  약한 AI
                </span>
                <button
                  onClick={() => setShowStrong(!showStrong)}
                  className={`relative h-7 w-14 rounded-full transition-colors ${
                    showStrong ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <motion.div
                    animate={{ x: showStrong ? 28 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm"
                  />
                </button>
                <span
                  className={`text-sm font-medium ${showStrong ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`}
                >
                  강한 AI (AGI)
                </span>
              </div>

              <AnimatePresence mode="wait">
                {!showStrong ? (
                  <motion.div
                    key="weak"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/20"
                  >
                    <h4 className="font-bold text-blue-700 dark:text-blue-300">
                      약한 인공지능 (Weak AI / Narrow AI)
                    </h4>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      특정 작업이나 한정된 범위의 작업을 수행하도록 설계된 시스템.
                      현재 대부분의 AI 시스템이 이에 해당.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded bg-blue-200 px-2 py-1 dark:bg-blue-800">
                        음성 인식
                      </span>
                      <span className="rounded bg-blue-200 px-2 py-1 dark:bg-blue-800">
                        이미지 분류
                      </span>
                      <span className="rounded bg-blue-200 px-2 py-1 dark:bg-blue-800">
                        추천 시스템
                      </span>
                      <span className="rounded bg-blue-200 px-2 py-1 dark:bg-blue-800">
                        체스/바둑 AI
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="strong"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-700 dark:bg-indigo-900/20"
                  >
                    <h4 className="font-bold text-indigo-700 dark:text-indigo-300">
                      인공 일반지능 (AGI / Strong AI)
                    </h4>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      사람이 할 수 있는 어떠한 지적 작업이든 사람만큼, 혹은 사람보다
                      더 잘 해낼 수 있는 능력을 갖춘 인공지능. 아직 실현되지 않은
                      목표.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded bg-indigo-200 px-2 py-1 dark:bg-indigo-800">
                        범용 문제 해결
                      </span>
                      <span className="rounded bg-indigo-200 px-2 py-1 dark:bg-indigo-800">
                        자기 인식
                      </span>
                      <span className="rounded bg-indigo-200 px-2 py-1 dark:bg-indigo-800">
                        창의적 사고
                      </span>
                      <span className="rounded bg-indigo-200 px-2 py-1 dark:bg-indigo-800">
                        감정 이해
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 지능적 시스템에 요구되는 7가지 능력 */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <h3 className="mb-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                지능적 시스템에 요구되는 능력 (7가지)
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {capabilities.map((cap, i) => (
                  <motion.div
                    key={cap.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800"
                  >
                    <span className="text-xl">{cap.icon}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {cap.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
