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
          className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
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
          className={`px-3 py-1.5 text-xs rounded ${
            compareMode ? 'bg-violet-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
          }`}
        >
          비교
        </button>
      </div>

      {compareMode && (
        <select
          value={compareId}
          onChange={(e) => onCompareSelect?.(e.target.value)}
          className="w-full bg-slate-800 border border-violet-500/50 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
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
