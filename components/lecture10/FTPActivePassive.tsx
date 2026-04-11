"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

type Mode = "active" | "passive";

interface Step {
  n: number;
  label: string;
  desc: string;
  dir: "c2s" | "s2c";
}

const activeSteps: Step[] = [
  {
    n: 1,
    label: "21번 포트 접속 + 두 번째 포트 알림",
    desc: "클라이언트는 FTP 서버의 21번 포트로 접속한 후 사용할 두 번째 포트를 서버에 알려 줌.",
    dir: "c2s",
  },
  {
    n: 2,
    label: "ACK 응답",
    desc: "서버는 ACK(응답 문자)로 응답.",
    dir: "s2c",
  },
  {
    n: 3,
    label: "서버 → 클라이언트 두 번째 포트 접속",
    desc: "서버는 클라이언트가 알려 준 두 번째 포트로 접속. (서버의 20번 포트 사용)",
    dir: "s2c",
  },
  {
    n: 4,
    label: "클라이언트 ACK",
    desc: "클라이언트에서는 ACK로 응답.",
    dir: "c2s",
  },
];

const passiveSteps: Step[] = [
  {
    n: 1,
    label: "21번 포트 접속 (PASV)",
    desc: "클라이언트는 FTP 서버의 21번 포트로 접속하며 수동 모드(PASV)를 요청.",
    dir: "c2s",
  },
  {
    n: 2,
    label: "서버가 사용할 포트 알림",
    desc: "서버는 클라이언트가 사용할 두 번째 포트(1024~65535 사이 랜덤 비특권 포트)를 알려 줌.",
    dir: "s2c",
  },
  {
    n: 3,
    label: "클라이언트 → 서버 해당 포트 접속",
    desc: "클라이언트는 다른 포트를 열어 서버가 알려 준 포트로 접속.",
    dir: "c2s",
  },
  {
    n: 4,
    label: "서버 ACK",
    desc: "서버는 ACK로 응답.",
    dir: "s2c",
  },
];

