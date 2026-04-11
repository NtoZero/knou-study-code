"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

interface DoDLayer {
  key: string;
  name: string;
  eng: string;
  osiCover: string;
  desc: string;
  protocols: { name: string; desc: string }[];
  color: string;
}

const dodLayers: DoDLayer[] = [
  {
    key: "app",
    name: "프로세스·응용 계층",
    eng: "Process/Application",
    osiCover: "OSI 응용 + 표현 + 세션",
    desc: "응용 프로세스를 위한 프로토콜. 하위 전송 방식에 따라 TCP, UDP, IP 직접, ICMP 직접 이용 프로그램으로 구분.",
    protocols: [
      { name: "FTP", desc: "TCP 이용 — File Transfer Protocol (파일 전송)" },
      { name: "SMTP", desc: "TCP 이용 — Simple Mail Transfer Protocol (전자우편 전송)" },
      { name: "Telnet", desc: "TCP 이용 — 원격 접속" },
      { name: "TFTP", desc: "UDP 이용 — Trivial FTP (간이 파일 전송)" },
      { name: "DNS", desc: "UDP 이용 — Domain Name System (도메인↔IP 변환)" },
      { name: "BOOTP", desc: "UDP 이용 — Bootstrap Protocol" },
      { name: "traceroute", desc: "IP 직접 이용 — 경로 추적 프로그램" },
      { name: "ping", desc: "ICMP 직접 이용 — 도달성 확인 프로그램" },
    ],
    color: "bg-red-500",
  },
  {
    key: "transport",
    name: "전송 계층",
    eng: "Transport",
    osiCover: "OSI 전송",
    desc: "호스트 컴퓨터 사이의 데이터 전송 서비스 제공.",
    protocols: [
      { name: "TCP", desc: "Transmission Control Protocol — 연결형, 신뢰성 있는 전송" },
      { name: "UDP", desc: "User Datagram Protocol — 비연결형, 빠른 전송" },
    ],
    color: "bg-green-500",
  },
  {
    key: "internet",
    name: "인터넷 계층",
    eng: "Internet",
    osiCover: "OSI 네트워크",
    desc: "네트워크 상에서 패킷의 이동(라우팅)을 처리.",
    protocols: [
      { name: "IP", desc: "Internet Protocol — 패킷 주소지정 및 라우팅" },
      { name: "ICMP", desc: "Internet Control Message Protocol — 오류·제어 메시지" },
      { name: "IGMP", desc: "Internet Group Management Protocol — 멀티캐스트 그룹 관리" },
    ],
    color: "bg-teal-500",
  },
  {
    key: "link",
    name: "데이터링크 계층",
    eng: "Data Link / Network Interface",
    osiCover: "OSI 데이터링크 + 물리",
    desc: "네트워크 인터페이스 역할. device driver와 interface card로 데이터 통신 처리.",
    protocols: [
      { name: "ARP", desc: "Address Resolution Protocol — IP 주소 → 물리(MAC) 주소 변환" },
      { name: "RARP", desc: "Reverse ARP — 물리 주소 → IP 주소 변환" },
      { name: "Ethernet", desc: "대표적 LAN 프레이밍" },
      { name: "Token Ring", desc: "IBM 토큰 링 LAN" },
      { name: "ATM", desc: "Asynchronous Transfer Mode" },
    ],
    color: "bg-blue-500",
  },
];

const timeline = [
  {
    year: "1970s",
    label: "Robert Kahn & Vinton Cerf가 TCP/IP 개발 시작 (DoD ARPA 주도)",
  },
  { year: "1982", label: "미군 컴퓨터 네트워킹의 표준으로 TCP/IP 제정" },
  { year: "1983", label: "ARPANET 전면 TCP/IP 전환 (Flag Day)" },
  { year: "~현재", label: "인터넷의 사실상(de facto) 표준으로 자리매김" },
];

const osiToDod = [
  { osi: "응용", dod: "프로세스·응용", num: 7 },
  { osi: "표현", dod: "프로세스·응용", num: 6 },
  { osi: "세션", dod: "프로세스·응용", num: 5 },
  { osi: "전송", dod: "전송", num: 4 },
  { osi: "네트워크", dod: "인터넷", num: 3 },
  { osi: "데이터링크", dod: "데이터링크", num: 2 },
  { osi: "물리", dod: "데이터링크", num: 1 },
];

