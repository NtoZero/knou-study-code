"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { nonlinearData, trueCurve } from "./svmData";
import {
  contourSegments,
  decision,
  evaluateGrid,
  gaussianKernel,
  linearKernel,
  polyKernel,
  trainSvm,
  type Kernel,
} from "./svmCore";
import { C1_COLOR, C2_COLOR, SV_COLOR, makeScale, type Frame } from "./plotUtils";

const F: Frame = { xMin: -2, xMax: 3, yMin: -2, yMax: 3, width: 320, height: 320, pad: 16 };
const s = makeScale(F);
/** 슬랙변수의 하이퍼파라미터 c — 모든 커널에 같은 값 */
const SLACK_C = 100;
const RES = 60;

const OPTIONS: { key: string; label: string; group: "기본" | "σ 비교"; kernel: Kernel }[] = [
  { key: "linear", label: "선형 커널", group: "기본", kernel: linearKernel },
  { key: "poly", label: "다항식 커널 (c = 1, d = 2)", group: "기본", kernel: polyKernel(1, 2) },
  { key: "g1", label: "가우시안 커널 (σ = 1)", group: "기본", kernel: gaussianKernel(1) },
  { key: "g0.2", label: "σ = 0.2", group: "σ 비교", kernel: gaussianKernel(0.2) },
  { key: "g0.5", label: "σ = 0.5", group: "σ 비교", kernel: gaussianKernel(0.5) },
  { key: "g2", label: "σ = 2.0", group: "σ 비교", kernel: gaussianKernel(2) },
  { key: "g5", label: "σ = 5.0", group: "σ 비교", kernel: gaussianKernel(5) },
];

const MODELS = Object.fromEntries(
  OPTIONS.map((o) => [o.key, trainSvm(nonlinearData, o.kernel, SLACK_C)]),
);

const NOTES: Record<string, string> = {
  linear: "선형 커널은 원래 입력 공간의 내적 그대로라 결정경계가 직선. 곡선 경계를 가진 이 데이터와는 많은 차이가 나고 학습 데이터조차 모두 바르게 나누지 못함.",
  poly: "다항식 커널 (x·y + 1)²는 2차 곡선 결정경계를 만들어 실제 경계와 어느 정도 비슷해짐.",
  g1: "가우시안 커널 σ = 1도 실제 경계와 비슷한 곡선을 만듦.",
  "g0.2": "σ가 매우 작으면 아주 가까운 데이터끼리만 k 값이 커서, 경계가 데이터 사이로 심하게 구불거리고 모든 데이터가 서포트 벡터가 됨 — 학습 데이터에만 지나치게 맞춘 모습.",
  "g0.5": "σ = 0.5에서도 g(x) = ±1 선이 데이터를 하나하나 감싸는 모양이 나타나고 서포트 벡터가 많음.",
  g2: "σ = 2이면 매끄러운 곡선 경계가 되고 서포트 벡터도 적어짐.",
  g5: "σ = 5이면 먼 데이터끼리도 k 값이 커서 경계가 더 완만해지고, 실제 경계의 봉우리보다 둥글게 그려짐.",
};

