"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Cpu, Sparkles, ChevronDown, ChevronRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/* ------------------------------------------------------------------ */
/* 데이터                                                                */
/* ------------------------------------------------------------------ */

const MILESTONES = [
  {
    year: "1956",
    event: "다트머스 회의",
    desc: "마빈 민스키·존 매카시 등이 \"Artificial Intelligence\"라는 용어를 처음 사용. AI 연구의 공식 출발점.",
    icon: "🎓",
  },
  {
    year: "1970s~90s",
    event: "AI 겨울 (AI Winter)",
    desc: "컴퓨터 성능 한계·결과 부진으로 두 차례 침체기. 민스키의 퍼셉트론 비판(XOR 불가), 연구비 삭감. 전문가 시스템도 유지비 과다로 실패.",
    icon: "❄️",
  },
  {
    year: "1997",
    event: "딥 블루 체스 우승",
    desc: "IBM의 딥 블루가 체스 챔피언 카스파로프를 이김. 초당 2억 개의 수를 계산하는 탐색 알고리즘 활용.",
    icon: "♟️",
  },
  {
    year: "2011",
    event: "Watson, Jeopardy! 우승",
    desc: "IBM Watson이 퀴즈쇼에서 인간 챔피언들을 압도적으로 이김. 자연어 처리 + 대규모 병렬 처리.",
    icon: "❓",
  },
  {
    year: "2016",
    event: "AlphaGo, 이세돌 승리",
    desc: "구글 딥마인드의 AlphaGo가 바둑에서 이세돌 9단에게 4:1 승리. 몬테카를로 트리 탐색 + 딥러닝.",
    icon: "⚫",
  },
  {
    year: "2022~",
    event: "생성형 AI 시대",
    desc: "ChatGPT·Gemini·Copilot 등장. 대규모 언어 모델(LLM)이 텍스트·이미지·영상을 생성.",
    icon: "✨",
  },
];

const AI_TYPES = [
  {
    id: "weak",
    label: "약한 AI",
    sublabel: "Narrow AI",
    color: "border-blue-400 bg-blue-50 dark:bg-blue-950/30",
    headerColor: "bg-blue-100 dark:bg-blue-900/40",
    textColor: "text-blue-700 dark:text-blue-300",
    icon: "🤖",
    desc: "특정 작업 하나에만 특화된 AI. 현재 실용화된 AI 대부분이 여기에 해당.",
    examples: ["체스·바둑 프로그램", "얼굴 인식", "번역 앱", "음성 비서"],
  },
  {
    id: "strong",
    label: "강한 AI",
    sublabel: "AGI (인공 일반지능)",
    color: "border-purple-400 bg-purple-50 dark:bg-purple-950/30",
    headerColor: "bg-purple-100 dark:bg-purple-900/40",
    textColor: "text-purple-700 dark:text-purple-300",
    icon: "🧠",
    desc: "사람이 할 수 있는 어떤 지적 작업이든 사람 수준으로 수행. 아직 실현되지 않음.",
    examples: ["사람처럼 다양한 맥락 이해", "자의식·감정", "창의적 문제 해결", "범용 학습"],
  },
  {
    id: "generative",
    label: "생성형 AI",
    sublabel: "Generative AI",
    color: "border-pink-400 bg-pink-50 dark:bg-pink-950/30",
    headerColor: "bg-pink-100 dark:bg-pink-900/40",
    textColor: "text-pink-700 dark:text-pink-300",
    icon: "🎨",
    desc: "대규모 데이터의 패턴을 학습하여 새로운 텍스트·이미지·영상 등을 생성.",
    examples: ["ChatGPT, Gemini", "DALL-E, Midjourney", "Sora (영상)", "GitHub Copilot"],
  },
];

