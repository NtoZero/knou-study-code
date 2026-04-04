import { SortStep, SortGenerator } from '../types/sort';

export const shellSort: SortGenerator = function* (arr) {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;

  yield {
    array: [...a],
    highlights: [],
    codeLine: 0,
    explanation: '셸 정렬 시작.',
    stats: { comparisons, swaps },
  };

  for (let gap = Math.floor(n / 2); gap >= 1; gap = Math.floor(gap / 2)) {
    yield {
      array: [...a],
      highlights: [],
      codeLine: 1,
      explanation: `간격(D) = ${gap}으로 부분 삽입 정렬 수행.`,
      stats: { comparisons, swaps },
    };

    for (let i = gap; i < n; i++) {
      const key = a[i];
      let j = i - gap;

      yield {
        array: [...a],
        highlights: [{ index: i, type: 'current' }],
        codeLine: 3,
        explanation: `i=${i}, val=${key}, D=${gap}.`,
        stats: { comparisons, swaps },
      };

      while (j >= 0 && a[j] > key) {
        comparisons++;
        a[j + gap] = a[j];
        swaps++;

        yield {
          array: [...a],
          highlights: [
            { index: j, type: 'compare' },
            { index: j + gap, type: 'insert' },
          ],
          codeLine: 5,
          explanation: `A[${j}]=${a[j]}을 A[${j + gap}]으로 이동.`,
          stats: { comparisons, swaps },
        };

        j -= gap;
      }
      if (j >= 0) comparisons++;

      a[j + gap] = key;

      yield {
        array: [...a],
        highlights: [{ index: j + gap, type: 'insert' }],
        codeLine: 6,
        explanation: `key=${key}를 위치 ${j + gap}에 삽입.`,
        stats: { comparisons, swaps },
      };
    }
  }

  yield {
    array: [...a],
    highlights: Array.from({ length: n }, (_, k) => ({ index: k, type: 'sorted' as const })),
    codeLine: 6,
    explanation: `셸 정렬 완료. 비교 ${comparisons}회, 이동 ${swaps}회.`,
    stats: { comparisons, swaps },
  };
};
