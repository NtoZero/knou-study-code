"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Hint, Scroller } from "./ui";

/**
 * 13.2.2 자연어처리를 위한 머신러닝 기법 — 그림 13-19 개발 단계.
 * 말뭉치 네 문서, 인덱스, 문장 “무거운 수박이 크고 수박 가격이 비싸다”와 그 BoW는 교재 그림 13-20 그대로다.
 * ‘수박이 → 수박’처럼 조사를 떼는 단계는 교재 BoW 결과에서 역으로 드러나는 처리로, 이 화면이 명시적으로 풀어 쓴 것이다.
 */

const STAGES = [
  { key: "collect", name: "데이터 수집", en: "Corpus collection", items: ["Corpus collection"] },
  { key: "prep", name: "데이터 전처리", en: "preprocessing", items: ["Tokenization", "Cleaning", "Normalization"] },
  { key: "repr", name: "데이터 표현", en: "representation", items: ["One-hot vector", "Bag of words", "TF-IDF"] },
  {
    key: "anal",
    name: "데이터 분석 (학습)",
    en: "analysis",
    items: ["Word Embedding", "Language model", "Sentence Similarity", "Text classification", "Sentence Generation"],
  },
] as const;

const CORPUS = ["먹고 싶은 수박", "먹고 싶은 토마토", "크고 무거운 수박 수박", "과일 가격이 비싸다"];
const VOCAB = ["먹고", "싶은", "수박", "토마토", "크고", "무거운", "과일", "가격", "비싸다"];
const SENTENCE = "무거운 수박이 크고 수박 가격이 비싸다";
const RAW_TOKENS = ["무거운", "수박이", "크고", "수박", "가격이", "비싸다"];
const NORM: Record<string, string> = { 수박이: "수박", 가격이: "가격" };
const TOKENS = RAW_TOKENS.map((t) => NORM[t] ?? t);
const BOW = VOCAB.map((w) => TOKENS.filter((t) => t === w).length);

interface Step {
  stage: number;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  { stage: 0, title: "말뭉치를 모은다", body: "네 개의 문서로 이루어진 간단한 말뭉치. 여기서 단어 집합과 인덱스를 얻는다. 분석할 새 문장도 하나 주어진다." },
  { stage: 1, title: "토큰화", body: "문장을 의미 있는 기본 단위(토큰)로 나눈다. 여기서는 단어 하나를 하나의 토큰으로 본다. 띄어쓰기대로 자르면 여섯 토큰이 된다." },
  { stage: 1, title: "토큰화 — 한국어 조사 분리", body: "‘수박이’와 ‘수박’은 같은 단어다. 한국어는 조사를 떼어 내야 같은 토큰으로 묶인다. 교재의 BoW에서 수박 칸이 2인 것은 이 처리가 되었다는 뜻이다." },
  { stage: 2, title: "인덱스에 맞춰 세기", body: "각 토큰을 말뭉치의 단어 인덱스에 대응시키고 몇 번 나왔는지 센다." },
  { stage: 2, title: "BoW 벡터", body: "단어 수가 9개이므로 9차원 벡터. 각 원소는 그 단어가 문장에 나타난 빈도수다." },
  { stage: 3, title: "데이터 분석으로", body: "숫자 벡터가 된 텍스트로 워드 임베딩과 언어 모델링을 수행하고, 이를 바탕으로 문장 유사도·텍스트 분류·문장 생성 같은 문제를 푼다." },
];

const BOX_W = 150;
const GAP = 34;

