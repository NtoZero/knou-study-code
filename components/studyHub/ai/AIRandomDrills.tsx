"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ListOrdered,
  Sigma,
  Clock,
  Trash2,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import AITerm from "./AITerm";

/* ------------------------------------------------------------
 * AIRandomDrills — 4종 무작위 드릴
 *
 * A. OPEN 리스트에서 확장할 노드(min f/g) 선택
 * B. g + h = f 덧셈 검증
 * C. 거리·속도 → 시간 변환
 * D. OPEN 내 ✕ 폐기 대상 판별 (경로비용 비교)
 * ---------------------------------------------------------- */

type Drill = "A" | "B" | "C" | "D";

const DRILLS: { key: Drill; label: string; icon: typeof ListOrdered }[] = [
  { key: "A", label: "A. 확장 노드 선택", icon: ListOrdered },
  { key: "B", label: "B. f = g + h", icon: Sigma },
  { key: "C", label: "C. 시간 변환", icon: Clock },
  { key: "D", label: "D. ✕ 폐기 판별", icon: Trash2 },
];

const LABELS = ["α", "β", "γ", "δ", "ε", "ζ", "η", "θ"];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pickN<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    result.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return result;
}

interface DrillA {
  nodes: { id: string; f: number }[];
  answer: string;
}
function genA(): DrillA {
  const n = 4;
  const ids = pickN(LABELS, n);
  const nodes = ids.map((id) => ({ id, f: randInt(5, 25) }));
  const min = Math.min(...nodes.map((n) => n.f));
  const winners = nodes.filter((n) => n.f === min);
  if (winners.length > 1) return genA(); // 동점이면 재생성
  return { nodes, answer: winners[0].id };
}

interface DrillB {
  g: number;
  h: number;
  answer: number;
}
function genB(): DrillB {
  const g = randInt(1, 30);
  const h = randInt(1, 20);
  return { g, h, answer: g + h };
}

interface DrillC {
  distance: number;
  speed: number;
  answer: number; // hours, 3 decimal places
}
function genC(): DrillC {
  const distance = randInt(2, 20);
  const speed = randInt(5, 40);
  return {
    distance,
    speed,
    answer: Math.round((distance / speed) * 1000) / 1000,
  };
}

interface DrillD {
  nodes: { id: string; oldG: number; newG: number }[];
  answers: string[]; // 폐기 대상 (newG ≥ oldG)
}
function genD(): DrillD {
  const n = 4;
  const ids = pickN(LABELS, n);
  const nodes = ids.map((id) => {
    const oldG = randInt(3, 20);
    const delta = randInt(-5, 5);
    const newG = Math.max(1, oldG + delta);
    return { id, oldG, newG };
  });
  const answers = nodes.filter((x) => x.newG >= x.oldG).map((x) => x.id);
  // 적어도 1개 폐기와 1개 갱신을 가지도록 재시도
  if (answers.length === 0 || answers.length === n) return genD();
  return { nodes, answers };
}

