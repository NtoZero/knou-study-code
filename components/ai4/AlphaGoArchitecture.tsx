"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

/* -------- Neural Networks -------- */
interface NeuralNet {
  id: string;
  name: string;
  symbol: string;
  training: string;
  role: string;
  color: string;
  bgColor: string;
  details: string[];
}

const neuralNets: NeuralNet[] = [
  {
    id: "sl",
    name: "SL 정책망",
    symbol: "p_sigma",
    training: "프로기사 기보로 분류 학습",
    role: "수의 확률분포 예측",
    color: "border-fuchsia-500",
    bgColor: "bg-fuchsia-50 dark:bg-fuchsia-950",
    details: [
      "지도학습(Supervised Learning)으로 프로기사의 기보 데이터 학습",
      "CNN으로 바둑판 상태 입력 -> 다음 수의 확률분포 출력",
      "분류 문제: 가능한 착점 중 가장 좋은 수 예측",
      "MCTS 확장 단계에서 사전확률 P 부여에 사용",
    ],
  },
  {
    id: "rl",
    name: "RL 정책망",
    symbol: "p_rho",
    training: "자가 대국으로 정책 경사 학습",
    role: "강화학습으로 정책 개선",
    color: "border-cyan-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-950",
    details: [
      "강화학습(Reinforcement Learning)으로 자가 대국(self-play) 수행",
      "SL 정책망을 초기값으로 사용하여 정책 경사(Policy Gradient) 학습",
      "승리를 보상으로 하여 정책을 점진적으로 개선",
      "SL 정책망보다 더 강한 착수 능력",
    ],
  },
  {
    id: "value",
    name: "가치망",
    symbol: "v_theta",
    training: "자가 대국 기보로 회귀 학습",
    role: "현재 상태의 승률 예측",
    color: "border-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
    details: [
      "RL 정책망의 자가 대국 결과로 회귀(Regression) 학습",
      "바둑판 상태 입력 -> 승률(확률값) 출력",
      "MCTS 평가 단계에서 노드의 가치 추정에 사용",
      "롤아웃 없이도 상태 가치를 빠르게 추정 가능",
    ],
  },
  {
    id: "rollout",
    name: "롤아웃 정책",
    symbol: "p_pi",
    training: "빠른 시뮬레이션용",
    role: "경량 정책",
    color: "border-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    details: [
      "SL/RL 정책망보다 훨씬 가벼운 경량 모델",
      "빠른 속도로 게임 종료까지 시뮬레이션(롤아웃) 수행",
      "정확도는 낮지만 속도가 빠름",
      "MCTS 평가 단계에서 가치망과 결합하여 사용",
    ],
  },
];

/* -------- MCTS usage -------- */
interface MCTSUsage {
  phase: string;
  description: string;
  networks: string[];
  color: string;
}

const mctsUsage: MCTSUsage[] = [
  { phase: "선택", description: "Q(수의 가치) + u(P)(탐사 보너스) 최대인 노드 선택", networks: ["RL 정책망"], color: "bg-fuchsia-500" },
  { phase: "확장", description: "SL 정책망으로 사전확률 P 부여", networks: ["SL 정책망"], color: "bg-cyan-500" },
  { phase: "평가", description: "가치망 + 롤아웃 정책 시뮬레이션 결과 결합", networks: ["가치망", "롤아웃 정책"], color: "bg-emerald-500" },
  { phase: "역전파", description: "평가 결과를 경로 상의 노드에 업데이트", networks: [], color: "bg-amber-500" },
];

/* -------- Evolution timeline -------- */
const evolution = [
  { name: "AlphaGo Fan", year: "2015", desc: "유럽 챔피언 5:0 승리. MCTS + 딥러닝 신경망", highlight: true },
  { name: "AlphaGo Lee", year: "2016", desc: "이세돌 9단 4:1 승리", highlight: false },
  { name: "AlphaGo Master", year: "2017", desc: "온라인 대국 60전 전승", highlight: false },
  { name: "AlphaGo Zero", year: "2017", desc: "인간 기보 없이 자가 학습만으로 AlphaGo Master 초월", highlight: false },
  { name: "Alpha Zero", year: "2018", desc: "바둑/체스/장기 범용. 단일 알고리즘으로 모든 게임 마스터", highlight: false },
];

