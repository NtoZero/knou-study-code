"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  BookOpenCheck,
  ExternalLink,
  Filter,
  Flame,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { algorithmLectures } from "@/lib/algorithmCourse";
import { algorithmPastExamQuestions } from "@/components/algorithmPastExam/data";
import PastExamQuestionCard from "@/components/algorithmPastExam/PastExamQuestionCard";
import type { ChoiceKey } from "@/components/algorithmPastExam/types";
import {
  algorithmFrequentConceptCategories,
  algorithmFrequentConcepts,
  algorithmFrequentConceptYears,
  type AlgorithmFrequentConcept,
  type AlgorithmFrequentConceptCategory,
} from "./data";

type SortMode = "frequency-desc" | "frequency-asc" | "label" | "category";
type YearFilter = "전체" | (typeof algorithmFrequentConceptYears)[number];

const categoryStyles: Record<AlgorithmFrequentConceptCategory, string> = {
  "기초·성능": "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100",
  "정렬": "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
  "탐색": "border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-100",
  "그래프": "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
  "동적 프로그래밍": "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800 dark:border-fuchsia-900 dark:bg-fuchsia-950/40 dark:text-fuchsia-100",
  "스트링·압축": "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-100",
  "NP": "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100",
};

function frequencyTone(frequency: number, active = false) {
  const ring = active ? " ring-2 ring-gray-950 ring-offset-2 dark:ring-white" : "";
  if (frequency >= 8) return `border-rose-700 bg-rose-600 text-white${ring}`;
  if (frequency >= 5) return `border-orange-500 bg-orange-400 text-gray-950${ring}`;
  if (frequency >= 3) return `border-amber-400 bg-amber-200 text-gray-950${ring}`;
  if (frequency >= 2) return `border-sky-300 bg-sky-100 text-sky-900${ring}`;
  return `border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300${ring}`;
}

function lectureTitle(id: number) {
  const lecture = algorithmLectures.find((item) => item.id === id);
  return lecture ? `${id}강 ${lecture.title}` : `${id}강`;
}

function questionHref(questionId: string) {
  const question = algorithmPastExamQuestions.find((item) => item.id === questionId);
  return question ? `/algorithm/past-exam?year=${question.year}#${question.id}` : "/algorithm/past-exam";
}

function questionLabel(questionId: string) {
  const question = algorithmPastExamQuestions.find((item) => item.id === questionId);
  return question ? `${question.year}년 ${question.number}번` : questionId;
}

function matchesConcept(concept: AlgorithmFrequentConcept, query: string) {
  const needle = query.toLowerCase().trim();
  if (!needle) return true;
  const haystack = [
    concept.label,
    concept.category,
    concept.sourceLabel,
    concept.definition,
    concept.examCue,
    concept.wrongRule,
    ...concept.variants,
  ].join(" ").toLowerCase();
  return haystack.includes(needle);
}

function sortConcepts(concepts: AlgorithmFrequentConcept[], sort: SortMode) {
  return [...concepts].sort((a, b) => {
    if (sort === "frequency-asc") return a.frequency - b.frequency || a.label.localeCompare(b.label, "ko");
    if (sort === "label") return a.label.localeCompare(b.label, "ko");
    if (sort === "category") {
      return (
        algorithmFrequentConceptCategories.indexOf(a.category) -
          algorithmFrequentConceptCategories.indexOf(b.category) ||
        b.frequency - a.frequency ||
        a.label.localeCompare(b.label, "ko")
      );
    }
    return b.frequency - a.frequency || a.label.localeCompare(b.label, "ko");
  });
}

