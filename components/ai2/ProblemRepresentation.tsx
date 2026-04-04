"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

/* ---------- 8-Puzzle board ---------- */
const initialBoard = [
  ["2", "8", "3"],
  ["1", "6", "4"],
  ["7", " ", "5"],
];

const goalBoard = [
  ["1", "2", "3"],
  ["8", " ", "4"],
  ["7", "6", "5"],
];

/* ---------- Concept cards ---------- */
const concepts = [
  {
    id: "state",
    title: "상태 (State)",
    color: "bg-cyan-500",
    content: [
      "퍼즐 판의 배치 형태 등 문제의 특정 시점의 모습",
      "**초기상태**: 최초에 주어진 문제의 상태",
      "**목표상태**: 풀이된 결과에 해당되는 상태",
    ],
  },
  {
    id: "stateDesc",
    title: "상태묘사 (State Description)",
    color: "bg-teal-500",
    content: [
      "풀이하고자 하는 문제의 상태를 컴퓨터로 처리하기 위한 **적절한 자료구조로 표현한 것**",
      "자료구조: 기호 열, 벡터, 다차원 배열, 트리, 리스트",
      "자연스러운 표현 + 상태 변화 연산이 용이한 표현이어야 함",
    ],
    code: `struct PuzzleState {
    int blankX, blankY;
    char board[3][3];
};`,
  },
  {
    id: "operator",
    title: "연산자 (Operator)",
    color: "bg-blue-500",
    content: [
      "어느 한 상태로부터 변화할 수 있는 **다른 상태로 변환하는 역할**",
      "구현 방법 1: **변환 테이블** — 모든 입력 상태묘사에 대해 출력 상태묘사 목록 저장",
      "구현 방법 2: **일반화된 변환 규칙** — 상태묘사를 다른 상태묘사로 변화시키는 함수로 정의",
    ],
    code: `// 빈 칸 상향 이동 연산자
int opMvBlnkUp(PuzzleState* s) {
    if (s->blankY > 0) {
        s->board[s->blankX][s->blankY] =
            s->board[s->blankX][s->blankY-1];
        s->board[s->blankX][--s->blankY] = ' ';
        return 1;
    }
    else return 0;
}`,
  },
  {
    id: "stateSpace",
    title: "상태공간 (State Space)",
    color: "bg-indigo-500",
    content: [
      "정의된 연산자 집합을 이용하여 초기상태로부터 얻을 수 있는 **모든 상태의 집합**",
      "방향성 그래프로 부모상태와 후계상태의 관계를 표현",
      "상태공간에서 문제 표현의 세 요소:",
    ],
    threeElements: [
      "1. 상태묘사 및 초기상태 정의",
      "2. 연산자 정의",
      "3. 목표상태 정의",
    ],
  },
] as const;

/* ---------- Problem-solving strategies ---------- */
const strategies = [
  {
    name: "시행착오",
    desc: "다양한 방법을 시도하여 해를 찾는 방법",
    icon: "🔄",
  },
  {
    name: "통찰",
    desc: "문제의 구조를 파악하여 해법에 도달",
    icon: "💡",
  },
  {
    name: "경험적 방법",
    desc: "과거 경험에 기반한 개연성 있는 접근",
    icon: "📊",
  },
  {
    name: "알고리즘",
    desc: "정해진 절차에 따라 반드시 해를 찾는 방법",
    icon: "📝",
  },
];

function PuzzleBoard({
  board,
  label,
}: {
  board: string[][];
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <div className="grid grid-cols-3 gap-1 rounded-lg border-2 border-cyan-300 bg-cyan-50 p-2 dark:border-cyan-700 dark:bg-cyan-950">
        {board.flat().map((cell, i) => (
          <div
            key={i}
            className={`flex h-12 w-12 items-center justify-center rounded-md text-lg font-bold ${
              cell === " "
                ? "bg-gray-200 dark:bg-gray-700"
                : "bg-white shadow-sm dark:bg-gray-800"
            }`}
          >
            {cell === " " ? "" : cell}
          </div>
        ))}
      </div>
    </div>
  );
}

