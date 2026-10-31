"use client";

import { useState } from "react";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, Hint, Scroller } from "./ui";

/**
 * 13.2 자연어처리 · 13.2.1 자연어처리 응용.
 * 세 그룹(음성 신호처리, 대화 수행, 텍스트 분석)과 응용별 입력·출력은 교재와 강의록 그대로이고,
 * 비행기표 예매 대화문만 이 화면에서 만든 예다.
 */

type GroupKey = "speech" | "dialogue" | "text";

interface AppNode {
  id: string;
  group: GroupKey;
  name: string;
  en: string;
  def: string;
  input: string;
  output: string;
  example: string;
  pitfall: string;
}

const GROUPS: { key: GroupKey; name: string; en: string; def: string }[] = [
  {
    key: "speech",
    name: "음성 신호처리",
    en: "speech signal processing",
    def: "사람의 목소리로 발화된 음성 신호에 포함된 언어 정보를 처리하는 분야",
  },
  {
    key: "dialogue",
    name: "대화 수행",
    en: "dialogue action",
    def: "상대방과 문장을 주고받는 형식으로 진행되는 작업 — AI 스피커, 챗봇 등의 핵심 기술",
  },
  {
    key: "text",
    name: "텍스트 분석",
    en: "text analysis",
    def: "일련의 텍스트 정보를 입력으로 받아 의미적 내용과 문맥 등을 분석하여 원하는 결과를 도출하는 것",
  },
];

