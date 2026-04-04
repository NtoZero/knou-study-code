import { HighlightType } from '../types/sort';

export const highlightColors: Record<HighlightType, string> = {
  compare: '#f59e0b',
  swap: '#ef4444',
  sorted: '#10b981',
  pivot: '#8b5cf6',
  min: '#f97316',
  insert: '#3b82f6',
  current: '#06b6d4',
  found: '#22c55e',
  'search-range': '#a78bfa',
  target: '#f43f5e',
  visited: '#10b981',
  'active-edge': '#3b82f6',
  'tree-edge': '#ef4444',
  relaxed: '#f59e0b',
  'in-queue': '#fbbf24',
  'in-stack': '#fb923c',
  'node-red': '#ef4444',
  'node-black': '#1e293b',
};

export const defaultColor = '#6b7280';

export function getBarColor(index: number, highlights: { index: number; type: HighlightType }[]): string {
  const h = highlights.find(h => h.index === index);
  return h ? highlightColors[h.type] : defaultColor;
}

export const highlightLabels: Record<HighlightType, string> = {
  compare: '비교 중',
  swap: '교환 중',
  sorted: '정렬 완료',
  pivot: '피벗',
  min: '최솟값',
  insert: '삽입 위치',
  current: '현재',
  found: '탐색 성공',
  'search-range': '탐색 범위',
  target: '탐색 대상',
  visited: '방문 완료',
  'active-edge': '활성 간선',
  'tree-edge': '트리 간선',
  relaxed: '완화됨',
  'in-queue': '큐 대기',
  'in-stack': '스택 대기',
  'node-red': '레드 노드',
  'node-black': '블랙 노드',
};

export const graphNodeColors = {
  unvisited: '#6b7280',
  'in-queue': '#fbbf24',
  'in-stack': '#fb923c',
  visiting: '#f59e0b',
  visited: '#10b981',
  current: '#06b6d4',
  start: '#3b82f6',
};

export const graphEdgeColors = {
  default: '#475569',
  active: '#3b82f6',
  'tree-edge': '#ef4444',
  mst: '#22c55e',
  relaxed: '#f59e0b',
  augmenting: '#06b6d4',
  back: '#8b5cf6',
};
