"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, Hint } from "./ui";

/** 순차 데이터의 세 가지 특징을 직접 확인해 보는 예 */
const SENTENCES = [
  {
    key: "order",
    label: "출현 순서가 중요",
    base: ["나는", "너를", "좋아한다"],
    swapped: ["너를", "나는", "좋아한다"],
    note: "같은 단어 묶음이라도 늘어선 순서가 달라지면 뜻이 달라집니다. 단어를 하나의 집합으로만 보는 모델은 두 문장을 구별하지 못합니다.",
  },
  {
    key: "length",
    label: "길이가 가변적",
    base: ["오늘", "날씨가", "좋다"],
    swapped: ["오늘", "오후", "부터", "날씨가", "아주", "좋다"],
    note: "두 문장은 길이가 다릅니다. 입력의 차원이 고정된 다층 퍼셉트론에는 길이가 매 순간 달라지는 데이터를 그대로 넣을 수 없습니다.",
  },
  {
    key: "context",
    label: "요소 사이에 문맥적인 의존성",
    base: ["어제", "산", "배가", "달다"],
    swapped: ["바다에서", "탄", "배가", "크다"],
    note: "같은 ‘배가’라도 앞에 무엇이 왔는지에 따라 과일이 되기도 하고 탈것이 되기도 합니다. 이전의 내용을 기억하고 적절한 순간에 활용해야 합니다.",
  },
] as const;

const KINDS = [
  { name: "음성", detail: "시간에 따라 이어지는 소리의 흐름" },
  { name: "문장", detail: "단어의 나열" },
  { name: "동영상", detail: "프레임의 나열" },
  { name: "주식 시세", detail: "시간 순서대로 기록되는 값" },
];

function Tokens({ items, tone }: { items: readonly string[]; tone: "base" | "alt" }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {items.map((w, i) => (
        <span key={`${w}-${i}`} className="flex items-center gap-1.5">
          <span
            className={`rounded-md px-2 py-1 text-[12px] font-semibold ${
              tone === "base"
                ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-200"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {w}
          </span>
          {i < items.length - 1 && <ArrowRight size={11} className="text-gray-300" />}
        </span>
      ))}
    </div>
  );
}

export default function SequentialData() {
  const [sel, setSel] = useState(0);
  const cur = SENTENCES[sel];

  return (
    <section id="sequential-data" className="scroll-mt-32">
      <SectionTitle
        title="순환 신경망의 필요성"
        subtitle="순서 정보를 가진 데이터는 지금까지의 신경망으로 다루기 어렵습니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.4.1 기본 RNN — 순차 데이터",
            slides: "순환 신경망의 필요성 — 순차 데이터",
          }}
        >
          <Card>
            <CardTitle>순차 데이터</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              음성, 문장(단어의 나열), 동영상, 주식 시세와 같이{" "}
              <strong>순서 정보를 가진 데이터</strong>를 순차 데이터(sequential data)라고 합니다.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {KINDS.map((k) => (
                <div
                  key={k.name}
                  className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800/50"
                >
                  <p className="text-[12px] font-bold text-red-500">{k.name}</p>
                  <p className="mt-0.5 text-[11px] leading-4 text-gray-500 dark:text-gray-400">
                    {k.detail}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.4.1 — 순차 데이터의 특징",
            slides: "순환 신경망의 필요성 — 순차 데이터의 특징",
          }}
        >
          <Card>
            <CardTitle>세 가지 특징 — 하나씩 눌러 확인</CardTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              {SENTENCES.map((s, i) => (
                <Chip key={s.key} active={sel === i} onClick={() => setSel(i)}>
                  {s.label}
                </Chip>
              ))}
            </div>
            <div className="space-y-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
              <Tokens items={cur.base} tone="base" />
              <Tokens items={cur.swapped} tone="alt" />
            </div>
            <p className="mt-2 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              {cur.note}
            </p>
            <div className="mt-3">
              <ComputedNote>
                위 예문은 세 가지 특징을 눈으로 확인하려고 이 페이지에서 만든 것입니다. 교재와
                강의록에는 특징의 이름만 제시되어 있습니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.4.1 — 순환 신경망(RNN)의 등장, CNN과 RNN의 응용 분야",
            slides: "순환 신경망의 필요성 — 순환 신경망 RNN",
          }}
        >
          <Card>
            <CardTitle>그래서 순환 신경망</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              한 시점의 이미지나 정보를 다루는 통상적인 MLP나 CNN과 같은 신경망 모델로는 순차
              데이터를 다루는 것이 적절하지 못하고,{" "}
              <strong>시간에 따라 순차적으로 제공되는 정보를 다룰 수 있는 신경망</strong>이
              필요합니다. 이런 모델이 바로 순환 신경망(Recurrent Neural Network, RNN)입니다.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50">
                <p className="text-[12px] font-bold text-gray-700 dark:text-gray-200">CNN</p>
                <p className="mt-1 text-[11.5px] leading-5 text-gray-500 dark:text-gray-400">
                  주로 컴퓨터비전 분야에서 많이 사용
                </p>
              </div>
              <div className="rounded-lg border border-red-100 bg-red-50/60 p-3 dark:border-red-900/50 dark:bg-red-950/30">
                <p className="text-[12px] font-bold text-red-600 dark:text-red-300">RNN</p>
                <p className="mt-1 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  텍스트 처리와 음성 처리처럼 시퀀스 형태를 다루는 데 주로 사용 — 기계번역이
                  대표적인 응용 사례
                </p>
              </div>
            </div>
            <div className="mt-3">
              <Hint>
                기계번역이 대표적인 이유는 번역하려는 입력 문장과 출력 문장이 모두 글자나 단어들이
                순서를 가지고 연속적으로 나타나는 시퀀스 형태로 구성되기 때문입니다.
              </Hint>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
