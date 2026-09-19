/**
 * 8강 SVM 계산 모듈.
 *
 * 교재 10.2~10.3절의 이원적 문제
 *   Q(α) = Σαᵢ − ½ ΣΣ αᵢαⱼyᵢyⱼ k(xᵢ, xⱼ),  Σαᵢyᵢ = 0,  0 ≤ αᵢ ≤ c
 * 를 이차계획법의 한 방법인 SMO(두 개의 αᵢ씩 골라 해석적으로 푸는 반복)로 풀고,
 * ŵ = Σα̂ᵢyᵢxᵢ, ŵ₀ = (1/Nₛ) Σ_{xᵢ∈Xₛ} (yᵢ − Σ α̂ⱼyⱼ k(xⱼ, xᵢ)) 를 교재 식 그대로 계산한다.
 * 페이지의 모든 그림(결정경계, 서포트 벡터, 마진)은 이 모듈이 계산한 값으로 그린다.
 */

export type Vec = [number, number];

export interface Sample {
  x: Vec;
  y: 1 | -1;
}

export type Kernel = (a: Vec, b: Vec) => number;

export const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1];
export const norm = (a: Vec) => Math.hypot(a[0], a[1]);
export const sqDist = (a: Vec, b: Vec) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;

/* ─────────── 표 10-1 대표적인 커널 함수 ─────────── */

export const linearKernel: Kernel = (a, b) => dot(a, b);

export const polyKernel =
  (c: number, d: number): Kernel =>
  (a, b) =>
    (dot(a, b) + c) ** d;

export const sigmoidKernel =
  (t1: number, t2: number): Kernel =>
  (a, b) =>
    Math.tanh(t1 * dot(a, b) + t2);

export const gaussianKernel =
  (sigma: number): Kernel =>
  (a, b) =>
    Math.exp(-sqDist(a, b) / (2 * sigma * sigma));

/** 식 10-30의 고차원 매핑 φ : R² → R³ */
export const phi = (a: Vec): [number, number, number] => [
  a[0] * a[0],
  Math.SQRT2 * a[0] * a[1],
  a[1] * a[1],
];

/* ─────────── 학습 ─────────── */

export interface SvmModel {
  data: Sample[];
  kernel: Kernel;
  /** 하이퍼파라미터 c. 슬랙변수가 없는 SVM은 Infinity */
  c: number;
  alpha: number[];
  w0: number;
  /** α̂ᵢ ≠ 0 인 데이터의 인덱스 — 서포트 벡터 집합 Xₛ */
  sv: number[];
  /** 서포트 벡터 중 α̂ᵢ = c 에 걸린 것 (슬랙변수가 있는 경우) */
  bounded: number[];
  /** 이원적 문제의 목적함수 값 Q(α̂) */
  q: number;
}

/** SMO가 두 αᵢ를 한 번 고칠 때마다 남기는 기록 */
export interface SmoStep {
  pair: [number, number];
  alpha: number[];
  b: number;
  q: number;
}

const ALPHA_EPS = 1e-8;

function gram(data: Sample[], kernel: Kernel) {
  return data.map((a) => data.map((b) => kernel(a.x, b.x)));
}

/** Q(α) = Σαᵢ − ½ ΣΣ αᵢαⱼyᵢyⱼKᵢⱼ */
export function dualObjective(alpha: number[], data: Sample[], K: number[][]) {
  let s = 0;
  let quad = 0;
  for (let i = 0; i < data.length; i += 1) {
    s += alpha[i];
    if (alpha[i] === 0) continue;
    for (let j = 0; j < data.length; j += 1) {
      quad += alpha[i] * alpha[j] * data[i].y * data[j].y * K[i][j];
    }
  }
  return s - 0.5 * quad;
}

/** 작은 선형연립방정식 풀이 (부분 피벗 가우스 소거) */
function solveLinear(A: number[][], b: number[]): number[] | null {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < n; col += 1) {
    let piv = col;
    for (let r = col + 1; r < n; r += 1) {
      if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    }
    if (Math.abs(M[piv][col]) < 1e-12) return null;
    [M[col], M[piv]] = [M[piv], M[col]];
    for (let r = 0; r < n; r += 1) {
      if (r === col) continue;
      const f = M[r][col] / M[col][col];
      for (let k = col; k <= n; k += 1) M[r][k] -= f * M[col][k];
    }
  }
  return M.map((row, i) => row[n] / row[i]);
}

/**
 * SMO로 Q(α)를 최대화한다. 입력 순서만으로 결과가 정해지도록 무작위 선택은 쓰지 않는다.
 */
