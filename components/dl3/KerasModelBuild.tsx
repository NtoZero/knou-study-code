"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointerClick } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Scroller } from "@/components/dlShared/ui";
import { Chip3, Code, Pill, Tab3, r2, type CodeLine } from "@/components/dl3/ui3";

/**
 * 강의록 4절의 다층 퍼셉트론(입력 2 → Dense 4 sigmoid → Dense nClasses softmax)을
 * 세 가지 구성 방법으로 바꿔 가며 본다. 그림의 층을 누르면 해당 코드 줄이 강조된다.
 */

type LayerKey = "input" | "h" | "o";

type Line = { t: string; layer?: LayerKey; dim?: boolean };

const VARIANTS: {
  key: string;
  title: string;
  desc: string;
  when: string;
  lines: Line[];
}[] = [
  {
    key: "seq-add",
    title: "Sequential · add",
    desc: "빈 모델에 층을 더함",
    when: "순차적으로 층이 연결된 모델을 구성하는 가장 단순한 방법. 빈 Sequential 인스턴스를 만든 뒤 add 메소드로 층을 하나씩 붙인다.",
    lines: [
      { t: "bp_model_tf = keras.Sequential()" },
      { t: "bp_model_tf.add(keras.Input(shape=(2,)))", layer: "input" },
      { t: "bp_model_tf.add(layers.Dense(4, activation='sigmoid'))", layer: "h" },
      { t: "bp_model_tf.add(layers.Dense(nClasses, activation='softmax'))", layer: "o" },
    ],
  },
  {
    key: "seq-list",
    title: "Sequential · 리스트",
    desc: "층 목록을 한 번에",
    when: "같은 모델을 층의 리스트로 한 번에 넘기는 방법. Sequential(layers=None, name=None) 의 layers 매개변수가 모델에 연결할 층의 리스트다.",
    lines: [
      { t: "bp_model_tf = keras.Sequential([" },
      { t: "    layers.Input(shape=(2,)),", layer: "input" },
      { t: "    layers.Dense(4, activation='sigmoid'),", layer: "h" },
      { t: "    layers.Dense(nClasses, activation='softmax')", layer: "o" },
      { t: "])" },
    ],
  },
  {
    key: "functional",
    title: "함수형 API",
    desc: "층의 출력을 다음 층에 전달",
    when: "다양한 형태의 층과 비순차적 연결이 존재하는 모델의 구성에 활용. 각 층의 출력에 해당하는 텐서를 이어지는 층의 인스턴스에 전달하는 형식으로 그래프를 구성한다.",
    lines: [
      { t: "inputs = keras.Input(shape=(2,))", layer: "input" },
      { t: "h = layers.Dense(4, activation='sigmoid')(inputs)", layer: "h" },
      { t: "y = layers.Dense(nClasses, activation='softmax')(h)", layer: "o" },
      { t: "bp_model_tf = keras.Model(inputs, y)" },
    ],
  },
  {
    key: "subclass",
    title: "서브클래싱 API",
    desc: "Model을 상속한 클래스",
    when: "tf.keras.Model 클래스의 서브클래스로 목적에 맞게 설계된 모델 클래스를 선언하는 것. __init__ 에서 층을 만들고 call 에서 흐름을 적는다.",
    lines: [
      { t: "class BP_iris(keras.Model):" },
      { t: "    def __init__(self):" },
      { t: "        super(BP_iris, self).__init__()" },
      { t: "        self.h_layer = layers.Dense(4, activation='sigmoid')", layer: "h" },
      { t: "        self.o_layer = layers.Dense(nClasses, activation='softmax')", layer: "o" },
      { t: "    def call(self, x):" },
      { t: "        x = self.h_layer(x)", layer: "h" },
      { t: "        return self.o_layer(x)", layer: "o" },
      { t: "bp_model_tf = BP_iris()" },
    ],
  },
];

