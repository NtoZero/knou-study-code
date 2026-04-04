interface PseudocodePanelProps {
  pseudocode: string[];
  currentLine: number;
}

export function PseudocodePanel({ pseudocode, currentLine }: PseudocodePanelProps) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3 overflow-y-auto">
      <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Pseudocode</h4>
      <pre className="text-xs font-mono leading-relaxed">
        {pseudocode.map((line, i) => {
          const isActive = i === currentLine;
          return (
            <div
              key={i}
              className={`flex transition-colors ${
                isActive
                  ? 'bg-blue-600/30 text-blue-200'
                  : 'text-slate-400'
              }`}
            >
              <span className="w-5 text-right shrink-0 select-none mr-1 text-slate-600">
                {isActive ? (
                  <span className="text-blue-400">▶</span>
                ) : (
                  <span>{i + 1}</span>
                )}
              </span>
              <span className="px-1 py-0.5">{line || '\u00A0'}</span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}
