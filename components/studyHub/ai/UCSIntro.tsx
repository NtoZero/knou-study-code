"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/**
 * 균일비용 탐색(UCS) 도입부
 * — BFS의 한계(단계 수 최소화 ≠ 비용 최소화)를 보여주고
 *   UCS가 왜 필요한지 직관적으로 이해하게 하는 컴포넌트
 */

// 예시 그래프:
//   S ──(1)──▶ A ──(10)──▶ G
//   └──(2)──▶ B ──(2)───▶ C ──(2)──▶ G
//
// BFS 선택: S→A→G (2단계, 비용 11)
// UCS 선택: S→B→C→G (3단계, 비용 6)

type Mode = "bfs" | "ucs";

const PATHS = {
  bfs: {
    nodes: ["S", "A", "G"],
    steps: 2,
    cost: 11,
    label: "BFS 선택 경로",
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-400",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
    icon: AlertTriangle,
    verdict: "단계는 최소(2단계)지만 비용이 더 큽니다!",
  },
  ucs: {
    nodes: ["S", "B", "C", "G"],
    steps: 3,
    cost: 6,
    label: "UCS 선택 경로",
    color: "text-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    border: "border-indigo-400",
    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
    icon: CheckCircle,
    verdict: "단계는 더 많지만(3단계) 비용이 최소입니다!",
  },
};

// SVG 좌표
const NODE_POS: Record<string, { x: number; y: number }> = {
  S: { x: 60,  y: 120 },
  A: { x: 200, y: 55  },
  B: { x: 200, y: 185 },
  C: { x: 330, y: 185 },
  G: { x: 460, y: 120 },
};

const EDGES = [
  { from: "S", to: "A", cost: 1,  label: "1" },
  { from: "A", to: "G", cost: 10, label: "10" },
  { from: "S", to: "B", cost: 2,  label: "2" },
  { from: "B", to: "C", cost: 2,  label: "2" },
  { from: "C", to: "G", cost: 2,  label: "2" },
];

function isEdgeOnPath(from: string, to: string, path: string[]): boolean {
  for (let i = 0; i < path.length - 1; i++) {
    if (path[i] === from && path[i + 1] === to) return true;
  }
  return false;
}

function isNodeOnPath(id: string, path: string[]): boolean {
  return path.includes(id);
}

