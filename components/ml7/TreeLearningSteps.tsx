"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle2 } from "lucide-react";
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
  type WashRow,
} from "./treeCore";

/* ─────────── 트리 모델과 배치 ─────────── */

interface GNode {
  key: string;
  rows: WashRow[];
  /** 부모에서 이 노드로 오는 가지 이름 */
  edge?: string;
  split?: { attr: WashAttr; children: GNode[] };
}

interface Placed {
  key: string;
  x: number;
  y: number;
  node: GNode;
  parent?: Placed;
}

const GROUP_W = 74;
const LEVEL_H = 150;

function widthOf(n: GNode): number {
  if (!n.split) return GROUP_W;
  return n.split.children.reduce((s, c) => s + widthOf(c), 0);
}

function place(n: GNode, left: number, level: number, parent?: Placed): Placed[] {
  const w = widthOf(n);
  const me: Placed = { key: n.key, x: left + w / 2, y: 34 + level * LEVEL_H, node: n, parent };
  if (!n.split) return [me];
  const out: Placed[] = [me];
  let cursor = left;
  for (const c of n.split.children) {
    out.push(...place(c, cursor, level + 1, me));
    cursor += widthOf(c);
  }
  return out;
}

function makeSplit(key: string, rows: WashRow[], attr: WashAttr): GNode["split"] {
  const spec = ATTRS[attr];
  return {
    attr,
    children: spec.branches
      .map((b) => ({ key: `${key}/${b}`, edge: b, rows: rows.filter((r) => spec.branchOf(r) === b) }))
      .filter((c) => c.rows.length > 0),
  };
}

/* ─────────── 단계 정의 ─────────── */

type Focus = "root" | "Rainy" | "Cloudy" | "Sunny" | "done";

interface Step {
  focus: Focus;
  title: string;
  body: string;
  /** 이 단계에서 속성을 고르는 노드와 후보 속성 */
  choose?: { rows: WashRow[]; candidates: WashAttr[] };
}

const byWeather = (w: string) => WASH_DATA.filter((r) => r.weather === w);

const STEPS: Step[] = [
  {
    focus: "root",
    title: "시작 — 루트 노드에는 데이터 전체",
    body: "분할이 이루어지기 전이므로 루트 노드에 할당된 데이터는 14개 전체. 최종적으로 결정해야 하는 ON/OFF를 클래스 레이블로 봄.",
  },
  {
    focus: "root",
    title: "루트 노드에 배정할 속성 선택 [Step 1]",
    body: "후보 속성마다 자식 노드로 데이터를 나눠 보고 지니 평가지수를 계산. 가장 작은 속성을 루트 노드에 배정. 후보를 눌러 분할 양상을 비교해 볼 수 있음.",
    choose: { rows: WASH_DATA, candidates: ["weather", "temperature", "amount"] },
  },
  {
    focus: "Rainy",
    title: "Rainy — 클래스 레이블이 모두 동일 → 리프 노드",
    body: "Weather가 Rainy인 자식 노드의 데이터 4개는 모두 OFF. 더 나눌 필요가 없으므로 이 노드는 리프 노드(OFF)가 됨.",
  },
  {
    focus: "Cloudy",
    title: "Cloudy — ON/OFF 혼재 → 다시 부모 노드로 두고 반복 [Step 2]",
    body: "Cloudy 노드의 5개(ON 2, OFF 3)를 부모 노드로 두고 같은 과정을 반복. Amount로 나누면 Large 2개, Small 3개가 각각 한 가지 레이블만 가져 둘 다 리프 노드가 됨.",
    choose: { rows: byWeather("Cloudy"), candidates: ["temperature", "amount", "humidity"] },
  },
  {
    focus: "Sunny",
    title: "Sunny — 같은 방식으로 속성 선택",
    body: "Sunny 노드의 5개(ON 3, OFF 2)도 적절한 속성을 선택해 자식 노드를 추가. 습도를 기준값 80으로 나누면 두 그룹 모두 레이블이 하나로 정리됨.",
    choose: { rows: byWeather("Sunny"), candidates: ["temperature", "amount", "humidity"] },
  },
  {
    focus: "done",
    title: "완성 — 모든 노드가 동일한 클래스 레이블을 가지는 리프 노드",
    body: "모든 노드가 리프 노드가 될 때까지 반복하면 그림 9-1의 트리가 완성됨. 온도(Temperature)는 어느 노드에도 배정되지 않음.",
  },
];

const ATTR_NAME: Record<WashAttr, string> = {
  weather: "Weather",
  temperature: "Temperature",
  amount: "Amount",
  humidity: "Humidity < 80",
};

function bestOf(rows: WashRow[], candidates: WashAttr[]): WashAttr {
  return candidates.reduce((best, a) =>
    evaluateSplit(rows, ATTRS[a]).giniCriterion < evaluateSplit(rows, ATTRS[best]).giniCriterion - 1e-12
      ? a
      : best,
  );
}

