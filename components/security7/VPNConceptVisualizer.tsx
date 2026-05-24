"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Shield,
  User,
  Building2,
  Wifi,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/* ─── VPN 터널 팝업 ─── */
interface TunnelConcept {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  detail: string;
}

const tunnelConcepts: TunnelConcept[] = [
  {
    id: "tunneling",
    name: "터널링",
    icon: <Wifi size={20} />,
    description: "패킷을 캡슐화하여 안전한 가상 통신로 생성",
    detail: "원본 패킷을 새로운 헤더로 감싸(캡슐화) 마치 전용 터널을 통해 전송되는 것처럼 처리. 외부에서는 캡슐화된 헤더만 보이므로 내부 패킷 내용이 보호됨.",
  },
  {
    id: "encryption",
    name: "암호화",
    icon: <Lock size={20} />,
    description: "데이터 기밀성 보장",
    detail: "전송 데이터를 암호화하여 중간에서 가로채더라도 내용을 알 수 없게 함. IPsec은 AES 등 강력한 대칭키 암호를 사용하며, SSL VPN은 TLS 프로토콜을 활용.",
  },
  {
    id: "auth",
    name: "인증",
    icon: <Shield size={20} />,
    description: "사용자·장치 신원 확인",
    detail: "VPN 접속 전 사용자 또는 장치의 신원을 확인. 비밀번호, 인증서, OTP, MFA 등 다양한 방식 적용 가능. 인증되지 않은 접속 원천 차단.",
  },
];

/* ─── VPN 목적 ─── */
const vpnPurposes = [
  { id: 1, title: "비용 절감", desc: "전용선(전용 회선) 대신 공중 인터넷을 활용하여 WAN 구축 비용 절감" },
  { id: 2, title: "확장성", desc: "새로운 지사나 사용자를 쉽게 추가할 수 있어 확장성 우수" },
  { id: 3, title: "보안 강화", desc: "암호화·인증으로 인터넷을 통한 통신에서도 사설망 수준 보안 확보" },
  { id: 4, title: "성능 개선", desc: "QoS 기능으로 중요 트래픽에 대역폭 우선순위 부여" },
  { id: 5, title: "관리 용이성", desc: "중앙에서 VPN 정책과 접근 제어를 일괄 관리" },
];

/* ─── VPN 기능 ─── */
const vpnFunctions = [
  { name: "터널링(Tunneling)", desc: "패킷 캡슐화로 가상 통신로 생성" },
  { name: "암호화(Encryption)", desc: "데이터 기밀성 보장" },
  { name: "인증(Authentication)", desc: "사용자·장치 신원 확인" },
  { name: "접근제어(Access Control)", desc: "인가된 사용자만 VPN 접속 허용" },
  { name: "주소 관리(Address Management)", desc: "내부 IP주소를 외부에서 숨김" },
  { name: "QoS(Quality of Service)", desc: "대역폭 우선순위 관리" },
];

/* ─── VPN 분류 ─── */
interface VPNType {
  name: string;
  desc: string;
  useCase: string;
  icon: React.ReactNode;
  color: string;
  bgLight: string;
  borderColor: string;
  textColor: string;
}

