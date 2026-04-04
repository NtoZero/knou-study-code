"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import PseudocodeViewer from "@/components/common/PseudocodeViewer";

/* ---------- Same tree as DFS ---------- */
interface GraphNode {
  id: string;
  x: number;
  y: number;
  children: string[];
}

const nodes: GraphNode[] = [
  { id: "S", x: 300, y: 40, children: ["A", "B"] },
  { id: "A", x: 150, y: 120, children: ["C", "D"] },
  { id: "B", x: 450, y: 120, children: ["E", "F"] },
  { id: "C", x: 75, y: 200, children: [] },
  { id: "D", x: 225, y: 200, children: ["G"] },
  { id: "E", x: 375, y: 200, children: [] },
  { id: "F", x: 525, y: 200, children: [] },
  { id: "G", x: 225, y: 280, children: [] },
];

const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

/* ---------- BFS simulation steps ---------- */
interface SimStep {
  open: string[];
  closed: string[];
  current: string | null;
  message: string;
  found: boolean;
  highlightedLines: number[];
}

function buildBFSSteps(): SimStep[] {
  const steps: SimStep[] = [];

  steps.push({
    open: ["S"],
    closed: [],
    current: null,
    message: "출발노드 S를 OPEN에 삽입",
    found: false,
    highlightedLines: [0],
  });

  // Expand S
  steps.push({
    open: ["A", "B"],
    closed: ["S"],
    current: "S",
    message: "S를 OPEN에서 제거 → CLOSED. S를 확장하여 후계노드 A, B 생성. OPEN 뒤에 삽입",
    found: false,
    highlightedLines: [1, 2, 3, 4, 5, 8, 9],
  });

  // Expand A (FIFO, A was added first)
  steps.push({
    open: ["B", "C", "D"],
    closed: ["S", "A"],
    current: "A",
    message: "A를 OPEN에서 제거 → CLOSED. A를 확장하여 후계노드 C, D 생성. OPEN 뒤에 삽입",
    found: false,
    highlightedLines: [1, 2, 3, 4, 5, 8, 9],
  });

  // Expand B
  steps.push({
    open: ["C", "D", "E", "F"],
    closed: ["S", "A", "B"],
    current: "B",
    message: "B를 OPEN에서 제거 → CLOSED. B를 확장하여 후계노드 E, F 생성. OPEN 뒤에 삽입",
    found: false,
    highlightedLines: [1, 2, 3, 4, 5, 8, 9],
  });

  // Expand C
  steps.push({
    open: ["D", "E", "F"],
    closed: ["S", "A", "B", "C"],
    current: "C",
    message: "C를 OPEN에서 제거 → CLOSED. C에는 후계노드 없음",
    found: false,
    highlightedLines: [1, 2, 3, 4, 5],
  });

  // Expand D
  steps.push({
    open: ["E", "F", "G"],
    closed: ["S", "A", "B", "C", "D"],
    current: "D",
    message: "D를 OPEN에서 제거 → CLOSED. D를 확장하여 후계노드 G 생성. G는 목표노드!",
    found: false,
    highlightedLines: [1, 2, 3, 4, 5, 6],
  });

  // Goal found
  steps.push({
    open: ["E", "F"],
    closed: ["S", "A", "B", "C", "D", "G"],
    current: "G",
    message: "G는 목표노드! 풀이 경로: S → A → D → G. 탐색 성공! (최단 경로 보장)",
    found: true,
    highlightedLines: [6, 7],
  });

  return steps;
}

const bfsSteps = buildBFSSteps();
const GOAL = "G";

const pseudocodeLines = [
  { text: "출발노드를 OPEN에 삽입;", comment: "초기화" },
  { text: "while not empty(OPEN) do", comment: "반복 탐색" },
  { text: "    n = OPEN의 제일 앞 노드;" },
  { text: "    n을 OPEN에서 제거하여 CLOSED에 넣음;" },
  { text: "    노드 n을 확장하여 모든 후계노드 생성;" },
  { text: "    후계노드에 부모노드 n 포인터 첨부;" },
  { text: "    if 후계노드 중 목표노드 존재 then" },
  { text: "        풀이경로 구성; return 탐색성공;", comment: "목표 발견!" },
  { text: "    else" },
  { text: "        후계노드를 OPEN의 뒤에 넣음;", comment: "FIFO — 큐" },
  { text: "    end-if;" },
  { text: "end-while;" },
  { text: "return 탐색실패;" },
];

