import { SortStep, SortGenerator, HashTableAux } from '../types/sort';

const TABLE_SIZE = 7;

function hash(x: number): number {
  return ((x % TABLE_SIZE) + TABLE_SIZE) % TABLE_SIZE;
}

function hash2(x: number): number {
  return 5 - (((x % 5) + 5) % 5);
}

function cloneTable(table: (number | null)[]): (number | null)[] {
  return [...table];
}

function cloneChains(chains: (number[])[]): (number[])[] {
  return chains.map(c => [...c]);
}

export const hashTable: SortGenerator = function* (arr) {
  const a = [...arr];
  // Last element determines hash type: 0=open, 1=linear, 2=quadratic, 3=double
  const hashTypeCode = a.pop()!;
  let comparisons = 0;

  const isOpen = hashTypeCode === 0;
  const hashTypeName = (() => {
    switch (hashTypeCode) {
      case 0: return '개방 해싱 (체이닝)';
      case 1: return '폐쇄 해싱 (선형 탐사)';
      case 2: return '폐쇄 해싱 (이차 탐사)';
      case 3: return '폐쇄 해싱 (이중 해싱)';
      default: return '개방 해싱 (체이닝)';
    }
  })();

  if (isOpen) {
    // Open hashing (chaining)
    const chains: (number[])[] = Array.from({ length: TABLE_SIZE }, () => []);
    const table: (number | null)[] = new Array(TABLE_SIZE).fill(null);

    const makeAux = (): HashTableAux => ({
      kind: 'hash-table',
      table: cloneTable(table),
      chains: cloneChains(chains),
      hashType: 'open',
    });

    yield {
      array: [...a],
      highlights: [],
      codeLine: 0,
      explanation: `${hashTypeName} 시작. 테이블 크기: ${TABLE_SIZE}. 삽입할 값: [${a.join(', ')}].`,
      stats: { comparisons, swaps: 0 },
      auxiliaryData: makeAux(),
    };

    for (let idx = 0; idx < a.length; idx++) {
      const val = a[idx];
      const h = hash(val);

      yield {
        array: [...a],
        highlights: [{ index: idx, type: 'current' }],
        codeLine: 1,
        explanation: `h(${val}) = ${val} mod ${TABLE_SIZE} = ${h}.`,
        stats: { comparisons, swaps: 0 },
        auxiliaryData: makeAux(),
      };

      chains[h].push(val);
      table[h] = chains[h][0]; // representative

      yield {
        array: [...a],
        highlights: [{ index: idx, type: 'insert' }],
        codeLine: 3,
        explanation: `T[${h}]의 체인에 ${val} 추가. 체인: [${chains[h].join(', ')}].`,
        stats: { comparisons, swaps: 0 },
        auxiliaryData: makeAux(),
      };
    }

    yield {
      array: [...a],
      highlights: [],
      codeLine: 3,
      explanation: `개방 해싱 완료. 총 비교 횟수: ${comparisons}.`,
      stats: { comparisons, swaps: 0 },
      auxiliaryData: makeAux(),
    };
  } else {
    // Closed hashing (probing)
    const table: (number | null)[] = new Array(TABLE_SIZE).fill(null);

    const makeAux = (probeSeq?: number[]): HashTableAux => ({
      kind: 'hash-table',
      table: cloneTable(table),
      probeSequence: probeSeq ? [...probeSeq] : undefined,
      hashType: 'closed',
    });

    yield {
      array: [...a],
      highlights: [],
      codeLine: 0,
      explanation: `${hashTypeName} 시작. 테이블 크기: ${TABLE_SIZE}. 삽입할 값: [${a.join(', ')}].`,
      stats: { comparisons, swaps: 0 },
      auxiliaryData: makeAux(),
    };

    for (let idx = 0; idx < a.length; idx++) {
      const val = a[idx];
      const h0 = hash(val);
      const probeSequence: number[] = [];

      yield {
        array: [...a],
        highlights: [{ index: idx, type: 'current' }],
        codeLine: 1,
        explanation: `h(${val}) = ${val} mod ${TABLE_SIZE} = ${h0}.`,
        stats: { comparisons, swaps: 0 },
        auxiliaryData: makeAux(),
      };

      let h = h0;
      let step = 0;
      let placed = false;

      while (!placed) {
        probeSequence.push(h);
        comparisons++;

        if (table[h] === null) {
          table[h] = val;
          placed = true;

          yield {
            array: [...a],
            highlights: [{ index: idx, type: 'insert' }],
            codeLine: 7,
            explanation: `T[${h}]이 비어있음. ${val} 삽입.${probeSequence.length > 1 ? ` 탐사 순서: [${probeSequence.join(', ')}].` : ''}`,
            stats: { comparisons, swaps: 0 },
            auxiliaryData: makeAux(probeSequence),
          };
        } else {
          const stepDesc = (() => {
            switch (hashTypeCode) {
              case 1: return `선형 탐사: h = (${h0} + ${step + 1}) mod ${TABLE_SIZE}`;
              case 2: return `이차 탐사: h = (${h0} + ${step + 1}²) mod ${TABLE_SIZE}`;
              case 3: return `이중 해싱: h = (${h0} + ${step + 1}×h₂(${val})) mod ${TABLE_SIZE}, h₂=${hash2(val)}`;
              default: return '';
            }
          })();

          yield {
            array: [...a],
            highlights: [{ index: idx, type: 'compare' }],
            codeLine: 5,
            explanation: `T[${h}] = ${table[h]}. 충돌 발생. ${stepDesc}.`,
            stats: { comparisons, swaps: 0 },
            auxiliaryData: makeAux(probeSequence),
          };

          step++;

          // Compute next probe position
          switch (hashTypeCode) {
            case 1: // linear probing
              h = (h0 + step) % TABLE_SIZE;
              break;
            case 2: // quadratic probing
              h = (h0 + step * step) % TABLE_SIZE;
              break;
            case 3: // double hashing
              h = (h0 + step * hash2(val)) % TABLE_SIZE;
              break;
          }

          yield {
            array: [...a],
            highlights: [{ index: idx, type: 'current' }],
            codeLine: 6,
            explanation: `다음 탐사 위치: h = ${h}.`,
            stats: { comparisons, swaps: 0 },
            auxiliaryData: makeAux(probeSequence),
          };

          // Safety: prevent infinite loop if table is full
          if (step >= TABLE_SIZE) {
            yield {
              array: [...a],
              highlights: [{ index: idx, type: 'current' }],
              codeLine: 7,
              explanation: `테이블이 가득 참. ${val} 삽입 불가.`,
              stats: { comparisons, swaps: 0 },
              auxiliaryData: makeAux(probeSequence),
            };
            placed = true;
          }
        }
      }
    }

    yield {
      array: [...a],
      highlights: [],
      codeLine: 7,
      explanation: `${hashTypeName} 완료. 총 비교 횟수: ${comparisons}.`,
      stats: { comparisons, swaps: 0 },
      auxiliaryData: makeAux(),
    };
  }
};