const NODES: AppNode[] = [
  {
    id: "asr",
    group: "speech",
    name: "음성인식",
    en: "speech recognition",
    def: "음성 신호를 텍스트로 변환하는 speech-to-text 변환(ASR 시스템).",
    input: "음성 신호",
    output: "텍스트",
    example: "발화자에 의한 변형이나 주변 소음 등에 상관없이 정확한 음절을 추출하는 것이 목적",
    pitfall: "출력이 ‘누가’가 아니라 ‘무엇을 말했는가’다. 발화자의 신원을 내면 화자인식이다.",
  },
  {
    id: "speaker",
    group: "speech",
    name: "화자인식",
    en: "speaker recognition",
    def: "발화자의 신호 패턴이 가지는 고유의 정보를 찾아 발화자의 신원을 인식하는 것.",
    input: "음성 신호",
    output: "발화자의 신원",
    example: "음성인식과 같은 음성 신호를 입력받지만 패턴을 분류하는 기준이 다르다",
    pitfall: "음성인식과 입력이 같다. 둘 다 분류 문제이고 클래스 레이블의 종류만 다르다.",
  },
  {
    id: "tts",
    group: "speech",
    name: "음성합성",
    en: "TTS, Text To Speech",
    def: "텍스트 신호를 받아 음성 신호를 합성하는 문제.",
    input: "텍스트",
    output: "음성 신호",
    example: "최근에는 특정 개인의 목소리와 발화 패턴을 학습으로 습득하여 흉내 내는 것도 가능",
    pitfall: "음성인식과 입력·출력 방향이 정반대다. 음성인식은 음성 → 텍스트, 음성합성은 텍스트 → 음성.",
  },
  {
    id: "ir",
    group: "dialogue",
    name: "정보검색",
    en: "information retrieval",
    def: "사용자가 어떤 정보에 대한 검색 요청을 자연어로 제시하면, 그 내용을 파악해 적절한 검색을 수행한 후 결과를 돌려준다.",
    input: "자연어 검색 요청 한 문장",
    output: "검색 결과",
    example: "오늘 날씨나 특정 영화에 대한 정보 요청",
    pitfall: "보통 한 번의 요청과 대응으로 이루어지는 비교적 간단한 문제다. 대화가 이어지며 정보를 쌓아 가지 않는다.",
  },
  {
    id: "qa",
    group: "dialogue",
    name: "질의응답",
    en: "question-answering",
    def: "사용자의 질의에 포함된 의도를 파악하여 적절한 대답을 생성한다.",
    input: "질문",
    output: "대답",
    example: "많은 경우 한 번의 질문과 대답으로 이루어진다",
    pitfall: "의도가 명확하게 정해져 있으므로 AI 시스템은 핵심 키워드를 파악하는 데 초점을 맞추면 된다.",
  },
  {
    id: "tod",
    group: "dialogue",
    name: "목적 지향 대화",
    en: "task-oriented dialogue",
    def: "비행기표 예매나 민원 상담 등 특정 목적을 가지고 진행하는 대화. 사용자의 요구사항을 정확히 파악해 만족시킬 수 있도록 일련의 대화가 이어져야 한다.",
    input: "여러 차례 오가는 사용자 문장",
    output: "목적 달성(예: 예매 완료)",
    example: "고전적으로는 출발지·목적지·시간·사람 수 같은 템플릿의 빈칸을 대화로 채워 가는 방식",
    pitfall: "한 문장에 요구사항이 다 들어오지 않는다. 계획적 대화와, 앞선 대화 내용을 기억하는 능력이 필요해 상당히 어려운 문제다.",
  },
  {
    id: "chat",
    group: "dialogue",
    name: "채팅",
    en: "chatting",
    def: "특정한 목적 없이 오가는 대화(교재).",
    input: "사용자 문장",
    output: "자연스러운 응답 문장",
    example: "내용의 범위는 다양하지만 옳고 그름이 크게 중요하지 않다",
    pitfall: "범위가 넓어 어려워 보이지만, 정확한 정답이 정해져 있지 않아 오히려 다루기 쉬운 문제로 본다. 중요한 것은 의도(질문·권유·요청) 파악과 제대로 된 문장 생성이다.",
  },
  {
    id: "tc",
    group: "text",
    name: "텍스트 분류",
    en: "text classification",
    def: "주어진 일련의 텍스트를 미리 정해진 몇 개의 클래스로 나누는 것.",
    input: "문구·문장·문단·기사·논문 등",
    output: "클래스 레이블",
    example: "스팸 필터링, 감성인식(sentiment classification), 주제분류(text categorization)",
    pitfall: "핵심 정보를 잘 추출해 표현하기만 하면 기존 머신러닝의 분류기를 활용할 수 있어 가장 활발히 연구된 분야다.",
  },
  {
    id: "mt",
    group: "text",
    name: "기계번역",
    en: "machine translation",
    def: "문장을 입력받아 같은 의미를 가진 다른 언어의 문장을 생성한다.",
    input: "문장",
    output: "문장",
    example: "한국어 → 영어, 방언 → 표준어, 어투 바꾸기",
    pitfall: "출력이 클래스가 아니라 문장이다. 의미 파악과 문장 생성 두 단계가 필요하다.",
  },
  {
    id: "sum",
    group: "text",
    name: "텍스트 요약",
    en: "text summarization",
    def: "긴 분량의 텍스트를 입력받아 짧게 요약된 문장으로 출력한다.",
    input: "신문기사·논문 같은 긴 텍스트",
    output: "짧은 요약 문장",
    example: "추출(extractive) 요약과 추상적(abstractive) 요약",
    pitfall: "언어가 바뀌지 않는다. 같은 언어로 길이만 줄이면 요약, 다른 언어로 바꾸면 번역이다.",
  },
];

const DRILL: { q: string; answer: string }[] = [
  { q: "같은 음성을 받아 누가 말했는지를 알아낸다", answer: "speaker" },
  { q: "회의 녹음을 받아 받아쓰기한 텍스트를 낸다", answer: "asr" },
  { q: "뉴스 원고 텍스트를 받아 읽어 주는 목소리를 만든다", answer: "tts" },
  { q: "영화 리뷰 문장을 받아 긍정·부정 중 하나를 낸다", answer: "tc" },
  { q: "사투리 문장을 받아 같은 뜻의 표준어 문장을 낸다", answer: "mt" },
  { q: "여러 차례 묻고 답하며 민원 상담을 끝까지 처리한다", answer: "tod" },
  { q: "긴 논문을 받아 몇 문장짜리 요약을 낸다", answer: "sum" },
  { q: "‘오늘 날씨 알려줘’ 한 문장을 받아 검색 결과를 돌려준다", answer: "ir" },
];

