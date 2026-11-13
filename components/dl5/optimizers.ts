/**
 * 5강 최적화기 비교 실험에서 함께 쓰는 계산.
 *
 * 목적함수·학습률·초깃값은 강의록 '모멘텀' 예시 상자에 적힌 것을 그대로 쓴다.
 *   J(x) = x₁² + 2x₂² − x₁x₂,  x(0) = [−5  4]ᵀ
 * 갱신식도 강의록 표기를 그대로 옮겼다.
 *
 * 반복 계산이므로 매 걸음 q12로 자릿수를 맞춘다. 그렇지 않으면 서버와 브라우저의
 * 끝자리가 갈려 100걸음 뒤 경로가 달라진다.
 */
import { q12 } from "@/components/dlShared/ui";

export type OptKind = "gd" | "momentum" | "nag" | "adagrad" | "rmsprop" | "adam";

export interface OptMeta {
  key: OptKind;
  label: string;
  /** 다크모드에서도 읽히는 선 색 */
  color: string;
  /** 한 줄 성격 */
  gist: string;
}

export const OPTIMIZERS: OptMeta[] = [
  { key: "gd", label: "기본 경사 하강법", color: "#64748b", gist: "경사가 가장 급한 방향으로만 이동" },
  { key: "momentum", label: "모멘텀", color: "#8b5cf6", gist: "이전 변화량을 m배로 이어받음" },
  { key: "nag", label: "NAG", color: "#d946ef", gist: "모멘텀만큼 이동한 위치에서 경사를 구함" },
  { key: "adagrad", label: "AdaGrad", color: "#f59e0b", gist: "경사 제곱을 계속 누적해 학습률을 줄임" },
  { key: "rmsprop", label: "RMSProp", color: "#10b981", gist: "경사 제곱을 지수적으로 감쇠시켜 누적" },
  { key: "adam", label: "Adam", color: "#0ea5e9", gist: "1차·2차 모멘트를 함께 사용" },
];

export const EPS = 1e-7;
/** 강의록 예시의 모멘텀 계수 */
export const M = 0.9;
/** 강의록 RMSProp 예문의 감쇠율 */
export const RHO = 0.9;
/** 강의록 Adam 예문의 값 */
export const B1 = 0.9;
export const B2 = 0.99;

export const START: [number, number] = [-5, 4];

export function valueJ(x1: number, x2: number): number {
  return q12(x1 * x1 + 2 * x2 * x2 - x1 * x2);
}

/** ∇J(w) = [2x₁ − x₂, 4x₂ − x₁] */
export function gradJ(x1: number, x2: number): [number, number] {
  return [q12(2 * x1 - x2), q12(4 * x2 - x1)];
}

export interface Pt {
  x1: number;
  x2: number;
}

/** 걸음마다의 위치를 돌려준다. 0번째 원소가 초깃값 x(0). */
export function trajectory(kind: OptKind, eta: number, steps: number): Pt[] {
  let x1 = START[0];
  let x2 = START[1];
  let v1 = 0;
  let v2 = 0;
  let s1 = 0;
  let s2 = 0;
  let m1 = 0;
  let m2 = 0;
  const out: Pt[] = [{ x1, x2 }];

  for (let t = 1; t <= steps; t++) {
    if (kind === "gd") {
      const [g1, g2] = gradJ(x1, x2);
      x1 = q12(x1 - eta * g1);
      x2 = q12(x2 - eta * g2);
    } else if (kind === "momentum") {
      const [g1, g2] = gradJ(x1, x2);
      v1 = q12(M * v1 - eta * g1);
      v2 = q12(M * v2 - eta * g2);
      x1 = q12(x1 + v1);
      x2 = q12(x2 + v2);
    } else if (kind === "nag") {
      // 경사를 구하는 위치가 w(t) + m·v(t−1)
      const [g1, g2] = gradJ(q12(x1 + M * v1), q12(x2 + M * v2));
      v1 = q12(M * v1 - eta * g1);
      v2 = q12(M * v2 - eta * g2);
      x1 = q12(x1 + v1);
      x2 = q12(x2 + v2);
    } else if (kind === "adagrad") {
      const [g1, g2] = gradJ(x1, x2);
      s1 = q12(s1 + g1 * g1);
      s2 = q12(s2 + g2 * g2);
      x1 = q12(x1 - (eta / q12(Math.sqrt(s1 + EPS))) * g1);
      x2 = q12(x2 - (eta / q12(Math.sqrt(s2 + EPS))) * g2);
    } else if (kind === "rmsprop") {
      const [g1, g2] = gradJ(x1, x2);
      s1 = q12(RHO * s1 + (1 - RHO) * g1 * g1);
      s2 = q12(RHO * s2 + (1 - RHO) * g2 * g2);
      x1 = q12(x1 - (eta / q12(Math.sqrt(s1 + EPS))) * g1);
      x2 = q12(x2 - (eta / q12(Math.sqrt(s2 + EPS))) * g2);
    } else {
      const [g1, g2] = gradJ(x1, x2);
      m1 = q12(B1 * m1 + (1 - B1) * g1);
      m2 = q12(B1 * m2 + (1 - B1) * g2);
      s1 = q12(B2 * s1 + (1 - B2) * g1 * g1);
      s2 = q12(B2 * s2 + (1 - B2) * g2 * g2);
      const c1 = q12(1 - Math.pow(B1, t));
      const c2 = q12(1 - Math.pow(B2, t));
      const mh1 = q12(m1 / c1);
      const mh2 = q12(m2 / c1);
      const vh1 = q12(s1 / c2);
      const vh2 = q12(s2 / c2);
      x1 = q12(x1 - (eta / q12(Math.sqrt(vh1) + EPS)) * mh1);
      x2 = q12(x2 - (eta / q12(Math.sqrt(vh2) + EPS)) * mh2);
    }
    out.push({ x1, x2 });
  }
  return out;
}

/* ── 등고선 ──────────────────────────────────────────────── */

// J(x) = xᵀQx, Q = [[1, −0.5], [−0.5, 2]]
// 고윳값 λ = (3 ∓ √2)/2, 고유벡터는 서로 직교한다.
const L_SMALL = (3 - Math.SQRT2) / 2; // ≈ 0.7929
const L_BIG = (3 + Math.SQRT2) / 2; // ≈ 2.2071
const E1: [number, number] = (() => {
  const d = Math.sqrt(1 + (Math.SQRT2 - 1) * (Math.SQRT2 - 1));
  return [1 / d, (Math.SQRT2 - 1) / d];
})();
const E2: [number, number] = [-E1[1], E1[0]];

/** J(x) = level 인 타원 위의 점들 */
export function contour(level: number, n = 72): Pt[] {
  const a = Math.sqrt(level / L_SMALL);
  const b = Math.sqrt(level / L_BIG);
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const th = (2 * Math.PI * i) / n;
    const c = Math.cos(th);
    const s = Math.sin(th);
    pts.push({
      x1: q12(a * c * E1[0] + b * s * E2[0]),
      x2: q12(a * c * E1[1] + b * s * E2[1]),
    });
  }
  return pts;
}

export const CONTOUR_LEVELS = [25, 50, 75, 100, 125, 150];
