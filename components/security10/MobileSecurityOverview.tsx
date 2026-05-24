"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Signal, ChevronDown, Shield, Lock, AlertTriangle, Smartphone } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

const NETWORK_TYPES = [
  {
    id: "lan",
    label: "무선 LAN",
    en: "Wireless LAN (Wi-Fi)",
    icon: <Wifi size={22} />,
    standard: "IEEE 802.11",
    desc: "건물 내·캠퍼스 등 근거리 무선 통신",
    specs: [
      { k: "표준", v: "IEEE 802.11 (Wi-Fi)" },
      { k: "커버리지", v: "수십 m ~ 수백 m" },
      { k: "속도", v: "수십 Mbps ~ 수 Gbps" },
      { k: "주요 보안", v: "WEP → WPA → WPA2 → WPA3" },
    ],
    color: "bg-blue-500",
    bgLight: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-400",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  {
    id: "wan",
    label: "무선 WAN",
    en: "Wireless WAN (5G / LTE / WiMAX)",
    icon: <Signal size={22} />,
    standard: "3GPP, IEEE 802.16",
    desc: "이동통신망을 통한 광역 무선 통신",
    specs: [
      { k: "표준", v: "5G NR, LTE(4G), 와이브로(WiMAX)" },
      { k: "커버리지", v: "수 km (이동통신 기지국 반경)" },
      { k: "속도", v: "LTE ~100 Mbps, 5G ~20 Gbps" },
      { k: "주요 보안", v: "SIM 인증, AKA 프로토콜, 전용 암호화" },
    ],
    color: "bg-emerald-500",
    bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-400",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
];

const SECURITY_PROBLEMS = [
  {
    id: "auth",
    icon: <Shield size={18} />,
    title: "인증 및 접근제어",
    en: "Authentication & Access Control",
    desc: "모바일 기기는 다양한 네트워크(Wi-Fi, 5G, 공중망)에 수시로 연결되므로, 정당한 사용자·기기인지 인증하고 인가되지 않은 접근을 차단하는 것이 어려움.",
    items: [
      "공개 Wi-Fi에서의 위장 AP(Evil Twin) 위협",
      "기기 분실 시 무단 접근 방지 필요",
      "SIM 스와핑, 인증 우회 공격",
      "다중 인증(MFA) 적용의 어려움",
    ],
    color: "bg-violet-500",
    bgLight: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-400",
    textColor: "text-violet-700 dark:text-violet-300",
  },
  {
    id: "data",
    icon: <Lock size={18} />,
    title: "데이터 보호",
    en: "Data Protection",
    desc: "무선 구간에서 전송되는 데이터는 도청·변조에 노출될 수 있으며, 기기 내 저장 데이터도 분실·도난 시 유출 위험이 있음.",
    items: [
      "무선 구간 도청(Eavesdropping) 위협",
      "중간자 공격(MITM)으로 데이터 변조",
      "기기 분실 시 저장 데이터 유출",
      "앱의 과도한 권한 요청과 데이터 수집",
    ],
    color: "bg-rose-600",
    bgLight: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-400",
    textColor: "text-rose-700 dark:text-rose-300",
  },
];

export default function MobileSecurityOverview() {
  const [openNet, setOpenNet] = useState<string | null>("lan");
  const [openProb, setOpenProb] = useState<string | null>(null);

  return (
    <section>
      <SectionTitle
        title="모바일 보안 개요"
        subtitle="무선 LAN / WAN 구분 · 모바일 보안 특성 · 핵심 보안 문제"
      />

      {/* 편의성 vs 보안 */}
      <div className="mb-8 rounded-xl border border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Smartphone size={18} className="text-amber-600 dark:text-amber-400" />
          <span className="font-bold text-amber-800 dark:text-amber-200">모바일 환경의 핵심 딜레마</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20 p-4">
            <div className="mb-2 text-sm font-bold text-green-700 dark:text-green-300">편의성 (장점)</div>
            <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
              <li className="flex gap-1.5"><span className="text-green-500 mt-0.5">•</span>언제 어디서나 네트워크 접속</li>
              <li className="flex gap-1.5"><span className="text-green-500 mt-0.5">•</span>Wi-Fi, 5G, LTE 자동 전환</li>
              <li className="flex gap-1.5"><span className="text-green-500 mt-0.5">•</span>업무·금융·쇼핑 원스톱 처리</li>
              <li className="flex gap-1.5"><span className="text-green-500 mt-0.5">•</span>소형·경량 기기로 높은 이동성</li>
            </ul>
          </div>
          <div className="rounded-lg border border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20 p-4">
            <div className="mb-2 text-sm font-bold text-red-600 dark:text-red-400">보안 취약성 (단점)</div>
            <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
              <li className="flex gap-1.5"><span className="text-red-500 mt-0.5">•</span>무선 전파는 누구나 수신 가능</li>
              <li className="flex gap-1.5"><span className="text-red-500 mt-0.5">•</span>공공장소 접속으로 도청 위험 증가</li>
              <li className="flex gap-1.5"><span className="text-red-500 mt-0.5">•</span>분실·도난 시 데이터 유출 위험</li>
              <li className="flex gap-1.5"><span className="text-red-500 mt-0.5">•</span>악성 앱·위장 AP에 노출</li>
            </ul>
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 px-3 py-2">
          <AlertTriangle size={13} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
            편의성이 높을수록 보안 위협에 노출되는 면적(Attack Surface)도 증가 → 체계적 보안 기술 필요
          </p>
        </div>
      </div>

      {/* 무선 LAN vs WAN */}
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
        무선 네트워크 유형 — LAN vs WAN
      </h3>
      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        {NETWORK_TYPES.map((net) => (
          <div key={net.id} className={`rounded-xl border-2 ${net.border} ${net.bgLight} overflow-hidden`}>
            <button
              className="w-full p-4 text-left"
              onClick={() => setOpenNet(openNet === net.id ? null : net.id)}
            >
              <div className={`mb-1.5 flex items-center gap-2 ${net.textColor}`}>
                {net.icon}
                <span className="text-base font-bold">{net.label}</span>
              </div>
              <div className="mb-1 text-xs text-gray-500">{net.en}</div>
              <div className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${net.textColor} bg-white/60 dark:bg-gray-900/40`}>
                {net.standard}
              </div>
              <div className="mt-1.5 text-xs text-gray-600 dark:text-gray-400">{net.desc}</div>
              <ChevronDown
                size={14}
                className={`mt-2 ${net.textColor} transition-transform ${openNet === net.id ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {openNet === net.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className={`border-t ${net.border} px-4 pb-4 pt-3`}>
                    <table className="w-full text-xs">
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {net.specs.map((s) => (
                          <tr key={s.k}>
                            <td className={`py-1.5 font-semibold ${net.textColor} w-20 pr-2`}>{s.k}</td>
                            <td className="py-1.5 text-gray-700 dark:text-gray-300">{s.v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* 보안 문제 */}
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
        모바일 보안의 핵심 문제
      </h3>
      <div className="mb-6 space-y-3">
        {SECURITY_PROBLEMS.map((p) => (
          <div key={p.id} className={`rounded-xl border-2 ${p.border} ${p.bgLight} overflow-hidden`}>
            <button
              className="flex w-full items-center gap-3 px-5 py-4 text-left"
              onClick={() => setOpenProb(openProb === p.id ? null : p.id)}
            >
              <div className={`rounded-lg ${p.color} p-1.5 text-white shrink-0`}>{p.icon}</div>
              <div className="flex-1">
                <div className={`text-sm font-bold ${p.textColor}`}>{p.title}</div>
                <div className="text-xs text-gray-500">{p.en}</div>
              </div>
              <ChevronDown
                size={14}
                className={`shrink-0 ${p.textColor} transition-transform ${openProb === p.id ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {openProb === p.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className={`border-t ${p.border} px-5 pb-4 pt-3`}>
                    <p className="mb-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{p.desc}</p>
                    <ul className="space-y-1">
                      {p.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${p.color}`} />
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

      {/* IEEE 802.11 → 802.11i 발전 배경 */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 p-5">
        <h4 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-100">
          무선 LAN 보안 표준의 발전 배경
        </h4>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            { label: "IEEE 802.11", desc: "초기 무선 LAN 표준 (보안 취약)", color: "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300" },
            { arrow: true },
            { label: "WEP 도입", desc: "RC4 기반, 정적 키 — 금방 취약점 발견", color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" },
            { arrow: true },
            { label: "IEEE 802.11i", desc: "RSN(강력보안네트워크) 표준화 — TKIP·CCMP·802.1X·EAP", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" },
            { arrow: true },
            { label: "WPA / WPA2 / WPA3", desc: "Wi-Fi Alliance 인증 규격 (802.11i 기반)", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" },
          ].map((item, i) =>
            "arrow" in item ? (
              <span key={i} className="text-gray-400 font-bold">→</span>
            ) : (
              <div key={i} className={`rounded-lg px-3 py-1.5 ${item.color}`}>
                <div className="font-bold">{item.label}</div>
                <div className="opacity-80 mt-0.5">{item.desc}</div>
              </div>
            )
          )}
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          * WEP의 취약점(정적 키, IV 충돌, RC4 약점)이 알려진 후, IEEE는 802.11i(RSN)를 제정하여 동적 키 교환과 강력한 암호화를 의무화함. WPA/WPA2/WPA3는 이를 기반으로 한 Wi-Fi Alliance 인증 규격.
        </p>
      </div>
    </section>
  );
}
