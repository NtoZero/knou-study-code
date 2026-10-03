/**
 * 10강에서 쓰는 다층 퍼셉트론 계산 코어.
 *
 * 기호와 식은 교재 11.3.1 / 강의록 오류역전파 학습 슬라이드를 그대로 따른다.
 *   uⱼʰ = Σᵢ wᵢⱼxᵢ + w₀ⱼ,  zⱼ = φʰ(uⱼʰ)
 *   uₖᵒ = Σⱼ vⱼₖzⱼ + v₀ₖ,  yₖ = φᵒ(uₖᵒ)
 *   δₖ = −φᵒ′(uₖᵒ)(tₖ − yₖ),       ∂E/∂vⱼₖ = δₖzⱼ
 *   δⱼ = φʰ′(uⱼʰ) Σₖ δₖvⱼₖ,        ∂E/∂wᵢⱼ = δⱼxᵢ
 *   Δvⱼₖ = −η ∂E/∂vⱼₖ,  Δwᵢⱼ = −η ∂E/∂wᵢⱼ
 *
 * 가중치 행렬은 0번 행을 바이어스로 둔다.
 *   W: (n+1) × m — W[0][j] = w₀ⱼ, W[i+1][j] = w₍ᵢ₊₁₎ⱼ
 *   V: (m+1) × M — V[0][k] = v₀ₖ, V[j+1][k] = v₍ⱼ₊₁₎ₖ
 */

export type Vec = number[];
export type Mat = number[][];

/** 같은 그림을 매번 같게 그리기 위한 고정 시드 난수 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Activation {
  key: "sigmoid" | "tanh" | "relu" | "linear";
  label: string;
  f: (u: number) => number;
  /** 교재 표기대로 출력값 y로 나타낸 미분값 φ′(u) */
  dFromOutput: (y: number, u: number) => number;
  /** 미분식을 그대로 보여 줄 때 쓰는 문자열 */
  dExpr: string;
}

export const SIGMOID: Activation = {
  key: "sigmoid",
  label: "시그모이드",
  f: (u) => 1 / (1 + Math.exp(-u)),
  dFromOutput: (y) => (1 - y) * y,
  dExpr: "φ′(u) = (1 − y)y",
};

export const TANH: Activation = {
  key: "tanh",
  label: "하이퍼탄젠트",
  f: (u) => Math.tanh(u),
  dFromOutput: (y) => (1 - y) * (1 + y),
  dExpr: "φ′(u) = (1 − y)(1 + y)",
};

export const RELU: Activation = {
  key: "relu",
  label: "ReLU",
  f: (u) => (u > 0 ? u : 0),
  dFromOutput: (_y, u) => (u > 0 ? 1 : 0),
  dExpr: "φ′(u) = 1 (u > 0), 0 (u ≤ 0)",
};

export const LINEAR: Activation = {
  key: "linear",
  label: "선형",
  f: (u) => u,
  dFromOutput: () => 1,
  dExpr: "φ′(u) = 1",
};

export interface Mlp {
  /** 입력 뉴런 수 */
  n: number;
  /** 은닉 뉴런 수 */
  m: number;
  /** 출력 뉴런 수 */
  M: number;
  W: Mat;
  V: Mat;
  hidden: Activation;
  output: Activation;
}

export interface Sample {
  x: Vec;
  t: Vec;
}

export function zeros(rows: number, cols: number): Mat {
  return Array.from({ length: rows }, () => new Array<number>(cols).fill(0));
}

export function cloneMlp(net: Mlp): Mlp {
  return { ...net, W: net.W.map((r) => [...r]), V: net.V.map((r) => [...r]) };
}

