/**
 * 머신러닝 용어집 항목 스키마.
 *
 * 정의와 수식은 강의록 표현을 우선한다.
 * `emphasis`는 강의에서 특히 힘주어 짚은 지점을 학습자 말로 옮긴 것이다.
 */

export type TermCategory =
  | "개념"
  | "알고리즘"
  | "수식·지표"
  | "학습 유형"
  | "선행 개념";

export interface TermFormula {
  expr: string;
  note?: string;
}

export interface TermDistinction {
  /** 헷갈리는 상대 */
  from: string;
  /** 무엇으로 갈리는지 */
  how: string;
}

export interface GlossaryTerm {
  /** 전역 고유 id. 강의 용어는 t- 접두사 */
  id: string;
  term: string;
  en?: string;
  category: TermCategory;
  /** 한 줄 정의 — 검색 결과 목록에 노출 */
  short: string;
  /** 정의 — 강의록 표현 보존 */
  definition: string;
  /** 이 개념이 하는 일 */
  role?: string;
  formula?: TermFormula[];
  /** 짧은 예 */
  example?: string;
  /** 헷갈리는 개념과의 구분 */
  distinctions?: TermDistinction[];
  /** 이 용어를 이해하려면 먼저 알아야 하는 선행 개념 id (lib/mlPrereqs.ts) */
  prereqs?: string[];
  /** 함께 보면 좋은 용어 id */
  related?: string[];
  /** 등장 강의 */
  lectures: number[];
  /** 근거 — 강의록 소목차 또는 공식 연습문제 */
  basis: string;
  /** 강의에서 특히 강조한 지점 */
  emphasis?: string;
  /** 검색용 별칭 (영문 약어, 다른 표기 등) */
  aliases?: string[];
}
