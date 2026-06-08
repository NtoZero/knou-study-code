import Link from "next/link";
import { BookOpenCheck, CheckCircle2, FileText, ListChecks } from "lucide-react";
import { aiLectures } from "@/lib/constants";
import { aiPastExamQuestions } from "./data";

function formatQuestion(question: (typeof aiPastExamQuestions)[number]) {
  return `${question.year}-${question.number}`;
}

export default function AIPastExamCoverage({ lectureId }: { lectureId: number }) {
  const lecture = aiLectures.find((item) => item.id === lectureId);
  const questions = aiPastExamQuestions.filter((question) =>
    question.lectureRefs.some((ref) => ref.lectureId === lectureId)
  );

  if (questions.length === 0) return null;

  const conceptCounts = Array.from(
    questions.reduce<Map<string, number>>((acc, question) => {
      const concept = question.lectureRefs.find((ref) => ref.lectureId === lectureId)?.concept;
      if (concept) acc.set(concept, (acc.get(concept) ?? 0) + 1);
      return acc;
    }, new Map())
  ).sort((a, b) => b[1] - a[1]);

  const representative = conceptCounts.slice(0, 3).map(([concept]) => {
    const question = questions.find((item) =>
      item.lectureRefs.some((ref) => ref.lectureId === lectureId && ref.concept === concept)
    );
    return {
      concept,
      basis: question?.basis ?? "",
      wrongRule: question?.wrongRule ?? "",
      examSkill: question?.examSkill ?? "",
      source: question?.sourceBasis[0]?.internalTextbookSource ?? `${lectureId}강 교재`,
    };
  });

  return (
    <section className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-5 dark:border-indigo-900 dark:bg-indigo-950/20">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold text-white">
            <BookOpenCheck size={14} />
            기출 개념 커버리지
          </div>
          <h2 className="text-xl font-bold text-gray-950 dark:text-gray-50">
            {lectureId}강 기본 개념이 설명해야 하는 기출 범위
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
            2017~2019 인공지능 기출에서 이 강의와 연결된 문항을 기준으로 출제 개념, 근거, 오답 기준을 확인합니다.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg border border-indigo-200 bg-white px-3 py-2 dark:border-indigo-900 dark:bg-gray-950">
            <div className="font-mono text-lg font-bold text-indigo-700 dark:text-indigo-200">
              {questions.length}
            </div>
            <div className="text-gray-500">문항</div>
          </div>
          <div className="rounded-lg border border-indigo-200 bg-white px-3 py-2 dark:border-indigo-900 dark:bg-gray-950">
            <div className="font-mono text-lg font-bold text-indigo-700 dark:text-indigo-200">
              {conceptCounts.length}
            </div>
            <div className="text-gray-500">개념축</div>
          </div>
          <div className="rounded-lg border border-indigo-200 bg-white px-3 py-2 dark:border-indigo-900 dark:bg-gray-950">
            <div className="font-mono text-lg font-bold text-indigo-700 dark:text-indigo-200">
              {representative.length}
            </div>
            <div className="text-gray-500">대표 근거</div>
          </div>
        </div>
      </div>

      <div className="mb-5 grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-indigo-200 bg-white p-4 dark:border-indigo-900 dark:bg-gray-950">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
            <ListChecks size={16} />
            연결 문항
          </div>
          <div className="flex flex-wrap gap-2">
            {questions.map((question) => (
              <Link
                key={question.id}
                href="/ai/past-exam"
                className="rounded-lg bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-200 dark:bg-indigo-950 dark:text-indigo-100 dark:hover:bg-indigo-900"
              >
                {formatQuestion(question)}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-indigo-200 bg-white p-4 dark:border-indigo-900 dark:bg-gray-950">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
            <FileText size={16} />
            개념별 출제량
          </div>
          <div className="flex flex-wrap gap-2">
            {conceptCounts.map(([concept, count]) => (
              <span
                key={concept}
                className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:border-gray-800 dark:text-gray-300"
              >
                {concept} {count}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {representative.map((item) => (
          <article
            key={item.concept}
            className="rounded-lg border border-indigo-200 bg-white p-4 dark:border-indigo-900 dark:bg-gray-950"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white">
                {lecture?.title ?? `${lectureId}강`}
              </span>
              <h3 className="text-base font-bold text-gray-950 dark:text-gray-50">
                {item.concept}
              </h3>
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              <div>
                <div className="mb-1 text-xs font-bold uppercase text-indigo-700 dark:text-indigo-200">
                  강의·교재 근거
                </div>
                <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                  {item.source}: {item.basis}
                </p>
              </div>
              <div>
                <div className="mb-1 text-xs font-bold uppercase text-indigo-700 dark:text-indigo-200">
                  기출 요구
                </div>
                <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                  {item.examSkill}
                </p>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-1 text-xs font-bold uppercase text-indigo-700 dark:text-indigo-200">
                  <CheckCircle2 size={13} />
                  오답 기준
                </div>
                <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                  {item.wrongRule}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
