"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { ChevronRight, ChevronLeft, RotateCcw } from "lucide-react";

/* ---------- 공통 소도구 ---------- */

function Frac({ top, bottom }: { top: string; bottom: string }) {
  return (
    <span className="mx-1 inline-flex flex-col items-center align-middle text-[0.95em] leading-tight">
      <span className="border-b border-current px-1.5 pb-0.5">{top}</span>
      <span className="px-1.5 pt-0.5">{bottom}</span>
    </span>
  );
}

/* ---------- 개념 흐름도 데이터 ---------- */

const conceptColumns = [
  {
    title: "모집단 p(x)",
    phase: "학습",
    rows: ["C₁", "C₂", "⋮", "Cₘ"],
    note: "전체 데이터가 생성되는 분포",
  },
  {
    title: "클래스별 데이터 집합",
    phase: "학습",
    rows: ["C₁의 데이터", "C₂의 데이터", "⋮", "Cₘ의 데이터"],
    note: "클래스별로 나누어 모은 학습 데이터",
  },
  {
    title: "클래스별 확률밀도",
    phase: "학습",
    rows: ["p(x|C₁)", "p(x|C₂)", "⋮", "p(x|Cₘ)"],
    note: "각 클래스의 확률밀도함수를 추정",
  },
  {
    title: "사후(후험)확률",
    phase: "분류",
    rows: ["P(C₁|x_new)", "P(C₂|x_new)", "⋮", "P(Cₘ|x_new)"],
    note: "베이즈 정리로 x_new에 대해 계산",
  },
  {
    title: "분류 결과 y(x_new)",
    phase: "분류",
    rows: ["argmaxᵢ P(Cᵢ|x_new)"],
    note: "사후확률이 가장 큰 클래스로 할당",
  },
];

/* ---------- 우도비 검정 유도 단계 ---------- */

type LrtStep = {
  label: string;
  note: string;
  render: () => React.ReactNode;
};

const lrtSteps: LrtStep[] = [
  {
    label: "① 판별함수를 베이즈 정리로 전개",
    note: "사후확률 P(Cₖ|x)를 p(x|Cₖ)p(Cₖ)/p(x)로 바꾸어 쓴 뒤 결정경계 조건 g(x) = 0을 세움.",
    render: () => (
      <span>
        g(x) = <Frac top="p(x|C₁)p(C₁)" bottom="p(x)" /> &minus;{" "}
        <Frac top="p(x|C₂)p(C₂)" bottom="p(x)" /> = 0
      </span>
    ),
  },
  {
    label: "② 분모 제거",
    note: "두 항의 분모가 모두 p(x)로 같으므로 양변에 p(x)를 곱해 없앨 수 있음.",
    render: () => (
      <span>p(x|C₁)p(C₁) &minus; p(x|C₂)p(C₂) = 0</span>
    ),
  },
  {
    label: "③ 각 항을 p(x|C₂)p(C₁)로 나눔",
    note: "우도와 사전확률을 각각 비(ratio) 형태로 묶기 위해 공통 항으로 나눔.",
    render: () => (
      <span>
        <Frac top="p(x|C₁)p(C₁)" bottom="p(x|C₂)p(C₁)" /> &minus;{" "}
        <Frac top="p(x|C₂)p(C₂)" bottom="p(x|C₂)p(C₁)" /> = 0
      </span>
    ),
  },
  {
    label: "④ 우도비 검정(Likelihood Ratio Test) 형태",
    note: "정리하면 우도비와 사전확률 비율의 비교식이 됨. 이것이 베이즈 정리로부터 유도된 결정경계이며, 이를 이용한 분류를 ‘우도비 분류’라고 부름.",
    render: () => (
      <span>
        g_LRT(x) = <Frac top="p(x|C₁)" bottom="p(x|C₂)" /> &minus;{" "}
        <Frac top="p(C₂)" bottom="p(C₁)" /> = 0
      </span>
    ),
  },
];

/* ---------- 베이즈 분류기 처리과정 ---------- */

