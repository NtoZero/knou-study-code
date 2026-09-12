"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import StepControls from "@/components/common/StepControls";
import { CheckCircle2, Shuffle, XCircle } from "lucide-react";

type Step = {
  title: string;
  formula: string;
  why: string;
};

const STEPS: Step[] = [
  {
    title: "오차함수를 세운다",
    formula: "E(w₁, w₀) = Σᵢ₌₁ᴺ eᵢ² = Σᵢ₌₁ᴺ ( yᵢ − (w₁xᵢ + w₀) )²",
    why: "잔차의 제곱의 합을 오차함수로 삼는다. 매개변수는 w₁, w₀ 두 개뿐이다.",
  },
  {
    title: "최솟값의 조건을 떠올린다",
    formula: "∂E / ∂w₀ = 0,  ∂E / ∂w₁ = 0",
    why: "E는 w₁, w₀에 대한 2차 함수다. 2차 함수의 최솟값은 미분하여 0이 되는 점에서 찾는 것과 같은 원리로, 각 매개변수에 대해 편미분을 수행해 0이 되는 점을 찾는다.",
  },
  {
    title: "w₀에 대해 편미분한다",
    formula: "∂E(w₁, w₀) / ∂w₀ = −2 Σᵢ₌₁ᴺ ( yᵢ − (w₁xᵢ + w₀) ) = 0",
    why: "제곱항을 미분하면서 내려온 계수 −2가 앞에 붙는다. w₀에 대한 미분이므로 안쪽 항의 미분값은 −1이다.",
  },
  {
    title: "w₁에 대해 편미분한다",
    formula: "∂E(w₁, w₀) / ∂w₁ = −2 Σᵢ₌₁ᴺ ( yᵢ − (w₁xᵢ + w₀) ) xᵢ = 0",
    why: "w₁에 대한 미분이므로 안쪽 항의 미분값이 −xᵢ가 되어 xᵢ가 곱해진 형태로 남는다.",
  },
  {
    title: "첫 번째 식을 정리한다",
    formula: "Σyᵢ − Σw₀ − Σw₁xᵢ = 0  ⇒  w₀N + w₁Σxᵢ = Σyᵢ",
    why: "−2는 0으로 나눠 없앨 수 있다. w₀는 i에 무관한 상수이므로 N번 더해져 w₀N이 된다.",
  },
  {
    title: "두 번째 식을 정리한다",
    formula: "Σyᵢxᵢ − Σw₀xᵢ − Σw₁xᵢ² = 0  ⇒  w₀Σxᵢ + w₁Σxᵢ² = Σyᵢxᵢ",
    why: "같은 방식으로 정리하면 w₁, w₀에 대한 2원 1차 연립방정식 두 번째 식을 얻는다.",
  },
  {
    title: "첫 식을 N으로 나눠 w₀를 얻는다",
    formula: "w₀ = ȳ − w₁x̄   ( x̄ = (1/N)Σxᵢ,  ȳ = (1/N)Σyᵢ )",
    why: "w₀N + w₁Σxᵢ = Σyᵢ 의 양변을 N으로 나누면 평균 x̄, ȳ가 그대로 나타난다. w₀를 계산하려면 w₁을 먼저 알아야 한다.",
  },
  {
    title: "두 번째 식에 대입해 w₁을 얻는다",
    formula: "w₁ = ( N Σyᵢxᵢ − Σxᵢ · Σyᵢ ) / ( N Σxᵢ² − (Σxᵢ)² )",
    why: "w₀ = ȳ − w₁x̄ 를 w₀Σxᵢ + w₁Σxᵢ² = Σyᵢxᵢ 에 대입하면 w₀가 사라지고 w₁만 남는다. 결국 w₁, w₀는 주어진 데이터만으로 반복 없이 바로 계산되는 값이다.",
  },
];

/* ------------------------- 순서 맞추기 드릴 ------------------------- */

type DrillItem = { id: number; text: string };

/** 정답 순서: id 0 → 5 */
const DRILL_ITEMS: DrillItem[] = [
  { id: 0, text: "오차함수 E(w₁, w₀) = Σ(yᵢ − (w₁xᵢ + w₀))² 를 세운다" },
  { id: 1, text: "오차함수를 각 매개변수에 대해 편미분하여 0이 되는 점을 찾는다" },
  { id: 2, text: "∂E/∂w₀ = −2Σ(yᵢ − (w₁xᵢ + w₀)) = 0 을 구한다" },
  { id: 3, text: "w₁, w₀에 대한 연립방정식 w₀N + w₁Σxᵢ = Σyᵢ 형태로 정리한다" },
  { id: 4, text: "첫 식을 N으로 나누어 w₀ = ȳ − w₁x̄ 를 얻는다" },
  { id: 5, text: "두 번째 식에 대입하여 w₁ 공식을 얻는다" },
];

/** SSR 안정성을 위해 초기 배치는 고정 순서 */
const INITIAL_SCRAMBLE = [4, 0, 3, 5, 1, 2];

