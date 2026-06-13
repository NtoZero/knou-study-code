"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, GitBranch, ListChecks, Play, Route } from "lucide-react";
import type {
  PastExamSolutionProcess,
  PastExamSolutionVariant,
  PastExamSolutionVisualFrame,
  PastExamSolutionVisualKind,
} from "./solutionProcessTypes";

type Tone = "cyan" | "indigo";

type Props = {
  process: PastExamSolutionProcess;
  tone: Tone;
};

const toneStyles: Record<
  Tone,
  {
    shell: string;
    badge: string;
    activeButton: string;
    passiveButton: string;
    accent: string;
    edge: string;
    progress: string;
  }
> = {
  cyan: {
    shell: "border-cyan-200 bg-cyan-50/80 dark:border-cyan-900 dark:bg-cyan-950/30",
    badge: "bg-cyan-700 text-white dark:bg-cyan-200 dark:text-cyan-950",
    activeButton: "border-cyan-600 bg-cyan-700 text-white dark:border-cyan-200 dark:bg-cyan-200 dark:text-cyan-950",
    passiveButton: "border-cyan-200 bg-white text-cyan-900 hover:bg-cyan-50 dark:border-cyan-900 dark:bg-slate-950 dark:text-cyan-100",
    accent: "text-cyan-700 dark:text-cyan-200",
    edge: "stroke-cyan-500",
    progress: "bg-cyan-700 dark:bg-cyan-200",
  },
  indigo: {
    shell: "border-indigo-200 bg-indigo-50/80 dark:border-indigo-900 dark:bg-indigo-950/30",
    badge: "bg-indigo-700 text-white dark:bg-indigo-200 dark:text-indigo-950",
    activeButton: "border-indigo-600 bg-indigo-700 text-white dark:border-indigo-200 dark:bg-indigo-200 dark:text-indigo-950",
    passiveButton: "border-indigo-200 bg-white text-indigo-900 hover:bg-indigo-50 dark:border-indigo-900 dark:bg-gray-950 dark:text-indigo-100",
    accent: "text-indigo-700 dark:text-indigo-200",
    edge: "stroke-indigo-500",
    progress: "bg-indigo-700 dark:bg-indigo-200",
  },
};

const visualLabels: Record<PastExamSolutionVisualKind, string> = {
  array: "배열 디버깅",
  formula: "식 추적",
  graph: "그래프 추적",
  network: "벡터 이동",
  sequence: "절차 순서",
  stack: "스택 추적",
  table: "표 갱신",
  tree: "트리 디버깅",
};

const variantStyles: Record<PastExamSolutionVariant, string> = {
  idle: "border-gray-200 bg-white text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200",
  active: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100",
  done: "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100",
  cut: "border-rose-300 bg-rose-50 text-rose-900 line-through dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-100",
  answer: "border-gray-900 bg-gray-950 text-white dark:border-white dark:bg-white dark:text-gray-950",
};

function classForVariant(variant: PastExamSolutionVariant | undefined) {
  return variantStyles[variant ?? "idle"];
}

function edgeStroke(variant: PastExamSolutionVariant | undefined, fallback: string) {
  if (variant === "cut") return "stroke-rose-500";
  if (variant === "done") return "stroke-emerald-500";
  if (variant === "answer") return "stroke-gray-950 dark:stroke-white";
  if (variant === "active") return "stroke-amber-500";
  return fallback;
}

function GraphVisual({ frame, tone }: { frame: PastExamSolutionVisualFrame; tone: Tone }) {
  const nodes = frame.nodes ?? [];
  const nodeById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  if (nodes.length === 0) return null;

  return (
    <div className="relative min-h-[320px] overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 sm:min-h-[380px]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {(frame.edges ?? []).map((edge) => {
          const from = nodeById.get(edge.from);
          const to = nodeById.get(edge.to);
          if (!from || !to) return null;
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          return (
            <g key={`${edge.from}-${edge.to}-${edge.label ?? ""}`}>
              <motion.line
                initial={{ pathLength: 0, opacity: 0.35 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className={`${edgeStroke(edge.variant, toneStyles[tone].edge)} stroke-[0.7]`}
              />
              {edge.label && (
                <text x={midX} y={midY - 1} textAnchor="middle" className="fill-gray-500 text-[3px] font-bold dark:fill-gray-300">
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className={`absolute flex min-h-10 min-w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border px-2 py-1 text-center text-xs font-black shadow-sm ${classForVariant(node.variant)}`}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          {node.label}
        </motion.div>
      ))}
    </div>
  );
}

function ArrayVisual({ frame }: { frame: PastExamSolutionVisualFrame }) {
  if (!frame.array) return null;
  return (
    <div className="flex min-h-[180px] flex-wrap content-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      {frame.array.map((cell, index) => (
        <motion.div
          key={`${cell.label ?? index}-${cell.value}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03, duration: 0.16 }}
          className={`min-w-16 rounded-lg border px-3 py-2 text-center text-sm font-black ${classForVariant(cell.variant)}`}
        >
          {cell.label && <div className="mb-1 text-[11px] font-bold opacity-70">{cell.label}</div>}
          {cell.value}
        </motion.div>
      ))}
    </div>
  );
}

function FormulaVisual({ frame }: { frame: PastExamSolutionVisualFrame }) {
  if (!frame.formula) return null;
  return (
    <div className="flex min-h-[180px] flex-wrap items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      {frame.formula.map((part, index) => (
        <motion.code
          key={`${part.value}-${index}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04, duration: 0.16 }}
          className={`rounded-md border px-2 py-1 text-sm font-black ${classForVariant(part.variant)}`}
        >
          {part.value}
        </motion.code>
      ))}
    </div>
  );
}

