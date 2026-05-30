"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  CheckCircle2,
  Flame,
  Layers3,
  RotateCcw,
  Target,
  TrendingUp,
} from "lucide-react";
import { securityLectures } from "@/lib/constants";
import {
  securityExamPrepLessons,
  securityLectureExamHighlights,
  securityPastExamFocus,
  type SecurityExamPrepLesson,
} from "./examData";

const trackStyles: Record<SecurityExamPrepLesson["track"], string> = {
  "기초": "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-200 dark:border-sky-900",
  "공격·서버": "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-200 dark:border-rose-900",
  "네트워크·시스템": "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-200 dark:border-violet-900",
  "응용·포렌식": "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-200 dark:border-emerald-900",
  "후반 암호": "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-900",
  "키관리": "bg-lime-50 text-lime-800 border-lime-200 dark:bg-lime-950/30 dark:text-lime-200 dark:border-lime-900",
};

const trackOrder: Array<SecurityExamPrepLesson["track"]> = [
  "기초",
  "공격·서버",
  "네트워크·시스템",
  "응용·포렌식",
  "후반 암호",
  "키관리",
];

function heatClass(score: number, active: boolean) {
  const ring = active ? " ring-2 ring-gray-950 ring-offset-2 dark:ring-white" : "";

  if (score >= 20) return `border-rose-700 bg-rose-600 text-white${ring}`;
  if (score >= 16) return `border-orange-500 bg-orange-400 text-gray-950${ring}`;
  if (score >= 12) return `border-amber-400 bg-amber-200 text-gray-900${ring}`;
  if (score >= 8) return `border-sky-300 bg-sky-100 text-sky-900${ring}`;
  return `border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300${ring}`;
}

function levelLabel(value: number) {
  if (value >= 5) return "최상";
  if (value >= 4) return "높음";
  if (value >= 3) return "중간";
  if (value >= 2) return "보강";
  return "기초";
}

export default function SecurityExamPrepMap() {
  const [activeId, setActiveId] = useState(9);
  const [track, setTrack] = useState<SecurityExamPrepLesson["track"] | "전체">("전체");
  const [done, setDone] = useState<Set<number>>(new Set());

  const lessons = useMemo(
    () =>
      securityExamPrepLessons.map((lesson) => {
        const meta = securityLectures.find((item) => item.id === lesson.id);
        return {
          ...lesson,
          title: meta?.title ?? `${lesson.id}강`,
          topics: securityLectureExamHighlights[lesson.id] ?? [],
        };
      }),
    []
  );

  const filteredLessons = lessons.filter((lesson) => track === "전체" || lesson.track === track);
  const activeLesson = lessons.find((lesson) => lesson.id === activeId) ?? lessons[0];
  const highYieldCount = lessons.filter((lesson) => lesson.priority * lesson.frequency >= 16).length;
  const completedCount = done.size;

  function toggleDone(id: number) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className="mb-8 border-y border-gray-200 py-6 dark:border-gray-800">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 dark:bg-purple-950/40 dark:text-purple-200">
            <Target size={14} />
            기출 지형도
          </div>
          <h2 className="text-xl font-bold text-gray-950 dark:text-gray-50">
            반복 출제 흐름을 15강 히트맵으로 확인
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            색이 진한 강의부터 선택해 키워드와 대비 액션을 확인합니다.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
            <div className="font-mono text-lg font-bold">{highYieldCount}</div>
            <div className="text-gray-500">고빈도</div>
          </div>
          <div className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
            <div className="font-mono text-lg font-bold">{completedCount}</div>
            <div className="text-gray-500">완료</div>
          </div>
          <div className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
            <div className="font-mono text-lg font-bold">15</div>
            <div className="text-gray-500">강의</div>
          </div>
        </div>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {securityPastExamFocus.map((item) => (
          <div key={item.title} className="border-l-2 border-purple-500 pl-3">
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.title}</div>
            <p className="mt-1 text-xs leading-5 text-gray-500">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {(["전체", ...trackOrder] as const).map((item) => (
          <button
            key={item}
            onClick={() => setTrack(item)}
            className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
              track === item
                ? "border-purple-600 bg-purple-600 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-purple-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-2">
            {lessons.map((lesson) => {
              const score = lesson.priority * lesson.frequency;
              const active = lesson.id === activeId;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveId(lesson.id)}
                  title={`${lesson.id}강 ${lesson.title}: 우선도 ${lesson.priority}, 반복도 ${lesson.frequency}`}
                  aria-label={`${lesson.id}강 ${lesson.title} 선택`}
                  className={`aspect-square rounded-lg border p-2 text-left transition-transform hover:-translate-y-0.5 ${heatClass(score, active)}`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-mono text-base font-black">{lesson.id}</span>
                    {done.has(lesson.id) && <CheckCircle2 size={15} />}
                  </div>
                  <div className="mt-2 hidden text-[11px] font-semibold leading-4 sm:block">
                    {levelLabel(lesson.frequency)}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {filteredLessons.map((lesson) => {
              const active = lesson.id === activeId;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveId(lesson.id)}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    active
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30"
                      : "border-gray-200 bg-white hover:border-purple-300 dark:border-gray-800 dark:bg-gray-900"
                  } ${done.has(lesson.id) ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold">
                        {lesson.id}강 {lesson.title}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {lesson.topics.slice(0, 2).map((topic) => (
                          <span key={topic} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="h-2 w-14 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full bg-purple-500"
                        style={{ width: `${lesson.frequency * 20}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${trackStyles[activeLesson.track]}`}>
              {activeLesson.track}
            </span>
            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {activeLesson.range}
            </span>
          </div>

          <h3 className="text-lg font-black text-gray-950 dark:text-gray-50">
            {activeLesson.id}강 {activeLesson.title}
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Metric icon={<Flame size={16} />} label="우선도" value={activeLesson.priority} />
            <Metric icon={<TrendingUp size={16} />} label="반복도" value={activeLesson.frequency} />
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold">
              <Layers3 size={16} />
              핵심 키워드
            </div>
            <div className="flex flex-wrap gap-2">
              {activeLesson.topics.map((topic) => (
                <span key={topic} className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-gray-50 p-4 dark:bg-gray-950/50">
            <div className="mb-1 text-sm font-bold">대비 액션</div>
            <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
              {activeLesson.action}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => toggleDone(activeLesson.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
                done.has(activeLesson.id)
                  ? "bg-emerald-600 text-white"
                  : "bg-purple-600 text-white"
              }`}
            >
              <CheckCircle2 size={16} />
              {done.has(activeLesson.id) ? "완료됨" : "대비 완료"}
            </button>
            <button
              onClick={() => setDone(new Set())}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-300"
            >
              <RotateCcw size={15} />
              초기화
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold text-gray-500">
        {icon}
        {label}
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, idx) => (
          <span
            key={idx}
            className={`h-2 flex-1 rounded-full ${idx < value ? "bg-purple-500" : "bg-gray-200 dark:bg-gray-800"}`}
          />
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-500">{levelLabel(value)}</div>
    </div>
  );
}
