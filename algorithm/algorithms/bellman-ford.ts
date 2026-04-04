import { SortStep, SortGenerator, GraphAux } from '../types/sort';
import { GraphVertex, GraphEdge } from '../types/graph';
import { getGraphExample } from '../data/graph-examples';

function cloneVertices(vertices: GraphVertex[]): GraphVertex[] {
  return vertices.map(v => ({ ...v }));
}

function cloneEdges(edges: GraphEdge[]): GraphEdge[] {
  return edges.map(e => ({ ...e }));
}

export const bellmanFord: SortGenerator = function* (arr: number[]) {
  const graphIndex = arr[0] ?? 7;
  const startVertex = arr[1] ?? 0;
  const example = getGraphExample(graphIndex);
  const { vertices: srcVertices, edges: srcEdges } = example.input;
  const n = srcVertices.length;

  const dist: (number | null)[] = new Array(n).fill(null);
  const parentVertex: (number | null)[] = new Array(n).fill(null);
  let comparisons = 0;

  const vertexStates: GraphVertex['state'][] = new Array(n).fill('unvisited');
  const edgeStates: GraphEdge['state'][] = new Array(srcEdges.length).fill('default');

  function makeAux(): GraphAux {
    const verts = cloneVertices(srcVertices);
    for (let i = 0; i < n; i++) verts[i].state = vertexStates[i];
    const edgs = cloneEdges(srcEdges);
    for (let i = 0; i < edgs.length; i++) edgs[i].state = edgeStates[i];
    return {
      kind: 'graph',
      vertices: verts,
      edges: edgs,
      distances: [...dist],
      parents: [...parentVertex],
    };
  }

  function makeStep(codeLine: number, explanation: string): SortStep {
    return {
      array: dist.map(d => d ?? -1),
      highlights: [],
      codeLine,
      explanation,
      stats: { comparisons, swaps: 0 },
      auxiliaryData: makeAux(),
    };
  }

  function distStr(i: number): string {
    return dist[i] === null ? '∞' : String(dist[i]);
  }

  const sLabel = srcVertices[startVertex].label ?? startVertex;

  yield makeStep(0, `Bellman-Ford(G, ${sLabel}) 시작.`);

  // Initialize
  dist[startVertex] = 0;
  vertexStates[startVertex] = 'visited';

  yield makeStep(4, `d[${sLabel}] ← 0, 나머지 d[v] ← ∞.`);

  // |V|-1 iterations
  for (let i = 1; i <= n - 1; i++) {
    yield makeStep(5, `반복 ${i}/${n - 1} 시작.`);

    let updated = false;

    for (let ei = 0; ei < srcEdges.length; ei++) {
      const e = srcEdges[ei];
      const u = e.from;
      const v = e.to;
      const w = e.weight ?? 1;
      const uLabel = srcVertices[u].label ?? u;
      const vLabel = srcVertices[v].label ?? v;

      edgeStates[ei] = 'active';
      comparisons++;

      yield makeStep(6, `간선 (${uLabel}, ${vLabel}, 가중치 ${w}) 확인.`);

      if (dist[u] !== null) {
        const newDist = dist[u]! + w;

        if (dist[v] === null || newDist < dist[v]!) {
          const oldDist = distStr(v);
          dist[v] = newDist;
          parentVertex[v] = u;
          vertexStates[v] = 'visited';

          edgeStates[ei] = 'relaxed';
          updated = true;

          yield makeStep(8, `d[${uLabel}] + ${w} = ${newDist} < ${oldDist} → d[${vLabel}] ← ${newDist}.`);
        } else {
          yield makeStep(7, `d[${uLabel}] + ${w} = ${newDist} ≥ ${distStr(v)} → 갱신 불필요.`);
          edgeStates[ei] = 'default';
        }
      } else {
        yield makeStep(7, `d[${uLabel}] = ∞ → 비교 불가, 건너뜀.`);
        edgeStates[ei] = 'default';
      }
    }

    // Reset relaxed edges for next iteration
    for (let ei = 0; ei < edgeStates.length; ei++) {
      if (edgeStates[ei] === 'relaxed') edgeStates[ei] = 'default';
    }

    if (!updated) {
      yield makeStep(5, `반복 ${i}에서 갱신 없음 → 조기 종료.`);
      break;
    }
  }

  // Negative cycle check
  yield makeStep(11, `음의 사이클 검사 시작.`);

  let hasNegativeCycle = false;
  for (let ei = 0; ei < srcEdges.length; ei++) {
    const e = srcEdges[ei];
    const u = e.from;
    const v = e.to;
    const w = e.weight ?? 1;

    edgeStates[ei] = 'active';
    comparisons++;

    if (dist[u] !== null && (dist[v] === null || dist[u]! + w < dist[v]!)) {
      hasNegativeCycle = true;
      edgeStates[ei] = 'back';
      yield makeStep(11, `간선 (${srcVertices[u].label ?? u}, ${srcVertices[v].label ?? v}): d[${srcVertices[u].label ?? u}] + ${w} < d[${srcVertices[v].label ?? v}] → 음의 사이클 발견!`);
      break;
    }
    edgeStates[ei] = 'default';
  }

  if (hasNegativeCycle) {
    yield makeStep(11, `음의 사이클 존재.`);
  } else {
    yield makeStep(11, `음의 사이클 없음.`);
  }

  yield makeStep(11, `Bellman-Ford 완료. 최단 거리: ${Array.from({ length: n }, (_, i) => `d[${srcVertices[i].label ?? i}]=${distStr(i)}`).join(', ')}.`);
};
