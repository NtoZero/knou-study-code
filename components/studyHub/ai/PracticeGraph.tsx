"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/**
 * 연습용 그래프 — 과제 a~g 와 완전히 다른 노드 집합과 수치
 * 노드: S, P, Q, R, T, U, Goal
 */

type NodeId = "S" | "P" | "Q" | "R" | "T" | "U" | "Goal";

interface PGNode {
  id: NodeId;
  x: number;
  y: number;
  h: number; // 직선거리 휴리스틱 (연습용)
}

interface PGEdge {
  from: NodeId;
  to: NodeId;
  cost: number;
}

const NODES: PGNode[] = [
  { id: "S", x: 40, y: 170, h: 14 },
  { id: "P", x: 150, y: 70, h: 11 },
  { id: "Q", x: 150, y: 270, h: 12 },
  { id: "R", x: 270, y: 150, h: 7 },
  { id: "T", x: 270, y: 280, h: 8 },
  { id: "U", x: 400, y: 70, h: 5 },
  { id: "Goal", x: 500, y: 200, h: 0 },
];

// 연습용 엣지
const EDGES: PGEdge[] = [
  { from: "S", to: "P", cost: 4 },
  { from: "S", to: "Q", cost: 3 },
  { from: "P", to: "R", cost: 5 },
  { from: "P", to: "U", cost: 9 },
  { from: "Q", to: "R", cost: 6 },
  { from: "Q", to: "T", cost: 4 },
  { from: "R", to: "U", cost: 3 },
  { from: "R", to: "Goal", cost: 8 },
  { from: "T", to: "Goal", cost: 9 },
  { from: "U", to: "Goal", cost: 4 },
];

// UCS 풀이 (사람이 계산)
// S(0) → P(4), Q(3)
// Q(3) → R(9), T(7) ... 기존 R 없음
// T(7) → Goal(16)
// P(4) → R(9), U(13) — R 기존 9 동점 / 유지 또는 교체
// R(9) → U(12) [교체 13→12], Goal(17) [17>16 유지 기존]
// U(12) → Goal(16) [동점]
// ...
// 복잡하니 단순 계산 결과만 제시
// 실제 UCS로 풀어본 최단 경로: S→Q→T→Goal 비용 3+4+9=16
//   S→P→R→U→Goal = 4+5+3+4 = 16 도 동일
//   S→Q→R→U→Goal = 3+6+3+4 = 16 도 동일
// 최소 비용 = 16

// A* 풀이 (간단 버전, h 직선거리 가정)
// f(S) = 14
// Q(h=12): f=3+12=15 / P(h=11): f=4+11=15
// 둘 동점. 임의로 P 먼저.
// P 확장 → R: f=9+7=16, U: f=13+5=18
// Q 확장 → R: 기존 9 > 새 9 동일 / T: f=7+8=15
// T 확장 → Goal: f=16+0=16
// R 확장 → U: f=12+5=17 (교체 18→17), Goal: f=17+0=17
// U(17 via R) → Goal: f=16
// Goal 꺼냄 → 비용 16

