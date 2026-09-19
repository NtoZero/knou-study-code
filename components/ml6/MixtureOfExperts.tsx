"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";

/**
 * 설명용 회귀 문제 — 목표 함수 f*(x) = |x|.
 * 학습기 h₁은 입력의 왼쪽 영역(x < 0), h₂는 오른쪽 영역(x > 0)을 담당하도록 학습되었다고 둔다.
 */
const target = (x: number) => Math.abs(x);
const h1 = (x: number) => -x;
const h2 = (x: number) => x;
/** π₁(x) = 1 / (1 + e^{kx}), π₂(x) = 1 − π₁(x) — 두 계수의 합은 늘 1 */
const pi1 = (x: number, k: number) => 1 / (1 + Math.exp(k * x));

const XS = Array.from({ length: 81 }, (_, i) => -2 + i * 0.05);

const G = { x0: 36, y0: 190, w: 360, h: 170 };
const X = (x: number) => G.x0 + ((x + 2) / 4) * G.w;
const Y = (v: number) => G.y0 - ((v + 2) / 4) * G.h;
const path = (f: (x: number) => number) =>
  XS.map((x, i) => `${i === 0 ? "M" : "L"}${X(x).toFixed(1)},${Y(Math.max(-2, Math.min(2, f(x)))).toFixed(1)}`).join(" ");

const mse = (f: (x: number) => number) => XS.reduce((a, x) => a + (f(x) - target(x)) ** 2, 0) / XS.length;

