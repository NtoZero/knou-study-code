"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { C1_COLOR, C2_COLOR, RegionPlot } from "./plots";
import {
  DIAG_SEED,
  accuracy,
  buildTree,
  fmt,
  leaves,
  makeDiagonalData,
  treeDepth,
  type Sample,
  type TreeNode,
} from "./treeCore";

/** 그림 9-4 형태의 2차원 데이터 100개 — 실제 결정경계 x₁ = x₂ */
const DATA: Sample[] = makeDiagonalData(100, DIAG_SEED);
const FULL = buildTree(DATA, "classification", Infinity);
const MAX_DEPTH = treeDepth(FULL);

/* ─────────── 트리 다이어그램 ─────────── */

const NW = 104;
const NH = 70;
const GAPX = 8;
const LVL = 96;

interface PNode {
  node: TreeNode;
  x: number;
  y: number;
  parent?: PNode;
}

function layout(root: TreeNode): PNode[] {
  let leafIdx = 0;
  const out: PNode[] = [];
  const walk = (n: TreeNode, parent?: PNode): PNode => {
    const me: PNode = { node: n, x: 0, y: 8 + (n.depth - 1) * LVL, parent };
    out.push(me);
    if (n.left && n.right) {
      const a = walk(n.left, me);
      const b = walk(n.right, me);
      me.x = (a.x + b.x) / 2;
    } else {
      me.x = leafIdx * (NW + GAPX) + NW / 2;
      leafIdx += 1;
    }
    return me;
  };
  walk(root);
  return out;
}

