"use client";

import Link from "next/link";
import { BookOpen, CheckCircle2, Eye, EyeOff, XCircle } from "lucide-react";
import type { ChoiceKey, PastExamQuestion } from "./types";

type Props = {
  question: PastExamQuestion;
  selected?: ChoiceKey;
  revealed: boolean;
  onSelect: (questionId: string, choice: ChoiceKey) => void;
  onReveal: (questionId: string) => void;
};

const choiceStyle = {
  idle: "border-slate-200 bg-white text-slate-700 hover:border-cyan-400 hover:bg-cyan-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-300 dark:hover:bg-cyan-950/40",
  selected: "border-cyan-500 bg-cyan-50 text-cyan-900 dark:border-cyan-300 dark:bg-cyan-950/60 dark:text-cyan-100",
  correct: "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-100",
  wrong: "border-rose-500 bg-rose-50 text-rose-800 dark:border-rose-400 dark:bg-rose-950/60 dark:text-rose-100",
  dimmed: "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400",
};

function getChoiceState(question: PastExamQuestion, selected: ChoiceKey | undefined, key: ChoiceKey, revealed: boolean) {
  if (!revealed) return selected === key ? "selected" : "idle";
  if (question.correctChoice === key) return "correct";
  if (selected === key) return "wrong";
  return "dimmed";
}

export default function PastExamQuestionCard({ question, selected, revealed, onSelect, onReveal }: Props) {
  const isCorrect = selected === question.correctChoice;
  const selectedChoice = question.choices.find((choice) => choice.key === selected);
  const visuals = question.images ?? [];

  return (
    <article
      id={question.id}
      className="scroll-mt-20 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-cyan-100 px-2.5 py-1 text-xs font-bold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-100">
            {question.year}년 {question.number}번
          </span>
          {question.conceptTags.map((tag) => (
            <span
              key={`${question.id}-${tag}`}
              className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
          <pre className="whitespace-pre-wrap break-keep font-sans text-sm leading-7 text-slate-800 dark:text-slate-100">
            {question.prompt}
          </pre>
        </div>

        {visuals.length > 0 && (
          <div className="space-y-3 rounded-lg border border-cyan-200 bg-white p-3 dark:border-cyan-900 dark:bg-slate-900">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">문항 시각 자료</div>
            {visuals.map((image) => (
              <figure key={image.src} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="h-auto w-full bg-white object-contain"
                />
              </figure>
            ))}
          </div>
        )}

        <div>
          <div className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">답 선택</div>
          <div className="space-y-2">
            {question.choices.map((choice) => {
              const state = getChoiceState(question, selected, choice.key, revealed);
              return (
                <button
                  key={choice.key}
                  type="button"
                  onClick={() => onSelect(question.id, choice.key)}
                  className={`flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left text-sm transition-colors ${choiceStyle[state]}`}
                  aria-pressed={selected === choice.key}
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-950 dark:text-slate-100 dark:ring-slate-700">
                    {choice.label}
                  </span>
                  <span className="min-w-0 whitespace-pre-wrap break-keep leading-6">{choice.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onReveal(question.id)}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-cyan-200 dark:text-slate-950 dark:hover:bg-cyan-100"
          >
            {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
            {revealed ? "해설 접기" : "정답 보기"}
          </button>
          {revealed && (
            <span
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold ${
                isCorrect
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-100"
                  : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-100"
              }`}
            >
              {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              {selected ? (isCorrect ? "맞힘" : "다시 볼 문제") : "정답 확인"}
            </span>
          )}
        </div>

        {revealed && (
          <div className="space-y-4 rounded-xl border border-cyan-100 bg-cyan-50/70 p-4 dark:border-cyan-900 dark:bg-cyan-950/30">
            <div>
              <div className="text-sm font-bold text-cyan-900 dark:text-cyan-100">
                정답: {question.correctChoice}번
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                <strong>{question.lectureRefs[0].concept}</strong> 근거: {question.basis}
              </p>
            </div>

            <div className="rounded-lg bg-white p-3 text-sm leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <div className="font-semibold text-slate-950 dark:text-white">선택지별 해설</div>
              <div className="mt-3 space-y-2">
                {question.choices.map((choice) => {
                  const isAnswer = choice.key === question.correctChoice;
                  const isSelected = selectedChoice?.key === choice.key;
                  return (
                    <div
                      key={`${question.id}-explanation-${choice.key}`}
                      className={`rounded-lg border p-3 ${
                        isAnswer
                          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
                          : isSelected
                            ? "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30"
                            : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold">{choice.label}</span>
                        <span className="whitespace-pre-wrap break-keep">{choice.text}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                            isAnswer
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-100"
                          }`}
                        >
                          {isAnswer ? "정답" : "오답"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6">{choice.explanation.reason}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {choice.explanation.conceptBasis}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg bg-white p-3 text-sm leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <div className="font-semibold text-slate-950 dark:text-white">시험 포인트</div>
              <p className="mt-1">{question.examSkill}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {question.lectureRefs.map((ref) => (
                <Link
                  key={`${question.id}-${ref.href}`}
                  href={ref.href}
                  className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-white px-3 py-1.5 text-xs font-semibold text-cyan-800 transition-colors hover:bg-cyan-100 dark:border-cyan-800 dark:bg-slate-900 dark:text-cyan-100 dark:hover:bg-cyan-950"
                >
                  <BookOpen size={13} />
                  {ref.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
