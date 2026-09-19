"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Info } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import {
  ATTRS,
  WASH_DATA,
  countLabels,
  evaluateSplit,
  fmt,
  giniFromCounts,
  type WashAttr,
} from "./treeCore";

const ROOT_CANDIDATES: WashAttr[] = ["weather", "temperature", "amount"];
const PANEL_LETTER: Record<string, string> = { weather: "(a)", temperature: "(b)", amount: "(c)" };

/** 두 클래스 지니 불순도 곡선 좌표 */
const CW = 300;
const CH = 150;
const cx = (p: number) => 34 + p * (CW - 50);
const cy = (v: number) => CH - 26 - (v / 0.5) * (CH - 46);

export default function GiniCalculator() {
  const [attr, setAttr] = useState<WashAttr>("weather");
  const [p, setP] = useState(0.4);

  const parent = countLabels(WASH_DATA);
  const IR = giniFromCounts([parent.on, parent.off]);
  const evals = useMemo(
    () => ROOT_CANDIDATES.map((a) => evaluateSplit(WASH_DATA, ATTRS[a])),
    [],
  );
  const ev = evals.find((e) => e.attr.key === attr)!;
  const best = evals.reduce((a, b) => (b.giniCriterion < a.giniCriterion ? b : a));

  const curve = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 100; i += 1) {
      const q = i / 100;
      pts.push(`${i === 0 ? "M" : "L"}${cx(q).toFixed(1)},${cy(giniFromCounts([q, 1 - q])).toFixed(1)}`);
    }
    return pts.join(" ");
  }, []);
  const gp = giniFromCounts([p, 1 - p]);

  const maxG = 0.5;

  return (
    <section>
      <SectionTitle
        title="⑶ 속성 선택을 위한 평가 기준 — 지니 불순도와 지니 평가지수"
        subtitle="각 노드에 어떤 속성(결정 요인)을 배정할 것인가?"
      />

      {/* 직관 */}
      <Sourced
        className="mb-6"
        refs={{
          textbook: "9.1.2 그림 9-3 입력 요소에 따른 데이터의 구분 양상",
          slides: "결정 트리의 학습 — 각 노드에 어떤 속성을 배정할 것인가?",
          lecture: "트리 레벨을 확장하는 횟수가 적을수록 효율적이므로, 한 번 확장할 때 가능한 한 많은 데이터가 리프 노드로 가는 속성이 좋다는 직관부터 세움",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-1 text-base font-bold">먼저 직관으로 — 한 번의 레벨 확장에서 리프 노드로 가는 데이터 수</h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            학습이 효율적이려면 한 번의 레벨 확장이 일어날 때마다 최대한 많은 데이터가 리프 노드로 할당되는 것이
            바람직함.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {evals.map((e) => (
              <div
                key={e.attr.key}
                className={`rounded-lg border p-3 ${
                  e.pureCount > 0
                    ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <p className="text-xs text-gray-500">{PANEL_LETTER[e.attr.key]} 루트 = {e.attr.name}</p>
                <p className="mt-1 text-sm">
                  리프 노드로 할당 <strong className="font-mono">{e.pureCount}</strong>개 → 추가 분할 필요{" "}
                  <strong className="font-mono">{14 - e.pureCount}</strong>개
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-500">
            (a)는 14개 중 4개(Rainy)가 곧바로 리프 노드가 되지만 (b)와 (c)는 모든 자식 노드가 다시 레벨 확장이 필요함
            → 학습 효율 측면에서 Weather를 루트 노드에 할당하는 것이 적절. 이 직관적 판단을 수학적 함수로 정량화한 것이
            지니 불순도.
          </p>
        </div>
      </Sourced>

      {/* 정의 */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Sourced
          className="flex flex-col"
          refs={{
            textbook: "9.1.2 지니 불순도 (식 9-1)",
            slides: "결정 트리의 학습 — 속성 선택을 위한 평가 기준",
          }}
        >
          <div className="flex-1 rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/40">
            <p className="text-xs font-bold tracking-wide text-emerald-700 dark:text-emerald-300">
              지니 불순도 I(N) · Gini Impurity
            </p>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              각 노드에 할당된 클래스 레이블이 얼마나 다른지 그 <strong>혼합 정도</strong>를 측정하는 값. 하나의 그룹
              안에 서로 다른 클래스 레이블이 혼재할수록 불순도는 높아짐.
            </p>
            <div className="mt-3 overflow-x-auto rounded-lg bg-white p-3 dark:bg-gray-900">
              <p className="min-w-[260px] text-center font-mono text-base">
                I(N) = Σ<sub>i=1</sub>
                <sup>K</sup> p<sub>i</sub>(1 − p<sub>i</sub>) = 1 − Σ<sub>i=1</sub>
                <sup>K</sup> (p<sub>i</sub>)²
              </p>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <li>K → 클래스의 개수</li>
              <li>pᵢ → 노드 N에 할당된 데이터 그룹에 속한 i번째 클래스의 비율</li>
            </ul>
          </div>
        </Sourced>

        <Sourced
          className="flex flex-col"
          refs={{
            textbook: "9.1.2 지니 평가지수 (식 9-4)",
            slides: "결정 트리의 학습 — 속성 선택을 위한 평가 기준",
            lecture: "관심은 노드 하나의 불순도가 아니라 부모 노드의 속성으로 나눴을 때의 전체 효과라서, 자식 노드 불순도를 단순히 더하지 않고 데이터 개수 비율로 가중해 더한다고 설명",
          }}
        >
          <div className="flex-1 rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/40">
            <p className="text-xs font-bold tracking-wide text-emerald-700 dark:text-emerald-300">
              지니 평가지수 G(R<sub>a</sub>) · Gini criterion
            </p>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              속성 a를 갖는 부모 노드 R<sub>a</sub>에서 <strong>자식 노드들의 지니 불순도의 가중합</strong>.
            </p>
            <div className="mt-3 overflow-x-auto rounded-lg bg-white p-3 dark:bg-gray-900">
              <p className="min-w-[220px] text-center font-mono text-base">
                G(R<sub>a</sub>) = Σ<sub>i=1</sub>
                <sup>M</sup> (|C<sub>i</sub>| / |R<sub>a</sub>|) · I(C<sub>i</sub>)
              </p>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <li>M개의 자식 노드 → C₁, C₂, …, C_M</li>
              <li>|R_a|, |C₁|, …, |C_M| → 각 노드에 속하는 데이터 개수</li>
              <li className="font-semibold text-emerald-700 dark:text-emerald-300">
                루트 노드(깊이 1, 레벨 0)에서 시작해 지니 평가지수를 최소화하는 속성 노드를 선택하여 레벨을 확장하는
                과정을 반복
              </li>
            </ul>
          </div>
        </Sourced>
      </div>

      {/* 곡선 */}
      <Sourced
        className="mb-6"
        refs={{
          textbook: "9.1.2 지니 불순도 — OFF/ON 40%/60% 노드와 OFF 100% 노드의 비교",
          slides: "결정 트리의 학습 — 속성 선택을 위한 평가 기준",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-1 text-base font-bold">혼재할수록 높아지는 불순도 — 두 클래스일 때</h3>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            ON 비율 p를 움직이면 I = 1 − p² − (1 − p)²가 함께 계산됨.
          </p>
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[320px_1fr]">
            <div className="overflow-x-auto">
              <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full min-w-[280px]" role="img" aria-label="지니 불순도 곡선">
                <line x1={cx(0)} y1={cy(0)} x2={cx(1)} y2={cy(0)} stroke="#cbd5e1" />
                <line x1={cx(0)} y1={cy(0)} x2={cx(0)} y2={cy(0.5)} stroke="#cbd5e1" />
                {[0, 0.25, 0.5].map((v) => (
                  <text key={v} x={cx(0) - 5} y={cy(v) + 3} textAnchor="end" fontSize={9} className="fill-gray-400">
                    {v}
                  </text>
                ))}
                {[0, 0.5, 1].map((v) => (
                  <text key={v} x={cx(v)} y={cy(0) + 13} textAnchor="middle" fontSize={9} className="fill-gray-400">
                    {v}
                  </text>
                ))}
                <text x={cx(1)} y={cy(0) + 24} textAnchor="end" fontSize={9} className="fill-gray-500">
                  ON 비율 p
                </text>
                <path d={curve} fill="none" stroke="#10b981" strokeWidth={2.5} />
                <line x1={cx(p)} y1={cy(0)} x2={cx(p)} y2={cy(gp)} stroke="#10b981" strokeDasharray="3 3" />
                <motion.circle initial={false} r={5} fill="#047857" animate={{ cx: cx(p), cy: cy(gp) }} />
              </svg>
            </div>
            <div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(p * 100)}
                onChange={(e) => setP(Number(e.target.value) / 100)}
                className="w-full accent-emerald-600"
                aria-label="ON 비율"
              />
              <p className="mt-2 font-mono text-sm">
                I = 1 − ({p.toFixed(2)})² − ({(1 - p).toFixed(2)})² ={" "}
                <strong className="text-emerald-700 dark:text-emerald-300">{fmt(gp)}</strong>
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                <button type="button" onClick={() => setP(0.6)} className="rounded-full border border-gray-200 px-2 py-0.5 dark:border-gray-700">
                  ON 60% · OFF 40% → 0.48
                </button>
                <button type="button" onClick={() => setP(0)} className="rounded-full border border-gray-200 px-2 py-0.5 dark:border-gray-700">
                  OFF 100% → 0
                </button>
                <button type="button" onClick={() => setP(0.5)} className="rounded-full border border-gray-200 px-2 py-0.5 dark:border-gray-700">
                  반반 → 0.5
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                한 가지 레이블만 있으면 0, 두 레이블이 반반일 때 가장 큼. 그림 9-3(a)의 첫 번째 자식 노드(OFF/ON =
                40%/60%)가 두 번째 자식 노드(OFF 100%)보다 불순도가 훨씬 높음.
              </p>
            </div>
          </div>
        </div>
      </Sourced>

      {/* 계산기 */}
      <Sourced
        refs={{
          textbook: "9.1.2 식 9-2 ~ 식 9-5 지니 평가지수 계산 예",
          slides: "결정 트리의 학습 — 지니 불순도·지니 평가지수 계산",
          lecture: "C₁은 OFF 2개·ON 3개라 절반 정도 섞였고 C₂는 OFF만 있어 불순도 0이라고 직관적으로 해석하며 계산함",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-base font-bold">
              <Calculator size={16} className="text-emerald-500" />
              루트 노드 속성별 지니 평가지수 계산기
            </h3>
            <div className="flex gap-1">
              {ROOT_CANDIDATES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAttr(a)}
                  className={`rounded-md border px-3 py-1 text-xs font-semibold ${
                    attr === a
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-gray-200 text-gray-600 hover:border-emerald-300 dark:border-gray-700 dark:text-gray-300"
                  }`}
                >
                  {ATTRS[a].name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 overflow-x-auto rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
            <p className="min-w-[420px] font-mono text-sm">
              분할 전 루트 R: ON {parent.on}, OFF {parent.off} → I(R) = 1 − ({parent.on}/14)² − ({parent.off}/14)² ={" "}
              <strong>{fmt(IR)}</strong>
            </p>
          </div>

          <motion.div
            key={attr}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`grid grid-cols-1 gap-3 ${ev.children.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}
          >
            {ev.children.map((c, i) => (
              <div key={c.branch} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="flex items-center justify-between text-sm font-bold">
                  <span>
                    C<sub>{i + 1}</sub> · {c.branch}
                  </span>
                  <span className="text-xs font-normal text-gray-500">|C{i + 1}| = {c.count.n}</span>
                </p>
                <div className="my-2 flex flex-wrap gap-1">
                  {c.rows.map((r) => (
                    <span
                      key={r.no}
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        r.label === "ON"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                      }`}
                    >
                      {r.label}
                    </span>
                  ))}
                </div>
                <p className="font-mono text-xs">
                  I(C{i + 1}) = 1 − ({c.count.on}/{c.count.n})² − ({c.count.off}/{c.count.n})²
                </p>
                <p className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">= {fmt(c.gini)}</p>
              </div>
            ))}
          </motion.div>

          <div className="mt-4 overflow-x-auto rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/40">
            <p className="min-w-[440px] font-mono text-sm">
              G(R<sub>{ev.attr.name}</sub>) ={" "}
              {ev.children.map((c, i) => (
                <span key={c.branch}>
                  {i > 0 && " + "}
                  {c.count.n}/14 × {fmt(c.gini)}
                </span>
              ))}{" "}
              = <strong className="text-base text-emerald-700 dark:text-emerald-300">{fmt(ev.giniCriterion)}</strong>
            </p>
          </div>

          {/* 비교 막대 */}
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold text-gray-500">세 속성의 지니 평가지수 비교 (작을수록 좋음)</p>
            <div className="space-y-2">
              {evals.map((e) => {
                const isBest = e.attr.key === best.attr.key;
                return (
                  <button
                    key={e.attr.key}
                    type="button"
                    onClick={() => setAttr(e.attr.key)}
                    className="flex w-full items-center gap-2 text-left"
                  >
                    <span className="w-24 shrink-0 text-xs font-semibold">{e.attr.name}</span>
                    <span className="relative h-5 flex-1 rounded bg-gray-100 dark:bg-gray-800">
                      <motion.span
                        className={`absolute inset-y-0 left-0 rounded ${isBest ? "bg-emerald-500" : "bg-slate-400"}`}
                        initial={false}
                        animate={{ width: `${(e.giniCriterion / maxG) * 100}%` }}
                      />
                      <span
                        className="absolute inset-y-0 border-l-2 border-dashed border-rose-500"
                        style={{ left: `${(IR / maxG) * 100}%` }}
                        title="분할 전 I(R)"
                      />
                    </span>
                    <span className="w-16 shrink-0 text-right font-mono text-xs">{fmt(e.giniCriterion)}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-gray-500">
              <span className="text-rose-500">점선</span> = 분할 전 I(R) = {fmt(IR)}. Weather로 나누면 불순도가{" "}
              {fmt(IR)} → {fmt(best.giniCriterion)}로 가장 많이 줄어듦 → <strong>Weather</strong> 선택.
            </p>
          </div>

          <div className="mt-4 flex gap-2 rounded-lg bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
            <Info size={14} className="mt-0.5 shrink-0" />
            <p>
              G(R<sub>Amount</sub>)는 교재 본문에 0.4048로 적혀 있으나, &lt;표 9-1&gt;로 다시 계산하면 Small 8개(ON 2),
              Large 6개(ON 3)이므로 8/14 × 0.375 + 6/14 × 0.5 = 0.4286 (강의록 값과 일치). 어느 값이든 Weather의
              0.3429보다 커서 결론은 같음.
            </p>
          </div>
        </div>
      </Sourced>
    </section>
  );
}
