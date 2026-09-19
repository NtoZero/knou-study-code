/**
 * 6강 앙상블 학습 시각화가 공유하는 계산.
 *
 * 그림은 모두 여기서 실제로 계산한 값으로 그린다.
 * AdaBoost 식은 교재 8.3의 ①~③ 단계를 그대로 옮겼다.
 */

export type Label = 1 | -1;

export interface Pt {
  x: number;
  y: number;
}

/* ─────────── 난수 ─────────── */

/** 결과가 매번 같도록 씨앗값을 받는 난수 생성기 */
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

/* ─────────── 부트스트랩 ─────────── */

/** N개 중에서 Ñ개를 복원추출한 인덱스 */
export function bootstrapIndices(n: number, size: number, rand: () => number): number[] {
  const out: number[] = [];
  for (let k = 0; k < size; k += 1) out.push(Math.floor(rand() * n));
  return out;
}

/** 복원추출에서 특정 데이터 하나가 Ñ번 동안 한 번도 뽑히지 않을 확률 */
export function probNeverPicked(n: number, size: number) {
  return (1 - 1 / n) ** size;
}

/* ─────────── 선형 분류기 h(x) = sign(wᵀx) ─────────── */

/** 3×3 연립방정식 — 가우스 소거 */
function solve3(A: number[][], b: number[]): number[] {
  const m = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < 3; c += 1) {
    let p = c;
    for (let r = c + 1; r < 3; r += 1) if (Math.abs(m[r][c]) > Math.abs(m[p][c])) p = r;
    [m[c], m[p]] = [m[p], m[c]];
    const d = m[c][c] || 1e-12;
    for (let r = 0; r < 3; r += 1) {
      if (r === c) continue;
      const f = m[r][c] / d;
      for (let k = c; k < 4; k += 1) m[r][k] -= f * m[c][k];
    }
  }
  return [m[0][3] / (m[0][0] || 1e-12), m[1][3] / (m[1][1] || 1e-12), m[2][3] / (m[2][2] || 1e-12)];
}

/**
 * 최소제곱법으로 w = [w₀, w₁, w₂]를 구한다. 목표값은 +1 / −1.
 * (XᵀX)w = Xᵀt 를 푼다. 표본이 한쪽에 몰려도 풀리도록 아주 작은 값을 더한다.
 */
export function fitLinear(points: Pt[], labels: Label[]): [number, number, number] {
  const A = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const b = [0, 0, 0];
  points.forEach((p, i) => {
    const v = [1, p.x, p.y];
    for (let r = 0; r < 3; r += 1) {
      b[r] += v[r] * labels[i];
      for (let c = 0; c < 3; c += 1) A[r][c] += v[r] * v[c];
    }
  });
  for (let r = 0; r < 3; r += 1) A[r][r] += 1e-6;
  const w = solve3(A, b);
  return [w[0], w[1], w[2]];
}

export function signOf(v: number): Label {
  return v >= 0 ? 1 : -1;
}

export function linearPredict(w: [number, number, number], p: Pt): Label {
  return signOf(w[0] + w[1] * p.x + w[2] * p.y);
}

/* ─────────── AdaBoost — 1차원 결정 그루터기 ─────────── */

/** h(x) = s  (x < θ),  −s  (x > θ) */
export interface Stump {
  theta: number;
  s: Label;
}

export function stumpPredict(st: Stump, x: number): Label {
  return (x < st.theta ? st.s : -st.s) as Label;
}

export interface AdaRound {
  /** 몇 번째 분류기인지 (1부터) */
  i: number;
  /** 이 분류기를 학습할 때 쓴 가중치 w⁽ⁱ⁾ */
  w: number[];
  stump: Stump;
  /** hᵢ(xⱼ) */
  pred: Label[];
  /** ②-1 가중 오분류율 εᵢ */
  eps: number;
  /** ②-3 중요도 αᵢ */
  alpha: number;
  /** exp{−αᵢ tⱼ hᵢ(xⱼ)} */
  factor: number[];
  /** ②-4 정규화 값 Zᵢ */
  Z: number;
  /** 다음 분류기가 쓸 가중치 w⁽ⁱ⁺¹⁾ */
  wNext: number[];
  /** 여기까지 결합한 Σ αₖ hₖ(xⱼ) */
  score: number[];
  /** 여기까지 결합한 sign(Σ αₖ hₖ(xⱼ)) 의 학습 데이터 오분류 개수 */
  combinedErrors: number;
}

