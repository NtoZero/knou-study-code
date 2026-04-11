"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Network, GitBranch, Info } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/**
 * 상태공간과 탐색 트리의 관계 소개
 * - 연습용 5-node 그래프 (S, A, B, C, G) 사용 (과제 a~g와 무관)
 * - 상태공간 vs 탐색 트리 차이 시각화
 */

type NodeId = "S" | "A" | "B" | "C" | "G";

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
  { id: "S", x: 60, y: 120 },
  { id: "A", x: 180, y: 60 },
  { id: "B", x: 180, y: 180 },
  { id: "C", x: 320, y: 120 },
  { id: "G", x: 440, y: 120 },
];

const EDGES: Edge[] = [
  { from: "S", to: "A", cost: 3 },
  { from: "S", to: "B", cost: 2 },
  { from: "A", to: "C", cost: 4 },
  { from: "B", to: "C", cost: 5 },
  { from: "C", to: "G", cost: 2 },
  { from: "A", to: "B", cost: 1 },
];

interface TreeNode {
  id: NodeId;
  label: string;
  children?: TreeNode[];
}

// 탐색 트리 — 같은 상태가 여러 번 나올 수 있음을 보여주는 예
const TREE: TreeNode = {
  id: "S",
  label: "S",
  children: [
    {
      id: "A",
      label: "A",
      children: [
        { id: "B", label: "B" },
        { id: "C", label: "C" },
      ],
    },
    {
      id: "B",
      label: "B",
      children: [{ id: "C", label: "C" }],
    },
  ],
};

const CLASSIFICATION = [
  {
    category: "비정보 탐색 (Blind)",
    items: [
      { name: "DFS", optimal: "X", complete: "△", memory: "O(bm)" },
      { name: "BFS", optimal: "최단 길이만", complete: "O", memory: "O(b^d)" },
      { name: "UCS", optimal: "O (비용 ≥ 0)", complete: "O", memory: "O(b^(1+C*/ε))" },
    ],
  },
  {
    category: "정보 탐색 (Informed)",
    items: [
      { name: "언덕오르기", optimal: "X", complete: "X", memory: "O(1)" },
      { name: "Best-First", optimal: "X", complete: "△", memory: "지수" },
      { name: "A*", optimal: "허용적 h 에서 O", complete: "O", memory: "지수" },
    ],
  },
];

