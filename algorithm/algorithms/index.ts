import { AlgorithmEntry } from '../types/sort';
import { algorithmMetas } from '../data/algorithm-info';
import { pseudocodes } from '../data/pseudocode';
import { selectionSort } from './selection-sort';
import { bubbleSort } from './bubble-sort';
import { insertionSort } from './insertion-sort';
import { shellSort } from './shell-sort';
import { quickSort } from './quick-sort';
import { mergeSort } from './merge-sort';
import { heapSort } from './heap-sort';
import { countingSort } from './counting-sort';
import { radixSort } from './radix-sort';
import { bucketSort } from './bucket-sort';
import { sequentialSearch } from './sequential-search';
import { binarySearch } from './binary-search';
import { bstOperations } from './bst';
import { tree234Operations } from './tree-234';
import { redBlackTree } from './red-black-tree';
import { bTree } from './b-tree';
import { hashTable } from './hash-table';
import { dfs } from './dfs';
import { bfs } from './bfs';
import { topologicalSort } from './topological-sort';
import { connectedComponents } from './connected-components';
import { stronglyConnectedComponents } from './strongly-connected-components';
import { kruskal } from './kruskal';
import { prim } from './prim';
import { dijkstra } from './dijkstra';
import { bellmanFord } from './bellman-ford';
import { floydWarshall } from './floyd-warshall';
import { fordFulkerson } from './ford-fulkerson';

export const algorithms: Record<string, AlgorithmEntry> = {
  selection: { meta: algorithmMetas.selection, generator: selectionSort, pseudocode: pseudocodes.selection },
  bubble: { meta: algorithmMetas.bubble, generator: bubbleSort, pseudocode: pseudocodes.bubble },
  insertion: { meta: algorithmMetas.insertion, generator: insertionSort, pseudocode: pseudocodes.insertion },
  shell: { meta: algorithmMetas.shell, generator: shellSort, pseudocode: pseudocodes.shell },
  quick: { meta: algorithmMetas.quick, generator: quickSort, pseudocode: pseudocodes.quick },
  merge: { meta: algorithmMetas.merge, generator: mergeSort, pseudocode: pseudocodes.merge },
  heap: { meta: algorithmMetas.heap, generator: heapSort, pseudocode: pseudocodes.heap },
  counting: { meta: algorithmMetas.counting, generator: countingSort, pseudocode: pseudocodes.counting },
  radix: { meta: algorithmMetas.radix, generator: radixSort, pseudocode: pseudocodes.radix },
  bucket: { meta: algorithmMetas.bucket, generator: bucketSort, pseudocode: pseudocodes.bucket },
  'sequential-search': { meta: algorithmMetas['sequential-search'], generator: sequentialSearch, pseudocode: pseudocodes['sequential-search'] },
  'binary-search': { meta: algorithmMetas['binary-search'], generator: binarySearch, pseudocode: pseudocodes['binary-search'] },
  bst: { meta: algorithmMetas.bst, generator: bstOperations, pseudocode: pseudocodes.bst },
  'tree-234': { meta: algorithmMetas['tree-234'], generator: tree234Operations, pseudocode: pseudocodes['tree-234'] },
  'red-black-tree': { meta: algorithmMetas['red-black-tree'], generator: redBlackTree, pseudocode: pseudocodes['red-black-tree'] },
  'b-tree': { meta: algorithmMetas['b-tree'], generator: bTree, pseudocode: pseudocodes['b-tree'] },
  'hash-table': { meta: algorithmMetas['hash-table'], generator: hashTable, pseudocode: pseudocodes['hash-table'] },
  dfs: { meta: algorithmMetas.dfs, generator: dfs, pseudocode: pseudocodes.dfs },
  bfs: { meta: algorithmMetas.bfs, generator: bfs, pseudocode: pseudocodes.bfs },
  'topological-sort': { meta: algorithmMetas['topological-sort'], generator: topologicalSort, pseudocode: pseudocodes['topological-sort'] },
  'connected-components': { meta: algorithmMetas['connected-components'], generator: connectedComponents, pseudocode: pseudocodes['connected-components'] },
  'strongly-connected-components': {
    meta: algorithmMetas['strongly-connected-components'],
    generator: stronglyConnectedComponents,
    pseudocode: pseudocodes['strongly-connected-components'],
  },
  kruskal: { meta: algorithmMetas.kruskal, generator: kruskal, pseudocode: pseudocodes.kruskal },
  prim: { meta: algorithmMetas.prim, generator: prim, pseudocode: pseudocodes.prim },
  dijkstra: { meta: algorithmMetas.dijkstra, generator: dijkstra, pseudocode: pseudocodes.dijkstra },
  'bellman-ford': { meta: algorithmMetas['bellman-ford'], generator: bellmanFord, pseudocode: pseudocodes['bellman-ford'] },
  'floyd-warshall': { meta: algorithmMetas['floyd-warshall'], generator: floydWarshall, pseudocode: pseudocodes['floyd-warshall'] },
  'ford-fulkerson': { meta: algorithmMetas['ford-fulkerson'], generator: fordFulkerson, pseudocode: pseudocodes['ford-fulkerson'] },
};

export const algorithmGroups = [
  { label: '3강: 기본 정렬', ids: ['selection', 'bubble', 'insertion'] },
  { label: '4강: 고급 정렬', ids: ['shell', 'quick', 'merge', 'heap'] },
  { label: '5강: 특수 정렬', ids: ['counting', 'radix', 'bucket'] },
  { label: '6강: 탐색 기본', ids: ['sequential-search', 'binary-search', 'bst', 'tree-234'] },
  { label: '7강: 균형 트리·해시', ids: ['red-black-tree', 'b-tree', 'hash-table'] },
  { label: '8강: 그래프 순회·SCC', ids: ['dfs', 'bfs', 'topological-sort', 'connected-components', 'strongly-connected-components'] },
  { label: '9강: MST·최단경로', ids: ['kruskal', 'prim', 'dijkstra'] },
  { label: '10강: 고급 그래프', ids: ['bellman-ford', 'floyd-warshall', 'ford-fulkerson'] },
];
