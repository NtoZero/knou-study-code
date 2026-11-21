"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, Split } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Card, Tag } from "@/components/dlShared/ui";
import { Sourced } from "@/components/dlShared/SourceFilter";

const groups = [
  {
    id: "stem",
    title: "시작 부분 · Stem",
    tint: "border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/30",
    steps: ["입력 224×224×3", "7×7 합성곱 · 64 · 보폭 2", "3×3 최대 풀링 · 보폭 2", "3×3 합성곱 · 192", "3×3 최대 풀링 · 보폭 2"],
    detail: "처음부터 여러 갈래를 펼치지 않고 기본 합성곱과 풀링으로 출발합니다. 강의 실습의 입력은 224×224×3이며, 합성곱에는 ReLU 활성화가 적용됩니다.",
  },
  {
    id: "middle",
    title: "중간 부분 · 9개 인셉션",
    tint: "border-cyan-200 bg-cyan-50 dark:border-cyan-900 dark:bg-cyan-950/30",
    steps: ["3a → 3b", "풀링 → 4a · 보조 분류기 1", "4b → 4c → 4d · 보조 분류기 2", "4e → 풀링", "5a → 5b"],
    detail: "9개의 인셉션 모듈이 중간 특징을 여러 크기의 필터로 병렬 추출합니다. 두 보조 분류기는 네트워크 중간에서 별도 분류 출력을 내며, 학습할 때 중간 깊이에도 손실 신호가 전달됩니다.",
  },
  {
    id: "head",
    title: "끝 부분 · 분류 출력",
    tint: "border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/30",
    steps: ["전역 평균 풀링", "드롭아웃 · 0.4", "완전연결층 · 10개 출력", "소프트맥스"],
    detail: "각 특징 맵을 하나의 평균값으로 줄여 벡터를 만든 뒤 분류합니다. 강의 실습은 CIFAR-10의 10개 클래스에 맞춰 주 출력과 보조 출력 두 개를 함께 구성합니다.",
  },
];

export default function GoogLeNetPipeline() {
  const [selected, setSelected] = useState("middle");
  const [auxiliary, setAuxiliary] = useState(true);
  const active = groups.find((group) => group.id === selected) ?? groups[1];

  return (
    <section id="googlenet-flow" className="scroll-mt-32">
      <SectionTitle
        title="GoogLeNet의 흐름: 시작·중간·끝"
        subtitle="중간 인셉션 모듈을 중심으로 보조 분류기와 마지막 분류 출력을 연결"
      />
      <Sourced refs={{ slides: "9강 강의록 5–6쪽, 10–13쪽, 22–25쪽 · GoogLeNet 구조·보조 분류기·학습", lecture: "09:20–11:03 · output size와 가중치 학습 계층 수 depth 구분; 19:52–20:43 · 중간 분류기의 역할" }}>
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-500">그룹을 선택하면 역할을 읽을 수 있습니다</p>
                <h3 className="mt-1 font-bold">22층 신경망의 큰 구조</h3>
              </div>
              <button
                type="button"
                aria-pressed={auxiliary}
                onClick={() => setAuxiliary((value) => !value)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${auxiliary ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}
              >
                <Split size={14} /> {auxiliary ? "보조 분류기 켜짐" : "보조 분류기 꺼짐"}
              </button>
            </div>

            <div className="grid gap-3">
              {groups.map((group, groupIndex) => (
                <button
                  type="button"
                  key={group.id}
                  aria-pressed={selected === group.id}
                  onClick={() => setSelected(group.id)}
                  className={`rounded-xl border p-3 text-left transition ${group.tint} ${selected === group.id ? "ring-2 ring-cyan-500 ring-offset-2 dark:ring-offset-gray-900" : "opacity-80 hover:opacity-100"}`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-200">{groupIndex + 1}</span>
                    <span className="text-xs font-bold">{group.title}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {group.steps.map((step, stepIndex) => (
                      <span key={step} className="inline-flex items-center gap-1.5">
                        <span className="rounded-md bg-white/80 px-2 py-1 text-[10px] font-medium text-gray-700 dark:bg-gray-900/80 dark:text-gray-200">{step}</span>
                        {stepIndex < group.steps.length - 1 && <span className="text-gray-400">›</span>}
                        {auxiliary && group.id === "middle" && (step.includes("4a") || step.includes("4d")) && (
                          <span className="rounded-md border border-rose-300 bg-rose-50 px-1.5 py-1 text-[9px] font-bold text-rose-700 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200">보조 출력</span>
                        )}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 flex justify-center text-cyan-700 dark:text-cyan-300"><ArrowDown size={18} /></div>
            <AnimatePresence mode="wait">
              <motion.div key={active.id + String(auxiliary)} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                <p className="text-xs font-bold text-cyan-800 dark:text-cyan-200">{active.title}</p>
                <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">{active.detail}</p>
                {selected === "middle" && auxiliary && (
                  <div className="mt-3 rounded-lg border-l-4 border-rose-400 bg-rose-50 p-3 text-xs leading-5 text-rose-900 dark:bg-rose-950/30 dark:text-rose-100">
                    보조 분류기의 손실은 최종 손실에 가중치 0.3으로 더해집니다. 강의 실습 코드에서는 주 출력과 두 보조 출력을 함께 학습 대상으로 둡니다.
                  </div>
                )}
                {selected === "middle" && !auxiliary && (
                  <p className="mt-3 text-xs leading-5 text-gray-500">보조 가지를 끈 상태입니다. 실제 강의 모델에는 중간 분류기가 두 곳에 배치됩니다.</p>
                )}
              </motion.div>
            </AnimatePresence>
          </Card>

          <Card className="h-fit">
            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">output size와 depth 구분</p>
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
              표의 <strong>output size</strong>는 층을 지난 특징 맵의 크기 <span className="font-mono">H×W×C</span>입니다. <strong>depth</strong>는 채널 수가 아니라, 모듈의 경로에서 가중치를 학습하는 계층이 몇 개인지를 셉니다.
            </p>
            <div className="mt-4 space-y-2">
              <div className="rounded-lg bg-sky-50 p-3 dark:bg-sky-950/30"><p className="text-[10px] text-gray-500">output size 예</p><p className="mt-1 font-mono text-sm font-bold">14 × 14 × 480</p><p className="mt-1 text-[10px] text-gray-500">가로 × 세로 × 채널 수</p></div>
              <div className="rounded-lg bg-cyan-50 p-3 dark:bg-cyan-950/30"><p className="text-[10px] text-gray-500">인셉션 경로의 depth 예</p><p className="mt-1 font-mono text-sm font-bold">0 · 1 · 2</p><p className="mt-1 text-[10px] leading-4 text-gray-500">합성곱처럼 가중치를 학습하는 계층 수. 풀링은 가중치가 없어 depth에 세지 않음.</p></div>
            </div>
            <div className="mt-3"><Tag tone="teal">C = 특징 맵 채널 수</Tag></div>
            <p className="mt-3 text-[11px] leading-5 text-gray-500">가중치 계층이 아니라면 출력에 영향을 주더라도 depth의 계층 수에는 포함하지 않습니다. 강의 설명에서는 최대 풀링층은 가중치를 학습하지 않아 층 수에서 제외합니다.</p>
          </Card>
        </div>
      </Sourced>
    </section>
  );
}
