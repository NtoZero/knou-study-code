"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, BookOpenCheck, ChevronRight, FileText, Menu, X } from "lucide-react";
import { algorithmLectures } from "@/lib/algorithmCourse";

export default function AlgorithmNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-16 z-50 rounded-lg bg-white p-2 shadow-md dark:bg-gray-800 lg:hidden"
        aria-label="알고리즘 내비게이션 열기"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-12 z-40 h-[calc(100%-3rem)] w-64 transform overflow-y-auto border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-900 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link
          href="/algorithm"
          className="flex items-center gap-2 border-b border-gray-200 px-5 py-5 dark:border-gray-800"
          onClick={() => setOpen(false)}
        >
          <BookOpen size={22} className="text-emerald-500" />
          <span className="text-lg font-bold">알고리즘</span>
        </Link>

        <nav className="p-3">
          <Link
            href="/algorithm/summary"
            onClick={() => setOpen(false)}
            className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
              pathname === "/algorithm/summary"
                ? "bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <FileText size={18} />
            <span>기말분석</span>
          </Link>

          <Link
            href="/algorithm/visualizer"
            onClick={() => setOpen(false)}
            className={`mb-3 flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
              pathname === "/algorithm/visualizer"
                ? "bg-slate-100 font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <BarChart3 size={18} />
            <span>알고리즘 시각화</span>
          </Link>

          <Link
            href="/algorithm/past-exam"
            onClick={() => setOpen(false)}
            className={`mb-3 flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
              pathname === "/algorithm/past-exam"
                ? "bg-cyan-50 font-semibold text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-200"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <BookOpenCheck size={18} />
            <div>
              <div>기출분석</div>
              <div className="text-xs opacity-70">2017-2019 기말</div>
            </div>
          </Link>

          {algorithmLectures.map((lecture) => {
            const active = pathname === `/algorithm/lecture/${lecture.id}`;
            return (
              <Link
                key={lecture.id}
                href={`/algorithm/lecture/${lecture.id}`}
                onClick={() => setOpen(false)}
                className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                  active
                    ? `${lecture.bgLightClass} ${lecture.textClass} font-semibold`
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white ${lecture.bgClass}`}
                >
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
