"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { ChevronDown, ArrowRight, ArrowLeft, Database, Brain, Lightbulb } from "lucide-react";

interface PyramidLayer {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  examples: string[];
  width: string;
}

const pyramidLayers: PyramidLayer[] = [
  {
    id: "knowledge",
    label: "지식 (Knowledge)",
    icon: <Lightbulb size={20} />,
    color: "text-orange-700 dark:text-orange-300",
    bgColor: "bg-orange-500",
    borderColor: "border-orange-600",
    description: "정보를 활용하여 의사결정에 사용할 수 있는 고차원적 이해",
    examples: [
      "판매 전략 수립: 여름에 아이스크림 재고 확대",
      "재고 관리: 겨울 의류 사전 발주",
      "마케팅 결정: 20대 여성 타겟 프로모션",
    ],
    width: "w-48 sm:w-56",
  },
  {
    id: "information",
    label: "정보 (Information)",
    icon: <Brain size={20} />,
    color: "text-amber-700 dark:text-amber-300",
    bgColor: "bg-amber-500",
    borderColor: "border-amber-600",
    description: "데이터를 분석/정리하여 의미를 부여한 결과",
    examples: [
      "월별 매출 현황 (1월: 500만원, 2월: 700만원...)",
      "품목별 매출 비율 (의류 40%, 식품 30%, 전자 30%)",
      "전년 대비 성장률 분석",
    ],
    width: "w-64 sm:w-72",
  },
  {
    id: "data",
    label: "데이터 (Data)",
    icon: <Database size={20} />,
    color: "text-yellow-700 dark:text-yellow-300",
    bgColor: "bg-yellow-500",
    borderColor: "border-yellow-600",
    description: "가공되지 않은 원시적 사실(fact)의 모음",
    examples: [
      "일시: 2024-01-15",
      "고객: 홍길동",
      "품목: 아이스크림",
      "수량: 3, 단가: 2000, 매출액: 6000",
    ],
    width: "w-80 sm:w-96",
  },
];

const knowledgeRequirements = [
  {
    title: "표현방법의 적합성",
    description: "지식을 자연스럽고 효과적으로 표현할 수 있어야 함",
  },
  {
    title: "추론의 적합성",
    description: "표현된 지식으로부터 새로운 사실을 추론할 수 있어야 함",
  },
  {
    title: "추론의 효율성",
    description: "추론 과정이 효율적으로 수행될 수 있어야 함",
  },
  {
    title: "지식 획득 능력",
    description: "새로운 지식을 쉽게 추가하고 기존 지식을 수정할 수 있어야 함",
  },
];

const mappingSteps = [
  {
    label: "정방향 사상",
    description: "사실/지식 -> 내부 표현",
    example: '"철수는 사람이다" -> Man(철수)',
    arrow: "right",
  },
  {
    label: "추론",
    description: "내부 표현으로 추론 수행",
    example: "Man(철수), ∀x(Man(x)→Think(x)) -> Think(철수)",
    arrow: "right",
  },
  {
    label: "역방향 사상",
    description: "내부 표현 -> 사실/지식",
    example: "Think(철수) -> \"철수는 생각한다\"",
    arrow: "left",
  },
];

