import { GraphAux } from '../../types/sort';

interface DistanceMatrixProps {
  data: GraphAux;
}

export function DistanceMatrix({ data }: DistanceMatrixProps) {
  const { distMatrix, vertices } = data;

  if (!distMatrix || distMatrix.length === 0) return null;

  const n = distMatrix.length;
  const labels = vertices.map(v => v.label ?? String(v.id));

  // Determine current k vertex (the one in 'visiting' or 'current' state)
  const currentK = vertices.findIndex(
    v => v.state === 'visiting' || v.state === 'visited',
  );

  // Detect recently updated cells by comparing with previous values
  // We highlight cells that have finite values and are not on the diagonal
  // For simplicity, highlight cells where the vertex state indicates activity
  const highlightedCells = new Set<string>();

  // Check highlights from vertex states to determine recently updated rows/cols
  vertices.forEach((v, _i) => {
    if (v.state === 'visiting') {
      // Highlight the row/column for the current k
      for (let j = 0; j < n; j++) {
        highlightedCells.add(`${v.id}-${j}`);
        highlightedCells.add(`${j}-${v.id}`);
      }
    }
  });

  return (
    <div className="bg-slate-800/50 rounded-lg p-3">
      <p className="text-xs text-slate-400 mb-2 px-1">
        거리 행렬 D
        {currentK >= 0 && (
          <span className="text-yellow-400 ml-2">
            (k = {labels[currentK]})
          </span>
        )}
      </p>
      <div className="overflow-x-auto">
        <table
          className="text-xs font-mono"
          style={{ borderCollapse: 'collapse' }}
        >
          <thead>
            <tr>
              <th className="px-2 py-1 text-slate-500 border border-slate-700" />
              {labels.map((label, j) => (
                <th
                  key={j}
                  className={`px-2 py-1 border border-slate-700 text-center ${
                    currentK === j
                      ? 'bg-yellow-500/30 text-yellow-300'
                      : 'text-slate-400'
                  }`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {distMatrix.map((row, i) => (
              <tr key={i}>
                <td
                  className={`px-2 py-1 border border-slate-700 text-center font-bold ${
                    currentK === i
                      ? 'bg-yellow-500/30 text-yellow-300'
                      : 'text-slate-400'
                  }`}
                >
                  {labels[i]}
                </td>
                {row.map((val, j) => {
                  const isDiagonal = i === j;
                  const isHighlighted = highlightedCells.has(`${i}-${j}`);

                  let bgClass = 'bg-slate-800';
                  if (isDiagonal) {
                    bgClass = 'bg-slate-700';
                  } else if (isHighlighted) {
                    bgClass = 'bg-amber-500/20';
                  }

                  return (
                    <td
                      key={j}
                      className={`px-2 py-1 border border-slate-700 text-center text-slate-200 ${bgClass}`}
                    >
                      {val === null ? '\u221e' : val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