function TableVisual({ frame }: { frame: PastExamSolutionVisualFrame }) {
  if (!frame.table) return null;
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <table className="w-full min-w-[420px] border-collapse text-sm">
        <thead>
          <tr>
            {frame.table.columns.map((column) => (
              <th key={column} className="border-b border-gray-200 px-3 py-2 text-left text-xs font-black text-gray-500 dark:border-gray-800 dark:text-gray-400">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {frame.table.rows.map((row, index) => (
            <motion.tr
              key={`${row.label ?? index}-${row.cells.join("|")}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.04, duration: 0.16 }}
              className={row.variant === "answer" ? "bg-gray-950 text-white dark:bg-white dark:text-gray-950" : row.variant === "active" ? "bg-amber-50 dark:bg-amber-950/40" : ""}
            >
              {row.cells.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="border-b border-gray-100 px-3 py-2 font-semibold dark:border-gray-800">
                  {cell}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DebugVisual({ frame, tone }: { frame: PastExamSolutionVisualFrame; tone: Tone }) {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-sm font-black text-gray-950 dark:text-gray-50">{frame.title}</div>
        <p className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-200">{frame.caption}</p>
      </div>
      <GraphVisual frame={frame} tone={tone} />
      <ArrayVisual frame={frame} />
      <FormulaVisual frame={frame} />
      <TableVisual frame={frame} />
    </div>
  );
}

export default function SolutionProcessPanel({ process, tone }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const styles = toneStyles[tone];
  const frame = process.visual.frames[Math.min(activeStep, process.visual.frames.length - 1)];
  const active = process.steps[activeStep] ?? process.steps[0];
  const lastStep = process.steps.length - 1;
  const goPrevious = () => setActiveStep((step) => Math.max(0, step - 1));
  const goNext = () => setActiveStep((step) => Math.min(lastStep, step + 1));

  return (
    <section className={`rounded-lg border p-4 ${styles.shell}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className={`mb-2 inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-black ${styles.badge}`}>
            <Route size={14} />
            풀이과정
          </div>
          <h3 className="text-base font-black text-gray-950 dark:text-gray-50">{process.title}</h3>
          <div className="mt-2 rounded-md border border-white/70 bg-white/80 px-3 py-2 text-sm leading-6 text-gray-700 dark:border-gray-800 dark:bg-gray-950/70 dark:text-gray-200">
            <span className="font-black text-gray-950 dark:text-gray-50">풀이 방향: </span>
            {process.overview}
          </div>
        </div>
        <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-xs font-black text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-950/80 dark:text-gray-300">
          <GitBranch size={13} className={styles.accent} />
          {visualLabels[process.visual.kind]}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-black text-gray-950 dark:text-gray-50">
            <Play size={15} className={styles.accent} />
            큰 흐름 창
          </div>
          <div className="text-xs font-black text-gray-500 dark:text-gray-400">
            {activeStep + 1} / {process.steps.length}
          </div>
        </div>
        <DebugVisual key={`${process.title}-${activeStep}`} frame={frame} tone={tone} />

        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
            <div
              className={`h-full rounded-full ${styles.progress}`}
              style={{ width: `${((activeStep + 1) / process.steps.length) * 100}%` }}
            />
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="text-xs font-black uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Step {activeStep + 1}
              </div>
              <div className="mt-1 text-base font-black text-gray-950 dark:text-gray-50">{active.title}</div>
              <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-200">{active.body}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={goPrevious}
                disabled={activeStep === 0}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-800"
                aria-label="이전 풀이 단계"
              >
                <ChevronLeft size={17} />
              </button>
              <div className="flex items-center gap-1">
                {process.steps.map((step, index) => (
                  <button
                    key={`${process.title}-footer-${step.title}`}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm font-black transition-colors ${
                      activeStep === index ? styles.activeButton : styles.passiveButton
                    }`}
                    aria-label={`${index + 1}단계 보기`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={goNext}
                disabled={activeStep === lastStep}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-800"
                aria-label="다음 풀이 단계"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-semibold leading-6 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200">
        <ListChecks size={14} className={`mr-1 inline ${styles.accent}`} />
        {process.checkpoint}
      </div>
    </section>
  );
}
