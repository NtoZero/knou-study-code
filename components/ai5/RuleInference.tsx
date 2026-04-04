"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { ArrowRight, ArrowLeft, Play } from "lucide-react";

const inferenceTypes = [
  {
    id: "deduction",
    label: "연역법 (Deduction)",
    formula: "A → B, A ⊢ B",
    description: "전제가 참이면 결론이 항상 참. 가장 확실한 추론 방법.",
    reliability: "항상 옳음",
    reliabilityColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    example: {
      premise: "모든 새는 날 수 있다. 참새는 새이다.",
      conclusion: "참새는 날 수 있다.",
    },
    color: "border-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    id: "abduction",
    label: "유도법 (Abduction)",
    formula: "A → B, B ⊢ A",
    description: "결과로부터 원인을 추정하는 역방향 추론. 유사추론이라고도 함.",
    reliability: "항상 옳지는 않음",
    reliabilityColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    example: {
      premise: "비가 오면 땅이 젖는다. 땅이 젖어 있다.",
      conclusion: "비가 왔다. (스프링클러일 수도 있음)",
    },
    color: "border-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  {
    id: "induction",
    label: "귀납법 (Induction)",
    formula: "관측 사례들 ⊢ 새로운 법칙",
    description: "구체적 사례로부터 일반적 법칙을 도출. 학습과 관련.",
    reliability: "확률적 (반례 존재 가능)",
    reliabilityColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    example: {
      premise: "백조1=흰색, 백조2=흰색, 백조3=흰색...",
      conclusion: "모든 백조는 흰색이다. (흑고니 반례 존재)",
    },
    color: "border-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
];

const forwardSteps = [
  { label: "사실", desc: "지식베이스의 사실 확인", color: "bg-blue-500" },
  { label: "정합", desc: "규칙 조건부와 사실 정합", color: "bg-amber-500" },
  { label: "선택", desc: "만족되는 규칙 선택", color: "bg-orange-500" },
  { label: "실행", desc: "결론부 실행, 새 사실 추가", color: "bg-red-500" },
];

const backwardSteps = [
  { label: "목표", desc: "달성할 목표 결론 설정", color: "bg-red-500" },
  { label: "역추적", desc: "목표를 결론부로 갖는 규칙 탐색", color: "bg-orange-500" },
  { label: "확인", desc: "규칙의 조건부 확인", color: "bg-amber-500" },
  { label: "검증", desc: "조건부가 사실인지 확인", color: "bg-blue-500" },
];

export default function RuleInference() {
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [animStep, setAnimStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = direction === "forward" ? forwardSteps : backwardSteps;

  const runAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimStep(-1);
    let step = 0;
    const interval = setInterval(() => {
      setAnimStep(step);
      step++;
      if (step >= steps.length) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 800);
  };

  return (
    <section>
      <SectionTitle
        title="규칙 기반 추론"
        subtitle="IF-THEN 규칙, 추론 유형, 전방향/후방향 추론"
      />

      {/* Rule format */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-3 text-lg font-bold">규칙 형식</h3>
        <div className="mb-4 flex justify-center">
          <div className="rounded-xl border-2 border-orange-300 bg-orange-50 px-8 py-4 text-center dark:border-orange-700 dark:bg-orange-950">
            <span className="font-mono text-lg font-bold text-orange-700 dark:text-orange-300">
              IF <span className="text-amber-600">ⓐ</span> THEN{" "}
              <span className="text-red-600">ⓑ</span>
            </span>
            <div className="mt-2 flex justify-center gap-6 text-xs text-gray-500">
              <span>
                <strong className="text-amber-600">ⓐ</strong> = 가정/전제조건
                (LHS)
              </span>
              <span>
                <strong className="text-red-600">ⓑ</strong> = 결론 (RHS)
              </span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>지식베이스 구성:</strong> 사실들(facts) + 규칙들(rules).{" "}
          <strong>추론기관</strong>이 규칙을 선택하고 실행하여 새로운 사실을
          도출.
        </p>
      </div>

      {/* 3 Inference types */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {inferenceTypes.map((type) => (
          <motion.div
            key={type.id}
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl border-2 p-4 ${type.color} ${type.bgColor}`}
          >
            <h4 className="mb-2 text-sm font-bold text-gray-800 dark:text-gray-200">
              {type.label}
            </h4>
            <div className="mb-2 rounded bg-white/60 px-2 py-1 text-center font-mono text-sm dark:bg-gray-800/60">
              {type.formula}
            </div>
            <p className="mb-2 text-xs text-gray-600 dark:text-gray-400">
              {type.description}
            </p>
            <span
              className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${type.reliabilityColor}`}
            >
              {type.reliability}
            </span>
            <div className="mt-3 rounded bg-white/40 p-2 dark:bg-gray-800/40">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>전제:</strong> {type.example.premise}
              </p>
              <p className="mt-1 text-xs font-medium text-gray-800 dark:text-gray-200">
                <strong>결론:</strong> {type.example.conclusion}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Forward / Backward Inference */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-lg font-bold">추론 방향</h3>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => {
              setDirection("forward");
              setAnimStep(-1);
            }}
            className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              direction === "forward"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            <ArrowRight size={14} />
            전방향 추론
          </button>
          <button
            onClick={() => {
              setDirection("backward");
              setAnimStep(-1);
            }}
            className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              direction === "backward"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            <ArrowLeft size={14} />
            후방향 추론
          </button>
          <button
            onClick={runAnimation}
            disabled={isAnimating}
            className="flex items-center gap-1 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-50 dark:bg-gray-200 dark:text-gray-800"
          >
            <Play size={14} />
            실행
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={direction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {direction === "forward"
                ? "사실로부터 출발하여 규칙의 조건부와 정합(matching)시킨 후, 만족되는 규칙의 결론부를 실행하여 새로운 사실을 추가하는 방식."
                : "달성할 목표 결론을 설정한 뒤, 그 결론을 도출할 수 있는 규칙을 역방향으로 추적하여 조건부의 사실 여부를 확인하는 방식."}
            </p>

            {/* Animated flow */}
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-4">
                  <motion.div
                    animate={{
                      scale: animStep >= i ? 1.1 : 1,
                      opacity: animStep >= i ? 1 : 0.4,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`flex h-20 w-20 flex-col items-center justify-center rounded-xl text-white ${s.color}`}
                  >
                    <span className="text-xs font-bold">{s.label}</span>
                    <span className="mt-1 text-center text-[10px] leading-tight">
                      {s.desc}
                    </span>
                  </motion.div>
                  {i < steps.length - 1 && (
                    <motion.div
                      animate={{ opacity: animStep > i ? 1 : 0.3 }}
                    >
                      {direction === "forward" ? (
                        <ArrowRight
                          size={18}
                          className="hidden text-gray-400 sm:block"
                        />
                      ) : (
                        <ArrowLeft
                          size={18}
                          className="hidden text-gray-400 sm:block"
                        />
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
