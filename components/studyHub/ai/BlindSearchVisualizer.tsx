"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, ChevronRight, ChevronLeft } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/* ------------------------------------------------------------------ */
/* 그래프 정의 — 8개 노드, 공통 트리 구조                                  */
/* ------------------------------------------------------------------ */
type NodeId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

interface TreeNode {
  id: NodeId;
  x: number;
  y: number;
  children: NodeId[];
}

// 레이아웃: A(루트) → B,C → D,E,F,G → H(목표)
const TREE_NODES: TreeNode[] = [
  { id: "A", x: 240, y: 30,  children: ["B", "C"] },
  { id: "B", x: 120, y: 110, children: ["D", "E"] },
  { id: "C", x: 360, y: 110, children: ["F", "G"] },
  { id: "D", x: 60,  y: 200, children: ["H"] },
  { id: "E", x: 180, y: 200, children: [] },
  { id: "F", x: 300, y: 200, children: [] },
  { id: "G", x: 420, y: 200, children: [] },
  { id: "H", x: 60,  y: 280, children: [] }, // 목표
];

function nodeById(id: NodeId): TreeNode {
  return TREE_NODES.find((n) => n.id === id)!;
}

/* ------------------------------------------------------------------ */
/* DFS 단계 — OPEN은 스택 (앞에 삽입)                                     */
/* ------------------------------------------------------------------ */
interface SearchStep {
  expanding: NodeId | null;
  open: NodeId[];
  closed: NodeId[];
  note: string;
  found: boolean;
}

const DFS_STEPS: SearchStep[] = [
  { expanding: null, open: ["A"], closed: [], note: "A를 OPEN(스택)에 삽입.", found: false },
  { expanding: "A",  open: ["B", "C"], closed: ["A"], note: "A 확장 → 자식 B,C를 스택 앞에 삽입. 다음: B(가장 위).", found: false },
  { expanding: "B",  open: ["D", "E", "C"], closed: ["A","B"], note: "B 확장 → D,E를 스택 앞에 삽입. 다음: D(가장 위).", found: false },
  { expanding: "D",  open: ["H", "E", "C"], closed: ["A","B","D"], note: "D 확장 → H를 스택 앞에 삽입. 다음: H.", found: false },
  { expanding: "H",  open: [], closed: ["A","B","D","H"], note: "🎯 H(목표) 발견! 경로: A→B→D→H", found: true },
];

const BFS_STEPS: SearchStep[] = [
  { expanding: null, open: ["A"], closed: [], note: "A를 OPEN(큐)에 삽입.", found: false },
  { expanding: "A",  open: ["B", "C"], closed: ["A"], note: "A 확장 → B,C를 큐 뒤에 삽입. 다음: B(가장 앞).", found: false },
  { expanding: "B",  open: ["C", "D", "E"], closed: ["A","B"], note: "B 확장 → D,E를 큐 뒤에 삽입. 다음: C.", found: false },
  { expanding: "C",  open: ["D", "E", "F", "G"], closed: ["A","B","C"], note: "C 확장 → F,G를 큐 뒤에 삽입. 다음: D.", found: false },
  { expanding: "D",  open: ["E", "F", "G", "H"], closed: ["A","B","C","D"], note: "D 확장 → H를 큐 뒤에 삽입. 다음: E.", found: false },
  { expanding: "E",  open: ["F", "G", "H"], closed: ["A","B","C","D","E"], note: "E 확장 → 자식 없음. 다음: F.", found: false },
  { expanding: "F",  open: ["G", "H"], closed: ["A","B","C","D","E","F"], note: "F 확장 → 자식 없음. 다음: G.", found: false },
  { expanding: "G",  open: ["H"], closed: ["A","B","C","D","E","F","G"], note: "G 확장 → 자식 없음. 다음: H.", found: false },
  { expanding: "H",  open: [], closed: ["A","B","C","D","E","F","G","H"], note: "🎯 H(목표) 발견! 경로: A→C→D→H (너비 기준 최단 경로)", found: true },
];

