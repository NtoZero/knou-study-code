/**
 * 11강 CNN 계산 핵심.
 *
 * 입력 행렬과 필터는 교재 [그림 12-11] · [그림 12-13] · [그림 12-14]와
 * 강의록 콘볼루션층 슬라이드에 쓰인 값을 그대로 옮긴 것이고,
 * 콘볼루션·풀링 결과는 모두 여기서 직접 계산한다.
 */

export type Matrix = number[][];

/** 교재 [그림 12-11]의 7×7 입력 x */
export const INPUT_7: Matrix = [
  [0, 1, 2, 5, 7, 8, 2],
  [1, 8, 2, 4, 0, 0, 3],
  [2, 1, 2, 3, 6, 5, 5],
  [5, 5, 6, 2, 0, 1, 7],
  [4, 9, 2, 1, 7, 0, 3],
  [0, 0, 3, 2, 7, 9, 0],
  [8, 2, 4, 5, 0, 2, 1],
];

export interface FilterDef {
  id: string;
  name: string;
  w: Matrix;
  basis: string;
}

/** 교재 12.3.1의 방향별 에지 필터와 강의록 ‘왜 콘볼루션인가?’ 슬라이드의 필터 */
export const FILTERS: FilterDef[] = [
  {
    id: "vertical",
    name: "수직 에지",
    w: [
      [-1, 0, 1],
      [-1, 0, 1],
      [-1, 0, 1],
    ],
    basis: "교재 12.3.1 · [그림 12-11]의 필터 w",
  },
  {
    id: "horizontal",
    name: "수평 에지",
    w: [
      [-1, -1, -1],
      [0, 0, 0],
      [1, 1, 1],
    ],
    basis: "교재 12.3.1 방향별 에지 필터",
  },
  {
    id: "diagonal",
    name: "대각선 에지",
    w: [
      [0, -1, -1],
      [1, 0, -1],
      [1, 1, 0],
    ],
    basis: "교재 12.3.1 방향별 에지 필터",
  },
  {
    id: "center",
    name: "가운데 강조",
    w: [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1],
    ],
    basis: "강의록 ‘왜 콘볼루션인가?’ 슬라이드의 필터 — 이름 없이 값만 제시된다",
  },
  {
    id: "diagonal2",
    name: "대각선 에지(반대)",
    w: [
      [0, 1, 1],
      [-1, 0, 1],
      [-1, -1, 0],
    ],
    basis: "교재 12.3.1 방향별 에지 필터 — ‘또는’으로 제시된 쪽",
  },
];

/** 출력 특징맵 한 변의 크기 — 교재의 세 가지 예(5×5, 7×7, 4×4)를 모두 재현한다 */
export function outSize(n: number, f: number, s: number, p: number): number {
  return Math.floor((n + 2 * p - f) / s) + 1;
}

/** 0으로 채운 패딩 */
export function padMatrix(m: Matrix, p: number): Matrix {
  if (p <= 0) return m.map((r) => [...r]);
  const w = m[0].length + 2 * p;
  const top = Array.from({ length: p }, () => new Array(w).fill(0));
  const body = m.map((r) => [...new Array(p).fill(0), ...r, ...new Array(p).fill(0)]);
  const bottom = Array.from({ length: p }, () => new Array(w).fill(0));
  return [...top, ...body, ...bottom];
}

export interface ConvCell {
  /** 특징맵에서의 위치 */
  i: number;
  j: number;
  /** 패딩이 적용된 입력에서 창의 좌상단 */
  top: number;
  left: number;
  /** 창 안의 값과 그에 곱해지는 가중치 */
  window: number[][];
  products: number[][];
  sum: number;
  /** 바이어스를 더하고 활성화 함수를 거친 값 */
  out: number;
}

export interface ConvResult {
  padded: Matrix;
  size: number;
  cells: ConvCell[];
  map: Matrix;
}

