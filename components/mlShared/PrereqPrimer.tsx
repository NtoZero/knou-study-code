"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  Sigma,
  CornerDownRight,
  AlertTriangle,
  Grid3x3,
  Dices,
  TrendingDown,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { prereqs, prereqAreas, type PrereqArea, type PrereqEntry } from "@/lib/mlPrereqs";

const areaMeta: Record<
  PrereqArea,
  { Icon: typeof Grid3x3; accent: string; chip: string; chapter: string; blurb: string }
> = {
  "벡터와 행렬": {
    Icon: Grid3x3,
    accent: "text-sky-600",
    chip: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    chapter: "교재 2장 데이터 표현: 벡터와 행렬",
    blurb:
      "데이터 하나가 벡터, 데이터 집합이 행렬이다. 분류의 판별함수와 회귀의 최적해가 모두 이 표기 위에서 쓰인다.",
  },
  "확률과 통계": {
    Icon: Dices,
    accent: "text-violet-600",
    chip: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
    chapter: "교재 3장 데이터 분포: 확률과 통계",
    blurb:
      "데이터가 어떻게 퍼져 있는지를 다루는 언어다. 베이즈 분류기 전체와 로지스틱 회귀의 추정이 여기서 나온다.",
  },
  "미분과 수식 표기": {
    Icon: TrendingDown,
    accent: "text-emerald-600",
    chip: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    chapter: "강의에서 함께 요구하는 수학 배경",
    blurb:
      "최적의 매개변수를 찾는 과정은 예외 없이 미분해서 0으로 놓는 절차다. 시그마 표기를 읽는 법도 여기에 포함된다.",
  },
};

/** 교재 흐름 — 각 단계가 어떤 선행 영역 위에 서 있는지 */
const flow = [
  {
    chapter: "1장",
    lecture: 1,
    title: "머신러닝 소개",
    needs: ["벡터와 행렬", "확률과 통계"] as PrereqArea[],
    gist: "데이터를 벡터로 표현하고, 표본과 모집단을 구분하며, 오차로 성능을 잰다.",
  },
  {
    chapter: "2·3장",
    lecture: null,
    title: "벡터와 행렬 · 확률과 통계",
    needs: [] as PrereqArea[],
    gist: "자율 학습 범위. 이후 모든 강의가 이 표기와 개념을 이미 안다고 보고 진행한다.",
    isSelfStudy: true,
  },
  {
    chapter: "4장",
    lecture: 2,
    title: "지도학습: 분류",
    needs: ["확률과 통계", "벡터와 행렬"] as PrereqArea[],
    gist: "조건부확률과 베이즈 정리로 사후확률을 계산하고, 공분산행렬의 모양이 결정경계를 정한다.",
  },
  {
    chapter: "5장",
    lecture: 3,
    title: "지도학습: 회귀",
    needs: ["미분과 수식 표기", "벡터와 행렬", "확률과 통계"] as PrereqArea[],
    gist: "오차함수를 편미분해 0으로 놓아 계수를 얻고, 로지스틱 회귀는 우도를 최대화한다.",
  },
  {
    chapter: "6장",
    lecture: 4,
    title: "비지도학습: 군집화",
    needs: ["벡터와 행렬", "미분과 수식 표기"] as PrereqArea[],
    gist: "거리로 묶고 평균으로 대표값을 갱신하며, 목적함수가 줄어드는 방향으로 반복한다.",
  },
];

