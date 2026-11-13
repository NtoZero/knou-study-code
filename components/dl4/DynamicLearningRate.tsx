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
  q12,
} from "@/components/dlShared/ui";

type Kind = "piecewise" | "exponential" | "polynomial";

/** 세 스케줄러 모두 강의록 예제의 인수를 그대로 쓴다 */
const schedulers: Record<
  Kind,
  { name: string; desc: string; formula: string; note: string; code: string; fn: (e: number) => number }
> = {
  piecewise: {
    name: "계단형 감쇠 스케줄러",
    desc: "반복 횟수의 구간을 정하여 각 구간에 정해진 학습률을 적용함",
    formula: "boundaries = [700, 900],  values = [0.1, 0.05, 0.01]",
    note: "tf.keras.optimizers.schedules의 PiecewiseConstantDecay 클래스 인스턴스 활용",
    code: `boundaries = [700, 900]
values = [0.1, 0.05, 0.01]
lr_fn = optimizers.schedules.PiecewiseConstantDecay(
    boundaries, values)`,
    fn: (e) => (e <= 700 ? 0.1 : e <= 900 ? 0.05 : 0.01),
  },
  exponential: {
    name: "지수 함수 감쇠 스케줄러",
    desc: "반복 횟수에 따라 초깃값으로부터 지수 함수 형태로 감쇠함",
    formula: "η = 0.1 · 0.5^(epoch / 500)",
    note: "tf.keras.optimizers.schedules의 ExponentialDecay 클래스 인스턴스 활용",
    code: `lr_fn = optimizers.schedules.ExponentialDecay(
    initial_learning_rate = 0.1,
    decay_steps = 500,
    decay_rate = 0.5,
    staircase = False)`,
    fn: (e) => 0.1 * Math.pow(0.5, e / 500),
  },
  polynomial: {
    name: "다항식 감쇠 스케줄러",
    desc: "반복 횟수에 대한 다항식 형태로 학습률을 감쇠함",
    formula: "step = min(epoch, 900),  η = (0.1 − 0.01) · (1 − step/900)^0.5 + 0.01",
    note: "tf.keras.optimizers.schedules의 PolynomialDecay 클래스 인스턴스 활용",
    code: `lr_fn = optimizers.schedules.PolynomialDecay(
    initial_learning_rate = 0.1,
    decay_steps = 900,
    end_learning_rate = 0.01,
    power = 0.5)`,
    fn: (e) => {
      const step = Math.min(e, 900);
      return (0.1 - 0.01) * Math.pow(1 - step / 900, 0.5) + 0.01;
    },
  },
};

const ORDER: Kind[] = ["piecewise", "exponential", "polynomial"];

const W = 540;
const H = 230;
const PAD = 36;
const E_MAX = 1000;
const Y_MAX = 0.11;

function r2(v: number) {
  return Math.round(v * 100) / 100;
}
const px = (e: number) => r2(PAD + (e / E_MAX) * (W - 2 * PAD));
const py = (y: number) => r2(H - PAD - (y / Y_MAX) * (H - 2 * PAD));

