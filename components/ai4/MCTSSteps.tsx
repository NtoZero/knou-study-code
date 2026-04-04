"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import PseudocodeViewer from "@/components/common/PseudocodeViewer";

/* -------- Phase data -------- */
interface MCTSPhase {
  id: number;
  title: string;
  titleEn: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  details: string[];
  treeDescription: string;
}

const phases: MCTSPhase[] = [
  {
    id: 1,
    title: "선택",
    titleEn: "Selection",
    color: "text-fuchsia-600",
    bgColor: "bg-fuchsia-50 dark:bg-fuchsia-950",
    borderColor: "border-fuchsia-500",
    description: "루트노드에서 시작하여 선택전략에 따라 자식노드를 깊이방향으로 반복 선택",
    details: [
      "시도하지 않은 행동이 남아 있는 노드에 도달할 때까지 반복",
      "UCT 알고리즘으로 탐사와 활용의 균형을 맞춤",
      "UCB1이 최대인 자식노드를 선택",
    ],
    treeDescription: "루트에서 리프까지 경로를 따라 내려감",
  },
  {
    id: 2,
    title: "확장",
    titleEn: "Expansion",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50 dark:bg-cyan-950",
    borderColor: "border-cyan-500",
    description: "선택된 노드에 새로운 행동으로 자식노드를 생성하고 트리에 추가",
    details: [
      "아직 시도하지 않은 행동(action) 중 하나를 선택",
      "새 자식노드를 트리에 추가",
    ],
    treeDescription: "선택된 노드에서 새 자식 생성",
  },
  {
    id: 3,
    title: "시뮬레이션",
    titleEn: "Simulation",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
    borderColor: "border-emerald-500",
    description: "확장된 노드부터 게임 종료까지 스스로 게임 진행 (롤아웃/플레이아웃)",
    details: [
      "무작위 또는 유사 무작위 방법으로 게임 끝까지 진행",
      "결과: 승리(+1), 무승부(0), 패배(-1)",
      "경험적 평가함수 없이 실제 게임 결과로 가치 추정",
    ],
    treeDescription: "새 노드에서 게임 종료까지 롤아웃",
  },
  {
    id: 4,
    title: "역전파",
    titleEn: "Backpropagation",
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    borderColor: "border-amber-500",
    description: "시뮬레이션 결과를 확장된 노드로부터 루트노드까지 선택경로를 따라 역전파",
    details: [
      "각 노드의 vSum(가치 합)과 NVisit(방문횟수) 업데이트",
      "경로 상의 모든 조상노드에 결과 반영",
    ],
    treeDescription: "결과를 새 노드에서 루트까지 역전파",
  },
];

/* -------- Tree visual per phase -------- */
interface VisualNode {
  id: string;
  label: string;
  visits: string;
  x: number;
  y: number;
  highlighted: boolean;
  isNew?: boolean;
  children?: string[];
}

