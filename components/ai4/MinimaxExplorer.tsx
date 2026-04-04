"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import StepControls from "@/components/common/StepControls";

/* -------- Tree Data -------- */
interface TreeNode {
  id: string;
  label: string;
  type: "MAX" | "MIN";
  value?: number;
  children?: TreeNode[];
}

const gameTree: TreeNode = {
  id: "A",
  label: "A",
  type: "MAX",
  children: [
    {
      id: "B",
      label: "B",
      type: "MIN",
      children: [
        {
          id: "D",
          label: "D",
          type: "MAX",
          children: [
            { id: "L1", label: "3", type: "MIN", value: 3 },
            { id: "L2", label: "12", type: "MIN", value: 12 },
          ],
        },
        {
          id: "E",
          label: "E",
          type: "MAX",
          children: [
            { id: "L3", label: "8", type: "MIN", value: 8 },
            { id: "L4", label: "2", type: "MIN", value: 2 },
          ],
        },
      ],
    },
    {
      id: "C",
      label: "C",
      type: "MIN",
      children: [
        {
          id: "F",
          label: "F",
          type: "MAX",
          children: [
            { id: "L5", label: "4", type: "MIN", value: 4 },
            { id: "L6", label: "6", type: "MIN", value: 6 },
          ],
        },
        {
          id: "G",
          label: "G",
          type: "MAX",
          children: [
            { id: "L7", label: "14", type: "MIN", value: 14 },
            { id: "L8", label: "5", type: "MIN", value: 5 },
          ],
        },
      ],
    },
  ],
};

/* Steps: evaluate leaves -> propagate up */
interface StepInfo {
  nodeId: string;
  computedValue: number;
  description: string;
  highlight: string[];
}

const steps: StepInfo[] = [
  { nodeId: "L1", computedValue: 3, description: "리프노드 L1의 평가값 = 3", highlight: ["L1"] },
  { nodeId: "L2", computedValue: 12, description: "리프노드 L2의 평가값 = 12", highlight: ["L2"] },
  { nodeId: "D", computedValue: 12, description: "D는 MAX 노드: max(3, 12) = 12", highlight: ["D", "L1", "L2"] },
  { nodeId: "L3", computedValue: 8, description: "리프노드 L3의 평가값 = 8", highlight: ["L3"] },
  { nodeId: "L4", computedValue: 2, description: "리프노드 L4의 평가값 = 2", highlight: ["L4"] },
  { nodeId: "E", computedValue: 8, description: "E는 MAX 노드: max(8, 2) = 8", highlight: ["E", "L3", "L4"] },
  { nodeId: "B", computedValue: 8, description: "B는 MIN 노드: min(12, 8) = 8", highlight: ["B", "D", "E"] },
  { nodeId: "L5", computedValue: 4, description: "리프노드 L5의 평가값 = 4", highlight: ["L5"] },
  { nodeId: "L6", computedValue: 6, description: "리프노드 L6의 평가값 = 6", highlight: ["L6"] },
  { nodeId: "F", computedValue: 6, description: "F는 MAX 노드: max(4, 6) = 6", highlight: ["F", "L5", "L6"] },
  { nodeId: "L7", computedValue: 14, description: "리프노드 L7의 평가값 = 14", highlight: ["L7"] },
  { nodeId: "L8", computedValue: 5, description: "리프노드 L8의 평가값 = 5", highlight: ["L8"] },
  { nodeId: "G", computedValue: 14, description: "G는 MAX 노드: max(14, 5) = 14", highlight: ["G", "L7", "L8"] },
  { nodeId: "C", computedValue: 6, description: "C는 MIN 노드: min(6, 14) = 6", highlight: ["C", "F", "G"] },
  { nodeId: "A", computedValue: 8, description: "A는 MAX 노드: max(8, 6) = 8 -> B 선택", highlight: ["A", "B", "C"] },
];

/* -------- Tic-tac-toe demo -------- */
interface TicTacToeState {
  board: (string | null)[];
  description: string;
  w: number;
  l: number;
  f: string;
}

const ticTacToeExamples: TicTacToeState[] = [
  { board: [null, null, null, null, null, null, null, null, null], description: "빈 판 (X 시점)", w: 8, l: 8, f: "0" },
  { board: [null, null, null, null, "X", null, null, null, null], description: "X가 중앙에 착수", w: 4, l: 2, f: "2" },
  { board: ["X", null, null, null, "X", null, null, null, null], description: "X가 좌상단에 착수", w: 4, l: 2, f: "2" },
  { board: ["X", null, null, null, "X", null, null, null, "X"], description: "X가 대각선 완성 -> 승리!", w: -1, l: -1, f: "infinity" },
];

