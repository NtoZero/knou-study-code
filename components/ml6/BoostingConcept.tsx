"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";

const FILTER_STEPS = [
  {
    learner: "h₁",
    data: "X₁",
    how: "첫 번째 데이터 집합 X₁을 이용하여 첫 번째 학습기 h₁을 얻음.",
    filter: "필터 없음",
  },
  {
    learner: "h₂",
    data: "X₂",
    how: "새로운 데이터 집합 X₂를 생성하여 h₁에 입력으로 주고, 잘못된 결과를 내는 데이터들을 찾음. 이 데이터와 함께 올바른 결과를 낸 데이터들도 일부 추출하되, 두 그룹이 차지하는 비율은 동일하게 구성. 이렇게 만든 학습 집합으로 h₂를 학습.",
    filter: "h₁이 틀린 데이터 & 바르게 처리한 데이터 일부 (같은 비율)",
  },
  {
    learner: "h₃",
    data: "X₃",
    how: "새로운 데이터 집합 X₃를 먼저 얻어진 h₁과 h₂에 입력으로 주어, 그 결과가 서로 일치하지 않는 데이터들만 모아 h₃의 학습 데이터 집합을 만듦.",
    filter: "h₁과 h₂의 결과가 서로 일치하지 않는 데이터",
  },
];

type Cls = "C₁" | "C₂";

