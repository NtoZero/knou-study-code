"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, AlertTriangle, CheckCircle, Shield } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface WifiVersion {
  id: string;
  name: string;
  year: string;
  standard: string;
  encryption: string;
  auth: string[];
  securityScore: number; // 0-100
  keyFeatures: string[];
  weakness?: string;
  status: "deprecated" | "legacy" | "standard" | "recommended";
  statusLabel: string;
  color: string;
  bgLight: string;
  borderColor: string;
  textColor: string;
}

const VERSIONS: WifiVersion[] = [
  {
    id: "wep",
    name: "WEP",
    year: "2001",
    standard: "IEEE 802.11 초기",
    encryption: "RC4 스트림 암호 (40비트/104비트 키)",
    auth: ["Open System", "Shared Key"],
    securityScore: 10,
    keyFeatures: [
      "RC4 스트림 암호화 사용",
      "짧은 IV(24비트) — 충돌 취약",
      "정적(고정) 키 사용",
      "오프라인 공격에 취약",
    ],
    weakness: "짧은 초기화 벡터(IV) + 정적 키로 인해 수분 내 해독 가능. 이미 폐기됨.",
    status: "deprecated",
    statusLabel: "폐기됨",
    color: "bg-red-500",
    bgLight: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-400",
    textColor: "text-red-700 dark:text-red-300",
  },
  {
    id: "wpa",
    name: "WPA",
    year: "2003",
    standard: "Wi-Fi Alliance (802.11i 전 임시)",
    encryption: "TKIP (RC4 기반 — 키 믹싱 + 시퀀스 번호 추가)",
    auth: ["WPA-Personal (PSK)", "WPA-Enterprise (802.1X)"],
    securityScore: 45,
    keyFeatures: [
      "TKIP으로 WEP 취약점 개선",
      "키 믹싱(Key Mixing) 적용",
      "메시지 무결성 코드(MIC) 추가",
      "802.11i 완성 전 과도기 솔루션",
    ],
    weakness: "RC4 기반 TKIP은 여전히 WPA2/3보다 취약. 현재 레거시로 분류.",
    status: "legacy",
    statusLabel: "레거시",
    color: "bg-amber-500",
    bgLight: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-400",
    textColor: "text-amber-700 dark:text-amber-300",
  },
  {
    id: "wpa2",
    name: "WPA2",
    year: "2004",
    standard: "Wi-Fi Alliance (IEEE 802.11i 완전 구현)",
    encryption: "CCMP(AES) 필수 + TKIP 선택 지원",
    auth: ["WPA2-Personal (PSK)", "WPA2-Enterprise (802.1X/RADIUS)"],
    securityScore: 80,
    keyFeatures: [
      "AES 기반 CCMP 필수 적용",
      "IEEE 802.11i 전면 구현",
      "WPA2-Enterprise: RADIUS 서버 개별 인증",
      "PSK 방식은 오프라인 사전 공격에 취약",
    ],
    status: "standard",
    statusLabel: "표준",
    color: "bg-blue-600",
    bgLight: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-400",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  {
    id: "wpa3",
    name: "WPA3",
    year: "2018",
    standard: "Wi-Fi Alliance",
    encryption: "CCMP(AES-128) 필수 + 192비트 모드(Enterprise)",
    auth: ["SAE (PSK 대체)", "WPA3-Enterprise (802.1X)"],
    securityScore: 98,
    keyFeatures: [
      "SAE(Dragonfly 기반): 오프라인 사전 공격 방어",
      "PMF: 관리 프레임(De-auth 등) 암호화",
      "192비트 보안 모드 (정부·금융 환경)",
      "Easy Connect(DPP): QR 코드로 IoT 설정",
    ],
    status: "recommended",
    statusLabel: "권장",
    color: "bg-green-600",
    bgLight: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-400",
    textColor: "text-green-700 dark:text-green-300",
  },
];

