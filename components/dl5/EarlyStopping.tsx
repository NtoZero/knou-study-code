"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Slider, ComputedNote, Scroller, Tag, fmt, q12 } from "@/components/dlShared/ui";

const EPOCHS = 50;

interface Ep {
  e: number;
  train: number;
  val: number;
}

/** 훈련 손실은 계속 감소, 검증 손실은 최저점을 지나 다시 증가하는 전형적인 곡선 */
const SERIES: Ep[] = Array.from({ length: EPOCHS }, (_, i) => {
  const e = i + 1;
  const train = q12(0.06 + 1.05 / (1 + 0.62 * e));
  const val = q12(0.09 + 1.0 / (1 + 0.6 * e) + 0.0004 * Math.pow(e, 1.8) + 0.004 * Math.sin(e * 1.7));
  return { e, train, val };
});

const BEST = SERIES.reduce((acc, cur) => (cur.val < acc.val ? cur : acc), SERIES[0]);

/** 보기 ①~④ — ③이 검증 손실의 최저점 */
const CANDIDATES = [4, 9, BEST.e, 36].sort((a, b) => a - b);
const ANSWER_INDEX = CANDIDATES.indexOf(BEST.e);

const FEEDBACK: Record<"early" | "answer" | "late", string> = {
  early:
    "아직 이릅니다. 훈련용 집합과 검증용 집합의 손실이 둘 다 감소하는 중이므로, 여기서 멈추면 더 좋아질 수 있는 모델을 버리게 됩니다.",
  answer:
    "맞습니다. 훈련용 집합에 대한 손실은 감소하고 있지만 검증용 집합에 대한 손실이 증가하기 시작했다면 과적합이 진행되는 것을 예상할 수 있습니다.",
  late: "너무 늦습니다. 검증용 집합의 손실이 이미 한참 전부터 증가하고 있으므로, 그 사이에 과적합이 진행된 상태입니다.",
};

/** min_delta·patience를 적용했을 때 실제로 멈추는 에폭 */
function simulate(minDelta: number, patience: number) {
  let best = Infinity;
  let bestEpoch = SERIES[0].e;
  let wait = 0;
  for (const p of SERIES) {
    if (p.val < best - minDelta) {
      best = p.val;
      bestEpoch = p.e;
      wait = 0;
    } else {
      wait += 1;
      if (wait >= patience) return { stopped: p.e, bestEpoch, best };
    }
  }
  return { stopped: null as number | null, bestEpoch, best };
}

function r2(v: number) {
  return Math.round(v * 100) / 100;
}

