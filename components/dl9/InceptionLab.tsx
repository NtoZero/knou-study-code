"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight, GitBranch, Gauge, Layers3 } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Card, CardTitle, Formula, Slider, Tag } from "@/components/dlShared/ui";
import { Sourced } from "@/components/dlShared/SourceFilter";

type ModuleMode = "plain" | "reduced";

const directOps = 14 * 14 * 480 * 5 * 5 * 48;
const reducedOps = (channels: number) =>
  14 * 14 * 480 * channels + 14 * 14 * channels * 5 * 5 * 48;
const compact = (value: number) => (value / 1_000_000).toFixed(1);

const branches = [
  { key: "one", label: "1×1 합성곱", note: "채널별 특징 조합" },
  { key: "three", label: "3×3 합성곱", note: "작은 주변 영역" },
  { key: "five", label: "5×5 합성곱", note: "더 넓은 주변 영역" },
  { key: "pool", label: "3×3 최대 풀링", note: "강한 응답 보존" },
];

export default function InceptionLab() {
  const [mode, setMode] = useState<ModuleMode>("reduced");
  const [middleChannels, setMiddleChannels] = useState(16);
  const [showShape, setShowShape] = useState(true);
  const cost = reducedOps(middleChannels);

  return (
    <section id="inception-module" className="scroll-mt-32">
      <SectionTitle
        title="인셉션 모듈: 여러 크기의 시야를 병렬로 적용"
        subtitle="한 입력을 네 갈래로 처리하고, 각 갈래의 결과를 채널 방향으로 연결"
      />

      <Sourced refs={{ slides: "9강 강의록 7–9쪽 · 인셉션 모듈과 1×1 차원 축소", lecture: "27:13–27:33 · 1×1 합성곱으로 480개 채널을 16개로 줄이는 예" }}>
        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <CardTitle>갈래 구조를 바꿔 보세요</CardTitle>
              <div className="flex gap-2" role="group" aria-label="인셉션 모듈 형식">
                <button
                  type="button"
                  aria-pressed={mode === "plain"}
                  onClick={() => setMode("plain")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${mode === "plain" ? "bg-cyan-700 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}
                >일반형</button>
                <button
                  type="button"
                  aria-pressed={mode === "reduced"}
                  onClick={() => setMode("reduced")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${mode === "reduced" ? "bg-cyan-700 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}
                >차원 축소형</button>
              </div>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="grid min-w-[620px] grid-cols-[100px_1fr_105px] items-center gap-3">
                <div className="flex flex-col items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-2 py-4 text-center dark:border-sky-900 dark:bg-sky-950/40">
                  <Layers3 size={18} className="mb-1 text-sky-700 dark:text-sky-300" />
                  <span className="text-xs font-bold">이전 층</span>
                  <span className="mt-1 font-mono text-[10px] text-gray-500">14×14×480</span>
                </div>

                <div className="relative grid grid-rows-4 gap-2">
                  <svg aria-hidden="true" viewBox="0 0 600 360" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
                    {[45, 135, 225, 315].map((y) => <path key={y} d={`M 0 180 L 25 180 C 55 180, 55 ${y}, 90 ${y} L 500 ${y}`} fill="none" stroke={mode === "reduced" ? "#0891b2" : "#94a3b8"} strokeWidth="2" opacity="0.45" />)}
                    <path d="M 500 45 C 545 45, 545 180, 600 180 M 500 135 C 545 135, 545 180, 600 180 M 500 225 C 545 225, 545 180, 600 180 M 500 315 C 545 315, 545 180, 600 180" fill="none" stroke="#0891b2" strokeWidth="2" opacity="0.5" />
                  </svg>
                  {branches.map((branch, index) => (
                    <div key={branch.key} className="relative z-10 flex min-h-[74px] flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-xl border border-gray-200 bg-white/95 p-2 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900/95">
                      {mode === "reduced" && index > 0 && (
                        <span className="mb-1 rounded bg-cyan-50 px-1.5 py-0.5 text-[9px] font-bold text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-200">1×1 축소</span>
                      )}
                      <span className="text-[11px] font-bold leading-4">{branch.label}</span>
                      {mode === "reduced" && index === 3 && <span className="mt-1 text-[9px] text-cyan-700 dark:text-cyan-300">뒤에 1×1 투영</span>}
                      <span className="text-[9px] leading-4 text-gray-500">{branch.note}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 px-2 py-4 text-center dark:border-cyan-900 dark:bg-cyan-950/40">
                  <GitBranch size={18} className="mb-1 text-cyan-700 dark:text-cyan-300" />
                  <span className="text-xs font-bold">채널 연결</span>
                  <span className="mt-1 text-[10px] text-gray-500">concatenate</span>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-4 rounded-lg bg-gray-50 p-3 text-xs leading-6 text-gray-700 dark:bg-gray-800/70 dark:text-gray-300"
              >
                {mode === "plain" ? (
                  <><strong>일반형</strong>은 1×1·3×3·5×5 합성곱과 3×3 최대 풀링을 병렬로 적용합니다. 큰 필터의 연산이 입력의 많은 채널에 직접 적용되어 계산량이 커질 수 있습니다.</>
                ) : (
                  <><strong>차원 축소형</strong>은 3×3·5×5 합성곱 앞에 1×1 합성곱을 두어 채널 수를 먼저 줄입니다. 풀링 뒤에도 1×1 투영을 두며, 네 갈래 출력은 채널 방향으로 연결합니다.</>
                )}
              </motion.div>
            </AnimatePresence>

            <button type="button" onClick={() => setShowShape((value) => !value)} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-700 hover:text-cyan-900 dark:text-cyan-300">
              <ArrowDown size={14} className={`transition-transform ${showShape ? "rotate-180" : ""}`} />
              출력 크기 규칙 {showShape ? "접기" : "보기"}
            </button>
            <AnimatePresence initial={false}>
              {showShape && (
                <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 overflow-hidden text-[11px] leading-5 text-gray-500">
                  강의 실습 코드에서는 합성곱에 <code>padding='same'</code>, 풀링에 보폭 1과 같은 패딩을 둡니다. 그래서 연결 직전 네 갈래의 가로·세로가 맞고, 채널 수만 이어 붙일 수 있습니다.
                </motion.p>
              )}
            </AnimatePresence>
          </Card>

          <Card className="min-w-0 border-cyan-200 dark:border-cyan-900">
            <div className="mb-3 flex items-center gap-2">
              <Gauge size={17} className="text-cyan-700 dark:text-cyan-300" />
              <CardTitle>5×5 갈래의 연산량 비교</CardTitle>
            </div>
            <p className="mb-4 text-[11px] leading-5 text-gray-500">
              강의 예시의 입력 14×14×480, 출력 채널 48을 사용합니다. 슬라이더로 중간 채널 수를 바꾸면 1×1 축소가 먼저 들어갈 때의 계산을 다시 합니다.
            </p>
            <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/70">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">직접 5×5 합성곱</p>
              <p className="mt-1 font-mono text-sm font-bold text-gray-800 dark:text-gray-100">14×14×480×5×5×48</p>
              <p className="mt-1 text-lg font-extrabold text-rose-600 dark:text-rose-300">{compact(directOps)}M</p>
            </div>
            <div className="mt-3 rounded-xl border border-cyan-100 bg-cyan-50/70 p-3 dark:border-cyan-900/60 dark:bg-cyan-950/30">
              <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">1×1 축소를 거친 두 연산</p>
              <p className="mt-1 font-mono text-[11px] leading-5 text-gray-700 dark:text-gray-300">14×14×480×{middleChannels} + 14×14×{middleChannels}×5×5×48</p>
              <p className="mt-1 text-lg font-extrabold text-cyan-800 dark:text-cyan-200">{compact(cost)}M</p>
            </div>
            <div className="mt-4">
              <Slider label="1×1 축소 뒤 채널 수" value={middleChannels} min={8} max={64} step={8} onChange={setMiddleChannels} display={`${middleChannels}개`} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Tag tone="teal">H×W는 유지</Tag>
              <Tag>채널 480 → {middleChannels} → 48</Tag>
            </div>
            <Formula className="mt-4" note="교재·강의 예시는 곱셈 수 기준으로 비교">
              16채널일 때 {compact(reducedOps(16))}M ≈ 강의 예시의 5.3M
            </Formula>
            <p className="mt-3 text-[10px] leading-5 text-gray-500">
              필터 수를 지나치게 줄이면 표현 능력이 달라질 수 있으므로, 여기서는 계산량 변화만 비교합니다.
            </p>
          </Card>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-5 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
          <ArrowRight size={14} className="mt-0.5 shrink-0" />
          <p><strong>읽는 순서:</strong> 여러 필터 크기가 서로 다른 크기의 특징을 찾고, 1×1 합성곱이 큰 필터 앞의 입력 채널 수를 줄여 연산량을 낮춥니다. 이게 GoogLeNet의 인셉션 모듈이 병렬성과 계산 효율을 함께 다루는 방식입니다.</p>
        </div>
      </Sourced>
    </section>
  );
}
