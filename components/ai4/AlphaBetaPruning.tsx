"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import StepControls from "@/components/common/StepControls";
import PseudocodeViewer from "@/components/common/PseudocodeViewer";

/* -------- Tree structure -------- */
interface ABNode {
  id: string;
  label: string;
  type: "MAX" | "MIN";
  value?: number; // leaf value
  children?: ABNode[];
}

const abTree: ABNode = {
  id: "A", label: "A", type: "MAX",
  children: [
    {
      id: "B", label: "B", type: "MIN",
      children: [
        {
          id: "D", label: "D", type: "MAX",
          children: [
            { id: "L1", label: "3", type: "MIN", value: 3 },
            { id: "L2", label: "17", type: "MIN", value: 17 },
          ],
        },
        {
          id: "E", label: "E", type: "MAX",
          children: [
            { id: "L3", label: "2", type: "MIN", value: 2 },
            { id: "L4", label: "12", type: "MIN", value: 12 },
          ],
        },
      ],
    },
    {
      id: "C", label: "C", type: "MIN",
      children: [
        {
          id: "F", label: "F", type: "MAX",
          children: [
            { id: "L5", label: "15", type: "MIN", value: 15 },
            { id: "L6", label: "25", type: "MIN", value: 25 },  // pruned
          ],
        },
        {
          id: "G", label: "G", type: "MAX",  // pruned entirely
          children: [
            { id: "L7", label: "?", type: "MIN", value: 0 },
            { id: "L8", label: "?", type: "MIN", value: 0 },
          ],
        },
      ],
    },
  ],
};

/* -------- Steps -------- */
interface ABStep {
  description: string;
  highlight: string[];
  pruned: string[];
  alphas: Record<string, string>;
  betas: Record<string, string>;
  computedValues: Record<string, number>;
  highlightedLines: number[];
}

