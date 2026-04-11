"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, AlertCircle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/* ---------------------------------------------------------------
 * NetworkCommonMistakes — 서술형 과제의 대표적인 얕은 답변과
 * 루브릭 상 유리한 깊은 답변의 대조 체크리스트.
 * ------------------------------------------------------------- */

interface Mistake {
  key: string;
  title: string;
  shallow: string;
  deep: string;
  rubric: string;
}

const MISTAKES: Mistake[] = [
  {
    key: "feedback",
    title: "Shannon-Weaver를 HAC에 그대로 적용",
    shallow:
      "HAC도 정보원 → 송신기 → 채널 → 수신기 → 목적지 구조라고만 쓰고 끝냄. 피드백 루프 언급 없음.",
    deep:
      "Shannon 모델은 본래 단방향이라는 한계를 먼저 지적하고, Weaver가 후에 추가한 피드백 개념을 HAC의 '프롬프트 정제' 반복으로 재해석. 양방향 확장의 필요성을 서술.",
    rubric: "C3 창의성 · 비판적 사고 — 비판적 분석 3곳 이상 요구",
  },
  {
    key: "noise",
    title: "HAC 노이즈를 전기적 노이즈로만 설명",
    shallow:
      "노이즈는 네트워크 지연·패킷 손실이라고 쓰고 끝냄. 환각·모호성 언급 없음.",
    deep:
      "Shannon 원모델의 노이즈는 물리적(전기적 간섭) 차원이지만, HAC에서는 프롬프트 모호성·환각·컨텍스트 유실 등 의미론적 차원의 노이즈가 핵심임을 구분해서 서술.",
    rubric: "B2 각 유형의 데이터 교환 방식을 정확히 설명",
  },
  {
    key: "types",
    title: "HAC 유형 분류가 서비스명 나열",
    shallow:
      "HAC 유형을 ChatGPT·Gemini·Siri 등 브랜드 목록으로 제시. 정보통신 관점 차원 축 없음.",
    deep:
      "전송 방향(단방향/반이중/전이중), 동기/비동기, 채널, 주요 노이즈, 실시간성 등 통신 특성 축으로 분류한 뒤 대표 서비스는 각 분류의 예시로만 제시.",
    rubric: "B1 분류의 다양성 · B2 데이터 교환 방식",
  },
  {
    key: "protocol",
    title: "HAI 설계에서 프로토콜 기능 연결 누락",
    shallow:
      "\"감시 계층을 추가하자\"는 일반론만 서술. 어떤 원리를 차용했는지 불명.",
    deep:
      "HAI 헤더 부착을 캡슐화, 인간 개입을 흐름제어, 세션 추적을 순서 결정, 무결성 해시를 오류제어, Impact-Level을 우선순위 전송 서비스와 명시적으로 연결해 서술.",
    rubric: "C1 구체성 · C2 독창성 (기존 통신 원리 재활용)",
  },
  {
    key: "impact",
    title: "Impact-Level을 형용사만으로 설명",
    shallow:
      "\"중요도가 높으면 인간 개입\"이라는 모호한 기준. 정량적 산정 근거 없음.",
    deep:
      "영향 범위(사용자 수), 재무 영향(금액), 되돌림 가능 여부(Reversible) 세 축으로 1~5 레벨을 산정하는 기준을 구체화하고, 레벨별 흐름제어 동작(통과/알림/대기)을 명시.",
    rubric: "C1 아이디어의 구체성",
  },
  {
    key: "terms",
    title: "강의 용어 대신 일반상식어 사용",
    shallow:
      "\"서로 잘 연결되게 만드는 규칙\", \"메시지 쪼개기\" 처럼 통상어로 풀어씀.",
    deep:
      "1강의 '캡슐화', '흐름제어', '순서 결정', '우선순위', '다중화', 'OSI 표현 계층' 등 강의 원문 용어를 그대로 인용하며 HAC 문맥에 적용.",
    rubric: "A1·A2 기술적 타당성",
  },
  {
    key: "critical",
    title: "AI 답변을 그대로 옮겨 반례·비판 없음",
    shallow:
      "AI가 준 답변을 요약한 뒤 바로 결론으로 진행. 한계 분석 부재.",
    deep:
      "AI 초안의 한계(예: OSI Layer 8 개념의 실현 가능성, 단방향 모델 가정)를 최소 3곳에서 비판적으로 지적하고, 본인의 수정·보완을 명시. 부록에 수정 내역서 포함.",
    rubric: "C3 비판 검증 · C4 출처 표기",
  },
  {
    key: "scope",
    title: "블랙박스화 위험을 1~2개만 언급",
    shallow:
      "\"인간이 이해하기 어렵다\"는 식의 단일 위험만 기술.",
    deep:
      "감독 불가 · 책임 소재 불명 · 통제권 상실의 3대 위험을 구분해서 기술하고, 각각에 대해 HAI의 어떤 필드(Intent-Summary / Audit-Hash / Impact-Level)가 대응하는지 매핑.",
    rubric: "C1·C2 창의성 및 구체성",
  },
  {
    key: "format",
    title: "도식·비교표 누락",
    shallow:
      "모든 내용을 텍스트 단락으로만 서술. 루브릭의 도식 가산점 놓침.",
    deep:
      "Shannon-Weaver 매핑 표, HAC 유형 비교표, HAI 헤더 구조도, 인간 개입 플로우 등 최소 3개의 도식·표를 본문에 삽입.",
    rubric: "D5 도식화 가산점",
  },
  {
    key: "refs",
    title: "참고문헌·AI 수정 내역서 부실",
    shallow:
      "참고문헌 2건 미만. AI 활용 내역을 '사용함' 한 줄로 마무리.",
    deep:
      "Shannon 원논문, Wikipedia, ETRI 리포트, 강의록 등 4건 이상의 출처를 명시하고, 부록에 사용 모델, 주요 프롬프트 3개, AI 답변과 본인 수정 대조표를 포함.",
    rubric: "C4·D3·D4 지침 준수",
  },
];

