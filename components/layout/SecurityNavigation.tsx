"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Shield, ChevronRight, BookOpenCheck, Flame } from "lucide-react";
import { securityLectures } from "@/lib/constants";

export default function SecurityNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
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
          href="/security"
          className="flex items-center gap-2 border-b border-gray-200 px-5 py-5 dark:border-gray-800"
          onClick={() => setOpen(false)}
        >
          <Shield size={22} className="text-purple-600" />
          <span className="text-lg font-bold">컴퓨터보안</span>
        </Link>

        <nav className="p-3">
          <Link
            href="/security/past-exam"
            onClick={() => setOpen(false)}
            className={`mb-3 flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
              pathname === "/security/past-exam"
                ? "bg-cyan-50 font-semibold text-cyan-700 dark:bg-cyan-950 dark:text-cyan-100"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-cyan-600 text-white">
              <BookOpenCheck size={15} />
            </span>
            <div className="min-w-0">
              <div className="truncate font-medium">기출분석</div>
              <div className="truncate text-xs text-gray-400">2015-2019 125문항</div>
            </div>
            {pathname === "/security/past-exam" && (
              <ChevronRight size={14} className="ml-auto shrink-0" />
            )}
          </Link>

          <Link
            href="/security/frequent-concepts"
            onClick={() => setOpen(false)}
            className={`mb-3 flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
              pathname === "/security/frequent-concepts"
                ? "bg-rose-50 font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-100"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-rose-600 text-white">
              <Flame size={15} />
            </span>
            <div className="min-w-0">
              <div className="truncate font-medium">빈출 개념</div>
              <div className="truncate text-xs text-gray-400">2015-2019 전체</div>
            </div>
            {pathname === "/security/frequent-concepts" && (
              <ChevronRight size={14} className="ml-auto shrink-0" />
            )}
          </Link>

          {securityLectures.map((lec) => {
            const active = pathname === `/security/lecture/${lec.id}`;
            return (
              <Link
                key={lec.id}
                href={`/security/lecture/${lec.id}`}
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
