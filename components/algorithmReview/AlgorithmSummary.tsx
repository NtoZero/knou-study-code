import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, Target } from "lucide-react";
import { algorithmChapterWeights, algorithmLectures } from "@/lib/algorithmCourse";
import { AlgorithmFinalAnalysis } from "./AlgorithmFinalAnalysis";

export function AlgorithmSummary() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
          <Target size={18} />
          기말시험 범위: 교재 및 강의 전체
        </div>
        <h1 className="text-3xl font-bold">알고리즘 기말분석</h1>
        <p className="mt-2 text-gray-500">
          교재 1~7장 출제 문항 배정과 1~15강 강의 흐름을 비중·취약도·실전 연습 순서로 정리합니다.
        </p>
      </div>

      <AlgorithmFinalAnalysis />

      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <ClipboardList size={20} />
          장별 문항 배정
        </h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {algorithmChapterWeights.map((chapter) => (
            <div key={chapter.chapter} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-950">
              <div className="text-sm font-semibold text-gray-500">교재 {chapter.chapter}장</div>
              <div className="mt-1 text-lg font-bold">{chapter.title}</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {chapter.count}문항 · {chapter.lectures.map((id) => `${id}강`).join(", ")}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <BookOpen size={20} />
          1~15강 빠른 요약
        </h2>
        <div className="space-y-3">
          {algorithmLectures.map((lecture) => (
            <Link
              key={lecture.id}
              href={`/algorithm/lecture/${lecture.id}`}
              className="group grid gap-3 rounded-lg border border-gray-200 p-4 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-gray-800 md:grid-cols-[5rem_1fr_11rem]"
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white ${lecture.bgClass}`}>
                  {lecture.id}
                </span>
                <span className="text-xs font-semibold text-gray-500 md:hidden">교재 {lecture.chapter}장</span>
              </div>
              <div>
                <div className="font-semibold">{lecture.title}</div>
                <p className="mt-1 text-sm text-gray-500">{lecture.subtitle}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {lecture.examKeywords.slice(0, 4).map((keyword) => (
                    <span key={keyword} className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className="hidden items-center justify-end gap-2 text-sm font-semibold text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-100 md:flex">
                교재 {lecture.chapter}장
                <ArrowRight size={15} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-bold">시험 직전 우선순위</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-amber-50 p-4 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            <div className="font-semibold">정렬 7문항</div>
            <p className="mt-2 text-sm">처리 과정, 성능표, 안정성/제자리/비교 기반 여부를 표로 검산.</p>
          </div>
          <div className="rounded-lg bg-sky-50 p-4 text-sky-900 dark:bg-sky-950/40 dark:text-sky-100">
            <div className="font-semibold">그래프 6문항</div>
            <p className="mt-2 text-sm">DFS, SCC, MST, 최단 경로, 네트워크 플로를 손으로 한 단계씩 추적.</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-4 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
            <div className="font-semibold">탐색 4문항</div>
            <p className="mt-2 text-sm">BST/2-3-4/RB/B-트리와 해싱 충돌 처리의 조건을 구분.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
