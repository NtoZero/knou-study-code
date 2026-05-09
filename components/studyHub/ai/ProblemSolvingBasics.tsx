"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/* ------------------------------------------------------------------ */
/* 8-퍼즐 데이터                                                         */
/* ------------------------------------------------------------------ */
// 각 상태는 3x3 배열 (0 = 빈칸)
type PuzzleBoard = number[][];

interface PuzzleState {
  board: PuzzleBoard;
  label: string;
  operatorUsed?: string;
  cost: number;
}

const INITIAL: PuzzleBoard = [
  [1, 2, 3],
  [4, 0, 6],
  [7, 5, 8],
];
const GOAL: PuzzleBoard = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0], // 실제 목표는 [1,2,3/4,5,6/7,8,0]
];

// 간단한 상태 전이 예시 (빈칸을 상하좌우 이동)
const PUZZLE_STEPS: PuzzleState[] = [
  {
    board: [
      [1, 2, 3],
      [4, 0, 6],
      [7, 5, 8],
    ],
    label: "초기상태",
    cost: 0,
  },
  {
    board: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 0, 8],
    ],
    label: "빈칸 상향 이동",
    operatorUsed: "연산자: 빈칸↑",
    cost: 1,
  },
  {
    board: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 0],
    ],
    label: "목표상태 도달!",
    operatorUsed: "연산자: 빈칸→",
    cost: 2,
  },
];

/* ------------------------------------------------------------------ */
/* 개념 카드                                                              */
/* ------------------------------------------------------------------ */
const CONCEPTS = [
  {
    id: "state",
    label: "상태(State)",
    icon: "📸",
    color: "border-blue-300 dark:border-blue-800",
    bgCls: "bg-blue-50 dark:bg-blue-950/30",
    textCls: "text-blue-700 dark:text-blue-300",
    desc: "문제의 특정 시점의 모습. 퍼즐 판의 배치, 로봇의 위치 등.",
    detail: (
      <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
        <p><b>초기상태:</b> 최초에 주어진 문제의 상태 (출발점)</p>
        <p><b>목표상태:</b> 풀이된 결과에 해당하는 상태 (도달 목표)</p>
        <p className="mt-1 text-[11px] text-gray-400">예) 8-퍼즐의 초기 배치 → 정렬된 최종 배치</p>
      </div>
    ),
  },
  {
    id: "desc",
    label: "상태묘사",
    icon: "💾",
    color: "border-violet-300 dark:border-violet-800",
    bgCls: "bg-violet-50 dark:bg-violet-950/30",
    textCls: "text-violet-700 dark:text-violet-300",
    desc: "상태를 컴퓨터가 처리할 수 있도록 자료구조로 표현한 것.",
    detail: (
      <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
        <p>8-퍼즐 → 3×3 배열(2차원 배열)</p>
        <p>도시 간 경로 → 그래프(인접 행렬/리스트)</p>
        <p>하노이 탑 → 세 기둥의 스택 목록</p>
        <div className="mt-1 rounded bg-gray-100 p-2 font-mono text-[10px] dark:bg-gray-800">
          {"struct { int board[3][3]; int blankX, blankY; }"}
        </div>
      </div>
    ),
  },
  {
    id: "operator",
    label: "연산자(Operator)",
    icon: "⚙️",
    color: "border-amber-300 dark:border-amber-800",
    bgCls: "bg-amber-50 dark:bg-amber-950/30",
    textCls: "text-amber-700 dark:text-amber-300",
    desc: "한 상태를 다른 상태로 변환하는 행동. 탐색의 이동 수단.",
    detail: (
      <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
        <p>8-퍼즐: 빈칸 상·하·좌·우 이동 (4개 연산자)</p>
        <p>경로 탐색: 현재 도시에서 인접 도시로 이동</p>
        <p>로봇: 앞으로 이동, 좌회전, 우회전</p>
        <p className="mt-1 text-[11px] text-gray-400">연산자 적용 가능 조건을 먼저 검사해야 함.</p>
      </div>
    ),
  },
  {
    id: "space",
    label: "상태공간",
    icon: "🗺️",
    color: "border-emerald-300 dark:border-emerald-800",
    bgCls: "bg-emerald-50 dark:bg-emerald-950/30",
    textCls: "text-emerald-700 dark:text-emerald-300",
    desc: "초기상태에서 연산자를 적용하여 얻을 수 있는 모든 상태의 집합. 방향 그래프로 표현.",
    detail: (
      <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
        <p>노드 = 상태, 엣지 = 연산자(행동)</p>
        <p>문제풀이 = 그래프에서 경로 탐색</p>
        <p>8-퍼즐의 상태 수 = 9! = 362,880가지</p>
        <p className="mt-1 text-[11px] text-gray-400">실세계 문제는 상태 수가 천문학적으로 많아질 수 있음.</p>
      </div>
    ),
  },
];

