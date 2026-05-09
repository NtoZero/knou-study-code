"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

const telnetSteps = [
  {
    n: 1,
    label: "TCP 연결 (23번 포트)",
    desc: "클라이언트는 원격 로그인을 통하여 서버 시스템에 TCP 연결(23번 포트).",
  },
  {
    n: 2,
    label: "가상 터미널 제공",
    desc: "서버 시스템은 연결된 클라이언트에게 가상의 터미널을 제공. NVT(Network Virtual Terminal)를 사용하여 서로 다른 시스템 간 문자 집합을 변환.",
  },
  {
    n: 3,
    label: "명령어 실행",
    desc: "클라이언트는 실제 터미널인 것처럼 서버 시스템에 명령어를 실행.",
  },
  {
    n: 4,
    label: "결과 반환",
    desc: "서버 시스템은 클라이언트의 명령을 수행하여 결과를 다시 클라이언트에게 전송.",
  },
];

const mailPhases = [
  {
    n: 1,
    label: "송신자 → 메일 서버 A (SMTP)",
    desc: "송신자가 SMTP를 통해 메일 서버 A(예: knou.ac.kr)로 메일을 전송.",
    proto: "SMTP",
  },
  {
    n: 2,
    label: "메일 서버 A → 메일 서버 B (SMTP)",
    desc: "메일 서버 A는 SMTP를 통해 인터넷을 거쳐 메일 서버 B(예: jj.ac.kr)로 메일을 전달.",
    proto: "SMTP",
  },
  {
    n: 3,
    label: "수신자 ← 메일 서버 B (POP3 / IMAP)",
    desc: "수신자는 POP3 또는 IMAP을 사용하여 메일 서버 B에서 메일을 받아옴.",
    proto: "POP3/IMAP",
  },
];

