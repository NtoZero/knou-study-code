"use client";

import { useState } from "react";
import {
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  ListChecks,
  Network,
  RotateCcw,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import {
  advancedNetworkLectureDetails,
  advancedNetworkLectures,
  type AdvancedNetworkDetailSection,
  type AdvancedNetworkLectureData,
  type AdvancedNetworkTone,
} from "./data";

const toneStyles: Record<AdvancedNetworkTone, {
  badge: string;
  border: string;
  fill: string;
  text: string;
  soft: string;
  active: string;
}> = {
  blue: {
    badge: "bg-blue-600 text-white",
    border: "border-blue-200 dark:border-blue-900",
    fill: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-200",
    soft: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-100",
    active: "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30",
  },
  emerald: {
    badge: "bg-emerald-600 text-white",
    border: "border-emerald-200 dark:border-emerald-900",
    fill: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-200",
    soft: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
    active: "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/30",
  },
  rose: {
    badge: "bg-rose-600 text-white",
    border: "border-rose-200 dark:border-rose-900",
    fill: "bg-rose-50 dark:bg-rose-950/30",
    text: "text-rose-700 dark:text-rose-200",
    soft: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-100",
    active: "border-rose-500 bg-rose-50 dark:border-rose-500 dark:bg-rose-950/30",
  },
  amber: {
    badge: "bg-amber-500 text-gray-950",
    border: "border-amber-200 dark:border-amber-900",
    fill: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-200",
    soft: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
    active: "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-950/30",
  },
  violet: {
    badge: "bg-violet-600 text-white",
    border: "border-violet-200 dark:border-violet-900",
    fill: "bg-violet-50 dark:bg-violet-950/30",
    text: "text-violet-700 dark:text-violet-200",
    soft: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-100",
    active: "border-violet-500 bg-violet-50 dark:border-violet-500 dark:bg-violet-950/30",
  },
};

export default function NetworkAdvancedLecture({ lectureId }: { lectureId: number }) {
  const data = advancedNetworkLectures[lectureId];
  const [activeConcept, setActiveConcept] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [drillAnswers, setDrillAnswers] = useState<Record<number, string>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  if (!data) return null;

  const styles = toneStyles[data.tone];
  const concept = data.concepts[activeConcept] ?? data.concepts[0];
  const step = data.process.steps[activeStep] ?? data.process.steps[0];
  const quizScore = data.quiz.filter((item, index) => quizAnswers[index] === item.answer).length;
  const quizDone = Object.keys(quizAnswers).length === data.quiz.length;
  const detailSections = advancedNetworkLectureDetails[data.id] ?? [];

  return (
    <>
      <LectureOverview data={data} styles={styles} />

      <DetailedConceptMap data={data} sections={detailSections} styles={styles} />

      <section>
        <SectionTitle
          title="개념 흐름 레일"
          subtitle="목차 순서대로 핵심 개념을 세로로 따라가며 정의와 판별 기준을 확인하세요"
        />
        <div className={`rounded-xl border bg-white p-4 dark:bg-gray-900 ${styles.border}`}>
          <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="space-y-2">
              {data.concepts.map((item, index) => {
                const active = index === activeConcept;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setActiveConcept(index)}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                      active
                        ? styles.active
                        : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700"
                    }`}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-black ${active ? styles.badge : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}>
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-black text-gray-950 dark:text-gray-50">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-gray-500">
                        {item.axis}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className={`rounded-lg border p-5 ${styles.border} ${styles.fill}`}>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-md px-2.5 py-1 text-xs font-black ${styles.badge}`}>
                  {concept.axis}
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  {data.id}강 핵심 {activeConcept + 1}
                </span>
              </div>
              <h3 className="text-xl font-black text-gray-950 dark:text-gray-50">{concept.label}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-700 dark:text-gray-200">
                {concept.detail}
              </p>
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {concept.checks.map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-white/70 bg-white/80 p-3 text-sm leading-6 text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-950/80 dark:text-gray-200"
                  >
                    <div className={`mb-1 flex items-center gap-1 text-xs font-black ${styles.text}`}>
                      <CheckCircle2 size={13} />
                      판별
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ComparisonMatrix data={data} styles={styles} />

      <section>
        <SectionTitle title={data.process.title} subtitle={data.process.subtitle} />
        <div className={`rounded-xl border bg-white p-4 dark:bg-gray-900 ${styles.border}`}>
          <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
            <div className="space-y-2">
              {data.process.steps.map((item, index) => {
                const active = index === activeStep;
                return (
                  <button
                    key={`${item.label}-${index}`}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left text-sm transition-colors ${
                      active
                        ? styles.active
                        : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950"
                    }`}
                  >
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${active ? styles.badge : "bg-gray-100 text-gray-500 dark:bg-gray-800"}`}>
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-black">{item.label}</span>
                      <span className="mt-0.5 block text-xs text-gray-500">{item.cue}</span>
                    </span>
                    <ChevronRight size={16} className={active ? styles.text : "text-gray-400"} />
                  </button>
                );
              })}
            </div>
            <div className={`rounded-lg border p-5 ${styles.border} ${styles.fill}`}>
              <div className={`mb-3 inline-flex rounded-md px-2.5 py-1 text-xs font-black ${styles.soft}`}>
                {step.cue}
              </div>
              <h3 className="text-xl font-black text-gray-950 dark:text-gray-50">{step.label}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-700 dark:text-gray-200">{step.detail}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {data.process.steps.map((item, index) => (
                  <span
                    key={`${item.label}-rail`}
                    className={`h-2 rounded-full transition-all ${index <= activeStep ? styles.badge : "bg-gray-200 dark:bg-gray-800"}`}
                    style={{ width: index === activeStep ? 44 : 24 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <DrillBoard
        data={data}
        styles={styles}
        answers={drillAnswers}
        onAnswer={(index, answer) => setDrillAnswers((prev) => ({ ...prev, [index]: answer }))}
      />

      <section>
        <SectionTitle
          title="자가 점검 퀴즈"
          subtitle="정답 선택 후 강의 기준 해설로 오답 경계를 확인하세요"
        />
        <div className={`rounded-xl border bg-white p-4 dark:bg-gray-900 ${styles.border}`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {data.quiz.map((_, index) => {
                const selected = quizAnswers[index];
                const answered = selected !== undefined;
                const correct = answered && selected === data.quiz[index].answer;
                return (
                  <span
                    key={`quiz-dot-${index}`}
                    className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-black ${
                      !answered
                        ? "bg-gray-100 text-gray-500 dark:bg-gray-800"
                        : correct
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-100"
                    }`}
                  >
                    {index + 1}
                  </span>
                );
              })}
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300">
              <Target size={16} />
              {quizDone ? `${quizScore}/${data.quiz.length}` : `선택 ${Object.keys(quizAnswers).length}/${data.quiz.length}`}
              <button
                type="button"
                onClick={() => setQuizAnswers({})}
                className="ml-2 inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs font-bold text-gray-500 dark:border-gray-800"
              >
                <RotateCcw size={13} />
                다시
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {data.quiz.map((item, questionIndex) => {
              const selected = quizAnswers[questionIndex];
              return (
                <article key={item.question} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                  <h3 className="text-sm font-black text-gray-950 dark:text-gray-50">
                    {questionIndex + 1}. {item.question}
                  </h3>
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    {item.options.map((option, optionIndex) => {
                      const answered = selected !== undefined;
                      const isCorrect = optionIndex === item.answer;
                      const isSelected = selected === optionIndex;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setQuizAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }))
                          }
                          className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm leading-6 transition-colors ${
                            !answered
                              ? "border-gray-200 hover:border-gray-400 dark:border-gray-800"
                              : isCorrect
                                ? "border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30"
                                : isSelected
                                  ? "border-rose-400 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/30"
                                  : "border-gray-200 opacity-55 dark:border-gray-800"
                          }`}
                        >
                          <span className="font-black">{String.fromCharCode(65 + optionIndex)}</span>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                  {selected !== undefined && (
                    <div
                      className={`mt-3 flex gap-2 rounded-lg p-3 text-sm leading-6 ${
                        selected === item.answer
                          ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
                          : "bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-100"
                      }`}
                    >
                      {selected === item.answer ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
                      <span>{item.explanation}</span>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function DetailedConceptMap({
  data,
  sections,
  styles,
}: {
  data: AdvancedNetworkLectureData;
  sections: AdvancedNetworkDetailSection[];
  styles: (typeof toneStyles)[AdvancedNetworkTone];
}) {
  if (sections.length === 0) return null;

  return (
    <section>
      <SectionTitle
        title="목차 기반 상세 개념 정리"
        subtitle={`${data.id}강 대목차와 소개념을 세로 흐름으로 정리했습니다`}
      />
      <div className="space-y-4">
        {sections.map((section, sectionIndex) => (
          <details
            key={section.title}
            open
            className={`rounded-xl border bg-white dark:bg-gray-900 ${styles.border}`}
          >
            <summary className="cursor-pointer list-none p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${styles.badge}`}>
                    <BookOpenCheck size={18} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-base font-black text-gray-950 dark:text-gray-50">
                      {section.title}
                    </div>
                    <div className="mt-1 text-sm leading-6 text-gray-500">
                      {section.description}
                    </div>
                  </div>
                </div>
                <span className={`rounded-md px-2.5 py-1 text-xs font-black ${styles.soft}`}>
                  {section.items.length}개 항목
                </span>
              </div>
            </summary>
            <div className="border-t border-gray-100 p-4 dark:border-gray-800">
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <article
                    key={item.term}
                    className="grid gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950 md:grid-cols-[180px_minmax(0,1fr)]"
                  >
                    <div>
                      <div className={`mb-2 inline-flex rounded-md px-2 py-1 text-xs font-black ${styles.soft}`}>
                        {sectionIndex + 1}-{itemIndex + 1}
                      </div>
                      <h3 className="text-sm font-black leading-6 text-gray-950 dark:text-gray-50">
                        {item.term}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm leading-7 text-gray-700 dark:text-gray-200">
                        {item.detail}
                      </p>
                      <ul className="mt-3 space-y-2">
                        {item.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                            <CheckCircle2 size={15} className={`mt-1 shrink-0 ${styles.text}`} />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function LectureOverview({
  data,
  styles,
}: {
  data: AdvancedNetworkLectureData;
  styles: (typeof toneStyles)[AdvancedNetworkTone];
}) {
  return (
    <section>
      <SectionTitle
        title={`${data.id}강 시각화 학습 지도`}
        subtitle={data.summary}
      />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className={`rounded-xl border p-5 ${styles.border} ${styles.fill}`}>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-black ${styles.badge}`}>
              <Network size={14} />
              {data.id}강
            </span>
            <span className="text-xs font-semibold text-gray-500">정의 → 구조 → 비교 → 절차 → 점검</span>
          </div>
          <h2 className="text-2xl font-black text-gray-950 dark:text-gray-50">{data.title}</h2>
          <div className="mt-4 grid gap-2">
            {data.objectives.map((objective) => (
              <div key={objective} className="flex gap-2 text-sm leading-6 text-gray-700 dark:text-gray-200">
                <CheckCircle2 size={16} className={`mt-1 shrink-0 ${styles.text}`} />
                <span>{objective}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <div className="grid grid-cols-3 gap-2">
            {data.metrics.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
                <div className={`text-xs font-black ${styles.text}`}>{metric.label}</div>
                <div className="mt-1 font-mono text-lg font-black text-gray-950 dark:text-gray-50">{metric.value}</div>
                <div className="mt-1 text-[11px] leading-4 text-gray-500">{metric.detail}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center gap-2 text-sm font-black">
              <ListChecks size={16} className={styles.text} />
              핵심 용어
            </div>
            <div className="flex flex-wrap gap-2">
              {data.keyTerms.map((term) => (
                <span key={term} className={`rounded-md px-2.5 py-1 text-xs font-bold ${styles.soft}`}>
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonMatrix({
  data,
  styles,
}: {
  data: AdvancedNetworkLectureData;
  styles: (typeof toneStyles)[AdvancedNetworkTone];
}) {
  const columns = data.comparison.columns;

  return (
    <section>
      <SectionTitle title={data.comparison.title} subtitle={data.comparison.subtitle} />
      <div className={`rounded-xl border bg-white p-4 dark:bg-gray-900 ${styles.border}`}>
        <div className="overflow-x-auto">
          <div
            className="grid min-w-[760px] gap-2"
            style={{
              gridTemplateColumns: `170px repeat(${columns.length}, minmax(170px, 1fr))`,
            }}
          >
            <div className={`rounded-lg p-3 text-xs font-black ${styles.badge}`}>구분</div>
            {columns.map((column) => (
              <div key={column} className={`rounded-lg p-3 text-xs font-black ${styles.soft}`}>
                {column}
              </div>
            ))}
            {data.comparison.rows.map((row) => (
              <Row key={row.label} row={row} styles={styles} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  row,
  styles,
}: {
  row: { label: string; cells: string[] };
  styles: (typeof toneStyles)[AdvancedNetworkTone];
}) {
  return (
    <>
      <div className={`rounded-lg border p-3 text-sm font-black ${styles.border} ${styles.fill}`}>
        {row.label}
      </div>
      {row.cells.map((cell, index) => (
        <div
          key={`${row.label}-${index}`}
          className="rounded-lg border border-gray-200 bg-white p-3 text-sm leading-6 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200"
        >
          {cell}
        </div>
      ))}
    </>
  );
}

function DrillBoard({
  data,
  styles,
  answers,
  onAnswer,
}: {
  data: AdvancedNetworkLectureData;
  styles: (typeof toneStyles)[AdvancedNetworkTone];
  answers: Record<number, string>;
  onAnswer: (index: number, answer: string) => void;
}) {
  return (
    <section>
      <SectionTitle
        title={data.drill.title}
        subtitle="문장을 보고 가장 가까운 개념을 고른 뒤 판별 기준을 확인하세요"
      />
      <div className={`rounded-xl border bg-white p-4 dark:bg-gray-900 ${styles.border}`}>
        <div className="space-y-4">
          {data.drill.scenarios.map((scenario, index) => {
            const selected = answers[index];
            const answered = selected !== undefined;
            const correct = selected === scenario.answer;
            return (
              <article key={scenario.prompt} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                <div className="mb-3 flex items-start gap-2">
                  <Sparkles size={17} className={`mt-0.5 shrink-0 ${styles.text}`} />
                  <h3 className="text-sm font-black leading-6 text-gray-950 dark:text-gray-50">
                    {scenario.prompt}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.drill.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onAnswer(index, option)}
                      className={`rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${
                        selected === option
                          ? option === scenario.answer
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
                            : "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-100"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {answered && (
                  <div
                    className={`mt-3 flex gap-2 rounded-lg p-3 text-sm leading-6 ${
                      correct
                        ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
                        : "bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-100"
                    }`}
                  >
                    {correct ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
                    <span>{scenario.feedback}</span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
