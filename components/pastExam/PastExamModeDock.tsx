"use client";

import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  ListChecks,
  Minimize2,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

type Tone = "cyan" | "indigo" | "emerald";
export type PastExamReviewScope = "visible" | "year";

type PastExamModeDockProps = {
  tone: Tone;
  scope: PastExamReviewScope;
  totalScopeLabel?: string;
  visibleCount: number;
  totalCount: number;
  answeredCount: number;
  answerRevealedCount: number;
  explanationExpandedCount: number;
  correctCount: number;
  wrongCount: number;
  visibleAnswerRevealedCount: number;
  visibleExplanationExpandedCount: number;
  onScopeChange: (scope: PastExamReviewScope) => void;
  onRevealAnswers: () => void;
  onHideAnswers: () => void;
  onExpandExplanations: () => void;
  onCollapseExplanations: () => void;
  onResetProgress: () => void;
};

const toneStyles: Record<Tone, {
  border: string;
  badge: string;
  primary: string;
  subtle: string;
  text: string;
  ring: string;
}> = {
  cyan: {
    border: "border-cyan-200 dark:border-cyan-900",
    badge: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-100",
    primary: "bg-cyan-700 text-white hover:bg-cyan-800",
    subtle: "border-cyan-200 bg-cyan-50 text-cyan-800 hover:bg-cyan-100 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-100 dark:hover:bg-cyan-950",
    text: "text-cyan-800 dark:text-cyan-100",
    ring: "ring-cyan-200 dark:ring-cyan-900",
  },
  indigo: {
    border: "border-indigo-200 dark:border-indigo-900",
    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200",
    primary: "bg-indigo-700 text-white hover:bg-indigo-800",
    subtle: "border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-100 dark:hover:bg-indigo-950",
    text: "text-indigo-800 dark:text-indigo-100",
    ring: "ring-indigo-200 dark:ring-indigo-900",
  },
  emerald: {
    border: "border-emerald-200 dark:border-emerald-900",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
    primary: "bg-emerald-700 text-white hover:bg-emerald-800",
    subtle: "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100 dark:hover:bg-emerald-950",
    text: "text-emerald-800 dark:text-emerald-100",
    ring: "ring-emerald-200 dark:ring-emerald-900",
  },
};

