"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

interface DoraStep {
  key: string;
  label: string;
  direction: "c2s" | "s2c";
  cast: "broadcast" | "unicast";
  summary: string;
  fields: { k: string; v: string }[];
}

const STEPS: DoraStep[] = [
  {
    key: "discover",
    label: "(1) DHCPDISCOVER",
    direction: "c2s",
    cast: "broadcast",
    summary: "클라이언트가 'DHCP 서버 있습니까?' 를 브로드캐스트",
    fields: [
      { k: "클라이언트 IP", v: "0.0.0.0" },
      { k: "사용 IP 주소", v: "255.255.255.255 (broadcast)" },
      { k: "사용 Ethernet 주소", v: "FFFFFFFFFFFF (broadcast)" },
      { k: "트랜잭션 ID", v: "14321" },
    ],
  },
  {
    key: "offer",
    label: "(2) DHCPOFFER",
    direction: "s2c",
    cast: "broadcast",
    summary: "서버가 '210.22.31.100을 2일간 사용하세요' 제안",
    fields: [
      { k: "서버 Ethernet", v: "00BB00000000 / IP 210.22.31.100" },
      { k: "제안 메시지", v: "'210.22.31.100을 2일간 사용할 수 있다'" },
      { k: "사용 Ethernet 주소", v: "00CC00000000 (directed)" },
      { k: "트랜잭션 ID", v: "14321" },
    ],
  },
  {
    key: "request",
    label: "(3) DHCPREQUEST",
    direction: "c2s",
    cast: "broadcast",
    summary: "클라이언트가 '210.22.31.100 사용할까요?' 를 브로드캐스트",
    fields: [
      { k: "요청 메시지", v: "'210.22.31.100 사용 가능?'" },
      { k: "사용 IP 주소", v: "255.255.255.255 (broadcast)" },
      { k: "사용 Ethernet 주소", v: "FFFFFFFFFFFF (broadcast)" },
      { k: "트랜잭션 ID", v: "18923" },
    ],
  },
  {
    key: "ack",
    label: "(4) DHCPACK",
    direction: "s2c",
    cast: "unicast",
    summary: "서버 '좋습니다. 서브넷 마스크, DNS, WINS, 노드 유형, 도메인 이름도 가지고 가세요'",
    fields: [
      { k: "확인 메시지", v: "'서브넷 마스크/DNS/WINS/도메인 이름 포함 ACK'" },
      { k: "사용 IP 주소", v: "255.255.255.255 (broadcast)" },
      { k: "사용 Ethernet 주소", v: "FFFFFFFFFFFF (directed)" },
      { k: "트랜잭션 ID", v: "18923" },
    ],
  },
];

const ADMIN_METHODS = [
  {
    key: "host",
    name: "Host Table",
    pros: "중앙집중 관리, 구조 단순",
    cons: "급속한 증가·변화 대응 어려움, 평면 구조로 중복 정보",
  },
  {
    key: "dns",
    name: "DNS",
    pros: "계층적·분산 관리",
    cons: "분산 관리 복잡, 수작업 데이터 오류 가능성",
  },
  {
    key: "bootp",
    name: "BOOTP",
    pros: "동적 IP 할당, 디스크 없는 호스트 지원",
    cons: "IP 주소 재사용 불가, 정적 매핑에 가까움",
  },
  {
    key: "dhcp",
    name: "DHCP",
    pros: "동적 할당 + 임대 기반 IP 재사용, BOOTP 메시지 포맷과 호환",
    cons: "DHCP 서버/중계 에이전트 필요",
  },
];

const DHCP_MSG_STRUCT = [
  { label: "Op/HW유형/HW길이/홉", bytes: 4 },
  { label: "트랜잭션 ID", bytes: 4 },
  { label: "경과시간/미사용", bytes: 4 },
  { label: "클라이언트 IP", bytes: 4 },
  { label: "상대방 IP", bytes: 4 },
  { label: "서버 IP", bytes: 4 },
  { label: "게이트웨이 IP", bytes: 4 },
  { label: "클라이언트 HW 주소", bytes: 16 },
  { label: "서버 이름", bytes: 64 },
  { label: "부트 파일명", bytes: 128 },
  { label: "옵션", bytes: 64 },
];

