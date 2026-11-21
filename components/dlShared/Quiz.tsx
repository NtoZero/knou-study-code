"use client";

import { useState, type ReactNode } from "react";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";

export interface OfficialQuizItem {
  q: ReactNode;
  context?: ReactNode;
  choices: ReactNode[];
  /** 공식 정답의 보기 위치 (0부터 시작). */
  answer: number;
  explanation: ReactNode;
}

export default function Quiz({ items }: { items: OfficialQuizItem[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => items.map(() => null));
  const correctCount = answers.filter((answer, i) => answer === items[i].answer).length;
  const allAnswered = items.length > 0 && answers.every(answer => answer !== null);

  function select(question: number, choice: number) {
    setAnswers(previous => previous.map((answer, i) => i === question && answer === null ? choice : answer));
  }

  return (
    <section id="quiz" className="scroll-mt-36">
      <SectionTitle title="복습 퀴즈" subtitle={`공식 연습문제 ${items.length}문항`} />
      <div className="space-y-6">
        {items.map((item, qi) => {
          const selected = answers[qi];
          const done = selected !== null;
          return (
            <Sourced key={qi} refs={{ exercise: `${qi + 1}번` }}>
              <article className="min-w-0 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                <h4 className="mb-3 text-base font-bold text-gray-900 dark:text-gray-100">{item.q}</h4>
                {item.context && <div className="mb-4 text-sm leading-6">{item.context}</div>}
                <div className="space-y-2">
                  {item.choices.map((choice, ci) => {
                    const correct = done && ci === item.answer;
                    const wrong = done && ci === selected && !correct;
                    const tone = correct ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : wrong ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-200 enabled:hover:bg-teal-50 dark:border-gray-700 dark:enabled:hover:bg-teal-950";
                    return (
                      <button key={ci} type="button" disabled={done} onClick={() => select(qi, ci)}
                        className={`flex w-full items-start gap-2 rounded-lg border p-3 text-left text-sm ${tone}`}>
                        <span className="shrink-0 font-bold">{String.fromCharCode(9312 + ci)}</span>
                        <span className="min-w-0">{choice}</span>
                        {correct && <CheckCircle aria-label="정답" size={17} className="ml-auto shrink-0 text-green-600" />}
                        {wrong && <XCircle aria-label="선택한 오답" size={17} className="ml-auto shrink-0 text-red-600" />}
                      </button>
                    );
                  })}
                </div>
                <div role="status">
                  {done && (
                    <div className="mt-4 rounded-lg border-l-4 border-teal-600 bg-teal-50 p-4 dark:bg-teal-950/40">
                      <p className="font-bold">{selected === item.answer ? "정답" : "오답"} — 정답은 {String.fromCharCode(9312 + item.answer)}번</p>
                      <h5 className="mb-1 mt-3 text-sm font-bold">공식 해설</h5>
                      <div className="text-sm leading-7">{item.explanation}</div>
                    </div>
                  )}
                </div>
              </article>
            </Sourced>
          );
        })}
      </div>
      {allAnswered && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50 p-5 dark:border-teal-800 dark:bg-teal-950">
          <p className="text-lg font-bold">결과: {correctCount} / {items.length}</p>
          <button type="button" onClick={() => setAnswers(items.map(() => null))}
            className="flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white">
            <RotateCcw size={14} /> 다시 풀기
          </button>
        </div>
      )}
    </section>
  );
}
