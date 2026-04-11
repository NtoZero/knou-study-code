"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

type Mode = "arp" | "rarp";

const ARP_STEPS = [
  {
    phase: "request",
    label: "(1) ARP 요청 — broadcast",
    detail:
      "호스트 A가 브로드캐스트로 'IP 163.100.21.33의 MAC 주소를 알려주세요' 라고 네트워크 전체에 질의.",
  },
  {
    phase: "reply",
    label: "(2) ARP 응답 — unicast",
    detail: "호스트 B가 호스트 A에게만 직접(유니캐스트) 자신의 MAC 주소(48비트)를 응답.",
  },
] as const;

const RARP_STEPS = [
  {
    phase: "request",
    label: "(1) RARP 요청 — broadcast",
    detail:
      "디스크가 없는 호스트가 자신의 MAC 주소만 가지고 'My physical address is A46EA4578236. I am looking for my IP address' 를 브로드캐스트.",
  },
  {
    phase: "reply",
    label: "(2) RARP 응답 — unicast",
    detail: "RARP 서버가 해당 호스트에게만 직접 'Your IP address is 141.14.56.21' 를 응답.",
  },
] as const;

export default function ARPRARPFlow() {
  const [mode, setMode] = useState<Mode>("arp");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [proxy, setProxy] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const steps = mode === "arp" ? ARP_STEPS : RARP_STEPS;

  useEffect(() => {
    if (!playing) return;
    timerRef.current = setTimeout(() => {
      setStep((s) => {
        if (s + 1 >= steps.length) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 1500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, step, steps.length]);

  const reset = () => {
    setStep(0);
    setPlaying(false);
  };

  return (
    <section>
      <SectionTitle
        title="ARP / RARP 주소 변환"
        subtitle="IP 32비트 ↔ MAC 48비트 매핑 프로토콜"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        {/* Mode tabs */}
        <div className="mb-5 flex gap-2">
          {(["arp", "rarp"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                reset();
              }}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                mode === m
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-pink-100 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {m === "arp" ? "ARP (IP → MAC)" : "RARP (MAC → IP)"}
            </button>
          ))}
        </div>

        {/* Address mapping viz */}
        <div className="mb-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg bg-pink-50 p-3 dark:bg-pink-950/30">
            <div className="text-[10px] font-semibold text-pink-600">IP 주소 (논리) · 32 bit · 4 byte</div>
            <div className="mt-1 font-mono text-sm font-bold text-pink-700 dark:text-pink-300">
              163.100.21.33
            </div>
            <div className="mt-1 flex gap-0.5">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="h-2 flex-1 rounded-sm bg-pink-300 dark:bg-pink-700" />
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
            <div className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
              MAC 주소 (물리) · 48 bit · 6 byte
            </div>
            <div className="mt-1 font-mono text-sm font-bold text-amber-700 dark:text-amber-300">
              00-01-F0-85-21-35
            </div>
            <div className="mt-1 flex gap-0.5">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="h-2 flex-1 rounded-sm bg-amber-300 dark:bg-amber-700" />
              ))}
            </div>
          </div>
        </div>

        {/* Flow diagram */}
        <div className="relative mb-4 h-40 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <div className="absolute inset-x-8 top-1/2 h-0.5 -translate-y-1/2 bg-gray-300 dark:bg-gray-700" />

          {/* Host A */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white">
              A
            </div>
            <div className="mt-1 text-[10px] text-gray-500">
              {mode === "arp" ? "호스트 A" : "디스크 없음"}
            </div>
          </div>

          {/* Broadcast hosts */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex gap-2">
              {["B", "C", "D"].map((h) => (
                <div
                  key={h}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-xs font-bold text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                >
                  {h}
                </div>
              ))}
            </div>
          </div>

          {/* Target / Server */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
              {mode === "arp" ? "B" : "S"}
            </div>
            <div className="mt-1 text-[10px] text-gray-500">
              {mode === "arp" ? "호스트 B" : "RARP 서버"}
            </div>
          </div>

          {/* Animated packets */}
          <AnimatePresence>
            {step === 0 && (
              <motion.div
                key="broadcast"
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: [0, 100, 200, 300, 400], opacity: [1, 1, 1, 1, 0] }}
                transition={{ duration: 1.4 }}
                className="absolute left-16 top-1/2 -translate-y-1/2 rounded bg-pink-500 px-2 py-0.5 text-[10px] font-bold text-white shadow"
              >
                REQ (broadcast)
              </motion.div>
            )}
            {step === 1 && (
              <motion.div
                key="unicast"
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: [400, 300, 200, 100, 0], opacity: [1, 1, 1, 1, 0] }}
                transition={{ duration: 1.4 }}
                className="absolute left-16 top-1/2 -translate-y-1/2 rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow"
              >
                REPLY (unicast)
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step desc */}
        <div className="mb-4 rounded-lg bg-pink-50 p-4 dark:bg-pink-950/30">
          <div className="text-sm font-bold text-pink-700 dark:text-pink-300">{steps[step].label}</div>
          <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">{steps[step].detail}</p>
        </div>

        {/* Controls */}
        <div className="mb-5 flex gap-2">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-md bg-pink-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-pink-600"
          >
            {playing ? "일시정지" : "재생 ▶"}
          </button>
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold disabled:opacity-40 dark:bg-gray-800"
          >
            ← 이전
          </button>
          <button
            onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
            disabled={step === steps.length - 1}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold disabled:opacity-40 dark:bg-gray-800"
          >
            다음 →
          </button>
          <button
            onClick={reset}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold dark:bg-gray-800"
          >
            초기화
          </button>
        </div>

        {/* Proxy ARP */}
        {mode === "arp" && (
          <div className="rounded-lg border border-pink-200 bg-pink-50/40 p-4 dark:border-pink-900 dark:bg-pink-950/20">
            <label className="flex items-center gap-2 text-sm font-semibold text-pink-700 dark:text-pink-300">
              <input
                type="checkbox"
                checked={proxy}
                onChange={(e) => setProxy(e.target.checked)}
                className="accent-pink-500"
              />
              프락시 ARP (Proxy ARP) 표시
            </label>
            <AnimatePresence>
              {proxy && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 text-xs text-gray-700 dark:text-gray-300"
                >
                  <p>
                    서브네트워크에 속한 여러 호스트(141.23.56.21, 141.23.56.22, 141.23.56.23)를 대신해
                    <strong> 프락시 ARP 라우터</strong>가 ARP 요청에 응답. 외부에서는 하나의 서브넷으로 보임.
                  </p>
                  <div className="mt-2 font-mono text-[10px] leading-5 text-pink-700 dark:text-pink-300">
                    외부 요청 → [Proxy ARP R] → 141.23.56.21, .22, .23
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Comparison */}
        <div className="mt-5 grid gap-2 text-xs md:grid-cols-2">
          <div className="rounded bg-gray-50 p-3 dark:bg-gray-800/50">
            <div className="font-bold text-pink-600">ARP</div>
            <div className="text-gray-600 dark:text-gray-400">IP (논리) → MAC (물리)</div>
            <div className="text-gray-500">일반 호스트 사용 · 요청=broadcast, 응답=unicast</div>
          </div>
          <div className="rounded bg-gray-50 p-3 dark:bg-gray-800/50">
            <div className="font-bold text-pink-600">RARP</div>
            <div className="text-gray-600 dark:text-gray-400">MAC (물리) → IP (논리)</div>
            <div className="text-gray-500">디스크 없는 호스트가 자신의 IP를 얻을 때 사용</div>
          </div>
        </div>
      </div>
    </section>
  );
}
