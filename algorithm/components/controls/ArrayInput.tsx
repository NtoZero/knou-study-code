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
        className="flex-1 rounded-lg border border-cyan-300/30 bg-[#081827] px-3 py-1.5 text-sm font-medium text-cyan-50 placeholder-cyan-100/45 focus:border-cyan-300 focus:outline-none disabled:opacity-50"
        onKeyDown={(e) => {
          if (e.key === 'Enter') onApply();
        }}
      />
      <button
        onClick={onApply}
        disabled={disabled || !inputText.trim()}
        className="rounded-lg bg-emerald-300 p-1.5 text-slate-950 hover:bg-emerald-200 disabled:opacity-30"
        title="적용"
      >
        <Check size={16} />
      </button>
      <button
        onClick={onRandomize}
        disabled={disabled}
        className="rounded-lg bg-cyan-300/20 p-1.5 text-cyan-50 hover:bg-cyan-300/30 disabled:opacity-30"
        title="랜덤 생성"
      >
        <Shuffle size={16} />
      </button>
    </div>
  );
}
