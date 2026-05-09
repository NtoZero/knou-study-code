"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Star, Shield, Lock } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface Goal {
  id: string;
  ko: string;
  en: string;
  abbr?: string;
  isCIA: boolean;
  color: string;
  bgLight: string;
  border: string;
  textColor: string;
  badgeClass: string;
  def: string;
  example: string;
}

const goals: Goal[] = [
  {
    id: "confidentiality",
    ko: "기밀성",
    en: "Confidentiality",
    abbr: "C",
    isCIA: true,
    color: "bg-purple-600",
    bgLight: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-400",
    textColor: "text-purple-700 dark:text-purple-300",
    badgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-800/40 dark:text-purple-300",
    def: "인가된 사용자만 정보에 접근할 수 있도록 보장하는 보안 목표. 무단 공개로부터 정보를 보호함.",
    example: "은행 계좌 정보는 계좌 소유자와 인가된 은행 직원만 열람 가능. 암호화가 대표적 수단.",
  },
  {
    id: "integrity",
    ko: "무결성",
    en: "Integrity",
    abbr: "I",
    isCIA: true,
    color: "bg-purple-600",
    bgLight: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-400",
    textColor: "text-purple-700 dark:text-purple-300",
    badgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-800/40 dark:text-purple-300",
    def: "정보가 전송·저장 중 변조되지 않았음을 보장하는 보안 목표. 데이터의 정확성과 완전성을 유지.",
    example: "인터넷 뱅킹 송금 금액이 전송 과정에서 바뀌지 않도록 보장. 해시값·디지털서명으로 검증.",
  },
  {
    id: "availability",
    ko: "가용성",
    en: "Availability",
    abbr: "A",
    isCIA: true,
    color: "bg-purple-600",
    bgLight: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-400",
    textColor: "text-purple-700 dark:text-purple-300",
    badgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-800/40 dark:text-purple-300",
    def: "합법적인 사용자에게 서비스를 항상 제공할 수 있도록 보장하는 보안 목표.",
    example: "DDoS 공격에 대응하여 웹사이트 서비스를 정상적으로 유지. 이중화·백업이 핵심 수단.",
  },
  {
    id: "nonrepudiation",
    ko: "부인방지",
    en: "Non-repudiation",
    isCIA: false,
    color: "bg-violet-500",
    bgLight: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-300",
    textColor: "text-violet-700 dark:text-violet-300",
    badgeClass: "bg-violet-100 text-violet-700 dark:bg-violet-800/40 dark:text-violet-300",
    def: "송·수신 행위를 나중에 부인할 수 없도록 하는 보안 목표. 법적 책임의 근거가 됨.",
    example: "전자상거래에서 판매자가 '주문을 받지 않았다'고 부인할 수 없도록 디지털서명으로 증명.",
  },
  {
    id: "authentication",
    ko: "신분확인",
    en: "Authentication",
    isCIA: false,
    color: "bg-violet-500",
    bgLight: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-300",
    textColor: "text-violet-700 dark:text-violet-300",
    badgeClass: "bg-violet-100 text-violet-700 dark:bg-violet-800/40 dark:text-violet-300",
    def: "통신 상대방의 신원이 주장하는 바와 일치함을 확인하는 보안 목표.",
    example: "로그인 시 아이디·비밀번호 확인, 인증서 기반 신원 확인, 지문·홍채 생체인증 등.",
  },
  {
    id: "dataorigin",
    ko: "데이터발신처확인",
    en: "Data origin authentication",
    isCIA: false,
    color: "bg-violet-500",
    bgLight: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-300",
    textColor: "text-violet-700 dark:text-violet-300",
    badgeClass: "bg-violet-100 text-violet-700 dark:bg-violet-800/40 dark:text-violet-300",
    def: "수신한 데이터가 주장하는 출처(발신처)로부터 실제로 온 것인지 확인하는 보안 목표.",
    example: "이메일의 발신자 주소가 실제 발신자와 일치하는지 검증(SPF, DKIM 등).",
  },
  {
    id: "accesscontrol",
    ko: "접근제어",
    en: "Access control",
    isCIA: false,
    color: "bg-violet-500",
    bgLight: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-300",
    textColor: "text-violet-700 dark:text-violet-300",
    badgeClass: "bg-violet-100 text-violet-700 dark:bg-violet-800/40 dark:text-violet-300",
    def: "인가된 접근만 허용하고 무단 접근을 차단하는 보안 목표. 자원에 대한 접근 권한을 제어.",
    example: "파일시스템 권한(rwx), 방화벽 규칙, RBAC(역할 기반 접근제어) 등.",
  },
];

export default function SecurityGoalsExplorer() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const ciaGoals = goals.filter((g) => g.isCIA);
  const otherGoals = goals.filter((g) => !g.isCIA);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section>
      <SectionTitle
        title="보안 목표 7가지"
        subtitle="CIA 3대 핵심 목표와 확장 보안 목표 — 클릭하여 상세 확인"
      />

      {/* CIA 배지 */}
      <div className="mb-6 flex items-center gap-3 rounded-xl border-2 border-purple-300 bg-purple-50 p-4 dark:border-purple-700 dark:bg-purple-900/20">
        <div className="flex gap-1">
          {ciaGoals.map((g) => (
            <div
              key={g.abbr}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-sm font-black text-white"
            >
              {g.abbr}
            </div>
          ))}
        </div>
        <div>
          <div className="flex items-center gap-1 font-bold text-purple-700 dark:text-purple-300">
            <Star size={14} />
            CIA 삼각형 — 정보보안의 3대 핵심 목표
          </div>
          <p className="text-xs text-gray-500">
            기밀성(Confidentiality) · 무결성(Integrity) · 가용성(Availability)
          </p>
        </div>
      </div>

      {/* CIA 카드 */}
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <Shield size={14} className="text-purple-600" />
          <span className="text-xs font-bold uppercase text-purple-600">
            핵심 목표 (CIA)
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {ciaGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} expandedId={expandedId} onToggle={toggle} />
          ))}
        </div>
      </div>

      {/* 확장 목표 */}
      <div>
        <button
          onClick={() => setShowAll((p) => !p)}
          className="mb-3 flex items-center gap-2 text-xs font-bold uppercase text-violet-600 hover:text-violet-800"
        >
          <Lock size={14} />
          확장 보안 목표 (4가지)
          <motion.span animate={{ rotate: showAll ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} />
          </motion.span>
        </button>

        <AnimatePresence>
          {showAll && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {otherGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} expandedId={expandedId} onToggle={toggle} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showAll && (
          <div className="grid gap-3 sm:grid-cols-2">
            {otherGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} expandedId={expandedId} onToggle={toggle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function GoalCard({
  goal,
  expandedId,
  onToggle,
}: {
  goal: Goal;
  expandedId: string | null;
  onToggle: (id: string) => void;
}) {
  const isOpen = expandedId === goal.id;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`rounded-xl border-2 overflow-hidden ${goal.border}`}
    >
      <button
        onClick={() => onToggle(goal.id)}
        className={`flex w-full items-center justify-between p-4 text-left ${goal.bgLight} transition-colors`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800 dark:text-gray-100">{goal.ko}</span>
            {goal.isCIA && goal.abbr && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-black ${goal.badgeClass}`}
              >
                {goal.abbr}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">{goal.en}</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{goal.def}</p>
              <div className={`rounded-lg ${goal.bgLight} p-3`}>
                <span className={`text-xs font-bold ${goal.textColor}`}>실제 예시</span>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{goal.example}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
