"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Scroller, ComputedNote, fmt, q12 } from "@/components/dlShared/ui";
import { F, Slider2, Chip2, Cell, sig } from "@/components/dl2/ui2";

const CLASSES = ["setosa", "versicolor", "virginica"];

export default function SoftmaxCrossEntropy() {
  const [u, setU] = useState([1.2, 2.4, 0.3]);
  const [act, setAct] = useState<"softmax" | "sigmoid">("softmax");
  const [label, setLabel] = useState(1);

  const exps = u.map((v) => q12(Math.exp(v)));
  const sum = q12(exps[0] + exps[1] + exps[2]);
  const soft = exps.map((v) => q12(v / sum));
  const sigm = u.map((v) => sig(v));
  const out = act === "softmax" ? soft : sigm;
  const total = q12(out[0] + out[1] + out[2]);

  const oneHot = [0, 1, 2].map((i) => (i === label ? 1 : 0));
  // E = Σ −y_i ln ŷ_i — one-hot이므로 정답 성분 하나만 남는다
  const ce = q12(-Math.log(Math.max(soft[label], 1e-12)));
  const argmax = out.indexOf(Math.max(...out));
  const deltas = soft.map((v, i) => q12(v - oneHot[i]));

  const set = (i: number, v: number) => setU((prev) => prev.map((p, j) => (j === i ? v : p)));

  return (
    <section id="softmax-crossentropy" className="scroll-mt-32">
      <SectionTitle
        title="클래스가 셋 이상일 때"
        subtitle="출력층은 소프트맥스, 손실함수는 교차 엔트로피로 바뀝니다"
      />

      <Sourced
        refs={{
          slides: "1. 다중 클래스 분류를 위한 활성함수 및 손실함수 — 소프트맥스(softmax) 활성함수",
          lecture: "시그모이드를 쓰면 각 출력을 다 더했을 때 1이 아닌 값이 나와 확률분포로 적합하지 않다",
        }}
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <Card className="min-w-0">
            <CardTitle>가중합 세 개를 확률로 바꾸기</CardTitle>
            <F note="각 입력의 지수함수 값을 전체 합으로 나눈다">
              φ<sub>softmax</sub>(u)<sub>k</sub> = e<sup>u_k</sup> / Σ<sub>i=1</sub><sup>N</sup> e<sup>u_i</sup>
            </F>

            <div className="my-3 flex flex-wrap gap-2">
              <Chip2 active={act === "softmax"} onClick={() => setAct("softmax")}>
                소프트맥스
              </Chip2>
              <Chip2 active={act === "sigmoid"} onClick={() => setAct("sigmoid")}>
                시그모이드로 바꿔 보기
              </Chip2>
            </div>

            <div className="space-y-2.5">
              {u.map((v, i) => (
                <Slider2
                  key={CLASSES[i]}
                  label={`u${i + 1} · ${CLASSES[i]}`}
                  value={v}
                  min={-3}
                  max={5}
                  step={0.1}
                  onChange={(nv) => set(i, nv)}
                  display={fmt(v, 1)}
                />
              ))}
            </div>

            <div
              className={`mt-3 rounded-lg px-2.5 py-2 text-center text-[12px] font-bold ${
                act === "softmax"
                  ? "bg-indigo-50 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-200"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
              }`}
            >
              출력의 합 = {fmt(total, 4)}
              {act === "sigmoid" && (
                <span className="ml-1 font-normal">— 1이 아니므로 확률분포로 쓸 수 없습니다</span>
              )}
            </div>
          </Card>

          <Card className="min-w-0">
            <CardTitle>출력과 추론 결과</CardTitle>
            <div className="space-y-2.5">
              {out.map((p, i) => (
                <div key={CLASSES[i]}>
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span
                      className={`font-semibold ${
                        i === argmax ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500"
                      }`}
                    >
                      ŷ{i + 1} · {CLASSES[i]}
                      {i === label && <span className="ml-1 text-rose-500">· 레이블</span>}
                    </span>
                    <span className="font-mono font-bold text-gray-700 dark:text-gray-200">
                      {fmt(p, 4)}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${
                        i === argmax ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                      style={{ width: `${Math.round(Math.min(1, p) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <F className="mt-3" note="가장 큰 확률을 갖는 출력의 클래스로 분류한다">
              class = argmax<sub>i</sub> ŷ<sub>i</sub> → {CLASSES[argmax]}
            </F>

            <Scroller>
              <svg viewBox="0 0 300 92" className="mt-2 h-auto w-full min-w-[300px]" role="img">
                <title>가중합이 소프트맥스를 거쳐 확률이 되고, 가장 큰 값의 클래스가 선택되는 흐름</title>
                {[22, 46, 70].map((y, i) => (
                  <g key={i}>
                    <circle
                      cx="30"
                      cy={y}
                      r="11"
                      strokeWidth="1.5"
                      className="fill-white stroke-gray-400 dark:fill-gray-900 dark:stroke-gray-600"
                    />
                    <text
                      x="30"
                      y={y + 3}
                      textAnchor="middle"
                      className="fill-gray-600 text-[8px] font-bold dark:fill-gray-300"
                    >
                      u{i + 1}
                    </text>
                    <line x1="41" y1={y} x2="92" y2={y} strokeWidth="1.2" className="stroke-gray-300" />
                    <line x1="124" y1={y} x2="176" y2={y} strokeWidth="1.2" className="stroke-gray-300" />
                    <text
                      x="186"
                      y={y + 3}
                      className={`text-[9px] font-bold ${
                        i === argmax ? "fill-indigo-600 dark:fill-indigo-400" : "fill-gray-400"
                      }`}
                    >
                      ŷ{i + 1} = {fmt(out[i], 3)}
                    </text>
                  </g>
                ))}
                <rect
                  x="92"
                  y="10"
                  width="32"
                  height="72"
                  rx="4"
                  strokeWidth="1.5"
                  className="fill-indigo-50 stroke-indigo-500 dark:fill-indigo-950/60 dark:stroke-indigo-400"
                />
                <text
                  x="108"
                  y="50"
                  textAnchor="middle"
                  className="fill-indigo-700 text-[8px] font-bold dark:fill-indigo-200"
                >
                  {act === "softmax" ? "softmax" : "sigmoid"}
                </text>
                <path
                  d="M 262 22 Q 276 46 262 70"
                  fill="none"
                  strokeWidth="1.4"
                  className="stroke-rose-400"
                />
                <text x="268" y="50" className="fill-rose-500 text-[8px] font-bold">
                  argmax
                </text>
              </svg>
            </Scroller>
          </Card>
        </div>
      </Sourced>

      <Sourced
        className="mt-4"
        refs={{
          slides: "1. 다중 클래스 분류를 위한 활성함수 및 손실함수 — 교차 엔트로피(cross entropy) 손실함수 / BP 학습을 위한 출력층 노드의 δ 계산",
        }}
      >
        <Card>
          <CardTitle>교차 엔트로피와, 그래서 간단해지는 델타</CardTitle>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <F note="레이블은 정답 자리만 1인 one-hot 벡터">
                E(ŷ, y) = Σ<sub>i=1</sub><sup>N</sup> −y<sub>i</sub> ln ŷ<sub>i</sub>
              </F>
              <div className="mt-3 mb-2 text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                정답 클래스를 골라 보세요
              </div>
              <div className="flex flex-wrap gap-2">
                {CLASSES.map((c, i) => (
                  <Chip2 key={c} active={label === i} onClick={() => setLabel(i)}>
                    {c}
                  </Chip2>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                <Cell label="one-hot 레이블" value={`(${oneHot.join(", ")})`} />
                <Cell label="교차 엔트로피 E" value={fmt(ce, 4)} highlight tone="rose" />
              </div>
              <Hint>
                정답 자리의 확률이 1에 가까울수록 손실이 0에 가까워지고, 0에 가까우면 손실이 급격히
                커집니다. 추정된 확률분포와 레이블의 확률분포 차이를 재는 손실함수입니다.
              </Hint>
            </div>

            <div className="min-w-0">
              <F note="소프트맥스 + 교차 엔트로피일 때의 출력층 델타">
                δ<sub>k</sub><sup>(L)</sup> = ŷ<sub>k</sub> − y<sub>k</sub>
              </F>
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                {deltas.map((d, i) => (
                  <Cell
                    key={CLASSES[i]}
                    label={`δ${i + 1}`}
                    value={fmt(d, 4)}
                    highlight={i === label}
                    tone={i === label ? "rose" : "gray"}
                  />
                ))}
              </div>
              <Hint>
                시그모이드와 평균제곱오차를 쓸 때는 δ에 ŷ(1 − ŷ)가 곱해졌지만, 소프트맥스와 교차
                엔트로피를 짝지어 쓰면 δ가 ŷ − y 하나로 정리됩니다. 뒤 계산은 앞에서 본 역전파와
                똑같습니다.
              </Hint>
              <Scroller>
                <pre className="mt-2 min-w-[280px] overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11.5px] leading-5 text-gray-100 dark:bg-gray-950">
                  <code>{`bp_iris_multi = BP_Model([nDim, 4, nClasses],
                         loss='ce',
                         activation_h='sigmoid',
                         activation_o='softmax')
bp_iris_multi.fit(X, y, nSamples, epochs=1000,
                  eta=0.01, momentum=0.9)`}</code>
                </pre>
              </Scroller>
            </div>
          </div>
          <ComputedNote>
            위 가중합 u₁·u₂·u₃의 초깃값은 소프트맥스의 동작을 보여주려고 이 페이지에서 정한
            예시입니다. 식과 모델 설정은 강의록 그대로입니다.
          </ComputedNote>
        </Card>
      </Sourced>
    </section>
  );
}
