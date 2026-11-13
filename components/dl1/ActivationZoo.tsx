"use client";

import { useState } from "react";
import { AlertTriangle, PencilLine } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Formula, Hint, Slider, Scroller, Chip, fmt } from "@/components/dlShared/ui";

const r2 = (v: number) => Math.round(v * 100) / 100;

/** erf 근사 (Abramowitz & Stegun 7.1.26) — 그림을 그리기 위한 수치 계산용 */
function erf(u: number): number {
  const s = u < 0 ? -1 : 1;
  const a = Math.abs(u);
  const t = 1 / (1 + 0.3275911 * a);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-a * a);
  return s * y;
}

const logistic = (u: number) => 1 / (1 + Math.exp(-u));
/** 표준 정규분포의 누적분포함수 */
const Phi = (u: number) => 0.5 * (1 + erf(u / Math.SQRT2));

type Key = "step" | "logistic" | "tanh" | "erf" | "relu" | "leaky" | "prelu" | "gelu" | "swish";

interface Def {
  key: Key;
  name: string;
  group: "계단 함수" | "시그모이드 함수" | "ReLU" | "ReLU의 변형";
  formula: string;
  range: string;
  diff: string;
  note: string;
  warn?: string;
  yMin: number;
  yMax: number;
  f: (u: number, a: number, beta: number) => number;
}

const defs: Def[] = [
  {
    key: "step",
    name: "단위 계단 함수",
    group: "계단 함수",
    formula: "φ_step(u) = 1 (u ≥ 0), 0 (u < 0)",
    range: "0 또는 1",
    diff: "u = 0 에서 불연속 — 미분을 구할 수 없음",
    note: "정의역을 유한한 개수의 구간으로 나누어서 각 구간에서 상수인 함수가 계단 함수이고, 그 가운데 단위 계단 함수(unit step function, Heaviside step function)가 로젠블랫의 단층 퍼셉트론이 쓴 활성함수.",
    warn: "대부분의 구간에서 미분이 0이라 경사 하강법에는 쓰기 어렵다고 강의에서 짚음",
    yMin: -1.2,
    yMax: 1.4,
    f: (u) => (u >= 0 ? 1 : 0),
  },
  {
    key: "logistic",
    name: "로지스틱(logistic)",
    group: "시그모이드 함수",
    formula: "φ_Logistic(u) = 1 / (1 + e^(−u))",
    range: "0 ~ 1",
    diff: "모든 u 에 대해 미분 가능",
    note: "‘S’자 형태의 곡선 함수. 0과 1 사이의 값을 내므로 강의에서는 확률의 개념으로 쓰인다고 설명했고, 많은 딥러닝 API가 이 함수를 그냥 ‘시그모이드’라고 부른다고 덧붙임.",
    warn: "‘경사 소멸’ 문제의 원인이 됨",
    yMin: -1.2,
    yMax: 1.4,
    f: (u) => logistic(u),
  },
  {
    key: "tanh",
    name: "쌍곡탄젠트(tanh)",
    group: "시그모이드 함수",
    formula: "φ_tanh(u) = (eᵘ − e^(−u)) / (eᵘ + e^(−u))",
    range: "−1 ~ 1",
    diff: "모든 u 에 대해 미분 가능",
    note: "로지스틱과 곡선 모양은 비슷하되 값의 범위가 −1부터 1까지인 시그모이드 함수.",
    warn: "‘경사 소멸’ 문제의 원인이 됨",
    yMin: -1.2,
    yMax: 1.4,
    f: (u) => Math.tanh(u),
  },
  {
    key: "erf",
    name: "오차 함수(erf)",
    group: "시그모이드 함수",
    formula: "φ_erf(u) = (2/√π) ∫₀ᵘ e^(−t²) dt",
    range: "−1 ~ 1",
    diff: "모든 u 에 대해 미분 가능",
    note: "역시 ‘S’자 곡선을 그리는 시그모이드 계열 함수.",
    warn: "‘경사 소멸’ 문제의 원인이 됨",
    yMin: -1.2,
    yMax: 1.4,
    f: (u) => erf(u),
  },
  {
    key: "relu",
    name: "ReLU",
    group: "ReLU",
    formula: "φ_ReLU(u) = 0 (u < 0), u (u ≥ 0)  또는  max(0, u)",
    range: "0 이상",
    diff: "u = 0 에서 미분 불가",
    note: "심층망에서 경사 소멸 문제를 개선하기 위해 시그모이드의 대안으로 활용되는 활성함수.",
    warn: "‘Dying ReLU’ 문제 — u < 0 구간에서 출력도 미분도 0이라 뉴런이 죽은 것처럼 동작",
    yMin: -1.5,
    yMax: 6.2,
    f: (u) => Math.max(0, u),
  },
  {
    key: "leaky",
    name: "Leaky ReLU",
    group: "ReLU의 변형",
    formula: "φ_LeakyReLU(u) = max(αu, u)",
    range: "실수 전체",
    diff: "u = 0 에서 미분 불가",
    note: "α 는 1보다 작은 양수(예: 0.1). u < 0 에서도 기울기를 조금 남겨 두어 뉴런이 죽는 것을 막음.",
    yMin: -1.5,
    yMax: 6.2,
    f: (u, a) => Math.max(a * u, u),
  },
  {
    key: "prelu",
    name: "PReLU(parametric ReLU)",
    group: "ReLU의 변형",
    formula: "φ_PReLU(u) = max(αu, u)",
    range: "실수 전체",
    diff: "u = 0 에서 미분 불가",
    note: "식은 Leaky ReLU와 같지만 α 가 고정값이 아니라 학습에 의해 결정됨.",
    yMin: -1.5,
    yMax: 6.2,
    f: (u, a) => Math.max(a * u, u),
  },
  {
    key: "gelu",
    name: "GELU(Gaussian Error Linear Unit)",
    group: "ReLU의 변형",
    formula: "φ_GELU(u) = u · Φ(u)",
    range: "실수 전체",
    diff: "전 구간에서 미분 가능",
    note: "Φ(u) 는 표준 정규분포의 누적분포함수. u = 0 부근에서도 꺾이지 않고 완만하게 이어짐.",
    yMin: -1.5,
    yMax: 6.2,
    f: (u) => u * Phi(u),
  },
  {
    key: "swish",
    name: "Swish",
    group: "ReLU의 변형",
    formula: "φ_swish(u) = u · φ_Logistic(βu)",
    range: "실수 전체",
    diff: "전 구간에서 미분 가능",
    note: "β = 1 인 경우를 SiLU(Sigmoid LU)라고 부름.",
    yMin: -1.5,
    yMax: 6.2,
    f: (u, _a, beta) => u * logistic(beta * u),
  },
];

