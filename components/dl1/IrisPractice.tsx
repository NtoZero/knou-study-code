"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Scroller, Chip, ComputedNote, Tag, num } from "@/components/dlShared/ui";
import {
  countCorrect,
  irisSpecies,
  type Boundary,
  type IrisSpecies,
} from "@/components/dl1/irisData";
import { PLOT, PlotFrame, PetalPoints, boundarySegment, positiveRegion } from "@/components/dl1/plot";

/** 강의록이 보여 준, 각 종류를 식별하도록 학습된 퍼셉트론의 결정경계 */
const trained: Record<IrisSpecies, { bd: Boundary; eq: string; verdict: string }> = {
  setosa: {
    bd: { w1: -0.32, w2: -0.963, b: 1.125 },
    eq: "−0.320x₁ − 0.963x₂ + 1.125 = 0",
    verdict: "setosa 무리와 나머지가 직선 하나로 깨끗하게 갈라짐 — 선형 분리가 가능한 경우.",
  },
  virginica: {
    bd: { w1: 0.183, w2: 0.926, b: -2.323 },
    eq: "0.183x₁ + 0.926x₂ − 2.323 = 0",
    verdict: "대체로 갈리지만 경계 부근에서 섞인 표본이 남음.",
  },
  versicolor: {
    bd: { w1: 0.19, w2: -0.399, b: -0.183 },
    eq: "0.190x₁ − 0.399x₂ − 0.183 = 0",
    verdict:
      "versicolor는 거의 다 맞혔지만 나머지 종류까지 같은 영역에 들어와 버림 — 직선 하나로는 가를 수 없는 배치.",
  },
};

const steps: { title: string; body: string; code?: string }[] = [
  {
    title: "prepare_data(target)",
    body:
      "붓꽃 데이터 집합을 읽어 학습에 사용할 데이터 반환. target 에 지정된 종류의 붓꽃이면 1, 그 외의 종류이면 0 으로 레이블을 붙임.",
    code: `X_tr, y_tr, labels = prepare_data('setosa')
  X_tr  = [[1.4, 0.2], [1.4, 0.2], [1.3, 0.2], ...]
  y_tr  = [1, 1, 1, ...]
  labels = ['(1) setosa', '(0) the others']`,
  },
  {
    title: "step(x)",
    body: "단위 계단 함수 — x ≥ 0 이면 1, x < 0 이면 0. 퍼셉트론의 활성함수로 넘겨 쓴다.",
  },
  {
    title: "class Perceptron",
    body:
      "퍼셉트론 객체를 만들기 위한 클래스. 속성은 dim · activation · w · b, 메소드는 __init__ · printW · predict · fit.",
  },
  {
    title: "fit( ) 안쪽 — 학습이 실제로 일어나는 세 줄",
    body:
      "표본 하나마다 오차 δ 를 구하고, 그 δ 와 입력의 곱만큼 w 와 b 를 줄인다. 앞에서 본 업데이트 식 그대로다.",
    code: `delta = self.predict([X[i]])[0] - y[i]
self.w -= eta * delta * X[i]
self.b -= eta * delta`,
  },
  {
    title: "훈련 데이터 준비 · 객체 생성 및 학습",
    body: "식별하고자 하는 붓꽃 종류를 target 으로 지정한 뒤, 활성함수로 step 을 넘겨 1000회 반복 학습.",
    code: `nSamples = 150
nDim = 2
target = 'setosa'
X_tr, y_tr, labels = prepare_data(target)

p = Perceptron(nDim, activation=step)
p.fit(X_tr, y_tr, nSamples, epochs=1000, eta=0.01)`,
  },
  {
    title: "visualize( )",
    body:
      "특징 공간의 각 좌표를 하나하나 표본처럼 넣어 보고, 1로 인식되면 자홍색 · 0으로 인식되면 파란색 점을 찍어 결정 영역을 눈으로 보여 준다.",
  },
];

