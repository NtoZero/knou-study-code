/** 12강 컴포넌트가 함께 쓰는 작은 표시 요소 */

export const ACCENT = "text-red-500";
export const ACCENT_BG = "bg-red-500";

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
      className={`overflow-x-auto rounded-lg border border-red-100 bg-red-50/60 px-3 py-2.5 text-center dark:border-red-900/60 dark:bg-red-950/30 ${className}`}
    >
      <div className="whitespace-nowrap text-[13px] font-semibold text-red-900 dark:text-red-100">
        {children}
      </div>
      {note && (
        <div className="mt-1 text-[11px] font-normal text-red-700/80 dark:text-red-300/80">
          {note}
        </div>
      )}
    </div>
  );
}

/** 보조 설명 */
export function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] leading-5 text-gray-500 dark:text-gray-400">{children}</p>;
}

/** 원자료에 수치가 없어 이 페이지에서 직접 정하거나 계산했다는 표시 */
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
      <span className="mb-1 flex items-center justify-between gap-2 text-[11px] font-semibold text-gray-600 dark:text-gray-300">
        <span className="min-w-0">{label}</span>
        <span className="shrink-0 font-mono text-red-500">{display ?? value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-red-500"
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
          ? "border-red-500 bg-red-500 text-white"
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

/** 계산 한 줄 — 식과 결과값을 나란히 */
export function CalcRow({
  label,
  expr,
  value,
  tone = "default",
}: {
  label: React.ReactNode;
  expr: React.ReactNode;
  value: React.ReactNode;
  tone?: "default" | "accent";
}) {
  return (
    <div
      className={`flex flex-wrap items-baseline gap-x-2 gap-y-0.5 rounded-lg px-2.5 py-1.5 text-[11.5px] ${
        tone === "accent"
          ? "bg-red-50 dark:bg-red-950/30"
          : "bg-gray-50 dark:bg-gray-800/60"
      }`}
    >
      <span className="w-16 shrink-0 font-bold text-gray-700 dark:text-gray-200">{label}</span>
      <span className="min-w-0 flex-1 font-mono text-[11px] text-gray-500 dark:text-gray-400">
        {expr}
      </span>
      <span className="shrink-0 font-mono font-bold text-red-500">{value}</span>
    </div>
  );
}
