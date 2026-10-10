"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, Hint, Scroller } from "./ui";

/**
 * 13.1 컴퓨터비전 · 13.1.1 컴퓨터비전 응용
 * 딥러닝 모델의 입력·출력을 기준으로 네 가지로 나눈 응용 구분.
 */

type GroupKey = "understanding" | "transformation" | "generation" | "extended";

interface Task {
  name: string;
  en?: string;
  input: string;
  output: string;
  detail: string;
}

interface Group {
  key: GroupKey;
  label: string;
  en: string;
  inputKind: string;
  outputKind: string;
  summary: string;
  tasks: Task[];
}

const GROUPS: Group[] = [
  {
    key: "understanding",
    label: "영상이해",
    en: "image understanding",
    inputKind: "영상",
    outputKind: "추상적 개념 · 정량적 정보량",
    summary:
      "하나의 영상을 입력받아 그 안에 포함된 의미적 정보를 분석하여 추상적인 개념이나 정량적인 정보량을 출력하는 문제. 정량적인 정보량이란 객체 정보, 패턴 클래스, 두 영상 간의 의미적 유사도 등을 말한다.",
    tasks: [
      {
        name: "객체인식",
        en: "object recognition",
        input: "영상 한 장",
        output: "클래스 레이블 하나",
        detail:
          "영상에 포함된 하나의 객체를 인식한다. 학습 데이터에 포함된 객체의 종류가 M개이면 M개 클래스로 인식하는 분류 문제가 된다. 앞 장들에서 다룬 숫자인식·얼굴인식도 객체인식의 특별한 경우다.",
      },
      {
        name: "객체의 위치 탐지",
        en: "object detection & localization",
        input: "영상 한 장",
        output: "객체 종류 + 직사각형 박스 위치",
        detail:
          "M개 패턴 중 하나로 인식하는 것을 넘어, 영상에 포함된 복수 개의 객체를 찾고(object detection) 그 객체들이 영상 내 어디에 있는지도 함께 찾아(object localization) 직사각형 박스로 표시한다. 방범용 CCTV, 자율주행 자동차 등에서 활용된다.",
      },
      {
        name: "영상설명",
        en: "image description · image captioning",
        input: "영상 한 장",
        output: "자연어 문장",
        detail:
          "영상에 포함된 의미적 정보를 종합적으로 파악하여 하나의 자연어 문장으로 설명한다. 강의록의 예에서는 비행기 3개를 인식하고 그 위치 관계까지 파악해 “Three planes are lining”이라는 설명을 낸다.",
      },
    ],
  },
  {
    key: "transformation",
    label: "영상변환",
    en: "image transformation",
    inputKind: "영상",
    outputKind: "영상",
    summary:
      "영상이해와 달리 입력과 출력이 모두 영상이다. 하나의 영상에 포함된 정보를 분석하여 원하는 형태로 변환된 새로운 영상을 출력한다.",
    tasks: [
      {
        name: "의미적 영상분할",
        en: "semantic image segmentation",
        input: "원래 영상",
        output: "화소마다 범주가 매겨진 영상",
        detail:
          "각 화소가 여러 범주 중에서 하나에 속하도록 분류한다. 영상 영역들을 의미적 유사성에 따라 몇 개의 그룹으로 묶어서 분할하며, 이는 군집화 문제에 해당한다고 볼 수 있다. 색상에만 의존한 간단한 군집화로는 좋은 성능을 얻을 수 없다.",
      },
      {
        name: "영상개선",
        en: "image enhancement",
        input: "손상되거나 왜곡된 영상",
        output: "개선된 영상",
        detail:
          "입력에 존재하는 왜곡·손상의 종류에 따라 다시 세분된다. 어두운 영상, 잡음이 포함된 영상, 초점이 흐려진 영상 등 왜곡마다 그에 적합한 방법이 개발되고 있다.",
      },
      {
        name: "초고해상도",
        en: "super resolution",
        input: "저해상도 영상",
        output: "고해상도 영상",
        detail:
          "저해상도 영상을 고해상도 영상으로 복원하는 문제. 강의록은 SRCNN(2014), VDSR(2016), SRGAN(2017), EDSR(2017), DBPN(2018)을 들고, DBPN은 초고해상도 경진대회(NTIRE2018)의 우승 모델이라고 소개한다. 교재는 VDSR, EDSR, DBPN, SRGAN을 든다.",
      },
      {
        name: "기타 변환",
        input: "사진 영상",
        output: "풍경화 · 컬러 영상 등",
        detail:
          "카메라로 촬영된 영상을 풍경화로 바꾸거나, 흑백 영상을 컬러로 바꾸거나, 스케치에 색을 채우거나, 특정 화가(모네·고흐 등)의 화풍에 맞게 바꾸는 변환. 이런 변환들은 단순 분석을 넘어 새로운 정보를 생성해 내는 영상생성 작업에 가깝다.",
      },
    ],
  },
  {
    key: "generation",
    label: "영상생성",
    en: "image generation",
    inputKind: "랜덤 노이즈 · 자연어 문장",
    outputKind: "새로운 영상",
    summary:
      "출력으로 새로운 영상을 생성하는 것이므로 일종의 창작 과정이라고 볼 수 있다. 이를 위해 개발된 모델이 GAN이다.",
    tasks: [
      {
        name: "랜덤 노이즈에서 영상생성",
        input: "랜덤 노이즈 ~ N(0, 1)",
        output: "얼굴 영상 등 새로운 영상",
        detail:
          "임의의 값을 입력으로 받아 영상을 생성한다. 목표 출력값이 따로 주어지지 않으므로 보통의 딥러닝 모델과는 다른 특별한 학습 구조가 필요하다.",
      },
      {
        name: "텍스트-이미지 생성",
        input:
          "자연어 문장 — “This bird is white with some black on its head and wings, and has a long orange beak”",
        output: "문장의 의미를 표현하는 영상",
        detail: "자연어 문장을 입력으로 받아 그에 포함된 의미를 표현하는 영상을 생성한다.",
      },
    ],
  },
  {
    key: "extended",
    label: "다양한 입력 형태로의 확장",
    en: "extension",
    inputKind: "동영상 · 3D 입체영상 · 영상 + 자연어",
    outputKind: "문제에 따라 다름",
    summary:
      "앞의 세 가지가 딥러닝으로 영상을 처리하는 대표적인 응용이지만, 최근에는 더 다양한 형태의 입력을 다루는 모델들이 개발되고 있다.",
    tasks: [
      {
        name: "동영상",
        input: "시간 순서를 가진 영상열",
        output: "문제에 따라 다름",
        detail:
          "영상이 가지는 2D 정보 외에 시간에 따른 순서 정보도 함께 다루어야 하므로, CNN이 RNN과 같은 순환적 연결을 가지거나 시간 순서를 또 다른 축으로 보고 3D CNN으로 확장한다.",
      },
      {
        name: "3D 입체영상",
        input: "깊이 축이 추가된 영상",
        output: "문제에 따라 다름",
        detail: "깊이라는 하나의 축이 추가되므로 마찬가지로 3D CNN 구조가 사용된다.",
      },
      {
        name: "시각적 문답(VQA)",
        en: "Visual Question and Answering",
        input: "영상 + 자연어 질문 — “What is the mustache made of?”",
        output: "자연어 대답 — “Bananas”",
        detail:
          "영상 신호와 자연어가 결합된 멀티모달 문제. 영상을 처리하는 CNN 기반 모델과 자연어를 처리하는 RNN 기반 모델이 결합된 형태의 구성이 활용될 수 있다.",
      },
    ],
  },
];

