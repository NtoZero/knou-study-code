/**
 * 4강 K-평균 군집화 계산 모듈.
 * 강의록의 수행 단계(②데이터 그룹핑 / ③대표 벡터 수정)를 그대로 프레임으로 펼쳐 둔다.
 */

export interface Point {
  x: number;
  y: number;
}

export type KMeansPhase = "init" | "grouping" | "update";

export interface KMeansFrame {
  index: number;
  /** 반복 회차 (초기화 프레임은 0) */
  iteration: number;
  phase: KMeansPhase;
  centroids: Point[];
  /** 각 데이터가 속한 클러스터 번호. -1은 아직 그룹핑 전 */
  assignment: number[];
  /** 목적함수 J. 그룹핑 전에는 null */
  objective: number | null;
  /** ‖m_new − m‖의 최댓값. 대표 벡터 수정 단계에서만 값이 있음 */
  shift: number | null;
  converged: boolean;
}

export interface KMeansRun {
  frames: KMeansFrame[];
  /** 수렴까지 수행한 반복 횟수 */
  iterations: number;
  objectiveByIteration: number[];
  finalObjective: number;
  finalCentroids: Point[];
  finalAssignment: number[];
}

export const CLUSTER_COLORS = ["#0d9488", "#0891b2", "#059669", "#d97706"];

export function sqDist(a: Point, b: Point): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

export function dist(a: Point, b: Point): number {
  return Math.sqrt(sqDist(a, b));
}

