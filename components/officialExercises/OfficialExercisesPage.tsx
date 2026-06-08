"use client";

import { useMemo, useState } from "react";
import NextImage from "next/image";
import {
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  FileQuestion,
  Filter,
  Image as ImageIcon,
  ListChecks,
  RotateCcw,
  Search,
} from "lucide-react";
import type {
  OfficialExerciseQuestion,
  OfficialExerciseStats,
  OfficialExerciseSubject,
  OfficialExerciseSubjectMeta,
} from "./types";

type Props = {
  subjects: OfficialExerciseSubjectMeta[];
  questions: OfficialExerciseQuestion[];
  stats: OfficialExerciseStats;
};

type SubjectFilter = "전체" | OfficialExerciseSubject;
type LectureFilter = "전체" | number;
type KindFilter = "전체" | "multiple" | "written" | "image";
type AnswerMode = "practice" | "answers";

const subjectStyles: Record<
  OfficialExerciseSubject,
  {
    badge: string;
    bar: string;
    ring: string;
  }
> = {
  "컴퓨터보안": {
    badge: "border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-100",
    bar: "bg-purple-500",
    ring: "focus:ring-purple-500",
  },
  "소프트웨어공학": {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
    bar: "bg-emerald-500",
    ring: "focus:ring-emerald-500",
  },
  "정보통신망": {
    badge: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100",
    bar: "bg-blue-500",
    ring: "focus:ring-blue-500",
  },
  "Java프로그래밍": {
    badge: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
    bar: "bg-amber-500",
    ring: "focus:ring-amber-500",
  },
  "인공지능": {
    badge: "border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100",
    bar: "bg-indigo-500",
    ring: "focus:ring-indigo-500",
  },
  "알고리즘": {
    badge: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100",
    bar: "bg-rose-500",
    ring: "focus:ring-rose-500",
  },
};

function matchesQuery(question: OfficialExerciseQuestion, query: string) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return true;

  return [
    question.subject,
    question.lectureTitle,
    question.prompt,
    question.answer,
    question.explanation,
    question.stimulus,
    ...question.choices.map((choice) => choice.text),
  ]
    .join(" ")
    .toLowerCase()
    .includes(keyword);
}

function questionKindLabel(question: OfficialExerciseQuestion) {
  if (question.kind === "written") return "서술형";
  return "객관식";
}

function heatClass(count: number) {
  if (count >= 8) return "border-rose-400 bg-rose-500 text-white";
  if (count >= 5) return "border-orange-300 bg-orange-300 text-gray-950";
  if (count >= 3) return "border-blue-300 bg-blue-200 text-blue-950";
  if (count > 0) return "border-emerald-300 bg-emerald-100 text-emerald-900";
  return "border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-600";
}

