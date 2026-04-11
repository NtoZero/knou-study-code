"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

const udpFields = [
  { name: "UDP 발신지 포트", bits: 16, desc: "발신지 프로세스 포트 번호" },
  { name: "UDP 목적지 포트", bits: 16, desc: "목적지 프로세스 포트 번호" },
  { name: "UDP 전체 길이", bits: 16, desc: "데이터그램 전체 길이 (헤더 + 데이터)" },
  { name: "UDP 검사합", bits: 16, desc: "데이터그램 전체의 오류 검사용" },
];

const pseudoFields = [
  { name: "발신지 IP 주소", bits: 32, desc: "IP 헤더에서 얻음" },
  { name: "목적지 IP 주소", bits: 32, desc: "IP 헤더에서 얻음" },
  { name: "0 (padding)", bits: 8, desc: "0으로 패딩" },
  { name: "프로토콜 = 17", bits: 8, desc: "UDP를 나타내는 값" },
  { name: "UDP 길이", bits: 16, desc: "UDP 데이터그램 길이" },
];

const wellKnownPorts = [
  { port: 7, service: "echo", desc: "UDP 데이터그램을 에코함" },
  { port: 9, service: "discard", desc: "수신한 UDP 데이터그램을 버림" },
  { port: 11, service: "systat", desc: "활동중인 사용자 정보 반환" },
  { port: 13, service: "daytime", desc: "날짜 및 시간 반환" },
  { port: 15, service: "netstat", desc: "시스템 인터페이스 정보 반환" },
  { port: 53, service: "nameserver", desc: "DNS 네임 서버" },
  { port: 67, service: "bootps", desc: "Bootstrap 프로토콜 서버" },
  { port: 68, service: "bootpc", desc: "Bootstrap 프로토콜 클라이언트" },
  { port: 69, service: "tftp", desc: "TFTP 서버" },
];

