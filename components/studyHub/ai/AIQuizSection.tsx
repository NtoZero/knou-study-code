"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface Quiz {
  q: string;
  choices: string[];
  answer: number;
  explain: string;
  category:
    | "concept"
    | "expansion"
    | "cost"
    | "admissibility"
    | "optimality"
    | "conversion"
    | "target"
    | "tree";
}

const QUIZZES: Quiz[] = [
  {
    q: "균일비용 탐색(UCS)이 확장할 다음 노드를 선택하는 기준은?",
    choices: [
      "목표까지 예측 비용 h(n)이 최소",
      "출발부터 경로비용 g(n)이 최소",
      "생성 순서가 가장 늦은 노드",
      "깊이가 가장 깊은 노드",
    ],
    answer: 1,
    explain:
      "UCS는 OPEN의 노드들 중 g(n)이 최소인 노드를 선택. 이 기준만으로 비음 비용에서 최적 경로가 보장됨.",
    category: "concept",
  },
  {
    q: "A* 알고리즘의 평가함수 f(n)을 올바르게 표기한 것은?",
    choices: [
      "f(n) = g(n) × h(n)",
      "f(n) = h(n) − g(n)",
      "f(n) = g(n) + h(n)",
      "f(n) = max(g(n), h(n))",
    ],
    answer: 2,
    explain:
      "f = g + h. 이미 쓴 비용 + 남은 비용 예측의 단순 합. 이 값이 최소인 노드를 확장.",
    category: "concept",
  },
  {
    q: "UCS에서 목표 노드를 만났을 때 종료 시점은?",
    choices: [
      "목표가 생성(자식으로 포함)되는 순간",
      "목표가 OPEN에 삽입되는 순간",
      "목표가 OPEN에서 확장 대상으로 꺼내지는 순간",
      "목표의 자식이 모두 닫힌 순간",
    ],
    answer: 2,
    explain:
      "'생성'이 아닌 '확장 시점에 종료'해야 더 작은 g의 다른 경로를 놓치지 않음. A*도 동일.",
    category: "expansion",
  },
  {
    q: "OPEN = {X[7], Y[9], Z[12]}, CLOSED = {S, A}일 때 UCS가 다음에 확장하는 노드는?",
    choices: ["S", "X", "Y", "Z"],
    answer: 1,
    explain:
      "CLOSED는 이미 확장됨. OPEN에서 g가 최소인 X(g=7)를 꺼내 확장.",
    category: "expansion",
  },
  {
    q: "간선 길이가 12km이고 해당 구간 시속이 30km/h일 때, 이동 시간(h)은?",
    choices: ["0.2", "0.3", "0.4", "0.5"],
    answer: 2,
    explain:
      "시간 = 거리 / 속도 = 12 / 30 = 0.4h. 과제의 (다)·(라)에서 반복 적용하는 핵심 변환.",
    category: "conversion",
  },
  {
    q: "A*의 허용성(admissibility) 조건을 올바르게 표현한 것은?",
    choices: [
      "h(n) ≥ h*(n) — 항상 과대추정",
      "h(n) ≤ h*(n) — 과대추정 금지",
      "h(n) = 0 — 휴리스틱 없음",
      "h(n) ≥ g(n) — 예측이 경로비용 이상",
    ],
    answer: 1,
    explain:
      "허용성 = h(n)이 실제 최소비용 h*(n)을 초과하지 않음(과대추정 금지). 이것이 A* 최적성의 필요조건.",
    category: "admissibility",
  },
  {
    q: "직선거리를 h로 쓰는 최단거리 탐색이 항상 허용적인 이유는?",
    choices: [
      "직선거리는 항상 0에 가까움",
      "삼각부등식에 의해 실제 도로거리 ≥ 직선거리",
      "직선거리는 경로비용과 무관",
      "실제 도로가 항상 직선이기 때문",
    ],
    answer: 1,
    explain:
      "두 점 사이 어떤 경로도 직선보다 짧을 수 없음(삼각부등식). 따라서 직선거리 ≤ 실제 거리 → 과대추정 없음.",
    category: "admissibility",
  },
  {
    q: "도로망에서 간선 속도가 5~30km/h 범위일 때, h(n)=직선거리/15km/h가 허용적이라고 단정할 수 있는가?",
    choices: [
      "예, 평균 근방이므로 항상 허용적",
      "아니오, v>15인 간선이 존재하면 허용성이 깨질 수 있음",
      "예, 직선거리는 항상 짧기 때문",
      "분모가 무엇이든 h는 항상 허용적",
    ],
    answer: 1,
    explain:
      "일반성 있게 허용적이려면 분모가 v_max 이상이어야 함. v=30인 간선이 있다면 15로 나눈 h는 그 경로의 실제 시간을 과대추정할 수 있어 허용성이 깨짐.",
    category: "admissibility",
  },
  {
    q: "다음 중 UCS가 최적성을 잃는 상황은?",
    choices: [
      "간선 비용이 모두 정수일 때",
      "간선 비용에 음수가 포함될 때",
      "OPEN에 동점이 있을 때",
      "목표 노드가 먼 곳에 있을 때",
    ],
    answer: 1,
    explain:
      "UCS는 비용이 0 이상인 경우 최적. 음수 간선이 있으면 CLOSED에 들어간 노드도 나중에 더 작아질 수 있어 최적성 보장 불가.",
    category: "optimality",
  },
  {
    q: "동일 그래프·목표에서 허용적 h로 A*와 UCS를 풀었을 때, 총 비용의 관계는?",
    choices: [
      "A* 총 비용 < UCS 총 비용",
      "A* 총 비용 = UCS 총 비용",
      "A* 총 비용 > UCS 총 비용",
      "상황에 따라 셋 다 가능",
    ],
    answer: 1,
    explain:
      "허용적 h의 A*는 UCS와 동일한 최적 비용을 반환. 경로는 동점이 있으면 다를 수 있지만 총 비용은 같음.",
    category: "optimality",
  },
  {
    q: "탐색트리 작성 시 ✕ 표기가 의미하는 것은?",
    choices: [
      "목표 노드",
      "아직 확장하지 않은 노드",
      "기존 경로가 우수해 폐기된 중복 생성 노드",
      "CLOSED에 들어간 노드",
    ],
    answer: 2,
    explain:
      "과제 규약상 ✕는 '이미 같은 상태가 더 작은 g로 존재해 버려진 경로'를 표시. 규약대로 반드시 남겨야 감점 방지.",
    category: "tree",
  },
  {
    q: "탐색트리의 노드에 표기해야 하는 정보 2가지는?",
    choices: [
      "부모 id와 자식 수",
      "확장 순서 번호와 경로비용(또는 f값)",
      "h값과 깊이",
      "OPEN 위치와 CLOSED 위치",
    ],
    answer: 1,
    explain:
      "각 노드에 '[확장순서]'와 '경로비용 g(또는 f=g+h)'를 함께 써야 채점자가 탐색 과정을 검증 가능.",
    category: "tree",
  },
  {
    q: "특정 노드 n의 f값이 f=8, g=5일 때 h는?",
    choices: ["2", "3", "5", "13"],
    answer: 1,
    explain:
      "f = g + h → h = f − g = 8 − 5 = 3. f/g/h 사이 관계를 역산할 수 있어야 함.",
    category: "cost",
  },
  {
    q: "목표 g까지 직선거리가 6km이고 도로망 최대 시속이 30km/h일 때, 허용적 시간 휴리스틱 h(n)은?",
    choices: ["0.1h", "0.2h", "0.3h", "0.5h"],
    answer: 1,
    explain:
      "h = 직선거리 / v_max = 6 / 30 = 0.2h. 분모가 v_max이므로 어떤 실제 시간보다도 작거나 같음.",
    category: "target",
  },
  {
    q: "A*가 허용성은 만족하지만 일관성은 만족하지 않는 h를 쓸 때, graph-search 구현에서 발생할 수 있는 일은?",
    choices: [
      "최적성이 깨짐",
      "CLOSED에 들어간 노드가 더 작은 g로 다시 발견되어 재확장 필요",
      "OPEN이 비어 탐색 실패",
      "아무런 영향 없음",
    ],
    answer: 1,
    explain:
      "일관성 없는 허용적 h는 tree-search A*는 여전히 최적이지만, graph-search A*에서 재확장이 필요해짐. 최적성 자체는 적절한 재확장으로 유지 가능.",
    category: "optimality",
  },
];

