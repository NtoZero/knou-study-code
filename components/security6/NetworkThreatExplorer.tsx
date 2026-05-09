"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertTriangle, Eye, Zap } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface SubThreat {
  name: string;
  desc: string;
}

interface Threat {
  id: string;
  label: string;
  en: string;
  color: string;
  bgLight: string;
  border: string;
  textColor: string;
  badgeClass: string;
  icon: React.ReactNode;
  risk: string;
  desc: string;
  examples: string[];
  subThreats?: SubThreat[];
}

const threats: Threat[] = [
  {
    id: "physical",
    label: "물리적 위협",
    en: "Physical Threats",
    color: "bg-red-500",
    bgLight: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-400",
    textColor: "text-red-700 dark:text-red-300",
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-800/40 dark:text-red-300",
    icon: <AlertTriangle size={18} />,
    risk: "고위험",
    desc: "네트워크의 물리적 인프라 자체를 공격하거나 파괴하는 위협. 소프트웨어적 대응이 불가능한 근본적 위협.",
    examples: [
      "자연재해 — 홍수, 지진, 화재로 인한 장비 파괴",
      "전력 공급 중단 — 정전으로 인한 시스템 다운",
      "기반시설 파괴 — 케이블, 서버실, 통신장비 물리적 파괴",
      "물리적 침입 — 데이터센터 무단 침입, 장비 절도",
    ],
  },
  {
    id: "passive",
    label: "수동적 위협",
    en: "Passive Threats",
    color: "bg-yellow-500",
    bgLight: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-400",
    textColor: "text-yellow-700 dark:text-yellow-300",
    badgeClass: "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/40 dark:text-yellow-300",
    icon: <Eye size={18} />,
    risk: "중위험",
    desc: "데이터 내용을 변경하지 않고 모니터링·도청하는 위협. 탐지가 매우 어렵고 기밀성을 침해함.",
    examples: [
      "네트워크 패킷 스니핑을 통한 비밀번호 수집",
      "암호화되지 않은 이메일 내용 열람",
      "트래픽 패턴 분석으로 통신 시간·빈도 파악",
    ],
    subThreats: [
      {
        name: "도청 (Eavesdropping)",
        desc: "전송 중인 메시지의 내용을 무단으로 탐지·열람. 암호화가 없는 경우 직접 내용 확인 가능.",
      },
      {
        name: "트래픽 분석 (Traffic Analysis)",
        desc: "메시지 내용은 파악하지 못하더라도 통신 패턴(발신자, 수신자, 빈도, 길이)을 분석하여 간접 정보 획득.",
      },
    ],
  },
  {
    id: "active",
    label: "능동적 위협",
    en: "Active Threats",
    color: "bg-orange-500",
    bgLight: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-400",
    textColor: "text-orange-700 dark:text-orange-300",
    badgeClass: "bg-orange-100 text-orange-700 dark:bg-orange-800/40 dark:text-orange-300",
    icon: <Zap size={18} />,
    risk: "최고위험",
    desc: "데이터를 실제로 변조하거나 가짜 데이터를 삽입하는 위협. 탐지 가능하지만 피해가 즉각적.",
    examples: [
      "메시지 내용을 중간에서 바꿔치기",
      "서버에 대량 요청을 보내 정상 사용자 접속 방해",
    ],
    subThreats: [
      {
        name: "위장 (Masquerade)",
        desc: "인가된 사용자인 것처럼 신원을 가장하여 시스템에 접근하는 공격. 인증 우회가 목적.",
      },
      {
        name: "재전송 공격 (Replay)",
        desc: "정상적인 데이터 전송을 캡처한 후 나중에 재전송하여 정당한 전송으로 인식시키는 공격.",
      },
      {
        name: "메시지 변조 (Message Modification)",
        desc: "전송 중인 메시지의 일부를 변경, 삭제, 삽입하여 수신자에게 잘못된 정보를 전달.",
      },
      {
        name: "서비스 거부 (Denial of Service)",
        desc: "시스템·네트워크를 과부하시켜 정상적인 서비스 제공을 불가능하게 만드는 공격(DoS/DDoS).",
      },
    ],
  },
];

export default function NetworkThreatExplorer() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);

  const toggleThreat = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
    setExpandedSub(null);
  };

  const toggleSub = (name: string) => {
    setExpandedSub((prev) => (prev === name ? null : name));
  };

  return (
    <section>
      <SectionTitle
        title="네트워크 보안위협 3종"
        subtitle="물리적·수동적·능동적 위협의 개념과 세부 유형"
      />

      <div className="space-y-4">
        {threats.map((threat) => {
          const isActive = activeId === threat.id;
          return (
            <div
              key={threat.id}
              className={`rounded-xl border-2 ${threat.border} overflow-hidden transition-all`}
            >
              {/* Header */}
              <button
                onClick={() => toggleThreat(threat.id)}
                className={`flex w-full items-center justify-between p-5 text-left transition-colors ${threat.bgLight}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${threat.textColor}`}>{threat.icon}</span>
                  <div>
                    <span className="font-bold text-gray-800 dark:text-gray-100">
                      {threat.label}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {threat.en}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${threat.badgeClass}`}
                  >
                    {threat.risk}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isActive ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={18} className="text-gray-500" />
                </motion.div>
              </button>

              {/* Body */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                      {/* 설명 */}
                      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        {threat.desc}
                      </p>

                      {/* 세부 유형 (subThreats) */}
                      {threat.subThreats && (
                        <div className="mb-4">
                          <h4 className="mb-2 text-xs font-bold uppercase text-gray-500">
                            세부 유형 ({threat.subThreats.length}종)
                          </h4>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {threat.subThreats.map((sub) => (
                              <button
                                key={sub.name}
                                onClick={() => toggleSub(sub.name)}
                                className={`rounded-lg border p-3 text-left transition-all ${
                                  expandedSub === sub.name
                                    ? `${threat.bgLight} ${threat.border}`
                                    : "border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {sub.name}
                                  </span>
                                  <ChevronDown
                                    size={14}
                                    className={`transition-transform ${
                                      expandedSub === sub.name ? "rotate-180" : ""
                                    } text-gray-400`}
                                  />
                                </div>
                                <AnimatePresence>
                                  {expandedSub === sub.name && (
                                    <motion.p
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.15 }}
                                      className="mt-2 overflow-hidden text-xs text-gray-500 dark:text-gray-400"
                                    >
                                      {sub.desc}
                                    </motion.p>
                                  )}
                                </AnimatePresence>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 예시 목록 */}
                      <div>
                        <h4 className="mb-2 text-xs font-bold uppercase text-gray-500">
                          대표 예시
                        </h4>
                        <ul className="space-y-1.5">
                          {threat.examples.map((ex, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                            >
                              <span
                                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${threat.color}`}
                              />
                              {ex}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 비교 요약 */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h4 className="mb-3 text-xs font-bold uppercase text-gray-500">
          위협 유형 비교
        </h4>
        <div className="grid gap-2 text-xs sm:grid-cols-3">
          {[
            { label: "물리적", key: "데이터 내용", val: "무관", c: "text-red-600" },
            { label: "수동적", key: "데이터 변경", val: "없음 (모니터링만)", c: "text-yellow-600" },
            { label: "능동적", key: "데이터 변경", val: "있음 (변조/삽입)", c: "text-orange-600" },
          ].map((row) => (
            <div
              key={row.label}
              className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
            >
              <div className={`font-bold ${row.c}`}>{row.label}</div>
              <div className="mt-1 text-gray-500">
                {row.key}: <span className="text-gray-700 dark:text-gray-300">{row.val}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
