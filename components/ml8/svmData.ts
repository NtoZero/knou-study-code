/**
 * 8강 실습 데이터. 모두 직접 정한 값이거나 고정 시드로 만든 값이라 매번 같은 그림이 나온다.
 */

import { lcg, type Sample, type Vec } from "./svmCore";

/* ─────────── 10.1.1 학습 시스템의 복잡도와 일반화 오차 ─────────── */

/** 선형 결정경계(낮은 복잡도) */
export const complexityLinear = (x: number) => 2.2 + 0.25 * x;
/** 비선형 결정경계(높은 복잡도) */
export const complexityNonlinear = (x: number) =>
  2.2 + 0.25 * x + 1.3 * Math.sin(1.1 * (x - 1.5));

type Labeled = [number, number, 1 | -1];

/** (a) 학습 데이터 — 경계 위쪽이 C₁(+1) */
export const complexityTrain: Labeled[] = [
  [2.7, 5.2, 1], [6, 5.3, 1], [1, 4.9, 1], [3.8, 0.6, -1], [1.2, 5.6, 1], [9.2, 3.2, -1],
  [5.9, 4.5, 1], [7.5, 2.6, -1], [4.8, 4.9, 1], [1.4, 4.3, 1], [7.9, 2.2, -1], [2.2, 5.6, 1],
  [4.6, 0.9, -1], [1.6, 3.7, 1], [2.9, 3.5, -1], [5.8, 3, 1],
];

/** (b) 학습에 쓰지 않은 데이터 — 학습 데이터와 같은 분포 */
export const complexityTestSimilar: Labeled[] = [
  [2.2, 0.3, -1], [6.7, 4.4, 1], [7.1, 5.1, 1], [3.9, 2.5, -1], [6.2, 4.8, 1], [7.5, 5.5, 1],
  [3.5, 5.1, 1], [2.4, 1.8, -1], [7.3, 1.4, -1], [5.1, 4.4, 1], [4.3, 2.1, -1], [3.7, 1.4, -1],
  [8.3, 1.4, -1], [5.2, 2.1, -1], [5.7, 0.7, -1], [5.6, 4.9, 1], [1.1, 4.3, 1], [4.4, 5.7, 1],
  [9, 0.5, -1], [9.2, 1.6, -1], [8.7, 4.8, -1], [6.3, 3.3, 1], [0.8, 0.4, -1], [1.8, 4.4, 1],
  [2.3, 3.3, -1], [6.6, 1.6, -1], [4.5, 1.3, -1], [8, 2.3, -1], [5.5, 2.9, 1], [0.8, 1.9, 1],
];

/** (c) 학습에 쓰지 않은 데이터 — 학습 데이터가 전체 분포를 제대로 대표하지 못한 경우 */
export const complexityTestDifferent: Labeled[] = [
  [7.4, 2.9, -1], [7.5, 1.3, -1], [6.1, 4.2, 1], [5.2, 0.5, -1], [1.7, 5.3, 1], [7, 1, -1],
  [4.3, 1.8, -1], [8, 4.8, 1], [3.1, 5.4, 1], [2.9, 2, -1], [3.9, 0.5, -1], [4.7, 5.6, 1],
  [4.5, 0.4, -1], [8.2, 1.7, -1], [4.9, 4.2, 1], [5.6, 3.1, -1], [9.4, 1.6, -1], [8.8, 1.3, -1],
  [7.9, 2.2, -1], [2.4, 0.4, -1], [1.7, 3.7, 1], [6.3, 1, -1], [2.3, 2.3, 1], [9, 2.7, 1],
  [4.3, 4.1, -1], [1.6, 4.6, -1], [1.4, 1.1, 1], [7.1, 1.7, 1], [8.7, 5.2, 1], [2.7, 3.4, 1],
];

/* ─────────── 10.2 선형 분리가 가능한 학습 데이터 ─────────── */