/** 경계 후보 — 이웃한 x의 중간과 양 끝 바깥 */
export function stumpThresholds(xs: number[]): number[] {
  const u = Array.from(new Set(xs)).sort((a, b) => a - b);
  const th = [u[0] - 0.5];
  for (let k = 0; k < u.length - 1; k += 1) th.push((u[k] + u[k + 1]) / 2);
  th.push(u[u.length - 1] + 0.5);
  return th;
}

/** ②-2 가중 오분류율이 가장 작은 그루터기. 같으면 경계가 왼쪽인 것, s = +1인 것을 먼저 고른다. */
export function bestStump(xs: number[], ts: Label[], w: number[]) {
  let best: { stump: Stump; eps: number } | null = null;
  for (const theta of stumpThresholds(xs)) {
    for (const s of [1, -1] as Label[]) {
      const st = { theta, s };
      let eps = 0;
      xs.forEach((x, j) => {
        if (stumpPredict(st, x) !== ts[j]) eps += w[j];
      });
      if (!best || eps < best.eps - 1e-12) best = { stump: st, eps };
    }
  }
  return best!;
}

/**
 * 교재 8.3 AdaBoost ①~③을 M번 수행한다.
 * εᵢ = 0이면 αᵢ가 무한대가 되므로 그 분류기를 끝으로 멈춘다.
 */
export function runAdaBoost1D(xs: number[], ts: Label[], M: number): AdaRound[] {
  const N = xs.length;
  let w = new Array(N).fill(1 / N);
  const score = new Array(N).fill(0);
  const rounds: AdaRound[] = [];
  for (let i = 1; i <= M; i += 1) {
    const { stump, eps } = bestStump(xs, ts, w);
    const pred = xs.map((x) => stumpPredict(stump, x));
    if (eps <= 1e-12) {
      rounds.push({
        i,
        w,
        stump,
        pred,
        eps: 0,
        alpha: Number.POSITIVE_INFINITY,
        factor: pred.map(() => Number.NaN),
        Z: Number.NaN,
        wNext: w,
        score: pred.map((p) => p * 1e9),
        combinedErrors: 0,
      });
      break;
    }
    const alpha = 0.5 * Math.log((1 - eps) / eps);
    const factor = pred.map((h, j) => Math.exp(-alpha * ts[j] * h));
    const raw = w.map((wj, j) => wj * factor[j]);
    const Z = raw.reduce((a, b) => a + b, 0);
    const wNext = raw.map((r) => r / Z);
    pred.forEach((h, j) => {
      score[j] += alpha * h;
    });
    const combinedErrors = score.filter((sc, j) => signOf(sc) !== ts[j]).length;
    rounds.push({
      i,
      w,
      stump,
      pred,
      eps,
      alpha,
      factor,
      Z,
      wNext,
      score: [...score],
      combinedErrors,
    });
    w = wNext;
  }
  return rounds;
}

/* ─────────── AdaBoost — 2차원 선형 분류기 (적용 예) ─────────── */

/** 방향 (cos a, sin a)에 사영한 값이 θ보다 작으면 s, 크면 −s 를 내는 선형 분류기 */
export interface Oblique {
  angle: number;
  theta: number;
  s: Label;
}

export interface Oblique2DModel {
  learners: Oblique[];
  alphas: number[];
  /** M = 1…len 일 때 학습 데이터 분류 오차 */
  trainError: number[];
  /** M = 1…len 일 때 별도 평가 데이터 분류 오차 */
  testError: number[];
}

export function obliqueProject(angle: number, p: Pt) {
  return Math.cos(angle) * p.x + Math.sin(angle) * p.y;
}

export function obliquePredict(h: Oblique, p: Pt): Label {
  return (obliqueProject(h.angle, p) < h.theta ? h.s : -h.s) as Label;
}

