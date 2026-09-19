/**
 * 5강 특징추출 시각화에 쓰는 계산 모음.
 *
 * 그림에 나오는 축·고유치·산점행렬·거리는 모두 여기서 실제로 계산한다.
 * 좌표를 손으로 적어 넣지 않는다.
 */

export type Vec = number[];
export type Mat = number[][];

/* ─────────── 난수 — 새로 고쳐도 같은 데이터가 나오도록 시드 고정 ─────────── */

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gaussian(rng: () => number) {
  let u = 0;
  while (u === 0) u = rng();
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** 평균 center, 긴 축 각도 angleDeg, 두 축 표준편차로 2차원 정규분포 표본 생성 */
export function sample2D(
  rng: () => number,
  n: number,
  center: [number, number],
  angleDeg: number,
  sdLong: number,
  sdShort: number,
): Vec[] {
  const a = (angleDeg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return Array.from({ length: n }, () => {
    const u = gaussian(rng) * sdLong;
    const v = gaussian(rng) * sdShort;
    return [center[0] + c * u - s * v, center[1] + s * u + c * v];
  });
}

/* ─────────── 벡터·행렬 ─────────── */

export const dot = (a: Vec, b: Vec) => a.reduce((s, v, i) => s + v * b[i], 0);
export const norm = (a: Vec) => Math.sqrt(dot(a, a));
export const sub = (a: Vec, b: Vec) => a.map((v, i) => v - b[i]);
export const add = (a: Vec, b: Vec) => a.map((v, i) => v + b[i]);
export const scale = (a: Vec, k: number) => a.map((v) => v * k);
export const unit = (a: Vec) => {
  const n = norm(a);
  return n === 0 ? a.slice() : scale(a, 1 / n);
};

export function transpose(A: Mat): Mat {
  return A[0].map((_, j) => A.map((row) => row[j]));
}

export function matMul(A: Mat, B: Mat): Mat {
  return A.map((row) => B[0].map((_, j) => row.reduce((s, v, k) => s + v * B[k][j], 0)));
}

export function matVec(A: Mat, x: Vec): Vec {
  return A.map((row) => dot(row, x));
}

export function zeros(n: number, m = n): Mat {
  return Array.from({ length: n }, () => new Array(m).fill(0));
}

export function meanVec(X: Vec[]): Vec {
  const n = X[0].length;
  const mu = new Array(n).fill(0);
  for (const x of X) for (let i = 0; i < n; i++) mu[i] += x[i];
  return mu.map((v) => v / X.length);
}

/** 공분산 Σ = (1/N) Σ (x − μ)(x − μ)ᵀ — 교재 PCA 수행 단계 ①과 같은 1/N 정의 */
export function covariance(X: Vec[], mu = meanVec(X)): Mat {
  const n = mu.length;
  const S = zeros(n);
  for (const x of X) {
    const d = sub(x, mu);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) S[i][j] += d[i] * d[j];
  }
  return S.map((row) => row.map((v) => v / X.length));
}

/** 산점 Σ (x − m)(x − m)ᵀ — 1/N 없이 더하기만 한다 (LDA의 S_k) */
export function scatter(X: Vec[], m: Vec): Mat {
  const n = m.length;
  const S = zeros(n);
  for (const x of X) {
    const d = sub(x, m);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) S[i][j] += d[i] * d[j];
  }
  return S;
}

export function matAdd(A: Mat, B: Mat): Mat {
  return A.map((row, i) => row.map((v, j) => v + B[i][j]));
}

/**
 * 대칭행렬의 고유치 분석 (야코비 회전).
 * 고유치는 큰 것부터, vectors[k]는 k번째 고유벡터(단위벡터).
 * 부호는 절댓값이 가장 큰 성분이 양수가 되도록 맞춘다.
 */
