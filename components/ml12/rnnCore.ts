/**
 * 12강 순환 신경망 계산의 공통 부분.
 *
 * 화면에 보이는 모든 숫자는 여기 있는 함수로 실제로 계산한다.
 * 가중치 값 자체는 교재·강의록에 제시되어 있지 않으므로 이 페이지에서 정했고,
 * 각 컴포넌트가 그 사실을 화면에 적어 둔다.
 */

export const sigmoid = (u: number) => 1 / (1 + Math.exp(-u));
export const tanh = (u: number) => Math.tanh(u);

/** σ′(u) = (1 − σ)σ — 최대값 0.25 */
export const dSigmoid = (u: number) => {
  const s = sigmoid(u);
  return (1 - s) * s;
};

/** tanh′(u) = 1 − tanh²(u) — 최대값 1 */
export const dTanh = (u: number) => 1 - Math.tanh(u) ** 2;

export function fmt(v: number, digits = 4) {
  if (!Number.isFinite(v)) return v > 0 ? "∞" : "−∞";
  const s = v.toFixed(digits);
  return s.startsWith("-") ? `−${s.slice(1)}` : s;
}

/** 아주 크거나 아주 작은 값을 지수 표기로 */
export function fmtWide(v: number) {
  const a = Math.abs(v);
  if (a !== 0 && (a < 1e-3 || a >= 1e4)) {
    const s = v.toExponential(2).replace("e", " × 10^").replace("+", "");
    return s.replace("-", "−");
  }
  return fmt(v, a >= 100 ? 1 : 4);
}

/* ─────────── 행렬·벡터 ─────────── */

export type Vec = number[];
export type Mat = number[][];

/** W x — W는 (행 × 열), x의 길이는 열의 수와 같아야 한다 */
export function matVec(W: Mat, x: Vec): Vec {
  return W.map((row) => row.reduce((acc, w, j) => acc + w * x[j], 0));
}

export const addVec = (a: Vec, b: Vec): Vec => a.map((v, i) => v + b[i]);

/** 아다마르 곱 ⊙ — 차원이 같은 두 벡터의 요소별 곱셈 */
export const hadamard = (a: Vec, b: Vec): Vec => a.map((v, i) => v * b[i]);

export function softmax(u: Vec): Vec {
  const m = Math.max(...u);
  const e = u.map((v) => Math.exp(v - m));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / s);
}

/* ─────────── 기본 RNN 셀 ─────────── */

/**
 * 이 페이지에서 정한 2차원 입력 · 2차원 은닉 상태의 가중치.
 * 시각 t가 달라져도 같은 W를 쓴다 — 가중치 공유.
 */
export const RNN_W = {
  xh: [
    [0.5, -0.3],
    [0.8, 0.2],
  ] as Mat,
  hh: [
    [0.6, -0.4],
    [0.1, 0.7],
  ] as Mat,
  hy: [
    [1.2, -0.9],
    [-0.7, 1.1],
  ] as Mat,
  bh: [0, 0] as Vec,
  bo: [0, 0] as Vec,
};

export interface RnnStep {
  t: number;
  x: Vec;
  /** W_hh h_{t−1} */
  recur: Vec;
  /** W_xh x_t */
  input: Vec;
  /** tanh에 들어가는 값 */
  pre: Vec;
  h: Vec;
  /** W_hy h_t + b_o */
  outPre: Vec;
  y: Vec;
}

/** h_t = tanh(W_hh h_{t−1} + W_xh x_t + b_h), y_t = φ_softmax(W_hy h_t + b_o) */
export function runRnn(inputs: Vec[], h0: Vec = [0, 0]): RnnStep[] {
  const steps: RnnStep[] = [];
  let h = h0;
  inputs.forEach((x, i) => {
    const recur = matVec(RNN_W.hh, h);
    const input = matVec(RNN_W.xh, x);
    const pre = addVec(addVec(recur, input), RNN_W.bh);
    const next = pre.map(tanh);
    const outPre = addVec(matVec(RNN_W.hy, next), RNN_W.bo);
    steps.push({ t: i + 1, x, recur, input, pre, h: next, outPre, y: softmax(outPre) });
    h = next;
  });
  return steps;
}

