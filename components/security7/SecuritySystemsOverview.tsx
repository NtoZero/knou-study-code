"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Eye,
  Zap,
  Lock,
  Network,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface SecuritySystem {
  id: string;
  name: string;
  abbr: string;
  fullName: string;
  icon: React.ReactNode;
  badge: "탐지형" | "방어형" | "혼합형";
  badgeColor: string;
  keyFunction: string;
  description: string;
  responseType: "사후 대응" | "능동 대응" | "사전 차단" | "접근 제어";
  responseColor: string;
  details: string[];
  color: string;
  bgLight: string;
  borderColor: string;
  textColor: string;
}

const systems: SecuritySystem[] = [
  {
    id: "firewall",
    name: "방화벽",
    abbr: "Firewall",
    fullName: "Firewall",
    icon: <Shield size={28} />,
    badge: "방어형",
    badgeColor: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    keyFunction: "허용/차단 정책으로 네트워크 경계 보호",
    description: "네트워크 경계에서 트래픽을 검사하고 허용된 패킷만 통과시키는 보안 장치. ACL(접근 제어 목록) 기반으로 내부망과 외부망 사이에 위치.",
    responseType: "사전 차단",
    responseColor: "bg-violet-500",
    details: [
      "IP주소, 포트번호, 프로토콜 기반 필터링",
      "네트워크 경계(Perimeter) 보안의 핵심",
      "4가지 구성방식: 패킷필터링, 서킷게이트웨이, 애플리케이션GW, 하이브리드",
      "5가지 구축형태: 스크리닝라우터 → 베스천호스트 → 듀얼홈 → 스크린호스트GW → DMZ",
      "취약점: 내부자 공격, 새로운 공격, 바이러스 포함 파일 통과 불가",
    ],
    color: "violet",
    bgLight: "bg-violet-50 dark:bg-violet-950/50",
    borderColor: "border-violet-300 dark:border-violet-700",
    textColor: "text-violet-700 dark:text-violet-300",
  },
  {
    id: "ids",
    name: "침입탐지시스템",
    abbr: "IDS",
    fullName: "Intrusion Detection System",
    icon: <Eye size={28} />,
    badge: "탐지형",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    keyFunction: "비인가 접근·공격 탐지 (사후 대응)",
    description: "네트워크나 시스템에서 비인가 접근이나 공격을 탐지하여 관리자에게 경보를 보내는 시스템. 탐지만 하며 차단하지 않음.",
    responseType: "사후 대응",
    responseColor: "bg-blue-500",
    details: [
      "공격 탐지 후 경보(Alert) 발생 — 직접 차단 불가",
      "오용탐지(Misuse): 알려진 공격 패턴 서명(Signature) 비교",
      "이상탐지(Anomaly): 정상 행동 프로파일과 비교",
      "HIDS(호스트 기반), NIDS(네트워크 기반) 구분",
      "IPS와 비교: 탐지 전용(수동) vs 탐지+차단(능동)",
    ],
    color: "blue",
    bgLight: "bg-blue-50 dark:bg-blue-950/50",
    borderColor: "border-blue-300 dark:border-blue-700",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  {
    id: "ips",
    name: "침입방지시스템",
    abbr: "IPS",
    fullName: "Intrusion Prevention System",
    icon: <Zap size={28} />,
    badge: "혼합형",
    badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    keyFunction: "탐지 + 실시간 차단 (능동 대응)",
    description: "IDS의 탐지 기능에 실시간 차단 기능을 추가한 시스템. 공격이 탐지되면 즉시 해당 트래픽을 차단하여 피해를 방지.",
    responseType: "능동 대응",
    responseColor: "bg-amber-500",
    details: [
      "IDS + 차단 기능 = IPS (능동적 보안)",
      "인라인(Inline) 배치: 트래픽 경로에 직접 위치",
      "HIPS(호스트 기반), NIPS(네트워크 기반) 구분",
      "오탐(False Positive) 시 정상 트래픽 차단 위험",
      "IDS보다 실시간 대응력 우수하나 부하 증가",
    ],
    color: "amber",
    bgLight: "bg-amber-50 dark:bg-amber-950/50",
    borderColor: "border-amber-300 dark:border-amber-700",
    textColor: "text-amber-700 dark:text-amber-300",
  },
  {
    id: "vpn",
    name: "가상사설망",
    abbr: "VPN",
    fullName: "Virtual Private Network",
    icon: <Lock size={28} />,
    badge: "방어형",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    keyFunction: "공중망으로 사설망 수준의 보안 통신",
    description: "인터넷과 같은 공중망을 이용하면서도 사설망(전용선)과 동일한 보안 수준을 제공하는 가상 사설 네트워크 기술.",
    responseType: "사전 차단",
    responseColor: "bg-emerald-500",
    details: [
      "터널링(Tunneling)으로 패킷 캡슐화",
      "암호화(Encryption)로 기밀성 보장",
      "인증(Authentication)으로 신원 확인",
      "유형: 원격접속 VPN, 인트라넷 VPN, 엑스트라넷 VPN, MPLS VPN",
      "기술: IPsec VPN (전통적), SSL VPN (웹 브라우저 기반)",
    ],
    color: "emerald",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/50",
    borderColor: "border-emerald-300 dark:border-emerald-700",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "nac",
    name: "네트워크접근제어",
    abbr: "NAC",
    fullName: "Network Access Control",
    icon: <Network size={28} />,
    badge: "방어형",
    badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    keyFunction: "정책 기반 네트워크 접근 허용/격리",
    description: "단말기의 보안 상태를 검사하고 정책에 따라 네트워크 접근을 허용하거나 격리하는 접근 제어 시스템.",
    responseType: "접근 제어",
    responseColor: "bg-rose-500",
    details: [
      "접속 전 검사(Pre-admission): 단말 보안 상태 확인",
      "접속 후 모니터링(Post-admission): 지속적 감시",
      "격리(Quarantine): 비준수 단말을 격리 네트워크로 분리",
      "치료(Remediation): 패치, 업데이트 등 치료 유도",
      "BYOD 환경에서 특히 중요",
    ],
    color: "rose",
    bgLight: "bg-rose-50 dark:bg-rose-950/50",
    borderColor: "border-rose-300 dark:border-rose-700",
    textColor: "text-rose-700 dark:text-rose-300",
  },
];

export default function SecuritySystemsOverview() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section>
      <SectionTitle
        title="보안 시스템 5종 개요"
        subtitle="네트워크 보안을 구성하는 핵심 시스템 — 클릭하여 상세 설명 확인"
      />

      {/* IDS vs IPS 비교 배너 */}
      <div className="mb-6 rounded-xl border border-dashed border-violet-300 bg-violet-50/50 p-4 dark:border-violet-700 dark:bg-violet-950/30">
        <p className="text-center text-sm font-medium text-violet-700 dark:text-violet-300">
          <span className="font-bold">IDS vs IPS</span> — IDS는 탐지만, IPS는 탐지 + 실시간 차단. IPS는 IDS의 진화형.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {systems.map((sys) => (
          <div key={sys.id} className="flex flex-col">
            <button
              onClick={() => toggle(sys.id)}
              className={`flex flex-col rounded-xl border-2 p-5 text-left transition-all hover:shadow-md ${
                openId === sys.id
                  ? `${sys.borderColor} ${sys.bgLight}`
                  : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900"
              }`}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className={`${sys.textColor}`}>{sys.icon}</div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sys.badgeColor}`}>
                    {sys.badge}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    sys.responseType === "사후 대응"
                      ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      : "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                  }`}>
                    {sys.responseType}
                  </span>
                </div>
              </div>

              <div className="mb-1 flex items-baseline gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  {sys.name}
                </h3>
                <span className={`text-sm font-semibold ${sys.textColor}`}>
                  ({sys.abbr})
                </span>
              </div>

              <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                {sys.fullName}
              </p>

              <p className="text-sm text-gray-700 dark:text-gray-300">
                {sys.keyFunction}
              </p>

              <div className={`mt-3 flex items-center gap-1 text-xs ${sys.textColor}`}>
                {openId === sys.id ? (
                  <>
                    <ChevronUp size={14} />
                    <span>접기</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} />
                    <span>상세 보기</span>
                  </>
                )}
              </div>
            </button>

            <AnimatePresence>
              {openId === sys.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className={`rounded-b-xl border-2 border-t-0 ${sys.borderColor} ${sys.bgLight} px-5 pb-5 pt-4`}>
                    <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
                      {sys.description}
                    </p>
                    <ul className="space-y-1.5">
                      {sys.details.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${sys.responseColor}`} />
                          {d}
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

      {/* 요약 비교표 */}
      <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">시스템</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">약어</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">핵심 기능</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">대응 방식</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {systems.map((sys) => (
              <tr
                key={sys.id}
                className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                onClick={() => toggle(sys.id)}
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{sys.name}</td>
                <td className={`px-4 py-3 font-bold ${sys.textColor}`}>{sys.abbr}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{sys.keyFunction}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sys.badgeColor}`}>
                    {sys.responseType}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
