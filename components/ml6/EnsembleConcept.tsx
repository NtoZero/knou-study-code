"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Layers, ListOrdered, Minus, Plus } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";

const DIFFERENTIATION = [
  {
    key: "algo",
    title: "학습 알고리즘의 차별화",
    desc: "접근 방법 자체가 서로 다른 학습기를 선택.",
    examples: ["베이즈 분류기 & K-NN 분류기", "신경망 & SVM"],
    learners: ["베이즈", "K-NN", "신경망", "SVM"],
  },
  {
    key: "param",
    title: "모델 선택과 관련된 파라미터의 차별화",
    desc: "같은 알고리즘을 쓰되 모델 선택 파라미터를 달리하여 복수 개의 학습기를 생성.",
    examples: ["K값이 서로 다른 복수 개의 K-NN", "은닉층의 뉴런 수가 서로 다른 복수 개의 신경망"],
    learners: ["K-NN (K=3)", "K-NN (K=10)", "K-NN (K=20)"],
  },
  {
    key: "data",
    title: "학습 데이터의 차별화",
    desc: "같은 모델을 사용하되 학습 데이터 집합을 달리하여 복수 개의 학습기를 생성.",
    examples: ["같은 신경망 모델 + 전체 학습 데이터를 적절히 조합한 서로 다른 학습 데이터 집합"],
    learners: ["모델 h · X₁", "모델 h · X₂", "모델 h · X₃"],
  },
] as const;

const DATA_METHODS = [
  {
    key: "filter",
    title: "필터링(filtering)에 의한 방법",
    methods: "초기 부스팅, 캐스케이딩",
    desc: "각 학습기의 학습 때마다 새로운 데이터를 생성하되, 이를 바로 학습에 적용하기에 앞서 이미 학습이 완료된 학습기에 적용하여 제대로 처리되지 못하는 데이터들만 필터링하여 학습.",
    flow: ["새 데이터 생성", "이미 학습된 학습기에 통과", "제대로 처리 못한 데이터만 남김", "다음 학습기 학습"],
  },
  {
    key: "resample",
    title: "리샘플링(resampling)에 의한 방법",
    methods: "배깅, MadaBoost",
    desc: "학습 데이터를 매번 새로 생성하지 않고, 주어진 전체 학습 데이터로부터 일부 집합을 추출하여 각 학습기를 학습.",
    flow: ["전체 학습 데이터 X", "일부 집합 Xᵢ 추출", "학습기 hᵢ 학습", "M번 반복"],
  },
  {
    key: "reweight",
    title: "가중치 조정(reweighting)에 의한 방법",
    methods: "AdaBoost",
    desc: "모든 학습기에 대해 같은 학습 데이터를 사용하되, 각 데이터에 가중치를 주어 학습에 대한 영향도를 조정.",
    flow: ["같은 학습 데이터 X", "데이터별 가중치 w⁽ⁱ⁾ 부여", "학습기 hᵢ 학습", "가중치 수정 후 반복"],
  },
] as const;

