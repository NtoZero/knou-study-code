"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

type Transport = "ALL" | "TCP" | "UDP";

interface Protocol {
  name: string;
  fullName: string;
  port: string;
  transport: "TCP" | "UDP";
  usage: string;
  detail: string;
}

const protocols: Protocol[] = [
  {
    name: "HTTP",
    fullName: "Hyper Text Transfer Protocol",
    port: "80",
    transport: "TCP",
    usage: "웹 사이트 접속",
    detail:
      "클라이언트가 사이트 정보를 요청하면 서버가 응답하는 방식. HTML 문서를 전송하며 응답에 MIME 정보를 포함.",
  },
  {
    name: "HTTPS",
    fullName: "HTTP over Secure Socket Layer",
    port: "443",
    transport: "TCP",
    usage: "보안 웹 접속",
    detail:
      "HTTP의 보안이 강화된 버전. SSL/TLS 프로토콜을 통해 세션 데이터를 암호화. 대칭키 + 공개키 동시 사용.",
  },
  {
    name: "FTP",
    fullName: "File Transfer Protocol",
    port: "21 / 20",
    transport: "TCP",
    usage: "파일 전송",
    detail:
      "TCP/IP를 통해 파일을 전송하기 위한 프로토콜. 21번(제어), 20번(데이터) 포트 사용. 능동/수동 모드 지원.",
  },
  {
    name: "TELNET",
    fullName: "Teletype Network",
    port: "23",
    transport: "TCP",
    usage: "원격 접속(가상 단말)",
    detail:
      "원격지 컴퓨터를 이용하는 가상 단말 기능을 실현. NVT(Network Virtual Terminal)로 서로 다른 시스템 간 통신 지원.",
  },
  {
    name: "SMTP",
    fullName: "Simple Mail Transfer Protocol",
    port: "25",
    transport: "TCP",
    usage: "메일 송신",
    detail: "이메일을 전달하는 프로토콜. 메일을 송신할 때 사용.",
  },
  {
    name: "POP3",
    fullName: "Post Office Protocol 3",
    port: "110",
    transport: "TCP",
    usage: "메일 수신",
    detail:
      "이메일을 읽을 수 있게 하는 프로토콜. 메일을 전송받을 때 사용.",
  },
  {
    name: "IMAP",
    fullName: "Internet Mail Access Protocol",
    port: "143",
    transport: "TCP",
    usage: "메일 수신(비동기성 보완)",
    detail:
      "메일을 전송받을 때 사용되는 또 하나의 프로토콜. POP3의 비동기성을 보완한 방식.",
  },
  {
    name: "DHCP",
    fullName: "Dynamic Host Configuration Protocol",
    port: "67 / 68",
    transport: "UDP",
    usage: "IP 주소 동적 할당",
    detail: "UDP 기반으로 호스트에 IP 주소 등 네트워크 설정을 자동 할당.",
  },
  {
    name: "SNMP",
    fullName: "Simple Network Management Protocol",
    port: "161",
    transport: "UDP",
    usage: "네트워크 관리",
    detail: "UDP 기반으로 네트워크 장비를 원격 감시·관리하기 위한 프로토콜.",
  },
];

export default function ApplicationProtocolMap() {
  const [filter, setFilter] = useState<Transport>("ALL");
  const [selected, setSelected] = useState<Protocol | null>(protocols[0]);

  const filtered = protocols.filter(
    (p) => filter === "ALL" || p.transport === filter
  );

  return (
    <section>
      <SectionTitle
        title="응용 계층 프로토콜 지도"
        subtitle="클라이언트-서버 모델과 주요 프로토콜·포트 번호 한눈에 보기"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        {/* Client-Server diagram */}
        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-900/20">
            <div className="text-xs font-semibold text-red-600 dark:text-red-300">
              클라이언트 (Client)
            </div>
            <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              웹 브라우저 · FTP 클라이언트 · 메일 프로그램
            </div>
            <div className="mt-1 text-[11px] text-gray-500">서비스 요청</div>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-center text-xs text-gray-500">
              <div>요청 ▶</div>
              <div>◀ 응답</div>
            </div>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-900/20">
            <div className="text-xs font-semibold text-red-600 dark:text-red-300">
              서버 (Server)
            </div>
            <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              웹 서버 · FTP 서버 · 메일 서버
            </div>
            <div className="mt-1 text-[11px] text-gray-500">서비스 제공</div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-4 flex flex-wrap gap-2">
          {(["ALL", "TCP", "UDP"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === t
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-red-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-red-900/20"
              }`}
            >
              {t === "ALL" ? "전체" : `${t} 기반`}
            </button>
          ))}
          <div className="ml-auto text-[11px] text-gray-500">
            TCP: FTP · HTTP · TELNET · SMTP · POP3 · IMAP &nbsp; / &nbsp; UDP: DHCP · SNMP
          </div>
        </div>

        {/* Protocol cards */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => {
            const active = selected?.name === p.name;
            return (
              <motion.button
                key={p.name}
                layout
                onClick={() => setSelected(p)}
                whileHover={{ y: -2 }}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  active
                    ? "border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-900/30"
                    : "border-gray-200 bg-white hover:border-red-300 dark:border-gray-700 dark:bg-gray-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    {p.name}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                      p.transport === "TCP"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                    }`}
                  >
                    {p.transport}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-gray-500">
                  포트 {p.port}
                </div>
                <div className="mt-1 text-[11px] text-gray-600 dark:text-gray-400">
                  {p.usage}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm dark:border-red-800 dark:bg-red-900/20"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-bold text-red-700 dark:text-red-300">
                  {selected.name}
                </span>
                <span className="text-xs text-gray-500">
                  {selected.fullName}
                </span>
                <span className="ml-auto rounded bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  포트 {selected.port} · {selected.transport}
                </span>
              </div>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {selected.detail}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
