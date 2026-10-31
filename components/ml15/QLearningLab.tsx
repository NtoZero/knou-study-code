"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, RotateCcw, XCircle, Footprints, Route } from "lucide-react";
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
  fmtQ,
} from "./ui";

/**
 * 14.2.1 Q-학습 — 그림 14-7 ~ 14-10의 4×4 미로 찾기.
 * 보상 규칙(함정 방향 → 제자리 −1, 목표 도착 → 1, 나머지 0)과 갱신 규칙
 * Q̂(s, a) ← r + max Q̂(s′, a′) (식 14-11), Q̂(s, a) ← r + γ max Q̂(s′, a′) (식 14-14)은 교재 그대로다.
 * 격자 밖으로 나가는 행동은 원자료에 정의가 없어 막아 두었다.
 */

type Act = "R" | "L" | "U" | "D";
const ACTS: Act[] = ["R", "L", "U", "D"];
const ACT_NAME: Record<Act, string> = { R: "Right", L: "Left", U: "Up", D: "Down" };
const MOVE: Record<Act, [number, number]> = { R: [0, 1], L: [0, -1], U: [-1, 0], D: [1, 0] };

const N = 4;
const START = 1;
const GOAL = 16;
const TRAPS = new Set([6, 9, 12]);

type QTable = Record<number, Record<Act, number>>;

function zeroTable(): QTable {
  const q: QTable = {};
  for (let s = 1; s <= 16; s++) q[s] = { R: 0, L: 0, U: 0, D: 0 };
  return q;
}

function neighbor(s: number, a: Act): number | null {
  const r = Math.floor((s - 1) / N) + MOVE[a][0];
  const c = ((s - 1) % N) + MOVE[a][1];
  if (r < 0 || r >= N || c < 0 || c >= N) return null;
  return r * N + c + 1;
}

/** 교재 규칙 — 함정에 빠지는 방향: 원래 자리에 머물며 −1, 목표 도착: 1, 나머지: 0 */
function envStep(s: number, a: Act): { next: number; r: number } | null {
  const n = neighbor(s, a);
  if (n === null) return null;
  if (TRAPS.has(n)) return { next: s, r: -1 };
  if (n === GOAL) return { next: n, r: 1 };
  return { next: n, r: 0 };
}

type Pending = {
  s: number;
  a: Act;
  r: number;
  next: number;
  nextQ: Record<Act, number>;
  maxNext: number;
  newVal: number;
};

function makePending(q: QTable, s: number, a: Act, gamma: number): Pending | null {
  const res = envStep(s, a);
  if (!res) return null;
  const nextQ = q[res.next];
  const maxNext = Math.max(...ACTS.map((x) => nextQ[x]));
  return { s, a, r: res.r, next: res.next, nextQ, maxNext, newVal: res.r + gamma * maxNext };
}

/** 그림 14-9의 경로 (2-3-7-11-10-14-15를 거친다) */
const PATH_LONG: Act[] = ["R", "R", "D", "D", "L", "D", "R", "R"];
/** 그림 14-10(a)의 실선 경로 — 11에서 15만 거쳐 16으로 */
const PATH_SHORT: Act[] = ["R", "R", "D", "D", "D", "R"];

const STEPS = [
  { id: "1", text: "① 각 상태 s와 행동 a에 대해 Q̂(s, a)를 0으로 초기화" },
  { id: "2", text: "② 임의의 상태 s를 현재 상태로 지정" },
  { id: "3-1", text: "③-1 행동 a를 선택하고 실행" },
  { id: "3-2", text: "③-2 즉각적인 보상 r을 얻음" },
  { id: "3-3", text: "③-3 새로운 상태 s′를 얻음" },
  { id: "3-4", text: "③-4 보상 r과 새로운 상태 s′ 정보를 사용해서 Q̂(s, a)를 갱신" },
  { id: "3-5", text: "③-5 s ← s′" },
];

const CELL = 84;

