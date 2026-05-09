"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

type Actor = "client" | "server" | "ca";
type Direction = "c2s" | "s2c" | "ca2c";

interface Step {
  no: number;
  name: string;
  dir: Direction;
  actor: Actor;
  desc: string;
}

const steps: Step[] = [
  {
    no: 1,
    name: "Client Hello",
    dir: "c2s",
    actor: "client",
    desc: "클라이언트가 지원하는 암호화 알고리즘 / SSL 버전 등의 정보를 서버에 전송.",
  },
  {
    no: 2,
    name: "Server Hello",
    dir: "s2c",
    actor: "server",
    desc: "서버가 사용할 SSL 버전 및 암호화 알고리즘 등의 정보를 클라이언트에 전송.",
  },
  {
    no: 3,
    name: "Certificate",
    dir: "s2c",
    actor: "server",
    desc: "CA로부터 발급받은 인증서를 전송. 인증서에는 서비스 정보와 서버 공개키가 포함.",
  },
  {
    no: 4,
    name: "Server Key Exchange",
    dir: "s2c",
    actor: "server",
    desc: "키 교환에 필요한 정보를 전송.",
  },
  {
    no: 5,
    name: "Certificate Request",
    dir: "s2c",
    actor: "server",
    desc: "서버가 클라이언트에게 인증 및 클라이언트의 인증서를 요구.",
  },
  {
    no: 6,
    name: "Server Hello Done",
    dir: "s2c",
    actor: "server",
    desc: "더 이상 보낼 메시지가 없음을 알리는 메시지.",
  },
  {
    no: 7,
    name: "Client Key Exchange · Change Cipher Spec",
    dir: "c2s",
    actor: "client",
    desc: "pre master secret key를 생성하여 대칭키로 사용. 서버의 공개키로 암호화하여 전달.",
  },
  {
    no: 8,
    name: "Change Cipher Spec",
    dir: "s2c",
    actor: "server",
    desc: "pre master secret key를 복호화한 후 master key로 승격. 이후 보안 파라미터를 적용 혹은 변경할 때 보내는 과정.",
  },
  {
    no: 9,
    name: "Data",
    dir: "c2s",
    actor: "client",
    desc: "세션(Session) 구간에서 실제 데이터를 대칭키로 암호화하여 전송. 핸드셰이크로 교환한 master key(대칭키)를 사용.",
  },
];