const vpnTypes: VPNType[] = [
  {
    name: "원격 접속 VPN",
    desc: "개인 사용자 ↔ 기업 내부망",
    useCase: "재택근무, 출장 중 접속",
    icon: <User size={18} />,
    color: "bg-violet-500",
    bgLight: "bg-violet-50 dark:bg-violet-950/40",
    borderColor: "border-violet-300 dark:border-violet-700",
    textColor: "text-violet-700 dark:text-violet-300",
  },
  {
    name: "인트라넷 VPN",
    desc: "본사 ↔ 지사 간 안전한 WAN",
    useCase: "기업 내 거점 간 연결",
    icon: <Building2 size={18} />,
    color: "bg-emerald-500",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/40",
    borderColor: "border-emerald-300 dark:border-emerald-700",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    name: "엑스트라넷 VPN",
    desc: "기업 ↔ 협력사/파트너",
    useCase: "B2B 연계",
    icon: <Wifi size={18} />,
    color: "bg-blue-500",
    bgLight: "bg-blue-50 dark:bg-blue-950/40",
    borderColor: "border-blue-300 dark:border-blue-700",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  {
    name: "MPLS VPN",
    desc: "통신사 MPLS 망 활용",
    useCase: "대기업/ISP 서비스",
    icon: <Shield size={18} />,
    color: "bg-amber-500",
    bgLight: "bg-amber-50 dark:bg-amber-950/40",
    borderColor: "border-amber-300 dark:border-amber-700",
    textColor: "text-amber-700 dark:text-amber-300",
  },
];

export default function VPNConceptVisualizer() {
  const [selectedTunnel, setSelectedTunnel] = useState<string | null>(null);
  const [openPurpose, setOpenPurpose] = useState<number | null>(null);
  const [openFunction, setOpenFunction] = useState<number | null>(null);
  const [selectedVPNType, setSelectedVPNType] = useState<number | null>(null);
  const [vpnTech, setVpnTech] = useState<"ipsec" | "ssl">("ipsec");

  const currentTunnel = tunnelConcepts.find((t) => t.id === selectedTunnel);

  return (
    <section>
      <SectionTitle
        title="VPN(가상사설망) 개념 시각화"
        subtitle="공중망을 사설망처럼 — 터널링·분류·기술 비교"
      />

      {/* ── VPN 개념 다이어그램 ── */}
      <div className="mb-8 rounded-xl border border-violet-200 bg-violet-50 p-6 dark:border-violet-800 dark:bg-violet-950/30">
        <p className="mb-4 text-center text-sm font-semibold text-violet-700 dark:text-violet-300">
          터널 아이콘을 클릭하면 각 기술 개념을 확인할 수 있습니다
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* 사용자 측 */}
          <div className="flex flex-col items-center gap-2 rounded-xl border border-violet-200 bg-white p-4 dark:border-violet-700 dark:bg-gray-900">
            <User size={28} className="text-violet-600" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">사용자/지사</span>
          </div>

          {/* 터널 버튼들 */}
          <div className="flex items-center gap-2">
            {tunnelConcepts.map((concept) => (
              <button
                key={concept.id}
                onClick={() => setSelectedTunnel(selectedTunnel === concept.id ? null : concept.id)}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all ${
                  selectedTunnel === concept.id
                    ? "border-violet-500 bg-violet-100 dark:border-violet-400 dark:bg-violet-900/40"
                    : "border-dashed border-violet-300 bg-violet-50 hover:border-violet-500 dark:border-violet-700 dark:bg-violet-950/20"
                }`}
              >
                <span className="text-violet-600 dark:text-violet-400">{concept.icon}</span>
                <span className="text-xs font-medium text-violet-700 dark:text-violet-300">{concept.name}</span>
              </button>
            ))}
          </div>

          {/* 인터넷 */}
          <div className="flex flex-col items-center gap-1">
            <div className="rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              인터넷 (공중망)
            </div>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-1 w-4 rounded-full bg-violet-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>
          </div>

          {/* 사내망 측 */}
          <div className="flex flex-col items-center gap-2 rounded-xl border border-violet-200 bg-white p-4 dark:border-violet-700 dark:bg-gray-900">
            <Building2 size={28} className="text-violet-600" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">사내망/본사</span>
          </div>
        </div>

        {/* 터널 개념 팝업 */}
        <AnimatePresence>
          {currentTunnel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 overflow-hidden"
            >
              <div className="relative rounded-xl border-2 border-violet-400 bg-white p-4 dark:border-violet-600 dark:bg-gray-900">
                <button
                  onClick={() => setSelectedTunnel(null)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={16} />
                </button>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-violet-600 dark:text-violet-400">{currentTunnel.icon}</span>
                  <h5 className="font-bold text-violet-800 dark:text-violet-200">{currentTunnel.name}</h5>
                </div>
                <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{currentTunnel.description}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{currentTunnel.detail}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* ── VPN 목적 아코디언 ── */}
        <div>
          <h3 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">
            VPN 도입 목적 5가지
          </h3>
          <div className="space-y-2">
            {vpnPurposes.map((p) => (
              <div key={p.id} className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                <button
                  onClick={() => setOpenPurpose(openPurpose === p.id ? null : p.id)}
                  className="flex w-full items-center justify-between p-3 text-left"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white">
                      {p.id}
                    </span>
                    {p.title}
                  </span>
                  {openPurpose === p.id ? (
                    <ChevronUp size={14} className="text-violet-500" />
                  ) : (
                    <ChevronDown size={14} className="text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {openPurpose === p.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-gray-100 px-3 pb-3 pt-2 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
                        {p.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* ── VPN 기능 아코디언 ── */}
        <div>
          <h3 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">
            VPN 핵심 기능 6가지
          </h3>
          <div className="space-y-2">
            {vpnFunctions.map((f, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                <button
                  onClick={() => setOpenFunction(openFunction === i ? null : i)}
                  className="flex w-full items-center justify-between p-3 text-left"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    {f.name.split("(")[0]}
                    <span className="text-xs text-gray-400">({f.name.split("(")[1]?.replace(")", "")})</span>
                  </span>
                  {openFunction === i ? (
                    <ChevronUp size={14} className="text-emerald-500" />
                  ) : (
                    <ChevronDown size={14} className="text-gray-400" />
                  )}
                </button>
                <AnimatePresence>
                  {openFunction === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-gray-100 px-3 pb-3 pt-2 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
                        {f.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── VPN 분류 4종 인터랙티브 테이블 ── */}
      <div className="mt-8">
        <h3 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">
          VPN 분류 4종 — 행을 클릭하여 상세 확인
        </h3>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">유형</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">연결 구성</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">주요 사용 사례</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {vpnTypes.map((t, i) => (
                <React.Fragment key={i}>
                  <tr
                    onClick={() => setSelectedVPNType(selectedVPNType === i ? null : i)}
                    className={`cursor-pointer transition-colors ${
                      selectedVPNType === i
                        ? `${t.bgLight}`
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full p-1 text-white ${t.color}`}>{t.icon}</span>
                        <span className={`font-medium ${selectedVPNType === i ? t.textColor : "text-gray-900 dark:text-gray-100"}`}>
                          {t.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.desc}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{t.useCase}</td>
                  </tr>
                  {selectedVPNType === i && (
                    <tr>
                      <td colSpan={3} className={`px-4 py-3 ${t.bgLight}`}>
                        <div className={`text-sm font-medium ${t.textColor}`}>
                          <span className="font-bold">{t.name}</span>: {t.desc} — 사용 사례: {t.useCase}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── IPsec VPN vs SSL VPN 토글 ── */}
      <div className="mt-8">
        <h3 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">
          VPN 기술 동향 — IPsec VPN vs SSL VPN
        </h3>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setVpnTech("ipsec")}
            className={`rounded-lg px-6 py-2.5 text-sm font-bold transition-colors ${
              vpnTech === "ipsec"
                ? "bg-violet-600 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            IPsec VPN
          </button>
          <button
            onClick={() => setVpnTech("ssl")}
            className={`rounded-lg px-6 py-2.5 text-sm font-bold transition-colors ${
              vpnTech === "ssl"
                ? "bg-violet-600 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            SSL VPN
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={vpnTech}
            initial={{ opacity: 0, x: vpnTech === "ipsec" ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: vpnTech === "ipsec" ? 10 : -10 }}
            transition={{ duration: 0.2 }}
            className="mt-4 rounded-xl border-2 border-violet-300 bg-violet-50 p-5 dark:border-violet-700 dark:bg-violet-950/30"
          >
            {vpnTech === "ipsec" ? (
              <>
                <h4 className="mb-3 text-base font-bold text-violet-800 dark:text-violet-200">
                  IPsec VPN <span className="text-sm font-normal text-violet-600">(전통적, 강력 보안)</span>
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    { label: "동작 계층", value: "네트워크 계층 (L3)" },
                    { label: "클라이언트", value: "별도 VPN 클라이언트 소프트웨어 설치 필요" },
                    { label: "보안 강도", value: "매우 강력 (AES, 3DES 등)" },
                    { label: "사용 환경", value: "기업 site-to-site, 원격 접속" },
                    { label: "단점", value: "방화벽 통과 어려움, 클라이언트 설치 필요" },
                    { label: "주요 용도", value: "인트라넷 VPN, 엑스트라넷 VPN" },
                  ].map((item, i) => (
                    <div key={i} className="rounded-lg bg-white p-3 dark:bg-gray-900">
                      <div className="text-xs font-semibold text-violet-600 dark:text-violet-400">{item.label}</div>
                      <div className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">{item.value}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h4 className="mb-3 text-base font-bold text-violet-800 dark:text-violet-200">
                  SSL VPN <span className="text-sm font-normal text-violet-600">(웹 브라우저 기반)</span>
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    { label: "동작 계층", value: "응용 계층 (L7) — TLS/SSL" },
                    { label: "클라이언트", value: "웹 브라우저만으로 접속 가능 (설치 불필요)" },
                    { label: "보안 강도", value: "강력 (TLS 기반)" },
                    { label: "사용 환경", value: "재택근무, 모바일 원격 접속" },
                    { label: "장점", value: "설치 불필요, 방화벽 통과 용이 (HTTPS 포트)" },
                    { label: "주요 용도", value: "원격 접속 VPN" },
                  ].map((item, i) => (
                    <div key={i} className="rounded-lg bg-white p-3 dark:bg-gray-900">
                      <div className="text-xs font-semibold text-violet-600 dark:text-violet-400">{item.label}</div>
                      <div className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">{item.value}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="mt-4 rounded-lg bg-violet-100 p-3 dark:bg-violet-900/30">
              <p className="text-sm font-medium text-violet-800 dark:text-violet-200">
                {vpnTech === "ipsec"
                  ? "IPsec VPN은 강력한 보안을 제공하지만 클라이언트 설치가 필요하여 관리 부담이 있습니다."
                  : "SSL VPN은 웹 브라우저만으로 접속 가능하여 사용 편의성이 높습니다. 별도 클라이언트 설치가 불필요한 것이 가장 큰 장점입니다."}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── VPN 구현 방식 4종 (교재 기준) ── */}
      <div className="mt-8">
        <h3 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">
          VPN 구현 방식 4종
          <span className="ml-2 text-xs font-normal text-gray-400">— 어떤 장비로 VPN을 구성하는가</span>
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              name: "전용 VPN",
              en: "Dedicated VPN",
              desc: "VPN 전용 하드웨어 장비를 사용하여 구성. 성능·보안성이 높으나 비용이 큼.",
              pros: ["전용 하드웨어로 높은 성능", "안정적·전문화된 VPN 기능"],
              cons: ["도입 비용 높음", "별도 장비 관리 필요"],
              color: "bg-violet-500",
              bgLight: "bg-violet-50 dark:bg-violet-950/30",
              border: "border-violet-300 dark:border-violet-700",
              textColor: "text-violet-700 dark:text-violet-300",
            },
            {
              name: "방화벽 기반 VPN",
              en: "Firewall-based VPN",
              desc: "방화벽 장비에 VPN 기능을 추가하여 구성. 방화벽과 VPN을 한 장비에서 처리.",
              pros: ["방화벽과 통합 관리 가능", "추가 장비 불필요"],
              cons: ["방화벽 부하 증가", "전용 장비보다 성능 낮을 수 있음"],
              color: "bg-blue-500",
              bgLight: "bg-blue-50 dark:bg-blue-950/30",
              border: "border-blue-300 dark:border-blue-700",
              textColor: "text-blue-700 dark:text-blue-300",
            },
            {
              name: "라우터 기반 VPN",
              en: "Router-based VPN",
              desc: "라우터 장비에 VPN 소프트웨어를 탑재하여 구성. 기존 라우터 인프라 활용 가능.",
              pros: ["기존 라우터 재활용", "네트워크 장비와 통합"],
              cons: ["라우터 처리 부하 증가", "기능 제한 가능"],
              color: "bg-emerald-500",
              bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
              border: "border-emerald-300 dark:border-emerald-700",
              textColor: "text-emerald-700 dark:text-emerald-300",
            },
            {
              name: "소프트웨어 VPN",
              en: "Software-based VPN",
              desc: "범용 서버나 PC에 VPN 소프트웨어를 설치하여 구성. 비용이 낮고 유연하나 성능에 한계.",
              pros: ["낮은 초기 비용", "유연한 설치·확장"],
              cons: ["소프트웨어 처리로 성능 한계", "운영체제 의존성"],
              color: "bg-amber-500",
              bgLight: "bg-amber-50 dark:bg-amber-950/30",
              border: "border-amber-300 dark:border-amber-700",
              textColor: "text-amber-700 dark:text-amber-300",
            },
          ].map((item, i) => (
            <div key={i} className={`rounded-xl border ${item.border} ${item.bgLight} p-4`}>
              <div className={`mb-1 flex items-center gap-2 ${item.textColor}`}>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white ${item.color}`}>
                  {i + 1}
                </span>
                <span className="text-sm font-bold">{item.name}</span>
              </div>
              <div className="mb-2 text-xs text-gray-400">{item.en}</div>
              <p className="mb-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{item.desc}</p>
              <div className="grid grid-cols-2 gap-2">
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

      {/* ── NAC 개요 ── */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
        <h3 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">
          NAC(Network Access Control) 핵심 기능
        </h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          단말기의 보안 상태를 검사하고 정책 기반으로 네트워크 접근을 허용하거나 격리하는 접근 제어 시스템.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { step: "1", name: "Pre-admission", desc: "접속 전 단말 보안 상태 검사", color: "bg-violet-500" },
            { step: "2", name: "Post-admission", desc: "접속 후 지속 모니터링", color: "bg-blue-500" },
            { step: "3", name: "Quarantine", desc: "비준수 단말 격리 네트워크 분리", color: "bg-amber-500" },
            { step: "4", name: "Remediation", desc: "패치·업데이트 등 치료 유도", color: "bg-green-500" },
          ].map((item) => (
            <div key={item.step} className="rounded-xl border border-white bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className={`mb-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${item.color}`}>
                {item.step}
              </div>
              <div className="text-xs font-bold text-gray-800 dark:text-gray-200">{item.name}</div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