export default function PracticeGraph() {
  const [showAnswer, setShowAnswer] = useState(false);
  const [mode, setMode] = useState<"ucs" | "astar">("ucs");

  return (
    <section>
      <SectionTitle
        title="직접 풀어보는 연습용 그래프"
        subtitle="과제와 완전히 다른 노드 이름과 수치 · 답을 가려놓고 손으로 풀어볼 것"
      />

      <div className="mb-4 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
        <AlertCircle size={14} className="mb-1 mr-1 inline" />
        <b>경고:</b> 이 연습 그래프는 <b>S, P, Q, R, T, U, Goal</b> 노드를 쓰며 과제의
        a~g 그래프와는 전혀 다름. <b>여기의 확장 순서·비용·경로를 과제 답안에
        그대로 옮기지 말 것.</b> 이 섹션은 풀이 <b>절차를 몸에 익히기 위한 도구</b>일 뿐임.
      </div>

      <div className="rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-900/40 dark:bg-gray-900">
        <svg viewBox="0 0 560 340" className="w-full">
          {EDGES.map((e, i) => {
            const a = NODES.find((n) => n.id === e.from)!;
            const b = NODES.find((n) => n.id === e.to)!;
            return (
              <g key={i}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#cbd5e1" strokeWidth={2} />
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
          {NODES.map((n) => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={24} fill="#eef2ff" stroke="#4338ca" strokeWidth={2} />
              <text
                x={n.x}
                y={n.y - 2}
                textAnchor="middle"
                fontSize={12}
                fontWeight={700}
                fill="#1e1b4b"
              >
                {n.id}
              </text>
              <text x={n.x} y={n.y + 11} textAnchor="middle" fontSize={8} fill="#1e1b4b">
                h={n.h}
              </text>
            </g>
          ))}
        </svg>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg bg-indigo-50 p-3 text-xs dark:bg-indigo-950/30">
            <b>풀이 미션 1 (UCS):</b> S 에서 Goal 까지 최소 비용 경로를 찾되, 탐색 트리의 각
            노드 옆에 g값과 확장 순서를 기록할 것.
          </div>
          <div className="rounded-lg bg-indigo-50 p-3 text-xs dark:bg-indigo-950/30">
            <b>풀이 미션 2 (A*):</b> 같은 그래프에서 h (위 노드에 표시) 를 사용해 f = g + h
            기준으로 탐색 트리를 구성. UCS 와 확장 노드 수를 비교해볼 것.
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex rounded-lg bg-indigo-100 p-1 text-xs dark:bg-indigo-950/40">
            <button
              onClick={() => setMode("ucs")}
              className={`rounded px-3 py-1 font-semibold ${
                mode === "ucs"
                  ? "bg-white text-indigo-700 shadow dark:bg-indigo-900 dark:text-indigo-100"
                  : "text-indigo-600"
              }`}
            >
              UCS 정답
            </button>
            <button
              onClick={() => setMode("astar")}
              className={`rounded px-3 py-1 font-semibold ${
                mode === "astar"
                  ? "bg-white text-indigo-700 shadow dark:bg-indigo-900 dark:text-indigo-100"
                  : "text-indigo-600"
              }`}
            >
              A* 정답
            </button>
          </div>
          <button
            onClick={() => setShowAnswer((s) => !s)}
            className="ml-auto flex items-center gap-1 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-600"
          >
            {showAnswer ? <EyeOff size={12} /> : <Eye size={12} />}
            {showAnswer ? "정답 숨기기" : "정답 보기"}
          </button>
        </div>

        <AnimatePresence>
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              {mode === "ucs" ? <UCSAnswer /> : <AStarAnswer />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function UCSAnswer() {
  const order = [
    { n: "S", g: 0 },
    { n: "Q", g: 3 },
    { n: "P", g: 4 },
    { n: "T", g: 7 },
    { n: "R", g: 9 },
    { n: "U", g: 12 },
    { n: "Goal", g: 16 },
  ];
  return (
    <div className="rounded-lg border border-indigo-300 bg-indigo-50 p-3 text-xs dark:border-indigo-800 dark:bg-indigo-950/30">
      <div className="mb-2 font-bold text-indigo-700 dark:text-indigo-300">UCS 확장 순서 (연습용)</div>
      <div className="flex flex-wrap gap-1">
        {order.map((o, i) => (
          <span
            key={i}
            className="rounded bg-white px-2 py-1 font-mono dark:bg-gray-900"
          >
            #{i + 1} {o.n}(g={o.g})
          </span>
        ))}
      </div>
      <div className="mt-2 text-gray-700 dark:text-gray-300">
        최소 비용 경로(예): <b>S → Q → T → Goal</b> 또는 <b>S → P → R → U → Goal</b> · 둘 다 <b>비용 16</b>{" "}
        (동점 해가 존재함).
      </div>
    </div>
  );
}

function AStarAnswer() {
  const order = [
    { n: "S", f: 14 },
    { n: "P", f: 15 },
    { n: "Q", f: 15 },
    { n: "T", f: 15 },
    { n: "R", f: 16 },
    { n: "Goal", f: 16 },
  ];
  return (
    <div className="rounded-lg border border-indigo-300 bg-indigo-50 p-3 text-xs dark:border-indigo-800 dark:bg-indigo-950/30">
      <div className="mb-2 font-bold text-indigo-700 dark:text-indigo-300">A* 확장 순서 (연습용, f = g + h)</div>
      <div className="flex flex-wrap gap-1">
        {order.map((o, i) => (
          <span
            key={i}
            className="rounded bg-white px-2 py-1 font-mono dark:bg-gray-900"
          >
            #{i + 1} {o.n}(f={o.f})
          </span>
        ))}
      </div>
      <div className="mt-2 text-gray-700 dark:text-gray-300">
        동점(f=15)은 일반적으로 <b>생성 순서</b>나 <b>알파벳</b>으로 처리. A*는 U를
        확장하지 않아도 최적에 도달할 수 있음 — 최소 비용 16, 경로는 UCS와 동일.
      </div>
    </div>
  );
}
