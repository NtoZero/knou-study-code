"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  FileCode2,
  ShieldAlert,
  Languages,
  Undo2,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import NetworkTerm from "./NetworkTerm";

interface Strategy {
  key: string;
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  summary: string;
  hints: string[];
  ownIdea: string;
}

const STRATEGIES: Strategy[] = [
  {
    key: "transparency",
    title: "1. 투명성 레이어",
    icon: Eye,
    summary:
      "AI-AI 통신의 모든 단계를 사람이 조회할 수 있는 로그·감사·대시보드 형태로 노출.",
    hints: [
      "구조화된 이벤트 로그(OpenTelemetry 스타일)",
      "이상 징후 알림(anomaly detection)",
      "타임라인 재생(replay) 기능",
    ],
    ownIdea:
      "당신이 만드는 대시보드에는 어떤 '한눈에 드러나야 할 지표'가 있어야 할까요? 로그 양이 많으면 어떻게 요약할까요?",
  },
  {
    key: "standard",
    title: "2. 표준 메시지 포맷",
    icon: FileCode2,
    summary:
      "모든 AI-AI 메시지를 사람이 해독 가능한 구조화된 스키마(JSON·Protobuf)로 기록.",
    hints: [
      "MCP(Model Context Protocol) 유사 규약",
      "OpenTelemetry Trace · Span",
      "필수 필드: 의도, 근거, 신뢰도, 호출자",
    ],
    ownIdea:
      "스키마에 '왜(why)'와 '누가(agent-id)'를 반드시 넣으려면 어떤 강제 메커니즘이 필요할까요?",
  },
  {
    key: "threshold",
    title: "3. 임계 트리거(Human Gate)",
    icon: ShieldAlert,
    summary:
      "특정 조건(금액·위험도·범위)을 넘는 의사결정은 인간 승인을 강제하는 게이트.",
    hints: [
      "규칙 기반 트리거(if amount > N)",
      "학습된 위험 분류기",
      "다단계 승인(2FA-like)",
    ],
    ownIdea:
      "임계값을 고정값이 아닌 '맥락 의존적'으로 설계하려면? AI가 임계값 자체를 조작하지 못하게 하려면?",
  },
  {
    key: "translator",
    title: "4. 의미 복원 번역기",
    icon: Languages,
    summary:
      "AI의 은어·벡터·함수 호출을 주기적으로 사람 언어 요약으로 번역하는 중계 컴포넌트.",
    hints: [
      "Sidecar 요약 LLM(관찰자 모델)",
      "주기적 자연어 보고서",
      "Counterfactual 설명(왜 이렇게 결정했나)",
    ],
    ownIdea:
      "번역기 자체가 또 하나의 블랙박스가 되지 않으려면 어떤 검증 장치가 필요할까요?",
  },
  {
    key: "rollback",
    title: "5. 권한 · 롤백 · 킬스위치",
    icon: Undo2,
    summary:
      "프로토콜 수준에서 인간의 중지·되돌림·권한 박탈을 보장.",
    hints: [
      "모든 행동의 가역성(reversibility) 태깅",
      "킬스위치 + 상태 체크포인트",
      "정책 기반 권한(role/scope)",
    ],
    ownIdea:
      "비가역적 행위(예: 송금, 물리 제어)를 감지해 자동으로 가역 경로로 우회시키는 설계는 어떻게 할 수 있을까요?",
  },
];