export default function MinimaxExplorer() {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [tttIdx, setTttIdx] = useState(0);

  const computedValues: Record<string, number> = {};
  for (let i = 0; i <= step; i++) {
    if (i >= 0 && i < steps.length) {
      computedValues[steps[i].nodeId] = steps[i].computedValue;
    }
  }

  const highlighted = step >= 0 && step < steps.length ? steps[step].highlight : [];

  const handleNext = useCallback(() => {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }, []);

  const handlePrev = useCallback(() => {
    setStep((s) => Math.max(s - 1, -1));
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStep((s) => {
        if (s >= steps.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, [playing]);

  const renderNode = (node: TreeNode, depth: number) => {
    const isLeaf = !node.children || node.children.length === 0;
    const isHighlighted = highlighted.includes(node.id);
    const hasValue = node.id in computedValues;
    const displayValue = hasValue ? computedValues[node.id] : node.value;

    return (
      <div key={node.id} className="flex flex-col items-center">
        <motion.div
          animate={{
            scale: isHighlighted ? 1.15 : 1,
            boxShadow: isHighlighted ? "0 0 16px rgba(217,70,239,0.5)" : "0 0 0px transparent",
          }}
          className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
            node.type === "MAX"
              ? "border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300"
              : "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
          } ${isHighlighted ? "ring-2 ring-fuchsia-400" : ""}`}
        >
          {isLeaf ? displayValue : node.label}
          {!isLeaf && hasValue && (
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-5 rounded bg-fuchsia-600 px-1.5 py-0.5 text-[10px] font-bold text-white"
            >
              {computedValues[node.id]}
            </motion.span>
          )}
        </motion.div>
        <span className={`mt-0.5 text-[10px] font-medium ${
          node.type === "MAX" ? "text-fuchsia-500" : "text-blue-500"
        }`}>
          {isLeaf ? "" : node.type}
        </span>

        {node.children && node.children.length > 0 && (
          <div className="mt-2 flex gap-3 sm:gap-6">
            {node.children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="mb-1 h-4 w-px bg-gray-300 dark:bg-gray-600" />
                {renderNode(child, depth + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const ttt = ticTacToeExamples[tttIdx];

  return (
    <section>
      <SectionTitle
        title="1. 최대최소 탐색 (Minimax Search)"
        subtitle="상대방과의 대결에서 승리하기 위한 게임 전략"
      />

      {/* Concept cards */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {[
          { title: "최대화 (Maximize)", desc: "내 차례에서 나에게 가장 유리한 수를 선택", color: "border-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950" },
          { title: "최소화 (Minimize)", desc: "상대방은 나에게 가장 불리한 수를 선택할 것이라 가정", color: "border-blue-500 bg-blue-50 dark:bg-blue-950" },
          { title: "전략 핵심", desc: "나에게 최악인 선택(최소가치)을 하는 상대방 대상으로 나의 결정 가치 최대화", color: "border-gray-500 bg-gray-50 dark:bg-gray-900" },
        ].map((c) => (
          <div key={c.title} className={`rounded-lg border-l-4 p-4 ${c.color}`}>
            <h4 className="text-sm font-bold">{c.title}</h4>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Note on search depth */}
      <div className="mb-6 rounded-lg bg-amber-50 p-4 dark:bg-amber-950/50">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>탐색의 한계:</strong> 트리 규모가 매우 큰 경우 종단상태(승리/패배/무승부)까지 도달 불가.
          시스템 가용자원에 따라 <strong>탐색 깊이</strong>를 정하고, 정해진 깊이에 도달하면 <strong>경험적 지식을 반영한 평가함수</strong>로 노드의 가치를 추정.
        </p>
      </div>

      {/* Interactive game tree */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold">미니맥스 트리 단계별 평가</h3>
          <StepControls
            step={step + 1}
            totalSteps={steps.length + 1}
            playing={playing}
            onPlay={() => { setPlaying(true); if (step < 0) setStep(0); }}
            onStop={() => setPlaying(false)}
            onReset={() => { setPlaying(false); setStep(-1); }}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </div>

        <div className="flex justify-center overflow-x-auto pb-4">
          {renderNode(gameTree, 0)}
        </div>

        <AnimatePresence mode="wait">
          {step >= 0 && step < steps.length && (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 rounded-lg bg-fuchsia-50 p-3 text-sm text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-200"
            >
              <strong>Step {step + 1}:</strong> {steps[step].description}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-fuchsia-500 bg-fuchsia-50" />
            MAX 노드
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-blue-500 bg-blue-50" />
            MIN 노드
          </span>
        </div>
      </div>

      {/* Tic-tac-toe example */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-bold">삼목게임 (Tic-tac-toe) 평가함수 예시</h3>

        <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>평가함수 F = W - L</strong><br />
            W: 이길 가능성이 있는 행/열/대각선 수 | L: 질 가능성이 있는 행/열/대각선 수<br />
            승리: F = <span className="font-mono">+infinity</span> | 패배: F = <span className="font-mono">-infinity</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="grid grid-cols-3 gap-0.5">
            {ttt.board.map((cell, i) => (
              <div
                key={i}
                className="flex h-12 w-12 items-center justify-center border border-gray-300 bg-white text-lg font-bold dark:border-gray-600 dark:bg-gray-800"
              >
                <span className={cell === "X" ? "text-fuchsia-500" : cell === "O" ? "text-blue-500" : ""}>
                  {cell ?? ""}
                </span>
              </div>
            ))}
          </div>

          <div className="text-sm">
            <p className="font-medium">{ttt.description}</p>
            {ttt.f === "infinity" ? (
              <p className="mt-1 text-fuchsia-600 font-bold">F = infinity (승리!)</p>
            ) : (
              <>
                <p className="mt-1 text-gray-600 dark:text-gray-400">W = {ttt.w}, L = {ttt.l}</p>
                <p className="font-bold text-fuchsia-600">F = {ttt.f}</p>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {ticTacToeExamples.map((_, i) => (
            <button
              key={i}
              onClick={() => setTttIdx(i)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                tttIdx === i
                  ? "bg-fuchsia-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              상태 {i + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
