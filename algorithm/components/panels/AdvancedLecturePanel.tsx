"use client";

import { useState } from "react";
import { BookOpen, Layers3 } from "lucide-react";
import { advancedLectures, AdvancedLectureId } from "../../data/advanced-lectures";
import {
  BinPackingDemo,
  BoyerMooreDemo,
  HuffmanDemo,
  ImageCompressionDemo,
  KmpDemo,
  LcsDemo,
  Lz77Demo,
  MatrixChainDemo,
  NpTaxonomyDemo,
  RabinKarpDemo,
  RleDemo,
  TspDemo,
  VertexCoverDemo,
} from "./AdvancedLectureDemos";

const lectureChapters: Record<AdvancedLectureId, string> = {
  11: "교재 5장",
  12: "교재 6장",
  13: "교재 6장",
  14: "교재 6장",
  15: "교재 7장",
};

function renderDemo(lectureId: AdvancedLectureId, subtopic: string) {
  switch (lectureId) {
    case 11:
      return subtopic === "lcs" ? <LcsDemo /> : <MatrixChainDemo />;
    case 12:
      return subtopic === "kmp" ? <KmpDemo /> : <RabinKarpDemo />;
    case 13:
      return subtopic === "rle" ? <RleDemo /> : <BoyerMooreDemo />;
    case 14:
      if (subtopic === "lz77") return <Lz77Demo />;
      if (subtopic === "image") return <ImageCompressionDemo />;
      return <HuffmanDemo />;
    case 15:
      if (subtopic === "vertex-cover") return <VertexCoverDemo />;
      if (subtopic === "tsp") return <TspDemo />;
      if (subtopic === "bin-packing") return <BinPackingDemo />;
      return <NpTaxonomyDemo />;
    default:
      return null;
  }
}

export function AdvancedLecturePanel() {
  const [lectureId, setLectureId] = useState<AdvancedLectureId>(11);
  const [subtopic, setSubtopic] = useState(
    advancedLectures[0].defaultSubtopic,
  );

  const current = advancedLectures.find((lecture) => lecture.id === lectureId) ?? advancedLectures[0];

  const handleLectureChange = (id: AdvancedLectureId) => {
    const next = advancedLectures.find((lecture) => lecture.id === id) ?? advancedLectures[0];
    setLectureId(id);
    setSubtopic(next.defaultSubtopic);
  };

  return (
    <section className="rounded-xl border border-slate-700/60 bg-slate-900/80 p-4 text-slate-100 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-300">
            <BookOpen size={14} />
            11~15강 핵심 정리
          </div>
          <h2 className="mt-1 text-lg font-bold">교재 5~7장과 강의록 11~15강을 함께 보기</h2>
          <p className="mt-1 text-xs text-slate-400">
            동적 프로그래밍, 스트링 알고리즘, 압축, NP-완전·근사 알고리즘을 단계별로 확인.
          </p>
        </div>
        <div className="rounded-lg border border-indigo-400/30 bg-indigo-400/10 px-3 py-2 text-right">
          <div className="text-xl font-bold text-indigo-200">11~15</div>
          <div className="text-[11px] text-indigo-100">학습 범위</div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-5 gap-1">
        {advancedLectures.map((lecture) => (
          <button
            key={lecture.id}
            type="button"
            onClick={() => handleLectureChange(lecture.id)}
            className={`relative h-9 rounded-md border text-xs font-semibold transition ${
              lectureId === lecture.id
                ? "border-indigo-300 bg-indigo-400 text-slate-950"
                : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500"
            }`}
            aria-label={`${lecture.id}강 ${lecture.title}`}
          >
            {lecture.id}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-4">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs text-slate-400">
              {current.lectureSource} · {lectureChapters[current.id]}
            </div>
            <h3 className="text-base font-bold">{current.title}</h3>
            <p className="mt-1 text-[11px] text-slate-500">{current.textbookSource}</p>
          </div>
          <div className="rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-right">
            <div className="flex items-center justify-end gap-2 text-xs text-slate-400">
              <Layers3 size={12} />
              하위 주제
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-200">{current.subtopics.length}개</div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-1">
          {current.subtopics.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSubtopic(item.id)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                subtopic === item.id
                  ? "bg-slate-100 text-slate-950"
                  : "border border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.15fr]">
          <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
            <p className="text-sm text-slate-200 leading-relaxed">{current.summary}</p>

            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">핵심 주제</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {current.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-indigo-400/15 px-2 py-1 text-[11px] text-indigo-100"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">시험 포인트</p>
              <ul className="mt-2 space-y-1">
                {current.examFocus.map((item) => (
                  <li key={item} className="flex gap-2 text-xs text-slate-300">
                    <span className="text-emerald-500">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">반드시 기억</p>
              <ul className="mt-2 space-y-1">
                {current.mustKnow.map((item) => (
                  <li key={item} className="flex gap-2 text-xs text-slate-300">
                    <span className="text-amber-400">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div key={`${lectureId}-${subtopic}`} className="rounded-lg border border-slate-700 bg-slate-900/70 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">선택한 주제</p>
                <p className="text-sm font-semibold text-slate-100">
                  {current.subtopics.find((item) => item.id === subtopic)?.label ?? current.subtopics[0].label}
                </p>
              </div>
              <div className="text-[11px] text-slate-500">
                {current.subtopics.find((item) => item.id === subtopic)?.note}
              </div>
            </div>
            {renderDemo(current.id, subtopic)}
          </div>
        </div>
      </div>
    </section>
  );
}
