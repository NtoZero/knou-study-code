"use client";

import { useEffect, useMemo, useState } from "react";
import { Play, Pause } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, Formula, Hint, Scroller, Slider, Tag } from "./ui";
import { FILTERS, INPUT_7, convolve, num, outSize } from "./cnn";

const N = INPUT_7.length;

function Grid({
  m,
  cell = 26,
  highlight,
  selected,
  onCell,
  tone,
  padFrom,
}: {
  m: number[][];
  cell?: number;
  highlight?: { top: number; left: number; size: number };
  selected?: { i: number; j: number };
  onCell?: (i: number, j: number) => void;
  tone: "input" | "map";
  padFrom?: number;
}) {
  const maxAbs = Math.max(1, ...m.flat().map((v) => Math.abs(v)));
  return (
    <div
      className="inline-grid gap-[2px]"
      style={{ gridTemplateColumns: `repeat(${m[0].length}, ${cell}px)` }}
    >
      {m.map((row, i) =>
        row.map((v, j) => {
          const inWin =
            highlight &&
            i >= highlight.top &&
            i < highlight.top + highlight.size &&
            j >= highlight.left &&
            j < highlight.left + highlight.size;
          const isSel = selected && selected.i === i && selected.j === j;
          const isPad =
            padFrom !== undefined &&
            (i < padFrom || j < padFrom || i >= m.length - padFrom || j >= m[0].length - padFrom);
          const intensity = Math.abs(v) / maxAbs;
          const bg =
            tone === "map"
              ? v >= 0
                ? `rgba(101, 163, 13, ${0.12 + 0.6 * intensity})`
                : `rgba(2, 132, 199, ${0.12 + 0.6 * intensity})`
              : isPad
                ? "rgba(255,255,255,0)"
                : `rgba(251, 191, 36, ${0.1 + 0.35 * intensity})`;
          return (
            <button
              key={`${i}-${j}`}
              type="button"
              disabled={!onCell}
              onClick={() => onCell?.(i, j)}
              style={{ width: cell, height: cell, background: bg }}
              className={`flex items-center justify-center rounded-[3px] border text-[10.5px] font-semibold tabular-nums ${
                isSel
                  ? "border-rose-500 ring-2 ring-rose-400"
                  : inWin
                    ? "border-rose-400"
                    : "border-gray-200 dark:border-gray-700"
              } ${isPad ? "text-gray-400" : "text-gray-800 dark:text-gray-100"} ${
                onCell ? "cursor-pointer" : "cursor-default"
              }`}
            >
              {num(v, 1)}
            </button>
          );
        }),
      )}
    </div>
  );
}

