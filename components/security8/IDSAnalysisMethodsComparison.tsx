"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ChevronDown, Info } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

type TabId = "signature" | "anomaly" | "integrity";

interface AnalysisMethod {
  id: TabId;
  label: string;
  en: string;
  color: string;
  bgLight: string;
  border: string;
  textColor: string;
  tagColor: string;
  how: string;
  howDetail: string;
  pros: string[];
  cons: string[];
  diagramSteps: { label: string; desc: string }[];
}

const methods: AnalysisMethod[] = [
  {
    id: "signature",
    label: "시그니처 기반",
    en: "Signature-based Detection",
    color: "bg-fuchsia-600",
    bgLight: "bg-fuchsia-50 dark:bg-fuchsia-900/20",
    border: "border-fuchsia-400",
    textColor: "text-fuchsia-700 dark:text-fuchsia-300",
    tagColor: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/40 dark:text-fuchsia-200",
    how: "알려진 공격 패턴(시그니처) DB와 비교하여 일치 여부 탐지",
    howDetail: "공격자들이 사용하는 알려진 공격 코드·패턴·행위의 특징을 시그니처(Signature) DB에 저장해두고, 수집된 데이터와 1:1 비교를 수행. 바이러스 백신의 작동 방식과 유사함.",
    pros: [
      "낮은 오탐율(False Positive) — 알려진 패턴에만 반응",
      "빠른 탐지 속도 — 패턴 매칭으로 즉각 결과 도출",
      "탐지 근거가 명확하여 대응이 쉬움",
    ],
    cons: [
      "알려지지 않은 공격(Zero-day) 탐지 불가",
      "시그니처 DB를 지속적으로 업데이트해야 함",
      "변형된 공격(Polymorphic Malware)은 탐지 어려움",
    ],
    diagramSteps: [
      { label: "수집 데이터", desc: "네트워크 패킷 / 로그 / 시스템 콜" },
      { label: "시그니처 DB 비교", desc: "알려진 공격 패턴 데이터베이스와 1:1 매칭" },
      { label: "판정", desc: "일치 → 침입 경보 / 불일치 → 정상 통과" },
    ],
  },
  {
    id: "anomaly",
    label: "통계적 이상탐지",
    en: "Statistical Anomaly Detection",
    color: "bg-purple-600",
    bgLight: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-400",
    textColor: "text-purple-700 dark:text-purple-300",
    tagColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
    how: "정상 기준선(Baseline) 설정 후 편차 발생 시 침입으로 판단",
    howDetail: "먼저 일정 기간 동안 정상 행위 패턴을 학습하여 기준선(Baseline)을 설정. 이후 수집 데이터가 기준선에서 통계적으로 유의미하게 벗어나면(편차 초과) 침입으로 탐지. 트래픽 양, 접속 빈도, 프로세스 자원 사용량 등이 측정 대상임.",
    pros: [
      "새로운 공격(Unknown/Zero-day) 탐지 가능",
      "시그니처 DB 없이 자동 학습 기반 동작",
      "내부자 위협·변종 공격도 탐지 가능",
    ],
    cons: [
      "높은 오탐율(False Positive) — 정상 변화도 경보 발생",
      "초기 기준선 학습 기간 필요",
      "공격이 천천히 이루어지면 기준선 자체가 오염될 수 있음",
    ],
    diagramSteps: [
      { label: "기준선 학습", desc: "정상 행위의 통계적 프로파일 생성" },
      { label: "편차 측정", desc: "현재 행위 vs 기준선의 통계적 거리 계산" },
      { label: "판정", desc: "임계값 초과 → 이상탐지 / 범위 내 → 정상" },
    ],
  },
  {
    id: "integrity",
    label: "무결성 검사",
    en: "Integrity Check",
    color: "bg-violet-600",
    bgLight: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-400",
    textColor: "text-violet-700 dark:text-violet-300",
    tagColor: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
    how: "파일·시스템 설정의 해시값 변화를 감지하여 변조 탐지",
    howDetail: "중요 시스템 파일, 설정 파일, 실행 파일의 암호학적 해시값(MD5, SHA-256 등)을 사전에 기록해두고, 주기적으로 현재 해시값과 비교. 해시값이 변경되면 파일이 변조된 것으로 판단함.",
    pros: [
      "무결성 침해를 정확하게 탐지",
      "루트킷, 백도어 설치 등 은밀한 변조 탐지 가능",
      "오탐율이 낮음 — 해시 불일치는 실제 변조를 의미",
    ],
    cons: [
      "실시간 탐지 어려움 — 주기적 검사(배치) 방식",
      "정상적인 소프트웨어 업데이트도 경보 발생",
      "파일 변조 후 해시 기록도 같이 변조될 위험",
    ],
    diagramSteps: [
      { label: "해시 기준값 저장", desc: "주요 파일의 SHA-256 해시를 안전하게 보관" },
      { label: "현재 해시 계산", desc: "동일 파일의 현재 해시값을 재계산" },
      { label: "비교·판정", desc: "불일치 → 무결성 위반 경보 / 일치 → 정상" },
    ],
  },
];

