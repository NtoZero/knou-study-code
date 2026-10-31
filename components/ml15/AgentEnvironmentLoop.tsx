"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, StepForward } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ConceptRows, Hint, P, Scroller } from "./ui";

/**
 * 14.1.1 강화학습의 계산 모델 — 그림 14-3(일반), 그림 14-4(게임), 그림 14-5(미로 찾기).
 * 한 바퀴를 네 단계로 나눠 화살표 위로 신호가 흐르는 모습을 보여 준다.
 */

type Frame = "general" | "game" | "maze" | "board";

const FRAMES: Record<
  Frame,
  {
    label: string;
    agent: string;
    env: string;
    state: string;
    action: string;
    reward: string;
    note: string;
  }
> = {
  general: {
    label: "표준 계산 모델",
    agent: "에이전트",
    env: "환경",
    state: "상태 Sₜ",
    action: "행동 Aₜ",
    reward: "보상 Rₜ",
    note: "순간마다 행동을 결정하는 주체가 에이전트(agent), 상태를 변화시키고 보상을 결정하는 주체가 환경(environment)이다.",
  },
  game: {
    label: "게임",
    agent: "게임 플레이어의 두뇌",
    env: "게임기",
    state: "게임 화면",
    action: "조이스틱 조작",
    reward: "게임 점수의 변화",
    note: "그림에서는 게임 플레이어의 두뇌가 에이전트, 게임기가 환경이지만 실제 학습 상황에서는 학습할 머신이 에이전트다.",
  },
  maze: {
    label: "미로 찾기",
    agent: "학습할 머신",
    env: "미로",
    state: "현재 위치",
    action: "상·하·좌·우 이동 방향",
    reward: "목표 1 · 함정 −1 · 나머지 0",
    note: "상태 집합 S는 움직일 수 있는 모든 위치로 구성된다. 보상은 목표 지점에 도달하면 1, 함정에 빠지면 −1, 나머지의 경우 0이다.",
  },
  board: {
    label: "보드게임",
    agent: "학습할 머신",
    env: "보드게임",
    state: "유효한 보드판의 구성",
    action: "보드판 위의 움직임",
    reward: "이기면 1 · 지면 −1 · 중간 0",
    note: "바둑, 체스, 장기 같은 보드게임에서는 모든 유효한 보드판의 구성이 상태 집합 S가 된다. 행동은 보드게임의 종류에 따라 달라진다.",
  },
};

const PHASES = [
  {
    title: "① 상태를 입력받는다",
    body: "에이전트는 환경의 현재 상태 Sₜ를 입력받는다. 하나의 상태 Sₜ는 특정 시점 t에 환경을 정의하는 변수의 값이다.",
  },
  {
    title: "② 행동을 결정한다",
    body: "에이전트는 Sₜ를 파악하여 행동 Aₜ를 결정한다. 이때 순간의 관점이 아니라 긴 시간 동안의 누적 보상을 최대화할 수 있는 행동을 골라야 한다.",
  },
  {
    title: "③ 환경이 상태를 바꾸고 보상을 정한다",
    body: "행동 Aₜ를 취하면 상태가 Sₜ에서 Sₜ₊₁로 전이되고, 전이된 상태 Sₜ₊₁의 상대적 효과나 가치에 따라 보상 Rₜ₊₁이 결정된다. 전이는 종종 확률적 불확실성을 포함하며, 이를 전이확률로 표현한다.",
  },
  {
    title: "④ 다음 시점으로",
    body: "Sₜ₊₁과 Rₜ₊₁이 다시 에이전트의 입력이 된다. 시점 t가 하나 늘고 같은 과정이 반복된다.",
  },
];

type Pt = [number, number];

/** 3차 베지에 곡선 위의 점들 — 신호 점이 화살표를 따라가도록 */
function bezierPoints(p0: Pt, p1: Pt, p2: Pt, p3: Pt, n = 16): { cx: number[]; cy: number[] } {
  const cx: number[] = [];
  const cy: number[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const a = (1 - u) ** 3;
    const b = 3 * (1 - u) ** 2 * u;
    const c = 3 * (1 - u) * u ** 2;
    const d = u ** 3;
    cx.push(Math.round((a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0]) * 10) / 10);
    cy.push(Math.round((a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]) * 10) / 10);
  }
  return { cx, cy };
}