export default function HumanInTheLoopStrategies() {
  const [open, setOpen] = useState<string | null>("transparency");

  return (
    <section>
      <SectionTitle
        title="7. 인간 개입형(Human-in-the-Loop) 전략"
        subtitle="블랙박스 문제에 대응하는 5가지 설계 원리 — 답안이 아닌 생각의 출발점"
      />

      <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
        <div className="flex items-start gap-2">
          <Sparkles size={14} className="mt-0.5 shrink-0" />
          <div>
            <strong>안내</strong> — 아래 5가지는 <em>답안 제시가 아니라 사고의
              출발점</em>입니다. 본인만의 독창적 아이디어를 구성하기 위해
            확장해보세요. 과제는 학생 고유의 창의성(40%)을 크게 반영합니다.
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {STRATEGIES.map((s) => {
          const Icon = s.icon;
          const isOpen = open === s.key;
          return (
            <div
              key={s.key}
              className={`overflow-hidden rounded-2xl border transition-all ${
                isOpen
                  ? "border-orange-500 bg-orange-50/60 shadow dark:bg-orange-950/40"
                  : "border-gray-200 bg-white hover:border-orange-300 dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : s.key)}
                className="flex w-full items-start gap-3 p-4 text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-white">
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">{s.title}</div>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {s.summary}
                  </p>
                </div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-orange-200 dark:border-orange-900/60"
                  >
                    <div className="p-4">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                        힌트
                      </div>
                      <ul className="mt-1 space-y-1 text-xs text-gray-700 dark:text-gray-300">
                        {s.hints.map((h) => (
                          <li key={h} className="flex gap-2">
                            <span className="text-orange-500">▸</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 rounded-lg bg-orange-100/80 p-3 text-xs text-orange-900 dark:bg-orange-950/60 dark:text-orange-200">
                        <div className="mb-1 text-[10px] font-bold uppercase">
                          자신만의 아이디어로 확장
                        </div>
                        {s.ownIdea}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Impact-Level 슬라이더 시뮬레이션 */}
      <ImpactLevelSimulator />
    </section>
  );
}

const IMPACT_LEVELS = [
  {
    level: 1,
    label: "무시 가능",
    color: "bg-green-500",
    textColor: "text-green-700 dark:text-green-300",
    border: "border-green-400",
    bg: "bg-green-50 dark:bg-green-950/30",
    path: "자동 통과",
    pathDesc: "인간 대시보드에 로그만 기록. 개입 없음.",
    example: "AI가 날씨 정보를 조회함 (읽기 전용, 영향 없음)",
    reversible: true,
    humanApproval: false,
  },
  {
    level: 2,
    label: "낮음",
    color: "bg-lime-500",
    textColor: "text-lime-700 dark:text-lime-300",
    border: "border-lime-400",
    bg: "bg-lime-50 dark:bg-lime-950/30",
    path: "자동 통과",
    pathDesc: "처리 후 인간에게 배치 요약 보고서 전송.",
    example: "AI가 캘린더에 회의 초안을 추가함 (쉽게 취소 가능)",
    reversible: true,
    humanApproval: false,
  },
  {
    level: 3,
    label: "중간",
    color: "bg-amber-500",
    textColor: "text-amber-700 dark:text-amber-300",
    border: "border-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    path: "사후 알림",
    pathDesc: "통과 후 인간에게 즉시 사후 알림 전송. 재검토 요청 가능.",
    example: "AI가 외부 파트너에게 표준 계약 조건을 전달함",
    reversible: true,
    humanApproval: false,
  },
  {
    level: 4,
    label: "높음",
    color: "bg-orange-500",
    textColor: "text-orange-700 dark:text-orange-300",
    border: "border-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    path: "일시 정지 → 승인 대기",
    pathDesc: "통신 일시 정지 후 인간의 명시적 승인 대기. 타임아웃 시 기본 정책 적용.",
    example: "AI가 서버 구성 파일을 수정하려 함 (서비스 중단 위험)",
    reversible: false,
    humanApproval: true,
  },
  {
    level: 5,
    label: "치명적",
    color: "bg-red-600",
    textColor: "text-red-700 dark:text-red-300",
    border: "border-red-500",
    bg: "bg-red-50 dark:bg-red-950/30",
    path: "강제 차단 → 관리자 알림",
    pathDesc: "통신 즉시 차단 후 다수의 승인자 알림. 단일 인간 승인으로는 통과 불가.",
    example: "AI가 핵시설 냉각 시스템의 밸브 설정을 변경하려 함",
    reversible: false,
    humanApproval: true,
  },
];

function ImpactLevelSimulator() {
  const [level, setLevel] = useState(3);
  const [approved, setApproved] = useState<boolean | null>(null);
  const current = IMPACT_LEVELS[level - 1];

  return (
    <div className="mt-8 rounded-2xl border border-orange-300 bg-white p-6 dark:border-orange-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal size={18} className="text-orange-500" />
        <div className="text-sm font-bold">
          <NetworkTerm term="impactLevel" label="Impact-Level" /> 시뮬레이터
        </div>
      </div>
      <p className="mb-5 text-xs text-gray-500 dark:text-gray-400">
        슬라이더로 레벨을 조정하면 HAI 흐름제어 경로가 어떻게 바뀌는지 확인하세요.
        이는 데이터 통신의{" "}
        <NetworkTerm term="flowControl" label="흐름제어" /> 원리를 차용한 것입니다.
      </p>

      {/* 슬라이더 */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-gray-500">낮은 영향</span>
          <span className={`rounded-full px-3 py-0.5 text-xs font-bold text-white ${current.color}`}>
            Level {level} — {current.label}
          </span>
          <span className="text-xs text-gray-500">치명적</span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={level}
          onChange={(e) => {
            setLevel(Number(e.target.value));
            setApproved(null);
          }}
          className="w-full accent-orange-500"
        />
        <div className="mt-1 flex justify-between text-[10px] text-gray-400">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={n === level ? "font-bold text-orange-500" : ""}
            >
              {n}
            </span>
          ))}
        </div>
      </div>

      {/* 현재 레벨 상세 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={level}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className={`rounded-xl border p-4 ${current.bg} ${current.border}`}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className={`text-xs font-bold mb-1 ${current.textColor}`}>
                흐름제어 경로
              </div>
              <div className="text-sm font-bold">{current.path}</div>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                {current.pathDesc}
              </p>
              <div className="mt-2 flex gap-3 text-xs">
                <span className={`rounded px-2 py-0.5 font-semibold ${current.reversible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {current.reversible ? "되돌림 가능" : "비가역적"}
                </span>
                <span className={`rounded px-2 py-0.5 font-semibold ${current.humanApproval ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                  {current.humanApproval ? "인간 승인 필요" : "자동 처리"}
                </span>
              </div>
            </div>
            <div>
              <div className={`text-xs font-bold mb-1 ${current.textColor}`}>
                가공 예시 시나리오
              </div>
              <div className="rounded-lg bg-white/70 p-2 text-xs dark:bg-gray-900/60">
                {current.example}
              </div>
              {current.humanApproval && (
                <div className="mt-2 space-y-1.5">
                  <div className="text-[10px] font-bold text-orange-600">승인 시뮬레이션</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setApproved(true)}
                      className="flex-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600"
                    >
                      ✓ 승인
                    </button>
                    <button
                      onClick={() => setApproved(false)}
                      className="flex-1 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                    >
                      ✗ 거부
                    </button>
                  </div>
                  <AnimatePresence>
                    {approved !== null && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`rounded-lg p-2 text-xs font-semibold ${approved ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                      >
                        {approved
                          ? "통신 재개. 감사 로그에 '인간 승인' 기록됨."
                          : "통신 차단. 감사 로그에 '인간 거부' 기록됨. 기본 정책 적용."}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 rounded-lg border border-dashed border-orange-300 bg-orange-50/30 p-3 text-xs text-orange-800 dark:border-orange-800 dark:bg-orange-950/20 dark:text-orange-300">
        <strong>학습 포인트:</strong> Level 1~2는 인간 대시보드 부담 없이 자동 처리.
        Level 3은 사후 알림으로 인간이 패턴을 파악. Level 4~5는 일시 정지 + 승인으로
        &apos;수신 측 처리 능력 초과 방지&apos;(흐름제어)를 인간 감독에 적용.
        Impact-Level 기준은 영향 범위·재무 영향·되돌림 가능 여부의 3축으로 산정해야 고점.
      </div>
    </div>
  );
}
