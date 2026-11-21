"use client";

import { MarkedText } from "./KeyPhrase";
import { ArrowDown, ArrowDownRight } from "lucide-react";
import { Sourced, useSourceVisible } from "@/components/dlShared/SourceFilter";

export interface ConceptGroup {
  title: string;
  source: string;
  textbook?: string;
  lectureSource?: string;
  terms: {
    name: string;
    english?: string;
    definition: string;
    example: string;
    anchor: string;
  }[];
}

interface Props {
  groups: ConceptGroup[];
  firstLab: string;
}

function termId(name: string) {
  return `concept-${name.replaceAll(" ", "-")}`;
}

export default function LectureConcepts({ groups, firstLab }: Props) {
  const slidesVisible = useSourceVisible(["slides"]);
  const lectureVisible = useSourceVisible(["lecture"]);
  const groupLinks = groups.map((group, index) => ({ group, index }))
    .filter(({ group }) => slidesVisible || (group.lectureSource && lectureVisible));
  return (
    <section id="key-concepts" aria-labelledby="key-concepts-title" className="scroll-mt-36">
      <h2 id="key-concepts-title" className="mb-2 text-xl font-bold">핵심 개념과 정의</h2>
      {groupLinks.length > 0 && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
          <details className="min-w-0 grow rounded-lg border border-slate-300 bg-white px-3 dark:border-slate-600 dark:bg-slate-900">
            <summary className="cursor-pointer py-2 text-sm font-bold text-teal-900 dark:text-teal-200">
              용어 색인 ({groupLinks.reduce((total, { group }) => total + group.terms.length, 0)}개)
            </summary>
            <nav aria-label="핵심 개념 바로가기" className="border-t border-slate-200 pb-2 dark:border-slate-700">
              {groupLinks.map(({ group, index }) => (
                <div key={group.title} className="py-2">
                  <a href={`#concept-group-${index + 1}`} className="text-sm font-bold text-slate-700 hover:underline dark:text-slate-300">{group.title}</a>
                  <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                    {group.terms.map(term => (
                      <li key={term.name}>
                        <a href={`#${termId(term.name)}`} className="inline-block py-1 text-sm font-semibold text-teal-800 underline decoration-teal-300 underline-offset-4 hover:decoration-current dark:text-teal-200 dark:decoration-teal-700">
                          {term.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </details>
          <a href={`#${firstLab}`} className="inline-flex items-center gap-1 py-2 text-sm text-slate-600 hover:underline dark:text-slate-300">
            첫 실습으로 <ArrowDown size={14} aria-hidden="true" />
          </a>
        </div>
      )}

      <div className="space-y-8">
        {groups.map((group, i) => (
          <Sourced key={group.title} refs={{ slides: group.source, lecture: group.lectureSource }}>
            <div id={`concept-group-${i + 1}`} className="scroll-mt-36">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold">{group.title}</h3>
                {group.textbook && <span className="rounded-full border border-gray-200 px-2 py-0.5 text-[11px] text-gray-600 dark:border-gray-700 dark:text-gray-300">{group.textbook}</span>}
              </div>
              <dl className="mt-3 grid gap-4 lg:grid-cols-2">
                {group.terms.map(term => (
                  <div key={term.name} id={termId(term.name)} className="min-w-0 scroll-mt-36 rounded-xl border border-slate-200 border-l-4 border-l-teal-700 bg-white p-4 target:ring-2 target:ring-teal-500 dark:border-slate-700 dark:border-l-teal-400 dark:bg-slate-900">
                    <dt className="flex flex-wrap items-baseline gap-x-2">
                      <a href={`#${term.anchor}`} className="inline-flex items-center gap-1 text-2xl font-extrabold tracking-tight text-teal-900 hover:underline dark:text-teal-300">
                        {term.name}
                        <ArrowDownRight size={14} aria-hidden="true" />
                        <span className="sr-only"> 관련 본문으로 이동</span>
                      </a>
                      {term.english && term.english !== term.name && <span lang="en" className="text-xs text-gray-500 dark:text-gray-400">{term.english}</span>}
                    </dt>
                    <dd className="mt-3 text-base leading-7 text-slate-800 dark:text-slate-200">
                      <span className="mb-1 block text-xs font-bold text-teal-800 dark:text-teal-300">정의</span>
                      <MarkedText text={term.definition} />
                    </dd>
                    <dd className="mt-3 border-t border-slate-200 pt-2 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                      <span className="mr-2 text-xs font-bold">예시</span>{term.example}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Sourced>
        ))}
      </div>
    </section>
  );
}
