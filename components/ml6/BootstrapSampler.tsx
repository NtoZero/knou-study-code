"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Shuffle, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { bootstrapIndices, mulberry32, probNeverPicked } from "./ensembleCore";

const STEPS = [
  {
    no: "①",
    text: "N개의 데이터로 이루어진 학습 데이터 집합 X를 준비하고, 학습을 위한 학습기 모델을 정의. M개의 각 학습기를 학습시키기 위해 사용될 데이터 집합의 크기 Ñ (Ñ ≤ N)을 정함.",
  },
  {
    no: "②",
    text: "i번째 학습기 hᵢ(x) 모델의 파라미터를 초기화하고, 학습 데이터 집합 X로부터 Ñ개의 데이터를 랜덤하게 선출하여 데이터 집합 Xᵢ를 만듦. 이때 같은 데이터가 중복해서 선출되는 것도 허락함(복원 추출).",
  },
  {
    no: "③",
    text: "데이터 집합 Xᵢ를 이용한 학습을 수행하여 최적화된 파라미터 θᵢ를 찾아 i번째 학습기를 위한 판별함수 hᵢ(x, θᵢ)를 얻음.",
  },
  {
    no: "④",
    text: "②~③ 과정을 M번 반복하여 서로 다른 M개의 학습기를 생성하고, 이들을 결합하여 최종 판별함수 f(h₁, h₂, …, h_M)을 찾음.",
  },
];

const N = 10;
const M = 4;
const CHIP_COLORS = [
  "#f59e0b",
  "#0ea5e9",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
  "#ec4899",
  "#84cc16",
  "#6366f1",
  "#f97316",
];

