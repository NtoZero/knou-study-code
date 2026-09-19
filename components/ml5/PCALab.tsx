"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import {
  angleOf,
  covariance,
  dirOf,
  dot,
  eigenSym,
  meanVec,
  mulberry32,
  sample2D,
  sub,
  variance1,
  type Vec,
} from "./featureCore";
import { Card, DefinitionBox, Formula, MatrixView, Note, Pill, Stat, ROSE, SKY, SLATE, fmt, linScale } from "./ui";

const round1 = (p: Vec) => p.map((v) => Math.round(v * 10) / 10);

/** 20개 2차원 데이터 — 강의록 예와 같은 개수 */
const DATASETS = [
  {
    key: "diag",
    label: "대각선으로 길게 퍼진 데이터",
    X: sample2D(mulberry32(11), 20, [5, 4], 38, 2.3, 0.7).map(round1),
  },
  {
    key: "steep",
    label: "세로로 기운 데이터",
    X: sample2D(mulberry32(29), 20, [5, 4], 105, 2.1, 0.8).map(round1),
  },
  {
    key: "round",
    label: "고르게 퍼진 데이터",
    X: sample2D(mulberry32(47), 20, [5, 4], 0, 1.4, 1.2).map(round1),
  },
];

const V = 300;
const LO = -1;
const HI = 11;
const sx = linScale(LO, HI, 16, V - 16);
const sy = linScale(LO, HI, V - 16, 16);

const STEPS = [
  "① 평균 μₓ와 공분산 Σₓ 계산",
  "② 고유치 분석 Σₓ = UΛUᵀ",
  "③ 큰 고유치부터 m개 선택",
  "④ 변환행렬 W 생성",
  "⑤ Y = WᵀX로 특징 데이터 생성",
];

