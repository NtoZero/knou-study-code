"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

interface TCPField {
  id: number;
  name: string;
  size: string;
  bits: number;
  desc: string;
}

const tcpFields: TCPField[] = [
  { id: 1, name: "발신지 포트", size: "2 bytes", bits: 16, desc: "발신지 TCP 사용자 프로세스 식별" },
  { id: 2, name: "목적지 포트", size: "2 bytes", bits: 16, desc: "목적지 TCP 사용자 프로세스 식별" },
  {
    id: 3,
    name: "순서 번호 (Sequence Number)",
    size: "4 bytes",
    bits: 32,
    desc: "데이터 필드의 첫 번째 데이터 바이트의 순서 번호",
  },
  {
    id: 4,
    name: "응답 번호 (ACK Number)",
    size: "4 bytes",
    bits: 32,
    desc: "바로 다음에 받기를 기대하는 순서 번호. 예: 순서번호 x 수신 시 ACK = x+1",
  },
  {
    id: 5,
    name: "헤더 길이 (HLEN)",
    size: "4 bits",
    bits: 4,
    desc: "4바이트 단위로 표시. 값 범위 5~15 (20 bytes ~ 60 bytes)",
  },
  { id: 6, name: "예약 (Reserved)", size: "6 bits", bits: 6, desc: "예약 필드" },
  { id: 7, name: "제어 플래그 (Flag bits)", size: "6 bits", bits: 6, desc: "URG/ACK/PSH/RST/SYN/FIN 6개 플래그" },
  {
    id: 8,
    name: "윈도우 크기",
    size: "2 bytes",
    bits: 16,
    desc: "흐름제어를 위한 윈도우 크기. 최대 2^16 = 65,535 bytes",
  },
  { id: 9, name: "검사합 (Checksum)", size: "2 bytes", bits: 16, desc: "오류제어를 위한 검사합" },
  {
    id: 10,
    name: "긴급 포인터 (Urgent Pointer)",
    size: "2 bytes",
    bits: 16,
    desc: "URG=1일 때 유효. 긴급 데이터 마지막 바이트 = 긴급포인터 + 순서번호",
  },
  { id: 11, name: "옵션 (Option)", size: "0 ~ 40 bytes", bits: 0, desc: "MSS, 윈도우 크기 증가값, timestamp 등" },
];

const flagInfo = [
  { key: "URG", name: "Urgent", desc: "긴급 포인터 필드가 유효함을 표시" },
  { key: "ACK", name: "Acknowledgement", desc: "응답번호가 유효함을 표시" },
  { key: "PSH", name: "Push", desc: "가능한 빨리 현재 세그먼트를 상위 계층에 전달" },
  { key: "RST", name: "Reset", desc: "연결을 재설정(reset)함" },
  { key: "SYN", name: "Synchronize", desc: "연결을 초기화하기 위해 순서번호를 동기화" },
  { key: "FIN", name: "Finish", desc: "연결을 해제하기 위한 마지막 데이터임을 표시" },
];

