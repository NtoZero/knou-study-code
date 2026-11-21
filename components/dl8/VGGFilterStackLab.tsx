"use client";

import KeyPhrase from "@/components/dlShared/KeyPhrase";
import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Chip, num } from "@/components/dlShared/ui";

const INPUT = 10;

export default function VGGFilterStackLab() {
  const [layers, setLayers] = useState(3);
  const receptive = 2 * layers + 1;
  const padding = Math.floor((INPUT - receptive) / 2);
  const center = padding + Math.floor(receptive / 2);

  const outputSides = Array.from({ length: layers }, (_, i) => INPUT - 2 * (i + 1));
  const multiplications = outputSides.reduce((sum, side) => sum + side ** 2 * 9, 0);
  const singleFilterSide = INPUT - receptive + 1;
  const singleFilterMultiplications = singleFilterSide ** 2 * receptive ** 2;
  return (
    <section id="vgg-filters" className="scroll-mt-32">
      <SectionTitle
        title="왜 3×3 필터를 여러 번 쌓을까?"
        subtitle="10×10 예로 출력 지도와 한 출력이 참조하는 입력 범위, 필터 수를 구분해요."
      />
      <Sourced refs={{ slides: "슬라이드 28–29 — 7×7과 세 번의 3×3 비교", lecture: "음성 전사 42:53–43:48 — 깊은 층의 비선형성·특징 학습" }}>
        <Card>
          <div className="mb-4 rounded-xl border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-900 dark:bg-violet-950/30">
            <p className="text-sm font-bold text-violet-950 dark:text-violet-100">3×3을 세 번 쌓으면 출력은 어떻게 계산될까요?</p>
            <p className="mt-1 text-[13px] leading-6 text-violet-900 dark:text-violet-200">입력 10×10, stride 1, 패딩 없음, 한 입력 채널·한 출력 채널로 계산해요. 출력 지도 크기는 커널이 움직일 수 있는 위치 수이고, 수용 영역은 마지막 지도에서 고른 <KeyPhrase>한 점이 원래 입력에서 보는 범위</KeyPhrase>예요.</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg bg-white/80 p-3 dark:bg-gray-900/60">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-100">① 층마다 지도 크기</p>
                <p className="mt-2 font-mono text-[13px] leading-6 text-gray-700 dark:text-gray-200">10×10 → 8×8 → 6×6 → 4×4<br />(10−3)+1=8<br />(8−3)+1=6<br />(6−3)+1=4</p>
                <p className="mt-2 text-[13px] leading-6 text-gray-600 dark:text-gray-300">세 층의 출력 지도는 8×8, 6×6, 4×4예요. 마지막 지도 자체의 크기 4×4가 수용 영역 크기를 뜻하지는 않아요.</p>
              </div>
              <div className="rounded-lg bg-white/80 p-3 dark:bg-gray-900/60">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-100">② 마지막 출력 한 점 역추적</p>
                <p className="mt-2 font-mono text-[13px] leading-6 text-gray-700 dark:text-gray-200">마지막 3×3 → 이전 층 5×5<br />그 앞 3×3 → 원래 입력 7×7</p>
                <p className="mt-2 text-[13px] leading-6 text-gray-600 dark:text-gray-300">마지막 특징 맵의 한 점은 원래 입력의 7×7 이웃에 의존해요. 이는 한 점의 수용 영역이지, 마지막 특징 맵의 가로·세로 크기가 아니에요.</p>
              </div>
              <div className="rounded-lg bg-white/80 p-3 dark:bg-gray-900/60">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-100">③ 계수와 곱셈 횟수</p>
                <p className="mt-2 font-mono text-[13px] leading-6 text-gray-700 dark:text-gray-200">가중치: 3×(3×3)=27<br />곱셈: 8²×9+6²×9+4²×9<br />=1,044회</p>
                <p className="mt-2 text-[13px] leading-6 text-gray-600 dark:text-gray-300">한 번의 7×7 필터는 가중치 49개, 4²×49=784회예요. 작은 필터는 가중치가 적어도 출력 위치가 많으면 총 곱셈은 더 클 수 있어요.</p>
              </div>
            </div>
            <p className="mt-3 rounded-lg border border-violet-200 px-3 py-2 text-[13px] leading-6 text-violet-900 dark:border-violet-800 dark:text-violet-200">세 번의 3×3 합성곱은 층마다 ReLU를 통과해 비선형 변환을 세 번 적용해요. 실제 VGG에서는 입력·출력 채널도 곱셈에 들어가므로, 27 대 49라는 계수 비교만으로 모든 조건에서 연산이 줄어든다고 결론 내리면 안 돼요.</p>
          </div>
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
                <p className="mt-2 font-mono text-lg font-bold text-gray-900 dark:text-white">10×10 → {outputSides.map(side => side + "×" + side).join(" → ")} </p>
                <p className="mt-2 text-[12px] leading-5 text-gray-700 dark:text-gray-200">stride 1, 패딩 없음으로 가정하면 출력 한 점의 수용 영역은 <b>{receptive}×{receptive}</b>예요. 한 층을 더 쌓을 때마다 한 변이 2씩 커져요.</p>
                <p className="mt-1 font-mono text-[12px] text-violet-800 dark:text-violet-200">가중치: 3×3×{layers} = {9 * layers}개 · 층마다 ReLU · 총 {layers}회</p>
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
          <details className="mt-4 rounded-lg border border-violet-200 p-3 text-sm dark:border-violet-900">
            <summary className="cursor-pointer font-semibold">선택한 {layers}층과 한 번의 {receptive}×{receptive} 필터 계산 비교</summary>
            <p className="mt-3 leading-6">한 필터의 가중치는 모든 출력 위치에서 재사용되지만, 각 출력 위치에서 그 가중치를 다시 곱하고 더합니다. 따라서 층 수를 바꾸면 각 층의 출력 지도 크기를 계산한 뒤 위치별 곱셈을 더해야 합니다.</p>
            <p className="my-2 font-mono">3×3 반복: {outputSides.map(side => side + "²×9").join(" + ")} = {num(multiplications)}회</p>
            <p className="my-2 font-mono">한 번의 {receptive}×{receptive}: {singleFilterSide}²×{receptive}² = {num(singleFilterMultiplications)}회</p>
            <p className="leading-6">예를 들어 두 층은 출력 지도가 8×8과 6×6이므로 8²×9+6²×9=900회, 세 층은 8×8·6×6·4×4를 더해 1,044회입니다. 필터의 가중치 수와 총 곱셈 횟수는 다르며, 실제 다중 채널 합성곱에는 입력 채널과 출력 채널도 반영합니다.</p>
          </details>
        </Card>
      </Sourced>
    </section>
  );
}
