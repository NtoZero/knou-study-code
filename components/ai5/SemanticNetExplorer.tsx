"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { Info } from "lucide-react";

interface NodeData {
  id: string;
  label: string;
  x: number;
  y: number;
  properties: Record<string, string>;
  color: string;
}

interface EdgeData {
  from: string;
  to: string;
  label: string;
  type: "ako" | "isa" | "has-part";
}

const nodes: NodeData[] = [
  {
    id: "car",
    label: "자동차",
    x: 300,
    y: 60,
    properties: {},
    color: "#f97316",
  },
  {
    id: "engine",
    label: "엔진",
    x: 530,
    y: 60,
    properties: { 배기량: "1998", 최대출력: "275" },
    color: "#a855f7",
  },
  {
    id: "sedan",
    label: "승용차",
    x: 160,
    y: 200,
    properties: { 승차인원: "5" },
    color: "#3b82f6",
  },
  {
    id: "truck",
    label: "화물차",
    x: 440,
    y: 200,
    properties: { 승차인원: "2" },
    color: "#3b82f6",
  },
  {
    id: "A",
    label: "A",
    x: 160,
    y: 340,
    properties: { 배기량: "1591", 최대출력: "140" },
    color: "#22c55e",
  },
  {
    id: "B",
    label: "B",
    x: 440,
    y: 340,
    properties: {},
    color: "#22c55e",
  },
];

const edges: EdgeData[] = [
  { from: "car", to: "engine", label: "has-part", type: "has-part" },
  { from: "sedan", to: "car", label: "ako", type: "ako" },
  { from: "truck", to: "car", label: "ako", type: "ako" },
  { from: "A", to: "sedan", label: "isa", type: "isa" },
  { from: "B", to: "truck", label: "isa", type: "isa" },
];

const arcTypes = [
  {
    type: "ako",
    label: "ako (a kind of)",
    description: "상위 클래스의 하위 클래스 관계",
    example: "대학생 →(ako)→ 학생",
    color: "text-blue-600 dark:text-blue-400",
    lineColor: "#3b82f6",
  },
  {
    type: "isa",
    label: "isa (is a)",
    description: "클래스의 구체적 사례(인스턴스) 관계",
    example: "김철수 →(isa)→ 대학생",
    color: "text-green-600 dark:text-green-400",
    lineColor: "#22c55e",
  },
  {
    type: "has-part",
    label: "has-part",
    description: "부속품(구성요소) 관계",
    example: "자동차 →(has-part)→ 엔진",
    color: "text-purple-600 dark:text-purple-400",
    lineColor: "#a855f7",
  },
];

const inheritanceForB: { property: string; value: string; source: string }[] = [
  { property: "배기량", value: "1998", source: "자동차에서 상속" },
  { property: "최대출력", value: "275", source: "자동차에서 상속" },
  { property: "승차인원", value: "2", source: "화물차에서 상속" },
  { property: "has-part", value: "엔진", source: "자동차에서 상속" },
];

const centralAdvantages = [
  "구성 용이: 노드와 아크로 직관적 구성",
  "수정 용이: 상위 노드 수정 시 하위에 자동 반영",
  "최신 유지: 중앙 변경으로 전체 최신 상태 유지",
  "자동 분배: 특성상속으로 하위 개체에 자동 분배",
];