export const separableData: Sample[] = [
  { x: [2, 3], y: 1 },
  { x: [4, 5], y: 1 },
  { x: [1, 5], y: 1 },
  { x: [3, 6.5], y: 1 },
  { x: [1.5, 6.2], y: 1 },
  { x: [2.5, 4.8], y: 1 },
  { x: [5, 2], y: -1 },
  { x: [6, 1], y: -1 },
  { x: [7, 3.5], y: -1 },
  { x: [6.5, 0.5], y: -1 },
  { x: [4.5, 0.8], y: -1 },
  { x: [7.5, 2], y: -1 },
];

/* ─────────── 10.2.4 선형 분리가 불가능한 데이터 ─────────── */

function blob(rand: () => number, cx: number, cy: number, s: number, n: number): Vec[] {
  const out: Vec[] = [];
  for (let i = 0; i < n; i += 1) {
    // 박스-뮬러 변환
    const u = Math.max(rand(), 1e-9);
    const v = rand();
    const r = Math.sqrt(-2 * Math.log(u));
    out.push([
      Number((cx + s * r * Math.cos(2 * Math.PI * v)).toFixed(2)),
      Number((cy + s * r * Math.sin(2 * Math.PI * v)).toFixed(2)),
    ]);
  }
  return out;
}

const slackRand = lcg(2024);
export const overlapData: Sample[] = [
  ...blob(slackRand, 3, 4.6, 1.05, 14).map((x) => ({ x, y: 1 as const })),
  ...blob(slackRand, 5.2, 2.6, 1.05, 14).map((x) => ({ x, y: -1 as const })),
];

/* ─────────── 10.2.3 다중 클래스 ─────────── */

const mcRand = lcg(31);
export const multiclassData: { x: Vec; k: number }[] = [
  ...blob(mcRand, 2, 5.2, 0.6, 8).map((x) => ({ x, k: 0 })),
  ...blob(mcRand, 6, 5.4, 0.6, 8).map((x) => ({ x, k: 1 })),
  ...blob(mcRand, 4, 1.8, 0.6, 8).map((x) => ({ x, k: 2 })),
];

/* ─────────── 10.3.1 원형 결정경계를 가진 2차원 데이터 ─────────── */

export const circleData: Sample[] = (() => {
  const out: Sample[] = [];
  const inner = 10;
  for (let i = 0; i < inner; i += 1) {
    const t = (2 * Math.PI * i) / inner + 0.3;
    const r = i % 2 === 0 ? 0.35 : 0.72;
    out.push({ x: [Number((r * Math.cos(t)).toFixed(2)), Number((r * Math.sin(t)).toFixed(2))], y: -1 });
  }
  const outer = 16;
  for (let i = 0; i < outer; i += 1) {
    const t = (2 * Math.PI * i) / outer + 0.1;
    // Φ는 x와 −x를 같은 점으로 보내므로, 마주 보는 점끼리 반지름을 달리해 3차원에서 겹치지 않게 한다
    const r = [1.2, 1.32, 1.45][i % 3];
    out.push({ x: [Number((r * Math.cos(t)).toFixed(2)), Number((r * Math.sin(t)).toFixed(2))], y: 1 });
  }
  return out;
})();

/* ─────────── 비선형 결정경계를 가진 이진 분류의 예 (데이터 30개) ─────────── */

/** 데이터를 만든 실제 경계 — 이 곡선 위쪽이 C₁(목표 출력값 1) */
export const trueCurve = (x: number) => -1 + 2 * Math.exp(-(((x + 0.1) / 1.4) ** 2));

export const nonlinearData: Sample[] = (() => {
  const rand = lcg(88);
  const out: Sample[] = [];
  let guard = 0;
  while (out.length < 30 && guard < 10000) {
    guard += 1;
    const x: Vec = [Number((-1.9 + rand() * 4.8).toFixed(2)), Number((-1.9 + rand() * 4.8).toFixed(2))];
    const gap = x[1] - trueCurve(x[0]);
    if (Math.abs(gap) < 0.2) continue;
    if (out.some((p) => Math.hypot(p.x[0] - x[0], p.x[1] - x[1]) < 0.35)) continue;
    const label = gap > 0 ? 1 : -1;
    if (out.filter((p) => p.y === label).length >= 15) continue;
    out.push({ x, y: label });
  }
  return out;
})();
