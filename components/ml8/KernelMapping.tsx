"use client";

import { useEffect, useMemo, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { circleData } from "./svmData";
import { phi } from "./svmCore";
import { C1_COLOR, C2_COLOR, fmt } from "./plotUtils";

/* ─────────── 1차원 → 2차원 ─────────── */

const ONE_D: { x: number; y: 1 | -1 }[] = [
  { x: -2.6, y: 1 },
  { x: -2.1, y: 1 },
  { x: -1.6, y: 1 },
  { x: -0.9, y: -1 },
  { x: -0.5, y: -1 },
  { x: -0.2, y: -1 },
  { x: 0.3, y: -1 },
  { x: 0.6, y: -1 },
  { x: 1.0, y: -1 },
  { x: 1.5, y: 1 },
  { x: 2.0, y: 1 },
  { x: 2.4, y: 1 },
];
const INNER_MAX_SQ = Math.max(...ONE_D.filter((d) => d.y === -1).map((d) => d.x * d.x));
const OUTER_MIN_SQ = Math.min(...ONE_D.filter((d) => d.y === 1).map((d) => d.x * d.x));
/** 2차원에서 두 클래스를 가르는 수평선 z₂ = T */
const T = (INNER_MAX_SQ + OUTER_MIN_SQ) / 2;

const W1 = 320;
const H1 = 200;
const ox = (x: number) => 20 + ((x + 3) / 6) * (W1 - 40);
const oy = (z: number) => H1 - 30 - (z / 7.2) * (H1 - 50);

/* ─────────── 2차원 → 3차원 (식 10-30) ─────────── */

const PHI_POINTS = circleData.map((d) => ({ ...d, z: phi(d.x) }));
const BOX = { z1: [0, 2.2], z2: [-1.6, 1.6], z3: [0, 2.2] } as const;
const CENTER = [1.1, 0, 1.1];

function project(p: readonly [number, number, number], az: number, el: number) {
  const X = p[0] - CENTER[0];
  const Y = p[1] - CENTER[1];
  const Z = p[2] - CENTER[2];
  const ca = Math.cos(az);
  const sa = Math.sin(az);
  const ce = Math.cos(el);
  const se = Math.sin(el);
  const u = -sa * X + ca * Y;
  const v = -(ca * X + sa * Y) * se + Z * ce;
  const depth = (ca * X + sa * Y) * ce + Z * se;
  return { u, v, depth };
}

const W3 = 320;
const H3 = 280;
const S3 = 70;
const p3 = (p: readonly [number, number, number], az: number, el: number) => {
  const { u, v, depth } = project(p, az, el);
  return { x: W3 / 2 + u * S3, y: H3 / 2 - v * S3, depth };
};

const W2 = 260;
const s2 = (x: number) => W2 / 2 + x * 75;

export default function KernelMapping() {
  const [lift, setLift] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [az, setAz] = useState(-35);
  const [el, setEl] = useState(20);
  const [showPlane, setShowPlane] = useState(true);
  const [pick, setPick] = useState(12);

  useEffect(() => {
    if (!playing) return;
    if (lift >= 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setLift((v) => Math.min(1, v + 0.04)), 30);
    return () => clearTimeout(t);
  }, [playing, lift]);

  const azR = (az * Math.PI) / 180;
  const elR = (el * Math.PI) / 180;

  const boxEdges = useMemo(() => {
    const xs = BOX.z1;
    const ys = BOX.z2;
    const zs = BOX.z3;
    const corners: [number, number, number][] = [];
    for (const a of xs) for (const b of ys) for (const c of zs) corners.push([a, b, c]);
    const edges: [number, number][] = [];
    for (let i = 0; i < 8; i += 1) {
      for (let j = i + 1; j < 8; j += 1) {
        const diff = [0, 1, 2].filter((k) => corners[i][k] !== corners[j][k]).length;
        if (diff === 1) edges.push([i, j]);
      }
    }
    return edges.map(([i, j]) => [p3(corners[i], azR, elR), p3(corners[j], azR, elR)]);
  }, [azR, elR]);

  const plane = [
    [1, BOX.z2[0], 0],
    [1, BOX.z2[1], 0],
    [0, BOX.z2[1], 1],
    [0, BOX.z2[0], 1],
  ].map((p) => p3(p as [number, number, number], azR, elR));

  const sorted = PHI_POINTS.map((d, i) => ({ ...d, i, pr: p3(d.z, azR, elR) })).sort(
    (a, b) => a.pr.depth - b.pr.depth,
  );

  const sel = PHI_POINTS[pick];
  const r2 = sel.x[0] ** 2 + sel.x[1] ** 2;

  const axisLabel = (p: [number, number, number], text: string) => {
    const q = p3(p, azR, elR);
    return (
      <text x={q.x} y={q.y} fontSize="10" fill="#64748b" textAnchor="middle">
        {text}
      </text>
    );
  };

  return (
    <section>
      <SectionTitle
        title="10.3.1 커널의 필요성"
        subtitle="저차원의 입력을 고차원 공간으로 매핑하면 비선형 문제가 선형 문제로 바뀜"
      />

      <Sourced
        refs={{
          textbook: "10.3.1 커널의 필요성",
          slides: "비선형 분류 문제의 해결 방법",
          lecture: "슬랙변수로 어느 정도는 대처하지만 결정경계가 선형 초평면이라는 한계는 그대로라서, 좀 더 적극적인 방법으로 커널법이 등장한다고 연결",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border-l-4 border-indigo-500 bg-indigo-50 p-4 dark:bg-indigo-950/40">
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            선형 분리가 불가능한 문제는 슬랙변수로 어느 정도 해결할 수 있으나, 결국 선형 초평면을
            결정경계로 사용하므로 그 한계를 극복할 수는 없음. 좀 더 적극적인 해결책으로,{" "}
            <strong>저차원의 입력 x를 좀 더 고차원 공간의 값 Φ(x)로 매핑시키는 함수 Φ</strong>를
            생각함.
          </p>
        </div>
      </Sourced>

      <Sourced
        refs={{ textbook: "10.3.1 커널의 필요성" }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">먼저 1차원에서 — 차원을 하나 높이면 생기는 일</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            설명을 위한 1차원 예. 수직선 위에서 ○ C₂가 가운데, ● C₁이 양 끝에 있어 점 하나(1차원의
            선형 경계)로는 나눌 수 없음. 각 x를 (x, x²)로 보내 2차원으로 올리면 수평선 하나로 나뉨.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setLift(0);
                setPlaying(true);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Play size={14} /> x → (x, x²) 매핑
            </button>
            <button
              onClick={() => {
                setPlaying(false);
                setLift(0);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              <RotateCcw size={14} /> 1차원으로
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={lift}
              onChange={(e) => {
                setPlaying(false);
                setLift(Number(e.target.value));
              }}
              className="min-w-0 flex-1 accent-indigo-600"
              aria-label="매핑 진행 정도"
            />
          </div>
          <div className="mt-3 overflow-x-auto">
            <svg viewBox={`0 0 ${W1} ${H1}`} className="w-full min-w-[300px] max-w-[560px]">
              <line x1={ox(-3)} y1={oy(0)} x2={ox(3)} y2={oy(0)} stroke="#94a3b8" />
              {[-3, -2, -1, 0, 1, 2, 3].map((t) => (
                <text key={t} x={ox(t)} y={oy(0) + 14} fontSize="9" textAnchor="middle" fill="#94a3b8">
                  {t}
                </text>
              ))}
              {lift > 0.02 && (
                <>
                  <line x1={ox(0)} y1={oy(0)} x2={ox(0)} y2={oy(7)} stroke="#e2e8f0" />
                  <text x={ox(0) + 4} y={oy(7) + 8} fontSize="9" fill="#94a3b8">
                    x²
                  </text>
                  <path
                    d={Array.from({ length: 61 }, (_, i) => {
                      const x = -2.65 + (i / 60) * 5.3;
                      return `${i === 0 ? "M" : "L"}${ox(x).toFixed(1)},${oy(lift * x * x).toFixed(1)}`;
                    }).join(" ")}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeDasharray="3 3"
                  />
                </>
              )}
              {lift >= 0.999 && (
                <g>
                  <line x1={ox(-3)} y1={oy(T)} x2={ox(3)} y2={oy(T)} stroke="#c026d3" strokeWidth="2" />
                  <text x={ox(3) - 2} y={oy(T) - 5} fontSize="10" textAnchor="end" fill="#c026d3">
                    x² = {fmt(T, 3)} (선형 경계)
                  </text>
                </g>
              )}
              {ONE_D.map((d) => (
                <circle
                  key={d.x}
                  cx={ox(d.x)}
                  cy={oy(lift * d.x * d.x)}
                  r={5}
                  fill={d.y === 1 ? C1_COLOR : "#ffffff"}
                  stroke={d.y === 1 ? C1_COLOR : C2_COLOR}
                  strokeWidth={d.y === 1 ? 1 : 2}
                />
              ))}
            </svg>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            {lift >= 0.999
              ? `2차원에서는 x² = ${fmt(T, 3)}인 직선 하나가 두 클래스를 가름. 원래 1차원으로 되돌려 읽으면 |x| = ${fmt(Math.sqrt(T), 3)}인 두 점, 곧 선형이 아닌 결정경계가 됨.`
              : "매핑을 실행해 점들이 포물선 위로 올라가는 모습을 볼 것."}
          </p>
        </div>
      </Sourced>

      <Sourced
        refs={{
          textbook: "10.3.1 커널의 필요성 (식 10-30, 그림 10-8)",
          slides: "비선형 분류 문제의 해결 방법 — Φ : R² → R³",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">교재의 예 — 2차원 공간 데이터를 3차원으로 매핑</h3>
          <div className="mt-2 overflow-x-auto rounded-lg bg-indigo-50 p-3 dark:bg-indigo-950/40">
            <p className="min-w-[320px] font-mono text-sm">
              Φ : R² → R³, (x₁, x₂) ↦ (x₁², √2 x₁x₂, x₂²){" "}
              <span className="text-xs text-gray-500">(식 10-30)</span>
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-bold text-gray-500">2차원 — 원형의 결정경계가 필요한 비선형 문제</p>
              <svg viewBox={`0 0 ${W2} ${W2}`} className="mx-auto w-full max-w-[280px] rounded-lg border border-gray-100 dark:border-gray-800">
                <rect x={0} y={0} width={W2} height={W2} fill="#ffffff" />
                <line x1={0} y1={s2(0)} x2={W2} y2={s2(0)} stroke="#e2e8f0" />
                <line x1={s2(0)} y1={0} x2={s2(0)} y2={W2} stroke="#e2e8f0" />
                <circle cx={s2(0)} cy={s2(0)} r={75} fill="none" stroke="#c026d3" strokeDasharray="4 3" strokeWidth="1.5" />
                <text x={s2(0.72)} y={s2(-0.72) + 16} fontSize="9" fill="#c026d3">
                  x₁² + x₂² = 1
                </text>
                {circleData.map((d, i) => (
                  <circle
                    key={i}
                    cx={s2(d.x[0])}
                    cy={s2(-d.x[1])}
                    r={i === pick ? 7 : 4.5}
                    fill={d.y === 1 ? C1_COLOR : "#ffffff"}
                    stroke={i === pick ? "#0f172a" : d.y === 1 ? C1_COLOR : C2_COLOR}
                    strokeWidth={i === pick ? 2 : d.y === 1 ? 1 : 2}
                    className="cursor-pointer"
                    onClick={() => setPick(i)}
                  />
                ))}
              </svg>
            </div>
            <div>
              <p className="mb-1 text-xs font-bold text-gray-500">3차원 — 선형 평면으로 분류 가능한 선형 문제</p>
              <svg viewBox={`0 0 ${W3} ${H3}`} className="mx-auto w-full max-w-[340px] rounded-lg border border-gray-100 dark:border-gray-800">
                <rect x={0} y={0} width={W3} height={H3} fill="#ffffff" />
                {boxEdges.map(([a, b], i) => (
                  <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#e2e8f0" />
                ))}
                {axisLabel([BOX.z1[1] + 0.25, BOX.z2[0], 0], "x₁²")}
                {axisLabel([BOX.z1[0], BOX.z2[1] + 0.3, 0], "√2x₁x₂")}
                {axisLabel([BOX.z1[0], BOX.z2[0], BOX.z3[1] + 0.2], "x₂²")}
                {sorted.map((d) => {
                  return (
                    <circle
                      key={d.i}
                      cx={d.pr.x}
                      cy={d.pr.y}
                      r={d.i === pick ? 6.5 : 4}
                      fill={d.y === 1 ? C1_COLOR : "#ffffff"}
                      stroke={d.i === pick ? "#0f172a" : d.y === 1 ? C1_COLOR : C2_COLOR}
                      strokeWidth={d.i === pick ? 2 : d.y === 1 ? 1 : 2}
                      className="cursor-pointer"
                      onClick={() => setPick(d.i)}
                    />
                  );
                })}
                {showPlane && (
                  <polygon
                    points={plane.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="#c026d3"
                    opacity={0.14}
                    stroke="#c026d3"
                    strokeWidth="1"
                  />
                )}
              </svg>
              <div className="mt-2 space-y-1">
                <label className="flex items-center gap-2 text-xs">
                  <span className="w-14 shrink-0">좌우 회전</span>
                  <input type="range" min={-180} max={180} value={az} onChange={(e) => setAz(Number(e.target.value))} className="min-w-0 flex-1 accent-indigo-600" />
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <span className="w-14 shrink-0">위아래</span>
                  <input type="range" min={-10} max={80} value={el} onChange={(e) => setEl(Number(e.target.value))} className="min-w-0 flex-1 accent-indigo-600" />
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={showPlane} onChange={(e) => setShowPlane(e.target.checked)} className="accent-indigo-600" />
                  분리 평면 x₁² + x₂² = 1 표시
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg bg-gray-50 p-3 font-mono text-xs leading-6 dark:bg-gray-800/60">
            <p className="min-w-[320px]">
              선택한 점 x = ({sel.x[0]}, {sel.x[1]}) — {sel.y === 1 ? "● 바깥쪽" : "○ 안쪽"}
            </p>
            <p className="min-w-[320px]">
              Φ(x) = ({fmt(sel.z[0], 3)}, {fmt(sel.z[1], 3)}, {fmt(sel.z[2], 3)})
            </p>
            <p className="min-w-[320px]">
              첫째 + 셋째 좌표 = x₁² + x₂² = {fmt(r2, 3)} {r2 > 1 ? "> 1 → 평면의 바깥쪽" : "< 1 → 평면의 원점 쪽"}
            </p>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            2차원의 원 x₁² + x₂² = 1은 3차원에서 z₁ + z₃ = 1이라는 <strong>평면</strong>이 됨. 두 점을
            눌러 비교해 볼 것. 이처럼 입력 데이터의 차원을 높여 문제를 선형화하면 간단한 선형 분류기로
            분류할 수 있지만, 차원을 높임으로써 발생하는 <strong>계산량의 증가</strong>와 같은 부작용도
            고려해야 함. 이 부작용을 해결하기 위해 제안된 방법이 <strong>커널법</strong>.
          </p>
        </div>
      </Sourced>
    </section>
  );
}

