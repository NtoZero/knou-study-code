"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Code2,
  FileCheck2,
  GitBranch,
  ListChecks,
  Play,
  RotateCcw,
  XCircle,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { javaDeepDiveData } from "./deepDiveData";
import { javaLectureData } from "./lectureData";
import type { JavaConceptUnit, JavaDrillCase, JavaQuizChoice, JavaTermDetail, JavaVisualStudio } from "./types";

type Props = {
  lectureId: number;
};

const labels = ["①", "②", "③", "④"];

function cx(...items: Array<string | false | undefined>) {
  return items.filter(Boolean).join(" ");
}

function findTermDetail(label: string, terms: JavaTermDetail[]) {
  const normalized = label.toLowerCase();
  return terms.find((term) => {
    const termLabel = term.term.toLowerCase();
    return normalized.includes(termLabel) || termLabel.includes(normalized);
  });
}

function ConceptPanel({ lectureId }: Props) {
  const content = javaLectureData[lectureId];
  const deepDive = javaDeepDiveData[lectureId];
  const termDetails = deepDive?.terms ?? [];
  const sourceBasis = deepDive?.sourceBasis ?? content.sourceLabel;
  const [active, setActive] = useState(0);

  return (
    <section>
      <SectionTitle
        title="개념 흐름"
        subtitle="강의 목차를 정의, 구성요소, 절차, 예제, 오답 기준으로 재구성"
      />

      <div className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 lg:sticky lg:top-16 lg:self-start">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-gray-950 dark:text-gray-50">개념 목차</div>
              <div className="mt-1 text-xs leading-5 text-gray-500">{content.sourceLabel}</div>
            </div>
            <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
              {active + 1}/{content.units.length}
            </span>
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto pr-1 lg:max-h-[calc(100vh-12rem)]">
            {content.units.map((unit, idx) => (
              <a
                key={unit.title}
                href={`#java-concept-${lectureId}-${idx + 1}`}
                onClick={() => setActive(idx)}
                className={cx(
                  "block rounded-lg border px-3 py-3 text-left transition-colors",
                  active === idx
                    ? "border-amber-500 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-amber-300 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-400",
                )}
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
            <ConceptArticle
              key={unit.title}
              lectureId={lectureId}
              index={idx}
              unit={unit}
              termDetails={termDetails}
              sourceBasis={sourceBasis}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ConceptArticle({
  lectureId,
  index,
  unit,
  termDetails,
  sourceBasis,
}: {
  lectureId: number;
  index: number;
  unit: JavaConceptUnit;
  termDetails: JavaTermDetail[];
  sourceBasis: string;
}) {
  return (
    <article
      id={`java-concept-${lectureId}-${index + 1}`}
      className="scroll-mt-24 rounded-lg border border-amber-200 bg-white p-5 dark:border-amber-900 dark:bg-gray-900 lg:scroll-mt-20"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-amber-600 px-2.5 py-1 text-xs font-bold text-white">
          {unit.anchor}
        </span>
        <h3 className="text-lg font-bold text-gray-950 dark:text-gray-50">{unit.title}</h3>
      </div>

      <p className="mb-4 text-sm leading-6 text-gray-700 dark:text-gray-300">{unit.summary}</p>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-3">
          <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950/30">
            <div className="mb-1 flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-100">
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
            <div className="mb-2 text-sm font-bold text-gray-800 dark:text-gray-100">구성요소·해설</div>
            <ul className="space-y-2">
              {unit.components.map((item) => {
                const detail = findTermDetail(item, termDetails);
                return (
                  <li key={item} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{item}</span>
                      {detail ? (
                        <span className="mt-1 block space-y-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                          <span className="block">
                            <span className="font-semibold text-amber-700 dark:text-amber-200">정의 </span>
                            {detail.definition}
                          </span>
                          <span className="block">
                            <span className="font-semibold text-blue-700 dark:text-blue-200">역할 </span>
                            {detail.role}
                          </span>
                        <span className="block">
                          <span className="font-semibold text-emerald-700 dark:text-emerald-200">예시 </span>
                          {detail.example}
                        </span>
                        <span className="block">
                          <span className="font-semibold text-gray-700 dark:text-gray-200">원자료 근거 </span>
                          {detail.sourceBasis ?? sourceBasis}
                        </span>
                      </span>
                    ) : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/20">
            <div className="mb-1 flex items-center gap-2 text-sm font-bold text-rose-800 dark:text-rose-200">
              <AlertTriangle size={15} />
              자주 틀리는 기준
            </div>
            <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">{unit.mistake}</p>
          </div>
        </div>
      </div>

      {unit.procedure?.length ? (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
          <div className="mb-2 text-sm font-bold text-blue-800 dark:text-blue-200">작동·판별 절차</div>
          <ol className="grid gap-2 md:grid-cols-2">
            {unit.procedure.map((step, stepIdx) => (
              <li key={step} className="flex gap-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-600 text-[11px] font-bold text-white">
                  {stepIdx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {unit.examples.map((example) => (
          <div
            key={example}
            className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-600 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-400"
          >
            {example}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-gray-950 px-4 py-3 text-sm text-white dark:bg-gray-100 dark:text-gray-950">
        <ListChecks size={16} className="mt-0.5 shrink-0" />
        <span>{unit.examFocus}</span>
      </div>
    </article>
  );
}

function TermDeepDive({ lectureId }: Props) {
  const deepDive = javaDeepDiveData[lectureId];
  const terms = deepDive?.terms ?? [];
  const [active, setActive] = useState(0);
  const current = terms[active];
  const sourceBasis = current?.sourceBasis ?? deepDive?.sourceBasis;

  if (!current) return null;

  return (
    <section>
      <SectionTitle
        title="핵심 용어 깊이 보기"
        subtitle="키워드가 아니라 정의, 역할, 구분 기준, 예시까지 한 번에 확인"
      />

      <div className="grid gap-4 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {terms.map((term, idx) => (
            <button
              key={term.term}
              type="button"
              onClick={() => setActive(idx)}
              className={cx(
                "rounded-lg border px-4 py-3 text-left transition-colors",
                active === idx
                  ? "border-amber-500 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100"
                  : "border-gray-200 bg-white text-gray-600 hover:border-amber-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300",
              )}
            >
              <span className="block text-sm font-bold">{term.term}</span>
              <span className="mt-1 line-clamp-2 text-xs leading-5 opacity-75">{term.definition}</span>
            </button>
          ))}
        </div>

        <article className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-amber-600 px-3 py-1 text-xs font-bold text-white">
              TERM {active + 1}
            </span>
            <h3 className="text-xl font-black text-gray-950 dark:text-gray-50">{current.term}</h3>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950/30">
              <div className="mb-1 text-sm font-bold text-amber-900 dark:text-amber-100">정의</div>
              <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">{current.definition}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/25">
              <div className="mb-1 text-sm font-bold text-blue-900 dark:text-blue-100">역할</div>
              <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">{current.role}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/25">
              <div className="mb-1 text-sm font-bold text-emerald-900 dark:text-emerald-100">구분 기준</div>
              <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">{current.distinction}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-950">
              <div className="mb-1 text-sm font-bold text-gray-900 dark:text-gray-100">예시</div>
              <p className="font-mono text-sm leading-6 text-gray-700 dark:text-gray-300">{current.example}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800 md:col-span-2">
              <div className="mb-1 text-sm font-bold text-gray-900 dark:text-gray-100">원자료 근거</div>
              <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{sourceBasis}</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function JavaVisualStudio({ lectureId }: Props) {
  const studio = javaDeepDiveData[lectureId]?.studio;
  const sourceBasis = javaDeepDiveData[lectureId]?.sourceBasis;
  const [active, setActive] = useState(0);

  if (!studio) return null;

  return (
    <section>
      <SectionTitle title={studio.title} subtitle={studio.subtitle} />
      <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <p className="mb-5 text-sm leading-6 text-gray-600 dark:text-gray-300">{studio.prompt}</p>
        {sourceBasis ? (
          <div className="mb-5 rounded-lg bg-gray-50 px-4 py-3 text-xs leading-5 text-gray-600 dark:bg-gray-950 dark:text-gray-300">
            <span className="font-bold text-gray-900 dark:text-gray-100">원자료 근거 </span>
            {sourceBasis}
          </div>
        ) : null}
        <StudioRenderer studio={studio} active={active} onSelect={setActive} />
      </div>
    </section>
  );
}

function StudioRenderer({
  studio,
  active,
  onSelect,
}: {
  studio: JavaVisualStudio;
  active: number;
  onSelect: (index: number) => void;
}) {
  if (studio.kind === "pipeline") {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-5">
          {studio.items.map((item, idx) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelect(idx)}
              className={cx(
                "relative min-h-32 rounded-lg border p-4 text-left transition-colors",
                active === idx
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30"
                  : "border-gray-200 bg-gray-50 hover:border-amber-300 dark:border-gray-800 dark:bg-gray-950",
              )}
            >
              <div className="mb-2 text-xs font-black text-amber-700 dark:text-amber-200">STEP {idx + 1}</div>
              <div className="text-sm font-bold text-gray-950 dark:text-gray-50">{item.label}</div>
              <div className="mt-1 font-mono text-xs text-gray-500">{item.value}</div>
              {idx < studio.items.length - 1 && (
                <ArrowRight className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-amber-500 lg:block" size={18} />
              )}
            </button>
          ))}
        </div>
        <StudioDetail item={studio.items[active]} tone="amber" />
      </div>
    );
  }

  if (studio.kind === "classifier") {
    return (
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid gap-3 sm:grid-cols-2">
          {studio.items.map((item, idx) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelect(idx)}
              className={cx(
                "rounded-lg border px-4 py-3 text-left transition-colors",
                active === idx
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                  : "border-gray-200 bg-white hover:border-blue-300 dark:border-gray-800 dark:bg-gray-950",
              )}
            >
              <span className="block font-mono text-sm font-bold text-gray-950 dark:text-gray-50">{item.label}</span>
              <span className="mt-1 block text-xs text-gray-500">{item.note}</span>
            </button>
          ))}
        </div>
        <StudioDetail item={studio.items[active]} tone="blue" />
      </div>
    );
  }

  if (studio.kind === "matrix") {
    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full border-collapse text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-950 dark:text-gray-400">
              <tr>
                <th className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">대상</th>
                <th className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">판정</th>
                <th className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">이유</th>
                <th className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">시험 기준</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {studio.items.map((item) => (
                <tr key={item.label} className="bg-white dark:bg-gray-900">
                  <th className="px-4 py-3 font-mono text-xs text-gray-900 dark:text-gray-100">{item.label}</th>
                  <td className="px-4 py-3 font-bold text-amber-700 dark:text-amber-200">{item.value}</td>
                  <td className="px-4 py-3 leading-6 text-gray-600 dark:text-gray-300">{item.detail}</td>
                  <td className="px-4 py-3 leading-6 text-gray-500 dark:text-gray-400">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (studio.kind === "state") {
    return (
      <div className="space-y-3">
        {studio.items.map((item, idx) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onSelect(idx)}
            className={cx(
              "grid w-full gap-3 rounded-lg border p-4 text-left transition-colors md:grid-cols-[8rem_1fr_10rem]",
              active === idx
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/25"
                : "border-gray-200 bg-white hover:border-emerald-300 dark:border-gray-800 dark:bg-gray-950",
            )}
          >
            <span className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-200">STATE {idx + 1}</span>
            <span>
              <span className="block font-bold text-gray-950 dark:text-gray-50">{item.label}</span>
              <span className="mt-1 block text-sm leading-6 text-gray-600 dark:text-gray-300">{item.detail}</span>
            </span>
            <span className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-gray-600 dark:bg-gray-900 dark:text-gray-300">{item.value}</span>
          </button>
        ))}
      </div>
    );
  }

  if (studio.kind === "stack") {
    return (
      <div className="mx-auto max-w-3xl space-y-2">
        {studio.items.map((item, idx) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onSelect(idx)}
            className={cx(
              "w-full rounded-lg border px-5 py-4 text-left shadow-sm transition-colors",
              active === idx
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                : "border-gray-200 bg-white hover:border-indigo-300 dark:border-gray-800 dark:bg-gray-950",
            )}
            style={{ marginLeft: `${idx * 8}px`, width: `calc(100% - ${idx * 16}px)` }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-gray-950 dark:text-gray-50">{item.label}</span>
              <span className="font-mono text-xs text-indigo-700 dark:text-indigo-200">{item.value}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.detail}</p>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {studio.items.map((item, idx) => (
        <button
          key={item.label}
          type="button"
          onClick={() => onSelect(idx)}
          className={cx(
            "rounded-lg border p-4 text-left transition-colors",
            active === idx
              ? "border-violet-500 bg-violet-50 dark:bg-violet-950/25"
              : "border-gray-200 bg-white hover:border-violet-300 dark:border-gray-800 dark:bg-gray-950",
          )}
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-950 text-xs font-black text-white dark:bg-white dark:text-gray-950">
            {idx + 1}
          </div>
          <div className="font-bold text-gray-950 dark:text-gray-50">{item.label}</div>
          <div className="mt-1 font-mono text-xs text-violet-700 dark:text-violet-200">{item.value}</div>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.detail}</p>
          <p className="mt-2 text-xs leading-5 text-gray-500">{item.note}</p>
        </button>
      ))}
    </div>
  );
}

function StudioDetail({
  item,
  tone,
}: {
  item: JavaVisualStudio["items"][number];
  tone: "amber" | "blue";
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/25 dark:text-amber-100"
      : "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950/25 dark:text-blue-100";

  return (
    <div className={`rounded-lg border p-4 ${toneClass}`}>
      <div className="mb-1 text-sm font-black">{item.value}</div>
      <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">{item.detail}</p>
      <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">{item.note}</p>
    </div>
  );
}

function CodeFlow({ lectureId }: Props) {
  const content = javaLectureData[lectureId];
  const [step, setStep] = useState(0);
  const current = content.codeSteps[step];

  return (
    <section>
      <SectionTitle
        title="코드 실행 흐름"
        subtitle="강의 예제의 핵심 문장을 단계별로 따라가며 출력과 규칙을 확인"
      />

      <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex flex-wrap gap-2">
          {content.codeSteps.map((item, idx) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setStep(idx)}
              className={cx(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
                step === idx
                  ? "border-gray-950 bg-gray-950 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-950"
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:border-amber-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300",
              )}
            >
              <Play size={14} />
              {idx + 1}. {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)]">
          <pre className="min-h-56 overflow-x-auto rounded-lg bg-gray-950 p-4 text-sm leading-6 text-amber-100">
            <code>{current.code}</code>
          </pre>

          <div className="space-y-3">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/25">
              <div className="mb-1 flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-100">
                <Code2 size={15} />
                출력·상태
              </div>
              <p className="whitespace-pre-line break-keep text-sm leading-6 text-gray-800 dark:text-gray-200">
                {current.output}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/40">
              <div className="mb-1 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
                <GitBranch size={15} />
                규칙
              </div>
              <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">{current.explanation}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DrillCaseButton({
  item,
  active,
  onClick,
}: {
  item: JavaDrillCase;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-lg border px-3 py-3 text-left transition-colors",
        active
          ? "border-amber-500 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100"
          : "border-gray-200 bg-white text-gray-600 hover:border-amber-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400",
      )}
    >
      <span className="block text-sm font-bold">{item.label}</span>
      <span className="mt-1 block text-xs leading-5 opacity-80">{item.input}</span>
    </button>
  );
}

function DecisionDrill({ lectureId }: Props) {
  const content = javaLectureData[lectureId];
  const [active, setActive] = useState(0);
  const current = content.drill.cases[active];

  return (
    <section>
      <SectionTitle title={content.drill.title} subtitle={content.drill.subtitle} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)]">
        <div className="grid gap-3 sm:grid-cols-2">
          {content.drill.cases.map((item, idx) => (
            <DrillCaseButton
              key={item.label}
              item={item}
              active={idx === active}
              onClick={() => setActive(idx)}
            />
          ))}
        </div>

        <div className="rounded-lg border border-amber-200 bg-white p-5 dark:border-amber-900 dark:bg-gray-900">
          <div className="mb-2 text-xs font-bold uppercase text-amber-700 dark:text-amber-200">판정 결과</div>
          <h3 className="text-lg font-bold text-gray-950 dark:text-gray-50">{current.output}</h3>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{current.rule}</p>
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
  choice: JavaQuizChoice;
  index: number;
  selected?: number;
  revealed: boolean;
  onSelect: () => void;
}) {
  const active = selected === index;
  const state = !revealed
    ? active
      ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30"
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
      className={cx("w-full rounded-lg border px-3 py-3 text-left text-sm transition-colors", state)}
    >
      <span className="flex items-start gap-3">
        <span className="mt-0.5 font-bold">{labels[index]}</span>
        <span className="min-w-0 break-keep leading-6">{choice.text}</span>
        {revealed && (
          <span className="ml-auto shrink-0">
            {choice.isCorrect ? (
              <CheckCircle2 size={16} className="text-emerald-600" />
            ) : (
              <XCircle size={16} className="text-rose-600" />
            )}
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
  const content = javaLectureData[lectureId];
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
      <SectionTitle title="시험형 객관식" subtitle="공식 연습문제 포인트를 변형해 정답 근거와 오답 기준을 함께 확인" />
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
              <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-100">
                Q{idx + 1}
              </span>
              <span className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300">
                {quizItem.category}
              </span>
            </div>
            <p className="mb-3 break-keep text-sm font-semibold leading-6 text-gray-950 dark:text-gray-50">{quizItem.q}</p>
            <div className="space-y-2">
              {quizItem.choices.map((choiceItem, choiceIdx) => (
                <QuizChoiceRow
                  key={`${quizItem.q}-${choiceItem.text}`}
                  choice={choiceItem}
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

export default function JavaLectureReview({ lectureId }: Props) {
  const content = javaLectureData[lectureId];

  return (
    <>
      <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-2 text-xs font-bold text-amber-700 dark:text-amber-300">
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
      <ConceptPanel lectureId={lectureId} />
      <TermDeepDive lectureId={lectureId} />
      <JavaVisualStudio lectureId={lectureId} />
      <CodeFlow lectureId={lectureId} />
      <DecisionDrill lectureId={lectureId} />
      <LectureQuiz lectureId={lectureId} />
    </>
  );
}
