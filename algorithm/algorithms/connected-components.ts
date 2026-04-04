import { SortStep, SortGenerator, GraphAux } from '../types/sort';
import { GraphVertex, GraphEdge } from '../types/graph';
import { getGraphExample } from '../data/graph-examples';

function buildAdjList(n: number, edges: GraphEdge[], directed: boolean): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const e of edges) {
    adj[e.from].push(e.to);
    if (!directed) adj[e.to].push(e.from);
  }
  return adj;
}

function cloneVertices(vertices: GraphVertex[]): GraphVertex[] {
  return vertices.map(v => ({ ...v }));
}

function cloneEdges(edges: GraphEdge[]): GraphEdge[] {
  return edges.map(e => ({ ...e }));
}

function findEdgeIndex(
  edges: GraphEdge[],
  from: number,
  to: number,
  directed: boolean,
): number {
  return edges.findIndex(
    e =>
      (e.from === from && e.to === to) ||
      (!directed && e.from === to && e.to === from),
  );
}

export const connectedComponents: SortGenerator = function* (arr: number[]) {
  const graphIndex = arr[0] ?? 1;
  const example = getGraphExample(graphIndex);
  const { vertices: srcVertices, edges: srcEdges, directed } = example.input;
  const n = srcVertices.length;
  const isDirected = directed ?? false;
  const adj = buildAdjList(n, srcEdges, isDirected);

  const visited: boolean[] = new Array(n).fill(false);
  const order: number[] = [];
  const sets: number[][] = [];
  let comp = 0;

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
      order: [...order],
      sets: sets.map(s => [...s]),
    };
  }

  function makeStep(codeLine: number, explanation: string): SortStep {
    return {
      array: [...order],
      highlights: [],
      codeLine,
      explanation,
      stats: { comparisons: 0, swaps: 0 },
      auxiliaryData: makeAux(),
    };
  }

  // Initial state
  yield makeStep(0, `ConnectedComponents(G) 시작.`);

  yield makeStep(1, `comp ← 0. 연결 성분 수 초기화.`);

  for (let v = 0; v < n; v++) {
    yield makeStep(2, `정점 ${srcVertices[v].label ?? v} 확인.`);

    if (!visited[v]) {
      yield makeStep(3, `정점 ${srcVertices[v].label ?? v}은(는) 미방문.`);

      comp++;
      const currentSet: number[] = [];
      sets.push(currentSet);

      yield makeStep(4, `comp ← ${comp}. 새로운 연결 성분 시작.`);

      // DFS from v using iterative stack
      const stack: number[] = [v];
      vertexStates[v] = 'in-stack';

      while (stack.length > 0) {
        const u = stack.pop()!;

        if (visited[u]) continue;

        visited[u] = true;
        vertexStates[u] = 'visiting';
        order.push(u);
        currentSet.push(u);

        yield makeStep(5, `DFS: 정점 ${srcVertices[u].label ?? u} 방문. 성분 ${comp}: [${currentSet.map(s => srcVertices[s].label ?? s).join(', ')}].`);

        // Push neighbors in reverse order
        const neighbors = [...adj[u]].reverse();
        for (const w of neighbors) {
          if (!visited[w]) {
            const ei = findEdgeIndex(srcEdges, u, w, isDirected);
            if (ei >= 0) edgeStates[ei] = 'tree-edge';

            if (!stack.includes(w)) {
              stack.push(w);
              vertexStates[w] = 'in-stack';
            }
          }
        }

        vertexStates[u] = 'visited';
      }

      yield makeStep(6, `연결 성분 ${comp} 완료: [${currentSet.map(s => srcVertices[s].label ?? s).join(', ')}].`);
    } else {
      yield makeStep(3, `정점 ${srcVertices[v].label ?? v}은(는) 이미 방문 → 건너뜀.`);
    }
  }

  yield makeStep(0, `연결 성분 탐색 완료. 총 ${comp}개의 연결 성분 발견. ${sets.map((s, i) => `성분 ${i + 1}: [${s.map(v => srcVertices[v].label ?? v).join(', ')}]`).join(', ')}.`);
};
