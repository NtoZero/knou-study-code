import { AlgorithmCategory } from '../../types/sort';

interface CategorySelectorProps {
  selected: AlgorithmCategory;
  onSelect: (category: AlgorithmCategory) => void;
}

const categories: { id: AlgorithmCategory; label: string }[] = [
  { id: 'sort', label: '정렬' },
  { id: 'search', label: '탐색' },
  { id: 'graph', label: '그래프' },
];

export function CategorySelector({ selected, onSelect }: CategorySelectorProps) {
  return (
    <div className="flex gap-1 rounded-xl border border-cyan-300/25 bg-[#081827] p-1">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
            selected === cat.id
              ? 'bg-cyan-300 text-slate-950'
              : 'text-cyan-100 hover:bg-cyan-300/15 hover:text-white'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
