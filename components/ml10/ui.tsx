/** 10강 컴포넌트가 함께 쓰는 작은 표시 요소 */

export const ACCENT = "text-sky-600";
export const ACCENT_BG = "bg-sky-600";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 text-sm font-bold text-gray-800 dark:text-gray-100">{children}</h3>;
}

/** 수식 상자 — 유니코드 수식을 가운데 정렬로 */
export function Formula({
  children,
  note,
  className = "",
}: {
  children: React.ReactNode;
  note?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-x-auto rounded-lg border border-sky-100 bg-sky-50/60 px-3 py-2.5 text-center dark:border-sky-900/60 dark:bg-sky-950/30 ${className}`}
    >
      <div className="whitespace-nowrap text-[13px] font-semibold text-sky-900 dark:text-sky-100">
        {children}
      </div>
      {note && <div className="mt-1 text-[11px] font-normal text-sky-700/80 dark:text-sky-300/80">{note}</div>}
    </div>
  );
}

/** 보조 설명 */
export function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] leading-5 text-gray-500 dark:text-gray-400">{children}</p>
  );
}

/** 원자료에 수치가 없어 이 페이지에서 직접 계산했다는 표시 */
export function ComputedNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] leading-5 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
      {children}
    </p>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-[11px] font-semibold text-gray-600 dark:text-gray-300">
        <span>{label}</span>
        <span className="font-mono text-sky-600 dark:text-sky-400">{display ?? value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-sky-600"
      />
    </label>
  );
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
        active
          ? "border-sky-600 bg-sky-600 text-white"
          : "border-gray-200 bg-white text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

/** 가로로 넘칠 수 있는 표·그림을 감싼다 */
export function Scroller({ children }: { children: React.ReactNode }) {
  return <div className="-mx-1 overflow-x-auto px-1 pb-1">{children}</div>;
}
