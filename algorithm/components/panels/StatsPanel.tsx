import { SortStep } from '../../types/sort';
import { highlightColors, highlightLabels } from '../../utils/colors';
import { HighlightType } from '../../types/sort';

interface StatsPanelProps {
  step: SortStep;
}

export function StatsPanel({ step }: StatsPanelProps) {
  const usedTypes = new Set(step.highlights.map(h => h.type));

  return (
    <div className="bg-slate-800/50 rounded-lg p-3">
      <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">통계</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-slate-700/50 rounded p-2">
          <span className="text-slate-400 text-xs">비교</span>
          <p className="text-xl font-bold text-amber-400">{step.stats.comparisons}</p>
        </div>
        <div className="bg-slate-700/50 rounded p-2">
          <span className="text-slate-400 text-xs">교환/이동</span>
          <p className="text-xl font-bold text-red-400">{step.stats.swaps}</p>
        </div>
      </div>

      {usedTypes.size > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {([...usedTypes] as HighlightType[]).map(type => (
            <span
              key={type}
              className="inline-flex items-center gap-1 text-[10px] text-slate-300"
            >
              <span
                className="w-2.5 h-2.5 rounded-sm inline-block"
                style={{ backgroundColor: highlightColors[type] }}
              />
              {highlightLabels[type]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
