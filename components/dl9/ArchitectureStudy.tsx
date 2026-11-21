"use client";

import KeyPhrase from "@/components/dlShared/KeyPhrase";
import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Card, CardTitle, Tag } from "@/components/dlShared/ui";
import { Sourced } from "@/components/dlShared/SourceFilter";

type ArchitectureFocus = "googlenet" | "resnet";
type OneByOneFocus = "vgg" | "googlenet" | "resnet";
type MergeOperation = "concatenate" | "add";

const focusCards: Record<ArchitectureFocus, { title: string; question: string; design: string; result: string }> = {
  googlenet: {
    title: "GoogLeNet · 넓이를 효율적으로",
    question: "서로 다른 크기의 특징을 함께 살피면서 계산량을 어떻게 줄일까?",
    design: "2014년 GoogLeNet은 1×1·3×3·5×5 합성곱과 최대 풀링 경로를 병렬로 두는 인셉션 모듈을 사용. 큰 합성곱 앞에서 1×1 합성곱으로 특징 맵 수를 줄여 연산을 절약.",
    result: "22개 층의 모델로 ILSVRC-2014 우승. 대회 분류 오류율 6.7%.",
  },
  resnet: {
    title: "ResNet · 깊은 망을 학습 가능하게",
    question: "층을 더 쌓았는데도 학습 오차가 커지는 문제를 어떻게 줄일까?",
    design: "2015년 ResNet은 입력에서 출력으로 이어지는 숏컷 연결을 더해 잔차 F(x)를 학습. 20층·56층 비교에서 깊이만 늘린 평범한 망의 학습·테스트 오차가 더 나빠질 수 있음을 확인하고 잔차 학습을 제안.",
    result: "152개 층의 ResNet이 ILSVRC-2015에서 우승. 대회 분류 오류율 3.57%.",
  },
};

