"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointerClick } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Scroller } from "@/components/dlShared/ui";
import { Chip3, F, Pill, r2 } from "@/components/dl3/ui3";

/**
 * 텐서의 랭크와 모양(shape)을 클릭으로 바꿔 보는 블록.
 * 값은 모두 강의록 '1. 텐서의 개념' 슬라이드에 적힌 것을 그대로 쓴다.
 */

const RANKS = [
  { rank: 0, name: "스칼라", shape: "[]" },
  { rank: 1, name: "벡터", shape: "[3]" },
  { rank: 2, name: "행렬", shape: "[2, 3]" },
  { rank: 3, name: "다차원 배열", shape: "[4, 2, 3]" },
];

const R0 = 5;
const R1 = [5, -2, 3];
const R2 = [
  [1, 2, 3],
  [4, 5, 6],
];
const R3 = [
  [
    [1, 2, 3],
    [4, 5, 6],
  ],
  [
    [7, 8, 9],
    [10, 11, 12],
  ],
  [
    [13, 14, 15],
    [16, 17, 18],
  ],
  [
    [19, 20, 21],
    [22, 23, 24],
  ],
];

const CELL = 32;

function Cell({
  x,
  y,
  v,
  shaded,
  on,
  onClick,
}: {
  x: number;
  y: number;
  v: number;
  shaded?: boolean;
  on?: boolean;
  onClick?: () => void;
}) {
  return (
    <g onClick={onClick} className={onClick ? "cursor-pointer" : undefined}>
      <rect
        x={r2(x)}
        y={r2(y)}
        width={CELL}
        height={CELL}
        className={
          on
            ? "fill-amber-400 stroke-amber-600"
            : shaded
              ? "fill-emerald-100 stroke-gray-400 dark:fill-emerald-950/70"
              : "fill-white stroke-gray-400 dark:fill-gray-900"
        }
        strokeWidth={1.2}
      />
      <text
        x={r2(x + CELL / 2)}
        y={r2(y + CELL / 2 + 4)}
        textAnchor="middle"
        className={`text-[11px] font-mono ${
          on ? "fill-white font-bold" : "fill-gray-700 dark:fill-gray-200"
        }`}
      >
        {v}
      </text>
    </g>
  );
}

