import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { softwareLectures } from "@/lib/constants";
import SoftwarePastExamCoverage from "@/components/softwareShared/SoftwarePastExamCoverage";

type Props = {
  lectureId: number;
  children: React.ReactNode;
};

export default function SoftwareLectureLayout({ lectureId, children }: Props) {
  const idx = softwareLectures.findIndex((item) => item.id === lectureId);
  const lecture = softwareLectures[idx];
  const prev = idx > 0 ? softwareLectures[idx - 1] : null;
  const next = idx < softwareLectures.length - 1 ? softwareLectures[idx + 1] : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 max-sm:pl-16">
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/software" className="hover:text-gray-900 dark:hover:text-gray-200">
          소프트웨어공학
        </Link>
        <ChevronRight size={14} />
        <span className={`font-medium ${lecture.textClass}`}>
          {lectureId}강. {lecture.title}
        </span>
      </div>

      <div className={`mb-10 rounded-lg border-l-4 ${lecture.borderClass} ${lecture.bgLightClass} p-6`}>
        <h1 className="text-2xl font-bold">
          {lectureId}강. {lecture.title}
        </h1>
        <p className="mt-1 text-gray-500">{lecture.subtitle}</p>
      </div>

      <div className="space-y-12">
        <SoftwarePastExamCoverage lectureId={lectureId} />
        {children}
      </div>

      <div className="mt-16 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
        {prev ? (
          <Link href={`/software/lecture/${prev.id}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200">
            <ChevronLeft size={16} />
            {prev.id}강. {prev.title}
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link href={`/software/lecture/${next.id}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200">
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
