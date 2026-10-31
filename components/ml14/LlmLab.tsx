"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { ACCENT, Card, CardTitle, Chip, ComputedNote, Hint, Scroller, LectureNote } from "./ui";

/**
 * 강의록 04 대규모 언어 모델 — LLM의 정의, PLM vs LLM 규모, 창발적 능력,
 * 그리고 LLM 개발 및 활용의 4단계.
 * 교재 13장 본문은 BERT·GPT까지만 다루므로 이 섹션은 강의록만을 근거로 한다.
 */

interface Model {
  name: string;
  /** 파라미터 수 — 억 단위 */
  eok: number;
  label: string;
}

/** 강의록 'PLM vs LLM'에 적힌 다섯 모델 */
const MODELS: Model[] = [
  { name: "BERT", eok: 3.3, label: "3.3억" },
  { name: "GPT2", eok: 15, label: "15억" },
  { name: "LLaMA", eok: 650, label: "~650억" },
  { name: "GPT3", eok: 1750, label: "1750억" },
  { name: "PaLM", eok: 5400, label: "5400억" },
];

const LLM_THRESHOLD = 100; // 100억

type StageKey = "pre" | "fine" | "infer" | "eval";

interface Stage {
  key: StageKey;
  no: string;
  name: string;
  en: string;
  gist: string;
  items: { t: string; d: string }[];
}

const STAGES: Stage[] = [
  {
    key: "pre",
    no: "⑴",
    name: "사전 학습",
    en: "pre-training",
    gist: "대규모 데이터를 이용한 기본 학습",
    items: [
      { t: "데이터 수집 및 전처리", d: "학습에 쓸 대규모 텍스트를 모으고 다듬는다." },
      {
        t: "모델 아키텍처 및 세부 설정",
        d: "모델의 구조(architecture)와 세부 설정(configuration)을 정한다.",
      },
      { t: "학습 기법 설계", d: "대규모 데이터로 어떻게 학습시킬지를 설계한다." },
    ],
  },
  {
    key: "fine",
    no: "⑵",
    name: "미세조정",
    en: "fine-tuning",
    gist: "특정 목적에 맞게 성능 개선을 위한 추가 학습",
    items: [
      {
        t: "지시학습 Instruction Tuning",
        d: "‘질문-대답’ 형식에 맞춘 샘플을 이용한 지도학습",
      },
      {
        t: "정렬 학습 Alignment Tuning",
        d: "인간의 선호에 맞는 응답을 만들기 위한 강화학습",
      },
      {
        t: "매개변수 효율적 미세조정 PEFT",
        d: "LoRA, Adapters 같은 방법으로 전체 모델을 재학습하지 않고 일부 파라미터만 조정",
      },
    ],
  },
  {
    key: "infer",
    no: "⑶",
    name: "추론",
    en: "Inference",
    gist: "학습된 LLM의 활용",
    items: [
      {
        t: "프롬프트 엔지니어링",
        d: "다양한 과제에 적합한 프롬프트 설계 — 제로샷 Zero-shot, 퓨샷 Few-shot, 사고과정 유도 프롬팅 CoT, ReAct 기법",
      },
      { t: "RAG Retrieval-Augmented Generation", d: "검색 기반 생성/보완" },
    ],
  },
  {
    key: "eval",
    no: "⑷",
    name: "평가",
    en: "Evaluation",
    gist: "성능과 여러 측면의 평가",
    items: [
      { t: "벤치마크 과제", d: "다양한 벤치마크 과제를 통한 성능 평가" },
      {
        t: "다양한 측면의 평가",
        d: "편향성, 윤리성, 안정성, 개인정보 유출 가능성 등",
      },
    ],
  },
];

