"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

/* ── 8-Puzzle types ── */
type Board = number[]; // 0 = blank

const GOAL: Board = [1, 2, 3, 8, 0, 4, 7, 6, 5];

function hHat(board: Board): number {
  return board.reduce((acc, v, i) => {
    if (v === 0) return acc;
    return acc + (v !== GOAL[i] ? 1 : 0);
  }, 0);
}

function swap(board: Board, i: number, j: number): Board {
  const b = [...board];
  [b[i], b[j]] = [b[j], b[i]];
  return b;
}

function getSuccessors(board: Board): { board: Board; cost: number; move: string }[] {
  const blank = board.indexOf(0);
  const row = Math.floor(blank / 3);
  const col = blank % 3;
  const moves: { dr: number; dc: number; label: string }[] = [
    { dr: -1, dc: 0, label: "위" },
    { dr: 1, dc: 0, label: "아래" },
    { dr: 0, dc: -1, label: "왼쪽" },
    { dr: 0, dc: 1, label: "오른쪽" },
  ];
  const result: { board: Board; cost: number; move: string }[] = [];
  for (const m of moves) {
    const nr = row + m.dr;
    const nc = col + m.dc;
    if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3) {
      const ni = nr * 3 + nc;
      const newBoard = swap(board, blank, ni);
      result.push({ board: newBoard, cost: hHat(newBoard), move: m.label });
    }
  }
  return result;
}

/* ── Mountain problems data ── */
const mountainProblems = [
  {
    id: "local-max",
    label: "지역최대치",
    desc: "전역 최대가 아닌 지역 최대에 도달하여 멈춤. 주변의 모든 상태가 현재보다 낮으므로 더 이상 이동 불가.",
    color: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-300 dark:border-red-700",
    textColor: "text-red-700 dark:text-red-300",
  },
  {
    id: "plateau",
    label: "고원",
    desc: "평탄한 영역에서 모든 방향의 고도가 동일하여 어느 방향으로 이동해야 할지 판단 불가.",
    color: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-300 dark:border-amber-700",
    textColor: "text-amber-700 dark:text-amber-300",
  },
  {
    id: "ridge",
    label: "능선",
    desc: "이동 가능한 방향(동서남북)에서는 모두 경사가 하강하지만, 대각선 등 실제로는 상승 경로가 존재.",
    color: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-300 dark:border-purple-700",
    textColor: "text-purple-700 dark:text-purple-300",
  },
];

/* ── Mountain SVG landscape data ── */
const mountainPath =
  "M 0,250 Q 40,240 60,220 Q 80,200 100,180 Q 120,150 130,160 Q 140,170 150,165 Q 160,160 180,130 Q 200,100 220,80 Q 240,60 250,65 Q 260,70 280,90 Q 300,110 320,120 Q 340,130 350,125 Q 360,120 370,125 Q 380,130 400,100 Q 420,70 440,40 Q 460,10 470,20 Q 480,30 500,60 Q 520,90 540,120 Q 560,150 580,170 Q 600,190 620,200 Q 640,210 660,220 L 660,260 L 0,260 Z";

const annotations = [
  { x: 220, y: 55, label: "지역최대치", id: "local-max" },
  { x: 440, y: 15, label: "전역최대치", id: "global-max" },
  { x: 345, y: 100, label: "고원", id: "plateau" },
  { x: 280, y: 70, label: "능선", id: "ridge" },
];

