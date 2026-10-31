"use client";

import { useMemo, useState } from "react";
import { Shuffle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import {
  Card,
  CardTitle,
  Chip,
  ComputedNote,
  ConceptRows,
  Hint,
  P,
  Scroller,
  Slider,
  makeRng,
} from "./ui";

/**
 * 14.2.1 Q-학습 — 행동 선택을 위한 전략(탐험 vs 탐사)과 엡실론 탐욕 방법.
 * 감소하는 ε = 0.1/(t + 1)은 교재·강의록 그대로이고, 고정 ε 비교와 난수 시드는 이 화면의 설정이다.
 */

const STEPS = 60;

function epsDecay(t: number): number {
  return 0.1 / (t + 1);
}

export default function ExplorationLab() {
  const [t, setT] = useState(0);
  const [mode, setMode] = useState<"decay" | "fixed">("decay");
  const [fixedEps, setFixedEps] = useState(0.3);
  const [seed, setSeed] = useState(1);

  // 시드를 고정했으므로 서버·클라이언트 렌더 결과가 같다
  const draws = useMemo(() => {
    const rnd = makeRng(seed * 7919 + (mode === "fixed" ? Math.round(fixedEps * 100) : 0));
    return Array.from({ length: STEPS }, (_, i) => {
      const e = mode === "decay" ? epsDecay(i) : fixedEps;
      return rnd() < e;
    });
  }, [seed, mode, fixedEps]);

  const explored = draws.filter(Boolean).length;
  const firstHalf = draws.slice(0, STEPS / 2).filter(Boolean).length;
  const secondHalf = explored - firstHalf;

  // 한 번 뽑은 표본은 탐험이 0~1회라 줄어드는 경향이 잘 안 보인다 — 구간별 기댓값 Σε를 함께 보인다
  const epsAt = (i: number) => (mode === "decay" ? epsDecay(i) : fixedEps);
  const expFirst = Array.from({ length: STEPS / 2 }, (_, i) => epsAt(i)).reduce((a, b) => a + b, 0);
  const expSecond = Array.from({ length: STEPS / 2 }, (_, i) => epsAt(i + STEPS / 2)).reduce((a, b) => a + b, 0);

  // ε 곡선
  const W = 420;
  const H = 130;
  const tMax = 30;
  const px = (x: number) => 30 + (x / tMax) * (W - 40);
  const py = (y: number) => H - 20 - (y / 0.1) * (H - 35);
  const curve = Array.from({ length: tMax + 1 }, (_, i) => `${px(i)},${py(epsDecay(i))}`).join(" ");

  return (
    <section id="epsilon-greedy" className="scroll-mt-32">
      <SectionTitle
        title="행동 선택을 위한 전략 — 탐험 vs 탐사"
        subtitle="알고리즘 ③-1 ‘행동 a를 선택한다’를 구체적으로 어떻게 할 것인가"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "14.2.1 Q-학습 — 탐험과 탐사", slides: "행동 선택을 위한 전략" }}>
          <Card>
            <CardTitle>탐험 exploration vs 탐사 exploitation</CardTitle>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-amber-300 bg-amber-50/60 p-3 dark:border-amber-800 dark:bg-amber-950/30">
                <p className="text-[12px] font-bold text-amber-700 dark:text-amber-300">탐험 exploration</p>
                <p className="mt-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                  탐색공간 전체를 골고루 찾음 → <strong>랜덤하게 다른 행동을 선택</strong>
                </p>
              </div>
              <div className="rounded-lg border border-cyan-300 bg-cyan-50/60 p-3 dark:border-cyan-800 dark:bg-cyan-950/30">
                <p className="text-[12px] font-bold text-cyan-700 dark:text-cyan-300">탐사 exploitation</p>
                <p className="mt-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                  특정한 곳을 중심으로 주변을 집중적으로 찾음 →{" "}
                  <strong>현재의 Q-함수 정보를 바탕으로 최적의 행동을 선택</strong>
                </p>
              </div>
            </div>
            <div className="mt-3">
              <ConceptRows
                rows={[
                  {
                    k: "직관",
                    v: "미로에서 랜덤하게 시작하더라도 일단 하나의 경로가 찾아지고 나면, 그 후에 탐사만 한다면 해당 경로만 계속해서 찾아지는 문제가 생긴다. 그래서 두 전략을 적절히 혼합해서 사용해야 한다.",
                  },
                  {
                    k: "예시",
                    v: "앞의 Q-테이블에서 긴 경로를 먼저 찾았다면 상태 11의 Q̂(11, L)만 양수다. 탐사만 하면 계속 L을 골라, 더 짧은 D(11 → 15) 쪽은 영영 시도되지 않는다.",
                  },
                  {
                    k: "오답 기준",
                    v: "‘탐사 = 넓게 둘러보기’로 바꿔 기억하면 틀린다. 넓게 골고루 찾는 쪽이 탐험(exploration), 현재 Q-함수로 최선을 고르는 쪽이 탐사(exploitation)다.",
                  },
                ]}
              />
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "14.2.1 Q-학습 — 엡실론 탐욕 방법", slides: "행동 선택을 위한 전략 — 엡실론 탐욕" }}>
          <Card>
            <CardTitle>혼합된 선택 전략 → 엡실론 탐욕 ε-greedy</CardTitle>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-[12px] leading-6 text-slate-100">
{`For time t during learning
  ε = 0.1/(t + 1)
  if rand(1) < ε
    randomly select a     `}<span className="text-amber-300"># 탐험</span>{`
  else
    a = argmax Q(s, a)    `}<span className="text-cyan-300"># 탐사</span>
              </pre>
              <div className="min-w-0">
                <P>
                  ε의 확률로 탐험을, 1 − ε의 확률로 탐사를 적용한다. 여기서 ε는 고정값이 아니라 학습이
                  진행됨에 따라 점차 줄어든다.
                </P>
                <div className="mt-2">
                  <Slider
                    label="학습 시점 t"
                    value={t}
                    min={0}
                    max={tMax}
                    step={1}
                    onChange={setT}
                    display={`t = ${t}`}
                  />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-md bg-amber-50 p-2 dark:bg-amber-950/40">
                    <p className="text-[10.5px] text-amber-700 dark:text-amber-300">탐험 확률 ε</p>
                    <p className="font-mono text-[14px] font-bold text-gray-800 dark:text-gray-100">
                      0.1/({t} + 1) = {epsDecay(t).toFixed(4)}
                    </p>
                  </div>
                  <div className="rounded-md bg-cyan-50 p-2 dark:bg-cyan-950/40">
                    <p className="text-[10.5px] text-cyan-700 dark:text-cyan-300">탐사 확률 1 − ε</p>
                    <p className="font-mono text-[14px] font-bold text-gray-800 dark:text-gray-100">
                      {(1 - epsDecay(t)).toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Scroller>
              <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full min-w-[380px]" role="img" aria-label="시점에 따른 ε의 감소">
                <line x1="30" y1={H - 20} x2={W - 10} y2={H - 20} className="stroke-gray-300 dark:stroke-gray-700" />
                <line x1="30" y1="10" x2="30" y2={H - 20} className="stroke-gray-300 dark:stroke-gray-700" />
                {[0, 0.05, 0.1].map((v) => (
                  <text key={v} x="26" y={py(v) + 3} textAnchor="end" className="fill-gray-400 text-[9px]">
                    {v}
                  </text>
                ))}
                {[0, 10, 20, 30].map((v) => (
                  <text key={v} x={px(v)} y={H - 6} textAnchor="middle" className="fill-gray-400 text-[9px]">
                    t={v}
                  </text>
                ))}
                <polyline points={curve} fill="none" className="stroke-amber-500" strokeWidth="2" />
                <circle cx={px(t)} cy={py(epsDecay(t))} r="5" className="fill-amber-500" />
              </svg>
            </Scroller>
            <Hint>
              시간이 지남에 따라 t가 커지므로 ε는 처음에는 큰 값에서 출발해 점차 작은 값으로 줄어든다. 즉
              탐험의 정도는 줄어들고, 상대적으로 탐사의 정도가 늘어난다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "14.2.1 Q-학습 — 엡실론 탐욕 방법" }}>
          <Card>
            <CardTitle>60번 행동을 골라 보면</CardTitle>
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              <Chip active={mode === "decay"} onClick={() => setMode("decay")}>
                ε = 0.1/(t + 1)
              </Chip>
              <Chip active={mode === "fixed"} onClick={() => setMode("fixed")}>
                고정된 ε
              </Chip>
              <button
                type="button"
                onClick={() => setSeed((s) => s + 1)}
                className="ml-auto inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Shuffle size={12} /> rand(1) 다시 뽑기
              </button>
            </div>
            {mode === "fixed" && (
              <div className="mb-3 max-w-xs">
                <Slider
                  label="고정 ε"
                  value={fixedEps}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={setFixedEps}
                  display={fixedEps.toFixed(2)}
                />
              </div>
            )}
            <Scroller>
              <div className="grid min-w-[420px] grid-cols-[repeat(30,minmax(0,1fr))] gap-0.5">
                {draws.map((e, i) => (
                  <div
                    key={i}
                    title={`t = ${i}: ${e ? "탐험" : "탐사"}`}
                    className={`h-5 rounded-sm ${e ? "bg-amber-400" : "bg-cyan-500/70"}`}
                  />
                ))}
              </div>
            </Scroller>
            <div className="mt-2 flex flex-wrap gap-3 text-[12px] text-gray-700 dark:text-gray-200">
              <span>
                <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-amber-400" />
                탐험 {explored}회
              </span>
              <span>
                <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-cyan-500/70" />
                탐사 {STEPS - explored}회
              </span>
              <span className="text-gray-500">
                이번 표본: 앞 30번 탐험 {firstHalf}회 · 뒤 30번 탐험 {secondHalf}회
              </span>
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                기댓값(Σε): 앞 30번 {expFirst.toFixed(2)}회 · 뒤 30번 {expSecond.toFixed(2)}회
              </span>
            </div>
            <div className="mt-3">
              <ComputedNote>
                rand(1)의 값은 이 화면이 시드를 고정해 만든 난수입니다. 교재가 소개하는 방식은 감소하는
                ε = 0.1/(t + 1)이며, 고정 ε는 ‘고정된 값을 사용하는 대신’이라는 교재 문장의 비교 대상을
                보이려고 둔 것입니다. 0.1/(t + 1)은 t = 0에서 이미 0.1이라 탐험이 드물게 나오므로, 한 번 뽑은 표본만으로는 앞뒤
                차이가 거꾸로 보일 수도 있습니다. 구간별 기댓값 Σε은 이 화면에서 계산한 값으로, 감소하는 ε에서는
                뒤 구간의 탐험이 확실히 적습니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
