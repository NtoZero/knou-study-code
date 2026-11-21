"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Chip } from "@/components/dlShared/ui";

type Normalizer = "lrn" | "batch";

const DETAILS: Record<Normalizer, { title: string; scope: string; idea: string; parameters: string; batch: string; question: string; example: string }> = {
  lrn: {
    title: "LRN · Local Response Normalization",
    scope: "한 이미지 안에서 인접한 특징 맵의 같은 위치",
    idea: "측면 억제(lateral inhibition)에서 착안. 같은 위치의 이웃 채널이 강하게 반응할수록 분모가 커져 해당 채널의 반응을 낮춤",
    parameters: "학습 파라미터 없음",
    batch: "배치 크기에 따른 통계 변화 없음",
    question: "이웃 필터가 더 강하게 반응하면?",
    example: "한 픽셀에서 이웃한 세 채널의 반응이 [1, 8, 2]라고 하자. 가운데 값 8을 그대로 두고 이웃의 2를 6으로 키우면, 주변 반응의 제곱합이 커진다. 8을 나누는 분모가 커지므로 가운데 채널의 정규화 결과는 작아진다.",
  },
  batch: {
    title: "배치 정규화 · Batch Normalization",
    scope: "미니배치 안의 같은 채널에 속한 여러 데이터",
    idea: "미니배치의 평균·분산으로 입력 분포를 정규화하고, 스케일·이동 변환을 학습",
    parameters: "채널마다 크기 γ와 이동량 β를 학습",
    batch: "배치 크기에 따라 평균·분산이 달라질 수 있음",
    question: "같은 채널에서 2와 6을 관찰했다면?",
    example: "같은 채널의 학습용 값이 2와 6뿐이라면 평균은 4, 분산은 4다. 각 값에서 4를 빼고 표준편차 2로 나누면 약 −1과 1이 된다. 실제 층은 분모에 작은 안정화 항을 쓰고, 이어서 각 값에 γ를 곱하고 β를 더한다.",
  },
};

export default function LRNComparison() {
  const [active, setActive] = useState<Normalizer>("lrn");
  const detail = DETAILS[active];

  return (
    <section id="lrn" className="scroll-mt-32">
      <SectionTitle
        title="LRN은 배치 정규화와 무엇이 다를까?"
        subtitle="둘 다 정규화라는 이름을 쓰지만, 비교하는 데이터의 범위가 달라요."
      />
      <Sourced refs={{ slides: "슬라이드 10–11, 21 — LRN·배치 정규화 비교와 구현", lecture: "음성 전사 20:33–21:02 — 깊은 층에서의 기울기 소실 언급" }}>
        <Card>
          <p className="mb-4 text-sm leading-6">
            컨볼루션 출력에는 이미지 번호, 픽셀의 행과 열, 채널 번호가 있습니다. <strong>LRN</strong>은 이미지 한 장의 같은 픽셀을 고정하고 이웃 채널들의 반응을 봅니다.
            <strong> 배치 정규화</strong>는 채널 하나를 고정하고 학습 배치의 여러 이미지와 공간 위치에서 평균과 분산을 구합니다. 그래서 다른 이미지를 배치에 넣으면 배치 정규화의 학습 결과값은 달라질 수 있지만, 같은 이미지에 적용한 LRN 값은 그대로입니다.
          </p>
          <div className="mb-3 flex flex-wrap gap-2">
            <Chip active={active === "lrn"} onClick={() => setActive("lrn")}>LRN</Chip>
            <Chip active={active === "batch"} onClick={() => setActive("batch")}>배치 정규화</Chip>
          </div>

          <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
            <div className={`rounded-xl border p-4 ${active === "lrn" ? "border-rose-300 bg-rose-50/70 dark:border-rose-900 dark:bg-rose-950/30" : "border-sky-300 bg-sky-50/70 dark:border-sky-900 dark:bg-sky-950/30"}`}>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{detail.title}</p>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-gray-500">정규화 대상</p>
              <p className="mt-1 text-[13px] leading-5 text-gray-800 dark:text-gray-200">{detail.scope}</p>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-gray-500">핵심 아이디어</p>
              <p className="mt-1 text-[13px] leading-5 text-gray-700 dark:text-gray-300">{detail.idea}</p>
            </div>
            <div className="space-y-2">
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[10px] font-semibold text-gray-500">학습 파라미터</p>
                <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-100">{detail.parameters}</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[10px] font-semibold text-gray-500">배치 크기의 영향</p>
                <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-100">{detail.batch}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                <CardTitle>{detail.question}</CardTitle>
                <p className="text-[12px] leading-5 text-gray-600 dark:text-gray-300">{detail.example}</p>
              </div>
            </div>
          </div>

          <p className="mt-3 text-[11px] leading-5 text-gray-500">
            원래 AlexNet은 ReLU 뒤의 채널 반응을 LRN으로 조정합니다. CIFAR-10 실습 모델의 BatchNormalization은 학습 중 같은 채널의 배치 평균·분산을 사용하고, 예측할 때는 학습 중 누적한 통계를 사용합니다.
          </p>
        </Card>
      </Sourced>
    </section>
  );
}
