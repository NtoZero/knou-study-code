"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

const modes = [
  {
    name: "단방향 (Simplex)",
    desc: "한쪽 방향으로만 전송 가능. 송신 측과 수신 측의 역할이 고정",
    example: "라디오, TV 방송, 키보드 → 모니터",
    arrows: [{ dir: "right" as const }],
  },
  {
    name: "반이중 (Half-Duplex)",
    desc: "양방향 전송이 가능하나 동시에는 불가능. 교대로 전송",
    example: "무전기 (워키토키), CB 라디오",
    arrows: [{ dir: "right" as const }, { dir: "left" as const }],
  },
  {
    name: "전이중 (Full-Duplex)",
    desc: "동시에 양방향 전송 가능",
    example: "전화, 인터넷 통신",
    arrows: [{ dir: "both" as const }],
  },
];

export default function TransmissionModes() {
  const [active, setActive] = useState(0);

  return (
    <section>
      <SectionTitle
        title="전송 방향에 따른 통신 방식"
        subtitle="단방향, 반이중, 전이중 비교"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-6 flex gap-2">
          {modes.map((m, i) => (
            <button
              key={m.name}
              onClick={() => setActive(i)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                active === i
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Visualization */}
        <div className="flex items-center justify-center gap-6 py-8">
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
            <span className="text-2xl">🖥️</span>
            <span className="text-xs font-medium">A</span>
          </div>

          <div className="relative w-48">
            {active === 0 && (
              <motion.div
                key="simplex"
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{ x: [0, 160, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="h-3 w-3 rounded-full bg-emerald-500"
                />
                <div className="mt-2 h-0.5 w-full bg-emerald-300" />
                <span className="mt-1 text-lg">→</span>
              </motion.div>
            )}
            {active === 1 && (
              <motion.div
                key="halfduplex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{ x: [0, 160, 160, 0, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="h-3 w-3 rounded-full bg-amber-500"
                />
                <div className="mt-2 h-0.5 w-full bg-amber-300" />
                <span className="mt-1 text-lg">⇄</span>
                <span className="text-xs text-gray-500">(교대)</span>
              </motion.div>
            )}
            {active === 2 && (
              <motion.div
                key="fullduplex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-1"
              >
                <div className="relative h-3 w-full">
                  <motion.div
                    animate={{ x: [0, 160, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute h-3 w-3 rounded-full bg-blue-500"
                  />
                </div>
                <div className="h-0.5 w-full bg-blue-300" />
                <div className="h-0.5 w-full bg-rose-300" />
                <div className="relative h-3 w-full">
                  <motion.div
                    animate={{ x: [160, 0, 160] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute h-3 w-3 rounded-full bg-rose-500"
                  />
                </div>
                <span className="text-lg">⇆</span>
                <span className="text-xs text-gray-500">(동시)</span>
              </motion.div>
            )}
          </div>

          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/30">
            <span className="text-2xl">🖥️</span>
            <span className="text-xs font-medium">B</span>
          </div>
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg bg-gray-50 p-4 text-sm dark:bg-gray-800"
        >
          <p className="font-semibold">{modes[active].name}</p>
          <p className="mt-1 text-gray-600 dark:text-gray-400">{modes[active].desc}</p>
          <p className="mt-1 text-gray-500">예시: {modes[active].example}</p>
        </motion.div>
      </div>
    </section>
  );
}