export default function UCSIntro() {
  const [mode, setMode] = useState<Mode>("bfs");

  const current = PATHS[mode];
  const Icon = current.icon;

  return (
    <section className="space-y-6">
      <SectionTitle
        title="균일비용 탐색(UCS)은 왜 만들어졌나?"
        subtitle="BFS의 한계와 비용 기반 탐색의 필요성"
      />

      {/* BFS 한계 설명 */}
      <div className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 p-5 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          BFS의 한계 — 단계 수는 최소, 비용은 최소가 아닐 수 있다
        </div>
        <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
          너비우선 탐색(BFS)은 <strong>연산자 적용 횟수(단계 수)가 가장 적은 경로</strong>를 찾는 것을 보장합니다.
          그러나 현실에서는 간선마다 <strong>비용(cost)</strong>이 다릅니다.{" "}
          단계 수가 적더라도 비용이 훨씬 큰 경로일 수 있습니다.
        </p>
        <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
          예) 도로 네트워크에서 고속도로(1홉)보다 시골길 3홉이 총 거리가 짧을 수 있습니다.
          BFS는 홉 수만 세기 때문에 고속도로를 선택하지만, 실제론 더 멀 수 있습니다.
        </p>
      </div>

      {/* 인터랙티브 그래프 비교 */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 space-y-4">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          아래 그래프에서 BFS와 UCS가 어떤 경로를 선택하는지 비교해 보세요.
        </p>

        {/* 탭 선택 */}
        <div className="flex gap-2">
          {(["bfs", "ucs"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                mode === m
                  ? m === "bfs"
                    ? "bg-rose-500 text-white border-rose-500"
                    : "bg-indigo-500 text-white border-indigo-500"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              {m === "bfs" ? "BFS 시점" : "UCS 시점"}
            </button>
          ))}
        </div>

        {/* SVG 그래프 */}
        <div className="overflow-x-auto">
          <svg viewBox="0 0 540 240" className="w-full max-w-xl mx-auto" style={{ minWidth: 320 }}>
            {/* 엣지 */}
            {EDGES.map((e) => {
              const f = NODE_POS[e.from];
              const t = NODE_POS[e.to];
              const active = isEdgeOnPath(e.from, e.to, current.nodes);
              const mx = (f.x + t.x) / 2;
              const my = (f.y + t.y) / 2;
              return (
                <g key={`${e.from}-${e.to}`}>
                  <line
                    x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                    strokeWidth={active ? 3.5 : 2}
                    stroke={
                      active
                        ? mode === "bfs" ? "#f43f5e" : "#6366f1"
                        : "#cbd5e1"
                    }
                    strokeDasharray={active ? undefined : "5,3"}
                    strokeLinecap="round"
                  />
                  {/* 화살표 */}
                  {active && (
                    <polygon
                      points="0,-5 10,0 0,5"
                      fill={mode === "bfs" ? "#f43f5e" : "#6366f1"}
                      transform={`translate(${t.x},${t.y}) rotate(${Math.atan2(t.y - f.y, t.x - f.x) * 180 / Math.PI}) translate(-14,0)`}
                    />
                  )}
                  {/* 비용 레이블 */}
                  <rect
                    x={mx - 10} y={my - 10} width={20} height={18} rx={4}
                    fill={active ? (mode === "bfs" ? "#fff1f2" : "#eef2ff") : "#f8fafc"}
                    stroke={active ? (mode === "bfs" ? "#f43f5e" : "#6366f1") : "#e2e8f0"}
                    strokeWidth={1}
                  />
                  <text
                    x={mx} y={my + 4}
                    textAnchor="middle" fontSize={11}
                    fontWeight={active ? "700" : "400"}
                    fill={active ? (mode === "bfs" ? "#e11d48" : "#4f46e5") : "#94a3b8"}
                  >
                    {e.label}
                  </text>
                </g>
              );
            })}

            {/* 노드 */}
            {Object.entries(NODE_POS).map(([id, pos]) => {
              const onPath = isNodeOnPath(id, current.nodes);
              const isGoal = id === "G";
              const isStart = id === "S";
              return (
                <g key={id}>
                  <circle
                    cx={pos.x} cy={pos.y} r={22}
                    fill={
                      onPath
                        ? mode === "bfs" ? "#fda4af" : "#a5b4fc"
                        : "#f1f5f9"
                    }
                    stroke={
                      isGoal ? "#10b981" :
                      isStart ? "#f59e0b" :
                      onPath ? (mode === "bfs" ? "#f43f5e" : "#6366f1") : "#cbd5e1"
                    }
                    strokeWidth={isGoal || isStart ? 3 : 2}
                  />
                  <text
                    x={pos.x} y={pos.y + 5}
                    textAnchor="middle" fontSize={14} fontWeight="700"
                    fill={
                      onPath
                        ? mode === "bfs" ? "#9f1239" : "#3730a3"
                        : "#64748b"
                    }
                  >
                    {id}
                  </text>
                </g>
              );
            })}

            {/* 범례 */}
            <circle cx={30} cy={215} r={6} fill="#fde68a" stroke="#f59e0b" strokeWidth={2} />
            <text x={40} y={219} fontSize={10} fill="#64748b">출발</text>
            <circle cx={80} cy={215} r={6} fill="#d1fae5" stroke="#10b981" strokeWidth={2} />
            <text x={90} y={219} fontSize={10} fill="#64748b">목표</text>
          </svg>
        </div>

        {/* 결과 카드 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`rounded-lg border p-4 space-y-3 ${current.bg} ${current.border}`}
          >
            <div className={`flex items-center gap-2 font-semibold ${current.color}`}>
              <Icon className="w-5 h-5 shrink-0" />
              {current.label}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {current.nodes.map((n, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 rounded-md text-sm font-mono font-bold ${current.badge}`}>
                    {n}
                  </span>
                  {i < current.nodes.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  )}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-white/60 dark:bg-slate-800/60 px-3 py-2">
                <div className="text-slate-500 dark:text-slate-400 text-xs mb-0.5">단계 수</div>
                <div className={`font-bold text-lg ${current.color}`}>{current.steps}단계</div>
              </div>
              <div className="rounded-lg bg-white/60 dark:bg-slate-800/60 px-3 py-2">
                <div className="text-slate-500 dark:text-slate-400 text-xs mb-0.5">총 경로비용</div>
                <div className={`font-bold text-lg ${current.color}`}>{current.cost}</div>
              </div>
            </div>
            <p className={`text-sm font-medium ${current.color}`}>
              → {current.verdict}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* BFS vs UCS 원리 비교 */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 p-4 space-y-2">
          <div className="font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> BFS 방식
          </div>
          <p className="text-sm text-rose-800 dark:text-rose-300 leading-relaxed">
            OPEN 리스트를 <strong>큐(Queue)</strong>로 관리합니다.<br />
            먼저 넣은 노드를 먼저 꺼내므로, 단계(깊이)가 적은 노드가 항상 우선입니다.<br />
            비용은 전혀 고려하지 않습니다.
          </p>
          <div className="rounded-lg bg-rose-100 dark:bg-rose-900/40 px-3 py-2 text-xs font-mono text-rose-700 dark:text-rose-300">
            OPEN = [S] → [A, B] → [G(via A), B] → ...
            <br />
            꺼내는 기준: <strong>삽입 순서 (FIFO)</strong>
          </div>
        </div>

        <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/30 p-4 space-y-2">
          <div className="font-semibold text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> UCS 방식
          </div>
          <p className="text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed">
            OPEN 리스트를 <strong>우선순위 큐(Priority Queue)</strong>로 관리합니다.<br />
            출발점에서 현재 노드까지의 누적 비용 <strong>g(n)</strong>이 가장 작은 노드를 먼저 꺼냅니다.<br />
            단계 수가 아닌 비용으로 정렬합니다.
          </p>
          <div className="rounded-lg bg-indigo-100 dark:bg-indigo-900/40 px-3 py-2 text-xs font-mono text-indigo-700 dark:text-indigo-300">
            OPEN = [S(0)] → [A(1), B(2)] → [B(2), G(11)]
            <br />
            꺼내는 기준: <strong>g(n) 오름차순</strong>
          </div>
        </div>
      </div>

      {/* UCS 핵심 아이디어 */}
      <div className="rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-900 p-5 space-y-3">
        <div className="font-semibold text-indigo-700 dark:text-indigo-400">
          UCS의 핵심 아이디어
        </div>
        <div className="space-y-2">
          {[
            {
              num: "01",
              text: "OPEN 리스트를 g(n) — 출발 노드에서 n까지의 누적 경로비용 — 기준으로 정렬한다.",
            },
            {
              num: "02",
              text: "항상 g(n)이 가장 작은 노드를 먼저 확장한다. (비용이 싼 경로를 우선 탐색)",
            },
            {
              num: "03",
              text: "목표 노드에 처음 도달했을 때의 경로가 최적(최소비용) 경로임을 보장한다.",
            },
          ].map((item) => (
            <div key={item.num} className="flex gap-3 items-start">
              <span className="shrink-0 w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
                {item.num}
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 용어 정리 */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-1">
          <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">g(n)</div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            출발 노드 s에서 노드 n까지의 <strong>실제 누적 경로 비용</strong>. UCS는 이 값이 가장 작은 노드를 OPEN에서 꺼낸다.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-1">
          <div className="font-semibold text-indigo-600 dark:text-indigo-400">균일비용 탐색 (UCS)</div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Uniform Cost Search. OPEN 리스트를 <strong>g(n) 오름차순</strong>으로 유지하여 최소 비용 경로를 탐색. 모든 간선 비용이 같으면 BFS와 동일하게 동작한다.
          </p>
        </div>
      </div>

      {/* 교재 원문 인용 */}
      <blockquote className="border-l-4 border-indigo-300 dark:border-indigo-700 pl-4 py-1 text-sm text-slate-600 dark:text-slate-400 italic space-y-1">
        <p>
          "너비우선 탐색방법은 만일 해가 존재한다면 출발노드에서 목표노드까지의{" "}
          <strong className="not-italic text-slate-700 dark:text-slate-300">
            최단길이 경로(shortest-length path, 연산자의 적용횟수를 최소로 하는 경로)
          </strong>
          를 찾는 것을 보장한다."
        </p>
        <p className="text-xs not-italic text-slate-500 dark:text-slate-500">
          — 교재 3장 &lt;탐색에 의한 문제풀이&gt; p.55
        </p>
        <p className="mt-2 not-italic text-slate-700 dark:text-slate-300 font-medium text-xs">
          즉 BFS는 연산자 적용 횟수(단계 수)를 최소화할 뿐, 비용의 합을 최소화하지 않습니다.
          비용이 다른 간선이 존재하는 문제에서는 균일비용 탐색(UCS)이 필요합니다.
        </p>
      </blockquote>
    </section>
  );
}
