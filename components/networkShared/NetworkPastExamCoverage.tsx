import Link from "next/link";
import { BookOpenCheck, CheckCircle2, FileText, ListChecks } from "lucide-react";
import { lectures } from "@/lib/constants";
import { networkCoverageNotes, networkFrequentConcepts } from "./examData";

export default function NetworkPastExamCoverage({ lectureId }: { lectureId: number }) {
  const lecture = lectures.find((item) => item.id === lectureId);
  const notes = networkCoverageNotes[lectureId] ?? [];
  const concepts = networkFrequentConcepts.filter((concept) =>
    concept.lectureIds.includes(lectureId),
  );

  if (notes.length === 0 && concepts.length === 0) return null;

  return (
    <section className="rounded-xl border border-blue-200 bg-blue-50/70 p-5 dark:border-blue-900 dark:bg-blue-950/20">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-3 py-1 text-xs font-bold text-white">
            <BookOpenCheck size={14} />
            기출형 개념 범위
          </div>
          <h2 className="text-xl font-bold text-gray-950 dark:text-gray-50">
            {lectureId}강에서 먼저 확인할 출제형 개념
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
            2015~2019학년도 기말 기출에서 반복된 개념축을 강의 내용과 연결했습니다.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-3">
          <Stat value={concepts.length} label="개념축" />
          <Stat value={notes.length} label="점검 포인트" />
          <Stat value={Math.max(0, ...concepts.map((item) => item.frequency))} label="최대 반복도" />
        </div>
      </div>

      <div className="mb-5 grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-blue-200 bg-white p-4 dark:border-blue-900 dark:bg-gray-950">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
            <ListChecks size={16} />
            연결 강의
          </div>
          <Link
            href={`/network/lecture/${lectureId}`}
            className="inline-flex rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-100"
          >
            {lectureId}강 {lecture?.title}
          </Link>
        </div>

        <div className="rounded-lg border border-blue-200 bg-white p-4 dark:border-blue-900 dark:bg-gray-950">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
            <FileText size={16} />
            빈출 개념
          </div>
          <div className="flex flex-wrap gap-2">
            {concepts.map((concept) => (
              <Link
                key={concept.id}
                href={`/network/frequent-concepts?concept=${concept.id}`}
                className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 transition-colors hover:border-blue-300 hover:text-blue-700 dark:border-gray-800 dark:text-gray-300 dark:hover:text-blue-200"
              >
                {concept.label} {concept.frequency}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <article
            key={note.concept}
            className="rounded-lg border border-blue-200 bg-white p-4 dark:border-blue-900 dark:bg-gray-950"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-blue-700 px-2.5 py-1 text-xs font-bold text-white">
                {lecture?.title ?? `${lectureId}강`}
              </span>
              <h3 className="text-base font-bold text-gray-950 dark:text-gray-50">
                {note.concept}
              </h3>
              {note.tags.map((tag) => (
                <span
                  key={`${note.concept}-${tag}`}
                  className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-900 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              <Detail title="강의 근거">{note.source}</Detail>
              <Detail title="출제형 요구">{note.examNeed}</Detail>
              <div>
                <div className="mb-1 flex items-center gap-1 text-xs font-bold uppercase text-blue-700 dark:text-blue-200">
                  <CheckCircle2 size={13} />
                  점검 내용
                </div>
                <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                  {note.reinforcement}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg border border-blue-200 bg-white px-3 py-2 dark:border-blue-900 dark:bg-gray-950">
      <div className="font-mono text-lg font-bold text-blue-800 dark:text-blue-100">{value}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  );
}

function Detail({ title, children }: { title: string; children: string }) {
  return (
    <div>
      <div className="mb-1 text-xs font-bold uppercase text-blue-700 dark:text-blue-200">
        {title}
      </div>
      <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">{children}</p>
    </div>
  );
}
