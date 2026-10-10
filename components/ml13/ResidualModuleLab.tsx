"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Formula, Hint, Scroller, Slider } from "./ui";

/**
 * 13.1.2 객체인식을 위한 CNN 모델 — 층수와 성능, 그리고 ResNet의 잔차 모듈.
 * H(x) = F(x) + x 와 ∂H/∂x = ∂F/∂x + 1 은 정확한 식이고,
 * 블록마다 같은 값을 가진다는 가정만 이 화면에서 둔 것이다.
 */

function fmtSignal(v: number): string {
  if (v === 0) return "0";
  if (v >= 1e-3 && v < 1e5) return v.toPrecision(4);
  return v.toExponential(2);
}

export default function ResidualModuleLab() {
  const [L, setL] = useState(20);
  const [a, setA] = useState(0.7);

  const plain = a ** L;
  const residual = (a + 1) ** L;

  return (
    <section id="residual" className="scroll-mt-32">
      <SectionTitle
        title="층수와 성능, 그리고 ResNet의 잔차 모듈"
        subtitle="층을 더 쌓으면 더 좋아지는가 — 그 물음에 대한 답과, 스킵 연결이 바꾸는 한 가지"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "13.1.2 객체인식을 위한 CNN 모델 — 층수와 성능",
            slides: "층수와 성능?",
          }}
        >
          <Card>
            <CardTitle>층수가 더 많아지면 성능도 더 향상되는가</CardTitle>
            <Scroller>
              <div className="flex min-w-[340px] items-center gap-2">
                {[
                  { n: "AlexNet", l: "8층" },
                  { n: "VGG", l: "19층" },
                  { n: "GoogLeNet", l: "22층" },
                  { n: "???", l: "?층" },
                ].map((m, i) => (
                  <div key={m.n} className="flex flex-1 items-center gap-2">
                    <div
                      className={`flex-1 rounded-lg border p-2 text-center ${
                        i === 3
                          ? "border-dashed border-amber-400 bg-amber-50 dark:bg-amber-950/30"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <p className="text-[11px] font-bold text-gray-700 dark:text-gray-200">
                        {m.n}
                      </p>
                      <p className="text-[11px] text-blue-600 dark:text-blue-400">{m.l}</p>
                    </div>
                    {i < 3 && <span className="text-gray-300">→</span>}
                  </div>
                ))}
              </div>
            </Scroller>

            <div className="mt-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <p className="mb-2 text-[11px] font-semibold text-gray-500">
                강의록의 실험 — CIFAR-10에서 20층과 56층을 비교
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                {[
                  { k: "학습 데이터", v: "50,000개" },
                  { k: "테스트 데이터", v: "10,000개" },
                  { k: "클래스", v: "10개" },
                  { k: "영상 크기", v: "32 × 32" },
                ].map((x) => (
                  <div
                    key={x.k}
                    className="rounded-md bg-gray-50 p-2 text-center dark:bg-gray-800/60"
                  >
                    <p className="text-[10px] text-gray-500">{x.k}</p>
                    <p className="text-[12px] font-bold text-gray-700 dark:text-gray-200">{x.v}</p>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                결과는 기대와 달랐다. 56층 모델이 20층 모델보다 <strong>학습오차도 더 크고 테스트
                오차도 더 컸다</strong>. 강의록은 이를 두고 “역전파 시 기울기 소멸 문제 등으로 인해
                층수가 더 많음에도 불구하고 성능은 떨어짐”이라고 적는다. 교재도 “층이 깊어지면 오류
                역전파 학습이 점점 더 어려워지기 때문에 반드시 층수에 비례하여 성능이 향상된다고 볼
                수는 없고, 이러한 예측이 실험적으로도 확인되었다”고 설명한다.
              </p>
            </div>
            <Hint>
              학습오차까지 함께 커졌다는 점이 중요하다. 과다적합이라면 학습오차는 작고 테스트 오차만
              커져야 한다. 두 오차가 같이 커졌다는 것은 애초에 학습 자체가 잘 되지 않았다는 뜻이다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "13.1.2 객체인식을 위한 CNN 모델 — ResNet의 잔차 모듈",
            slides: "ResNet — 잔차 모듈",
          }}
        >
          <Card>
            <CardTitle>일반적인 층 구조와 잔차 모듈</CardTitle>
            <Scroller>
              <div className="grid min-w-[360px] grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className="mb-2 text-center text-[11px] font-bold text-gray-500">
                    일반적인 층 구조
                  </p>
                  <div className="space-y-1 text-center">
                    <p className="font-mono text-[12px] font-bold">𝒙</p>
                    <p className="text-gray-300">↓</p>
                    <p className="rounded-md bg-gray-100 py-1 text-[11px] dark:bg-gray-800">
                      weight layer
                    </p>
                    <p className="text-[10px] text-gray-400">ReLU</p>
                    <p className="rounded-md bg-gray-100 py-1 text-[11px] dark:bg-gray-800">
                      weight layer
                    </p>
                    <p className="text-[10px] text-gray-400">ReLU</p>
                    <p className="font-mono text-[12px] font-bold">H(𝒙)</p>
                  </div>
                </div>

                <div className="rounded-lg border-2 border-blue-400 p-3 dark:border-blue-600">
                  <p className="mb-2 text-center text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    Residual Net
                  </p>
                  <div className="relative space-y-1 text-center">
                    <p className="font-mono text-[12px] font-bold">𝒙</p>
                    <p className="text-gray-300">↓</p>
                    <p className="rounded-md bg-blue-50 py-1 text-[11px] dark:bg-blue-950/40">
                      weight layer
                    </p>
                    <p className="text-[10px] text-gray-400">ReLU</p>
                    <p className="rounded-md bg-blue-50 py-1 text-[11px] dark:bg-blue-950/40">
                      weight layer
                    </p>
                    <p className="text-[12px] font-bold text-blue-600 dark:text-blue-400">
                      ⊕ ← 𝒙
                    </p>
                    <p className="text-[10px] text-gray-400">ReLU</p>
                    <p className="font-mono text-[12px] font-bold">H(𝒙) = F(𝒙) + 𝒙</p>
                  </div>
                  <p className="mt-2 text-center text-[10px] font-semibold text-blue-500">
                    “스킵 연결” skip connection
                  </p>
                </div>
              </div>
            </Scroller>

            <div className="mt-3">
              <Formula note="모듈의 출력은 2개 층을 거쳐서 나온 F(𝒙)에 원래 입력 𝒙가 더해져 결정된다">
                H(𝒙) = F(𝒙) + 𝒙 &nbsp;⟹&nbsp; F(𝒙) = H(𝒙) − 𝒙 &nbsp;(“잔차”)
              </Formula>
            </div>
            <p className="mt-2 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              이 모듈에서 학습해야 하는 정보는 원하는 출력값 전체 F(𝒙) + 𝒙가 아니라{" "}
              <strong>원하는 출력과 입력 간의 잔차 F(𝒙)</strong>다. 결국 각 모듈은 잔차 부분만
              학습하면 되고, 스킵 연결을 통해 오차 신호도 좀 더 효과적으로 전달된다.
            </p>
          </Card>
        </Sourced>

        <Sourced refs={{ slides: "ResNet — 이점" }}>
          <Card>
            <CardTitle>스킵 연결이 역전파에서 바꾸는 것</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              H(𝒙) = F(𝒙) + 𝒙를 𝒙로 미분하면 ∂H/∂𝒙 = ∂F/∂𝒙 + <strong>1</strong>이 된다. 곱해지는 값에
              1이 붙는다는 점이 전부다. 블록마다 같은 값을 가진다고 두고 L개를 곱해 보면 차이가
              드러난다.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Slider
                label="쌓은 블록의 수 L"
                value={L}
                min={2}
                max={60}
                step={1}
                onChange={setL}
                display={`${L}개`}
              />
              <Slider
                label="블록 하나가 기울기에 곱하는 값 ∂F/∂𝒙"
                value={a}
                min={0.1}
                max={0.95}
                step={0.05}
                onChange={setA}
                display={a.toFixed(2)}
              />
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[11px] font-semibold text-gray-500">일반적인 층 구조</p>
                <p className="mt-1 font-mono text-[12.5px] text-gray-700 dark:text-gray-200">
                  {a.toFixed(2)}
                  <sup>{L}</sup> = {fmtSignal(plain)}
                </p>
                <div className="mt-2 h-2.5 rounded-sm bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-2.5 rounded-sm bg-rose-500"
                    style={{ width: `${Math.min(100, plain * 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-[10.5px] text-rose-500">
                  {plain < 0.01 ? "입력 쪽에 닿을 무렵 신호가 거의 사라진다" : "아직 신호가 남아 있다"}
                </p>
              </div>
              <div className="rounded-lg border border-blue-300 p-3 dark:border-blue-700">
                <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  잔차 모듈 (스킵 연결)
                </p>
                <p className="mt-1 font-mono text-[12.5px] text-gray-700 dark:text-gray-200">
                  ({a.toFixed(2)} + 1)<sup>{L}</sup> = {fmtSignal(residual)}
                </p>
                <div className="mt-2 h-2.5 rounded-sm bg-gray-100 dark:bg-gray-800">
                  <div className="h-2.5 w-full rounded-sm bg-blue-600" />
                </div>
                <p className="mt-1 text-[10.5px] text-blue-600 dark:text-blue-400">
                  모든 블록에서 1을 고른 항이 정확히 하나 있고 그 값은 1이다 — 곧 입력이 그대로
                  건너가는 길이며, 그래서 곱이 0으로 수렴하지 않는다
                </p>
              </div>
            </div>

            <div className="mt-3">
              <ComputedNote>
                ∂H/∂𝒙 = ∂F/∂𝒙 + 1은 H(𝒙) = F(𝒙) + 𝒙에서 바로 나오는 식입니다. 다만 모든 블록이 같은
                ∂F/∂𝒙 값을 가진다는 가정과 그 값의 범위는 이 화면에서 둔 것으로, 원자료에는 없습니다.
                실제 학습에서는 블록마다 값이 다르고 부호도 섞이므로 여기서 볼 것은 숫자의 크기가
                아니라 <strong>한쪽은 0으로 사라지고 다른 쪽은 그렇지 않다</strong>는 점입니다.
              </ComputedNote>
            </div>

            <ul className="mt-3 space-y-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              <li>• 매우 깊은 층을 가진 네트워크도 성능 저하 없이 학습이 가능하다.</li>
              <li>• 잔차 블록(residual block)의 학습이 용이하다.</li>
              <li>
                • 스킵 연결을 통해 오차 신호가 소멸되는 현상이 완화되는 등으로 인해 효과적인 역전파가
                가능하다.
              </li>
            </ul>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "13.1.2 객체인식을 위한 CNN 모델 — ResNet",
            slides: "ResNet — 일반 모델과 ResNet 비교",
          }}
        >
          <Card>
            <CardTitle>잔차 모듈의 효과가 입증된 방식</CardTitle>
            <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              교재와 강의록은 <strong>34개 층을 가진 ResNet-34</strong>와 <strong>같은 층수를 가진
              기본 모델</strong>, 그리고 VGG-19를 나란히 놓고 비교한다. 층수를 똑같이 맞춘 채 잔차
              모듈의 유무만 바꾸었기 때문에, 성능 차이를 잔차 모듈의 효과로 읽을 수 있다. 이렇게 하여
              ResNet은 모델의 층수를 <strong>152개</strong>까지 확장하는 데 성공했고,
              ILSVRC2015에서 오류율 3.57%를 기록했다.
            </p>
            <Hint>
              ResNet 역시 층의 개수를 달리하여 여러 버전의 학습된 모델들이 공개 소스로 제공된다.
              교재는 ResNet 이후에도 다양한 모델이 개발되었으나 혁신적인 변화는 크지 않고, 계산량을
              줄인 가벼운 모델의 개발이나 WideResNet과 같이 각 층의 규모를 넓혀 성능을 개선한 모델
              등이 개발되었다고 덧붙인다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
