/**
 * 11강 학습 실험용 계산 코드.
 *
 * 지역 극소·플라토를 보여 주는 1차원 오차함수와, 과다적합 실험에 쓰는
 * 작은 다층 퍼셉트론을 담는다. 두 실험의 수치는 모두 여기서 직접 계산한다.
 */

export function mulberry32(seed: number) {
  let s = seed;
  return function rand() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function fmt(v: number, d = 3): string {
  if (!Number.isFinite(v)) return "—";
  return v.toFixed(d);
}

/* ─────────── 지역 극소 실험 ─────────── */

/** 극소가 여러 개인 1차원 오차함수 — 이 페이지에서 정한 예시 함수 */
export const LM = { a: 0.15, b: 0.5, w: 3, c: 0.06 };

export const lmE = (t: number) => LM.a * t * t + LM.b * Math.cos(LM.w * t) + LM.c * t;
export const lmGrad = (t: number) => 2 * LM.a * t - LM.b * LM.w * Math.sin(LM.w * t) + LM.c;

/** 샘플마다 조금씩 다른 오차함수 — 평균이 정확히 lmE가 되도록 진폭을 맞춘다 */
export function sampleGrads(n: number, spread: number) {
  const phis = Array.from({ length: n }, (_, i) => -spread + (2 * spread * i) / (n - 1));
  const meanCos = phis.reduce((p, c) => p + Math.cos(c), 0) / n;
  const amp = LM.b / meanCos;
  return {
    phis,
    amp,
    grad: (t: number, i: number) => 2 * LM.a * t - amp * LM.w * Math.sin(LM.w * t + phis[i]) + LM.c,
  };
}

/** 조밀 탐색으로 찾은 극소점 목록 */
export function findMinima(from = -6, to = 6, step = 0.001) {
  const out: { t: number; e: number }[] = [];
  for (let t = from; t <= to; t += step) {
    const p = lmE(t - step);
    const q = lmE(t);
    const r = lmE(t + step);
    if (q < p && q < r) out.push({ t, e: q });
  }
  return out;
}

export type LmMethod = "fixed" | "anneal" | "stochastic";

/** 반복 계산의 각 걸음을 고정 자릿수로 맞춘다.
 *  Math.tanh·exp 같은 함수는 실행 환경에 따라 끝자리가 달라질 수 있어,
 *  수백 걸음을 누적하면 경로가 갈라진다. 서버와 브라우저가 같은 그림을 그리도록 자른다. */
function q12(v: number): number {
  return Math.round(v * 1e9) / 1e9;
}

export function lmRun(
  t0: number,
  method: LmMethod,
  opts: { eta: number; decay: number; steps: number; samples: number; spread: number; seed: number },
): number[] {
  const path = [t0];
  let t = t0;
  const sg = sampleGrads(opts.samples, opts.spread);
  const rng = mulberry32(opts.seed);
  for (let i = 0; i < opts.steps; i += 1) {
    if (method === "stochastic") {
      const k = Math.floor(rng() * opts.samples);
      t -= opts.eta * sg.grad(t, k);
    } else {
      const eta = method === "anneal" ? opts.eta * Math.pow(opts.decay, i) : opts.eta;
      t -= eta * lmGrad(t);
    }
    if (!Number.isFinite(t)) break;
    t = q12(Math.max(-8, Math.min(8, t)));
    path.push(t);
  }
  return path;
}

/* ─────────── 플라토를 건너는 최적화 기법 ─────────── */

/** 넓은 평평한 구간을 가진 1차원 오차함수 — 이 페이지에서 정한 예시 함수 */
export const PL = { a: 0.02, c: 9 };
export const plE = (t: number) => PL.a * Math.log(Math.cosh(t - PL.c));
export const plGrad = (t: number) => PL.a * Math.tanh(t - PL.c);

export type OptMethod = "plain" | "momentum" | "nag" | "adaptive" | "adam";

export interface OptRun {
  path: number[];
  reached: number | null;
}

export function optRun(
  method: OptMethod,
  opts: { eta: number; gamma: number; rho: number; steps: number; start: number; tol: number },
): OptRun {
  let t = opts.start;
  let v = 0;
  let cache = 0;
  let m = 0;
  const path = [t];
  let reached: number | null = null;
  for (let i = 1; i <= opts.steps; i += 1) {
    const g = plGrad(t);
    if (method === "plain") {
      t -= opts.eta * g;
    } else if (method === "momentum") {
      v = -opts.eta * g + opts.gamma * v;
      t += v;
    } else if (method === "nag") {
      v = -opts.eta * plGrad(t + opts.gamma * v) + opts.gamma * v;
      t += v;
    } else if (method === "adaptive") {
      cache = opts.rho * cache + (1 - opts.rho) * g * g;
      t -= (opts.eta * g) / (Math.sqrt(cache) + 1e-8);
    } else {
      m = 0.9 * m + 0.1 * g;
      cache = 0.999 * cache + 0.001 * g * g;
      const mh = m / (1 - Math.pow(0.9, i));
      const vh = cache / (1 - Math.pow(0.999, i));
      t -= (opts.eta * mh) / (Math.sqrt(vh) + 1e-8);
    }
    t = q12(t);
    path.push(t);
    if (reached === null && Math.abs(t - PL.c) < opts.tol) reached = i;
  }
  return { path, reached };
}

/* ─────────── 과다적합 실험 ─────────── */

export const OF = { hidden: 40, eta: 0.03, epochs: 3000, points: 8, noise: 0.6 };

export interface Net {
  w: number[];
  b: number[];
  v: number[];
  c: number;
}

export type Sample = [number, number];

function initNet(seed: number): Net {
  const r = mulberry32(seed);
  const w: number[] = [];
  const b: number[] = [];
  const v: number[] = [];
  for (let j = 0; j < OF.hidden; j += 1) {
    w.push((r() * 2 - 1) * 1.5);
    b.push((r() * 2 - 1) * 1.5);
    v.push((r() * 2 - 1) * 0.3);
  }
  return { w, b, v, c: 0 };
}

export function netOut(n: Net, x: number, mask?: number[]): number {
  let y = n.c;
  for (let j = 0; j < OF.hidden; j += 1) {
    const raw = Math.tanh(n.w[j] * x + n.b[j]);
    y += n.v[j] * raw * (mask ? mask[j] : 1);
  }
  return y;
}

function netStep(n: Net, x: number, t: number, lam: number, mask: number[] | null) {
  const y = netOut(n, x, mask ?? undefined);
  const d = y - t;
  n.c = q12(n.c - OF.eta * d);
  for (let j = 0; j < OF.hidden; j += 1) {
    const mk = mask ? mask[j] : 1;
    const raw = Math.tanh(n.w[j] * x + n.b[j]);
    n.v[j] -= OF.eta * (d * raw * mk + 2 * lam * n.v[j]);
    const dz = (1 - raw * raw) * mk;
    const gz = d * n.v[j];
    n.w[j] = q12(n.w[j] - OF.eta * (gz * dz * x + 2 * lam * n.w[j]));
    n.b[j] = q12(n.b[j] - OF.eta * (gz * dz));
    n.v[j] = q12(n.v[j]);
  }
}

export function meanSquared(n: Net, data: Sample[]): number {
  let s = 0;
  for (const [x, t] of data) {
    const e = netOut(n, x) - t;
    s += e * e;
  }
  return s / (2 * data.length);
}

export function weightNorm(n: Net): number {
  let s = 0;
  for (let j = 0; j < OF.hidden; j += 1) s += n.w[j] ** 2 + n.b[j] ** 2 + n.v[j] ** 2;
  return s + n.c * n.c;
}

export function makeData(seed = 21) {
  const rng = mulberry32(seed);
  const train: Sample[] = [];
  for (let i = 0; i < OF.points; i += 1) {
    const x = -3 + (6 * i) / (OF.points - 1);
    train.push([x / 3, Math.sin(x) + (rng() * 2 - 1) * OF.noise]);
  }
  const valid: Sample[] = [];
  for (let i = 0; i < 80; i += 1) {
    const x = -3 + (6 * i) / 79;
    valid.push([x / 3, Math.sin(x)]);
  }
  return { train, valid };
}

export type OfMode = "none" | "reg" | "drop" | "aug";

export interface OfRun {
  trainCurve: number[];
  validCurve: number[];
  best: number;
  norm: number;
  /** [-3, 3] 구간에서 학습이 끝난 뒤의 근사 곡선 */
  fitted: number[];
  /** 검증 오차가 가장 작았던 시점의 근사 곡선 */
  fittedBest: number[];
}

const GRID = 61;
const gridX = Array.from({ length: GRID }, (_, i) => -3 + (6 * i) / (GRID - 1));

export function runOverfit(mode: OfMode, param: number): OfRun {
  const { train, valid } = makeData();
  const n = initNet(5);
  const rng = mulberry32(99);
  const trainCurve: number[] = [];
  const validCurve: number[] = [];
  let best = 0;
  let bestSnapshot: Net = { ...n, w: [...n.w], b: [...n.b], v: [...n.v] };
  for (let ep = 0; ep < OF.epochs; ep += 1) {
    let data = train;
    if (mode === "aug") {
      data = [];
      for (const [x, t] of train) {
        data.push([x, t]);
        data.push([x + (rng() * 2 - 1) * param, t]);
      }
    }
    for (const [x, t] of data) {
      let mask: number[] | null = null;
      if (mode === "drop") {
        mask = [];
        for (let j = 0; j < OF.hidden; j += 1) mask.push(rng() < param ? 0 : 1 / (1 - param));
      }
      netStep(n, x, t, mode === "reg" ? param : 0, mask);
    }
    trainCurve.push(meanSquared(n, train));
    const ve = meanSquared(n, valid);
    validCurve.push(ve);
    if (ep === 0 || ve < validCurve[best]) {
      best = ep;
      bestSnapshot = { c: n.c, w: [...n.w], b: [...n.b], v: [...n.v] };
    }
  }
  return {
    trainCurve,
    validCurve,
    best,
    norm: weightNorm(n),
    fitted: gridX.map((x) => netOut(n, x / 3)),
    fittedBest: gridX.map((x) => netOut(bestSnapshot, x / 3)),
  };
}

export const OF_GRID = gridX;
