/**
 * 7강 결정 트리·랜덤 포레스트 계산 모듈.
 *
 * 화면의 모든 수치(지니 불순도, 지니 평가지수, 엔트로피, 결정경계, 회귀함수)는
 * 여기서 실제로 계산한다. 교재 <표 9-1>의 14개 데이터는 원문 그대로 옮겼다.
 */

/* ─────────── 교재 <표 9-1> 세탁기 동작 여부 데이터 ─────────── */

export type Weather = "Sunny" | "Rainy" | "Cloudy";
export type Temperature = "High" | "Medium" | "Low";
export type Amount = "Small" | "Large";
export type Machine = "ON" | "OFF";

export interface WashRow {
  no: number;
  weather: Weather;
  temperature: Temperature;
  humidity: number;
  amount: Amount;
  label: Machine;
}

export const WASH_DATA: WashRow[] = [
  { no: 1, weather: "Cloudy", temperature: "High", humidity: 85, amount: "Small", label: "OFF" },
  { no: 2, weather: "Cloudy", temperature: "High", humidity: 82, amount: "Large", label: "ON" },
  { no: 3, weather: "Rainy", temperature: "High", humidity: 90, amount: "Small", label: "OFF" },
  { no: 4, weather: "Sunny", temperature: "Medium", humidity: 80, amount: "Small", label: "OFF" },
  { no: 5, weather: "Sunny", temperature: "Low", humidity: 60, amount: "Small", label: "ON" },
  { no: 6, weather: "Sunny", temperature: "Low", humidity: 52, amount: "Large", label: "ON" },
  { no: 7, weather: "Rainy", temperature: "Low", humidity: 95, amount: "Large", label: "OFF" },
  { no: 8, weather: "Cloudy", temperature: "Medium", humidity: 83, amount: "Small", label: "OFF" },
  { no: 9, weather: "Cloudy", temperature: "Low", humidity: 62, amount: "Small", label: "OFF" },
  { no: 10, weather: "Sunny", temperature: "Medium", humidity: 46, amount: "Small", label: "ON" },
  { no: 11, weather: "Cloudy", temperature: "Medium", humidity: 55, amount: "Large", label: "ON" },
  { no: 12, weather: "Rainy", temperature: "Medium", humidity: 97, amount: "Large", label: "OFF" },
  { no: 13, weather: "Rainy", temperature: "High", humidity: 93, amount: "Small", label: "OFF" },
  { no: 14, weather: "Sunny", temperature: "Medium", humidity: 81, amount: "Large", label: "OFF" },
];

export type WashAttr = "weather" | "temperature" | "amount" | "humidity";

export interface AttrSpec {
  key: WashAttr;
  name: string;
  /** 가지 이름 — 교재 그림 9-3의 순서 */
  branches: string[];
  /** 행이 어느 가지로 가는지 */
  branchOf: (r: WashRow) => string;
}

/** 습도는 연속값이므로 그림 9-1처럼 기준값 80으로 둘로 나눈다 */
export const HUMIDITY_THRESHOLD = 80;

export const ATTRS: Record<WashAttr, AttrSpec> = {
  weather: {
    key: "weather",
    name: "Weather",
    branches: ["Sunny", "Rainy", "Cloudy"],
    branchOf: (r) => r.weather,
  },
  temperature: {
    key: "temperature",
    name: "Temperature",
    branches: ["High", "Medium", "Low"],
    branchOf: (r) => r.temperature,
  },
  amount: {
    key: "amount",
    name: "Amount",
    branches: ["Small", "Large"],
    branchOf: (r) => r.amount,
  },
  humidity: {
    key: "humidity",
    name: "Humidity",
    branches: [`< ${HUMIDITY_THRESHOLD}`, `≥ ${HUMIDITY_THRESHOLD}`],
    branchOf: (r) => (r.humidity < HUMIDITY_THRESHOLD ? `< ${HUMIDITY_THRESHOLD}` : `≥ ${HUMIDITY_THRESHOLD}`),
  },
};

export interface LabelCount {
  on: number;
  off: number;
  n: number;
}

export function countLabels(rows: WashRow[]): LabelCount {
  const on = rows.filter((r) => r.label === "ON").length;
  return { on, off: rows.length - on, n: rows.length };
}