export default function BoostingConcept() {
  const [fs, setFs] = useState(0);
  const [out, setOut] = useState<Cls[]>(["C₁", "C₂", "C₁"]);

  const agree = out[0] === out[1];
  const final = agree ? out[0] : out[2];

  const flip = (i: number) =>
    setOut((prev) => prev.map((v, k) => (k === i ? (v === "C₁" ? "C₂" : "C₁") : v)));

  const cur = FILTER_STEPS[fs];

  return (
    <section>
      <SectionTitle
        title="04. 부스팅"
        subtitle="간단한 학습기들이 상호보완적 역할을 하도록 단계적으로 학습하여 성능을 증폭(boost)"
      />

      <Sourced
        className="mb-6"
        refs={{
          textbook: "8.3 부스팅",
          slides: "부스팅 boosting",
        }}
      >
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/40">
          <p className="text-xs font-bold tracking-wide text-amber-600 dark:text-amber-400">부스팅 (boosting)</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
            간단한 학습기들이 상호보완적 역할을 할 수 있도록 단계적으로 학습을 수행하여
            결합함으로써 성능을 증폭(boost)시키기 위한 방법.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            학습기들을 <strong>순차적으로</strong> 학습하도록 하여, 먼저 학습된 학습기의 결과가
            다음 학습기의 학습에 정보를 제공 → 이전 학습기의 결점을 보완하는 방향으로 학습을
            진행.
          </p>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[440px] border-collapse text-xs">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="border-b border-gray-200 p-2 dark:border-gray-700" />
                <th className="border-b border-gray-200 p-2 dark:border-gray-700">배깅</th>
                <th className="border-b border-gray-200 p-2 dark:border-gray-700">부스팅</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              <tr>
                <td className="border-b border-gray-100 p-2 font-semibold dark:border-gray-800">학습기 간 차이</td>
                <td className="border-b border-gray-100 p-2 dark:border-gray-800">데이터의 확률적 리샘플링에만 의존</td>
                <td className="border-b border-gray-100 p-2 dark:border-gray-800">상호보완적 역할을 하도록 전략적으로 학습</td>
              </tr>
              <tr>
                <td className="border-b border-gray-100 p-2 font-semibold dark:border-gray-800">학습 순서</td>
                <td className="border-b border-gray-100 p-2 dark:border-gray-800">앞 학습기의 결과가 다음 학습기의 학습에 쓰이지 않음</td>
                <td className="border-b border-gray-100 p-2 dark:border-gray-800">
                  순차적 — 먼저 학습된 학습기의 결과가 다음 학습에 정보 제공
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Sourced>

      {/* 필터링에 의한 부스팅 */}
      <Sourced
        className="mb-6"
        refs={{
          textbook: "8.3 부스팅 — 필터링에 의한 부스팅",
          slides: "필터링에 의한 부스팅 boosting by filtering",
        }}
      >
        <h3 className="mb-1 text-base font-bold">필터링에 의한 부스팅 (boosting by filtering)</h3>
        <p className="mb-3 text-sm text-gray-500">
          가장 처음 제안된 부스팅 방법(로버트 샤피르, Robert Schapire). 학습기별로 서로 다른
          데이터 집합을 사용. 단계를 넘기며 확인.
        </p>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">학습 과정</span>
            {FILTER_STEPS.map((s, i) => (
              <button
                key={s.learner}
                onClick={() => setFs(i)}
                className={`rounded-md px-2.5 py-1 font-mono text-xs font-bold transition-colors ${
                  fs === i
                    ? "bg-amber-500 text-white"
                    : fs > i
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                }`}
              >
                {s.learner}
              </button>
            ))}
            <div className="ml-auto flex gap-1">
              <button
                onClick={() => setFs((v) => Math.max(0, v - 1))}
                className="rounded-md bg-gray-100 p-1 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                aria-label="이전 단계"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setFs((v) => Math.min(FILTER_STEPS.length - 1, v + 1))}
                className="rounded-md bg-gray-100 p-1 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                aria-label="다음 단계"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={fs}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <div className="overflow-x-auto">
                <div className="flex min-w-[420px] items-center gap-2 text-xs">
                  <span className="rounded-md bg-sky-100 px-2.5 py-1.5 font-mono font-bold text-sky-800 dark:bg-sky-900/40 dark:text-sky-200">
                    새 데이터 {cur.data}
                  </span>
                  <ArrowRight size={14} className="text-amber-500" />
                  <span
                    className={`rounded-md px-2.5 py-1.5 ${
                      fs === 0
                        ? "bg-gray-100 text-gray-500 dark:bg-gray-800"
                        : "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100"
                    }`}
                  >
                    필터: {cur.filter}
                  </span>
                  <ArrowRight size={14} className="text-amber-500" />
                  <span className="rounded-md bg-amber-500 px-2.5 py-1.5 font-mono font-bold text-white">
                    {cur.learner} 학습
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{cur.how}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p className="mb-2 text-xs font-bold text-gray-500">추론 과정 — 학습기 출력을 눌러 바꿔 보기</p>
          <div className="flex flex-wrap items-center gap-2">
            {out.map((v, i) => (
              <button
                key={i}
                onClick={() => flip(i)}
                className={`rounded-lg border px-3 py-1.5 font-mono text-sm transition-colors ${
                  i === 2 && agree
                    ? "border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800"
                    : "border-amber-400 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
                }`}
              >
                h{i + 1}(x) = {v}
              </button>
            ))}
            <ArrowRight size={14} className="text-amber-500" />
            <span className="rounded-lg bg-amber-500 px-3 py-1.5 font-mono text-sm font-bold text-white">
              최종 = {final}
            </span>
          </div>
          <p className="mt-2 font-mono text-xs text-gray-600 dark:text-gray-400">
            if (h₁과 h₂의 결과가 일치) then 해당 결과가 최종 결과 else h₃의 결과가 최종 결과
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {agree
              ? "h₁과 h₂가 일치 → h₃는 사용하지 않음."
              : "h₁과 h₂가 불일치 → h₃의 결과를 최종 결과로 선택. h₃가 바로 이런 데이터로 학습되었음."}
          </p>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>
            문제점 — 각 학습기를 학습할 때마다 새로운 데이터 집합을 생성해야 하고, 두 번째와
            세 번째에 생성되는 데이터는 그 일부만 학습에 활용됨. 따라서 제대로 학습하는 데 필요한{" "}
            <strong>학습 데이터의 규모가 매우 커야 함</strong> ⇒ AdaBoost 등장.
          </span>
        </div>
      </Sourced>

      {/* AdaBoost 특징 */}
      <Sourced
        refs={{
          textbook: "8.3 부스팅 — AdaBoost",
          slides: "AdaBoost 알고리즘 — 특징",
          lecture: "AdaBoost는 학습 방법과 결합 방법을 함께 고려하며, 분류기의 중요도가 결합할 때 가중치로 쓰인다는 점을 중요한 특징으로 꼽음",
        }}
      >
        <h3 className="mb-3 text-base font-bold">AdaBoost의 특징</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border-l-4 border-amber-500 bg-white p-4 shadow-sm dark:bg-gray-900">
            <p className="text-sm font-bold">같은 데이터 집합을 반복 사용</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              필터링에 의한 부스팅처럼 매번 새 데이터를 만들지 않음.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-amber-500 bg-white p-4 shadow-sm dark:bg-gray-900">
            <p className="text-sm font-bold">데이터의 중요도(가중치)를 조정</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              학습할 때마다 각 데이터에 대한 가중치를 조정하여 학습에 변화를 줌. &ldquo;데이터의
              중요도가 적응적으로 변한다&rdquo; → <strong>Adaptive + Boost</strong>.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-amber-500 bg-white p-4 shadow-sm dark:bg-gray-900">
            <p className="text-sm font-bold">학습 방법 + 결합 방법</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              배깅과 달리 결합 방법도 함께 고려. 분류기의 중요도가 전체 결합 과정에서
              결합계수로 사용되고, 결합은 가중치(분류기의 중요도)를 가진 보팅 방법.
            </p>
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
          각 학습기에서 쓰는 데이터 가중치는 학습의 목적함수(분류 문제의 경우 오분류율)를
          정의할 때 사용되고, 이 목적함수가 다시 각 학습기가 전체 결합에서 어느 정도 영향을
          줄지 정하는 결합계수를 정의하는 데 사용됨.
        </p>
      </Sourced>
    </section>
  );
}
