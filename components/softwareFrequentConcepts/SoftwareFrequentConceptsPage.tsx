"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpenCheck, Flame, Search, X } from "lucide-react";
import { softwarePastExamQuestions } from "@/components/softwarePastExam/data";
import PastExamQuestionCard from "@/components/softwarePastExam/PastExamQuestionCard";
import type { SoftwareChoiceKey, SoftwarePastExamQuestion } from "@/components/softwarePastExam/types";
import { softwareFrequentConcepts } from "./data";

function questionIdFromRef(ref: string) {
  const [year, number] = ref.split("-");
  return `software-${year}-${Number(number)}`;
}

export default function SoftwareFrequentConceptsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [minFrequency, setMinFrequency] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState<SoftwarePastExamQuestion | null>(null);
  const [selected, setSelected] = useState<Record<string, SoftwareChoiceKey>>({});
  const [answerRevealed, setAnswerRevealed] = useState<Record<string, boolean>>({});
  const [explanationExpanded, setExplanationExpanded] = useState<Record<string, boolean>>({});
  const modalDialogRef = useRef<HTMLDivElement | null>(null);
  const modalCloseRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(softwareFrequentConcepts.map((concept) => concept.category))).sort((a, b) => a.localeCompare(b, "ko")),
    [],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return softwareFrequentConcepts
      .filter((concept) => category === "all" || concept.category === category)
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
      .sort((a, b) => b.frequency - a.frequency || a.label.localeCompare(b.label, "ko"));
  }, [category, minFrequency, query]);

  function openQuestion(ref: string) {
    const question = softwarePastExamQuestions.find((item) => item.id === questionIdFromRef(ref));
    if (question) {
      previousFocusedElementRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setSelectedQuestion(question);
    }
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

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:pt-10">
      <header className="mb-8 rounded-lg border border-amber-200 bg-white p-5 shadow-sm dark:border-amber-900 dark:bg-gray-950 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-100">
              <Flame size={14} />
              2017-2019 기출 문항 기반
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">소프트웨어공학 빈출 개념</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
              한 번 이상 출제된 개념을 강의·교재 용어로 묶고, 각 출제 문항을 눌러 기출 카드로 바로 확인합니다.
            </p>
            <Link
              href="/software/past-exam"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100"
            >
              <BookOpenCheck size={16} />
              기출분석에서 풀기
            </Link>
          </div>
          <div className="grid min-w-0 grid-cols-3 gap-2 text-sm lg:min-w-[420px]">
            <Metric label="개념" value={`${softwareFrequentConcepts.length}`} />
            <Metric label="문항" value={`${softwareFrequentConcepts.reduce((sum, concept) => sum + concept.refs.length, 0)}`} />
            <Metric label="표시" value={`${filtered.length}`} />
          </div>
        </div>
      </header>

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="grid gap-3 lg:grid-cols-[1fr_13rem_10rem]">
          <label className="relative block">
            <span className="sr-only">검색</span>
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="개념, 표기, 시험 포인트 검색"
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm dark:border-gray-800 dark:bg-gray-900"
            />
          </label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <option value="all">전체 분류</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
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
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((concept) => (
          <article key={concept.id} className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-100">
                {concept.frequency}회
              </span>
              <span className="rounded-full border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-300">
                {concept.category}
              </span>
              <span className="text-xs font-semibold text-gray-500">{concept.sourceLabel}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-950 dark:text-gray-50">{concept.label}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">{concept.definition}</p>
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
              {concept.examCue}
            </p>
            {concept.visuals?.length ? (
              <div className="mt-4 space-y-3">
                {concept.visuals.map((visual) => (
                  <figure key={visual.src} className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                    <Image
                      src={visual.src}
                      alt={visual.alt}
                      width={visual.width}
                      height={visual.height}
                      sizes="(min-width: 1024px) 44vw, 92vw"
                      className="h-auto w-full bg-white"
                    />
                    <figcaption className="border-t border-gray-200 px-3 py-2 text-xs leading-5 text-gray-600 dark:border-gray-800 dark:text-gray-300">
                      <span className="font-bold text-gray-800 dark:text-gray-100">{visual.sourceLabel}</span>
                      {" · "}
                      {visual.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {concept.surrounding.map((item) => (
                <span key={item} className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300">
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
            className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-2xl dark:bg-gray-950"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {selectedQuestion.year}년 {selectedQuestion.number}번 미리보기
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/software/past-exam?year=${selectedQuestion.year}#${selectedQuestion.id}`}
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
                selected={selected[selectedQuestion.id]}
                answerRevealed={answerRevealed[selectedQuestion.id]}
                explanationExpanded={explanationExpanded[selectedQuestion.id]}
                onSelect={(questionId, choice) => setSelected((prev) => ({ ...prev, [questionId]: choice }))}
                onToggleAnswer={(questionId) => setAnswerRevealed((prev) => ({ ...prev, [questionId]: !prev[questionId] }))}
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
    <div className="rounded-lg bg-amber-50 px-3 py-2 text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
      <div className="text-xs font-bold opacity-80">{label}</div>
      <div className="mt-1 text-lg font-black">{value}</div>
    </div>
  );
}
