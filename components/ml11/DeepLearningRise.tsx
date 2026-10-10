"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Hint, Scroller, Slider, Tag, num } from "./ui";

const FACTORS = [
  {
    title: "충분히 큰 학습 데이터 집합의 사용",
    detail:
      "인터넷을 활용하여 쉽게 많은 데이터를 수집할 수 있게 되면서, 모델이 복잡해서 일반화 성능이 떨어지는 문제를 해결하게 되었다.",
  },
  {
    title: "컴퓨터 파워의 향상과 GPU 병렬처리",
    detail:
      "느린 학습의 문제를 시간적인 측면에서 보완할 수 있도록 컴퓨팅 파워가 향상되고 GPU(그래픽 처리장치)를 활용하는 기술이 적극적으로 적용되었다.",
  },
  {
    title: "성능 향상을 위한 다양한 학습 기법의 개발",
    detail: "지역 극소·느린 학습·과다적합에 대응하는 기법들이 개발되었다. 이어지는 절에서 하나씩 살펴본다.",
  },
  {
    title: "CNN·LSTM과 같은 더 정교한 모델의 등장",
    detail: "영상이나 음성과 같은 데이터를 좀 더 효과적으로 처리할 수 있는 모델들이 등장하였다.",
  },
];

const SHALLOW = ["원본 데이터", "다양한 특징 추출 (HOG · LBP · PCA)", "특징벡터", "간단한 분류기 (MLP · SVM)"];
const DEEP = ["원본 데이터", "앞쪽 은닉층 — 저급 수준의 특징", "뒤쪽 은닉층 — 추상적·고급 수준의 특징", "분류 결과"];

const IN_DIM = 784;
const OUT_DIM = 10;

