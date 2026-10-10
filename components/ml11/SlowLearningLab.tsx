"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Formula, Hint, Scroller, Slider } from "./ui";
import { fmt } from "./nets";

const sig = (u: number) => 1 / (1 + Math.exp(-u));
const dsig = (u: number) => {
  const y = sig(u);
  return y * (1 - y);
};

/* 안장점 근처의 평평한 구간 — E(θ) = θ³, ∂E/∂θ = 3θ² */
function cubicRun(eta: number, steps: number) {
  let t = 1;
  const path = [t];
  for (let i = 0; i < steps; i += 1) {
    t -= eta * 3 * t * t;
    path.push(t);
  }
  return path;
}

const CW = 300;
const CH = 170;
const CPAD = { l: 30, r: 10, t: 12, b: 24 };

export default function SlowLearningLab() {
  const [probe, setProbe] = useState(4);
  const [eta, setEta] = useState(0.1);

  const path = useMemo(() => cubicRun(eta, 400), [eta]);
  const marks = [0, 10, 50, 100, 200, 400];

  const sx = (u: number) => CPAD.l + ((u + 8) / 16) * (CW - CPAD.l - CPAD.r);
  const sy = (v: number) => CH - CPAD.b - v * (CH - CPAD.t - CPAD.b);

  const sigCurve = useMemo(() => {
    const pts: string[] = [];
    for (let u = -8; u <= 8; u += 0.1) pts.push(`${sx(u)},${sy(sig(u))}`);
    return pts.join(" ");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const dsigCurve = useMemo(() => {
    const pts: string[] = [];
    for (let u = -8; u <= 8; u += 0.1) pts.push(`${sx(u)},${sy(dsig(u) * 4)}`);
    return pts.join(" ");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id="slow-learning" className="scroll-mt-32">
      <SectionTitle
        title="느린 학습 — 플라토와 기울기 소멸"
        subtitle="신경망의 가장 대표적인 문제. 왜 학습이 멈춘 것처럼 보이는지를 숫자로 확인합니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.2.2 느린 학습",
            slides: "(2) 느린 학습 slow learning",
          }}
        >
          <Card>
            <CardTitle>두 가지 원인</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              느린 학습(slow learning)은 신경망의 가장 대표적인 문제이며, <strong>플라토 문제</strong>(plateau
              problem) 또는 <strong>기울기 소멸 문제</strong>(gradient vanishing problem)에 기인합니다.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[12.5px] font-bold text-gray-800 dark:text-gray-100">플라토</p>
                <p className="mt-1 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  기울기 강하 학습법의 오차함수의 학습곡선(learning curve)에서 <strong>평평한 구간</strong>.
                  오차함수에 무수히 많이 존재하는 극대·극소가 아닌 극점(안장점, saddle point)에 의해 발생한다.
                  이 구간에서는 오차함수의 기울기 변화가 거의 없을 정도이기 때문에 학습이 매우 느리게 진행된다.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[12.5px] font-bold text-gray-800 dark:text-gray-100">기울기 소멸</p>
                <p className="mt-1 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  특히 신경망의 층이 많은 경우 <strong>출력층으로부터의 오차 신호가 입력층으로 내려오면서 점점
                  약해져서</strong> 학습이 느려지거나 진행되지 않는 현상. 가중치 수정폭은 기울기의 크기에
                  의존하므로(Δθ ∝ ∂E/∂θ), 기울기가 작아지면 가중치가 거의 고쳐지지 않는다.
                </p>
              </div>
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "12.2.2 — 플라토(그림 12-3)", slides: "(2) 느린 학습 — 플라토 문제" }}>
          <Card>
            <CardTitle>기울기가 0인 지점 근처에서는 얼마나 느려지는가</CardTitle>
            <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              안장점은 <strong>극대·극소가 아니면서 미분값이 0인 극점</strong>입니다. 가장 간단한 예로 E(θ) = θ³은
              θ = 0에서 미분값이 0이지만 극소가 아닙니다. 이 함수를 θ = 1에서 출발해 기울기 강하로 내려가 보면,
              0에 가까워질수록 기울기 3θ²이 작아져 한 걸음에 움직이는 거리가 급격히 줄어듭니다.
            </p>
            <Formula note="한 걸음의 이동 거리 = η·3θ² — θ가 반으로 줄면 이동 거리는 4분의 1이 된다">
              E(θ) = θ³,  ∂E/∂θ = 3θ²,  θ⁽τ⁺¹⁾ = θ⁽τ⁾ − η·3(θ⁽τ⁾)²
            </Formula>

            <div className="mt-3 max-w-xs">
              <Slider
                label="학습률 η"
                value={eta}
                min={0.05}
                max={0.3}
                step={0.05}
                onChange={setEta}
                display={fmt(eta, 2)}
              />
            </div>

            <Scroller>
              <table className="mt-3 w-full min-w-[420px] text-[11.5px]">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                    <th className="px-2 py-1.5 font-semibold">걸음 τ</th>
                    <th className="px-2 py-1.5 font-semibold">θ</th>
                    <th className="px-2 py-1.5 font-semibold">E(θ)</th>
                    <th className="px-2 py-1.5 font-semibold">기울기 3θ²</th>
                    <th className="px-2 py-1.5 font-semibold">이 걸음의 이동 거리</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((m) => {
                    const t = path[m];
                    const g = 3 * t * t;
                    return (
                      <tr key={m} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-2 py-1.5 font-mono">{m}</td>
                        <td className="px-2 py-1.5 font-mono">{fmt(t, 5)}</td>
                        <td className="px-2 py-1.5 font-mono">{fmt(t * t * t, 6)}</td>
                        <td className="px-2 py-1.5 font-mono">{fmt(g, 6)}</td>
                        <td className="px-2 py-1.5 font-mono">{fmt(eta * g, 6)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Scroller>

            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              400걸음을 걸어도 θ는 {fmt(path[400], 4)}에 머물고, 한 걸음에 움직이는 거리는{" "}
              {fmt(eta * 3 * path[400] * path[400], 7)}까지 줄어듭니다. 오차는 거의 변하지 않지만 학습은 멈춘 것이
              아니라 <strong>아주 느리게 진행되는 중</strong>입니다. 학습곡선에서는 이 구간이 평평한 플라토로
              보입니다.
            </p>
            <ComputedNote>
              E(θ) = θ³은 안장점처럼 미분값이 0이 되는 지점을 가장 간단하게 보여 주려고 이 페이지에서 고른
              함수입니다. 교재·강의록에는 학습곡선의 플라토 그림과 안장점 그림만 있고 수치 예는 없습니다.
            </ComputedNote>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.2.2 — 셀 포화(그림 12-4)",
            slides: "(2) 느린 학습 — 기울기 소멸 문제",
          }}
        >
          <Card>
            <CardTitle>셀 포화 — 시그모이드에 큰 값이 들어오면</CardTitle>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
              <Scroller>
                <svg viewBox={`0 0 ${CW} ${CH}`} className="h-auto w-full min-w-[280px]">
                  <rect
                    x={sx(-8)}
                    y={CPAD.t}
                    width={sx(-4) - sx(-8)}
                    height={CH - CPAD.t - CPAD.b}
                    fill="#fecaca"
                    opacity={0.35}
                  />
                  <rect
                    x={sx(4)}
                    y={CPAD.t}
                    width={sx(8) - sx(4)}
                    height={CH - CPAD.t - CPAD.b}
                    fill="#fecaca"
                    opacity={0.35}
                  />
                  <line x1={CPAD.l} y1={sy(0)} x2={CW - CPAD.r} y2={sy(0)} stroke="#cbd5e1" />
                  <line x1={sx(0)} y1={CPAD.t} x2={sx(0)} y2={CH - CPAD.b} stroke="#e2e8f0" />
                  <polyline points={sigCurve} fill="none" stroke="#0284c7" strokeWidth={2} />
                  <polyline points={dsigCurve} fill="none" stroke="#dc2626" strokeWidth={1.6} strokeDasharray="4 3" />
                  <line
                    x1={sx(probe)}
                    y1={CPAD.t}
                    x2={sx(probe)}
                    y2={CH - CPAD.b}
                    stroke="#0f172a"
                    strokeWidth={1}
                    strokeDasharray="2 3"
                  />
                  <circle cx={sx(probe)} cy={sy(sig(probe))} r={3.5} fill="#0284c7" />
                  <circle cx={sx(probe)} cy={sy(dsig(probe) * 4)} r={3.5} fill="#dc2626" />
                  <text x={CPAD.l + 2} y={sy(1) - 3} fontSize="8" fill="#94a3b8">
                    1.0
                  </text>
                  <text x={CW - CPAD.r} y={CH - 6} fontSize="9" textAnchor="end" fill="#94a3b8">
                    u
                  </text>
                  <text x={sx(-6)} y={CH - CPAD.b - 6} fontSize="7.5" textAnchor="middle" fill="#dc2626">
                    셀 포화
                  </text>
                  <text x={sx(6)} y={CH - CPAD.b - 6} fontSize="7.5" textAnchor="middle" fill="#dc2626">
                    셀 포화
                  </text>
                </svg>
                <div className="mt-1 flex flex-wrap gap-3 pl-7 text-[10px]">
                  <span className="text-sky-600">— 시그모이드 φ(u)</span>
                  <span className="text-rose-600">— — 미분 φ′(u) (4배 확대)</span>
                </div>
              </Scroller>

              <div className="space-y-3">
                <Slider
                  label="가중합 u"
                  value={probe}
                  min={-8}
                  max={8}
                  step={0.5}
                  onChange={setProbe}
                  display={fmt(probe, 1)}
                />
                <div className="rounded-lg bg-gray-50 p-2.5 font-mono text-[11px] leading-6 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  <div>φ(u) = {fmt(sig(probe), 5)}</div>
                  <div>φ′(u) = φ(u)(1 − φ(u)) = {fmt(dsig(probe), 5)}</div>
                  <div className="text-gray-500">φ′의 최대값 = 0.25 (u = 0)</div>
                </div>
                <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                  시그모이드 함수에 큰 양수·음수가 들어오면 출력이 0 또는 1에 가까워지는 <strong>셀
                  포화(cell saturation)</strong> 현상이 발생하고, 함수의 미분값인 기울기도 작아져서 0에
                  가까워집니다. 출력층에서 입력층으로 오차 신호가 역전파되면서 1보다 작은 시그모이드 함수의
                  미분값들이 계속해서 곱해지는데, 많은 은닉층을 거치면서 그 곱한 값이 점점 작아져 결국 가중치의
                  수정이 제대로 이루어지지 못하게 됩니다.
                </p>
                <Hint>
                  곡선은 정의식 φ(u) = 1/(1 + e⁻ᵘ)와 φ′(u) = φ(u)(1 − φ(u))를 직접 계산해 그렸습니다. 미분
                  곡선은 눈에 보이게 4배로 확대했습니다.
                </Hint>
              </div>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
