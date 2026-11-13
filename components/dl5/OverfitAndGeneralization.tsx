"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Chip, Slider, ComputedNote, Scroller, fmt } from "@/components/dlShared/ui";

type Fit = "under" | "good" | "over";

function r2(v: number) {
  return Math.round(v * 100) / 100;
}

/* 분포 그림의 표본 — 매번 같은 그림이 나오도록 좌표를 고정해 둔다 */
const GREEN: [number, number][] = [
  [18, 30], [10, 58], [26, 52], [14, 86], [32, 78], [8, 108], [24, 112], [40, 96],
  [16, 136], [34, 142], [52, 124], [48, 160], [28, 170], [12, 162], [62, 150],
  [66, 182], [44, 188], [22, 196], [84, 168], [96, 190], [74, 200], [52, 206],
  [104, 206], [126, 196], [148, 204], [88, 132], [60, 108],
];
const RED: [number, number][] = [
  [92, 34], [116, 28], [140, 36], [164, 26], [104, 60], [130, 56], [154, 62],
  [178, 48], [96, 86], [124, 82], [150, 90], [176, 78], [110, 112], [138, 116],
  [162, 108], [186, 100], [120, 140], [146, 146], [170, 134], [134, 166],
];

const BOUNDARIES: Record<Fit, { d: string; color: string; label: string; desc: string }> = {
  under: {
    d: "M46,8 L176,214",
    color: "#334155",
    label: "과소적합",
    desc: "너무 단순한 직선 경계. 훈련 표본조차 제대로 가르지 못해 훈련 손실도 일반화 손실도 큼.",
  },
  good: {
    d: "M84,8 C68,46 70,84 80,118 C90,150 104,176 126,214",
    color: "#2563eb",
    label: "적정 경계",
    desc: "표본의 분포 특성은 반영하되 지나치게 복잡하지 않은 경계. 일반화 손실이 가장 작은 지점.",
  },
  over: {
    d: "M86,8 C64,30 86,48 70,62 C52,78 84,92 66,106 C50,120 88,130 72,146 C56,162 96,170 80,186 C70,198 104,204 126,214",
    color: "#dc2626",
    label: "과적합",
    desc: "표본 하나하나까지 감싸는 복잡한 경계. 훈련 표본은 거의 전부 맞히지만, 훈련에 쓰지 않은 표본에서는 오히려 성능이 떨어짐.",
  },
};

/* 손실 곡선 — 모델 복잡도에 따른 훈련 손실과 일반화 손실 */
const trainLoss = (c: number) => r2(0.1 + 0.95 / (1 + 0.6 * c));
const genLoss = (c: number) => r2(0.1 + 0.95 / (1 + 0.6 * c) + 0.0045 * c * c + 0.1);

