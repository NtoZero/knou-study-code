"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

/* ---------- 7-city road network ---------- */
interface CityNode {
  id: string;
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
  cost: number;
}

const cities: CityNode[] = [
  { id: "a", x: 80, y: 180 },
  { id: "b", x: 200, y: 60 },
  { id: "c", x: 200, y: 300 },
  { id: "d", x: 350, y: 200 },
  { id: "e", x: 450, y: 100 },
  { id: "f", x: 450, y: 300 },
  { id: "g", x: 570, y: 200 },
];

const cityMap = Object.fromEntries(cities.map((c) => [c.id, c]));

const edges: Edge[] = [
  { from: "a", to: "b", cost: 6 },
  { from: "a", to: "c", cost: 4 },
  { from: "b", to: "d", cost: 3 },
  { from: "b", to: "e", cost: 8 },
  { from: "c", to: "d", cost: 3 },
  { from: "c", to: "f", cost: 5 },
  { from: "d", to: "e", cost: 3 },
  { from: "d", to: "f", cost: 2 },
  { from: "e", to: "g", cost: 4 },
  { from: "f", to: "g", cost: 3 },
];

/* ---------- Simulation ---------- */
interface OpenEntry {
  id: string;
  g: number;
  parent: string | null;
}

interface SimStep {
  open: OpenEntry[];
  closed: OpenEntry[];
  current: OpenEntry | null;
  message: string;
  found: boolean;
  solutionPath?: string[];
}

function buildSteps(): SimStep[] {
  const steps: SimStep[] = [];

  // Step 0: init
  steps.push({
    open: [{ id: "a", g: 0, parent: null }],
    closed: [],
    current: null,
    message: "출발노드 a에 경로비용 g=0을 지정하여 OPEN에 삽입",
    found: false,
  });

  // Step 1: expand a (g=0)
  // neighbors: b(6), c(4)
  steps.push({
    open: [
      { id: "c", g: 4, parent: "a" },
      { id: "b", g: 6, parent: "a" },
    ],
    closed: [{ id: "a", g: 0, parent: null }],
    current: { id: "a", g: 0, parent: null },
    message:
      "a(g=0) 확장. 후계노드: b(g=0+6=6), c(g=0+4=4). OPEN을 g 오름차순 정렬",
    found: false,
  });

  // Step 2: expand c (g=4)
  // neighbors: d(4+3=7), f(4+5=9)
  steps.push({
    open: [
      { id: "b", g: 6, parent: "a" },
      { id: "d", g: 7, parent: "c" },
      { id: "f", g: 9, parent: "c" },
    ],
    closed: [
      { id: "a", g: 0, parent: null },
      { id: "c", g: 4, parent: "a" },
    ],
    current: { id: "c", g: 4, parent: "a" },
    message:
      "c(g=4) 확장. 후계노드: d(g=4+3=7), f(g=4+5=9). OPEN을 g 오름차순 정렬",
    found: false,
  });

  // Step 3: expand b (g=6)
  // neighbors: d(6+3=9 > 7 existing → discard), e(6+8=14)
  steps.push({
    open: [
      { id: "d", g: 7, parent: "c" },
      { id: "f", g: 9, parent: "c" },
      { id: "e", g: 14, parent: "b" },
    ],
    closed: [
      { id: "a", g: 0, parent: null },
      { id: "c", g: 4, parent: "a" },
      { id: "b", g: 6, parent: "a" },
    ],
    current: { id: "b", g: 6, parent: "a" },
    message:
      "b(g=6) 확장. d(g=9) > 기존 d(g=7) → 제거. e(g=14) OPEN에 추가",
    found: false,
  });

  // Step 4: expand d (g=7)
  // neighbors: e(7+3=10 < 14 → replace), f(7+2=9 = 9 existing → same, keep)
  steps.push({
    open: [
      { id: "f", g: 9, parent: "c" },
      { id: "e", g: 10, parent: "d" },
    ],
    closed: [
      { id: "a", g: 0, parent: null },
      { id: "c", g: 4, parent: "a" },
      { id: "b", g: 6, parent: "a" },
      { id: "d", g: 7, parent: "c" },
    ],
    current: { id: "d", g: 7, parent: "c" },
    message:
      "d(g=7) 확장. e(g=10) < 기존 e(g=14) → 교체. f(g=9) = 기존 → 유지",
    found: false,
  });

  // Step 5: expand f (g=9)
  // neighbors: g(9+3=12)
  steps.push({
    open: [
      { id: "e", g: 10, parent: "d" },
      { id: "g", g: 12, parent: "f" },
    ],
    closed: [
      { id: "a", g: 0, parent: null },
      { id: "c", g: 4, parent: "a" },
      { id: "b", g: 6, parent: "a" },
      { id: "d", g: 7, parent: "c" },
      { id: "f", g: 9, parent: "c" },
    ],
    current: { id: "f", g: 9, parent: "c" },
    message: "f(g=9) 확장. 후계노드: g(g=9+3=12). OPEN에 추가",
    found: false,
  });

  // Step 6: expand e (g=10)
  // neighbors: g(10+4=14 > 12 existing → discard)
  steps.push({
    open: [{ id: "g", g: 12, parent: "f" }],
    closed: [
      { id: "a", g: 0, parent: null },
      { id: "c", g: 4, parent: "a" },
      { id: "b", g: 6, parent: "a" },
      { id: "d", g: 7, parent: "c" },
      { id: "f", g: 9, parent: "c" },
      { id: "e", g: 10, parent: "d" },
    ],
    current: { id: "e", g: 10, parent: "d" },
    message:
      "e(g=10) 확장. g(g=14) > 기존 g(g=12) → 제거",
    found: false,
  });

  // Step 7: expand g → goal
  steps.push({
    open: [],
    closed: [
      { id: "a", g: 0, parent: null },
      { id: "c", g: 4, parent: "a" },
      { id: "b", g: 6, parent: "a" },
      { id: "d", g: 7, parent: "c" },
      { id: "f", g: 9, parent: "c" },
      { id: "e", g: 10, parent: "d" },
      { id: "g", g: 12, parent: "f" },
    ],
    current: { id: "g", g: 12, parent: "f" },
    message:
      "g는 목표노드! 최소비용 경로: a → c → f → g (비용 12). 탐색 성공!",
    found: true,
    solutionPath: ["a", "c", "f", "g"],
  });

  return steps;
}

