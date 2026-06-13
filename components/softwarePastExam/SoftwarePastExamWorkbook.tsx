"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BookOpenCheck, Flame, RotateCcw } from "lucide-react";
import { MultiSelectChips, SingleSelectChips } from "@/components/pastExam/PastExamFilterChips";
import { softwareLectures } from "@/lib/constants";
import PastExamModeDock from "@/components/pastExam/PastExamModeDock";
import { useQuestionProgress } from "@/hooks/useQuestionProgress";
import { pastExamIdentity } from "@/lib/studyProgress/identity";
import { resetQuestionProgressByIds } from "@/lib/studyProgress/service";
import {
  softwarePastExamQuestions,
  softwarePastExamYears,
} from "./data";
import PastExamQuestionCard from "./PastExamQuestionCard";
import type { SoftwareChoiceKey, SoftwarePastExamQuestion, SoftwarePastExamYear } from "./types";

type StatusFilter = "all" | "unanswered" | "revealed" | "correct" | "wrong";
type Scope = "visible" | "year";
type ViewOrder = "exam" | "lecture";

function parseYear(value: string | null) {
  const year = Number(value);
  return softwarePastExamYears.includes(year as SoftwarePastExamYear)
    ? (year as SoftwarePastExamYear)
    : null;
}

export default function SoftwarePastExamWorkbook() {
  const pendingHashRef = useRef<string | null>(null);
  const [selectedYears, setSelectedYears] = useState<SoftwarePastExamYear[]>([...softwarePastExamYears]);
  const [viewOrder, setViewOrder] = useState<ViewOrder>("exam");
  const [lectureId, setLectureId] = useState<number | "all">("all");
  const [conceptTag, setConceptTag] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [scope, setScope] = useState<Scope>("visible");
  const [selected, setSelected] = useState<Record<string, SoftwareChoiceKey>>({});
  const [answerRevealed, setAnswerRevealed] = useState<Record<string, boolean>>({});
  const [explanationExpanded, setExplanationExpanded] = useState<Record<string, boolean>>({});
  const questionIdentities = useMemo(
    () =>
      softwarePastExamQuestions.map((question) =>
        pastExamIdentity({
          question,
          subjectSlug: "software",
          subjectLabel: "소프트웨어공학",
          basePath: "/software/past-exam",
        }),
      ),
    [],
  );
  const identityById = useMemo(
    () => new Map(questionIdentities.map((identity) => [identity.questionId, identity])),
    [questionIdentities],
  );
  const questionById = useMemo(
    () => new Map(softwarePastExamQuestions.map((question) => [question.id, question])),
    [],
  );
  const { progressById, recordAttempt, ensureIdentity, patchProgress, reload } =
    useQuestionProgress(questionIdentities);

  useEffect(() => {
    setSelected((prev) => {
      const next = { ...prev };
      Object.values(progressById).forEach((progress) => {
        if (progress.latestChoice) next[progress.questionId] = progress.latestChoice as SoftwareChoiceKey;
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
    () => softwarePastExamQuestions.filter((question) => selectedYears.includes(question.year)),
    [selectedYears],
  );
  const yearOrder = useMemo(
    () => new Map(softwarePastExamYears.map((item, index) => [item, index])),
    [],
  );

  const lectureOptions = useMemo(() => {
    const ids = new Set<number>();
    yearQuestions.forEach((question) => question.lectureRefs.forEach((ref) => ids.add(ref.lectureId)));
    return Array.from(ids).sort((a, b) => a - b);
  }, [yearQuestions]);

  const conceptOptions = useMemo(() => {
    const tags = new Set<string>();
    yearQuestions.forEach((question) => tags.add(question.conceptTags[0]));
    return Array.from(tags).sort((a, b) => a.localeCompare(b, "ko"));
  }, [yearQuestions]);

  const filteredQuestions = useMemo(() => {
    return yearQuestions.filter((question) => {
      if (lectureId !== "all" && !question.lectureRefs.some((ref) => ref.lectureId === lectureId)) return false;
      if (conceptTag !== "all" && question.conceptTags[0] !== conceptTag) return false;
      const revealed = Boolean(answerRevealed[question.id]);
      const chosen = selected[question.id];
      if (status === "unanswered") return !chosen;
      if (status === "revealed") return revealed;
      if (status === "correct") return revealed && chosen === question.correctChoice;
      if (status === "wrong") return revealed && Boolean(chosen) && chosen !== question.correctChoice;
      return true;
    }).sort((a, b) => {
      if (viewOrder === "lecture") {
        const lectureDelta = (a.lectureRefs[0]?.lectureId ?? 999) - (b.lectureRefs[0]?.lectureId ?? 999);
        if (lectureDelta !== 0) return lectureDelta;
      }
      return (yearOrder.get(a.year) ?? 999) - (yearOrder.get(b.year) ?? 999) || a.number - b.number;
    });
  }, [answerRevealed, conceptTag, lectureId, selected, status, viewOrder, yearOrder, yearQuestions]);

  useEffect(() => {
    const linkedYear = parseYear(new URLSearchParams(window.location.search).get("year"));
    pendingHashRef.current = window.location.hash ? window.location.hash.slice(1) : null;
    if (linkedYear) setSelectedYears([linkedYear]);
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
  }, [filteredQuestions.length, selectedYears]);

  const answeredCount = yearQuestions.filter((question) => selected[question.id]).length;
  const answerRevealedCount = yearQuestions.filter((question) => answerRevealed[question.id]).length;
  const visibleAnswerRevealedCount = filteredQuestions.filter((question) => answerRevealed[question.id]).length;
  const explanationExpandedCount = yearQuestions.filter((question) => explanationExpanded[question.id]).length;
  const visibleExplanationExpandedCount = filteredQuestions.filter((question) => explanationExpanded[question.id]).length;
  const correctCount = yearQuestions.filter((question) => answerRevealed[question.id] && selected[question.id] === question.correctChoice).length;
  const wrongCount = yearQuestions.filter((question) => answerRevealed[question.id] && selected[question.id] && selected[question.id] !== question.correctChoice).length;
  const scopeQuestions = scope === "visible" ? filteredQuestions : yearQuestions;

  function setAnswerVisibilityForQuestions(questions: SoftwarePastExamQuestion[], value: boolean) {
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

  function setExplanationForQuestions(questions: SoftwarePastExamQuestion[], value: boolean) {
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

  function selectChoice(questionId: string, choice: SoftwareChoiceKey) {
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
    if (!nextVisible) setExplanationExpanded((prev) => ({ ...prev, [questionId]: false }));
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

  async function resetYear() {
    const ids = new Set(yearQuestions.map((question) => question.id));
    setSelected((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
    setAnswerRevealed((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
    setExplanationExpanded((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
    await resetQuestionProgressByIds(Array.from(ids));
    await reload();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-8 sm:pt-10 lg:pb-10">
      <header className="mb-8 rounded-lg border border-emerald-200 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-gray-950 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">
              <BookOpenCheck size={14} />
              2017-2019 1학기 기말
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">소프트웨어공학 기출분석</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
              105개 문항을 연도, 강의, 개념 태그로 좁혀 풀고 정답과 선택지별 해설을 확인합니다.
              보기는 세로 목록으로 배치해 긴 UML·테스트 문항도 모바일에서 이어 읽을 수 있게 구성했습니다.
            </p>
            <Link
              href="/software/frequent-concepts"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100"
            >
              <Flame size={16} />
              빈출 개념 보기
            </Link>
          </div>
          <div className="grid min-w-0 grid-cols-2 gap-2 text-sm sm:grid-cols-4 lg:min-w-[460px]">
            <ProgressBox label="선택" value={`${answeredCount}/${yearQuestions.length}`} tone="emerald" />
            <ProgressBox label="확인" value={`${answerRevealedCount}/${yearQuestions.length}`} tone="amber" />
            <ProgressBox label="맞힘" value={`${correctCount}`} tone="blue" />
            <ProgressBox label="재검토" value={`${wrongCount}`} tone="rose" />
          </div>
        </div>
      </header>

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_0.9fr_0.9fr_0.8fr]">
          <MultiSelectChips
            label="연도"
            options={softwarePastExamYears}
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
          <Select label="강의" value={String(lectureId)} onChange={(value) => setLectureId(value === "all" ? "all" : Number(value))}>
            <option value="all">전체 강의</option>
            {lectureOptions.map((id) => (
              <option key={id} value={id}>{id}강 {softwareLectures[id - 1]?.title}</option>
            ))}
          </Select>
          <Select label="개념" value={conceptTag} onChange={setConceptTag}>
            <option value="all">전체 개념</option>
            {conceptOptions.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </Select>
          <Select label="상태" value={status} onChange={(value) => setStatus(value as StatusFilter)}>
            <option value="all">전체</option>
            <option value="unanswered">미풀이</option>
            <option value="revealed">정답 확인</option>
            <option value="correct">맞힘</option>
            <option value="wrong">재검토</option>
          </Select>
        </div>
      </section>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          현재 표시 {filteredQuestions.length}문항 · {viewOrder === "lecture" ? "강의순" : "시험지순"}
        </div>
        <button
          type="button"
          onClick={() => void resetYear()}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
        >
          <RotateCcw size={15} />
          연도 풀이 초기화
        </button>
      </div>

      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <PastExamQuestionCard
            key={question.id}
            question={question}
            selected={selected[question.id]}
            answerRevealed={answerRevealed[question.id]}
            explanationExpanded={explanationExpanded[question.id]}
            onSelect={selectChoice}
            onToggleAnswer={toggleAnswer}
            onToggleExplanation={toggleExplanation}
          />
        ))}
      </div>

      <PastExamModeDock
        tone="emerald"
        scope={scope}
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
        onScopeChange={setScope}
        onRevealAnswers={() => setAnswerVisibilityForQuestions(scopeQuestions, true)}
        onHideAnswers={() => setAnswerVisibilityForQuestions(scopeQuestions, false)}
        onExpandExplanations={() => setExplanationForQuestions(scopeQuestions, true)}
        onCollapseExplanations={() => setExplanationForQuestions(scopeQuestions, false)}
        onResetProgress={() => void resetYear()}
      />
    </div>
  );
}

function ProgressBox({ label, value, tone }: { label: string; value: string; tone: "emerald" | "amber" | "blue" | "rose" }) {
  const style = {
    emerald: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
    amber: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-100",
    blue: "bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-100",
    rose: "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-100",
  }[tone];

  return (
    <div className={`rounded-lg px-3 py-2 ${style}`}>
      <div className="text-xs font-bold opacity-80">{label}</div>
      <div className="mt-1 text-lg font-black">{value}</div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-gray-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-900"
      >
        {children}
      </select>
    </label>
  );
}