/* ------------------------------------------------------------------ */
/* 서브컴포넌트: 탐색 트리 SVG                                             */
/* ------------------------------------------------------------------ */
function SearchTreeSVG({
  step,
  accentColor,
}: {
  step: SearchStep;
  accentColor: "blue" | "emerald";
}) {
  const active = accentColor === "blue" ? "#3b82f6" : "#10b981";
  const closedFill = accentColor === "blue" ? "#bfdbfe" : "#a7f3d0";
  const openFill = accentColor === "blue" ? "#eff6ff" : "#ecfdf5";
  const closedText = accentColor === "blue" ? "#1d4ed8" : "#065f46";

  function getNodeColor(id: NodeId) {
    if (step.expanding === id) return active;
    if (step.closed.includes(id)) return closedFill;
    if (step.open.includes(id)) return openFill;
    return "#f8fafc";
  }

  function getStrokeColor(id: NodeId) {
    if (step.expanding === id) return active;
    if (step.closed.includes(id)) return active;
    return "#cbd5e1";
  }

  function getTextColor(id: NodeId) {
    if (step.expanding === id) return "#ffffff";
    if (step.closed.includes(id)) return closedText;
    return "#64748b";
  }

  return (
    <svg viewBox="0 0 480 320" className="w-full">
      {/* 엣지 */}
      {TREE_NODES.map((n) =>
        n.children.map((childId) => {
          const child = nodeById(childId);
          return (
            <line
              key={`${n.id}-${childId}`}
              x1={n.x}
              y1={n.y + 16}
              x2={child.x}
              y2={child.y - 16}
              stroke="#e2e8f0"
              strokeWidth={2}
            />
          );
        })
      )}
      {/* 노드 */}
      {TREE_NODES.map((n) => (
        <g key={n.id}>
          <motion.circle
            cx={n.x}
            cy={n.y}
            r={18}
            fill={getNodeColor(n.id)}
            stroke={getStrokeColor(n.id)}
            strokeWidth={step.expanding === n.id ? 3 : 2}
            animate={{ r: step.expanding === n.id ? 21 : 18 }}
            transition={{ duration: 0.2 }}
          />
          <text
            x={n.x}
            y={n.y + 5}
            textAnchor="middle"
            fontSize={13}
            fontWeight={700}
            fill={getTextColor(n.id)}
          >
            {n.id}
          </text>
          {n.id === "H" && (
            <text x={n.x + 22} y={n.y + 5} fontSize={9} fill="#10b981" fontWeight={600}>
              목표
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 서브컴포넌트: OPEN 리스트 표시                                          */
/* ------------------------------------------------------------------ */
function OpenListDisplay({
  open,
  type,
  accentColor,
}: {
  open: NodeId[];
  type: "stack" | "queue";
  accentColor: "blue" | "emerald";
}) {
  const labelClass = accentColor === "blue"
    ? "text-blue-600 dark:text-blue-400"
    : "text-emerald-600 dark:text-emerald-400";
  const itemClass = accentColor === "blue"
    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300";

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
      <div className={`mb-1.5 flex items-center justify-between text-[11px] font-bold ${labelClass}`}>
        <span>OPEN ({type === "stack" ? "스택 LIFO" : "큐 FIFO"})</span>
        <span className="text-gray-400">{open.length}개</span>
      </div>
      {open.length === 0 ? (
        <span className="text-[10px] italic text-gray-400">비어있음</span>
      ) : (
        <div className="flex items-center gap-1">
          {type === "stack" && (
            <span className="text-[9px] text-gray-400">↑다음</span>
          )}
          {type === "queue" && (
            <span className="text-[9px] text-gray-400">다음→</span>
          )}
          <div className={`flex gap-1 ${type === "stack" ? "flex-col-reverse" : "flex-row"} flex-wrap`}>
            {open.map((id, i) => (
              <span
                key={`${id}-${i}`}
                className={`rounded px-2 py-0.5 text-xs font-bold ${
                  i === 0 ? itemClass : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {id}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 메인 컴포넌트                                                          */
/* ------------------------------------------------------------------ */
export default function BlindSearchVisualizer() {
  const [dfsStep, setDfsStep] = useState(0);
  const [bfsStep, setBfsStep] = useState(0);
  const [dfsPlaying, setDfsPlaying] = useState(false);
  const [bfsPlaying, setBfsPlaying] = useState(false);

  useEffect(() => {
    if (!dfsPlaying) return;
    const t = setTimeout(() => {
      if (dfsStep >= DFS_STEPS.length - 1) { setDfsPlaying(false); return; }
      setDfsStep((s) => s + 1);
    }, 1400);
    return () => clearTimeout(t);
  }, [dfsPlaying, dfsStep]);

  useEffect(() => {
    if (!bfsPlaying) return;
    const t = setTimeout(() => {
      if (bfsStep >= BFS_STEPS.length - 1) { setBfsPlaying(false); return; }
      setBfsStep((s) => s + 1);
    }, 1100);
    return () => clearTimeout(t);
  }, [bfsPlaying, bfsStep]);

  const dfs = DFS_STEPS[dfsStep];
  const bfs = BFS_STEPS[bfsStep];

  return (
    <section className="space-y-8">
      <SectionTitle
        title="2강 · 맹목적 탐색 — DFS vs BFS"
        subtitle="같은 트리에서 어떤 순서로 탐색하느냐에 따라 결과가 달라집니다"
      />

      {/* 개념 비교표 */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
              <th className="py-2 pl-4 text-left font-bold text-gray-600 dark:text-gray-400">항목</th>
              <th className="py-2 pl-4 text-left font-bold text-blue-600">깊이우선 탐색 (DFS)</th>
              <th className="py-2 pl-4 text-left font-bold text-emerald-600">너비우선 탐색 (BFS)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["OPEN 구조", "스택 (LIFO) — 가장 나중에 넣은 것 먼저", "큐 (FIFO) — 가장 먼저 넣은 것 먼저"],
              ["다음 노드 선택", "가장 최근에 생성된 노드 (깊이 방향)", "가장 오래전에 생성된 노드 (레벨 순서)"],
              ["최단 경로 보장", "❌ 보장 안 됨", "✅ 해가 있으면 최단 길이 경로 보장"],
              ["메모리 사용", "적음 — 현재 경로만 저장", "많음 — 모든 레벨을 저장"],
              ["깊이제한 필요?", "⚠️ 무한 루프 방지용 깊이제한 설정 필요", "불필요"],
            ].map(([item, dfs, bfs]) => (
              <tr key={item} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pl-4 font-semibold text-gray-600 dark:text-gray-400">{item}</td>
                <td className="py-2 pl-4 text-gray-700 dark:text-gray-300">{dfs}</td>
                <td className="py-2 pl-4 text-gray-700 dark:text-gray-300">{bfs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 나란히 시각화 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* DFS 패널 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-blue-700 dark:text-blue-300">깊이우선 탐색 (DFS)</h3>
              <p className="text-[11px] text-gray-500">한 방향으로 끝까지 파고든 후 백트래킹</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setDfsStep((s) => Math.max(s - 1, 0))}
                disabled={dfsStep === 0}
                className="rounded p-1 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => { setDfsStep(0); setDfsPlaying(false); }}
                className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <RotateCcw size={12} />
              </button>
              <button
                onClick={() => dfsPlaying ? setDfsPlaying(false) : setDfsPlaying(true)}
                disabled={dfsStep === DFS_STEPS.length - 1}
                className="rounded bg-blue-500 px-2 py-1 text-[11px] font-bold text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {dfsPlaying ? "⏸" : <Play size={12} className="inline" />}
              </button>
              <button
                onClick={() => setDfsStep((s) => Math.min(s + 1, DFS_STEPS.length - 1))}
                disabled={dfsStep === DFS_STEPS.length - 1}
                className="rounded p-1 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-white p-3 dark:border-blue-900/40 dark:bg-gray-900">
            <SearchTreeSVG step={dfs} accentColor="blue" />
          </div>

          <OpenListDisplay open={dfs.open} type="stack" accentColor="blue" />

          <div className={`rounded-lg p-3 text-xs ${
            dfs.found
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200"
              : "bg-blue-50 text-blue-800 dark:bg-blue-950/30 dark:text-blue-200"
          }`}>
            <span className="font-bold">단계 {dfsStep + 1}/{DFS_STEPS.length}:</span> {dfs.note}
          </div>

          <div className="rounded-lg border border-gray-100 bg-gray-50 p-2 text-[11px] text-gray-500 dark:border-gray-800 dark:bg-gray-900">
            확장 순서: {DFS_STEPS.slice(0, dfsStep + 1).map((s) => s.expanding).filter(Boolean).join(" → ")}
          </div>
        </div>

        {/* BFS 패널 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-300">너비우선 탐색 (BFS)</h3>
              <p className="text-[11px] text-gray-500">같은 깊이(레벨)를 모두 확인 후 다음 레벨로</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setBfsStep((s) => Math.max(s - 1, 0))}
                disabled={bfsStep === 0}
                className="rounded p-1 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => { setBfsStep(0); setBfsPlaying(false); }}
                className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <RotateCcw size={12} />
              </button>
              <button
                onClick={() => bfsPlaying ? setBfsPlaying(false) : setBfsPlaying(true)}
                disabled={bfsStep === BFS_STEPS.length - 1}
                className="rounded bg-emerald-500 px-2 py-1 text-[11px] font-bold text-white hover:bg-emerald-600 disabled:opacity-50"
              >
                {bfsPlaying ? "⏸" : <Play size={12} className="inline" />}
              </button>
              <button
                onClick={() => setBfsStep((s) => Math.min(s + 1, BFS_STEPS.length - 1))}
                disabled={bfsStep === BFS_STEPS.length - 1}
                className="rounded p-1 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-white p-3 dark:border-emerald-900/40 dark:bg-gray-900">
            <SearchTreeSVG step={bfs} accentColor="emerald" />
          </div>

          <OpenListDisplay open={bfs.open} type="queue" accentColor="emerald" />

          <div className={`rounded-lg p-3 text-xs ${
            bfs.found
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200"
              : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200"
          }`}>
            <span className="font-bold">단계 {bfsStep + 1}/{BFS_STEPS.length}:</span> {bfs.note}
          </div>

          <div className="rounded-lg border border-gray-100 bg-gray-50 p-2 text-[11px] text-gray-500 dark:border-gray-800 dark:bg-gray-900">
            확장 순서: {BFS_STEPS.slice(0, bfsStep + 1).map((s) => s.expanding).filter(Boolean).join(" → ")}
          </div>
        </div>
      </div>

      {/* 핵심 정리 */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h4 className="mb-2 text-xs font-bold text-gray-600 dark:text-gray-400">핵심 정리</h4>
        <div className="grid gap-2 text-xs sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-blue-400" />
            <p className="text-gray-700 dark:text-gray-300">
              <b>DFS</b>: 깊이 방향으로 최대한 탐색. 메모리 효율적이지만 최단 경로를 보장하지 않고 무한 루프 위험.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
            <p className="text-gray-700 dark:text-gray-300">
              <b>BFS</b>: 레벨 순서로 탐색. 최단 <b>길이</b> 경로를 보장하지만, 비용(거리·시간)은 고려하지 않음.
            </p>
          </div>
          <div className="flex items-start gap-2 sm:col-span-2">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
            <p className="text-gray-700 dark:text-gray-300">
              비용(cost)까지 고려하여 최적 경로를 찾으려면? → <b>균일비용 탐색(UCS)</b> 또는 <b>A* 알고리즘</b>으로!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
