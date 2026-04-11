"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Sparkles,
  Target,
  Route,
  ListChecks,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import CPMTerm from "./CPMTerm";

/* -----------------------------------------------------------
 * 네트워크 자동 계산기
 * - 3개 네트워크 템플릿 (과제와 완전히 다른 구조·ID)
 * - duration 편집 → 전진/후진 pass 자동 계산
 * - 임계 경로 하이라이트, 경로 전수 탐색, 타깃 작업 질의
 * ---------------------------------------------------------- */

interface Task {
  id: string;
  duration: number;
  pred: string[];
  x: number; // SVG x
  y: number; // SVG y
}

interface Template {
  key: string;
  label: string;
  desc: string;
  tasks: Task[];
  viewBox: string;
}

// 과제의 A~J와 겹치지 않도록 K~Z, 숫자 등 다른 ID 사용
const TEMPLATES: Template[] = [
  {
    key: "chain",
    label: "A · 단일 체인",
    desc: "merge/fork 없는 가장 단순한 형태. 모든 작업이 임계 경로에 속함.",
    viewBox: "0 0 620 160",
    tasks: [
      { id: "K", duration: 3, pred: [], x: 60, y: 80 },
      { id: "L", duration: 4, pred: ["K"], x: 180, y: 80 },
      { id: "M", duration: 2, pred: ["L"], x: 300, y: 80 },
      { id: "N", duration: 5, pred: ["M"], x: 420, y: 80 },
      { id: "O", duration: 1, pred: ["N"], x: 540, y: 80 },
    ],
  },
  {
    key: "merge",
    label: "B · Merge 집중 연습",
    desc: "작업 하나가 여러 선행에서 합류. forward pass에서 max 규칙이 반복 등장.",
    viewBox: "0 0 620 280",
    tasks: [
      { id: "K", duration: 2, pred: [], x: 60, y: 140 },
      { id: "L", duration: 3, pred: ["K"], x: 220, y: 40 },
      { id: "M", duration: 5, pred: ["K"], x: 220, y: 140 },
      { id: "N", duration: 1, pred: ["K"], x: 220, y: 240 },
      { id: "W", duration: 2, pred: ["L", "M", "N"], x: 400, y: 140 },
      { id: "X", duration: 1, pred: ["W"], x: 540, y: 140 },
    ],
  },
  {
    key: "complex",
    label: "C · 복합 (merge + fork)",
    desc: "merge·fork가 여러 번 반복되는 과제 수준의 복잡도. 허브 노드와 숨은 임계 경로 포함.",
    viewBox: "0 0 720 300",
    tasks: [
      { id: "K", duration: 2, pred: [], x: 60, y: 150 },
      { id: "L", duration: 3, pred: ["K"], x: 200, y: 60 },
      { id: "M", duration: 4, pred: ["K"], x: 200, y: 220 },
      { id: "N", duration: 2, pred: ["L", "M"], x: 340, y: 60 },
      { id: "P", duration: 3, pred: ["M"], x: 340, y: 220 },
      { id: "O", duration: 5, pred: ["N"], x: 480, y: 60 },
      { id: "Q", duration: 1, pred: ["N", "P"], x: 480, y: 220 },
      { id: "R", duration: 1, pred: ["O", "Q"], x: 640, y: 150 },
    ],
  },
];

interface CPMResult {
  forward: Record<
    string,
    { est: number; eft: number; reason: string }
  >;
  backward: Record<
    string,
    { lst: number; lft: number; reason: string }
  >;
  slack: Record<string, number>;
  critical: string[];
  duration: number;
  paths: { path: string[]; length: number; isCritical: boolean }[];
  order: string[];
  succMap: Record<string, string[]>;
}