export default function TCPIPStackExplorer() {
  const [selected, setSelected] = useState<string>("transport");
  const current = dodLayers.find((l) => l.key === selected)!;

  return (
    <section>
      <SectionTitle
        title="TCP/IP 4계층 (DoD / DARPA 모델)"
        subtitle="미국 국방부 ARPA 주도로 개발되어 인터넷 표준이 된 4계층 모델. 각 계층을 클릭하여 대표 프로토콜을 확인하세요."
      />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* DoD stack */}
        <div className="space-y-2">
          {dodLayers.map((l) => {
            const isSel = selected === l.key;
            return (
              <button
                key={l.key}
                onClick={() => setSelected(l.key)}
                className={`w-full rounded-xl border p-4 text-left transition-all ${
                  isSel
                    ? "border-lime-500 shadow-md"
                    : "border-gray-200 hover:border-lime-300 dark:border-gray-700"
                } bg-white dark:bg-gray-900`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-2 rounded-full ${l.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-gray-100">
                        {l.name}
                      </span>
                      <span className="text-xs text-gray-400">({l.eng})</span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-gray-500">{l.osiCover}</div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {l.protocols.length} protocols
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* OSI-DoD mapping */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 text-xs font-semibold text-gray-700 dark:text-gray-300">
            OSI ↔ DoD 매핑
          </div>
          <div className="space-y-1">
            {osiToDod.map((r, i) => {
              const layer = dodLayers.find(
                (l) =>
                  (r.dod === "프로세스·응용" && l.key === "app") ||
                  (r.dod === "전송" && l.key === "transport") ||
                  (r.dod === "인터넷" && l.key === "internet") ||
                  (r.dod === "데이터링크" && l.key === "link"),
              );
              const isHighlighted = layer?.key === selected;
              return (
                <div
                  key={i}
                  className={`grid grid-cols-[auto_1fr_auto_1fr] items-center gap-2 rounded px-2 py-1 text-xs transition-colors ${
                    isHighlighted ? "bg-lime-100 dark:bg-lime-950/40" : ""
                  }`}
                >
                  <span className="w-5 text-center text-[10px] font-bold text-gray-400">
                    {r.num}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{r.osi}</span>
                  <span className="text-gray-400">→</span>
                  <span
                    className={`font-medium ${
                      isHighlighted ? "text-lime-700 dark:text-lime-300" : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {r.dod}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
            <div className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
              TCP/IP 역사
            </div>
            <ol className="space-y-1.5">
              {timeline.map((t, i) => (
                <li key={i} className="flex gap-2 text-[11px]">
                  <span className="w-12 shrink-0 font-mono font-semibold text-lime-600 dark:text-lime-400">
                    {t.year}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">{t.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Protocols detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mt-5 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="mb-2 flex items-center gap-2">
            <div className={`h-3 w-3 rounded ${current.color}`} />
            <span className="font-bold text-gray-900 dark:text-gray-100">{current.name}</span>
            <span className="text-xs text-gray-500">{current.eng}</span>
          </div>
          <p className="mb-4 text-xs text-gray-600 dark:text-gray-400">{current.desc}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {current.protocols.map((p) => (
              <div
                key={p.name}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="font-mono font-bold text-lime-700 dark:text-lime-400">
                  {p.name}
                </div>
                <div className="mt-0.5 text-gray-600 dark:text-gray-400">{p.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* TCP/IP 4 features */}
      <div className="mt-5 grid gap-2 md:grid-cols-2">
        {[
          { title: "연결형/비연결형 서비스", desc: "TCP=연결형(신뢰성), UDP=비연결형(빠름)" },
          { title: "패킷 교환", desc: "메시지를 패킷 단위로 분할 전송" },
          { title: "동적 경로 할당", desc: "네트워크 상황에 따라 경로 동적 결정" },
          {
            title: "공통 응용 프로그램 제공",
            desc: "CASE(Common Application Service Element): 응용에 무관하게 개방 시스템 접속 방법 제공",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="rounded-lg border border-lime-200 bg-lime-50/50 p-3 text-xs dark:border-lime-900 dark:bg-lime-950/20"
          >
            <div className="font-semibold text-lime-700 dark:text-lime-300">
              ① ~ ④ {f.title}
            </div>
            <div className="mt-0.5 text-gray-600 dark:text-gray-400">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
