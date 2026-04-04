"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import StepControls from "@/components/common/StepControls";

/* ── Graph data: 7-city road network a–g ── */
interface City {
  id: string;
  label: string;
  x: number;
  y: number;
  hHat: number; // straight-line distance to g
}

const cities: City[] = [
  { id: "a", label: "a", x: 60, y: 180, hHat: 9 },
  { id: "b", label: "b", x: 180, y: 60, hHat: 8 },
  { id: "c", label: "c", x: 180, y: 180, hHat: 7 },
  { id: "d", label: "d", x: 320, y: 180, hHat: 4 },
  { id: "e", label: "e", x: 320, y: 60, hHat: 5 },
  { id: "f", label: "f", x: 440, y: 130, hHat: 1 },
  { id: "g", label: "g", x: 540, y: 180, hHat: 0 },
];

interface Edge {
  from: string;
  to: string;
  cost: number;
}

const edges: Edge[] = [
  { from: "a", to: "b", cost: 5 },
  { from: "a", to: "c", cost: 4 },
  { from: "b", to: "c", cost: 2 },
  { from: "b", to: "e", cost: 6 },
  { from: "c", to: "d", cost: 3 },
  { from: "d", to: "e", cost: 4 },
  { from: "d", to: "f", cost: 3 },
  { from: "e", to: "f", cost: 2 },
  { from: "f", to: "g", cost: 2 },
];

function getNeighbors(nodeId: string): { to: string; cost: number }[] {
  const result: { to: string; cost: number }[] = [];
  for (const e of edges) {
    if (e.from === nodeId) result.push({ to: e.to, cost: e.cost });
    if (e.to === nodeId) result.push({ to: e.from, cost: e.cost });
  }
  return result;
}

function getCityHHat(id: string): number {
  return cities.find((c) => c.id === id)!.hHat;
}

/* ── A* Step-by-step trace ── */
interface OpenNode {
  id: string;
  g: number;
  fHat: number;
  parent: string | null;
}

interface StepState {
  open: OpenNode[];
  closed: OpenNode[];
  current: string | null;
  expanded: string[];
  desc: string;
  path: string[];
  done: boolean;
}

function generateAStarSteps(): StepState[] {
  const steps: StepState[] = [];

  // Initial
  const initOpen: OpenNode[] = [{ id: "a", g: 0, fHat: 0 + 9, parent: null }];
  steps.push({
    open: [...initOpen],
    closed: [],
    current: null,
    expanded: [],
    desc: "출발노드 a를 OPEN에 삽입. f̂(a) = g(a)+ĥ(a) = 0+9 = 9",
    path: [],
    done: false,
  });

  // Manual trace for the 7-city example: a→c→d→f→g (cost 12)
  // Step 1: Expand a
  steps.push({
    open: [
      { id: "b", g: 5, fHat: 5 + 8, parent: "a" },
      { id: "c", g: 4, fHat: 4 + 7, parent: "a" },
    ],
    closed: [{ id: "a", g: 0, fHat: 9, parent: null }],
    current: "a",
    expanded: ["a"],
    desc: "OPEN에서 f̂ 최소인 a(f̂=9) 선택 → CLOSED. 후계: b(f̂=13), c(f̂=11)",
    path: ["a"],
    done: false,
  });

  // Step 2: Expand c (f̂=11 < 13)
  steps.push({
    open: [
      { id: "b", g: 5, fHat: 13, parent: "a" },
      { id: "d", g: 7, fHat: 7 + 4, parent: "c" },
    ],
    closed: [
      { id: "a", g: 0, fHat: 9, parent: null },
      { id: "c", g: 4, fHat: 11, parent: "a" },
    ],
    current: "c",
    expanded: ["a", "c"],
    desc: "OPEN에서 f̂ 최소인 c(f̂=11) 선택 → CLOSED. 후계: d(f̂=11). b는 이미 OPEN에 존재(f̂ 비교).",
    path: ["a", "c"],
    done: false,
  });

  // Step 3: Expand d (f̂=11 < 13)
  steps.push({
    open: [
      { id: "b", g: 5, fHat: 13, parent: "a" },
      { id: "e", g: 11, fHat: 11 + 5, parent: "d" },
      { id: "f", g: 10, fHat: 10 + 1, parent: "d" },
    ],
    closed: [
      { id: "a", g: 0, fHat: 9, parent: null },
      { id: "c", g: 4, fHat: 11, parent: "a" },
      { id: "d", g: 7, fHat: 11, parent: "c" },
    ],
    current: "d",
    expanded: ["a", "c", "d"],
    desc: "OPEN에서 f̂ 최소인 d(f̂=11) 선택 → CLOSED. 후계: e(f̂=16), f(f̂=11)",
    path: ["a", "c", "d"],
    done: false,
  });

  // Step 4: Expand f (f̂=11 < 13 < 16)
  steps.push({
    open: [
      { id: "b", g: 5, fHat: 13, parent: "a" },
      { id: "e", g: 11, fHat: 16, parent: "d" },
      { id: "g", g: 12, fHat: 12 + 0, parent: "f" },
    ],
    closed: [
      { id: "a", g: 0, fHat: 9, parent: null },
      { id: "c", g: 4, fHat: 11, parent: "a" },
      { id: "d", g: 7, fHat: 11, parent: "c" },
      { id: "f", g: 10, fHat: 11, parent: "d" },
    ],
    current: "f",
    expanded: ["a", "c", "d", "f"],
    desc: "OPEN에서 f̂ 최소인 f(f̂=11) 선택 → CLOSED. 후계: g(f̂=12)",
    path: ["a", "c", "d", "f"],
    done: false,
  });

  // Step 5: Expand g → goal reached
  steps.push({
    open: [
      { id: "b", g: 5, fHat: 13, parent: "a" },
      { id: "e", g: 11, fHat: 16, parent: "d" },
    ],
    closed: [
      { id: "a", g: 0, fHat: 9, parent: null },
      { id: "c", g: 4, fHat: 11, parent: "a" },
      { id: "d", g: 7, fHat: 11, parent: "c" },
      { id: "f", g: 10, fHat: 11, parent: "d" },
      { id: "g", g: 12, fHat: 12, parent: "f" },
    ],
    current: "g",
    expanded: ["a", "c", "d", "f", "g"],
    desc: "OPEN에서 f̂ 최소인 g(f̂=12) 선택 → 목표 도달! 최단 경로: a→c→d→f→g (비용 12)",
    path: ["a", "c", "d", "f", "g"],
    done: true,
  });

  return steps;
}

