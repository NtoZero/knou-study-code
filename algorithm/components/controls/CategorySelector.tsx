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
    <div className="flex gap-1 bg-slate-800 rounded-lg p-0.5">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-3 py-1 text-xs rounded-md transition-colors ${
            selected === cat.id
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
