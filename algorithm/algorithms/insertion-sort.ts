import { SortStep, SortGenerator } from '../types/sort';

export const insertionSort: SortGenerator = function* (arr) {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;

  yield {
    array: [...a],
    highlights: [{ index: 0, type: 'sorted' }],
    codeLine: 0,
    explanation: '삽입 정렬 시작. 첫 원소는 정렬된 상태.',
    stats: { comparisons, swaps },
  };

  for (let i = 1; i < n; i++) {
    const key = a[i];

    yield {
      array: [...a],
      highlights: [
        { index: i, type: 'current' },
        ...Array.from({ length: i }, (_, k) => ({ index: k, type: 'sorted' as const })),
      ],
      codeLine: 2,
      explanation: `key=${key}를 정렬된 부분에 삽입할 위치 탐색.`,
      stats: { comparisons, swaps },
    };

    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      comparisons++;
      a[j + 1] = a[j];
      swaps++;

      yield {
        array: [...a],
        highlights: [
          { index: j, type: 'compare' },
          { index: j + 1, type: 'insert' },
        ],
        codeLine: 4,
        explanation: `A[${j}]=${a[j]}을 오른쪽으로 이동.`,
        stats: { comparisons, swaps },
      };

      j--;
    }
    if (j >= 0) comparisons++;

    a[j + 1] = key;

    yield {
      array: [...a],
      highlights: [
        { index: j + 1, type: 'insert' },
        ...Array.from({ length: i + 1 }, (_, k) => ({ index: k, type: 'sorted' as const })),
      ],
      codeLine: 5,
      explanation: `key=${key}를 위치 ${j + 1}에 삽입.`,
      stats: { comparisons, swaps },
    };
  }

  yield {
    array: [...a],
    highlights: Array.from({ length: n }, (_, k) => ({ index: k, type: 'sorted' as const })),
    codeLine: 5,
    explanation: `삽입 정렬 완료. 비교 ${comparisons}회, 이동 ${swaps}회.`,
    stats: { comparisons, swaps },
  };
};
