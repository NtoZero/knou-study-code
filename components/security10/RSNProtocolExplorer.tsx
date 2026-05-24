"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lock, Key, Network, Layers, ArrowRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface RSNComponent {
  id: string;
  name: string;
  full: string;
  icon: React.ReactNode;
  role: string;
  detail: string;
  items: string[];
  color: string;
  bgLight: string;
  border: string;
  textColor: string;
}

const RSN_COMPONENTS: RSNComponent[] = [
  {
    id: "tkip",
    name: "TKIP",
    full: "Temporal Key Integrity Protocol",
    icon: <Key size={18} />,
    role: "RC4 기반 개선 암호화 (과도기)",
    detail:
      "WEP의 정적 키 문제를 해결하기 위해 RC4 위에 키 믹싱(Key Mixing)과 시퀀스 번호(TSC)를 추가한 프로토콜. 256비트 임시 키를 사용하며, 기밀성용 128비트 + 송신 MIC 64비트 + 수신 MIC 64비트로 구성됨. WEP 하드웨어에서 소프트웨어 업그레이드만으로 적용 가능. WPA2가 의무화된 이후 레거시로 분류됨.",
    items: ["RC4 스트림 암호 기반", "256비트 임시 키 = 기밀성 128비트 + MIC 64비트(송신) + MIC 64비트(수신)", "키 믹싱(Key Mixing) 적용", "64비트 MIC(Michael) 무결성 코드 — 양방향 독립 키", "WEP 하드웨어 재활용 가능"],
    color: "bg-amber-500",
    bgLight: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-400",
    textColor: "text-amber-700 dark:text-amber-300",
  },
  {
    id: "ccmp",
    name: "CCMP",
    full: "Counter Mode with CBC-MAC Protocol",
    icon: <Lock size={18} />,
    role: "AES 기반 강력 암호화 (RSN 필수)",
    detail:
      "AES(Advanced Encryption Standard) 블록 암호를 사용하는 RSN의 필수(mandatory) 암호화 프로토콜. CCM 모드로 기밀성(Counter Mode)과 무결성(CBC-MAC)을 동시에 제공. WPA2/WPA3의 핵심.",
    items: ["AES-128 블록 암호 기반", "CCM 모드: 기밀성 + 무결성 동시 제공", "128비트 세션 키", "48비트 패킷 번호(PN) — 재전송 공격 방어", "RSN의 의무(mandatory) 요소"],
    color: "bg-pink-600",
    bgLight: "bg-pink-50 dark:bg-pink-900/20",
    border: "border-pink-500",
    textColor: "text-pink-700 dark:text-pink-300",
  },
  {
    id: "8021x",
    name: "802.1X",
    full: "IEEE 802.1X — Port-Based NAC",
    icon: <Network size={18} />,
    role: "포트 기반 네트워크 접근제어",
    detail:
      "유선·무선 네트워크의 포트 수준에서 인증되지 않은 클라이언트의 접근을 차단하는 프레임워크. 클라이언트(Supplicant), 인증자(Authenticator, AP), 인증 서버(RADIUS) 3자 구조로 동작.",
    items: ["클라이언트(Supplicant) — AP — RADIUS 서버 3자 구조", "인증 전 포트 차단, 인증 성공 시 개방", "EAP 메시지를 캡슐화하여 전달", "기업 무선망의 표준 인증 방식", "RADIUS 서버로 중앙 집중 인증 관리"],
    color: "bg-blue-600",
    bgLight: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-400",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  {
    id: "eap",
    name: "EAP",
    full: "Extensible Authentication Protocol",
    icon: <Layers size={18} />,
    role: "확장 가능한 인증 프레임워크",
    detail:
      "다양한 인증 방식을 지원하는 확장 가능한 인증 프로토콜 프레임워크. 802.1X와 함께 사용되며 EAP-TLS(인증서), PEAP(암호+인증서), EAP-TTLS 등 다양한 구체적 방법을 지원.",
    items: ["EAP-TLS: 클라이언트·서버 상호 인증서 기반", "PEAP: TLS 터널 내 사용자명/비밀번호", "EAP-TTLS: PEAP와 유사, 더 유연", "802.1X의 EAP over LAN(EAPOL) 방식 전달", "가장 유연하고 확장 가능한 인증 방식"],
    color: "bg-teal-600",
    bgLight: "bg-teal-50 dark:bg-teal-900/20",
    border: "border-teal-400",
    textColor: "text-teal-700 dark:text-teal-300",
  },
];

const AUTH_FLOW_STEPS = [
  { label: "클라이언트", sub: "(Supplicant)", pos: "left" },
  { label: "AP", sub: "(Authenticator)", pos: "center" },
  { label: "RADIUS 서버", sub: "(Auth Server)", pos: "right" },
];

