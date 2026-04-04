import { SortStep, HeapAux } from '../../types/sort';
import { getBarColor, defaultColor } from '../../utils/colors';

interface HeapTreeProps {
  step: SortStep;
  heapAux: HeapAux;
}

export function HeapTree({ step, heapAux }: HeapTreeProps) {
  const { array, highlights } = step;
  const { heapSize } = heapAux;
  if (heapSize === 0) return null;

  const size = Math.min(heapSize, array.length);
  const depth = Math.floor(Math.log2(size)) + 1;
  const svgWidth = 600;
  const svgHeight = depth * 70 + 20;

  function getPos(i: number): { x: number; y: number } {
    const level = Math.floor(Math.log2(i + 1));
    const posInLevel = i - (Math.pow(2, level) - 1);
    const totalInLevel = Math.pow(2, level);
    const x = ((posInLevel + 0.5) / totalInLevel) * svgWidth;
    const y = level * 70 + 35;
    return { x, y };
  }

  const nodes: { i: number; x: number; y: number; color: string }[] = [];
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];

  for (let i = 0; i < size; i++) {
    const pos = getPos(i);
    const color = getBarColor(i, highlights);
    nodes.push({ i, ...pos, color });

    if (i > 0) {
      const parentPos = getPos(Math.floor((i - 1) / 2));
      edges.push({ x1: parentPos.x, y1: parentPos.y, x2: pos.x, y2: pos.y });
    }
  }

  return (
    <div className="bg-slate-800/50 rounded-lg p-2">
      <p className="text-xs text-slate-400 mb-1 px-2">힙 트리 (크기: {heapSize})</p>
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full" style={{ maxHeight: 200 }}>
        {edges.map((e, idx) => (
          <line key={idx} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="#475569" strokeWidth="1.5" />
        ))}
        {nodes.map(({ i, x, y, color }) => (
          <g key={i}>
            <circle cx={x} cy={y} r={18} fill={color} opacity={0.9} />
            <text x={x} y={y + 5} textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">
              {array[i]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
