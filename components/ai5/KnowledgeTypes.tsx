"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { Code, BookOpen, Network } from "lucide-react";

interface KnowledgeType {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  textColor: string;
  description: string;
  characteristics: string[];
  example: string;
}

const knowledgeTypes: KnowledgeType[] = [
  {
    id: "procedural",
    label: "절차적 지식",
    icon: <Code size={20} />,
    color: "bg-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    textColor: "text-orange-700 dark:text-orange-300",
    description:
      "어떤 경우에 무엇을 어떻게 해야 하는지를 나타내는 지식. 제어 정보가 지식 자체에 내포되어 있음.",
    characteristics: [
      "제어 정보가 지식 자체에 내포",
      "프로그래밍 언어의 명령어 집합과 유사",
      "조건-행동 쌍으로 표현 (IF-THEN 규칙)",
      "실행 순서가 명시적",
    ],
    example: "IF 체온 > 38도 THEN 해열제 투여",
  },
  {
    id: "declarative",
    label: "선언적 지식",
    icon: <BookOpen size={20} />,
    color: "bg-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    textColor: "text-amber-700 dark:text-amber-300",
    description:
      "상호 독립적이고 단편적인 지식을 나열하는 방식. 별도의 추론기관이 필요함.",
    characteristics: [
      "상호 독립적/단편적 지식 나열",
      "별도의 추론기관 필요",
      "지식의 편집/획득/검색이 용이",
      "정적(static)인 성격",
    ],
    example: "고양이는 포유류이다. 포유류는 동물이다.",
  },
  {
    id: "neural",
    label: "신경망 지식",
    icon: <Network size={20} />,
    color: "bg-red-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    textColor: "text-red-700 dark:text-red-300",
    description:
      "뉴런 연결의 가중치 형태로 지식이 분산 저장됨. 개별 지식이 명시적으로 드러나지 않음.",
    characteristics: [
      "뉴런 연결의 가중치 형태로 분산 저장",
      "개별 지식이 드러나지 않음",
      "학습을 통해 가중치 조정",
      "패턴 인식에 강점",
    ],
    example: "이미지 분류: 가중치 벡터가 '고양이'패턴을 학습",
  },
];

const comparisonRows = [
  {
    feature: "지식 저장 방식",
    procedural: "조건-행동 규칙",
    declarative: "독립적 사실 나열",
    neural: "가중치 분산 저장",
  },
  {
    feature: "추론 방식",
    procedural: "내포된 제어 흐름",
    declarative: "별도 추론기관",
    neural: "신경망 활성화",
  },
  {
    feature: "지식 수정",
    procedural: "규칙 수정 필요",
    declarative: "용이",
    neural: "재학습 필요",
  },
  {
    feature: "가독성",
    procedural: "중간",
    declarative: "높음",
    neural: "낮음 (블랙박스)",
  },
  {
    feature: "예시",
    procedural: "프로그래밍 언어",
    declarative: "논리식, 시맨틱 네트",
    neural: "인공 신경회로망",
  },
];

export default function KnowledgeTypes() {
  const [activeType, setActiveType] = useState<string>("procedural");

  const current = knowledgeTypes.find((t) => t.id === activeType)!;

  return (
    <section>
      <SectionTitle
        title="지식의 유형"
        subtitle="절차적 지식, 선언적 지식, 신경망 지식의 특성 비교"
      />

      {/* Toggle buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {knowledgeTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveType(type.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeType === type.id
                ? `${type.color} text-white`
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {type.icon}
            {type.label}
          </button>
        ))}
      </div>

      {/* Detail Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeType}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`mb-8 rounded-xl border p-6 ${current.bgColor} border-gray-200 dark:border-gray-700`}
        >
          <div className="flex items-center gap-2 mb-3">
            {current.icon}
            <h3 className={`text-lg font-bold ${current.textColor}`}>
              {current.label}
            </h3>
          </div>
          <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
            {current.description}
          </p>

          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              특성
            </h4>
            <ul className="space-y-1">
              {current.characteristics.map((char, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                  {char}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-white/60 p-3 dark:bg-gray-800/60">
            <span className="text-xs font-semibold text-gray-500">예시:</span>
            <p className="mt-1 font-mono text-xs text-gray-700 dark:text-gray-300">
              {current.example}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Comparison Table */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          지식 유형 비교표
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-3 py-2 text-left text-gray-500">구분</th>
                <th className="px-3 py-2 text-left text-orange-600 dark:text-orange-400">
                  절차적 지식
                </th>
                <th className="px-3 py-2 text-left text-amber-600 dark:text-amber-400">
                  선언적 지식
                </th>
                <th className="px-3 py-2 text-left text-red-600 dark:text-red-400">
                  신경망 지식
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 dark:border-gray-800"
                >
                  <td className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                    {row.feature}
                  </td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                    {row.procedural}
                  </td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                    {row.declarative}
                  </td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                    {row.neural}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
