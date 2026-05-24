"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, ClipboardCheck, ExternalLink, Layers3, ListChecks, ScanSearch, Table2, XCircle } from "lucide-react";
import type { AlgorithmLecture as AlgorithmLectureData } from "@/lib/algorithmCourse";
import { getAlgorithmLectureAddendum } from "@/lib/algorithmCourse";
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
} from "@/algorithm/components/panels/AdvancedLectureDemos";

function AdvancedDemoBlock({ lectureId }: { lectureId: number }) {
  if (lectureId === 11) {
    return (
      <div className="grid gap-4 xl:grid-cols-2">
        <MatrixChainDemo />
        <LcsDemo />
      </div>
    );
  }
  if (lectureId === 12) {
    return (
      <div className="grid gap-4 xl:grid-cols-2">
        <RabinKarpDemo />
        <KmpDemo />
      </div>
    );
  }
  if (lectureId === 13) {
    return (
      <div className="grid gap-4 xl:grid-cols-2">
        <BoyerMooreDemo />
        <RleDemo />
      </div>
    );
  }
  if (lectureId === 14) {
    return (
      <div className="grid gap-4 xl:grid-cols-2">
        <HuffmanDemo />
        <Lz77Demo />
        <ImageCompressionDemo />
      </div>
    );
  }
  if (lectureId === 15) {
    return (
      <div className="grid gap-4 xl:grid-cols-2">
        <NpTaxonomyDemo />
        <VertexCoverDemo />
        <TspDemo />
        <BinPackingDemo />
      </div>
    );
  }
  return null;
}

