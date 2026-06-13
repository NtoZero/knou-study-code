"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, ChevronRight, UserRound } from "lucide-react";

const courseMap: Record<string, string> = {
  network: "정보통신망",
  ai: "인공지능",
  java: "Java프로그래밍",
  algorithm: "알고리즘",
  security: "컴퓨터보안",
  software: "소프트웨어공학",
  "official-exercises": "공식 연습문제",
  "my-page": "마이페이지",
};

export default function SiteHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const courseKey = segments[0];
  const courseName = courseKey ? courseMap[courseKey] : null;
  const isHome = pathname === "/";
  const showBreadcrumb = Boolean(courseName && courseKey !== "my-page");

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-12 max-w-7xl items-center gap-2 px-4">
        <Link
          href="/"
          className={`flex items-center gap-2 text-sm font-semibold transition-colors hover:text-blue-600 ${
            isHome
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <GraduationCap size={20} />
          <span className="hidden sm:inline">KNOU 인터랙티브</span>
        </Link>

        {showBreadcrumb && (
          <>
            <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />
            <Link
              href={`/${courseKey}`}
              className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors"
            >
              {courseName}
            </Link>
          </>
        )}

        <Link
          href="/my-page"
          className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-900"
        >
          <UserRound size={16} />
          <span className="hidden sm:inline">마이페이지</span>
        </Link>
      </div>
    </header>
  );
}
