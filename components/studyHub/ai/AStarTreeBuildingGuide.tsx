"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/**
 * A* 탐색 트리 작성법 가이드 (UCS와 같은 연습용 그래프: S, X, Y, Z, G)
 * 휴리스틱은 가공 수치 사용
 */

// 연습용 그래프
// Edges: S-X=2, S-Y=4, X-Z=3, Y-G=8, Z-G=4
// h: S=7, X=5, Y=9, Z=3, G=0
// f(S) = 0+7=7
// 확장 S → X(g=2,f=2+5=7), Y(g=4,f=4+9=13)
// 확장 X(f=7) → Z(g=5,f=5+3=8)
// 확장 Z(f=8) → G(g=9,f=9+0=9)
// OPEN: {Y:13, G:9} → G 꺼냄 → 목표! f(G)=9 가 가장 작음.

interface ANode {
  step: number;
  label: string;
  g: number;
  h: number;
  f: number;
  why: string;
}

const ASTAR_STEPS: ANode[] = [
  {
    step: 1,
    label: "S",
    g: 0,
    h: 7,
    f: 7,
    why: "초기 OPEN = {S: f=0+7=7}. 확장 대상.",
  },
  {
    step: 2,
    label: "X",
    g: 2,
    h: 5,
    f: 7,
    why: "S 확장 결과 X(f=2+5=7), Y(f=4+9=13). 최소 f인 X를 다음에 확장.",
  },
  {
    step: 3,
    label: "Z",
    g: 5,
    h: 3,
    f: 8,
    why: "X 확장 결과 Z(f=5+3=8). OPEN={Z:8, Y:13}. Z 확장.",
  },
  {
    step: 4,
    label: "G",
    g: 9,
    h: 0,
    f: 9,
    why: "Z 확장 결과 G(f=9+0=9). OPEN={G:9, Y:13}. 최소 f가 G이고 G는 목표 → 종료. 최적 경로 S→X→Z→G (비용 9).",
  },
];

// UCS 동일 그래프 (편의상 휴리스틱 무시)
// UCS 과정: S(0)→X(2)→Y(4)→Z(5)→G(9)[via Z] ... 기존 G(12 via Y)는 교체
const UCS_STEPS = [
  { step: 1, label: "S", g: 0 },
  { step: 2, label: "X", g: 2 },
  { step: 3, label: "Y", g: 4 },
  { step: 4, label: "Z", g: 5 },
  { step: 5, label: "G", g: 9 },
];

export default function AStarTreeBuildingGuide() {
  const [showBoth, setShowBoth] = useState(true);

  return (
    <section>
      <SectionTitle
        title="A* 탐색 트리 작성 규약 · UCS와 비교"
        subtitle="교재 그림 3-13 / 강의 3강 31 슬라이드 스타일 — 노드에 f값·확장 순서 표기"
      />

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowBoth((s) => !s)}
          className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-600"
        >
          {showBoth ? "A*만 보기" : "UCS · A* 나란히"}
        </button>
      </div>

      <div className={`grid gap-4 ${showBoth ? "lg:grid-cols-2" : ""}`}>
        {showBoth && (
          <div className="rounded-xl border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-2 text-sm font-bold text-gray-600">UCS 확장 순서</div>
            <ol className="space-y-2 text-xs">
              {UCS_STEPS.map((s) => (
                <li
                  key={s.step}
                  className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 dark:bg-gray-800"
                >
                  <span className="font-mono font-bold">
                    #{s.step} {s.label}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">g={s.g}</span>
                </li>
              ))}
            </ol>
            <div className="mt-3 rounded bg-gray-50 p-2 text-[10px] text-gray-500 dark:bg-gray-800">
              UCS는 <b>모든 경로비용 작은 노드부터</b> 확장 → Y를 <b>반드시</b> 확장.
              (확장 수: 5)
            </div>
          </div>
        )}

        <div className="rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-900/40 dark:bg-gray-900">
          <div className="mb-2 flex items-center gap-1.5 text-sm font-bold text-indigo-600">
            <Sparkles size={14} /> A* 확장 순서
          </div>
          <ol className="space-y-2 text-xs">
            {ASTAR_STEPS.map((s) => (
              <motion.li
                key={s.step}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded bg-indigo-50 p-3 dark:bg-indigo-950/30"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold">
                    #{s.step} {s.label}
                  </span>
                  <span className="text-indigo-700 dark:text-indigo-300">
                    g={s.g}, h={s.h}, <b>f={s.f}</b>
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-gray-600 dark:text-gray-400">{s.why}</p>
              </motion.li>
            ))}
          </ol>
          <div className="mt-3 rounded bg-indigo-50 p-2 text-[10px] text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300">
            A*는 f값이 작은 쪽으로만 확장 → <b>Y를 아예 확장하지 않음</b>. (확장 수: 4)
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <RuleCard
          title="노드 라벨"
          desc="각 노드 옆에 'f=g+h=값' 과 '확장 순서 번호'를 함께 기록."
        />
        <RuleCard
          title="확장 순서 = f 최소"
          desc="OPEN에서 f값이 가장 작은 노드부터 꺼냄. 동점 처리는 관행(알파벳·생성순) 사용."
        />
        <RuleCard
          title="목표 종료 시점"
          desc="목표가 OPEN에서 '최소 f'로 꺼내지는 순간 종료. 단순히 생성되는 순간 종료하면 안 됨."
        />
      </div>

      <div className="mt-4 rounded-lg border-l-4 border-indigo-500 bg-indigo-50 p-3 text-xs text-gray-700 dark:bg-indigo-950/30 dark:text-gray-300">
        <b>흔한 함정:</b> A*에서 <b>목표가 생성되는 순간 바로 종료</b>하면 안 됨. OPEN에 남아 있는
        노드가 더 작은 f값을 가질 수 있기 때문임. 반드시 "꺼낼 때"까지 기다릴 것.
      </div>
    </section>
  );
}

function RuleCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-indigo-200 bg-white p-3 dark:border-indigo-900/40 dark:bg-gray-900">
      <div className="mb-1 text-xs font-bold text-indigo-600">{title}</div>
      <p className="text-[11px] text-gray-600 dark:text-gray-400">{desc}</p>
    </div>
  );
}