export default function EnsembleConcept() {
  const [m, setM] = useState(4);
  const [mode, setMode] = useState<"parallel" | "sequential">("parallel");
  const [diff, setDiff] = useState(0);
  const [dataMethod, setDataMethod] = useState(1);

  const d = DIFFERENTIATION[diff];
  const dm = DATA_METHODS[dataMethod];

  return (
    <section id="concept" className="scroll-mt-32">
      <SectionTitle
        title="01. 앙상블 학습의 개념"
        subtitle="복수 개의 간단한 학습기를 결합해 더 좋은 성능의 학습기를 만드는 방법"
      />

      {/* 학습기 결합의 필요성 */}
      <Sourced
        className="mb-6"
        refs={{
          textbook: "8.1.1 학습기 결합의 필요성",
        }}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-stretch">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-bold">간단한 분류기</p>
            <p className="mt-1 text-xs text-gray-500">베이즈 분류기, 선형 분류기 등</p>
            <ul className="mt-3 space-y-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              <li>· 구현이 용이하고 활용이 손쉬움</li>
              <li>· 복잡한 문제를 풀기에는 그 표현력에 한계</li>
            </ul>
          </div>
          <div className="flex items-center justify-center text-amber-500">
            <Layers size={22} />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-bold">정교화·대규모화된 학습기</p>
            <p className="mt-1 text-xs text-gray-500">신경망(딥러닝), SVM 등</p>
            <ul className="mt-3 space-y-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              <li>· 학습 대상 파라미터의 수가 많아 학습에 많은 시간 소요</li>
              <li>· 학습을 통해 최적해를 찾기 힘듦</li>
              <li>
                · <strong>과다학습</strong> 문제 동반 — 지나치게 복잡한 모델이 불완전하고 불충분한
                학습 데이터에 과다적합되어 일반화 오차가 증가
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          하나의 학습기만 사용하는 경우 이런 문제가 발생하면 성능 저하를 피할 수 없지만,
          다양한 학습기를 결합해서 사용하면 이러한 위험을 줄일 수 있음.
        </p>
      </Sourced>

      {/* 정의 + 그림 8-1 */}
      <Sourced
        className="mb-6"
        refs={{
          textbook: "8.1.1 학습기 결합의 필요성 — 그림 8-1",
          slides: "앙상블 학습의 개념 — 학습기 결합",
        }}
      >
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/40">
          <p className="text-xs font-bold tracking-wide text-amber-600 dark:text-amber-400">
            앙상블 학습 (ensemble learning)
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
            선형 분류기와 같은 간단한 학습기로 학습을 수행하지만, 복수 개의 간단한 학습기를
            결합함으로써 결과적으로 더 좋은 성능을 가진 학습기를 만드는 방법.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            주어진 문제에 대하여 각각 서로 다른 접근 방법으로 M개의 서로 다른 가설(결과)을
            만들어 내고, 이들의 결과를 적절히 결합하여 최종 결과를 도출.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">학습기 수 M</span>
            <button
              onClick={() => setM((v) => Math.max(2, v - 1))}
              className="rounded-md bg-white p-1 text-gray-600 shadow-sm hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300"
              aria-label="학습기 줄이기"
            >
              <Minus size={12} />
            </button>
            <span className="w-5 text-center font-mono text-sm font-bold">{m}</span>
            <button
              onClick={() => setM((v) => Math.min(6, v + 1))}
              className="rounded-md bg-white p-1 text-gray-600 shadow-sm hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300"
              aria-label="학습기 늘리기"
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="mt-3 overflow-x-auto">
            <div className="flex min-w-[420px] items-center gap-3">
              <div className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-bold shadow-sm dark:bg-gray-900">
                입력 x
              </div>
              <ArrowRight size={16} className="shrink-0 text-amber-500" />
              <div className="flex flex-col gap-1.5">
                <AnimatePresence initial={false}>
                  {Array.from({ length: m }, (_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="rounded-md border border-amber-300 bg-white px-3 py-1 font-mono text-xs dark:border-amber-700 dark:bg-gray-900"
                    >
                      학습기 h{String.fromCharCode(8321 + i)}(x)
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <ArrowRight size={16} className="shrink-0 text-amber-500" />
              <div className="shrink-0 rounded-lg bg-amber-500 px-3 py-2 font-mono text-xs font-bold text-white">
                f(h₁, h₂, …, h
                <sub>{m}</sub>)
              </div>
              <ArrowRight size={16} className="shrink-0 text-amber-500" />
              <div className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-bold shadow-sm dark:bg-gray-900">
                출력 y
              </div>
            </div>
          </div>
        </div>
      </Sourced>

      {/* 고려사항 */}
      <Sourced
        className="mb-6"
        refs={{
          textbook: "8.1.1 학습기 결합의 필요성",
          slides: "학습기 결합 — 고려사항",
        }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-l-4 border-amber-500 bg-white p-4 shadow-sm dark:bg-gray-900">
            <p className="text-sm font-bold">고려사항 ① 어떤 학습기?</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              비교적 간단하면서 서로 차별성이 있는 학습기를 선택함으로써 결합을 통한 효과를
              높여야 함.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-amber-500 bg-white p-4 shadow-sm dark:bg-gray-900">
            <p className="text-sm font-bold">고려사항 ② 어떻게 결합?</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              학습이 완료된 학습기로부터 얻어지는 결과를 각 학습기의 특성을 고려하여 효과적으로
              결합해야 함.
            </p>
          </div>
        </div>
      </Sourced>

      {/* 학습기의 차별화 방법 */}
      <Sourced
        className="mb-6"
        refs={{
          textbook: "8.1.1 학습기 결합의 필요성 — 차별화 방법",
          slides: "학습기 결합에서 고려사항 — 학습기의 차별화 방법",
        }}
      >
        <h3 className="mb-1 text-base font-bold">학습기의 차별화 방법 — 세 가지 수준</h3>
        <p className="mb-3 text-sm text-gray-500">눌러서 각 수준에서 만들어지는 학습기 묶음을 확인.</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {DIFFERENTIATION.map((item, i) => (
            <button
              key={item.key}
              onClick={() => setDiff(i)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                diff === i
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={d.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="text-sm text-gray-700 dark:text-gray-300">{d.desc}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {d.learners.map((l) => (
                <span
                  key={l}
                  className="rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 font-mono text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200"
                >
                  {l}
                </span>
              ))}
            </div>
            <ul className="mt-3 space-y-1 text-xs text-gray-500">
              {d.examples.map((e) => (
                <li key={e}>예) {e}</li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </Sourced>

      <Sourced
        className="mb-6"
        refs={{
          textbook: "8.1.1 학습기 결합의 필요성",
        }}
      >
        <p className="rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
          이 장에서는 <strong>학습 데이터를 달리함으로써</strong> 서로 다른 학습기들을 얻는
          방법을 중심으로 다룸. 학습기에 변화를 주는 가장 간단한 방법이지만, 하나의 학습기만
          사용할 때 얻을 수 없는 성능 향상의 효과를 충분히 얻어 낼 수 있고 그 효과에 대한
          이론적 연구도 충실히 수행되어 있음. 결합 방법을 다양화하면 학습 데이터만 달리한
          학습기들만으로도 다양한 특성을 가진 시스템을 만들어 낼 수 있음. 반면 특정 응용문제에
          특화된 학습기·결합 방법 선택은 공학적으로는 적절하나 이론적 연구의 대상으로 거론되기
          힘듦.
        </p>
      </Sourced>

      {/* 결합 방법 — 병렬 / 순차 */}
      <Sourced
        className="mb-6"
        refs={{
          textbook: "8.1.1 학습기 결합의 필요성 — 결합 방법",
          slides: "학습기 결합에서 고려사항 — 학습기 결합 방법",
        }}
      >
        <h3 className="mb-1 text-base font-bold">학습기 결합 방법 — 병렬적 결합과 순차적 결합</h3>
        <p className="mb-3 text-sm text-gray-500">토글하여 결과가 흘러가는 모양을 비교.</p>
        <div className="mb-3 flex gap-2">
          {(
            [
              ["parallel", "병렬적 결합", Layers],
              ["sequential", "순차적 결합", ListOrdered],
            ] as const
          ).map(([k, label, Icon]) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === k
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="overflow-x-auto">
            <svg viewBox="0 0 460 150" className="w-full min-w-[380px]">
              <defs>
                <marker id="ens-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
                </marker>
              </defs>
              {mode === "parallel" ? (
                <g>
                  <rect x={10} y={60} width={50} height={30} rx={6} fill="#fef3c7" stroke="#f59e0b" />
                  <text x={35} y={79} fontSize="11" textAnchor="middle" fill="#92400e">x</text>
                  {[0, 1, 2].map((i) => (
                    <g key={i}>
                      <motion.line
                        x1={60} y1={75} x2={150} y2={25 + i * 50}
                        stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#ens-arrow)"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <rect x={150} y={10 + i * 50} width={90} height={30} rx={6} fill="#fff" stroke="#f59e0b" />
                      <text x={195} y={29 + i * 50} fontSize="11" textAnchor="middle" fill="#78350f">h{i + 1}(x)</text>
                      <motion.line
                        x1={240} y1={25 + i * 50} x2={330} y2={75}
                        stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#ens-arrow)"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      />
                    </g>
                  ))}
                  <rect x={330} y={57} width={70} height={36} rx={6} fill="#f59e0b" />
                  <text x={365} y={79} fontSize="11" textAnchor="middle" fill="#fff" fontWeight="bold">f(·)</text>
                  <line x1={400} y1={75} x2={440} y2={75} stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#ens-arrow)" />
                  <text x={448} y={79} fontSize="11" fill="#78350f">y</text>
                </g>
              ) : (
                <g>
                  <rect x={10} y={60} width={40} height={30} rx={6} fill="#fef3c7" stroke="#f59e0b" />
                  <text x={30} y={79} fontSize="11" textAnchor="middle" fill="#92400e">x</text>
                  {[0, 1, 2].map((i) => (
                    <g key={i}>
                      <rect x={70 + i * 120} y={60} width={80} height={30} rx={6} fill="#fff" stroke="#f59e0b" />
                      <text x={110 + i * 120} y={79} fontSize="11" textAnchor="middle" fill="#78350f">h{i + 1}(x)</text>
                      <motion.line
                        x1={i === 0 ? 50 : 30 + i * 120} y1={75} x2={70 + i * 120} y2={75}
                        stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#ens-arrow)"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ duration: 0.35, delay: i * 0.45 }}
                      />
                      {i < 2 && (
                        <motion.path
                          d={`M${110 + i * 120},60 C${140 + i * 120},20 ${160 + i * 120},20 ${190 + i * 120},58`}
                          fill="none" stroke="#d97706" strokeDasharray="3 3" markerEnd="url(#ens-arrow)"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4, delay: 0.3 + i * 0.45 }}
                        />
                      )}
                    </g>
                  ))}
                  <text x={170} y={16} fontSize="9" textAnchor="middle" fill="#b45309">앞 단계 결과가 영향</text>
                  <line x1={390} y1={75} x2={440} y2={75} stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#ens-arrow)" />
                  <text x={448} y={79} fontSize="11" fill="#78350f">y</text>
                </g>
              )}
            </svg>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {mode === "parallel"
              ? "병렬적 결합 — 각 학습기로부터 얻어진 결과를 한 번에 모두 함께 고려하여 하나의 최종 결과를 생성."
              : "순차적 결합 — 각 학습기의 결과를 단계별로 나누어 결합. 앞 단계에 배치된 학습기의 결과가 뒤에 배치된 학습기의 학습과 분류에 영향을 미침."}
          </p>
        </div>
      </Sourced>

      {/* 수학적 정의 */}
      <Sourced
        className="mb-6"
        refs={{
          textbook: "8.1.2 앙상블 학습의 개요 — 식 8-1~8-4",
          slides: "앙상블 학습 관련 개념의 수학적 정의 및 표현",
        }}
      >
        <h3 className="mb-3 text-base font-bold">앙상블 학습 관련 개념의 수학적 정의</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            {
              label: "i번째 학습기의 출력 (식 8-1)",
              expr: "hᵢ(x) = h(x, θᵢ)",
              note: "기본 모델은 같고 학습 데이터가 다르므로 파라미터 θᵢ도 달라짐",
            },
            {
              label: "M개 학습기 결합에 의한 최종 결과 (식 8-2)",
              expr: "f_M(x) = f(h₁(x), h₂(x), …, h_M(x))",
              note: "f는 결합 방법을 나타내는 함수",
            },
            {
              label: "학습기 출력과 목표 출력의 오차",
              expr: "e(x) = e(f(x), t) = e(f(x), f*(x))",
              note: "f*(x)는 목표 출력을 제공하는 실제 시스템",
            },
            {
              label: "제곱 오차 함수 (식 8-3)",
              expr: "e²(x, θ) = {f(x; θ) − t}²",
              note: "가장 대표적인 오차함수",
            },
          ].map((f) => (
            <div
              key={f.label}
              className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
            >
              <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">{f.label}</p>
              <p className="mt-2 overflow-x-auto font-mono text-sm">{f.expr}</p>
              <p className="mt-1 text-xs text-gray-500">{f.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
          <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
            가능한 모든 입력 공간에 대한 일반화 오차 (식 8-4)
          </p>
          <p className="mt-2 overflow-x-auto whitespace-nowrap font-mono text-sm">
            E<sub>gen</sub> = E<sub>x</sub>[e(f(x), t)] = ∫ e(f(x), f*(x)) p(x) dx
          </p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            하나의 데이터에 대한 오차를 입력 x의 확률분포 p(x)에 대해 적분한 값, 즉 기대치.
          </p>
        </div>
      </Sourced>

      {/* 학습 데이터 생성 방법 */}
      <Sourced
        className="mb-4"
        refs={{
          textbook: "8.1.2 앙상블 학습의 개요 — 학습 데이터 생성 방법",
          slides: "학습 데이터 생성 방법의 구분",
        }}
      >
        <h3 className="mb-1 text-base font-bold">학습 데이터 생성 방법의 구분</h3>
        <p className="mb-3 text-sm text-gray-500">
          서로 다른 M개의 학습기를 얻기 위해 학습 데이터 집합을 만드는 방식. 눌러서 흐름과
          해당 방법을 확인.
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {DATA_METHODS.map((item, i) => (
            <button
              key={item.key}
              onClick={() => setDataMethod(i)}
              className={`rounded-xl border p-3 text-left transition-colors ${
                dataMethod === i
                  ? "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-950/40"
                  : "border-gray-200 bg-white hover:border-amber-300 dark:border-gray-700 dark:bg-gray-900"
              }`}
            >
              <p className="text-sm font-bold">{item.title}</p>
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">→ {item.methods}</p>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={dm.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{dm.desc}</p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {dm.flow.map((s, i) => (
                <span key={s} className="flex items-center gap-1.5">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.15 }}
                    className="rounded-md bg-amber-100 px-2 py-1 text-xs text-amber-900 dark:bg-amber-900/40 dark:text-amber-100"
                  >
                    {s}
                  </motion.span>
                  {i < dm.flow.length - 1 && <ArrowRight size={12} className="text-amber-500" />}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </Sourced>

      <Sourced
        refs={{
          textbook: "8.1.2 앙상블 학습의 개요",
        }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4 text-xs leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
            <p className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">
              간단한 학습기 (weak learner)
            </p>
            위 결합 방법들은 개별적으로는 성능이 그다지 좋지 못한 간단한 학습기(weak
            learner)들을 결합하여 그 성능을 증폭시켜, 복잡한 학습기로부터 기대할 수 있는 처리
            결과를 얻고자 함. 대표적인 결합 방법이 &lsquo;Boost&rsquo;라는 단어로 명명된 것도
            이에 기인함.
          </div>
          <div className="rounded-xl bg-gray-50 p-4 text-xs leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
            <p className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">MadaBoost</p>
            리샘플링에서 학습이 잘되지 않는 샘플들이 더 자주 선택될 수 있도록 하는 샘플링
            기법을 적용한 방법(Modification of AdaBoost). 가장 단순한 리샘플링 방법은 배깅.
          </div>
        </div>
      </Sourced>
    </section>
  );
}
