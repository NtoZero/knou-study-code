"use client";

import { useEffect, useMemo, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import {
  classicalMDS,
  conditionalP,
  conditionalQ,
  covariance,
  dijkstra,
  dot,
  eigenSym,
  gaussian,
  klDivergence,
  knnGraph,
  meanVec,
  mulberry32,
  norm,
  sub,
  tsneGradient,
  type Vec,
} from "./featureCore";
import { Card, Formula, Note, Pill, Stat, CLASS_COLORS, ROSE, SKY, SLATE, fmt, linScale } from "./ui";

/* ─────────── t-SNE 실습 데이터 — 10차원 공간의 네 그룹 ─────────── */

const T_GROUPS = 4;
const T_PER = 12;
const T_DIM = 10;
const T_SIGMA = 1.5;
const T_ITERS = 300;

const T_DATA = (() => {
  const rng = mulberry32(42);
  const centers = Array.from({ length: T_GROUPS }, () => Array.from({ length: T_DIM }, () => gaussian(rng) * 3));
  const X: Vec[] = [];
  const label: number[] = [];
  centers.forEach((c, k) => {
    for (let i = 0; i < T_PER; i++) {
      X.push(c.map((v) => v + gaussian(rng)));
      label.push(k);
    }
  });
  return { X, label };
})();

/** 랜덤한 특징값에서 시작해 KL-divergence를 줄이도록 반복 업데이트한 기록 */
function runTsne() {
  const P = conditionalP(T_DATA.X, T_SIGMA);
  const rng = mulberry32(7);
  let Y: Vec[] = T_DATA.X.map(() => [gaussian(rng), gaussian(rng)]);
  let vel: Vec[] = Y.map(() => [0, 0]);
  const frames: Vec[][] = [Y];
  const kl: number[] = [klDivergence(P, conditionalQ(Y).Q)];
  for (let it = 0; it < T_ITERS; it++) {
    const g = tsneGradient(P, Y);
    vel = vel.map((v, i) => v.map((vv, k) => 0.8 * vv - 2 * g[i][k]));
    Y = Y.map((y, i) => y.map((yy, k) => yy + vel[i][k]));
    frames.push(Y);
    kl.push(klDivergence(P, conditionalQ(Y).Q));
  }
  return { frames, kl };
}

/* ─────────── Isomap 실습 데이터 — 나선 모양 곡선 위의 70개 점 ─────────── */

const S_N = 70;
const S_K = 3;
const spiral = (phi: number): Vec => [(phi * Math.cos(phi)) / 10, (phi * Math.sin(phi)) / 10];

const SPIRAL = (() => {
  const f0 = 2 * Math.PI;
  const f1 = 5 * Math.PI;
  const steps = 4000;
  const table: { phi: number; s: number }[] = [{ phi: f0, s: 0 }];
  let L = 0;
  let prev = spiral(f0);
  for (let i = 1; i <= steps; i++) {
    const phi = f0 + ((f1 - f0) * i) / steps;
    const p = spiral(phi);
    L += norm(sub(p, prev));
    prev = p;
    table.push({ phi, s: L });
  }
  const rng = mulberry32(9);
  const pts: Vec[] = [];
  const arc: number[] = [];
  for (let k = 0; k < S_N; k++) {
    const target = (L * k) / (S_N - 1);
    const e = table.find((q) => q.s >= target) ?? table[table.length - 1];
    const p = spiral(e.phi);
    pts.push([p[0] + gaussian(rng) * 0.03, p[1] + gaussian(rng) * 0.03]);
    arc.push(e.s);
  }
  return { pts, arc };
})();

const tColor = (t: number) => `hsl(${220 - t * 200}, 75%, 50%)`;

export default function DistanceMethods() {
  /* 커널 비교 */
  const [dist, setDist] = useState(2);
  const gaussK = (d: number) => Math.exp(-d * d);
  const tK = (d: number) => 1 / (1 + d * d);
  const kx = linScale(0, 5, 36, 390);
  const ky = linScale(0, 1, 130, 12);

  /* t-SNE */
  const tsne = useMemo(() => runTsne(), []);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    if (frame >= T_ITERS) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setFrame((f) => Math.min(T_ITERS, f + 4)), 40);
    return () => clearTimeout(t);
  }, [playing, frame]);
  const Yt = tsne.frames[frame];
  const tr = Math.max(...Yt.flat().map(Math.abs), 1) * 1.1;
  const tx = linScale(-tr, tr, 12, 248);
  const ty = linScale(-tr, tr, 248, 12);
  const klMax = tsne.kl[0];
  const lx = linScale(0, T_ITERS, 34, 300);
  const ly = linScale(0, klMax, 110, 10);

  /* Isomap */
  const graph = useMemo(() => knnGraph(SPIRAL.pts, S_K), []);
  const [A, setA] = useState(8);
  const [B, setB] = useState(53);
  const [pickA, setPickA] = useState(true);
  const sp = useMemo(() => dijkstra(graph.adj, A), [graph, A]);
  const path: number[] = [];
  for (let v = B; v !== -1; v = sp.prev[v]) path.push(v);
  const euclid = norm(sub(SPIRAL.pts[A], SPIRAL.pts[B]));
  const geo = sp.dist[B];
  const trueArc = Math.abs(SPIRAL.arc[B] - SPIRAL.arc[A]);
  const ix = linScale(-1.8, 1.6, 10, 270);
  const iy = linScale(-1.35, 1.75, 250, 10);

  const unroll = useMemo(() => {
    const G = SPIRAL.pts.map((_, i) => dijkstra(graph.adj, i).dist);
    const iso = classicalMDS(G, 1).map((v) => v[0]);
    const mu = meanVec(SPIRAL.pts);
    const pc = eigenSym(covariance(SPIRAL.pts, mu)).vectors[0];
    const pca = SPIRAL.pts.map((p) => dot(pc, sub(p, mu)));
    return { iso, pca };
  }, [graph]);
  const [embed, setEmbed] = useState<"iso" | "pca">("iso");
  const ev = unroll[embed];
  const ex = linScale(Math.min(...ev), Math.max(...ev), 16, 384);

  return (
    <section>
      <SectionTitle
        title="7.4.2 다양한 거리 기반 축소 방법"
        subtitle="거리 함수를 어떻게 정의하느냐에 따라 MDS, t-SNE, Isomap"
      />

      <div className="space-y-6">
        <Sourced
          refs={{
            textbook: "7.4.2 다양한 거리 기반 축소 방법",
            slides: "거리 기반 차원 축소 방법 — 거리 함수의 정의에 따라 다양한 방법이 존재",
          }}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              ["다차원 척도법 MDS", "Multi-Dimensional Scaling", "유클리디안 거리 사용"],
              ["t-SNE", "t-Stochastic Neighbor Embedding", "확률밀도함수를 활용하여 거리(유사도)를 정의"],
              ["Isomap", "", "측지 거리 geodesic distance 사용"],
            ].map(([t, en, d]) => (
              <div key={t} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{t}</p>
                {en && <p className="text-[11px] text-gray-400">{en}</p>}
                <p className="mt-1.5 text-xs text-gray-700 dark:text-gray-300">{d}</p>
              </div>
            ))}
          </div>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7.4.2 — 통계적 이웃 임베딩(SNE), t-SNE (식 7-23 ~ 7-25)",
            slides: "t-SNE",
            lecture: "입력 데이터는 가우시안, 특징 데이터는 t-분포로 유사도를 나타내며, t-분포를 쓰는 이유는 멀리 떨어진 데이터 사이의 관계를 더 잘 반영하기 위해서라고 짚음",
          }}
        >
          <Card title="SNE와 t-SNE — 조건부확률로 정의한 유사도">
            <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
              통계적 이웃 임베딩(Stochastic Neighbor Embedding, SNE)은 데이터 간의 거리와 특징 간의 거리를{" "}
              <strong>조건부확률</strong>을 이용한 유사도로 정의. 데이터가 가우시안 분포를 따른다는 가정하에:
            </p>
            <div className="space-y-2">
              <Formula tag="식 7-23">dᵢⱼ = similarity(xᵢ, xⱼ) = p<sub>j|i</sub> = exp(−‖xᵢ − xⱼ‖²/2σᵢ²) / Σ<sub>k≠i</sub> exp(−‖xᵢ − x_k‖²/2σᵢ²)</Formula>
              <Formula tag="식 7-24 (SNE)">δᵢⱼ = similarity(yᵢ, yⱼ) = q<sub>j|i</sub> = exp(−‖yᵢ − yⱼ‖²) / Σ<sub>k≠i</sub> exp(−‖yᵢ − y_k‖²)</Formula>
              <Formula tag="식 7-25 (t-SNE)">δᵢⱼ = similarity(yᵢ, yⱼ) = q<sub>j|i</sub> = (1 + ‖yᵢ − yⱼ‖²)⁻¹ / Σ<sub>k≠i</sub> (1 + ‖yᵢ − y_k‖²)⁻¹</Formula>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              SNE는 특징벡터의 유사도에 분산이 1인 정규분포를, 그 변형인 t-SNE는 정규분포 대신 t-분포를 사용.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_200px]">
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-950">
                <svg viewBox="0 0 400 150" className="w-full min-w-[320px] text-gray-200 dark:text-gray-800">
                  <line x1={36} y1={130} x2={392} y2={130} stroke="currentColor" />
                  <line x1={36} y1={10} x2={36} y2={130} stroke="currentColor" />
                  <text x={2} y={14} fontSize="9" fill={SLATE}>
                    유사도
                  </text>
                  <text x={330} y={145} fontSize="9" fill={SLATE}>
                    거리 ‖yᵢ − yⱼ‖
                  </text>
                  <path d={Array.from({ length: 101 }, (_, i) => { const d = (i / 100) * 5; return `${i ? "L" : "M"}${kx(d)},${ky(gaussK(d))}`; }).join(" ")} fill="none" stroke={SKY} strokeWidth="2" />
                  <path d={Array.from({ length: 101 }, (_, i) => { const d = (i / 100) * 5; return `${i ? "L" : "M"}${kx(d)},${ky(tK(d))}`; }).join(" ")} fill="none" stroke={ROSE} strokeWidth="2" />
                  <line x1={kx(dist)} y1={10} x2={kx(dist)} y2={130} stroke={SLATE} strokeDasharray="3 2" />
                  <circle cx={kx(dist)} cy={ky(gaussK(dist))} r={4} fill={SKY} />
                  <circle cx={kx(dist)} cy={ky(tK(dist))} r={4} fill={ROSE} />
                  <text x={300} y={30} fontSize="10" fill={ROSE}>
                    t-분포 (1 + d²)⁻¹
                  </text>
                  <text x={300} y={46} fontSize="10" fill={SKY}>
                    정규분포 exp(−d²)
                  </text>
                </svg>
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-gray-500">
                  거리 d = {dist.toFixed(1)}
                  <input type="range" min={0} max={5} step={0.1} value={dist} onChange={(e) => setDist(+e.target.value)} className="w-full accent-rose-500" />
                </label>
                <Stat label="정규분포 exp(−d²)" value={gaussK(dist) < 0.001 ? gaussK(dist).toExponential(2) : fmt(gaussK(dist), 4)} />
                <Stat label="t-분포 (1 + d²)⁻¹" value={fmt(tK(dist), 4)} tone="accent" />
              </div>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              거리가 커질수록 정규분포 쪽 값은 사실상 0이 되지만 t-분포 쪽은 천천히 줄어듦 — 정규분포 대신 t-분포를
              사용함으로써 거리가 멀리 떨어진 데이터 사이의 관계를 더 잘 반영하도록 개선됨. (정규화 전 분자만
              비교한 그래프)
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7.4.2 — t-SNE의 학습 과정 (KL-divergence 최소화)",
            slides: "t-SNE — 반복적으로 특징값을 업데이트하는 학습 과정",
          }}
        >
          <Card title="t-SNE 학습 과정 — 두 분포가 가까워지도록 특징값 업데이트">
            <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
              랜덤한 특징값 {"{"}y₁, …, y_N{"}"}에서 시작해, 확률분포 p<sub>j|i</sub>와 q<sub>j|i</sub>의
              KL-divergence로 정의되는 목적함수를 최소화하도록 반복적으로 {"{"}y₁, …, y_N{"}"}를 업데이트. 얻어진
              특징값은 원래 데이터가 가지는 확률적 유사도를 잘 표현함.
            </p>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => { if (frame >= T_ITERS) setFrame(0); setPlaying((p) => !p); }} className="flex items-center gap-1.5 rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-600">
                {playing ? <Pause size={14} /> : <Play size={14} />}
                {playing ? "멈춤" : "학습 진행"}
              </button>
              <button type="button" onClick={() => { setPlaying(false); setFrame(0); }} className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                <RotateCcw size={14} /> 처음으로
              </button>
              <input type="range" min={0} max={T_ITERS} value={frame} onChange={(e) => { setPlaying(false); setFrame(+e.target.value); }} className="min-w-[140px] flex-1 accent-rose-500" aria-label="반복 횟수" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
              <svg viewBox="0 0 260 260" className="w-full rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
                {Yt.map((p, i) => (
                  <circle key={i} cx={tx(p[0])} cy={ty(p[1])} r={4} fill={CLASS_COLORS[T_DATA.label[i]]} opacity={0.85} />
                ))}
              </svg>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Stat label="반복" value={`${frame} / ${T_ITERS}`} />
                  <Stat label="Σᵢ KL(Pᵢ ‖ Qᵢ)" value={fmt(tsne.kl[frame], 3)} tone="accent" />
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-950">
                  <svg viewBox="0 0 310 125" className="w-full min-w-[260px] text-gray-200 dark:text-gray-800">
                    <line x1={34} y1={110} x2={304} y2={110} stroke="currentColor" />
                    <line x1={34} y1={8} x2={34} y2={110} stroke="currentColor" />
                    <text x={2} y={12} fontSize="9" fill={SLATE}>
                      KL
                    </text>
                    <path d={tsne.kl.map((v, i) => `${i ? "L" : "M"}${lx(i)},${ly(v)}`).join(" ")} fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
                    <path d={tsne.kl.slice(0, frame + 1).map((v, i) => `${i ? "L" : "M"}${lx(i)},${ly(v)}`).join(" ")} fill="none" stroke={ROSE} strokeWidth="2" />
                  </svg>
                </div>
                <p className="text-xs leading-relaxed text-gray-500">
                  10차원 공간의 네 그룹(그룹마다 12개). 색은 그룹을 표시할 뿐 학습에는 쓰지 않음. 반복할수록 같은
                  그룹끼리 2차원 평면에서 가깝게 뭉침.
                </p>
              </div>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7.4.2 — Isomap, [그림 7-11] 측지 거리의 개념",
            slides: "Isomap — 측지 거리를 사용하는 차원 축소 방법",
          }}
        >
          <Card title="Isomap — 다양체 위의 측지 거리">
            <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              고차원 공간의 데이터 집합이 이루는 저차원의 <strong>다양체(manifold)</strong>를 생각해, 그 구조를
              반영한 거리를 사용. 데이터들을 정점으로 가지는 그래프의 경로로 측지 거리를 측정하며, 이 거리는{" "}
              <strong>다익스트라(데이크스트라, Dijkstra) 알고리즘</strong>으로 계산. 전체 거리행렬이 얻어지면 MDS와
              같은 방법으로 저차원 특징값을 찾음.
            </p>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500">점을 눌러 바꾸기:</span>
              <Pill on={pickA} onClick={() => setPickA(true)}>
                시작점 A
              </Pill>
              <Pill on={!pickA} onClick={() => setPickA(false)}>
                끝점 B
              </Pill>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
              <svg viewBox="0 0 280 260" className="w-full rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
                {graph.edges.map(([i, j]) => (
                  <line key={`${i}-${j}`} x1={ix(SPIRAL.pts[i][0])} y1={iy(SPIRAL.pts[i][1])} x2={ix(SPIRAL.pts[j][0])} y2={iy(SPIRAL.pts[j][1])} stroke="#cbd5e1" strokeWidth="0.8" />
                ))}
                {path.slice(0, -1).map((v, k) => {
                  const w = path[k + 1];
                  return <line key={`p${k}`} x1={ix(SPIRAL.pts[v][0])} y1={iy(SPIRAL.pts[v][1])} x2={ix(SPIRAL.pts[w][0])} y2={iy(SPIRAL.pts[w][1])} stroke={ROSE} strokeWidth="2.5" />;
                })}
                <line x1={ix(SPIRAL.pts[A][0])} y1={iy(SPIRAL.pts[A][1])} x2={ix(SPIRAL.pts[B][0])} y2={iy(SPIRAL.pts[B][1])} stroke="#334155" strokeWidth="1.5" strokeDasharray="4 3" />
                {SPIRAL.pts.map((p, i) => (
                  <circle
                    key={i}
                    cx={ix(p[0])}
                    cy={iy(p[1])}
                    r={i === A || i === B ? 6 : 3.4}
                    fill={i === A ? "#059669" : i === B ? "#d97706" : "#2563eb"}
                    className="cursor-pointer"
                    onClick={() => (pickA ? setA(i) : setB(i))}
                  />
                ))}
              </svg>
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <Stat label="유클리디안 거리 (점선)" value={fmt(euclid, 3)} />
                  <Stat label="그래프 경로 거리 (빨간 선)" value={fmt(geo, 3)} tone="accent" />
                  <Stat label="곡선을 따라 잰 실제 측지 거리" value={fmt(trueArc, 3)} tone="good" />
                </div>
                <p className="text-xs leading-relaxed text-gray-500">
                  유클리디안 거리는 곡선의 팔 사이를 가로질러 두 점을 가깝게 재지만, 데이터가 실제로 놓인 곡선을
                  따라가면 훨씬 멂. 가까운 이웃({S_K}개)끼리 이은 그래프 위의 최단 경로가 실제 측지 거리와 거의
                  같음.
                </p>
                <div className="mt-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Pill on={embed === "iso"} onClick={() => setEmbed("iso")}>
                      Isomap 1차원 특징
                    </Pill>
                    <Pill on={embed === "pca"} onClick={() => setEmbed("pca")}>
                      비교 — PCA 1차원 특징
                    </Pill>
                  </div>
                  <div className="overflow-x-auto">
                    <svg viewBox="0 0 400 50" className="w-full min-w-[300px]">
                      <line x1={16} y1={25} x2={384} y2={25} stroke={SLATE} />
                      {ev.map((v, i) => (
                        <circle key={i} cx={ex(v)} cy={25 + ((i % 3) - 1) * 6} r={3} fill={tColor(i / (S_N - 1))} />
                      ))}
                    </svg>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                    색 = 곡선을 따라간 위치. {embed === "iso"
                      ? "측지 거리행렬에 MDS와 같은 방법을 적용하면 곡선이 펴지듯 색이 한 방향으로 차례대로 늘어섬."
                      : "직선 방향 사영은 서로 다른 팔의 점들을 같은 값으로 겹쳐 색이 뒤섞임."}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </Sourced>

        <Note>
          t-SNE는 교재 (식 7-23)과 (식 7-25)의 조건부확률을 그대로 쓰고(모든 i에 같은 σ = {T_SIGMA}), 목적함수의
          기울기로 특징값을 {T_ITERS}회 갱신한 결과. Isomap 그림은 나선 위에 거의 같은 간격으로 놓은 70개 점에
          잡음을 더한 데이터로, 경로와 거리는 모두 직접 계산함.
        </Note>
      </div>
    </section>
  );
}
