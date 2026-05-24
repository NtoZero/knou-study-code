"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Cpu, Settings, Eye, Layers, Monitor, Crosshair, Globe, LayoutGrid, Clock, Zap, CheckCircle, XCircle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface Part {
  id: string;
  label: string;
  en: string;
  icon: React.ReactNode;
  color: string;
  bgLight: string;
  border: string;
  textColor: string;
  role: string;
  detail: string;
  items: string[];
}

const parts: Part[] = [
  {
    id: "monitor",
    label: "모니터링부",
    en: "Monitoring",
    icon: <Eye size={20} />,
    color: "bg-fuchsia-500",
    bgLight: "bg-fuchsia-50 dark:bg-fuchsia-900/20",
    border: "border-fuchsia-400",
    textColor: "text-fuchsia-700 dark:text-fuchsia-300",
    role: "데이터 수집",
    detail:
      "데이터 소스(호스트·네트워크 등)로부터 센서가 활동 데이터를 수집하는 단계. 수집된 데이터는 이벤트 형태로 분석기에 전달됨.",
    items: ["데이터 소스에서 센서로 활동 전달", "응용·호스트·네트워크 등 다양한 소스", "수집 데이터를 이벤트로 변환하여 전달"],
  },
  {
    id: "analyze",
    label: "분석 및 조치부",
    en: "Analysis & Action",
    icon: <Cpu size={20} />,
    color: "bg-purple-600",
    bgLight: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-400",
    textColor: "text-purple-700 dark:text-purple-300",
    role: "정보가공·침입탐지·보고·조치",
    detail:
      "분석기(Analyzer)가 이벤트를 수신하여 침입 여부를 분석하고, 판단기(Director)가 운영자에게 알림을 보내고 조치를 취하는 단계. 3단계 내부 흐름: 정보가공·축약 → 분석·침입탐지 → 보고·조치.",
    items: ["분석기: 이벤트 수신 → 침입 여부 판단", "판단기: 알림 발생 → 조치 수행", "운영자: 경보 수신 → 대응"],
  },
  {
    id: "manage",
    label: "관리부",
    en: "Management",
    icon: <Settings size={20} />,
    color: "bg-violet-600",
    bgLight: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-400",
    textColor: "text-violet-700 dark:text-violet-300",
    role: "보안정책 제공·통제",
    detail:
      "관리자가 모니터링부와 분석 및 조치부에 보안정책을 제공하고, 두 부서를 통제·관리하는 단계. IDS 전체 동작의 정책 근거를 제공함.",
    items: ["모니터링부·분석 및 조치부 전체 통제", "보안정책을 분석기·판단기에 제공", "IDS 설정·정책 변경 관리"],
  },
];

interface MonitorMethod {
  id: string;
  icon: React.ReactNode;
  title: string;
  en: string;
  desc: string;
  pros: string[];
  cons: string[];
  color: string;
}

const monitorMethods: MonitorMethod[] = [
  {
    id: "app",
    icon: <Layers size={16} />,
    title: "응용 기반",
    en: "Application-based",
    desc: "애플리케이션 계층에서 정보 수집. DB 관리 소프트웨어, 웹 서버, 방화벽 등에 의해 생성된 로그를 포함하여 분석.",
    pros: ["시스템상의 미세한 침입행위 탐지 가능", "특정 응용 서비스에 대한 사용자 행위 모니터링"],
    cons: ["애플리케이션 계층 취약성으로 탐지방법의 무결성 훼손 가능"],
    color: "fuchsia",
  },
  {
    id: "host",
    icon: <Monitor size={16} />,
    title: "호스트 기반",
    en: "Host-based",
    desc: "특정 시스템에서 발생하는 행위에 대한 정보 수집. 시스템 로그, 운영체제 프로세스에 의해 생성된 로그를 포함.",
    pros: ["문제 행위를 지정된 사용자 ID에 매핑 가능", "오용 관련 행동변경 추적 가능", "암호화된 환경에서도 동작 가능"],
    cons: ["네트워크 행위가 보이지 않음", "운영체제 취약성으로 에이전트와 분석도구 무결성 훼손 가능"],
    color: "purple",
  },
  {
    id: "target",
    icon: <Crosshair size={16} />,
    title: "목표 기반",
    en: "Target-based",
    desc: "목표 객체(데이터, 프로세스)에 대한 무결성 분석. 공격 프로세스의 결과인 특정 파일과 시스템 객체 등을 모니터링.",
    pros: ["다른 방법으로는 탐지 불가한 침입도 탐지", "시스템 변형 공격의 존재 유무를 신뢰성 있게 탐지", "복구 시 대체해야 할 파일을 결정하여 효율적으로 복구"],
    cons: ["하위 단말 시스템의 프로세스에 많은 부하", "실시간 탐지 프로세스에는 부적합"],
    color: "violet",
  },
  {
    id: "network",
    icon: <Globe size={16} />,
    title: "네트워크 기반",
    en: "Network-based",
    desc: "네트워크로부터 정보 수집. 무차별 모드(Promiscuous Mode)를 이용한 패킷 스니핑으로 데이터 수집.",
    pros: ["감사나 로그 메커니즘을 위한 특별한 요구사항 필요 없음", "SYN flooding, 패킷 폭풍 같은 네트워크 공격 모니터링"],
    cons: ["호스트상에서 수행되는 세부 행위 탐지 불가", "트래픽이 암호화되어 있으면 프로토콜·내용 스캔 불가", "고속 대규모 네트워크에서는 동작되지 않음"],
    color: "pink",
  },
  {
    id: "integrated",
    icon: <LayoutGrid size={16} />,
    title: "통합방식",
    en: "Integrated Approaches",
    desc: "응용 기반, 호스트 기반, 네트워크 기반 센서들을 조합하여 모든 계층을 동시에 모니터링.",
    pros: ["모든 레벨에서의 행위를 모니터링 가능", "시간이나 공간의 제약 없이 모니터링하기 용이", "사고분석과 합법적 처리(범죄고발 등) 수행에 도움"],
    cons: ["구성요소 간 상호동작성을 위한 산업표준 부재로 요소 결합이 어려움", "통합된 시스템의 관리와 이행이 어려움"],
    color: "rose",
  },
];