const abSteps: ABStep[] = [
  {
    description: "루트 A에서 탐색 시작. alpha = -inf, beta = +inf",
    highlight: ["A"],
    pruned: [],
    alphas: { A: "-inf" },
    betas: { A: "+inf" },
    computedValues: {},
    highlightedLines: [0, 1],
  },
  {
    description: "A -> B (MIN) 탐색. alpha = -inf, beta = +inf 전달",
    highlight: ["A", "B"],
    pruned: [],
    alphas: { A: "-inf", B: "-inf" },
    betas: { A: "+inf", B: "+inf" },
    computedValues: {},
    highlightedLines: [2, 3, 6, 7],
  },
  {
    description: "B -> D (MAX) 탐색. alpha = -inf, beta = +inf 전달",
    highlight: ["B", "D"],
    pruned: [],
    alphas: { A: "-inf", B: "-inf", D: "-inf" },
    betas: { A: "+inf", B: "+inf", D: "+inf" },
    computedValues: {},
    highlightedLines: [8, 9, 14, 15],
  },
  {
    description: "D의 첫 자식 L1 = 3. D(MAX): maxValue = 3, alpha = 3",
    highlight: ["D", "L1"],
    pruned: [],
    alphas: { A: "-inf", B: "-inf", D: "3" },
    betas: { A: "+inf", B: "+inf", D: "+inf" },
    computedValues: { L1: 3 },
    highlightedLines: [16, 17, 18, 20],
  },
  {
    description: "D의 두 번째 자식 L2 = 17. D(MAX): maxValue = 17, alpha = 17. D 평가 완료 -> 17",
    highlight: ["D", "L2"],
    pruned: [],
    alphas: { A: "-inf", B: "-inf", D: "17" },
    betas: { A: "+inf", B: "+inf", D: "+inf" },
    computedValues: { L1: 3, L2: 17, D: 17 },
    highlightedLines: [16, 17, 18, 20],
  },
  {
    description: "D = 17이 B(MIN)에 전달. B: minValue = 17, beta = 17",
    highlight: ["B", "D"],
    pruned: [],
    alphas: { A: "-inf", B: "-inf" },
    betas: { A: "+inf", B: "17" },
    computedValues: { L1: 3, L2: 17, D: 17 },
    highlightedLines: [9, 10, 12],
  },
  {
    description: "B -> E (MAX) 탐색. alpha = -inf, beta = 17 전달",
    highlight: ["B", "E"],
    pruned: [],
    alphas: { A: "-inf", B: "-inf", E: "-inf" },
    betas: { A: "+inf", B: "17", E: "17" },
    computedValues: { L1: 3, L2: 17, D: 17 },
    highlightedLines: [8, 9, 14, 15],
  },
  {
    description: "E의 첫 자식 L3 = 2. E(MAX): maxValue = 2, alpha = 2",
    highlight: ["E", "L3"],
    pruned: [],
    alphas: { A: "-inf", B: "-inf", E: "2" },
    betas: { A: "+inf", B: "17", E: "17" },
    computedValues: { L1: 3, L2: 17, D: 17, L3: 2 },
    highlightedLines: [16, 17, 18, 20],
  },
  {
    description: "E의 두 번째 자식 L4 = 12. E(MAX): maxValue = 12. E 평가 완료 -> 12",
    highlight: ["E", "L4"],
    pruned: [],
    alphas: { A: "-inf", B: "-inf", E: "12" },
    betas: { A: "+inf", B: "17", E: "17" },
    computedValues: { L1: 3, L2: 17, D: 17, L3: 2, L4: 12, E: 12 },
    highlightedLines: [16, 17, 18, 20],
  },
  {
    description: "E = 12가 B(MIN)에 전달. B: minValue = min(17,12) = 12, beta = 12. B 평가 완료 -> 12",
    highlight: ["B", "E"],
    pruned: [],
    alphas: { A: "-inf", B: "-inf" },
    betas: { A: "+inf", B: "12" },
    computedValues: { L1: 3, L2: 17, D: 17, L3: 2, L4: 12, E: 12, B: 12 },
    highlightedLines: [9, 10, 12],
  },
  {
    description: "B = 12가 A(MAX)에 전달. A: maxValue = 12, alpha = 12",
    highlight: ["A", "B"],
    pruned: [],
    alphas: { A: "12" },
    betas: { A: "+inf" },
    computedValues: { L1: 3, L2: 17, D: 17, L3: 2, L4: 12, E: 12, B: 12 },
    highlightedLines: [3, 4],
  },
  {
    description: "A -> C (MIN) 탐색. alpha = 12, beta = +inf 전달",
    highlight: ["A", "C"],
    pruned: [],
    alphas: { A: "12", C: "12" },
    betas: { A: "+inf", C: "+inf" },
    computedValues: { L1: 3, L2: 17, D: 17, L3: 2, L4: 12, E: 12, B: 12 },
    highlightedLines: [2, 3, 6, 7],
  },
  {
    description: "C -> F (MAX) 탐색. alpha = 12, beta = +inf 전달",
    highlight: ["C", "F"],
    pruned: [],
    alphas: { A: "12", C: "12", F: "12" },
    betas: { A: "+inf", C: "+inf", F: "+inf" },
    computedValues: { L1: 3, L2: 17, D: 17, L3: 2, L4: 12, E: 12, B: 12 },
    highlightedLines: [8, 9, 14, 15],
  },
  {
    description: "F의 첫 자식 L5 = 15. F(MAX): maxValue = 15. beta(+inf) <= 15? No. alpha = 15",
    highlight: ["F", "L5"],
    pruned: [],
    alphas: { A: "12", C: "12", F: "15" },
    betas: { A: "+inf", C: "+inf", F: "+inf" },
    computedValues: { L1: 3, L2: 17, D: 17, L3: 2, L4: 12, E: 12, B: 12, L5: 15 },
    highlightedLines: [16, 17, 18, 19, 20],
  },
  {
    description: "F = 15가 C(MIN)에 전달. C: minValue = 15. alpha(12) >= 15? No. beta = 15",
    highlight: ["C", "F"],
    pruned: [],
    alphas: { A: "12", C: "12" },
    betas: { A: "+inf", C: "15" },
    computedValues: { L1: 3, L2: 17, D: 17, L3: 2, L4: 12, E: 12, B: 12, L5: 15, F: 15 },
    highlightedLines: [9, 10, 11, 12],
  },
  {
    description: "C -> G (MAX) 탐색. alpha = 12, beta = 15 전달. 아직 가지치기 조건 미충족",
    highlight: ["C", "G"],
    pruned: [],
    alphas: { A: "12", C: "12", G: "12" },
    betas: { A: "+inf", C: "15", G: "15" },
    computedValues: { L1: 3, L2: 17, D: 17, L3: 2, L4: 12, E: 12, B: 12, L5: 15, F: 15 },
    highlightedLines: [8, 9, 14, 15],
  },
  {
    description: "G 탐색 시작하면 어떤 값이든 C의 결과는 <= 15. A의 alpha = 12이므로 C <= 15 >= 12 -> C 선택 가능. 하지만 G에서 beta <= v 조건을 확인 필요. G의 첫 자식이 15 이상이면 beta(15) <= v -> 가지치기 발생!",
    highlight: ["G"],
    pruned: [],
    alphas: { A: "12", C: "12", G: "12" },
    betas: { A: "+inf", C: "15", G: "15" },
    computedValues: { L1: 3, L2: 17, D: 17, L3: 2, L4: 12, E: 12, B: 12, L5: 15, F: 15 },
    highlightedLines: [16, 17, 19],
  },
  {
    description: "실제로 C의 minValue = 15이고 alpha(12) < 15. G 탐색 결과와 관계없이 C >= 12 가능. C 평가 완료 -> 15 (최선). A: max(12, 15) = 15. 최종 선택: C",
    highlight: ["A", "C"],
    pruned: [],
    alphas: { A: "15" },
    betas: { A: "+inf" },
    computedValues: { L1: 3, L2: 17, D: 17, L3: 2, L4: 12, E: 12, B: 12, L5: 15, F: 15, C: 15, A: 15 },
    highlightedLines: [3, 4],
  },
];

