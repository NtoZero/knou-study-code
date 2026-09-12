import Link from "next/link";
import {
  BookOpen,
  Brain,
  Code2,
  ClipboardCheck,
  GraduationCap,
  Layers,
  Radio,
  Shield,
  Sparkle,
  ArrowRight,
  Sparkles,
  Target,
} from "lucide-react";
import { semesters, type SubjectEntry } from "@/lib/semesters";

const iconMap = {
  Sparkle,
  Radio,
  Brain,
  Code2,
  Shield,
  Layers,
} as const;

const studyHubIconMap: Record<string, typeof Radio> = {
  network: Radio,
  software: Layers,
  ai: Target,
};

const studyHubAccent: Record<string, { card: string; text: string; icon: string }> = {
  network: {
    card:
      "border-orange-200 bg-gradient-to-br from-orange-50 to-white dark:border-orange-900/50 dark:from-orange-950/40 dark:to-gray-900",
    text: "text-orange-600",
    icon: "text-orange-500",
  },
  software: {
    card:
      "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white dark:border-emerald-900/50 dark:from-emerald-950/40 dark:to-gray-900",
    text: "text-emerald-600",
    icon: "text-emerald-500",
  },
  ai: {
    card:
      "border-indigo-200 bg-gradient-to-br from-indigo-50 to-white dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-gray-900",
    text: "text-indigo-600",
    icon: "text-indigo-500",
  },
};

function SubjectCard({ subject }: { subject: SubjectEntry }) {
  const Icon = iconMap[subject.icon];
  return (
    <Link
      href={subject.href}
      className={`group relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${subject.accentClass}`}
    >
      {subject.isNew && (
        <span className="absolute right-4 top-4 rounded-full bg-cyan-500 px-2 py-0.5 text-[10px] font-bold text-white">
          NEW
        </span>
      )}
      <Icon size={32} className={`mb-3 ${subject.iconClass}`} />
      <h3 className="text-lg font-bold">{subject.title}</h3>
      <p className="mt-1.5 text-xs leading-5 text-gray-500">{subject.subtitle}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-gray-900/70 dark:text-gray-300">
          강의 {subject.lectureRange}
        </span>
        {subject.pastExamHref && (
          <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-gray-900/70 dark:text-gray-300">
            기출분석
          </span>
        )}
        {subject.studyHubHref && (
          <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-gray-900/70 dark:text-gray-300">
            딥스터디
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
        열기
        <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

export default function Home() {
  const studyHubs = semesters
    .flatMap((sem) => sem.subjects)
    .filter((s) => s.studyHubHref);

  const pastExams = semesters
    .flatMap((sem) => sem.subjects)
    .filter((s) => s.pastExamHref);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-center text-3xl font-bold mb-2">KNOU 인터랙티브 학습</h1>
      <p className="text-center text-gray-500 mb-12">
        학기별 강의 시각화부터 출석과제 딥스터디와 기출 풀이까지
      </p>

      {/* ── 학기별 과목 ───────────────────────────── */}
      {semesters.map((sem) => (
        <section key={sem.id} className="mb-14">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-white shadow-sm ${
                  sem.id === "26-2"
                    ? "bg-gradient-to-br from-cyan-500 to-teal-500"
                    : "bg-gray-950 dark:bg-white dark:text-gray-950"
                }`}
              >
                <BookOpen size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{sem.label}</h2>
                <p className="text-xs text-gray-500">{sem.caption}</p>
              </div>
            </div>
            <span className="hidden shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300 sm:inline-flex">
              {sem.subjects.length}과목
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sem.subjects.map((subject) => (
              <SubjectCard key={subject.slug} subject={subject} />
            ))}
          </div>
        </section>
      ))}

      {/* ── 딥스터디 허브 ─────────────────────────── */}
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
          {studyHubs.map((subject) => {
            const Icon = studyHubIconMap[subject.slug] ?? Radio;
            const accent = studyHubAccent[subject.slug];
            return (
              <Link
                key={subject.slug}
                href={subject.studyHubHref!}
                className={`group relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${accent.card}`}
              >
                <Icon size={30} className={`mb-3 ${accent.icon}`} />
                <div
                  className={`mb-1 text-xs font-semibold uppercase tracking-wider ${accent.text}`}
                >
                  {subject.title} · 공통형
                </div>
                <h3 className="text-lg font-bold">{subject.studyHubTitle}</h3>
                <p className="mt-2 text-xs text-gray-500">{subject.studyHubSubtitle}</p>
                <div
                  className={`mt-4 flex items-center gap-1 text-xs font-semibold ${accent.text}`}
                >
                  딥스터디 시작
                  <ArrowRight
                    size={12}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 공식 연습문제 ─────────────────────────── */}
      <section className="mb-14">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <ClipboardCheck size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold">공식 연습문제</h2>
              <p className="text-xs text-gray-500">
                U-KNOU 학습창 연습문제 기반 · 풀이 기록과 오답 복습 연동
              </p>
            </div>
          </div>
          <span className="hidden items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-200 sm:inline-flex">
            <Sparkles size={12} /> 195문항
          </span>
        </div>

        <Link
          href="/official-exercises"
          className="group block rounded-xl border border-blue-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-blue-900/60 dark:bg-gray-900"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-300">
                2026-1학기 6과목
              </div>
              <h3 className="text-xl font-bold">연습문제 풀이 문제집</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                정보통신망, Java프로그래밍, 인공지능 공식 연습문제를 과목·강의·유형별로
                필터링하고 선택 기록, 정답 확인, 북마크, 마이페이지 오답 복습까지 이어서
                진행합니다.
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">
              문제집 열기
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </div>
        </Link>
      </section>

      {/* ── 기출분석 ──────────────────────────────── */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-950 text-white dark:bg-white dark:text-gray-950">
            <ClipboardCheck size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold">기출분석 풀이</h2>
            <p className="text-xs text-gray-500">과목별 기출 워크북과 오답 복습</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pastExams.map((subject) => {
            const Icon = iconMap[subject.icon];
            return (
              <Link
                key={subject.slug}
                href={subject.pastExamHref!}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <Icon size={28} className={`mb-3 ${subject.iconClass}`} />
                <h3 className="text-lg font-bold">{subject.title} 기출분석</h3>
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  {subject.pastExamSubtitle}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                  풀이 시작
                  <ArrowRight
                    size={12}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
