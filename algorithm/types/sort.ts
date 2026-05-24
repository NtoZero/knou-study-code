import { TreeNode, BTreeNode, GraphInput, TreeOperationInput } from './graph';
import type { GraphVertex, GraphEdge } from './graph';

export type HighlightType =
  | 'compare' | 'swap' | 'sorted' | 'pivot' | 'min' | 'insert' | 'current'
  | 'found' | 'search-range' | 'target'
  | 'visited' | 'active-edge' | 'tree-edge' | 'relaxed'
  | 'in-queue' | 'in-stack'
  | 'node-red' | 'node-black';

export interface Highlight {
  index: number;
  type: HighlightType;
}

export interface HeapAux {
  kind: 'heap';
  heapSize: number;
}

export interface CountingAux {
  kind: 'counting';
  counts: number[];
  phase: 'count' | 'cumulative' | 'place';
  outputArray: number[];
}

export interface RadixAux {
  kind: 'radix';
  buckets: number[][];
  currentDigit: number;
}

export interface BucketAux {
  kind: 'bucket';
  buckets: number[][];
}

export interface BSTAux {
  kind: 'bst';
  nodes: TreeNode[];
  root?: TreeNode | null;
}

export interface BalancedTreeAux {
  kind: 'balanced-tree';
  treeType: '234' | 'red-black' | 'b-tree';
  root?: TreeNode | BTreeNode | null;
}

export interface HashTableAux {
  kind: 'hash-table';
  table: (number | null)[];
  chains?: (number[])[];
  probeSequence?: number[];
  hashType: 'open' | 'closed';
  tombstones?: boolean[];
}

export interface GraphAux {
  kind: 'graph';
  vertices: GraphVertex[];
  edges: GraphEdge[];
  distances?: (number | null)[];
  parents?: (number | null)[];
  mstEdges?: number[];
  flowMatrix?: number[][];
  distMatrix?: (number | null)[][];
  queue?: number[];
  stack?: number[];
  order?: number[];
  orderLabel?: string;
  sets?: number[][];
  setsLabel?: string;
}

export type AuxiliaryData =
  | HeapAux | CountingAux | RadixAux | BucketAux
  | BSTAux | BalancedTreeAux | HashTableAux | GraphAux;

export interface SortStep {
  array: number[];
  highlights: Highlight[];
  codeLine: number;
  explanation: string;
  stats: { comparisons: number; swaps: number };
  auxiliaryData?: AuxiliaryData;
}

export type SortGenerator = (array: number[]) => Generator<SortStep, void, undefined>;

export type AlgorithmInput = number[] | GraphInput | TreeOperationInput;

export type AlgorithmGenerator =
  | SortGenerator
  | ((input: GraphInput) => Generator<SortStep, void, undefined>)
  | ((input: TreeOperationInput) => Generator<SortStep, void, undefined>);

export type AlgorithmGroup = '3강' | '4강' | '5강' | '6강' | '7강' | '8강' | '9강' | '10강';

export type AlgorithmCategory = 'sort' | 'search' | 'graph';

export interface AlgorithmMeta {
  id: string;
  name: string;
  nameEn: string;
  group: AlgorithmGroup;
  timeComplexity: { best: string; average: string; worst: string };
  spaceComplexity: string;
  stable: boolean;
  description: string;
  category?: AlgorithmCategory;
  inputType?: 'array' | 'graph' | 'tree';
}

export interface AlgorithmEntry {
  meta: AlgorithmMeta;
  generator: AlgorithmGenerator;
  pseudocode: string[];
}
