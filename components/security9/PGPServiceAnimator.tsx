"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Play,
  ChevronRight,
  RotateCcw,
  Shield,
  Lock,
  Archive,
  Mail,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface PGPService {
  id: string;
  name: string;
  en: string;
  icon: React.ReactNode;
  color: string;
  bgLight: string;
  border: string;
  textColor: string;
  badge: string;
  impl: string;
  relatedKey: string;
  detail: string;
}

const SERVICES: PGPService[] = [
  {
    id: "auth",
    name: "인증",
    en: "Authentication",
    icon: <Shield size={20} />,
    color: "bg-rose-500",
    bgLight: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-400",
    textColor: "text-rose-700 dark:text-rose-300",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-800/40 dark:text-rose-300",
    impl: "발신자 개인키로 해시값을 암호화하여 디지털 서명 생성",
    relatedKey: "개인키(서명 생성) + 공개키(서명 검증)",
    detail:
      "메시지의 SHA 해시값을 발신자의 개인키로 암호화해 서명을 만든다. 수신자는 발신자의 공개키로 서명을 복호화하고 직접 계산한 해시와 비교하여 발신자를 인증한다.",
  },
  {
    id: "conf",
    name: "기밀성",
    en: "Confidentiality",
    icon: <Lock size={20} />,
    color: "bg-rose-600",
    bgLight: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-500",
    textColor: "text-rose-800 dark:text-rose-200",
    badge: "bg-rose-100 text-rose-800 dark:bg-rose-800/40 dark:text-rose-200",
    impl: "일회용 세션키(대칭)로 메시지 암호화 → 세션키는 수신자 공개키로 암호화",
    relatedKey: "세션키(메시지 암호화) + 수신자 공개키(세션키 암호화)",
    detail:
      "매번 새로운 세션키(IDEA 또는 AES 등 대칭키)를 생성하여 메시지를 암호화하고, 그 세션키 자체를 수신자의 공개키(RSA 등)로 다시 암호화한다. 대칭키 속도 + 공개키 키 관리 편의를 결합한 하이브리드 방식.",
  },
  {
    id: "comp",
    name: "압축",
    en: "Compression",
    icon: <Archive size={20} />,
    color: "bg-rose-400",
    bgLight: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-300",
    textColor: "text-rose-600 dark:text-rose-400",
    badge: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
    impl: "ZIP 알고리즘 — 서명 후, 암호화 전에 수행",
    relatedKey: "키와 무관 (알고리즘만)",
    detail:
      "ZIP 압축은 서명 이후, 암호화 이전에 수행된다. 순서가 중요하다 — 서명 후 압축하면 원문에 대한 서명이 보존되고, 암호화 전 압축하면 암호화 대상 데이터 크기가 줄어 효율적이다.",
  },
  {
    id: "compat",
    name: "이메일 호환성",
    en: "Email Compatibility",
    icon: <Mail size={20} />,
    color: "bg-pink-500",
    bgLight: "bg-pink-50 dark:bg-pink-900/20",
    border: "border-pink-400",
    textColor: "text-pink-700 dark:text-pink-300",
    badge: "bg-pink-100 text-pink-700 dark:bg-pink-800/40 dark:text-pink-300",
    impl: "Radix-64(Base64) 인코딩 — 바이너리를 ASCII 문자로 변환",
    relatedKey: "키와 무관 (인코딩 방식)",
    detail:
      "암호화된 바이너리 데이터를 이메일로 전송하려면 ASCII 텍스트로 변환해야 한다. Base64(Radix-64)는 6비트씩 나눠 총 64개의 출력 문자(A-Z, a-z, 0-9, +, /)로 인코딩한다. 크기가 약 33% 증가하지만 범용 이메일 시스템과 호환된다.",
  },
];

interface SendStep {
  step: number;
  title: string;
  detail: string;
  key: string;
  highlight: string;
  color: string;
}