/* ─────────── 평가지수 ─────────── */

/** 지니 불순도 I(N) = 1 − Σ pᵢ² (식 9-1) */
export function giniFromCounts(counts: number[]): number {
  const n = counts.reduce((a, b) => a + b, 0);
  if (n === 0) return 0;
  return 1 - counts.reduce((s, c) => s + (c / n) ** 2, 0);
}

/** 엔트로피 H = −Σ pᵢ log₂ pᵢ (0·log 0 = 0) */
export function entropyFromCounts(counts: number[]): number {
  const n = counts.reduce((a, b) => a + b, 0);
  if (n === 0) return 0;
  return counts.reduce((s, c) => (c === 0 ? s : s - (c / n) * Math.log2(c / n)), 0);
}

export interface ChildGroup {
  branch: string;
  rows: WashRow[];
  count: LabelCount;
  gini: number;
  entropy: number;
}

export interface SplitEval {
  attr: AttrSpec;
  children: ChildGroup[];
  /** 지니 평가지수 G(R_a) = Σ |Cᵢ|/|R_a| · I(Cᵢ) (식 9-4) */
  giniCriterion: number;
  /** 분할 후 엔트로피의 가중합 */
  weightedEntropy: number;
  /** 정보 이득 = 분할 전 엔트로피 − 분할 후 엔트로피 가중합 */
  infoGain: number;
  /** 피어슨 카이제곱 통계량 Σ (관측 − 기대)² / 기대 */
  chiSquare: number;
  /** 한 번에 리프 노드(순수 노드)로 할당된 데이터 개수 */
  pureCount: number;
}

export function evaluateSplit(rows: WashRow[], attr: AttrSpec): SplitEval {
  const parent = countLabels(rows);
  const parentEntropy = entropyFromCounts([parent.on, parent.off]);
  const children: ChildGroup[] = attr.branches
    .map((b) => {
      const sub = rows.filter((r) => attr.branchOf(r) === b);
      const count = countLabels(sub);
      return {
        branch: b,
        rows: sub,
        count,
        gini: giniFromCounts([count.on, count.off]),
        entropy: entropyFromCounts([count.on, count.off]),
      };
    })
    .filter((c) => c.count.n > 0);
  const N = rows.length;
  const giniCriterion = children.reduce((s, c) => s + (c.count.n / N) * c.gini, 0);
  const weightedEntropy = children.reduce((s, c) => s + (c.count.n / N) * c.entropy, 0);
  let chiSquare = 0;
  for (const c of children) {
    const expOn = (c.count.n * parent.on) / N;
    const expOff = (c.count.n * parent.off) / N;
    if (expOn > 0) chiSquare += (c.count.on - expOn) ** 2 / expOn;
    if (expOff > 0) chiSquare += (c.count.off - expOff) ** 2 / expOff;
  }
  const pureCount = children
    .filter((c) => c.count.on === 0 || c.count.off === 0)
    .reduce((s, c) => s + c.count.n, 0);
  return {
    attr,
    children,
    giniCriterion,
    weightedEntropy,
    infoGain: parentEntropy - weightedEntropy,
    chiSquare,
    pureCount,
  };
}

/* ─────────── 난수 ─────────── */

/** 시드 고정 난수 — 새로고침해도 같은 그림이 나오도록 */
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

/* ─────────── 연속값 속성용 CART ─────────── */

export interface Sample {
  x: number[];
  /** 분류: 0 또는 1, 회귀: 실수 */
  y: number;
}

export type TreeTask = "classification" | "regression";

export interface TreeNode {
  id: number;
  /** 교재 표기의 깊이 — 루트가 깊이 1 */
  depth: number;
  n: number;
  /** 분류: 클래스별 개수 [클래스 0, 클래스 1] */
  counts: [number, number];
  /** 분류: 지니 불순도, 회귀: 제곱오차(평균) */
  impurity: number;
  /** 분류: 다수 클래스, 회귀: 목표 출력값의 평균 */
  value: number;
  feature?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
}

