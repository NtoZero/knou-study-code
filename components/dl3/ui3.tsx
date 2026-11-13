"use client";

/** 3강(딥러닝 프레임워크) 전용 표시 요소 — 강조색 amber. 공용 부품은 수정하지 않고 여기서 보완한다. */

/** 수식·결과 상자 */
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
      className={`min-w-0 max-w-full overflow-x-auto rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-center dark:border-amber-900/60 dark:bg-amber-950/30 ${className}`}
    >
      <div className="whitespace-nowrap text-[13px] font-semibold text-amber-900 dark:text-amber-100">
        {children}
      </div>
      {note && (
        <div className="mt-1 whitespace-normal text-[11px] font-normal text-amber-800/80 dark:text-amber-300/80">
          {note}
        </div>
      )}
    </div>
  );
}

/** 선택 칩 */
export function Chip3({
  active,
  onClick,
  children,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
        active
          ? "border-amber-500 bg-amber-500 text-white"
          : "border-gray-200 bg-white text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      } ${className}`}
    >
      {children}
    </button>
  );
}

/** 탭처럼 쓰는 넓은 선택 단추 */
export function Tab3({
  active,
  onClick,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  title: React.ReactNode;
  desc?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-w-0 flex-1 rounded-lg border px-3 py-2 text-left transition-colors ${
        active
          ? "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-950/40"
          : "border-gray-200 bg-white hover:border-amber-200 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-amber-900"
      }`}
    >
      <span
        className={`block text-[12px] font-bold ${
          active ? "text-amber-700 dark:text-amber-300" : "text-gray-600 dark:text-gray-300"
        }`}
      >
        {title}
      </span>
      {desc && (
        <span className="mt-0.5 block text-[10.5px] leading-4 text-gray-500 dark:text-gray-400">
          {desc}
        </span>
      )}
    </button>
  );
}

export function Slider3({
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
        <span className="font-mono text-amber-700 dark:text-amber-400">{display ?? value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-amber-500"
      />
    </label>
  );
}

export type CodeLine = { t: string; mark?: boolean; dim?: boolean };

/**
 * 코드는 핵심 몇 줄만 인용한다. `mark`가 붙은 줄만 강조해 "무엇이 달라졌는지"를 보이는 용도.
 */
export function Code({ lines, caption }: { lines: CodeLine[]; caption?: React.ReactNode }) {
  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      {caption && (
        <div className="border-b border-gray-200 bg-gray-50 px-3 py-1.5 text-[10.5px] font-semibold text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          {caption}
        </div>
      )}
      <pre className="min-w-0 max-w-full overflow-x-auto bg-white px-3 py-2.5 dark:bg-gray-950">
        <code className="block font-mono text-[11.5px] leading-[1.7]">
          {lines.map((l, i) => (
            <span
              key={`${i}-${l.t}`}
              className={`block rounded px-1 ${
                l.mark
                  ? "bg-amber-100 font-semibold text-amber-900 dark:bg-amber-900/40 dark:text-amber-100"
                  : l.dim
                    ? "text-gray-400 dark:text-gray-600"
                    : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {l.t === "" ? " " : l.t}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

/** 출력 상자 — 강의록에 적힌 실행 결과를 그대로 보일 때 */
export function Out({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-w-0 max-w-full overflow-x-auto rounded-lg border border-dashed border-amber-300 bg-amber-50/50 px-3 py-2 dark:border-amber-800 dark:bg-amber-950/20">
      <pre className="font-mono text-[11.5px] leading-[1.7] text-amber-900 dark:text-amber-100">
        {children}
      </pre>
    </div>
  );
}

/** 작은 꼬리표 */
export function Pill({
  children,
  tone = "gray",
}: {
  children: React.ReactNode;
  tone?: "gray" | "amber" | "sky" | "rose" | "green";
}) {
  const tones = {
    gray: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200",
    sky: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-200",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-200",
    green: "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-200",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

/** SVG 좌표는 자릿수를 끊어 서버·브라우저 출력이 어긋나지 않게 한다. */
export function r2(v: number): number {
  return Math.round(v * 100) / 100;
}
