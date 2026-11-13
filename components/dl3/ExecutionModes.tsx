"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Scroller } from "@/components/dlShared/ui";
import { Code, Out, Pill, type CodeLine } from "@/components/dl3/ui3";

/**
 * 같은 한 줄 `c = a + b` 가 두 실행 모드에서 어떻게 다른 뜻이 되는지를
 * 같은 단계 위에 나란히 올려 비교한다.
 */

const STEPS = [
  { label: "① a, b 만들기" },
  { label: "② c = a + b" },
  { label: "③ print('c =', c)" },
  { label: "④ 값을 넣어 실행" },
];

/** 계산 그래프 그림 — 값이 비어 있으면 아직 데이터가 없는 상태 */
function GraphView({
  a,
  b,
  out,
}: {
  a: string | null;
  b: string | null;
  out: string | null;
}) {
  const box = (
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    value: string | null,
    tone: "node" | "op",
  ) => (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        className={
          tone === "op"
            ? "fill-amber-100 stroke-amber-500 dark:fill-amber-950/60"
            : value
              ? "fill-emerald-100 stroke-emerald-500 dark:fill-emerald-950/60"
              : "fill-gray-100 stroke-gray-300 dark:fill-gray-800 dark:stroke-gray-600"
        }
        strokeWidth={1.5}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 4}
        textAnchor="middle"
        className={`text-[11px] font-mono ${
          tone === "op"
            ? "fill-amber-800 dark:fill-amber-200"
            : value
              ? "fill-emerald-800 dark:fill-emerald-200"
              : "fill-gray-400 dark:fill-gray-500"
        }`}
      >
        {value ?? label}
      </text>
    </g>
  );

  return (
    <svg viewBox="0 0 330 150" className="h-auto w-full" role="img" aria-label="계산 그래프">
      {/* 간선 */}
      <path
        d="M 112 33 L 168 60"
        className="stroke-gray-400 dark:stroke-gray-500"
        strokeWidth={1.4}
        fill="none"
        markerEnd="url(#dl3-arrow)"
      />
      <path
        d="M 112 105 L 168 78"
        className="stroke-gray-400 dark:stroke-gray-500"
        strokeWidth={1.4}
        fill="none"
        markerEnd="url(#dl3-arrow)"
      />
      <path
        d="M 234 69 L 282 69"
        className="stroke-gray-400 dark:stroke-gray-500"
        strokeWidth={1.4}
        fill="none"
        markerEnd="url(#dl3-arrow)"
      />
      <defs>
        <marker id="dl3-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" className="fill-gray-400 dark:fill-gray-500" />
        </marker>
      </defs>

      {box(10, 16, 100, 34, "placeholder", a, "node")}
      <text x={60} y={62} textAnchor="middle" className="fill-gray-500 text-[10px] font-mono">
        a
      </text>
      {box(10, 88, 100, 34, "placeholder", b, "node")}
      <text x={60} y={134} textAnchor="middle" className="fill-gray-500 text-[10px] font-mono">
        b
      </text>
      {box(172, 52, 60, 34, "add", null, "op")}
      <text x={202} y={98} textAnchor="middle" className="fill-gray-500 text-[10px] font-mono">
        c
      </text>

      <AnimatePresence>
        {out && (
          <motion.text
            key={out}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            x={292}
            y={74}
            textAnchor="start"
            className="fill-rose-600 text-[13px] font-mono font-bold dark:fill-rose-400"
          >
            {out}
          </motion.text>
        )}
      </AnimatePresence>
    </svg>
  );
}

const LAZY_CODE: CodeLine[][] = [
  [
    { t: "import tensorflow.compat.v1 as tf" },
    { t: "tf.disable_v2_behavior()" },
    { t: "a = tf.placeholder(tf.float32)", mark: true },
    { t: "b = tf.placeholder(tf.float32)", mark: true },
  ],
  [
    { t: "a = tf.placeholder(tf.float32)", dim: true },
    { t: "b = tf.placeholder(tf.float32)", dim: true },
    { t: "c = a + b", mark: true },
  ],
  [{ t: "c = a + b", dim: true }, { t: "print('c =', c)", mark: true }],
  [
    { t: "with tf.Session() as sess:", mark: true },
    { t: "    result = sess.run(c, {a:2., b:3.})", mark: true },
    { t: "print('result =', result)" },
  ],
];

