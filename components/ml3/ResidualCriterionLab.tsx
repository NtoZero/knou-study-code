"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

type Pt = { x: number; y: number };

/** 잔차 합의 상쇄를 보이기 위해 직선 위에 정확히 놓인 데이터 */
const DATA: Pt[] = [
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 3, y: 4 },
  { x: 4, y: 5 },
  { x: 5, y: 6 },
];

type Preset = { label: string; w1: number; w0: number; kind: "good" | "bad" };

const PRESETS: Preset[] = [
  { label: "좋은 직선", w1: 1, w0: 1, kind: "good" },
  { label: "상쇄되는 나쁜 직선 ①", w1: 0.5, w0: 2.5, kind: "bad" },
  { label: "상쇄되는 나쁜 직선 ②", w1: 1.5, w0: -0.5, kind: "bad" },
];

const W = 340;
const H = 260;
const PAD = 38;
const XMAX = 6;
const YMAX = 8;

const sx = (x: number) => PAD + (x / XMAX) * (W - PAD - 16);
const sy = (y: number) => H - PAD - (y / YMAX) * (H - PAD - 18);

function stats(w1: number, w0: number) {
  const residuals = DATA.map((p) => p.y - (w1 * p.x + w0));
  const sum = residuals.reduce((s, e) => s + e, 0);
  const sumSq = residuals.reduce((s, e) => s + e * e, 0);
  return { residuals, sum, sumSq };
}

