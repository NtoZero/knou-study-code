"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

interface Battle {
  id: number;
  name: string;
  year: string;
  opponent: string;
  result: string;
  resultWinner: string;
  domain: string;
  icon: string;
  color: string;
  bgColor: string;
  keyTech: string[];
  details: string[];
}

const battles: Battle[] = [
  {
    id: 1,
    name: "Deep Blue",
    year: "1996-1997",
    opponent: "가리 카스파로프 (세계 체스 챔피언)",
    result: "1996: 카스파로프 승 (3승 2무 1패) | 1997: 딥 블루 승 (2승 3무 1패)",
    resultWinner: "1997년 딥 블루 최종 승리",
    domain: "서양장기 (Chess)",
    icon: "♟️",
    color: "border-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    keyTech: [
      "IBM RS/6000 SP 병렬 슈퍼컴퓨터",
      "체스 전용 보조프로세서 장착",
      "초당 2억 개의 행마 검토 가능",
    ],
    details: [
      "1996년 1차 대결에서는 카스파로프가 3승 2무 1패로 승리",
      "1997년 2차 대결에서는 딥 블루가 2승 3무 1패로 승리하며 역사적 순간을 만듦",
      "컴퓨터가 세계 챔피언을 이긴 최초의 사례",
    ],
  },
  {
    id: 2,
    name: "IBM Watson",
    year: "2011",
    opponent: "제퍼디 퀴즈 달인 2명 (Brad Rutter, Ken Jennings)",
    result: "Watson 압도적 승리",
    resultWinner: "Watson 승리",
    domain: "퀴즈 (Jeopardy!)",
    icon: "🧠",
    color: "border-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    keyTech: [
      "DeepQA: 100가지가 넘는 기술 통합",
      "자연어 처리, 가설 설정, 증거 점수 매김",
      "가설 병합 및 순위 결정",
      "총 2,880개의 POWER7 프로세서 스레드",
      "대단위 병렬 처리",
    ],
    details: [
      "자연어로 된 퀴즈 질문을 이해하고 답을 도출",
      "100가지 이상의 기술을 조합한 DeepQA 아키텍처",
      "단순 검색이 아닌 가설 생성 및 증거 기반 추론 수행",
    ],
  },
  {
    id: 3,
    name: "AlphaGo",
    year: "2016",
    opponent: "이세돌 9단 (세계 바둑 최정상급)",
    result: "AlphaGo 승 (4승 1패)",
    resultWinner: "AlphaGo 승리",
    domain: "바둑 (Go)",
    icon: "⚫",
    color: "border-violet-500",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
    keyTech: [
      "Monte-Carlo 트리 탐색 + 딥러닝 기반 머신러닝",
      "다른 바둑 프로그램 대비 99.8% 승률",
      "유럽 바둑 챔피언을 5:0으로 승리",
    ],
    details: [
      "단일 버전: 48개 CPU + 4~8개 GPU",
      "분산 버전: 1,202~1,920개 CPU + 176~280개 GPU",
      "바둑의 경우의 수(10^170)는 체스(10^120)를 압도적으로 초과",
      "기존 탐색 방식으로는 불가능한 문제를 딥러닝으로 해결",
    ],
  },
];

export default function HumanVsAI() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section>
      <SectionTitle
        title="인간과 컴퓨터의 대결"
        subtitle="인공지능이 인간 전문가를 상대로 승리한 역사적 대결들"
      />

      <div className="space-y-4">
        {battles.map((battle) => {
          const isOpen = expanded === battle.id;
          return (
            <motion.div key={battle.id} layout>
              <button
                onClick={() => setExpanded(isOpen ? null : battle.id)}
                className={`w-full rounded-xl border-l-4 ${battle.color} bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md dark:bg-gray-900`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{battle.icon}</span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {battle.name}
                        </h3>
                        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                          {battle.year}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {battle.domain} | {battle.opponent}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        {battle.resultWinner}
                      </p>
                    </div>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="mt-1 text-gray-400"
                  >
                    ▼
                  </motion.span>
                </div>
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
                    <div className={`rounded-b-xl border border-t-0 border-gray-200 p-5 dark:border-gray-700 ${battle.bgColor}`}>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* 대결 결과 */}
                        <div>
                          <h4 className="mb-2 text-xs font-bold uppercase text-gray-500">
                            대결 결과
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {battle.result}
                          </p>
                        </div>

                        {/* 핵심 기술 */}
                        <div>
                          <h4 className="mb-2 text-xs font-bold uppercase text-gray-500">
                            핵심 기술
                          </h4>
                          <ul className="space-y-1">
                            {battle.keyTech.map((tech, i) => (
                              <li
                                key={i}
                                className="text-sm text-gray-700 dark:text-gray-300"
                              >
                                <span className="mr-1 text-indigo-500">&#x2022;</span>
                                {tech}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* 상세 정보 */}
                      <div className="mt-4">
                        <h4 className="mb-2 text-xs font-bold uppercase text-gray-500">
                          상세 정보
                        </h4>
                        <ul className="space-y-1">
                          {battle.details.map((detail, i) => (
                            <li
                              key={i}
                              className="text-sm text-gray-600 dark:text-gray-400"
                            >
                              <span className="mr-1 text-gray-400">-</span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
