"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

interface Func {
  key: string;
  name: string;
  english: string;
  desc: string;
  note: string;
}

const functions: Func[] = [
  {
    key: "flow",
    name: "흐름제어",
    english: "flow control",
    desc: "송·수신 블록 수, 통신 매체를 조절하는 기능. 지국쌍 단위의 성능 최적화를 담당하며, 혼잡방지·라우팅 등 전 영역에 걸쳐 보조적 역할 수행.",
    note: "송·수신 블록 수·통신 매체의 조절",
  },
  {
    key: "congestion",
    name: "혼잡제어",
    english: "congestion control",
    desc: "통신망 내부의 과부하를 방지하는 기능. 전체 부네트워크를 대상으로 혼잡 방지를 주 목적으로 수행.",
    note: "통신망 내부의 과부하 방지 (체증제어)",
  },
  {
    key: "routing",
    name: "경로선택 (라우팅)",
    english: "routing",
    desc: "출발노드에서 목적노드까지의 경로를 결정하는 기능. 전체 부네트워크 성능향상을 담당하며 혼잡제어에도 기여.",
    note: "출발 → 목적지 경로 결정",
  },
  {
    key: "error",
    name: "오류제어",
    english: "error control",
    desc: "잡음·고장에 대비하여 오류를 검출·정정하는 기능. sliding window, stop-and-wait ARQ 등으로 구현.",
    note: "sliding window, stop-and-wait ARQ",
  },
  {
    key: "access",
    name: "접근제어",
    english: "access control",
    desc: "다중 접근 매체에 대한 접근 권한을 관리하는 기능.",
    note: "다중 접근 매체에 대한 제어",
  },
];

const quadrant = [
  {
    row: "지국쌍",
    perf: { main: "흐름제어", sub: "" },
    cong: { main: "혼잡제어", sub: "(흐름제어)" },
  },
  {
    row: "전체 부네트워크",
    perf: { main: "라우팅", sub: "(흐름제어)" },
    cong: { main: "혼잡제어, 흐름제어", sub: "(라우팅)" },
  },
];

export default function OverviewDiagram() {
  const [open, setOpen] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  return (
    <section>
      <SectionTitle
        title="흐름제어 · 혼잡제어 · 라우팅 개요"
        subtitle="5가지 통신 기능과 목적별 분류 표 — 카드를 클릭해 상세 설명을 확인하세요"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        {/* 5 기능 카드 */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {functions.map((f) => (
            <button
              key={f.key}
              onClick={() => setOpen(open === f.key ? null : f.key)}
              className={`rounded-lg border-2 p-3 text-left transition-all ${
                open === f.key
                  ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                  : "border-gray-200 hover:border-sky-300 dark:border-gray-700"
              }`}
            >
              <div className="text-sm font-bold text-sky-600 dark:text-sky-300">
                {f.name}
              </div>
              <div className="text-xs text-gray-500">{f.english}</div>
              <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                {f.note}
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              key={open}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 rounded-lg bg-sky-50 p-4 text-sm dark:bg-sky-900/20"
            >
              <div className="font-bold text-sky-700 dark:text-sky-300">
                {functions.find((f) => f.key === open)!.name}
              </div>
              <p className="mt-1 text-gray-700 dark:text-gray-300">
                {functions.find((f) => f.key === open)!.desc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 목적별 분류 4사분면 표 */}
        <div>
          <h3 className="mb-2 text-sm font-bold">
            목적별 통신 기능의 구분
          </h3>
          <p className="mb-3 text-xs text-gray-500">
            대상 범위 × 목적의 4사분면 — 괄호 안은 보조적 기능 · 셀에 마우스를 올려보세요
          </p>
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="p-2 text-left"></th>
                  <th className="p-2 font-semibold text-emerald-600">
                    성능 향상
                  </th>
                  <th className="p-2 font-semibold text-rose-600">
                    혼잡 방지
                  </th>
                </tr>
              </thead>
              <tbody>
                {quadrant.map((q, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-200 dark:border-gray-700"
                  >
                    <th className="bg-gray-50 p-2 text-left text-xs font-semibold dark:bg-gray-800">
                      {q.row}
                    </th>
                    {[
                      { cell: q.perf, k: `${i}-p` },
                      { cell: q.cong, k: `${i}-c` },
                    ].map(({ cell, k }) => (
                      <td
                        key={k}
                        onMouseEnter={() => setHover(k)}
                        onMouseLeave={() => setHover(null)}
                        className={`p-3 text-center transition-colors ${
                          hover === k
                            ? "bg-sky-100 dark:bg-sky-900/30"
                            : ""
                        }`}
                      >
                        <div className="font-bold text-sky-700 dark:text-sky-300">
                          {cell.main}
                        </div>
                        {cell.sub && (
                          <div className="text-xs text-gray-500">
                            {cell.sub}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            <strong>부네트워크(subnetwork)</strong>의 내부 환경에 관계없이
            통신망의 성능 유지가 목적. 흐름제어·혼잡제어·라우팅은 모두 부네트워크 내부와 사용자 지국(U) 사이에서 수행.
          </div>
        </div>
      </div>
    </section>
  );
}
