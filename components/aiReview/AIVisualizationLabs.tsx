"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import {
  Eye,
  GitBranch,
  Grid3X3,
  Layers,
  Network,
  RotateCcw,
  Sigma,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

type Tone = "cyan" | "emerald" | "rose" | "violet" | "amber";
type LabTheme = "teal" | "lime" | "sky" | "pink" | "amber" | "violet" | "emerald" | "rose" | "indigo";
type LabThemeStyle = CSSProperties & {
  "--lab-accent": string;
  "--lab-accent-soft": string;
  "--lab-border": string;
  "--lab-muted": string;
};

const toneClasses: Record<Tone, string> = {
  cyan: "bg-cyan-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
};

const labThemeStyles: Record<LabTheme, LabThemeStyle> = {
  teal: { "--lab-accent": "#0f766e", "--lab-accent-soft": "#ccfbf1", "--lab-border": "#99f6e4", "--lab-muted": "#f0fdfa" },
  lime: { "--lab-accent": "#4d7c0f", "--lab-accent-soft": "#d9f99d", "--lab-border": "#bef264", "--lab-muted": "#f7fee7" },
  sky: { "--lab-accent": "#0369a1", "--lab-accent-soft": "#bae6fd", "--lab-border": "#7dd3fc", "--lab-muted": "#f0f9ff" },
  pink: { "--lab-accent": "#be185d", "--lab-accent-soft": "#fbcfe8", "--lab-border": "#f9a8d4", "--lab-muted": "#fdf2f8" },
  amber: { "--lab-accent": "#b45309", "--lab-accent-soft": "#fde68a", "--lab-border": "#fcd34d", "--lab-muted": "#fffbeb" },
  violet: { "--lab-accent": "#6d28d9", "--lab-accent-soft": "#ddd6fe", "--lab-border": "#c4b5fd", "--lab-muted": "#f5f3ff" },
  emerald: { "--lab-accent": "#047857", "--lab-accent-soft": "#a7f3d0", "--lab-border": "#6ee7b7", "--lab-muted": "#ecfdf5" },
  rose: { "--lab-accent": "#be123c", "--lab-accent-soft": "#fecdd3", "--lab-border": "#fda4af", "--lab-muted": "#fff1f2" },
  indigo: { "--lab-accent": "#4338ca", "--lab-accent-soft": "#c7d2fe", "--lab-border": "#a5b4fc", "--lab-muted": "#eef2ff" },
};

function fmt(value: number) {
  if (!Number.isFinite(value)) return "-";
  return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

function softmax(values: number[]) {
  const max = Math.max(...values);
  const expValues = values.map((value) => Math.exp(value - max));
  const expSum = expValues.reduce((sum, value) => sum + value, 0);
  return expValues.map((value) => value / expSum);
}

function LabFrame({
  title,
  subtitle,
  icon,
  theme = "teal",
  children,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  theme?: LabTheme;
  children: ReactNode;
}) {
  return (
    <section
      style={labThemeStyles[theme]}
      className="rounded-lg border border-[color:var(--lab-border)] bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--lab-accent-soft)] text-[var(--lab-accent)] dark:bg-gray-950">
          {icon}
        </div>
        <SectionTitle title={title} subtitle={subtitle} />
      </div>
      {children}
    </section>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-[color:var(--lab-border)] bg-[var(--lab-muted)] p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 text-sm font-bold text-[var(--lab-accent)] dark:text-gray-100">{title}</div>
      {children}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="mb-3 block text-xs font-semibold text-gray-600 dark:text-gray-300">
      <div className="mb-1 flex items-center justify-between gap-3">
        <span>{label}</span>
        <span className="font-mono">{fmt(value)}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[var(--lab-accent)]"
      />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm dark:bg-gray-900">
      <span className="text-gray-600 dark:text-gray-300">{label}</span>
      <span className="font-mono font-bold">{typeof value === "number" ? fmt(value) : value}</span>
    </div>
  );
}

function Bar({ label, value, tone = "cyan" }: { label: string; value: number; tone?: Tone }) {
  const width = clamp(value, 0, 1) * 100;
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-xs font-semibold">
        <span>{label}</span>
        <span className="font-mono">{fmt(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
        <div className={`h-2 rounded-full transition-all ${toneClasses[tone]}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-3 py-2 text-xs font-bold transition ${
        active
          ? "border-[color:var(--lab-accent)] bg-[var(--lab-accent)] text-white"
          : "border-gray-200 bg-white text-gray-600 hover:border-[color:var(--lab-border)] dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
      }`}
    >
      {children}
    </button>
  );
}

function StepList({ steps, active }: { steps: string[]; active: number }) {
  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`rounded-md border px-3 py-2 text-xs leading-5 ${
            index <= active
              ? "border-[color:var(--lab-border)] bg-white text-[var(--lab-accent)] dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
              : "border-gray-200 bg-white text-gray-500 dark:border-gray-800 dark:bg-gray-900"
          }`}
        >
          <span className="mr-2 font-mono font-bold">{index + 1}</span>
          {step}
        </div>
      ))}
    </div>
  );
}

function triangular(x: number, left: number, peak: number, right: number) {
  if (x <= left || x >= right) return 0;
  if (x === peak) return 1;
  if (x < peak) return (x - left) / (peak - left);
  return (right - x) / (right - peak);
}

function FuzzyMembershipSketch({
  appleCount,
  age,
  water,
  twoish,
  young,
  high,
  slightlyHighFact,
}: {
  appleCount: number;
  age: number;
  water: number;
  twoish: number;
  young: number;
  high: number;
  slightlyHighFact: number;
}) {
  const appleX = 42 + appleCount * 52;
  const ageX = 40 + ((age - 5) / 55) * 220;
  const waterX = 40 + ((water - 1.6) / 1.6) * 220;

  return (
    <div className="rounded-lg border border-[color:var(--lab-border)] bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-[var(--lab-accent)]">소속함수 곡선으로 보는 모호성</div>
          <div className="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-300">
            crisp한 포함 여부가 아니라, 같은 대상이 여러 언어적 집합에 어느 정도 속하는지 비교.
          </div>
        </div>
        <div className="rounded-md bg-[var(--lab-muted)] px-3 py-2 text-xs font-bold text-[var(--lab-accent)]">
          μ 값 추적
        </div>
      </div>
      <svg viewBox="0 0 320 154" className="h-44 w-full rounded-md bg-[var(--lab-muted)]">
        <line x1="30" y1="128" x2="292" y2="128" stroke="#94a3b8" strokeWidth="1" />
        <line x1="30" y1="18" x2="30" y2="128" stroke="#94a3b8" strokeWidth="1" />
        <text x="8" y="20" className="fill-gray-500 text-[9px]">μ</text>
        <text x="282" y="145" className="fill-gray-500 text-[9px]">대상</text>

        <polyline points="52,128 104,22 156,76 208,128" fill="none" stroke="#65a30d" strokeWidth="4" strokeLinecap="round" />
        <circle cx={appleX} cy={128 - twoish * 106} r="6" fill="#65a30d" />
        <text x="54" y="118" className="fill-gray-700 text-[10px] dark:fill-gray-200">두어 개</text>

        <polyline points="40,22 100,22 260,128" fill="none" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
        <circle cx={ageX} cy={128 - young * 106} r="5" fill="#0284c7" />
        <text x="105" y="42" className="fill-gray-700 text-[10px] dark:fill-gray-200">젊은 나이</text>

        <polyline points="40,128 110,128 260,22" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        <circle cx={waterX} cy={128 - high * 106} r="5" fill="#f59e0b" />
        <circle cx={waterX} cy={128 - slightlyHighFact * 106} r="5" fill="#be185d" />
        <text x="186" y="62" className="fill-gray-700 text-[10px] dark:fill-gray-200">수위가 높다</text>
      </svg>
    </div>
  );
}

