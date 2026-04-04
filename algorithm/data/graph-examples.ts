import { GraphInput } from '../types/graph';

export interface GraphExample {
  name: string;
  description: string;
  input: GraphInput;
}

export const graphExamples: GraphExample[] = [
  // 0: 6-vertex undirected (DFS/BFS example)
  {
    name: '6정점 무방향 그래프',
    description: 'DFS/BFS 예제',
    input: {
      vertices: [
        { id: 0, x: 150, y: 50, label: 'A' },
        { id: 1, x: 50, y: 150, label: 'B' },
        { id: 2, x: 250, y: 150, label: 'C' },
        { id: 3, x: 50, y: 250, label: 'D' },
        { id: 4, x: 150, y: 250, label: 'E' },
        { id: 5, x: 250, y: 250, label: 'F' },
      ],
      edges: [
        { from: 0, to: 1 }, { from: 0, to: 2 },
        { from: 1, to: 3 }, { from: 1, to: 4 },
        { from: 2, to: 4 }, { from: 2, to: 5 },
        { from: 3, to: 4 }, { from: 4, to: 5 },
      ],
      directed: false,
    },
  },
  // 1: 8-vertex undirected
  {
    name: '8정점 무방향 그래프',
    description: '연결 성분 예제',
    input: {
      vertices: [
        { id: 0, x: 80, y: 50, label: '0' },
        { id: 1, x: 200, y: 50, label: '1' },
        { id: 2, x: 80, y: 150, label: '2' },
        { id: 3, x: 200, y: 150, label: '3' },
        { id: 4, x: 350, y: 50, label: '4' },
        { id: 5, x: 470, y: 50, label: '5' },
        { id: 6, x: 350, y: 150, label: '6' },
        { id: 7, x: 470, y: 150, label: '7' },
      ],
      edges: [
        { from: 0, to: 1 }, { from: 0, to: 2 },
        { from: 1, to: 3 }, { from: 2, to: 3 },
        { from: 4, to: 5 }, { from: 4, to: 6 },
        { from: 5, to: 7 }, { from: 6, to: 7 },
      ],
      directed: false,
    },
  },
  // 2: 6-vertex DAG (topological sort)
  {
    name: '6정점 DAG',
    description: '위상 정렬 예제',
    input: {
      vertices: [
        { id: 0, x: 80, y: 50, label: '0' },
        { id: 1, x: 220, y: 50, label: '1' },
        { id: 2, x: 80, y: 150, label: '2' },
        { id: 3, x: 220, y: 150, label: '3' },
        { id: 4, x: 150, y: 250, label: '4' },
        { id: 5, x: 300, y: 250, label: '5' },
      ],
      edges: [
        { from: 0, to: 2, directed: true },
        { from: 0, to: 3, directed: true },
        { from: 1, to: 3, directed: true },
        { from: 2, to: 4, directed: true },
        { from: 3, to: 4, directed: true },
        { from: 3, to: 5, directed: true },
      ],
      directed: true,
    },
  },
  // 3: 8-vertex directed (strongly connected components)
  {
    name: '8정점 방향 그래프',
    description: '강연결 성분 예제',
    input: {
      vertices: [
        { id: 0, x: 80, y: 50, label: '0' },
        { id: 1, x: 200, y: 50, label: '1' },
        { id: 2, x: 80, y: 170, label: '2' },
        { id: 3, x: 200, y: 170, label: '3' },
        { id: 4, x: 350, y: 50, label: '4' },
        { id: 5, x: 470, y: 50, label: '5' },
        { id: 6, x: 350, y: 170, label: '6' },
        { id: 7, x: 470, y: 170, label: '7' },
      ],
      edges: [
        { from: 0, to: 1, directed: true }, { from: 1, to: 3, directed: true },
        { from: 3, to: 2, directed: true }, { from: 2, to: 0, directed: true },
        { from: 1, to: 4, directed: true },
        { from: 4, to: 5, directed: true }, { from: 5, to: 7, directed: true },
        { from: 7, to: 6, directed: true }, { from: 6, to: 4, directed: true },
      ],
      directed: true,
    },
  },
  // 4: 6-vertex weighted undirected (Kruskal/Prim)
  {
    name: '6정점 가중 무방향 그래프',
    description: '크루스칼/프림 예제',
    input: {
      vertices: [
        { id: 0, x: 150, y: 50, label: '0' },
        { id: 1, x: 50, y: 150, label: '1' },
        { id: 2, x: 250, y: 150, label: '2' },
        { id: 3, x: 50, y: 280, label: '3' },
        { id: 4, x: 150, y: 280, label: '4' },
        { id: 5, x: 250, y: 280, label: '5' },
      ],
      edges: [
        { from: 0, to: 1, weight: 3 }, { from: 0, to: 2, weight: 5 },
        { from: 1, to: 2, weight: 4 }, { from: 1, to: 3, weight: 6 },
        { from: 2, to: 5, weight: 2 }, { from: 3, to: 4, weight: 1 },
        { from: 4, to: 5, weight: 7 }, { from: 1, to: 4, weight: 8 },
      ],
      directed: false,
    },
  },
  // 5: 6-vertex weighted directed (Dijkstra)
  {
    name: '6정점 가중 방향 그래프',
    description: '데이크스트라 예제',
    input: {
      vertices: [
        { id: 0, x: 80, y: 150, label: '0' },
        { id: 1, x: 200, y: 50, label: '1' },
        { id: 2, x: 200, y: 250, label: '2' },
        { id: 3, x: 350, y: 50, label: '3' },
        { id: 4, x: 350, y: 250, label: '4' },
        { id: 5, x: 470, y: 150, label: '5' },
      ],
      edges: [
        { from: 0, to: 1, weight: 3, directed: true },
        { from: 0, to: 2, weight: 4, directed: true },
        { from: 1, to: 3, weight: 2, directed: true },
        { from: 1, to: 2, weight: 5, directed: true },
        { from: 2, to: 4, weight: 6, directed: true },
        { from: 3, to: 5, weight: 3, directed: true },
        { from: 4, to: 5, weight: 1, directed: true },
        { from: 3, to: 4, weight: 4, directed: true },
      ],
      directed: true,
    },
  },
  // 6: 6-vertex weighted undirected (Dijkstra example 2)
  {
    name: '6정점 가중 무방향 그래프 (2)',
    description: '데이크스트라 예제 2',
    input: {
      vertices: [
        { id: 0, x: 80, y: 150, label: '0' },
        { id: 1, x: 200, y: 50, label: '1' },
        { id: 2, x: 200, y: 250, label: '2' },
        { id: 3, x: 350, y: 50, label: '3' },
        { id: 4, x: 350, y: 250, label: '4' },
        { id: 5, x: 470, y: 150, label: '5' },
      ],
      edges: [
        { from: 0, to: 1, weight: 1 }, { from: 0, to: 2, weight: 4 },
        { from: 1, to: 2, weight: 2 }, { from: 1, to: 3, weight: 7 },
        { from: 2, to: 4, weight: 3 }, { from: 3, to: 5, weight: 1 },
        { from: 4, to: 5, weight: 5 }, { from: 3, to: 4, weight: 2 },
      ],
      directed: false,
    },
  },
  // 7: 4-vertex negative weight (Bellman-Ford)
  {
    name: '4정점 음의 가중치 그래프',
    description: '벨만-포드 예제',
    input: {
      vertices: [
        { id: 0, x: 80, y: 100, label: '0' },
        { id: 1, x: 250, y: 50, label: '1' },
        { id: 2, x: 250, y: 200, label: '2' },
        { id: 3, x: 420, y: 100, label: '3' },
      ],
      edges: [
        { from: 0, to: 1, weight: 4, directed: true },
        { from: 0, to: 2, weight: 3, directed: true },
        { from: 1, to: 3, weight: -2, directed: true },
        { from: 2, to: 1, weight: -1, directed: true },
        { from: 2, to: 3, weight: 4, directed: true },
      ],
      directed: true,
    },
  },
  // 8: 7-vertex negative weight (Bellman-Ford example 2)
  {
    name: '7정점 음의 가중치 그래프',
    description: '벨만-포드 예제 2',
    input: {
      vertices: [
        { id: 0, x: 50, y: 130, label: '0' },
        { id: 1, x: 150, y: 50, label: '1' },
        { id: 2, x: 150, y: 210, label: '2' },
        { id: 3, x: 280, y: 50, label: '3' },
        { id: 4, x: 280, y: 210, label: '4' },
        { id: 5, x: 400, y: 50, label: '5' },
        { id: 6, x: 400, y: 210, label: '6' },
      ],
      edges: [
        { from: 0, to: 1, weight: 6, directed: true },
        { from: 0, to: 2, weight: 5, directed: true },
        { from: 1, to: 3, weight: -2, directed: true },
        { from: 2, to: 1, weight: -1, directed: true },
        { from: 2, to: 4, weight: 3, directed: true },
        { from: 3, to: 5, weight: 3, directed: true },
        { from: 4, to: 3, weight: 7, directed: true },
        { from: 4, to: 6, weight: 2, directed: true },
        { from: 5, to: 6, weight: -1, directed: true },
      ],
      directed: true,
    },
  },
  // 9: 5-vertex directed (Floyd-Warshall)
  {
    name: '5정점 방향 그래프',
    description: '플로이드 예제',
    input: {
      vertices: [
        { id: 0, x: 150, y: 50, label: '0' },
        { id: 1, x: 50, y: 170, label: '1' },
        { id: 2, x: 250, y: 170, label: '2' },
        { id: 3, x: 80, y: 290, label: '3' },
        { id: 4, x: 220, y: 290, label: '4' },
      ],
      edges: [
        { from: 0, to: 1, weight: 3, directed: true },
        { from: 0, to: 2, weight: 8, directed: true },
        { from: 1, to: 2, weight: 2, directed: true },
        { from: 1, to: 3, weight: 5, directed: true },
        { from: 2, to: 4, weight: 1, directed: true },
        { from: 3, to: 2, weight: -4, directed: true },
        { from: 3, to: 4, weight: 6, directed: true },
        { from: 4, to: 0, weight: 7, directed: true },
      ],
      directed: true,
    },
  },
  // 10: Network flow graph (Ford-Fulkerson)
  {
    name: '네트워크 플로 그래프',
    description: '포드-풀커슨 예제',
    input: {
      vertices: [
        { id: 0, x: 50, y: 150, label: 'S' },
        { id: 1, x: 180, y: 50, label: '1' },
        { id: 2, x: 180, y: 250, label: '2' },
        { id: 3, x: 350, y: 50, label: '3' },
        { id: 4, x: 350, y: 250, label: '4' },
        { id: 5, x: 480, y: 150, label: 'T' },
      ],
      edges: [
        { from: 0, to: 1, capacity: 10, flow: 0, directed: true },
        { from: 0, to: 2, capacity: 8, flow: 0, directed: true },
        { from: 1, to: 2, capacity: 5, flow: 0, directed: true },
        { from: 1, to: 3, capacity: 7, flow: 0, directed: true },
        { from: 2, to: 4, capacity: 10, flow: 0, directed: true },
        { from: 3, to: 4, capacity: 6, flow: 0, directed: true },
        { from: 3, to: 5, capacity: 10, flow: 0, directed: true },
        { from: 4, to: 5, capacity: 8, flow: 0, directed: true },
      ],
      directed: true,
      startVertex: 0,
      endVertex: 5,
    },
  },
];

export function getGraphExample(index: number): GraphExample {
  return graphExamples[Math.min(index, graphExamples.length - 1)];
}
