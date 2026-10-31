"use client";

import { useState } from "react";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, Hint, Scroller } from "./ui";

/**
 * 13.2.1 자연어처리 응용 — (3) 텍스트 분석.
 * 감성인식 리뷰 세 문장은 교재 그림 13-18(a) 그대로(오탈자 포함)이고,
 * 요약 실습의 기사 문장과 번역 응용 예문 일부는 이 화면에서 만든 것이다.
 */

type Sent = "긍정" | "중립" | "부정";

const REVIEWS: { text: string; answer: Sent }[] = [
  { text: "Menu is absolutely perfect, loved it", answer: "긍정" },
  { text: "Not bad taste and clam place", answer: "중립" },
  { text: "This place has most pathetic serving food!", answer: "부정" },
];

const CLASS_TASKS: { name: string; en: string; input: string; classes: string[]; note: string }[] = [
  {
    name: "감성인식",
    en: "sentiment classification",
    input: "영화·홈쇼핑 등의 리뷰 문장이나 문단",
    classes: ["긍정", "부정"],
    note: "문장이나 문단에 내재된 감성을 인식한다. 교재 그림 13-18(a)는 웃는 얼굴·무표정·찡그린 얼굴 세 단계로 그렸다.",
  },
  {
    name: "주제분류",
    en: "text categorization",
    input: "신문기사, 논문 초록 등",
    classes: ["사회", "경제", "연예", "스포츠"],
    note: "어떤 분야의 주제를 다루는지에 따라 몇 개의 그룹으로 자동 분류한다. 강의록 그림은 기술·스포츠·연애로 나눈다.",
  },
  {
    name: "스팸 필터링",
    en: "spam filtering",
    input: "이메일의 제목이나 내용",
    classes: ["광고성·유해 메일", "정상 메일"],
    note: "광고성 메일이나 유해 메일인지 아닌지를 판단하는 이원 분류 문제다.",
  },
];

/** 이 화면에서 만든 짧은 기사 */
const ARTICLE = [
  "올여름 폭염으로 수박 수확량이 크게 줄었다.",
  "농가들은 물 부족으로 작물 관리에 어려움을 겪었다.",
  "공급이 줄면서 시장의 수박 가격은 지난해보다 30% 올랐다.",
  "일부 소비자는 대신 토마토 같은 다른 과일을 찾고 있다.",
];
const ABSTRACT = "폭염에 수박 수확이 줄어 값이 크게 오르자 소비자들이 다른 과일로 눈을 돌리고 있다.";

const MT_USES: { label: string; from: string; to: string }[] = [
  { label: "서로 다른 두 자연어", from: "I have the book", to: "J'ai le livre" },
  { label: "방언 → 표준어", from: "밥 묵었나?", to: "밥 먹었니?" },
  { label: "어투 바꾸기", from: "이거 해 줘.", to: "이것 좀 해 주시겠어요?" },
];

