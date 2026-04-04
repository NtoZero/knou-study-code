import { SortStep, SortGenerator } from '../types/sort';

export const binarySearch: SortGenerator = function* (arr) {
  const key = arr[arr.length - 1];
  const a = arr.slice(0, -1).sort((x, y) => x - y);
  a.push(key); // 마지막에 키를 다시 추가
  const n = a.length - 1;
  let comparisons = 0;

  yield {
    array: [...a],
    highlights: [{ index: a.length - 1, type: 'target' }],
    codeLine: 0,
    explanation: `이진 탐색 시작. 정렬된 배열에서 키 ${key} 탐색.`,
    stats: { comparisons, swaps: 0 },
  };

  let left = 0;
  let right = n - 1;

  yield {
    array: [...a],
    highlights: [
      ...rangeHighlights(left, right, 'search-range'),
      { index: a.length - 1, type: 'target' },
    ],
    codeLine: 0,
    explanation: `Left ← ${left}, Right ← ${right} 초기화.`,
    stats: { comparisons, swaps: 0 },
  };

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    comparisons++;

    yield {
      array: [...a],
      highlights: [
        ...rangeHighlights(left, right, 'search-range'),
        { index: mid, type: 'current' },
        { index: a.length - 1, type: 'target' },
      ],
      codeLine: 2,
      explanation: `Mid ← ${mid}. A[${mid}]=${a[mid]}과 키 ${key} 비교.`,
      stats: { comparisons, swaps: 0 },
    };

    if (a[mid] === key) {
      yield {
        array: [...a],
        highlights: [
          { index: mid, type: 'found' },
          { index: a.length - 1, type: 'target' },
        ],
        codeLine: 3,
        explanation: `A[${mid}]=${a[mid]} = 키 ${key}. 인덱스 ${mid} 반환.`,
        stats: { comparisons, swaps: 0 },
      };
      return;
    } else if (a[mid] > key) {
      right = mid - 1;

      yield {
        array: [...a],
        highlights: [
          ...rangeHighlights(left, right, 'search-range'),
          { index: a.length - 1, type: 'target' },
        ],
        codeLine: 5,
        explanation: `A[${mid}]=${a[mid]} > ${key}. Right ← ${mid - 1}.`,
        stats: { comparisons, swaps: 0 },
      };
    } else {
      left = mid + 1;

      yield {
        array: [...a],
        highlights: [
          ...rangeHighlights(left, right, 'search-range'),
          { index: a.length - 1, type: 'target' },
        ],
        codeLine: 7,
        explanation: `A[${mid}]=${a[mid]} < ${key}. Left ← ${mid + 1}.`,
        stats: { comparisons, swaps: 0 },
      };
    }
  }

  yield {
    array: [...a],
    highlights: [{ index: a.length - 1, type: 'target' }],
    codeLine: 1,
    explanation: `탐색 범위 소진. 키 ${key}을(를) 찾지 못함. -1 반환.`,
    stats: { comparisons, swaps: 0 },
  };
};

function rangeHighlights(left: number, right: number, type: 'search-range') {
  const highlights: { index: number; type: 'search-range' }[] = [];
  for (let i = left; i <= right; i++) {
    highlights.push({ index: i, type });
  }
  return highlights;
}
