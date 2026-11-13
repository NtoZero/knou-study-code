"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Cpu, Network, AlertTriangle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Scroller } from "@/components/dlShared/ui";
import { Code, Pill, Tab3, type CodeLine } from "@/components/dl3/ui3";

/**
 * 같은 train_step 함수를 세 가지 방식으로 놓고 비교한다.
 * 달라지는 것은 한 줄뿐이라는 점을 코드 강조로 보인다.
 */

const BODY: CodeLine[] = [
  { t: "def train_step(x, y):" },
  { t: "    with tf.GradientTape() as t:" },
  { t: "        y_hat = w * x + b" },
  { t: "        loss = (y_hat - y) ** 2" },
  { t: "    grads = t.gradient(loss, [w, b])" },
  { t: "    w.assign_sub(learning_rate * grads[0])" },
  { t: "    b.assign_sub(learning_rate * grads[1])" },
];

const WAYS = [
  {
    key: "eager",
    title: "그대로 둔다",
    desc: "즉시 실행 모드",
    def: BODY,
    loop: [
      { t: "for i in range(epochs):" },
      { t: "    for k in range(len(y)):" },
      { t: "        train_step(x[k], y[k])" },
    ] as CodeLine[],
    say: "앞 블록에서 쓴 그대로입니다. 명령 단위로 연산을 실행하고 결과를 파이썬으로 가져오는 과정을 4000번 반복하게 됩니다.",
    mode: "즉시 실행",
  },
  {
    key: "call",
    title: "tf.function을 직접 호출",
    desc: "함수를 인수로 넘긴다",
    def: BODY,
    loop: [
      { t: "train_step_graph = tf.function(train_step)", mark: true },
      { t: "for i in range(epochs):" },
      { t: "    for k in range(len(y)):" },
      { t: "        train_step_graph(x[k], y[k])", mark: true },
    ] as CodeLine[],
    say: "일반적인 파이썬 함수를 인수로 전달하여 tf.function을 호출합니다. 파이썬이 호출할 수 있는 함수로 변환하여 돌려주면 이 함수를 원래 함수를 사용하듯 사용합니다.",
    mode: "그래프 실행",
  },
  {
    key: "deco",
    title: "@tf.function 수식어",
    desc: "정의할 때 붙인다",
    def: [{ t: "@tf.function", mark: true }, ...BODY] as CodeLine[],
    loop: [
      { t: "for i in range(epochs):" },
      { t: "    for k in range(len(y)):" },
      { t: "        train_step(x[k], y[k])" },
    ] as CodeLine[],
    say: "그래프 실행 모드로 변환하려는 함수를 '@tf.function'으로 수식합니다. 호출하는 쪽은 그대로 두어도 됩니다.",
    mode: "그래프 실행",
  },
] as const;

const BENEFITS = [
  {
    icon: Zap,
    t: "빠른 계산",
    d: "사용 가능한 하드웨어에서 효율적으로 실행되도록 최적화하여 컴파일되므로 빠른 계산을 할 수 있음",
  },
  { icon: Network, t: "병렬처리 활용", d: "그래프에서 동시에 처리할 수 있는 부분을 병렬로 실행" },
  {
    icon: Cpu,
    t: "파이썬이 없어도",
    d: "파이썬 인터프리터가 없는 장치에서도 사용할 수 있음",
  },
];