const APPROACHES = [
  {
    id: "symbolic",
    label: "기호처리 AI",
    sublabel: "Symbolic AI",
    icon: "🔣",
    color: "indigo",
    borderCls: "border-indigo-300 dark:border-indigo-800",
    bgCls: "bg-indigo-50 dark:bg-indigo-950/30",
    badgeCls: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
    idea: "지식을 논리 기호와 규칙으로 표현하고 추론",
    example: "전문가 시스템 (MYCIN, Dendral)",
    pros: "결과 설명 가능, 논리적으로 검증 가능",
    cons: "상식 지식 표현의 한계, 실세계 복잡성에 취약",
  },
  {
    id: "statistical",
    label: "통계적 접근",
    sublabel: "Statistical / ML",
    icon: "📊",
    color: "emerald",
    borderCls: "border-emerald-300 dark:border-emerald-800",
    bgCls: "bg-emerald-50 dark:bg-emerald-950/30",
    badgeCls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    idea: "데이터로부터 통계적 패턴을 학습하여 예측·분류",
    example: "결정트리, SVM, 베이즈 분류기",
    pros: "불확실성 처리, 데이터 기반 예측에 강함",
    cons: "대량 데이터 필요, 결과 해석 어려울 수 있음",
  },
  {
    id: "connectionism",
    label: "연결주의",
    sublabel: "Connectionism / 딥러닝",
    icon: "🕸️",
    color: "orange",
    borderCls: "border-orange-300 dark:border-orange-800",
    bgCls: "bg-orange-50 dark:bg-orange-950/30",
    badgeCls: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
    idea: "뇌의 신경망을 모방한 인공 신경망으로 패턴 학습",
    example: "인공 신경망, 딥러닝, ChatGPT의 LLM",
    pros: "이미지·음성·언어 처리에 탁월한 성능",
    cons: "블랙박스 문제, 대규모 계산 자원 필요",
  },
];

