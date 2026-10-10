"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Hint, Scroller, Slider } from "./ui";
import { fmt } from "./rnnCore";

const T = 7;
const COL = 54;
const LEFT = 56;
const R = 12;
const W = LEFT + COL * (T - 1) + 24;
const Y_OUT = 28;
const Y_HID = 86;
const Y_IN = 144;

/** 민감도를 0~1 사이의 농도로 — 1이면 완전히 검게 */
function shade(v: number) {
  const g = Math.round(255 * (1 - Math.max(0, Math.min(1, v))));
  return `rgb(${g},${g},${g})`;
}

function Row({ values, outputs }: { values: number[]; outputs: number[] }) {
  return (
    <svg viewBox={`0 0 ${W} 170`} className="h-auto w-full" style={{ minWidth: 340 }}>
      <text x={4} y={Y_OUT + 4} className="fill-gray-500 text-[8.5px] font-semibold">
        출력층
      </text>
      <text x={4} y={Y_HID + 4} className="fill-gray-500 text-[8.5px] font-semibold">
        은닉층
      </text>
      <text x={4} y={Y_IN + 4} className="fill-gray-500 text-[8.5px] font-semibold">
        입력층
      </text>
      {Array.from({ length: T }, (_, i) => {
        const x = LEFT + i * COL;
        const s = values[i];
        const hasOut = outputs.includes(i);
        return (
          <g key={i}>
            {i < T - 1 && (
              <line
                x1={x + R}
                y1={Y_HID}
                x2={x + COL - R}
                y2={Y_HID}
                stroke="#6b7280"
                strokeWidth={1.4}
                markerEnd="url(#ltd-arrow)"
              />
            )}
            <line x1={x} y1={Y_IN - R} x2={x} y2={Y_HID + R} stroke="#9ca3af" strokeWidth={1.2} />
            <line x1={x} y1={Y_HID - R} x2={x} y2={Y_OUT + R} stroke="#9ca3af" strokeWidth={1.2} />
            <circle
              cx={x}
              cy={Y_IN}
              r={R}
              fill={i === 0 ? "#111827" : "#ffffff"}
              stroke="#374151"
              strokeWidth={1.4}
            />
            <circle cx={x} cy={Y_HID} r={R} fill={shade(s)} stroke="#374151" strokeWidth={1.4} />
            <circle
              cx={x}
              cy={Y_OUT}
              r={R}
              fill={hasOut ? shade(s) : "#ffffff"}
              stroke="#374151"
              strokeWidth={1.4}
            />
            <text x={x} y={166} textAnchor="middle" className="fill-gray-500 text-[9px] font-semibold">
              {i + 1}
            </text>
          </g>
        );
      })}
      <text x={18} y={166} className="fill-blue-500 text-[9px] font-semibold">
        시간
      </text>
      <defs>
        <marker id="ltd-arrow" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill="#6b7280" />
        </marker>
      </defs>
    </svg>
  );
}

