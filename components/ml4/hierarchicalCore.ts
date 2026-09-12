/**
 * 4강 계층적 군집화(병합적 방법) 계산 모듈.
 * 강의록의 1차원 예제(A=1, B=3, C=9, D=12)를 그대로 재현할 수 있도록 1차원 데이터를 다룬다.
 */

export type LinkageType = "single" | "complete" | "centroid" | "average" | "ward";

export interface LinkageInfo {
  key: LinkageType;
  name: string;
  english: string;
  formula: string;
  meaning: string;
  feature: string;
}

export const LINKAGES: LinkageInfo[] = [
  {
    key: "single",
    name: "최단연결법",
    english: "minimum / single linkage",
    formula: "d(Cᵢ, Cⱼ) = min_{xᵢ∈Cᵢ, xⱼ∈Cⱼ} d(xᵢ, xⱼ)",
    meaning: "가장 가까운 데이터 쌍 간의 거리",
    feature: "고립된 군집을 찾는 데 유용",
  },
  {
    key: "complete",
    name: "최장연결법",
    english: "maximum / complete linkage",
    formula: "d(Cᵢ, Cⱼ) = max_{xᵢ∈Cᵢ, xⱼ∈Cⱼ} d(xᵢ, xⱼ)",
    meaning: "가장 멀리 떨어진 데이터 쌍 간의 거리",
    feature: "응집된 군집을 찾는 데 중점을 둠",
  },
  {
    key: "centroid",
    name: "중심연결법",
    english: "centroid linkage",
    formula: "d(Cᵢ, Cⱼ) = d(mᵢ, mⱼ)",
    meaning: "두 군집의 평균 간의 거리",
    feature: "특이값에 강건",
  },
  {
    key: "average",
    name: "평균연결법",
    english: "mean / average linkage",
    formula: "d(Cᵢ, Cⱼ) = (1 / |Cᵢ||Cⱼ|) Σ_{xᵢ∈Cᵢ} Σ_{xⱼ∈Cⱼ} d(xᵢ, xⱼ)",
    meaning: "각 군집에 속하는 모든 데이터 쌍 간 거리의 평균",
    feature: "작은 분산을 가지는 군집을 형성함",
  },
  {
    key: "ward",
    name: "Ward's 방법",
    english: "Ward's method",
    formula: "d(Cᵢ, Cⱼ) = |Cᵢ|‖mᵢ − m‖² + |Cⱼ|‖mⱼ − m‖²",
    meaning: "병합 후의 클러스터 내부의 분산값",
    feature: "비슷한 크기의 군집을 병합함",
  },
];

export interface HCluster {
  id: string;
  members: number[];
  height: number;
  x: number;
  children?: [HCluster, HCluster];
}

export interface HStep {
  stepNo: number;
  /** 병합 직전의 클러스터 풀 */
  clusters: HCluster[];
  /** 클러스터 풀 안의 모든 쌍에 대한 거리 (대각선은 null) */
  matrix: (number | null)[][];
  minI: number;
  minJ: number;
  distance: number;
  mergedId: string;
}

export interface HResult {
  steps: HStep[];
  root: HCluster | null;
  /** snapshots[i] = i번 병합을 마친 뒤의 클러스터 풀 */
  snapshots: HCluster[][];
  heights: number[];
}

function mean(values: number[], members: number[]): number {
  return members.reduce((s, i) => s + values[i], 0) / members.length;
}

export function linkageDistance(
  values: number[],
  a: number[],
  b: number[],
  type: LinkageType
): number {
  if (type === "centroid") {
    return Math.abs(mean(values, a) - mean(values, b));
  }
  if (type === "ward") {
    const ma = mean(values, a);
    const mb = mean(values, b);
    const union = [...a, ...b];
    const m = mean(values, union);
    return a.length * (ma - m) ** 2 + b.length * (mb - m) ** 2;
  }
  const pairs: number[] = [];
  a.forEach((i) => b.forEach((j) => pairs.push(Math.abs(values[i] - values[j]))));
  if (type === "single") return Math.min(...pairs);
  if (type === "complete") return Math.max(...pairs);
  return pairs.reduce((s, v) => s + v, 0) / pairs.length;
}

