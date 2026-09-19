import type { Vec } from "./svmCore";

export const C1_COLOR = "#4f46e5";
export const C2_COLOR = "#f59e0b";
export const SV_COLOR = "#10b981";
export const ERR_COLOR = "#e11d48";

export interface Frame {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  width: number;
  height: number;
  pad: number;
}

export function makeScale(f: Frame) {
  const sx = (x: number) => f.pad + ((x - f.xMin) / (f.xMax - f.xMin)) * (f.width - 2 * f.pad);
  const sy = (y: number) =>
    f.height - f.pad - ((y - f.yMin) / (f.yMax - f.yMin)) * (f.height - 2 * f.pad);
  /** SVG 좌표 → 데이터 좌표 */
  const inv = (px: number, py: number): Vec => [
    f.xMin + ((px - f.pad) / (f.width - 2 * f.pad)) * (f.xMax - f.xMin),
    f.yMin + ((f.height - f.pad - py) / (f.height - 2 * f.pad)) * (f.yMax - f.yMin),
  ];
  return { sx, sy, inv };
}

/**
 * 직선 w₁x₁ + w₂x₂ + w₀ = level 을 그림 영역으로 잘라 두 끝점을 돌려준다.
 * 영역과 만나지 않으면 null.
 */
export function clipLine(w: Vec, w0: number, f: Frame, level = 0): [Vec, Vec] | null {
  const [a, b] = w;
  const c = w0 - level;
  const pts: Vec[] = [];
  const eps = 1e-9;
  if (Math.abs(b) > eps) {
    for (const x of [f.xMin, f.xMax]) {
      const y = -(a * x + c) / b;
      if (y >= f.yMin - eps && y <= f.yMax + eps) pts.push([x, y]);
    }
  }
  if (Math.abs(a) > eps) {
    for (const y of [f.yMin, f.yMax]) {
      const x = -(b * y + c) / a;
      if (x >= f.xMin - eps && x <= f.xMax + eps) pts.push([x, y]);
    }
  }
  const uniq: Vec[] = [];
  for (const p of pts) {
    if (!uniq.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 1e-6)) uniq.push(p);
  }
  return uniq.length >= 2 ? [uniq[0], uniq[1]] : null;
}

/** 직선으로 잘린 영역 중 w₁x₁ + w₂x₂ + w₀ > 0 쪽 다각형 */
export function halfPlanePolygon(w: Vec, w0: number, f: Frame): Vec[] {
  const corners: Vec[] = [
    [f.xMin, f.yMin],
    [f.xMax, f.yMin],
    [f.xMax, f.yMax],
    [f.xMin, f.yMax],
  ];
  const g = (p: Vec) => w[0] * p[0] + w[1] * p[1] + w0;
  const out: Vec[] = [];
  for (let i = 0; i < 4; i += 1) {
    const p = corners[i];
    const q = corners[(i + 1) % 4];
    const gp = g(p);
    const gq = g(q);
    if (gp > 0) out.push(p);
    if ((gp > 0) !== (gq > 0)) {
      const t = gp / (gp - gq);
      out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
    }
  }
  return out;
}

export const fmt = (v: number, d = 2) => {
  const r = Number(v.toFixed(d));
  return (Object.is(r, -0) ? 0 : r).toString();
};

/** 부호가 붙은 항 — "+ 0.5", "− 1.2" */
export const signed = (v: number, d = 2) =>
  v < 0 ? `− ${fmt(Math.abs(v), d)}` : `+ ${fmt(v, d)}`;

/** 볼록 다각형을 h(p) ≥ 0 인 쪽만 남기도록 자른다 */
function clipByHalfPlane(poly: Vec[], h: (p: Vec) => number): Vec[] {
  const out: Vec[] = [];
  for (let i = 0; i < poly.length; i += 1) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const hp = h(p);
    const hq = h(q);
    if (hp >= 0) out.push(p);
    if ((hp >= 0) !== (hq >= 0)) {
      const t = hp / (hp - hq);
      out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
    }
  }
  return out;
}

/** lo ≤ w₁x₁ + w₂x₂ + w₀ ≤ hi 인 띠를 그림 영역으로 자른 다각형 */
export function bandPolygon(w: Vec, w0: number, lo: number, hi: number, f: Frame): Vec[] {
  const g = (p: Vec) => w[0] * p[0] + w[1] * p[1] + w0;
  let poly: Vec[] = [
    [f.xMin, f.yMin],
    [f.xMax, f.yMin],
    [f.xMax, f.yMax],
    [f.xMin, f.yMax],
  ];
  poly = clipByHalfPlane(poly, (p) => g(p) - lo);
  if (poly.length < 3) return [];
  poly = clipByHalfPlane(poly, (p) => hi - g(p));
  return poly.length < 3 ? [] : poly;
}
