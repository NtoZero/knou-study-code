"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, TrendingDown } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import {
  CLUSTER_COLORS,
  KMEANS_DATA,
  objectiveValue,
  runKMeans,
  sqDist,
  type Point,
} from "./kmeansCore";

/** r_ni 표 실습용 소규모 데이터 — 대표 벡터는 고정해 두고 클러스터 배정만 바꿔 본다 */
const DEMO_POINTS: Point[] = [
  { x: 1.0, y: 1.5 },
  { x: 2.0, y: 1.0 },
  { x: 1.5, y: 2.5 },
  { x: 5.5, y: 1.5 },
  { x: 6.5, y: 2.0 },
  { x: 3.5, y: 6.0 },
  { x: 4.5, y: 6.5 },
  { x: 4.0, y: 3.8 },
];

const DEMO_CENTROIDS: Point[] = [
  { x: 1.5, y: 1.7 },
  { x: 6.0, y: 1.8 },
  { x: 4.0, y: 6.3 },
];

/** 최적이 아닌 상태에서 출발해, 직접 고쳐 가며 J가 줄어드는 것을 확인하게 함 */
const INITIAL_ASSIGNMENT = [0, 0, 0, 1, 1, 2, 2, 0];

const J_PRESETS = [
  {
    k: 2,
    label: "K = 2",
    init: [
      { x: 3.0, y: 3.0 },
      { x: 5.5, y: 4.5 },
    ],
  },
  {
    k: 3,
    label: "K = 3",
    init: [
      { x: 0.5, y: 0.5 },
      { x: 0.5, y: 4.0 },
      { x: 3.0, y: 1.0 },
    ],
  },
];

/**
 * 목적함수 지형의 모식도 — 극소점이 여럿 있는 함수라면 시작점에 따라 도착지가 달라진다는
 * 사실만 보이기 위한 1차원 예시 함수이며, K-평균의 실제 J 지형을 그린 것이 아니다.
 * 극소점 3개 중 하나가 전역 극소점.
 */
const landscape = (t: number) => 0.3 * (t - 5) ** 2 + 5.5 * Math.cos(2 * t) + 14;
const landscapeGrad = (t: number) => 0.6 * (t - 5) - 11 * Math.sin(2 * t);

const L_X0 = 30;
const L_W = 380;
const L_Y0 = 190;
const L_H = 150;
const L_VMIN = 8;
const L_VSPAN = 20;
const lx = (t: number) => L_X0 + (t / 10) * L_W;
const ly = (v: number) => L_Y0 - ((v - L_VMIN) / L_VSPAN) * L_H;

/** 기울기의 부호가 바뀌는 지점을 훑어 극소점을 찾는다 — 좌표를 손으로 적어 두지 않는다. */
function findMinima() {
  const out: { t: number; v: number; global: boolean }[] = [];
  const dt = 0.0005;
  for (let t = dt; t <= 10; t += dt) {
    if (landscapeGrad(t - dt) < 0 && landscapeGrad(t) >= 0) {
      out.push({ t: Number(t.toFixed(3)), v: landscape(t), global: false });
    }
  }
  if (out.length > 0) {
    const best = out.reduce((a, b) => (b.v < a.v ? b : a));
    best.global = true;
  }
  return out;
}

const MINIMA = findMinima();

const DESCENT_STARTS = [0.8, 4.8, 6.6];
const DESCENT_COLORS = ["#0891b2", "#0d9488", "#d97706"];

const DEMO_SIZE = 220;
const DEMO_PAD = 20;
const DEMO_MIN = 0;
const DEMO_MAX = 8;
const dsx = (x: number) =>
  DEMO_PAD + ((x - DEMO_MIN) / (DEMO_MAX - DEMO_MIN)) * (DEMO_SIZE - 2 * DEMO_PAD);
const dsy = (y: number) =>
  DEMO_SIZE -
  DEMO_PAD -
  ((y - DEMO_MIN) / (DEMO_MAX - DEMO_MIN)) * (DEMO_SIZE - 2 * DEMO_PAD);