const treesByPhase: Record<number, { nodes: VisualNode[]; edges: [string, string][]; path?: string[]; rolloutLine?: boolean }> = {
  1: {
    nodes: [
      { id: "r", label: "R", visits: "10/20", x: 150, y: 20, highlighted: true, children: ["a", "b"] },
      { id: "a", label: "A", visits: "7/12", x: 80, y: 80, highlighted: true, children: ["c", "d"] },
      { id: "b", label: "B", visits: "3/8", x: 220, y: 80, highlighted: false },
      { id: "c", label: "C", visits: "4/6", x: 40, y: 140, highlighted: true },
      { id: "d", label: "D", visits: "3/6", x: 120, y: 140, highlighted: false },
    ],
    edges: [["r", "a"], ["r", "b"], ["a", "c"], ["a", "d"]],
    path: ["r", "a", "c"],
  },
  2: {
    nodes: [
      { id: "r", label: "R", visits: "10/20", x: 150, y: 20, highlighted: false, children: ["a", "b"] },
      { id: "a", label: "A", visits: "7/12", x: 80, y: 80, highlighted: false, children: ["c", "d"] },
      { id: "b", label: "B", visits: "3/8", x: 220, y: 80, highlighted: false },
      { id: "c", label: "C", visits: "4/6", x: 40, y: 140, highlighted: true, children: ["e"] },
      { id: "d", label: "D", visits: "3/6", x: 120, y: 140, highlighted: false },
      { id: "e", label: "E", visits: "0/0", x: 40, y: 200, highlighted: true, isNew: true },
    ],
    edges: [["r", "a"], ["r", "b"], ["a", "c"], ["a", "d"], ["c", "e"]],
  },
  3: {
    nodes: [
      { id: "r", label: "R", visits: "10/20", x: 150, y: 20, highlighted: false },
      { id: "a", label: "A", visits: "7/12", x: 80, y: 80, highlighted: false },
      { id: "b", label: "B", visits: "3/8", x: 220, y: 80, highlighted: false },
      { id: "c", label: "C", visits: "4/6", x: 40, y: 140, highlighted: false },
      { id: "d", label: "D", visits: "3/6", x: 120, y: 140, highlighted: false },
      { id: "e", label: "E", visits: "0/0", x: 40, y: 200, highlighted: true, isNew: true },
    ],
    edges: [["r", "a"], ["r", "b"], ["a", "c"], ["a", "d"], ["c", "e"]],
    rolloutLine: true,
  },
  4: {
    nodes: [
      { id: "r", label: "R", visits: "11/21", x: 150, y: 20, highlighted: true },
      { id: "a", label: "A", visits: "8/13", x: 80, y: 80, highlighted: true },
      { id: "b", label: "B", visits: "3/8", x: 220, y: 80, highlighted: false },
      { id: "c", label: "C", visits: "5/7", x: 40, y: 140, highlighted: true },
      { id: "d", label: "D", visits: "3/6", x: 120, y: 140, highlighted: false },
      { id: "e", label: "E", visits: "1/1", x: 40, y: 200, highlighted: true, isNew: true },
    ],
    edges: [["r", "a"], ["r", "b"], ["a", "c"], ["a", "d"], ["c", "e"]],
    path: ["e", "c", "a", "r"],
  },
};

/* -------- Final action strategies -------- */
const finalStrategies = [
  { name: "최대 자식 (max child)", desc: "가장 큰 보상을 갖는 자식 선택" },
  { name: "강인한 자식 (robust child)", desc: "가장 많이 방문한 자식 선택" },
  { name: "최대-강인 자식 (max-robust child)", desc: "방문횟수 최다 + 최대 보상인 자식 선택" },
  { name: "안전한 자식 (secure child)", desc: "신뢰도 하한(LCB)이 최대인 자식 선택. v + A/sqrt(n)" },
];

/* -------- Pseudocode -------- */
const mctsPseudocodeLines = [
  { text: "function MCTS(s)" },
  { text: "  nRoot <- CreateNode(s)" },
  { text: "  while 시간 예산 이내 do" },
  { text: "    n <- nRoot" },
  { text: "    while not Terminal(n) do" },
  { text: "      a <- NewAction(n)" },
  { text: "      if a = NULL then n <- BestChild(n)", comment: "선택" },
  { text: "      else n <- Expand(n, a); exit-loop", comment: "확장" },
  { text: "    value <- Rollout(n)", comment: "시뮬레이션" },
  { text: "    Backpropagate(n, value)", comment: "역전파" },
  { text: "  return BestAction(nRoot)" },
  { text: "" },
  { text: "function Backpropagate(n, v)" },
  { text: "  while n != NULL do" },
  { text: "    n.vSum <- n.vSum + v" },
  { text: "    n.NVisit <- n.NVisit + 1" },
  { text: "    n <- n.parent" },
];

const mctsPhaseLines: Record<number, number[]> = {
  0: [2, 3, 4, 5, 6],       // Selection
  1: [2, 3, 4, 5, 7],       // Expansion
  2: [8],                     // Simulation (Rollout)
  3: [9, 12, 13, 14, 15, 16], // Backpropagation
};

