"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Rewind } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Scroller } from "@/components/dlShared/ui";
import { Code, F, Out, Pill, r2 } from "@/components/dl3/ui3";

/**
 * 강의록 3-4[1] 자동 미분 예제를 단계로 따라간다.
 * y = (x1 + 2x2)^2 를 x1 = 3, x2 = 1 에서 편미분 → dy/dx1 = 10.0, dy/dx2 = 20.0
 */

const STAGES = [
  { k: "문맥 생성", line: "with tf.GradientTape() as t:" },
  { k: "추적 대상 지정", line: "    t.watch(x2)" },
  { k: "정방향 진행 기록", line: "    y = (x1 + 2 * x2) ** 2" },
  { k: "테이프 되감기", line: "dy_dx = t.gradient(y, [x1, x2])" },
  { k: "결과", line: "print(dy_dx[0], dy_dx[1])" },
];

/** 노드 상자 */
function Node({
  x,
  y,
  w,
  label,
  sub,
  tone,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  sub?: string;
  tone: "var" | "op" | "out" | "off";
}) {
  const fill =
    tone === "off"
      ? "fill-gray-100 stroke-gray-300 dark:fill-gray-800 dark:stroke-gray-700"
      : tone === "var"
        ? "fill-emerald-100 stroke-emerald-500 dark:fill-emerald-950/70"
        : tone === "op"
          ? "fill-amber-100 stroke-amber-500 dark:fill-amber-950/70"
          : "fill-sky-100 stroke-sky-500 dark:fill-sky-950/70";
  const text =
    tone === "off"
      ? "fill-gray-400 dark:fill-gray-600"
      : tone === "var"
        ? "fill-emerald-800 dark:fill-emerald-200"
        : tone === "op"
          ? "fill-amber-800 dark:fill-amber-200"
          : "fill-sky-800 dark:fill-sky-200";
  return (
    <g>
      <rect x={r2(x)} y={r2(y)} width={w} height={30} rx={6} className={fill} strokeWidth={1.5} />
      <text
        x={r2(x + w / 2)}
        y={r2(y + (sub ? 13 : 19))}
        textAnchor="middle"
        className={`text-[11px] font-mono font-semibold ${text}`}
      >
        {label}
      </text>
      {sub && (
        <text
          x={r2(x + w / 2)}
          y={r2(y + 24)}
          textAnchor="middle"
          className={`text-[9.5px] font-mono ${text}`}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function Edge({
  d,
  back,
  dim,
}: {
  d: string;
  back?: boolean;
  dim?: boolean;
}) {
  return (
    <path
      d={d}
      fill="none"
      strokeWidth={back ? 2 : 1.4}
      className={
        dim
          ? "stroke-gray-200 dark:stroke-gray-800"
          : back
            ? "stroke-rose-500"
            : "stroke-gray-400 dark:stroke-gray-500"
      }
      markerEnd={back ? "url(#dl3-back)" : "url(#dl3-fwd)"}
    />
  );
}

export default function AutoDiffTape() {
  const [stage, setStage] = useState(0);
  const [watched, setWatched] = useState(true);

  const fwd = stage >= 2;
  const back = stage >= 3;
  const x2Live = watched; // trainable=False 이므로 watch 해야만 추적된다
  const dyDx2 = x2Live ? "20.0" : "None";

  return (
    <section id="autodiff-tape" className="scroll-mt-32">
      <SectionTitle
        title="자동 미분 — 테이프에 녹음하고, 되감으며 미분한다"
        subtitle="y = (x₁ + 2x₂)² 을 x₁ = 3, x₂ = 1 에서 편미분하는 과정을 한 걸음씩"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "1. 텐서플로의 자동 미분 — tf.GradientTape API를 이용한 자동 미분",
            lecture: "정방향 진행을 '테이프에 녹음'하고 미분할 때 '테이프를 되감기'한다고 비유",
          }}
        >
          <Card>
            <CardTitle>tf.GradientTape가 하는 일</CardTitle>
            <ol className="mb-3 space-y-1.5 text-[12.5px] leading-5 text-gray-700 dark:text-gray-200">
              <li>
                <strong>① tf.GradientTape 문맥 생성</strong>
              </li>
              <li>
                <strong>② 정방향 진행(forward pass)의 연산을 &lsquo;테이프&rsquo;에 기록</strong> —
                테이프의 <code className="font-mono">watch</code> 메소드로 추적할 텐서를 지정
              </li>
              <li>
                <strong>③ &lsquo;테이프&rsquo;를 &lsquo;되감기&rsquo;하며 미분 계산</strong> —{" "}
                <code className="font-mono">gradient</code> 메소드 사용
              </li>
            </ol>
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-[12px] leading-5 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
              변수 텐서는 <code className="font-mono">trainable</code> 속성의 기본값이 True이므로
              기본적으로 추적 대상이며, 별도로 추적 대상으로 지정할 필요가 없다.
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "2. 자동 미분 계산 예 — y = (x₁ + 2x₂)² 의 편미분",
            lecture: "손으로 편미분하면 2(x₁+2x₂)와 4(x₁+2x₂)라 각각 10과 20이 나와야 맞다고 먼저 계산해 보임",
          }}
        >
          <Card>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setStage((s) => Math.min(STAGES.length - 1, s + 1))}
                disabled={stage === STAGES.length - 1}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-[11.5px] font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-40"
              >
                {stage >= 2 ? <Rewind size={12} /> : <Play size={12} />}
                다음 단계
              </button>
              <button
                type="button"
                onClick={() => setStage(0)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-[11.5px] font-semibold text-gray-500 dark:border-gray-700"
              >
                <RotateCcw size={12} />
                처음부터
              </button>
              <label className="ml-auto inline-flex cursor-pointer items-center gap-2 text-[11.5px] font-semibold text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={watched}
                  onChange={(e) => setWatched(e.target.checked)}
                  className="h-3.5 w-3.5 accent-amber-500"
                />
                t.watch(x2) 적용
              </label>
            </div>

            <div className="mb-3 flex flex-wrap gap-1.5">
              {STAGES.map((s, i) => (
                <button
                  key={s.k}
                  type="button"
                  onClick={() => setStage(i)}
                  aria-pressed={stage === i}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    stage === i
                      ? "border-amber-500 bg-amber-500 text-white"
                      : stage > i
                        ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                        : "border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900"
                  }`}
                >
                  {i + 1}. {s.k}
                </button>
              ))}
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.25fr_1fr]">
              <div className="min-w-0">
                <Scroller>
                  <svg
                    viewBox="0 0 400 175"
                    className="h-auto w-full min-w-[300px]"
                    role="img"
                    aria-label="자동 미분 계산 그래프"
                  >
                    <defs>
                      <marker id="dl3-fwd" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
                        <path d="M0,0 L6,3 L0,6 z" className="fill-gray-400 dark:fill-gray-500" />
                      </marker>
                      <marker id="dl3-back" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
                        <path d="M0,0 L6,3 L0,6 z" className="fill-rose-500" />
                      </marker>
                    </defs>

                    {/* 정방향 간선 */}
                    <Edge d="M 74 43 L 188 70" dim={!fwd} />
                    <Edge d="M 74 121 L 102 121" dim={!fwd || !x2Live} />
                    <Edge d="M 156 121 L 188 84" dim={!fwd || !x2Live} />
                    <Edge d="M 236 75 L 260 75" dim={!fwd} />
                    <Edge d="M 308 75 L 332 75" dim={!fwd} />

                    {/* 되감기 간선 */}
                    {back && (
                      <>
                        <Edge d="M 332 92 L 310 92" back />
                        <Edge d="M 260 92 L 238 92" back />
                        <Edge d="M 186 92 L 76 60" back />
                        {x2Live && (
                          <>
                            <Edge d="M 186 98 L 158 134" back />
                            <Edge d="M 100 138 L 76 138" back />
                          </>
                        )}
                      </>
                    )}

                    <Node
                      x={16}
                      y={28}
                      w={58}
                      label="x₁ = 3."
                      sub={stage >= 1 ? "trainable=True" : undefined}
                      tone="var"
                    />
                    <Node
                      x={16}
                      y={106}
                      w={58}
                      label="x₂ = 1."
                      sub={stage >= 1 ? (x2Live ? "watch 지정" : "추적 안 함") : undefined}
                      tone={stage >= 1 && !x2Live ? "off" : "var"}
                    />
                    <Node x={102} y={106} w={54} label="× 2" tone={stage >= 1 && !x2Live ? "off" : "op"} />
                    <Node x={188} y={60} w={48} label="+" tone="op" />
                    <Node x={260} y={60} w={48} label="( )²" tone="op" />
                    <Node x={332} y={60} w={52} label="y" tone="out" />

                    {/* 정방향 값 */}
                    {fwd && (
                      <>
                        <motion.text
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          x={126}
                          y={46}
                          className="fill-emerald-600 text-[10px] font-mono font-bold dark:fill-emerald-400"
                        >
                          3.
                        </motion.text>
                        {x2Live && (
                          <motion.text
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            x={160}
                            y={112}
                            className="fill-emerald-600 text-[10px] font-mono font-bold dark:fill-emerald-400"
                          >
                            2.
                          </motion.text>
                        )}
                        <motion.text
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          x={240}
                          y={70}
                          className="fill-emerald-600 text-[10px] font-mono font-bold dark:fill-emerald-400"
                        >
                          5.
                        </motion.text>
                        <motion.text
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          x={310}
                          y={70}
                          className="fill-emerald-600 text-[10px] font-mono font-bold dark:fill-emerald-400"
                        >
                          25.
                        </motion.text>
                      </>
                    )}

                    {/* 되감기 기울기 */}
                    {back && (
                      <>
                        <motion.text
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          x={306}
                          y={106}
                          textAnchor="middle"
                          className="fill-rose-500 text-[10px] font-mono font-bold"
                        >
                          ∂y/∂y = 1
                        </motion.text>
                        <motion.text
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.12 }}
                          x={236}
                          y={106}
                          textAnchor="middle"
                          className="fill-rose-500 text-[10px] font-mono font-bold"
                        >
                          2u = 10
                        </motion.text>
                        <motion.text
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.24 }}
                          x={118}
                          y={66}
                          textAnchor="middle"
                          className="fill-rose-500 text-[10px] font-mono font-bold"
                        >
                          ×1 → 10
                        </motion.text>
                        {x2Live && (
                          <motion.text
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.24 }}
                            x={110}
                            y={158}
                            textAnchor="middle"
                            className="fill-rose-500 text-[10px] font-mono font-bold"
                          >
                            ×2 → 20
                          </motion.text>
                        )}
                      </>
                    )}
                  </svg>
                </Scroller>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-[10.5px] text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block h-0.5 w-5 bg-gray-400" />
                    정방향 진행(기록)
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block h-0.5 w-5 bg-rose-500" />
                    되감기(미분)
                  </span>
                </div>
              </div>

              <div className="min-w-0 space-y-2">
                <Code
                  caption="강의록 예제의 핵심 줄"
                  lines={[
                    { t: "x1 = tf.Variable(3.)" },
                    { t: "x2 = tf.Variable(1., trainable=False)" },
                    ...STAGES.map((s, i) => ({
                      t: s.line,
                      mark: i === stage,
                      dim: i === 1 && !watched,
                    })),
                  ]}
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${stage}-${watched}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.16 }}
                    className="rounded-lg bg-gray-50 p-3 text-[12px] leading-5 text-gray-700 dark:bg-gray-800/60 dark:text-gray-200"
                  >
                    {stage === 0 && "미분을 기록할 테이프를 연다. 이 문맥 안에서 일어나는 연산이 테이프에 남는다."}
                    {stage === 1 &&
                      (watched
                        ? "x₂는 trainable=False라 그대로는 추적되지 않는다. watch로 명시해야 편미분에 참여한다. x₁은 trainable 기본값이 True이므로 지정하지 않아도 추적된다."
                        : "watch를 빼 보았다. x₂는 trainable=False이므로 추적 대상에서 빠지고, 되감기에도 참여하지 않는다.")}
                    {stage === 2 &&
                      "정방향 진행이다. 2×x₂ = 2, 3 + 2 = 5, 5² = 25 가 차례로 계산되면서 어떤 연산을 거쳤는지가 테이프에 쌓인다."}
                    {stage === 3 &&
                      "이제 거꾸로 간다. 출력 쪽에서 시작해 각 연산의 기울기를 곱해 가며 입력까지 내려온다. 제곱에서 2u = 10, 덧셈은 그대로 전달, 2를 곱한 자리에서는 2배가 된다."}
                    {stage === 4 &&
                      (watched
                        ? "손으로 푼 편미분 2(x₁+2x₂) = 10, 4(x₁+2x₂) = 20 과 같은 값이 나왔다. 수식을 따로 세우지 않고 얻은 결과다."
                        : "x₂를 추적하지 않았으므로 x₂에 대한 편미분은 구해지지 않는다.")}
                  </motion.div>
                </AnimatePresence>

                {stage >= 3 && (
                  <Out>{`dy/dx1 = 10.0\ndy/dx2 = ${dyDx2}`}</Out>
                )}
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <F note="x₁에 대한 편미분 — x₂는 상수로 본다">∂y/∂x₁ = 2(x₁ + 2x₂) = 2 × 5 = 10</F>
              <F note="x₂에 대한 편미분 — 안쪽의 2가 한 번 더 곱해진다">
                ∂y/∂x₂ = 2(x₁ + 2x₂) × 2 = 20
              </F>
            </div>
            <Hint>
              핵심은 &lsquo;수식을 직접 풀지 않았다&rsquo;는 점입니다. 테이프에 남은 연산 순서를
              거꾸로 훑으며 각 연산의 기울기를 곱해 가면 편미분이 나옵니다. 이것이 다음 블록의 선형
              회귀 학습을 그대로 떠받칩니다.
            </Hint>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone="green">x₁: 변수 텐서 + trainable=True → 자동 추적</Pill>
              <Pill tone="rose">x₂: trainable=False → watch 필요</Pill>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
