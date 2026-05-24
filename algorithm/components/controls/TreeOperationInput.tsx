import { useState } from 'react';

interface TreeOperationInputProps {
  initialValues: number[];
  onInitialValuesChange: (values: number[]) => void;
  onApply: () => void;
  onRandomize: () => void;
  disabled?: boolean;
}

export function TreeOperationInput({
  initialValues, onInitialValuesChange, onApply, onRandomize, disabled,
}: TreeOperationInputProps) {
  const [text, setText] = useState(initialValues.join(', '));

  const handleApply = () => {
    const parsed = text.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
    if (parsed.length > 0) {
      onInitialValuesChange(parsed);
      onApply();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleApply()}
        placeholder="삽입할 값 (예: 50, 30, 70, 20)"
        className="w-48 rounded-lg border border-cyan-300/30 bg-[#081827] px-2 py-1 text-sm font-medium text-cyan-50 placeholder-cyan-100/45 focus:border-cyan-300 focus:outline-none"
        disabled={disabled}
      />
      <button
        onClick={handleApply}
        className="rounded-lg bg-emerald-300 px-2 py-1 text-xs font-bold text-slate-950 hover:bg-emerald-200"
        disabled={disabled}
      >
        적용
      </button>
      <button
        onClick={onRandomize}
        className="rounded-lg bg-cyan-300/20 px-2 py-1 text-xs font-bold text-cyan-50 hover:bg-cyan-300/30"
        disabled={disabled}
      >
        랜덤
      </button>
    </div>
  );
}
