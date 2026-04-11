"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import NetworkTerm from "./NetworkTerm";

type ModeKey = "HH" | "HAC" | "A2A";

interface Mode {
  key: ModeKey;
  label: string;
  sub: string;
  subjects: string;
  semantic: string;
  predictability: string;
  complexity: string;
  color: string;
}

const MODES: Mode[] = [
  {
    key: "HH",
    label: "전통 정보통신",
    sub: "Human ↔ Human / Human ↔ System",
    subjects: "사람 또는 결정론적 시스템",
    semantic: "사람이 직접 의미 해석 · 시스템은 문자 그대로 처리",
    predictability: "높음 — 프로토콜과 스펙에 의해 결정적",
    complexity: "낮음~중간 — 정형화된 메시지 구조",
    color: "sky",
  },
  {
    key: "HAC",
    label: "HAC",
    sub: "Human ↔ AI",
    subjects: "사람과 확률적 모델(LLM, 멀티모달 AI)",
    semantic: "AI가 통계적 해석 · 인간은 자연어로 의도 표현",
    predictability: "중간 — 같은 입력에도 다른 출력 가능(샘플링)",
    complexity: "중간~높음 — 맥락·페르소나·멀티모달 혼합",
    color: "orange",
  },
  {
    key: "A2A",
    label: "AI ↔ AI (A2A)",
    sub: "Agent-to-Agent",
    subjects: "다중 AI 에이전트 (도구 호출, 자율 협업)",
    semantic:
      "에이전트가 서로의 출력을 재해석 · 공유 임베딩/중간 표현 사용",
    predictability: "낮음 — 상호작용 경로가 조합적으로 폭발",
    complexity: "매우 높음 — 은어화, 블랙박스화 위험",
    color: "rose",
  },
];

const TIMELINE = [
  { year: "1844", event: "모스 부호 · 전신", mode: "HH" },
  { year: "1876", event: "전화", mode: "HH" },
  { year: "1969", event: "ARPANET · 패킷 교환", mode: "HH" },
  { year: "1991", event: "WWW · 하이퍼텍스트", mode: "HH" },
  { year: "1966", event: "ELIZA 초기 챗봇", mode: "HAC" },
  { year: "2011", event: "Siri 음성 비서", mode: "HAC" },
  { year: "2022", event: "ChatGPT · 대화형 LLM", mode: "HAC" },
  { year: "2023", event: "ReAct · Tool-use 에이전트", mode: "A2A" },
  { year: "2024+", event: "멀티 에이전트 협업 · MCP", mode: "A2A" },
];

export default function HACvsTraditional() {
  const [active, setActive] = useState<ModeKey>("HAC");
  const activeMode = MODES.find((m) => m.key === active)!;

  return (
    <section>
      <SectionTitle
        title="3. 통신 모드 3가지 비교"
        subtitle="전통 정보통신 · HAC · A2A(Agent-to-Agent)의 구조적 차이"
      />

      {/* 모드 선택 */}
      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setActive(m.key)}
            className={`rounded-xl border p-4 text-left transition-all ${
              active === m.key
                ? "border-orange-500 bg-orange-50 shadow dark:bg-orange-950/40"
                : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900"
            }`}
          >
            <div className="text-[10px] font-bold uppercase text-orange-600">
              {m.sub}
            </div>
            <div className="mt-1 text-sm font-bold">{m.label}</div>
          </button>
        ))}
      </div>

      {/* 선택된 모드 상세 */}
      <motion.div
        key={activeMode.key}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-orange-200 bg-white p-5 dark:border-orange-900/60 dark:bg-gray-900"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Axis label="통신 주체" value={activeMode.subjects} />
          <Axis label="의미 해석" value={activeMode.semantic} />
          <Axis label="예측 가능성" value={activeMode.predictability} />
          <Axis label="상호작용 복잡도" value={activeMode.complexity} />
        </div>
      </motion.div>

      {/* 타임라인 */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 text-sm font-bold">발전 타임라인</div>
        <div className="relative overflow-x-auto pb-4">
          <div className="relative flex min-w-[720px] items-start gap-0">
            {TIMELINE.map((t, i) => {
              const mode = MODES.find((m) => m.key === t.mode)!;
              return (
                <div key={i} className="flex w-24 flex-col items-center">
                  <div
                    className={`h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-900 ${
                      mode.key === "HH"
                        ? "bg-sky-500"
                        : mode.key === "HAC"
                          ? "bg-orange-500"
                          : "bg-rose-500"
                    }`}
                  />
                  <div className="mt-2 text-[11px] font-bold text-gray-700 dark:text-gray-300">
                    {t.year}
                  </div>
                  <div className="mt-0.5 text-center text-[10px] leading-tight text-gray-500">
                    {t.event}
                  </div>
                </div>
              );
            })}
            <div className="absolute left-0 top-1.5 -z-10 h-0.5 w-full bg-gradient-to-r from-sky-300 via-orange-300 to-rose-300" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-[11px]">
          <Legend color="bg-sky-500" label="전통 HH" />
          <Legend color="bg-orange-500" label={<NetworkTerm term="HAC" label="HAC" />} />
          <Legend color="bg-rose-500" label="A2A" />
        </div>
      </div>

      {/* 핵심 차이: 블랙박스화 위험 요약 */}
      <div className="mt-6 rounded-xl border border-dashed border-orange-300 bg-orange-50/40 p-4 text-xs text-orange-900 dark:border-orange-800 dark:bg-orange-950/20 dark:text-orange-200">
        <strong>A2A 전환의 핵심 위험:</strong>{" "}
        <NetworkTerm term="blackbox" label="블랙박스화" />가 진행되면
        인간의 감독·책임·통제가 구조적으로 불가능해짐.
        이에 대응하기 위해{" "}
        <NetworkTerm term="HAI" label="HAI" /> 프로토콜 계층이 필요.
        서술 시 이 진화 경로(HH → HAC → A2A)를 흐름으로 제시하면 깊이 있는 분석.
      </div>
    </section>
  );
}

function Axis({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-orange-50/50 p-3 dark:bg-orange-950/30">
      <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
        {label}
      </div>
      <div className="mt-1 text-sm text-gray-800 dark:text-gray-200">
        {value}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
}
