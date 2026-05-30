"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import QuizChoiceExplanation from "@/components/aiReview/QuizChoiceExplanation";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  diagram?: ReactNode;
}

/* ── Q5: BFS Tree Diagram ── */
const BfsTreeDiagram = () => {
  const nodeR = 18;
  const fill = "#e0f7fa";
  const stroke = "#0097a7";

  const nodes: Record<string, [number, number]> = {
    A: [300, 40],
    B: [150, 110],
    C: [300, 110],
    D: [450, 110],
    E: [100, 180],
    F: [250, 180],
    G: [350, 180],
    H: [500, 180],
    I: [60, 250],
    J: [210, 250],
    K: [290, 250],
    L: [330, 250],
    M: [390, 250],
  };

  const edges: [string, string][] = [
    ["A", "B"],
    ["A", "C"],
    ["A", "D"],
    ["B", "E"],
    ["C", "F"],
    ["C", "G"],
    ["D", "H"],
    ["E", "I"],
    ["F", "J"],
    ["F", "K"],
    ["G", "L"],
    ["G", "M"],
  ];

  return (
    <svg
      viewBox="0 0 600 290"
      className="mx-auto w-full max-w-lg"
      role="img"
      aria-label="BFS 탐색 트리 다이어그램"
    >
      <defs>
        <marker id="bfs-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6 Z" fill={stroke} />
        </marker>
      </defs>
      {edges.map(([from, to]) => {
        const [x1, y1] = nodes[from];
        const [x2, y2] = nodes[to];
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ox = (dx / dist) * nodeR;
        const oy = (dy / dist) * nodeR;
        return (
          <line
            key={`${from}-${to}`}
            x1={x1 + ox}
            y1={y1 + oy}
            x2={x2 - ox}
            y2={y2 - oy}
            stroke={stroke}
            strokeWidth={1.5}
            markerEnd="url(#bfs-arrow)"
          />
        );
      })}
      {Object.entries(nodes).map(([label, [cx, cy]]) => (
        <g key={label}>
          <circle cx={cx} cy={cy} r={nodeR} fill={fill} stroke={stroke} strokeWidth={2} />
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={13}
            fontWeight="bold"
            fill="#00695c"
          >
            {label}
          </text>
        </g>
      ))}
    </svg>
  );
};

