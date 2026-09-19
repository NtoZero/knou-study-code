"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Shuffle, Trees, Dices, ThumbsUp, ThumbsDown } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { C1_COLOR, C2_COLOR, GridPlot, RegionPlot, gridCenters } from "./plots";
import {
  bootstrapIndices,
  buildTree,
  forestPredict,
  makeDiagonalData,
  mulberry32,
  predict,
  type Sample,
} from "./treeCore";

/** 생성 과정 실습용 작은 데이터 */
const N = 40;
const DATA: Sample[] = makeDiagonalData(N, 2024, 0.05);
const M_DEMO = 3;
const TREE_DEPTH = 4;
const RES = 36;
const CENTERS = gridCenters(RES);

const STEPS = [
  {
    no: "①",
    text: "N개의 데이터로 이루어진 전체 학습 데이터 집합 X를 준비하고, 각 결정 트리의 학습에 사용될 데이터 집합의 크기 Ñ을 정한다. (Ñ ≤ N)",
  },
  {
    no: "②",
    text: "i번째 결정 트리를 학습하기 위해 트리의 깊이를 결정하고, 학습 데이터 집합 X로부터 Ñ개의 데이터를 랜덤하게 선출하여 데이터 집합 Xᵢ를 만든다. 이때 같은 데이터가 중복해서 선출되는 것도 허락한다(복원추출).",
  },
  {
    no: "③",
    text: "데이터 집합 Xᵢ를 이용하여 결정 트리를 학습하여 i번째 판별함수(또는 회귀함수) hᵢ(x)를 얻는다.",
  },
  {
    no: "④",
    text: "②~③ 과정을 M번 반복하여 서로 다른 M개의 결정 트리를 생성하고, 이들을 결합하여 최종 판별함수(또는 회귀함수) f(h₁, h₂, …, h_M)을 찾는다.",
  },
];