/* ─────────── LSTM 셀 ─────────── */

/** W[h_{t−1}, x_t] = U h_{t−1} + V x_t — 강의록의 표기 그대로 */
export interface GateWeight {
  u: number;
  v: number;
  b: number;
}

export const LSTM_W = {
  f: { u: 1.2, v: 0.9, b: 0.5 } as GateWeight,
  i: { u: -0.6, v: 1.4, b: -0.2 } as GateWeight,
  c: { u: 0.7, v: 1.1, b: 0.0 } as GateWeight,
  o: { u: 0.4, v: 1.3, b: -0.3 } as GateWeight,
};

export const pre = (w: GateWeight, h: number, x: number) => w.u * h + w.v * x + w.b;

export interface LstmStep {
  t: number;
  x: number;
  hPrev: number;
  cPrev: number;
  fPre: number;
  f: number;
  iPre: number;
  i: number;
  cTildePre: number;
  cTilde: number;
  oPre: number;
  o: number;
  /** c_{t−1} ⊙ f_t */
  kept: number;
  /** i_t ⊙ c̃_t */
  added: number;
  c: number;
  h: number;
}

export function lstmStep(x: number, hPrev: number, cPrev: number, W = LSTM_W): LstmStep {
  const fPre = pre(W.f, hPrev, x);
  const iPre = pre(W.i, hPrev, x);
  const cTildePre = pre(W.c, hPrev, x);
  const oPre = pre(W.o, hPrev, x);
  const f = sigmoid(fPre);
  const i = sigmoid(iPre);
  const cTilde = tanh(cTildePre);
  const o = sigmoid(oPre);
  const kept = cPrev * f;
  const added = i * cTilde;
  const c = kept + added;
  return {
    t: 0,
    x,
    hPrev,
    cPrev,
    fPre,
    f,
    iPre,
    i,
    cTildePre,
    cTilde,
    oPre,
    o,
    kept,
    added,
    c,
    h: o * tanh(c),
  };
}

/* ─────────── GRU 셀 ─────────── */

export const GRU_W = {
  r: { u: -0.8, v: 1.1, b: 0.2 } as GateWeight,
  z: { u: 0.5, v: 1.2, b: -0.4 } as GateWeight,
  h: { u: 1.0, v: 0.9, b: 0.0 } as GateWeight,
};

export interface GruStep {
  x: number;
  hPrev: number;
  rPre: number;
  r: number;
  zPre: number;
  z: number;
  /** r_t ⊙ h_{t−1} */
  gated: number;
  hTildePre: number;
  hTilde: number;
  /** (1 − z_t) ⊙ h_{t−1} */
  kept: number;
  /** z_t ⊙ h̃_t */
  added: number;
  h: number;
}

export function gruStep(x: number, hPrev: number, W = GRU_W): GruStep {
  const rPre = pre(W.r, hPrev, x);
  const zPre = pre(W.z, hPrev, x);
  const r = sigmoid(rPre);
  const z = sigmoid(zPre);
  const gated = r * hPrev;
  const hTildePre = W.h.u * gated + W.h.v * x + W.h.b;
  const hTilde = tanh(hTildePre);
  const kept = (1 - z) * hPrev;
  const added = z * hTilde;
  return { x, hPrev, rPre, r, zPre, z, gated, hTildePre, hTilde, kept, added, h: kept + added };
}

/* ─────────── 파라미터 수 ─────────── */

/** 셀 하나의 가중치 묶음: U(n×n) + V(n×d) + b(n) */
export const blockParams = (n: number, d: number) => n * (n + d + 1);

export const cellParams = (n: number, d: number) => ({
  rnn: blockParams(n, d),
  lstm: 4 * blockParams(n, d),
  gru: 3 * blockParams(n, d),
});
