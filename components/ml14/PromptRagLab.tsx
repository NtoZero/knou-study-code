"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { ACCENT, Card, CardTitle, Chip, ComputedNote, Hint, Scroller, Slider, LectureNote } from "./ui";

/**
 * 강의록 04 대규모 언어 모델 — 추론 단계의 프롬프트 엔지니어링(CoT)과 RAG.
 * CoT의 네 프롬프트는 강의록 ‘Few-shot CoT vs Zero-shot CoT’ 슬라이드의 문장 그대로다.
 * RAG 실습의 문서는 이 강의 내용으로 이 화면에서 만든 것이고, 검색 점수는 단순한 단어 겹침 수다.
 */

/* ─────────── CoT: 두 스위치로 네 칸 ─────────── */

const EXEMPLAR_Q =
  "Q: Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 tennis balls. How many tennis balls does he have now?";
const TARGET_Q =
  "Q: A juggler can juggle 16 balls. Half of the balls are golf balls, and half of the golf balls are blue. How many blue golf balls are there?";

interface CotCell {
  tag: string;
  name: string;
  prompt: string[];
  /** 프롬프트 안에서 강조할 줄 */
  highlight?: number;
  output: string;
  ok: boolean;
}

/** [few-shot 여부][CoT 여부] */
const COT: Record<"few" | "zero", Record<"plain" | "cot", CotCell>> = {
  few: {
    plain: {
      tag: "(a)",
      name: "Few-shot",
      prompt: [EXEMPLAR_Q, "A: The answer is 11.", TARGET_Q, "A:"],
      highlight: 1,
      output: "The answer is 8.",
      ok: false,
    },
    cot: {
      tag: "(b)",
      name: "Few-shot-CoT",
      prompt: [
        EXEMPLAR_Q,
        "A: Roger started with 5 balls. 2 cans of 3 tennis balls each is 6 tennis balls. 5 + 6 = 11. The answer is 11.",
        TARGET_Q,
        "A:",
      ],
      highlight: 1,
      output:
        "The juggler can juggle 16 balls. Half of the balls are golf balls. So there are 16 / 2 = 8 golf balls. Half of the golf balls are blue. So there are 8 / 2 = 4 blue golf balls. The answer is 4.",
      ok: true,
    },
  },
  zero: {
    plain: {
      tag: "(c)",
      name: "Zero-shot",
      prompt: [TARGET_Q, "A: The answer (arabic numerals) is"],
      highlight: 1,
      output: "8",
      ok: false,
    },
    cot: {
      tag: "(d)",
      name: "Zero-shot-CoT",
      prompt: [TARGET_Q, "A: Let's think step by step."],
      highlight: 1,
      output:
        "There are 16 balls in total. Half of the balls are golf balls. That means that there are 8 golf balls. Half of the golf balls are blue. That means that there are 4 blue golf balls.",
      ok: true,
    },
  },
};

/* ─────────── RAG ─────────── */

/** 이 강의 내용으로 만든 원문 — 문장 단위 */
const DOC_SENTENCES = [
  "BERT는 구글에서 만든 언어 모델로, Transformer의 인코더 모델에 기반한다.",
  "BERT는 사전 학습 단계에서 책 말뭉치(800M 단어)와 Wikipedia(2500M 단어)로 학습했다.",
  "미세조정 단계에서는 사전에 학습된 모델을 특정 NLP 문제에 맞춰 추가 학습한다.",
  "BERT는 12개의 자연어처리 문제에 대해 당시 최고 성능을 기록했다.",
  "Transformer 모델은 2017년 “Attention is all you need”로 발표되었다.",
  "Transformer는 RNN 구조를 없애고 여러 개의 인코더와 Attention만으로 구현되었다.",
];

interface RagQuery {
  q: string;
  keywords: string[];
  /** 정답이 들어 있는 문장 번호 */
  answerSentence: number;
  answer: string;
}

const QUERIES: RagQuery[] = [
  {
    q: "BERT의 사전 학습에 쓰인 Wikipedia는 몇 단어인가?",
    keywords: ["BERT", "사전 학습", "Wikipedia"],
    answerSentence: 1,
    answer: "2500M 단어",
  },
  {
    q: "Transformer는 언제, 어떤 제목으로 발표되었나?",
    keywords: ["Transformer", "발표", "2017"],
    answerSentence: 4,
    answer: "2017년, “Attention is all you need”",
  },
  {
    q: "BERT는 몇 개의 자연어처리 문제에서 당시 최고 성능을 기록했나?",
    keywords: ["BERT", "자연어처리 문제", "최고 성능"],
    answerSentence: 3,
    answer: "12개",
  },
];

