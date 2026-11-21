"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle } from "@/components/dlShared/ui";

export default function AlexNetTraining() {
  const [input, setInput] = useState(3);

  return (
    <section id="alexnet-training" className="scroll-mt-32">
      <SectionTitle title="AlexNet의 학습 시간을 줄인 두 선택" subtitle="활성함수가 수렴에 미치는 영향과 GPU가 연산을 나누는 방식을 살펴보세요." />
      <Sourced refs={{ slides: "슬라이드 8–9 — ReLU 학습 오류 곡선과 두 GPU의 연결도", lecture: "15:04–15:54 — tanh와 ReLU의 출력 및 학습 속도 비교" }}>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardTitle>같은 입력을 ReLU와 tanh에 넣으면?</CardTitle>
            <label className="mt-3 block text-sm">활성함수에 들어가는 값 <b>{input}</b>
              <input type="range" min={-5} max={5} step={0.5} value={input} onChange={e => setInput(Number(e.target.value))} className="mt-3 block w-full accent-teal-600" />
            </label>
            <div className="my-3 grid grid-cols-2 gap-2 text-center text-sm">
              <p className="rounded-lg bg-teal-50 p-3 dark:bg-teal-950/40">ReLU 출력 <b className="block font-mono">{Math.max(0, input).toFixed(3)}</b></p>
              <p className="rounded-lg bg-violet-50 p-3 dark:bg-violet-950/40">tanh 출력 <b className="block font-mono">{Math.tanh(input).toFixed(3)}</b></p>
            </div>
            <p className="text-sm leading-6">입력을 3에서 5로 옮겨 보세요. tanh의 출력은 1에 가까워져 변화가 작습니다. ReLU는 양수 구간에서 입력의 변화가 그대로 전달되고, 음수 입력에서는 출력이 0입니다.</p>
            <p className="mt-2 text-sm leading-6">강의의 비교 실험에서 ReLU를 쓴 신경망은 같은 훈련 오류율 25%에 tanh보다 약 6배 빨리 도달했습니다. 그래프를 읽을 때는 같은 오류율에서 가로축의 에폭 수를 비교합니다.</p>
          </Card>
          <Card>
            <CardTitle>두 GPU가 하나의 모델을 나누어 계산</CardTitle>
            <p className="mt-3 text-sm leading-6">AlexNet 구조도에서 위아래 두 경로는 두 GPU가 맡은 특징 맵입니다. 첫 합성곱의 필터 96개를 나누면 GPU마다 48개의 특징 맵을 계산합니다.</p>
            <div className="my-3 grid grid-cols-2 gap-2 text-center text-sm font-semibold">
              {["GPU 1", "GPU 2"].map(gpu => <p key={gpu} className="rounded-lg border border-teal-200 p-3 dark:border-teal-800">{gpu}<span className="block font-mono">55×55×48</span></p>)}
            </div>
            <p className="text-sm leading-6">두 경로를 합쳐 첫 층의 출력은 55×55×96입니다. 세 번째 합성곱(C3)에서는 각 GPU가 두 번째 층의 양쪽 특징 맵을 모두 받아 계산합니다. 마지막에는 한 이미지에 대한 분류 결과를 만듭니다.</p>
            <p className="mt-2 text-sm leading-6">강의에서 비교한 당시 환경에서 CPU 학습 예상 시간은 50~60일, GTX 580 두 장으로 수행한 학습은 5~6일이었습니다.</p>
          </Card>
        </div>
      </Sourced>
    </section>
  );
}
