"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ChevronDown, ShieldCheck, ShieldOff } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import NetworkTerm from "./NetworkTerm";

interface Scenario {
  key: string;
  tag: string;
  title: string;
  story: string;
  risks: { category: "감독" | "책임" | "통제"; desc: string }[];
  why: string[];
  impact: string[];
  openQuestion: string;
  withoutHAI: string;
  withHAI: string;
}

const SCENARIOS: Scenario[] = [
  {
    key: "A",
    tag: "시나리오 A",
    title: "다중 에이전트가 자체 은어로 협상",
    story:
      "협상을 최적화하도록 학습된 두 에이전트가, 효율을 극대화하려다 문법을 잃은 압축된 '은어'로 대화하기 시작함. 인간은 그 로그를 읽어도 의미를 알 수 없음. (Facebook FAIR의 2017년 협상봇 사건 참고)",
    risks: [
      { category: "감독", desc: "AI 간 합의 내용을 인간이 검증할 수 없음" },
      { category: "책임", desc: "잘못된 협상 결과의 원인 추적 불가" },
      { category: "통제", desc: "인간이 협상 흐름에 개입하거나 중단할 수 없음" },
    ],
    why: [
      "효율 극대화 목적 함수는 가독성을 보상하지 않음",
      "학습 데이터의 자연어 제약이 느슨하면 코드가 축약됨",
      "해석 가능성(interpretability)은 보상 체계에서 누락되기 쉬움",
    ],
    impact: [
      "감사(audit) 불가 — 법적 책임 추적 어려움",
      "편향 · 담합을 탐지하지 못함",
      "사회적 신뢰 붕괴",
    ],
    openQuestion:
      "어느 시점에 인간이 대화를 중단시키는 것이 적절할까? 그 판단 기준은 프로토콜의 어디에 넣어야 할까?",
    withoutHAI:
      "에이전트 A가 에이전트 B에게 3.7×10⁻⁵ 단위 압축 벡터를 전송함. 인간은 수천 개의 로그 중 어느 것이 협상 결정인지도 알 수 없음. 사후 감사 불가.",
    withHAI:
      "HAI 헤더에 Intent-Summary: '계약 조건 X 합의(예상 비용 절감 15%)', Impact-Level: 3, Reversible: No가 부착됨. 인간 대시보드에 사후 알림 전송. 감사 로그에 Session-ID로 추적 가능.",
  },
  {
    key: "B",
    tag: "시나리오 B",
    title: "임베딩·MoE 공유로 설명 가능성 상실",
    story:
      "모델 간에 원시 텍스트 대신 임베딩 벡터나 MoE(Mixture of Experts) 라우팅 결과를 직접 주고받는 구조가 확산됨. 사람이 알아볼 언어 층이 사라지고, 4096차원 벡터만 흐르는 통신이 됨.",
    risks: [
      { category: "감독", desc: "4096차원 벡터를 인간이 해독할 방법 없음" },
      { category: "책임", desc: "모델 간 편향 전이의 출처 추적 불가" },
      { category: "통제", desc: "페이로드 내용 기반의 차단 정책 적용 불가" },
    ],
    why: [
      "벡터 간 통신이 텍스트보다 정보 밀도 높음 (효율 우선)",
      "디코딩이 계산 비용 — 생략하는 최적화가 일어남",
      "표준화된 임베딩 공간 공유 움직임 (latent communication)",
    ],
    impact: [
      "사후 디버깅이 사실상 불가능",
      "모델 간 편향이 벡터 공간에 전이",
      "사람 중심 감사 불가",
    ],
    openQuestion:
      "벡터 통신을 그대로 유지하면서도 사람이 이해할 수 있는 '부산물(by-product)'을 자동 생성하려면 어떤 구조가 필요할까?",
    withoutHAI:
      "모델 A → 모델 B: [0.73, -1.2, 0.05, ... (4096개 부동소수점)]. 인간은 이 벡터가 의료 처방인지 마케팅 결정인지 알 수 없음.",
    withHAI:
      "HAI 헤더가 사이드카처럼 부착됨 — Intent-Summary: '혈압 이상 탐지 → 알림 강도 조정', Domain: clinical/alert, Impact-Level: 4, Human-Approval-Required: Yes. 페이로드(벡터)는 유지하되 외부 메타데이터로 인간 해독 가능.",
  },
  {
    key: "C",
    tag: "시나리오 C",
    title: "초고속 자동 협상 · 거래",
    story:
      "에이전트 간 상거래 · 계약 체결이 밀리초 단위로 이뤄짐. 사람은 로그를 열어볼 시간조차 없고, 일이 틀어진 후에야 결과를 알게 됨. (알고리즘 트레이딩의 플래시 크래시 유사)",
    risks: [
      { category: "감독", desc: "밀리초 단위 속도로 인간 검토 시간 전혀 없음" },
      { category: "책임", desc: "연쇄 결정 중 어느 에이전트가 오류의 원인인지 불명" },
      { category: "통제", desc: "사후 개입으로는 복구가 어렵거나 불가능" },
    ],
    why: [
      "경쟁 환경에서 지연(latency)은 손실",
      "자동화 범위가 점차 확장되며 사람 개입 지점이 후퇴",
      "사후 개입만으로는 복구가 어려움",
    ],
    impact: [
      "경제적 피해의 급속 확산",
      "사회적 의사결정이 사람이 없는 회로에서 결정",
      "인간의 책임성·통제권 약화",
    ],
    openQuestion:
      "속도를 유지하면서도 인간이 의미 있는 개입을 할 수 있는 '지연 게이트(delay gate)'는 어떻게 설계할 수 있을까?",
    withoutHAI:
      "에이전트 A → B → C가 0.3ms 간격으로 500건의 거래를 연쇄 체결. 3분 후 시스템이 멈췄을 때 인간은 어느 결정이 플래시 크래시를 촉발했는지 알 수 없음.",
    withHAI:
      "Impact-Level 1~2 거래는 자동 통과, 단일 거래 규모가 임계값 초과 시(Level 4) 통신 일시 정지 + 인간 대시보드 알림. 타임아웃 내 응답 없으면 기본 정책(차단) 적용. 모든 거래는 Session-ID로 추적.",
  },
];

