"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  BookOpenCheck,
  Filter,
  Flame,
  Layers3,
  Network,
  RotateCcw,
  Search,
  Target,
} from "lucide-react";
import PastExamModeDock, { type PastExamReviewScope } from "@/components/pastExam/PastExamModeDock";
import {
  networkAnswerKeySets,
  networkExamCategories,
  networkFrequentConcepts,
  networkPastExamYears,
  networkReconstructedQuestions,
} from "./data";
import { MultiSelectChips, SingleSelectChips } from "@/components/pastExam/PastExamFilterChips";
import { useQuestionProgress } from "@/hooks/useQuestionProgress";
import { networkReconstructedIdentity } from "@/lib/studyProgress/identity";
import { resetQuestionProgressByIds } from "@/lib/studyProgress/service";
import NetworkReconstructedQuestionCard from "./NetworkReconstructedQuestionCard";
import type {
  NetworkChoiceKey,
  NetworkExamCategory,
  NetworkFrequentConcept,
  NetworkPastExamYear,
  NetworkReconstructedQuestion,
} from "./types";

type StatusFilter = "all" | "unanswered" | "revealed" | "correct" | "wrong";
type ViewOrder = "exam" | "lecture";

const categoryStyles: Record<NetworkExamCategory, string> = {
  "통신망 기초": "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-100",
  "프로토콜·계층": "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-100",
  "신호·전송": "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
  "오류·흐름 제어": "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100",
  "TCP/IP": "border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-100",
  "LAN": "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100",
  "보안": "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
};

const choiceTone: Record<NetworkChoiceKey, string> = {
  "1": "bg-sky-500 text-white",
  "2": "bg-amber-500 text-gray-950",
  "3": "bg-emerald-500 text-white",
  "4": "bg-rose-500 text-white",
};

function matchesQuestion(question: NetworkReconstructedQuestion, query: string) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return true;

  return [
    question.prompt,
    question.category,
    question.sourceLabel,
    question.explanation,
    question.examSkill,
    ...question.conceptTags,
    ...question.choices.map((choice) => choice.text),
  ]
    .join(" ")
    .toLowerCase()
    .includes(keyword);
}

function questionYears(question: NetworkReconstructedQuestion) {
  const years = question.refs
    .map((ref) => Number(ref.slice(0, 4)) as NetworkPastExamYear)
    .filter((year) => networkPastExamYears.includes(year));
  return Array.from(new Set(years));
}