export default function UDPDatagramHeader() {
  const [showPseudo, setShowPseudo] = useState(false);
  const [checksumStep, setChecksumStep] = useState(0);
  const [hoveredField, setHoveredField] = useState<number | null>(null);

  const checksumSteps = [
    "1. 수신자는 검사합 필드를 '0'으로 저장",
    "2. 가짜 헤더(12 bytes) 준비 — IP 주소 확인",
    "3. UDP 헤더(8 bytes)와 데이터 결합",
    "4. 16비트 배수가 되도록 '0' 패딩",
    "5. 전체에 대해 검사합 재계산",
    "6. 가짜 헤더 & 패딩은 실제로 전송되지 않음",
  ];

  return (
    <section>
      <SectionTitle
        title="UDP 데이터그램 & 가짜 헤더"
        subtitle="process-to-process 통신, 8 bytes 고정 헤더"
      />

      <div className="space-y-6">
        {/* UDP 헤더 시각화 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold">UDP 데이터그램 형식</h3>
            <button
              onClick={() => setShowPseudo((p) => !p)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                showPseudo
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              {showPseudo ? "가짜 헤더 숨기기" : "가짜 헤더 보기 (12 bytes)"}
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
            {/* 비트 눈금 */}
            <div className="flex bg-gray-100 text-[10px] text-gray-500 dark:bg-gray-800">
              <span className="flex-1 border-r border-gray-300 py-1 text-center dark:border-gray-600">
                0
              </span>
              <span className="flex-1 border-r border-gray-300 py-1 text-center dark:border-gray-600">
                16
              </span>
              <span className="flex-1 py-1 text-center">31</span>
            </div>

            <AnimatePresence>
              {showPseudo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-amber-50 dark:bg-amber-950/20"
                >
                  <div className="px-2 py-1 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                    ◀ 가짜 헤더 (Pseudo Header, 12 bytes) — 실제 전송 X
                  </div>
                  {pseudoFields.map((f, i) => (
                    <div
                      key={i}
                      className="flex border-t border-amber-200 dark:border-amber-800"
                      style={{
                        paddingLeft: 0,
                      }}
                    >
                      <div
                        className="flex items-center justify-center border-r border-amber-200 py-2 text-center text-xs dark:border-amber-800"
                        style={{ flex: f.bits }}
                      >
                        <span>
                          <strong>{f.name}</strong>
                          <br />
                          <span className="text-[10px] text-gray-500">
                            ({f.bits} bits)
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* UDP 헤더 */}
            <div className="bg-yellow-50 dark:bg-yellow-950/20">
              <div className="px-2 py-1 text-[10px] font-bold text-yellow-700 dark:text-yellow-300">
                ◀ UDP 헤더 (8 bytes)
              </div>
              {/* 첫 줄: 발신지/목적지 포트 */}
              <div className="flex border-t border-yellow-200 dark:border-yellow-800">
                {udpFields.slice(0, 2).map((f, i) => (
                  <div
                    key={i}
                    onMouseEnter={() => setHoveredField(i)}
                    onMouseLeave={() => setHoveredField(null)}
                    className={`flex-1 cursor-pointer border-r border-yellow-200 py-3 text-center text-xs transition hover:bg-yellow-100 dark:border-yellow-800 dark:hover:bg-yellow-900/40 ${
                      hoveredField === i ? "bg-yellow-100 dark:bg-yellow-900/40" : ""
                    }`}
                  >
                    <strong>{f.name}</strong>
                    <br />
                    <span className="text-[10px] text-gray-500">({f.bits} bits)</span>
                  </div>
                ))}
              </div>
              {/* 둘째 줄: 길이/검사합 */}
              <div className="flex border-t border-yellow-200 dark:border-yellow-800">
                {udpFields.slice(2).map((f, i) => (
                  <div
                    key={i + 2}
                    onMouseEnter={() => setHoveredField(i + 2)}
                    onMouseLeave={() => setHoveredField(null)}
                    className={`flex-1 cursor-pointer border-r border-yellow-200 py-3 text-center text-xs transition hover:bg-yellow-100 dark:border-yellow-800 dark:hover:bg-yellow-900/40 ${
                      hoveredField === i + 2 ? "bg-yellow-100 dark:bg-yellow-900/40" : ""
                    }`}
                  >
                    <strong>{f.name}</strong>
                    <br />
                    <span className="text-[10px] text-gray-500">({f.bits} bits)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 데이터 */}
            <div className="border-t border-gray-300 bg-gray-50 py-4 text-center text-xs text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
              데이터 (가변 길이)
            </div>
          </div>

          {hoveredField !== null && (
            <div className="mt-3 rounded-lg bg-yellow-100 p-3 text-xs dark:bg-yellow-900/30">
              <strong>{udpFields[hoveredField].name}:</strong>{" "}
              {udpFields[hoveredField].desc}
            </div>
          )}
        </div>

        {/* 검사합 계산 과정 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-1 font-bold">UDP 검사합 계산 과정</h3>
          <p className="mb-3 text-xs text-gray-500">
            UDP 데이터그램이 정확히 목적지에 도착했는지 <strong>2중 인증</strong> (IP 주소 + 오류검증)
          </p>
          <div className="space-y-2">
            {checksumSteps.map((s, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: i <= checksumStep ? 1 : 0.3,
                  x: i <= checksumStep ? 0 : -10,
                }}
                className={`rounded-lg px-3 py-2 text-sm ${
                  i <= checksumStep
                    ? "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                }`}
              >
                {s}
              </motion.div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setChecksumStep((s) => Math.min(s + 1, checksumSteps.length - 1))}
              className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm text-white hover:bg-amber-700"
            >
              다음 단계 ▶
            </button>
            <button
              onClick={() => setChecksumStep(0)}
              className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm dark:bg-gray-700"
            >
              초기화
            </button>
          </div>
        </div>

        {/* Process-to-process vs host-to-host */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-4 dark:bg-yellow-950/20">
            <h4 className="font-bold text-yellow-700 dark:text-yellow-300">
              UDP: process-to-process
            </h4>
            <p className="mt-2 text-xs">
              <strong>socket address = IP address + port number</strong>
            </p>
            <ul className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              <li>• IP 주소 → 호스트 선택</li>
              <li>• 포트 번호 → 프로세스 선택</li>
            </ul>
          </div>
          <div className="rounded-xl border-l-4 border-gray-400 bg-gray-50 p-4 dark:bg-gray-800">
            <h4 className="font-bold text-gray-700 dark:text-gray-300">IP: host-to-host</h4>
            <p className="mt-2 text-xs">호스트 간 통신만 가능.</p>
            <p className="mt-1 text-xs text-gray-500">포트 개념 없음 → 어느 프로세스인지 구별 X</p>
          </div>
        </div>

        {/* Well-known Ports 표 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-3 font-bold">UDP Well-known Ports</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 text-left">포트</th>
                  <th className="py-2 text-left">서비스</th>
                  <th className="py-2 text-left">설명</th>
                </tr>
              </thead>
              <tbody>
                {wellKnownPorts.map((p) => (
                  <tr
                    key={p.port}
                    className="border-b border-gray-100 hover:bg-yellow-50 dark:border-gray-800 dark:hover:bg-yellow-950/20"
                  >
                    <td className="py-1.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                      {p.port}
                    </td>
                    <td className="py-1.5 font-medium">{p.service}</td>
                    <td className="py-1.5 text-xs text-gray-600 dark:text-gray-400">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            서버 프로세스는 <strong>well-known 포트</strong>, 클라이언트 프로세스는{" "}
            <strong>임시(ephemeral) 포트</strong>를 사용.
          </p>
        </div>
      </div>
    </section>
  );
}
