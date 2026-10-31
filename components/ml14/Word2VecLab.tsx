"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, Formula, Hint, Scroller, Slider, LectureNote } from "./ui";

/**
 * 13.2.2 자연어처리를 위한 머신러닝 기법 — (4) 데이터 분석: 워드 임베딩과 Word2Vec.
 * 슬라이딩 윈도우 예문·CBoW/Skip-gram 구조는 교재 그림 13-22와 강의록 그대로이다.
 * 룩업 테이블의 W 값과 2차원 산점도 좌표는 원리를 보이려고 이 화면에서 정한 값이다.
 */

const SENT = ["The", "bird", "with", "black", "feathers", "is", "on", "the", "tree"];

const VOCAB = ["먹고", "싶은", "수박", "토마토", "크고", "무거운", "과일", "가격", "비싸다"];
/** 9 × 3 선형변환행렬 W — 학습 결과가 아니라 이 화면에서 정한 예시 값 */
const W: number[][] = [
  [0.21, -0.47, 0.33],
  [0.18, -0.52, 0.29],
  [0.84, 0.12, -0.36],
  [0.79, 0.2, -0.41],
  [-0.33, 0.65, 0.08],
  [-0.28, 0.71, 0.15],
  [0.88, 0.05, -0.22],
  [-0.61, -0.18, 0.57],
  [-0.55, -0.09, 0.62],
];

type Mode = "cbow" | "skip";

/** 그림 13-23의 관계를 재구성한 좌표 — 성별 관계는 (+1, +2), 단수→복수는 (+2, −0.7)로 맞춤 */
const POINTS: { w: string; x: number; y: number }[] = [
  { w: "MAN", x: 1, y: 1 },
  { w: "WOMAN", x: 2, y: 3 },
  { w: "UNCLE", x: 3, y: 1.2 },
  { w: "AUNT", x: 4, y: 3.2 },
  { w: "KING", x: 5, y: 1.5 },
  { w: "QUEEN", x: 6, y: 3.5 },
  { w: "KINGS", x: 7, y: 0.8 },
  { w: "QUEENS", x: 8, y: 2.8 },
];
const GENDER: [string, string][] = [
  ["MAN", "WOMAN"],
  ["UNCLE", "AUNT"],
  ["KING", "QUEEN"],
];
const PLURAL: [string, string][] = [
  ["KING", "KINGS"],
  ["QUEEN", "QUEENS"],
];

const DRILL: { s: string; ok: boolean; why: string }[] = [
  {
    s: "워드 임베딩은 유사한 의미의 단어를 벡터 공간에서 가깝게 표현한다.",
    ok: true,
    why: "워드 임베딩의 목적 그대로다 — 단어 간의 의미적 유사성을 벡터화한다.",
  },
  {
    s: "Word2Vec은 자연어처리를 위한 언어 모델이다.",
    ok: false,
    why: "Word2Vec은 대표적인 워드 임베딩 방법이다. 언어 모델은 Seq2Seq·Attention·Transformer·BERT 쪽이다.",
  },
  {
    s: "워드 임베딩의 대표적인 방법으로 BERT가 있다.",
    ok: false,
    why: "대표 방법은 Word2Vec(CBOW, Skip-gram), LSA, GloVe 등이다. BERT는 Transformer 인코더 기반의 언어 모델이다.",
  },
  {
    s: "워드 임베딩은 원핫벡터를 밀집 고차원 벡터로 변환한다.",
    ok: false,
    why: "밀집은 맞지만 고차원이 아니라 저차원이다. 고차원(=단어집합의 크기)인 쪽은 원핫벡터다.",
  },
  {
    s: "임베딩 벡터의 각 요소는 이진값이다.",
    ok: false,
    why: "0과 1로 구성되는 것은 원핫벡터다. 임베딩 벡터의 값은 실수값이다.",
  },
  {
    s: "워드 임베딩은 기본적으로 원핫벡터를 기반으로 한다.",
    ok: true,
    why: "Word2Vec은 원핫 표현을 선형변환행렬 W로 사영해 임베딩 벡터를 얻는다.",
  },
  {
    s: "Skip-gram은 주변 단어들을 입력으로 받아 중심 단어를 예측한다.",
    ok: false,
    why: "그것은 CBoW다. Skip-gram은 중심 단어를 입력으로 받아 주변 단어들을 예측한다.",
  },
];

