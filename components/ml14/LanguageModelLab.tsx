"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, Formula, Hint, Scroller, Slider } from "./ui";

/**
 * 13.2.3 언어 모델을 위한 딥러닝 — 언어 모델의 정의와 RNN 기반 언어 모델.
 * 비교하는 문장 쌍은 강의록 그대로이고, 조건부확률 값은 이 화면에서 정한 것이다.
 */

interface Factor {
  word: string;
  /** 앞 단어들이 주어졌을 때 이 단어가 올 조건부확률 — 이 화면에서 정한 값 */
  p: number;
}

interface Pair {
  key: string;
  label: string;
  use: string;
  why: string;
  good: Factor[];
  /** 앞부분은 같고 마지막 단어만 다르다 */
  badLast: Factor;
}

const PAIRS: Pair[] = [
  {
    key: "bus",
    label: "나는 버스를 탄다 / 태운다",
    use: "문장생성(요약, 번역 등)",
    why: "“나는 버스를 태운다”는 문법적인 오류는 없으나 의미상으로 적절하지 못하므로 낮은 확률값을 가져야 한다.",
    good: [
      { word: "나는", p: 0.2 },
      { word: "버스를", p: 0.05 },
      { word: "탄다", p: 0.6 },
    ],
    badLast: { word: "태운다", p: 0.01 },
  },
  {
    key: "typo",
    label: "빠르게 달려갔다 / 잘려갔다",
    use: "오타 교정",
    why: "‘달’을 ‘잘’로 잘못 친 오타는 실제 자연어 표현에서 거의 관찰되지 않으므로 낮은 확률값이 나와야 한다.",
    good: [
      { word: "빠르게", p: 0.1 },
      { word: "달려갔다", p: 0.3 },
    ],
    badLast: { word: "잘려갔다", p: 0.002 },
  },
];

function fmtP(v: number): string {
  if (v >= 0.001) return v.toFixed(4);
  return v.toExponential(2);
}

function condLabel(words: string[], i: number): string {
  if (i === 0) return `P(${words[0]})`;
  return `P(${words[i]} | ${words.slice(0, i).join(" ")})`;
}

/* RNN 언어 모델 — 그림 13-24 */
const SENT = ["The", "bird", "with", "black", "feathers", "is", "on", "the", "tree", "."];
const VOCAB_HINT = ["bird", "tree", "with", "feathers", "is", "black"];

