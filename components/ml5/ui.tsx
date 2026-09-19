/**
 * 5강 컴포넌트가 함께 쓰는 작은 표시 요소.
 * 상태가 없으므로 클라이언트 컴포넌트 안팎 어디서나 쓸 수 있다.
 */

import type { ReactNode } from "react";

export const ROSE = "#f43f5e";
export const SKY = "#0ea5e9";
export const AMBER = "#f59e0b";
export const VIOLET = "#8b5cf6";
export const EMERALD = "#10b981";
export const SLATE = "#94a3b8";
export const CLASS_COLORS = ["#e11d48", "#2563eb", "#059669", "#d97706", "#7c3aed"];

/** 흰 바탕 카드 */
export function Card({
  title,
  children,
  className = "",
}: {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      {title && <h3 className="mb-2 text-base font-bold">{title}</h3>}
      {children}
    </div>
  );
}

/** 정의·원문 강조 상자 */
export function DefinitionBox({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-900 dark:bg-rose-950/40">
      <p className="text-xs font-bold tracking-wide text-rose-600 dark:text-rose-400">{label}</p>
      <div className="mt-2 text-sm leading-relaxed text-gray-800 dark:text-gray-200">{children}</div>
    </div>
  );
}

/** 수식 한 줄 — 넓으면 가로 스크롤 */
export function Formula({
  children,
  tag,
  className = "",
}: {
  children: ReactNode;
  tag?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 overflow-x-auto rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800/60 ${className}`}
    >
      <div className="min-w-max font-mono text-sm text-gray-800 dark:text-gray-100">{children}</div>
      {tag && <span className="ml-auto shrink-0 text-[11px] text-gray-400">{tag}</span>}
    </div>
  );
}

/** 탭·토글 버튼 */
export function Pill({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        on
          ? "bg-rose-500 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

/** 계산 결과 한 칸 */
export function Stat({
  label,
  value,
  tone = "default",
}: {
  label: ReactNode;
  value: ReactNode;
  tone?: "default" | "good" | "bad" | "accent";
}) {
  const tones = {
    default: "bg-gray-50 dark:bg-gray-800/60",
    good: "bg-emerald-50 dark:bg-emerald-950/40",
    bad: "bg-amber-50 dark:bg-amber-950/40",
    accent: "bg-rose-50 dark:bg-rose-950/40",
  } as const;
  return (
    <div className={`rounded-lg px-3 py-2 ${tones[tone]}`}>
      <p className="text-[11px] text-gray-500">{label}</p>
      <p className="font-mono text-sm font-bold text-gray-800 dark:text-gray-100">{value}</p>
    </div>
  );
}

/** 행렬을 괄호 모양으로 표시 */
export function MatrixView({
  rows,
  digits = 2,
  highlightCol,
}: {
  rows: number[][];
  digits?: number;
  highlightCol?: number;
}) {
  return (
    <span className="inline-flex items-stretch align-middle font-mono text-xs">
      <span className="w-1.5 rounded-l border-y border-l border-gray-400 dark:border-gray-500" />
      <span className="grid gap-x-3 px-1.5 py-0.5" style={{ gridTemplateColumns: `repeat(${rows[0].length}, auto)` }}>
        {rows.flatMap((r, i) =>
          r.map((v, j) => (
            <span
              key={`${i}-${j}`}
              className={`text-right ${
                highlightCol === j ? "font-bold text-rose-600 dark:text-rose-400" : ""
              }`}
            >
              {Math.abs(v) < 1e-12 ? "0" : v.toFixed(digits)}
            </span>
          )),
        )}
      </span>
      <span className="w-1.5 rounded-r border-y border-r border-gray-400 dark:border-gray-500" />
    </span>
  );
}

/** 모식도·계산 방식 안내 */
export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
      {children}
    </p>
  );
}

/** [lo, hi] → [a, b] 선형 눈금 */
export function linScale(lo: number, hi: number, a: number, b: number) {
  return (v: number) => a + ((v - lo) / (hi - lo || 1)) * (b - a);
}

export const fmt = (v: number, d = 2) => (Math.abs(v) < 0.5 * 10 ** -d ? (0).toFixed(d) : v.toFixed(d));