/** C_k = { x_j | d(x_j, m_k) ≤ d(x_j, m_i), i = 1,…,K } */
export function assignPoints(points: Point[], centroids: Point[]): number[] {
  return points.map((p) => {
    let best = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    centroids.forEach((m, i) => {
      const d = sqDist(p, m);
      if (d < bestDist - 1e-12) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  });
}

/** J = Σ_n Σ_i r_ni ‖x_n − m_i‖² */
export function objectiveValue(
  points: Point[],
  centroids: Point[],
  assignment: number[]
): number {
  return points.reduce((sum, p, i) => {
    const c = centroids[assignment[i]];
    return c ? sum + sqDist(p, c) : sum;
  }, 0);
}

/** m_k^new = (1/|C_k|) Σ_{x_j ∈ C_k} x_j — 빈 클러스터는 기존 대표 벡터를 유지 */
export function updateCentroids(
  points: Point[],
  assignment: number[],
  centroids: Point[]
): Point[] {
  return centroids.map((m, i) => {
    const members = points.filter((_, j) => assignment[j] === i);
    if (members.length === 0) return { ...m };
    return {
      x: members.reduce((s, p) => s + p.x, 0) / members.length,
      y: members.reduce((s, p) => s + p.y, 0) / members.length,
    };
  });
}

export function runKMeans(
  points: Point[],
  initial: Point[],
  maxIterations = 30
): KMeansRun {
  const frames: KMeansFrame[] = [];
  let centroids = initial.map((p) => ({ ...p }));

  frames.push({
    index: 0,
    iteration: 0,
    phase: "init",
    centroids: centroids.map((p) => ({ ...p })),
    assignment: points.map(() => -1),
    objective: null,
    shift: null,
    converged: false,
  });

  const objectiveByIteration: number[] = [];
  let assignment = points.map(() => -1);
  let iterations = 0;

  for (let it = 1; it <= maxIterations; it += 1) {
    assignment = assignPoints(points, centroids);
    const J = objectiveValue(points, centroids, assignment);
    objectiveByIteration.push(J);

    frames.push({
      index: frames.length,
      iteration: it,
      phase: "grouping",
      centroids: centroids.map((p) => ({ ...p })),
      assignment: [...assignment],
      objective: J,
      shift: null,
      converged: false,
    });

    const next = updateCentroids(points, assignment, centroids);
    const shift = Math.max(...next.map((m, i) => dist(m, centroids[i])));
    const converged = shift < 1e-9;

    frames.push({
      index: frames.length,
      iteration: it,
      phase: "update",
      centroids: next.map((p) => ({ ...p })),
      assignment: [...assignment],
      objective: J,
      shift,
      converged,
    });

    centroids = next;
    iterations = it;
    if (converged) break;
  }

  return {
    frames,
    iterations,
    objectiveByIteration,
    finalObjective: objectiveByIteration[objectiveByIteration.length - 1] ?? 0,
    finalCentroids: centroids,
    finalAssignment: assignment,
  };
}

/**
 * 강의에서 소개한 초기값 설정 방법 중
 * "데이터 집합에서 어느 정도 거리가 떨어진 것들을 선택"을 결정론적으로 구현한다.
 */
export function farthestPointInit(points: Point[], k: number): Point[] {
  if (points.length === 0) return [];
  const mean = {
    x: points.reduce((s, p) => s + p.x, 0) / points.length,
    y: points.reduce((s, p) => s + p.y, 0) / points.length,
  };
  let seed = 0;
  let seedDist = Number.POSITIVE_INFINITY;
  points.forEach((p, i) => {
    const d = sqDist(p, mean);
    if (d < seedDist) {
      seedDist = d;
      seed = i;
    }
  });

  const chosen = [seed];
  while (chosen.length < k && chosen.length < points.length) {
    let bestIdx = 0;
    let bestDist = -1;
    points.forEach((p, i) => {
      const d = Math.min(...chosen.map((j) => sqDist(p, points[j])));
      if (d > bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    });
    chosen.push(bestIdx);
  }
  return chosen.map((i) => ({ ...points[i] }));
}

/** 임의 선택 — 반드시 이벤트 핸들러 안에서만 호출할 것 */
export function randomInit(points: Point[], k: number): Point[] {
  const pool = points.map((_, i) => i);
  const picked: number[] = [];
  while (picked.length < k && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return picked.map((i) => ({ ...points[i] }));
}

/**
 * 대표 벡터들의 수직이등분선(보로노이 경계)을 격자 셀 색칠로 근사한다.
 * 반환값[row][col] = 해당 셀에서 가장 가까운 대표 벡터 번호.
 */
export function voronoiGrid(
  centroids: Point[],
  cells: number,
  min: number,
  max: number
): number[][] {
  const span = max - min;
  const grid: number[][] = [];
  for (let r = 0; r < cells; r += 1) {
    const row: number[] = [];
    const y = min + ((r + 0.5) / cells) * span;
    for (let c = 0; c < cells; c += 1) {
      const x = min + ((c + 0.5) / cells) * span;
      let best = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      centroids.forEach((m, i) => {
        const d = sqDist({ x, y }, m);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      row.push(best);
    }
    grid.push(row);
  }
  return grid;
}

/** 4강 시뮬레이터가 공유하는 고정 데이터 집합 (세 덩어리가 보이도록 배치) */
export const KMEANS_DATA: Point[] = [
  { x: 1.4, y: 7.1 },
  { x: 2.0, y: 8.2 },
  { x: 2.8, y: 7.6 },
  { x: 1.7, y: 6.6 },
  { x: 2.5, y: 6.9 },
  { x: 3.1, y: 8.1 },
  { x: 1.2, y: 8.0 },
  { x: 2.3, y: 7.3 },
  { x: 3.0, y: 6.8 },
  { x: 1.9, y: 7.9 },
  { x: 2.6, y: 8.5 },
  { x: 1.5, y: 7.5 },
  { x: 7.0, y: 6.8 },
  { x: 7.9, y: 7.6 },
  { x: 8.4, y: 7.0 },
  { x: 7.3, y: 7.9 },
  { x: 8.1, y: 6.4 },
  { x: 6.9, y: 7.4 },
  { x: 8.6, y: 7.7 },
  { x: 7.6, y: 6.9 },
  { x: 7.2, y: 6.3 },
  { x: 8.2, y: 8.0 },
  { x: 6.7, y: 6.9 },
  { x: 7.8, y: 7.2 },
  { x: 4.3, y: 2.0 },
  { x: 5.2, y: 2.7 },
  { x: 4.8, y: 1.5 },
  { x: 5.7, y: 2.2 },
  { x: 4.1, y: 2.9 },
  { x: 5.4, y: 1.8 },
  { x: 6.0, y: 2.6 },
  { x: 4.6, y: 2.5 },
  { x: 5.0, y: 3.1 },
  { x: 5.8, y: 3.0 },
  { x: 4.4, y: 1.2 },
  { x: 5.5, y: 2.4 },
];

export const KM_MIN = -0.5;
export const KM_MAX = 10.5;
