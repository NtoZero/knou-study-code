"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Chip } from "@/components/dlShared/ui";

type Normalizer = "lrn" | "batch";

const DETAILS: Record<Normalizer, { title: string; scope: string; idea: string; parameters: string; batch: string; role: string }> = {
  lrn: {
    title: "LRN · Local Response Normalization",
    scope: "한 이미지 안에서 인접한 특징 맵의 같은 위치",
    idea: "한 특징 맵의 큰 반응이 이웃 채널에 주는 영향을 낮추도록 주변 반응을 함께 고려",
    parameters: "학습 파라미터 없음",
    batch: "배치 크기에 따른 통계 변화 없음",
    role: "AlexNet에서 사용된 정규화 기법. 강의록은 이후 배치 정규화가 널리 사용된다고 비교.",
  },
  batch: {
    title: "배치 정규화 · Batch Normalization",
    scope: "미니배치 안의 같은 채널에 속한 여러 데이터",
    idea: "미니배치의 평균·분산으로 입력 분포를 정규화하고, 스케일·이동 변환을 학습",
    parameters: "학습 파라미터 있음",
    batch: "배치 크기에 따라 평균·분산이 달라질 수 있음",
    role: "강의록의 비교표에서 LRN과 대비되는 방식. AlexNet 구현 코드 예시에도 배치 정규화층이 등장.",
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
                <CardTitle>강의에서의 위치</CardTitle>
                <p className="text-[12px] leading-5 text-gray-600 dark:text-gray-300">{detail.role}</p>
              </div>
            </div>
          </div>

          <p className="mt-3 text-[11px] leading-5 text-gray-500">
            강의 구현 코드에는 BatchNormalization 층이 보이고, AlexNet의 역사적 특징 설명에는 LRN이 나와요. 코드 예시와 원래 모델의 특징을 같은 것으로 합쳐 읽지 마세요.
          </p>
        </Card>
      </Sourced>
    </section>
  );
}
