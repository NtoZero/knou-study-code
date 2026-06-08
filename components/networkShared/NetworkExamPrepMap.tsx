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
import { lectures } from "@/lib/constants";
import {
  networkExamPrepLessons,
  networkLectureExamHighlights,
  networkPastExamFocus,
  type NetworkExamPrepLesson,
  type NetworkExamPrepTrack,
} from "./examData";

const trackOrder: NetworkExamPrepTrack[] = [
  "통신 기초",
  "전송 기술",
  "망 구조",
  "TCP/IP",
  "LAN",
  "보안",
  "신기술",
];

const trackStyles: Record<NetworkExamPrepTrack, string> = {
  "통신 기초": "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-100",
  "전송 기술": "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
  "망 구조": "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-100",
  "TCP/IP": "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100",
  "LAN": "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100",
  "보안": "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
  "신기술": "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
};

function heatClass(score: number, active: boolean) {
  const ring = active ? " ring-2 ring-gray-950 ring-offset-2 dark:ring-white" : "";

  if (score >= 25) return `border-rose-700 bg-rose-600 text-white${ring}`;
  if (score >= 20) return `border-orange-500 bg-orange-400 text-gray-950${ring}`;
  if (score >= 16) return `border-amber-400 bg-amber-200 text-gray-950${ring}`;
  if (score >= 12) return `border-sky-300 bg-sky-100 text-sky-900${ring}`;
  return `border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300${ring}`;
}

function levelLabel(value: number) {
  if (value >= 5) return "최상";
  if (value >= 4) return "높음";
  if (value >= 3) return "중간";
  return "기초";
}

export default function NetworkExamPrepMap() {
  const [activeId, setActiveId] = useState(7);
  const [track, setTrack] = useState<NetworkExamPrepTrack | "전체">("전체");
  const [done, setDone] = useState<Set<number>>(new Set());

  const lessons = useMemo(
    () =>
      networkExamPrepLessons.map((lesson) => {
        const meta = lectures.find((item) => item.id === lesson.id);
        return {
          ...lesson,
          title: meta?.title ?? `${lesson.id}강`,
          topics: networkLectureExamHighlights[lesson.id] ?? [],
        };
      }),
    [],
  );

  const filteredLessons = lessons.filter((lesson) => track === "전체" || lesson.track === track);
  const activeLesson = lessons.find((lesson) => lesson.id === activeId) ?? lessons[0];
  const highYieldCount = lessons.filter((lesson) => lesson.priority * lesson.frequency >= 20).length;

  function toggleDone(id: number) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className="mb-8 border-y border-gray-200 py-5 dark:border-gray-800">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
            <Target size={14} />
            빈출 개념 지도
          </div>
          <h2 className="text-xl font-bold text-gray-950 dark:text-gray-50">
            강의별 출제형 개념을 세로 흐름으로 점검
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            2015~2019학년도 기말 기출의 반복 신호와 강의 핵심 개념을 함께 압축했습니다.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <Stat value={highYieldCount} label="고빈도" />
          <Stat value={done.size} label="완료" />
          <Stat value={lessons.length} label="강의" />
        </div>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        {networkPastExamFocus.map((item) => (
          <div key={item.title} className="border-l-2 border-blue-500 pl-3">
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.title}</div>
            <p className="mt-1 text-xs leading-5 text-gray-500">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {(["전체", ...trackOrder] as const).map((item) => (
          <button
            key={item}
            onClick={() => setTrack(item)}
            className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
              track === item
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-2">
            {lessons.map((lesson) => {
              const active = lesson.id === activeId;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveId(lesson.id)}
                  title={`${lesson.id}강 ${lesson.title}`}
                  aria-label={`${lesson.id}강 ${lesson.title} 선택`}
                  className={`aspect-square rounded-lg border p-2 text-left transition-transform hover:-translate-y-0.5 ${heatClass(
                    lesson.priority * lesson.frequency,
                    active,
                  )}`}
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

          <div className="space-y-2">
            {filteredLessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setActiveId(lesson.id)}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  lesson.id === activeId
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                    : "border-gray-200 bg-white hover:border-blue-300 dark:border-gray-800 dark:bg-gray-900"
                } ${done.has(lesson.id) ? "opacity-60" : ""}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">
                      {lesson.id}강 {lesson.title}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {lesson.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="h-2 w-14 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${lesson.frequency * 20}%` }}
                    />
                  </div>
                </div>
              </button>
            ))}
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
                <span
                  key={topic}
                  className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
                >
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
                done.has(activeLesson.id) ? "bg-emerald-600 text-white" : "bg-blue-600 text-white"
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

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
      <div className="font-mono text-lg font-bold">{value}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
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
            className={`h-2 flex-1 rounded-full ${idx < value ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-800"}`}
          />
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-500">{levelLabel(value)}</div>
    </div>
  );
}
