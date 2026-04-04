import { SortStep, SortGenerator } from '../types/sort';

export const bubbleSort: SortGenerator = function* (arr) {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;

  yield {
    array: [...a],
    highlights: [],
    codeLine: 0,
    explanation: '버블 정렬 시작.',
    stats: { comparisons, swaps },
  };

  for (let i = n - 1; i >= 1; i--) {
    let sorted = true;

    for (let j = 0; j < i; j++) {
      comparisons++;
      const sortedHighlights = Array.from({ length: n - 1 - i }, (_, k) => ({
        index: n - 1 - k,
        type: 'sorted' as const,
      }));

      yield {
        array: [...a],
        highlights: [
          { index: j, type: 'compare' },
          { index: j + 1, type: 'compare' },
          ...sortedHighlights,
        ],
        codeLine: 4,
        explanation: `A[${j}]=${a[j]}과 A[${j + 1}]=${a[j + 1]} 비교.`,
        stats: { comparisons, swaps },
      };

      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        sorted = false;

        yield {
          array: [...a],
          highlights: [
            { index: j, type: 'swap' },
            { index: j + 1, type: 'swap' },
            ...sortedHighlights,
          ],
          codeLine: 5,
          explanation: `A[${j}]과 A[${j + 1}] 자리바꿈.`,
          stats: { comparisons, swaps },
        };
      }
    }

    if (sorted) {
      yield {
        array: [...a],
        highlights: Array.from({ length: n }, (_, k) => ({ index: k, type: 'sorted' as const })),
        codeLine: 7,
        explanation: '교환 없음 — 이미 정렬 완료.',
        stats: { comparisons, swaps },
      };
      return;
    }
  }

  yield {
    array: [...a],
    highlights: Array.from({ length: n }, (_, k) => ({ index: k, type: 'sorted' as const })),
    codeLine: 7,
    explanation: `버블 정렬 완료. 비교 ${comparisons}회, 교환 ${swaps}회.`,
    stats: { comparisons, swaps },
  };
};
