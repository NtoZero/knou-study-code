import { SortStep, SortGenerator, Highlight } from '../types/sort';

export const mergeSort: SortGenerator = function* (arr) {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;

  yield {
    array: [...a],
    highlights: [],
    codeLine: 0,
    explanation: '합병 정렬 시작.',
    stats: { comparisons, swaps },
  };

  function* msort(left: number, right: number): Generator<SortStep, void, undefined> {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    yield {
      array: [...a],
      highlights: [
        ...Array.from({ length: mid - left + 1 }, (_, k) => ({ index: left + k, type: 'compare' as const })),
        ...Array.from({ length: right - mid }, (_, k) => ({ index: mid + 1 + k, type: 'current' as const })),
      ],
      codeLine: 2,
      explanation: `분할: [${left}..${mid}] | [${mid + 1}..${right}].`,
      stats: { comparisons, swaps },
    };

    yield* msort(left, mid);
    yield* msort(mid + 1, right);

    // Merge
    const L = a.slice(left, mid + 1);
    const R = a.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    yield {
      array: [...a],
      highlights: Array.from({ length: right - left + 1 }, (_, idx) => ({
        index: left + idx,
        type: 'current' as const,
      })),
      codeLine: 9,
      explanation: `합병: [${left}..${mid}]와 [${mid + 1}..${right}] 합치기.`,
      stats: { comparisons, swaps },
    };

    while (i < L.length && j < R.length) {
      comparisons++;
      if (L[i] <= R[j]) {
        a[k] = L[i];
        i++;
      } else {
        a[k] = R[j];
        j++;
      }
      swaps++;

      yield {
        array: [...a],
        highlights: [{ index: k, type: 'insert' }],
        codeLine: 10,
        explanation: `위치 ${k}에 ${a[k]} 배치.`,
        stats: { comparisons, swaps },
      };
      k++;
    }

    while (i < L.length) {
      a[k] = L[i];
      swaps++;
      i++;

      yield {
        array: [...a],
        highlights: [{ index: k, type: 'insert' }],
        codeLine: 12,
        explanation: `남은 왼쪽 원소 ${a[k]} 배치.`,
        stats: { comparisons, swaps },
      };
      k++;
    }

    while (j < R.length) {
      a[k] = R[j];
      swaps++;
      j++;

      yield {
        array: [...a],
        highlights: [{ index: k, type: 'insert' }],
        codeLine: 13,
        explanation: `남은 오른쪽 원소 ${a[k]} 배치.`,
        stats: { comparisons, swaps },
      };
      k++;
    }
  }

  yield* msort(0, n - 1);

  yield {
    array: [...a],
    highlights: Array.from({ length: n }, (_, k) => ({ index: k, type: 'sorted' as const })),
    codeLine: 13,
    explanation: `합병 정렬 완료. 비교 ${comparisons}회, 이동 ${swaps}회.`,
    stats: { comparisons, swaps },
  };
};
