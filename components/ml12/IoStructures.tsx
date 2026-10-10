"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, Hint, Scroller } from "./ui";

interface Shape {
  key: string;
  ratio: string;
  cols: number;
  inputAt: number[];
  outputAt: number[];
  apps: string[];
  detail: string;
}

/** 그림 12-23 (a)~(e) — 입·출력 관계에 따른 RNN의 다양한 구조 */
const SHAPES: Shape[] = [
  {
    key: "1:1",
    ratio: "1:1",
    cols: 1,
    inputAt: [0],
    outputAt: [0],
    apps: ["기본 구조"],
    detail:
      "시간 순서에 따라 확장하기 전의 기본 구조입니다. 입력 하나에 출력 하나가 대응합니다.",
  },
  {
    key: "1:m",
    ratio: "1:m",
    cols: 3,
    inputAt: [0],
    outputAt: [0, 1, 2],
    apps: ["이미지 설명·묘사 (image captioning)"],
    detail:
      "특정 시점에 주어진 하나의 입력에 대해 여러 차례의 순환 연산을 통해 여러 출력을 만들어 냅니다. 이미지에 대한 적절한 처리를 거친 특징벡터가 입력으로 주어졌을 때, 이미지를 설명·묘사할 수 있는 단어들을 각 시점에서의 결과로서 출력합니다.",
  },
  {
    key: "m:1",
    ratio: "m:1",
    cols: 3,
    inputAt: [0, 1, 2],
    outputAt: [2],
    apps: ["감정 분류 (sentiment classification)", "온라인 필기 문자 인식"],
    detail:
      "순차적으로 여러 개의 입력을 받은 후 최종적으로 하나의 결과를 생성할 때 활용됩니다. 하나의 문장을 구성하는 단어들을 각 시점에서의 입력으로 받아서 해당 문장에서의 감정을 파악하는 응용이 여기에 해당합니다.",
  },
  {
    key: "m:n-seq",
    ratio: "m:n (시퀀스 → 시퀀스)",
    cols: 5,
    inputAt: [0, 1, 2],
    outputAt: [2, 3, 4],
    apps: ["기계번역 (machine translation)"],
    detail:
      "한글을 영어로 번역하는 기계번역은 단어 단위의 입력을 모두 처리한 다음에 번역 문장(단어 단위의 출력)을 생성해야 하므로, 시퀀스를 시퀀스로 매칭하는 구조를 가집니다.",
  },
  {
    key: "m:n-sync",
    ratio: "m:n (매 시각 출력)",
    cols: 3,
    inputAt: [0, 1, 2],
    outputAt: [0, 1, 2],
    apps: ["프레임 수준의 비디오 분류 — 예: 동작 분류"],
    detail:
      "입력이 들어올 때마다 그 시점의 출력을 함께 만들어 내는 구조로, 프레임 수준에서 비디오를 분류하는 것과 같은 응용에 적합합니다.",
  },
];

const COL = 58;
const R = 11;

function ShapeDiagram({ shape, small = false }: { shape: Shape; small?: boolean }) {
  const w = 24 + shape.cols * COL;
  const h = 150;
  const yX = 118;
  const yH = 75;
  const yY = 32;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto" style={{ width: small ? w * 0.9 : w * 1.3 }}>
      {Array.from({ length: shape.cols }, (_, i) => {
        const x = 24 + i * COL;
        const hasIn = shape.inputAt.includes(i);
        const hasOut = shape.outputAt.includes(i);
        return (
          <g key={i}>
            {i < shape.cols - 1 && (
              <line
                x1={x + R}
                y1={yH}
                x2={x + COL - R}
                y2={yH}
                stroke="#ef4444"
                strokeWidth={2}
                markerEnd="url(#io-arrow)"
              />
            )}
            {hasIn && (
              <>
                <line x1={x} y1={yX - R} x2={x} y2={yH + R} stroke="#6b7280" strokeWidth={1.4} />
                <circle cx={x} cy={yX} r={R} fill="#dcfce7" stroke="#16a34a" strokeWidth={1.4} />
              </>
            )}
            {hasOut && (
              <>
                <line x1={x} y1={yH - R} x2={x} y2={yY + R} stroke="#6b7280" strokeWidth={1.4} />
                <circle cx={x} cy={yY} r={R} fill="#fef9c3" stroke="#ca8a04" strokeWidth={1.4} />
              </>
            )}
            <circle cx={x} cy={yH} r={R} fill="#dbeafe" stroke="#2563eb" strokeWidth={1.4} />
          </g>
        );
      })}
      <text x={4} y={yY + 4} className="fill-gray-400 text-[8px] font-semibold">
        y
      </text>
      <text x={4} y={yH + 4} className="fill-gray-400 text-[8px] font-semibold">
        h
      </text>
      <text x={4} y={yX + 4} className="fill-gray-400 text-[8px] font-semibold">
        x
      </text>
      <text x={w / 2} y={h - 6} textAnchor="middle" className="fill-gray-400 text-[8px]">
        시간 →
      </text>
      <defs>
        <marker id="io-arrow" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill="#ef4444" />
        </marker>
      </defs>
    </svg>
  );
}

