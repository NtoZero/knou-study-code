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
  ArrowRight,
  Sparkles,
  Target,
} from "lucide-react";

const studyHubs = [
  {
    href: "/study-hub/network",
    eyebrow: "정보통신망 · 공통형",
    title: "HAC 정의와 미래 전략",
    subtitle: "Shannon-Weaver · Human-AI Communication · 블랙박스 대응",
    Icon: Radio,
    className:
      "border-orange-200 bg-gradient-to-br from-orange-50 to-white dark:border-orange-900/50 dark:from-orange-950/40 dark:to-gray-900",
    iconClass: "text-orange-500",
    textClass: "text-orange-600",
  },
  {
    href: "/study-hub/software",
    eyebrow: "소프트웨어공학 · 공통형",
    title: "PE/IDP · CPM 임계경로",
    subtitle: "Developer Experience · Platform Engineering · Critical Path Method",
    Icon: Layers,
    className:
      "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white dark:border-emerald-900/50 dark:from-emerald-950/40 dark:to-gray-900",
    iconClass: "text-emerald-500",
    textClass: "text-emerald-600",
  },
  {
    href: "/study-hub/ai",
    eyebrow: "인공지능 · 공통형",
    title: "균일비용 탐색 · A* 알고리즘",
    subtitle: "State Space · UCS · A* · 허용성 · 탐색 트리 작성법",
    Icon: Target,
    className:
      "border-indigo-200 bg-gradient-to-br from-indigo-50 to-white dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-gray-900",
    iconClass: "text-indigo-500",
    textClass: "text-indigo-600",
  },
] as const;

const subjects = [
  {
    href: "/network",
    title: "정보통신망",
    subtitle: "1~15강 인터랙티브 시각화",
    Icon: Radio,
    iconClass: "text-blue-500",
  },
  {
    href: "/ai",
    title: "인공지능",
    subtitle: "1~15강 인터랙티브 학습",
    Icon: Brain,
    iconClass: "text-indigo-500",
  },
  {
    href: "/java",
    title: "Java프로그래밍",
    subtitle: "1~15강 기본개념·코드 흐름 학습",
    Icon: Code2,
    iconClass: "text-amber-600",
  },
  {
    href: "/algorithm",
    title: "알고리즘",
    subtitle: "1~15강 알고리즘 학습",
    Icon: Code2,
    iconClass: "text-emerald-500",
  },
  {
    href: "/security",
    title: "컴퓨터보안",
    subtitle: "1~15강 인터랙티브 학습",
    Icon: Shield,
    iconClass: "text-purple-600",
  },
  {
    href: "/software",
    title: "소프트웨어공학",
    subtitle: "1~15강 인터랙티브 학습",
    Icon: Layers,
    iconClass: "text-emerald-600",
  },
] as const;

const pastExams = [
  {
    href: "/network/past-exam",
    title: "정보통신망 기출분석",
    subtitle: "2015~2019 기말 분석과 재구성 문제",
    Icon: Radio,
    iconClass: "text-sky-500",
  },
  {
    href: "/ai/past-exam",
    title: "인공지능 기출분석",
    subtitle: "기출 문항 풀이와 해설 복습",
    Icon: Brain,
    iconClass: "text-indigo-500",
  },
  {
    href: "/algorithm/past-exam",
    title: "알고리즘 기출분석",
    subtitle: "2017~2019 기말 105문항 풀이",
    Icon: Code2,
    iconClass: "text-emerald-500",
  },
  {
    href: "/security/past-exam",
    title: "컴퓨터보안 기출분석",
    subtitle: "객관식 풀이와 오답 복습",
    Icon: Shield,
    iconClass: "text-purple-600",
  },
  {
    href: "/software/past-exam",
    title: "소프트웨어공학 기출분석",
    subtitle: "기출 개념과 정답 근거 정리",
    Icon: Layers,
    iconClass: "text-emerald-600",
  },
] as const;

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-center text-3xl font-bold mb-2">
        KNOU 인터랙티브 학습
      </h1>
      <p className="text-center text-gray-500 mb-12">
        출석과제 해결을 위한 딥스터디부터 강의 시각화와 문제 풀이까지
      </p>

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
          {studyHubs.map(({ href, eyebrow, title, subtitle, Icon, className, iconClass, textClass }) => (
            <Link
              key={href}
              href={href}
              className={`group relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${className}`}
            >
              <Icon size={30} className={`mb-3 ${iconClass}`} />
              <div className={`mb-1 text-xs font-semibold uppercase tracking-wider ${textClass}`}>
                {eyebrow}
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-xs text-gray-500">{subtitle}</p>
              <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${textClass}`}>
                딥스터디 시작
                <ArrowRight
                  size={12}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

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
                정보통신망, Java프로그래밍, 인공지능 공식 연습문제를 과목·강의·유형별로 필터링하고
                선택 기록, 정답 확인, 북마크, 마이페이지 오답 복습까지 이어서 진행합니다.
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

      <section className="mb-14">
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
          {pastExams.map(({ href, title, subtitle, Icon, iconClass }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <Icon size={28} className={`mb-3 ${iconClass}`} />
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-gray-500">{subtitle}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                풀이 시작
                <ArrowRight
                  size={12}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

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
          {subjects.map(({ href, title, subtitle, Icon, iconClass }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <Icon size={36} className={`${iconClass} mb-4`} />
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                열기
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
