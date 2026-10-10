"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, Formula, Hint, Scroller, Slider, num } from "./ui";

/**
 * 13.1.3 영상이해를 위한 딥러닝 — (1) 객체 검출을 위한 딥러닝 모델.
 * YOLO 출력 텐서의 기본값(7 × 7 × 30, 2 bbox, 20 클래스, 448 × 448 × 3 입력)은
 * 교재 그림 13-12와 강의록 YOLO 슬라이드의 값 그대로다.
 */

const YOLO_IMG = 448; // 교재 그림 13-12의 입력 크기

const MODELS = [
  {
    key: "rcnn",
    name: "R-CNN",
    year: "",
    steps: [
      "1. Input image",
      "2. Extract region proposals (~2k)",
      "3. Compute CNN features",
      "4. Classify regions",
    ],
    detail:
      "입력 이미지에 대해 기초적인 영상처리 기법들을 적용하여 객체가 있을 만한 관심 영역(Region of Interest: ROI)의 후보 집합을 추출하고, 각 영역에 대해 기존에 만들어진 객체인식 신경망으로 인식을 수행함으로써 실제로 객체가 있는 영역 후보들을 고른다.",
    limit:
      "성능 면에서는 꽤 가능성 있는 결과를 보여 주었으나, ROI를 뽑고 인식하는 데 필요한 시간 복잡도가 높아 실제 응용에서는 사용하기 힘든 기술이었다.",
  },
  {
    key: "faster",
    name: "Faster R-CNN",
    year: "",
    steps: ["conv layers", "Region Proposal Network", "RoI pooling", "classifier"],
    detail:
      "앞 단계에서 먼저 특징을 뽑아 병렬적으로 처리하는 방식의 기법을 적용하여, 인식 성능과 계산 시간 면에서 적절한 타협안을 제공하였다.",
    limit:
      "R-CNN에 비해 많은 시간 단축을 이루었으나, 기본적으로 최대 2,000개의 ROI에 대한 인식이 이루어져야 하므로 여전히 동영상에 대한 온라인 처리를 제공할 만한 속도를 달성하지는 못하였다.",
  },
  {
    key: "yolo",
    name: "YOLO (2016)",
    year: "You Only Look Once",
    steps: [
      "448 × 448 × 3 입력",
      "GoogLeNet modification (20 layers)",
      "7 × 7 × 1024 특징맵",
      "FC 4096 → 1470 → reshape 7 × 7 × 30",
    ],
    detail:
      "검출과 인식을 여러 번 반복하지 않고 한 번에 모두 이루어지도록 설계하였다. R-CNN과 달리 ROI(Region of Interest) 또는 영역 제안(region proposal)이 사용되지 않는다. 기본적인 구조는 객체인식을 위한 CNN 모델과 크게 다르지 않으며, 다만 마지막 출력값의 구성이 다르다.",
    limit:
      "Faster R-CNN보다는 검출 성능이 다소 떨어지나, 속도 면에서는 실시간 동영상에서도 검출 가능할 정도로 빠르다.",
  },
];

