"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import {
  complexityLinear,
  complexityNonlinear,
  complexityTestDifferent,
  complexityTestSimilar,
  complexityTrain,
} from "./svmData";
import {
  C1_COLOR,
  C2_COLOR,
  ERR_COLOR,
  clipLine,
  fmt,
  halfPlanePolygon,
  makeScale,
  signed,
  type Frame,
} from "./plotUtils";
import type { Vec } from "./svmCore";

type Labeled = [number, number, 1 | -1];

const PANELS: {
  key: string;
  tag: string;
  title: string;
  kind: "학습 오차" | "일반화 오차";
  data: Labeled[];
  note: string;
}[] = [
  {
    key: "a",
    tag: "(a)",
    title: "학습 데이터",
    kind: "학습 오차",
    data: complexityTrain,
    note: "비선형 분류기는 학습 데이터를 완벽히 분류해 학습 오차가 없고, 선형 분류기는 학습 데이터를 제대로 분류하지 못해 학습 오차가 발생함.",
  },
  {
    key: "b",
    tag: "(b)",
    title: "학습에 사용되지 않은 데이터 ①",
    kind: "일반화 오차",
    data: complexityTestSimilar,
    note: "앞으로 주어질 데이터가 이런 분포라면 비선형 분류기가 일반화 오차도 작음.",
  },
  {
    key: "c",
    tag: "(c)",
    title: "학습에 사용되지 않은 데이터 ②",
    kind: "일반화 오차",
    data: complexityTestDifferent,
    note: "이런 분포라면 오히려 복잡도가 높은 비선형 분류기가 더 큰 일반화 오차를 가짐 — 학습 데이터가 전체 분포를 제대로 표현하지 못하는데 학습 데이터만 잘 분류하도록 과다하게 학습했기 때문.",
  },
];

const CF: Frame = { xMin: 0, xMax: 10, yMin: 0, yMax: 6, width: 300, height: 190, pad: 10 };
const cs = makeScale(CF);

const linearPath = `M${cs.sx(0)},${cs.sy(complexityLinear(0))} L${cs.sx(10)},${cs.sy(complexityLinear(10))}`;
const nonlinearPath = Array.from({ length: 101 }, (_, i) => {
  const x = (i / 100) * 10;
  const y = Math.max(CF.yMin, Math.min(CF.yMax, complexityNonlinear(x)));
  return `${i === 0 ? "M" : "L"}${cs.sx(x).toFixed(1)},${cs.sy(y).toFixed(1)}`;
}).join(" ");

/** 경계 위쪽이면 C₁(+1)로 판정 */
const judgeLinear = (p: Labeled) => (p[1] > complexityLinear(p[0]) ? 1 : -1);
const judgeNonlinear = (p: Labeled) => (p[1] > complexityNonlinear(p[0]) ? 1 : -1);

/* ─────────── 선형 초평면 판별함수 실습 ─────────── */

const HF: Frame = { xMin: 0, xMax: 8, yMin: 0, yMax: 6, width: 320, height: 240, pad: 14 };
const hs = makeScale(HF);

