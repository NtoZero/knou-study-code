"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Formula, Hint, Scroller, Slider, num } from "./ui";

/**
 * 13.1.4 영상변환 및 생성을 위한 딥러닝 — (1) 오토인코더 모델과 U-Net.
 * U-Net 사다리의 크기·채널 수는 교재 그림 13-15의 값 그대로이고,
 * 각 단계가 어떤 규칙으로 그 값이 되는지를 이 화면에서 적용해 보인다.
 */

type Op = "conv3" | "pool" | "up" | "conv1";

const OP_LABEL: Record<Op, string> = {
  conv3: "conv 3×3, ReLU",
  pool: "max pool 2×2",
  up: "up-conv 2×2",
  conv1: "conv 1×1",
};

const OP_RULE: Record<Op, string> = {
  conv3: "한 변에서 2를 뺀다 (가장자리를 덧대지 않는 3×3 콘볼루션)",
  pool: "한 변을 2로 나눈다",
  up: "한 변에 2를 곱한다",
  conv1: "크기는 그대로 두고 채널만 바꾼다",
};

interface Step {
  op: Op;
  size: number;
  ch: number;
  /** 스킵 연결로 건너온 특징맵이 합쳐지는 단계인가 */
  skipFrom?: number;
  side: "down" | "up";
}

const START = { size: 572, ch: 1 };

const STEPS: Step[] = [
  { op: "conv3", size: 570, ch: 64, side: "down" },
  { op: "conv3", size: 568, ch: 64, side: "down" },
  { op: "pool", size: 284, ch: 64, side: "down" },
  { op: "conv3", size: 282, ch: 128, side: "down" },
  { op: "conv3", size: 280, ch: 128, side: "down" },
  { op: "pool", size: 140, ch: 128, side: "down" },
  { op: "conv3", size: 138, ch: 256, side: "down" },
  { op: "conv3", size: 136, ch: 256, side: "down" },
  { op: "pool", size: 68, ch: 256, side: "down" },
  { op: "conv3", size: 66, ch: 512, side: "down" },
  { op: "conv3", size: 64, ch: 512, side: "down" },
  { op: "pool", size: 32, ch: 512, side: "down" },
  { op: "conv3", size: 30, ch: 1024, side: "down" },
  { op: "conv3", size: 28, ch: 1024, side: "down" },
  { op: "up", size: 56, ch: 1024, skipFrom: 64, side: "up" },
  { op: "conv3", size: 54, ch: 512, side: "up" },
  { op: "conv3", size: 52, ch: 512, side: "up" },
  { op: "up", size: 104, ch: 512, skipFrom: 136, side: "up" },
  { op: "conv3", size: 102, ch: 256, side: "up" },
  { op: "conv3", size: 100, ch: 256, side: "up" },
  { op: "up", size: 200, ch: 256, skipFrom: 280, side: "up" },
  { op: "conv3", size: 198, ch: 128, side: "up" },
  { op: "conv3", size: 196, ch: 128, side: "up" },
  { op: "up", size: 392, ch: 128, skipFrom: 568, side: "up" },
  { op: "conv3", size: 390, ch: 64, side: "up" },
  { op: "conv3", size: 388, ch: 64, side: "up" },
  { op: "conv1", size: 388, ch: 2, side: "up" },
];

function arithmetic(i: number): string {
  const cur = STEPS[i];
  const prevSize = i === 0 ? START.size : STEPS[i - 1].size;
  switch (cur.op) {
    case "conv3":
      return `${prevSize} − 2 = ${cur.size}`;
    case "pool":
      return `${prevSize} ÷ 2 = ${cur.size}`;
    case "up":
      return `${prevSize} × 2 = ${cur.size}`;
    case "conv1":
      return `${prevSize} → ${cur.size} (그대로)`;
  }
}