export default function TreeLearningSteps() {
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState<Record<number, WashAttr>>({});

  const cur = STEPS[step];
  const chosenAt = (i: number): WashAttr => {
    const s = STEPS[i];
    if (!s.choose) return "weather";
    return preview[i] ?? bestOf(s.choose.rows, s.choose.candidates);
  };
  const bestAt = (i: number): WashAttr => {
    const s = STEPS[i];
    return s.choose ? bestOf(s.choose.rows, s.choose.candidates) : "weather";
  };

  /** 현재 단계까지의 트리. 지난 단계는 최선의 속성으로 확정, 현재 단계는 미리보기 속성 */
  const tree = ((): GNode => {
    const root: GNode = { key: "R", rows: WASH_DATA };
    if (step === 0) return root;
    const rootAttr = step === 1 ? chosenAt(1) : bestAt(1);
    root.split = makeSplit("R", WASH_DATA, rootAttr);
    if (rootAttr !== "weather") return root;
    for (const child of root.split!.children) {
      if (child.edge === "Cloudy" && step >= 3) {
        child.split = makeSplit(child.key, child.rows, step === 3 ? chosenAt(3) : bestAt(3));
      }
      if (child.edge === "Sunny" && step >= 4) {
        child.split = makeSplit(child.key, child.rows, step === 4 ? chosenAt(4) : bestAt(4));
      }
    }
    return root;
  })();

  const placed = place(tree, 0, 0);
  const totalW = Math.max(widthOf(tree), GROUP_W * 3);
  const svgH = Math.max(...placed.map((p) => p.y + (p.node.split ? 20 : p.node.rows.length * 13 + 8)));

  const evals = useMemo(() => {
    if (!cur.choose) return [];
    return cur.choose.candidates.map((a) => evaluateSplit(cur.choose!.rows, ATTRS[a]));
  }, [cur]);

  const focusKey =
    cur.focus === "root" ? "R" : cur.focus === "done" ? "" : `R/${cur.focus}`;

  const leafCount = placed.filter((p) => !p.node.split).length;
  const pureLeafCount = placed.filter((p) => {
    if (p.node.split) return false;
    const c = countLabels(p.node.rows);
    return c.on === 0 || c.off === 0;
  }).length;

  const go = (d: number) => setStep((s) => Math.max(0, Math.min(STEPS.length - 1, s + d)));

  return (
    <section>
      <SectionTitle
        title="⑵ 결정 트리의 학습 과정"
        subtitle="루트 노드부터 속성 선택 → 속성값에 따라 가지 분할 → 자식 노드 추가를 반복"
      />

      <Sourced
        className="mb-6"
        refs={{
          textbook: "9.1.2 결정 트리의 학습",
          slides: "정리하기 — 결정 트리",
        }}
      >
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-gray-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-gray-300">
          결정 트리의 학습 과정은{" "}
          <strong>
            루트 노드부터 시작하여 각 노드에 적절한 속성을 선택하고, 그 속성값에 따라 기준을 정하여 가지로 나누고
            자식 노드를 추가하는 과정의 반복
          </strong>
          . 부모 노드의 속성이 정해지면 그 속성값에 따라 데이터가 그룹으로 나뉘어 각 자식 노드에 할당되고, 다음
          단계에서는 각 자식 노드를 다시 부모 노드로 두고 같은 과정을 반복. 어떤 자식 노드에 할당된 데이터의
          클래스 레이블이 <strong>모두 동일하면 리프 노드</strong>.
        </div>
      </Sourced>

      <Sourced
        refs={{
          textbook: "9.1.2 그림 9-2 결정 트리의 생성 과정의 예",
          slides: "결정 트리의 학습 — 학습 과정 [Step 1]·[Step 2]",
          lecture: "레이블이 모두 같은 Rainy는 끝, ON과 OFF가 섞인 Sunny·Cloudy는 추가 분할 대상이라고 노드별로 짚어 감",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          {/* 단계 표시 */}
          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            {STEPS.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => setStep(i)}
                aria-label={`${i + 1}단계`}
                className={`h-2 flex-1 min-w-[28px] rounded-full transition-colors ${
                  i <= step ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mb-4"
            >
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {step + 1} / {STEPS.length}
              </p>
              <h3 className="text-base font-bold">{cur.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{cur.body}</p>
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]">
            <div className="overflow-x-auto rounded-lg bg-gray-50 p-2 dark:bg-gray-800/40">
              <svg
                viewBox={`-10 0 ${totalW + 20} ${svgH}`}
                className="mx-auto"
                style={{ width: Math.max(360, totalW + 20), maxWidth: "100%", minWidth: 360 }}
                role="img"
                aria-label="결정 트리 생성 과정"
              >
                {placed.map((p) =>
                  p.parent ? (
                    <g key={`e-${p.key}`}>
                      <line
                        x1={p.parent.x}
                        y1={p.parent.y + 14}
                        x2={p.x}
                        y2={p.y - 22}
                        stroke="#94a3b8"
                        strokeWidth={1.5}
                      />
                      <text
                        x={(p.parent.x + p.x) / 2 + (p.x < p.parent.x ? -4 : p.x > p.parent.x ? 4 : 5)}
                        y={(p.parent.y + p.y) / 2 - 6}
                        textAnchor={p.x < p.parent.x ? "end" : "start"}
                        fontSize={11}
                        fontWeight={600}
                        className="fill-emerald-700 dark:fill-emerald-300"
                      >
                        {p.node.edge}
                      </text>
                    </g>
                  ) : null,
                )}
                {placed.map((p) => {
                  const c = countLabels(p.node.rows);
                  const isFocus = p.key === focusKey;
                  if (p.node.split) {
                    const label = ATTR_NAME[p.node.split.attr];
                    const w = label.length * 7 + 22;
                    return (
                      <g key={p.key}>
                        <rect
                          x={p.x - w / 2}
                          y={p.y - 14}
                          width={w}
                          height={28}
                          rx={14}
                          fill={isFocus ? "#d1fae5" : "#ecfdf5"}
                          stroke="#059669"
                          strokeWidth={isFocus ? 2.5 : 1.5}
                        />
                        <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#047857">
                          {label}
                        </text>
                      </g>
                    );
                  }
                  const pure = c.on === 0 || c.off === 0;
                  const h = p.node.rows.length * 13 + 26;
                  return (
                    <g key={p.key}>
                      <rect
                        x={p.x - 30}
                        y={p.y - 22}
                        width={60}
                        height={h}
                        rx={6}
                        fill={pure ? (c.on > 0 ? "#d1fae5" : "#ffe4e6") : "#f1f5f9"}
                        stroke={isFocus ? "#059669" : pure ? (c.on > 0 ? "#10b981" : "#fb7185") : "#cbd5e1"}
                        strokeWidth={isFocus ? 2.5 : 1.2}
                        strokeDasharray={pure ? undefined : "4 3"}
                      />
                      <text x={p.x} y={p.y - 9} textAnchor="middle" fontSize={9} className="fill-gray-500">
                        {pure ? "리프 노드" : `I = ${fmt(giniFromCounts([c.on, c.off]), 3)}`}
                      </text>
                      {p.node.rows.map((r, i) => (
                        <text
                          key={r.no}
                          x={p.x}
                          y={p.y + 5 + i * 13}
                          textAnchor="middle"
                          fontSize={10}
                          fontWeight={700}
                          fill={r.label === "ON" ? "#059669" : "#e11d48"}
                        >
                          {r.label}
                          <tspan fontSize={8} fontWeight={400} fill="#94a3b8">
                            {" "}#{r.no}
                          </tspan>
                        </text>
                      ))}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="space-y-3">
              {cur.choose ? (
                <div>
                  <p className="mb-2 text-xs font-semibold text-gray-500">
                    후보 속성별 지니 평가지수 (데이터 {cur.choose.rows.length}개 기준)
                  </p>
                  <div className="space-y-1.5">
                    {evals.map((e) => {
                      const selected = chosenAt(step) === e.attr.key;
                      const isBest = bestAt(step) === e.attr.key;
                      return (
                        <button
                          key={e.attr.key}
                          type="button"
                          onClick={() => setPreview((p) => ({ ...p, [step]: e.attr.key }))}
                          className={`w-full rounded-lg border p-2.5 text-left transition-colors ${
                            selected
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
                              : "border-gray-200 hover:border-emerald-300 dark:border-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold">{ATTR_NAME[e.attr.key]}</span>
                            <span className="font-mono text-sm">G = {fmt(e.giniCriterion)}</span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-gray-500">
                            {e.children.map((c) => `${c.branch}: ON ${c.count.on}·OFF ${c.count.off}`).join("  |  ")}
                          </p>
                          {isBest && (
                            <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 size={12} /> 최소 → 이 속성을 배정
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {step === 1 && (
                    <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
                      루트 후보는 교재 그림 9-3과 같이 범주형 세 속성. 계산 과정은 다음 섹션 계산기에서 확인.
                    </p>
                  )}
                  {step >= 3 && (
                    <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
                      습도는 연속한 값이므로 그림 9-1의 기준값 80으로 둘로 나눔(Humidity &lt; 80 → True/False).
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
                  <p>
                    리프 노드 {pureLeafCount}개 / 아직 분할이 필요한 노드 {leafCount - pureLeafCount}개
                  </p>
                  {step === 5 && (
                    <p className="mt-2">
                      사용된 속성: Weather → (Sunny) Humidity, (Cloudy) Amount. 학습 데이터 14개 모두 해당 리프에서
                      동일한 레이블.
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  disabled={step === 0}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-40 dark:border-gray-700"
                >
                  <ChevronLeft size={14} /> 이전
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  disabled={step === STEPS.length - 1}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"
                >
                  다음 <ChevronRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep(0);
                    setPreview({});
                  }}
                  aria-label="처음으로"
                  className="rounded-lg border border-gray-200 px-2.5 text-gray-500 dark:border-gray-700"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
              {cur.choose && chosenAt(step) !== bestAt(step) && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400">
                  미리보기 중. &lsquo;다음&rsquo;으로 넘어가면 지니 평가지수가 최소인 속성으로 확정됨.
                </p>
              )}
            </div>
          </div>
        </div>
      </Sourced>
    </section>
  );
}