export default function PCALab() {
  const [dsKey, setDsKey] = useState("diag");
  const ds = DATASETS.find((d) => d.key === dsKey)!;
  const X = ds.X;

  const stats = useMemo(() => {
    const mu = meanVec(X);
    const S = covariance(X, mu);
    const eig = eigenSym(S);
    return { mu, S, eig };
  }, [X]);
  const { mu, S, eig } = stats;
  const pc1Deg = angleOf(eig.vectors[0]);
  const pc2Deg = angleOf(eig.vectors[1]);

  const [deg, setDeg] = useState(0);
  const [showAxes, setShowAxes] = useState(false);
  const [step, setStep] = useState(0);
  const [m, setM] = useState<1 | 2>(1);

  const u = dirOf(deg);
  const proj = X.map((x) => dot(u, sub(x, mu)));
  const projVar = variance1(proj);

  /** 방향 각도에 따른 사영 분산 uᵀΣu — 곡선 */
  const curve = useMemo(() => {
    const pts: { d: number; v: number }[] = [];
    for (let d = 0; d <= 180; d += 1) {
      const w = dirOf(d);
      pts.push({ d, v: S[0][0] * w[0] * w[0] + 2 * S[0][1] * w[0] * w[1] + S[1][1] * w[1] * w[1] });
    }
    return pts;
  }, [S]);
  const vMax = Math.max(...curve.map((p) => p.v));
  const cx = linScale(0, 180, 36, 400);
  const cy = linScale(0, vMax * 1.1, 150, 14);

  const W = eig.vectors.slice(0, m);
  const Y = X.map((x) => W.map((w) => dot(w, sub(x, mu))));
  const covY = m === 2 ? covariance(Y) : null;

  const ratioLoss = 1 - projVar / (eig.values[0] + eig.values[1]);

  return (
    <section>
      <SectionTitle
        title="7.2.1 주성분분석 알고리즘"
        subtitle="정보 손실을 최소화하는 사영 방향 = 분산이 가장 큰 방향 = 공분산행렬의 최대 고유치의 고유벡터"
      />

      <div className="space-y-6">
        <Sourced
          refs={{
            textbook: "7.2.1 주성분분석 알고리즘",
            slides: "주성분분석 — 목적",
          }}
        >
          <DefinitionBox label="주성분분석법의 목적">
            <p>
              변환 전의 데이터 X가 가지고 있는 정보를 <strong>차원 축소 후에도 최대한 유지</strong>
              하도록 하는 것. 얻어진 특징 데이터의 차원 m이 입력 데이터의 차원 n보다 작은 값이 되어
              저차원의 특징을 추출하는 것을 기본 전제로 함.
            </p>
            <ul className="mt-3 space-y-1 text-xs text-gray-700 dark:text-gray-300">
              <li>→ 데이터 손실량을 최소로 하는 사영 벡터를 찾음</li>
              <li>→ 데이터 집합이 가능한 넓게 퍼질 수 있는 방향으로 사영을 수행</li>
              <li>→ 데이터 집합의 분산이 가장 큰 방향으로의 선형변환을 수행</li>
              <li>
                ⇒ 분산이 가장 큰 방향은{" "}
                <strong className="text-rose-600 dark:text-rose-400">
                  공분산행렬의 고유벡터 중 그 고유치가 가장 큰 것
                </strong>
                으로 정해지는 방향
              </li>
            </ul>
          </DefinitionBox>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7.2.1 — [그림 7-5] 변환행렬의 변화에 따른 추출된 특징의 차이",
            slides: "주성분분석 — 목적",
          }}
        >
          <Card title="사영 방향을 돌려 분산 비교하기">
            <div className="mb-3 flex flex-wrap gap-2">
              {DATASETS.map((d) => (
                <Pill
                  key={d.key}
                  on={dsKey === d.key}
                  onClick={() => {
                    setDsKey(d.key);
                    setStep(0);
                  }}
                >
                  {d.label}
                </Pill>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
              <div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-950">
                <svg viewBox={`0 0 ${V} ${V}`} className="w-full text-gray-200 dark:text-gray-800">
                  {[0, 2, 4, 6, 8, 10].map((g) => (
                    <g key={g}>
                      <line x1={sx(g)} y1={sy(LO)} x2={sx(g)} y2={sy(HI)} stroke="currentColor" strokeWidth="0.5" />
                      <line x1={sx(LO)} y1={sy(g)} x2={sx(HI)} y2={sy(g)} stroke="currentColor" strokeWidth="0.5" />
                    </g>
                  ))}
                  <line
                    x1={sx(mu[0] - u[0] * 9)}
                    y1={sy(mu[1] - u[1] * 9)}
                    x2={sx(mu[0] + u[0] * 9)}
                    y2={sy(mu[1] + u[1] * 9)}
                    stroke={ROSE}
                    strokeWidth="1.5"
                  />
                  {X.map((x, i) => {
                    const f = [mu[0] + u[0] * proj[i], mu[1] + u[1] * proj[i]];
                    return (
                      <g key={i}>
                        <line x1={sx(x[0])} y1={sy(x[1])} x2={sx(f[0])} y2={sy(f[1])} stroke={SLATE} strokeWidth="0.6" strokeDasharray="2 2" />
                        <circle cx={sx(x[0])} cy={sy(x[1])} r={3.6} fill="#2563eb" opacity={0.8} />
                        <motion.circle initial={false} animate={{ cx: sx(f[0]), cy: sy(f[1]) }} transition={{ duration: 0.1 }} r={3} fill={ROSE} />
                      </g>
                    );
                  })}
                  {showAxes &&
                    eig.vectors.map((v, k) => {
                      const L = 2 * Math.sqrt(eig.values[k]);
                      return (
                        <g key={k}>
                          <line
                            x1={sx(mu[0])}
                            y1={sy(mu[1])}
                            x2={sx(mu[0] + v[0] * L)}
                            y2={sy(mu[1] + v[1] * L)}
                            stroke={k === 0 ? "#059669" : "#d97706"}
                            strokeWidth="3"
                          />
                          <text x={sx(mu[0] + v[0] * L) + 4} y={sy(mu[1] + v[1] * L) - 4} fontSize="11" fontWeight="bold" fill={k === 0 ? "#059669" : "#d97706"}>
                            u{k + 1}
                          </text>
                        </g>
                      );
                    })}
                  <circle cx={sx(mu[0])} cy={sy(mu[1])} r={4} fill="#111827" />
                  <text x={sx(mu[0]) + 5} y={sy(mu[1]) + 14} fontSize="10" fill="#475569">
                    μ
                  </text>
                </svg>
              </div>

              <div className="space-y-3">
                <label className="block text-xs text-gray-500">
                  사영 방향 {fmt(deg, 0)}°
                  <input type="range" min={0} max={180} step={1} value={deg} onChange={(e) => setDeg(+e.target.value)} className="w-full accent-rose-500" />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setDeg(Math.round(pc1Deg))} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                    (a) 넓게 퍼지는 방향 — u₁
                  </button>
                  <button type="button" onClick={() => setDeg(Math.round(pc2Deg))} className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-600">
                    (b) 좁게 몰리는 방향 — u₂
                  </button>
                  <button type="button" onClick={() => setShowAxes((s) => !s)} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300">
                    고유벡터 {showAxes ? "숨기기" : "보기"}
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-950">
                  <svg viewBox="0 0 410 175" className="w-full min-w-[340px] text-gray-200 dark:text-gray-800">
                    <line x1={36} y1={150} x2={400} y2={150} stroke="currentColor" />
                    <line x1={36} y1={10} x2={36} y2={150} stroke="currentColor" />
                    <text x={4} y={16} fontSize="10" fill={SLATE}>
                      분산
                    </text>
                    <text x={372} y={168} fontSize="10" fill={SLATE}>
                      방향(°)
                    </text>
                    {[0, 45, 90, 135, 180].map((d) => (
                      <text key={d} x={cx(d)} y={163} fontSize="9" textAnchor="middle" fill={SLATE}>
                        {d}
                      </text>
                    ))}
                    <path d={curve.map((p, i) => `${i ? "L" : "M"}${cx(p.d)},${cy(p.v)}`).join(" ")} fill="none" stroke={SKY} strokeWidth="2" />
                    <line x1={cx(pc1Deg)} y1={cy(eig.values[0])} x2={cx(pc1Deg)} y2={150} stroke="#059669" strokeDasharray="3 2" />
                    <text x={cx(pc1Deg)} y={cy(eig.values[0]) - 5} fontSize="9" textAnchor="middle" fill="#059669" fontWeight="bold">
                      최대 λ₁ = {fmt(eig.values[0], 2)}
                    </text>
                    <line x1={cx(pc2Deg)} y1={cy(eig.values[1])} x2={cx(pc2Deg)} y2={150} stroke="#d97706" strokeDasharray="3 2" />
                    <text x={cx(pc2Deg)} y={cy(eig.values[1]) - 5} fontSize="9" textAnchor="middle" fill="#d97706" fontWeight="bold">
                      최소 λ₂ = {fmt(eig.values[1], 2)}
                    </text>
                    <circle cx={cx(deg)} cy={cy(projVar)} r={5} fill={ROSE} />
                  </svg>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Stat label="현재 방향의 사영 분산 uᵀΣₓu" value={fmt(projVar, 3)} tone="accent" />
                  <Stat label="잃는 분산 비율" value={`${fmt(ratioLoss * 100, 1)}%`} tone={ratioLoss < 0.2 ? "good" : "bad"} />
                </div>
                <p className="text-xs leading-relaxed text-gray-500">
                  곡선은 모든 방향에 대해 사영 분산을 직접 계산한 것. 최댓값이 나오는 방향이 정확히
                  공분산행렬의 첫 번째 고유벡터 u₁이고, 그때의 분산이 고유치 λ₁과 같음.
                </p>
              </div>
            </div>
          </Card>
        </Sourced>

        {/* 수행 단계 */}
        <Sourced
          refs={{
            textbook: "7.2.1 — 주성분분석(PCA) 알고리즘의 수행 단계",
            slides: "PCA 알고리즘의 수행 단계",
            lecture: "고유치가 가장 큰 것부터 m개의 고유벡터를 찾아 W를 구성하는 것이 핵심이라고 강조함",
          }}
        >
          <Card title="PCA 알고리즘의 수행 단계 — 위 데이터로 직접 계산">
            <div className="mb-4 flex flex-wrap gap-1.5">
              {STEPS.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStep(i)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    step === i
                      ? "bg-rose-500 text-white"
                      : i < step
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <motion.div key={`${step}-${dsKey}-${m}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[190px] space-y-3">
              {step === 0 && (
                <>
                  <Formula>μₓ = (1/N) Σᵢ xᵢ, Σₓ = (1/N)(X − Mₓ)(X − Mₓ)ᵀ, Mₓ = μₓ1ᵀ</Formula>
                  <p className="text-xs text-gray-500">1은 모든 원소의 값이 1인 N차원 열벡터 — 평균을 N개 나란히 세워 X와 크기를 맞춤</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span>
                      μₓ = <MatrixView rows={[[mu[0]], [mu[1]]]} />
                    </span>
                    <span>
                      Σₓ = <MatrixView rows={S} digits={3} />
                    </span>
                    <span className="text-xs text-gray-500">(N = {X.length}, n = 2)</span>
                  </div>
                </>
              )}
              {step === 1 && (
                <>
                  <Formula>Σₓ = UΛUᵀ = [u₁, u₂] diag(λ₁, λ₂) [u₁, u₂]ᵀ</Formula>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span>
                      Λ = <MatrixView rows={[[eig.values[0], 0], [0, eig.values[1]]]} digits={3} />
                    </span>
                    <span>
                      U = <MatrixView rows={[[eig.vectors[0][0], eig.vectors[1][0]], [eig.vectors[0][1], eig.vectors[1][1]]]} digits={3} />
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    고유치행렬 Λ는 고유치를 대각 성분으로 가지는 대각행렬, 고유벡터행렬 U는 고유벡터를
                    열벡터로 가지는 행렬(eigenvalue decomposition). 검산: Σₓu₁ = λ₁u₁ →{" "}
                    [{fmt(S[0][0] * eig.vectors[0][0] + S[0][1] * eig.vectors[0][1], 3)},{" "}
                    {fmt(S[1][0] * eig.vectors[0][0] + S[1][1] * eig.vectors[0][1], 3)}] = {fmt(eig.values[0], 3)} ×
                    [{fmt(eig.vectors[0][0], 3)}, {fmt(eig.vectors[0][1], 3)}]
                  </p>
                </>
              )}
              {step === 2 && (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-500">남길 차원 m</span>
                    <Pill on={m === 1} onClick={() => setM(1)}>
                      m = 1
                    </Pill>
                    <Pill on={m === 2} onClick={() => setM(2)}>
                      m = 2
                    </Pill>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {eig.values.map((l, k) => (
                      <span
                        key={k}
                        className={`rounded-lg px-3 py-2 font-mono text-sm ${
                          k < m ? "bg-rose-500 text-white" : "bg-gray-100 text-gray-400 line-through dark:bg-gray-800"
                        }`}
                      >
                        λ{k + 1} = {fmt(l, 3)}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">고유치가 큰 것부터 순서대로 m개를 선택.</p>
                </>
              )}
              {step === 3 && (
                <>
                  <Formula>W = [u₁, …, u_m]</Formula>
                  <span className="text-sm">
                    W = <MatrixView rows={[0, 1].map((r) => W.map((w) => w[r]))} digits={3} />
                    <span className="ml-2 text-xs text-gray-500">(2 × {m})</span>
                  </span>
                </>
              )}
              {step === 4 && (
                <>
                  <Formula>Y = WᵀX</Formula>
                  <div className="overflow-x-auto">
                    <table className="min-w-[360px] text-xs">
                      <thead>
                        <tr className="text-gray-500">
                          <th className="p-1 text-left">i</th>
                          {Y.slice(0, 6).map((_, i) => (
                            <th key={i} className="p-1 text-right">
                              {i + 1}
                            </th>
                          ))}
                          <th className="p-1 text-right">…</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono">
                        {Array.from({ length: m }, (_, r) => (
                          <tr key={r}>
                            <td className="p-1 text-gray-500">y{r + 1}</td>
                            {Y.slice(0, 6).map((y, i) => (
                              <td key={i} className="p-1 text-right">
                                {fmt(y[r], 2)}
                              </td>
                            ))}
                            <td className="p-1 text-right text-gray-400">…</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] text-gray-400">표의 값은 평균을 뺀 데이터(X − Mₓ)를 사영한 값.</p>
                  {covY ? (
                    <div className="rounded-lg bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                      주성분 벡터를 모두 쓰면(m = n) 차원 축소 효과는 없음. 대신 특징 Y의 공분산이{" "}
                      <MatrixView rows={covY} digits={3} /> 로 비대각 성분이 0 — 각 요소 간의
                      상관관계가 사라진 형태의 분포가 됨(대각화).
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      m = 1이면 2차원 데이터 20개가 1 × 20 특징행렬로 바뀜. ③단계에서 m = 2로 바꾸면
                      Y의 공분산을 확인할 수 있음.
                    </p>
                  )}
                </>
              )}
            </motion.div>

            <div className="mt-3 flex justify-between">
              <button type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-600 disabled:opacity-40 dark:bg-gray-800 dark:text-gray-300">
                <ChevronLeft size={13} /> 이전
              </button>
              <button type="button" disabled={step === STEPS.length - 1} onClick={() => setStep((s) => s + 1)} className="flex items-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-xs text-white disabled:opacity-40">
                다음 <ChevronRight size={13} />
              </button>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "PCA 알고리즘의 수행 단계 — ②~④ 예시 출력",
          }}
        >
          <Card title="강의록 예 — 계산 결과에서 고유벡터 고르기">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span>
                U = <MatrixView rows={[[-0.75801271, -0.65223979], [0.65223979, -0.75801271]]} digits={4} highlightCol={1} />
              </span>
              <span>
                고유치 = [55.3498, <strong className="text-rose-600 dark:text-rose-400">202.3949</strong>]
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              계산 도구에 따라 고유치가 작은 것부터 출력되기도 함. 이 예에서 더 큰 고유치는 두 번째
              값 202.39이므로, W에는 U의 <strong>두 번째 열</strong> [−0.652, −0.758]ᵀ이 들어감. 위치가
              아니라 고유치의 크기로 고를 것.
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7.2.1 — [그림 7-6] 3차원 데이터에 대한 주성분분석",
            slides: "PCA 적용의 예",
          }}
        >
          <Card title="3차원 데이터에 대한 주성분분석">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                ["1차 주성분 벡터", "3차원 데이터를 첫 번째 주성분 벡터로 사영 → 각 데이터가 실수값 하나(1차원 특징값)가 됨"],
                ["1, 2차 주성분 벡터", "두 벡터가 이루는 평면으로 사영 → 2차원 특징벡터"],
                ["1, 2, 3차 주성분 벡터", "모든 고유벡터 사용 → 차원 축소 효과 없음. 각 요소 간 상관관계가 사라진 3차원 특징 데이터"],
              ].map(([t, d]) => (
                <div key={t} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{t}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-gray-600 dark:text-gray-400">{d}</p>
                </div>
              ))}
            </div>
          </Card>
        </Sourced>

        <Note>
          위 세 데이터 집합은 시드를 고정해 만든 20개 점이며 소수 첫째 자리까지 반올림한 값. 평균,
          공분산, 고유치·고유벡터, 사영 분산 곡선은 모두 화면에서 직접 계산함. 공분산은 교재와 같이
          1/N로 나눈 값.
        </Note>
      </div>
    </section>
  );
}
