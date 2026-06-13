import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { javaLectures } from "@/lib/constants";

type Props = {
  lectureId: number;
  children: React.ReactNode;
};

export default function JavaLectureLayout({ lectureId, children }: Props) {
  const idx = javaLectures.findIndex((item) => item.id === lectureId);
  const lecture = javaLectures[idx];
  const prev = idx > 0 ? javaLectures[idx - 1] : null;
  const next = idx < javaLectures.length - 1 ? javaLectures[idx + 1] : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 max-sm:pl-16">
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/java" className="hover:text-gray-900 dark:hover:text-gray-200">
          Java프로그래밍
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

      <div className="space-y-12">{children}</div>

      <div className="mt-16 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
        {prev ? (
          <Link href={`/java/lecture/${prev.id}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200">
            <ChevronLeft size={16} />
            {prev.id}강. {prev.title}
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link href={`/java/lecture/${next.id}`} className="flex items-center gap-2 text-right text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200">
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
