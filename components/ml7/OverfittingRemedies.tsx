"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Scissors, StopCircle, Trees, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { RegionPlot } from "./plots";
import {
  NOISY_FLIP,
  NOISY_SEED,
  VALID_SEED,
  accuracy,
  allNodes,
  buildTree,
  leaves,
  makeDiagonalData,
  pruneAt,
  treeDepth,
  type TreeNode,
} from "./treeCore";

/** 레이블 노이즈가 섞인 학습 데이터와, 같은 분포에서 따로 뽑은 검증 데이터 */
const TRAIN = makeDiagonalData(300, NOISY_SEED, NOISY_FLIP);
const VALID = makeDiagonalData(300, VALID_SEED, NOISY_FLIP);
const FULL = buildTree(TRAIN, "classification", Infinity);
const MAX_D = treeDepth(FULL);

const CURVE = Array.from({ length: MAX_D }, (_, i) => {
  const t = buildTree(TRAIN, "classification", i + 1);
  return { d: i + 1, train: accuracy(t, TRAIN), valid: accuracy(t, VALID), leaves: leaves(t).length };
});

/** 검증 데이터 분류율이 더 이상 오르지 않는 첫 깊이 */
const STOP_D = (() => {
  for (let i = 0; i < CURVE.length - 1; i += 1) {
    if (CURVE[i + 1].valid <= CURVE[i].valid) return CURVE[i].d;
  }
  return MAX_D;
})();

/**
 * 가지치기 한 단계: 두 자식이 모두 리프인 내부 노드 가운데, 리프로 되돌려도
 * 검증 데이터 분류율이 떨어지지 않는(= 불필요한) 노드를 골라 제거.
 */
function pruneOnce(tree: TreeNode): { tree: TreeNode; removed: TreeNode } | null {
  const base = accuracy(tree, VALID);
  let best: { tree: TreeNode; removed: TreeNode; acc: number } | null = null;
  for (const n of allNodes(tree)) {
    if (!n.left || !n.right || n.left.left || n.right.left) continue;
    const t = pruneAt(tree, new Set([n.id]));
    const a = accuracy(t, VALID);
    if (a >= base && (!best || a > best.acc)) best = { tree: t, removed: n, acc: a };
  }
  return best;
}

const PRUNE_SEQ: TreeNode[] = (() => {
  const seq = [FULL];
  let cur = FULL;
  for (;;) {
    const r = pruneOnce(cur);
    if (!r) break;
    seq.push(r.tree);
    cur = r.tree;
  }
  return seq;
})();

const CW = 300;
const CH = 170;
const cx = (d: number) => 36 + ((d - 1) / (MAX_D - 1)) * (CW - 50);
const cy = (a: number) => 12 + ((1 - a) / 0.5) * (CH - 40);

