/** 15강 컴포넌트가 함께 쓰는 작은 표시 요소 */

export const ACCENT = "text-cyan-600 dark:text-cyan-400";
export const ACCENT_BG = "bg-cyan-600";

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

/** 수식·값 상자 — 유니코드 수식을 가운데 정렬로 */
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
      className={`overflow-x-auto rounded-lg border border-cyan-100 bg-cyan-50/60 px-3 py-2.5 text-center dark:border-cyan-900/60 dark:bg-cyan-950/30 ${className}`}
    >
      <div className="whitespace-nowrap text-[13px] font-semibold text-cyan-900 dark:text-cyan-100">
        {children}
      </div>
      {note && (
        <div className="mt-1 text-[11px] font-normal text-cyan-700/80 dark:text-cyan-300/80">
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
      <span className="mb-1 flex items-center justify-between text-[11px] font-semibold text-gray-600 dark:text-gray-300">
        <span>{label}</span>
        <span className="font-mono text-cyan-600 dark:text-cyan-400">{display ?? value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan-600"
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
          ? "border-cyan-600 bg-cyan-600 text-white"
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

/** 천 단위 구분 */
export function num(n: number): string {
  return n.toLocaleString("en-US");
}

/** 소수 자릿수를 고정하되 끝의 0은 지운다 — 0.9, 0.81, 0.729 */
export function fmtQ(v: number, digits = 4): string {
  if (Object.is(v, -0) || Math.abs(v) < 1e-12) return "0";
  return Number(v.toFixed(digits)).toString();
}

/**
 * 시드를 고정한 난수. 렌더 중에는 호출하지 않고,
 * 버튼을 눌렀을 때만 다음 값을 꺼내 쓴다.
 */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 본문 문단 */
export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">{children}</p>;
}

/** 정의 → 직관 → 예시 → 오답 기준을 한 줄씩 붙이는 작은 표 */
export function ConceptRows({
  rows,
}: {
  rows: { k: "정의" | "직관" | "예시" | "오답 기준"; v: React.ReactNode }[];
}) {
  const tone: Record<string, string> = {
    정의: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300",
    직관: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
    예시: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    "오답 기준": "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
  };
  return (
    <dl className="space-y-1.5">
      {rows.map((r) => (
        <div key={r.k} className="flex gap-2">
          <dt
            className={`h-fit shrink-0 rounded-md px-1.5 py-0.5 text-[10.5px] font-bold ${tone[r.k]}`}
          >
            {r.k}
          </dt>
          <dd className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}