const fpfnData = [
  {
    term: "False Positive (오탐)",
    en: "False Positive",
    badge: "FP",
    color: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-700",
    desc: "정상 행위를 침입으로 잘못 탐지하는 경우. 이상탐지에서 특히 많이 발생. 관리자가 불필요한 경보에 무감각해지는 '경보 피로(Alert Fatigue)' 유발.",
    example: "정상 사용자가 업무 시간 외에 접속했을 때 이상으로 탐지",
  },
  {
    term: "False Negative (미탐)",
    en: "False Negative",
    badge: "FN",
    color: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700",
    desc: "실제 침입을 정상으로 잘못 판단하는 경우. 시그니처 기반에서 알려지지 않은 공격을 탐지 못하는 것이 대표 사례. 보안상 더 위험한 오류.",
    example: "시그니처 DB에 없는 신종 악성코드를 정상 파일로 통과시킴",
  },
];

export default function IDSAnalysisMethodsComparison() {
  const [activeTab, setActiveTab] = useState<TabId>("signature");
  const [showFpFn, setShowFpFn] = useState(false);

  const current = methods.find(m => m.id === activeTab)!;

  return (
    <section>
      <SectionTitle
        title="IDS 분석 방법 3종"
        subtitle="수집된 데이터를 침입 여부로 판단하는 3가지 분석 기법 비교"
      />

      {/* Tab Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {methods.map(m => (
          <button
            key={m.id}
            onClick={() => setActiveTab(m.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === m.id
                ? `${m.color} text-white shadow-md`
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className={`mb-5 rounded-xl border ${current.border} ${current.bgLight} p-5`}>
            <div className={`mb-1 text-xs font-semibold uppercase tracking-wide ${current.textColor}`}>
              {current.en}
            </div>
            <p className="mb-2 text-sm font-bold text-gray-800 dark:text-gray-100">{current.how}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{current.howDetail}</p>
          </div>

          {/* Flow Diagram */}
          <div className="mb-5">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">동작 흐름</h4>
            <div className="flex flex-col items-start gap-0 sm:flex-row sm:items-center">
              {current.diagramSteps.map((step, i) => (
                <div key={i} className="flex flex-col items-start sm:flex-row sm:items-center">
                  <div className={`rounded-lg border ${current.border} ${current.bgLight} p-3 min-w-[140px]`}>
                    <div className={`text-xs font-bold ${current.textColor}`}>{step.label}</div>
                    <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{step.desc}</div>
                  </div>
                  {i < current.diagramSteps.length - 1 && (
                    <>
                      <div className="sm:hidden ml-3 my-1 flex flex-col items-center">
                        <div className="h-4 w-0.5 bg-gray-400" />
                        <div className="border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-400" />
                      </div>
                      <div className="hidden sm:flex items-center mx-2">
                        <div className="h-0.5 w-5 bg-gray-400" />
                        <div className="border-b-4 border-l-4 border-t-4 border-b-transparent border-l-gray-400 border-t-transparent" />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pros / Cons */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-green-50 border border-green-200 p-4 dark:bg-green-900/20 dark:border-green-700">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-green-700 dark:text-green-300">
                <CheckCircle size={16} /> 장점
              </h4>
              <ul className="space-y-2">
                {current.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-green-800 dark:text-green-200">
                    <span className="mt-0.5 shrink-0 text-green-500">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 dark:bg-red-900/20 dark:border-red-700">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-red-700 dark:text-red-300">
                <XCircle size={16} /> 단점
              </h4>
              <ul className="space-y-2">
                {current.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-800 dark:text-red-200">
                    <span className="mt-0.5 shrink-0 text-red-500">•</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Signature vs Anomaly Visual Comparison */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
        <h4 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-100">
          시그니처 vs 이상탐지 — 탐지 원리 비교
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Signature */}
          <div className="rounded-lg border border-fuchsia-300 bg-white p-4 dark:bg-gray-900 dark:border-fuchsia-700">
            <div className="mb-2 text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400">시그니처 기반</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-red-400 text-white text-xs flex items-center justify-center font-bold">!</div>
                <span className="text-xs text-gray-600 dark:text-gray-400">알려진 공격 패턴 (DB에 존재)</span>
                <span className="ml-auto text-xs font-bold text-red-600">탐지</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-gray-300 text-gray-600 text-xs flex items-center justify-center font-bold">?</div>
                <span className="text-xs text-gray-600 dark:text-gray-400">신종 공격 (DB에 없음)</span>
                <span className="ml-auto text-xs font-bold text-green-600">통과</span>
              </div>
              <div className="mt-1 rounded bg-fuchsia-50 border border-fuchsia-200 p-2 text-xs text-fuchsia-700 dark:bg-fuchsia-900/20 dark:text-fuchsia-300">
                "이미 알고 있는 나쁜 것만 막는다"
              </div>
            </div>
          </div>
          {/* Anomaly */}
          <div className="rounded-lg border border-purple-300 bg-white p-4 dark:bg-gray-900 dark:border-purple-700">
            <div className="mb-2 text-xs font-bold text-purple-600 dark:text-purple-400">통계적 이상탐지</div>
            <div className="relative h-20 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden">
              {/* baseline */}
              <div className="absolute bottom-6 left-0 right-0 h-0.5 bg-purple-400 opacity-60" />
              <div className="absolute bottom-7 left-1 text-[10px] text-purple-500">기준선</div>
              {/* normal range */}
              <div className="absolute bottom-4 left-0 right-0 h-4 bg-purple-100 dark:bg-purple-900/30 opacity-50" />
              {/* normal traffic */}
              {[10, 25, 40, 55, 70].map((left, i) => (
                <div
                  key={i}
                  className="absolute bottom-5 h-3 w-2 rounded-sm bg-purple-400"
                  style={{ left: `${left}%`, height: `${8 + (i % 3) * 4}px` }}
                />
              ))}
              {/* anomaly spike */}
              <div className="absolute bottom-5 left-[82%] h-14 w-2 rounded-sm bg-red-500" />
              <div className="absolute bottom-[60px] left-[80%] text-[10px] font-bold text-red-600">이탈!</div>
            </div>
            <div className="mt-2 rounded bg-purple-50 border border-purple-200 p-2 text-xs text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
              "기준선에서 크게 벗어나면 침입으로 탐지"
            </div>
          </div>
        </div>
      </div>

      {/* False Positive / False Negative Toggle */}
      <div className="mt-6">
        <button
          onClick={() => setShowFpFn(!showFpFn)}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Info size={16} />
          False Positive / False Negative 개념 설명
          <ChevronDown size={14} className={`ml-1 transition-transform ${showFpFn ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {showFpFn && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {fpfnData.map(item => (
                  <div key={item.term} className={`rounded-xl border p-4 ${item.color}`}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded px-2 py-0.5 text-xs font-bold">{item.badge}</span>
                      <span className="text-sm font-bold">{item.term}</span>
                    </div>
                    <p className="mb-2 text-xs leading-relaxed">{item.desc}</p>
                    <div className="rounded bg-white/40 dark:bg-black/20 p-2 text-xs italic">
                      예시: {item.example}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
