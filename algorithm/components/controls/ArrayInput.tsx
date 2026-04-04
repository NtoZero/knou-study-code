import { Shuffle, Check } from 'lucide-react';

interface ArrayInputProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onApply: () => boolean;
  onRandomize: () => void;
  disabled?: boolean;
}

export function ArrayInput({ inputText, onInputChange, onApply, onRandomize, disabled }: ArrayInputProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={inputText}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="예: 38, 27, 43, 3, 9, 82, 10"
        disabled={disabled}
        className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
        onKeyDown={(e) => {
          if (e.key === 'Enter') onApply();
        }}
      />
      <button
        onClick={onApply}
        disabled={disabled || !inputText.trim()}
        className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white"
        title="적용"
      >
        <Check size={16} />
      </button>
      <button
        onClick={onRandomize}
        disabled={disabled}
        className="p-1.5 rounded bg-slate-600 hover:bg-slate-500 disabled:opacity-30 text-white"
        title="랜덤 생성"
      >
        <Shuffle size={16} />
      </button>
    </div>
  );
}
