"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Brain, ChevronRight, FileQuestion, BookOpenCheck } from "lucide-react";
import { aiLectures } from "@/lib/constants";

export default function AINavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-16 left-4 z-50 rounded-lg bg-white p-2 shadow-md dark:bg-gray-800 lg:hidden"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-12 left-0 z-40 h-[calc(100%-3rem)] w-64 transform border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-900 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link
          href="/ai"
          className="flex items-center gap-2 border-b border-gray-200 px-5 py-5 dark:border-gray-800"
          onClick={() => setOpen(false)}
        >
          <Brain size={22} className="text-indigo-500" />
          <span className="text-lg font-bold">인공지능</span>
        </Link>

        <nav className="p-3">
          <Link
            href="/ai/past-exam"
            onClick={() => setOpen(false)}
            className={`mb-3 flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
              pathname === "/ai/past-exam"
                ? "bg-indigo-50 font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-900 text-white dark:bg-white dark:text-gray-900">
              <FileQuestion size={15} />
            </span>
            <div className="min-w-0">
              <div className="truncate font-medium">기출분석</div>
              <div className="truncate text-xs text-gray-400">2017-2019 기말</div>
            </div>
            {pathname === "/ai/past-exam" && (
              <ChevronRight size={14} className="ml-auto shrink-0" />
            )}
          </Link>

          <Link
            href="/ai/frequent-concepts"
            onClick={() => setOpen(false)}
            className={`mb-3 flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
              pathname === "/ai/frequent-concepts"
                ? "bg-indigo-50 font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-white">
              <BookOpenCheck size={15} />
            </span>
            <div className="min-w-0">
              <div className="truncate font-medium">빈출개념</div>
              <div className="truncate text-xs text-gray-400">강의별 기출 커버리지</div>
            </div>
            {pathname === "/ai/frequent-concepts" && (
              <ChevronRight size={14} className="ml-auto shrink-0" />
            )}
          </Link>

          {aiLectures.map((lec) => {
            const active = pathname === `/ai/lecture/${lec.id}`;
            return (
              <Link
                key={lec.id}
                href={`/ai/lecture/${lec.id}`}
                onClick={() => setOpen(false)}
                className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                  active
                    ? `${lec.bgLightClass} ${lec.textClass} font-semibold`
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white ${lec.bgClass}`}
                >
                  {lec.id}
                </span>
                <div className="min-w-0">
                  <div className="truncate font-medium">{lec.title}</div>
                  <div className="truncate text-xs text-gray-400">
                    {lec.subtitle}
                  </div>
                </div>
                {active && (
                  <ChevronRight size={14} className="ml-auto shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
