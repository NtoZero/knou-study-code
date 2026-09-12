"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import StepControls from "@/components/common/StepControls";
import Dendrogram from "./Dendrogram";
import { divisiveSplitCount, runAgglomerative } from "./hierarchicalCore";

const LABELS = ["A", "B", "C", "D", "E", "F"];
/** 강의록 예제 — A = 1, B = 3, C = 9, D = 12 */
const LECTURE_VALUES = [1, 3, 9, 12];

const SPLIT_NS = [4, 10, 20, 30, 50];

const AGGLOMERATIVE_STEPS = [
  "① 데이터 집합 x₁, x₂, …, x_N으로부터 각 데이터가 각각의 군집이 되도록 N개의 군집 C₁, C₂, …, C_N을 설정함",
  "② 가능한 모든 군집 쌍에 대해 군집 간의 거리를 계산함 — d(Cᵢ, Cⱼ) = min_{xᵢ∈Cᵢ, xⱼ∈Cⱼ} d(xᵢ, xⱼ)",
  "③ 거리가 가장 가까운 두 군집 Cᵢ, Cⱼ를 선택하고 병합하여 새로운 클러스터 Cᵢⱼ = Cᵢ ∪ Cⱼ를 생성함",
  "④ 새로운 클러스터 Cᵢⱼ를 클러스터 풀에 넣고, 원래 클러스터 Cᵢ, Cⱼ를 제거함",
  "⑤ 오직 하나의 클러스터가 남을 때까지 ②~⑤의 과정을 반복함",
];

function formatBig(value: bigint) {
  const text = value.toString();
  const grouped = text.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (text.length <= 6) return grouped;
  const exponent = text.length - 1;
  const mantissa = `${text[0]}.${text.slice(1, 3)}`;
  return `${grouped} (≈ ${mantissa} × 10^${exponent})`;
}