function QCell({
  s,
  q,
  cur,
  pending,
  showGreedy,
  onPick,
}: {
  s: number;
  q: Record<Act, number>;
  cur: number;
  pending: Pending | null;
  showGreedy: boolean;
  onPick: (s: number) => void;
}) {
  const trap = TRAPS.has(s);
  const goal = s === GOAL;
  const start = s === START;
  const c = CELL;
  const h = c / 2;
  const tri: Record<Act, string> = {
    U: `0,0 ${c},0 ${h},${h}`,
    R: `${c},0 ${c},${c} ${h},${h}`,
    D: `0,${c} ${c},${c} ${h},${h}`,
    L: `0,0 0,${c} ${h},${h}`,
  };
  const pos: Record<Act, [number, number]> = {
    U: [h, 17],
    R: [c - 13, h + 4],
    D: [h, c - 9],
    L: [13, h + 4],
  };
  const max = Math.max(...ACTS.map((a) => q[a]));
  const greedy = max > 0 ? ACTS.filter((a) => q[a] === max) : [];
  const bg = trap
    ? "fill-orange-200 dark:fill-orange-900/60"
    : goal
      ? "fill-yellow-200 dark:fill-yellow-700/60"
      : start
        ? "fill-green-100 dark:fill-green-900/40"
        : "fill-white dark:fill-gray-900";
  const clickable = !trap && !goal;

  return (
    <svg
      viewBox={`0 0 ${c} ${c}`}
      width={c}
      height={c}
      className={clickable ? "cursor-pointer" : ""}
      onClick={() => clickable && onPick(s)}
      role={clickable ? "button" : undefined}
      aria-label={clickable ? `상태 ${s}를 현재 상태로` : undefined}
    >
      <rect x="0" y="0" width={c} height={c} className={bg} />
      {ACTS.map((a) => {
        const hot = pending && pending.s === s && pending.a === a;
        return (
          <polygon
            key={a}
            points={tri[a]}
            className={
              hot
                ? "fill-cyan-400/60 stroke-cyan-600"
                : "fill-transparent stroke-blue-300/70 dark:stroke-blue-800"
            }
            strokeWidth={hot ? 1.5 : 0.6}
            strokeDasharray={hot ? undefined : "3 2"}
          />
        );
      })}
      {ACTS.map((a) => {
        const v = q[a];
        return (
          <text
            key={a}
            x={pos[a][0]}
            y={pos[a][1]}
            textAnchor="middle"
            className={`text-[10.5px] font-semibold ${
              v > 0
                ? "fill-red-600 dark:fill-red-400"
                : v < 0
                  ? "fill-violet-600 dark:fill-violet-400"
                  : "fill-gray-400"
            }`}
          >
            {fmtQ(v, 3)}
          </text>
        );
      })}
      <text x="4" y="11" className="fill-gray-700 text-[10px] font-bold dark:fill-gray-200">
        {s}
      </text>
      {(trap || goal || start) && (
        <text
          x={h}
          y={h + 4}
          textAnchor="middle"
          className={`text-[9.5px] font-bold ${goal || start ? "fill-blue-700 dark:fill-blue-300" : "fill-gray-800 dark:fill-gray-100"}`}
        >
          {trap ? "함정(−1)" : goal ? "목표(1)" : "시작"}
        </text>
      )}
      {showGreedy &&
        greedy.map((a) => {
          const [dr, dc] = MOVE[a];
          return (
            <line
              key={a}
              x1={h}
              y1={h}
              x2={h + dc * 22}
              y2={h + dr * 22}
              className="stroke-emerald-600"
              strokeWidth="2.5"
              markerEnd="url(#ml15-greedy)"
            />
          );
        })}
      {s === cur && (
        <rect
          x="2"
          y="2"
          width={c - 4}
          height={c - 4}
          rx="6"
          fill="none"
          className="stroke-cyan-600"
          strokeWidth="3"
        />
      )}
      {pending && pending.next === s && pending.next !== pending.s && (
        <rect
          x="4"
          y="4"
          width={c - 8}
          height={c - 8}
          rx="6"
          fill="none"
          className="stroke-amber-500"
          strokeWidth="2"
          strokeDasharray="5 3"
        />
      )}
    </svg>
  );
}

