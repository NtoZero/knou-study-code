"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronDown } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/* ---------------------------------------------------------------
 * AssignmentHintCards — 과제 4대 요구(+결론)별 원리 힌트 카드.
 *
 * 정답 문장·숫자·고유명사 노출 금지. 방향과 금지 사항만 제시.
 * ------------------------------------------------------------- */

interface Hint {
  key: string;
  section: string;
  title: string;
  do: string[];
  dont: string[];
}

const HINTS: Hint[] = [
  {
    key: "define",
    section: "§2",
    title: "HAC 정의 · Shannon-Weaver 매핑",
    do: [
      "Shannon-Weaver 모델이 단방향 가정이라는 한계를 먼저 지적한 뒤 양방향 확장의 필요성으로 전개",
      "노이즈를 전기적 차원과 의미론적 차원으로 구분해 재정의",
      "인간→AI와 AI→인간의 송·수신기 역할이 비대칭임을 강조 (토크나이저·임베딩 vs 렌더링 엔진)",
      "프로토콜을 매핑 표의 독립 행으로 추가 — 원 모델의 6요소에서 누락된 축",
    ],
    dont: [
      "Shannon 모델 5요소만 나열하고 끝내지 말 것",
      "피드백 루프 없이 HAC를 설명하지 말 것",
      "노이즈를 '지연·손실'로만 기술하지 말 것",
    ],
  },
  {
    key: "types",
    section: "§3",
    title: "HAC 유형 분류",
    do: [
      "전송 방향(단방향/반이중/전이중)과 동기/비동기 축으로 분류",
      "각 유형의 채널·프로토콜·주요 노이즈·실시간성을 비교표로 정리",
      "에이전트 기반을 '다단계 비동기 통신'으로 특징화",
      "임베디드는 암묵적(implicit) 통신 특성으로 기술",
    ],
    dont: [
      "브랜드·서비스명 나열로 분류를 대체하지 말 것",
      "하나의 유형만 깊게 파고 나머지를 건너뛰지 말 것",
      "데이터 교환 방식 설명 없이 이름만 쓰지 말 것",
    ],
  },
  {
    key: "hai",
    section: "§4",
    title: "HAI 프로토콜 계층 설계",
    do: [
      "블랙박스화의 3대 위험(감독·책임·통제)을 먼저 명확히 구분",
      "헤더 필드 각각이 1강의 어떤 프로토콜 기능(캡슐화·흐름제어·순서 결정·오류제어·우선순위)을 차용했는지 명시",
      "Impact-Level을 영향 범위·재무 영향·되돌림 가능 여부의 3축으로 정량 산정",
      "레벨별 동작을 자동 통과 / 사후 알림 / 승인 대기 등 흐름제어 관점으로 서술",
      "OSI Layer 8 은 개념적 표현이며 실제 구현은 응용 계층 미들웨어임을 비판적으로 명시",
    ],
    dont: [
      "'감시 계층을 추가하자'는 일반론으로 끝내지 말 것",
      "헤더 필드를 그냥 나열하기만 하고 기반 원리 연결을 누락하지 말 것",
      "Impact-Level을 '높음/낮음' 같은 정성 형용사만으로 설명하지 말 것",
    ],
  },
  {
    key: "conclusion",
    section: "§5",
    title: "결론 · 부록",
    do: [
      "HAI가 '효율성과 투명성의 균형'을 추구한다는 프레임으로 결론 마무리",
      "부록에 사용 모델명, 핵심 프롬프트 3개, AI 답변과 본인 수정 대조표 포함",
      "비판적 분석이 본문 어디에 나왔는지 요약해 부록에서 교차 참조",
    ],
    dont: [
      "결론을 본문 요약만으로 채우지 말 것",
      "AI 활용 내역을 '사용함' 한 줄로 끝내지 말 것",
    ],
  },
];

export default function AssignmentHintCards() {
  const [open, setOpen] = useState<string | null>("define");

  return (
    <section>
      <SectionTitle
        title="15. 과제 원리 힌트 카드"
        subtitle="답 문장·숫자 없음 · 루브릭 상 유리한 방향만 제시"
      />

      <div className="rounded-2xl border border-dashed border-orange-300 bg-orange-50/40 p-3 text-[11px] text-orange-900 dark:border-orange-800 dark:bg-orange-950/20 dark:text-orange-200">
        <Lightbulb size={12} className="mr-1 inline" />이 카드들은 <strong>답을 주지 않습니다.</strong> 각 섹션에서 놓치지 말아야 할 원리와 피해야 할 함정만 제시합니다.
      </div>

      <div className="mt-3 space-y-2">
        {HINTS.map((h) => {
          const isOpen = open === h.key;
          return (
            <div
              key={h.key}
              className={`overflow-hidden rounded-xl border-2 transition-all ${
                isOpen
                  ? "border-orange-400 bg-white dark:bg-gray-900"
                  : "border-gray-200 bg-white hover:border-orange-300 dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : h.key)}
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-[11px] font-bold text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                  {h.section}
                </div>
                <div className="flex-1 text-sm font-bold">{h.title}</div>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isOpen ? "rotate-180 text-orange-500" : "text-gray-300"
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
                    <div className="grid gap-2 border-t border-orange-200 p-3 md:grid-cols-2 dark:border-orange-900/60">
                      <div className="rounded-lg border-2 border-green-200 bg-green-50/60 p-3 dark:border-green-900/50 dark:bg-green-950/20">
                        <div className="mb-1.5 text-[10px] font-bold text-green-700 dark:text-green-300">
                          이 방향으로
                        </div>
                        <ul className="space-y-1 text-[11px] text-green-900 dark:text-green-200">
                          {h.do.map((d, i) => (
                            <li key={i} className="flex gap-1.5">
                              <span className="text-green-600">▸</span>
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg border-2 border-red-200 bg-red-50/60 p-3 dark:border-red-900/50 dark:bg-red-950/20">
                        <div className="mb-1.5 text-[10px] font-bold text-red-700 dark:text-red-300">
                          이 함정을 피할 것
                        </div>
                        <ul className="space-y-1 text-[11px] text-red-900 dark:text-red-200">
                          {h.dont.map((d, i) => (
                            <li key={i} className="flex gap-1.5">
                              <span className="text-red-600">✗</span>
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
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