export default function GraphModeFunction() {
  const [way, setWay] = useState(0);
  const [calls, setCalls] = useState(0);
  const w = WAYS[way];

  return (
    <section id="graph-mode" className="scroll-mt-32">
      <SectionTitle
        title="반복되는 계산을 빠르게 — 그래프 실행 모드"
        subtitle="훈련은 같은 수식을 수천 번 되풀이합니다. 그때 한 줄로 모드를 바꿉니다"
      />

      <div className="space-y-4">
        <Sourced refs={{ slides: "4. 그래프 실행 모드의 활용 — 그래프 실행 모드 / 텐서플로 그래프 실행의 장점" }}>
          <Card>
            <CardTitle>그래프 실행(graph execution) 모드</CardTitle>
            <p className="mb-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              텐서플로 그래프(<code className="font-mono">tf.Graph</code>)를 실행하는 방식.
              <code className="font-mono"> tf.Graph</code> 는{" "}
              <strong>데이터 흐름 형태로 표현되는 계산 구조</strong>이다.
            </p>
            <Scroller>
              <div className="grid min-w-[300px] gap-2 sm:grid-cols-3">
                {BENEFITS.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={b.t}
                      className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900 dark:bg-amber-950/30"
                    >
                      <div className="mb-1 flex items-center gap-1.5">
                        <Icon size={13} className="text-amber-500" />
                        <span className="text-[11.5px] font-bold text-amber-800 dark:text-amber-200">
                          {b.t}
                        </span>
                      </div>
                      <p className="text-[11.5px] leading-5 text-amber-900/90 dark:text-amber-100/90">
                        {b.d}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Scroller>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "4. 그래프 실행 모드의 활용 — tf.function을 직접 호출하는 방법 / 수식어로 사용하는 방법",
            lecture: "두 방법 중 어느 쪽을 써도 결과는 같다고 짚음",
          }}
        >
          <Card>
            <CardTitle>tf.function — 같은 함수, 달라지는 한 줄</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              <strong>
                즉시 실행 모드의 프로그램을 작성하듯 텐서플로 기반의 코드를 작성하면 이를 자동으로
                그래프로 변환
              </strong>
              해 줍니다. 아래 세 가지를 눌러 비교해 보세요 — 함수 본문은 한 글자도 바뀌지 않습니다.
            </p>

            <div className="mb-3 flex flex-col gap-2 sm:flex-row">
              {WAYS.map((o, i) => (
                <Tab3
                  key={o.key}
                  active={way === i}
                  onClick={() => {
                    setWay(i);
                    setCalls(0);
                  }}
                  title={o.title}
                  desc={o.desc}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={w.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="grid gap-3 lg:grid-cols-2"
              >
                <Code caption="학습 단계의 처리 함수 정의" lines={w.def} />
                <Code caption="학습 표본 집합에 대한 반복 학습" lines={w.loop} />
              </motion.div>
            </AnimatePresence>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Pill tone={w.mode === "그래프 실행" ? "amber" : "gray"}>{w.mode} 모드로 동작</Pill>
              <span className="min-w-0 break-words text-[12px] leading-5 text-gray-600 dark:text-gray-300">
                {w.say}
              </span>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "4. 그래프 실행 모드의 활용 — 변환된 함수는 첫 호출 시 그래프로 변환 후 실행되고, 그 이후에는 이미 변환된 그래프를 실행함",
            lecture: "tf.function 안에서는 중간 값을 확인하는 print 같은 파이썬 문장이 실제로 동작하지 않으니 쓰지 말라고 당부",
          }}
        >
          <Card>
            <CardTitle>변환은 첫 호출에 한 번만</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              변환된 함수는 동일한 형태의 입력에 대해서는{" "}
              <strong>첫 호출 시 그래프로 변환 후 실행</strong>되고, 그 이후에는{" "}
              <strong>이미 변환된 그래프를 실행</strong>합니다.
            </p>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCalls((c) => Math.min(5, c + 1))}
                className="rounded-lg bg-amber-500 px-3 py-1.5 text-[11.5px] font-semibold text-white transition-colors hover:bg-amber-600"
              >
                train_step 호출하기
              </button>
              <button
                type="button"
                onClick={() => setCalls(0)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-[11.5px] font-semibold text-gray-500 dark:border-gray-700"
              >
                초기화
              </button>
              <span className="text-[11.5px] font-semibold text-gray-500">
                지금까지 {calls}번 호출
              </span>
            </div>

            <div className="space-y-1.5">
              {Array.from({ length: Math.max(calls, 1) }, (_, idx) => idx).map((idx) => {
                const first = idx === 0;
                const shown = calls > idx;
                return (
                  <motion.div
                    key={idx}
                    initial={shown ? { opacity: 0, x: -6 } : false}
                    animate={{ opacity: shown ? 1 : 0.25, x: 0 }}
                    transition={{ duration: 0.16 }}
                    className={`flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 ${
                      !shown
                        ? "border-dashed border-gray-200 dark:border-gray-800"
                        : first
                          ? "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40"
                          : "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
                    }`}
                  >
                    <span className="font-mono text-[11px] font-bold text-gray-500">
                      {idx + 1}번째 호출
                    </span>
                    {shown ? (
                      first ? (
                        <span className="text-[12px] text-amber-800 dark:text-amber-200">
                          파이썬 함수를 <strong>그래프로 변환</strong>한 뒤 실행
                        </span>
                      ) : (
                        <span className="text-[12px] text-emerald-800 dark:text-emerald-200">
                          변환을 건너뛰고 <strong>이미 만들어진 그래프를 실행</strong>
                        </span>
                      )
                    ) : (
                      <span className="text-[12px] text-gray-400">단추를 눌러 보세요</span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-lg bg-rose-50 p-3 dark:bg-rose-950/30">
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-rose-500" />
              <p className="min-w-0 break-words text-[12px] leading-5 text-rose-900 dark:text-rose-200">
                그래프로 변환된 함수 안에서는 계산이 텐서플로 쪽에서 이루어집니다. 그래서 중간 값을
                눈으로 보려고 <code className="font-mono">print</code> 같은 파이썬 문장을 함수 안에
                넣어도 기대한 대로 동작하지 않습니다. 값을 확인하며 다듬는 일은 즉시 실행 모드에서
                하고, 다 다듬은 뒤에 그래프 모드로 바꾸는 것이 순서입니다.
              </p>
            </div>
            <Hint>
              훈련처럼 같은 수식을 여러 번 반복하는 경우에 효과가 큽니다. 한 번만 계산하는 경우에는
              차이가 거의 없습니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
