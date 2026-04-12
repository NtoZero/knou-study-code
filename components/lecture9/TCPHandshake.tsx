"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

type Mode = "setup" | "termination";

interface Msg {
  id: number;
  dir: "c2s" | "s2c";
  label: string;
  note: string;
}

const setupMsgs: Msg[] = [
  {
    id: 1,
    dir: "c2s",
    label: "SYN seq=14531",
    note: "세그먼트 1: 클라이언트가 ISN 14531로 연결 요청",
  },
  {
    id: 2,
    dir: "s2c",
    label: "SYN seq=35731, ACK 14532",
    note: "세그먼트 2: 서버가 자기 ISN 35731 전달 + 클라이언트 ISN+1 응답",
  },
  {
    id: 3,
    dir: "c2s",
    label: "ACK 35732",
    note: "세그먼트 3: 클라이언트가 서버 ISN+1 응답 → 연결 설정 완료",
  },
];

const termMsgs: Msg[] = [
  { id: 1, dir: "c2s", label: "FIN seq=x", note: "클라이언트 응용계층 사용자 close" },
  { id: 2, dir: "s2c", label: "ACK x+1", note: "서버 측에서 EOF를 응용계층에 전달" },
  { id: 3, dir: "s2c", label: "FIN seq=y", note: "서버 응용계층 사용자 close" },
  { id: 4, dir: "c2s", label: "ACK y+1", note: "클라이언트에서 EOF 전달 → 연결 종료 완료" },
];

export default function TCPHandshake() {
  const [mode, setMode] = useState<Mode>("setup");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const msgs = mode === "setup" ? setupMsgs : termMsgs;
  const maxStep = msgs.length;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (step >= maxStep) {
      setPlaying(false);
      return;
    }
    timerRef.current = setTimeout(() => setStep((s) => s + 1), 1200);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, step, maxStep]);

  const play = () => {
    if (step >= maxStep) setStep(0);
    setPlaying(true);
  };
  const pause = () => setPlaying(false);
  const next = () => setStep((s) => Math.min(s + 1, maxStep));
  const reset = () => {
    setPlaying(false);
    setStep(0);
  };

  return (
    <section>
      <SectionTitle
        title="TCP 연결 설정 & 종료"
        subtitle="3-way handshake / 4-way termination 애니메이션"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        {/* 탭 */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => {
              setMode("setup");
              reset();
            }}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              mode === "setup" ? "bg-yellow-500 text-white" : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            연결 설정 (3-way)
          </button>
          <button
            onClick={() => {
              setMode("termination");
              reset();
            }}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              mode === "termination" ? "bg-amber-600 text-white" : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            연결 종료 (4-way)
          </button>
        </div>

        {/* 소켓 주소 예시 */}
        <div className="mb-4 grid gap-2 text-xs sm:grid-cols-2">
          <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-950/20">
            <div className="font-bold text-yellow-700 dark:text-yellow-300">클라이언트</div>
            <div className="font-mono">(163.100.21.67, 12345)</div>
            <div className="text-[10px] text-gray-500">포트 12345 — 임시(ephemeral)</div>
          </div>
          <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950/20">
            <div className="font-bold text-amber-700 dark:text-amber-300">서버 (FTP)</div>
            <div className="font-mono">(211.110.34.15, 21)</div>
            <div className="text-[10px] text-gray-500">포트 21 — FTP 제어(well-known)</div>
          </div>
        </div>

        {/* 다이어그램 */}
        <div className="relative mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="mb-3 flex justify-between text-sm font-bold">
            <span className="text-yellow-700 dark:text-yellow-300">클라이언트</span>
            <span className="text-amber-700 dark:text-amber-300">서버</span>
          </div>
          <div className="relative">
            {/* 두 세로선 */}
            <div className="absolute left-[10%] top-0 h-full w-0.5 bg-yellow-300 dark:bg-yellow-700" />
            <div className="absolute right-[10%] top-0 h-full w-0.5 bg-amber-300 dark:bg-amber-700" />

            <div className="space-y-6 py-2">
              <AnimatePresence>
                {msgs.slice(0, step).map((m, i) => (
                  <motion.div
                    key={`${mode}-${m.id}`}
                    initial={{ opacity: 0, x: m.dir === "c2s" ? -40 : 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="relative h-8"
                  >
                    <div
                      className={`absolute top-1/2 h-0.5 ${
                        m.dir === "c2s"
                          ? "left-[10%] right-[10%] bg-yellow-500"
                          : "left-[10%] right-[10%] bg-amber-500"
                      }`}
                    />
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        m.dir === "c2s" ? "right-[10%]" : "left-[10%]"
                      }`}
                    >
                      <span
                        className={`${
                          m.dir === "c2s" ? "text-yellow-600" : "text-amber-600"
                        } text-lg`}
                      >
                        {m.dir === "c2s" ? "▶" : "◀"}
                      </span>
                    </div>
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 rounded bg-white px-2 py-0.5 text-[11px] font-mono shadow-sm dark:bg-gray-700 ${
                        m.dir === "c2s"
                          ? "left-1/2 -translate-x-1/2 text-yellow-700 dark:text-yellow-300"
                          : "left-1/2 -translate-x-1/2 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {m.label}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ISN 설명 */}
        {mode === "setup" && (
          <div className="mb-4 rounded-lg bg-yellow-50 p-3 text-xs dark:bg-yellow-950/20">
            <strong className="text-yellow-700 dark:text-yellow-300">ISN (Initial Sequence Number):</strong>{" "}
            난수발생기로 생성. 양 방향이 서로 다른 ISN 사용 (예: 클라이언트 14531, 서버 35731)
          </div>
        )}

        {/* 컨트롤 */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={playing ? pause : play}
            className="rounded-lg bg-yellow-500 px-3 py-1.5 text-sm text-white hover:bg-yellow-600"
          >
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            onClick={next}
            disabled={step >= maxStep || playing}
            className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm text-white hover:bg-amber-600 disabled:opacity-40"
          >
            Step ▶
          </button>
          <button
            onClick={reset}
            className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm dark:bg-gray-700"
          >
            초기화
          </button>
          <span className="flex items-center text-xs text-gray-500">
            {step} / {maxStep}
          </span>
        </div>

        {/* 단계 로그 */}
        <div className="space-y-1">
          {msgs.slice(0, step).map((m) => (
            <motion.div
              key={`log-${mode}-${m.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded bg-gray-50 px-3 py-1.5 text-xs dark:bg-gray-800"
            >
              <span className="font-mono font-bold text-yellow-600 dark:text-yellow-400">
                [{m.id}]
              </span>{" "}
              <span className="font-mono">{m.label}</span>
              <span className="ml-2 text-gray-500">— {m.note}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
