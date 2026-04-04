import Link from "next/link";
import { BookOpen, Brain, Code2 } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-center text-3xl font-bold mb-2">
        KNOU 인터랙티브 학습
      </h1>
      <p className="text-center text-gray-500 mb-12">과목을 선택하세요</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/network"
          className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          <BookOpen size={36} className="text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold">정보통신망</h2>
          <p className="mt-2 text-sm text-gray-500">
            1~5강 인터랙티브 시각화
          </p>
        </Link>
        <Link
          href="/ai"
          className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          <Brain size={36} className="text-indigo-500 mb-4" />
          <h2 className="text-xl font-semibold">인공지능</h2>
          <p className="mt-2 text-sm text-gray-500">
            1~5강 인터랙티브 학습
          </p>
        </Link>
        <Link
          href="/algorithm"
          className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          <Code2 size={36} className="text-emerald-500 mb-4" />
          <h2 className="text-xl font-semibold">알고리즘</h2>
          <p className="mt-2 text-sm text-gray-500">
            정렬, 탐색, 그래프 알고리즘 시각화
          </p>
        </Link>
      </div>
    </div>
  );
}
