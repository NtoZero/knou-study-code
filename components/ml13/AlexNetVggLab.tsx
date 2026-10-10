"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, Formula, Hint, Scroller, Slider, num } from "./ui";

/**
 * 13.1.2 객체인식을 위한 CNN 모델 — AlexNet과 VGG.
 * AlexNet의 학습 설정값과 VGG-16의 특징맵 크기는 강의록·교재 그림의 값 그대로이고,
 * 원소 수와 비율만 이 화면에서 곱해 계산한다.
 */

const ALEX_SETTINGS = [
  { label: "미니배치 모드", value: "크기 128" },
  { label: "모멘텀", value: "0.9" },
  { label: "드롭아웃", value: "0.5" },
  { label: "학습률", value: "0.01 — 검증오차가 증가하면 1/10씩 감소" },
  { label: "정규항의 조정 파라미터", value: "0.0005" },
  { label: "가중치 초기화", value: "가우시안 분포(평균 0, 표준편차 0.01)" },
];

/** VGG-16 모델 구조 그림의 단계별 크기 (교재 그림 13-7 · 강의록 VGG Net) */
interface Stage {
  name: string;
  w: number;
  h: number;
  c: number;
  kind: "입력" | "콘볼루션 + ReLU" | "완전연결 + ReLU" | "소프트맥스";
}

const VGG: Stage[] = [
  { name: "입력 영상", w: 224, h: 224, c: 3, kind: "입력" },
  { name: "1번째 블록", w: 224, h: 224, c: 64, kind: "콘볼루션 + ReLU" },
  { name: "2번째 블록", w: 112, h: 112, c: 128, kind: "콘볼루션 + ReLU" },
  { name: "3번째 블록", w: 56, h: 56, c: 256, kind: "콘볼루션 + ReLU" },
  { name: "4번째 블록", w: 28, h: 28, c: 512, kind: "콘볼루션 + ReLU" },
  { name: "5번째 블록", w: 14, h: 14, c: 512, kind: "콘볼루션 + ReLU" },
  { name: "마지막 특징맵", w: 7, h: 7, c: 512, kind: "콘볼루션 + ReLU" },
  { name: "완전연결", w: 1, h: 1, c: 4096, kind: "완전연결 + ReLU" },
  { name: "출력", w: 1, h: 1, c: 1000, kind: "소프트맥스" },
];

const VGG_VERSIONS = [
  { name: "A", layers: 11 },
  { name: "A-LRN", layers: 11 },
  { name: "B", layers: 13 },
  { name: "C", layers: 16 },
  { name: "D", layers: 16 },
  { name: "E", layers: 19 },
];

function elems(s: Stage) {
  return s.w * s.h * s.c;
}

