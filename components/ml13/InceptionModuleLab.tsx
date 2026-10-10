"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Formula, Hint, Scroller, num } from "./ui";

/**
 * 13.1.2 객체인식을 위한 CNN 모델 — GoogLeNet의 인셉션 모듈.
 * 강의록 그림의 입출력 크기(28 × 28 × 192 → 28 × 28 × 256)와
 * 네 갈래의 채널 수는 모두 원문 값이고, 곱셈 횟수만 이 화면에서 계산한다.
 */

const MAP = 28; // 특징맵 한 변 — 강의록 그림 값
const IN_C = 192; // 이전 결과의 채널 수 — 강의록 그림 값

interface Branch {
  key: string;
  label: string;
  /** 1 × 1 병목의 출력 채널 수. 없으면 null */
  bottleneck: number | null;
  /** 본 콘볼루션 필터 크기 */
  k: number;
  /** 최종 출력 채널 수 */
  out: number;
  /** 풀링이 앞에 붙는 갈래인가 */
  pool: boolean;
}

const BRANCHES: Branch[] = [
  { key: "a", label: "1 × 1 CONV", bottleneck: null, k: 1, out: 64, pool: false },
  { key: "b", label: "1 × 1 CONV → 3 × 3 CONV", bottleneck: 96, k: 3, out: 128, pool: false },
  { key: "c", label: "1 × 1 CONV → 5 × 5 CONV", bottleneck: 16, k: 5, out: 32, pool: false },
  { key: "d", label: "MaxPool 3 × 3 s=1 → 1 × 1 CONV", bottleneck: null, k: 1, out: 32, pool: true },
];

/** 한 갈래의 곱셈 횟수 — 특징맵 위치마다 (입력채널 × 필터크기²)번 곱한다 */
function branchMults(b: Branch, useBottleneck: boolean): number {
  const area = MAP * MAP;
  if (b.bottleneck === null || !useBottleneck) {
    // 병목 없이 입력 채널에서 바로 본 콘볼루션
    return area * b.out * IN_C * b.k * b.k;
  }
  const reduce = area * b.bottleneck * IN_C * 1 * 1;
  const main = area * b.out * b.bottleneck * b.k * b.k;
  return reduce + main;
}

