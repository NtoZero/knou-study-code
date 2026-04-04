import { SortStep, SortGenerator, GraphAux } from '../types/sort';
import { GraphVertex, GraphEdge } from '../types/graph';
import { getGraphExample } from '../data/graph-examples';

function cloneVertices(vertices: GraphVertex[]): GraphVertex[] {
  return vertices.map(v => ({ ...v }));
}

function cloneEdges(edges: GraphEdge[]): GraphEdge[] {
  return edges.map(e => ({ ...e }));
}

export const fordFulkerson: SortGenerator = function* (arr: number[]) {
  const graphIndex = arr[0] ?? 10;
  const example = getGraphExample(graphIndex);
  const { vertices: srcVertices, edges: srcEdges } = example.input;
  const n = srcVertices.length;
  const s = example.input.startVertex ?? 0;
  const t = example.input.endVertex ?? n - 1;

  // Build flow matrix: flowMatrix[i][j] = current flow from i to j
  // Capacity matrix from edges
  const capacity: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const flow: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  for (const e of srcEdges) {
    capacity[e.from][e.to] = e.capacity ?? e.weight ?? 1;
  }

  let totalFlow = 0;
  let comparisons = 0;

  const vertexStates: GraphVertex['state'][] = new Array(n).fill('unvisited');
  const edgeStates: GraphEdge['state'][] = new Array(srcEdges.length).fill('default');

  function findEdgeIndex(from: number, to: number): number {
    return srcEdges.findIndex(e => e.from === from && e.to === to);
  }

  function cloneFlowMatrix(): number[][] {
    return flow.map(row => [...row]);
  }

  function makeAux(): GraphAux {
    const verts = cloneVertices(srcVertices);
    for (let i = 0; i < n; i++) verts[i].state = vertexStates[i];
    const edgs = cloneEdges(srcEdges);
    for (let i = 0; i < edgs.length; i++) {
      edgs[i].state = edgeStates[i];
      const e = srcEdges[i];
      edgs[i].flow = flow[e.from][e.to];
      edgs[i].capacity = capacity[e.from][e.to];
    }
    return {
      kind: 'graph',
      vertices: verts,
      edges: edgs,
      flowMatrix: cloneFlowMatrix(),
    };
  }

  function makeStep(codeLine: number, explanation: string): SortStep {
    return {
      array: [totalFlow],
      highlights: [],
      codeLine,
      explanation,
      stats: { comparisons, swaps: totalFlow },
      auxiliaryData: makeAux(),
    };
  }

  const sLabel = srcVertices[s].label ?? s;
  const tLabel = srcVertices[t].label ?? t;

  yield makeStep(0, `Ford-Fulkerson(G, ${sLabel}, ${tLabel}) 시작.`);
  yield makeStep(1, `각 간선의 유량 f ← 0.`);

  let iteration = 0;

  // BFS to find augmenting path
  function bfsPath(): number[] | null {
    const visited: boolean[] = new Array(n).fill(false);
    const parent: number[] = new Array(n).fill(-1);
    const queue: number[] = [s];
    visited[s] = true;

    while (queue.length > 0) {
      const u = queue.shift()!;
      for (let v = 0; v < n; v++) {
        // Residual capacity
        const residual = capacity[u][v] - flow[u][v];
        if (!visited[v] && residual > 0) {
          visited[v] = true;
          parent[v] = u;
          if (v === t) {
            // Reconstruct path
            const path: number[] = [];
            let cur = t;
            while (cur !== s) {
              path.unshift(cur);
              cur = parent[cur];
            }
            path.unshift(s);
            return path;
          }
          queue.push(v);
        }
      }
    }
    return null;
  }

  while (true) {
    // Reset edge states
    for (let i = 0; i < edgeStates.length; i++) {
      edgeStates[i] = 'default';
    }
    for (let i = 0; i < n; i++) vertexStates[i] = 'unvisited';

    const path = bfsPath();
    comparisons++;

    if (!path) {
      yield makeStep(2, `${sLabel}에서 ${tLabel}로의 증가 경로 없음. 종료.`);
      break;
    }

    iteration++;
    const pathLabels = path.map(v => srcVertices[v].label ?? v).join(' → ');

    // Highlight augmenting path
    for (const v of path) {
      vertexStates[v] = 'visiting';
    }
    for (let i = 0; i < path.length - 1; i++) {
      const ei = findEdgeIndex(path[i], path[i + 1]);
      if (ei >= 0) edgeStates[ei] = 'augmenting';
    }

    yield makeStep(2, `증가 경로 ${iteration} 발견: ${pathLabels}.`);

    // Find bottleneck (min residual capacity along path)
    let delta = Infinity;
    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i];
      const v = path[i + 1];
      const residual = capacity[u][v] - flow[u][v];
      delta = Math.min(delta, residual);
    }

    yield makeStep(3, `최소 잔여 용량 δ = ${delta}. 경로: ${pathLabels}.`);

    // Update flow along path
    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i];
      const v = path[i + 1];
      flow[u][v] += delta;
      flow[v][u] -= delta;

      const ei = findEdgeIndex(u, v);
      if (ei >= 0) {
        edgeStates[ei] = 'relaxed';
      }
    }

    totalFlow += delta;

    yield makeStep(6, `경로의 각 간선 유량 += ${delta}. 현재 총 유량: ${totalFlow}.`);
    yield makeStep(7, `역방향 간선 유량 -= ${delta}.`);
  }

  yield makeStep(10, `Ford-Fulkerson 완료. 최대 유량: ${totalFlow}.`);
};