export default function RandomForestConcept() {
  const [seed, setSeed] = useState(1);
  const [nTilde, setNTilde] = useState(N);
  const [q, setQ] = useState<[number, number]>([0.45, 0.55]);

  const forest = useMemo(() => {
    const rnd = mulberry32(seed * 7919);
    return Array.from({ length: M_DEMO }, () => {
      const idx = bootstrapIndices(N, nTilde, rnd);
      const counts = new Array(N).fill(0);
      idx.forEach((i) => (counts[i] += 1));
      const sample = idx.map((i) => DATA[i]);
      return { idx, counts, sample, tree: buildTree(sample, "classification", TREE_DEPTH) };
    });
  }, [seed, nTilde]);

  const combinedGrid = useMemo(
    () => CENTERS.map((c) => forestPredict(forest.map((f) => f.tree), c, "classification")),
    [forest],
  );
  const outs = forest.map((f) => predict(f.tree, q));
  const vote = forestPredict(
    forest.map((f) => f.tree),
    q,
    "classification",
  );

  return (
    <section>
      <SectionTitle
        title="⑻ 랜덤 포레스트"
        subtitle="결정 트리와 앙상블 학습 기법을 결합한 방법"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Sourced
          className="lg:col-span-3"
          refs={{
            textbook: "9.2.1 랜덤 포레스트 알고리즘",
            slides: "랜덤 포레스트?",
            lecture: "지난 강의의 가장 간단한 결합 방법인 배깅으로 데이터를 리샘플링해 M개의 결정 트리를 만든 뒤 결합하는 것이 전부라고 한마디로 정리함",
          }}
        >
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/40">
            <p className="flex items-center gap-2 text-xs font-bold tracking-wide text-emerald-700 dark:text-emerald-300">
              <Trees size={14} /> 랜덤 포레스트 random forest
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              <strong>배깅 방법으로 데이터를 리샘플링하여 M개의 결정 트리를 학습하고 결합하는 방법.</strong> 결합
              방법 → 분류 문제는 주로 <strong>보팅법</strong>, 회귀 문제는 <strong>출력값의 평균</strong>.
            </p>
          </div>
        </Sourced>

        <Sourced
          className="flex flex-col"
          refs={{
            textbook: "9.2.1 랜덤 포레스트 알고리즘",
            slides: "랜덤 포레스트? — “포레스트”, “랜덤”",
            lecture: "숲은 나무가 많이 모인 것이라 포레스트, 트리 사이의 차이가 랜덤하게 추출된 샘플에서 생기니 랜덤이라고 용어의 유래를 풀어 줌",
          }}
        >
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="flex items-center gap-1.5 text-sm font-bold">
              <Dices size={15} className="text-emerald-500" /> 이름의 유래
            </p>
            <ul className="mt-2 space-y-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              <li>
                <strong className="text-emerald-700 dark:text-emerald-300">&ldquo;포레스트&rdquo;</strong> → M개의 서로 다른
                결정 트리가 결합된 형식으로 &ldquo;숲&rdquo; 구조를 가짐
              </li>
              <li>
                <strong className="text-emerald-700 dark:text-emerald-300">&ldquo;랜덤&rdquo;</strong> → 결정 트리 간의 차이가
                랜덤하게 추출된 데이터 샘플에 기인
              </li>
            </ul>
          </div>
        </Sourced>

        <Sourced
          className="flex flex-col"
          refs={{
            textbook: "9.2.2 랜덤 포레스트를 이용한 분류와 회귀",
            slides: "랜덤 포레스트? — 장점",
          }}
        >
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="flex items-center gap-1.5 text-sm font-bold">
              <ThumbsUp size={15} className="text-emerald-500" /> 장점
            </p>
            <ul className="mt-2 space-y-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              <li>
                <span className="font-semibold text-gray-500">(결정 트리)</span> 높은 설명 능력, 빠른 학습
              </li>
              <li>
                <span className="font-semibold text-gray-500">(앙상블 학습)</span> 간단한 학습기의 결합으로 복잡한
                함수의 표현 및 일반화 성능 향상
              </li>
            </ul>
          </div>
        </Sourced>

        <Sourced className="flex flex-col" refs={{ textbook: "9장 요약 — 랜덤 포레스트의 단점" }}>
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="flex items-center gap-1.5 text-sm font-bold">
              <ThumbsDown size={15} className="text-rose-500" /> 단점
            </p>
            <ul className="mt-2 space-y-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              <li>생성 과정에서 많은 시간이 걸림</li>
              <li>예측 결과를 해석하기 어려움 — 트리 하나는 경로를 따라 읽으면 되지만, M개의 결과를 결합한 최종 출력은 그렇지 않음</li>
            </ul>
          </div>
        </Sourced>
      </div>

      <Sourced
        refs={{
          textbook: "9.2.1 그림 9-11 랜덤 포레스트의 생성 과정, 랜덤 포레스트의 학습 ①~④",
          slides: "랜덤 포레스트의 생성 과정 / 랜덤 포레스트의 학습",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-3 text-base font-bold">랜덤 포레스트의 학습 — 리샘플링부터 결합까지 직접 돌려 보기</h3>

          <div className="mb-4 space-y-1.5">
            {STEPS.map((s) => (
              <div
                key={s.no}
                className="flex gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs leading-relaxed text-gray-700 dark:bg-gray-800/60 dark:text-gray-300"
              >
                <span className="font-bold text-emerald-600">{s.no}</span>
                <span>{s.text}</span>
              </div>
            ))}
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-800/60">
            <span>
              N = <strong className="font-mono">{N}</strong>
            </span>
            <label className="flex items-center gap-2">
              Ñ =
              <input
                type="range"
                min={10}
                max={N}
                value={nTilde}
                onChange={(e) => setNTilde(Number(e.target.value))}
                className="w-28 accent-emerald-600"
                aria-label="Ñ"
              />
              <strong className="font-mono">{nTilde}</strong>
            </label>
            <span>
              M = <strong className="font-mono">{M_DEMO}</strong> · 트리의 깊이 = <strong className="font-mono">{TREE_DEPTH}</strong>
            </span>
            <button
              type="button"
              onClick={() => setSeed((s) => s + 1)}
              className="ml-auto flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 font-semibold text-white hover:bg-emerald-700"
            >
              <Shuffle size={13} /> 다시 리샘플링
            </button>
          </div>

          {/* 리샘플링 결과 */}
          <div className="space-y-2">
            {forest.map((f, t) => {
              const unique = f.counts.filter((c) => c > 0).length;
              const dup = f.counts.filter((c) => c > 1).length;
              return (
                <div key={t} className="rounded-lg border border-gray-200 p-2.5 dark:border-gray-700">
                  <p className="mb-1.5 text-[11px] text-gray-500">
                    <strong className="text-gray-700 dark:text-gray-200">X{["₁", "₂", "₃"][t]}</strong> — {nTilde}개
                    선출 · 서로 다른 데이터 {unique}개 · 두 번 이상 뽑힌 데이터 {dup}개 · 뽑히지 않은 데이터 {N - unique}개
                  </p>
                  <div className="flex flex-wrap gap-0.5">
                    {f.counts.map((c, i) => (
                      <motion.span
                        key={i}
                        layout
                        title={`#${i + 1} × ${c}`}
                        className={`flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold ${
                          c === 0 ? "bg-gray-100 text-gray-300 dark:bg-gray-800 dark:text-gray-600" : "text-white"
                        }`}
                        style={c > 0 ? { background: DATA[i].y === 0 ? C1_COLOR : C2_COLOR, opacity: 0.45 + 0.2 * c } : {}}
                      >
                        {c > 1 ? `×${c}` : ""}
                      </motion.span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-1 text-[11px] text-gray-500">
            칸 하나가 전체 데이터 하나(색 = 클래스). 회색은 이번에 뽑히지 않은 데이터, ×2·×3은 중복 선출.
          </p>

          {/* 트리별 결정경계와 결합 */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {forest.map((f, t) => (
              <div key={t} className="flex flex-col items-center rounded-lg bg-gray-50 p-2 dark:bg-gray-800/40">
                <p className="mb-1 text-xs font-bold">
                  h{["₁", "₂", "₃"][t]}(x) — X{["₁", "₂", "₃"][t]}로 학습
                </p>
                <RegionPlot tree={f.tree} data={f.sample} size={190} mark={q} />
                <p className="mt-1 text-[11px]">
                  질의점 출력:{" "}
                  <strong style={{ color: outs[t] === 0 ? C1_COLOR : C2_COLOR }}>{outs[t] === 0 ? "C₁" : "C₂"}</strong>
                </p>
              </div>
            ))}
            <div className="flex flex-col items-center rounded-lg bg-emerald-50 p-2 ring-1 ring-emerald-300 dark:bg-emerald-950/40 dark:ring-emerald-800">
              <p className="mb-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">f(h₁, h₂, h₃) — 보팅</p>
              <GridPlot grid={combinedGrid} res={RES} data={DATA} size={190} mark={q} />
              <p className="mt-1 text-[11px]">
                최종 출력:{" "}
                <strong style={{ color: vote === 0 ? C1_COLOR : C2_COLOR }}>{vote === 0 ? "C₁" : "C₂"}</strong>{" "}
                ({outs.filter((o) => o === vote).length}/{M_DEMO}표)
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-800/60 sm:grid-cols-[1fr_1fr_2fr]">
            <label className="flex items-center gap-2">
              질의점 x₁
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(q[0] * 100)}
                onChange={(e) => setQ([Number(e.target.value) / 100, q[1]])}
                className="flex-1 accent-emerald-600"
                aria-label="질의점 x1"
              />
              <span className="font-mono">{q[0].toFixed(2)}</span>
            </label>
            <label className="flex items-center gap-2">
              x₂
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(q[1] * 100)}
                onChange={(e) => setQ([q[0], Number(e.target.value) / 100])}
                className="flex-1 accent-emerald-600"
                aria-label="질의점 x2"
              />
              <span className="font-mono">{q[1].toFixed(2)}</span>
            </label>
            <p className="leading-relaxed text-gray-600 dark:text-gray-400">
              추론: 새로운 입력을 <strong>모든 트리에 전달</strong>하고, 각 트리에서 얻은 결과를 결합 함수 f에 전달해
              최종 결과를 출력.
            </p>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            &lsquo;다시 리샘플링&rsquo;을 누를 때마다 X₁, X₂, X₃가 달라지고 그에 따라 세 트리의 결정경계도 달라짐 — 트리
            간의 차이는 랜덤하게 추출된 데이터 샘플에서 생김.
          </p>
        </div>
      </Sourced>
    </section>
  );
}