export default function NlpPipeline() {
  const [s, setS] = useState(0);
  const [playing, setPlaying] = useState(false);
  const step = STEPS[s];

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setS((v) => {
        if (v >= STEPS.length - 1) {
          setPlaying(false);
          return v;
        }
        return v + 1;
      });
    }, 1800);
    return () => window.clearInterval(id);
  }, [playing]);

  const W = STAGES.length * BOX_W + (STAGES.length - 1) * GAP + 20;

  return (
    <section id="nlp-pipeline" className="scroll-mt-32">
      <SectionTitle
        title="NLP 응용을 위한 ML 시스템의 개발 단계"
        subtitle="문장 하나가 수집 → 전처리 → 표현 → 분석을 거쳐 숫자 벡터가 되기까지"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "13.2.2 자연어처리를 위한 머신러닝 기법",
            slides: "NLP 응용을 위한 ML 시스템의 개발단계", lecture: "수집 → 전처리 → 표현(특징 추출) → 분석(학습)이라는 머신러닝 시스템의 일반적 개발 단계를 자연어처리에 그대로 대응시킨 것이라고 설명",
          }}
        >
          <Card>
            <CardTitle>그림 13-19 — 한 문장을 따라 단계를 진행해 보세요</CardTitle>
            <Scroller>
              <svg viewBox={`0 0 ${W} 190`} className="min-w-[640px] w-full" role="img" aria-label="자연어처리 개발 단계">
                {STAGES.map((st, i) => {
                  const x = 10 + i * (BOX_W + GAP);
                  const on = step.stage === i;
                  const done = step.stage > i;
                  return (
                    <g key={st.key}>
                      <rect
                        x={x}
                        y={10}
                        width={BOX_W}
                        height={170}
                        rx={12}
                        className={
                          on
                            ? "fill-violet-50 stroke-violet-600 dark:fill-violet-950/60"
                            : done
                              ? "fill-white stroke-violet-300 dark:fill-gray-900 dark:stroke-violet-800"
                              : "fill-white stroke-gray-200 dark:fill-gray-900 dark:stroke-gray-700"
                        }
                        strokeWidth={on ? 2.5 : 1.2}
                      />
                      <text x={x + BOX_W / 2} y={34} textAnchor="middle" className={`text-[13px] font-bold ${on ? "fill-violet-700 dark:fill-violet-300" : "fill-gray-700 dark:fill-gray-200"}`}>
                        {st.name}
                      </text>
                      {st.items.map((it, j) => (
                        <text key={it} x={x + BOX_W / 2} y={62 + j * 22} textAnchor="middle" className="fill-gray-500 text-[11px] dark:fill-gray-400">
                          {it}
                        </text>
                      ))}
                      {i < STAGES.length - 1 && (
                        <g>
                          <line x1={x + BOX_W + 4} y1={95} x2={x + BOX_W + GAP - 6} y2={95} className={done ? "stroke-violet-500" : "stroke-gray-300 dark:stroke-gray-600"} strokeWidth={2} />
                          <polygon
                            points={`${x + BOX_W + GAP - 4},95 ${x + BOX_W + GAP - 11},90 ${x + BOX_W + GAP - 11},100`}
                            className={done ? "fill-violet-500" : "fill-gray-300 dark:fill-gray-600"}
                          />
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </Scroller>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setS((v) => Math.max(0, v - 1))} disabled={s === 0} className="rounded-lg border border-gray-200 p-1.5 disabled:opacity-40 dark:border-gray-700" aria-label="이전 단계">
                <ChevronLeft size={14} />
              </button>
              <button type="button" onClick={() => { if (s >= STEPS.length - 1) setS(0); setPlaying((p) => !p); }} className="flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white">
                {playing ? <Pause size={12} /> : <Play size={12} />} {playing ? "멈춤" : "재생"}
              </button>
              <button type="button" onClick={() => setS((v) => Math.min(STEPS.length - 1, v + 1))} disabled={s === STEPS.length - 1} className="rounded-lg border border-gray-200 p-1.5 disabled:opacity-40 dark:border-gray-700" aria-label="다음 단계">
                <ChevronRight size={14} />
              </button>
              <button type="button" onClick={() => { setS(0); setPlaying(false); }} className="rounded-lg border border-gray-200 p-1.5 dark:border-gray-700" aria-label="처음으로">
                <RotateCcw size={14} />
              </button>
              <span className="text-[11px] text-gray-500">
                {s + 1} / {STEPS.length} · {STAGES[step.stage].name}
              </span>
            </div>

            <div className="mt-3 rounded-lg border border-violet-200 p-3 dark:border-violet-800">
              <p className="text-[13px] font-bold text-violet-700 dark:text-violet-300">{step.title}</p>
              <p className="mt-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">{step.body}</p>

              <div className="mt-3">
                {s === 0 && (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="space-y-1">
                      {CORPUS.map((d, i) => (
                        <p key={d} className="rounded-md bg-gray-50 px-2 py-1 text-[12px] dark:bg-gray-800/60">
                          <span className="mr-2 text-[10px] font-bold text-gray-400">문서{i + 1}</span>
                          {d}
                        </p>
                      ))}
                    </div>
                    <div className="rounded-md border border-dashed border-violet-300 p-2 text-[12.5px] dark:border-violet-700">
                      <p className="text-[10px] text-gray-500">분석할 문장</p>
                      <p className="mt-1 font-semibold">{SENTENCE}</p>
                    </div>
                  </div>
                )}
                {(s === 1 || s === 2) && (
                  <div className="flex flex-wrap gap-1.5">
                    {RAW_TOKENS.map((t, i) => {
                      const changed = s === 2 && NORM[t];
                      return (
                        <span key={i} className={`rounded-md border px-2 py-1 font-mono text-[12.5px] ${changed ? "border-violet-500 bg-violet-50 dark:bg-violet-950/40" : "border-gray-200 dark:border-gray-700"}`}>
                          “{changed ? NORM[t] : t}”
                          {changed && <span className="ml-1 text-[10px] text-gray-400 line-through">{t.slice(-1)}</span>}
                        </span>
                      );
                    })}
                  </div>
                )}
                {(s === 3 || s === 4) && (
                  <Scroller>
                    <table className="min-w-[480px] text-center text-[12px]">
                      <tbody>
                        <tr>
                          <th className="px-1.5 py-1 text-left text-[10.5px] text-gray-500">단어</th>
                          {VOCAB.map((w) => (
                            <td key={w} className="px-1.5 py-1">{w}</td>
                          ))}
                        </tr>
                        <tr>
                          <th className="px-1.5 py-1 text-left text-[10.5px] text-gray-500">index</th>
                          {VOCAB.map((w, i) => (
                            <td key={w} className="px-1.5 py-1 text-gray-400">{i}</td>
                          ))}
                        </tr>
                        <tr>
                          <th className="px-1.5 py-1 text-left text-[10.5px] text-gray-500">빈도</th>
                          {BOW.map((c, i) => (
                            <td key={i} className={`px-1.5 py-1 font-mono font-bold ${c > 0 ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200" : "text-gray-300"}`}>
                              {c}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </Scroller>
                )}
                {s === 4 && (
                  <p className="mt-2 text-center font-mono text-[13px] font-bold text-violet-700 dark:text-violet-300">
                    BoW = [ {BOW.join(", ")} ]
                  </p>
                )}
                {s === 5 && (
                  <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
                    <span className="rounded-md bg-violet-100 px-2 py-1 font-mono dark:bg-violet-900/40">[{BOW.join(", ")}]</span>
                    <span className="text-gray-400">→</span>
                    {["워드 임베딩", "언어 모델링"].map((x) => (
                      <span key={x} className="rounded-md border border-violet-300 px-2 py-1 dark:border-violet-700">{x}</span>
                    ))}
                    <span className="text-gray-400">→</span>
                    {["문장 유사도", "텍스트 분류", "문장 생성"].map((x) => (
                      <span key={x} className="rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-800">{x}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3">
              <ComputedNote>
                토큰화와 조사 분리를 두 단계로 나누어 보여 준 것은 이 화면의 풀이입니다. 교재 그림 13-20은 결과 BoW [0, 0, 2, 0, 1,
                1, 0, 1, 1]만 제시하며, ‘수박이’·‘가격이’가 각각 수박·가격 칸에 세어졌다는 점에서 조사가 분리되었음을 알 수
                있습니다.
              </ComputedNote>
            </div>
            <Hint>
              이 화면은 단계의 순서를 보는 곳입니다. 토큰화·정제·정규화의 세부 규칙은 바로 아래 전처리 실습에서, 원핫·BoW·TF-IDF는
              데이터 표현 실습에서, 워드 임베딩은 Word2Vec 실습에서 자세히 다룹니다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "13.2.2 자연어처리를 위한 머신러닝 기법 — (1) 데이터 수집", slides: "데이터수집", lecture: "말뭉치는 영상 쪽의 MNIST·ImageNet·CIFAR-10에 해당하는 기본 데이터이고, n-gram은 n개의 연속된 단어로 이루어진 단위라고 풀이" }}>
          <Card>
            <CardTitle>데이터 수집 — 텍스트 말뭉치</CardTitle>
            <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              <strong>텍스트 말뭉치</strong>(text corpus)는 일반적으로 사용되는 문장들로부터 얻어진 크고 구조화된 텍스트 데이터
              집합이다. 교재는 신문 기사·논문·SNS 등 다양한 정보원으로부터 획득한 텍스트 데이터 집합이라고 설명한다. 자연어처리
              데이터는 텍스트 형태라 인터넷을 통해 쉽게 수집(crawling)할 수 있는 특성이 있지만, 연구를 위해 대규모로 수집해
              제공하는 말뭉치도 있다.
            </p>
            <Scroller>
              <div className="mt-3 grid min-w-[520px] grid-cols-4 gap-2">
                {[
                  { n: "구글 n-gram 말뭉치", d: "구글에서 제공" },
                  { n: "COCA", d: "Corpus of Contemporary American English · 4억 2,500만 개 단어 · 1990~2011 · 무료 온라인 검색 서비스 제공" },
                  { n: "국립국어원 ‘모두의 말뭉치’", d: "한국어 말뭉치 (교재: 국립국어원에서 제공하는 말뭉치 데이터)" },
                  { n: "WordNet", d: "“A lexical database for English” — 사전 형태의 데이터베이스" },
                ].map((c) => (
                  <div key={c.n} className="rounded-lg border border-gray-200 p-2 dark:border-gray-700">
                    <p className="text-[11.5px] font-bold text-violet-700 dark:text-violet-300">{c.n}</p>
                    <p className="mt-1 text-[10.5px] leading-4 text-gray-500">{c.d}</p>
                  </div>
                ))}
              </div>
            </Scroller>
            <Hint>
              말뭉치는 인터넷 등에서 얻은 텍스트를 별도 처리 없이 모은 것이라 형태가 다양하고 오류도 많다. 그래서 다음 단계의
              전처리가 반드시 필요하다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