const SEND_STEPS: SendStep[] = [
  {
    step: 1,
    title: "해시값 계산",
    detail: "메시지 원문에 SHA 등 해시 알고리즘을 적용하여 고정 길이 해시값(메시지 다이제스트)을 생성",
    key: "없음 (해시는 공개 알고리즘)",
    highlight: "원문 → [SHA] → 해시값",
    color: "bg-rose-100 border-rose-300 dark:bg-rose-900/30 dark:border-rose-700",
  },
  {
    step: 2,
    title: "디지털 서명 생성",
    detail: "해시값을 발신자의 개인키(Private Key)로 암호화 → 디지털 서명 완성",
    key: "발신자 개인키",
    highlight: "해시값 → [발신자 개인키] → 서명",
    color: "bg-rose-100 border-rose-300 dark:bg-rose-900/30 dark:border-rose-700",
  },
  {
    step: 3,
    title: "ZIP 압축",
    detail: "메시지 원문 + 서명을 합쳐 ZIP 알고리즘으로 압축. 서명 후, 암호화 전 위치",
    key: "없음",
    highlight: "(원문 + 서명) → [ZIP] → 압축 데이터",
    color: "bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-700",
  },
  {
    step: 4,
    title: "세션키 생성 + 메시지 암호화",
    detail: "일회용 대칭 세션키(IDEA/AES 등)를 무작위 생성하고, 이 키로 압축 데이터를 암호화",
    key: "세션키 (일회용 대칭키)",
    highlight: "압축 데이터 → [세션키] → 암호문",
    color: "bg-amber-100 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700",
  },
  {
    step: 5,
    title: "세션키 암호화",
    detail: "세션키를 수신자의 공개키(RSA 등)로 암호화. 이렇게 하면 수신자만 세션키를 복호화 가능",
    key: "수신자 공개키",
    highlight: "세션키 → [수신자 공개키] → 암호화된 세션키",
    color: "bg-emerald-100 border-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-700",
  },
  {
    step: 6,
    title: "Base64 인코딩 → 전송",
    detail: "(암호문 + 암호화된 세션키)를 Base64(Radix-64)로 인코딩하여 이메일 형태로 전송",
    key: "없음 (인코딩)",
    highlight: "바이너리 데이터 → [Base64] → ASCII 이메일",
    color: "bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700",
  },
];

const RECV_STEPS = [
  { step: 1, title: "Base64 디코딩", desc: "이메일 데이터를 Base64 디코딩 → 바이너리 복원" },
  { step: 2, title: "세션키 복호화", desc: "수신자 개인키로 암호화된 세션키를 복호화 → 세션키 획득" },
  { step: 3, title: "메시지 복호화", desc: "세션키로 암호문을 복호화 → 압축 데이터 획득" },
  { step: 4, title: "압축 해제", desc: "ZIP 압축 해제 → 원문 + 서명 분리" },
  { step: 5, title: "서명 검증", desc: "발신자 공개키로 서명을 복호화 → 해시값 획득. 원문에서 직접 계산한 해시와 비교하여 일치하면 인증 성공" },
];