/* ------------------------------------------------------------------ */
/* 메인 컴포넌트                                                          */
/* ------------------------------------------------------------------ */
export default function AIOverviewIntro() {
  const [activeType, setActiveType] = useState<string>("weak");
  const [openApproach, setOpenApproach] = useState<string | null>("symbolic");
  const [milestoneIdx, setMilestoneIdx] = useState(0);

  return (
    <section className="space-y-10">
      <SectionTitle
        title="1강 · 인공지능이란 무엇인가?"
        subtitle="처음 AI를 배운다면 여기서 시작 — 개념·역사·접근방법을 한눈에 이해"
      />

      {/* ── 1. 튜링 테스트 ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 dark:border-indigo-900/40 dark:from-indigo-950/30 dark:to-purple-950/30">
        <div className="mb-4 flex items-center gap-2">
          <Brain size={20} className="text-indigo-600" />
          <h3 className="text-base font-bold text-indigo-800 dark:text-indigo-200">
            인공지능의 시작 — 튜링 테스트
          </h3>
        </div>

        {/* 대화 시뮬레이션 */}
        <div className="mb-4 rounded-xl bg-white p-4 dark:bg-gray-900">
          <p className="mb-3 text-xs text-gray-500">
            <b>상황:</b> 심문자(사람)가 텍스트로만 대화합니다. 상대방이 사람인지 컴퓨터인지 구별할 수 없다면?
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                role: "심문자 (사람)",
                msg: "\"시를 한 편 지어봐, 주제는 가을\"",
                color: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900",
                badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
              },
              {
                role: "A (컴퓨터?)",
                msg: "\"낙엽이 지는 소리에 / 계절이 물든다...\"",
                color: "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700",
                badge: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
              },
              {
                role: "B (사람?)",
                msg: "\"찬바람이 불어오는 / 텅 빈 거리를 걷는다\"",
                color: "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700",
                badge: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
              },
            ].map((item) => (
              <div key={item.role} className={`rounded-lg border p-3 ${item.color}`}>
                <span className={`mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${item.badge}`}>
                  {item.role}
                </span>
                <p className="text-xs italic text-gray-700 dark:text-gray-300">{item.msg}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg bg-indigo-50 p-2 text-xs text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-200">
            💡 구별이 안 된다면 컴퓨터는 '생각한다'고 볼 수 있다 — Alan Turing (1950)
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 text-xs">
          <div className="rounded-lg bg-white/70 p-3 dark:bg-gray-900/70">
            <span className="font-bold text-indigo-700 dark:text-indigo-300">핵심 아이디어</span>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              지능을 <b>내부 구조</b>가 아닌 <b>외부 행동</b>으로 판단. "사람처럼 행동하면 지능이 있다."
            </p>
          </div>
          <div className="rounded-lg bg-white/70 p-3 dark:bg-gray-900/70">
            <span className="font-bold text-purple-700 dark:text-purple-300">지능에 필요한 능력</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {["자연어 이해", "지식 활용", "학습", "추론", "인지", "창조"].map((c) => (
                <span key={c} className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. AI 발전 타임라인 ─────────────────────────────────────── */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
          <Cpu size={16} /> 인간 vs AI 주요 사건 타임라인
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {MILESTONES.map((m, i) => (
            <button
              key={m.year}
              onClick={() => setMilestoneIdx(i)}
              className={`flex shrink-0 flex-col items-center gap-1 rounded-xl border px-4 py-3 text-center transition-all ${
                milestoneIdx === i
                  ? "border-indigo-400 bg-indigo-50 shadow-sm dark:border-indigo-700 dark:bg-indigo-950/50"
                  : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              <span className="text-xl">{m.icon}</span>
              <span className={`text-[11px] font-bold ${milestoneIdx === i ? "text-indigo-700 dark:text-indigo-300" : "text-gray-500"}`}>
                {m.year}
              </span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={milestoneIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/30"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{MILESTONES[milestoneIdx].icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                    {MILESTONES[milestoneIdx].year}
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {MILESTONES[milestoneIdx].event}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  {MILESTONES[milestoneIdx].desc}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── 3. AI 종류 (약한/강한/생성형) ─────────────────────────────── */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
          <Sparkles size={16} /> AI의 종류 — 클릭해서 비교
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {AI_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveType(t.id)}
              className={`rounded-xl border-2 p-4 text-left transition-all ${t.color} ${
                activeType === t.id ? "shadow-md ring-2 ring-indigo-400/50" : "opacity-80"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <div className={`text-sm font-bold ${t.textColor}`}>{t.label}</div>
                  <div className="text-[10px] text-gray-500">{t.sublabel}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {AI_TYPES.filter((t) => t.id === activeType).map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`mt-3 rounded-xl border-2 p-4 ${t.color}`}
            >
              <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">{t.desc}</p>
              <div className={`rounded-lg p-2 ${t.headerColor}`}>
                <span className={`text-[11px] font-bold ${t.textColor}`}>대표 사례</span>
                <ul className="mt-1 grid grid-cols-2 gap-1">
                  {t.examples.map((ex) => (
                    <li key={ex} className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <ChevronRight size={10} className={t.textColor} />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── 4. AI 구현 접근방법 ─────────────────────────────────────── */}
      <div>
        <h3 className="mb-4 text-sm font-bold text-gray-700 dark:text-gray-300">
          AI를 만드는 세 가지 접근 방법
        </h3>
        <p className="mb-4 text-xs text-gray-500">
          이 강의에서 배우는 <b>탐색 알고리즘(UCS·A*)</b>은 기호처리 AI와 통계적 접근의 교차점에 있습니다.
        </p>
        <div className="space-y-2">
          {APPROACHES.map((ap) => (
            <div key={ap.id} className={`rounded-xl border ${ap.borderCls} overflow-hidden`}>
              <button
                onClick={() => setOpenApproach(openApproach === ap.id ? null : ap.id)}
                className={`flex w-full items-center justify-between px-4 py-3 text-left ${ap.bgCls}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{ap.icon}</span>
                  <div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{ap.label}</span>
                    <span className="ml-2 text-[10px] text-gray-500">{ap.sublabel}</span>
                  </div>
                </div>
                {openApproach === ap.id ? (
                  <ChevronDown size={16} className="text-gray-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-400" />
                )}
              </button>
              <AnimatePresence>
                {openApproach === ap.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-3 p-4 sm:grid-cols-3 bg-white dark:bg-gray-900">
                      <div>
                        <span className={`text-[10px] font-bold ${ap.badgeCls.split(" ").slice(1).join(" ")}`}>핵심 아이디어</span>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{ap.idea}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-emerald-600">장점</span>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{ap.pros}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-rose-600">한계</span>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{ap.cons}</p>
                      </div>
                      <div className="sm:col-span-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${ap.badgeCls}`}>
                          대표 사례: {ap.example}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. 머신러닝 한 줄 요약 ───────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h4 className="mb-2 text-xs font-bold text-gray-600 dark:text-gray-400">머신러닝(Machine Learning)이란?</h4>
        <p className="text-xs text-gray-700 dark:text-gray-300">
          수집된 데이터로부터 문제풀이에 필요한 지식을 스스로 습득하여 시스템이 자동으로 행동을 향상시키는 과정.
          <br />
          <span className="mt-1 block text-gray-500">
            방식 ① 직접 지식 전달 &nbsp;② 귀납적 지식 형성 (데이터 → 규칙) &nbsp;③ 강화 학습 (보상/벌칙)
          </span>
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-200">
          <span className="font-bold">이 강의의 위치:</span>
          탐색 알고리즘은 AI가 스스로 해를 찾아나가는 <b>문제풀이</b>의 핵심 기법. 머신러닝 이전에 반드시 이해해야 할 기초.
        </div>
      </div>
    </section>
  );
}
