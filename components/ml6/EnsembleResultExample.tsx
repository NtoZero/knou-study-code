"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import {
  mulberry32,
  obliqueEnsemblePredict,
  runAdaBoostOblique,
  type Label,
  type Pt,
} from "./ensembleCore";

/**
 * 강의록 예시와 같은 설정: x₁ ∈ [−1.5π, 1.5π], x₂ ∈ [−1.5, 1.5]에서 400개,
 * 실제 결정경계 x₂ = cos x₁ 위쪽이 C₁, 아래쪽이 C₂.
 * 계산에서는 x₁을 π로 나눈 u = x₁/π 좌표를 써서 두 축의 범위를 맞춘다(결정경계 모양은 같다).
 */
function makeData(n: number, seed: number) {
  const rand = mulberry32(seed);
  const pts: Pt[] = [];
  const t: Label[] = [];
  for (let i = 0; i < n; i += 1) {
    const u = rand() * 3 - 1.5;
    const y = rand() * 3 - 1.5;
    pts.push({ x: u, y });
    t.push(y > Math.cos(u * Math.PI) ? 1 : -1);
  }
  return { pts, t };
}

const TRAIN = makeData(400, 7);
const TEST = makeData(400, 99);
const M_MAX = 200;
const SNAPSHOTS = [1, 5, 10, 50, 100, 200];

const GW = 90;
const GH = 30;
const VW = 420;
const VH = 150;
const vx = (u: number) => ((u + 1.5) / 3) * VW;
const vy = (y: number) => VH - ((y + 1.5) / 3) * VH;

const cosPath = Array.from({ length: 121 }, (_, i) => {
  const u = -1.5 + (i / 120) * 3;
  return `${i === 0 ? "M" : "L"}${vx(u).toFixed(1)},${vy(Math.cos(u * Math.PI)).toFixed(1)}`;
}).join(" ");

