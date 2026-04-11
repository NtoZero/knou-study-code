"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

type Principle = "speed" | "reject" | "single" | "multi";

interface Tab {
  key: Principle;
  title: string;
  subtitle: string;
  example: string;
  desc: string;
}

const tabs: Tab[] = [
  {
    key: "speed",
    title: "(1) 속도조절",
    subtitle: "speed adjustment",
    example: "choke packet 감속",
    desc: "블록간의 도착 간격을 변경하여 전송 속도를 조절. 수신측·중간 노드가 choke packet(억제 패킷)을 송신측에 보내 전송 속도를 낮추도록 요청.",
  },
  {
    key: "reject",
    title: "(2) 거부",
    subtitle: "rejection",
    example: "무시, stop-and-go",
    desc: "송신측에 대한 거부 상태를 통지. 무시 방법(수신측이 단순히 해당 블록을 무시)과 stop-and-go 방법(Stop 신호로 송신 중지, Go 신호로 재개).",
  },
  {
    key: "single",
    title: "(3) 단일 승낙",
    subtitle: "single permission",
    example: "wait-before-go, ask-and-wait",
    desc: "매번 송신 허락을 받아야 함. 한 블록을 보낼 때마다 수신측의 허락(승낙)을 받아야 전송 가능. ask-and-wait은 송신측이 먼저 Ask 요청 후 Wait / Go 응답을 기다림.",
  },
  {
    key: "multi",
    title: "(4) 다중 승낙",
    subtitle: "multiple permission",
    example: "sliding window",
    desc: "정해진 개수의 블록만 송신 가능. 한 번의 승낙으로 여러 개의 블록을 연속 전송할 수 있으나 그 개수는 제한. 대표적으로 sliding window 방법.",
  },
];

// 간단한 시퀀스 애니메이션용 이벤트
const sequences: Record<Principle, { from: "S" | "R"; label: string; color: string }[]> = {
  speed: [
    { from: "S", label: "블록", color: "bg-sky-500" },
    { from: "S", label: "블록", color: "bg-sky-500" },
    { from: "R", label: "choke", color: "bg-amber-500" },
    { from: "S", label: "블록 (감속)", color: "bg-sky-400" },
  ],
  reject: [
    { from: "S", label: "블록", color: "bg-sky-500" },
    { from: "R", label: "Stop", color: "bg-red-500" },
    { from: "R", label: "Go", color: "bg-emerald-500" },
    { from: "S", label: "블록", color: "bg-sky-500" },
  ],
  single: [
    { from: "S", label: "Ask", color: "bg-sky-500" },
    { from: "R", label: "Wait", color: "bg-amber-500" },
    { from: "R", label: "Go", color: "bg-emerald-500" },
    { from: "S", label: "블록", color: "bg-sky-600" },
  ],
  multi: [
    { from: "S", label: "블록 0", color: "bg-sky-500" },
    { from: "S", label: "블록 1", color: "bg-sky-500" },
    { from: "S", label: "블록 2", color: "bg-sky-500" },
    { from: "R", label: "ACK", color: "bg-emerald-500" },
    { from: "S", label: "윈도우 전진", color: "bg-sky-600" },
  ],
};

export default function FlowControlPrinciples() {
  const [tab, setTab] = useState<Principle>("speed");
  const [step, setStep] = useState(0);

  const seq = sequences[tab];

  useEffect(() => {
    setStep(0);
    const id = setInterval(() => {
      setStep((s) => (s + 1) % (seq.length + 1));
    }, 1200);
    return () => clearInterval(id);
  }, [tab, seq.length]);

  const current = tabs.find((t) => t.key === tab)!;

  return (
    <section>
      <SectionTitle
        title="흐름제어의 네 가지 원칙"
        subtitle="탭을 클릭하면 각 원칙의 동작 방식이 애니메이션으로 재생됩니다"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        {/* 탭 */}
        <div className="mb-4 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "bg-sky-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="mb-3">
              <div className="text-lg font-bold text-sky-600 dark:text-sky-300">
                {current.title}{" "}
                <span className="text-xs font-normal text-gray-500">
                  {current.subtitle}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                예: {current.example}
              </div>
            </div>

            {/* 시뮬레이션 */}
            <div className="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div className="mb-4 grid grid-cols-2 gap-4 text-xs">
                <div className="text-center font-semibold text-sky-600">
                  Sender (S)
                </div>
                <div className="text-center font-semibold text-rose-600">
                  Receiver (R)
                </div>
              </div>

              <div className="relative space-y-2">
                {seq.map((ev, i) => {
                  const active = i < step;
                  return (
                    <div
                      key={i}
                      className="grid grid-cols-2 items-center gap-4"
                    >
                      <AnimatePresence>
                        {active && ev.from === "S" && (
                          <motion.div
                            initial={{ x: 0, opacity: 0 }}
                            animate={{ x: "100%", opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className={`col-start-1 col-end-3 h-6 w-24 rounded px-2 text-center text-xs font-bold leading-6 text-white ${ev.color}`}
                          >
                            {ev.label} →
                          </motion.div>
                        )}
                        {active && ev.from === "R" && (
                          <motion.div
                            initial={{ x: 0, opacity: 0 }}
                            animate={{ x: "-100%", opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className={`col-start-2 col-end-4 ml-auto h-6 w-24 rounded px-2 text-center text-xs font-bold leading-6 text-white ${ev.color}`}
                          >
                            ← {ev.label}
                          </motion.div>
                        )}
                        {!active && (
                          <div className="col-span-2 h-6 opacity-30">
                            <div
                              className={`h-6 w-24 rounded ${
                                ev.from === "S" ? "" : "ml-auto"
                              } ${ev.color} opacity-30`}
                            />
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 text-right text-xs text-gray-500">
                step {step} / {seq.length}
              </div>
            </div>

            <div className="rounded-lg bg-sky-50 p-4 text-sm dark:bg-sky-900/20">
              {current.desc}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 비교표 */}
        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="p-2 text-left">원칙</th>
                <th className="p-2 text-left">제어 방식</th>
                <th className="p-2 text-left">대표 예</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["(1) 속도조절", "블록간 간격 조절", "choke packet 감속"],
                ["(2) 거부", "거부 상태 통지", "무시, stop-and-go"],
                ["(3) 단일 승낙", "1블록당 1허락", "wait-before-go, ask-and-wait"],
                ["(4) 다중 승낙", "N블록당 1허락", "sliding window"],
              ].map((r) => (
                <tr
                  key={r[0]}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="p-2 font-semibold">{r[0]}</td>
                  <td className="p-2">{r[1]}</td>
                  <td className="p-2 text-gray-500">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
