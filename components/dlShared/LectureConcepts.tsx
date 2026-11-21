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

export default function LectureConcepts({ groups, firstLab }: Props) {
  const slidesVisible = useSourceVisible(["slides"]);
  const lectureVisible = useSourceVisible(["lecture"]);
  const groupLinks = groups.map((group, index) => ({ group, index }))
    .filter(({ group }) => slidesVisible || (group.lectureSource && lectureVisible));
  return (
    <section id="key-concepts" aria-labelledby="key-concepts-title" className="scroll-mt-36">
      <h2 id="key-concepts-title" className="mb-2 text-xl font-bold">핵심 개념과 정의</h2>
      {groupLinks.length > 0 && (
        <nav aria-label="핵심 개념 바로가기" className="mb-6 flex flex-wrap items-center gap-2">
          {groupLinks.map(({ group, index: i }) => (
            <a key={group.title} href={`#concept-group-${i + 1}`} className="rounded-full border border-teal-200 px-3 py-1.5 text-sm text-teal-800 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-200 dark:hover:bg-teal-950">
              {group.title}
            </a>
          ))}
          <a href={`#${firstLab}`} className="inline-flex items-center gap-1 px-2 py-1 text-sm underline underline-offset-4">
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
                  <div key={term.name} className="min-w-0 border-t border-gray-200 py-4 dark:border-gray-700">
                    <dt className="flex flex-wrap items-baseline gap-x-2">
                      <a href={`#${term.anchor}`} className="inline-flex items-center gap-1 font-bold text-teal-800 hover:underline dark:text-teal-300">
                        {term.name}
                        <ArrowDownRight size={14} aria-hidden="true" />
                        <span className="sr-only"> 관련 본문으로 이동</span>
                      </a>
                      {term.english && term.english !== term.name && <span lang="en" className="text-xs text-gray-500 dark:text-gray-400">{term.english}</span>}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-6">{term.definition}</dd>
                    <dd className="mt-2 border-l-2 border-teal-200 pl-3 text-[13px] leading-5 text-gray-600 dark:border-teal-800 dark:text-gray-300">
                      {term.example}
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
