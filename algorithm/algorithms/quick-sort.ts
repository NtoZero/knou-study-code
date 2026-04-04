import { SortStep, SortGenerator, Highlight } from '../types/sort';

export const quickSort: SortGenerator = function* (arr) {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = new Set<number>();

  yield {
    array: [...a],
    highlights: [],
    codeLine: 0,
    explanation: '퀵 정렬 시작.',
    stats: { comparisons, swaps },
  };

  function sortedHighlights(): Highlight[] {
    return [...sortedIndices].map(i => ({ index: i, type: 'sorted' as const }));
  }

  // 교재 알고리즘 2.7: A[left]를 피벗으로, Left/Right 양방향 스캔
  function* partition(left: number, right: number): Generator<SortStep, number, undefined> {
    const pivotVal = a[left];

    yield {
      array: [...a],
      highlights: [{ index: left, type: 'pivot' }, ...sortedHighlights()],
      codeLine: 7,
      explanation: `피벗 = A[${left}] = ${pivotVal}.`,
      stats: { comparisons, swaps },
    };

    let L = left + 1;
    let R = right;

    while (L <= R) {
      // Left 스캔: 피벗보다 큰 값 찾기
      while (L <= right && a[L] < pivotVal) {
        comparisons++;
        L++;
      }
      if (L <= right) comparisons++;

      // Right 스캔: 피벗보다 작은 값 찾기
      while (R > left && a[R] >= pivotVal) {
        comparisons++;
        R--;
      }
      if (R > left) comparisons++;

      yield {
        array: [...a],
        highlights: [
          { index: left, type: 'pivot' },
          ...(L <= right ? [{ index: L, type: 'compare' as const }] : []),
          ...(R > left ? [{ index: R, type: 'current' as const }] : []),
          ...sortedHighlights(),
        ],
        codeLine: L < R ? 9 : 10,
        explanation: `Left=${L}, Right=${R} 탐색 완료.`,
        stats: { comparisons, swaps },
      };

      if (L < R) {
        [a[L], a[R]] = [a[R], a[L]];
        swaps++;

        yield {
          array: [...a],
          highlights: [
            { index: left, type: 'pivot' },
            { index: L, type: 'swap' },
            { index: R, type: 'swap' },
            ...sortedHighlights(),
          ],
          codeLine: 12,
          explanation: `A[${L}]와 A[${R}] 교환.`,
          stats: { comparisons, swaps },
        };

        L++;
        R--;
      } else {
        break;
      }
    }

    // 피벗과 A[Right] 교환
    if (R !== left) {
      [a[left], a[R]] = [a[R], a[left]];
      swaps++;
    }

    yield {
      array: [...a],
      highlights: [
        { index: R, type: 'pivot' },
        ...sortedHighlights(),
      ],
      codeLine: 14,
      explanation: `피벗 ${pivotVal}을 위치 ${R}에 배치.`,
      stats: { comparisons, swaps },
    };

    sortedIndices.add(R);
    return R;
  }

  function* qsort(left: number, right: number): Generator<SortStep, void, undefined> {
    if (left < right) {
      const pivot = yield* partition(left, right);
      yield* qsort(left, pivot - 1);
      yield* qsort(pivot + 1, right);
    } else if (left === right) {
      sortedIndices.add(left);
    }
  }

  yield* qsort(0, n - 1);

  yield {
    array: [...a],
    highlights: Array.from({ length: n }, (_, k) => ({ index: k, type: 'sorted' as const })),
    codeLine: 15,
    explanation: `퀵 정렬 완료. 비교 ${comparisons}회, 교환 ${swaps}회.`,
    stats: { comparisons, swaps },
  };
};