const DEVICES = ["카메라", "적외선 카메라", "레이더", "X-ray", "초음파", "CCTV", "블랙박스"];

export default function CvApplicationMap() {
  const [key, setKey] = useState<GroupKey>("understanding");
  const [taskIdx, setTaskIdx] = useState(0);
  const group = GROUPS.find((g) => g.key === key)!;
  const task = group.tasks[Math.min(taskIdx, group.tasks.length - 1)];

  const pick = (k: GroupKey) => {
    setKey(k);
    setTaskIdx(0);
  };

  return (
    <section id="cv-applications" className="scroll-mt-32">
      <SectionTitle
        title="컴퓨터비전의 응용 — 입력과 출력으로 나눈 네 갈래"
        subtitle="무엇을 넣어 무엇을 받느냐가 문제의 종류를 가릅니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "13.1 컴퓨터비전",
            slides: "컴퓨터비전?",
          }}
        >
          <Card>
            <CardTitle>컴퓨터비전이란</CardTitle>
            <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              영상 데이터를 주요 처리 대상으로 하여 사람이 수행하는 다양한{" "}
              <strong>시각적인 정보처리</strong>를 기계에 구현하는 방법을 연구하는 컴퓨터과학의 한
              분야. 고전적인 방법은 영상 데이터의 특성에 맞게 잘 설계된 특징을 추출해 사용했으나,
              최근에는 딥러닝 특히 <strong>CNN 모델</strong>을 활용하는 방법이 월등하게 우수한 성능을
              보이면서 컴퓨터비전은 딥러닝의 주요 응용 분야로 자리 잡았다.
            </p>
            <div className="mt-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <p className="mb-2 text-[11px] font-semibold text-gray-500">
                입력이 될 수 있는 것 — 여러 입력기기에서 얻어지는 영상·동영상 전부
              </p>
              <div className="flex flex-wrap gap-1.5">
                {DEVICES.map((d) => (
                  <span
                    key={d}
                    className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-200"
                  >
                    {d}
                  </span>
                ))}
              </div>
              <Hint>
                문제 및 주제의 종류가 매우 다양한 이유가 여기에 있다. 그래서 응용을 나눌 때도 대상이
                아니라 딥러닝 모델의 입력·출력을 기준으로 삼는다.
              </Hint>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "13.1.1 컴퓨터비전 응용",
            slides:
              "(1) 영상이해 · (2) 영상변환 · 영상변환: 영상분할 · 영상변환: Super Resolution · (3) 영상생성 · (4) 다양한 입력형태로의 확장",
          }}
        >
          <Card>
            <CardTitle>네 갈래를 눌러 입력과 출력을 비교해 보세요</CardTitle>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {GROUPS.map((g) => (
                <Chip key={g.key} active={g.key === key} onClick={() => pick(g.key)}>
                  {g.label}
                </Chip>
              ))}
            </div>

            <Scroller>
              <div className="flex min-w-[360px] items-stretch gap-2">
                <div className="flex-1 rounded-lg border-2 border-dashed border-gray-300 p-3 text-center dark:border-gray-600">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    입력
                  </p>
                  <p className="mt-1 text-[12px] font-bold text-gray-700 dark:text-gray-200">
                    {group.inputKind}
                  </p>
                </div>
                <div className="flex w-16 shrink-0 items-center justify-center">
                  <div className="text-center">
                    <div className="rounded-md bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">
                      딥러닝
                    </div>
                    <div className="mt-1 text-lg leading-none text-blue-600 dark:text-blue-400">
                      →
                    </div>
                  </div>
                </div>
                <div className="flex-1 rounded-lg border-2 border-blue-400 bg-blue-50/60 p-3 text-center dark:border-blue-600 dark:bg-blue-950/30">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-500">
                    출력
                  </p>
                  <p className="mt-1 text-[12px] font-bold text-blue-800 dark:text-blue-200">
                    {group.outputKind}
                  </p>
                </div>
              </div>
            </Scroller>

            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              {group.summary}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {group.tasks.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setTaskIdx(i)}
                  aria-pressed={i === taskIdx}
                  className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    i === taskIdx
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-200"
                      : "border-gray-200 bg-white text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <div className="mt-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
              <p className="text-[12px] font-bold text-gray-800 dark:text-gray-100">
                {task.name}
                {task.en && (
                  <span className="ml-1.5 font-normal text-gray-400">{task.en}</span>
                )}
              </p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded-md bg-white p-2 dark:bg-gray-900">
                  <p className="text-[10px] font-semibold text-gray-400">입력</p>
                  <p className="text-[11.5px] leading-5 text-gray-700 dark:text-gray-200">
                    {task.input}
                  </p>
                </div>
                <div className="rounded-md bg-white p-2 dark:bg-gray-900">
                  <p className="text-[10px] font-semibold text-blue-500">출력</p>
                  <p className="text-[11.5px] leading-5 text-gray-700 dark:text-gray-200">
                    {task.output}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-[12px] leading-6 text-gray-600 dark:text-gray-300">
                {task.detail}
              </p>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
