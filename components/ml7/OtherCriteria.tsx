"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import {
  ATTRS,
  WASH_DATA,
  countLabels,
  entropyFromCounts,
  evaluateSplit,
  fmt,
  makeSineData,
  SINE_SEED,
  type WashAttr,
} from "./treeCore";

const ROOT_CANDIDATES: WashAttr[] = ["weather", "temperature", "amount"];

/** 분산 감소량 실습용 1차원 회귀 데이터 (그림 9-9 형태) */
const REG = makeSineData(80, SINE_SEED);
const XS = REG.map((d) => d.x[0]);
const YS = REG.map((d) => d.y);

const variance = (v: number[]) => {
  if (v.length === 0) return 0;
  const m = v.reduce((a, b) => a + b, 0) / v.length;
  return v.reduce((s, x) => s + (x - m) ** 2, 0) / v.length;
};
const mean = (v: number[]) => (v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0);

/** 기준값 t로 나눴을 때 자식 노드 분산의 가중평균 */
function weightedVar(t: number) {
  const L = YS.filter((_, i) => XS[i] <= t);
  const R = YS.filter((_, i) => XS[i] > t);
  const n = YS.length;
  return {
    L,
    R,
    w: (L.length / n) * variance(L) + (R.length / n) * variance(R),
  };
}

const PARENT_VAR = variance(YS);

/** 인접한 두 x의 중간점 가운데 분산 감소량이 가장 큰 기준값 */
const BEST_T = (() => {
  let best = { t: 0, red: -1 };
  for (let i = 0; i < XS.length - 1; i += 1) {
    if (XS[i] === XS[i + 1]) continue;
    const t = (XS[i] + XS[i + 1]) / 2;
    const red = PARENT_VAR - weightedVar(t).w;
    if (red > best.red) best = { t, red };
  }
  return best;
})();

const PW = 440;
const PH = 210;
const px = (x: number) => 34 + (x / 5) * (PW - 48);
const py = (y: number) => 14 + ((2.1 - y) / 4.2) * (PH - 40);