export default function LanguageModelLab() {
  const [pairIdx, setPairIdx] = useState(0);
  const [k, setK] = useState(0); // 곱에 포함한 인자 수
  const pair = PAIRS[pairIdx];
  const [badP, setBadP] = useState(pair.badLast.p);

  const goodWords = pair.good.map((f) => f.word);
  const badFactors: Factor[] = [...pair.good.slice(0, -1), { ...pair.badLast, p: badP }];
  const badWords = badFactors.map((f) => f.word);
  const n = pair.good.length;
  const prod = (fs: Factor[], upto: number) => fs.slice(0, upto).reduce((s, f) => s * f.p, 1);
  const pGood = prod(pair.good, n);
  const pBad = prod(badFactors, n);
  // 곱셈 반올림 오차 때문에 정확히 같은 값도 ===로는 다르게 나올 수 있다
  const tie = Math.abs(pGood - pBad) < 1e-12;
  const goodWins = !tie && pGood > pBad;

  const choosePair = (i: number) => {
    setPairIdx(i);
    setK(0);
    setBadP(PAIRS[i].badLast.p);
  };

  /* RNN 단계 */
  const [mode, setMode] = useState<"next" | "sentiment">("next");
  const [t, setT] = useState(0);
  const [guess, setGuess] = useState<string | null>(null);
  const steps = SENT.length - 1; // 마지막 '.'은 출력만
  const target = SENT[t + 1];
  const options = Array.from(new Set([target, ...VOCAB_HINT])).slice(0, 4).sort();

  const move = (d: number) => {
    setT((v) => Math.min(steps - 1, Math.max(0, v + d)));
    setGuess(null);
  };

  return (
    <section id="language-model" className="scroll-mt-32">
      <SectionTitle
        title="언어 모델 — 문장이 얼마나 자연스러운지 확률로"
        subtitle="단어 시퀀스를 넣으면 확률값이 나오는 함수, 그리고 그 함수를 RNN으로 학습하는 방법"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "13.2.3 언어 모델을 위한 딥러닝", slides: "언어모델", lecture: "n-gram의 조건부확률을 모두 곱하는 전통적 방법에서 주로 RNN을 쓰는 딥러닝 방법으로 넘어왔다고 정리" }}>
          <Card>
            <CardTitle>정의 — 단어 시퀀스를 입력으로 받아 확률값을 출력하는 일종의 함수</CardTitle>
            <Scroller>
              <div className="flex min-w-[420px] items-center justify-center gap-3 py-2 text-[12px]">
                <span className="rounded-md bg-gray-100 px-2 py-1 font-mono dark:bg-gray-800">
                  𝑤₁, 𝑤₂, ⋯, 𝑤ₙ
                </span>
                <span className="text-gray-300">→</span>
                <span className="rounded-md border-2 border-violet-400 px-3 py-1 font-bold text-violet-700 dark:text-violet-300">
                  언어 모델
                </span>
                <span className="text-gray-300">→</span>
                <span className="rounded-md bg-gray-100 px-2 py-1 font-mono dark:bg-gray-800">
                  P(𝑤₁, 𝑤₂, ⋯, 𝑤ₙ)
                </span>
              </div>
            </Scroller>
            <p className="mt-2 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              출력 P(·)는 주어진 단어의 시퀀스가 <strong>자연어 표현으로서 얼마나 적절한지를
              평가하는 값</strong>이다. 교재는 이를 “실제로 사용되는 자연어 표현에서 관찰될
              가능성”이라고 풀어 쓴다. 따라서 오타로 단어가 잘못 표현되거나, 문법에 맞지 않거나,
              의미상 맞지 않는 표현에는 낮은 확률값이 나와야 한다. 언어 모델을 일단 학습해 두면
              이후 다양한 텍스트 분석 작업에 활용할 수 있다.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[11px] font-bold text-gray-500">구현 방법 ① 조건부확률 (기존)</p>
                <Formula className="mt-2">P(𝑤₁, ⋯, 𝑤ₙ) = ∏ᵢ₌₁ⁿ P(𝑤ᵢ | 𝑤₁, ⋯, 𝑤ᵢ₋₁)</Formula>
                <Hint>앞에 나온 단어들이 주어졌을 때 다음 단어가 나올 확률을 차례로 곱한다.</Hint>
              </div>
              <div className="rounded-lg border border-violet-300 p-3 dark:border-violet-700">
                <p className="text-[11px] font-bold text-violet-600 dark:text-violet-400">
                  구현 방법 ② 신경망(딥러닝) — 주로 RNN 사용
                </p>
                <p className="mt-2 text-[12px] leading-6 text-gray-700 dark:text-gray-200">
                  최근에는 딥러닝 모델을 활용하여 학습을 통해 언어 모델을 획득한다. 시퀀스를
                  효율적으로 다룰 수 있는 RNN 모델이 주로 사용되어 왔다.
                </p>
              </div>
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "13.2.3 언어 모델을 위한 딥러닝", slides: "언어모델 — 언어 모델의 활용", lecture: "‘나는 버스를’ 다음에 ‘탄다’가 올 확률(예: 0.8)이 ‘태운다’(0.1)보다 높으니 더 적합하다는 식으로 문장 생성·오타 교정을 설명" }}>
          <Card>
            <CardTitle>조건부확률의 곱으로 두 문장 비교하기</CardTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              {PAIRS.map((p, i) => (
                <Chip key={p.key} active={pairIdx === i} onClick={() => choosePair(i)}>
                  {p.label}
                </Chip>
              ))}
            </div>
            <p className="mb-3 text-[11.5px] text-gray-500">
              활용: <strong className="text-violet-600 dark:text-violet-400">{pair.use}</strong> — 두
              문장은 마지막 단어만 다르다. 앞부분의 인자는 똑같으므로, 승부는 마지막 인자에서 난다.
            </p>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                { title: "적절한 문장", fs: pair.good, words: goodWords, total: pGood, tone: "violet" },
                { title: "부적절한 문장", fs: badFactors, words: badWords, total: pBad, tone: "rose" },
              ].map((col) => (
                <div
                  key={col.title}
                  className={`rounded-lg border p-3 ${
                    col.tone === "violet"
                      ? "border-violet-300 dark:border-violet-700"
                      : "border-rose-300 dark:border-rose-800"
                  }`}
                >
                  <p className="text-[11px] font-bold text-gray-500">{col.title}</p>
                  <p className="mb-2 text-[13px] font-bold text-gray-800 dark:text-gray-100">
                    “{col.words.join(" ")}”
                  </p>
                  <div className="space-y-1">
                    {col.fs.map((f, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between rounded-md px-2 py-1 font-mono text-[11.5px] transition-opacity ${
                          i < k ? "bg-gray-50 opacity-100 dark:bg-gray-800/60" : "opacity-30"
                        }`}
                      >
                        <span>{condLabel(col.words, i)}</span>
                        <span>{f.p.toFixed(3)}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-right font-mono text-[12.5px] font-bold">
                    곱 = {k === 0 ? "—" : fmtP(prod(col.fs, k))}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setK((v) => Math.max(0, v - 1))}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-700"
              >
                <ChevronLeft size={13} /> 이전 인자
              </button>
              <button
                type="button"
                onClick={() => setK((v) => Math.min(n, v + 1))}
                className="flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs text-white"
              >
                다음 인자 곱하기 <ChevronRight size={13} />
              </button>
              <span className="text-[11px] text-gray-500">
                {k} / {n} 인자
              </span>
            </div>

            <div className="mt-3">
              <Slider
                label={`부적절한 문장의 마지막 인자 ${condLabel(badWords, n - 1)}`}
                value={badP}
                min={0.001}
                max={0.9}
                step={0.001}
                onChange={setBadP}
                display={badP.toFixed(3)}
              />
            </div>

            {k === n && (
              <p
                className={`mt-3 rounded-lg p-3 text-[12.5px] leading-6 ${
                  goodWins
                    ? "bg-violet-50 text-violet-900 dark:bg-violet-950/40 dark:text-violet-100"
                    : "bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100"
                }`}
              >
                P(“{goodWords.join(" ")}”) = {fmtP(pGood)} {goodWins ? ">" : tie ? "=" : "<"} P(“
                {badWords.join(" ")}”) = {fmtP(pBad)}.{" "}
                {goodWins
                  ? pair.why
                  : tie
                    ? "두 문장이 같은 확률이 되어 언어 모델이 의미상 부적절한 문장을 구별하지 못한다 — 그런 언어 모델은 학습이 잘못된 것이다."
                    : "마지막 인자를 이렇게 크게 주면 잘못된 문장이 더 자연스럽다고 평가된다 — 그런 언어 모델은 학습이 잘못된 것이다."}
              </p>
            )}

            <div className="mt-3">
              <ComputedNote>
                비교하는 문장 쌍과 부등호의 방향은 강의록 그대로입니다. 각 조건부확률의 숫자는 곱을
                직접 해 보도록 이 화면에서 정한 값이며 원자료에는 없습니다.
              </ComputedNote>
            </div>
            <Hint>
              오답 기준 — 언어 모델은 문법 검사기가 아니다. “버스를 태운다”처럼 문법에 맞아도 의미상
              부적절하면 낮은 확률이 나와야 한다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "13.2.3 — (1) 언어 모델을 위한 RNN 구조",
            slides: "RNN 기반 언어모델", lecture: "한 번에 한 단어씩 입력받아 바로 다음 단어를 출력하도록 학습시키는 것이 언어 모델의 가장 기본적인 형태라고 강조",
          }}
        >
          <Card>
            <CardTitle>RNN 기반 언어 모델 — 한 번에 한 단어씩</CardTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              <Chip active={mode === "next"} onClick={() => setMode("next")}>
                언어 모델 학습 — 다음 단어 예측
              </Chip>
              <Chip active={mode === "sentiment"} onClick={() => setMode("sentiment")}>
                감성 분류 — 마지막에만 출력
              </Chip>
            </div>

            <Scroller>
              <div className="flex min-w-[640px] items-end gap-1.5">
                {SENT.slice(0, steps).map((w, i) => {
                  const active = mode === "next" ? i === t : true;
                  const done = mode === "next" ? i < t : false;
                  const isLast = i === steps - 1;
                  const showOut = mode === "next" ? i < t || (i === t && guess !== null) : isLast;
                  return (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1 text-[10px]">
                      <div
                        className={`h-7 w-full rounded-md border text-center font-mono leading-7 ${
                          showOut
                            ? "border-violet-400 bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"
                            : "border-dashed border-gray-300 text-gray-300 dark:border-gray-700"
                        }`}
                      >
                        {mode === "next"
                          ? showOut
                            ? SENT[i + 1]
                            : "?"
                          : isLast
                            ? "긍정/부정"
                            : ""}
                      </div>
                      <span className="text-gray-300">↑</span>
                      <div
                        className={`w-full rounded-md py-1 text-center font-semibold ${
                          active && mode === "next"
                            ? "bg-violet-600 text-white"
                            : done || mode === "sentiment"
                              ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200"
                              : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                        }`}
                      >
                        LSTM
                      </div>
                      <span className="text-gray-300">↑</span>
                      <div className="w-full rounded-md bg-gray-100 py-1 text-center text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        embedding
                      </div>
                      <span className="text-gray-300">↑</span>
                      <div className="w-full rounded-md border border-gray-200 py-0.5 text-center text-gray-500 dark:border-gray-700">
                        one-hot
                      </div>
                      <span className="font-mono text-[11px] font-bold text-gray-700 dark:text-gray-200">
                        {w}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Scroller>
            <p className="mt-1 text-center text-[10px] text-gray-400">
              옆 LSTM 셀로 은닉 상태가 넘어가며 앞 단어들의 정보가 쌓인다
            </p>

            {mode === "next" ? (
              <div className="mt-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[12.5px] text-gray-700 dark:text-gray-200">
                  {t + 1}번째 LSTM 셀의 입력은 <strong>“{SENT[t]}”</strong>. 목표 출력은 무엇일까?
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {options.map((o) => (
                    <button
                      key={o}
                      type="button"
                      disabled={guess !== null}
                      onClick={() => setGuess(o)}
                      className={`rounded-lg border px-3 py-1 font-mono text-xs ${
                        guess === null
                          ? "border-gray-200 hover:bg-violet-50 dark:border-gray-700"
                          : o === target
                            ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                            : o === guess
                              ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                              : "border-gray-200 opacity-50 dark:border-gray-700"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
                {guess !== null && (
                  <p className="mt-2 text-[12px] leading-6 text-gray-600 dark:text-gray-300">
                    {guess === target ? "맞다. " : "아니다. "}목표 출력은 바로 다음 단어인 “{target}”다.
                    학습을 위한 목표 출력은 이어지는 단어의 시퀀스로부터 쉽게 얻을 수 있다 — 따로
                    레이블을 달 필요가 없다.
                  </p>
                )}
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-700"
                  >
                    <ChevronLeft size={13} /> 이전 셀
                  </button>
                  <button
                    type="button"
                    onClick={() => move(1)}
                    className="flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs text-white"
                  >
                    다음 셀 <ChevronRight size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setT(0);
                      setGuess(null);
                    }}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-700"
                  >
                    <RotateCcw size={13} /> 처음
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-3 rounded-lg bg-gray-50 p-3 text-[12.5px] leading-6 text-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
                같은 구조를 텍스트 분류에도 쓸 수 있다. 감성 분류라면 리뷰 문장을 입력으로 주고, 단어마다
                다음 단어를 내는 대신 <strong>최종 목표 출력으로 분류 결과(긍정, 부정 등)</strong>를
                내도록 학습한다. 기사의 주제분류 등 다양한 텍스트 분류 문제에도 같은 방식으로
                활용한다. (위 그림의 영어 문장은 구조를 보이기 위해 그대로 둔 것이다.)
              </p>
            )}

            <ul className="mt-3 space-y-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              <li>
                • 입력 단어는 먼저 <strong>원핫벡터</strong>로 표현하고, 워드 임베딩에 적용해 저차원의
                실수 벡터를 얻은 뒤, 이것을 LSTM의 입력으로 전달한다.
              </li>
              <li>
                • 각 LSTM 셀이 한 번에 한 단어씩 입력받고 바로 다음 단어를 출력하도록 학습함으로써
                자연스러운 단어의 시퀀스를 학습한다.
              </li>
              <li>
                • 활용 → 텍스트 분류(감성분류, 주제분류 등), 기계번역 등. 단, 문장을 받아 <em>다른
                문장</em>으로 출력하는 기계번역은 이 모델의 확장이 필요하며, 그 대표가 Seq2Seq 모델이다.
              </li>
            </ul>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