export function trainSvm(
  data: Sample[],
  kernel: Kernel,
  c = Infinity,
  trace?: SmoStep[],
): SvmModel {
  const n = data.length;
  const K = gram(data, kernel);
  const y = data.map((d) => d.y);
  const alpha = new Array(n).fill(0);
  let b = 0;
  const tol = 1e-7;

  const f = (i: number) => {
    let s = b;
    for (let j = 0; j < n; j += 1) if (alpha[j] > 0) s += alpha[j] * y[j] * K[j][i];
    return s;
  };
  const err = (i: number) => f(i) - y[i];

  const takeStep = (i1: number, i2: number) => {
    if (i1 === i2) return false;
    const a1 = alpha[i1];
    const a2 = alpha[i2];
    const y1 = y[i1];
    const y2 = y[i2];
    const E1 = err(i1);
    const E2 = err(i2);
    const s = y1 * y2;
    let L: number;
    let H: number;
    if (y1 !== y2) {
      L = Math.max(0, a2 - a1);
      H = Math.min(c, c + a2 - a1);
    } else {
      L = Math.max(0, a2 + a1 - c);
      H = Math.min(c, a1 + a2);
    }
    if (H - L < 1e-12) return false;
    const eta = K[i1][i1] + K[i2][i2] - 2 * K[i1][i2];
    if (eta <= 1e-12) return false;
    let a2n = a2 + (y2 * (E1 - E2)) / eta;
    if (a2n < L) a2n = L;
    else if (a2n > H) a2n = H;
    if (a2n < 1e-12) a2n = 0;
    if (Math.abs(a2n - a2) < 1e-12 * (a2n + a2 + 1e-12)) return false;
    let a1n = a1 + s * (a2 - a2n);
    if (a1n < 1e-12) a1n = 0;
    const b1 = b - E1 - y1 * (a1n - a1) * K[i1][i1] - y2 * (a2n - a2) * K[i1][i2];
    const b2 = b - E2 - y1 * (a1n - a1) * K[i1][i2] - y2 * (a2n - a2) * K[i2][i2];
    if (a1n > 0 && a1n < c) b = b1;
    else if (a2n > 0 && a2n < c) b = b2;
    else b = (b1 + b2) / 2;
    alpha[i1] = a1n;
    alpha[i2] = a2n;
    if (trace) trace.push({ pair: [i1, i2], alpha: [...alpha], b, q: dualObjective(alpha, data, K) });
    return true;
  };

  const examine = (i2: number) => {
    const E2 = err(i2);
    const r2 = E2 * y[i2];
    if (!((r2 < -tol && alpha[i2] < c) || (r2 > tol && alpha[i2] > 0))) return 0;
    const nonBound = alpha
      .map((_, i) => i)
      .filter((i) => alpha[i] > 0 && alpha[i] < c);
    if (nonBound.length > 1) {
      let best = -1;
      let gap = -1;
      for (const i of nonBound) {
        const g = Math.abs(err(i) - E2);
        if (g > gap) {
          gap = g;
          best = i;
        }
      }
      if (best >= 0 && takeStep(best, i2)) return 1;
    }
    for (const i of nonBound) if (takeStep(i, i2)) return 1;
    for (let i = 0; i < n; i += 1) if (takeStep(i, i2)) return 1;
    return 0;
  };

  let changed = 0;
  let examineAll = true;
  let guard = 0;
  while ((changed > 0 || examineAll) && guard < 20000) {
    guard += 1;
    changed = 0;
    if (examineAll) {
      for (let i = 0; i < n; i += 1) changed += examine(i);
    } else {
      for (let i = 0; i < n; i += 1) {
        if (alpha[i] > 0 && alpha[i] < c) changed += examine(i);
      }
    }
    if (examineAll) examineAll = false;
    else if (changed === 0) examineAll = true;
  }

  // 서포트 벡터 집합이 정해지면 yᵢ(Σαⱼyⱼkⱼᵢ + w₀) = 1, Σαᵢyᵢ = 0 을 연립해 수치 오차를 걷어낸다.
  const free = alpha
    .map((_, i) => i)
    .filter((i) => alpha[i] > ALPHA_EPS && alpha[i] < c - ALPHA_EPS);
  const boundedIdx = alpha.map((_, i) => i).filter((i) => alpha[i] >= c - ALPHA_EPS);
  if (free.length > 0) {
    const m = free.length;
    const A: number[][] = [];
    const rhs: number[] = [];
    for (const i of free) {
      const row = free.map((j) => y[i] * y[j] * K[j][i]);
      row.push(y[i]);
      A.push(row);
      let r = 1;
      for (const j of boundedIdx) r -= y[i] * alpha[j] * y[j] * K[j][i];
      rhs.push(r);
    }
    const last: number[] = free.map((j) => y[j]);
    last.push(0);
    A.push(last);
    let r = 0;
    for (const j of boundedIdx) r -= alpha[j] * y[j];
    rhs.push(r);
    const sol = solveLinear(A, rhs);
    if (sol && sol.slice(0, m).every((a) => a > 0 && a < c)) {
      free.forEach((i, k) => {
        alpha[i] = sol[k];
      });
    }
  }
  for (let i = 0; i < n; i += 1) if (alpha[i] <= ALPHA_EPS) alpha[i] = 0;

  const sv = alpha.map((_, i) => i).filter((i) => alpha[i] > 0);
  const bounded = sv.filter((i) => alpha[i] >= c - ALPHA_EPS);
  const freeSv = sv.filter((i) => alpha[i] < c - ALPHA_EPS);

  // 교재 ②-4: ŵ₀ = (1/Nₛ) Σ_{xᵢ∈Xₛ} (yᵢ − Σ_{xⱼ∈Xₛ} α̂ⱼyⱼ k(xⱼ, xᵢ))
  // α̂ᵢ = c 인 데이터는 플러스·마이너스 평면 안쪽으로 들어와 있어 yᵢ(ŵᵀxᵢ + ŵ₀) = 1 이 성립하지 않으므로
  // 평균에서 제외한다. 슬랙변수가 없는 경우에는 Xₛ 전체를 그대로 쓴다.
  const avgOver = freeSv.length > 0 ? freeSv : sv;
  let w0 = 0;
  for (const i of avgOver) {
    let s = y[i];
    for (const j of sv) s -= alpha[j] * y[j] * K[j][i];
    w0 += s;
  }
  w0 = avgOver.length > 0 ? w0 / avgOver.length : b;

  return {
    data,
    kernel,
    c,
    alpha,
    w0,
    sv,
    bounded,
    q: dualObjective(alpha, data, K),
  };
}

