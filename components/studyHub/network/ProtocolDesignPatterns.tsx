"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, CircleDot } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import NetworkTerm from "./NetworkTerm";

interface Component {
  key: string;
  title: string;
  desc: string;
  examples: string[];
  weight: number;
}

const COMPONENTS: Component[] = [
  {
    key: "interface",
    title: "1. 인터페이스 규약",
    desc: "AI와 인간(또는 다른 AI)이 주고받을 메시지의 형식 · 필드 · 역할을 고정하는 계층.",
    examples: [
      "REST/JSON 엔드포인트 스키마",
      "System / User / Assistant 역할 프롬프트",
      "JSON Schema 응답 강제 · function calling",
      "OpenAPI · MCP 선언",
    ],
    weight: 20,
  },
  {
    key: "context",
    title: "2. 컨텍스트 관리",
    desc: "대화 · 세션 · 외부 지식을 일관되게 공급하여 AI가 상태를 잃지 않도록 하는 계층.",
    examples: [
      "대화 히스토리 윈도우",
      "시스템 프롬프트 · 페르소나",
      "RAG(Retrieval Augmented Generation)",
      "메모리/세션 저장소",
    ],
    weight: 20,
  },
  {
    key: "trust",
    title: "3. 신뢰 · 검증",
    desc: "AI 응답의 사실성과 출처를 사람이 확인할 수 있도록 만드는 계층.",
    examples: [
      "인용/각주 · 출처 URL 첨부",
      "검증 파이프라인(셀프체크 · reflector)",
      "Human feedback · RLHF",
      "신뢰도 점수(confidence)",
    ],
    weight: 20,
  },
  {
    key: "recovery",
    title: "4. 오류 복구",
    desc: "모호한 요청, 실패한 도구 호출, 환각 응답 등에 대한 복구 규칙.",
    examples: [
      "재시도 · 지수적 백오프",
      "명확화 질문(clarification query)",
      "Fallback 경로(다른 모델·사람)",
      "Guardrail · 거부 응답",
    ],
    weight: 20,
  },
  {
    key: "closure",
    title: "5. 종료 · 합의",
    desc: "작업이 언제 끝났고 누가 책임지는지를 명시하는 계층. 인간 승인 단계 포함.",
    examples: [
      "작업 완료 시그널 · 상태 머신",
      "사용자 승인 게이트 · 다이얼로그 컨펌",
      "로그 · 감사 기록",
      "롤백 가능 표시",
    ],
    weight: 20,
  },
];

export default function ProtocolDesignPatterns() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const score = COMPONENTS.reduce(
    (sum, c) => sum + (checked[c.key] ? c.weight : 0),
    0,
  );

  const toggle = (key: string) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <section>
      <SectionTitle
        title="5. HAC 프로토콜 설계 패턴"
        subtitle="견고한 HAC 프로토콜은 5가지 계층으로 구성 — 체크하며 본인만의 프로토콜을 설계"
      />

      <div className="mb-4 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-pink-50 p-4 dark:border-orange-900/60 dark:from-orange-950/40 dark:to-pink-950/40">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
              프로토콜 완성도
            </div>
            <div className="text-2xl font-bold">{score} / 100</div>
          </div>
          <div className="text-right text-xs text-gray-500">
            체크한 계층 수: {Object.values(checked).filter(Boolean).length} / 5
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/70 dark:bg-gray-800/70">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-pink-500"
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {COMPONENTS.map((c) => {
          const isChecked = !!checked[c.key];
          return (
            <button
              key={c.key}
              onClick={() => toggle(c.key)}
              className={`w-full rounded-xl border p-4 text-left transition-all ${
                isChecked
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-950/40"
                  : "border-gray-200 bg-white hover:border-orange-300 dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all ${
                    isChecked
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-300 dark:bg-gray-800"
                  }`}
                >
                  {isChecked ? (
                    <Check size={14} />
                  ) : (
                    <CircleDot size={14} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">{c.title}</div>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {c.desc}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.examples.map((ex) => (
                      <span
                        key={ex}
                        className="rounded-full bg-white px-2 py-0.5 text-[10px] text-gray-600 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-dashed border-orange-300 bg-orange-50/40 p-4 text-xs text-orange-900 dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-200">
        <strong>팁</strong> — 5개 계층 모두를 채우면 &quot;견고한&quot; 프로토콜이 되지만,
        실제 과제에서는{" "}
        <NetworkTerm term="encapsulation" label="캡슐화" /> ·{" "}
        <NetworkTerm term="flowControl" label="흐름제어" /> ·{" "}
        <NetworkTerm term="sequencing" label="순서 결정" />
        등 1강 프로토콜 기능과 명시적으로 연결하는 것이 루브릭 C1(구체성) · C2(독창성) 고점 조건.
      </div>
    </section>
  );
}