/**
 * 여러 방향의 직선 가운데 가중 오분류율이 가장 작은 것을 고르는 선형 분류기로
 * AdaBoost를 수행한다. 방향마다 사영값을 한 번 정렬해 두고 누적합으로 경계를 훑는다.
 */
export function runAdaBoostOblique(
  train: Pt[],
  tTrain: Label[],
  test: Pt[],
  tTest: Label[],
  M: number,
  directions = 36,
): Oblique2DModel {
  const N = train.length;
  const angles = Array.from({ length: directions }, (_, k) => (k * Math.PI) / directions);
  const sorted = angles.map((a) => {
    const proj = train.map((p) => obliqueProject(a, p));
    const order = proj.map((_, j) => j).sort((i, j) => proj[i] - proj[j]);
    return { a, proj, order };
  });

  let w = new Array(N).fill(1 / N);
  const learners: Oblique[] = [];
  const alphas: number[] = [];
  const trainScore = new Array(N).fill(0);
  const testScore = new Array(test.length).fill(0);
  const trainError: number[] = [];
  const testError: number[] = [];

  for (let i = 0; i < M; i += 1) {
    // s = +1 일 때: 경계 왼쪽은 +1로 판정. 왼쪽의 −1, 오른쪽의 +1이 오분류.
    const totalPos = tTrain.reduce((acc, t, j) => acc + (t === 1 ? w[j] : 0), 0);
    let best = { eps: Number.POSITIVE_INFINITY, h: { angle: 0, theta: 0, s: 1 as Label } };
    for (const { a, proj, order } of sorted) {
      let leftNeg = 0;
      let leftPos = 0;
      for (let k = 0; k <= N; k += 1) {
        const theta =
          k === 0
            ? proj[order[0]] - 1e-6
            : k === N
              ? proj[order[N - 1]] + 1e-6
              : (proj[order[k - 1]] + proj[order[k]]) / 2;
        const epsPlus = leftNeg + (totalPos - leftPos);
        const epsMinus = 1 - epsPlus;
        if (epsPlus < best.eps) best = { eps: epsPlus, h: { angle: a, theta, s: 1 } };
        if (epsMinus < best.eps) best = { eps: epsMinus, h: { angle: a, theta, s: -1 } };
        if (k < N) {
          const j = order[k];
          if (tTrain[j] === 1) leftPos += w[j];
          else leftNeg += w[j];
        }
      }
    }
    const eps = Math.max(best.eps, 1e-10);
    const alpha = 0.5 * Math.log((1 - eps) / eps);
    const pred = train.map((p) => obliquePredict(best.h, p));
    const raw = w.map((wj, j) => wj * Math.exp(-alpha * tTrain[j] * pred[j]));
    const Z = raw.reduce((acc, v) => acc + v, 0);
    w = raw.map((v) => v / Z);

    learners.push(best.h);
    alphas.push(alpha);
    pred.forEach((h, j) => {
      trainScore[j] += alpha * h;
    });
    test.forEach((p, j) => {
      testScore[j] += alpha * obliquePredict(best.h, p);
    });
    trainError.push(trainScore.filter((sc, j) => signOf(sc) !== tTrain[j]).length / N);
    testError.push(testScore.filter((sc, j) => signOf(sc) !== tTest[j]).length / test.length);
  }
  return { learners, alphas, trainError, testError };
}

export function obliqueEnsemblePredict(model: Oblique2DModel, M: number, p: Pt): Label {
  let s = 0;
  for (let i = 0; i < M; i += 1) s += model.alphas[i] * obliquePredict(model.learners[i], p);
  return signOf(s);
}

/* ─────────── 보팅 ─────────── */

export function argmax(v: number[]) {
  let bi = 0;
  v.forEach((x, i) => {
    if (x > v[bi] + 1e-12) bi = i;
  });
  return bi;
}

/** 여러 개가 같은 최댓값이면 동점 */
export function isTie(v: number[]) {
  const m = Math.max(...v);
  return v.filter((x) => Math.abs(x - m) < 1e-9).length > 1;
}
