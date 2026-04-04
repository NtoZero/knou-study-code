"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { ArrowRight, ArrowLeft, ChevronDown, Database, Brain, Monitor, User, BookOpen } from "lucide-react";

const architectureComponents = [
  {
    id: "kb",
    label: "지식베이스",
    icon: <Database size={24} />,
    color: "border-orange-400 bg-orange-50 dark:bg-orange-900/20",
    iconColor: "text-orange-500",
    details: [
      "사실(facts) + 규칙(rules) 저장",
      "불완전하거나 확률적인 정보 포함 가능",
      "경험적 규칙(heuristic rules) 포함",
      "특정 분야 전문 지식 체계화",
    ],
  },
  {
    id: "ie",
    label: "추론기관",
    icon: <Brain size={24} />,
    color: "border-amber-400 bg-amber-50 dark:bg-amber-900/20",
    iconColor: "text-amber-500",
    details: [
      "규칙 해석기(rule interpreter)",
      "스케줄러(scheduler)",
      "규칙 선택 및 실행 순서 결정",
      "전방향/후방향 추론 수행",
    ],
  },
  {
    id: "ui",
    label: "사용자 인터페이스",
    icon: <Monitor size={24} />,
    color: "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20",
    iconColor: "text-yellow-500",
    details: [
      "사용자와 시스템 간 상호작용",
      "질의 입력 및 결과 출력",
      "추론 과정 설명 기능",
    ],
  },
];

const devProcessSteps = [
  { label: "현장전문가", desc: "도메인 지식 보유", icon: <User size={18} /> },
  { label: "지식공학자", desc: "지식 추출 및 구조화", icon: <BookOpen size={18} /> },
  { label: "전문가 시스템", desc: "지식베이스 + 추론기관", icon: <Brain size={18} /> },
];

const devActivities = [
  "현장전문가에게 질의 및 문제 제시",
  "전문가로부터 해답/해결방법 수집",
  "지식공학자가 지식베이스 구축",
  "테스트 및 디버깅 반복",
];

