"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { securityLectures } from "@/lib/constants";
import SecurityPastExamCoverage from "@/components/securityShared/SecurityPastExamCoverage";

interface Props {
  lectureId: number;
  children: React.ReactNode;
}

export default function SecurityLectureLayout({ lectureId, children }: Props) {
  const idx = securityLectures.findIndex((item) => item.id === lectureId);
  const lec = securityLectures[idx];
  const prev = idx > 0 ? securityLectures[idx - 1] : null;
  const next = idx < securityLectures.length - 1 ? securityLectures[idx + 1] : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 max-sm:pl-16">
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/security" className="hover:text-gray-900 dark:hover:text-gray-200">
          컴퓨터보안
        </Link>
        <ChevronRight size={14} />
        <span className={`font-medium ${lec.textClass}`}>
          {lectureId}강. {lec.title}
        </span>
      </div>

      <div className={`mb-10 rounded-xl border-l-4 ${lec.borderClass} ${lec.bgLightClass} p-6`}>
        <h1 className="text-2xl font-bold">
          {lectureId}강. {lec.title}
        </h1>
        <p className="mt-1 text-gray-500">{lec.subtitle}</p>
      </div>

      <div className="space-y-12">
        <SecurityPastExamCoverage lectureId={lectureId} />
        {children}
      </div>

      <div className="mt-16 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
        {prev ? (
          <Link
            href={`/security/lecture/${prev.id}`}
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
            href={`/security/lecture/${next.id}`}
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