const TOP = bezierPoints([150, 70], [220, 30], [300, 30], [370, 70]);
const BOTTOM = bezierPoints([370, 130], [300, 170], [220, 170], [150, 130]);

export default function AgentEnvironmentLoop() {
  const [frame, setFrame] = useState<Frame>("general");
  const [{ t, phase }, setClock] = useState({ t: 0, phase: 0 });
  const [playing, setPlaying] = useState(false);
  const f = FRAMES[frame];

  const advance = () =>
    setClock((c) => (c.phase === 3 ? { t: c.t + 1, phase: 0 } : { t: c.t, phase: c.phase + 1 }));

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(
      () =>
        setClock((c) =>
          c.phase === 3 ? { t: c.t + 1, phase: 0 } : { t: c.t, phase: c.phase + 1 },
        ),
      1400,
    );
    return () => window.clearInterval(id);
  }, [playing]);

  const tLabel = `t = ${t}`;

  // 화살표 경로 — 위: 에이전트 → 환경 (행동), 아래: 환경 → 에이전트 (상태·보상)
  const topPath = "M 150 70 C 220 30, 300 30, 370 70";
  const bottomPath = "M 370 130 C 300 170, 220 170, 150 130";

  return (
    <section id="computation-model" className="scroll-mt-32">
      <SectionTitle
        title="강화학습의 계산 모델 — 에이전트와 환경"
        subtitle="상태 → 행동 → 다음 상태와 보상이 한 바퀴를 이룹니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "14.1.1 강화학습의 계산 모델 — 그림 14-3 · 14-4",
            slides: "강화학습의 표준 계산 모델",
            lecture: "게임으로 대응시켜 설명 — 플레이어의 두뇌가 에이전트, 조이스틱 조작이 행동, 게임기가 환경, 게임 화면이 상태, 점수 변화가 보상이며, 실제로는 학습시킬 머신이 에이전트라고 짚음",
          }}
        >
          <Card>
            <CardTitle>한 바퀴를 단계별로 돌려 보기</CardTitle>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {(Object.keys(FRAMES) as Frame[]).map((k) => (
                <Chip key={k} active={frame === k} onClick={() => setFrame(k)}>
                  {FRAMES[k].label}
                </Chip>
              ))}
            </div>

            <Scroller>
              <svg viewBox="0 0 520 200" className="w-full min-w-[460px]" role="img" aria-label="에이전트와 환경의 상호작용">
                <defs>
                  <marker id="ml15-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-400" />
                  </marker>
                </defs>

                <rect x="20" y="60" width="130" height="80" rx="12"
                  className={phase === 0 || phase === 1 ? "fill-cyan-100 stroke-cyan-500 dark:fill-cyan-950" : "fill-white stroke-gray-300 dark:fill-gray-900 dark:stroke-gray-600"}
                  strokeWidth="2" />
                <text x="85" y="96" textAnchor="middle" className="fill-gray-800 text-[13px] font-bold dark:fill-gray-100">에이전트</text>
                <text x="85" y="116" textAnchor="middle" className="fill-gray-500 text-[10px]">{frame === "general" ? "agent" : f.agent}</text>

                <rect x="370" y="60" width="130" height="80" rx="12"
                  className={phase === 2 ? "fill-amber-100 stroke-amber-500 dark:fill-amber-950" : "fill-white stroke-gray-300 dark:fill-gray-900 dark:stroke-gray-600"}
                  strokeWidth="2" />
                <text x="435" y="96" textAnchor="middle" className="fill-gray-800 text-[13px] font-bold dark:fill-gray-100">환경</text>
                <text x="435" y="116" textAnchor="middle" className="fill-gray-500 text-[10px]">{frame === "general" ? "environment" : f.env}</text>

                <path d={topPath} fill="none" strokeWidth="2" markerEnd="url(#ml15-arrow)"
                  className={phase === 1 ? "stroke-cyan-500" : "stroke-gray-300 dark:stroke-gray-600"} />
                <path d={bottomPath} fill="none" strokeWidth="2" markerEnd="url(#ml15-arrow)"
                  className={phase === 2 || phase === 3 ? "stroke-amber-500" : "stroke-gray-300 dark:stroke-gray-600"} />

                <text x="260" y="26" textAnchor="middle" className="fill-cyan-700 text-[12px] font-bold dark:fill-cyan-300">
                  행동 Aₜ{frame !== "general" ? ` — ${f.action}` : ""}
                </text>
                <text x="260" y="188" textAnchor="middle" className="fill-amber-700 text-[12px] font-bold dark:fill-amber-300">
                  보상 Rₜ₊₁ · 상태 Sₜ₊₁
                </text>
                <text x="260" y="104" textAnchor="middle" className="fill-gray-400 text-[11px]">
                  {tLabel}
                </text>

                {phase === 1 && (
                  <motion.circle r="7" className="fill-cyan-500"
                    initial={{ cx: TOP.cx[0], cy: TOP.cy[0] }}
                    animate={{ cx: TOP.cx, cy: TOP.cy }}
                    transition={{ duration: 1.1, ease: "easeInOut" }} />
                )}
                {phase === 2 && (
                  <motion.circle r="7" className="fill-amber-500"
                    initial={{ cx: BOTTOM.cx[0], cy: BOTTOM.cy[0] }}
                    animate={{ cx: BOTTOM.cx, cy: BOTTOM.cy }}
                    transition={{ duration: 1.1, ease: "easeInOut" }} />
                )}
              </svg>
            </Scroller>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-700"
              >
                {playing ? <Pause size={13} /> : <Play size={13} />}
                {playing ? "멈춤" : "자동 재생"}
              </button>
              <button
                type="button"
                onClick={advance}
                disabled={playing}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <StepForward size={13} />
                한 단계
              </button>
              <span className="text-[11px] text-gray-400">
                시점 {t}, 단계 {phase + 1} / 4
              </span>
            </div>

            <motion.div
              key={`${phase}-${frame}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60"
            >
              <p className="text-[12px] font-bold text-gray-800 dark:text-gray-100">
                {PHASES[phase].title}
              </p>
              <p className="mt-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                {PHASES[phase].body}
              </p>
              {frame !== "general" && (
                <p className="mt-1 text-[12px] leading-6 text-cyan-700 dark:text-cyan-300">
                  {phase === 0 && `이 예에서 상태는 ‘${f.state}’다.`}
                  {phase === 1 && `이 예에서 행동은 ‘${f.action}’이다.`}
                  {phase === 2 && `이 예에서 보상은 ‘${f.reward}’로 준다.`}
                  {phase === 3 && `‘${f.state}’가 바뀐 채로 다음 판단이 시작된다.`}
                </p>
              )}
            </motion.div>
            <Hint>{f.note}</Hint>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "14.1.1 강화학습의 계산 모델", slides: "상태와 보상의 예", lecture: "함정은 움직일 수 없는 곳이라 상태 집합에서 빠지고, 그림의 화살표는 각 위치에서 목표에 가기 위해 고를 수 있는 최적의 이동 방향이라고 설명" }}>
          <Card>
            <CardTitle>집합 A, S, R의 정의가 우선 필요하다</CardTitle>
            <ConceptRows
              rows={[
                {
                  k: "정의",
                  v: "강화학습 알고리즘은 상태들의 집합 S, 에이전트가 각 상태에서 취할 수 있는 행동의 집합 A, 보상 신호의 집합 R로 구성된다.",
                },
                {
                  k: "직관",
                  v: "에이전트의 역할은 누적 보상을 최대화하는 최적의 행동 결정이다. 무엇이 상태이고, 무엇을 할 수 있으며, 무엇이 보상인지를 먼저 정해야 ‘최적’을 말할 수 있다.",
                },
                {
                  k: "예시",
                  v: "미로 찾기 — S: 움직일 수 있는 모든 위치, A: 상·하·좌·우로의 이동 방향, R: 목표 지점 도달 1, 함정 −1, 나머지 0.",
                },
                {
                  k: "오답 기준",
                  v: "보상을 결정하는 것은 에이전트가 아니라 환경이다. 에이전트는 행동을 고르고, 환경이 다음 상태와 보상을 돌려준다.",
                },
              ]}
            />
            <div className="mt-3">
              <P>
                위 그림에서 칩을 바꿔 가며 같은 구조가 게임·미로·보드게임에 어떻게 대응되는지 확인해
                보자. 모양은 달라도 ‘상태를 받아 행동을 고르고, 다음 상태와 보상을 돌려받는다’는 틀은
                같다.
              </P>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
