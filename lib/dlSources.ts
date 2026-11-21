/**
 * 딥러닝 강의 페이지에서 각 학습 블록이 어디에 근거하는지 표시하는 출처 구분.
 *
 * slides  — 강의록 슬라이드에 있는 내용
 * lecture — 강의에서 따로 힘주어 짚은 지점
 * exercise — U-KNOU 학습창의 공식 연습문제
 */
export type SourceKind = "slides" | "lecture" | "exercise";

export const sourceOrder: SourceKind[] = ["slides", "lecture", "exercise"];

export interface SourceMeta {
  label: string;
  /** 칩·배지 공통 색 */
  tone: string;
  /** 선택된 칩 색 */
  activeTone: string;
  dot: string;
}

export const sourceMeta: Record<SourceKind, SourceMeta> = {
  slides: {
    label: "강의록",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200",
    activeTone:
      "border-emerald-500 bg-emerald-500 text-white dark:border-emerald-400 dark:bg-emerald-500",
    dot: "bg-emerald-500",
  },
  exercise: {
    label: "공식 연습문제",
    tone: "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900 dark:bg-teal-950/50 dark:text-teal-200",
    activeTone: "border-teal-700 bg-teal-700 text-white",
    dot: "bg-teal-700",
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
  /** 강의록 위치 — 예: "뉴런의 기본 구조 — 가중합과 활성함수" */
  slides?: string;
  /** 강의에서 강조한 내용 한 줄 */
  lecture?: string;
  exercise?: string;
}

export function kindsOf(ref: SourceRef): SourceKind[] {
  return sourceOrder.filter((k) => Boolean(ref[k]));
}
