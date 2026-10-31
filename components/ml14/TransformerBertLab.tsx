"use client";

import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, Hint, Scroller, LectureNote } from "./ui";

/**
 * 13.2.3 마지막 문단(트랜스포머)과 13.2.4 최신 언어 모델과 활용 — Transformer, ELMo·GPT, BERT.
 * 트랜스포머의 세부 구성은 강의록에만 있다. 순서 섞기 예시는 이 화면에서 만든 것이다.
 */

/* ─────────── 언어 모델 계보 ─────────── */
const LINEAGE = [
  {
    name: "RNN 언어 모델",
    what: "LSTM 셀이 한 번에 한 단어씩 입력받아 다음 단어를 출력하도록 학습한다.",
    limit: "문장을 받아 다른 문장으로 내는 문제(기계번역 등)에는 모델의 확장이 필요하다.",
  },
  {
    name: "Seq2Seq",
    what: "인코더가 입력 문장을 문맥 벡터로 압축하고, 디코더가 그것을 다른 시퀀스로 변환한다.",
    limit: "하나의 고정된 특징벡터로 요약 → 정보 손실, 긴 문장에서 성능 저하.",
  },
  {
    name: "Attention",
    what: "디코더가 출력 단어를 생성할 때마다 인코더 각 셀의 정보를 선택적으로 읽어 온다.",
    limit: "여전히 RNN(LSTM) 구조 위에 얹힌 모듈이다.",
  },
  {
    name: "Transformer",
    what: "RNN 구조를 없애고 여러 개의 인코더와 Attention만으로 구현했다. 빠른 학습, 우수한 성능.",
    limit: "이후 개발되는 대규모 언어 모델의 기반이 된다.",
  },
  {
    name: "BERT · GPT",
    what: "RNN을 사용하지 않는 트랜스포머 기반. 방대한 텍스트로 대규모 모델을 충분히 학습했다.",
    limit: "BERT는 사전학습 → 미세조정 전략으로 12개 문제에서 당시 최고 성능.",
  },
];

/* ─────────── RNN 인코더 vs Transformer 인코더 ─────────── */
const SRC = ["I", "am", "a", "student"];
const TGT = ["Je", "suis", "étudiant"];
const SCRAMBLED = ["student", "a", "am", "I"];

/* ─────────── BERT 4가지 구성 ─────────── */
type Cfg = "a" | "b" | "c" | "d";

const CONFIGS: {
  key: Cfg;
  name: string;
  ko: string;
  input: string[];
  output: string;
  uses: string;
}[] = [
  {
    key: "a",
    name: "Sentence Pair Classification",
    ko: "두 문장을 입력받아 분류",
    input: ["[CLS]", "Tok 1", "…", "[SEP]", "Tok 1", "…"],
    output: "Class Label (C 하나)",
    uses: "문장 간의 유사도 평가, 질의-응답 문장의 적절성 평가",
  },
  {
    key: "b",
    name: "Single Sentence Classification",
    ko: "한 문장을 입력받아 분류",
    input: ["[CLS]", "Tok 1", "Tok 2", "…", "Tok N"],
    output: "Class Label (C 하나)",
    uses: "감성 분류, 기사 분류",
  },
  {
    key: "c",
    name: "Question Answering",
    ko: "질문 하나와 관련 문단 → 응답",
    input: ["[CLS]", "Question", "[SEP]", "Paragraph"],
    output: "Start/End Span (문단 안 응답 위치)",
    uses: "질의응답 (하나의 질문/문단 → 응답 문장)",
  },
  {
    key: "d",
    name: "Single Sentence Tagging",
    ko: "한 문장의 각 단어마다 출력",
    input: ["[CLS]", "Tok 1", "Tok 2", "…", "Tok N"],
    output: "단어마다 하나씩 (T₁ … T_N)",
    uses: "품사 태깅 (문장의 각 단어에 대응되는 출력)",
  },
];

const DRILL: { task: string; answer: Cfg; why: string }[] = [
  { task: "두 문장이 얼마나 비슷한지 평가", answer: "a", why: "문장 두 개를 넣고 하나의 판정을 낸다." },
  { task: "영화 리뷰 한 문장의 긍정·부정 판정", answer: "b", why: "문장 하나를 넣고 클래스 하나를 낸다 — 감성 분류." },
  { task: "질문과 관련 문단을 주고 응답 문장을 찾기", answer: "c", why: "질문과 문단이 함께 들어가고, 출력은 문단 안의 응답 위치." },
  { task: "문장의 각 단어에 품사를 붙이기", answer: "d", why: "단어마다 대응되는 출력이 하나씩 필요하다." },
  { task: "신문 기사 한 편의 분야 분류", answer: "b", why: "기사 분류 — 입력 하나, 클래스 하나." },
  { task: "질문 문장과 응답 문장이 서로 적절한 쌍인지 평가", answer: "a", why: "질의-응답 문장의 적절성 평가는 두 문장을 받아 분류하는 (a)다. 응답을 찾아내는 (c)와 다르다." },
];

