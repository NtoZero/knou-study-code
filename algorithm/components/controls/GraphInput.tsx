import { graphExamples } from '../../data/graph-examples';

interface GraphInputProps {
  graphIndex: number;
  onGraphIndexChange: (index: number) => void;
  startVertex: number;
  onStartVertexChange: (v: number) => void;
  disabled?: boolean;
}

export function GraphInput({
  graphIndex,
  onGraphIndexChange,
  startVertex,
  onStartVertexChange,
  disabled,
}: GraphInputProps) {
  const selectedGraph = graphExamples[graphIndex];
  const vertexCount = selectedGraph?.input.vertices.length ?? 0;
  const edgeCount = selectedGraph?.input.edges.length ?? 0;

  return (
    <div className="flex items-center gap-2">
      <select
        value={graphIndex}
        onChange={e => onGraphIndexChange(Number(e.target.value))}
        className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
        disabled={disabled}
      >
        {graphExamples.map((example, idx) => (
          <option key={idx} value={idx}>
            {example.name} — {example.description}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-1">
        <span className="text-xs text-slate-400">시작 정점:</span>
        <input
          type="number"
          value={startVertex}
          onChange={e => onStartVertexChange(Number(e.target.value))}
          min={0}
          max={vertexCount - 1}
          className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200 w-16 focus:outline-none focus:border-blue-500"
          disabled={disabled}
        />
      </div>

      <span className="text-xs text-slate-500">
        V={vertexCount} E={edgeCount}
      </span>
    </div>
  );
}
