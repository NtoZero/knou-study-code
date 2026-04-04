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
        className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200 w-48 focus:outline-none focus:border-blue-500"
        disabled={disabled}
      />
      <button
        onClick={handleApply}
        className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs"
        disabled={disabled}
      >
        적용
      </button>
      <button
        onClick={onRandomize}
        className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs"
        disabled={disabled}
      >
        랜덤
      </button>
    </div>
  );
}
