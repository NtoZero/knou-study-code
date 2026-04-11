"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Brain } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/* ---------------------------------------------------------------
 * NetworkQuizSection — 카테고리 태그가 포함된 10문항+ 자가 진단 퀴즈.
 * 개념 이해와 서술 전략 모두 테스트.
 * ------------------------------------------------------------- */

type Category =
  | "shannon"
  | "mapping"
  | "hac-type"
  | "protocol"
  | "osi"
  | "blackbox"
  | "hai"
  | "essay";

interface Quiz {
  q: string;
  choices: string[];
  answer: number;
  explain: string;
  category: Category;
}

const CATEGORIES: Record<Category, { label: string; color: string }> = {
  shannon: { label: "Shannon-Weaver", color: "bg-sky-500" },
  mapping: { label: "HAC 매핑", color: "bg-emerald-500" },
  "hac-type": { label: "HAC 유형", color: "bg-amber-500" },
  protocol: { label: "프로토콜 기능", color: "bg-violet-500" },
  osi: { label: "OSI 계층", color: "bg-rose-500" },
  blackbox: { label: "블랙박스 문제", color: "bg-gray-600" },
  hai: { label: "HAI 설계", color: "bg-orange-500" },
  essay: { label: "서술 전략", color: "bg-pink-500" },
};

const QUIZZES: Quiz[] = [
  {
    category: "shannon",
    q: "Shannon-Weaver 모델에서 '채널'과 '노이즈'가 만나는 층위는?",
    choices: [
      "메시지가 기호로 변환되기 전",
      "신호가 물리적 매체를 지나는 동안",
      "목적지에서 의미가 해석된 이후",
      "정보원이 메시지를 떠올리는 순간",
    ],
    answer: 1,
    explain:
      "노이즈는 신호가 채널을 통과하는 동안 s(t)를 r(t)로 왜곡시키는 요인으로 정의됨 (1강 통신 시스템 모델).",
  },
  {
    category: "shannon",
    q: "Weaver가 Shannon의 순수 기술적 모델에 추가한 '3단계 문제'가 아닌 것은?",
    choices: [
      "A 기술적 문제 — 기호가 얼마나 정확히 전달되는가",
      "B 의미론적 문제 — 전달된 기호가 의도한 의미를 전달하는가",
      "C 효과성 문제 — 받은 의미가 행동을 유도하는가",
      "D 비용 문제 — 통신 비용이 적정한가",
    ],
    answer: 3,
    explain:
      "Weaver는 A/B/C 3단계를 제시. 비용 문제는 Weaver의 원 확장에 포함되지 않음.",
  },
  {
    category: "mapping",
    q: "HAC에서 '비대칭적 인코딩/디코딩 구조'를 가장 잘 설명하는 것은?",
    choices: [
      "인간과 AI가 동일한 ASCII 코드를 사용한다",
      "인간은 자연어로, AI는 토큰·임베딩 벡터로 서로 다른 체계를 쓴다",
      "채널이 양방향이지만 대역폭이 비대칭이다",
      "송신자가 항상 인간이다",
    ],
    answer: 1,
    explain:
      "과제 2.4절의 첫째 차이점. 인간의 자연어와 AI의 토큰/임베딩은 인코딩 체계가 근본적으로 다름.",
  },
  {
    category: "hac-type",
    q: "에이전트 기반 HAC의 통신 구조를 가장 잘 설명하는 것은?",
    choices: [
      "동기 단일 요청-응답",
      "단방향 브로드캐스트",
      "다단계 비동기 통신 (관찰-사고-행동 루프)",
      "전이중 아날로그 통신",
    ],
    answer: 2,
    explain:
      "AI 에이전트는 목표 분해 → 도구 호출 → 관찰 → 재추론을 반복. 각 단계가 비동기적으로 진행되는 다단계 구조.",
  },
  {
    category: "hac-type",
    q: "텍스트 기반 HAC를 전송 방향으로 분류하면 가장 적절한 것은?",
    choices: ["단방향", "반이중(요청-응답)", "전이중(동시 통화)", "방향 없음"],
    answer: 1,
    explain:
      "사용자 질문과 AI 응답이 번갈아 발생하는 요청-응답 패턴은 반이중 통신에 해당.",
  },
  {
    category: "protocol",
    q: "1강에서 정의한 프로토콜의 기본 요소 3가지가 아닌 것은?",
    choices: ["구문(syntax)", "의미(semantic)", "타이밍(timing)", "대역폭(bandwidth)"],
    answer: 3,
    explain:
      "프로토콜의 기본 요소는 구문·의미·타이밍. 대역폭은 물리 채널의 속성.",
  },
  {
    category: "protocol",
    q: "'하나의 통신로를 여러 개로 나눠 다수 가입자가 동시에 쓰게 하는 기능'은?",
    choices: ["단편화", "흐름제어", "다중화", "캡슐화"],
    answer: 2,
    explain:
      "1강 프로토콜 기능 표의 다중화(multiplexing) 정의. 멀티모달 HAC 채널의 유비로 과제에서 활용 가능.",
  },
  {
    category: "osi",
    q: "OSI 모델에서 '인코딩/디코딩, 암호화/복호화, 압축'을 담당하는 계층은?",
    choices: [
      "응용 계층 (Layer 7)",
      "표현 계층 (Layer 6)",
      "세션 계층 (Layer 5)",
      "전송 계층 (Layer 4)",
    ],
    answer: 1,
    explain:
      "1강 OSI 7계층 표의 표현 계층 정의. HAI Intent-Summary의 자연어 변환도 표현 계층의 유사 기능.",
  },
  {
    category: "blackbox",
    q: "AI-to-AI 블랙박스화로 인한 3대 위험이 아닌 것은?",
    choices: ["감독 불가", "책임 소재 불명", "통제권 상실", "대역폭 부족"],
    answer: 3,
    explain:
      "과제 4.1절이 정의한 3대 위험은 감독·책임·통제. 대역폭은 블랙박스화의 원인이지 위험 항목이 아님.",
  },
  {
    category: "hai",
    q: "HAI 헤더의 Impact-Level 4~5일 때 흐름제어 동작은?",
    choices: [
      "자동 통과 후 로그만 남김",
      "통과 + 사후 알림",
      "일시 정지 + 인간 승인 대기",
      "즉시 차단",
    ],
    answer: 2,
    explain:
      "과제 4.4절 1) 임계값 기반 인간 개입. Level 4~5는 통신을 일시 정지하고 승인을 대기.",
  },
  {
    category: "hai",
    q: "HAI 헤더의 Session-ID가 차용한 1강 프로토콜 기능은?",
    choices: ["오류제어", "흐름제어", "순서 결정(sequencing)", "단편화"],
    answer: 2,
    explain:
      "Session-ID로 AI 간 대화의 인과·순서를 보존하는 것은 순서 결정 기능의 차용.",
  },
  {
    category: "essay",
    q: "서술형 답안에서 루브릭 C 영역(창의성·비판)의 가중치는?",
    choices: ["10%", "20%", "40%", "50%"],
    answer: 2,
    explain:
      "rubric.md 기준 C 영역 12/30점 = 40%. 비판적 분석과 독창성이 가장 중요함.",
  },
  {
    category: "essay",
    q: "부록 'AI 활용 및 수정 내역서'에 반드시 포함되어야 하는 것은?",
    choices: [
      "연구실 주소",
      "사용 모델명, 주요 프롬프트, AI 답변과 본인 수정 대조",
      "GitHub 저장소 링크",
      "참고 도서 ISBN",
    ],
    answer: 1,
    explain:
      "루브릭 D3 요구사항. 모델명 + 프롬프트 + 수정 내역표 3요소가 부록의 핵심.",
  },
];