export default function DeepLearningRise() {
  const [layers, setLayers] = useState(5);
  const [nodes, setNodes] = useState(64);
  const [mode, setMode] = useState<"shallow" | "deep">("shallow");

  const deepWeights = IN_DIM * nodes + (layers - 1) * nodes * nodes + nodes * OUT_DIM;
  const perHidden = IN_DIM + OUT_DIM;
  const equalWide = deepWeights / perHidden;

  return (
    <section id="deep-learning-rise" className="scroll-mt-32">
      <SectionTitle
        title="딥러닝의 등장 — 다층 퍼셉트론에서 심층 신경망으로"
        subtitle="은닉층을 깊게 쌓으면 무엇이 좋아지고 무엇이 어려워지는지부터 정리합니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.1 딥러닝의 등장",
            slides: "MLP에서 심층 신경망으로 — 딥러닝",
          }}
        >
          <Card>
            <CardTitle>딥러닝과 심층 신경망</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              딥러닝은 <strong>심층 신경망(deep neural network) 기반의 머신러닝 분야</strong>입니다. 심층
              신경망이라는 용어는 힌턴(Hinton)에 의해 개발된 모델(층의 수가 4~5개에 불과)에서 처음 사용되었고,
              여기서 ‘심층(deep)’은 층이 깊다는 의미로 입력층과 출력층을 제외하고 많은 수(심지어 수십 개에서
              수백 개)의 은닉층을 갖는 다층 퍼셉트론 형태로 볼 수 있습니다. 전통적으로 다층 퍼셉트론은 주로
              하나의 은닉층만을 사용하며, 심층 신경망과 반대되는 개념으로 <strong>얕은(shallow) 신경망</strong>
              이라는 용어도 사용합니다.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-lime-200 bg-lime-50/60 p-3 dark:border-lime-900 dark:bg-lime-950/30">
                <Tag tone="lime">장점</Tag>
                <p className="mt-1.5 text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                  더 효율적인 표현이 가능. 은닉층의 개수를 늘려 가중치 개수가 늘어나면 신경망의 복잡도가 높아지고
                  표현 효율이 향상되어 아무리 복잡한 학습 문제라도 해결할 수 있게 된다.
                </p>
              </div>
              <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-3 dark:border-rose-900 dark:bg-rose-950/30">
                <Tag tone="rose">단점</Tag>
                <p className="mt-1.5 text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                  학습의 어려움 — 느린 수렴 속도와 낮은 일반화 성능. 심층으로 구성하면 학습이 느려지고 과다적합
                  등으로 인해 일반화 성능이 떨어진다.
                </p>
              </div>
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "12.1 — 같은 가중치 개수를 어떻게 나누는가" }}>
          <Card>
            <CardTitle>같은 가중치 개수라면 넓게보다 깊게</CardTitle>
            <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              교재는 “하나의 은닉층만 사용하면서 가중치의 개수를 늘릴 수도 있지만, 동일한 가중치 개수를 갖는
              경우에는 많은 노드를 하나의 은닉층으로 구성하는 것보다는 다층으로 깊게 구성하는 것이 더 효율적인
              표현이 가능하다”고 말합니다. 아래에서 가중치 개수를 직접 세어, 깊은 신경망 하나와 같은 예산의
              얕은 신경망이 어떤 모습인지 확인해 보세요.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className="space-y-3">
                <Slider
                  label="은닉층 수"
                  value={layers}
                  min={1}
                  max={10}
                  step={1}
                  onChange={setLayers}
                  display={`${layers}개`}
                />
                <Slider
                  label="은닉층마다의 노드 수"
                  value={nodes}
                  min={16}
                  max={256}
                  step={8}
                  onChange={setNodes}
                  display={`${nodes}개`}
                />
                <Hint>
                  입력 {IN_DIM}개(28×28 영상을 편 것), 출력 {OUT_DIM}개로 고정했습니다. 바이어스는 세지 않고
                  연결 가중치만 셉니다.
                </Hint>
              </div>

              <div className="space-y-3">
                <Scroller>
                  <svg viewBox="0 0 440 120" className="h-auto w-full min-w-[380px]">
                    {(() => {
                      const shown = Math.min(layers, 8);
                      const gap = 360 / (shown + 1);
                      return (
                        <>
                          <circle cx={20} cy={60} r={9} fill="#94a3b8" />
                          <text x={20} y={94} fontSize="8" textAnchor="middle" fill="#64748b">
                            입력 {IN_DIM}
                          </text>
                          {Array.from({ length: shown }, (_, i) => (
                            <g key={i}>
                              <line
                                x1={i === 0 ? 29 : 20 + i * gap + 7}
                                y1={60}
                                x2={20 + (i + 1) * gap - 7}
                                y2={60}
                                stroke="#d9f99d"
                                strokeWidth={3}
                              />
                              <rect
                                x={20 + (i + 1) * gap - 7}
                                y={60 - Math.min(44, nodes / 3)}
                                width={14}
                                height={Math.min(88, (nodes / 3) * 2)}
                                rx={4}
                                fill="#65a30d"
                                opacity={0.85}
                              />
                            </g>
                          ))}
                          {layers > shown && (
                            <text x={20 + shown * gap + 20} y={64} fontSize="9" fill="#64748b">
                              … {layers}개 층
                            </text>
                          )}
                          <line
                            x1={20 + shown * gap + 7}
                            y1={60}
                            x2={412}
                            y2={60}
                            stroke="#d9f99d"
                            strokeWidth={3}
                          />
                          <circle cx={420} cy={60} r={7} fill="#94a3b8" />
                          <text x={420} y={94} fontSize="8" textAnchor="middle" fill="#64748b">
                            출력 {OUT_DIM}
                          </text>
                          <text x={220} y={16} fontSize="9" textAnchor="middle" fill="#65a30d">
                            막대 높이 = 그 층의 노드 수
                          </text>
                        </>
                      );
                    })()}
                  </svg>
                </Scroller>

                <div className="rounded-lg bg-gray-50 p-3 font-mono text-[11px] leading-6 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  <div>
                    깊은 쪽 = {IN_DIM}×{nodes} + {layers - 1}×{nodes}×{nodes} + {nodes}×{OUT_DIM} ={" "}
                    <span className="font-bold text-lime-700 dark:text-lime-400">
                      {num(deepWeights)}
                    </span>
                  </div>
                  <div>
                    같은 예산의 은닉층 1개 = {num(deepWeights)} ÷ ({IN_DIM}+{OUT_DIM}) ={" "}
                    <span className="font-bold">{equalWide.toFixed(1)}</span>개 노드
                  </div>
                </div>
                <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                  은닉층 {layers}개 × {nodes}노드와 똑같은 가중치 예산을 은닉층 하나에 몰아주면 노드{" "}
                  {equalWide.toFixed(0)}개짜리 넓은 신경망 하나가 됩니다. 두 신경망의 가중치 개수는 같지만, 교재는
                  깊게 나눈 쪽이 더 효율적인 표현을 할 수 있다고 말합니다.
                </p>
                <ComputedNote>
                  가중치 개수는 층 사이 연결을 직접 센 값입니다. 입력 {IN_DIM}·출력 {OUT_DIM}이라는 예시 크기는
                  이 페이지에서 정한 것으로, 교재·강의록에는 구체적인 숫자 예가 없습니다.
                </ComputedNote>
              </div>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.1 — 학습의 어려움을 극복하게 만든 요인",
            slides: "MLP에서 심층 신경망으로 — 학습의 어려움을 극복하게 만든 요인",
          }}
        >
          <Card>
            <CardTitle>침체기를 끝낸 네 가지 요인</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              다층 퍼셉트론을 위한 오류 역전파 학습 알고리즘이 1980년대 등장하면서 신경망은 2차 붐을 맞이하지만,
              오류 역전파 학습 알고리즘의 최대 단점인 <strong>느린 학습</strong>(비전문가 입장에서는 학습이 안
              된다고 여길 수 있을 정도)으로 인해 딥러닝이 등장하는 2010년 정도까지 신경망은 다시 침체기를 맞습니다.
              이 어려움은 다음 네 가지 요인으로 극복되었습니다.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {FACTORS.map((f, i) => (
                <div
                  key={f.title}
                  className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <p className="flex items-start gap-2 text-[12.5px] font-bold text-gray-800 dark:text-gray-100">
                    <span className="mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-lime-600 text-[9px] text-white">
                      {i + 1}
                    </span>
                    {f.title}
                  </p>
                  <p className="mt-1.5 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">{f.detail}</p>
                </div>
              ))}
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.1 — 얕은 신경망과 심층 신경망에서의 처리(그림 12-2)",
            slides: "MLP에서 심층 신경망으로 — 신경망을 통한 처리 과정에 대한 패러다임의 변화",
          }}
        >
          <Card>
            <CardTitle>처리 과정의 패러다임 변화 — 종단간 학습</CardTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMode("shallow")}
                aria-pressed={mode === "shallow"}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  mode === "shallow"
                    ? "border-gray-700 bg-gray-700 text-white"
                    : "border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                }`}
              >
                얕은 신경망을 사용한 전통적인 방법
              </button>
              <button
                type="button"
                onClick={() => setMode("deep")}
                aria-pressed={mode === "deep"}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  mode === "deep"
                    ? "border-lime-600 bg-lime-600 text-white"
                    : "border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                }`}
              >
                심층 신경망을 사용한 종단간 학습
              </button>
            </div>

            <Scroller>
              <div className="flex min-w-[420px] items-stretch gap-1.5">
                {(mode === "shallow" ? SHALLOW : DEEP).map((step, i, arr) => (
                  <div key={step} className="flex flex-1 items-center gap-1.5">
                    <div
                      className={`flex-1 rounded-lg border p-2.5 text-center text-[11px] font-semibold leading-4 ${
                        mode === "deep"
                          ? "border-lime-300 bg-lime-50 text-lime-900 dark:border-lime-800 dark:bg-lime-950/40 dark:text-lime-100"
                          : "border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {step}
                    </div>
                    {i < arr.length - 1 && <span className="shrink-0 text-gray-400">→</span>}
                  </div>
                ))}
              </div>
            </Scroller>

            <div className="mt-3 rounded-lg bg-gray-50 p-3 text-[12.5px] leading-6 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {mode === "shallow" ? (
                <>
                  얕은 신경망을 사용하는 접근 방법에서는 원본 데이터를 입력으로 그대로 사용하면 은닉층 자체를 통한
                  충분한 특징추출을 할 수 없으므로 낮은 성능을 얻게 됩니다. 따라서 <strong>별도의 특징추출
                  과정</strong>을 통해 입력 데이터로부터 특징벡터를 추출하고, 이를 신경망의 입력으로 제공합니다.
                  무엇을 특징으로 쓸지는 사람이 설계합니다.
                </>
              ) : (
                <>
                  심층 신경망에서는 분류와 마찬가지로 <strong>특징추출도 학습으로 수행</strong>합니다. 수많은
                  은닉층을 통해 다양한 특징 공간으로의 변환이 충분히 이루어지므로 입력 데이터 자체를 신경망의
                  입력으로 제공하면, 앞 단계의 은닉층을 통해서는 저급 수준의 특징을 추출하고 뒤쪽의 은닉층으로
                  갈수록 좀 더 추상적이고 고급 수준의 특징을 추출합니다. 이처럼 특징추출 과정과 특징에 의한 분류
                  과정을 한꺼번에 학습하는 방식을 <strong>종단간 학습(end-to-end learning)</strong>이라고 합니다.
                </>
              )}
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