export default function LeastSquaresDerivation() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const [pool, setPool] = useState<number[]>(INITIAL_SCRAMBLE);
  const [picked, setPicked] = useState<number[]>([]);
  const [graded, setGraded] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= STEPS.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 2200);
    return () => clearInterval(t);
  }, [playing]);

  const pick = (id: number) => {
    if (graded) return;
    setPicked((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const unpick = (id: number) => {
    if (graded) return;
    setPicked((prev) => prev.filter((v) => v !== id));
  };

  const reshuffle = () => {
    const next = [...DRILL_ITEMS.map((d) => d.id)];
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    setPool(next);
    setPicked([]);
    setGraded(false);
  };

  const allPicked = picked.length === DRILL_ITEMS.length;
  const correctCount = picked.filter((id, i) => id === i).length;

  return (
    <section>
      <SectionTitle
        title="04. 최적의 매개변수 계산 과정"
        subtitle="편미분으로 최적 매개변수 공식을 유도하는 여덟 단계"
      />

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">유도 과정 한 단계씩 보기</h3>
          <StepControls
            step={step}
            totalSteps={STEPS.length}
            playing={playing}
            onPlay={() => {
              if (step >= STEPS.length - 1) setStep(0);
              setPlaying(true);
            }}
            onStop={() => setPlaying(false)}
            onReset={() => {
              setPlaying(false);
              setStep(0);
            }}
            onNext={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            onPrev={() => setStep((s) => Math.max(0, s - 1))}
          />
        </div>

        <div className="space-y-2">
          {STEPS.map((s, i) => {
            const revealed = i <= step;
            const active = i === step;
            return (
              <motion.div
                key={s.title}
                animate={{ opacity: revealed ? 1 : 0.25 }}
                transition={{ duration: 0.25 }}
                className={`rounded-lg border p-3 transition-colors ${
                  active
                    ? "border-orange-400 bg-orange-50 dark:border-orange-600 dark:bg-orange-950"
                    : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      active
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{s.title}</p>
                    <div className="mt-1.5 overflow-x-auto">
                      <p className="min-w-max font-mono text-sm text-gray-900 dark:text-gray-100">
                        {revealed ? s.formula : "· · ·"}
                      </p>
                    </div>
                    <AnimatePresence>
                      {active && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2 overflow-hidden text-xs text-gray-600 dark:text-gray-300"
                        >
                          <span className="font-semibold text-orange-600 dark:text-orange-300">왜 이렇게 하는가 — </span>
                          {s.why}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 순서 맞추기 드릴 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">순서 맞추기 드릴</h3>
          <button
            onClick={reshuffle}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Shuffle size={13} /> 다시 섞기
          </button>
        </div>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          아래 조각을 유도 순서대로 눌러 배열. 선택한 조각을 다시 누르면 취소됨.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">선택 가능한 조각</p>
            <div className="space-y-2">
              {pool
                .filter((id) => !picked.includes(id))
                .map((id) => (
                  <button
                    key={id}
                    onClick={() => pick(id)}
                    disabled={graded}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs text-gray-700 transition-colors hover:bg-orange-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-orange-900/20"
                  >
                    {DRILL_ITEMS[id].text}
                  </button>
                ))}
              {picked.length === DRILL_ITEMS.length && (
                <p className="rounded-lg border border-dashed border-gray-200 px-3 py-4 text-center text-xs text-gray-400 dark:border-gray-700">
                  모든 조각을 배치함
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">내가 배열한 순서</p>
            <div className="space-y-2">
              {picked.length === 0 && (
                <p className="rounded-lg border border-dashed border-gray-200 px-3 py-4 text-center text-xs text-gray-400 dark:border-gray-700">
                  왼쪽에서 조각을 선택
                </p>
              )}
              {picked.map((id, i) => {
                const ok = graded && id === i;
                const bad = graded && id !== i;
                return (
                  <button
                    key={id}
                    onClick={() => unpick(id)}
                    className={`flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                      ok
                        ? "border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950"
                        : bad
                        ? "border-rose-400 bg-rose-50 dark:border-rose-600 dark:bg-rose-950"
                        : "border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-950"
                    }`}
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-200">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-gray-700 dark:text-gray-200">{DRILL_ITEMS[id].text}</span>
                    {ok && <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />}
                    {bad && <XCircle size={14} className="mt-0.5 shrink-0 text-rose-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setGraded(true)}
            disabled={!allPicked || graded}
            className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-medium text-white hover:bg-orange-600 disabled:opacity-40"
          >
            채점하기
          </button>
          {graded && (
            <span
              className={`text-sm font-semibold ${
                correctCount === DRILL_ITEMS.length
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {correctCount} / {DRILL_ITEMS.length} 위치 정확
              {correctCount === DRILL_ITEMS.length ? " — 유도 순서를 정확히 기억하고 있음" : ""}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