export default function DetectionModels() {
  const [win, setWin] = useState(64);
  const [stride, setStride] = useState(16);
  const [model, setModel] = useState("rcnn");

  const perSide = Math.floor((YOLO_IMG - win) / stride) + 1;
  const windows = perSide * perSide;

  const [S, setS] = useState(7);
  const [B, setB] = useState(2);
  const [C, setC] = useState(20);
  const perCell = 5 * B + C;
  const tensor = S * S * perCell;

  const sel = MODELS.find((m) => m.key === model)!;

  return (
    <section id="detection-models" className="scroll-mt-32">
      <SectionTitle
        title="다중 객체 검출 — 창을 밀어 보는 방법에서 한 번에 보는 방법까지"
        subtitle="영상 하나에 객체가 여럿일 때, 모두 찾고 각각의 위치까지 내야 합니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "13.1.3 영상이해를 위한 딥러닝 — (1) 객체 검출을 위한 딥러닝 모델",
            slides: "객체 검출을 위한 모델 — 다중 객체 검출",
          }}
        >
          <Card>
            <CardTitle>가장 기본적인 접근: 윈도우 스캐닝</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              객체가 포함될 윈도우 크기를 정하여 영상 전체를{" "}
              <strong>윈도우 스캐닝(sliding window)</strong>하면서 객체인식을 수행하는 것을 생각해 볼
              수 있다. 그러나 교재는 “이러한 방법은 지나친 계산량을 요구하므로 실제 문제에서
              활용되기는 힘들다”고 적는다. 얼마나 많아지는지 직접 세어 보자.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Slider
                label="윈도우 한 변의 길이"
                value={win}
                min={32}
                max={224}
                step={16}
                onChange={setWin}
                display={`${win}px`}
              />
              <Slider
                label="스트라이드(한 번에 미는 칸)"
                value={stride}
                min={4}
                max={64}
                step={4}
                onChange={setStride}
                display={`${stride}px`}
              />
            </div>

            <div className="mt-3">
              <Formula note={`영상 한 변은 ${YOLO_IMG}px으로 두었습니다 · ⌊ ⌋는 소수점 아래를 버린다는 뜻`}>
                (⌊({YOLO_IMG} − {win}) ÷ {stride}⌋ + 1)² = ({Math.floor((YOLO_IMG - win) / stride)}{" "}
                + 1)² = {perSide}² = {num(windows)}개 윈도우
              </Formula>
            </div>
            <Hint>
              이 {num(windows)}개 각각에 대해 객체인식 신경망을 한 번씩 돌려야 한다. 객체의 크기를
              모르므로 윈도우 크기를 여러 가지로 바꿔 가며 다시 훑어야 하니 실제 비용은 여기에 배수가
              더 붙는다. 그래서 분할·에지·색상 등을 이용해 <strong>후보 영역을 먼저 제안</strong>하는
              방법으로 넘어간다.
            </Hint>
            <div className="mt-3">
              <ComputedNote>
                영상 크기 {YOLO_IMG}px은 교재 그림 13-12의 YOLO 입력 크기를 가져온 값이고, 윈도우
                크기와 스트라이드는 이 화면에서 정한 설정입니다. 윈도우 개수는 그 값으로 계산한
                결과입니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "13.1.3 영상이해를 위한 딥러닝 — R-CNN · Faster R-CNN · YOLO",
            slides: "R-CNN, Faster R-CNN · YOLO",
          }}
        >
          <Card>
            <CardTitle>세 모델의 구조와 한계</CardTitle>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {MODELS.map((m) => (
                <Chip key={m.key} active={m.key === model} onClick={() => setModel(m.key)}>
                  {m.name}
                </Chip>
              ))}
            </div>

            <Scroller>
              <div className="flex min-w-[380px] items-stretch gap-1.5">
                {sel.steps.map((s, i) => (
                  <div key={s} className="flex flex-1 items-center gap-1.5">
                    <div className="flex-1 rounded-lg border border-blue-200 bg-blue-50/60 p-2 text-center text-[10.5px] font-semibold leading-4 text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
                      {s}
                    </div>
                    {i < sel.steps.length - 1 && <span className="text-gray-300">→</span>}
                  </div>
                ))}
              </div>
            </Scroller>

            {sel.year && (
              <p className="mt-2 text-[11px] font-semibold text-gray-400">{sel.year}</p>
            )}
            <p className="mt-2 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              {sel.detail}
            </p>
            <div className="mt-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
              <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                {sel.key === "yolo" ? "맞바꾼 것" : "남은 한계"}
              </p>
              <p className="mt-0.5 text-[12px] leading-6 text-amber-900 dark:text-amber-100">
                {sel.limit}
              </p>
            </div>
            <Hint>
              세 모델을 가르는 축은 둘이다. 하나는 <strong>후보 영역을 쓰는가</strong>(R-CNN·Faster
              R-CNN은 쓰고 YOLO는 쓰지 않는다), 다른 하나는 <strong>검출과 인식을 몇 번에
              하는가</strong>(YOLO는 한 번에 한다). 정리하기도 “YOLO는 탐지와 인식을 한 번에 수행해
              실시간 처리에 적합하다”로 정리한다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "13.1.3 영상이해를 위한 딥러닝 — YOLO 모델의 구조와 출력값 정의",
            slides: "YOLO — Tensor values interpretation",
          }}
        >
          <Card>
            <CardTitle>YOLO의 출력값은 왜 7 × 7 × 30인가</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              출력값에는 객체가 위치하는 <strong>바운딩 박스</strong>(bounding box: bbox)와 객체의
              클래스명이 주어져야 하므로, 전체 영상을 그리드로 나누고 그리드별로 객체의 유무와 객체가
              있는 경우 바운딩 박스의 위치 등을 결정하도록 정의한다.
            </p>

            <Scroller>
              <div className="min-w-[340px] space-y-1.5">
                <p className="text-[11px] font-semibold text-gray-500">
                  그리드 칸 하나가 가지는 값 — 박스 {B}개 × 5개 값 + 클래스 {C}개
                </p>
                <div className="flex gap-0.5">
                  {Array.from({ length: B }).map((_, i) => (
                    <div
                      key={`b${i}`}
                      className="flex flex-1 gap-0.5 rounded-md bg-blue-50 p-1 dark:bg-blue-950/40"
                    >
                      {["x", "y", "w", "h", "c"].map((v) => (
                        <span
                          key={v}
                          className="flex-1 rounded-sm bg-blue-600 py-1 text-center text-[10px] font-bold text-white"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  ))}
                  <div className="flex-[2] rounded-md bg-emerald-50 p-1 text-center dark:bg-emerald-950/40">
                    <span className="block rounded-sm bg-emerald-600 py-1 text-[10px] font-bold text-white">
                      클래스 점수 {C}개
                    </span>
                  </div>
                </div>
              </div>
            </Scroller>

            <ul className="mt-3 space-y-0.5 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
              <li>x — 칸 안에서의 박스 중심 가로 좌표 (그리드 칸 크기 기준 0~1)</li>
              <li>y — 칸 안에서의 박스 중심 세로 좌표 (그리드 칸 크기 기준 0~1)</li>
              <li>w — 박스의 너비 (영상 크기 기준 0~1)</li>
              <li>h — 박스의 높이 (영상 크기 기준 0~1)</li>
              <li>c — 박스 신뢰도, 박스 안에 객체가 있을 확률</li>
            </ul>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Slider
                label="그리드 S × S"
                value={S}
                min={3}
                max={13}
                step={1}
                onChange={setS}
                display={`${S} × ${S}`}
              />
              <Slider
                label="칸마다의 박스 수 B"
                value={B}
                min={1}
                max={5}
                step={1}
                onChange={setB}
                display={`${B}개`}
              />
              <Slider
                label="클래스 수 C"
                value={C}
                min={2}
                max={40}
                step={1}
                onChange={setC}
                display={`${C}개`}
              />
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Formula note="칸 하나가 들고 있는 값의 개수">
                5 × {B} + {C} = {perCell}
              </Formula>
              <Formula note="출력 텐서 전체">
                {S} × {S} × {perCell} = {num(tensor)}
              </Formula>
            </div>

            <div
              className={`mt-2 rounded-lg p-3 text-[12px] ${
                S === 7 && B === 2 && C === 20
                  ? "bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-200"
                  : "bg-gray-50 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300"
              }`}
            >
              {S === 7 && B === 2 && C === 20 ? (
                <>
                  원문 값과 같은 설정입니다. 교재 그림 13-12의 출력은{" "}
                  <strong>7 × 7 × 30</strong>이고, 완전연결층의 출력 벡터는{" "}
                  <strong>1470 × 1</strong>입니다. 7 × 7 × 30 = 1470으로 두 값이 맞아떨어집니다.
                </>
              ) : (
                <>
                  원문 설정은 S = 7, B = 2, C = 20이고 그때의 출력은 7 × 7 × 30 = 1470입니다. 지금은
                  슬라이더로 바꾼 값입니다.
                </>
              )}
            </div>

            <div className="mt-3">
              <ComputedNote>
                S = 7, B = 2, C = 20과 그때의 출력 7 × 7 × 30, 1470 × 1은 원문 값입니다. 슬라이더로
                바꾼 다른 설정의 값은 그 규칙으로 이 화면에서 계산한 것입니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
