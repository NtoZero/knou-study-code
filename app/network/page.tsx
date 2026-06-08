import Link from "next/link";
import { lectures } from "@/lib/constants";
import { networkLectureExamHighlights } from "@/components/networkShared/examData";
import NetworkExamPrepMap from "@/components/networkShared/NetworkExamPrepMap";
import { ArrowRight, BookOpen, ClipboardList, Flame } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <div className="mb-4 flex justify-center">
          <BookOpen size={48} className="text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold">정보통신망 인터랙티브 시각화</h1>
        <p className="mt-2 text-gray-500">
          KNOU 정보통신망 1~15강 핵심 개념을 시각적으로 학습합니다
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href="/network/past-exam"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
          >
            <ClipboardList size={16} />
            기출분석·재구성
          </Link>
          <Link
            href="/network/frequent-concepts"
            className="inline-flex items-center gap-2 rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-800"
          >
            <Flame size={16} />
            빈출 개념 정리
          </Link>
        </div>
      </div>

      <NetworkExamPrepMap />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lectures.map((lec) => {
          const focus = networkLectureExamHighlights[lec.id] ?? [];

          return (
            <Link
              key={lec.id}
              href={`/network/lecture/${lec.id}`}
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
