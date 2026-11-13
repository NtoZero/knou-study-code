"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, RefreshCw, Cpu } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, ComputedNote, Scroller } from "@/components/dlShared/ui";
import { Chip3, Code, Out, Pill, Tab3 } from "@/components/dl3/ui3";

/** 강의록 3-3[2]의 상수 텐서 c — shape (4, 3, 2) */
const C: number[][][] = [
  [
    [1, 2],
    [3, 4],
    [5, 6],
  ],
  [
    [7, 8],
    [9, 10],
    [11, 12],
  ],
  [
    [13, 14],
    [15, 16],
    [17, 18],
  ],
  [
    [19, 20],
    [21, 22],
    [23, 24],
  ],
];

/** 지정한 축을 따라 합산한다. 정수 덧셈이라 실행 환경에 따라 값이 갈리지 않는다. */
function reduceSum(axis: 0 | 1 | 2): { shape: [number, number]; rows: number[][] } {
  if (axis === 0) {
    const rows = [0, 1, 2].map((j) => [0, 1].map((k) => C[0][j][k] + C[1][j][k] + C[2][j][k] + C[3][j][k]));
    return { shape: [3, 2], rows };
  }
  if (axis === 1) {
    const rows = C.map((mat) => [0, 1].map((k) => mat[0][k] + mat[1][k] + mat[2][k]));
    return { shape: [4, 2], rows };
  }
  const rows = C.map((mat) => mat.map((pair) => pair[0] + pair[1]));
  return { shape: [4, 3], rows };
}

