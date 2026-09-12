import Link from "next/link";
import { ChevronRight, Layers } from "lucide-react";
import PrereqPrimer from "@/components/mlShared/PrereqPrimer";

export const metadata = {
  title: "선행 개념 다지기 — 머신러닝",
};

export default function MLPrerequisitesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 max-sm:pl-16">
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/ml" className="hover:text-gray-900 dark:hover:text-gray-200">
          머신러닝
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-amber-600">선행 개념 다지기</span>
      </div>

      <div className="mb-10 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-6 dark:bg-amber-950/30">
        <div className="flex items-center gap-2">
          <Layers size={20} className="text-amber-600" />
          <h1 className="text-2xl font-bold">선행 개념 다지기</h1>
        </div>
        <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-200">
          머신러닝 강의는 벡터와 행렬, 확률과 통계를 이미 안다고 보고 진행합니다. 수식이
          막히는 지점이 생기면 여기서 해당 개념만 찾아 확인한 뒤 강의로 돌아가면 됩니다.
          각 개념마다 <strong>어느 강의 어느 대목에서 쓰이는지</strong>를 함께 적어 두었습니다.
        </p>
      </div>

      <PrereqPrimer />
    </div>
  );
}
