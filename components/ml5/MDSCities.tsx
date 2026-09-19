"use client";

import { useEffect, useMemo, useState } from "react";
import { Play, Pause, RotateCcw, StepForward } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { gaussian, mdsStep, mulberry32, norm, stress, sub, type Vec } from "./featureCore";
import { Card, DefinitionBox, Formula, Note, Stat, ROSE, SLATE, fmt, linScale } from "./ui";

const CITIES = ["서울", "대구", "대전", "광주", "원주", "부산"];

/** [그림 7-10(a)] 6개 도시 간의 이동에 드는 비용 */
const D = [
  [0, 350, 239, 330, 187, 480],
  [350, 0, 123, 283, 379, 110],
  [239, 123, 0, 186, 135, 390],
  [330, 283, 186, 0, 274, 400],
  [187, 379, 135, 274, 0, 450],
  [480, 110, 390, 400, 450, 0],
];

const ITERS = 40;

/** 무작위 좌표에서 출발해 Σ(dᵢⱼ − δᵢⱼ)²를 줄여 가는 과정을 미리 계산 */
const HISTORY: Vec[][] = (() => {
  const rng = mulberry32(11);
  let Y: Vec[] = D.map(() => [gaussian(rng) * 150, gaussian(rng) * 150]);
  const out = [Y];
  for (let i = 0; i < ITERS; i++) {
    Y = mdsStep(D, Y);
    out.push(Y);
  }
  return out;
})();
const STRESS = HISTORY.map((Y) => stress(D, Y));

