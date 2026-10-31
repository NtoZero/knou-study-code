"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import {
  Card,
  CardTitle,
  ComputedNote,
  ConceptRows,
  Formula,
  Hint,
  LectureNote,
  P,
  Scroller,
  Slider,
  fmtQ,
} from "./ui";

/**
 * 14.1.2 마르코프 결정 프로세스 — 정의, 마르코프 성질, 그림 14-6 미로 찾기 MDP.
 * 상태 집합·보상 규칙(−1, 0, 5)·현재 상태 12는 교재 그대로이고,
 * 격자 밖으로 나가는 행동은 원자료에 정의가 없어 고를 수 없게 했다.
 */

const SIZE = 5;
const WHITE = new Set([1, 2, 3, 4, 6, 9, 11, 12, 14, 15, 17, 18, 23, 24, 25]);
const GOAL = 25;
const START = 12;

type Dir = "상" | "하" | "좌" | "우";
const DIRS: { d: Dir; dr: number; dc: number }[] = [
  { d: "상", dr: -1, dc: 0 },
  { d: "하", dr: 1, dc: 0 },
  { d: "좌", dr: 0, dc: -1 },
  { d: "우", dr: 0, dc: 1 },
];

function neighbor(s: number, d: Dir): number | null {
  const r = Math.floor((s - 1) / SIZE);
  const c = (s - 1) % SIZE;
  const m = DIRS.find((x) => x.d === d)!;
  const nr = r + m.dr;
  const nc = c + m.dc;
  if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) return null;
  return nr * SIZE + nc + 1;
}

/** 교재 보상 규칙: 회색 칸 선택 → 제자리 −1, 이동 가능 → 이동 0, 목표 도착 → 5 */
function stepMaze(s: number, d: Dir): { next: number; reward: number } | null {
  const n = neighbor(s, d);
  if (n === null) return null;
  if (!WHITE.has(n)) return { next: s, reward: -1 };
  if (n === GOAL) return { next: n, reward: 5 };
  return { next: n, reward: 0 };
}

type Step = { s: number; a: Dir; r: number };

const TUPLE: { sym: string; name: string; body: string; formula?: string }[] = [
  { sym: "S", name: "상태 집합", body: "가능한 상태의 유한집합" },
  { sym: "A", name: "행동 집합", body: "가능한 행동의 유한집합" },
  {
    sym: "P",
    name: "상태 전이확률",
    body: "상태 s에서 행동 a를 취했을 때 상태 s′로 전이될 확률값 Pᵃₛₛ′",
    formula: "Pᵃₛₛ′ = ℙ[Sₜ₊₁ = s′ | Sₜ = s, Aₜ = a]",
  },
  {
    sym: "R",
    name: "보상 함수",
    body: "상태 s에서 행동 a를 취했을 때 얻어질 보상의 기대치 Rᵃₛ (스칼라 값)",
    formula: "Rᵃₛ = E[Rₜ₊₁ | Sₜ = s, Aₜ = a]",
  },
  {
    sym: "γ",
    name: "할인율 discount factor",
    body: "보상을 계산할 때 사용되는 할인율",
    formula: "γ ∈ [0, 1]",
  },
];

