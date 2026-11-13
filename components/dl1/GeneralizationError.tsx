"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Formula, Hint, Scroller, Chip, ComputedNote, Tag, fmt } from "@/components/dlShared/ui";
import { countCorrect, irisPetals, perceptronOut, type Boundary } from "@/components/dl1/irisData";
import { PLOT, PlotFrame, PetalPoints, boundarySegment, positiveRegion, px, py, r2 } from "@/components/dl1/plot";

/** setosa 를 식별하도록 학습된, 서로 다른 네 개의 경계.
 *  모두 학습표본 150개를 전부 맞히지만 직선의 자리는 제각각이다. */
const runs: { name: string; bd: Boundary; eq: string; note: string }[] = [
  {
    name: "경계 A",
    bd: { w1: -0.32, w2: -0.963, b: 1.125 },
    eq: "−0.320x₁ − 0.963x₂ + 1.125 = 0",
    note: "강의록 실습이 보여 준 경계.",
  },
  {
    name: "경계 B",
    bd: { w1: -0.26, w2: -0.3, b: 1.05 },
    eq: "−0.260x₁ − 0.300x₂ + 1.050 = 0",
    note: "조금 더 완만하게 누운 직선.",
  },
  {
    name: "경계 C",
    bd: { w1: 0.1, w2: -1.0, b: 0.55 },
    eq: "0.100x₁ − 1.000x₂ + 0.550 = 0",
    note: "거의 수평에 가깝게 지나가는 직선.",
  },
  {
    name: "경계 D",
    bd: { w1: -1.0, w2: 0, b: 2.4 },
    eq: "−1.000x₁ + 2.400 = 0",
    note: "꽃잎 길이만 보고 자르는 수직선.",
  },
];

const unknowns: [number, number][] = [
  [2.2, 0.9],
  [2.5, 0.8],
  [2.0, 0.7],
  [2.6, 1.0],
];

/** 경계에서 가장 가까운 학습표본까지의 거리 — 강의가 말한 ‘마진’에 해당 */
function margin(bd: Boundary): number {
  const n = Math.hypot(bd.w1, bd.w2) || 1;
  let best = Infinity;
  for (const [x1, x2] of irisPetals) {
    const d = Math.abs(bd.w1 * x1 + bd.w2 * x2 + bd.b) / n;
    if (d < best) best = d;
  }
  return Math.round(best * 1000) / 1000;
}

