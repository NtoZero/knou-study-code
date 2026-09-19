/**
 * 5강부터 각 학습 블록이 어디에 근거하는지 표시하는 출처 구분.
 *
 * textbook — 교재 본문(장·절)에 있는 내용
 * slides   — 강의록 슬라이드에 있는 내용
 * lecture  — 강의에서 따로 힘주어 짚은 지점
 */
export type SourceKind = "textbook" | "slides" | "lecture";

export const sourceOrder: SourceKind[] = ["textbook", "slides", "lecture"];

export interface SourceMeta {
  label: string;
  /** 칩·배지 공통 색 */
  tone: string;
  /** 선택된 칩 색 */
  activeTone: string;
  dot: string;
}

export const sourceMeta: Record<SourceKind, SourceMeta> = {
  textbook: {
    label: "교재",
    tone: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-200",
    activeTone: "border-sky-500 bg-sky-500 text-white dark:border-sky-400 dark:bg-sky-500",
    dot: "bg-sky-500",
  },
  slides: {
    label: "강의록",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200",
    activeTone:
      "border-emerald-500 bg-emerald-500 text-white dark:border-emerald-400 dark:bg-emerald-500",
    dot: "bg-emerald-500",
  },
  lecture: {
    label: "강의 강조",
    tone: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200",
    activeTone: "border-rose-500 bg-rose-500 text-white dark:border-rose-400 dark:bg-rose-500",
    dot: "bg-rose-500",
  },
};

/** 블록 하나의 출처 표기 */
export interface SourceRef {
  /** 교재 위치 — 예: "7.2.1 주성분분석의 목적" */
  textbook?: string;
  /** 강의록 위치 — 예: "주성분분석 — 수행 단계" */
  slides?: string;
  /** 강의에서 강조한 내용 한 줄 */
  lecture?: string;
}

export function kindsOf(ref: SourceRef): SourceKind[] {
  return sourceOrder.filter((k) => Boolean(ref[k]));
}