export default function MdpMazeLab() {
  const [tuple, setTuple] = useState("P");
  const [cur, setCur] = useState(START);
  const [trace, setTrace] = useState<Step[]>([]);
  const [gamma, setGamma] = useState(0.9);
  const [last, setLast] = useState<{ a: Dir; r: number; moved: boolean } | null>(null);

  const done = cur === GOAL;

  const act = (d: Dir) => {
    if (done) return;
    const res = stepMaze(cur, d);
    if (!res) return;
    setTrace((tr) => [...tr, { s: cur, a: d, r: res.reward }]);
    setLast({ a: d, r: res.reward, moved: res.next !== cur });
    setCur(res.next);
  };

  const reset = () => {
    setCur(START);
    setTrace([]);
    setLast(null);
  };

  const G = useMemo(
    () => trace.reduce((acc, st, k) => acc + gamma ** k * st.r, 0),
    [trace, gamma],
  );

  // 이동 가능한(흰 칸) 방향에 같은 확률을 주는 정책 — 교재의 상태 1 예와 같은 규칙
  const movable = DIRS.filter((x) => {
    const n = neighbor(cur, x.d);
    return n !== null && WHITE.has(n);
  });

  const t = TUPLE.find((x) => x.sym === tuple)!;

  return (
    <section id="mdp" className="scroll-mt-32">
      <SectionTitle
        title="마르코프 결정 프로세스 (MDP)"
        subtitle="문제를 정의할 때 주어지는 정보를 다섯 가지 요소의 튜플로 적습니다"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "14.1.2 마르코프 결정 프로세스", slides: "마르코프 결정 프로세스", lecture: "강화학습을 하려면 제일 먼저 주어진 문제를 MDP로 모형화해야 하고, 학습의 목적은 누적 보상을 최대화하는 최적의 행동을 결정하는 정책을 찾는 것이라고 정리" }}>
          <Card>
            <CardTitle>MDP, Markov Decision Process</CardTitle>
            <ConceptRows
              rows={[
                {
                  k: "정의",
                  v: "학습을 위해 에이전트–환경의 상호작용을 수학적으로 표현한 것. 에이전트가 행동을 선택할 때 사용하는 규칙을 정책(policy)이라고 하며, 에이전트는 정책에 따라 행동을 결정하고 환경은 주어진 MDP에 따라 다음 상태와 보상을 결정한다.",
                },
                {
                  k: "직관",
                  v: "학습의 목적은 주어진 MDP에서 누적 보상을 최대화하는 최적의 행동을 결정하는 정책을 찾는 것이다. MDP는 ‘게임의 규칙’이고, 정책은 ‘그 규칙 안에서 두는 방법’이다.",
                },
                {
                  k: "예시",
                  v: "아래 미로 찾기에서 칸의 위치·이동 방향·보상 규칙이 MDP이고, 각 칸에서 어느 쪽으로 갈지 정하는 규칙이 정책이다.",
                },
                {
                  k: "오답 기준",
                  v: "다음 상태와 보상을 정하는 것은 정책이 아니라 MDP(환경)다. 정책이 정하는 것은 행동뿐이다.",
                },
              ]}
            />
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "14.1.2 마르코프 결정 프로세스 — 정의", slides: "마르코프 결정 프로세스 — 튜플", lecture: "전이를 확률로 적는 것은 같은 행동에도 여러 상태로 갈 수 있는 확률적 불확실성 때문이고, 보상 함수를 기대치로 적는 것도 보상이 정확한 값이 아니라 확률적으로 변할 수 있기 때문이라고 설명" }}>
          <Card>
            <CardTitle>마르코프 결정 프로세스는 &lt;S, A, P, R, γ&gt;의 튜플이다</CardTitle>
            <div className="mb-3 flex flex-wrap items-center justify-center gap-1 font-mono text-lg">
              <span className="text-gray-400">&lt;</span>
              {TUPLE.map((x, i) => (
                <span key={x.sym} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setTuple(x.sym)}
                    aria-pressed={tuple === x.sym}
                    className={`rounded-md px-2.5 py-0.5 font-bold transition-colors ${
                      tuple === x.sym
                        ? "bg-cyan-600 text-white"
                        : "text-cyan-700 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-950"
                    }`}
                  >
                    {x.sym}
                  </button>
                  {i < TUPLE.length - 1 && <span className="text-gray-400">,</span>}
                </span>
              ))}
              <span className="text-gray-400">&gt;</span>
            </div>
            <motion.div
              key={t.sym}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60"
            >
              <p className="text-[13px] font-bold text-gray-800 dark:text-gray-100">
                {t.sym} → {t.name}
              </p>
              <p className="text-[12.5px] text-gray-700 dark:text-gray-200">{t.body}</p>
              {t.formula && <Formula>{t.formula}</Formula>}
            </motion.div>
            <Hint>
              Pᵃₛₛ′의 위첨자 a는 ‘어떤 행동을 했을 때’, 아래첨자 ss′는 ‘s에서 s′로’를 뜻한다. Rᵃₛ도
              같은 방식으로 읽는다 — 상태 s에서 행동 a를 했을 때의 보상 기대치.
            </Hint>
            <LectureNote>
              전이확률의 예 — 상태 s에서 행동 a를 했을 때 s₁로 갈 확률 0.7, s₂로 0.2, s₃로 0.1처럼 여러 상태로
              갈 수 있다. 아래 미로에서 11에서 위로 가면 보통 6으로 가지만, 모터가 10번 중 한 번 오동작해 1까지
              가 버린다면 6으로 갈 확률 9/10, 1로 갈 확률 1/10이 되어 비결정론적이다. 늘 6으로만 간다면(확률
              1.0) 결정론적이다.
            </LectureNote>
          </Card>
        </Sourced>

        <Sourced
          refs={{ textbook: "14.1.2 마르코프 결정 프로세스 — 그림 14-6", slides: "미로 찾기 과업을 정의하는 MDP의 예", lecture: "회색 칸을 제외한 모든 위치가 상태 집합이고, 다음 상태가 하나로 정해져 전이확률이 1.0이면 결정론적이라고 짚음" }}
        >
          <Card>
            <CardTitle>미로 찾기 과업을 정의하는 MDP — 직접 움직여 보기</CardTitle>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[auto_minmax(0,1fr)]">
              <div className="mx-auto">
                <div className="grid grid-cols-5 gap-1" style={{ width: 230 }}>
                  {Array.from({ length: 25 }, (_, i) => i + 1).map((s) => {
                    const white = WHITE.has(s);
                    const isCur = s === cur;
                    const visited = trace.some((x) => x.s === s);
                    return (
                      <div
                        key={s}
                        className={`relative flex h-[42px] items-center justify-center rounded-md border text-[12px] font-bold ${
                          !white
                            ? "border-gray-400 bg-gray-300 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
                            : s === GOAL
                              ? "border-yellow-400 bg-yellow-200 text-yellow-900 dark:bg-yellow-700/60 dark:text-yellow-100"
                              : visited
                                ? "border-cyan-200 bg-cyan-50 text-gray-700 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-gray-200"
                                : "border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                        }`}
                      >
                        {s}
                        {s === GOAL && <span className="absolute bottom-0.5 text-[8px]">Goal</span>}
                        {isCur && (
                          <motion.span
                            layoutId="ml15-robot"
                            className="absolute inset-1 rounded-md border-2 border-cyan-600 bg-cyan-500/20"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-1" style={{ width: 150, margin: "12px auto 0" }}>
                  {(["", "상", "", "좌", "", "우", "", "하", ""] as const).map((d, i) =>
                    d === "" ? (
                      <span key={i} />
                    ) : (
                      <button
                        key={d}
                        type="button"
                        onClick={() => act(d)}
                        disabled={done || neighbor(cur, d) === null}
                        className="rounded-md bg-cyan-600 py-1.5 text-xs font-bold text-white hover:bg-cyan-700 disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-gray-800"
                      >
                        {d}
                      </button>
                    ),
                  )}
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="mx-auto mt-2 flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  <RotateCcw size={11} /> 상태 12에서 다시 시작
                </button>
              </div>

              <div className="min-w-0 space-y-3">
                <div className="grid grid-cols-1 gap-1.5 text-[12px] text-gray-700 dark:text-gray-200">
                  <p>
                    <strong className="text-cyan-700 dark:text-cyan-300">S</strong> 로봇 위치의 집합 ={" "}
                    {"{1, 2, 3, 4, 6, 9, 11, 12, 14, 15, 17, 18, 23, 24, 25}"}
                  </p>
                  <p>
                    <strong className="text-cyan-700 dark:text-cyan-300">A</strong> 이동 방향의 집합 ={" "}
                    {"{상, 하, 좌, 우}"}
                  </p>
                  <p>
                    <strong className="text-cyan-700 dark:text-cyan-300">P</strong> 해당 위치에서 움직여
                    다른 위치로 이동할 확률 → 행렬 형태로 표현
                  </p>
                  <p>
                    <strong className="text-cyan-700 dark:text-cyan-300">R</strong> = {"{−1, 0, 5}"} —
                    회색 칸 선택 → 이동하지 않음 −1 · 이동 가능 → 이동 0 · 목표 도착 → 5
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className="text-[11px] font-semibold text-gray-500">방금 일어난 일</p>
                  {last ? (
                    <p className="mt-1 text-[12.5px] text-gray-700 dark:text-gray-200">
                      행동 <strong>{last.a}</strong> →{" "}
                      {last.r === -1
                        ? "회색 칸이라 이동하지 않음"
                        : last.r === 5
                          ? "목표 지점 도착"
                          : "해당 위치로 이동"}
                      , 보상{" "}
                      <strong
                        className={
                          last.r < 0 ? "text-rose-600" : last.r > 0 ? "text-emerald-600" : "text-gray-600"
                        }
                      >
                        {last.r}
                      </strong>
                      {" · "}현재 상태 {cur}
                    </p>
                  ) : (
                    <p className="mt-1 text-[12.5px] text-gray-500">
                      교재의 현재 상태는 12다. 방향 버튼을 눌러 움직여 보자.
                    </p>
                  )}
                  {done && (
                    <p className="mt-1 text-[12px] font-semibold text-emerald-600">
                      목표 지점에 도달했다.
                    </p>
                  )}
                </div>

                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className="text-[11px] font-semibold text-gray-500">
                    상태 {cur}에서의 정책 — 이동 가능한 방향을 같은 확률로 고른다면
                  </p>
                  {movable.length === 0 || done ? (
                    <p className="mt-1 text-[12px] text-gray-500">목표 지점에서는 더 고를 행동이 없다.</p>
                  ) : (
                    <div className="mt-1 flex flex-wrap gap-2 font-mono text-[12px] text-gray-700 dark:text-gray-200">
                      {movable.map((m) => (
                        <span key={m.d} className="rounded bg-cyan-50 px-1.5 py-0.5 dark:bg-cyan-950/50">
                          π({m.d}|{cur}) = 1/{movable.length}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <p className="mb-1 text-[11px] font-semibold text-gray-500">
                지나온 상태–행동의 시퀀스와 보상
              </p>
              <Scroller>
                <p className="whitespace-nowrap font-mono text-[12px] text-gray-700 dark:text-gray-200">
                  {trace.length === 0
                    ? "(S₀, A₀) —R₁→ (S₁, A₁) —R₂→ …"
                    : trace.map((st, k) => `(${st.s}, ${st.a}) —${st.r}→ `).join("") + (done ? `${cur}` : `(${cur}, ?)`)}
                </p>
              </Scroller>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Slider
                  label="할인율 γ"
                  value={gamma}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={setGamma}
                  display={gamma.toFixed(2)}
                />
                <div className="rounded-md bg-gray-50 p-2 text-[12px] dark:bg-gray-800/60">
                  <p className="font-mono text-gray-700 dark:text-gray-200">
                    G₀ = {trace.length === 0 ? "0" : trace.map((st, k) => `${k === 0 ? "" : `${gamma.toFixed(2)}${k > 1 ? `^${k}` : ""}·`}(${st.r})`).join(" + ")}
                  </p>
                  <p className="mt-1 font-mono font-bold text-cyan-700 dark:text-cyan-300">
                    = {fmtQ(G, 4)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <ComputedNote>
                원자료가 직접 보여 주는 정책 값은 상태 1의 π(우|1) = π(하|1) = 1/2뿐입니다. 다른 상태의
                값은 같은 규칙(이동할 수 있는 방향에 같은 확률)을 이 화면에서 적용한 것입니다. 또 격자
                밖으로 나가는 행동은 원자료에 보상이 정해져 있지 않아 버튼을 막아 두었습니다.
              </ComputedNote>
              <Hint>
                학습해야 할 것은? → 어떻게 이동해서, 즉 “어떤 행동들을 선택해서 목표 지점에 도달할
                것인가?”이다. 회색 칸으로 부딪히면 −1을 받고 그 자리에 머물기 때문에, 같은 목표에
                닿더라도 부딪힌 횟수만큼 누적 보상이 줄어든다.
              </Hint>
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "14.1.2 마르코프 결정 프로세스 — 마르코프 성질", slides: "마르코프 결정 프로세스", lecture: "과거의 결정까지 모두 따지면 아주 복잡해지므로, 문제를 단순화하려고 과거는 잊고 현재 상태만 보고 결정한다는 것이 마르코프 성질이며, 만족하지 못하는 문제도 근사적으로 만족하게 만들어 적용한다고 강조" }}>
          <Card>
            <CardTitle>마르코프 성질 Markov property</CardTitle>
            <ConceptRows
              rows={[
                {
                  k: "정의",
                  v: "“현재 상태에서 선택할 다음 행동은 현재의 상태(상황)에 의해서만 결정된다.” → 이전의 선택/결정들이 영향을 미치지 않음 → 현재 상태만 판단하면 됨.",
                },
                {
                  k: "직관",
                  v: "위 미로에서 상태 12에 어느 길로 왔든, 정책 칸에 뜨는 π(a|12)는 똑같다. 정책이 받는 입력은 지나온 시퀀스가 아니라 현재 상태 하나뿐이기 때문이다.",
                },
                {
                  k: "예시",
                  v: "미로 찾기, 보드게임, 로봇 제어, 자동차 운전, 주어진 목적지까지의 최단 경로 찾기 — 모두 마르코프 성질을 만족하는 과업이다. 이런 과제를 MDP라고 부른다.",
                },
                {
                  k: "오답 기준",
                  v: "‘다음 행동은 이전 선택과 현재 상태를 종합해 결정된다’는 틀린 설명이다. 강화학습은 기본적으로 마르코프 성질을 만족한다는 가정에서 동작하므로, 먼저 문제를 MDP로 모형화하고, 만족하지 못하는 경우라면 근사적으로라도 만들어야 한다.",
                },
              ]}
            />
            <Hint>
              교재는 MDP로 표현하면 이전의 이력을 고려할 필요 없이 현재 상태만 판단해서 행동을 결정하기
              때문에 문제의 해법이 단순해진다고 적는다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
