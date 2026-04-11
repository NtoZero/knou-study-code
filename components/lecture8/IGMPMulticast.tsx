"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

type CommMode = "unicast" | "multicast" | "broadcast";

const RESERVED = [
  { addr: "220.0.0.0", group: "예약" },
  { addr: "224.0.0.1", group: "모든 호스트 및 라우터" },
  { addr: "224.0.0.2", group: "모든 라우터" },
];

const IGMP_TYPES = [
  { name: "Query", dir: "라우터 → 호스트", desc: "주기적 질의. general / special" },
  { name: "Membership Report", dir: "호스트 → 라우터", desc: "그룹에 참가 중임을 보고" },
  { name: "Leave Report", dir: "호스트 → 라우터", desc: "그룹을 떠남" },
];

export default function IGMPMulticast() {
  const [mode, setMode] = useState<CommMode>("multicast");

  // Target node highlighting for communication modes
  const nodes = Array.from({ length: 8 }, (_, i) => i);
  const activeNodes: number[] =
    mode === "unicast" ? [3] : mode === "multicast" ? [1, 3, 5] : [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <section>
      <SectionTitle
        title="IGMP & IP 멀티캐스트"
        subtitle="멀티캐스트 그룹 관리 프로토콜 · 클래스 D 주소"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        {/* Class D address bits */}
        <div className="mb-5">
          <div className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
            클래스 D IP 주소 형식 (32 bit)
          </div>
          <div className="grid grid-cols-32 gap-px overflow-hidden rounded bg-gray-200 text-[11px] dark:bg-gray-700">
            <div className="col-span-1 bg-pink-500 py-2 text-center font-bold text-white">1</div>
            <div className="col-span-1 bg-pink-500 py-2 text-center font-bold text-white">1</div>
            <div className="col-span-1 bg-pink-500 py-2 text-center font-bold text-white">1</div>
            <div className="col-span-1 bg-pink-500 py-2 text-center font-bold text-white">0</div>
            <div className="col-span-28 bg-pink-100 py-2 text-center font-semibold text-pink-800 dark:bg-pink-900/60 dark:text-pink-200">
              멀티캐스트 그룹 주소 (28 bit)
            </div>
          </div>
          <div className="mt-2 text-center text-xs text-gray-500">
            주소 범위: <span className="font-mono font-bold text-pink-600">224.0.0.0 ~ 239.255.255.255</span>
          </div>
        </div>

        {/* Reserved addresses */}
        <div className="mb-5">
          <div className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-400">예약 주소</div>
          <div className="grid gap-2 md:grid-cols-3">
            {RESERVED.map((r) => (
              <div
                key={r.addr}
                className="rounded-lg bg-pink-50 p-3 text-xs dark:bg-pink-950/30"
              >
                <div className="font-mono font-bold text-pink-700 dark:text-pink-300">{r.addr}</div>
                <div className="text-gray-600 dark:text-gray-400">{r.group}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Unicast / Multicast / Broadcast */}
        <div className="mb-5">
          <div className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
            통신 방식 비교
          </div>
          <div className="mb-3 flex gap-2">
            {(["unicast", "multicast", "broadcast"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                  mode === m
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-pink-100 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {m === "unicast"
                  ? "Unicast (1-to-1)"
                  : m === "multicast"
                  ? "Multicast (1-to-many)"
                  : "Broadcast (1-to-all)"}
              </button>
            ))}
          </div>
          <div className="relative h-36 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            {/* Source */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white">
                S
              </div>
            </div>
            {/* Receivers */}
            <div className="absolute right-4 top-0 flex h-full flex-col justify-around">
              {nodes.map((n) => {
                const active = activeNodes.includes(n);
                return (
                  <div key={n} className="flex items-center gap-1">
                    <motion.div
                      animate={{
                        scale: active ? [1, 1.15, 1] : 1,
                        backgroundColor: active ? "rgb(236 72 153)" : "rgb(209 213 219)",
                      }}
                      transition={{ duration: 0.6, repeat: active ? Infinity : 0 }}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    >
                      {n}
                    </motion.div>
                  </div>
                );
              })}
            </div>
            {/* Lines */}
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              {activeNodes.map((n) => {
                const y = ((n + 0.5) / 8) * 100;
                return (
                  <motion.line
                    key={n}
                    x1="8%"
                    y1="50%"
                    x2="92%"
                    y2={`${y}%`}
                    stroke="#ec4899"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                );
              })}
            </svg>
          </div>
          <div className="mt-2 text-center text-[11px] text-gray-500">
            {mode === "unicast" && "1:1 · 하나의 특정 수신자에게만 전송"}
            {mode === "multicast" && "1:many · 하나의 그룹에 속한 호스트들에게 전송"}
            {mode === "broadcast" && "1:all · 네트워크 전체에 전송"}
          </div>
        </div>

        {/* IGMP v2 message format */}
        <div className="mb-5">
          <div className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
            IGMP v2 메시지 형식
          </div>
          <div className="grid grid-cols-32 gap-px overflow-hidden rounded bg-gray-200 text-[11px] dark:bg-gray-700">
            <div className="col-span-8 bg-pink-100 py-2 text-center font-semibold text-pink-800 dark:bg-pink-900/60 dark:text-pink-200">
              유형 (8)
            </div>
            <div className="col-span-8 bg-pink-100 py-2 text-center font-semibold text-pink-800 dark:bg-pink-900/60 dark:text-pink-200">
              최대 응답시간 (8)
            </div>
            <div className="col-span-16 bg-pink-100 py-2 text-center font-semibold text-pink-800 dark:bg-pink-900/60 dark:text-pink-200">
              검사합 (16)
            </div>
            <div className="col-span-32 bg-pink-200 py-2 text-center font-semibold text-pink-900 dark:bg-pink-800/70 dark:text-pink-100">
              그룹 주소 (32, 클래스 D)
            </div>
          </div>
          <div className="mt-2 text-[11px] text-gray-500">
            Membership / Leave Report는 실제 그룹 주소 사용, Special Query는 0으로 채움
          </div>
        </div>

        {/* IGMP types */}
        <div className="grid gap-2 md:grid-cols-3">
          {IGMP_TYPES.map((t) => (
            <div
              key={t.name}
              className="rounded-lg border border-pink-200 bg-pink-50/40 p-3 text-xs dark:border-pink-900 dark:bg-pink-950/20"
            >
              <div className="font-bold text-pink-700 dark:text-pink-300">{t.name}</div>
              <div className="text-gray-500">{t.dir}</div>
              <div className="mt-1 text-gray-600 dark:text-gray-400">{t.desc}</div>
            </div>
          ))}
        </div>

        <style jsx>{`
          .grid-cols-32 {
            grid-template-columns: repeat(32, minmax(0, 1fr));
          }
        `}</style>
      </div>
    </section>
  );
}