export default function PGPServiceAnimator() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [recvOpen, setRecvOpen] = useState(false);

  const handleNext = () => {
    if (currentStep < SEND_STEPS.length - 1) setCurrentStep((s) => s + 1);
  };
  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };
  const handleReset = () => {
    setCurrentStep(0);
    setPlaying(false);
  };

  return (
    <section>
      <SectionTitle
        title="PGP 보안서비스 4종"
        subtitle="인증·기밀성·압축·이메일 호환성 — 각 서비스 클릭으로 상세 확인"
      />

      {/* 서비스 카드 그리드 */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {SERVICES.map((svc) => {
          const isOpen = activeService === svc.id;
          return (
            <div
              key={svc.id}
              className={`overflow-hidden rounded-xl border-2 ${svc.border} transition-all`}
            >
              <button
                onClick={() => setActiveService((v) => (v === svc.id ? null : svc.id))}
                className={`flex w-full items-center justify-between p-4 text-left ${svc.bgLight}`}
              >
                <div className="flex items-center gap-3">
                  <span className={svc.textColor}>{svc.icon}</span>
                  <div>
                    <span className="font-bold text-gray-800 dark:text-gray-100">{svc.name}</span>
                    <span className="ml-2 text-sm text-gray-500">({svc.en})</span>
                  </div>
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
                      <div className="mb-3 rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">구현 방식: </span>
                        <span className="text-gray-700 dark:text-gray-300">{svc.impl}</span>
                      </div>
                      <div className="mb-3 rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">관련 키: </span>
                        <span className={`font-medium ${svc.textColor}`}>{svc.relatedKey}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{svc.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 송신 과정 Step-by-step */}
      <div className="mb-6 rounded-xl border border-rose-200 bg-white p-5 dark:border-rose-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 dark:text-gray-100">
            PGP 송신 과정 — 단계별 시뮬레이션
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {currentStep + 1} / {SEND_STEPS.length}
            </span>
            <button
              onClick={handleReset}
              className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:text-gray-600 dark:border-gray-700"
              title="처음으로"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* 진행 바 */}
        <div className="mb-5 flex gap-1">
          {SEND_STEPS.map((s, i) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(i)}
              className={`h-2 flex-1 rounded-full transition-all ${
                i <= currentStep
                  ? "bg-rose-500"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>

        {/* 현재 단계 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className={`rounded-xl border ${SEND_STEPS[currentStep].color} p-5`}
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-sm font-black text-white">
                {currentStep + 1}
              </span>
              <h4 className="font-bold text-gray-800 dark:text-gray-100">
                {SEND_STEPS[currentStep].title}
              </h4>
            </div>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              {SEND_STEPS[currentStep].detail}
            </p>
            <div className="rounded-lg bg-white/60 px-3 py-2 font-mono text-sm dark:bg-black/20">
              {SEND_STEPS[currentStep].highlight}
            </div>
            {SEND_STEPS[currentStep].key !== "없음 (해시는 공개 알고리즘)" &&
              SEND_STEPS[currentStep].key !== "없음" &&
              SEND_STEPS[currentStep].key !== "없음 (인코딩)" && (
                <div className="mt-3 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs dark:border-rose-700 dark:bg-rose-900/20">
                  <span className="font-bold text-rose-700 dark:text-rose-300">사용 키: </span>
                  <span className="text-rose-600 dark:text-rose-400">{SEND_STEPS[currentStep].key}</span>
                </div>
              )}
          </motion.div>
        </AnimatePresence>

        {/* 컨트롤 */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 disabled:opacity-30 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            이전
          </button>
          <div className="flex gap-2">
            {!playing && currentStep < SEND_STEPS.length - 1 && (
              <button
                onClick={() => {
                  setPlaying(true);
                  const interval = setInterval(() => {
                    setCurrentStep((s) => {
                      if (s >= SEND_STEPS.length - 1) {
                        clearInterval(interval);
                        setPlaying(false);
                        return s;
                      }
                      return s + 1;
                    });
                  }, 1500);
                }}
                className="flex items-center gap-1 rounded-lg bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700"
              >
                <Play size={14} />
                자동 재생
              </button>
            )}
          </div>
          <button
            onClick={handleNext}
            disabled={currentStep === SEND_STEPS.length - 1}
            className="flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700 disabled:opacity-30 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300"
          >
            다음
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* 수신 과정 */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <button
          onClick={() => setRecvOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <span className="font-bold text-gray-800 dark:text-gray-100">
            PGP 수신 과정 — 송신의 역순 5단계
          </span>
          <motion.div animate={{ rotate: recvOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={18} className="text-gray-400" />
          </motion.div>
        </button>
        <AnimatePresence>
          {recvOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-100 p-5 dark:border-gray-800">
                <div className="space-y-3">
                  {RECV_STEPS.map((rs) => (
                    <div
                      key={rs.step}
                      className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                        {rs.step}
                      </span>
                      <div>
                        <div className="font-semibold text-sm text-gray-700 dark:text-gray-200">{rs.title}</div>
                        <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{rs.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-gray-400 italic">
                  * 수신 과정은 송신의 역순: Base64 디코딩 → 세션키 복호화 → 메시지 복호화 → 압축 해제 → 서명 검증
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PGP 메시지 형식 3계층 */}
      <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-800 px-5 py-4">
          <h3 className="font-bold text-gray-800 dark:text-gray-100">PGP 메시지 형식 — 3계층 구조</h3>
          <p className="mt-1 text-xs text-gray-500">PGP 메시지는 세션키 구성요소 · 서명 부분 · 메시지 3계층으로 구성되며 각각 선택적으로 포함됨</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-5">
          {/* 계층 다이어그램 */}
          <div className="space-y-2">
            {[
              {
                layer: "세션키 구성요소",
                en: "Session Key Component (선택적)",
                color: "bg-orange-500",
                bgLight: "bg-orange-50 dark:bg-orange-900/20",
                border: "border-orange-400",
                textColor: "text-orange-700 dark:text-orange-300",
                contents: [
                  "수신자의 공개키 ID",
                  "수신자 공개키로 암호화된 세션키",
                  "기밀성 서비스 제공 시 포함",
                ],
                note: "기밀성 서비스를 사용할 경우에만 포함",
              },
              {
                layer: "서명 부분",
                en: "Signature Component (선택적)",
                color: "bg-rose-500",
                bgLight: "bg-rose-50 dark:bg-rose-900/20",
                border: "border-rose-400",
                textColor: "text-rose-700 dark:text-rose-300",
                contents: [
                  "서명자의 공개키 ID",
                  "서명 생성 타임스탬프",
                  "메시지 다이제스트의 앞 2바이트 (검증용)",
                  "발신자 개인키로 암호화된 메시지 다이제스트 (서명)",
                ],
                note: "인증 서비스를 사용할 경우에만 포함",
              },
              {
                layer: "메시지",
                en: "Message (필수)",
                color: "bg-blue-600",
                bgLight: "bg-blue-50 dark:bg-blue-900/20",
                border: "border-blue-400",
                textColor: "text-blue-700 dark:text-blue-300",
                contents: [
                  "파일명 (원본 파일 식별)",
                  "생성 타임스탬프",
                  "실제 메시지 데이터 (압축 및 암호화 적용 가능)",
                ],
                note: "항상 포함되는 필수 구성요소",
              },
            ].map((layer, i) => (
              <div key={i} className={`rounded-xl border-2 ${layer.border} ${layer.bgLight} p-4`}>
                <div className="mb-2 flex items-center gap-3">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${layer.color} text-xs font-bold text-white`}>
                    {i + 1}
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${layer.textColor}`}>{layer.layer}</div>
                    <div className="text-xs text-gray-400">{layer.en}</div>
                  </div>
                </div>
                <ul className="mb-2 space-y-1 pl-10">
                  {layer.contents.map((c) => (
                    <li key={c} className="flex items-start gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                      <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${layer.color}`} />
                      {c}
                    </li>
                  ))}
                </ul>
                <div className={`ml-10 rounded px-2 py-1 text-xs font-medium ${layer.textColor} bg-white/60 dark:bg-gray-900/40 border ${layer.border}`}>
                  {layer.note}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-400 italic">
            * 전체 메시지는 이 3계층을 조합 후 Radix-64(Base64) 인코딩하여 MIME 이메일로 전송됨.
            기밀성만 적용 시: 세션키+메시지, 인증만 적용 시: 서명+메시지, 둘 다 적용 시: 세 계층 모두 포함.
          </p>
        </div>
      </div>
    </section>
  );
}