function VisionPipelineSketch({
  threshold,
  mode,
  quantLevels,
}: {
  threshold: number;
  mode: 4 | 8;
  quantLevels: number;
}) {
  const quantize = (value: number) => Math.floor(value / (256 / quantLevels)) * (256 / quantLevels);
  const steps = [
    { label: "원 영상", note: "화소 밝기 행렬" },
    { label: "양자화", note: `${quantLevels}단계 계조` },
    { label: "분할", note: `${threshold} 이상 객체` },
    { label: "연결성", note: `${mode}-이웃 판별` },
  ];

  return (
    <div className="rounded-lg border border-[color:var(--lab-border)] bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-2">
            <div className="rounded-md bg-[var(--lab-muted)] px-3 py-2">
              <div className="text-xs font-bold text-[var(--lab-accent)]">{step.label}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400">{step.note}</div>
            </div>
            {index < steps.length - 1 && <span className="text-[var(--lab-accent)]">→</span>}
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_0.8fr]">
        <div className="grid grid-cols-4 gap-1">
          {visionMatrix.flat().map((value, index) => (
            <div
              key={`raw-${index}`}
              className="flex aspect-square items-center justify-center rounded text-[10px] font-mono text-white"
              style={{ backgroundColor: `rgb(${value}, ${value}, ${value})` }}
            >
              {value}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-1">
          {visionMatrix.flat().map((value, index) => {
            const level = quantize(value);
            return (
              <div
                key={`quant-${index}`}
                className="flex aspect-square items-center justify-center rounded text-[10px] font-mono text-white"
                style={{ backgroundColor: `rgb(${level}, ${level}, ${level})` }}
              >
                {level}
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-4 gap-1">
          {visionMatrix.flat().map((value, index) => (
            <div
              key={`mask-${index}`}
              className={`flex aspect-square items-center justify-center rounded text-[10px] font-bold ${
                value >= threshold ? "bg-[var(--lab-accent)] text-white" : "bg-gray-200 text-gray-500 dark:bg-gray-800"
              }`}
            >
              {value >= threshold ? "1" : "0"}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1 self-center">
          {Array.from({ length: 9 }).map((_, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            const isCenter = row === 1 && col === 1;
            const isNeighbor = mode === 8 || row === 1 || col === 1;
            return (
              <div
                key={`neighbor-${index}`}
                className={`flex aspect-square items-center justify-center rounded-md border text-[10px] font-bold ${
                  isCenter
                    ? "border-[color:var(--lab-accent)] bg-[var(--lab-accent)] text-white"
                    : isNeighbor
                      ? "border-[color:var(--lab-border)] bg-[var(--lab-muted)] text-[var(--lab-accent)]"
                      : "border-gray-200 bg-white text-gray-300 dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                {isCenter ? "p" : isNeighbor ? "n" : ""}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ScatterCanvas({
  qx,
  qy,
  samples,
  nearest,
}: {
  qx: number;
  qy: number;
  samples: Array<{ x: number; y: number; cls: string }>;
  nearest: Array<{ x: number; y: number; cls: string; distance: number }>;
}) {
  const isNearest = (sample: { x: number; y: number; cls: string }) =>
    nearest.some((item) => item.x === sample.x && item.y === sample.y && item.cls === sample.cls);
  const sx = (x: number) => 36 + (x / 9) * 236;
  const sy = (y: number) => 142 - (y / 7) * 112;

  return (
    <div className="rounded-lg border border-[color:var(--lab-border)] bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 text-sm font-bold text-[var(--lab-accent)]">특징공간 지도</div>
      <svg viewBox="0 0 300 168" className="h-52 w-full rounded-md bg-[var(--lab-muted)]">
        <line x1="30" y1="146" x2="280" y2="146" stroke="#94a3b8" />
        <line x1="30" y1="18" x2="30" y2="146" stroke="#94a3b8" />
        <text x="264" y="162" className="fill-gray-500 text-[10px]">x1</text>
        <text x="8" y="24" className="fill-gray-500 text-[10px]">x2</text>
        {samples.map((sample, index) => (
          <g key={`${sample.cls}-${sample.x}-${sample.y}-${index}`}>
            <circle
              cx={sx(sample.x)}
              cy={sy(sample.y)}
              r={isNearest(sample) ? 10 : 7}
              fill={sample.cls === "A" ? "#10b981" : "#f43f5e"}
              opacity={isNearest(sample) ? 1 : 0.65}
              stroke={isNearest(sample) ? "#111827" : "transparent"}
              strokeWidth="2"
            />
            <text x={sx(sample.x) - 3} y={sy(sample.y) + 4} className="fill-white text-[9px] font-bold">
              {sample.cls}
            </text>
          </g>
        ))}
        <circle cx={sx(qx)} cy={sy(qy)} r="12" fill="#7c3aed" stroke="#fff" strokeWidth="3" />
        <text x={sx(qx) - 3} y={sy(qy) + 4} className="fill-white text-[10px] font-bold">Q</text>
        {nearest.map((sample) => (
          <line
            key={`line-${sample.x}-${sample.y}-${sample.cls}`}
            x1={sx(qx)}
            y1={sy(qy)}
            x2={sx(sample.x)}
            y2={sy(sample.y)}
            stroke="#7c3aed"
            strokeDasharray="4 4"
            strokeWidth="1.5"
            opacity="0.7"
          />
        ))}
      </svg>
      <div className="mt-2 text-xs leading-5 text-gray-600 dark:text-gray-300">
        굵은 테두리는 k-NN 투표에 들어간 이웃이며, Q에서 이어지는 점선이 실제 거리 비교 대상.
      </div>
    </div>
  );
}

function ConfusionMatrixCanvas({
  tp,
  fp,
  fn,
  tn,
  metricCells,
}: {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  metricCells: string[];
}) {
  const cells = [
    { id: "tp", title: "TP", label: "실제 양성 / 예측 양성", value: tp },
    { id: "fn", title: "FN", label: "실제 양성 / 예측 음성", value: fn },
    { id: "fp", title: "FP", label: "실제 음성 / 예측 양성", value: fp },
    { id: "tn", title: "TN", label: "실제 음성 / 예측 음성", value: tn },
  ];

  return (
    <div className="rounded-lg border border-[color:var(--lab-border)] bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-bold text-[var(--lab-accent)]">분할표 좌표계</div>
        <div className="text-[10px] font-bold text-gray-500">행: 실제값 / 열: 예측값</div>
      </div>
      <div className="grid grid-cols-[74px_1fr_1fr] gap-2 text-xs">
        <div />
        <div className="rounded-md bg-[var(--lab-muted)] p-2 text-center font-bold text-[var(--lab-accent)]">예측 양성</div>
        <div className="rounded-md bg-[var(--lab-muted)] p-2 text-center font-bold text-[var(--lab-accent)]">예측 음성</div>
        <div className="flex items-center justify-center rounded-md bg-[var(--lab-muted)] p-2 text-center font-bold text-[var(--lab-accent)]">
          실제 양성
        </div>
        {cells.slice(0, 2).map((cell) => (
          <div
            key={cell.id}
            className={`min-h-28 rounded-lg border p-3 ${
              metricCells.includes(cell.id)
                ? "border-[color:var(--lab-accent)] bg-[var(--lab-muted)]"
                : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            }`}
          >
            <div className="text-base font-black text-gray-900 dark:text-gray-50">{cell.title}</div>
            <div className="mt-1 text-[10px] leading-4 text-gray-500 dark:text-gray-400">{cell.label}</div>
            <div className="mt-2 font-mono text-2xl font-black text-[var(--lab-accent)]">{cell.value}</div>
          </div>
        ))}
        <div className="flex items-center justify-center rounded-md bg-[var(--lab-muted)] p-2 text-center font-bold text-[var(--lab-accent)]">
          실제 음성
        </div>
        {cells.slice(2).map((cell) => (
          <div
            key={cell.id}
            className={`min-h-28 rounded-lg border p-3 ${
              metricCells.includes(cell.id)
                ? "border-[color:var(--lab-accent)] bg-[var(--lab-muted)]"
                : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            }`}
          >
            <div className="text-base font-black text-gray-900 dark:text-gray-50">{cell.title}</div>
            <div className="mt-1 text-[10px] leading-4 text-gray-500 dark:text-gray-400">{cell.label}</div>
            <div className="mt-2 font-mono text-2xl font-black text-[var(--lab-accent)]">{cell.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LossTraceCanvas({
  trace,
  traceStep,
}: {
  trace: Array<{ w0: number; w1: number; mse: number }>;
  traceStep: number;
}) {
  const maxMse = Math.max(...trace.map((step) => step.mse), 0.001);
  const points = trace
    .map((step, index) => {
      const x = 34 + (index / (trace.length - 1)) * 232;
      const y = 134 - (step.mse / maxMse) * 104;
      return `${x},${y}`;
    })
    .join(" ");
  const selected = trace[traceStep];
  const selectedX = 34 + (traceStep / (trace.length - 1)) * 232;
  const selectedY = 134 - (selected.mse / maxMse) * 104;

  return (
    <div className="rounded-lg border border-[color:var(--lab-border)] bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 text-sm font-bold text-[var(--lab-accent)]">비용함수 하강 경로</div>
      <svg viewBox="0 0 300 158" className="h-52 w-full rounded-md bg-[var(--lab-muted)]">
        <line x1="28" y1="136" x2="274" y2="136" stroke="#94a3b8" />
        <line x1="28" y1="22" x2="28" y2="136" stroke="#94a3b8" />
        <polyline points={points} fill="none" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {trace.map((step, index) => {
          const x = 34 + (index / (trace.length - 1)) * 232;
          const y = 134 - (step.mse / maxMse) * 104;
          return <circle key={index} cx={x} cy={y} r={index === traceStep ? 6 : 3} fill={index === traceStep ? "#be185d" : "#7c3aed"} />;
        })}
        <text x="232" y="152" className="fill-gray-500 text-[10px]">iteration</text>
        <text x="5" y="24" className="fill-gray-500 text-[10px]">MSE</text>
        <text x={selectedX + 8} y={Math.max(18, selectedY - 8)} className="fill-gray-700 text-[10px] dark:fill-gray-200">
          k={traceStep}, {fmt(selected.mse)}
        </text>
      </svg>
      <div className="mt-2 grid gap-2 text-xs md:grid-cols-3">
        <Stat label="현재 w0" value={selected.w0} />
        <Stat label="현재 w1" value={selected.w1} />
        <Stat label="현재 MSE" value={selected.mse} />
      </div>
    </div>
  );
}

function NeuronSignalCanvas({
  x1,
  x2,
  w1,
  w2,
  bias,
  u,
  output,
}: {
  x1: number;
  x2: number;
  w1: number;
  w2: number;
  bias: number;
  u: number;
  output: number;
}) {
  const inputs = [
    { label: "x1", value: x1, weight: w1, y: 44 },
    { label: "x2", value: x2, weight: w2, y: 92 },
    { label: "b", value: 1, weight: bias, y: 140 },
  ];

  return (
    <div className="rounded-lg border border-[color:var(--lab-border)] bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 text-sm font-bold text-[var(--lab-accent)]">뉴런 신호 흐름</div>
      <svg viewBox="0 0 360 182" className="h-56 w-full rounded-md bg-[var(--lab-muted)]">
        {inputs.map((input) => (
          <g key={input.label}>
            <circle cx="44" cy={input.y} r="18" fill="#fff" stroke="#94a3b8" />
            <text x="35" y={input.y + 4} className="fill-gray-700 text-[11px] font-bold dark:fill-gray-200">{input.label}</text>
            <line x1="62" y1={input.y} x2="170" y2="92" stroke={input.weight >= 0 ? "#059669" : "#e11d48"} strokeWidth={Math.max(2, Math.abs(input.weight) * 3)} />
            <text x="88" y={input.y - 5} className="fill-gray-600 text-[10px] dark:fill-gray-300">
              {fmt(input.value)}×{fmt(input.weight)}
            </text>
          </g>
        ))}
        <circle cx="190" cy="92" r="34" fill="#fff" stroke="#10b981" strokeWidth="3" />
        <text x="178" y="88" className="fill-gray-800 text-[13px] font-bold dark:fill-gray-100">Σ</text>
        <text x="171" y="106" className="fill-gray-600 text-[10px] dark:fill-gray-300">u={fmt(u)}</text>
        <line x1="224" y1="92" x2="286" y2="92" stroke="#10b981" strokeWidth="3" markerEnd="url(#neuron-arrow)" />
        <rect x="286" y="68" width="54" height="48" rx="10" fill="#fff" stroke="#10b981" strokeWidth="2" />
        <text x="299" y="87" className="fill-gray-800 text-[12px] font-bold dark:fill-gray-100">f(u)</text>
        <text x="299" y="104" className="fill-gray-600 text-[10px] dark:fill-gray-300">y={fmt(output)}</text>
        <defs>
          <marker id="neuron-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#10b981" />
          </marker>
        </defs>
      </svg>
      <div className="mt-2 text-xs leading-5 text-gray-600 dark:text-gray-300">
        초록 연결은 흥분성, 빨간 연결은 금지 연결. 선 두께는 가중치 절댓값을 반영.
      </div>
    </div>
  );
}

function BackpropCanvas({ bpStep }: { bpStep: number }) {
  const nodes = [
    { id: "x", label: "입력", x: 48, y: 84 },
    { id: "h", label: "은닉", x: 146, y: 48 },
    { id: "o", label: "출력", x: 244, y: 84 },
    { id: "c", label: "손실", x: 244, y: 138 },
  ];
  const active = {
    x: bpStep >= 0,
    h: bpStep === 0 || bpStep >= 3,
    o: bpStep >= 0,
    c: bpStep >= 1,
  };

  return (
    <div className="rounded-lg border border-[color:var(--lab-border)] bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 text-sm font-bold text-[var(--lab-accent)]">순전파와 역전파 방향</div>
      <svg viewBox="0 0 300 176" className="h-52 w-full rounded-md bg-[var(--lab-muted)]">
        <defs>
          <marker id="bp-forward" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#e11d48" />
          </marker>
          <marker id="bp-backward" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#0f766e" />
          </marker>
        </defs>
        <path d="M66 84 C96 40 116 34 128 46" fill="none" stroke="#e11d48" strokeWidth={bpStep <= 1 ? 4 : 2} markerEnd="url(#bp-forward)" />
        <path d="M164 52 C198 48 214 58 226 78" fill="none" stroke="#e11d48" strokeWidth={bpStep <= 1 ? 4 : 2} markerEnd="url(#bp-forward)" />
        <path d="M244 102 L244 120" fill="none" stroke="#e11d48" strokeWidth={bpStep === 1 ? 4 : 2} markerEnd="url(#bp-forward)" />
        <path d="M229 130 C194 120 176 96 160 66" fill="none" stroke="#0f766e" strokeWidth={bpStep >= 2 ? 4 : 2} strokeDasharray="5 4" markerEnd="url(#bp-backward)" />
        <path d="M130 60 C98 64 82 76 66 84" fill="none" stroke="#0f766e" strokeWidth={bpStep >= 3 ? 4 : 2} strokeDasharray="5 4" markerEnd="url(#bp-backward)" />
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="22"
              fill={active[node.id as keyof typeof active] ? "#fff1f2" : "#fff"}
              stroke={active[node.id as keyof typeof active] ? "#e11d48" : "#94a3b8"}
              strokeWidth={active[node.id as keyof typeof active] ? 3 : 1}
            />
            <text x={node.x - 13} y={node.y + 4} className="fill-gray-800 text-[11px] font-bold dark:fill-gray-100">{node.label}</text>
          </g>
        ))}
        <text x="32" y="160" className="fill-gray-600 text-[10px] dark:fill-gray-300">빨강: 순전파 계산</text>
        <text x="160" y="160" className="fill-gray-600 text-[10px] dark:fill-gray-300">초록 점선: 오차 역전파</text>
      </svg>
    </div>
  );
}

function ConvolutionCanvas({
  inputSize,
  filter,
  stride,
  padding,
  outputSize,
  gradient,
  activeNeurons,
}: {
  inputSize: number;
  filter: number;
  stride: number;
  padding: number;
  outputSize: number;
  gradient: number;
  activeNeurons: number;
}) {
  const normalizedFilter = clamp(filter / Math.max(1, inputSize), 0.12, 0.8);
  const filterCells = Math.max(1, Math.min(4, filter));

  return (
    <div className="rounded-lg border border-[color:var(--lab-border)] bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-bold text-[var(--lab-accent)]">합성곱 수용야와 깊은 층 신호</div>
        <div className="rounded-md bg-[var(--lab-muted)] px-3 py-2 text-xs font-bold text-[var(--lab-accent)]">
          Sout={outputSize > 0 ? outputSize : "불가"}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_0.9fr]">
        <div className="relative aspect-square rounded-lg bg-[var(--lab-muted)] p-4">
          <div className="absolute inset-4 grid grid-cols-7 gap-1">
            {Array.from({ length: 49 }).map((_, index) => (
              <div key={index} className="rounded-sm bg-white/80 dark:bg-gray-900" />
            ))}
          </div>
          <div
            className="absolute rounded-md border-4 border-[color:var(--lab-accent)] bg-white/60"
            style={{
              left: `${22 + padding * 2}%`,
              top: `${20 + stride * 3}%`,
              width: `${normalizedFilter * 58}%`,
              height: `${normalizedFilter * 58}%`,
            }}
          >
            <div className="grid h-full w-full gap-0.5 p-1" style={{ gridTemplateColumns: `repeat(${filterCells}, minmax(0, 1fr))` }}>
              {Array.from({ length: filterCells * filterCells }).map((_, index) => (
                <div key={index} className="rounded-sm bg-[var(--lab-accent)]/60" />
              ))}
            </div>
          </div>
          <div className="absolute bottom-2 left-3 text-[10px] font-bold text-gray-600 dark:text-gray-300">
            입력 {inputSize}×{inputSize}, padding {padding}, stride {stride}
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-lg bg-[var(--lab-muted)] p-3">
          <div className="text-xs font-bold text-[var(--lab-accent)]">경사 전달</div>
          <div className="space-y-2">
            {[0.82, 0.55, 0.34, 0.2, 0.12, gradient].map((value, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="h-2 rounded-full bg-[var(--lab-accent)] transition-all" style={{ width: `${Math.max(4, clamp(value, 0, 1) * 100)}%` }} />
                <span className="w-10 font-mono text-[10px]">{fmt(value)}</span>
              </div>
            ))}
          </div>
          <div className="text-[10px] leading-4 text-gray-600 dark:text-gray-300">
            층을 거슬러 갈수록 미분값의 곱이 작아지는지 확인.
          </div>
        </div>
        <div className="rounded-lg bg-[var(--lab-muted)] p-3">
          <div className="mb-2 text-xs font-bold text-[var(--lab-accent)]">드롭아웃 마스크</div>
          <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className={`aspect-square rounded ${index < activeNeurons ? "bg-[var(--lab-accent)]" : "bg-gray-300 dark:bg-gray-800"}`}
              />
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-4 text-gray-600 dark:text-gray-300">
            훈련 시 일부 뉴런을 빼고, 평가 시에는 전체 네트워크를 사용.
          </p>
        </div>
      </div>
    </div>
  );
}

function SequenceArchitectureCanvas({ time, token, attention }: { time: number; token: number; attention: number[][] }) {
  const tokens = ["나는", "야구를", "좋아해"];

  return (
    <div className="rounded-lg border border-[color:var(--lab-border)] bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 text-sm font-bold text-[var(--lab-accent)]">깊은 모델 구조 비교</div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg bg-[var(--lab-muted)] p-3">
          <div className="mb-3 text-xs font-bold text-[var(--lab-accent)]">ResNet skip</div>
          <div className="relative h-28">
            <div className="absolute left-2 top-12 h-4 w-12 rounded bg-white text-center text-[10px] leading-4 dark:bg-gray-900">x</div>
            <div className="absolute left-24 top-8 h-12 w-20 rounded border border-[color:var(--lab-border)] bg-white text-center text-[10px] leading-12 dark:bg-gray-900">F(x)</div>
            <div className="absolute right-4 top-12 h-4 w-16 rounded bg-[var(--lab-accent)] text-center text-[10px] leading-4 text-white">F(x)+x</div>
            <div className="absolute left-14 top-14 h-0.5 w-10 bg-[var(--lab-accent)]" />
            <div className="absolute left-44 top-14 h-0.5 w-10 bg-[var(--lab-accent)]" />
            <div className="absolute left-8 top-20 h-8 w-44 rounded-b-full border-b-2 border-l-2 border-r-2 border-[color:var(--lab-accent)]" />
          </div>
        </div>
        <div className="rounded-lg bg-[var(--lab-muted)] p-3">
          <div className="mb-3 text-xs font-bold text-[var(--lab-accent)]">RNN unroll</div>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`rounded-md border px-3 py-4 text-xs font-bold ${index <= time ? "border-[color:var(--lab-accent)] bg-white text-[var(--lab-accent)]" : "border-gray-200 bg-white text-gray-400 dark:border-gray-800 dark:bg-gray-900"}`}>
                  h{index}
                </div>
                {index < 4 && <span className="text-[var(--lab-accent)]">→</span>}
              </div>
            ))}
          </div>
          <div className="mt-3 text-[10px] leading-4 text-gray-600 dark:text-gray-300">
            BPTT는 선택한 시점 h{time}에서 과거 방향으로 펼친 그래프를 따라 전파.
          </div>
        </div>
        <div className="rounded-lg bg-[var(--lab-muted)] p-3">
          <div className="mb-3 text-xs font-bold text-[var(--lab-accent)]">Self-attention</div>
          <div className="grid grid-cols-3 gap-1">
            {attention[token].map((value, index) => (
              <div key={tokens[index]} className="rounded-md bg-white p-2 text-center dark:bg-gray-900">
                <div className="text-[10px] font-bold">{tokens[index]}</div>
                <div className="mx-auto mt-2 h-16 w-4 rounded-full bg-gray-200 dark:bg-gray-800">
                  <div className="mt-auto rounded-full bg-[var(--lab-accent)]" style={{ height: `${value * 100}%` }} />
                </div>
                <div className="mt-1 font-mono text-[10px]">{fmt(value)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FuzzyLab() {
  const [appleCount, setAppleCount] = useState(2);
  const [age, setAge] = useState(25);
  const [water, setWater] = useState(2.6);
  const classicalTwoOrThree = appleCount === 2 || appleCount === 3 ? 1 : 0;
  const twoish = appleCount === 2 ? 1 : appleCount === 3 ? 0.5 : 0;
  const young = age <= 10 ? 1 : age >= 50 ? 0 : (50 - age) / 40;
  const veryYoung = age <= 15 ? 1 : age >= 35 ? 0 : (35 - age) / 20;
  const high = water <= 2 ? 0 : water >= 3 ? 1 : water - 2;
  const low = water <= 1.8 ? 1 : water >= 2.8 ? 0 : 2.8 - water;
  const slightlyHighFact = triangular(water, 2.1, 2.6, 3.1);
  const openAlpha = Math.min(high, slightlyHighFact);
  const closeAlpha = Math.min(low, slightlyHighFact);
  const combined = Math.max(openAlpha, closeAlpha);
  const valveAngle = openAlpha + closeAlpha === 0 ? 0 : (openAlpha * 70 + closeAlpha * 25) / (openAlpha + closeAlpha);

  return (
    <LabFrame title="퍼지이론 사례 흐름 실험실" subtitle="두어 개, 젊은 나이, 수위-밸브 제어를 따라 소속함수와 추론 순서를 확인" icon={<SlidersHorizontal size={18} />} theme="lime">
      <div className="mb-4">
        <FuzzyMembershipSketch
          appleCount={appleCount}
          age={age}
          water={water}
          twoish={twoish}
          young={young}
          high={high}
          slightlyHighFact={slightlyHighFact}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="1. '두어 개'를 집합으로 표현">
          <div className="mb-3 flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((count) => (
              <Toggle key={count} active={appleCount === count} onClick={() => setAppleCount(count)}>
                {count}개
              </Toggle>
            ))}
          </div>
          <Bar label="고전집합 {2,3}" value={classicalTwoOrThree} tone="cyan" />
          <Bar label="퍼지집합 '두어 개'" value={twoish} tone="emerald" />
          <div className="rounded-md bg-white p-3 text-xs leading-5 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
            고전집합은 2와 3을 모두 포함으로 처리하지만, 퍼지집합은 2에 더 높은 소속도를 줄 수 있다.
          </div>
        </Panel>

        <Panel title="2. '젊은 나이' 소속함수">
          <Slider label="나이" value={age} min={5} max={60} step={1} onChange={setAge} />
          <Bar label="젊은 나이" value={young} tone="cyan" />
          <Bar label="매우 젊은 나이" value={veryYoung} tone="violet" />
          <div className="rounded-md bg-white p-3 text-xs leading-5 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
            같은 나이라도 '젊다'와 '매우 젊다'에 동시에 다른 정도로 소속될 수 있다.
          </div>
        </Panel>

        <Panel title="3. 수위-밸브 퍼지추론">
          <Slider label="현재 수위(m)" value={water} min={1.6} max={3.2} step={0.1} onChange={setWater} />
          <Bar label="조건 A: 수위가 높다" value={high} tone="amber" />
          <Bar label="사실 A': 수위가 조금 높다" value={slightlyHighFact} tone="cyan" />
          <Bar label="규칙1 발화 α" value={openAlpha} tone="emerald" />
          <Bar label="규칙2 발화" value={closeAlpha} tone="rose" />
          <div className="space-y-2">
            <Stat label="결론 종합 max" value={combined} />
            <Stat label="비퍼지화 예시" value={`${fmt(valveAngle)}도 열기`} />
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <Panel title="Mamdani 추론 순서">
          <StepList
            active={3}
            steps={[
              `퍼지화: 현재 수위 ${fmt(water)}m를 언어적 레이블의 소속도로 변환`,
              `부분 정합: min(높다 ${fmt(high)}, 조금 높다 ${fmt(slightlyHighFact)}) = ${fmt(openAlpha)}`,
              "결론 제한: '밸브를 연다' 소속함수에서 α보다 큰 부분을 잘라 냄",
              `결론 종합과 비퍼지화: 열린 정도를 하나의 값 ${fmt(valveAngle)}도로 변환`,
            ]}
          />
        </Panel>
        <Panel title="연습문제 그림 맥락">
          <div className="rounded-md border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900">
            <img
              src="/official-exercises/img/%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5_07%EA%B0%95_Q03.jpg"
              alt="수위와 밸브 퍼지추론 연습문제 시각 자료"
              className="max-h-64 w-full rounded object-contain"
            />
          </div>
          <p className="mt-3 text-xs leading-5 text-gray-600 dark:text-gray-300">
            그림형 문제에서는 조건부와 관측 사실이 겹치는 최대값 α를 먼저 찾고, 결론부 소속함수를 그 높이로 제한한 뒤 보기와 대조한다.
          </p>
        </Panel>
      </div>
    </LabFrame>
  );
}

const visionMatrix = [
  [20, 35, 170, 190],
  [25, 160, 180, 70],
  [40, 55, 150, 210],
  [30, 45, 90, 220],
];

function Vision8Lab() {
  const [threshold, setThreshold] = useState(140);
  const [mode, setMode] = useState<4 | 8>(4);
  const [quantLevels, setQuantLevels] = useState(4);
  const objectCount = visionMatrix.flat().filter((value) => value >= threshold).length;
  const quantize = (value: number) => Math.floor(value / (256 / quantLevels)) * (256 / quantLevels);

  return (
    <LabFrame title="픽셀 연결성과 임계값 분할" subtitle="밝기 행렬을 직접 이진화하고 4-이웃/8-이웃 기준 차이를 판별" icon={<Grid3X3 size={18} />} theme="sky">
      <div className="mb-4">
        <VisionPipelineSketch threshold={threshold} mode={mode} quantLevels={quantLevels} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="처리 단계">
          <StepList active={2} steps={["영상 취득", "전처리", "영상 분할", "정규화", "영상 표현", "분석"]} />
        </Panel>
        <Panel title="이웃 연결성">
          <div className="mb-3 flex gap-2">
            <Toggle active={mode === 4} onClick={() => setMode(4)}>4-이웃</Toggle>
            <Toggle active={mode === 8} onClick={() => setMode(8)}>8-이웃</Toggle>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }).map((_, index) => {
              const row = Math.floor(index / 3);
              const col = index % 3;
              const isCenter = row === 1 && col === 1;
              const isNeighbor = mode === 8 || row === 1 || col === 1;
              return (
                <div
                  key={index}
                  className={`flex aspect-square items-center justify-center rounded border text-xs font-bold ${
                    isCenter
                      ? "border-teal-500 bg-teal-500 text-white"
                      : isNeighbor
                        ? "border-cyan-300 bg-cyan-100 text-cyan-700 dark:bg-cyan-950"
                        : "border-gray-200 bg-white text-gray-400 dark:border-gray-800 dark:bg-gray-900"
                  }`}
                >
                  {isCenter ? "p" : isNeighbor ? "n" : ""}
                </div>
              );
            })}
          </div>
        </Panel>
        <Panel title="임계치 분할">
          <Slider label="임계값" value={threshold} min={30} max={220} step={5} onChange={setThreshold} />
          <Slider label="양자화 단계" value={quantLevels} min={2} max={16} step={2} onChange={setQuantLevels} />
          <div className="grid grid-cols-4 gap-1">
            {visionMatrix.flat().map((value, index) => (
              <div
                key={`${value}-${index}`}
                className={`flex aspect-square items-center justify-center rounded text-[11px] font-mono ${
                  value >= threshold ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                }`}
                title={`quantized=${fmt(quantize(value))}`}
              >
                {value}
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Stat label="객체 픽셀 수" value={objectCount} />
          </div>
        </Panel>
      </div>
    </LabFrame>
  );
}

function Vision9Lab() {
  const [qx, setQx] = useState(4);
  const [qy, setQy] = useState(3);
  const [metric, setMetric] = useState<"euclidean" | "city" | "mahalanobis" | "bayes">("euclidean");
  const [k, setK] = useState(3);
  const [sigmaX, setSigmaX] = useState(2);
  const [sigmaY, setSigmaY] = useState(1.3);
  const [rho, setRho] = useState(0.35);
  const classA = { x: 2, y: 2, prior: 0.6, likelihood: 0.7 };
  const classB = { x: 7, y: 5, prior: 0.4, likelihood: 0.9 };
  const samples = [
    { x: 2, y: 2, cls: "A" },
    { x: 3, y: 4, cls: "A" },
    { x: 1, y: 5, cls: "A" },
    { x: 7, y: 5, cls: "B" },
    { x: 8, y: 3, cls: "B" },
    { x: 6, y: 2, cls: "B" },
    { x: 5, y: 6, cls: "B" },
  ];
  const euA = Math.hypot(qx - classA.x, qy - classA.y);
  const euB = Math.hypot(qx - classB.x, qy - classB.y);
  const cityA = Math.abs(qx - classA.x) + Math.abs(qy - classA.y);
  const cityB = Math.abs(qx - classB.x) + Math.abs(qy - classB.y);
  const bayesA = classA.prior * classA.likelihood;
  const bayesB = classB.prior * classB.likelihood;
  const mahalanobis = (center: { x: number; y: number }) => {
    const dx = (qx - center.x) / sigmaX;
    const dy = (qy - center.y) / sigmaY;
    const denom = Math.max(0.05, 1 - rho * rho);
    return Math.sqrt(Math.max(0, (dx * dx - 2 * rho * dx * dy + dy * dy) / denom));
  };
  const mahaA = mahalanobis(classA);
  const mahaB = mahalanobis(classB);
  const scoreA = metric === "euclidean" ? euA : metric === "city" ? cityA : metric === "mahalanobis" ? mahaA : -bayesA;
  const scoreB = metric === "euclidean" ? euB : metric === "city" ? cityB : metric === "mahalanobis" ? mahaB : -bayesB;
  const nearest = samples
    .map((sample) => ({ ...sample, distance: Math.hypot(qx - sample.x, qy - sample.y) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k);
  const voteA = nearest.filter((sample) => sample.cls === "A").length;
  const voteB = nearest.length - voteA;

  return (
    <LabFrame title="특징공간 거리와 분류 판정" subtitle="질의 특징 벡터를 움직이며 거리 기반 분류와 베이즈 판정을 비교" icon={<Target size={18} />} theme="pink">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
        <ScatterCanvas qx={qx} qy={qy} samples={samples} nearest={nearest} />
        <Panel title="질의 특징 벡터">
          <Slider label="x1" value={qx} min={0} max={9} step={1} onChange={setQx} />
          <Slider label="x2" value={qy} min={0} max={7} step={1} onChange={setQy} />
          <div className="grid grid-cols-10 gap-1">
            {Array.from({ length: 80 }).map((_, index) => {
              const x = index % 10;
              const y = 7 - Math.floor(index / 10);
              const here = x === qx && y === qy;
              const sample = samples.find((item) => item.x === x && item.y === y);
              return (
                <div
                  key={index}
                  className={`aspect-square rounded ${
                    here
                      ? "bg-violet-500"
                      : sample?.cls === "A"
                        ? "bg-emerald-500"
                        : sample?.cls === "B"
                          ? "bg-rose-500"
                          : "bg-gray-200 dark:bg-gray-800"
                  }`}
                />
              );
            })}
          </div>
        </Panel>
        <Panel title="분류 기준">
          <div className="mb-3 flex flex-wrap gap-2">
            <Toggle active={metric === "euclidean"} onClick={() => setMetric("euclidean")}>유클리드</Toggle>
            <Toggle active={metric === "city"} onClick={() => setMetric("city")}>도시블록</Toggle>
            <Toggle active={metric === "mahalanobis"} onClick={() => setMetric("mahalanobis")}>마할라노비스</Toggle>
            <Toggle active={metric === "bayes"} onClick={() => setMetric("bayes")}>베이즈</Toggle>
          </div>
          <Slider label="k-NN의 k" value={k} min={1} max={5} step={2} onChange={setK} />
          <div className="space-y-2">
            <Stat label="A 거리/점수" value={metric === "euclidean" ? euA : metric === "city" ? cityA : metric === "mahalanobis" ? mahaA : bayesA} />
            <Stat label="B 거리/점수" value={metric === "euclidean" ? euB : metric === "city" ? cityB : metric === "mahalanobis" ? mahaB : bayesB} />
            <Stat label="판정" value={scoreA <= scoreB ? "A" : "B"} />
            <Stat label="k-NN 투표" value={voteA >= voteB ? `A ${voteA}:${voteB}` : `B ${voteB}:${voteA}`} />
          </div>
        </Panel>
        <Panel title="개념 검산">
          <Slider label="마할라노비스 σx" value={sigmaX} min={0.8} max={4} step={0.1} onChange={setSigmaX} />
          <Slider label="마할라노비스 σy" value={sigmaY} min={0.8} max={4} step={0.1} onChange={setSigmaY} />
          <Slider label="상관 ρ" value={rho} min={-0.8} max={0.8} step={0.05} onChange={setRho} />
          <StepList
            active={3}
            steps={[
              "정규화로 크기·위치 차이 완화",
              "특징벡터를 특징공간의 점으로 표현",
              "거리측정자 또는 사후확률 기준 적용",
              "마할라노비스 거리는 분산·공분산으로 축의 성격을 반영",
              "가장 가까운 클래스 또는 큰 확률 선택",
            ]}
          />
          <div className="mt-4">
            <Bar label="PCA 1주성분 분산" value={0.72} tone="violet" />
            <Bar label="PCA 2주성분 분산" value={0.21} tone="cyan" />
            <Bar label="나머지 분산" value={0.07} tone="amber" />
          </div>
        </Panel>
      </div>
    </LabFrame>
  );
}

const inductiveSamples = [
  { score: 0.96, positive: true },
  { score: 0.9, positive: true },
  { score: 0.86, positive: false },
  { score: 0.82, positive: true },
  { score: 0.79, positive: false },
  { score: 0.75, positive: true },
  { score: 0.7, positive: true },
  { score: 0.66, positive: false },
  { score: 0.62, positive: true },
  { score: 0.59, positive: true },
  { score: 0.55, positive: false },
  { score: 0.52, positive: true },
  { score: 0.48, positive: false },
  { score: 0.45, positive: true },
  { score: 0.41, positive: false },
  { score: 0.38, positive: true },
  { score: 0.34, positive: true },
  { score: 0.31, positive: false },
  { score: 0.27, positive: true },
  { score: 0.24, positive: false },
  { score: 0.21, positive: true },
  { score: 0.18, positive: false },
  { score: 0.15, positive: false },
  { score: 0.12, positive: true },
];

function ML10Lab() {
  const [tp, setTp] = useState(18);
  const [fp, setFp] = useState(1);
  const [fn, setFn] = useState(2);
  const [tn, setTn] = useState(9);
  const [focus, setFocus] = useState<"tp" | "fp" | "fn" | "tn">("tp");
  const [metricFocus, setMetricFocus] = useState<"precision" | "recall" | "f1" | "accuracy" | "specificity">("precision");
  const [hypothesisThreshold, setHypothesisThreshold] = useState(0.5);
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1 = 2 * tp + fp + fn === 0 ? 0 : (2 * tp) / (2 * tp + fp + fn);
  const accuracy = tp + fp + fn + tn === 0 ? 0 : (tp + tn) / (tp + fp + fn + tn);
  const specificity = tn + fp === 0 ? 0 : tn / (tn + fp);
  const metricCells = {
    precision: ["tp", "fp"],
    recall: ["tp", "fn"],
    f1: ["tp", "fp", "fn"],
    accuracy: ["tp", "tn", "fp", "fn"],
    specificity: ["tn", "fp"],
  }[metricFocus];
  const metricFormula = {
    precision: "TP/(TP+FP)",
    recall: "TP/(TP+FN)",
    f1: "2TP/(2TP+FP+FN)",
    accuracy: "(TP+TN)/(TP+TN+FP+FN)",
    specificity: "TN/(TN+FP)",
  }[metricFocus];
  const focusText = {
    tp: "실제 양성을 양성으로 맞힌 경우",
    fp: "실제 음성을 양성으로 잘못 예측한 경우",
    fn: "실제 양성을 음성으로 놓친 경우",
    tn: "실제 음성을 음성으로 맞힌 경우",
  }[focus];
  const hypothesisCounts = inductiveSamples.reduce(
    (counts, sample) => {
      const predictedPositive = sample.score >= hypothesisThreshold;
      if (sample.positive && predictedPositive) counts.tp += 1;
      if (!sample.positive && predictedPositive) counts.fp += 1;
      if (sample.positive && !predictedPositive) counts.fn += 1;
      if (!sample.positive && !predictedPositive) counts.tn += 1;
      return counts;
    },
    { tp: 0, fp: 0, fn: 0, tn: 0 },
  );
  const hypothesisPrecision =
    hypothesisCounts.tp + hypothesisCounts.fp === 0 ? 0 : hypothesisCounts.tp / (hypothesisCounts.tp + hypothesisCounts.fp);
  const hypothesisRecall =
    hypothesisCounts.tp + hypothesisCounts.fn === 0 ? 0 : hypothesisCounts.tp / (hypothesisCounts.tp + hypothesisCounts.fn);

  return (
    <LabFrame title="분할표와 학습 유형 판별" subtitle="TP/FN/FP/TN 값을 바꿔 정밀도·재현율·F1·정확도를 검산" icon={<GitBranch size={18} />} theme="amber">
      <div className="mb-4">
        <ConfusionMatrixCanvas tp={tp} fp={fp} fn={fn} tn={tn} metricCells={metricCells} />
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        <Panel title="학습 유형 조건">
          <StepList active={3} steps={["레이블 있음: 지도학습", "입력만 있음: 비지도학습", "보상 있음: 강화학습", "기존 모델 미세조정: 전이학습"]} />
        </Panel>
        <Panel title="분할표 입력">
          <Slider label="TP" value={tp} min={0} max={30} step={1} onChange={setTp} />
          <Slider label="FP" value={fp} min={0} max={30} step={1} onChange={setFp} />
          <Slider label="FN" value={fn} min={0} max={30} step={1} onChange={setFn} />
          <Slider label="TN" value={tn} min={0} max={30} step={1} onChange={setTn} />
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {[
              { id: "tp", label: "실제 양성 / 예측 양성", name: "TP", value: tp },
              { id: "fn", label: "실제 양성 / 예측 음성", name: "FN", value: fn },
              { id: "fp", label: "실제 음성 / 예측 양성", name: "FP", value: fp },
              { id: "tn", label: "실제 음성 / 예측 음성", name: "TN", value: tn },
            ].map((cell) => (
              <button
                key={cell.id}
                type="button"
                onClick={() => setFocus(cell.id as "tp" | "fp" | "fn" | "tn")}
                className={`rounded-md border p-2 text-left ${
                  focus === cell.id || metricCells.includes(cell.id)
                    ? "border-teal-400 bg-teal-50 dark:bg-teal-950"
                    : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                <div className="font-bold">{cell.name}</div>
                <div className="text-[10px] leading-4 text-gray-500 dark:text-gray-400">{cell.label}</div>
                <div className="mt-1 font-mono">{cell.value}</div>
              </button>
            ))}
          </div>
        </Panel>
        <Panel title="지표 계산">
          <div className="mb-3 flex flex-wrap gap-2">
            {[
              ["precision", "정밀도"],
              ["recall", "재현율"],
              ["f1", "F1"],
              ["accuracy", "정확도"],
              ["specificity", "특이도"],
            ].map(([id, label]) => (
              <Toggle key={id} active={metricFocus === id} onClick={() => setMetricFocus(id as typeof metricFocus)}>
                {label}
              </Toggle>
            ))}
          </div>
          <div className="space-y-2">
            <Stat label="정밀도 TP/(TP+FP)" value={precision} />
            <Stat label="재현율 TP/(TP+FN)" value={recall} />
            <Stat label="F1" value={f1} />
            <Stat label="정확도" value={accuracy} />
            <Stat label="특이도 TN/(TN+FP)" value={specificity} />
          </div>
          <div className="mt-3 rounded-md bg-white p-3 text-xs leading-5 dark:bg-gray-900">
            <span className="font-bold">{focus.toUpperCase()}</span> {focusText}
            <div className="mt-2 rounded-md bg-teal-50 p-2 font-mono text-teal-800 dark:bg-teal-950 dark:text-teal-200">
              선택 지표: {metricFormula}
            </div>
          </div>
        </Panel>
        <Panel title="귀납 가설 경계">
          <Slider label="판정 임계치" value={hypothesisThreshold} min={0.15} max={0.9} step={0.05} onChange={setHypothesisThreshold} />
          <div className="mb-3 grid grid-cols-6 gap-1">
            {inductiveSamples.map((sample, index) => {
              const predictedPositive = sample.score >= hypothesisThreshold;
              const state = sample.positive && predictedPositive ? "TP" : !sample.positive && predictedPositive ? "FP" : sample.positive ? "FN" : "TN";
              return (
                <div
                  key={`${sample.score}-${index}`}
                  title={`${state} score=${fmt(sample.score)}`}
                  className={`aspect-square rounded ${
                    state === "TP"
                      ? "bg-emerald-500"
                      : state === "FP"
                        ? "bg-amber-400"
                        : state === "FN"
                          ? "bg-rose-500"
                          : "bg-gray-300 dark:bg-gray-800"
                  }`}
                />
              );
            })}
          </div>
          <div className="space-y-2">
            <Stat label="TP / FP" value={`${hypothesisCounts.tp} / ${hypothesisCounts.fp}`} />
            <Stat label="FN / TN" value={`${hypothesisCounts.fn} / ${hypothesisCounts.tn}`} />
            <Bar label="정밀도" value={hypothesisPrecision} tone="emerald" />
            <Bar label="재현율" value={hypothesisRecall} tone="rose" />
          </div>
          <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
            임계치를 높이면 가설이 엄격해져 양성 판정이 줄고, 보통 거짓 양성은 줄지만 거짓 음성이 늘 수 있음.
          </p>
        </Panel>
      </div>
    </LabFrame>
  );
}

const regressionSamples = [
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 3, y: 4 },
];

function ML11Lab() {
  const [w0, setW0] = useState(0.3);
  const [w1, setW1] = useState(0.5);
  const [eta, setEta] = useState(0.1);
  const [traceStep, setTraceStep] = useState(4);
  const [z1, setZ1] = useState(1.2);
  const [z2, setZ2] = useState(0.4);
  const [z3, setZ3] = useState(-0.6);
  const errors = regressionSamples.map((sample) => w0 + w1 * sample.x - sample.y);
  const mse = errors.reduce((sum, error) => sum + error * error, 0) / regressionSamples.length;
  const grad0 = (2 / regressionSamples.length) * errors.reduce((sum, error) => sum + error, 0);
  const grad1 = (2 / regressionSamples.length) * errors.reduce((sum, error, index) => sum + error * regressionSamples[index].x, 0);
  const nextW0 = w0 - eta * grad0;
  const nextW1 = w1 - eta * grad1;
  const curve = [-0.5, 0.2, 0.9, 1.6, 2.3].map((candidate) => {
    const candidateErrors = regressionSamples.map((sample) => w0 + candidate * sample.x - sample.y);
    return candidateErrors.reduce((sum, error) => sum + error * error, 0) / regressionSamples.length;
  });
  const maxCurve = Math.max(...curve);
  const trace = Array.from({ length: 9 }).reduce<Array<{ w0: number; w1: number; mse: number }>>((steps, _, index) => {
    if (index === 0) return [{ w0, w1, mse }];
    const previous = steps[index - 1];
    const stepErrors = regressionSamples.map((sample) => previous.w0 + previous.w1 * sample.x - sample.y);
    const stepGrad0 = (2 / regressionSamples.length) * stepErrors.reduce((sum, error) => sum + error, 0);
    const stepGrad1 = (2 / regressionSamples.length) * stepErrors.reduce((sum, error, sampleIndex) => sum + error * regressionSamples[sampleIndex].x, 0);
    const updatedW0 = previous.w0 - eta * stepGrad0;
    const updatedW1 = previous.w1 - eta * stepGrad1;
    const updatedErrors = regressionSamples.map((sample) => updatedW0 + updatedW1 * sample.x - sample.y);
    return [
      ...steps,
      {
        w0: updatedW0,
        w1: updatedW1,
        mse: updatedErrors.reduce((sum, error) => sum + error * error, 0) / regressionSamples.length,
      },
    ];
  }, []);
  const traceMax = Math.max(...trace.map((step) => step.mse), 0.001);
  const selectedTrace = trace[traceStep];
  const unstable = eta > 0.22 && trace[trace.length - 1].mse > trace[0].mse;
  const logits = [z1, z2, z3];
  const maxLogit = Math.max(...logits);
  const expValues = logits.map((value) => Math.exp(value - maxLogit));
  const expSum = expValues.reduce((sum, value) => sum + value, 0);
  const probabilities = softmax(logits);

  return (
    <LabFrame title="선형회귀와 경사하강 갱신" subtitle="가중치와 학습률을 바꿔 MSE와 다음 업데이트 값을 계산" icon={<Sigma size={18} />} theme="violet">
      <div className="mb-4">
        <LossTraceCanvas trace={trace} traceStep={traceStep} />
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        <Panel title="선형가설">
          <Slider label="w0" value={w0} min={-1} max={3} step={0.1} onChange={setW0} />
          <Slider label="w1" value={w1} min={-1} max={3} step={0.1} onChange={setW1} />
          <Stat label="MSE" value={mse} />
          <div className="mt-4 flex h-24 items-end gap-1 rounded-md bg-white p-2 dark:bg-gray-900">
            {curve.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t ${index === 2 ? "bg-violet-500" : "bg-cyan-400"}`}
                  style={{ height: `${Math.max(8, (value / maxCurve) * 72)}px` }}
                />
                <span className="text-[10px]">{fmt(value)}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="경사하강">
          <Slider label="η" value={eta} min={0.01} max={0.5} step={0.01} onChange={setEta} />
          <Slider label="반복 단계" value={traceStep} min={0} max={8} step={1} onChange={setTraceStep} />
          <div className="space-y-2">
            <Stat label="∂C/∂w0" value={grad0} />
            <Stat label="∂C/∂w1" value={grad1} />
            <Stat label="다음 w0" value={nextW0} />
            <Stat label="다음 w1" value={nextW1} />
            <Stat label={`k=${traceStep} MSE`} value={selectedTrace.mse} />
          </div>
          <div className="mt-4 flex h-24 items-end gap-1 rounded-md bg-white p-2 dark:bg-gray-900">
            {trace.map((step, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t ${index === traceStep ? "bg-violet-500" : "bg-teal-400"}`}
                  style={{ height: `${Math.max(6, (step.mse / traceMax) * 72)}px` }}
                />
                <span className="text-[10px]">{index}</span>
              </div>
            ))}
          </div>
          {unstable && (
            <div className="mt-3 rounded-md bg-rose-50 p-2 text-xs leading-5 text-rose-800 dark:bg-rose-950 dark:text-rose-200">
              학습률이 커서 진동하거나 비용이 커질 수 있음.
            </div>
          )}
        </Panel>
        <Panel title="k-means 한 단계">
          <StepList active={2} steps={["초기 중심 C1=2, C2=8", "표본을 가까운 중심에 할당", "각 군집 평균으로 중심 갱신", "중심 변화가 작을 때까지 반복"]} />
        </Panel>
        <Panel title="다항 로지스틱 소프트맥스">
          <Slider label="z1" value={z1} min={-3} max={3} step={0.1} onChange={setZ1} />
          <Slider label="z2" value={z2} min={-3} max={3} step={0.1} onChange={setZ2} />
          <Slider label="z3" value={z3} min={-3} max={3} step={0.1} onChange={setZ3} />
          {probabilities.map((value, index) => (
            <Bar key={index} label={`P(class ${index + 1})`} value={value} tone={index === 0 ? "violet" : index === 1 ? "cyan" : "amber"} />
          ))}
          <div className="space-y-2">
            <Stat label="exp 합" value={expSum} />
            <Stat label="확률 합" value={probabilities.reduce((sum, value) => sum + value, 0)} />
            <Stat label="판정" value={`class ${probabilities.indexOf(Math.max(...probabilities)) + 1}`} />
          </div>
          <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
            소프트맥스는 클래스별 선형 점수를 확률분포로 바꿔 전체 합이 1이 되게 함.
          </p>
        </Panel>
      </div>
    </LabFrame>
  );
}

function NN12Lab() {
  const [x1, setX1] = useState(1);
  const [x2, setX2] = useState(2);
  const [w1, setW1] = useState(0.6);
  const [w2, setW2] = useState(-0.4);
  const [bias, setBias] = useState(0.2);
  const [fn, setFn] = useState<"step" | "sigmoid" | "tanh" | "relu">("sigmoid");
  const u = x1 * w1 + x2 * w2 + bias;
  const output = fn === "step" ? (u >= 0 ? 1 : 0) : fn === "sigmoid" ? sigmoid(u) : fn === "tanh" ? Math.tanh(u) : Math.max(0, u);

  return (
    <LabFrame title="뉴런 계산과 XOR 한계" subtitle="가중합, 활성함수, 흥분성/금지 연결, 선형 분리 한계를 함께 확인" icon={<Network size={18} />} theme="emerald">
      <div className="mb-4">
        <NeuronSignalCanvas x1={x1} x2={x2} w1={w1} w2={w2} bias={bias} u={u} output={output} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="뉴런 입력">
          <Slider label="x1" value={x1} min={-3} max={3} step={1} onChange={setX1} />
          <Slider label="x2" value={x2} min={-3} max={3} step={1} onChange={setX2} />
          <Slider label="w1" value={w1} min={-2} max={2} step={0.1} onChange={setW1} />
          <Slider label="w2" value={w2} min={-2} max={2} step={0.1} onChange={setW2} />
          <Slider label="b" value={bias} min={-2} max={2} step={0.1} onChange={setBias} />
        </Panel>
        <Panel title="활성함수">
          <div className="mb-3 flex flex-wrap gap-2">
            {(["step", "sigmoid", "tanh", "relu"] as const).map((item) => (
              <Toggle key={item} active={fn === item} onClick={() => setFn(item)}>{item}</Toggle>
            ))}
          </div>
          <div className="space-y-2">
            <Stat label="u=Σxw+b" value={u} />
            <Stat label="y=f(u)" value={output} />
            <Stat label="w1 연결" value={w1 >= 0 ? "흥분성" : "금지"} />
          </div>
        </Panel>
        <Panel title="XOR 판별">
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            {["00→0", "01→1", "10→1", "11→0"].map((item) => (
              <div key={item} className="rounded-md bg-white p-3 font-mono font-bold dark:bg-gray-900">{item}</div>
            ))}
          </div>
          <div className="mt-3 rounded-md bg-rose-50 p-3 text-xs leading-5 text-rose-800 dark:bg-rose-950 dark:text-rose-200">
            XOR는 양성 점이 대각선에 놓여 단층 퍼셉트론의 하나의 직선으로 분리되지 않음.
          </div>
        </Panel>
      </div>
    </LabFrame>
  );
}

function NN13Lab() {
  const [eta, setEta] = useState(0.2);
  const [delta, setDelta] = useState(0.4);
  const [out, setOut] = useState(0.7);
  const [momentum, setMomentum] = useState(0.6);
  const [prev, setPrev] = useState(-0.05);
  const [bpStep, setBpStep] = useState(2);
  const dw = -eta * delta * out + momentum * prev;
  const hiddenOut = 0.62;
  const yHat = 0.73;
  const y = 1;
  const outputDelta = (yHat - y) * yHat * (1 - yHat);
  const hiddenDelta = outputDelta * 0.8 * hiddenOut * (1 - hiddenOut);
  const bpCards = [
    ["순전파", `은닉 출력 o=${fmt(hiddenOut)}, 최종 출력 yhat=${fmt(yHat)}`],
    ["손실", `C=1/2(yhat-y)^2=${fmt(0.5 * (yHat - y) ** 2)}`],
    ["출력층 δ", `δ=(yhat-y)yhat(1-yhat)=${fmt(outputDelta)}`],
    ["은닉층 δ", `δh=δout*w*oh(1-oh)=${fmt(hiddenDelta)}`],
    ["가중치 갱신", `Δw=-ηδo=${fmt(-eta * outputDelta * hiddenOut)}`],
  ];

  return (
    <LabFrame title="역전파와 모멘텀 갱신" subtitle="순전파 뒤 출력층에서 은닉층 방향으로 체인 룰과 Δw를 추적" icon={<RotateCcw size={18} />} theme="rose">
      <div className="mb-4">
        <BackpropCanvas bpStep={bpStep} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="역전파 단계">
          <Slider label="추적 단계" value={bpStep} min={0} max={4} step={1} onChange={setBpStep} />
          <StepList active={bpStep} steps={["입력층에서 출력 계산", "손실함수 계산", "출력층 δ 계산", "은닉층 δ 전달", "가중치 갱신"]} />
          <div className="mt-3 rounded-md bg-white p-3 text-xs leading-5 dark:bg-gray-900">
            <div className="font-bold text-teal-700 dark:text-teal-300">{bpCards[bpStep][0]}</div>
            <div className="mt-1 font-mono">{bpCards[bpStep][1]}</div>
          </div>
        </Panel>
        <Panel title="Δw 계산">
          <Slider label="η" value={eta} min={0.01} max={0.5} step={0.01} onChange={setEta} />
          <Slider label="δ" value={delta} min={-1} max={1} step={0.05} onChange={setDelta} />
          <Slider label="o" value={out} min={0} max={1} step={0.05} onChange={setOut} />
          <Slider label="α" value={momentum} min={0} max={1} step={0.05} onChange={setMomentum} />
          <Slider label="이전 Δw" value={prev} min={-0.5} max={0.5} step={0.05} onChange={setPrev} />
          <Stat label="Δw=-ηδo+αΔw이전" value={dw} />
        </Panel>
        <Panel title="구조 비교">
          <StepList active={2} steps={["RBM: 가시층-은닉층 층간연결만 존재", "SOM: 비지도 경쟁학습", "LVQ: 지도 경쟁학습"]} />
        </Panel>
      </div>
    </LabFrame>
  );
}

function DL14Lab() {
  const [layers, setLayers] = useState(8);
  const [derivative, setDerivative] = useState(0.25);
  const [inputSize, setInputSize] = useState(28);
  const [filter, setFilter] = useState(5);
  const [stride, setStride] = useState(2);
  const [padding, setPadding] = useState(2);
  const [inChannels, setInChannels] = useState(1);
  const [outChannels, setOutChannels] = useState(6);
  const [dropout, setDropout] = useState(0.4);
  const gradient = derivative ** layers;
  const outputSize = Math.floor((inputSize - filter + 2 * padding) / stride + 1);
  const parameterCount = (filter * filter * inChannels + 1) * outChannels;
  const activeNeurons = Math.round(12 * (1 - dropout));

  return (
    <LabFrame title="경사 소멸과 CNN 출력 크기" subtitle="층 수·미분값·stride·padding을 바꿔 딥러닝 계산 기준을 검산" icon={<Layers size={18} />} theme="indigo">
      <div className="mb-4">
        <ConvolutionCanvas
          inputSize={inputSize}
          filter={filter}
          stride={stride}
          padding={padding}
          outputSize={outputSize}
          gradient={gradient}
          activeNeurons={activeNeurons}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="경사 소멸">
          <Slider label="층 수" value={layers} min={1} max={12} step={1} onChange={setLayers} />
          <Slider label="층당 미분값" value={derivative} min={0.05} max={0.95} step={0.05} onChange={setDerivative} />
          <Bar label="입력층까지 전달되는 경사" value={gradient} tone="rose" />
        </Panel>
        <Panel title="합성곱 파라미터">
          <Slider label="입력 크기" value={inputSize} min={8} max={64} step={1} onChange={setInputSize} />
          <Slider label="필터 크기" value={filter} min={1} max={9} step={1} onChange={setFilter} />
          <Slider label="stride" value={stride} min={1} max={4} step={1} onChange={setStride} />
          <Slider label="padding" value={padding} min={0} max={5} step={1} onChange={setPadding} />
          <Slider label="입력 채널" value={inChannels} min={1} max={8} step={1} onChange={setInChannels} />
          <Slider label="필터 수" value={outChannels} min={1} max={32} step={1} onChange={setOutChannels} />
        </Panel>
        <Panel title="검산">
          <Slider label="드롭아웃 비율" value={dropout} min={0} max={0.8} step={0.1} onChange={setDropout} />
          <div className="mb-3 grid grid-cols-6 gap-1">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className={`aspect-square rounded ${index < activeNeurons ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-800"}`}
              />
            ))}
          </div>
          <div className="space-y-2">
            <Stat label="Sout" value={outputSize > 0 ? outputSize : "불가"} />
            <Stat label="특징맵 수" value={outChannels} />
            <Stat label="파라미터 수" value={parameterCount} />
            <Stat label="드롭아웃" value="훈련 중 일시 제거" />
            <Stat label="평가 시" value="모든 뉴런 사용" />
          </div>
        </Panel>
      </div>
    </LabFrame>
  );
}

function DL15Lab() {
  const [fx, setFx] = useState(2.4);
  const [x, setX] = useState(1.6);
  const [time, setTime] = useState(3);
  const [token, setToken] = useState(1);
  const [gateInput, setGateInput] = useState(0.4);
  const [prevState, setPrevState] = useState(0.7);
  const attention = [
    [0.65, 0.25, 0.1],
    [0.15, 0.55, 0.3],
    [0.2, 0.35, 0.45],
  ];
  const forgetGate = sigmoid(1.3 * gateInput + 0.8 * prevState - 0.2);
  const inputGate = sigmoid(0.9 * gateInput - 0.4 * prevState + 0.1);
  const outputGate = sigmoid(0.7 * gateInput + 0.6 * prevState);
  const candidate = Math.tanh(1.1 * gateInput + 0.3 * prevState);
  const nextCell = forgetGate * prevState + inputGate * candidate;
  const nextHidden = outputGate * Math.tanh(nextCell);
  const gruUpdate = sigmoid(0.8 * gateInput + 0.4 * prevState);

  return (
    <LabFrame title="ResNet·RNN·Attention 구조 추적" subtitle="잔차 합산, 시간 펼침, self-attention 가중치를 시험 기준으로 확인" icon={<Eye size={18} />} theme="teal">
      <div className="mb-4">
        <SequenceArchitectureCanvas time={time} token={token} attention={attention} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Panel title="ResNet 잔차 블록">
          <Slider label="F(x)" value={fx} min={-4} max={4} step={0.1} onChange={setFx} />
          <Slider label="x" value={x} min={-4} max={4} step={0.1} onChange={setX} />
          <Stat label="H(x)=F(x)+x" value={fx + x} />
          <Stat label="채널 불일치" value="1x1 Conv로 보정" />
        </Panel>
        <Panel title="RNN unroll/BPTT">
          <Slider label="현재 시간 t" value={time} min={0} max={4} step={1} onChange={setTime} />
          <StepList active={time} steps={["h0 계산", "h1 계산", "h2 계산", "h3 계산", "h4 계산"]} />
          <div className="mt-3 rounded-md bg-violet-50 p-3 text-xs text-violet-800 dark:bg-violet-950 dark:text-violet-200">
            BPTT는 선택한 시점에서 0 방향으로 역순 전파.
          </div>
        </Panel>
        <Panel title="LSTM/GRU 게이트">
          <Slider label="xt" value={gateInput} min={-2} max={2} step={0.1} onChange={setGateInput} />
          <Slider label="ct-1" value={prevState} min={-2} max={2} step={0.1} onChange={setPrevState} />
          <Bar label="망각 게이트" value={forgetGate} tone="rose" />
          <Bar label="입력 게이트" value={inputGate} tone="cyan" />
          <Bar label="출력 게이트" value={outputGate} tone="emerald" />
          <div className="space-y-2">
            <Stat label="ct" value={nextCell} />
            <Stat label="ht" value={nextHidden} />
            <Stat label="GRU update" value={gruUpdate} />
          </div>
        </Panel>
        <Panel title="Transformer attention">
          <div className="mb-3 flex gap-2">
            {["나는", "야구를", "좋아해"].map((item, index) => (
              <Toggle key={item} active={token === index} onClick={() => setToken(index)}>{item}</Toggle>
            ))}
          </div>
          <div className="mb-3 grid grid-cols-3 gap-1">
            {attention.flat().map((value, index) => (
              <div
                key={index}
                className="flex aspect-square items-center justify-center rounded text-[10px] font-mono text-white"
                style={{ backgroundColor: `rgba(124, 58, 237, ${0.25 + value * 0.75})` }}
              >
                {fmt(value)}
              </div>
            ))}
          </div>
          {attention[token].map((value, index) => (
            <Bar key={index} label={["나는", "야구를", "좋아해"][index]} value={value} tone={index === token ? "violet" : "cyan"} />
          ))}
          <Stat label="순서 정보" value="positional encoding" />
        </Panel>
      </div>
    </LabFrame>
  );
}

export function AIVisualizationLab({ lectureId }: { lectureId: number }) {
  if (lectureId === 7) return <FuzzyLab />;
  if (lectureId === 8) return <Vision8Lab />;
  if (lectureId === 9) return <Vision9Lab />;
  if (lectureId === 10) return <ML10Lab />;
  if (lectureId === 11) return <ML11Lab />;
  if (lectureId === 12) return <NN12Lab />;
  if (lectureId === 13) return <NN13Lab />;
  if (lectureId === 14) return <DL14Lab />;
  if (lectureId === 15) return <DL15Lab />;
  return null;
}
