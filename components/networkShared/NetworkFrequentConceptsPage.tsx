"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Filter,
  Flame,
  LayoutList,
  RotateCcw,
  Search,
} from "lucide-react";
import { lectures } from "@/lib/constants";
import {
  networkFrequentConceptCategories,
  networkFrequentConcepts,
  type NetworkFrequentConcept,
  type NetworkFrequentConceptCategory,
} from "./examData";

type SortMode = "frequency-desc" | "frequency-asc" | "label" | "category";

const categoryStyles: Record<NetworkFrequentConceptCategory, string> = {
  "통신망 기초": "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-100",
  "프로토콜·계층": "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-100",
  "신호·전송": "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
  "오류·흐름 제어": "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100",
  "TCP/IP": "border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-100",
  "LAN": "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100",
  "보안": "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
};

function frequencyTone(frequency: number) {
  if (frequency >= 5) {
    return {
      label: "최빈출",
      className: "border-rose-700 bg-rose-600 text-white",
      bar: "bg-rose-600",
    };
  }
  if (frequency >= 4) {
    return {
      label: "고빈출",
      className: "border-orange-500 bg-orange-400 text-gray-950",
      bar: "bg-orange-500",
    };
  }
  if (frequency >= 3) {
    return {
      label: "반복",
      className: "border-amber-400 bg-amber-200 text-gray-950",
      bar: "bg-amber-400",
    };
  }
  return {
    label: "기본",
    className: "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300",
    bar: "bg-gray-300 dark:bg-gray-700",
  };
}

function lectureLabel(id: number) {
  const lecture = lectures.find((item) => item.id === id);
  return lecture ? `${id}강 ${lecture.title}` : `${id}강`;
}

function matchesConcept(concept: NetworkFrequentConcept, query: string) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return true;

  return [
    concept.label,
    concept.category,
    concept.definition,
    concept.examCue,
    concept.sourceLabel,
    ...concept.variants,
    ...concept.surrounding,
  ]
    .join(" ")
    .toLowerCase()
    .includes(keyword);
}

function sortConcepts(concepts: NetworkFrequentConcept[], sort: SortMode) {
  return [...concepts].sort((a, b) => {
    if (sort === "frequency-asc") return a.frequency - b.frequency || a.label.localeCompare(b.label, "ko");
    if (sort === "label") return a.label.localeCompare(b.label, "ko");
    if (sort === "category") {
      return (
        networkFrequentConceptCategories.indexOf(a.category) -
          networkFrequentConceptCategories.indexOf(b.category) ||
        b.frequency - a.frequency ||
        a.label.localeCompare(b.label, "ko")
      );
    }
    return b.frequency - a.frequency || a.label.localeCompare(b.label, "ko");
  });
}

