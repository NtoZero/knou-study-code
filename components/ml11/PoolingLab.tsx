"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Hint, Scroller, Tag } from "./ui";
import { num, pool, type Matrix, type PoolMode } from "./cnn";

/** 교재 [그림 12-16] · 강의록 풀링 연산 슬라이드의 4×4 특징맵 */
const FMAP4: Matrix = [
  [10, 17, 20, 0],
  [8, 13, 2, 6],
  [31, 11, 0, 8],
  [4, 10, 3, 5],
];

/** 교재 [그림 12-17] · 강의록 풀링 파라미터 슬라이드의 6×6 특징맵 */
const FMAP6: Matrix = [
  [9, 10, 3, 6, 9, 4],
  [6, 7, 3, 5, 1, 5],
  [1, 3, 4, 3, 2, 4],
  [6, 5, 6, 4, 7, 9],
  [5, 7, 8, 7, 3, 0],
  [4, 9, 6, 2, 7, 5],
];

function shiftRight(m: Matrix, d: number): Matrix {
  if (d === 0) return m;
  return m.map((row) => [...new Array(d).fill(0), ...row.slice(0, row.length - d)]);
}

function Grid({
  m,
  cell = 26,
  tone,
  highlight,
  compare,
  onCell,
  selected,
}: {
  m: Matrix;
  cell?: number;
  tone: "in" | "out";
  highlight?: { top: number; left: number; size: number };
  compare?: Matrix;
  onCell?: (i: number, j: number) => void;
  selected?: { i: number; j: number };
}) {
  const maxAbs = Math.max(1, ...m.flat().map((v) => Math.abs(v)));
  return (
    <div className="inline-grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${m[0].length}, ${cell}px)` }}>
      {m.map((row, i) =>
        row.map((v, j) => {
          const inWin =
            highlight &&
            i >= highlight.top &&
            i < highlight.top + highlight.size &&
            j >= highlight.left &&
            j < highlight.left + highlight.size;
          const differs = compare && compare[i][j] !== v;
          const isSel = selected && selected.i === i && selected.j === j;
          return (
            <button
              key={`${i}-${j}`}
              type="button"
              disabled={!onCell}
              onClick={() => onCell?.(i, j)}
              style={{
                width: cell,
                height: cell,
                background:
                  tone === "in"
                    ? `rgba(251, 191, 36, ${0.1 + 0.35 * (Math.abs(v) / maxAbs)})`
                    : `rgba(101, 163, 13, ${0.12 + 0.6 * (Math.abs(v) / maxAbs)})`,
              }}
              className={`flex items-center justify-center rounded-[3px] border text-[10.5px] font-semibold tabular-nums text-gray-800 dark:text-gray-100 ${
                isSel
                  ? "border-rose-500 ring-2 ring-rose-400"
                  : differs
                    ? "border-rose-500 border-dashed"
                    : inWin
                      ? "border-rose-400"
                      : "border-gray-200 dark:border-gray-700"
              } ${onCell ? "cursor-pointer" : "cursor-default"}`}
            >
              {num(v, 1)}
            </button>
          );
        }),
      )}
    </div>
  );
}

