"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ListChecks } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/**
 * UCS 탐색 트리 작성법 가이드
 * 연습용 그래프 — S, X, Y, Z, G (노드 4~5개, 과제 a~g와 무관)
 */

interface TreeStep {
  step: number;
  label: string; // 트리 노드 라벨
  g: number;
  path: string[];
  why: string;
  parentIdx?: number; // 이전 스텝 중 부모
}

const STEPS: TreeStep[] = [
  {
    step: 1,
    label: "S",
    g: 0,
    path: ["S"],
    why: "시작 노드 S를 g=0으로 OPEN에 삽입하여 첫 확장 대상으로 삼음.",
  },
  {
    step: 2,
    label: "X",
    g: 2,
    path: ["S", "X"],
    why: "S 확장 결과 X(g=2), Y(g=4). 최소 g인 X를 다음에 확장.",
    parentIdx: 0,
  },
  {
    step: 3,
    label: "Y",
    g: 4,
    path: ["S", "Y"],
    why: "X 확장 결과 Z(g=2+3=5). OPEN={Y:4, Z:5}. 최소 g인 Y 확장.",
    parentIdx: 0,
  },
  {
    step: 4,
    label: "Z",
    g: 5,
    path: ["S", "X", "Z"],
    why: "Y 확장 결과 G(g=4+8=12). OPEN={Z:5, G:12}. Z가 더 작음.",
    parentIdx: 1,
  },
  {
    step: 5,
    label: "G",
    g: 9,
    path: ["S", "X", "Z", "G"],
    why: "Z 확장 결과 G(g=5+4=9). 기존 G(g=12)보다 작으므로 교체. OPEN={G:9}. 다음 확장 G → 목표 도달.",
    parentIdx: 3,
  },
];

const RULES = [
  {
    title: "노드 라벨 표기",
    desc: "각 노드 옆에 'g값' 과 '확장 순서 번호'를 함께 써야 함. (예: X[2, #2])",
  },
  {
    title: "확장 순서 = OPEN에서 꺼낸 순서",
    desc: "최소 g인 노드부터 확장. 동점이면 교재·강의 예의 관행(알파벳 순 등)에 맞춤.",
  },
  {
    title: "중복 상태 처리",
    desc: "같은 상태가 더 작은 g로 다시 생성되면 기존 항목을 대체(또는 재연결). 큰 g면 버림.",
  },
  {
    title: "목표 도달 즉시 성공",
    desc: "UCS 는 최소 g인 노드가 목표가 되는 순간 종료 (비용 ≥ 0 가정).",
  },
];

export default function UCSTreeBuildingGuide() {
  const [active, setActive] = useState<number>(STEPS.length - 1);

  return (
    <section>
      <SectionTitle
        title="UCS 탐색 트리 작성 규약"
        subtitle="교재 그림 3-6 / 강의 2강 37 슬라이드 스타일 — 경로비용·확장 순서 표기"
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        {RULES.map((r) => (
          <div
            key={r.title}
            className="rounded-lg border border-indigo-200 bg-white p-3 dark:border-indigo-900/40 dark:bg-gray-900"
          >
            <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-indigo-600">
              <ListChecks size={12} /> {r.title}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{r.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-900/40 dark:bg-gray-900">
        <div className="mb-3 text-sm font-bold text-indigo-600">
          연습용 그래프 UCS 트리 단계별 확장
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div>
            <svg viewBox="0 0 500 280" className="w-full">
              {/* step-by-step 트리: 레벨별 */}
              {/* 1단계 S */}
              <TreeNodeSvg x={250} y={40} label="S" g={0} n={1} active={active >= 0} highlight={active === 0} />
              {/* 2단계 X, Y */}
              <line x1={250} y1={58} x2={150} y2={112} stroke={active >= 1 ? "#6366f1" : "#e5e7eb"} strokeWidth={2} />
              <line x1={250} y1={58} x2={350} y2={112} stroke={active >= 2 ? "#6366f1" : "#e5e7eb"} strokeWidth={2} />
              <TreeNodeSvg x={150} y={130} label="X" g={2} n={2} active={active >= 1} highlight={active === 1} />
              <TreeNodeSvg x={350} y={130} label="Y" g={4} n={3} active={active >= 2} highlight={active === 2} />
              {/* 3단계 Z (from X), G(from Y) */}
              <line x1={150} y1={148} x2={100} y2={202} stroke={active >= 3 ? "#6366f1" : "#e5e7eb"} strokeWidth={2} />
              <line x1={350} y1={148} x2={400} y2={202} stroke={active >= 2 ? "#94a3b8" : "#e5e7eb"} strokeWidth={2} strokeDasharray={active >= 4 ? "4 2" : undefined} />
              <TreeNodeSvg x={100} y={220} label="Z" g={5} n={4} active={active >= 3} highlight={active === 3} />
              <TreeNodeSvg x={400} y={220} label="G" g={12} n={0} active={active >= 2 && active < 4} highlight={false} dim={active >= 4} />
              {/* 4단계 G from Z */}
              <line x1={100} y1={238} x2={200} y2={248} stroke={active >= 4 ? "#6366f1" : "#e5e7eb"} strokeWidth={2} />
              <TreeNodeSvg x={220} y={255} label="G" g={9} n={5} active={active >= 4} highlight={active === 4} />
            </svg>
            <div className="mt-2 text-[10px] text-gray-500">
              희미한 G(12)는 4번째 단계에서 갱신되어 버려지는 경로(Y→G)를 나타냄.
            </div>
          </div>

          <div className="space-y-2">
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-full rounded-lg border p-2 text-left text-xs transition-all ${
                  active === i
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40"
                    : "border-gray-200 bg-white hover:border-indigo-300 dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">
                    #{s.step} {s.label}
                  </span>
                  <span className="font-mono text-indigo-600">g={s.g}</span>
                </div>
                {active === i && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-[10px] text-gray-600 dark:text-gray-400"
                  >
                    {s.why}
                  </motion.p>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border-l-4 border-indigo-500 bg-indigo-50 p-3 text-xs text-gray-700 dark:bg-indigo-950/30 dark:text-gray-300">
        <b>제출 시 체크:</b> 각 노드에 반드시 <b>g값 + 확장 순서 번호</b>를 표기해야 감점 방지. 점선은 버려진 경로로 표시.
      </div>
    </section>
  );
}

function TreeNodeSvg({
  x,
  y,
  label,
  g,
  n,
  active,
  highlight,
  dim,
}: {
  x: number;
  y: number;
  label: string;
  g: number;
  n: number;
  active: boolean;
  highlight: boolean;
  dim?: boolean;
}) {
  const fill = dim
    ? "#f3f4f6"
    : highlight
      ? "#6366f1"
      : active
        ? "#e0e7ff"
        : "#f8fafc";
  const textFill = highlight ? "#ffffff" : dim ? "#9ca3af" : "#1e1b4b";
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={20}
        fill={fill}
        stroke={dim ? "#cbd5e1" : "#4338ca"}
        strokeWidth={highlight ? 3 : 2}
        strokeDasharray={dim ? "3 2" : undefined}
      />
      <text x={x} y={y - 2} textAnchor="middle" fontSize={12} fontWeight={700} fill={textFill}>
        {label}
      </text>
      <text x={x} y={y + 11} textAnchor="middle" fontSize={8} fill={textFill}>
        g={g}
        {n > 0 ? ` · #${n}` : ""}
      </text>
    </g>
  );
}
