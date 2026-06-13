"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenCheck, ChevronRight, Code2, Flame, Menu, X } from "lucide-react";
import { javaLectures } from "@/lib/constants";

export default function JavaNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-16 z-50 rounded-lg bg-white p-2 shadow-md dark:bg-gray-800 lg:hidden"
        aria-label="Java프로그래밍 내비게이션 열기"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <button
          type="button"
          aria-label="내비게이션 닫기"
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-12 z-40 h-[calc(100%-3rem)] w-64 transform overflow-y-auto overscroll-contain border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-900 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link
          href="/java"
          className="flex items-center gap-2 border-b border-gray-200 px-5 py-5 dark:border-gray-800"
          onClick={() => setOpen(false)}
        >
          <Code2 size={22} className="text-amber-600" />
          <span className="text-lg font-bold">Java프로그래밍</span>
        </Link>

        <nav className="p-3">
          <Link
            href="/java/past-exam"
            onClick={() => setOpen(false)}
            className={`mb-2 flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
              pathname === "/java/past-exam"
                ? "bg-emerald-50 font-semibold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white">
              <BookOpenCheck size={15} />
            </span>
            <div className="min-w-0">
              <div className="truncate font-medium">기출분석</div>
              <div className="truncate text-xs text-gray-400">2017-2019 75문항</div>
            </div>
            {pathname === "/java/past-exam" && <ChevronRight size={14} className="ml-auto shrink-0" />}
          </Link>

          <Link
            href="/java/frequent-concepts"
            onClick={() => setOpen(false)}
            className={`mb-2 flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
              pathname === "/java/frequent-concepts"
                ? "bg-amber-50 font-semibold text-amber-900 dark:bg-amber-950/30 dark:text-amber-100"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-600 text-white">
              <Flame size={15} />
            </span>
            <div className="min-w-0">
              <div className="truncate font-medium">빈출 개념</div>
              <div className="truncate text-xs text-gray-400">기출 ref 미리보기</div>
            </div>
            {pathname === "/java/frequent-concepts" && <ChevronRight size={14} className="ml-auto shrink-0" />}
          </Link>

          <Link
            href="/official-exercises"
            onClick={() => setOpen(false)}
            className={`mb-3 flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
              pathname === "/official-exercises"
                ? "bg-amber-50 font-semibold text-amber-900 dark:bg-amber-950/30 dark:text-amber-100"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-600 text-white">
              <BookOpenCheck size={15} />
            </span>
            <div className="min-w-0">
              <div className="truncate font-medium">공식 연습문제</div>
              <div className="truncate text-xs text-gray-400">Java 45문항 포함</div>
            </div>
          </Link>

          {javaLectures.map((lecture) => {
            const active = pathname === `/java/lecture/${lecture.id}`;
            return (
              <Link
                key={lecture.id}
                href={`/java/lecture/${lecture.id}`}
                onClick={() => setOpen(false)}
                className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                  active
                    ? `${lecture.bgLightClass} ${lecture.textClass} font-semibold`
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white ${lecture.bgClass}`}>
                  {lecture.id}
                </span>
                <div className="min-w-0">
                  <div className="truncate font-medium">{lecture.title}</div>
                  <div className="truncate text-xs text-gray-400">{lecture.subtitle}</div>
                </div>
                {active && <ChevronRight size={14} className="ml-auto shrink-0" />}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