export default function IrisPractice() {
  const [target, setTarget] = useState<IrisSpecies>("setosa");
  const [openStep, setOpenStep] = useState(0);

  const t = trained[target];
  const ti = irisSpecies.indexOf(target);
  const seg = boundarySegment(t.bd);
  const poly = positiveRegion(t.bd);
  const correct = countCorrect(t.bd, target);

  return (
    <section id="iris-practice" className="scroll-mt-32">
      <SectionTitle
        title="실습 — 퍼셉트론을 이용한 붓꽃 식별"
        subtitle="식별할 종류를 바꿔 가며, 학습된 경계가 어디까지 통하는지 확인합니다"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "3. 실습 - 퍼셉트론을 이용한 붓꽃 식별 — 피셔의 붓꽃 데이터 집합(Fisher’s Iris flower data set)",
            lecture: "특징 4개 가운데 꽃잎의 길이와 폭 둘만 써서 2차원으로 줄였다고 설명",
          }}
        >
          <Card>
            <CardTitle>피셔의 붓꽃 데이터 집합</CardTitle>
            <ul className="space-y-1 text-[12.5px] leading-6 text-gray-600 dark:text-gray-300">
              <li>• Edgar Anderson이 수집한 붓꽃 데이터 집합.</li>
              <li>• ‘setosa’, ‘virginica’, ‘versicolor’라는 세 종류 붓꽃의 특징 데이터.</li>
              <li>• 특징: 꽃받침(sepal)과 꽃잎(petal)의 길이와 폭 — 종류별로 50개의 데이터로 구성됨.</li>
            </ul>
            <Hint>
              실습에서는 네 가지 특징 가운데 <b>꽃잎의 길이와 폭</b> 두 개만 써서 2차원 평면에 그립니다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "3. 실습 — ‘setosa’ / ‘virginica’ / ‘versicolor’를 식별하도록 학습된 퍼셉트론의 결정경계",
            lecture: "versicolor처럼 선형 결정경계가 아닌 문제는 단층 퍼셉트론이 제대로 훈련될 수 없다",
          }}
        >
          <Card>
            <CardTitle>학습된 퍼셉트론의 결정경계</CardTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              {irisSpecies.map((s) => (
                <Chip key={s} active={target === s} onClick={() => setTarget(s)}>
                  {s}
                </Chip>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
              <Scroller>
                <svg viewBox={`0 0 ${PLOT.w} ${PLOT.h}`} className="h-auto w-[360px] min-w-[320px]">
                  <rect
                    x={PLOT.left}
                    y={PLOT.top}
                    width={PLOT.w - PLOT.left - PLOT.right}
                    height={PLOT.h - PLOT.top - PLOT.bottom}
                    className="fill-blue-50 dark:fill-blue-950/30"
                  />
                  {poly && <polygon points={poly} className="fill-fuchsia-100 dark:fill-fuchsia-900/30" />}
                  <PlotFrame />
                  <PetalPoints targetIndex={ti} />
                  {seg && (
                    <line x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2} stroke="#b91c1c" strokeWidth={2} />
                  )}
                </svg>
              </Scroller>

              <div className="min-w-0 space-y-2">
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                  <p className="text-[11px] font-bold text-gray-500">학습 결과 경계식</p>
                  <p className="mt-1 font-mono text-[12.5px] text-gray-800 dark:text-gray-100">{t.eq}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Tag tone="teal">자홍색 점 · 영역 : (1) {target}</Tag>
                  <Tag>파란 점 · 영역 : (0) the others</Tag>
                </div>
                <p className="text-[12.5px] leading-6 text-gray-600 dark:text-gray-300">{t.verdict}</p>
                <ComputedNote>
                  이 경계를 학습표본 150개에 그대로 적용하면 {num(correct)}개를 맞힙니다 — 경계식은
                  강의록 값이고, 맞힌 개수는 이 페이지에서 센 것입니다.
                </ComputedNote>
              </div>
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ slides: "3. 실습 — 실습 프로그램의 구성 (함수 목록 · 클래스 선언 · 코드 1-1)" }}>
          <Card>
            <CardTitle>실습 프로그램은 어떤 순서로 돌아가나</CardTitle>
            <div className="space-y-2">
              {steps.map((s, i) => {
                const open = openStep === i;
                return (
                  <div
                    key={s.title}
                    className={`rounded-lg border ${
                      open ? "border-teal-300 dark:border-teal-800" : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenStep(open ? -1 : i)}
                      className="flex w-full items-center gap-2 p-2.5 text-left"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1 font-mono text-[12px] font-semibold text-gray-800 dark:text-gray-100">
                        {s.title}
                      </span>
                    </button>
                    {open && (
                      <div className="border-t border-gray-100 px-3 pb-3 pt-2 dark:border-gray-800">
                        <p className="text-[12.5px] leading-6 text-gray-600 dark:text-gray-300">{s.body}</p>
                        {s.code && (
                          <Scroller>
                            <pre className="mt-2 w-full overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11.5px] leading-5 text-gray-100">
                              {s.code}
                            </pre>
                          </Scroller>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <Hint>
              코드 전체가 아니라 퍼셉트론의 훈련과 관련된 부분만 추렸습니다. 강의에서도 나머지 함수는 무슨
              일을 하는지만 짚고 넘어갔습니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
