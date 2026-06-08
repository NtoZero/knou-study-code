"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenCheck, ChevronRight, Flame, Layers, Menu, X } from "lucide-react";
import { softwareLectures } from "@/lib/constants";

export default function SoftwareNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-16 z-50 rounded-lg bg-white p-2 shadow-md dark:bg-gray-800 lg:hidden"
        aria-label="소프트웨어공학 내비게이션 열기"
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
        className={`fixed left-0 top-12 z-40 h-[calc(100%-3rem)] w-64 transform border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-900 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link
          href="/software"
          className="flex items-center gap-2 border-b border-gray-200 px-5 py-5 dark:border-gray-800"
          onClick={() => setOpen(false)}
        >
          <Layers size={22} className="text-emerald-600" />
          <span className="text-lg font-bold">소프트웨어공학</span>
        </Link>

        <nav className="p-3">
          <Link
            href="/software/past-exam"
            onClick={() => setOpen(false)}
            className={`mb-3 flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
              pathname === "/software/past-exam"
                ? "bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-100"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white">
              <BookOpenCheck size={15} />
            </span>
            <div className="min-w-0">
              <div className="truncate font-medium">기출분석</div>
              <div className="truncate text-xs text-gray-400">2017-2019 105문항</div>
            </div>
            {pathname === "/software/past-exam" && <ChevronRight size={14} className="ml-auto shrink-0" />}
          </Link>

          <Link
            href="/software/frequent-concepts"
            onClick={() => setOpen(false)}
            className={`mb-3 flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
              pathname === "/software/frequent-concepts"
                ? "bg-amber-50 font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-100"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-600 text-white">
              <Flame size={15} />
            </span>
            <div className="min-w-0">
              <div className="truncate font-medium">빈출 개념</div>
              <div className="truncate text-xs text-gray-400">기출 refs 연결</div>
            </div>
            {pathname === "/software/frequent-concepts" && <ChevronRight size={14} className="ml-auto shrink-0" />}
          </Link>

          {softwareLectures.map((lecture) => {
            const active = pathname === `/software/lecture/${lecture.id}`;
            return (
              <Link
                key={lecture.id}
                href={`/software/lecture/${lecture.id}`}
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
