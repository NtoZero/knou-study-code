"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Chip, Slider, ComputedNote, Scroller, fmt } from "@/components/dlShared/ui";

type Phase = "train" | "infer";

/** 고정 시드 생성기 — 렌더 중 Math.random을 쓰지 않기 위해 */
function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const LAYERS = [4, 6, 6, 3]; // 입력층 · 은닉층 2개 · 출력층
const NODE_R = 9;
const COL_X = [40, 128, 216, 300];
const VIEW_W = 340;
const VIEW_H = 220;

function r2(v: number) {
  return Math.round(v * 100) / 100;
}

function nodeY(layer: number, i: number): number {
  const n = LAYERS[layer];
  const gap = (VIEW_H - 40) / (n + 1);
  return r2(20 + gap * (i + 1));
}

/** 은닉층(1, 2번 열)에만 드롭아웃을 적용한다 */
function isDropped(layer: number, i: number, p: number, round: number): boolean {
  if (layer === 0 || layer === LAYERS.length - 1) return false;
  return rand(round * 100 + layer * 17 + i * 3 + 1) < p;
}

export default function DropoutLab() {
  const [p, setP] = useState(0.3);
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<Phase>("train");

  const dropped = (l: number, i: number) => phase === "train" && isDropped(l, i, p, round);

  const hiddenTotal = LAYERS[1] + LAYERS[2];
  let droppedCount = 0;
  for (let l = 1; l <= 2; l++) for (let i = 0; i < LAYERS[l]; i++) if (dropped(l, i)) droppedCount += 1;

  const scale = 1 / (1 - p);

  return (
    <section id="dropout" className="scroll-mt-32">
      <SectionTitle title="드롭아웃" subtitle="학습하는 동안 뉴런을 무작위로 골라 일시적으로 제거한다" />

      <Sourced
        refs={{
          slides: "드롭아웃의 개념과 적용",
          lecture: "매 훈련 단계마다 재선정",
        }}
      >
        <Card>
          <CardTitle>비율을 바꾸고, 다시 뽑아 보기</CardTitle>
          <p className="mb-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
            모델을 학습하는 동안 적절한 확률에 따라 뉴런을 무작위로 선택하여 일시적으로 제거하는 것. 적용 대상 층은
            <b> 은닉층</b>이며 필요에 따라 입력층도 적용 가능함.
          </p>

          <div className="mb-3 flex flex-wrap gap-2">
            <Chip active={phase === "train"} onClick={() => setPhase("train")}>
              훈련 단계
            </Chip>
            <Chip active={phase === "infer"} onClick={() => setPhase("infer")}>
              추론 단계
            </Chip>
            <button
              type="button"
              onClick={() => setRound((r) => r + 1)}
              disabled={phase !== "train"}
              className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100 disabled:opacity-40 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-200"
            >
              다음 훈련 단계 — 다시 뽑기
            </button>
          </div>

          <Slider
            label={<span>드롭아웃 비율 p</span>}
            value={p}
            min={0.1}
            max={0.5}
            step={0.05}
            onChange={setP}
            display={`${Math.round(p * 100)}%`}
          />
          <Hint>드롭아웃 비율은 10~50% 범위에서 지정하는 것이 일반적임.</Hint>

          <Scroller>
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="mt-3 h-auto w-full min-w-[300px]"
              role="img"
              aria-label={
                phase === "train"
                  ? "훈련 단계에서 일부 은닉층 뉴런이 제거된 신경망 그림"
                  : "추론 단계에서 모든 뉴런이 동작하는 신경망 그림"
              }
            >
              {/* 연결선 */}
              {LAYERS.slice(0, -1).map((n, l) =>
                Array.from({ length: n }).map((_, i) =>
                  Array.from({ length: LAYERS[l + 1] }).map((_, j) => {
                    const off = dropped(l, i) || dropped(l + 1, j);
                    return (
                      <line
                        key={`${l}-${i}-${j}`}
                        x1={COL_X[l] + NODE_R}
                        y1={nodeY(l, i)}
                        x2={COL_X[l + 1] - NODE_R}
                        y2={nodeY(l + 1, j)}
                        stroke={off ? "#cbd5e1" : "#94a3b8"}
                        strokeWidth={off ? 0.4 : 0.8}
                        strokeDasharray={off ? "2 2" : undefined}
                        opacity={off ? 0.5 : 0.85}
                      />
                    );
                  }),
                ),
              )}
              {/* 뉴런 */}
              {LAYERS.map((n, l) =>
                Array.from({ length: n }).map((_, i) => {
                  const off = dropped(l, i);
                  return (
                    <circle
                      key={`n${l}-${i}`}
                      cx={COL_X[l]}
                      cy={nodeY(l, i)}
                      r={NODE_R}
                      fill={off ? "transparent" : l === 0 || l === LAYERS.length - 1 ? "#dbeafe" : "#ddd6fe"}
                      stroke={off ? "#cbd5e1" : "#7c3aed"}
                      strokeWidth={off ? 1 : 1.4}
                      strokeDasharray={off ? "3 2" : undefined}
                    />
                  );
                }),
              )}
              <text x={COL_X[0]} y="14" textAnchor="middle" className="fill-gray-400 text-[9px] font-semibold">
                입력층
              </text>
              <text x={COL_X[1]} y="14" textAnchor="middle" className="fill-violet-500 text-[9px] font-semibold">
                은닉층
              </text>
              <text x={COL_X[2]} y="14" textAnchor="middle" className="fill-violet-500 text-[9px] font-semibold">
                은닉층
              </text>
              <text x={COL_X[3]} y="14" textAnchor="middle" className="fill-gray-400 text-[9px] font-semibold">
                출력층
              </text>
            </svg>
          </Scroller>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div
              className={`rounded-lg p-3 ${
                phase === "train"
                  ? "bg-violet-50 dark:bg-violet-950/40"
                  : "bg-gray-50 opacity-60 dark:bg-gray-800/60"
              }`}
            >
              <p className="text-[11px] font-bold text-violet-700 dark:text-violet-300">훈련 단계</p>
              <p className="mt-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                은닉 뉴런 {hiddenTotal}개 중 <b>{phase === "train" ? droppedCount : 0}개</b>가 이번 단계에서 제거됨.
                드롭아웃이 적용된 층으로부터 입력을 받을 때 <b>1/(1−p) = {fmt(scale, 3)}</b>을 곱하여 전체적인 신호
                크기를 유지함.
              </p>
            </div>
            <div
              className={`rounded-lg p-3 ${
                phase === "infer" ? "bg-emerald-50 dark:bg-emerald-950/40" : "bg-gray-50 opacity-60 dark:bg-gray-800/60"
              }`}
            >
              <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">추론 단계</p>
              <p className="mt-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                드롭아웃 없이 <b>모든 뉴런이 동작</b>함. 학습을 마친 뒤 추론할 때는 뉴런을 제거하지 않음.
              </p>
            </div>
          </div>

          <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11.5px] leading-5 text-gray-100">
{`from tensorflow import keras
from tensorflow.keras import Sequential, layers
model = Sequential([keras.Input(shape=(10,)),
                    layers.Dropout(rate=0.2),
                    layers.Dense(32, activation='relu'),
                    layers.Dropout(rate=0.2),
                    layers.Dense(4, activation='softmax')])`}
          </pre>

          <ComputedNote>
            제거되는 뉴런은 고정 시드로 뽑은 이 페이지의 예시임. 층 구성(4-6-6-3)도 그림을 위해 정한 것이며,
            강의록 그림과 뉴런 수가 다름.
          </ComputedNote>
        </Card>
      </Sourced>
    </section>
  );
}
