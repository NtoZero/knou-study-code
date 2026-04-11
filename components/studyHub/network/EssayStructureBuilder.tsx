"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ListChecks } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

/* ---------------------------------------------------------------
 * EssayStructureBuilder — 루브릭 13개 평가 요소를 카드로 보여주고
 * 학습자가 자기 답안 아웃라인에 빠뜨린 요소를 자체 점검하도록 함.
 *
 * 키워드는 강의 1강 용어 기반. 정답 문장 아님.
 * ------------------------------------------------------------- */

interface Criterion {
  id: string;
  area: "A" | "B" | "C" | "D";
  title: string;
  point: number;
  keywords: string[];
  section: string; // 답안의 어느 절에 해당하는지
}

const CRITERIA: Criterion[] = [
  {
    id: "A1",
    area: "A",
    title: "Shannon-Weaver 모델 정확 이해",
    point: 2,
    keywords: ["정보원", "송신기", "채널", "수신기", "목적지", "노이즈"],
    section: "§2.1",
  },
  {
    id: "A2",
    area: "A",
    title: "HAC 정보통신 관점 정의",
    point: 2,
    keywords: ["자연어·멀티모달", "양방향", "의도 해석"],
    section: "§2.2",
  },
  {
    id: "A3",
    area: "A",
    title: "요소별 HAC 대응 (프로토콜 포함)",
    point: 2,
    keywords: ["인간→AI 매핑", "AI→인간 매핑", "프로토콜 열 추가"],
    section: "§2.3",
  },
  {
    id: "B1",
    area: "B",
    title: "HAC 유형 다양성",
    point: 2,
    keywords: ["텍스트", "멀티모달", "에이전트", "임베디드"],
    section: "§3.1~3.4",
  },
  {
    id: "B2",
    area: "B",
    title: "유형별 데이터 교환 방식",
    point: 2,
    keywords: ["전송 방향", "채널", "프로토콜", "주요 노이즈"],
    section: "§3.5",
  },
  {
    id: "B3",
    area: "B",
    title: "소통 방식 진화 분석",
    point: 2,
    keywords: ["단방향→양방향", "다단계 비동기", "암묵적 통신"],
    section: "§3 결",
  },
  {
    id: "C1",
    area: "C",
    title: "HAI 아이디어 구체성",
    point: 4,
    keywords: [
      "HAI 계층",
      "헤더 구조",
      "Impact-Level 1~5",
      "Intent-Summary",
      "Reversible",
      "Human-Approval",
    ],
    section: "§4.2~4.4",
  },
  {
    id: "C2",
    area: "C",
    title: "독창성 (기존 원리 재활용)",
    point: 3,
    keywords: ["캡슐화", "흐름제어", "순서 결정", "우선순위", "표현 계층"],
    section: "§4.6",
  },
  {
    id: "C3",
    area: "C",
    title: "AI 답변 비판 분석 3곳",
    point: 3,
    keywords: ["피드백 루프 한계", "통신 관점 재분류", "Layer 8 실현 가능성"],
    section: "§2.4, §3.5, §4.6",
  },
  {
    id: "C4",
    area: "C",
    title: "AI/본인 출처 명시",
    point: 2,
    keywords: ["각 절 머리 출처", "부록 수정 내역서"],
    section: "부록",
  },
  {
    id: "D1",
    area: "D",
    title: "A4 7매 이내",
    point: 1,
    keywords: ["분량 제한", "부록 포함 여부 확인"],
    section: "전체",
  },
  {
    id: "D3",
    area: "D",
    title: "AI 활용 내역서 부록",
    point: 2,
    keywords: ["모델명", "주요 프롬프트 3개", "수정 대조표"],
    section: "부록",
  },
  {
    id: "D5",
    area: "D",
    title: "도식화 (가산점)",
    point: 1,
    keywords: ["HAI 헤더 도식", "계층도", "모니터링 UI"],
    section: "§4",
  },
];

const AREA_COLORS: Record<string, string> = {
  A: "bg-sky-500",
  B: "bg-emerald-500",
  C: "bg-orange-500",
  D: "bg-pink-500",
};

const AREA_LABEL: Record<string, string> = {
  A: "기술적 타당성 (6점)",
  B: "분석의 깊이 (6점)",
  C: "창의성 · 비판 (12점)",
  D: "지침 준수 (6점)",
};

export default function EssayStructureBuilder() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const total = CRITERIA.reduce((s, c) => s + c.point, 0);
  const got = CRITERIA.filter((c) => checked[c.id]).reduce(
    (s, c) => s + c.point,
    0,
  );
  const pct = Math.round((got / total) * 100);

  const toggle = (id: string) =>
    setChecked((p) => ({ ...p, [id]: !p[id] }));

  return (
    <section>
      <SectionTitle
        title="12. 답안 구조 빌더 (루브릭 점검)"
        subtitle="루브릭 13개 항목 ↔ 내 답안의 각 절 키워드 자가 점검"
      />

      <div className="mb-4 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-pink-50 p-4 dark:border-orange-900/50 dark:from-orange-950/40 dark:to-pink-950/40">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
              예상 자가 점수
            </div>
            <div className="text-2xl font-bold">
              {got} <span className="text-sm text-gray-500">/ {total}점</span>
            </div>
          </div>
          <div className="text-right text-xs text-gray-500">
            포함률 {pct}%
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/70 dark:bg-gray-800/70">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-pink-500"
            animate={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 text-[10px] text-orange-800 dark:text-orange-300">
          <ListChecks size={10} className="mr-1 inline" />
          각 카드는 "답안에 이 요소·키워드가 들어갔는가"를 자가 점검하는 용도.
          정답 문장이 아님.
        </div>
      </div>

      {(["A", "B", "C", "D"] as const).map((area) => (
        <div key={area} className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`inline-block h-2 w-2 rounded-full ${AREA_COLORS[area]}`}
            />
            <div className="text-xs font-bold">{AREA_LABEL[area]}</div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {CRITERIA.filter((c) => c.area === area).map((c) => {
              const on = !!checked[c.id];
              return (
                <button
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  className={`rounded-lg border-2 p-3 text-left transition-all ${
                    on
                      ? "border-orange-400 bg-orange-50 dark:bg-orange-950/40"
                      : "border-gray-200 bg-white hover:border-orange-300 dark:border-gray-800 dark:bg-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-bold">
                      {c.id} · {c.title}
                    </div>
                    <span className="rounded-full bg-gray-100 px-1.5 text-[9px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {c.point}점
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] text-gray-500">
                    답안 위치 {c.section}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {c.keywords.map((k) => (
                      <span
                        key={k}
                        className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[9px] text-orange-700 dark:bg-orange-950/60 dark:text-orange-300"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
