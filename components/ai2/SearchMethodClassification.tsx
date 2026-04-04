"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

/* ---------- Tree data ---------- */
interface TreeNode {
  id: string;
  label: string;
  desc?: string;
  children?: TreeNode[];
}

const searchTree: TreeNode = {
  id: "root",
  label: "탐색 방법",
  desc: "상태공간에서 목표노드를 찾는 방법",
  children: [
    {
      id: "blind",
      label: "맹목적 탐색 (Blind Search)",
      desc: "목표노드의 위치와 무관한 순서로 노드 확장. 매우 소모적인 탐색 가능성이 높음",
      children: [
        {
          id: "blind-any",
          label: "임의 경로 탐색",
          children: [
            {
              id: "dfs",
              label: "깊이우선 탐색 (DFS)",
              desc: "탐색 진행방향(깊이 방향)으로 계속 전진. OPEN은 스택(LIFO)",
            },
            {
              id: "bfs",
              label: "너비우선 탐색 (BFS)",
              desc: "트리의 레벨 순서에 따라 노드 확장. OPEN은 큐(FIFO). 최단경로 보장",
            },
          ],
        },
        {
          id: "blind-opt",
          label: "최적 경로 탐색",
          children: [
            {
              id: "ucs",
              label: "균일비용 탐색",
              desc: "출발노드로부터의 경로비용 g(n)이 최소인 노드를 선택. 최소비용 경로 탐색",
            },
          ],
        },
      ],
    },
    {
      id: "heuristic",
      label: "경험적 탐색 (Heuristic Search)",
      desc: "목표노드 위치와 관련된 경험적 정보를 사용. 경험적 정보: 항상 옳은 것은 아니지만 개연성이 있어 많은 경우 잘 맞는 정보",
      children: [
        {
          id: "heuristic-any",
          label: "임의 경로 탐색",
          children: [
            {
              id: "hill",
              label: "언덕오르기 탐색",
              desc: "현재 노드에서 가장 좋은 이웃 노드로 이동",
            },
            {
              id: "bestfirst",
              label: "최적우선 탐색",
              desc: "평가함수 값이 가장 좋은 노드를 확장",
            },
            {
              id: "sa",
              label: "모의 담금질",
              desc: "확률적으로 나쁜 이동도 허용하여 지역 최적 탈출",
            },
          ],
        },
        {
          id: "heuristic-opt",
          label: "최적 경로 탐색",
          children: [
            {
              id: "astar",
              label: "A* 알고리즘",
              desc: "f(n) = g(n) + h(n)을 이용한 최적 경로 탐색",
            },
          ],
        },
      ],
    },
  ],
};

/* ---------- Expansion process steps ---------- */
const expansionSteps = [
  "정해진 기준에 따라 OPEN에서 노드를 선택",
  "선택된 노드에 적용 가능한 모든 연산자를 가하여 모든 후계노드를 생성 (노드의 확장)",
  "후계노드에 부모노드를 가리키는 포인터 첨부 (풀이 경로 역추적용)",
  "목표노드 존재 여부 검사",
];

function TreeNodeComponent({
  node,
  depth,
  expandedIds,
  toggleExpand,
}: {
  node: TreeNode;
  depth: number;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
}) {
  const isExpanded = expandedIds.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const isLeaf = !hasChildren;

  const bgColors = [
    "bg-cyan-500",
    "bg-cyan-600",
    "bg-cyan-700",
    "bg-teal-600",
  ];
  const leafBg = "bg-cyan-100 dark:bg-cyan-900/40 border border-cyan-300 dark:border-cyan-700";

  return (
    <div className={depth > 0 ? "ml-4 border-l-2 border-cyan-200 pl-4 dark:border-cyan-800" : ""}>
      <button
        onClick={() => hasChildren && toggleExpand(node.id)}
        className={`mt-2 w-full rounded-lg px-4 py-2 text-left text-sm transition-all ${
          isLeaf
            ? leafBg + " text-cyan-800 dark:text-cyan-200"
            : bgColors[Math.min(depth, bgColors.length - 1)] +
              " text-white hover:opacity-90"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium">{node.label}</span>
          {hasChildren && (
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.15 }}
              className="text-xs"
            >
              ▼
            </motion.span>
          )}
        </div>
      </button>

      <AnimatePresence>
        {(isExpanded || isLeaf) && node.desc && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 px-4 text-xs text-gray-500 dark:text-gray-400"
          >
            {node.desc}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {node.children!.map((child) => (
              <TreeNodeComponent
                key={child.id}
                node={child}
                depth={depth + 1}
                expandedIds={expandedIds}
                toggleExpand={toggleExpand}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SearchMethodClassification() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(["root"])
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const collect = (node: TreeNode) => {
      allIds.add(node.id);
      node.children?.forEach(collect);
    };
    collect(searchTree);
    setExpandedIds(allIds);
  };

  const collapseAll = () => {
    setExpandedIds(new Set(["root"]));
  };

  return (
    <section>
      <SectionTitle
        title="2. 탐색 방법의 분류"
        subtitle="맹목적 탐색과 경험적 탐색, 임의 경로와 최적 경로에 따른 분류"
      />

      {/* Controls */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={expandAll}
          className="rounded-lg bg-cyan-100 px-3 py-1.5 text-xs font-medium text-cyan-700 transition-colors hover:bg-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-300 dark:hover:bg-cyan-800/60"
        >
          모두 펼치기
        </button>
        <button
          onClick={collapseAll}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          모두 접기
        </button>
      </div>

      {/* Tree */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <TreeNodeComponent
          node={searchTree}
          depth={0}
          expandedIds={expandedIds}
          toggleExpand={toggleExpand}
        />
      </div>

      {/* Classification table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                목적 / 정보사용
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                임의 경로 탐색
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                최적 경로 탐색
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                맹목적 탐색
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                깊이우선 탐색, 너비우선 탐색
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                균일비용 탐색
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                경험적 탐색
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                언덕오르기, 최적우선, 모의 담금질
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                A* 알고리즘
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* OPEN / CLOSED concept */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          핵심 자료구조: OPEN / CLOSED 리스트
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border-2 border-cyan-300 bg-cyan-50 p-4 dark:border-cyan-700 dark:bg-cyan-950">
            <h4 className="font-bold text-cyan-700 dark:text-cyan-300">
              OPEN 리스트
            </h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              앞으로 <strong>확장할 노드</strong>를 저장하는 리스트
            </p>
          </div>
          <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800">
            <h4 className="font-bold text-gray-700 dark:text-gray-300">
              CLOSED 리스트
            </h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              이미 <strong>확장한 노드</strong>를 저장하는 리스트
            </p>
          </div>
        </div>
      </div>

      {/* Node expansion process */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          노드 확장 과정
        </h3>
        <div className="space-y-3">
          {expansionSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-white">
                {i + 1}
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
