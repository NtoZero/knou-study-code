"use client";

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
        <nav aria-label="핵심 개념 바로가기" className="mb-7 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
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
          <a href={`#${firstLab}`} className="mt-2 inline-flex items-center gap-1 text-sm text-slate-600 hover:underline dark:text-slate-300">
            첫 실습으로 <ArrowDown size={14} aria-hidden="true" />
          </a>
        </nav>
      )}

      <div className="space-y-8">
        {groups.map((group, i) => (
          <Sourced key={group.title} refs={{ slides: group.source, lecture: group.lectureSource }}>
            <div id={`concept-group-${i + 1}`} className="scroll-mt-36">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold">{group.title}</h3>
                {group.textbook && <span className="rounded-full border border-gray-200 px-2 py-0.5 text-[11px] text-gray-600 dark:border-gray-700 dark:text-gray-300">{group.textbook}</span>}
              </div>
              <dl className="mt-3 grid gap-x-6 lg:grid-cols-2">
                {group.terms.map(term => (
                  <div key={term.name} id={termId(term.name)} className="min-w-0 scroll-mt-36 border-t border-gray-200 px-2 py-5 target:bg-teal-50 dark:border-gray-700 dark:target:bg-teal-950/40">
                    <dt className="flex flex-wrap items-baseline gap-x-2">
                      <a href={`#${term.anchor}`} className="inline-flex items-center gap-1 text-xl font-bold tracking-tight text-teal-900 hover:underline dark:text-teal-300">
                        {term.name}
                        <ArrowDownRight size={14} aria-hidden="true" />
                        <span className="sr-only"> 관련 본문으로 이동</span>
                      </a>
                      {term.english && term.english !== term.name && <span lang="en" className="text-xs text-gray-500 dark:text-gray-400">{term.english}</span>}
                    </dt>
                    <dd className="mt-2 text-[15px] leading-7 text-slate-800 dark:text-slate-200">
                      <span className="mr-2 text-xs font-bold text-teal-800 dark:text-teal-300">정의</span>
                      {term.definition.split(/\*\*(.+?)\*\*/g).map((part, index) => index % 2 === 1
                        ? <strong key={index} className="rounded-sm bg-amber-100 font-bold text-slate-950 dark:bg-amber-300/20 dark:text-amber-100">{part}</strong>
                        : part)}
                    </dd>
                    <dd className="mt-2 border-l-2 border-teal-200 pl-3 text-[13px] leading-5 text-gray-600 dark:border-teal-800 dark:text-gray-300">
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
