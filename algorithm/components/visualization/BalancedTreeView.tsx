import { BalancedTreeAux } from '../../types/sort';
import { TreeNode, BTreeNode } from '../../types/graph';

interface BalancedTreeViewProps {
  data: BalancedTreeAux;
}

interface NodeInfo {
  x: number;
  y: number;
  color: string;
  value: number;
  stroke?: string;
  strokeWidth?: number;
}

interface BTreeNodeInfo {
  x: number;
  y: number;
  width: number;
  height: number;
  keys: number[];
  color: string;
}

interface EdgeInfo {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// --- Red-Black Tree helpers ---

function getRBNodeColor(node: TreeNode): string {
  return node.color === 'red' ? '#dc2626' : '#1e293b';
}

function collectRBNodes(
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
    color: getRBNodeColor(node),
    stroke: '#ffffff',
    strokeWidth: 2,
  });

  if (node.left) {
    const childX = x - spread / 2;
    const childY = y + 60;
    edges.push({ x1: x, y1: y, x2: childX, y2: childY });
    collectRBNodes(node.left, childX, childY, spread / 2, nodes, edges, depth);
  }

  if (node.right) {
    const childX = x + spread / 2;
    const childY = y + 60;
    edges.push({ x1: x, y1: y, x2: childX, y2: childY });
    collectRBNodes(node.right, childX, childY, spread / 2, nodes, edges, depth);
  }
}

// --- B-Tree / 2-3-4 Tree helpers ---

function getBTreeNodeColor(state?: BTreeNode['state']): string {
  switch (state) {
    case 'split': return '#ef4444';
    case 'current': return '#06b6d4';
    case 'compare': return '#f59e0b';
    case 'found': return '#22c55e';
    default: return '#334155';
  }
}

function calcBTreeWidth(node: BTreeNode): number {
  const selfWidth = node.keys.length * 30 + 10;
  if (!node.children || node.children.length === 0) return selfWidth;

  let childrenWidth = 0;
  for (const child of node.children) {
    childrenWidth += calcBTreeWidth(child);
  }
  childrenWidth += (node.children.length - 1) * 20;

  return Math.max(selfWidth, childrenWidth);
}

function collectBTreeNodes(
  node: BTreeNode,
  x: number,
  y: number,
  btreeNodes: BTreeNodeInfo[],
  edges: EdgeInfo[],
  depth: { max: number },
): void {
  const level = Math.round((y - 25) / 60);
  if (level > depth.max) depth.max = level;

  const nodeWidth = node.keys.length * 30 + 10;
  const nodeHeight = 30;

  btreeNodes.push({
    x,
    y,
    width: nodeWidth,
    height: nodeHeight,
    keys: node.keys,
    color: getBTreeNodeColor(node.state),
  });

  if (!node.children || node.children.length === 0) return;

  const childWidths = node.children.map(c => calcBTreeWidth(c));
  const totalChildrenWidth = childWidths.reduce((s, w) => s + w, 0) + (node.children.length - 1) * 20;
  let childX = x - totalChildrenWidth / 2;
  const childY = y + 60;

  for (let i = 0; i < node.children.length; i++) {
    const cw = childWidths[i];
    const cx = childX + cw / 2;

    edges.push({ x1: x, y1: y + nodeHeight / 2, x2: cx, y2: childY - nodeHeight / 2 });
    collectBTreeNodes(node.children[i], cx, childY, btreeNodes, edges, depth);

    childX += cw + 20;
  }
}

// --- Title helper ---

function getTitle(treeType: BalancedTreeAux['treeType']): string {
  switch (treeType) {
    case '234': return '2-3-4 트리';
    case 'red-black': return '레드-블랙 트리';
    case 'b-tree': return 'B-트리';
  }
}

// --- Component ---

export function BalancedTreeView({ data }: BalancedTreeViewProps) {
  if (!data.root) return null;

  const title = getTitle(data.treeType);

  if (data.treeType === 'red-black') {
    const root = data.root as TreeNode;
    const nodes: NodeInfo[] = [];
    const edges: EdgeInfo[] = [];
    const depth = { max: 0 };

    collectRBNodes(root, 300, 35, 250, nodes, edges, depth);
    const height = (depth.max + 1) * 60 + 20;

    return (
      <div className="bg-slate-800/50 rounded-lg p-2">
        <p className="text-xs text-slate-400 mb-1 px-2">{title}</p>
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
              <circle
                cx={n.x}
                cy={n.y}
                r={18}
                fill={n.color}
                opacity={0.9}
                stroke={n.stroke}
                strokeWidth={n.strokeWidth}
              />
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

  // 2-3-4 tree or B-tree (BTreeNode)
  const root = data.root as BTreeNode;
  const btreeNodes: BTreeNodeInfo[] = [];
  const edges: EdgeInfo[] = [];
  const depth = { max: 0 };

  collectBTreeNodes(root, 300, 25, btreeNodes, edges, depth);
  const height = (depth.max + 1) * 60 + 20;

  return (
    <div className="bg-slate-800/50 rounded-lg p-2">
      <p className="text-xs text-slate-400 mb-1 px-2">{title}</p>
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
        {btreeNodes.map((n, idx) => (
          <g key={idx}>
            <rect
              x={n.x - n.width / 2}
              y={n.y - n.height / 2}
              width={n.width}
              height={n.height}
              rx={4}
              ry={4}
              fill={n.color}
              opacity={0.9}
            />
            {n.keys.map((key, ki) => {
              const cellWidth = 30;
              const startX = n.x - n.width / 2 + 5;
              const kx = startX + ki * cellWidth + cellWidth / 2;
              return (
                <g key={ki}>
                  {ki > 0 && (
                    <line
                      x1={startX + ki * cellWidth}
                      y1={n.y - n.height / 2 + 3}
                      x2={startX + ki * cellWidth}
                      y2={n.y + n.height / 2 - 3}
                      stroke="#94a3b8"
                      strokeWidth="1"
                    />
                  )}
                  <text
                    x={kx}
                    y={n.y + 4}
                    textAnchor="middle"
                    fontSize="11"
                    fill="white"
                    fontWeight="bold"
                  >
                    {key}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}