export default function PoolingLab() {
  const [mode, setMode] = useState<PoolMode>("max");
  const [sel, setSel] = useState({ i: 0, j: 0 });
  const [shift, setShift] = useState(0);
  const [pf, setPf] = useState(2);

  const res4 = useMemo(() => pool(FMAP4, 2, 2, mode), [mode]);
  const cell = res4.cells.find((c) => c.i === sel.i && c.j === sel.j) ?? res4.cells[0];

  const base = useMemo(() => pool(FMAP6, pf, pf, "max"), [pf]);
  const moved = useMemo(() => pool(shiftRight(FMAP6, shift), pf, pf, "max"), [shift, pf]);
  const same = useMemo(() => {
    let n = 0;
    for (let i = 0; i < base.size; i += 1)
      for (let j = 0; j < base.size; j += 1) if (base.map[i][j] === moved.map[i][j]) n += 1;
    return n;
  }, [base, moved]);

  return (
    <section id="pooling-layer" className="scroll-mt-32">
      <SectionTitle
        title="풀링층(서브샘플링층)"
        subtitle="교재 그림의 특징맵으로 최대 풀링과 평균 풀링을 직접 계산하고, 이동에 강한 이유를 셉니다"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "12.3.2 풀링층", slides: "풀링층(서브샘플링층) — 풀링 연산" }}>
          <Card>
            <CardTitle>풀링이 하는 일</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              CNN에서는 보통 콘볼루션층을 수행한 다음에 풀링층을 거칩니다. 풀링은 <strong>서브샘플링</strong>
              이라고도 하며, 기본적으로 풀링 연산은 <strong>특징맵의 크기를 작게 만듦으로써 계산 속도를 높일 뿐
              아니라 정보의 추상화를 진행</strong>합니다. 풀링 방법에는 가장 많이 사용되는{" "}
              <strong>최대 풀링(max pooling)</strong>을 비롯하여 <strong>평균 풀링(average pooling)</strong>, 가중치
              평균 풀링 등이 있습니다.
            </p>

            <div className="mb-3 mt-4 flex flex-wrap gap-2">
              {(["max", "avg"] as PoolMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  aria-pressed={mode === m}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    mode === m
                      ? "border-lime-600 bg-lime-600 text-white"
                      : "border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  }`}
                >
                  {m === "max" ? "최대 풀링" : "평균 풀링"}
                </button>
              ))}
            </div>

            <Scroller>
              <div className="flex min-w-[460px] items-start gap-5">
                <div>
                  <p className="mb-1.5 text-[11px] font-bold text-gray-500">특징맵 4×4</p>
                  <Grid m={FMAP4} tone="in" highlight={{ top: cell.i * 2, left: cell.j * 2, size: 2 }} />
                </div>
                <div className="pt-8 text-center">
                  <p className="font-mono text-[10.5px] text-gray-500">f = 2, s = 2</p>
                  <p className="text-[16px] text-gray-400">→</p>
                </div>
                <div>
                  <p className="mb-1.5 text-[11px] font-bold text-lime-700 dark:text-lime-400">
                    {mode === "max" ? "최대 풀링" : "평균 풀링"} 결과 2×2
                  </p>
                  <Grid
                    m={res4.map}
                    cell={32}
                    tone="out"
                    selected={sel}
                    onCell={(i, j) => setSel({ i, j })}
                  />
                </div>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <Tag tone="lime">
                    y[{cell.i}][{cell.j}]
                  </Tag>
                  <p className="mt-1.5 font-mono text-[11px] leading-6 text-gray-700 dark:text-gray-200">
                    창 안의 값 = {"{"}
                    {cell.values.join(", ")}
                    {"}"}
                    <br />
                    {mode === "max" ? (
                      <>
                        가장 큰 값 ={" "}
                        <span className="font-bold text-lime-700 dark:text-lime-400">{num(cell.out, 1)}</span>
                      </>
                    ) : (
                      <>
                        ({cell.values.join(" + ")}) ÷ {cell.values.length} ={" "}
                        <span className="font-bold text-lime-700 dark:text-lime-400">{num(cell.out, 1)}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </Scroller>

            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              최대 풀링은 필터에 속한 노드 중에서 <strong>가장 큰 값만 출력</strong>하는 연산이고, 평균 풀링은{" "}
              <strong>값들의 평균값</strong>을 구하는 연산입니다. 같은 4×4 특징맵에서 최대 풀링은 17·20·31·8,
              평균 풀링은 12·7·14·4가 나옵니다.
            </p>
            <ComputedNote>
              4×4 특징맵의 값은 교재 [그림 12-16]·강의록 풀링 연산 슬라이드의 값이고, 풀링 결과는 이 페이지에서
              계산해 교재 그림과 대조한 것입니다. 네 칸 모두 일치합니다.
            </ComputedNote>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.3.2 — 풀링 연산과 관련된 파라미터(그림 12-17)",
            slides: "풀링층 — 사용자 정의 파라미터 · 왜 풀링인가?",
          }}
        >
          <Card>
            <CardTitle>작은 위치 이동을 받아내는 성질</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              풀링 연산은 단순히 필터 내의 값들에 대해 최대값 또는 평균값을 구하는 연산이기 때문에{" "}
              <strong>학습을 통해 결정될 파라미터가 없습니다</strong> — 풀링층에서는 학습이 수행되지 않습니다.
              또한 풀링 연산은 <strong>데이터의 작은 이동에 대해서는 결과값이 변화되지 않는(transition-invariant)
              특징</strong>이 있으며, 이러한 성질은 물체인식이나 영상처리 등의 응용에서 매우 유용합니다. 필터의
              크기가 커질수록 그 효과는 더 커집니다.
            </p>

            <div className="mb-3 mt-4 flex flex-wrap gap-2">
              {[0, 1, 2].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setShift(d)}
                  aria-pressed={shift === d}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    shift === d
                      ? "border-lime-600 bg-lime-600 text-white"
                      : "border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  }`}
                >
                  {d === 0 ? "원래 위치" : `오른쪽으로 ${d}칸 이동`}
                </button>
              ))}
              {[2, 3].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setPf(v)}
                  aria-pressed={pf === v}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    pf === v
                      ? "border-gray-700 bg-gray-700 text-white"
                      : "border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  }`}
                >
                  f = s = {v}
                </button>
              ))}
            </div>

            <Scroller>
              <div className="flex min-w-[520px] items-start gap-5">
                <div>
                  <p className="mb-1.5 text-[11px] font-bold text-gray-500">특징맵 6×6 (이동 {shift}칸)</p>
                  <Grid m={shiftRight(FMAP6, shift)} cell={24} tone="in" />
                </div>
                <div className="pt-8 text-center">
                  <p className="font-mono text-[10.5px] text-gray-500">
                    f = {pf}, s = {pf}
                    <br />
                    최대 풀링
                  </p>
                  <p className="text-[16px] text-gray-400">→</p>
                </div>
                <div>
                  <p className="mb-1.5 text-[11px] font-bold text-lime-700 dark:text-lime-400">
                    풀링 결과 {moved.size}×{moved.size}
                  </p>
                  <Grid m={moved.map} cell={30} tone="out" compare={base.map} />
                  <p className="mt-1.5 text-[10.5px] text-gray-500">
                    점선 테두리 = 원래 위치일 때와 값이 달라진 칸
                  </p>
                </div>
              </div>
            </Scroller>

            <div className="mt-3 rounded-lg bg-gray-50 p-3 font-mono text-[11px] leading-6 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <div>
                입력은 36칸 중 {shift === 0 ? 0 : 6 * shift}칸이 밀려났지만, 풀링 결과는{" "}
                {moved.size * moved.size}칸 중{" "}
                <span className="font-bold text-lime-700 dark:text-lime-400">{same}칸</span>이 그대로입니다 (
                {((100 * same) / (moved.size * moved.size)).toFixed(0)}%).
              </div>
            </div>

            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              같은 1칸 이동이라도 f = s = 2일 때와 f = s = 3일 때 살아남는 칸의 비율이 다릅니다. 필터가 넓을수록 한
              칸 움직인 정도는 같은 창 안에서 흡수되기 때문입니다. 한편 풀링 연산은 <strong>각 특징맵마다 독립적으로
              수행</strong>되기 때문에, 연산 전후의 <strong>특징맵의 수는 변하지 않고 그대로 유지</strong>됩니다.
              교재 [그림 12-17]의 6×6×3 입력은 f = 2, s = 2의 최대 풀링을 거쳐 3×3×3이 됩니다 — 크기만 줄고 장수는
              그대로입니다.
            </p>
            <Hint>
              이동한 자리에는 0을 채워 넣었습니다. 6×6 특징맵의 값은 교재 [그림 12-17]의 값이며, 원래 위치에서
              f = s = 2로 풀링한 결과 10·6·9 / 6·6·9 / 9·8·7은 교재 그림과 일치합니다. 강의록의 같은 슬라이드는
              첫 행 둘째 칸이 2로 되어 있어 결과의 첫 칸이 9로 적혀 있습니다 — 두 자료의 값이 다른 곳입니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
