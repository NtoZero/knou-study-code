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

export const bfs: SortGenerator = function* (arr: number[]) {
  const graphIndex = arr[0] ?? 0;
  const startVertex = arr[1] ?? 0;
  const example = getGraphExample(graphIndex);
  const { vertices: srcVertices, edges: srcEdges, directed } = example.input;
  const n = srcVertices.length;
  const isDirected = directed ?? false;
  const adj = buildAdjList(n, srcEdges, isDirected);

  const visited: boolean[] = new Array(n).fill(false);
  const order: number[] = [];
  const queue: number[] = [];

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
      queue: [...queue],
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
  yield makeStep(0, `BFS(G, ${srcVertices[startVertex].label ?? startVertex}) 시작.`);

  // Visit start vertex and enqueue
  visited[startVertex] = true;
  vertexStates[startVertex] = 'in-queue';
  queue.push(startVertex);
  order.push(startVertex);

  yield makeStep(1, `시작 정점 ${srcVertices[startVertex].label ?? startVertex}을(를) 방문 표시, 큐에 삽입. 큐: [${queue.map(q => srcVertices[q].label ?? q).join(', ')}].`);

  while (queue.length > 0) {
    yield makeStep(3, `큐가 비어있지 않음. 큐: [${queue.map(q => srcVertices[q].label ?? q).join(', ')}].`);

    // Dequeue
    const v = queue.shift()!;
    vertexStates[v] = 'visiting';

    yield makeStep(4, `큐에서 정점 ${srcVertices[v].label ?? v} 삭제.`);

    // Explore neighbors
    for (const w of adj[v]) {
      yield makeStep(6, `정점 ${srcVertices[v].label ?? v}에 인접한 정점 ${srcVertices[w].label ?? w} 확인.`);

      if (!visited[w]) {
        visited[w] = true;
        vertexStates[w] = 'in-queue';
        queue.push(w);
        order.push(w);

        // Mark edge as tree-edge
        const ei = findEdgeIndex(srcEdges, v, w, isDirected);
        if (ei >= 0) edgeStates[ei] = 'tree-edge';

        yield makeStep(8, `정점 ${srcVertices[w].label ?? w}은(는) 미방문 → 방문 표시, 큐에 삽입. 큐: [${queue.map(q => srcVertices[q].label ?? q).join(', ')}].`);
      } else {
        yield makeStep(7, `정점 ${srcVertices[w].label ?? w}은(는) 이미 방문 → 건너뜀.`);
      }
    }

    // Mark current vertex as fully processed
    vertexStates[v] = 'visited';
    yield makeStep(5, `정점 ${srcVertices[v].label ?? v} 처리 완료.`);
  }

  yield makeStep(0, `BFS 완료. 방문 순서: [${order.map(o => srcVertices[o].label ?? o).join(', ')}].`);
};
