import Link from "next/link";
import { GraduationCap, ChevronRight } from "lucide-react";

export default function StudyHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 via-white to-pink-50 dark:border-gray-800 dark:from-orange-950/30 dark:via-gray-950 dark:to-pink-950/30">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-200">
              KNOU 인터랙티브
            </Link>
            <ChevronRight size={12} />
            <Link
              href="/study-hub"
              className="flex items-center gap-1 font-semibold text-orange-600 hover:text-orange-700"
            >
              <GraduationCap size={14} />
              기초학습 본지
            </Link>
          </div>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}