export default function TensorRankShape() {
  const [rank, setRank] = useState(2);
  const [slice, setSlice] = useState(0);
  const [picked, setPicked] = useState<number[] | null>(null);

  const choose = (idx: number[]) => setPicked(idx);
  const selectRank = (r: number) => {
    setRank(r);
    setPicked(null);
    setSlice(0);
  };

  const indexText =
    picked === null
      ? null
      : `t${picked.map((i) => `[${i}]`).join("")} = ${
          rank === 1
            ? R1[picked[0]]
            : rank === 2
              ? R2[picked[0]][picked[1]]
              : R3[picked[0]][picked[1]][picked[2]]
        }`;

  return (
    <section id="tensor-rank-shape" className="scroll-mt-32">
      <SectionTitle
        title="텐서 — 축이 몇 개인가로 갈린다"
        subtitle="랭크를 바꿔 가며, 모양(shape)이 왜 그렇게 적히는지 확인해 보세요"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "1. 텐서의 개념 — 텐서(tensor), rank-0~rank-3 텐서와 shape",
            lecture: "shape의 길이가 곧 랭크이고, 길이가 0이면 스칼라 텐서라고 설명",
          }}
        >
          <Card>
            <CardTitle>텐서(tensor)</CardTitle>
            <p className="mb-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              <strong>동일 자료형의 데이터를 저장하는 다차원 배열</strong>이며, Numpy의 배열과
              유사한 형태로 데이터를 저장하는 객체.
            </p>

            <div className="mb-3 flex flex-wrap gap-1.5">
              {RANKS.map((r) => (
                <Chip3 key={r.rank} active={rank === r.rank} onClick={() => selectRank(r.rank)}>
                  rank-{r.rank} · {r.name}
                </Chip3>
              ))}
            </div>

            {rank === 3 && (
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-gray-500">0번 축의 위치</span>
                {[0, 1, 2, 3].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSlice(s);
                      setPicked(null);
                    }}
                    aria-pressed={slice === s}
                    className={`h-6 w-6 rounded border text-[11px] font-mono ${
                      slice === s
                        ? "border-amber-500 bg-amber-500 text-white"
                        : "border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <Scroller>
              <AnimatePresence mode="wait">
                <motion.div
                  key={rank}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="min-w-[320px]"
                >
                  <svg viewBox="0 0 340 130" className="h-auto w-full" role="img" aria-label="텐서 그림">
                    {rank === 0 && <Cell x={150} y={48} v={R0} />}

                    {rank === 1 &&
                      R1.map((v, i) => (
                        <Cell
                          key={i}
                          x={122 + i * CELL}
                          y={48}
                          v={v}
                          on={picked?.[0] === i}
                          onClick={() => choose([i])}
                        />
                      ))}

                    {rank === 2 &&
                      R2.map((row, ri) =>
                        row.map((v, ci) => (
                          <Cell
                            key={`${ri}-${ci}`}
                            x={122 + ci * CELL}
                            y={32 + ri * CELL}
                            v={v}
                            shaded={ri === 1}
                            on={picked?.[0] === ri && picked?.[1] === ci}
                            onClick={() => choose([ri, ci])}
                          />
                        )),
                      )}

                    {rank === 3 &&
                      R3.map((mat, mi) => {
                        const ox = 76 + mi * 22;
                        const oy = 46 - mi * 11;
                        const front = mi === slice;
                        return (
                          <g key={mi} opacity={front ? 1 : 0.4}>
                            {mat.map((row, ri) =>
                              row.map((v, ci) => (
                                <Cell
                                  key={`${mi}-${ri}-${ci}`}
                                  x={ox + ci * CELL}
                                  y={oy + ri * CELL}
                                  v={v}
                                  shaded={ri === 1}
                                  on={
                                    front &&
                                    picked?.[0] === mi &&
                                    picked?.[1] === ri &&
                                    picked?.[2] === ci
                                  }
                                  onClick={
                                    front
                                      ? () => choose([mi, ri, ci])
                                      : () => {
                                          setSlice(mi);
                                          setPicked(null);
                                        }
                                  }
                                />
                              )),
                            )}
                          </g>
                        );
                      })}
                  </svg>
                </motion.div>
              </AnimatePresence>
            </Scroller>

            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <F note={`shape의 길이 = ${rank} = 랭크`}>
                shape: {RANKS[rank].shape}
              </F>
              <div className="flex min-w-0 items-center justify-center rounded-lg border border-dashed border-gray-300 px-3 py-2 text-center dark:border-gray-700">
                {indexText ? (
                  <span className="font-mono text-[13px] font-semibold text-amber-700 dark:text-amber-300">
                    {indexText}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11.5px] text-gray-400">
                    <MousePointerClick size={12} />
                    {rank === 0
                      ? "값이 하나뿐이라 색인이 필요 없습니다"
                      : "칸을 눌러 보세요 — 값 하나를 고르는 데 필요한 색인의 개수가 곧 랭크입니다"}
                  </span>
                )}
              </div>
            </div>
            <Hint>
              랭크가 올라가는 규칙은 단순합니다. 벡터를 모으면 행렬, 행렬을 모으면 rank-3, rank-3을
              모으면 rank-4가 됩니다. shape의 맨 앞 숫자가 &lsquo;몇 개를 모았는가&rsquo;입니다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced refs={{ slides: "2. 텐서플로와 텐서 — 텐서플로에서 텐서의 활용" }}>
          <Card>
            <CardTitle>텐서플로에서 텐서가 쓰이는 곳</CardTitle>
            <ul className="space-y-1.5 text-[12.5px] leading-5 text-gray-700 dark:text-gray-200">
              <li className="flex flex-wrap items-center gap-2">
                <Pill tone="amber">입력 데이터 정의</Pill>
              </li>
              <li className="flex flex-wrap items-center gap-2">
                <Pill tone="amber">모델 파라미터 정의</Pill>
                <span className="min-w-0 break-words text-gray-500">가중치, 바이어스 등</span>
              </li>
              <li className="flex flex-wrap items-center gap-2">
                <Pill tone="amber">계산 수행</Pill>
                <span className="min-w-0 break-words text-gray-500">
                  행렬 곱셈, 합성곱 및 활성함수와 같은 수학적 연산에 활용
                </span>
              </li>
              <li className="flex flex-wrap items-center gap-2">
                <Pill tone="amber">중간 결과 저장</Pill>
                <span className="min-w-0 break-words text-gray-500">모델 계산 중에 중간 결과를 저장하는 데 사용</span>
              </li>
              <li className="flex flex-wrap items-center gap-2">
                <Pill tone="amber">손실함수 정의</Pill>
              </li>
            </ul>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