export default function HTTPSHandshake() {
  const [step, setStep] = useState(0); // 0 = 시작 전
  const [playing, setPlaying] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPlaying(false);
  }, []);

  const reset = () => {
    stop();
    setStep(0);
  };

  const next = () => {
    setStep((s) => (s < steps.length ? s + 1 : s));
  };
  const prev = () => {
    setStep((s) => (s > 0 ? s - 1 : s));
  };

  useEffect(() => {
    if (playing) {
      if (step >= steps.length) {
        setPlaying(false);
        return;
      }
      timerRef.current = setTimeout(() => setStep((s) => s + 1), 1400);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, step]);

  const togglePlay = () => {
    if (step >= steps.length) setStep(0);
    setPlaying((p) => !p);
  };

  const current = step > 0 ? steps[step - 1] : null;

  return (
    <section>
      <SectionTitle
        title="HTTPS SSL/TLS 핸드셰이크"
        subtitle="대칭키·공개키를 모두 사용하여 보안 채널을 수립하는 9단계"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        {/* Tracks */}
        <div className="relative grid grid-cols-3 gap-2">
          <Track label="클라이언트" color="red" />
          <Track label="서버" color="blue" />
          <Track label="CA" color="amber" subtitle="인증서 발급" />
        </div>

        {/* Diagram area */}
        <div className="relative mt-2 h-[300px] rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
          {/* vertical lines */}
          <div className="absolute left-[16.6%] top-0 h-full w-px bg-red-300" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-blue-300" />
          <div className="absolute left-[83.3%] top-0 h-full w-px bg-amber-300" />

          {/* CA → Server initial arrow */}
          <div className="absolute right-2 top-2 rounded bg-amber-100 px-2 py-0.5 text-[10px] text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
            인증서 발급
          </div>

          {/* Animated arrow for current step */}
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={current.no}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0"
                style={{ top: `${40 + (current.no - 1) * 28}px` }}
              >
                <StepArrow step={current} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* history (completed steps drawn faintly) */}
          {steps.slice(0, step).map((s) => (
            <div
              key={s.no}
              className="absolute left-0 right-0 opacity-40"
              style={{ top: `${40 + (s.no - 1) * 28}px` }}
            >
              <StepArrow step={s} faded />
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={togglePlay}
            className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
          >
            {playing ? "⏸ 일시정지" : "▶ 재생"}
          </button>
          <button
            onClick={prev}
            disabled={step === 0}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-40 dark:bg-gray-800 dark:text-gray-300"
          >
            ◀ 이전
          </button>
          <button
            onClick={next}
            disabled={step >= steps.length}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-40 dark:bg-gray-800 dark:text-gray-300"
          >
            다음 ▶
          </button>
          <button
            onClick={reset}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          >
            ↺ 처음으로
          </button>
          <span className="ml-auto text-xs text-gray-500">
            {step} / {steps.length} 단계
          </span>
        </div>

        {/* Current step info */}
        <AnimatePresence mode="wait">
          {current ? (
            <motion.div
              key={current.no}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs dark:border-red-800 dark:bg-red-900/20"
            >
              <div className="font-bold text-red-700 dark:text-red-300">
                ({current.no}) {current.name}
              </div>
              <p className="mt-1 text-gray-700 dark:text-gray-300">
                {current.desc}
              </p>
            </motion.div>
          ) : (
            <div className="mt-3 rounded-lg border border-dashed border-gray-300 p-3 text-xs text-gray-500 dark:border-gray-600">
              ▶ 재생 버튼을 눌러 SSL 핸드셰이크 8단계를 확인하세요.
            </div>
          )}
        </AnimatePresence>

        {/* 세션 상태 표시 */}
        <div className="mt-3 rounded-lg bg-gray-900 p-3 text-center text-xs text-green-300">
          {step >= steps.length
            ? "══ 핸드셰이크 완료 · 이후 데이터는 master key(대칭키)로 암호화 ══"
            : "── 핸드셰이크 진행 중 ──"}
        </div>
      </div>

      {/* 대칭키 vs 공개키 비교 */}
      <div className="mt-4 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <button
          onClick={() => setCompareOpen((o) => !o)}
          className="flex w-full items-center justify-between p-4 text-left"
        >
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
            대칭키 vs 공개키 비교 {compareOpen ? "▼" : "▶"}
          </span>
          <span className="text-xs text-gray-500">HTTPS는 둘 다 사용</span>
        </button>
        <AnimatePresence>
          {compareOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid gap-3 px-4 pb-4 md:grid-cols-2">
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs dark:border-red-800 dark:bg-red-900/20">
                  <div className="font-bold text-red-700 dark:text-red-300">
                    대칭키(Symmetric Key)
                  </div>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">
                    암호화와 복호화 시 키가 같음. 클라이언트와 서버가 모두{" "}
                    <strong>공유키</strong>를 가짐. HTTPS에서는{" "}
                    <strong>실제 데이터 전송</strong>에 사용.
                  </p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs dark:border-blue-800 dark:bg-blue-900/20">
                  <div className="font-bold text-blue-700 dark:text-blue-300">
                    공개키(Public Key)
                  </div>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">
                    공개키와 개인키를 함께 사용. 암호화할 때는{" "}
                    <strong>공개키</strong>, 복호화할 때는{" "}
                    <strong>개인키</strong> 사용. HTTPS에서는{" "}
                    <strong>대칭키를 안전하게 전달</strong>하는 데 사용.
                  </p>
                </div>
                <div className="md:col-span-2 rounded-lg bg-amber-50 p-3 text-xs dark:bg-amber-900/20">
                  <strong className="text-amber-700 dark:text-amber-300">
                    CA(Certificate Authority):
                  </strong>{" "}
                  인증서 발급 기업. 브라우저는 CA 리스트를 가지며, CA 존재 확인 후
                  CA의 공개키를 이용해 인증서를 복호화.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Track({
  label,
  color,
  subtitle,
}: {
  label: string;
  color: "red" | "blue" | "amber";
  subtitle?: string;
}) {
  const cls = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
  }[color];
  return (
    <div className="flex flex-col items-center">
      <div
        className={`rounded-lg ${cls} px-3 py-1.5 text-xs font-bold text-white shadow`}
      >
        {label}
      </div>
      {subtitle && (
        <div className="mt-0.5 text-[10px] text-gray-500">{subtitle}</div>
      )}
    </div>
  );
}

function StepArrow({ step, faded = false }: { step: Step; faded?: boolean }) {
  const opacity = faded ? 0.35 : 1;
  // dir: c2s (client→server), s2c (server→client)
  const isC2S = step.dir === "c2s";
  return (
    <div className="relative mx-auto h-6 w-2/3" style={{ opacity }}>
      <div className="absolute left-0 right-1/2 top-1/2 h-0.5 -translate-y-1/2 bg-gray-400" />
      <div className="absolute right-0 left-1/2 top-1/2 h-0.5 -translate-y-1/2 bg-gray-400" />
      <motion.div
        initial={{ x: isC2S ? "-20%" : "120%" }}
        animate={{ x: isC2S ? "100%" : "0%" }}
        transition={{ duration: 1.0, ease: "easeInOut" }}
        className={`absolute top-1/2 -translate-y-1/2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${
          isC2S ? "bg-red-500" : "bg-blue-500"
        }`}
      >
        ({step.no}) {step.name}
      </motion.div>
    </div>
  );
}
