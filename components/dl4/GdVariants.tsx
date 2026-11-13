"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import {
  Card,
  CardTitle,
  Formula,
  Hint,
  ComputedNote,
  Slider,
  Chip,
  Scroller,
  Tag,
  num,
  q12,
} from "@/components/dlShared/ui";

/** 고정 시드 생성기 — 렌더마다 같은 궤적이 나오게 한다 */
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const START: [number, number] = [0.5, 0.7];
const TARGET: [number, number] = [-0.8, -0.4];
const UPDATES = 150;

/** 미니배치가 클수록 경사의 평균이 안정되어 궤적의 흔들림이 줄어든다 */
function trace(batch: number, seed: number): [number, number][] {
  const rnd = lcg(seed);
  const noise = 0.11 / Math.sqrt(batch);
  let x = q12(START[0]);
  let y = q12(START[1]);
  const out: [number, number][] = [[x, y]];
  for (let k = 0; k < UPDATES; k++) {
    x = q12(x + 0.035 * (TARGET[0] - x) + noise * (rnd() - 0.5));
    y = q12(y + 0.035 * (TARGET[1] - y) + noise * (rnd() - 0.5));
    out.push([x, y]);
  }
  return out;
}

const W = 360;
const H = 300;
const PAD = 26;
function r2(v: number) {
  return Math.round(v * 100) / 100;
}
const sx = (x: number) => r2(PAD + ((x + 1.3) / 2.3) * (W - 2 * PAD));
const sy = (y: number) => r2(H - PAD - ((y + 0.9) / 2.0) * (H - 2 * PAD));

function poly(pts: [number, number][]): string {
  return pts.map(([a, b]) => `${sx(a)},${sy(b)}`).join(" ");
}

const N_PRESETS = [
  { n: 150, label: "붓꽃 150개" },
  { n: 1000, label: "표본 1000개" },
];

