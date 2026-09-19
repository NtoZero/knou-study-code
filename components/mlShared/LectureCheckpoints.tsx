"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Scale } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { getMlOutline } from "@/lib/mlLectureOutline";
import { Sourced } from "@/components/mlShared/SourceFilter";

interface Props {
  lectureId: number;
  accentText: string;
}

/**
 * 시험에서 갈리는 구분 기준. 문제를 풀기 전에 먼저 확인할 수 있도록
 * 각 강의 페이지에서 퀴즈 바로 앞에 배치한다.
 */
export default function LectureCheckpoints({ lectureId, accentText }: Props) {
  const outline = getMlOutline(lectureId);
  const [openPoint, setOpenPoint] = useState<number | null>(0);
  if (!outline) return null;

  return (
    <section>
      <SectionTitle
        title="헷갈리기 쉬운 지점"
        subtitle="문제로 넘어가기 전에, 헷갈리기 쉬운 구분 기준을 짚고 갑니다"
      />
      <div className="space-y-2">
        {outline.checkpoints.map((cp, i) => {
          const open = openPoint === i;
          return (
            <Sourced key={cp.question} refs={cp.refs ?? {}} badgeClassName="mb-1.5">
            <div
              className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            >
              <button
                onClick={() => setOpenPoint(open ? null : i)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <Scale size={15} className={`shrink-0 ${accentText}`} />
                <span className="min-w-0 flex-1 text-sm font-semibold">{cp.question}</span>
                <ChevronDown
                  size={15}
                  className={`shrink-0 text-gray-400 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
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
                    <div className="border-t border-gray-100 px-4 pb-4 pt-3 dark:border-gray-800">
                      <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
                        {cp.answer}
                      </p>
                      <p className="mt-2 text-[11px] text-gray-400">
                        근거: {cp.refs ? cp.basis : `강의록 ${lectureId}강 ${cp.basis}`}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            </Sourced>
          );
        })}
      </div>
    </section>
  );
}
