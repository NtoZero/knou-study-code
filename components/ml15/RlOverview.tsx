"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ConceptRows, Hint, P } from "./ui";

/**
 * 14장 도입부와 강의록 01 강화학습의 개요 앞부분.
 * 머신러닝의 유형 → 적용 사례 → 응용 분야의 공통 특징 → 강화학습의 정의 순서를 따른다.
 */

type Kind = "supervised" | "unsupervised" | "rl";

const KINDS: {
  id: Kind;
  name: string;
  en: string;
  signal: string;
  task: string;
  note: string;
}[] = [
  {
    id: "supervised",
    name: "지도학습 (교사학습)",
    en: "supervised learning",
    signal: "학습할 때 시스템에 출력해야 할 목표 출력값(‘교사 supervisor’)을 함께 제공",
    task: "분류, 회귀",
    note: "목표 출력값을 학습 데이터에 함께 넣어야 하므로 그 비용과 수고가 많이 들거나, 이 자체가 불가능할 정도로 어려울 수도 있다.",
  },
  {
    id: "unsupervised",
    name: "비지도학습 (비교사학습)",
    en: "unsupervised learning",
    signal: "목표 출력값에 대한 아무런 정보 없이 학습을 진행",
    task: "군집화",
    note: "출력에 대한 신호가 전혀 없다는 점에서, 신호가 ‘보상’ 형태로라도 주어지는 강화학습과 다르다.",
  },
  {
    id: "rl",
    name: "강화학습",
    en: "reinforcement learning",
    signal: "원하는 출력값을 모르거나 알 수 없는 경우 → 출력값에 대한 교사 신호가 ‘보상 reward’ 형태",
    task: "제어 문제 (게임, 로봇 제어, 시스템 제어 등)",
    note: "교사 신호는 정확한 값이 아니고, 출력값 각각에 대해서 즉시 주어지지 않을 수 있다.",
  },
];

const CASES: {
  id: string;
  when: string;
  name: string;
  area: "게임" | "제어";
  detail: string;
  src: "both" | "textbook" | "slides";
}[] = [
  {
    id: "alphago",
    when: "2016.3",
    name: "AlphaGo (Google DeepMind)",
    area: "게임",
    detail:
      "프로기사를 맞바둑으로 이긴 최초의 바둑 프로그램. 몬테카를로 트리 탐색, 딥러닝, 프로기사들의 기보를 활용한 강화학습 기술의 결합으로 개발되었다.",
    src: "both",
  },
  {
    id: "master",
    when: "2016~2017",
    name: "AlphaGo Master",
    area: "게임",
    detail:
      "인간의 기보 지식에 의존한다. 교재는 2017년 1월 등장해 한·중·일 프로기사를 상대로 30승, 온라인 대국 30승을 합쳐 60승 전승을 거두었다고 적는다.",
    src: "both",
  },
  {
    id: "zero",
    when: "2017.10",
    name: "AlphaGo Zero",
    area: "게임",
    detail:
      "단순한 규칙만 입력 → 자기 대국을 거쳐 스스로 전략을 창출(완전 자기 학습). 교재는 40일 동안 2,900만 번의 스스로 대국을 거친 뒤 Master와의 대결에서 100전 89승을 거두었다고 적는다.",
    src: "both",
  },
  {
    id: "alphazero",
    when: "2017.12",
    name: "AlphaZero",
    area: "게임",
    detail:
      "AlphaGo Zero를 일반화한 버전. 게임 규칙만 알면 바둑, 체스, 일본 장기 등 모든 보드 게임에 적용 가능하다.",
    src: "both",
  },
  {
    id: "muzero",
    when: "2019",
    name: "MuZero",
    area: "게임",
    detail: "게임 규칙조차 모르는 상태에서, 관찰 데이터로부터 환경 모델을 추론하며 학습한다.",
    src: "slides",
  },
  {
    id: "atari",
    when: "2013",
    name: "아타리(Atari) 비디오 게임",
    area: "게임",
    detail:
      "49종의 게임을 강화학습으로 자동 플레이하는 프로그램이 개발되었고, 그중 29종은 전문 게임 플레이어보다 훨씬 뛰어났다. 게임마다 규칙을 사람이 조율하지 않고 동일한 구조와 파라미터를 쓰는 하나의 신경망 — CNN과 Q-학습을 결합한 DQN 모델 — 을 사용했다.",
    src: "both",
  },
  {
    id: "robot",
    when: "",
    name: "로봇 제어",
    area: "제어",
    detail:
      "모방학습(imitation learning) — 로봇이 수행할 동작을 먼저 보여 주면 그것을 그대로 흉내 내어 같은 동작을 하도록 학습한다. 제어 대상의 원하는 동작을 정확한 수치로 지정하는 것은 매우 어렵거나 불가능하기 때문이다.",
    src: "both",
  },
  {
    id: "cooling",
    when: "",
    name: "시스템 설정/제어 — 데이터 센터 냉방",
    area: "제어",
    detail:
      "어떤 서버도 특정 온도 이상 올라가지 않으면서 비용을 최소화하도록 냉방 시스템을 최적화한다. 구글 딥마인드의 데이터 센터에서 냉방 비용을 40% 정도 줄였다.",
    src: "both",
  },
  {
    id: "commerce",
    when: "",
    name: "전자상거래",
    area: "제어",
    detail: "실시간 입찰, 광고 및 상품 추천 같은 시스템에서도 강화학습이 사용된다.",
    src: "textbook",
  },
];

