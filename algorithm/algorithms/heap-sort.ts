import { SortStep, SortGenerator, HeapAux } from '../types/sort';

export const heapSort: SortGenerator = function* (arr) {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;

  function heapAux(size: number): HeapAux {
    return { kind: 'heap', heapSize: size };
  }

  yield {
    array: [...a],
    highlights: [],
    codeLine: 0,
    explanation: '힙 정렬 시작. 최대 힙 구성.',
    stats: { comparisons, swaps },
    auxiliaryData: heapAux(n),
  };

  // Build max heap
  function* heapify(i: number, size: number): Generator<SortStep, void, undefined> {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    const sortedHighlights = Array.from({ length: n - size }, (_, k) => ({
      index: size + k,
      type: 'sorted' as const,
    }));

    if (left < size) {
      comparisons++;
      if (a[left] > a[largest]) largest = left;
    }
    if (right < size) {
      comparisons++;
      if (a[right] > a[largest]) largest = right;
    }

    yield {
      array: [...a],
      highlights: [
        { index: i, type: 'current' },
        ...(left < size ? [{ index: left, type: 'compare' as const }] : []),
        ...(right < size ? [{ index: right, type: 'compare' as const }] : []),
        ...sortedHighlights,
      ],
      codeLine: 12,
      explanation: `Heapify: 노드 ${i}(=${a[i]})와 자식 비교.`,
      stats: { comparisons, swaps },
      auxiliaryData: heapAux(size),
    };

    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      swaps++;

      yield {
        array: [...a],
        highlights: [
          { index: i, type: 'swap' },
          { index: largest, type: 'swap' },
          ...sortedHighlights,
        ],
        codeLine: 14,
        explanation: `A[${i}]과 A[${largest}] 자리바꿈.`,
        stats: { comparisons, swaps },
        auxiliaryData: heapAux(size),
      };

      yield* heapify(largest, size);
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(i, n);
  }

  yield {
    array: [...a],
    highlights: [],
    codeLine: 7,
    explanation: '최대 힙 구성 완료. 정렬 단계 시작.',
    stats: { comparisons, swaps },
    auxiliaryData: heapAux(n),
  };

  // Sort
  for (let i = n - 1; i >= 1; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    swaps++;

    yield {
      array: [...a],
      highlights: [
        { index: 0, type: 'swap' },
        { index: i, type: 'swap' },
        ...Array.from({ length: n - i }, (_, k) => ({
          index: i + k,
          type: 'sorted' as const,
        })),
      ],
      codeLine: 9,
      explanation: `루트 A[0]=${a[i]}과 A[${i}]=${a[0]} 자리바꿈.`,
      stats: { comparisons, swaps },
      auxiliaryData: heapAux(i),
    };

    yield* heapify(0, i);
  }

  yield {
    array: [...a],
    highlights: Array.from({ length: n }, (_, k) => ({ index: k, type: 'sorted' as const })),
    codeLine: 8,
    explanation: `힙 정렬 완료. 비교 ${comparisons}회, 교환 ${swaps}회.`,
    stats: { comparisons, swaps },
    auxiliaryData: heapAux(0),
  };
};