function ConceptVisuals({ visuals }: { visuals: NetworkFrequentConcept["visuals"] }) {
  if (!visuals?.length) return null;

  return (
    <div className="mt-4 space-y-3">
      {visuals.map((visual) => (
        <figure
          key={visual.src}
          className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
        >
          <Image
            src={visual.src}
            alt={visual.alt}
            width={visual.width}
            height={visual.height}
            sizes="(min-width: 1024px) 46vw, 92vw"
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

export default function NetworkFrequentConceptsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<NetworkFrequentConceptCategory | "전체">("전체");
  const [minFrequency, setMinFrequency] = useState(1);
  const [sort, setSort] = useState<SortMode>("frequency-desc");
  const [selectedId, setSelectedId] = useState(networkFrequentConcepts[0].id);
  const [selectedRef, setSelectedRef] = useState<string | null>(null);

  const filteredConcepts = useMemo(() => {
    const base = networkFrequentConcepts.filter((concept) => {
      if (!matchesConcept(concept, query)) return false;
      if (category !== "전체" && concept.category !== category) return false;
      if (concept.frequency < minFrequency) return false;
      return true;
    });
    return sortConcepts(base, sort);
  }, [query, category, minFrequency, sort]);

  const selectedConcept =
    filteredConcepts.find((concept) => concept.id === selectedId) ??
    filteredConcepts[0] ??
    networkFrequentConcepts[0];

  const highYieldCount = networkFrequentConcepts.filter((concept) => concept.frequency >= 4).length;
  const totalSignals = networkFrequentConcepts.reduce((sum, concept) => sum + concept.frequency, 0);
  const maxFrequency = Math.max(...networkFrequentConcepts.map((concept) => concept.frequency));

  useEffect(() => {
    const conceptId = new URLSearchParams(window.location.search).get("concept");
    if (conceptId && networkFrequentConcepts.some((concept) => concept.id === conceptId)) {
      setSelectedId(conceptId);
    }
  }, []);

  function resetFilters() {
    setQuery("");
    setCategory("전체");
    setMinFrequency(1);
    setSort("frequency-desc");
    setSelectedRef(null);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/network"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300"
        >
          <BookOpen size={16} />
          정보통신망 홈
        </Link>
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 dark:border-gray-800 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-200">
              <Flame size={14} />
              출제형 개념
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">정보통신망 빈출 개념 정리</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              2015~2019학년도 1학기 기말 175문항의 반복 출제 신호를 개념 단위로 묶어,
              강의 근거와 기출형 단서를 함께 정리했습니다.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <Stat value={networkFrequentConcepts.length} label="개념" />
            <Stat value={highYieldCount} label="고빈도" />
            <Stat value={totalSignals} label="반복도 합" />
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold">
          <Filter size={16} />
          필터
        </div>
        <div className="grid gap-3 lg:grid-cols-[1fr_0.8fr_0.6fr_0.75fr_auto]">
          <label className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="개념, 단서, 프로토콜 검색"
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 dark:border-gray-800 dark:bg-gray-950"
            />
          </label>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as NetworkFrequentConceptCategory | "전체")}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-gray-800 dark:bg-gray-950"
          >
            <option value="전체">전체 분류</option>
            {networkFrequentConceptCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={minFrequency}
            onChange={(event) => setMinFrequency(Number(event.target.value))}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-gray-800 dark:bg-gray-950"
          >
            {[1, 2, 3, 5, 8, 12].map((item) => (
              <option key={item} value={item}>
                {item}회+
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortMode)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-gray-800 dark:bg-gray-950"
          >
            <option value="frequency-desc">반복도 높은순</option>
            <option value="frequency-asc">반복도 낮은순</option>
            <option value="label">이름순</option>
            <option value="category">분류순</option>
          </select>

          <button
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 dark:border-gray-800 dark:text-gray-300"
          >
            <RotateCcw size={15} />
            초기화
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-2">
          {filteredConcepts.map((concept) => {
            const tone = frequencyTone(concept.frequency);
            const active = selectedConcept.id === concept.id;

            return (
              <button
                key={concept.id}
                onClick={() => setSelectedId(concept.id)}
                className={`w-full rounded-lg border p-4 text-left transition-colors ${
                  active
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                    : "border-gray-200 bg-white hover:border-blue-300 dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-md border px-2 py-1 text-[11px] font-bold ${categoryStyles[concept.category]}`}>
                        {concept.category}
                      </span>
                      <span className={`rounded-md border px-2 py-1 text-[11px] font-bold ${tone.className}`}>
                        {tone.label}
                      </span>
                    </div>
                    <div className="mt-2 text-base font-bold text-gray-950 dark:text-gray-50">
                      {concept.label}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">
                      {concept.examCue}
                    </p>
                  </div>
                  <div className="w-16 shrink-0">
                    <div className="mb-1 text-right font-mono text-sm font-bold">
                      {concept.frequency}
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className={`h-full rounded-full ${tone.bar}`}
                        style={{ width: `${(concept.frequency / maxFrequency) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <aside className="lg:sticky lg:top-16 lg:self-start">
          <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-md border px-2.5 py-1 text-xs font-bold ${categoryStyles[selectedConcept.category]}`}>
                {selectedConcept.category}
              </span>
              <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {selectedConcept.sourceLabel}
              </span>
            </div>

            <h2 className="text-xl font-black text-gray-950 dark:text-gray-50">
              {selectedConcept.label}
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
              {selectedConcept.definition}
            </p>

            <ConceptVisuals visuals={selectedConcept.visuals} />

            <DetailBlock title="출제형 단서">{selectedConcept.examCue}</DetailBlock>
            <DetailBlock title="대비 액션">{selectedConcept.studyAction}</DetailBlock>

            <div className="mt-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold">
                <LayoutList size={16} />
                연결 강의
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedConcept.lectureIds.map((id) => (
                  <Link
                    key={id}
                    href={`/network/lecture/${id}`}
                    className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 transition-colors hover:border-blue-300 hover:text-blue-700 dark:border-gray-800 dark:text-gray-300 dark:hover:text-blue-200"
                  >
                    {lectureLabel(id)}
                  </Link>
                ))}
              </div>
            </div>

            <TagList title="변형 표현" items={selectedConcept.variants} />
            <TagList title="함께 확인" items={selectedConcept.surrounding} />

            <div className="mt-4">
              <div className="mb-2 text-sm font-bold">출제 흔적</div>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {selectedConcept.years.map((year) => (
                  <span
                    key={`${selectedConcept.id}-${year}`}
                    className="rounded-md bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {year}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedConcept.refs.slice(0, 18).map((ref) => (
                  <button
                    key={`${selectedConcept.id}-${ref}`}
                    type="button"
                    onClick={() => setSelectedRef(ref)}
                    className="rounded-md border border-gray-200 px-2 py-1 font-mono text-[11px] font-semibold text-gray-600 transition-colors hover:border-emerald-300 hover:text-emerald-700 dark:border-gray-800 dark:text-gray-300 dark:hover:text-emerald-200"
                  >
                    {ref}
                  </button>
                ))}
                {selectedConcept.refs.length > 18 && (
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-500 dark:bg-gray-800">
                    +{selectedConcept.refs.length - 18}
                  </span>
                )}
              </div>
              {selectedRef && selectedConcept.refs.includes(selectedRef) && (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100">
                  <div className="font-mono text-xs font-bold">{selectedRef}</div>
                  <p className="mt-1">
                    이 흔적은 같은 개념축의 재구성 문제로 연결했습니다.
                  </p>
                  <Link
                    href={`/network/past-exam?concept=${selectedConcept.id}`}
                    className="mt-2 inline-flex rounded-md bg-emerald-700 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-800"
                  >
                    기출분석에서 보기
                  </Link>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
      <div className="font-mono text-lg font-bold">{value}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  );
}

function DetailBlock({ title, children }: { title: string; children: string }) {
  return (
    <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-950/50">
      <div className="mb-1 text-sm font-bold">{title}</div>
      <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">{children}</p>
    </div>
  );
}

function TagList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4">
      <div className="mb-2 text-sm font-bold">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
