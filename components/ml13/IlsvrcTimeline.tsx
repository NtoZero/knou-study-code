"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, Formula, Hint, Scroller, num } from "./ui";

/**
 * 13.1.2 객체인식을 위한 CNN 모델 — ILSVRC 결과표.
 * 연도·모델명·층수·Top-5 오류율은 강의록 ILSVRC 표의 값 그대로다.
 */

interface Row {
  year: number;
  place: string;
  name: string;
  layers: number | null;
  error: number;
  deep: boolean;
  note?: string;
}

const ROWS: Row[] = [
  { year: 2010, place: "—", name: "기존 방법", layers: null, error: 28.2, deep: false },
  { year: 2011, place: "—", name: "기존 방법", layers: null, error: 25.8, deep: false },
  {
    year: 2012,
    place: "Winner",
    name: "SuperVision (AlexNet)",
    layers: 8,
    error: 16.4,
    deep: true,
    note: "딥러닝 모델이 처음 우승. 2위와 비교해도 성능이 월등히 우수해 큰 주목을 받았다.",
  },
  { year: 2013, place: "Winner", name: "ZFNet", layers: 8, error: 11.7, deep: true },
  {
    year: 2014,
    place: "Runner-up",
    name: "VGG-19",
    layers: 19,
    error: 7.3,
    deep: true,
    note: "층수와 필터 크기에 차이를 둔 여러 버전을 공개 소스로 제공해 지금도 널리 활용된다.",
  },
  {
    year: 2014,
    place: "Winner",
    name: "GoogLeNet",
    layers: 22,
    error: 6.7,
    deep: true,
    note: "인셉션 모듈이라는 특이한 구조로 22층의 깊은 모델을 효율적으로 표현했다.",
  },
  {
    year: 2015,
    place: "Winner",
    name: "ResNet",
    layers: 152,
    error: 3.57,
    deep: true,
    note: "잔차 모듈과 스킵 연결로 층수를 152개까지 확장했다. 사람의 인식에 버금가는 성능.",
  },
];

type View = "error" | "layers";

const W = 520;
const H = 230;
const PAD = { l: 44, r: 14, t: 16, b: 46 };
const INNER_W = W - PAD.l - PAD.r;
const INNER_H = H - PAD.t - PAD.b;

function pct(a: number, b: number) {
  return (((a - b) / a) * 100).toFixed(1);
}

