"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

type Mode = "closed" | "open";

const closedArchitectures = [
  {
    name: "SNA",
    full: "System Network Architecture",
    vendor: "IBM",
    year: "1974",
    desc: "IBM 컴퓨터 간에 데이터 통신과 메시지 전송을 위해 설계된 대표적 폐쇄형 네트워크 아키텍처. IBM 시스템 내부에서만 자원 공유 가능.",
    color: "from-blue-500 to-blue-700",
  },
  {
    name: "DNA",
    full: "Digital Network Architecture",
    vendor: "DEC",
    year: "1975",
    desc: "최초의 P2P(Peer-to-Peer) 네트워크 구조 중 하나로 발전. DECnet이라는 이름으로도 알려짐.",
    color: "from-violet-500 to-violet-700",
  },
  {
    name: "DSA",
    full: "Distributed System Architecture",
    vendor: "Honeywell",
    year: "1977",
    desc: "IBM의 SNA와 경쟁하기 위해 Honeywell이 개발한 분산 시스템 아키텍처.",
    color: "from-amber-500 to-amber-700",
  },
];

const openComparisonRows = [
  { label: "주요 특징", osi: "개방형 시스템 상호 연결", tcpip: "전송제어 및 인터넷 프로토콜" },
  {
    label: "의미",
    osi: "컴퓨터 통신망의 이론적 모델",
    tcpip: "인터넷을 통해 데이터를 전송하는 데 사용되는 클라이언트-서버 모델",
  },
  { label: "레이어 수", osi: "7", tcpip: "4" },
  { label: "개발 주체", osi: "ISO (국제표준기구)", tcpip: "미국 국방부(DoD)" },
  { label: "제정 연도", osi: "1983 (ISO 7498)", tcpip: "1982 (미군 표준)" },
  { label: "활용", osi: "교육·이론·참조 모델", tcpip: "실제 인터넷 구현 표준" },
];

export default function NetworkArchitectureIntro() {
  const [mode, setMode] = useState<Mode>("closed");
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section>
      <SectionTitle
        title="네트워크 아키텍처의 진화"
        subtitle="초기 폐쇄형 아키텍처에서 자원 공유를 위한 개방형 아키텍처로 발전. 탭을 전환하며 두 방식을 비교해 보세요."
      />

      {/* Toggle */}
      <div className="mb-6 inline-flex rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
        <button
          onClick={() => setMode("closed")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === "closed"
              ? "bg-lime-500 text-white"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400"
          }`}
        >
          <Lock size={14} />
          폐쇄형 (초기)
        </button>
        <button
          onClick={() => setMode("open")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === "open"
              ? "bg-lime-500 text-white"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400"
          }`}
        >
          <Unlock size={14} />
          개방형 (자원공유 이점 발견 후)
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "closed" ? (
          <motion.div
            key="closed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              초기에는 보안상 문제로 자원을 공유하지 않는 <b>폐쇄형 네트워크 아키텍처</b>가 주류였음. 아래 카드를 클릭하여 상세 내용을 확인하세요.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {closedArchitectures.map((a) => (
                <button
                  key={a.name}
                  onClick={() => setSelected(selected === a.name ? null : a.name)}
                  className={`group relative overflow-hidden rounded-xl border p-5 text-left transition-all ${
                    selected === a.name
                      ? "border-lime-500 shadow-lg"
                      : "border-gray-200 hover:border-lime-300 dark:border-gray-700"
                  } bg-white dark:bg-gray-900`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-10 ${a.color}`}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {a.name}
                      </span>
                      <span className="text-xs text-gray-400">{a.year}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">{a.full}</div>
                    <div className="mt-3 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {a.vendor}
                    </div>
                    <AnimatePresence>
                      {selected === a.name && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 overflow-hidden text-xs text-gray-600 dark:text-gray-400"
                        >
                          {a.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-5 rounded-lg border border-dashed border-gray-300 p-4 text-xs text-gray-500 dark:border-gray-700">
              <b>한계</b> — 벤더마다 아키텍처가 달라 이기종 시스템 간 상호 통신이 어려웠음. 자원 공유의 이점이 알려지면서 표준화된 개방형 아키텍처의 필요성이 대두됨.
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              상호 간 접속을 자유롭게 하는 <b>개방형 네트워크 아키텍처</b>의 대표 사례는 <b>OSI 참조 모델</b>과 <b>TCP/IP(인터넷 통신망 구조)</b>임.
            </p>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="w-32 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                      항목
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-lime-700 dark:text-lime-400">
                      OSI 참조 모델
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      인터넷 통신망 구조 (TCP/IP)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {openComparisonRows.map((r, i) => (
                    <tr
                      key={r.label}
                      className={
                        i % 2 === 0
                          ? "bg-white dark:bg-gray-900"
                          : "bg-gray-50/50 dark:bg-gray-800/30"
                      }
                    >
                      <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                        {r.label}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.osi}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{r.tcpip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-lime-200 bg-lime-50 p-4 text-xs dark:border-lime-900 dark:bg-lime-950/30">
                <div className="mb-1 font-bold text-lime-700 dark:text-lime-300">OSI 참조 모델</div>
                <p className="text-gray-600 dark:text-gray-400">
                  이론적 프레임워크로서 7계층을 정의. 실제 구현보다는 <b>표준화·교육·설계 참조</b>에 주로 활용됨.
                </p>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs dark:border-emerald-900 dark:bg-emerald-950/30">
                <div className="mb-1 font-bold text-emerald-700 dark:text-emerald-300">TCP/IP</div>
                <p className="text-gray-600 dark:text-gray-400">
                  미 국방부 ARPA 주도로 1970년대 개발. 실제 인터넷의 <b>사실상 표준</b>으로 자리잡은 4계층 모델.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