export default function MDSCities() {
  const [it, setIt] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [sel, setSel] = useState(0);

  useEffect(() => {
    if (!playing) return;
    if (it >= ITERS) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setIt((v) => v + 1), 160);
    return () => clearTimeout(t);
  }, [playing, it]);

  const Y = HISTORY[it];
  const delta = Y.map((a) => Y.map((b) => norm(sub(a, b))));

  const box = useMemo(() => {
    const xs = HISTORY.flat().map((p) => p[0]);
    const ys = HISTORY.flat().map((p) => p[1]);
    const r = Math.max(...xs.map(Math.abs), ...ys.map(Math.abs)) * 1.08;
    return r;
  }, []);
  const range = box;
  const sx = linScale(-range, range, 20, 280);
  const sy = linScale(-range, range, 280, 20);

  const smax = STRESS[0];
  const cx = linScale(0, ITERS, 40, 300);
  const cy = linScale(0, smax, 120, 12);

  return (
    <section>
      <SectionTitle
        title="7.4 거리 기반 차원 축소 방법 · 7.4.1 다차원 척도법"
        subtitle="두 데이터 간의 거리(또는 유사도)를 핵심 정보로 사용해 차원을 축소"
      />

      <div className="space-y-6">
        <Sourced
          refs={{
            textbook: "7.4 거리 기반 차원 축소 방법 · 7.4.1 다차원 척도법 (식 7-21, 7-22)",
            slides: "거리 기반 차원 축소 방법 — 목적",
          }}
        >
          <DefinitionBox label="거리 기반 차원 축소의 목적">
            <p>
              앞의 두 방법은 선형변환으로 얻은 특징값의 분포가 원하는 통계적 특성을 갖도록 변환행렬을
              최적화함. 거리 기반 방법은 원래 데이터 x와 얻어지는 특징 y 사이의{" "}
              <strong>매핑 함수를 명백하게 정의하지 않고</strong>, 현재 주어진 데이터 간의 거리가 추출된 저차원
              특징들 사이에서도 그대로 유지되는 것에 관심을 둠.
            </p>
            <div className="mt-3 space-y-2">
              <Formula tag="식 7-21, 7-22">dᵢⱼ = dist(xᵢ, xⱼ) ,  δᵢⱼ = dist(yᵢ, yⱼ)</Formula>
              <Formula>D = {"{"}dᵢⱼ{"}"} (원래 데이터의 거리행렬) ,  Δ = {"{"}δᵢⱼ{"}"} (특징 벡터의 거리행렬)</Formula>
              <Formula>목적 → Σᵢ,ⱼ (dᵢⱼ − δᵢⱼ)² 의 최소화</Formula>
            </div>
          </DefinitionBox>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7.4.1 다차원 척도법",
            slides: "다차원 척도법",
          }}
        >
          <Card title="다차원 척도법 MDS: Multi-Dimensional Scaling">
            <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
              <li>· 기본 MDS에서 두 특징 간의 거리 δᵢⱼ는 <strong>유클리디안 거리</strong>를 사용</li>
              <li>
                · 원래 입력 데이터의 거리 dᵢⱼ는 유클리디안 거리 외에도 다양한 형태로 정의 가능 — 예: 두 도시
                간의 이동에 드는 비용. 거리행렬 D가 값으로 주어지거나, 입력값에 대해 유클리디안 거리 사용
              </li>
              <li>
                · 행렬 D에 대한 분석을 통해 Σ(dᵢⱼ − δᵢⱼ)²를 최소화하는 특징 {"{"}y₁, …, y_N{"}"}를 찾음 → 원래
                데이터가 가지는 거리 관계를 유클리디안 좌표 평면상의 거리로 나타낼 수 있음
              </li>
            </ul>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7.4.1 — [그림 7-10] MDS의 적용 사례",
            slides: "다차원 척도법 — 거리행렬 D (6개 도시 간의 이동에 드는 비용)",
          }}
        >
          <Card title="6개 도시의 거리행렬 D → 2차원 좌표">
            <div className="overflow-x-auto">
              <table className="min-w-[420px] border-collapse text-center text-xs">
                <thead>
                  <tr>
                    <th className="border border-gray-200 bg-gray-50 p-1.5 dark:border-gray-700 dark:bg-gray-800">D</th>
                    {CITIES.map((c, j) => (
                      <th key={c} className={`border border-gray-200 p-1.5 dark:border-gray-700 ${j === sel ? "bg-rose-100 dark:bg-rose-950/60" : "bg-gray-50 dark:bg-gray-800"}`}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CITIES.map((c, i) => (
                    <tr key={c} className={i === sel ? "bg-rose-50 dark:bg-rose-950/30" : ""}>
                      <th className="border border-gray-200 p-1.5 dark:border-gray-700">
                        <button type="button" onClick={() => setSel(i)} className={`w-full ${i === sel ? "font-bold text-rose-600 dark:text-rose-400" : ""}`}>
                          {c}
                        </button>
                      </th>
                      {D[i].map((v, j) => (
                        <td key={j} className="border border-gray-200 p-1.5 font-mono dark:border-gray-700">
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-1 text-[11px] text-gray-400">도시 이름을 누르면 그 도시를 기준으로 비교함</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => setPlaying((p) => !p)} className="flex items-center gap-1.5 rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-600">
                {playing ? <Pause size={14} /> : <Play size={14} />}
                {playing ? "멈춤" : it >= ITERS ? "끝까지 옴" : "반복 갱신 실행"}
              </button>
              <button type="button" disabled={it >= ITERS} onClick={() => setIt((v) => Math.min(ITERS, v + 1))} className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-600 disabled:opacity-40 dark:bg-gray-800 dark:text-gray-300">
                <StepForward size={14} /> 한 번
              </button>
              <button type="button" onClick={() => { setPlaying(false); setIt(0); }} className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                <RotateCcw size={14} /> 무작위 좌표로
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
              <svg viewBox="0 0 300 300" className="w-full rounded-lg border border-gray-200 bg-white text-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-800">
                <line x1={20} y1={sy(0)} x2={280} y2={sy(0)} stroke="currentColor" />
                <line x1={sx(0)} y1={20} x2={sx(0)} y2={280} stroke="currentColor" />
                {Y.map((p, j) =>
                  j === sel ? null : (
                    <line key={`l${j}`} x1={sx(Y[sel][0])} y1={sy(Y[sel][1])} x2={sx(p[0])} y2={sy(p[1])} stroke={ROSE} strokeWidth="0.8" opacity={0.4} />
                  ),
                )}
                {Y.map((p, j) => (
                  <g key={j} style={{ transition: "transform 0.15s" }}>
                    <circle cx={sx(p[0])} cy={sy(p[1])} r={j === sel ? 6 : 4.5} fill={j === sel ? ROSE : "#2563eb"} />
                    <text x={sx(p[0]) + 7} y={sy(p[1]) - 5} fontSize="11" fill="#334155" className="dark:fill-gray-200">
                      {CITIES[j]}
                    </text>
                  </g>
                ))}
              </svg>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Stat label="반복 횟수" value={`${it} / ${ITERS}`} />
                  <Stat label="Σᵢ<ⱼ (dᵢⱼ − δᵢⱼ)²" value={fmt(STRESS[it], 0)} tone="accent" />
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-950">
                  <svg viewBox="0 0 310 135" className="w-full min-w-[280px] text-gray-200 dark:text-gray-800">
                    <line x1={40} y1={120} x2={304} y2={120} stroke="currentColor" />
                    <line x1={40} y1={10} x2={40} y2={120} stroke="currentColor" />
                    <text x={2} y={14} fontSize="9" fill={SLATE}>
                      목적함수
                    </text>
                    <text x={270} y={132} fontSize="9" fill={SLATE}>
                      반복
                    </text>
                    <path d={STRESS.slice(0, it + 1).map((s, i) => `${i ? "L" : "M"}${cx(i)},${cy(s)}`).join(" ")} fill="none" stroke={ROSE} strokeWidth="2" />
                    <circle cx={cx(it)} cy={cy(STRESS[it])} r={3.5} fill={ROSE} />
                  </svg>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[300px] text-xs">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="p-1 text-left">{CITIES[sel]} →</th>
                        <th className="p-1 text-right">원래 거리 d</th>
                        <th className="p-1 text-right">특징 거리 δ</th>
                        <th className="p-1 text-right">차이</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {CITIES.map((c, j) =>
                        j === sel ? null : (
                          <tr key={c} className="border-t border-gray-100 dark:border-gray-800">
                            <td className="p-1 font-sans">{c}</td>
                            <td className="p-1 text-right">{D[sel][j]}</td>
                            <td className="p-1 text-right">{fmt(delta[sel][j], 0)}</td>
                            <td className={`p-1 text-right ${Math.abs(D[sel][j] - delta[sel][j]) > 60 ? "text-amber-600" : "text-emerald-600"}`}>
                              {fmt(delta[sel][j] - D[sel][j], 0)}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              거리값이 작은 도시(대구–부산 110)는 서로 가깝게, 큰 도시(서울–부산 480)는 서로 멀게 위치함. 이
              비용표는 평면에 완벽히 옮길 수 없어서 목적함수가 0이 되지는 않고, 거리 관계를 최대한 유지하는
              배치에서 멈춤.
            </p>
          </Card>
        </Sourced>

        <Note>
          여기서는 δᵢⱼ = ‖yᵢ − yⱼ‖로 두고, 무작위 좌표에서 출발해 Σ(dᵢⱼ − δᵢⱼ)²가 매번 줄어들도록 좌표를
          고쳐 가는 반복 계산을 실제로 수행함. 거리만 맞추므로 결과 그림을 돌리거나 뒤집어도 같은 답이며,
          교재 그림과 방향이 다를 수 있음.
        </Note>
      </div>
    </section>
  );
}
