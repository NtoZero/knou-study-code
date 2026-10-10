"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Hint, Scroller } from "./ui";

/**
 * 13.1.3 영상이해를 위한 딥러닝 — (2) 영상설명 모델.
 * 예문은 교재 그림 13-13의 캡션 그대로다.
 */

const WORDS = ["A", "group", "of", "people", "shopping", "at", "an", "outdoor", "market."];

export default function ImageDescriptionModel() {
  const [t, setT] = useState(0);

  const next = () => setT((v) => Math.min(v + 1, WORDS.length));
  const reset = () => setT(0);

  return (
    <section id="image-description" className="scroll-mt-32">
      <SectionTitle
        title="영상설명 — CNN이 보고, RNN이 말한다"
        subtitle="영상을 입력받아 설명 문장을 출력하려면 두 종류의 모델을 이어 붙여야 합니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "13.1.3 영상이해를 위한 딥러닝 — (2) 영상설명 모델",
            slides: "영상설명모델 — Show and Tell",
          }}
        >
          <Card>
            <CardTitle>Show and Tell의 구조</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              영상에 포함된 의미를 종합적으로 이해하고 이를 설명하는 자연어 문장을 생성하는{" "}
              <strong>최초의 모델</strong>. 영상처리를 위한 CNN 모델과 문장생성을 위한 RNN 모델이
              결합된 구조를 가진다.
            </p>

            <Scroller>
              <div className="flex min-w-[400px] items-stretch gap-2">
                <div className="flex w-24 shrink-0 flex-col justify-center rounded-lg border-2 border-dashed border-gray-300 p-2 text-center dark:border-gray-600">
                  <p className="text-[10px] text-gray-400">입력</p>
                  <p className="text-[11px] font-bold text-gray-700 dark:text-gray-200">영상</p>
                </div>
                <div className="flex items-center text-gray-300">→</div>
                <div className="flex-1 rounded-lg bg-blue-600 p-2 text-center text-white">
                  <p className="text-[10px] opacity-80">Vision — 영상처리</p>
                  <p className="text-[11.5px] font-bold">Deep CNN (GoogLeNet)</p>
                  <p className="mt-1 text-[9.5px] leading-4 opacity-90">
                    인식 결과를 내는 마지막 층이 아니라
                    <br />그 <strong>이전 층의 출력</strong>을 특징값으로
                  </p>
                </div>
                <div className="flex items-center text-gray-300">→</div>
                <div className="flex-1 rounded-lg bg-emerald-600 p-2 text-center text-white">
                  <p className="text-[10px] opacity-80">Language — 문장생성</p>
                  <p className="text-[11.5px] font-bold">RNN (LSTM)</p>
                  <p className="mt-1 text-[9.5px] leading-4 opacity-90">
                    한 번에 한 단어씩 생성하는
                    <br />
                    LSTM의 시퀀스
                  </p>
                </div>
              </div>
            </Scroller>

            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              이 단계에서 입력 영상은 GoogLeNet에 의해 영상의 의미 정보를 포함한 특징값으로{" "}
              <strong>변환(인코딩)</strong>된다고 볼 수 있다. 이렇게 얻어진 특징값이 RNN의 입력으로
              들어가면 그 특징에 포함된 의미 정보가 자연어 문장으로 출력된다.
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "13.1.3 영상이해를 위한 딥러닝 — Show and Tell 모델의 구조",
          }}
        >
          <Card>
            <CardTitle>한 번에 한 단어씩 — 눌러서 생성해 보세요</CardTitle>

            <Scroller>
              <div className="flex min-w-[400px] items-end gap-1">
                <div className="w-20 shrink-0 rounded-md bg-blue-600 py-3 text-center text-[10px] font-bold text-white">
                  image
                  <br />
                  특징값
                </div>
                {WORDS.map((w, i) => {
                  const on = i < t;
                  return (
                    <div key={`${w}-${i}`} className="flex flex-1 flex-col items-center gap-1">
                      <motion.span
                        initial={false}
                        animate={{ opacity: on ? 1 : 0.15, y: on ? 0 : 4 }}
                        className="whitespace-nowrap text-[10.5px] font-bold text-emerald-700 dark:text-emerald-300"
                      >
                        {w}
                      </motion.span>
                      <span className="text-[9px] text-gray-300">↑</span>
                      <div
                        className={`w-full rounded-md py-2 text-center text-[9.5px] font-bold transition-colors ${
                          on
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                        }`}
                      >
                        LSTM
                      </div>
                      <span className="text-[9px] font-mono text-gray-400">
                        S<sub>{i}</sub>
                      </span>
                    </div>
                  );
                })}
              </div>
            </Scroller>

            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
              <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
                지금까지 생성된 문장
              </p>
              <p className="mt-1 min-h-[22px] text-[13.5px] font-semibold text-emerald-900 dark:text-emerald-100">
                {WORDS.slice(0, t).join(" ") || "—"}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={next}
                disabled={t >= WORDS.length}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
              >
                <Play size={13} />
                다음 단어 ({t} / {WORDS.length})
              </button>
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:border-gray-600 dark:text-gray-300"
              >
                <RotateCcw size={13} />
                처음부터
              </button>
            </div>

            <Hint>
              앞 칸의 LSTM이 내놓은 단어가 다음 칸의 입력이 된다. 그래서 문장이 왼쪽에서 오른쪽으로
              한 단어씩 늘어난다. 영상의 특징값은 맨 처음 한 번 들어가, 이후 모든 단어 선택에 영향을
              준다.
            </Hint>

            <div className="mt-3">
              <ComputedNote>
                예문 “A group of people shopping at an outdoor market.”은 교재 그림 13-13에 실린
                캡션 그대로입니다. 단어를 한 칸씩 켜 보이는 진행 방식은 설명을 위해 이 화면에서 만든
                것으로, 실제 생성 확률값을 계산한 것은 아닙니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ slides: "영상설명모델 — Show, Attend and Tell" }}>
          <Card>
            <CardTitle>또 하나의 영상설명 모델</CardTitle>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[12px] font-bold text-gray-800 dark:text-gray-100">
                  Show and Tell
                </p>
                <p className="mt-1 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  Vinyals et al., Show and Tell: A Neural Image Caption Generator, CVPR 2015
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[12px] font-bold text-gray-800 dark:text-gray-100">
                  Show, Attend and Tell
                </p>
                <p className="mt-1 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  Xu et al., Show, Attend and Tell: Neural Image Caption Generation with Visual
                  Attention, ICML 2015
                </p>
              </div>
            </div>
            <Hint>
              정리하기는 영상이해를 위한 딥러닝을 두 줄로 정리한다. 다중 객체 검출은 R-CNN · Faster
              R-CNN · YOLO, 영상 설명은 Show and Tell · Show, Attend and Tell이다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
