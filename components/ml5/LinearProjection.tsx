"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { dirOf, dot, gaussian, mulberry32, sample2D, variance1, type Vec } from "./featureCore";
import { Card, DefinitionBox, Formula, MatrixView, Note, Pill, Stat, ROSE, SKY, SLATE, fmt, linScale } from "./ui";

/* ─────────── 2차원 사영 조작기 ─────────── */

const V = 300;
const R = 3.6;
const px = linScale(-R, R, 20, V - 20);
const py = linScale(-R, R, V - 20, 20);

/** 강의록·교재 [그림 7-1]의 두 변환행렬 */
const PRESETS = [
  { label: "w = [1, 0]ᵀ", deg: 0, exact: "y = 2" },
  { label: "w = [2, 1]ᵀ/√5", deg: (Math.atan2(1, 2) * 180) / Math.PI, exact: "y = 6/√5" },
];

/** [그림 7-3]처럼 대각선으로 퍼진 2차원 데이터 집합 */
const SET_X: Vec[] = sample2D(mulberry32(71), 14, [0, 0], 32, 1.45, 0.45).map((p) =>
  p.map((v) => Math.round(v * 10) / 10),
);

/* ─────────── 3차원 → 2차원 (식 7-4) ─────────── */

const RING: Vec[] = (() => {
  const rng = mulberry32(5);
  return Array.from({ length: 90 }, (_, i) => {
    const t = (i / 90) * 2 * Math.PI + rng() * 0.05;
    return [Math.cos(t), Math.sin(t), gaussian(rng) * 0.35];
  });
})();

const BASES: { key: "a" | "b" | "c"; W: number[][]; axes: [string, string] }[] = [
  {
    key: "a",
    W: [
      [1, 0],
      [0, 1],
      [0, 0],
    ],
    axes: ["x₁", "x₂"],
  },
  {
    key: "b",
    W: [
      [0, 0],
      [1, 0],
      [0, 1],
    ],
    axes: ["x₂", "x₃"],
  },
  {
    key: "c",
    W: [
      [1, 0],
      [0, 0],
      [0, 1],
    ],
    axes: ["x₁", "x₃"],
  },
];

/** 원래 3차원 데이터를 비스듬히 본 모습 — 화면에 그리기 위한 고정 시점 */
const iso = (p: Vec): [number, number] => [
  (p[0] - p[1]) * 0.87,
  (p[0] + p[1]) * 0.35 - p[2] * 0.9,
];