export default function HillClimbingExplorer() {
  const [puzzleBoard, setPuzzleBoard] = useState<Board>([2, 8, 3, 1, 6, 4, 7, 0, 5]);
  const [highlightProblem, setHighlightProblem] = useState<string | null>(null);
  const [dotX, setDotX] = useState(100);
  const [isClimbing, setIsClimbing] = useState(false);

  const successors = getSuccessors(puzzleBoard);
  const currentCost = hHat(puzzleBoard);
  const isGoal = currentCost === 0;

  const handlePuzzleMove = (newBoard: Board) => {
    setPuzzleBoard(newBoard);
  };

  const resetPuzzle = () => {
    setPuzzleBoard([2, 8, 3, 1, 6, 4, 7, 0, 5]);
  };

  // Hill climbing auto-select: pick successor with min ĥ
  const autoStep = () => {
    if (isGoal) return;
    const best = successors.reduce((min, s) => (s.cost < min.cost ? s : min), successors[0]);
    setPuzzleBoard(best.board);
  };

  const startClimbing = () => {
    setIsClimbing(true);
    setDotX(100);
    // Animate dot climbing to local max at x=220
    const interval = setInterval(() => {
      setDotX((prev) => {
        if (prev >= 218) {
          clearInterval(interval);
          setIsClimbing(false);
          return 220;
        }
        return prev + 3;
      });
    }, 60);
  };

  // Get Y from approximate mountain path
  const getY = (x: number) => {
    if (x <= 100) return 180 - (x - 60) * 1;
    if (x <= 220) return 180 - (x - 100) * 0.83;
    if (x <= 280) return 80 + (x - 220) * 0.5;
    if (x <= 350) return 120 - (x - 280) * 0.07;
    if (x <= 440) return 125 - (x - 350) * 0.94;
    return 40 + (x - 440) * 0.8;
  };

  return (
    <section>
      <SectionTitle
        title="2. 언덕오르기 탐색"
        subtitle="현재 상태를 확장하여 ĥ(n)이 최소인 후계노드를 선택하는 탐색 (깊이우선과 유사, g(n) 미고려)"
      />

      {/* Algorithm summary */}
      <div className="mb-6 rounded-xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-800 dark:bg-teal-900/20">
        <h4 className="mb-2 text-sm font-bold text-teal-800 dark:text-teal-200">탐색 알고리즘 핵심</h4>
        <ul className="space-y-1 text-sm text-teal-700 dark:text-teal-300">
          <li>- 평가함수 = <span className="font-bold">ĥ(n)</span> (목표까지의 예측 비용)</li>
          <li>- 출발노드까지 비용 g(n)은 <span className="font-bold">고려하지 않음</span></li>
          <li>- 후계노드 중 비용이 <span className="font-bold">최소인 노드</span> 선택</li>
          <li>- 깊이우선 탐색과 유사한 순서</li>
        </ul>
      </div>

      {/* 8-Puzzle Interactive */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
          8-퍼즐 예제
        </h3>
        <p className="mb-4 text-xs text-gray-500">
          비용 = 지정 위치에 없는 조각 수. 작을수록 목표에 가까움.
        </p>

        <div className="flex flex-col items-start gap-6 sm:flex-row">
          {/* Current board */}
          <div>
            <p className="mb-2 text-xs font-bold text-gray-500">현재 상태 (ĥ = {currentCost})</p>
            <div className="grid grid-cols-3 gap-1">
              {puzzleBoard.map((v, i) => (
                <motion.div
                  key={`${i}-${v}`}
                  layout
                  className={`flex h-14 w-14 items-center justify-center rounded-lg text-lg font-bold ${
                    v === 0
                      ? "bg-gray-100 dark:bg-gray-800"
                      : v === GOAL[i]
                        ? "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300"
                        : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  {v !== 0 ? v : ""}
                </motion.div>
              ))}
            </div>
            {isGoal && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-center text-sm font-bold text-teal-600 dark:text-teal-400"
              >
                목표 도달!
              </motion.p>
            )}
          </div>

          {/* Goal board */}
          <div>
            <p className="mb-2 text-xs font-bold text-gray-500">목표 상태</p>
            <div className="grid grid-cols-3 gap-1">
              {GOAL.map((v, i) => (
                <div
                  key={i}
                  className={`flex h-14 w-14 items-center justify-center rounded-lg text-lg font-bold ${
                    v === 0
                      ? "bg-gray-100 dark:bg-gray-800"
                      : "bg-teal-500 text-white"
                  }`}
                >
                  {v !== 0 ? v : ""}
                </div>
              ))}
            </div>
          </div>

          {/* Successors */}
          <div className="flex-1">
            <p className="mb-2 text-xs font-bold text-gray-500">
              후계노드 (이동 가능한 상태)
            </p>
            {!isGoal ? (
              <div className="space-y-2">
                {successors
                  .sort((a, b) => a.cost - b.cost)
                  .map((s, i) => {
                    const isBest = s.cost === Math.min(...successors.map((x) => x.cost));
                    return (
                      <button
                        key={i}
                        onClick={() => handlePuzzleMove(s.board)}
                        className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                          isBest
                            ? "border-teal-300 bg-teal-50 hover:bg-teal-100 dark:border-teal-700 dark:bg-teal-900/20 dark:hover:bg-teal-900/40"
                            : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                        }`}
                      >
                        <span className="text-gray-500">{s.move}</span>
                        <span
                          className={`font-bold ${isBest ? "text-teal-600 dark:text-teal-400" : "text-gray-700 dark:text-gray-300"}`}
                        >
                          ĥ = {s.cost}
                        </span>
                        {isBest && (
                          <span className="ml-auto rounded bg-teal-500 px-2 py-0.5 text-xs text-white">
                            최소
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            ) : (
              <p className="text-sm text-gray-400">목표 도달 완료</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={autoStep}
            disabled={isGoal}
            className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 disabled:opacity-40"
          >
            자동 선택 (최소 ĥ)
          </button>
          <button
            onClick={resetPuzzle}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            초기화
          </button>
        </div>
      </div>

      {/* Mountain Landscape - Hill Climbing Problems */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
          계수최적화 / 등산 문제 — 최급상승법의 난제
        </h3>
        <p className="mb-4 text-xs text-gray-500">
          초행길 산에서 짙은 안개를 만남. 지도도 없고, 나침반에만 의지하여 정상에 도달해야 하는 문제.
        </p>

        <div className="relative mx-auto mb-4" style={{ maxWidth: 660 }}>
          <svg viewBox="0 0 660 270" className="w-full">
            <defs>
              <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <path d={mountainPath} fill="url(#mountainGrad)" stroke="#14b8a6" strokeWidth={2} />

            {/* Annotations */}
            {annotations.map((a) => (
              <g
                key={a.id}
                onClick={() => setHighlightProblem(highlightProblem === a.id ? null : a.id)}
                className="cursor-pointer"
              >
                <line
                  x1={a.x}
                  y1={a.y + 10}
                  x2={a.x}
                  y2={a.y + 30}
                  stroke={highlightProblem === a.id ? "#f43f5e" : "#6b7280"}
                  strokeWidth={1.5}
                  strokeDasharray="3 2"
                />
                <circle
                  cx={a.x}
                  cy={a.y + 6}
                  r={4}
                  fill={highlightProblem === a.id ? "#f43f5e" : "#14b8a6"}
                />
                <text
                  x={a.x}
                  y={a.y - 4}
                  textAnchor="middle"
                  className={`text-xs font-bold ${highlightProblem === a.id ? "fill-red-500" : "fill-gray-500 dark:fill-gray-400"}`}
                >
                  {a.label}
                </text>
              </g>
            ))}

            {/* Climbing dot */}
            <motion.circle
              cx={dotX}
              cy={getY(dotX) - 8}
              r={6}
              fill="#f43f5e"
              animate={{ cx: dotX, cy: getY(dotX) - 8 }}
            />
          </svg>
        </div>

        <div className="mb-4 flex justify-center">
          <button
            onClick={startClimbing}
            disabled={isClimbing}
            className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 disabled:opacity-40"
          >
            {isClimbing ? "등산 중..." : "등산 시작 (지역최대치에서 멈춤)"}
          </button>
        </div>

        {/* Problem cards */}
        <div className="grid gap-3 sm:grid-cols-3">
          {mountainProblems.map((p) => (
            <motion.button
              key={p.id}
              onClick={() => setHighlightProblem(highlightProblem === p.id ? null : p.id)}
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl border p-4 text-left transition-colors ${
                highlightProblem === p.id
                  ? `${p.borderColor} ${p.color}`
                  : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
              }`}
            >
              <h4
                className={`text-sm font-bold ${
                  highlightProblem === p.id ? p.textColor : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {p.label}
              </h4>
              <AnimatePresence>
                {highlightProblem === p.id && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 overflow-hidden text-xs text-gray-600 dark:text-gray-400"
                  >
                    {p.desc}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