export default function AIRandomDrills() {
  const [drill, setDrill] = useState<Drill>("A");
  const [a, setA] = useState<DrillA>(() => genA());
  const [b, setB] = useState<DrillB>(() => genB());
  const [c, setC] = useState<DrillC>(() => genC());
  const [d, setD] = useState<DrillD>(() => genD());
  const [input, setInput] = useState("");
  const [selectedD, setSelectedD] = useState<string[]>([]);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  const reset = () => {
    setInput("");
    setSelectedD([]);
    setResult(null);
  };

  const regen = () => {
    if (drill === "A") setA(genA());
    if (drill === "B") setB(genB());
    if (drill === "C") setC(genC());
    if (drill === "D") setD(genD());
    reset();
  };

  const check = () => {
    if (drill === "A") {
      setResult(input.trim() === a.answer ? "correct" : "wrong");
    } else if (drill === "B") {
      setResult(Number(input) === b.answer ? "correct" : "wrong");
    } else if (drill === "C") {
      const n = parseFloat(input);
      if (isNaN(n)) {
        setResult("wrong");
      } else {
        setResult(Math.abs(n - c.answer) < 0.005 ? "correct" : "wrong");
      }
    } else if (drill === "D") {
      const ok =
        selectedD.length === d.answers.length &&
        selectedD.every((x) => d.answers.includes(x));
      setResult(ok ? "correct" : "wrong");
    }
  };

  return (
    <section className="relative z-0 overflow-visible">
      <SectionTitle
        title="무작위 드릴 — 핵심 연산 4종"
        subtitle="확장 노드 선택 · f 덧셈 · 시간 변환 · 폐기 판별"
      />

      {/* 드릴 선택 */}
      <div className="mb-4 flex flex-wrap gap-2">
        {DRILLS.map((dk) => {
          const Icon = dk.icon;
          return (
            <button
              key={dk.key}
              onClick={() => {
                setDrill(dk.key);
                reset();
              }}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                drill === dk.key
                  ? "bg-indigo-500 text-white shadow"
                  : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
              }`}
            >
              <Icon size={12} /> {dk.label}
            </button>
          );
        })}
      </div>

      <div className="relative z-0 overflow-visible rounded-2xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-white p-5 dark:border-indigo-800 dark:from-indigo-950/30 dark:to-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-indigo-700 dark:text-indigo-300">
            <Dumbbell size={14} />{" "}
            {DRILLS.find((x) => x.key === drill)?.label}
          </div>
          <button
            onClick={regen}
            className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
          >
            <RefreshCw size={11} /> 새 문제
          </button>
        </div>

        {/* A. 확장 노드 */}
        {drill === "A" && (
          <div>
            <p className="mb-3 text-xs text-gray-700 dark:text-gray-300">
              <AITerm term="OPEN" label="OPEN 리스트" />에 다음 노드들이 들어
              있습니다. 다음에 <AITerm term="expand" label="확장" />할 노드는?
            </p>
            <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {a.nodes.map((n) => (
                <div
                  key={n.id}
                  className="rounded-lg border border-indigo-200 bg-white px-3 py-2 text-center font-mono text-sm dark:border-indigo-900/40 dark:bg-gray-900"
                >
                  <div className="font-bold text-indigo-700 dark:text-indigo-300">
                    {n.id}
                  </div>
                  <div className="text-[10px] text-gray-500">f={n.f}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") check();
                }}
                placeholder="노드 ID"
                className="w-28 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-center font-mono text-sm dark:border-gray-700 dark:bg-gray-900"
              />
              <button
                onClick={check}
                disabled={!input}
                className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
              >
                확인
              </button>
            </div>
          </div>
        )}

        {/* B. f = g + h */}
        {drill === "B" && (
          <div>
            <p className="mb-3 text-xs text-gray-700 dark:text-gray-300">
              노드 n에서 <AITerm term="g" label="g(n)" /> = <b>{b.g}</b>,{" "}
              <AITerm term="h" label="h(n)" /> = <b>{b.h}</b> 일 때,{" "}
              <AITerm term="f" label="f(n)" /> 은?
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") check();
                }}
                placeholder="f 값"
                className="w-28 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-center font-mono text-sm dark:border-gray-700 dark:bg-gray-900"
              />
              <button
                onClick={check}
                disabled={!input}
                className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
              >
                확인
              </button>
            </div>
          </div>
        )}

        {/* C. 시간 변환 */}
        {drill === "C" && (
          <div>
            <p className="mb-3 text-xs text-gray-700 dark:text-gray-300">
              간선 길이 <b>{c.distance} km</b>, 해당 구간 시속{" "}
              <b>{c.speed} km/h</b> 일 때, 이동 시간(h)은? (소수점 셋째 자리)
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.001"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") check();
                }}
                placeholder="예: 0.125"
                className="w-32 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-center font-mono text-sm dark:border-gray-700 dark:bg-gray-900"
              />
              <button
                onClick={check}
                disabled={!input}
                className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
              >
                확인
              </button>
            </div>
          </div>
        )}

        {/* D. ✕ 폐기 판별 */}
        {drill === "D" && (
          <div>
            <p className="mb-3 text-xs text-gray-700 dark:text-gray-300">
              각 노드마다 <b>기존 g(old)</b>와 새로 계산된 <b>g(new)</b>가 있습니다.{" "}
              <AITerm term="tieBreak" label="기존 우수 판단" /> 규칙으로{" "}
              <b>폐기(✕)될 노드를 모두 선택</b>하세요.
            </p>
            <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {d.nodes.map((n) => {
                const selected = selectedD.includes(n.id);
                return (
                  <button
                    key={n.id}
                    onClick={() => {
                      setSelectedD((prev) =>
                        prev.includes(n.id)
                          ? prev.filter((x) => x !== n.id)
                          : [...prev, n.id],
                      );
                    }}
                    className={`rounded-lg border p-2 text-left transition-all ${
                      selected
                        ? "border-red-500 bg-red-50 dark:border-red-700 dark:bg-red-950/30"
                        : "border-indigo-200 bg-white dark:border-indigo-900/40 dark:bg-gray-900"
                    }`}
                  >
                    <div className="font-mono text-sm font-bold text-indigo-700 dark:text-indigo-300">
                      {n.id}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      old={n.oldG} / new={n.newG}
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={check}
              className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white"
            >
              확인 ({selectedD.length}개 선택)
            </button>
          </div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-4 rounded-lg p-3 text-xs ${
                result === "correct"
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                  : "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200"
              }`}
            >
              {result === "correct" ? (
                <CheckCircle2 size={13} className="mb-0.5 mr-1 inline" />
              ) : (
                <XCircle size={13} className="mb-0.5 mr-1 inline" />
              )}
              <b>{result === "correct" ? "정답!" : "오답"}</b>{" "}
              {drill === "A" && (
                <>
                  · 정답: <b>{a.answer}</b> — f값이 최소인 노드가 확장 대상. 최소
                  f는 {Math.min(...a.nodes.map((n) => n.f))}.
                </>
              )}
              {drill === "B" && (
                <>
                  · 정답: <b>{b.answer}</b> · f(n) = g(n) + h(n) = {b.g} + {b.h}{" "}
                  = <b>{b.answer}</b>.
                </>
              )}
              {drill === "C" && (
                <>
                  · 정답: <b>{c.answer.toFixed(3)} h</b> · 시간 = 거리/속도 ={" "}
                  {c.distance}/{c.speed} = <b>{c.answer.toFixed(3)}</b>.
                </>
              )}
              {drill === "D" && (
                <>
                  · 정답 집합: <b>{d.answers.join(", ") || "(없음)"}</b>. new ≥
                  old 인 노드가 '기존 우수'로 ✕ 폐기됨. 반대로 new &lt; old는
                  기존을 갱신.
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 rounded-lg border-l-4 border-indigo-500 bg-indigo-50/60 p-3 text-[11px] text-gray-700 dark:bg-indigo-950/30 dark:text-gray-300">
        <b>연습 팁:</b> 각 드릴을 <b>5회 이상 연속 정답</b>으로 반복하면 과제에서
        같은 연산을 기계적으로 수행할 수 있게 됨. 특히 드릴 D (폐기 판별)는
        탐색트리의 ✕ 표기와 직접 연결됨.
      </div>
    </section>
  );
}