const CHECKS: {
  id: string;
  label: string;
  gamma: 1 | 0.9;
  test: (q: QTable) => boolean;
  eq: string;
}[] = [
  { id: "c1", label: "Q̂(15, R) = 1", gamma: 1, test: (q) => q[15].R === 1, eq: "식 14-12" },
  { id: "c2", label: "Q̂(14, R) = 1", gamma: 1, test: (q) => q[14].R === 1, eq: "강의록 갱신 과정" },
  { id: "c3", label: "경로 위 Q̂가 모두 1 (그림 14-9)", gamma: 1, test: (q) => q[1].R === 1 && q[2].R === 1 && q[3].D === 1 && q[7].D === 1 && q[11].L === 1 && q[10].D === 1 && q[14].R === 1 && q[15].R === 1, eq: "그림 14-9" },
  { id: "d1", label: "Q̂(11, D) = 0.9", gamma: 0.9, test: (q) => Math.abs(q[11].D - 0.9) < 1e-9, eq: "식 14-15" },
  { id: "d2", label: "Q̂(14, R) = 0.9", gamma: 0.9, test: (q) => Math.abs(q[14].R - 0.9) < 1e-9, eq: "식 14-16 앞" },
  { id: "d3", label: "Q̂(10, D) = 0.81", gamma: 0.9, test: (q) => Math.abs(q[10].D - 0.81) < 1e-9, eq: "식 14-16" },
  { id: "d4", label: "Q̂(11, L) = 0.729", gamma: 0.9, test: (q) => Math.abs(q[11].L - 0.729) < 1e-9, eq: "식 14-17" },
];