function Grid({ rows }: { rows: number[][] }) {
  return (
    <div className="inline-block overflow-hidden rounded-lg border border-amber-300 dark:border-amber-800">
      {rows.map((row, ri) => (
        <div key={ri} className="flex">
          {row.map((v, ci) => (
            <motion.div
              key={ci}
              initial={{ opacity: 0.3, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.18, delay: (ri * row.length + ci) * 0.02 }}
              className="flex h-8 w-12 items-center justify-center border-b border-r border-amber-200 bg-amber-50 font-mono text-[11.5px] text-amber-900 last:border-r-0 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
            >
              {v}.
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

const OPS = [
  { key: "cast", title: "형 변환", desc: "다른 자료형끼리 곱하기" },
  { key: "axis", title: "축 합산", desc: "어느 축을 따라 더할지" },
  { key: "matmul", title: "행렬 곱", desc: "선형대수 연산과 Numpy" },
] as const;

export default function TensorKindsOps() {
  const [x, setX] = useState(10);
  const [touched, setTouched] = useState(false);
  const [op, setOp] = useState<(typeof OPS)[number]["key"]>("axis");
  const [axis, setAxis] = useState<0 | 1 | 2>(2);

  const red = reduceSum(axis);

  return (
    <section id="tensor-kinds-ops" className="scroll-mt-32">
      <SectionTitle
        title="상수 텐서와 변수 텐서, 그리고 텐서 연산"
        subtitle="값을 바꿀 수 있는가, 그리고 어느 축을 따라 계산하는가"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "2. 텐서플로와 텐서 — 상수 텐서 / 변수 텐서, 3. 텐서의 사용 예 — 변수 텐서의 값을 갱신하기",
            lecture: "상수 텐서는 tf.constant 함수로, 변수 텐서는 tf.Variable 클래스의 인스턴스로 만든다는 차이를 짚음",
          }}
        >
          <Card>
            <CardTitle>두 가지 텐서</CardTitle>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="min-w-0 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/60">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Lock size={13} className="text-gray-400" />
                  <span className="text-[12px] font-bold text-gray-700 dark:text-gray-200">
                    상수 텐서
                  </span>
                </div>
                <p className="mb-2 text-[12px] leading-5 text-gray-600 dark:text-gray-300">
                  값을 수정할 수 없는 텐서. <code className="font-mono">tf.constant</code> 함수를
                  사용하여 만듦.
                </p>
                <Code lines={[{ t: "a = tf.constant(10.)" }, { t: "b = tf.constant([1, 2, 3, 4])" }]} />
              </div>

              <div className="min-w-0 rounded-lg border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900 dark:bg-amber-950/30">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <RefreshCw size={13} className="text-amber-500" />
                  <span className="text-[12px] font-bold text-amber-800 dark:text-amber-200">
                    변수 텐서
                  </span>
                </div>
                <p className="mb-2 text-[12px] leading-5 text-amber-900/90 dark:text-amber-100/90">
                  프로그램 실행 중 값이 변경될 수 있는 상태를 표현하는 텐서.{" "}
                  <code className="font-mono">tf.Variable</code> 클래스의 인스턴스를 생성.
                </p>
                <Code lines={[{ t: "x = tf.Variable(10.)" }, { t: "x.assign_add(20.)", mark: touched }]} />
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setX(30);
                      setTouched(true);
                    }}
                    className="rounded-lg bg-amber-500 px-3 py-1.5 text-[11.5px] font-semibold text-white transition-colors hover:bg-amber-600"
                  >
                    x.assign_add(20.) 실행
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setX(10);
                      setTouched(false);
                    }}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-[11.5px] font-semibold text-gray-500 dark:border-gray-700"
                  >
                    되돌리기
                  </button>
                  <span className="font-mono text-[13px] font-bold text-amber-700 dark:text-amber-300">
                    x = {x}.0
                  </span>
                </div>
                <p className="mt-2 text-[11px] leading-5 text-amber-900/80 dark:text-amber-200/80">
                  변수 텐서에 다른 값을 저장할 때는 <strong>assign 메소드</strong>를 사용한다.
                  assign · assign_add · assign_sub 가 있다.
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-start gap-2 rounded-lg bg-sky-50 p-3 dark:bg-sky-950/30">
              <Cpu size={14} className="mt-0.5 shrink-0 text-sky-500" />
              <p className="min-w-0 break-words text-[12px] leading-5 text-sky-900 dark:text-sky-200">
                텐서는 <strong>가장 빠른 처리를 할 수 있는 장치에서 처리되도록</strong> 만들어진다.
                강의록 예제에서 <code className="font-mono">c.device</code> 를 출력하면{" "}
                <code className="break-all font-mono">/job:localhost/replica:0/task:0/device:GPU:0</code> 처럼
                나온다. GPU를 쓸 수 없으면 CPU로 설정된다.
              </p>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "3. 텐서의 사용 예 — 텐서에 대한 산술 연산 및 수학 함수 / 선형대수 연산 및 묵시적 형 변환",
            lecture: "reduce_sum에서 축 번호가 0·1·2 중 어느 것인지에 따라 결과가 달라진다고 설명",
          }}
        >
          <Card>
            <CardTitle>텐서 연산 — 어느 축을 따라 계산하는가</CardTitle>

            <div className="mb-3 flex gap-2">
              {OPS.map((o) => (
                <Tab3
                  key={o.key}
                  active={op === o.key}
                  onClick={() => setOp(o.key)}
                  title={o.title}
                  desc={o.desc}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={op}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {op === "cast" && (
                  <div className="space-y-2">
                    <Code
                      lines={[
                        { t: "a = tf.constant(10.)          # float32" },
                        { t: "b = tf.constant([1, 2, 3, 4]) # int32" },
                        { t: "a * tf.cast(b, tf.float32)", mark: true },
                      ]}
                    />
                    <Out>a * b = [10. 20. 30. 40.]</Out>
                    <p className="text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                      텐서는 <strong>동일 자료형</strong>의 데이터를 담습니다. a는 float32,
                      b는 int32이므로 그대로 곱할 수 없고, <code className="font-mono">tf.cast</code>{" "}
                      로 b를 float32로 변환한 뒤 곱합니다.
                    </p>
                  </div>
                )}

                {op === "axis" && (
                  <div className="space-y-2">
                    <Code
                      lines={[
                        { t: "# c 는 shape (4, 3, 2) 인 상수 텐서" },
                        { t: `tf.reduce_sum(c, axis=${axis})`, mark: true },
                      ]}
                    />
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-gray-500">axis</span>
                      {([0, 1, 2] as const).map((v) => (
                        <Chip3 key={v} active={axis === v} onClick={() => setAxis(v)}>
                          {v}번 축
                        </Chip3>
                      ))}
                    </div>

                    <Scroller>
                      <div className="flex min-w-[280px] flex-wrap items-center gap-3">
                        <div>
                          <p className="mb-1 text-[10.5px] font-semibold text-gray-500">
                            원래 텐서 shape
                          </p>
                          <Pill>(4, 3, 2)</Pill>
                        </div>
                        <span className="text-gray-400">→</span>
                        <div>
                          <p className="mb-1 text-[10.5px] font-semibold text-gray-500">
                            {axis}번 축이 사라진 결과
                          </p>
                          <Grid rows={red.rows} />
                          <p className="mt-1 font-mono text-[11px] text-amber-700 dark:text-amber-300">
                            shape = ({red.shape[0]}, {red.shape[1]})
                          </p>
                        </div>
                      </div>
                    </Scroller>

                    <p className="text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                      합산한 축이 통째로 사라집니다. shape (4, 3, 2) 에서{" "}
                      <strong>{axis}번 자리의 {axis === 0 ? 4 : axis === 1 ? 3 : 2}</strong> 가
                      빠져 ({red.shape[0]}, {red.shape[1]}) 이 되는 것입니다.
                    </p>

                    {axis === 2 ? (
                      <p className="rounded-lg bg-emerald-50 px-3 py-2 text-[11.5px] leading-5 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                        강의록에 실린 경우입니다. 출력도 같습니다 — [[3. 7. 11.] [15. 19. 23.] [27.
                        31. 35.] [39. 43. 47.]], shape=(4, 3)
                      </p>
                    ) : (
                      <ComputedNote>
                        강의록에는 axis=2 인 경우만 실려 있습니다. 0번·1번 축의 결과는 같은 텐서
                        값으로 이 페이지에서 직접 더해 본 것입니다.
                      </ComputedNote>
                    )}
                  </div>
                )}

                {op === "matmul" && (
                  <div className="space-y-2">
                    <Code
                      lines={[
                        { t: "y = tf.Variable([[1., 2., 3.], [4., 5., 6.]])      # (2, 3)" },
                        { t: "z = np.array([[1.,3.],[2.,4.],[3.,5.]], np.float32) # (3, 2)" },
                        { t: "tf.matmul(y, z)   # 텐서플로의 선형대수 연산", mark: true },
                        { t: "np.matmul(y, z)   # Numpy 함수에도 텐서를 그대로 넘길 수 있다" },
                      ]}
                    />
                    <Out>{`tf.linalg.matmul(y, z) = tf.Tensor(
[[14. 26.]
 [32. 62.]], shape=(2, 2), dtype=float32)
np.matmul(y, z) =
[[14. 26.]
 [32. 62.]]`}</Out>
                    <p className="text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                      텐서플로에는 텐서의 연산을 위한 <code className="font-mono">tf.math</code>,
                      선형대수 연산을 위한 <code className="font-mono">tf.linalg</code> 가 포함되어
                      있습니다. Numpy 배열과 텐서 사이에는 묵시적 형 변환이 이루어져 두 결과가
                      같습니다.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <Hint>
              코드는 강의록 예제에서 핵심 줄만 가져왔습니다. 출력은 강의록에 적힌 실행 결과입니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