/** g(x) = Σ_{xᵢ∈Xₛ} α̂ᵢyᵢ k(xᵢ, x) + ŵ₀ */
export function decision(model: SvmModel, x: Vec) {
  let s = model.w0;
  for (const i of model.sv) s += model.alpha[i] * model.data[i].y * model.kernel(model.data[i].x, x);
  return s;
}

/** 선형 커널일 때 ŵ = Σα̂ᵢyᵢxᵢ */
export function linearWeights(model: SvmModel): Vec {
  let w0 = 0;
  let w1 = 0;
  for (const i of model.sv) {
    const k = model.alpha[i] * model.data[i].y;
    w0 += k * model.data[i].x[0];
    w1 += k * model.data[i].x[1];
  }
  return [w0, w1];
}

/* ─────────── 결정경계 그리기 ─────────── */

export interface Grid {
  xs: number[];
  ys: number[];
  /** values[r][c] = g(xs[c], ys[r]) */
  values: number[][];
}

export function evaluateGrid(
  g: (x: Vec) => number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  res: number,
): Grid {
  const xs = Array.from({ length: res + 1 }, (_, i) => xMin + ((xMax - xMin) * i) / res);
  const ys = Array.from({ length: res + 1 }, (_, i) => yMin + ((yMax - yMin) * i) / res);
  const values = ys.map((yy) => xs.map((xx) => g([xx, yy])));
  return { xs, ys, values };
}

/** 마칭 스퀘어로 g(x) = level 등고선을 선분 목록으로 뽑는다 */
export function contourSegments(grid: Grid, level = 0): [Vec, Vec][] {
  const { xs, ys, values } = grid;
  const segs: [Vec, Vec][] = [];
  const interp = (p: Vec, q: Vec, vp: number, vq: number): Vec => {
    const t = vp === vq ? 0.5 : (level - vp) / (vq - vp);
    return [p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])];
  };
  for (let r = 0; r < ys.length - 1; r += 1) {
    for (let c = 0; c < xs.length - 1; c += 1) {
      const p: Vec[] = [
        [xs[c], ys[r]],
        [xs[c + 1], ys[r]],
        [xs[c + 1], ys[r + 1]],
        [xs[c], ys[r + 1]],
      ];
      const v = [values[r][c], values[r][c + 1], values[r + 1][c + 1], values[r + 1][c]];
      const pts: Vec[] = [];
      for (let e = 0; e < 4; e += 1) {
        const a = v[e] - level;
        const bb = v[(e + 1) % 4] - level;
        if ((a < 0 && bb >= 0) || (a >= 0 && bb < 0)) {
          pts.push(interp(p[e], p[(e + 1) % 4], v[e], v[(e + 1) % 4]));
        }
      }
      if (pts.length === 2) segs.push([pts[0], pts[1]]);
      else if (pts.length === 4) {
        segs.push([pts[0], pts[1]]);
        segs.push([pts[2], pts[3]]);
      }
    }
  }
  return segs;
}

/** 결정론적 의사난수 — 데이터 생성용 */
export function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
