"use client";

/** 1강에서 함께 쓰는 꽃잎 길이·폭 평면 그림 도구 */

import { irisPetals, type Boundary } from "@/components/dl1/irisData";

/** 그림 좌표계 — 서버·브라우저가 같은 문자열을 내도록 모든 좌표를 소수 둘째 자리에서 끊는다 */
export const PLOT = {
  w: 360,
  h: 250,
  left: 38,
  right: 10,
  top: 12,
  bottom: 30,
  xMin: 0.5,
  xMax: 7.2,
  yMin: 0,
  yMax: 2.8,
};

const innerW = PLOT.w - PLOT.left - PLOT.right;
const innerH = PLOT.h - PLOT.top - PLOT.bottom;

export function r2(v: number): number {
  return Math.round(v * 100) / 100;
}

export function px(x1: number): number {
  return r2(PLOT.left + ((x1 - PLOT.xMin) / (PLOT.xMax - PLOT.xMin)) * innerW);
}

export function py(x2: number): number {
  return r2(PLOT.top + innerH - ((x2 - PLOT.yMin) / (PLOT.yMax - PLOT.yMin)) * innerH);
}

/** 경계 직선이 그림 테두리와 만나는 두 점 */
export function boundarySegment(bd: Boundary): { x1: number; y1: number; x2: number; y2: number } | null {
  const pts: [number, number][] = [];
  const add = (a: number, b: number) => {
    if (a >= PLOT.xMin - 1e-9 && a <= PLOT.xMax + 1e-9 && b >= PLOT.yMin - 1e-9 && b <= PLOT.yMax + 1e-9) {
      pts.push([a, b]);
    }
  };
  if (Math.abs(bd.w2) > 1e-9) {
    add(PLOT.xMin, -(bd.w1 * PLOT.xMin + bd.b) / bd.w2);
    add(PLOT.xMax, -(bd.w1 * PLOT.xMax + bd.b) / bd.w2);
  }
  if (Math.abs(bd.w1) > 1e-9) {
    add(-(bd.w2 * PLOT.yMin + bd.b) / bd.w1, PLOT.yMin);
    add(-(bd.w2 * PLOT.yMax + bd.b) / bd.w1, PLOT.yMax);
  }
  if (pts.length < 2) return null;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  return { x1: px(a[0]), y1: py(a[1]), x2: px(b[0]), y2: py(b[1]) };
}

/** ŷ = 1 인 쪽을 덮는 다각형 — 테두리 네 꼭짓점 가운데 u ≥ 0 인 것만 모아 볼록껍질 순서로 잇는다 */
export function positiveRegion(bd: Boundary): string | null {
  const corners: [number, number][] = [
    [PLOT.xMin, PLOT.yMin],
    [PLOT.xMax, PLOT.yMin],
    [PLOT.xMax, PLOT.yMax],
    [PLOT.xMin, PLOT.yMax],
  ];
  const u = (p: [number, number]) => bd.w1 * p[0] + bd.w2 * p[1] + bd.b;
  const poly: [number, number][] = [];
  for (let i = 0; i < 4; i += 1) {
    const cur = corners[i];
    const nxt = corners[(i + 1) % 4];
    if (u(cur) >= 0) poly.push(cur);
    const uc = u(cur);
    const un = u(nxt);
    if ((uc >= 0 && un < 0) || (uc < 0 && un >= 0)) {
      const t = uc / (uc - un);
      poly.push([cur[0] + t * (nxt[0] - cur[0]), cur[1] + t * (nxt[1] - cur[1])]);
    }
  }
  if (poly.length < 3) return null;
  return poly.map(([a, b]) => `${px(a)},${py(b)}`).join(" ");
}

export function PlotFrame({
  xLabel = "petal length",
  yLabel = "petal width",
}: {
  xLabel?: string;
  yLabel?: string;
}) {
  const xTicks = [1, 2, 3, 4, 5, 6, 7];
  const yTicks = [0, 0.5, 1, 1.5, 2, 2.5];
  return (
    <g>
      {xTicks.map((t) => (
        <g key={`x${t}`}>
          <line
            x1={px(t)}
            y1={PLOT.top}
            x2={px(t)}
            y2={PLOT.h - PLOT.bottom}
            className="stroke-gray-200 dark:stroke-gray-700"
            strokeWidth={0.5}
          />
          <text
            x={px(t)}
            y={PLOT.h - PLOT.bottom + 12}
            textAnchor="middle"
            className="fill-gray-400 text-[8px]"
          >
            {t}
          </text>
        </g>
      ))}
      {yTicks.map((t) => (
        <g key={`y${t}`}>
          <line
            x1={PLOT.left}
            y1={py(t)}
            x2={PLOT.w - PLOT.right}
            y2={py(t)}
            className="stroke-gray-200 dark:stroke-gray-700"
            strokeWidth={0.5}
          />
          <text x={PLOT.left - 5} y={py(t) + 3} textAnchor="end" className="fill-gray-400 text-[8px]">
            {t}
          </text>
        </g>
      ))}
      <rect
        x={PLOT.left}
        y={PLOT.top}
        width={r2(innerW)}
        height={r2(innerH)}
        fill="none"
        className="stroke-gray-300 dark:stroke-gray-600"
      />
      <text
        x={PLOT.left + innerW / 2}
        y={PLOT.h - 3}
        textAnchor="middle"
        className="fill-gray-500 text-[9px]"
      >
        {xLabel}
      </text>
      <text
        x={10}
        y={PLOT.top + innerH / 2}
        textAnchor="middle"
        transform={`rotate(-90 10 ${r2(PLOT.top + innerH / 2)})`}
        className="fill-gray-500 text-[9px]"
      >
        {yLabel}
      </text>
    </g>
  );
}

/** 150개 표본 점 — target 종류는 자홍색, 나머지는 파란색 (강의록 실습 그림과 같은 색) */
export function PetalPoints({ targetIndex }: { targetIndex: number }) {
  return (
    <g>
      {irisPetals.map(([x1, x2, s], i) => (
        <circle
          key={i}
          cx={px(x1)}
          cy={py(x2)}
          r={2.2}
          fill={s === targetIndex ? "#d946ef" : "#2563eb"}
          fillOpacity={0.85}
        />
      ))}
    </g>
  );
}
