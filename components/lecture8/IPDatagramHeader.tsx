"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

type FieldKey =
  | "version"
  | "ihl"
  | "tos"
  | "totalLen"
  | "id"
  | "flags"
  | "fragOffset"
  | "ttl"
  | "protocol"
  | "checksum"
  | "srcIp"
  | "dstIp"
  | "options"
  | "padding";

interface Field {
  key: FieldKey;
  label: string;
  bits: number;
  desc: string;
  detail: string;
}

const FIELDS: Field[] = [
  { key: "version", label: "버전", bits: 4, desc: "IP version (IPv4 = 4)", detail: "IP 프로토콜의 버전 번호. IPv4인 경우 값은 4." },
  { key: "ihl", label: "헤더 길이", bits: 4, desc: "20 ~ 60 byte", detail: "4바이트 단위(1 word). 값 5 → 20 byte, 값 15 → 60 byte." },
  { key: "tos", label: "서비스 유형", bits: 8, desc: "QoS (우선순위 3 + TOS 4 + 미사용 1)", detail: "3비트 우선순위 + 4비트 서비스 유형 + 1비트 미사용. 아래에서 TOS 플래그를 선택해 보세요." },
  { key: "totalLen", label: "전체 길이", bits: 16, desc: "데이터그램 전체 길이", detail: "헤더 + 데이터 총 길이 (바이트). 최대 65,535 byte." },
  { key: "id", label: "식별자", bits: 16, desc: "단편화 시 동일 값", detail: "데이터그램이 단편화되었을 때 모든 단편은 동일한 식별자를 공유하여 목적지에서 재조립." },
  { key: "flags", label: "플래그", bits: 3, desc: "미사용(1) + DF(1) + MF(1)", detail: "DF=1: Don't Fragment. MF=1: More Fragment, MF=0: 마지막(또는 유일한) 단편." },
  { key: "fragOffset", label: "단편 오프셋", bits: 13, desc: "원본 내 위치", detail: "각 단편의 데이터가 원본 메시지의 어느 위치에 있었는지 나타냄(8바이트 단위)." },
  { key: "ttl", label: "TTL", bits: 8, desc: "활동 기간", detail: "라우터를 지날 때마다 1씩 감소. 0이 되면 폐기. 보통 양 호스트 사이 라우터 수의 두 배로 설정." },
  { key: "protocol", label: "프로토콜", bits: 8, desc: "상위계층 식별", detail: "1 = ICMP, 6 = TCP, 17 = UDP. 상위계층 프로토콜을 식별." },
  { key: "checksum", label: "헤더 검사합", bits: 16, desc: "헤더만의 검사합", detail: "헤더 부분에만 대한 검사합. 데이터 부분은 포함하지 않음." },
  { key: "srcIp", label: "발신지 IP 주소", bits: 32, desc: "Source IP", detail: "발신지 호스트의 IP 주소(32비트)." },
  { key: "dstIp", label: "목적지 IP 주소", bits: 32, desc: "Destination IP", detail: "목적지 호스트의 IP 주소(32비트)." },
  { key: "options", label: "옵션", bits: 24, desc: "가변 길이", detail: "라우팅 기록, 타임스탬프 등 선택적 옵션." },
  { key: "padding", label: "패딩", bits: 8, desc: "32비트 정렬", detail: "옵션 필드와 함께 헤더가 32비트 경계에 정렬되도록 0으로 채움." },
];

const TOS_CODES = [
  { code: "0000", label: "기본" },
  { code: "0001", label: "비용 최소" },
  { code: "0010", label: "신뢰성 최대" },
  { code: "0100", label: "처리량 최대" },
  { code: "1000", label: "지연 최소" },
];

const PROTOCOLS = [
  { value: 1, name: "ICMP" },
  { value: 6, name: "TCP" },
  { value: 17, name: "UDP" },
];