export default function LinearProjection() {
  const [n, setN] = useState(4);
  const [m, setM] = useState(2);
  const [bigN, setBigN] = useState(5);

  const [deg, setDeg] = useState(0);
  const [x, setX] = useState<Vec>([2, 2]);
  const [wLen, setWLen] = useState(1);
  const [mode, setMode] = useState<"one" | "set">("one");
  const [basis, setBasis] = useState<"a" | "b" | "c">("a");

  const w = dirOf(deg);
  const wRaw = w.map((v) => v * wLen);
  const y = dot(w, x);
  const yRaw = dot(wRaw, x);
  const foot = w.map((v) => v * y);

  const setProj = useMemo(() => {
    const d = dirOf(deg);
    return SET_X.map((p) => dot(d, p));
  }, [deg]);
  const setVar = variance1(setProj);

  const B = BASES.find((b) => b.key === basis)!;
  const projected3 = RING.map((p) => [
    B.W[0][0] * p[0] + B.W[1][0] * p[1] + B.W[2][0] * p[2],
    B.W[0][1] * p[0] + B.W[1][1] * p[1] + B.W[2][1] * p[2],
  ]);

  const mEff = Math.min(m, n - 1);

  return (
    <section>
      <SectionTitle
        title="7.1 선형변환에 의한 특징추출"
        subtitle="변환행렬 W가 정하는 방향으로 사영해 저차원 특징값을 얻는 것"
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Sourced
            refs={{
              textbook: "7.1 선형변환에 의한 특징추출 — 차원의 저주",
              slides: "선형변환에 의한 특징추출 — 차원축소 관점에서의 특징추출",
              lecture:
                "입력 차원이 늘면 처음에는 성능이 오르지만 어느 시점부터 오히려 떨어진다는 점, 차원이 크다고 무작정 좋은 것이 아니라는 점을 강조함",
            }}
          >
            <Card title="차원의 저주" className="h-full">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                영상 데이터 같은 고차원 데이터는 계산량이 급격히 증가하여 처리에 큰 비용이 들 뿐
                아니라, 입력 차원이 늘어남에 따라 처리의 정확도도 저하되는 현상.
              </p>
              <svg viewBox="0 0 260 130" className="mt-3 w-full text-gray-300 dark:text-gray-700">
                <line x1={30} y1={110} x2={250} y2={110} stroke="currentColor" />
                <line x1={30} y1={10} x2={30} y2={110} stroke="currentColor" />
                <text x={6} y={18} fontSize="10" fill={SLATE}>
                  성능
                </text>
                <text x={222} y={124} fontSize="10" fill={SLATE}>
                  차원
                </text>
                <path
                  d={Array.from({ length: 80 }, (_, i) => {
                    const t = i / 79;
                    const perf = (t * 9) * Math.exp(-t * 4.2) + 0.12;
                    return `${i ? "L" : "M"}${30 + t * 215},${110 - perf * 115}`;
                  }).join(" ")}
                  fill="none"
                  stroke={ROSE}
                  strokeWidth="2.5"
                />
                <text x={110} y={34} fontSize="10" fill={ROSE} fontWeight="bold">
                  “차원의 저주”
                </text>
              </svg>
              <p className="mt-1 text-[11px] text-gray-400">
                강의록 그림을 옮긴 모식도 — 축의 값은 의미 없음
              </p>
            </Card>
          </Sourced>

          <Sourced
            refs={{
              textbook: "7.1 선형변환에 의한 특징추출 — 부분공간분석 (식 7-1)",
              slides: "선형변환에 의한 특징추출 — 부분공간분석",
            }}
          >
            <DefinitionBox label="부분공간분석 subspace analysis">
              <p>
                차원 축소의 가장 대표적인 방법으로, 선형변환에 의해 저차원 특징 공간으로 매핑하는
                방법. n차원 입력벡터 x는 n × m 크기의 변환행렬 W에 의해 m차원 특징벡터 y로
                변환됨(n &gt; m).
              </p>
              <div className="mt-3">
                <Formula tag="식 7-1">y = Wᵀx</Formula>
              </div>
              <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                특징추출의 주된 목적은 원래 데이터의 차원을 줄이면서 분석에 핵심이 되는 정보만 뽑는
                것. 특히 m ≪ n이 되는 저차원 특징 공간을 찾음.
              </p>
            </DefinitionBox>
          </Sourced>
        </div>

        {/* 행렬 크기 */}
        <Sourced
          refs={{
            textbook: "7.1 — 식 7-2, 식 7-3",
            slides: "선형변환에 의한 특징추출 — 전체 데이터 집합 X에 대한 특징행렬 Y 추출",
            lecture:
              "선형변환 특징추출을 이해하려면 행렬 곱셈의 크기 관계와 사영, 두 가지를 먼저 알아야 한다고 짚고 Wᵀx의 크기를 직접 따져 봄",
          }}
        >
          <Card title="행렬 크기 따라가기 — y = Wᵀx, Y = WᵀX">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="text-xs text-gray-500">
                입력 차원 n = <strong className="text-gray-800 dark:text-gray-100">{n}</strong>
                <input type="range" min={2} max={8} value={n} onChange={(e) => setN(+e.target.value)} className="w-full accent-rose-500" />
              </label>
              <label className="text-xs text-gray-500">
                특징 차원 m = <strong className="text-gray-800 dark:text-gray-100">{mEff}</strong>
                <input type="range" min={1} max={n - 1} value={mEff} onChange={(e) => setM(+e.target.value)} className="w-full accent-rose-500" />
              </label>
              <label className="text-xs text-gray-500">
                데이터 수 N = <strong className="text-gray-800 dark:text-gray-100">{bigN}</strong>
                <input type="range" min={1} max={8} value={bigN} onChange={(e) => setBigN(+e.target.value)} className="w-full accent-rose-500" />
              </label>
            </div>
            <div className="mt-4 space-y-2">
              <ShapeRow
                label="데이터 하나"
                parts={[
                  ["y", `${mEff}×1`],
                  ["=", ""],
                  ["Wᵀ", `${mEff}×${n}`],
                  ["x", `${n}×1`],
                ]}
              />
              <ShapeRow
                label="데이터 집합"
                parts={[
                  ["Y", `${mEff}×${bigN}`],
                  ["=", ""],
                  ["Wᵀ", `${mEff}×${n}`],
                  ["X", `${n}×${bigN}`],
                ]}
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              W는 n × m이므로 Wᵀ는 m × n. 앞 행렬의 열 수와 뒤 행렬의 행 수가 같아야 곱할 수 있고,
              결과는 (앞의 행 수) × (뒤의 열 수). X = [x₁, …, x_N]은 n × N, 특징행렬 Y = [y₁, …, y_N]은
              m × N.
            </p>
            <Formula className="mt-3" tag="식 7-2">
              y = [w₁ᵀx, w₂ᵀx, …, w_mᵀx]ᵀ = [w₁, w₂, …, w_m]ᵀx = Wᵀx
            </Formula>
            <Formula className="mt-2" tag="식 7-3">
              Y = WᵀX = [Wᵀx₁, Wᵀx₂, …, Wᵀx_N]
            </Formula>
          </Card>
        </Sourced>

        {/* 사영 조작기 */}
        <Sourced
          refs={{
            textbook: "7.1 — [그림 7-1], [그림 7-3]",
            slides: "선형변환에 의한 특징추출 — 2차원 데이터 x를 1차원 특징값 y로의 변환",
            lecture:
              "특징값 yᵢ = wᵢᵀx는 x를 단위벡터 wᵢ 위로 사영한 크기이고 이때 wᵢ가 사영의 기저 벡터라는 점을 기억하라고 강조하며, 단위벡터가 아니면 그 크기로 나눠야 한다고 덧붙임",
          }}
        >
          <Card title="사영 조작기 — 특징값 y = wᵀx">
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              특징값 yᵢ = wᵢᵀx는 x를 W의 열벡터 wᵢ 위로 사영한 값(단, wᵢ는 단위벡터). 이때 wᵢ는
              입력 벡터를 사영시킬 <strong>기저 벡터</strong>.
            </p>
            <div className="mb-3 flex flex-wrap gap-2">
              <Pill on={mode === "one"} onClick={() => setMode("one")}>
                데이터 하나 x
              </Pill>
              <Pill on={mode === "set"} onClick={() => setMode("set")}>
                데이터 집합 X (N = {SET_X.length})
              </Pill>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
              <div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-950">
                <svg viewBox={`0 0 ${V} ${V}`} className="w-full text-gray-200 dark:text-gray-800">
                  {[-3, -2, -1, 1, 2, 3].map((g) => (
                    <g key={g}>
                      <line x1={px(g)} y1={py(-R)} x2={px(g)} y2={py(R)} stroke="currentColor" strokeWidth="0.5" />
                      <line x1={px(-R)} y1={py(g)} x2={px(R)} y2={py(g)} stroke="currentColor" strokeWidth="0.5" />
                    </g>
                  ))}
                  <line x1={px(-R)} y1={py(0)} x2={px(R)} y2={py(0)} stroke={SLATE} />
                  <line x1={px(0)} y1={py(-R)} x2={px(0)} y2={py(R)} stroke={SLATE} />
                  {/* 사영 축 */}
                  <line
                    x1={px(-w[0] * 5)}
                    y1={py(-w[1] * 5)}
                    x2={px(w[0] * 5)}
                    y2={py(w[1] * 5)}
                    stroke={SKY}
                    strokeDasharray="4 3"
                    strokeWidth="1.2"
                  />
                  {mode === "one" ? (
                    <>
                      <line x1={px(x[0])} y1={py(x[1])} x2={px(foot[0])} y2={py(foot[1])} stroke={SLATE} strokeDasharray="3 3" />
                      <line x1={px(0)} y1={py(0)} x2={px(foot[0])} y2={py(foot[1])} stroke={ROSE} strokeWidth="4" strokeLinecap="round" opacity={0.7} />
                      <line x1={px(0)} y1={py(0)} x2={px(x[0])} y2={py(x[1])} stroke="#334155" strokeWidth="1.5" />
                      <circle cx={px(x[0])} cy={py(x[1])} r={5} fill="#dc2626" />
                      <text x={px(x[0]) + 7} y={py(x[1]) - 6} fontSize="12" fill="#dc2626" fontWeight="bold">
                        x
                      </text>
                      <circle cx={px(foot[0])} cy={py(foot[1])} r={3.5} fill={ROSE} />
                    </>
                  ) : (
                    SET_X.map((p, i) => {
                      const t = setProj[i];
                      return (
                        <g key={i}>
                          <line x1={px(p[0])} y1={py(p[1])} x2={px(w[0] * t)} y2={py(w[1] * t)} stroke={SLATE} strokeWidth="0.7" strokeDasharray="2 2" />
                          <circle cx={px(p[0])} cy={py(p[1])} r={3.5} fill="none" stroke="#334155" />
                          <circle cx={px(w[0] * t)} cy={py(w[1] * t)} r={3} fill={ROSE} />
                        </g>
                      );
                    })
                  )}
                  <line x1={px(0)} y1={py(0)} x2={px(w[0] * wLen)} y2={py(w[1] * wLen)} stroke={SKY} strokeWidth="3" />
                  <text x={px(w[0] * wLen) + 5} y={py(w[1] * wLen) + 14} fontSize="12" fill={SKY} fontWeight="bold">
                    w
                  </text>
                </svg>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setDeg(p.deg);
                        setX([2, 2]);
                        setWLen(1);
                      }}
                      className="rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
                    >
                      {p.label} · {p.exact}
                    </button>
                  ))}
                </div>
                <label className="block text-xs text-gray-500">
                  w의 방향 {fmt(deg, 1)}° → w = [{fmt(w[0], 3)}, {fmt(w[1], 3)}]ᵀ
                  <input type="range" min={0} max={179} step={0.5} value={deg} onChange={(e) => setDeg(+e.target.value)} className="w-full accent-rose-500" />
                </label>
                {mode === "one" && (
                  <div className="grid grid-cols-2 gap-2">
                    {[0, 1].map((k) => (
                      <label key={k} className="text-xs text-gray-500">
                        x{k === 0 ? "₁" : "₂"} = {x[k]}
                        <input
                          type="range"
                          min={-3}
                          max={3}
                          step={0.5}
                          value={x[k]}
                          onChange={(e) => setX((prev) => prev.map((v, i) => (i === k ? +e.target.value : v)))}
                          className="w-full accent-rose-500"
                        />
                      </label>
                    ))}
                  </div>
                )}
                {mode === "one" ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <Stat label="특징값 y = wᵀx" value={fmt(y, 3)} tone="accent" />
                      <Stat label="‖w‖" value={fmt(wLen, 2)} />
                    </div>
                    <label className="block text-xs text-gray-500">
                      w의 크기를 바꿔 보기 (단위벡터가 아닌 경우)
                      <input type="range" min={0.5} max={2.5} step={0.25} value={wLen} onChange={(e) => setWLen(+e.target.value)} className="w-full accent-sky-500" />
                    </label>
                    {wLen !== 1 && (
                      <div className="rounded-lg bg-sky-50 p-3 text-xs leading-relaxed text-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
                        크기가 {fmt(wLen, 2)}인 w로 그냥 곱하면 wᵀx = {fmt(yRaw, 3)} — 사영한 길이의{" "}
                        {fmt(wLen, 2)}배. ‖w‖로 나눠야 사영한 크기 {fmt(yRaw / wLen, 3)}가 됨.
                      </div>
                    )}
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Stat label="특징행렬 Y 크기" value={`1 × ${SET_X.length}`} />
                    <Stat label="사영된 값들의 분산" value={fmt(setVar, 3)} tone="accent" />
                  </div>
                )}
                <p className="text-xs leading-relaxed text-gray-500">
                  {mode === "one"
                    ? "x = [2, 2]ᵀ를 w = [1, 0]ᵀ로 사영하면 가로축 좌표 2, w = [2, 1]ᵀ/√5로 사영하면 (2·2 + 1·2)/√5 = 6/√5 ≈ 2.683."
                    : "각 데이터를 같은 w 방향으로 사영한 값을 모은 것이 특징행렬 Y. 방향을 돌려 보면 사영된 점들이 넓게 퍼지기도, 좁게 몰리기도 함 — 다음 절 주성분분석의 출발점."}
                </p>
              </div>
            </div>
          </Card>
        </Sourced>

        {/* 3차원 → 2차원 */}
        <Sourced
          refs={{
            textbook: "7.1 — [그림 7-2], [그림 7-4], 식 7-4",
            slides: "선형변환에 의한 특징추출 — 3차원 데이터 → 2차원 특징벡터 추출, 변환행렬에 따른 특징의 분포",
          }}
        >
          <Card title="변환행렬에 따른 특징의 분포 — 3차원 → 2차원">
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              W = [w₁, w₂]이면 y는 x를 두 열벡터 w₁, w₂가 이루는 2차원 평면 위로 사영해 얻는 2차원
              벡터. 같은 데이터라도 어떤 기저를 쓰느냐에 따라 특징의 분포가 확연히 달라짐.
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              {BASES.map((b) => (
                <Pill key={b.key} on={basis === b.key} onClick={() => setBasis(b.key)}>
                  W<sub>{b.key}</sub>
                </Pill>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
              <div className="text-center">
                <p className="mb-1 text-xs text-gray-500">W<sub>{basis}</sub> (3 × 2)</p>
                <MatrixView rows={B.W} digits={0} />
                <p className="mt-2 text-[11px] text-gray-500">
                  {B.axes[0]}–{B.axes[1]} 평면으로 사영
                </p>
              </div>
              <MiniScatter
                title="원래 3차원 데이터 (비스듬히 본 모습)"
                pts={RING.map(iso)}
                range={1.9}
              />
              <MiniScatter
                title={`추출된 2차원 특징 (가로 ${B.axes[0]}, 세로 ${B.axes[1]})`}
                pts={projected3.map((p) => [p[0], p[1]] as [number, number])}
                range={1.5}
                accent
              />
            </div>
            <Formula className="mt-4" tag="식 7-4">
              W_a = [[1,0],[0,1],[0,0]], W_b = [[0,0],[1,0],[0,1]], W_c = [[1,0],[0,0],[0,1]]
            </Formula>
            <p className="mt-3 rounded-lg bg-rose-50 p-3 text-xs leading-relaxed text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
              <strong>좋은 특징추출</strong>이란 목적에 맞는 부분공간을 찾는 것. 변환행렬 W(또는
              W의 각 열로 나타나는 부분공간의 기저)를 적절히 조정해서 분석 목적에 맞는 특징 분포를
              만드는 것.
            </p>
            <p className="mt-2 text-[11px] text-gray-400">
              데이터는 x₁–x₂ 평면의 원 위에 x₃ 방향 잡음을 더해 만든 90개 점. 세 그림 모두 실제로
              Wᵀx를 계산해 그림.
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7.1 — 주성분분석법과 선형판별분석법 소개",
            slides: "통계적 특징추출 방법 / 통계적 특징추출 방법의 예",
            lecture: "두 방법의 가장 큰 차이는 클래스 정보를 활용하느냐 아니냐이며, 64차원 숫자 영상을 2차원으로 줄였을 때 LDA 결과에서 숫자별로 어느 정도 묶이는 모습을 비교해 보임",
          }}
        >
          <Card title="선형변환 Y = WᵀX를 사용하는 대표적인 통계적 방법">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border-l-4 border-sky-500 bg-sky-50 p-3 dark:bg-sky-950/30">
                <p className="text-sm font-bold text-sky-700 dark:text-sky-300">주성분분석법 PCA</p>
                <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">
                  Principal Component Analysis · 클래스 정보 미사용 → <strong>비지도학습</strong>
                </p>
              </div>
              <div className="rounded-lg border-l-4 border-rose-500 bg-rose-50 p-3 dark:bg-rose-950/30">
                <p className="text-sm font-bold text-rose-700 dark:text-rose-300">선형판별분석법 LDA</p>
                <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">
                  Linear Discriminant Analysis · 클래스 정보 사용 → <strong>지도학습</strong>
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              강의록 예: 8 × 8 = 64차원 숫자 영상을 2차원으로 줄였을 때, 랜덤 사영과 주성분분석에서는
              숫자들이 섞여 있고, 클래스 정보를 쓰는 선형판별분석에서는 숫자별로 어느 정도 그룹이
              지어짐.
            </p>
          </Card>
        </Sourced>

        <Note>
          사영 조작기의 데이터 집합은 교재 그림과 비슷한 모양이 되도록 시드를 고정해 생성한 14개
          점이며, 표시되는 모든 값은 화면에서 직접 계산한 것.
        </Note>
      </div>
    </section>
  );
}

