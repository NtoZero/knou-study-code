"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface Tip {
  key: string;
  title: string;
  detail: string;
}

const TIPS: Tip[] = [
  {
    key: "structure",
    title: "논리 구조: 정의 → 분류 → 문제제기 → 제안 → 한계",
    detail:
      "HAC 정의 → HAC 유형 분류 → AI-AI 블랙박스 문제 → 본인의 개입 아이디어 → 아이디어의 한계/전제. 5단계 흐름을 명확히.",
  },
  {
    key: "elements",
    title: "Shannon-Weaver 6요소를 모두 언급",
    detail:
      "정보원 / 송신기(인코더) / 채널 / 수신기(디코더) / 목적지 / 노이즈. 각 요소가 HAC 문맥에서 무엇인지 1문장 이상 서술.",
  },
  {
    key: "aiLog",
    title: "AI 활용 및 수정 내역서 작성",
    detail:
      "사용 모델명(예: ChatGPT-4o, Claude), 핵심 질문 2~3개, AI가 답변한 원문 vs 본인이 수정한 부분을 명시. 과제 지침 필수 요건.",
  },
  {
    key: "critical",
    title: "AI 답변에 대한 비판적 분석",
    detail:
      "AI가 잘못 설명했거나 모호한 부분을 1~2개 이상 찾아 본인 의견으로 보완. 단순 복붙은 감점 요인.",
  },
  {
    key: "diagram",
    title: "HAC 모델 · 인간 개입 구조 다이어그램",
    detail:
      "손으로 그려도 좋음. Shannon-Weaver 확장 그림 + 본인이 제안하는 개입 구조도를 포함하면 가산점.",
  },
  {
    key: "refs",
    title: "참고문헌 · 출처 명시",
    detail:
      "Wikipedia(Shannon-Weaver), Interaction-Design.org(Human-AI Interaction), ETRI 리포트, 학술 논문 등. URL · 접속일 포함.",
  },
  {
    key: "format",
    title: "형식: A4 7매 이내, 11pt, 줄간격 160%(한글)/1.0(Word)",
    detail:
      "PDF로 변환(5MB 이내) 제출. 보조파일 불허. 본파일만 업로드.",
  },
];

const RUBRIC = [
  { label: "기술적 타당성", pct: 20, color: "bg-sky-500" },
  { label: "분석의 깊이", pct: 20, color: "bg-emerald-500" },
  { label: "창의성 · 비판적 사고", pct: 40, color: "bg-orange-500" },
  { label: "지침 준수 여부", pct: 20, color: "bg-pink-500" },
];

export default function EssayWritingTips() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = Math.round(
    (Object.values(done).filter(Boolean).length / TIPS.length) * 100,
  );

  return (
    <section>
      <SectionTitle
        title="8. 에세이 작성 팁 · 평가 기준"
        subtitle="체크리스트와 루브릭으로 과제 완성도를 확인"
      />

      <div className="mb-4 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-pink-50 p-4 dark:border-orange-900/60 dark:from-orange-950/40 dark:to-pink-950/40">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
              준비 진행률
            </div>
            <div className="text-2xl font-bold">{progress}%</div>
          </div>
          <div className="text-right text-xs text-gray-500">
            완료: {Object.values(done).filter(Boolean).length} / {TIPS.length}
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/70 dark:bg-gray-800/70">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-pink-500"
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {TIPS.map((t) => {
          const isDone = !!done[t.key];
          return (
            <button
              key={t.key}
              onClick={() => setDone((p) => ({ ...p, [t.key]: !p[t.key] }))}
              className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                isDone
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-950/40"
                  : "border-gray-200 bg-white hover:border-orange-300 dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              <motion.div
                animate={{
                  scale: isDone ? [1, 1.2, 1] : 1,
                  backgroundColor: isDone ? "#f97316" : "#f3f4f6",
                }}
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
              >
                <Check
                  size={14}
                  className={isDone ? "text-white" : "text-transparent"}
                />
              </motion.div>
              <div className="flex-1">
                <div
                  className={`text-sm font-semibold ${
                    isDone
                      ? "text-orange-700 line-through dark:text-orange-300"
                      : ""
                  }`}
                >
                  {t.title}
                </div>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  {t.detail}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 루브릭 막대 그래프 */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 text-sm font-bold">평가 기준 (30점 만점)</div>
        <div className="space-y-3">
          {RUBRIC.map((r) => (
            <div key={r.label}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-semibold">{r.label}</span>
                <span className="text-gray-500">{r.pct}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <motion.div
                  className={`h-full ${r.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${r.pct * 2.5}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-gray-500">
          창의성 · 비판적 사고 가중치가 <strong className="text-orange-600">40%</strong>로 가장 높음.
          AI가 주는 답을 그대로 옮기는 것보다, 비판과 독창성이 훨씬 중요함.
        </p>
      </div>
    </section>
  );
}