function BoldText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="text-cyan-600 dark:text-cyan-400">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function ProblemRepresentation() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showReduction, setShowReduction] = useState(false);

  return (
    <section>
      <SectionTitle
        title="1. 문제의 표현"
        subtitle="8-퍼즐 예시를 통한 상태, 상태묘사, 연산자, 상태공간 개념 이해"
      />

      {/* 8-Puzzle visualization */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          8-퍼즐 문제 예시
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <PuzzleBoard board={initialBoard} label="초기상태" />
          <div className="text-2xl text-gray-400">→</div>
          <PuzzleBoard board={goalBoard} label="목표상태" />
        </div>
        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          빈 칸을 상/하/좌/우로 이동하여 초기상태에서 목표상태에 도달하는 문제
        </p>
      </div>

      {/* Concept cards */}
      <div className="space-y-2">
        {concepts.map((concept) => {
          const isOpen = expanded === concept.id;
          return (
            <motion.div key={concept.id} layout>
              <button
                onClick={() => setExpanded(isOpen ? null : concept.id)}
                className={`w-full rounded-lg ${concept.color} px-4 py-3 text-left text-white transition-opacity hover:opacity-90`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{concept.title}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ▼
                  </motion.span>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-b-lg border border-t-0 border-gray-200 bg-white p-5 text-sm dark:border-gray-700 dark:bg-gray-900">
                      <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                        {concept.content.map((item, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-cyan-500">-</span>
                            <span>
                              <BoldText text={item} />
                            </span>
                          </li>
                        ))}
                      </ul>

                      {"threeElements" in concept && concept.threeElements && (
                        <div className="mt-3 rounded-lg bg-cyan-50 p-3 dark:bg-cyan-950">
                          {concept.threeElements.map((el, i) => (
                            <p
                              key={i}
                              className="text-sm font-medium text-cyan-700 dark:text-cyan-300"
                            >
                              {el}
                            </p>
                          ))}
                        </div>
                      )}

                      {"code" in concept && concept.code && (
                        <div className="mt-3">
                          <span className="text-xs font-semibold text-gray-500">
                            코드 예시 (C)
                          </span>
                          <pre className="mt-1 overflow-x-auto rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-800">
                            <code>{concept.code}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Problem Reduction */}
      <div className="mt-8">
        <button
          onClick={() => setShowReduction(!showReduction)}
          className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                문제축소 (Problem Reduction)
              </h3>
              <p className="text-xs text-gray-500">
                주어진 문제를 부분문제로 분할하여 풀이
              </p>
            </div>
            <motion.span
              animate={{ rotate: showReduction ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400"
            >
              ▼
            </motion.span>
          </div>
        </button>

        <AnimatePresence>
          {showReduction && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="rounded-b-xl border border-t-0 border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                  주어진 문제를 <strong className="text-cyan-600 dark:text-cyan-400">부분문제로 분할</strong>하는
                  과정을 순환적으로 반복하여 원시문제로 축소하는 과정으로 문제를 풀이하는 방법.
                </p>
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    예시: 하노이 탑 문제
                  </h4>
                  <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <p>n개 원판을 A에서 C로 이동 (B를 보조 기둥으로 사용):</p>
                    <p className="pl-4">1. 상위 n-1개 원판을 A → B로 이동</p>
                    <p className="pl-4">2. 가장 큰 원판을 A → C로 이동</p>
                    <p className="pl-4">3. n-1개 원판을 B → C로 이동</p>
                    <p className="mt-2 text-cyan-600 dark:text-cyan-400">
                      → 큰 문제를 동일한 구조의 작은 부분문제로 분할 (재귀)
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Problem-solving strategies */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          문제풀이 전략
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {strategies.map((s) => (
            <div
              key={s.name}
              className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center dark:border-gray-800 dark:bg-gray-800"
            >
              <div className="mb-1 text-2xl">{s.icon}</div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {s.name}
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