/* ── Q6: Uniform-Cost Search Tree Diagram ── */
const UcsTreeDiagram = () => {
  const nodeR = 18;
  const fill = "#e0f7fa";
  const stroke = "#0097a7";
  const orangeFill = "#fff3e0";
  const orangeStroke = "#e65100";

  const nodes: Record<string, { pos: [number, number]; orange?: boolean; gLabel?: string }> = {
    A: { pos: [300, 40] },
    B: { pos: [150, 120], gLabel: "" },
    C: { pos: [450, 120], gLabel: "" },
    D: { pos: [60, 210], gLabel: "g=12" },
    E: { pos: [150, 210], gLabel: "g=8" },
    F: { pos: [240, 210], gLabel: "g=10" },
    G: { pos: [370, 210], gLabel: "g=9" },
    H: { pos: [450, 210], gLabel: "g=6" },
    I: { pos: [540, 210], gLabel: "g=12" },
    "B'": { pos: [370, 310], orange: true, gLabel: "g=8" },
    "D'": { pos: [450, 310], orange: true, gLabel: "g=11" },
    J: { pos: [530, 310], gLabel: "g=7" },
  };

  const edges: { from: string; to: string; label?: string }[] = [
    { from: "A", to: "B" },
    { from: "A", to: "C" },
    { from: "B", to: "D" },
    { from: "B", to: "E" },
    { from: "B", to: "F" },
    { from: "C", to: "G" },
    { from: "C", to: "H" },
    { from: "C", to: "I" },
    { from: "H", to: "B'", label: "2" },
    { from: "H", to: "D'", label: "5" },
    { from: "H", to: "J", label: "1" },
  ];

  return (
    <svg
      viewBox="0 0 600 360"
      className="mx-auto w-full max-w-lg"
      role="img"
      aria-label="균일비용 탐색 트리 다이어그램"
    >
      <defs>
        <marker id="ucs-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6 Z" fill={stroke} />
        </marker>
        <marker id="ucs-arrow-o" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6 Z" fill={orangeStroke} />
        </marker>
      </defs>
      {edges.map(({ from, to, label }) => {
        const [x1, y1] = nodes[from].pos;
        const [x2, y2] = nodes[to].pos;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ox = (dx / dist) * nodeR;
        const oy = (dy / dist) * nodeR;
        const isOrange = nodes[to].orange;
        const lineStroke = isOrange ? orangeStroke : stroke;
        return (
          <g key={`${from}-${to}`}>
            <line
              x1={x1 + ox}
              y1={y1 + oy}
              x2={x2 - ox}
              y2={y2 - oy}
              stroke={lineStroke}
              strokeWidth={1.5}
              markerEnd={isOrange ? "url(#ucs-arrow-o)" : "url(#ucs-arrow)"}
            />
            {label && (
              <text
                x={(x1 + x2) / 2 + (dx > 0 ? -12 : 12)}
                y={(y1 + y2) / 2 - 4}
                fontSize={11}
                fontWeight="bold"
                fill={lineStroke}
                textAnchor="middle"
              >
                {label}
              </text>
            )}
          </g>
        );
      })}
      {Object.entries(nodes).map(([label, { pos: [cx, cy], orange, gLabel }]) => (
        <g key={label}>
          <circle
            cx={cx}
            cy={cy}
            r={nodeR}
            fill={orange ? orangeFill : fill}
            stroke={orange ? orangeStroke : stroke}
            strokeWidth={2}
          />
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fontWeight="bold"
            fill={orange ? orangeStroke : "#00695c"}
          >
            {label.replace("'", "")}
          </text>
          {gLabel && (
            <text
              x={cx}
              y={cy + nodeR + 12}
              textAnchor="middle"
              fontSize={10}
              fill="#555"
            >
              {gLabel}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};

const questions: QuizQuestion[] = [
  {
    id: 1,
    question:
      "문제표현의 요소 중 문제의 상태를 변화시키기 위한 도구를 표현하는 것은?",
    options: ["상태묘사", "연산자", "상태공간", "객체"],
    correctIndex: 1,
    explanation:
      "연산자는 문제의 어떠한 상태로부터 변화할 수 있는 다른 상태로 변환하는 도구로서, 변환 테이블이나 변환 함수 등으로 구현할 수 있다.",
  },
  {
    id: 2,
    question: "상태공간에서 문제의 표현을 위해 정의하는 것은?",
    options: [
      "초기상태, 목표상태, 메모리 용량",
      "연산자, 문제풀이 알고리즘",
      "연산자, 탐색트리, 상태묘사",
      "상태묘사 및 초기상태, 목표상태, 연산자",
    ],
    correctIndex: 3,
    explanation:
      "상태공간에서 문제를 표현하기 위해서는 컴퓨터에서 상태를 어떻게 표현할 것인가를 정한 후, 이에 따라 초기상태와 목표상태를 정의한다. 또한 상태를 변환하기 위한 도구인 연산자를 정의한다.",
  },
  {
    id: 3,
    question: "상태공간 탐색에 의한 문제풀이에 대한 올바른 설명은?",
    options: [
      "문제를 여러 개의 부분문제로 분할하여 각각을 풀이하는 방식이다.",
      "알고리즘에 의해 풀이방법을 정의한다.",
      "초기상태에서 목표상태에 도달하는 일련의 연산자를 찾기 위해 시행착오 방식으로 그래프 탐색을 한다.",
      "최대한 탐색 범위를 넓히는 것이 유리하다.",
    ],
    correctIndex: 2,
    explanation:
      "상태공간 탐색에 의한 문제풀이는 초기상태에서 시작하여 목표상태에 도달할 수 있는 일련의 연산자를 찾는 것으로, 이는 상태공간 그래프에서 경로를 탐색하는 방식으로 수행한다. 알고리즘으로 명확하게 풀이가 제시될 수 없는 문제에 대해 시행착오 방식으로 탐색을 수행하며, 이때 탐색에 유용한 지식을 사용함으로써 탐색 범위를 줄여 효율적인 탐색이 되도록 한다.",
  },
  {
    id: 4,
    question:
      "깊이우선 탐색 과정에서 다음 확장할 노드를 선택하는 기준을 올바르게 설명한 것은?",
    options: [
      "목표노드에 가까운 것을 먼저 확장한다.",
      "가장 최근에 생성된 노드를 먼저 확장한다.",
      "가장 오래전에 생성된 노드를 먼저 확장한다.",
      "깊이제한을 넘어선 노드를 먼저 확장한다.",
    ],
    correctIndex: 1,
    explanation:
      "깊이우선 탐색에서는 탐색 진행방향(깊이 방향)으로 계속 전진하여 목표를 탐색하므로 가장 최근에 생성된 노드를 먼저 확장한다. 이때 목표에 도달할 수 없는 경로를 계속 탐색하게 될 수 있으므로 깊이제한(depth bound)을 정하여 무한정 진행하는 것을 방지한다.",
  },
  {
    id: 5,
    question:
      "상태공간 그래프가 아래 그림과 같을 때 너비우선 탐색으로 초기상태 A에서 출발하여 목표상태 L에 도달하는 동안 노드가 확장되는 순서는?",
    diagram: <BfsTreeDiagram />,
    options: [
      "A → B → E → I → J → C → F → K → G",
      "A → C → F → K → G",
      "A → B → C → D → E → F → G",
      "A → C → G",
    ],
    correctIndex: 2,
    explanation:
      "너비우선 탐색은 레벨 순서대로 노드를 확장한다. 트리 구조(A→B,C,D; B→E; C→F,G; D→H; E→I; F→J,K; G→L,M)에서 A→B→C→D→E→F→G 순서로 확장하며, G를 확장할 때 후계노드 L(목표)이 발견되어 탐색이 성공한다.",
  },
  {
    id: 6,
    question:
      "균일비용 탐색 과정에서 탐색트리가 아래 그림과 같다. 노드 D, E, F, G, H, I의 경로비용은 각각 g(D)=12, g(E)=8, g(F)=10, g(G)=9, g(H)=6, g(I)=12이다. 노드 H를 확장하여 후계노드 B, D, J가 생성되었고(B와 D는 이미 동일한 상태가 생성되어 각각 CLOSED와 OPEN에 저장되어 있음), H와 각 후계노드 사이의 비용은 각각 C(H,B)=2, C(H,D)=5, C(H,J)=1이다. 균일비용 탐색의 처리 과정에 대한 설명을 옳은 것은?",
    diagram: <UcsTreeDiagram />,
    options: [
      "기존의 B는 CLOSED에서 제거하고, 새로 생성된 B를 OPEN에 넣는다.",
      "새로 생성된 D는 제거한다.",
      "기존의 D와 새로 생성된 D를 모두 제거한다.",
      "다음 확장할 노드는 J이다.",
    ],
    correctIndex: 3,
    explanation:
      "기존의 B는 이미 확장되어 CLOSED에 들어있으며, 동일 노드가 생성되었을 때 새로운 B의 비용이 더 작을 수 없으므로 새로운 B는 제거한다. 새로 생성된 D의 비용은 g(D)=g(H)+C(H,D)=6+5=11로, 현재 OPEN에 있는 D의 비용보다 작으므로 OPEN의 D를 제거하고 새로운 D를 넣는다. 다음 확장할 노드는 g(J)=7로 비용이 제일 작으므로 J가 선택된다.",
  },
];

export default function QuizSection() {
  const [answers, setAnswers] = useState<Record<number, number | null>>(
    Object.fromEntries(questions.map((q) => [q.id, null]))
  );
  const [revealed, setRevealed] = useState<Record<number, boolean>>(
    Object.fromEntries(questions.map((q) => [q.id, false]))
  );

  const selectAnswer = (qId: number, optIndex: number) => {
    if (revealed[qId]) return;
    setAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const checkAnswer = (qId: number) => {
    setRevealed((prev) => ({ ...prev, [qId]: true }));
  };

  const resetAll = () => {
    setAnswers(Object.fromEntries(questions.map((q) => [q.id, null])));
    setRevealed(Object.fromEntries(questions.map((q) => [q.id, false])));
  };

  const totalCorrect = questions.filter(
    (q) => revealed[q.id] && answers[q.id] === q.correctIndex
  ).length;
  const totalRevealed = questions.filter((q) => revealed[q.id]).length;

  return (
    <section>
      <SectionTitle
        title="6. 연습문제"
        subtitle="2강 문제풀이(1) 핵심 개념 확인 퀴즈"
      />

      {/* Score */}
      {totalRevealed > 0 && (
        <div className="mb-6 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-center dark:border-cyan-800 dark:bg-cyan-950">
          <span className="text-lg font-bold text-cyan-700 dark:text-cyan-300">
            {totalCorrect} / {totalRevealed}
          </span>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            정답 ({totalRevealed}/{questions.length} 문항 확인)
          </span>
        </div>
      )}

      <div className="space-y-6">
        {questions.map((q) => {
          const selected = answers[q.id];
          const isRevealed = revealed[q.id];
          const isCorrect = selected === q.correctIndex;

          return (
            <div
              key={q.id}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
            >
              <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-white">
                  {q.id}
                </span>
                {q.question}
              </h3>

              {q.diagram && (
                <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                  <p className="mb-2 text-xs font-semibold text-gray-500">지문</p>
                  {q.diagram}
                </div>
              )}

              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  let optClass =
                    "border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750";
                  if (isRevealed) {
                    if (i === q.correctIndex) {
                      optClass =
                        "border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-950";
                    } else if (i === selected && !isCorrect) {
                      optClass =
                        "border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-950";
                    } else {
                      optClass =
                        "border-gray-200 bg-gray-50 opacity-50 dark:border-gray-700 dark:bg-gray-800";
                    }
                  } else if (i === selected) {
                    optClass =
                      "border-cyan-400 bg-cyan-50 dark:border-cyan-600 dark:bg-cyan-950";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => selectAnswer(q.id, i)}
                      disabled={isRevealed}
                      className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${optClass}`}
                    >
                      <span className="mr-2 font-medium text-gray-500">
                        {i + 1}.
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {!isRevealed && selected !== null && (
                <button
                  onClick={() => checkAnswer(q.id)}
                  className="mt-3 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-600"
                >
                  정답 확인
                </button>
              )}

              <AnimatePresence>
                {isRevealed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 overflow-hidden"
                  >
                    <div
                      className={`rounded-lg p-3 text-sm ${
                        isCorrect
                          ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                          : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                      }`}
                    >
                      <p className="font-semibold">
                        {isCorrect ? "정답!" : "오답"}
                      </p>
                      <div className="mt-1 text-xs">
                        <QuizChoiceExplanation
                          correct={isCorrect}
                          choiceText={q.options[selected ?? q.correctIndex]}
                          correctChoiceText={q.options[q.correctIndex]}
                          basisText={q.explanation}
                          wrongRule={`정답 선택지 "${q.options[q.correctIndex]}"이 따르는 탐색 정의·OPEN/CLOSED 처리·비용 기준과 선택한 보기를 비교한다.`}
                          accentClass="text-cyan-700 dark:text-cyan-300"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Reset button */}
      <div className="mt-6 text-center">
        <button
          onClick={resetAll}
          className="rounded-lg bg-gray-200 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          전체 초기화
        </button>
      </div>
    </section>
  );
}
