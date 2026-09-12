"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, CheckCircle2, Circle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { getMlOutline } from "@/lib/mlLectureOutline";

interface Props {
  lectureId: number;
  accentText: string;
  accentBg: string;
}

export default function LectureSummary({ lectureId, accentText, accentBg }: Props) {
  const outline = getMlOutline(lectureId);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  if (!outline) return null;

  const allItems = outline.summary.flatMap((g, gi) =>
    g.items.map((_, ii) => `${gi}-${ii}`),
  );
  const doneCount = allItems.filter((k) => checked[k]).length;

  return (
    <section>
      <div>
        <SectionTitle
          title="정리하기"
          subtitle="강의에서 다룬 내용을 항목별로 되짚어 보세요"
        />

        <div className="mb-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
            <motion.div
              className={`h-full rounded-full ${accentBg}`}
              initial={false}
              animate={{
                width: `${allItems.length ? (doneCount / allItems.length) * 100 : 0}%`,
              }}
              transition={{ duration: 0.25 }}
            />
          </div>
          <span className="shrink-0 text-xs font-semibold text-gray-500">
            {doneCount} / {allItems.length}
          </span>
        </div>

        <div className="space-y-3">
          {outline.summary.map((group, gi) => (
            <div
              key={group.title}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-3 flex items-center gap-2">
                <ClipboardList size={15} className={accentText} />
                <h3 className="text-sm font-bold">{group.title}</h3>
              </div>
              <ul className="space-y-2">
                {group.items.map((item, ii) => {
                  const key = `${gi}-${ii}`;
                  const on = Boolean(checked[key]);
                  return (
                    <li key={key}>
                      <button
                        onClick={() =>
                          setChecked((prev) => ({ ...prev, [key]: !prev[key] }))
                        }
                        className="flex w-full items-start gap-2 rounded-lg p-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60"
                      >
                        {on ? (
                          <CheckCircle2
                            size={15}
                            className={`mt-0.5 shrink-0 ${accentText}`}
                          />
                        ) : (
                          <Circle size={15} className="mt-0.5 shrink-0 text-gray-300 dark:text-gray-600" />
                        )}
                        <span
                          className={`text-[13px] leading-6 ${
                            on
                              ? "text-gray-400 line-through dark:text-gray-500"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {item}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
