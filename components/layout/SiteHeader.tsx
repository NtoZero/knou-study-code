"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, ChevronRight } from "lucide-react";

const courseMap: Record<string, string> = {
  network: "정보통신망",
  algorithm: "알고리즘",
  "official-exercises": "공식 연습문제",
};

export default function SiteHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const courseKey = segments[0];
  const courseName = courseKey ? courseMap[courseKey] : null;
  const isHome = pathname === "/";

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

        {courseName && (
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
      </div>
    </header>
  );
}