/** 2차원 콘볼루션 — 식 12-6, 식 12-7 */
export function convolve(
  x: Matrix,
  w: Matrix,
  opts: { stride?: number; padding?: number; bias?: number; relu?: boolean } = {},
): ConvResult {
  const stride = opts.stride ?? 1;
  const padding = opts.padding ?? 0;
  const bias = opts.bias ?? 0;
  const relu = opts.relu ?? false;
  const f = w.length;
  const padded = padMatrix(x, padding);
  const size = outSize(x.length, f, stride, padding);
  const cells: ConvCell[] = [];
  const map: Matrix = [];
  for (let i = 0; i < size; i += 1) {
    const row: number[] = [];
    for (let j = 0; j < size; j += 1) {
      const top = i * stride;
      const left = j * stride;
      const window: number[][] = [];
      const products: number[][] = [];
      let sum = 0;
      for (let a = 0; a < f; a += 1) {
        const wr: number[] = [];
        const pr: number[] = [];
        for (let b = 0; b < f; b += 1) {
          const v = padded[top + a][left + b];
          wr.push(v);
          pr.push(v * w[a][b]);
          sum += v * w[a][b];
        }
        window.push(wr);
        products.push(pr);
      }
      const withBias = sum + bias;
      const out = relu ? Math.max(0, withBias) : withBias;
      cells.push({ i, j, top, left, window, products, sum, out });
      row.push(out);
    }
    map.push(row);
  }
  return { padded, size, cells, map };
}

/** 다중 채널 입력에 다중 필터 — 채널별 콘볼루션을 더한 뒤 활성화 함수를 거친다 */
export function convolveChannels(
  channels: Matrix[],
  filters: Matrix[],
  opts: { stride?: number; padding?: number; bias?: number; relu?: boolean } = {},
): Matrix {
  const parts = channels.map((c, k) => convolve(c, filters[k], { ...opts, relu: false, bias: 0 }).map);
  const size = parts[0].length;
  const bias = opts.bias ?? 0;
  const out: Matrix = [];
  for (let i = 0; i < size; i += 1) {
    const row: number[] = [];
    for (let j = 0; j < size; j += 1) {
      let v = bias;
      for (const p of parts) v += p[i][j];
      row.push(opts.relu ? Math.max(0, v) : v);
    }
    out.push(row);
  }
  return out;
}

export type PoolMode = "max" | "avg";

export interface PoolCell {
  i: number;
  j: number;
  values: number[];
  out: number;
  /** 최대 풀링에서 선택된 값의 위치 */
  pickedAt: number;
}

export function pool(
  x: Matrix,
  f: number,
  s: number,
  mode: PoolMode,
): { map: Matrix; cells: PoolCell[]; size: number } {
  const size = Math.floor((x.length - f) / s) + 1;
  const map: Matrix = [];
  const cells: PoolCell[] = [];
  for (let i = 0; i < size; i += 1) {
    const row: number[] = [];
    for (let j = 0; j < size; j += 1) {
      const values: number[] = [];
      for (let a = 0; a < f; a += 1) {
        for (let b = 0; b < f; b += 1) values.push(x[i * s + a][j * s + b]);
      }
      let out: number;
      let pickedAt = 0;
      if (mode === "max") {
        out = values[0];
        values.forEach((v, idx) => {
          if (v > out) {
            out = v;
            pickedAt = idx;
          }
        });
      } else {
        out = values.reduce((p, c) => p + c, 0) / values.length;
        pickedAt = -1;
      }
      cells.push({ i, j, values, out, pickedAt });
      row.push(out);
    }
    map.push(row);
  }
  return { map, cells, size };
}

/** 소수점 자리를 맞춰 보여 준다 */
export function num(v: number, digits = 0): string {
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(digits);
}

/** 행렬을 1차원 벡터로 — flattening */
export function flatten(maps: Matrix[]): number[] {
  const out: number[] = [];
  for (const m of maps) for (const r of m) for (const v of r) out.push(v);
  return out;
}