export default function DynamicLearningRate() {
  const [kind, setKind] = useState<Kind>("exponential");
  const [epoch, setEpoch] = useState(0);

  const sch = schedulers[kind];

  const line = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 250; i++) {
      const e = (E_MAX * i) / 250;
      pts.push(`${px(e)},${py(q12(sch.fn(e)))}`);
    }
    return pts.join(" ");
  }, [sch]);

  const cur = q12(sch.fn(epoch));

  return (
    <section id="dynamic-learning-rate" className="scroll-mt-32">
      <SectionTitle
        title="동적 학습률"
        subtitle="학습의 진행에 따라 점차 학습률을 줄이는 방식"
      />

      <Sourced
        refs={{
          slides: "3. 동적 학습률 — 학습의 진행에 따라 점차 학습률을 줄이는 방식",
          lecture: "처음에는 비교적 큰 학습률을 쓰다가 점차 줄여 안정적으로 수렴하게 한다고 설명",
        }}
      >
        <Card>
          <p className="mb-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
            처음에는 비교적 큰 학습률로 빠르게 내려가다가, 에폭이 진행될수록 학습률을 줄여 파라미터의
            변화량을 작게 만들어 해에 안정적으로 도달하게 함.
          </p>

          <div className="mb-3 flex flex-wrap gap-2">
            {ORDER.map((k, i) => (
              <Chip key={k} active={kind === k} onClick={() => setKind(k)}>
                {i + 1} {schedulers[k].name}
              </Chip>
            ))}
          </div>

          <p className="mb-2 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">{sch.desc}</p>
          <div className="mb-3">
            <Formula note={sch.note}>{sch.formula}</Formula>
          </div>

          <Scroller>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              width={W}
              className="min-w-[480px] max-w-full"
              role="img"
              aria-label="에폭에 따른 학습률 변화 곡선"
            >
              <rect x={PAD} y={PAD - 20} width={W - 2 * PAD} height={H - 2 * PAD + 20} rx={6} className="fill-gray-50 dark:fill-gray-900" />

              {[0, 0.025, 0.05, 0.075, 0.1].map((y) => (
                <g key={y}>
                  <line x1={PAD} y1={py(y)} x2={W - PAD} y2={py(y)} strokeWidth={1} className="stroke-gray-200 dark:stroke-gray-800" />
                  <text x={PAD - 6} y={py(y) + 4} textAnchor="end" className="fill-gray-400 text-[9.5px]">
                    {y.toFixed(3)}
                  </text>
                </g>
              ))}
              {[0, 250, 500, 700, 900, 1000].map((e) => (
                <text key={e} x={px(e)} y={H - PAD + 14} textAnchor="middle" className="fill-gray-400 text-[9.5px]">
                  {e}
                </text>
              ))}

              <polyline points={line} fill="none" strokeWidth={2.4} className="stroke-rose-500" />

              <line x1={px(epoch)} y1={PAD - 20} x2={px(epoch)} y2={H - PAD} strokeWidth={1.4} strokeDasharray="4 3" className="stroke-gray-500" />
              <circle cx={px(epoch)} cy={py(cur)} r={5.5} className="fill-rose-600" />

              <text x={PAD} y={PAD - 26} className="fill-gray-400 text-[10px]">
                학습률 η
              </text>
              <text x={W - PAD} y={H - PAD + 26} textAnchor="end" className="fill-gray-400 text-[10px]">
                에폭
              </text>
            </svg>
          </Scroller>

          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <Slider
              label="에폭"
              value={epoch}
              min={0}
              max={E_MAX}
              step={10}
              onChange={setEpoch}
              display={`${epoch}`}
            />
            <div className="rounded-lg bg-rose-50 px-3 py-2 dark:bg-rose-950/40">
              <p className="text-[10.5px] font-semibold text-rose-700 dark:text-rose-300">이때의 η</p>
              <p className="font-mono text-base font-bold text-rose-800 dark:text-rose-200">
                {fmt(cur, 5)}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <Scroller>
              <pre className="min-w-[340px] overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11.5px] leading-5 text-gray-100">
{sch.code}
              </pre>
            </Scroller>
            <Hint>
              만든 스케줄러 객체를 최적화기의 학습률 자리에 넣어 줌 —
              optimizers.SGD(lr_fn, momentum=0.9).
            </Hint>
          </div>

          <div className="mt-3 rounded-lg bg-gray-50 p-3 text-[12px] leading-5 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            <strong>세 방식의 차이</strong> — 계단형은 정해 둔 경계에서 뚝 떨어지고, 지수 함수형은 매
            에폭 조금씩 줄며, 다항식형은 정해 둔 마지막 학습률(0.01)에 900에폭에서 정확히 닿습니다.
          </div>
        </Card>
      </Sourced>
    </section>
  );
}