function ConceptVisuals({ visuals }: { visuals: AlgorithmFrequentConcept["visuals"] }) {
  if (!visuals?.length) return null;

  return (
    <div className="mt-4 grid gap-3 lg:grid-cols-2">
      {visuals.map((visual) => (
        <figure
          key={visual.src}
          className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
        >
          <Image
            src={visual.src}
            alt={visual.alt}
            width={visual.width}
            height={visual.height}
            sizes="(min-width: 1280px) 36vw, (min-width: 768px) 46vw, 92vw"
            className="h-auto w-full bg-white"
          />
          <figcaption className="border-t border-gray-200 px-3 py-2 text-xs leading-5 text-gray-600 dark:border-gray-800 dark:text-gray-300">
            <span className="font-bold text-gray-800 dark:text-gray-100">
              {visual.sourceLabel}
            </span>
            {" · "}
            {visual.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function AlgorithmFrequentConceptsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<AlgorithmFrequentConceptCategory | "전체">("전체");
  const [year, setYear] = useState<YearFilter>("전체");
  const [minFrequency, setMinFrequency] = useState(1);
  const [sort, setSort] = useState<SortMode>("frequency-desc");
  const [selectedId, setSelectedId] = useState(algorithmFrequentConcepts[0].id);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [modalSelected, setModalSelected] = useState<Record<string, ChoiceKey>>({});
  const [modalRevealed, setModalRevealed] = useState<Record<string, boolean>>({});

  const filteredConcepts = useMemo(() => {
    const base = algorithmFrequentConcepts.filter((concept) => {
      if (!matchesConcept(concept, query)) return false;
      if (category !== "전체" && concept.category !== category) return false;
      if (year !== "전체" && !concept.years.includes(year)) return false;
      if (concept.frequency < minFrequency) return false;
      return true;
    });
    return sortConcepts(base, sort);
  }, [category, minFrequency, query, sort, year]);

  const selectedConcept =
    filteredConcepts.find((concept) => concept.id === selectedId) ??
    filteredConcepts[0] ??
    algorithmFrequentConcepts[0];
  const activeQuestion =
    algorithmPastExamQuestions.find((question) => question.id === activeQuestionId) ?? null;
  const totalAppearances = algorithmFrequentConcepts.reduce((sum, concept) => sum + concept.frequency, 0);
  const highYieldCount = algorithmFrequentConcepts.filter((concept) => concept.frequency >= 5).length;
  const maxFrequency = Math.max(...algorithmFrequentConcepts.map((concept) => concept.frequency));
  const categoryCounts = algorithmFrequentConceptCategories.map((item) => ({
    category: item,
    count: algorithmFrequentConcepts.filter((concept) => concept.category === item).length,
  }));

  function resetFilters() {
    setQuery("");
    setCategory("전체");
    setYear("전체");
    setMinFrequency(1);
    setSort("frequency-desc");
  }

  function selectModalChoice(questionId: string, choice: ChoiceKey) {
    setModalSelected((prev) => ({ ...prev, [questionId]: choice }));
  }

  function toggleModalReveal(questionId: string) {
    setModalRevealed((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <header className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-800">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100">
              <Flame size={14} />
              2017-2019 기출 개념
            </div>
            <h1 className="text-2xl font-black text-gray-950 dark:text-gray-50 sm:text-3xl">
              알고리즘 빈출 개념 정리
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
              105개 기출문항을 개념 단위로 묶어 빈도, 강의 근거, 오답 기준, 연결 문항을 한 화면에서 확인합니다.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
              <div className="font-mono text-lg font-bold">{algorithmFrequentConcepts.length}</div>
              <div className="text-gray-500">개념</div>
            </div>
            <div className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
              <div className="font-mono text-lg font-bold">{totalAppearances}</div>
              <div className="text-gray-500">연결</div>
            </div>
            <div className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
              <div className="font-mono text-lg font-bold">{highYieldCount}</div>
              <div className="text-gray-500">고빈도</div>
            </div>
          </div>
        </div>
      </header>

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
          <Filter size={16} />
          필터
        </div>
        <div className="grid gap-3 xl:grid-cols-[1.2fr_0.9fr_0.7fr_0.8fr_0.9fr_auto]">
          <label className="relative block">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="개념, 강의 근거, 오답 기준 검색"
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm dark:border-gray-700 dark:bg-gray-900"
            />
          </label>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as AlgorithmFrequentConceptCategory | "전체")}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="전체">전체 분류</option>
            {algorithmFrequentConceptCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(event) => setYear(event.target.value === "전체" ? "전체" : Number(event.target.value) as YearFilter)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="전체">전체 연도</option>
            {algorithmFrequentConceptYears.map((item) => (
              <option key={item} value={item}>
                {item}년
              </option>
            ))}
          </select>

          <select
            value={minFrequency}
            onChange={(event) => setMinFrequency(Number(event.target.value))}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value={1}>1회 이상</option>
            <option value={2}>2회 이상</option>
            <option value={3}>3회 이상</option>
            <option value={5}>5회 이상</option>
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortMode)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="frequency-desc">빈도 높은순</option>
            <option value="frequency-asc">빈도 낮은순</option>
            <option value="label">개념명순</option>
            <option value="category">분류순</option>
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <RotateCcw size={15} />
            초기화
          </button>
        </div>
      </section>

      <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {categoryCounts.map(({ category: item, count }) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`rounded-lg border p-3 text-left text-sm transition-transform hover:-translate-y-0.5 ${categoryStyles[item]}`}
          >
            <div className="font-bold">{item}</div>
            <div className="mt-1 font-mono text-lg font-black">{count}</div>
          </button>
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-3">
          {filteredConcepts.length > 0 ? (
            filteredConcepts.map((concept) => {
              const active = selectedConcept.id === concept.id;
              return (
                <article
                  key={concept.id}
                  className={`rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-950 ${
                    active ? "border-emerald-400 dark:border-emerald-600" : "border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedId(concept.id)}
                      className="min-w-0 text-left"
                    >
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${categoryStyles[concept.category]}`}>
                          {concept.category}
                        </span>
                        <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${frequencyTone(concept.frequency, active)}`}>
                          {concept.frequency}회
                        </span>
                      </div>
                      <h2 className="text-lg font-black text-gray-950 dark:text-gray-50">
                        {concept.label}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {concept.definition}
                      </p>
                    </button>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      {concept.lectureIds.map((lectureId) => (
                        <Link
                          key={`${concept.id}-${lectureId}`}
                          href={`/algorithm/lecture/${lectureId}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-900"
                        >
                          <BookOpen size={13} />
                          {lectureId}강
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-900">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${Math.max(8, (concept.frequency / maxFrequency) * 100)}%` }}
                    />
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div>
                      <div className="mb-1 text-xs font-bold uppercase text-emerald-700 dark:text-emerald-200">
                        기출 요구
                      </div>
                      <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                        {concept.examCue}
                      </p>
                    </div>
                    <div>
                      <div className="mb-1 text-xs font-bold uppercase text-emerald-700 dark:text-emerald-200">
                        오답 기준
                      </div>
                      <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                        {concept.wrongRule}
                      </p>
                    </div>
                  </div>

                  <ConceptVisuals visuals={concept.visuals} />

                  <div className="mt-4 flex flex-wrap gap-2">
                    {concept.questionIds.map((questionId) => (
                      <button
                        key={`${concept.id}-${questionId}`}
                        type="button"
                        onClick={() => setActiveQuestionId(questionId)}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-100 dark:hover:bg-emerald-900"
                      >
                        <BookOpenCheck size={13} />
                        {questionLabel(questionId)}
                      </button>
                    ))}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
              조건에 맞는 개념이 없습니다. 필터를 넓혀 다시 확인합니다.
            </div>
          )}
        </section>

        <aside className="h-fit rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 xl:sticky xl:top-16">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold">
            <Flame size={16} className="text-emerald-500" />
            선택 개념
          </div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${categoryStyles[selectedConcept.category]}`}>
              {selectedConcept.category}
            </span>
            <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${frequencyTone(selectedConcept.frequency, true)}`}>
              {selectedConcept.frequency}회
            </span>
          </div>
          <h2 className="text-lg font-black text-gray-950 dark:text-gray-50">
            {selectedConcept.label}
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {selectedConcept.sourceLabel}
          </p>

          <div className="mt-4 space-y-3 text-sm">
            <div>
              <div className="mb-1 font-bold text-gray-900 dark:text-gray-100">같이 보는 강의</div>
              <div className="flex flex-wrap gap-2">
                {selectedConcept.lectureIds.map((lectureId) => (
                  <Link
                    key={`selected-${lectureId}`}
                    href={`/algorithm/lecture/${lectureId}`}
                    className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-900"
                  >
                    {lectureTitle(lectureId)}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-1 font-bold text-gray-900 dark:text-gray-100">기출 바로가기</div>
              <div className="flex flex-wrap gap-2">
                {selectedConcept.questionIds.map((questionId) => (
                  <Link
                    key={`selected-link-${questionId}`}
                    href={questionHref(questionId)}
                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-100 dark:hover:bg-emerald-950/40"
                  >
                    {questionLabel(questionId)}
                    <ExternalLink size={12} />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-1 font-bold text-gray-900 dark:text-gray-100">태그</div>
              <div className="flex flex-wrap gap-2">
                {selectedConcept.variants.map((tag) => (
                  <span
                    key={`selected-tag-${tag}`}
                    className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-900 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {activeQuestion && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/70 px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveQuestionId(null)}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-gray-800 shadow-sm hover:bg-gray-100 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-900"
              >
                <X size={16} />
                닫기
              </button>
            </div>
            <PastExamQuestionCard
              question={activeQuestion}
              selected={modalSelected[activeQuestion.id]}
              revealed={Boolean(modalRevealed[activeQuestion.id])}
              onSelect={selectModalChoice}
              onReveal={toggleModalReveal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