const CATEGORY_LABELS: Record<Quiz["category"], string> = {
  concept: "개념",
  expansion: "확장 순서",
  cost: "비용 계산",
  admissibility: "허용성",
  optimality: "최적성",
  conversion: "거리·시간 변환",
  target: "타깃 질의",
  tree: "탐색 트리",
};

export default function AIQuizSection() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState<Quiz["category"] | "all">("all");

  const filtered =
    filter === "all" ? QUIZZES : QUIZZES.filter((q) => q.category === filter);
  const safeIdx = Math.min(idx, filtered.length - 1);
  const quiz = filtered[safeIdx];

  const categories: (Quiz["category"] | "all")[] = [
    "all",
    "concept",
    "expansion",
    "cost",
    "admissibility",
    "optimality",
    "conversion",
    "target",
    "tree",
  ];

  return (
    <section>
      <SectionTitle
        title="카테고리별 퀴즈 — 15문항"
        subtitle="개념·확장·비용·허용성·최적성·변환·타깃·트리 8종"
      />

      {/* 카테고리 필터 */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => {
              setFilter(c);
              setIdx(0);
              setSelected(null);
            }}
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
              filter === c
                ? "bg-indigo-500 text-white"
                : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
            }`}
          >
            {c === "all" ? "전체" : CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-indigo-200 bg-white p-5 dark:border-indigo-900/40 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-indigo-700 dark:text-indigo-300">
            <HelpCircle size={14} /> 퀴즈 {safeIdx + 1} / {filtered.length}
          </div>
          <div className="flex flex-wrap gap-1">
            {filtered.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIdx(i);
                  setSelected(null);
                }}
                className={`h-6 w-6 rounded-full text-[10px] font-bold ${
                  safeIdx === i
                    ? "bg-indigo-500 text-white"
                    : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        {quiz && (
          <>
            <div className="mb-2 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
              {CATEGORY_LABELS[quiz.category]}
            </div>
            <p className="mb-3 text-sm text-gray-800 dark:text-gray-200">
              {quiz.q}
            </p>
            <div className="space-y-1.5">
              {quiz.choices.map((c, i) => {
                const isSel = selected === i;
                const isCorrect = i === quiz.answer;
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    disabled={selected !== null}
                    className={`flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-all ${
                      selected === null
                        ? "border-gray-200 bg-white hover:border-indigo-300 dark:border-gray-800 dark:bg-gray-900"
                        : isSel && isCorrect
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
                          : isSel
                            ? "border-red-500 bg-red-50 dark:bg-red-950/40"
                            : isCorrect
                              ? "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/30"
                              : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                    }`}
                  >
                    <span className="font-bold text-gray-400">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    <span>{c}</span>
                  </button>
                );
              })}
            </div>
            {selected !== null && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200"
              >
                <b>{selected === quiz.answer ? "정답!" : "오답"}</b> ·{" "}
                {quiz.explain}
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
