"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import StepControls from "@/components/common/StepControls";
import PseudocodeViewer from "@/components/common/PseudocodeViewer";

/**
 * A* 알고리즘 시각화 — UCSAlgorithmVisualizer와 동일한 연습용 그래프
 * 각 노드에 휴리스틱 h 표시
 */

type NodeId = "S" | "P" | "Q" | "R" | "T" | "G";

interface GraphNode {
  id: NodeId;
  x: number;
  y: number;
  h: number; // 휴리스틱(목표까지 예측 비용)
}

interface Edge {
  from: NodeId;
  to: NodeId;
  cost: number;
}

const NODES: GraphNode[] = [
  { id: "S", x: 50, y: 150, h: 11 },
  { id: "P", x: 170, y: 70, h: 8 },
  { id: "Q", x: 170, y: 230, h: 9 },
  { id: "R", x: 300, y: 70, h: 4 },
  { id: "T", x: 300, y: 230, h: 3 },
  { id: "G", x: 440, y: 150, h: 0 },
];

const EDGES: Edge[] = [
  { from: "S", to: "P", cost: 3 },
  { from: "S", to: "Q", cost: 5 },
  { from: "P", to: "R", cost: 4 },
  { from: "P", to: "Q", cost: 1 },
  { from: "Q", to: "T", cost: 6 },
  { from: "R", to: "G", cost: 5 },
  { from: "R", to: "T", cost: 2 },
  { from: "T", to: "G", cost: 3 },
];

interface NodeState {
  id: NodeId;
  g: number;
  f: number;
}

interface Step {
  active: NodeId | null;
  open: NodeState[];
  closed: NodeState[];
  highlight: number[];
  note: string;
}

// 각 노드 h
// S:11 P:8 Q:9 R:4 T:3 G:0
// S: g=0, f=11
// 확장 S → P(g=3,f=11), Q(g=5,f=14)
// 확장 P(11) → R(g=7,f=11), Q(g=4,f=13) — 기존 Q(14) 교체
// 확장 R(11) → G(g=12,f=12), T(g=9,f=12)
// OPEN: Q(13), G(12), T(12)
// 확장 T(12) → G(g=12,f=12) — 기존 G(12)와 동점
// 확장 G(12) → 목표
const STEPS: Step[] = [
  {
    active: "S",
    open: [{ id: "S", g: 0, f: 11 }],
    closed: [],
    highlight: [0],
    note: "1. 출발 S: g=0, ĥ=11, f̂=g+ĥ=11. OPEN에 삽입.",
  },
  {
    active: "S",
    open: [
      { id: "P", g: 3, f: 11 },
      { id: "Q", g: 5, f: 14 },
    ],
    closed: [{ id: "S", g: 0, f: 11 }],
    highlight: [1, 2, 3, 4],
    note: "2. S 확장 → P(g=3, f̂=3+8=11), Q(g=5, f̂=5+9=14). OPEN을 f̂ 오름차순 정렬.",
  },
  {
    active: "P",
    open: [
      { id: "R", g: 7, f: 11 },
      { id: "Q", g: 4, f: 13 },
    ],
    closed: [
      { id: "S", g: 0, f: 11 },
      { id: "P", g: 3, f: 11 },
    ],
    highlight: [2, 3, 4],
    note: "3. P(f̂=11) 확장 → R(g=7, f̂=11), Q(g=4, f̂=13). 기존 Q(f̂=14)는 더 큰 f̂이므로 교체.",
  },
  {
    active: "R",
    open: [
      { id: "G", g: 12, f: 12 },
      { id: "T", g: 9, f: 12 },
      { id: "Q", g: 4, f: 13 },
    ],
    closed: [
      { id: "S", g: 0, f: 11 },
      { id: "P", g: 3, f: 11 },
      { id: "R", g: 7, f: 11 },
    ],
    highlight: [2, 3, 4],
    note: "4. R(f̂=11) 확장 → G(g=12, f̂=12), T(g=9, f̂=12). OPEN = {G:12, T:12, Q:13}.",
  },
  {
    active: "G",
    open: [
      { id: "T", g: 9, f: 12 },
      { id: "Q", g: 4, f: 13 },
    ],
    closed: [
      { id: "S", g: 0, f: 11 },
      { id: "P", g: 3, f: 11 },
      { id: "R", g: 7, f: 11 },
      { id: "G", g: 12, f: 12 },
    ],
    highlight: [2, 3],
    note: "5. G(f̂=12)가 최소 f̂로 선택됨 → 목표! ĥ가 h를 과대추정하지 않으면(허용적) 이 시점의 경로가 최적. 최단 경로 S→P→R→G, 비용 12.",
  },
];

