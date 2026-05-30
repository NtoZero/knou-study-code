import Link from "next/link";
import { securityLectures } from "@/lib/constants";
import { securityLectureExamHighlights } from "@/components/securityShared/examData";
import SecurityExamPrepMap from "@/components/securityShared/SecurityExamPrepMap";
import { ArrowRight, BookOpenCheck, Flame, Shield } from "lucide-react";

export default function SecurityHome() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <div className="mb-4 flex justify-center">
          <Shield size={48} className="text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold">컴퓨터보안 인터랙티브 학습</h1>
        <p className="mt-2 text-gray-500">
          KNOU 컴퓨터보안 1~15강 핵심 개념을 실습과 퀴즈로 학습합니다
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href="/security/past-exam"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-800"
          >
            <BookOpenCheck size={16} />
            2015-2019 기출분석
          </Link>
          <Link
            href="/security/frequent-concepts"
            className="inline-flex items-center gap-2 rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-800"
          >
            <Flame size={16} />
            2015-2019 빈출정리
          </Link>
        </div>
      </div>

      <SecurityExamPrepMap />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {securityLectures.map((lec) => {
          const focus = securityLectureExamHighlights[lec.id] ?? [];

          return (
            <Link
              key={lec.id}
              href={`/security/lecture/${lec.id}`}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white ${lec.bgClass}`}
              >
                {lec.id}
              </span>
              <h2 className="mt-4 text-lg font-semibold">{lec.title}</h2>
              <p className="mt-1 text-sm text-gray-500">{lec.subtitle}</p>
              {focus.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {focus.slice(0, 3).map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
              <div
                className={`mt-4 flex items-center gap-1 text-sm font-medium ${lec.textClass}`}
              >
                학습하기
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
