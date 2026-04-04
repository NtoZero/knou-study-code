"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

interface NodeInfo {
  id: string;
  label: string;
  x: number;
  y: number;
  g: number;
  h: number;
  hHat: number;
}

const nodes: NodeInfo[] = [
  { id: "S", label: "S (출발)", x: 60, y: 150, g: 0, h: 15, hHat: 14 },
  { id: "A", label: "A", x: 180, y: 80, g: 3, h: 12, hHat: 11 },
  { id: "B", label: "B", x: 180, y: 220, g: 5, h: 11, hHat: 10 },
  { id: "C", label: "C", x: 310, y: 120, g: 7, h: 8, hHat: 7 },
  { id: "D", label: "D", x: 310, y: 220, g: 9, h: 7, hHat: 6 },
  { id: "E", label: "E", x: 440, y: 150, g: 11, h: 4, hHat: 3 },
  { id: "G", label: "G (목표)", x: 560, y: 150, g: 15, h: 0, hHat: 0 },
];

const edges: [string, string][] = [
  ["S", "A"],
  ["S", "B"],
  ["A", "C"],
  ["B", "D"],
  ["C", "E"],
  ["D", "E"],
  ["E", "G"],
];

const conceptCards = [
  {
    symbol: "g(n)",
    color: "bg-blue-500",
    textColor: "text-blue-600 dark:text-blue-400",
    bgLight: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-300 dark:border-blue-700",
    title: "실제 경로비용",
    desc: "출발노드 S에서 노드 n까지 도달하는 데 소비한 경로비용. 이미 지나온 경로이므로 정확히 알 수 있는 값.",
  },
  {
    symbol: "h(n)",
    color: "bg-rose-500",
    textColor: "text-rose-600 dark:text-rose-400",
    bgLight: "bg-rose-50 dark:bg-rose-900/20",
    borderColor: "border-rose-300 dark:border-rose-700",
    title: "실제 잔여비용",
    desc: "노드 n에서 목표노드 G까지 도달하는 데 필요한 실제 경로비용. 미래의 경로이므로 알 수 없는 값.",
  },
  {
    symbol: "ĥ(n)",
    color: "bg-teal-500",
    textColor: "text-teal-600 dark:text-teal-400",
    bgLight: "bg-teal-50 dark:bg-teal-900/20",
    borderColor: "border-teal-300 dark:border-teal-700",
    title: "예측 잔여비용",
    desc: "경험적 지식(heuristic)을 이용하여 h(n)을 예측한 비용. 경험적 규칙에 기반하므로 정확하지 않을 수 있음.",
  },
];

