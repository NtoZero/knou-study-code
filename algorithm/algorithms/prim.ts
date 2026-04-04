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

export const prim: SortGenerator = function* (arr: number[]) {
  const graphIndex = arr[0] ?? 4;
  const startVertex = arr[1] ?? 0;
  const example = getGraphExample(graphIndex);
  const { vertices: srcVertices, edges: srcEdges, directed } = example.input;
  const n = srcVertices.length;
  const isDirected = directed ?? false;
  const adj = buildWeightedAdj(n, srcEdges, isDirected);

  const inS: boolean[] = new Array(n).fill(false);
  const dist: (number | null)[] = new Array(n).fill(null);
  const parentVertex: (number | null)[] = new Array(n).fill(null);
  const mstEdges: number[] = [];
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
      mstEdges: [...mstEdges],
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

  const sLabel = srcVertices[startVertex].label ?? startVertex;

  yield makeStep(0, `Prim(G, ${sLabel}) 시작.`);

  // Initialize
  inS[startVertex] = true;
  dist[startVertex] = 0;
  vertexStates[startVertex] = 'visited';

  yield makeStep(2, `S ← {${sLabel}}, d[${sLabel}] ← 0.`);

  // Set initial distances for neighbors of start
  for (const { to, weight } of adj[startVertex]) {
    dist[to] = weight;
    parentVertex[to] = startVertex;
  }

  yield makeStep(1, `나머지 정점 d 값 초기화. ${Array.from({ length: n }, (_, i) => i).filter(i => i !== startVertex).map(i => `d[${srcVertices[i].label ?? i}]=${dist[i] ?? '∞'}`).join(', ')}.`);

  let sCount = 1;

  while (sCount < n) {
    yield makeStep(3, `S ≠ V (|S|=${sCount}, |V|=${n}).`);

    // Find minimum edge from S to V-S
    let minDist = Infinity;
    let minV = -1;
    let minEdgeIdx = -1;
    let minU = -1;

    for (let v = 0; v < n; v++) {
      if (inS[v]) continue;
      if (dist[v] !== null && dist[v]! < minDist) {
        minDist = dist[v]!;
        minV = v;
      }
    }

    if (minV === -1) break;

    // Find the actual edge
    minU = parentVertex[minV] as number;
    for (const { to, weight, edgeIdx } of adj[minU]) {
      if (to === minV && weight === minDist) {
        minEdgeIdx = edgeIdx;
        break;
      }
    }

    const uLabel = srcVertices[minU].label ?? minU;
    const vLabel = srcVertices[minV].label ?? minV;

    // Highlight the selected edge
    if (minEdgeIdx >= 0) {
      edgeStates[minEdgeIdx] = 'active';
    }
    comparisons++;

    yield makeStep(4, `최소 가중치 간선: (${uLabel}, ${vLabel}, 가중치 ${minDist}) 선택.`);

    // Add to S
    inS[minV] = true;
    sCount++;
    vertexStates[minV] = 'visited';
    if (minEdgeIdx >= 0) {
      edgeStates[minEdgeIdx] = 'mst';
      mstEdges.push(minEdgeIdx);
    }

    yield makeStep(6, `S ← S ∪ {${vLabel}}. |S| = ${sCount}.`);
    yield makeStep(5, `T ← T ∪ {(${uLabel}, ${vLabel})}. MST 간선 수: ${mstEdges.length}.`);

    // Update distances for neighbors of minV
    let updated = false;
    for (const { to, weight, edgeIdx } of adj[minV]) {
      if (inS[to]) continue;
      if (dist[to] === null || weight < dist[to]!) {
        const oldDist = dist[to];
        dist[to] = weight;
        parentVertex[to] = minV;
        updated = true;

        edgeStates[edgeIdx] = 'relaxed';
        yield makeStep(7, `d[${srcVertices[to].label ?? to}] 갱신: ${oldDist ?? '∞'} → ${weight}.`);
        edgeStates[edgeIdx] = 'default';
      }
    }

    if (!updated) {
      yield makeStep(7, `${vLabel}에 인접한 V-S 정점 없음 또는 갱신 불필요.`);
    }
  }

  const totalWeight = mstEdges.reduce((sum, ei) => sum + (srcEdges[ei].weight ?? 1), 0);
  yield makeStep(8, `Prim 완료. MST 간선 수: ${mstEdges.length}, 총 가중치: ${totalWeight}.`);
};
