"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Card, Chip, Scroller } from "@/components/dlShared/ui";
import { Sourced } from "@/components/dlShared/SourceFilter";

const layers = [
  { id: "input", short: "입력", title: "MNIST 입력", size: "32 × 32 × 1", kind: "전처리", detail: "MNIST 숫자 이미지는 28 × 28 그레이스케일. 테두리에 2칸을 덧대어 가운데 정렬된 32 × 32 입력으로 사용." },
  { id: "c1", short: "C1", title: "합성곱", size: "28 × 28 × 6", kind: "6개 필터 · 5 × 5", detail: "5 × 5 필터 6개를 스트라이드 1로 적용. tanh를 거쳐 6장의 특징 맵을 출력." },
  { id: "s2", short: "S2", title: "평균 풀링", size: "14 × 14 × 6", kind: "2 × 2 · stride 2", detail: "C1의 각 특징 맵에 2 × 2 평균 풀링을 적용해 공간 크기를 절반으로 줄임. 여섯 채널은 유지." },
  { id: "c3", short: "C3", title: "연결이 선택된 합성곱", size: "10 × 10 × 16", kind: "16개 출력 맵", detail: "입력 특징 맵 6개 모두를 모든 출력에 연결하지 않는 LeNet-5의 선택적 연결 구조. 연산량을 줄이며 서로 다른 입력 조합으로 상호보완 특징을 학습." },
  { id: "s4", short: "S4", title: "평균 풀링", size: "5 × 5 × 16", kind: "2 × 2 · stride 2", detail: "C3에서 얻은 16장의 맵을 평균 풀링해 5 × 5로 축소." },
  { id: "c5", short: "C5", title: "합성곱", size: "1 × 1 × 120", kind: "120개 필터 · 5 × 5", detail: "5 × 5 필터 120개를 적용해 각 5 × 5 입력 맵에서 1 × 1 맵 120개를 계산." },
  { id: "f6", short: "F6", title: "완전연결층", size: "84개 유닛", kind: "tanh", detail: "C5의 120개 값을 받아 84개 유닛의 표현으로 연결." },
  { id: "out", short: "출력", title: "RBF 출력", size: "10개 유닛", kind: "숫자 0–9", detail: "F6의 표현을 10개 숫자 범주 출력으로 연결. 원래 LeNet-5 설명에서는 가우시안 연결, 즉 RBF를 사용." },
] as const;

const c3Inputs = [
  [0, 1, 2], [1, 2, 3], [2, 3, 4], [3, 4, 5], [0, 4, 5], [0, 1, 5],
  [0, 1, 2, 3], [1, 2, 3, 4], [2, 3, 4, 5], [0, 3, 4, 5], [0, 1, 4, 5], [0, 1, 2, 5],
  [0, 1, 3, 4], [1, 2, 4, 5], [0, 2, 3, 5], [0, 1, 2, 3, 4, 5],
];

