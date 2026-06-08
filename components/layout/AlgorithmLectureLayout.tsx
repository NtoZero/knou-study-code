import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { algorithmLectures, getAlgorithmLecture } from "@/lib/algorithmCourse";
import AlgorithmPastExamCoverage from "@/components/algorithmPastExam/AlgorithmPastExamCoverage";

interface Props {
  lectureId: number;
  children: React.ReactNode;
}

export default function AlgorithmLectureLayout({ lectureId, children }: Props) {
  const lecture = getAlgorithmLecture(lectureId) ?? algorithmLectures[0];
  const index = algorithmLectures.findIndex((item) => item.id === lectureId);
  const prev = index > 0 ? algorithmLectures[index - 1] : null;
  const next = index >= 0 && index < algorithmLectures.length - 1 ? algorithmLectures[index + 1] : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link href="/algorithm" className="hover:text-gray-900 dark:hover:text-gray-200">
          알고리즘
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-400">교재 {lecture.chapter}장</span>
        <ChevronRight size={14} />
        <span className={`font-medium ${lecture.textClass}`}>
          {lecture.id}강. {lecture.title}
        </span>
      </div>

      <div className={`mb-8 rounded-xl border-l-4 ${lecture.borderClass} ${lecture.bgLightClass} p-6`}>
        <div className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
          {lecture.chapterTitle} · 기말 {lecture.examCount}문항 배정 장
        </div>
        <h1 className="text-2xl font-bold">
          {lecture.id}강. {lecture.title}
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-300">{lecture.subtitle}</p>
      </div>

      <div className="space-y-8">
        <AlgorithmPastExamCoverage lectureId={lectureId} />
        {children}
      </div>

      <div className="mt-14 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
        {prev ? (
          <Link
            href={`/algorithm/lecture/${prev.id}`}
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
            href={`/algorithm/lecture/${next.id}`}
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
