"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { C1_COLOR, C2_COLOR, RegressionPlot, sampleXs, splitPoints } from "./plots";
import {
  SINE_SEED,
  buildTree,
  fmt,
  giniFromCounts,
  leaves,
  makeSineData,
  predict,
} from "./treeCore";

/* ─────────── 교재 그림 9-7의 깊이 3 트리 (노드별 클래스 개수) ─────────── */

interface BookNode {
  key: string;
  split?: string;
  counts: [number, number];
}

const BOOK_ROOT: BookNode = { key: "root", split: "x₁ ≤ 0.555", counts: [58, 42] };
const BOOK_MID: BookNode[] = [
  { key: "L", split: "x₂ ≤ 0.182", counts: [47, 9] },
  { key: "R", split: "x₂ ≤ 0.76", counts: [11, 33] },
];
const BOOK_LEAVES: (BookNode & { region: number; box: [number, number, number, number] })[] = [
  { key: "LL", counts: [3, 8], region: 1, box: [0, 0.555, 0, 0.182] },
  { key: "LR", counts: [44, 1], region: 2, box: [0, 0.555, 0.182, 1] },
  { key: "RL", counts: [1, 32], region: 3, box: [0.555, 1, 0, 0.76] },
  { key: "RR", counts: [10, 1], region: 4, box: [0.555, 1, 0.76, 1] },
];

function stats(c: [number, number]) {
  const n = c[0] + c[1];
  const mean = c[1] / n;
  return {
    n,
    gini: giniFromCounts(c),
    cls: c[1] > c[0] ? 1 : 0,
    mean,
    /** 목표값이 0 또는 1이므로 제곱오차(평균) = 평균 × (1 − 평균) */
    sqErr: mean * (1 - mean),
  };
}

function BookNodeBox({ node, mode }: { node: BookNode; mode: "cls" | "reg" }) {
  const s = stats(node.counts);
  return (
    <div
      className={`min-w-[112px] rounded-md border px-2 py-1.5 text-center font-mono text-[10px] leading-tight ${
        mode === "cls"
          ? s.cls === 0
            ? "border-sky-400 bg-sky-50 dark:bg-sky-950/40"
            : "border-orange-400 bg-orange-50 dark:bg-orange-950/40"
          : "border-violet-300 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/40"
      }`}
    >
      {node.split && <p className="font-bold">{node.split}</p>}
      {mode === "cls" ? (
        <>
          <p>gini = {fmt(s.gini, 3)}</p>
          <p>samples = {s.n}</p>
          <p>value = [{node.counts[0]}, {node.counts[1]}]</p>
          <p className="font-bold">class = {s.cls}</p>
        </>
      ) : (
        <>
          <p>squared_error = {fmt(s.sqErr, 3)}</p>
          <p>samples = {s.n}</p>
          <p className="font-bold">value = {fmt(s.mean, 3)}</p>
        </>
      )}
    </div>
  );
}

/* ─────────── 1차원 회귀 데이터 ─────────── */

const SINE = makeSineData(80, SINE_SEED);
const XS = sampleXs();
const DEPTHS = [2, 3, 4, 5, 6, 7, 8];

const MAP = 200;
const mx = (v: number) => 4 + v * (MAP - 8);
const my = (v: number) => MAP - 4 - v * (MAP - 8);