const colorMap: Record<string, string> = {
  fuchsia: "bg-fuchsia-100 border-fuchsia-300 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:border-fuchsia-700 dark:text-fuchsia-200",
  purple: "bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-200",
  violet: "bg-violet-100 border-violet-300 text-violet-800 dark:bg-violet-900/30 dark:border-violet-700 dark:text-violet-200",
  pink: "bg-pink-100 border-pink-300 text-pink-800 dark:bg-pink-900/30 dark:border-pink-700 dark:text-pink-200",
  rose: "bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-900/30 dark:border-rose-700 dark:text-rose-200",
};

const TIMING_METHODS = [
  {
    id: "batch",
    icon: <Clock size={20} />,
    label: "일괄처리 방식",
    en: "Batch Processing",
    desc: "일정한 시간단위로 배치 방식에 의해 정보를 수집 및 분석.",
    pros: [
      "보안위협 수준이 낮고 단일공격에 의한 시스템 손상 가능성이 높을 경우 적합",
      "실시간 방식보다 시스템에 대한 프로세스 부하가 적음",
      "시스템과 인적 자원이 제한된 조직에 적합",
    ],
    cons: [
      "사건발생에 대한 즉각적인 대응이 어려움",
      "수집된 정보집합은 분석 시스템상의 디스크 저장공간을 많이 소비",
    ],
    color: "bg-amber-500",
    bgLight: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-400",
    textColor: "text-amber-700 dark:text-amber-300",
  },
  {
    id: "realtime",
    icon: <Zap size={20} />,
    label: "실시간 방식",
    en: "Real-time Processing",
    desc: "연속적인 정보수집과 분석, 보고기능 제공. 공격을 방해하기 위해 탐지 프로세스가 빠른 응답을 발생시킴. 이메일·SMS 등을 통한 오프사이트 경고 지원.",
    pros: [
      "관리자가 공격을 저지할 수 있도록 충분히 빠른 공격탐지 가능",
      "관리자는 시스템 복구를 위한 사고처리를 빠르게 수행할 수 있음",
    ],
    cons: [
      "많은 메모리와 프로세스 리소스 소비",
      "설정값이 잘못되면 허위경고가 많이 발생할 수 있음",
    ],
    color: "bg-blue-600",
    bgLight: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-400",
    textColor: "text-blue-700 dark:text-blue-300",
  },
];