export default function AutoencoderUNetLab() {
  const [n, setN] = useState(784);
  const [k, setK] = useState(32);
  const [i, setI] = useState(13);

  const step = STEPS[i];
  const bottleneck = STEPS[13];

  return (
    <section id="autoencoder-unet" className="scroll-mt-32">
      <SectionTitle
        title="오토인코더와 U-Net — 영상을 받아 영상을 내놓는 구조"
        subtitle="영상이해와 달리 출력도 영상이므로, 줄였다가 다시 키우는 구조가 필요합니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "13.1.4 영상변환 및 생성을 위한 딥러닝 — (1) 오토인코더 모델",
            slides: "오토인코더모델 — 기본 구조",
          }}
        >
          <Card>
            <CardTitle>오토인코더의 기본 구조</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              입력 𝑥를 받고 출력도 입력과 같은 형태의 𝑥′를 가지며,{" "}
              <strong>중간층을 중심으로 대칭 구조</strong>를 가진다. 이때 중간층의 크기는 입력에 비해
              작아지도록 설계한다. 𝑥에서 𝑧까지의 처리를 <strong>인코딩</strong>, 𝑧에서 다시 𝑥′까지의
              처리를 <strong>디코딩</strong>이라 한다.
            </p>

            <Scroller>
              <div className="flex min-w-[360px] items-center justify-center gap-1">
                {[
                  { h: 90, label: "𝑥", sub: `${n}`, tone: "bg-gray-400" },
                  { h: 64, label: "", sub: "", tone: "bg-blue-300" },
                  { h: Math.max(16, (k / n) * 90), label: "𝑧", sub: `${k}`, tone: "bg-blue-600" },
                  { h: 64, label: "", sub: "", tone: "bg-blue-300" },
                  { h: 90, label: "𝑥′", sub: `${n}`, tone: "bg-gray-400" },
                ].map((b, idx) => (
                  <div key={idx} className="flex w-16 flex-col items-center gap-1">
                    <div
                      className={`w-10 rounded-sm ${b.tone}`}
                      style={{ height: `${b.h}px` }}
                    />
                    <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300">
                      {b.label}
                    </span>
                    <span className="font-mono text-[10px] text-gray-400">{b.sub}</span>
                  </div>
                ))}
              </div>
              <div className="mt-1 flex min-w-[360px] justify-center gap-1">
                <span className="w-[136px] text-center text-[10.5px] font-semibold text-blue-600">
                  인코더
                </span>
                <span className="w-16" />
                <span className="w-[136px] text-center text-[10.5px] font-semibold text-blue-600">
                  디코더
                </span>
              </div>
            </Scroller>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Slider
                label="입력 𝑥의 크기"
                value={n}
                min={64}
                max={1024}
                step={16}
                onChange={(v) => {
                  setN(v);
                  if (k > v / 2) setK(Math.max(4, Math.round(v / 2)));
                }}
                display={num(n)}
              />
              <Slider
                label="중간층 코드 𝑧의 크기"
                value={k}
                min={4}
                max={Math.round(n / 2)}
                step={4}
                onChange={setK}
                display={num(k)}
              />
            </div>

            <div className="mt-3">
              <Formula note="중간층이 입력보다 작아야 ‘축약된 특징’이 된다">
                {num(k)} ÷ {num(n)} = {((k / n) * 100).toFixed(1)}% 로 줄임 — {(n / k).toFixed(1)}배
                압축
              </Formula>
            </div>

            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              출력 𝑥′가 입력 𝑥와 같아지도록 학습하며, 이렇게 함으로써 중간층의 값 𝑧는 𝑥에 포함된
              정보를 압축하였다가 다시 원래대로 복원할 수 있는 <strong>축약된 특징</strong>이 된다.
              입력과 출력이 기본적으로 같은 영상이므로 클래스 레이블과 같은 목표 출력을 따로 만들어
              줄 필요가 없고, 따라서 기본 오토인코더는 일종의{" "}
              <strong>비지도학습을 수행하는 모델</strong>이라고 볼 수 있다.
            </p>
            <Hint>
              다만 영상분할이나 영상변환을 위한 목적으로 사용하는 경우에는 목표 출력값이 필요하다.
              또한 기본적인 오토인코더는 다층 퍼셉트론과 같은 완전연결층으로 정의되었으나, 영상
              데이터의 경우에는 콘볼루션층을 더 많이 사용한다.
            </Hint>
            <div className="mt-3">
              <ComputedNote>
                슬라이더의 입력 크기와 코드 크기는 이 화면에서 정한 값입니다. 교재는 “중간층의 크기는
                입력에 비해 작아지도록 설계한다”고만 적고 구체적인 수치는 들지 않습니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "13.1.4 영상변환 및 생성을 위한 딥러닝 — U-Net",
            slides: "오토인코더모델 — U-Net · U-Net 구조",
          }}
        >
          <Card>
            <CardTitle>U-Net — 572에서 시작해 388로 끝나는 이유</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              CNN 기반의 변형된 오토인코더 구조를 가지며,{" "}
              <strong>의료영상에 대한 영상분할을 위해 개발</strong>되었다. 구조적 특징은 세 가지다 —
              contracting path(“인코더”), expanding path(“디코더”), 그리고 skip connection.
            </p>

            <Scroller>
              <div className="flex min-w-[420px] items-end gap-[3px]">
                {STEPS.map((s, idx) => {
                  const h = 8 + (s.size / 572) * 70;
                  const active = idx === i;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setI(idx)}
                      aria-label={`${idx + 1}단계 ${s.size} × ${s.size}`}
                      className="flex flex-1 flex-col items-center justify-end gap-0.5"
                    >
                      <span
                        className={`w-full rounded-sm transition-colors ${
                          active
                            ? "bg-blue-600"
                            : s.side === "down"
                              ? "bg-blue-300 dark:bg-blue-900"
                              : "bg-emerald-300 dark:bg-emerald-900"
                        }`}
                        style={{ height: `${h}px` }}
                      />
                      {s.skipFrom && (
                        <span className="text-[8px] leading-none text-amber-500">↷</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-1 flex min-w-[420px] justify-between text-[10px] text-gray-400">
                <span className="font-semibold text-blue-500">
                  contracting path — 인코더
                </span>
                <span className="font-semibold text-emerald-500">
                  expanding path — 디코더
                </span>
              </div>
            </Scroller>

            <div className="mt-3">
              <Slider
                label={`단계 (전체 ${STEPS.length}단계)`}
                value={i}
                min={0}
                max={STEPS.length - 1}
                step={1}
                onChange={setI}
                display={`${i + 1}`}
              />
            </div>

            <div className="mt-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
              <p className="text-[12px] font-bold text-gray-800 dark:text-gray-100">
                {OP_LABEL[step.op]}
              </p>
              <p className="mt-0.5 text-[11.5px] text-gray-500">{OP_RULE[step.op]}</p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Formula note="한 변의 길이">{arithmetic(i)}</Formula>
                <Formula note="이 단계의 특징맵">
                  {step.size} × {step.size} × {num(step.ch)}
                </Formula>
              </div>
              {step.skipFrom && (
                <p className="mt-2 rounded-md bg-amber-50 px-2.5 py-1.5 text-[11.5px] leading-5 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                  이 자리에서 인코더 쪽 {step.skipFrom} × {step.skipFrom} 특징맵을 잘라
                  (copy and crop) {step.size} × {step.size}로 맞춰 붙인다. 크기가 다르기 때문에 그냥
                  잇지 못하고 가장자리를 잘라 내는 것이다.
                </p>
              )}
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Formula note="입력">572 × 572 × 1</Formula>
              <Formula note="가장 좁은 중간층">
                {bottleneck.size} × {bottleneck.size} × {num(bottleneck.ch)}
              </Formula>
              <Formula note="출력 — 분할 결과">388 × 388 × 2</Formula>
            </div>

            <Hint>
              한 변이 572에서 시작해 중간층에서 28까지 줄었다가 다시 388로 커진다. 입력과 출력의
              크기가 같지 않은 것은 3×3 콘볼루션마다 한 변에서 2씩 깎이기 때문이다. 교재는 이
              구조를 “572 × 572 크기의 2D 입력에서 시작하여 층을 거치면서 점점 작아져서 중간층에서
              1024차원의 특징으로 변환되고 이어서 같은 방식을 되짚어서 다시 확대되는 구조”라고
              설명한다. 마지막 1×1 콘볼루션이 채널을 2로 줄이는데, 이것이 곧 화소마다 매겨지는 범주
              값이다.
            </Hint>

            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              중간층을 중심으로 대칭이 되는 입력 부분과 출력 부분 사이에 스킵 연결이 존재하는{" "}
              <strong>일종의 잔차 모듈의 특성</strong>도 반영하였다. U-Net은 처음에 의료영상의 분할을
              위해 개발되었으나, 이후 영상개선 등의 다른 목적을 위해 유사 구조의 모델이 다양하게
              개발되었다.
            </p>
            <div className="mt-3">
              <ComputedNote>
                단계별 크기와 채널 수는 교재 그림 13-15(U-Net의 기본 구조와 영상분할 예)에 적힌 값
                그대로입니다. 각 단계의 뺄셈·나눗셈은 그 값들이 어떤 규칙으로 이어지는지 이 화면에서
                맞춰 본 것입니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
