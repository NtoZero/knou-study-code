"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import {
  Card,
  CardTitle,
  Hint,
  ComputedNote,
  Slider,
  Chip,
  Scroller,
  Tag,
  fmt,
  q12,
} from "@/components/dlShared/ui";

const sig = (z: number) => 1 / (1 + Math.exp(-z));

/** 지역 최소치·봉우리·고원이 한 그림에 들어가도록 이 페이지에서 만든 예시 함수 */
const f = (x: number) =>
  3.0 -
  1.15 * Math.exp(-((x + 4) * (x + 4)) / 0.9) -
  2.45 * Math.exp(-((x + 1) * (x + 1)) / 0.85) +
  0.45 * Math.log(1 + Math.exp(2.2 * (x - 4.2))) +
  0.6 * Math.log(1 + Math.exp(2.2 * (-x - 5.2)));

const df = (x: number) =>
  1.15 * ((2 * (x + 4)) / 0.9) * Math.exp(-((x + 4) * (x + 4)) / 0.9) +
  2.45 * ((2 * (x + 1)) / 0.85) * Math.exp(-((x + 1) * (x + 1)) / 0.85) +
  0.45 * 2.2 * sig(2.2 * (x - 4.2)) -
  0.6 * 2.2 * sig(2.2 * (-x - 5.2));

const STARTS = [
  { id: 1, x0: -2.2, label: "①", outcome: "전역 최소치에 도달" },
  { id: 2, x0: -5.5, label: "②", outcome: "지역 최소치에 갇힘" },
  { id: 3, x0: 5.5, label: "③", outcome: "고원에서 거의 움직이지 못함" },
];

const W = 560;
const H = 280;
const PAD = 30;
const R_LO = -6.5;
const R_HI = 6.5;
const Y_LO = 0.1;
const Y_HI = 5.6;

function r2(v: number): number {
  return Math.round(v * 100) / 100;
}
const px = (x: number) => r2(PAD + ((x - R_LO) / (R_HI - R_LO)) * (W - 2 * PAD));
const py = (y: number) => r2(H - PAD - ((y - Y_LO) / (Y_HI - Y_LO)) * (H - 2 * PAD));