const procedure = [
  { title: "학습 데이터 수집", desc: "입력과 클래스 레이블의 쌍으로 이루어진 학습 데이터를 모음." },
  {
    title: "클래스별 분포함수 p(x|Cₖ) 추정",
    desc: "학습 데이터로부터 각 클래스의 확률밀도함수를 추정.",
  },
  { title: "테스트 데이터 x_new 입력", desc: "분류할 새 데이터를 분류기에 넣음." },
  {
    title: "클래스별 판별함수 값 계산",
    desc: "gₖ(x_new) = p(x|Cₖ)p(Cₖ) 를 모든 클래스에 대해 계산.",
  },
  {
    title: "값이 가장 큰 클래스 k로 할당",
    desc: "gₖ(x_new)가 가장 큰 클래스 k에 대해 x_new ∈ Cₖ 로 결정.",
  },
];

export default function BayesTheoremLab() {
  const [priorC1, setPriorC1] = useState(0.5);
  const [likeC1, setLikeC1] = useState(0.6);
  const [likeC2, setLikeC2] = useState(0.3);
  const [lrtStep, setLrtStep] = useState(0);
  const [procStep, setProcStep] = useState(0);

  const bayes = useMemo(() => {
    const priorC2 = 1 - priorC1;
    const jointC1 = likeC1 * priorC1;
    const jointC2 = likeC2 * priorC2;
    const evidence = jointC1 + jointC2;
    const postC1 = evidence > 0 ? jointC1 / evidence : 0.5;
    const postC2 = evidence > 0 ? jointC2 / evidence : 0.5;
    return {
      priorC2,
      jointC1,
      jointC2,
      evidence,
      postC1,
      postC2,
      g: postC1 - postC2,
      winner: postC1 >= postC2 ? "C₁" : "C₂",
    };
  }, [priorC1, likeC1, likeC2]);

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

  return (
    <section>
      <SectionTitle
        title="베이즈 분류기 &mdash; 확률에 기반한 분류"
        subtitle="사전확률에서 사후확률로, 그리고 우도비 검정까지"
      />

      {/* 개념 흐름도 */}
      <h3 className="mb-2 text-base font-bold">확률에 기반한 분류기의 개념</h3>
      <div className="mb-3 rounded-lg bg-violet-50 p-3 text-center font-mono text-sm dark:bg-violet-950">
        x_new &rarr; argmaxᵢ P(Cᵢ|x_new) &rarr; x_new ∈ Cᵢ
      </div>
      <div className="mb-8 overflow-x-auto">
        <div className="flex min-w-[640px] items-stretch gap-2">
          {conceptColumns.map((col, i) => (
            <div key={col.title} className="flex flex-1 items-center gap-2">
              <div
                className={`flex-1 rounded-xl border p-3 ${
                  col.phase === "학습"
                    ? "border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950"
                    : "border-fuchsia-200 bg-fuchsia-50 dark:border-fuchsia-800 dark:bg-fuchsia-950"
                }`}
              >
                <p className="text-[10px] font-bold uppercase text-gray-400">{col.phase}</p>
                <p className="mt-0.5 text-xs font-bold">{col.title}</p>
                <div className="mt-2 space-y-1">
                  {col.rows.map((r) => (
                    <p key={r} className="font-mono text-[11px] text-gray-600 dark:text-gray-400">
                      {r}
                    </p>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-gray-400">{col.note}</p>
              </div>
              {i < conceptColumns.length - 1 && (
                <ChevronRight size={16} className="shrink-0 text-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
      <p className="mb-8 text-xs text-gray-500">
        클래스별 확률밀도에서 사후확률로 넘어가는 단계에 <span className="font-medium text-violet-600 dark:text-violet-400">베이즈 정리</span>가 사용되며, 이때 새 데이터 x_new가 입력됨.
      </p>

      {/* 판별함수 + 베이즈 정리 계산기 */}
      <h3 className="mb-2 text-base font-bold">베이즈 정리 계산기</h3>
      <p className="mb-4 text-sm text-gray-500">
        이진 분류에서는 x가 각 클래스에 속할 확률 P(C₁|x)과 P(C₂|x) 중 확률값이 큰 클래스로 할당.
      </p>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
          <p className="text-xs font-medium text-gray-500">판별함수</p>
          <p className="mt-2 font-mono text-sm">g(x) = P(C₁|x) &minus; P(C₂|x)</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
          <p className="text-xs font-medium text-gray-500">
            베이즈 정리 &mdash; 사전확률로부터 사후확률을 계산하는 식
          </p>
          <p className="mt-2 flex items-center font-mono text-sm">
            P(Cₖ|x) = <Frac top="p(x|Cₖ)p(Cₖ)" bottom="p(x)" />
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-violet-200 bg-white p-4 dark:border-violet-800 dark:bg-gray-900">
        <div className="grid gap-5 md:grid-cols-2">
          {/* 슬라이더 */}
          <div className="space-y-4">
            <div>
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-medium">
                  사전확률 p(C₁)
                  <span className="ml-1 text-[11px] text-gray-400">선험 prior</span>
                </label>
                <span className="font-mono text-sm text-violet-600 dark:text-violet-400">
                  {priorC1.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0.05}
                max={0.95}
                step={0.01}
                value={priorC1}
                onChange={(e) => setPriorC1(Number(e.target.value))}
                className="mt-2 w-full accent-violet-500"
              />
              <p className="mt-1 text-[11px] text-gray-400">
                p(C₂) = 1 &minus; p(C₁) = {bayes.priorC2.toFixed(2)}
              </p>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-medium">
                  우도 p(x|C₁)
                  <span className="ml-1 text-[11px] text-gray-400">likelihood</span>
                </label>
                <span className="font-mono text-sm text-violet-600 dark:text-violet-400">
                  {likeC1.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0.01}
                max={1}
                step={0.01}
                value={likeC1}
                onChange={(e) => setLikeC1(Number(e.target.value))}
                className="mt-2 w-full accent-violet-500"
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-medium">우도 p(x|C₂)</label>
                <span className="font-mono text-sm text-fuchsia-600 dark:text-fuchsia-400">
                  {likeC2.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0.01}
                max={1}
                step={0.01}
                value={likeC2}
                onChange={(e) => setLikeC2(Number(e.target.value))}
                className="mt-2 w-full accent-fuchsia-500"
              />
            </div>

            <div className="rounded-lg bg-gray-50 p-3 text-[11px] text-gray-500 dark:bg-gray-800">
              <p className="font-mono">
                p(x) = p(x|C₁)p(C₁) + p(x|C₂)p(C₂) = {bayes.evidence.toFixed(3)}
              </p>
              <p className="mt-1 font-mono">
                p(x|C₁)p(C₁) = {bayes.jointC1.toFixed(3)} / p(x|C₂)p(C₂) ={" "}
                {bayes.jointC2.toFixed(3)}
              </p>
            </div>
          </div>

          {/* 결과 */}
          <div>
            <p className="text-sm font-medium">
              사후확률 <span className="text-[11px] text-gray-400">후험 posterior</span>
            </p>
            <div className="mt-3 space-y-3">
              <div>
                <div className="flex justify-between text-xs">
                  <span className="font-mono">P(C₁|x)</span>
                  <span className="font-mono font-bold text-violet-600 dark:text-violet-400">
                    {bayes.postC1.toFixed(3)}
                  </span>
                </div>
                <div className="mt-1 h-5 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                  <motion.div
                    className="h-full rounded bg-violet-500"
                    animate={{ width: pct(bayes.postC1) }}
                    transition={{ duration: 0.25 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs">
                  <span className="font-mono">P(C₂|x)</span>
                  <span className="font-mono font-bold text-fuchsia-600 dark:text-fuchsia-400">
                    {bayes.postC2.toFixed(3)}
                  </span>
                </div>
                <div className="mt-1 h-5 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                  <motion.div
                    className="h-full rounded bg-fuchsia-500"
                    animate={{ width: pct(bayes.postC2) }}
                    transition={{ duration: 0.25 }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <p className="font-mono text-xs text-gray-500">
                g(x) = P(C₁|x) &minus; P(C₂|x) = {bayes.g.toFixed(3)}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500">분류 결과</span>
                <motion.span
                  key={bayes.winner}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`rounded-full px-3 py-1 text-sm font-bold text-white ${
                    bayes.winner === "C₁" ? "bg-violet-500" : "bg-fuchsia-500"
                  }`}
                >
                  x ∈ {bayes.winner}
                </motion.span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 우도비 검정 유도 */}
      <h3 className="mb-2 text-base font-bold">우도비 검정(Likelihood Ratio Test) 유도</h3>
      <p className="mb-4 text-sm text-gray-500">
        결정경계 g(x) = 0 에서 출발해 한 줄씩 전개.
      </p>

      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => setLrtStep(0)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          title="처음으로"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={() => setLrtStep((s) => Math.max(0, s - 1))}
          disabled={lrtStep === 0}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
          title="이전 단계"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => setLrtStep((s) => Math.min(lrtSteps.length - 1, s + 1))}
          disabled={lrtStep === lrtSteps.length - 1}
          className="rounded-lg bg-violet-500 px-3 py-2 text-xs font-medium text-white hover:bg-violet-600 disabled:opacity-30"
        >
          다음 단계
        </button>
        <span className="text-xs text-gray-400">
          {lrtStep + 1} / {lrtSteps.length}
        </span>
      </div>

      <div className="mb-4 space-y-2">
        {lrtSteps.slice(0, lrtStep + 1).map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border p-4 ${
              i === lrtStep
                ? "border-violet-300 bg-violet-50 dark:border-violet-700 dark:bg-violet-950"
                : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            }`}
          >
            <p className="text-xs font-bold text-violet-600 dark:text-violet-400">{s.label}</p>
            <div className="mt-2 overflow-x-auto font-mono text-sm">{s.render()}</div>
            <p className="mt-2 text-xs text-gray-500">{s.note}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lrtStep === lrtSteps.length - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 grid gap-3 sm:grid-cols-2"
          >
            <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 dark:border-violet-800 dark:bg-violet-950">
              <p className="text-xs font-bold text-violet-700 dark:text-violet-300">
                우도비 likelihood ratio
              </p>
              <p className="mt-1 font-mono text-sm">p(x|C₁) / p(x|C₂)</p>
              <p className="mt-1 text-[11px] text-gray-500">
                각 클래스에서 x가 관찰될 확률밀도의 비율
              </p>
            </div>
            <div className="rounded-xl border border-fuchsia-200 bg-fuchsia-50 p-3 dark:border-fuchsia-800 dark:bg-fuchsia-950">
              <p className="text-xs font-bold text-fuchsia-700 dark:text-fuchsia-300">
                사전확률의 비율
              </p>
              <p className="mt-1 font-mono text-sm">p(C₂) / p(C₁)</p>
              <p className="mt-1 text-[11px] text-gray-500">
                전체 데이터 집합에서 각 클래스가 차지하는 비율
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 결정규칙 */}
      <h3 className="mb-2 text-base font-bold">결정규칙</h3>
      <div className="mb-8 grid gap-3 md:grid-cols-2">
        <div className="space-y-2 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
          <p className="font-mono text-xs">
            g_LRT(x) = p(x|C₁)p(C₁) &minus; p(x|C₂)p(C₂) &gt; 0 &rarr;{" "}
            <span className="font-bold text-violet-600 dark:text-violet-400">x ∈ C₁</span>
          </p>
          <p className="font-mono text-xs">
            g_LRT(x) = p(x|C₁)p(C₁) &minus; p(x|C₂)p(C₂) &lt; 0 &rarr;{" "}
            <span className="font-bold text-fuchsia-600 dark:text-fuchsia-400">x ∈ C₂</span>
          </p>
          <div className="mt-3 rounded-lg bg-gray-50 p-3 font-mono text-xs dark:bg-gray-800">
            y(x) = 1 if g_LRT(x) &gt; 0, &minus;1 otherwise
          </div>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950">
          <p className="text-xs font-bold text-violet-700 dark:text-violet-300">
            p(C₁) = p(C₂) 인 경우
          </p>
          <div className="mt-3 rounded-lg bg-white p-3 font-mono text-xs dark:bg-gray-900">
            y(x) = 1 if p(x|C₁) &minus; p(x|C₂) &gt; 0, &minus;1 otherwise
          </div>
          <p className="mt-2 text-[11px] text-gray-500">
            사전확률이 같으면 사전확률 항이 상쇄되어 두 확률밀도의 크기 비교만 남음.
          </p>
        </div>
      </div>

      {/* 처리과정 5단계 */}
      <h3 className="mb-2 text-base font-bold">베이즈 분류기의 처리 과정</h3>
      <div className="mb-4 flex flex-wrap gap-2">
        {procedure.map((p, i) => (
          <button
            key={p.title}
            onClick={() => setProcStep(i)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              procStep === i
                ? "bg-violet-500 text-white"
                : procStep > i
                  ? "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {i + 1}. {p.title}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={procStep}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.18 }}
          className="rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950"
        >
          <p className="text-sm font-bold">
            {procStep + 1}. {procedure[procStep].title}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {procedure[procStep].desc}
          </p>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
