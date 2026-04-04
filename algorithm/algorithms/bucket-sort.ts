import { SortStep, SortGenerator, BucketAux } from '../types/sort';

export const bucketSort: SortGenerator = function* (arr) {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;
  let swaps = 0;
  const max = Math.max(...a);
  const bucketCount = Math.min(n, 10);
  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

  yield {
    array: [...a],
    highlights: [],
    codeLine: 0,
    explanation: `버킷 정렬 시작. ${bucketCount}개 버킷 생성.`,
    stats: { comparisons, swaps },
    auxiliaryData: { kind: 'bucket', buckets: buckets.map(b => [...b]) },
  };

  // Distribute
  for (let i = 0; i < n; i++) {
    const idx = Math.min(Math.floor((a[i] * bucketCount) / (max + 1)), bucketCount - 1);
    buckets[idx].push(a[i]);
    swaps++;

    yield {
      array: [...a],
      highlights: [{ index: i, type: 'current' }],
      codeLine: 4,
      explanation: `A[${i}]=${a[i]} → 버킷 ${idx}에 분배.`,
      stats: { comparisons, swaps },
      auxiliaryData: { kind: 'bucket', buckets: buckets.map(b => [...b]) },
    };
  }

  // Sort each bucket (insertion sort)
  for (let b = 0; b < bucketCount; b++) {
    if (buckets[b].length <= 1) continue;

    yield {
      array: [...a],
      highlights: [],
      codeLine: 7,
      explanation: `버킷 ${b} 삽입 정렬 시작: [${buckets[b].join(', ')}].`,
      stats: { comparisons, swaps },
      auxiliaryData: { kind: 'bucket', buckets: buckets.map(bb => [...bb]) },
    };

    // Insertion sort within bucket
    for (let i = 1; i < buckets[b].length; i++) {
      const key = buckets[b][i];
      let j = i - 1;
      while (j >= 0 && buckets[b][j] > key) {
        comparisons++;
        buckets[b][j + 1] = buckets[b][j];
        swaps++;
        j--;
      }
      if (j >= 0) comparisons++;
      buckets[b][j + 1] = key;
    }

    yield {
      array: [...a],
      highlights: [],
      codeLine: 7,
      explanation: `버킷 ${b} 정렬 완료: [${buckets[b].join(', ')}].`,
      stats: { comparisons, swaps },
      auxiliaryData: { kind: 'bucket', buckets: buckets.map(bb => [...bb]) },
    };
  }

  // Concatenate
  let idx = 0;
  for (const bucket of buckets) {
    for (const val of bucket) {
      a[idx] = val;
      idx++;
    }
  }

  yield {
    array: [...a],
    highlights: Array.from({ length: n }, (_, k) => ({ index: k, type: 'sorted' as const })),
    codeLine: 8,
    explanation: `버킷 정렬 완료. 비교 ${comparisons}회, 이동 ${swaps}회.`,
    stats: { comparisons, swaps },
    auxiliaryData: { kind: 'bucket', buckets: buckets.map(b => [...b]) },
  };
};
