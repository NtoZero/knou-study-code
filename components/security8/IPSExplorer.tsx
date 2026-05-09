"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ShieldX, Monitor, Globe, ArrowRight, AlertCircle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

type Mode = "ids" | "ips";

const comparisonRows = [
  { category: "정의", ids: "침입 탐지 후 경보 발생", ips: "침입 탐지 즉시 차단" },
  { category: "동작 방식", ids: "Passive (수동) — 관찰 후 알림", ips: "Active (능동) — 즉각 차단" },
  { category: "네트워크 위치", ids: "네트워크 밖 (스니핑 방식)", ips: "인라인(Inline) — 트래픽 경로 직접 위치" },
  { category: "오탐(FP) 영향", ids: "경보만 발생 (트래픽 영향 없음)", ips: "정상 트래픽도 차단될 수 있음" },
  { category: "응답 시간", ids: "사후 대응", ips: "실시간 차단" },
  { category: "성능 영향", ids: "거의 없음", ips: "처리 지연(Latency) 발생 가능" },
  { category: "가용성 위험", ids: "낮음", ips: "높음 (오탐 시 서비스 중단)" },
];

const ipsTypes = [
  {
    id: "hips",
    icon: <Monitor size={20} />,
    label: "HIPS",
    full: "Host-based IPS",
    korean: "호스트 기반 IPS",
    color: "bg-fuchsia-50 border-fuchsia-300 dark:bg-fuchsia-900/20 dark:border-fuchsia-700",
    textColor: "text-fuchsia-700 dark:text-fuchsia-300",
    badgeColor: "bg-fuchsia-500",
    desc: "개별 호스트에 에이전트로 설치하여 해당 호스트의 비정상 행위를 탐지하고 즉시 차단. 애플리케이션 수준의 세밀한 제어 가능.",
    features: [
      "애플리케이션 수준 행위 제어",
      "OS 커널 수준 모니터링",
      "프로세스별 권한 제어",
      "암호화 트래픽도 분석 가능",
    ],
  },
  {
    id: "nips",
    icon: <Globe size={20} />,
    label: "NIPS",
    full: "Network-based IPS",
    korean: "네트워크 기반 IPS",
    color: "bg-purple-50 border-purple-300 dark:bg-purple-900/20 dark:border-purple-700",
    textColor: "text-purple-700 dark:text-purple-300",
    badgeColor: "bg-purple-600",
    desc: "네트워크 경로에 인라인으로 배치하여 지나가는 모든 트래픽을 검사하고 악성 트래픽을 실시간으로 차단. 네트워크 전체를 보호.",
    features: [
      "네트워크 전체 트래픽 검사",
      "실시간 패킷 차단",
      "DDoS 공격 대응",
      "프로토콜 이상 탐지·차단",
    ],
  },
];

