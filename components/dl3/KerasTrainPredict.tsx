"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings2, GraduationCap, Target, ChevronRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, ComputedNote, Scroller, fmt } from "@/components/dlShared/ui";
import { Code, Out, Pill } from "@/components/dl3/ui3";

/** 강의록 4절 후반 — 모델의 컴파일 → 훈련 → 훈련된 모델을 이용한 분류 */

const STAGES = [
  {
    key: "compile",
    icon: Settings2,
    name: "컴파일",
    tag: "모델의 훈련을 위한 설정",
    sig: ["tf.keras.Model.compile(optimizer='rmsprop',", "                       loss=None, metrics=None)"],
    params: [
      ["optimizer", "최적화기를 지정하는 문자열 또는 최적화기 인스턴스"],
      ["loss", "손실함수를 지정하는 스트링 또는 손실함수 인스턴스"],
      ["metrics", "훈련 및 테스트 과정에서 사용할 평가 척도의 리스트"],
    ],
    example: [
      "bp_model_tf.compile(optimizer=optimizers.SGD(0.1, momentum=0.9),",
      "                    loss=losses.SparseCategoricalCrossentropy(),",
      "                    metrics=['accuracy'])",
    ],
    returns: null,
  },
  {
    key: "fit",
    icon: GraduationCap,
    name: "훈련",
    tag: "지정된 에폭(epoch)만큼 모델의 훈련을 반복함",
    sig: [
      "tf.keras.Model.fit(x, y, batch_size, epochs, verbose,",
      "                   validation_split, validation_data, shuffle)",
    ],
    params: [
      ["x, y", "학습 데이터(입력 데이터와 레이블)"],
      ["batch_size", "미니배치 크기(기본값은 32)"],
      ["epochs", "전체 학습 데이터를 몇 번 반복하여 훈련할지 지정함"],
      ["verbose", "훈련 진행 정보 출력 방식 설정"],
      ["validation_split", "x, y에 제공된 데이터 중 검증용 데이터의 비율"],
      ["validation_data", "검증용 데이터 및 레이블의 튜플"],
      ["shuffle", "데이터 순서를 섞은 후 훈련할 것인지 지정(기본값은 True)"],
    ],
    example: [
      "bp_model_tf.fit(X_tr, y_tr, batch_size=15, epochs=1000,",
      "                verbose=2, validation_data=(X_val, y_val))",
    ],
    returns: "History 객체 — 매 에폭에서의 손실 및 평가척도 값(훈련 및 검증)을 담고 있는 객체",
  },
  {
    key: "predict",
    icon: Target,
    name: "추론",
    tag: "입력 데이터에 대한 출력을 추론(예측)함",
    sig: ["tf.keras.Model.predict(x, batch_size, verbose)"],
    params: [
      ["x", "입력 데이터 집합이 저장된 Numpy 배열"],
      ["batch_size", "미니배치 크기(기본값은 32)"],
      ["verbose", "추론 진행 정보 출력 방식 설정"],
    ],
    example: [
      "y_hat = bp_model_tf.predict(X_val, verbose=0)",
      "y_hat_lbls = np.array([np.argmax(y_hat[k])",
      "                         for k in range(len(X_val))])",
    ],
    returns: "예측한 출력이 저장된 Numpy 배열",
  },
] as const;

/** 소프트맥스 출력에서 레이블을 고르는 예 — 첫 줄은 강의에서 든 값 */
const SOFTMAX_ROWS: { v: [number, number, number]; fromLecture: boolean }[] = [
  { v: [0.5, 0.2, 0.3], fromLecture: true },
  { v: [0.1, 0.7, 0.2], fromLecture: false },
  { v: [0.2, 0.2, 0.6], fromLecture: false },
];

function argmax(v: readonly number[]): number {
  let best = 0;
  for (let i = 1; i < v.length; i += 1) if (v[i] > v[best]) best = i;
  return best;
}

