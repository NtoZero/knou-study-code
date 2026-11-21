"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle } from "@/components/dlShared/ui";

const BLOCKS = [
  { name: "블록 1", repeats: 2, filters: 64, before: 224, after: 112 },
  { name: "블록 2", repeats: 2, filters: 128, before: 112, after: 56 },
  { name: "블록 3", repeats: 3, filters: 256, before: 56, after: 28 },
  { name: "블록 4", repeats: 3, filters: 512, before: 28, after: 14 },
  { name: "블록 5", repeats: 3, filters: 512, before: 14, after: 7 },
];

export default function VGGArchitectureExplorer() {
  const [selected, setSelected] = useState(0);
  const block = BLOCKS[selected];
  const convTotal = BLOCKS.reduce((sum, item) => sum + item.repeats, 0);

  return (
    <section id="vgg-architecture" className="scroll-mt-32">
      <SectionTitle
        title="VGG16 — 3×3 합성곱을 쌓고 풀링으로 줄이기"
        subtitle="블록을 눌러 가로·세로 크기는 절반씩, 특징 맵 수는 어떻게 달라지는지 확인해요."
      />
      <Sourced refs={{ slides: "슬라이드 25–27, 31, 34–35 — VGGNet 구성과 구현", lecture: "음성 전사 42:53–43:48 — 층이 깊어질 때 비선형성과 특징 학습 설명" }}>
        <Card>
          <div className="mb-4 grid gap-3 md:grid-cols-[1fr_1fr]">
            <div className="rounded-xl border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-900 dark:bg-violet-950/30">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">입력 크기</p>
              <p className="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-white">224×224×3</p>
              <p className="mt-1 text-[11px] text-gray-600 dark:text-gray-300">RGB 이미지 · 합성곱은 3×3 · stride 1 · same padding</p>
            </div>
            <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-4 dark:border-teal-900 dark:bg-teal-950/30">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">가중치를 포함하는 층</p>
              <p className="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-white">{convTotal} conv + 3 dense = 16</p>
              <p className="mt-1 text-[11px] text-gray-600 dark:text-gray-300">풀링층은 모델명 숫자에 포함하지 않음</p>
            </div>
          </div>

          <CardTitle>특징 추출 블록 선택</CardTitle>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {BLOCKS.map((item, i) => (
              <button
                type="button"
                key={item.name}
                onClick={() => setSelected(i)}
                aria-pressed={selected === i}
                className={`rounded-xl border p-3 text-left transition ${selected === i ? "border-violet-500 bg-violet-50 ring-1 ring-violet-300 dark:bg-violet-950/50" : "border-gray-200 bg-white hover:border-violet-300 dark:border-gray-700 dark:bg-gray-900"}`}
              >
                <span className="block text-[10px] font-semibold text-gray-500">{item.name}</span>
                <span className="mt-1 block text-xs font-bold text-gray-800 dark:text-gray-100">conv3-{item.filters}</span>
                <span className="mt-1 block font-mono text-[10px] text-gray-500">{item.before} → {item.after}</span>
              </button>
            ))}
          </div>

          <div className="my-4 flex items-center gap-2 overflow-x-auto pb-1" aria-label="VGG 특징 추출 진행">
            <span className="shrink-0 rounded-lg bg-sky-50 px-3 py-2 text-center dark:bg-sky-950/40">
              <b className="block text-xs">입력</b><span className="font-mono text-[10px]">224×224×3</span>
            </span>
            {BLOCKS.map((item, i) => <div key={item.name} className="flex shrink-0 items-center gap-2">
              <span className="text-gray-300">→</span>
              <button type="button" onClick={() => setSelected(i)} className={`min-w-24 rounded-lg border px-2 py-2 text-center ${selected === i ? "border-violet-500 bg-violet-100 dark:bg-violet-950/60" : "border-gray-200 dark:border-gray-700"}`}>
                <b className="block text-[10px]">{item.repeats}× conv3-{item.filters}</b>
                <span className="text-[9px] text-gray-500">max pool → {item.after}×{item.after}</span>
              </button>
            </div>)}
            <span className="shrink-0 text-gray-300">→</span>
            <span className="shrink-0 rounded-lg bg-emerald-50 px-3 py-2 text-center dark:bg-emerald-950/40">
              <b className="block text-xs">분류기</b><span className="font-mono text-[10px]">4096 → 4096 → 1000</span>
            </span>
          </div>

          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
            <p className="text-xs font-bold text-gray-800 dark:text-gray-100">{block.name}에서 변화</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              <p className="rounded-lg bg-white p-2 text-[11px] leading-5 dark:bg-gray-900"><b>입력:</b> {block.before}×{block.before} 특징 맵</p>
              <p className="rounded-lg bg-white p-2 text-[11px] leading-5 dark:bg-gray-900"><b>합성곱:</b> conv3-{block.filters}를 {block.repeats}회, 각 합성곱 후 ReLU</p>
              <p className="rounded-lg bg-white p-2 text-[11px] leading-5 dark:bg-gray-900"><b>최대 풀링:</b> 2×2, stride 2로 {block.after}×{block.after}로 축소</p>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-gray-500">VGG16의 13개 합성곱층 뒤에 세 완전연결층이 붙어요. 강의 실습은 CIFAR-10에 맞춰 마지막 분류층을 10개 출력으로 구성해요.</p>
          </div>
        </Card>
      </Sourced>
    </section>
  );
}
