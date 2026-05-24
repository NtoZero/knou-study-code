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
        className="w-40 rounded-lg border border-cyan-300/30 bg-[#081827] px-2 py-1 text-sm font-medium text-cyan-50 placeholder-cyan-100/45 focus:border-cyan-300 focus:outline-none"
        disabled={disabled}
      />
      <div className="flex items-center gap-1">
        <span className="text-xs font-bold text-cyan-100">키:</span>
        <input
          type="number"
          value={searchKey}
          onChange={e => onSearchKeyChange(Number(e.target.value))}
          className="w-16 rounded-lg border border-cyan-300/30 bg-[#081827] px-2 py-1 text-sm font-medium text-cyan-50 focus:border-cyan-300 focus:outline-none"
          disabled={disabled}
        />
      </div>
      <button
        onClick={onApply}
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