export default function GeneralizationError() {
  const [sel, setSel] = useState(0);
  const [point, setPoint] = useState<[number, number]>(unknowns[0]);
  const [overlay, setOverlay] = useState(false);

  const cur = runs[sel];
  const seg = boundarySegment(cur.bd);
  const poly = positiveRegion(cur.bd);

  const click = (e: React.MouseEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const vx = ((e.clientX - box.left) / box.width) * PLOT.w;
    const vy = ((e.clientY - box.top) / box.height) * PLOT.h;
    const innerW = PLOT.w - PLOT.left - PLOT.right;
    const innerH = PLOT.h - PLOT.top - PLOT.bottom;
    const x1 = PLOT.xMin + ((vx - PLOT.left) / innerW) * (PLOT.xMax - PLOT.xMin);
    const x2 = PLOT.yMin + ((PLOT.top + innerH - vy) / innerH) * (PLOT.yMax - PLOT.yMin);
    setPoint([
      r2(Math.max(PLOT.xMin, Math.min(PLOT.xMax, x1))),
      r2(Math.max(PLOT.yMin, Math.min(PLOT.yMax, x2))),
    ]);
  };

  const verdicts = runs.map((r) => perceptronOut(r.bd, point[0], point[1]));
  const split = verdicts.some((v) => v === 1) && verdicts.some((v) => v === 0);

  return (
    <section id="generalization-error" className="scroll-mt-32">
      <SectionTitle
        title="퍼셉트론의 일반화 오류 문제"
        subtitle="학습표본은 전부 맞히는데도, 처음 보는 표본에서 답이 갈리는 이유를 봅니다"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "4. 퍼셉트론의 일반화 오류 문제 — 단위 계단 함수는 0 또는 1의 출력만 냄",
            lecture: "w와 b를 랜덤 값으로 시작하므로 돌릴 때마다 다른 경계가 나오고, δ가 모두 0이 되면 거기서 훈련이 멈춘다",
          }}
        >
          <Card>
            <CardTitle>분류가 맞으면 δ = 0 이라 파라미터가 더 변하지 않는다</CardTitle>
            <Formula note="δ = 0 이면 ηδxᵢ 도 ηδ 도 0이므로 w와 b가 그대로 남는다">
              ŷ = y &nbsp;⟹&nbsp; δ = ŷ − y = 0 &nbsp;⟹&nbsp; wᵢ(t+1) = wᵢ(t) , b(t+1) = b(t)
            </Formula>
            <p className="mt-3 text-[12.5px] leading-6 text-gray-600 dark:text-gray-300">
              파라미터는 작은 랜덤 값에서 출발합니다. 모든 학습 표본에서 분류가 맞아떨어지는 순간 δ 가 전부
              0이 되고, 그 자리에서 훈련이 멈춥니다. 그래서 <b>학습을 돌릴 때마다 다른 경계</b>가 나오는데,
              어느 것이나 학습표본에 대해서는 똑같이 100% 맞습니다.
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "4. 퍼셉트론의 일반화 오류 문제 — 서로 다른 결정경계 그림",
            lecture: "미지의 표본이 하나 나타나면 경계마다 다르게 판단한다는 것을 그림으로 짚음",
          }}
        >
          <Card>
            <CardTitle>같은 데이터, 네 가지 경계 — 미지의 표본에서 답이 갈린다</CardTitle>

            <div className="mb-3 flex flex-wrap gap-2">
              {runs.map((r, i) => (
                <Chip key={r.name} active={!overlay && sel === i} onClick={() => { setSel(i); setOverlay(false); }}>
                  {r.name}
                </Chip>
              ))}
              <Chip active={overlay} onClick={() => setOverlay(!overlay)}>
                네 개 겹쳐 보기
              </Chip>
            </div>

            <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
              <Scroller>
                <svg
                  viewBox={`0 0 ${PLOT.w} ${PLOT.h}`}
                  onClick={click}
                  className="h-auto w-[360px] min-w-[320px] cursor-crosshair"
                >
                  <rect
                    x={PLOT.left}
                    y={PLOT.top}
                    width={PLOT.w - PLOT.left - PLOT.right}
                    height={PLOT.h - PLOT.top - PLOT.bottom}
                    className="fill-blue-50 dark:fill-blue-950/30"
                  />
                  {!overlay && poly && (
                    <polygon points={poly} className="fill-fuchsia-100 dark:fill-fuchsia-900/30" />
                  )}
                  <PlotFrame />
                  <PetalPoints targetIndex={0} />

                  {overlay
                    ? runs.map((r, i) => {
                        const s = boundarySegment(r.bd);
                        if (!s) return null;
                        return (
                          <g key={r.name}>
                            <line
                              x1={s.x1}
                              y1={s.y1}
                              x2={s.x2}
                              y2={s.y2}
                              stroke={["#b91c1c", "#ea580c", "#0d9488", "#7c3aed"][i]}
                              strokeWidth={1.8}
                            />
                          </g>
                        );
                      })
                    : seg && (
                        <line x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2} stroke="#b91c1c" strokeWidth={2} />
                      )}

                  <circle cx={px(point[0])} cy={py(point[1])} r={5} className="fill-gray-900 dark:fill-white" />
                  <circle
                    cx={px(point[0])}
                    cy={py(point[1])}
                    r={9}
                    fill="none"
                    className="stroke-gray-900 dark:stroke-white"
                    strokeWidth={1}
                  />
                  <text x={px(point[0]) + 12} y={py(point[1]) - 6} className="fill-gray-700 text-[9px] dark:fill-gray-200">
                    미지의 표본
                  </text>
                </svg>
                <p className="mt-1 text-[11px] text-gray-500">그림 안을 클릭하면 미지의 표본이 그 자리로 옮겨 갑니다.</p>
              </Scroller>

              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {unknowns.map((p) => (
                    <button
                      key={p.join(",")}
                      type="button"
                      onClick={() => setPoint(p)}
                      className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${
                        point[0] === p[0] && point[1] === p[1]
                          ? "border-gray-800 bg-gray-800 text-white dark:border-gray-200 dark:bg-gray-200 dark:text-gray-900"
                          : "border-gray-200 text-gray-500 dark:border-gray-700"
                      }`}
                    >
                      ({p[0]}, {p[1]})
                    </button>
                  ))}
                </div>

                <Scroller>
                  <table className="w-full min-w-[300px] border-collapse text-[12px]">
                    <thead>
                      <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                        <th className="py-1.5 pr-2 font-semibold">경계</th>
                        <th className="py-1.5 pr-2 font-semibold">학습표본</th>
                        <th className="py-1.5 pr-2 font-semibold">마진</th>
                        <th className="py-1.5 font-semibold">미지의 표본</th>
                      </tr>
                    </thead>
                    <tbody>
                      {runs.map((r, i) => (
                        <tr
                          key={r.name}
                          onClick={() => { setSel(i); setOverlay(false); }}
                          className={`cursor-pointer border-b border-gray-100 dark:border-gray-800 ${
                            !overlay && sel === i ? "bg-teal-50 dark:bg-teal-950/40" : ""
                          }`}
                        >
                          <td className="py-1.5 pr-2 font-semibold text-gray-700 dark:text-gray-200">{r.name}</td>
                          <td className="py-1.5 pr-2 text-gray-600 dark:text-gray-300">
                            {countCorrect(r.bd, "setosa")}/150
                          </td>
                          <td className="py-1.5 pr-2 font-mono text-gray-600 dark:text-gray-300">
                            {fmt(margin(r.bd), 3)}
                          </td>
                          <td className="py-1.5">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                verdicts[i] === 1
                                  ? "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/60 dark:text-fuchsia-200"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-200"
                              }`}
                            >
                              {verdicts[i] === 1 ? "(1) setosa" : "(0) the others"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Scroller>

                <p className="font-mono text-[11.5px] text-gray-500">{cur.eq}</p>
                <p className="text-[12.5px] leading-6 text-gray-600 dark:text-gray-300">{cur.note}</p>

                {split && (
                  <p className="flex items-start gap-1.5 rounded-lg bg-rose-50 p-2.5 text-[12px] leading-6 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200">
                    <AlertTriangle size={13} className="mt-1 shrink-0" />
                    네 경계가 학습표본은 모두 맞히는데, 지금 이 표본에 대해서는 답이 갈립니다. 이것이 일반화
                    오류입니다.
                  </p>
                )}
              </div>
            </div>

            <ComputedNote>
              경계 A는 강의록 실습 결과이고, B·C·D 와 미지의 표본 좌표는 같은 상황을 만들어 보기 위해 이
              페이지에서 고른 예시입니다. ‘마진’은 각 경계에서 가장 가까운 학습표본까지의 거리를 이
              페이지에서 계산한 값입니다.
            </ComputedNote>

            <Hint>
              강의에서는 서포트 벡터 머신처럼 마진이 최대가 되는 경계였다면 좋겠지만, 퍼셉트론의 학습은
              그것을 보장하지 않는다고 짚었습니다. 마진이 0에 가까운 경계일수록 처음 보는 표본에서 어긋날
              가능성이 큽니다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            lecture: "가장 결정적인 문제는 선형 경계가 아닌 문제를 단층 퍼셉트론으로는 해결할 수 없다는 점",
            slides: "정리하기 — 단층 퍼셉트론은 선형 분리가 불가능한 문제를 학습할 수 없다.",
          }}
        >
          <Card>
            <CardTitle>그리고 더 결정적인 한계</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Tag tone="rose">선형 분리가 불가능한 문제는 학습할 수 없음</Tag>
              <Tag tone="rose">배타적 논리합(XOR)도 해결하지 못함</Tag>
            </div>
            <p className="mt-2 text-[12.5px] leading-6 text-gray-600 dark:text-gray-300">
              일반화 오류는 ‘경계를 어디에 긋느냐’의 문제지만, 선형 분리 불가능은 ‘직선으로는 아예 못
              긋는다’는 문제입니다. 앞의 실습에서 versicolor를 골랐을 때 본 그림이 그 경우이고, 2강의
              다층 퍼셉트론과 역전파는 바로 이 지점에서 출발합니다.
            </p>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