export default function IoStructures() {
  const [sel, setSel] = useState(2);
  const cur = SHAPES[sel];

  return (
    <section id="io-structures" className="scroll-mt-32">
      <SectionTitle
        title="응용 목적에 따른 RNN의 구조"
        subtitle="입·출력 요소의 대응 관계가 달라지면 같은 셀로 다른 문제를 풉니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.4.1 — 입·출력 관계에 따른 RNN의 다양한 구조(그림 12-23)",
            slides: "응용 목적에 따른 RNN의 구조 — 입출력 요소의 대응 관계",
          }}
        >
          <Card>
            <CardTitle>다섯 가지 구조 — 눌러서 전환</CardTitle>
            <p className="mb-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              기본적인 형태의 RNN은 매 시간 출력을 생성합니다. 하지만 RNN은{" "}
              <strong>응용 목적에 따라 입력 요소와 출력 요소의 대응 관계가 달라지며</strong>, 이에
              따라 다양한 변형된 구조를 가집니다.
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              {SHAPES.map((s, i) => (
                <Chip key={s.key} active={sel === i} onClick={() => setSel(i)}>
                  {s.ratio}
                </Chip>
              ))}
            </div>

            <div className="rounded-lg border border-red-100 bg-red-50/40 p-3 dark:border-red-900/50 dark:bg-red-950/20">
              <Scroller>
                <div className="mx-auto flex w-max justify-center">
                  <ShapeDiagram shape={cur} />
                </div>
              </Scroller>
              <p className="mt-2 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
                {cur.detail}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cur.apps.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-red-500 px-2.5 py-0.5 text-[11px] font-semibold text-white"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-[11px] font-semibold text-gray-500">다섯 구조를 한눈에</p>
              <Scroller>
                <div className="flex min-w-[520px] items-end gap-3">
                  {SHAPES.map((s, i) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setSel(i)}
                      className={`shrink-0 rounded-lg border p-2 transition-colors ${
                        i === sel
                          ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                          : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900"
                      }`}
                    >
                      <p
                        className={`mb-1 text-center text-[10px] font-bold ${
                          i === sel ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        {s.ratio}
                      </p>
                      <ShapeDiagram shape={s} small />
                    </button>
                  ))}
                </div>
              </Scroller>
            </div>

            <div className="mt-3">
              <Hint>
                파란 동그라미(은닉층)와 그 사이의 빨간 화살표는 다섯 구조에서 모두 같습니다.
                달라지는 것은 어느 시각에 입력을 넣고 어느 시각에서 출력을 꺼내는지뿐입니다.
              </Hint>
              <div className="mt-2">
                <ComputedNote>
                  뒤의 두 구조는 교재와 강의록 모두 똑같이 ‘m:n’으로만 적혀 있습니다. 둘을 눌러
                  구별할 수 있도록 괄호 안의 설명을 이 페이지에서 덧붙였습니다 — ‘시퀀스 →
                  시퀀스’는 교재의 “시퀀스를 시퀀스로 매칭하는 구조”에서 가져왔고, ‘매 시각
                  출력’은 그림에서 읽은 차이를 적은 것입니다.
                </ComputedNote>
              </div>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
