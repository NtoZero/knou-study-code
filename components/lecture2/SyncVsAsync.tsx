"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";

export default function SyncVsAsync() {
  const [mode, setMode] = useState<"sync" | "async">("async");

  return (
    <section>
      <SectionTitle
        title="동기식 vs 비동기식 전송"
        subtitle="데이터 블록 전송의 두 가지 방식"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setMode("async")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              mode === "async" ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            비동기식 전송
          </button>
          <button
            onClick={() => setMode("sync")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              mode === "sync" ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            동기식 전송
          </button>
        </div>

        {/* Frame structure visualization */}
        <div className="overflow-x-auto">
          {mode === "async" ? (
            <div>
              <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                비동기식 프레임 구조 (문자 단위)
              </div>
              <div className="flex items-center gap-0.5 text-xs">
                {[
                  { label: "유휴", bg: "bg-gray-200 dark:bg-gray-700", w: "w-8" },
                  { label: "시작\n비트", bg: "bg-red-400", w: "w-10" },
                  { label: "D0", bg: "bg-blue-300", w: "w-8" },
                  { label: "D1", bg: "bg-blue-300", w: "w-8" },
                  { label: "D2", bg: "bg-blue-300", w: "w-8" },
                  { label: "D3", bg: "bg-blue-300", w: "w-8" },
                  { label: "D4", bg: "bg-blue-300", w: "w-8" },
                  { label: "D5", bg: "bg-blue-300", w: "w-8" },
                  { label: "D6", bg: "bg-blue-300", w: "w-8" },
                  { label: "D7", bg: "bg-blue-300", w: "w-8" },
                  { label: "패리티", bg: "bg-amber-400", w: "w-10" },
                  { label: "정지\n비트", bg: "bg-green-400", w: "w-10" },
                  { label: "유휴", bg: "bg-gray-200 dark:bg-gray-700", w: "w-8" },
                ].map((cell, i) => (
                  <div
                    key={i}
                    className={`${cell.bg} ${cell.w} flex h-14 items-center justify-center rounded px-1 text-center leading-tight`}
                  >
                    {cell.label}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>문자(character) 단위로 동기를 맞추는 방법. 각 문자 앞에 <strong>시작 비트</strong>(0), 뒤에 <strong>정지 비트</strong>(1)를 부가.</p>
                <p className="mt-1">전송 효율: 8비트 데이터 기준 8/(1+8+1+1) = <strong>약 72.7%</strong></p>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                동기식 프레임 구조 (블록 단위)
              </div>
              <div className="flex items-center gap-0.5 text-xs">
                {[
                  { label: "SYN", bg: "bg-red-400", w: "w-10" },
                  { label: "SYN", bg: "bg-red-400", w: "w-10" },
                  { label: "SOH", bg: "bg-amber-400", w: "w-10" },
                  { label: "헤더", bg: "bg-amber-300", w: "w-16" },
                  { label: "STX", bg: "bg-amber-400", w: "w-10" },
                  { label: "데이터 블록", bg: "bg-blue-300", w: "w-32" },
                  { label: "ETX", bg: "bg-green-400", w: "w-10" },
                  { label: "BCC", bg: "bg-purple-400", w: "w-10" },
                ].map((cell, i) => (
                  <div
                    key={i}
                    className={`${cell.bg} ${cell.w} flex h-14 items-center justify-center rounded px-1 text-center`}
                  >
                    {cell.label}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>블록(block) 단위로 전송. <strong>SYN 문자</strong>로 동기를 맞추고 연속적으로 데이터를 전송.</p>
                <p className="mt-1">
                  비동기식보다 <strong>전송 효율이 높음</strong>. 예: 200문자 전송 시, 동기식 = (200×8)/(2×8+200×8) ≈ <strong>99%</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
