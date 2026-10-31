"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, ConceptRows, Hint, P, Scroller } from "./ui";

/**
 * 14.2.2 심층 Q-신경망(DQN) — 불안정성의 원인과 해결책, 그림 14-14 DQN 구조.
 * 층 구성은 교재 그대로이고, 콘볼루션층의 출력 크기는 패딩 0을 가정해
 * 앞 강의의 출력 크기 식으로 이 화면에서 계산한 것이다.
 */

type Cause = "corr" | "moving";

const CAUSES: Record<Cause, { cause: string; why: string; fix: string; how: string }> = {
  corr: {
    cause: "데이터 간의 높은 상관관계",
    why: "강화학습의 학습 데이터는 시간의 흐름에 따라 순차적으로 수집되므로 근접한 데이터들 사이에 높은 상관관계가 있다. 이런 데이터를 그대로 입력으로 쓰면 학습이 불안정해진다.",
    fix: "경험 재현 experience replay",
    how: "재현을 통해 학습 데이터의 시퀀스를 재구성한다.",
  },
  moving: {
    cause: "목표 출력값이 시간에 따라 변하는 시변성(non-stationary)",
    why: "(식 14-20)에서 목표 출력값 rₜ + γ max Q̂(sₜ₊₁, a′ | θ)도 Q-함수에 의존하므로, Q-함수를 갱신하면 목표 출력값도 함께 움직인다. 학습 중에 목적함수 자체가 변하는 셈이다.",
    fix: "목표망 target network",
    how: "원래 Q-신경망과 같은 구조, 다른 파라미터 θ⁻를 가진 별도의 신경망으로 목표 출력값을 계산한다.",
  },
};

type Layer = {
  id: string;
  name: string;
  spec: string;
  out: string;
  calc?: { label: string; expr: string; answer: number };
  added?: boolean;
};

const LAYERS_2013: Layer[] = [
  {
    id: "in",
    name: "입력층",
    spec: "최근 4개의 프레임을 84×84 그레이 영상으로 만들어 스택에 쌓음",
    out: "84 × 84 × 4",
  },
  {
    id: "c1",
    name: "첫 번째 콘볼루션층",
    spec: "보폭 4, 8×8 크기의 필터 16개 적용 뒤 ReLU",
    out: "20 × 20 × 16",
    calc: { label: "(84 − 8) ÷ 4 + 1", expr: "84, 필터 8, 보폭 4", answer: 20 },
  },
  {
    id: "c2",
    name: "두 번째 콘볼루션층",
    spec: "보폭 2, 4×4 크기의 필터 32개 적용 뒤 ReLU",
    out: "9 × 9 × 32",
    calc: { label: "(20 − 4) ÷ 2 + 1", expr: "20, 필터 4, 보폭 2", answer: 9 },
  },
  {
    id: "fc1",
    name: "첫 번째 완전연결층",
    spec: "256개의 노드를 가진 하나의 은닉층과 ReLU",
    out: "256",
  },
  {
    id: "fc2",
    name: "두 번째 완전연결층",
    spec: "각각의 유효한 행동에 대해 단일 출력을 갖도록 선형으로 완전연결",
    out: "→ 18",
  },
  {
    id: "out",
    name: "출력층",
    spec: "18가지의 조이스틱 조작 행동에 대응하는 Q-값을 출력",
    out: "18",
  },
];

const LAYERS_2015: Layer[] = [
  LAYERS_2013[0],
  { ...LAYERS_2013[1], out: "—", calc: undefined },
  { ...LAYERS_2013[2], out: "—", calc: undefined },
  {
    id: "c3",
    name: "세 번째 콘볼루션층 (추가)",
    spec: "보폭 1, 3×3 크기의 필터 64개",
    out: "—",
    added: true,
  },
  { ...LAYERS_2013[3], spec: "은닉층의 노드 512개", out: "512", added: true },
  LAYERS_2013[4],
  LAYERS_2013[5],
];

const PREP = [
  { k: "원래 영상", v: "210 × 160, 128컬러" },
  { k: "그레이 영상으로 축소", v: "110 × 84" },
  { k: "가운데 부분만 잘라냄", v: "84 × 84" },
  { k: "최근 4개 프레임을 스택에", v: "84 × 84 × 4" },
];