const RAG_STEPS = [
  { name: "입력", d: "사용자의 질문(쿼리)이 주어짐" },
  { name: "인덱싱", d: "관련 문서를 청킹(chunking)하여 색인화" },
  { name: "검색", d: "쿼리와 관련된 문서 검색" },
  { name: "생성", d: "쿼리와 검색된 문서를 프롬프트와 함께 LLM에 입력하여 응답 생성" },
];

function chunk(sentences: string[], size: number): { text: string; ids: number[] }[] {
  const out: { text: string; ids: number[] }[] = [];
  for (let i = 0; i < sentences.length; i += size) {
    const ids = sentences.slice(i, i + size).map((_, k) => i + k);
    out.push({ text: ids.map((id) => sentences[id]).join(" "), ids });
  }
  return out;
}

export default function PromptRagLab() {
  const [few, setFew] = useState(false);
  const [cot, setCot] = useState(false);

  const [qi, setQi] = useState(0);
  const [size, setSize] = useState(2);
  const [step, setStep] = useState(0);

  const cell = COT[few ? "few" : "zero"][cot ? "cot" : "plain"];

  const query = QUERIES[qi];
  const chunks = useMemo(() => chunk(DOC_SENTENCES, size), [size]);
  const scored = useMemo(
    () =>
      chunks.map((c, i) => ({
        ...c,
        i,
        hits: query.keywords.filter((k) => c.text.includes(k)),
      })),
    [chunks, query],
  );
  const best = scored.reduce((a, b) => (b.hits.length > a.hits.length ? b : a), scored[0]);
  const bestHasAnswer = best.ids.includes(query.answerSentence);

  return (
    <section id="prompt-rag" className="scroll-mt-32">
      <SectionTitle
        title="추론 단계 — 사고과정 유도 프롬팅(CoT)과 RAG"
        subtitle="학습된 LLM을 더 잘 쓰는 두 방법: 프롬프트에 문제 해결 과정을 넣기, 외부 지식을 검색해 넣기"
      />

      <div className="space-y-5">
        <Sourced refs={{ slides: "프롬프트 엔지니어링 — 사고과정 유도 프롬팅 CoT", lecture: "표준 프롬프팅은 수학·논리처럼 조건이 있는 문제에서 정확도가 크게 떨어지며, 구글이 CoT로 초등학생 수학 문제 DB의 정답률을 17%에서 58%로 높였다고 소개" }}>
          <Card>
            <CardTitle>CoT, Chain-of-Thought — 정의와 직관</CardTitle>
            <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              프롬프트 엔지니어링은 <strong>다양한 과제에 적합한 프롬프트를 설계</strong>하는 것이다.
              그중 사고과정 유도 프롬팅(CoT)은 <strong>프롬프트에 문제 해결 과정을 포함하여 유도</strong>
              하는 방법이다. 답만 보여 주면 모델도 답만 내놓다가 틀리기 쉽지만, 풀이 과정을 보여 주거나
              단계적으로 생각하라고 이끌면 중간 계산을 거쳐 답에 도달한다.
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-2.5 text-[12px] leading-5 text-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
                <strong>제로샷 Zero-shot</strong> — 예시 없이 풀 문제만 준다.
              </div>
              <div className="rounded-lg bg-gray-50 p-2.5 text-[12px] leading-5 text-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
                <strong>퓨샷 Few-shot</strong> — 풀 문제 앞에 질문-답 예시를 몇 개 넣어 준다.
              </div>
            </div>
            <LectureNote>
              질문에 바로 답하게 하는 표준 프롬프팅(standard prompting)은 수학·논리처럼 조건이 있는 문제에서 정확도가 크게 떨어진다. 강의록 그림의 예(사과 23개 중 20개를 쓰고 6개를 더 샀다면 몇 개인가)에서도 답만 보여 준 예시로는 틀렸고, 풀이 과정을 담은 예시를 준 CoT는 중간 단계를 거쳐 맞혔다(23 − 20 + 6 = 9). 구글은 CoT로 초등학생 수학 문제 DB의 정답률을 17%에서 58%까지 높였다고 한다.
            </LectureNote>
          </Card>
        </Sourced>

        <Sourced refs={{ slides: "프롬프트 엔지니어링 — Few-shot CoT vs Zero-shot CoT", lecture: "Zero-shot-CoT는 ‘단계별로 생각해 봐’ 한 줄만으로 예시 없이 추론을 끌어내, 프롬프트 길이를 줄이면서 정확도를 높이는 기법이라고 정리" }}>
          <Card>
            <CardTitle>두 스위치로 네 가지 프롬프트 비교하기</CardTitle>
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="mb-1 text-[11px] font-semibold text-gray-500">예시를 넣는가</p>
                <div className="flex gap-1.5">
                  <Chip active={!few} onClick={() => setFew(false)}>
                    Zero-shot
                  </Chip>
                  <Chip active={few} onClick={() => setFew(true)}>
                    Few-shot
                  </Chip>
                </div>
              </div>
              <div>
                <p className="mb-1 text-[11px] font-semibold text-gray-500">사고 과정을 유도하는가</p>
                <div className="flex gap-1.5">
                  <Chip active={!cot} onClick={() => setCot(false)}>
                    답만
                  </Chip>
                  <Chip active={cot} onClick={() => setCot(true)}>
                    CoT
                  </Chip>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={cell.tag}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2"
              >
                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className={`mb-2 text-[11px] font-bold ${ACCENT}`}>
                    {cell.tag} {cell.name} — 프롬프트
                  </p>
                  <div className="space-y-1.5 font-mono text-[11.5px] leading-5">
                    {cell.prompt.map((line, i) => (
                      <p
                        key={line}
                        className={
                          i === cell.highlight
                            ? "rounded bg-violet-100 px-1 text-violet-900 dark:bg-violet-900/40 dark:text-violet-100"
                            : "text-gray-600 dark:text-gray-300"
                        }
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
                <div
                  className={`rounded-lg border p-3 ${
                    cell.ok
                      ? "border-green-300 bg-green-50/60 dark:border-green-800 dark:bg-green-950/20"
                      : "border-red-300 bg-red-50/60 dark:border-red-800 dark:bg-red-950/20"
                  }`}
                >
                  <p
                    className={`mb-2 flex items-center gap-1 text-[11px] font-bold ${
                      cell.ok ? "text-green-700 dark:text-green-300" : "text-red-600 dark:text-red-300"
                    }`}
                  >
                    {cell.ok ? <CheckCircle size={13} /> : <XCircle size={13} />}
                    (Output) {cell.ok ? "정답 4" : "오답 8"}
                  </p>
                  <p className="font-mono text-[11.5px] leading-5 text-gray-700 dark:text-gray-200">
                    {cell.output}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-3 rounded-lg bg-gray-50 p-3 text-[12px] leading-6 text-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
              <p>
                풀 문제: 저글러가 공 16개를 저글링한다. 절반은 골프공이고, 골프공의 절반은 파란색이다.
                파란 골프공은 몇 개인가? → 16 / 2 = 8(골프공), 8 / 2 = <strong>4</strong>(파란 골프공).
              </p>
              <p className="mt-1">
                답만 내게 한 (a)·(c)는 중간 단계인 8에서 멈춰 틀렸다. 풀이 예시를 보여 준 (b)와
                “Let&apos;s think step by step.”이라는 한 문장만 붙인 (d)는 두 번의 나눗셈을 거쳐 4에
                도달했다.
              </p>
            </div>
            <Hint>
              헷갈리는 기준 — Few-shot과 CoT는 서로 다른 축이다. Few-shot은 ‘예시를 넣는가’, CoT는
              ‘풀이 과정을 유도하는가’다. 그래서 예시 없이도 CoT를 할 수 있고(Zero-shot-CoT), 예시를
              넣어도 답만 보여 주면 CoT가 아니다(Few-shot). 강의록은 ReAct 기법도 프롬프트 엔지니어링에
              포함시키지만 내용은 다루지 않는다.
            </Hint>
            <LectureNote>
              Zero-shot-CoT는 예시 없이 ‘단계별로 생각해 봐’ 한 문장만 덧붙여 모델이 스스로 사고 과정을 구성하게 한다. 프롬프트 길이를 줄이면서도 정확도를 높이는 기법으로, GPT-3.5·GPT-4에서도 상당한 효과를 보였다.
            </LectureNote>
          </Card>
        </Sourced>

        <Sourced refs={{ slides: "RAG Retrieval-Augmented Generation", lecture: "학습 데이터는 고정되어 시간이 지나면 낡거나 빠지는 정보가 생기고 환각도 생기므로 RAG가 필요하며, 법률·의료·산업 설비처럼 높은 신뢰가 필요한 분야의 핵심 기술이라고 설명" }}>
          <Card>
            <CardTitle>RAG — 외부 지식을 검색해서 그 정보를 바탕으로 응답 생성</CardTitle>
            <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              RAG(Retrieval-Augmented Generation)는 <strong>외부 지식을 검색해서, 그 정보를 바탕으로
              응답을 생성하는 방식</strong>이다. 목적은 <strong>LLM의 사실성 문제와 환각(hallucination)
              현상을 해결</strong>하는 것이다. 모델이 학습한 내용만으로 답하면 그럴듯하지만 사실과 다른
              답이 나올 수 있으니, 답하기 전에 근거 문서를 찾아 함께 넣어 준다. 모델을 다시 학습시키는
              미세조정이 아니라 학습된 LLM을 활용하는 추론 단계의 방법이다.
            </p>

            <Scroller>
              <div className="mt-3 flex min-w-[460px] items-stretch gap-1.5">
                {RAG_STEPS.map((s, i) => (
                  <div key={s.name} className="flex flex-1 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setStep(i)}
                      className={`flex-1 rounded-lg border px-2 py-2 text-left transition-colors ${
                        i === step
                          ? "border-violet-600 bg-violet-600 text-white"
                          : i < step
                            ? "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-200"
                            : "border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900"
                      }`}
                    >
                      <p className="text-[12px] font-bold">
                        {i + 1}. {s.name}
                      </p>
                      <p className="text-[10.5px] leading-4 opacity-90">{s.d}</p>
                    </button>
                    {i < RAG_STEPS.length - 1 && <span className="text-gray-300">→</span>}
                  </div>
                ))}
              </div>
            </Scroller>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setStep((v) => Math.max(0, v - 1))}
                disabled={step === 0}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
              >
                <ChevronLeft size={13} /> 이전
              </button>
              <button
                type="button"
                onClick={() => setStep((v) => Math.min(RAG_STEPS.length - 1, v + 1))}
                disabled={step === RAG_STEPS.length - 1}
                className="flex items-center gap-1 rounded-lg bg-violet-600 px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-40"
              >
                다음 <ChevronRight size={13} />
              </button>
            </div>

            <div className="mt-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              {step === 0 && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold text-gray-500">질문을 고르세요</p>
                  <div className="space-y-1.5">
                    {QUERIES.map((q, i) => (
                      <button
                        key={q.q}
                        type="button"
                        onClick={() => setQi(i)}
                        className={`block w-full rounded-lg border px-3 py-2 text-left text-[12.5px] ${
                          i === qi
                            ? "border-violet-500 bg-violet-50 text-violet-900 dark:bg-violet-950/40 dark:text-violet-100"
                            : "border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {q.q}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[11.5px] text-gray-500">
                    이 질문에서 검색에 쓸 핵심 단어: {query.keywords.map((k) => `“${k}”`).join(", ")}
                  </p>
                </div>
              )}

              {step === 1 && (
                <div>
                  <Slider
                    label="청크 하나에 담는 문장 수"
                    value={size}
                    min={1}
                    max={3}
                    step={1}
                    onChange={setSize}
                    display={`${size}문장 → 청크 ${chunks.length}개`}
                  />
                  <div className="mt-2 space-y-1.5">
                    {chunks.map((c, i) => (
                      <div
                        key={c.ids.join("-")}
                        className="rounded-md border border-dashed border-violet-300 p-2 text-[11.5px] leading-5 text-gray-700 dark:border-violet-800 dark:text-gray-200"
                      >
                        <span className={`mr-1 font-bold ${ACCENT}`}>청크 {i + 1}</span>
                        {c.text}
                      </div>
                    ))}
                  </div>
                  <Hint>
                    긴 문서를 통째로 넣지 않고 작은 조각(청크)으로 잘라 색인을 만들어 두면, 질문과 관련된
                    조각만 골라 프롬프트에 넣을 수 있다.
                  </Hint>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-1.5">
                  {scored.map((c) => {
                    const top = c.i === best.i;
                    return (
                      <div
                        key={c.ids.join("-")}
                        className={`rounded-md border p-2 text-[11.5px] leading-5 ${
                          top
                            ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30"
                            : "border-gray-200 opacity-70 dark:border-gray-700"
                        }`}
                      >
                        <div className="mb-1 flex items-center gap-2">
                          <span className={`font-bold ${top ? ACCENT : "text-gray-500"}`}>
                            청크 {c.i + 1}
                          </span>
                          <span className="font-mono text-[11px] text-gray-500">
                            겹친 핵심 단어 {c.hits.length}개
                            {c.hits.length > 0 && ` (${c.hits.join(", ")})`}
                          </span>
                          {top && (
                            <span className="ml-auto rounded bg-violet-600 px-1.5 text-[10px] font-bold text-white">
                              검색됨
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 dark:text-gray-200">{c.text}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {step === 3 && (
                <div>
                  <p className="mb-1 text-[11px] font-semibold text-gray-500">LLM에 들어가는 프롬프트</p>
                  <div className="space-y-1 rounded-md bg-gray-50 p-2.5 font-mono text-[11.5px] leading-5 text-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
                    <p>[지시] 아래 문서를 근거로 질문에 답하시오.</p>
                    <p className="rounded bg-violet-100 px-1 dark:bg-violet-900/40">
                      [검색된 문서] {best.text}
                    </p>
                    <p>[질문] {query.q}</p>
                  </div>
                  <p
                    className={`mt-2 text-[12.5px] leading-6 ${
                      bestHasAnswer
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-600 dark:text-red-300"
                    }`}
                  >
                    {bestHasAnswer
                      ? `검색된 문서 안에 답의 근거가 있다 → 응답: ${query.answer}`
                      : "검색된 문서에 답의 근거가 없다 — 검색이 빗나가면 RAG도 근거 있는 응답을 만들 수 없다"}
                  </p>
                </div>
              )}
            </div>

            <Hint>
              헷갈리는 기준 — RAG는 ‘검색(Retrieval)으로 보강한(Augmented) 생성(Generation)’이다. 검색만
              하는 정보검색 시스템과도, 모델의 파라미터를 고치는 미세조정과도 다르다. 그리고 순서가 중요하다:
              인덱싱을 미리 해 두어야 검색할 수 있고, 검색된 문서가 있어야 그것을 바탕으로 생성한다.
            </Hint>
            <LectureNote>
              LLM의 학습 데이터는 고정되어 있어 시간이 지나면 낡거나 빠지는 정보가 생기고, 사실이 아닌 것을 사실처럼 자연스럽게 만들어 내는 환각도 생긴다. 실제 RAG의 인덱싱은 관련 문서를 의미 단위의 청크로 쪼개 임베딩 벡터로 만든 뒤 벡터 DB에 저장해 두는 것이고, 검색은 쿼리도 벡터로 바꿔 저장된 청크와 유사성을 비교해 비슷한 문서를 찾는 것이다. 그래서 최신 정보나 법률·의료·산업 설비처럼 특화된 분야에서도 정확하게 응답할 수 있어, 높은 신뢰가 필요한 AI 응용의 핵심 기술로 쓰인다.
            </LectureNote>
          </Card>
        </Sourced>

        <ComputedNote>
          CoT의 네 프롬프트와 출력은 강의록 슬라이드의 영어 원문 그대로이고, 한국어 풀이는 이 화면에서
          덧붙인 것입니다. RAG 실습의 문서 여섯 문장은 이 강의에서 배운 내용으로 이 화면에서 만든 것이며,
          검색 점수는 질문의 핵심 단어가 청크에 몇 개 들어 있는지만 센 단순한 방식입니다. 강의에서 설명한
          실제 RAG는 쿼리와 청크를 임베딩 벡터로 바꿔 유사성을 비교하는데, 이 화면은 그 과정을 단어 겹침으로
          단순화했습니다.
        </ComputedNote>
      </div>
    </section>
  );
}
