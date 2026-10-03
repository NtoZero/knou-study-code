"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Formula, Hint, Scroller, Slider } from "./ui";
import { SIGMOID, fmt } from "./mlpCore";

const W = 420;
const H = 180;
const PAD = { l: 34, r: 12, t: 12, b: 24 };
const U_MIN = -10;
const U_MAX = 10;
const SAT = 4; // |u| > 4부터 출력이 0.98 / 0.02를 넘어 거의 변하지 않는 구간

const sx = (u: number) => PAD.l + ((u - U_MIN) / (U_MAX - U_MIN)) * (W - PAD.l - PAD.r);
const syY = (y: number) => H - PAD.b - y * (H - PAD.t - PAD.b);
const syD = (d: number) => H - PAD.b - (d / 0.25) * (H - PAD.t - PAD.b);

const CURVE_Y = (() => {
  const p: string[] = [];
  for (let u = U_MIN; u <= U_MAX + 1e-9; u += 0.1) p.push(`${sx(u)},${syY(SIGMOID.f(u))}`);
  return p.join(" ");
})();
const CURVE_D = (() => {
  const p: string[] = [];
  for (let u = U_MIN; u <= U_MAX + 1e-9; u += 0.1) {
    const y = SIGMOID.f(u);
    p.push(`${sx(u)},${syD((1 - y) * y)}`);
  }
  return p.join(" ");
})();