/** 활동 → 단계 배정 드릴 */
const SORT_ITEMS: { text: string; answer: StageKey; why: string }[] = [
  {
    text: "LoRA로 일부 파라미터만 조정한다",
    answer: "fine",
    why: "LoRA·Adapters는 매개변수 효율적 미세조정(PEFT)의 방법이다. 전체 모델을 재학습하지 않는다는 점이 핵심이다.",
  },
  {
    text: "‘질문-대답’ 형식의 샘플로 지도학습한다",
    answer: "fine",
    why: "지시학습(Instruction Tuning)이다. 이미 사전 학습된 모델을 특정 목적에 맞춰 추가 학습하므로 미세조정 단계다.",
  },
  {
    text: "인간의 선호에 맞는 응답을 만들도록 강화학습한다",
    answer: "fine",
    why: "정렬 학습(Alignment Tuning)이다. 강의록은 이를 미세조정 단계 아래에 둔다.",
  },
  {
    text: "대규모 텍스트를 수집하고 전처리한다",
    answer: "pre",
    why: "사전 학습 단계의 첫 항목인 ‘데이터 수집 및 전처리’다.",
  },
  {
    text: "모델 아키텍처와 세부 설정을 정한다",
    answer: "pre",
    why: "사전 학습 단계의 두 번째 항목이다. 학습을 시작하기 전에 정해야 한다.",
  },
  {
    text: "프롬프트에 예시 몇 개를 넣어 질문한다",
    answer: "infer",
    why: "퓨샷(Few-shot) 프롬프트다. 학습된 LLM을 활용하는 추론 단계의 프롬프트 엔지니어링에 속한다.",
  },
  {
    text: "외부 문서를 검색해 프롬프트에 함께 넣어 답을 생성한다",
    answer: "infer",
    why: "RAG다. 강의록은 RAG를 추론 단계 아래에 둔다.",
  },
  {
    text: "편향성·개인정보 유출 가능성을 점검한다",
    answer: "eval",
    why: "평가 단계는 벤치마크 성능뿐 아니라 편향성, 윤리성, 안정성, 개인정보 유출 가능성 등 다양한 측면을 본다.",
  },
];

const STAGE_LABEL: Record<StageKey, string> = {
  pre: "사전 학습",
  fine: "미세조정",
  infer: "추론",
  eval: "평가",
};

