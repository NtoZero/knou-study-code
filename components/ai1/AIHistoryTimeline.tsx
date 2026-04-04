"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  category: "birth" | "growth" | "winter" | "revival";
  summary: string;
  details: string[];
}

const events: TimelineEvent[] = [
  {
    id: 1,
    year: "1956",
    title: "다트머스 회의 (Dartmouth Workshop)",
    category: "birth",
    summary:
      "'Artificial Intelligence' 용어가 처음 사용되기 시작한 역사적 회의",
    details: [
      "마빈 민스키, 존 메카시, 너새니얼 로체스터, 클로드 섀넌 등이 제안하여 개최",
      "'Artificial Intelligence'라는 용어가 처음 사용되기 시작",
      "기호처리 기법, 제한된 영역에 집중한 시스템(초기 전문가 시스템), 연역 시스템과 귀납 시스템 등이 초기 인공지능의 주류를 형성",
    ],
  },
  {
    id: 2,
    year: "1950s-60s",
    title: "퍼셉트론 (프랭크 로젠블랫)",
    category: "birth",
    summary: "인공 신경망의 초기 모델. ADALINE, 홉필드 네트워크 등도 개발",
    details: [
      "프랭크 로젠블랫이 제안한 인공 신경망의 초기 모델",
      "초기 인공 신경망 모델: 퍼셉트론, ADALINE, 홉필드 네트워크",
      "Herbert A. Simon의 예측: 디지털 컴퓨터가 세계 체스 챔피언이 될 것, 기계가 사람이 할 수 있는 어떤 일이든 할 수 있게 될 것",
    ],
  },
  {
    id: 3,
    year: "1959",
    title: "일반문제풀이기 (GPS)",
    category: "growth",
    summary:
      "Herbert A. Simon 등이 어느 문제에든 적용할 수 있는 범용 문제풀이 기계를 개발",
    details: [
      "Herbert A. Simon 등이 개발",
      "어떠한 문제에든 적용할 수 있는 일반적인 문제풀이 기계를 만들기 위해 개발",
      "간단한 문제는 풀이 가능하나 실세계 문제에는 중간 상태 조합 폭발로 적용 불가",
      "이후 광범위한 지식이 필요한 일반문제 풀이 시도에서 특정 분야의 지식을 이용한 인공지능 시스템으로 전환",
    ],
  },
  {
    id: 4,
    year: "1965",
    title: "Dendral (전문가 시스템)",
    category: "growth",
    summary: "질량 분석 데이터와 화학 지식으로 미지의 유기 분자 식별 보조",
    details: [
      "최초의 전문가 시스템 중 하나",
      "질량 분석 데이터와 화학 지식을 이용하여 미지의 유기 분자를 식별하는 것을 보조",
      "특정 분야의 전문가 지식을 논리적 규칙으로 표현하고 추론하여 문제 해결",
      "전문가 시스템 주요 구성: 지식 베이스(지식의 구조화 및 저장), 추론기관(지식과 외부 사실 정보의 조합방법 탐색)",
    ],
  },
  {
    id: 5,
    year: "1972",
    title: "MYCIN (전문가 시스템)",
    category: "growth",
    summary: "감염 유발 세균 식별, 항생제 및 투여량 처방 조언",
    details: [
      "의료 분야의 전문가 시스템",
      "감염을 유발하는 세균을 식별하고 항생제 및 투여량을 처방 조언",
      "지식공학: 지식의 체계화, 축적, 이용을 연구하는 학문",
      "지식의 표현 및 추론에 적합한 프로그래밍 언어(5GL), 인공지능용 컴퓨터(FGCS) 등의 연구 진행",
    ],
  },
  {
    id: 6,
    year: "1970s-1990s",
    title: "인공지능의 겨울 (AI Winter)",
    category: "winter",
    summary:
      "1970년대 중·후반과 1990년대에 걸친 인공지능 연구의 침체기",
    details: [
      "민스키: 퍼셉트론은 XOR 같은 단순 문제도 해결할 수 없다고 비판",
      "컴퓨터 성능의 한계로 복잡한 문제 해결 불가",
      "결과물의 성능 부족",
      "결과물의 유용성 부족",
      "결과물의 유연성 부족",
      "경제성 부족",
    ],
  },
  {
    id: 7,
    year: "2010s~",
    title: "딥러닝/LLM 부흥",
    category: "revival",
    summary:
      "머신러닝 기술의 획기적 발전과 데이터, 계산능력 증대로 AI 부흥",
    details: [
      "머신러닝 기술의 획기적 발전: 딥러닝 모델, 거대 언어 모델(LLM)",
      "웹, 스마트폰, SNS를 통한 풍부한 학습 데이터 생성",
      "GPGPU 등 기술을 활용한 계산능력의 비약적 증대",
      "Deep Blue(1997), Watson(2011), AlphaGo(2016) 등 인간을 넘어서는 성과",
    ],
  },
];