export default function RemoteAccessAndMail() {
  // Telnet playback
  const [tStep, setTStep] = useState(0);
  const [tPlaying, setTPlaying] = useState(false);
  const tTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mail playback
  const [mStep, setMStep] = useState(0);
  const [mPlaying, setMPlaying] = useState(false);
  const mTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTelnet = useCallback(() => {
    if (tTimer.current) clearTimeout(tTimer.current);
    setTPlaying(false);
    setTStep(0);
  }, []);

  const resetMail = useCallback(() => {
    if (mTimer.current) clearTimeout(mTimer.current);
    setMPlaying(false);
    setMStep(0);
  }, []);

  useEffect(() => {
    if (tPlaying) {
      if (tStep >= telnetSteps.length) {
        setTPlaying(false);
        return;
      }
      tTimer.current = setTimeout(() => setTStep((s) => s + 1), 1300);
    }
    return () => {
      if (tTimer.current) clearTimeout(tTimer.current);
    };
  }, [tPlaying, tStep]);

  useEffect(() => {
    if (mPlaying) {
      if (mStep >= mailPhases.length) {
        setMPlaying(false);
        return;
      }
      mTimer.current = setTimeout(() => setMStep((s) => s + 1), 1500);
    }
    return () => {
      if (mTimer.current) clearTimeout(mTimer.current);
    };
  }, [mPlaying, mStep]);

  return (
    <section>
      <SectionTitle
        title="원격 접속 & 메일 서비스"
        subtitle="TELNET · SSH 그리고 SMTP · POP3 · IMAP"
      />

      {/* Section 1: TELNET vs SSH */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h4 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">
          1. 원격 접속 서비스
        </h4>

        <div className="mb-4 grid gap-3 md:grid-cols-2">
          {/* TELNET */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-red-700 dark:text-red-300">
                TELNET
              </span>
              <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold dark:bg-gray-800">
                포트 23
              </span>
            </div>
            <p className="mt-1 text-[11px] text-gray-700 dark:text-gray-300">
              원격지 컴퓨터를 이용하는 <strong>가상 단말 기능</strong>을 실현하기
              위한 프로토콜. 모든 플랫폼에서 사용. 사용자 아이디/패스워드 필요.
            </p>
            <div className="mt-2 rounded bg-white p-2 text-[10px] dark:bg-gray-800">
              <strong className="text-red-700 dark:text-red-300">
                NVT (Network Virtual Terminal)
              </strong>
              <p className="mt-0.5 text-gray-600 dark:text-gray-400">
                터미널과 호스트 간 일대일 대칭적 관계의 터미널 에뮬레이션.
                클라이언트와 서버의 버전이 다르더라도 원활한 통신을 위해 데이터를
                변환.
              </p>
            </div>
          </div>

          {/* SSH */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                SSH (Secure Shell)
              </span>
              <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold dark:bg-gray-800">
                암호화
              </span>
            </div>
            <p className="mt-1 text-[11px] text-gray-700 dark:text-gray-300">
              기존 유닉스 <strong>셸에 암호화가 추가</strong>된 버전. 강력한 인증과
              안전하지 못한 네트워크에서의 안전한 통신 기능 제공.
            </p>
            <div className="mt-2 rounded bg-white p-2 text-[10px] dark:bg-gray-800">
              <strong className="text-emerald-700 dark:text-emerald-300">
                안전한 대체 서비스
              </strong>
              <p className="mt-0.5 text-gray-600 dark:text-gray-400">
                rsh · rcp · rlogin · rexec · telnet · ftp 등의 서비스를 안전하게
                사용하도록 제공.
              </p>
            </div>
          </div>
        </div>

        {/* SSH 동작 2단계 */}
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
          <div className="mb-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            SSH 동작 방식 (2단계)
          </div>
          <div className="space-y-2">
            <div className="rounded-lg bg-white p-3 text-[11px] dark:bg-gray-800">
              <div className="font-bold text-emerald-700 dark:text-emerald-300">
                1단계: 키 교환 준비 및 서버 공개키 전송
              </div>
              <p className="mt-1 text-gray-700 dark:text-gray-300">
                클라이언트와 서버가 지원하는 암호 알고리즘을 선택한 후{" "}
                <strong>Diffie-Hellman 키 교환</strong>으로 세션 암호화에 필요한 공유키를 생성.
                서버는 자신의 <strong>공개키</strong>를 클라이언트에 전송하며,
                클라이언트는 공개키가 <strong>known_hosts</strong>에 없으면
                지문 등록 여부를 사용자에게 확인.
              </p>
            </div>
            <div className="rounded-lg bg-white p-3 text-[11px] dark:bg-gray-800">
              <div className="font-bold text-emerald-700 dark:text-emerald-300">
                2단계: 공개키 암호화 기반 인증
              </div>
              <p className="mt-1 text-gray-700 dark:text-gray-300">
                클라이언트는 자신의 <strong>공개키를 서버에 전송</strong>.
                서버는 <strong>authorized_keys</strong> 파일에 해당 공개키가 있는지 확인 후
                인증 성공 시 원본 메시지를 전달하여 접속을 허용.
              </p>
            </div>
          </div>
        </div>

        {/* TELNET 4-step animation */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              TELNET 동작 4단계
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  if (tStep >= telnetSteps.length) setTStep(0);
                  setTPlaying((p) => !p);
                }}
                className="rounded bg-red-500 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-red-600"
              >
                {tPlaying ? "⏸" : "▶"}
              </button>
              <button
                onClick={resetTelnet}
                className="rounded bg-gray-200 px-2 py-0.5 text-[10px] text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
              >
                ↺
              </button>
            </div>
          </div>
          <ol className="space-y-1">
            {telnetSteps.map((s) => {
              const done = tStep >= s.n;
              const active = tStep === s.n;
              return (
                <motion.li
                  key={s.n}
                  animate={{ opacity: done ? 1 : 0.4 }}
                  className={`rounded border px-2 py-1 text-[11px] ${
                    active
                      ? "border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/30"
                      : "border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-900"
                  }`}
                >
                  <span className="font-bold text-red-700 dark:text-red-300">
                    ({s.n})
                  </span>{" "}
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {s.label}
                  </span>
                  {active && (
                    <p className="mt-0.5 text-[10px] text-gray-600 dark:text-gray-400">
                      {s.desc}
                    </p>
                  )}
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Section 2: Mail service */}
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h4 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">
          2. 메일 서비스
        </h4>

        {/* 3 protocols */}
        <div className="mb-4 grid gap-2 md:grid-cols-3">
          <ProtocolCard
            name="SMTP"
            full="Simple Mail Transfer Protocol"
            role="메일 송신"
            desc="이메일을 전달하는 프로토콜. 메일을 송신할 때 사용."
            tone="red"
          />
          <ProtocolCard
            name="POP3"
            full="Post Office Protocol 3"
            role="메일 수신"
            desc="이메일을 읽을 수 있게 하는 프로토콜. 메일을 전송받을 때 사용."
            tone="blue"
          />
          <ProtocolCard
            name="IMAP"
            full="Internet Mail Access Protocol"
            role="메일 수신"
            desc="메일을 전송받을 때 사용되는 또 하나의 프로토콜. POP3의 비동기성을 보완한 방식."
            tone="emerald"
          />
        </div>

        {/* Mail flow animation */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              메일 서버 동작 플로우
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  if (mStep >= mailPhases.length) setMStep(0);
                  setMPlaying((p) => !p);
                }}
                className="rounded bg-red-500 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-red-600"
              >
                {mPlaying ? "⏸" : "▶"}
              </button>
              <button
                onClick={resetMail}
                className="rounded bg-gray-200 px-2 py-0.5 text-[10px] text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
              >
                ↺
              </button>
            </div>
          </div>

          <div className="relative grid grid-cols-4 items-center gap-2">
            <Node label="송신자" sub="User" tone="gray" active={mStep >= 1} />
            <Node
              label="메일 서버 A"
              sub="knou.ac.kr"
              tone="red"
              active={mStep >= 1}
            />
            <Node
              label="메일 서버 B"
              sub="jj.ac.kr"
              tone="blue"
              active={mStep >= 2}
            />
            <Node label="수신자" sub="User" tone="gray" active={mStep >= 3} />
          </div>

          <div className="mt-2 grid grid-cols-4 gap-2 text-center text-[10px]">
            <div />
            <FlowLabel text="SMTP" active={mStep >= 1} />
            <FlowLabel text="SMTP" active={mStep >= 2} />
            <FlowLabel text="POP3 / IMAP" active={mStep >= 3} />
          </div>

          <AnimatePresence mode="wait">
            {mStep > 0 && (
              <motion.div
                key={mStep}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-3 rounded bg-white p-2 text-[11px] dark:bg-gray-900"
              >
                <span className="font-bold text-red-700 dark:text-red-300">
                  ({mailPhases[mStep - 1].n}){" "}
                  {mailPhases[mStep - 1].label}
                </span>
                <p className="mt-0.5 text-gray-600 dark:text-gray-400">
                  {mailPhases[mStep - 1].desc}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ProtocolCard({
  name,
  full,
  role,
  desc,
  tone,
}: {
  name: string;
  full: string;
  role: string;
  desc: string;
  tone: "red" | "blue" | "emerald";
}) {
  const toneMap = {
    red: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300",
    blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    emerald:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300",
  }[tone];
  return (
    <div className={`rounded-lg border p-3 ${toneMap}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">{name}</span>
        <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold dark:bg-gray-800">
          {role}
        </span>
      </div>
      <div className="mt-0.5 text-[10px] opacity-80">{full}</div>
      <p className="mt-1 text-[11px] text-gray-700 dark:text-gray-300">{desc}</p>
    </div>
  );
}

function Node({
  label,
  sub,
  tone,
  active,
}: {
  label: string;
  sub: string;
  tone: "red" | "blue" | "gray";
  active: boolean;
}) {
  const cls = {
    red: "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-900/30",
    blue: "border-blue-400 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30",
    gray: "border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800",
  }[tone];
  return (
    <motion.div
      animate={{ scale: active ? 1 : 0.95, opacity: active ? 1 : 0.5 }}
      className={`rounded-lg border p-2 text-center ${cls}`}
    >
      <div className="text-[11px] font-bold text-gray-800 dark:text-gray-200">
        {label}
      </div>
      <div className="text-[9px] text-gray-500">{sub}</div>
    </motion.div>
  );
}

function FlowLabel({ text, active }: { text: string; active: boolean }) {
  return (
    <div
      className={`rounded px-1 py-0.5 ${
        active
          ? "bg-red-500 text-white"
          : "bg-transparent text-gray-400"
      }`}
    >
      {active ? "▶ " : ""}
      {text}
    </div>
  );
}
