import Link from "next/link";
import { securityLectures } from "@/lib/constants";
import { ArrowRight, Shield } from "lucide-react";

export default function SecurityHome() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <div className="mb-4 flex justify-center">
          <Shield size={48} className="text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold">컴퓨터보안 인터랙티브 학습</h1>
        <p className="mt-2 text-gray-500">
          KNOU 컴퓨터보안 6~10강 핵심 개념을 시각적으로 학습합니다
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {securityLectures.map((lec) => (
          <Link
            key={lec.id}
            href={`/security/lecture/${lec.id}`}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white ${lec.bgClass}`}
            >
              {lec.id}
            </span>
            <h2 className="mt-4 text-lg font-semibold">{lec.title}</h2>
            <p className="mt-1 text-sm text-gray-500">{lec.subtitle}</p>
            <div
              className={`mt-4 flex items-center gap-1 text-sm font-medium ${lec.textClass}`}
            >
              학습하기
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