export default function NetworkPastExamAnalysisPage() {
  const pendingHashRef = useRef<string | null>(null);
  const [selectedYears, setSelectedYears] = useState<NetworkPastExamYear[]>([...networkPastExamYears]);
  const [viewOrder, setViewOrder] = useState<ViewOrder>("exam");
  const [category, setCategory] = useState<NetworkExamCategory | "all">("all");
  const [patternId, setPatternId] = useState<string>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [reviewScope, setReviewScope] = useState<PastExamReviewScope>("visible");
  const [selected, setSelected] = useState<Record<string, NetworkChoiceKey>>({});
  const [answerRevealed, setAnswerRevealed] = useState<Record<string, boolean>>({});
  const [explanationExpanded, setExplanationExpanded] = useState<Record<string, boolean>>({});
  const questionIdentities = useMemo(
    () => networkReconstructedQuestions.map((question) => networkReconstructedIdentity({ question })),
    [],
  );
  const identityById = useMemo(
    () => new Map(questionIdentities.map((identity) => [identity.questionId, identity])),
    [questionIdentities],
  );
  const questionById = useMemo(
    () => new Map(networkReconstructedQuestions.map((question) => [question.id, question])),
    [],
  );
  const { progressById, recordAttempt, ensureIdentity, patchProgress, reload } =
    useQuestionProgress(questionIdentities);

  useEffect(() => {
    setSelected((prev) => {
      const next = { ...prev };
      Object.values(progressById).forEach((progress) => {
        if (progress.latestChoice) next[progress.questionId] = progress.latestChoice as NetworkChoiceKey;
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const concept = params.get("concept");
    const linkedPattern = params.get("pattern") ?? concept;
    pendingHashRef.current = window.location.hash ? window.location.hash.slice(1) : null;

    if (linkedPattern && networkFrequentConcepts.some((item) => item.id === linkedPattern)) {
      setPatternId(linkedPattern);
    }
  }, []);

  const patternOptions = useMemo(() => {
    return networkFrequentConcepts.filter((pattern) => category === "all" || pattern.category === category);
  }, [category]);
  const yearOrder = useMemo(
    () => new Map(networkPastExamYears.map((item, index) => [item, index])),
    [],
  );
  const selectedYearLabel = useMemo(() => {
    if (selectedYears.length === networkPastExamYears.length) return "2015-2019";
    return [...selectedYears].sort((a, b) => a - b).map((item) => `${item}`).join(", ");
  }, [selectedYears]);

  const yearQuestions = useMemo(
    () => networkReconstructedQuestions.filter((question) => questionYears(question).some((year) => selectedYears.includes(year))),
    [selectedYears],
  );

  const filteredQuestions = useMemo(() => {
    return yearQuestions.filter((question) => {
      if (!matchesQuestion(question, query)) return false;
      if (category !== "all" && question.category !== category) return false;
      if (patternId !== "all" && question.patternId !== patternId) return false;

      const revealed = Boolean(answerRevealed[question.id]);
      const chosen = selected[question.id];
      const correct = chosen === question.correctChoice;

      if (status === "unanswered") return !chosen;
      if (status === "revealed") return revealed;
      if (status === "correct") return revealed && correct;
      if (status === "wrong") return revealed && Boolean(chosen) && !correct;
      return true;
    }).sort((a, b) => {
      if (viewOrder === "lecture") {
        const lectureDelta = (a.lectureRefs[0]?.lectureId ?? 999) - (b.lectureRefs[0]?.lectureId ?? 999);
        if (lectureDelta !== 0) return lectureDelta;
      }
      const aYear = questionYears(a)[0] ?? 9999;
      const bYear = questionYears(b)[0] ?? 9999;
      return (yearOrder.get(aYear) ?? 999) - (yearOrder.get(bYear) ?? 999) || a.number - b.number;
    });
  }, [answerRevealed, category, patternId, query, selected, status, viewOrder, yearOrder, yearQuestions]);

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
  }, [filteredQuestions.length]);

  const answeredCount = yearQuestions.filter((question) => selected[question.id]).length;
  const answerRevealedCount = yearQuestions.filter((question) => answerRevealed[question.id]).length;
  const visibleAnswerRevealedCount = filteredQuestions.filter((question) => answerRevealed[question.id]).length;
  const explanationExpandedCount = yearQuestions.filter(
    (question) => explanationExpanded[question.id],
  ).length;
  const visibleExplanationExpandedCount = filteredQuestions.filter(
    (question) => explanationExpanded[question.id],
  ).length;
  const correctCount = yearQuestions.filter(
    (question) => answerRevealed[question.id] && selected[question.id] === question.correctChoice,
  ).length;
  const wrongCount = yearQuestions.filter(
    (question) =>
      answerRevealed[question.id] &&
      selected[question.id] &&
      selected[question.id] !== question.correctChoice,
  ).length;
  const modeScopeQuestions =
    reviewScope === "visible" ? filteredQuestions : yearQuestions;

  function selectChoice(questionId: string, choice: NetworkChoiceKey) {
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

  function setAnswerVisibilityForQuestions(questions: NetworkReconstructedQuestion[], value: boolean) {
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

  function setExplanationForQuestions(questions: NetworkReconstructedQuestion[], value: boolean) {
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

  async function resetProgress() {
    const ids = new Set(yearQuestions.map((question) => question.id));
    setSelected((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
    setAnswerRevealed((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
    setExplanationExpanded((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
    await resetQuestionProgressByIds(Array.from(ids));
    await reload();
  }

  function resetFilters() {
    setSelectedYears([...networkPastExamYears]);
    setViewOrder("exam");
    setCategory("all");
    setPatternId("all");
    setStatus("all");
    setQuery("");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-8 sm:pt-10 lg:pb-10">
      <header className="mb-8 rounded-lg border border-emerald-200 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-gray-950 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/network"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300"
            >
              <Network size={16} />
              정보통신망 홈
            </Link>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">
              <BookOpenCheck size={14} />
              2015-2019 1학기 기말
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">정보통신망 기출분석</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
              5개년 175문항의 출제 축을 개념 단위로 묶고, 같은 출제 의도를 새 문항으로 바꾼
              기출형 재구성 문제로 반복 풀이할 수 있게 정리했습니다.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/network/frequent-concepts"
                className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-100"
              >
                <Flame size={16} />
                빈출 개념 보기
              </Link>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-2 text-sm sm:grid-cols-4 lg:min-w-[460px]">
            <ProgressBox label="분석 문항" value="175" tone="emerald" />
            <ProgressBox label="출제축" value={`${networkFrequentConcepts.length}`} tone="cyan" />
            <ProgressBox label="재구성" value={`${networkReconstructedQuestions.length}`} tone="amber" />
            <ProgressBox label="풀이" value={`${answeredCount}`} tone="rose" />
          </div>
        </div>
      </header>

      <NetworkExamAtlas
        onSelectCategory={setCategory}
        onSelectPattern={(id) => {
          setPatternId(id);
          const pattern = networkFrequentConcepts.find((item) => item.id === id);
          if (pattern) setCategory(pattern.category);
        }}
      />

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-100">
          <Filter size={16} />
          필터
        </div>
        <div className="grid gap-3 xl:grid-cols-[1.1fr_1fr_1.1fr_0.8fr_1fr_0.8fr_auto_auto]">
          <MultiSelectChips
            label="연도"
            options={networkPastExamYears}
            selected={selectedYears}
            tone="emerald"
            allLabel="전체 연도"
            getLabel={(item) => `${item}년`}
            onChange={setSelectedYears}
          />

          <SingleSelectChips
            label="보기"
            tone="emerald"
            value={viewOrder}
            onChange={setViewOrder}
            options={[
              { value: "exam", label: "시험지순" },
              { value: "lecture", label: "강의순" },
            ]}
          />

          <label className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="문제, 개념, 단서 검색"
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-400 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>

          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value as NetworkExamCategory | "all");
              setPatternId("all");
            }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="all">전체 분류</option>
            {networkExamCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={patternId}
            onChange={(event) => setPatternId(event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="all">전체 출제축</option>
            {patternOptions.map((pattern) => (
              <option key={pattern.id} value={pattern.id}>
                {pattern.label}
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
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <RotateCcw size={15} />
            필터 초기화
          </button>

          <button
            type="button"
            onClick={() => void resetProgress()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50 dark:border-rose-900 dark:text-rose-100 dark:hover:bg-rose-950/30"
          >
            <RotateCcw size={15} />
            풀이 초기화
          </button>
        </div>
      </section>

      <PastExamModeDock
        tone="emerald"
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
        onResetProgress={() => void resetProgress()}
      />

      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-950 dark:text-gray-50">
              {selectedYearLabel} 기출형 재구성 문제 {filteredQuestions.length}문항
            </h2>
            <p className="text-sm text-gray-500">
              정답 공개 전에는 정오답 색상을 표시하지 않습니다.
            </p>
          </div>
          <div className="text-xs font-semibold text-gray-500">
            선택 연도 {yearQuestions.length}문항 중 필터 결과
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {filteredQuestions.map((question) => (
            <a
              key={`jump-${question.id}`}
              href={`#${question.id}`}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold transition-colors ${
                answerRevealed[question.id]
                  ? selected[question.id] === question.correctChoice
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
                    : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-100"
                  : selected[question.id]
                    ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-100"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              }`}
            >
              {question.number}
            </a>
          ))}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
        <div className="space-y-5">
          {filteredQuestions.map((question) => (
            <NetworkReconstructedQuestionCard
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
            <div className="mb-2 text-xs font-bold text-gray-500">분류별 이동</div>
            <div className="flex flex-wrap gap-2">
              {networkExamCategories.map((item) => {
                const count = networkReconstructedQuestions.filter((question) => question.category === item).length;
                return (
                  <button
                    key={`summary-${item}`}
                    type="button"
                    onClick={() => {
                      setCategory(item);
                      setPatternId("all");
                    }}
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${categoryStyles[item]}`}
                  >
                    {item} {count}
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

function NetworkExamAtlas({
  onSelectCategory,
  onSelectPattern,
}: {
  onSelectCategory: (category: NetworkExamCategory) => void;
  onSelectPattern: (patternId: string) => void;
}) {
  const categoryCounts = useMemo(() => {
    return networkExamCategories.map((category) => ({
      category,
      count: networkFrequentConcepts
        .filter((pattern) => pattern.category === category)
        .reduce((sum, pattern) => sum + pattern.frequency, 0),
      questionCount: networkReconstructedQuestions.filter((question) => question.category === category).length,
    }));
  }, []);

  const topPatterns = networkFrequentConcepts.slice(0, 8);
  const maxCategoryCount = Math.max(...categoryCounts.map((item) => item.count));
  const maxPatternFrequency = Math.max(...topPatterns.map((item) => item.frequency));
  const answerKeys: NetworkChoiceKey[] = ["1", "2", "3", "4"];

  return (
    <section className="mb-6 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-bold">
              <Flame size={16} className="text-rose-500" />
              분류별 출제 밀도
            </div>
            <p className="text-xs text-gray-500">막대 길이는 5개년 출제 신호의 누적 비중입니다.</p>
          </div>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600 dark:bg-gray-900 dark:text-gray-300">
            175문항
          </span>
        </div>
        <div className="space-y-3">
          {categoryCounts.map((item) => (
            <button
              key={item.category}
              type="button"
              onClick={() => onSelectCategory(item.category)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-left transition-colors hover:border-emerald-300 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className={`rounded-md border px-2 py-1 text-xs font-bold ${categoryStyles[item.category]}`}>
                  {item.category}
                </span>
                <span className="font-mono text-xs font-bold text-gray-500">
                  {item.count}회 · 재구성 {item.questionCount}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white dark:bg-gray-950">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${(item.count / maxCategoryCount) * 100}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold">
          <Target size={16} className="text-emerald-500" />
          최빈출 출제축
        </div>
        <div className="space-y-3">
          {topPatterns.map((pattern) => (
            <PatternRow
              key={pattern.id}
              pattern={pattern}
              max={maxPatternFrequency}
              onSelect={() => onSelectPattern(pattern.id)}
            />
          ))}
        </div>
      </div>

      <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 xl:col-span-2">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-bold">
              <Layers3 size={16} className="text-cyan-500" />
              연도별 정답 흐름
            </div>
            <p className="text-xs text-gray-500">색상은 선택지 번호 분포를 빠르게 보기 위한 보조 정보입니다.</p>
          </div>
          <div className="flex gap-1">
            {answerKeys.map((key) => (
              <span
                key={`legend-${key}`}
                className={`rounded-md px-2 py-1 text-xs font-black ${choiceTone[key]}`}
              >
                {key}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {networkAnswerKeySets.map((set) => {
            const counts = answerKeys.reduce<Record<NetworkChoiceKey, number>>(
              (acc, key) => ({ ...acc, [key]: set.answers.filter((answer) => answer === key).length }),
              { "1": 0, "2": 0, "3": 0, "4": 0 },
            );

            return (
              <div
                key={set.year}
                className="grid gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800 md:grid-cols-[86px_minmax(0,1fr)_190px]"
              >
                <div className="font-mono text-sm font-black text-gray-900 dark:text-gray-100">
                  {set.year}
                </div>
                <div className="flex flex-wrap gap-1">
                  {set.groups.map((group, index) => (
                    <span
                      key={`${set.year}-${group}-${index}`}
                      className="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs font-bold text-gray-600 dark:bg-gray-900 dark:text-gray-300"
                    >
                      {group}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-1 text-center text-xs font-bold">
                  {answerKeys.map((key) => (
                    <span key={`${set.year}-${key}`} className={`rounded-md px-2 py-1 ${choiceTone[key]}`}>
                      {key}: {counts[key]}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PatternRow({
  pattern,
  max,
  onSelect,
}: {
  pattern: NetworkFrequentConcept;
  max: number;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-left transition-colors hover:border-emerald-300 dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-black text-gray-950 dark:text-gray-50">
            {pattern.label}
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
            {pattern.examCue}
          </p>
        </div>
        <span className={`shrink-0 rounded-md border px-2 py-1 text-xs font-bold ${categoryStyles[pattern.category]}`}>
          {pattern.frequency}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white dark:bg-gray-950">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${(pattern.frequency / max) * 100}%` }}
        />
      </div>
    </button>
  );
}

function ProgressBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "cyan" | "amber" | "rose";
}) {
  const toneClass = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100",
    cyan: "border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-100",
    amber: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100",
    rose: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-100",
  }[tone];

  return (
    <div className={`rounded-lg border px-3 py-3 text-center ${toneClass}`}>
      <div className="font-mono text-lg font-black">{value}</div>
      <div className="text-xs font-bold">{label}</div>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-mono font-bold text-gray-950 dark:text-gray-50">{value}</span>
    </div>
  );
}
