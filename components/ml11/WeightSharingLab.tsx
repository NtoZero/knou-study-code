"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Hint, Scroller, Slider, num } from "./ui";
import { outSize } from "./cnn";

const COLORS = ["#dc2626", "#65a30d", "#0284c7"];

/** 입력 7노드 · 필터 3 · 출력 5노드로 부분연결과 가중치 공유를 보여 준다 */
function ConnectionDiagram({ full }: { full: boolean }) {
  const inN = 7;
  const f = 3;
  const outN = inN - f + 1;
  const W = 330;
  const H = 120;
  const ix = (i: number) => 24 + (i * (W - 48)) / (inN - 1);
  const ox = (i: number) => 24 + ((W - 48) * (i + 1)) / (outN + 1);
  const lines: { x1: number; x2: number; color: string }[] = [];
  if (full) {
    for (let o = 0; o < outN; o += 1)
      for (let i = 0; i < inN; i += 1) lines.push({ x1: ix(i), x2: ox(o), color: "#94a3b8" });
  } else {
    for (let o = 0; o < outN; o += 1)
      for (let k = 0; k < f; k += 1) lines.push({ x1: ix(o + k), x2: ox(o), color: COLORS[k] });
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[300px]">
      {lines.map((l, k) => (
        <line
          key={k}
          x1={l.x1}
          y1={28}
          x2={l.x2}
          y2={92}
          stroke={l.color}
          strokeWidth={full ? 0.6 : 1.6}
          opacity={full ? 0.5 : 0.9}
        />
      ))}
      {Array.from({ length: inN }, (_, i) => (
        <circle key={i} cx={ix(i)} cy={28} r={6} fill="#fff" stroke="#64748b" strokeWidth={1.4} />
      ))}
      {Array.from({ length: outN }, (_, i) => (
        <circle key={i} cx={ox(i)} cy={92} r={6} fill="#f7fee7" stroke="#65a30d" strokeWidth={1.4} />
      ))}
      <text x={6} y={31} fontSize="8.5" fill="#94a3b8">
        입력
      </text>
      <text x={6} y={95} fontSize="8.5" fill="#94a3b8">
        출력
      </text>
      <text x={W - 6} y={14} fontSize="8.5" textAnchor="end" fill={full ? "#64748b" : "#65a30d"}>
        {full ? `연결 ${inN * outN}개 · 가중치 ${inN * outN}개` : `연결 ${outN * f}개 · 가중치 ${f}개(공유)`}
      </text>
    </svg>
  );
}

