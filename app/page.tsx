import Link from "next/link";
import {
  BookOpen,
  Brain,
  Code2,
  GraduationCap,
  Target,
  Radio,
  Layers,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-center text-3xl font-bold mb-2">
        KNOU 인터랙티브 학습
      </h1>
      <p className="text-center text-gray-500 mb-12">
        출석과제 해결을 위한 딥스터디부터 강의 시각화까지
      </p>

      {/* ── 기초학습 본지 ───────────────────────────────── */}
      <section className="mb-14">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-sm">
              <GraduationCap size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold">기초학습 본지</h2>
              <p className="text-xs text-gray-500">
                출석과제물 해결을 위한 개념 딥스터디 · 기초 → 문제 → 응용
              </p>
            </div>
          </div>
          <span className="hidden items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600 dark:bg-orange-950 dark:text-orange-400 sm:inline-flex">
            <Sparkles size={12} /> 2026-1학기 중간과제
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/study-hub/network"
            className="group relative overflow-hidden rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-orange-900/50 dark:from-orange-950/40 dark:to-gray-900"
          >
            <Radio size={30} className="mb-3 text-orange-500" />
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-orange-500">
              정보통신망 · 공통형
            </div>
            <h3 className="text-lg font-bold">HAC 정의와 미래 전략</h3>
            <p className="mt-2 text-xs text-gray-500">
              Shannon-Weaver · Human-AI Communication · 블랙박스 대응
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-orange-600">
              딥스터디 시작
              <ArrowRight
                size={12}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </Link>

          <Link
            href="/study-hub/software"
            className="group relative overflow-hidden rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-emerald-900/50 dark:from-emerald-950/40 dark:to-gray-900"
          >
            <Layers size={30} className="mb-3 text-emerald-500" />
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-500">
              소프트웨어공학 · 공통형
            </div>
            <h3 className="text-lg font-bold">PE/IDP · CPM 임계경로</h3>
            <p className="mt-2 text-xs text-gray-500">
              Developer Experience · Platform Engineering · Critical Path Method
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600">
              딥스터디 시작
              <ArrowRight
                size={12}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </Link>

          <Link
            href="/study-hub/ai"
            className="group relative overflow-hidden rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-gray-900"
          >
            <Target size={30} className="mb-3 text-indigo-500" />
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-500">
              인공지능 · 공통형
            </div>
            <h3 className="text-lg font-bold">균일비용 탐색 · A* 알고리즘</h3>
            <p className="mt-2 text-xs text-gray-500">
              State Space · UCS · A* · 허용성 · 탐색 트리 작성법
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600">
              딥스터디 시작
              <ArrowRight
                size={12}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </Link>
        </div>
      </section>

      {/* ── 과목별 강의 시각화 ───────────────────────────── */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <BookOpen size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold">과목별 강의 시각화</h2>
            <p className="text-xs text-gray-500">강의 전체 내용을 인터랙티브로 학습</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/network"
            className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <BookOpen size={36} className="text-blue-500 mb-4" />
            <h2 className="text-xl font-semibold">정보통신망</h2>
            <p className="mt-2 text-sm text-gray-500">
              1~10강 인터랙티브 시각화
            </p>
          </Link>
          <Link
            href="/ai"
            className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <Brain size={36} className="text-indigo-500 mb-4" />
            <h2 className="text-xl font-semibold">인공지능</h2>
            <p className="mt-2 text-sm text-gray-500">
              1~15강 인터랙티브 학습
            </p>
          </Link>
          <Link
            href="/algorithm"
            className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <Code2 size={36} className="text-emerald-500 mb-4" />
            <h2 className="text-xl font-semibold">알고리즘</h2>
            <p className="mt-2 text-sm text-gray-500">
              1~15강 기말 범위와 알고리즘 시각화
            </p>
          </Link>
          <Link
            href="/security"
            className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <Shield size={36} className="text-purple-600 mb-4" />
            <h2 className="text-xl font-semibold">컴퓨터보안</h2>
            <p className="mt-2 text-sm text-gray-500">
              6~10강 인터랙티브 학습
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
