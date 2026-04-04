import { BSTAux } from '../../types/sort';
import { TreeNode } from '../../types/graph';

interface BinarySearchTreeProps {
  data: BSTAux;
}

interface NodeInfo {
  value: number;
  x: number;
  y: number;
  color: string;
}

interface EdgeInfo {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function getNodeColor(state?: TreeNode['state']): string {
  switch (state) {
    case 'compare': return '#f59e0b';
    case 'found': return '#22c55e';
    case 'insert': return '#3b82f6';
    case 'current': return '#06b6d4';
    case 'delete': return '#ef4444';
    default: return '#6b7280';
  }
}

function collectNodes(
  node: TreeNode | null | undefined,
  x: number,
  y: number,
  spread: number,
  nodes: NodeInfo[],
  edges: EdgeInfo[],
  depth: { max: number },
): void {
  if (!node) return;

  const level = Math.round((y - 35) / 60);
  if (level > depth.max) depth.max = level;

  nodes.push({
    value: node.value,
    x,
    y,
    color: getNodeColor(node.state),
  });

  if (node.left) {
    const childX = x - spread / 2;
    const childY = y + 60;
    edges.push({ x1: x, y1: y, x2: childX, y2: childY });
    collectNodes(node.left, childX, childY, spread / 2, nodes, edges, depth);
  }

  if (node.right) {
    const childX = x + spread / 2;
    const childY = y + 60;
    edges.push({ x1: x, y1: y, x2: childX, y2: childY });
    collectNodes(node.right, childX, childY, spread / 2, nodes, edges, depth);
  }
}

export function BinarySearchTree({ data }: BinarySearchTreeProps) {
  if (!data.root) return null;

  const nodes: NodeInfo[] = [];
  const edges: EdgeInfo[] = [];
  const depth = { max: 0 };

  collectNodes(data.root, 300, 35, 250, nodes, edges, depth);

  const height = (depth.max + 1) * 60 + 20;

  return (
    <div className="bg-slate-800/50 rounded-lg p-2">
      <p className="text-xs text-slate-400 mb-1 px-2">이진 탐색 트리</p>
      <svg viewBox={`0 0 600 ${height}`} className="w-full" style={{ maxHeight: 280 }}>
        {edges.map((e, idx) => (
          <line
            key={idx}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke="#475569"
            strokeWidth="1.5"
          />
        ))}
        {nodes.map((n, idx) => (
          <g key={idx}>
            <circle cx={n.x} cy={n.y} r={18} fill={n.color} opacity={0.9} />
            <text
              x={n.x}
              y={n.y + 5}
              textAnchor="middle"
              fontSize="12"
              fill="white"
              fontWeight="bold"
            >
              {n.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
