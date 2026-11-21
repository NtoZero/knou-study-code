"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, GitMerge, Minus, Plus } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Card, CardTitle, Slider, Tag } from "@/components/dlShared/ui";
import { Sourced } from "@/components/dlShared/SourceFilter";

type BlockShape = "same" | "change";

export default function ResidualLearningLab() {
  const [input, setInput] = useState(3);
  const [residual, setResidual] = useState(-2);
  const [shape, setShape] = useState<BlockShape>("same");
  const [implementationOpen, setImplementationOpen] = useState(false);
  const shortcut = shape === "same" ? input : input * 2;
  const output = Math.max(0, shortcut + residual);

  return (
    <section id="residual-learning" className="scroll-mt-32">
      <SectionTitle
        title="ResNet: 입력에 잔차를 더해 깊은 층을 학습"
        subtitle="주 경로는 새로 배운 변화량을 만들고, 숏컷은 입력을 더하기 지점까지 전달"
      />
      <Sourced refs={{ slides: "9강 강의록 27–31쪽, 36–38쪽 · ResNet 깊이 비교·잔차 학습·구현", lecture: "56:47–57:58 · plain 20층·56층 오차 비교; 63:01–63:30 · 잔차 합과 입력 보존; 71:33–72:50 · ResidualUnit·스테이지 반복·GAP" }}>
        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>숏컷의 값을 바꿔 보세요</CardTitle>
                <p className="text-[11px] text-gray-500">설명용 스칼라 값으로 합과 ReLU 출력을 추적합니다.</p>
              </div>
              <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800" role="group" aria-label="잔차 블록 입력 형태">
                <button type="button" aria-pressed={shape === "same"} onClick={() => setShape("same")} className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${shape === "same" ? "bg-white text-cyan-800 shadow-sm dark:bg-gray-700 dark:text-cyan-200" : "text-gray-500"}`}>같은 크기</button>
                <button type="button" aria-pressed={shape === "change"} onClick={() => setShape("change")} className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${shape === "change" ? "bg-white text-cyan-800 shadow-sm dark:bg-gray-700 dark:text-cyan-200" : "text-gray-500"}`}>크기 변경</button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <div className="grid grid-cols-[58px_1fr_68px] items-center gap-2 sm:grid-cols-[72px_1fr_82px]">
                <div className="rounded-lg border border-sky-200 bg-white p-2 text-center dark:border-sky-900 dark:bg-gray-900">
                  <p className="text-[10px] font-semibold text-gray-500">입력</p>
                  <p className="mt-1 font-mono text-lg font-bold text-sky-800 dark:text-sky-200">x={input}</p>
                </div>
                <div className="relative grid min-h-[148px] grid-cols-[1fr_38px] grid-rows-2 items-center gap-x-2 gap-y-3 rounded-xl border border-cyan-200 bg-white p-3 dark:border-cyan-900 dark:bg-gray-900">
                  <svg aria-hidden="true" viewBox="0 0 500 150" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
                    <defs><marker id="dl9-arrow-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#0891b2" /></marker></defs>
                    <path d="M 0 75 L 34 75 C 58 75, 58 42, 86 42 L 393 42 C 421 42, 421 75, 447 75" fill="none" stroke="#0891b2" strokeWidth="2.5" markerEnd="url(#dl9-arrow-head)" />
                    <path d="M 0 75 C 58 75, 58 110, 86 110 L 393 110 C 421 110, 421 75, 447 75" fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="6 5" markerEnd="url(#dl9-arrow-head)" />
                    <path d="M 461 75 L 500 75" fill="none" stroke="#0891b2" strokeWidth="2.5" markerEnd="url(#dl9-arrow-head)" />
                  </svg>
                  <div className="relative z-10 rounded-lg bg-cyan-50 px-2 py-2 text-center dark:bg-cyan-950/50">
                    <p className="text-[9px] font-bold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">주 경로</p>
                    <p className="mt-1 text-[9px] leading-4">가중치 층 → 활성함수 → 가중치 층</p>
                    <p className="mt-1 font-mono text-xs font-bold">F(x)={residual}</p>
                  </div>
                  <div className="relative z-10 rounded-lg bg-sky-50 px-2 py-2 text-center dark:bg-sky-950/50">
                    <p className="text-[9px] font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300">숏컷</p>
                    <p className="mt-1 text-[9px] leading-4">{shape === "same" ? "입력 x를 그대로 전달" : "1×1 투영으로 크기 조정"}</p>
                    <p className="mt-1 font-mono text-xs font-bold">{shape === "same" ? `x=${input}` : `P(x)=2×${input}=${shortcut}`}</p>
                  </div>
                  <div className="relative z-10 row-span-2 mx-auto flex h-9 w-9 items-center justify-center rounded-full border-2 border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-200"><Plus size={19} /></div>
                  </div>
                <div className="rounded-lg border border-violet-200 bg-violet-50 p-2 text-center dark:border-violet-900 dark:bg-violet-950/30">
                  <p className="text-[9px] font-semibold leading-4 text-gray-500">합산 후 ReLU</p>
                  <p className="mt-1 font-mono text-sm font-bold text-violet-800 dark:text-violet-200">{output}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Slider label="입력 x" value={input} min={-4} max={6} step={1} onChange={setInput} />
                <Slider label="주 경로가 학습한 F(x)" value={residual} min={-6} max={6} step={1} onChange={setResidual} />
                <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 text-center dark:border-violet-900 dark:bg-violet-950/30">
                  <p className="text-[10px] font-semibold text-gray-500">덧셈 후 ReLU</p>
                  <p className="mt-1 font-mono text-xs text-gray-700 dark:text-gray-300">max(0, {shortcut} + ({residual}))</p>
                  <p className="mt-1 text-xl font-extrabold text-violet-800 dark:text-violet-200">{output}</p>
                </div>
              </div>
              <div className="mt-3 rounded-lg bg-white px-3 py-2 text-xs leading-5 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                {residual === 0 ? shape === "same" ? "F(x)=0이면 덧셈 결과는 x입니다. 마지막 ReLU 뒤에는 max(0, x)가 출력됩니다." : "F(x)=0이면 덧셈 결과는 투영된 입력 P(x)입니다. 마지막 ReLU 뒤에는 max(0, P(x))가 출력됩니다." : shape === "same" ? residual > 0 ? "주 경로가 양의 변화를 보태고, 숏컷은 기존 입력을 그대로 보존합니다." : "주 경로가 입력의 일부를 낮추는 변화를 배우지만, 숏컷이 입력 정보를 더해 줍니다." : residual > 0 ? "주 경로가 양의 변화를 보태고, 숏컷은 P(x)로 크기를 맞춘 입력을 더합니다." : "주 경로가 변화를 배우고, 숏컷은 P(x)로 공간 크기와 채널 수를 맞춰 입력 정보를 이어 줍니다."}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={shape} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-5 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
                {shape === "same" ? <GitMerge size={15} className="mt-0.5 shrink-0" /> : <ArrowRight size={15} className="mt-0.5 shrink-0" />}
                <p>{shape === "same" ? <><strong>크기가 같으면</strong> 숏컷은 항등 연결(identity)로 입력을 바로 더할 수 있습니다.</> : <><strong>공간 크기나 채널 수가 달라지면</strong> 두 경로를 바로 더할 수 없습니다. 강의 실습에서는 보폭이 1보다 큰 경우 1×1 합성곱과 배치 정규화로 숏컷 쪽 크기를 맞춥니다. 여기서 수치 추적을 위한 투영값은 이해를 돕는 단순 예로 <span className="font-mono">P(x)=2x</span>라고 두었습니다.</>}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <button
                type="button"
                aria-expanded={implementationOpen}
                aria-controls="resnet34-implementation"
                onClick={() => setImplementationOpen((open) => !open)}
                className="flex w-full items-center justify-between gap-3 bg-gray-50 p-4 text-left dark:bg-gray-800/70"
              >
                <span>
                  <span className="block text-xs font-bold">ResNet34 실습 코드 따라 읽기</span>
                  <span className="mt-1 block text-[10px] text-gray-500">잔차 유닛 → 반복 횟수와 보폭 → 분류기</span>
                </span>
                <ChevronDown size={16} className={`shrink-0 text-gray-500 transition-transform ${implementationOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {implementationOpen && (
                  <motion.div
                    id="resnet34-implementation"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 border-t border-gray-200 p-4 dark:border-gray-700">
                      <div>
                        <p className="text-xs font-bold">1. 한 ResidualUnit 안의 두 경로</p>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          <div className="rounded-lg bg-cyan-50 p-3 dark:bg-cyan-950/30">
                            <p className="text-[10px] font-bold text-cyan-800 dark:text-cyan-200">주 경로</p>
                            <p className="mt-1 text-[11px] leading-5 text-gray-700 dark:text-gray-300">3×3 합성곱(stride=s) → 배치 정규화 → 활성함수 → 3×3 합성곱 → 배치 정규화</p>
                          </div>
                          <div className="rounded-lg bg-sky-50 p-3 dark:bg-sky-950/30">
                            <p className="text-[10px] font-bold text-sky-800 dark:text-sky-200">숏컷 경로</p>
                            <p className="mt-1 text-[11px] leading-5 text-gray-700 dark:text-gray-300">기본은 입력을 그대로 둡니다. <code>stride &gt; 1</code>이면 1×1 합성곱과 배치 정규화로 출력 크기를 맞춘 뒤, 두 경로를 더하고 활성함수를 적용합니다.</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold">2. 필터 수가 바뀌는 곳에서만 공간 크기도 줄이기</p>
                        <p className="mt-1 text-[11px] leading-5 text-gray-600 dark:text-gray-400">실습 코드는 필터 수를 <code>[64]×3 → [128]×4 → [256]×6 → [512]×3</code> 순서로 반복합니다. 직전 스테이지와 필터 수가 같으면 보폭 1, 달라지면 보폭 2를 설정해 특징 맵의 공간 크기를 줄이고 새 채널 수에 맞춥니다.</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold">3. 분류 출력으로 마무리</p>
                        <p className="mt-1 text-[11px] leading-5 text-gray-600 dark:text-gray-400">잔차 유닛 반복 뒤에는 <code>전역 평균 풀링 → Flatten → Dense(10, softmax)</code>를 적용해 CIFAR-10의 10개 클래스에 대한 출력을 만듭니다.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          <Card className="h-fit min-w-0">
            <div className="mb-3 flex items-center gap-2"><Minus size={16} className="text-rose-600 dark:text-rose-300" /><CardTitle>왜 잔차를 학습할까?</CardTitle></div>
            <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
              기존 층은 입력 <span className="font-mono">x</span>에서 목표 변환 <span className="font-mono">H(x)</span>를 바로 학습합니다. 잔차 학습은 숏컷으로 <span className="font-mono">x</span>를 더하고, 주 경로가 그 차이인 <span className="font-mono">F(x)=H(x)−x</span>를 학습하도록 바꿉니다.
            </p>
            <div className="my-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800/70">
              <div><p className="text-[10px] text-gray-500">기존 학습</p><p className="mt-1 font-mono text-sm font-bold">H(x)</p></div><ArrowRight size={16} className="text-gray-400" /><div><p className="text-[10px] text-gray-500">잔차 학습</p><p className="mt-1 font-mono text-sm font-bold text-cyan-800 dark:text-cyan-200">F(x) + x</p></div>
            </div>
              <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">층을 더 쌓아도 앞에서 전달되는 입력 정보가 숏컷으로 이어집니다. 강의는 이 연결이 깊은 망의 기울기 소실과 학습 성능 저하를 완화하고, 원래 입력에서 달라져야 할 부분을 중심으로 학습하게 한다고 설명합니다. F(x)=0인 경우에도 마지막 ReLU 전까지 x가 전달되며, ReLU 뒤의 값은 max(0, x)입니다.</p>
            <div className="mt-4 flex flex-wrap gap-2"><Tag tone="teal">ResNet = 잔차 학습</Tag><Tag>숏컷 연결</Tag></div>
            <div className="mt-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <p className="text-xs font-bold">깊이와 학습 오차</p>
              <p className="mt-1 text-[11px] leading-5 text-gray-600 dark:text-gray-400">강의의 비교 그림은 숏컷 없는 56층 망이 20층 망보다 학습 오차와 테스트 오차 모두 더 높을 수 있음을 보여 줍니다. 학습 오차부터 높으므로 이 차이를 단순히 과적합으로만 해석할 수는 없습니다. 층을 늘리기만 하면 성능이 항상 좋아지는 것은 아닙니다.</p>
            </div>
          </Card>
        </div>
      </Sourced>
    </section>
  );
}
