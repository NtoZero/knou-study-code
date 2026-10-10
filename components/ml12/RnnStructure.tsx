"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, Formula, Hint, Scroller } from "./ui";

const W = 300;
const H = 230;
const IN_Y = 190;
const HID_Y = 115;
const OUT_Y = 40;
const XS3 = [80, 150, 220];
const XS2 = [115, 185];
const R = 13;

function Layer({
  xs,
  y,
  fill,
  stroke,
  labels,
}: {
  xs: number[];
  y: number;
  fill: string;
  stroke: string;
  labels?: string[];
}) {
  return (
    <>
      {xs.map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={y} r={R} fill={fill} stroke={stroke} strokeWidth={1.5} />
          {labels && (
            <text
              x={x}
              y={y + 3.5}
              textAnchor="middle"
              className="fill-gray-700 text-[9px] font-semibold dark:fill-gray-200"
            >
              {labels[i]}
            </text>
          )}
        </g>
      ))}
    </>
  );
}

function Edges({ from, fromY, to, toY }: { from: number[]; fromY: number; to: number[]; toY: number }) {
  return (
    <>
      {from.map((a) =>
        to.map((b) => (
          <line
            key={`${a}-${b}`}
            x1={a}
            y1={fromY - R}
            x2={b}
            y2={toY + R}
            stroke="currentColor"
            className="text-gray-300 dark:text-gray-600"
            strokeWidth={1}
          />
        )),
      )}
    </>
  );
}

function Diagram({ recurrent }: { recurrent: boolean }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[260px]">
      <Edges from={XS3} fromY={IN_Y} to={XS3} toY={HID_Y} />
      <Edges from={XS3} fromY={HID_Y} to={XS2} toY={OUT_Y} />

      {recurrent && (
        <g>
          {/* 은닉 노드 사이의 순환 에지 — 직전에 발생한 정보를 현재의 입력으로 전달 */}
          {XS3.map((x) => (
            <path
              key={`self-${x}`}
              d={`M ${x - 6} ${HID_Y - R + 2} C ${x - 24} ${HID_Y - 36}, ${x + 24} ${HID_Y - 36}, ${x + 6} ${HID_Y - R + 2}`}
              fill="none"
              stroke="#ef4444"
              strokeWidth={2.4}
              markerEnd="url(#arrow-red)"
            />
          ))}
          <path
            d={`M ${XS3[2]} ${HID_Y + R} C ${XS3[2]} ${HID_Y + 42}, ${XS3[0]} ${HID_Y + 42}, ${XS3[0]} ${HID_Y + R}`}
            fill="none"
            stroke="#ef4444"
            strokeWidth={2.4}
            markerEnd="url(#arrow-red)"
          />
          <text x={W / 2} y={HID_Y + 54} textAnchor="middle" className="fill-red-500 text-[10px] font-bold">
            W_hh — 순환 에지
          </text>
        </g>
      )}

      <defs>
        <marker id="arrow-red" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill="#ef4444" />
        </marker>
      </defs>

      <Layer xs={XS3} y={IN_Y} fill="#dcfce7" stroke="#16a34a" />
      <Layer xs={XS3} y={HID_Y} fill="#dbeafe" stroke="#2563eb" />
      <Layer xs={XS2} y={OUT_Y} fill="#fef9c3" stroke="#ca8a04" />

      <text x={16} y={IN_Y + 4} className="fill-gray-500 text-[9.5px] font-semibold">
        입력층 x
      </text>
      <text x={16} y={HID_Y + 4} className="fill-gray-500 text-[9.5px] font-semibold">
        은닉층 h
      </text>
      <text x={16} y={OUT_Y + 4} className="fill-gray-500 text-[9.5px] font-semibold">
        출력층 y
      </text>
      <text x={252} y={(IN_Y + HID_Y) / 2} className="fill-gray-400 text-[9px] font-semibold">
        W_xh
      </text>
      <text x={252} y={(HID_Y + OUT_Y) / 2} className="fill-gray-400 text-[9px] font-semibold">
        W_hy
      </text>
    </svg>
  );
}

