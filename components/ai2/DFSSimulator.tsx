"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import PseudocodeViewer from "@/components/common/PseudocodeViewer";

/* ---------- Tree structure ---------- */
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

/* ---------- DFS simulation steps ---------- */
interface SimStep {
  open: string[];
  closed: string[];
  current: string | null;
  message: string;
  found: boolean;
  highlightedLines: number[];
}

function buildDFSSteps(): SimStep[] {
  const steps: SimStep[] = [];
  // Initial
  steps.push({
    open: ["S"],
    closed: [],
    current: null,
    message: "출발노드 S를 OPEN에 삽입",
    found: false,
    highlightedLines: [0],
  });

  // Step 1: expand S
  steps.push({
    open: ["A", "B"],
    closed: ["S"],
    current: "S",
    message: "S를 OPEN에서 제거 → CLOSED. S를 확장하여 후계노드 A, B 생성. OPEN 앞에 삽입",
    found: false,
    highlightedLines: [1, 2, 3, 4, 5, 6, 9],
  });

  // Step 2: expand A (LIFO, A is at front)
  steps.push({
    open: ["C", "D", "B"],
    closed: ["S", "A"],
    current: "A",
    message: "A를 OPEN에서 제거 → CLOSED. A를 확장하여 후계노드 C, D 생성. OPEN 앞에 삽입",
    found: false,
    highlightedLines: [1, 2, 3, 4, 5, 6, 9],
  });

  // Step 3: expand C (LIFO)
  steps.push({
    open: ["D", "B"],
    closed: ["S", "A", "C"],
    current: "C",
    message: "C를 OPEN에서 제거 → CLOSED. C에는 후계노드 없음. 백트래킹",
    found: false,
    highlightedLines: [1, 2, 3, 4, 5, 6],
  });

  // Step 4: expand D
  steps.push({
    open: ["G", "B"],
    closed: ["S", "A", "C", "D"],
    current: "D",
    message: "D를 OPEN에서 제거 → CLOSED. D를 확장하여 후계노드 G 생성. OPEN 앞에 삽입",
    found: false,
    highlightedLines: [1, 2, 3, 4, 5, 6, 9],
  });

  // Step 5: G is goal
  steps.push({
    open: ["B"],
    closed: ["S", "A", "C", "D", "G"],
    current: "G",
    message: "G는 목표노드! 풀이 경로: S → A → D → G. 탐색 성공!",
    found: true,
    highlightedLines: [1, 2, 3, 4, 5, 6, 7, 8],
  });

  return steps;
}

const dfsSteps = buildDFSSteps();
const GOAL = "G";

const pseudocodeLines = [
  { text: "출발노드를 OPEN에 삽입;", comment: "초기화" },
  { text: "while not empty(OPEN) do", comment: "반복 탐색" },
  { text: "    n = OPEN의 제일 앞 노드;" },
  { text: "    n을 OPEN에서 제거하여 CLOSED에 넣음;" },
  { text: "    if depth(n) < 깊이제한 then", comment: "깊이제한 확인" },
  { text: "        노드 n을 확장하여 모든 후계노드 생성;" },
  { text: "        후계노드에 부모노드 n 포인터 첨부;" },
  { text: "        if 후계노드 중 목표노드 존재 then" },
  { text: "            풀이경로 구성; return 탐색성공;", comment: "목표 발견!" },
  { text: "        else 후계노드를 OPEN의 앞에 넣음;", comment: "LIFO — 스택" },
  { text: "        end-if;" },
  { text: "    end-if" },
  { text: "end-while" },
  { text: "return 탐색실패;" },
];

export default function DFSSimulator() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentState = dfsSteps[step];

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, dfsSteps.length - 1));
  }, []);

  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const reset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!isPlaying) return;
    if (step >= dfsSteps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(next, 1200);
    return () => clearTimeout(timer);
  }, [isPlaying, step, next]);

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

  // Path highlight for found state
  const solutionPath = ["S", "A", "D", "G"];

  return (
    <section>
      <SectionTitle
        title="3. 깊이우선 탐색 (DFS) 시뮬레이터"
        subtitle="OPEN은 스택(LIFO) — 가장 최근에 생성된 노드를 먼저 확장"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Graph visualization */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            탐색 트리 (목표: G)
          </h3>
          <svg viewBox="0 0 600 330" className="w-full">
            {/* Edges */}
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
            {/* Nodes */}
            {nodes.map((node) => (
              <g key={node.id}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={22}
                  className={getNodeColor(node.id)}
                  strokeWidth={2}
                  animate={{
                    scale:
                      node.id === currentState.current ? [1, 1.15, 1] : 1,
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

          {/* Legend */}
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-cyan-500" />{" "}
              현재 노드
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-cyan-200 dark:bg-cyan-800" />{" "}
              OPEN
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-gray-400" />{" "}
              CLOSED
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-green-500" />{" "}
              목표
            </span>
          </div>
        </div>

        {/* Pseudocode */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            깊이우선 탐색 알고리즘
          </h3>
          <PseudocodeViewer
            lines={pseudocodeLines}
            highlightedLines={currentState.highlightedLines}
            accentColor="cyan"
          />

          <div className="mt-4 space-y-3">
            <div className="rounded-lg bg-cyan-50 p-3 dark:bg-cyan-950">
              <h4 className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                OPEN (스택 — LIFO)
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
          disabled={step === dfsSteps.length - 1}
          className="rounded-lg bg-cyan-100 px-4 py-2 text-sm font-medium text-cyan-700 transition-colors hover:bg-cyan-200 disabled:opacity-40 dark:bg-cyan-900/40 dark:text-cyan-300 dark:hover:bg-cyan-800/60"
        >
          다음 ▶
        </button>
      </div>

      {/* Key properties */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          깊이우선 탐색의 특성
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              깊이제한 (Depth Bound)
            </span>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              목표에 도달할 수 없는 경로를 무한히 탐색하는 것을 방지. 깊이제한
              도달 시 백트래킹
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              백트래킹 (Backtracking)
            </span>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              더 이상 진행할 수 없거나 깊이제한에 도달하면 이전 상태로 복귀하여
              다른 경로 탐색
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
