import { algorithms, algorithmGroups } from '../../algorithms';

interface AlgorithmSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
  compareMode?: boolean;
  compareId?: string;
  onCompareSelect?: (id: string) => void;
  onToggleCompare?: () => void;
}

export function AlgorithmSelector({
  selected, onSelect, compareMode, compareId, onCompareSelect, onToggleCompare,
}: AlgorithmSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <select
          value={selected}
          onChange={(e) => onSelect(e.target.value)}
          className="flex-1 rounded-lg border border-cyan-300/30 bg-[#081827] px-3 py-1.5 text-sm font-semibold text-cyan-50 focus:border-cyan-300 focus:outline-none"
        >
          {algorithmGroups.map(group => (
            <optgroup key={group.label} label={group.label}>
              {group.ids.map(id => (
                <option key={id} value={id}>{algorithms[id].meta.name}</option>
              ))}
            </optgroup>
          ))}
        </select>

        <button
          onClick={onToggleCompare}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
            compareMode ? 'bg-fuchsia-400 text-slate-950' : 'bg-cyan-300/15 text-cyan-100 hover:bg-cyan-300/25'
          }`}
        >
          비교
        </button>
      </div>

      {compareMode && (
        <select
          value={compareId}
          onChange={(e) => onCompareSelect?.(e.target.value)}
          className="w-full rounded-lg border border-fuchsia-300/50 bg-[#081827] px-3 py-1.5 text-sm font-semibold text-fuchsia-50 focus:border-fuchsia-300 focus:outline-none"
        >
          {algorithmGroups.map(group => (
            <optgroup key={group.label} label={group.label}>
              {group.ids.filter(id => id !== selected).map(id => (
                <option key={id} value={id}>{algorithms[id].meta.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      )}
    </div>
  );
}