export default function QLearningLab() {
  const [gamma, setGamma] = useState<1 | 0.9>(1);
  const [q, setQ] = useState<QTable>(zeroTable);
  const [cur, setCur] = useState(START);
  const [pending, setPending] = useState<Pending | null>(null);
  const [guess, setGuess] = useState("");
  const [verdict, setVerdict] = useState<"right" | "wrong" | "shown" | "invalid" | null>(null);
  const [showGreedy, setShowGreedy] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [episodes, setEpisodes] = useState(0);

  const stepId = pending ? (verdict && verdict !== "invalid" ? "3-4" : "3-3") : log.length === 0 && episodes === 0 ? "2" : "3-1";

  const switchGamma = (g: 1 | 0.9) => {
    setGamma(g);
    setQ(zeroTable());
    setCur(START);
    setPending(null);
    setVerdict(null);
    setGuess("");
    setLog([]);
    setEpisodes(0);
  };

  const choose = (a: Act) => {
    const p = makePending(q, cur, a, gamma);
    if (!p) return;
    setPending(p);
    setGuess("");
    setVerdict(null);
  };

  const check = () => {
    if (!pending) return;
    // 소수점 쉼표(0,9)도 받아 준다
    const g = Number(guess.trim().replace(",", "."));
    if (guess.trim() === "" || Number.isNaN(g)) {
      setVerdict("invalid");
      return;
    }
    // 0.59처럼 덜 적은 값은 0.59049와 구별하되, 0.5905처럼 넷째 자리 반올림은 맞게 본다
    setVerdict(Math.abs(g - pending.newVal) < 2e-4 ? "right" : "wrong");
  };

  const fmtUpdate = (p: Pending) =>
    `Q̂(${p.s}, ${p.a}) ← ${p.r} + ${gamma === 1 ? "" : "0.9 × "}max Q̂(${p.next}, a′) = ${fmtQ(p.newVal)}`;

  const apply = () => {
    if (!pending) return;
    const p = pending;
    setQ((prev) => ({ ...prev, [p.s]: { ...prev[p.s], [p.a]: p.newVal } }));
    setLog((l) => [fmtUpdate(p), ...l].slice(0, 8));
    // ③-5 s ← s′ — 목표에 도착하면 시작 상태로 돌아간다
    setCur(p.next === GOAL ? START : p.next);
    if (p.next === GOAL) setEpisodes((e) => e + 1);
    setPending(null);
    setVerdict(null);
    setGuess("");
  };

  const runEpisode = (path: Act[]) => {
    let table = q;
    let s = START;
    const lines: string[] = [];
    for (const a of path) {
      const p = makePending(table, s, a, gamma)!;
      table = { ...table, [p.s]: { ...table[p.s], [p.a]: p.newVal } };
      lines.push(fmtUpdate(p));
      s = p.next;
    }
    setQ(table);
    setLog((l) => [...lines.reverse(), ...l].slice(0, 8));
    setCur(START);
    setPending(null);
    setVerdict(null);
    setEpisodes((e) => e + 1);
  };

  const reset = () => switchGamma(gamma);

  const checks = useMemo(() => CHECKS.filter((c) => c.gamma === gamma), [gamma]);

  return (
    <section id="q-learning" className="scroll-mt-32">
      <SectionTitle
        title="Q-학습 — 4×4 미로에서 Q-테이블 채우기"
        subtitle="행동 하나를 해 볼 때마다 Q̂(s, a) 칸 하나가 갱신됩니다"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "14.2.1 Q-학습 — 식 14-10", slides: "Q-학습" }}>
          <Card>
            <CardTitle>행동 가치함수를 “Q-함수 Q-function”라고 한다</CardTitle>
            <Formula note="(식 14-10) 앞 절의 qπ(s, a) = E[Gₜ | Sₜ = s, Aₜ = a]를 간단히 적은 것">
              Q_π(s, a) = E_π[Gₜ | s, a]
            </Formula>
            <div className="mt-3">
              <ConceptRows
                rows={[
                  {
                    k: "정의",
                    v: (
                      <>
                        <strong>Q-값 Q-value</strong> → 주어진 상태–행동 쌍의 기대 보상 → Q-함수의 값.{" "}
                        <strong>Q-학습 Q-learning</strong> → 최적 정책 π*를 얻기 위해서 최적 Q-함수
                        Q*(s, a)를 추정하는 방법.
                      </>
                    ),
                  },
                  {
                    k: "직관",
                    v: "모든 정책을 비교하지 않고, 상태–행동 쌍마다 ‘이걸 하면 얼마나 좋은가’를 칸에 적어 두고 경험할 때마다 고쳐 쓴다. 칸이 충분히 정확해지면 각 상태에서 값이 가장 큰 행동을 고르는 것이 곧 최적 정책이다.",
                  },
                  {
                    k: "오답 기준",
                    v: "Q-학습이 추정하는 것은 Q-함수(행동 가치)다. 상태 전이확률을 추정하거나 최적화하는 방법이 아니다.",
                  },
                ]}
              />
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "14.2.1 Q-학습 — 알고리즘 · 그림 14-7 ~ 14-10 · 식 14-11 ~ 14-17",
            slides: "Q-학습 알고리즘 · 4×4 미로 찾기에서 Q-학습의 예 · Q-테이블 · Q-학습의 예 · 더 좋은 경로에 대한 선택",
          }}
        >
          <Card>
            <CardTitle>직접 갱신해 보기</CardTitle>
            <P>
              결정론적 → 하나의 상태로만 전이가 발생하고, 상태와 보상 정보는 부분적으로만 관찰된다. S =
              {" {1, 2, …, 16}"}, A = {"{R, L, U, D}"}, R = {"{−1, 1, 0}"} — 함정, 목표 지점, 나머지
              순이다. Q-값이 이산적이므로 16가지 상태 × 4가지 행동을 테이블로 표현하고, 각 칸을
              사선으로 4개 구역으로 나눠 위·오른쪽·아래·왼쪽에 Q̂(s, U), Q̂(s, R), Q̂(s, D), Q̂(s, L)을
              적는다.
            </P>

            <div className="my-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-gray-500">갱신 규칙</span>
              <Chip active={gamma === 1} onClick={() => switchGamma(1)}>
                Q̂(s, a) ← r + max Q̂(s′, a′)
              </Chip>
              <Chip active={gamma === 0.9} onClick={() => switchGamma(0.9)}>
                Q̂(s, a) ← r + γ max Q̂(s′, a′), γ = 0.9
              </Chip>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[auto_minmax(0,1fr)]">
              <div>
                <Scroller>
                  <div className="mx-auto w-fit">
                    <svg width="0" height="0" className="absolute">
                      <defs>
                        <marker id="ml15-greedy" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-emerald-600" />
                        </marker>
                      </defs>
                    </svg>
                    <div className="grid grid-cols-4 border border-gray-800 dark:border-gray-400" style={{ width: CELL * 4 + 2 }}>
                      {Array.from({ length: 16 }, (_, i) => i + 1).map((s) => (
                        <div key={s} className="border border-gray-500/60" style={{ width: CELL, height: CELL }}>
                          <QCell
                            s={s}
                            q={q[s]}
                            cur={cur}
                            pending={pending}
                            showGreedy={showGreedy}
                            onPick={(x) => {
                              setCur(x);
                              setPending(null);
                              setVerdict(null);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Scroller>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                  <label className="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={showGreedy}
                      onChange={(e) => setShowGreedy(e.target.checked)}
                      className="accent-cyan-600"
                    />
                    칸마다 Q̂가 가장 큰 행동을 화살표로
                  </label>
                  <button
                    type="button"
                    onClick={reset}
                    className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    <RotateCcw size={11} /> 0으로 초기화
                  </button>
                </div>
              </div>

              <div className="min-w-0 space-y-3">
                <ol className="space-y-0.5 rounded-lg border border-gray-200 p-2.5 dark:border-gray-700">
                  {STEPS.map((st) => {
                    const on =
                      st.id === stepId ||
                      (stepId === "3-3" && (st.id === "3-1" || st.id === "3-2")) ||
                      (stepId === "3-4" && (st.id === "3-1" || st.id === "3-2" || st.id === "3-3"));
                    return (
                      <li
                        key={st.id}
                        className={`rounded px-1.5 py-0.5 text-[11.5px] transition-colors ${
                          st.id === stepId
                            ? "bg-cyan-600 font-semibold text-white"
                            : on
                              ? "bg-cyan-50 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-200"
                              : "text-gray-500"
                        } ${st.id.startsWith("3-") ? "ml-3" : ""}`}
                      >
                        {st.text}
                        {st.id === "3-4" && (
                          <span className="ml-1 font-mono">
                            : Q̂(s, a) = r + {gamma === 1 ? "" : "γ "}max Q̂(s′, a′)
                          </span>
                        )}
                      </li>
                    );
                  })}
                  <li className="ml-3 px-1.5 text-[10.5px] text-gray-400">③ 은 ‘다음 과정을 무한히 반복’</li>
                </ol>

                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className="text-[11px] font-semibold text-gray-500">
                    현재 상태 s = <span className="text-cyan-700 dark:text-cyan-300">{cur}</span> — 행동 a를
                    고른다 (칸을 눌러 다른 상태를 현재 상태로 지정할 수도 있다)
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {ACTS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => choose(a)}
                        disabled={neighbor(cur, a) === null}
                        className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors disabled:bg-gray-100 disabled:text-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600 ${
                          pending?.a === a
                            ? "bg-cyan-700 text-white"
                            : "bg-cyan-600 text-white hover:bg-cyan-700"
                        }`}
                      >
                        {a} <span className="font-normal opacity-80">{ACT_NAME[a]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {pending && (
                    <motion.div
                      key={`${pending.s}-${pending.a}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60"
                    >
                      <p className="text-[12px] text-gray-700 dark:text-gray-200">
                        ③-2 보상 r = <strong>{pending.r}</strong>
                        {pending.r === -1 && " (함정 방향 → 원래 자리에 머묾)"}
                        {pending.r === 1 && " (목표 지점 도착)"} · ③-3 새로운 상태 s′ ={" "}
                        <strong>{pending.next}</strong>
                      </p>
                      <p className="font-mono text-[12px] text-gray-700 dark:text-gray-200">
                        max Q̂({pending.next}, a′) = max{"{"}
                        {ACTS.map((a) => fmtQ(pending.nextQ[a])).join(", ")}
                        {"}"} = {fmtQ(pending.maxNext)}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[12px] text-gray-700 dark:text-gray-200">
                          Q̂({pending.s}, {pending.a}) ← {pending.r} + {gamma === 1 ? "" : "0.9 × "}
                          {fmtQ(pending.maxNext)} =
                        </span>
                        <input
                          value={guess}
                          onChange={(e) => {
                            setGuess(e.target.value);
                            if (verdict === "wrong" || verdict === "invalid") setVerdict(null);
                          }}
                          onKeyDown={(e) => e.key === "Enter" && check()}
                          inputMode="decimal"
                          placeholder="값"
                          disabled={verdict === "right" || verdict === "shown"}
                          className="w-20 rounded-md border border-gray-300 bg-white px-2 py-1 font-mono text-[12px] dark:border-gray-600 dark:bg-gray-900"
                          aria-label="새 Q̂ 값 입력"
                        />
                        <button
                          type="button"
                          onClick={check}
                          disabled={verdict === "right" || verdict === "shown"}
                          className="rounded-md border border-cyan-600 px-2.5 py-1 text-[11px] font-semibold text-cyan-700 hover:bg-cyan-50 disabled:opacity-40 dark:text-cyan-300 dark:hover:bg-cyan-950"
                        >
                          검산
                        </button>
                        <button
                          type="button"
                          onClick={() => setVerdict("shown")}
                          className="text-[11px] text-gray-500 underline hover:text-gray-800 dark:hover:text-gray-200"
                        >
                          답 보기
                        </button>
                      </div>
                      {verdict === "right" && (
                        <p className="flex items-center gap-1 text-[12px] text-emerald-600">
                          <CheckCircle size={13} /> 맞다 — {fmtQ(pending.newVal)}
                        </p>
                      )}
                      {verdict === "wrong" && (
                        <p className="flex items-center gap-1 text-[12px] text-rose-600">
                          <XCircle size={13} /> 다시 — r에 {gamma === 1 ? "" : "γ를 곱한 "}다음 상태의
                          최대 Q̂를 더한다. 현재 칸 Q̂({pending.s}, {pending.a})의 옛 값은 이 규칙에
                          들어가지 않는다.
                        </p>
                      )}
                      {verdict === "invalid" && (
                        <p className="text-[12px] text-rose-600">숫자로 입력해 주세요 (예: 0.9)</p>
                      )}
                      {verdict === "shown" && (
                        <p className="text-[12px] text-gray-600 dark:text-gray-300">
                          새 값은 <strong>{fmtQ(pending.newVal)}</strong>
                        </p>
                      )}
                      {(verdict === "right" || verdict === "shown") && (
                        <button
                          type="button"
                          onClick={apply}
                          className="rounded-md bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-700"
                        >
                          ③-4 갱신하고 ③-5 s ← {pending.next === GOAL ? `${GOAL} (목표 → 시작 1로)` : pending.next}
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => runEpisode(PATH_LONG)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[11.5px] font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <Footprints size={13} /> 경로 1-2-3-7-11-10-14-15-16 한 번
                  </button>
                  <button
                    type="button"
                    onClick={() => runEpisode(PATH_SHORT)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[11.5px] font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <Route size={13} /> 경로 1-2-3-7-11-15-16 한 번
                  </button>
                  <span className="self-center text-[11px] text-gray-400">목표 도착 {episodes}회</span>
                </div>

                {log.length > 0 && (
                  <div className="rounded-lg border border-gray-200 p-2.5 dark:border-gray-700">
                    <p className="mb-1 text-[10.5px] font-semibold text-gray-500">최근 갱신 (위가 최신)</p>
                    <ul className="space-y-0.5 font-mono text-[11px] text-gray-600 dark:text-gray-300">
                      {log.map((l, i) => (
                        <li key={`${l}-${i}`}>{l}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <p className="mb-2 text-[11px] font-semibold text-gray-500">
                교재·강의록 값과 대조 — 테이블이 같아지면 체크된다
              </p>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {checks.map((c) => {
                  const ok = c.test(q);
                  return (
                    <div
                      key={c.id}
                      className={`flex items-center gap-2 rounded-md px-2 py-1 text-[12px] ${
                        ok
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : "bg-gray-50 text-gray-500 dark:bg-gray-800/60"
                      }`}
                    >
                      {ok ? <CheckCircle size={13} /> : <span className="h-[13px] w-[13px] rounded-full border border-gray-300" />}
                      <span className="font-mono">{c.label}</span>
                      <span className="ml-auto text-[10px] opacity-70">{c.eq}</span>
                    </div>
                  );
                })}
              </div>
              <Hint>
                {gamma === 1
                  ? "같은 경로를 반복하면 보상 1이 목표 쪽에서부터 한 칸씩 거꾸로 전해진다. 첫 번째 에피소드에서는 Q̂(15, R)만 1이 되는 이유 — Q̂(14, R)을 갱신하는 순간에는 아직 Q̂(15, ·)가 모두 0이기 때문이다."
                  : "긴 경로를 네 번 반복하면 0.729까지 내려오고, 그 뒤에 짧은 경로를 한 번 지나면 Q̂(11, D) = 0.9가 생긴다. 상태 11에서 D(0.9)가 L(0.729)보다 크므로 15만 거치는 짧은 경로가 더 좋은 것으로 평가된다."}
              </Hint>
            </div>

            <div className="mt-3">
              <ComputedNote>
                두 경로 버튼은 교재 그림 14-9와 14-10(a)의 경로를 그대로 따라가며 매 걸음 같은 규칙으로
                갱신합니다. 목표에 도착하면 시작 상태 1로 돌아가도록 한 것과, 격자 밖으로 나가는 행동을
                막아 둔 것은 이 화면의 설정입니다. 원자료의 알고리즘은 ③을 무한히 반복한다고만 적습니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
