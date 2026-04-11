"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { lectures } from "@/lib/constants";

interface Props {
  lectureId: number;
  children: React.ReactNode;
}

export default function LectureLayout({ lectureId, children }: Props) {
  const lec = lectures[lectureId - 1];
  const prev = lectureId > 1 ? lectures[lectureId - 2] : null;
  const next = lectureId < lectures.length ? lectures[lectureId] : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/network" className="hover:text-gray-900 dark:hover:text-gray-200">
          정보통신망
        </Link>
        <ChevronRight size={14} />
        <span className={`font-medium ${lec.textClass}`}>
          {lectureId}강. {lec.title}
        </span>
      </div>

      {/* Title */}
      <div className={`mb-10 rounded-xl border-l-4 ${lec.borderClass} ${lec.bgLightClass} p-6`}>
        <h1 className="text-2xl font-bold">
          {lectureId}강. {lec.title}
        </h1>
        <p className="mt-1 text-gray-500">{lec.subtitle}</p>
      </div>

      {/* Content */}
      <div className="space-y-12">{children}</div>

      {/* Prev / Next */}
      <div className="mt-16 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
        {prev ? (
          <Link
            href={`/network/lecture/${prev.id}`}
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
            href={`/network/lecture/${next.id}`}
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
