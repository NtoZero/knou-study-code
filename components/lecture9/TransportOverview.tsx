"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

type CompareKey = "speed" | "reliability" | "conn" | "overhead" | "usage";

const compareRows: { key: CompareKey; label: string; udp: string; tcp: string }[] = [
  { key: "speed", label: "전송 속도", udp: "빠름 (오버헤드 없음)", tcp: "느림 (제어 오버헤드)" },
  { key: "reliability", label: "신뢰성", udp: "비신뢰성 — 응용에서 처리", tcp: "신뢰성 — TCP가 보장" },
  { key: "conn", label: "연결 방식", udp: "비연결형 (connectionless)", tcp: "연결형 (connection-oriented)" },
  { key: "overhead", label: "헤더 크기", udp: "8 bytes (고정)", tcp: "20~60 bytes" },
  { key: "usage", label: "사용 사례", udp: "DNS, TFTP, 스트리밍, VoIP", tcp: "HTTP, FTP, SMTP, Telnet" },
];

export default function TransportOverview() {
  const [mode, setMode] = useState<"connection" | "connectionless">("connection");
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState<Record<CompareKey, boolean>>({
    speed: false,
    reliability: false,
    conn: false,
    overhead: false,
    usage: false,
  });

  const maxStep = mode === "connection" ? 5 : 1;
  const next = () => setStep((s) => Math.min(s + 1, maxStep));
  const reset = () => setStep(0);

  const connSteps = [
    "① A → B : 보내도 되나요? (연결 요청)",
    "② B → A : 네, 보내세요. (연결 수락)",
    "③ A → B : 데이터를 보냅니다.",
    "④ B → A : 받았습니다. (확인 응답)",
    "⑤ A → B : 확인했습니다. (연결 해제)",
  ];

  return (
    <section>
      <SectionTitle
        title="전송 계층 개요"
        subtitle="end-to-end 신뢰성 제공: 오류 복구 + 흐름제어"
      />

      <div className="space-y-6">
        {/* 정의 카드 */}
        <div className="rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-5 dark:bg-yellow-950/30">
          <h3 className="font-bold text-yellow-700 dark:text-yellow-300">
            전송 계층(Transport Layer)이란?
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>
              • <strong>시스템 종단(end-to-end)</strong>에서 <strong>투명한 데이터</strong>를 양방향으로 전달
            </li>
            <li>
              • <strong>네트워크 계층</strong>은 신뢰성을 보장하지 <strong>않음</strong> → 전송 계층이 <strong>재전송</strong>으로 신뢰성 제공
            </li>
            <li>
              • 주요 기능: <strong>오류 복구</strong>, <strong>흐름제어</strong>
            </li>
            <li>
              • 대표 프로토콜: <span className="font-mono text-amber-700 dark:text-amber-300">UDP</span>,{" "}
              <span className="font-mono text-amber-700 dark:text-amber-300">TCP</span>
            </li>
          </ul>
        </div>

        {/* UDP vs TCP 토글 표 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-3 font-bold">UDP vs TCP 비교</h3>
          <p className="mb-3 text-xs text-gray-500">행을 클릭하여 상세를 토글하세요.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 text-left">항목</th>
                  <th className="py-2 text-left text-amber-600 dark:text-amber-400">UDP</th>
                  <th className="py-2 text-left text-yellow-700 dark:text-yellow-300">TCP</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((r) => (
                  <tr
                    key={r.key}
                    onClick={() => setOpen((o) => ({ ...o, [r.key]: !o[r.key] }))}
                    className="cursor-pointer border-b border-gray-100 transition hover:bg-yellow-50 dark:border-gray-800 dark:hover:bg-yellow-950/30"
                  >
                    <td className="py-2 font-medium">{r.label}</td>
                    <td className="py-2">
                      {open[r.key] ? r.udp : <span className="text-gray-400">클릭</span>}
                    </td>
                    <td className="py-2">
                      {open[r.key] ? r.tcp : <span className="text-gray-400">클릭</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 연결형 vs 비연결형 시각화 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-3 font-bold">연결형 vs 비연결형 통신</h3>

          <div className="mb-4 flex gap-2">
            <button
              onClick={() => {
                setMode("connection");
                setStep(0);
              }}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                mode === "connection"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              연결형 (TCP)
            </button>
            <button
              onClick={() => {
                setMode("connectionless");
                setStep(0);
              }}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                mode === "connectionless"
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              비연결형 (UDP)
            </button>
          </div>

          <div className="relative mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div className="mb-3 flex justify-between text-sm font-bold">
              <span className="text-yellow-700 dark:text-yellow-300">A (송신)</span>
              <span className="text-yellow-700 dark:text-yellow-300">B (수신)</span>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {mode === "connection"
                  ? connSteps.slice(0, step).map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`rounded px-3 py-1 text-xs ${
                          i < 2
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                            : i < 4
                              ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
                        }`}
                      >
                        {s}
                      </motion.div>
                    ))
                  : step > 0 && (
                      <motion.div
                        key="udp"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded bg-amber-100 px-3 py-1 text-xs text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                      >
                        A → B : 데이터를 보냅니다. (즉시 전송, 확인 없음)
                      </motion.div>
                    )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={next}
              disabled={step >= maxStep}
              className="rounded-lg bg-yellow-500 px-3 py-1.5 text-sm text-white hover:bg-yellow-600 disabled:opacity-40"
            >
              다음 단계 ▶
            </button>
            <button
              onClick={reset}
              className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm dark:bg-gray-700"
            >
              초기화
            </button>
            <span className="flex items-center text-xs text-gray-500">
              Step {step} / {maxStep}
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-yellow-50 p-3 text-xs dark:bg-yellow-950/30">
              <strong className="text-yellow-700 dark:text-yellow-300">연결형 (TCP):</strong>{" "}
              연결 설정 → 데이터 전송 → 연결 해제의 3단계.
            </div>
            <div className="rounded-lg bg-amber-50 p-3 text-xs dark:bg-amber-950/30">
              <strong className="text-amber-700 dark:text-amber-300">비연결형 (UDP):</strong>{" "}
              별도 설정 없이 바로 전송. 오버헤드 없음.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