/* ------------------------------------------------------------------ */
/* 문제 표현 3요소                                                        */
/* ------------------------------------------------------------------ */
const THREE_ELEMENTS = [
  {
    num: "①",
    title: "상태묘사 + 초기상태",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    desc: "문제 상태를 컴퓨터로 표현하는 방법과 출발 상태를 정의.",
  },
  {
    num: "②",
    title: "목표상태",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    desc: "풀이가 완료됐을 때의 상태. '목표 조건'으로 정의하기도 함.",
  },
  {
    num: "③",
    title: "연산자",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    desc: "상태를 변환하는 행동. 이 세 가지만 정의하면 탐색 알고리즘이 해를 찾을 수 있음.",
  },
];

/* ------------------------------------------------------------------ */
/* 메인 컴포넌트                                                          */
/* ------------------------------------------------------------------ */
export default function ProblemSolvingBasics() {
  const [activeConceptId, setActiveConceptId] = useState<string | null>("state");
  const [puzzleStep, setPuzzleStep] = useState(0);

  const activeConcept = CONCEPTS.find((c) => c.id === activeConceptId);

  return (
    <section className="space-y-10">
      <SectionTitle
        title="2강 · AI의 문제풀이 — 상태공간 탐색의 기초"
        subtitle="알고리즘을 이해하기 전에 '문제를 어떻게 표현하는가'부터 이해해야 합니다"
      />

      {/* ── 왜 탐색인가? ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
        <div className="flex items-start gap-3">
          <Info size={18} className="mt-0.5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-bold text-amber-800 dark:text-amber-200">
              왜 AI에서 '탐색'이 중요할까요?
            </p>
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
              일반적인 프로그램은 입력 → 계산 → 출력이 명확히 정해져 있습니다.
              하지만 체스, 바둑, 경로 찾기처럼 가능한 경우의 수가 너무 많아
              <b> 모든 경우를 미리 코드로 작성할 수 없는 문제</b>가 있습니다.
              이런 문제는 <b>상태를 정의하고, 가능한 경로를 탐색하여 해를 찾습니다.</b>
            </p>
          </div>
        </div>
      </div>

      {/* ── 핵심 개념 4가지 ─────────────────────────────────────── */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
          핵심 개념 — 클릭하여 자세히 보기
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CONCEPTS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveConceptId(activeConceptId === c.id ? null : c.id)}
              className={`rounded-xl border-2 p-3 text-left transition-all ${c.color} ${c.bgCls} ${
                activeConceptId === c.id ? "shadow-md ring-2 ring-indigo-400/40" : "opacity-75 hover:opacity-100"
              }`}
            >
              <div className="mb-1 text-2xl">{c.icon}</div>
              <div className={`text-xs font-bold ${c.textCls}`}>{c.label}</div>
              <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2">{c.desc}</p>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeConcept && (
            <motion.div
              key={activeConcept.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className={`mt-3 rounded-xl border-2 p-4 ${activeConcept.color} ${activeConcept.bgCls}`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xl">{activeConcept.icon}</span>
                <span className={`text-sm font-bold ${activeConcept.textCls}`}>{activeConcept.label}</span>
              </div>
              {activeConcept.detail}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 8-퍼즐 상태 전이 시각화 ──────────────────────────────── */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
          8-퍼즐로 보는 상태 전이
        </h3>
        <div className="rounded-xl border border-indigo-200 bg-white p-5 dark:border-indigo-900/40 dark:bg-gray-900">
          {/* 스텝 선택 버튼 */}
          <div className="mb-4 flex items-center gap-3">
            {PUZZLE_STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => setPuzzleStep(i)}
                className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition-all ${
                  puzzleStep === i
                    ? "border-indigo-400 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                    : "border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {/* 퍼즐 보드 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={puzzleStep}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <PuzzleGrid board={PUZZLE_STEPS[puzzleStep].board} goal={GOAL} />
              </motion.div>
            </AnimatePresence>

            <div className="shrink-0 space-y-2 text-center sm:text-left">
              {PUZZLE_STEPS[puzzleStep].operatorUsed && (
                <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                  <ArrowRight size={12} />
                  {PUZZLE_STEPS[puzzleStep].operatorUsed}
                </div>
              )}
              <div className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs dark:bg-gray-800">
                <span className="text-gray-500">이동 횟수:</span>{" "}
                <span className="font-bold text-indigo-600">{PUZZLE_STEPS[puzzleStep].cost}</span>
              </div>
              {puzzleStep === 2 && (
                <div className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                  🎯 목표 도달!
                </div>
              )}
              <div className="mt-2 max-w-[160px] text-[10px] text-gray-400">
                연두색 = 목표 위치와 일치
                <br />
                회색 = 위치 불일치
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-200">
            <b>정리:</b> 초기상태에서 연산자를 반복 적용하여 목표상태에 도달하는 경로를 찾는 것 = <b>상태공간 탐색</b>
          </div>
        </div>
      </div>

      {/* ── 문제 표현 3요소 ───────────────────────────────────────── */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
          상태공간에서 문제를 표현하는 3요소
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {THREE_ELEMENTS.map((el) => (
            <div key={el.num} className={`rounded-xl p-4 ${el.bg}`}>
              <div className={`mb-1 text-lg font-black ${el.color}`}>{el.num}</div>
              <div className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">{el.title}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{el.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          <b>핵심:</b> 이 3가지만 정의하면, DFS·BFS·UCS·A* 등 탐색 알고리즘이 자동으로 해를 찾아줍니다.
          탐색 알고리즘은 문제를 모르고, 오직 상태·연산자·목표 조건만 봅니다.
        </div>
      </div>

      {/* ── 두 가지 문제풀이 전략 ─────────────────────────────────── */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
          두 가지 문제풀이 전략
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/30">
            <div className="mb-2 text-sm font-bold text-indigo-700 dark:text-indigo-300">
              🗺️ 상태공간 탐색
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              초기상태 → (연산자 반복 적용) → 목표상태
              <br />
              그래프에서 경로를 찾는 방식.
              <br />
              <span className="mt-1 block text-indigo-600 dark:text-indigo-400 font-medium">
                예) 8-퍼즐, 경로 탐색, 게임 트리
              </span>
            </p>
          </div>
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/40 dark:bg-purple-950/30">
            <div className="mb-2 text-sm font-bold text-purple-700 dark:text-purple-300">
              ✂️ 문제축소(Problem Reduction)
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              큰 문제 → 부분문제로 분할 → 각각 해결
              <br />
              재귀적으로 반복하여 원시문제로 축소.
              <br />
              <span className="mt-1 block text-purple-600 dark:text-purple-400 font-medium">
                예) 하노이 탑 (n개 → n-1개 × 2 + 이동 1번)
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 퍼즐 그리드 서브컴포넌트                                               */
/* ------------------------------------------------------------------ */
function PuzzleGrid({ board, goal }: { board: PuzzleBoard; goal: PuzzleBoard }) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {board.flat().map((cell, idx) => {
        const row = Math.floor(idx / 3);
        const col = idx % 3;
        const isCorrect = cell !== 0 && goal[row][col] === cell;
        return (
          <div
            key={idx}
            className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-lg font-bold transition-all ${
              cell === 0
                ? "border-dashed border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
                : isCorrect
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                  : "border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            }`}
          >
            {cell !== 0 ? cell : ""}
          </div>
        );
      })}
    </div>
  );
}