export default function OfficialExercisesPage({ subjects, questions, stats }: Props) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<SubjectFilter>("전체");
  const [lecture, setLecture] = useState<LectureFilter>("전체");
  const [kind, setKind] = useState<KindFilter>("전체");
  const [answerMode, setAnswerMode] = useState<AnswerMode>("practice");
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      if (subject !== "전체" && question.subject !== subject) return false;
      if (lecture !== "전체" && question.lectureId !== lecture) return false;
      if (kind === "multiple" && question.kind !== "multiple") return false;
      if (kind === "written" && question.kind !== "written") return false;
      if (kind === "image" && !question.image) return false;
      return matchesQuery(question, query);
    });
  }, [kind, lecture, query, questions, subject]);

  const lectureOptions = useMemo(() => {
    const base = subject === "전체"
      ? questions
      : questions.filter((question) => question.subject === subject);
    return Array.from(new Set(base.map((question) => question.lectureId))).sort((a, b) => a - b);
  }, [questions, subject]);

  const selectedMultipleQuestions = questions.filter(
    (question) => question.kind === "multiple" && selectedChoices[question.id],
  );
  const correctCount = selectedMultipleQuestions.filter(
    (question) => selectedChoices[question.id] === question.correctChoice,
  ).length;
  const selectedCount = selectedMultipleQuestions.length;

  function resetFilters() {
    setQuery("");
    setSubject("전체");
    setLecture("전체");
    setKind("전체");
  }

  function resetPractice() {
    setAnswerMode("practice");
    setSelectedChoices({});
    setRevealed({});
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <header className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-800">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white">
              <BookOpenCheck size={14} />
              U-KNOU 공식 연습문제
            </div>
            <h1 className="text-2xl font-black text-gray-950 dark:text-gray-50 sm:text-3xl">
              2026-1학기 6과목 연습문제 시각화
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
              학습창 연습문제 영역에서 확인한 문항을 과목·강의·문항 유형별로 묶고,
              정답 확인과 이미지 문제 복습을 한 화면에서 진행합니다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4">
            <Stat value={stats.totalQuestions} label="문항" />
            <Stat value={stats.activeSubjects} label="출제 과목" />
            <Stat value={stats.imageQuestions} label="이미지" />
            <Stat value={stats.writtenQuestions} label="서술형" />
          </div>
        </div>
      </header>

      <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_1.25fr]">
        <SubjectDistribution subjects={subjects} questions={questions} />
        <LectureHeatmap
          subjects={subjects}
          questions={questions}
          onSelect={(nextSubject, nextLecture) => {
            setSubject(nextSubject);
            setLecture(nextLecture);
          }}
        />
      </section>

      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
          <Filter size={16} />
          문제 필터
        </div>
        <div className="grid gap-3 xl:grid-cols-[1.3fr_0.85fr_0.65fr_0.7fr_auto_auto]">
          <label className="relative block">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="문제, 보기, 정답, 해설 검색"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none transition-colors focus:border-blue-400 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>

          <select
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value as SubjectFilter);
              setLecture("전체");
            }}
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="전체">전체 과목</option>
            {subjects.map((item) => (
              <option key={item.subject} value={item.subject}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={lecture}
            onChange={(event) =>
              setLecture(event.target.value === "전체" ? "전체" : Number(event.target.value))
            }
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="전체">전체 강의</option>
            {lectureOptions.map((item) => (
              <option key={item} value={item}>
                {item}강
              </option>
            ))}
          </select>

          <select
            value={kind}
            onChange={(event) => setKind(event.target.value as KindFilter)}
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="전체">전체 유형</option>
            <option value="multiple">객관식</option>
            <option value="written">서술형</option>
            <option value="image">이미지 문항</option>
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <RotateCcw size={15} />
            필터 초기화
          </button>

          <button
            type="button"
            onClick={() => setAnswerMode(answerMode === "answers" ? "practice" : "answers")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gray-950 px-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
          >
            {answerMode === "answers" ? <EyeOff size={15} /> : <Eye size={15} />}
            {answerMode === "answers" ? "정답 접기" : "정답 전체 보기"}
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            필터 결과 <span className="font-bold text-gray-900 dark:text-gray-100">{filteredQuestions.length}</span>문항
            {" · "}
            선택 채점 <span className="font-bold text-gray-900 dark:text-gray-100">{correctCount}/{selectedCount}</span>
          </div>
          <button
            type="button"
            onClick={resetPractice}
            className="inline-flex w-fit items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
          >
            <RotateCcw size={13} />
            선택·해설 초기화
          </button>
        </div>
      </section>

      <main className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              selectedChoice={selectedChoices[question.id]}
              revealed={answerMode === "answers" || Boolean(revealed[question.id])}
              onSelect={(choice) =>
                setSelectedChoices((prev) => ({ ...prev, [question.id]: choice }))
              }
              onToggleReveal={() =>
                setRevealed((prev) => ({ ...prev, [question.id]: !prev[question.id] }))
              }
            />
          ))
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            조건에 맞는 공식 연습문제가 없습니다. 필터를 넓혀 다시 확인합니다.
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-3 dark:border-gray-800 dark:bg-gray-950">
      <div className="font-mono text-xl font-black text-gray-950 dark:text-gray-50">{value}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  );
}

