"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import type { SecurityChoiceKey, SecurityPastExamQuestion } from "./types";

type Props = {
  question: SecurityPastExamQuestion;
  selected?: SecurityChoiceKey;
  revealed?: boolean;
  answerRevealed?: boolean;
  explanationExpanded?: boolean;
  onSelect: (questionId: string, choice: SecurityChoiceKey) => void;
  onReveal?: (questionId: string) => void;
  onToggleAnswer?: (questionId: string) => void;
  onToggleExplanation?: (questionId: string) => void;
};

type ChoiceState = "idle" | "selected" | "correct" | "wrong" | "dimmed";

const choiceStyle: Record<ChoiceState, string> = {
  idle:
    "border-gray-200 bg-white text-gray-800 hover:border-cyan-300 hover:bg-cyan-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:border-cyan-600 dark:hover:bg-cyan-950/30",
  selected:
    "border-cyan-500 bg-cyan-50 text-cyan-900 dark:border-cyan-500 dark:bg-cyan-950/40 dark:text-cyan-100",
  correct:
    "border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-100",
  wrong:
    "border-rose-500 bg-rose-50 text-rose-900 dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-100",
  dimmed:
    "border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-500",
};

function getChoiceState({
  question,
  selected,
  key,
  revealed,
}: {
  question: SecurityPastExamQuestion;
  selected?: SecurityChoiceKey;
  key: SecurityChoiceKey;
  revealed: boolean;
}): ChoiceState {
  if (!revealed) return selected === key ? "selected" : "idle";
  if (question.correctChoice === key) return "correct";
  if (selected === key) return "wrong";
  return "dimmed";
}

export default function PastExamQuestionCard({
  question,
  selected,
  revealed,
  answerRevealed,
  explanationExpanded,
  onSelect,
  onReveal,
  onToggleAnswer,
  onToggleExplanation,
}: Props) {
  const answerVisible = answerRevealed ?? revealed ?? false;
  const explanationOpen = explanationExpanded ?? revealed ?? false;
  const splitControls =
    answerRevealed !== undefined ||
    explanationExpanded !== undefined ||
    onToggleAnswer !== undefined ||
    onToggleExplanation !== undefined;
  const isCorrect = selected === question.correctChoice;
  const selectedChoice = question.choices.find((choice) => choice.key === selected);
  const correctLabel = question.choices.find((choice) => choice.key === question.correctChoice)?.label;
  const handleToggleAnswer = () => (onToggleAnswer ?? onReveal)?.(question.id);
  const handleToggleExplanation = () => (onToggleExplanation ?? onReveal)?.(question.id);

  return (
    <article
      id={question.id}
      className="scroll-mt-20 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
    >
      <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-cyan-100 px-2.5 py-1 text-xs font-bold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-100">
            {question.year}년 {question.number}번
          </span>
          {question.conceptTags.map((tag) => (
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
        <div className="overflow-x-auto rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
          <pre className="whitespace-pre-wrap break-keep font-sans text-sm leading-7 text-gray-900 dark:text-gray-100">
            {question.prompt}
          </pre>
        </div>

        <div>
          <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            답 선택
          </div>
          <div className="space-y-2">
            {question.choices.map((choice) => {
              const state = getChoiceState({
                question,
                selected,
                key: choice.key,
                revealed: answerVisible,
              });

              return (
                <button
                  key={choice.key}
                  type="button"
                  onClick={() => onSelect(question.id, choice.key)}
                  aria-pressed={selected === choice.key}
                  className={`flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left text-sm transition-colors ${choiceStyle[state]}`}
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-700 ring-1 ring-gray-200 dark:bg-gray-950 dark:text-gray-100 dark:ring-gray-700">
                    {choice.label}
                  </span>
                  <span className="min-w-0 whitespace-pre-wrap break-keep leading-6">
                    {choice.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleToggleAnswer}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
          >
            {answerVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            {answerVisible ? "정답 숨기기" : "정답 보기"}
          </button>
          {answerVisible && splitControls && (
            <button
              type="button"
              onClick={handleToggleExplanation}
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-800 transition-colors hover:bg-cyan-100 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-100 dark:hover:bg-cyan-950"
            >
              {explanationOpen ? <EyeOff size={16} /> : <BookOpen size={16} />}
              {explanationOpen ? "해설 접기" : "해설 보기"}
            </button>
          )}
          {answerVisible && (
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

        {answerVisible && (
          <div className="rounded-lg border border-cyan-100 bg-cyan-50/70 p-4 dark:border-cyan-900 dark:bg-cyan-950/20">
            <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-cyan-900 dark:text-cyan-100">
              <ShieldCheck size={16} />
              정답: {correctLabel}
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-200">
              <strong>{question.lectureRefs[0].concept}</strong> 기준: {question.basis}
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {answerVisible && explanationOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 rounded-lg border border-cyan-100 bg-cyan-50/70 p-4 dark:border-cyan-900 dark:bg-cyan-950/20">
                <div className="rounded-md bg-white p-3 text-sm leading-6 text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                  <div className="font-semibold text-gray-950 dark:text-white">
                    선택지별 해설
                  </div>
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
                                : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
                          }`}
                        >
                          <div className="flex flex-wrap items-start gap-2">
                            <span className="font-bold">{choice.label}</span>
                            <span className="min-w-0 whitespace-pre-wrap break-keep">
                              {choice.text}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                                isAnswer
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
                                  : "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100"
                              }`}
                            >
                              {isAnswer ? "정답" : "오답"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6">{choice.explanation.reason}</p>
                          <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                            {choice.explanation.conceptBasis}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-md bg-white p-3 text-sm leading-6 text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                  <div className="font-semibold text-gray-950 dark:text-white">시험 포인트</div>
                  <p className="mt-1">{question.examSkill}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {question.lectureRefs.map((ref) => (
                    <Link
                      key={`${question.id}-${ref.href}`}
                      href={ref.href}
                      className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-white px-3 py-1.5 text-xs font-semibold text-cyan-800 transition-colors hover:bg-cyan-100 dark:border-cyan-800 dark:bg-gray-900 dark:text-cyan-100 dark:hover:bg-cyan-950"
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
