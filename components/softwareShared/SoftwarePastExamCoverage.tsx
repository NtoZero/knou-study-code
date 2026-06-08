import Link from "next/link";
import { BookOpenCheck, Flame } from "lucide-react";
import { softwarePastExamQuestions } from "@/components/softwarePastExam/data";

export default function SoftwarePastExamCoverage({ lectureId }: { lectureId: number }) {
  const questions = softwarePastExamQuestions.filter((question) =>
    question.lectureRefs.some((ref) => ref.lectureId === lectureId),
  );
  const tags = Array.from(new Set(questions.map((question) => question.conceptTags[0]))).slice(0, 6);

  if (questions.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
        이 강의와 직접 연결된 2017-2019 기출 문항은 현재 별도 태그로 확인되지 않습니다.
      </div>
    );
  }

  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-100">
            <BookOpenCheck size={16} />
            기출 연결 {questions.length}문항
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-gray-950 dark:text-emerald-100">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/software/past-exam?year=${questions[0].year}#${questions[0].id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <BookOpenCheck size={15} />
            기출에서 보기
          </Link>
          <Link
            href="/software/frequent-concepts"
            className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 dark:border-amber-900 dark:bg-gray-950 dark:text-amber-100"
          >
            <Flame size={15} />
            빈출 개념
          </Link>
        </div>
      </div>
    </section>
  );
}
