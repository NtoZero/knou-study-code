"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  BookOpenCheck,
  Filter,
  Flame,
  Network,
  RotateCcw,
  Shield,
  Target,
} from "lucide-react";
import { securityLectures } from "@/lib/constants";
import PastExamModeDock from "@/components/pastExam/PastExamModeDock";
import { useQuestionProgress } from "@/hooks/useQuestionProgress";
import { pastExamIdentity } from "@/lib/studyProgress/identity";
import { resetQuestionProgressByIds } from "@/lib/studyProgress/service";
import {
  securityPastExamQuestions,
  securityPastExamTopicEntries,
  securityPastExamYears,
} from "./data";
import PastExamQuestionCard from "./PastExamQuestionCard";
import type {
  SecurityChoiceKey,
  SecurityPastExamQuestion,
  SecurityPastExamYear,
} from "./types";

type StatusFilter = "all" | "unanswered" | "revealed" | "correct" | "wrong";

type Track = "기초" | "공격" | "시스템" | "응용" | "포렌식" | "암호심화";

const trackByLecture = (lectureId: number): Track => {
  if (lectureId <= 3) return "기초";
  if (lectureId <= 5) return "공격";
  if (lectureId <= 8) return "시스템";
  if (lectureId <= 10) return "응용";
  if (lectureId === 11) return "포렌식";
  return "암호심화";
};

const trackStyles: Record<Track, string> = {
  "기초": "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-100",
  "공격": "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-100",
  "시스템": "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-100",
  "응용": "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
  "포렌식": "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
  "암호심화": "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-100",
};

