"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import StepControls from "@/components/common/StepControls";
import { ArrowRight, Ban } from "lucide-react";

/* ── 수식을 HTML/CSS로 표현하기 위한 조각들 ───────────────── */

function Frac({ top, bottom }: { top: ReactNode; bottom: ReactNode }) {
  return (
    <span className="mx-1 inline-flex flex-col items-center align-middle text-[0.8em] leading-tight">
      <span className="px-1">{top}</span>
      <span className="my-0.5 w-full border-t border-current" />
      <span className="px-1">{bottom}</span>
    </span>
  );
}

function Sum({ under }: { under: ReactNode }) {
  return (
    <span className="mx-1 inline-flex flex-col items-center align-middle leading-none">
      <span className="text-xl">Σ</span>
      <span className="mt-0.5 text-[0.6em] text-gray-500">{under}</span>
    </span>
  );
}

function Sq({ children }: { children: ReactNode }) {
  return (
    <span>
      ( {children} )<sup>2</sup>
    </span>
  );
}

/* ── 오차 3종 ──────────────────────────────────────────── */

interface ErrorDef {
  key: string;
  name: string;
  english: string;
  formula: ReactNode;
  meaning: string;
  note: string;
  blocked?: boolean;
}

const errorDefs: ErrorDef[] = [
  {
    key: "train",
    name: "학습 오차",
    english: "training error",
    formula: (
      <>
        E<sub>train</sub> ={" "}
        <Frac top={<>1</>} bottom={<>|X<sub>train</sub>|</>} />
        <Sum under={<>x<sub>i</sub> ∈ X<sub>train</sub></>} />
        <Sq>
          y<sub>i</sub> − f(x<sub>i</sub>; θ)
        </Sq>
      </>
    ),
    meaning: "학습 데이터 집합 X_train을 대상으로 계산된 오차.",
    note: "학습에 실제로 사용한 데이터로 계산하므로, 시스템의 실제 성능을 나타내지는 못함.",
  },
  {
    key: "test",
    name: "테스트 오차",
    english: "test error",
    formula: (
      <>
        E<sub>test</sub> ={" "}
        <Frac top={<>1</>} bottom={<>|X<sub>test</sub>|</>} />
        <Sum under={<>x<sub>i</sub> ∈ X<sub>test</sub></>} />
        <Sq>
          y<sub>i</sub> − f(x<sub>i</sub>; θ)
        </Sq>
      </>
    ),
    meaning: "테스트 데이터 집합 X_test를 대상으로 계산된 오차.",
    note: "학습이 끝난 후 추론 단계에서 계산. 일반화 오차에 대한 경험치이므로 경험 오차(empirical error)라고도 부름.",
  },
  {
    key: "gen",
    name: "일반화 오차",
    english: "generalization error",
    formula: (
      <>
        E<sub>gen</sub> = ∫
        <span className="inline-flex flex-col items-center align-middle text-[0.6em] leading-none">
          <span>∞</span>
          <span className="mt-3">−∞</span>
        </span>
        <Sq>
          y<sub>i</sub> − f(x<sub>i</sub>; θ)
        </Sq>{" "}
        p(x) dx
      </>
    ),
    meaning: "관찰될 수 있는 모든 데이터를 대상으로 정의되는 오차.",
    note: "일반화 오차의 최소화가 실제 원하는 궁극적 목표. 그러나 모집단의 확률밀도 p(x)를 모르므로 실제 계산이 불가.",
    blocked: true,
  },
];

/* ── 교차검증 회차별 테스트 오차 (결정론적 예시 값) ────────── */

function foldError(k: number, round: number): number {
  return 0.108 + (((round * 37 + k * 13) % 17) / 17) * 0.09;
}

/* ── 본문 ──────────────────────────────────────────────── */

