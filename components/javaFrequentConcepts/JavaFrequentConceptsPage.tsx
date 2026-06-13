"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BookOpenCheck, Flame, Search, X } from "lucide-react";
import { javaPastExamQuestionById } from "@/components/javaPastExam/data";
import PastExamQuestionCard from "@/components/javaPastExam/PastExamQuestionCard";
import type { JavaChoiceKey, JavaPastExamQuestion } from "@/components/javaPastExam/types";
import { javaFrequentConceptCategories, javaFrequentConcepts } from "./data";

type SortMode = "frequency" | "label" | "lecture";

function questionIdFromRef(ref: string) {
  const [year, number] = ref.split("-");
  return `java-${year}-${Number(number)}`;
}

function frequencyLabel(frequency: number) {
  if (frequency >= 8) return "최빈출";
  if (frequency >= 5) return "고빈출";
  if (frequency >= 3) return "반복";
  if (frequency === 2) return "재출제";
  return "1회";
}

function frequencyClass(frequency: number) {
  if (frequency >= 8) return "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-100";
  if (frequency >= 5) return "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100";
  if (frequency >= 3) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100";
  if (frequency === 2) return "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-100";
  return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200";
}

export default function JavaFrequentConceptsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [year, setYear] = useState<number | "all">("all");
  const [minFrequency, setMinFrequency] = useState(1);
  const [sortMode, setSortMode] = useState<SortMode>("frequency");
  const [selectedQuestion, setSelectedQuestion] = useState<JavaPastExamQuestion | null>(null);
  const [selected, setSelected] = useState<Record<string, JavaChoiceKey>>({});
  const [answerRevealed, setAnswerRevealed] = useState<Record<string, boolean>>({});
  const [explanationExpanded, setExplanationExpanded] = useState<Record<string, boolean>>({});
  const modalDialogRef = useRef<HTMLDivElement | null>(null);
  const modalCloseRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);

  const years = useMemo(
    () => Array.from(new Set(javaFrequentConcepts.flatMap((concept) => concept.years))).sort((a, b) => b - a),
    [],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return javaFrequentConcepts
      .filter((concept) => category === "all" || concept.category === category)
      .filter((concept) => year === "all" || concept.years.includes(year))
      .filter((concept) => concept.frequency >= minFrequency)
      .filter((concept) => {
        if (!needle) return true;
        return [
          concept.label,
          concept.category,
          concept.definition,
          concept.examCue,
          concept.sourceLabel,
          ...concept.surrounding,
          ...concept.variants,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      })
      .sort((a, b) => {
        if (sortMode === "label") return a.label.localeCompare(b.label, "ko");
        if (sortMode === "lecture") {
          return a.lectureIds[0] - b.lectureIds[0] || b.frequency - a.frequency;
        }
        return b.frequency - a.frequency || a.label.localeCompare(b.label, "ko");
      });
  }, [category, minFrequency, query, sortMode, year]);

  function openQuestion(ref: string) {
    const question = javaPastExamQuestionById.get(questionIdFromRef(ref));
    if (!question) {
      throw new Error(`Java 기출 문항을 찾을 수 없습니다: ${ref}`);
    }
    previousFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSelectedQuestion(question);
  }

  function closeQuestionPreview() {
    setSelectedQuestion(null);
  }

  useEffect(() => {
    if (!selectedQuestion) return undefined;

    const focusTimer = window.setTimeout(() => modalCloseRef.current?.focus(), 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeQuestionPreview();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        modalDialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((element) => !element.hasAttribute("disabled"));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusedElementRef.current?.focus();
    };
  }, [selectedQuestion]);

  const totalRefs = javaFrequentConcepts.reduce((sum, concept) => sum + concept.refs.length, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:pt-10">
      <header className="mb-8 rounded-lg border border-amber-200 bg-white p-5 shadow-sm dark:border-amber-900 dark:bg-gray-950 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-100">
              <Flame size={14} />
              2017-2019 기출 문항 기반
            </div>
            <h1 className="text-2xl font-bold text-gray-950 dark:text-gray-50 sm:text-3xl">
              Java프로그래밍 빈출 개념
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
              한 번 이상 출제된 개념을 강의 용어로 묶고, 각 출제 기록을 눌러 코드형 기출 카드를 바로 확인.
            </p>
            <Link
              href="/java/past-exam"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100"
            >
              <BookOpenCheck size={16} />
              기출분석에서 풀기
            </Link>
          </div>
          <div className="grid min-w-0 grid-cols-3 gap-2 text-sm lg:min-w-[420px]">
            <Metric label="개념" value={`${javaFrequentConcepts.length}`} />
            <Metric label="출제 기록" value={`${totalRefs}`} />
            <Metric label="표시" value={`${filtered.length}`} />
          </div>
        </div>
      </header>

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="grid gap-3 lg:grid-cols-[1fr_12rem_9rem_9rem_10rem]">
          <label className="relative block">
            <span className="sr-only">검색</span>
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="개념, API, 시험 포인트 검색"
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm dark:border-gray-800 dark:bg-gray-900"
            />
          </label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <option value="all">전체 분류</option>
            {javaFrequentConceptCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(event) => setYear(event.target.value === "all" ? "all" : Number(event.target.value))}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <option value="all">전체 연도</option>
            {years.map((item) => (
              <option key={item} value={item}>
                {item}년
              </option>
            ))}
          </select>
          <select
            value={minFrequency}
            onChange={(event) => setMinFrequency(Number(event.target.value))}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <option value={1}>1회 이상</option>
            <option value={2}>2회 이상</option>
            <option value={5}>5회 이상</option>
            <option value={8}>8회 이상</option>
          </select>
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <option value="frequency">빈도순</option>
            <option value="lecture">강의순</option>
            <option value="label">가나다순</option>
          </select>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((concept) => (
          <article
            key={concept.id}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-black ${frequencyClass(concept.frequency)}`}>
                {frequencyLabel(concept.frequency)} · {concept.frequency}회
              </span>
              <span className="rounded-full border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-300">
                {concept.category}
              </span>
              <span className="text-xs font-semibold text-gray-500">{concept.sourceLabel}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-950 dark:text-gray-50">{concept.label}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">{concept.definition}</p>
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
              {concept.examCue}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {concept.surrounding.map((item) => (
                <span
                  key={`${concept.id}-${item}`}
                  className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {concept.refs.map((ref) => (
                <button
                  key={`${concept.id}-${ref}`}
                  type="button"
                  onClick={() => openQuestion(ref)}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100"
                >
                  {ref}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>

      {selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-gray-950/50 p-3 sm:items-center">
          <div
            ref={modalDialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedQuestion.year}년 ${selectedQuestion.number}번 기출 미리보기`}
            className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-2xl dark:bg-gray-950"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {selectedQuestion.year}년 {selectedQuestion.number}번 미리보기
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/java/past-exam?year=${selectedQuestion.year}#${selectedQuestion.id}`}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100"
                >
                  기출분석에서 열기
                </Link>
                <button
                  ref={modalCloseRef}
                  type="button"
                  onClick={closeQuestionPreview}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900"
                  aria-label="문항 미리보기 닫기"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <PastExamQuestionCard
                question={selectedQuestion}
                compact
                selected={selected[selectedQuestion.id]}
                answerRevealed={answerRevealed[selectedQuestion.id]}
                explanationExpanded={explanationExpanded[selectedQuestion.id]}
                onSelect={(questionId, choice) => setSelected((prev) => ({ ...prev, [questionId]: choice }))}
                onToggleAnswer={(questionId) => {
                  const nextVisible = !answerRevealed[questionId];
                  setAnswerRevealed((prev) => ({ ...prev, [questionId]: nextVisible }));
                  if (!nextVisible) {
                    setExplanationExpanded((prev) => ({ ...prev, [questionId]: false }));
                  }
                }}
                onToggleExplanation={(questionId) => {
                  setAnswerRevealed((prev) => ({ ...prev, [questionId]: true }));
                  setExplanationExpanded((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-center dark:border-gray-800 dark:bg-gray-900">
      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</div>
      <div className="mt-1 text-xl font-black text-gray-950 dark:text-gray-50">{value}</div>
    </div>
  );
}
