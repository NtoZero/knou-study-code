"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Shuffle, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import {
  Card,
  CardTitle,
  Chip,
  ComputedNote,
  ConceptRows,
  Formula,
  Hint,
  P,
  Scroller,
  Slider,
  makeRng,
} from "./ui";

/**
 * 14.2.2 심층 Q-신경망(DQN) — 경험 재현, 목표망, DQN 학습 알고리즘.
 * 경험은 4×4 미로의 경로(1-2-3-7-11-10-14-15-16)를 따라 쌓는다.
 * 재현 메모리 크기, 미니배치 크기, 난수 시드, C 값은 이 화면에서 정한 것이다.
 */

type Exp = { t: number; s: number; a: string; r: number; s2: number };

const PATH: [number, string, number, number][] = [
  [1, "R", 0, 2],
  [2, "R", 0, 3],
  [3, "D", 0, 7],
  [7, "D", 0, 11],
  [11, "L", 0, 10],
  [10, "D", 0, 14],
  [14, "R", 0, 15],
  [15, "R", 1, 16],
];

const BATCH = 4;

/** 미니배치 안에서 앞 경험의 s′가 다음 경험의 s와 이어지는 쌍의 수 — 순차성(상관관계)의 거친 지표 */
function chained(batch: Exp[]): number {
  let n = 0;
  for (let i = 0; i + 1 < batch.length; i++) if (batch[i].s2 === batch[i + 1].s) n++;
  return n;
}

const ALGO = [
  {
    id: "init",
    title: "초기화 단계",
    lines: [
      "재현 메모리 D 준비",
      "학습을 통해 최적화할 행동 가치함수 Q(θ) 준비 (랜덤값으로 θ 초기화)",
      "학습 신호를 제공할 목표망 함수 Q̂(θ⁻) 준비 (θ⁻ = θ)",
    ],
    note: "같은 구조의 신경망 두 개가 처음에는 같은 파라미터로 출발한다.",
    tag: "",
  },
  {
    id: "loop",
    title: "에피소드 반복 수행 E = 1, 2, …, M",
    lines: ["시작 상태 s₁ 설정", "수행 및 학습 반복 t = 1, 2, …, T"],
    note: "강의록은 바깥 반복을 ‘반복 수행 t = 1, ⋯, T’로 간단히 적는다.",
    tag: "",
  },
  {
    id: "s1",
    title: "① ε-탐욕 방법에 의한 행동 선택",
    lines: [
      "ε의 확률로 랜덤하게 행동 aₜ를 선택",
      "1 − ε의 확률로 Q(θ)를 이용한 선택: aₜ = argmaxₐ Q(sₜ, a | θ)",
    ],
    note: "Q-학습에서 본 탐험과 탐사의 혼합 전략 그대로다.",
    tag: "ε-greedy",
  },
  {
    id: "s2",
    title: "② 행동 실행",
    lines: ["행동 aₜ를 수행하여 보상 rₜ와 다음 상태 sₜ₊₁을 관찰"],
    note: "",
    tag: "",
  },
  {
    id: "s3",
    title: "③ 경험 재현 방법 적용: 메모리에 저장 및 미니배치 구성",
    lines: [
      "경험 (sₜ, aₜ, rₜ, sₜ₊₁)를 재현 메모리 D에 저장",
      "D로부터 랜덤 샘플링으로 학습용 미니배치 (sⱼ, aⱼ, rⱼ, sⱼ₊₁) 구성",
    ],
    note: "데이터 간의 높은 상관관계 문제를 여기서 푼다.",
    tag: "경험 재현",
  },
  {
    id: "s4",
    title: "④ 기울기 강하 기법으로 θ 학습",
    lines: [
      "목표망을 이용하여 목표값 계산: yⱼ = rⱼ (에피소드가 j + 1 단계에서 끝나면), 그렇지 않으면 rⱼ + γ max_a′ Q̂(sⱼ₊₁, a′ | θ⁻)",
      "목표값을 이용하여 손실함수 (yⱼ − Q(sⱼ, aⱼ | θ))²의 기울기를 따라 θ 수정",
    ],
    note: "목표값 계산에는 θ가 아니라 θ⁻가 쓰인다.",
    tag: "목표망",
  },
  {
    id: "s5",
    title: "⑤ 목표망의 주기적 갱신",
    lines: ["t가 일정 값 C의 배수가 될 때마다 목표망 수정: Q̂ = Q (즉 θ⁻ = θ)"],
    note: "C번의 반복 동안에는 θ⁻가 갱신되지 않으므로 목표 출력값이 움직이는 현상을 막는다.",
    tag: "목표망",
  },
];