export default function StateSpaceIntro() {
  const [highlightId, setHighlightId] = useState<NodeId | null>(null);

  function nodeById(id: NodeId) {
    return NODES.find((n) => n.id === id)!;
  }

  return (
    <section>
      <SectionTitle
        title="상태공간 그래프와 탐색 트리"
        subtitle="탐색 알고리즘을 이해하려면 두 구조의 차이부터 명확히 해야 함"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* 상태공간 그래프 */}
        <div className="rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-900/40 dark:bg-gray-900">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <Network size={16} />
            상태공간 그래프 (연습용)
          </div>
          <p className="mb-3 text-xs text-gray-500">
            각 노드는 <b>상태</b>, 각 엣지는 그 상태 사이를 오가는 <b>행동(연산자)</b>.
            같은 상태는 그래프에서 단 하나만 존재함.
          </p>
          <svg viewBox="0 0 500 240" className="w-full">
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
                    stroke="#94a3b8"
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
              const active = highlightId === n.id;
              return (
                <g
                  key={n.id}
                  onMouseEnter={() => setHighlightId(n.id)}
                  onMouseLeave={() => setHighlightId(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={20}
                    fill={active ? "#6366f1" : "#eef2ff"}
                    stroke="#6366f1"
                    strokeWidth={2}
                  />
                  <text
                    x={n.x}
                    y={n.y + 5}
                    textAnchor="middle"
                    fontSize={14}
                    fontWeight={700}
                    fill={active ? "#ffffff" : "#4338ca"}
                  >
                    {n.id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 탐색 트리 */}
        <div className="rounded-xl border border-purple-200 bg-white p-4 dark:border-purple-900/40 dark:bg-gray-900">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-600">
            <GitBranch size={16} />
            탐색 트리
          </div>
          <p className="mb-3 text-xs text-gray-500">
            같은 상태(B, C)가 <b>여러 번</b> 나타날 수 있음. 탐색 트리의 노드는
            "어떤 경로로 도달했는가"까지 반영한 객체이므로 별개임.
          </p>
          <TreeDiagram root={TREE} onHover={setHighlightId} highlightId={highlightId} />
        </div>
      </div>

      {/* 분류 표 */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-indigo-50 p-4 dark:border-gray-800 dark:bg-indigo-950/20">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
          <Info size={14} /> 탐색 알고리즘 분류
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {CLASSIFICATION.map((grp) => (
            <div
              key={grp.category}
              className="rounded-lg bg-white p-3 text-xs dark:bg-gray-900"
            >
              <div className="mb-2 font-bold text-indigo-600">{grp.category}</div>
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400">
                    <th className="text-left font-normal">알고리즘</th>
                    <th className="text-left font-normal">최적성</th>
                    <th className="text-left font-normal">완전성</th>
                    <th className="text-left font-normal">메모리</th>
                  </tr>
                </thead>
                <tbody>
                  {grp.items.map((it) => (
                    <tr key={it.name} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="py-1 font-semibold">{it.name}</td>
                      <td className="py-1 text-gray-600 dark:text-gray-400">{it.optimal}</td>
                      <td className="py-1 text-gray-600 dark:text-gray-400">{it.complete}</td>
                      <td className="py-1 font-mono text-[10px] text-gray-600 dark:text-gray-400">
                        {it.memory}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-4 rounded-lg border-l-4 border-indigo-500 bg-indigo-50 p-3 text-xs text-gray-700 dark:bg-indigo-950/30 dark:text-gray-300"
      >
        <b>핵심:</b> 탐색 트리는 상태공간 그래프를 <b>출발노드에서 펼쳐낸 결과</b>임. 이때
        중복 상태를 어떻게 제거하느냐가 알고리즘의 효율과 정확성을 결정함.
      </motion.div>
    </section>
  );
}

function TreeDiagram({
  root,
  onHover,
  highlightId,
}: {
  root: TreeNode;
  onHover: (id: NodeId | null) => void;
  highlightId: NodeId | null;
}) {
  // 계층별 좌표 계산 (단순 고정 레이아웃)
  const LEVELS: { x: number; y: number; node: TreeNode; parentPos?: { x: number; y: number } }[] = [];
  const yByDepth = [40, 110, 190];

  function walk(
    node: TreeNode,
    depth: number,
    xStart: number,
    xEnd: number,
    parentPos?: { x: number; y: number }
  ) {
    const x = (xStart + xEnd) / 2;
    const y = yByDepth[depth];
    LEVELS.push({ x, y, node, parentPos });
    const children = node.children ?? [];
    if (children.length === 0) return;
    const slice = (xEnd - xStart) / children.length;
    children.forEach((c, i) => {
      walk(c, depth + 1, xStart + slice * i, xStart + slice * (i + 1), { x, y });
    });
  }
  walk(root, 0, 0, 500);

  return (
    <svg viewBox="0 0 500 230" className="w-full">
      {LEVELS.map((lv, i) =>
        lv.parentPos ? (
          <line
            key={`l${i}`}
            x1={lv.parentPos.x}
            y1={lv.parentPos.y + 18}
            x2={lv.x}
            y2={lv.y - 18}
            stroke="#c4b5fd"
            strokeWidth={2}
          />
        ) : null
      )}
      {LEVELS.map((lv, i) => {
        const active = highlightId === lv.node.id;
        return (
          <g
            key={`n${i}`}
            onMouseEnter={() => onHover(lv.node.id)}
            onMouseLeave={() => onHover(null)}
            className="cursor-pointer"
          >
            <circle
              cx={lv.x}
              cy={lv.y}
              r={18}
              fill={active ? "#a855f7" : "#faf5ff"}
              stroke="#a855f7"
              strokeWidth={2}
            />
            <text
              x={lv.x}
              y={lv.y + 5}
              textAnchor="middle"
              fontSize={13}
              fontWeight={700}
              fill={active ? "#ffffff" : "#7c3aed"}
            >
              {lv.node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
