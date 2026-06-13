"use client";

import type { ReactNode } from "react";

export type PastExamChipTone = "amber" | "cyan" | "emerald" | "indigo";

const toneStyles: Record<
  PastExamChipTone,
  {
    active: string;
    inactive: string;
    group: string;
  }
> = {
  amber: {
    active: "bg-amber-700 text-white ring-amber-700",
    inactive:
      "bg-gray-100 text-gray-700 ring-gray-200 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:ring-gray-800 dark:hover:bg-gray-800",
    group: "text-amber-900 dark:text-amber-100",
  },
  cyan: {
    active: "bg-cyan-700 text-white ring-cyan-700",
    inactive:
      "bg-gray-100 text-gray-700 ring-gray-200 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:ring-gray-800 dark:hover:bg-gray-800",
    group: "text-cyan-900 dark:text-cyan-100",
  },
  emerald: {
    active: "bg-emerald-700 text-white ring-emerald-700",
    inactive:
      "bg-gray-100 text-gray-700 ring-gray-200 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:ring-gray-800 dark:hover:bg-gray-800",
    group: "text-emerald-900 dark:text-emerald-100",
  },
  indigo: {
    active: "bg-indigo-700 text-white ring-indigo-700",
    inactive:
      "bg-gray-100 text-gray-700 ring-gray-200 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:ring-gray-800 dark:hover:bg-gray-800",
    group: "text-indigo-900 dark:text-indigo-100",
  },
};

type MultiSelectChipsProps<T extends number | string> = {
  label: string;
  options: readonly T[];
  selected: readonly T[];
  tone: PastExamChipTone;
  allLabel?: string;
  getLabel: (option: T) => ReactNode;
  onChange: (selected: T[]) => void;
};

export function MultiSelectChips<T extends number | string>({
  label,
  options,
  selected,
  tone,
  allLabel = "전체",
  getLabel,
  onChange,
}: MultiSelectChipsProps<T>) {
  const styles = toneStyles[tone];
  const allSelected = options.length > 0 && selected.length === options.length;

  function toggle(option: T) {
    const selectedSet = new Set(selected);
    if (selectedSet.has(option)) {
      selectedSet.delete(option);
    } else {
      selectedSet.add(option);
    }

    const next = options.filter((item) => selectedSet.has(item));
    onChange(next.length > 0 ? next : [...options]);
  }

  return (
    <fieldset className="min-w-0">
      <legend className={`mb-1.5 text-xs font-black ${styles.group}`}>{label}</legend>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange([...options])}
          className={`rounded-lg px-3 py-2 text-sm font-black ring-1 transition-colors ${
            allSelected ? styles.active : styles.inactive
          }`}
        >
          {allLabel}
        </button>
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={String(option)}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(option)}
              className={`rounded-lg px-3 py-2 text-sm font-black ring-1 transition-colors ${
                active ? styles.active : styles.inactive
              }`}
            >
              {getLabel(option)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

type SingleSelectChipsProps<T extends number | string> = {
  label: string;
  options: readonly { value: T; label: ReactNode }[];
  value: T;
  tone: PastExamChipTone;
  onChange: (value: T) => void;
};

export function SingleSelectChips<T extends number | string>({
  label,
  options,
  value,
  tone,
  onChange,
}: SingleSelectChipsProps<T>) {
  const styles = toneStyles[tone];

  return (
    <fieldset className="min-w-0">
      <legend className={`mb-1.5 text-xs font-black ${styles.group}`}>{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={String(option.value)}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={`rounded-lg px-3 py-2 text-sm font-black ring-1 transition-colors ${
                active ? styles.active : styles.inactive
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