function countBy<T extends string | number>(
  questions: SecurityPastExamQuestion[],
  getKey: (question: SecurityPastExamQuestion) => T,
) {
  return questions.reduce<Record<string, number>>((acc, question) => {
    const key = String(getKey(question));
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function parsePastExamYear(value: string | null) {
  const candidate = Number(value);
  return securityPastExamYears.includes(candidate as SecurityPastExamYear)
    ? (candidate as SecurityPastExamYear)
    : null;
}

export default function SecurityPastExamWorkbook() {
  const pendingHashRef = useRef<string | null>(null);
  const [year, setYear] = useState<SecurityPastExamYear>(2019);
  const [lectureId, setLectureId] = useState<number | "all">("all");
  const [conceptTag, setConceptTag] = useState<string>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [reviewScope, setReviewScope] = useState<"visible" | "year">("visible");
  const [selected, setSelected] = useState<Record<string, SecurityChoiceKey>>({});
  const [answerRevealed, setAnswerRevealed] = useState<Record<string, boolean>>({});
  const [explanationExpanded, setExplanationExpanded] = useState<Record<string, boolean>>({});
  const questionIdentities = useMemo(
    () =>
      securityPastExamQuestions.map((question) =>
        pastExamIdentity({
          question,
          subjectSlug: "security",
          subjectLabel: "컴퓨터보안",
          basePath: "/security/past-exam",
        }),
      ),
    [],
  );
  const identityById = useMemo(
    () => new Map(questionIdentities.map((identity) => [identity.questionId, identity])),
    [questionIdentities],
  );
  const questionById = useMemo(
    () => new Map(securityPastExamQuestions.map((question) => [question.id, question])),
    [],
  );
  const { progressById, recordAttempt, ensureIdentity, patchProgress, reload } =
    useQuestionProgress(questionIdentities);

  useEffect(() => {
    setSelected((prev) => {
      const next = { ...prev };
      Object.values(progressById).forEach((progress) => {
        if (progress.latestChoice) next[progress.questionId] = progress.latestChoice as SecurityChoiceKey;
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
    () => securityPastExamQuestions.filter((question) => question.year === year),
    [year],
  );

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
      if (
        lectureId !== "all" &&
        !question.lectureRefs.some((ref) => ref.lectureId === lectureId)
      ) {
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
    });
  }, [yearQuestions, lectureId, conceptTag, status, selected, answerRevealed]);

  useEffect(() => {
    const linkedYear = parsePastExamYear(new URLSearchParams(window.location.search).get("year"));
    pendingHashRef.current = window.location.hash ? window.location.hash.slice(1) : null;

    if (linkedYear) {
      setYear(linkedYear);
    }
  }, []);

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
  const modeScopeQuestions = reviewScope === "visible" ? filteredQuestions : yearQuestions;

  function selectChoice(questionId: string, choice: SecurityChoiceKey) {
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

  function setAnswerVisibilityForQuestions(questions: SecurityPastExamQuestion[], value: boolean) {
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

  function setExplanationForQuestions(questions: SecurityPastExamQuestion[], value: boolean) {
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
    setExplanationExpanded((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))),
    );
    await resetQuestionProgressByIds(Array.from(ids));
    await reload();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-8 sm:pt-10 lg:pb-10">
      <header className="mb-8 rounded-lg border border-cyan-200 bg-white p-5 shadow-sm dark:border-cyan-900 dark:bg-gray-950 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-100">
              <BookOpenCheck size={14} />
              2015-2019 1학기 기말
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">컴퓨터보안 기출분석</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
              125개 기출문항을 연도, 강의, 개념 태그로 좁혀 풀고 정답 확인 기준 해설을 확인합니다.
              상단 시각화는 반복 출제 영역과 약점 복습 루트를 빠르게 보여줍니다.
            </p>
            <Link
              href="/security/frequent-concepts"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-100"
            >
              <Flame size={16} />
              2015-2019 빈출 개념 보기
            </Link>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-2 text-sm sm:grid-cols-4 lg:min-w-[460px]">
            <ProgressBox label="선택" value={`${answeredCount}/25`} tone="cyan" />
            <ProgressBox label="확인" value={`${answerRevealedCount}/25`} tone="amber" />
            <ProgressBox label="맞힘" value={`${correctCount}`} tone="emerald" />
            <ProgressBox label="재검토" value={`${wrongCount}`} tone="rose" />
          </div>
        </div>
      </header>

      <SecurityExamAtlas
        selectedYear={year}
        selected={selected}
        revealed={answerRevealed}
        onSelectLecture={setLectureId}
        onSelectTag={setConceptTag}
      />

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-100">
          <Filter size={16} />
          필터
        </div>
        <div className="grid gap-3 xl:grid-cols-[1.2fr_0.8fr_0.9fr_0.9fr_auto]">
          <div className="flex flex-wrap gap-2">
            {securityPastExamYears.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setYear(item)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  year === item
                    ? "bg-cyan-700 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                {item}년
              </button>
            ))}
          </div>

          <select
            value={lectureId}
            onChange={(event) =>
              setLectureId(event.target.value === "all" ? "all" : Number(event.target.value))
            }
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
        onResetProgress={() => void resetYear()}
      />

      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-950 dark:text-gray-50">
              {year}학년도 1학기 {filteredQuestions.length}문항
            </h2>
            <p className="text-sm text-gray-500">
              정답 공개 전에는 정오답 색상을 표시하지 않습니다.
            </p>
          </div>
          <div className="text-xs font-semibold text-gray-500">
            전체 {yearQuestions.length}문항 중 필터 결과
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {yearQuestions.map((question) => (
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

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
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
            <SummaryLine label="풀이한 문항" value={`${answeredCount} / 25`} />
            <SummaryLine label="정답 확인" value={`${answerRevealedCount} / 25`} />
            <SummaryLine label="맞힌 문항" value={`${correctCount}`} />
            <SummaryLine label="다시 볼 문항" value={`${wrongCount}`} />
          </div>
          <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
            <div className="mb-2 text-xs font-bold text-gray-500">강의별 문항</div>
            <div className="flex flex-wrap gap-2">
              {lectureOptions.map((id) => {
                const count = yearQuestions.filter((question) =>
                  question.lectureRefs.some((ref) => ref.lectureId === id),
                ).length;
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

function SecurityExamAtlas({
  selectedYear,
  selected,
  revealed,
  onSelectLecture,
  onSelectTag,
}: {
  selectedYear: SecurityPastExamYear;
  selected: Record<string, SecurityChoiceKey>;
  revealed: Record<string, boolean>;
  onSelectLecture: (lectureId: number | "all") => void;
  onSelectTag: (tag: string) => void;
}) {
  const lectureCounts = useMemo(() => {
    const counts = countBy(securityPastExamQuestions, (question) => question.lectureRefs[0].lectureId);
    return securityLectures.map((lecture) => ({
      ...lecture,
      count: counts[String(lecture.id)] ?? 0,
      track: trackByLecture(lecture.id),
    }));
  }, []);

  const yearTrackCounts = useMemo(() => {
    return securityPastExamYears.map((item) => {
      const questions = securityPastExamQuestions.filter((question) => question.year === item);
      const counts = countBy(questions, (question) => trackByLecture(question.lectureRefs[0].lectureId));
      return {
        year: item,
        counts,
      };
    });
  }, []);

  const topicStats = useMemo(() => {
    const counts = countBy(securityPastExamQuestions, (question) => question.lectureRefs[0].concept);
    return securityPastExamTopicEntries
      .map((topic) => ({
        ...topic,
        count: counts[topic.concept] ?? 0,
      }))
      .filter((topic) => topic.count > 0)
      .sort((a, b) => b.count - a.count);
  }, []);

  const selectedYearQuestions = useMemo(
    () =>
      securityPastExamQuestions
        .filter((question) => question.year === selectedYear)
        .sort((a, b) => a.number - b.number),
    [selectedYear],
  );

  const lectureYearMatrix = useMemo(() => {
    return securityPastExamYears.map((item) => {
      const questions = securityPastExamQuestions.filter((question) => question.year === item);
      const counts = countBy(questions, (question) => question.lectureRefs[0].lectureId);
      return {
        year: item,
        counts,
      };
    });
  }, []);

  const answerDistribution = useMemo(() => {
    return securityPastExamYears.map((item) => {
      const questions = securityPastExamQuestions.filter((question) => question.year === item);
      const counts = countBy(questions, (question) => question.correctChoice);
      return {
        year: item,
        counts,
      };
    });
  }, []);

  const weakTags = useMemo(() => {
    const wrong = securityPastExamQuestions.filter(
      (question) =>
        question.year === selectedYear &&
        revealed[question.id] &&
        selected[question.id] &&
        selected[question.id] !== question.correctChoice,
    );
    const counts = wrong.reduce<Record<string, number>>((acc, question) => {
      question.conceptTags.forEach((tag) => {
        acc[tag] = (acc[tag] ?? 0) + 1;
      });
      return acc;
    }, {});
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [revealed, selected, selectedYear]);

  const maxLectureCount = Math.max(...lectureCounts.map((item) => item.count));
  const maxTopicCount = Math.max(...topicStats.map((item) => item.count));
  const tracks: Track[] = ["기초", "공격", "시스템", "응용", "포렌식", "암호심화"];
  const maxMatrixCount = Math.max(
    ...lectureYearMatrix.flatMap((item) =>
      lectureCounts.map((lecture) => item.counts[String(lecture.id)] ?? 0),
    ),
  );
  const answerKeys: SecurityChoiceKey[] = ["1", "2", "3", "4"];
  const answerStyles: Record<SecurityChoiceKey, string> = {
    "1": "bg-sky-500 text-white",
    "2": "bg-amber-500 text-gray-950",
    "3": "bg-emerald-500 text-white",
    "4": "bg-rose-500 text-white",
  };
  const answerLabels: Record<SecurityChoiceKey, string> = {
    "1": "①",
    "2": "②",
    "3": "③",
    "4": "④",
  };

  return (
    <section className="mb-6 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-bold">
              <Flame size={16} className="text-rose-500" />
              강의별 출제 밀도
            </div>
            <p className="text-xs text-gray-500">색과 높이가 진할수록 2015-2019 반복도가 높습니다.</p>
          </div>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600 dark:bg-gray-900 dark:text-gray-300">
            총 {securityPastExamQuestions.length}문항
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-11">
          {lectureCounts.map((lecture) => {
            const intensity = lecture.count / maxLectureCount;
            return (
              <button
                key={lecture.id}
                type="button"
                onClick={() => onSelectLecture(lecture.id)}
                title={`${lecture.id}강 ${lecture.title}: ${lecture.count}문항`}
                className="group flex min-h-[118px] flex-col justify-end rounded-lg border border-gray-200 bg-gray-50 p-2 text-left transition-transform hover:-translate-y-0.5 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-2 flex flex-1 items-end">
                  <div
                    className={`w-full rounded-md ${lecture.bgClass}`}
                    style={{ height: `${Math.max(20, intensity * 82)}px`, opacity: 0.35 + intensity * 0.65 }}
                  />
                </div>
                <div className="font-mono text-sm font-black">{lecture.id}</div>
                <div className="text-[11px] font-bold text-gray-700 dark:text-gray-200">
                  {lecture.count}문항
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold">
          <Network size={16} className="text-violet-500" />
          연도별 출제 축
        </div>
        <div className="space-y-4">
          {yearTrackCounts.map((item) => (
            <div key={item.year}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-bold">{item.year}년</span>
                <span className="text-xs text-gray-500">25문항</span>
              </div>
              <div className="flex h-8 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                {tracks.map((track) => {
                  const count = item.counts[track] ?? 0;
                  return (
                    <button
                      key={`${item.year}-${track}`}
                      type="button"
                      onClick={() => {
                        const topic = securityPastExamTopicEntries.find(
                          (entry) => trackByLecture(entry.lectureId) === track,
                        );
                        onSelectTag(topic?.tags[0] ?? "all");
                      }}
                      className={`flex items-center justify-center text-[11px] font-bold ${trackStyles[track]}`}
                      style={{ width: `${(count / 25) * 100}%` }}
                      title={`${item.year}년 ${track}: ${count}문항`}
                    >
                      {count > 0 ? count : ""}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tracks.map((track) => (
                  <span key={`${item.year}-${track}-label`} className={`rounded px-2 py-0.5 text-[11px] font-bold ${trackStyles[track]}`}>
                    {track}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 xl:col-span-2">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-bold">
              <Network size={16} className="text-cyan-500" />
              {selectedYear}년 문항 흐름 레일
            </div>
            <p className="text-xs text-gray-500">
              문제 번호 순서대로 어떤 강의가 연속 출제되는지 보여줍니다. 선택·오답 상태도 같이 표시됩니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tracks.map((track) => (
              <span
                key={`flow-track-${track}`}
                className={`rounded px-2 py-0.5 text-[11px] font-bold ${trackStyles[track]}`}
              >
                {track}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10 lg:grid-cols-[repeat(25,minmax(0,1fr))]">
          {selectedYearQuestions.map((question) => {
            const lecture = question.lectureRefs[0];
            const track = trackByLecture(lecture.lectureId);
            const isRevealed = Boolean(revealed[question.id]);
            const chosen = selected[question.id];
            const isWrong = isRevealed && chosen && chosen !== question.correctChoice;
            const isCorrect = isRevealed && chosen === question.correctChoice;

            return (
              <button
                key={`flow-${question.id}`}
                type="button"
                onClick={() => onSelectLecture(lecture.lectureId)}
                title={`${question.number}번: ${lecture.label}`}
                className={`min-h-[58px] rounded-lg border px-1.5 py-2 text-left transition-transform hover:-translate-y-0.5 ${
                  isWrong
                    ? "border-rose-400 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/30"
                    : isCorrect
                      ? "border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30"
                      : chosen
                        ? "border-cyan-400 bg-cyan-50 dark:border-cyan-700 dark:bg-cyan-950/30"
                        : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                <div className="font-mono text-[11px] font-black text-gray-500">
                  {question.number}
                </div>
                <div className={`mt-1 inline-flex rounded px-1.5 py-0.5 text-[11px] font-bold ${trackStyles[track]}`}>
                  {lecture.lectureId}강
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 xl:col-span-2">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold">
          <Flame size={16} className="text-orange-500" />
          강의 × 연도 히트매트릭스
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="mb-2 grid grid-cols-[72px_repeat(11,minmax(46px,1fr))] gap-1 text-center text-[11px] font-bold text-gray-500">
              <div />
              {lectureCounts.map((lecture) => (
                <button
                  key={`matrix-head-${lecture.id}`}
                  type="button"
                  onClick={() => onSelectLecture(lecture.id)}
                  className="rounded bg-gray-100 px-1 py-1 dark:bg-gray-900"
                >
                  {lecture.id}강
                </button>
              ))}
            </div>
            <div className="space-y-1">
              {lectureYearMatrix.map((row) => (
                <div
                  key={`matrix-row-${row.year}`}
                  className="grid grid-cols-[72px_repeat(11,minmax(46px,1fr))] gap-1"
                >
                  <div className="flex items-center rounded bg-gray-100 px-2 text-xs font-black text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                    {row.year}
                  </div>
                  {lectureCounts.map((lecture) => {
                    const count = row.counts[String(lecture.id)] ?? 0;
                    const intensity = count / maxMatrixCount;
                    return (
                      <button
                        key={`matrix-${row.year}-${lecture.id}`}
                        type="button"
                        onClick={() => onSelectLecture(lecture.id)}
                        title={`${row.year}년 ${lecture.id}강: ${count}문항`}
                        className={`h-10 rounded border text-xs font-black transition-transform hover:-translate-y-0.5 ${lecture.textClass}`}
                        style={{
                          backgroundColor: count
                            ? `color-mix(in srgb, currentColor ${Math.round(18 + intensity * 54)}%, transparent)`
                            : undefined,
                          borderColor: count
                            ? "color-mix(in srgb, currentColor 42%, transparent)"
                            : undefined,
                        }}
                      >
                        {count || ""}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold">
          <Target size={16} className="text-amber-500" />
          개념 클러스터
        </div>
        <div className="space-y-3">
          {topicStats.slice(0, 9).map((topic) => (
            <button
              key={topic.key}
              type="button"
              onClick={() => onSelectTag(topic.tags[0])}
              className="grid w-full grid-cols-[120px_1fr_36px] items-center gap-3 text-left text-sm"
            >
              <span className="truncate font-semibold text-gray-700 dark:text-gray-200">
                {topic.concept}
              </span>
              <span className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <span
                  className="block h-full rounded-full bg-amber-500"
                  style={{ width: `${(topic.count / maxTopicCount) * 100}%` }}
                />
              </span>
              <span className="text-right font-mono text-xs font-bold text-gray-500">
                {topic.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold">
          <BarChart3 size={16} className="text-sky-500" />
          정답 번호 분포
        </div>
        <div className="space-y-4">
          {answerDistribution.map((item) => (
            <div key={`answer-dist-${item.year}`}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-bold">{item.year}년</span>
                <span className="text-xs text-gray-500">
                  {answerKeys.map((key) => `${answerLabels[key]} ${item.counts[key] ?? 0}`).join(" · ")}
                </span>
              </div>
              <div className="flex h-8 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                {answerKeys.map((key) => {
                  const count = item.counts[key] ?? 0;
                  return (
                    <div
                      key={`${item.year}-${key}`}
                      className={`flex items-center justify-center text-[11px] font-black ${answerStyles[key]}`}
                      style={{ width: `${(count / 25) * 100}%` }}
                      title={`${item.year}년 ${answerLabels[key]}: ${count}문항`}
                    >
                      {count}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold">
          <Shield size={16} className="text-emerald-500" />
          약점 복습 루트
        </div>
        {weakTags.length > 0 ? (
          <div className="space-y-3">
            {weakTags.map(([tag, count]) => (
              <button
                key={tag}
                type="button"
                onClick={() => onSelectTag(tag)}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-left text-sm dark:border-rose-900 dark:bg-rose-950/30"
              >
                <span className="font-semibold text-rose-900 dark:text-rose-100">{tag}</span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-rose-700 dark:bg-gray-950 dark:text-rose-100">
                  {count}회
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["1", "CIA와 암호 기본"],
              ["4", "악성코드·공격 분류"],
              ["7", "방화벽·VPN"],
              ["9", "PGP·S/MIME·Radix"],
            ].map(([lecture, label]) => (
              <button
                key={lecture}
                type="button"
                onClick={() => onSelectLecture(Number(lecture))}
                className="rounded-lg border border-gray-200 px-3 py-3 text-left text-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
              >
                <div className="font-bold">{lecture}강</div>
                <div className="mt-1 text-xs text-gray-500">{label}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProgressBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "cyan" | "amber" | "emerald" | "rose";
}) {
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
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-bold text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}
