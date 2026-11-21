"use client";

import KeyPhrase from "@/components/dlShared/KeyPhrase";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Card, CardTitle, Tag } from "@/components/dlShared/ui";
import { Sourced } from "@/components/dlShared/SourceFilter";

const initialMaps = [
  { name: "특징 맵 A", values: [2, 4, 6, 8] },
  { name: "특징 맵 B", values: [1, 3, 6, 10] },
];

export default function GlobalAveragePoolingLab() {
  const [maps, setMaps] = useState(initialMaps);

  const changeCell = (mapIndex: number, cellIndex: number) => {
    setMaps((current) => current.map((map, i) => i !== mapIndex ? map : {
      ...map,
      values: map.values.map((value, j) => j === cellIndex ? (value + 1) % 10 : value),
    }));
  };

  const reset = () => setMaps(initialMaps);

  return (
    <section id="global-average-pooling" className="scroll-mt-32">
      <SectionTitle
        title="전역 평균 풀링: 특징 맵마다 평균 한 값"
        subtitle="칸을 눌러 값을 바꾸고, 각 특징 맵이 출력 벡터의 한 원소로 줄어드는 것을 확인"
      />
      <Sourced refs={{ slides: "9강 강의록 12–13쪽 · GoogLeNet 끝 부분과 전역 평균 풀링", lecture: "34:15–35:31 · GAP 도입과 완전연결층의 연산 부담" }}>
        <Card className="mb-4 border-cyan-200 bg-cyan-50/40 dark:border-cyan-900 dark:bg-cyan-950/20">
          <CardTitle>특징 맵마다 평균 한 개를 만들고 분류기에 전달</CardTitle>
          <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-300">
            GAP는 여러 특징 맵을 서로 합치지 않습니다. <KeyPhrase>한 맵의 가로·세로 위치를 전부 평균해 스칼라 하나</KeyPhrase>를 만들고, 이 과정을 채널마다 반복해 길이 C인 벡터를 냅니다. 위치별 배열은 사라지고 어떤 특징이 맵 전체에서 얼마나 나타났는지 평균으로 남습니다.
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-lg border border-cyan-200 bg-white p-3 dark:border-cyan-900 dark:bg-gray-900">
              <p className="text-[10px] font-bold text-cyan-800 dark:text-cyan-200">작은 특징 맵을 손으로 평균</p>
              <p className="mt-2 font-mono text-[13px] leading-6">A = [1, 2; 3, 6] → (1+2+3+6)/4 = 3<br />B = [4, 2; 0, 2] → (4+2+0+2)/4 = 2</p>
              <p className="mt-1 text-[13px] font-bold">출력 벡터 = [3, 2]</p>
              <p className="mt-1 text-[13px] leading-6 text-gray-700 dark:text-gray-300">max pooling이면 각각 6과 4만 남으므로 평균과 결과가 다름.</p>
            </div>
            <div className="rounded-lg border border-cyan-200 bg-white p-3 dark:border-cyan-900 dark:bg-gray-900">
              <p className="text-[10px] font-bold text-cyan-800 dark:text-cyan-200">분류층 가중치 수로 효과 확인</p>
              <p className="mt-2 text-[13px] leading-6 text-gray-700 dark:text-gray-300">마지막 특징 맵이 7×7×1024이고 분류 출력이 1,000개라고 가정. 공간을 먼저 펴면 Dense 가중치는 50,176×1,000=50,176,000개. GAP 뒤에는 1,024×1,000=1,024,000개.</p>
              <p className="mt-1 text-[13px] font-bold text-cyan-900 dark:text-cyan-100">GAP를 거치면 이 비교에서 가중치가 49분의 1</p>
              <p className="mt-1 text-[10px] leading-4 text-gray-500">bias는 두 계산에서 제외. GAP는 GoogLeNet의 끝에서 채널별 평균 벡터를 분류층으로 전달.</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>두 특징 맵을 차례로 줄여 보세요</CardTitle>
              <p className="text-[11px] text-gray-500">아래 작은 수치는 동작을 보여 주기 위한 예시입니다. 각 칸을 누르면 0–9로 순환합니다.</p>
            </div>
            <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"><RotateCcw size={13} /> 예시 초기화</button>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_120px_1fr] md:items-center">
            <div className="grid grid-cols-2 gap-3">
              {maps.map((map, mapIndex) => {
                const average = map.values.reduce((sum, value) => sum + value, 0) / map.values.length;
                const maximum = Math.max(...map.values);
                return (
                  <div key={map.name} className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                    <p className="mb-2 text-center text-xs font-bold">{map.name}</p>
                    <div className="mx-auto grid w-fit grid-cols-2 gap-1.5" role="group" aria-label={`${map.name} 값 바꾸기`}>
                      {map.values.map((value, cellIndex) => (
                        <button type="button" key={cellIndex} onClick={() => changeCell(mapIndex, cellIndex)} aria-label={`${map.name} ${cellIndex + 1}번째 값 ${value}; 눌러 값 증가`} className="flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-200 bg-cyan-50 text-base font-bold tabular-nums text-cyan-900 transition hover:scale-105 hover:bg-cyan-100 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-100">{value}</button>
                      ))}
                    </div>
                    <p className="mt-2 text-center text-[10px] text-gray-500">평균 {average.toFixed(2)} · 최댓값 {maximum}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col items-center justify-center text-cyan-700 dark:text-cyan-300">
              <span className="text-[10px] font-semibold">공간 전체 평균</span>
              <span className="text-2xl">→</span>
            </div>

            <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-900 dark:bg-cyan-950/30">
              <p className="text-center text-xs font-bold">출력 벡터</p>
              <div className="mt-3 flex justify-center gap-2">
                {maps.map((map) => {
                  const average = map.values.reduce((sum, value) => sum + value, 0) / map.values.length;
                  return <span key={map.name} className="flex h-12 min-w-12 items-center justify-center rounded-lg bg-white px-2 font-mono text-sm font-bold text-cyan-900 shadow-sm dark:bg-gray-900 dark:text-cyan-100">{average.toFixed(2)}</span>;
                })}
              </div>
              <p className="mt-2 text-center text-[10px] leading-4 text-gray-500">특징 맵 하나마다 평균값 하나</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/70">
            <Tag tone="teal">전역 평균 풀링</Tag>
            <p className="text-xs leading-5 text-gray-700 dark:text-gray-300">평균은 모든 위치를 반영합니다. 최대 풀링처럼 가장 큰 값 하나를 고르는 방식과 구분하세요.</p>
          </div>
        </Card>
      </Sourced>
    </section>
  );
}
