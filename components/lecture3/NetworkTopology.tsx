"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

interface Node {
  x: number;
  y: number;
  id: number;
}

interface Edge {
  from: number;
  to: number;
}

const topologies: {
  name: string;
  nodes: Node[];
  edges: Edge[];
  centerNode?: number;
  pros: string[];
  cons: string[];
  desc: string;
  failExplain: { center: string; other: string };
  whenToUse: string;
}[] = [
  {
    name: "성형 (Star)",
    desc: "중앙 집중 장치(허브)를 중심으로 점대점 연결",
    centerNode: 0,
    nodes: [
      { x: 150, y: 100, id: 0 },
      { x: 50, y: 30, id: 1 },
      { x: 250, y: 30, id: 2 },
      { x: 50, y: 170, id: 3 },
      { x: 250, y: 170, id: 4 },
      { x: 150, y: 190, id: 5 },
    ],
    edges: [
      { from: 0, to: 1 }, { from: 0, to: 2 },
      { from: 0, to: 3 }, { from: 0, to: 4 }, { from: 0, to: 5 },
    ],
    pros: ["고장 진단 용이", "노드 추가/삭제 쉬움", "다른 단말기에 영향 없음"],
    cons: ["중앙 장치 고장 시 전체 마비", "설치 비용이 높을 수 있음"],
    failExplain: { center: "중앙 집중 장치(허브)가 고장나면 모든 연결이 끊어져 전체 네트워크가 마비됩니다. 성형의 가장 큰 약점입니다.", other: "개별 노드가 고장나더라도 중앙 장치와 다른 노드 간의 연결에는 영향이 없습니다. 점대점 연결의 장점입니다." },
    whenToUse: "소규모 네트워크에서 관리가 용이. 분산 성형(distributed star)으로 확장 가능",
  },
  {
    name: "환형 (Ring)",
    desc: "각 노드가 인접 노드와 원형으로 연결",
    nodes: [
      { x: 150, y: 20, id: 0 },
      { x: 260, y: 80, id: 1 },
      { x: 260, y: 160, id: 2 },
      { x: 150, y: 200, id: 3 },
      { x: 40, y: 160, id: 4 },
      { x: 40, y: 80, id: 5 },
    ],
    edges: [
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 },
      { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 5, to: 0 },
    ],
    pros: ["두 경로(2 paths) 존재 — 한쪽 고장 시 백업 가능", "설치 비용 낮음", "전송 지연시간 일정"],
    cons: ["단일 노드 고장 시 전체 네트워크 영향", "노드 추가/삭제 시 네트워크 중단 필요"],
    failExplain: { center: "", other: "환형에서 노드가 고장나면 링이 끊어져 전체 네트워크에 영향을 줍니다. 다만 이중 경로가 있는 경우 백업 경로로 우회 가능합니다." },
    whenToUse: "토큰 링 방식의 LAN에서 사용. 전송 지연시간이 일정하여 실시간 성이 필요한 환경에 적합",
  },
  {
    name: "버스형 (Bus)",
    desc: "하나의 공유 전송 매체(버스)에 모든 노드가 연결",
    nodes: [
      { x: 50, y: 50, id: 0 },
      { x: 120, y: 50, id: 1 },
      { x: 190, y: 50, id: 2 },
      { x: 260, y: 50, id: 3 },
    ],
    edges: [
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 },
    ],
    pros: ["설치 비용 저렴", "노드 추가/삭제 용이", "하나의 노드 고장이 다른 노드에 영향 없음"],
    cons: ["한 번에 하나의 전송만 가능", "메인 케이블(backbone) 고장 시 전체 마비", "단말기 증가 시 성능 저하"],
    failExplain: { center: "", other: "비 backbone 노드가 고장나면 다른 노드에 영향이 없습니다. 그러나 메인 버스 케이블이 끊어지면 전체 네트워크가 마비됩니다." },
    whenToUse: "소규모 LAN, 간단한 구성에 적합. 이더넷 초기 버전(10BASE-2, 10BASE-5)이 버스형 사용",
  },
  {
    name: "그물형 (Mesh)",
    desc: "모든 노드가 다른 모든 노드와 점대점 연결. 연결 수: n(n-1)/2",
    nodes: [
      { x: 80, y: 30, id: 0 },
      { x: 220, y: 30, id: 1 },
      { x: 280, y: 130, id: 2 },
      { x: 180, y: 200, id: 3 },
      { x: 20, y: 130, id: 4 },
    ],
    edges: [
      { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }, { from: 0, to: 4 },
      { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 1, to: 4 },
      { from: 2, to: 3 }, { from: 2, to: 4 },
      { from: 3, to: 4 },
    ],
    pros: ["가장 높은 신뢰도 — 직접 연결로 대체 경로 항상 존재", "보안성과 프라이버시 우수"],
    cons: ["설치 비용 매우 높음", `연결 수 = n(n-1)/2 (5노드 = 10개)`, "설치 및 관리가 복잡"],
    failExplain: { center: "", other: "그물형에서는 노드 하나가 고장나더라도 다른 노드 간의 직접 연결이 남아있어 대체 경로로 통신이 가능합니다. 이것이 그물형의 가장 큰 장점입니다." },
    whenToUse: "높은 신뢰도가 필요한 백본 네트워크, 군사 통신에 적합. 비용이 매우 높아 일반적인 단말기 연결에는 비현실적",
  },
  {
    name: "트리형 (Tree/Hierarchical)",
    desc: "계층적 구조. 성형과 버스형의 조합",
    nodes: [
      { x: 150, y: 20, id: 0 },
      { x: 80, y: 90, id: 1 },
      { x: 220, y: 90, id: 2 },
      { x: 40, y: 160, id: 3 },
      { x: 120, y: 160, id: 4 },
      { x: 180, y: 160, id: 5 },
      { x: 260, y: 160, id: 6 },
    ],
    edges: [
      { from: 0, to: 1 }, { from: 0, to: 2 },
      { from: 1, to: 3 }, { from: 1, to: 4 },
      { from: 2, to: 5 }, { from: 2, to: 6 },
    ],
    pros: ["확장 용이", "계층별 기능 분산으로 관리 용이"],
    cons: ["상위 노드 고장 시 하위 전체 영향", "상위로 갈수록 트래픽 집중"],
    failExplain: { center: "", other: "계층형에서 상위 노드가 고장나면 그 아래 모든 하위 노드가 연결이 끊어집니다. 말단 노드의 고장은 자신만 영향을 받습니다." },
    whenToUse: "처리 능력에 따라 컴퓨터를 계층적으로 배치. 성형과 버스형의 조합으로 구성",
  },
];