/* -------- Pseudocode -------- */
const pseudocodeLines = [
  { text: "function MiniMaxAB(n)", comment: "루트 함수" },
  { text: "  alpha <- -inf, beta <- +inf;" },
  { text: "  for each action:" },
  { text: "    value <- MinimizeAB(...)" },
  { text: "    if value > alpha then alpha <- value" },
  { text: "" },
  { text: "function MinimizeAB(n, alpha, beta, depth)", comment: "MIN 노드" },
  { text: "  minValue <- +inf;" },
  { text: "  for each action:" },
  { text: "    value <- MaximizeAB(...)" },
  { text: "    minValue <- min(value, minValue)" },
  { text: "    if alpha >= minValue then return", comment: "alpha 가지치기" },
  { text: "    beta <- min(minValue, beta)" },
  { text: "" },
  { text: "function MaximizeAB(n, alpha, beta, depth)", comment: "MAX 노드" },
  { text: "  maxValue <- -inf;" },
  { text: "  for each action:" },
  { text: "    value <- MinimizeAB(...)" },
  { text: "    maxValue <- max(value, maxValue)" },
  { text: "    if beta <= maxValue then return", comment: "beta 가지치기" },
  { text: "    alpha <- max(maxValue, alpha)" },
];

export default function AlphaBetaPruning() {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [showPseudo, setShowPseudo] = useState(false);

  const currentStep = step >= 0 && step < abSteps.length ? abSteps[step] : null;

  const handleNext = useCallback(() => {
    setStep((s) => Math.min(s + 1, abSteps.length - 1));
  }, []);

  const handlePrev = useCallback(() => {
    setStep((s) => Math.max(s - 1, -1));
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStep((s) => {
        if (s >= abSteps.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [playing]);

  const renderABNode = (node: ABNode) => {
    const isLeaf = !node.children || node.children.length === 0;
    const isHighlighted = currentStep?.highlight.includes(node.id) ?? false;
    const isPruned = currentStep?.pruned.includes(node.id) ?? false;
    const computedVal = currentStep?.computedValues[node.id];
    const alpha = currentStep?.alphas[node.id];
    const beta = currentStep?.betas[node.id];

    return (
      <div key={node.id} className={`flex flex-col items-center ${isPruned ? "opacity-30" : ""}`}>
        <motion.div
          animate={{
            scale: isHighlighted ? 1.12 : 1,
          }}
          className={`relative flex h-11 w-11 items-center justify-center rounded-full border-2 text-xs font-bold ${
            node.type === "MAX"
              ? "border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300"
              : "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
          } ${isHighlighted ? "ring-2 ring-fuchsia-400" : ""} ${isPruned ? "line-through" : ""}`}
        >
          {isLeaf ? node.value : node.label}
          {!isLeaf && computedVal !== undefined && (
            <motion.span
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-5 rounded bg-fuchsia-600 px-1 py-0.5 text-[9px] font-bold text-white"
            >
              {computedVal}
            </motion.span>
          )}
        </motion.div>

        {/* Alpha/Beta labels */}
        {!isLeaf && (alpha || beta) && (
          <div className="mt-0.5 flex gap-1 text-[9px]">
            {alpha && <span className="text-fuchsia-500">alpha={alpha}</span>}
            {beta && <span className="text-blue-500">beta={beta}</span>}
          </div>
        )}

        <span className={`text-[9px] font-medium ${
          node.type === "MAX" ? "text-fuchsia-400" : "text-blue-400"
        }`}>
          {isLeaf ? "" : node.type}
        </span>

        {node.children && node.children.length > 0 && (
          <div className="mt-1 flex gap-2 sm:gap-4">
            {node.children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="mb-0.5 h-3 w-px bg-gray-300 dark:bg-gray-600" />
                {renderABNode(child)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section>
      <SectionTitle
        title="2. alpha-beta 가지치기"
        subtitle="탐색이 불필요한 가지를 잘라내어 탐색 성능 향상"
      />

      {/* Concept table */}
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-3 py-2 text-left font-bold">기호</th>
              <th className="px-3 py-2 text-left font-bold">의미</th>
              <th className="px-3 py-2 text-left font-bold">가지치기 조건</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-3 py-2 font-mono font-bold text-fuchsia-500">alpha</td>
              <td className="px-3 py-2">최대화 노드에서 지금까지 구한 <strong>가장 큰 가치</strong></td>
              <td className="px-3 py-2 text-xs">최소화 노드에서 후계노드 가치 v일 때 <strong>alpha &gt;= v</strong>이면 나머지 가지치기</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-mono font-bold text-blue-500">beta</td>
              <td className="px-3 py-2">최소화 노드에서 지금까지 구한 <strong>가장 작은 가치</strong></td>
              <td className="px-3 py-2 text-xs">최대화 노드에서 후계노드 가치 v일 때 <strong>beta &lt;= v</strong>이면 나머지 가지치기</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Interactive tree */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold">alpha-beta 가지치기 단계별 탐색</h3>
          <StepControls
            step={step + 1}
            totalSteps={abSteps.length + 1}
            playing={playing}
            onPlay={() => { setPlaying(true); if (step < 0) setStep(0); }}
            onStop={() => setPlaying(false)}
            onReset={() => { setPlaying(false); setStep(-1); }}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </div>

        <div className="flex justify-center overflow-x-auto pb-2">
          {renderABNode(abTree)}
        </div>

        <AnimatePresence mode="wait">
          {currentStep && (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-3 rounded-lg bg-fuchsia-50 p-3 text-xs text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-200"
            >
              <strong>Step {step + 1}:</strong> {currentStep.description}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pseudocode toggle */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <button
          onClick={() => setShowPseudo(!showPseudo)}
          className="flex w-full items-center justify-between p-4 text-sm font-bold"
        >
          <span>alpha-beta 가지치기 의사코드</span>
          <motion.span animate={{ rotate: showPseudo ? 180 : 0 }}>&#9660;</motion.span>
        </button>
        <AnimatePresence>
          {showPseudo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-gray-200 p-4 dark:border-gray-700"
            >
              <PseudocodeViewer
                lines={pseudocodeLines}
                highlightedLines={currentStep?.highlightedLines ?? []}
                accentColor="fuchsia"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