export default function ConvolutionLab() {
  const [filterId, setFilterId] = useState("vertical");
  const [padding, setPadding] = useState(0);
  const [stride, setStride] = useState(1);
  const [bias, setBias] = useState(0);
  const [relu, setRelu] = useState(false);
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);

  const filter = FILTERS.find((f) => f.id === filterId)!;
  const res = useMemo(
    () => convolve(INPUT_7, filter.w, { stride, padding, bias, relu }),
    [filter, stride, padding, bias, relu],
  );

  useEffect(() => {
    setPos(0);
  }, [stride, padding]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setPos((p) => (p + 1) % res.cells.length), 450);
    return () => window.clearInterval(id);
  }, [playing, res.cells.length]);

  const cell = res.cells[Math.min(pos, res.cells.length - 1)];
  const size = res.size;

  return (
    <section id="conv-layer" className="scroll-mt-32">
      <SectionTitle
        title="콘볼루션층 — 필터를 옮겨 가며 특징맵 만들기"
        subtitle="교재 [그림 12-11]의 7×7 입력과 3×3 필터로, 모든 값을 직접 계산합니다"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "12.3.1 콘볼루션층", slides: "콘볼루션층 — 콘볼루션 연산" }}>
          <Card>
            <CardTitle>콘볼루션 연산이란</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              콘볼루션층은 주어진 2D 입력에 대해 콘볼루션 연산을 반복적으로 수행하여 특징맵을 생성하는 층입니다.
              콘볼루션 연산은 <strong>해당하는 위치의 요소에 가중치를 곱해서 모두 더하는 간단한 선형 연산</strong>
              입니다. 3×3 크기로 주어진 w를 <strong>커널(kernel), 필터(filter), 마스크(mask) 또는
              윈도(window)</strong>라고 부르며, 필터의 크기는 3×3, 5×5, 7×7과 같이 주어집니다. 여기에 표현된 값이
              곧 <strong>CNN에서의 학습 대상이 되는 가중치</strong>입니다.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Formula note="식 12-6 — 창 안의 값과 필터를 곱해 모두 더한다">
                u₁,₁ = x₀:₂,₀:₂ ∗ w = Σᵢ₌₀² Σⱼ₌₀² xᵢ,ⱼ wᵢ,ⱼ
              </Formula>
              <Formula note="식 12-7 — 바이어스를 더하고 활성화 함수를 거쳐 특징맵에 저장된다">
                y₁,₁ = φ(u₁,₁ + b) = φ(x₀:₂,₀:₂ ∗ w + b)
              </Formula>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.3.1 — 콘볼루션 연산의 적용 예(그림 12-11) · 패딩(그림 12-12) · 보폭(그림 12-14)",
            slides: "콘볼루션층 — 콘볼루션 연산 · 패딩 · 보폭",
          }}
        >
          <Card>
            <CardTitle>직접 옮겨 가며 계산해 보기</CardTitle>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              {FILTERS.map((f) => (
                <Chip key={f.id} active={filterId === f.id} onClick={() => setFilterId(f.id)}>
                  {f.name}
                </Chip>
              ))}
            </div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Chip active={padding === 0} onClick={() => setPadding(0)}>
                패딩 없음
              </Chip>
              <Chip active={padding === 1} onClick={() => setPadding(1)}>
                패딩 1 (0으로 채움)
              </Chip>
              <Chip active={stride === 1} onClick={() => setStride(1)}>
                보폭 1
              </Chip>
              <Chip active={stride === 2} onClick={() => setStride(2)}>
                보폭 2
              </Chip>
              <Chip active={relu} onClick={() => setRelu(!relu)}>
                ReLU 적용
              </Chip>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex items-center gap-1.5 rounded-full border border-lime-600 bg-lime-600 px-3 py-1 text-xs font-semibold text-white"
              >
                {playing ? <Pause size={12} /> : <Play size={12} />}
                {playing ? "멈춤" : "자동으로 훑기"}
              </button>
            </div>

            <Scroller>
              <div className="flex min-w-[560px] items-start gap-4">
                <div>
                  <p className="mb-1.5 text-[11px] font-bold text-gray-500">
                    입력 x {padding > 0 ? `(패딩 포함 ${res.padded.length}×${res.padded.length})` : `${N}×${N}`}
                  </p>
                  <Grid
                    m={res.padded}
                    highlight={{ top: cell.top, left: cell.left, size: filter.w.length }}
                    tone="input"
                    padFrom={padding > 0 ? padding : undefined}
                  />
                </div>

                <div className="pt-6">
                  <p className="mb-1.5 text-center text-[11px] font-bold text-gray-500">필터 w</p>
                  <div
                    className="inline-grid gap-[2px]"
                    style={{ gridTemplateColumns: `repeat(${filter.w.length}, 26px)` }}
                  >
                    {filter.w.flat().map((v, k) => (
                      <div
                        key={k}
                        className="flex h-[26px] w-[26px] items-center justify-center rounded-[3px] border border-lime-500 bg-lime-50 text-[10.5px] font-bold text-lime-800 dark:bg-lime-950/50 dark:text-lime-200"
                      >
                        {v}
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-center text-[16px] text-gray-400">∗ → =</p>
                </div>

                <div>
                  <p className="mb-1.5 text-[11px] font-bold text-gray-500">
                    특징맵 y ({size}×{size})
                  </p>
                  <Grid
                    m={res.map}
                    cell={size > 6 ? 24 : 28}
                    selected={{ i: cell.i, j: cell.j }}
                    onCell={(i, j) => {
                      setPlaying(false);
                      setPos(i * size + j);
                    }}
                    tone="map"
                  />
                  <p className="mt-1 text-[10px] text-gray-400">칸을 누르면 그 값이 어떻게 나왔는지 보여 줍니다</p>
                </div>
              </div>
            </Scroller>

            <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_250px]">
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag tone="lime">
                    특징맵 y[{cell.i}][{cell.j}]
                  </Tag>
                  <span className="text-[11px] text-gray-500">
                    입력의 ({cell.top}, {cell.left}) 자리에서 시작하는 3×3 창
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <div
                    className="inline-grid gap-[2px]"
                    style={{ gridTemplateColumns: `repeat(${filter.w.length}, 54px)` }}
                  >
                    {cell.products.flat().map((p, k) => {
                      const a = cell.window.flat()[k];
                      const b = filter.w.flat()[k];
                      return (
                        <div
                          key={k}
                          className="rounded border border-gray-200 bg-white px-1 py-1 text-center font-mono text-[10px] dark:border-gray-700 dark:bg-gray-900"
                        >
                          <span className="text-gray-500">
                            {a}×{b}
                          </span>
                          <span className="block font-bold text-gray-800 dark:text-gray-100">{p}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="font-mono text-[11.5px] leading-6 text-gray-700 dark:text-gray-200">
                    <div>
                      u = {cell.products.flat().join(" + ").replace(/\+ -/g, "− ")} ={" "}
                      <span className="font-bold text-lime-700 dark:text-lime-400">{cell.sum}</span>
                    </div>
                    <div>
                      u + b = {cell.sum} + {bias} = {cell.sum + bias}
                    </div>
                    <div>
                      y = {relu ? `max(0, ${cell.sum + bias})` : "u + b"} ={" "}
                      <span className="font-bold text-lime-700 dark:text-lime-400">{num(cell.out, 1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Slider label="바이어스 b" value={bias} min={-5} max={5} step={1} onChange={setBias} />
                <div className="rounded-lg border border-lime-200 bg-lime-50/60 p-2.5 dark:border-lime-900 dark:bg-lime-950/30">
                  <p className="text-[11px] font-bold text-lime-800 dark:text-lime-200">출력 특징맵의 크기</p>
                  <p className="mt-1 font-mono text-[11px] leading-5 text-gray-700 dark:text-gray-200">
                    ({N} + 2×{padding} − {filter.w.length}) ÷ {stride} + 1 ={" "}
                    <span className="font-bold">{size}</span>
                  </p>
                  <p className="mt-1 text-[10.5px] leading-4 text-gray-600 dark:text-gray-300">
                    교재의 세 가지 예 — 패딩 없이 5×5, 패딩 1을 주면 7×7, 패딩 1에 보폭 2면 4×4 — 가 모두 이
                    식으로 나옵니다.
                  </p>
                </div>
                <div className="font-mono text-[10.5px] leading-5 text-gray-500">
                  확인: 7,3,1,0 → {outSize(7, 3, 1, 0)} / 7,3,1,1 → {outSize(7, 3, 1, 1)} / 7,3,2,1 →{" "}
                  {outSize(7, 3, 2, 1)}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[12px] font-bold text-gray-800 dark:text-gray-100">패딩 zero padding</p>
                <p className="mt-1 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  입력의 가장자리에서 필터를 적용할 때는 필터가 입력 데이터 영역의 바깥으로 나가게 되어 적용할 수
                  없습니다. 그래서 7×7 입력의 상하좌우 가장자리가 연산에서 제외되어 특징맵은 중앙의 5×5 크기
                  영역에서만 값을 갖습니다. 가장자리에 0값으로 채워진 패딩을 추가하면 가장자리에 대해서도 동일한
                  처리를 할 수 있어 <strong>원래 입력과 동일한 크기의 특징맵</strong>을 생성할 수 있습니다. 필터의
                  크기에 따라 패딩의 크기도 달라집니다.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[12px] font-bold text-gray-800 dark:text-gray-100">보폭 stride</p>
                <p className="mt-1 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  보폭은 <strong>필터가 움직이는 간격</strong>입니다. 보폭이 1이면 한 노드에 연산을 적용한 후 바로
                  이웃한 노드로 이동합니다. 보폭을 2로 지정하면 2개의 노드마다 연산이 적용되므로 패딩 1을 준 7×7
                  입력에서 4×4 출력맵이 생성됩니다. 교재는 보폭이 s라면 출력 특징맵의 크기가 입력 데이터 크기의
                  1/s로 조정된다고 설명합니다.
                </p>
              </div>
            </div>

            <ComputedNote>
              입력 7×7은 교재 [그림 12-11]·강의록 콘볼루션층 슬라이드의 값이고, 필터는 교재 12.3.1의 방향별
              에지 필터와 강의록 ‘왜 콘볼루션인가?’ 슬라이드의 필터입니다. 특징맵의 값은 모두 이 페이지에서 식
              12-6·12-7로 계산했습니다. 교재·강의록에 적힌 값과 대조해 보면 패딩 없는 첫 칸은 3, 패딩 1을 준 첫
              칸은 9로 일치합니다. 교재는 이 첫 칸을 y₁,₁이라고 부르지만 여기서는 격자의 자리를 0부터 세어
              y[0][0]으로 적었습니다 — 같은 칸입니다. 바이어스 b와 ReLU 적용 여부는 직접 바꿔 볼 수 있게 이 페이지에서 더한
              조작이며, 교재 그림에는 바이어스 값이 표시되어 있지 않습니다.
            </ComputedNote>
            <Hint>
              콘볼루션은 실제 뇌의 시각 피질에서 영감을 받은 연산입니다. 강의록은 방향별 에지 필터 외에 주변
              값을 1/16·1/8·1/4로 가중 평균하는 필터와 가운데를 강조하는 필터도 함께 보여 주며, 원래 영상에서
              의미 있는 특징을 추출하려면 기존의 수작업에 의한 설계가 아니라 CNN에서는 학습을 통해 추출한다고
              정리합니다.
            </Hint>
            <Hint>
              같은 입력에 필터만 바꿔 보면, 같은 자리에서 전혀 다른 값이 나옵니다. 콘볼루션 연산에서는 사용하는
              필터에 따라 서로 다른 형태의 특징이 추출되며, <strong>필터의 가중치가 어떤 특징을 추출할지를
              규정</strong>합니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
