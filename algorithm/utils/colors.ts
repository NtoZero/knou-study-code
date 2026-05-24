import { HighlightType } from '../types/sort';

export const highlightColors: Record<HighlightType, string> = {
  compare: '#facc15',
  swap: '#fb3d5a',
  sorted: '#00e676',
  pivot: '#c084fc',
  min: '#fb923c',
  insert: '#38bdf8',
  current: '#22d3ee',
  found: '#00e676',
  'search-range': '#93c5fd',
  target: '#ff4d8d',
  visited: '#00e676',
  'active-edge': '#38bdf8',
  'tree-edge': '#fb3d5a',
  relaxed: '#facc15',
  'in-queue': '#fde047',
  'in-stack': '#fb923c',
  'node-red': '#fb3d5a',
  'node-black': '#0f172a',
};

export const defaultColor = '#38bdf8';

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
  unvisited: '#60a5fa',
  'in-queue': '#fde047',
  'in-stack': '#fb923c',
  visiting: '#facc15',
  visited: '#00e676',
  current: '#22d3ee',
  start: '#38bdf8',
};

export const graphEdgeColors = {
  default: '#7dd3fc',
  active: '#38bdf8',
  'tree-edge': '#fb3d5a',
  mst: '#00e676',
  relaxed: '#facc15',
  augmenting: '#22d3ee',
  back: '#c084fc',
};
