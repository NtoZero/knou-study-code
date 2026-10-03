/**
 * 9강 신경망(1)에서 쓰는 계산 도구.
 *
 * 활성화 함수의 정의는 교재 [그림 11-3]과 강의록 "활성화 함수" 슬라이드를 그대로 따른다.
 * 그림은 모두 이 함수들로 실제 값을 계산해서 그린다.
 */

export type ActId = "step" | "sign" | "linear" | "sigmoid" | "tanh" | "relu";

export interface ActSpec {
  id: ActId;
  name: string;
  en: string;
  /** 유니코드로 쓴 정의식 */
  expr: string;
  f: (u: number) => number;
  /** 출력 범위 표기 */
  range: string;
  /** 미분 가능 여부 */
  differentiable: boolean;
  /** 미분 가능하지 않다면 어디서 끊기는지 */
  breakAt?: string;
  /** 도함수 — 미분 가능한 것만 */
  df?: (u: number) => number;
  dfExpr?: string;
  color: string;
  note: string;
}

export const step = (u: number) => (u >= 0 ? 1 : 0);
export const sign = (u: number) => (u >= 0 ? 1 : -1);
export const sigmoid = (u: number) => 1 / (1 + Math.exp(-u));
/** 교재 식 그대로: (1 − e⁻²ᵘ) / (1 + e⁻²ᵘ) */
export const tanhAct = (u: number) => {
  const e = Math.exp(-2 * u);
  return (1 - e) / (1 + e);
};
export const relu = (u: number) => Math.max(0, u);

export const ACTIVATIONS: ActSpec[] = [
  {
    id: "step",
    name: "계단함수",
    en: "step function",
    expr: "φ_step(u) = 1 (u ≥ 0), 0 (otherwise)",
    f: step,
    range: "{0, 1}",
    differentiable: false,
    breakAt: "u = 0에서 값이 뛰어 미분 불가",
    color: "#a21caf",
    note: "식 11-1에서 정의된 가장 기본적인 형태. 임계치 θ 이상이면 1을 내는 생물학적 뉴런의 성질을 그대로 옮긴 것.",
  },
  {
    id: "sign",
    name: "부호함수",
    en: "sign function",
    expr: "φ_sign(u) = 1 (u ≥ 0), −1 (otherwise)",
    f: sign,
    range: "{−1, 1}",
    differentiable: false,
    breakAt: "u = 0에서 값이 뛰어 미분 불가",
    color: "#c2410c",
    note: "계단함수의 출력값을 0과 1이 아닌 −1과 1로 바꾼 것으로 계단함수와 유사함.",
  },
  {
    id: "linear",
    name: "선형함수",
    en: "linear function",
    expr: "φ_linear(u) = u",
    f: (u) => u,
    range: "(−∞, ∞)",
    differentiable: true,
    df: () => 1,
    dfExpr: "φ′(u) = 1",
    color: "#0891b2",
    note: "가중합을 그대로 출력으로 내보냄. 다층 퍼셉트론에서는 출력 뉴런에 쓰이기도 함.",
  },
  {
    id: "sigmoid",
    name: "시그모이드 함수",
    en: "sigmoid function",
    expr: "φ_sigmoid(u) = 1 / (1 + e⁻ᵘ)",
    f: sigmoid,
    range: "(0, 1)",
    differentiable: true,
    df: (u) => {
      const s = sigmoid(u);
      return s * (1 - s);
    },
    dfExpr: "φ′(u) = φ(u)(1 − φ(u))",
    color: "#2563eb",
    note: "계단함수·부호함수와 달리 미분 가능하면서 출력값이 0에서 1 사이로 제한됨.",
  },
  {
    id: "tanh",
    name: "하이퍼탄젠트 함수",
    en: "hyper tangent function",
    expr: "φ_tanh(u) = (1 − e⁻²ᵘ) / (1 + e⁻²ᵘ)",
    f: tanhAct,
    range: "(−1, 1)",
    differentiable: true,
    df: (u) => {
      const t = tanhAct(u);
      return 1 - t * t;
    },
    dfExpr: "φ′(u) = 1 − φ(u)²",
    color: "#16a34a",
    note: "미분 가능하면서 출력값이 −1에서 1 사이로 제한됨. 곡선 형태를 파라미터 값에 따라 계단함수에서 선형함수에 이르기까지 자유롭게 근사하도록 조정할 수 있음.",
  },
  {
    id: "relu",
    name: "ReLU 함수",
    en: "ReLU function",
    expr: "φ_relu(u) = max(0, u)",
    f: relu,
    range: "[0, ∞)",
    differentiable: false,
    breakAt: "u = 0에서 꺾여 그 점에서만 미분 불가",
    df: (u) => (u > 0 ? 1 : 0),
    dfExpr: "φ′(u) = 1 (u > 0), 0 (u < 0)",
    color: "#ea580c",
    note: "최근의 딥러닝 모델에서 주로 사용됨.",
  },
];

export const actById = (id: ActId) => ACTIVATIONS.find((a) => a.id === id)!;

/** 소수점 자리를 맞춰 −0을 없앤 문자열 */
export const fmt = (v: number, d = 2) => {
  const r = Number(v.toFixed(d));
  return (Object.is(r, -0) ? 0 : r).toString();
};

/** 부호가 붙은 항 — "+ 0.5", "− 1.2" */
export const signed = (v: number, d = 2) =>
  v < 0 ? `− ${fmt(Math.abs(v), d)}` : `+ ${fmt(v, d)}`;

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
  return { sx, sy };
}

