"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { BookOpen, Presentation, Megaphone, Filter, RotateCcw } from "lucide-react";
import {
  kindsOf,
  sourceMeta,
  sourceOrder,
  type SourceKind,
  type SourceRef,
} from "@/lib/mlSources";

const icons: Record<SourceKind, typeof BookOpen> = {
  textbook: BookOpen,
  slides: Presentation,
  lecture: Megaphone,
};

interface Ctx {
  active: Set<SourceKind>;
  toggle: (k: SourceKind) => void;
  reset: () => void;
  register: (id: string, kinds: SourceKind[]) => () => void;
  registry: Record<string, SourceKind[]>;
}

const SourceFilterContext = createContext<Ctx | null>(null);

/** 강의 페이지 전체를 감싸 출처 필터 상태를 공유한다. */
export function SourceFilterProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<Set<SourceKind>>(() => new Set(sourceOrder));
  const [registry, setRegistry] = useState<Record<string, SourceKind[]>>({});

  const toggle = useCallback((k: SourceKind) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }, []);

  const reset = useCallback(() => setActive(new Set(sourceOrder)), []);

  const register = useCallback((id: string, kinds: SourceKind[]) => {
    setRegistry((prev) => ({ ...prev, [id]: kinds }));
    return () =>
      setRegistry((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
  }, []);

  const value = useMemo(
    () => ({ active, toggle, reset, register, registry }),
    [active, toggle, reset, register, registry],
  );

  return <SourceFilterContext.Provider value={value}>{children}</SourceFilterContext.Provider>;
}

function useSourceFilter() {
  return useContext(SourceFilterContext);
}

/** 선택된 칩 가운데 하나라도 겹치면 보인다. 필터가 없는 페이지에서는 항상 보인다. */
export function useSourceVisible(kinds: SourceKind[]) {
  const ctx = useSourceFilter();
  if (!ctx || kinds.length === 0) return true;
  return kinds.some((k) => ctx.active.has(k));
}

export function SourceBadges({
  refs,
  className = "",
}: {
  refs: SourceRef;
  className?: string;
}) {
  const kinds = kindsOf(refs);
  if (kinds.length === 0) return null;
  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      {kinds.map((k) => {
        const Icon = icons[k];
        const detail = refs[k];
        return (
          <span
            key={k}
            title={detail}
            className={`inline-flex max-w-full items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${sourceMeta[k].tone}`}
          >
            <Icon size={10} className="shrink-0" />
            <span className="shrink-0">{sourceMeta[k].label}</span>
            {detail && (
              <span className="min-w-0 truncate font-normal opacity-80">· {detail}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

/**
 * 출처가 표시되는 학습 블록. 헤더의 출처 칩으로 걸러진다.
 * `refs`에 채운 항목이 곧 배지가 된다.
 */
export function Sourced({
  refs,
  children,
  className = "",
  badgeClassName = "mb-2",
}: {
  refs: SourceRef;
  children: React.ReactNode;
  className?: string;
  badgeClassName?: string;
}) {
  const ctx = useSourceFilter();
  const id = useId();
  const kinds = kindsOf(refs);
  const key = kinds.join(",");
  const register = ctx?.register;

  useEffect(() => {
    if (!register) return;
    return register(id, key ? (key.split(",") as SourceKind[]) : []);
  }, [register, id, key]);

  const visible = useSourceVisible(kinds);
  if (!visible) return null;

  return (
    <div className={className} data-sources={key}>
      <SourceBadges refs={refs} className={badgeClassName} />
      {children}
    </div>
  );
}

/** 강의 헤더에 붙는 다중 선택 출처 칩 */
export function SourceFilterBar({ accentText }: { accentText: string }) {
  const ctx = useSourceFilter();
  if (!ctx) return null;
  const { active, toggle, reset, registry } = ctx;
  const entries = Object.values(registry);
  const total = entries.length;
  const shown = entries.filter((ks) => ks.length === 0 || ks.some((k) => active.has(k))).length;
  const counts = Object.fromEntries(
    sourceOrder.map((k) => [k, entries.filter((ks) => ks.includes(k)).length]),
  ) as Record<SourceKind, number>;
  const allOn = active.size === sourceOrder.length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
        <Filter size={11} className={accentText} />
        출처
      </span>
      {sourceOrder.map((k) => {
        const on = active.has(k);
        const Icon = icons[k];
        return (
          <button
            key={k}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(k)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              on
                ? sourceMeta[k].activeTone
                : "border-gray-200 bg-white text-gray-400 hover:text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500"
            }`}
          >
            <Icon size={12} />
            {sourceMeta[k].label}
            <span
              className={`rounded-full px-1.5 text-[10px] ${
                on ? "bg-white/25" : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              {counts[k]}
            </span>
          </button>
        );
      })}
      {!allOn && (
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <RotateCcw size={11} />
          전체
        </button>
      )}
      <span className="ml-auto text-[11px] text-gray-400">
        {shown} / {total} 항목 표시
      </span>
    </div>
  );
}
