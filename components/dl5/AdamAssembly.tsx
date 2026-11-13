"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Formula, Hint, Chip, Slider, ComputedNote, Scroller, fmt, q12 } from "@/components/dlShared/ui";

type Part = "first" | "second" | null;

function r2(v: number) {
  return Math.round(v * 100) / 100;
}

/** 경사가 계속 1인 상황에서 m(t)와 보정한 m̂(t)가 어떻게 달라지는지 */
function firstMoment(beta: number, steps: number) {
  const m: number[] = [0];
  let cur = 0;
  for (let t = 1; t <= steps; t++) {
    cur = q12(beta * cur + (1 - beta) * 1);
    m.push(cur);
  }
  return m;
}

export default function AdamAssembly() {
  const [part, setPart] = useState<Part>(null);
  const [t, setT] = useState(5);
  const [b1, setB1] = useState(0.9);
  const [b2, setB2] = useState(0.99);

  const STEPS = 60;
  const m = firstMoment(b1, STEPS);
  const c1 = q12(1 - Math.pow(b1, t));
  const c2 = q12(1 - Math.pow(b2, t));
  const mRaw = m[t];
  const mHat = q12(mRaw / c1);

  const VIEW_W = 420;
  const VIEW_H = 150;
  const px = (i: number) => r2(34 + (i / STEPS) * (VIEW_W - 48));
  const py = (v: number) => r2(12 + (1 - Math.min(v, 1.1) / 1.1) * (VIEW_H - 36));
  const rawPath = m.map((v, i) => `${i === 0 ? "M" : "L"}${px(i)},${py(v)}`).join(" ");
  const hatPath = m
    .map((v, i) => {
      const corr = i === 0 ? 0 : q12(v / q12(1 - Math.pow(b1, i)));
      return `${i === 0 ? "M" : "L"}${px(i)},${py(corr)}`;
    })
    .join(" ");

  return (
    <section id="adam" className="scroll-mt-32">
      <SectionTitle title="Adam" subtitle="모멘텀과 RMSProp을 한 식 안에 합친 최적화기" />

      <div className="space-y-5">
        <Sourced
          refs={{
            slides: "Adam 최적화",
            lecture: "두 기법의 장점을 함께",
          }}
        >
          <Card>
            <CardTitle>어느 쪽에서 온 항인지 눌러서 확인</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              모멘텀과 RMSProp을 결합한 최적화 알고리즘. 1차 모멘트의 추정치 <b>m(t)</b>는 경사 ∇J(w(t))의 이동평균,
              2차 모멘트의 추정치 <b>v(t)</b>는 경사 제곱의 이동평균임.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Chip active={part === "first"} onClick={() => setPart(part === "first" ? null : "first")}>
                1차 모멘트 m(t) — 모멘텀 쪽
              </Chip>
              <Chip active={part === "second"} onClick={() => setPart(part === "second" ? null : "second")}>
                2차 모멘트 v(t) — RMSProp 쪽
              </Chip>
            </div>

            <div className="mt-3 space-y-2">
              <div className={part === "second" ? "opacity-30 transition-opacity" : "transition-opacity"}>
                <Formula>mᵢ(t) = β₁·mᵢ(t−1) + (1−β₁)·∇ᵢJ(w(t))</Formula>
              </div>
              <div className={part === "first" ? "opacity-30 transition-opacity" : "transition-opacity"}>
                <Formula>vᵢ(t) = β₂·vᵢ(t−1) + (1−β₂)·{"{"}∇ᵢJ(w(t)){"}"}²</Formula>
              </div>
              <Formula note="보정: m̂ᵢ(t) = mᵢ(t)/(1−β₁ᵗ),  v̂ᵢ(t) = vᵢ(t)/(1−β₂ᵗ)">
                wᵢ(t+1) = wᵢ(t) − η / (√(v̂ᵢ(t)) + ε) · m̂ᵢ(t)
              </Formula>
            </div>

            {part && (
              <p className="mt-3 rounded-lg bg-violet-50 px-3 py-2 text-[12.5px] leading-6 text-violet-900 dark:bg-violet-950/40 dark:text-violet-100">
                {part === "first"
                  ? "1차 모멘트는 경사 자체의 이동평균이다. 갱신식에서 ∇J 자리를 대신하므로, 모멘텀이 하던 '변화의 방향과 양을 이어받는' 역할을 맡는다."
                  : "2차 모멘트는 경사 제곱의 이동평균이다. 갱신식의 분모 √(v̂)에 들어가므로, RMSProp이 하던 '학습률을 파라미터마다 조절하는' 역할을 맡는다."}
              </p>
            )}

            <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11.5px] leading-5 text-gray-100">
{`from tensorflow.keras import optimizers
optimizer = optimizers.Adam(0.01, beta_1=0.9, beta_2=0.99)`}
            </pre>
            <Hint>
              강의록 예문은 학습률 0.01, β₁ = 0.9, β₂ = 0.99를 지정함. 강의에서는 원 논문의 기본값이 β₁ = 0.9,
              β₂ = 0.999라고 덧붙임.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "Adam — 초기 보정식",
            lecture: "0에서 시작하는 것을 보정",
          }}
        >
          <Card>
            <CardTitle>왜 1−β ᵗ로 나누는가 — 초기 보정</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              m과 v는 0에서 시작함. β₁ = 0.9라면 첫 걸음의 m은 경사의 0.1배밖에 되지 않아, 원하는 만큼 이동하지
              못함. 그래서 (1−β₁ᵗ)로 나누어 초기 값을 키워 줌. t가 커지면 β ᵗ가 0으로 수렴하므로 보정은 저절로
              사라짐.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <Slider label={<span>걸음 t</span>} value={t} min={1} max={STEPS} step={1} onChange={setT} display={t} />
              <Slider label={<span>β₁</span>} value={b1} min={0.5} max={0.99} step={0.01} onChange={setB1} display={fmt(b1, 2)} />
              <Slider label={<span>β₂</span>} value={b2} min={0.9} max={0.999} step={0.001} onChange={setB2} display={fmt(b2, 3)} />
            </div>

            <Scroller>
              <svg
                viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                className="mt-4 h-auto w-full min-w-[360px]"
                role="img"
                aria-label="보정하지 않은 1차 모멘트와 보정한 1차 모멘트의 비교"
              >
                <line x1="34" y1={VIEW_H - 24} x2={VIEW_W - 14} y2={VIEW_H - 24} stroke="#cbd5e1" strokeWidth="1" />
                <line x1="34" y1="10" x2="34" y2={VIEW_H - 24} stroke="#cbd5e1" strokeWidth="1" />
                <line x1="34" y1={py(1)} x2={VIEW_W - 14} y2={py(1)} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                <text x="6" y={py(1) + 3} className="fill-gray-400 text-[9px]">
                  1.0
                </text>
                <text x={VIEW_W - 44} y={VIEW_H - 8} className="fill-gray-400 text-[9px]">
                  걸음 t
                </text>

                <path d={rawPath} fill="none" stroke="#94a3b8" strokeWidth="2" />
                <path d={hatPath} fill="none" stroke="#8b5cf6" strokeWidth="2" />
                <line x1={px(t)} y1="10" x2={px(t)} y2={VIEW_H - 24} stroke="#8b5cf6" strokeWidth="1.2" strokeDasharray="4 3" />
                <circle cx={px(t)} cy={py(mRaw)} r="4" fill="#94a3b8" />
                <circle cx={px(t)} cy={py(mHat)} r="4" fill="#8b5cf6" />
              </svg>
            </Scroller>

            <div className="mt-2 flex flex-wrap gap-3 text-[11px]">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-5 bg-slate-400" /> m(t) — 보정 전
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-5 bg-violet-500" /> m̂(t) — 보정 후
              </span>
            </div>

            <Scroller>
              <table className="mt-3 w-full min-w-[380px] border-collapse text-[12px]">
                <tbody className="text-gray-700 dark:text-gray-200">
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-1.5 pr-2 text-gray-500">1 − β₁ᵗ</td>
                    <td className="py-1.5 pr-2 font-mono">{fmt(c1, 4)}</td>
                    <td className="py-1.5 pr-2 text-gray-500">m을 곱해 주는 배수</td>
                    <td className="py-1.5 font-mono">×{fmt(1 / c1, 2)}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 pr-2 text-gray-500">1 − β₂ᵗ</td>
                    <td className="py-1.5 pr-2 font-mono">{fmt(c2, 4)}</td>
                    <td className="py-1.5 pr-2 text-gray-500">v를 곱해 주는 배수</td>
                    <td className="py-1.5 font-mono">×{fmt(1 / c2, 2)}</td>
                  </tr>
                </tbody>
              </table>
            </Scroller>

            <ComputedNote>
              그래프는 경사가 계속 1인 상황을 가정해 이 페이지에서 계산한 예시임. 강의록에는 이 수치가 적혀 있지
              않으며, 보정식 자체는 강의록 표기를 그대로 따름.
            </ComputedNote>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
