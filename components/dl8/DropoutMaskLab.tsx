"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Chip } from "@/components/dlShared/ui";

type Phase = "train" | "infer";
const NODES = [3, 5, 5, 2];
const X = [35, 125, 215, 305];
const H = 174;

function nodeY(layer: number, index: number) {
  const gap = (H - 34) / (NODES[layer] + 1);
  return 17 + gap * (index + 1);
}

function sample(seed: number, layer: number, index: number) {
  const n = Math.sin(seed * 42.19 + layer * 31.7 + index * 14.3) * 10000;
  return n - Math.floor(n);
}

export default function DropoutMaskLab() {
  const [phase, setPhase] = useState<Phase>("train");
  const [round, setRound] = useState(1);
  const [rate, setRate] = useState(0.35);
  const dropped = (layer: number, index: number) => layer === 0 || layer === NODES.length - 1 ? false : phase === "train" && sample(round, layer, index) < rate;
  let count = 0;
  for (let layer = 1; layer < NODES.length - 1; layer++) for (let i = 0; i < NODES[layer]; i++) if (dropped(layer, i)) count++;

  return (
    <section id="dropout" className="scroll-mt-32">
      <SectionTitle title="드롭아웃 — 은닉층 일부를 잠시 생략" subtitle="훈련 단계마다 다른 노드가 선택되는 모습을 확인해요." />
      <Sourced refs={{ slides: "슬라이드 16 — 드롭아웃의 개념 · 교재 4.5.3 — 학습·추론 단계" }}>
        <Card>
          <CardTitle>훈련 마스크를 바꾸어 보기</CardTitle>
          <p className="mb-3 text-[12px] leading-5 text-gray-600 dark:text-gray-300">
            드롭아웃은 학습 중 은닉층 노드의 일부를 무작위로 생략하는 규제 기술이에요. 아래 노드 수와 무작위 마스크는 개념 설명용이며 AlexNet의 실제 뉴런 수를 나타내지는 않아요.
          </p>
          <div className="mb-3 flex flex-wrap gap-2">
            <Chip active={phase === "train"} onClick={() => setPhase("train")}>훈련 단계</Chip>
            <Chip active={phase === "infer"} onClick={() => setPhase("infer")}>추론 단계</Chip>
            <button type="button" onClick={() => setRound((n) => n + 1)} disabled={phase !== "train"} className="rounded-full border border-violet-200 px-3 py-1 text-xs font-semibold text-violet-700 disabled:opacity-40 dark:border-violet-900 dark:text-violet-300">다음 훈련 단계 · 새 마스크</button>
          </div>
          <label className="block rounded-lg bg-gray-50 p-3 text-[11px] font-semibold text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
            드롭아웃 비율 p · <span className="font-mono text-violet-700 dark:text-violet-300">{Math.round(rate * 100)}%</span>
            <input type="range" min="0.1" max="0.6" step="0.05" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-2 w-full accent-violet-600" />
          </label>
          <div className="mt-3 overflow-x-auto">
            <svg viewBox="0 0 340 190" className="mx-auto h-auto w-full min-w-[300px] max-w-xl" role="img" aria-label={phase === "train" ? `훈련 중 은닉 노드 일부를 끈 신경망, 이번 단계에서 ${count}개를 생략` : "추론 단계에서는 모든 뉴런이 동작하는 신경망"}>
              {NODES.slice(0, -1).map((size, layer) => Array.from({ length: size }).map((_, i) => Array.from({ length: NODES[layer + 1] }).map((__, j) => {
                const off = dropped(layer, i) || dropped(layer + 1, j);
                return <line key={`${layer}-${i}-${j}`} x1={X[layer] + 8} y1={nodeY(layer, i)} x2={X[layer + 1] - 8} y2={nodeY(layer + 1, j)} stroke={off ? "#d1d5db" : "#7c3aed"} strokeWidth={off ? 0.7 : 1.3} strokeDasharray={off ? "3 3" : undefined} opacity={off ? 0.55 : 0.8} />;
              })))}
              {NODES.map((size, layer) => Array.from({ length: size }).map((_, i) => {
                const off = dropped(layer, i);
                return <g key={`${layer}-${i}`}>
                  <circle cx={X[layer]} cy={nodeY(layer, i)} r="8" fill={off ? "#f3f4f6" : layer === 0 || layer === NODES.length - 1 ? "#dbeafe" : "#ddd6fe"} stroke={off ? "#cbd5e1" : layer === 0 || layer === NODES.length - 1 ? "#0284c7" : "#7c3aed"} strokeWidth="1.5" strokeDasharray={off ? "2 2" : undefined} />
                  {off && <path d={`M${X[layer] - 4} ${nodeY(layer, i)}h8`} stroke="#94a3b8" strokeWidth="1.5" />}
                </g>;
              }))}
              {NODES.map((_, layer) => <text key={`label-${layer}`} x={X[layer]} y="12" textAnchor="middle" className="fill-gray-500 text-[9px] font-semibold">{layer === 0 ? "입력" : layer === NODES.length - 1 ? "출력" : "은닉층"}</text>)}
            </svg>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className={`rounded-lg p-3 ${phase === "train" ? "bg-violet-50 dark:bg-violet-950/35" : "bg-gray-50 opacity-70 dark:bg-gray-800/60"}`}>
              <p className="text-[11px] font-bold text-violet-800 dark:text-violet-200">훈련 · 이번 마스크</p>
              <p className="mt-1 text-[12px] leading-5 text-gray-700 dark:text-gray-200">은닉 노드 10개 가운데 <b>{phase === "train" ? count : 0}개</b>를 생략한 예시예요. 다음 단계에서 다시 뽑으면 다른 노드가 선택돼요.</p>
            </div>
            <div className={`rounded-lg p-3 ${phase === "infer" ? "bg-emerald-50 dark:bg-emerald-950/35" : "bg-gray-50 opacity-70 dark:bg-gray-800/60"}`}>
              <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-200">추론 · 전체 뉴런 사용</p>
              <p className="mt-1 text-[12px] leading-5 text-gray-700 dark:text-gray-200">훈련을 마친 뒤 추론할 때는 드롭아웃 없이 모든 뉴런이 동작해요.</p>
            </div>
          </div>
        </Card>
      </Sourced>
    </section>
  );
}
