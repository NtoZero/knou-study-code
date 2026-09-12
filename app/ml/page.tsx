import Link from "next/link";
import { mlLectures, mlUpcomingLectures } from "@/lib/constants";
import { getMlOutline } from "@/lib/mlLectureOutline";
import CourseStructure from "@/components/mlShared/CourseStructure";
import { ArrowRight, Sparkle, BookOpen, Layers3, Layers } from "lucide-react";

const lectureFocus: Record<number, string[]> = {
  1: ["AI ⊃ ML ⊃ DL", "학습·추론 단계", "일반화 오차", "교차검증법", "과다적합"],
  2: ["베이즈 정리", "우도비 검정", "최소거리 분류기", "마할라노비스 거리", "K-NN"],
  3: ["최소제곱법", "잔차", "(XᵀX)⁻¹Xᵀy", "로지스틱 함수", "오즈비·로짓"],
  4: ["대표 벡터", "목적함수 J", "지역 극소점", "덴드로그램", "연결법 5종"],
};

export default function MLHome() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 max-sm:pl-16">
      <div className="mb-10 text-center">
        <div className="mb-4 flex justify-center">
          <Sparkle size={48} className="text-cyan-500" />
        </div>
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
          2026-2학기
        </div>
        <h1 className="text-3xl font-bold">머신러닝 인터랙티브 학습</h1>
        <p className="mt-2 text-gray-500">
          KNOU 머신러닝 1~4강의 개념을 시뮬레이션·계산기·판별 드릴로 학습합니다
        </p>
      </div>

      <CourseStructure />

      <Link
        href="/ml/prerequisites"
        className="group mb-10 flex items-start gap-4 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-amber-900/60 dark:from-amber-950/30 dark:to-gray-900"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
          <Layers size={19} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold">선행 개념 다지기</span>
          <span className="mt-1 block text-xs leading-5 text-gray-600 dark:text-gray-300">
            벡터와 행렬, 확률과 통계, 편미분이 막히면 여기서 해당 개념만 확인하고 돌아오세요.
            각 개념이 어느 강의 어느 대목에서 쓰이는지 함께 정리돼 있습니다.
          </span>
        </span>
        <ArrowRight
          size={16}
          className="mt-1 shrink-0 text-amber-600 transition-transform group-hover:translate-x-1"
        />
      </Link>

      <div className="mb-4 flex items-center gap-2">
        <BookOpen size={18} className="text-gray-400" />
        <h2 className="text-lg font-bold">강의별 학습</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {mlLectures.map((lec) => {
          const focus = lectureFocus[lec.id] ?? [];
          const outline = getMlOutline(lec.id);
          return (
            <Link
              key={lec.id}
              href={`/ml/lecture/${lec.id}`}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white ${lec.bgClass}`}
              >
                {lec.id}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{lec.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{lec.subtitle}</p>

              {outline && (
                <div className="mt-3 space-y-1">
                  {outline.objectives.map((obj, i) => (
                    <div
                      key={obj}
                      className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ${lec.bgClass}`}
                      >
                        {i + 1}
                      </span>
                      {obj}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {focus.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {item}
                  </span>
                ))}
              </div>

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

      <div className="mt-12">
        <div className="mb-4 flex items-center gap-2">
          <Layers3 size={18} className="text-gray-400" />
          <h2 className="text-lg font-bold">5~15강 · 준비 중</h2>
        </div>
        <p className="mb-4 text-sm text-gray-500">
          강의록과 정리 자료는 확보되어 있으나 인터랙티브 페이지는 아직 제작 전입니다.
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {mlUpcomingLectures.map((lec) => (
            <div
              key={lec.id}
              className="flex items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-900/40"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-200 text-xs font-bold text-gray-500 dark:bg-gray-800">
                {lec.id}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-gray-600 dark:text-gray-300">
                  {lec.title}
                </span>
                <span className="block truncate text-[11px] text-gray-400">
                  {lec.subtitle}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