function nodeStats(samples: Sample[], task: TreeTask) {
  const n = samples.length;
  const c1 = samples.filter((s) => s.y >= 0.5).length;
  const counts: [number, number] = [n - c1, c1];
  if (task === "classification") {
    return {
      counts,
      impurity: giniFromCounts(counts),
      value: counts[1] > counts[0] ? 1 : 0,
    };
  }
  const mean = samples.reduce((s, d) => s + d.y, 0) / Math.max(1, n);
  const mse = samples.reduce((s, d) => s + (d.y - mean) ** 2, 0) / Math.max(1, n);
  return { counts, impurity: mse, value: mean };
}

interface BestSplit {
  feature: number;
  threshold: number;
  score: number;
}

/**
 * 모든 속성과 인접한 두 값의 중간점을 기준값 후보로 두고,
 * 자식 노드 불순도의 가중합(분류: 지니 평가지수, 회귀: 제곱오차 가중합)이 가장 작은 분할을 고른다.
 */
function findBestSplit(samples: Sample[], task: TreeTask): BestSplit | null {
  const n = samples.length;
  const dims = samples[0].x.length;
  let best: BestSplit | null = null;
  for (let f = 0; f < dims; f += 1) {
    const sorted = [...samples].sort((a, b) => a.x[f] - b.x[f]);
    // 누적합으로 O(n) 탐색
    let lc0 = 0;
    let lc1 = 0;
    let lSum = 0;
    let lSq = 0;
    const tc1 = sorted.filter((s) => s.y >= 0.5).length;
    const tc0 = n - tc1;
    const tSum = sorted.reduce((s, d) => s + d.y, 0);
    const tSq = sorted.reduce((s, d) => s + d.y * d.y, 0);
    for (let i = 0; i < n - 1; i += 1) {
      const s = sorted[i];
      if (s.y >= 0.5) lc1 += 1;
      else lc0 += 1;
      lSum += s.y;
      lSq += s.y * s.y;
      if (sorted[i + 1].x[f] === s.x[f]) continue;
      const nl = i + 1;
      const nr = n - nl;
      let score: number;
      if (task === "classification") {
        score =
          (nl / n) * giniFromCounts([lc0, lc1]) + (nr / n) * giniFromCounts([tc0 - lc0, tc1 - lc1]);
      } else {
        const rSum = tSum - lSum;
        const rSq = tSq - lSq;
        const lVar = lSq / nl - (lSum / nl) ** 2;
        const rVar = rSq / nr - (rSum / nr) ** 2;
        score = (nl / n) * lVar + (nr / n) * rVar;
      }
      if (!best || score < best.score - 1e-12) {
        best = { feature: f, threshold: (s.x[f] + sorted[i + 1].x[f]) / 2, score };
      }
    }
  }
  return best;
}

/**
 * 결정 트리 학습. maxDepth는 교재 표기(루트 = 깊이 1)이며,
 * 깊이 d인 트리의 리프는 최대 2^(d−1)개. Infinity면 모든 리프가 순수해질 때까지 분할.
 */
export function buildTree(samples: Sample[], task: TreeTask, maxDepth: number): TreeNode {
  let nextId = 0;
  const grow = (subset: Sample[], depth: number): TreeNode => {
    const st = nodeStats(subset, task);
    const node: TreeNode = {
      id: nextId++,
      depth,
      n: subset.length,
      counts: st.counts,
      impurity: st.impurity,
      value: st.value,
    };
    if (depth >= maxDepth || subset.length < 2 || st.impurity < 1e-12) return node;
    const split = findBestSplit(subset, task);
    if (!split) return node;
    const L = subset.filter((s) => s.x[split.feature] <= split.threshold);
    const R = subset.filter((s) => s.x[split.feature] > split.threshold);
    if (L.length === 0 || R.length === 0) return node;
    node.feature = split.feature;
    node.threshold = split.threshold;
    node.left = grow(L, depth + 1);
    node.right = grow(R, depth + 1);
    return node;
  };
  return grow(samples, 1);
}

export function predict(node: TreeNode, x: number[]): number {
  let cur = node;
  while (cur.left && cur.right && cur.feature !== undefined && cur.threshold !== undefined) {
    cur = x[cur.feature] <= cur.threshold ? cur.left : cur.right;
  }
  return cur.value;
}

export function treeDepth(node: TreeNode): number {
  if (!node.left || !node.right) return node.depth;
  return Math.max(treeDepth(node.left), treeDepth(node.right));
}