export function AlgorithmLecture({ lecture }: { lecture: AlgorithmLectureData }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const hasAdvancedDemo = lecture.id >= 11;
  const addendum = getAlgorithmLectureAddendum(lecture.id);

  return (
    <>
      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
            <ClipboardCheck size={18} className={lecture.textClass} />
            기말 범위 연결
          </div>
          <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">{lecture.summary}</p>
          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-950">
              <div className="text-xs font-semibold text-gray-500">강의록</div>
              <div className="mt-1 font-medium">{lecture.lectureSource}</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-950">
              <div className="text-xs font-semibold text-gray-500">교재</div>
              <div className="mt-1 font-medium">{lecture.textbookSource}</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 text-sm font-bold">출제 키워드</div>
          <div className="flex flex-wrap gap-2">
            {lecture.examKeywords.map((keyword) => (
              <span
                key={keyword}
                className={`rounded-full px-3 py-1 text-xs font-medium ${lecture.bgLightClass} ${lecture.textClass}`}
              >
                {keyword}
              </span>
            ))}
          </div>
          <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
            <div className="mb-2 text-xs font-semibold uppercase text-gray-500">핵심 용어</div>
            <div className="flex flex-wrap gap-1.5">
              {lecture.keywords.map((keyword) => (
                <span key={keyword} className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-bold">개념 압축 정리</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {lecture.concepts.map((concept) => (
            <article key={concept.title} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-950">
              <h3 className="font-semibold">{concept.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{concept.body}</p>
              {concept.formula && (
                <div className="mt-3 rounded-md bg-white px-3 py-2 font-mono text-sm dark:bg-gray-900">
                  {concept.formula}
                </div>
              )}
              {concept.example && (
                <div className="mt-3 rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
                  {concept.example}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {addendum && (
        <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <ScanSearch size={19} className={lecture.textClass} />
              교재·강의록 누락 재점검
            </h2>
            <div className="flex flex-wrap gap-2">
              {addendum.sourceCheck.map((source) => (
                <span key={source} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {source}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {addendum.coverage.map((group) => (
              <article key={group.title} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <Layers3 size={16} className={lecture.textClass} />
                  {group.title}
                </h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
                      <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${lecture.bgClass}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      {addendum?.tables.length ? (
        <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Table2 size={19} className={lecture.textClass} />
            비교표와 판별 기준
          </h2>
          <div className="space-y-5">
            {addendum.tables.map((table) => (
              <div key={table.title}>
                <h3 className="mb-2 font-semibold">{table.title}</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
                  <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-800">
                    <thead className={lecture.bgLightClass}>
                      <tr>
                        {table.headers.map((header) => (
                          <th key={header} className="whitespace-nowrap px-3 py-2 text-left font-bold text-gray-800 dark:text-gray-100">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {table.rows.map((row, rowIndex) => (
                        <tr key={`${table.title}-${rowIndex}`} className="bg-white dark:bg-gray-900">
                          {row.map((cell, cellIndex) => (
                            <td key={`${table.title}-${rowIndex}-${cellIndex}`} className="px-3 py-2 leading-6 text-gray-700 dark:text-gray-300">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-bold">적용 절차</h2>
          <div className="space-y-4">
            {lecture.procedures.map((procedure) => (
              <div key={procedure.title}>
                <h3 className="font-semibold">{procedure.title}</h3>
                <ol className="mt-2 space-y-2">
                  {procedure.steps.map((step, index) => (
                    <li key={step} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${lecture.bgClass}`}>
                        {index + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-bold">오답 방지</h2>
          <div className="space-y-2">
            {lecture.pitfalls.map((pitfall) => (
              <div key={pitfall} className="flex gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-950 dark:text-gray-300">
                <Circle size={10} className={`mt-1.5 shrink-0 ${lecture.textClass}`} />
                <span>{pitfall}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {addendum && (
        <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <ListChecks size={19} className={lecture.textClass} />
              손풀이 드릴
            </h2>
            <div className="space-y-3">
              {addendum.drills.map((drill) => (
                <details key={drill.title} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                  <summary className="cursor-pointer font-semibold">{drill.title}</summary>
                  <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-300">{drill.prompt}</p>
                  <ul className="mt-3 space-y-2">
                    {drill.checks.map((check) => (
                      <li key={check} className="flex gap-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                        <CheckCircle2 size={15} className={`mt-1 shrink-0 ${lecture.textClass}`} />
                        <span>{check}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-bold">시각화/드릴 연결 감사</h2>
            <div className="space-y-3">
              {addendum.visualAudit.map((item) => (
                <div key={item.topic} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-950">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{item.topic}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${lecture.bgLightClass} ${lecture.textClass}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {lecture.visualizers.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-bold">시각화로 확인</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {lecture.visualizers.map((visualizer) => (
              <Link
                key={visualizer.algorithmId}
                href={`/algorithm/visualizer?algorithm=${visualizer.algorithmId}&category=${visualizer.category}`}
                className="group flex items-center justify-between rounded-lg border border-gray-200 p-4 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-sm dark:border-gray-800"
              >
                <span>{visualizer.label}</span>
                <ExternalLink size={15} className="text-gray-400 transition group-hover:text-gray-700 dark:group-hover:text-gray-200" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {hasAdvancedDemo && (
        <section className="rounded-lg border border-gray-200 bg-gray-950 p-5 text-slate-100 dark:border-gray-800">
          <h2 className="mb-4 text-lg font-bold">단계 추적 실습</h2>
          <AdvancedDemoBlock lectureId={lecture.id} />
        </section>
      )}

      <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-bold">기말 체크 5문항</h2>
        <div className="space-y-4">
          {lecture.quiz.map((question, questionIndex) => {
            const selected = answers[questionIndex];
            return (
              <div key={question.question} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-950">
                <div className="mb-3 font-medium">
                  {questionIndex + 1}. {question.question}
                </div>
                <div className="grid gap-2 md:grid-cols-3">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = selected === optionIndex;
                    const isCorrect = selected !== undefined && optionIndex === question.answer;
                    const isWrong = isSelected && optionIndex !== question.answer;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }))}
                        className={`flex min-h-12 items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                          isCorrect
                            ? "border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                            : isWrong
                              ? "border-rose-400 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
                              : isSelected
                                ? "border-gray-400 bg-white dark:bg-gray-900"
                                : "border-gray-200 bg-white hover:border-gray-400 dark:border-gray-800 dark:bg-gray-900"
                        }`}
                      >
                        <span>{option}</span>
                        {isCorrect && <CheckCircle2 size={16} />}
                        {isWrong && <XCircle size={16} />}
                      </button>
                    );
                  })}
                </div>
                {selected !== undefined && (
                  <div className="mt-3 rounded-md bg-white p-3 text-sm leading-6 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                    <div>{question.explanation}</div>
                    <div className="mt-1 text-gray-500 dark:text-gray-400">{question.wrongNote}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex justify-end">
        <Link
          href="/algorithm/summary"
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white ${lecture.bgClass}`}
        >
          전체 요약으로 이동
          <ArrowRight size={15} />
        </Link>
      </div>
    </>
  );
}
