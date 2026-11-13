/**
 * 딥러닝 강의별 학습목표·정리·점검 항목.
 * 강의록의 '학습목차'와 '정리하기' 슬라이드, 그리고 강의에서 짚은 내용을 근거로 한다.
 */
import type { SourceRef } from "@/lib/dlSources";

export interface OutlineSummary {
  title: string;
  items: string[];
  refs: SourceRef;
}

export interface OutlineCheckpoint {
  /** 헷갈리기 쉬운 구분을 묻는 한 줄 */
  question: string;
  /** 구분 기준 설명 */
  answer: string;
  /** 근거 위치 — 예: "2강 역전파 알고리즘 슬라이드" */
  basis: string;
  refs: SourceRef;
}

export interface LectureOutline {
  lectureId: number;
  /** 강의록 학습목차 항목 */
  objectives: string[];
  summary: OutlineSummary[];
  checkpoints: OutlineCheckpoint[];
}

import { lecture1Outline } from "@/lib/dlOutlines/lecture1";
import { lecture2Outline } from "@/lib/dlOutlines/lecture2";
import { lecture3Outline } from "@/lib/dlOutlines/lecture3";
import { lecture4Outline } from "@/lib/dlOutlines/lecture4";
import { lecture5Outline } from "@/lib/dlOutlines/lecture5";

const outlines: Record<number, LectureOutline> = {
  1: lecture1Outline,
  2: lecture2Outline,
  3: lecture3Outline,
  4: lecture4Outline,
  5: lecture5Outline,
};

export function getDlOutline(lectureId: number): LectureOutline | null {
  return outlines[lectureId] ?? null;
}