export default function NetworkQuizSection() {
  const [filter, setFilter] = useState<Category | "all">("all");
  const [answered, setAnswered] = useState<Record<number, number>>({});

  const filtered = QUIZZES.filter(
    (q) => filter === "all" || q.category === filter,
  );

  const correct = Object.entries(answered).filter(
    ([idx, a]) => Number(a) === QUIZZES[Number(idx)].answer,
  ).length;

  return (
    <section>
      <SectionTitle
        title="14. 자가 점검 퀴즈"
        subtitle={`카테고리 ${Object.keys(CATEGORIES).length}종 · 총 ${QUIZZES.length}문항`}
      />

      <div className="mb-4 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-pink-50 p-4 dark:border-orange-900/50 dark:from-orange-950/40 dark:to-pink-950/40">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-orange-500" />
          <div className="text-xs font-bold">
            점수: {correct} / {QUIZZES.length}
          </div>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
            filter === "all"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          전체
        </button>
        {(Object.keys(CATEGORIES) as Category[]).map((c) => {
          const meta = CATEGORIES[c];
          return (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                filter === c
                  ? `${meta.color} text-white`
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filtered.map((q) => {
          const idx = QUIZZES.indexOf(q);
          const sel = answered[idx];
          const isCorrect = sel === q.answer;
          const meta = CATEGORIES[q.category];
          return (
            <div
              key={idx}
              className="rounded-xl border-2 border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold text-white ${meta.color}`}
                >
                  {meta.label}
                </span>
                <span className="text-[10px] text-gray-400">Q{idx + 1}</span>
              </div>
              <div className="mb-3 text-sm font-semibold">{q.q}</div>
              <div className="space-y-1.5">
                {q.choices.map((c, i) => {
                  const picked = sel === i;
                  const showRight = sel !== undefined && i === q.answer;
                  const showWrong = picked && !isCorrect;
                  return (
                    <button
                      key={i}
                      onClick={() =>
                        sel === undefined &&
                        setAnswered((p) => ({ ...p, [idx]: i }))
                      }
                      disabled={sel !== undefined}
                      className={`flex w-full items-center gap-2 rounded-lg border-2 p-2 text-left text-[11px] transition-all ${
                        showRight
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                          : showWrong
                            ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                            : picked
                              ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30"
                              : "border-gray-200 bg-white hover:border-orange-300 dark:border-gray-700 dark:bg-gray-800"
                      }`}
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold dark:bg-gray-700">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{c}</span>
                      {showRight && (
                        <CheckCircle2 size={14} className="text-green-600" />
                      )}
                      {showWrong && (
                        <XCircle size={14} className="text-red-600" />
                      )}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {sel !== undefined && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mt-2 overflow-hidden"
                  >
                    <div
                      className={`rounded-lg p-2 text-[11px] ${
                        isCorrect
                          ? "bg-green-50 text-green-900 dark:bg-green-950/30 dark:text-green-200"
                          : "bg-red-50 text-red-900 dark:bg-red-950/30 dark:text-red-200"
                      }`}
                    >
                      {q.explain}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
