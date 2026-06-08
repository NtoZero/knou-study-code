"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BookOpenCheck, Flame, RotateCcw } from "lucide-react";
import { softwareLectures } from "@/lib/constants";
import PastExamModeDock from "@/components/pastExam/PastExamModeDock";
import {
  softwarePastExamQuestions,
  softwarePastExamYears,
} from "./data";
import PastExamQuestionCard from "./PastExamQuestionCard";
import type { SoftwareChoiceKey, SoftwarePastExamQuestion, SoftwarePastExamYear } from "./types";

type StatusFilter = "all" | "unanswered" | "revealed" | "correct" | "wrong";
type Scope = "visible" | "year";

function parseYear(value: string | null) {
  const year = Number(value);
  return softwarePastExamYears.includes(year as SoftwarePastExamYear)
    ? (year as SoftwarePastExamYear)
    : null;
}

export default function SoftwarePastExamWorkbook() {
  const pendingHashRef = useRef<string | null>(null);
  const [year, setYear] = useState<SoftwarePastExamYear>(2019);
  const [lectureId, setLectureId] = useState<number | "all">("all");
  const [conceptTag, setConceptTag] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [scope, setScope] = useState<Scope>("visible");
  const [selected, setSelected] = useState<Record<string, SoftwareChoiceKey>>({});
  const [answerRevealed, setAnswerRevealed] = useState<Record<string, boolean>>({});
  const [explanationExpanded, setExplanationExpanded] = useState<Record<string, boolean>>({});

  const yearQuestions = useMemo(
    () => softwarePastExamQuestions.filter((question) => question.year === year),
    [year],
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
    });
  }, [answerRevealed, conceptTag, lectureId, selected, status, yearQuestions]);

  useEffect(() => {
    const linkedYear = parseYear(new URLSearchParams(window.location.search).get("year"));
    pendingHashRef.current = window.location.hash ? window.location.hash.slice(1) : null;
    if (linkedYear) setYear(linkedYear);
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
  }, [filteredQuestions.length, year]);

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
  }

  function resetYear() {
    const ids = new Set(yearQuestions.map((question) => question.id));
    setSelected((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
    setAnswerRevealed((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
    setExplanationExpanded((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.has(id))));
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
            <ProgressBox label="선택" value={`${answeredCount}/35`} tone="emerald" />
            <ProgressBox label="확인" value={`${answerRevealedCount}/35`} tone="amber" />
            <ProgressBox label="맞힘" value={`${correctCount}`} tone="blue" />
            <ProgressBox label="재검토" value={`${wrongCount}`} tone="rose" />
          </div>
        </div>
      </header>

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="grid gap-3 md:grid-cols-4">
          <Select label="연도" value={String(year)} onChange={(value) => setYear(Number(value) as SoftwarePastExamYear)}>
            {softwarePastExamYears.map((item) => (
              <option key={item} value={item}>{item}년</option>
            ))}
          </Select>
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
          현재 표시 {filteredQuestions.length}문항
        </div>
        <button
          type="button"
          onClick={resetYear}
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
            onSelect={(questionId, choice) => setSelected((prev) => ({ ...prev, [questionId]: choice }))}
            onToggleAnswer={(questionId) => {
              const next = !answerRevealed[questionId];
              setAnswerRevealed((prev) => ({ ...prev, [questionId]: next }));
              if (!next) setExplanationExpanded((prev) => ({ ...prev, [questionId]: false }));
            }}
            onToggleExplanation={(questionId) => {
              setAnswerRevealed((prev) => ({ ...prev, [questionId]: true }));
              setExplanationExpanded((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
            }}
          />
        ))}
      </div>

      <PastExamModeDock
        tone="emerald"
        scope={scope}
        totalScopeLabel="연도 전체"
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
        onResetProgress={resetYear}
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