function computeCPM(tasks: Task[]): CPMResult {
  const byId: Record<string, Task> = Object.fromEntries(
    tasks.map((t) => [t.id, t]),
  );
  const succMap: Record<string, string[]> = {};
  tasks.forEach((t) => {
    succMap[t.id] = [];
  });
  tasks.forEach((t) => {
    t.pred.forEach((p) => {
      if (!succMap[p]) succMap[p] = [];
      succMap[p].push(t.id);
    });
  });

  // Kahn's topological sort
  const indeg: Record<string, number> = {};
  tasks.forEach((t) => {
    indeg[t.id] = t.pred.length;
  });
  const queue: string[] = tasks
    .filter((t) => t.pred.length === 0)
    .map((t) => t.id);
  const order: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    order.push(id);
    succMap[id].forEach((s) => {
      indeg[s]--;
      if (indeg[s] === 0) queue.push(s);
    });
  }

  // Forward pass
  const forward: CPMResult["forward"] = {};
  for (const id of order) {
    const t = byId[id];
    let est = 0;
    let reason = "";
    if (t.pred.length === 0) {
      est = 0;
      reason = "시작 작업 → EST = 0";
    } else {
      const efts = t.pred.map((p) => forward[p].eft);
      est = Math.max(...efts);
      const preds = t.pred.join(", ");
      reason = `선행 {${preds}}의 EFT = {${efts.join(", ")}} → max = ${est}`;
    }
    const eft = est + t.duration;
    forward[id] = { est, eft, reason };
  }

  const duration = Math.max(...order.map((id) => forward[id].eft));

  // Backward pass
  const backward: CPMResult["backward"] = {};
  for (const id of [...order].reverse()) {
    const t = byId[id];
    let lft = 0;
    let reason = "";
    if (succMap[id].length === 0) {
      lft = duration;
      reason = `종료 작업 → LFT = 프로젝트 기간 ${duration}`;
    } else {
      const lsts = succMap[id].map((s) => backward[s].lst);
      lft = Math.min(...lsts);
      const succs = succMap[id].join(", ");
      reason = `후속 {${succs}}의 LST = {${lsts.join(", ")}} → min = ${lft}`;
    }
    const lst = lft - t.duration;
    backward[id] = { lst, lft, reason };
  }

  // Slack
  const slack: Record<string, number> = {};
  tasks.forEach((t) => {
    slack[t.id] = backward[t.id].lst - forward[t.id].est;
  });

  const critical = order.filter((id) => slack[id] === 0);

  // Enumerate all start→end paths
  const startIds = tasks
    .filter((t) => t.pred.length === 0)
    .map((t) => t.id);
  const endIds = tasks
    .filter((t) => (succMap[t.id] ?? []).length === 0)
    .map((t) => t.id);

  const paths: CPMResult["paths"] = [];
  function dfs(cur: string, path: string[], length: number) {
    const np = [...path, cur];
    const nl = length + byId[cur].duration;
    if (endIds.includes(cur)) {
      paths.push({ path: np, length: nl, isCritical: nl === duration });
      return;
    }
    for (const s of succMap[cur]) {
      dfs(s, np, nl);
    }
  }
  startIds.forEach((s) => dfs(s, [], 0));
  paths.sort((a, b) => b.length - a.length);

  return {
    forward,
    backward,
    slack,
    critical,
    duration,
    paths,
    order,
    succMap,
  };
}

