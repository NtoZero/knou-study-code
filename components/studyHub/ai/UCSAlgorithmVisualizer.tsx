"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import StepControls from "@/components/common/StepControls";
import PseudocodeViewer from "@/components/common/PseudocodeViewer";
import AITerm from "./AITerm";

/**
 * 균일비용 탐색(UCS) 시각화 — 연습용 그래프 (과제 a~g와 무관)
 * 노드: S, P, Q, R, T, G
 */

type NodeId = "S" | "P" | "Q" | "R" | "T" | "G";

interface GraphNode {
  id: NodeId;
  x: number;
  y: number;
}

interface Edge {
  from: NodeId;
  to: NodeId;
  cost: number;
}

const NODES: GraphNode[] = [
  { id: "S", x: 50, y: 150 },
  { id: "P", x: 170, y: 70 },
  { id: "Q", x: 170, y: 230 },
  { id: "R", x: 300, y: 70 },
  { id: "T", x: 300, y: 230 },
  { id: "G", x: 440, y: 150 },
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

interface Step {
  active: NodeId | null;
  open: { id: NodeId; g: number; path: NodeId[] }[];
  closed: { id: NodeId; g: number }[];
  highlight: number[];
  note: string;
}

// 손으로 계산한 단계별 확장 과정
// S(0) -> P(3), Q(5)
// P(3) 확장 -> R(3+4=7), Q(3+1=4)  [기존 Q=5 대체]
// Q(4) 확장 -> T(4+6=10)
// R(7) 확장 -> G(7+5=12), T(7+2=9) [기존 T=10 대체]
// T(9) 확장 -> G(9+3=12) -- 기존 G=12와 동점, 어느 쪽이든 동일 비용
// G(12) 목표 -> 종료
const STEPS: Step[] = [
  {
    active: "S",
    open: [{ id: "S", g: 0, path: ["S"] }],
    closed: [],
    highlight: [0],
    note: "1. 출발노드 S를 g=0으로 OPEN에 삽입.",
  },
  {
    active: "S",
    open: [
      { id: "P", g: 3, path: ["S", "P"] },
      { id: "Q", g: 5, path: ["S", "Q"] },
    ],
    closed: [{ id: "S", g: 0 }],
    highlight: [1, 2, 3, 4],
    note: "2. S를 꺼내 CLOSED로. S 확장 → P(g=3), Q(g=5). OPEN을 g 오름차순 정렬.",
  },
  {
    active: "P",
    open: [
      { id: "Q", g: 4, path: ["S", "P", "Q"] },
      { id: "R", g: 7, path: ["S", "P", "R"] },
    ],
    closed: [
      { id: "S", g: 0 },
      { id: "P", g: 3 },
    ],
    highlight: [2, 3, 4],
    note: "3. P(g=3)를 꺼내 확장 → Q(3+1=4), R(3+4=7). 기존 Q(g=5)는 더 큰 값이므로 교체.",
  },
  {
    active: "Q",
    open: [
      { id: "R", g: 7, path: ["S", "P", "R"] },
      { id: "T", g: 10, path: ["S", "P", "Q", "T"] },
    ],
    closed: [
      { id: "S", g: 0 },
      { id: "P", g: 3 },
      { id: "Q", g: 4 },
    ],
    highlight: [2, 3, 4],
    note: "4. Q(g=4) 확장 → T(4+6=10). 새 OPEN = {R:7, T:10}.",
  },
  {
    active: "R",
    open: [
      { id: "T", g: 9, path: ["S", "P", "R", "T"] },
      { id: "G", g: 12, path: ["S", "P", "R", "G"] },
    ],
    closed: [
      { id: "S", g: 0 },
      { id: "P", g: 3 },
      { id: "Q", g: 4 },
      { id: "R", g: 7 },
    ],
    highlight: [2, 3, 4],
    note: "5. R(g=7) 확장 → G(7+5=12), T(7+2=9). 기존 T(10)을 T(9)로 교체.",
  },
  {
    active: "T",
    open: [{ id: "G", g: 12, path: ["S", "P", "R", "G"] }],
    closed: [
      { id: "S", g: 0 },
      { id: "P", g: 3 },
      { id: "Q", g: 4 },
      { id: "R", g: 7 },
      { id: "T", g: 9 },
    ],
    highlight: [2, 3, 4],
    note: "6. T(g=9) 확장 → G(9+3=12). 기존 G와 동점이므로 그대로 유지.",
  },
  {
    active: "G",
    open: [],
    closed: [
      { id: "S", g: 0 },
      { id: "P", g: 3 },
      { id: "Q", g: 4 },
      { id: "R", g: 7 },
      { id: "T", g: 9 },
      { id: "G", g: 12 },
    ],
    highlight: [2],
    note: "7. G(g=12) 꺼냄 → 목표 도달. 최소비용 경로 S→P→R→G (12) 반환.",
  },
];

const PSEUDO = [
  { text: "1. OPEN ← {S}, g(S) = 0" },
  { text: "2. while OPEN is not empty do" },
  { text: "3.   n ← OPEN 에서 g(n) 최소 노드 제거" },
  { text: "4.   if n == Goal then return path" },
  { text: "5.   n 확장 → 각 자식 n' 에 대해 g(n') = g(n) + c(n,n')" },
  { text: "6.   중복 처리 후 n' 를 OPEN 에 삽입" },
];

export default function UCSAlgorithmVisualizer() {
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

  // 노드 현재 상태 (closed / open / untouched)
  function nodeState(id: NodeId): "closed" | "open" | "active" | "none" {
    if (cur.active === id && cur.open.length === 0) return "closed";
    if (cur.closed.some((c) => c.id === id)) {
      if (cur.active === id) return "active";
      return "closed";
    }
    if (cur.open.some((o) => o.id === id)) return "open";
    return "none";
  }

  return (
    <section>
      <SectionTitle
        title="균일비용 탐색(UCS) 단계별 시각화"
        subtitle="Open 큐를 경로비용 g 기준으로 정렬 · 중복 상태는 더 작은 g로 갱신"
      />

      <div className="relative z-0 mb-4 flex flex-wrap gap-3 overflow-visible rounded-lg bg-indigo-50/50 p-3 text-[11px] text-indigo-900 dark:bg-indigo-950/20 dark:text-indigo-100">
        <span>
          핵심 개념: <AITerm term="UCS" />, <AITerm term="g" label="g(n)" />,{" "}
          <AITerm term="OPEN" />, <AITerm term="CLOSED" />,{" "}
          <AITerm term="expand" label="확장" />,{" "}
          <AITerm term="tieBreak" label="기존 우수 판단" />
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* 그래프 */}
        <div className="rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-900/40 dark:bg-gray-900">
          <svg viewBox="0 0 500 300" className="w-full">
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
              const gVal =
                cur.open.find((o) => o.id === n.id)?.g ??
                cur.closed.find((c) => c.id === n.id)?.g;
              const fill =
                st === "active"
                  ? "#6366f1"
                  : st === "closed"
                    ? "#a5b4fc"
                    : st === "open"
                      ? "#e0e7ff"
                      : "#f1f5f9";
              const textFill = st === "active" ? "#fff" : "#1e1b4b";
              return (
                <motion.g
                  key={n.id}
                  initial={false}
                  animate={{ scale: st === "active" ? 1.08 : 1 }}
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={22}
                    fill={fill}
                    stroke="#4338ca"
                    strokeWidth={st === "active" ? 3 : 2}
                  />
                  <text
                    x={n.x}
                    y={n.y + 2}
                    textAnchor="middle"
                    fontSize={13}
                    fontWeight={700}
                    fill={textFill}
                  >
                    {n.id}
                  </text>
                  {gVal !== undefined && (
                    <text
                      x={n.x}
                      y={n.y + 15}
                      textAnchor="middle"
                      fontSize={9}
                      fill={textFill}
                    >
                      g={gVal}
                    </text>
                  )}
                </motion.g>
              );
            })}
          </svg>

          <div className="mt-3 flex items-center justify-between">
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
          <p className="mt-3 rounded-lg bg-indigo-50 p-2 text-xs text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100">
            {cur.note}
          </p>
        </div>

        {/* 사이드바: OPEN/CLOSED */}
        <div className="space-y-3">
          <div className="rounded-xl border border-indigo-200 bg-white p-3 dark:border-indigo-900/40 dark:bg-gray-900">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-indigo-600">
              <Layers size={12} /> OPEN (g 오름차순)
            </div>
            {cur.open.length === 0 ? (
              <div className="text-[10px] italic text-gray-400">(비어있음)</div>
            ) : (
              <ul className="space-y-1 text-xs">
                {cur.open.map((o) => (
                  <li
                    key={`open-${o.id}-${o.g}`}
                    className="flex justify-between rounded bg-indigo-50 px-2 py-1 dark:bg-indigo-950/30"
                  >
                    <span className="font-mono font-bold">{o.id}</span>
                    <span className="text-indigo-600">g = {o.g}</span>
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
                    {c.id}({c.g})
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-2 text-[10px] font-bold uppercase text-gray-500">
              Pseudocode
            </div>
            <PseudocodeViewer lines={PSEUDO} highlightedLines={cur.highlight} accentColor="cyan" />
          </div>
        </div>
      </div>
    </section>
  );
}