export default function AlphaGoArchitecture() {
  const [expandedNet, setExpandedNet] = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  return (
    <section>
      <SectionTitle
        title="4. AlphaGo와 몬테카를로 트리 탐색"
        subtitle="MCTS를 수행하며 탐색의 각 단계에 신경망을 활용"
      />

      {/* Overview */}
      <div className="mb-6 rounded-lg bg-fuchsia-50 p-4 dark:bg-fuchsia-950">
        <h4 className="text-sm font-bold text-fuchsia-700 dark:text-fuchsia-300">AlphaGo Fan</h4>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
          MCTS를 수행하며, 탐색의 각 단계에 <strong>신경망</strong>을 활용.
          바둑판의 돌 배치를 <strong>19x19 영상 형태</strong>로 전달하여 <strong>CNN</strong>으로 학습/분류/회귀.
        </p>
        <div className="mt-2 flex gap-4 text-xs text-gray-600 dark:text-gray-400">
          <span><strong>가치망:</strong> 착점의 가치 평가</span>
          <span><strong>정책망:</strong> 착점 샘플링, 탐색 방향 결정</span>
        </div>
      </div>

      {/* 4 Neural Network cards */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-bold">신경망 학습 구조</h3>
        <div className="space-y-3">
          {neuralNets.map((nn) => {
            const isOpen = expandedNet === nn.id;
            return (
              <motion.div key={nn.id} layout>
                <button
                  onClick={() => setExpandedNet(isOpen ? null : nn.id)}
                  className={`w-full rounded-xl border-l-4 ${nn.color} bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md dark:bg-gray-900`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-gray-500">{nn.symbol}</span>
                      <div>
                        <h4 className="text-sm font-bold">{nn.name}</h4>
                        <p className="text-xs text-gray-500">{nn.training} | {nn.role}</p>
                      </div>
                    </div>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-gray-400 text-sm">
                      &#9660;
                    </motion.span>
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`rounded-b-xl border border-t-0 border-gray-200 p-4 dark:border-gray-700 ${nn.bgColor}`}>
                        <ul className="space-y-1">
                          {nn.details.map((d, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <span className="mt-0.5 text-fuchsia-400">&#x2022;</span>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* MCTS usage relationship */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-bold">MCTS에서의 신경망 활용</h3>
        <p className="mb-3 text-xs text-gray-500">각 단계를 클릭하여 사용되는 신경망을 확인하세요.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {mctsUsage.map((u, i) => (
            <button
              key={u.phase}
              onClick={() => setSelectedPhase(selectedPhase === i ? null : i)}
              className={`rounded-lg border p-3 text-left transition-all ${
                selectedPhase === i
                  ? "border-fuchsia-400 bg-fuchsia-50 shadow-md dark:bg-fuchsia-950"
                  : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`inline-flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold text-white ${u.color}`}>
                  {i + 1}
                </span>
                <span className="text-sm font-bold">{u.phase}</span>
              </div>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{u.description}</p>
              <AnimatePresence>
                {selectedPhase === i && u.networks.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 flex flex-wrap gap-1"
                  >
                    {u.networks.map((n) => (
                      <span key={n} className="rounded-full bg-fuchsia-100 px-2 py-0.5 text-[10px] font-bold text-fuchsia-700 dark:bg-fuchsia-900 dark:text-fuchsia-300">
                        {n}
                      </span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </div>

      {/* Evolution timeline */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-bold">AlphaGo 진화 타임라인</h3>
        <div className="relative ml-4 border-l-2 border-fuchsia-200 pl-6 dark:border-fuchsia-800">
          {evolution.map((e, i) => (
            <motion.div
              key={e.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative mb-5 last:mb-0"
            >
              <div className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 ${
                e.highlight
                  ? "border-fuchsia-500 bg-fuchsia-500"
                  : "border-fuchsia-300 bg-white dark:bg-gray-900"
              }`} />
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-bold text-fuchsia-500">{e.year}</span>
                <span className="text-sm font-bold">{e.name}</span>
              </div>
              <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{e.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