export default function IDSArchitectureDiagram() {
  const [activePart, setActivePart] = useState<string | null>(null);
  const [openMethod, setOpenMethod] = useState<string | null>(null);
  const [activeTiming, setActiveTiming] = useState<string | null>(null);

  return (
    <section>
      <SectionTitle
        title="IDS 구성 3부"
        subtitle="Intrusion Detection System — 모니터링부 · 분석 및 조치부 · 관리부"
      />

      {/* Flow Diagram */}
      <div className="mb-4 flex flex-col items-center gap-0 sm:flex-row sm:items-stretch sm:justify-center">
        {parts.map((part, idx) => (
          <div key={part.id} className="flex flex-col items-center sm:flex-row sm:items-center">
            <motion.button
              onClick={() => setActivePart(activePart === part.id ? null : part.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`group relative w-64 sm:w-48 md:w-56 rounded-xl border-2 ${part.border} ${part.bgLight} p-5 text-left transition-all hover:shadow-md`}
            >
              <div className={`mb-2 flex items-center gap-2 ${part.textColor}`}>
                {part.icon}
                <span className="text-xs font-semibold uppercase tracking-wide">{part.en}</span>
              </div>
              <div className="text-base font-bold text-gray-800 dark:text-gray-100">{part.label}</div>
              <div className={`mt-1 text-xs font-medium ${part.textColor}`}>{part.role}</div>
              <ChevronDown
                size={14}
                className={`absolute right-3 top-3 transition-transform ${part.textColor} ${activePart === part.id ? "rotate-180" : ""}`}
              />
            </motion.button>

            {idx < parts.length - 1 && (
              <div className="flex flex-col items-center sm:flex-row">
                <div className="flex h-8 flex-col items-center sm:hidden">
                  <div className="h-6 w-0.5 bg-gray-400 dark:bg-gray-600" />
                  <div className="border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-400 dark:border-t-gray-500" />
                </div>
                <div className="hidden sm:flex sm:flex-row sm:items-center">
                  <div className="h-0.5 w-6 bg-gray-400 dark:bg-gray-600" />
                  <div className="border-b-4 border-l-4 border-t-4 border-b-transparent border-l-gray-400 border-t-transparent dark:border-l-gray-500" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detail Panel */}
      <AnimatePresence mode="wait">
        {activePart && (() => {
          const part = parts.find(p => p.id === activePart)!;
          return (
            <motion.div
              key={activePart}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className={`mb-6 rounded-xl border ${part.border} ${part.bgLight} p-5`}>
                <h3 className={`mb-2 text-base font-bold ${part.textColor}`}>{part.label} — {part.en}</h3>
                <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">{part.detail}</p>
                <div className="flex flex-wrap gap-2">
                  {part.items.map(item => (
                    <span key={item} className={`rounded-full px-3 py-1 text-xs font-medium border ${part.border} ${part.bgLight} ${part.textColor}`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Monitoring Methods */}
      <div className="mt-8">
        <h3 className="mb-4 text-base font-bold text-gray-800 dark:text-gray-100">
          IDS 모니터링 방법 5종
          <span className="ml-2 text-xs font-normal text-gray-500">— 데이터를 어디서 수집하는가</span>
        </h3>
        <div className="space-y-2">
          {monitorMethods.map((m) => (
            <div key={m.id} className={`rounded-xl border ${colorMap[m.color]} overflow-hidden`}>
              <button
                onClick={() => setOpenMethod(openMethod === m.id ? null : m.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span>{m.icon}</span>
                <span className="flex-1 text-sm font-semibold">{m.title}</span>
                <span className="text-xs opacity-70">{m.en}</span>
                <ChevronDown
                  size={14}
                  className={`ml-2 shrink-0 transition-transform ${openMethod === m.id ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {openMethod === m.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-current border-opacity-20 px-4 pb-4 pt-2 space-y-3">
                      <p className="text-sm leading-relaxed opacity-90">{m.desc}</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <div className="mb-1.5 flex items-center gap-1 text-xs font-bold text-green-700 dark:text-green-300">
                            <CheckCircle size={12} /> 장점
                          </div>
                          {m.pros.map((p) => (
                            <div key={p} className="text-xs text-gray-700 dark:text-gray-300">· {p}</div>
                          ))}
                        </div>
                        <div>
                          <div className="mb-1.5 flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400">
                            <XCircle size={12} /> 단점
                          </div>
                          {m.cons.map((c) => (
                            <div key={c} className="text-xs text-gray-700 dark:text-gray-300">· {c}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* 분석시기 */}
      <div className="mt-8">
        <h3 className="mb-4 text-base font-bold text-gray-800 dark:text-gray-100">
          IDS 정보수집과 분석시기
          <span className="ml-2 text-xs font-normal text-gray-500">— 언제 분석하는가</span>
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {TIMING_METHODS.map((t) => (
            <div
              key={t.id}
              className={`rounded-xl border-2 ${t.border} ${t.bgLight} overflow-hidden cursor-pointer`}
              onClick={() => setActiveTiming(activeTiming === t.id ? null : t.id)}
            >
              <div className="flex items-center gap-3 p-4">
                <div className={`rounded-lg ${t.color} p-2 text-white shrink-0`}>{t.icon}</div>
                <div className="flex-1">
                  <div className={`text-sm font-bold ${t.textColor}`}>{t.label}</div>
                  <div className="text-xs text-gray-400">{t.en}</div>
                </div>
                <ChevronDown
                  size={14}
                  className={`shrink-0 ${t.textColor} transition-transform ${activeTiming === t.id ? "rotate-180" : ""}`}
                />
              </div>
              <AnimatePresence>
                {activeTiming === t.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className={`border-t ${t.border} px-4 pb-4 pt-3 space-y-3`}>
                      <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">{t.desc}</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <div className="mb-1 flex items-center gap-1 text-xs font-bold text-green-700 dark:text-green-300">
                            <CheckCircle size={11} /> 장점
                          </div>
                          {t.pros.map((p) => (
                            <div key={p} className="text-xs text-gray-600 dark:text-gray-400">· {p}</div>
                          ))}
                        </div>
                        <div>
                          <div className="mb-1 flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400">
                            <XCircle size={11} /> 단점
                          </div>
                          {t.cons.map((c) => (
                            <div key={c} className="text-xs text-gray-600 dark:text-gray-400">· {c}</div>
                          ))}
                        </div>
                      </div>
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
