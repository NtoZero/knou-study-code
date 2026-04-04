export interface GraphVertex {
  id: number;
  x: number;
  y: number;
  label?: string;
  state?: 'unvisited' | 'in-queue' | 'in-stack' | 'visiting' | 'visited';
}

export interface GraphEdge {
  from: number;
  to: number;
  weight?: number;
  directed?: boolean;
  flow?: number;
  capacity?: number;
  state?: 'default' | 'active' | 'tree-edge' | 'mst' | 'relaxed' | 'augmenting' | 'back';
}

export interface GraphInput {
  vertices: GraphVertex[];
  edges: GraphEdge[];
  startVertex?: number;
  endVertex?: number;
  directed?: boolean;
}

export interface TreeNode {
  value: number;
  left?: TreeNode | null;
  right?: TreeNode | null;
  color?: 'red' | 'black';
  x?: number;
  y?: number;
  state?: 'default' | 'compare' | 'found' | 'insert' | 'current' | 'delete';
}

export interface BTreeNode {
  keys: number[];
  children?: BTreeNode[];
  x?: number;
  y?: number;
  state?: 'default' | 'compare' | 'found' | 'split' | 'current';
}

export interface TreeOperationInput {
  operations: { type: 'insert' | 'delete' | 'search'; value: number }[];
  initialValues?: number[];
}
