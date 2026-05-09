"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Settings, Globe } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface Mechanism {
  name: string;
  desc: string;
  relation?: string;
}

interface Category {
  id: string;
  label: string;
  en: string;
  icon: React.ReactNode;
  color: string;
  bgLight: string;
  border: string;
  textColor: string;
  summary: string;
  items: Mechanism[];
}

const categories: Category[] = [
  {
    id: "specific",
    label: "특정 보안 메커니즘",
    en: "Specific Security Mechanisms",
    icon: <Settings size={16} />,
    color: "bg-purple-600",
    bgLight: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-400",
    textColor: "text-purple-700 dark:text-purple-300",
    summary: "OSI 특정 계층에 삽입하여 특정 보안서비스를 제공하는 메커니즘 (8종)",
    items: [
      {
        name: "암호화 (Encipherment)",
        desc: "데이터를 암호화하여 기밀성을 제공. 대칭키·공개키 암호 알고리즘 사용.",
        relation: "기밀성 보안서비스와 직접 연관",
      },
      {
        name: "디지털서명 (Digital Signature)",
        desc: "발신자가 개인키로 서명하여 수신자가 공개키로 검증. 인증과 부인방지 제공.",
        relation: "인증·부인방지 보안서비스와 연관",
      },
      {
        name: "접근제어 (Access Control)",
        desc: "인가된 개체만이 자원에 접근할 수 있도록 접근 권한을 제어하는 메커니즘.",
        relation: "접근제어 보안서비스와 연관",
      },
      {
        name: "데이터 무결성 (Data Integrity)",
        desc: "해시함수, MAC 등을 이용하여 데이터가 변조되지 않았음을 검증하는 메커니즘.",
        relation: "데이터 무결성 보안서비스와 연관",
      },
      {
        name: "인증교환 (Authentication Exchange)",
        desc: "통신 상대방과 인증 정보를 교환하여 서로의 신원을 확인하는 메커니즘.",
        relation: "인증 보안서비스와 연관",
      },
      {
        name: "트래픽패딩 (Traffic Padding)",
        desc: "트래픽 흐름 분석을 방해하기 위해 더미 트래픽을 삽입하는 메커니즘.",
        relation: "트래픽 흐름 기밀성 보안서비스와 연관",
      },
      {
        name: "라우팅제어 (Routing Control)",
        desc: "신뢰할 수 있는 경로나 네트워크를 선택하여 데이터를 전송하는 메커니즘.",
        relation: "데이터 기밀성 보안서비스와 연관",
      },
      {
        name: "공증 (Notarization)",
        desc: "신뢰할 수 있는 제3자(공증 기관)가 데이터 교환을 보증하는 메커니즘.",
        relation: "부인방지 보안서비스와 연관",
      },
    ],
  },
  {
    id: "general",
    label: "일반 보안 메커니즘",
    en: "Pervasive Security Mechanisms",
    icon: <Globe size={16} />,
    color: "bg-violet-500",
    bgLight: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-300",
    textColor: "text-violet-700 dark:text-violet-300",
    summary: "특정 계층이나 보안서비스에 국한되지 않고 전반적으로 적용되는 메커니즘 (5종)",
    items: [
      {
        name: "신뢰할 수 있는 기능성 (Trusted Functionality)",
        desc: "보안 정책에 부합하는 것으로 인식되는 기능성. 시스템 전체 보안의 기반이 되는 신뢰 수준.",
      },
      {
        name: "보안레이블 (Security Labels)",
        desc: "자원(데이터, 사용자 등)에 보안 등급이나 분류를 붙여 접근제어에 활용하는 메커니즘.",
      },
      {
        name: "이벤트탐지 (Event Detection)",
        desc: "보안과 관련된 이벤트(침입 시도, 비정상적 접근 등)를 감지하고 기록하는 메커니즘.",
      },
      {
        name: "보안감사추적 (Security Audit Trail)",
        desc: "보안 관련 이벤트 로그를 수집·기록하여 사후 분석 및 책임 추적이 가능하도록 함.",
      },
      {
        name: "보안복구 (Security Recovery)",
        desc: "보안 이벤트 발생 후 시스템을 안전한 상태로 복구하는 절차 및 메커니즘.",
      },
    ],
  },
];

export default function SecurityMechanismExplorer() {
  const [activeTab, setActiveTab] = useState<string>("specific");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const current = categories.find((c) => c.id === activeTab)!;

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setExpandedItem(null);
  };

  const toggleItem = (name: string) => {
    setExpandedItem((prev) => (prev === name ? null : name));
  };

  return (
    <section>
      <SectionTitle
        title="보안 메커니즘"
        subtitle="특정 보안 메커니즘(8종) vs 일반 보안 메커니즘(5종) — 탭 전환"
      />

      {/* 탭 */}
      <div className="mb-6 flex gap-2 rounded-xl bg-gray-100 p-1.5 dark:bg-gray-800">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleTabChange(cat.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === cat.id
                ? `${cat.color} text-white shadow`
                : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {cat.icon}
            <span className="hidden sm:inline">{cat.label}</span>
            <span className="sm:hidden">{cat.id === "specific" ? "특정" : "일반"}</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs ${
                activeTab === cat.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500 dark:bg-gray-700"
              }`}
            >
              {cat.items.length}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {/* 요약 */}
          <div className={`mb-4 rounded-xl border-l-4 ${current.border} ${current.bgLight} p-4`}>
            <p className={`text-sm font-medium ${current.textColor}`}>{current.summary}</p>
          </div>

          {/* 메커니즘 목록 */}
          <div className="space-y-2">
            {current.items.map((item, i) => (
              <div
                key={item.name}
                className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <button
                  onClick={() => toggleItem(item.name)}
                  className="flex w-full items-center justify-between bg-white p-4 text-left hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${current.color} text-xs font-bold text-white`}
                    >
                      {i + 1}
                    </span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {item.name}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedItem === item.name ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} className="text-gray-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedItem === item.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className={`border-t border-gray-100 ${current.bgLight} p-4 dark:border-gray-800`}>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                        {item.relation && (
                          <div className={`mt-3 rounded-lg border ${current.border} bg-white px-3 py-2 dark:bg-gray-900`}>
                            <span className={`text-xs font-bold ${current.textColor}`}>
                              관련 보안서비스:
                            </span>
                            <span className="ml-1 text-xs text-gray-500">{item.relation}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 비교 요약 박스 */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
          <h4 className="mb-2 font-bold text-purple-700 dark:text-purple-300">특정 보안 메커니즘</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            특정 OSI 계층에 구현되며 특정 보안서비스와 직접 연관됨. 예: 암호화 → 기밀성 제공.
          </p>
        </div>
        <div className="rounded-xl border-2 border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-900/20">
          <h4 className="mb-2 font-bold text-violet-700 dark:text-violet-300">일반 보안 메커니즘</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            특정 계층이나 보안서비스에 종속되지 않고 시스템 전반에 걸쳐 적용되는 범용 메커니즘.
          </p>
        </div>
      </div>
    </section>
  );
}
