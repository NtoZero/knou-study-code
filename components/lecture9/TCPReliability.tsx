"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

type Scenario = "packet-loss" | "ack-loss";

interface Event {
  id: number;
  time: number;
  dir: "send" | "recv" | "ack-fwd" | "ack-back" | "timer";
  label: string;
  lost?: boolean;
}

const scenarios: Record<Scenario, Event[]> = {
  "packet-loss": [
    { id: 1, time: 0, dir: "timer", label: "⏰ 패킷 전송 + 타이머 시작" },
    { id: 2, time: 1, dir: "send", label: "패킷 → (손실)", lost: true },
    { id: 3, time: 2, dir: "timer", label: "⏰ 타이머 종료 (응답 없음)" },
    { id: 4, time: 3, dir: "timer", label: "⏰ 패킷 재전송 + 타이머 재시작" },
    { id: 5, time: 4, dir: "send", label: "패킷 → 수신 성공" },
    { id: 6, time: 5, dir: "recv", label: "목적지: 패킷 수신 및 응답 전송" },
    { id: 7, time: 6, dir: "ack-back", label: "← ACK 수신, 타이머 취소" },
  ],
  "ack-loss": [
    { id: 1, time: 0, dir: "timer", label: "⏰ 패킷 전송 + 타이머 시작" },
    { id: 2, time: 1, dir: "send", label: "패킷 → 수신 성공" },
    { id: 3, time: 2, dir: "recv", label: "목적지: 응답 전송" },
    { id: 4, time: 3, dir: "ack-back", label: "ACK → (손실)", lost: true },
    { id: 5, time: 4, dir: "timer", label: "⏰ 타이머 종료" },
    { id: 6, time: 5, dir: "timer", label: "⏰ 패킷 재전송 + 타이머 재시작" },
    { id: 7, time: 6, dir: "send", label: "패킷 → 수신 (중복)" },
    { id: 8, time: 7, dir: "ack-back", label: "← ACK 수신, 타이머 취소" },
  ],
};