const W = 340;
const H = 210;
const PAD = { l: 34, r: 10, t: 10, b: 26 };
const IW = W - PAD.l - PAD.r;
const IH = H - PAD.t - PAD.b;
const U_MIN = -6;
const U_MAX = 6;

function sx(u: number) {
  return r2(PAD.l + ((u - U_MIN) / (U_MAX - U_MIN)) * IW);
}

export default function ActivationZoo() {
  const [key, setKey] = useState<Key>("step");
  const [alpha, setAlpha] = useState(0.1);
  const [beta, setBeta] = useState(1);
  const [compare, setCompare] = useState(true);

  const def = defs.find((d) => d.key === key)!;
  const sy = (v: number) => r2(PAD.t + IH - ((v - def.yMin) / (def.yMax - def.yMin)) * IH);

  const path = (f: (u: number) => number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 240; i += 1) {
      const u = U_MIN + ((U_MAX - U_MIN) * i) / 240;
      const v = f(u);
      if (!Number.isFinite(v)) continue;
      const cy = Math.max(PAD.t - 4, Math.min(PAD.t + IH + 4, sy(v)));
      pts.push(`${sx(u)},${r2(cy)}`);
    }
    return pts.join(" ");
  };

  const curve = path((u) => def.f(u, alpha, beta));
  const reference = def.group === "ReLU의 변형" ? path((u) => Math.max(0, u)) : null;

  const yTicks = def.yMax > 3 ? [0, 2, 4, 6] : [-1, -0.5, 0, 0.5, 1];

  return (
    <section id="activation-functions" className="scroll-mt-32">
      <SectionTitle
        title="활성함수의 종류"
        subtitle="함수를 눌러 가며 모양·출력 범위·미분 가능 여부를 비교해 봅니다"
      />

      <Sourced
        refs={{
          slides: "2. 활성함수의 종류 — 계단 함수 / 시그모이드 함수 / ReLU / ReLU의 변형",
          lecture: "계단 함수는 경사 하강법에 적절치 않고, 시그모이드는 경사 소멸의 원인이 되어 ReLU로 넘어간다는 흐름",
        }}
      >
        <Card>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {defs.map((d) => (
              <Chip key={d.key} active={key === d.key} onClick={() => setKey(d.key)}>
                {d.name}
              </Chip>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <Scroller>
              <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-[340px] min-w-[300px]">
                {yTicks.map((t) => (
                  <g key={t}>
                    <line
                      x1={PAD.l}
                      y1={sy(t)}
                      x2={W - PAD.r}
                      y2={sy(t)}
                      className="stroke-gray-200 dark:stroke-gray-700"
                      strokeWidth={0.5}
                    />
                    <text x={PAD.l - 5} y={sy(t) + 3} textAnchor="end" className="fill-gray-400 text-[8px]">
                      {t}
                    </text>
                  </g>
                ))}
                {[-6, -4, -2, 0, 2, 4, 6].map((t) => (
                  <g key={`u${t}`}>
                    <line
                      x1={sx(t)}
                      y1={PAD.t}
                      x2={sx(t)}
                      y2={PAD.t + IH}
                      className="stroke-gray-200 dark:stroke-gray-700"
                      strokeWidth={0.5}
                    />
                    <text x={sx(t)} y={PAD.t + IH + 12} textAnchor="middle" className="fill-gray-400 text-[8px]">
                      {t}
                    </text>
                  </g>
                ))}
                <line
                  x1={sx(0)}
                  y1={PAD.t}
                  x2={sx(0)}
                  y2={PAD.t + IH}
                  className="stroke-gray-400"
                  strokeWidth={1}
                />
                {reference && compare && (
                  <polyline points={reference} fill="none" stroke="#2563eb" strokeWidth={1.4} strokeDasharray="3 3" />
                )}
                <polyline points={curve} fill="none" stroke="#e11d48" strokeWidth={2.2} />
                <rect
                  x={PAD.l}
                  y={PAD.t}
                  width={IW}
                  height={IH}
                  fill="none"
                  className="stroke-gray-300 dark:stroke-gray-600"
                />
                <text x={PAD.l + IW / 2} y={H - 2} textAnchor="middle" className="fill-gray-500 text-[9px]">
                  u
                </text>
              </svg>
              {reference && (
                <label className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-500">
                  <input
                    type="checkbox"
                    checked={compare}
                    onChange={(e) => setCompare(e.target.checked)}
                    className="accent-teal-600"
                  />
                  ReLU(파란 점선)와 겹쳐 보기
                </label>
              )}
            </Scroller>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-gray-400">{def.group}</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{def.name}</p>
              <div className="mt-2">
                <Formula>{def.formula}</Formula>
              </div>

              <dl className="mt-3 space-y-1.5 text-[12.5px] leading-6">
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 font-semibold text-gray-500">출력 범위</dt>
                  <dd className="text-gray-700 dark:text-gray-200">{def.range}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 font-semibold text-gray-500">미분</dt>
                  <dd className="text-gray-700 dark:text-gray-200">{def.diff}</dd>
                </div>
              </dl>

              <p className="mt-2 text-[12.5px] leading-6 text-gray-600 dark:text-gray-300">{def.note}</p>

              {def.warn && (
                <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-rose-50 p-2.5 text-[12px] leading-6 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200">
                  <AlertTriangle size={13} className="mt-1 shrink-0" />
                  {def.warn}
                </p>
              )}

              {(key === "leaky" || key === "prelu") && (
                <div className="mt-3">
                  <Slider
                    label={`α (${key === "prelu" ? "학습으로 결정되는 값 — 여기서는 직접 움직여 봄" : "1보다 작은 양수"})`}
                    value={alpha}
                    min={0}
                    max={0.5}
                    step={0.01}
                    onChange={(v) => setAlpha(r2(v))}
                    display={fmt(alpha, 2)}
                  />
                </div>
              )}
              {key === "swish" && (
                <div className="mt-3">
                  <Slider
                    label="β"
                    value={beta}
                    min={0.2}
                    max={3}
                    step={0.1}
                    onChange={(v) => setBeta(r2(v))}
                    display={fmt(beta, 1)}
                  />
                  {Math.abs(beta - 1) < 1e-9 && (
                    <p className="mt-1 flex items-center gap-1.5 text-[11px] text-teal-700 dark:text-teal-300">
                      <PencilLine size={11} />β = 1 이므로 SiLU(Sigmoid LU)
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <Hint>
            곡선은 −6 ≤ u ≤ 6 구간을 이 페이지에서 계산해 그린 것입니다. 오차 함수와 GELU의 Φ(u)는 수치
            근사로 그렸으므로 모양을 보는 용도로만 쓰세요.
          </Hint>

          <Scroller>
            <table className="mt-3 w-full min-w-[520px] border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                  <th className="py-1.5 pr-2 font-semibold">함수</th>
                  <th className="py-1.5 pr-2 font-semibold">출력 범위</th>
                  <th className="py-1.5 pr-2 font-semibold">미분</th>
                  <th className="py-1.5 font-semibold">짚어 둘 점</th>
                </tr>
              </thead>
              <tbody>
                {defs.map((d) => (
                  <tr
                    key={d.key}
                    onClick={() => setKey(d.key)}
                    className={`cursor-pointer border-b border-gray-100 align-top dark:border-gray-800 ${
                      d.key === key ? "bg-teal-50 dark:bg-teal-950/40" : ""
                    }`}
                  >
                    <td className="py-1.5 pr-2 font-semibold text-gray-700 dark:text-gray-200">{d.name}</td>
                    <td className="py-1.5 pr-2 text-gray-600 dark:text-gray-300">{d.range}</td>
                    <td className="py-1.5 pr-2 text-gray-600 dark:text-gray-300">{d.diff}</td>
                    <td className="py-1.5 text-gray-600 dark:text-gray-300">{d.warn ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Scroller>
        </Card>
      </Sourced>
    </section>
  );
}