export default function LlmLab() {
  const [logScale, setLogScale] = useState(true);
  const [stage, setStage] = useState<StageKey>("pre");
  const [picks, setPicks] = useState<(StageKey | null)[]>(SORT_ITEMS.map(() => null));

  const maxEok = MODELS[MODELS.length - 1].eok;
  const logMin = Math.log10(1);
  const logMax = Math.log10(10000);
  const widthOf = (eok: number) =>
    logScale
      ? ((Math.log10(eok) - logMin) / (logMax - logMin)) * 100
      : (eok / maxEok) * 100;
  const thresholdPos = widthOf(LLM_THRESHOLD);

  const cur = STAGES.find((s) => s.key === stage)!;
  const solved = picks.filter((p, i) => p === SORT_ITEMS[i].answer).length;

  return (
    <section id="llm" className="scroll-mt-32">
      <SectionTitle
        title="대규모 언어 모델(LLM)"
        subtitle="사전 학습된 언어 모델의 규모를 키우면 무엇이 달라지는가, 그리고 LLM을 만들고 쓰는 4단계"
      />

      <div className="space-y-5">
        <Sourced refs={{ slides: "대규모언어모델 LLM, Large Language Models", lecture: "대규모 언어 모델 단원은 교재에 없는 보충 자료라고 밝히고, 타임라인에서 2022년 이후 instruction-tuned 모델의 증가와 LLaMA 2 이후의 오픈소스 생태계를 짚음" }}>
          <Card>
            <CardTitle>정의 — PLM의 규모를 확대한 언어 모델</CardTitle>
            <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              대규모 언어 모델(LLM, Large Language Models)은{" "}
              <strong>사전 학습된(Pre-trained) 언어 모델(PLM)의 규모를 확대하여 대용량의 데이터를
              학습한 언어 모델</strong>이다. 강의록은 기준으로 <strong>100억 이상의 파라미터</strong>를
              들고, 대표적 모델로 GPT3/3.5/…, LLaMA를 든다.
            </p>
            <p className="mt-2 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              직관적으로는, 앞에서 본 BERT처럼 “크게 사전 학습해 두고 가져다 쓰는” 언어 모델을 규모
              면에서 한 단계 더 키운 것이다. 아래 막대에서 BERT와 GPT2는 100억 선 왼쪽(PLM)에,
              GPT3·PaLM·LLaMA는 오른쪽(LLM)에 놓인다.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Chip active={logScale} onClick={() => setLogScale(true)}>
                로그 눈금
              </Chip>
              <Chip active={!logScale} onClick={() => setLogScale(false)}>
                일반 눈금
              </Chip>
            </div>

            <Scroller>
              <div className="relative mt-3 min-w-[340px] space-y-2 pr-2">
                <div
                  className="pointer-events-none absolute inset-y-0 border-l-2 border-dashed border-violet-500"
                  style={{ left: `calc(64px + (100% - 64px - 8px) * ${(thresholdPos / 100).toFixed(4)})` }}
                >
                  <span className="absolute -top-0.5 left-1 whitespace-nowrap text-[10px] font-bold text-violet-600 dark:text-violet-400">
                    100억
                  </span>
                </div>
                {MODELS.map((m) => {
                  const isLlm = m.eok >= LLM_THRESHOLD;
                  return (
                    <div key={m.name} className="flex items-center gap-2 pt-3">
                      <span className="w-14 shrink-0 text-right text-[11px] font-bold text-gray-700 dark:text-gray-200">
                        {m.name}
                      </span>
                      <div className="relative h-5 flex-1 rounded-sm bg-gray-100 dark:bg-gray-800">
                        <motion.div
                          className={`h-5 rounded-sm ${isLlm ? "bg-violet-600" : "bg-gray-400"}`}
                          animate={{ width: `${Math.max(0.6, widthOf(m.eok)).toFixed(2)}%` }}
                          transition={{ duration: 0.4 }}
                        />
                        <span className="absolute inset-y-0 right-1 flex items-center text-[10.5px] font-mono text-gray-600 dark:text-gray-300">
                          {m.label} · {isLlm ? "LLM" : "PLM"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Scroller>
            <Hint>
              일반 눈금으로 바꾸면 BERT와 GPT2 막대는 거의 보이지 않는다. PaLM(5400억)은 BERT(3.3억)의
              약 {Math.round(5400 / 3.3).toLocaleString("en-US")}배다. 로그 눈금에서는 같은 길이가 같은
              배율을 뜻한다.
            </Hint>
            <LectureNote>
              이 단원은 교재에 없고 강의록에만 있는 보충 자료다. 강의는 LLM 타임라인 슬라이드에서 두 흐름을 짚었다 — 2022년 무렵부터 사전 학습만 한(pre-trained) 모델보다 instruction tuning·alignment tuning을 적용한 모델이 중심이 되었고, LLaMA 2가 나온 뒤 Hugging Face 등을 중심으로 오픈소스 생태계가 만들어졌다. 앞으로는 사용자 맞춤형 튜닝과 모델의 개방성이 경쟁의 핵심이 되리라는 전망도 덧붙였다.
            </LectureNote>
          </Card>
        </Sourced>

        <Sourced refs={{ slides: "대규모언어모델 — LLM의 창발적 능력", lecture: "In-context learning은 모델을 추가 학습(파인튜닝)하지 않고 입력에 예시 몇 가지를 보여 주는 것만으로 새 태스크를 수행하는 능력이라고 설명" }}>
          <Card>
            <CardTitle>LLM의 창발적 능력 emergent ability</CardTitle>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[11px] font-bold text-gray-500">정의</p>
                <p className="mt-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                  <strong>소규모 PLM이 가지지 못하는 새로운 능력/특성</strong>을 보여 주는 것.
                </p>
              </div>
              <div className="rounded-lg border border-violet-300 p-3 dark:border-violet-700">
                <p className={`text-[11px] font-bold ${ACCENT}`}>대표 예 — 문맥/맥락 내 학습</p>
                <p className="mt-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                  <strong>In-context learning</strong>을 통해 새로운 태스크 수행이 가능하다. 주어진
                  문맥(맥락) 안에서 새로운 태스크를 해낸다는 뜻으로, 소규모 PLM에서는 볼 수 없던 능력이다.
                </p>
              </div>
            </div>
            <Hint>
              헷갈리는 기준 — 창발적 능력은 ‘규모를 키우자 새로 나타난 능력’이다. 그래서 비교 대상은
              늘 소규모 PLM이다. “PLM도 가진 능력”이라거나 “특정 문제에 맞춘 추가 학습(미세조정)으로
              넣어 준 능력”이라고 설명하면 창발적 능력의 정의와 어긋난다.
            </Hint>
            <LectureNote>
              In-context learning은 모델에 파인튜닝 같은 추가 학습을 하지 않고, 입력에 몇 가지 예시를 보여 주는 것만으로 새로운 태스크를 수행하는 능력이다.
            </LectureNote>
          </Card>
        </Sourced>

        <Sourced refs={{ slides: "LLM 개발 및 활용의 4단계", lecture: "사전 학습은 웹·위키피디아·코드·책·논문 등에서 모은 데이터로 트랜스포머 구조를 수백~수천 시간 학습시키고, 평가에서는 성능 외에 편향성·윤리성·안정성·개인정보 유출 가능성까지 봐야 실제 서비스에 쓸 수 있다고 강조" }}>
          <Card>
            <CardTitle>LLM 개발 및 활용의 4단계</CardTitle>
            <Scroller>
              <div className="flex min-w-[460px] items-stretch gap-1.5">
                {STAGES.map((s, i) => {
                  const on = s.key === stage;
                  return (
                    <div key={s.key} className="flex flex-1 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setStage(s.key)}
                        aria-pressed={on}
                        className={`flex-1 rounded-lg border px-2 py-2 text-center transition-colors ${
                          on
                            ? "border-violet-600 bg-violet-600 text-white"
                            : "border-gray-200 bg-white text-gray-700 hover:border-violet-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                        }`}
                      >
                        <p className="text-[12px] font-bold">
                          {s.no} {s.name}
                        </p>
                        <p className={`text-[10px] ${on ? "text-violet-100" : "text-gray-400"}`}>
                          {s.en}
                        </p>
                      </button>
                      {i < STAGES.length - 1 && <span className="text-gray-300">→</span>}
                    </div>
                  );
                })}
              </div>
            </Scroller>

            <AnimatePresence mode="wait">
              <motion.div
                key={cur.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="mt-3 rounded-lg border border-violet-200 bg-violet-50/50 p-3 dark:border-violet-900 dark:bg-violet-950/20"
              >
                <p className="text-[12.5px] font-bold text-violet-800 dark:text-violet-200">
                  {cur.no} {cur.name} {cur.en} → {cur.gist}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {cur.items.map((it) => (
                    <li key={it.t} className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                      ▪ <strong>{it.t}</strong> — {it.d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            <Hint>
              순서가 곧 기준이다. 사전 학습은 대규모 데이터로 기본 능력을 만들고, 미세조정은 그 모델을
              특정 목적에 맞게 추가 학습하며, 추론은 학습이 끝난 모델을 쓰는 단계, 평가는 그 결과를
              여러 측면에서 확인하는 단계다. 프롬프트 엔지니어링과 RAG는 학습된 LLM을 활용하는
              추론 단계에 속하므로, 미세조정처럼 추가 학습을 하는 방법이 아니다.
            </Hint>
            <LectureNote>
              사전 학습 데이터는 웹·위키피디아·코드·책·논문 등에서 모으고, 보통 트랜스포머 기반 구조에서 수백~수천 시간 동안 학습시킨다. 평가에서 편향성·윤리성·안정성·개인정보 유출 가능성까지 보는 것은, 실제 서비스에 쓰려면 벤치마크 성능만으로는 부족하기 때문이다.
            </LectureNote>
          </Card>
        </Sourced>

        <Sourced refs={{ slides: "LLM 개발 및 활용의 4단계" }}>
          <Card>
            <CardTitle>이 활동은 몇 번째 단계인가</CardTitle>
            <p className="mb-3 text-[12px] text-gray-500">
              각 활동에 알맞은 단계를 고르세요. 고르면 바로 판정과 이유가 나옵니다.
            </p>
            <div className="space-y-2">
              {SORT_ITEMS.map((item, i) => {
                const pick = picks[i];
                const done = pick !== null;
                const ok = pick === item.answer;
                return (
                  <div
                    key={item.text}
                    className="rounded-lg border border-gray-200 p-2.5 dark:border-gray-700"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="min-w-0 flex-1 text-[12.5px] text-gray-700 dark:text-gray-200">
                        {item.text}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(Object.keys(STAGE_LABEL) as StageKey[]).map((k) => (
                          <button
                            key={k}
                            type="button"
                            onClick={() =>
                              setPicks((prev) => prev.map((v, j) => (j === i ? k : v)))
                            }
                            className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold transition-colors ${
                              pick === k
                                ? ok
                                  ? "border-green-500 bg-green-500 text-white"
                                  : "border-red-400 bg-red-400 text-white"
                                : "border-gray-200 text-gray-500 hover:border-violet-300 dark:border-gray-700"
                            }`}
                          >
                            {STAGE_LABEL[k]}
                          </button>
                        ))}
                      </div>
                    </div>
                    {done && (
                      <p
                        className={`mt-1.5 flex items-start gap-1.5 text-[11.5px] leading-5 ${
                          ok ? "text-green-700 dark:text-green-300" : "text-red-600 dark:text-red-300"
                        }`}
                      >
                        {ok ? (
                          <CheckCircle size={13} className="mt-0.5 shrink-0" />
                        ) : (
                          <XCircle size={13} className="mt-0.5 shrink-0" />
                        )}
                        <span>
                          {ok ? "" : `정답은 ${STAGE_LABEL[item.answer]} — `}
                          {item.why}
                        </span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <p className={`mt-3 text-[12px] font-semibold ${ACCENT}`}>
              맞힌 개수 {solved} / {SORT_ITEMS.length}
            </p>
          </Card>
        </Sourced>

        <ComputedNote>
          막대의 길이는 강의록에 적힌 파라미터 수를 그대로 그린 것입니다. LLaMA는 강의록 표기대로
          ‘~650억’(최대치)을 썼고, 로그 눈금은 1억~1조 범위로 이 화면에서 잡았습니다. 강의록은 대표
          LLM의 연대표(2025년 8월 7일 GPT-5 발표 등, 오픈 소스와 클로즈드 소스 구분)도 그림으로
          보여 주는데, 개별 모델 이름은 시험 범위의 개념이 아니어서 여기서는 옮기지 않았습니다.
        </ComputedNote>
      </div>
    </section>
  );
}
