"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Formula, Hint, Scroller, Slider } from "./ui";
import { fmt } from "./mlpCore";

/* 가파른 내리막 → 긴 플라토 → 다시 내리막 모양의 설명용 오차함수 */
const sg = (u: number) => 1 / (1 + Math.exp(-u));
const E = (t: number) =>
  sg(-(t - 1.5) * 2.5) + 0.8 * sg(-(t - 9.5) * 2.5) + 0.2 + 0.002 * (t - 11) ** 2;
const dE = (t: number) => {
  const a = sg(-(t - 1.5) * 2.5);
  const b = sg(-(t - 9.5) * 2.5);
  return -2.5 * a * (1 - a) - 2.5 * 0.8 * b * (1 - b) + 0.004 * (t - 11);
};

const T_MIN = -0.5;
const T_MAX = 13.5;
const PLATEAU = [3, 8] as const;
const MAX_STEPS = 300;

const W = 460;
const H = 190;
const PAD = { l: 34, r: 14, t: 14, b: 26 };
const E_MIN = 0.15;
const E_MAX = 2.35;
const sx = (t: number) => PAD.l + ((t - T_MIN) / (T_MAX - T_MIN)) * (W - PAD.l - PAD.r);
const sy = (e: number) => H - PAD.b - ((e - E_MIN) / (E_MAX - E_MIN)) * (H - PAD.t - PAD.b);

const CURVE = (() => {
  const pts: string[] = [];
  for (let t = T_MIN; t <= T_MAX + 1e-9; t += 0.05) pts.push(`${sx(t)},${sy(E(t))}`);
  return pts.join(" ");
})();

function run(eta: number, momentum: number) {
  const path = [0];
  let t = 0;
  let v = 0;
  let inPlateau = 0;
  let escapedAt = -1;
  for (let i = 0; i < MAX_STEPS; i += 1) {
    v = -eta * dE(t) + momentum * v;
    t += v;
    if (!Number.isFinite(t)) break;
    t = Math.max(T_MIN, Math.min(T_MAX, t));
    path.push(t);
    if (t > PLATEAU[0] && t < PLATEAU[1]) inPlateau += 1;
    if (t > 9 && escapedAt < 0) escapedAt = i + 1;
  }
  return { path, inPlateau, escapedAt, final: t };
}

const ACCELERATION = [
  {
    name: "모멘텀 방법",
    en: "momentum",
    body: "바로 직전 단계의 수정에 사용된 수정항을 추가로 더해 주어 관성의 역할을 하도록 한다.",
  },
  {
    name: "뉴턴 방법",
    en: "Newton's method",
    body: "오차함수의 2차 미분을 사용한다.",
  },
  {
    name: "자연 기울기 방법",
    en: "natural gradient",
    body: "기울기를 새롭게 정의하여 사용한다.",
  },
];