export default function IPDatagramHeader() {
  const [selected, setSelected] = useState<FieldKey>("ttl");
  const [tos, setTos] = useState("0000");
  const current = FIELDS.find((f) => f.key === selected)!;

  const rowStyle = "grid grid-cols-32 gap-px bg-gray-200 dark:bg-gray-700 rounded overflow-hidden";

  const cell = (key: FieldKey, label: string, cols: number) => {
    const active = selected === key;
    return (
      <button
        key={key + label}
        onClick={() => setSelected(key)}
        style={{ gridColumn: `span ${cols} / span ${cols}` }}
        className={`px-2 py-2 text-[11px] font-medium transition-all ${
          active
            ? "bg-pink-500 text-white ring-2 ring-pink-300 dark:ring-pink-700"
            : "bg-white text-gray-700 hover:bg-pink-50 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-pink-950"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <section>
      <SectionTitle
        title="IP 데이터그램 헤더"
        subtitle="20~60 byte 가변 헤더 · 필드를 클릭하면 설명이 표시됩니다"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        {/* Bit ruler */}
        <div className="mb-2 grid grid-cols-32 gap-px text-[10px] text-gray-400">
          {[0, 4, 8, 16, 19, 24, 31].map((b, i, arr) => {
            const span = i < arr.length - 1 ? arr[i + 1] - b : 1;
            return (
              <div
                key={b}
                style={{ gridColumn: `span ${span} / span ${span}` }}
                className="text-left"
              >
                {b}
              </div>
            );
          })}
        </div>

        {/* Row 1: version | ihl | tos | totalLen */}
        <div className={rowStyle + " mb-1"}>
          {cell("version", "버전 (4)", 4)}
          {cell("ihl", "헤더길이 (4)", 4)}
          {cell("tos", "서비스 유형 (8)", 8)}
          {cell("totalLen", "전체 길이 (16)", 16)}
        </div>
        {/* Row 2: id | flags | fragOffset */}
        <div className={rowStyle + " mb-1"}>
          {cell("id", "식별자 (16)", 16)}
          {cell("flags", "플래그 (3)", 3)}
          {cell("fragOffset", "단편 오프셋 (13)", 13)}
        </div>
        {/* Row 3: ttl | protocol | checksum */}
        <div className={rowStyle + " mb-1"}>
          {cell("ttl", "TTL (8)", 8)}
          {cell("protocol", "프로토콜 (8)", 8)}
          {cell("checksum", "헤더 검사합 (16)", 16)}
        </div>
        {/* Row 4: src */}
        <div className={rowStyle + " mb-1"}>
          {cell("srcIp", "발신지 IP 주소 (32)", 32)}
        </div>
        {/* Row 5: dst */}
        <div className={rowStyle + " mb-1"}>
          {cell("dstIp", "목적지 IP 주소 (32)", 32)}
        </div>
        {/* Row 6: options | padding */}
        <div className={rowStyle + " mb-1"}>
          {cell("options", "옵션 (24)", 24)}
          {cell("padding", "패딩 (8)", 8)}
        </div>
        {/* Data */}
        <div className="mt-2 rounded border border-dashed border-gray-300 bg-gray-50 p-3 text-center text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800">
          데이터 (가변)
        </div>

        {/* Selected field detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="mt-5 rounded-lg bg-pink-50 p-4 dark:bg-pink-950/30"
          >
            <div className="flex items-baseline justify-between">
              <h4 className="text-sm font-bold text-pink-700 dark:text-pink-300">
                {current.label} <span className="text-xs font-normal text-pink-500">({current.bits} bit)</span>
              </h4>
              <span className="text-xs text-pink-500">{current.desc}</span>
            </div>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{current.detail}</p>

            {selected === "tos" && (
              <div className="mt-3 flex flex-wrap gap-2">
                {TOS_CODES.map((t) => (
                  <button
                    key={t.code}
                    onClick={() => setTos(t.code)}
                    className={`rounded-md px-3 py-1.5 text-xs font-mono font-semibold transition ${
                      tos === t.code
                        ? "bg-pink-500 text-white"
                        : "bg-white text-pink-700 hover:bg-pink-100 dark:bg-gray-800 dark:text-pink-300"
                    }`}
                  >
                    {t.code} · {t.label}
                  </button>
                ))}
              </div>
            )}

            {selected === "protocol" && (
              <div className="mt-3 flex flex-wrap gap-2">
                {PROTOCOLS.map((p) => (
                  <span
                    key={p.value}
                    className="rounded-md bg-white px-3 py-1 text-xs font-mono font-semibold text-pink-700 shadow-sm dark:bg-gray-800 dark:text-pink-300"
                  >
                    {p.value} → {p.name}
                  </span>
                ))}
              </div>
            )}

            {selected === "flags" && (
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded bg-white p-2 text-center dark:bg-gray-800">
                  <div className="font-mono font-bold">bit 1</div>
                  <div className="text-gray-500">미사용</div>
                </div>
                <div className="rounded bg-white p-2 text-center dark:bg-gray-800">
                  <div className="font-mono font-bold">bit 2 · DF</div>
                  <div className="text-gray-500">1=Don&apos;t Fragment</div>
                </div>
                <div className="rounded bg-white p-2 text-center dark:bg-gray-800">
                  <div className="font-mono font-bold">bit 3 · MF</div>
                  <div className="text-gray-500">1=More / 0=Last</div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <style jsx>{`
          .grid-cols-32 {
            grid-template-columns: repeat(32, minmax(0, 1fr));
          }
        `}</style>
      </div>
    </section>
  );
}
