"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, ComputedNote, Scroller, q12, fmt } from "@/components/dlShared/ui";
import { Code, F, Out, Slider3, r2 } from "@/components/dl3/ui3";

/**
 * 강의록 3-5 선형 회귀 학습을 그대로 재현한다.
 * x = [1,3,5,7], y = [2,3,4,5], w₀ = 1, b₀ = 0.5, 학습률 0.01, 에폭 1000,
 * 표본 하나마다 한 번씩 갱신 → 최종 w = 0.50000, b = 1.50000 (강의록 출력과 같음)
 */

const XS = [1, 3, 5, 7];
const YS = [2, 3, 4, 5];
const LR = 0.01;
const MARKS = [0, 1, 2, 5, 10, 25, 50, 100, 200, 400, 700, 1000];

type Snap = { epoch: number; w: number; b: number; loss: number };

/** 매 걸음 자릿수를 맞춰, 서버와 브라우저가 같은 경로를 밟게 한다. */
function buildPath(): Snap[] {
  let w = 1;
  let b = 0.5;
  const marks = new Set(MARKS);
  const out: Snap[] = [];
  const totalLoss = (ww: number, bb: number) =>
    q12(XS.reduce((s, x, k) => s + (ww * x + bb - YS[k]) ** 2, 0));

  for (let ep = 0; ep <= 1000; ep += 1) {
    if (marks.has(ep)) out.push({ epoch: ep, w, b, loss: totalLoss(w, b) });
    if (ep === 1000) break;
    for (let k = 0; k < XS.length; k += 1) {
      const err = q12(q12(w * XS[k] + b) - YS[k]);
      const gw = q12(2 * err * XS[k]);
      const gb = q12(2 * err);
      w = q12(w - LR * gw);
      b = q12(b - LR * gb);
    }
  }
  return out;
}

const PATH = buildPath();

const PX = (x: number) => r2(34 + (x / 8) * 276);
const PY = (y: number) => r2(174 - (y / 6) * 164);

