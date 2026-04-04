import { SortStep, SortGenerator } from '../types/sort';

export const sequentialSearch: SortGenerator = function* (arr) {
  const a = [...arr];
  const n = a.length - 1; // 마지막 원소는 검색 키
  const x = a[a.length - 1];
  let comparisons = 0;

  yield {
    array: [...a],
    highlights: [{ index: a.length - 1, type: 'target' }],
    codeLine: 0,
    explanation: `순차 탐색 시작. 검색 키: ${x}.`,
    stats: { comparisons, swaps: 0 },
  };

  let i = 0;

  yield {
    array: [...a],
    highlights: [{ index: a.length - 1, type: 'target' }],
    codeLine: 1,
    explanation: `i ← 0 초기화.`,
    stats: { comparisons, swaps: 0 },
  };

  while (i < n) {
    comparisons++;

    yield {
      array: [...a],
      highlights: [
        { index: i, type: 'compare' },
        { index: a.length - 1, type: 'target' },
      ],
      codeLine: 2,
      explanation: `A[${i}]=${a[i]}과 키 ${x} 비교.`,
      stats: { comparisons, swaps: 0 },
    };

    if (a[i] === x) {
      break;
    }

    i++;

    yield {
      array: [...a],
      highlights: [
        { index: i < n ? i : i - 1, type: 'current' },
        { index: a.length - 1, type: 'target' },
      ],
      codeLine: 3,
      explanation: `일치하지 않음. i ← ${i}.`,
      stats: { comparisons, swaps: 0 },
    };
  }

  if (i < n) {
    yield {
      array: [...a],
      highlights: [
        { index: i, type: 'found' },
        { index: a.length - 1, type: 'target' },
      ],
      codeLine: 4,
      explanation: `A[${i}]=${a[i]}에서 키 ${x} 발견. 인덱스 ${i} 반환.`,
      stats: { comparisons, swaps: 0 },
    };
  } else {
    yield {
      array: [...a],
      highlights: [{ index: a.length - 1, type: 'target' }],
      codeLine: 4,
      explanation: `키 ${x}을(를) 찾지 못함. -1 반환.`,
      stats: { comparisons, swaps: 0 },
    };
  }
};