export default function EvaluationFunctions() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedNode = nodes.find((n) => n.id === selected);

  const getNodePos = (id: string) => {
    const n = nodes.find((nd) => nd.id === id)!;
    return { x: n.x, y: n.y };
  };

  return (
    <section>
      <SectionTitle
        title="1. 경험적 탐색과 평가함수"
        subtitle="경험적 규칙(rule of thumb)을 평가함수에 반영하여 목표상태를 신속하게 탐색하는 방법"
      />

      {/* Rule of thumb explanation */}
      <div className="mb-6 rounded-xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-800 dark:bg-teal-900/20">
        <p className="text-sm font-medium text-teal-800 dark:text-teal-200">
          <span className="font-bold">경험적 규칙(rule of thumb)</span>: 항상 옳은 것은 아니지만 대부분의 경우에 잘 맞는 규칙.
          이를 평가함수에 반영하여 어떤 상태가 목표상태 탐색에 바람직한 정도를 평가.
        </p>
      </div>

      {/* Concept Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {conceptCards.map((card) => (
          <motion.div
            key={card.symbol}
            whileHover={{ scale: 1.02 }}
            className={`rounded-xl border p-4 ${card.borderColor} ${card.bgLight}`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`inline-flex h-8 items-center rounded-lg px-3 text-sm font-bold text-white ${card.color}`}
              >
                {card.symbol}
              </span>
              <span className={`text-sm font-bold ${card.textColor}`}>{card.title}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{card.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Interactive Path Diagram */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-2 text-center text-sm font-semibold text-gray-500">
          경로 다이어그램 — 노드를 클릭하여 g/h/ĥ 값 확인
        </h3>

        <div className="relative mx-auto" style={{ maxWidth: 640 }}>
          <svg viewBox="0 0 640 300" className="w-full">
            {/* Edges */}
            {edges.map(([from, to]) => {
              const a = getNodePos(from);
              const b = getNodePos(to);
              return (
                <line
                  key={`${from}-${to}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="currentColor"
                  className="text-gray-300 dark:text-gray-600"
                  strokeWidth={2}
                />
              );
            })}

            {/* g(n) path highlight for selected node */}
            {selectedNode && selectedNode.id !== "S" && (
              <motion.line
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                x1={60}
                y1={150}
                x2={selectedNode.x}
                y2={selectedNode.y}
                stroke="#3b82f6"
                strokeWidth={3}
                strokeDasharray="6 3"
              />
            )}

            {/* h(n) path highlight for selected node */}
            {selectedNode && selectedNode.id !== "G" && (
              <motion.line
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                x1={selectedNode.x}
                y1={selectedNode.y}
                x2={560}
                y2={150}
                stroke="#f43f5e"
                strokeWidth={3}
                strokeDasharray="6 3"
              />
            )}

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = selected === node.id;
              return (
                <g
                  key={node.id}
                  onClick={() => setSelected(isSelected ? null : node.id)}
                  className="cursor-pointer"
                >
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 26 : 22}
                    fill={
                      node.id === "S"
                        ? "#3b82f6"
                        : node.id === "G"
                          ? "#10b981"
                          : isSelected
                            ? "#14b8a6"
                            : "#6b7280"
                    }
                    animate={{ r: isSelected ? 26 : 22 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    className="pointer-events-none fill-white text-sm font-bold"
                  >
                    {node.id}
                  </text>
                </g>
              );
            })}

            {/* Labels */}
            <text x={60} y={195} textAnchor="middle" className="fill-gray-400 text-xs">
              출발
            </text>
            <text x={560} y={195} textAnchor="middle" className="fill-gray-400 text-xs">
              목표
            </text>
          </svg>
        </div>

        {/* Selected Node Info */}
        <AnimatePresence mode="wait">
          {selectedNode && (
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <h4 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                노드 {selectedNode.label}의 평가함수 값
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-900/20">
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400">g(n)</div>
                  <div className="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {selectedNode.g}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">S → {selectedNode.id} 실제비용</div>
                </div>
                <div className="rounded-lg bg-rose-50 p-3 text-center dark:bg-rose-900/20">
                  <div className="text-xs font-bold text-rose-600 dark:text-rose-400">h(n)</div>
                  <div className="mt-1 text-2xl font-bold text-rose-700 dark:text-rose-300">
                    {selectedNode.h}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {selectedNode.id} → G 실제비용 (미지)
                  </div>
                </div>
                <div className="rounded-lg bg-teal-50 p-3 text-center dark:bg-teal-900/20">
                  <div className="text-xs font-bold text-teal-600 dark:text-teal-400">ĥ(n)</div>
                  <div className="mt-1 text-2xl font-bold text-teal-700 dark:text-teal-300">
                    {selectedNode.hHat}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {selectedNode.id} → G 예측비용
                  </div>
                </div>
              </div>
              <div className="mt-3 text-center text-xs text-gray-500">
                ĥ(n) = {selectedNode.hHat} &le; h(n) = {selectedNode.h} &rarr;{" "}
                <span className="font-bold text-teal-600 dark:text-teal-400">허용적 휴리스틱 조건 충족</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedNode && (
          <p className="mt-4 text-center text-sm text-gray-400">
            노드를 클릭하면 g(n), h(n), ĥ(n) 값을 확인할 수 있습니다
          </p>
        )}
      </div>

      {/* Evaluation Function Table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">기호</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">의미</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">특성</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <tr className="bg-white dark:bg-gray-900">
              <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">g(n)</td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                S에서 n까지 소비한 경로비용
              </td>
              <td className="px-4 py-3 text-gray-500">알려진 값 (actual)</td>
            </tr>
            <tr className="bg-white dark:bg-gray-900">
              <td className="px-4 py-3 font-bold text-rose-600 dark:text-rose-400">h(n)</td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                n에서 G까지 필요한 실제 경로비용
              </td>
              <td className="px-4 py-3 text-gray-500">미지의 값 (unknown)</td>
            </tr>
            <tr className="bg-white dark:bg-gray-900">
              <td className="px-4 py-3 font-bold text-teal-600 dark:text-teal-400">ĥ(n)</td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                경험적 지식으로 h(n)을 예측한 비용
              </td>
              <td className="px-4 py-3 text-gray-500">휴리스틱 예측값</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