/** 초기 가중치 — 작은 범위의 실수값으로 랜덤하게 설정 */
export function initMlp(
  n: number,
  m: number,
  M: number,
  rng: () => number,
  opts: { scale?: number; hidden?: Activation; output?: Activation; constant?: number } = {},
): Mlp {
  const { scale = 0.5, hidden = SIGMOID, output = SIGMOID, constant } = opts;
  const draw = () => (constant !== undefined ? constant : (rng() * 2 - 1) * scale);
  const W = Array.from({ length: n + 1 }, () => Array.from({ length: m }, draw));
  const V = Array.from({ length: m + 1 }, () => Array.from({ length: M }, draw));
  return { n, m, M, W, V, hidden, output };
}

export interface Forward {
  uh: Vec;
  z: Vec;
  uo: Vec;
  y: Vec;
}

export function forward(net: Mlp, x: Vec): Forward {
  const uh = new Array<number>(net.m).fill(0);
  const z = new Array<number>(net.m).fill(0);
  for (let j = 0; j < net.m; j += 1) {
    let s = net.W[0][j];
    for (let i = 0; i < net.n; i += 1) s += net.W[i + 1][j] * x[i];
    uh[j] = s;
    z[j] = net.hidden.f(s);
  }
  const uo = new Array<number>(net.M).fill(0);
  const y = new Array<number>(net.M).fill(0);
  for (let k = 0; k < net.M; k += 1) {
    let s = net.V[0][k];
    for (let j = 0; j < net.m; j += 1) s += net.V[j + 1][k] * z[j];
    uo[k] = s;
    y[k] = net.output.f(s);
  }
  return { uh, z, uo, y };
}

export interface Deltas {
  dk: Vec;
  dj: Vec;
  /** δⱼ를 만들 때 더해지는 δₖvⱼₖ 항들 — 역전파 과정을 표로 보여 줄 때 쓴다 */
  back: Mat;
}

export function deltas(net: Mlp, fw: Forward, t: Vec): Deltas {
  const dk = new Array<number>(net.M).fill(0);
  for (let k = 0; k < net.M; k += 1) {
    dk[k] = -net.output.dFromOutput(fw.y[k], fw.uo[k]) * (t[k] - fw.y[k]);
  }
  const dj = new Array<number>(net.m).fill(0);
  const back = zeros(net.m, net.M);
  for (let j = 0; j < net.m; j += 1) {
    let s = 0;
    for (let k = 0; k < net.M; k += 1) {
      back[j][k] = dk[k] * net.V[j + 1][k];
      s += back[j][k];
    }
    dj[j] = net.hidden.dFromOutput(fw.z[j], fw.uh[j]) * s;
  }
  return { dk, dj, back };
}

export interface Grads {
  dW: Mat;
  dV: Mat;
}

export function gradients(net: Mlp, x: Vec, fw: Forward, d: Deltas): Grads {
  const dV = zeros(net.m + 1, net.M);
  for (let k = 0; k < net.M; k += 1) {
    dV[0][k] = d.dk[k]; // z₀ = 1
    for (let j = 0; j < net.m; j += 1) dV[j + 1][k] = d.dk[k] * fw.z[j];
  }
  const dW = zeros(net.n + 1, net.m);
  for (let j = 0; j < net.m; j += 1) {
    dW[0][j] = d.dj[j]; // x₀ = 1
    for (let i = 0; i < net.n; i += 1) dW[i + 1][j] = d.dj[j] * x[i];
  }
  return { dW, dV };
}

export function addGrads(acc: Grads, g: Grads): void {
  for (let i = 0; i < acc.dW.length; i += 1)
    for (let j = 0; j < acc.dW[i].length; j += 1) acc.dW[i][j] += g.dW[i][j];
  for (let j = 0; j < acc.dV.length; j += 1)
    for (let k = 0; k < acc.dV[j].length; k += 1) acc.dV[j][k] += g.dV[j][k];
}

/** θ(τ+1) = θ(τ) − η ∂E/∂θ */
export function applyUpdate(net: Mlp, g: Grads, eta: number): void {
  for (let i = 0; i < net.W.length; i += 1)
    for (let j = 0; j < net.W[i].length; j += 1) net.W[i][j] -= eta * g.dW[i][j];
  for (let j = 0; j < net.V.length; j += 1)
    for (let k = 0; k < net.V[j].length; k += 1) net.V[j][k] -= eta * g.dV[j][k];
}

