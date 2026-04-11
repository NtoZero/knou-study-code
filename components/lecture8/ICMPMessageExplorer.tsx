"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

type Category = "all" | "error" | "query";

interface ICMPMsg {
  type: number;
  name: string;
  category: "error" | "query";
  example: string;
  detail: string;
}

const MESSAGES: ICMPMsg[] = [
  {
    type: 0,
    name: "Echo Reply",
    category: "query",
    example: "ping 응답",
    detail: "ping 명령의 응답. 두 호스트 사이에 통신이 가능한지 확인하기 위한 질의 메시지.",
  },
  {
    type: 3,
    name: "Destination Unreachable",
    category: "error",
    example: "목적지 도달 불가",
    detail: "라우터가 데이터그램을 최종 목적지에 전달할 수 없을 때 발신지에 보고.",
  },
  {
    type: 4,
    name: "Source Quench",
    category: "error",
    example: "발신지 억제",
    detail: "데이터그램이 라우터/호스트의 처리능력을 초과하여 포화상태일 때 발신자에게 감속 요청.",
  },
  {
    type: 5,
    name: "Redirect",
    category: "error",
    example: "재지정",
    detail: "다른 라우터를 통해 보다 좋은 경로로 IP 패킷을 전달하도록 호스트에 알림.",
  },
  {
    type: 8,
    name: "Echo Request",
    category: "query",
    example: "ping 요청",
    detail: "ping 명령. 두 호스트 사이에 통신이 가능한지 확인하기 위한 질의 메시지.",
  },
  {
    type: 11,
    name: "Time Exceeded",
    category: "error",
    example: "TTL = 0 폐기",
    detail: "TTL 필드 값이 0으로 감소되어 데이터그램이 폐기되었음을 발신지에 보고. traceroute가 활용.",
  },
  {
    type: 12,
    name: "Parameter Problem",
    category: "error",
    example: "헤더 필드 오류",
    detail: "IP 헤더 필드의 값에 문제가 있을 때 발신지에 보고.",
  },
  {
    type: 13,
    name: "Timestamp Request",
    category: "query",
    example: "시간 측정",
    detail: "두 시스템 간에 IP 데이터그램이 오가는 데 필요한 시간 결정.",
  },
  {
    type: 14,
    name: "Timestamp Reply",
    category: "query",
    example: "시간 응답",
    detail: "Timestamp Request 에 대한 응답.",
  },
  {
    type: 15,
    name: "Information Request",
    category: "query",
    example: "정보 요청",
    detail: "호스트가 네트워크 정보 요청 (현재는 거의 사용되지 않음).",
  },
  {
    type: 16,
    name: "Information Reply",
    category: "query",
    example: "정보 응답",
    detail: "Information Request 에 대한 응답.",
  },
  {
    type: 17,
    name: "Address Mask Request",
    category: "query",
    example: "서브넷 마스크 요청",
    detail: "호스트가 라우터에 서브넷 마스크를 요청.",
  },
  {
    type: 18,
    name: "Address Mask Reply",
    category: "query",
    example: "서브넷 마스크 응답",
    detail: "Address Mask Request 에 대한 응답.",
  },
];

export default function ICMPMessageExplorer() {
  const [cat, setCat] = useState<Category>("all");
  const [selected, setSelected] = useState<number>(8);

  const filtered = useMemo(
    () => (cat === "all" ? MESSAGES : MESSAGES.filter((m) => m.category === cat)),
    [cat]
  );

  const current = MESSAGES.find((m) => m.type === selected)!;

  return (
    <section>
      <SectionTitle
        title="ICMP 메시지 탐색"
        subtitle="인터넷 계층 오류·제어 메시지 프로토콜"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        {/* ICMP Header format */}
        <div className="mb-5">
          <div className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
            ICMP 메시지 형식
          </div>
          <div className="grid grid-cols-32 gap-px overflow-hidden rounded bg-gray-200 text-[11px] dark:bg-gray-700">
            <div className="col-span-8 bg-pink-100 px-2 py-2 text-center font-semibold text-pink-800 dark:bg-pink-900/60 dark:text-pink-200">
              유형 (8)
            </div>
            <div className="col-span-8 bg-pink-100 px-2 py-2 text-center font-semibold text-pink-800 dark:bg-pink-900/60 dark:text-pink-200">
              코드 (8)
            </div>
            <div className="col-span-16 bg-pink-100 px-2 py-2 text-center font-semibold text-pink-800 dark:bg-pink-900/60 dark:text-pink-200">
              검사합 (16)
            </div>
            <div className="col-span-32 bg-white px-2 py-2 text-center text-gray-600 dark:bg-gray-900 dark:text-gray-300">
              ICMP 메시지
            </div>
            <div className="col-span-32 bg-white px-2 py-2 text-center text-gray-500 dark:bg-gray-900 dark:text-gray-400">
              옵션 데이터
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-4 flex gap-2">
          {(["all", "error", "query"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                cat === c
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-pink-100 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {c === "all" ? "전체 13종" : c === "error" ? "오류 보고 (4)" : "질의 (4+)"}
            </button>
          ))}
        </div>

        {/* Message grid */}
        <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-3">
          {filtered.map((m) => (
            <button
              key={m.type}
              onClick={() => setSelected(m.type)}
              className={`rounded-md border p-2 text-left text-xs transition ${
                selected === m.type
                  ? "border-pink-500 bg-pink-500 text-white"
                  : m.category === "error"
                  ? "border-red-200 bg-red-50 hover:border-red-400 dark:border-red-900 dark:bg-red-950/30"
                  : "border-blue-200 bg-blue-50 hover:border-blue-400 dark:border-blue-900 dark:bg-blue-950/30"
              }`}
            >
              <div className="font-mono font-bold">type {m.type}</div>
              <div className="truncate">{m.name}</div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.type}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="rounded-lg bg-pink-50 p-4 dark:bg-pink-950/30"
          >
            <div className="flex items-baseline justify-between">
              <h4 className="text-sm font-bold text-pink-700 dark:text-pink-300">
                type {current.type} · {current.name}
              </h4>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                  current.category === "error"
                    ? "bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                    : "bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                }`}
              >
                {current.category === "error" ? "오류 보고" : "질의"}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-700 dark:text-gray-300">{current.detail}</p>
            <p className="mt-2 text-xs font-semibold text-pink-600">사용 예: {current.example}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 grid gap-2 text-xs md:grid-cols-2">
          <div className="rounded bg-red-50 p-3 dark:bg-red-950/30">
            <div className="font-bold text-red-700 dark:text-red-300">오류 보고 메시지</div>
            <div className="mt-1 text-gray-600 dark:text-gray-400">
              ICMP는 오류를 수정하지 않고 <strong>단지 보고만</strong> 수행. IP 주소를 이용해 발신지에 전송.
            </div>
            <div className="mt-1 text-gray-500">Destination Unreachable / Source Quench / Time Exceeded / Redirect / Parameter Problem</div>
          </div>
          <div className="rounded bg-blue-50 p-3 dark:bg-blue-950/30">
            <div className="font-bold text-blue-700 dark:text-blue-300">질의 메시지</div>
            <div className="mt-1 text-gray-600 dark:text-gray-400">
              일부 네트워크의 문제를 진단.
            </div>
            <div className="mt-1 text-gray-500">Echo / Address Mask / Timestamp / Router</div>
          </div>
        </div>

        <style jsx>{`
          .grid-cols-32 {
            grid-template-columns: repeat(32, minmax(0, 1fr));
          }
        `}</style>
      </div>
    </section>
  );
}
