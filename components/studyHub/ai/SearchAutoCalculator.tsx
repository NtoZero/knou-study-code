"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  RotateCcw,
  Target,
  Flag,
  AlertTriangle,
  Network,
  Sparkles,
  Info,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import AITerm from "./AITerm";

/* ------------------------------------------------------------
 * SearchAutoCalculator — UCS / A* 자동 실행 네트워크 계산기
 *
 * - 가공 그래프 템플릿 3개 (그리스/지역명/T-번호)
 * - 시작·목표 노드 클릭 선택 가능
 * - UCS와 A* 두 모드를 알고리즘으로 자동 실행
 * - Step-by-step 로그, OPEN/CLOSED 전이, ✕ 폐기 이유
 * - 과제 a~g와 완전히 다른 식별자
 * ---------------------------------------------------------- */

interface GNode {
  id: string;
  x: number;
  y: number;
  h: number; // 목표까지의 가공된 직선거리 휴리스틱 (템플릿별 고정)
}

interface GEdge {
  from: string;
  to: string;
  cost: number;
}

interface Template {
  key: string;
  label: string;
  desc: string;
  nodes: GNode[];
  edges: GEdge[]; // undirected (양방향 간주)
  defaultStart: string;
  defaultGoal: string;
  viewBox: string;
}

/* 템플릿 1: 그리스 문자 (α ~ ζ) */
const TPL_GREEK: Template = {
  key: "greek",
  label: "그리스망 (α~ζ)",
  desc: "6개 노드 · 9개 간선 · 작은 격자 구조",
  viewBox: "0 0 520 320",
  defaultStart: "α",
  defaultGoal: "ζ",
  nodes: [
    { id: "α", x: 50, y: 160, h: 13 },
    { id: "β", x: 170, y: 60, h: 10 },
    { id: "γ", x: 170, y: 260, h: 11 },
    { id: "δ", x: 300, y: 60, h: 7 },
    { id: "ε", x: 300, y: 260, h: 6 },
    { id: "ζ", x: 440, y: 160, h: 0 },
  ],
  edges: [
    { from: "α", to: "β", cost: 4 },
    { from: "α", to: "γ", cost: 5 },
    { from: "β", to: "γ", cost: 2 },
    { from: "β", to: "δ", cost: 6 },
    { from: "γ", to: "δ", cost: 3 },
    { from: "γ", to: "ε", cost: 4 },
    { from: "δ", to: "ε", cost: 2 },
    { from: "δ", to: "ζ", cost: 7 },
    { from: "ε", to: "ζ", cost: 5 },
  ],
};

/* 템플릿 2: 지역명 (서울~부산) */
const TPL_KOR: Template = {
  key: "korea",
  label: "지역망 (서울-부산)",
  desc: "7개 노드 · 12개 간선 · 한반도 형태 가공 예",
  viewBox: "0 0 560 340",
  defaultStart: "서울",
  defaultGoal: "부산",
  nodes: [
    { id: "서울", x: 90, y: 60, h: 18 },
    { id: "춘천", x: 220, y: 60, h: 16 },
    { id: "대전", x: 140, y: 170, h: 11 },
    { id: "안동", x: 290, y: 150, h: 9 },
    { id: "전주", x: 120, y: 260, h: 10 },
    { id: "대구", x: 330, y: 240, h: 5 },
    { id: "부산", x: 470, y: 290, h: 0 },
  ],
  edges: [
    { from: "서울", to: "춘천", cost: 5 },
    { from: "서울", to: "대전", cost: 6 },
    { from: "춘천", to: "안동", cost: 7 },
    { from: "대전", to: "안동", cost: 4 },
    { from: "대전", to: "전주", cost: 3 },
    { from: "대전", to: "대구", cost: 6 },
    { from: "전주", to: "대구", cost: 5 },
    { from: "안동", to: "대구", cost: 3 },
    { from: "대구", to: "부산", cost: 4 },
    { from: "안동", to: "부산", cost: 7 },
    { from: "전주", to: "부산", cost: 9 },
    { from: "춘천", to: "대구", cost: 11 },
  ],
};

