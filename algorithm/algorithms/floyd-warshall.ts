import { SortStep, SortGenerator, GraphAux } from '../types/sort';
import { GraphVertex, GraphEdge } from '../types/graph';
import { getGraphExample } from '../data/graph-examples';

function cloneVertices(vertices: GraphVertex[]): GraphVertex[] {
  return vertices.map(v => ({ ...v }));
}

function cloneEdges(edges: GraphEdge[]): GraphEdge[] {
  return edges.map(e => ({ ...e }));
}

export const floydWarshall: SortGenerator = function* (arr: number[]) {
  const graphIndex = arr[0] ?? 9;
  const example = getGraphExample(graphIndex);
  const { vertices: srcVertices, edges: srcEdges } = example.input;
  const n = srcVertices.length;

  // Initialize distance matrix
  const D: (number | null)[][] = Array.from({ length: n }, () => new Array(n).fill(null));
  for (let i = 0; i < n; i++) D[i][i] = 0;
  for (const e of srcEdges) {
    D[e.from][e.to] = e.weight ?? 1;
  }

  let comparisons = 0;

  const vertexStates: GraphVertex['state'][] = new Array(n).fill('unvisited');
  const edgeStates: GraphEdge['state'][] = new Array(srcEdges.length).fill('default');

  function cloneMatrix(): (number | null)[][] {
    return D.map(row => [...row]);
  }

  function makeAux(): GraphAux {
    const verts = cloneVertices(srcVertices);
    for (let i = 0; i < n; i++) verts[i].state = vertexStates[i];
    const edgs = cloneEdges(srcEdges);
    for (let i = 0; i < edgs.length; i++) edgs[i].state = edgeStates[i];
    return {
      kind: 'graph',
      vertices: verts,
      edges: edgs,
      distMatrix: cloneMatrix(),
    };
  }

  function makeStep(codeLine: number, explanation: string): SortStep {
    return {
      array: D[0].map(d => d ?? -1),
      highlights: [],
      codeLine,
      explanation,
      stats: { comparisons, swaps: 0 },
      auxiliaryData: makeAux(),
    };
  }

  function dStr(val: number | null): string {
    return val === null ? '∞' : String(val);
  }

  yield makeStep(0, `Floyd-Warshall(G) 시작.`);
  yield makeStep(3, `D ← 인접 행렬로 초기화.`);

  for (let k = 0; k < n; k++) {
    const kLabel = srcVertices[k].label ?? k;

    // Reset vertex states, highlight k
    for (let i = 0; i < n; i++) vertexStates[i] = 'unvisited';
    vertexStates[k] = 'visiting';

    yield makeStep(4, `k = ${k} (경유 정점: ${kLabel}).`);

    for (let i = 0; i < n; i++) {
      if (i === k) continue;
      const iLabel = srcVertices[i].label ?? i;

      for (let j = 0; j < n; j++) {
        if (j === k || i === j) continue;
        const jLabel = srcVertices[j].label ?? j;

        comparisons++;

        // Highlight i and j
        if (i !== k) vertexStates[i] = 'in-queue';
        if (j !== k && j !== i) vertexStates[j] = 'in-stack';

        if (D[i][k] !== null && D[k][j] !== null) {
          const throughK = D[i][k]! + D[k][j]!;

          yield makeStep(7, `D[${iLabel}][${kLabel}] + D[${kLabel}][${jLabel}] = ${dStr(D[i][k])} + ${dStr(D[k][j])} = ${throughK}, D[${iLabel}][${jLabel}] = ${dStr(D[i][j])}.`);

          if (D[i][j] === null || throughK < D[i][j]!) {
            const oldVal = dStr(D[i][j]);
            D[i][j] = throughK;

            yield makeStep(8, `D[${iLabel}][${jLabel}] 갱신: ${oldVal} → ${throughK}.`);
          }
        }

        // Reset i, j states
        if (i !== k) vertexStates[i] = 'unvisited';
        if (j !== k && j !== i) vertexStates[j] = 'unvisited';
      }
    }

    vertexStates[k] = 'visited';
    yield makeStep(4, `k = ${k} (${kLabel}) 완료.`);
  }

  yield makeStep(9, `Floyd-Warshall 완료. 최종 거리 행렬 생성.`);
};
