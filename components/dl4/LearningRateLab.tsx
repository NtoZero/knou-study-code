"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import {
  Card,
  CardTitle,
  Formula,
  Hint,
  Slider,
  Chip,
  Scroller,
  fmt,
  num,
  q12,
} from "@/components/dlShared/ui";

/** 강의록 예제: J(x) = x₁² + 2x₂² − x₁x₂,  x(0) = [−5 4]ᵀ */
const J = (x1: number, x2: number) => x1 * x1 + 2 * x2 * x2 - x1 * x2;
const grad = (x1: number, x2: number): [number, number] => [2 * x1 - x2, 4 * x2 - x1];

const START: [number, number] = [-5, 4];
const MAX_T = 40;

const W = 400;
const H = 400;
const CX = W / 2;
const CY = H / 2;
const HALF = 168;

/** 보기 범위는 고정된 사다리에서 고른다 — 같은 입력이면 서버와 브라우저가 같은 값을 쓴다 */
const VIEW_LADDER = [
  7, 12, 24, 60, 160, 600, 3000, 20000, 200000, 2e6, 2e7, 2e8, 2e9, 2e10,
];

function r2(v: number): number {
  return Math.round(v * 100) / 100;
}

/** J(x) = c인 타원 — 이차형식이라 각도마다 반지름을 바로 구할 수 있다 */
function contour(c: number, R: number): string {
  const pts: string[] = [];
  for (let i = 0; i <= 72; i++) {
    const th = (2 * Math.PI * i) / 72;
    const cs = Math.cos(th);
    const sn = Math.sin(th);
    const q = cs * cs + 2 * sn * sn - cs * sn;
    const r = Math.sqrt(c / q);
    pts.push(`${r2(CX + ((r * cs) / R) * HALF)},${r2(CY - ((r * sn) / R) * HALF)}`);
  }
  return pts.join(" ");
}

