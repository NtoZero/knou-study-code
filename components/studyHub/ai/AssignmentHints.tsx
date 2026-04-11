"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/* ------------------------------------------------------------
 * AssignmentHints — (가)~(마) 원리 힌트 카드
 *
 * 숫자·경로명·정답 노출 금지. 원리·점검 포인트만.
 * ---------------------------------------------------------- */

const HINTS = [
  {
    title: "(가) 거리 기준 UCS",
    points: [
      "각 단계에서 OPEN의 최소 g 노드를 확장하면 됨. 동점이면 교재 관행(알파벳 등)으로 처리.",
      "같은 상태가 더 작은 g로 갱신되면 기존 엔트리 ✕로 폐기. 큰 g로 오면 즉시 ✕.",
      "탐색트리에 반드시 [확장순서]와 (g) 표기. ✕ 누락은 감점 요인.",
      "목표 노드가 OPEN에서 꺼내지는 시점이 종료. 생성 시점 아님.",
    ],
  },
  {
    title: "(나) 거리 기준 A*",
    points: [
      "f(n) = g(n) + h(n). h는 주어진 직선거리.",
      "같은 그래프이므로 (가)와 결과 총 비용이 일치해야 함 (허용적 h의 검산).",
      "확장 횟수는 (가)와 같거나 적어야 함. 많다면 f 계산 실수 의심.",
      "확장되지 않은 중간 노드가 있다면 바로 그 지점에서 h가 잘 작동한 증거.",
    ],
  },
  {
    title: "(다) 시간 기준 UCS",
    points: [
      "각 간선의 비용을 거리 → 시간으로 먼저 전부 변환. 시간 = 거리 / 구간 시속.",
      "단방향 시속이 다를 수 있음 → 방향 그래프로 모델링. a→b와 b→a를 구분.",
      "분수로 계산 후 마지막에 반올림(예: 셋째 자리)으로 통일하면 누적 오차 방지.",
      "거리 기준 최단 경로와 시간 기준 최단 경로가 같지 않을 수 있음 — 새로 탐색.",
    ],
  },
  {
    title: "(라) 시간 기준 A*",
    points: [
      "h(n) = 직선거리 / (어떤 속도). '어떤 속도'가 허용성의 핵심.",
      "문제에서 준 속도가 그 그래프의 최대 시속보다 작다면 허용성이 일반적으로 깨질 위험.",
      "단, 본 문제 그래프에 한해서는 실제로 작동할 수 있음 — (라) 풀이와 (마) 논의를 구분.",
      "g는 실제 시간(다와 동일), h만 새로 구함. g·h의 단위가 모두 시간(h)으로 일치하는지 확인.",
    ],
  },
  {
    title: "(마) 최적성 논증",
    points: [
      "UCS (가)·(다): 비용 ≥ 0 이면 항상 최적. 별도 추가 조건 없음.",
      "A* (나): h = 직선거리. 삼각부등식 → 허용적 → 일반적 최적.",
      "A* (라): h = 직선거리 / v. v가 그래프의 최대 속도 이상이면 허용적. 그보다 작으면 조건부.",
      "반례 작성 요령: 시속이 분모 v보다 빠른 간선 하나를 포함하는 작은 가공 그래프를 제시하면 됨.",
      "'본 문제에서는 작동하지만 일반적으로 보장되지 않는다' 논조가 핵심.",
    ],
  },
];

export default function AssignmentHints() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section>
      <SectionTitle
        title="(가)~(마) 원리 힌트 (답 아님)"
        subtitle="숫자·경로·확장 순서는 직접 계산 · 여기는 방향타만"
      />

      <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-100">
        <Lightbulb size={13} className="mb-0.5 mr-1 inline" />
        <b>주의:</b> 아래 힌트는 원리·점검 포인트만 다룹니다. 최종 숫자·확장
        순서·경로는 직접 계산해야 합니다. 동일한 원리를 다른 숫자로 반복 연습한
        뒤 과제에 적용하세요.
      </div>

      <div className="mt-3 space-y-2">
        {HINTS.map((h, i) => (
          <div
            key={i}
            className="rounded-xl border border-indigo-200 bg-white dark:border-indigo-900/40 dark:bg-gray-900"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-indigo-700 dark:text-indigo-300">
                <Lightbulb size={14} /> {h.title}
              </span>
              {open === i ? (
                <ChevronUp size={14} className="text-indigo-500" />
              ) : (
                <ChevronDown size={14} className="text-indigo-500" />
              )}
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-1.5 border-t border-indigo-100 px-5 py-3 text-xs text-gray-700 dark:border-indigo-900/40 dark:text-gray-300">
                    {h.points.map((p, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
