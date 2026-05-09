"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Database, Cpu, Settings, Eye, Globe, Terminal, FileCheck, Search } from "lucide-react";
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
    detail: "컴퓨터 시스템과 네트워크에서 보안 관련 데이터를 수집하는 단계. 로그 파일, 네트워크 패킷, 시스템 콜 등 다양한 소스에서 원시 데이터를 획득함.",
    items: ["시스템 로그 수집", "네트워크 패킷 캡처", "시스템 콜 감시", "파일 해시 수집", "취약점 스캐닝"],
  },
  {
    id: "analyze",
    label: "분석조치부",
    en: "Analysis",
    icon: <Cpu size={20} />,
    color: "bg-purple-600",
    bgLight: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-400",
    textColor: "text-purple-700 dark:text-purple-300",
    role: "침입 여부 판단",
    detail: "수집된 데이터를 분석하여 침입·공격 여부를 판단하는 핵심 단계. 시그니처 비교, 통계적 이상탐지, 무결성 검사 등의 분석 기법을 적용함.",
    items: ["시그니처 기반 분석", "통계적 이상탐지", "무결성 검사", "패턴 매칭", "행위 분석"],
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
    role: "정책·경보·대응",
    detail: "침입 탐지 결과에 따라 보안 정책을 관리하고 경보를 발생시키며 대응 조치를 취하는 단계. 관리자에게 알림을 보내고 로그를 기록함.",
    items: ["보안 정책 관리", "경보(Alert) 발생", "대응 조치 수행", "로그 기록·보관", "관리자 통보"],
  },
];

interface MonitorMethod {
  id: string;
  icon: React.ReactNode;
  title: string;
  en: string;
  desc: string;
  color: string;
}

const monitorMethods: MonitorMethod[] = [
  {
    id: "syslog",
    icon: <Database size={16} />,
    title: "시스템 로그 모니터링",
    en: "System Log Monitoring",
    desc: "OS 및 애플리케이션이 생성하는 로그 파일을 분석. 로그인 시도, 권한 변경, 오류 이벤트 등을 기록한 파일을 주기적으로 검사하여 이상 징후를 탐지함.",
    color: "fuchsia",
  },
  {
    id: "nettraffic",
    icon: <Globe size={16} />,
    title: "네트워크 트래픽 모니터링",
    en: "Network Traffic Monitoring",
    desc: "네트워크를 흐르는 패킷을 캡처하여 패턴을 분석. 포트 스캔, DDoS, 비정상 프로토콜 사용 등의 공격 행위를 탐지함.",
    color: "purple",
  },
  {
    id: "syscall",
    icon: <Terminal size={16} />,
    title: "시스템 콜 모니터링",
    en: "System Call Monitoring",
    desc: "운영체제 커널 수준에서 시스템 콜(read, write, exec 등)을 감시. 프로세스가 OS 자원에 접근하는 방식을 추적하여 악성 행위를 탐지함.",
    color: "violet",
  },
  {
    id: "integrity",
    icon: <FileCheck size={16} />,
    title: "파일 무결성 모니터링",
    en: "File Integrity Monitoring",
    desc: "중요 시스템 파일의 해시값(MD5, SHA 등)을 사전에 저장해두고, 주기적으로 현재 해시값과 비교하여 변경 여부를 탐지함.",
    color: "pink",
  },
  {
    id: "vulnscan",
    icon: <Search size={16} />,
    title: "취약점 스캐닝",
    en: "Vulnerability Scanning",
    desc: "시스템과 네트워크에서 알려진 취약점이 존재하는지 정기적으로 검사. 패치되지 않은 소프트웨어, 잘못된 설정 등을 발견함.",
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

export default function IDSArchitectureDiagram() {
  const [activePart, setActivePart] = useState<string | null>(null);
  const [openMethod, setOpenMethod] = useState<string | null>(null);

  return (
    <section>
      <SectionTitle
        title="IDS 구성 3부"
        subtitle="Intrusion Detection System — 침입탐지시스템의 3단계 구성 구조"
      />

      {/* Flow Diagram */}
      <div className="mb-4 flex flex-col items-center gap-0 sm:flex-row sm:items-stretch sm:justify-center">
        {parts.map((part, idx) => (
          <div key={part.id} className="flex flex-col items-center sm:flex-row sm:items-center">
            {/* Part Box */}
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

            {/* Arrow between parts */}
            {idx < parts.length - 1 && (
              <div className="flex flex-col items-center sm:flex-row">
                {/* vertical arrow (mobile) */}
                <div className="flex h-8 flex-col items-center sm:hidden">
                  <div className="h-6 w-0.5 bg-gray-400 dark:bg-gray-600" />
                  <div className="border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-400 dark:border-t-gray-500" />
                </div>
                {/* horizontal arrow (sm+) */}
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
          모니터링 방법 5종
          <span className="ml-2 text-xs font-normal text-gray-500">모니터링부에서 사용하는 데이터 수집 방법</span>
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
                    <div className="border-t border-current border-opacity-20 px-4 pb-3 pt-2">
                      <p className="text-sm leading-relaxed opacity-90">{m.desc}</p>
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