export default function RlOverview() {
  const [kind, setKind] = useState<Kind>("rl");
  const [caseId, setCaseId] = useState("alphago");
  const [view, setView] = useState<"target" | "reward">("target");
  const k = KINDS.find((x) => x.id === kind)!;
  const c = CASES.find((x) => x.id === caseId)!;

  return (
    <section id="overview" className="scroll-mt-32">
      <SectionTitle
        title="강화학습의 개요 — 정답 대신 보상으로 배운다"
        subtitle="목표 출력값을 줄 수 없는 문제를 어떻게 학습시키는가에서 출발합니다"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "14장 도입 · 14.1.1 강화학습의 계산 모델", slides: "머신러닝의 유형" }}>
          <Card>
            <CardTitle>머신러닝의 유형 — 무엇이 교사 신호인가</CardTitle>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {KINDS.map((x) => (
                <Chip key={x.id} active={kind === x.id} onClick={() => setKind(x.id)}>
                  {x.name}
                </Chip>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={k.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
              >
                <p className="text-[11px] text-gray-400">{k.en}</p>
                <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                  <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-100">
                    {k.signal}
                  </p>
                  <span className="h-fit rounded-md bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    → {k.task}
                  </span>
                </div>
                <p className="mt-2 text-[12px] leading-6 text-gray-600 dark:text-gray-300">{k.note}</p>
              </motion.div>
            </AnimatePresence>
            <Hint>
              교재는 머신러닝의 유형이 전통적으로 목표 출력값의 존재 여부에 따라 지도학습과
              비지도학습으로 구분되었지만, 최근에는 딥러닝 덕분에 인기를 끄는 강화학습도 하나의 학습
              유형으로 주목받고 있다고 적는다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{ textbook: "14장 도입 — 강화학습의 응용 사례", slides: "강화학습의 적용 사례" }}
        >
          <Card>
            <CardTitle>강화학습의 적용 사례</CardTitle>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              <ol className="space-y-1">
                {CASES.map((x) => (
                  <li key={x.id}>
                    <button
                      type="button"
                      onClick={() => setCaseId(x.id)}
                      aria-pressed={caseId === x.id}
                      className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[12px] transition-colors ${
                        caseId === x.id
                          ? "border-cyan-500 bg-cyan-50 text-cyan-800 dark:border-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-200"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span className="w-16 shrink-0 font-mono text-[10.5px] text-gray-400">
                        {x.when || "—"}
                      </span>
                      <span className="flex-1 font-semibold">{x.name}</span>
                      <span
                        className={`shrink-0 rounded px-1.5 text-[10px] font-bold ${
                          x.area === "게임"
                            ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {x.area}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
              <AnimatePresence mode="wait">
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60"
                >
                  <p className="text-[13px] font-bold text-gray-800 dark:text-gray-100">{c.name}</p>
                  <p className="mt-2 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                    {c.detail}
                  </p>
                  {c.src !== "both" && (
                    <p className="mt-2 text-[10.5px] text-gray-400">
                      {c.src === "slides" ? "강의록에만 나오는 사례" : "교재에만 나오는 사례"}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <Hint>
              강의록의 성능 비교 그림이 말하는 핵심은 하나다 — 모든 게임에 대해 하나의 신경망을
              사용했고, 그것이 DQN 모델(CNN과 Q-학습의 결합)이다. DQN은 뒤의 ‘심층 Q-신경망’에서 다시
              다룬다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{ textbook: "14장 도입 — 응용 분야의 공통점과 제어 문제", slides: "강화학습의 응용 분야" }}
        >
          <Card>
            <CardTitle>왜 이 분야들인가 — 목표값은 못 줘도 성공 여부는 평가할 수 있다</CardTitle>
            <P>
              같은 로봇 걸음마 문제를 두 가지 신호로 학습시킨다고 생각해 보자. 어느 쪽 신호를 실제로
              만들 수 있는지 눌러서 비교한다.
            </P>
            <div className="my-3 flex flex-wrap gap-1.5">
              <Chip active={view === "target"} onClick={() => setView("target")}>
                정확한 목표값을 주려면
              </Chip>
              <Chip active={view === "reward"} onClick={() => setView("reward")}>
                수행 결과만 평가하려면
              </Chip>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div
                className={`rounded-lg border p-3 transition-opacity ${
                  view === "target"
                    ? "border-rose-300 bg-rose-50/60 dark:border-rose-800 dark:bg-rose-950/30"
                    : "border-gray-200 opacity-50 dark:border-gray-700"
                }`}
              >
                <p className="text-[11px] font-bold text-rose-600 dark:text-rose-300">
                  주어진 상황에서 최적의 제어 신호에 대한 정확한 목표값
                </p>
                <p className="mt-1 text-[12px] leading-6 text-gray-700 dark:text-gray-200">
                  매 순간 각 동작을 정확한 수치로 지정해야 한다. 교재는 이것이 “매우 어렵거나
                  불가능한 작업”이라고 적는다.
                </p>
              </div>
              <div
                className={`rounded-lg border p-3 transition-opacity ${
                  view === "reward"
                    ? "border-cyan-300 bg-cyan-50/60 dark:border-cyan-800 dark:bg-cyan-950/30"
                    : "border-gray-200 opacity-50 dark:border-gray-700"
                }`}
              >
                <p className="text-[11px] font-bold text-cyan-600 dark:text-cyan-300">
                  제어 동작의 수행 결과에 대한 성공 여부의 평가
                </p>
                <p className="mt-1 text-[12px] leading-6 text-gray-700 dark:text-gray-200">
                  동작을 해 본 결과가 성공인지 실패인지는 판단할 수 있다. 이 평가가 곧 보상이 된다.
                </p>
              </div>
            </div>
            <div className="mt-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <p className="text-[11px] font-bold text-gray-500">
                그래서 강화학습은 주로 제어 문제를 표현하고 해결하는 방법으로 사용된다
              </p>
              <ul className="mt-1 space-y-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                <li>
                  • <strong>제어 문제</strong> — 주어진 조건이나 상황에서 어떤 동작을 취해야 할지를
                  결정하는 문제. 게임도 일련의 취할 동작을 선택하는 제어 문제이고, 보행 로봇의 걸음마,
                  자동차 자율주행도 제어 문제다.
                </li>
                <li>
                  • 특징 → <strong>시간에 따른 순차적인 개념</strong>이 존재해서, 이전 상황이 현재
                  시점에서의 결정에 영향을 미친다.
                </li>
              </ul>
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "14.1.1 강화학습의 계산 모델", slides: "강화학습" }}>
          <Card>
            <CardTitle>강화학습</CardTitle>
            <ConceptRows
              rows={[
                {
                  k: "정의",
                  v: (
                    <>
                      목표 출력값을 제공하지 않는다. 최종 목표를 지정하고, 매 순간 학습 시스템이 취하는{" "}
                      <strong>행동(action)</strong>의 결과에 따라 <strong>보상(reward)</strong>을
                      제공한다. 학습의 목적은 최종적으로 얻게 되는 <strong>누적 보상의 최대화</strong>다.
                    </>
                  ),
                },
                {
                  k: "직관",
                  v: "목표 달성에 적절한(좋은) 행동에는 양의 보상, 부적절한(나쁜) 행동에는 음의 보상(벌점)을 준다. 각 순간의 보상과 벌점으로 좋은 행동과 나쁜 행동을 배워 행동 방식을 긍정적 방향으로 ‘강화’한다 — 그래서 강화학습이다.",
                },
                {
                  k: "예시",
                  v: "바둑에서 이기면 1, 지면 −1, 나머지 중간 과정에서는 0. 수 하나하나에 정답을 주지 않고 판이 끝난 결과로만 평가한다.",
                },
                {
                  k: "오답 기준",
                  v: "‘매 순간 보상이 가장 큰 행동을 고른다’는 틀린 이해다. 순간의 이익보다 누적 보상이 최대가 되도록 매 순간 최적의 행동을 결정해야 한다. 또 강화학습이 최적화하는 것은 행동(정책)이지 환경의 상태 전이확률이 아니다.",
                },
              ]}
            />
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
