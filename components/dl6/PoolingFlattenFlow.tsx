"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Card, Formula } from "@/components/dlShared/ui";
import { Sourced } from "@/components/dlShared/SourceFilter";

const map = [
  [2, 8, 1, 4],
  [5, 3, 6, 2],
  [1, 7, 3, 9],
  [4, 2, 5, 0],
];
const tensors = [
  [[2, 8], [5, 3]],
  [[1, 4], [6, 2]],
];

export default function PoolingFlattenFlow() {
  const [method, setMethod] = useState<"max" | "average">("max");
  const pooled = Array.from({ length: 2 }, (_, r) => Array.from({ length: 2 }, (_, c) => {
    const values = [map[r * 2][c * 2], map[r * 2][c * 2 + 1], map[r * 2 + 1][c * 2], map[r * 2 + 1][c * 2 + 1]];
    return method === "max" ? Math.max(...values) : values.reduce((sum, value) => sum + value, 0) / values.length;
  }));
  const flat = [...tensors[0].flat(), ...tensors[1].flat()];

  return (
    <section>
      <SectionTitle title="공간 크기는 줄이고, 채널은 살리고" subtitle="풀링 연산과 평탄화가 텐서의 서로 다른 축을 바꾸는 지점을 비교하세요" />
      <Sourced refs={{ slides: "강의록 6강 PDF 31–38쪽 — 풀링·완전연결층·소프트맥스·Flatten", lecture: "강의 6강 54:29–54:57, 61:53–63:09 — 다운샘플링과 소프트맥스 해석" }}>
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <Card>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold">2 × 2 풀링 창</h3>
                <p className="mt-1 text-xs leading-5 text-gray-500">각 창의 대표값을 남겨 높이와 너비를 줄임. 학습되는 가중치가 없는 다운샘플링 연산.</p>
              </div>
              <div className="flex gap-1 rounded-lg border border-gray-200 p-1 dark:border-gray-700">
                <button type="button" aria-pressed={method === "max"} onClick={() => setMethod("max")} className={`rounded-md px-2.5 py-1.5 text-[11px] font-semibold ${method === "max" ? "bg-cyan-600 text-white" : "text-gray-500"}`}>최대값</button>
                <button type="button" aria-pressed={method === "average"} onClick={() => setMethod("average")} className={`rounded-md px-2.5 py-1.5 text-[11px] font-semibold ${method === "average" ? "bg-cyan-600 text-white" : "text-gray-500"}`}>평균값</button>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_auto_0.7fr] items-center gap-3">
              <NumberGrid values={map} title="입력 특징 맵 · 4 × 4" highlightBlocks />
              <span className="text-lg text-gray-300" aria-hidden="true">→</span>
              <NumberGrid values={pooled} title={`${method === "max" ? "최대값" : "평균값"} 결과 · 2 × 2`} />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[10px]">
              {["2 × 2 창", "스트라이드 2", "학습 가중치 없음", "채널별 독립 적용"].map((text) => <div key={text} className="rounded-lg bg-gray-50 px-2 py-2 text-gray-600 dark:bg-gray-800 dark:text-gray-300">{text}</div>)}
            </div>
            <div className="mt-3 rounded-lg border-l-2 border-cyan-400 bg-cyan-50/60 px-3 py-2 text-[11px] leading-5 text-cyan-950 dark:bg-cyan-950/20 dark:text-cyan-100">예를 들어 8 × 8 × 12의 특징 맵을 2 × 2, 스트라이드 2 풀링하면 4 × 4 × 12가 됨. 높이·너비는 절반, 채널 수 12는 유지.</div>
          </Card>

          <Card>
            <div>
              <h3 className="text-sm font-bold">완전연결층 앞에서 평탄화</h3>
              <p className="mt-1 text-xs leading-5 text-gray-500">합성곱·풀링이 만든 여러 특징 맵을 길게 펼쳐 1차원 벡터로 전달함. 위치와 채널을 버리는 연산이 아니라, 원소를 한 줄로 재배열함.</p>
            </div>
            <div className="mt-5 grid grid-cols-[1fr_auto_1.15fr] items-center gap-3">
              <div className="flex justify-center gap-2">
                {tensors.map((channel, index) => (
                  <div key={index} className="rounded-lg border border-violet-200 bg-violet-50 p-2 dark:border-violet-900 dark:bg-violet-950/20">
                    <div className="mb-1 text-center text-[9px] font-bold text-violet-600 dark:text-violet-300">채널 {index + 1}</div>
                    <NumberGrid values={channel} compact />
                  </div>
                ))}
              </div>
              <span className="text-lg text-gray-300" aria-hidden="true">→</span>
              <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
                <div className="mb-2 text-center text-[10px] font-semibold text-gray-500">평탄화된 1차원 벡터 · 길이 {flat.length}</div>
                <div className="flex flex-wrap justify-center gap-1">
                  {flat.map((value, i) => <div key={i} className="flex h-8 w-8 items-center justify-center rounded-md border border-violet-200 bg-white font-mono text-xs font-bold text-violet-800 dark:border-violet-900 dark:bg-gray-900 dark:text-violet-200" title={`원소 ${i + 1}`}>{value}</div>)}
                </div>
                <div className="mt-2 text-center text-[9px] text-gray-400">첫 채널 → 다음 채널 순서로 배열</div>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Formula className="border-violet-100 bg-violet-50/70 text-violet-950 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-100">
                H × W × C → (H · W · C)개 원소
              </Formula>
              <div className="rounded-lg bg-gray-50 px-3 py-2 text-[11px] leading-5 text-gray-600 dark:bg-gray-800 dark:text-gray-300">마지막의 완전연결층은 펼친 벡터에서 분류에 쓸 조합을 학습하고, 소프트맥스는 클래스별 출력 점수를 확률 분포로 바꿈.</div>
            </div>
          </Card>
        </div>
      </Sourced>
    </section>
  );
}

function NumberGrid({ values, title, compact = false, highlightBlocks = false }: { values: readonly (readonly number[])[]; title?: string; compact?: boolean; highlightBlocks?: boolean }) {
  return (
    <div>
      {title && <div className="mb-2 text-center text-[10px] font-semibold text-gray-500">{title}</div>}
      <div className="mx-auto grid w-fit gap-1" style={{ gridTemplateColumns: `repeat(${values[0].length}, minmax(${compact ? "1.55rem" : "2rem"}, 1fr))` }}>
        {values.flatMap((row, r) => row.map((value, c) => {
          const block = highlightBlocks ? Math.floor(r / 2) * 2 + Math.floor(c / 2) : 0;
          const tones = ["border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-900 dark:bg-cyan-950/50 dark:text-cyan-100", "border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-100", "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100", "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"];
          return <div key={`${r}-${c}`} className={`flex ${compact ? "h-7 w-7" : "h-9 w-9"} items-center justify-center rounded-md border font-mono text-xs font-bold ${highlightBlocks ? tones[block] : "border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"}`}>{Number.isInteger(value) ? value : value.toFixed(1)}</div>;
        }))}
      </div>
    </div>
  );
}
