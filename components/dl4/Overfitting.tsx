"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, ComputedNote, Chip, Scroller, Tag, fmt, q12 } from "@/components/dlShared/ui";

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** 강의록 그림의 모양(오름 → 평탄 → 오름)을 이 페이지에서 수식으로 다시 그린 것 */
const trueF = (x: number) =>
  2.3 * Math.tanh(2.8 * (x - 0.5)) + 1.5 * Math.tanh(2.4 * (x - 2.5)) - 0.2;

const N = 44;
const W = 520;
const H = 280;
const PAD = 34;

function r2(v: number) {
  return Math.round(v * 100) / 100;
}
const px = (x: number) => r2(PAD + (x / 3) * (W - 2 * PAD));
const py = (y: number) => r2(H - PAD - ((y + 4.4) / 8.4) * (H - 2 * PAD));

function sample(seed: number) {
  const rnd = lcg(seed);
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const x = q12((3 * i) / (N - 1));
    const y = q12(trueF(x) + (rnd() - 0.5) * 0.9);
    pts.push([x, y]);
  }
  return pts;
}

/** 학습 표본을 그대로 이어 붙인 모델 — 표본 사이는 직선으로 잇는다 */
function interp(pts: [number, number][], x: number): number {
  if (x <= pts[0][0]) return pts[0][1];
  if (x >= pts[pts.length - 1][0]) return pts[pts.length - 1][1];
  for (let i = 1; i < pts.length; i++) {
    if (x <= pts[i][0]) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
  }
  return pts[pts.length - 1][1];
}

export default function Overfitting() {
  const [mode, setMode] = useState<"fit" | "over">("over");

  const train = useMemo(() => sample(20_260_114), []);
  const fresh = useMemo(() => sample(20_260_205), []);

  const smooth = useMemo(() => {
    const a: string[] = [];
    for (let i = 0; i <= 180; i++) {
      const x = (3 * i) / 180;
      a.push(`${px(x)},${py(q12(trueF(x)))}`);
    }
    return a.join(" ");
  }, []);

  const overLine = useMemo(() => train.map(([x, y]) => `${px(x)},${py(y)}`).join(" "), [train]);

  const err = useMemo(() => {
    const mae = (pred: (x: number) => number, pts: [number, number][]) =>
      q12(pts.reduce((s, [x, y]) => s + Math.abs(pred(x) - y), 0) / pts.length);
    return {
      fitTrain: mae(trueF, train),
      fitFresh: mae(trueF, fresh),
      overTrain: mae((x) => interp(train, x), train),
      overFresh: mae((x) => interp(train, x), fresh),
    };
  }, [train, fresh]);

  const curTrain = mode === "over" ? err.overTrain : err.fitTrain;
  const curFresh = mode === "over" ? err.overFresh : err.fitFresh;

  return (
    <section id="overfitting" className="scroll-mt-32">
      <SectionTitle
        title="과적합 문제"
        subtitle="학습 표본에만 너무 잘 맞으면 새 데이터에서 오차가 커집니다"
      />

      <Sourced
        refs={{
          slides: "2. 과적합(overfitting) 문제 — 과적합이란?",
          lecture: "학습 표본에 섞인 잡음까지 따라가면 오히려 나쁜 성능을 낸다고 설명",
        }}
      >
        <Card>
          <CardTitle>특정 학습 데이터 집합에 지나치게 맞추어져 학습되는 현상</CardTitle>
          <p className="mb-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
            학습 표본에만 과하게 맞추면 훈련에 쓰지 않은 일반적인 데이터에서 오차가 커지는{" "}
            <strong>일반화 오류</strong>가 발생함.
          </p>

          <div className="mb-3 flex flex-wrap gap-2">
            <Chip active={mode === "fit"} onClick={() => setMode("fit")}>
              적절히 맞춘 모델
            </Chip>
            <Chip active={mode === "over"} onClick={() => setMode("over")}>
              과적합된 모델
            </Chip>
          </div>

          <Scroller>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              width={W}
              className="min-w-[460px] max-w-full"
              role="img"
              aria-label="학습 표본과 두 가지 모델 곡선"
            >
              <rect x={PAD} y={PAD - 20} width={W - 2 * PAD} height={H - 2 * PAD + 20} rx={6} className="fill-gray-50 dark:fill-gray-900" />

              <polyline points={smooth} fill="none" strokeWidth={2} strokeDasharray="5 3" className="stroke-sky-500" />
              {mode === "over" && (
                <polyline points={overLine} fill="none" strokeWidth={2.2} className="stroke-orange-500" />
              )}

              {train.map(([x, y], i) => (
                <circle key={i} cx={px(x)} cy={py(y)} r={2.6} className="fill-rose-400" />
              ))}

              <text x={W - PAD} y={H - PAD + 16} textAnchor="end" className="fill-gray-400 text-[10px]">
                x
              </text>
            </svg>
          </Scroller>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-5 bg-sky-500" />실제 f(x)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-5 bg-orange-500" />모델이 그린 곡선
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-rose-400" />학습 표본(잡음 포함)
            </span>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <p className="text-[10.5px] font-semibold text-gray-500">학습 표본에 대한 평균 오차</p>
              <p className="font-mono text-base font-bold text-gray-800 dark:text-gray-100">
                {fmt(curTrain, 3)}
              </p>
            </div>
            <div
              className={`rounded-lg p-3 ${
                curFresh > curTrain * 1.3
                  ? "bg-rose-50 dark:bg-rose-950/40"
                  : "bg-emerald-50 dark:bg-emerald-950/40"
              }`}
            >
              <p className="text-[10.5px] font-semibold text-gray-500">훈련에 쓰지 않은 데이터에 대한 평균 오차</p>
              <p
                className={`font-mono text-base font-bold ${
                  curFresh > curTrain * 1.3
                    ? "text-rose-700 dark:text-rose-300"
                    : "text-emerald-700 dark:text-emerald-300"
                }`}
              >
                {fmt(curFresh, 3)}
              </p>
            </div>
          </div>

          <Hint>
            과적합된 모델은 학습 표본에 대한 오차가 0에 가깝지만, 새 데이터에서는 오차가 오히려 커집니다.
            학습 표본에 섞인 잡음까지 따라 그렸기 때문입니다.
          </Hint>

          <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/30">
            <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">개선 방법</p>
            <p className="mt-1 text-[12.5px] leading-5 text-gray-700 dark:text-gray-200">
              드롭아웃, 규제, 데이터 증강 등.
            </p>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            <Tag tone="rose">불안정한 경사 문제와 과적합 문제는 올바른 학습의 진행을 가로막는 요인</Tag>
          </div>

          <ComputedNote>
            위 곡선·표본·오차 숫자는 강의록 그림의 상황을 이 페이지에서 다시 만들어 계산한 예시입니다.
            강의록에 적힌 수치가 아닙니다.
          </ComputedNote>
        </Card>
      </Sourced>
    </section>
  );
}
