"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, CheckCircle2, Eye, EyeOff, XCircle } from "lucide-react";
import type { SoftwareChoiceKey, SoftwarePastExamQuestion } from "./types";

type Props = {
  question: SoftwarePastExamQuestion;
  selected?: SoftwareChoiceKey;
  answerRevealed?: boolean;
  explanationExpanded?: boolean;
  onSelect: (questionId: string, choice: SoftwareChoiceKey) => void;
  onToggleAnswer: (questionId: string) => void;
  onToggleExplanation: (questionId: string) => void;
};

export default function PastExamQuestionCard({
  question,
  selected,
  answerRevealed = false,
  explanationExpanded = false,
  onSelect,
  onToggleAnswer,
  onToggleExplanation,
}: Props) {
  const correctLabel = question.choices.find((choice) => choice.key === question.correctChoice)?.label;
  const isCorrect = selected === question.correctChoice;
  const visuals = question.images ?? [];

  return (
    <article
      id={question.id}
      className="scroll-mt-20 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
    >
      <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">
            {question.year}년 {question.number}번
          </span>
          {question.conceptTags.slice(0, 2).map((tag) => (
            <span
              key={`${question.id}-${tag}`}
              className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <pre className="whitespace-pre-wrap break-keep rounded-md border border-gray-200 bg-gray-50 p-3 font-sans text-sm leading-7 text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
          {question.prompt}
        </pre>

        {visuals.length > 0 && (
          <div className="space-y-3 rounded-lg border border-emerald-100 bg-white p-3 dark:border-emerald-900 dark:bg-gray-900">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">문항 시각 자료</div>
            {visuals.map((image) => (
              <figure
                key={image.src}
                className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  width={image.cropBoxInternal.width}
                  height={image.cropBoxInternal.height}
                  loading="lazy"
                  className="h-auto max-h-[420px] w-full bg-white object-contain"
                />
              </figure>
            ))}
          </div>
        )}

        <div className="space-y-2">
          {question.choices.map((choice) => {
            const active = selected === choice.key;
            const state = !answerRevealed
              ? active
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                : "border-gray-200 bg-white hover:border-emerald-300 dark:border-gray-700 dark:bg-gray-950"
              : choice.key === question.correctChoice
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                : active
                  ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30"
                  : "border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400";

            return (
              <button
                key={choice.key}
                type="button"
                onClick={() => onSelect(question.id, choice.key)}
                className={`flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left text-sm transition-colors ${state}`}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-700 ring-1 ring-gray-200 dark:bg-gray-950 dark:text-gray-100 dark:ring-gray-700">
                  {choice.label}
                </span>
                <span className="min-w-0 whitespace-pre-wrap break-keep leading-6">{choice.text}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleAnswer(question.id)}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
          >
            {answerRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
            {answerRevealed ? "정답 숨기기" : "정답 보기"}
          </button>
          {answerRevealed && (
            <button
              type="button"
              onClick={() => onToggleExplanation(question.id)}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100 dark:hover:bg-emerald-950"
            >
              {explanationExpanded ? <EyeOff size={16} /> : <BookOpen size={16} />}
              {explanationExpanded ? "해설 접기" : "해설 보기"}
            </button>
          )}
          {answerRevealed && (
            <span
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold ${
                isCorrect
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
                  : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-100"
              }`}
            >
              {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              {selected ? (isCorrect ? "맞힘" : "다시 볼 문제") : "정답 확인"}
            </span>
          )}
        </div>

        {answerRevealed && (
          <div className="rounded-lg border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
            <div className="text-sm font-bold text-emerald-900 dark:text-emerald-100">정답: {correctLabel}</div>
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-200">{question.basis}</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {answerRevealed && explanationExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 rounded-lg border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                {question.choices.map((choice) => {
                  const answer = choice.key === question.correctChoice;
                  return (
                    <div
                      key={`${question.id}-explain-${choice.key}`}
                      className={`rounded-lg border p-3 ${
                        answer
                          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
                          : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
                      }`}
                    >
                      <div className="flex flex-wrap items-start gap-2 text-sm">
                        <span className="font-bold">{choice.label}</span>
                        <span className="min-w-0 whitespace-pre-wrap break-keep">{choice.text}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${answer ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                          {answer ? "정답" : "오답"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">{choice.explanation.reason}</p>
                      <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">{choice.explanation.conceptBasis}</p>
                    </div>
                  );
                })}
                <div className="flex flex-wrap gap-2 pt-1">
                  {question.lectureRefs.map((ref) => (
                    <Link
                      key={`${question.id}-${ref.href}`}
                      href={ref.href}
                      className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-gray-900 dark:text-emerald-100 dark:hover:bg-emerald-950"
                    >
                      <BookOpen size={13} />
                      {ref.label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}