export default function ClassificationTree2D() {
  const [depth, setDepth] = useState(4);
  const [sel, setSel] = useState<number | null>(null);

  const tree = useMemo(() => buildTree(DATA, "classification", depth), [depth]);
  const nodes = useMemo(() => layout(tree), [tree]);
  const lf = leaves(tree);
  const impureLeaves = lf.filter((n) => n.impurity > 1e-12);
  const acc = accuracy(tree, DATA);
  const w = Math.max(...nodes.map((p) => p.x)) + NW / 2 + 4;
  const h = Math.max(...nodes.map((p) => p.y)) + NH + 6;
  const class0 = DATA.filter((d) => d.y === 0).length;

  return (
    <section>
      <SectionTitle
        title="⑸ 결정 트리를 이용한 2차원 데이터 분류"
        subtitle="속성 x₁, x₂가 연속한 실수값 — 노드는 속성과 속성의 특정 실숫값을 기준으로 분할"
      />

      <Sourced
        className="mb-6"
        refs={{
          textbook: "9.1.3 결정 트리를 이용한 2차원 데이터 분류",
          slides: "결정 트리를 이용한 분류 — 예: 2차원 데이터",
        }}
      >
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-gray-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-gray-300">
          x₁, x₂ ∈ (0, 1)인 두 클래스 데이터 {DATA.length}개(C₁ {class0}개, C₂ {DATA.length - class0}개). 실제
          결정경계는 <strong className="text-red-600">x₁ = x₂</strong>(빨간 점선). 세탁기 예와 달리 속성 x₁, x₂가
          가지는 값이 연속한 실수값이므로, 각 노드는 &ldquo;x₁ ≤ 0.550&rdquo;처럼 <strong>속성과 속성값</strong>을
          기준으로 데이터를 둘로 나눔. 적절한 속성과 속성값 역시 지니 평가지수로 선택.
        </div>
      </Sourced>

      <Sourced
        refs={{
          textbook: "9.1.3 그림 9-5 2차원 데이터에 대한 결정 트리, 그림 9-6 결정경계",
          slides: "결정 트리를 이용한 분류 — 결정 트리(깊이 4), 결정경계",
          lecture: "깊이 4 트리의 여덟 리프 중 지니 불순도가 0이 아닌 두 리프는 레이블이 섞여 있어 추가 분할이 필요하다고 짚음",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold">트리의 깊이</span>
            <div className="flex gap-1">
              {Array.from({ length: MAX_DEPTH }, (_, i) => i + 1).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDepth(d);
                    setSel(null);
                  }}
                  className={`h-8 w-8 rounded-md border text-sm font-bold ${
                    depth === d
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-gray-200 text-gray-600 hover:border-emerald-300 dark:border-gray-700 dark:text-gray-300"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              리프 {lf.length}개 · 학습 데이터 분류율 {(acc * 100).toFixed(0)}%
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
            <div>
              <div className="flex justify-center">
                <RegionPlot tree={tree} data={DATA} highlight={sel} />
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-3 text-[11px] text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: C1_COLOR }} /> C₁ (class 0)
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: C2_COLOR }} /> C₂ (class 1)
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-0.5 w-4 bg-red-600" /> 실제 결정경계
                </span>
              </div>
              <div
                className={`mt-3 rounded-lg p-3 text-xs leading-relaxed ${
                  impureLeaves.length === 0
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                    : "bg-fuchsia-50 text-fuchsia-800 dark:bg-fuchsia-950/30 dark:text-fuchsia-200"
                }`}
              >
                {impureLeaves.length === 0 ? (
                  <>
                    <strong>모든 리프 노드의 지니 불순도 = 0</strong> → 모든 학습 데이터의 처리가 완전히 끝난 상태. 이
                    데이터에서 결정 트리가 가질 수 있는 최대 깊이는 {MAX_DEPTH}. 그래도 경계는 여전히 계단 형태이며 실제
                    결정경계와 차이가 있음.
                  </>
                ) : (
                  <>
                    지니 불순도가 0이 아닌 리프 {impureLeaves.length}개(분홍 점선) → 학습 데이터가 완벽하게 분류되지
                    못한 상태, <strong>추가 분할 필요</strong>.
                  </>
                )}
              </div>
            </div>

            <div className="min-w-0">
              <p className="mb-2 text-xs text-gray-500">
                각 노드: 속성과 속성값 · 지니 불순도 · 해당 노드에 할당된 데이터 개수 · 각 클래스의 개수 [C₁, C₂] ·
                해당 노드의 클래스 레이블(다수의 데이터가 포함된 클래스). 노드를 누르면 그 노드가 담당하는 영역이
                표시됨.
              </p>
              <div className="overflow-x-auto rounded-lg bg-gray-50 p-2 dark:bg-gray-800/40">
                <svg viewBox={`0 0 ${w} ${h}`} style={{ width: w, minWidth: w }} role="img" aria-label="결정 트리">
                  {nodes.map((p) =>
                    p.parent ? (
                      <line
                        key={`e${p.node.id}`}
                        x1={p.parent.x}
                        y1={p.parent.y + NH}
                        x2={p.x}
                        y2={p.y}
                        stroke="#94a3b8"
                        strokeWidth={1.2}
                      />
                    ) : null,
                  )}
                  {nodes.map((p) => {
                    const n = p.node;
                    const isLeaf = !n.left;
                    const impure = isLeaf && n.impurity > 1e-12;
                    const on = sel === n.id;
                    const fill = n.value === 0 ? "#e0f2fe" : "#ffedd5";
                    return (
                      <g
                        key={n.id}
                        onClick={() => setSel(on ? null : n.id)}
                        className="cursor-pointer"
                      >
                        <motion.rect
                          x={p.x - NW / 2}
                          y={p.y}
                          width={NW}
                          height={NH}
                          rx={5}
                          fill={fill}
                          stroke={on ? "#059669" : impure ? "#c026d3" : n.value === 0 ? C1_COLOR : C2_COLOR}
                          strokeWidth={on ? 2.5 : impure ? 2 : 1}
                          strokeDasharray={impure ? "4 2" : undefined}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                        <text x={p.x} y={p.y + 13} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#0f172a">
                          {isLeaf ? "리프" : `x${n.feature === 0 ? "₁" : "₂"} ≤ ${n.threshold!.toFixed(3)}`}
                        </text>
                        <text x={p.x} y={p.y + 26} textAnchor="middle" fontSize={9} fill="#334155">
                          gini = {fmt(n.impurity, 3)}
                        </text>
                        <text x={p.x} y={p.y + 38} textAnchor="middle" fontSize={9} fill="#334155">
                          samples = {n.n}
                        </text>
                        <text x={p.x} y={p.y + 50} textAnchor="middle" fontSize={9} fill="#334155">
                          value = [{n.counts[0]}, {n.counts[1]}]
                        </text>
                        <text
                          x={p.x}
                          y={p.y + 62}
                          textAnchor="middle"
                          fontSize={9}
                          fontWeight={700}
                          fill={n.value === 0 ? C1_COLOR : C2_COLOR}
                        >
                          class = {n.value}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Sourced>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Sourced
          className="flex flex-col"
          refs={{
            textbook: "9.1.3 결정 트리를 이용한 2차원 데이터 분류 (그림 9-6)",
            slides: "결정 트리를 이용한 분류 — 결정경계",
          }}
        >
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 text-xs leading-relaxed text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
            <p className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">계단 형태의 불연속 결정경계</p>
            결정 트리의 결정경계는 베이즈나 K-최근접이웃 분류기와 달리 <strong>계단 형태의 불연속 함수</strong>로
            주어짐. 트리의 깊이가 깊지 않을수록 불연속성이 뚜렷하고 다양한 형태의 결정경계를 표현하기 어려움. 대각선
            형태의 실제 경계와 상당한 차이.
          </div>
        </Sourced>
        <Sourced
          className="flex flex-col"
          refs={{
            textbook: "9.1.3 결정 트리를 이용한 2차원 데이터 분류 (그림 9-6)",
            slides: "결정 트리를 이용한 분류 — 깊이 4인 경우 / 깊이 5인 경우",
            lecture: "트리의 깊이를 계속 늘리는 것은 궁극적인 해결책이 되지 못하고, 적절한 깊이를 정해 두고 거기까지만 확장한다고 정리함",
          }}
        >
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 text-xs leading-relaxed text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
            <p className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">깊이를 늘리면 해결될까?</p>
            깊이를 늘리면 경계가 조금 더 복잡해지지만 여전히 참인 결정경계와 차이가 있음. 모든 학습 데이터를 완벽하게
            분류할 때까지 깊이를 늘리는 방법으로는 일반화 성능이 좋은 결정경계를 찾을 수 없고, 오히려 데이터의
            노이즈에 민감하게 반응해 일반화 성능을 저하시킬 수 있음 →{" "}
            <strong>적절한 깊이를 사전에 정해 두고 해당 깊이까지만 확장</strong>하는 방법이 권장됨. 데이터가
            불충분하면 앙상블 학습(랜덤 포레스트)으로 극복.
          </div>
        </Sourced>
      </div>
    </section>
  );
}