export default function KnowledgePyramid() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [expandedReq, setExpandedReq] = useState<number | null>(null);

  return (
    <section>
      <SectionTitle
        title="데이터 - 정보 - 지식 피라미드"
        subtitle="데이터에서 정보로, 정보에서 지식으로의 발전 과정과 지식공학의 기초"
      />

      {/* Pyramid */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-6 text-center text-sm font-semibold text-gray-500">
          클릭하여 각 계층 상세 확인
        </h3>
        <div className="flex flex-col items-center gap-2">
          {pyramidLayers.map((layer) => (
            <div key={layer.id} className="flex flex-col items-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setActiveLayer(activeLayer === layer.id ? null : layer.id)
                }
                className={`${layer.width} ${layer.bgColor} rounded-lg px-4 py-3 text-center text-white shadow-md transition-all ${
                  activeLayer === layer.id
                    ? "ring-2 ring-offset-2 ring-orange-400"
                    : ""
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {layer.icon}
                  <span className="font-bold text-sm">{layer.label}</span>
                </div>
              </motion.button>

              <AnimatePresence>
                {activeLayer === layer.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="w-full max-w-md overflow-hidden"
                  >
                    <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                      <p className={`text-sm font-medium ${layer.color}`}>
                        {layer.description}
                      </p>
                      <ul className="mt-2 space-y-1">
                        {layer.examples.map((ex, i) => (
                          <li
                            key={i}
                            className="text-xs text-gray-600 dark:text-gray-400"
                          >
                            - {ex}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* 지식공학 */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-lg font-bold">
          지식공학 (Knowledge Engineering)
        </h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          특정 분야의 <strong>지식</strong>을 컴퓨터에 <strong>체계적으로 축적</strong>하여
          활용할 수 있도록 하는 기술 분야
        </p>

        {/* 지식기반 시스템 구조 */}
        <h4 className="mb-3 text-sm font-semibold text-orange-600 dark:text-orange-400">
          지식기반 시스템 구조
        </h4>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex w-44 flex-col items-center rounded-xl border-2 border-orange-300 bg-orange-50 p-4 dark:border-orange-600 dark:bg-orange-950"
          >
            <Database size={24} className="mb-2 text-orange-500" />
            <span className="text-sm font-bold text-orange-700 dark:text-orange-300">
              지식베이스
            </span>
            <span className="mt-1 text-center text-xs text-gray-500">
              지식 저장
            </span>
          </motion.div>

          <div className="flex items-center">
            <ArrowRight className="hidden text-gray-400 sm:block" size={20} />
            <ChevronDown className="text-gray-400 sm:hidden" size={20} />
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex w-44 flex-col items-center rounded-xl border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-600 dark:bg-amber-950"
          >
            <Brain size={24} className="mb-2 text-amber-500" />
            <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
              추론기관
            </span>
            <span className="mt-1 text-center text-xs text-gray-500">
              추론 수행
            </span>
          </motion.div>

          <div className="flex items-center">
            <ArrowRight className="hidden text-gray-400 sm:block" size={20} />
            <ChevronDown className="text-gray-400 sm:hidden" size={20} />
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex w-44 flex-col items-center rounded-xl border-2 border-yellow-300 bg-yellow-50 p-4 dark:border-yellow-600 dark:bg-yellow-950"
          >
            <Lightbulb size={24} className="mb-2 text-yellow-500" />
            <span className="text-sm font-bold text-yellow-700 dark:text-yellow-300">
              사용자 인터페이스
            </span>
            <span className="mt-1 text-center text-xs text-gray-500">
              상호작용
            </span>
          </motion.div>
        </div>
      </div>

      {/* 지식과 내부 표현 사이 사상 */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-lg font-bold">지식과 내부 표현 사이의 사상</h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          외부 세계의 사실/지식을 컴퓨터 내부 표현으로 변환하고, 추론 후 다시 해석하는 과정
        </p>

        <div className="space-y-4">
          {mappingSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: step.arrow === "left" ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mt-0.5 shrink-0">
                {step.arrow === "right" ? (
                  <ArrowRight className="text-orange-500" size={18} />
                ) : (
                  <ArrowLeft className="text-blue-500" size={18} />
                )}
              </div>
              <div>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {step.label}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {step.description}
                </span>
                <p className="mt-1 rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {step.example}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 rounded-lg bg-orange-50 p-3 dark:bg-orange-900/20">
          <p className="text-xs text-orange-700 dark:text-orange-300">
            <strong>전체 예시:</strong> &quot;철수는 사람이다&quot; → Man(철수),
            &quot;모든 사람은 생각한다&quot; → ∀x(Man(x)→Think(x)) →{" "}
            <strong>추론 결과:</strong> Think(철수) → &quot;철수는 생각한다&quot;
          </p>
        </div>
      </div>

      {/* 지식표현 요건 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-lg font-bold">지식표현의 4가지 요건</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {knowledgeRequirements.map((req, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                setExpandedReq(expandedReq === i ? null : i)
              }
              className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-left transition-colors hover:bg-orange-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-orange-900/10"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {req.title}
                </span>
              </div>
              <AnimatePresence>
                {expandedReq === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 overflow-hidden text-xs text-gray-600 dark:text-gray-400"
                  >
                    {req.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