export default function KMeansObjective() {
  const [assignment, setAssignment] = useState<number[]>(INITIAL_ASSIGNMENT);
  const [caseTab, setCaseTab] = useState(0);
  const [presetIdx, setPresetIdx] = useState(1);
  const [descentStep, setDescentStep] = useState(0);
  const [descentPlaying, setDescentPlaying] = useState(false);

  const currentJ = useMemo(
    () => objectiveValue(DEMO_POINTS, DEMO_CENTROIDS, assignment),
    [assignment]
  );

  const optimal = useMemo(() => {
    const best = DEMO_POINTS.map((p) => {
      let bi = 0;
      let bd = Number.POSITIVE_INFINITY;
      DEMO_CENTROIDS.forEach((m, i) => {
        const d = sqDist(p, m);
        if (d < bd) {
          bd = d;
          bi = i;
        }
      });
      return bi;
    });
    return {
      assignment: best,
      J: objectiveValue(DEMO_POINTS, DEMO_CENTROIDS, best),
    };
  }, []);

  const isOptimal = Math.abs(currentJ - optimal.J) < 1e-9;

  const preset = J_PRESETS[presetIdx];
  const jRun = useMemo(
    () => runKMeans(KMEANS_DATA, preset.init),
    [preset.init]
  );
  const jSeries = jRun.objectiveByIteration;

  const descentPaths = useMemo(
    () =>
      DESCENT_STARTS.map((start) => {
        const path: number[] = [start];
        let t = start;
        for (let i = 0; i < 60; i += 1) {
          t = t - 0.012 * landscapeGrad(t);
          t = Math.max(0, Math.min(10, t));
          path.push(t);
        }
        return path;
      }),
    []
  );

  useEffect(() => {
    if (!descentPlaying) return;
    if (descentStep >= 60) {
      setDescentPlaying(false);
      return;
    }
    const timer = setTimeout(() => setDescentStep((s) => s + 1), 45);
    return () => clearTimeout(timer);
  }, [descentPlaying, descentStep]);

  const landscapePath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i += 1) {
      const t = (i / 200) * 10;
      pts.push(`${i === 0 ? "M" : "L"}${lx(t).toFixed(1)},${ly(landscape(t)).toFixed(1)}`);
    }
    return pts.join(" ");
  }, []);

  const jChart = useMemo(() => {
    const maxJ = Math.max(...jSeries);
    const minJ = Math.min(...jSeries);
    const span = maxJ - minJ || 1;
    const px = (i: number) =>
      40 + (i / Math.max(1, jSeries.length - 1)) * 360;
    const py = (v: number) => 180 - ((v - minJ) / span) * 140;
    return {
      maxJ,
      minJ,
      path: jSeries.map((v, i) => `${i === 0 ? "M" : "L"}${px(i)},${py(v)}`).join(" "),
      points: jSeries.map((v, i) => ({ x: px(i), y: py(v), v, i })),
    };
  }, [jSeries]);

  return (
    <section>
      <SectionTitle
        title="⑴ 반복 수행 과정의 의미 — 목적함수 J"
        subtitle="성능 평가 기준이 명확하지 않은 군집화를 목적함수로 확인하는 방법"
      />

      <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/60">
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          분류 문제는 오류가 얼마인지, 성공이 얼마인지 성능 평가 기준이 명확함. 그러나
          군집화는 군집을 나눈 결과가 잘한 것인지 못한 것인지 명확하게 평가하기 어려움.
          그래서 <strong className="text-teal-700 dark:text-teal-300">목적함수</strong>를
          정의한 뒤, 반복 수행을 통해 그 목적함수를 극소화하는 지점에 도달하는지 확인하는
          것으로 대신함.
        </p>
      </div>

      {/* 목적함수 정의 */}
      <div className="mb-8 rounded-xl border border-teal-200 bg-teal-50 p-5 dark:border-teal-800 dark:bg-teal-950/40">
        <p className="text-xs font-bold tracking-wide text-teal-600 dark:text-teal-400">
          K-평균 군집화 알고리즘의 목적함수
        </p>
        <div className="mt-3 overflow-x-auto">
          <p className="min-w-[280px] font-mono text-base">
            J = Σ<sub>n=1</sub>
            <sup>N</sup> Σ<sub>i=1</sub>
            <sup>K</sup> r<sub>ni</sub> ‖x<sub>n</sub> − m<sub>i</sub>‖²
          </p>
        </div>
        <p className="mt-3 font-mono text-sm text-gray-700 dark:text-gray-300">
          r<sub>ni</sub> = 1 if i = argminⱼ ‖x<sub>n</sub> − mⱼ‖² , else 0
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <p className="rounded-lg bg-white p-3 text-xs leading-relaxed text-gray-700 dark:bg-gray-900 dark:text-gray-300">
            J는 해당 클러스터에 있는 데이터와 대표 벡터 사이 거리의 제곱을 모두 더한 값,
            즉 <strong>각 클러스터 Cᵢ의 분산을 모두 더한 값</strong>.
          </p>
          <div className="space-y-2">
            <p className="rounded-lg bg-white p-2 text-xs text-gray-700 dark:bg-gray-900 dark:text-gray-300">
              <strong className="text-amber-600">J ↑</strong> → 각 클러스터 내의 데이터들이
              서로 뭉쳐 있지 않음
            </p>
            <p className="rounded-lg bg-white p-2 text-xs text-gray-700 dark:bg-gray-900 dark:text-gray-300">
              <strong className="text-emerald-600">J ↓</strong> → 각 클러스터 내에서
              데이터들이 잘 결집되어 있음
            </p>
          </div>
        </div>
      </div>

      {/* r_ni 행렬 */}
      <div className="mb-10">
        <h3 className="mb-1 text-base font-bold">r_ni 행렬 직접 바꿔 보기</h3>
        <p className="mb-4 text-sm text-gray-500">
          대표 벡터 m₁, m₂, m₃는 고정. 각 데이터의 클러스터 배정(r_ni)을 눌러 바꾸면 J가
          함께 갱신됨.
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
            <svg
              viewBox={`0 0 ${DEMO_SIZE} ${DEMO_SIZE}`}
              className="w-full text-slate-300 dark:text-slate-700"
            >
              <line
                x1={DEMO_PAD}
                y1={DEMO_SIZE - DEMO_PAD}
                x2={DEMO_SIZE - DEMO_PAD}
                y2={DEMO_SIZE - DEMO_PAD}
                stroke="currentColor"
              />
              <line
                x1={DEMO_PAD}
                y1={DEMO_PAD}
                x2={DEMO_PAD}
                y2={DEMO_SIZE - DEMO_PAD}
                stroke="currentColor"
              />
              {DEMO_POINTS.map((p, i) => {
                const c = assignment[i];
                return (
                  <line
                    key={`l-${i}`}
                    x1={dsx(p.x)}
                    y1={dsy(p.y)}
                    x2={dsx(DEMO_CENTROIDS[c].x)}
                    y2={dsy(DEMO_CENTROIDS[c].y)}
                    stroke={CLUSTER_COLORS[c]}
                    strokeWidth="0.9"
                    opacity={0.5}
                  />
                );
              })}
              {DEMO_POINTS.map((p, i) => (
                <g key={`p-${i}`}>
                  <circle
                    cx={dsx(p.x)}
                    cy={dsy(p.y)}
                    r={5}
                    fill={CLUSTER_COLORS[assignment[i]]}
                  />
                  <text
                    x={dsx(p.x) + 8}
                    y={dsy(p.y) - 5}
                    fontSize="9"
                    fill="#94a3b8"
                  >
                    x{i + 1}
                  </text>
                </g>
              ))}
              {DEMO_CENTROIDS.map((m, i) => (
                <g key={`m-${i}`}>
                  <circle
                    cx={dsx(m.x)}
                    cy={dsy(m.y)}
                    r={8}
                    fill="none"
                    stroke={CLUSTER_COLORS[i]}
                    strokeWidth="2.5"
                  />
                  <text
                    x={dsx(m.x) - 3}
                    y={dsy(m.y) + 3}
                    fontSize="9"
                    fontWeight="bold"
                    fill={CLUSTER_COLORS[i]}
                  >
                    m{i + 1}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div>
            <div className="overflow-x-auto">
              <table className="min-w-[420px] w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border-b border-gray-200 p-2 text-left text-xs font-bold text-gray-500 dark:border-gray-700">
                      데이터
                    </th>
                    {DEMO_CENTROIDS.map((_, i) => (
                      <th
                        key={i}
                        className="border-b border-gray-200 p-2 text-center text-xs font-bold dark:border-gray-700"
                        style={{ color: CLUSTER_COLORS[i] }}
                      >
                        r<sub>n{i + 1}</sub> (C{i + 1})
                      </th>
                    ))}
                    <th className="border-b border-gray-200 p-2 text-right text-xs font-bold text-gray-500 dark:border-gray-700">
                      ‖xₙ − m‖²
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_POINTS.map((p, n) => (
                    <tr key={n}>
                      <td className="border-b border-gray-100 p-2 font-mono text-xs dark:border-gray-800">
                        x{n + 1} ({p.x}, {p.y})
                      </td>
                      {DEMO_CENTROIDS.map((m, i) => {
                        const on = assignment[n] === i;
                        return (
                          <td
                            key={i}
                            className="border-b border-gray-100 p-1 text-center dark:border-gray-800"
                          >
                            <button
                              onClick={() =>
                                setAssignment((prev) =>
                                  prev.map((v, idx) => (idx === n ? i : v))
                                )
                              }
                              className="w-full rounded py-1 text-sm font-bold transition-colors"
                              style={{
                                backgroundColor: on
                                  ? CLUSTER_COLORS[i]
                                  : "transparent",
                                color: on ? "#ffffff" : "#94a3b8",
                              }}
                            >
                              {on ? 1 : 0}
                            </button>
                            <span className="block text-[10px] text-gray-400">
                              {sqDist(p, m).toFixed(2)}
                            </span>
                          </td>
                        );
                      })}
                      <td className="border-b border-gray-100 p-2 text-right font-mono text-xs dark:border-gray-800">
                        {sqDist(p, DEMO_CENTROIDS[assignment[n]]).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div
                className={`rounded-lg px-4 py-2 ${
                  isOptimal
                    ? "bg-emerald-50 dark:bg-emerald-900/30"
                    : "bg-amber-50 dark:bg-amber-900/30"
                }`}
              >
                <span className="text-xs text-gray-500">현재 J</span>
                <span className="ml-2 text-lg font-bold">
                  {currentJ.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                가장 가까운 대표 벡터로 배정했을 때의 최솟값 J = {optimal.J.toFixed(2)}
              </p>
              <button
                onClick={() => setAssignment(INITIAL_ASSIGNMENT)}
                className="ml-auto flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
              >
                <RotateCcw size={12} />
                처음 배정으로
              </button>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              {isOptimal
                ? "모든 데이터가 가장 가까운 대표 벡터에 배정되어 J가 최소가 됨 — 이것이 K-평균의 ②데이터 그룹핑 단계가 하는 일."
                : "가장 가까운 대표 벡터가 아닌 곳에 배정된 데이터가 있어 J가 최솟값보다 큼. 표를 눌러 J를 더 줄여 볼 것."}
            </p>
          </div>
        </div>
      </div>

      {/* 두 가지 최적화 관점 */}
      <div className="mb-10">
        <h3 className="mb-1 text-base font-bold">J 값을 결정하는 두 파라미터</h3>
        <p className="mb-4 text-sm text-gray-500">
          데이터는 주어지는 값이므로 J를 결정하는 것은 대표 벡터 mᵢ와 각 데이터에 대한
          클러스터 레이블 r_ni 두 가지.
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {["경우 1 — mᵢ 고정, r_ni 결정", "경우 2 — r_ni 고정, mᵢ 수정"].map(
            (label, i) => (
              <button
                key={label}
                onClick={() => setCaseTab(i)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  caseTab === i
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          {caseTab === 0 ? (
            <div>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                mᵢ가 고정되었으므로 J의 값이 최소화되기 위해서는, 각 데이터로부터 가장
                가까운 대표 벡터까지 거리의 합이 더해질 수 있도록 r_ni 값을 결정하면 됨.
              </p>
              <div className="mt-4 rounded-lg bg-teal-50 p-3 text-sm font-bold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                ⇒ K-평균 알고리즘의 ② 그룹핑 과정과 동일한 의미
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                r_ni가 결정되어 있을 때 J를 최소화하려면 J를 mᵢ에 대해 편미분하여 0이 되는
                값을 구함.
              </p>
              <div className="mt-3 overflow-x-auto">
                <p className="min-w-[260px] font-mono text-base">
                  ∂J / ∂mᵢ = 0 ⇒ mᵢ = Σ<sub>n</sub> r<sub>ni</sub> x<sub>n</sub> / Σ
                  <sub>n</sub> r<sub>ni</sub>
                </p>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <li>· 분모 Σₙ r_ni = i번째 클러스터에 속하는 데이터의 개수</li>
                <li>· 분자 Σₙ r_ni xₙ = 그 클러스터에 속하는 모든 데이터를 더한 값</li>
                <li>· 따라서 데이터를 다 더한 뒤 개수로 나눈 평균 벡터가 됨</li>
              </ul>
              <div className="mt-4 rounded-lg bg-teal-50 p-3 text-sm font-bold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                ⇒ K-평균 알고리즘의 ③ 대표 벡터 수정식과 동일한 의미
              </div>
            </div>
          )}
        </div>
      </div>

      {/* J 감소 곡선 */}
      <div className="mb-10">
        <h3 className="mb-1 text-base font-bold">반복 횟수에 따른 J 값의 변화</h3>
        <p className="mb-4 text-sm text-gray-500">
          앞의 시뮬레이터와 같은 데이터 집합을 실제로 수렴할 때까지 돌린 결과.
        </p>
        <div className="mb-3 flex gap-2">
          {J_PRESETS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => setPresetIdx(i)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                presetIdx === i
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <svg
            viewBox="0 0 420 210"
            className="w-full min-w-[380px] text-slate-300 dark:text-slate-700"
          >
            <line x1={40} y1={180} x2={410} y2={180} stroke="currentColor" />
            <line x1={40} y1={20} x2={40} y2={180} stroke="currentColor" />
            <text x={6} y={28} fontSize="11" fill="#64748b">
              J
            </text>
            <text x={370} y={200} fontSize="11" fill="#64748b">
              반복 횟수
            </text>
            <path
              d={jChart.path}
              fill="none"
              stroke="#0d9488"
              strokeWidth="2.5"
            />
            {jChart.points.map((pt) => (
              <g key={pt.i}>
                <circle cx={pt.x} cy={pt.y} r={4} fill="#0d9488" />
                <text
                  x={pt.x}
                  y={192}
                  fontSize="10"
                  textAnchor="middle"
                  fill="#94a3b8"
                >
                  {pt.i + 1}
                </text>
                <text
                  x={pt.x}
                  y={pt.y - 9}
                  fontSize="9"
                  textAnchor="middle"
                  fill="#64748b"
                >
                  {pt.v.toFixed(0)}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
          이 예에서는 {preset.label}로 {jRun.iterations}회 반복한 뒤 대표 벡터가 더 이상
          움직이지 않아 J도 줄어들지 않음. 강의록의 K = 2 예에서도 약 7회 반복 후 J가 더
          이상 줄지 않고 수렴하는 모습을 보임.
        </p>
      </div>

      {/* 지역 극소점 vs 전역 극소점 */}
      <div>
        <h3 className="mb-1 text-base font-bold">지역 극소점과 전역 극소점</h3>
        <p className="mb-4 text-sm text-gray-500">
          한 번 반복할 때마다 J의 값이 줄어드는 방향으로 학습이 진행됨이 보장되어 있음.
        </p>

        <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          아래 곡선은 K-평균의 실제 J 지형을 그린 것이 아니라, 극소점이 여럿인 함수에서는
          어디서 출발하느냐에 따라 도착하는 극소점이 달라진다는 사실만 보이기 위한 모식도.
          표시된 세 극소점의 위치와 공이 멈추는 지점은 이 곡선에서 실제로 계산한 값.
        </p>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setDescentStep(0);
              setDescentPlaying(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
          >
            <Play size={14} />
            세 시작점에서 동시에 내려가기
          </button>
          <button
            onClick={() => {
              setDescentPlaying(false);
              setDescentStep(0);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
          >
            <RotateCcw size={14} />
            처음으로
          </button>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <TrendingDown size={12} />
            시작점에 따라 도착하는 극소점이 달라짐
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <svg
            viewBox="0 0 440 210"
            className="w-full min-w-[380px] text-slate-300 dark:text-slate-700"
          >
            <line x1={30} y1={195} x2={425} y2={195} stroke="currentColor" />
            <text x={8} y={30} fontSize="11" fill="#64748b">
              J
            </text>
            <path d={landscapePath} fill="none" stroke="#94a3b8" strokeWidth="2" />

            {/* 극소점 표시 — 위치는 곡선의 실제 극소점을 수치로 찾은 값 */}
            {MINIMA.map((m) => (
              <g key={m.t}>
                <line
                  x1={lx(m.t)}
                  y1={ly(m.v)}
                  x2={lx(m.t)}
                  y2={L_Y0 + 5}
                  stroke={m.global ? "#0d9488" : "#94a3b8"}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <text
                  x={lx(m.t)}
                  y={ly(m.v) - 12}
                  fontSize="10"
                  textAnchor="middle"
                  fontWeight={m.global ? "bold" : "normal"}
                  fill={m.global ? "#0d9488" : "#94a3b8"}
                >
                  {m.global ? "전역 극소점" : "지역 극소점"}
                </text>
                <text
                  x={lx(m.t)}
                  y={ly(m.v) - 2}
                  fontSize="9"
                  textAnchor="middle"
                  fill={m.global ? "#0d9488" : "#94a3b8"}
                >
                  J = {m.v.toFixed(2)}
                </text>
              </g>
            ))}

            {descentPaths.map((path, i) => {
              const t = path[Math.min(descentStep, path.length - 1)];
              const v = landscape(t);
              return (
                <motion.circle
                  key={i}
                  initial={false}
                  animate={{ cx: lx(t), cy: ly(v) }}
                  transition={{ duration: 0.05, ease: "linear" }}
                  r={6}
                  fill={DESCENT_COLORS[i]}
                />
              );
            })}
          </svg>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-l-4 border-teal-500 bg-teal-50 p-4 dark:bg-teal-950/40">
            <p className="text-sm font-bold text-teal-700 dark:text-teal-300">
              보장되는 것 — 지역 극소점
            </p>
            <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              K-평균 군집화 알고리즘은 목적함수 J를 극소화하는 지역 극소점을 찾는 것을
              보장함.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4 dark:bg-amber-950/40">
            <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
              보장되지 않는 것 — 전역 극소점
            </p>
            <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              전체 공간에서 가장 작은 점인 전역 극소점은 시작점(초기값)에 따라 결과가
              달라지므로 찾는 것을 보장하지 못함.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