/**
 * 함수 하나를 x 구간에서 샘플링해 SVG path로 만든다.
 * 값이 급격히 뛰는 지점(계단·부호함수)은 선을 끊어 수직선이 그려지지 않게 한다.
 */
export function pathOf(
  g: (x: number) => number,
  f: Frame,
  samples = 400,
  breakJump = 0.5,
): string {
  const { sx, sy } = makeScale(f);
  let d = "";
  let prevY: number | null = null;
  for (let i = 0; i <= samples; i += 1) {
    const x = f.xMin + ((f.xMax - f.xMin) * i) / samples;
    const y = g(x);
    if (!Number.isFinite(y)) {
      prevY = null;
      continue;
    }
    const jumped = prevY !== null && Math.abs(y - prevY) > breakJump;
    const yc = Math.max(f.yMin, Math.min(f.yMax, y));
    d += `${d === "" || jumped ? "M" : "L"}${sx(x).toFixed(2)},${sy(yc).toFixed(2)} `;
    prevY = y;
  }
  return d.trim();
}

/** 퍼셉트론의 결정경계 w₁x₁ + w₂x₂ + w₀ = 0 을 그림 영역으로 자른 두 끝점 */
export function clipLine(
  w1: number,
  w2: number,
  w0: number,
  f: Frame,
): [[number, number], [number, number]] | null {
  const pts: [number, number][] = [];
  const eps = 1e-9;
  if (Math.abs(w2) > eps) {
    for (const x of [f.xMin, f.xMax]) {
      const y = -(w1 * x + w0) / w2;
      if (y >= f.yMin - eps && y <= f.yMax + eps) pts.push([x, y]);
    }
  }
  if (Math.abs(w1) > eps) {
    for (const y of [f.yMin, f.yMax]) {
      const x = -(w2 * y + w0) / w1;
      if (x >= f.xMin - eps && x <= f.xMax + eps) pts.push([x, y]);
    }
  }
  const uniq: [number, number][] = [];
  for (const p of pts) {
    if (!uniq.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 1e-6)) uniq.push(p);
  }
  return uniq.length >= 2 ? [uniq[0], uniq[1]] : null;
}

/** 논리 함수 학습 데이터 — (x₁, x₂, 목표 출력 t) */
export interface LogicPattern {
  x1: number;
  x2: number;
  t: number;
}

export const LOGIC_SETS: Record<"AND" | "OR" | "XOR", LogicPattern[]> = {
  AND: [
    { x1: 0, x2: 0, t: 0 },
    { x1: 0, x2: 1, t: 0 },
    { x1: 1, x2: 0, t: 0 },
    { x1: 1, x2: 1, t: 1 },
  ],
  OR: [
    { x1: 0, x2: 0, t: 0 },
    { x1: 0, x2: 1, t: 1 },
    { x1: 1, x2: 0, t: 1 },
    { x1: 1, x2: 1, t: 1 },
  ],
  XOR: [
    { x1: 0, x2: 0, t: 0 },
    { x1: 0, x2: 1, t: 1 },
    { x1: 1, x2: 0, t: 1 },
    { x1: 1, x2: 1, t: 0 },
  ],
};

export interface PerceptronState {
  w1: number;
  w2: number;
  w0: number;
}

export interface UpdateRecord {
  /** 전체 몇 번째 수정인가 */
  index: number;
  epoch: number;
  patternIndex: number;
  x1: number;
  x2: number;
  t: number;
  u: number;
  y: number;
  /** η(t − y) */
  delta: number;
  before: PerceptronState;
  after: PerceptronState;
  changed: boolean;
}

/**
 * 퍼셉트론 학습 규칙(식 11-3)을 한 패턴씩 그대로 적용한 기록.
 *   wᵢⱼ ← wᵢⱼ + η(tⱼ − yⱼ)xᵢ,  바이어스는 입력 1에 대한 가중치로 같은 식을 쓴다.
 */
export function runPerceptron(
  data: LogicPattern[],
  eta: number,
  init: PerceptronState,
  maxEpochs: number,
): { records: UpdateRecord[]; epochErrors: number[]; convergedEpoch: number | null } {
  let s: PerceptronState = { ...init };
  const records: UpdateRecord[] = [];
  const epochErrors: number[] = [];
  let convergedEpoch: number | null = null;
  let index = 0;

  for (let epoch = 1; epoch <= maxEpochs; epoch += 1) {
    let errs = 0;
    for (let p = 0; p < data.length; p += 1) {
      const { x1, x2, t } = data[p];
      const u = s.w1 * x1 + s.w2 * x2 + s.w0;
      const y = step(u);
      if (y !== t) errs += 1;
      const delta = eta * (t - y);
      const before = { ...s };
      const after: PerceptronState = {
        w1: s.w1 + delta * x1,
        w2: s.w2 + delta * x2,
        w0: s.w0 + delta,
      };
      records.push({
        index,
        epoch,
        patternIndex: p,
        x1,
        x2,
        t,
        u,
        y,
        delta,
        before,
        after,
        changed: delta !== 0,
      });
      index += 1;
      s = after;
    }
    epochErrors.push(errs);
    if (errs === 0) {
      convergedEpoch = epoch;
      break;
    }
  }
  return { records, epochErrors, convergedEpoch };
}

/** 주어진 가중치로 네 패턴을 분류했을 때의 오분류 개수 */
export function errorCount(data: LogicPattern[], s: PerceptronState): number {
  return data.filter((d) => step(s.w1 * d.x1 + s.w2 * d.x2 + s.w0) !== d.t).length;
}