export default function NetworkTopology() {
  const [active, setActive] = useState(0);
  const [failedNodes, setFailedNodes] = useState<Set<number>>(new Set());
  const topo = topologies[active];

  const toggleFail = (nodeId: number) => {
    setFailedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const isEdgeActive = (e: Edge) => !failedNodes.has(e.from) && !failedNodes.has(e.to);

  return (
    <section>
      <SectionTitle
        title="네트워크 토폴로지"
        subtitle="노드를 클릭하면 장애를 시뮬레이션할 수 있습니다"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        {/* Topology selector */}
        <div className="mb-4 flex flex-wrap gap-2">
          {topologies.map((t, i) => (
            <button
              key={t.name}
              onClick={() => { setActive(i); setFailedNodes(new Set()); }}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                active === i ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* SVG diagram */}
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
            <svg viewBox="0 0 300 220" className="w-full">
              {/* Edges */}
              {topo.edges.map((e, i) => {
                const from = topo.nodes[e.from];
                const to = topo.nodes[e.to];
                return (
                  <line
                    key={i}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isEdgeActive(e) ? "#f59e0b" : "#ef4444"}
                    strokeWidth={isEdgeActive(e) ? 2 : 1}
                    strokeDasharray={isEdgeActive(e) ? "" : "4"}
                    opacity={isEdgeActive(e) ? 1 : 0.3}
                  />
                );
              })}

              {/* Nodes */}
              {topo.nodes.map((n) => {
                const failed = failedNodes.has(n.id);
                const isCenter = topo.centerNode === n.id;
                return (
                  <g
                    key={n.id}
                    onClick={() => toggleFail(n.id)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={isCenter ? 18 : 14}
                      fill={failed ? "#ef4444" : isCenter ? "#f59e0b" : "#fbbf24"}
                      stroke={failed ? "#b91c1c" : "#d97706"}
                      strokeWidth={2}
                      opacity={failed ? 0.5 : 1}
                    />
                    <text
                      x={n.x}
                      y={n.y + 4}
                      textAnchor="middle"
                      fontSize={10}
                      fill="white"
                      fontWeight="bold"
                    >
                      {failed ? "✕" : isCenter ? "H" : n.id}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="mt-2 text-center text-xs text-gray-400">
              노드를 클릭하여 장애 시뮬레이션
            </p>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-lg font-semibold">{topo.name}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{topo.desc}</p>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-green-600">장점</h4>
              <ul className="mt-1 list-inside list-disc text-sm text-gray-600 dark:text-gray-400">
                {topo.pros.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
            <div className="mt-3">
              <h4 className="text-sm font-semibold text-red-600">단점</h4>
              <ul className="mt-1 list-inside list-disc text-sm text-gray-600 dark:text-gray-400">
                {topo.cons.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>

            {/* When to use */}
            <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm dark:bg-amber-900/20">
              <span className="font-semibold text-amber-700 dark:text-amber-300">적합한 용도:</span>{" "}
              <span className="text-gray-600 dark:text-gray-400">{topo.whenToUse}</span>
            </div>

            {/* Failure explanation */}
            {failedNodes.size > 0 && (
              <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm dark:bg-red-900/20">
                <span className="font-semibold text-red-700 dark:text-red-300">장애 분석:</span>
                <p className="mt-1 text-red-600 dark:text-red-400">
                  {topo.centerNode !== undefined && failedNodes.has(topo.centerNode)
                    ? topo.failExplain.center
                    : topo.failExplain.other}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