export default function GdVariants() {
  const [n, setN] = useState(1000);
  const [batch, setBatch] = useState(20);
  const [epochs, setEpochs] = useState(10);
  const [show, setShow] = useState<Record<string, boolean>>({
    batch: true,
    sgd: true,
    mini: true,
  });

  const perEpoch = Math.floor(n / Math.min(batch, n));
  const total = perEpoch * epochs;

  const paths = useMemo(
    () => ({
      batch: trace(10_000, 20_250_401),
      sgd: trace(1, 20_250_402),
      mini: trace(6, 20_250_403),
    }),
    [],
  );

  const mode =
    batch <= 1
      ? { name: "확률적 경사 하강법(SGD)", tone: "amber" }
      : batch >= n
        ? { name: "배치 경사 하강법(BGD)", tone: "sky" }
        : { name: "미니배치 확률적 경사 하강법", tone: "rose" };

  const modeTone = {
    amber: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
    sky: "bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-200",
    rose: "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200",
  }[mode.tone];

  return (
    <section id="gd-variants" className="scroll-mt-32">
      <SectionTitle
        title="한 번의 업데이트에 표본을 몇 개 쓰나"
        subtitle="배치 · 확률적 · 미니배치 — 같은 경사 하강법을 쓰는 세 가지 방식"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "2. 경사 하강법의 구현 — 배치 경사 하강법(Batch Gradient Descent, BGD)",
          }}
        >
          <Card>
            <CardTitle>배치 경사 하강법 — 전체 표본의 경사 평균</CardTitle>
            <p className="mb-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              모든 훈련용 표본으로 한 단계의 파라미터 업데이트를 위한 경사를 계산하는 방식.
            </p>
            <div className="space-y-2">
              <Formula note="N: 훈련에 사용되는 표본의 수,  Eᵢ(w): i번째 표본에 대한 손실,  w: 가중치·바이어스 등의 학습 대상 파라미터">
                J(w) = (1/N) Σᵢ₌₁ᴺ Eᵢ(w)
              </Formula>
              <Formula>∇J(w) = (1/N) Σᵢ₌₁ᴺ ∇Eᵢ(w),   w(t + 1) = w(t) − η∇J(w)</Formula>
            </div>
            <ul className="mt-3 space-y-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              <li>· 한 에폭(epoch)마다 한 번씩 파라미터를 업데이트함</li>
              <li>· 한 번의 업데이트에 긴 계산 시간을 소비함</li>
            </ul>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "2. 경사 하강법의 구현 — 확률적 경사 하강법(Stochastic Gradient Descent, SGD)",
            lecture: "불규칙한 변화가 단점만은 아니고 지역 최소치에서 빠져나오는 요인이 되기도 한다고 짚음",
          }}
        >
          <Card>
            <CardTitle>확률적 경사 하강법 — 표본 하나마다 업데이트</CardTitle>
            <p className="mb-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              훈련 집합에서 무작위 순서로 하나씩 표본 i ∈ {"{"}1, 2, ⋯, N{"}"}에 대한 경사 ∇Jᵢ(w) =
              ∇Eᵢ(w)를 계산하여 파라미터를 업데이트함.
            </p>
            <Formula>w(t + 1) = w(t) − η∇Jᵢ(w)</Formula>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">좋은 점</p>
                <ul className="mt-1 space-y-0.5 text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                  <li>· 한 에폭 동안 파라미터가 N번 업데이트됨 — 매우 빠르게 진행</li>
                  <li>· 지역 최소치, 안장점 등에서 빠져나오는 데 도움이 될 수 있음</li>
                </ul>
              </div>
              <div className="rounded-lg border border-rose-100 bg-rose-50/60 p-3 dark:border-rose-900/60 dark:bg-rose-950/30">
                <p className="text-[11px] font-bold text-rose-700 dark:text-rose-300">걸리는 점</p>
                <ul className="mt-1 space-y-0.5 text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                  <li>· 배치 경사 하강법에 비해 파라미터의 변화가 불규칙하게 진행됨</li>
                  <li>· 극소점 근처에 도달한 상태에서도 파라미터가 계속 변화 — 수렴하지 않을 수 있음</li>
                </ul>
              </div>
            </div>
            <Hint>
              수렴하지 않는 문제에는 동적 학습률을 적용 — 에폭에 따라 학습률을 점차 작은 값으로 줄임.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "2. 경사 하강법의 구현 — 미니배치 확률적 경사 하강법(mini-batch SGD)",
            lecture: "일반적으로는 미니배치 방식으로 확률적 경사 하강법을 적용한다고 정리",
          }}
        >
          <Card>
            <CardTitle>미니배치 확률적 경사 하강법 — 둘의 절충</CardTitle>
            <p className="mb-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              전체 학습표본 집합을 &lsquo;미니배치&rsquo;라고 하는 작은 크기의 부분집합으로 분할하여
              모델을 훈련함. 각각의 미니배치는 학습표본 집합에서 무작위로 선택하고, 파라미터의 업데이트는
              미니배치 단위로 함.
            </p>
            <Formula note="N_B: 미니배치의 크기">J_B(w) = (1/N_B) Σ_{"{"}i∈B{"}"} Eᵢ(w)</Formula>
            <ul className="mt-3 space-y-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              <li>· 한 에폭에 파라미터를 [N / N_B]회 업데이트함</li>
              <li>· SGD에 비해 파라미터 업데이트의 불규칙성이 완화되어 안정적인 학습에 도움</li>
              <li>· 벡터화 및 병렬처리를 활용해 계산 성능을 높일 수 있음 — 특히 GPU에서 행렬 연산 최적화에 유리</li>
            </ul>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "2. 경사 하강법의 구현 — 미니배치 확률적 경사 하강법(mini-batch SGD)",
            lecture: "붓꽃 데이터 150개를 150번 업데이트할 때 방식마다 필요한 에폭 수가 다르다고 비교",
          }}
        >
          <Card>
            <CardTitle>직접 맞춰 보기 — 에폭당 업데이트 횟수</CardTitle>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-gray-500">학습표본 수 N</span>
              {N_PRESETS.map((p) => (
                <Chip
                  key={p.n}
                  active={n === p.n}
                  onClick={() => {
                    setN(p.n);
                    setBatch(Math.min(batch, p.n));
                  }}
                >
                  {p.label}
                </Chip>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Slider
                label="미니배치 크기 N_B"
                value={Math.min(batch, n)}
                min={1}
                max={n}
                step={1}
                onChange={setBatch}
                display={num(Math.min(batch, n))}
              />
              <Slider
                label="에폭 수"
                value={epochs}
                min={1}
                max={50}
                step={1}
                onChange={setEpochs}
                display={`${epochs}`}
              />
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <div className={`rounded-lg p-2.5 ${modeTone}`}>
                <p className="text-[10.5px] font-semibold opacity-80">지금 선택한 방식</p>
                <p className="text-[12.5px] font-bold">{mode.name}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800">
                <p className="text-[10.5px] font-semibold text-gray-500">한 에폭당 업데이트</p>
                <p className="font-mono text-sm font-bold text-gray-800 dark:text-gray-100">
                  [{num(n)} / {num(Math.min(batch, n))}] = {num(perEpoch)}회
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800">
                <p className="text-[10.5px] font-semibold text-gray-500">
                  {epochs}에폭 동안 총 업데이트
                </p>
                <p className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400">
                  {num(total)}회
                </p>
              </div>
            </div>

            <Hint>
              미니배치 크기를 1로 내리면 확률적 경사 하강법, N으로 올리면 배치 경사 하강법이 됩니다 —
              같은 식의 양 끝입니다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "2. 경사 하강법의 구현 — 미니배치 확률적 경사 하강법(mini-batch SGD)",
          }}
        >
          <Card>
            <CardTitle>궤적 비교 — 150번 업데이트하는 동안</CardTitle>

            <div className="mb-3 flex flex-wrap gap-2">
              {(
                [
                  ["batch", "배치 GD", "stroke-violet-500", "text-violet-600"],
                  ["sgd", "SGD", "stroke-amber-500", "text-amber-600"],
                  ["mini", "미니배치 SGD (크기 6)", "stroke-rose-500", "text-rose-600"],
                ] as const
              ).map(([key, label]) => (
                <Chip
                  key={key}
                  active={show[key]}
                  onClick={() => setShow((p) => ({ ...p, [key]: !p[key] }))}
                >
                  {label}
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
                  aria-label="세 방식의 파라미터 변화 궤적 비교"
                >
                  <rect x={10} y={10} width={W - 20} height={H - 20} rx={8} className="fill-gray-50 dark:fill-gray-900" />
                  {show.sgd && (
                    <polyline points={poly(paths.sgd)} fill="none" strokeWidth={1.3} className="stroke-amber-500" />
                  )}
                  {show.mini && (
                    <polyline points={poly(paths.mini)} fill="none" strokeWidth={1.6} className="stroke-rose-500" />
                  )}
                  {show.batch && (
                    <polyline points={poly(paths.batch)} fill="none" strokeWidth={2.2} className="stroke-violet-500" />
                  )}
                  <circle cx={sx(START[0])} cy={sy(START[1])} r={5} className="fill-blue-600" />
                  <circle cx={sx(TARGET[0])} cy={sy(TARGET[1])} r={5} className="fill-emerald-600" />
                  <text x={sx(START[0]) + 8} y={sy(START[1]) + 4} className="fill-gray-500 text-[10px]">
                    시작
                  </text>
                  <text x={sx(TARGET[0]) + 8} y={sy(TARGET[1]) + 4} className="fill-gray-500 text-[10px]">
                    해
                  </text>
                  <text x={20} y={H - 16} className="fill-gray-400 text-[10px]">
                    w₁
                  </text>
                  <text x={20} y={26} className="fill-gray-400 text-[10px]">
                    w₂
                  </text>
                </svg>
              </Scroller>

              <div className="space-y-2">
                <Scroller>
                  <table className="w-full min-w-[300px] text-left text-[11.5px]">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700">
                        <th className="py-1.5 pr-2 font-semibold">방식</th>
                        <th className="py-1.5 pr-2 font-semibold">150회 업데이트에 필요한 에폭</th>
                        <th className="py-1.5 font-semibold">궤적</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1.5 pr-2 font-semibold text-violet-600">배치 GD</td>
                        <td className="py-1.5 pr-2 font-mono">150에폭</td>
                        <td className="py-1.5 text-gray-600 dark:text-gray-300">일정한 방향</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1.5 pr-2 font-semibold text-amber-600">SGD</td>
                        <td className="py-1.5 pr-2 font-mono">1에폭</td>
                        <td className="py-1.5 text-gray-600 dark:text-gray-300">크게 진동</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 font-semibold text-rose-600">미니배치 (6)</td>
                        <td className="py-1.5 pr-2 font-mono">6에폭</td>
                        <td className="py-1.5 text-gray-600 dark:text-gray-300">진동이 완화됨</td>
                      </tr>
                    </tbody>
                  </table>
                </Scroller>

                <div className="flex flex-wrap gap-2">
                  <Tag tone="rose">붓꽃 데이터 150개 · 단층 피드포워드 신경망 · 150회 업데이트</Tag>
                </div>

                <Hint>
                  같은 150번을 돌려도, 표본 하나씩 쓰면 한 에폭이면 끝나지만 전체를 한 번에 쓰면 150에폭이
                  필요합니다. 대신 궤적의 안정성은 반대 순서입니다.
                </Hint>
              </div>
            </div>

            <ComputedNote>
              위 궤적 그림은 세 방식의 차이를 보여주기 위해 이 페이지에서 만든 모의 경로입니다. 강의록의
              붓꽃 실험 결과 수치가 아닙니다. 에폭 수와 미니배치 크기 6은 강의록에 적힌 값입니다.
            </ComputedNote>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "2. 경사 하강법의 구현 — Keras에서 경사 하강법의 구현",
            lecture: "batch_size의 기본값이 32이고, 1로 두면 표본 단위, N으로 두면 배치 방식이 된다고 설명",
          }}
        >
          <Card>
            <CardTitle>Keras에서는 batch_size 하나로 갈린다</CardTitle>
            <Scroller>
              <pre className="min-w-[340px] overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11.5px] leading-5 text-gray-100">
{`bp_model_tf.compile(optimizer=optimizers.SGD(0.1, momentum=0.9),
                    loss=losses.SparseCategoricalCrossentropy(),
                    metrics=['accuracy'])

bp_model_tf.fit(X_tr, y_tr, batch_size=15, epochs=1000,
                verbose=2, validation_data=(X_val, y_val))`}
              </pre>
            </Scroller>
            <Hint>
              batch_size를 1로 두면 표본 단위, 학습표본 전체 크기로 두면 배치 경사 하강법, 그 사이 값이면
              미니배치 방식이 됩니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
