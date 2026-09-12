"use client";

import { useMemo, useState } from "react";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import Dendrogram from "./Dendrogram";
import {
  LINKAGES,
  cutDendrogram,
  linkageDistance,
  longestStableInterval,
  runAgglomerative,
  type LinkageType,
} from "./hierarchicalCore";

const COMPARE_LABELS = ["A", "B", "C", "D", "E", "F"];
const COMPARE_VALUES = [1, 2, 3, 5, 7, 11];
const OUTLIER_LABEL = "G";
const OUTLIER_VALUE = 24;

/** 덴드로그램으로부터 군집 수를 결정하는 예 — 강의록 예제 그대로 */
const CUT_VALUES = [1, 3, 9, 12];
const CUT_LABELS = ["A", "B", "C", "D"];

interface Problem {
  linkage: LinkageType;
  groups: number[][];
  note?: string;
}

const PRESET_PROBLEMS: Problem[] = [
  {
    linkage: "single",
    groups: [
      [1, 2],
      [6, 7],
      [9, 16],
    ],
  },
  {
    linkage: "complete",
    groups: [
      [1, 2],
      [6, 7],
      [9, 16],
    ],
    note: "1번 문제와 같은 데이터. 연결법만 바뀌면 먼저 병합되는 쌍도 바뀜.",
  },
  {
    linkage: "centroid",
    groups: [
      [1, 3],
      [8, 10],
      [14, 16],
    ],
  },
  {
    linkage: "ward",
    groups: [
      [1, 2, 3],
      [9, 10],
      [13, 14],
    ],
  },
  {
    linkage: "average",
    groups: [
      [2, 4],
      [7, 9],
      [11, 19],
    ],
  },
];

const GROUP_NAMES = ["P", "Q", "R"];
const PAIRS: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 2],
];

function pairDistances(problem: Problem) {
  const values = problem.groups.flat();
  const indices: number[][] = [];
  let cursor = 0;
  problem.groups.forEach((g) => {
    indices.push(g.map((_, i) => cursor + i));
    cursor += g.length;
  });
  return PAIRS.map(([a, b]) => ({
    pair: [a, b] as [number, number],
    d: linkageDistance(values, indices[a], indices[b], problem.linkage),
  }));
}

function randomProblem(): Problem {
  const types: LinkageType[] = ["single", "complete", "centroid", "average", "ward"];
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const linkage = types[Math.floor(Math.random() * types.length)];
    const groups: number[][] = [];
    let base = 1 + Math.floor(Math.random() * 3);
    for (let g = 0; g < 3; g += 1) {
      const size = 2 + Math.floor(Math.random() * 2);
      const members: number[] = [];
      let v = base;
      for (let i = 0; i < size; i += 1) {
        members.push(v);
        v += 1 + Math.floor(Math.random() * 3);
      }
      groups.push(members);
      base = v + 2 + Math.floor(Math.random() * 5);
    }
    const candidate: Problem = { linkage, groups };
    const ds = pairDistances(candidate).map((x) => x.d);
    const sorted = [...ds].sort((a, b) => a - b);
    if (sorted[1] - sorted[0] > 1e-6) return candidate;
  }
  return PRESET_PROBLEMS[0];
}

