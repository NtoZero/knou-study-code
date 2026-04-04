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

export const dfs: SortGenerator = function* (arr: number[]) {
  const graphIndex = arr[0] ?? 0;
  const startVertex = arr[1] ?? 0;
  const example = getGraphExample(graphIndex);
  const { vertices: srcVertices, edges: srcEdges, directed } = example.input;
  const n = srcVertices.length;
  const isDirected = directed ?? false;
  const adj = buildAdjList(n, srcEdges, isDirected);

  const visited: boolean[] = new Array(n).fill(false);
  const order: number[] = [];
  const stack: number[] = [];

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
      stack: [...stack],
      order: [...order],
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
  yield makeStep(0, `DFS(G, ${srcVertices[startVertex].label ?? startVertex}) 시작.`);

  // Push start vertex
  stack.push(startVertex);
  vertexStates[startVertex] = 'in-stack';
  yield makeStep(1, `시작 정점 ${srcVertices[startVertex].label ?? startVertex}을(를) 스택에 삽입.`);

  while (stack.length > 0) {
    const v = stack.pop()!;

    if (visited[v]) continue;

    // Mark as visiting
    visited[v] = true;
    vertexStates[v] = 'visiting';
    order.push(v);

    yield makeStep(5, `정점 ${srcVertices[v].label ?? v} 방문 표시. 방문 순서: [${order.map(o => srcVertices[o].label ?? o).join(', ')}].`);

    // Get neighbors (reverse to maintain left-to-right order with stack)
    const neighbors = [...adj[v]].reverse();

    for (const w of neighbors) {
      yield makeStep(7, `정점 ${srcVertices[v].label ?? v}에 인접한 정점 ${srcVertices[w].label ?? w} 확인.`);

      if (!visited[w] && !stack.includes(w)) {
        // Mark edge as tree-edge
        const ei = findEdgeIndex(srcEdges, v, w, isDirected);
        if (ei >= 0) edgeStates[ei] = 'tree-edge';

        stack.push(w);
        vertexStates[w] = 'in-stack';

        yield makeStep(9, `정점 ${srcVertices[w].label ?? w}은(는) 미방문 → 스택에 삽입. 스택: [${stack.map(s => srcVertices[s].label ?? s).join(', ')}].`);
      } else if (visited[w]) {
        yield makeStep(8, `정점 ${srcVertices[w].label ?? w}은(는) 이미 방문 → 건너뜀.`);
      }
    }

    // Mark current vertex as visited
    vertexStates[v] = 'visited';
    yield makeStep(10, `정점 ${srcVertices[v].label ?? v} 처리 완료.`);
  }

  yield makeStep(0, `DFS 완료. 방문 순서: [${order.map(o => srcVertices[o].label ?? o).join(', ')}].`);
};