export default function IlsvrcTimeline() {
  const [view, setView] = useState<View>("error");
  const [sel, setSel] = useState<number>(6);

  const maxError = 30;
  const maxLayers = 160;
  const barW = INNER_W / ROWS.length;
  const row = ROWS[sel];

  return (
    <section id="ilsvrc" className="scroll-mt-32">
      <SectionTitle
        title="ILSVRC — 객체인식 모델의 계보"
        subtitle="딥러닝이 들어온 2012년을 전후로 오류율이 어떻게 달라졌는지 원문 수치로 봅니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "13.1.2 객체인식을 위한 CNN 모델",
            slides: "객체인식과 ILSVRC",
          }}
        >
          <Card>
            <CardTitle>ILSVRC와 ImageNet</CardTitle>
            <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              <strong>ILSVRC</strong>(ImageNet Large-Scale Visual Recognition Challenge)는 ImageNet
              이라는 대규모 영상 데이터베이스를 이용한, 객체 분류 및 위치 탐지를 위한 일종의{" "}
              <strong>객체인식 경진대회</strong>다. 2010년에 시작하여 매년 열린다.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
                <p className="text-[11px] text-gray-500">ImageNet의 클래스 수</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {num(1000)}개
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
                <p className="text-[11px] text-gray-500">영상 + 클래스 레이블</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">120만 개</p>
              </div>
            </div>
            <Hint>
              세분화된 동물의 종을 비롯하여 객체의 종류가 다양할 뿐 아니라, 배경이나 객체의 위치 등도
              별도의 제약 없이 촬영된 영상이다. 교재는 “1,000개의 클래스로 구성된 120만 개 이상의 영상
              데이터”라고 적는다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "ILSVRC — 2010 시작 → 2012년부터 딥러닝 모델이 우승을 차지",
            textbook: "13.1.2 객체인식을 위한 CNN 모델",
          }}
        >
          <Card>
            <div className="mb-3 flex flex-wrap gap-1.5">
              <Chip active={view === "error"} onClick={() => setView("error")}>
                Top-5 오류율
              </Chip>
              <Chip active={view === "layers"} onClick={() => setView("layers")}>
                층수
              </Chip>
            </div>

            <Scroller>
              <svg
                width={W}
                height={H}
                viewBox={`0 0 ${W} ${H}`}
                className="min-w-[460px]"
                role="img"
                aria-label="연도별 Top-5 오류율과 층수"
              >
                {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                  const y = PAD.t + INNER_H * (1 - t);
                  const label =
                    view === "error"
                      ? (maxError * t).toFixed(0)
                      : (maxLayers * t).toFixed(0);
                  return (
                    <g key={t}>
                      <line
                        x1={PAD.l}
                        x2={W - PAD.r}
                        y1={y}
                        y2={y}
                        stroke="currentColor"
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth={1}
                      />
                      <text
                        x={PAD.l - 6}
                        y={y + 3}
                        textAnchor="end"
                        fontSize={9}
                        className="fill-gray-400"
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}

                {ROWS.map((r, i) => {
                  const value = view === "error" ? r.error : (r.layers ?? 0);
                  const maxV = view === "error" ? maxError : maxLayers;
                  const h = (value / maxV) * INNER_H;
                  const x = PAD.l + i * barW + barW * 0.18;
                  const bw = barW * 0.64;
                  const active = i === sel;
                  const color = r.deep ? (active ? "#1d4ed8" : "#60a5fa") : "#cbd5e1";
                  return (
                    <g
                      key={`${r.year}-${r.name}`}
                      onClick={() => setSel(i)}
                      className="cursor-pointer"
                    >
                      <motion.rect
                        initial={false}
                        animate={{ y: PAD.t + INNER_H - h, height: Math.max(h, 1) }}
                        x={x}
                        width={bw}
                        fill={color}
                        rx={2}
                      />
                      {view === "layers" && r.layers === null && (
                        <text
                          x={x + bw / 2}
                          y={PAD.t + INNER_H - 6}
                          textAnchor="middle"
                          fontSize={9}
                          className="fill-gray-400"
                        >
                          —
                        </text>
                      )}
                      <text
                        x={x + bw / 2}
                        y={PAD.t + INNER_H - h - 4}
                        textAnchor="middle"
                        fontSize={9.5}
                        fontWeight={700}
                        className="fill-gray-600 dark:fill-gray-300"
                      >
                        {view === "error" ? r.error : (r.layers ?? "")}
                      </text>
                      <text
                        x={x + bw / 2}
                        y={H - PAD.b + 14}
                        textAnchor="middle"
                        fontSize={9.5}
                        className="fill-gray-500"
                      >
                        {r.year}
                      </text>
                      <text
                        x={x + bw / 2}
                        y={H - PAD.b + 26}
                        textAnchor="middle"
                        fontSize={8.5}
                        fontWeight={active ? 700 : 400}
                        className={active ? "fill-blue-600" : "fill-gray-400"}
                      >
                        {r.name.replace("SuperVision (AlexNet)", "AlexNet")}
                      </text>
                    </g>
                  );
                })}

                <line
                  x1={PAD.l + 2 * barW}
                  x2={PAD.l + 2 * barW}
                  y1={PAD.t}
                  y2={PAD.t + INNER_H}
                  stroke="#dc2626"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                />
                <text
                  x={PAD.l + 2 * barW + 4}
                  y={PAD.t + 10}
                  fontSize={9}
                  fill="#dc2626"
                  fontWeight={700}
                >
                  2012 — 딥러닝 진입
                </text>
              </svg>
            </Scroller>

            <div className="mt-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
              <p className="text-[12px] font-bold text-gray-800 dark:text-gray-100">
                {row.year} · {row.place} · {row.name}
                {row.layers !== null && <span className="ml-1.5">— {row.layers}층</span>}
                <span className="ml-1.5 text-blue-600 dark:text-blue-400">
                  Top-5 오류율 {row.error}%
                </span>
              </p>
              {row.note && (
                <p className="mt-1 text-[12px] leading-6 text-gray-600 dark:text-gray-300">
                  {row.note}
                </p>
              )}
              {!row.deep && (
                <p className="mt-1 text-[12px] leading-6 text-gray-600 dark:text-gray-300">
                  강의록은 ILSVRC가 2010년에 시작되어 <strong>2012년부터 딥러닝 모델이 우승을
                  차지</strong>했다고 적는다. 이 행은 그 이전 해의 Top-5 오류율로, 모델 이름 없이
                  연도와 수치만 적혀 있다.
                </p>
              )}
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "ILSVRC · ResNet — Revolution of Depth",
            textbook: "13.1.2 객체인식을 위한 CNN 모델",
          }}
        >
          <Card>
            <CardTitle>표의 숫자를 실제로 빼 보면</CardTitle>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Formula note="2011년 기존 방법 → 2012년 AlexNet">
                25.8 − 16.4 = 9.4%p
                <br />
                <span className="text-[11px]">→ {pct(25.8, 16.4)}% 감소</span>
              </Formula>
              <Formula note="2014년 GoogLeNet → 2015년 ResNet">
                6.7 − 3.57 = 3.13%p
                <br />
                <span className="text-[11px]">→ {pct(6.7, 3.57)}% 감소</span>
              </Formula>
              <Formula note="2012년 AlexNet → 2015년 ResNet">
                16.4 − 3.57 = 12.83%p
                <br />
                <span className="text-[11px]">→ {pct(16.4, 3.57)}% 감소</span>
              </Formula>
            </div>
            <Hint>
              가운데 칸이 교재가 말하는 지점이다. “ResNet-152 모델의 성능은 오류율 3.57%로,
              GoogLeNet의 오류율 6.7%를 50% 정도에 가깝게 감소시켰으며, 사람의 인식에 버금가는 성능을
              보였다.” 실제로 빼 보면 {pct(6.7, 3.57)}% 감소로, ‘50%에 가깝게’라는 표현과 맞는다.
            </Hint>
            <div className="mt-3">
              <ComputedNote>
                감소율(%)은 원자료에 적힌 수치가 아니라, 표의 오류율 값으로 이 화면에서 계산한
                값입니다. 오류율·층수·연도는 모두 원문 값 그대로입니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{ slides: "AlexNet — 인식 결과" }}
        >
          <Card>
            <CardTitle>Top-5 오류율이란 무엇을 센 것인가</CardTitle>
            <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              강의록의 AlexNet 인식 결과 그림은 영상 한 장마다 후보 레이블을{" "}
              <strong>다섯 개씩</strong> 막대와 함께 보여 준다. 예를 들어 표범(leopard) 영상에 대해
              모델은 leopard · jaguar · cheetah · snow leopard · Egyptian cat을 후보로 내고, 그중
              leopard에 가장 큰 값을 준다.
            </p>
            <Scroller>
              <div className="mt-3 min-w-[300px] space-y-1">
                {[
                  { label: "leopard", v: 0.85, hit: true },
                  { label: "jaguar", v: 0.08, hit: false },
                  { label: "cheetah", v: 0.04, hit: false },
                  { label: "snow leopard", v: 0.02, hit: false },
                  { label: "Egyptian cat", v: 0.01, hit: false },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-2">
                    <span className="w-24 shrink-0 text-right text-[11px] text-gray-500">
                      {c.label}
                    </span>
                    <div className="h-3 flex-1 rounded-sm bg-gray-100 dark:bg-gray-800">
                      <div
                        className={`h-3 rounded-sm ${c.hit ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}
                        style={{ width: `${c.v * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Scroller>
            <ComputedNote>
              막대 길이는 그림의 모양을 옮긴 것으로, 원자료에 숫자로 적혀 있지는 않습니다. 후보를
              다섯 개 내보인다는 점과 정답 레이블(leopard 등)은 강의록 그림 그대로입니다.
            </ComputedNote>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
