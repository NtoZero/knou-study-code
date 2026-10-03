"use client";

import { useMemo, useState } from "react";
import { Shuffle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { fmt, makeScale, pathOf, tanhAct, type Frame } from "./nn";

interface Weights {
  v11: number;
  v21: number;
  w11: number;
  w12: number;
  w01: number;
  w02: number;
  v01: number;
}

/** 교재 [그림 11-11]의 네 가지 — 가중치를 (식 11-6)에 그대로 넣은 값 */
const PRESETS: { key: string; label: string; expr: string; w: Weights }[] = [
  {
    key: "a",
    label: "(a)",
    expr: "f(x) = tanh(x + 1) − tanh(x − 1) + 1",
    w: { v11: 1, w11: 1, w01: 1, v21: -1, w12: 1, w02: -1, v01: 1 },
  },
  {
    key: "b",
    label: "(b)",
    expr: "f(x) = tanh(x + 1) + tanh(x − 1) + 1",
    w: { v11: 1, w11: 1, w01: 1, v21: 1, w12: 1, w02: -1, v01: 1 },
  },
  {
    key: "c",
    label: "(c)",
    expr: "f(x) = tanh(20x + 1) + tanh(−20x + 1)",
    w: { v11: 1, w11: 20, w01: 1, v21: 1, w12: -20, w02: 1, v01: 0 },
  },
  {
    key: "d",
    label: "(d)",
    expr: "f(x) = tanh(20x + 1) + tanh(20x − 1)",
    w: { v11: 1, w11: 20, w01: 1, v21: 1, w12: 20, w02: -1, v01: 0 },
  },
];

const F: Frame = { xMin: -3, xMax: 3, yMin: -2.6, yMax: 3.2, width: 320, height: 220, pad: 26 };
const s = makeScale(F);

/** 은닉 뉴런이 여러 개일 때 쓸 결정적 난수 — 같은 seed면 늘 같은 곡선 */
function lcg(seed: number) {
  let v = seed >>> 0;
  return () => {
    v = (v * 1664525 + 1013904223) >>> 0;
    return v / 4294967296;
  };
}

/**
 * 은닉 뉴런 count개의 가중치를 결정적으로 뽑은 뒤,
 * 합한 곡선의 최댓값이 그림 범위에 들어오도록 vⱼ를 같은 비율로 줄인다.
 */
function manyNeuronWeights(count: number, seed: number) {
  const r = lcg(seed * 7919 + 13);
  const base = Array.from({ length: count }, () => ({
    w: (r() * 2 - 1) * 6,
    b: (r() * 2 - 1) * 4,
    v: (r() * 2 - 1) * 2,
  }));
  let peak = 0;
  for (let i = 0; i <= 200; i += 1) {
    const x = -5 + (10 * i) / 200;
    const y = base.reduce((acc, n) => acc + n.v * tanhAct(n.w * x + n.b), 0);
    peak = Math.max(peak, Math.abs(y));
  }
  const k = peak > 2.4 ? 2.4 / peak : 1;
  return base.map((n) => ({ ...n, v: n.v * k }));
}

const F2: Frame = { xMin: -5, xMax: 5, yMin: -3, yMax: 3, width: 300, height: 170, pad: 22 };
const s2 = makeScale(F2);

export default function MlpExpressivity() {
  const [w, setW] = useState<Weights>(PRESETS[0].w);
  const [preset, setPreset] = useState<string | null>("a");

  const [singleW, setSingleW] = useState(1);
  const [manyCount, setManyCount] = useState(6);
  const [seed, setSeed] = useState(3);

  const f = (x: number) =>
    w.v11 * tanhAct(w.w11 * x + w.w01) + w.v21 * tanhAct(w.w12 * x + w.w02) + w.v01;

  const set = (k: keyof Weights, v: number) => {
    setW((prev) => ({ ...prev, [k]: v }));
    setPreset(null);
  };

  const manyW = useMemo(() => manyNeuronWeights(manyCount, seed), [manyCount, seed]);
  const fMany = (x: number) => manyW.reduce((acc, n) => acc + n.v * tanhAct(n.w * x + n.b), 0);
  const fZero = (x: number) => tanhAct(singleW * x);
  const fTwo = (x: number) => 1.6 * tanhAct(2 * x + 1.5) - 1.6 * tanhAct(2 * x - 1.5);

  const axes = (fr: Frame, sc: ReturnType<typeof makeScale>, ticks: number[]) => (
    <g>
      <line x1={sc.sx(fr.xMin)} y1={sc.sy(0)} x2={sc.sx(fr.xMax)} y2={sc.sy(0)} stroke="#cbd5e1" />
      <line x1={sc.sx(0)} y1={sc.sy(fr.yMin)} x2={sc.sx(0)} y2={sc.sy(fr.yMax)} stroke="#cbd5e1" />
      {ticks.map((v) => (
        <g key={v}>
          <text x={sc.sx(v)} y={sc.sy(0) + 11} fontSize="8" textAnchor="middle" fill="#cbd5e1">
            {v}
          </text>
        </g>
      ))}
      {[-2, -1, 1, 2].map((v) =>
        v >= fr.yMin && v <= fr.yMax ? (
          <text key={`y${v}`} x={sc.sx(0) - 5} y={sc.sy(v) + 3} fontSize="8" textAnchor="end" fill="#cbd5e1">
            {v < 0 ? `−${-v}` : v}
          </text>
        ) : null,
      )}
    </g>
  );

  return (
    <section id="expressivity" className="scroll-mt-32">
      <SectionTitle
        title="다층 퍼셉트론의 표현 능력"
        subtitle="가중치만 바꿔도 함수의 모양이 어디까지 달라지는지 — 모든 곡선은 식에 값을 넣어 직접 계산"
      />

      <Sourced
        refs={{
          textbook: "11.2.2 다층 퍼셉트론 (식 11-6, 그림 11-11)",
          slides: "MLP의 표현 능력",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">입력 1개 · 은닉 뉴런 2개 · 출력 1개</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            은닉 뉴런의 활성화 함수를 하이퍼탄젠트 함수로 두고 출력 뉴런의 활성화 함수를 선형함수로 두면,
            이 다층 퍼셉트론에 의해 정의되는 함수는 다음과 같이 쓸 수 있음.
          </p>
          <div className="mt-3 overflow-x-auto rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
            <p className="min-w-[380px] font-mono text-sm leading-7">
              y = v₁₁z₁ + v₂₁z₂ + v₀₁
            </p>
            <p className="min-w-[380px] font-mono text-sm leading-7">
              {"  "}= v₁₁tanh(w₁₁x₁ + w₀₁) + v₂₁tanh(w₁₂x₁ + w₀₂) + v₀₁
              <span className="ml-2 text-xs text-gray-500">(식 11-6)</span>
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => {
                  setW(p.w);
                  setPreset(p.key);
                }}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  preset === p.key
                    ? "border-fuchsia-500 bg-fuchsia-500 text-white"
                    : "border-gray-200 bg-white text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-900"
                }`}
              >
                {p.label}
              </button>
            ))}
            {preset === null && (
              <span className="self-center text-[11px] text-gray-400">가중치를 직접 바꾼 상태</span>
            )}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
            <div className="overflow-x-auto">
              <svg viewBox={`0 0 ${F.width} ${F.height}`} className="w-full min-w-[300px] rounded-lg border border-gray-100 dark:border-gray-800">
                <rect x={0} y={0} width={F.width} height={F.height} fill="#ffffff" />
                {[-2, -1, 1, 2, 3].map((v) => (
                  <line key={v} x1={s.sx(F.xMin)} y1={s.sy(v)} x2={s.sx(F.xMax)} y2={s.sy(v)} stroke="#f8fafc" />
                ))}
                {axes(F, s, [-3, -2, -1, 1, 2, 3])}
                {/* 두 은닉 뉴런의 기여 */}
                <path
                  d={pathOf((x) => w.v11 * tanhAct(w.w11 * x + w.w01), F, 500, 99)}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                  opacity={0.7}
                />
                <path
                  d={pathOf((x) => w.v21 * tanhAct(w.w12 * x + w.w02), F, 500, 99)}
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                  opacity={0.7}
                />
                <path d={pathOf(f, F, 700, 99)} fill="none" stroke="#a21caf" strokeWidth="2.4" />
                <text x={F.width - 6} y={16} fontSize="8" textAnchor="end" fill="#a21caf">
                  y (합)
                </text>
                <text x={F.width - 6} y={27} fontSize="8" textAnchor="end" fill="#2563eb">
                  v₁₁z₁
                </text>
                <text x={F.width - 6} y={38} fontSize="8" textAnchor="end" fill="#16a34a">
                  v₂₁z₂
                </text>
              </svg>
              {preset && (
                <p className="mt-1 text-center font-mono text-[11px] text-gray-600 dark:text-gray-400">
                  {PRESETS.find((p) => p.key === preset)!.expr}
                </p>
              )}
            </div>

            <div>
              <div className="space-y-1.5">
                {(
                  [
                    ["w11", "w₁₁", -20, 20, 0.5],
                    ["w01", "w₀₁", -3, 3, 0.1],
                    ["v11", "v₁₁", -2, 2, 0.1],
                    ["w12", "w₁₂", -20, 20, 0.5],
                    ["w02", "w₀₂", -3, 3, 0.1],
                    ["v21", "v₂₁", -2, 2, 0.1],
                    ["v01", "v₀₁", -2, 2, 0.1],
                  ] as [keyof Weights, string, number, number, number][]
                ).map(([k, label, min, max, stepv]) => (
                  <label key={k} className="flex items-center gap-2 text-xs">
                    <span className="w-8 shrink-0 font-mono font-bold">{label}</span>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={stepv}
                      value={w[k]}
                      onChange={(e) => set(k, Number(e.target.value))}
                      className="min-w-0 flex-1 accent-fuchsia-600"
                    />
                    <span className="w-10 shrink-0 text-right font-mono">{fmt(w[k], 1)}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3 overflow-x-auto rounded-lg bg-gray-50 p-3 font-mono text-[11px] leading-6 dark:bg-gray-800/60">
                <p className="min-w-[300px]">
                  y = {fmt(w.v11, 1)}·tanh({fmt(w.w11, 1)}x {w.w01 >= 0 ? "+" : "−"} {fmt(Math.abs(w.w01), 1)}){" "}
                  {w.v21 >= 0 ? "+" : "−"} {fmt(Math.abs(w.v21), 1)}·tanh({fmt(w.w12, 1)}x{" "}
                  {w.w02 >= 0 ? "+" : "−"} {fmt(Math.abs(w.w02), 1)}) {w.v01 >= 0 ? "+" : "−"}{" "}
                  {fmt(Math.abs(w.v01), 1)}
                </p>
                <p className="min-w-[300px] text-gray-500">
                  y(0) = {fmt(f(0), 3)} · y(1) = {fmt(f(1), 3)} · y(−1) = {fmt(f(-1), 3)}
                </p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                가중치에 따라 매우 다양한 형태의 함수가 다층 퍼셉트론에 의해 표현될 수 있음. 이론적으로는{" "}
                <strong>하나의 은닉층을 가지는 다층 퍼셉트론으로 어떠한 연속 함수도 원하는 오차만큼 가깝게
                근사할 수 있음이 증명</strong>되었음. 따라서 다층 퍼셉트론을 이용하면 복잡한 비선형
                결정경계를 가진 분류 문제도 성공적으로 해결할 수 있음.
              </p>
              <p className="mt-2 rounded-lg bg-slate-100 p-2.5 text-[11px] leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                (c)는 교재 본문에 f(x) = tanh(x + 1) + tanh(−20x + 1)로 적혀 있으나, 같은 자리에 실린
                그래프의 모양(0 근처의 좁은 봉우리, 양쪽 끝에서 0)과 맞는 것은 강의록 표기인 tanh(20x + 1) +
                tanh(−20x + 1). 여기서는 그래프와 맞는 쪽을 썼으며, 첫 항의 계수 w₁₁을 1로 내려 보면 두 식의
                차이를 직접 확인할 수 있음.
              </p>
            </div>
          </div>
        </div>
      </Sourced>

      {/* ── 은닉 뉴런 수에 따른 표현 능력 ── */}
      <Sourced
        refs={{
          textbook: "11.2.2 다층 퍼셉트론 — 표현 능력",
          slides: "MLP의 표현 능력 — 입력 1개 · 출력 1개",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">은닉 뉴런 수에 따라 만들 수 있는 함수</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            하나의 은닉층(충분한 은닉 뉴런)을 가진 다층 퍼셉트론은 임의의 정확도로 모든 연속 함수의 근사
            표현이 가능함. → 복잡한 비선형 결정경계도 표현 → 복잡한 분류 문제도 성공적으로 해결 가능 →{" "}
            <strong>표현 능력 자체는 더 이상 문제가 되지 않음.</strong>
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* 0개 */}
            <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
              <p className="text-sm font-bold">0개 은닉 뉴런</p>
              <p className="mt-0.5 font-mono text-[11px] text-gray-500">x → w → y</p>
              <div className="mt-2 overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800">
                <svg viewBox={`0 0 ${F2.width} ${F2.height}`} className="w-full">
                  <rect x={0} y={0} width={F2.width} height={F2.height} fill="#ffffff" />
                  {axes(F2, s2, [-4, -2, 2, 4])}
                  {[0.3, 1, 8].map((wv, i) => (
                    <path
                      key={wv}
                      d={pathOf((x) => tanhAct(wv * x), F2, 500, 99)}
                      fill="none"
                      stroke={["#dc2626", "#2563eb", "#16a34a"][i]}
                      strokeWidth="1.2"
                      opacity={0.45}
                    />
                  ))}
                  <path d={pathOf(fZero, F2, 600, 99)} fill="none" stroke="#a21caf" strokeWidth="2.4" />
                </svg>
              </div>
              <label className="mt-2 flex items-center gap-2 text-xs">
                <span className="w-5 shrink-0 font-mono font-bold">w</span>
                <input
                  type="range"
                  min={0.1}
                  max={10}
                  step={0.1}
                  value={singleW}
                  onChange={(e) => setSingleW(Number(e.target.value))}
                  className="min-w-0 flex-1 accent-fuchsia-600"
                />
                <span className="w-9 shrink-0 text-right font-mono">{fmt(singleW, 1)}</span>
              </label>
              <p className="mt-1.5 text-[11px] leading-relaxed text-gray-600 dark:text-gray-400">
                y = tanh(wx) 하나뿐. w를 작게 하면 0 근처에서 거의 직선, 크게 하면 계단에 가까워짐. 모양의
                종류는 이 하나로 고정.
              </p>
            </div>

            {/* 2개 */}
            <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
              <p className="text-sm font-bold">2개 은닉 뉴런</p>
              <p className="mt-0.5 font-mono text-[11px] text-gray-500">x → w₁, w₂ → v₁, v₂ → y</p>
              <div className="mt-2 overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800">
                <svg viewBox={`0 0 ${F2.width} ${F2.height}`} className="w-full">
                  <rect x={0} y={0} width={F2.width} height={F2.height} fill="#ffffff" />
                  {axes(F2, s2, [-4, -2, 2, 4])}
                  <path
                    d={pathOf((x) => 1.6 * tanhAct(2 * x + 1.5), F2, 400, 99)}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="1.1"
                    strokeDasharray="3 2"
                    opacity={0.6}
                  />
                  <path
                    d={pathOf((x) => -1.6 * tanhAct(2 * x - 1.5), F2, 400, 99)}
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="1.1"
                    strokeDasharray="3 2"
                    opacity={0.6}
                  />
                  <path d={pathOf(fTwo, F2, 600, 99)} fill="none" stroke="#a21caf" strokeWidth="2.4" />
                </svg>
              </div>
              <p className="mt-2 font-mono text-[10px] leading-5 text-gray-500">
                y = 1.6·tanh(2x + 1.5) − 1.6·tanh(2x − 1.5)
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-gray-600 dark:text-gray-400">
                S자 곡선 두 개를 더하자 봉우리 하나가 생김. 뉴런 하나로는 만들 수 없던 모양.
              </p>
            </div>

            {/* 많은 뉴런 */}
            <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold">많은 은닉 뉴런</p>
                <button
                  type="button"
                  onClick={() => setSeed((v) => v + 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 text-[11px] text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:hover:text-gray-200"
                >
                  <Shuffle size={11} />
                  다른 가중치
                </button>
              </div>
              <p className="mt-0.5 font-mono text-[11px] text-gray-500">y = Σⱼ vⱼ·tanh(wⱼx + bⱼ)</p>
              <div className="mt-2 overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800">
                <svg viewBox={`0 0 ${F2.width} ${F2.height}`} className="w-full">
                  <rect x={0} y={0} width={F2.width} height={F2.height} fill="#ffffff" />
                  {axes(F2, s2, [-4, -2, 2, 4])}
                  {manyW.map((n, i) => (
                    <path
                      key={i}
                      d={pathOf((x) => n.v * tanhAct(n.w * x + n.b), F2, 300, 99)}
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                  ))}
                  <path d={pathOf(fMany, F2, 700, 99)} fill="none" stroke="#a21caf" strokeWidth="2.4" />
                </svg>
              </div>
              <label className="mt-2 flex items-center gap-2 text-xs">
                <span className="w-12 shrink-0 font-semibold">뉴런 수</span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={manyCount}
                  onChange={(e) => setManyCount(Number(e.target.value))}
                  className="min-w-0 flex-1 accent-fuchsia-600"
                />
                <span className="w-6 shrink-0 text-right font-mono">{manyCount}</span>
              </label>
              <p className="mt-1.5 text-[11px] leading-relaxed text-gray-600 dark:text-gray-400">
                회색 선 하나하나가 은닉 뉴런 한 개의 기여. 뉴런을 늘릴수록 꺾이는 곳이 늘어나 더 복잡한
                모양을 만들 수 있음.
              </p>
            </div>
          </div>

          <p className="mt-4 rounded-lg bg-fuchsia-50 p-3 text-xs leading-relaxed text-fuchsia-900 dark:bg-fuchsia-950/40 dark:text-fuchsia-100">
            표현할 수 있다는 것과 원하는 것을 찾아내는 것은 다른 문제. 무수히 많은 함수 중 주어진 문제에
            맞는 최적의 함수 형태를 결정하는 가중치 파라미터는 사용자가 일일이 정해 줄 필요 없이{" "}
            <strong>데이터를 이용한 학습을 통해 스스로 찾을 수 있고, 이것이 바로 신경망의 학습 능력</strong>.
            그 학습 방법이 10강의 오류 역전파 학습 알고리즘.
          </p>
        </div>
      </Sourced>
    </section>
  );
}
