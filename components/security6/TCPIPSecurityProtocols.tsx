"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ShieldCheck, Lock, Network, Wifi } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface Protocol {
  name: string;
  desc: string;
}

interface LayerData {
  id: string;
  num: number;
  label: string;
  en: string;
  icon: React.ReactNode;
  color: string;
  bgLight: string;
  border: string;
  textColor: string;
  protocols: Protocol[];
  detail?: React.ReactNode;
}

const layers: LayerData[] = [
  {
    id: "app",
    num: 4,
    label: "응용 계층",
    en: "Application Layer",
    icon: <ShieldCheck size={18} />,
    color: "bg-purple-600",
    bgLight: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-400",
    textColor: "text-purple-700 dark:text-purple-300",
    protocols: [
      { name: "SSH (Secure Shell)", desc: "원격 로그인 및 명령 실행을 암호화하여 안전하게 수행. Telnet의 보안 대안." },
      { name: "PGP (Pretty Good Privacy)", desc: "이메일 암호화 및 디지털서명. 웹 신뢰 모델(Web of Trust) 사용." },
      { name: "S/MIME", desc: "MIME 기반 이메일 보안 표준. 암호화 및 디지털서명 제공." },
      { name: "Kerberos", desc: "티켓 기반 네트워크 인증 프로토콜. 분산 환경에서 단일 로그인(SSO) 지원." },
    ],
  },
  {
    id: "trans",
    num: 3,
    label: "전송 계층",
    en: "Transport Layer",
    icon: <Lock size={18} />,
    color: "bg-violet-600",
    bgLight: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-400",
    textColor: "text-violet-700 dark:text-violet-300",
    protocols: [
      { name: "SSL (Secure Sockets Layer)", desc: "넷스케이프가 개발한 소켓 기반 암호화 프로토콜. 현재는 TLS로 대체됨." },
      { name: "TLS (Transport Layer Security)", desc: "SSL의 표준화 버전. HTTPS, FTPS, SMTPS 등에서 널리 사용." },
    ],
    detail: (
      <div className="mt-4 space-y-3">
        {/* Handshake Protocol vs Record Protocol */}
        <div className="rounded-xl border border-violet-200 dark:border-violet-800 overflow-hidden">
          <div className="bg-violet-50 dark:bg-violet-900/30 px-4 py-2">
            <span className="text-xs font-bold text-violet-700 dark:text-violet-300">SSL/TLS 핵심 하위 프로토콜</span>
          </div>
          <div className="grid gap-0 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-violet-100 dark:divide-violet-800">
            {[
              {
                proto: "Handshake Protocol",
                ko: "핸드셰이크 프로토콜",
                items: [
                  "서버·클라이언트 상호 인증",
                  "암호화 알고리즘(Cipher Suite) 협상",
                  "공개키로 세션 키(대칭키) 교환",
                  "SSL/TLS 세션 수립",
                ],
              },
              {
                proto: "Record Protocol",
                ko: "레코드 프로토콜",
                items: [
                  "실제 데이터(애플리케이션 메시지) 처리",
                  "데이터 분할·압축·MAC 생성",
                  "협상된 대칭키로 암호화",
                  "데이터 기밀성·무결성 보장",
                ],
              },
            ].map((p) => (
              <div key={p.proto} className="bg-white dark:bg-gray-900 p-4">
                <div className="mb-1 text-xs font-bold text-violet-700 dark:text-violet-300">{p.proto}</div>
                <div className="mb-2 text-xs text-gray-400">{p.ko}</div>
                <ul className="space-y-1">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "net",
    num: 2,
    label: "네트워크 계층",
    en: "Network Layer",
    icon: <Network size={18} />,
    color: "bg-indigo-600",
    bgLight: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-400",
    textColor: "text-indigo-700 dark:text-indigo-300",
    protocols: [
      { name: "IPsec (AH)", desc: "Authentication Header — 인증과 무결성 제공. IP 헤더를 포함한 전체 패킷 인증." },
      { name: "IPsec (ESP)", desc: "Encapsulating Security Payload — 인증·무결성·기밀성(암호화) 모두 제공." },
    ],
    detail: (
      <IPsecDetail />
    ),
  },
  {
    id: "link",
    num: 1,
    label: "링크 계층",
    en: "Link Layer",
    icon: <Wifi size={18} />,
    color: "bg-sky-600",
    bgLight: "bg-sky-50 dark:bg-sky-900/20",
    border: "border-sky-400",
    textColor: "text-sky-700 dark:text-sky-300",
    protocols: [
      { name: "WEP (Wired Equivalent Privacy)", desc: "초기 무선LAN 보안 표준. RC4 암호화 사용. 현재는 심각한 취약점으로 사용 금지." },
      { name: "WPA/WPA2/WPA3", desc: "WEP의 취약점을 보완한 무선LAN 보안 표준. WPA3이 현재 최신 표준." },
    ],
  },
];

function IPsecDetail() {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowComparison((p) => !p)}
        className="flex items-center gap-2 rounded-lg bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300"
      >
        IPsec AH vs ESP 상세 비교
        <motion.span animate={{ rotate: showComparison ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} />
        </motion.span>
      </button>

      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 overflow-x-auto rounded-xl border border-indigo-200 dark:border-indigo-800">
              <table className="w-full min-w-[400px] text-xs">
                <thead>
                  <tr className="bg-indigo-50 dark:bg-indigo-900/30">
                    <th className="p-3 text-left font-semibold text-gray-500">구분</th>
                    <th className="p-3 text-center font-semibold text-indigo-700 dark:text-indigo-300">
                      AH (Authentication Header)
                    </th>
                    <th className="p-3 text-center font-semibold text-indigo-700 dark:text-indigo-300">
                      ESP (Encapsulating Security Payload)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "인증", ah: "O", esp: "O" },
                    { label: "무결성", ah: "O", esp: "O" },
                    { label: "기밀성 (암호화)", ah: "X", esp: "O" },
                    { label: "IP 헤더 포함 인증", ah: "O", esp: "X (페이로드만)" },
                    { label: "프로토콜 번호", ah: "51", esp: "50" },
                  ].map((row) => (
                    <tr
                      key={row.label}
                      className="border-t border-indigo-100 dark:border-indigo-800"
                    >
                      <td className="p-3 font-medium text-gray-600 dark:text-gray-400">
                        {row.label}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`font-bold ${
                            row.ah === "O"
                              ? "text-green-600 dark:text-green-400"
                              : row.ah === "X"
                              ? "text-red-500 dark:text-red-400"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {row.ah}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`font-bold ${
                            row.esp === "O"
                              ? "text-green-600 dark:text-green-400"
                              : row.esp === "X"
                              ? "text-red-500 dark:text-red-400"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {row.esp}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              <strong>핵심 차이:</strong> AH는 암호화(기밀성)를 제공하지 않음. ESP는 인증+무결성+기밀성을 모두 제공하며, 실무에서 더 널리 사용됨.
            </div>

            {/* 전송 모드 vs 터널 모드 */}
            <div className="mt-3 rounded-xl border border-indigo-200 dark:border-indigo-800 overflow-hidden">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">IPsec 운용 모드 — 전송 모드 vs 터널 모드</span>
              </div>
              <div className="grid gap-0 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-indigo-100 dark:divide-indigo-800">
                {[
                  {
                    mode: "전송 모드",
                    en: "Transport Mode",
                    desc: "IP 페이로드(데이터)만 보호. 원본 IP 헤더 유지. 종단간(end-to-end) 통신에 사용.",
                    use: "호스트 ↔ 호스트 직접 통신",
                    point: "IP 헤더는 보호되지 않으므로 출발지·목적지 노출",
                    bad: false,
                  },
                  {
                    mode: "터널 모드",
                    en: "Tunnel Mode",
                    desc: "원본 IP 패킷 전체를 새 IP 헤더로 감싸서 보호. VPN 게이트웨이 간 통신에 사용.",
                    use: "VPN 게이트웨이 ↔ 게이트웨이",
                    point: "내부 IP 헤더까지 보호 — 더 강력한 보안",
                    bad: false,
                  },
                ].map((m) => (
                  <div key={m.mode} className="bg-white dark:bg-gray-900 p-4">
                    <div className="mb-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">{m.mode} <span className="font-normal text-gray-400">({m.en})</span></div>
                    <p className="mb-2 text-xs text-gray-600 dark:text-gray-400">{m.desc}</p>
                    <div className="text-xs"><span className="font-semibold text-gray-500">사용 환경: </span>{m.use}</div>
                    <div className="mt-1 text-xs text-gray-500">{m.point}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TCPIPSecurityProtocols() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  const toggle = (id: string) => {
    setActiveLayer((prev) => (prev === id ? null : id));
  };

  return (
    <section>
      <SectionTitle
        title="TCP/IP 계층별 보안 프로토콜"
        subtitle="응용·전송·네트워크·링크 계층별 주요 보안 프로토콜 — 클릭하여 상세 확인"
      />

      {/* 계층 스택 */}
      <div className="space-y-3">
        {layers.map((layer) => {
          const isOpen = activeLayer === layer.id;
          return (
            <div
              key={layer.id}
              className={`rounded-xl border-2 overflow-hidden transition-all ${
                isOpen ? layer.border : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <button
                onClick={() => toggle(layer.id)}
                className={`flex w-full items-center justify-between p-4 text-left transition-colors ${
                  isOpen ? layer.bgLight : "bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${layer.color} text-white`}
                  >
                    {layer.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800 dark:text-gray-100">
                        {layer.label}
                      </span>
                      <span className="text-xs text-gray-400">{layer.en}</span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap gap-1">
                      {layer.protocols.map((p) => (
                        <span
                          key={p.name}
                          className={`rounded px-1.5 py-0.5 text-xs font-medium ${layer.bgLight} ${layer.textColor}`}
                        >
                          {p.name.split(" ")[0]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={18} className="shrink-0 text-gray-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                      <div className="space-y-3">
                        {layer.protocols.map((proto) => (
                          <div
                            key={proto.name}
                            className={`rounded-lg border ${layer.border} ${layer.bgLight} p-3`}
                          >
                            <div className={`text-sm font-bold ${layer.textColor}`}>
                              {proto.name}
                            </div>
                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                              {proto.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                      {layer.detail}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 전체 비교 요약 */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full min-w-[500px] text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <th className="p-3 text-left font-semibold text-gray-500">계층</th>
              <th className="p-3 text-left font-semibold text-gray-500">보안 프로토콜</th>
              <th className="p-3 text-left font-semibold text-gray-500">주요 목적</th>
            </tr>
          </thead>
          <tbody>
            {[
              { layer: "응용 계층", protos: "SSH, PGP, S/MIME, Kerberos", purpose: "응용별 보안 (이메일·원격접속·인증)" },
              { layer: "전송 계층", protos: "SSL/TLS", purpose: "소켓 기반 암호화 통신 (HTTPS 등)" },
              { layer: "네트워크 계층", protos: "IPsec (AH, ESP)", purpose: "IP 패킷 보안 (인증·무결성·기밀성)" },
              { layer: "링크 계층", protos: "WEP, WPA/WPA2/WPA3", purpose: "무선 링크 보안" },
            ].map((row, i) => (
              <tr
                key={i}
                className="border-t border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
              >
                <td className="p-3 font-medium text-gray-700 dark:text-gray-300">{row.layer}</td>
                <td className="p-3 font-mono text-purple-600 dark:text-purple-400">{row.protos}</td>
                <td className="p-3 text-gray-500">{row.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
