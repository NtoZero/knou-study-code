import { GraphAux } from '../../types/sort';
import { graphNodeColors, graphEdgeColors } from '../../utils/colors';

interface GraphViewProps {
  data: GraphAux;
}

type NodeState = keyof typeof graphNodeColors;
type EdgeState = keyof typeof graphEdgeColors;

export function GraphView({ data }: GraphViewProps) {
  const { vertices, edges, distances, mstEdges, queue, stack, order, orderLabel, sets, setsLabel } = data;

  if (vertices.length === 0) return null;

  // Compute bounding box with padding
  const padding = 60;
  const minX = Math.min(...vertices.map(v => v.x)) - padding;
  const minY = Math.min(...vertices.map(v => v.y)) - padding;
  const maxX = Math.max(...vertices.map(v => v.x)) + padding;
  const maxY = Math.max(...vertices.map(v => v.y)) + padding;
  const width = maxX - minX;
  const height = maxY - minY;

  const nodeRadius = 22;

  // Check if any edge is directed
  const hasDirected = edges.some(e => e.directed);

  function getNodeColor(v: (typeof vertices)[0]): string {
    const state = (v.state ?? 'unvisited') as NodeState;
    return graphNodeColors[state] ?? graphNodeColors.unvisited;
  }

  function getEdgeColor(e: (typeof edges)[0], idx: number): string {
    if (mstEdges && mstEdges.includes(idx)) {
      return graphEdgeColors.mst;
    }
    const state = (e.state ?? 'default') as EdgeState;
    return graphEdgeColors[state] ?? graphEdgeColors.default;
  }

  function getEdgeWidth(e: (typeof edges)[0], idx: number): number {
    if (mstEdges && mstEdges.includes(idx)) return 3;
    if (e.state === 'tree-edge' || e.state === 'mst') return 3;
    return 1.5;
  }

  // Shorten line endpoint so arrow doesn't overlap circle
  function shortenLine(
    x1: number, y1: number, x2: number, y2: number, r: number,
  ): { x: number; y: number } {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return { x: x2, y: y2 };
    return {
      x: x2 - (dx / len) * r,
      y: y2 - (dy / len) * r,
    };
  }

  // Compute perpendicular offset for label placement
  function perpOffset(
    x1: number, y1: number, x2: number, y2: number, offset: number,
  ): { x: number; y: number } {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return { x: mx, y: my };
    return {
      x: mx + (-dy / len) * offset,
      y: my + (dx / len) * offset,
    };
  }

  const edgeStates: EdgeState[] = ['active', 'tree-edge', 'mst', 'relaxed', 'augmenting', 'back'];

  return (
    <div className="bg-slate-800/50 rounded-lg p-2">
      <p className="text-xs text-slate-400 mb-1 px-2">그래프</p>
      <svg
        viewBox={`${minX} ${minY} ${width} ${height}`}
        className="w-full"
        style={{ maxHeight: 320 }}
      >
        <defs>
          <marker
            id="arrowhead-default"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={graphEdgeColors.default} />
          </marker>
          {edgeStates.map(state => (
            <marker
              key={state}
              id={`arrowhead-${state}`}
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill={graphEdgeColors[state]} />
            </marker>
          ))}
        </defs>

        {/* Edges */}
        {edges.map((edge, idx) => {
          const fromV = vertices.find(v => v.id === edge.from);
          const toV = vertices.find(v => v.id === edge.to);
          if (!fromV || !toV) return null;

          const color = getEdgeColor(edge, idx);
          const strokeWidth = getEdgeWidth(edge, idx);
          const isDirected = edge.directed || hasDirected;

          let x2 = toV.x;
          let y2 = toV.y;
          if (isDirected) {
            const shortened = shortenLine(fromV.x, fromV.y, toV.x, toV.y, nodeRadius);
            x2 = shortened.x;
            y2 = shortened.y;
          }

          const edgeState = (mstEdges && mstEdges.includes(idx))
            ? 'mst'
            : (edge.state ?? 'default') as EdgeState;
          const markerId = edgeStates.includes(edgeState as EdgeState)
            ? `arrowhead-${edgeState}`
            : 'arrowhead-default';

          const labelPos = perpOffset(fromV.x, fromV.y, toV.x, toV.y, -12);

          return (
            <g key={`edge-${idx}`}>
              <line
                x1={fromV.x}
                y1={fromV.y}
                x2={x2}
                y2={y2}
                stroke={color}
                strokeWidth={strokeWidth}
                markerEnd={isDirected ? `url(#${markerId})` : undefined}
              />
              {/* Weight label */}
              {edge.weight !== undefined && edge.capacity === undefined && (
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#e2e8f0"
                  fontWeight="bold"
                >
                  {edge.weight}
                </text>
              )}
              {/* Flow/capacity label */}
              {edge.capacity !== undefined && (
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#e2e8f0"
                  fontWeight="bold"
                >
                  {edge.flow ?? 0}/{edge.capacity}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {vertices.map(v => {
          const color = getNodeColor(v);
          const label = v.label ?? String(v.id);

          return (
            <g key={`node-${v.id}`}>
              <circle
                cx={v.x}
                cy={v.y}
                r={nodeRadius}
                fill={color}
                opacity={0.9}
              />
              <text
                x={v.x}
                y={v.y + 5}
                textAnchor="middle"
                fontSize="13"
                fill="white"
                fontWeight="bold"
              >
                {label}
              </text>
              {/* Distance label above vertex */}
              {distances && distances[v.id] !== undefined && (
                <text
                  x={v.x}
                  y={v.y - nodeRadius - 6}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#fbbf24"
                  fontWeight="bold"
                >
                  {distances[v.id] === null ? '\u221e' : `d=${distances[v.id]}`}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Additional info displays */}
      <div className="px-2 mt-1 space-y-0.5">
        {queue && queue.length > 0 && (
          <p className="text-xs text-slate-300">
            <span className="text-yellow-400">큐:</span> [{queue.map(q => {
              const v = vertices.find(v => v.id === q);
              return v?.label ?? String(q);
            }).join(', ')}]
          </p>
        )}
        {stack && stack.length > 0 && (
          <p className="text-xs text-slate-300">
            <span className="text-orange-400">스택:</span> [{stack.map(s => {
              const v = vertices.find(v => v.id === s);
              return v?.label ?? String(s);
            }).join(', ')}]
          </p>
        )}
        {order && order.length > 0 && (
          <p className="text-xs text-slate-300">
            <span className="text-emerald-400">{orderLabel ?? '방문 순서'}:</span> [{order.map(o => {
              const v = vertices.find(v => v.id === o);
              return v?.label ?? String(o);
            }).join(', ')}]
          </p>
        )}
        {sets && sets.length > 0 && (
          <p className="text-xs text-slate-300">
            <span className="text-blue-400">{setsLabel ?? '연결 성분'}:</span>{' '}
            {sets.map((set, i) => (
              <span key={i}>
                {'{'}
                {set.map(s => {
                  const v = vertices.find(v => v.id === s);
                  return v?.label ?? String(s);
                }).join(',')}
                {'}'}
                {i < sets.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