export default function OtherCriteria() {
  const [attr, setAttr] = useState<WashAttr>("weather");
  const [t, setT] = useState(2.0);

  const parent = countLabels(WASH_DATA);
  const HR = entropyFromCounts([parent.on, parent.off]);
  const evals = useMemo(() => ROOT_CANDIDATES.map((a) => evaluateSplit(WASH_DATA, ATTRS[a])), []);
  const ev = evals.find((e) => e.attr.key === attr)!;
  const bestIG = evals.reduce((a, b) => (b.infoGain > a.infoGain ? b : a));

  const split = useMemo(() => weightedVar(t), [t]);
  const reduction = PARENT_VAR - split.w;
  const mL = mean(split.L);
  const mR = mean(split.R);

  const bar = (v: number, max: number) => `${Math.max(0, Math.min(1, v / max)) * 100}%`;

  return (
    <section>
      <SectionTitle
        title="⑷ 속성 노드 선택을 위한 그 밖의 평가지수"
        subtitle="정보 이득 · 분산 감소량 · 카이제곱(Chi-square)"
      />

      <Sourced
        className="mb-6"
        refs={{
          textbook: "9.1.2 결정 트리의 학습 — 정보 이득·분산 감소량 (명칭만 소개)",
          slides: "속성 노드 선택을 위한 그 밖의 평가지수",
        }}
      >
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <table className="w-full min-w-[560px] text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                <th className="py-2 pr-2">평가지수</th>
                <th className="py-2 pr-2">무엇을 재는가</th>
                <th className="py-2 pr-2">선택 기준</th>
                <th className="py-2">주로 쓰는 문제</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-2 font-bold">지니 평가지수</td>
                <td className="py-2 pr-2">자식 노드 지니 불순도의 가중합</td>
                <td className="py-2 pr-2 font-semibold text-emerald-700 dark:text-emerald-300">최소인 속성</td>
                <td className="py-2">분류</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-2 font-bold">정보 이득 information gain</td>
                <td className="py-2 pr-2">데이터 집합의 분할 전후의 엔트로피의 차이</td>
                <td className="py-2 pr-2 font-semibold text-emerald-700 dark:text-emerald-300">높은 속성</td>
                <td className="py-2">분류</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-2 font-bold">분산 감소량 variance reduction</td>
                <td className="py-2 pr-2">모든 노드에 대한 분산의 가중평균</td>
                <td className="py-2 pr-2 font-semibold text-emerald-700 dark:text-emerald-300">분산이 가장 많이 줄어드는 분할</td>
                <td className="py-2">회귀 문제에서 주로 사용</td>
              </tr>
              <tr>
                <td className="py-2 pr-2 font-bold">Chi-square</td>
                <td className="py-2 pr-2">부모 노드와 하위 노드 간 차이의 통계적 유의성</td>
                <td className="py-2 pr-2 font-semibold text-emerald-700 dark:text-emerald-300">차이가 유의한(큰) 분할</td>
                <td className="py-2">목표 출력이 범주형인 경우에 적합</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Sourced>

      {/* 정보 이득 */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Sourced
          className="flex flex-col"
          refs={{
            textbook: "9.1.2 결정 트리의 학습 — 정보 이득 (명칭만 소개)",
            slides: "속성 노드 선택을 위한 그 밖의 평가지수 — 정보 이득",
            lecture: "엔트로피가 높다는 것은 여러 가지가 많이 섞였다는 뜻이라 정보 이득은 낮고, 정보 이득이 높은 속성을 선택한다고 설명",
          }}
        >
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <h3 className="text-base font-bold">정보 이득 — 세탁기 데이터로 계산</h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              엔트로피 → &ldquo;주어진 데이터 집합의 혼잡도&rdquo; ⇒ (엔트로피↑, 정보 이득↓). 분할 뒤 자식 노드들의
              엔트로피가 낮을수록 분할 전후의 차이, 즉 정보 이득이 커짐.
            </p>
            <div className="mt-3 overflow-x-auto rounded-lg bg-gray-50 p-3 font-mono text-xs dark:bg-gray-800/60">
              <p className="min-w-[340px]">엔트로피 H = −Σ pᵢ log₂ pᵢ (pᵢ = i번째 클래스의 비율)</p>
              <p className="min-w-[340px]">정보 이득 = H(분할 전) − Σ (|Cᵢ|/|R|)·H(Cᵢ)</p>
            </div>
            <div className="mt-3 flex gap-1">
              {ROOT_CANDIDATES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAttr(a)}
                  className={`flex-1 rounded-md border px-2 py-1 text-xs font-semibold ${
                    attr === a
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300"
                  }`}
                >
                  {ATTRS[a].name}
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-1 overflow-x-auto font-mono text-xs">
              <p className="min-w-[320px]">
                H(R) = −(5/14)log₂(5/14) − (9/14)log₂(9/14) = <strong>{fmt(HR)}</strong>
              </p>
              {ev.children.map((c) => (
                <p key={c.branch} className="min-w-[320px] text-gray-600 dark:text-gray-400">
                  H({c.branch}) : ON {c.count.on}/{c.count.n} → {fmt(c.entropy)}
                </p>
              ))}
              <p className="min-w-[320px]">
                가중합 = {ev.children.map((c) => `${c.count.n}/14×${fmt(c.entropy, 3)}`).join(" + ")} ={" "}
                {fmt(ev.weightedEntropy)}
              </p>
              <p className="min-w-[320px] font-bold text-emerald-700 dark:text-emerald-300">
                정보 이득 = {fmt(HR)} − {fmt(ev.weightedEntropy)} = {fmt(ev.infoGain)}
              </p>
            </div>
            <div className="mt-3 space-y-1.5">
              {evals.map((e) => (
                <div key={e.attr.key} className="flex items-center gap-2 text-xs">
                  <span className="w-24 shrink-0 font-semibold">{e.attr.name}</span>
                  <span className="relative h-4 flex-1 rounded bg-gray-100 dark:bg-gray-800">
                    <span
                      className={`absolute inset-y-0 left-0 rounded ${
                        e.attr.key === bestIG.attr.key ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                      style={{ width: bar(e.infoGain, 0.3) }}
                    />
                  </span>
                  <span className="w-14 shrink-0 text-right font-mono">{fmt(e.infoGain)}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-gray-500">
              정보 이득이 가장 높은 속성도 Weather — 지니 평가지수로 고른 결과와 같음.
            </p>
          </div>
        </Sourced>

        {/* 카이제곱 */}
        <Sourced
          className="flex flex-col"
          refs={{
            slides: "속성 노드 선택을 위한 그 밖의 평가지수 — Chi-square",
          }}
        >
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <h3 className="text-base font-bold">Chi-square — 부모와 하위 노드의 차이</h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              부모 노드와 하위 노드 간 차이의 통계적 유의성을 활용. 하위 노드의 ON/OFF 개수가 부모 노드의 비율(ON
              5/14)대로 나뉘었을 때 기대되는 개수와 얼마나 다른지를 모아 봄. 목표 출력이 범주형(ON/OFF)인 경우에 적합.
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[320px] text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700">
                    <th className="py-1 text-left">{ev.attr.name}</th>
                    <th className="py-1 text-right">ON 관측 / 기대</th>
                    <th className="py-1 text-right">OFF 관측 / 기대</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {ev.children.map((c) => (
                    <tr key={c.branch} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-1 font-sans font-semibold">{c.branch}</td>
                      <td className="py-1 text-right">
                        {c.count.on} / {fmt((c.count.n * parent.on) / 14, 2)}
                      </td>
                      <td className="py-1 text-right">
                        {c.count.off} / {fmt((c.count.n * parent.off) / 14, 2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 overflow-x-auto font-mono text-xs">
              <span className="block min-w-[300px]">
                χ² = Σ (관측 − 기대)² / 기대 ={" "}
                <strong className="text-emerald-700 dark:text-emerald-300">{fmt(ev.chiSquare)}</strong>
              </span>
            </p>
            <div className="mt-3 space-y-1.5">
              {evals.map((e) => (
                <div key={e.attr.key} className="flex items-center gap-2 text-xs">
                  <span className="w-24 shrink-0 font-semibold">{e.attr.name}</span>
                  <span className="relative h-4 flex-1 rounded bg-gray-100 dark:bg-gray-800">
                    <span
                      className={`absolute inset-y-0 left-0 rounded ${
                        e.attr.key === "weather" ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                      style={{ width: bar(e.chiSquare, 4) }}
                    />
                  </span>
                  <span className="w-14 shrink-0 text-right font-mono">{fmt(e.chiSquare, 3)}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-gray-500">
              위 표의 속성 버튼은 정보 이득 카드와 함께 바뀜. Weather가 부모 노드와의 차이가 가장 큼.
            </p>
          </div>
        </Sourced>
      </div>

      {/* 분산 감소량 */}
      <Sourced
        refs={{
          textbook: "9.1.2 결정 트리의 학습 — 분산 감소량 (명칭만 소개)",
          slides: "속성 노드 선택을 위한 그 밖의 평가지수 — 분산 감소량",
          lecture: "분산이 작을수록 데이터가 흩어지지 않고 뭉쳐 동질성이 높다는 점으로 분산 감소량을 풀어 설명",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">분산 감소량 — 회귀 문제에서 기준값 고르기</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            분산은 데이터의 동질성을 표시 ⇒ 데이터가 완전히 같으면 분산은 0. 입력 x의 기준값으로 두 노드를 만들고,
            두 노드 분산의 가중평균이 분할 전 분산보다 얼마나 줄었는지 확인. 기준값을 움직여 보면 됨.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
            <div className="overflow-x-auto">
              <svg viewBox={`0 0 ${PW} ${PH}`} className="w-full min-w-[380px]" role="img" aria-label="분산 감소량 실습">
                <line x1={px(0)} y1={py(0)} x2={px(5)} y2={py(0)} stroke="#e2e8f0" />
                {[0, 1, 2, 3, 4, 5].map((v) => (
                  <text key={v} x={px(v)} y={PH - 8} textAnchor="middle" fontSize={9} className="fill-gray-400">
                    {v}
                  </text>
                ))}
                {[-2, -1, 0, 1, 2].map((v) => (
                  <text key={v} x={px(0) - 6} y={py(v) + 3} textAnchor="end" fontSize={9} className="fill-gray-400">
                    {v}
                  </text>
                ))}
                <rect x={px(0)} y={10} width={px(t) - px(0)} height={PH - 36} fill="#10b981" opacity={0.06} />
                <line x1={px(0)} y1={py(mL)} x2={px(t)} y2={py(mL)} stroke="#059669" strokeWidth={2.5} />
                <line x1={px(t)} y1={py(mR)} x2={px(5)} y2={py(mR)} stroke="#7c3aed" strokeWidth={2.5} />
                <line x1={px(t)} y1={10} x2={px(t)} y2={PH - 26} stroke="#0f172a" strokeDasharray="4 3" />
                <line
                  x1={px(BEST_T.t)}
                  y1={10}
                  x2={px(BEST_T.t)}
                  y2={PH - 26}
                  stroke="#f59e0b"
                  strokeWidth={1}
                  opacity={0.7}
                />
                {REG.map((d, i) => (
                  <circle
                    key={i}
                    cx={px(d.x[0])}
                    cy={py(d.y)}
                    r={2.6}
                    fill={d.x[0] <= t ? "#059669" : "#7c3aed"}
                    opacity={0.8}
                  />
                ))}
                <text x={px(t) + 4} y={20} fontSize={10} className="fill-gray-700 dark:fill-gray-200">
                  x = {t.toFixed(2)}
                </text>
              </svg>
              <input
                type="range"
                min={20}
                max={480}
                value={Math.round(t * 100)}
                onChange={(e) => setT(Number(e.target.value) / 100)}
                className="mt-1 w-full accent-emerald-600"
                aria-label="분할 기준값"
              />
            </div>
            <div className="space-y-2 text-xs">
              <div className="rounded-lg bg-gray-50 p-3 font-mono dark:bg-gray-800/60">
                <p>분할 전 분산 = {fmt(PARENT_VAR)}</p>
                <p className="text-emerald-700 dark:text-emerald-300">
                  왼쪽 {split.L.length}개 분산 = {fmt(variance(split.L))}
                </p>
                <p className="text-violet-700 dark:text-violet-300">
                  오른쪽 {split.R.length}개 분산 = {fmt(variance(split.R))}
                </p>
                <p className="mt-1">가중평균 = {fmt(split.w)}</p>
                <p className="mt-1 font-bold">분산 감소량 = {fmt(reduction)}</p>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
                <p>
                  <span className="font-bold text-amber-700 dark:text-amber-300">주황선</span> = 분산 감소량이 가장 큰
                  기준값 x = {BEST_T.t.toFixed(3)} (감소량 {fmt(BEST_T.red)})
                </p>
                <button
                  type="button"
                  onClick={() => setT(BEST_T.t)}
                  className="mt-2 rounded-md bg-amber-500 px-2 py-1 text-[11px] font-semibold text-white"
                >
                  이 기준값으로 이동
                </button>
              </div>
              <p className="leading-relaxed text-gray-500">
                두 영역의 선은 각 영역 y값의 평균. 회귀 트리의 첫 분할이 바로 이 기준값이 됨(⑹ 회귀 트리에서 확인).
              </p>
            </div>
          </div>
        </div>
      </Sourced>
    </section>
  );
}
