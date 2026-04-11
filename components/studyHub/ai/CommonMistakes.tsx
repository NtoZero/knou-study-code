"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

const MISTAKES = [
  {
    title: "OPEN 큐에서 같은 상태 중복 처리 잊음",
    bad: "같은 상태 n이 부모 A와 부모 B에서 각각 생성되었는데 OPEN에 두 개 다 방치.",
    good: "기존 우수 판단 — 더 작은 g(또는 f)를 가진 쪽만 남기고 나머지는 ✕로 폐기. 중복을 방치하면 트리가 과도하게 부풀어 풀이가 지저분해짐.",
  },
  {
    title: "기존 g값보다 작은 경로 생성 시 갱신 누락",
    bad: "CLOSED/OPEN에 이미 있던 n을 더 작은 g로 다시 생성했는데 기존 엔트리를 그대로 둠.",
    good: "새로 계산한 g값이 더 작으면 부모 포인터·g값을 반드시 갱신. 그대로 두면 엉뚱한 경로가 최적으로 보고됨.",
  },
  {
    title: "A*에서 h만 보고 정렬 (best-first와 혼동)",
    bad: "A*의 OPEN을 h값이 작은 순서로 정렬.",
    good: "A*는 f = g + h 기준으로 정렬. h만으로 정렬하면 '탐욕적 최적우선 탐색'이 되어 최적성을 잃음.",
  },
  {
    title: "목표 생성 즉시 종료 (vs 확장 시점 종료)",
    bad: "목표 노드를 자식으로 만들자마자 탐색 종료.",
    good: "목표가 OPEN에서 '확장 대상으로 꺼내지는 시점'에 종료. 생성 시점에는 OPEN에 더 작은 g의 다른 노드가 있을 수 있어 최적성이 깨짐.",
  },
  {
    title: "A* 일관성 가정 없이 CLOSED 재확장 생략",
    bad: "허용적 h만 확인하고 CLOSED에 들어간 노드는 절대 다시 건드리지 않음.",
    good: "허용성만 있고 일관성이 없으면 CLOSED 노드가 더 작은 g로 재발견될 수 있음 → 재확장 필요. 일관성이 성립하면 재확장 불필요.",
  },
  {
    title: "시간 h에서 v_max 기준 미사용",
    bad: "h(n) = 직선거리 / 15km/h 같은 임의 값으로 분모를 설정하고 '허용적이다'라고 단정.",
    good: "허용성을 일반적으로 보장하려면 분모가 도로망의 최대 시속(v_max) 이상이어야 함. 그보다 작으면 v가 더 큰 간선에서 과대추정 발생 가능.",
  },
  {
    title: "같은 비용 동점일 때 처리 규칙 혼동",
    bad: "새 g가 기존 g와 같을 때 무조건 교체하거나, 무작위로 선택.",
    good: "같은 비용이면 기존을 유지(기존 우수 판단 규칙)하거나 교재·강의 관행에 맞춤. 새 엔트리는 ✕로 폐기. 일관된 규칙을 처음부터 끝까지 동일하게 적용.",
  },
  {
    title: "시간 비용을 소수로 반올림해 일관성 훼손",
    bad: "거리/시속 계산 중 단계마다 0.1 단위로 반올림하며 누적.",
    good: "분수(또는 충분한 유효숫자)로 계산한 뒤 마지막 제출 포맷에서만 반올림. 과제의 경우 셋째 자리 반올림을 통일.",
  },
  {
    title: "탐색 트리에 확장 순서·✕ 표기 누락",
    bad: "트리에 노드만 그리고 확장 순서 번호나 ✕ 표기를 생략.",
    good: "과제 지시사항: 각 노드에 '[확장순서]'와 '경로비용(또는 f값)'을 표기하고, 폐기된 중복 경로는 반드시 ✕로 표시.",
  },
  {
    title: "거리 기준 최적 경로를 시간 기준에 그대로 사용",
    bad: "(가)에서 구한 최단 경로를 (다)의 답으로도 사용.",
    good: "거리 최단과 시간 최단은 일치하지 않을 수 있음. 시간 기준은 반드시 처음부터 다시 탐색. 과제 (가)/(다)의 답이 다르게 나오는 것이 정상적인 흐름.",
  },
];

export default function CommonMistakes() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [checked, setChecked] = useState<boolean[]>(
    Array(MISTAKES.length).fill(false)
  );

  const doneCount = checked.filter(Boolean).length;

  return (
    <section>
      <SectionTitle
        title="흔한 실수 체크리스트"
        subtitle="잘못 vs 올바름 · 제출 전 10개 포인트 점검"
      />

      <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-900/40 dark:bg-indigo-950/30">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-indigo-700 dark:text-indigo-300">
            점검 진행도
          </span>
          <span className="font-mono text-indigo-600">
            {doneCount} / {MISTAKES.length}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white dark:bg-gray-900">
          <motion.div
            className="h-full bg-indigo-500"
            animate={{ width: `${(doneCount / MISTAKES.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {MISTAKES.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`rounded-xl border p-3 transition-all ${
              checked[i]
                ? "border-indigo-300 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/30"
                : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={(e) => {
                  const next = [...checked];
                  next[i] = e.target.checked;
                  setChecked(next);
                }}
                className="mt-1 h-4 w-4 rounded accent-indigo-500"
              />
              <div className="flex-1">
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span
                    className={`text-sm font-semibold ${
                      checked[i]
                        ? "text-gray-500 line-through"
                        : "text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    <AlertTriangle size={12} className="mb-0.5 mr-1 inline text-amber-500" />
                    {m.title}
                  </span>
                  <span className="text-xs text-indigo-500">
                    {expanded === i ? "접기" : "자세히"}
                  </span>
                </button>
                {expanded === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 space-y-1.5 text-xs text-gray-600 dark:text-gray-400"
                  >
                    <div className="flex items-start gap-1.5">
                      <XCircle size={12} className="mt-0.5 shrink-0 text-red-500" />
                      <div>
                        <b className="text-red-600 dark:text-red-400">잘못:</b>{" "}
                        {m.bad}
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2
                        size={12}
                        className="mt-0.5 shrink-0 text-emerald-500"
                      />
                      <div>
                        <b className="text-emerald-700 dark:text-emerald-400">
                          올바름:
                        </b>{" "}
                        {m.good}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