export default function DqnArchitecture() {
  const [cause, setCause] = useState<Cause>("corr");
  const [ver, setVer] = useState<"2013" | "2015">("2013");
  const [layerId, setLayerId] = useState("c1");
  const [guess, setGuess] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const layers = ver === "2013" ? LAYERS_2013 : LAYERS_2015;
  const layer = layers.find((l) => l.id === layerId) ?? layers[0];
  const c = CAUSES[cause];

  return (
    <section id="dqn" className="scroll-mt-32">
      <SectionTitle
        title="Q-신경망 학습의 불안정성과 DQN"
        subtitle="수렴이 보장되지 않는 두 가지 이유, 그리고 아타리 게임에 쓰인 심층 신경망 구조"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "14.2.2 심층 Q-신경망 — 불안정성의 원인", slides: "Q-신경망 학습의 불안정성" }}>
          <Card>
            <CardTitle>불안정성의 원인 → 해결책</CardTitle>
            <P>
              Q-테이블 표현에 대해서는 수렴하지만, Q-신경망에서는 수렴이 보장되지 않는다. 원인을 누르면
              DQN이 쓰는 해결책이 짝지어 나타난다.
            </P>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
              <div className="space-y-1.5">
                {(Object.keys(CAUSES) as Cause[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setCause(k)}
                    aria-pressed={cause === k}
                    className={`w-full rounded-lg border p-2.5 text-left text-[12.5px] font-semibold transition-colors ${
                      cause === k
                        ? "border-rose-400 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-200"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    {CAUSES[k].cause}
                  </button>
                ))}
              </div>
              <span className="hidden text-2xl text-gray-300 md:block">→</span>
              <motion.div
                key={cause}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg border border-cyan-300 bg-cyan-50/60 p-3 dark:border-cyan-800 dark:bg-cyan-950/30"
              >
                <p className="text-[13px] font-bold text-cyan-700 dark:text-cyan-300">{c.fix}</p>
                <p className="mt-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">{c.how}</p>
              </motion.div>
            </div>
            <p className="mt-3 rounded-lg bg-gray-50 p-3 text-[12.5px] leading-6 text-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
              {c.why}
            </p>
            <Hint>
              해결책을 한 줄로 — DQN Deep Q-Network: 심층 신경망 + 경험 재현 experience replay + 목표망
              target network. 경험 재현과 목표망이 각각 어느 원인에 대응하는지 뒤바꾸지 않는 것이 핵심이다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "14.2.2 심층 Q-신경망 — 그림 14-14 DQN 구조", slides: "Deep Q-Network" }}>
          <Card>
            <CardTitle>DQN — 아타리 게임을 위한 신경망 구조</CardTitle>
            <ConceptRows
              rows={[
                {
                  k: "정의",
                  v: "합성곱 신경망(CNN) 구조를 이용하여 원래 영상의 픽셀 데이터를 입력으로 받아들여 미래 보상을 추정하는 행동 가치함수의 근사함수(function approximator).",
                },
                {
                  k: "오답 기준",
                  v: "DQN의 기반은 CNN이다. LSTM 같은 순환 신경망 기반 모델이 아니다. 입력 4개 프레임은 시퀀스로 처리되는 것이 아니라 채널 4개로 쌓여 한 번에 콘볼루션층에 들어간다.",
                },
              ]}
            />

            <div className="mt-4">
              <p className="mb-1.5 text-[11px] font-semibold text-gray-500">입력 전처리 — 한 시점의 게임 화면을 하나의 상태로</p>
              <Scroller>
                <div className="flex min-w-[460px] items-stretch gap-1.5">
                  {PREP.map((x, i) => (
                    <div key={x.k} className="flex flex-1 items-center gap-1.5">
                      <div className="flex-1 rounded-lg border border-gray-200 p-2 text-center dark:border-gray-700">
                        <p className="text-[10.5px] text-gray-500">{x.k}</p>
                        <p className="font-mono text-[12px] font-bold text-gray-800 dark:text-gray-100">{x.v}</p>
                      </div>
                      {i < PREP.length - 1 && <span className="text-gray-300">→</span>}
                    </div>
                  ))}
                </div>
              </Scroller>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <Chip active={ver === "2013"} onClick={() => setVer("2013")}>
                처음 DQN
              </Chip>
              <Chip active={ver === "2015"} onClick={() => setVer("2015")}>
                2015년 논문의 더 깊은 구조
              </Chip>
            </div>

            <Scroller>
              <div className="mt-3 flex min-w-[520px] items-end gap-1.5">
                {layers.map((l, i) => {
                  const on = l.id === layer.id;
                  const height = l.id === "in" ? 96 : l.id.startsWith("c") ? 80 - i * 6 : l.id === "fc1" ? 46 : l.id === "fc2" ? 34 : 26;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLayerId(l.id)}
                      className="flex flex-1 flex-col items-center gap-1"
                    >
                      <motion.div
                        animate={{ height }}
                        className={`w-full rounded-md border-2 ${
                          on
                            ? "border-cyan-600 bg-cyan-100 dark:bg-cyan-900/50"
                            : l.added
                              ? "border-dashed border-amber-400 bg-amber-50 dark:bg-amber-950/30"
                              : "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800"
                        }`}
                      />
                      <span className="text-center text-[10px] leading-tight text-gray-600 dark:text-gray-300">
                        {l.name.replace(" (추가)", "")}
                      </span>
                      <span className="font-mono text-[10px] text-gray-500">{l.out}</span>
                    </button>
                  );
                })}
              </div>
            </Scroller>

            <motion.div
              key={`${ver}-${layer.id}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60"
            >
              <p className="text-[13px] font-bold text-gray-800 dark:text-gray-100">{layer.name}</p>
              <p className="mt-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">{layer.spec}</p>
              {layer.calc && (
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px]">
                  <span className="text-gray-600 dark:text-gray-300">
                    출력 한 변 = (입력 − 필터) ÷ 보폭 + 1 — 입력 {layer.calc.expr} →
                  </span>
                  <input
                    value={guess[layer.id] ?? ""}
                    onChange={(e) => {
                      setGuess((g) => ({ ...g, [layer.id]: e.target.value }));
                      setChecked((c) => ({ ...c, [layer.id]: false }));
                    }}
                    onKeyDown={(e) => e.key === "Enter" && setChecked((c) => ({ ...c, [layer.id]: true }))}
                    inputMode="numeric"
                    className="w-16 rounded-md border border-gray-300 bg-white px-2 py-0.5 font-mono dark:border-gray-600 dark:bg-gray-900"
                    aria-label="출력 크기 입력"
                  />
                  <button
                    type="button"
                    onClick={() => setChecked((c) => ({ ...c, [layer.id]: true }))}
                    className="rounded-md border border-cyan-600 px-2 py-0.5 text-[11px] font-semibold text-cyan-700 dark:text-cyan-300"
                  >
                    검산
                  </button>
                  {checked[layer.id] &&
                    (Number(guess[layer.id]) === layer.calc.answer ? (
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle size={13} /> {layer.calc.label} = {layer.calc.answer}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-600">
                        <XCircle size={13} /> 입력에서 필터 크기를 빼고 보폭으로 나눈 뒤 1을 더한다
                      </span>
                    ))}
                </div>
              )}
              {ver === "2015" && layer.added && (
                <p className="mt-2 text-[11.5px] text-amber-700 dark:text-amber-300">
                  2015년에 발표된 논문에서 신경망의 구조가 더 깊어지며 바뀐 부분이다.
                </p>
              )}
            </motion.div>

            <div className="mt-3 space-y-2">
              <ComputedNote>
                콘볼루션층의 출력 크기(20 × 20, 9 × 9)는 원자료에 적혀 있지 않습니다. 패딩 0을 가정하고
                콘볼루션 출력 크기 식으로 이 화면에서 계산한 값입니다. 2015년 구조는 교재가 밝힌 변경점(세 번째
                콘볼루션층 추가, 은닉층 노드 512개)만 표시하고 크기는 계산하지 않았습니다.
              </ComputedNote>
              <Hint>
                요약하면 입력층과 출력층을 제외하고 2개의 콘볼루션층(나중에 하나 더 추가됨)과 2개의
                완전연결층으로 구성된다. 행동 가치함수 Q와 목표망 Q̂는 같은 구조의 심층 신경망이다.
              </Hint>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