export default function EarlyStopping() {
  const [picked, setPicked] = useState<number | null>(null);
  const [patience, setPatience] = useState(10);
  const [minDelta, setMinDelta] = useState(0.001);
  const [restore, setRestore] = useState(true);

  const sim = useMemo(() => simulate(minDelta, patience), [minDelta, patience]);

  const VIEW_W = 420;
  const VIEW_H = 220;
  const maxLoss = 0.8;
  const px = (e: number) => r2(36 + ((e - 1) / (EPOCHS - 1)) * (VIEW_W - 52));
  const py = (v: number) => r2(14 + (1 - Math.min(v, maxLoss) / maxLoss) * (VIEW_H - 44));
  const line = (key: "train" | "val") =>
    SERIES.map((p, i) => `${i === 0 ? "M" : "L"}${px(p.e)},${py(p[key])}`).join(" ");

  const verdict =
    picked === null ? null : picked === ANSWER_INDEX ? "answer" : picked < ANSWER_INDEX ? "early" : "late";

  return (
    <section id="early-stopping" className="scroll-mt-32">
      <SectionTitle
        title="훈련의 조기 종료(early stopping)"
        subtitle="검증용 집합의 손실이 돌아서는 지점에서 학습을 멈춘다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            slides: "조기 종료 — 집합의 분할",
          }}
        >
          <Card>
            <CardTitle>전체 학습 데이터 집합을 나눈다</CardTitle>
            <Scroller>
              <svg
                viewBox="0 0 400 150"
                className="h-auto w-full min-w-[320px]"
                role="img"
                aria-label="전체 학습 데이터 집합이 훈련용 집합과 검증용 집합으로 나뉘는 그림"
              >
                <rect x="60" y="10" width="280" height="42" rx="4" className="fill-white dark:fill-gray-950" stroke="#64748b" strokeWidth="1.4" />
                <line x1="258" y1="10" x2="258" y2="52" stroke="#dc2626" strokeWidth="1.4" strokeDasharray="4 3" />
                <text x="200" y="36" textAnchor="middle" className="fill-gray-700 text-[12px] font-bold dark:fill-gray-100">
                  전체 학습 데이터 집합
                </text>
                <line x1="160" y1="52" x2="118" y2="92" stroke="#dc2626" strokeWidth="1.2" markerEnd="url(#dl5-es-ar)" />
                <line x1="280" y1="52" x2="306" y2="92" stroke="#dc2626" strokeWidth="1.2" markerEnd="url(#dl5-es-ar)" />
                <defs>
                  <marker id="dl5-es-ar" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
                    <path d="M0,0 L7,3 L0,6 z" fill="#dc2626" />
                  </marker>
                </defs>
                <rect x="24" y="96" width="180" height="42" rx="4" className="fill-white dark:fill-gray-950" stroke="#64748b" strokeWidth="1.4" />
                <text x="114" y="122" textAnchor="middle" className="fill-gray-700 text-[12px] font-bold dark:fill-gray-100">
                  훈련용 집합
                </text>
                <rect x="252" y="96" width="112" height="42" rx="4" className="fill-white dark:fill-gray-950" stroke="#64748b" strokeWidth="1.4" />
                <text x="308" y="122" textAnchor="middle" className="fill-gray-700 text-[12px] font-bold dark:fill-gray-100">
                  검증용 집합
                </text>
              </svg>
            </Scroller>
            <Hint>
              훈련용 집합으로 파라미터를 업데이트하면서, 중간중간 검증용 집합의 손실을 계속 모니터링한다. 최종
              성능 평가는 이와 별도로 마련한 테스트용 집합으로 한다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "조기 종료 지점",
            lecture: "검증 손실이 돌아서면 중단",
          }}
        >
          <Card>
            <CardTitle>조기 종료 지점을 직접 집어 보기</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              아래 네 지점 ①~④ 가운데 적절한 조기 종료 시점을 하나 골라 보세요.
            </p>

            <Scroller>
              <svg
                viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                className="h-auto w-full min-w-[360px]"
                role="img"
                aria-label="에폭에 따른 훈련용 집합과 검증용 집합의 손실 곡선, 그리고 네 개의 후보 지점"
              >
                <line x1="36" y1={VIEW_H - 30} x2={VIEW_W - 14} y2={VIEW_H - 30} stroke="#cbd5e1" strokeWidth="1" />
                <line x1="36" y1="12" x2="36" y2={VIEW_H - 30} stroke="#cbd5e1" strokeWidth="1" />
                <text x="4" y="20" className="fill-gray-400 text-[9px]">
                  손실
                </text>
                <text x={VIEW_W - 36} y={VIEW_H - 12} className="fill-gray-400 text-[9px]">
                  에폭
                </text>

                <path d={line("val")} fill="none" stroke="#f97316" strokeWidth="2.2" />
                <path d={line("train")} fill="none" stroke="#2563eb" strokeWidth="2.2" />
                <text x={px(42)} y={py(SERIES[41].val) - 8} className="fill-orange-500 text-[9.5px] font-bold">
                  검증용 집합
                </text>
                <text x={px(34)} y={py(SERIES[33].train) + 16} className="fill-blue-600 text-[9.5px] font-bold">
                  훈련용 집합
                </text>

                {CANDIDATES.map((e, i) => {
                  const p = SERIES[e - 1];
                  const on = picked === i;
                  const right = picked !== null && i === ANSWER_INDEX;
                  return (
                    <g key={e} onClick={() => setPicked(i)} className="cursor-pointer">
                      <line
                        x1={px(e)}
                        y1="12"
                        x2={px(e)}
                        y2={VIEW_H - 30}
                        stroke={right ? "#16a34a" : on ? "#8b5cf6" : "#cbd5e1"}
                        strokeWidth={on || right ? 1.6 : 1}
                        strokeDasharray="4 3"
                      />
                      <circle
                        cx={px(e)}
                        cy={py(p.val)}
                        r="11"
                        fill={right ? "#16a34a" : on ? "#8b5cf6" : "#ffffff"}
                        stroke={right ? "#16a34a" : on ? "#8b5cf6" : "#94a3b8"}
                        strokeWidth="1.6"
                      />
                      <text
                        x={px(e)}
                        y={py(p.val) + 4}
                        textAnchor="middle"
                        className="text-[11px] font-bold"
                        fill={right || on ? "#ffffff" : "#475569"}
                      >
                        {String.fromCharCode(9312 + i)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </Scroller>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {CANDIDATES.map((e, i) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setPicked(i)}
                  aria-pressed={picked === i}
                  className={`rounded-full border px-3 py-1 text-[11.5px] font-semibold transition-colors ${
                    picked === i
                      ? "border-violet-600 bg-violet-600 text-white"
                      : "border-gray-200 bg-white text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  }`}
                >
                  {String.fromCharCode(9312 + i)} 에폭 {e}
                </button>
              ))}
            </div>

            {verdict && (
              <div
                className={`mt-3 rounded-lg p-3 text-[12.5px] leading-6 ${
                  verdict === "answer"
                    ? "bg-green-50 text-green-800 dark:bg-green-900/25 dark:text-green-200"
                    : "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
                }`}
              >
                <b>{String.fromCharCode(9312 + (picked ?? 0))}</b> — {FEEDBACK[verdict]}
                {verdict !== "answer" && (
                  <span className="mt-1 block text-[11.5px] opacity-80">
                    적절한 지점은 검증용 집합의 손실이 가장 낮은 에폭 {BEST.e}입니다.
                  </span>
                )}
              </div>
            )}

            <ComputedNote>
              곡선의 수치와 후보 지점의 에폭은 이 페이지에서 정한 예시임. 강의록 그림에는 눈금이 없음.
            </ComputedNote>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "Keras에서 조기 종료",
            lecture: "patience는 '참는 것'",
          }}
        >
          <Card>
            <CardTitle>EarlyStopping 파라미터를 바꾸면 언제 멈추는가</CardTitle>

            <div className="grid gap-3 sm:grid-cols-2">
              <Slider
                label={<span>patience</span>}
                value={patience}
                min={1}
                max={25}
                step={1}
                onChange={setPatience}
                display={patience}
              />
              <Slider
                label={<span>min_delta</span>}
                value={minDelta}
                min={0}
                max={0.02}
                step={0.001}
                onChange={setMinDelta}
                display={fmt(minDelta, 3)}
              />
            </div>

            <label className="mt-3 flex items-center gap-2 text-[12px] font-semibold text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={restore}
                onChange={(e) => setRestore(e.target.checked)}
                className="h-3.5 w-3.5 accent-violet-600"
              />
              restore_best_weights
            </label>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                <p className="text-[10.5px] font-bold text-gray-500">멈추는 에폭</p>
                <p className="mt-0.5 text-lg font-bold text-violet-600 dark:text-violet-400">
                  {sim.stopped ?? "—"}
                </p>
                <p className="text-[10.5px] text-gray-500">{sim.stopped ? "조기 종료" : `${EPOCHS}에폭 모두 실행`}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                <p className="text-[10.5px] font-bold text-gray-500">가장 좋았던 에폭</p>
                <p className="mt-0.5 text-lg font-bold text-emerald-600 dark:text-emerald-400">{sim.bestEpoch}</p>
                <p className="text-[10.5px] text-gray-500">검증 손실 {fmt(sim.best, 4)}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                <p className="text-[10.5px] font-bold text-gray-500">남는 가중치</p>
                <p className="mt-0.5 text-lg font-bold text-gray-800 dark:text-gray-100">
                  {restore ? `에폭 ${sim.bestEpoch}` : `에폭 ${sim.stopped ?? EPOCHS}`}
                </p>
                <p className="text-[10.5px] text-gray-500">
                  {restore ? "가장 좋았던 가중치로 복구" : "중단 시점의 가중치 그대로"}
                </p>
              </div>
            </div>

            <ul className="mt-3 space-y-1.5 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              <li>
                <Tag>monitor</Tag> 어떤 값을 보고 조기 종료를 결정할지. <code>&apos;val_loss&apos;</code>는 검증용
                데이터에 대한 손실.
              </li>
              <li>
                <Tag>min_delta</Tag> 최소한 이만큼은 개선되어야 &lsquo;나아졌다&rsquo;고 본다. 0이면 변화가 전혀 없을
                때를 뜻함.
              </li>
              <li>
                <Tag>patience</Tag> 개선이 없는 에폭이 이만큼 이어지면 멈춤. 중간에 개선되면 다시 0에서 센다.
              </li>
              <li>
                <Tag>mode</Tag> <code>&apos;auto&apos;</code>면 손실은 감소를, 정확도는 증가를 개선으로 자동 판단.
              </li>
              <li>
                <Tag>restore_best_weights</Tag> True면 멈출 때 가장 좋았던 시점의 가중치로 복구.
              </li>
            </ul>

            <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11.5px] leading-5 text-gray-100">
{`from tensorflow.keras import callbacks
early_stop = callbacks.EarlyStopping(monitor='val_loss',
                                     min_delta=0.001,
                                     patience=10,
                                     mode='auto',
                                     restore_best_weights=True)

model.fit(tr_data, tr_labels, epochs=1000,
          callbacks=[early_stop])`}
            </pre>

            <ComputedNote>
              멈추는 에폭은 위 예시 곡선에 EarlyStopping의 판정 규칙을 적용해 이 페이지에서 계산한 값임.
            </ComputedNote>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
