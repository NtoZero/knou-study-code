import { SortStep, SortGenerator, GraphAux } from '../types/sort';
import { GraphVertex, GraphEdge } from '../types/graph';
import { getGraphExample } from '../data/graph-examples';

function cloneVertices(vertices: GraphVertex[]): GraphVertex[] {
  return vertices.map(v => ({ ...v }));
}

function cloneEdges(edges: GraphEdge[]): GraphEdge[] {
  return edges.map(e => ({ ...e }));
}

export const kruskal: SortGenerator = function* (arr: number[]) {
  const graphIndex = arr[0] ?? 4;
  const example = getGraphExample(graphIndex);
  const { vertices: srcVertices, edges: srcEdges } = example.input;
  const n = srcVertices.length;

  // Union-Find
  const parent: number[] = Array.from({ length: n }, (_, i) => i);
  const rank: number[] = new Array(n).fill(0);

  function find(x: number): number {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }

  function union(a: number, b: number): void {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return;
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else { parent[rb] = ra; rank[ra]++; }
  }

  // Sort edges by weight
  const sortedEdgeIndices = srcEdges
    .map((_, i) => i)
    .sort((a, b) => (srcEdges[a].weight ?? 1) - (srcEdges[b].weight ?? 1));

  const vertexStates: GraphVertex['state'][] = new Array(n).fill('unvisited');
  const edgeStates: GraphEdge['state'][] = new Array(srcEdges.length).fill('default');
  const mstEdges: number[] = [];
  let comparisons = 0;

  function getSets(): number[][] {
    const setMap: Record<number, number[]> = {};
    for (let i = 0; i < n; i++) {
      const root = find(i);
      if (!setMap[root]) setMap[root] = [];
      setMap[root].push(i);
    }
    return Object.values(setMap);
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
      mstEdges: [...mstEdges],
      sets: getSets(),
    };
  }

  function makeStep(codeLine: number, explanation: string): SortStep {
    return {
      array: [...mstEdges],
      highlights: [],
      codeLine,
      explanation,
      stats: { comparisons, swaps: mstEdges.length },
      auxiliaryData: makeAux(),
    };
  }

  yield makeStep(0, `Kruskal(G) 시작.`);

  yield makeStep(4, `간선을 가중치 오름차순으로 정렬. 순서: [${sortedEdgeIndices.map(i => {
    const e = srcEdges[i];
    return `(${srcVertices[e.from].label ?? e.from}-${srcVertices[e.to].label ?? e.to}, ${e.weight ?? 1})`;
  }).join(', ')}].`);

  yield makeStep(1, `T ← ∅ (MST 간선 집합 초기화).`);

  for (const ei of sortedEdgeIndices) {
    const e = srcEdges[ei];
    const u = e.from;
    const v = e.to;
    const w = e.weight ?? 1;
    const uLabel = srcVertices[u].label ?? u;
    const vLabel = srcVertices[v].label ?? v;

    // Highlight active edge
    edgeStates[ei] = 'active';
    yield makeStep(5, `간선 (${uLabel}, ${vLabel}, 가중치 ${w}) 확인.`);

    comparisons++;
    const ru = find(u);
    const rv = find(v);

    if (ru !== rv) {
      // Different sets - add to MST
      edgeStates[ei] = 'mst';
      mstEdges.push(ei);
      union(u, v);

      vertexStates[u] = 'visited';
      vertexStates[v] = 'visited';

      yield makeStep(7, `${uLabel}와(과) ${vLabel}는 다른 집합 → MST에 추가. 간선 수: ${mstEdges.length}.`);

      yield makeStep(8, `Union(${uLabel}, ${vLabel}). 집합: ${getSets().map(s => `{${s.map(x => srcVertices[x].label ?? x).join(', ')}}`).join(', ')}.`);

      if (mstEdges.length === n - 1) break;
    } else {
      // Same set - reject (cycle)
      yield makeStep(10, `${uLabel}와(과) ${vLabel}는 같은 집합 → 사이클 발생, 건너뜀.`);
      edgeStates[ei] = 'default';
    }
  }

  const totalWeight = mstEdges.reduce((sum, ei) => sum + (srcEdges[ei].weight ?? 1), 0);
  yield makeStep(11, `Kruskal 완료. MST 간선 수: ${mstEdges.length}, 총 가중치: ${totalWeight}.`);
};
