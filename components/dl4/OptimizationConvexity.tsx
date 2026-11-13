"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Formula, Hint, ComputedNote, Slider, Chip, Scroller, fmt } from "@/components/dlShared/ui";

/** 볼록함수 예시 — 강의록 그림을 이 페이지에서 수식으로 다시 그린 것 */
function convexF(x: number): number {
  return 1.3 * (x - 1) * (x - 1) + 10;
}

/** 볼록함수가 아닌 예시 — 지역 최소치·봉우리·고원이 함께 있는 모양 */
function bumpyF(x: number): number {
  return (
    46 -
    14 * Math.exp(-((x + 4) * (x + 4)) / 0.9) -
    30 * Math.exp(-((x + 1) * (x + 1)) / 0.85) +
    6 * Math.log(1 + Math.exp(2.2 * (x - 4.2))) +
    8 * Math.log(1 + Math.exp(2.2 * (-x - 5.2)))
  );
}

const R = 6.5;
const W = 520;
const H = 260;
const PAD = 26;

function r2(v: number): number {
  return Math.round(v * 100) / 100;
}

export default function OptimizationConvexity() {
  const [convex, setConvex] = useState(true);
  const [a, setA] = useState(-4);
  const [b, setB] = useState(3);

  const f = convex ? convexF : bumpyF;

  const view = useMemo(() => {
    let lo = Infinity;
    let hi = -Infinity;
    for (let i = 0; i <= 200; i++) {
      const x = -R + (2 * R * i) / 200;
      const y = f(x);
      if (y < lo) lo = y;
      if (y > hi) hi = y;
    }
    const pad = (hi - lo) * 0.12;
    return { lo: lo - pad, hi: hi + pad };
  }, [f]);

  const px = (x: number) => r2(PAD + ((x + R) / (2 * R)) * (W - 2 * PAD));
  const py = (y: number) => r2(H - PAD - ((y - view.lo) / (view.hi - view.lo)) * (H - 2 * PAD));

  const curve = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = -R + (2 * R * i) / 200;
      pts.push(`${px(x)},${py(f(x))}`);
    }
    return pts.join(" ");
  }, [f, view]);

  const lo = Math.min(a, b);
  const hi = Math.max(a, b);

  /** 두 점을 잇는 현보다 그 사이의 함수값이 낮게 있는지 — 볼록함수의 정의를 그대로 확인한다 */
  const check = useMemo(() => {
    if (hi - lo < 0.2) return { ok: true, worstX: lo, gap: 0 };
    const fa = f(lo);
    const fb = f(hi);
    let worstX = lo;
    let gap = 0;
    for (let i = 1; i < 120; i++) {
      const t = i / 120;
      const x = lo + (hi - lo) * t;
      const chord = fa + (fb - fa) * t;
      const d = f(x) - chord;
      if (d > gap) {
        gap = d;
        worstX = x;
      }
    }
    return { ok: gap <= 0.001, worstX, gap };
  }, [f, lo, hi]);

  return (
    <section id="optimization-convexity" className="scroll-mt-32">
      <SectionTitle
        title="최적화 문제와 볼록함수"
        subtitle="딥러닝의 학습은 손실함수를 최소화하는 최적화 문제입니다"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "1. 경사 하강법의 개념 — 딥러닝의 목적",
            lecture: "손실함수를 최소화하는 문제로 이해하면 된다고 짚음",
          }}
        >
          <Card>
            <CardTitle>딥러닝의 목적 — 최적화 문제</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              설계한 모델이 주어진 문제에 대해 최대한 정확한 추론을 할 수 있도록 학습하는 것. 학습 표본
              집합을 이용하여 모델의 <strong>파라미터</strong>(연결 가중치, 바이어스 등)가 최적의 값이
              되게 조정하는 훈련을 수행.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-rose-100 bg-rose-50/60 p-3 dark:border-rose-900/60 dark:bg-rose-950/30">
                <p className="text-[11px] font-bold text-rose-700 dark:text-rose-300">
                  최적화 문제(optimization problem)
                </p>
                <p className="mt-1 text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                  목적함수(objective function)를 최적화하는 파라미터를 결정하는 문제.
                </p>
              </div>
              <div className="rounded-lg border border-rose-100 bg-rose-50/60 p-3 dark:border-rose-900/60 dark:bg-rose-950/30">
                <p className="text-[11px] font-bold text-rose-700 dark:text-rose-300">딥러닝에서는</p>
                <p className="mt-1 text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                  훈련 데이터 집합에 대한 <strong>손실함수(loss function)를 최소화</strong>하는 문제.
                </p>
              </div>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "1. 경사 하강법의 개념 — 볼록 최적화(convex optimization)",
            lecture: "두 점을 이은 선보다 그 사이의 함수값이 아래에 있으면 볼록함수라고 설명",
          }}
        >
          <Card>
            <CardTitle>볼록 최적화 — 두 점을 이어 보고 판정하기</CardTitle>
            <p className="mb-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              목적함수가 <strong>볼록함수(convex function)</strong>이고 해를 찾기 위한 정의역이{" "}
              <strong>볼록집합(convex set)</strong>인 최적화 문제. 볼록 최적화라면 경사 하강법으로 해를
              구할 수 있음.
            </p>

            <div className="mb-3 flex flex-wrap gap-2">
              <Chip active={convex} onClick={() => setConvex(true)}>
                볼록함수
              </Chip>
              <Chip active={!convex} onClick={() => setConvex(false)}>
                볼록함수가 아닌 함수
              </Chip>
            </div>

            <Scroller>
              <svg
                viewBox={`0 0 ${W} ${H}`}
                width={W}
                className="min-w-[460px] max-w-full"
                role="img"
                aria-label="두 점을 이은 현과 함수 곡선의 비교"
              >
                <rect
                  x={PAD}
                  y={PAD - 14}
                  width={W - 2 * PAD}
                  height={H - 2 * PAD + 14}
                  className="fill-gray-50 dark:fill-gray-900"
                  rx={6}
                />
                <polyline
                  points={curve}
                  fill="none"
                  strokeWidth={2.2}
                  className="stroke-sky-500"
                />

                {/* 두 점을 잇는 현 */}
                <line
                  x1={px(lo)}
                  y1={py(f(lo))}
                  x2={px(hi)}
                  y2={py(f(hi))}
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  className={check.ok ? "stroke-emerald-500" : "stroke-rose-500"}
                />
                {!check.ok && (
                  <line
                    x1={px(check.worstX)}
                    y1={py(f(check.worstX))}
                    x2={px(check.worstX)}
                    y2={py(
                      f(lo) + ((f(hi) - f(lo)) * (check.worstX - lo)) / Math.max(hi - lo, 1e-6),
                    )}
                    strokeWidth={2}
                    className="stroke-rose-500"
                  />
                )}
                <circle cx={px(lo)} cy={py(f(lo))} r={5} className="fill-gray-700 dark:fill-gray-200" />
                <circle cx={px(hi)} cy={py(f(hi))} r={5} className="fill-gray-700 dark:fill-gray-200" />
                <text x={px(lo)} y={py(f(lo)) - 10} textAnchor="middle" className="fill-gray-500 text-[11px]">
                  x₁
                </text>
                <text x={px(hi)} y={py(f(hi)) - 10} textAnchor="middle" className="fill-gray-500 text-[11px]">
                  x₂
                </text>
              </svg>
            </Scroller>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Slider
                label="x₁"
                value={a}
                min={-6}
                max={6}
                step={0.1}
                onChange={setA}
                display={fmt(a, 1)}
              />
              <Slider
                label="x₂"
                value={b}
                min={-6}
                max={6}
                step={0.1}
                onChange={setB}
                display={fmt(b, 1)}
              />
            </div>

            <div
              className={`mt-3 rounded-lg p-3 text-[12px] leading-5 ${
                check.ok
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                  : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
              }`}
            >
              {check.ok ? (
                <>
                  두 점 사이의 함수값이 모두 현보다 <strong>아래</strong>에 있음 — 이 구간에서는 볼록함수의
                  조건을 만족.
                </>
              ) : (
                <>
                  현보다 <strong>위로 올라오는 구간</strong>이 있음(최대 {fmt(check.gap, 2)}만큼). 어느 두
                  점에서든 성립해야 볼록함수인데, 이 두 점이 반례가 됨.
                </>
              )}
            </div>

            <Hint>
              아래쪽 그래프에서 x₁·x₂를 아무 데나 잡아도 현 아래에 함수가 있어야 볼록함수. 오른쪽 탭의
              함수는 어떤 두 점을 잡으면 반례가 나옴.
            </Hint>
            <ComputedNote>
              화면의 두 곡선은 강의록 그림을 이 페이지에서 수식으로 다시 그린 예시입니다. 강의록에 적힌
              식이 아닙니다.
            </ComputedNote>
          </Card>
        </Sourced>

        <Sourced refs={{ slides: "1. 경사 하강법의 개념 — 경사 하강법을 이용한 볼록함수의 최적화" }}>
          <Card>
            <CardTitle>풀려는 문제</CardTitle>
            <p className="mb-2 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              실함수인 목적함수 <strong>J</strong>가 최소가 되는 파라미터 <strong>x*</strong> 구하기.
            </p>
            <Formula note="J는 d차원 실수 공간의 점을 하나의 실수로 보내는 함수">
              J : ℝᵈ → ℝ
            </Formula>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