function StatusBadge({ status, label }: { status: WifiVersion["status"]; label: string }) {
  const cls = {
    deprecated: "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
    legacy: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
    standard: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
    recommended: "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
  }[status];

  const icon = {
    deprecated: <AlertTriangle size={11} />,
    legacy: <AlertTriangle size={11} />,
    standard: <CheckCircle size={11} />,
    recommended: <Shield size={11} />,
  }[status];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-bold ${cls}`}>
      {icon} {label}
    </span>
  );
}

function SecurityGauge({ score, color }: { score: number; color: string }) {
  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-xs text-gray-500">
        <span>보안 강도</span>
        <span className="font-bold">{score}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
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

export default function WirelessSecurityEvolution() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedVersion = VERSIONS.find((v) => v.id === selected);

  return (
    <section>
      <SectionTitle
        title="무선LAN 보안 기술 진화"
        subtitle="WEP → WPA → WPA2 → WPA3 — 각 버전을 클릭하여 상세 정보를 확인하세요"
      />

      {/* Timeline */}
      <div className="relative mb-6">
        {/* Connecting line */}
        <div className="absolute left-0 right-0 top-10 h-0.5 bg-gray-300 dark:bg-gray-700 hidden sm:block" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {VERSIONS.map((v, idx) => (
            <div key={v.id} className="relative flex flex-col items-center flex-1">
              {/* Year label */}
              <div className="mb-2 text-xs text-gray-500">{v.year}</div>

              {/* Circle node */}
              <motion.button
                onClick={() => setSelected(selected === v.id ? null : v.id)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className={`relative z-10 flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 text-white shadow-md transition-all ${
                  selected === v.id
                    ? `${v.color} border-white ring-4 ring-offset-2 ring-offset-white dark:ring-offset-gray-900`
                    : `${v.color} border-transparent opacity-80 hover:opacity-100`
                }`}
              >
                <Wifi size={20} />
                <span className="mt-1 text-xs font-bold">{v.name}</span>
              </motion.button>

              {/* Status badge */}
              <div className="mt-2">
                <StatusBadge status={v.status} label={v.statusLabel} />
              </div>

              {/* Connector label on mobile */}
              {idx < VERSIONS.length - 1 && (
                <div className="my-2 text-xs text-gray-400 sm:hidden">▼</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {selectedVersion && (
          <motion.div
            key={selected}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className={`rounded-2xl border-2 ${selectedVersion.borderColor} ${selectedVersion.bgLight} p-6`}
            >
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <h3 className={`text-xl font-bold ${selectedVersion.textColor}`}>
                  {selectedVersion.name}
                </h3>
                <StatusBadge status={selectedVersion.status} label={selectedVersion.statusLabel} />
                <span className="text-sm text-gray-500">{selectedVersion.year} · {selectedVersion.standard}</span>
              </div>

              <div className="mb-4">
                <SecurityGauge score={selectedVersion.securityScore} color={selectedVersion.color} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-2 text-xs font-bold uppercase text-gray-500">암호화</div>
                  <div className={`rounded-lg ${selectedVersion.bgLight} border ${selectedVersion.borderColor} px-3 py-2 text-sm ${selectedVersion.textColor} font-medium`}>
                    {selectedVersion.encryption}
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-xs font-bold uppercase text-gray-500">인증 방식</div>
                  <div className="space-y-1">
                    {selectedVersion.auth.map((a) => (
                      <div
                        key={a}
                        className={`rounded-lg ${selectedVersion.bgLight} border ${selectedVersion.borderColor} px-3 py-1.5 text-xs ${selectedVersion.textColor}`}
                      >
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 text-xs font-bold uppercase text-gray-500">주요 특징</div>
                <ul className="space-y-1.5">
                  {selectedVersion.keyFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${selectedVersion.color}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedVersion.weakness && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0 text-red-500" />
                  <p className="text-sm text-red-700 dark:text-red-300">{selectedVersion.weakness}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Evolution summary */}
      <div className="mt-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 px-5 py-4">
        <div className="mb-2 text-xs font-bold uppercase text-gray-500">무선 보안 진화 요약</div>
        <div className="flex flex-wrap items-center gap-1.5 text-sm">
          {[
            { label: "WEP", sub: "취약", cls: "text-red-600 dark:text-red-400 font-bold" },
            { arrow: true },
            { label: "WPA", sub: "TKIP 과도기", cls: "text-amber-600 dark:text-amber-400 font-bold" },
            { arrow: true },
            { label: "WPA2", sub: "AES/CCMP 표준", cls: "text-blue-600 dark:text-blue-400 font-bold" },
            { arrow: true },
            { label: "WPA3", sub: "SAE+PMF 현재", cls: "text-green-600 dark:text-green-400 font-bold" },
          ].map((item, i) =>
            "arrow" in item ? (
              <span key={i} className="text-gray-400">→</span>
            ) : (
              <span key={i} className={item.cls}>
                {item.label}
                <span className="ml-1 text-xs font-normal text-gray-500">({item.sub})</span>
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