export default function TCPSegmentHeader() {
  const [selected, setSelected] = useState<number | null>(3);
  const [flags, setFlags] = useState<Record<string, boolean>>({
    URG: false,
    ACK: false,
    PSH: false,
    RST: false,
    SYN: true,
    FIN: false,
  });

  const toggleFlag = (k: string) => setFlags((f) => ({ ...f, [k]: !f[k] }));

  const selectedField = tcpFields.find((f) => f.id === selected);

  return (
    <section>
      <SectionTitle
        title="TCP 세그먼트 헤더"
        subtitle="20~60 bytes — 11개 필드 + 6개 제어 플래그"
      />

      <div className="space-y-6">
        {/* 헤더 그리드 시각화 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <p className="mb-3 text-xs text-gray-500">필드를 클릭하여 상세 설명을 확인하세요.</p>

          <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
            {/* bit ruler */}
            <div className="flex bg-gray-100 text-[10px] text-gray-500 dark:bg-gray-800">
              <span className="flex-1 border-r border-gray-300 py-1 text-center dark:border-gray-600">0</span>
              <span className="flex-1 py-1 text-center">31</span>
            </div>

            {/* Row 1 */}
            <div className="flex border-t border-gray-200 dark:border-gray-700">
              {[1, 2].map((id) => {
                const f = tcpFields.find((x) => x.id === id)!;
                return (
                  <button
                    key={id}
                    onClick={() => setSelected(id)}
                    className={`flex-1 border-r border-gray-200 py-3 text-center text-xs dark:border-gray-700 ${
                      selected === id
                        ? "bg-yellow-500 text-white"
                        : "bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-950/20 dark:hover:bg-yellow-900/40"
                    }`}
                  >
                    {f.name}
                    <br />
                    <span className="text-[10px] opacity-70">(16 bits)</span>
                  </button>
                );
              })}
            </div>
            {/* Row 2: seq */}
            <button
              onClick={() => setSelected(3)}
              className={`block w-full border-t border-gray-200 py-3 text-center text-xs dark:border-gray-700 ${
                selected === 3
                  ? "bg-yellow-500 text-white"
                  : "bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-900/40"
              }`}
            >
              순서 번호 (Sequence Number) <br />
              <span className="text-[10px] opacity-70">(32 bits)</span>
            </button>
            {/* Row 3: ack */}
            <button
              onClick={() => setSelected(4)}
              className={`block w-full border-t border-gray-200 py-3 text-center text-xs dark:border-gray-700 ${
                selected === 4
                  ? "bg-yellow-500 text-white"
                  : "bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-900/40"
              }`}
            >
              응답 번호 (ACK Number) <br />
              <span className="text-[10px] opacity-70">(32 bits)</span>
            </button>
            {/* Row 4: hlen | reserved | flags | window */}
            <div className="flex border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSelected(5)}
                className={`border-r border-gray-200 py-3 text-center text-[10px] dark:border-gray-700 ${
                  selected === 5
                    ? "bg-yellow-500 text-white"
                    : "bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-950/20"
                }`}
                style={{ flex: 4 }}
              >
                HLEN
                <br />
                <span className="opacity-70">(4b)</span>
              </button>
              <button
                onClick={() => setSelected(6)}
                className={`border-r border-gray-200 py-3 text-center text-[10px] dark:border-gray-700 ${
                  selected === 6
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800"
                }`}
                style={{ flex: 6 }}
              >
                예약
                <br />
                <span className="opacity-70">(6b)</span>
              </button>
              <button
                onClick={() => setSelected(7)}
                className={`border-r border-gray-200 py-3 text-center text-[10px] dark:border-gray-700 ${
                  selected === 7
                    ? "bg-yellow-500 text-white"
                    : "bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/60"
                }`}
                style={{ flex: 6 }}
              >
                플래그
                <br />
                <span className="opacity-70">(6b)</span>
              </button>
              <button
                onClick={() => setSelected(8)}
                className={`py-3 text-center text-[10px] ${
                  selected === 8
                    ? "bg-yellow-500 text-white"
                    : "bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-950/20"
                }`}
                style={{ flex: 16 }}
              >
                윈도우 크기
                <br />
                <span className="opacity-70">(16b)</span>
              </button>
            </div>
            {/* Row 5: checksum | urgent */}
            <div className="flex border-t border-gray-200 dark:border-gray-700">
              {[9, 10].map((id) => {
                const f = tcpFields.find((x) => x.id === id)!;
                return (
                  <button
                    key={id}
                    onClick={() => setSelected(id)}
                    className={`flex-1 border-r border-gray-200 py-3 text-center text-xs dark:border-gray-700 ${
                      selected === id
                        ? "bg-yellow-500 text-white"
                        : "bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-950/20"
                    }`}
                  >
                    {f.name}
                    <br />
                    <span className="text-[10px] opacity-70">(16 bits)</span>
                  </button>
                );
              })}
            </div>
            {/* Row 6: option */}
            <button
              onClick={() => setSelected(11)}
              className={`block w-full border-t border-gray-200 py-3 text-center text-xs dark:border-gray-700 ${
                selected === 11
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800"
              }`}
            >
              옵션 (0 ~ 40 bytes)
            </button>
            {/* data */}
            <div className="border-t border-gray-300 bg-gray-100 py-4 text-center text-xs text-gray-500 dark:border-gray-600 dark:bg-gray-800">
              데이터 (가변)
            </div>
          </div>

          {/* Selected field detail */}
          {selectedField && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-lg bg-yellow-100 p-4 dark:bg-yellow-900/30"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-yellow-900 dark:text-yellow-200">
                  ({selectedField.id}) {selectedField.name}
                </h4>
                <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {selectedField.size}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-700 dark:text-gray-300">{selectedField.desc}</p>
              {selectedField.bits > 0 && (
                <p className="mt-1 font-mono text-[10px] text-yellow-700 dark:text-yellow-300">
                  크기 계산: {selectedField.bits} bits = {(selectedField.bits / 8).toFixed(2)} bytes
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* 6개 플래그 토글 */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-1 font-bold">제어 플래그 (Flag Bits, 6 bits)</h3>
          <p className="mb-3 text-xs text-gray-500">플래그를 클릭하여 켜고 끄며 현재 상태를 확인하세요.</p>

          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {flagInfo.map((f) => (
              <button
                key={f.key}
                onClick={() => toggleFlag(f.key)}
                className={`rounded-lg border-2 p-3 text-left transition ${
                  flags[f.key]
                    ? "border-yellow-500 bg-yellow-500 text-white"
                    : "border-gray-300 bg-gray-50 hover:border-yellow-400 dark:border-gray-700 dark:bg-gray-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold">{f.key}</span>
                  <span className="text-xs">{flags[f.key] ? "1" : "0"}</span>
                </div>
                <div className="mt-0.5 text-[10px] opacity-80">{f.name}</div>
              </button>
            ))}
          </div>

          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <div className="mb-2 font-mono text-xs text-gray-500">
              현재 플래그: {flagInfo.map((f) => `${f.key}=${flags[f.key] ? 1 : 0}`).join(" ")}
            </div>
            <div className="space-y-1 text-xs">
              {flagInfo
                .filter((f) => flags[f.key])
                .map((f) => (
                  <div
                    key={f.key}
                    className="rounded bg-yellow-100 px-2 py-1 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-200"
                  >
                    <strong>{f.key}:</strong> {f.desc}
                  </div>
                ))}
              {Object.values(flags).every((v) => !v) && (
                <div className="text-gray-400">모든 플래그가 비활성</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
