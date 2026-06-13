"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  ListChecks,
  RotateCcw,
  Table2,
  XCircle,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import SoftwareAppliedStudio from "./SoftwareAppliedStudios";
import { softwareLectureData } from "./lectureData";
import type { SoftwareConceptUnit, SoftwareLectureVisual, SoftwareQuizChoice } from "./types";

type Props = {
  lectureId: number;
};

const labels = ["①", "②", "③", "④"];

function SourceVisualGallery({ visuals }: { visuals?: SoftwareLectureVisual[] }) {
  if (!visuals?.length) {
    return null;
  }

  return (
    <section>
      <SectionTitle
        title="그림으로 먼저 판독"
        subtitle="교재·강의 도식을 보고 기호, 방향, 경계, 흐름을 먼저 고정"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {visuals.map((visual) => (
          <figure
            key={visual.src}
            className="overflow-hidden rounded-lg border border-emerald-200 bg-white dark:border-emerald-900 dark:bg-gray-900"
          >
            <div className="bg-gray-50 p-3 dark:bg-gray-950">
              <Image
                src={visual.src}
                alt={visual.alt}
                width={visual.width}
                height={visual.height}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                className="h-auto w-full rounded-md border border-gray-200 bg-white object-contain dark:border-gray-800"
              />
            </div>
            <figcaption className="space-y-2 p-4">
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                {visual.sourceLabel}
              </div>
              <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">{visual.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function ConceptDecisionTable({ unit }: { unit: SoftwareConceptUnit }) {
  if (!unit.tableRows?.length) {
    return null;
  }

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800 dark:border-gray-800 dark:bg-gray-950/60 dark:text-gray-100">
        <Table2 size={15} />
        개념 판별표
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full border-collapse text-left text-sm">
          <thead className="bg-white text-xs uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            <tr>
              <th className="w-32 border-b border-gray-200 px-4 py-2 font-bold dark:border-gray-800">구분</th>
              <th className="border-b border-gray-200 px-4 py-2 font-bold dark:border-gray-800">강의 기준</th>
              <th className="border-b border-gray-200 px-4 py-2 font-bold dark:border-gray-800">시험 확인</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {unit.tableRows.map((row) => (
              <tr key={`${unit.title}-${row.criterion}`} className="bg-white align-top dark:bg-gray-900">
                <th scope="row" className="px-4 py-3 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {row.criterion}
                </th>
                <td className="px-4 py-3 leading-6 text-gray-700 dark:text-gray-300">{row.lectureBasis}</td>
                <td className="px-4 py-3 leading-6 text-gray-600 dark:text-gray-400">{row.examCheck}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConceptFlow({ lectureId }: Props) {
  const content = softwareLectureData[lectureId];
  const [active, setActive] = useState(0);

  return (
    <section>
      <SectionTitle
        title="개념 흐름"
        subtitle="정의, 구성요소, 예시, 비예, 시험 포인트를 세로로 이어서 확인"
      />

      <div className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 lg:sticky lg:top-6 lg:self-start">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">개념 목차</div>
              <div className="mt-1 text-xs text-gray-500">{content.sourceLabel}</div>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
              {active + 1}/{content.units.length}
            </span>
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto pr-1 lg:max-h-[calc(100vh-12rem)]">
            {content.units.map((unit, idx) => (
              <a
                key={unit.title}
                href={`#software-concept-${lectureId}-${idx + 1}`}
                onClick={() => setActive(idx)}
                className={`block rounded-lg border px-3 py-3 text-left transition-colors ${
                  active === idx
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-emerald-300 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-gray-500 dark:bg-gray-900">
                    {unit.anchor}
                  </span>
                  <span className="text-sm font-semibold leading-5">{unit.title}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-5 opacity-80">{unit.summary}</p>
              </a>
            ))}
          </div>
        </aside>

        <div className="min-w-0 space-y-5">
          {content.units.map((unit, idx) => (
            <article
              id={`software-concept-${lectureId}-${idx + 1}`}
              key={unit.title}
              className="scroll-mt-24 rounded-lg border border-emerald-200 bg-white p-5 dark:border-emerald-900 dark:bg-gray-900 lg:scroll-mt-8"
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">
                  {unit.anchor}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{unit.title}</h3>
              </div>

              <p className="mb-4 text-sm leading-6 text-gray-700 dark:text-gray-300">{unit.summary}</p>

              <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-3">
                  <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/30">
                    <div className="mb-1 flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-200">
                      <FileCheck2 size={15} />
                      정의
                    </div>
                    <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">{unit.definition}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/70">
                    <div className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-100">왜 필요한가</div>
                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">{unit.why}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                    <div className="mb-2 text-sm font-bold text-gray-800 dark:text-gray-100">구성요소</div>
                    <ul className="space-y-1.5">
                      {unit.components.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
                    <div className="mb-1 flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-200">
                      <AlertTriangle size={15} />
                      자주 틀리는 기준
                    </div>
                    <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">{unit.mistake}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {unit.examples.map((example) => (
                  <div
                    key={example}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-400"
                  >
                    {example}
                  </div>
                ))}
              </div>

              {(unit.procedure?.length || unit.formula || unit.contrast?.length) && (
                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  {unit.procedure?.length ? (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                      <div className="mb-2 text-sm font-bold text-blue-800 dark:text-blue-200">작동·판별 절차</div>
                      <ol className="space-y-1.5 text-sm leading-6 text-gray-700 dark:text-gray-300">
                        {unit.procedure.map((step, stepIdx) => (
                          <li key={step} className="flex gap-2">
                            <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-200">{stepIdx + 1}</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : null}
                  {unit.formula ? (
                    <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 dark:border-violet-900 dark:bg-violet-950/20">
                      <div className="mb-2 text-sm font-bold text-violet-800 dark:text-violet-200">공식·표기</div>
                      <p className="break-keep font-mono text-sm leading-6 text-gray-800 dark:text-gray-200">{unit.formula}</p>
                    </div>
                  ) : null}
                  {unit.contrast?.length ? (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/50">
                      <div className="mb-2 text-sm font-bold text-gray-800 dark:text-gray-100">비교 기준</div>
                      <ul className="space-y-1.5 text-sm leading-6 text-gray-700 dark:text-gray-300">
                        {unit.contrast.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              )}

              <ConceptDecisionTable unit={unit} />

              <div className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm text-white">
                <ListChecks size={16} className="mt-0.5 shrink-0" />
                <span>{unit.examFocus}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuizChoiceRow({
  choice,
  index,
  selected,
  revealed,
  onSelect,
}: {
  choice: SoftwareQuizChoice;
  index: number;
  selected?: number;
  revealed: boolean;
  onSelect: () => void;
}) {
  const active = selected === index;
  const state = !revealed
    ? active
      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
      : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
    : choice.isCorrect
      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
      : active
        ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30"
        : "border-gray-200 bg-gray-50 opacity-80 dark:border-gray-800 dark:bg-gray-950";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border px-3 py-3 text-left text-sm transition-colors ${state}`}
    >
      <span className="flex items-start gap-3">
        <span className="mt-0.5 font-bold">{labels[index]}</span>
        <span className="min-w-0 break-keep leading-6">{choice.text}</span>
        {revealed && (
          <span className="ml-auto shrink-0">
            {choice.isCorrect ? <CheckCircle2 size={16} className="text-emerald-600" /> : <XCircle size={16} className="text-rose-600" />}
          </span>
        )}
      </span>
      {revealed && (
        <span className="mt-2 block text-xs leading-5 text-gray-600 dark:text-gray-400">
          {choice.explanation.basis} {choice.explanation.reason}
        </span>
      )}
    </button>
  );
}

function LectureQuiz({ lectureId }: Props) {
  const content = softwareLectureData[lectureId];
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const score = useMemo(
    () =>
      content.quizzes.filter((quizItem, idx) => {
        const selectedIndex = selected[idx];
        return revealed[idx] && selectedIndex !== undefined && quizItem.choices[selectedIndex]?.isCorrect;
      }).length,
    [content.quizzes, revealed, selected],
  );

  return (
    <section>
      <SectionTitle title="시험형 객관식" subtitle="기출 선택지 방식에 맞춰 세로 선택지와 근거 해설 제공" />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          정답 확인 {Object.values(revealed).filter(Boolean).length}/{content.quizzes.length} · 맞힘 {score}
        </div>
        <button
          type="button"
          onClick={() => {
            setSelected({});
            setRevealed({});
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
        >
          <RotateCcw size={15} />
          다시 풀기
        </button>
      </div>

      <div className="space-y-4">
        {content.quizzes.map((quizItem, idx) => (
          <article key={quizItem.q} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">
                Q{idx + 1}
              </span>
              <span className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300">
                {quizItem.category}
              </span>
            </div>
            <p className="mb-3 break-keep text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">{quizItem.q}</p>
            <div className="space-y-2">
              {quizItem.choices.map((choice, choiceIdx) => (
                <QuizChoiceRow
                  key={`${quizItem.q}-${choice.text}`}
                  choice={choice}
                  index={choiceIdx}
                  selected={selected[idx]}
                  revealed={Boolean(revealed[idx])}
                  onSelect={() => setSelected((prev) => ({ ...prev, [idx]: choiceIdx }))}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setRevealed((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                className="rounded-lg bg-gray-950 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
              >
                {revealed[idx] ? "해설 접기" : "정답·해설 보기"}
              </button>
              {revealed[idx] && (
                <span className="text-xs text-gray-500">{quizItem.examSkill}</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function SoftwareLectureReview({ lectureId }: Props) {
  const content = softwareLectureData[lectureId];

  return (
    <>
      <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
          {content.sourceLabel}
        </div>
        <h2 className="text-xl font-bold text-gray-950 dark:text-gray-50">{content.title}</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{content.intro}</p>
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          {content.goals.map((goal) => (
            <div key={goal} className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:bg-gray-950 dark:text-gray-300">
              {goal}
            </div>
          ))}
        </div>
      </section>
      <SourceVisualGallery visuals={content.visuals} />
      <ConceptFlow lectureId={lectureId} />
      <SoftwareAppliedStudio lectureId={lectureId} lab={content.lab} />
      <LectureQuiz lectureId={lectureId} />
    </>
  );
}