export default function TCPReliability() {
  const [scenario, setScenario] = useState<Scenario>("packet-loss");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showWindow, setShowWindow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const events = scenarios[scenario];
  const maxStep = events.length;

  useEffect(() => {
    if (!playing) return;
    if (step >= maxStep) {
      setPlaying(false);
      return;
    }
    timerRef.current = setTimeout(() => setStep((s) => s + 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, step, maxStep]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const play = () => {
    if (step >= maxStep) setStep(0);
    setPlaying(true);
  };
  const reset = () => {
    setPlaying(false);
    setStep(0);
  };

  return (
    <section>
      <SectionTitle
        title="TCP 신뢰성 제공 방법"
        subtitle="재전송 + MSS + 슬라이딩 윈도우"
      />

      <div className="space-y-6">
        {/* 신뢰성 제공 방법 요약 */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { num: 1, title: "연결지향", desc: "connection-oriented 전송" },
            { num: 2, title: "Segment 단위", desc: "MSS(Maximum Segment Size)" },
            { num: 3, title: "흐름 제어", desc: "sliding window 사용" },
            { num: 4, title: "오류 제어", desc: "응답/타이머/재전송" },
          ].map((c) => (
            <div
              key={c.num}
              className="rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-3 dark:bg-yellow-950/20"
            >
              <div className="text-[10px] font-bold text-yellow-600">{c.num}</div>
              <div className="font-bold text-yellow-900 dark:text-yellow-200">{c.title}</div>
              <div className="text-[11px] text-gray-600 dark:text-gray-400">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* 재전송 시뮬레이터 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-3 font-bold">오류 제어 — 재전송 시뮬레이터</h3>
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setScenario("packet-loss");
                reset();
              }}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                scenario === "packet-loss"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              (a) 패킷 손실
            </button>
            <button
              onClick={() => {
                setScenario("ack-loss");
                reset();
              }}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                scenario === "ack-loss"
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              (b) 응답 손실
            </button>
          </div>

          {/* 타임라인 */}
          <div className="relative mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div className="mb-2 flex justify-between text-xs font-bold">
              <span className="text-yellow-700 dark:text-yellow-300">발신지</span>
              <span className="text-amber-700 dark:text-amber-300">목적지</span>
            </div>
            <div className="relative">
              <div className="absolute left-[12%] top-0 h-full w-0.5 bg-yellow-300 dark:bg-yellow-700" />
              <div className="absolute right-[12%] top-0 h-full w-0.5 bg-amber-300 dark:bg-amber-700" />

              <div className="space-y-3 py-2">
                <AnimatePresence>
                  {events.slice(0, step).map((e) => {
                    const isForward = e.dir === "send";
                    const isBackward = e.dir === "ack-back";
                    const isTimer = e.dir === "timer";
                    const isRecv = e.dir === "recv";
                    return (
                      <motion.div
                        key={`${scenario}-${e.id}`}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative h-7"
                      >
                        {(isForward || isBackward) && (
                          <div
                            className={`absolute top-1/2 h-0.5 left-[12%] right-[12%] ${
                              e.lost
                                ? "bg-gradient-to-r from-red-400 via-red-500 to-transparent"
                                : isForward
                                  ? "bg-yellow-500"
                                  : "bg-amber-500"
                            }`}
                          />
                        )}
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-white px-2 py-0.5 text-[11px] shadow-sm dark:bg-gray-700 ${
                            isTimer
                              ? "left-[12%] font-bold text-rose-600 dark:text-rose-400"
                              : isRecv
                                ? "right-[12%] text-amber-700 dark:text-amber-300"
                                : "left-1/2 -translate-x-1/2 text-yellow-700 dark:text-yellow-300"
                          } ${e.lost ? "line-through opacity-70" : ""}`}
                        >
                          {e.label}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={play}
              disabled={playing}
              className="rounded-lg bg-yellow-500 px-3 py-1.5 text-sm text-white hover:bg-yellow-600 disabled:opacity-40"
            >
              {playing ? "재생 중..." : "▶ Play"}
            </button>
            <button
              onClick={() => setStep((s) => Math.min(s + 1, maxStep))}
              disabled={playing}
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

          <div className="mt-3 rounded-lg bg-yellow-50 p-3 text-xs dark:bg-yellow-950/20">
            {scenario === "packet-loss" ? (
              <>
                <strong>(a) 패킷 손실:</strong> 패킷 자체가 목적지에 도달하지 못해 응답이 없음. 타이머 종료 후 발신지가 재전송.
              </>
            ) : (
              <>
                <strong>(b) 응답 손실:</strong> 패킷은 정상 수신되었으나 응답 패킷이 손실. 타이머 종료 후 발신지가 재전송 → 수신자 중복 수신.
              </>
            )}
          </div>
        </div>

        {/* MSS / Window */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <h4 className="font-bold text-yellow-700 dark:text-yellow-300">
              MSS (Maximum Segment Size)
            </h4>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              TCP가 <strong>세그먼트 단위</strong>로 전송할 때의 최대 크기. TCP 헤더의{" "}
              <strong>옵션</strong> 필드에서 협상.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <h4 className="font-bold text-amber-700 dark:text-amber-300">
              윈도우 크기 최대값
            </h4>
            <p className="mt-2 font-mono text-xs">
              최대 = 2<sup>16</sup> = 65,535 bytes
            </p>
            <p className="mt-1 text-[11px] text-gray-500">
              윈도우 크기 필드가 16비트이므로.
            </p>
          </div>
        </div>

        {/* 슬라이딩 윈도우 토글 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">흐름 제어 — 슬라이딩 윈도우</h3>
            <button
              onClick={() => setShowWindow((v) => !v)}
              className={`rounded-lg px-3 py-1.5 text-xs ${
                showWindow ? "bg-yellow-500 text-white" : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              {showWindow ? "접기" : "펼치기"}
            </button>
          </div>
          <AnimatePresence>
            {showWindow && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3"
              >
                <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
                  한정된 버퍼 용량으로 흐름제어를 수행하기 위해 <strong>수신자가 윈도우 크기를 통지</strong>.
                  응답 수신 시 윈도우가 다음 세그먼트 방향으로 진행(slide).
                </p>
                <div className="mb-3 overflow-x-auto">
                  <div className="flex gap-1 min-w-[480px]">
                    {Array.from({ length: 10 }, (_, i) => {
                      const inWindow = i >= 2 && i < 6;
                      const acked = i < 2;
                      return (
                        <div
                          key={i}
                          className={`flex h-12 w-12 items-center justify-center rounded-lg text-xs font-bold ${
                            acked
                              ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : inWindow
                                ? "bg-yellow-400 text-white"
                                : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                          }`}
                        >
                          {i + 1}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2 text-[11px] text-gray-500">
                    ← 초기 윈도우 (수신자 통지) → 응답 수신 시 오른쪽으로 slide
                  </div>
                </div>
                <p className="text-[11px] text-gray-500">
                  슬라이딩 윈도우: 수신자가 통보한 윈도우 크기만큼 ACK 없이 연속 전송 후, ACK 수신 시 윈도우를 오른쪽으로 슬라이드하여 전송 효율을 높인다.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