export default function MCTSSteps() {
  const [activePhase, setActivePhase] = useState(0);
  const [autoCycle, setAutoCycle] = useState(false);
  const [showPseudo, setShowPseudo] = useState(false);

  useEffect(() => {
    if (!autoCycle) return;
    const timer = setInterval(() => {
      setActivePhase((p) => (p + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, [autoCycle]);

  const phase = phases[activePhase];
  const treeData = treesByPhase[phase.id];
  const nodesMap = Object.fromEntries(treeData.nodes.map((n) => [n.id, n]));

  return (
    <section>
      <SectionTitle
        title="3. 몬테카를로 트리 탐색 (MCTS)"
        subtitle="게임 의사결정 문제에서 무작위 표본화 기반 탐색트리 구성"
      />

      {/* Overview */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border-l-4 border-fuchsia-500 bg-fuchsia-50 p-4 dark:bg-fuchsia-950">
          <h4 className="text-sm font-bold">활용 (Exploitation)</h4>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">검토를 시도해 본 경로의 노드 활용 - 지금까지 결과 중 가장 우수한 결과를 낼 수 있는 수를 선택</p>
        </div>
        <div className="rounded-lg border-l-4 border-cyan-500 bg-cyan-50 p-4 dark:bg-cyan-950">
          <h4 className="text-sm font-bold">탐사 (Exploration)</h4>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">검토해 보지 않은 경로의 노드 탐사 - 아직 덜 유망하지만 향후 우수할 수 있는 수를 선택</p>
        </div>
      </div>

      {/* Node info */}
      <div className="mb-6 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>노드 정보:</strong> v<sub>i</sub> = 현재 가치 (vSum) | N<sub>i</sub> = 방문횟수 (NVisit)<br />
          <strong>노드 표시:</strong> vSum / NVisit 형식
        </p>
      </div>

      {/* 4-phase tabs */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {phases.map((p, i) => (
            <button
              key={p.id}
              onClick={() => { setActivePhase(i); setAutoCycle(false); }}
              className={`flex-1 px-2 py-3 text-center text-xs font-bold transition-colors ${
                activePhase === i
                  ? `${p.bgColor} ${p.color} ${p.borderColor} border-b-2`
                  : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {p.id}. {p.title}
            </button>
          ))}
        </div>

        <div className="p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${
                  activePhase === 0 ? "bg-fuchsia-500" : activePhase === 1 ? "bg-cyan-500" : activePhase === 2 ? "bg-emerald-500" : "bg-amber-500"
                }`}>
                  {phase.id}
                </span>
                <div>
                  <h4 className={`font-bold ${phase.color}`}>
                    {phase.title} ({phase.titleEn})
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{phase.description}</p>
                </div>
              </div>

              {/* Tree visualization */}
              <div className="relative mx-auto mb-4 h-64 w-full max-w-sm overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-800">
                <svg className="absolute inset-0 h-full w-full">
                  {treeData.edges.map(([from, to]) => {
                    const f = nodesMap[from];
                    const t = nodesMap[to];
                    if (!f || !t) return null;
                    const isOnPath = treeData.path?.includes(from) && treeData.path?.includes(to);
                    return (
                      <line
                        key={`${from}-${to}`}
                        x1={f.x + 20}
                        y1={f.y + 20}
                        x2={t.x + 20}
                        y2={t.y + 20}
                        stroke={isOnPath ? "#d946ef" : "#9ca3af"}
                        strokeWidth={isOnPath ? 2.5 : 1.5}
                        strokeDasharray={isOnPath ? "" : "4"}
                      />
                    );
                  })}
                  {/* Rollout line for simulation */}
                  {treeData.rolloutLine && (
                    <>
                      <line x1={60} y1={220} x2={60} y2={250} stroke="#10b981" strokeWidth={2} strokeDasharray="3" />
                      <text x={72} y={245} fill="#10b981" fontSize={10} fontWeight="bold">rollout...</text>
                      <text x={72} y={258} fill="#10b981" fontSize={9}>+1 / 0 / -1</text>
                    </>
                  )}
                </svg>

                {treeData.nodes.map((node) => (
                  <motion.div
                    key={node.id}
                    animate={{
                      scale: node.highlighted ? 1.1 : 1,
                    }}
                    className={`absolute flex flex-col items-center justify-center rounded-full border-2 ${
                      node.isNew
                        ? "border-emerald-500 bg-emerald-100 dark:bg-emerald-900"
                        : node.highlighted
                        ? "border-fuchsia-500 bg-fuchsia-100 dark:bg-fuchsia-900"
                        : "border-gray-400 bg-white dark:bg-gray-700"
                    }`}
                    style={{
                      left: node.x,
                      top: node.y,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <span className="text-[10px] font-bold">{node.label}</span>
                    <span className="text-[8px] text-gray-500 dark:text-gray-400">{node.visits}</span>
                  </motion.div>
                ))}
              </div>

              {/* Details */}
              <ul className="space-y-1">
                {phase.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="mt-0.5 text-fuchsia-400">&#x2022;</span>
                    {d}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setAutoCycle(!autoCycle)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                autoCycle
                  ? "bg-fuchsia-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {autoCycle ? "자동 순환 중..." : "자동 순환"}
            </button>
            <span className="text-xs text-gray-400">{activePhase + 1} / 4</span>
          </div>
        </div>
      </div>

      {/* UCT Formula */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-3 text-sm font-bold">UCT (Upper Confidence Bound Applied to Trees)</h3>
        <div className="mb-3 rounded-lg bg-fuchsia-50 p-4 text-center dark:bg-fuchsia-950">
          <p className="text-lg font-mono font-bold text-fuchsia-700 dark:text-fuchsia-300">
            UCB1(n<sub>i</sub>) = <span className="border-b-2 border-fuchsia-400">v&#772;<sub>i</sub></span> + C &times; <span className="border-b-2 border-cyan-400">&radic;(ln N<sub>p</sub> / N<sub>i</sub>)</span>
          </p>
          <div className="mt-2 flex justify-center gap-6 text-xs">
            <span className="text-fuchsia-600">활용 항</span>
            <span className="text-cyan-600">탐사 항</span>
          </div>
        </div>
        <div className="grid gap-2 text-xs sm:grid-cols-2">
          <div className="rounded bg-gray-50 p-2 dark:bg-gray-800">
            <strong>v&#772;<sub>i</sub></strong>: 노드 n<sub>i</sub>의 평균 가치 (활용 항)
          </div>
          <div className="rounded bg-gray-50 p-2 dark:bg-gray-800">
            <strong>N<sub>i</sub></strong>: 노드 n<sub>i</sub>의 방문횟수
          </div>
          <div className="rounded bg-gray-50 p-2 dark:bg-gray-800">
            <strong>N<sub>p</sub></strong>: 부모노드의 방문횟수
          </div>
          <div className="rounded bg-gray-50 p-2 dark:bg-gray-800">
            <strong>C</strong>: 탐사 상수 (탐사-활용 균형 제어)
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          UCB1이 최대인 자식노드 선택: k = argmax<sub>i</sub> UCB1(n<sub>i</sub>)
        </p>
      </div>

      {/* Final action selection strategies */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-3 text-sm font-bold">최종 행동 선택 전략</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {finalStrategies.map((s) => (
            <div key={s.name} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <h4 className="text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400">{s.name}</h4>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pseudocode */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <button
          onClick={() => setShowPseudo(!showPseudo)}
          className="flex w-full items-center justify-between p-4 text-sm font-bold"
        >
          <span>MCTS 의사코드</span>
          <motion.span animate={{ rotate: showPseudo ? 180 : 0 }}>&#9660;</motion.span>
        </button>
        <AnimatePresence>
          {showPseudo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-gray-200 p-4 dark:border-gray-700"
            >
              <PseudocodeViewer
                lines={mctsPseudocodeLines}
                highlightedLines={mctsPhaseLines[activePhase] ?? []}
                accentColor="fuchsia"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