/** 데이터 하나에 대한 가중치 수정 — 온라인 모드의 한 걸음 */
export function onlineStep(net: Mlp, s: Sample, eta: number): Grads {
  const fw = forward(net, s.x);
  const d = deltas(net, fw, s.t);
  const g = gradients(net, s.x, fw, d);
  applyUpdate(net, g, eta);
  return g;
}

export function emptyGrads(net: Mlp): Grads {
  return { dW: zeros(net.n + 1, net.m), dV: zeros(net.m + 1, net.M) };
}

/** N개 데이터의 오차를 모두 더한 뒤 한 번만 수정 — 배치 모드 */
export function batchStep(net: Mlp, data: Sample[], eta: number): void {
  const acc = emptyGrads(net);
  for (const s of data) {
    const fw = forward(net, s.x);
    const d = deltas(net, fw, s.t);
    addGrads(acc, gradients(net, s.x, fw, d));
  }
  applyUpdate(net, acc, eta / data.length);
}

/** 부분집합마다 한 번씩 수정 — 미니 배치 모드 */
export function miniBatchEpoch(net: Mlp, data: Sample[], eta: number, size: number): number {
  let updates = 0;
  for (let start = 0; start < data.length; start += size) {
    batchStep(net, data.slice(start, start + size), eta);
    updates += 1;
  }
  return updates;
}

/** E(X, θ) = (1/2N) Σᵢ ‖tᵢ − f(xᵢ, θ)‖² */
export function meanSquaredError(net: Mlp, data: Sample[]): number {
  let s = 0;
  for (const d of data) {
    const { y } = forward(net, d.x);
    for (let k = 0; k < y.length; k += 1) s += (d.t[k] - y[k]) ** 2;
  }
  return s / (2 * data.length);
}

/** 출력이 가장 큰 뉴런의 번호 */
export function argmax(v: Vec): number {
  let best = 0;
  for (let i = 1; i < v.length; i += 1) if (v[i] > v[best]) best = i;
  return best;
}

export function misclassRate(net: Mlp, data: Sample[]): number {
  let wrong = 0;
  for (const d of data) {
    const { y } = forward(net, d.x);
    if (argmax(y) !== argmax(d.t)) wrong += 1;
  }
  return wrong / data.length;
}

export function shuffled<T>(arr: T[], rng: () => number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/* ─────────── 출력층 함수와 오차함수 ─────────── */

/** 소프트맥스 (식 11-18) — yₖ = exp(uₖᵒ) / Σᵢ exp(uᵢᵒ) */
export function softmax(u: Vec): Vec {
  const mx = Math.max(...u);
  const e = u.map((v) => Math.exp(v - mx));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / s);
}

/** 제곱 오차함수 (식 11-16)의 데이터 하나 몫 — Σₖ (tₖ − yₖ)² */
export function squaredError(t: Vec, y: Vec): number {
  return t.reduce((a, tv, k) => a + (tv - y[k]) ** 2, 0);
}

/** 교차엔트로피 오차함수 (식 11-17)의 데이터 하나 몫 — Σₖ tₖ ln yₖ */
export function crossEntropy(t: Vec, y: Vec): number {
  return t.reduce((a, tv, k) => a + tv * Math.log(Math.max(y[k], 1e-12)), 0);
}

/** 클래스 레이블을 원-핫 벡터로 */
export function oneHot(index: number, size: number): Vec {
  return Array.from({ length: size }, (_, i) => (i === index ? 1 : 0));
}

/* ─────────── 수 표기 ─────────── */

export const fmt = (v: number, d = 4) =>
  Number.isFinite(v) ? (Object.is(v, -0) ? (0).toFixed(d) : v.toFixed(d)) : "—";

const SUB = "₀₁₂₃₄₅₆₇₈₉";
export const sub = (n: number) =>
  String(n)
    .split("")
    .map((c) => SUB[Number(c)] ?? c)
    .join("");