export default function SaturationLab() {
  const [pixel, setPixel] = useState(200);
  const [weight, setWeight] = useState(0.05);
  const [normalized, setNormalized] = useState(false);

  const x = normalized ? pixel / 255 : pixel;
  const u = weight * x;
  const y = SIGMOID.f(u);
  const dphi = (1 - y) * y;

  const uRaw = weight * pixel;
  const yRaw = SIGMOID.f(uRaw);
  const dRaw = (1 - yRaw) * yRaw;
  const uNorm = (weight * pixel) / 255;
  const yNorm = SIGMOID.f(uNorm);
  const dNorm = (1 - yNorm) * yNorm;

  const clampU = Math.max(U_MIN, Math.min(U_MAX, u));

  return (
    <section id="saturation" className="scroll-mt-32">
      <SectionTitle
        title="셀 포화와 입력값의 정규화"
        subtitle="입력이 크면 왜 학습이 어려워지는지 활성화 함수의 미분값으로 확인합니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            slides: "데이터 셋팅 — 입력값의 전처리: 정규화",
            lecture: "활성화 함수의 값이 거의 0이나 1에 붙어 서로 구분되지 않는 구간을 셀 포화라 부르고, 이 구간에서는 학습이 어려워진다고 그림으로 설명",
          }}
        >
          <Card>
            <CardTitle>정규화가 필요한 이유</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              정규화(normalization)는 데이터가 가지는 값이 일정 범위 안에 있도록 조정하는 것입니다. 신경세포의
              입력값이 크면 <strong>셀 포화</strong>의 가능성이 높아져 학습에 어려움이 생깁니다. 그래서 0~255
              범위의 픽셀값을 0~1 범위의 값으로 조정합니다.
            </p>
            <Formula className="mt-2" note="MNIST 픽셀값의 정규화">
              x̃ = (x − 0) / (255 − 0)
            </Formula>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_250px]">
              <Scroller>
                <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[380px]">
                  <rect
                    x={sx(U_MIN)}
                    y={PAD.t}
                    width={sx(-SAT) - sx(U_MIN)}
                    height={H - PAD.t - PAD.b}
                    fill="#fecaca"
                    opacity={0.35}
                  />
                  <rect
                    x={sx(SAT)}
                    y={PAD.t}
                    width={sx(U_MAX) - sx(SAT)}
                    height={H - PAD.t - PAD.b}
                    fill="#fecaca"
                    opacity={0.35}
                  />
                  <text x={sx(-7)} y={PAD.t + 12} fontSize="9.5" textAnchor="middle" fill="#dc2626">
                    셀 포화
                  </text>
                  <text x={sx(7)} y={PAD.t + 12} fontSize="9.5" textAnchor="middle" fill="#dc2626">
                    셀 포화
                  </text>

                  <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="#cbd5e1" />
                  <line x1={sx(0)} y1={PAD.t} x2={sx(0)} y2={H - PAD.b} stroke="#e2e8f0" />
                  {[-10, -5, 0, 5, 10].map((v) => (
                    <text key={v} x={sx(v)} y={H - 10} fontSize="8" textAnchor="middle" fill="#94a3b8">
                      {v}
                    </text>
                  ))}
                  <polyline points={CURVE_Y} fill="none" stroke="#0284c7" strokeWidth={2} />
                  <polyline points={CURVE_D} fill="none" stroke="#d97706" strokeWidth={1.8} strokeDasharray="5 3" />

                  <line
                    x1={sx(clampU)}
                    y1={PAD.t}
                    x2={sx(clampU)}
                    y2={H - PAD.b}
                    stroke="#0f172a"
                    strokeWidth={1}
                    strokeDasharray="2 3"
                  />
                  <circle cx={sx(clampU)} cy={syY(y)} r={4.5} fill="#0284c7" />
                  <circle cx={sx(clampU)} cy={syD(dphi)} r={4.5} fill="#d97706" />
                  <text x={PAD.l - 4} y={syY(1) + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
                    1
                  </text>
                  <text x={PAD.l - 4} y={syY(0) + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
                    0
                  </text>
                  <text x={W - PAD.r} y={PAD.t + 9} fontSize="9" textAnchor="end" fill="#94a3b8">
                    u
                  </text>
                </svg>
                <div className="mt-1 flex flex-wrap gap-3 pl-8 text-[10px]">
                  <span className="flex items-center gap-1 text-sky-600">
                    <span className="inline-block h-0.5 w-4 bg-sky-600" />
                    y = φ(u) 시그모이드
                  </span>
                  <span className="flex items-center gap-1 text-amber-600">
                    <span className="inline-block h-0.5 w-4 border-t border-dashed border-amber-600" />
                    φ′(u) = (1 − y)y &nbsp;(세로 눈금은 0 ~ 0.25)
                  </span>
                </div>
              </Scroller>

              <div className="space-y-3">
                <Slider
                  label="픽셀값 x"
                  value={pixel}
                  min={0}
                  max={255}
                  step={1}
                  onChange={setPixel}
                  display={`${pixel} / 255`}
                />
                <Slider
                  label="가중치 w"
                  value={weight}
                  min={0.005}
                  max={0.2}
                  step={0.005}
                  onChange={setWeight}
                  display={fmt(weight, 3)}
                />
                <button
                  type="button"
                  onClick={() => setNormalized((v) => !v)}
                  className={`w-full rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    normalized
                      ? "border-sky-600 bg-sky-600 text-white"
                      : "border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300"
                  }`}
                >
                  {normalized ? "정규화 적용 중 (0~1)" : "정규화 끄기 (0~255 그대로)"}
                </button>
                <div className="rounded-lg bg-gray-50 p-2.5 font-mono text-[10.5px] leading-5 dark:bg-gray-800">
                  <div>입력값 = {fmt(x, 4)}</div>
                  <div>u = w·x = {fmt(u, 4)}</div>
                  <div>y = φ(u) = {fmt(y, 6)}</div>
                  <div className="font-bold text-amber-600 dark:text-amber-400">
                    φ′(u) = (1−y)y = {fmt(dphi, 6)}
                  </div>
                </div>
              </div>
            </div>

            <Scroller>
              <table className="mt-4 w-full min-w-[440px] text-[11.5px]">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                    <th className="px-2 py-1.5 font-semibold">입력</th>
                    <th className="px-2 py-1.5 font-semibold">x</th>
                    <th className="px-2 py-1.5 font-semibold">u = w·x</th>
                    <th className="px-2 py-1.5 font-semibold">y = φ(u)</th>
                    <th className="px-2 py-1.5 font-semibold">φ′(u)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="px-2 py-1.5 font-semibold text-rose-600">0~255 그대로</td>
                    <td className="px-2 py-1.5 font-mono">{pixel}</td>
                    <td className="px-2 py-1.5 font-mono">{fmt(uRaw, 3)}</td>
                    <td className="px-2 py-1.5 font-mono">{fmt(yRaw, 6)}</td>
                    <td className="px-2 py-1.5 font-mono font-bold">{dRaw.toExponential(2)}</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1.5 font-semibold text-sky-600">0~1로 정규화</td>
                    <td className="px-2 py-1.5 font-mono">{fmt(pixel / 255, 4)}</td>
                    <td className="px-2 py-1.5 font-mono">{fmt(uNorm, 4)}</td>
                    <td className="px-2 py-1.5 font-mono">{fmt(yNorm, 6)}</td>
                    <td className="px-2 py-1.5 font-mono font-bold">{fmt(dNorm, 6)}</td>
                  </tr>
                </tbody>
              </table>
            </Scroller>

            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              φ′(u)는 역전파 식 δₖ = −φᵒ′(uₖᵒ)(tₖ − yₖ)와 δⱼ = φʰ′(uⱼʰ) Σₖ δₖvⱼₖ 양쪽에 모두 곱해지는
              값입니다. 입력이 커서 u가 포화 구간에 들어가면 φ′이 0에 가까워지고, 그만큼 수정량 Δw = −ηδx도
              거의 0이 되어 학습이 더디게 됩니다. 입력 뉴런이 784개나 되는 MNIST에서는 모든 픽셀의 기여가
              합쳐지므로 더더욱 영향이 큽니다.
            </p>

            <ComputedNote>
              표의 수치는 시그모이드 함수와 그 미분식을 그대로 계산한 값입니다. 가중치 w는 포화를 확인하기
              위한 설명용 값으로, 교재·강의록에는 정규화의 필요성과 변환식만 제시되어 있습니다.
            </ComputedNote>
            <Hint>
              하이퍼탄젠트 함수도 마찬가지입니다. φ′(u) = (1 − y)(1 + y)이므로 y가 ±1에 가까워지면 미분값이
              0으로 떨어집니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