export default function IPSExplorer() {
  const [mode, setMode] = useState<Mode>("ids");
  const [highlightRow, setHighlightRow] = useState<number | null>(null);

  return (
    <section>
      <SectionTitle
        title="IPS — 침입방지시스템"
        subtitle="IDS의 탐지 기능에 실시간 차단을 추가한 능동형 보안 시스템"
      />

      {/* IDS vs IPS Concept Toggle */}
      <div className="mb-8">
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setMode("ids")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              mode === "ids"
                ? "bg-fuchsia-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            <Eye size={15} />
            IDS 모드 (탐지만)
          </button>
          <button
            onClick={() => setMode("ips")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              mode === "ips"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            <ShieldX size={15} />
            IPS 모드 (탐지+차단)
          </button>
        </div>

        {/* Network Diagram */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className={`rounded-xl border p-5 ${
              mode === "ids"
                ? "border-fuchsia-300 bg-fuchsia-50 dark:border-fuchsia-700 dark:bg-fuchsia-900/20"
                : "border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20"
            }`}
          >
            <div className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
              {mode === "ids" ? "IDS — 탐지 후 경보 방식" : "IPS — 인라인 배치·실시간 차단 방식"}
            </div>

            {/* Network flow */}
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
              {/* Internet */}
              <div className="flex flex-col items-center">
                <div className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 shadow-sm">
                  인터넷
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Internet</div>
              </div>

              <ArrowRight size={16} className="text-gray-400" />

              {/* Router */}
              <div className="flex flex-col items-center">
                <div className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 shadow-sm">
                  라우터
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Router</div>
              </div>

              <ArrowRight size={16} className="text-gray-400" />

              {/* IDS or IPS */}
              {mode === "ids" ? (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="rounded-lg border-2 border-fuchsia-400 bg-fuchsia-100 px-3 py-2 text-xs font-bold text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300 shadow-sm">
                      IDS (스니핑)
                    </div>
                    {/* Arrow off to side indicating passive monitoring */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <div className="text-[10px] font-semibold text-fuchsia-600">경보 발생</div>
                      <div className="h-3 w-0.5 bg-fuchsia-400" />
                      <div className="h-0 w-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-fuchsia-400" />
                    </div>
                  </div>
                  <div className="text-[10px] text-fuchsia-600 mt-0.5 font-medium">탐지 전용 (밖에서 감시)</div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="rounded-lg border-2 border-purple-500 bg-purple-600 px-3 py-2 text-xs font-bold text-white shadow-md">
                    IPS (인라인)
                  </div>
                  <div className="text-[10px] text-purple-600 dark:text-purple-400 mt-0.5 font-medium">경로 직접 삽입</div>
                </div>
              )}

              {mode === "ids" ? (
                <ArrowRight size={16} className="text-gray-400" />
              ) : (
                <div className="flex items-center gap-1">
                  <div className="text-[10px] font-bold text-red-500">악성</div>
                  <div className="flex flex-col items-center">
                    <div className="text-red-500 text-[10px] font-bold">차단</div>
                    <div className="h-4 w-6 border-2 border-red-400 rounded bg-red-50 flex items-center justify-center">
                      <span className="text-red-600 text-[10px] font-bold">X</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <ArrowRight size={14} className="text-green-500" />
                    <div className="text-[10px] font-bold text-green-600">정상</div>
                  </div>
                </div>
              )}

              {mode === "ids" && <ArrowRight size={16} className="text-gray-400" />}

              {/* Internal Network */}
              <div className="flex flex-col items-center">
                <div className="rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300 shadow-sm">
                  내부 네트워크
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Internal Network</div>
              </div>
            </div>

            {mode === "ids" && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-fuchsia-100/60 dark:bg-fuchsia-900/30 p-3">
                <AlertCircle size={14} className="mt-0.5 shrink-0 text-fuchsia-600" />
                <p className="text-xs text-fuchsia-800 dark:text-fuchsia-200">
                  IDS는 트래픽 경로 밖에서 <strong>스니핑(Sniffing)</strong> 방식으로 데이터를 복사하여 분석. 트래픽 자체는 차단하지 않고 경보만 발생시킴.
                </p>
              </div>
            )}
            {mode === "ips" && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-purple-100/60 dark:bg-purple-900/30 p-3">
                <AlertCircle size={14} className="mt-0.5 shrink-0 text-purple-600" />
                <p className="text-xs text-purple-800 dark:text-purple-200">
                  IPS는 트래픽 경로에 <strong>인라인(Inline)</strong>으로 배치되어 모든 패킷이 IPS를 통과. 악성 패킷은 즉시 차단하고 정상 패킷만 통과시킴. 오탐(FP) 시 정상 트래픽도 차단될 수 있어 주의 필요.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* HIPS vs NIPS */}
      <div className="mb-8">
        <h3 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-100">IPS 분류 — HIPS vs NIPS</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {ipsTypes.map(t => (
            <div key={t.id} className={`rounded-xl border-2 ${t.color} p-5`}>
              <div className="mb-3 flex items-center gap-3">
                <div className={`rounded-lg ${t.badgeColor} p-2 text-white`}>
                  {t.icon}
                </div>
                <div>
                  <div className={`text-lg font-bold ${t.textColor}`}>{t.label}</div>
                  <div className="text-xs text-gray-500">{t.full} — {t.korean}</div>
                </div>
              </div>
              <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">{t.desc}</p>
              <ul className="space-y-1">
                {t.features.map((f, i) => (
                  <li key={i} className={`flex items-center gap-2 text-xs ${t.textColor}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${t.badgeColor}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* IDS vs IPS Comprehensive Comparison */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-100">IDS vs IPS 종합 비교</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">항목</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-fuchsia-600 dark:text-fuchsia-400">
                  <Eye size={12} className="mr-1 inline" />IDS
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-purple-600 dark:text-purple-400">
                  <ShieldX size={12} className="mr-1 inline" />IPS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {comparisonRows.map((row, i) => (
                <tr
                  key={i}
                  onMouseEnter={() => setHighlightRow(i)}
                  onMouseLeave={() => setHighlightRow(null)}
                  className={`cursor-default transition-colors ${highlightRow === i ? "bg-gray-50 dark:bg-gray-800/40" : ""}`}
                >
                  <td className="px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400">{row.category}</td>
                  <td className={`px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 ${highlightRow === i ? "text-fuchsia-700 dark:text-fuchsia-300 font-medium" : ""}`}>
                    {row.ids}
                  </td>
                  <td className={`px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 ${highlightRow === i ? "text-purple-700 dark:text-purple-300 font-medium" : ""}`}>
                    {row.ips}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
