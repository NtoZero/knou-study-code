import { SortStep, SortGenerator, GraphAux } from '../types/sort';
import { GraphVertex, GraphEdge } from '../types/graph';
import { getGraphExample } from '../data/graph-examples';

function cloneVertices(vertices: GraphVertex[]): GraphVertex[] {
  return vertices.map(v => ({ ...v }));
}

function cloneEdges(edges: GraphEdge[]): GraphEdge[] {
  return edges.map(e => ({ ...e }));
}

export const topologicalSort: SortGenerator = function* (arr: number[]) {
  const graphIndex = arr[0] ?? 2;
  const example = getGraphExample(graphIndex);
  const { vertices: srcVertices, edges: srcEdges } = example.input;
  const n = srcVertices.length;

  // Compute in-degrees
  const inDegree: number[] = new Array(n).fill(0);
  for (const e of srcEdges) {
    inDegree[e.to]++;
  }

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
      orderLabel: '정렬 결과',
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
  yield makeStep(0, `TopologicalSort(G) 시작.`);

  // Step 1: compute in-degrees
  yield makeStep(1, `모든 정점의 진입차수 계산. [${inDegree.map((d, i) => `${srcVertices[i].label ?? i}:${d}`).join(', ')}].`);

  // Step 2: enqueue vertices with in-degree 0
  for (let i = 0; i < n; i++) {
    if (inDegree[i] === 0) {
      queue.push(i);
      vertexStates[i] = 'in-queue';
    }
  }

  yield makeStep(3, `진입차수 0인 정점을 큐에 삽입. 큐: [${queue.map(q => srcVertices[q].label ?? q).join(', ')}].`);

  while (queue.length > 0) {
    yield makeStep(4, `큐가 비어있지 않음. 큐: [${queue.map(q => srcVertices[q].label ?? q).join(', ')}].`);

    // Dequeue
    const v = queue.shift()!;
    vertexStates[v] = 'visiting';
    order.push(v);

    yield makeStep(10, `큐에서 정점 ${srcVertices[v].label ?? v} 삭제, 결과에 추가. 결과: [${order.map(o => srcVertices[o].label ?? o).join(', ')}].`);

    // Process outgoing edges
    for (let ei = 0; ei < srcEdges.length; ei++) {
      const e = srcEdges[ei];
      if (e.from !== v) continue;

      const w = e.to;
      edgeStates[ei] = 'active';

      yield makeStep(7, `간선 (${srcVertices[v].label ?? v}, ${srcVertices[w].label ?? w}) 처리.`);

      inDegree[w]--;
      edgeStates[ei] = 'tree-edge';

      yield makeStep(8, `정점 ${srcVertices[w].label ?? w}의 진입차수 1 감소 → ${inDegree[w]}.`);

      if (inDegree[w] === 0) {
        queue.push(w);
        vertexStates[w] = 'in-queue';

        yield makeStep(9, `정점 ${srcVertices[w].label ?? w}의 진입차수 = 0 → 큐에 삽입. 큐: [${queue.map(q => srcVertices[q].label ?? q).join(', ')}].`);
      }
    }

    // Mark vertex as fully processed
    vertexStates[v] = 'visited';
    yield makeStep(5, `정점 ${srcVertices[v].label ?? v} 처리 완료.`);
  }

  yield makeStep(15, `위상 정렬 완료. 결과: [${order.map(o => srcVertices[o].label ?? o).join(', ')}].`);
};
