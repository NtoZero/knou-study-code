import { SortStep, SortGenerator, CountingAux } from '../types/sort';

export const countingSort: SortGenerator = function* (arr) {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;
  const max = Math.max(...a);
  const counts = new Array(max + 1).fill(0);
  const output = new Array(n).fill(0);

  yield {
    array: [...a],
    highlights: [],
    codeLine: 0,
    explanation: `계수 정렬 시작. 최댓값 = ${max}.`,
    stats: { comparisons, swaps },
    auxiliaryData: { kind: 'counting', counts: [...counts], phase: 'count', outputArray: [...output] },
  };

  // Count frequencies
  for (let i = 0; i < n; i++) {
    counts[a[i]]++;

    yield {
      array: [...a],
      highlights: [{ index: i, type: 'current' }],
      codeLine: 6,
      explanation: `A[${i}]=${a[i]}의 빈도 증가 → COUNT[${a[i]}]=${counts[a[i]]}.`,
      stats: { comparisons, swaps },
      auxiliaryData: { kind: 'counting', counts: [...counts], phase: 'count', outputArray: [...output] },
    };
  }

  // Cumulative counts
  yield {
    array: [...a],
    highlights: [],
    codeLine: 7,
    explanation: '누적합 계산 시작.',
    stats: { comparisons, swaps },
    auxiliaryData: { kind: 'counting', counts: [...counts], phase: 'cumulative', outputArray: [...output] },
  };

  for (let i = 1; i <= max; i++) {
    counts[i] += counts[i - 1];

    yield {
      array: [...a],
      highlights: [],
      codeLine: 8,
      explanation: `COUNT[${i}] = ${counts[i]} (누적합).`,
      stats: { comparisons, swaps },
      auxiliaryData: { kind: 'counting', counts: [...counts], phase: 'cumulative', outputArray: [...output] },
    };
  }

  // Place elements
  yield {
    array: [...a],
    highlights: [],
    codeLine: 12,
    explanation: '배치 단계 시작 (역순 탐색).',
    stats: { comparisons, swaps },
    auxiliaryData: { kind: 'counting', counts: [...counts], phase: 'place', outputArray: [...output] },
  };

  for (let i = n - 1; i >= 0; i--) {
    const val = a[i];
    const pos = counts[val] - 1;
    output[pos] = val;
    counts[val]--;
    swaps++;

    yield {
      array: [...a],
      highlights: [{ index: i, type: 'current' }],
      codeLine: 10,
      explanation: `A[${i}]=${val}을 B[${pos}]에 배치.`,
      stats: { comparisons, swaps },
      auxiliaryData: { kind: 'counting', counts: [...counts], phase: 'place', outputArray: [...output] },
    };
  }

  // Copy back
  for (let i = 0; i < n; i++) {
    a[i] = output[i];
  }

  yield {
    array: [...a],
    highlights: Array.from({ length: n }, (_, k) => ({ index: k, type: 'sorted' as const })),
    codeLine: 12,
    explanation: `계수 정렬 완료. 이동 ${swaps}회.`,
    stats: { comparisons, swaps },
    auxiliaryData: { kind: 'counting', counts: [...counts], phase: 'place', outputArray: [...output] },
  };
};