/** 이 화면에서 만든 비행기표 예매 대화 */
const FLIGHT: { user: string; fill: Partial<Record<"from" | "to" | "time" | "count", string>>; system: string }[] = [
  { user: "비행기표 좀 예매하려고요.", fill: {}, system: "어디에서 출발하시나요?" },
  { user: "서울에서 출발해요.", fill: { from: "서울" }, system: "도착지는 어디인가요?" },
  { user: "제주요. 금요일 오전이면 좋겠어요.", fill: { to: "제주", time: "금요일 오전" }, system: "몇 분이 가시나요?" },
  { user: "두 명이요.", fill: { count: "2명" }, system: "서울 → 제주, 금요일 오전, 2명으로 예매하겠습니다." },
];

const SLOTS: { key: "from" | "to" | "time" | "count"; label: string }[] = [
  { key: "from", label: "출발지" },
  { key: "to", label: "목적지" },
  { key: "time", label: "시간" },
  { key: "count", label: "사람 수" },
];

const tone: Record<GroupKey, string> = {
  speech: "border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/30",
  dialogue: "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30",
  text: "border-violet-300 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/30",
};

export default function NlpApplicationMap() {
  const [sel, setSel] = useState("asr");
  const [speechLabel, setSpeechLabel] = useState<"asr" | "speaker">("asr");
  const [drill, setDrill] = useState<(string | null)[]>(DRILL.map(() => null));
  const [turn, setTurn] = useState(0);

  const node = NODES.find((n) => n.id === sel)!;
  const filled: Record<string, string> = {};
  FLIGHT.slice(0, turn).forEach((t) => Object.assign(filled, t.fill));
  const score = drill.filter((d, i) => d === DRILL[i].answer).length;

  return (
    <section id="nlp-applications" className="scroll-mt-32">
      <SectionTitle
        title="자연어처리와 그 응용"
        subtitle="인간의 언어를 컴퓨터가 다룬다는 것 — 세 갈래의 응용을 입력과 출력으로 구분해 봅니다"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "13.2 자연어처리", slides: "자연어처리" }}>
          <Card>
            <CardTitle>자연어와 인공언어</CardTitle>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-violet-300 p-3 dark:border-violet-700">
                <p className="text-[12px] font-bold text-violet-600 dark:text-violet-400">자연어 (“인간언어”)</p>
                <p className="mt-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                  한국어, 영어, 일본어, 중국어, 스페인어 등. 인간의 문화에서 자연스럽게 발생한 언어로,
                  정보 전달의 수단으로서 <strong>인간 고유의 능력</strong>이다.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[12px] font-bold text-gray-600 dark:text-gray-300">인공언어</p>
                <p className="mt-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                  특정 목적을 위해 인위적으로 만든 언어. 예: 프로그래밍 언어(C, 파이썬, 자바 등).
                  자연어보다 <strong>엄격한 문법</strong>을 가진다.
                </p>
              </div>
            </div>
            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              <strong>자연어처리</strong>(NLP, Natural Language Processing)는 컴퓨터로 자연어를{" "}
              <strong>이해</strong>(understanding)하고, <strong>번역/해석</strong>(translation/interpretation)하고,{" "}
              <strong>조작</strong>(manipulation)하기 위한 인공지능의 한 분야다.
            </p>
            <Hint>
              컴퓨터비전이 영상에 담긴 정보를 처리한다면, 자연어처리는 텍스트의 시퀀스에 담긴 정보를 처리한다.
              그래서 머신러닝 기법도 컴퓨터비전과는 다른 형태로 독자적으로 개발되어 왔다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "13.2.1 자연어처리 응용",
            slides: "자연어처리응용", lecture: "음성 신호처리·대화 수행·텍스트 분석의 세 갈래는 이해를 쉽게 하려고 나눈 것이라 분류 자체에 큰 의미를 둘 필요는 없다고 짚음",
          }}
        >
          <Card>
            <CardTitle>응용 지도 — 노드를 눌러 입력과 출력을 확인하세요</CardTitle>
            <Scroller>
              <div className="grid min-w-[560px] grid-cols-3 gap-3">
                {GROUPS.map((g) => (
                  <div key={g.key} className={`rounded-xl border-2 p-3 ${tone[g.key]}`}>
                    <p className="text-[12.5px] font-bold text-gray-800 dark:text-gray-100">{g.name}</p>
                    <p className="text-[10px] text-gray-500">{g.en}</p>
                    <p className="mt-1 text-[10.5px] leading-4 text-gray-600 dark:text-gray-300">{g.def}</p>
                    <div className="mt-2 space-y-1.5">
                      {NODES.filter((n) => n.group === g.key).map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => setSel(n.id)}
                          aria-pressed={sel === n.id}
                          className={`w-full rounded-md border px-2 py-1.5 text-left text-[11.5px] font-semibold transition-colors ${
                            sel === n.id
                              ? "border-violet-600 bg-violet-600 text-white"
                              : "border-gray-200 bg-white text-gray-700 hover:border-violet-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                          }`}
                        >
                          {n.name}
                          {n.id === "chat" && <span className="ml-1 text-[9.5px] font-normal opacity-70">(교재)</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Scroller>

            <div className="mt-3 rounded-lg border border-violet-200 p-3 dark:border-violet-800">
              <p className="text-[13px] font-bold text-violet-700 dark:text-violet-300">
                {node.name} <span className="text-[11px] font-normal text-gray-500">{node.en}</span>
              </p>
              <p className="mt-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                <span className="font-semibold">정의</span> · {node.def}
              </p>
              <div className="my-2 flex flex-wrap items-center gap-2 text-[12px]">
                <span className="rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-800">입력: {node.input}</span>
                <span className="text-gray-400">→</span>
                <span className="rounded-md bg-violet-100 px-2 py-1 dark:bg-violet-900/40">출력: {node.output}</span>
              </div>
              <p className="text-[12px] leading-6 text-gray-600 dark:text-gray-300">
                <span className="font-semibold">예</span> · {node.example}
              </p>
              <p className="mt-1 text-[12px] leading-6 text-rose-600 dark:text-rose-300">
                <span className="font-semibold">헷갈리는 기준</span> · {node.pitfall}
              </p>
            </div>
            <Hint>
              음성 신호처리 연구는 신호의 고유 특성 분석과 잡음 제거 같은 신호처리 기술에 초점이 맞추어져 있어,
              자연어처리를 좁은 의미로 해석할 때는 음성 신호를 포함하지 않는 경우도 있다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "13.2.1 자연어처리 응용 — (1) 음성 신호처리", slides: "음성신호처리", lecture: "음성 신호처리는 신호처리 기술에 초점이 있어 좁은 의미의 자연어처리에서는 빠지기도 하고, 음성인식은 텍스트로 바꾸는 데까지이며 그 뜻을 파악하는 것은 별개의 문제라고 구분" }}>
          <Card>
            <CardTitle>같은 음성, 다른 클래스 레이블 — 음성인식과 화자인식</CardTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              <Chip active={speechLabel === "asr"} onClick={() => setSpeechLabel("asr")}>
                음성인식으로 레이블링
              </Chip>
              <Chip active={speechLabel === "speaker"} onClick={() => setSpeechLabel("speaker")}>
                화자인식으로 레이블링
              </Chip>
            </div>
            <Scroller>
              <div className="flex min-w-[420px] items-center gap-3">
                <div className="flex-1 rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
                  <p className="text-[10px] text-gray-500">입력 (같다)</p>
                  <svg viewBox="0 0 120 30" className="mx-auto mt-1 h-8 w-32" aria-hidden>
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      className="text-violet-500"
                      strokeWidth="1.5"
                      points="0,15 8,15 12,5 16,25 20,8 24,22 28,15 40,15 44,3 48,27 52,10 56,20 60,15 75,15 79,7 83,23 87,15 120,15"
                    />
                  </svg>
                  <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-200">음성 신호</p>
                </div>
                <span className="text-gray-400">→ 분류 →</span>
                <div className="flex-1 rounded-lg border-2 border-violet-400 p-3 text-center dark:border-violet-600">
                  <p className="text-[10px] text-gray-500">클래스 레이블 (다르다)</p>
                  <p className="mt-1 text-[12.5px] font-bold text-violet-700 dark:text-violet-300">
                    {speechLabel === "asr" ? "말한 음절·텍스트" : "발화자의 신원"}
                  </p>
                  <p className="mt-1 text-[10.5px] text-gray-500">
                    {speechLabel === "asr"
                      ? "누가 말했든, 소음이 있든 같은 텍스트가 나와야 한다"
                      : "무슨 말을 했든 같은 사람이면 같은 레이블이 나와야 한다"}
                  </p>
                </div>
              </div>
            </Scroller>
            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              교재는 두 경우 모두 <strong>음성 신호를 입력으로 하는 분류 문제</strong>이며, 입력에 대해 레이블링된
              클래스 레이블의 종류가 다르다고 보면 된다고 정리한다. 음성인식에서는 발화자에 의한 변형이 지워야 할 잡음이고,
              화자인식에서는 바로 그 발화자 고유의 패턴이 찾아야 할 정보다.
            </p>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "13.2.1 자연어처리 응용 — (2) 대화 수행", slides: "대화수행", lecture: "잡담은 옳고 그름도 이전 대화의 기억도 필요 없어 어렵지 않지만, 목적 지향 대화는 사용자가 말하지 않은 정보(극장·지역·시간)까지 뽑아내고 이전 대화를 기억해야 해서 어렵다고 대비" }}>
          <Card>
            <CardTitle>목적 지향 대화 — 템플릿의 빈칸을 대화로 채우기</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              정보검색과 질의응답은 한 번의 요청과 대응으로 끝나고 의도도 명확해, 핵심 키워드만 잘 파악하면 된다.
              목적 지향 대화는 다르다. 사용자가 요구사항을 한 문장에 모두 담지 않으므로, 필요한 정보를 뽑아 가는{" "}
              <strong>계획적 대화</strong>와 앞의 내용을 쌓아 두는 <strong>기억 능력</strong>이 함께 필요하다.
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_200px]">
              <div className="space-y-1.5 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                {FLIGHT.slice(0, turn).map((t, i) => (
                  <div key={i} className="space-y-1">
                    <p className="ml-auto w-fit max-w-[85%] rounded-lg bg-violet-600 px-2.5 py-1 text-[12px] text-white">
                      {t.user}
                    </p>
                    <p className="w-fit max-w-[85%] rounded-lg bg-white px-2.5 py-1 text-[12px] text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                      {t.system}
                    </p>
                  </div>
                ))}
                {turn === 0 && <p className="text-[11px] text-gray-400">‘다음 발화’를 눌러 대화를 진행하세요.</p>}
              </div>
              <div className="rounded-lg border border-violet-200 p-3 dark:border-violet-800">
                <p className="mb-2 text-[11px] font-bold text-gray-500">예매 템플릿</p>
                {SLOTS.map((s) => (
                  <div key={s.key} className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="text-gray-500">{s.label}</span>
                    <span
                      className={`rounded px-1.5 font-semibold ${
                        filled[s.key] ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200" : "text-gray-300"
                      }`}
                    >
                      {filled[s.key] ?? "____"}
                    </span>
                  </div>
                ))}
                <p className="mt-2 text-[10.5px] text-gray-500">
                  {Object.keys(filled).length}/4 칸 — {Object.keys(filled).length === 4 ? "목적 달성" : "아직 대화가 필요"}
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                disabled={turn >= FLIGHT.length}
                onClick={() => setTurn((t) => t + 1)}
                className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
              >
                다음 발화
              </button>
              <button
                type="button"
                onClick={() => setTurn(0)}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 dark:border-gray-700"
              >
                <RotateCcw size={12} /> 처음부터
              </button>
            </div>
            <p className="mt-3 text-[12px] leading-6 text-gray-600 dark:text-gray-300">
              3번째 발화에서 두 칸이 한꺼번에 채워진 것을 보라. 시스템은 어느 칸이 이미 찼는지 기억하고 있어야 다음에
              무엇을 물을지 정할 수 있다. 다만 이 템플릿은 특정 문제에 맞춰 개발자가 일일이 설계한 것이라 머신러닝이 들어갈
              부분이 많지 않았다. 최근에는 대화의 의도 파악, 이전 대화 내용 기억 같은 일반적인 태스크를 수행하는 딥러닝
              모델들이 개발되고 있다.
            </p>
            <div className="mt-2 rounded-lg border border-gray-200 p-3 text-[12px] leading-6 text-gray-700 dark:border-gray-700 dark:text-gray-200">
              <strong>채팅</strong>은 목적이 없어 범위는 넓지만, 정확한 정답이 정해져 있지 않아 오히려 다루기 쉬운 문제로
              본다. 중요한 것은 문장에 담긴 의도(질문인지 권유인지 요청인지)를 정확히 파악하는 것과 제대로 된 문장을 생성해
              발화하는 것이다.
            </div>
            <div className="mt-2">
              <ComputedNote>
                예매 대화 문장과 채워진 값은 템플릿 방식을 보여 주려고 이 화면에서 만든 예입니다. 출발지·목적지·시간·사람 수라는
                템플릿 항목은 교재의 예를 따랐습니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "13.2.1 자연어처리 응용", slides: "자연어처리응용" }}>
          <Card>
            <CardTitle>판별 연습 — 입력과 출력을 보고 응용을 고르세요</CardTitle>
            <div className="space-y-3">
              {DRILL.map((d, i) => {
                const picked = drill[i];
                const ok = picked === d.answer;
                const ans = NODES.find((n) => n.id === d.answer)!;
                const pickedNode = NODES.find((n) => n.id === picked);
                return (
                  <div key={d.q} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                    <p className="mb-2 text-[12.5px] font-semibold text-gray-800 dark:text-gray-100">
                      {i + 1}. {d.q}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {NODES.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          disabled={picked !== null}
                          onClick={() => setDrill((p) => p.map((v, j) => (j === i ? n.id : v)))}
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] ${
                            picked === null
                              ? "border-gray-200 hover:border-violet-400 dark:border-gray-700"
                              : n.id === d.answer
                                ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : n.id === picked
                                  ? "border-red-400 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300"
                                  : "border-gray-100 text-gray-300 dark:border-gray-800 dark:text-gray-600"
                          }`}
                        >
                          {n.name}
                        </button>
                      ))}
                    </div>
                    {picked !== null && (
                      <p className={`mt-2 flex items-start gap-1.5 text-[11.5px] leading-5 ${ok ? "text-green-700 dark:text-green-300" : "text-red-600 dark:text-red-300"}`}>
                        {ok ? <CheckCircle size={14} className="mt-0.5 shrink-0" /> : <XCircle size={14} className="mt-0.5 shrink-0" />}
                        <span>
                          {ok ? "맞습니다." : `정답은 ${ans.name}.`} 입력: {ans.input} → 출력: {ans.output}.{" "}
                          {!ok &&
                            pickedNode &&
                            `고른 ${pickedNode.name}은(는) ${pickedNode.input} → ${pickedNode.output}이다.`}
                        </span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[12px] text-gray-500">
                {score} / {DRILL.length} 정답
              </span>
              <button
                type="button"
                onClick={() => setDrill(DRILL.map(() => null))}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-500 dark:border-gray-700"
              >
                <RotateCcw size={12} /> 다시
              </button>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