export default function TextAnalysisLab() {
  const [task, setTask] = useState(0);
  const [labels, setLabels] = useState<(Sent | null)[]>(REVIEWS.map(() => null));
  const [mtUse, setMtUse] = useState(0);
  const [mtStage, setMtStage] = useState(0);
  const [mode, setMode] = useState<"ext" | "abs">("ext");
  const [picked, setPicked] = useState<number[]>([]);

  const t = CLASS_TASKS[task];
  const use = MT_USES[mtUse];

  const toggleSentence = (i: number) =>
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : p.length >= 2 ? [p[1], i] : [...p, i]));

  return (
    <section id="text-analysis" className="scroll-mt-32">
      <SectionTitle
        title="텍스트 분석 — 분류, 기계번역, 요약"
        subtitle="출력이 클래스인가, 다른 언어의 문장인가, 짧아진 문장인가"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "13.2.1 자연어처리 응용 — (3) 텍스트 분석", slides: "텍스트분석" }}>
          <Card>
            <CardTitle>텍스트 분석이란</CardTitle>
            <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              일련의 텍스트 정보를 입력으로 받아 그 <strong>의미적 내용과 문맥</strong> 등을 분석하여 원하는 결과를 도출하는
              것이다. 머신러닝에서 주로 쓰는 분류나 군집화 등의 기법이 잘 적용될 수 있는 문제다. 세 응용은 입력은 모두
              텍스트이지만 출력이 다르다.
            </p>
            <Scroller>
              <div className="mt-3 grid min-w-[480px] grid-cols-3 gap-2 text-center text-[11.5px]">
                {[
                  { n: "텍스트 분류", o: "미리 정해진 몇 개의 클래스 중 하나" },
                  { n: "기계번역", o: "같은 의미를 가진 다른 언어의 문장" },
                  { n: "텍스트 요약", o: "짧게 요약된 문장" },
                ].map((x) => (
                  <div key={x.n} className="rounded-lg border border-violet-200 p-2 dark:border-violet-800">
                    <p className="font-bold text-violet-700 dark:text-violet-300">{x.n}</p>
                    <p className="mt-1 text-gray-500">텍스트 → {x.o}</p>
                  </div>
                ))}
              </div>
            </Scroller>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "13.2.1 자연어처리 응용 — (3) 텍스트 분석", slides: "텍스트분석: 텍스트분류", lecture: "감성인식 결과는 마케팅이나 추천에 활용될 수 있다고 덧붙임" }}>
          <Card>
            <CardTitle>텍스트 분류 — 클래스가 미리 정해져 있다</CardTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              {CLASS_TASKS.map((c, i) => (
                <Chip key={c.name} active={task === i} onClick={() => setTask(i)}>
                  {c.name}
                </Chip>
              ))}
            </div>
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <p className="text-[12.5px] font-bold text-gray-800 dark:text-gray-100">
                {t.name} <span className="text-[11px] font-normal text-gray-500">{t.en}</span>
              </p>
              <p className="mt-1 text-[12px] text-gray-600 dark:text-gray-300">입력 · {t.input}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-gray-500">출력 클래스 {t.classes.length}개:</span>
                {t.classes.map((c) => (
                  <span key={c} className="rounded-md bg-violet-100 px-2 py-0.5 text-[11.5px] text-violet-700 dark:bg-violet-900/40 dark:text-violet-200">
                    {c}
                  </span>
                ))}
              </div>
              <Hint>{t.note}</Hint>
            </div>

            <p className="mb-2 mt-4 text-[12px] font-semibold text-gray-600 dark:text-gray-300">
              교재 그림 13-18(a)의 리뷰에 감성을 붙여 보세요
            </p>
            <div className="space-y-2">
              {REVIEWS.map((r, i) => {
                const l = labels[i];
                return (
                  <div key={r.text} className="flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-800/60">
                    <span className="min-w-0 flex-1 font-mono text-[12px] text-gray-700 dark:text-gray-200">“{r.text}”</span>
                    {(["긍정", "중립", "부정"] as Sent[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={l !== null}
                        onClick={() => setLabels((p) => p.map((v, j) => (j === i ? s : v)))}
                        className={`rounded-full border px-2 py-0.5 text-[11px] ${
                          l === null
                            ? "border-gray-200 hover:border-violet-400 dark:border-gray-700"
                            : s === r.answer
                              ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                              : s === l
                                ? "border-red-400 bg-red-50 text-red-600 dark:bg-red-900/30"
                                : "border-gray-100 text-gray-300 dark:border-gray-800"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                    {l !== null &&
                      (l === r.answer ? (
                        <CheckCircle size={14} className="text-green-500" />
                      ) : (
                        <XCircle size={14} className="text-red-500" />
                      ))}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <Hint>
                “Not bad”처럼 부정어가 들어가도 부정 리뷰가 아니다. 단어 하나가 아니라 문장 전체의 의미와 문맥을 봐야 하는
                이유다. 그림은 이 문장을 무표정한 얼굴로 그렸다.
              </Hint>
              <button
                type="button"
                onClick={() => setLabels(REVIEWS.map(() => null))}
                className="ml-2 flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[11px] text-gray-500 dark:border-gray-700"
              >
                <RotateCcw size={11} /> 다시
              </button>
            </div>
            <p className="mt-2 text-[12px] leading-6 text-gray-600 dark:text-gray-300">
              텍스트에서 핵심 정보를 잘 추출해 표현해 주기만 하면, 그다음은 기존 머신러닝에서 개발된 분류기를 그대로 활용할
              수 있다. 그래서 텍스트 분류가 가장 활발하게 연구된 분야다.
            </p>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "13.2.1 자연어처리 응용 — (3) 텍스트 분석", slides: "텍스트분석: 기계번역", lecture: "고전적 번역은 형태소·어휘·구조 분석을 차례로 거쳤고, 신경망 기반 번역(NMT)은 인코더가 압축한 특징을 디코더가 풀어내는 구조라고 대비" }}>
          <Card>
            <CardTitle>기계번역 — 의미를 파악하고, 다른 문장을 생성한다</CardTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              {MT_USES.map((u, i) => (
                <Chip key={u.label} active={mtUse === i} onClick={() => { setMtUse(i); setMtStage(0); }}>
                  {u.label}
                </Chip>
              ))}
            </div>
            <Scroller>
              <div className="flex min-w-[520px] items-stretch gap-2 text-center">
                <div className="flex-1 rounded-lg border border-gray-200 p-2 dark:border-gray-700">
                  <p className="text-[10px] text-gray-500">입력 문장</p>
                  <p className="mt-1 text-[12.5px] font-semibold">{use.from}</p>
                </div>
                <span className="self-center text-gray-300">→</span>
                <div className={`flex-1 rounded-lg border-2 p-2 ${mtStage >= 1 ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30" : "border-dashed border-gray-200 dark:border-gray-700"}`}>
                  <p className="text-[10px] text-gray-500">① 인코더</p>
                  <p className="mt-1 text-[11.5px]">{mtStage >= 1 ? "입력의 의미를 간소화된 특징으로 표현" : "—"}</p>
                </div>
                <span className="self-center text-gray-300">→</span>
                <div className={`flex-1 rounded-lg border-2 p-2 ${mtStage >= 2 ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30" : "border-dashed border-gray-200 dark:border-gray-700"}`}>
                  <p className="text-[10px] text-gray-500">② 디코더</p>
                  <p className="mt-1 text-[11.5px]">{mtStage >= 2 ? "같은 의미를 가진 문장을 생성" : "—"}</p>
                </div>
                <span className="self-center text-gray-300">→</span>
                <div className="flex-1 rounded-lg border border-gray-200 p-2 dark:border-gray-700">
                  <p className="text-[10px] text-gray-500">출력 문장</p>
                  <p className="mt-1 text-[12.5px] font-semibold text-violet-700 dark:text-violet-300">{mtStage >= 2 ? use.to : "?"}</p>
                </div>
              </div>
            </Scroller>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                disabled={mtStage >= 2}
                onClick={() => setMtStage((s) => s + 1)}
                className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
              >
                다음 단계
              </button>
              <button type="button" onClick={() => setMtStage(0)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 dark:border-gray-700">
                처음부터
              </button>
            </div>
            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              강의록은 기계번역을 <strong>고전적인 접근법</strong>과 <strong>딥러닝 기반의 접근법</strong>, 곧 NMT(Neural
              Machine Translation, “신경망 기반 기계번역”)로 나눈다. NMT는 위처럼 입력에서 정보를 뽑는 인코더와 출력을 내는
              디코더로 이루어진다.
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-3 text-[12px] leading-5 dark:border-gray-700">
                <p className="font-bold text-gray-600 dark:text-gray-300">컴퓨터비전의 영상변환 (13강)</p>
                <p className="mt-1 text-gray-600 dark:text-gray-300">오토인코더: 인코딩 → 축약된 특징 → 디코딩. 영상이라 주로 <strong>CNN</strong> 기반.</p>
              </div>
              <div className="rounded-lg border border-violet-300 p-3 text-[12px] leading-5 dark:border-violet-700">
                <p className="font-bold text-violet-700 dark:text-violet-300">기계번역</p>
                <p className="mt-1 text-gray-600 dark:text-gray-300">같은 인코딩·디코딩 구조를 그대로 적용. 텍스트는 순서 정보를 활용할 수 있는 <strong>RNN</strong> 기반.</p>
              </div>
            </div>
            <div className="mt-2">
              <ComputedNote>
                영어 → 프랑스어 문장은 강의록 그림의 예입니다. 방언과 어투 예문은 교재가 말하는 응용을 보여 주려고 이 화면에서 만든
                것입니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "13.2.1 자연어처리 응용 — (3) 텍스트 분석", slides: "텍스트분석: 텍스트요약", lecture: "추출 요약은 전통적으로 써 온 방법이지만 어느 문장이 핵심인지 판단하는 일 자체가 간단하지 않고, 추상적 요약에는 딥러닝 모델이 쓰인다고 설명" }}>
          <Card>
            <CardTitle>텍스트 요약 — 추출 요약과 추상적 요약</CardTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              <Chip active={mode === "ext"} onClick={() => setMode("ext")}>
                추출 extractive 요약
              </Chip>
              <Chip active={mode === "abs"} onClick={() => setMode("abs")}>
                추상적 abstractive 요약
              </Chip>
            </div>
            <p className="mb-2 text-[12px] text-gray-600 dark:text-gray-300">
              {mode === "ext"
                ? "가장 적절한 문장을 선택하여 조합한다 — 아래 원문에서 요약에 넣을 문장 두 개를 눌러 고르세요."
                : "새로운 문장을 사용하여 요약한다 — 원문에 없는 문장이 만들어진다."}
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <p className="text-[10.5px] font-semibold text-gray-500">원문 텍스트</p>
                {ARTICLE.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    disabled={mode === "abs"}
                    onClick={() => toggleSentence(i)}
                    className={`block w-full rounded-md border px-2 py-1.5 text-left text-[12px] ${
                      mode === "ext" && picked.includes(i)
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-950/40"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <span className="mr-1 text-[10px] text-gray-400">문장 {i + 1}</span>
                    {s}
                  </button>
                ))}
              </div>
              <div className="rounded-lg border-2 border-violet-300 p-3 dark:border-violet-700">
                <p className="text-[10.5px] font-semibold text-gray-500">요약</p>
                {mode === "ext" ? (
                  picked.length === 0 ? (
                    <p className="mt-1 text-[12px] text-gray-400">문장을 고르면 여기에 그대로 옮겨진다.</p>
                  ) : (
                    [...picked].sort((a, b) => a - b).map((i) => (
                      <p key={i} className="mt-1 text-[12.5px] text-gray-800 dark:text-gray-100">
                        {ARTICLE[i]}
                      </p>
                    ))
                  )
                ) : (
                  <p className="mt-1 text-[12.5px] text-gray-800 dark:text-gray-100">{ABSTRACT}</p>
                )}
                <p className="mt-3 text-[11px] text-gray-500">
                  요약 문장이 원문에 그대로 있는가?{" "}
                  <strong className="text-violet-600 dark:text-violet-400">{mode === "ext" ? "예 — 기존 문장의 편집" : "아니요 — 새로 생성"}</strong>
                </p>
              </div>
            </div>
            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              요약에는 입력 텍스트의 의미와 문맥 파악뿐 아니라 완성된 문장의 생성 기술도 함께 요구된다. 고전적인 연구의 추출적
              요약은 핵심 키워드로 여겨지는 문구들을 추출해 결합하므로, 결국 <strong>기존 문장들의 단순한 편집에 불과</strong>하다.
              이를 극복하려고 최근에는 딥러닝 모델로 여러 문장을 입력받아 전혀 새로운 문장을 생성하는 추상화적 요약 기법이
              개발되고 있다.
            </p>
            <div className="mt-2">
              <ComputedNote>원문 기사 네 문장과 추상적 요약 문장은 두 방식의 차이를 보여 주려고 이 화면에서 만든 예입니다.</ComputedNote>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
