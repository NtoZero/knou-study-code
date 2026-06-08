"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Calculator,
  ExternalLink,
  Filter,
  FileText,
  Flame,
  LayoutGrid,
  RotateCcw,
  Search,
  Table2,
  X,
} from "lucide-react";
import { securityLectures } from "@/lib/constants";
import type { SecurityChoiceKey, SecurityPastExamQuestion } from "@/components/securityPastExam/types";
import {
  securityFrequentConceptCategories,
  securityFrequentConcepts,
  securityFrequentConceptYears,
  type SecurityFrequentConcept,
  type SecurityFrequentConceptCategory,
} from "./data";

type SortMode = "frequency-desc" | "frequency-asc" | "label" | "category";
type ViewMode = "cards" | "table";
type YearFilter = "전체" | (typeof securityFrequentConceptYears)[number];

const PastExamQuestionCard = dynamic(
  () => import("@/components/securityPastExam/PastExamQuestionCard"),
  {
    loading: () => (
      <div className="rounded-lg border border-gray-200 bg-white p-5 text-sm font-semibold text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
        문항 카드를 불러오는 중입니다.
      </div>
    ),
  },
);

const categoryStyles: Record<SecurityFrequentConceptCategory, string> = {
  "보안 목표": "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200",
  "암호 기초": "border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-100",
  "인증": "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-100",
  "공격 유형": "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100",
  "서버·PC 보안": "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
  "네트워크 보안": "border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-100",
  "방화벽·VPN": "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-100",
  "IDS·IPS": "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800 dark:border-fuchsia-900 dark:bg-fuchsia-950/40 dark:text-fuchsia-100",
  "이메일 보안": "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
  "웹·무선 보안": "border-pink-200 bg-pink-50 text-pink-800 dark:border-pink-900 dark:bg-pink-950/40 dark:text-pink-100",
  "디지털 포렌식": "border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100",
};

function frequencyTone(frequency: number, active = false) {
  const ring = active ? " ring-2 ring-gray-950 ring-offset-2 dark:ring-white" : "";

  if (frequency >= 8) {
    return {
      label: "최빈출",
      className: `border-rose-700 bg-rose-600 text-white${ring}`,
      bar: "bg-rose-600",
      text: "text-rose-700 dark:text-rose-300",
    };
  }
  if (frequency >= 5) {
    return {
      label: "고빈출",
      className: `border-orange-500 bg-orange-400 text-gray-950${ring}`,
      bar: "bg-orange-500",
      text: "text-orange-700 dark:text-orange-300",
    };
  }
  if (frequency >= 3) {
    return {
      label: "반복",
      className: `border-amber-400 bg-amber-200 text-gray-950${ring}`,
      bar: "bg-amber-400",
      text: "text-amber-700 dark:text-amber-300",
    };
  }
  if (frequency >= 2) {
    return {
      label: "재출제",
      className: `border-sky-300 bg-sky-100 text-sky-900${ring}`,
      bar: "bg-sky-400",
      text: "text-sky-700 dark:text-sky-300",
    };
  }
  return {
    label: "1회",
    className: `border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300${ring}`,
    bar: "bg-gray-300 dark:bg-gray-700",
    text: "text-gray-600 dark:text-gray-300",
  };
}

function lectureTitle(id: number) {
  const lecture = securityLectures.find((item) => item.id === id);
  return lecture ? `${id}강 ${lecture.title}` : `${id}강`;
}

function matchesConcept(concept: SecurityFrequentConcept, query: string) {
  const haystack = [
    concept.label,
    concept.category,
    concept.definition,
    concept.examCue,
    concept.sourceLabel,
    ...concept.surrounding,
    ...concept.variants,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase().trim());
}

function sortConcepts(concepts: SecurityFrequentConcept[], sort: SortMode) {
  return [...concepts].sort((a, b) => {
    if (sort === "frequency-asc") return a.frequency - b.frequency || a.label.localeCompare(b.label, "ko");
    if (sort === "label") return a.label.localeCompare(b.label, "ko");
    if (sort === "category") {
      return (
        securityFrequentConceptCategories.indexOf(a.category) -
          securityFrequentConceptCategories.indexOf(b.category) ||
        b.frequency - a.frequency ||
        a.label.localeCompare(b.label, "ko")
      );
    }
    return b.frequency - a.frequency || a.label.localeCompare(b.label, "ko");
  });
}