export default function PastExamModeDock({
  tone,
  scope,
  totalScopeLabel = "연도 전체",
  visibleCount,
  totalCount,
  answeredCount,
  answerRevealedCount,
  explanationExpandedCount,
  correctCount,
  wrongCount,
  visibleAnswerRevealedCount,
  visibleExplanationExpandedCount,
  onScopeChange,
  onRevealAnswers,
  onHideAnswers,
  onExpandExplanations,
  onCollapseExplanations,
  onResetProgress,
}: PastExamModeDockProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const styles = toneStyles[tone];
  const scopeTotal = scope === "visible" ? visibleCount : totalCount;
  const scopeAnswerCount = scope === "visible" ? visibleAnswerRevealedCount : answerRevealedCount;
  const scopeExplanationCount =
    scope === "visible" ? visibleExplanationExpandedCount : explanationExpandedCount;
  const resetDisabled =
    answeredCount === 0 && answerRevealedCount === 0 && explanationExpandedCount === 0;

  const panel = (
    <ModePanel
      styles={styles}
      scope={scope}
      visibleCount={visibleCount}
      totalCount={totalCount}
      answeredCount={answeredCount}
      answerRevealedCount={answerRevealedCount}
      explanationExpandedCount={explanationExpandedCount}
      correctCount={correctCount}
      wrongCount={wrongCount}
      scopeTotal={scopeTotal}
      scopeAnswerCount={scopeAnswerCount}
      scopeExplanationCount={scopeExplanationCount}
      resetDisabled={resetDisabled}
      totalScopeLabel={totalScopeLabel}
      onScopeChange={onScopeChange}
      onRevealAnswers={onRevealAnswers}
      onHideAnswers={onHideAnswers}
      onExpandExplanations={onExpandExplanations}
      onCollapseExplanations={onCollapseExplanations}
      onResetProgress={onResetProgress}
      onCollapseDesktop={() => setDesktopCollapsed(true)}
      onCloseMobile={() => setMobileOpen(false)}
    />
  );

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 hidden lg:block">
        {desktopCollapsed ? (
          <button
            type="button"
            onClick={() => setDesktopCollapsed(false)}
            className={`flex w-[236px] items-center gap-3 rounded-lg border bg-white p-3 text-left shadow-xl transition-transform hover:-translate-y-0.5 dark:bg-gray-950 ${styles.border}`}
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${styles.badge}`}>
              <SlidersHorizontal size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-black text-gray-500">풀이 모드</span>
              <span className="mt-0.5 block truncate text-sm font-black text-gray-950 dark:text-gray-50">
                정답 {answerRevealedCount}/{totalCount} · 해설 {explanationExpandedCount}/{totalCount}
              </span>
            </span>
            <ChevronUp size={18} className={styles.text} />
          </button>
        ) : (
          <div className="w-[288px]">{panel}</div>
        )}
      </div>

      <div className="lg:hidden">
        {mobileOpen && (
          <button
            type="button"
            aria-label="풀이 모드 닫기"
            className="fixed inset-0 z-40 bg-gray-950/30"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {mobileOpen && (
          <div className="fixed inset-x-3 bottom-20 z-50 max-h-[68vh] overflow-y-auto rounded-lg shadow-2xl">
            {panel}
          </div>
        )}

        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_28px_rgba(15,23,42,0.12)] backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-gray-500">풀이 모드</div>
              <div className="mt-0.5 truncate text-sm font-black text-gray-950 dark:text-gray-50">
                정답 {answerRevealedCount}/{totalCount} · 해설 {explanationExpandedCount}/{totalCount}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-lg px-4 text-sm font-black ring-1 ${styles.primary} ${styles.ring}`}
            >
              <SlidersHorizontal size={17} />
              열기
              <ChevronUp
                size={17}
                className={`transition-transform ${mobileOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function ModePanel({
  styles,
  scope,
  visibleCount,
  totalCount,
  answeredCount,
  answerRevealedCount,
  explanationExpandedCount,
  correctCount,
  wrongCount,
  scopeTotal,
  scopeAnswerCount,
  scopeExplanationCount,
  resetDisabled,
  totalScopeLabel,
  onScopeChange,
  onRevealAnswers,
  onHideAnswers,
  onExpandExplanations,
  onCollapseExplanations,
  onResetProgress,
  onCollapseDesktop,
  onCloseMobile,
}: {
  styles: (typeof toneStyles)[Tone];
  scope: PastExamReviewScope;
  visibleCount: number;
  totalCount: number;
  answeredCount: number;
  answerRevealedCount: number;
  explanationExpandedCount: number;
  correctCount: number;
  wrongCount: number;
  scopeTotal: number;
  scopeAnswerCount: number;
  scopeExplanationCount: number;
  resetDisabled: boolean;
  totalScopeLabel: string;
  onScopeChange: (scope: PastExamReviewScope) => void;
  onRevealAnswers: () => void;
  onHideAnswers: () => void;
  onExpandExplanations: () => void;
  onCollapseExplanations: () => void;
  onResetProgress: () => void;
  onCollapseDesktop: () => void;
  onCloseMobile: () => void;
}) {
  const scopeLabel = scope === "visible" ? "현재 결과" : totalScopeLabel;
  const revealDisabled = scopeTotal === 0 || scopeAnswerCount === scopeTotal;
  const hideDisabled = scopeAnswerCount === 0;
  const expandDisabled = scopeTotal === 0 || scopeExplanationCount === scopeTotal;
  const collapseDisabled = scopeExplanationCount === 0;

  return (
    <section className={`rounded-lg border bg-white p-3 shadow-xl dark:bg-gray-950 ${styles.border}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-[11px] font-black ${styles.badge}`}>
            <ListChecks size={14} />
            풀이 모드
          </div>
          <div className="mt-1.5 text-xs font-semibold text-gray-500">
            {scopeLabel} · {scopeAnswerCount}/{scopeTotal}
          </div>
        </div>
        <button
          type="button"
          aria-label="풀이 모드 접기"
          onClick={onCollapseDesktop}
          className="hidden h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900 lg:inline-flex"
        >
          <Minimize2 size={16} />
        </button>
        <button
          type="button"
          aria-label="풀이 모드 닫기"
          onClick={onCloseMobile}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900 lg:hidden"
        >
          <X size={17} />
        </button>
      </div>

      <div className="mb-2.5 grid grid-cols-3 gap-1.5 text-[11px]">
        <ModeStat label="표시" value={`${visibleCount}/${totalCount}`} />
        <ModeStat label="선택" value={String(answeredCount)} />
        <ModeStat label="확인" value={String(answerRevealedCount)} />
        <ModeStat label="해설" value={String(explanationExpandedCount)} />
        <ModeStat label="맞힘" value={String(correctCount)} />
        <ModeStat label="재검토" value={String(wrongCount)} />
      </div>

      <div className="mb-2.5 grid grid-cols-2 rounded-md bg-gray-100 p-1 dark:bg-gray-900">
        <ScopeButton
          active={scope === "visible"}
          onClick={() => onScopeChange("visible")}
        >
          현재 결과
        </ScopeButton>
        <ScopeButton
          active={scope === "year"}
          onClick={() => onScopeChange("year")}
        >
          {totalScopeLabel}
        </ScopeButton>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <ModeButton
          onClick={onRevealAnswers}
          disabled={revealDisabled}
          className={styles.primary}
        >
          <Eye size={16} />
          정답 확인
        </ModeButton>
        <ModeButton
          onClick={onHideAnswers}
          disabled={hideDisabled}
          className={styles.subtle}
        >
          <EyeOff size={16} />
          숨기기
        </ModeButton>
        <ModeButton
          onClick={onExpandExplanations}
          disabled={expandDisabled}
          className={styles.subtle}
        >
          <CheckCircle2 size={16} />
          해설 펼침
        </ModeButton>
        <ModeButton
          onClick={onCollapseExplanations}
          disabled={collapseDisabled}
          className={styles.subtle}
        >
          <EyeOff size={16} />
          접기
        </ModeButton>
        <ModeButton
          onClick={onResetProgress}
          disabled={resetDisabled}
          className="col-span-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-900"
        >
          <RotateCcw size={16} />
          풀이 초기화
        </ModeButton>
      </div>

      <div className={`mt-2.5 text-[11px] font-semibold ${styles.text}`}>
        {scopeLabel} {scopeTotal}문항 중 정답 {scopeAnswerCount}문항, 해설 {scopeExplanationCount}문항.
      </div>
    </section>
  );
}

function ModeStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-gray-200 px-2 py-2 text-center dark:border-gray-800">
      <div className="font-mono text-xs font-black text-gray-950 dark:text-gray-50">{value}</div>
      <div className="mt-0.5 text-gray-500">{label}</div>
    </div>
  );
}

function ScopeButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-2 py-1.5 text-xs font-black transition-colors ${
        active
          ? "bg-white text-gray-950 shadow-sm dark:bg-gray-800 dark:text-white"
          : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function ModeButton({
  children,
  className,
  disabled,
  onClick,
}: {
  children: ReactNode;
  className: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-black transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${className}`}
    >
      {children}
    </button>
  );
}