/** 원자료의 문제의식부터 두 모델의 설계 질문을 먼저 세운다. */
export function ArchitectureContext() {
  const [focus, setFocus] = useState<ArchitectureFocus>("googlenet");
  const [oneByOneFocus, setOneByOneFocus] = useState<OneByOneFocus>("googlenet");
  const [mergeOperation, setMergeOperation] = useState<MergeOperation>("concatenate");
  const active = focusCards[focus];
  const oneByOneDetails: Record<OneByOneFocus, { title: string; description: string; shape: string }> = {
    vgg: {
      title: "VGG 구성 C · 같은 위치의 채널을 조합",
      description: "한 위치의 여러 채널 값을 1×1 필터로 결합합니다. VGG 구성 C에서는 블록 3·4·5의 마지막 합성곱을 1×1로 바꾸며, D 구성의 3×3은 주변 위치까지 함께 봅니다.",
      shape: "H×W 유지 · 이 예에서는 채널 축소가 목적이 아님",
    },
    googlenet: {
      title: "GoogLeNet · 큰 필터 앞에서 채널 축소",
      description: "3×3·5×5 합성곱 전에 1×1 합성곱을 두어 입력 특징 맵 수를 줄입니다. 예를 들어 480개 입력 채널을 16개로 먼저 줄이면 이어지는 5×5 합성곱의 계산량이 작아집니다.",
      shape: "H×W 유지 · 채널 수 480 → 16",
    },
    resnet: {
      title: "ResNet · 덧셈 전 숏컷의 모양 맞추기",
      description: "stage가 바뀌며 공간 크기와 채널 수가 달라질 때 1×1 합성곱(stride 2)을 숏컷에 적용합니다. 병목 블록에서는 3×3 합성곱 앞·뒤의 채널 폭을 조절하는 1×1 층으로도 사용합니다.",
      shape: "예: H×W×64 → H/2×W/2×128",
    },
  };
  const oneByOneActive = oneByOneDetails[oneByOneFocus];

  return (
    <section id="dl9-context" className="scroll-mt-32">
      <SectionTitle
        title="깊이와 너비를 늘리는 두 설계"
        subtitle="분류 성능을 높이는 과정에서 GoogLeNet과 ResNet이 각각 다룬 문제를 먼저 살펴봅니다."
      />
      <Sourced refs={{ slides: "9강 강의록 4–5쪽, 10쪽, 21쪽, 27쪽 · 모델 소개·GoogLeNet Stem·ResNet", lecture: "56:47–57:58 · 평범한 20층·56층 망의 오차 비교" }}>
        <Card>
          <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
            합성곱 신경망의 깊이가 커지면서 두 질문이 생깁니다. 한 층에서 <KeyPhrase>여러 크기의 특징</KeyPhrase>을 함께 찾으려면 연산을 어떻게 줄일까요? 층을 계속 쌓아도 <KeyPhrase>학습 오차가 나빠지는 현상</KeyPhrase>은 어떻게 다룰까요? 두 모델은 서로 다른 질문에 답합니다.
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-3" aria-label="ILSVRC 분류 오류율 흐름">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/60">
              <p className="text-[10px] font-bold text-gray-500">2012 · AlexNet</p>
              <p className="mt-1 text-xl font-extrabold text-sky-800 dark:text-sky-200">약 16%</p>
              <p className="text-[10px] leading-4 text-gray-500">ILSVRC 분류 오류율</p>
            </div>
            <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-900 dark:bg-cyan-950/30">
              <p className="text-[10px] font-bold text-cyan-800 dark:text-cyan-200">2014 · GoogLeNet</p>
              <p className="mt-1 text-xl font-extrabold text-cyan-900 dark:text-cyan-100">6.7%</p>
              <p className="text-[10px] leading-4 text-gray-500">22층 · 인셉션 모듈</p>
            </div>
            <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 dark:border-violet-900 dark:bg-violet-950/30">
              <p className="text-[10px] font-bold text-violet-800 dark:text-violet-200">2015 · ResNet</p>
              <p className="mt-1 text-xl font-extrabold text-violet-900 dark:text-violet-100">3.57%</p>
              <p className="text-[10px] leading-4 text-gray-500">152층 · 잔차 학습</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[0.75fr_1.25fr]">
            <div>
              <CardTitle>설계 질문을 선택하세요</CardTitle>
              <div className="grid gap-2" role="group" aria-label="모델 설계 질문">
                {(["googlenet", "resnet"] as ArchitectureFocus[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={focus === key}
                    onClick={() => setFocus(key)}
                    className={`rounded-xl border p-3 text-left text-xs font-bold transition ${focus === key ? "border-cyan-500 bg-cyan-50 text-cyan-950 ring-2 ring-cyan-200 dark:border-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-100 dark:ring-cyan-900" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"}`}
                  >
                    {focusCards[key].title}
                  </button>
                ))}
              </div>
            </div>
            <div aria-live="polite" className="rounded-xl border border-cyan-200 bg-cyan-50/70 p-4 dark:border-cyan-900 dark:bg-cyan-950/30">
              <p className="text-xs font-bold text-cyan-900 dark:text-cyan-100">{active.title}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-gray-800 dark:text-gray-100">{active.question}</p>
              <p className="mt-2 text-xs leading-5 text-gray-700 dark:text-gray-300">{active.design}</p>
              <p className="mt-3 border-t border-cyan-200 pt-3 text-xs leading-5 text-gray-600 dark:border-cyan-900 dark:text-gray-400">{active.result}</p>
              {focus === "googlenet" && <div className="mt-3 space-y-2 border-t border-cyan-200 pt-3 dark:border-cyan-900">
                <div>
                  <p className="text-[10px] font-bold">GoogLeNet 원형의 입력부</p>
                  <p className="mt-1 font-mono text-[9px] leading-5 text-gray-700 dark:text-gray-300">7×7 conv → max pool → LRN → 1×1 conv → 3×3 conv → LRN → max pool</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold">CIFAR-10 실습 모델의 입력부</p>
                  <p className="mt-1 font-mono text-[9px] leading-5 text-gray-700 dark:text-gray-300">7×7 conv → max pool → 3×3 conv(192) → max pool</p>
                </div>
                <p className="text-[10px] leading-4 text-gray-600 dark:text-gray-400">실습 코드에서는 개념도에 있는 LRN과 1×1 합성곱을 생략합니다. <a className="underline underline-offset-2" href="/dl/lecture/8#lrn">LRN과 배치 정규화의 계산 비교</a></p>
              </div>}
            </div>
          </div>

          <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-700">
            <CardTitle>같은 1×1 합성곱도 위치에 따라 역할이 달라집니다</CardTitle>
            <div className="flex flex-wrap gap-2" role="group" aria-label="1×1 합성곱의 위치별 역할">
              {(["vgg", "googlenet", "resnet"] as OneByOneFocus[]).map((key) => (
                <button key={key} type="button" aria-pressed={oneByOneFocus === key} onClick={() => setOneByOneFocus(key)} className={`rounded-lg px-3 py-2 text-[11px] font-bold transition ${oneByOneFocus === key ? "bg-violet-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"}`}>
                  {key === "vgg" ? "VGG C" : key === "googlenet" ? "GoogLeNet" : "ResNet"}
                </button>
              ))}
            </div>
            <div aria-live="polite" className="mt-3 grid gap-3 rounded-xl border border-violet-200 bg-violet-50/70 p-3 dark:border-violet-900 dark:bg-violet-950/30 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-xs font-bold text-violet-900 dark:text-violet-100">{oneByOneActive.title}</p>
                <p className="mt-1 text-[11px] leading-5 text-gray-700 dark:text-gray-300">{oneByOneActive.description}</p>
              </div>
              <p className="rounded-lg bg-white px-3 py-2 text-center text-[10px] font-mono font-bold text-violet-800 dark:bg-gray-900 dark:text-violet-200">{oneByOneActive.shape}</p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="mb-2 text-xs font-bold">두 갈래의 결합 방법</p>
                <div className="grid gap-2" role="group" aria-label="출력 결합 연산">
                  {(["concatenate", "add"] as MergeOperation[]).map((operation) => (
                    <button key={operation} type="button" aria-pressed={mergeOperation === operation} onClick={() => setMergeOperation(operation)} className={`rounded-lg border p-2 text-left text-[11px] font-bold ${mergeOperation === operation ? "border-cyan-400 bg-cyan-50 text-cyan-950 dark:border-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-100" : "border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300"}`}>
                      {operation === "concatenate" ? "인셉션 · concatenate" : "ResNet · 원소별 add"}
                    </button>
                  ))}
                </div>
              </div>
              <div aria-live="polite" className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-3 dark:border-cyan-900 dark:bg-cyan-950/25">
                {mergeOperation === "concatenate" ? <>
                  <p className="text-xs font-bold">공간 크기를 맞추고 채널 축으로 이어 붙임</p>
                  <p className="mt-2 font-mono text-xs font-bold">H×W×32 ⊕ H×W×64 → H×W×96</p>
                  <p className="mt-1 text-[10px] leading-4 text-gray-600 dark:text-gray-400">네 갈래의 H×W는 같아야 합니다. 출력 채널 수는 갈래마다 나온 채널 수의 합입니다.</p>
                </> : <>
                  <p className="text-xs font-bold">같은 위치의 원소끼리 더함</p>
                  <p className="mt-2 font-mono text-xs font-bold">H×W×64 + H×W×64 → H×W×64</p>
                  <p className="mt-1 text-[10px] leading-4 text-gray-600 dark:text-gray-400">두 경로의 H·W·C가 모두 같아야 합니다. ResNet은 맞지 않을 때 숏컷의 1×1 합성곱과 보폭으로 출력 모양을 맞춘 뒤 더합니다.</p>
                </>}
              </div>
            </div>

          </div>
          <p className="mt-4 text-[10px] leading-4 text-gray-500">대회 그래프는 ImageNet에서 측정한 분류 오류율입니다. CIFAR-10 실습 정확도와는 평가 이미지와 범주의 수가 다릅니다.</p>
        </Card>
      </Sourced>
    </section>
  );
}

