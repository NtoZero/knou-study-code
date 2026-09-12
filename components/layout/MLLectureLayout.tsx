"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Target } from "lucide-react";
import { mlLectures } from "@/lib/constants";
import { getMlOutline } from "@/lib/mlLectureOutline";
import LectureSummary from "@/components/mlShared/LectureSummary";
import LecturePrereqBar from "@/components/mlShared/LecturePrereqBar";

interface Props {
  lectureId: number;
  children: React.ReactNode;
}

export default function MLLectureLayout({ lectureId, children }: Props) {
  const idx = mlLectures.findIndex((item) => item.id === lectureId);
  const lec = mlLectures[idx];
  const prev = idx > 0 ? mlLectures[idx - 1] : null;
  const next = idx < mlLectures.length - 1 ? mlLectures[idx + 1] : null;
  const outline = getMlOutline(lectureId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 max-sm:pl-16">
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/ml" className="hover:text-gray-900 dark:hover:text-gray-200">
          머신러닝
        </Link>
        <ChevronRight size={14} />
        <span className={`font-medium ${lec.textClass}`}>
          {lectureId}강. {lec.title}
        </span>
      </div>

      <div
        className={`mb-10 rounded-xl border-l-4 ${lec.borderClass} ${lec.bgLightClass} p-6`}
      >
        <h1 className="text-2xl font-bold">
          {lectureId}강. {lec.title}
        </h1>
        <p className="mt-1 text-gray-500">{lec.subtitle}</p>

        {outline && (
          <div className="mt-4 border-t border-black/5 pt-4 dark:border-white/10">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              <Target size={11} />
              학습목표
            </div>
            <div className="flex flex-wrap gap-1.5">
              {outline.objectives.map((obj, i) => (
                <span
                  key={obj}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-gray-700 dark:bg-gray-900/70 dark:text-gray-200"
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white ${lec.bgClass}`}
                  >
                    {i + 1}
                  </span>
                  {obj}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <LecturePrereqBar lectureId={lectureId} />

      <div className="space-y-12">{children}</div>

      <div className="mt-16">
        <LectureSummary
          lectureId={lectureId}
          accentText={lec.textClass}
          accentBg={lec.bgClass}
        />
      </div>

      <div className="mt-16 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
        {prev ? (
          <Link
            href={`/ml/lecture/${prev.id}`}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <ChevronLeft size={16} />
            {prev.id}강. {prev.title}
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/ml/lecture/${next.id}`}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
          >
            {next.id}강. {next.title}
            <ChevronRight size={16} />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
