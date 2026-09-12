"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ChevronDown, ArrowRight, Sigma } from "lucide-react";
import { prereqsForLecture, prereqAreas, type PrereqArea } from "@/lib/mlPrereqs";

interface Props {
  lectureId: number;
}

const areaTone: Record<PrereqArea, string> = {
  "벡터와 행렬": "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200",
  "확률과 통계":
    "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-200",
  "미분과 수식 표기":
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
};

export default function LecturePrereqBar({ lectureId }: Props) {
  const [open, setOpen] = useState(false);
  const items = prereqsForLecture(lectureId);
  if (items.length === 0) return null;

  const byArea = prereqAreas
    .map((a) => ({ area: a, items: items.filter((p) => p.area === a) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="mb-10 overflow-hidden rounded-xl border border-amber-200 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/20">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
          <Layers size={15} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold">이 강의를 따라가려면</span>
          <span className="block text-xs text-gray-600 dark:text-gray-300">
            수식이 막히면 먼저 확인할 개념 {items.length}개
          </span>
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-amber-200 p-4 dark:border-amber-900/60">
              {byArea.map(({ area, items: group }) => (
                <div key={area}>
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    {area}
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {group.map((p) => {
                      const usage = p.usedIn.find((u) => u.lecture === lectureId);
                      return (
                        <div
                          key={p.id}
                          className={`rounded-lg border p-3 ${areaTone[area]}`}
                        >
                          <div className="flex flex-wrap items-baseline gap-1.5">
                            <span className="text-[13px] font-bold">{p.term}</span>
                            {p.en && (
                              <span className="text-[10px] opacity-60">{p.en}</span>
                            )}
                          </div>
                          <p className="mt-1 text-[12px] leading-5 opacity-90">{p.short}</p>
                          {p.formula && p.formula[0] && (
                            <div className="mt-1.5 flex items-start gap-1 overflow-x-auto">
                              <Sigma size={10} className="mt-1 shrink-0 opacity-60" />
                              <code className="whitespace-nowrap font-mono text-[11px]">
                                {p.formula[0].expr}
                              </code>
                            </div>
                          )}
                          {usage && (
                            <p className="mt-1.5 text-[11px] opacity-70">
                              쓰이는 자리 — {usage.where}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <Link
                href="/ml/prerequisites"
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-amber-600"
              >
                선행 개념 전체 보기
                <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
