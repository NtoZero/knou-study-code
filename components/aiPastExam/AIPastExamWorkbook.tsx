"use client";

import { useMemo, useState } from "react";
import { BarChart3, BookOpenCheck, Filter, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { aiPastExamQuestions, aiPastExamYears } from "./data";
import PastExamQuestionCard from "./PastExamQuestionCard";
import type { ChoiceKey } from "./types";

type StatusFilter = "all" | "unanswered" | "revealed" | "correct" | "wrong";

export default function AIPastExamWorkbook() {
  const [year, setYear] = useState<2017 | 2018 | 2019>(2019);
  const [lectureId, setLectureId] = useState<number | "all">("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [selected, setSelected] = useState<Record<string, ChoiceKey>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const yearQuestions = useMemo(
    () => aiPastExamQuestions.filter((question) => question.year === year),
    [year],
  );

  const lectureOptions = useMemo(() => {
    const ids = new Set<number>();
    yearQuestions.forEach((question) => {
      question.lectureRefs.forEach((ref) => ids.add(ref.lectureId));
    });
    return Array.from(ids).sort((a, b) => a - b);
  }, [yearQuestions]);

  const filteredQuestions = useMemo(() => {
    return yearQuestions.filter((question) => {
      if (lectureId !== "all" && !question.lectureRefs.some((ref) => ref.lectureId === lectureId)) {
        return false;
      }

      const isRevealed = Boolean(revealed[question.id]);
      const chosen = selected[question.id];
      const isCorrect = chosen === question.correctChoice;

      if (status === "unanswered") return !chosen;
      if (status === "revealed") return isRevealed;
      if (status === "correct") return isRevealed && isCorrect;
      if (status === "wrong") return isRevealed && Boolean(chosen) && !isCorrect;
      return true;
    });
  }, [yearQuestions, lectureId, status, selected, revealed]);

  const answeredCount = yearQuestions.filter((question) => selected[question.id]).length;
  const revealedCount = yearQuestions.filter((question) => revealed[question.id]).length;
  const correctCount = yearQuestions.filter((question) => revealed[question.id] && selected[question.id] === question.correctChoice).length;
  const wrongCount = yearQuestions.filter((question) => revealed[question.id] && selected[question.id] && selected[question.id] !== question.correctChoice).length;

  function selectChoice(questionId: string, choice: ChoiceKey) {
    setSelected((prev) => ({ ...prev, [questionId]: choice }));
  }

  function toggleReveal(questionId: string) {
    setRevealed((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  }

  function resetYear() {
    const ids = new Set(yearQuestions.map((question) => question.id));
    setSelected((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
    setRevealed((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <header className="mb-8 rounded-lg border border-indigo-200 bg-white p-5 shadow-sm dark:border-indigo-900 dark:bg-gray-950 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200">
              <BookOpenCheck size={14} />
              2017-2019 기말
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">인공지능 기출분석</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">
              원문 문항을 먼저 풀고, 필요할 때 정답과 강의 개념 기반 해설을 확인합니다.
              각 문항은 관련 강의로 바로 이동할 수 있게 연결했습니다.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-2 text-sm sm:grid-cols-4 lg:min-w-[440px]">
            <ProgressBox label="선택" value={`${answeredCount}/35`} tone="indigo" />
            <ProgressBox label="확인" value={`${revealedCount}/35`} tone="amber" />
            <ProgressBox label="맞힘" value={`${correctCount}`} tone="emerald" />
            <ProgressBox label="재검토" value={`${wrongCount}`} tone="rose" />
          </div>
        </div>
      </header>

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-100">
          <Filter size={16} />
          필터
        </div>
        <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
          <div className="flex flex-wrap gap-2">
            {aiPastExamYears.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setYear(item)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  year === item
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                {item}년
              </button>
            ))}
          </div>

          <select
            value={lectureId}
            onChange={(event) => setLectureId(event.target.value === "all" ? "all" : Number(event.target.value))}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="all">전체 강의</option>
            {lectureOptions.map((id) => (
              <option key={id} value={id}>
                {id}강
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="all">전체 상태</option>
            <option value="unanswered">미풀이</option>
            <option value="revealed">정답 확인</option>
            <option value="correct">맞힌 문제</option>
            <option value="wrong">다시 볼 문제</option>
          </select>

          <button
            type="button"
            onClick={resetYear}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <RotateCcw size={15} />
            초기화
          </button>
        </div>
      </section>

      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <SectionTitle
          title={`${year}학년도 2학기 ${filteredQuestions.length}문항`}
          subtitle="문항은 원문 시험지 기준으로 표시합니다. 정답 공개 전에는 정오답을 표시하지 않습니다."
        />
        <div className="flex flex-wrap gap-2">
          {yearQuestions.map((question) => (
            <a
              key={`jump-${question.id}`}
              href={`#${question.id}`}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold transition-colors ${
                revealed[question.id]
                  ? selected[question.id] === question.correctChoice
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200"
                  : selected[question.id]
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              }`}
            >
              {question.number}
            </a>
          ))}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-5">
          {filteredQuestions.map((question) => (
            <PastExamQuestionCard
              key={question.id}
              question={question}
              selected={selected[question.id]}
              revealed={Boolean(revealed[question.id])}
              onSelect={selectChoice}
              onReveal={toggleReveal}
            />
          ))}
        </div>

        <aside className="h-fit rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 lg:sticky lg:top-16">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold">
            <BarChart3 size={16} />
            복습 요약
          </div>
          <div className="space-y-3 text-sm">
            <SummaryLine label="풀이한 문항" value={`${answeredCount} / 35`} />
            <SummaryLine label="정답 확인" value={`${revealedCount} / 35`} />
            <SummaryLine label="맞힌 문항" value={`${correctCount}`} />
            <SummaryLine label="다시 볼 문항" value={`${wrongCount}`} />
          </div>
          <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
            <div className="mb-2 text-xs font-bold text-gray-500">강의별 확인 문항</div>
            <div className="flex flex-wrap gap-2">
              {lectureOptions.map((id) => {
                const count = yearQuestions.filter((question) => question.lectureRefs.some((ref) => ref.lectureId === id)).length;
                return (
                  <button
                    key={`lecture-summary-${id}`}
                    type="button"
                    onClick={() => setLectureId(id)}
                    className="rounded-full border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    {id}강 {count}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ProgressBox({ label, value, tone }: { label: string; value: string; tone: "indigo" | "amber" | "emerald" | "rose" }) {
  const styles = {
    indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
  };

  return (
    <div className={`rounded-lg p-3 ${styles[tone]}`}>
      <div className="text-xs font-semibold opacity-80">{label}</div>
      <div className="mt-1 text-lg font-bold">{value}</div>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-bold text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}
