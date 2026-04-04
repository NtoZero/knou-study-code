import { useState } from 'react';

interface SearchInputProps {
  arrayText: string;
  onArrayChange: (text: string) => void;
  searchKey: number;
  onSearchKeyChange: (key: number) => void;
  onApply: () => void;
  onRandomize: () => void;
  disabled?: boolean;
}

export function SearchInput({
  arrayText, onArrayChange, searchKey, onSearchKeyChange,
  onApply, onRandomize, disabled,
}: SearchInputProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={arrayText}
        onChange={e => onArrayChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onApply()}
        placeholder="배열 (예: 5, 3, 8, 1, 9)"
        className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200 w-40 focus:outline-none focus:border-blue-500"
        disabled={disabled}
      />
      <div className="flex items-center gap-1">
        <span className="text-xs text-slate-400">키:</span>
        <input
          type="number"
          value={searchKey}
          onChange={e => onSearchKeyChange(Number(e.target.value))}
          className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200 w-16 focus:outline-none focus:border-blue-500"
          disabled={disabled}
        />
      </div>
      <button
        onClick={onApply}
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