export default function EnsembleResultExample() {
  const [m, setM] = useState(1);

  const model = useMemo(
    () => runAdaBoostOblique(TRAIN.pts, TRAIN.t, TEST.pts, TEST.t, M_MAX),
    [],
  );

  const cells = useMemo(() => {
    const out: { i: number; j: number; v: Label }[] = [];
    for (let i = 0; i < GW; i += 1)
      for (let j = 0; j < GH; j += 1) {
        const p = { x: -1.5 + ((i + 0.5) / GW) * 3, y: -1.5 + ((j + 0.5) / GH) * 3 };
        out.push({ i, j, v: obliqueEnsemblePredict(model, m, p) });
      }
    return out;
  }, [model, m]);

  const chart = useMemo(() => {
    const cx = (k: number) => 36 + ((k - 1) / (M_MAX - 1)) * 360;
    const maxE = Math.max(0.3, model.trainError[0], model.testError[0]);
    const cy = (e: number) => 150 - (e / maxE) * 130;
    const line = (arr: number[]) => arr.map((e, k) => `${k === 0 ? "M" : "L"}${cx(k + 1).toFixed(1)},${cy(e).toFixed(1)}`).join(" ");
    return { cx, cy, maxE, train: line(model.trainError), test: line(model.testError) };
  }, [model]);

  return (
    <section id="result-example" className="scroll-mt-32">
      <SectionTitle
        title="09. 앙상블 학습 결과의 예시"
        subtitle="AdaBoost로 선형 분류기를 결합 — 결합하는 분류기 개수 M에 따른 분류 오차와 결정경계의 변화"
      />

      <Sourced
        refs={{
          slides: "앙상블 학습 결과의 예시",
          lecture: "직선 하나뿐인 선형 분류기도 여러 개를 결합하면 결정경계가 실제 경계를 거의 따라가, 간단한 학습기로 복잡한 학습기만큼의 성능을 얻는다고 정리함",
        }}
      >
        <p className="mb-3 text-sm text-gray-500">
          {"{"}(x₁, x₂) | x₁ ∈ [−1.5π, 1.5π], x₂ ∈ [−1.5, 1.5]{"}"}에서 400개의 학습 데이터. 실제
          결정경계(점선) x₂ = cos x₁의 위쪽이 C₁(목표 출력 [1, −1]), 아래쪽이 C₂(목표 출력 [−1, 1]).
          강의록은 퍼셉트론 분류기를 결합했고, 여기서는 매 단계 가중 오분류율 εᵢ가 가장 작은
          직선(36개 방향 × 모든 경계 위치에서 탐색)을 선형 분류기로 사용해 같은 설정을 직접
          계산함. 개별 분류기의 학습 방식이 달라 수치는 강의록 그림과 다름.
        </p>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">M =</span>
            {SNAPSHOTS.map((s) => (
              <button
                key={s}
                onClick={() => setM(s)}
                className={`rounded-md px-2.5 py-1 font-mono text-xs font-bold ${
                  m === s
                    ? "bg-amber-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {s}
              </button>
            ))}
            <input
              type="range"
              min={1}
              max={M_MAX}
              value={m}
              onChange={(e) => setM(Number(e.target.value))}
              className="w-40 accent-amber-500"
              aria-label="결합하는 분류기 개수"
            />
            <span className="font-mono text-sm font-bold">{m}</span>
          </div>

          <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full min-w-[380px] rounded-md">
              {cells.map((c) => (
                <rect
                  key={`${c.i}-${c.j}`}
                  x={(c.i / GW) * VW}
                  y={VH - ((c.j + 1) / GH) * VH}
                  width={VW / GW + 0.3}
                  height={VH / GH + 0.3}
                  fill={c.v === 1 ? "#fecaca" : "#dbeafe"}
                />
              ))}
              {TRAIN.pts.map((p, i) =>
                TRAIN.t[i] === 1 ? (
                  <text key={i} x={vx(p.x)} y={vy(p.y) + 2.5} fontSize="7" textAnchor="middle" fill="#dc2626">
                    *
                  </text>
                ) : (
                  <circle key={i} cx={vx(p.x)} cy={vy(p.y)} r={1.8} fill="none" stroke="#1d4ed8" strokeWidth="0.7" />
                ),
              )}
              <path d={cosPath} fill="none" stroke="#0f172a" strokeWidth="1.5" strokeDasharray="5 3" />
              {m === 1 && (
                <text x={6} y={12} fontSize="9" fill="#475569">
                  M = 1: 직선 하나로 나눈 결정경계
                </text>
              )}
            </svg>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950/40">
              <p className="text-[11px] text-gray-500">학습 데이터 분류 오차 (M = {m})</p>
              <p className="font-mono text-lg font-bold">{model.trainError[m - 1].toFixed(3)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
              <p className="text-[11px] text-gray-500">별도 평가 데이터 400개 분류 오차</p>
              <p className="font-mono text-lg font-bold">{model.testError[m - 1].toFixed(3)}</p>
            </div>
          </div>

          <p className="mb-1 mt-4 text-xs font-bold text-gray-500">결합하는 분류기의 개수 변화에 따른 분류 오차의 변화</p>
          <div className="overflow-x-auto">
            <svg viewBox="0 0 420 175" className="w-full min-w-[360px]">
              <line x1={36} y1={150} x2={400} y2={150} stroke="#cbd5e1" />
              <line x1={36} y1={15} x2={36} y2={150} stroke="#cbd5e1" />
              {[0, 0.1, 0.2, 0.3].filter((v) => v <= chart.maxE).map((v) => (
                <text key={v} x={32} y={chart.cy(v) + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
                  {v.toFixed(1)}
                </text>
              ))}
              {[1, 50, 100, 150, 200].map((v) => (
                <text key={v} x={chart.cx(v)} y={162} fontSize="8" textAnchor="middle" fill="#94a3b8">
                  {v}
                </text>
              ))}
              <text x={400} y={172} fontSize="8" textAnchor="end" fill="#64748b">
                M (분류기 개수)
              </text>
              <path d={chart.test} fill="none" stroke="#94a3b8" strokeWidth="1.2" />
              <path d={chart.train} fill="none" stroke="#1d4ed8" strokeWidth="1.8" />
              <line x1={chart.cx(m)} y1={15} x2={chart.cx(m)} y2={150} stroke="#d97706" strokeDasharray="3 2" />
            </svg>
          </div>
          <div className="flex flex-wrap gap-3 text-[11px] text-gray-500">
            <span><span className="font-bold text-blue-700">━</span> 학습 데이터 분류 오차</span>
            <span><span className="font-bold text-slate-400">━</span> 평가 데이터 분류 오차</span>
          </div>
          <p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
            M = 1이면 직선 하나라 cos 모양의 경계를 따라갈 수 없음. M이 늘어날수록 분류 오차가
            줄고, 결정경계가 여러 직선 조각으로 꺾이며 실제 결정경계에 가까워짐 — 간단한 학습기라도
            결합을 통해 복잡하고 정교한 학습기가 내는 만큼의 성능을 얻을 수 있음.
          </p>
        </div>
      </Sourced>
    </section>
  );
}
