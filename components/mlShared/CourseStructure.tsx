"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookMarked, ChevronDown, CircleDot } from "lucide-react";

/** 강의록 1강 교재 및 강의 구성 */
const chapters = [
  { ch: "1장", title: "머신러닝 소개", lectures: [1] },
  { ch: "2장", title: "데이터 표현: 벡터와 행렬", lectures: [], selfStudy: true },
  { ch: "3장", title: "데이터 분포: 확률과 통계", lectures: [], selfStudy: true },
  { ch: "4장", title: "지도학습: 분류", lectures: [2] },
  { ch: "5장", title: "지도학습: 회귀", lectures: [3] },
  { ch: "6장", title: "비지도학습: 군집화", lectures: [4] },
  { ch: "7장", title: "데이터 표현: 특징추출", lectures: [5] },
  { ch: "8장", title: "앙상블 학습", lectures: [6] },
  { ch: "9장", title: "결정 트리와 랜덤 포레스트", lectures: [7] },
  { ch: "10장", title: "SVM과 커널법", lectures: [8] },
  { ch: "11장", title: "신경망", lectures: [9, 10] },
  { ch: "12장", title: "딥러닝", lectures: [11, 12] },
  { ch: "13장", title: "딥러닝 응용", lectures: [13, 14] },
  { ch: "14장", title: "강화학습", lectures: [15] },
] as const;

const READY = new Set([1, 2, 3, 4]);

export default function CourseStructure() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-10 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-5 text-left"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300">
          <BookMarked size={17} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold">교재 및 강의 구성</span>
          <span className="block text-xs text-gray-500">
            교재 14개 장이 15차시 강의에 어떻게 대응되는지 · 2장과 3장은 자율 학습
          </span>
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 px-5 pb-5 pt-4 dark:border-gray-800">
              <div className="mb-3 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                수학적 배경이 부족하다면 자율 학습 범위인 2장 벡터와 행렬, 3장 확률과 통계,
                그리고 편미분을 먼저 익혀 두면 이후 강의 이해에 도움이 됩니다.
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-400 dark:border-gray-700">
                      <th className="py-2 pr-3 font-semibold">교재</th>
                      <th className="py-2 pr-3 font-semibold">내용</th>
                      <th className="py-2 font-semibold">강의 차시</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chapters.map((row) => (
                      <tr
                        key={row.ch}
                        className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                      >
                        <td className="py-2 pr-3 font-semibold text-gray-700 dark:text-gray-200">
                          {row.ch}
                        </td>
                        <td className="py-2 pr-3 text-gray-600 dark:text-gray-300">
                          {row.title}
                        </td>
                        <td className="py-2">
                          {"selfStudy" in row && row.selfStudy ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                              <CircleDot size={9} />
                              자율 학습
                            </span>
                          ) : (
                            <span className="flex flex-wrap gap-1">
                              {row.lectures.map((n) => (
                                <span
                                  key={n}
                                  className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded px-1 text-[11px] font-bold ${
                                    READY.has(n)
                                      ? "bg-cyan-500 text-white"
                                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                  }`}
                                >
                                  {n}
                                </span>
                              ))}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-400">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-cyan-500" />
                채워진 차시는 이 사이트에서 학습할 수 있는 강의입니다.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