export default function MixtureOfExperts() {
  const [k, setK] = useState(6);
  const [fixedW, setFixedW] = useState(0.5);
  const [probe, setProbe] = useState(-1);

  const moe = useMemo(() => (x: number) => pi1(x, k) * h1(x) + (1 - pi1(x, k)) * h2(x), [k]);
  const fixed = useMemo(() => (x: number) => fixedW * h1(x) + (1 - fixedW) * h2(x), [fixedW]);
  const moeErr = useMemo(() => mse(moe), [moe]);
  const fixedErr = useMemo(() => mse(fixed), [fixed]);

  const p1 = pi1(probe, k);

  return (
    <section id="mixture-of-experts" className="scroll-mt-32">
      <SectionTitle
        title="08. 전문가 혼합"
        subtitle="가중합 계수가 입력에 대한 함수 πᵢ(x) — 입력에 따라 어떤 학습기를 중요하게 쓸지가 달라짐"
      />

      <Sourced
        className="mb-6"
        refs={{
          textbook: "8.4.3 전문가 혼합 — 식 8-15, 그림 8-6",
          slides: "전문가 혼합 mixture of experts",
          lecture: "AdaBoost의 αᵢ는 학습기마다 하나로 고정된 값이지만 전문가 혼합의 πᵢ(x)는 입력에 따라 달라진다는 대비로 설명함",
        }}
      >
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/40">
          <p className="text-xs font-bold tracking-wide text-amber-600 dark:text-amber-400">
            전문가 혼합 (mixture of experts)
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
            복수 개의 학습기를 가중합하여 최종 학습기를 만드는 결합 방법.
          </p>
          <div className="mt-3 overflow-x-auto">
            <p className="min-w-[360px] font-mono text-base">
              f(x) = f(h₁(x), h₂(x), …, h_M(x)) = Σ<sub>i=1</sub>
              <sup>M</sup> πᵢ(x) hᵢ(x) <span className="text-xs text-gray-500">(식 8-15)</span>
            </p>
          </div>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-xs">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="border-b border-gray-200 p-2 dark:border-gray-700">결합 방법</th>
                <th className="border-b border-gray-200 p-2 dark:border-gray-700">가중합 계수</th>
                <th className="border-b border-gray-200 p-2 dark:border-gray-700">정해지는 방식</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              <tr>
                <td className="border-b border-gray-100 p-2 dark:border-gray-800">단순 보팅</td>
                <td className="border-b border-gray-100 p-2 font-mono dark:border-gray-800">1/M</td>
                <td className="border-b border-gray-100 p-2 dark:border-gray-800">모든 학습기에 같은 값</td>
              </tr>
              <tr>
                <td className="border-b border-gray-100 p-2 dark:border-gray-800">AdaBoost 가중 결합</td>
                <td className="border-b border-gray-100 p-2 font-mono dark:border-gray-800">αᵢ</td>
                <td className="border-b border-gray-100 p-2 dark:border-gray-800">
                  분류 성능에 의존하여 각 분류기마다 하나로 정해지는 값
                </td>
              </tr>
              <tr className="bg-amber-50/70 dark:bg-amber-950/30">
                <td className="border-b border-gray-100 p-2 font-bold dark:border-gray-800">전문가 혼합</td>
                <td className="border-b border-gray-100 p-2 font-mono dark:border-gray-800">πᵢ(x)</td>
                <td className="border-b border-gray-100 p-2 dark:border-gray-800">
                  입력에 대한 함수 — 어떤 입력이 주어지느냐에 따라 달라짐
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Sourced>

      <Sourced
        className="mb-6"
        refs={{ textbook: "8.4.3 전문가 혼합 — 입력 공간 분할과 '전문가'의 의미" }}
      >
        <h3 className="mb-1 text-base font-bold">입력 영역을 나눠 맡는 두 전문가</h3>
        <p className="mb-3 text-sm text-gray-500">
          설명용 회귀 문제: 목표 f*(x) = |x|. 학습기 h₁(x) = −x는 왼쪽 영역, h₂(x) = x는 오른쪽
          영역을 담당. π₁(x) = 1/(1 + e<sup>kx</sup>), π₂(x) = 1 − π₁(x)로 두면 k가 클수록 영역이
          뚜렷하게 나뉘고, k = 0이면 π₁ = π₂ = ½로 입력과 무관한 단순 평균이 됨.
        </p>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="flex items-center gap-2 text-sm">
              <span className="shrink-0 font-semibold">k</span>
              <input type="range" min={0} max={20} step={0.5} value={k} onChange={(e) => setK(Number(e.target.value))} className="w-full accent-amber-500" />
              <span className="w-8 font-mono font-bold">{k}</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <span className="shrink-0 font-semibold">고정 w₁</span>
              <input type="range" min={0} max={1} step={0.05} value={fixedW} onChange={(e) => setFixedW(Number(e.target.value))} className="w-full accent-sky-500" />
              <span className="w-10 font-mono font-bold">{fixedW.toFixed(2)}</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <span className="shrink-0 font-semibold">입력 x</span>
              <input type="range" min={-2} max={2} step={0.05} value={probe} onChange={(e) => setProbe(Number(e.target.value))} className="w-full accent-gray-500" />
              <span className="w-10 font-mono font-bold">{probe.toFixed(2)}</span>
            </label>
          </div>
          <div className="overflow-x-auto">
            <svg viewBox="0 0 420 210" className="w-full min-w-[360px]">
              <line x1={G.x0} y1={Y(0)} x2={G.x0 + G.w} y2={Y(0)} stroke="#cbd5e1" />
              <line x1={X(0)} y1={G.y0 - G.h} x2={X(0)} y2={G.y0} stroke="#cbd5e1" />
              {[-2, -1, 1, 2].map((v) => (
                <text key={v} x={X(v)} y={Y(0) + 11} fontSize="8" textAnchor="middle" fill="#94a3b8">
                  {v}
                </text>
              ))}
              <path d={path(h1)} fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 3" />
              <path d={path(h2)} fill="none" stroke="#0891b2" strokeWidth="1" strokeDasharray="3 3" />
              <path d={path(target)} fill="none" stroke="#334155" strokeWidth="3" opacity={0.25} />
              <path d={path(fixed)} fill="none" stroke="#0ea5e9" strokeWidth="2" />
              <path d={path(moe)} fill="none" stroke="#d97706" strokeWidth="2.5" />
              <line x1={X(probe)} y1={G.y0 - G.h} x2={X(probe)} y2={G.y0} stroke="#64748b" strokeDasharray="2 2" />
              <circle cx={X(probe)} cy={Y(moe(probe))} r={4} fill="#d97706" />
              <text x={X(-1.9)} y={Y(1.85)} fontSize="9" fill="#a855f7">h₁(x) = −x</text>
              <text x={X(1.2)} y={Y(1.85)} fontSize="9" fill="#0891b2">h₂(x) = x</text>
            </svg>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-gray-500">
            <span><span className="font-bold text-slate-400">━</span> 목표 f*(x) = |x|</span>
            <span><span className="font-bold text-amber-600">━</span> 전문가 혼합 Σπᵢ(x)hᵢ(x)</span>
            <span><span className="font-bold text-sky-500">━</span> 입력과 무관한 고정 가중치 w₁h₁ + (1−w₁)h₂</span>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
              <p className="text-[11px] font-bold text-gray-500">x = {probe.toFixed(2)}에서의 계수</p>
              <div className="mt-1 space-y-1">
                {[
                  ["π₁(x)", p1, "bg-purple-500"],
                  ["π₂(x)", 1 - p1, "bg-cyan-600"],
                ].map(([label, v, c]) => (
                  <div key={label as string} className="flex items-center gap-2 text-[11px]">
                    <span className="w-10 font-mono">{label as string}</span>
                    <div className="h-2 flex-1 rounded-full bg-white dark:bg-gray-900">
                      <div className={`h-2 rounded-full ${c as string}`} style={{ width: `${(v as number) * 100}%` }} />
                    </div>
                    <span className="w-10 text-right font-mono">{(v as number).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950/40">
              <p className="text-[11px] text-gray-500">전문가 혼합 평균제곱오차</p>
              <p className="font-mono text-lg font-bold">{moeErr.toFixed(4)}</p>
            </div>
            <div className="rounded-lg bg-sky-50 p-3 dark:bg-sky-950/30">
              <p className="text-[11px] text-gray-500">고정 가중치 평균제곱오차</p>
              <p className="font-mono text-lg font-bold">{fixedErr.toFixed(4)}</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            입력과 무관한 고정 가중치로는 w₁을 어떻게 골라도 한쪽 영역에서 크게 틀림. πᵢ(x)가
            입력에 따라 담당 학습기를 바꾸면 각 영역에서 그 영역의 전문가가 결과를 냄.
          </p>
        </div>
      </Sourced>

      <Sourced
        refs={{ textbook: "8.4.3 전문가 혼합 — 상관관계 감소와 일반화 오차" }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-l-4 border-amber-500 bg-white p-4 text-xs leading-relaxed text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-300">
            <p className="mb-1 text-sm font-bold">효과적인 전략</p>
            입력 공간을 복수 개의 영역으로 나누어 각 학습기가 특정 영역을 중점적으로 담당하도록
            학습하고, 그에 맞추어 결합에 사용되는 가중치도 결정. &lsquo;전문가&rsquo;라는 명칭은
            입력 공간의 특정 영역을 담당한다는 의미에서 붙여진 것.
          </div>
          <div className="rounded-xl border-l-4 border-amber-500 bg-white p-4 text-xs leading-relaxed text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-300">
            <p className="mb-1 text-sm font-bold">일반화 오차와의 관계</p>
            각 학습기의 학습 데이터를 입력 공간에 따라 나누어 제공하면 학습기 간의 상관관계가
            줄어들거나 음의 상관관계를 갖게 되어, (식 8-8)의 상관관계에 의존하는 항이 줄고 일반화
            오차를 감소시킬 수 있음. 담당 영역이 명시적으로 정해지면 π(x)도 그에 맞추어 정할 수
            있고, 인위적으로 나누는 대신 스스로 담당 영역을 학습하는 접근도 가능.
          </div>
        </div>
      </Sourced>
    </section>
  );
}