export default function LearningRateLab() {
  const [eta, setEta] = useState(0.1);
  const [steps, setSteps] = useState(12);

  const path = useMemo(() => {
    const out: [number, number][] = [[q12(START[0]), q12(START[1])]];
    let [a, b] = out[0];
    for (let t = 0; t < MAX_T; t++) {
      const [g1, g2] = grad(a, b);
      a = q12(a - eta * q12(g1));
      b = q12(b - eta * q12(g2));
      if (!Number.isFinite(a) || !Number.isFinite(b)) break;
      out.push([a, b]);
    }
    return out;
  }, [eta]);

  const shown = path.slice(0, Math.min(steps, path.length - 1) + 1);

  const R = useMemo(() => {
    let m = 0;
    for (const [a, b] of shown) m = Math.max(m, Math.abs(a), Math.abs(b));
    return VIEW_LADDER.find((v) => v >= m * 1.12) ?? VIEW_LADDER[VIEW_LADDER.length - 1];
  }, [shown]);

  const sx = (x: number) => r2(CX + (x / R) * HALF);
  const sy = (y: number) => r2(CY - (y / R) * HALF);

  const last = shown[shown.length - 1];
  const lastJ = J(last[0], last[1]);
  const startJ = J(START[0], START[1]);

  const verdict =
    lastJ > startJ * 1.05
      ? { tone: "rose", label: "발산", note: "목적함수의 값이 처음보다 오히려 커짐" }
      : lastJ < 0.01
        ? { tone: "emerald", label: "수렴", note: "최솟값 자리 [0 0]ᵀ에 거의 도달함" }
        : { tone: "amber", label: "아직 가는 중", note: "같은 걸음 수로는 해에 닿지 못함" };

  const tone = {
    rose: "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200",
    emerald: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
    amber: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
  }[verdict.tone];

  return (
    <section id="learning-rate-lab" className="scroll-mt-32">
      <SectionTitle
        title="학습률을 바꾸면 경로가 갈린다"
        subtitle="강의록의 예제를 그대로 돌려 수렴·느림·발산을 눈으로 비교합니다"
      />

      <Sourced
        refs={{
          slides: "1. 경사 하강법의 개념 — 경사 하강법을 이용한 볼록함수의 최적화 (예)",
          lecture: "학습률이 너무 작으면 오래 걸리고, 너무 크면 발산한다고 세 번 돌려 보여 줌",
        }}
      >
        <Card>
          <div className="mb-3 space-y-2">
            <Formula note="x의 초깃값: x(0) = [−5  4]ᵀ">J(x) = x₁² + 2x₂² − x₁x₂</Formula>
            <Formula>∇J(x) = [2x₁ − x₂  4x₂ − x₁]ᵀ</Formula>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-500">강의록의 세 경우</span>
            {[0.01, 0.1, 0.5].map((v) => (
              <Chip key={v} active={Math.abs(eta - v) < 1e-9} onClick={() => setEta(v)}>
                η = {v}
              </Chip>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
            <Scroller>
              <svg
                viewBox={`0 0 ${W} ${H}`}
                width={W}
                className="min-w-[320px] max-w-full"
                role="img"
                aria-label="등고선 위를 지나는 경사 하강 경로"
              >
                <defs>
                  <clipPath id="dl4-lr-clip">
                    <rect x={10} y={10} width={W - 20} height={H - 20} rx={8} />
                  </clipPath>
                </defs>
                <rect x={10} y={10} width={W - 20} height={H - 20} rx={8} className="fill-gray-50 dark:fill-gray-900" />
                <g clipPath="url(#dl4-lr-clip)">
                  {[0.22, 0.4, 0.58, 0.76, 0.92].map((fr) => (
                    <polyline
                      key={fr}
                      points={contour((fr * R) * (fr * R), R)}
                      fill="none"
                      strokeWidth={1.1}
                      className="stroke-sky-300 dark:stroke-sky-800"
                    />
                  ))}

                  {/* 축 */}
                  <line x1={10} y1={CY} x2={W - 10} y2={CY} strokeWidth={1} className="stroke-gray-300 dark:stroke-gray-700" />
                  <line x1={CX} y1={10} x2={CX} y2={H - 10} strokeWidth={1} className="stroke-gray-300 dark:stroke-gray-700" />

                  {shown.map((p, i) =>
                    i === 0 ? null : (
                      <line
                        key={`s${i}`}
                        x1={sx(shown[i - 1][0])}
                        y1={sy(shown[i - 1][1])}
                        x2={sx(p[0])}
                        y2={sy(p[1])}
                        strokeWidth={1.8}
                        className="stroke-rose-500"
                      />
                    ),
                  )}
                  {shown.map((p, i) => (
                    <circle
                      key={`c${i}`}
                      cx={sx(p[0])}
                      cy={sy(p[1])}
                      r={i === 0 ? 5.5 : i === shown.length - 1 ? 5.5 : 2.8}
                      className={
                        i === 0
                          ? "fill-blue-600"
                          : i === shown.length - 1
                            ? "fill-rose-600"
                            : "fill-rose-300 dark:fill-rose-800"
                      }
                    />
                  ))}
                  <circle cx={sx(0)} cy={sy(0)} r={4} className="fill-none stroke-emerald-600" strokeWidth={2} />
                </g>
                <text x={18} y={26} className="fill-gray-400 text-[10px]">
                  보기 범위 ±{R >= 1e6 ? `${R / 1e6}백만` : num(R)}
                </text>
                <text x={W - 16} y={CY - 6} textAnchor="end" className="fill-gray-400 text-[10px]">
                  x₁
                </text>
                <text x={CX + 6} y={22} className="fill-gray-400 text-[10px]">
                  x₂
                </text>
              </svg>
            </Scroller>

            <div className="space-y-3">
              <Slider
                label="학습률 η"
                value={eta}
                min={0.01}
                max={0.6}
                step={0.01}
                onChange={setEta}
                display={fmt(eta, 2)}
              />
              <Slider
                label="업데이트 횟수 t"
                value={steps}
                min={0}
                max={MAX_T}
                step={1}
                onChange={setSteps}
                display={`${steps}`}
              />

              <div className={`rounded-lg p-3 text-[12px] leading-5 ${tone}`}>
                <p className="font-bold">{verdict.label}</p>
                <p className="mt-0.5">{verdict.note}</p>
              </div>

              <Scroller>
                <table className="w-full min-w-[280px] text-left text-[11.5px]">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700">
                      <th className="py-1.5 pr-2 font-semibold">t</th>
                      <th className="py-1.5 pr-2 font-semibold">x(t)</th>
                      <th className="py-1.5 font-semibold">J(x)</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {[0, 1, 2, Math.min(steps, shown.length - 1)]
                      .filter((v, i, arr) => arr.indexOf(v) === i && v < shown.length)
                      .map((t) => (
                        <tr key={t} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-1.5 pr-2 text-gray-500">{t}</td>
                          <td className="py-1.5 pr-2 text-gray-800 dark:text-gray-100">
                            [{fmt(shown[t][0], 3)} {fmt(shown[t][1], 3)}]ᵀ
                          </td>
                          <td className="py-1.5 text-gray-800 dark:text-gray-100">
                            {fmt(J(shown[t][0], shown[t][1]), 3)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </Scroller>

              <Hint>
                파란 점이 초깃값 x(0) = [−5 4]ᵀ, 초록 동그라미가 최솟값 자리입니다. η = 0.5로 두면 경로가
                한 번에 반대편으로 넘어가며 점점 멀어집니다(보기 범위가 자동으로 넓어집니다).
              </Hint>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/60">
            <p className="text-[11px] font-bold text-gray-500">강의록에 적힌 계산 — η = 0.1</p>
            <ul className="mt-1.5 space-y-1 font-mono text-[11.5px] text-gray-700 dark:text-gray-200">
              <li>x(0) = [−5 4]ᵀ → ∇J(x(0)) = [−14 21]ᵀ</li>
              <li>x(1) = [−3.6 1.9]ᵀ → ∇J(x(1)) = [−9.1 11.2]ᵀ</li>
              <li>x(2) = [−2.69 0.78]ᵀ → ∇J(x(2)) = [−6.16 5.81]ᵀ</li>
              <li className="text-gray-400">……</li>
              <li>x(30) = [−0.0161 −0.00665]ᵀ</li>
            </ul>
          </div>
        </Card>
      </Sourced>
    </section>
  );
}