const categoryColors = {
  birth: "bg-indigo-500",
  growth: "bg-emerald-500",
  winter: "bg-gray-500",
  revival: "bg-amber-500",
};

const categoryLabels = {
  birth: "태동",
  growth: "성장",
  winter: "침체",
  revival: "부흥",
};

export default function AIHistoryTimeline() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section>
      <SectionTitle
        title="인공지능의 역사"
        subtitle="다트머스 회의(1956)부터 딥러닝 부흥까지, 인공지능 연구의 흐름을 살펴봅니다"
      />

      {/* Category Legend */}
      <div className="mb-6 flex flex-wrap gap-3">
        {(Object.keys(categoryColors) as Array<keyof typeof categoryColors>).map(
          (cat) => (
            <div key={cat} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className={`h-3 w-3 rounded-full ${categoryColors[cat]}`} />
              {categoryLabels[cat]}
            </div>
          )
        )}
      </div>

      {/* Vertical Timeline */}
      <div className="relative ml-4 border-l-2 border-gray-200 pl-8 dark:border-gray-700">
        {events.map((event) => {
          const isOpen = selected === event.id;
          return (
            <div key={event.id} className="relative mb-8 last:mb-0">
              {/* Dot */}
              <button
                onClick={() => setSelected(isOpen ? null : event.id)}
                className={`absolute -left-[2.55rem] top-0 flex h-6 w-6 items-center justify-center rounded-full ${categoryColors[event.category]} ring-4 ring-white transition-transform hover:scale-110 dark:ring-gray-950`}
              >
                <span className="h-2 w-2 rounded-full bg-white" />
              </button>

              {/* Content */}
              <button
                onClick={() => setSelected(isOpen ? null : event.id)}
                className="w-full text-left"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {event.year}
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {event.title}
                  </h3>
                </div>
                <p className="mt-1 text-sm text-gray-500">{event.summary}</p>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                      <ul className="space-y-2">
                        {event.details.map((d, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                          >
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Expert System Summary */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-bold text-gray-700 dark:text-gray-300">
          전문가 시스템 (Expert System) 구성 요소
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
            <h4 className="font-semibold text-indigo-700 dark:text-indigo-300">
              지식 베이스
            </h4>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              지식을 구조화하여 컴퓨터 내부에 저장
            </p>
          </div>
          <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
            <h4 className="font-semibold text-indigo-700 dark:text-indigo-300">
              추론기관
            </h4>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              지식 베이스의 지식과 외부 사실 정보의 조합방법 탐색
            </p>
          </div>
          <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
            <h4 className="font-semibold text-indigo-700 dark:text-indigo-300">
              지식공학
            </h4>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              지식의 체계화, 축적, 이용을 연구하는 학문
            </p>
          </div>
        </div>
      </div>

      {/* AI Winter Causes Summary */}
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-bold text-red-600 dark:text-red-400">
              AI 겨울의 원인
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-red-400">&#x2022;</span>
                민스키의 XOR 비판 (퍼셉트론의 한계)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-red-400">&#x2022;</span>
                컴퓨터 성능의 한계
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-red-400">&#x2022;</span>
                결과물의 성능·유용성·유연성·경제성 부족
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold text-emerald-600 dark:text-emerald-400">
              부흥의 요인
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-emerald-400">&#x2022;</span>
                딥러닝 모델, 거대 언어 모델(LLM)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-emerald-400">&#x2022;</span>
                웹/SNS를 통한 풍부한 학습 데이터
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-emerald-400">&#x2022;</span>
                GPGPU 등 계산능력의 비약적 증대
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