function clusterId(labels: string[], members: number[], values: number[]): string {
  const ordered = [...members].sort((a, b) => values[a] - values[b]);
  return `C${ordered.map((i) => labels[i]).join("")}`;
}

export function runAgglomerative(
  values: number[],
  labels: string[],
  type: LinkageType
): HResult {
  let pool: HCluster[] = values.map((v, i) => ({
    id: `C${labels[i]}`,
    members: [i],
    height: 0,
    x: v,
  }));

  const steps: HStep[] = [];
  const snapshots: HCluster[][] = [pool];
  const heights: number[] = [];

  while (pool.length > 1) {
    const matrix: (number | null)[][] = pool.map((_, i) =>
      pool.map((__, j) =>
        i === j ? null : linkageDistance(values, pool[i].members, pool[j].members, type)
      )
    );

    let minI = 0;
    let minJ = 1;
    let best = Number.POSITIVE_INFINITY;
    for (let i = 0; i < pool.length; i += 1) {
      for (let j = i + 1; j < pool.length; j += 1) {
        const d = matrix[i][j] as number;
        if (d < best - 1e-12) {
          best = d;
          minI = i;
          minJ = j;
        }
      }
    }

    const left = pool[minI];
    const right = pool[minJ];
    const members = [...left.members, ...right.members];
    const merged: HCluster = {
      id: clusterId(labels, members, values),
      members,
      height: best,
      x: (left.x + right.x) / 2,
      children: [left, right],
    };

    steps.push({
      stepNo: steps.length + 1,
      clusters: pool,
      matrix,
      minI,
      minJ,
      distance: best,
      mergedId: merged.id,
    });
    heights.push(best);

    pool = [...pool.filter((_, i) => i !== minI && i !== minJ), merged];
    snapshots.push(pool);
  }

  return {
    steps,
    root: pool[0] ?? null,
    snapshots,
    heights,
  };
}

/** 덴드로그램의 모든 가로선(병합 지점)을 평평한 목록으로 펼친다 */
export function collectMerges(root: HCluster | null): HCluster[] {
  const out: HCluster[] = [];
  const walk = (node: HCluster) => {
    if (!node.children) return;
    walk(node.children[0]);
    walk(node.children[1]);
    out.push(node);
  };
  if (root) walk(root);
  return out.sort((a, b) => a.height - b.height);
}

/** 절단선 높이 h에서 남는 클러스터 구성 */
export function cutDendrogram(result: HResult, h: number): HCluster[] {
  const merged = result.heights.filter((d) => d <= h + 1e-9).length;
  return result.snapshots[merged] ?? result.snapshots[result.snapshots.length - 1];
}

export interface StableInterval {
  from: number;
  to: number;
  count: number;
  unbounded: boolean;
}

/**
 * 클러스터 간의 거리가 증가하는 동안 클러스터 수가 유지되는 구간.
 * 가장 긴 구간을 고르면 적절한 군집의 수를 얻을 수 있다.
 */
export function stableIntervals(result: HResult, n: number): StableInterval[] {
  const sorted = [...result.heights].sort((a, b) => a - b);
  const out: StableInterval[] = [];
  let from = 0;
  sorted.forEach((h, i) => {
    out.push({ from, to: h, count: n - i, unbounded: false });
    from = h;
  });
  out.push({ from, to: from, count: 1, unbounded: true });
  return out.filter((iv) => iv.unbounded || iv.to > iv.from + 1e-9);
}

export function longestStableInterval(
  result: HResult,
  n: number
): StableInterval | null {
  const bounded = stableIntervals(result, n).filter((iv) => !iv.unbounded);
  if (bounded.length === 0) return null;
  return bounded.reduce((best, iv) =>
    iv.to - iv.from > best.to - best.from ? iv : best
  );
}

/** 분할적 방법에서 하나의 군집을 두 군집으로 나누는 경우의 수 (2^(N−1) − 1) */
export function divisiveSplitCount(n: number): bigint {
  if (n < 2) return BigInt(0);
  return BigInt(2) ** BigInt(n - 1) - BigInt(1);
}