export default function SlackTimeCalculator() {
  const [templateKey, setTemplateKey] = useState(TEMPLATES[0].key);
  const [tasks, setTasks] = useState<Task[]>(
    TEMPLATES[0].tasks.map((t) => ({ ...t })),
  );
  const [focus, setFocus] = useState<string | null>(null);

  const template = TEMPLATES.find((t) => t.key === templateKey)!;
  const cpm = useMemo(() => computeCPM(tasks), [tasks]);

  const selectTemplate = (key: string) => {
    const tpl = TEMPLATES.find((t) => t.key === key)!;
    setTemplateKey(key);
    setTasks(tpl.tasks.map((t) => ({ ...t })));
    setFocus(null);
  };

  const updateDuration = (id: string, value: number) => {
    setTasks((ts) =>
      ts.map((t) => (t.id === id ? { ...t, duration: Math.max(0, value) } : t)),
    );
  };

  const criticalSet = new Set(cpm.critical);
  const edges: { from: string; to: string; critical: boolean }[] = [];
  tasks.forEach((t) => {
    t.pred.forEach((p) => {
      // Critical edge = both endpoints critical AND edge is on a critical path
      // Simplification: both endpoints critical
      const isCritical =
        criticalSet.has(p) &&
        criticalSet.has(t.id) &&
        cpm.forward[p].eft === cpm.forward[t.id].est;
      edges.push({ from: p, to: t.id, critical: isCritical });
    });
  });

  const focusTask = focus ? tasks.find((t) => t.id === focus) : null;

  return (
    <section>
      <SectionTitle
        title="6. 네트워크 자동 계산기 · 임계 경로 시뮬레이터"
        subtitle="템플릿 선택 → duration 수정 → EST/EFT/LFT/LST/Slack 자동 도출 · 모든 경로 전수 탐색 · 타깃 작업 질의"
      />

      <div className="mb-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-[11px] text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
        아래 템플릿 3개는 모두 <strong>과제 네트워크와 무관한 가공 예제</strong>
        (ID도 K, L, M, N 등으로 다름). 계산 원리 학습용으로만 사용하세요.
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 dark:border-emerald-900/50 dark:from-emerald-950/30 dark:to-gray-900">
        {/* 공식 */}
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          <Calculator size={16} /> 핵심 공식{" "}
          <span className="text-[10px] font-normal text-gray-500">
            (?아이콘에 마우스를 올리면 각 용어 설명이 나옴)
          </span>
        </div>
        <div className="mb-5 grid gap-2 sm:grid-cols-4">
          <FormulaWithTooltip label="EST" formula="= max(선행 EFT)" />
          <FormulaWithTooltip label="EFT" formula="= EST + d" />
          <FormulaWithTooltip label="LFT" formula="= min(후속 LST)" />
          <FormulaWithTooltip label="LST" formula="= LFT − d" />
        </div>

        {/* 템플릿 선택 */}
        <div className="mb-4">
          <div className="mb-2 text-[11px] font-bold text-gray-500">
            네트워크 템플릿
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.key}
                onClick={() => selectTemplate(t.key)}
                className={`rounded-xl border-2 p-3 text-left transition-all ${
                  templateKey === t.key
                    ? "border-emerald-500 bg-white shadow-sm dark:bg-gray-900"
                    : "border-emerald-100 bg-white/70 hover:border-emerald-300 dark:border-emerald-900/40 dark:bg-gray-900/40"
                }`}
              >
                <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  {t.label}
                </div>
                <p className="mt-1 text-[10px] text-gray-500">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 네트워크 시각화 */}
        <div className="mb-4 overflow-x-auto rounded-xl border border-emerald-200 bg-white p-3 dark:border-emerald-900/50 dark:bg-gray-900">
          <svg
            viewBox={template.viewBox}
            className="mx-auto w-full"
            style={{ maxHeight: 340 }}
          >
            <defs>
              <marker
                id="nca-arrow"
                markerWidth="9"
                markerHeight="9"
                refX="7"
                refY="4.5"
                orient="auto"
              >
                <polygon points="0 0, 9 4.5, 0 9" fill="#10b981" />
              </marker>
              <marker
                id="nca-arrow-red"
                markerWidth="9"
                markerHeight="9"
                refX="7"
                refY="4.5"
                orient="auto"
              >
                <polygon points="0 0, 9 4.5, 0 9" fill="#dc2626" />
              </marker>
            </defs>

            {/* 엣지 */}
            {edges.map((e, i) => {
              const from = tasks.find((t) => t.id === e.from)!;
              const to = tasks.find((t) => t.id === e.to)!;
              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const ux = dx / dist;
              const uy = dy / dist;
              const r = 34;
              return (
                <line
                  key={i}
                  x1={from.x + ux * r}
                  y1={from.y + uy * r}
                  x2={to.x - ux * r}
                  y2={to.y - uy * r}
                  stroke={e.critical ? "#dc2626" : "#10b981"}
                  strokeWidth={e.critical ? 3 : 2}
                  markerEnd={
                    e.critical ? "url(#nca-arrow-red)" : "url(#nca-arrow)"
                  }
                />
              );
            })}

            {/* 노드 */}
            {tasks.map((t) => {
              const isCritical = criticalSet.has(t.id);
              const isFocus = focus === t.id;
              const f = cpm.forward[t.id];
              const b = cpm.backward[t.id];
              return (
                <g
                  key={t.id}
                  onClick={() => setFocus(focus === t.id ? null : t.id)}
                  style={{ cursor: "pointer" }}
                >
                  <text
                    x={t.x}
                    y={t.y - 48}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#059669"
                    fontWeight="700"
                  >
                    {f.est} / {f.eft}
                  </text>
                  <motion.circle
                    cx={t.x}
                    cy={t.y}
                    r={34}
                    fill={
                      isFocus
                        ? "#fde68a"
                        : isCritical
                          ? "#fee2e2"
                          : "#ffffff"
                    }
                    stroke={
                      isFocus
                        ? "#d97706"
                        : isCritical
                          ? "#dc2626"
                          : "#10b981"
                    }
                    strokeWidth={isFocus ? 3.5 : isCritical ? 3 : 2}
                    animate={{ scale: isFocus ? 1.08 : 1 }}
                  />
                  <text
                    x={t.x}
                    y={t.y - 3}
                    textAnchor="middle"
                    fontSize="15"
                    fontWeight="800"
                    fill={isCritical ? "#b91c1c" : "#065f46"}
                  >
                    {t.id}
                  </text>
                  <text
                    x={t.x}
                    y={t.y + 12}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#6b7280"
                  >
                    d={t.duration}
                  </text>
                  <text
                    x={t.x}
                    y={t.y + 56}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#7c3aed"
                    fontWeight="700"
                  >
                    {b.lst} / {b.lft}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="mt-1 flex flex-wrap gap-3 px-2 text-[10px] text-gray-500">
            <span>
              <span className="font-bold text-emerald-600">상단(EST/EFT)</span> ·{" "}
              <span className="font-bold text-purple-600">하단(LST/LFT)</span>
            </span>
            <span className="text-red-600">빨강 = 임계 경로</span>
            <span>노드 클릭 = 타깃 질의 모드</span>
          </div>
        </div>

        {/* duration 편집 + 계산 결과 표 */}
        <div className="relative z-0 overflow-visible rounded-xl border border-emerald-200 bg-white dark:border-emerald-900/50 dark:bg-gray-900">
          <table className="w-full text-[11px]">
            <thead className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              <tr>
                <th className="p-2 text-left">작업</th>
                <th className="p-2">
                  <CPMTerm term="precedence" label="선행" />
                </th>
                <th className="p-2">
                  <CPMTerm term="duration" label="d (편집)" />
                </th>
                <th className="p-2">
                  <CPMTerm term="EST" />
                </th>
                <th className="p-2">
                  <CPMTerm term="EFT" />
                </th>
                <th className="p-2">
                  <CPMTerm term="LFT" />
                </th>
                <th className="p-2">
                  <CPMTerm term="LST" />
                </th>
                <th className="p-2">
                  <CPMTerm term="Slack" />
                </th>
                <th className="p-2">
                  <CPMTerm term="critical" label="임계" />
                </th>
              </tr>
            </thead>
            <tbody className="text-center font-mono">
              {cpm.order.map((id) => {
                const t = tasks.find((x) => x.id === id)!;
                const f = cpm.forward[id];
                const b = cpm.backward[id];
                const s = cpm.slack[id];
                const isCrit = s === 0;
                const isFocus = focus === id;
                return (
                  <tr
                    key={id}
                    onClick={() => setFocus(focus === id ? null : id)}
                    className={`cursor-pointer border-t border-gray-100 dark:border-gray-800 ${
                      isFocus
                        ? "bg-amber-50 font-bold dark:bg-amber-950/30"
                        : isCrit
                          ? "bg-red-50/60 font-bold text-red-700 dark:bg-red-950/20 dark:text-red-300"
                          : "hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20"
                    }`}
                  >
                    <td className="p-2">{id}</td>
                    <td className="p-2 text-[10px]">
                      {t.pred.length ? t.pred.join(",") : "-"}
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min={1}
                        value={t.duration}
                        onChange={(e) =>
                          updateDuration(id, Number(e.target.value) || 1)
                        }
                        className="w-12 rounded border border-gray-200 bg-transparent px-1 py-0.5 text-center text-[11px] dark:border-gray-700"
                      />
                    </td>
                    <td className="p-2">{f.est}</td>
                    <td className="p-2">{f.eft}</td>
                    <td className="p-2">{b.lft}</td>
                    <td className="p-2">{b.lst}</td>
                    <td className="p-2">{s}</td>
                    <td className="p-2">{isCrit ? "★" : ""}</td>
                  </tr>
                );
              })}
              <tr className="bg-emerald-50 dark:bg-emerald-950/30">
                <td colSpan={2} className="p-2 text-right font-bold">
                  프로젝트 최소 소요 기간 =
                </td>
                <td
                  colSpan={7}
                  className="p-2 text-left font-bold text-emerald-700 dark:text-emerald-300"
                >
                  {cpm.duration} (종료 작업의 EFT)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 타깃 작업 질의 모드 */}
        {focusTask && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border-2 border-amber-400 bg-amber-50/70 p-4 dark:border-amber-800 dark:bg-amber-950/30"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300">
              <Target size={15} /> 타깃 작업 질의 · 작업 {focusTask.id}
            </div>
            <p className="mt-1 text-[11px] text-amber-900/80 dark:text-amber-200/80">
              "{focusTask.id}의 EST / LST / Slack을 구하시오" 유형 연습.
            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <QueryCard
                label="EST"
                value={cpm.forward[focusTask.id].est}
                reason={cpm.forward[focusTask.id].reason}
              />
              <QueryCard
                label="LST"
                value={cpm.backward[focusTask.id].lst}
                reason={`LFT = ${cpm.backward[focusTask.id].lft}, LST = ${cpm.backward[focusTask.id].lft} − d(${focusTask.duration}) = ${cpm.backward[focusTask.id].lst}`}
              />
              <QueryCard
                label="Slack"
                value={cpm.slack[focusTask.id]}
                reason={`LST − EST = ${cpm.backward[focusTask.id].lst} − ${cpm.forward[focusTask.id].est} = ${cpm.slack[focusTask.id]}`}
              />
            </div>
            <div className="mt-2 text-[10px] text-amber-700 dark:text-amber-300">
              LFT 도출 과정: {cpm.backward[focusTask.id].reason}
            </div>
          </motion.div>
        )}

        {/* 경로 전수 탐색 */}
        <div className="mt-4 rounded-xl border border-emerald-200 bg-white p-4 dark:border-emerald-900/50 dark:bg-gray-900">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
            <Route size={15} /> 경로 전수 탐색 · 최장 경로 = 임계 경로
          </div>
          <p className="mb-3 text-[11px] text-gray-500">
            시작 → 종료 사이의 모든 가능 경로를 나열해 보면, 가장 긴 경로가 곧
            임계 경로. 계산 결과 검증용으로도 유용.
          </p>
          <div className="overflow-x-auto rounded-lg border border-emerald-100 dark:border-emerald-900/30">
            <table className="w-full text-[11px]">
              <thead className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300">
                <tr>
                  <th className="p-2 text-left">경로</th>
                  <th className="p-2">소요 시간</th>
                  <th className="p-2">임계?</th>
                </tr>
              </thead>
              <tbody>
                {cpm.paths.map((p, i) => (
                  <tr
                    key={i}
                    className={`border-t border-gray-100 dark:border-gray-800 ${
                      p.isCritical
                        ? "bg-red-50/60 font-bold text-red-700 dark:bg-red-950/20 dark:text-red-300"
                        : ""
                    }`}
                  >
                    <td className="p-2 font-mono">
                      {p.path.join(" → ")}
                    </td>
                    <td className="p-2 text-center font-mono">{p.length}</td>
                    <td className="p-2 text-center">
                      {p.isCritical ? "★" : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[10px] text-gray-500">
            ※ 경로 중 최댓값({cpm.duration})과 종료 작업 EFT({cpm.duration})가
            일치해야 계산 무오류.
          </p>
        </div>

        {/* 계산 단계 로그 */}
        <div className="relative z-0 mt-4 overflow-visible rounded-xl border border-emerald-200 bg-white p-4 dark:border-emerald-900/50 dark:bg-gray-900">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
            <ListChecks size={15} /> 단계별 도출 과정
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="mb-1 text-[11px] font-bold text-emerald-600">
                <CPMTerm term="forward" label="Forward Pass" /> (왼 → 오)
              </div>
              <ol className="space-y-1 text-[10px] text-gray-700 dark:text-gray-300">
                {cpm.order.map((id) => (
                  <li key={id} className="font-mono">
                    <strong className="text-emerald-700 dark:text-emerald-300">
                      {id}:
                    </strong>{" "}
                    {cpm.forward[id].reason}, EFT = {cpm.forward[id].eft}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <div className="mb-1 text-[11px] font-bold text-purple-600">
                <CPMTerm term="backward" label="Backward Pass" /> (오 → 왼)
              </div>
              <ol className="space-y-1 text-[10px] text-gray-700 dark:text-gray-300">
                {[...cpm.order].reverse().map((id) => {
                  const t = tasks.find((x) => x.id === id)!;
                  return (
                    <li key={id} className="font-mono">
                      <strong className="text-purple-700 dark:text-purple-300">
                        {id}:
                      </strong>{" "}
                      {cpm.backward[id].reason}, LST = {cpm.backward[id].lft} −
                      d({t.duration}) = {cpm.backward[id].lst}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Total vs Free Float */}
      <div className="mt-5 rounded-xl border border-emerald-200 bg-white p-5 dark:border-emerald-900/50 dark:bg-gray-900">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
          <Sparkles size={15} /> Total Float vs Free Float
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-emerald-50/60 p-3 dark:bg-emerald-950/30">
            <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              Total Float (총 여유)
            </div>
            <p className="mt-1 text-[11px] text-gray-700 dark:text-gray-300">
              프로젝트 완료일을 늦추지 않으면서 이 작업을 늦출 수 있는 최대
              시간. <span className="font-mono">TF = LST − EST</span>
            </p>
          </div>
          <div className="rounded-lg bg-amber-50/60 p-3 dark:bg-amber-950/30">
            <div className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
              Free Float (자유 여유)
            </div>
            <p className="mt-1 text-[11px] text-gray-700 dark:text-gray-300">
              <strong>후행 작업의 EST에 영향을 주지 않고</strong> 이 작업을
              늦출 수 있는 시간. 항상 Total Float 이하.
            </p>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-gray-500">
          과제 수준에서는 일반적으로 '여유 시간 = Total Float'을 의미. 문제에서
          별도 언급이 없다면 Total Float으로 답하면 됨.
        </p>
      </div>
    </section>
  );
}

function FormulaWithTooltip({
  label,
  formula,
}: {
  label: string;
  formula: string;
}) {
  return (
    <div className="relative z-0 overflow-visible rounded-lg border border-emerald-300 bg-white px-3 py-2 text-center font-mono text-xs text-emerald-700 dark:border-emerald-800 dark:bg-gray-900 dark:text-emerald-300">
      <CPMTerm term={label} /> <span className="ml-0.5">{formula}</span>
    </div>
  );
}

function QueryCard({
  label,
  value,
  reason,
}: {
  label: string;
  value: number;
  reason: string;
}) {
  return (
    <div className="relative z-0 overflow-visible rounded-lg border border-amber-200 bg-white p-3 dark:border-amber-900/40 dark:bg-gray-900">
      <div className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
        <CPMTerm term={label} />
      </div>
      <div className="mt-1 font-mono text-lg font-bold text-amber-800 dark:text-amber-200">
        {value}
      </div>
      <div className="mt-1 text-[10px] text-gray-500">{reason}</div>
    </div>
  );
}