const DENSE_PARAMS = [
  { k: "units", v: "출력의 수(뉴런의 수)" },
  { k: "activation", v: "사용할 활성함수" },
  { k: "use_bias", v: "바이어스 사용 여부 — 기본값은 True" },
  { k: "kernel_initializer, bias_initializer", v: "가중치 및 바이어스의 초기화 방법 설정" },
];

const HY = [38, 74, 110, 146];
const OY = [56, 92, 128];

export default function KerasModelBuild() {
  const [v, setV] = useState(0);
  const [layer, setLayer] = useState<LayerKey | null>(null);
  const [param, setParam] = useState(0);
  const variant = VARIANTS[v];

  const lines: CodeLine[] = variant.lines.map((l) => ({
    t: l.t,
    mark: layer !== null && l.layer === layer,
    dim: layer !== null && l.layer !== undefined && l.layer !== layer,
  }));

  const on = (k: LayerKey) => layer === null || layer === k;
  const op = (k: LayerKey) => (on(k) ? 1 : 0.28);

  return (
    <section id="keras-model-build" className="scroll-mt-32">
      <SectionTitle
        title="Keras로 같은 모델을 세 가지 방법으로"
        subtitle="그림의 층을 누르면, 그 층을 만드는 코드 줄이 방법마다 어디에 있는지 보입니다"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "1. Keras의 개요 — Keras란? / Keras를 이용하여 신경망 모델을 구성하는 방법",
            lecture: "Keras는 원래 텐서플로와 별개의 API였고 2.4부터 텐서플로만, 3.0부터 다시 여러 프레임워크를 지원한다고 설명",
          }}
        >
          <Card>
            <CardTitle>Keras란?</CardTitle>
            <ul className="space-y-1.5 text-[12.5px] leading-5 text-gray-700 dark:text-gray-200">
              <li>신경망 구현을 위한 고수준 오픈소스 라이브러리</li>
              <li>2.4 버전부터는 텐서플로만 지원</li>
              <li>3.0 버전부터는 텐서플로, 파이토치 등 다수의 프레임워크 지원</li>
              <li>
                텐서플로의 <code className="font-mono">tf.keras</code> 모듈에서 제공됨 — 여러 가지
                신경망 층, 활성함수, 손실함수, 최적화기 등을 제공
              </li>
            </ul>
            <div className="mt-3">
              <Code
                caption="사용할 Keras 모듈"
                lines={[
                  { t: "from tensorflow import keras" },
                  { t: "from tensorflow.keras import layers, optimizers, losses" },
                ]}
              />
            </div>
            <Hint>
              layers는 모델 구성에 필요한 다양한 층 클래스를, optimizers는 최적화기 클래스를,
              losses는 손실함수 클래스를 제공하는 모듈입니다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "2. 예: 텐서플로를 이용한 다층 퍼셉트론 구현 — 구현할 다층 퍼셉트론, Sequential·함수형 API·서브클래싱 API",
          }}
        >
          <Card>
            <CardTitle>구현할 다층 퍼셉트론</CardTitle>

            <div className="grid gap-3 lg:grid-cols-[1fr_1.1fr]">
              <div className="min-w-0">
                <Scroller>
                  <svg
                    viewBox="0 0 300 180"
                    className="h-auto w-full min-w-[260px]"
                    role="img"
                    aria-label="다층 퍼셉트론 구조"
                  >
                    {/* 연결선 */}
                    <g opacity={Math.min(op("input"), op("h"))}>
                      {[78, 118].map((iy) =>
                        HY.map((hy) => (
                          <line
                            key={`${iy}-${hy}`}
                            x1={42}
                            y1={iy}
                            x2={r2(110 - 11)}
                            y2={hy}
                            className="stroke-gray-300 dark:stroke-gray-600"
                            strokeWidth={0.9}
                          />
                        )),
                      )}
                    </g>
                    <g opacity={Math.min(op("h"), op("o"))}>
                      {HY.map((hy) =>
                        OY.map((oy) => (
                          <line
                            key={`${hy}-${oy}`}
                            x1={r2(142 + 11)}
                            y1={hy}
                            x2={r2(212 - 11)}
                            y2={oy}
                            className="stroke-gray-300 dark:stroke-gray-600"
                            strokeWidth={0.9}
                          />
                        )),
                      )}
                    </g>

                    {/* 입력 */}
                    <g
                      opacity={op("input")}
                      onClick={() => setLayer(layer === "input" ? null : "input")}
                      className="cursor-pointer"
                    >
                      <rect
                        x={14}
                        y={56}
                        width={56}
                        height={84}
                        rx={8}
                        className={`fill-transparent ${
                          layer === "input" ? "stroke-amber-500" : "stroke-emerald-400"
                        }`}
                        strokeWidth={1.3}
                        strokeDasharray="4 3"
                      />
                      <circle cx={42} cy={78} r={4} className="fill-gray-700 dark:fill-gray-200" />
                      <circle cx={42} cy={118} r={4} className="fill-gray-700 dark:fill-gray-200" />
                      <text x={28} y={82} className="fill-gray-600 text-[10px] dark:fill-gray-300">
                        x₁
                      </text>
                      <text x={28} y={122} className="fill-gray-600 text-[10px] dark:fill-gray-300">
                        x₂
                      </text>
                      <text
                        x={42}
                        y={156}
                        textAnchor="middle"
                        className="fill-emerald-600 text-[10px] font-semibold dark:fill-emerald-400"
                      >
                        Input
                      </text>
                    </g>

                    {/* 은닉층 */}
                    <g
                      opacity={op("h")}
                      onClick={() => setLayer(layer === "h" ? null : "h")}
                      className="cursor-pointer"
                    >
                      <rect
                        x={94}
                        y={20}
                        width={66}
                        height={144}
                        rx={8}
                        className={`fill-transparent ${
                          layer === "h" ? "stroke-amber-500" : "stroke-emerald-400"
                        }`}
                        strokeWidth={1.3}
                        strokeDasharray="4 3"
                      />
                      {HY.map((y) => (
                        <g key={y}>
                          <circle
                            cx={110}
                            cy={y}
                            r={11}
                            className="fill-white stroke-gray-500 dark:fill-gray-900"
                            strokeWidth={1.1}
                          />
                          <text
                            x={110}
                            y={y + 4}
                            textAnchor="middle"
                            className="fill-gray-700 text-[11px] dark:fill-gray-200"
                          >
                            Σ
                          </text>
                          <circle
                            cx={142}
                            cy={y}
                            r={11}
                            className="fill-white stroke-gray-500 dark:fill-gray-900"
                            strokeWidth={1.1}
                          />
                          <text
                            x={142}
                            y={y + 4}
                            textAnchor="middle"
                            className="fill-rose-500 text-[11px]"
                          >
                            ʃ
                          </text>
                          <line
                            x1={121}
                            y1={y}
                            x2={131}
                            y2={y}
                            className="stroke-gray-400"
                            strokeWidth={0.9}
                          />
                        </g>
                      ))}
                      <text
                        x={127}
                        y={178}
                        textAnchor="middle"
                        className="fill-emerald-600 text-[10px] font-semibold dark:fill-emerald-400"
                      >
                        Dense(4, sigmoid)
                      </text>
                    </g>

                    {/* 출력층 */}
                    <g
                      opacity={op("o")}
                      onClick={() => setLayer(layer === "o" ? null : "o")}
                      className="cursor-pointer"
                    >
                      <rect
                        x={196}
                        y={38}
                        width={66}
                        height={108}
                        rx={8}
                        className={`fill-transparent ${
                          layer === "o" ? "stroke-amber-500" : "stroke-emerald-400"
                        }`}
                        strokeWidth={1.3}
                        strokeDasharray="4 3"
                      />
                      {OY.map((y) => (
                        <g key={y}>
                          <circle
                            cx={212}
                            cy={y}
                            r={11}
                            className="fill-white stroke-gray-500 dark:fill-gray-900"
                            strokeWidth={1.1}
                          />
                          <text
                            x={212}
                            y={y + 4}
                            textAnchor="middle"
                            className="fill-gray-700 text-[11px] dark:fill-gray-200"
                          >
                            Σ
                          </text>
                          <line
                            x1={223}
                            y1={y}
                            x2={240}
                            y2={y}
                            className="stroke-gray-400"
                            strokeWidth={0.9}
                          />
                        </g>
                      ))}
                      <rect
                        x={240}
                        y={42}
                        width={18}
                        height={100}
                        className="fill-white stroke-gray-600 dark:fill-gray-900"
                        strokeWidth={1.1}
                      />
                      <text
                        x={249}
                        y={92}
                        textAnchor="middle"
                        transform="rotate(90 249 92)"
                        className="fill-gray-700 text-[9.5px] font-semibold dark:fill-gray-200"
                      >
                        Softmax
                      </text>
                      {OY.map((y, i) => (
                        <g key={y}>
                          <line
                            x1={258}
                            y1={y}
                            x2={272}
                            y2={y}
                            className="stroke-gray-400"
                            strokeWidth={0.9}
                          />
                          <text
                            x={276}
                            y={y + 4}
                            className="fill-gray-700 text-[10px] dark:fill-gray-200"
                          >
                            ŷ{i + 1}
                          </text>
                        </g>
                      ))}
                      <text
                        x={229}
                        y={166}
                        textAnchor="middle"
                        className="fill-emerald-600 text-[10px] font-semibold dark:fill-emerald-400"
                      >
                        Dense(nClasses, softmax)
                      </text>
                    </g>
                  </svg>
                </Scroller>
                <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-gray-400">
                  <MousePointerClick size={12} />
                  {layer === null
                    ? "층을 눌러 보세요"
                    : "다시 누르면 전체가 보입니다"}
                </p>
              </div>

              <div className="min-w-0">
                <div className="mb-2 grid grid-cols-2 gap-2">
                  {VARIANTS.map((o, i) => (
                    <Tab3
                      key={o.key}
                      active={v === i}
                      onClick={() => setV(i)}
                      title={o.title}
                      desc={o.desc}
                    />
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={variant.key}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Code lines={lines} />
                    <p className="mt-2 text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                      {variant.when}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
              <p className="text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                네 가지 코드가 만드는 모델은 같습니다. 순차적으로 구성되는 단순한 모델은{" "}
                <code className="font-mono">tf.keras.Sequential</code> 로 충분하고, 잔차 학습
                블록처럼 <strong>비순차적 연결</strong>이 있거나 목적에 맞게 설계한 모델 클래스가
                필요할 때 함수형 API나 서브클래싱 API를 씁니다.
              </p>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "2. 예: 텐서플로를 이용한 다층 퍼셉트론 구현 — tf.keras.layers.Dense 클래스",
          }}
        >
          <Card>
            <CardTitle>Dense — 은닉층 및 출력층을 위한 완전연결층</CardTitle>
            <Code
              lines={[
                {
                  t: "tf.keras.layers.Dense(units, activation=None, use_bias=True,",
                },
                { t: "                      kernel_initializer='glorot_uniform'," },
                { t: "                      bias_initializer='zeros')" },
              ]}
            />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {DENSE_PARAMS.map((p, i) => (
                <Chip3 key={p.k} active={param === i} onClick={() => setParam(i)}>
                  <code className="font-mono">{p.k}</code>
                </Chip3>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={param}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-[12.5px] leading-5 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
              >
                {DENSE_PARAMS[param].v}
              </motion.p>
            </AnimatePresence>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone="amber">첫째 인수 units = 출력의 수</Pill>
              <Pill tone="gray">입력의 수는 이전 층이 결정한다</Pill>
              <Pill tone="green">use_bias 기본값 True</Pill>
            </div>
            <Hint>
              입력의 수는 이 문장만으로는 알 수 없습니다. 이전 층의 출력이 입력으로 연결되기
              때문입니다. 반대로 출력의 수는 units 하나로 정해집니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