/* 템플릿 3: T-번호 (T1~T8) — 과제 복잡도 */
const TPL_TNUM: Template = {
  key: "tnum",
  label: "T-번호망 (T1~T8)",
  desc: "8개 노드 · 13개 간선 · 과제 수준 복잡도",
  viewBox: "0 0 560 360",
  defaultStart: "T1",
  defaultGoal: "T8",
  nodes: [
    { id: "T1", x: 60, y: 180, h: 16 },
    { id: "T2", x: 170, y: 70, h: 13 },
    { id: "T3", x: 180, y: 290, h: 14 },
    { id: "T4", x: 290, y: 160, h: 9 },
    { id: "T5", x: 300, y: 40, h: 11 },
    { id: "T6", x: 310, y: 300, h: 8 },
    { id: "T7", x: 430, y: 90, h: 5 },
    { id: "T8", x: 490, y: 220, h: 0 },
  ],
  edges: [
    { from: "T1", to: "T2", cost: 3 },
    { from: "T1", to: "T3", cost: 5 },
    { from: "T2", to: "T4", cost: 4 },
    { from: "T2", to: "T5", cost: 6 },
    { from: "T3", to: "T4", cost: 2 },
    { from: "T3", to: "T6", cost: 5 },
    { from: "T4", to: "T5", cost: 3 },
    { from: "T4", to: "T6", cost: 4 },
    { from: "T4", to: "T7", cost: 6 },
    { from: "T5", to: "T7", cost: 4 },
    { from: "T6", to: "T8", cost: 7 },
    { from: "T7", to: "T8", cost: 3 },
    { from: "T4", to: "T8", cost: 9 },
  ],
};

const TEMPLATES: Template[] = [TPL_GREEK, TPL_KOR, TPL_TNUM];

/* ---------------- UCS / A* 알고리즘 실행 ---------------- */

interface OpenEntry {
  id: string;
  g: number;
  f: number; // A*에서만 의미, UCS에서는 g와 동일
  path: string[];
}

interface Expansion {
  step: number;
  expanded: string; // 확장된 노드
  gExpanded: number;
  fExpanded: number;
  generated: {
    id: string;
    g: number;
    f: number;
    action: "added" | "replaced" | "skipped";
    reason: string;
  }[];
  openAfter: OpenEntry[];
  closedAfter: string[];
  isGoal: boolean;
  path?: string[];
}

type Mode = "ucs" | "astar";