export default function NetworkCommonMistakes() {
  const [open, setOpen] = useState<string | null>(MISTAKES[0].key);

  return (
    <section>
      <SectionTitle
        title="11. 서술형 답안의 흔한 실수"
        subtitle="얕은 답변 vs 깊은 답변 · 루브릭 상 어떤 것이 유리한가"
      />

      <div className="space-y-2">
        {MISTAKES.map((m, i) => {
          const isOpen = open === m.key;
          return (
            <div
              key={m.key}
              className={`overflow-hidden rounded-xl border-2 transition-all ${
                isOpen
                  ? "border-orange-400 bg-white dark:bg-gray-900"
                  : "border-gray-200 bg-white hover:border-orange-300 dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : m.key)}
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">{m.title}</div>
                </div>
                <AlertCircle
                  size={14}
                  className={isOpen ? "text-orange-500" : "text-gray-300"}
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
                    <div className="border-t border-orange-200 px-4 py-3 dark:border-orange-900/60">
                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="rounded-lg border-2 border-red-200 bg-red-50/60 p-3 dark:border-red-900/50 dark:bg-red-950/20">
                          <div className="mb-1 flex items-center gap-1 text-[10px] font-bold text-red-700 dark:text-red-300">
                            <X size={11} /> 얕은 답변
                          </div>
                          <p className="text-[11px] text-red-900 dark:text-red-200">
                            {m.shallow}
                          </p>
                        </div>
                        <div className="rounded-lg border-2 border-green-200 bg-green-50/60 p-3 dark:border-green-900/50 dark:bg-green-950/20">
                          <div className="mb-1 flex items-center gap-1 text-[10px] font-bold text-green-700 dark:text-green-300">
                            <Check size={11} /> 깊은 답변
                          </div>
                          <p className="text-[11px] text-green-900 dark:text-green-200">
                            {m.deep}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 rounded bg-orange-50 px-2 py-1 text-[10px] text-orange-900 dark:bg-orange-950/40 dark:text-orange-200">
                        <strong>루브릭 근거:</strong> {m.rubric}
                      </div>
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