const ucsSteps = buildSteps();

export default function UniformCostSimulator() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentState = ucsSteps[step];

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, ucsSteps.length - 1));
  }, []);
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const reset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!isPlaying) return;
    if (step >= ucsSteps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(next, 1500);
    return () => clearTimeout(timer);
  }, [isPlaying, step, next]);

  const getNodeColor = (id: string) => {
    if (currentState.found && currentState.solutionPath?.includes(id))
      return "fill-green-500 stroke-green-600";
    if (currentState.current?.id === id)
      return "fill-cyan-500 stroke-cyan-600";
    if (currentState.closed.some((n) => n.id === id))
      return "fill-gray-400 stroke-gray-500";
    if (currentState.open.some((n) => n.id === id))
      return "fill-cyan-200 stroke-cyan-400 dark:fill-cyan-800 dark:stroke-cyan-600";
    return "fill-white stroke-gray-300 dark:fill-gray-800 dark:stroke-gray-600";
  };

  const getTextColor = (id: string) => {
    if (
      (currentState.found && currentState.solutionPath?.includes(id)) ||
      currentState.current?.id === id ||
      currentState.closed.some((n) => n.id === id)
    )
      return "fill-white";
    return "fill-gray-700 dark:fill-gray-300";
  };

  const getGValue = (id: string): number | null => {
    if (currentState.current?.id === id) return currentState.current.g;
    const inOpen = currentState.open.find((n) => n.id === id);
    if (inOpen) return inOpen.g;
    const inClosed = currentState.closed.find((n) => n.id === id);
    if (inClosed) return inClosed.g;
    return null;
  };

  const isEdgeOnPath = (from: string, to: string) => {
    if (!currentState.found || !currentState.solutionPath) return false;
    const path = currentState.solutionPath;
    for (let i = 0; i < path.length - 1; i++) {
      if (
        (path[i] === from && path[i + 1] === to) ||
        (path[i] === to && path[i + 1] === from)
      )
        return true;
    }
    return false;
  };

  return (
    <section>
      <SectionTitle
        title="5. 균일비용 탐색 시뮬레이터"
        subtitle="경로비용 g(n)이 최소인 노드를 선택하여 확장. 최소비용 경로 탐색"
      />

      {/* Formula */}
      <div className="mb-6 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-center dark:border-cyan-800 dark:bg-cyan-950">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong className="text-cyan-600 dark:text-cyan-400">
            경로비용 계산:
          </strong>{" "}
          g(n<sub>i</sub>) = g(n) + C(n, n<sub>i</sub>)
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          g(n): S에서 n까지의 경로비용 &nbsp;|&nbsp; C(n, n<sub>i</sub>): n에서
          n<sub>i</sub>까지의 비용
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Graph */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            7개 도시 도로망 (a → g)
          </h3>
          <svg viewBox="0 0 650 370" className="w-full">
            {/* Edges */}
            {edges.map((edge) => {
              const f = cityMap[edge.from];
              const t = cityMap[edge.to];
              const onPath = isEdgeOnPath(edge.from, edge.to);
              const midX = (f.x + t.x) / 2;
              const midY = (f.y + t.y) / 2;
              // Offset for label
              const dx = t.x - f.x;
              const dy = t.y - f.y;
              const len = Math.sqrt(dx * dx + dy * dy);
              const offX = (-dy / len) * 14;
              const offY = (dx / len) * 14;
              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <line
                    x1={f.x}
                    y1={f.y}
                    x2={t.x}
                    y2={t.y}
                    className={
                      onPath
                        ? "stroke-green-500"
                        : "stroke-gray-300 dark:stroke-gray-600"
                    }
                    strokeWidth={onPath ? 3 : 2}
                  />
                  <text
                    x={midX + offX}
                    y={midY + offY}
                    textAnchor="middle"
                    className="fill-gray-500 text-xs font-medium dark:fill-gray-400"
                  >
                    {edge.cost}
                  </text>
                </g>
              );
            })}
            {/* Nodes */}
            {cities.map((city) => {
              const g = getGValue(city.id);
              return (
                <g key={city.id}>
                  <motion.circle
                    cx={city.x}
                    cy={city.y}
                    r={24}
                    className={getNodeColor(city.id)}
                    strokeWidth={2}
                    animate={{
                      scale:
                        city.id === currentState.current?.id
                          ? [1, 1.15, 1]
                          : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <text
                    x={city.x}
                    y={city.y + 5}
                    textAnchor="middle"
                    className={`text-sm font-bold ${getTextColor(city.id)}`}
                  >
                    {city.id}
                  </text>
                  {g !== null && (
                    <text
                      x={city.x}
                      y={city.y - 32}
                      textAnchor="middle"
                      className="fill-cyan-600 text-[11px] font-semibold dark:fill-cyan-400"
                    >
                      g={g}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-cyan-500" /> 현재 확장 노드
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-cyan-200 dark:bg-cyan-800" /> OPEN
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-gray-400" /> CLOSED
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-green-500" /> 최적경로
            </span>
          </div>
        </div>

        {/* OPEN / CLOSED lists */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <h4 className="mb-2 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
              OPEN (g값 오름차순 정렬)
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentState.open.length === 0 ? (
                <span className="text-xs text-gray-400">(비어 있음)</span>
              ) : (
                currentState.open.map((entry, i) => (
                  <div
                    key={`${entry.id}-${i}`}
                    className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 dark:border-cyan-800 dark:bg-cyan-950"
                  >
                    <span className="text-sm font-bold text-cyan-700 dark:text-cyan-300">
                      {entry.id}
                    </span>
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                      g={entry.g}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <h4 className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
              CLOSED
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentState.closed.length === 0 ? (
                <span className="text-xs text-gray-400">(비어 있음)</span>
              ) : (
                currentState.closed.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-lg border border-gray-200 bg-gray-100 px-3 py-1.5 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                      {entry.id}
                    </span>
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                      g={entry.g}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Duplicate handling rules */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <h4 className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
              중복 노드 처리 규칙
            </h4>
            <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <p>
                <strong className="text-cyan-600 dark:text-cyan-400">
                  OPEN에 동일 노드 존재:
                </strong>{" "}
                g값이 더 큰 쪽 제거
              </p>
              <p>
                <strong className="text-cyan-600 dark:text-cyan-400">
                  CLOSED에 동일 노드 존재:
                </strong>{" "}
                새 노드 제거 (g값이 더 작을 수 없음)
              </p>
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
          disabled={step === ucsSteps.length - 1}
          className="rounded-lg bg-cyan-100 px-4 py-2 text-sm font-medium text-cyan-700 transition-colors hover:bg-cyan-200 disabled:opacity-40 dark:bg-cyan-900/40 dark:text-cyan-300 dark:hover:bg-cyan-800/60"
        >
          다음 ▶
        </button>
      </div>
    </section>
  );
}
