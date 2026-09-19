"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { argmax, isTie } from "./ensembleCore";

/* ─────────── 평균법 예 ─────────── */
const TARGET = 10;
const REGRESSORS = [
  { name: "h₁", out: 9.6, note: "성능 좋음" },
  { name: "h₂", out: 10.3, note: "성능 좋음" },
  { name: "h₃", out: 13.0, note: "성능 나쁨" },
];

/* ─────────── 보팅 예 ─────────── */
const CLASSES = ["C₁", "C₂", "C₃"];
type Probs = number[][];
const PRESETS: { label: string; probs: Probs; note: string }[] = [
  {
    label: "하드·소프트가 갈리는 경우",
    probs: [
      [0.9, 0.05, 0.05],
      [0.4, 0.45, 0.15],
      [0.35, 0.45, 0.2],
    ],
    note: "h₂, h₃는 C₂를 근소하게 택했지만 h₁은 C₁을 강하게 확신.",
  },
  {
    label: "과반수 미달",
    probs: [
      [0.6, 0.3, 0.1],
      [0.2, 0.5, 0.3],
      [0.1, 0.3, 0.6],
    ],
    note: "세 학습기가 모두 다른 클래스를 택함.",
  },
  {
    label: "모두 같은 판단",
    probs: [
      [0.7, 0.2, 0.1],
      [0.6, 0.3, 0.1],
      [0.5, 0.3, 0.2],
    ],
    note: "어떤 결합 방법을 써도 결과가 같음.",
  },
];

const normalize = (w: number[]) => {
  const s = w.reduce((a, b) => a + b, 0);
  return s > 0 ? w.map((v) => v / s) : w.map(() => 1 / w.length);
};

/* ─────────── 결합기 예 ─────────── */
const NEW_DATA = [
  { x: "x₁", z: [1, 1, -1], y: 1 },
  { x: "x₂", z: [-1, 1, -1], y: -1 },
  { x: "x₃", z: [1, -1, 1], y: 1 },
  { x: "x₄", z: [-1, -1, 1], y: -1 },
];

