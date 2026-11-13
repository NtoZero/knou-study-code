"use client";

import { useMemo, useState } from "react";
import { Play, RotateCcw, StepForward } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import {
  Card,
  CardTitle,
  Formula,
  Hint,
  ComputedNote,
  Slider,
  Scroller,
  Tag,
  fmt,
  q12,
} from "@/components/dlShared/ui";

/** 강의록 그림의 볼록함수를 이 페이지에서 수식으로 다시 그린 것 */
const f = (x: number) => 1.3 * (x - 1) * (x - 1) + 10;
const df = (x: number) => 2.6 * (x - 1);

const X0 = -5.5;
const R_LO = -6.5;
const R_HI = 6.5;
const W = 540;
const H = 270;
const PAD = 28;

function r2(v: number): number {
  return Math.round(v * 100) / 100;
}

const px = (x: number) => r2(PAD + ((x - R_LO) / (R_HI - R_LO)) * (W - 2 * PAD));
const py = (y: number) => r2(H - PAD - ((y - 8) / (80 - 8)) * (H - 2 * PAD));

export default function GradientDescentStep() {
  const [eta, setEta] = useState(0.1);
  const [step, setStep] = useState(0);

  /** 매 걸음 q12로 자릿수를 맞춰 서버와 브라우저가 같은 경로를 낸다 */
  const path = useMemo(() => {
    const out = [q12(X0)];
    let x = q12(X0);
    for (let t = 0; t < 40; t++) {
      x = q12(x - eta * q12(df(x)));
      out.push(x);
    }
    return out;
  }, [eta]);

  const curve = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 160; i++) {
      const x = R_LO + ((R_HI - R_LO) * i) / 160;
      pts.push(`${px(x)},${py(f(x))}`);
    }
    return pts.join(" ");
  }, []);

  const shown = path.slice(0, step + 1);
  const cur = path[step];
  const grad = q12(df(cur));

  return (
    <section id="gradient-descent-step" className="scroll-mt-32">
      <SectionTitle
        title="경사 하강법 — 한 걸음씩 따라가 보기"
        subtitle="초깃값에서 시작해 경사의 음의 방향으로 조금씩 이동합니다"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "1. 경사 하강법의 개념 — 경사 하강법(gradient descent)",
            lecture: "경사를 따라 이동한다는 말을 그림 위에서 한 걸음씩 짚어 설명",
          }}
        >
          <Card>
            <CardTitle>정의</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              적절히 선택된 초깃값 <strong>x₀</strong>로부터 시작하여 경사를 따라 이동하여 목적함수의
              최솟값에 해당되는 지점인 <strong>x*</strong>에 도달하는 방법.
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "1. 경사 하강법의 개념 — 경사 하강법을 이용한 볼록함수의 최적화",
            lecture: "η는 0과 1 사이의 작은 값을 써서 조금씩 움직이게 한다고 강조",
          }}
        >
          <Card>
            <CardTitle>파라미터 업데이트 식</CardTitle>
            <Formula note="η: 학습률,  t: 업데이트 횟수">
              x(t + 1) = x(t) − η ∇J(x(t))
            </Formula>
            <div className="mt-2">
              <Formula>
                ∇J(x) = [ ∂J(x)/∂x₁  ∂J(x)/∂x₂  ⋯  ∂J(x)/∂x_d ]ᵀ
              </Formula>
            </div>
            <Hint>
              초깃값 x(0)에서 시작하여 J의 경사의 음의 방향으로 x = [x₁ x₂ ⋯ x_d]ᵀ를 이동하는 것을 반복.
            </Hint>
          </Card>
        </Sourced>

        <Sourced refs={{ slides: "1. 경사 하강법의 개념 — 경사 하강법(gradient descent)" }}>
          <Card>
            <CardTitle>한 걸음씩 움직여 보기</CardTitle>

            <Scroller>
              <svg
                viewBox={`0 0 ${W} ${H}`}
                width={W}
                className="min-w-[480px] max-w-full"
                role="img"
                aria-label="경사 하강법이 곡선을 따라 내려가는 경로"
              >
                <rect
                  x={PAD}
                  y={PAD - 16}
                  width={W - 2 * PAD}
                  height={H - 2 * PAD + 16}
                  className="fill-gray-50 dark:fill-gray-900"
                  rx={6}
                />
                <polyline points={curve} fill="none" strokeWidth={2.2} className="stroke-sky-500" />

                {/* 최솟값 위치 */}
                <line
                  x1={px(1)}
                  y1={py(f(1))}
                  x2={px(1)}
                  y2={H - PAD}
                  strokeWidth={1.2}
                  strokeDasharray="4 3"
                  className="stroke-gray-400"
                />
                <text x={px(1)} y={H - PAD + 14} textAnchor="middle" className="fill-gray-500 text-[11px]">
                  x*
                </text>

                {/* 지나온 경로 */}
                {shown.map((x, i) =>
                  i === 0 ? null : (
                    <line
                      key={`seg-${i}`}
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
                    key={`pt-${i}`}
                    cx={px(x)}
                    cy={py(f(x))}
                    r={i === shown.length - 1 ? 6 : 3.4}
                    className={
                      i === shown.length - 1
                        ? "fill-rose-600"
                        : "fill-rose-300 dark:fill-rose-800"
                    }
                  />
                ))}
                {shown.slice(0, 4).map((x, i) => (
                  <text
                    key={`lbl-${i}`}
                    x={px(x)}
                    y={py(f(x)) - 11}
                    textAnchor="middle"
                    className="fill-gray-600 text-[11px] dark:fill-gray-300"
                  >
                    x{i}
                  </text>
                ))}
              </svg>
            </Scroller>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Slider
                label="학습률 η"
                value={eta}
                min={0.02}
                max={0.76}
                step={0.02}
                onChange={(v) => {
                  setEta(v);
                  setStep(0);
                }}
                display={fmt(eta, 2)}
              />
              <Slider
                label="걸음 수 t"
                value={step}
                min={0}
                max={40}
                step={1}
                onChange={setStep}
                display={`${step}`}
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(40, s + 1))}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
              >
                <StepForward size={13} />한 걸음
              </button>
              <button
                type="button"
                onClick={() => setStep(40)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
              >
                <Play size={13} />끝까지
              </button>
              <button
                type="button"
                onClick={() => setStep(0)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <RotateCcw size={13} />처음으로
              </button>
            </div>

            <div className="mt-3 grid gap-2 text-[12px] sm:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800">
                <p className="text-[10.5px] font-semibold text-gray-500">현재 위치 x({step})</p>
                <p className="font-mono text-sm font-bold text-gray-800 dark:text-gray-100">
                  {fmt(cur, 4)}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800">
                <p className="text-[10.5px] font-semibold text-gray-500">경사 ∇J</p>
                <p className="font-mono text-sm font-bold text-gray-800 dark:text-gray-100">
                  {fmt(grad, 4)}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800">
                <p className="text-[10.5px] font-semibold text-gray-500">이번 이동량 −η∇J</p>
                <p className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400">
                  {fmt(-eta * grad, 4)}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Tag tone="rose">경사가 완만해질수록 이동량도 함께 줄어듦</Tag>
              <Tag>η를 키우면 한 걸음이 커지고, 지나치면 최솟값을 넘어 반대편으로 튐</Tag>
            </div>

            <ComputedNote>
              여기 쓴 곡선 f(x) = 1.3(x − 1)² + 10과 초깃값 x₀ = {X0}는 강의록 그림을 이 페이지에서 다시
              그리기 위해 정한 값입니다. 강의록에 적힌 식이 아닙니다.
            </ComputedNote>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