export default function LinkageComparison() {
  const [leftType, setLeftType] = useState<LinkageType>("single");
  const [rightType, setRightType] = useState<LinkageType>("complete");
  const [withOutlier, setWithOutlier] = useState(false);

  const [problems, setProblems] = useState<Problem[]>(PRESET_PROBLEMS.slice(0, 3));
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);

  const [cutHeight, setCutHeight] = useState(4.5);

  const compareValues = useMemo(
    () => (withOutlier ? [...COMPARE_VALUES, OUTLIER_VALUE] : COMPARE_VALUES),
    [withOutlier]
  );
  const compareLabels = useMemo(
    () => (withOutlier ? [...COMPARE_LABELS, OUTLIER_LABEL] : COMPARE_LABELS),
    [withOutlier]
  );

  const leftResult = useMemo(
    () => runAgglomerative(compareValues, compareLabels, leftType),
    [compareValues, compareLabels, leftType]
  );
  const rightResult = useMemo(
    () => runAgglomerative(compareValues, compareLabels, rightType),
    [compareValues, compareLabels, rightType]
  );

  const cutResult = useMemo(
    () => runAgglomerative(CUT_VALUES, CUT_LABELS, "single"),
    []
  );
  const cutClusters = cutDendrogram(cutResult, cutHeight);
  const band = useMemo(
    () => longestStableInterval(cutResult, CUT_VALUES.length),
    [cutResult]
  );
  const cutMax = Math.max(...cutResult.heights) * 1.18;

  const info = (key: LinkageType) =>
    LINKAGES.find((l) => l.key === key) as (typeof LINKAGES)[number];

  const regenerate = () => {
    setProblems([randomProblem(), randomProblem(), randomProblem()]);
    setAnswers([null, null, null]);
  };

  return (
    <section>
      <SectionTitle
        title="군집 간의 거리를 계산하는 방식"
        subtitle="연결법을 바꾸면 덴드로그램과 병합 순서가 달라짐"
      />

      {/* 5가지 연결법 */}
      <div className="mb-10 space-y-3">
        {LINKAGES.map((l) => (
          <div
            key={l.key}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <p className="text-sm font-bold text-teal-700 dark:text-teal-300">
                {l.name}
              </p>
              <p className="text-xs text-gray-400">{l.english}</p>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
              <div className="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800">
                <p className="text-[11px] font-bold text-gray-500">정의</p>
                <p className="mt-1 break-words font-mono text-xs text-gray-700 dark:text-gray-300">
                  {l.formula}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800">
                <p className="text-[11px] font-bold text-gray-500">의미</p>
                <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">
                  {l.meaning}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800">
                <p className="text-[11px] font-bold text-gray-500">특징</p>
                <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">
                  {l.feature}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 덴드로그램 비교 */}
      <div className="mb-10">
        <h3 className="mb-1 text-base font-bold">
          같은 데이터, 다른 연결법 — 덴드로그램 비교
        </h3>
        <p className="mb-4 text-sm text-gray-500">
          1차원 데이터 {compareValues.join(", ")} 에 두 가지 연결법을 각각 적용한 결과.
        </p>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={withOutlier}
              onChange={(e) => setWithOutlier(e.target.checked)}
              className="h-4 w-4 accent-teal-600"
            />
            아웃라이어 G = {OUTLIER_VALUE} 추가
          </label>
          <span className="text-xs text-gray-400">
            군집 특성에서 동떨어진 데이터 하나가 최단·최장연결법에 어떤 영향을 주는지 확인
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {[
            { type: leftType, setType: setLeftType, result: leftResult },
            { type: rightType, setType: setRightType, result: rightResult },
          ].map((side, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
            >
              <select
                value={side.type}
                onChange={(e) => side.setType(e.target.value as LinkageType)}
                className="mb-2 w-full rounded-lg border border-gray-200 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-800"
              >
                {LINKAGES.map((l) => (
                  <option key={l.key} value={l.key}>
                    {l.name} ({l.english})
                  </option>
                ))}
              </select>
              <Dendrogram
                values={compareValues}
                labels={compareLabels}
                result={side.result}
              />
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-500">{info(side.type).feature}</p>
                <p className="font-mono text-xs text-gray-500">
                  병합 순서:{" "}
                  {side.result.steps
                    .map((s) => `${s.mergedId}(${s.distance.toFixed(1)})`)
                    .join(" → ")}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
          최단연결법은 가장 가까운 데이터 쌍만 보므로 군집이 길게 이어 붙는 모양이 되고,
          최장연결법은 가장 멀리 떨어진 데이터 쌍을 보므로 응집된 군집을 만듦. 두 방법
          모두 각 군집의 아웃라이어 하나에 영향을 받게 됨. 중심연결법과 평균연결법은 하나의
          데이터에만 의존해 거리가 계산되는 것을 피하는 방법이고, Ward's 방법은 병합 후
          내부 분산을 보므로 비슷한 크기의 군집을 병합함.
        </p>
      </div>

      {/* 판별 드릴 */}
      <div className="mb-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold">어느 쌍이 먼저 병합될까</h3>
            <p className="text-sm text-gray-500">
              주어진 연결법으로 세 군집 사이의 거리를 계산하고, 가장 먼저 병합될 쌍을 고를 것.
            </p>
          </div>
          <button
            onClick={regenerate}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
          >
            <RefreshCw size={14} />
            새 문제
          </button>
        </div>

        <div className="space-y-4">
          {problems.map((problem, qi) => {
            const distances = pairDistances(problem);
            const minIdx = distances.reduce(
              (best, cur, i) => (cur.d < distances[best].d ? i : best),
              0
            );
            const answered = answers[qi] !== null;
            const isCorrect = answers[qi] === minIdx;
            const meta = info(problem.linkage);

            return (
              <div
                key={qi}
                className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                    {qi + 1}
                  </span>
                  <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
                    {meta.name}
                  </span>
                  <span className="text-xs text-gray-400">{meta.meaning}</span>
                </div>

                {problem.note && (
                  <p className="mt-2 text-xs text-gray-500">{problem.note}</p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {problem.groups.map((g, gi) => (
                    <div
                      key={gi}
                      className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800"
                    >
                      <span className="text-xs font-bold text-gray-500">
                        {GROUP_NAMES[gi]}
                      </span>
                      <span className="ml-2 font-mono text-sm">
                        {"{"} {g.join(", ")} {"}"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {PAIRS.map(([a, b], pi) => {
                    let style =
                      "border-gray-200 bg-gray-50 hover:bg-teal-50 dark:border-gray-700 dark:bg-gray-800";
                    if (answered) {
                      if (pi === minIdx) {
                        style =
                          "border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/20";
                      } else if (pi === answers[qi]) {
                        style =
                          "border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/20";
                      } else {
                        style =
                          "border-gray-200 bg-gray-50 opacity-50 dark:border-gray-700 dark:bg-gray-800";
                      }
                    }
                    return (
                      <button
                        key={pi}
                        disabled={answered}
                        onClick={() =>
                          setAnswers((prev) =>
                            prev.map((v, i) => (i === qi ? pi : v))
                          )
                        }
                        className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 text-sm font-medium transition-colors ${style}`}
                      >
                        {GROUP_NAMES[a]}와 {GROUP_NAMES[b]}
                        {answered && pi === minIdx && (
                          <CheckCircle size={14} className="text-green-500" />
                        )}
                        {answered && pi === answers[qi] && pi !== minIdx && (
                          <XCircle size={14} className="text-red-500" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <div
                    className={`mt-3 rounded-lg p-3 ${
                      isCorrect
                        ? "bg-green-50 dark:bg-green-900/20"
                        : "bg-red-50 dark:bg-red-900/20"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        isCorrect
                          ? "text-green-700 dark:text-green-300"
                          : "text-red-700 dark:text-red-300"
                      }`}
                    >
                      {isCorrect ? "정답" : "오답"}
                    </p>
                    <p className="mt-1 break-words font-mono text-xs text-gray-600 dark:text-gray-400">
                      {meta.formula}
                    </p>
                    <ul className="mt-2 space-y-0.5 text-xs text-gray-700 dark:text-gray-300">
                      {distances.map((entry, i) => (
                        <li
                          key={i}
                          className={i === minIdx ? "font-bold text-teal-700 dark:text-teal-300" : ""}
                        >
                          d({GROUP_NAMES[entry.pair[0]]}, {GROUP_NAMES[entry.pair[1]]}) ={" "}
                          {entry.d.toFixed(2)}
                          {i === minIdx && " ← 최솟값이므로 이 쌍이 먼저 병합됨"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 덴드로그램으로부터 군집 수 결정 */}
      <div>
        <h3 className="mb-1 text-base font-bold">
          덴드로그램으로부터 적합한 군집의 수를 결정하는 방법
        </h3>
        <p className="mb-4 text-sm text-gray-500">
          클러스터 간의 거리가 증가하는 동안 클러스터 수의 변화 없이 일정 기간 유지되는
          지점을 선택.
        </p>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <Dendrogram
              values={CUT_VALUES}
              labels={CUT_LABELS}
              result={cutResult}
              cutHeight={cutHeight}
              band={band}
              onPickHeight={setCutHeight}
            />
            <div className="mt-3">
              <label className="text-xs font-bold text-gray-500">
                절단선 높이 (덴드로그램을 직접 클릭해도 됨)
              </label>
              <input
                type="range"
                min={0}
                max={cutMax}
                step={0.05}
                value={cutHeight}
                onChange={(e) => setCutHeight(Number(e.target.value))}
                className="mt-1 w-full accent-teal-600"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-xs text-gray-500">절단선 높이에서의 클러스터</p>
              <p className="mt-1 text-2xl font-bold text-teal-600 dark:text-teal-400">
                K = {cutClusters.length}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cutClusters.map((c) => (
                  <span
                    key={c.id}
                    className="rounded-full bg-teal-100 px-2.5 py-1 text-xs font-bold text-teal-700 dark:bg-teal-900/50 dark:text-teal-300"
                  >
                    {c.id} = {"{"}
                    {c.members
                      .slice()
                      .sort((a, b) => CUT_VALUES[a] - CUT_VALUES[b])
                      .map((m) => CUT_VALUES[m])
                      .join(", ")}
                    {"}"}
                  </span>
                ))}
              </div>
            </div>

            {band && (
              <div className="rounded-xl border border-teal-300 bg-teal-50 p-4 dark:border-teal-700 dark:bg-teal-950/40">
                <p className="text-xs font-bold text-teal-600 dark:text-teal-400">
                  가장 오래 유지되는 구간
                </p>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  거리 {band.from.toFixed(1)} ~ {band.to.toFixed(1)} 구간에서 클러스터
                  개수가 {band.count}로 변화 없이 유지됨. 따라서 이 지점을 선택하면 K ={" "}
                  {band.count}.
                </p>
                <button
                  onClick={() => setCutHeight((band.from + band.to) / 2)}
                  className="mt-2 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
                >
                  절단선을 이 구간으로 옮기기
                </button>
              </div>
            )}

            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <p className="mb-2 text-xs font-bold text-gray-500">
                거리 구간별 클러스터 개수
              </p>
              <div className="space-y-1 text-xs">
                {cutResult.heights
                  .slice()
                  .sort((a, b) => a - b)
                  .map((h, i, arr) => {
                    const from = i === 0 ? 0 : arr[i - 1];
                    return (
                      <div key={i} className="flex justify-between">
                        <span className="font-mono text-gray-500">
                          {from.toFixed(1)} ~ {h.toFixed(1)}
                        </span>
                        <span className="font-bold">
                          클러스터 {CUT_VALUES.length - i}개
                        </span>
                      </div>
                    );
                  })}
                <div className="flex justify-between">
                  <span className="font-mono text-gray-500">
                    {Math.max(...cutResult.heights).toFixed(1)} 이상
                  </span>
                  <span className="font-bold">클러스터 1개</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