export function leaves(node: TreeNode): TreeNode[] {
  if (!node.left || !node.right) return [node];
  return [...leaves(node.left), ...leaves(node.right)];
}

export function allNodes(node: TreeNode): TreeNode[] {
  if (!node.left || !node.right) return [node];
  return [node, ...allNodes(node.left), ...allNodes(node.right)];
}

/** 지정한 id의 내부 노드를 리프로 되돌린 새 트리 (가지치기) */
export function pruneAt(node: TreeNode, ids: Set<number>): TreeNode {
  if (ids.has(node.id) || !node.left || !node.right) {
    return { ...node, left: undefined, right: undefined, feature: undefined, threshold: undefined };
  }
  return { ...node, left: pruneAt(node.left, ids), right: pruneAt(node.right, ids) };
}

export function accuracy(tree: TreeNode, data: Sample[]): number {
  if (data.length === 0) return 0;
  return data.filter((d) => predict(tree, d.x) === d.y).length / data.length;
}

/* ─────────── 데이터 생성 ─────────── */

/**
 * 교재 그림 9-4와 같은 형태의 2차원 분류 데이터.
 * x₁, x₂ ∈ (0, 1), 실제 결정경계 x₁ = x₂. x₂ > x₁이면 C₁(클래스 0), 아니면 C₂(클래스 1).
 * flipRate만큼 레이블을 뒤집어 노이즈를 넣을 수 있다.
 */
export function makeDiagonalData(n: number, seed: number, flipRate = 0): Sample[] {
  const rnd = mulberry32(seed);
  const out: Sample[] = [];
  for (let i = 0; i < n; i += 1) {
    const x1 = Number(rnd().toFixed(3));
    const x2 = Number(rnd().toFixed(3));
    let y = x2 > x1 ? 0 : 1;
    if (rnd() < flipRate) y = 1 - y;
    out.push({ x: [x1, x2], y });
  }
  return out;
}

/**
 * 교재 그림 9-9와 같은 형태의 1차원 회귀 데이터.
 * x ∈ [0, 5], y = sin(x)에 다섯 개마다 하나씩 큰 노이즈.
 */
export function makeSineData(n: number, seed: number): Sample[] {
  const rnd = mulberry32(seed);
  const xs = Array.from({ length: n }, () => 5 * rnd()).sort((a, b) => a - b);
  return xs.map((x, i) => {
    let y = Math.sin(x);
    if (i % 5 === 0) y += 3 * (0.5 - rnd());
    return { x: [Number(x.toFixed(3))], y: Number(y.toFixed(3)) };
  });
}

/** 화면 전체에서 같은 데이터를 쓰기 위한 시드 */
export const DIAG_SEED = 545;
export const SINE_SEED = 8;
export const NOISY_SEED = 11;
export const NOISY_FLIP = 0.06;
export const VALID_SEED = 31;

/* ─────────── 랜덤 포레스트 ─────────── */

/** 복원추출로 size개를 뽑은 인덱스 */
export function bootstrapIndices(N: number, size: number, rnd: () => number): number[] {
  return Array.from({ length: size }, () => Math.floor(rnd() * N));
}

export interface Forest {
  trees: TreeNode[];
  samples: number[][];
}

export function buildForest(
  data: Sample[],
  task: TreeTask,
  M: number,
  maxDepth: number,
  seed: number,
  sampleSize = data.length,
): Forest {
  const rnd = mulberry32(seed);
  const trees: TreeNode[] = [];
  const samples: number[][] = [];
  for (let m = 0; m < M; m += 1) {
    const idx = bootstrapIndices(data.length, sampleSize, rnd);
    samples.push(idx);
    trees.push(buildTree(idx.map((i) => data[i]), task, maxDepth));
  }
  return { trees, samples };
}

/** 분류는 보팅(다수결), 회귀는 출력값의 평균 */
export function forestPredict(trees: TreeNode[], x: number[], task: TreeTask): number {
  const outs = trees.map((t) => predict(t, x));
  if (task === "regression") return outs.reduce((a, b) => a + b, 0) / outs.length;
  const votes1 = outs.filter((o) => o === 1).length;
  return votes1 * 2 > outs.length ? 1 : 0;
}

/** 소수 자릿수 고정 표기 */
export const fmt = (v: number, d = 4) => v.toFixed(d);