export default function OverfitAndGeneralization() {
  const [fit, setFit] = useState<Fit>("good");
  const [complexity, setComplexity] = useState(5);

  const VIEW_W = 380;
  const VIEW_H = 200;
  const CMAX = 14;
  const px = (c: number) => r2(36 + (c / CMAX) * (VIEW_W - 52));
  const py = (v: number) => r2(12 + (1 - Math.min(v, 1.3) / 1.3) * (VIEW_H - 42));

  const cs = Array.from({ length: CMAX * 4 + 1 }, (_, i) => i / 4);
  const trainPath = cs.map((c, i) => `${i === 0 ? "M" : "L"}${px(c)},${py(trainLoss(c))}`).join(" ");
  const genPath = cs.map((c, i) => `${i === 0 ? "M" : "L"}${px(c)},${py(genLoss(c))}`).join(" ");

  // 일반화 손실이 가장 작은 복잡도
  let best = 0;
  for (const c of cs) if (genLoss(c) < genLoss(best)) best = c;

  const zone = complexity < best - 1.5 ? "과소적합" : complexity > best + 1.5 ? "과적합" : "최적";
  const zoneTone =
    zone === "최적"
      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
      : "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200";

  return (
    <section id="overfitting-generalization" className="scroll-mt-32">
      <SectionTitle
        title="과적합과 일반화 오류"
        subtitle="훈련 손실은 계속 줄어도, 훈련에 쓰지 않은 데이터의 손실은 어느 지점부터 다시 올라간다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            slides: "과적합(overfitting)",
            lecture: "성능이 떨어지는 원인이 됨",
          }}
        >
          <Card>
            <CardTitle>경계를 바꿔 가며 보기</CardTitle>
            <p className="mb-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              <b>과적합</b>이란 훈련에 사용한 데이터 집합에 지나치게 맞추어져 새로운 데이터에 대한 성능이 낮아지는
              현상임.
            </p>

            <div className="mb-3 flex flex-wrap gap-2">
              {(["under", "good", "over"] as Fit[]).map((k) => (
                <Chip key={k} active={fit === k} onClick={() => setFit(k)}>
                  {BOUNDARIES[k].label}
                </Chip>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
              <Scroller>
                <svg
                  viewBox="0 0 220 222"
                  className="h-auto w-full min-w-[200px]"
                  role="img"
                  aria-label={`두 클래스의 표본과 ${BOUNDARIES[fit].label} 경계`}
                >
                  <rect x="0" y="0" width="220" height="222" className="fill-white dark:fill-gray-950" />
                  {GREEN.map(([x, y]) => (
                    <circle key={`g${x}-${y}`} cx={x} cy={y} r="4.6" fill="#4d7c0f" opacity="0.85" />
                  ))}
                  {RED.map(([x, y]) => (
                    <g key={`r${x}-${y}`} stroke="#f87171" strokeWidth="2.6" strokeLinecap="round">
                      <line x1={x - 4} y1={y - 4} x2={x + 4} y2={y + 4} />
                      <line x1={x - 4} y1={y + 4} x2={x + 4} y2={y - 4} />
                    </g>
                  ))}
                  <path d={BOUNDARIES[fit].d} fill="none" stroke={BOUNDARIES[fit].color} strokeWidth="2.4" />
                </svg>
              </Scroller>

              <div>
                <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                  <b style={{ color: BOUNDARIES[fit].color }}>{BOUNDARIES[fit].label}</b> — {BOUNDARIES[fit].desc}
                </p>
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[12.5px] leading-6 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
                  <b>규제(regularization)</b>: 모델 복잡도를 낮추어 더 &lsquo;단순&rsquo;한 모델로 만들기 위한 처리
                  절차.
                </p>
                <ComputedNote>표본의 위치와 경계 모양은 강의록 그림을 본떠 이 페이지에서 그린 것임.</ComputedNote>
              </div>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "모델 복잡도와 일반화 손실",
            lecture: "최저점이 최적 복잡도",
          }}
        >
          <Card>
            <CardTitle>모델 복잡도를 밀어 보기</CardTitle>

            <Slider
              label={<span>모델 복잡도</span>}
              value={complexity}
              min={0.5}
              max={CMAX}
              step={0.5}
              onChange={setComplexity}
              display={fmt(complexity, 1)}
            />

            <Scroller>
              <svg
                viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                className="mt-3 h-auto w-full min-w-[340px]"
                role="img"
                aria-label="모델 복잡도에 따른 훈련 손실과 일반화 손실 곡선"
              >
                <line x1="36" y1={VIEW_H - 26} x2={VIEW_W - 14} y2={VIEW_H - 26} stroke="#cbd5e1" strokeWidth="1" />
                <line x1="36" y1="10" x2="36" y2={VIEW_H - 26} stroke="#cbd5e1" strokeWidth="1" />
                <text x="2" y="18" className="fill-gray-400 text-[9px]">
                  손실
                </text>
                <text x={VIEW_W - 62} y={VIEW_H - 9} className="fill-gray-400 text-[9px]">
                  모델 복잡도
                </text>

                {/* 최적 지점 */}
                <line
                  x1={px(best)}
                  y1="10"
                  x2={px(best)}
                  y2={VIEW_H - 26}
                  stroke="#dc2626"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
                <text x={px(best) - 10} y="8" className="fill-red-600 text-[9px] font-bold">
                  최적
                </text>

                <path d={genPath} fill="none" stroke="#f97316" strokeWidth="2.2" />
                <path d={trainPath} fill="none" stroke="#2563eb" strokeWidth="2.2" />

                <line
                  x1={px(complexity)}
                  y1="10"
                  x2={px(complexity)}
                  y2={VIEW_H - 26}
                  stroke="#8b5cf6"
                  strokeWidth="1.5"
                />
                <circle cx={px(complexity)} cy={py(trainLoss(complexity))} r="4.5" fill="#2563eb" />
                <circle cx={px(complexity)} cy={py(genLoss(complexity))} r="4.5" fill="#f97316" />
              </svg>
            </Scroller>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px]">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-5 bg-blue-600" /> 훈련 손실 {fmt(trainLoss(complexity), 2)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-5 bg-orange-500" /> 일반화 손실 {fmt(genLoss(complexity), 2)}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${zoneTone}`}>{zone}</span>
            </div>

            <Hint>
              복잡도를 키우면 훈련 손실은 계속 줄지만 일반화 손실은 최저점을 지나 다시 올라간다. 이 최저점이 최적에
              해당되는 복잡도이고, 그보다 오른쪽이 과적합, 왼쪽이 과소적합이다.
            </Hint>

            <ComputedNote>곡선의 수치는 모양을 보여 주기 위해 이 페이지에서 정한 값임. 강의록 그림에는 눈금이 없음.</ComputedNote>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
