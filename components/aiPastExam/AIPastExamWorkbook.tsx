"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, BookOpenCheck, Filter, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { MultiSelectChips, SingleSelectChips } from "@/components/pastExam/PastExamFilterChips";
import PastExamModeDock from "@/components/pastExam/PastExamModeDock";
import { useQuestionProgress } from "@/hooks/useQuestionProgress";
import { pastExamIdentity } from "@/lib/studyProgress/identity";
import { resetQuestionProgressByIds } from "@/lib/studyProgress/service";
import { aiPastExamQuestions, aiPastExamYears } from "./data";
import PastExamQuestionCard from "./PastExamQuestionCard";
import type { ChoiceKey } from "./types";

type StatusFilter = "all" | "unanswered" | "revealed" | "correct" | "wrong";
type AIPastExamYear = (typeof aiPastExamYears)[number];
type ViewOrder = "exam" | "lecture";

export default function AIPastExamWorkbook() {
  const [selectedYears, setSelectedYears] = useState<AIPastExamYear[]>([...aiPastExamYears]);
  const [viewOrder, setViewOrder] = useState<ViewOrder>("exam");
  const [lectureId, setLectureId] = useState<number | "all">("all");
  const [conceptTag, setConceptTag] = useState<string>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [reviewScope, setReviewScope] = useState<"visible" | "year">("visible");
  const [selected, setSelected] = useState<Record<string, ChoiceKey>>({});
  const [answerRevealed, setAnswerRevealed] = useState<Record<string, boolean>>({});
  const [explanationExpanded, setExplanationExpanded] = useState<Record<string, boolean>>({});
  const questionIdentities = useMemo(
    () =>
      aiPastExamQuestions.map((question) =>
        pastExamIdentity({
          question,
          subjectSlug: "ai",
          subjectLabel: "인공지능",
          basePath: "/ai/past-exam",
        }),
      ),
    [],
  );
  const identityById = useMemo(
    () => new Map(questionIdentities.map((identity) => [identity.questionId, identity])),
    [questionIdentities],
  );
  const questionById = useMemo(
    () => new Map(aiPastExamQuestions.map((question) => [question.id, question])),
    [],
  );
  const { progressById, recordAttempt, ensureIdentity, patchProgress, reload } =
    useQuestionProgress(questionIdentities);

  useEffect(() => {
    setSelected((prev) => {
      const next = { ...prev };
      Object.values(progressById).forEach((progress) => {
        if (progress.latestChoice) next[progress.questionId] = progress.latestChoice as ChoiceKey;
      });
      return next;
    });
    setAnswerRevealed((prev) => {
      const next = { ...prev };
      Object.values(progressById).forEach((progress) => {
        if (progress.answerRevealed) next[progress.questionId] = true;
      });
      return next;
    });
    setExplanationExpanded((prev) => {
      const next = { ...prev };
      Object.values(progressById).forEach((progress) => {
        if (progress.explanationViewed) next[progress.questionId] = true;
      });
      return next;
    });
  }, [progressById]);

  const yearQuestions = useMemo(
    () => aiPastExamQuestions.filter((question) => selectedYears.includes(question.year as AIPastExamYear)),
    [selectedYears],
  );
  const yearOrder = useMemo(
    () => new Map(aiPastExamYears.map((item, index) => [item, index])),
    [],
  );
  const selectedYearLabel = useMemo(() => {
    if (selectedYears.length === aiPastExamYears.length) return "2017-2019";
    return [...selectedYears].sort((a, b) => a - b).map((item) => `${item}`).join(", ");
  }, [selectedYears]);

  const lectureOptions = useMemo(() => {
    const ids = new Set<number>();
    yearQuestions.forEach((question) => {
      question.lectureRefs.forEach((ref) => ids.add(ref.lectureId));
    });
    return Array.from(ids).sort((a, b) => a - b);
  }, [yearQuestions]);

  const conceptOptions = useMemo(() => {
    const tags = new Set<string>();
    yearQuestions.forEach((question) => {
      question.conceptTags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort((a, b) => a.localeCompare(b, "ko"));
  }, [yearQuestions]);

  const filteredQuestions = useMemo(() => {
    return yearQuestions.filter((question) => {
      if (lectureId !== "all" && !question.lectureRefs.some((ref) => ref.lectureId === lectureId)) {
        return false;
      }
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
    }).sort((a, b) => {
      if (viewOrder === "lecture") {
        const lectureDelta = (a.lectureRefs[0]?.lectureId ?? 999) - (b.lectureRefs[0]?.lectureId ?? 999);
        if (lectureDelta !== 0) return lectureDelta;
      }
      return (yearOrder.get(a.year as AIPastExamYear) ?? 999) - (yearOrder.get(b.year as AIPastExamYear) ?? 999) || a.number - b.number;
    });
  }, [yearQuestions, lectureId, conceptTag, status, selected, answerRevealed, viewOrder, yearOrder]);

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
    const identity = identityById.get(questionId);
    const question = questionById.get(questionId);
    if (!identity || !question) return;
    void recordAttempt({
      ...identity,
      selectedChoice: choice,
      isCorrect: choice === question.correctChoice,
      mode: "practice",
    });
  }

  function toggleAnswer(questionId: string) {
    const nextVisible = !answerRevealed[questionId];
    setAnswerRevealed((prev) => ({ ...prev, [questionId]: nextVisible }));
    if (!nextVisible) {
      setExplanationExpanded((prev) => ({ ...prev, [questionId]: false }));
    }
    const identity = identityById.get(questionId);
    if (!identity) return;
    void ensureIdentity(identity).then(() =>
      patchProgress(questionId, {
        answerRevealed: nextVisible,
        explanationViewed: nextVisible ? progressById[questionId]?.explanationViewed ?? false : false,
        lastReviewedAt: nextVisible ? new Date().toISOString() : progressById[questionId]?.lastReviewedAt,
      }),
    );
  }

  function toggleExplanation(questionId: string) {
    const nextExpanded = !explanationExpanded[questionId];
    setAnswerRevealed((prev) => ({ ...prev, [questionId]: true }));
    setExplanationExpanded((prev) => ({ ...prev, [questionId]: nextExpanded }));
    const identity = identityById.get(questionId);
    if (!identity) return;
    void ensureIdentity(identity).then(() =>
      patchProgress(questionId, {
        answerRevealed: true,
        explanationViewed: nextExpanded,
        lastReviewedAt: new Date().toISOString(),
      }),
    );
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
    questions.forEach((question) => {
      const identity = identityById.get(question.id);
      if (!identity) return;
      void ensureIdentity(identity).then(() =>
        patchProgress(question.id, {
          answerRevealed: value,
          explanationViewed: value ? progressById[question.id]?.explanationViewed ?? false : false,
          lastReviewedAt: value ? new Date().toISOString() : progressById[question.id]?.lastReviewedAt,
        }),
      );
    });
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
    questions.forEach((question) => {
      const identity = identityById.get(question.id);
      if (!identity) return;
      void ensureIdentity(identity).then(() =>
        patchProgress(question.id, {
          answerRevealed: value ? true : progressById[question.id]?.answerRevealed ?? false,
          explanationViewed: value,
          lastReviewedAt: value ? new Date().toISOString() : progressById[question.id]?.lastReviewedAt,
        }),
      );
    });
  }

  async function resetYear() {
    const ids = new Set(yearQuestions.map((question) => question.id));
    setSelected((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
    setAnswerRevealed((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
    setExplanationExpanded((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
    await resetQuestionProgressByIds(Array.from(ids));
    await reload();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:pt-10 lg:pb-10">
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
            <ProgressBox label="선택" value={`${answeredCount}/${yearQuestions.length}`} tone="indigo" />
            <ProgressBox label="확인" value={`${answerRevealedCount}/${yearQuestions.length}`} tone="amber" />
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
        <div className="grid gap-3 xl:grid-cols-[1.2fr_1fr_0.8fr_0.9fr_0.9fr_auto]">
          <MultiSelectChips
            label="연도"
            options={aiPastExamYears}
            selected={selectedYears}
            tone="indigo"
            allLabel="전체 연도"
            getLabel={(item) => `${item}년`}
            onChange={setSelectedYears}
          />

          <SingleSelectChips
            label="보기"
            tone="indigo"
            value={viewOrder}
            onChange={setViewOrder}
            options={[
              { value: "exam", label: "시험지순" },
              { value: "lecture", label: "강의순" },
            ]}
          />

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
            value={conceptTag}
            onChange={(event) => setConceptTag(event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="all">전체 개념</option>
            {conceptOptions.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
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
            onClick={() => void resetYear()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <RotateCcw size={15} />
            초기화
          </button>
        </div>
      </section>

      <PastExamModeDock
        tone="indigo"
        scope={reviewScope}
        totalScopeLabel="선택 연도"
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
        onResetProgress={() => void resetYear()}
      />

      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <SectionTitle
          title={`${selectedYearLabel}학년도 2학기 ${filteredQuestions.length}문항`}
          subtitle={viewOrder === "lecture" ? "문항은 강의 순서 기준으로 표시합니다. 정답 공개 전에는 정오답을 표시하지 않습니다." : "문항은 원문 시험지 기준으로 표시합니다. 정답 공개 전에는 정오답을 표시하지 않습니다."}
        />
        <div className="flex flex-wrap gap-2">
          {yearQuestions.map((question) => (
            <a
              key={`jump-${question.id}`}
              href={`#${question.id}`}
              className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-bold transition-colors ${
                answerRevealed[question.id]
                  ? selected[question.id] === question.correctChoice
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200"
                  : selected[question.id]
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              }`}
            >
              {selectedYears.length > 1 ? `${String(question.year).slice(2)}-${question.number}` : question.number}
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
              answerRevealed={Boolean(answerRevealed[question.id])}
              explanationExpanded={Boolean(explanationExpanded[question.id])}
              onSelect={selectChoice}
              onToggleAnswer={toggleAnswer}
              onToggleExplanation={toggleExplanation}
            />
          ))}
        </div>

        <aside className="h-fit rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 lg:sticky lg:top-16">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold">
            <BarChart3 size={16} />
            복습 요약
          </div>
          <div className="space-y-3 text-sm">
            <SummaryLine label="풀이한 문항" value={`${answeredCount} / ${yearQuestions.length}`} />
            <SummaryLine label="정답 확인" value={`${answerRevealedCount} / ${yearQuestions.length}`} />
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