function computeSearch(
  tpl: Template,
  start: string,
  goal: string,
  mode: Mode,
  hOverride?: (id: string) => number,
): Expansion[] {
  // 인접 리스트 구축 (undirected)
  const adj = new Map<string, { to: string; cost: number }[]>();
  tpl.nodes.forEach((n) => adj.set(n.id, []));
  tpl.edges.forEach((e) => {
    adj.get(e.from)!.push({ to: e.to, cost: e.cost });
    adj.get(e.to)!.push({ to: e.from, cost: e.cost });
  });

  const nodeMap = new Map(tpl.nodes.map((n) => [n.id, n]));
  const hFn = (id: string) => {
    if (hOverride) return hOverride(id);
    if (mode === "ucs") return 0;
    return nodeMap.get(id)?.h ?? 0;
  };

  // 우선순위: f(UCS는 f=g) 오름차순, 동점이면 생성순
  const open: OpenEntry[] = [
    { id: start, g: 0, f: hFn(start), path: [start] },
  ];
  const closed = new Set<string>();
  // 최선의 g(또는 f) 기록 — OPEN에 있는 동일 상태 관리
  const bestG = new Map<string, number>([[start, 0]]);
  const expansions: Expansion[] = [];
  let stepCount = 0;

  while (open.length > 0) {
    // f 최소 항목 꺼내기
    open.sort((a, b) => a.f - b.f);
    const cur = open.shift()!;
    // OPEN 내 동일 id가 더 좋은 g로 갱신돼 있다면 이건 오래된 엔트리 → 스킵
    if ((bestG.get(cur.id) ?? Infinity) < cur.g) continue;
    stepCount++;

    if (cur.id === goal) {
      expansions.push({
        step: stepCount,
        expanded: cur.id,
        gExpanded: cur.g,
        fExpanded: cur.f,
        generated: [],
        openAfter: [...open],
        closedAfter: [...Array.from(closed), cur.id],
        isGoal: true,
        path: cur.path,
      });
      return expansions;
    }

    closed.add(cur.id);

    const generated: Expansion["generated"] = [];
    const neighbors = adj.get(cur.id) ?? [];
    for (const { to, cost } of neighbors) {
      const newG = cur.g + cost;
      const newF = newG + hFn(to);
      const newPath = [...cur.path, to];

      // CLOSED에 있고 기존이 더 작거나 같으면 스킵
      if (closed.has(to)) {
        const prevG = bestG.get(to) ?? Infinity;
        if (prevG <= newG) {
          generated.push({
            id: to,
            g: newG,
            f: newF,
            action: "skipped",
            reason: `CLOSED에 이미 존재 (기존 g=${fmt(prevG)} ≤ 새 g=${fmt(newG)}) — 기존 우수로 폐기(✕)`,
          });
          continue;
        }
        // CLOSED지만 새 경로가 더 좋음 → 재확장 필요
        closed.delete(to);
        bestG.set(to, newG);
        open.push({ id: to, g: newG, f: newF, path: newPath });
        generated.push({
          id: to,
          g: newG,
          f: newF,
          action: "replaced",
          reason: `CLOSED에 있던 ${to}를 더 작은 g(${fmt(newG)})로 재오픈`,
        });
        continue;
      }

      // OPEN에 있는 동일 상태 확인
      const prevG = bestG.get(to);
      if (prevG !== undefined) {
        if (prevG <= newG) {
          generated.push({
            id: to,
            g: newG,
            f: newF,
            action: "skipped",
            reason: `OPEN에 기존 g=${fmt(prevG)} ≤ 새 g=${fmt(newG)} — 기존 우수로 폐기(✕)`,
          });
          continue;
        }
        // 기존 OPEN 항목 제거 (같은 id 중 큰 g)
        for (let i = open.length - 1; i >= 0; i--) {
          if (open[i].id === to) open.splice(i, 1);
        }
        bestG.set(to, newG);
        open.push({ id: to, g: newG, f: newF, path: newPath });
        generated.push({
          id: to,
          g: newG,
          f: newF,
          action: "replaced",
          reason: `OPEN의 ${to}를 기존 g=${fmt(prevG)} → 새 g=${fmt(newG)}로 갱신`,
        });
        continue;
      }

      // 완전 신규
      bestG.set(to, newG);
      open.push({ id: to, g: newG, f: newF, path: newPath });
      generated.push({
        id: to,
        g: newG,
        f: newF,
        action: "added",
        reason: `신규 노드 — OPEN에 ${mode === "ucs" ? `g=${fmt(newG)}` : `f=${fmt(newF)}`}로 삽입`,
      });
    }

    expansions.push({
      step: stepCount,
      expanded: cur.id,
      gExpanded: cur.g,
      fExpanded: cur.f,
      generated,
      openAfter: [...open].sort((a, b) => a.f - b.f),
      closedAfter: [...Array.from(closed)],
      isGoal: false,
    });

    // 안전 장치: 너무 많이 돌면 중단
    if (stepCount > 50) break;
  }

  return expansions;
}

function fmt(v: number): string {
  if (!isFinite(v)) return "∞";
  return Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/\.?0+$/, "");
}

/* ---------------- 컴포넌트 ---------------- */

