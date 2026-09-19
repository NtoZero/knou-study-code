/**
 * 아이겐페이스 실습용 데이터와 PCA.
 *
 * 실제 얼굴 사진 대신, 얼굴 윤곽·눈·입·머리카락 위치를 조금씩 바꿔 그린
 * 16 × 16 흑백 영상 40장을 만든다. 영상 하나가 256차원 벡터.
 */

import { dot, gaussian, meanVec, mulberry32, eigenSym, sub, unit, type Vec } from "./featureCore";

export const FACE_SIZE = 16;
export const FACE_COUNT = 40;

const sig = (z: number) => 1 / (1 + Math.exp(-z));

function drawFace(rng: () => number): Vec {
  const k = FACE_SIZE / 12;
  const cx = (5.5 + gaussian(rng) * 0.35) * k;
  const cy = (6 + gaussian(rng) * 0.3) * k;
  const rx = (4 + gaussian(rng) * 0.35) * k;
  const ry = (5 + gaussian(rng) * 0.3) * k;
  const skin = 0.8 + gaussian(rng) * 0.07;
  const eyeY = cy + (-1 + gaussian(rng) * 0.3) * k;
  const eyeDx = (1.8 + gaussian(rng) * 0.25) * k;
  const mouthY = cy + (2.3 + gaussian(rng) * 0.3) * k;
  const mouthW = Math.max(0.6, 1.4 + gaussian(rng) * 0.4) * k;
  const smile = gaussian(rng) * 0.35 * k;
  const hair = cy - ry + (1.6 + gaussian(rng) * 0.5) * k;
  const img: number[] = [];
  for (let r = 0; r < FACE_SIZE; r++) {
    for (let c = 0; c < FACE_SIZE; c++) {
      const x = c + 0.5;
      const y = r + 0.5;
      const e = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
      const inHead = sig((1 - e) * 6);
      let v = 0.1 + (skin - 0.1) * inHead;
      v -= inHead * 0.55 * sig((hair - y) * 3);
      for (const s of [-1, 1]) {
        const d = (x - cx - s * eyeDx) ** 2 + (y - eyeY) ** 2;
        v -= 0.55 * Math.exp(-d / (0.5 * k * k));
      }
      const my = mouthY + smile * ((x - cx) / mouthW) ** 2;
      v -= 0.45 * Math.exp(-((y - my) ** 2) / (0.25 * k * k)) * sig((mouthW - Math.abs(x - cx)) * 3);
      img.push(Math.min(1, Math.max(0, v)));
    }
  }
  return img;
}

export const FACES: Vec[] = (() => {
  const rng = mulberry32(2024);
  return Array.from({ length: FACE_COUNT }, () => drawFace(rng));
})();

export interface FacePCA {
  mean: Vec;
  /** 큰 것부터. 0이 아닌 고유치는 최대 N−1개 */
  values: number[];
  /** 고유벡터(아이겐페이스) — 각각 256차원 단위벡터 */
  vectors: Vec[];
  /** 전체 고유치 합 = 전체 분산 */
  total: number;
}

/**
 * 공분산 Σ = (1/N)Σ(x−μ)(x−μ)ᵀ의 고유치 분석.
 * 256 × 256 행렬 대신 같은 0 아닌 고유치를 갖는 N × N 행렬 (1/N)X̃X̃ᵀ을 풀고
 * 고유벡터를 u = X̃ᵀv / ‖X̃ᵀv‖로 되돌린다 (계산량만 줄일 뿐 결과는 같다).
 */
export function faceEigen(X: Vec[] = FACES): FacePCA {
  const mean = meanVec(X);
  const Xc = X.map((x) => sub(x, mean));
  const N = X.length;
  const G = Xc.map((a) => Xc.map((b) => dot(a, b) / N));
  const e = eigenSym(G);
  const keep = e.values.map((v, i) => ({ v, i })).filter((p) => p.v > 1e-9);
  const vectors = keep.map(({ i }) =>
    unit(Xc[0].map((_, d) => Xc.reduce((s, x, row) => s + e.vectors[i][row] * x[d], 0))),
  );
  const values = keep.map((p) => p.v);
  return { mean, values, vectors, total: values.reduce((s, v) => s + v, 0) };
}

/** 앞에서부터 m개의 아이겐페이스로 복원: x̃ = μ + Σ yⱼuⱼ, yⱼ = uⱼᵀ(x − μ) */
export function reconstruct(x: Vec, pca: FacePCA, m: number) {
  const d = sub(x, pca.mean);
  const ys = pca.vectors.slice(0, m).map((u) => dot(u, d));
  const out = pca.mean.slice();
  ys.forEach((y, j) => {
    const u = pca.vectors[j];
    for (let k = 0; k < out.length; k++) out[k] += y * u[k];
  });
  return { image: out, ys };
}

/** (1/N) Σ‖xᵢ − x̃ᵢ‖² — 교재 식 7-7의 정보손실량 J를 직접 계산 */
export function meanReconError(pca: FacePCA, m: number, X: Vec[] = FACES) {
  let s = 0;
  for (const x of X) {
    const r = reconstruct(x, pca, m).image;
    for (let k = 0; k < r.length; k++) s += (x[k] - r[k]) ** 2;
  }
  return s / X.length;
}