type ResNetDepth = 18 | 34 | 50 | 101 | 152;
type StageId = "conv2_x" | "conv3_x" | "conv4_x" | "conv5_x";

const depths: ResNetDepth[] = [18, 34, 50, 101, 152];
const billionsOfFlops: Record<ResNetDepth, number> = { 18: 1.8, 34: 3.6, 50: 3.8, 101: 7.6, 152: 11.3 };
const stageIds: StageId[] = ["conv2_x", "conv3_x", "conv4_x", "conv5_x"];
const stageSizes: Record<StageId, string> = {
  conv2_x: "56×56",
  conv3_x: "28×28",
  conv4_x: "14×14",
  conv5_x: "7×7",
};
const basicRepeats: Record<18 | 34, Record<StageId, number>> = {
  18: { conv2_x: 2, conv3_x: 2, conv4_x: 2, conv5_x: 2 },
  34: { conv2_x: 3, conv3_x: 4, conv4_x: 6, conv5_x: 3 },
};
const bottleneckRepeats: Record<50 | 101 | 152, Record<StageId, number>> = {
  50: { conv2_x: 3, conv3_x: 4, conv4_x: 6, conv5_x: 3 },
  101: { conv2_x: 3, conv3_x: 4, conv4_x: 23, conv5_x: 3 },
  152: { conv2_x: 3, conv3_x: 8, conv4_x: 36, conv5_x: 3 },
};
const basicChannels: Record<StageId, number> = {
  conv2_x: 64,
  conv3_x: 128,
  conv4_x: 256,
  conv5_x: 512,
};
const bottleneckChannels: Record<StageId, [number, number, number]> = {
  conv2_x: [64, 64, 256],
  conv3_x: [128, 128, 512],
  conv4_x: [256, 256, 1024],
  conv5_x: [512, 512, 2048],
};