export default function ExpertSystemOverview() {
  const [expandedComp, setExpandedComp] = useState<string | null>(null);
  const [showNeural, setShowNeural] = useState(false);

  const neuronWeights = [0.3, -0.5, 0.8, 0.2];
  const neuronInputs = [1.0, 0.5, 0.7, 0.3];
  const weightedSum = neuronInputs.reduce(
    (sum, inp, i) => sum + inp * neuronWeights[i],
    0
  );
  const activated = weightedSum > 0.5;

  return (
    <section>
      <SectionTitle
        title="전문가 시스템 & 인공 신경회로망"
        subtitle="전문가 시스템의 구조와 개발 과정, 인공 신경회로망의 기초"
      />

      {/* Architecture */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-lg font-bold">전문가 시스템 구조</h3>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          {architectureComponents.map((comp, i) => (
            <div key={comp.id} className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() =>
                  setExpandedComp(expandedComp === comp.id ? null : comp.id)
                }
                className={`flex w-44 flex-col items-center rounded-xl border-2 p-4 transition-colors ${comp.color} ${
                  expandedComp === comp.id
                    ? "ring-2 ring-orange-400 ring-offset-2"
                    : ""
                }`}
              >
                <div className={`mb-2 ${comp.iconColor}`}>{comp.icon}</div>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {comp.label}
                </span>
                <ChevronDown
                  size={14}
                  className={`mt-1 text-gray-400 transition-transform ${
                    expandedComp === comp.id ? "rotate-180" : ""
                  }`}
                />
              </motion.button>
              {i < architectureComponents.length - 1 && (
                <ArrowRight
                  size={20}
                  className="hidden text-gray-400 sm:block"
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {expandedComp && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
              {(() => {
                const comp = architectureComponents.find(
                  (c) => c.id === expandedComp
                )!;
                return (
                  <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
                    <h4 className="mb-2 text-sm font-bold text-orange-700 dark:text-orange-300">
                      {comp.label} 상세
                    </h4>
                    <ul className="space-y-1">
                      {comp.details.map((d, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-700 dark:text-gray-300"
                        >
                          - {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Development process */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-lg font-bold">개발 과정</h3>

        <div className="mb-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
          {devProcessSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-3 sm:gap-6">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                  {step.icon}
                </div>
                <span className="mt-1 text-xs font-bold text-gray-700 dark:text-gray-300">
                  {step.label}
                </span>
                <span className="text-[10px] text-gray-500">{step.desc}</span>
              </div>
              {i < devProcessSteps.length - 1 && (
                <div className="flex flex-col items-center">
                  <ArrowRight
                    size={16}
                    className="hidden text-gray-400 sm:block"
                  />
                  <ArrowLeft
                    size={16}
                    className="hidden text-gray-300 sm:block"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <h4 className="mb-2 text-xs font-semibold text-gray-500">
            주요 활동
          </h4>
          <ol className="space-y-1">
            {devActivities.map((act, i) => (
              <li
                key={i}
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                {i + 1}. {act}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Neural Network */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">인공 신경회로망</h3>
          <button
            onClick={() => setShowNeural(!showNeural)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              showNeural
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {showNeural ? "접기" : "뉴런 구조 보기"}
          </button>
        </div>

        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <h4 className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
              생물학적 뉴런
            </h4>
            <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <li>
                <strong>수상돌기</strong> (dendrite): 입력 신호 수신
              </li>
              <li>
                <strong>신경세포체</strong> (soma): 신호 처리
              </li>
              <li>
                <strong>축색돌기</strong> (axon): 출력 신호 전달
              </li>
              <li>
                <strong>신경연접</strong> (시냅스, synapse): 뉴런 간 연결부
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <h4 className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
              인공 뉴런
            </h4>
            <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <li>
                <strong>연결 가중치 벡터</strong>로 지식을 분산 저장
              </li>
              <li>입력 x 가중치의 합 계산</li>
              <li>활성화 함수로 출력 결정</li>
              <li>학습 = 가중치 조정</li>
            </ul>
          </div>
        </div>

        <AnimatePresence>
          {showNeural && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {/* Neuron diagram */}
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
                <h4 className="mb-3 text-center text-sm font-bold text-orange-700 dark:text-orange-300">
                  인공 뉴런 계산 시각화
                </h4>
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
                  {/* Inputs */}
                  <div className="space-y-2">
                    {neuronInputs.map((inp, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <span className="w-16 rounded bg-blue-100 px-2 py-1 text-center text-xs font-mono dark:bg-blue-900/30">
                          x{i + 1}={inp}
                        </span>
                        <span className="text-xs text-gray-400">x</span>
                        <span className="w-16 rounded bg-amber-100 px-2 py-1 text-center text-xs font-mono dark:bg-amber-900/30">
                          w{i + 1}={neuronWeights[i]}
                        </span>
                        <span className="text-xs text-gray-400">=</span>
                        <span className="w-16 rounded bg-gray-100 px-2 py-1 text-center text-xs font-mono dark:bg-gray-700">
                          {(inp * neuronWeights[i]).toFixed(2)}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Sum + activation */}
                  <div className="flex flex-col items-center gap-2">
                    <ArrowRight
                      size={20}
                      className="hidden text-gray-400 sm:block"
                    />
                    <div className="rounded-xl border-2 border-orange-400 bg-white p-3 text-center dark:bg-gray-800">
                      <span className="text-xs text-gray-500">Sum</span>
                      <p className="text-lg font-bold text-orange-600">
                        {weightedSum.toFixed(2)}
                      </p>
                    </div>
                    <ArrowRight
                      size={20}
                      className="hidden text-gray-400 sm:block"
                    />
                    <div className="rounded-xl border-2 border-amber-400 bg-white p-3 text-center dark:bg-gray-800">
                      <span className="text-xs text-gray-500">활성화</span>
                      <p className="text-lg font-bold text-amber-600">
                        f(sum)
                      </p>
                    </div>
                  </div>

                  {/* Output */}
                  <div className="flex flex-col items-center">
                    <ArrowRight
                      size={20}
                      className="hidden text-gray-400 sm:block"
                    />
                    <div
                      className={`rounded-xl border-2 p-4 text-center ${
                        activated
                          ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                          : "border-red-400 bg-red-50 dark:bg-red-900/20"
                      }`}
                    >
                      <span className="text-xs text-gray-500">출력</span>
                      <p
                        className={`text-xl font-bold ${
                          activated
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {activated ? "1 (활성)" : "0 (비활성)"}
                      </p>
                      <p className="mt-1 text-[10px] text-gray-400">
                        임계값: 0.5
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