export default function LinearClassifier() {
  const [highlight, setHighlight] = useState<"linear" | "nonlinear">("linear");
  const [w1, setW1] = useState(-0.5);
  const [w2, setW2] = useState(1);
  const [w0, setW0] = useState(-1.5);
  const [probe, setProbe] = useState<Vec>([5.5, 4.5]);

  const counts = useMemo(
    () =>
      PANELS.map((p) => ({
        linear: p.data.filter((d) => judgeLinear(d) !== d[2]).length,
        nonlinear: p.data.filter((d) => judgeNonlinear(d) !== d[2]).length,
      })),
    [],
  );

  const w: Vec = [w1, w2];
  const wNorm = Math.hypot(w1, w2);
  const g = w1 * probe[0] + w2 * probe[1] + w0;
  const line = wNorm > 1e-9 ? clipLine(w, w0, HF) : null;
  const region = wNorm > 1e-9 ? halfPlanePolygon(w, w0, HF) : [];
  // 법선 벡터 화살표 — 결정경계 위, 그림 중앙에서 가장 가까운 점에서 출발
  const center: Vec = [4, 3];
  const gc = w1 * center[0] + w2 * center[1] + w0;
  const foot: Vec =
    wNorm > 1e-9 ? [center[0] - (gc * w1) / wNorm ** 2, center[1] - (gc * w2) / wNorm ** 2] : center;
  const arrowLen = 1.3;
  const tip: Vec =
    wNorm > 1e-9 ? [foot[0] + (arrowLen * w1) / wNorm, foot[1] + (arrowLen * w2) / wNorm] : foot;

  const onPlotClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const m = svg.getScreenCTM();
    if (!m) return;
    const p = pt.matrixTransform(m.inverse());
    const [x, y] = hs.inv(p.x, p.y);
    setProbe([
      Math.max(HF.xMin, Math.min(HF.xMax, Number(x.toFixed(1)))),
      Math.max(HF.yMin, Math.min(HF.yMax, Number(y.toFixed(1)))),
    ]);
  };

  return (
    <section>
      <SectionTitle
        title="10.1 선형 분류기"
        subtitle="학습 시스템의 복잡도와 일반화 오차의 관계에서 출발해, SVM이 왜 선형 분류기로 설계를 시작하는지 확인"
      />

      <Sourced
        refs={{
          textbook: "10.1.1 과다적합과 일반화 오차",
          slides: "학습 시스템의 복잡도와 일반화 오차의 관계",
          lecture: "학습 오차만 보면 비선형이 낫지만, 학습에 쓰지 않은 데이터에서는 6:10으로 뒤집힐 수 있다는 점을 짚음",
        }}
        className="mb-8"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">학습 시스템의 복잡도와 일반화 오차의 관계</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            두 클래스(● C₁, ○ C₂)를 나누는 문제. 낮은 복잡도의{" "}
            <strong className="text-indigo-600 dark:text-indigo-300">선형 분류기(실선)</strong>와 높은
            복잡도의 <strong className="text-rose-600 dark:text-rose-300">비선형 분류기(점선)</strong>를
            같은 결정경계 그대로 세 데이터 집합에 적용해 틀린 개수를 셈.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["linear", "선형 분류기의 오류 표시"],
                ["nonlinear", "비선형 분류기의 오류 표시"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setHighlight(k)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  highlight === k
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            {PANELS.map((p, pi) => {
              const judge = highlight === "linear" ? judgeLinear : judgeNonlinear;
              return (
                <div
                  key={p.key}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-2 dark:border-gray-800 dark:bg-gray-800/40"
                >
                  <p className="px-1 text-xs font-bold text-gray-600 dark:text-gray-300">
                    {p.tag} {p.title}
                  </p>
                  <svg viewBox={`0 0 ${CF.width} ${CF.height}`} className="mt-1 w-full rounded">
                    <rect x={0} y={0} width={CF.width} height={CF.height} fill="#ffffff" />
                    <rect
                      x={CF.pad}
                      y={CF.pad}
                      width={CF.width - 2 * CF.pad}
                      height={CF.height - 2 * CF.pad}
                      fill="none"
                      stroke="#cbd5e1"
                    />
                    <path d={linearPath} stroke={C1_COLOR} strokeWidth="2" fill="none" />
                    <path
                      d={nonlinearPath}
                      stroke="#e11d48"
                      strokeWidth="2"
                      strokeDasharray="5 3"
                      fill="none"
                    />
                    {p.data.map((d, i) => {
                      const wrong = judge(d) !== d[2];
                      return (
                        <g key={i}>
                          {wrong && (
                            <circle
                              cx={cs.sx(d[0])}
                              cy={cs.sy(d[1])}
                              r={8}
                              fill="none"
                              stroke={ERR_COLOR}
                              strokeWidth="1.8"
                            />
                          )}
                          <circle
                            cx={cs.sx(d[0])}
                            cy={cs.sy(d[1])}
                            r={3.8}
                            fill={d[2] === 1 ? "#1e293b" : "#ffffff"}
                            stroke="#1e293b"
                            strokeWidth="1.2"
                          />
                        </g>
                      );
                    })}
                  </svg>
                  <div className="mt-1 flex items-baseline justify-between px-1">
                    <span className="text-[11px] text-gray-500">{p.kind} (선형 : 비선형)</span>
                    <span className="font-mono text-lg font-bold">
                      <span className="text-indigo-600 dark:text-indigo-300">{counts[pi].linear}</span>
                      <span className="text-gray-400"> : </span>
                      <span className="text-rose-600 dark:text-rose-300">{counts[pi].nonlinear}</span>
                    </span>
                  </div>
                  <p className="mt-1 px-1 text-[11px] leading-relaxed text-gray-600 dark:text-gray-400">
                    {p.note}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border-l-4 border-rose-500 bg-rose-50 p-3 dark:bg-rose-950/30">
              <p className="text-sm font-bold text-rose-700 dark:text-rose-300">과다적합</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                학습이 과다하게 일어나서 일반화 성능이 저하되는 현상. (c)에서 비선형 분류기가 더 큰
                일반화 오차를 가진 원인.
              </p>
            </div>
            <div className="rounded-lg border-l-4 border-indigo-500 bg-indigo-50 p-3 dark:bg-indigo-950/30">
              <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">결론</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                과다학습을 피하고 일반화 오차를 줄이기 위해서는{" "}
                <strong>학습 시스템의 복잡도를 적절히 조정</strong>하는 것이 매우 중요. SVM은 이
                관점에서 선형 분류기를 사용하는 것에서 학습 시스템의 설계를 시작함.
              </p>
            </div>
          </div>
        </div>
      </Sourced>

      <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
        <Sourced
          refs={{ textbook: "10.1.2 선형 초평면 분류기", slides: "선형 초평면 분류기 — 선형 분류기" }}
        >
          <div className="h-full rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/40">
            <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">선형 분류기</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              <strong>선형 판별함수를 기반으로 분류를 수행하는 분류기(학습 시스템).</strong> SVM은
              기본적으로 선형 분류기를 사용함.
            </p>
          </div>
        </Sourced>
        <Sourced
          refs={{
            textbook: "10.1.2 선형 초평면 분류기",
            slides: "선형 초평면 분류기 — 특징",
            lecture: "선형 분류기는 표현할 수 있는 결정경계가 직선뿐이라 성능은 떨어지지만 과다적합을 피할 수 있다는 장단점을 짝지어 설명",
          }}
        >
          <div className="h-full rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-bold">특징 — 장점과 단점</p>
            <ul className="mt-1 space-y-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              <li>− 학습 시스템의 분류 복잡도가 가장 낮은 분류기</li>
              <li>− 표현할 수 있는 결정경계에 제약이 많아 분류 성능 측면에서 좋은 결과를 기대하기 힘듦</li>
              <li>+ 과다적합의 문제를 피할 수 있음</li>
            </ul>
          </div>
        </Sourced>
        <Sourced
          refs={{
            textbook: "10.1.1 과다적합과 일반화 오차 · 10.1.2 선형 초평면 분류기",
            slides: "선형 초평면 분류기 — SVM 등장",
          }}
        >
          <div className="h-full rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-bold">서포트 벡터 머신(SVM)의 등장</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              <strong>일반화 오차를 최소화할 수 있는 방향으로 학습이 이루어지도록 설계된 선형
              분류기.</strong> 선형 분류기의 장점을 취해 기본적인 선형 분류기에서 논의를 시작하고,
              추후 커널법으로 표현 능력의 제약을 해결해 복잡한 결정경계를 가진 문제로 확장됨.
            </p>
          </div>
        </Sourced>
      </div>

      <Sourced
        refs={{
          textbook: "10.1.2 선형 초평면 분류기 (식 10-1, 10-2)",
          slides: "선형 초평면 분류기 — 판별함수와 결정규칙",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">선형 초평면 판별함수와 결정규칙</h3>
          <div className="mt-3 overflow-x-auto rounded-lg bg-indigo-50 p-3 dark:bg-indigo-950/40">
            <p className="min-w-[340px] font-mono text-sm">
              g(x) = w·x + w₀ = wᵀx + w₀ = Σ<sub>i=1</sub>
              <sup>n</sup> wᵢxᵢ + w₀ <span className="ml-2 text-xs text-gray-500">(식 10-1)</span>
            </p>
            <p className="mt-1 min-w-[340px] font-mono text-sm">
              f(x) = sign(g(x)) → f(x) = 1이면 x ∈ C₁, f(x) = −1이면 x ∈ C₂{" "}
              <span className="ml-2 text-xs text-gray-500">(식 10-2)</span>
            </p>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            슬라이더로 w₁, w₂, w₀를 바꾸고 그림을 눌러 점 x를 옮겨 보기. 색칠된 쪽이 g(x) &gt; 0인
            C₁ 영역, 화살표가 w.
          </p>

          <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
            <div>
              <svg
                viewBox={`0 0 ${HF.width} ${HF.height}`}
                className="w-full cursor-crosshair rounded-lg border border-gray-100 bg-white dark:border-gray-800"
                onClick={onPlotClick}
              >
                {region.length > 2 && (
                  <polygon
                    points={region.map((p) => `${hs.sx(p[0])},${hs.sy(p[1])}`).join(" ")}
                    fill={C1_COLOR}
                    opacity={0.08}
                  />
                )}
                {Array.from({ length: 9 }, (_, i) => (
                  <text key={`xt${i}`} x={hs.sx(i)} y={HF.height - 2} fontSize="8" textAnchor="middle" fill="#94a3b8">
                    {i}
                  </text>
                ))}
                {Array.from({ length: 7 }, (_, i) => (
                  <text key={`yt${i}`} x={4} y={hs.sy(i) + 3} fontSize="8" fill="#94a3b8">
                    {i}
                  </text>
                ))}
                <rect
                  x={HF.pad}
                  y={HF.pad}
                  width={HF.width - 2 * HF.pad}
                  height={HF.height - 2 * HF.pad}
                  fill="none"
                  stroke="#cbd5e1"
                />
                {line && (
                  <line
                    x1={hs.sx(line[0][0])}
                    y1={hs.sy(line[0][1])}
                    x2={hs.sx(line[1][0])}
                    y2={hs.sy(line[1][1])}
                    stroke={C1_COLOR}
                    strokeWidth="2.2"
                  />
                )}
                {wNorm > 1e-9 && (
                  <g>
                    <defs>
                      <marker id="ml8-arrow-w" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                        <path d="M0,0 L8,4 L0,8 z" fill="#0f172a" />
                      </marker>
                    </defs>
                    <line
                      x1={hs.sx(foot[0])}
                      y1={hs.sy(foot[1])}
                      x2={hs.sx(tip[0])}
                      y2={hs.sy(tip[1])}
                      stroke="#0f172a"
                      strokeWidth="1.8"
                      markerEnd="url(#ml8-arrow-w)"
                    />
                    <text x={hs.sx(tip[0]) + 4} y={hs.sy(tip[1]) - 4} fontSize="11" fontWeight="bold" fill="#0f172a">
                      w
                    </text>
                  </g>
                )}
                <circle
                  cx={hs.sx(probe[0])}
                  cy={hs.sy(probe[1])}
                  r={6}
                  fill={g > 0 ? C1_COLOR : g < 0 ? C2_COLOR : "#64748b"}
                  stroke="#fff"
                  strokeWidth="1.5"
                />
                <text x={hs.sx(probe[0]) + 8} y={hs.sy(probe[1]) - 6} fontSize="10" fill="#334155">
                  x ({probe[0]}, {probe[1]})
                </text>
              </svg>
            </div>

            <div className="space-y-3">
              {(
                [
                  ["w₁", w1, setW1, -2, 2, 0.1],
                  ["w₂", w2, setW2, -2, 2, 0.1],
                  ["w₀", w0, setW0, -8, 8, 0.5],
                ] as const
              ).map(([label, value, set, min, max, step]) => (
                <label key={label} className="flex items-center gap-3 text-sm">
                  <span className="w-8 font-mono font-bold">{label}</span>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => set(Number(e.target.value))}
                    className="min-w-0 flex-1 accent-indigo-600"
                  />
                  <span className="w-12 text-right font-mono">{fmt(value, 1)}</span>
                </label>
              ))}

              <div className="overflow-x-auto rounded-lg bg-gray-50 p-3 font-mono text-xs leading-6 dark:bg-gray-800/60">
                <p className="min-w-[280px]">
                  g(x) = w₁x₁ + w₂x₂ + w₀
                </p>
                <p className="min-w-[280px]">
                  = ({fmt(w1, 1)})({probe[0]}) + ({fmt(w2, 1)})({probe[1]}) {signed(w0, 1)}
                </p>
                <p className="min-w-[280px] font-bold">= {fmt(g, 2)}</p>
                <p className="min-w-[280px]">
                  f(x) = sign({fmt(g, 2)}) ={" "}
                  <span className={g > 0 ? "text-indigo-600 dark:text-indigo-300" : "text-amber-600"}>
                    {g > 0 ? "1 → C₁" : g < 0 ? "−1 → C₂" : "0 (결정경계 위)"}
                  </span>
                </p>
              </div>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                n = 2이면 판별함수 w₁x₁ + w₂x₂ + w₀ = 0은 직선의 방정식. 3차원이면 평면, 그
                이상에서는 초평면이 결정경계가 됨. w는 결정경계에 수직인 법선 벡터여서 w의 방향을 바꾸면
                경계가 회전하고, w₀만 바꾸면 기울기는 그대로인 채 경계가 평행 이동함.
              </p>
            </div>
          </div>
        </div>
      </Sourced>

      <Sourced
        refs={{
          textbook: "10.1.2 선형 초평면 분류기 (그림 10-2)",
          slides: "선형 초평면 분류기 — 최소 학습 오차를 만족하는 선형 결정경계",
        }}
        className="mt-6"
      >
        <div className="rounded-xl border-l-4 border-indigo-500 bg-indigo-50 p-4 dark:bg-indigo-950/40">
          <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
            최소 학습 오차를 만족하는 선형 결정경계는? → 매우 많이 존재
          </p>
          <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            선형 분리가 가능한 학습 데이터에서는 모든 데이터를 바르게 분류하는 결정경계가 매우 많음.
            학습 오차만 고려하면 모두 같은 성능이지만 일반화 오차까지 고려하면 성능이 달라질 수 있음.
            그래서 SVM은 여러 선형 결정경계 중 일반화 오차를 최소로 하는 최적의 경계를 찾기 위해{" "}
            <strong>마진(margin)</strong>의 개념을 도입하여 학습의 목적함수를 정의함 — 다음 절에서
            직접 확인.
          </p>
        </div>
      </Sourced>
    </section>
  );
}