export default function SearchAutoCalculator() {
  const [tplKey, setTplKey] = useState(TEMPLATES[0].key);
  const tpl = TEMPLATES.find((t) => t.key === tplKey)!;
  const [start, setStart] = useState(tpl.defaultStart);
  const [goal, setGoal] = useState(tpl.defaultGoal);
  const [mode, setMode] = useState<Mode>("ucs");
  const [stepIdx, setStepIdx] = useState(0);
  const [selectMode, setSelectMode] = useState<"start" | "goal" | null>(null);
  const [injectBadH, setInjectBadH] = useState(false);

  // 템플릿 바꾸면 start/goal 리셋
  const onTemplateChange = (key: string) => {
    const next = TEMPLATES.find((t) => t.key === key)!;
    setTplKey(key);
    setStart(next.defaultStart);
    setGoal(next.defaultGoal);
    setStepIdx(0);
  };

  // 허용성 위반 주입: 첫 번째 중간 노드에서 h를 비정상적으로 큼
  const badHOverride = useMemo(() => {
    if (!injectBadH) return undefined;
    // 중간 노드 하나 선정 (start, goal 제외)
    const mid = tpl.nodes.find((n) => n.id !== start && n.id !== goal);
    if (!mid) return undefined;
    return (id: string) => {
      const base = tpl.nodes.find((n) => n.id === id)?.h ?? 0;
      if (id === mid.id) return base + 100; // 매우 과대추정
      return base;
    };
  }, [injectBadH, tpl, start, goal]);

  const expansions = useMemo(
    () =>
      computeSearch(
        tpl,
        start,
        goal,
        mode,
        mode === "astar" ? badHOverride : undefined,
      ),
    [tpl, start, goal, mode, badHOverride],
  );

  const cur = expansions[Math.min(stepIdx, expansions.length - 1)] ?? null;
  const done = expansions[expansions.length - 1];
  const pathResult = done?.isGoal ? done : null;

  const onNodeClick = (id: string) => {
    if (selectMode === "start") {
      setStart(id);
      setSelectMode(null);
      setStepIdx(0);
    } else if (selectMode === "goal") {
      setGoal(id);
      setSelectMode(null);
      setStepIdx(0);
    }
  };

  const nodeState = (
    id: string,
  ): "start" | "goal" | "current" | "closed" | "open" | "path" | "idle" => {
    if (cur?.expanded === id && cur.isGoal) return "goal";
    if (id === start) return "start";
    if (id === goal) return "goal";
    if (cur?.expanded === id) return "current";
    if (pathResult?.path?.includes(id) && stepIdx >= expansions.length - 1)
      return "path";
    if (cur?.closedAfter.includes(id)) return "closed";
    if (cur?.openAfter.some((o) => o.id === id)) return "open";
    return "idle";
  };

  return (
    <section className="relative z-0 overflow-visible">
      <SectionTitle
        title="UCS · A* 자동 계산기"
        subtitle="그래프 템플릿 선택 → 시작·목표 지정 → 알고리즘 자동 실행 → 단계별 추적"
      />

      <div className="mb-4 rounded-lg border-l-4 border-indigo-500 bg-indigo-50 p-3 text-xs text-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-100">
        <Info size={13} className="mb-0.5 mr-1 inline" />
        <b>이 도구는 과제 그래프와 완전히 다른 가공 데이터</b>(그리스 문자·지역명·T-번호)를
        사용합니다. 과제의 a~g와 숫자가 겹치지 않으므로 여기의 결과를 그대로 답안에 옮기지 마세요.
      </div>

      {/* 템플릿 선택 */}
      <div className="mb-3 flex flex-wrap gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.key}
            onClick={() => onTemplateChange(t.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              tplKey === t.key
                ? "bg-indigo-500 text-white shadow"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300"
            }`}
          >
            <Network size={11} className="mr-1 inline" />
            {t.label}
          </button>
        ))}
      </div>
      <div className="mb-4 text-[11px] text-gray-500 dark:text-gray-400">
        {tpl.desc}
      </div>

      {/* 모드 + 시작·목표·허용성 위반 */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg bg-indigo-100 p-1 text-xs dark:bg-indigo-950/40">
          <button
            onClick={() => {
              setMode("ucs");
              setStepIdx(0);
              setInjectBadH(false);
            }}
            className={`rounded px-3 py-1 font-semibold ${
              mode === "ucs"
                ? "bg-white text-indigo-700 shadow dark:bg-indigo-900 dark:text-indigo-100"
                : "text-indigo-600"
            }`}
          >
            UCS
          </button>
          <button
            onClick={() => {
              setMode("astar");
              setStepIdx(0);
            }}
            className={`rounded px-3 py-1 font-semibold ${
              mode === "astar"
                ? "bg-white text-indigo-700 shadow dark:bg-indigo-900 dark:text-indigo-100"
                : "text-indigo-600"
            }`}
          >
            A*
          </button>
        </div>

        <button
          onClick={() => setSelectMode("start")}
          className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${
            selectMode === "start"
              ? "bg-emerald-500 text-white shadow"
              : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
          }`}
        >
          <Play size={11} /> 시작: {start}
        </button>
        <button
          onClick={() => setSelectMode("goal")}
          className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${
            selectMode === "goal"
              ? "bg-rose-500 text-white shadow"
              : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
          }`}
        >
          <Flag size={11} /> 목표: {goal}
        </button>
        <button
          onClick={() => {
            setStart(tpl.defaultStart);
            setGoal(tpl.defaultGoal);
            setStepIdx(0);
            setInjectBadH(false);
          }}
          className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
        >
          <RotateCcw size={11} /> 리셋
        </button>

        {mode === "astar" && (
          <label className="ml-auto flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={injectBadH}
              onChange={(e) => {
                setInjectBadH(e.target.checked);
                setStepIdx(0);
              }}
              className="h-3.5 w-3.5 accent-amber-500"
            />
            <AlertTriangle size={12} className="inline text-amber-500" />
            허용성 위반 h 주입
          </label>
        )}
      </div>
      {selectMode && (
        <div className="mb-2 rounded-lg bg-yellow-50 p-2 text-[11px] text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-200">
          그래프에서 {selectMode === "start" ? "시작" : "목표"} 노드를 클릭하세요.
        </div>
      )}

      {/* 그래프 */}
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="relative z-0 overflow-visible rounded-xl border border-indigo-200 bg-white p-3 dark:border-indigo-900/40 dark:bg-gray-900">
          <svg viewBox={tpl.viewBox} className="w-full">
            {/* 간선 */}
            {tpl.edges.map((e, i) => {
              const a = tpl.nodes.find((n) => n.id === e.from)!;
              const b = tpl.nodes.find((n) => n.id === e.to)!;
              const onPath =
                pathResult &&
                pathResult.path &&
                stepIdx >= expansions.length - 1 &&
                ((pathResult.path.includes(e.from) &&
                  pathResult.path.includes(e.to) &&
                  Math.abs(
                    pathResult.path.indexOf(e.from) -
                      pathResult.path.indexOf(e.to),
                  ) === 1));
              return (
                <g key={i}>
                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={onPath ? "#6366f1" : "#cbd5e1"}
                    strokeWidth={onPath ? 4 : 2}
                  />
                  <text
                    x={(a.x + b.x) / 2}
                    y={(a.y + b.y) / 2 - 4}
                    fill={onPath ? "#4338ca" : "#6366f1"}
                    fontSize={11}
                    fontWeight={600}
                    textAnchor="middle"
                  >
                    {e.cost}
                  </text>
                </g>
              );
            })}
            {/* 노드 */}
            {tpl.nodes.map((n) => {
              const st = nodeState(n.id);
              const fill =
                st === "start"
                  ? "#10b981"
                  : st === "goal"
                    ? "#f43f5e"
                    : st === "current"
                      ? "#6366f1"
                      : st === "path"
                        ? "#a5b4fc"
                        : st === "closed"
                          ? "#c7d2fe"
                          : st === "open"
                            ? "#e0e7ff"
                            : "#f1f5f9";
              const textFill =
                st === "start" || st === "goal" || st === "current"
                  ? "#fff"
                  : "#1e1b4b";
              const gVal = cur?.openAfter.find((o) => o.id === n.id)?.g;
              const fVal = cur?.openAfter.find((o) => o.id === n.id)?.f;
              return (
                <motion.g
                  key={n.id}
                  initial={false}
                  animate={{ scale: st === "current" ? 1.1 : 1 }}
                  onClick={() => onNodeClick(n.id)}
                  style={{ cursor: selectMode ? "pointer" : "default" }}
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={24}
                    fill={fill}
                    stroke={st === "current" ? "#312e81" : "#4338ca"}
                    strokeWidth={st === "current" ? 3 : 2}
                  />
                  <text
                    x={n.x}
                    y={n.y - 2}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight={700}
                    fill={textFill}
                  >
                    {n.id}
                  </text>
                  <text
                    x={n.x}
                    y={n.y + 11}
                    textAnchor="middle"
                    fontSize={8}
                    fill={textFill}
                  >
                    h={n.h}
                    {mode === "ucs" && gVal !== undefined
                      ? ` g=${fmt(gVal)}`
                      : mode === "astar" && fVal !== undefined
                        ? ` f=${fmt(fVal)}`
                        : ""}
                  </text>
                </motion.g>
              );
            })}
          </svg>

          {/* 단계 컨트롤 */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              onClick={() => setStepIdx((s) => Math.max(0, s - 1))}
              disabled={stepIdx === 0}
              className="rounded-lg bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 disabled:opacity-50 dark:bg-indigo-950/40 dark:text-indigo-300"
            >
              ← 이전
            </button>
            <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
              {expansions.length === 0
                ? "0/0"
                : `${Math.min(stepIdx + 1, expansions.length)}/${expansions.length}`}
              {" 단계"}
            </span>
            <button
              onClick={() =>
                setStepIdx((s) => Math.min(expansions.length - 1, s + 1))
              }
              disabled={stepIdx >= expansions.length - 1}
              className="rounded-lg bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 disabled:opacity-50 dark:bg-indigo-950/40 dark:text-indigo-300"
            >
              다음 →
            </button>
            <button
              onClick={() => setStepIdx(expansions.length - 1)}
              className="rounded-lg bg-indigo-500 px-3 py-1 text-xs font-semibold text-white"
            >
              결과
            </button>
          </div>
        </div>

        {/* 사이드: OPEN/CLOSED */}
        <div className="space-y-3">
          <div className="relative z-0 overflow-visible rounded-xl border border-indigo-200 bg-white p-3 dark:border-indigo-900/40 dark:bg-gray-900">
            <div className="mb-2 text-xs font-bold text-indigo-600">
              <AITerm term="OPEN" label="OPEN" /> (
              {mode === "ucs" ? "g 오름차순" : "f 오름차순"})
            </div>
            {!cur || cur.openAfter.length === 0 ? (
              <div className="text-[10px] italic text-gray-400">(비어있음)</div>
            ) : (
              <ul className="space-y-1 text-xs">
                {cur.openAfter.map((o) => (
                  <li
                    key={`o-${o.id}`}
                    className="flex justify-between rounded bg-indigo-50 px-2 py-1 dark:bg-indigo-950/30"
                  >
                    <span className="font-mono font-bold">{o.id}</span>
                    <span className="font-mono text-indigo-600">
                      {mode === "ucs"
                        ? `g=${fmt(o.g)}`
                        : `f=${fmt(o.f)} (g=${fmt(o.g)})`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-2 text-xs font-bold text-gray-500">
              <AITerm term="CLOSED" label="CLOSED" />
            </div>
            {!cur || cur.closedAfter.length === 0 ? (
              <div className="text-[10px] italic text-gray-400">(비어있음)</div>
            ) : (
              <div className="flex flex-wrap gap-1 text-[10px]">
                {cur.closedAfter.map((c) => (
                  <span
                    key={`c-${c}`}
                    className="rounded bg-gray-100 px-1.5 py-0.5 font-mono dark:bg-gray-800"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
          {pathResult && stepIdx >= expansions.length - 1 && (
            <div className="rounded-xl border-2 border-emerald-400 bg-emerald-50 p-3 text-xs dark:border-emerald-800 dark:bg-emerald-950/30">
              <div className="mb-1 flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-300">
                <Target size={12} /> 최소비용 해
              </div>
              <div className="font-mono text-emerald-800 dark:text-emerald-200">
                {pathResult.path?.join(" → ")}
              </div>
              <div className="mt-1 text-emerald-700 dark:text-emerald-300">
                총 비용: <b>{fmt(pathResult.gExpanded)}</b> · 확장 횟수:{" "}
                <b>{expansions.filter((e) => !e.isGoal).length}</b>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 단계 로그 */}
      <div className="mt-4 rounded-xl border border-indigo-200 bg-white p-3 dark:border-indigo-900/40 dark:bg-gray-900">
        <div className="mb-2 flex items-center gap-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
          <Sparkles size={12} /> 단계 로그
        </div>
        <AnimatePresence mode="wait">
          {cur && (
            <motion.div
              key={stepIdx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-1.5 text-[11px]"
            >
              <div className="rounded bg-indigo-50 px-2 py-1.5 dark:bg-indigo-950/30">
                <b>#{cur.step}</b>{" "}
                <AITerm term="expand" label="확장" />{" "}
                <b className="font-mono">{cur.expanded}</b>
                {mode === "ucs"
                  ? ` · g=${fmt(cur.gExpanded)}`
                  : ` · f=${fmt(cur.fExpanded)} (g=${fmt(cur.gExpanded)})`}
                {cur.isGoal && (
                  <span className="ml-2 font-bold text-emerald-600">
                    ★ 목표 도달 (
                    <AITerm term="goal" label="확장 시점에 종료" />)
                  </span>
                )}
              </div>
              {cur.generated.map((g, i) => (
                <div
                  key={i}
                  className={`rounded px-2 py-1 ${
                    g.action === "added"
                      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300"
                      : g.action === "replaced"
                        ? "bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300"
                        : "bg-gray-100 text-gray-500 line-through dark:bg-gray-800/40"
                  }`}
                >
                  {g.action === "skipped" && "✕ "}
                  <span className="font-mono font-bold">{g.id}</span> {" "}
                  <span className="font-mono">
                    (g={fmt(g.g)}
                    {mode === "astar" ? `, f=${fmt(g.f)}` : ""})
                  </span>
                  {" · "}
                  <span>{g.reason}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 해석 박스 */}
      {injectBadH && mode === "astar" && (
        <div className="mt-4 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
          <AlertTriangle size={13} className="mb-0.5 mr-1 inline" />
          <b>허용성 위반 h가 주입된 상태입니다.</b> 위 실행 결과가 UCS의 정상 해와
          비용이 일치하는지 확인해 보세요. A*가 더 큰 비용의 해를 반환한다면
          이것이 바로 <AITerm term="admissible" label="허용성" /> 위반의 대가입니다.
        </div>
      )}
    </section>
  );
}