export default function ResidualCriterionLab() {
  const [w1, setW1] = useState(0.5);
  const [w0, setW0] = useState(2.5);
  const [showGhost, setShowGhost] = useState(true);

  const current = useMemo(() => stats(w1, w0), [w1, w0]);
  const best = useMemo(() => stats(1, 1), []);

  const sumNearZero = Math.abs(current.sum) < 1e-6;

  return (
    <section>
      <SectionTitle
        title="02. 좋은 선형회귀 모델의 기준 — 잔차"
        subtitle="잔차의 합은 왜 부적합하고 잔차의 제곱의 합은 왜 적합한가"
      />

      {/* 선형함수 정의 */}
      <div className="mb-8 rounded-xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-800 dark:bg-orange-950">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          데이터 집합 D = {"{"}(xᵢ, yᵢ){"}"}ᵢ₌₁,⋯,ₙ (xᵢ ∈ R, yᵢ ∈ R)에 대해 (x, y) 관계를 설명할 수 있는 선형함수를 찾는 것
        </p>
        <p className="mt-3 text-center font-mono text-xl font-bold text-orange-700 dark:text-orange-300">
          y = w₁x + w₀ + e
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ["w₁", "기울기", "입력 x 앞에 붙은 계수"],
            ["w₀", "절편", "x가 0일 때의 값"],
            ["e", "오차 또는 잔차 residual", "데이터가 직선에서 떨어진 정도"],
          ].map(([sym, name, desc]) => (
            <div key={sym} className="rounded-lg border border-orange-200 bg-white p-3 dark:border-orange-800 dark:bg-gray-900">
              <p className="font-mono text-lg font-bold text-orange-600 dark:text-orange-300">{sym}</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{name}</p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3 text-center font-mono text-sm dark:border-gray-700 dark:bg-gray-900">
          eᵢ = yᵢ − (w₁xᵢ + w₀)
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          w₁과 w₀ 두 개를 알면 1차식 직선의 방정식이 결정되므로, 이 두 값을 찾는 것이 목표.
          좋은 선형회귀 모델은 모든 데이터에 대한 잔차가 가능한 한 작은 모델.
        </p>
      </div>

      {/* 반례 랩 */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">
          잔차의 합 Σeᵢ 는 왜 부적합한 기준인가 — 반례 실험
        </h3>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          아래 5개 데이터는 직선 y = x + 1 위에 정확히 놓여 있음. 직선을 움직이며 Σeᵢ 와 Σeᵢ² 가 각각 어떻게 반응하는지 비교.
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setW1(p.w1);
                setW0(p.w0);
              }}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                w1 === p.w1 && w0 === p.w0
                  ? p.kind === "good"
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-rose-500 bg-rose-500 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setShowGhost((v) => !v)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {showGhost ? "기준 직선 숨기기" : "기준 직선 보기"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="잔차 시각화">
              <line x1={PAD} y1={H - PAD} x2={W - 10} y2={H - PAD} stroke="currentColor" className="text-gray-300 dark:text-gray-600" />
              <line x1={PAD} y1={14} x2={PAD} y2={H - PAD} stroke="currentColor" className="text-gray-300 dark:text-gray-600" />
              {[0, 2, 4, 6, 8].map((v) => (
                <text key={`y${v}`} x={PAD - 8} y={sy(v) + 4} fontSize="9" textAnchor="end" fill="currentColor" className="text-gray-400">
                  {v}
                </text>
              ))}
              {[1, 2, 3, 4, 5].map((v) => (
                <text key={`x${v}`} x={sx(v)} y={H - PAD + 14} fontSize="9" textAnchor="middle" fill="currentColor" className="text-gray-400">
                  {v}
                </text>
              ))}
              <text x={W - 16} y={H - PAD - 6} fontSize="10" fill="currentColor" className="text-gray-400">x</text>
              <text x={PAD + 6} y={20} fontSize="10" fill="currentColor" className="text-gray-400">y</text>

              {/* 기준(정답) 직선 */}
              {showGhost && (
                <line
                  x1={sx(0)}
                  y1={sy(1)}
                  x2={sx(XMAX)}
                  y2={sy(XMAX + 1)}
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                  opacity={0.8}
                />
              )}

              {/* 잔차 세로선 */}
              {DATA.map((p, i) => {
                const e = current.residuals[i];
                const color = e >= 0 ? "#ef4444" : "#3b82f6";
                return (
                  <g key={`res-${p.x}`}>
                    <line
                      x1={sx(p.x)}
                      y1={sy(p.y)}
                      x2={sx(p.x)}
                      y2={sy(w1 * p.x + w0)}
                      stroke={color}
                      strokeWidth="2.5"
                      opacity={0.75}
                    />
                    {Math.abs(e) > 0.05 && (
                      <text
                        x={sx(p.x) + 6}
                        y={(sy(p.y) + sy(w1 * p.x + w0)) / 2 + 3}
                        fontSize="9"
                        fill={color}
                        fontWeight="bold"
                      >
                        {e > 0 ? "+" : "−"}
                        {Math.abs(e).toFixed(1)}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* 현재 직선 */}
              <line
                x1={sx(0)}
                y1={sy(w0)}
                x2={sx(XMAX)}
                y2={sy(w1 * XMAX + w0)}
                stroke="#f97316"
                strokeWidth="2.5"
              />

              {DATA.map((p) => (
                <circle key={p.x} cx={sx(p.x)} cy={sy(p.y)} r="4.5" fill="#1f2937" className="dark:fill-gray-100" />
              ))}
            </svg>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-4 rounded bg-[#ef4444]" /> 잔차 (+)
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-4 rounded bg-[#3b82f6]" /> 잔차 (−)
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-0.5 w-4 bg-[#10b981]" /> 기준 직선 y = x + 1
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <label className="block">
                <span className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-300">
                  <span>w₁ (기울기)</span>
                  <span className="font-mono text-orange-600 dark:text-orange-300">{w1.toFixed(2)}</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={2}
                  step={0.05}
                  value={w1}
                  onChange={(e) => setW1(Number(e.target.value))}
                  className="mt-1 w-full accent-orange-500"
                />
              </label>
              <label className="block">
                <span className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-300">
                  <span>w₀ (절편)</span>
                  <span className="font-mono text-orange-600 dark:text-orange-300">{w0.toFixed(2)}</span>
                </span>
                <input
                  type="range"
                  min={-1}
                  max={4}
                  step={0.1}
                  value={w0}
                  onChange={(e) => setW0(Number(e.target.value))}
                  className="mt-1 w-full accent-orange-500"
                />
              </label>
              <p className="text-center font-mono text-xs text-gray-600 dark:text-gray-300">
                y = {w1.toFixed(2)}x + {w0.toFixed(2)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                className={`rounded-lg border p-3 text-center ${
                  sumNearZero
                    ? "border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950"
                    : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
                }`}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">잔차의 합</p>
                <p className="font-mono text-[11px] text-gray-400">Σeᵢ</p>
                <p className="mt-1 font-mono text-xl font-bold text-gray-800 dark:text-gray-100">
                  {current.sum.toFixed(3)}
                </p>
              </div>
              <div className="rounded-lg border border-orange-300 bg-orange-50 p-3 text-center dark:border-orange-700 dark:bg-orange-950">
                <p className="text-xs text-gray-500 dark:text-gray-400">잔차의 제곱의 합</p>
                <p className="font-mono text-[11px] text-gray-400">Σeᵢ²</p>
                <p className="mt-1 font-mono text-xl font-bold text-orange-700 dark:text-orange-300">
                  {current.sumSq.toFixed(3)}
                </p>
              </div>
            </div>

            {sumNearZero && current.sumSq > 1e-6 && (
              <div className="flex items-start gap-2 rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm dark:border-rose-700 dark:bg-rose-950">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-500" />
                <p className="text-gray-700 dark:text-gray-200">
                  한쪽은 음의 부호로, 다른 쪽은 양의 부호로 같은 크기의 차이를 가지므로 더하면 <strong>상쇄되어 잔차의 합이 0</strong>이 됨.
                  하지만 Σeᵢ² = {current.sumSq.toFixed(3)} 로 기준 직선(0.000)과 분명히 구별됨.
                </p>
              </div>
            )}
            {current.sumSq < 1e-6 && (
              <div className="flex items-start gap-2 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm dark:border-emerald-700 dark:bg-emerald-950">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                <p className="text-gray-700 dark:text-gray-200">
                  모든 잔차가 0인 최적 직선. 잔차의 제곱의 합 기준에서는 이 직선만이 최솟값을 가짐.
                </p>
              </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full min-w-[280px] text-xs">
                <thead className="bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-2 py-1.5 text-left font-medium">직선</th>
                    <th className="px-2 py-1.5 text-right font-medium">Σeᵢ</th>
                    <th className="px-2 py-1.5 text-right font-medium">Σeᵢ²</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr>
                    <td className="px-2 py-1.5 text-gray-700 dark:text-gray-200">기준 y = x + 1</td>
                    <td className="px-2 py-1.5 text-right font-mono">{best.sum.toFixed(3)}</td>
                    <td className="px-2 py-1.5 text-right font-mono">{best.sumSq.toFixed(3)}</td>
                  </tr>
                  <tr className="bg-orange-50 dark:bg-orange-950/40">
                    <td className="px-2 py-1.5 font-medium text-orange-700 dark:text-orange-300">
                      현재 y = {w1.toFixed(2)}x + {w0.toFixed(2)}
                    </td>
                    <td className="px-2 py-1.5 text-right font-mono">{current.sum.toFixed(3)}</td>
                    <td className="px-2 py-1.5 text-right font-mono">{current.sumSq.toFixed(3)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MSE 정리 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">잔차의 평가 기준 정리</h3>
        <div className="space-y-3">
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-950">
            <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
              모든 데이터에 대한 잔차의 합 → 부적합한 방법
            </p>
            <p className="mt-2 overflow-x-auto font-mono text-sm text-gray-700 dark:text-gray-200">
              Σᵢ₌₁ᴺ eᵢ = Σᵢ₌₁ᴺ (yᵢ − (w₁xᵢ + w₀))
            </p>
          </div>
          <div className="rounded-lg border border-orange-300 bg-orange-50 p-4 dark:border-orange-700 dark:bg-orange-950">
            <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
              잔차의 제곱의 합 → 평균제곱오차 MSE: Mean Squared Error
            </p>
            <p className="mt-2 overflow-x-auto font-mono text-sm text-gray-700 dark:text-gray-200">
              E(w₁, w₀) = Σᵢ₌₁ᴺ eᵢ² = Σᵢ₌₁ᴺ (yᵢ − (w₁xᵢ + w₀))²
            </p>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
              주어진 데이터 집합에 대해 <strong>유일한 직선</strong>을 생성. 좋은 선형회귀 모델이란 이 오차함수 E(w₁, w₀)를
              최소화할 수 있는 매개변수 w₁, w₀를 가진 선형함수.
            </p>
          </div>
          <details className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-200">
              평균제곱오차인데 왜 1/N 이 보이지 않는가
            </summary>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
              평균제곱오차라면 오차를 모두 더한 뒤 데이터 개수 N으로 나누는 1/N 항이 붙어야 함. 그러나 오차함수를 최소화하는
              관점에서는 이 항이 있어도 없어도 최소가 되는 w₁, w₀가 달라지지 않으므로 강의 슬라이드에서는 생략하여 표기함.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
