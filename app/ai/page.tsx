import Link from "next/link";
import { aiLectures } from "@/lib/constants";
import { ArrowRight, Brain, CheckCircle2, FileQuestion } from "lucide-react";

export default function AIHome() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <div className="mb-4 flex justify-center">
          <Brain size={48} className="text-indigo-500" />
        </div>
        <h1 className="text-3xl font-bold">인공지능 인터랙티브 학습</h1>
        <p className="mt-2 text-gray-500">
          KNOU 인공지능 1~15강 핵심 개념을 시험 범위 기준으로 학습합니다
        </p>
      </div>

      <section className="mb-8 rounded-xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-900 dark:bg-indigo-950/40">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-indigo-700 dark:text-indigo-300">
          <CheckCircle2 size={18} />
          시험 전 핵심 흐름
        </div>
        <div className="grid gap-3 text-sm text-gray-700 dark:text-gray-300 md:grid-cols-3">
          <div className="rounded-lg bg-white p-3 dark:bg-gray-900">
            <div className="font-semibold">1~5강</div>
            <p className="mt-1 text-xs text-gray-500">기존 시뮬레이션 유지</p>
          </div>
          <div className="rounded-lg bg-white p-3 dark:bg-gray-900">
            <div className="font-semibold">6~9강</div>
            <p className="mt-1 text-xs text-gray-500">논리·퍼지·시각·패턴인식 정리</p>
          </div>
          <div className="rounded-lg bg-white p-3 dark:bg-gray-900">
            <div className="font-semibold">10~15강</div>
            <p className="mt-1 text-xs text-gray-500">머신러닝·신경망·딥러닝 정리</p>
          </div>
        </div>
      </section>

      <Link
        href="/ai/past-exam"
        className="group mb-8 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
            <FileQuestion size={24} />
          </span>
          <div>
            <h2 className="text-lg font-semibold">기출분석 문제집</h2>
            <p className="mt-1 text-sm text-gray-500">
              2017-2019년 2학기 기말 105문항을 직접 풀고 해설로 복습합니다
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
          풀어보기
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-1"
          />
        </div>
      </Link>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {aiLectures.map((lec) => (
          <Link
            key={lec.id}
            href={`/ai/lecture/${lec.id}`}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white ${lec.bgClass}`}
            >
              {lec.id}
            </span>
            <h2 className="mt-4 text-lg font-semibold">{lec.title}</h2>
            <p className="mt-1 text-sm text-gray-500">{lec.subtitle}</p>
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
        ))}
      </div>
    </div>
  );
}
