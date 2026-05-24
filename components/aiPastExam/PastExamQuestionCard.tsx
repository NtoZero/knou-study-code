"use client";

import { AnimatePresence, motion } from "framer-motion";
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
  idle:
    "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/40",
  selected:
    "border-indigo-400 bg-indigo-50 text-indigo-800 dark:border-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-200",
  correct:
    "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-200",
  wrong:
    "border-rose-500 bg-rose-50 text-rose-800 dark:border-rose-500 dark:bg-rose-950/50 dark:text-rose-200",
  dimmed:
    "border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-500",
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
      className="scroll-mt-20 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
    >
      <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200">
            {question.year}년 {question.number}번
          </span>
          {question.conceptTags.map((tag) => (
            <span
              key={`${question.id}-${tag}`}
              className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="overflow-x-auto rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
          <pre className="whitespace-pre-wrap break-keep font-sans text-sm leading-7 text-gray-800 dark:text-gray-100">
            {question.prompt}
          </pre>
        </div>

        {visuals.length > 0 && (
          <div className="space-y-3 rounded-md border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">문항 시각 자료</div>
            {visuals.map((image) => (
              <figure key={image.src} className="overflow-hidden rounded-md border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
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
          <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">답 선택</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {question.choices.map((choice) => {
              const state = getChoiceState(question, selected, choice.key, revealed);
              return (
                <button
                  key={choice.key}
                  type="button"
                  onClick={() => onSelect(question.id, choice.key)}
                  className={`flex min-h-11 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors ${choiceStyle[state]}`}
                  aria-pressed={selected === choice.key}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onReveal(question.id)}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
            {revealed ? "해설 접기" : "정답 보기"}
          </button>
          {revealed && (
            <span
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold ${
                isCorrect
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200"
                  : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200"
              }`}
            >
              {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              {selected ? (isCorrect ? "맞힘" : "다시 볼 문제") : "정답 확인"}
            </span>
          )}
        </div>

        <AnimatePresence initial={false}>
          {revealed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 rounded-lg border border-indigo-100 bg-indigo-50/70 p-4 dark:border-indigo-900 dark:bg-indigo-950/30">
                <div>
                  <div className="text-sm font-bold text-indigo-800 dark:text-indigo-200">
                    정답: {question.correctChoice}번
                  </div>
                  <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-200">
                    정답 해설: 이 문항은 <strong>{question.lectureRefs[0].concept}</strong>을 묻습니다.
                    {question.basis}
                  </p>
                </div>

                <div className="rounded-md bg-white p-3 text-sm leading-6 text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                  <div className="font-semibold text-gray-900 dark:text-white">오답 기준</div>
                  <p className="mt-1">
                    {selectedChoice && selectedChoice.key !== question.correctChoice
                      ? `${selectedChoice.label} 선택은 ${question.wrongRule}`
                      : question.wrongRule}
                  </p>
                </div>

                <div className="rounded-md bg-white p-3 text-sm leading-6 text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                  <div className="font-semibold text-gray-900 dark:text-white">시험 포인트</div>
                  <p className="mt-1">{question.examSkill}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {question.lectureRefs.map((ref) => (
                    <Link
                      key={`${question.id}-${ref.href}`}
                      href={ref.href}
                      className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-800 dark:bg-gray-900 dark:text-indigo-200 dark:hover:bg-indigo-950"
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
