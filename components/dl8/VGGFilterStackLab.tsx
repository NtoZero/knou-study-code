"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Chip } from "@/components/dlShared/ui";

const INPUT = 10;

export default function VGGFilterStackLab() {
  const [layers, setLayers] = useState(3);
  const receptive = 2 * layers + 1;
  const padding = Math.floor((INPUT - receptive) / 2);
  const center = padding + Math.floor(receptive / 2);

  return (
    <section id="vgg-filters" className="scroll-mt-32">
      <SectionTitle
        title="왜 3×3 필터를 여러 번 쌓을까?"
        subtitle="10×10 입력에서 출력 한 점이 바라보는 범위와 가중치 수를 단계별로 비교해요."
      />
      <Sourced refs={{ slides: "슬라이드 28–29 — 7×7과 세 번의 3×3 비교", lecture: "음성 전사 42:53–43:48 — 깊은 층의 비선형성·특징 학습" }}>
        <Card>
          <div className="mb-3 flex flex-wrap gap-2">
            {[1, 2, 3].map((count) => <Chip key={count} active={layers === count} onClick={() => setLayers(count)}>{count}층 쌓기</Chip>)}
          </div>
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <CardTitle>선택한 출력 한 점의 수용 영역</CardTitle>
              <div className="mx-auto grid w-fit gap-0.5 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900" style={{ gridTemplateColumns: `repeat(${INPUT}, 1.15rem)` }} role="img" aria-label={`10 곱하기 10 입력에서 ${receptive} 곱하기 ${receptive} 수용 영역을 강조한 그림`}>
                {Array.from({ length: INPUT * INPUT }).map((_, index) => {
                  const row = Math.floor(index / INPUT);
                  const col = index % INPUT;
                  const inside = row >= padding && row < padding + receptive && col >= padding && col < padding + receptive;
                  const isCenter = row === center && col === center;
                  return <span key={index} className={`h-[1.15rem] w-[1.15rem] rounded-[2px] border ${isCenter ? "border-rose-500 bg-rose-400" : inside ? "border-violet-300 bg-violet-200 dark:border-violet-700 dark:bg-violet-800" : "border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"}`} />;
                })}
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-gray-500">
                <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded bg-violet-300" />출력 한 점이 참조하는 입력</span>
                <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded bg-rose-400" />출력 위치</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-900 dark:bg-violet-950/30">
                <p className="text-xs font-bold text-violet-900 dark:text-violet-100">{layers}개의 3×3 필터</p>
                <p className="mt-2 font-mono text-lg font-bold text-gray-900 dark:text-white">10×10 → {Array.from({ length: layers }, (_, i) => INPUT - 2 * (i + 1)).join(" → ")} </p>
                <p className="mt-2 text-[12px] leading-5 text-gray-700 dark:text-gray-200">stride 1, 패딩 없음으로 가정하면 출력 한 점의 수용 영역은 <b>{receptive}×{receptive}</b>예요. 한 층을 더 쌓을 때마다 한 변이 2씩 커져요.</p>
                <p className="mt-1 font-mono text-[12px] text-violet-800 dark:text-violet-200">가중치: 3×3×{layers} = {9 * layers}개 · 중간 ReLU {layers}회</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-100">한 번의 7×7 필터와 비교</p>
                <p className="mt-2 font-mono text-sm">10×10 → 4×4 · 가중치 7×7 = 49개</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${(9 * layers / 49) * 100}%` }} />
                </div>
                <p className="mt-2 text-[11px] leading-5 text-gray-600 dark:text-gray-300">3층을 고르면 같은 7×7 범위를 보며 가중치는 27개예요. 각 층의 활성함수가 비선형 변환을 더해요. 이 수 비교는 <b>입력 채널 1개와 출력 채널 1개</b>로 단순화한 예예요.</p>
              </div>
            </div>
          </div>
        </Card>
      </Sourced>
    </section>
  );
}