export default function RnnStructure() {
  const [mode, setMode] = useState<"both" | "feed" | "recur">("both");

  return (
    <section id="rnn-structure" className="scroll-mt-32">
      <SectionTitle
        title="기본적인 RNN의 구조"
        subtitle="전방향 신경망과 무엇이 다른지 — 정보 전달 방향에서의 차이"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.4.1 — 전방향 신경망과 순환 신경망의 구조 비교(그림 12-19)",
            slides: "기본적인 RNN의 구조 — 정보 전달 방향에서의 차이",
          }}
        >
          <Card>
            <CardTitle>전방향 신경망 vs 순환 신경망</CardTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              <Chip active={mode === "both"} onClick={() => setMode("both")}>
                나란히 보기
              </Chip>
              <Chip active={mode === "feed"} onClick={() => setMode("feed")}>
                전방향 신경망만
              </Chip>
              <Chip active={mode === "recur"} onClick={() => setMode("recur")}>
                순환 신경망만
              </Chip>
            </div>

            <div
              className={`grid gap-4 ${mode === "both" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}
            >
              {mode !== "recur" && (
                <div>
                  <p className="mb-1 text-center text-[12px] font-bold text-gray-600 dark:text-gray-300">
                    전방향 신경망
                  </p>
                  <Scroller>
                    <Diagram recurrent={false} />
                  </Scroller>
                  <p className="mt-1 text-center text-[11px] text-gray-500">
                    정보의 흐름이 한 방향으로만 흐름
                  </p>
                </div>
              )}
              {mode !== "feed" && (
                <div>
                  <p className="mb-1 text-center text-[12px] font-bold text-red-500">순환 신경망</p>
                  <Scroller>
                    <Diagram recurrent />
                  </Scroller>
                  <p className="mt-1 text-center text-[11px] text-gray-500">
                    은닉 노드 사이에 가중치를 갖는 에지가 존재
                  </p>
                </div>
              )}
            </div>

            <p className="mt-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              순환 신경망은 입력층, 하나의 은닉층, 그리고 출력층을 가진 전형적인 MLP의 구조와
              유사하지만 <strong>정보가 전달되는 방향에서 차이</strong>가 있습니다. MLP는 정보의
              흐름이 한 방향으로만 흐르는 전방향 신경망이지만, RNN은 은닉 노드 사이에 가중치를 갖는
              에지가 존재해서 <strong>직전에 발생한 정보를 현재의 입력으로 전달</strong>합니다.
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.4.1 — 식 12-8, 은닉층의 상태",
            slides: "기본적인 RNN의 구조 — 특정 시간 t에서의 은닉층의 상태",
          }}
        >
          <Card>
            <CardTitle>특정 시간 t에서의 은닉층의 상태</CardTitle>
            <p className="mb-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              순환 에지를 가진 노드는 특정 시간 t에서 입력 <strong>x_t</strong>(입력 데이터의 t번째
              요소)와 직전의 상태 정보 <strong>h_(t−1)</strong>을 함께 입력으로 받아서 새로운 상태{" "}
              <strong>h_t</strong>를 생성합니다.
            </p>
            <Formula note="식 12-8">h_t = f_W( h_(t−1), x_t )</Formula>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/60">
                <p className="text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  <strong className="text-gray-800 dark:text-gray-100">h_(t−1)</strong> — 시간의
                  흐름에 따라 시간 t 이전에 신경망에 누적되고 기억된 정보
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/60">
                <p className="text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                  <strong className="text-gray-800 dark:text-gray-100">W = (W_xh, W_hh, W_hy)</strong>{" "}
                  — RNN의 가중치 집합
                </p>
              </div>
            </div>
            <div className="mt-3">
              <Hint>
                이 구조를 “vanilla RNN”이라고도 부릅니다. 가중치 집합 W가 세 덩어리로 나뉘는 것에
                주목하세요. 입력에서 은닉으로(W_xh), 은닉에서 은닉으로(W_hh), 은닉에서
                출력으로(W_hy) — 이 가운데 W_hh가 순환 에지의 가중치입니다.
              </Hint>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