const EAGER_CODE: CodeLine[][] = [
  [
    { t: "import tensorflow as tf" },
    { t: "a = tf.constant(2.)", mark: true },
    { t: "b = tf.constant(3.)", mark: true },
  ],
  [
    { t: "a = tf.constant(2.)", dim: true },
    { t: "b = tf.constant(3.)", dim: true },
    { t: "c = a + b", mark: true },
  ],
  [{ t: "c = a + b", dim: true }, { t: "print('c =', c)", mark: true }],
  [{ t: "(할 일이 남지 않았다)", dim: true }],
];

const LAZY_SAY = [
  "값을 담을 자리(placeholder)만 그래프에 만든다. 아직 아무 값도 없다.",
  "덧셈을 지금 하라는 뜻이 아니다. a와 b를 더해 c를 얻는 add 노드를 그래프에 만드는 것이다.",
  "c는 계산된 값이 아니라 add 연산을 가리키는 이름이므로, 값 대신 그 노드가 출력된다.",
  "세션을 생성해 a에 2.0, b에 3.0을 전달하면 그제서야 add가 실행되어 5.0이 나온다.",
];

const EAGER_SAY = [
  "2.0과 3.0을 담은 상수 텐서가 곧바로 만들어진다.",
  "일반 파이썬 코드처럼 호출 즉시 덧셈이 실행되어 c에 5.0이 들어간다.",
  "c에는 이미 값이 들어 있으므로 값을 담은 텐서가 그대로 출력된다.",
  "따로 실행시킬 단계가 없다. ②에서 이미 계산이 끝났다.",
];

