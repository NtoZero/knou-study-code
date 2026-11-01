/**
 * 머신러닝 강의별 발표 간소화판.
 *
 * 강의록 PDF 슬라이드 순서대로, 슬라이드 한 장마다 핵심 2~3줄과 그대로 읽을 멘트 한 문장만 둔다.
 * 문자열 안의 **굵게**는 굵은 글씨로 표시된다.
 */

import type { SourceRef } from "@/lib/mlSources";
import { lecture13Brief } from "@/lib/mlBriefs/lecture13";

export interface BriefSlide {
  kind: "slide";
  /** 강의록 PDF 쪽 — 예: 21, "35–39" */
  page: number | string;
  /** public 아래 이미지 경로 */
  img: string;
  title: string;
  /** 꼭 말할 슬라이드 */
  key?: boolean;
  /** 넘겨도 되는 슬라이드 표시 — 예: "넘겨도 됨" */
  skip?: string;
  points?: string[];
  formula?: { expr: string; read: string };
  table?: { head: string[]; rows: string[][] };
  /** 그대로 읽을 멘트 */
  say?: string;
  /** 강의에서 따로 짚은 것 */
  lecture?: string;
  note?: string;
}

export interface BriefDemo {
  kind: "demo";
  /** 강의 페이지의 섹션 앵커 */
  anchor: string;
  title: string;
  steps: { act: string; see: string; say?: string; computed?: boolean }[];
  note?: string;
}

export type BriefBlock =
  | BriefSlide
  | BriefDemo
  | { kind: "sub"; text: string }
  | { kind: "analogy"; title: string; body: string }
  | { kind: "warn"; title: string; body: string };

export interface BriefSection {
  id: string;
  title: string;
  pages: string;
  refs: SourceRef;
  blocks: BriefBlock[];
}

export interface LectureBrief {
  lectureId: number;
  oneLine: string;
  /** 발표 흐름 — 파트 · 슬라이드 · 시간 · 한 줄 */
  flow: { part: string; pages: string; minutes: number; gist: string }[];
  /** 네 갈래처럼 한눈에 보는 그림 */
  overview: { title: string; body: string }[];
  overviewAnalogy?: { title: string; body: string };
  terms: { term: string; easy: string; where: string }[];
  emphasis?: string;
  sections: BriefSection[];
  checkpoints: { q: string; a: string }[];
  faqs: { q: string; a: string }[];
  closing: BriefSlide;
  quiz: { q: string; options: string[]; answer: number; why?: string }[];
}

const briefs: Record<number, LectureBrief> = {
  13: lecture13Brief,
};

export function getMlBrief(lectureId: number): LectureBrief | undefined {
  return briefs[lectureId];
}

export function hasMlBrief(lectureId: number): boolean {
  return lectureId in briefs;
}