export default function LongTermDependency() {
  const [decay, setDecay] = useState(0.5);
  const [forget, setForget] = useState(1);
  const [outputs, setOutputs] = useState<number[]>([3, 6]);

  // 시각 1의 입력이 시각 t의 은닉 상태에 남아 있는 정도
  const basic = Array.from({ length: T }, (_, i) => decay ** i);
  const lstm = Array.from({ length: T }, (_, i) => forget ** i);

  const toggleOut = (i: number) =>
    setOutputs((prev) => (prev.includes(i) ? prev.filter((v) => v !== i) : [...prev, i].sort()));

  return (
    <section id="long-term-dependency" className="scroll-mt-32">
      <SectionTitle
        title="장기 의존성 문제와 LSTM"
        subtitle="시간에 따른 입력 신호의 민감도 — 앞쪽 입력이 얼마나 남아 있는가"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.4.3 (1) LSTM — 시간에 따른 입력값에 대한 민감도(그림 12-26)",
            slides: "LSTM — 시간에 따른 입력 신호의 민감도",
          }}
        >
          <Card>
            <CardTitle>시각 1의 입력이 뒤까지 살아남는가</CardTitle>
            <p className="mb-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              기본 RNN은 입력이 순차적으로 들어오면 시간이 지남에 따라{" "}
              <strong>앞쪽의 입력 정보는 약해지고 사라집니다</strong>. 따라서 입력 요소가 시간적으로
              멀리 떨어져 있을 때 두 요소 간의 연관성 정보를 현재의 작업에서 활용할 수 없는{" "}
              <strong>장기 의존성(long-term dependency) 문제</strong>를 갖고 있습니다.
            </p>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div>
                <p className="mb-1 inline-block rounded bg-gray-800 px-2 py-0.5 text-[11px] font-bold text-white">
                  기본 RNN
                </p>
                <Scroller>
                  <Row values={basic} outputs={[0, 1, 2, 3, 4, 5, 6]} />
                </Scroller>
                <div className="mt-2">
                  <Slider
                    label="한 시각 지날 때 남는 비율"
                    value={decay}
                    min={0.1}
                    max={1}
                    step={0.05}
                    onChange={setDecay}
                    display={fmt(decay, 2)}
                  />
                </div>
                <div className="mt-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60">
                  <p className="text-[11px] leading-5 text-gray-600 dark:text-gray-300">
                    시각 7에 남은 민감도 ={" "}
                    <span className="font-mono font-bold text-red-500">
                      {fmt(decay, 2)}⁶ = {fmt(basic[6], 4)}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-1 inline-block rounded bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">
                  LSTM
                </p>
                <Scroller>
                  <Row values={lstm} outputs={outputs} />
                </Scroller>
                <div className="mt-2">
                  <Slider
                    label="망각 게이트 값 f (매 시각 동일하다고 가정)"
                    value={forget}
                    min={0.5}
                    max={1}
                    step={0.01}
                    onChange={setForget}
                    display={fmt(forget, 2)}
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10.5px] font-semibold text-gray-500">출력을 꺼낼 시각</span>
                  {Array.from({ length: T }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleOut(i)}
                      aria-pressed={outputs.includes(i)}
                      className={`h-6 w-6 rounded-full border text-[10px] font-bold transition-colors ${
                        outputs.includes(i)
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <div className="mt-2 rounded-lg bg-red-50/70 px-2.5 py-2 dark:bg-red-950/30">
                  <p className="text-[11px] leading-5 text-gray-600 dark:text-gray-300">
                    시각 7에 남은 민감도 ={" "}
                    <span className="font-mono font-bold text-red-500">
                      {fmt(forget, 2)}⁶ = {fmt(lstm[6], 4)}
                    </span>
                    {forget === 1 && " — 완전 기억이면 전혀 줄지 않습니다"}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              이러한 문제를 해결하기 위해서는 이전 시점에 얻어진 셀의 값이 다음 시점에 전달되는
              정도를 조정함으로써 <strong>시간의 흐름과 무관하게 셀의 정보를 원하는 만큼 기억할 수
              있어야</strong> 할 것입니다. 이런 기능의 구현을 통해 장기 의존성 문제의 해결을 위해
              고안된 순환 신경망 셀이 <strong>LSTM(Long Short Term Memory)</strong>입니다.
            </p>

            <div className="mt-3 space-y-2">
              <Hint>
                오른쪽 그림에서 은닉층이 계속 검은 것은 셀이 시각 1의 정보를 그대로 쥐고 있다는
                뜻이고, 출력층은 필요한 시각에만 검습니다 — 기억은 유지하되 출력은 골라서 낸다는
                것이 LSTM의 요지입니다. 망각 게이트 값을 1보다 낮추면 LSTM에서도 기억이 조금씩
                흐려지는 것을 볼 수 있습니다.
              </Hint>
              <ComputedNote>
                농도는 민감도를 ‘한 시각 지날 때 남는 비율의 거듭제곱’으로 계산한 값입니다. 교재와
                강의록의 그림은 농도만 보여 줄 뿐 수치를 제시하지 않으므로, 비율은 이 페이지에서
                조절할 수 있게 두었습니다. 기본값 0.5와 출력 시각 4·7은 교재 그림 12-26의 농도
                변화를 비슷하게 재현한 값입니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.4.3 (1) LSTM — 단기 기억과 장기 기억",
            slides: "LSTM — 해결 방법",
          }}
        >
          <Card>
            <CardTitle>LSTM이 하는 일</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              단순 RNN 셀과 달리 LSTM은 이름에서 알 수 있듯이{" "}
              <strong>단기 기억과 장기 기억(long-term memory) 기능을 모두 갖추고</strong> 있습니다.
              LSTM은 셀에 여러 종류의 메모리 게이트가 존재하여, 이를 통해 입력과 계산 결과를
              선별적으로 허용하여 각 입력값이 영향을 미칠 수 있는 범위를 확장시켜 장기 의존성 문제를
              해결합니다.
            </p>
            <div className="mt-2">
              <Hint>
                이러한 기능은 학습을 통해 손실 신호가 전달될 때도 마찬가지로 적용되어, 기본 RNN의
                학습에서 발생하는 <strong>기울기 소멸 문제도 어느 정도 해결</strong>할 수 있습니다.
                따라서 실제 순환 신경망을 사용할 때는 단순 RNN 셀보다는 LSTM 셀을 많이 사용합니다.
              </Hint>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