function EntryCard({ entry }: { entry: PrereqEntry }) {
  const [open, setOpen] = useState(false);
  const meta = areaMeta[entry.area];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-2">
            <span className="text-sm font-bold">{entry.term}</span>
            {entry.en && <span className="text-[10px] text-gray-400">{entry.en}</span>}
          </span>
          <span className="mt-1 block text-[12px] leading-5 text-gray-500">
            {entry.short}
          </span>
          <span className="mt-2 flex flex-wrap gap-1">
            {entry.usedIn.map((u) => (
              <span
                key={`${u.lecture}-${u.where}`}
                className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400"
              >
                {u.lecture}강
              </span>
            ))}
          </span>
        </span>
        <ChevronDown
          size={15}
          className={`mt-1 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-gray-100 p-4 dark:border-gray-800">
              <div className={`rounded-lg p-3 ${meta.chip}`}>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider opacity-70">
                  왜 필요한가
                </div>
                <p className="text-[12px] leading-5">{entry.why}</p>
              </div>

              <div>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  정의
                </div>
                <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
                  {entry.definition}
                </p>
              </div>

              {entry.formula && entry.formula.length > 0 && (
                <div>
                  <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    <Sigma size={10} /> 수식
                  </div>
                  <div className="space-y-1.5">
                    {entry.formula.map((f, i) => (
                      <div
                        key={i}
                        className="overflow-x-auto rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800"
                      >
                        <code className="block whitespace-nowrap font-mono text-[12px] text-gray-800 dark:text-gray-100">
                          {f.expr}
                        </code>
                        {f.note && (
                          <p className="mt-1 whitespace-normal text-[11px] text-gray-500">
                            {f.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {entry.example && (
                <div>
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    직접 해보기
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                    <p className="text-[12px] font-medium text-gray-600 dark:text-gray-300">
                      {entry.example.setup}
                    </p>
                    <ol className="mt-1.5 space-y-1">
                      {entry.example.work.map((w, i) => (
                        <li
                          key={i}
                          className="flex gap-1.5 text-[12px] leading-5 text-gray-600 dark:text-gray-300"
                        >
                          <CornerDownRight size={11} className="mt-1 shrink-0 text-gray-400" />
                          {w}
                        </li>
                      ))}
                    </ol>
                    <p className="mt-2 rounded-lg bg-cyan-50 px-2.5 py-1.5 text-[12px] font-semibold text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-200">
                      {entry.example.result}
                    </p>
                  </div>
                </div>
              )}

              {entry.pitfall && (
                <div className="flex gap-2 rounded-lg border-l-[3px] border-rose-400 bg-rose-50 p-3 dark:bg-rose-950/30">
                  <AlertTriangle size={13} className="mt-0.5 shrink-0 text-rose-500" />
                  <p className="text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                    {entry.pitfall}
                  </p>
                </div>
              )}

              <div>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  어디서 쓰이는가
                </div>
                <ul className="space-y-1">
                  {entry.usedIn.map((u, i) => (
                    <li key={i} className="flex gap-2 text-[12px] leading-5">
                      <span className="mt-0.5 shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {u.lecture}강
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">{u.where}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {entry.chapter && (
                <p className="text-[11px] text-gray-400">교재 대응: {entry.chapter}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PrereqPrimer() {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<PrereqArea | "전체">("전체");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prereqs.filter((p) => {
      if (area !== "전체" && p.area !== area) return false;
      if (!q) return true;
      return [p.term, p.en ?? "", p.short, p.definition, p.why]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query, area]);

  const grouped = prereqAreas
    .map((a) => ({ area: a, items: filtered.filter((p) => p.area === a) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-12">
      {/* 교재 흐름 */}
      <section>
        <SectionTitle
          title="교재는 이 순서로 쌓아 올린다"
          subtitle="1장에서 문제를 정의하고, 2·3장에서 언어를 갖춘 뒤, 4~6장에서 실제 방법을 배운다"
        />

        <div className="space-y-2">
          {flow.map((step) => (
            <div
              key={step.chapter}
              className={`rounded-xl border p-4 ${
                step.isSelfStudy
                  ? "border-amber-300 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/20"
                  : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                    step.isSelfStudy
                      ? "bg-amber-500 text-white"
                      : "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  }`}
                >
                  {step.chapter}
                </span>
                <span className="text-sm font-bold">{step.title}</span>
                {step.lecture && (
                  <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-semibold text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
                    {step.lecture}강
                  </span>
                )}
                {step.isSelfStudy && (
                  <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                    자율 학습
                  </span>
                )}
              </div>
              <p className="mt-2 text-[12px] leading-5 text-gray-600 dark:text-gray-300">
                {step.gist}
              </p>
              {step.needs.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-gray-400">기대는 바탕</span>
                  {step.needs.map((n) => {
                    const m = areaMeta[n];
                    return (
                      <span
                        key={n}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${m.chip}`}
                      >
                        <m.Icon size={9} />
                        {n}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 영역별 개념 */}
      <section>
        <SectionTitle
          title="바탕이 되는 개념"
          subtitle={`1~4강 본문에서 실제로 쓰이는 것만 골라, 쓰이는 자리와 함께 정리했습니다 · ${prereqs.length}개`}
        />

        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="개념 검색 — 편미분, 공분산, 전치…"
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-900"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            {(["전체", ...prereqAreas] as const).map((a) => (
              <button
                key={a}
                onClick={() => setArea(a)}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                  area === a
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {grouped.length === 0 && (
          <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700">
            일치하는 개념이 없습니다.
          </p>
        )}

        <div className="space-y-8">
          {grouped.map(({ area: a, items }) => {
            const m = areaMeta[a];
            return (
              <div key={a}>
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <m.Icon size={16} className={m.accent} />
                    <h3 className="text-base font-bold">{a}</h3>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      {items.length}개
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] leading-5 text-gray-500">{m.blurb}</p>
                  <p className="mt-0.5 text-[11px] text-gray-400">{m.chapter}</p>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {items.map((entry) => (
                    <EntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