function repeatsFor(depth: ResNetDepth) {
  return depth < 50 ? basicRepeats[depth as 18 | 34] : bottleneckRepeats[depth as 50 | 101 | 152];
}
const totalStageBlocks = (counts: Record<StageId, number>) => stageIds.reduce((sum, id) => sum + counts[id], 0);

/** 깊이별 블록 계열과 각 stage 반복 수를 원자료 표로 탐색한다. */
export function ResNetFamily() {
  const [depth, setDepth] = useState<ResNetDepth>(34);
  const [stage, setStage] = useState<StageId>("conv4_x");
  const isBottleneck = depth >= 50;
  const repeats = repeatsFor(depth);
  const channels = isBottleneck ? bottleneckChannels[stage] : null;
  const basicChannel = basicChannels[stage];
  const layersPerBlock = isBottleneck ? 3 : 2;
  const stageConvolutionCount = layersPerBlock * totalStageBlocks(repeats);

  return (
    <section id="dl9-resnet-family" className="scroll-mt-32">
      <SectionTitle
        title="ResNet 계열: 18층부터 152층까지"
        subtitle="모델 깊이에서 블록 계열과 반복 횟수를 비교하고, stage를 선택해 공간 크기와 채널 수를 읽습니다."
      />
      <Sourced refs={{ slides: "9강 강의록 27–29쪽, 33쪽 · 평범한 망·잔차망 비교와 모델별 구조표", lecture: "71:33–72:20 · 잔차 유닛의 반복과 필터 수 변경" }}>
        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>구조표의 모델 깊이를 선택하세요</CardTitle>
              <p className="mb-3 max-w-3xl text-sm leading-6">VGG19와 평범한 34층 망은 층의 출력을 다음 층으로 차례로 넘깁니다. 34층 잔차망의 구조도에서는 두 합성곱층을 건너뛰어 덧셈 지점에 닿는 선이 추가됩니다. 같은 34층끼리 비교하면 깊이를 고정한 채 숏컷의 효과를 살펴볼 수 있습니다. 반면 숏컷 없는 20층과 56층의 오차 곡선은 깊이만 늘렸을 때 생긴 학습 문제를 보여 줍니다.</p>
              <p className="text-[11px] leading-5 text-gray-500">18·34층은 두 개의 3×3 합성곱을 쓰고, 50층 이상은 <KeyPhrase>1×1·3×3·1×1 병목 블록</KeyPhrase>을 씁니다.</p>
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="ResNet 깊이">
              {depths.map((value) => (
                <button key={value} type="button" aria-pressed={depth === value} onClick={() => setDepth(value)} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${depth === value ? "bg-violet-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"}`}>
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className={`rounded-xl border p-3 ${isBottleneck ? "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50" : "border-violet-300 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/35"}`}>
              <p className="text-[10px] font-bold text-violet-800 dark:text-violet-200">기본 잔차 블록 · ResNet18/34</p>
              <p className="mt-1 text-xs font-mono font-bold">3×3 conv → 3×3 conv</p>
              <p className="mt-1 text-[10px] leading-4 text-gray-500">특징 맵 크기가 바뀌는 첫 블록은 숏컷도 투영해 덧셈 크기를 맞춥니다.</p>
            </div>
            <div className={`rounded-xl border p-3 ${isBottleneck ? "border-violet-300 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/35" : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"}`}>
              <p className="text-[10px] font-bold text-violet-800 dark:text-violet-200">병목 잔차 블록 · ResNet50/101/152</p>
              <p className="mt-1 text-xs font-mono font-bold">1×1 conv → 3×3 conv → 1×1 conv</p>
              <p className="mt-1 text-[10px] leading-4 text-gray-500">구조표에서 3×3 계층의 채널을 좁혔다가 마지막 1×1 계층에서 출력 채널을 늘립니다.</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-gray-200 p-3 dark:border-gray-700">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold">ResNet{depth}의 반복 구조</p>
              <Tag tone="teal">Stem: 7×7 conv, 64, stride 2 → 3×3 max pool, stride 2</Tag>
            </div>
            <div className="grid gap-2 sm:grid-cols-4">
              {stageIds.map((id) => {
                const active = id === stage;
                const stageChannels = isBottleneck ? bottleneckChannels[id][2] : basicChannels[id];
                return (
                  <button key={id} type="button" aria-pressed={active} onClick={() => setStage(id)} className={`rounded-lg border p-3 text-left transition ${active ? "border-violet-400 bg-violet-50 ring-2 ring-violet-200 dark:border-violet-700 dark:bg-violet-950/40 dark:ring-violet-900" : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"}`}>
                    <span className="block text-[11px] font-bold">{id}</span>
                    <span className="mt-1 block text-[10px] font-mono text-gray-500">{stageSizes[id]} · {stageChannels}채널</span>
                    <span className="mt-2 block text-xs font-bold text-violet-800 dark:text-violet-200">× {repeats[id]} 블록</span>
                  </button>
                );
              })}
            </div>
            <div aria-live="polite" className="mt-3 grid gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/70 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-xs font-bold">선택한 구간 · {stage}</p>
                <p className="mt-1 text-[11px] leading-5 text-gray-600 dark:text-gray-300">
                  {isBottleneck
                    ? `이 구간은 병목 블록 ${repeats[stage]}개를 반복합니다. 각 블록의 채널 흐름은 1×1 ${channels?.[0]} → 3×3 ${channels?.[1]} → 1×1 ${channels?.[2]}이며, 출력 특징 맵은 ${stageSizes[stage]}×${channels?.[2]}입니다.`
                    : `이 구간은 3×3 합성곱 두 개를 포함한 잔차 블록 ${repeats[stage]}개를 반복합니다. 출력 특징 맵은 ${stageSizes[stage]}×${basicChannel}입니다.`}
                </p>
              </div>
              <div className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-center dark:border-violet-900 dark:bg-gray-900">
                <p className="text-[9px] font-semibold text-gray-500">공간 크기 변화</p>
                <p className="mt-1 font-mono text-xs font-bold text-violet-800 dark:text-violet-200">{stage === "conv2_x" ? "56×56" : `${stageSizes[stageIds[stageIds.indexOf(stage) - 1]]} → ${stageSizes[stage]}`}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <p className="rounded-lg border-l-4 border-violet-400 bg-violet-50 p-3 text-[11px] leading-5 text-violet-950 dark:bg-violet-950/35 dark:text-violet-100">특징 맵의 가로·세로가 절반으로 줄어드는 stage 전환에서는 필터 수가 두 배가 됩니다. 잔차 덧셈을 하려면 주 경로와 숏컷의 공간 크기·채널 수가 같아야 하므로, 구현에서는 보폭 2의 1×1 합성곱으로 숏컷 쪽도 맞춥니다.</p>
            <p className="rounded-lg bg-gray-50 p-3 text-[11px] leading-5 text-gray-600 dark:bg-gray-800/70 dark:text-gray-300">ImageNet용 모델의 마지막 완전연결층은 1,000개 범주의 점수를 출력합니다. CIFAR-10용 ResNet34는 범주가 열 개이므로 같은 자리에 출력 유닛 열 개를 둡니다.</p>
          </div>
          <div className="mt-3 rounded-lg border border-violet-200 bg-violet-50/60 p-3 dark:border-violet-900 dark:bg-violet-950/25">
            <p className="text-xs font-bold text-violet-900 dark:text-violet-100">가중치를 가진 층 수로 모델 이름 검산</p>
            <p className="mt-1 font-mono text-xs font-bold text-violet-900 dark:text-violet-100">1 stem conv + {layersPerBlock} × ({repeats.conv2_x} + {repeats.conv3_x} + {repeats.conv4_x} + {repeats.conv5_x}) residual-stage convs + 1 fc = {1 + stageConvolutionCount + 1}</p>
            <p className="mt-3 text-sm leading-6"><strong>ResNet{depth}의 연산량은 약 {billionsOfFlops[depth]} × 10⁹ FLOPs입니다.</strong> 이 값은 224×224 입력 한 장을 순전파할 때 필요한 부동소수점 연산 수입니다. 34층의 3.6에 비해 50층은 3.8로 약 6% 늘어납니다. 병목 블록이 3×3 합성곱 안쪽의 채널 수를 줄이므로, 층 수가 늘어난 비율만큼 연산량이 늘지는 않습니다.</p>
            <p className="mt-1 text-[10px] leading-4 text-gray-600 dark:text-gray-400">기본 블록은 가중치 층 2개, 병목 블록은 3개입니다. 시작 합성곱과 마지막 분류 완전연결층을 더하면 선택한 모델 깊이와 일치합니다.</p>
          </div>

        </Card>
      </Sourced>
    </section>
  );
}

type TrainingModel = "googlenet" | "resnet";
type TrainingStep = 0 | 1 | 2 | 3;
const trainingSteps = ["자료 준비", "레이블 표현", "모델 학습", "정확도 확인"] as const;

/** 두 실습의 데이터 처리, 출력, 손실, 최적화와 평가를 나란히 탐색한다. */
export function TrainingFlow() {
  const [model, setModel] = useState<TrainingModel>("googlenet");
  const [step, setStep] = useState<TrainingStep>(0);
  const [epoch, setEpoch] = useState(0);
  const googLeNetRate = 0.01 * Math.pow(0.96, Math.floor((1 + epoch) / 8));
  const labelFlow = model === "googlenet"
    ? "정수 클래스 번호를 10칸 원-핫 벡터로 바꿉니다. 주 출력과 두 보조 출력에 같은 레이블을 전달합니다."
    : "정수 클래스 번호를 그대로 둡니다. sparse_categorical_crossentropy가 정수 레이블과 10개 소프트맥스 출력을 함께 처리합니다.";

  return (
    <section id="dl9-training-flow" className="scroll-mt-32">
      <SectionTitle
        title="두 실습의 데이터에서 평가까지"
        subtitle="GoogLeNet과 ResNet의 구현에서 같은 CIFAR-10 자료가 어떻게 다른 학습 입력과 손실로 이어지는지 추적합니다."
      />
      <Sourced refs={{ slides: "9강 강의록 16–25쪽, 34–38쪽 · 데이터 전처리·학습·평가 코드", lecture: "44:20–44:47 · GoogLeNet 학습률을 8회 간격으로 조정" }}>
        <Card>
          <div className="mb-5 space-y-2 text-sm leading-6">
            <CardTitle>첫 예측에 쓰이는 가중치와 편향은 어디서 올까?</CardTitle>
            <p>합성곱은 필터의 가중합에 편향을 더한 뒤 활성함수를 적용합니다. GoogLeNet 실습에서 <code>glorot_uniform</code>은 입력과 출력 규모에 맞춘 범위에서 서로 다른 초기 가중치를 뽑습니다. 모듈 함수의 기본 편향은 0이고, 3a처럼 호출할 때 <code>Constant(0.2)</code>를 전달한 모듈은 편향을 0.2로 시작합니다. 예를 들어 첫 가중합이 0.5이면 ReLU에 들어갈 값은 0.7입니다. 학습이 시작되면 가중치와 편향 모두 역전파로 갱신됩니다.</p>
            <h3 className="pt-2 font-bold">여덟 번째 에폭에서 무엇이 바뀔까?</h3>
            <p>에폭은 <KeyPhrase>학습 자료 전체를 한 번 사용하는 단위</KeyPhrase>입니다. 이 실습에서는 학습 이미지 2,000장을 한 번씩 사용하면 한 에폭이 끝납니다. 학습률은 <KeyPhrase>가중치를 갱신할 때 한 번에 얼마나 이동할지</KeyPhrase> 조절합니다.</p>
            <p>GoogLeNet의 첫 학습률은 0.01입니다. 일곱 번째 에폭의 인덱스는 6이므로 (1 + 6) ÷ 8의 정수 몫은 0이고, 학습률은 0.01 × 0.96⁰ = 0.01입니다. 여덟 번째에는 몫이 1이 되어 0.01 × 0.96 = 0.0096으로 줄어듭니다.</p>
            <p>이 배율은 GoogLeNet의 SGD에 설정한 값입니다. ResNet34 실습의 Adam은 기울기와 기울기 제곱의 이동평균을 사용해 가중치별 갱신량을 조절합니다.</p>
          </div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <CardTitle>실습을 선택하세요</CardTitle>
            <div className="flex gap-2" role="group" aria-label="모델 학습 흐름">
              {(["googlenet", "resnet"] as TrainingModel[]).map((key) => (
                <button key={key} type="button" aria-pressed={model === key} onClick={() => setModel(key)} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${model === key ? "bg-cyan-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"}`}>
                  {key === "googlenet" ? "GoogLeNet" : "ResNet34"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-4" role="group" aria-label="학습 단계">
            {trainingSteps.map((label, index) => (
              <button key={label} type="button" aria-pressed={step === index} onClick={() => setStep(index as TrainingStep)} className={`rounded-lg border p-3 text-left transition ${step === index ? "border-cyan-400 bg-cyan-50 ring-2 ring-cyan-200 dark:border-cyan-700 dark:bg-cyan-950/35 dark:ring-cyan-900" : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"}`}>
                <span className="block text-[9px] font-bold text-gray-400">0{index + 1}</span>
                <span className="mt-1 block text-xs font-bold">{label}</span>
              </button>
            ))}
          </div>

          <div aria-live="polite" className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr]">
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <p className="text-xs font-bold text-cyan-800 dark:text-cyan-200">{trainingSteps[step]} · {model === "googlenet" ? "GoogLeNet" : "ResNet34"}</p>
              {step === 0 && <div className="mt-2 space-y-2 text-xs leading-5 text-gray-700 dark:text-gray-300"><p>강의 실습은 CIFAR-10 학습 자료 중 처음 2,000장, 테스트 자료 중 처음 500장을 사용합니다.</p><p>각 이미지를 224×224 크기로 바꾸고, 자료형을 float32로 변환한 뒤 픽셀값을 255.0으로 나눕니다. 모델의 입력 모양은 224×224×3입니다.</p></div>}
              {step === 1 && <div className="mt-2 space-y-2 text-xs leading-5 text-gray-700 dark:text-gray-300"><p>{labelFlow}</p><div className="rounded-lg bg-gray-50 p-3 font-mono text-[10px] leading-5 dark:bg-gray-800/70">{model === "googlenet" ? "y_train → to_categorical(y_train, 10)\n[y_train, y_train, y_train] → output, aux_1, aux_2" : "y_train: 0…9 정수 레이블\nDense(10, softmax) → sparse categorical loss"}</div></div>}
              {step === 2 && model === "googlenet" && <div className="mt-2 space-y-2 text-xs leading-5 text-gray-700 dark:text-gray-300"><p>주 분류 출력과 보조 분류기 두 곳에서 각각 categorical crossentropy를 계산합니다. 손실 가중치는 <strong>주 출력 1, 보조 출력 각각 0.3</strong>입니다.</p><p>SGD 최적화의 초기 학습률은 0.01, 모멘텀은 0.9이며, 10회(epoch) 학습합니다.</p></div>}
              {step === 2 && model === "resnet" && <div className="mt-2 space-y-2 text-xs leading-5 text-gray-700 dark:text-gray-300"><p>ResNet34 실습은 10개 소프트맥스 출력과 sparse categorical crossentropy를 사용합니다. 최적화 알고리즘은 Adam이며 10회(epoch) 학습합니다.</p><p>이 코드는 CIFAR-10의 정수 레이블을 그대로 사용해 GoogLeNet 실습의 원-핫 레이블·세 출력 구성과 다릅니다.</p></div>}
              {step === 3 && <div className="mt-2 space-y-2 text-xs leading-5 text-gray-700 dark:text-gray-300"><p>두 실습 모두 x_test와 y_test로 모델을 평가하고 출력에서 정확도를 확인합니다.</p><p>강의 코드에서는 이 500장을 학습 중 validation_data로도 전달한 뒤 최종 evaluate에 다시 사용합니다. 실습 코드의 학습 흐름을 읽을 때 검증 데이터와 최종 평가 데이터가 분리되어 있지 않다는 점도 확인하세요.</p>{model === "googlenet" && <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 p-3 text-[10px] leading-5 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100"><p><strong>다중 출력의 정확도 읽기:</strong> 강의록 코드의 <code>score[1]</code>은 손실과 세 출력의 지표가 함께 반환되는 목록에서 주 출력 정확도를 가리킨다고 단정하기 어렵습니다. 반환 순서는 compile된 손실·지표 구성에 따라 달라질 수 있습니다.</p><pre className="mt-2 overflow-x-auto rounded bg-white p-2 font-mono text-[9px] text-gray-800 dark:bg-gray-900 dark:text-gray-100">{`scores = model.evaluate(x_test, [y_test] * 3, return_dict=True)
print(scores.keys())  # 출력 이름과 지표 이름 확인
main_accuracy = scores["output_accuracy"]`}</pre><p className="mt-2">이 실습 모델의 주 출력 이름은 <code>output</code>입니다. 이름이 붙은 평가 결과에서 그 출력의 정확도를 선택하면 보조 분류기 지표와 구분할 수 있습니다.</p></div>}</div>}
            </div>

            <div className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-4 dark:border-cyan-900 dark:bg-cyan-950/25">
              <p className="text-xs font-bold text-cyan-900 dark:text-cyan-100">GoogLeNet 학습률 스케줄</p>
              <p className="mt-1 text-[10px] leading-4 text-gray-600 dark:text-gray-400">강의 코드의 decay 함수는 8 epoch 간격으로 학습률을 0.96배 합니다. 에폭 번호는 코드가 받는 0부터의 인덱스입니다.</p>
              <div className="mt-3 rounded-lg bg-white p-3 text-center dark:bg-gray-900">
                <p className="font-mono text-[11px] font-bold">0.01 × 0.96<sup>⌊(1 + epoch) / 8⌋</sup></p>
                <p className="mt-1 text-[10px] text-gray-500">현재 epoch {epoch}의 학습률</p>
                <p className="mt-1 font-mono text-xl font-extrabold text-cyan-800 dark:text-cyan-200">{googLeNetRate.toFixed(6)}</p>
              </div>
              <label className="mt-3 block text-[10px] font-semibold text-gray-600 dark:text-gray-300">
                <span className="mb-1 flex justify-between"><span>epoch 인덱스</span><span className="font-mono">{epoch}</span></span>
                <input type="range" min={0} max={31} step={1} value={epoch} onChange={(event) => setEpoch(Number(event.target.value))} className="w-full accent-cyan-700" />
              </label>
              {model === "resnet" && <p className="mt-2 rounded-lg bg-amber-50 p-2 text-[10px] leading-4 text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">이 학습률 스케줄은 GoogLeNet 코드에만 등장합니다. ResNet34 코드는 Adam을 사용하며 이 decay 함수를 설정하지 않습니다.</p>}
            </div>
          </div>

          <p className="mt-4 text-[10px] leading-4 text-gray-500">두 학습 코드가 사용하는 최적화 방법·레이블 표현·출력 수가 다르므로, 실습 결과를 모델 구조 하나의 차이로만 해석하지 않습니다.</p>
        </Card>
      </Sourced>
    </section>
  );
}
