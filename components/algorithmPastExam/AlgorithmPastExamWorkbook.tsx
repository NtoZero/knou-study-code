"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, BookOpenCheck, Filter, RotateCcw } from "lucide-react";
import PastExamModeDock from "@/components/pastExam/PastExamModeDock";
import { algorithmChapterWeights, type AlgorithmChapterId } from "@/lib/algorithmCourse";
import { algorithmPastExamQuestions, algorithmPastExamYears } from "./data";
import PastExamQuestionCard from "./PastExamQuestionCard";
import type { ChoiceKey } from "./types";

type StatusFilter = "all" | "unanswered" | "revealed" | "correct" | "wrong";

function parsePastExamYear(value: string | null) {
  const candidate = Number(value);
  return algorithmPastExamYears.includes(candidate as 2017 | 2018 | 2019)
    ? (candidate as 2017 | 2018 | 2019)
    : null;
}

export default function AlgorithmPastExamWorkbook() {
  const pendingHashRef = useRef<string | null>(null);
  const [year, setYear] = useState<2017 | 2018 | 2019>(2019);
  const [chapterId, setChapterId] = useState<AlgorithmChapterId | "all">("all");
  const [lectureId, setLectureId] = useState<number | "all">("all");
  const [conceptTag, setConceptTag] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [reviewScope, setReviewScope] = useState<"visible" | "year">("visible");
  const [selected, setSelected] = useState<Record<string, ChoiceKey>>({});
  const [answerRevealed, setAnswerRevealed] = useState<Record<string, boolean>>({});
  const [explanationExpanded, setExplanationExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linkedYear = parsePastExamYear(params.get("year"));
    const parsed = Number(params.get("chapter"));
    pendingHashRef.current = window.location.hash ? window.location.hash.slice(1) : null;

    if (linkedYear) {
      setYear(linkedYear);
    }

    if ([1, 2, 3, 4, 5, 6, 7].includes(parsed)) {
      setChapterId(parsed as AlgorithmChapterId);
      setLectureId("all");
    }
  }, []);

  const yearQuestions = useMemo(
    () => algorithmPastExamQuestions.filter((question) => question.year === year),
    [year],
  );

  const chapterLectureMap = useMemo(() => {
    return new Map(algorithmChapterWeights.map((chapter) => [chapter.chapter, new Set<number>(chapter.lectures)]));
  }, []);

  const lectureOptions = useMemo(() => {
    const ids = new Set<number>();
    yearQuestions.forEach((question) => {
      question.lectureRefs.forEach((ref) => ids.add(ref.lectureId));
    });
    const allIds = Array.from(ids).sort((a, b) => a - b);
    if (chapterId === "all") return allIds;
    const chapterLectureIds = chapterLectureMap.get(chapterId);
    return allIds.filter((id) => chapterLectureIds?.has(id));
  }, [chapterId, chapterLectureMap, yearQuestions]);

  const scopedQuestions = useMemo(() => {
    return yearQuestions.filter((question) => {
      if (chapterId !== "all") {
        const chapterLectureIds = chapterLectureMap.get(chapterId);
        if (!question.lectureRefs.some((ref) => chapterLectureIds?.has(ref.lectureId))) {
          return false;
        }
      }

      if (lectureId !== "all" && !question.lectureRefs.some((ref) => ref.lectureId === lectureId)) {
        return false;
      }

      return true;
    });
  }, [chapterId, chapterLectureMap, yearQuestions, lectureId]);

  const conceptOptions = useMemo(() => {
    const counts = new Map<string, number>();
    scopedQuestions.forEach((question) => {
      question.conceptTags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
    });
    return Array.from(counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ko"))
      .map(([tag, count]) => ({ tag, count }));
  }, [scopedQuestions]);

  useEffect(() => {
    if (conceptTag !== "all" && !conceptOptions.some((item) => item.tag === conceptTag)) {
      setConceptTag("all");
    }
  }, [conceptOptions, conceptTag]);

  const filteredQuestions = useMemo(() => {
    return scopedQuestions.filter((question) => {
      if (conceptTag !== "all" && !question.conceptTags.includes(conceptTag)) {
        return false;
      }

      const isRevealed = Boolean(answerRevealed[question.id]);
      const chosen = selected[question.id];
      const isCorrect = chosen === question.correctChoice;

      if (status === "unanswered") return !chosen;
      if (status === "revealed") return isRevealed;
      if (status === "correct") return isRevealed && isCorrect;
      if (status === "wrong") return isRevealed && Boolean(chosen) && !isCorrect;
      return true;
    });
  }, [scopedQuestions, conceptTag, status, selected, answerRevealed]);

  useEffect(() => {
    const targetId = pendingHashRef.current;
    if (!targetId) return;

    const timer = window.setTimeout(() => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ block: "start" });
        pendingHashRef.current = null;
      }
    }, 120);

    return () => window.clearTimeout(timer);
  }, [year, filteredQuestions.length]);

  const answeredCount = yearQuestions.filter((question) => selected[question.id]).length;
  const answerRevealedCount = yearQuestions.filter((question) => answerRevealed[question.id]).length;
  const visibleAnswerRevealedCount = filteredQuestions.filter((question) => answerRevealed[question.id]).length;
  const explanationExpandedCount = yearQuestions.filter((question) => explanationExpanded[question.id]).length;
  const visibleExplanationExpandedCount = filteredQuestions.filter((question) => explanationExpanded[question.id]).length;
  const correctCount = yearQuestions.filter((question) => answerRevealed[question.id] && selected[question.id] === question.correctChoice).length;
  const wrongCount = yearQuestions.filter((question) => answerRevealed[question.id] && selected[question.id] && selected[question.id] !== question.correctChoice).length;
  const modeScopeQuestions = reviewScope === "visible" ? filteredQuestions : yearQuestions;

  function selectChoice(questionId: string, choice: ChoiceKey) {
    setSelected((prev) => ({ ...prev, [questionId]: choice }));
  }

  function toggleAnswer(questionId: string) {
    const nextVisible = !answerRevealed[questionId];
    setAnswerRevealed((prev) => ({ ...prev, [questionId]: nextVisible }));
    if (!nextVisible) {
      setExplanationExpanded((prev) => ({ ...prev, [questionId]: false }));
    }
  }

  function toggleExplanation(questionId: string) {
    setAnswerRevealed((prev) => ({ ...prev, [questionId]: true }));
    setExplanationExpanded((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  }

  function setAnswerVisibilityForQuestions(questions: typeof yearQuestions, value: boolean) {
    setAnswerRevealed((prev) => {
      const next = { ...prev };
      questions.forEach((question) => {
        next[question.id] = value;
      });
      return next;
    });

    if (!value) {
      setExplanationExpanded((prev) => {
        const next = { ...prev };
        questions.forEach((question) => {
          next[question.id] = false;
        });
        return next;
      });
    }
  }

  function setExplanationForQuestions(questions: typeof yearQuestions, value: boolean) {
    if (value) {
      setAnswerRevealed((prev) => {
        const next = { ...prev };
        questions.forEach((question) => {
          next[question.id] = true;
        });
        return next;
      });
    }

    setExplanationExpanded((prev) => {
      const next = { ...prev };
      questions.forEach((question) => {
        next[question.id] = value;
      });
      return next;
    });
  }

  function resetYear() {
    const ids = new Set(yearQuestions.map((question) => question.id));
    setSelected((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
    setAnswerRevealed((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
    setExplanationExpanded((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:pt-10 lg:pb-10">
      <header className="mb-8 rounded-xl border border-cyan-200 bg-white p-5 shadow-sm dark:border-cyan-900 dark:bg-slate-950 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-100">
              <BookOpenCheck size={14} />
              2017-2019 기말
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">알고리즘 기출분석</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              2017~2019학년도 알고리즘 기말 105문항을 직접 풀고, 정답 확인 후 강의 개념 기준 해설로 복습합니다.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-2 text-sm sm:grid-cols-4 lg:min-w-[440px]">
            <ProgressBox label="선택" value={`${answeredCount}/35`} tone="cyan" />
            <ProgressBox label="확인" value={`${answerRevealedCount}/35`} tone="amber" />
            <ProgressBox label="맞힘" value={`${correctCount}`} tone="emerald" />
            <ProgressBox label="재검토" value={`${wrongCount}`} tone="rose" />
          </div>
        </div>
      </header>

      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
          <Filter size={16} />
          필터
        </div>
        <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_auto]">
          <div className="flex flex-wrap gap-2">
            {algorithmPastExamYears.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setYear(item)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  year === item
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {item}년
              </button>
            ))}
          </div>

          <select
            value={chapterId}
            onChange={(event) => {
              setChapterId(event.target.value === "all" ? "all" : Number(event.target.value) as AlgorithmChapterId);
              setLectureId("all");
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="all">전체 장</option>
            {algorithmChapterWeights.map((chapter) => (
              <option key={chapter.chapter} value={chapter.chapter}>
                {chapter.chapter}장 {chapter.title}
              </option>
            ))}
          </select>

          <select
            value={lectureId}
            onChange={(event) => setLectureId(event.target.value === "all" ? "all" : Number(event.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
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
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="all">전체 상태</option>
            <option value="unanswered">미풀이</option>
            <option value="revealed">정답 확인</option>
            <option value="correct">맞힌 문제</option>
            <option value="wrong">다시 볼 문제</option>
          </select>

          <select
            value={conceptTag}
            onChange={(event) => setConceptTag(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="all">전체 개념</option>
            {conceptOptions.map(({ tag, count }) => (
              <option key={tag} value={tag}>
                {tag} {count}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={resetYear}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RotateCcw size={15} />
            초기화
          </button>
        </div>
      </section>

      <PastExamModeDock
        tone="cyan"
        scope={reviewScope}
        visibleCount={filteredQuestions.length}
        totalCount={yearQuestions.length}
        answeredCount={answeredCount}
        answerRevealedCount={answerRevealedCount}
        explanationExpandedCount={explanationExpandedCount}
        correctCount={correctCount}
        wrongCount={wrongCount}
        visibleAnswerRevealedCount={visibleAnswerRevealedCount}
        visibleExplanationExpandedCount={visibleExplanationExpandedCount}
        onScopeChange={setReviewScope}
        onRevealAnswers={() => setAnswerVisibilityForQuestions(modeScopeQuestions, true)}
        onHideAnswers={() => setAnswerVisibilityForQuestions(modeScopeQuestions, false)}
        onExpandExplanations={() => setExplanationForQuestions(modeScopeQuestions, true)}
        onCollapseExplanations={() => setExplanationForQuestions(modeScopeQuestions, false)}
        onResetProgress={resetYear}
      />

      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-3">
          <h2 className="text-lg font-bold">{year}학년도 기말 {filteredQuestions.length}문항</h2>
          <p className="mt-1 text-sm text-slate-500">정답 공개 전에는 정오답을 표시하지 않습니다.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {filteredQuestions.map((question) => (
            <a
              key={`jump-${question.id}`}
              href={`#${question.id}`}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold transition-colors ${
                answerRevealed[question.id]
                  ? selected[question.id] === question.correctChoice
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-100"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-100"
                  : selected[question.id]
                    ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-100"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
              }`}
            >
              {question.number}
            </a>
          ))}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-5">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question) => (
              <PastExamQuestionCard
                key={question.id}
                question={question}
                selected={selected[question.id]}
                answerRevealed={Boolean(answerRevealed[question.id])}
                explanationExpanded={Boolean(explanationExpanded[question.id])}
                onSelect={selectChoice}
                onToggleAnswer={toggleAnswer}
                onToggleExplanation={toggleExplanation}
              />
            ))
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
              <div className="font-bold">조건에 맞는 문항이 없습니다.</div>
              <p className="mt-1">장, 강의, 풀이 상태 필터를 넓히면 문항 목록이 다시 표시됩니다.</p>
              <button
                type="button"
                onClick={() => {
                  setChapterId("all");
                  setLectureId("all");
                  setConceptTag("all");
                  setStatus("all");
                }}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-900 px-3 py-2 font-semibold text-white transition-colors hover:bg-amber-800 dark:bg-amber-200 dark:text-amber-950 dark:hover:bg-amber-100"
              >
                <RotateCcw size={15} />
                필터 초기화
              </button>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 lg:sticky lg:top-16">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold">
            <BarChart3 size={16} />
            복습 요약
          </div>
          <div className="space-y-3 text-sm">
            <SummaryLine label="풀이한 문항" value={`${answeredCount} / 35`} />
            <SummaryLine label="정답 확인" value={`${answerRevealedCount} / 35`} />
            <SummaryLine label="맞힌 문항" value={`${correctCount}`} />
            <SummaryLine label="다시 볼 문항" value={`${wrongCount}`} />
          </div>
          <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div className="mb-2 text-xs font-bold text-slate-500">강의별 확인 문항</div>
            <div className="flex flex-wrap gap-2">
              {lectureOptions.map((id) => {
                const count = yearQuestions.filter((question) => question.lectureRefs.some((ref) => ref.lectureId === id)).length;
                return (
                  <button
                    key={`lecture-summary-${id}`}
                    type="button"
                    onClick={() => setLectureId(id)}
                    className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
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

function ProgressBox({ label, value, tone }: { label: string; value: string; tone: "cyan" | "amber" | "emerald" | "rose" }) {
  const styles = {
    cyan: "bg-cyan-50 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-100",
    amber: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-100",
    emerald: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
    rose: "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-100",
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
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-bold text-slate-950 dark:text-white">{value}</span>
    </div>
  );
}
