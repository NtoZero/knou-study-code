"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ClipboardList, Lightbulb } from "lucide-react";

export type Stage = "foundation" | "problem" | "applied";

interface Props {
  foundation: ReactNode;
  problem: ReactNode;
  applied: ReactNode;
  /** Tailwind accent color classes */
  accent: {
    bg: string; // e.g., bg-orange-500
    bgLight: string; // e.g., bg-orange-50 dark:bg-orange-950/40
    text: string; // e.g., text-orange-500
    border: string; // e.g., border-orange-500
  };
}

const stageMeta: Record<
  Stage,
  { label: string; subtitle: string; icon: typeof BookOpen }
> = {
  foundation: {
    label: "기초 학습",
    subtitle: "핵심 개념을 원리부터 정리",
    icon: BookOpen,
  },
  problem: {
    label: "문제 학습",
    subtitle: "개념을 문제에 적용하는 법",
    icon: ClipboardList,
  },
  applied: {
    label: "응용 문제 및 팁",
    subtitle: "확장 · 실수 방지 · 작성 팁",
    icon: Lightbulb,
  },
};

export default function StudyStageTabs({
  foundation,
  problem,
  applied,
  accent,
}: Props) {
  const [stage, setStage] = useState<Stage>("foundation");

  const content: Record<Stage, ReactNode> = {
    foundation,
    problem,
    applied,
  };

  return (
    <div>
      {/* Stage Tabs */}
      <div className="mb-8 grid gap-2 sm:grid-cols-3">
        {(Object.keys(stageMeta) as Stage[]).map((key, i) => {
          const meta = stageMeta[key];
          const Icon = meta.icon;
          const active = stage === key;
          return (
            <button
              key={key}
              onClick={() => setStage(key)}
              className={`relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                active
                  ? `${accent.border} ${accent.bgLight} shadow-sm`
                  : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  active
                    ? `${accent.bg} text-white`
                    : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold ${
                      active ? accent.text : "text-gray-400"
                    }`}
                  >
                    STEP {i + 1}
                  </span>
                  <h3
                    className={`text-sm font-bold ${
                      active ? "text-gray-900 dark:text-gray-50" : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {meta.label}
                  </h3>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-gray-500">
                  {meta.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stage Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="space-y-10"
        >
          {content[stage]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