export default function LeNet5Explorer() {
  const [active, setActive] = useState(0);
  const [c3Map, setC3Map] = useState(0);
  const layer = layers[active];
  const connected = c3Inputs[c3Map];

  return (
    <section>
      <SectionTitle title="LeNet-5: 이미지에서 숫자까지" subtitle="층을 선택해 28 × 28 숫자 이미지가 10개 분류 출력으로 바뀌는 경로를 살펴보세요" />
      <Sourced refs={{ slides: "강의록 7강 PDF 4–18쪽 — LeNet-5 구조·각 계층·C3 연결·RBF 출력", lecture: "강의 7강 14:38–15:53, 20:30–20:59, 25:46–27:03 — 풀링·입력·C3 설계 배경·출력" }}>
        <Card className="border-amber-200 dark:border-amber-900">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">1998 · 손글씨 숫자 분류</div>
              <h3 className="mt-1 text-sm font-bold">LeNet-5의 전체 경로</h3>
              <p className="mt-1 max-w-3xl text-xs leading-5 text-gray-500">합성곱과 샘플링을 번갈아 거쳐 특징을 추출한 다음, 완전연결층과 RBF 출력으로 숫자 범주를 정함.</p>
            </div>
            <div className="rounded-lg bg-amber-50 px-3 py-2 text-[10px] text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">입력: 28 × 28 × 1 → 패딩 2칸 → 32 × 32 × 1</div>
          </div>

          <Scroller>
            <div className="mt-5 flex min-w-[900px] items-center gap-2 pb-2">
              {layers.map((item, index) => (
                <div key={item.id} className="flex flex-1 items-center gap-2">
                  <button type="button" onClick={() => setActive(index)} aria-pressed={active === index} className={`min-w-0 flex-1 rounded-xl border px-2 py-3 text-center transition-colors ${active === index ? "border-amber-500 bg-amber-100 text-amber-950 shadow-sm dark:border-amber-700 dark:bg-amber-900/50 dark:text-amber-50" : "border-gray-200 bg-white hover:border-amber-200 dark:border-gray-700 dark:bg-gray-900"}`}>
                    <span className="block text-xs font-black">{item.short}</span>
                    <span className="mt-1 block truncate text-[9px] text-gray-500">{item.size}</span>
                  </button>
                  {index < layers.length - 1 && <span className="shrink-0 text-gray-300" aria-hidden="true">›</span>}
                </div>
              ))}
            </div>
          </Scroller>

          <div className="mt-2 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-xl bg-gray-950 p-4 text-white">
              <div className="text-[10px] font-semibold text-amber-300">선택한 층 · {layer.short}</div>
              <h4 className="mt-1 text-base font-bold">{layer.title}</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-md border border-gray-700 px-2 py-1 font-mono text-[10px]">{layer.size}</span>
                <span className="rounded-md border border-gray-700 px-2 py-1 text-[10px] text-gray-300">{layer.kind}</span>
              </div>
              <p className="mt-3 text-xs leading-6 text-gray-300">{layer.detail}</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4 dark:border-amber-950 dark:bg-amber-950/10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold">C3의 입력 선택</h4>
                  <p className="mt-1 text-[10px] text-gray-500">출력 특징 맵을 선택해 연결된 S2 입력을 확인</p>
                </div>
                <label className="flex items-center gap-2 text-[10px] text-gray-600 dark:text-gray-300">C3 출력
                  <select value={c3Map} onChange={(e) => setC3Map(Number(e.target.value))} className="rounded-md border border-gray-200 bg-white px-2 py-1 font-mono dark:border-gray-700 dark:bg-gray-900">
                    {c3Inputs.map((_, i) => <option key={i} value={i}>맵 {i}</option>)}
                  </select>
                </label>
              </div>
              <div className="mt-3 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1.5">
                <span className="text-[9px] font-semibold text-gray-400">S2 입력</span>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: 6 }, (_, i) => <span key={i} className={`rounded-md px-2 py-1 font-mono text-[10px] ${connected.includes(i) ? "bg-amber-500 font-bold text-white" : "bg-gray-100 text-gray-400 dark:bg-gray-800"}`}>{i}</span>)}
                </div>
                <span className="text-[9px] font-semibold text-gray-400">가중치 묶음</span>
                <span className="text-[10px] text-gray-600 dark:text-gray-300">입력 맵 {connected.join(", ")}의 5 × 5 필터를 적용한 뒤 결과를 합산</span>
                <span className="text-[9px] font-semibold text-gray-400">구조 효과</span>
                <span className="text-[10px] text-gray-600 dark:text-gray-300">모든 맵을 전부 잇지 않아 계산량을 줄이고 서로 다른 조합의 특징을 학습</span>
              </div>
              <p className="mt-2 rounded-md border-l-2 border-amber-400 bg-amber-50/70 px-2.5 py-2 text-[9px] leading-4 text-amber-900 dark:bg-amber-950/20 dark:text-amber-100">강의 강조: 제한된 연산 자원에서 계산을 줄이려 도입한 LeNet-5의 역사적 연결 방식이며, 오늘날에는 일반적으로 사용하지 않는다고 설명.</p>
              <div className="mt-3 grid grid-cols-6 gap-1">
                {Array.from({ length: 6 }, (_, input) => Array.from({ length: 16 }, (_, output) => (
                  <div key={`${input}-${output}`} className={`h-3 rounded-sm ${c3Inputs[output].includes(input) ? output === c3Map ? "bg-amber-500" : "bg-amber-200 dark:bg-amber-800" : "bg-gray-100 dark:bg-gray-800"}`} title={`S2 ${input} → C3 ${output}${c3Inputs[output].includes(input) ? " 연결" : " 연결 없음"}`} />
                ))) }
              </div>
              <div className="mt-1 flex justify-between text-[8px] text-gray-400"><span>행: S2 입력 맵 0–5</span><span>열: C3 출력 맵 0–15</span></div>
            </div>
          </div>
        </Card>
      </Sourced>
    </section>
  );
}
