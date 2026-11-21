import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

/** 강의 화면에서 초심자용 단계 학습으로 이어지는 진입점 */
export default function DL8GuideLink() {
  return (
    <Link
      href="/dl/lecture/8/easy"
      className="group flex items-center gap-3 rounded-xl border border-teal-200 bg-teal-50/80 p-4 transition-colors hover:bg-teal-100 dark:border-teal-900 dark:bg-teal-950/35 dark:hover:bg-teal-950/60"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white">
        <Sparkles size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-teal-900 dark:text-teal-100">
          처음 배우는 분을 위한 쉬운 설명
        </span>
        <span className="mt-0.5 block text-xs leading-5 text-teal-800/80 dark:text-teal-200/80">
          사진 한 장에서 3×3 필터 세 번까지, 예제를 직접 따라가요.
        </span>
      </span>
      <ArrowRight size={16} className="shrink-0 text-teal-700 transition-transform group-hover:translate-x-1 dark:text-teal-300" />
    </Link>
  );
}
