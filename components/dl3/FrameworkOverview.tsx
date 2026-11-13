"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Hammer, Calendar } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint } from "@/components/dlShared/ui";
import { Chip3, Pill } from "@/components/dl3/ui3";

/** 강의록 "딥러닝 프레임워크가 제공하는 주요 기능" 다섯 항목 */
const FEATURES = [
  {
    k: "자동 미분",
    byHand: "손실함수를 가중치마다 직접 편미분한 수식을 세우고, 층이 늘 때마다 다시 세움",
    byFramework: "정방향 계산을 기록해 두었다가 되감으며 기울기를 만들어 줌 (이 강의 3절)",
  },
  {
    k: "기본적인 신경망 구성 요소",
    byHand: "완전연결층·활성함수·소프트맥스를 배열 계산으로 하나하나 구현",
    byFramework: "층 클래스를 골라 쌓기만 하면 됨 (이 강의 4절 Keras)",
  },
  {
    k: "손실함수 및 최적화 도구",
    byHand: "오차 제곱·교차 엔트로피와 갱신식을 직접 코딩",
    byFramework: "손실함수 클래스와 최적화기 클래스를 이름으로 지정",
  },
  {
    k: "계산 자원 활용",
    byHand: "GPU를 쓰려면 별도의 계산 코드가 필요",
    byFramework: "가장 빠르게 처리할 수 있는 장치에 연산을 배치",
  },
  {
    k: "모델의 저장 및 로드",
    byHand: "가중치 배열을 직접 파일로 쓰고 읽음",
    byFramework: "모델 단위로 저장·복원",
  },
];

const TIMELINE = [
  {
    year: "2015",
    title: "구글 브레인 팀이 오픈소스로 공개",
    body: "구글 내부의 연구 및 제품 개발을 위해 만든 딥러닝 프레임워크를 공개한 것. 라이선스는 아파치 라이선스 2.0.",
  },
  {
    year: "2019. 9",
    title: "텐서플로 2.0 발표",
    body: "기본 실행 방식이 지연 실행 모드에서 즉시 실행 모드로 바뀌었다. 이 강의의 예제는 모두 2.0 이후 버전 기준.",
  },
  {
    year: "2.0 이후",
    title: "tf.keras를 기본 제공",
    body: "Keras 기반의 고수준 API인 tf.keras를 기본적으로 제공한다. 파이썬용 API가 중심이지만 C++, Java 등을 위한 API도 제공한다.",
  },
];

export default function FrameworkOverview() {
  const [open, setOpen] = useState(0);
  const [era, setEra] = useState(0);

  return (
    <section id="framework-overview" className="scroll-mt-32">
      <SectionTitle
        title="딥러닝 프레임워크는 무엇을 대신해 주는가"
        subtitle="2강까지는 역전파를 손으로 따라갔습니다. 이번 강의부터는 그 일을 도구에 맡깁니다"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "1. 딥러닝 프레임워크 — 딥러닝 프레임워크란? / 제공하는 주요 기능",
            lecture: "밑바닥부터 코딩으로 해결하기에는 너무 복잡해서 도구를 쓰게 된다고 설명",
          }}
        >
          <Card>
            <CardTitle>딥러닝 프레임워크란?</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              <strong>딥러닝을 위해 설계된 라이브러리, 미리 구성된 네트워크 및 기타 유용한 도구를
              제공하는 소프트웨어</strong>. 텐서플로(TensorFlow), 파이토치(PyTorch), MXNet, JAX,
              카페(Caffe) 등이 있다.
            </p>

            <p className="mt-4 mb-2 text-[11px] font-semibold text-gray-500">
              아래 다섯 기능을 눌러, 직접 만들 때와 프레임워크가 해 줄 때를 비교해 보세요.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {FEATURES.map((f, i) => (
                <Chip3 key={f.k} active={open === i} onClick={() => setOpen(i)}>
                  {f.k}
                </Chip3>
              ))}
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="min-w-0 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/60">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Hammer size={13} className="text-gray-400" />
                  <span className="text-[11px] font-bold text-gray-500">직접 만든다면</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`h-${open}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-[12px] leading-5 text-gray-600 dark:text-gray-300"
                  >
                    {FEATURES[open].byHand}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="min-w-0 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Wrench size={13} className="text-amber-500" />
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
                    프레임워크가 해 준다면
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`f-${open}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-[12px] leading-5 text-amber-900 dark:text-amber-100"
                  >
                    {FEATURES[open].byFramework}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
            <Hint>
              왼쪽 칸은 강의록에 적힌 기능 이름을 바탕으로 이 페이지에서 붙인 설명이고, 다섯 기능의
              이름 자체는 강의록 목록 그대로입니다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "2. 텐서플로 — 텐서플로(TensorFlow)란?",
            lecture: "2.0 버전부터 Keras를 통합해 tf.keras로 제공하게 되었다고 짚음",
          }}
        >
          <Card>
            <CardTitle>텐서플로 — 이 과목이 쓰는 프레임워크</CardTitle>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {TIMELINE.map((t, i) => (
                <Chip3 key={t.year} active={era === i} onClick={() => setEra(i)}>
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={10} />
                    {t.year}
                  </span>
                </Chip3>
              ))}
            </div>

            <div className="relative mb-3 h-8">
              <div className="absolute left-0 right-0 top-3.5 h-0.5 bg-gray-200 dark:bg-gray-700" />
              {TIMELINE.map((t, i) => {
                const x = (i / (TIMELINE.length - 1)) * 100;
                const on = era === i;
                return (
                  <button
                    key={t.year}
                    type="button"
                    onClick={() => setEra(i)}
                    aria-label={t.year}
                    className="absolute top-1.5 -translate-x-1/2"
                    style={{ left: `${x === 0 ? 2 : x === 100 ? 98 : x}%` }}
                  >
                    <motion.span
                      animate={{ scale: on ? 1.25 : 1 }}
                      className={`block h-4 w-4 rounded-full border-2 ${
                        on
                          ? "border-amber-500 bg-amber-500"
                          : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={era}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60"
              >
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Pill tone="amber">{TIMELINE[era].year}</Pill>
                  <span className="text-[12.5px] font-bold text-gray-800 dark:text-gray-100">
                    {TIMELINE[era].title}
                  </span>
                </div>
                <p className="text-[12px] leading-5 text-gray-600 dark:text-gray-300">
                  {TIMELINE[era].body}
                </p>
              </motion.div>
            </AnimatePresence>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