export default function ConvergenceLab() {
  const [eta, setEta] = useState(3);
  const [momentum, setMomentum] = useState(0);
  const r = useMemo(() => run(eta, momentum), [eta, momentum]);

  const stuck = r.escapedAt < 0;

  return (
    <section id="convergence" className="scroll-mt-32">
      <SectionTitle
        title="수렴 속도의 문제와 플라토"
        subtitle="기울기가 완만한 구간에서 학습이 얼마나 느려지는지 반복 횟수로 세어 봅니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "11.3.2 학습의 고려사항 — 수렴 속도의 문제",
            slides: "MLP 학습의 고려사항 — 수렴 속도의 문제",
          }}
        >
          <Card>
            <CardTitle>원하는 해에 수렴하기까지 긴 학습 시간이 필요하다</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              기울기를 따라 강하하는 방법에서는 오차함수의 기울기가 완만한 지점에서 급격히 학습 속도가
              느려지는 현상이 나타납니다. 많은 경우 기울기가 완만한 지역에서의 학습이 전체 학습 시간의
              대부분을 차지하게 되어 결과적으로 학습이 매우 느려지는데, 이를 <strong>플라토 문제</strong>
              (plateau problem)라고 합니다.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
              <Scroller>
                <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[420px]">
                  <rect
                    x={sx(PLATEAU[0])}
                    y={PAD.t}
                    width={sx(PLATEAU[1]) - sx(PLATEAU[0])}
                    height={H - PAD.t - PAD.b}
                    fill="#fecaca"
                    opacity={0.35}
                  />
                  <text
                    x={(sx(PLATEAU[0]) + sx(PLATEAU[1])) / 2}
                    y={PAD.t + 12}
                    fontSize="10"
                    textAnchor="middle"
                    fill="#dc2626"
                  >
                    플라토 plateau
                  </text>
                  <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="#cbd5e1" />
                  <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="#cbd5e1" />
                  <polyline points={CURVE} fill="none" stroke="#0284c7" strokeWidth={2} />
                  {r.path.map((t, i) => (
                    <circle
                      key={i}
                      cx={sx(t)}
                      cy={sy(E(t))}
                      r={2}
                      fill={t > PLATEAU[0] && t < PLATEAU[1] ? "#dc2626" : "#334155"}
                      opacity={0.45}
                    />
                  ))}
                  <circle cx={sx(r.final)} cy={sy(E(r.final))} r={5.5} fill="#0f172a" />
                  <text x={PAD.l - 4} y={PAD.t + 8} fontSize="9" textAnchor="end" fill="#94a3b8">
                    E(θ)
                  </text>
                  <text x={W - PAD.r} y={H - 8} fontSize="9" textAnchor="end" fill="#94a3b8">
                    θ
                  </text>
                </svg>
              </Scroller>

              <div className="space-y-3">
                <Slider
                  label="학습률 η"
                  value={eta}
                  min={0.5}
                  max={8}
                  step={0.5}
                  onChange={setEta}
                  display={fmt(eta, 1)}
                />
                <Slider
                  label="모멘텀 계수 α"
                  value={momentum}
                  min={0}
                  max={0.95}
                  step={0.05}
                  onChange={setMomentum}
                  display={fmt(momentum, 2)}
                />
                <Formula>Δθ⁽τ⁾ = −η ∂E/∂θ + α Δθ⁽τ⁻¹⁾</Formula>
                <div className="rounded-lg bg-gray-50 p-2.5 font-mono text-[10.5px] leading-5 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  <div>
                    플라토에 머문 반복 횟수 ={" "}
                    <span className="font-bold text-rose-600 dark:text-rose-400">{r.inPlateau}</span>
                  </div>
                  <div>
                    플라토를 벗어난 시점 ={" "}
                    <span className="font-bold text-sky-600 dark:text-sky-400">
                      {stuck ? `${MAX_STEPS}회 안에 못 벗어남` : `${r.escapedAt}회째`}
                    </span>
                  </div>
                  <div>마지막 θ = {fmt(r.final, 3)} · E = {fmt(E(r.final), 4)}</div>
                </div>
                <Hint>
                  α = 0이 기본 기울기 강하입니다. α를 올리면 직전 수정항이 관성으로 더해져 완만한 구간을
                  빠르게 지나갑니다.
                </Hint>
              </div>
            </div>

            <ComputedNote>
              플라토를 한눈에 보기 위해 만든 설명용 1차원 오차함수입니다. 교재·강의록에는 같은 모양의
              그림만 있고 함수식은 없습니다. 궤적과 반복 횟수는 위 수정식을 그대로 반복 계산한 값입니다.
            </ComputedNote>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "11.3.2 — 가속화 방법",
            slides: "MLP 학습의 고려사항 — 다양한 가속화 방법들이 존재",
          }}
        >
          <Card>
            <CardTitle>제안된 가속화 방법</CardTitle>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {ACCELERATION.map((a) => (
                <div key={a.name} className="rounded-lg border border-gray-200 p-2.5 dark:border-gray-700">
                  <p className="text-[12px] font-bold text-sky-700 dark:text-sky-300">{a.name}</p>
                  <p className="text-[10px] text-gray-400">{a.en}</p>
                  <p className="mt-1 text-[11px] leading-5 text-gray-600 dark:text-gray-400">{a.body}</p>
                </div>
              ))}
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