const PSEUDO = [
  { text: "1. OPEN ← {S}, f̂(S) = g(S)+ĥ(S)" },
  { text: "2. while OPEN is not empty do" },
  { text: "3.   n ← OPEN 에서 f̂(n) 최소 노드 제거" },
  { text: "4.   if n == Goal then return path" },
  { text: "5.   n 확장 → f̂(n') = g(n')+ĥ(n')" },
  { text: "6.   중복(OPEN/CLOSED) 처리 후 OPEN 삽입" },
];

export default function AStarAlgorithmVisualizer() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (step >= STEPS.length - 1) {
        setPlaying(false);
        return;
      }
      setStep((s) => s + 1);
    }, 1500);
    return () => clearTimeout(t);
  }, [playing, step]);

  const cur = STEPS[step];

  function nodeById(id: NodeId) {
    return NODES.find((n) => n.id === id)!;
  }

  function nodeState(id: NodeId): "closed" | "open" | "active" | "none" {
    if (cur.closed.some((c) => c.id === id)) {
      return cur.active === id ? "active" : "closed";
    }
    if (cur.open.some((o) => o.id === id)) return "open";
    return "none";
  }

  return (
    <section>
      <SectionTitle
        title="A* 알고리즘 시각화"
        subtitle="같은 연습용 그래프에서 f = g + h 최소 노드를 우선 확장 — UCS와 비교"
      />

      <div className="mb-3 rounded-lg border border-indigo-300 bg-indigo-50 p-3 text-xs text-indigo-900 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-100">
        <b>f̂(n) = g(n) + ĥ(n)</b> (교재 식 3-3) · g(n): 출발→n 실제 비용, ĥ(n): n→목표 예측비용(허용적이면 h(n)을 과대추정하지 않음).
        <span className="ml-2 text-slate-500">※ f(n) = g(n)+h(n)은 이론상 참값이나, h(n)은 탐색 전에 알 수 없어 ĥ(n)으로 근사함.</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* 그래프 */}
        <div className="rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-900/40 dark:bg-gray-900">
          <svg viewBox="0 0 500 310" className="w-full">
            {EDGES.map((e, i) => {
              const a = nodeById(e.from);
              const b = nodeById(e.to);
              return (
                <g key={i}>
                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="#cbd5e1"
                    strokeWidth={2}
                  />
                  <text
                    x={(a.x + b.x) / 2}
                    y={(a.y + b.y) / 2 - 4}
                    fill="#6366f1"
                    fontSize={11}
                    fontWeight={600}
                    textAnchor="middle"
                  >
                    {e.cost}
                  </text>
                </g>
              );
            })}
            {NODES.map((n) => {
              const st = nodeState(n.id);
              const ns =
                cur.open.find((o) => o.id === n.id) ??
                cur.closed.find((c) => c.id === n.id);
              const fill =
                st === "active"
                  ? "#8b5cf6"
                  : st === "closed"
                    ? "#c4b5fd"
                    : st === "open"
                      ? "#ede9fe"
                      : "#f5f3ff";
              const textFill = st === "active" ? "#fff" : "#4c1d95";
              return (
                <motion.g
                  key={n.id}
                  initial={false}
                  animate={{ scale: st === "active" ? 1.08 : 1 }}
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={24}
                    fill={fill}
                    stroke="#7c3aed"
                    strokeWidth={st === "active" ? 3 : 2}
                  />
                  <text
                    x={n.x}
                    y={n.y - 2}
                    textAnchor="middle"
                    fontSize={13}
                    fontWeight={700}
                    fill={textFill}
                  >
                    {n.id}
                  </text>
                  <text
                    x={n.x}
                    y={n.y + 11}
                    textAnchor="middle"
                    fontSize={8}
                    fill={textFill}
                  >
                    ĥ={n.h}
                  </text>
                  {ns && (
                    <text
                      x={n.x}
                      y={n.y + 20}
                      textAnchor="middle"
                      fontSize={8}
                      fontWeight={700}
                      fill={textFill}
                    >
                      f̂={ns.f}
                    </text>
                  )}
                </motion.g>
              );
            })}
          </svg>

          <div className="mt-3">
            <StepControls
              step={step}
              totalSteps={STEPS.length}
              playing={playing}
              onPlay={() => setPlaying(true)}
              onStop={() => setPlaying(false)}
              onReset={() => {
                setPlaying(false);
                setStep(0);
              }}
              onNext={() => setStep((s) => Math.min(s + 1, STEPS.length - 1))}
              onPrev={() => setStep((s) => Math.max(s - 1, 0))}
            />
          </div>
          <p className="mt-3 rounded-lg bg-purple-50 p-2 text-xs text-purple-900 dark:bg-purple-950/40 dark:text-purple-100">
            {cur.note}
          </p>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-purple-200 bg-white p-3 dark:border-purple-900/40 dark:bg-gray-900">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-purple-600">
              <Sparkles size={12} /> OPEN (f̂ 오름차순)
            </div>
            {cur.open.length === 0 ? (
              <div className="text-[10px] italic text-gray-400">(비어있음)</div>
            ) : (
              <ul className="space-y-1 text-xs">
                {cur.open.map((o) => (
                  <li
                    key={`open-${o.id}-${o.f}`}
                    className="flex justify-between rounded bg-purple-50 px-2 py-1 dark:bg-purple-950/30"
                  >
                    <span className="font-mono font-bold">{o.id}</span>
                    <span className="text-purple-600">
                      g={o.g}, f̂={o.f}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-2 text-xs font-bold text-gray-500">CLOSED</div>
            {cur.closed.length === 0 ? (
              <div className="text-[10px] italic text-gray-400">(비어있음)</div>
            ) : (
              <div className="flex flex-wrap gap-1 text-xs">
                {cur.closed.map((c) => (
                  <span
                    key={`closed-${c.id}`}
                    className="rounded bg-gray-100 px-1.5 py-0.5 font-mono dark:bg-gray-800"
                  >
                    {c.id}(f̂={c.f})
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-2 text-[10px] font-bold uppercase text-gray-500">
              Pseudocode
            </div>
            <PseudocodeViewer lines={PSEUDO} highlightedLines={cur.highlight} accentColor="fuchsia" />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 text-xs dark:border-indigo-900 dark:bg-indigo-950/20 md:grid-cols-2">
        <div>
          <div className="mb-1 font-bold text-indigo-700 dark:text-indigo-300">UCS와의 차이</div>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300">
            <li>• UCS는 위 그래프에서 S, P, Q, R, T, G 총 6개 노드를 전부 확장함.</li>
            <li>• A*는 Q, T를 확장하지 않고 5번째 단계에서 목표에 도달함.</li>
            <li>• h가 목표 방향을 알려주므로 <b>불필요한 확장이 줄어듦</b>.</li>
          </ul>
        </div>
        <div>
          <div className="mb-1 font-bold text-indigo-700 dark:text-indigo-300">최적성 조건</div>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300">
            <li>• h가 <b>허용적(admissible)</b>: h(n) ≤ h*(n) 이면 A*는 최적 경로 보장.</li>
            <li>• 더 강한 조건인 <b>일관성(consistency)</b>: h(n) ≤ c(n,n') + h(n'). 이 경우 graph-search에서도 최적 보장.</li>
            <li>• 허용성이 깨지면 A*는 더 긴 경로를 반환할 수도 있음.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