export default function KerasTrainPredict() {
  const [s, setS] = useState(0);
  const [row, setRow] = useState(0);
  const stage = STAGES[s];
  const picked = SOFTMAX_ROWS[row];
  const label = argmax(picked.v);

  return (
    <section id="keras-train-predict" className="scroll-mt-32">
      <SectionTitle
        title="컴파일 → 훈련 → 추론"
        subtitle="모델을 만든 뒤에 거치는 세 단계. 각 단계를 눌러 매개변수를 확인하세요"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "2. 예: 텐서플로를 이용한 다층 퍼셉트론 구현 — 모델의 컴파일 / 모델의 훈련 / 훈련된 모델을 이용한 분류",
          }}
        >
          <Card>
            <Scroller>
              <div className="mb-3 flex min-w-[300px] items-stretch gap-1.5">
                {STAGES.map((st, i) => {
                  const Icon = st.icon;
                  const active = s === i;
                  return (
                    <div key={st.key} className="flex min-w-0 flex-1 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setS(i)}
                        aria-pressed={active}
                        className={`min-w-0 flex-1 rounded-lg border px-2.5 py-2 text-left transition-colors ${
                          active
                            ? "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-950/40"
                            : "border-gray-200 bg-white hover:border-amber-200 dark:border-gray-700 dark:bg-gray-900"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Icon
                            size={13}
                            className={active ? "text-amber-500" : "text-gray-400"}
                          />
                          <span
                            className={`text-[12px] font-bold ${
                              active
                                ? "text-amber-700 dark:text-amber-300"
                                : "text-gray-600 dark:text-gray-300"
                            }`}
                          >
                            {st.name}
                          </span>
                        </span>
                        <span className="mt-0.5 block font-mono text-[10px] text-gray-400">
                          {st.key}
                        </span>
                      </button>
                      {i < STAGES.length - 1 && (
                        <ChevronRight size={14} className="shrink-0 text-gray-300" />
                      )}
                    </div>
                  );
                })}
              </div>
            </Scroller>

            <AnimatePresence mode="wait">
              <motion.div
                key={stage.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="space-y-3"
              >
                <p className="text-[12.5px] font-semibold text-gray-700 dark:text-gray-200">
                  {stage.tag}
                </p>

                <Code lines={stage.sig.map((t) => ({ t }))} caption="형식" />

                <Scroller>
                  <table className="w-full min-w-[320px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="py-1.5 pr-3 text-[10.5px] font-semibold text-gray-500">
                          매개변수
                        </th>
                        <th className="py-1.5 text-[10.5px] font-semibold text-gray-500">설명</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stage.params.map(([k, d]) => (
                        <tr key={k} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="whitespace-nowrap py-1.5 pr-3 align-top font-mono text-[11.5px] text-amber-700 dark:text-amber-300">
                            {k}
                          </td>
                          <td className="py-1.5 text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                            {d}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Scroller>

                {stage.returns && (
                  <div className="flex flex-wrap items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 dark:bg-sky-950/30">
                    <Pill tone="sky">반환되는 결과</Pill>
                    <span className="min-w-0 break-words text-[12px] leading-5 text-sky-900 dark:text-sky-200">
                      {stage.returns}
                    </span>
                  </div>
                )}

                <Code lines={stage.example.map((t) => ({ t }))} caption="예" />
              </motion.div>
            </AnimatePresence>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "2. 예: 텐서플로를 이용한 다층 퍼셉트론 구현 — 훈련된 모델을 이용한 분류",
            lecture: "소프트맥스 출력이 0.5, 0.2, 0.3 이면 가장 큰 0.5의 자리인 0이 클래스 번호가 된다고 예를 들어 설명",
          }}
        >
          <Card>
            <CardTitle>소프트맥스 출력에서 클래스 번호 고르기</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              <code className="font-mono">predict</code> 는 표본마다 출력 벡터를 돌려줍니다. 출력층의
              활성함수가 소프트맥스이므로 이 값들은 0과 1 사이이고 합이 1인 확률분포입니다. 가장 큰
              값의 자리를 <code className="font-mono">np.argmax</code> 로 찾으면 그것이 클래스
              번호입니다.
            </p>

            <div className="mb-3 flex flex-wrap gap-1.5">
              {SOFTMAX_ROWS.map((r, i) => (
                <button
                  key={r.v.join(",")}
                  type="button"
                  onClick={() => setRow(i)}
                  aria-pressed={row === i}
                  className={`rounded-full border px-3 py-1 font-mono text-[11px] font-semibold transition-colors ${
                    row === i
                      ? "border-amber-500 bg-amber-500 text-white"
                      : "border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900"
                  }`}
                >
                  [{r.v.map((x) => fmt(x, 1)).join(", ")}]
                </button>
              ))}
            </div>

            <Scroller>
              <div className="flex min-w-[280px] flex-wrap items-end gap-2">
                {picked.v.map((p, i) => (
                  <div key={i} className="flex w-20 flex-col items-center gap-1">
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        i === label ? "text-amber-700 dark:text-amber-300" : "text-gray-400"
                      }`}
                    >
                      {fmt(p, 1)}
                    </span>
                    <motion.div
                      className={`w-full rounded-t ${
                        i === label ? "bg-amber-500" : "bg-gray-200 dark:bg-gray-700"
                      }`}
                      initial={false}
                      animate={{ height: Math.round(p * 90) + 4 }}
                      transition={{ duration: 0.25 }}
                    />
                    <span className="font-mono text-[10.5px] text-gray-500">ŷ{i + 1}</span>
                  </div>
                ))}
                <div className="ml-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-900 dark:bg-amber-950/40">
                  <p className="text-[10.5px] font-semibold text-amber-700 dark:text-amber-300">
                    np.argmax
                  </p>
                  <p className="font-mono text-[18px] font-bold text-amber-900 dark:text-amber-100">
                    {label}
                  </p>
                </div>
              </div>
            </Scroller>

            <div className="mt-3">
              <Out>{`y_hat_lbls[k] = ${label}`}</Out>
            </div>

            {picked.fromLecture ? (
              <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-[11.5px] leading-5 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                강의에서 직접 든 예입니다. 0.5가 가장 크므로 0이 반환됩니다.
              </p>
            ) : (
              <ComputedNote>
                나머지 두 벡터는 자리가 바뀌면 결과가 어떻게 달라지는지 보려고 이 페이지에서 만든
                예입니다.
              </ComputedNote>
            )}
            <Hint>
              출력의 개수는 출력층 Dense의 units가 정합니다. 강의록 예제는 nClasses개의 출력을 내고,
              소프트맥스를 거치므로 전체 출력의 합은 1이 됩니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