export default function ExecutionModes() {
  const [step, setStep] = useState(0);

  const lazyOut =
    step === 2
      ? 'c = Tensor("add:0", dtype=float32)'
      : step === 3
        ? "result = 5.0"
        : null;
  const eagerOut =
    step >= 2 ? "c = tf.Tensor(5.0, shape=(), dtype=float32)" : null;

  return (
    <section id="execution-modes" className="scroll-mt-32">
      <SectionTitle
        title="같은 한 줄, 다른 뜻 — 지연 실행과 즉시 실행"
        subtitle="c = a + b 를 두 실행 모드에 나란히 올려 놓고 단계를 따라가 봅니다"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "3. 텐서플로의 실행 모드 — 지연 실행(lazy execution) 모드 / 즉시 실행(eager execution) 모드",
            lecture: "c = a + b 가 지연 실행에서는 '더하라'가 아니라 '더하는 그래프를 만들라'는 뜻이라고 반복해 강조",
          }}
        >
          <Card>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="rounded-lg border border-gray-200 p-1.5 text-gray-500 disabled:opacity-30 dark:border-gray-700"
                aria-label="이전 단계"
              >
                <ChevronLeft size={14} />
              </button>
              <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                {STEPS.map((s, i) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setStep(i)}
                    aria-pressed={step === i}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      step === i
                        ? "border-amber-500 bg-amber-500 text-white"
                        : step > i
                          ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                          : "border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                disabled={step === STEPS.length - 1}
                className="rounded-lg border border-gray-200 p-1.5 text-gray-500 disabled:opacity-30 dark:border-gray-700"
                aria-label="다음 단계"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              {/* 지연 실행 */}
              <div className="min-w-0 rounded-xl border border-sky-200 bg-sky-50/40 p-3 dark:border-sky-900 dark:bg-sky-950/20">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-bold text-sky-800 dark:text-sky-200">
                    지연 실행(lazy execution) 모드
                  </span>
                  <Pill tone="sky">텐서플로 1.x</Pill>
                </div>
                <p className="mb-2 text-[11.5px] leading-5 text-sky-900/80 dark:text-sky-200/80">
                  정적 계산 그래프 형태로 모델을 구성 → 세션 생성 후 데이터를 전달하여 계산을 실행
                </p>
                <Code lines={LAZY_CODE[step]} caption="지연 실행 모드의 계산 그래프 구성·실행" />
                <div className="mt-2">
                  <GraphView
                    a={step === 3 ? "2.0" : null}
                    b={step === 3 ? "3.0" : null}
                    out={step === 3 ? "5.0" : null}
                  />
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`ls-${step}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="mt-1 text-[12px] leading-5 text-gray-700 dark:text-gray-200"
                  >
                    {LAZY_SAY[step]}
                  </motion.p>
                </AnimatePresence>
                {lazyOut && (
                  <div className="mt-2">
                    <Out>{lazyOut}</Out>
                  </div>
                )}
              </div>

              {/* 즉시 실행 */}
              <div className="min-w-0 rounded-xl border border-amber-200 bg-amber-50/40 p-3 dark:border-amber-900 dark:bg-amber-950/20">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-bold text-amber-800 dark:text-amber-200">
                    즉시 실행(eager execution) 모드
                  </span>
                  <Pill tone="amber">텐서플로 2.0부터 기본</Pill>
                </div>
                <p className="mb-2 text-[11.5px] leading-5 text-amber-900/80 dark:text-amber-200/80">
                  일반 파이썬 코드처럼 계산 작업이 호출 즉시 실행됨
                </p>
                <Code lines={EAGER_CODE[step]} caption="즉시 실행 모드의 프로그램" />
                <div className="mt-2">
                  <GraphView
                    a={step >= 0 ? "2.0" : null}
                    b={step >= 0 ? "3.0" : null}
                    out={step >= 1 ? "5.0" : null}
                  />
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`es-${step}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="mt-1 text-[12px] leading-5 text-gray-700 dark:text-gray-200"
                  >
                    {EAGER_SAY[step]}
                  </motion.p>
                </AnimatePresence>
                {eagerOut && (
                  <div className="mt-2">
                    <Out>{eagerOut}</Out>
                  </div>
                )}
              </div>
            </div>
            <Hint>
              두 모드의 그림은 같은 계산 구조를 나타냅니다. 다른 것은 <strong>값이 언제
              들어가는가</strong>뿐입니다. 지연 실행은 ④에서, 즉시 실행은 ①에서 들어갑니다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced refs={{ slides: "3. 텐서플로의 실행 모드 — 즉시 실행 모드의 장점과 단점" }}>
          <Card>
            <CardTitle>즉시 실행 모드의 장점과 단점</CardTitle>
            <Scroller>
              <div className="grid min-w-[300px] gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/30">
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <ThumbsUp size={13} className="text-green-600" />
                    <span className="text-[11px] font-bold text-green-700 dark:text-green-300">
                      장점
                    </span>
                  </div>
                  <ul className="list-disc space-y-1 pl-4 text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                    <li>지연 실행 모드에 비해 직관적인 코드를 작성할 수 있음</li>
                    <li>모델의 테스트가 용이함</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 dark:border-rose-900 dark:bg-rose-950/30">
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <ThumbsDown size={13} className="text-rose-500" />
                    <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300">
                      단점
                    </span>
                  </div>
                  <ul className="list-disc space-y-1 pl-4 text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                    <li>
                      명령 단위로 텐서플로 연산을 실행하여 결과를 파이썬으로 가져오는 과정을
                      반복하므로 프로그램 실행이 느림
                    </li>
                  </ul>
                </div>
              </div>
            </Scroller>
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-[12px] font-semibold leading-5 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              → 성능 향상을 위해 <strong>그래프 실행(graph execution) 모드</strong>도 제공함. 이
              모드는 아래 &lsquo;반복되는 계산을 빠르게&rsquo;에서 다시 다룹니다.
            </p>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
