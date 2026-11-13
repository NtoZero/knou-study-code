"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Formula, Hint, Slider, Scroller, Tag, fmt, q12 } from "@/components/dlShared/ui";

const W = 300;
const H = 300;
const PAD = 26;
const LO = -3;
const HI = 3;

const r2 = (v: number) => Math.round(v * 100) / 100;
const sx = (x: number) => r2(PAD + ((x - LO) / (HI - LO)) * (W - 2 * PAD));
const sy = (y: number) => r2(H - PAD - ((y - LO) / (HI - LO)) * (H - 2 * PAD));

/** 직선 w₁x₁ + w₂x₂ + b = 0 이 그림 테두리와 만나는 두 점 */
function segment(w1: number, w2: number, b: number) {
  const pts: [number, number][] = [];
  const add = (a: number, c: number) => {
    if (a >= LO - 1e-9 && a <= HI + 1e-9 && c >= LO - 1e-9 && c <= HI + 1e-9) pts.push([a, c]);
  };
  if (Math.abs(w2) > 1e-9) {
    add(LO, -(w1 * LO + b) / w2);
    add(HI, -(w1 * HI + b) / w2);
  }
  if (Math.abs(w1) > 1e-9) {
    add(-(w2 * LO + b) / w1, LO);
    add(-(w2 * HI + b) / w1, HI);
  }
  if (pts.length < 2) return null;
  return [pts[0], pts[pts.length - 1]] as [[number, number], [number, number]];
}

/** ŷ = 1 인 쪽(u ≥ 0)을 덮는 다각형 */
function region(w1: number, w2: number, b: number) {
  const corners: [number, number][] = [
    [LO, LO],
    [HI, LO],
    [HI, HI],
    [LO, HI],
  ];
  const u = (p: [number, number]) => w1 * p[0] + w2 * p[1] + b;
  const poly: [number, number][] = [];
  for (let i = 0; i < 4; i += 1) {
    const cur = corners[i];
    const nxt = corners[(i + 1) % 4];
    const uc = u(cur);
    const un = u(nxt);
    if (uc >= 0) poly.push(cur);
    if ((uc >= 0 && un < 0) || (uc < 0 && un >= 0)) {
      const t = uc / (uc - un);
      poly.push([cur[0] + t * (nxt[0] - cur[0]), cur[1] + t * (nxt[1] - cur[1])]);
    }
  }
  if (poly.length < 3) return null;
  return poly.map(([a, c]) => `${sx(a)},${sy(c)}`).join(" ");
}