export default function AlexNetVggLab() {
  const [model, setModel] = useState<"alexnet" | "vgg">("alexnet");
  const [drops, setDrops] = useState(0);
  const [step, setStep] = useState(1);

  const lr = 0.01 / 10 ** drops;
  const stage = VGG[step];
  const prev = VGG[step - 1];
  const ratio = step > 0 ? elems(stage) / elems(prev) : 1;

  return (
    <section id="alexnet-vgg" className="scroll-mt-32">
      <SectionTitle
        title="AlexNet과 VGG — 깊이가 늘어나는 과정"
        subtitle="두 모델의 구성과 설정값을 원문 수치로 확인하고, 특징맵이 줄어드는 양을 직접 곱해 봅니다"
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        <Chip active={model === "alexnet"} onClick={() => setModel("alexnet")}>
          AlexNet (2012)
        </Chip>
        <Chip active={model === "vgg"} onClick={() => setModel("vgg")}>
          VGG (2014)
        </Chip>
      </div>

      {model === "alexnet" && (
        <div className="space-y-5">
          <Sourced
            refs={{
              textbook: "13.1.2 객체인식을 위한 CNN 모델 — AlexNet",
              slides: "AlexNet, Winner of 2012",
            }}
          >
            <Card>
              <CardTitle>8층은 어떻게 세는가</CardTitle>
              <Scroller>
                <div className="flex min-w-[340px] items-end gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={`c${i}`} className="flex-1 text-center">
                      <div className="rounded-t-md bg-blue-600 py-2 text-[10px] font-bold text-white">
                        CONV {i}
                      </div>
                    </div>
                  ))}
                  {[1, 2, 3].map((i) => (
                    <div key={`f${i}`} className="flex-1 text-center">
                      <div className="rounded-t-md bg-emerald-600 py-2 text-[10px] font-bold text-white">
                        FC {i}
                      </div>
                    </div>
                  ))}
                </div>
              </Scroller>
              <div className="mt-2">
                <Formula note="강의록 ILSVRC 표의 ‘Number of layers = 8’과 같은 값">
                  콘볼루션층 5 + 완전연결층 3 = 8층
                </Formula>
              </div>
              <ul className="mt-3 space-y-1.5 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                <li>
                  • <strong>2개의 CNN 구조</strong> — 당시에는 메모리 한계로 인해 듀얼 네트워크로
                  나누어 학습했고, 현재는 하나로 합쳐졌다.
                </li>
                <li>
                  • 교재는 AlexNet이 <strong>LeNet과 기본 구성은 동일</strong>하여 콘볼루션층과
                  풀링층, 마지막의 완전연결층을 가지며 필터의 크기와 개수 등이 LeNet에 비해 크게
                  확장되었다고 설명한다.
                </li>
                <li>
                  • Krizhevsky et al., ImageNet Classification with Deep Convolutional Neural
                  Networks, NeurIPS 2012.
                </li>
              </ul>
              <div className="mt-3">
                <ComputedNote>
                  교재 본문에는 층수의 흐름을 설명하면서 “5개 층을 가진 AlexNet”이라는 표현이
                  나오는데, 이는 콘볼루션층 5개를 가리킨 것입니다. 강의록의 ILSVRC 표와 정리하기는
                  완전연결층 3개를 포함한 <strong>8층</strong>으로 적습니다.
                </ComputedNote>
              </div>
            </Card>
          </Sourced>

          <Sourced refs={{ slides: "AlexNet — 모델 학습을 위한 상세 정보" }}>
            <Card>
              <CardTitle>모델 학습을 위한 상세 정보</CardTitle>
              <Scroller>
                <table className="w-full min-w-[320px] border-collapse text-[12px]">
                  <tbody>
                    {ALEX_SETTINGS.map((s) => (
                      <tr key={s.label} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="w-44 py-1.5 pr-2 font-semibold text-gray-600 dark:text-gray-300">
                          {s.label}
                        </td>
                        <td className="py-1.5 font-mono text-blue-700 dark:text-blue-300">
                          {s.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Scroller>

              <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50/60 p-3 dark:border-blue-900 dark:bg-blue-950/30">
                <p className="mb-2 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                  학습률을 1/10씩 줄이면 — 검증오차가 증가할 때마다 한 번씩
                </p>
                <Slider
                  label="검증오차가 증가해 학습률을 낮춘 횟수"
                  value={drops}
                  min={0}
                  max={4}
                  step={1}
                  onChange={setDrops}
                  display={`${drops}회`}
                />
                <div className="mt-2">
                  <Formula note="시작값 0.01은 강의록에 적힌 값">
                    η = 0.01 × (1/10)<sup>{drops}</sup> = {lr.toFixed(2 + drops)}
                  </Formula>
                </div>
                <Hint>
                  학습률을 처음부터 끝까지 고정하지 않는다는 점이 중요하다. 검증오차가 더 이상 줄지
                  않고 오히려 증가하면, 한 걸음의 크기를 줄여 더 세밀하게 내려간다.
                </Hint>
              </div>
            </Card>
          </Sourced>
        </div>
      )}

      {model === "vgg" && (
        <div className="space-y-5">
          <Sourced
            refs={{
              textbook: "13.1.2 객체인식을 위한 CNN 모델 — VGG",
              slides: "VGG Net — 2014, ILSVRC, 2위",
            }}
          >
            <Card>
              <CardTitle>VGG-16의 특징맵은 어떻게 줄어드는가</CardTitle>
              <Scroller>
                <div className="flex min-w-[420px] items-end gap-1">
                  {VGG.map((s, i) => {
                    const ratioH = Math.max(6, (s.w / 224) * 70);
                    return (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => setStep(i)}
                        className="flex flex-1 flex-col items-center gap-1"
                      >
                        <span
                          className={`text-[9px] font-mono ${i === step ? "font-bold text-blue-600" : "text-gray-400"}`}
                        >
                          {s.c}
                        </span>
                        <motion.span
                          initial={false}
                          animate={{ height: ratioH }}
                          className={`w-full rounded-sm ${
                            i === step ? "bg-blue-600" : "bg-blue-300 dark:bg-blue-800"
                          }`}
                        />
                        <span
                          className={`text-[9px] ${i === step ? "font-bold text-blue-600" : "text-gray-400"}`}
                        >
                          {s.w === 1 ? "1" : `${s.w}²`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Scroller>
              <Hint>
                막대의 높이는 특징맵 한 변의 길이에 비례하고, 위에 적힌 숫자는 채널 수다. 막대를
                눌러 단계를 바꿔 보세요.
              </Hint>

              <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                <p className="text-[12px] font-bold text-gray-800 dark:text-gray-100">
                  {stage.name} — {stage.kind}
                </p>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Formula note="가로 × 세로 × 채널">
                    {stage.w} × {stage.h} × {stage.c} = {num(elems(stage))}
                  </Formula>
                  <Formula note="직전 단계 대비">
                    {num(elems(stage))} ÷ {num(elems(prev))} = {ratio.toFixed(4)}
                  </Formula>
                </div>
                <Hint>
                  2~4번째 블록에서는 한 변이 절반이 되는 대신 채널이 두 배가 되므로 값의 개수가 정확히
                  절반이 된다. 5번째 블록부터는 채널이 512로 고정되어 한 변만 절반이 되므로 1/4로
                  줄어든다. 숫자를 직접 나눠 보면 0.5와 0.25가 그대로 나온다.
                </Hint>
              </div>

              <div className="mt-3">
                <ComputedNote>
                  각 단계의 가로 × 세로 × 채널 값은 교재 그림 13-7(VGG-16 모델 구조)과 강의록 그림에
                  적힌 값 그대로입니다. 원소 수와 비율은 그 값을 이 화면에서 곱하고 나눈 결과입니다.
                </ComputedNote>
              </div>
            </Card>
          </Sourced>

          <Sourced
            refs={{
              textbook: "13.1.2 객체인식을 위한 CNN 모델 — VGG",
              slides: "VGG Net — 다양한 층수를 가진 여러 버전을 제공",
            }}
          >
            <Card>
              <CardTitle>왜 VGG는 지금도 많이 쓰이는가</CardTitle>
              <Scroller>
                <div className="flex min-w-[340px] gap-1.5">
                  {VGG_VERSIONS.map((v) => (
                    <div
                      key={v.name}
                      className="flex-1 rounded-lg border border-gray-200 p-2 text-center dark:border-gray-700"
                    >
                      <p className="text-[11px] font-bold text-gray-500">{v.name}</p>
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {v.layers}
                      </p>
                      <p className="text-[9px] text-gray-400">weight layers</p>
                    </div>
                  ))}
                </div>
              </Scroller>
              <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                교재는 그 이유를 이렇게 적는다. 층수와 필터 크기에 차이를 둔 다양한 버전의 모델에
                대하여 실험을 수행하고, <strong>ImageNet으로 학습된 모델들을 공개 소스로 제공</strong>
                하고 있으므로 개발자들이 자신의 목적에 맞게 모델을 선택하여 활용하기가 쉽기 때문이다.
                교재 그림은 16개의 층을 가진 VGG-16을 보여 주며, VGG-11·VGG-13·VGG-19 등의 버전이
                존재한다. ILSVRC2014에서는 2위를 차지했다.
              </p>
              <Hint>
                정리하기는 “VGG(2014, 11/13/16/19층, 층수/필터 크기에 차이를 둔 다른 다양한 버전의
                모델 존재)”로 정리한다. ILSVRC 표에 올라간 것은 그중 19층 버전인 VGG-19다.
              </Hint>
            </Card>
          </Sourced>
        </div>
      )}
    </section>
  );
}