function SubjectDistribution({
  subjects,
  questions,
}: {
  subjects: OfficialExerciseSubjectMeta[];
  questions: OfficialExerciseQuestion[];
}) {
  const maxCount = Math.max(1, ...subjects.map((subject) =>
    questions.filter((question) => question.subject === subject.subject).length,
  ));

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
        <BarChart3 size={16} />
        과목별 문항 분포
      </div>
      <div className="space-y-3">
        {subjects.map((subject) => {
          const count = questions.filter((question) => question.subject === subject.subject).length;
          const imageCount = questions.filter(
            (question) => question.subject === subject.subject && question.image,
          ).length;
          const width = `${Math.max(count > 0 ? 12 : 0, (count / maxCount) * 100)}%`;

          return (
            <div key={subject.subject}>
              <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                <span className={`rounded-md border px-2 py-1 font-bold ${subjectStyles[subject.subject].badge}`}>
                  {subject.label}
                </span>
                <span className="font-mono font-bold text-gray-600 dark:text-gray-300">
                  {count}문항{imageCount ? ` · 이미지 ${imageCount}` : ""}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-900">
                <div className={`h-full rounded-full ${subjectStyles[subject.subject].bar}`} style={{ width }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LectureHeatmap({
  subjects,
  questions,
  onSelect,
}: {
  subjects: OfficialExerciseSubjectMeta[];
  questions: OfficialExerciseQuestion[];
  onSelect: (subject: OfficialExerciseSubject, lectureId: number) => void;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
        <ListChecks size={16} />
        강의별 출제 밀도
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[780px] space-y-2">
          <div className="grid grid-cols-[112px_repeat(15,minmax(0,1fr))] gap-1 text-center text-[11px] font-bold text-gray-500">
            <div />
            {Array.from({ length: 15 }, (_, index) => (
              <div key={index + 1}>{index + 1}</div>
            ))}
          </div>
          {subjects.map((subject) => (
            <div key={subject.subject} className="grid grid-cols-[112px_repeat(15,minmax(0,1fr))] gap-1">
              <div className="truncate py-1 text-xs font-bold text-gray-700 dark:text-gray-300">
                {subject.label}
              </div>
              {Array.from({ length: 15 }, (_, index) => {
                const lectureId = index + 1;
                const count = questions.filter(
                  (question) => question.subject === subject.subject && question.lectureId === lectureId,
                ).length;

                return (
                  <button
                    key={`${subject.subject}-${lectureId}`}
                    type="button"
                    onClick={() => count > 0 && onSelect(subject.subject, lectureId)}
                    disabled={count === 0}
                    title={`${subject.label} ${lectureId}강 ${count}문항`}
                    className={`h-8 rounded-md border text-[11px] font-black transition-transform enabled:hover:-translate-y-0.5 ${heatClass(count)}`}
                  >
                    {count || "-"}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuestionCard({
  question,
  selectedChoice,
  revealed,
  onSelect,
  onToggleReveal,
}: {
  question: OfficialExerciseQuestion;
  selectedChoice?: string;
  revealed: boolean;
  onSelect: (choice: string) => void;
  onToggleReveal: () => void;
}) {
  const style = subjectStyles[question.subject];

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${style.badge}`}>
              {question.subject}
            </span>
            <span className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-bold text-gray-600 dark:border-gray-800 dark:text-gray-300">
              {question.lectureId}강 · Q{question.questionNumber}
            </span>
            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-900 dark:text-gray-300">
              {questionKindLabel(question)}
            </span>
            {question.image && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-100">
                <ImageIcon size={13} />
                이미지
              </span>
            )}
          </div>
          <h2 className="text-base font-black leading-6 text-gray-950 dark:text-gray-50">
            {question.lectureTitle}
          </h2>
        </div>

        <button
          type="button"
          onClick={onToggleReveal}
          className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-900"
        >
          {revealed ? <EyeOff size={15} /> : <Eye size={15} />}
          {revealed ? "접기" : "정답"}
        </button>
      </div>

      {question.stimulus && question.stimulus !== "없음." && (
        <div className="mb-3 rounded-lg bg-gray-50 p-3 text-sm leading-6 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
          <RichText text={question.stimulus} emptyLabel="지문 없음" />
        </div>
      )}

      {question.image && (
        <figure className="mb-4 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
          <div className="relative h-[280px] bg-white sm:h-[360px] lg:h-[420px]">
            <NextImage
              src={question.image.src}
              alt={question.image.alt}
              fill
              sizes="(min-width: 1024px) 56vw, 92vw"
              className="object-contain"
            />
          </div>
          <figcaption className="border-t border-gray-200 px-3 py-2 text-xs leading-5 text-gray-500 dark:border-gray-800 dark:text-gray-300">
            {question.image.alt}
          </figcaption>
        </figure>
      )}

      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-950 dark:text-gray-50">
          <FileQuestion size={16} />
          문제
        </div>
        <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800 dark:text-gray-200">
          {question.prompt}
        </p>
      </div>

      {question.kind === "multiple" ? (
        <div className="grid gap-2 md:grid-cols-2">
          {question.choices.map((choice) => {
            const isCorrect = revealed && choice.key === question.correctChoice;
            const isWrongSelection =
              revealed && selectedChoice === choice.key && choice.key !== question.correctChoice;
            const isSelected = selectedChoice === choice.key;

            return (
              <button
                key={`${question.id}-${choice.key}`}
                type="button"
                onClick={() => onSelect(choice.key)}
                className={`min-h-12 rounded-lg border px-3 py-2 text-left text-sm leading-6 transition-colors focus:outline-none focus:ring-2 ${style.ring} ${
                  isCorrect
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
                    : isWrongSelection
                      ? "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100"
                      : isSelected
                        ? "border-blue-400 bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-100"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900"
                }`}
              >
                <span className="mr-2 font-mono font-black">{choice.key}.</span>
                {choice.text}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
          서술형 문항입니다. 먼저 직접 작성한 뒤 정답 예시를 확인합니다.
        </div>
      )}

      {revealed && (
        <div className="mt-4 grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
            <div className="mb-2 flex items-center gap-2 text-sm font-black text-emerald-900 dark:text-emerald-100">
              <CheckCircle2 size={16} />
              정답
            </div>
            <RichText text={question.answer} emptyLabel="정답 정보 없음" />
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-2 text-sm font-black text-gray-950 dark:text-gray-50">
              해설
            </div>
            <RichText
              text={question.explanation}
              emptyLabel="공식 해설이 별도로 제공되지 않은 문항입니다."
            />
          </div>
        </div>
      )}
    </article>
  );
}

function RichText({ text, emptyLabel }: { text: string; emptyLabel: string }) {
  const normalized = text.trim();
  if (!normalized || normalized === "-") {
    return <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">{emptyLabel}</p>;
  }

  const parts: Array<{ type: "text" | "code"; language?: string; value: string }> = [];
  const codeRegex = /```([\w-]*)\n([\s\S]*?)```/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = codeRegex.exec(normalized))) {
    if (match.index > cursor) {
      parts.push({ type: "text", value: normalized.slice(cursor, match.index) });
    }
    parts.push({ type: "code", language: match[1], value: match[2].trimEnd() });
    cursor = match.index + match[0].length;
  }

  if (cursor < normalized.length) {
    parts.push({ type: "text", value: normalized.slice(cursor) });
  }

  return (
    <div className="space-y-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
      {parts.map((part, index) => {
        if (part.type === "code") {
          return (
            <pre
              key={`${part.type}-${index}`}
              className="overflow-x-auto rounded-lg bg-gray-950 p-3 text-xs leading-5 text-gray-50"
            >
              <code>{part.value}</code>
            </pre>
          );
        }

        return part.value.split(/\n{2,}/).map((paragraph, paragraphIndex) => (
          <p
            key={`${part.type}-${index}-${paragraphIndex}`}
            className="whitespace-pre-wrap"
          >
            {paragraph.trim()}
          </p>
        ));
      })}
    </div>
  );
}