export default function BFSSimulator() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentState = bfsSteps[step];

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, bfsSteps.length - 1));
  }, []);

  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const reset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!isPlaying) return;
    if (step >= bfsSteps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(next, 1200);
    return () => clearTimeout(timer);
  }, [isPlaying, step, next]);

  const solutionPath = ["S", "A", "D", "G"];

  const getNodeColor = (id: string) => {
    if (currentState.found && id === GOAL)
      return "fill-green-500 stroke-green-600";
    if (id === currentState.current)
      return "fill-cyan-500 stroke-cyan-600";
    if (currentState.closed.includes(id))
      return "fill-gray-400 stroke-gray-500";
    if (currentState.open.includes(id))
      return "fill-cyan-200 stroke-cyan-400 dark:fill-cyan-800 dark:stroke-cyan-600";
    return "fill-white stroke-gray-300 dark:fill-gray-800 dark:stroke-gray-600";
  };

  const getTextColor = (id: string) => {
    if (id === currentState.current || (currentState.found && id === GOAL))
      return "fill-white";
    if (currentState.closed.includes(id)) return "fill-white";
    return "fill-gray-700 dark:fill-gray-300";
  };

  return (
    <section>
      <SectionTitle
        title="4. 너비우선 탐색 (BFS) 시뮬레이터"
        subtitle="OPEN은 큐(FIFO) — 생성된 순서에 따라 노드를 확장. 최단경로 보장"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Graph */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            탐색 트리 (목표: G)
          </h3>
          <svg viewBox="0 0 600 330" className="w-full">
            {nodes.map((node) =>
              node.children.map((childId) => {
                const child = nodeMap[childId];
                const isOnPath =
                  currentState.found &&
                  solutionPath.includes(node.id) &&
                  solutionPath.includes(childId) &&
                  Math.abs(
                    solutionPath.indexOf(node.id) -
                      solutionPath.indexOf(childId)
                  ) === 1;
                return (
                  <line
                    key={`${node.id}-${childId}`}
                    x1={node.x}
                    y1={node.y}
                    x2={child.x}
                    y2={child.y}
                    className={
                      isOnPath
                        ? "stroke-green-500"
                        : "stroke-gray-300 dark:stroke-gray-600"
                    }
                    strokeWidth={isOnPath ? 3 : 2}
                  />
                );
              })
            )}
            {nodes.map((node) => (
              <g key={node.id}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={22}
                  className={getNodeColor(node.id)}
                  strokeWidth={2}
                  animate={{
                    scale: node.id === currentState.current ? [1, 1.15, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  className={`text-sm font-bold ${getTextColor(node.id)}`}
                >
                  {node.id}
                </text>
              </g>
            ))}
          </svg>

          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-cyan-500" /> 현재 노드
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-cyan-200 dark:bg-cyan-800" /> OPEN
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-gray-400" /> CLOSED
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-green-500" /> 목표
            </span>
          </div>
        </div>

        {/* Pseudocode + lists */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            너비우선 탐색 알고리즘
          </h3>
          <PseudocodeViewer
            lines={pseudocodeLines}
            highlightedLines={currentState.highlightedLines}
            accentColor="cyan"
          />

          <div className="mt-4 space-y-3">
            <div className="rounded-lg bg-cyan-50 p-3 dark:bg-cyan-950">
              <h4 className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                OPEN (큐 — FIFO)
              </h4>
              <div className="mt-1 flex flex-wrap gap-1">
                {currentState.open.length === 0 ? (
                  <span className="text-xs text-gray-400">(비어 있음)</span>
                ) : (
                  currentState.open.map((id, i) => (
                    <span
                      key={`${id}-${i}`}
                      className="rounded bg-cyan-200 px-2 py-0.5 text-xs font-medium text-cyan-800 dark:bg-cyan-800 dark:text-cyan-200"
                    >
                      {id}
                      {i === 0 && (
                        <span className="ml-1 text-[10px] text-cyan-600 dark:text-cyan-400">
                          (앞)
                        </span>
                      )}
                      {i === currentState.open.length - 1 &&
                        currentState.open.length > 1 && (
                          <span className="ml-1 text-[10px] text-cyan-600 dark:text-cyan-400">
                            (뒤)
                          </span>
                        )}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
              <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                CLOSED
              </h4>
              <div className="mt-1 flex flex-wrap gap-1">
                {currentState.closed.length === 0 ? (
                  <span className="text-xs text-gray-400">(비어 있음)</span>
                ) : (
                  currentState.closed.map((id) => (
                    <span
                      key={id}
                      className="rounded bg-gray-300 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {id}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step message */}
      <div className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-950">
        <div className="flex items-start gap-2">
          <span className="shrink-0 rounded bg-cyan-500 px-2 py-0.5 text-xs font-bold text-white">
            Step {step}
          </span>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {currentState.message}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          초기화
        </button>
        <button
          onClick={prev}
          disabled={step === 0}
          className="rounded-lg bg-cyan-100 px-4 py-2 text-sm font-medium text-cyan-700 transition-colors hover:bg-cyan-200 disabled:opacity-40 dark:bg-cyan-900/40 dark:text-cyan-300 dark:hover:bg-cyan-800/60"
        >
          ◀ 이전
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-600"
        >
          {isPlaying ? "⏸ 일시정지" : "▶ 재생"}
        </button>
        <button
          onClick={next}
          disabled={step === bfsSteps.length - 1}
          className="rounded-lg bg-cyan-100 px-4 py-2 text-sm font-medium text-cyan-700 transition-colors hover:bg-cyan-200 disabled:opacity-40 dark:bg-cyan-900/40 dark:text-cyan-300 dark:hover:bg-cyan-800/60"
        >
          다음 ▶
        </button>
      </div>

      {/* DFS vs BFS comparison */}
      <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <h3 className="px-4 pt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          DFS vs BFS 비교
        </h3>
        <table className="mt-2 w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                비교 항목
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                깊이우선 탐색 (DFS)
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                너비우선 탐색 (BFS)
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-4 py-3 font-medium">OPEN 구조</td>
              <td className="px-4 py-3">스택 (LIFO)</td>
              <td className="px-4 py-3">큐 (FIFO)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-4 py-3 font-medium">후계노드 삽입 위치</td>
              <td className="px-4 py-3">
                OPEN의 <strong className="text-cyan-600 dark:text-cyan-400">앞</strong>
              </td>
              <td className="px-4 py-3">
                OPEN의 <strong className="text-cyan-600 dark:text-cyan-400">뒤</strong>
              </td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-4 py-3 font-medium">최단경로 보장</td>
              <td className="px-4 py-3 text-red-500">X</td>
              <td className="px-4 py-3 text-green-500">O</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">깊이제한</td>
              <td className="px-4 py-3">필요</td>
              <td className="px-4 py-3">불필요</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