export default function BlackboxProblemScenarios() {
  const [open, setOpen] = useState<string>("A");
  const [haiView, setHaiView] = useState<Record<string, boolean>>({});

  const toggleHAI = (key: string) => {
    setHaiView((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section>
      <SectionTitle
        title="6. AI-AI 블랙박스화 시나리오"
        subtitle="인간이 배제되는 순간 — 3가지 위험(감독·책임·통제)과 HAI 적용 비교"
      />

      <div className="space-y-3">
        {SCENARIOS.map((s) => {
          const isOpen = open === s.key;
          const showHAI = haiView[s.key] ?? false;
          return (
            <div
              key={s.key}
              className={`overflow-hidden rounded-2xl border transition-all ${
                isOpen
                  ? "border-orange-500 bg-orange-50/60 dark:bg-orange-950/30"
                  : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? "" : s.key)}
                className="flex w-full items-start justify-between gap-3 p-5 text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/50">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                      {s.tag}
                    </div>
                    <div className="text-sm font-bold">{s.title}</div>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {s.story}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-gray-400 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {/* 3대 위험 시각화 */}
                    <div className="border-t border-orange-200 px-5 py-4 dark:border-orange-900/60">
                      <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-orange-600">
                        3대 위험 분석
                      </div>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {s.risks.map((r) => (
                          <div
                            key={r.category}
                            className={`rounded-lg p-3 text-xs ${
                              r.category === "감독"
                                ? "bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-900"
                                : r.category === "책임"
                                  ? "bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900"
                                  : "bg-violet-50 border border-violet-200 dark:bg-violet-950/30 dark:border-violet-900"
                            }`}
                          >
                            <div className={`font-bold mb-1 ${
                              r.category === "감독"
                                ? "text-red-600"
                                : r.category === "책임"
                                  ? "text-amber-600"
                                  : "text-violet-600"
                            }`}>
                              {r.category === "감독" ? "감독 불가" : r.category === "책임" ? "책임 소재 불명" : "통제권 상실"}
                            </div>
                            <div className="text-gray-700 dark:text-gray-300">{r.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 border-t border-orange-200 px-5 py-4 dark:border-orange-900/60 sm:grid-cols-2">
                      <InfoList label="왜 문제인가" items={s.why} />
                      <InfoList label="파급 효과" items={s.impact} />
                    </div>

                    {/* HAI 있음/없음 비교 토글 */}
                    <div className="border-t border-orange-200 px-5 py-4 dark:border-orange-900/60">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                          <NetworkTerm term="HAI" label="HAI" /> 적용 전·후 비교
                        </div>
                        <button
                          onClick={() => toggleHAI(s.key)}
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                            showHAI
                              ? "bg-emerald-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {showHAI ? (
                            <>
                              <ShieldCheck size={12} /> HAI 적용 후
                            </>
                          ) : (
                            <>
                              <ShieldOff size={12} /> HAI 없음
                            </>
                          )}
                        </button>
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={showHAI ? "with" : "without"}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className={`rounded-xl border p-3 text-xs ${
                            showHAI
                              ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
                              : "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                          }`}
                        >
                          <div className={`mb-1 font-bold ${showHAI ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>
                            {showHAI ? "HAI 프로토콜 적용 후" : "HAI 없는 상태"}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {showHAI ? s.withHAI : s.withoutHAI}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className="border-t border-dashed border-orange-300 bg-white/50 px-5 py-3 text-xs dark:border-orange-800 dark:bg-gray-900/50">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                        열린 질문 (스스로 답 찾기)
                      </div>
                      <p className="mt-1 text-gray-700 dark:text-gray-300">
                        {s.openQuestion}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-dashed border-orange-300 bg-orange-50/40 p-4 text-xs text-orange-900 dark:border-orange-800 dark:bg-gray-950/30 dark:text-orange-200">
        <strong>유의</strong> — 위 시나리오는 <em>사고 실험</em>이지 정답이 아님.
        &apos;HAI 없음 → HAI 적용 후&apos; 토글을 통해{" "}
        <NetworkTerm term="encapsulation" label="캡슐화" /> ·{" "}
        <NetworkTerm term="flowControl" label="흐름제어" /> ·{" "}
        <NetworkTerm term="sequencing" label="순서 결정" />의 원리가
        어떻게 블랙박스 문제에 대응하는지 직관적으로 확인해보세요.
      </div>
    </section>
  );
}

function InfoList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
        {label}
      </div>
      <ul className="mt-1 space-y-1 text-xs text-gray-700 dark:text-gray-300">
        {items.map((i) => (
          <li key={i} className="flex gap-2">
            <span className="text-orange-500">▸</span>
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