function TokenRow({ tokens, tone }: { tokens: string[]; tone: string }) {
  return (
    <div className="flex flex-wrap justify-center gap-0.5">
      {tokens.map((t, i) => (
        <span key={i} className={`rounded px-1 py-0.5 font-mono text-[9.5px] ${tone}`}>
          {t}
        </span>
      ))}
    </div>
  );
}

export default function TransformerBertLab() {
  const [lin, setLin] = useState(3);

  // 0..3: RNN이 단어를 하나씩 / 트랜스포머는 0에서 한 번에, 이후 디코더가 하나씩
  const [tick, setTick] = useState(0);
  const [playing, setPlaying] = useState(false);
  const TICKS = SRC.length + TGT.length; // 7

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setTick((v) => {
        if (v >= TICKS) {
          setPlaying(false);
          return v;
        }
        return v + 1;
      });
    }, 800);
    return () => window.clearInterval(id);
  }, [playing, TICKS]);

  const rnnRead = Math.min(tick, SRC.length);
  const rnnDecoded = Math.max(0, Math.min(TGT.length, tick - SRC.length));
  const trEncoded = tick >= 1;
  const trDecoded = Math.max(0, Math.min(TGT.length, tick - 1));

  const [posOn, setPosOn] = useState(false);
  const [stage, setStage] = useState<"pre" | "fine">("pre");
  const [cfg, setCfg] = useState<Cfg>("a");
  const [picks, setPicks] = useState<(Cfg | null)[]>(DRILL.map(() => null));
  const current = CONFIGS.find((c) => c.key === cfg)!;

  const sortedA = [...SRC].sort();
  const sortedB = [...SCRAMBLED].sort();

  return (
    <section id="transformer-bert" className="scroll-mt-32">
      <SectionTitle
        title="Transformer와 BERT"
        subtitle="RNN을 걷어 내고 Attention만 남긴 구조, 그리고 그 인코더로 만든 사전학습 언어 모델"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "13.2.3 언어 모델을 위한 딥러닝 · 13.2.4 최신 언어 모델과 활용", slides: "Transformer 모델 · BERT", lecture: "Seq2Seq·Attention·Transformer·BERT·GPT를 대표적인 언어 모델로 묶어 정리" }}>
          <Card>
            <CardTitle>언어 모델의 계보 — 각 단계가 앞 단계의 무엇을 넘었나</CardTitle>
            <Scroller>
              <div className="flex min-w-[560px] items-center gap-1">
                {LINEAGE.map((l, i) => (
                  <button
                    key={l.name}
                    type="button"
                    onClick={() => setLin(i)}
                    className={`flex-1 rounded-lg border px-2 py-2 text-[11px] font-bold transition-colors ${
                      lin === i
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-gray-200 text-gray-600 hover:bg-violet-50 dark:border-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </Scroller>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                <p className="text-[11px] font-bold text-gray-500">무엇을 하나</p>
                <p className="mt-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">{LINEAGE[lin].what}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                <p className="text-[11px] font-bold text-gray-500">남은 문제 / 의미</p>
                <p className="mt-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">{LINEAGE[lin].limit}</p>
              </div>
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "13.2.3 언어 모델을 위한 딥러닝 — 트랜스포머", slides: "Transformer 모델", lecture: "Attention으로 필요한 부분을 골라 읽으면 입력 순서가 덜 중요해져 RNN을 쓰지 않게 되었고, 그래도 단어의 순서 정보는 유지해야 해서 positional encoding을 쓴다고 설명" }}>
          <Card>
            <CardTitle>Transformer — 2017, “Attention is all you need”</CardTitle>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr]">
              <div className="rounded-lg border border-gray-200 p-2 dark:border-gray-700">
                <p className="mb-1 text-center font-mono text-[10.5px] text-violet-600 dark:text-violet-400">Je suis étudiant</p>
                <div className="grid grid-cols-2 gap-1">
                  {[6, 5, 4, 3, 2, 1].map((n) => (
                    <div key={n} className="contents">
                      <span className="rounded bg-violet-100 py-0.5 text-center text-[9.5px] text-violet-800 dark:bg-violet-900/40 dark:text-violet-200">
                        인코더 #{n}
                      </span>
                      <span className="rounded bg-amber-100 py-0.5 text-center text-[9.5px] text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                        디코더 #{n}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-center font-mono text-[10.5px] text-gray-600 dark:text-gray-300">I am a student</p>
              </div>
              <ul className="space-y-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                <li>• Seq2Seq 모델의 <strong>인코더-디코더 구조</strong>를 사용한다.</li>
                <li>• <strong>RNN 구조를 없애고</strong> 여러 개의 인코더와 Attention만으로 구현한다.</li>
                <li>
                  • 인코더 → <strong>한 번에 전체 시퀀스</strong>를 입력받는다. 단어의 순서 정보를
                  나타내기 위해 <strong>positional encoding</strong>을 사용한다.
                </li>
                <li>• 디코더 → 한 번에 하나씩 순차적으로 생성한다.</li>
                <li>• 빠른 학습, 우수한 성능. 교재: 이후 개발되는 대규모 언어 모델은 트랜스포머에 기반을 둔다.</li>
              </ul>
            </div>

            <div className="mt-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <p className="mb-2 text-[11px] font-bold text-gray-500">입력을 받는 방식 비교 — 같은 시계로 돌려 보기</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { title: "RNN(LSTM) 인코더-디코더", read: rnnRead, dec: rnnDecoded, all: false },
                  { title: "Transformer", read: trEncoded ? SRC.length : 0, dec: trDecoded, all: true },
                ].map((m) => (
                  <div key={m.title} className="rounded-md bg-gray-50 p-2 dark:bg-gray-800/60">
                    <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">{m.title}</p>
                    <div className="mt-1 flex gap-1">
                      {SRC.map((w, i) => (
                        <span
                          key={w}
                          className={`rounded px-1.5 py-0.5 font-mono text-[11px] transition-colors ${
                            i < m.read ? "bg-violet-600 text-white" : "bg-white text-gray-400 dark:bg-gray-900"
                          }`}
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                    <p className="mt-1 text-[10.5px] text-gray-500">
                      인코더 입력: {m.read}/{SRC.length} {m.all && m.read > 0 ? "— 한 번에 전체" : ""}
                    </p>
                    <div className="mt-1 flex gap-1">
                      {TGT.map((w, j) => (
                        <span
                          key={w}
                          className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${
                            j < m.dec ? "bg-amber-500 text-white" : "bg-white text-gray-300 dark:bg-gray-900"
                          }`}
                        >
                          {j < m.dec ? w : "?"}
                        </span>
                      ))}
                    </div>
                    <p className="mt-1 text-[10.5px] text-gray-500">디코더 출력: 한 번에 하나씩 {m.dec}/{TGT.length}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (tick >= TICKS) setTick(0);
                    setPlaying((p) => !p);
                  }}
                  className="flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs text-white"
                >
                  {playing ? <Pause size={13} /> : <Play size={13} />} {playing ? "멈춤" : "재생"}
                </button>
                <button
                  type="button"
                  onClick={() => setTick((v) => Math.min(TICKS, v + 1))}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-700"
                >
                  한 칸
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTick(0);
                    setPlaying(false);
                  }}
                  className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-700"
                >
                  <RotateCcw size={13} /> 처음
                </button>
                <span className="text-[11px] text-gray-500">시점 {tick}</span>
              </div>
              <Hint>
                시점 한 칸을 “한 번의 처리”로 본 정성적 비교다. 볼 것은 인코더 쪽이다 — RNN은 단어 수만큼
                차례로 읽어야 하지만 트랜스포머 인코더는 첫 시점에 문장 전체를 받는다. 디코더는 두 경우
                모두 한 번에 하나씩 생성한다.
              </Hint>
            </div>

            <div className="mt-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-bold text-gray-500">한 번에 받으면 순서는 어디에?</p>
                <Chip active={!posOn} onClick={() => setPosOn(false)}>
                  순서 정보 없음
                </Chip>
                <Chip active={posOn} onClick={() => setPosOn(true)}>
                  positional encoding 사용
                </Chip>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  { label: "“I am a student”", words: SRC, sorted: sortedA },
                  { label: "“student a am I”", words: SCRAMBLED, sorted: sortedB },
                ].map((s) => (
                  <div key={s.label} className="rounded-md bg-gray-50 p-2 dark:bg-gray-800/60">
                    <p className="text-[11px] font-semibold">{s.label}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(posOn ? s.words : s.sorted).map((w, i) => (
                        <span key={i} className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px] dark:bg-gray-900">
                          {w}
                          {posOn && <sub className="ml-0.5 text-violet-600 dark:text-violet-400">{i + 1}</sub>}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[12px] leading-6 text-gray-700 dark:text-gray-200">
                {posOn
                  ? "단어마다 위치가 붙으면 두 입력은 서로 다른 것이 된다 — 순서 정보가 살아난다."
                  : "한꺼번에 받은 단어 묶음만 보면 두 문장은 같은 단어 집합이다. RNN은 읽는 순서 자체가 순서 정보였지만, 전체를 한 번에 받는 인코더는 그렇지 않다."}
              </p>
            <LectureNote>
              Attention으로 필요한 부분을 골라 읽게 되자 입력이 들어오는 순서가 덜 중요해졌고, 그래서 RNN 구조를 쓰지 않게 되었다. 그때그때 어느 부분에 주의를 기울일지를 정하는 이 부분을 강의는 셀프 어텐션이라고 불렀다. 그래도 단어 사이의 순서 정보는 유지해야 하므로 위치 정보를 인코딩하는 positional encoding을 함께 쓴다.
            </LectureNote>
              <ComputedNote>
                뒤섞인 문장과 위치 번호 표시는 positional encoding이 왜 필요한지를 보이려고 이 화면에서 만든
                예시입니다. 원자료는 “단어의 순서 정보를 나타내기 위해 positional encoding 사용”까지만 다루며,
                구체적인 계산 방식은 다루지 않습니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "13.2.4 최신 언어 모델과 활용", slides: "BERT", lecture: "3종류의 임베딩을 위치 정보, 문장 A/B 구분, 서브워드 단위(사전에 없는 단어도 처리)로 풀어 설명하고, 이런 방대한 사전 학습은 정보를 많이 가진 구글이었기에 가능했다고 덧붙임" }}>
          <Card>
            <CardTitle>BERT — Bidirectional Encoder Representation from Transformers</CardTitle>
            <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                { n: "ELMo", d: "LSTM 기반의 Seq2Seq 구조", rnn: true },
                { n: "OpenAI GPT", d: "RNN을 사용하지 않는 트랜스포머 기반", rnn: false },
                { n: "BERT", d: "RNN을 사용하지 않는 트랜스포머 기반 — Transformer의 인코더 모델에 기반", rnn: false },
              ].map((m) => (
                <div
                  key={m.n}
                  className={`rounded-lg border p-2 ${m.rnn ? "border-gray-200 dark:border-gray-700" : "border-violet-300 dark:border-violet-700"}`}
                >
                  <p className="text-[12px] font-bold">{m.n}</p>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300">{m.d}</p>
                </div>
              ))}
            </div>
            <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              구글에서 만든 언어 모델이다. 3종류의 임베딩을 수행하며, 처음 발표할 당시부터{" "}
              <strong>사전학습(pre-training)과 미세조정(fine-tuning)</strong>의 전략을 사용하도록 제안했다.
            </p>
            <LectureNote>
              BERT는 2018년에 구글이 만들었다. 3종류의 임베딩은 단어의 위치 정보, 두 문장 중 어느 문장(A/B)에 속하는지의 구분, 그리고 단어보다 작은 서브워드 단위의 임베딩이다. 두 문장을 함께 입력받으므로 이웃한 문장 사이의 관계도 학습하고, 서브워드 단위 덕분에 사전에 없는 새 단어도 처리할 수 있다. 이만큼 방대한 사전 학습은 정보를 많이 가진 구글이었기에 가능했다.
            </LectureNote>

            <div className="mt-3 flex gap-2">
              <Chip active={stage === "pre"} onClick={() => setStage("pre")}>
                ① 사전 학습
              </Chip>
              <Chip active={stage === "fine"} onClick={() => setStage("fine")}>
                ② 미세조정
              </Chip>
            </div>
            <Scroller>
              <div className="mt-3 flex min-w-[460px] items-center gap-2 text-[11.5px]">
                <div className={`flex-1 rounded-lg border p-3 ${stage === "pre" ? "border-violet-500 bg-violet-50 dark:bg-violet-950/40" : "border-gray-200 opacity-60 dark:border-gray-700"}`}>
                  <p className="font-bold">사전 학습</p>
                  <p className="mt-1">방대한 양의 데이터로 언어 모델 구축</p>
                  <p className="mt-1 font-mono text-[11px]">책 말뭉치 800M 단어 + Wikipedia 2500M</p>
                </div>
                <span className="text-gray-300">→</span>
                <div className="rounded-lg bg-gray-100 px-3 py-4 font-bold dark:bg-gray-800">학습된 BERT</div>
                <span className="text-gray-300">→</span>
                <div className={`flex-1 rounded-lg border p-3 ${stage === "fine" ? "border-violet-500 bg-violet-50 dark:bg-violet-950/40" : "border-gray-200 opacity-60 dark:border-gray-700"}`}>
                  <p className="font-bold">미세조정</p>
                  <p className="mt-1">특정 NLP 문제에 맞는 데이터로 추가 학습</p>
                  <p className="mt-1 text-[11px]">12개 자연어처리 문제에서 당시 최고 성능</p>
                </div>
              </div>
            </Scroller>
            <p className="mt-2 text-[12px] leading-6 text-gray-600 dark:text-gray-300">
              {stage === "pre"
                ? "특정 문제를 정하지 않고, 방대한 텍스트로 충분히 학습한 언어 모델을 먼저 구축한다."
                : "특정 문제를 풀고자 할 때는 그에 맞는 데이터를 준비하여 사전에 학습된 모델을 추가로 미세조정한다. 교재는 구글이 12개 문제 모두에서 기존 최고 성능을 뛰어넘었다고 적는다. 학습된 모델과 한국어 버전도 제공되어 다양한 문제에 활용된다."}
            </p>
            <Hint>
              오답 기준 — BERT는 Transformer의 <strong>인코더</strong>에 기반한 언어 모델이다. LSTM 기반
              Seq2Seq 구조는 ELMo이고, 워드 임베딩의 대표 방법은 Word2Vec 등이다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "13.2.4 최신 언어 모델과 활용 — 그림 13-28",
            slides: "BERT: NLP 문제유형에 따른 BERT 모델의 4가지 구성방식", lecture: "사전 학습된 언어 모델에 풀고 싶은 문제에 맞는 모델을 덧붙여 교사학습하는 전이학습(transfer learning)이라고 설명",
          }}
        >
          <Card>
            <CardTitle>문제 유형에 따른 BERT의 4가지 구성 방식</CardTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              {CONFIGS.map((c) => (
                <Chip key={c.key} active={cfg === c.key} onClick={() => setCfg(c.key)}>
                  ({c.key}) {c.ko}
                </Chip>
              ))}
            </div>
            <div className="rounded-lg border border-violet-300 p-3 dark:border-violet-700">
              <p className="text-[12px] font-bold text-violet-700 dark:text-violet-300">
                ({current.key}) {current.name}
              </p>
              <div className="mx-auto mt-3 max-w-sm space-y-1.5 text-center">
                {cfg === "d" ? (
                  <TokenRow tokens={["C", "T₁", "T₂", "…", "T_N"]} tone="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200" />
                ) : (
                  <span className="inline-block rounded bg-amber-100 px-2 py-0.5 text-[10.5px] font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                    {current.output}
                  </span>
                )}
                <p className="text-gray-300">↑</p>
                <div className="rounded-md bg-violet-600 py-2 text-[12px] font-bold text-white">BERT</div>
                <p className="text-gray-300">↑</p>
                <TokenRow tokens={current.input} tone="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200" />
              </div>
              <p className="mt-3 text-[12px] text-gray-700 dark:text-gray-200">
                출력: <strong>{current.output}</strong> · 활용: <strong>{current.uses}</strong>
              </p>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-[11px] font-bold text-gray-500">판별 연습 — 어느 구성 방식인가?</p>
              <div className="space-y-2">
                {DRILL.map((d, i) => {
                  const pick = picks[i];
                  return (
                    <div key={d.task} className="rounded-lg border border-gray-200 p-2 dark:border-gray-700">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="min-w-0 flex-1 text-[12px] text-gray-700 dark:text-gray-200">{d.task}</span>
                        {(["a", "b", "c", "d"] as Cfg[]).map((k) => (
                          <button
                            key={k}
                            type="button"
                            disabled={pick !== null}
                            onClick={() => setPicks((p) => p.map((v, j) => (j === i ? k : v)))}
                            className={`h-7 w-7 rounded-md border text-[11px] font-bold ${
                              pick === null
                                ? "border-gray-200 hover:bg-violet-50 dark:border-gray-700"
                                : k === d.answer
                                  ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                                  : k === pick
                                    ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                                    : "border-gray-200 opacity-40 dark:border-gray-700"
                            }`}
                          >
                            {k}
                          </button>
                        ))}
                      </div>
                      {pick !== null && (
                        <p className="mt-1 text-[11px] text-gray-500">
                          {pick === d.answer ? "맞다" : `정답은 (${d.answer})`} — {d.why}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setPicks(DRILL.map(() => null))}
                className="mt-2 flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-700"
              >
                <RotateCcw size={13} /> 다시
              </button>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
