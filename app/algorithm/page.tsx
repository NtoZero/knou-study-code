import Link from "next/link";
import { ArrowRight, BarChart3, BookOpen, BookOpenCheck, FileText } from "lucide-react";
import { algorithmChapterWeights, algorithmLectures } from "@/lib/algorithmCourse";

export default function AlgorithmHome() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10 text-center">
        <div className="mb-4 flex justify-center">
          <BookOpen size={48} className="text-emerald-500" />
        </div>
        <h1 className="text-3xl font-bold">알고리즘 기말 대비 학습</h1>
        <p className="mt-2 text-gray-500">
          교재 1~7장과 강의 1~15강을 기말 출제 범위 기준으로 재편했습니다
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Link
          href="/algorithm/summary"
          className="group rounded-xl border border-emerald-200 bg-emerald-50 p-5 transition-all hover:-translate-y-1 hover:shadow-md dark:border-emerald-900/60 dark:bg-emerald-950/30"
        >
          <FileText size={28} className="text-emerald-600 dark:text-emerald-400" />
          <h2 className="mt-3 text-lg font-bold">기말분석 페이지</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            장별 문항 수, 취약도 진단, 체크리스트, 실전 연습 순서를 한 화면에서 확인합니다.
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            분석 보기
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          href="/algorithm/visualizer"
          className="group rounded-xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <BarChart3 size={28} className="text-slate-700 dark:text-slate-200" />
          <h2 className="mt-3 text-lg font-bold">알고리즘 시각화 실습</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            기존 정렬·탐색·그래프 시뮬레이터를 별도 페이지로 유지했습니다.
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
            시각화 열기
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          href="/algorithm/past-exam"
          className="group rounded-xl border border-cyan-200 bg-cyan-50 p-5 transition-all hover:-translate-y-1 hover:shadow-md dark:border-cyan-900/60 dark:bg-cyan-950/30"
        >
          <BookOpenCheck size={28} className="text-cyan-700 dark:text-cyan-200" />
          <h2 className="mt-3 text-lg font-bold">기출분석 문제집</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            2017~2019학년도 기말 문항을 먼저 풀고, 정답과 강의 개념 해설을 확인합니다.
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-cyan-700 dark:text-cyan-200">
            기출분석 열기
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-bold">출제 배정</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {algorithmChapterWeights.map((chapter) => (
            <div key={chapter.chapter} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-950">
              <div className="text-xs font-semibold text-gray-500">교재 {chapter.chapter}장</div>
              <div className="mt-1 font-bold">{chapter.title}</div>
              <div className="mt-1 text-sm text-gray-500">{chapter.count}문항</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {algorithmLectures.map((lecture) => (
          <Link
            key={lecture.id}
            href={`/algorithm/lecture/${lecture.id}`}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white ${lecture.bgClass}`}>
              {lecture.id}
            </span>
            <div className="mt-3 text-xs font-semibold text-gray-500">교재 {lecture.chapter}장 · {lecture.examCount}문항 배정 장</div>
            <h2 className="mt-2 text-lg font-semibold">{lecture.title}</h2>
            <p className="mt-1 text-sm text-gray-500">{lecture.subtitle}</p>
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
