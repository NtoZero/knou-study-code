"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3, BookOpenCheck, CheckCircle2, Layers3, Target } from "lucide-react";
import { aiLectures } from "@/lib/constants";
import { aiPastExamQuestions } from "./data";

type Track = "기초·탐색" | "지식·논리" | "시각·패턴" | "학습" | "신경망";

const trackByLecture = (lectureId: number): Track => {
  if (lectureId <= 3) return "기초·탐색";
  if (lectureId <= 7) return "지식·논리";
  if (lectureId <= 9) return "시각·패턴";
  if (lectureId <= 12) return "학습";
  return "신경망";
};

const trackStyles: Record<Track, string> = {
  "기초·탐색": "border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-100",
  "지식·논리": "border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-100",
  "시각·패턴": "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100",
  "학습": "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100",
  "신경망": "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800 dark:border-fuchsia-900 dark:bg-fuchsia-950/30 dark:text-fuchsia-100",
};

function heatClass(count: number, active: boolean) {
  const ring = active ? " ring-2 ring-gray-950 ring-offset-2 dark:ring-white" : "";
  if (count >= 20) return `border-fuchsia-700 bg-fuchsia-600 text-white${ring}`;
  if (count >= 14) return `border-indigo-600 bg-indigo-500 text-white${ring}`;
  if (count >= 8) return `border-cyan-400 bg-cyan-200 text-cyan-950${ring}`;
  if (count > 0) return `border-gray-300 bg-gray-100 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100${ring}`;
  return `border-gray-200 bg-white text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-500${ring}`;
}

export default function AIExamPrepMap() {
  const [activeId, setActiveId] = useState(10);

  const lectureStats = useMemo(
    () =>
      aiLectures.map((lecture) => {
        const questions = aiPastExamQuestions.filter((question) =>
          question.lectureRefs.some((ref) => ref.lectureId === lecture.id)
        );
        const conceptCounts = questions.reduce<Record<string, number>>((acc, question) => {
          const concept = question.lectureRefs.find((ref) => ref.lectureId === lecture.id)?.concept;
          if (concept) acc[concept] = (acc[concept] ?? 0) + 1;
          return acc;
        }, {});
        const topConcepts = Object.entries(conceptCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([concept, count]) => `${concept} ${count}`);

        return {
          ...lecture,
          questions,
          count: questions.length,
          track: trackByLecture(lecture.id),
          topConcepts,
        };
      }),
    []
  );

  const active = lectureStats.find((item) => item.id === activeId) ?? lectureStats[0];
  const coveredLectures = lectureStats.filter((item) => item.count > 0).length;
  const highYield = lectureStats.filter((item) => item.count >= 10).length;
  const topQuestions = aiPastExamQuestions.length;

  return (
    <section className="mb-8 rounded-xl border border-indigo-200 bg-white p-5 shadow-sm dark:border-indigo-900 dark:bg-gray-950">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold text-white">
            <Target size={14} />
            빈출 개념 지도
          </div>
          <h2 className="text-xl font-bold text-gray-950 dark:text-gray-50">
            2017~2019 기출을 강의별로 압축
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            진한 강의는 실제 기출 연결 문항이 많은 영역입니다. 강의별 개념과 문제집을 같은 흐름으로 확인합니다.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
            <div className="font-mono text-lg font-bold">{topQuestions}</div>
            <div className="text-gray-500">문항</div>
          </div>
          <div className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
            <div className="font-mono text-lg font-bold">{coveredLectures}</div>
            <div className="text-gray-500">강의</div>
          </div>
          <div className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
            <div className="font-mono text-lg font-bold">{highYield}</div>
            <div className="text-gray-500">고빈도</div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-2">
            {lectureStats.map((lecture) => (
              <button
                key={lecture.id}
                type="button"
                onClick={() => setActiveId(lecture.id)}
                title={`${lecture.id}강 ${lecture.title}: ${lecture.count}문항`}
                className={`aspect-square rounded-lg border p-2 text-left transition-transform hover:-translate-y-0.5 ${heatClass(lecture.count, lecture.id === activeId)}`}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="font-mono text-base font-black">{lecture.id}</span>
                  {lecture.count > 0 && <CheckCircle2 size={15} />}
                </div>
                <div className="mt-2 text-[11px] font-semibold leading-4">
                  {lecture.count}문항
                </div>
              </button>
            ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {lectureStats
              .filter((lecture) => lecture.count > 0)
              .map((lecture) => (
                <button
                  key={`row-${lecture.id}`}
                  type="button"
                  onClick={() => setActiveId(lecture.id)}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    activeId === lecture.id
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                      : "border-gray-200 bg-white hover:border-indigo-300 dark:border-gray-800 dark:bg-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold">
                        {lecture.id}강 {lecture.title}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">{lecture.track}</div>
                    </div>
                    <div className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-300">
                      {lecture.count}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${trackStyles[active.track]}`}>
              {active.track}
            </span>
            <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-950 dark:text-gray-300">
              {active.count}문항 연결
            </span>
          </div>

          <h3 className="text-lg font-black text-gray-950 dark:text-gray-50">
            {active.id}강 {active.title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-gray-500">{active.subtitle}</p>

          <div className="mt-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold">
              <Layers3 size={16} />
              반복 개념
            </div>
            <div className="flex flex-wrap gap-2">
              {(active.topConcepts.length > 0 ? active.topConcepts : ["기출 연결 문항 없음"]).map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={`/ai/lecture/${active.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <BookOpenCheck size={16} />
              강의 복습
            </Link>
            <Link
              href="/ai/past-exam"
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:bg-gray-950 dark:text-indigo-200 dark:hover:bg-indigo-950/40"
            >
              <BarChart3 size={16} />
              기출분석
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
