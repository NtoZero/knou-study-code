import Link from "next/link";
import { ArrowRight, BookOpenCheck, Code2, Flame } from "lucide-react";
import { javaLectures } from "@/lib/constants";

export default function JavaHome() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <div className="mb-4 flex justify-center">
          <Code2 size={48} className="text-amber-600" />
        </div>
        <h1 className="text-3xl font-bold">Java프로그래밍 인터랙티브 학습</h1>
        <p className="mt-2 text-gray-500">
          1~15강 기본 개념, 코드 실행 흐름, 판별 드릴, 공식 연습문제 포인트
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href="/java/past-exam"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <BookOpenCheck size={16} />
            Java 기출분석 풀기
          </Link>
          <Link
            href="/java/frequent-concepts"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
          >
            <Flame size={16} />
            Java 빈출 개념
          </Link>
          <Link
            href="/official-exercises"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            <BookOpenCheck size={16} />
            Java 공식 연습문제 복습
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {javaLectures.map((lecture) => (
          <Link
            key={lecture.id}
            href={`/java/lecture/${lecture.id}`}
            className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white ${lecture.bgClass}`}>
              {lecture.id}
            </span>
            <h2 className="mt-4 text-lg font-semibold">{lecture.title}</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">{lecture.subtitle}</p>
            <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${lecture.textClass}`}>
              학습하기
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