function ShapeRow({ label, parts }: { label: string; parts: [string, string][] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
      <span className="w-20 shrink-0 text-xs text-gray-500">{label}</span>
      {parts.map(([sym, size], i) =>
        sym === "=" ? (
          <span key={i} className="text-gray-400">
            =
          </span>
        ) : (
          <span
            key={i}
            className="inline-flex flex-col items-center rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 dark:border-rose-900 dark:bg-rose-950/40"
          >
            <span className="font-mono text-sm font-bold">{sym}</span>
            <span className="font-mono text-[10px] text-rose-600 dark:text-rose-400">{size}</span>
          </span>
        ),
      )}
    </div>
  );
}

function MiniScatter({
  title,
  pts,
  range,
  accent = false,
}: {
  title: string;
  pts: [number, number][];
  range: number;
  accent?: boolean;
}) {
  const s = linScale(-range, range, 10, 170);
  const t = linScale(-range, range, 170, 10);
  return (
    <div>
      <p className="mb-1 text-center text-[11px] text-gray-500">{title}</p>
      <svg viewBox="0 0 180 180" className="mx-auto w-full max-w-[220px] rounded-lg border border-gray-200 bg-white text-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-800">
        <line x1={10} y1={90} x2={170} y2={90} stroke="currentColor" />
        <line x1={90} y1={10} x2={90} y2={170} stroke="currentColor" />
        {pts.map((p, i) => (
          <circle key={i} cx={s(p[0])} cy={t(p[1])} r={2.2} fill={accent ? ROSE : "#2563eb"} opacity={0.75} />
        ))}
      </svg>
    </div>
  );
}
