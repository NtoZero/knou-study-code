import { SortStep, SortGenerator } from '../types/sort';

export const selectionSort: SortGenerator = function* (arr) {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;

  yield {
    array: [...a],
    highlights: [],
    codeLine: 0,
    explanation: '선택 정렬 시작.',
    stats: { comparisons, swaps },
  };

  for (let i = 0; i < n - 1; i++) {
    let min = i;

    yield {
      array: [...a],
      highlights: [{ index: i, type: 'current' }, { index: min, type: 'min' }],
      codeLine: 2,
      explanation: `i=${i}: 현재 위치에서 최솟값 탐색 시작.`,
      stats: { comparisons, swaps },
    };

    for (let j = i + 1; j < n; j++) {
      comparisons++;

      yield {
        array: [...a],
        highlights: [
          { index: i, type: 'current' },
          { index: min, type: 'min' },
          { index: j, type: 'compare' },
          ...Array.from({ length: i }, (_, k) => ({ index: k, type: 'sorted' as const })),
        ],
        codeLine: 4,
        explanation: `A[${j}]=${a[j]}과 A[${min}]=${a[min]} 비교.`,
        stats: { comparisons, swaps },
      };

      if (a[j] < a[min]) {
        min = j;

        yield {
          array: [...a],
          highlights: [
            { index: i, type: 'current' },
            { index: min, type: 'min' },
            ...Array.from({ length: i }, (_, k) => ({ index: k, type: 'sorted' as const })),
          ],
          codeLine: 5,
          explanation: `새로운 최솟값 발견: A[${min}]=${a[min]}.`,
          stats: { comparisons, swaps },
        };
      }
    }

    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      swaps++;

      yield {
        array: [...a],
        highlights: [
          { index: i, type: 'swap' },
          { index: min, type: 'swap' },
          ...Array.from({ length: i }, (_, k) => ({ index: k, type: 'sorted' as const })),
        ],
        codeLine: 6,
        explanation: `A[${i}]과 A[${min}] 자리바꿈: ${a[i]} ↔ ${a[min]}.`,
        stats: { comparisons, swaps },
      };
    }

    yield {
      array: [...a],
      highlights: Array.from({ length: i + 1 }, (_, k) => ({ index: k, type: 'sorted' as const })),
      codeLine: 6,
      explanation: `위치 ${i}에 ${a[i]} 확정.`,
      stats: { comparisons, swaps },
    };
  }

  yield {
    array: [...a],
    highlights: Array.from({ length: n }, (_, k) => ({ index: k, type: 'sorted' as const })),
    codeLine: 6,
    explanation: `선택 정렬 완료. 비교 ${comparisons}회, 교환 ${swaps}회.`,
    stats: { comparisons, swaps },
  };
};