function ExpChip({ e, hl }: { e: Exp; hl?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-md border px-1.5 py-0.5 font-mono text-[10.5px] ${
        hl
          ? "border-cyan-500 bg-cyan-50 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-200"
          : "border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300"
      }`}
    >
      e{e.t}=({e.s},{e.a},{e.r},{e.s2})
    </span>
  )
}

/** θ₀, θ₁ … 처럼 아래첨자 숫자로 적는다 */
function subDigits(n: number) {
  return String(n).replace(/\d/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[Number(d)]);
}

export default function DqnTrainingLab() {
  // 경험 재현
  const [cap, setCap] = useState(8);
  const [memory, setMemory] = useState<Exp[]>([]);
  const [tick, setTick] = useState(0);
  const [seed, setSeed] = useState(0);

  // 목표망
  const [C, setC] = useState(4);
  const [useTarget, setUseTarget] = useState(true);

  // 알고리즘
  const [algo, setAlgo] = useState(0);

  const addExp = (k = 1) => {
    let t = tick;
    const added: Exp[] = [];
    for (let i = 0; i < k; i++) {
      const [s, a, r, s2] = PATH[t % PATH.length];
      added.push({ t: t + 1, s, a, r, s2 });
      t++;
    }
    setTick(t);
    // 메모리가 바뀌면 이전에 뽑은 미니배치는 무효 — 다시 뽑게 한다
    setSeed(0);
    // 용량을 넘으면 가장 오래된 경험부터 밀려난다
    setMemory((m) => [...m, ...added].slice(-cap));
  };

  const resetMem = () => {
    setMemory([]);
    setTick(0);
    setSeed(0);
  };

  const sequential = memory.slice(-BATCH);
  const replay = useMemo(() => {
    if (memory.length < BATCH || seed === 0) return [];
    const rnd = makeRng(seed * 104729);
    const idx = new Set<number>();
    while (idx.size < BATCH) idx.add(Math.floor(rnd() * memory.length));
    return Array.from(idx).map((i) => memory[i]);
  }, [memory, seed]);

  const T = 12;
  const steps = Array.from({ length: T }, (_, i) => i + 1);
  // 단계 t에서 주 신경망의 파라미터는 θ_{t−1}. 목표망은 C의 배수 단계가 끝날 때만 θ로 맞춰진다
  const thetaMinusAt = (t: number) => (useTarget ? Math.floor((t - 1) / C) * C : t - 1);

  const a = ALGO[algo];

  return (
    <section id="dqn-training" className="scroll-mt-32">
      <SectionTitle
        title="경험 재현, 목표망, 그리고 DQN 학습 알고리즘"
        subtitle="두 장치가 각각 무엇을 막는지 직접 돌려 보며 확인합니다"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "14.2.2 심층 Q-신경망 — 경험 재현", slides: "경험 재현, 목표망 — 경험 재현" }}>
          <Card>
            <CardTitle>경험 재현 → 데이터 간의 높은 상관관계에 따른 문제 해결</CardTitle>
            <ConceptRows
              rows={[
                {
                  k: "정의",
                  v: "재현을 통해 학습 데이터의 시퀀스를 재구성한다. 용량 N인 재현 메모리 D를 초기화한 후, 에이전트의 경험 eₜ = (sₜ, aₜ, rₜ, sₜ₊₁)를 시간 간격 단위로 Dₜ = {e₁, …, eₜ}에 저장해 두고, D로부터 균등 무작위 추출 (s, a, r, s′) ~ U(D)을 통해 미니배치를 구성하여 학습한다.",
                },
                {
                  k: "직관",
                  v: "방금 겪은 경험들을 순서대로 묶으면 앞 경험의 다음 상태가 곧 뒤 경험의 현재 상태라 서로 꼭 닮아 있다. 메모리에 모아 두었다가 섞어서 뽑으면 이 이어짐이 끊긴다.",
                },
                {
                  k: "예시",
                  v: "이점은 셋이다 — 데이터 사용의 효율성이 높아지고, 미니배치가 순차적인 데이터로 구성되지 않아 입력 데이터 간의 상관관계가 상당히 줄고, 과거의 경험에 대한 반복적인 학습이 가능하다.",
                },
              ]}
            />

            <div className="mt-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <div className="mb-2 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,14rem)_1fr] sm:items-end">
                <Slider label="재현 메모리 용량 N" value={cap} min={4} max={16} step={1} onChange={(v) => { setCap(v); setMemory((m) => m.slice(-v)); }} display={`${cap}개`} />
                <div className="flex flex-wrap gap-1.5">
                  <button type="button" onClick={() => addExp(1)} className="inline-flex items-center gap-1 rounded-lg bg-cyan-600 px-2.5 py-1.5 text-[11.5px] font-semibold text-white hover:bg-cyan-700">
                    <Plus size={12} /> 한 걸음 경험 저장
                  </button>
                  <button type="button" onClick={() => addExp(4)} className="inline-flex items-center gap-1 rounded-lg border border-cyan-600 px-2.5 py-1.5 text-[11.5px] font-semibold text-cyan-700 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-950">
                    <Plus size={12} /> 네 걸음
                  </button>
                  <button type="button" onClick={() => setSeed((s) => s + 1)} disabled={memory.length < BATCH} className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-1.5 text-[11.5px] font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800">
                    <Shuffle size={12} /> D에서 미니배치 {BATCH}개 균등 추출
                  </button>
                  <button type="button" onClick={resetMem} className="inline-flex items-center gap-1 px-1 text-[11px] text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                    <RotateCcw size={11} /> 비우기
                  </button>
                </div>
              </div>
              <p className="mb-1 text-[10.5px] font-semibold text-gray-500">
                재현 메모리 D ({memory.length}/{cap})
              </p>
              <Scroller>
                <div className="flex min-h-[26px] gap-1">
                  {memory.length === 0 ? (
                    <span className="text-[11px] text-gray-400">비어 있음 — 경험을 저장해 보자</span>
                  ) : (
                    memory.map((e) => <ExpChip key={e.t} e={e} hl={replay.includes(e)} />)
                  )}
                </div>
              </Scroller>

              <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="rounded-md bg-rose-50/70 p-2 dark:bg-rose-950/30">
                  <p className="text-[11px] font-semibold text-rose-700 dark:text-rose-300">
                    최근 {BATCH}개를 순서대로 쓰면
                  </p>
                  <Scroller>
                    <div className="mt-1 flex gap-1">{sequential.map((e) => <ExpChip key={e.t} e={e} />)}</div>
                  </Scroller>
                  {sequential.length === BATCH && (
                    <p className="mt-1 text-[11px] text-gray-600 dark:text-gray-300">
                      앞 경험의 s′ = 다음 경험의 s인 쌍: <strong>{chained(sequential)}</strong> / {BATCH - 1}
                    </p>
                  )}
                </div>
                <div className="rounded-md bg-cyan-50/70 p-2 dark:bg-cyan-950/30">
                  <p className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-300">
                    D에서 균등 무작위 추출하면
                  </p>
                  <Scroller>
                    <div className="mt-1 flex gap-1">{replay.map((e) => <ExpChip key={e.t} e={e} hl />)}</div>
                  </Scroller>
                  {replay.length === BATCH ? (
                    <p className="mt-1 text-[11px] text-gray-600 dark:text-gray-300">
                      앞 경험의 s′ = 다음 경험의 s인 쌍: <strong>{chained(replay)}</strong> / {BATCH - 1}
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-gray-400">경험을 {BATCH}개 이상 모은 뒤 추출 버튼을 누른다</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <ComputedNote>
                용량 N, 미니배치 크기 4, 추출에 쓰는 난수는 이 화면에서 정한 것입니다. ‘이어지는 쌍의 수’는
                순차적으로 묶인 정도를 눈으로 보기 위한 거친 지표로, 원자료에 있는 척도가 아닙니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "14.2.2 심층 Q-신경망 — 목표망 · 식 14-21", slides: "경험 재현, 목표망 — 목표망" }}>
          <Card>
            <CardTitle>목표망 → 시변적인 목표 출력값 문제 해결</CardTitle>
            <Formula note="(식 14-21) 목표 출력값 계산에만 목표망의 파라미터 θ⁻를 쓴다">
              E(θ) = Σₜ₌₀ᵀ {"{"}Q̂(sₜ, aₜ | θ) − (rₜ + γ max_a′ Q̂(sₜ₊₁, a′ | θ⁻)){"}"}²
            </Formula>
            <div className="mt-3">
              <P>
                목표망은 주 Q-신경망과 같은 구조를 갖지만 다른 파라미터 θ⁻를 가지며, Q-학습의 목표 출력값
                계산에 사용된다. θ⁻는 매 C단계마다 주기적으로 θ로 갱신한다. 아래 표에서 매 단계 θ는 바뀌지만,
                목표값을 만드는 파라미터가 언제 바뀌는지 비교해 보자.
              </P>
            </div>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <div className="flex gap-1.5">
                <Chip active={useTarget} onClick={() => setUseTarget(true)}>
                  목표망 사용 (θ⁻)
                </Chip>
                <Chip active={!useTarget} onClick={() => setUseTarget(false)}>
                  목표망 없이 (θ)
                </Chip>
              </div>
              {useTarget && (
                <div className="w-48">
                  <Slider label="갱신 주기 C" value={C} min={2} max={6} step={1} onChange={setC} display={`${C}단계`} />
                </div>
              )}
            </div>
            <Scroller>
              <table className="mt-3 w-full min-w-[520px] border-separate border-spacing-0.5 text-center text-[11px]">
                <tbody>
                  <tr>
                    <th className="w-28 text-left font-semibold text-gray-500">학습 단계 t</th>
                    {steps.map((t) => (
                      <td key={t} className="font-mono text-gray-500">{t}</td>
                    ))}
                  </tr>
                  <tr>
                    <th className="text-left font-semibold text-gray-600 dark:text-gray-300">주 신경망</th>
                    {steps.map((t) => (
                      <td key={t} className="rounded bg-gray-100 py-1 font-mono dark:bg-gray-800">θ{subDigits(t - 1)}</td>
                    ))}
                  </tr>
                  <tr>
                    <th className="text-left font-semibold text-cyan-700 dark:text-cyan-300">목표값을 만드는 파라미터</th>
                    {steps.map((t) => {
                      const v = thetaMinusAt(t);
                      const changed = t === 1 || thetaMinusAt(t - 1) !== v;
                      return (
                        <td
                          key={t}
                          className={`rounded py-1 font-mono ${
                            changed
                              ? "bg-amber-200 text-amber-900 dark:bg-amber-700/60 dark:text-amber-50"
                              : "bg-cyan-50 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-200"
                          }`}
                        >
                          θ{subDigits(v)}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </Scroller>
            <p className="mt-2 text-[12px] text-gray-600 dark:text-gray-300">
              목표값이 바뀐 단계(노란 칸):{" "}
              <strong>{steps.filter((t) => t === 1 || thetaMinusAt(t - 1) !== thetaMinusAt(t)).length}번</strong> /{" "}
              {T}단계 {useTarget ? `— C = ${C}번의 반복 동안 θ⁻는 갱신되지 않는다` : "— 매 단계 목표가 같이 움직인다"}
            </p>
            <div className="mt-2">
              <ComputedNote>
                θ₀, θ₁, …은 단계마다 기울기 강하로 바뀐 파라미터를 구분하기 위한 이름이고, C 값의 범위는 이
                화면에서 정했습니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "14.2.2 심층 Q-신경망 — DQN 학습 알고리즘", slides: "DQN 학습 알고리즘" }}>
          <Card>
            <CardTitle>DQN 학습 알고리즘 — 한 단계씩</CardTitle>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <ol className="space-y-1">
                {ALGO.map((x, i) => (
                  <li key={x.id}>
                    <button
                      type="button"
                      onClick={() => setAlgo(i)}
                      className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[11.5px] transition-colors ${
                        i === algo
                          ? "bg-cyan-600 font-semibold text-white"
                          : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                      } ${x.id.startsWith("s") ? "ml-4" : ""}`}
                    >
                      <span className="flex-1">{x.title}</span>
                      {x.tag && (
                        <span className={`rounded px-1 text-[9.5px] ${i === algo ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800"}`}>
                          {x.tag}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ol>
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60"
              >
                <p className="text-[13px] font-bold text-gray-800 dark:text-gray-100">{a.title}</p>
                <ul className="mt-1.5 space-y-1">
                  {a.lines.map((l) => (
                    <li key={l} className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                      – {l}
                    </li>
                  ))}
                </ul>
                {a.note && <p className="mt-2 text-[11.5px] text-cyan-700 dark:text-cyan-300">{a.note}</p>}
                <div className="mt-3 flex items-center gap-2">
                  <button type="button" onClick={() => setAlgo((x) => Math.max(0, x - 1))} disabled={algo === 0} className="rounded-md border border-gray-200 p-1 disabled:opacity-30 dark:border-gray-700" aria-label="이전 단계">
                    <ChevronLeft size={14} />
                  </button>
                  <button type="button" onClick={() => setAlgo((x) => Math.min(ALGO.length - 1, x + 1))} disabled={algo === ALGO.length - 1} className="rounded-md border border-gray-200 p-1 disabled:opacity-30 dark:border-gray-700" aria-label="다음 단계">
                    <ChevronRight size={14} />
                  </button>
                  <span className="text-[11px] text-gray-400">
                    {algo + 1} / {ALGO.length}
                  </span>
                </div>
              </motion.div>
            </div>
            <Hint>
              교재는 아타리 비디오 게임처럼 동영상의 프레임을 사용하는 경우, CNN에서 효율적으로 다루기 위한
              전처리를 수행하여 원래 상태 sₜ 대신 전처리된 값 φ(sₜ)를 사용하기도 한다고 덧붙인다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