const astarSteps = generateAStarSteps();

/* ── Duplicate handling data ── */
const duplicateRules = [
  {
    situation: "동일 노드가 OPEN에 존재",
    action: "f̂이 큰 노드를 제거",
    color: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-300 dark:border-blue-700",
  },
  {
    situation: "동일 노드가 CLOSED에 존재, f̂(old) ≤ f̂(new)",
    action: "새 노드(n_new) 제거",
    color: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-300 dark:border-amber-700",
  },
  {
    situation: "동일 노드가 CLOSED에 존재, f̂(old) > f̂(new)",
    action: "부모 포인터 수정, f̂ 값 갱신",
    color: "bg-rose-50 dark:bg-rose-900/20",
    borderColor: "border-rose-300 dark:border-rose-700",
  },
];

export default function AStarSimulator() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentState = astarSteps[step];

  const play = useCallback(() => {
    setPlaying(true);
    intervalRef.current = setInterval(() => {
      setStep((s) => {
        if (s >= astarSteps.length - 1) {
          setPlaying(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          return s;
        }
        return s + 1;
      });
    }, 1500);
  }, []);

  const stop = useCallback(() => {
    setPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    stop();
    setStep(0);
  }, [stop]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const getCityObj = (id: string) => cities.find((c) => c.id === id)!;

  // Check if edge is on the current path
  const isEdgeOnPath = (from: string, to: string) => {
    const path = currentState.path;
    for (let i = 0; i < path.length - 1; i++) {
      if (
        (path[i] === from && path[i + 1] === to) ||
        (path[i] === to && path[i + 1] === from)
      ) {
        return true;
      }
    }
    return false;
  };

  const getNodeColor = (id: string) => {
    if (id === currentState.current) return "#14b8a6"; // teal - current
    if (currentState.closed.some((n) => n.id === id)) return "#6366f1"; // indigo - closed
    if (currentState.open.some((n) => n.id === id)) return "#f59e0b"; // amber - open
    return "#9ca3af"; // gray - unvisited
  };

  return (
    <section>
      <SectionTitle
        title="4. A* 알고리즘"
        subtitle="f̂(n) = g(n) + ĥ(n)을 평가함수로 사용하여 최소비용 경로를 탐색"
      />

      {/* Formula */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-800 dark:bg-teal-900/20">
          <h4 className="mb-1 text-sm font-bold text-teal-800 dark:text-teal-200">예측 평가함수</h4>
          <p className="text-center text-xl font-bold text-teal-700 dark:text-teal-300">
            f̂(n) = g(n) + ĥ(n)
          </p>
          <p className="mt-1 text-center text-xs text-gray-500">
            실제 경로비용 + 목표까지 예측비용
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-1 text-sm font-bold text-gray-700 dark:text-gray-300">실제 전체비용</h4>
          <p className="text-center text-xl font-bold text-gray-600 dark:text-gray-400">
            f(n) = g(n) + h(n)
          </p>
          <p className="mt-1 text-center text-xs text-gray-500">
            실제 경로비용 + 목표까지 실제비용
          </p>
        </div>
      </div>

      {/* Graph Simulator */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            7-도시 경로 탐색 (a → g)
          </h3>
          <StepControls
            step={step}
            totalSteps={astarSteps.length}
            playing={playing}
            onPlay={play}
            onStop={stop}
            onReset={reset}
            onNext={() => setStep((s) => Math.min(s + 1, astarSteps.length - 1))}
            onPrev={() => setStep((s) => Math.max(s - 1, 0))}
          />
        </div>

        {/* SVG Graph */}
        <div className="relative mx-auto" style={{ maxWidth: 600 }}>
          <svg viewBox="0 0 600 260" className="w-full">
            {/* Edges */}
            {edges.map((e) => {
              const from = getCityObj(e.from);
              const to = getCityObj(e.to);
              const onPath = isEdgeOnPath(e.from, e.to);
              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2;
              return (
                <g key={`${e.from}-${e.to}`}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={onPath ? "#14b8a6" : "#d1d5db"}
                    strokeWidth={onPath ? 3 : 1.5}
                    className={onPath ? "" : "dark:stroke-gray-600"}
                  />
                  <rect
                    x={mx - 10}
                    y={my - 8}
                    width={20}
                    height={16}
                    rx={4}
                    fill="white"
                    className="dark:fill-gray-900"
                    opacity={0.9}
                  />
                  <text
                    x={mx}
                    y={my + 4}
                    textAnchor="middle"
                    className="fill-gray-500 text-xs dark:fill-gray-400"
                  >
                    {e.cost}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {cities.map((city) => {
              const color = getNodeColor(city.id);
              return (
                <g key={city.id}>
                  <motion.circle
                    cx={city.x}
                    cy={city.y}
                    r={city.id === currentState.current ? 22 : 18}
                    fill={color}
                    animate={{
                      r: city.id === currentState.current ? 22 : 18,
                      fill: color,
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  <text
                    x={city.x}
                    y={city.y + 5}
                    textAnchor="middle"
                    className="pointer-events-none fill-white text-sm font-bold"
                  >
                    {city.label}
                  </text>
                  {/* ĥ label */}
                  <text
                    x={city.x}
                    y={city.y - 26}
                    textAnchor="middle"
                    className="fill-teal-600 text-xs font-medium dark:fill-teal-400"
                  >
                    ĥ={city.hHat}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-amber-500" /> OPEN
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-indigo-500" /> CLOSED
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-teal-500" /> 현재 노드
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-gray-400" /> 미방문
          </span>
        </div>

        {/* Step description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 rounded-lg bg-teal-50 p-3 text-sm text-teal-800 dark:bg-teal-900/20 dark:text-teal-200"
          >
            {currentState.desc}
          </motion.div>
        </AnimatePresence>

        {/* OPEN / CLOSED tables */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 text-xs font-bold text-amber-600 dark:text-amber-400">OPEN 리스트</h4>
            <div className="overflow-x-auto rounded-lg border border-amber-200 dark:border-amber-800">
              <table className="w-full text-xs">
                <thead className="bg-amber-50 dark:bg-amber-900/20">
                  <tr>
                    <th className="px-3 py-1.5 text-left">노드</th>
                    <th className="px-3 py-1.5 text-left">g(n)</th>
                    <th className="px-3 py-1.5 text-left">f̂(n)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 dark:divide-amber-900/30">
                  {currentState.open.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-3 py-2 text-center text-gray-400">
                        비어 있음
                      </td>
                    </tr>
                  ) : (
                    currentState.open
                      .sort((a, b) => a.fHat - b.fHat)
                      .map((n) => (
                        <tr key={n.id} className="bg-white dark:bg-gray-900">
                          <td className="px-3 py-1.5 font-bold">{n.id}</td>
                          <td className="px-3 py-1.5">{n.g}</td>
                          <td className="px-3 py-1.5 font-bold text-amber-600 dark:text-amber-400">
                            {n.fHat}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">CLOSED 리스트</h4>
            <div className="overflow-x-auto rounded-lg border border-indigo-200 dark:border-indigo-800">
              <table className="w-full text-xs">
                <thead className="bg-indigo-50 dark:bg-indigo-900/20">
                  <tr>
                    <th className="px-3 py-1.5 text-left">노드</th>
                    <th className="px-3 py-1.5 text-left">g(n)</th>
                    <th className="px-3 py-1.5 text-left">f̂(n)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-100 dark:divide-indigo-900/30">
                  {currentState.closed.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-3 py-2 text-center text-gray-400">
                        비어 있음
                      </td>
                    </tr>
                  ) : (
                    currentState.closed.map((n) => (
                      <tr key={n.id} className="bg-white dark:bg-gray-900">
                        <td className="px-3 py-1.5 font-bold">{n.id}</td>
                        <td className="px-3 py-1.5">{n.g}</td>
                        <td className="px-3 py-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                          {n.fHat}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Duplicate node handling */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          중복 생성된 노드의 처리
        </h3>
        <div className="space-y-3">
          {duplicateRules.map((rule, i) => (
            <div key={i} className={`rounded-lg border p-3 ${rule.borderColor} ${rule.color}`}>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{rule.situation}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">→ {rule.action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Admissibility condition */}
      <div className="mb-6 rounded-xl border-2 border-teal-300 bg-teal-50 p-6 dark:border-teal-700 dark:bg-teal-900/20">
        <h3 className="mb-2 text-sm font-bold text-teal-800 dark:text-teal-200">
          최소비용 경로 보장 조건 (허용적 휴리스틱)
        </h3>
        <p className="text-center text-2xl font-bold text-teal-700 dark:text-teal-300">
          ĥ(n) &le; h(n)
        </p>
        <p className="mt-2 text-center text-sm text-teal-600 dark:text-teal-400">
          예측비용이 항상 실제비용 이하이면 A*는 최소비용 경로를 보장.
        </p>
        <p className="mt-1 text-center text-xs text-gray-500">
          위 예제: ĥ(n)은 직선거리로, 항상 실제 도로거리 이하이므로 조건 충족.
        </p>
      </div>

      {/* 8-puzzle A* example toggle */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <button
          onClick={() => setShowPuzzle(!showPuzzle)}
          className="flex w-full items-center justify-between text-left"
        >
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            8-퍼즐 A* 예제
          </h3>
          <motion.span
            animate={{ rotate: showPuzzle ? 180 : 0 }}
            className="text-gray-400"
          >
            ▼
          </motion.span>
        </button>

        <AnimatePresence>
          {showPuzzle && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h4 className="mb-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                    A* 8-퍼즐 평가함수
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>
                      <span className="font-bold text-blue-600 dark:text-blue-400">g(n)</span> = 빈 칸의 이동 횟수
                    </li>
                    <li>
                      <span className="font-bold text-teal-600 dark:text-teal-400">ĥ(n)</span> = 목표상태와 비교하여 지정된 위치에 존재하지 않는 조각의 수
                    </li>
                    <li>
                      <span className="font-bold text-gray-600 dark:text-gray-400">f̂(n)</span> = g(n) + ĥ(n)
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg bg-teal-50 p-4 dark:bg-teal-900/20">
                  <h4 className="mb-2 text-xs font-bold text-teal-700 dark:text-teal-300">탐색 과정</h4>
                  <div className="space-y-1 font-mono text-xs text-teal-700 dark:text-teal-300">
                    <p>1. 초기상태: f̂ = 0+4 = 4</p>
                    <p>2. 후계 중 f̂=1+3=4인 노드 선택</p>
                    <p>3. f̂=2+3=5인 노드 확장</p>
                    <p>4. f̂=3+2=5인 노드 확장</p>
                    <p>5. f̂=4+1=5인 노드 확장</p>
                    <p>6. f̂=5+2=7인 노드 확장</p>
                    <p>7. 목표상태 도달: f̂=5+0=5</p>
                  </div>
                </div>

                <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    <span className="font-bold">차이점:</span> 언덕오르기와 달리 A*는 g(n)을 함께 고려하므로,
                    출발점에서 먼 곳의 비용도 반영하여 최적 경로를 보장.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