export default function ErrorAndValidation() {
  const [reveal, setReveal] = useState(0); // 0..3
  const [k, setK] = useState(5);
  const [round, setRound] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setRound(0);
    setPlaying(false);
  }, [k]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      setRound((r) => {
        if (r >= k - 1) {
          setPlaying(false);
          return r;
        }
        return r + 1;
      });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [playing, round, k]);

  const errors = Array.from({ length: k }, (_, r) => foldError(k, r));
  const ecv = errors.reduce((a, b) => a + b, 0) / k;

  return (
    <section>
      <SectionTitle
        title="학습 시스템과 성능 평가"
        subtitle="학습 시스템, 목적함수와 오차함수, 세 가지 오차, 그리고 교차검증법"
      />

      {/* 학습 시스템 */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-3 text-base font-bold">학습 시스템</h3>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
            입력 <strong>x</strong>
          </span>
          <ArrowRight size={16} className="text-gray-400" />
          <span className="rounded-lg border-2 border-cyan-500 bg-cyan-50 px-4 py-2 text-sm font-bold text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-200">
            f(x; θ)
          </span>
          <ArrowRight size={16} className="text-gray-400" />
          <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
            출력 <strong>y</strong>
          </span>
        </div>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
          <li>
            · 데이터로부터 학습을 통해 추출하고자 하는 정보를 표현하는 시스템. 입·출력 매핑 형태의 함수{" "}
            <strong>y = f(x; θ)</strong>로 정의.
          </li>
          <li>
            · <strong>학습</strong>이란 데이터를 이용하여 함수 f를 찾는 것. 함수의 모양을 결정하는 것은
            매개변수 θ이므로, 결국 학습 시스템의 <strong>매개변수 θ를 찾는 것</strong>.
          </li>
          <li>
            · <strong>학습의 궁극적 목표</strong> — 학습 데이터가 아닌, 앞으로 주어질 새로운 데이터에
            대한 성능을 최대로 하는 것.
          </li>
        </ul>
      </div>

      {/* 목적함수 / 오차함수 */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900 dark:bg-cyan-950/40">
          <p className="text-sm font-bold text-cyan-800 dark:text-cyan-200">
            목적함수 objective function
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
            주어진 데이터 집합을 이용하여 학습 시스템이 달성해야 하는 목표를 기계가 알 수 있는 수학적
            함수로 정의한 것.
          </p>
        </div>
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-900 dark:bg-cyan-950/40">
          <p className="text-sm font-bold text-cyan-800 dark:text-cyan-200">오차함수 error function</p>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
            <li>· 대표적인 목적함수.</li>
            <li>
              · 원하는 출력값 y<sub>i</sub>와 학습 시스템의 출력값 f(x<sub>i</sub>; θ)의 차이(&lsquo;오차&rsquo;)로
              정의.
            </li>
            <li>· 학습의 목적 → 오차를 최소화하는 것.</li>
            <li>
              · 목적에 따라 <strong>제곱오차</strong>, <strong>크로스엔트로피 오차</strong> 등 여러 가지가 있음.
            </li>
            <li>
              · 딥러닝에서는 오차함수를 <strong>손실함수</strong> 또는 <strong>비용함수</strong>라고 부름.
            </li>
          </ul>
        </div>
      </div>

      {/* 세 가지 오차 */}
      <h3 className="mb-1 text-base font-bold">오차함수를 사용한 성능 평가 기준</h3>
      <p className="mb-4 text-sm text-gray-500">
        단계를 눌러 학습 오차 → 테스트 오차 → 일반화 오차 → 실제 평가 기준의 흐름을 따라가기.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {["학습 오차", "테스트 오차", "일반화 오차", "그래서 무엇으로 평가하나"].map((label, i) => (
          <button
            key={label}
            onClick={() => setReveal(i)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              reveal >= i
                ? "bg-cyan-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      <div className="mb-10 space-y-3">
        {errorDefs.map((e, i) => (
          <AnimatePresence key={e.key} initial={false}>
            {reveal >= i && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl border p-5 ${
                  e.blocked
                    ? "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40"
                    : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
                }`}
              >
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="text-sm font-bold">{e.name}</p>
                  <p className="text-xs text-gray-500">{e.english}</p>
                  {e.blocked && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      <Ban size={10} /> 계산 불가
                    </span>
                  )}
                </div>
                <div className="mt-3 overflow-x-auto">
                  <div className="min-w-[300px] rounded-lg bg-gray-50 px-4 py-3 font-serif text-base text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                    {e.formula}
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">{e.meaning}</p>
                <p className="mt-1 text-xs text-gray-500">{e.note}</p>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
        <AnimatePresence initial={false}>
          {reveal >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border-2 border-cyan-500 bg-cyan-50 p-5 dark:bg-cyan-950/50"
            >
              <p className="text-sm font-bold text-cyan-800 dark:text-cyan-200">
                일반화 오차 → 테스트 오차(= 경험 오차)로 대신하여 평가
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                이론적으로는 일반화 오차가 기준이지만, 식에 모집단의 확률밀도 p(x)가 들어가고 이 p(x)를 알
                수 없으므로 실제 계산이 불가능. 따라서 테스트 오차를 대신 사용하여 시스템의 실제 성능을
                평가하며, 이를 <strong>경험 오차 empirical error</strong>라고도 부름.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 교차검증법 */}
      <h3 className="mb-1 text-base font-bold">K-분절 교차검증법 K-fold cross validation</h3>
      <p className="mb-4 text-sm text-gray-500">
        제한된 데이터 집합을 이용하여 일반화 오차에 좀 더 근접한 오차값을 얻어 내기 위한 방법.
      </p>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600 dark:text-gray-300">분절 수 K</label>
          <input
            type="range"
            min={3}
            max={10}
            step={1}
            value={k}
            onChange={(ev) => setK(Number(ev.target.value))}
            className="w-40 accent-cyan-600"
          />
          <span className="w-6 text-sm font-bold tabular-nums text-cyan-700 dark:text-cyan-300">{k}</span>
        </div>
        <StepControls
          step={round}
          totalSteps={k}
          playing={playing}
          onPlay={() => {
            if (round >= k - 1) setRound(0);
            setPlaying(true);
          }}
          onStop={() => setPlaying(false)}
          onReset={() => {
            setPlaying(false);
            setRound(0);
          }}
          onNext={() => setRound((r) => Math.min(r + 1, k - 1))}
          onPrev={() => setRound((r) => Math.max(r - 1, 0))}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="min-w-[520px] space-y-1.5">
          {Array.from({ length: k }).map((_, r) => {
            const active = r === round;
            const visible = r <= round;
            return (
              <div
                key={r}
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors ${
                  active ? "bg-cyan-50 dark:bg-cyan-950/50" : ""
                }`}
                style={{ opacity: visible ? 1 : 0.35 }}
              >
                <span className="w-28 shrink-0 text-[11px] text-gray-500">
                  E<sub>train</sub>(X − X<sub>{r + 1}</sub>)
                </span>
                <div className="flex flex-1 gap-1">
                  {Array.from({ length: k }).map((__, c) => {
                    const isTest = c === r;
                    return (
                      <motion.div
                        key={c}
                        animate={{ scale: active && isTest ? 1.06 : 1 }}
                        className={`flex-1 rounded py-1.5 text-center text-[11px] font-medium ${
                          isTest
                            ? "bg-amber-400 text-amber-950"
                            : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                        }`}
                      >
                        X<sub>{c + 1}</sub>
                      </motion.div>
                    );
                  })}
                </div>
                <span className="w-28 shrink-0 text-right text-[11px] text-gray-500">
                  E<sub>test</sub>(X<sub>{r + 1}</sub>) ={" "}
                  <strong className="tabular-nums text-gray-700 dark:text-gray-200">
                    {errors[r].toFixed(3)}
                  </strong>
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3 text-sm dark:border-gray-800">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="h-3 w-3 rounded bg-amber-400" /> 테스트에 사용되는 분절
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="h-3 w-3 rounded bg-slate-200 dark:bg-slate-700" /> 학습에 사용되는 분절
          </span>
          <span className="ml-auto rounded-lg bg-cyan-600 px-3 py-1.5 text-sm font-bold text-white">
            평균 E<sub>cv</sub> (교차검증 오차) = {ecv.toFixed(3)}
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-500">
        5-분절 교차검증법의 예 — 원래 데이터를 X<sub>1</sub>~X<sub>5</sub>의 5개로 나눈 뒤, 첫 번째
        회차에서는 X<sub>1</sub>을 학습에서 빼고 테스트에만 사용. 두 번째 회차에서는 X<sub>2</sub>를 빼고
        테스트에 사용. 이런 식으로 반복한 뒤 각 회차의 테스트 오차를 평균 내면 일반화 오차에 좀 더 근접한
        오차값을 얻을 수 있음.
      </p>
    </section>
  );
}