export default function WeightSharingLab() {
  const [full, setFull] = useState(false);
  const [inN, setInN] = useState(6);
  const [inC, setInC] = useState(3);
  const [f, setF] = useState(3);
  const [nf, setNf] = useState(2);

  const outN = outSize(inN, f, 1, 0);
  const convW = nf * (f * f * inC);
  const convB = nf;
  const fcW = inN * inN * inC * (outN * outN * nf);
  const fcB = outN * outN * nf;
  const ratio = (fcW + fcB) / (convW + convB);

  return (
    <section id="weight-sharing" className="scroll-mt-32">
      <SectionTitle
        title="부분연결과 가중치 공유 — 가중치를 몇 개나 줄이는가"
        subtitle="같은 입력과 같은 출력 크기를 완전연결로 이었을 때와 직접 세어 비교합니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.3.1 — 부분연결과 가중치 공유",
            slides: "합성곱 신경망 — 부분적인 연결, 가중치 공유",
          }}
        >
          <Card>
            <CardTitle>출력 한 노드는 필터가 덮는 영역만 본다</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              콘볼루션층의 입력과 출력 결과인 특징맵은 각각 하나의 층으로 표현되는데, 출력(특징맵)의 각 노드는
              입력의 모든 노드와 가중치로 완전연결된 것이 아니라 <strong>필터가 적용되는 영역에 국한된 부분적인
              연결(local connection)</strong>을 가집니다. 또한 입력의 모든 노드에는 동일한 필터(가중치)가
              적용되는데, 이런 개념을 <strong>가중치 공유</strong>라고 합니다. 이처럼 층과 층 사이의 부분연결과
              가중치 공유 기법으로 인해 CNN에서 다루어야 할 가중치의 개수가 MLP에 비해 훨씬 적기 때문에 모델의
              복잡도도 크게 낮아집니다.
            </p>

            <div className="mb-2 mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFull(false)}
                aria-pressed={!full}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  !full
                    ? "border-lime-600 bg-lime-600 text-white"
                    : "border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                }`}
              >
                부분연결 + 가중치 공유 (콘볼루션층)
              </button>
              <button
                type="button"
                onClick={() => setFull(true)}
                aria-pressed={full}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  full
                    ? "border-gray-700 bg-gray-700 text-white"
                    : "border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                }`}
              >
                완전연결 (MLP)
              </button>
            </div>
            <Scroller>
              <ConnectionDiagram full={full} />
            </Scroller>
            <Hint>
              입력 7노드를 필터 3으로 훑어 출력 5노드를 만드는 1차원 예입니다. 색이 같은 선은{" "}
              <strong>같은 가중치 하나</strong>를 가리킵니다 — 출력 노드가 5개여도 학습할 가중치는 3개뿐입니다.
              완전연결로 바꾸면 선 하나하나가 모두 다른 가중치가 되어 35개가 됩니다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "12.3 — CNN의 복잡도가 낮아지는 이유 · 12.3.1 그림 12-15" }}>
          <Card>
            <CardTitle>2차원에서 직접 세어 보기</CardTitle>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
              <div className="space-y-2.5">
                <Slider label="입력 한 변" value={inN} min={4} max={28} step={1} onChange={setInN} display={`${inN}`} />
                <Slider label="입력 채널 수" value={inC} min={1} max={3} step={1} onChange={setInC} display={`${inC}`} />
                <Slider
                  label="필터 크기 f"
                  value={f}
                  min={1}
                  max={7}
                  step={2}
                  onChange={setF}
                  display={`${f}×${f}`}
                />
                <Slider label="필터 개수" value={nf} min={1} max={16} step={1} onChange={setNf} display={`${nf}개`} />
                <Hint>보폭 1, 패딩 없음으로 두었습니다. 바이어스도 함께 셉니다.</Hint>
              </div>

              <div className="space-y-3">
                <Scroller>
                  <table className="w-full min-w-[460px] text-[11.5px]">
                    <thead>
                      <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                        <th className="px-2 py-1.5 font-semibold">잇는 방식</th>
                        <th className="px-2 py-1.5 font-semibold">가중치 개수</th>
                        <th className="px-2 py-1.5 font-semibold">바이어스</th>
                        <th className="px-2 py-1.5 font-semibold">합계</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-2 py-1.5 font-semibold text-lime-700 dark:text-lime-400">
                          콘볼루션층
                          <span className="block font-mono text-[10px] font-normal text-gray-500">
                            {nf} × ({f}×{f}×{inC})
                          </span>
                        </td>
                        <td className="px-2 py-1.5 font-mono">{num(convW)}</td>
                        <td className="px-2 py-1.5 font-mono">{num(convB)}</td>
                        <td className="px-2 py-1.5 font-mono font-bold">
                          {num(convW + convB)}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-2 py-1.5 font-semibold text-gray-700 dark:text-gray-200">
                          완전연결
                          <span className="block font-mono text-[10px] font-normal text-gray-500">
                            ({inN}×{inN}×{inC}) × ({outN}×{outN}×{nf})
                          </span>
                        </td>
                        <td className="px-2 py-1.5 font-mono">{num(fcW)}</td>
                        <td className="px-2 py-1.5 font-mono">{num(fcB)}</td>
                        <td className="px-2 py-1.5 font-mono font-bold">{num(fcW + fcB)}</td>
                      </tr>
                    </tbody>
                  </table>
                </Scroller>

                <div className="rounded-lg border border-lime-200 bg-lime-50/60 p-3 dark:border-lime-900 dark:bg-lime-950/30">
                  <p className="text-[12.5px] leading-6 text-gray-800 dark:text-gray-100">
                    같은 입력 {inN}×{inN}×{inC}에서 같은 크기의 출력 {outN}×{outN}×{nf}를 만드는데, 완전연결은
                    콘볼루션층보다 가중치가{" "}
                    <span className="font-bold text-lime-700 dark:text-lime-300">
                      {ratio >= 1000 ? `${num(Math.round(ratio))}` : ratio.toFixed(1)}배
                    </span>{" "}
                    많습니다.
                  </p>
                </div>

                <ComputedNote>
                  가중치 개수는 이 페이지에서 정의대로 센 값입니다. 교재는 [그림 12-15]에서 6×6×3 입력에 3×3 필터
                  2개를 적용해 4×4×2를 얻는 예를 들고, 부분연결과 가중치 공유로 “가중치의 개수가 MLP에 비해 훨씬
                  적다”고 설명하지만 구체적인 개수는 제시하지 않습니다. 슬라이더를 교재의 값(입력 6, 채널 3, 필터
                  3×3, 2개)으로 두면 콘볼루션층 56개 대 완전연결 3,488개입니다.
                </ComputedNote>
              </div>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
