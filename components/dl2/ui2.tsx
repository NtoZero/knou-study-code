/** 2강 전용 표시 요소 — 공용 ui.tsx와 같은 모양이되 강조색만 indigo로 맞춘다. */

/** 수식 상자 */
export function F({
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
      className={`overflow-x-auto rounded-lg border border-indigo-100 bg-indigo-50/60 px-3 py-2.5 text-center dark:border-indigo-900/60 dark:bg-indigo-950/30 ${className}`}
    >
      <div className="whitespace-nowrap text-[13px] font-semibold text-indigo-900 dark:text-indigo-100">
        {children}
      </div>
      {note && (
        <div className="mt-1 text-[11px] font-normal text-indigo-700/80 dark:text-indigo-300/80">
          {note}
        </div>
      )}
    </div>
  );
}

export function Slider2({
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
        <span className="font-mono text-indigo-700 dark:text-indigo-400">{display ?? value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-600"
      />
    </label>
  );
}

export function Chip2({
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
          ? "border-indigo-600 bg-indigo-600 text-white"
          : "border-gray-200 bg-white text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

/** 단계 이동 막대 — 현재 단계를 눌러서 직접 고를 수도 있다 */
export function StepBar({
  steps,
  current,
  onPick,
}: {
  steps: { key: string; label: string }[];
  current: number;
  onPick: (i: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {steps.map((s, i) => {
        const done = i < current;
        const on = i === current;
        return (
          <button
            key={s.key}
            type="button"
            onClick={() => onPick(i)}
            aria-current={on ? "step" : undefined}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              on
                ? "border-indigo-600 bg-indigo-600 text-white"
                : done
                  ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300"
                  : "border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500"
            }`}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                on
                  ? "bg-white/25 text-white"
                  : done
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100 text-gray-400 dark:bg-gray-800"
              }`}
            >
              {i + 1}
            </span>
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

/** 값 하나를 보여주는 작은 칸. 바뀐 값은 강조된다. */
export function Cell({
  label,
  value,
  highlight = false,
  tone = "indigo",
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  highlight?: boolean;
  tone?: "indigo" | "rose" | "gray";
}) {
  const tones = {
    indigo: "border-indigo-300 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/40",
    rose: "border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/40",
    gray: "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/60",
  };
  return (
    <div
      className={`min-w-0 overflow-hidden rounded-lg border px-2 py-1.5 text-center transition-colors ${
        highlight ? tones[tone] : tones.gray
      }`}
    >
      <div className="truncate text-[10px] font-semibold text-gray-500 dark:text-gray-400">
        {label}
      </div>
      <div className="truncate font-mono text-[12px] font-bold text-gray-800 dark:text-gray-100">
        {value}
      </div>
    </div>
  );
}

/** 하이드레이션을 위해 SVG 좌표를 고정 자릿수로 끊는다 */
export function r2(v: number): number {
  return Math.round(v * 100) / 100;
}

/** 시그모이드 — 반복 계산에 쓰므로 매 걸음 자릿수를 맞춘다 */
export function sig(u: number): number {
  return Math.round((1 / (1 + Math.exp(-u))) * 1e9) / 1e9;
}
