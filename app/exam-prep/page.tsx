import type { Metadata } from "next";
import Link from "next/link";
import WorkbookEntry from "@/components/examPrep/WorkbookEntry";
import { semesters } from "@/lib/semesters";

export const metadata: Metadata = {
  title: "시험 대비 · KNOU 인터랙티브 학습",
  description: "머신러닝·딥러닝 개념 이어 읽기, 공식 연습문제와 워크북 풀이, 과목별 기출 풀이",
};

export default function ExamPrepPage() {
  const pastExams = semesters.flatMap((semester) => semester.subjects).filter((subject) => subject.pastExamHref);
  return (
    <main className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">시험 대비</h1>
      <section className="mt-9" aria-labelledby="workbook-heading">
        <h2 id="workbook-heading" className="text-xl font-semibold">2026학년도 2학기 기말</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">개념을 강의 순서대로 읽거나, 이번에 풀 문제의 순서를 직접 고르세요.</p>
        <div className="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2">
          <WorkbookEntry course="ml" />
          <WorkbookEntry course="dl" />
        </div>
      </section>
      <section className="mt-10 border-t border-gray-300 pt-6 dark:border-gray-700" aria-labelledby="past-heading">
        <h2 id="past-heading" className="text-xl font-semibold">과목별 기출 풀이</h2>
        <ul className="mt-3 grid gap-x-8 sm:grid-cols-2">
          {pastExams.map((subject) => (
            <li key={subject.slug} className="border-b border-gray-200 dark:border-gray-800">
              <Link className="block py-3 text-sm font-semibold hover:underline" href={subject.pastExamHref!}>{subject.title}</Link>
            </li>
          ))}
        </ul>
        <Link href="/official-exercises" className="mt-6 inline-flex py-2 text-sm font-medium underline underline-offset-4">
          2026학년도 1학기 공식 연습문제
        </Link>
      </section>
    </main>
  );
}
