"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkle, ChevronRight, Layers } from "lucide-react";
import { dlLectures } from "@/lib/constants";


export default function DLNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "강의 목록 닫기" : "강의 목록 열기"}
        className="fixed top-16 left-4 z-50 rounded-lg bg-white p-2 shadow-md dark:bg-gray-800 lg:hidden"
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
        className={`fixed left-0 top-12 z-40 h-[calc(100%-3rem)] w-64 transform overflow-y-auto overscroll-contain border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-900 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link
          href="/dl"
          className="flex items-center gap-2 border-b border-gray-200 px-5 py-5 dark:border-gray-800"
          onClick={() => setOpen(false)}
        >
          <Sparkle size={22} className="text-cyan-500" />
          <span>
            <span className="block text-lg font-bold leading-tight">딥러닝</span>
            <span className="block text-[11px] text-gray-400">2026-2학기</span>
          </span>
        </Link>

        <nav className="p-3">
          <Link
            href="/ml/prerequisites"
            onClick={() => setOpen(false)}
            className={`mb-3 flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
              pathname === "/ml/prerequisites"
                ? "bg-amber-50 font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-100"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-500 text-white">
              <Layers size={15} />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium">선행 개념 다지기</span>
              <span className="block truncate text-xs text-gray-400">
                벡터·행렬 · 확률·통계 · 미분
              </span>
            </span>
            {pathname === "/ml/prerequisites" && (
              <ChevronRight size={14} className="ml-auto shrink-0" />
            )}
          </Link>

          {dlLectures.map((lec) => {
            const active = pathname === `/dl/lecture/${lec.id}`;
            return (
              <div key={lec.id}>
                <Link
                  href={`/dl/lecture/${lec.id}`}
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
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{lec.title}</span>
                    <span className="block truncate text-xs text-gray-400">
                      {lec.subtitle}
                    </span>
                  </span>
                  {active && <ChevronRight size={14} className="ml-auto shrink-0" />}
                </Link>
                {(lec.id === 8 || lec.id === 9) && (
                  <Link href={`/dl/lecture/${lec.id}/easy`} onClick={() => setOpen(false)}
                    aria-current={pathname === `/dl/lecture/${lec.id}/easy` ? "page" : undefined}
                    className="ml-12 mb-2 block rounded px-2 py-1 text-xs font-medium text-teal-700 hover:underline aria-[current=page]:bg-teal-100 dark:text-teal-300 dark:aria-[current=page]:bg-teal-950">
                    {lec.id}강 쉬운 설명
                  </Link>
                )}
              </div>
            );
          })}

        </nav>
      </aside>
    </>
  );
}