export default function FTPActivePassive() {
  const [mode, setMode] = useState<Mode>("active");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const steps = mode === "active" ? activeSteps : passiveSteps;

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPlaying(false);
    setStep(0);
  }, []);

  useEffect(() => {
    reset();
  }, [mode, reset]);

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
  }, [playing, step, steps.length]);

  const togglePlay = () => {
    if (step >= steps.length) setStep(0);
    setPlaying((p) => !p);
  };

  const current = step > 0 ? steps[step - 1] : null;

  return (
    <section>
      <SectionTitle
        title="FTP 능동/수동 모드"
        subtitle="21번(제어) / 20번(데이터) 포트와 방화벽 문제"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        {/* Mode tabs */}
        <div className="mb-4 flex gap-2">
          {(["active", "passive"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                mode === m
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-red-50 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {m === "active" ? "능동 모드 (Active)" : "수동 모드 (Passive)"}
            </button>
          ))}
        </div>

        {/* Visualization */}
        <div className="grid grid-cols-[1fr_2fr_1fr] items-center gap-2">
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center dark:border-red-800 dark:bg-red-900/20">
            <div className="text-xs font-bold text-red-700 dark:text-red-300">
              FTP 클라이언트
            </div>
            <div className="mt-1 text-[10px] text-gray-500">
              3211 / 3212 포트
            </div>
          </div>
          <div className="relative h-40 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
            {steps.map((s) => {
              const done = step >= s.n;
              const isActive = current?.n === s.n;
              const top = 8 + (s.n - 1) * 32;
              return (
                <div
                  key={s.n}
                  className="absolute left-2 right-2"
                  style={{ top }}
                >
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: done ? 1 : 0.25,
                      scale: isActive ? 1.02 : 1,
                    }}
                    className={`flex items-center gap-2 text-[10px] ${
                      s.dir === "c2s" ? "justify-start" : "justify-end"
                    }`}
                  >
                    {s.dir === "c2s" ? (
                      <>
                        <span
                          className={`rounded-full px-1.5 py-0.5 font-bold text-white ${
                            isActive ? "bg-red-500" : "bg-gray-400"
                          }`}
                        >
                          {s.n}
                        </span>
                        <span className="flex-1 border-t border-dotted border-gray-400" />
                        <span>▶</span>
                      </>
                    ) : (
                      <>
                        <span>◀</span>
                        <span className="flex-1 border-t border-dotted border-gray-400" />
                        <span
                          className={`rounded-full px-1.5 py-0.5 font-bold text-white ${
                            isActive ? "bg-blue-500" : "bg-gray-400"
                          }`}
                        >
                          {s.n}
                        </span>
                      </>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center dark:border-blue-800 dark:bg-blue-900/20">
            <div className="text-xs font-bold text-blue-700 dark:text-blue-300">
              FTP 서버
            </div>
            <div className="mt-1 text-[10px] text-gray-500">
              20(데이터) / 21(제어)
            </div>
          </div>
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
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-40 dark:bg-gray-800 dark:text-gray-300"
          >
            ◀ 이전
          </button>
          <button
            onClick={() => setStep((s) => Math.min(steps.length, s + 1))}
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

        {/* Step description */}
        <AnimatePresence mode="wait">
          {current ? (
            <motion.div
              key={`${mode}-${current.n}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-3 rounded-lg bg-red-50 p-3 text-xs dark:bg-red-900/20"
            >
              <div className="font-bold text-red-700 dark:text-red-300">
                ({current.n}) {current.label}
              </div>
              <p className="mt-1 text-gray-700 dark:text-gray-300">
                {current.desc}
              </p>
            </motion.div>
          ) : (
            <div className="mt-3 rounded-lg border border-dashed border-gray-300 p-3 text-xs text-gray-500 dark:border-gray-600">
              재생 버튼을 눌러 {mode === "active" ? "능동" : "수동"} 모드 4단계를
              확인하세요.
            </div>
          )}
        </AnimatePresence>

        {/* Active mode caveat */}
        {mode === "active" && (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs dark:border-amber-800 dark:bg-amber-900/20">
            <strong className="text-amber-700 dark:text-amber-300">
              능동 모드의 단점:
            </strong>{" "}
            서버가 클라이언트에 접속 시도. 클라이언트의 <strong>방화벽</strong> 및
            외부적인 환경 요인에 따라 FTP 접속 불가 혹은 에러 발생 가능.
          </div>
        )}
        {mode === "passive" && (
          <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs dark:border-emerald-800 dark:bg-emerald-900/20">
            <strong className="text-emerald-700 dark:text-emerald-300">
              수동 모드 특징:
            </strong>{" "}
            1024~65535 사이의 <strong>랜덤 비특권 포트</strong> 사용. 클라이언트가
            모든 연결을 시작하므로 클라이언트 방화벽 제약을 회피.
          </div>
        )}
      </div>

      {/* SFTP card */}
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">
            SFTP
          </span>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
            SSH File Transfer Protocol
          </span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          SSH(Secure Shell) 기반의 파일 전송 프로토콜. 신뢰할 수 있는 데이터
          흐름을 통해 <strong>파일 접근·파일 전송·파일 관리</strong>를 제공하며
          <strong> 하나의 연결만 필요</strong>하여 연결이 안정적.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-[11px] dark:border-emerald-800 dark:bg-emerald-900/20">
            <div className="font-bold text-emerald-700 dark:text-emerald-300">
              장점
            </div>
            <ul className="mt-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
              <li>암호화로 보안 강화</li>
              <li>하나의 연결로 방화벽 친화적</li>
              <li>파일 접근·전송·관리 통합 지원</li>
            </ul>
          </div>
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-[11px] dark:border-rose-800 dark:bg-rose-900/20">
            <div className="font-bold text-rose-700 dark:text-rose-300">
              단점
            </div>
            <ul className="mt-1 list-disc pl-4 text-gray-700 dark:text-gray-300">
              <li>SSH 키의 유효성 검사 및 관리 복잡</li>
              <li>소프트웨어 간 호환성 문제 발생</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