export default function DHCPSimulator() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [tab, setTab] = useState("dhcp");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!playing) return;
    timerRef.current = setTimeout(() => {
      setStep((s) => {
        if (s + 1 >= STEPS.length) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 1800);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, step]);

  const current = STEPS[step];
  const fromLeft = current.direction === "c2s";

  return (
    <section>
      <SectionTitle
        title="DHCP 시뮬레이션 (DORA 4단계)"
        subtitle="Discover → Offer → Request → Ack · 동적 IP 할당"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        {/* Flow diagram */}
        <div className="relative mb-5 h-44 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          {/* Client */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-pink-500 text-xs font-bold text-white">
              Client
            </div>
            <div className="mt-1 text-[10px] text-gray-500">0.0.0.0</div>
          </div>
          {/* Server */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500 text-xs font-bold text-white">
              Server
            </div>
            <div className="mt-1 text-[10px] text-gray-500">210.22.31.100</div>
          </div>
          {/* Line */}
          <div className="absolute inset-x-24 top-1/2 h-0.5 -translate-y-1/2 bg-gray-300 dark:bg-gray-700" />

          {/* Packet */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: fromLeft ? 0 : 320, opacity: 0, y: "-50%" }}
              animate={{ x: fromLeft ? 320 : 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "linear" }}
              className="absolute left-24 top-1/2 rounded-md bg-pink-600 px-2 py-1 text-[10px] font-bold text-white shadow-lg"
            >
              {current.label.replace(/^\(\d\) /, "")}
              <div className="mt-0.5 text-[9px] font-normal opacity-80">{current.cast}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mb-4 flex gap-2">
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
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={step === STEPS.length - 1}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold disabled:opacity-40 dark:bg-gray-800"
          >
            다음 →
          </button>
          <button
            onClick={() => {
              setStep(0);
              setPlaying(false);
            }}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold dark:bg-gray-800"
          >
            초기화
          </button>
        </div>

        {/* Step indicator */}
        <div className="mb-4 flex gap-1">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setStep(i)}
              className={`flex-1 rounded px-1 py-1 text-[10px] font-semibold transition ${
                i === step
                  ? "bg-pink-500 text-white"
                  : i < step
                  ? "bg-pink-200 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-800"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Step detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="mb-5 rounded-lg bg-pink-50 p-4 dark:bg-pink-950/30"
          >
            <div className="text-sm font-bold text-pink-700 dark:text-pink-300">{current.label}</div>
            <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">{current.summary}</p>
            <div className="mt-2 grid gap-1 text-[11px] text-gray-600 dark:text-gray-400">
              {current.fields.map((f) => (
                <div key={f.k} className="flex gap-2">
                  <span className="w-32 shrink-0 font-mono text-pink-600">{f.k}</span>
                  <span>{f.v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tabs for admin methods / msg struct */}
        <div className="mb-3 flex gap-2">
          {[
            { k: "dhcp", label: "IP 주소 관리 비교" },
            { k: "msg", label: "DHCP 메시지 구조 (300 byte)" },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                tab === t.k
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-pink-100 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "dhcp" && (
          <div className="grid gap-2 md:grid-cols-2">
            {ADMIN_METHODS.map((m) => (
              <div
                key={m.key}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs dark:border-gray-700 dark:bg-gray-800/50"
              >
                <div className="font-bold text-pink-700 dark:text-pink-300">{m.name}</div>
                <div className="mt-1 text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-emerald-600">장점</span>: {m.pros}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-red-600">단점</span>: {m.cons}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "msg" && (
          <div>
            <div className="space-y-1">
              {DHCP_MSG_STRUCT.map((f) => (
                <div key={f.label} className="flex items-center gap-2">
                  <div className="w-44 shrink-0 text-[11px] text-gray-600 dark:text-gray-400">
                    {f.label}
                  </div>
                  <div
                    className="flex h-5 items-center justify-end rounded bg-pink-400 pr-2 text-[10px] font-semibold text-white dark:bg-pink-600"
                    style={{ width: `${(f.bytes / 128) * 80 + 6}%` }}
                  >
                    {f.bytes} B
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-right text-[11px] font-bold text-pink-700 dark:text-pink-300">
              합계 = 300 byte (BOOTP와 동일 포맷)
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