export default function BootstrapSampler() {
  const [step, setStep] = useState(1);
  const [nTilde, setNTilde] = useState(N);
  const [seed, setSeed] = useState(1);

  const samples = useMemo(() => {
    const rand = mulberry32(seed * 7919 + nTilde);
    return Array.from({ length: M }, () => bootstrapIndices(N, nTilde, rand));
  }, [seed, nTilde]);

  const stats = samples.map((idx) => {
    const counts = new Array(N).fill(0);
    idx.forEach((j) => {
      counts[j] += 1;
    });
    return {
      counts,
      unique: counts.filter((c) => c > 0).length,
      dup: counts.filter((c) => c > 1).length,
      never: counts.filter((c) => c === 0).length,
    };
  });

  const sameSets = samples.every(
    (s, i) => i === 0 || [...s].sort().join() === [...samples[0]].sort().join(),
  );
  const expectedNever = N * probNeverPicked(N, nTilde);

  return (
    <section id="bagging" className="scroll-mt-32">
      <SectionTitle
        title="02. 배깅에 의한 학습"
        subtitle="부트스트랩(복원 추출)으로 서로 다른 학습 데이터 집합을 만들어 M개의 학습기를 학습"
      />

      <Sourced
        className="mb-6"
        refs={{
          textbook: "8.2.1 배깅에 의한 학습과 보팅에 의한 결합",
          slides: "배깅에 의한 학습",
          lecture: "배깅은 학습기 선택, 보팅은 결합과 관련된 방법이며, 배깅의 키워드는 리샘플링이라는 점만 기억하면 된다고 짚음",
        }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">배깅 (bagging)</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
              부트스트랩 방법을 앙상블 학습에 적용한 것. <strong>bootstrap aggregating</strong>의
              약자. 학습기의 <strong>선택</strong>과 관련된 방법.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-xs font-bold text-gray-500">부트스트랩 (bootstrap)</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              원래 제한된 데이터 집합을 이용하여 시스템의 학습과 평가를 동시에 수행하기 위해
              제안된 리샘플링 기법.
            </p>
          </div>
        </div>
      </Sourced>

      <Sourced
        className="mb-6"
        refs={{
          textbook: "8.2.1 배깅에 의한 학습 ①~④",
          slides: "배깅에 의한 M개의 서로 다른 학습기의 학습 과정",
        }}
      >
        <h3 className="mb-3 text-base font-bold">배깅에 의한 M개의 서로 다른 학습기의 학습 과정</h3>
        <div className="space-y-2">
          {STEPS.map((s, i) => (
            <button
              key={s.no}
              onClick={() => setStep(i)}
              className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                step === i
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40"
                  : "border-gray-200 bg-white hover:border-amber-300 dark:border-gray-700 dark:bg-gray-900"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  step === i ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                }`}
              >
                {s.no}
              </span>
              <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{s.text}</span>
            </button>
          ))}
        </div>
      </Sourced>

      <Sourced
        className="mb-6"
        refs={{
          textbook: "8.2.1 배깅에 의한 학습 ② 복원추출",
          slides: "배깅에 의한 학습 — 고려사항(데이터 집합의 크기 Ñ)",
          lecture: "Ñ = N으로 두어도 똑같은 데이터가 여러 번 뽑힐 수 있으므로 매 단계 데이터 집합이 달라져 문제가 되지 않는다고 설명함",
        }}
      >
        <h3 className="mb-1 text-base font-bold">부트스트랩 샘플링 시뮬레이터</h3>
        <p className="mb-3 text-sm text-gray-500">
          N = {N}개의 학습 데이터에서 Ñ개씩 복원 추출하여 X₁ ~ X₄를 만듦. 같은 번호가 여러 번
          나올 수 있고, 한 번도 뽑히지 않는 데이터도 생김.
        </p>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <span className="font-semibold">Ñ =</span>
              <input
                type="range"
                min={3}
                max={N}
                value={nTilde}
                onChange={(e) => setNTilde(Number(e.target.value))}
                className="w-32 accent-amber-500"
              />
              <span className="w-6 font-mono font-bold">{nTilde}</span>
            </label>
            <button
              onClick={() => setSeed((s) => s + 1)}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600"
            >
              <Shuffle size={14} />
              다시 추출
            </button>
            <button
              onClick={() => {
                setSeed(1);
                setNTilde(N);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            >
              <RotateCcw size={14} />
              처음으로
            </button>
          </div>

          <div className="mb-3">
            <p className="mb-1 text-xs font-semibold text-gray-500">전체 학습 데이터 집합 X</p>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: N }, (_, j) => (
                <span
                  key={j}
                  className="flex h-7 w-7 items-center justify-center rounded-md font-mono text-xs font-bold text-white"
                  style={{ backgroundColor: CHIP_COLORS[j] }}
                >
                  {j + 1}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {samples.map((idx, i) => (
              <div key={`${seed}-${nTilde}-${i}`} className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800/60">
                <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold">
                    X{String.fromCharCode(8321 + i)} → h{String.fromCharCode(8321 + i)}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    서로 다른 데이터 {stats[i].unique}개 · 중복 선출 {stats[i].dup}개 · 뽑히지 않음{" "}
                    <strong className="text-amber-600">{stats[i].never}개</strong>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {[...idx]
                    .sort((a, b) => a - b)
                    .map((j, k) => (
                      <motion.span
                        key={k}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: k * 0.03 + i * 0.05 }}
                        className="flex h-6 w-6 items-center justify-center rounded font-mono text-[11px] font-bold text-white"
                        style={{ backgroundColor: CHIP_COLORS[j] }}
                      >
                        {j + 1}
                      </motion.span>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <p
              className={`rounded-lg p-3 text-xs leading-relaxed ${
                sameSets
                  ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"
                  : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200"
              }`}
            >
              {sameSets
                ? "네 집합이 모두 같게 나옴 — 드문 경우. 다시 추출해 볼 것."
                : nTilde === N
                  ? "Ñ = N인데도 네 데이터 집합 Xᵢ의 구성이 서로 다름 — 복원 추출이므로 매 단계 생성되는 데이터 집합은 동일하지 않음."
                  : "Ñ < N이면 각 Xᵢ가 전체 데이터의 일부만 담으므로 학습기 사이의 차이가 더 커짐."}
            </p>
            <p className="rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
              계산으로 확인 — 데이터 하나가 Ñ번의 추출에서 한 번도 뽑히지 않을 확률은
              (1 − 1/N)<sup>Ñ</sup> = (1 − 1/{N})<sup>{nTilde}</sup> ={" "}
              {probNeverPicked(N, nTilde).toFixed(3)}. 따라서 한 집합에서 뽑히지 않는 데이터는
              평균 {expectedNever.toFixed(2)}개.
            </p>
          </div>
        </div>
      </Sourced>

      <Sourced
        refs={{
          textbook: "8.2.1 배깅에 의한 학습 — 고려할 사항",
          slides: "배깅에 의한 학습 — 고려사항",
          lecture: "데이터 집합이 달라짐에 따라 다른 성능을 낼 수 있는, 데이터 변화에 민감한 모델을 고르는 것이 바람직하다고 강조함",
        }}
      >
        <h3 className="mb-3 text-base font-bold">배깅에 의한 학습 시 고려사항</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-l-4 border-amber-500 bg-white p-4 shadow-sm dark:bg-gray-900">
            <p className="text-sm font-bold">데이터 집합의 크기 Ñ</p>
            <ul className="mt-2 space-y-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              <li>· 전체 학습 데이터 집합 X의 크기 N이 충분히 크지 않으면 → Ñ = N으로 지정</li>
              <li>· Ñ = N이라도 복원 추출을 사용하므로 매 단계 생성되는 데이터의 집합은 동일하지 않음</li>
            </ul>
          </div>
          <div className="rounded-xl border-l-4 border-amber-500 bg-white p-4 shadow-sm dark:bg-gray-900">
            <p className="text-sm font-bold">학습에 사용될 학습기의 모델</p>
            <ul className="mt-2 space-y-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              <li>· 학습기 간의 차별성을 높이려면, 찾아지는 판별함수가 데이터 집합의 변화에 민감한 모델을 선택하는 것이 바람직</li>
              <li>· 예: K-최근접이웃 분류기, 다층 퍼셉트론</li>
            </ul>
          </div>
        </div>
      </Sourced>
    </section>
  );
}