export default function RegressionTree() {
  const [mode, setMode] = useState<"cls" | "reg">("reg");
  const [pickLeaf, setPickLeaf] = useState(0);
  const [depth, setDepth] = useState(2);

  const tree = useMemo(() => buildTree(SINE, "regression", depth), [depth]);
  const ys = useMemo(() => XS.map((x) => predict(tree, [x])), [tree]);
  const lf = leaves(tree);
  const mse = SINE.reduce((s, d) => s + (d.y - predict(tree, d.x)) ** 2, 0) / SINE.length;
  const rootT = tree.threshold;

  const leaf = BOOK_LEAVES[pickLeaf];
  const ls = stats(leaf.counts);

  return (
    <section>
      <SectionTitle
        title="⑹ 회귀를 위한 결정 트리"
        subtitle="트리 구조는 그대로, 리프 노드의 출력값만 해당 노드 데이터의 목표 출력값 평균으로"
      />

      <Sourced
        className="mb-6"
        refs={{
          textbook: "9.1.4 회귀를 위한 결정 트리",
          slides: "회귀를 위한 결정 트리",
          lecture: "분류 트리 노드는 다섯 줄, 회귀 트리 노드는 네 줄이며 지니 불순도 자리에 제곱오차가, 클래스 자리에 목표 출력값의 평균이 들어간다고 한 줄씩 비교함",
        }}
      >
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-gray-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-gray-300">
          ⑸의 2차원 분류 문제를 회귀 문제로 봄: 목표 출력 y가 0 또는 1로 주어졌을 때 2차원 입력 (x₁, x₂)를 y로
          매핑하는 함수 <strong>y = f(x₁, x₂)</strong>를 찾는 문제. 결정 트리의 기본 구조는 달라지지 않고, 최종
          출력값만 클래스 레이블이 아닌 실수값 f(x₁, x₂)로 결정. 리프 노드의 출력값은{" "}
          <strong>해당 노드에 할당된 데이터들이 가지는 목표 출력값 y의 평균값</strong>.
        </div>
      </Sourced>

      <Sourced
        className="mb-6"
        refs={{
          textbook: "9.1.4 그림 9-7 문제 유형에 따른 깊이 3인 결정 트리, 그림 9-8 결정 트리의 출력",
          slides: "문제 유형에 따른 결정 트리의 출력 — 분류 문제의 경우 / 회귀 문제의 경우",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold">같은 분할, 다른 출력 — 깊이 3인 결정 트리</h3>
            <div className="flex gap-1">
              {(
                [
                  ["cls", "분류 문제로 접근"],
                  ["reg", "회귀 문제로 접근"],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setMode(k)}
                  className={`rounded-md border px-3 py-1 text-xs font-semibold ${
                    mode === k
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_240px]">
            <div className="overflow-x-auto">
              <div className="min-w-[500px] space-y-3">
                <div className="flex justify-center">
                  <BookNodeBox node={BOOK_ROOT} mode={mode} />
                </div>
                <div className="flex justify-around">
                  {BOOK_MID.map((n) => (
                    <BookNodeBox key={n.key} node={n} mode={mode} />
                  ))}
                </div>
                <div className="flex justify-between gap-1">
                  {BOOK_LEAVES.map((n, i) => (
                    <button
                      key={n.key}
                      type="button"
                      onClick={() => setPickLeaf(i)}
                      className={`rounded-lg p-0.5 ${pickLeaf === i ? "ring-2 ring-emerald-500" : ""}`}
                    >
                      <BookNodeBox node={n} mode={mode} />
                      <span className="text-[10px] text-gray-500">영역 {n.region}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <svg viewBox={`0 0 ${MAP} ${MAP}`} className="mx-auto w-full max-w-[220px]" role="img" aria-label="리프 영역">
                {BOOK_LEAVES.map((n, i) => {
                  const s = stats(n.counts);
                  const [x0, x1, y0, y1] = n.box;
                  const fill =
                    mode === "cls"
                      ? s.cls === 0
                        ? "#bae6fd"
                        : "#fed7aa"
                      : `rgba(124, 58, 237, ${0.08 + 0.8 * s.mean})`;
                  return (
                    <g key={n.key} onClick={() => setPickLeaf(i)} className="cursor-pointer">
                      <rect
                        x={mx(x0)}
                        y={my(y1)}
                        width={mx(x1) - mx(x0)}
                        height={my(y0) - my(y1)}
                        fill={fill}
                        stroke={pickLeaf === i ? "#059669" : "#475569"}
                        strokeWidth={pickLeaf === i ? 3 : 1}
                      />
                      <text
                        x={(mx(x0) + mx(x1)) / 2}
                        y={(my(y0) + my(y1)) / 2 + 4}
                        textAnchor="middle"
                        fontSize={11}
                        fontWeight={700}
                        fill={mode === "reg" && s.mean > 0.5 ? "#fff" : "#0f172a"}
                      >
                        {mode === "cls" ? `class ${s.cls}` : fmt(s.mean, 3)}
                      </text>
                    </g>
                  );
                })}
                <line x1={mx(0)} y1={my(0)} x2={mx(1)} y2={my(1)} stroke="#dc2626" strokeDasharray="4 3" />
              </svg>
              <p className="mt-1 text-center text-[10px] text-gray-500">
                {mode === "cls" ? "결정영역 (x₁ 가로, x₂ 세로)" : "회귀함수의 출력 — 진할수록 큰 값"}
              </p>
            </div>
          </div>

          <motion.div
            key={`${mode}-${pickLeaf}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 overflow-x-auto rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-800/60"
          >
            <p className="min-w-[420px]">
              <strong>영역 {leaf.region}</strong>: 목표 출력 y = 0인 데이터 {leaf.counts[0]}개, y = 1인 데이터{" "}
              {leaf.counts[1]}개
            </p>
            {mode === "cls" ? (
              <p className="min-w-[420px] font-mono">
                다수의 데이터가 포함된 클래스 → class = {ls.cls}
                <span className="ml-2" style={{ color: ls.cls === 0 ? C1_COLOR : C2_COLOR }}>
                  ({ls.cls === 0 ? "C₁" : "C₂"})
                </span>{" "}
                · gini = 1 − ({leaf.counts[0]}/{ls.n})² − ({leaf.counts[1]}/{ls.n})² = {fmt(ls.gini, 3)}
              </p>
            ) : (
              <p className="min-w-[420px] font-mono">
                출력값 = 목표 출력값의 평균 = {leaf.counts[1]}/{ls.n} = <strong>{fmt(ls.mean, 3)}</strong> · 제곱오차 =
                평균 (y − {fmt(ls.mean, 3)})² = {fmt(ls.sqErr, 3)}
              </p>
            )}
            <p className="mt-1 min-w-[420px] text-gray-500">
              루트 노드와 중간 노드에서 데이터를 분할하는 기준(속성과 속성값)은 두 트리가 동일. 달라지는 것은 리프
              노드가 내는 출력값뿐. 노드의 수치는 모두 [y=0 개수, y=1 개수]에서 다시 계산한 값으로 교재 그림과 일치.
            </p>
          </motion.div>
        </div>
      </Sourced>

      <Sourced
        refs={{
          textbook: "9.1.4 그림 9-9 회귀 문제를 위한 데이터 집합, 그림 9-10 트리 깊이에 따른 회귀함수의 변화",
          slides: "일반적인 회귀 문제의 결정 트리",
          lecture: "깊이가 깊어질수록 영역 수가 기하급수적으로 늘고, 노이즈에 가까운 몇몇 데이터에 민감하게 반응하는 과다적합이 생긴다고 그림으로 짚음",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">일반적인 회귀 문제 — 입력 x 하나, 깊이에 따른 회귀함수</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            노드를 구분하는 속성은 입력 x 하나뿐이므로 x의 값에 따라 영역이 구분되고, 각 영역에서 y값의 평균이 트리의
            출력값이 됨.
          </p>
          <div className="my-3 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">깊이</span>
            {DEPTHS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDepth(d)}
                className={`h-8 w-8 rounded-md border text-sm font-bold ${
                  depth === d
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_240px]">
            <div className="overflow-x-auto">
              <RegressionPlot data={SINE} xs={XS} ys={ys} splits={splitPoints(tree)} />
            </div>
            <div className="space-y-2 text-xs">
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                <p>
                  분할된 영역 수 <strong className="font-mono">{lf.length}</strong> (깊이 {depth} → 최대{" "}
                  {2 ** (depth - 1)})
                </p>
                <p className="mt-1">
                  학습 데이터 제곱오차 평균 <strong className="font-mono">{fmt(mse)}</strong>
                </p>
                {depth === 2 && rootT !== undefined && (
                  <div className="mt-2 space-y-0.5 font-mono">
                    <p>x = {rootT.toFixed(3)}을 기준으로 두 영역</p>
                    <p>영역1 (x ≤ {rootT.toFixed(2)}) y 평균 = {fmt(tree.left!.value, 3)}</p>
                    <p>영역2 (x &gt; {rootT.toFixed(2)}) y 평균 = {fmt(tree.right!.value, 3)}</p>
                  </div>
                )}
              </div>
              <p
                className={`rounded-lg p-3 leading-relaxed ${
                  depth >= 6
                    ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                    : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                }`}
              >
                {depth >= 6
                  ? "과다적합 — 노이즈인 몇몇 점을 따라 회귀함수가 급하게 튀어 오르내림. 학습 오차는 줄지만 일반화 성능은 떨어짐."
                  : "깊이가 깊어질수록 분할되는 영역의 수가 기하급수적으로 늘어 곡선에 가까운 계단 모양이 됨."}
              </p>
              <p className="leading-relaxed text-gray-500">
                교재 그림 9-10의 데이터에서는 깊이 2일 때 x = 3.13을 기준으로 나뉨. 여기서는 같은 형태로 만든 데이터
                80개로 직접 학습한 결과.
              </p>
            </div>
          </div>
        </div>
      </Sourced>
    </section>
  );
}
