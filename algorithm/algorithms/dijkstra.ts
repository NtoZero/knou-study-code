import { SortStep, SortGenerator, GraphAux } from '../types/sort';
import { GraphVertex, GraphEdge } from '../types/graph';
import { getGraphExample } from '../data/graph-examples';

function buildWeightedAdj(n: number, edges: GraphEdge[], directed: boolean): { to: number; weight: number; edgeIdx: number }[][] {
  const adj: { to: number; weight: number; edgeIdx: number }[][] = Array.from({ length: n }, () => []);
  edges.forEach((e, idx) => {
    adj[e.from].push({ to: e.to, weight: e.weight ?? 1, edgeIdx: idx });
    if (!directed) adj[e.to].push({ to: e.from, weight: e.weight ?? 1, edgeIdx: idx });
  });
  return adj;
}

function cloneVertices(vertices: GraphVertex[]): GraphVertex[] {
  return vertices.map(v => ({ ...v }));
}

function cloneEdges(edges: GraphEdge[]): GraphEdge[] {
  return edges.map(e => ({ ...e }));
}

export const dijkstra: SortGenerator = function* (arr: number[]) {
  const graphIndex = arr[0] ?? 5;
  const startVertex = arr[1] ?? 0;
  const example = getGraphExample(graphIndex);
  const { vertices: srcVertices, edges: srcEdges, directed } = example.input;
  const n = srcVertices.length;
  const isDirected = directed ?? false;
  const adj = buildWeightedAdj(n, srcEdges, isDirected);

  const inS: boolean[] = new Array(n).fill(false);
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

  yield makeStep(0, `Dijkstra(G, ${sLabel}) 시작.`);

  // Initialize
  inS[startVertex] = true;
  dist[startVertex] = 0;
  vertexStates[startVertex] = 'visited';

  // Initialize distances from start vertex
  for (const { to, weight } of adj[startVertex]) {
    dist[to] = weight;
    parentVertex[to] = startVertex;
  }

  yield makeStep(1, `S ← {${sLabel}}, d[${sLabel}] ← 0.`);
  yield makeStep(3, `초기 거리: ${Array.from({ length: n }, (_, i) => i).filter(i => i !== startVertex).map(i => `d[${srcVertices[i].label ?? i}]=${distStr(i)}`).join(', ')}.`);

  let sCount = 1;

  while (sCount < n) {
    yield makeStep(5, `S ≠ V (|S|=${sCount}, |V|=${n}).`);

    // Find u in V-S with minimum d[u]
    let minDist = Infinity;
    let u = -1;

    for (let v = 0; v < n; v++) {
      if (inS[v]) continue;
      if (dist[v] !== null && dist[v]! < minDist) {
        minDist = dist[v]!;
        u = v;
      }
    }

    if (u === -1) break;

    comparisons++;
    const uLabel = srcVertices[u].label ?? u;

    vertexStates[u] = 'visiting';
    yield makeStep(6, `V-S에서 d가 최소인 정점: ${uLabel} (d=${minDist}).`);

    // Add u to S
    inS[u] = true;
    sCount++;
    vertexStates[u] = 'visited';

    yield makeStep(7, `S ← S ∪ {${uLabel}}. |S| = ${sCount}.`);

    // Relax edges from u
    for (const { to: v, weight: w, edgeIdx } of adj[u]) {
      if (inS[v]) continue;

      const vLabel = srcVertices[v].label ?? v;
      edgeStates[edgeIdx] = 'active';
      comparisons++;

      yield makeStep(9, `간선 (${uLabel}, ${vLabel}) 확인. d[${uLabel}] + w(${uLabel},${vLabel}) = ${minDist} + ${w} = ${minDist + w}, d[${vLabel}] = ${distStr(v)}.`);

      const newDist = minDist + w;
      if (dist[v] === null || newDist < dist[v]!) {
        const oldDist = distStr(v);
        dist[v] = newDist;
        parentVertex[v] = u;

        edgeStates[edgeIdx] = 'relaxed';
        yield makeStep(10, `d[${vLabel}] 갱신: ${oldDist} → ${newDist}.`);
      } else {
        yield makeStep(9, `${minDist + w} ≥ ${distStr(v)} → 갱신 불필요.`);
        edgeStates[edgeIdx] = 'default';
      }
    }

    // Reset active edges for next iteration
    for (let i = 0; i < edgeStates.length; i++) {
      if (edgeStates[i] === 'active') edgeStates[i] = 'default';
    }
  }

  yield makeStep(14, `Dijkstra 완료. 최단 거리: ${Array.from({ length: n }, (_, i) => `d[${srcVertices[i].label ?? i}]=${distStr(i)}`).join(', ')}.`);
};