export default function OverfittingRemedies() {
  const [tab, setTab] = useState<"stop" | "prune">("stop");
  const [depth, setDepth] = useState(MAX_D);
  const [pruneStep, setPruneStep] = useState(0);

  const stopTree = useMemo(() => buildTree(TRAIN, "classification", depth), [depth]);
  const pruneTree = PRUNE_SEQ[pruneStep];
  const shown = tab === "stop" ? stopTree : pruneTree;
  const trainAcc = accuracy(shown, TRAIN);
  const validAcc = accuracy(shown, VALID);

  const line = (key: "train" | "valid") =>
    CURVE.map((c, i) => `${i === 0 ? "M" : "L"}${cx(c.d).toFixed(1)},${cy(c[key]).toFixed(1)}`).join(" ");

  return (
    <section>
      <SectionTitle
        title="⑺ 결정 트리의 문제 — 과다적합과 해결책"
        subtitle="간단한 해결책: 조기 종료 · 가지치기 / 발전된 해결책: 랜덤 포레스트"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Sourced
          className="flex flex-col"
          refs={{
            textbook: "9.2.1 랜덤 포레스트 알고리즘 (도입부)",
            slides: "결정 트리의 문제 — 과다적합",
            lecture: "결정 트리는 모든 학습 데이터에 대해 노이즈까지 완벽하게 학습하려는 경향이 있어 일반화 성능이 떨어진다고 정리함",
          }}
        >
          <div className="flex-1 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/30">
            <p className="flex items-center gap-1.5 text-sm font-bold text-rose-700 dark:text-rose-300">
              <AlertTriangle size={15} /> 과다적합
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              모든 학습 데이터에 대해 노이즈까지 완벽히 학습 → 일반화 성능 저하.
            </p>
          </div>
        </Sourced>
        <Sourced
          className="flex flex-col"
          refs={{
            textbook: "9.2.1 랜덤 포레스트 알고리즘 (도입부 — 트리 깊이 조절)",
            slides: "결정 트리의 문제 — 간단한 해결책: 조기 종료",
          }}
        >
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-300">
              <StopCircle size={15} /> 조기 종료
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              데이터를 더 분할해도 성능이 향상되지 않은 시점에 노드의 분할을 종료 → 트리의 깊이 조절.
            </p>
          </div>
        </Sourced>
        <Sourced
          className="flex flex-col"
          refs={{
            textbook: "9.2.1 랜덤 포레스트 알고리즘 (도입부 — 가지치기)",
            slides: "결정 트리의 문제 — 간단한 해결책: 가지치기 pruning",
          }}
        >
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-300">
              <Scissors size={15} /> 가지치기 pruning
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              전체 트리를 만든 후 불필요한 노드들을 제거.
            </p>
          </div>
        </Sourced>
        <Sourced
          className="flex flex-col"
          refs={{
            textbook: "9.2.1 랜덤 포레스트 알고리즘 (도입부)",
            slides: "결정 트리의 문제 — 발전된 해결책: 랜덤 포레스트",
          }}
        >
          <div className="flex-1 rounded-xl border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/40">
            <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-300">
              <Trees size={15} /> 발전된 해결책
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              앙상블 학습 기법을 결합한 <strong>랜덤 포레스트</strong> random forest.
            </p>
          </div>
        </Sourced>
      </div>

      <Sourced
        refs={{
          textbook: "9.2.1 랜덤 포레스트 알고리즘 (도입부 — 깊이 조절·가지치기)",
          slides: "결정 트리의 문제 — 간단한 해결책",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold">노이즈가 섞인 데이터로 두 해결책 비교</h3>
            <div className="flex gap-1">
              {(
                [
                  ["stop", "조기 종료"],
                  ["prune", "가지치기"],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTab(k)}
                  className={`rounded-md border px-3 py-1 text-xs font-semibold ${
                    tab === k
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <p className="mb-4 text-xs leading-relaxed text-gray-500">
            실제 결정경계 x₁ = x₂인 데이터 300개 중 약 {Math.round(NOISY_FLIP * 100)}%의 레이블을 뒤집어 노이즈를 넣음.
            성능은 같은 분포에서 따로 뽑은 검증 데이터 300개로 확인(학습에는 쓰지 않음).
          </p>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
            <div className="flex flex-col items-center">
              <RegionPlot tree={shown} data={TRAIN} />
              <div className="mt-2 grid w-full max-w-[300px] grid-cols-3 gap-1 text-center text-[11px]">
                <div className="rounded bg-gray-50 p-1.5 dark:bg-gray-800/60">
                  <p className="text-gray-500">리프</p>
                  <p className="font-mono font-bold">{leaves(shown).length}</p>
                </div>
                <div className="rounded bg-gray-50 p-1.5 dark:bg-gray-800/60">
                  <p className="text-gray-500">학습 분류율</p>
                  <p className="font-mono font-bold">{(trainAcc * 100).toFixed(1)}%</p>
                </div>
                <div className="rounded bg-emerald-50 p-1.5 dark:bg-emerald-950/40">
                  <p className="text-gray-500">검증 분류율</p>
                  <p className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    {(validAcc * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {tab === "stop" ? (
              <div>
                <div className="overflow-x-auto">
                  <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full min-w-[280px] max-w-[440px]" role="img" aria-label="깊이별 분류율">
                    {[0.5, 0.75, 1].map((a) => (
                      <g key={a}>
                        <line x1={cx(1)} y1={cy(a)} x2={cx(MAX_D)} y2={cy(a)} stroke="#e2e8f0" />
                        <text x={cx(1) - 5} y={cy(a) + 3} textAnchor="end" fontSize={9} className="fill-gray-400">
                          {a * 100}%
                        </text>
                      </g>
                    ))}
                    {CURVE.map((c) => (
                      <text key={c.d} x={cx(c.d)} y={CH - 12} textAnchor="middle" fontSize={9} className="fill-gray-400">
                        {c.d}
                      </text>
                    ))}
                    <text x={cx(MAX_D)} y={CH - 1} textAnchor="end" fontSize={9} className="fill-gray-500">
                      트리의 깊이
                    </text>
                    <line
                      x1={cx(STOP_D)}
                      y1={cy(1)}
                      x2={cx(STOP_D)}
                      y2={cy(0.5)}
                      stroke="#f59e0b"
                      strokeDasharray="4 3"
                    />
                    <line x1={cx(depth)} y1={cy(1)} x2={cx(depth)} y2={cy(0.5)} stroke="#0f172a" strokeWidth={1} opacity={0.4} />
                    <path d={line("train")} fill="none" stroke="#64748b" strokeWidth={2} />
                    <path d={line("valid")} fill="none" stroke="#059669" strokeWidth={2.5} />
                    {CURVE.map((c) => (
                      <circle key={c.d} cx={cx(c.d)} cy={cy(c.valid)} r={3} fill="#059669" />
                    ))}
                  </svg>
                </div>
                <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="h-0.5 w-4 bg-slate-500" /> 학습 데이터
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-0.5 w-4 bg-emerald-600" /> 검증 데이터
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-0.5 w-4 bg-amber-500" /> 조기 종료 지점
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={MAX_D}
                  value={depth}
                  onChange={(e) => setDepth(Number(e.target.value))}
                  className="mt-3 w-full accent-emerald-600"
                  aria-label="트리의 깊이"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  깊이 <strong>{depth}</strong>
                  {depth === MAX_D && " — 모든 리프 노드의 지니 불순도 0, 학습 데이터 100%"}
                </p>
                <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                  학습 데이터 분류율은 깊이가 깊어질수록 계속 올라 100%에 도달하지만, 검증 데이터 분류율은 깊이{" "}
                  {STOP_D}에서 {(CURVE[STOP_D - 1].valid * 100).toFixed(1)}%로 더 이상 오르지 않음. 이 시점에서 분할을
                  멈추는 것이 조기 종료.
                  <button
                    type="button"
                    onClick={() => setDepth(STOP_D)}
                    className="ml-2 rounded bg-amber-500 px-2 py-0.5 text-[11px] font-semibold text-white"
                  >
                    깊이 {STOP_D}로
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  먼저 모든 리프가 순수해질 때까지 전체 트리(깊이 {MAX_D}, 리프 {leaves(FULL).length}개)를 만든 뒤,
                  아래쪽부터 불필요한 노드를 하나씩 제거.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                  여기서는 두 자식이 모두 리프인 노드를 리프 하나로 합쳐도 검증 데이터 분류율이 떨어지지 않으면 그 노드를
                  불필요한 노드로 보고 제거함(불필요함을 판단하는 한 가지 예).
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPruneStep((s) => Math.min(PRUNE_SEQ.length - 1, s + 1))}
                    disabled={pruneStep >= PRUNE_SEQ.length - 1}
                    className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    <Scissors size={14} /> 노드 하나 제거
                  </button>
                  <button
                    type="button"
                    onClick={() => setPruneStep(PRUNE_SEQ.length - 1)}
                    disabled={pruneStep >= PRUNE_SEQ.length - 1}
                    className="rounded-lg border border-emerald-500 px-3 py-1.5 text-sm font-semibold text-emerald-700 disabled:opacity-40 dark:text-emerald-300"
                  >
                    끝까지
                  </button>
                  <button
                    type="button"
                    onClick={() => setPruneStep(0)}
                    aria-label="전체 트리로"
                    className="rounded-lg border border-gray-200 p-2 text-gray-500 dark:border-gray-700"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <span className="text-xs text-gray-500">
                    {pruneStep} / {PRUNE_SEQ.length - 1}회 제거
                  </span>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[300px] text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700">
                        <th className="py-1 text-left"></th>
                        <th className="py-1 text-right">리프</th>
                        <th className="py-1 text-right">깊이</th>
                        <th className="py-1 text-right">학습</th>
                        <th className="py-1 text-right">검증</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {[
                        ["전체 트리", FULL],
                        ["현재", pruneTree],
                        ["가지치기 완료", PRUNE_SEQ[PRUNE_SEQ.length - 1]],
                      ].map(([label, t]) => {
                        const tt = t as TreeNode;
                        return (
                          <tr key={label as string} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-1 font-sans font-semibold">{label as string}</td>
                            <td className="py-1 text-right">{leaves(tt).length}</td>
                            <td className="py-1 text-right">{treeDepth(tt)}</td>
                            <td className="py-1 text-right">{(accuracy(tt, TRAIN) * 100).toFixed(1)}%</td>
                            <td className="py-1 text-right">{(accuracy(tt, VALID) * 100).toFixed(1)}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                  노이즈 점 하나하나를 감싸던 작은 영역이 사라지면서 학습 분류율은 조금 내려가지만 검증 분류율은 오히려
                  올라감.
                </p>
              </div>
            )}
          </div>
        </div>
      </Sourced>
    </section>
  );
}