export function eigenSym(A: Mat): { values: number[]; vectors: Vec[] } {
  const n = A.length;
  const a = A.map((r) => r.slice());
  const v: Mat = zeros(n).map((row, i) => row.map((_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += a[p][q] * a[p][q];
    if (off < 1e-22) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(a[p][q]) < 1e-300) continue;
        const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = a[k][p];
          const akq = a[k][q];
          a[k][p] = c * akp - s * akq;
          a[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = a[p][k];
          const aqk = a[q][k];
          a[p][k] = c * apk - s * aqk;
          a[q][k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k++) {
          const vkp = v[k][p];
          const vkq = v[k][q];
          v[k][p] = c * vkp - s * vkq;
          v[k][q] = s * vkp + c * vkq;
        }
      }
    }
  }
  const order = a.map((_, i) => i).sort((i, j) => a[j][j] - a[i][i]);
  const vectors = order.map((i) => {
    const col = v.map((row) => row[i]);
    let big = 0;
    for (let k = 1; k < n; k++) if (Math.abs(col[k]) > Math.abs(col[big]) + 1e-12) big = k;
    return col[big] < 0 ? col.map((x) => -x) : col;
  });
  return { values: order.map((i) => a[i][i]), vectors };
}

/** 대칭 양의 정부호 행렬의 촐레스키 분해 A = LLᵀ. 특이하면 null */
export function cholesky(A: Mat): Mat | null {
  const n = A.length;
  const L = zeros(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = A[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 1e-10) return null;
        L[i][i] = Math.sqrt(s);
      } else L[i][j] = s / L[j][j];
    }
  }
  return L;
}

/** 하삼각행렬의 역행렬 */
function invLower(L: Mat): Mat {
  const n = L.length;
  const inv = zeros(n);
  for (let i = 0; i < n; i++) {
    inv[i][i] = 1 / L[i][i];
    for (let j = 0; j < i; j++) {
      let s = 0;
      for (let k = j; k < i; k++) s += L[i][k] * inv[k][j];
      inv[i][j] = -s / L[i][i];
    }
  }
  return inv;
}

/**
 * S_W⁻¹S_B의 고유치 분석.
 * S_W = LLᵀ로 두면 L⁻¹S_B L⁻ᵀ(대칭)과 고유치가 같으므로 그것을 푼 뒤 u = L⁻ᵀv로 되돌린다.
 */
export function ldaEigen(SW: Mat, SB: Mat): { values: number[]; vectors: Vec[] } | null {
  const L = cholesky(SW);
  if (!L) return null;
  const Li = invLower(L);
  const C = matMul(matMul(Li, SB), transpose(Li));
  const sym = C.map((row, i) => row.map((v, j) => (v + C[j][i]) / 2));
  const { values, vectors } = eigenSym(sym);
  const LiT = transpose(Li);
  return {
    values: values.map((v) => (Math.abs(v) < 1e-9 ? 0 : v)),
    vectors: vectors.map((v) => unit(matVec(LiT, v))),
  };
}

export function inv2(A: Mat): Mat | null {
  const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
  if (Math.abs(det) < 1e-12) return null;
  return [
    [A[1][1] / det, -A[0][1] / det],
    [-A[1][0] / det, A[0][0] / det],
  ];
}

/* ─────────── 사영 ─────────── */

/** 방향 각도(도)를 단위벡터로 */
export const dirOf = (deg: number): Vec => [
  Math.cos((deg * Math.PI) / 180),
  Math.sin((deg * Math.PI) / 180),
];

/** 단위벡터를 [0, 180) 각도로 — 사영 방향은 부호가 바뀌어도 같은 축 */
export function angleOf(u: Vec): number {
  let d = (Math.atan2(u[1], u[0]) * 180) / Math.PI;
  while (d < 0) d += 180;
  while (d >= 180) d -= 180;
  return d;
}

/** 1차원 값들의 분산 (1/N) */
export function variance1(ys: number[]) {
  const m = ys.reduce((s, v) => s + v, 0) / ys.length;
  return ys.reduce((s, v) => s + (v - m) ** 2, 0) / ys.length;
}