const AUTH_MESSAGES = [
  { from: 0, to: 1, msg: "1. EAP-Request (Association)", dir: "→" },
  { from: 1, to: 2, msg: "2. RADIUS Access-Request", dir: "→" },
  { from: 2, to: 1, msg: "3. RADIUS Access-Challenge", dir: "←" },
  { from: 1, to: 0, msg: "4. EAP-Request (Challenge)", dir: "←" },
  { from: 0, to: 1, msg: "5. EAP-Response (Credentials)", dir: "→" },
  { from: 1, to: 2, msg: "6. RADIUS Access-Request", dir: "→" },
  { from: 2, to: 1, msg: "7. RADIUS Access-Accept + 세션 키", dir: "←" },
  { from: 1, to: 0, msg: "8. EAP-Success + 포트 개방", dir: "←" },
];

export default function RSNProtocolExplorer() {
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [showFlow, setShowFlow] = useState(false);
  const [flowStep, setFlowStep] = useState(0);

  return (
    <section>
      <SectionTitle
        title="RSN 구성요소 탐색기"
        subtitle="Robust Security Network (IEEE 802.11i) — TKIP · CCMP · 802.1X · EAP"
      />

      {/* Component grid */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {RSN_COMPONENTS.map((c) => (
          <div key={c.id} className={`rounded-xl border-2 ${c.border} ${c.bgLight} overflow-hidden`}>
            <button
              className="w-full p-4 text-left"
              onClick={() => setOpenCard(openCard === c.id ? null : c.id)}
            >
              <div className={`mb-2 flex items-center gap-2 ${c.textColor}`}>
                {c.icon}
                <span className="text-lg font-bold">{c.name}</span>
              </div>
              <div className="mb-1 text-xs text-gray-500 leading-snug">{c.full}</div>
              <div className={`text-xs font-medium ${c.textColor}`}>{c.role}</div>
              <ChevronDown
                size={14}
                className={`mt-2 ${c.textColor} transition-transform ${openCard === c.id ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {openCard === c.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className={`border-t ${c.border} px-4 pb-4 pt-3`}>
                    <p className="mb-3 text-xs leading-relaxed text-gray-700 dark:text-gray-300">{c.detail}</p>
                    <ul className="space-y-1">
                      {c.items.map((item) => (
                        <li key={item} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                          <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${c.color}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* TKIP vs CCMP comparison */}
      <div className="mb-8">
        <h3 className="mb-3 text-base font-bold text-gray-800 dark:text-gray-100">
          TKIP vs CCMP 비교
        </h3>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">항목</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                  TKIP
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-pink-600 dark:text-pink-400 uppercase">
                  CCMP
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "기반 알고리즘", tkip: "RC4 (스트림)", ccmp: "AES-128 (블록)" },
                { label: "기밀성", tkip: "RC4 Counter Mode", ccmp: "AES Counter Mode (CTR)" },
                { label: "무결성", tkip: "Michael MIC (64비트)", ccmp: "CBC-MAC (128비트)" },
                { label: "보안 강도", tkip: "중간 (레거시)", ccmp: "강함 (현재 표준)" },
                { label: "RSN 필수 여부", tkip: "선택(optional)", ccmp: "필수(mandatory)" },
                { label: "하드웨어 요구", tkip: "WEP 호환 가능", ccmp: "AES 전용 하드웨어 필요" },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50 dark:bg-gray-800/50"}>
                  <td className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-400">{row.label}</td>
                  <td className="px-4 py-2.5 text-center text-xs text-amber-700 dark:text-amber-300">{row.tkip}</td>
                  <td className="px-4 py-2.5 text-center text-xs text-pink-700 dark:text-pink-300 font-medium">{row.ccmp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 802.1X Auth Flow */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
            802.1X 인증 흐름 다이어그램
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowFlow(true); setFlowStep(0); }}
              className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
            >
              처음부터
            </button>
            {showFlow && flowStep < AUTH_MESSAGES.length - 1 && (
              <button
                onClick={() => setFlowStep(s => s + 1)}
                className="rounded-full bg-pink-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-pink-700"
              >
                다음 단계
              </button>
            )}
          </div>
        </div>

        {/* 3 party diagram */}
        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 p-4">
          {/* Headers */}
          <div className="mb-4 grid grid-cols-3 gap-2 text-center">
            {AUTH_FLOW_STEPS.map((s) => (
              <div key={s.label} className="rounded-lg bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 px-2 py-2">
                <div className="text-xs font-bold text-blue-700 dark:text-blue-300">{s.label}</div>
                <div className="text-xs text-gray-400">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Messages */}
          {showFlow ? (
            <div className="space-y-2">
              {AUTH_MESSAGES.slice(0, flowStep + 1).map((m, i) => {
                const isRight = m.dir === "→";
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isRight ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex items-center gap-2 text-xs ${isRight ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium ${
                        i === flowStep
                          ? "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200 border border-pink-300 dark:border-pink-700"
                          : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      {!isRight && <ArrowRight size={11} className="rotate-180" />}
                      {m.msg}
                      {isRight && <ArrowRight size={11} />}
                    </div>
                  </motion.div>
                );
              })}
              {flowStep === AUTH_MESSAGES.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 px-3 py-2 text-center text-xs font-bold text-green-700 dark:text-green-300"
                >
                  인증 완료 — 네트워크 접근 허용
                </motion.div>
              )}
            </div>
          ) : (
            <div className="py-6 text-center text-sm text-gray-400">
              [처음부터] 버튼을 눌러 인증 흐름을 단계별로 확인하세요
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