export default function LinRegTraining() {
  const [i, setI] = useState(0);
  const s = PATH[i];
  const done = s.epoch === 1000;

  const y0 = s.w * 0 + s.b;
  const y8 = s.w * 8 + s.b;

  return (
    <section id="linreg-training" className="scroll-mt-32">
      <SectionTitle
        title="자동 미분으로 선형 회귀 학습하기"
        subtitle="에폭을 늘려 가며 w와 b가 어디로 움직이는지 직접 보세요"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "3. 자동 미분을 이용한 선형 회귀의 학습 — 선형 회귀 문제, 손실함수와 경사 하강법",
            lecture: "x가 2 늘 때 y가 1 느니 w는 1/2, x=1에서 y=2이니 b는 1.5가 나와야 맞다고 미리 계산해 보임",
          }}
        >
          <Card>
            <CardTitle>풀려는 문제</CardTitle>
            <div className="grid gap-2 sm:grid-cols-3">
              <F note="x는 독립변수, y는 종속변수">ŷ = wx + b</F>
              <F note="손실함수: 오차 제곱">E(ŷ, y) = (wx + b − y)²</F>
              <F note="경사 하강법에 의한 갱신">
                w(t+1) = w(t) − η ∂E/∂w
              </F>
            </div>
            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              학습 표본은 x = [1, 3, 5, 7], y = [2, 3, 4, 5]. x가 2씩 늘 때 y는 1씩 느니 기울기 w는
              1/2일 것이고, x = 1에서 y = 2가 나와야 하니 b는 2 − 0.5 = 1.5일 것입니다. 자동 미분이
              이 값을 찾아내는지 확인하는 것이 이 예제입니다.
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "3. 자동 미분을 이용한 선형 회귀의 학습 — 학습 단계의 처리 함수 정의 / 반복 학습 / 학습된 파라미터 출력",
          }}
        >
          <Card>
            <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
              <div className="min-w-0">
                <Code
                  caption="학습 단계 — 테이프에 기록하고 되감아 갱신한다"
                  lines={[
                    { t: "def train_step(x, y):" },
                    { t: "    with tf.GradientTape() as t:" },
                    { t: "        y_hat = w * x + b" },
                    { t: "        loss = (y_hat - y) ** 2" },
                    { t: "    grads = t.gradient(loss, [w, b])", mark: true },
                    { t: "    w.assign_sub(learning_rate * grads[0])", mark: true },
                    { t: "    b.assign_sub(learning_rate * grads[1])", mark: true },
                  ]}
                />
                <p className="mt-2 text-[12px] leading-5 text-gray-600 dark:text-gray-300">
                  강조한 세 줄이 전부입니다. <code className="font-mono">gradient</code> 가 ∂E/∂w 와
                  ∂E/∂b 를 돌려주고, <code className="font-mono">assign_sub</code> 가 갱신식의 뺄셈을
                  수행합니다. w와 b는 값이 바뀌어야 하므로 <strong>변수 텐서</strong>로 만들었습니다.
                </p>
              </div>

              <div className="min-w-0">
                <div className="mb-2">
                  <Slider3
                    label="학습 에폭"
                    value={i}
                    min={0}
                    max={PATH.length - 1}
                    step={1}
                    onChange={setI}
                    display={`${s.epoch} 에폭`}
                  />
                </div>

                <Scroller>
                  <svg
                    viewBox="0 0 320 200"
                    className="h-auto w-full min-w-[280px]"
                    role="img"
                    aria-label="선형 회귀 학습 그래프"
                  >
                    {/* 격자 */}
                    {[0, 2, 4, 6].map((g) => (
                      <g key={`h${g}`}>
                        <line
                          x1={34}
                          x2={310}
                          y1={PY(g)}
                          y2={PY(g)}
                          className="stroke-gray-200 dark:stroke-gray-800"
                          strokeWidth={1}
                        />
                        <text
                          x={28}
                          y={PY(g) + 3}
                          textAnchor="end"
                          className="fill-gray-400 text-[9px] font-mono"
                        >
                          {g}
                        </text>
                      </g>
                    ))}
                    {[0, 2, 4, 6, 8].map((g) => (
                      <text
                        key={`x${g}`}
                        x={PX(g)}
                        y={190}
                        textAnchor="middle"
                        className="fill-gray-400 text-[9px] font-mono"
                      >
                        {g}
                      </text>
                    ))}
                    <line
                      x1={34}
                      x2={310}
                      y1={PY(0)}
                      y2={PY(0)}
                      className="stroke-gray-400"
                      strokeWidth={1.2}
                    />

                    {/* 목표 직선 */}
                    <line
                      x1={PX(0)}
                      x2={PX(8)}
                      y1={PY(1.5)}
                      y2={PY(5.5)}
                      className="stroke-emerald-400"
                      strokeWidth={1.2}
                      strokeDasharray="4 3"
                    />

                    {/* 현재 직선 */}
                    <line
                      x1={PX(0)}
                      x2={PX(8)}
                      y1={PY(y0)}
                      y2={PY(y8)}
                      className="stroke-amber-500"
                      strokeWidth={2.2}
                    />

                    {/* 오차 선과 표본 */}
                    {XS.map((x, k) => {
                      const yh = s.w * x + s.b;
                      return (
                        <g key={x}>
                          <line
                            x1={PX(x)}
                            x2={PX(x)}
                            y1={PY(YS[k])}
                            y2={PY(yh)}
                            className="stroke-rose-400"
                            strokeWidth={1.2}
                          />
                          <circle
                            cx={PX(x)}
                            cy={PY(YS[k])}
                            r={4}
                            className="fill-sky-500 stroke-white dark:stroke-gray-900"
                            strokeWidth={1.2}
                          />
                        </g>
                      );
                    })}
                  </svg>
                </Scroller>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-[10.5px] text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-sky-500" />
                    학습 표본
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block h-0.5 w-5 bg-amber-500" />
                    현재 모델
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block h-0.5 w-5 bg-emerald-400" />
                    표본을 지나는 직선
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block h-0.5 w-5 bg-rose-400" />
                    오차
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-center dark:border-amber-900 dark:bg-amber-950/40">
                    <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">w</p>
                    <p className="font-mono text-[13px] font-bold text-amber-900 dark:text-amber-100">
                      {fmt(s.w, 5)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-center dark:border-amber-900 dark:bg-amber-950/40">
                    <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">b</p>
                    <p className="font-mono text-[13px] font-bold text-amber-900 dark:text-amber-100">
                      {fmt(s.b, 5)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 px-2 py-1.5 text-center dark:border-gray-700">
                    <p className="text-[10px] font-semibold text-gray-500">오차 제곱의 합</p>
                    <p className="font-mono text-[13px] font-bold text-gray-700 dark:text-gray-200">
                      {fmt(s.loss, 4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {done && (
              <div className="mt-3 space-y-2">
                <Out>{`w:  0.50000     b:  1.50000`}</Out>
                <Out>{`x: 1.00000 --> y: 2.00000
x: 3.00000 --> y: 3.00000
x: 5.00000 --> y: 4.00000
x: 7.00000 --> y: 5.00000`}</Out>
                <p className="text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                  1000 에폭을 돌린 뒤의 값이 강의록 출력과 같습니다. 학습된 w, b로 네 표본을 다시
                  넣어 보면 레이블과 같은 값이 나옵니다.
                </p>
              </div>
            )}

            <ComputedNote>
              슬라이더 중간 지점의 w, b, 오차 제곱의 합은 강의록 코드(학습률 0.01, 표본마다 갱신)를
              그대로 따라 이 페이지에서 계산한 값입니다. 강의록에 적힌 값은 1000 에폭 뒤의
              w = 0.50000, b = 1.50000 과 네 표본의 예측 결과뿐입니다.
            </ComputedNote>
            <Hint>
              초반에 b가 크게 움직이고 w는 거의 제자리인 것처럼 보이는데, 100 에폭을 넘기면서 둘 다
              목표값에 가까워집니다. 400 에폭쯤이면 그림상으로는 이미 구분이 어렵습니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
