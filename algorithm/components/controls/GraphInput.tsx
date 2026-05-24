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
        className="rounded-lg border border-cyan-300/30 bg-[#081827] px-2 py-1 text-sm font-semibold text-cyan-50 focus:border-cyan-300 focus:outline-none"
        disabled={disabled}
      >
        {graphExamples.map((example, idx) => (
          <option key={idx} value={idx}>
            {example.name} — {example.description}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-1">
        <span className="text-xs font-bold text-cyan-100">시작 정점:</span>
        <input
          type="number"
          value={startVertex}
          onChange={e => onStartVertexChange(Number(e.target.value))}
          min={0}
          max={vertexCount - 1}
          className="w-16 rounded-lg border border-cyan-300/30 bg-[#081827] px-2 py-1 text-sm font-medium text-cyan-50 focus:border-cyan-300 focus:outline-none"
          disabled={disabled}
        />
      </div>

      <span className="rounded-full bg-cyan-300/15 px-2 py-1 text-xs font-bold text-cyan-100">
        V={vertexCount} E={edgeCount}
      </span>
    </div>
  );
}
