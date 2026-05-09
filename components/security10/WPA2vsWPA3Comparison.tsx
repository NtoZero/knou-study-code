"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Shield, Key, Wifi, Smartphone, Lock, Building, Home, ArrowRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

const WPA2_PERSONAL_ENTERPRISE = [
  {
    id: "personal",
    label: "WPA2-Personal",
    en: "Pre-Shared Key (PSK)",
    icon: <Home size={20} />,
    env: "가정, 소규모 사무실",
    auth: "PSK(Pre-Shared Key) — 공유 비밀번호",
    security: "상대적으로 낮음",
    secScore: 60,
    pros: ["설정 간단", "별도 서버 불필요", "소규모 환경에 적합"],
    cons: ["오프라인 사전 공격에 취약", "모든 기기가 동일한 키 공유", "키 변경 시 모든 기기 재설정 필요"],
    color: "bg-blue-500",
    bgLight: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-400",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  {
    id: "enterprise",
    label: "WPA2-Enterprise",
    en: "802.1X + RADIUS",
    icon: <Building size={20} />,
    env: "기업, 대학교, 대규모 기관",
    auth: "802.1X + RADIUS 서버 (개별 인증서/계정)",
    security: "높음",
    secScore: 90,
    pros: ["개별 사용자 인증 (인증서/계정)", "중앙 집중 접근 제어", "사용자별 세션 키 생성"],
    cons: ["RADIUS 서버 구축 필요", "설정·관리 복잡", "비용 증가"],
    color: "bg-indigo-600",
    bgLight: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-500",
    textColor: "text-indigo-700 dark:text-indigo-300",
  },
];

interface WPA3Feature {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  replaces?: string;
  detail: string;
  points: string[];
  color: string;
  bgLight: string;
  border: string;
  textColor: string;
}

const WPA3_FEATURES: WPA3Feature[] = [
  {
    id: "sae",
    title: "SAE",
    subtitle: "Simultaneous Authentication of Equals",
    icon: <Key size={18} />,
    replaces: "PSK 대체",
    detail: "Dragonfly 핸드셰이크 기반의 패스워드 인증 프로토콜. WPA2-Personal의 PSK를 대체하며, 매 인증마다 새로운 키를 생성(Forward Secrecy)하여 과거 트래픽을 복호화할 수 없게 함.",
    points: [
      "Dragonfly 키 교환 기반",
      "오프라인 사전 공격(Dictionary Attack) 방어",
      "동일 패스워드라도 매번 다른 세션 키 생성",
      "Forward Secrecy: 과거 트래픽 보호",
      "PSK 완전 대체",
    ],
    color: "bg-pink-600",
    bgLight: "bg-pink-50 dark:bg-pink-900/20",
    border: "border-pink-500",
    textColor: "text-pink-700 dark:text-pink-300",
  },
  {
    id: "pmf",
    title: "PMF",
    subtitle: "Protected Management Frames",
    icon: <Shield size={18} />,
    detail: "Wi-Fi 관리 프레임(Deauthentication, Disassociation 등)을 암호화·인증. WPA2에서는 관리 프레임이 평문으로 전송되어 공격자가 가짜 De-auth 프레임으로 연결을 강제 해제할 수 있었음.",
    points: [
      "관리 프레임 암호화 및 인증",
      "무선 재밍(Deauth 공격) 방어",
      "세션 하이재킹 방어",
      "WPA3에서 필수(Mandatory) 적용",
      "WPA2에서도 선택적(Optional)으로 지원",
    ],
    color: "bg-violet-600",
    bgLight: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-500",
    textColor: "text-violet-700 dark:text-violet-300",
  },
  {
    id: "192bit",
    title: "192비트 보안 모드",
    subtitle: "WPA3-Enterprise 192-bit",
    icon: <Lock size={18} />,
    detail: "WPA3-Enterprise에서 192비트 암호화 스위트(GCMP-256, BIP-GMAC-256 등)를 지원. 정부, 금융, 방위 산업 등 고보안 환경을 위한 확장 모드.",
    points: [
      "GCMP-256 암호화",
      "BIP-GMAC-256 무결성 보호",
      "ECDSA-384 인증서",
      "정부·금융·방위 산업 대상",
      "Suite B 암호화 스위트 기반",
    ],
    color: "bg-emerald-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-500",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "easydpp",
    title: "Easy Connect",
    subtitle: "Device Provisioning Protocol (DPP)",
    icon: <Smartphone size={18} />,
    detail: "QR 코드 또는 NFC를 사용해 IoT 기기를 간편하게 Wi-Fi 네트워크에 연결하는 기능. 화면이 없는 스마트 홈 기기도 쉽게 연결 가능. Wi-Fi Easy Connect라고도 불림.",
    points: [
      "QR 코드로 IoT 기기 Wi-Fi 설정",
      "NFC 방식도 지원",
      "화면 없는 기기(스마트 플러그 등) 지원",
      "공개키 기반 부트스트래핑",
      "Wi-Fi Easy Connect = DPP",
    ],
    color: "bg-teal-600",
    bgLight: "bg-teal-50 dark:bg-teal-900/20",
    border: "border-teal-500",
    textColor: "text-teal-700 dark:text-teal-300",
  },
];

function SecurityBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="w-full">
      <div className="mb-0.5 flex justify-between text-xs text-gray-500">
        <span>보안 강도</span>
        <span className="font-bold">{score}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

export default function WPA2vsWPA3Comparison() {
  const [openFeature, setOpenFeature] = useState<string | null>("sae");

  return (
    <section>
      <SectionTitle
        title="WPA2 비교 및 WPA3 개선사항"
        subtitle="WPA2-Personal vs Enterprise 비교 · WPA3의 4가지 핵심 개선"
      />

      {/* WPA2 Personal vs Enterprise */}
      <div className="mb-10">
        <h3 className="mb-4 text-base font-bold text-gray-800 dark:text-gray-100">
          WPA2-Personal vs WPA2-Enterprise
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {WPA2_PERSONAL_ENTERPRISE.map((item) => (
            <div key={item.id} className={`rounded-2xl border-2 ${item.border} ${item.bgLight} p-5`}>
              <div className={`mb-3 flex items-center gap-2 ${item.textColor}`}>
                {item.icon}
                <div>
                  <div className="text-base font-bold">{item.label}</div>
                  <div className="text-xs opacity-70">{item.en}</div>
                </div>
              </div>

              <SecurityBar score={item.secScore} color={item.color} />

              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-gray-600 dark:text-gray-400">환경: </span>
                  <span className={item.textColor}>{item.env}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600 dark:text-gray-400">인증: </span>
                  <span className="text-gray-700 dark:text-gray-300">{item.auth}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600 dark:text-gray-400">보안: </span>
                  <span className={item.textColor}>{item.security}</span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <div className="mb-1 text-xs font-bold text-green-600 dark:text-green-400">장점</div>
                  {item.pros.map((p) => (
                    <div key={p} className="text-xs text-gray-600 dark:text-gray-400">· {p}</div>
                  ))}
                </div>
                <div>
                  <div className="mb-1 text-xs font-bold text-red-500 dark:text-red-400">단점</div>
                  {item.cons.map((c) => (
                    <div key={c} className="text-xs text-gray-600 dark:text-gray-400">· {c}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WPA2 → WPA3 improvement summary */}
      <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-50 to-pink-50 dark:from-blue-900/20 dark:to-pink-900/20 border border-pink-200 dark:border-pink-800 p-5">
        <h3 className="mb-3 text-base font-bold text-gray-800 dark:text-gray-100">WPA2 → WPA3 개선 요약</h3>
        <div className="flex flex-wrap items-center gap-3">
          {[
            { from: "PSK", to: "SAE(Dragonfly)", desc: "오프라인 사전 공격 방어" },
            { from: "관리 프레임 평문", to: "PMF 필수", desc: "De-auth 공격 방어" },
            { from: "128비트 최대", to: "192비트 모드", desc: "고보안 환경" },
            { from: "수동 IoT 설정", to: "Easy Connect", desc: "QR 코드 자동화" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 px-2 py-1.5 text-blue-700 dark:text-blue-300">
                {item.from}
              </div>
              <div className="flex flex-col items-center">
                <ArrowRight size={14} className="text-gray-400" />
                <span className="text-gray-400 text-xs">{item.desc}</span>
              </div>
              <div className="rounded-lg bg-pink-100 dark:bg-pink-900/30 border border-pink-300 dark:border-pink-700 px-2 py-1.5 font-bold text-pink-700 dark:text-pink-300">
                {item.to}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WPA3 4 improvements accordion */}
      <div>
        <h3 className="mb-4 text-base font-bold text-gray-800 dark:text-gray-100">
          WPA3의 4가지 개선사항
          <span className="ml-2 text-xs font-normal text-gray-500">— 항목을 클릭하여 상세 설명 확인</span>
        </h3>
        <div className="space-y-3">
          {WPA3_FEATURES.map((f, idx) => (
            <div key={f.id} className={`rounded-xl border-2 ${f.border} ${f.bgLight} overflow-hidden`}>
              <button
                className="flex w-full items-center gap-3 px-5 py-4 text-left"
                onClick={() => setOpenFeature(openFeature === f.id ? null : f.id)}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${f.color} text-white`}>
                  <span className="text-xs font-bold">{idx + 1}</span>
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-bold ${f.textColor}`}>
                    {f.title}
                    {f.replaces && (
                      <span className="ml-2 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 px-2 py-0.5 text-xs font-normal text-red-600 dark:text-red-400">
                        {f.replaces}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">{f.subtitle}</div>
                </div>
                <div className={`shrink-0 ${f.textColor}`}>{f.icon}</div>
                <ChevronDown
                  size={14}
                  className={`shrink-0 ${f.textColor} transition-transform ${openFeature === f.id ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {openFeature === f.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className={`border-t ${f.border} px-5 pb-4 pt-3`}>
                      <p className="mb-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {f.detail}
                      </p>
                      <ul className="space-y-1">
                        {f.points.map((p) => (
                          <li key={p} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${f.color}`} />
                            {p}
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
      </div>
    </section>
  );
}