function examQuestionHref(ref: string) {
  const [year, number] = ref.split("-");
  return `/security/past-exam?year=${year}#${examQuestionId(ref)}`;
}

function examQuestionId(ref: string) {
  const [year, number] = ref.split("-");
  return `security-${year}-${Number(number)}`;
}

function examQuestionLabel(ref: string) {
  const [year, number] = ref.split("-");
  return `${year}년 ${Number(number)}번`;
}

export default function SecurityFrequentConceptsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SecurityFrequentConceptCategory | "전체">("전체");
  const [year, setYear] = useState<YearFilter>("전체");
  const [minFrequency, setMinFrequency] = useState(1);
  const [sort, setSort] = useState<SortMode>("frequency-desc");
  const [view, setView] = useState<ViewMode>("cards");
  const [selectedId, setSelectedId] = useState(securityFrequentConcepts[0].id);
  const previewRequestRef = useRef(0);
  const previewReturnFocusRef = useRef<HTMLElement | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<SecurityPastExamQuestion | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [loadingQuestionId, setLoadingQuestionId] = useState<string | null>(null);
  const [modalSelected, setModalSelected] = useState<Record<string, SecurityChoiceKey>>({});
  const [modalRevealed, setModalRevealed] = useState<Record<string, boolean>>({});

  const filteredConcepts = useMemo(() => {
    const base = securityFrequentConcepts.filter((concept) => {
      if (query.trim() && !matchesConcept(concept, query)) return false;
      if (category !== "전체" && concept.category !== category) return false;
      if (year !== "전체" && !concept.years.includes(year)) return false;
      if (concept.frequency < minFrequency) return false;
      return true;
    });
    return sortConcepts(base, sort);
  }, [query, category, year, minFrequency, sort]);

  const selectedConcept =
    filteredConcepts.find((concept) => concept.id === selectedId) ??
    filteredConcepts[0] ??
    securityFrequentConcepts[0];

  const totalAppearances = securityFrequentConcepts.reduce(
    (sum, concept) => sum + concept.frequency,
    0,
  );
  const highYieldCount = securityFrequentConcepts.filter((concept) => concept.frequency >= 5).length;
  const maxFrequency = Math.max(...securityFrequentConcepts.map((concept) => concept.frequency));

  const categoryCounts = securityFrequentConceptCategories.map((item) => ({
    category: item,
    count: securityFrequentConcepts.filter((concept) => concept.category === item).length,
  }));

  function resetFilters() {
    setQuery("");
    setCategory("전체");
    setYear("전체");
    setMinFrequency(1);
    setSort("frequency-desc");
  }

  async function openQuestionPreview(ref: string, trigger: HTMLElement) {
    const requestId = previewRequestRef.current + 1;
    const questionId = examQuestionId(ref);
    previewRequestRef.current = requestId;
    previewReturnFocusRef.current = trigger;
    setPreviewError(null);
    setLoadingQuestionId(questionId);

    try {
      const { securityPastExamQuestions } = await import("@/components/securityPastExam/data");
      const question =
        securityPastExamQuestions.find((item) => item.id === questionId) ?? null;

      if (previewRequestRef.current !== requestId) return;

      if (!question) {
        setPreviewError(`${examQuestionLabel(ref)} 문항 데이터를 찾지 못했습니다.`);
        return;
      }

      setActiveQuestion(question);
    } catch {
      if (previewRequestRef.current === requestId) {
        setPreviewError("문항 미리보기를 불러오지 못했습니다.");
      }
    } finally {
      if (previewRequestRef.current === requestId) {
        setLoadingQuestionId(null);
      }
    }
  }

  const closeQuestionPreview = useCallback(() => {
    setActiveQuestion(null);
    window.setTimeout(() => previewReturnFocusRef.current?.focus(), 0);
  }, []);

  function selectModalChoice(questionId: string, choice: SecurityChoiceKey) {
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
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-100">
              <Flame size={14} />
              2015-2019 기출 개념
            </div>
            <h1 className="text-2xl font-black text-gray-950 dark:text-gray-50 sm:text-3xl">
              컴퓨터보안 빈출 개념 정리
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
              기출에 한 번 이상 등장한 개념을 강의·교재 표현 중심으로 묶고, 연도별 출제 문항을
              카드형 미리보기로 확인할 수 있게 정리합니다. 반복 정도에 따라 색을 달리 표시합니다.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs sm:min-w-[420px]">
            <StatBox label="개념" value={securityFrequentConcepts.length} />
            <StatBox label="등장" value={totalAppearances} />
            <StatBox label="고빈도" value={highYieldCount} />
          </div>
        </div>
      </header>

      <section className="mb-6 border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
          <Filter size={16} />
          필터
        </div>

        <div className="grid gap-3 xl:grid-cols-[1.3fr_0.85fr_0.8fr_0.8fr_0.8fr_auto]">
          <label className="relative block">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="개념, 약어, 출제 단서 검색"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none transition-colors focus:border-rose-400 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as SecurityFrequentConceptCategory | "전체")
            }
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="전체">전체 분류</option>
            {securityFrequentConceptCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(event) =>
              setYear(
                event.target.value === "전체"
                  ? "전체"
                  : (Number(event.target.value) as YearFilter),
              )
            }
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="전체">전체 연도</option>
            {securityFrequentConceptYears.map((item) => (
              <option key={item} value={item}>
                {item}년
              </option>
            ))}
          </select>

          <select
            value={minFrequency}
            onChange={(event) => setMinFrequency(Number(event.target.value))}
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value={1}>1회 이상</option>
            <option value={2}>2회 이상</option>
            <option value={3}>3회 이상</option>
            <option value={5}>5회 이상</option>
            <option value={8}>8회 이상</option>
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortMode)}
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="frequency-desc">빈도 높은순</option>
            <option value="frequency-asc">빈도 낮은순</option>
            <option value="label">가나다순</option>
            <option value="category">분류순</option>
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <RotateCcw size={15} />
            초기화
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {categoryCounts.map((item) => (
              <button
                key={item.category}
                type="button"
                onClick={() => setCategory(item.category)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                  category === item.category
                    ? categoryStyles[item.category]
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                }`}
              >
                {item.category} {item.count}
              </button>
            ))}
          </div>

          <div className="inline-flex w-fit rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-gray-900">
            <button
              type="button"
              onClick={() => setView("cards")}
              className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-bold ${
                view === "cards"
                  ? "bg-white text-gray-950 shadow-sm dark:bg-gray-800 dark:text-gray-50"
                  : "text-gray-500"
              }`}
            >
              <LayoutGrid size={14} />
              카드
            </button>
            <button
              type="button"
              onClick={() => setView("table")}
              className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-bold ${
                view === "table"
                  ? "bg-white text-gray-950 shadow-sm dark:bg-gray-800 dark:text-gray-50"
                  : "text-gray-500"
              }`}
            >
              <Table2 size={14} />표
            </button>
          </div>
        </div>
      </section>

      <section className="mb-6 grid gap-2 sm:grid-cols-5">
        {[
          { label: "1회", value: "단발", sample: 1 },
          { label: "2회", value: "재출제", sample: 2 },
          { label: "3-4회", value: "반복", sample: 3 },
          { label: "5-7회", value: "고빈출", sample: 5 },
          { label: "8회+", value: "최빈출", sample: 8 },
        ].map((item) => {
          const tone = frequencyTone(item.sample);
          return (
            <div
              key={item.label}
              className={`rounded-lg border px-3 py-2 text-xs font-bold ${tone.className}`}
            >
              <div>{item.label}</div>
              <div className="mt-0.5 opacity-80">{item.value}</div>
            </div>
          );
        })}
      </section>

      <main className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.75fr)]">
        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-gray-950 dark:text-gray-50">
                필터 결과 {filteredConcepts.length}개
              </h2>
              <p className="text-sm text-gray-500">
                색상은 같은 개념이 등장한 문항 수 기준입니다.
              </p>
            </div>
          </div>

          {filteredConcepts.length === 0 ? (
            <div className="border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-950">
              조건에 맞는 개념이 없습니다.
            </div>
          ) : view === "cards" ? (
            <div className="grid gap-3 md:grid-cols-2">
              {filteredConcepts.map((concept) => (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                  maxFrequency={maxFrequency}
                  selected={selectedConcept.id === concept.id}
                  onSelect={() => setSelectedId(concept.id)}
                />
              ))}
            </div>
          ) : (
            <ConceptTable
              concepts={filteredConcepts}
              selectedId={selectedConcept.id}
              onSelect={setSelectedId}
            />
          )}
        </section>

        <ConceptDetail
          concept={selectedConcept}
          loadingQuestionId={loadingQuestionId}
          onOpenQuestion={openQuestionPreview}
        />
      </main>

      {previewError && (
        <div
          role="alert"
          className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800 shadow-lg dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100"
        >
          {previewError}
        </div>
      )}

      {activeQuestion && (
        <QuestionPreviewModal
          question={activeQuestion}
          selected={modalSelected[activeQuestion.id]}
          revealed={Boolean(modalRevealed[activeQuestion.id])}
          onSelect={selectModalChoice}
          onReveal={toggleModalReveal}
          onClose={closeQuestionPreview}
        />
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-3 dark:border-gray-800 dark:bg-gray-950">
      <div className="font-mono text-xl font-black text-gray-950 dark:text-gray-50">{value}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  );
}

function ConceptCard({
  concept,
  maxFrequency,
  selected,
  onSelect,
}: {
  concept: SecurityFrequentConcept;
  maxFrequency: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const tone = frequencyTone(concept.frequency, selected);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-lg border bg-white p-4 text-left shadow-sm transition-transform hover:-translate-y-0.5 dark:bg-gray-950 ${
        selected ? "border-gray-950 dark:border-white" : "border-gray-200 dark:border-gray-800"
      }`}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${tone.className}`}>
          {concept.frequency}회 · {tone.label}
        </span>
        <span className={`rounded-lg border px-2 py-1 text-xs font-semibold ${categoryStyles[concept.category]}`}>
          {concept.category}
        </span>
      </div>

      <h3 className="text-base font-black leading-6 text-gray-950 dark:text-gray-50">
        {concept.label}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
        {concept.definition}
      </p>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className={`h-full rounded-full ${tone.bar}`}
          style={{ width: `${Math.max(10, (concept.frequency / maxFrequency) * 100)}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {concept.years.map((item) => (
          <span
            key={`${concept.id}-${item}`}
            className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {concept.variants.slice(0, 4).map((item) => (
          <span
            key={`${concept.id}-${item}`}
            className="rounded-full border border-gray-200 px-2 py-0.5 text-[11px] text-gray-500 dark:border-gray-800 dark:text-gray-400"
          >
            {item}
          </span>
        ))}
      </div>
    </button>
  );
}

function ConceptTable({
  concepts,
  selectedId,
  onSelect,
}: {
  concepts: SecurityFrequentConcept[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <table className="min-w-[760px] w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900">
          <tr>
            <th className="px-4 py-3">개념</th>
            <th className="px-4 py-3">분류</th>
            <th className="px-4 py-3">빈도</th>
            <th className="px-4 py-3">연도</th>
            <th className="px-4 py-3">강의</th>
          </tr>
        </thead>
        <tbody>
          {concepts.map((concept) => {
            const tone = frequencyTone(concept.frequency, selectedId === concept.id);
            return (
              <tr
                key={concept.id}
                className={`cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900 ${
                  selectedId === concept.id ? "bg-rose-50/60 dark:bg-rose-950/20" : ""
                }`}
                onClick={() => onSelect(concept.id)}
              >
                <td className="px-4 py-3 font-bold text-gray-950 dark:text-gray-50">
                  {concept.label}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-lg border px-2 py-1 text-xs font-semibold ${categoryStyles[concept.category]}`}>
                    {concept.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-lg border px-2 py-1 text-xs font-bold ${tone.className}`}>
                    {concept.frequency}회
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {concept.years.join(", ")}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {concept.lectureIds.map((id) => `${id}강`).join(", ")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ConceptDetail({
  concept,
  loadingQuestionId,
  onOpenQuestion,
}: {
  concept: SecurityFrequentConcept;
  loadingQuestionId: string | null;
  onOpenQuestion: (ref: string, trigger: HTMLElement) => void;
}) {
  const tone = frequencyTone(concept.frequency);

  return (
    <aside className="xl:sticky xl:top-16 xl:self-start">
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${tone.className}`}>
            {concept.frequency}회 · {tone.label}
          </span>
          <span className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${categoryStyles[concept.category]}`}>
            {concept.category}
          </span>
          {concept.note && (
            <span className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-500 dark:border-gray-800 dark:text-gray-300">
              {concept.note}
            </span>
          )}
        </div>

        <h2 className="text-xl font-black leading-7 text-gray-950 dark:text-gray-50">
          {concept.label}
        </h2>
        <p className="mt-2 text-sm font-semibold text-gray-500">{concept.sourceLabel}</p>

        <div className="mt-5 space-y-5">
          <DetailBlock title="개념 정리">{concept.definition}</DetailBlock>
          <DetailBlock title="기출 단서">{concept.examCue}</DetailBlock>
          <ConceptVisuals visuals={concept.visuals} />

          <div>
            <div className="mb-2 text-sm font-bold text-gray-950 dark:text-gray-50">
              주변 개념
            </div>
            <div className="flex flex-wrap gap-2">
              {concept.surrounding.map((item) => (
                <span
                  key={`${concept.id}-${item}`}
                  className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-900 dark:text-gray-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {concept.special === "radix64" && <Radix64Calculator />}
          {concept.special === "pgp" && <PgpSteps />}
          {concept.special === "forensic" && <ForensicSteps />}

          <div>
            <div className="mb-2 text-sm font-bold text-gray-950 dark:text-gray-50">
              출제 문항
            </div>
            <div className="flex flex-wrap gap-1.5">
              {concept.refs.map((ref) => (
                <button
                  type="button"
                  key={`${concept.id}-${ref}`}
                  onClick={(event) => onOpenQuestion(ref, event.currentTarget)}
                  title={`${examQuestionLabel(ref)} 문항 미리보기`}
                  disabled={loadingQuestionId === examQuestionId(ref)}
                  className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs font-mono font-semibold text-gray-600 transition-colors hover:bg-cyan-100 hover:text-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-cyan-950 dark:hover:text-cyan-100"
                >
                  <FileText size={12} />
                  {loadingQuestionId === examQuestionId(ref) ? "불러오는 중" : ref}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-bold text-gray-950 dark:text-gray-50">
              연결 강의
            </div>
            <div className="flex flex-wrap gap-2">
              {concept.lectureIds.map((id) => (
                <Link
                  key={`${concept.id}-${id}`}
                  href={`/security/lecture/${id}`}
                  className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-800 transition-colors hover:bg-cyan-100 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-100"
                >
                  <BookOpen size={13} />
                  {lectureTitle(id)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ConceptVisuals({ visuals }: { visuals: SecurityFrequentConcept["visuals"] }) {
  if (!visuals?.length) return null;

  return (
    <div className="space-y-3">
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
            sizes="(min-width: 1280px) 28vw, (min-width: 768px) 50vw, 92vw"
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

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
      ].join(","),
    ),
  ).filter((element) => !element.hasAttribute("disabled") && element.offsetParent !== null);
}

function QuestionPreviewModal({
  question,
  selected,
  revealed,
  onSelect,
  onReveal,
  onClose,
}: {
  question: SecurityPastExamQuestion;
  selected?: SecurityChoiceKey;
  revealed: boolean;
  onSelect: (questionId: string, choice: SecurityChoiceKey) => void;
  onReveal: (questionId: string) => void;
  onClose: () => void;
}) {
  const ref = `${question.year}-${String(question.number).padStart(2, "0")}`;
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const titleId = `question-preview-${question.id}`;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = getFocusableElements(dialogRef.current);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <button
        type="button"
        aria-label="문항 미리보기 닫기"
        tabIndex={-1}
        className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 mx-auto flex max-h-[calc(100vh-1.5rem)] max-w-4xl flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950 sm:max-h-[calc(100vh-3rem)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800 sm:px-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-bold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-100">
              <FileText size={13} />
              출제 문항 미리보기
            </div>
            <h2 id={titleId} className="mt-2 text-lg font-black text-gray-950 dark:text-gray-50">
              {question.year}년 {question.number}번
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={examQuestionHref(ref)}
              className="inline-flex items-center gap-1 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-800 transition-colors hover:bg-cyan-100 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-100"
            >
              <ExternalLink size={14} />
              기출분석에서 열기
            </Link>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <X size={17} />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900 sm:p-5">
          <PastExamQuestionCard
            question={question}
            selected={selected}
            revealed={revealed}
            onSelect={onSelect}
            onReveal={onReveal}
          />
        </div>
      </div>
    </div>
  );
}

function DetailBlock({ title, children }: { title: string; children: string }) {
  return (
    <div className="border-l-2 border-gray-300 pl-3 dark:border-gray-700">
      <div className="text-sm font-bold text-gray-950 dark:text-gray-50">{title}</div>
      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">{children}</p>
    </div>
  );
}

function Radix64Calculator() {
  const [bytes, setBytes] = useState(9);
  const slots = Math.ceil(bytes / 3) * 4;
  const padChars = bytes % 3 === 0 ? 0 : 3 - (bytes % 3);
  const withoutPad = slots - padChars;
  const bits = bytes * 8;

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
      <div className="mb-3 flex items-center gap-2 text-sm font-black text-emerald-900 dark:text-emerald-100">
        <Calculator size={16} />
        Radix-64 계산
      </div>
      <label className="text-xs font-bold text-emerald-900 dark:text-emerald-100">
        입력 바이트: {bytes}B
      </label>
      <input
        type="range"
        min={1}
        max={18}
        value={bytes}
        onChange={(event) => setBytes(Number(event.target.value))}
        className="mt-2 w-full accent-emerald-600"
      />
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
        <MiniMetric label="비트 수" value={`${bits}bit`} />
        <MiniMetric label="패드 제외" value={`${withoutPad}문자`} />
        <MiniMetric label="패드 포함" value={`${slots}문자`} />
      </div>
      <p className="mt-3 text-xs leading-5 text-emerald-900 dark:text-emerald-100">
        기출의 단서처럼 마지막 패드 문자를 고려하지 않으면 {bits}bit를 6bit 단위로 나눈 값,
        즉 {withoutPad}문자로 계산합니다.
      </p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white px-3 py-2 dark:bg-gray-950">
      <div className="text-[11px] font-semibold text-gray-500">{label}</div>
      <div className="font-mono text-base font-black text-gray-950 dark:text-gray-50">{value}</div>
    </div>
  );
}

function PgpSteps() {
  const steps = ["전자서명", "압축", "세션키 암호화", "수신자 공개키로 세션키 보호", "Radix-64 변환"];

  return (
    <div className="rounded-lg border border-emerald-200 bg-white p-4 dark:border-emerald-900 dark:bg-gray-950">
      <div className="mb-3 text-sm font-black text-gray-950 dark:text-gray-50">PGP 송신 흐름</div>
      <ol className="space-y-2">
        {steps.map((step, index) => (
          <li key={step} className="flex items-center gap-3 text-sm">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white">
              {index + 1}
            </span>
            <span className="text-gray-700 dark:text-gray-200">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ForensicSteps() {
  const steps = ["사전준비", "증거수집", "포장 및 이송", "조사분석", "정밀검토", "보고서 작성"];

  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/20">
      <div className="mb-3 text-sm font-black text-indigo-900 dark:text-indigo-100">
        절차 순서
      </div>
      <div className="grid gap-2">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-3 text-sm">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-xs font-black text-white">
              {index + 1}
            </span>
            <span className="font-semibold text-indigo-950 dark:text-indigo-100">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
