interface PseudocodePanelProps {
  pseudocode: string[];
  currentLine: number;
}

export function PseudocodePanel({ pseudocode, currentLine }: PseudocodePanelProps) {
  return (
    <div className="overflow-y-auto rounded-2xl border border-cyan-300/20 bg-[#081827] p-3">
      <h4 className="mb-2 text-xs font-black uppercase tracking-wider text-cyan-200">Pseudocode</h4>
      <pre className="text-xs font-mono leading-relaxed">
        {pseudocode.map((line, i) => {
          const isActive = i === currentLine;
          return (
            <div
              key={i}
              className={`flex rounded-md transition-colors ${
                isActive
                  ? 'bg-cyan-300 text-slate-950'
                  : 'text-slate-200'
              }`}
            >
              <span className={`w-5 text-right shrink-0 select-none mr-1 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`}>
                {isActive ? (
                  <span>▶</span>
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