export default function DecisionBoundary() {
  const [w1, setW1] = useState(1);
  const [w2, setW2] = useState(1.2);
  const [b, setB] = useState(-0.6);
  const [p, setP] = useState<[number, number]>([1.2, 1.4]);

  const seg = segment(w1, w2, b);
  const poly = region(w1, w2, b);
  const u = q12(w1 * p[0] + w2 * p[1] + b);
  const yhat = u >= 0 ? 1 : 0;

  // 법선벡터 (w₁, w₂) — 직선 위의 한 점에서 그린다
  const norm = Math.hypot(w1, w2) || 1;
  const foot: [number, number] = [r2((-b * w1) / (norm * norm)), r2((-b * w2) / (norm * norm))];
  const tipRaw: [number, number] = [foot[0] + (w1 / norm) * 1.1, foot[1] + (w2 / norm) * 1.1];
  const tip: [number, number] = [
    r2(Math.max(LO, Math.min(HI, tipRaw[0]))),
    r2(Math.max(LO, Math.min(HI, tipRaw[1]))),
  ];
  const footIn = foot[0] >= LO && foot[0] <= HI && foot[1] >= LO && foot[1] <= HI;

  const click = (e: React.MouseEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const vx = ((e.clientX - box.left) / box.width) * W;
    const vy = ((e.clientY - box.top) / box.height) * H;
    const x = LO + ((vx - PAD) / (W - 2 * PAD)) * (HI - LO);
    const y = LO + ((H - PAD - vy) / (H - 2 * PAD)) * (HI - LO);
    setP([
      r2(Math.max(LO, Math.min(HI, x))),
      r2(Math.max(LO, Math.min(HI, y))),
    ]);
  };

  return (
    <section id="decision-boundary" className="scroll-mt-32">
      <SectionTitle
        title="학습 결과는 선형 결정경계"
        subtitle="가중치와 바이어스를 움직이면 평면을 가르는 직선이 어떻게 변하는지 봅니다"
      />

      <Sourced
        refs={{
          slides: "2. 단층 퍼셉트론 — 학습 결과 선형 결정경계를 형성함 (예: 2차원 입력에 대한 결정경계)",
          lecture: "2차원이면 직선, 3차원이면 평면, 그 이상은 초평면이라고 부른다",
        }}
      >
        <Card>
          <CardTitle>ŷ = 1 인 영역과 ŷ = 0 인 영역 사이의 경계는 u = 0</CardTitle>

          <Formula note="이 식은 x₁·x₂ 평면 위의 직선 방정식">
            u = w₁x₁ + w₂x₂ + b ,&nbsp;&nbsp; u ≥ 0 → ŷ = 1 ,&nbsp;&nbsp; u &lt; 0 → ŷ = 0
          </Formula>

          <div className="mt-3 grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
            <Scroller>
              <svg
                viewBox={`0 0 ${W} ${H}`}
                onClick={click}
                className="h-auto w-[300px] min-w-[260px] cursor-crosshair"
              >
                <rect
                  x={PAD}
                  y={PAD}
                  width={W - 2 * PAD}
                  height={H - 2 * PAD}
                  className="fill-emerald-50 dark:fill-emerald-950/30"
                />
                {poly && <polygon points={poly} className="fill-amber-100 dark:fill-amber-900/30" />}
                {[-3, -2, -1, 0, 1, 2, 3].map((t) => (
                  <g key={t}>
                    <line x1={sx(t)} y1={PAD} x2={sx(t)} y2={H - PAD} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth={0.5} />
                    <line x1={PAD} y1={sy(t)} x2={W - PAD} y2={sy(t)} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth={0.5} />
                  </g>
                ))}
                <line x1={sx(0)} y1={PAD} x2={sx(0)} y2={H - PAD} className="stroke-gray-400" strokeWidth={1} />
                <line x1={PAD} y1={sy(0)} x2={W - PAD} y2={sy(0)} className="stroke-gray-400" strokeWidth={1} />

                {seg && (
                  <line
                    x1={sx(seg[0][0])}
                    y1={sy(seg[0][1])}
                    x2={sx(seg[1][0])}
                    y2={sy(seg[1][1])}
                    stroke="#0ea5e9"
                    strokeWidth={2.2}
                  />
                )}

                {footIn && (
                  <g>
                    <line
                      x1={sx(foot[0])}
                      y1={sy(foot[1])}
                      x2={sx(tip[0])}
                      y2={sy(tip[1])}
                      stroke="#e11d48"
                      strokeWidth={2}
                    />
                    <circle cx={sx(tip[0])} cy={sy(tip[1])} r={3} fill="#e11d48" />
                    <text x={sx(tip[0]) + 6} y={sy(tip[1]) - 4} className="fill-rose-600 text-[9px]">
                      (w₁, w₂)
                    </text>
                  </g>
                )}

                <circle cx={sx(p[0])} cy={sy(p[1])} r={5} fill={yhat === 1 ? "#d946ef" : "#2563eb"} />
                <circle cx={sx(p[0])} cy={sy(p[1])} r={8} fill="none" stroke={yhat === 1 ? "#d946ef" : "#2563eb"} strokeWidth={1} />

                <text x={W - PAD - 4} y={sy(0) - 6} textAnchor="end" className="fill-gray-500 text-[10px]">x₁</text>
                <text x={sx(0) + 6} y={PAD + 10} className="fill-gray-500 text-[10px]">x₂</text>
              </svg>
              <p className="mt-1 text-[11px] text-gray-500">그림 안을 클릭하면 표본이 그 자리로 옮겨 갑니다.</p>
            </Scroller>

            <div className="min-w-0 space-y-2">
              <Slider label="w₁" value={w1} min={-2} max={2} step={0.1} onChange={(v) => setW1(r2(v))} display={fmt(w1, 1)} />
              <Slider label="w₂" value={w2} min={-2} max={2} step={0.1} onChange={(v) => setW2(r2(v))} display={fmt(w2, 1)} />
              <Slider label="b" value={b} min={-3} max={3} step={0.1} onChange={(v) => setB(r2(v))} display={fmt(b, 1)} />

              <div className="rounded-lg bg-gray-50 p-3 font-mono text-[12px] leading-6 text-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
                <p>경계 : {fmt(w1, 1)}x₁ + {fmt(w2, 1)}x₂ + {fmt(b, 1)} = 0</p>
                <p>
                  표본 ({fmt(p[0], 2)}, {fmt(p[1], 2)}) → u = {fmt(u, 3)} → ŷ = <b>{yhat}</b>
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <Tag tone="teal">노란 영역 : u ≥ 0 → ŷ = 1</Tag>
                <Tag>초록 영역 : u &lt; 0 → ŷ = 0</Tag>
              </div>

              <Hint>
                붉은 화살표가 가리키는 쪽이 가중치 벡터 (w₁, w₂) 방향이고, 그쪽이 u가 커지는 영역, 즉 ŷ =
                1 인 영역입니다. b만 움직이면 직선의 기울기는 그대로인 채 위치만 평행하게 옮겨 갑니다.
              </Hint>
            </div>
          </div>
        </Card>
      </Sourced>
    </section>
  );
}
