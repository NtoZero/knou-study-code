"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Chip } from "@/components/dlShared/ui";

const types = [
  {
    name: "기본",
    route: "깨끗한 x → 잠재 벡터 z → 복원 ŷ",
    target: "원본 x",
    note: "복원 오차를 줄이면서 입력을 설명하는 짧은 표현을 배웁니다.",
  },
  {
    name: "적층",
    route: "x → 여러 인코더 층 → z → 여러 디코더 층 → ŷ",
    target: "원본 x",
    note: "인코더와 디코더에 층을 더해 여러 단계로 특징을 추출하고 복원합니다.",
  },
  {
    name: "노이즈 제거",
    route: "잡음을 더한 x → z → 깨끗한 영상의 추정값",
    target: "잡음을 넣기 전의 x",
    note: "점이 찍힌 사진을 입력해도 비교 대상은 깨끗한 사진입니다. 같은 잡음 섞인 사진을 목표로 주면 그 점까지 복사할 수 있습니다.",
  },
  {
    name: "변이형",
    route: "x → 잠재 분포의 평균·분산 → 표본 z → ŷ",
    target: "원본 x의 재구성",
    note: "인코더가 잠재 분포의 모수를 구합니다. 그 분포에서 뽑은 값이 디코더로 가므로 입력마다 한 점을 곧바로 보내는 구조와 구분됩니다.",
  },
];

export default function ModelLab() {
  const [index, setIndex] = useState(0);
  const item = types[index];
  return (
    <section>
      <SectionTitle title="입력과 목표를 따라가는 네 가지 오토인코더" />
      <Sourced
        refs={{
          slides: "11~20쪽 · 오토인코더의 유형과 MNIST 구현",
          lecture: "21:13~21:36 · 원본에 잡음을 넣어 입력 만들기",
        }}
      >
        <Card>
          <div className="mb-4 flex flex-wrap gap-2">
            {types.map((t, i) => (
              <Chip
                key={t.name}
                active={i === index}
                onClick={() => setIndex(i)}
              >
                {t.name}
              </Chip>
            ))}
          </div>
          <div
            aria-live="polite"
            className="rounded-lg bg-teal-50 p-4 dark:bg-teal-950"
          >
            <p className="font-semibold">{item.route}</p>
            <p className="mt-2 text-sm">학습 목표 · {item.target}</p>
            <p className="mt-1 text-sm">{item.note}</p>
          </div>
          <div className="mt-5">
            <CardTitle>MNIST 한 장의 모양을 끝까지 추적하기</CardTitle>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm leading-6 text-slate-100">
            <code>{`x = x_train.astype("float32") / 255
# 28×28 → 784 → 64 → 784 → 28×28
encoder = Sequential([Flatten(), Dense(64, activation="relu")])
decoder = Sequential([Dense(784, activation="sigmoid"), Reshape((28, 28))])
model = Sequential([encoder, decoder])
model.compile(optimizer="adam", loss="mse")
model.fit(x, x)`}</code>
          </pre>
          <p className="mt-3 text-sm">
            0~1 사이로 맞춘 픽셀과 시그모이드 출력을 비교합니다. 마지막 줄의 두
            x는 각각 입력과 정답 영상입니다. 테스트 그림을 같은 모형에 통과시켜
            훈련 때 본 적 없는 획도 복원하는지 살펴봅니다.
          </p>
        </Card>
      </Sourced>
    </section>
  );
}