export default function KernelSvmExperiment() {
  const [key, setKey] = useState("poly");
  const model = MODELS[key];

  const { shading, zero, plus, minus, trainErr } = useMemo(() => {
    const g = (x: [number, number]) => decision(model, x);
    const grid = evaluateGrid(g, F.xMin, F.xMax, F.yMin, F.yMax, RES);
    const cw = (F.width - 2 * F.pad) / RES;
    const cells: { x: number; y: number; pos: boolean }[] = [];
    for (let r = 0; r < RES; r += 1) {
      for (let c = 0; c < RES; c += 1) {
        const v =
          (grid.values[r][c] + grid.values[r][c + 1] + grid.values[r + 1][c] + grid.values[r + 1][c + 1]) / 4;
        cells.push({ x: s.sx(grid.xs[c]), y: s.sy(grid.ys[r + 1]), pos: v > 0 });
      }
    }
    return {
      shading: cells.map((c, i) => (
        <rect
          key={i}
          x={c.x}
          y={c.y}
          width={cw + 0.3}
          height={cw + 0.3}
          fill={c.pos ? C1_COLOR : C2_COLOR}
          opacity={0.1}
        />
      )),
      zero: contourSegments(grid, 0),
      plus: contourSegments(grid, 1),
      minus: contourSegments(grid, -1),
      trainErr: nonlinearData.filter((d) => d.y * g(d.x) <= 0).length,
    };
  }, [model]);

  const curvePath = Array.from({ length: 101 }, (_, i) => {
    const x = F.xMin + (i / 100) * (F.xMax - F.xMin);
    return `${i === 0 ? "M" : "L"}${s.sx(x).toFixed(1)},${s.sy(trueCurve(x)).toFixed(1)}`;
  }).join(" ");

  const seg = (list: [number, number][][], stroke: string, width: number, dash?: string) =>
    list.map(([a, b], i) => (
      <line
        key={i}
        x1={s.sx(a[0])}
        y1={s.sy(a[1])}
        x2={s.sx(b[0])}
        y2={s.sy(b[1])}
        stroke={stroke}
        strokeWidth={width}
        strokeDasharray={dash}
        strokeLinecap="round"
      />
    ));

  const svSet = new Set(model.sv);

  return (
    <section>
      <SectionTitle
        title="비선형 결정경계를 가진 이진 분류의 예"
        subtitle="같은 데이터 30개에 커널만 바꿔 SVM을 학습하고 결정경계와 서포트 벡터를 비교"
      />

      <Sourced
        refs={{
          slides: "비선형 결정경계를 가진 이진 분류의 예 — 실험 결과",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-xs leading-relaxed text-gray-500">
            데이터 개수 30 — ◆ C₁(목표 출력값 1) 15개, ○ C₂(목표 출력값 −1) 15개. 빨간 점선이 데이터를
            만든 실제 경계. 각 커널로 Q(α)를 실제로 풀어(하이퍼파라미터 c = {SLACK_C}) 얻은 결정경계
            (굵은 선)와 g(x) = ±1 선(가는 점선), 서포트 벡터(초록 원)를 그림.
          </p>

          <div className="mt-3 space-y-2">
            {(["기본", "σ 비교"] as const).map((grp) => (
              <div key={grp} className="flex flex-wrap items-center gap-1.5">
                <span className="w-24 shrink-0 text-[11px] font-bold text-gray-500">
                  {grp === "기본" ? "커널 함수" : "가우시안 σ 비교"}
                </span>
                {OPTIONS.filter((o) => o.group === grp).map((o) => (
                  <button
                    key={o.key}
                    onClick={() => setKey(o.key)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      key === o.key
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
            <svg viewBox={`0 0 ${F.width} ${F.height}`} className="w-full rounded-lg border border-gray-100 dark:border-gray-800">
              <rect x={0} y={0} width={F.width} height={F.height} fill="#ffffff" />
              {shading}
              {[-2, -1, 0, 1, 2, 3].map((t) => (
                <g key={t}>
                  <text x={s.sx(t)} y={F.height - 3} fontSize="8" textAnchor="middle" fill="#94a3b8">
                    {t}
                  </text>
                  <text x={3} y={s.sy(t) + 3} fontSize="8" fill="#94a3b8">
                    {t}
                  </text>
                </g>
              ))}
              {seg(plus, "#475569", 0.8, "3 3")}
              {seg(minus, "#475569", 0.8, "3 3")}
              {seg(zero, "#0f172a", 2.4)}
              <path d={curvePath} fill="none" stroke="#e11d48" strokeWidth="1.6" strokeDasharray="6 4" />
              {nonlinearData.map((d, i) => (
                <g key={i}>
                  {svSet.has(i) && (
                    <circle cx={s.sx(d.x[0])} cy={s.sy(d.x[1])} r={8.5} fill="none" stroke={SV_COLOR} strokeWidth="2.2" />
                  )}
                  {d.y === 1 ? (
                    <rect
                      x={s.sx(d.x[0]) - 4}
                      y={s.sy(d.x[1]) - 4}
                      width={8}
                      height={8}
                      fill={C1_COLOR}
                      transform={`rotate(45 ${s.sx(d.x[0])} ${s.sy(d.x[1])})`}
                    />
                  ) : (
                    <circle cx={s.sx(d.x[0])} cy={s.sy(d.x[1])} r={4} fill="#ffffff" stroke={C2_COLOR} strokeWidth="2" />
                  )}
                </g>
              ))}
            </svg>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/40">
                  <p className="text-[11px] text-gray-500">서포트 벡터</p>
                  <p className="font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                    {model.sv.length}개
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                  <p className="text-[11px] text-gray-500">학습 데이터 오분류</p>
                  <p className="font-mono text-2xl font-bold">{trainErr}개</p>
                </div>
              </div>
              <p className="rounded-lg bg-indigo-50 p-3 text-xs leading-relaxed text-gray-700 dark:bg-indigo-950/40 dark:text-gray-300">
                {NOTES[key]}
              </p>
              <div className="rounded-lg border border-gray-200 p-3 text-xs leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
                <p className="font-bold text-gray-700 dark:text-gray-300">강의록 실험 결과와 비교</p>
                <ul className="mt-1 space-y-0.5">
                  <li>· 선형 커널: 실제 경계와 많은 차이</li>
                  <li>· 다항식 커널 c = 1, d = 2: 서포트 벡터 5개</li>
                  <li>· 가우시안 커널 σ = 1: 서포트 벡터 9개</li>
                  <li>· σ = 0.2, 0.5, 2.0, 5.0에 따라 결정경계 모양이 달라짐</li>
                </ul>
                <p className="mt-1 text-[11px] text-gray-400">
                  데이터가 강의록과 같지 않으므로 서포트 벡터 수는 다를 수 있으며, 커널에 따라 경계
                  모양이 달라지는 경향을 비교할 것.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Sourced>
    </section>
  );
}