export default function NonconvexTraps() {
  const [pick, setPick] = useState(2);
  const [steps, setSteps] = useState(80);
  const [saddleAxis, setSaddleAxis] = useState<"x" | "y">("x");

  const start = STARTS.find((s) => s.id === pick) ?? STARTS[1];

  const path = useMemo(() => {
    const out = [q12(start.x0)];
    let x = out[0];
    for (let t = 0; t < 120; t++) {
      x = q12(x - 0.35 * q12(df(x)));
      out.push(x);
    }
    return out;
  }, [start.x0]);

  const shown = path.slice(0, steps + 1);
  const cur = shown[shown.length - 1];

  const curve = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 260; i++) {
      const x = R_LO + ((R_HI - R_LO) * i) / 260;
      pts.push(`${px(x)},${py(f(x))}`);
    }
    return pts.join(" ");
  }, []);

  // 안장점 단면 — g(x, y) = x² − y², 원점에서 두 편미분 모두 0
  const saddleCurve = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const t = -2 + (4 * i) / 60;
      const v = saddleAxis === "x" ? t * t : -t * t;
      pts.push(`${r2(20 + ((t + 2) / 4) * 200)},${r2(70 - v * 13)}`);
    }
    return pts.join(" ");
  }, [saddleAxis]);

  return (
    <section id="nonconvex-traps" className="scroll-mt-32">
      <SectionTitle
        title="볼록함수가 아니면 무슨 일이 생기나"
        subtitle="초깃값이 어디냐에 따라 도착지가 달라집니다"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "1. 경사 하강법의 개념 — 경사 하강법(gradient descent)",
            lecture: "초깃값 ①②③ 세 곳에서 출발시켜 각각 어디에 멈추는지 보여 줌",
          }}
        >
          <Card>
            <CardTitle>초깃값을 바꿔 출발시켜 보기</CardTitle>
            <p className="mb-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              목적함수가 볼록함수가 아니라면 경사 하강법이 최적화의 성공을 보장할 수 없음. 초깃값은 보통
              랜덤하게 정하므로, 어디서 출발하느냐에 따라 결과가 갈림.
            </p>

            <div className="mb-3 flex flex-wrap gap-2">
              {STARTS.map((s) => (
                <Chip
                  key={s.id}
                  active={pick === s.id}
                  onClick={() => {
                    setPick(s.id);
                    setSteps(80);
                  }}
                >
                  {s.label} 초깃값 {s.x0}
                </Chip>
              ))}
            </div>

            <Scroller>
              <svg
                viewBox={`0 0 ${W} ${H}`}
                width={W}
                className="min-w-[500px] max-w-full"
                role="img"
                aria-label="지역 최소치와 고원이 있는 함수 위의 경사 하강 경로"
              >
                <rect
                  x={PAD}
                  y={PAD - 18}
                  width={W - 2 * PAD}
                  height={H - 2 * PAD + 18}
                  rx={6}
                  className="fill-gray-50 dark:fill-gray-900"
                />
                <polyline points={curve} fill="none" strokeWidth={2.2} className="stroke-gray-500" />

                {/* 지형 이름표 */}
                {[
                  { x: -3.97, t: "지역 최소치" },
                  { x: -1.08, t: "전역 최소치" },
                  { x: 2.6, t: "고원" },
                ].map((m) => (
                  <g key={m.t}>
                    <line
                      x1={px(m.x)}
                      y1={py(f(m.x))}
                      x2={px(m.x)}
                      y2={H - PAD}
                      strokeWidth={1}
                      strokeDasharray="4 3"
                      className="stroke-gray-400"
                    />
                    <text
                      x={px(m.x)}
                      y={H - PAD + 14}
                      textAnchor="middle"
                      className="fill-gray-500 text-[10.5px]"
                    >
                      {m.t}
                    </text>
                  </g>
                ))}

                {shown.map((x, i) =>
                  i === 0 ? null : (
                    <line
                      key={`s${i}`}
                      x1={px(shown[i - 1])}
                      y1={py(f(shown[i - 1]))}
                      x2={px(x)}
                      y2={py(f(x))}
                      strokeWidth={2}
                      className="stroke-rose-400"
                    />
                  ),
                )}
                {shown.map((x, i) => (
                  <circle
                    key={`c${i}`}
                    cx={px(x)}
                    cy={py(f(x))}
                    r={i === 0 || i === shown.length - 1 ? 5.5 : 2.4}
                    className={
                      i === 0
                        ? "fill-emerald-600"
                        : i === shown.length - 1
                          ? "fill-rose-600"
                          : "fill-rose-300 dark:fill-rose-800"
                    }
                  />
                ))}
                <text
                  x={px(start.x0)}
                  y={py(f(start.x0)) - 12}
                  textAnchor="middle"
                  className="fill-emerald-700 text-[12px] font-bold dark:fill-emerald-300"
                >
                  {start.label}
                </text>
                <text x={PAD + 6} y={PAD - 4} className="fill-gray-400 text-[10px]">
                  J(x)
                </text>
              </svg>
            </Scroller>

            <div className="mt-3">
              <Slider
                label="이동 횟수"
                value={steps}
                min={0}
                max={120}
                step={1}
                onChange={setSteps}
                display={`${steps}`}
              />
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800">
                <p className="text-[10.5px] font-semibold text-gray-500">현재 x</p>
                <p className="font-mono text-sm font-bold text-gray-800 dark:text-gray-100">
                  {fmt(cur, 3)}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800">
                <p className="text-[10.5px] font-semibold text-gray-500">경사 ∇J</p>
                <p className="font-mono text-sm font-bold text-gray-800 dark:text-gray-100">
                  {fmt(q12(df(cur)), 4)}
                </p>
              </div>
              <div className="rounded-lg bg-rose-50 p-2.5 dark:bg-rose-950/40">
                <p className="text-[10.5px] font-semibold text-rose-700 dark:text-rose-300">결과</p>
                <p className="text-[12px] font-bold text-rose-800 dark:text-rose-200">
                  {start.outcome}
                </p>
              </div>
            </div>

            <Hint>
              ③에서는 경사가 거의 0이라 이동량도 거의 0 — 120번을 돌려도 제자리에 가깝습니다. 무한히
              반복하면 언젠가 빠져나오겠지만 너무 오래 걸려 해에 도달하지 못할 위험이 있음.
            </Hint>
            <ComputedNote>
              이 곡선과 초깃값 세 곳, 이동 횟수는 강의록 그림의 상황을 재현하려고 이 페이지에서 정한
              값입니다.
            </ComputedNote>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "1. 경사 하강법의 개념 — 경사 하강법의 문제점",
            lecture: "안장점은 한 방향에서는 극소점, 다른 방향에서는 극대점이라 말 안장처럼 생겼다고 설명",
          }}
        >
          <Card>
            <CardTitle>편미분이 0인데 최적해가 아닌 자리</CardTitle>
            <p className="mb-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              모든 파라미터에 대한 목적함수의 편미분이 0이지만 전역 최소치에 해당되지 않는 파라미터 값인
              경우 — <strong>지역 최소치(local minima)</strong>와 <strong>안장점(saddle point)</strong>.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="mb-1 text-[11.5px] font-bold text-gray-700 dark:text-gray-200">
                  지역 최소치
                </p>
                <p className="text-[12px] leading-5 text-gray-600 dark:text-gray-300">
                  편미분이 0이라 더 이상 움직이지 못하지만, 다른 곳에 더 좋은 해가 따로 있음.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="mb-2 text-[11.5px] font-bold text-gray-700 dark:text-gray-200">
                  안장점 — 방향을 바꿔 잘라 보기
                </p>
                <div className="mb-2 flex gap-2">
                  <Chip active={saddleAxis === "x"} onClick={() => setSaddleAxis("x")}>
                    x₁ 방향
                  </Chip>
                  <Chip active={saddleAxis === "y"} onClick={() => setSaddleAxis("y")}>
                    x₂ 방향
                  </Chip>
                </div>
                <svg viewBox="0 0 240 110" width="240" className="w-full max-w-[240px]" role="img" aria-label="안장점의 단면">
                  <rect x={10} y={10} width={220} height={90} rx={6} className="fill-gray-50 dark:fill-gray-900" />
                  <line x1={10} y1={70} x2={230} y2={70} strokeWidth={1} className="stroke-gray-300 dark:stroke-gray-700" />
                  <polyline points={saddleCurve} fill="none" strokeWidth={2.2} className="stroke-rose-500" />
                  <circle cx={120} cy={70} r={4.5} className="fill-rose-600" />
                </svg>
                <p className="mt-1 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  같은 점인데 {saddleAxis === "x" ? "이 방향에서는 극소점" : "이 방향에서는 극대점"}.
                  두 방향 모두 편미분은 0.
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Tag tone="rose">목적함수가 볼록함수가 아니라면 해의 탐색에 실패할 수 있음</Tag>
            </div>
            <ComputedNote>
              안장점 단면은 g(x₁, x₂) = x₁² − x₂²를 이 페이지에서 잘라 그린 것입니다.
            </ComputedNote>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