export default function InceptionModuleLab() {
  const [useBottleneck, setUseBottleneck] = useState(true);

  const depth = BRANCHES.reduce((s, b) => s + b.out, 0);
  const costs = BRANCHES.map((b) => ({ b, m: branchMults(b, useBottleneck) }));
  const total = costs.reduce((s, c) => s + c.m, 0);
  const withAll = BRANCHES.reduce((s, b) => s + branchMults(b, true), 0);
  const withoutAll = BRANCHES.reduce((s, b) => s + branchMults(b, false), 0);
  const maxM = Math.max(...costs.map((c) => c.m));

  return (
    <section id="inception" className="scroll-mt-32">
      <SectionTitle
        title="GoogLeNet의 인셉션 모듈 — 한 층에서 여러 크기의 필터를"
        subtitle="네 갈래의 출력을 실제로 더해 보고, 1 × 1 콘볼루션이 줄이는 계산량을 세어 봅니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "13.1.2 객체인식을 위한 CNN 모델 — GoogLeNet",
            slides: "GoogLeNet — 인셉션 모듈",
          }}
        >
          <Card>
            <CardTitle>인셉션 모듈의 네 갈래</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              한 층에서 한 종류의 필터 크기만 사용하는 다른 모델과 달리,{" "}
              <strong>서로 다른 크기의 필터들을 사용하고 이를 효과적으로 결합</strong>한다. 네 갈래의
              결과는 마지막에 채널 축으로 이어 붙인다(DepthConcat).
            </p>

            <Scroller>
              <div className="min-w-[420px] space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-28 shrink-0 rounded-md bg-emerald-600 px-2 py-1.5 text-center text-[10.5px] font-bold text-white">
                    이전 결과
                    <br />
                    {MAP} × {MAP} × {IN_C}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {BRANCHES.map((b) => (
                      <div key={b.key} className="flex items-center gap-1.5">
                        <span className="text-gray-300">→</span>
                        <div
                          className={`flex-1 rounded-md px-2 py-1 text-[10.5px] font-semibold ${
                            b.pool
                              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200"
                              : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-200"
                          }`}
                        >
                          {useBottleneck || b.bottleneck === null
                            ? b.label
                            : b.label.replace("1 × 1 CONV → ", "")}
                          {b.bottleneck !== null && useBottleneck && (
                            <span className="ml-1.5 font-mono text-[9.5px] opacity-70">
                              ({MAP} × {MAP} × {b.bottleneck} 거쳐서)
                            </span>
                          )}
                        </div>
                        <span className="w-28 shrink-0 text-right font-mono text-[10.5px] text-gray-500">
                          {MAP} × {MAP} × {b.out}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="w-24 shrink-0 rounded-md bg-emerald-600 px-2 py-1.5 text-center text-[10.5px] font-bold text-white">
                    DepthConcat
                  </div>
                </div>
              </div>
            </Scroller>

            <div className="mt-3">
              <Formula note="네 갈래의 채널 수를 그대로 더한 값 — 강의록 그림의 28 × 28 × 256과 일치">
                {BRANCHES.map((b) => b.out).join(" + ")} = {depth} 채널 → {MAP} × {MAP} × {depth}
              </Formula>
            </div>
            <Hint>
              가로·세로 크기는 네 갈래 모두 {MAP} × {MAP}으로 같게 맞추어져 있다. 그래야 채널 축으로
              이어 붙일 수 있다. 풀링 갈래의 스트라이드가 s = 1인 이유도 여기에 있다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "GoogLeNet — 1 × 1 콘볼루션 사용 → 차원 축소를 통해 계산 비용을 줄임",
          }}
        >
          <Card>
            <CardTitle>1 × 1 콘볼루션을 빼면 계산량이 어떻게 되는가</CardTitle>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setUseBottleneck((v) => !v)}
                aria-pressed={useBottleneck}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  useBottleneck
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400"
                }`}
              >
                1 × 1 콘볼루션 {useBottleneck ? "사용함" : "사용하지 않음"}
              </button>
              <span className="text-[11px] text-gray-500">
                눌러서 3 × 3 · 5 × 5 갈래의 차원 축소를 켜고 끌 수 있습니다
              </span>
            </div>

            <Scroller>
              <div className="min-w-[380px] space-y-2">
                {costs.map(({ b, m }) => (
                  <div key={b.key}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">
                        {useBottleneck || b.bottleneck === null
                          ? b.label
                          : b.label.replace("1 × 1 CONV → ", "")}
                      </span>
                      <span className="font-mono text-gray-500">{num(m)}회</span>
                    </div>
                    <div className="mt-0.5 h-2.5 rounded-sm bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-2.5 rounded-sm bg-blue-500 transition-all"
                        style={{ width: `${(m / maxM) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Scroller>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Formula note="지금 설정에서의 모듈 전체 곱셈 횟수">
                합계 {num(total)}회
              </Formula>
              <Formula note="사용함 ÷ 사용하지 않음">
                {num(withAll)} ÷ {num(withoutAll)} ={" "}
                {((withAll / withoutAll) * 100).toFixed(1)}%
              </Formula>
            </div>
            <Hint>
              같은 {MAP} × {MAP} × {depth} 출력을 내면서도, 3 × 3 갈래 앞에 1 × 1로 채널을 {IN_C}에서{" "}
              96으로, 5 × 5 갈래 앞에 {IN_C}에서 16으로 줄여 두면 곱셈이 약{" "}
              {(withoutAll / withAll).toFixed(2)}배 줄어든다. 강의록이 말하는 “차원 축소를 통해 계산
              비용을 줄임”이 바로 이 뜻이다.
            </Hint>
            <div className="mt-3">
              <ComputedNote>
                특징맵 크기 {MAP} × {MAP}, 입력 채널 {IN_C}, 각 갈래의 채널 수는 강의록 인셉션 모듈
                그림의 값 그대로입니다. 곱셈 횟수는 원자료에 없는 값으로, 특징맵 위치마다 (입력 채널 ×
                필터 크기²)번 곱한다고 보고 이 화면에서 센 것입니다. 풀링에는 곱셈이 없다고 보았습니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "13.1.2 객체인식을 위한 CNN 모델 — GoogLeNet",
            slides: "GoogLeNet — 22층",
          }}
        >
          <Card>
            <CardTitle>모델 전체</CardTitle>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                { k: "층수", v: "22층" },
                { k: "인셉션 모듈", v: "9개" },
                { k: "파라미터", v: "AlexNet의 1/12" },
              ].map((x) => (
                <div
                  key={x.k}
                  className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700"
                >
                  <p className="text-[11px] text-gray-500">{x.k}</p>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{x.v}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              교재의 표현은 이렇다. “총 22개 층으로 이루어진 깊은 모델임에도 불구하고 AlexNet에 비해{" "}
              <strong>12분의 1 정도의 파라미터</strong>만 가지는 효율적인 표현이 가능하였다.” 강의록은
              중간에 <strong>보조 분류기</strong>가 붙은 구조도 함께 보여 준다. 구글에서 개발하여
              GoogLeNet이라 명명했고, 인셉션 모듈 때문에 “InceptionNet”이라고도 부른다.
            </p>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
