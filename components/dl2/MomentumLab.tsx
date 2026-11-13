"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Scroller, ComputedNote, fmt, q12 } from "@/components/dlShared/ui";
import { F, Slider2, Cell, r2 } from "@/components/dl2/ui2";

/** 이 페이지에서 정한 예시 손실면 — 얕은 골 하나와 깊은 골 하나 */
const E = (w: number) => q12(0.25 * w ** 4 - w ** 2 + 0.7 * w);
const dE = (w: number) => q12(w ** 3 - 2 * w + 0.7);
const W0 = 1.9;

function run(eta: number, m: number, steps: number) {
  const pts: number[] = [q12(W0)];
  let w = pts[0];
  let v = 0;
  for (let i = 0; i < steps; i++) {
    const dw = q12(eta * dE(w)); // Δw(t) = η ∂E/∂w
    v = q12(m * v - dw); // v(t) = m v(t−1) − Δw(t)
    w = q12(w + v); // w(t+1) = w(t) + v(t)
    if (!Number.isFinite(w) || Math.abs(w) > 3) {
      pts.push(q12(Math.max(-3, Math.min(3, w))));
      break;
    }
    pts.push(w);
  }
  return pts;
}

export default function MomentumLab() {
  const [m, setM] = useState(0.9);
  const [eta, setEta] = useState(0.08);
  const [steps, setSteps] = useState(40);

  const pts = run(eta, m, steps);
  const plain = run(eta, 0, steps);
  const w = pts[pts.length - 1];
  const wPlain = plain[plain.length - 1];
  const escaped = w < 0;

  const SX = (v: number) => r2(((v + 2.3) / 4.6) * 260);
  const SY = (v: number) => r2(110 - v * 38);
  const curve = Array.from({ length: 93 }, (_, i) => {
    const x = q12(-2.3 + i * 0.05);
    return `${SX(x)},${SY(E(x))}`;
  }).join(" ");

  return (
    <section id="momentum" className="scroll-mt-32">
      <SectionTitle
        title="모멘텀 — 이전 변화량을 이어받기"
        subtitle="가중치의 변화량을 '속도'로 보고, 직전 속도를 일정 비율로 물려받습니다"
      />

      <Sourced
        refs={{
          slides: "4. 모멘텀을 이용한 학습 — 가속 기법을 이용한 경사 하강법의 개선",
          lecture: "지역 최소치를 타고 넘어 전역 최소치로 향할 가능성을 높여 준다 — 다만 약간 진동할 수 있다",
        }}
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <Card className="min-w-0">
            <CardTitle>식 세 줄</CardTitle>
            <div className="space-y-2">
              <F note="가중치는 속도만큼 움직인다">w(t+1) = w(t) + v(t)</F>
              <F note="직전 속도를 모멘텀 m의 비율로 반영함">v(t) = m·v(t−1) − Δw(t)</F>
              <F note="Δw는 기존 경사 하강법의 변화량 그대로">Δw(t) = η ∂E/∂w</F>
            </div>

            <div className="mt-4 space-y-2.5">
              <Slider2
                label="모멘텀 m"
                value={m}
                min={0}
                max={0.95}
                step={0.05}
                onChange={setM}
                display={fmt(m, 2)}
              />
              <Slider2
                label="학습률 η"
                value={eta}
                min={0.02}
                max={0.2}
                step={0.01}
                onChange={setEta}
                display={fmt(eta, 2)}
              />
              <Slider2
                label="걸음 수"
                value={steps}
                min={0}
                max={60}
                step={1}
                onChange={setSteps}
                display={`${steps}걸음`}
              />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-1.5">
              <Cell label="모멘텀 적용" value={fmt(w, 3)} highlight tone={escaped ? "indigo" : "rose"} />
              <Cell label="모멘텀 없음 (m=0)" value={fmt(wPlain, 3)} />
            </div>
            <div
              className={`mt-2 rounded-lg px-2.5 py-1.5 text-[11.5px] leading-5 ${
                escaped
                  ? "bg-indigo-50 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-200"
                  : "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
              }`}
            >
              {escaped
                ? "이전 변화의 경향을 이어받은 덕분에 얕은 골을 타고 넘어 더 깊은 골로 내려갔습니다."
                : "모멘텀이 작아 처음 만난 얕은 골에서 멈춰 섰습니다. m을 키워 보세요."}
            </div>
          </Card>

          <Card className="min-w-0">
            <CardTitle>같은 자리에서 출발한 두 경로</CardTitle>
            <Scroller>
              <svg viewBox="0 0 275 150" className="h-auto w-full min-w-[290px]" role="img">
                <title>얕은 골과 깊은 골이 있는 손실 곡선 위를 내려가는 두 경로</title>
                <polyline
                  points={curve}
                  fill="none"
                  strokeWidth="2"
                  className="stroke-gray-400 dark:stroke-gray-500"
                />
                {plain.map((v, i) => (
                  <circle
                    key={`p-${i}`}
                    cx={SX(v)}
                    cy={SY(E(v))}
                    r="2"
                    className="fill-gray-400 dark:fill-gray-500"
                    opacity="0.7"
                  />
                ))}
                {pts.map((v, i) => (
                  <circle
                    key={`m-${i}`}
                    cx={SX(v)}
                    cy={SY(E(v))}
                    r={i === pts.length - 1 ? 4.5 : 2.4}
                    className={i === pts.length - 1 ? "fill-indigo-600" : "fill-indigo-400"}
                  />
                ))}
                <circle cx={SX(W0)} cy={SY(E(W0))} r="3" className="fill-rose-500" />
                <text x={SX(W0) - 6} y={SY(E(W0)) - 8} className="fill-rose-500 text-[8px] font-bold">
                  출발
                </text>
                <text x={SX(1.19) - 16} y={SY(E(1.19)) + 16} className="fill-gray-500 text-[8px]">
                  얕은 골
                </text>
                <text x={SX(-1.57) - 16} y={SY(E(-1.57)) + 16} className="fill-gray-500 text-[8px]">
                  깊은 골
                </text>
                <g transform="translate(6, 10)">
                  <circle cx="4" cy="0" r="3" className="fill-indigo-500" />
                  <text x="11" y="3" className="fill-gray-500 text-[8px]">
                    모멘텀 m = {fmt(m, 2)}
                  </text>
                  <circle cx="4" cy="12" r="3" className="fill-gray-400" />
                  <text x="11" y="15" className="fill-gray-500 text-[8px]">
                    모멘텀 없음
                  </text>
                </g>
                <text x="246" y="146" className="fill-gray-500 text-[8px]">
                  w →
                </text>
              </svg>
            </Scroller>
            <Hint>
              모멘텀은 변화의 방향이 급격히 바뀌는 것을 완화해 줍니다. 그래서 직전까지 내려오던
              기세가 남아 작은 골을 그냥 지나칠 수 있습니다.
            </Hint>
            <ComputedNote>
              이 손실 곡선과 출발점은 모멘텀의 효과를 눈으로 보려고 이 페이지에서 정한 예시입니다.
              강의록에는 자전거 그림과 위 세 식이 나옵니다.
            </ComputedNote>
          </Card>
        </div>
      </Sourced>
    </section>
  );
}
