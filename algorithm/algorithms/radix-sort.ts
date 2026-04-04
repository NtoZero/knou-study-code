import { SortStep, SortGenerator, RadixAux } from '../types/sort';

export const radixSort: SortGenerator = function* (arr) {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;
  const maxVal = Math.max(...a);
  const maxDigits = Math.floor(Math.log10(maxVal)) + 1;

  yield {
    array: [...a],
    highlights: [],
    codeLine: 0,
    explanation: `기수 정렬 시작. 최대 자릿수 = ${maxDigits}.`,
    stats: { comparisons, swaps },
  };

  for (let d = 0; d < maxDigits; d++) {
    const buckets: number[][] = Array.from({ length: 10 }, () => []);
    const divisor = Math.pow(10, d);

    yield {
      array: [...a],
      highlights: [],
      codeLine: 1,
      explanation: `${d + 1}번째 자릿수(${d === 0 ? '일' : d === 1 ? '십' : '백'}의 자리) 기준 분배.`,
      stats: { comparisons, swaps },
      auxiliaryData: { kind: 'radix', buckets: buckets.map(b => [...b]), currentDigit: d },
    };

    for (let i = 0; i < n; i++) {
      const digit = Math.floor(a[i] / divisor) % 10;
      buckets[digit].push(a[i]);
      swaps++;

      yield {
        array: [...a],
        highlights: [{ index: i, type: 'current' }],
        codeLine: 3,
        explanation: `A[${i}]=${a[i]}의 ${d + 1}번째 자릿수 = ${digit} → 버킷 ${digit}에 삽입.`,
        stats: { comparisons, swaps },
        auxiliaryData: { kind: 'radix', buckets: buckets.map(b => [...b]), currentDigit: d },
      };
    }

    // Collect
    let idx = 0;
    for (let b = 0; b < 10; b++) {
      for (const val of buckets[b]) {
        a[idx] = val;
        idx++;
      }
    }

    yield {
      array: [...a],
      highlights: Array.from({ length: n }, (_, k) => ({ index: k, type: 'insert' as const })),
      codeLine: 4,
      explanation: `버킷 순서대로 재배열 완료 (${d + 1}번째 자릿수).`,
      stats: { comparisons, swaps },
      auxiliaryData: { kind: 'radix', buckets: buckets.map(b => [...b]), currentDigit: d },
    };
  }

  yield {
    array: [...a],
    highlights: Array.from({ length: n }, (_, k) => ({ index: k, type: 'sorted' as const })),
    codeLine: 4,
    explanation: `기수 정렬 완료. 이동 ${swaps}회.`,
    stats: { comparisons, swaps },
  };
};