/* ─────────── LDA ─────────── */

export interface LdaStats {
  means: Vec[];
  m: Vec;
  SW: Mat;
  SB: Mat;
}

/** 클래스별 평균 m_k, 전체 평균 m, S_W = Σ S_k, S_B = Σ N_k (m_k − m)(m_k − m)ᵀ */
export function ldaStats(classes: Vec[][]): LdaStats {
  const all = classes.flat();
  const m = meanVec(all);
  const means = classes.map((c) => meanVec(c));
  const n = m.length;
  let SW = zeros(n);
  let SB = zeros(n);
  classes.forEach((c, k) => {
    SW = matAdd(SW, scatter(c, means[k]));
    const d = sub(means[k], m);
    SB = matAdd(
      SB,
      d.map((di) => d.map((dj) => c.length * di * dj)),
    );
  });
  return { means, m, SW, SB };
}

/** 이진 분류의 J(w) = wᵀS_B w / wᵀS_W w, S_B = (m₁ − m₂)(m₁ − m₂)ᵀ (식 7-17) */
export function fisherJ(c1: Vec[], c2: Vec[], w: Vec) {
  const m1 = meanVec(c1);
  const m2 = meanVec(c2);
  const p1 = c1.map((x) => dot(w, x));
  const p2 = c2.map((x) => dot(w, x));
  const mt1 = dot(w, m1);
  const mt2 = dot(w, m2);
  const s1 = p1.reduce((s, v) => s + (v - mt1) ** 2, 0);
  const s2 = p2.reduce((s, v) => s + (v - mt2) ** 2, 0);
  const num = (mt2 - mt1) ** 2;
  return { mt1, mt2, s1, s2, num, den: s1 + s2, J: num / (s1 + s2), p1, p2 };
}

/* ─────────── 거리 기반 ─────────── */

export function distMatrix(Y: Vec[]): Mat {
  return Y.map((a) => Y.map((b) => norm(sub(a, b))));
}

/** Σ_{i<j} (d_ij − δ_ij)² */
export function stress(D: Mat, Y: Vec[]) {
  let s = 0;
  for (let i = 0; i < D.length; i++)
    for (let j = i + 1; j < D.length; j++) s += (D[i][j] - norm(sub(Y[i], Y[j]))) ** 2;
  return s;
}

/** 거리행렬을 이중 중심화해 고유치 분석으로 좌표를 얻는 고전적 방법 — 반복의 출발점 */
export function classicalMDS(D: Mat, dim = 2): Vec[] {
  const n = D.length;
  const D2 = D.map((r) => r.map((v) => v * v));
  const rowMean = D2.map((r) => r.reduce((s, v) => s + v, 0) / n);
  const all = rowMean.reduce((s, v) => s + v, 0) / n;
  const B = D2.map((r, i) => r.map((v, j) => -0.5 * (v - rowMean[i] - rowMean[j] + all)));
  const { values, vectors } = eigenSym(B);
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: dim }, (_, k) => vectors[k][i] * Math.sqrt(Math.max(values[k], 0))),
  );
}

/**
 * Σ(d_ij − δ_ij)²를 줄이는 반복 갱신 (SMACOF).
 * 한 번 갱신할 때마다 목적함수가 늘지 않는 것이 보장된다.
 */
export function mdsStep(D: Mat, Y: Vec[]): Vec[] {
  const n = D.length;
  return Y.map((yi, i) => {
    const acc = new Array(yi.length).fill(0);
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const diff = sub(yi, Y[j]);
      const dist = norm(diff);
      const b = dist > 1e-12 ? D[i][j] / dist : 0;
      for (let k = 0; k < acc.length; k++) acc[k] += b * diff[k];
    }
    return acc.map((v) => v / n);
  });
}

