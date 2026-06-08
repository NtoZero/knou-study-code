import Link from "next/link";
import { ArrowRight, BookOpenCheck, Flame, Layers } from "lucide-react";
import { softwareLectures } from "@/lib/constants";
import { softwarePastExamQuestions } from "@/components/softwarePastExam/data";

export default function SoftwareHome() {
  const counts = softwareLectures.map((lecture) => ({
    id: lecture.id,
    count: softwarePastExamQuestions.filter((question) =>
      question.lectureRefs.some((ref) => ref.lectureId === lecture.id),
    ).length,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <div className="mb-4 flex justify-center">
          <Layers size={48} className="text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold">소프트웨어공학 인터랙티브 학습</h1>
        <p className="mt-2 text-gray-500">
          1~15강 개념 정리, 시각화, 2017~2019 기출분석과 빈출 개념
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href="/software/past-exam"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <BookOpenCheck size={16} />
            2017-2019 기출분석
          </Link>
          <Link
            href="/software/frequent-concepts"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
          >
            <Flame size={16} />
            빈출 개념
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {softwareLectures.map((lecture) => {
          const count = counts.find((item) => item.id === lecture.id)?.count ?? 0;
          return (
            <Link
              key={lecture.id}
              href={`/software/lecture/${lecture.id}`}
              className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white ${lecture.bgClass}`}>
                {lecture.id}
              </span>
              <h2 className="mt-4 text-lg font-semibold">{lecture.title}</h2>
              <p className="mt-1 text-sm text-gray-500">{lecture.subtitle}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  기출 {count}문항
                </span>
              </div>
              <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${lecture.textClass}`}>
                학습하기
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