export default function SemanticNetExplorer() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [highlightArc, setHighlightArc] = useState<string | null>(null);
  const [showInheritance, setShowInheritance] = useState(false);

  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  const getEdgeColor = (type: string) => {
    if (type === "ako") return "#3b82f6";
    if (type === "isa") return "#22c55e";
    return "#a855f7";
  };

  const isOnInheritancePath = (nodeId: string) => {
    return showInheritance && ["B", "truck", "car", "engine"].includes(nodeId);
  };

  return (
    <section>
      <SectionTitle
        title="시맨틱 네트 (Semantic Network)"
        subtitle="노드와 아크로 구성된 방향 그래프 기반 지식표현"
      />

      {/* SVG Graph */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-2 text-sm font-semibold text-gray-500">
          자동차 시맨틱 네트 — 노드 클릭하여 속성 확인
        </h3>
        <div className="overflow-x-auto">
          <svg
            viewBox="0 0 650 420"
            className="mx-auto w-full max-w-2xl"
            style={{ minWidth: 500 }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#9ca3af"
                />
              </marker>
              <marker
                id="arrowhead-blue"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
              </marker>
              <marker
                id="arrowhead-green"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
              </marker>
              <marker
                id="arrowhead-purple"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#a855f7" />
              </marker>
              <marker
                id="arrowhead-orange"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
              </marker>
            </defs>

            {/* Edges */}
            {edges.map((edge, i) => {
              const from = getNode(edge.from);
              const to = getNode(edge.to);
              const color = getEdgeColor(edge.type);
              const isHighlighted =
                highlightArc === edge.type ||
                (showInheritance &&
                  isOnInheritancePath(edge.from) &&
                  isOnInheritancePath(edge.to));
              const markerId =
                edge.type === "ako"
                  ? "arrowhead-blue"
                  : edge.type === "isa"
                  ? "arrowhead-green"
                  : "arrowhead-purple";
              return (
                <g key={i}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={color}
                    strokeWidth={isHighlighted ? 3 : 1.5}
                    strokeDasharray={isHighlighted ? "none" : "none"}
                    opacity={isHighlighted ? 1 : 0.5}
                    markerEnd={`url(#${markerId})`}
                  />
                  <text
                    x={(from.x + to.x) / 2}
                    y={(from.y + to.y) / 2 - 8}
                    textAnchor="middle"
                    className="text-[11px] font-medium"
                    fill={color}
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode === node.id;
              const isPath = isOnInheritancePath(node.id);
              return (
                <g
                  key={node.id}
                  onClick={() =>
                    setSelectedNode(
                      selectedNode === node.id ? null : node.id
                    )
                  }
                  className="cursor-pointer"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 34 : 30}
                    fill={node.color}
                    opacity={isPath ? 1 : 0.85}
                    stroke={isSelected ? "#fff" : isPath ? "#f97316" : "none"}
                    strokeWidth={isSelected ? 3 : isPath ? 3 : 0}
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fill="white"
                    className="text-sm font-bold"
                    style={{ pointerEvents: "none" }}
                  >
                    {node.label}
                  </text>
                  {/* properties badge */}
                  {Object.keys(node.properties).length > 0 && (
                    <text
                      x={node.x}
                      y={node.y + 50}
                      textAnchor="middle"
                      fill="#6b7280"
                      className="text-[10px]"
                      style={{ pointerEvents: "none" }}
                    >
                      {Object.entries(node.properties)
                        .map(([k, v]) => `${k}:${v}`)
                        .join(", ")}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected node details */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
                <h4 className="text-sm font-bold text-orange-700 dark:text-orange-300">
                  {getNode(selectedNode).label} 속성
                </h4>
                {Object.keys(getNode(selectedNode).properties).length > 0 ? (
                  <ul className="mt-2 space-y-1">
                    {Object.entries(getNode(selectedNode).properties).map(
                      ([k, v]) => (
                        <li
                          key={k}
                          className="text-sm text-gray-700 dark:text-gray-300"
                        >
                          <strong>{k}:</strong> {v}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">
                    직접 정의된 속성 없음 (상속으로 획득)
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Arc types */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {arcTypes.map((arc) => (
          <motion.button
            key={arc.type}
            whileHover={{ scale: 1.02 }}
            onMouseEnter={() => setHighlightArc(arc.type)}
            onMouseLeave={() => setHighlightArc(null)}
            className="rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <span className={`text-sm font-bold ${arc.color}`}>
              {arc.label}
            </span>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              {arc.description}
            </p>
            <p className="mt-1 font-mono text-xs text-gray-500">
              {arc.example}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Property Inheritance Demo */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">특성상속 (Property Inheritance)</h3>
          <button
            onClick={() => setShowInheritance(!showInheritance)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              showInheritance
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {showInheritance ? "상속 경로 숨기기" : "B의 상속 확인"}
          </button>
        </div>

        <AnimatePresence>
          {showInheritance && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                <strong>B</strong>는 화물차(isa)이고, 화물차는 자동차(ako)이므로
                상위 클래스의 속성을 상속받음:
              </p>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded bg-green-100 px-2 py-1 font-bold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  B
                </span>
                <span className="text-gray-400">→(isa)→</span>
                <span className="rounded bg-blue-100 px-2 py-1 font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  화물차
                </span>
                <span className="text-gray-400">→(ako)→</span>
                <span className="rounded bg-orange-100 px-2 py-1 font-bold text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                  자동차
                </span>
                <span className="text-gray-400">→(has-part)→</span>
                <span className="rounded bg-purple-100 px-2 py-1 font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  엔진
                </span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-3 py-2 text-left text-gray-500">속성</th>
                    <th className="px-3 py-2 text-left text-gray-500">값</th>
                    <th className="px-3 py-2 text-left text-gray-500">출처</th>
                  </tr>
                </thead>
                <tbody>
                  {inheritanceForB.map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <td className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                        {row.property}
                      </td>
                      <td className="px-3 py-2 text-orange-600 dark:text-orange-400">
                        {row.value}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-500">
                        {row.source}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Centralized advantages */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-start gap-2">
          <Info size={18} className="mt-0.5 shrink-0 text-orange-500" />
          <div>
            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">
              중앙집중식 특성상속의 장점
            </h4>
            <ul className="mt-2 space-y-1">
              {centralAdvantages.map((adv, i) => (
                <li
                  key={i}
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  {i + 1}. {adv}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
