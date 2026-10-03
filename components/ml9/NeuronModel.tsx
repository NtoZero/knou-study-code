"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { fmt, signed, step } from "./nn";

const INIT_X = [1, 0.5, 1];
const INIT_W = [0.6, -0.8, 0.5];

export default function NeuronModel() {
  const [x, setX] = useState<number[]>(INIT_X);
  const [w, setW] = useState<number[]>(INIT_W);
  const [theta, setTheta] = useState(0.5);

  const terms = x.map((xi, i) => w[i] * xi);
  const u = terms.reduce((a, b) => a + b, 0);
  const out = step(u - theta);

  const maxAbs = Math.max(1, ...terms.map((t) => Math.abs(t)), Math.abs(u), Math.abs(theta));
  const barW = (v: number) => (Math.abs(v) / maxAbs) * 70;
  /** 막대 차트에서 값 v가 놓이는 x 좌표 (가운데가 0) */
  const barX = (v: number) => 115 + (v / maxAbs) * 70;

  const setAt = (arr: number[], i: number, v: number) =>
    arr.map((old, j) => (j === i ? v : old));

  return (
    <section id="neuron" className="scroll-mt-32">
      <SectionTitle
        title="11.1.3 ① 인공 신경세포 — 가중합과 활성화 함수"
        subtitle="입력에 가중치를 곱해 모두 더하고, 그 값이 임계치를 넘는지만 본다"
      />

      <Sourced
        refs={{
          textbook: "11.1.3 신경망의 구성 요소 (그림 11-2, 식 11-1)",
          slides: "신경망의 구성 요소 ① 인공 신경세포",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">인공 뉴런의 정의</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            하나의 인공 뉴런은 n개의 입력 (x₁, x₂, …, xₙ)에 대해 연결 강도에 해당하는 가중치 (w₁, w₂,
            …, wₙ)를 곱하여 모두 합한 <strong>가중합</strong> u를 계산함. 가중합은 다시{" "}
            <strong>활성화 함수</strong> φ를 통하여 다음 뉴런으로 전달될 출력이 결정됨.
          </p>
          <div className="mt-3 overflow-x-auto rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
            <p className="min-w-[320px] font-mono text-sm leading-7">
              u = Σ<sub>i=1</sub>
              <sup>n</sup> wᵢxᵢ ,  φ(u) = 1 (u ≥ θ), 0 (otherwise)
              <span className="ml-2 text-xs text-gray-500">(식 11-1)</span>
            </p>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            이는 생물학적 뉴런이 입력 자극이 어느 정도 수준(임계치 θ) 이상이 될 때만 전기적 방전을
            일으켜 활성화된다는 사실을 간단히 수학적으로 표현한 것. 그러나 반드시 이 함수를 사용할
            필요는 없으며, 활성화 함수를 적절히 정의해 줌으로써 원하는 특성을 가진 신경망 모델을 개발할
            수 있음.
          </p>
        </div>
      </Sourced>

      {/* ── 가중합 조작기 ── */}
      <Sourced
        refs={{
          textbook: "11.1.3 신경망의 구성 요소 (식 11-1)",
          slides: "신경망의 구성 요소 ① 인공 신경세포",
          lecture: "신경세포 하나는 입력의 가중합이 일정 수준 이상이면 출력을 내고 아니면 0을 내는 아주 간단한 장치이고, 그 특성을 정하는 것이 활성화 함수라고 꼭 기억하라고 강조",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold">뉴런 하나를 직접 돌려 보기 (n = 3)</h3>
            <button
              type="button"
              onClick={() => {
                setX(INIT_X);
                setW(INIT_W);
                setTheta(0.5);
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:hover:text-gray-200"
            >
              <RotateCcw size={12} />
              처음 값으로
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            가중치의 부호를 바꿔 보면 흥분성·억제성 연결의 차이가 가중합에 그대로 나타남.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
            {/* 뉴런 그림 */}
            <div className="overflow-x-auto">
              <svg viewBox="0 0 340 230" className="w-full min-w-[320px] rounded-lg border border-gray-100 dark:border-gray-800">
                <rect x={0} y={0} width={340} height={230} fill="#ffffff" />
                <text x={34} y={20} fontSize="9" textAnchor="middle" fill="#64748b">
                  입력
                </text>
                <text x={110} y={20} fontSize="9" textAnchor="middle" fill="#64748b">
                  가중치
                </text>
                <text x={205} y={20} fontSize="9" textAnchor="middle" fill="#64748b">
                  뉴런
                </text>
                <text x={300} y={20} fontSize="9" textAnchor="middle" fill="#64748b">
                  출력
                </text>

                {x.map((xi, i) => {
                  const y = 60 + i * 50;
                  const positive = w[i] >= 0;
                  return (
                    <g key={i}>
                      <circle cx={34} cy={y} r={15} fill="#eff6ff" stroke="#2563eb" strokeWidth={1.4} />
                      <text x={34} y={y - 1} fontSize="9" textAnchor="middle" fill="#1e3a8a">
                        x{["₁", "₂", "₃"][i]}
                      </text>
                      <text x={34} y={y + 9} fontSize="8" textAnchor="middle" fill="#1e3a8a">
                        {fmt(xi, 2)}
                      </text>
                      <line
                        x1={49}
                        y1={y}
                        x2={181}
                        y2={115}
                        stroke={positive ? "#dc2626" : "#2563eb"}
                        strokeWidth={1 + Math.min(4, Math.abs(w[i]) * 2.5)}
                        opacity={0.8}
                      />
                      <text
                        x={112}
                        y={y + (y < 115 ? -6 : 14) - (i === 1 ? 4 : 0)}
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                        fill={positive ? "#dc2626" : "#2563eb"}
                      >
                        w{["₁", "₂", "₃"][i]} = {fmt(w[i], 2)}
                      </text>
                    </g>
                  );
                })}

                {/* 세포체 */}
                <circle cx={205} cy={115} r={26} fill="#fdf4ff" stroke="#a21caf" strokeWidth={1.8} />
                <text x={205} y={110} fontSize="10" textAnchor="middle" fill="#86198f">
                  Σ → φ
                </text>
                <text x={205} y={123} fontSize="9" fontWeight="bold" textAnchor="middle" fill="#86198f">
                  u = {fmt(u, 2)}
                </text>

                <line x1={231} y1={115} x2={278} y2={115} stroke="#ea580c" strokeWidth={3} />
                <circle cx={300} cy={115} r={17} fill={out === 1 ? "#fed7aa" : "#f1f5f9"} stroke="#ea580c" strokeWidth={1.6} />
                <text x={300} y={112} fontSize="8" textAnchor="middle" fill="#9a3412">
                  φ(u)
                </text>
                <text x={300} y={124} fontSize="12" fontWeight="bold" textAnchor="middle" fill="#9a3412">
                  {out}
                </text>

                <text x={170} y={210} fontSize="9" textAnchor="middle" fill="#dc2626">
                  ■ 흥분성(w &gt; 0)
                </text>
                <text x={262} y={210} fontSize="9" textAnchor="middle" fill="#2563eb">
                  ■ 억제성(w &lt; 0)
                </text>
                <text x={60} y={210} fontSize="9" textAnchor="middle" fill="#64748b">
                  선 굵기 = |w|
                </text>
              </svg>
            </div>

            {/* 조작부 + 계산 */}
            <div>
              <div className="space-y-2">
                {x.map((xi, i) => (
                  <div key={i} className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                    <label className="flex items-center gap-2 text-xs">
                      <span className="w-8 shrink-0 font-mono font-bold">x{["₁", "₂", "₃"][i]}</span>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={xi}
                        onChange={(e) => setX((p) => setAt(p, i, Number(e.target.value)))}
                        className="min-w-0 flex-1 accent-blue-600"
                      />
                      <span className="w-8 shrink-0 text-right font-mono">{fmt(xi, 1)}</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <span className="w-8 shrink-0 font-mono font-bold">w{["₁", "₂", "₃"][i]}</span>
                      <input
                        type="range"
                        min={-1}
                        max={1}
                        step={0.1}
                        value={w[i]}
                        onChange={(e) => setW((p) => setAt(p, i, Number(e.target.value)))}
                        className="min-w-0 flex-1 accent-fuchsia-600"
                      />
                      <span className="w-8 shrink-0 text-right font-mono">{fmt(w[i], 1)}</span>
                    </label>
                  </div>
                ))}
                <label className="flex items-center gap-2 border-t border-gray-100 pt-2 text-xs dark:border-gray-800">
                  <span className="w-20 shrink-0 font-mono font-bold">임계치 θ</span>
                  <input
                    type="range"
                    min={-1.5}
                    max={1.5}
                    step={0.1}
                    value={theta}
                    onChange={(e) => setTheta(Number(e.target.value))}
                    className="min-w-0 flex-1 accent-emerald-600"
                  />
                  <span className="w-10 shrink-0 text-right font-mono">{fmt(theta, 1)}</span>
                </label>
              </div>

              {/* 항별 기여 막대 */}
              <div className="mt-4 overflow-x-auto rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                <svg viewBox="0 0 230 110" className="w-full min-w-[230px] max-w-[320px]">
                  <line x1={115} y1={6} x2={115} y2={104} stroke="#cbd5e1" />
                  {terms.map((t, i) => (
                    <g key={i}>
                      <rect
                        x={t >= 0 ? 115 : 115 - barW(t)}
                        y={12 + i * 20}
                        width={barW(t)}
                        height={12}
                        fill={t >= 0 ? "#dc2626" : "#2563eb"}
                        opacity={0.75}
                      />
                      <text x={4} y={22 + i * 20} fontSize="8" fill="#475569">
                        w{["₁", "₂", "₃"][i]}x{["₁", "₂", "₃"][i]}
                      </text>
                      <text x={t >= 0 ? 118 + barW(t) : 112 - barW(t)} y={22 + i * 20} fontSize="8" textAnchor={t >= 0 ? "start" : "end"} fill="#475569">
                        {fmt(t, 2)}
                      </text>
                    </g>
                  ))}
                  <rect
                    x={u >= 0 ? 115 : 115 - barW(u)}
                    y={78}
                    width={barW(u)}
                    height={14}
                    fill="#a21caf"
                  />
                  <text x={4} y={89} fontSize="9" fontWeight="bold" fill="#86198f">
                    u
                  </text>
                  <text x={u >= 0 ? 118 + barW(u) : 112 - barW(u)} y={89} fontSize="9" fontWeight="bold" textAnchor={u >= 0 ? "start" : "end"} fill="#86198f">
                    {fmt(u, 2)}
                  </text>
                  <line
                    x1={barX(theta)}
                    y1={72}
                    x2={barX(theta)}
                    y2={100}
                    stroke="#059669"
                    strokeWidth={1.6}
                    strokeDasharray="3 2"
                  />
                  <text x={barX(theta)} y={106} fontSize="8" textAnchor="middle" fill="#059669">
                    θ
                  </text>
                </svg>
              </div>

              <div className="mt-3 overflow-x-auto rounded-lg bg-gray-50 p-3 font-mono text-xs leading-6 dark:bg-gray-800/60">
                <p className="min-w-[300px]">
                  u ={" "}
                  {w
                    .map((wi, i) => `${fmt(wi, 2)}×${fmt(x[i], 2)}`)
                    .join(" + ")
                    .replace(/\+ -/g, "− ")}
                </p>
                <p className="min-w-[300px]">
                  {"  "}= {fmt(terms[0], 3)} {signed(terms[1], 3)} {signed(terms[2], 3)} ={" "}
                  <strong>{fmt(u, 3)}</strong>
                </p>
                <p className="min-w-[300px]">
                  u {u >= theta ? "≥" : "<"} θ = {fmt(theta, 2)} → φ(u) = <strong>{out}</strong>
                </p>
              </div>

              <p
                className={`mt-2 rounded-lg p-2.5 text-xs leading-relaxed ${
                  out === 1
                    ? "bg-fuchsia-50 text-fuchsia-800 dark:bg-fuchsia-950/40 dark:text-fuchsia-200"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
                }`}
              >
                {out === 1
                  ? "가중합이 임계치 이상 → 활성화. 생물학적 뉴런으로 치면 활동전위(스파이크)가 발생해 축색을 따라 전달되는 상태."
                  : "가중합이 임계치에 못 미침 → 활성화되지 않음. 출력 0을 내보냄."}
              </p>
            </div>
          </div>
        </div>
      </Sourced>
    </section>
  );
}
