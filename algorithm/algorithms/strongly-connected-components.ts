import { SortStep, SortGenerator, GraphAux } from '../types/sort';
import { GraphVertex, GraphEdge } from '../types/graph';
import { getGraphExample } from '../data/graph-examples';

function buildAdjList(n: number, edges: GraphEdge[]): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const edge of edges) {
    adj[edge.from].push(edge.to);
  }
  return adj;
}

function cloneVertices(vertices: GraphVertex[]): GraphVertex[] {
  return vertices.map(v => ({ ...v }));
}

function cloneEdges(edges: GraphEdge[]): GraphEdge[] {
  return edges.map(e => ({ ...e }));
}

function findEdgeIndex(edges: GraphEdge[], from: number, to: number): number {
  return edges.findIndex(edge => edge.from === from && edge.to === to);
}

export const stronglyConnectedComponents: SortGenerator = function* (arr: number[]) {
  const graphIndex = arr[0] ?? 3;
  const example = getGraphExample(graphIndex);
  const { vertices: srcVertices, edges: srcEdges } = example.input;
  const n = srcVertices.length;

  const originalEdges = cloneEdges(srcEdges).map(edge => ({ ...edge, directed: true }));
  const reversedEdges = originalEdges.map(edge => ({
    ...edge,
    from: edge.to,
    to: edge.from,
    directed: true,
  }));

  let currentEdges = originalEdges;
  let adj = buildAdjList(n, currentEdges);

  const visited: boolean[] = Array.from({ length: n }, () => false);
  const vertexStates: GraphVertex['state'][] = Array.from(
    { length: n },
    () => 'unvisited' as GraphVertex['state'],
  );
  const edgeStates: GraphEdge['state'][] = Array.from(
    { length: originalEdges.length },
    () => 'default' as GraphEdge['state'],
  );
  const finishOrder: number[] = [];
  const components: number[][] = [];
  const callStack: number[] = [];
  let comparisons = 0;

  function makeAux(): GraphAux {
    const verts = cloneVertices(srcVertices);
    for (let i = 0; i < n; i++) verts[i].state = vertexStates[i];

    const edgs = cloneEdges(currentEdges);
    for (let i = 0; i < edgs.length; i++) edgs[i].state = edgeStates[i];

    return {
      kind: 'graph',
      vertices: verts,
      edges: edgs,
      stack: [...callStack],
      order: [...finishOrder],
      orderLabel: '완료 순서',
      sets: components.map(component => [...component]),
      setsLabel: '강연결 성분',
    };
  }

  function makeStep(codeLine: number, explanation: string): SortStep {
    return {
      array: [...finishOrder],
      highlights: [],
      codeLine,
      explanation,
      stats: { comparisons, swaps: 0 },
      auxiliaryData: makeAux(),
    };
  }

  function pushStack(v: number): void {
    callStack.push(v);
    vertexStates[v] = 'in-stack';
  }

  function popStack(): void {
    callStack.pop();
  }

  function* dfsForward(v: number): Generator<SortStep, void, undefined> {
    visited[v] = true;
    vertexStates[v] = 'visiting';
    pushStack(v);

    yield makeStep(
      3,
      `1차 DFS: 정점 ${srcVertices[v].label ?? v} 방문. 완료 순서를 계산.`,
    );

    for (const next of adj[v]) {
      comparisons++;
      const edgeIndex = findEdgeIndex(currentEdges, v, next);

      yield makeStep(
        4,
        `정점 ${srcVertices[v].label ?? v}의 인접 정점 ${srcVertices[next].label ?? next} 확인.`,
      );

      if (!visited[next]) {
        if (edgeIndex >= 0) edgeStates[edgeIndex] = 'tree-edge';

        yield makeStep(
          5,
          `정점 ${srcVertices[next].label ?? next}은(는) 미방문 → 재귀 호출.`,
        );

        yield* dfsForward(next);
      }
    }

    vertexStates[v] = 'visited';
    finishOrder.push(v);
    popStack();

    yield makeStep(
      6,
      `정점 ${srcVertices[v].label ?? v} 완료. 완료 순서: [${finishOrder
        .map(idx => srcVertices[idx].label ?? idx)
        .join(', ')}].`,
    );
  }

  function* dfsComponent(v: number, component: number[]): Generator<SortStep, void, undefined> {
    visited[v] = true;
    vertexStates[v] = 'visiting';
    pushStack(v);
    component.push(v);

    yield makeStep(
      15,
      `전치 그래프에서 정점 ${srcVertices[v].label ?? v} 방문. 현재 성분: [${component
        .map(idx => srcVertices[idx].label ?? idx)
        .join(', ')}].`,
    );

    for (const next of adj[v]) {
      comparisons++;
      const edgeIndex = findEdgeIndex(currentEdges, v, next);

      yield makeStep(
        17,
        `전치 그래프의 정점 ${srcVertices[v].label ?? v}에서 ${srcVertices[next].label ?? next} 확인.`,
      );

      if (!visited[next]) {
        if (edgeIndex >= 0) edgeStates[edgeIndex] = 'tree-edge';

        yield makeStep(
          18,
          `정점 ${srcVertices[next].label ?? next}은(는) 미방문 → 같은 강연결 성분으로 확장.`,
        );

        yield* dfsComponent(next, component);
      }
    }

    vertexStates[v] = 'visited';
    popStack();

    yield makeStep(
      16,
      `정점 ${srcVertices[v].label ?? v} 처리 완료. 현재 성분: [${component
        .map(idx => srcVertices[idx].label ?? idx)
        .join(', ')}].`,
    );
  }

  yield makeStep(0, `StronglyConnectedComponents(G) 시작.`);
  yield makeStep(1, `1차 DFS로 완료 순서를 계산.`);

  for (let v = 0; v < n; v++) {
    if (!visited[v]) {
      yield makeStep(
        2,
        `시작 정점 ${srcVertices[v].label ?? v}에서 1차 DFS 수행.`,
      );
      yield* dfsForward(v);
    }
  }

  yield makeStep(7, `전치 그래프 G^R 구성.`);

  currentEdges = reversedEdges;
  adj = buildAdjList(n, currentEdges);

  for (let i = 0; i < n; i++) {
    visited[i] = false;
    vertexStates[i] = 'unvisited';
    edgeStates[i] = 'default';
  }
  callStack.length = 0;

  yield makeStep(8, `완료 순서가 큰 정점부터 2차 DFS 수행 준비.`);

  for (const v of [...finishOrder].reverse()) {
    yield makeStep(
      9,
      `완료 순서가 큰 정점 ${srcVertices[v].label ?? v} 확인.`,
    );

    if (!visited[v]) {
      const component: number[] = [];
      components.push(component);

      yield makeStep(
        11,
        `새 강연결 성분 시작. 시작 정점 ${srcVertices[v].label ?? v}.`,
      );

      yield* dfsComponent(v, component);

      yield makeStep(
        13,
        `강연결 성분 완료: [${component
          .map(idx => srcVertices[idx].label ?? idx)
          .join(', ')}].`,
      );
    } else {
      yield makeStep(
        10,
        `정점 ${srcVertices[v].label ?? v}은(는) 이미 방문 → 건너뜀.`,
      );
    }
  }

  yield makeStep(
    14,
    `강연결 성분 탐색 완료. 총 ${components.length}개의 성분 발견.`,
  );
};