export default function CombinationMethods() {
  /* 평균법 */
  const [avgW, setAvgW] = useState([0.45, 0.45, 0.1]);
  const avgWN = normalize(avgW);
  const simpleAvg = REGRESSORS.reduce((a, r) => a + r.out, 0) / REGRESSORS.length;
  const weightedAvg = REGRESSORS.reduce((a, r, i) => a + avgWN[i] * r.out, 0);

  /* 보팅 */
  const [preset, setPreset] = useState(0);
  const [probs, setProbs] = useState<Probs>(PRESETS[0].probs);
  const [voteW, setVoteW] = useState([1, 1, 1]);
  const [rejectMinority, setRejectMinority] = useState(false);
  const vwN = normalize(voteW);

  const result = useMemo(() => {
    const rowsN = probs.map((row) => normalize(row));
    const hard = rowsN.map((row) => {
      const k = argmax(row);
      return CLASSES.map((_, j) => (j === k ? 1 : 0));
    });
    const sumCols = (rows: number[][], w?: number[]) =>
      CLASSES.map((_, j) => rows.reduce((a, row, i) => a + (w ? w[i] : 1) * row[j], 0));
    const hardMaj = sumCols(hard);
    const hardW = sumCols(hard, vwN);
    const softMaj = sumCols(rowsN);
    const softW = sumCols(rowsN, vwN);
    return { rowsN, hard, hardMaj, hardW, softMaj, softW };
  }, [probs, vwN]);

  const setProb = (i: number, j: number, v: number) =>
    setProbs((prev) => prev.map((row, a) => (a === i ? row.map((c, b) => (b === j ? v : c)) : row)));

  const verdict = (scores: number[], majorityCheck: boolean) => {
    const k = argmax(scores);
    if (majorityCheck && rejectMinority && scores[k] <= probs.length / 2)
      return { text: "기각 (과반수 미달)", tone: "text-red-600" };
    if (isTie(scores)) return { text: "동점", tone: "text-gray-500" };
    return { text: CLASSES[k], tone: "text-amber-700 dark:text-amber-300" };
  };

  /* 결합기 */
  const [reuse, setReuse] = useState(false);

  return (
    <section id="combination" className="scroll-mt-32">
      <SectionTitle
        title="06. 결합 방법 — 기본적인 결합 방법"
        subtitle="학습기의 결과를 결합하는 대표적 방법: 평균법, 보팅법(투표법), 결합기"
      />

      {/* 평균법 */}
      <Sourced
        className="mb-8"
        refs={{
          textbook: "8.4.1 기본적인 결합 방법 — 평균법 (식 8-11, 8-12)",
          slides: "기본적인 결합 방법 — 평균법",
        }}
      >
        <h3 className="mb-1 text-base font-bold">평균법 — 학습기의 출력이 수치형일 때 적합</h3>
        <div className="mb-3 grid grid-cols-1 gap-2 overflow-x-auto sm:grid-cols-2">
          <p className="rounded-lg bg-amber-50 p-3 font-mono text-sm dark:bg-amber-950/40">
            단순평균 f(x) = (1/M) Σᵢ hᵢ(x) <span className="font-sans text-[11px] text-gray-500">(식 8-11)</span>
          </p>
          <p className="rounded-lg bg-amber-50 p-3 font-mono text-sm dark:bg-amber-950/40">
            가중평균 f(x) = Σᵢ wᵢ hᵢ(x), wᵢ ≥ 0, Σwᵢ = 1{" "}
            <span className="font-sans text-[11px] text-gray-500">(식 8-12)</span>
          </p>
        </div>
        <p className="mb-3 text-sm text-gray-500">
          앞선 배깅의 식 8-5가 단순평균에 해당. 가중평균의 가중치 wᵢ는 일반적으로 학습 데이터를
          사용한 학습 과정에서 얻음. 아래는 목표값 t = {TARGET}인 입력 하나에 대한 세 학습기의
          출력 — 가중치를 조절해 보기 (합이 1이 되도록 자동 정규화).
        </p>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="space-y-2">
            {REGRESSORS.map((r, i) => (
              <div key={r.name} className="grid grid-cols-[72px_minmax(0,1fr)_64px] items-center gap-2 text-sm">
                <span className="font-mono">
                  {r.name} = {r.out}
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={avgW[i]}
                  onChange={(e) =>
                    setAvgW((prev) => prev.map((v, k) => (k === i ? Number(e.target.value) : v)))
                  }
                  className="w-full accent-amber-500"
                  aria-label={`${r.name} 가중치`}
                />
                <span className="text-right font-mono text-xs">w = {avgWN[i].toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
              <p className="text-[11px] text-gray-500">단순평균</p>
              <p className="font-mono text-lg font-bold">{simpleAvg.toFixed(3)}</p>
              <p className="text-[11px] text-gray-500">|f − t| = {Math.abs(simpleAvg - TARGET).toFixed(3)}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950/40">
              <p className="text-[11px] text-gray-500">가중평균</p>
              <p className="font-mono text-lg font-bold">{weightedAvg.toFixed(3)}</p>
              <p className="text-[11px] text-gray-500">|f − t| = {Math.abs(weightedAvg - TARGET).toFixed(3)}</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            h₃처럼 성능이 크게 떨어지는 학습기가 섞여 학습기 간의 성능 차이가 비교적 큰 경우에는
            가중평균, 비슷한 성능을 가진 경우에는 단순평균을 적용.
          </p>
        </div>
      </Sourced>

      {/* 보팅법 */}
      <Sourced
        className="mb-8"
        refs={{
          textbook: "8.4.1 기본적인 결합 방법 — 보팅법 (식 8-13, 8-14), 하드·소프트 보팅",
          slides: "기본적인 결합 방법 — 보팅법",
        }}
      >
        <h3 className="mb-1 text-base font-bold">보팅법 — 분류 문제에서 주로 사용</h3>
        <div className="mb-3 grid grid-cols-1 gap-2 overflow-x-auto sm:grid-cols-2">
          <p className="rounded-lg bg-amber-50 p-3 font-mono text-sm dark:bg-amber-950/40">
            다수결 투표 f(x) = argmaxⱼ Σᵢ hᵢʲ(x) <span className="font-sans text-[11px] text-gray-500">(식 8-13)</span>
          </p>
          <p className="rounded-lg bg-amber-50 p-3 font-mono text-sm dark:bg-amber-950/40">
            가중 보팅 f(x) = argmaxⱼ Σᵢ wᵢ hᵢʲ(x), wᵢ ≥ 0, Σwᵢ = 1{" "}
            <span className="font-sans text-[11px] text-gray-500">(식 8-14)</span>
          </p>
        </div>
        <p className="mb-3 text-sm text-gray-500">
          hᵢʲ(x) — 데이터 x에 대한 학습기 hᵢ의 출력 클래스 레이블이 j임을 나타냄. 출력 유형에
          따라 <strong>하드 보팅</strong> hᵢʲ(x) ∈ {"{"}0, 1{"}"}, <strong>소프트 보팅</strong>{" "}
          hᵢʲ(x) ∈ [0, 1]. 아래 표의 값은 각 학습기가 낸 클래스별 확률값(소프트 출력)이며,
          하드 보팅은 이를 가장 큰 클래스만 1로 바꾼 값을 사용.
        </p>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 flex flex-wrap gap-2">
            {PRESETS.map((p, i) => (
              <button
                key={p.label}
                onClick={() => {
                  setPreset(i);
                  setProbs(p.probs);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  preset === i
                    ? "bg-amber-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="mb-2 text-xs text-gray-500">{PRESETS[preset].note} 값을 직접 고쳐도 됨.</p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-xs">
              <thead>
                <tr className="text-gray-500">
                  <th className="border-b border-gray-200 p-1.5 text-left dark:border-gray-700">학습기</th>
                  {CLASSES.map((c) => (
                    <th key={c} className="border-b border-gray-200 p-1.5 dark:border-gray-700">
                      소프트 hᵢ({c})
                    </th>
                  ))}
                  <th className="border-b border-gray-200 p-1.5 dark:border-gray-700">하드 출력</th>
                  <th className="border-b border-gray-200 p-1.5 dark:border-gray-700">가중치 wᵢ</th>
                </tr>
              </thead>
              <tbody>
                {probs.map((row, i) => (
                  <tr key={i}>
                    <td className="border-b border-gray-100 p-1.5 font-mono dark:border-gray-800">h{i + 1}</td>
                    {row.map((v, j) => (
                      <td key={j} className="border-b border-gray-100 p-1 text-center dark:border-gray-800">
                        <input
                          type="number"
                          min={0}
                          max={1}
                          step={0.05}
                          value={v}
                          onChange={(e) => setProb(i, j, Math.max(0, Math.min(1, Number(e.target.value) || 0)))}
                          className="w-16 rounded border border-gray-200 bg-white px-1 py-0.5 text-center font-mono dark:border-gray-700 dark:bg-gray-800"
                          aria-label={`h${i + 1} ${CLASSES[j]} 확률`}
                        />
                      </td>
                    ))}
                    <td className="border-b border-gray-100 p-1.5 text-center font-mono dark:border-gray-800">
                      [{result.hard[i].join(", ")}] → {CLASSES[result.hard[i].indexOf(1)]}
                    </td>
                    <td className="border-b border-gray-100 p-1.5 dark:border-gray-800">
                      <div className="flex items-center gap-1">
                        <input
                          type="range"
                          min={0}
                          max={3}
                          step={0.1}
                          value={voteW[i]}
                          onChange={(e) =>
                            setVoteW((prev) => prev.map((w, k) => (k === i ? Number(e.target.value) : w)))
                          }
                          className="w-16 accent-amber-500"
                          aria-label={`h${i + 1} 가중치`}
                        />
                        <span className="font-mono">{vwN[i].toFixed(2)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-1 text-[11px] text-gray-400">
            한 학습기의 확률 합이 1이 아니면 계산 전에 합이 1이 되도록 나눠 맞춤.
          </p>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              { title: "하드 · 다수결 투표", scores: result.hardMaj, maj: true, fmtD: 0 },
              { title: "하드 · 가중 보팅", scores: result.hardW, maj: false, fmtD: 2 },
              { title: "소프트 · 다수결 투표 (확률 합)", scores: result.softMaj, maj: false, fmtD: 2 },
              { title: "소프트 · 가중 보팅", scores: result.softW, maj: false, fmtD: 2 },
            ].map((b) => {
              const v = verdict(b.scores, b.maj);
              return (
                <div key={b.title} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                  <p className="text-[11px] font-bold text-gray-500">{b.title}</p>
                  <p className="mt-1 font-mono text-xs text-gray-600 dark:text-gray-400">
                    {CLASSES.map((c, j) => `${c}: ${b.scores[j].toFixed(b.fmtD)}`).join(" · ")}
                  </p>
                  <p className={`mt-1 text-sm font-bold ${v.tone}`}>
                    <ArrowRight size={12} className="mr-1 inline" />
                    {v.text}
                  </p>
                </div>
              );
            })}
          </div>

          <label className="mt-3 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={rejectMinority}
              onChange={(e) => setRejectMinority(e.target.checked)}
              className="accent-amber-500"
            />
            다수결 투표에 과반수 개념 도입 — 최대 득표가 과반수를 넘지 못하면 분류 결과를 기각
          </label>
        </div>
      </Sourced>

      {/* 결합기 */}
      <Sourced
        className="mb-4"
        refs={{
          textbook: "8.4.1 기본적인 결합 방법 — 결합을 위한 학습기(결합기)",
          slides: "기본적인 결합 방법 — 결합기를 사용하는 방법",
        }}
      >
        <h3 className="mb-1 text-base font-bold">기본 학습기의 결과를 결합하는 또 다른 학습기 — 결합기</h3>
        <p className="mb-3 text-sm text-gray-500">
          평균이나 투표 대신 다른 하나의 학습기(결합기)를 사용해서 기본 학습기의 결과를 결합.
          기본 학습기의 학습을 완료한 후, 기본 학습기의 학습에 사용되지 않은 새로운 학습 데이터
          집합을 준비. 새로운 학습 데이터 (xᵢ, yᵢ)에 대해 기본 학습기 hⱼ의 출력값을 zᵢⱼ라 하면
          결합기의 학습 데이터는 ((zᵢ₁, zᵢ₂, …, zᵢ_M), yᵢ).
        </p>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 flex gap-2">
            {[
              [false, "새로운 데이터 사용"],
              [true, "기본 학습기의 학습 데이터 재사용"],
            ].map(([k, label]) => (
              <button
                key={String(k)}
                onClick={() => setReuse(k as boolean)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  reuse === k
                    ? k
                      ? "bg-red-500 text-white"
                      : "bg-amber-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {label as string}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-xs">
              <thead>
                <tr className="text-gray-500">
                  <th className="border-b border-gray-200 p-1.5 text-left dark:border-gray-700">새 데이터</th>
                  <th className="border-b border-gray-200 p-1.5 dark:border-gray-700">zᵢ₁ = h₁(xᵢ)</th>
                  <th className="border-b border-gray-200 p-1.5 dark:border-gray-700">zᵢ₂ = h₂(xᵢ)</th>
                  <th className="border-b border-gray-200 p-1.5 dark:border-gray-700">zᵢ₃ = h₃(xᵢ)</th>
                  <th className="border-b border-gray-200 p-1.5 dark:border-gray-700">yᵢ</th>
                  <th className="border-b border-gray-200 p-1.5 text-left dark:border-gray-700">결합기의 학습 데이터</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {NEW_DATA.map((d) => (
                  <tr key={d.x}>
                    <td className="border-b border-gray-100 p-1.5 dark:border-gray-800">{d.x}</td>
                    {d.z.map((z, k) => (
                      <td key={k} className="border-b border-gray-100 p-1.5 text-center dark:border-gray-800">
                        {z > 0 ? "+1" : "−1"}
                      </td>
                    ))}
                    <td className="border-b border-gray-100 p-1.5 text-center dark:border-gray-800">{d.y > 0 ? "+1" : "−1"}</td>
                    <td className="border-b border-gray-100 p-1.5 text-amber-700 dark:border-gray-800 dark:text-amber-300">
                      (({d.z.map((z) => (z > 0 ? "+1" : "−1")).join(", ")}), {d.y > 0 ? "+1" : "−1"})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p
            className={`mt-3 rounded-lg p-3 text-xs leading-relaxed ${
              reuse
                ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"
                : "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
            }`}
          >
            {reuse
              ? "기본 학습기의 학습 데이터를 결합기의 학습 데이터로 사용하면 과다적합의 위험이 커짐 — 기본 학습기가 이미 맞춰 둔 데이터라 출력 zᵢⱼ가 실제보다 좋아 보이기 때문."
              : "기본 학습기의 입력 xᵢ 대신 기본 학습기들의 출력 (zᵢ₁, …, zᵢ_M)이 결합기의 입력이 되고, 목표 출력 yᵢ는 그대로 사용."}
          </p>
        </div>
      </Sourced>
    </section>
  );
}