export default function HierarchicalClustering() {
  const [values, setValues] = useState<number[]>(LECTURE_VALUES);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [splitN, setSplitN] = useState(4);

  const labels = useMemo(() => LABELS.slice(0, values.length), [values.length]);
  const result = useMemo(
    () => runAgglomerative(values, labels, "single"),
    [values, labels]
  );

  const totalSteps = result.steps.length + 1;

  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [values]);

  useEffect(() => {
    if (!playing) return;
    if (step >= totalSteps - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStep((s) => s + 1), 1100);
    return () => clearTimeout(timer);
  }, [playing, step, totalSteps]);

  const activeStep = step === 0 ? null : result.steps[step - 1];
  const pool = result.snapshots[step];

  const updateValue = (index: number, raw: string) => {
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;
    setValues((prev) =>
      prev.map((v, i) => (i === index ? Math.max(0, Math.min(30, parsed)) : v))
    );
  };

  return (
    <section>
      <SectionTitle
        title="계층적 군집화"
        subtitle="클러스터 개수를 미리 정하지 않고, 큰 군집이 작은 군집을 포함하는 계층을 만드는 방법"
      />

      <div className="mb-8 rounded-xl border border-teal-200 bg-teal-50 p-5 dark:border-teal-800 dark:bg-teal-950/40">
        <p className="text-xs font-bold tracking-wide text-teal-600 dark:text-teal-400">
          계층적 군집화 hierarchical clustering
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          전체 데이터를 몇 개의 배타적인 그룹으로 나누는 대신,{" "}
          <strong className="text-teal-700 dark:text-teal-300">
            큰 군집이 작은 군집을 포함하는 형태로 계층을 이루도록
          </strong>{" "}
          군집화를 수행하여 그 구조를 살펴보는 방법.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
          K-평균은 구현이 간단하고 이론적 분석도 잘 되어 있어 널리 쓰이지만, 적절한 K를
          결정하기 어렵다는 문제가 있음. 그 대안으로 클러스터의 개수를 미리 정해 놓지 않고
          군집화를 수행하는 것이 계층적 군집화.
        </p>
      </div>

      {/* 두 가지 접근 방법 */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-teal-300 bg-white p-5 dark:border-teal-700 dark:bg-gray-900">
          <p className="text-sm font-bold text-teal-700 dark:text-teal-300">
            병합적 방법 agglomerative, bottom-up
          </p>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            <li>
              · 각 데이터가 하나의 군집을 이루는 최소 군집에서 시작하여, 가까운 군집끼리
              단계적으로 병합하여 더 큰 군집을 만들어 가는 방법
            </li>
            <li>· N개의 데이터 → (N − 1)번의 병합 과정 수행</li>
          </ul>
          <div className="mt-3 flex items-center justify-center gap-1">
            {[4, 3, 2, 1].map((n) => (
              <div key={n} className="flex items-center gap-1">
                <span className="rounded bg-teal-100 px-2 py-1 text-xs font-bold text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
                  {n}
                </span>
                {n > 1 && <span className="text-xs text-gray-400">→</span>}
              </div>
            ))}
            <span className="ml-1 text-xs text-gray-400">개 군집</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
            분할적 방법 divisive, top-down
          </p>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            <li>
              · N개의 모든 데이터가 하나의 군집에 속하는 최대 군집에서 시작하여, 특정
              기준에 따라 군집들을 분할해 가는 방법
            </li>
            <li>
              · N개로 이루어진 하나의 군집을 두 군집으로 분할하는 경우의 수 →
              (2<sup>N−1</sup> − 1)개 → 비실용적
            </li>
          </ul>

          <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <p className="mb-2 text-xs font-bold text-gray-500">경우의 수 계산기</p>
            <div className="flex flex-wrap gap-1.5">
              {SPLIT_NS.map((n) => (
                <button
                  key={n}
                  onClick={() => setSplitN(n)}
                  className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                    splitN === n
                      ? "bg-teal-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400"
                  }`}
                >
                  N = {n}
                </button>
              ))}
            </div>
            <p className="mt-2 break-all font-mono text-xs text-gray-700 dark:text-gray-300">
              2<sup>{splitN - 1}</sup> − 1 = {formatBig(divisiveSplitCount(splitN))}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              모든 경우를 다 따져야 하므로 사실상 비현실적. 그래서 계층적 군집화에서는
              병합적 방법을 사용함.
            </p>
          </div>
        </div>
      </div>

      {/* 병합 과정 + 덴드로그램 */}
      <div className="mb-10">
        <h3 className="mb-1 text-base font-bold">
          병합 과정과 덴드로그램 만들기 (최단연결법 기준)
        </h3>
        <p className="mb-4 text-sm text-gray-500">
          강의록 예제는 1차원 데이터 A = 1, B = 3, C = 9, D = 12. 값을 바꾸면 거리 행렬과
          덴드로그램이 다시 계산됨.
        </p>

        {/* 데이터 편집 */}
        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex flex-wrap items-end gap-3">
            {values.map((v, i) => (
              <div key={i}>
                <label className="block text-xs font-bold text-gray-500">
                  {labels[i]}
                </label>
                <input
                  type="number"
                  value={v}
                  min={0}
                  max={30}
                  onChange={(e) => updateValue(i, e.target.value)}
                  className="mt-1 w-20 rounded-lg border border-gray-200 bg-white p-1.5 text-sm dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
            ))}
            <div className="flex gap-1.5">
              <button
                onClick={() =>
                  setValues((prev) =>
                    prev.length >= 6
                      ? prev
                      : [...prev, Math.min(30, prev[prev.length - 1] + 3)]
                  )
                }
                disabled={values.length >= 6}
                className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-40 dark:bg-gray-800 dark:text-gray-300"
              >
                <Plus size={12} />
                데이터 추가
              </button>
              <button
                onClick={() =>
                  setValues((prev) => (prev.length <= 4 ? prev : prev.slice(0, -1)))
                }
                disabled={values.length <= 4}
                className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-40 dark:bg-gray-800 dark:text-gray-300"
              >
                <Minus size={12} />
                제거
              </button>
              <button
                onClick={() => setValues(LECTURE_VALUES)}
                className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              >
                <RotateCcw size={12} />
                강의록 예제로
              </button>
            </div>
            <div className="ml-auto">
              <StepControls
                step={step}
                totalSteps={totalSteps}
                playing={playing}
                onPlay={() => setPlaying(true)}
                onStop={() => setPlaying(false)}
                onReset={() => {
                  setStep(0);
                  setPlaying(false);
                }}
                onNext={() => setStep((s) => Math.min(s + 1, totalSteps - 1))}
                onPrev={() => setStep((s) => Math.max(s - 1, 0))}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* 거리 행렬 + 클러스터 풀 */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="mb-2 text-sm font-bold">
              {step === 0
                ? "① 각 데이터가 하나의 군집 — 시작 상태"
                : `${step}번째 병합 — 거리 행렬에서 최솟값 선택`}
            </p>

            <div className="mb-3 flex flex-wrap gap-1.5">
              {pool.map((c) => (
                <span
                  key={c.id}
                  className="rounded-full bg-teal-100 px-2.5 py-1 text-xs font-bold text-teal-700 dark:bg-teal-900/50 dark:text-teal-300"
                >
                  {c.id}
                </span>
              ))}
              <span className="self-center text-xs text-gray-400">
                클러스터 풀 ({pool.length}개)
              </span>
            </div>

            {activeStep ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr>
                        <th className="p-1.5" />
                        {activeStep.clusters.map((c) => (
                          <th
                            key={c.id}
                            className="border-b border-gray-200 p-1.5 font-mono font-bold dark:border-gray-700"
                          >
                            {c.id}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeStep.clusters.map((row, i) => (
                        <tr key={row.id}>
                          <th className="border-r border-gray-200 p-1.5 text-left font-mono font-bold dark:border-gray-700">
                            {row.id}
                          </th>
                          {activeStep.clusters.map((__, j) => {
                            const d = activeStep.matrix[i][j];
                            const isMin =
                              (i === activeStep.minI && j === activeStep.minJ) ||
                              (i === activeStep.minJ && j === activeStep.minI);
                            return (
                              <td
                                key={j}
                                className={`border-b border-gray-100 p-1.5 text-center font-mono dark:border-gray-800 ${
                                  isMin
                                    ? "bg-teal-500 font-bold text-white"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                {d === null ? "—" : d.toFixed(1)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 rounded-lg bg-teal-50 p-2.5 text-xs text-teal-800 dark:bg-teal-950/40 dark:text-teal-200">
                  가장 가까운 두 군집{" "}
                  <strong>{activeStep.clusters[activeStep.minI].id}</strong>와{" "}
                  <strong>{activeStep.clusters[activeStep.minJ].id}</strong>를 거리{" "}
                  {activeStep.distance.toFixed(1)}에서 병합하여{" "}
                  <strong>{activeStep.mergedId}</strong> 생성. 원래 두 군집은 클러스터
                  풀에서 제거.
                </p>
              </>
            ) : (
              <p className="rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
                병합적 방법은 각 데이터가 하나의 군집인 상태에서 시작하므로{" "}
                {labels.map((l) => `C${l}`).join(", ")} {values.length}개의 군집으로 출발.
                다음 단계로 넘기면 모든 군집 쌍의 거리를 계산한 행렬이 나타남.
              </p>
            )}
          </div>

          {/* 덴드로그램 */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="mb-2 text-sm font-bold">
              덴드로그램 dendrogram — 계층적인 군집화 결과를 보여 주는 그림
            </p>
            <Dendrogram
              values={values}
              labels={labels}
              result={result}
              visibleMerges={step}
            />
          </div>
        </div>
      </div>

      {/* 수행 단계 */}
      <div>
        <h3 className="mb-3 text-base font-bold">병합적 방법의 수행 단계</h3>
        <ol className="space-y-2">
          {AGGLOMERATIVE_STEPS.map((text, i) => (
            <li
              key={i}
              className="rounded-xl border-l-4 border-teal-500 bg-white p-3 text-sm leading-relaxed text-gray-700 dark:bg-gray-900 dark:text-gray-300"
            >
              {text}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