/** 인접 그래프 위 최단 경로 (다익스트라) */
export function dijkstra(adj: { to: number; w: number }[][], src: number) {
  const n = adj.length;
  const dist = new Array(n).fill(Infinity);
  const prev = new Array(n).fill(-1);
  const done = new Array(n).fill(false);
  dist[src] = 0;
  for (let it = 0; it < n; it++) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!done[i] && (u < 0 || dist[i] < dist[u])) u = i;
    if (u < 0 || dist[u] === Infinity) break;
    done[u] = true;
    for (const e of adj[u]) {
      if (dist[u] + e.w < dist[e.to]) {
        dist[e.to] = dist[u] + e.w;
        prev[e.to] = u;
      }
    }
  }
  return { dist, prev };
}

/** k-최근접 이웃 그래프 (양방향) */
export function knnGraph(P: Vec[], k: number) {
  const n = P.length;
  const adj: { to: number; w: number }[][] = Array.from({ length: n }, () => []);
  const has = new Set<string>();
  for (let i = 0; i < n; i++) {
    const ds = P.map((q, j) => ({ j, d: norm(sub(P[i], q)) }))
      .filter((e) => e.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, k);
    for (const { j, d } of ds) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (has.has(key)) continue;
      has.add(key);
      adj[i].push({ to: j, w: d });
      adj[j].push({ to: i, w: d });
    }
  }
  return { adj, edges: Array.from(has).map((s) => s.split("-").map(Number) as [number, number]) };
}

/* ─────────── t-SNE (교재 식 7-23, 7-25 그대로) ─────────── */

/** p_{j|i} = exp(−‖xᵢ−xⱼ‖²/2σ²) / Σ_{k≠i} exp(−‖xᵢ−x_k‖²/2σ²) */
export function conditionalP(X: Vec[], sigma: number): Mat {
  const n = X.length;
  return X.map((xi, i) => {
    const row = X.map((xj, j) => (j === i ? 0 : Math.exp(-dot(sub(xi, xj), sub(xi, xj)) / (2 * sigma * sigma))));
    const z = row.reduce((s, v) => s + v, 0);
    return row.map((v) => v / z);
  }).slice(0, n);
}

/** q_{j|i} = (1+‖yᵢ−yⱼ‖²)⁻¹ / Σ_{k≠i}(1+‖yᵢ−y_k‖²)⁻¹ */
export function conditionalQ(Y: Vec[]): { Q: Mat; W: Mat } {
  const n = Y.length;
  const W = zeros(n);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      let d2 = 0;
      for (let k = 0; k < Y[i].length; k++) d2 += (Y[i][k] - Y[j][k]) ** 2;
      W[i][j] = W[j][i] = 1 / (1 + d2);
    }
  }
  const Q = W.map((row) => {
    const z = row.reduce((s, v) => s + v, 0);
    return row.map((v) => v / z);
  });
  return { Q, W };
}

/** Σᵢ KL(Pᵢ ‖ Qᵢ) */
export function klDivergence(P: Mat, Q: Mat) {
  let c = 0;
  for (let i = 0; i < P.length; i++)
    for (let j = 0; j < P.length; j++)
      if (i !== j && P[i][j] > 1e-300) c += P[i][j] * Math.log(P[i][j] / Math.max(Q[i][j], 1e-300));
  return c;
}

/**
 * Σᵢ KL(Pᵢ‖Qᵢ)를 yₐ로 미분한 값
 * ∂C/∂yₐ = 2 Σⱼ (p_{j|a} − q_{j|a} + p_{a|j} − q_{a|j}) wₐⱼ (yₐ − yⱼ)
 */
export function tsneGradient(P: Mat, Y: Vec[]): Vec[] {
  const { Q, W } = conditionalQ(Y);
  return Y.map((ya, a) => {
    const g = new Array(ya.length).fill(0);
    for (let j = 0; j < Y.length; j++) {
      if (j === a) continue;
      const coef = 2 * (P[a][j] - Q[a][j] + P[j][a] - Q[j][a]) * W[a][j];
      for (let k = 0; k < g.length; k++) g[k] += coef * (ya[k] - Y[j][k]);
    }
    return g;
  });
}