const SX = (x: number) => 20 + (x - 0.5) * 46;
const SY = (y: number) => 190 - y * 45;

export default function Word2VecLab() {
  const [view, setView] = useState<"onehot" | "embed">("onehot");

  const [mode, setMode] = useState<Mode>("cbow");
  const [n, setN] = useState(2);
  const [c, setC] = useState(3);
  const ctx = SENT.map((_, i) => i).filter((i) => i !== c && Math.abs(i - c) <= n);

  const [lw, setLw] = useState(2);

  const [showG, setShowG] = useState(true);
  const [showP, setShowP] = useState(false);
  const pt = (w: string) => POINTS.find((p) => p.w === w)!;

  const [picks, setPicks] = useState<(boolean | null)[]>(DRILL.map(() => null));

  /* SVG 다이어그램 배치 */
  const left = mode === "cbow" ? ctx.map((i) => SENT[i]) : [SENT[c]];
  const right = mode === "cbow" ? [SENT[c]] : ctx.map((i) => SENT[i]);
  const H = 230;
  const ys = (k: number, total: number) => (H / (total + 1)) * (k + 1);
  const PX = 230;
  const PY = H / 2;

  return (
    <section id="word2vec" className="scroll-mt-32">
      <SectionTitle
        title="데이터 분석 — 워드 임베딩과 Word2Vec"
        subtitle="빈도수를 넘어, 문맥을 학습해서 단어의 의미를 담은 벡터를 얻는다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "13.2.2 자연어처리를 위한 머신러닝 기법 — (4) 데이터 분석",
            slides: "데이터분석 — 워드 임베딩", lecture: "워드 임베딩은 PCA처럼 원핫 벡터 x에 변환행렬 W를 곱해 저차원 y로 바꾸는 것이며, 수십만~수백만 차원의 원핫 벡터를 보통 300차원 정도로 줄인다고 설명",
          }}
        >
          <Card>
            <CardTitle>워드 임베딩 word embedding</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              단어의 의미를 포함하는 벡터(“<strong>임베딩 벡터</strong>”)로 표현하는 방법이다. 원핫벡터를{" "}
              <strong>저차원 실수 공간의 벡터</strong>로 변환한다. 목적은 유사한 의미의 단어를 벡터 공간에서
              가까운 위치에 표현하는 것, 즉 단어 간의 의미적 유사성을 벡터화하는 것이다. 방법으로는
              Word2Vec(CBOW, Skip-gram), LSA(잠재의미분석), GloVe 등이 있다.
            </p>
            <div className="mb-3 flex gap-2">
              <Chip active={view === "onehot"} onClick={() => setView("onehot")}>
                원핫벡터
              </Chip>
              <Chip active={view === "embed"} onClick={() => setView("embed")}>
                임베딩 벡터
              </Chip>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {(view === "onehot"
                ? [
                    { k: "차원", v: "고차원(= 단어집합의 크기) → 희소 벡터의 형태" },
                    { k: "표현 방법", v: "수동" },
                    { k: "값", v: "0과 1로 구성" },
                  ]
                : [
                    { k: "차원", v: "저차원 → 밀집 벡터의 형태" },
                    { k: "표현 방법", v: "학습 데이터로부터 학습" },
                    { k: "값", v: "실수값" },
                  ]
              ).map((r) => (
                <div key={r.k} className="rounded-lg bg-violet-50 p-2.5 dark:bg-violet-950/30">
                  <p className="text-[10.5px] font-semibold text-violet-600 dark:text-violet-400">{r.k}</p>
                  <p className="text-[12.5px] text-gray-700 dark:text-gray-200">{r.v}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 font-mono text-[12px] text-gray-700 dark:text-gray-200">
              수박 ={" "}
              {view === "onehot"
                ? "[0, 0, 1, 0, 0, 0, 0, 0, 0]"
                : `[${W[2].map((v) => v.toFixed(2)).join(", ")}]`}
            </p>
            <LectureNote>
              원핫 벡터는 단어집합의 크기만큼이라 보통 수십만~수백만 차원이고, 워드 임베딩은 이를 보통 300차원 정도의 밀집 벡터로 줄인다. 원리는 PCA와 같다 — 원핫 벡터 𝒙에 변환행렬 W를 곱해 저차원 𝒚로 바꾼다. 꼭 선형변환행렬이 아니어도 𝒙를 𝒚로 매핑하는 함수면 된다.
            </LectureNote>
            <Hint>
              교재: 딥러닝을 이용한 텍스트 분석에서는 원핫벡터를 쓰기도 하지만, 임베딩 벡터는 의미 정보가 잘
              표현되어 있을 뿐 아니라 연속한 실수값을 가지므로 딥러닝 모델의 입력으로 더 적합하다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "13.2.2 자연어처리를 위한 머신러닝 기법 — (4) 데이터 분석",
            slides: "Word2Vec", lecture: "CBoW와 Skip-gram 모두 파이썬 패키지로 제공되며, 실제로는 Skip-gram이 조금 더 많이 쓰이는 것으로 보인다고 언급",
          }}
        >
          <Card>
            <CardTitle>Word2Vec — 슬라이딩 윈도우로 문맥을 학습한다</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              원핫벡터를 저차원의 벡터로 변환하는 <strong>선형변환행렬 W</strong>를 학습으로 찾고, 이를
              이용하여 입력 단어를 사영함으로써 임베딩 벡터를 구한다. 말뭉치의 <strong>문맥 정보</strong>를
              활용하며, 은닉층이 1개인 간단한 구조의 신경망을 쓴다. 문장 위로 윈도우를 옮기면서 n개 단어씩
              학습의 입·출력으로 사용한다.
            </p>

            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Slider label="윈도우 n (중심 단어 앞뒤 n개)" value={n} min={1} max={3} step={1} onChange={setN} />
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => setC((v) => Math.max(0, v - 1))}
                  className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] dark:border-gray-700"
                >
                  <ChevronLeft size={12} /> 이전
                </button>
                <button
                  type="button"
                  onClick={() => setC((v) => Math.min(SENT.length - 1, v + 1))}
                  className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] dark:border-gray-700"
                >
                  다음 <ChevronRight size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setC(3);
                    setN(2);
                  }}
                  className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] dark:border-gray-700"
                >
                  <RotateCcw size={11} /> 그림 그대로
                </button>
              </div>
            </div>

            <Scroller>
              <div className="flex min-w-[420px] flex-wrap gap-1 rounded-lg bg-gray-50 p-2 dark:bg-gray-800/60">
                <span className="mr-1 text-[10.5px] font-semibold text-gray-400">Corpus</span>
                {SENT.map((w, i) => (
                  <button
                    key={`${w}-${i}`}
                    type="button"
                    onClick={() => setC(i)}
                    className={`rounded px-1.5 py-0.5 font-mono text-[12.5px] ${
                      i === c
                        ? "bg-violet-600 font-bold text-white"
                        : ctx.includes(i)
                          ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200"
                          : "text-gray-400"
                    }`}
                  >
                    {w}
                    {i === SENT.length - 1 ? "." : ""}
                  </button>
                ))}
              </div>
            </Scroller>
            <p className="mt-1 text-[11px] text-gray-500">
              진한 칸 = 중심 단어(center word), 옅은 칸 = 문맥 단어(context word). 단어를 눌러도 중심이 옮겨진다.
            </p>

            <div className="my-3 flex gap-2">
              <Chip active={mode === "cbow"} onClick={() => setMode("cbow")}>
                CBoW Continuous Bag of Words
              </Chip>
              <Chip active={mode === "skip"} onClick={() => setMode("skip")}>
                Skip-gram
              </Chip>
            </div>

            <Scroller>
              <svg viewBox={`0 0 460 ${H}`} className="w-full min-w-[420px]" role="img" aria-label="Word2Vec 구조">
                {left.map((w, k) => (
                  <g key={`l-${w}-${k}`}>
                    <line x1={100} y1={ys(k, left.length)} x2={PX - 22} y2={PY} stroke="#8b5cf6" strokeWidth={1.4} />
                    <text
                      x={(100 + PX - 22) / 2}
                      y={(ys(k, left.length) + PY) / 2 - 4}
                      fontSize={10}
                      fill="#7c3aed"
                      textAnchor="middle"
                    >
                      W
                    </text>
                    <rect x={10} y={ys(k, left.length) - 12} width={90} height={24} rx={5} fill="#ede9fe" stroke="#8b5cf6" />
                    <text x={55} y={ys(k, left.length) + 4} fontSize={11} textAnchor="middle" fill="#4c1d95">
                      {w}
                    </text>
                  </g>
                ))}
                {right.map((w, k) => (
                  <g key={`r-${w}-${k}`}>
                    <line x1={PX + 22} y1={PY} x2={360} y2={ys(k, right.length)} stroke="#a78bfa" strokeWidth={1.4} />
                    <text
                      x={(PX + 22 + 360) / 2}
                      y={(ys(k, right.length) + PY) / 2 - 4}
                      fontSize={10}
                      fill="#7c3aed"
                      textAnchor="middle"
                    >
                      W′
                    </text>
                    <rect x={360} y={ys(k, right.length) - 12} width={90} height={24} rx={5} fill="#7c3aed" />
                    <text x={405} y={ys(k, right.length) + 4} fontSize={11} textAnchor="middle" fill="#fff">
                      {w}
                    </text>
                  </g>
                ))}
                <circle cx={PX} cy={PY} r={22} fill="#fff" stroke="#7c3aed" strokeWidth={2} />
                <text x={PX} y={PY - 2} fontSize={9} textAnchor="middle" fill="#4c1d95">
                  projection
                </text>
                <text x={PX} y={PY + 9} fontSize={9} textAnchor="middle" fill="#4c1d95">
                  layer
                </text>
                <text x={55} y={12} fontSize={10} textAnchor="middle" fill="#6b7280">
                  input layer (one-hot)
                </text>
                <text x={405} y={12} fontSize={10} textAnchor="middle" fill="#6b7280">
                  output layer
                </text>
              </svg>
            </Scroller>

            <div className="mt-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <p className="mb-1 text-[11px] font-semibold text-gray-500">
                이 위치에서 만들어지는 학습 쌍 ({mode === "cbow" ? "입력 → 목표" : "입력 → 목표, 문맥 단어마다 하나씩"})
              </p>
              <div className="flex flex-wrap gap-1.5 font-mono text-[12px]">
                {mode === "cbow" ? (
                  <span className="rounded bg-violet-50 px-2 py-0.5 dark:bg-violet-950/40">
                    ({ctx.map((i) => SENT[i]).join(", ")}) → {SENT[c]}
                  </span>
                ) : (
                  ctx.map((i) => (
                    <span key={i} className="rounded bg-violet-50 px-2 py-0.5 dark:bg-violet-950/40">
                      {SENT[c]} → {SENT[i]}
                    </span>
                  ))
                )}
              </div>
            </div>

            <ul className="mt-3 space-y-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              <li>
                • <strong>CBoW</strong>: 주변 단어(문맥 앞뒤의 n개 단어)를 입력으로 받아 <strong>중심 단어를 예측</strong>.
              </li>
              <li>
                • <strong>Skip-gram</strong>: 중심 단어를 입력으로 받아 <strong>주변 단어들을 예측</strong>.
              </li>
              <li>
                • 기본 상태(n = 2, 중심 ‘black’)가 교재 그림 13-22와 같다 — 문맥 단어는 bird, with, feathers, is.
              </li>
              <li>
                • 문장 끝에서는 앞뒤 단어가 모자라 문맥 단어 수가 줄어든다(이 화면의 처리).
              </li>
            </ul>
            <LectureNote>
              CBoW와 Skip-gram은 모두 파이썬 패키지로 제공되므로 필요한 쪽을 쓰면 되는데, 실제로는 Skip-gram이 조금 더 많이 활용되는 것으로 보인다.
            </LectureNote>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "13.2.2 자연어처리를 위한 머신러닝 기법 — (4) 데이터 분석",
            slides: "Word2Vec", lecture: "원핫 벡터는 1인 자리가 하나뿐이라 W 전체를 곱할 필요 없이 그 행만 가져오면 되므로 룩업 테이블에서 꺼내 오는 것과 같다고 설명",
          }}
        >
          <Card>
            <CardTitle>projection layer는 왜 ‘룩업 테이블’인가</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              강의록: projection layer는 일반적인 은닉층과 달리 <strong>활성화 함수가 없고</strong>, 룩업
              테이블이라는 연산을 수행하는 층이다. 원핫벡터에 W를 곱하면 1이 있는 자리의 행 하나만 살아남기
              때문이다. 단어를 골라 보자.
            </p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {VOCAB.map((w, i) => (
                <Chip key={w} active={lw === i} onClick={() => setLw(i)}>
                  {w}
                </Chip>
              ))}
            </div>
            <Scroller>
              <div className="flex min-w-[460px] items-center gap-3">
                <div className="flex flex-col gap-0.5 font-mono text-[11px]">
                  <span className="text-center text-[10px] text-gray-400">원핫 (1×9)</span>
                  {VOCAB.map((w, i) => (
                    <span
                      key={w}
                      className={`w-8 rounded text-center ${i === lw ? "bg-violet-600 font-bold text-white" : "text-gray-300"}`}
                    >
                      {i === lw ? 1 : 0}
                    </span>
                  ))}
                </div>
                <span className="text-gray-400">×</span>
                <div className="flex flex-col gap-0.5 font-mono text-[11px]">
                  <span className="text-center text-[10px] text-gray-400">W (9×3)</span>
                  {W.map((row, i) => (
                    <div
                      key={VOCAB[i]}
                      className={`flex gap-1 rounded px-1 ${
                        i === lw ? "bg-violet-100 font-bold text-violet-800 dark:bg-violet-900/50 dark:text-violet-100" : "text-gray-400"
                      }`}
                    >
                      <span className="w-12 font-sans">{VOCAB[i]}</span>
                      {row.map((v, j) => (
                        <span key={j} className="w-12 text-right">
                          {v.toFixed(2)}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
                <span className="text-gray-400">=</span>
                <div className="rounded-lg border-2 border-violet-500 p-2 font-mono text-[12px] font-bold text-violet-700 dark:text-violet-300">
                  [{W[lw].map((v) => v.toFixed(2)).join(", ")}]
                </div>
              </div>
            </Scroller>
            <Formula className="mt-3" note="0이 곱해진 행은 모두 사라지고 원핫의 1이 놓인 자리의 행만 남는다">
              x·W = Σᵢ xᵢ·(W의 i번째 행) = W의 {lw + 1}번째 행 (‘{VOCAB[lw]}’ 행)
            </Formula>
            <div className="mt-3">
              <ComputedNote>
                W의 숫자는 학습으로 얻은 값이 아니라 ‘행 하나를 꺼내는 연산’을 보여 주려고 이 화면에서 정한
                값입니다. 실제 Word2Vec에서는 학습이 끝난 뒤 얻은 W로 입력 단어를 저차원 벡터로 사영합니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "13.2.2 자연어처리를 위한 머신러닝 기법 — (4) 데이터 분석",
            slides: "Word2Vec의 수행결과의 예", lecture: "차 벡터의 크기가 거의 같다는 것은 단어 간 의미 관계가 벡터 공간에 표현된다는 뜻이고, ‘사랑 − 이별 + 만남 = 인연’처럼 벡터의 덧셈·뺄셈도 가능하다고 예시",
          }}
        >
          <Card>
            <CardTitle>Word2Vec 수행 결과 — 의미 관계가 벡터 관계로</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              교재 그림 13-23은 Word2Vec으로 얻은 임베딩 벡터를 2차원으로 한 번 더 차원 축소한 결과다. 단어
              간의 의미 정보가 좌표 평면상의 <strong>벡터 관계</strong>로 잘 표현된다. 화살표를 켜 보자.
            </p>
            <div className="mb-2 flex flex-wrap gap-2">
              <Chip active={showG} onClick={() => setShowG((v) => !v)}>
                남성 → 여성
              </Chip>
              <Chip active={showP} onClick={() => setShowP((v) => !v)}>
                단수 → 복수
              </Chip>
            </div>
            <Scroller>
              <svg viewBox="0 0 440 210" className="w-full min-w-[380px]" role="img" aria-label="임베딩 2차원 산점도">
                <defs>
                  <marker id="w2v-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 z" fill="#7c3aed" />
                  </marker>
                  <marker id="w2v-arrow2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 z" fill="#f59e0b" />
                  </marker>
                </defs>
                {showG &&
                  GENDER.map(([a, b]) => (
                    <line
                      key={a + b}
                      x1={SX(pt(a).x)}
                      y1={SY(pt(a).y)}
                      x2={SX(pt(b).x)}
                      y2={SY(pt(b).y)}
                      stroke="#7c3aed"
                      strokeWidth={1.6}
                      markerEnd="url(#w2v-arrow)"
                    />
                  ))}
                {showP &&
                  PLURAL.map(([a, b]) => (
                    <line
                      key={a + b}
                      x1={SX(pt(a).x)}
                      y1={SY(pt(a).y)}
                      x2={SX(pt(b).x)}
                      y2={SY(pt(b).y)}
                      stroke="#f59e0b"
                      strokeWidth={1.6}
                      strokeDasharray="4 3"
                      markerEnd="url(#w2v-arrow2)"
                    />
                  ))}
                {POINTS.map((p) => (
                  <g key={p.w}>
                    <circle cx={SX(p.x)} cy={SY(p.y)} r={4} fill="#4c1d95" />
                    <text x={SX(p.x) + 6} y={SY(p.y) - 6} fontSize={10.5} fill="currentColor">
                      {p.w}
                    </text>
                  </g>
                ))}
              </svg>
            </Scroller>
            <p className="mt-1 font-mono text-[11.5px] text-gray-600 dark:text-gray-300">
              WOMAN − MAN = (1.0, 2.0) = AUNT − UNCLE = QUEEN − KING · KINGS − KING = (2.0, −0.7) = QUEENS − QUEEN
            </p>
            <LectureNote>
              차 벡터의 크기가 거의 같다는 것은 단어 사이의 의미 관계가 벡터 공간에서 일정한 거리로 표현된다는 뜻이다. 그래서 벡터의 덧셈·뺄셈도 의미를 가진다 — 강의록의 Korean Word2Vec 예처럼 ‘사랑 − 이별 + 만남 = 인연’, ‘아버지 − 어머니 + 딸 = 아들’.
            </LectureNote>
            <div className="mt-2">
              <ComputedNote>
                점의 좌표는 그림 13-23의 관계를 다시 그리려고 이 화면에서 정한 값입니다. 원 그림의 실제 좌표가
                아니며, 같은 관계의 단어 쌍이 평행한 화살표로 놓인다는 점만 보면 됩니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "13.2.2 자연어처리를 위한 머신러닝 기법 — (4) 데이터 분석",
            slides: "데이터분석 — 워드 임베딩 · Word2Vec",
          }}
        >
          <Card>
            <CardTitle>맞는 설명인가 — 워드 임베딩 판별</CardTitle>
            <div className="space-y-2">
              {DRILL.map((d, i) => {
                const p = picks[i];
                return (
                  <div key={d.s} className="rounded-lg border border-gray-200 p-2.5 dark:border-gray-700">
                    <p className="mb-1.5 text-[12.5px] text-gray-700 dark:text-gray-200">{d.s}</p>
                    <div className="flex gap-1.5">
                      {[true, false].map((v) => {
                        const tone =
                          p === null
                            ? "border-gray-200 text-gray-600 hover:border-violet-400 dark:border-gray-700 dark:text-gray-300"
                            : v === d.ok
                              ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                              : p === v
                                ? "border-red-400 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300"
                                : "border-gray-200 text-gray-400 dark:border-gray-700";
                        return (
                          <button
                            key={String(v)}
                            type="button"
                            disabled={p !== null}
                            onClick={() => setPicks((ps) => ps.map((x, j) => (j === i ? v : x)))}
                            className={`rounded-full border px-3 py-0.5 text-[11.5px] ${tone}`}
                          >
                            {v ? "적절함" : "적절하지 않음"}
                          </button>
                        );
                      })}
                    </div>
                    {p !== null && (
                      <p className="mt-1.5 text-[11.5px] leading-5 text-gray-600 dark:text-gray-400">
                        {p === d.ok ? "정답. " : "오답. "}
                        {d.why}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setPicks(DRILL.map(() => null))}
              className="mt-2 flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <RotateCcw size={11} /> 다시 풀기
            </button>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
