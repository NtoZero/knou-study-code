"use client";

import { useMemo, useRef, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { BadgeCheck, Plus, RotateCcw, Trash2 } from "lucide-react";

type Pt = { x: number; y: number };

/** 강의록 3강 선형회귀 예제의 7개 데이터 */
const LECTURE_DATA: Pt[] = [
  { x: 1, y: 0.5 },
  { x: 2, y: 2.5 },
  { x: 3, y: 2.0 },
  { x: 4, y: 4.0 },
  { x: 5, y: 3.5 },
  { x: 6, y: 6.0 },
  { x: 7, y: 5.5 },
];

/** 강의록 표에 인쇄된 잔차 제곱값 */
const LECTURE_SQ = [0.1687, 0.5625, 0.3473, 0.3265, 0.5896, 0.7972, 0.1993];

/**
 * 강의록에 인쇄된 값과 그 표기 자릿수.
 * 화면 값이 이 값들을 실제로 재현하는지 매 렌더마다 비교함.
 * 허용 오차는 인쇄 자릿수의 반올림 폭(0.5 × 10⁻ᵈ)으로 둠.
 */
const LECTURE_REF: { label: string; value: number; digits: number }[] = [
  { label: "N", value: 7, digits: 0 },
  { label: "Σxᵢ", value: 28, digits: 0 },
  { label: "Σyᵢ", value: 24, digits: 0 },
  { label: "Σxᵢyᵢ", value: 119.5, digits: 1 },
  { label: "Σxᵢ²", value: 140, digits: 0 },
  { label: "x̄", value: 4, digits: 0 },
  { label: "ȳ", value: 3.428571, digits: 6 },
  { label: "w₁", value: 0.8392857, digits: 7 },
];

const tolFor = (digits: number) => 0.5 * Math.pow(10, -digits);

type TestPt = { x: number; y: number };
const DEFAULT_TEST: TestPt[] = [
  { x: 8, y: 6.5 },
  { x: 9, y: 7.8 },
  { x: 10, y: 8.2 },
];

const W = 460;
const H = 300;
const PAD_L = 42;
const PAD_B = 34;
const PAD_T = 16;
const PAD_R = 16;
const XMAX = 11;
const YMAX = 10;

const sx = (x: number) => PAD_L + (x / XMAX) * (W - PAD_L - PAD_R);
const sy = (y: number) => H - PAD_B - (y / YMAX) * (H - PAD_T - PAD_B);

function sameAsLecture(pts: Pt[]) {
  if (pts.length !== LECTURE_DATA.length) return false;
  return pts.every(
    (p, i) =>
      Math.abs(p.x - LECTURE_DATA[i].x) < 1e-9 && Math.abs(p.y - LECTURE_DATA[i].y) < 1e-9
  );
}

export default function LinearRegressionCalculator() {
  const [pts, setPts] = useState<Pt[]>(LECTURE_DATA);
  const [xNew, setXNew] = useState("8");
  const [testSet, setTestSet] = useState<TestPt[]>(DEFAULT_TEST);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const isLecture = sameAsLecture(pts);

  const calc = useMemo(() => {
    const n = pts.length;
    const sumX = pts.reduce((s, p) => s + p.x, 0);
    const sumY = pts.reduce((s, p) => s + p.y, 0);
    const sumXY = pts.reduce((s, p) => s + p.x * p.y, 0);
    const sumXX = pts.reduce((s, p) => s + p.x * p.x, 0);
    const sumXsq = sumX * sumX;
    const meanX = n ? sumX / n : 0;
    const meanY = n ? sumY / n : 0;
    const denom = n * sumXX - sumXsq;
    const valid = n >= 2 && Math.abs(denom) > 1e-9;
    const w1 = valid ? (n * sumXY - sumX * sumY) / denom : 0;
    const w0 = valid ? meanY - w1 * meanX : 0;
    const sq = pts.map((p) => {
      const e = p.y - (w1 * p.x + w0);
      return e * e;
    });
    const sse = sq.reduce((s, v) => s + v, 0);
    return { n, sumX, sumY, sumXY, sumXX, sumXsq, meanX, meanY, w1, w0, sq, sse, valid };
  }, [pts]);

  /**
   * 검산 — 강의록 예제 데이터일 때만 수행.
   * 화면에 표시되는 계산 결과를 강의록 인쇄값과 항목별로 실제 비교함.
   */
  const lectureCheck = useMemo(() => {
    if (!isLecture) return null;
    const mine: Record<string, number> = {
      N: calc.n,
      "Σxᵢ": calc.sumX,
      "Σyᵢ": calc.sumY,
      "Σxᵢyᵢ": calc.sumXY,
      "Σxᵢ²": calc.sumXX,
      "x̄": calc.meanX,
      "ȳ": calc.meanY,
      "w₁": calc.w1,
    };
    const items = LECTURE_REF.map((ref) => ({
      label: ref.label,
      ok: Math.abs(mine[ref.label] - ref.value) <= tolFor(ref.digits),
    }));
    calc.sq.forEach((v, i) => {
      items.push({ label: `e${i + 1}²`, ok: Math.abs(v - LECTURE_SQ[i]) <= tolFor(4) });
    });
    const passed = items.filter((it) => it.ok).length;
    return { items, passed, total: items.length, failed: items.filter((it) => !it.ok) };
  }, [isLecture, calc]);

  const testEval = useMemo(() => {
    if (!testSet.length) return { rows: [], mse: 0, rmse: 0 };
    const rows = testSet.map((t) => {
      const pred = calc.w1 * t.x + calc.w0;
      const e = t.y - pred;
      return { ...t, pred, e, sq: e * e };
    });
    const mse = rows.reduce((s, r) => s + r.sq, 0) / rows.length;
    return { rows, mse, rmse: Math.sqrt(mse) };
  }, [testSet, calc.w1, calc.w0]);

  const xNewNum = Number(xNew);
  const xNewValid = xNew.trim() !== "" && Number.isFinite(xNewNum);
  const yNew = xNewValid ? calc.w1 * xNewNum + calc.w0 : null;

  /* --------------------------- 드래그 처리 --------------------------- */
  const yFromClientY = (clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const local = ((clientY - rect.top) / rect.height) * H;
    const y = ((H - PAD_B - local) / (H - PAD_T - PAD_B)) * YMAX;
    return Math.min(YMAX, Math.max(0, Math.round(y * 10) / 10));
  };

  const updateY = (idx: number, y: number) => {
    setPts((prev) => prev.map((p, i) => (i === idx ? { ...p, y } : p)));
  };

  /* --------------------------- 데이터 편집 --------------------------- */
  const addPoint = () => {
    setPts((prev) => {
      const nextX = prev.length ? Math.min(XMAX - 1, Math.max(...prev.map((p) => p.x)) + 1) : 1;
      const y = calc.valid
        ? Math.min(YMAX, Math.max(0, Math.round((calc.w1 * nextX + calc.w0) * 10) / 10))
        : 3;
      return [...prev, { x: nextX, y }];
    });
  };

  const removePoint = (idx: number) => {
    setPts((prev) => (prev.length <= 2 ? prev : prev.filter((_, i) => i !== idx)));
  };

  const setX = (idx: number, raw: string) => {
    const v = Number(raw);
    if (!Number.isFinite(v)) return;
    setPts((prev) => prev.map((p, i) => (i === idx ? { ...p, x: Math.min(XMAX, Math.max(0, v)) } : p)));
  };

  const setY = (idx: number, raw: string) => {
    const v = Number(raw);
    if (!Number.isFinite(v)) return;
    updateY(idx, Math.min(YMAX, Math.max(0, v)));
  };

  const setTestVal = (idx: number, key: "x" | "y", raw: string) => {
    const v = Number(raw);
    if (!Number.isFinite(v)) return;
    setTestSet((prev) => prev.map((t, i) => (i === idx ? { ...t, [key]: v } : t)));
  };

  return (
    <section>
      <SectionTitle
        title="03. 선형회귀 계산기 — 강의록 예제"
        subtitle="최적 매개변수 w₁, w₀는 주어진 데이터로부터 반복 없이 바로 계산됨"
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            setPts(LECTURE_DATA);
            setXNew("8");
            setTestSet(DEFAULT_TEST);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600"
        >
          <RotateCcw size={14} /> 강의록 예제로 되돌리기
        </button>
        <button
          onClick={addPoint}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <Plus size={14} /> 점 추가
        </button>
        {isLecture ? (
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            <BadgeCheck size={13} /> 강의록 예제 데이터
          </span>
        ) : (
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            직접 수정한 데이터
          </span>
        )}
      </div>

      {/* 차트 */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
          데이터 점을 위아래로 <strong>끌어서</strong> yᵢ 값을 바꿀 수 있음. 회귀직선과 잔차, 예측점이 즉시 갱신됨.
        </p>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full touch-none select-none"
          role="img"
          aria-label="선형회귀 데이터와 회귀직선"
        >
          <line x1={PAD_L} y1={H - PAD_B} x2={W - 6} y2={H - PAD_B} stroke="currentColor" className="text-gray-300 dark:text-gray-600" />
          <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="currentColor" className="text-gray-300 dark:text-gray-600" />
          {[0, 2, 4, 6, 8, 10].map((v) => (
            <g key={`gy${v}`}>
              <line
                x1={PAD_L}
                y1={sy(v)}
                x2={W - 6}
                y2={sy(v)}
                stroke="currentColor"
                className="text-gray-100 dark:text-gray-800"
              />
              <text x={PAD_L - 8} y={sy(v) + 4} fontSize="9" textAnchor="end" fill="currentColor" className="text-gray-400">
                {v}
              </text>
            </g>
          ))}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
            <text key={`gx${v}`} x={sx(v)} y={H - PAD_B + 14} fontSize="9" textAnchor="middle" fill="currentColor" className="text-gray-400">
              {v}
            </text>
          ))}
          <text x={W - 14} y={H - PAD_B - 6} fontSize="10" fill="currentColor" className="text-gray-400">x</text>
          <text x={PAD_L + 6} y={PAD_T + 6} fontSize="10" fill="currentColor" className="text-gray-400">y</text>

          {calc.valid && (
            <>
              {/* 잔차선 */}
              {pts.map((p, i) => (
                <line
                  key={`e-${i}`}
                  x1={sx(p.x)}
                  y1={sy(p.y)}
                  x2={sx(p.x)}
                  y2={sy(calc.w1 * p.x + calc.w0)}
                  stroke={p.y - (calc.w1 * p.x + calc.w0) >= 0 ? "#ef4444" : "#3b82f6"}
                  strokeWidth="2"
                  opacity={0.65}
                />
              ))}
              {/* 회귀직선 */}
              <line
                x1={sx(0)}
                y1={sy(calc.w0)}
                x2={sx(XMAX)}
                y2={sy(calc.w1 * XMAX + calc.w0)}
                stroke="#f97316"
                strokeWidth="2.5"
              />
            </>
          )}

          {/* 예측점 */}
          {calc.valid && yNew !== null && xNewNum >= 0 && xNewNum <= XMAX && yNew >= 0 && yNew <= YMAX && (
            <g>
              <line
                x1={sx(xNewNum)}
                y1={sy(0)}
                x2={sx(xNewNum)}
                y2={sy(yNew)}
                stroke="#d946ef"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <circle cx={sx(xNewNum)} cy={sy(yNew)} r="6" fill="#fff" stroke="#d946ef" strokeWidth="2.5" />
              <text
                x={sx(xNewNum) + (sx(xNewNum) > W - 80 ? -9 : 9)}
                y={sy(yNew) - 6}
                fontSize="10"
                textAnchor={sx(xNewNum) > W - 80 ? "end" : "start"}
                fill="#d946ef"
                fontWeight="bold"
              >
                예측 {yNew.toFixed(3)}
              </text>
            </g>
          )}

          {/* 데이터 점 (드래그) */}
          {pts.map((p, i) => (
            <circle
              key={`p-${i}`}
              cx={sx(p.x)}
              cy={sy(p.y)}
              r={dragIdx === i ? 9 : 6}
              fill={dragIdx === i ? "#f97316" : "#1f2937"}
              className={dragIdx === i ? "" : "dark:fill-gray-100"}
              stroke="#f97316"
              strokeWidth={dragIdx === i ? 3 : 0}
              style={{ cursor: "ns-resize" }}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setDragIdx(i);
              }}
              onPointerMove={(e) => {
                if (dragIdx !== i) return;
                const y = yFromClientY(e.clientY);
                if (y !== null) updateY(i, y);
              }}
              onPointerUp={(e) => {
                e.currentTarget.releasePointerCapture(e.pointerId);
                setDragIdx(null);
              }}
              onPointerCancel={() => setDragIdx(null)}
            />
          ))}
        </svg>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-4 bg-[#f97316]" /> 회귀직선
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-3 rounded bg-[#ef4444]" /> 잔차 (+)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-3 rounded bg-[#3b82f6]" /> 잔차 (−)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full border-2 border-[#d946ef]" /> x_new 예측
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Σ 계산표 */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">Σ 계산표</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[300px] text-sm">
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {(
                  [
                    ["N", calc.n.toString(), "7"],
                    ["Σxᵢ", calc.sumX.toFixed(1), "28"],
                    ["Σyᵢ", calc.sumY.toFixed(1), "24"],
                    ["Σxᵢyᵢ", calc.sumXY.toFixed(1), "119.5"],
                    ["Σxᵢ²", calc.sumXX.toFixed(1), "140"],
                    ["(Σxᵢ)²", calc.sumXsq.toFixed(1), "784"],
                    ["x̄", calc.meanX.toFixed(6), "4"],
                    ["ȳ", calc.meanY.toFixed(6), "3.428571"],
                  ] as [string, string, string][]
                ).map(([label, value, lectureVal]) => (
                  <tr key={label}>
                    <td className="py-1.5 pr-2 font-mono text-gray-600 dark:text-gray-300">{label}</td>
                    <td className="py-1.5 text-right font-mono font-semibold text-gray-900 dark:text-gray-100">{value}</td>
                    {isLecture && (
                      <td className="py-1.5 pl-3 text-right text-xs text-emerald-600 dark:text-emerald-400">
                        강의록 {lectureVal}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 데이터 편집 + 잔차 제곱 */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">데이터와 잔차의 제곱 eᵢ²</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] text-sm">
              <thead className="text-xs text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-1 py-1 text-left font-medium">xᵢ</th>
                  <th className="px-1 py-1 text-left font-medium">yᵢ</th>
                  <th className="px-1 py-1 text-right font-medium">eᵢ²</th>
                  {isLecture && <th className="px-1 py-1 text-right font-medium">강의록</th>}
                  <th className="px-1 py-1" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {pts.map((p, i) => (
                  <tr key={i}>
                    <td className="px-1 py-1">
                      <input
                        type="number"
                        step={1}
                        value={p.x}
                        onChange={(e) => setX(i, e.target.value)}
                        className="w-14 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-xs dark:border-gray-700 dark:bg-gray-800"
                      />
                    </td>
                    <td className="px-1 py-1">
                      <input
                        type="number"
                        step={0.1}
                        value={p.y}
                        onChange={(e) => setY(i, e.target.value)}
                        className="w-16 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-xs dark:border-gray-700 dark:bg-gray-800"
                      />
                    </td>
                    <td className="px-1 py-1 text-right font-mono text-xs text-gray-800 dark:text-gray-100">
                      {calc.sq[i].toFixed(4)}
                    </td>
                    {isLecture && (
                      <td className="px-1 py-1 text-right font-mono text-xs text-emerald-600 dark:text-emerald-400">
                        {LECTURE_SQ[i].toFixed(4)}
                      </td>
                    )}
                    <td className="px-1 py-1 text-right">
                      <button
                        onClick={() => removePoint(i)}
                        disabled={pts.length <= 2}
                        className="rounded p-1 text-gray-400 hover:bg-rose-50 hover:text-rose-500 disabled:opacity-30 dark:hover:bg-rose-900/20"
                        title="삭제"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-orange-50 font-semibold dark:bg-orange-950/40">
                  <td className="px-1 py-1.5 font-mono text-xs">Σ</td>
                  <td className="px-1 py-1.5 font-mono text-xs">{calc.sumY.toFixed(1)}</td>
                  <td className="px-1 py-1.5 text-right font-mono text-xs text-orange-700 dark:text-orange-300">
                    {calc.sse.toFixed(4)}
                  </td>
                  {isLecture && (
                    <td className="px-1 py-1.5 text-right font-mono text-xs text-emerald-600 dark:text-emerald-400">
                      2.9911
                    </td>
                  )}
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
          {lectureCheck && (
            <div className="mt-2 space-y-1 text-[11px] text-gray-500 dark:text-gray-400">
              <p
                className={
                  lectureCheck.failed.length === 0
                    ? "flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400"
                    : "flex items-center gap-1 font-medium text-rose-600 dark:text-rose-400"
                }
              >
                {lectureCheck.failed.length === 0 ? <BadgeCheck size={13} /> : null}
                검산 {lectureCheck.passed} / {lectureCheck.total} 항목이 강의록 인쇄값과 일치
                {lectureCheck.failed.length > 0 &&
                  ` — 불일치: ${lectureCheck.failed.map((f) => f.label).join(", ")}`}
              </p>
              <p>
                7개 eᵢ²를 더한 합은 {calc.sse.toFixed(4)}이며, 강의록 표의 Σ 칸에는 2.911로 인쇄되어 있음.
                자릿수 하나가 빠진 인쇄 오기로 보면 됨.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 최적 매개변수 공식 */}
      <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-800 dark:bg-orange-950">
        <h3 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">최적의 매개변수 — 공식과 대입</h3>

        {!calc.valid && (
          <div className="mb-3 rounded-lg border border-rose-300 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-300">
            분모 N Σxᵢ² − (Σxᵢ)² 가 0이 되어 w₁을 구할 수 없음. 모든 xᵢ가 같은 값이면 이 분모가 0이 되며, 이는
            같은 x 위에 점이 쌓여 있어 기울기를 정할 수 없다는 뜻. xᵢ 값을 서로 다르게 바꾸면 다시 계산됨.
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-orange-200 bg-white p-4 dark:border-orange-800 dark:bg-gray-900">
          <div className="flex min-w-max items-center gap-3 font-mono text-sm text-gray-800 dark:text-gray-100">
            <span>w₁ =</span>
            <span className="inline-flex flex-col items-center leading-tight">
              <span className="px-2 pb-1">N Σyᵢxᵢ − Σxᵢ · Σyᵢ</span>
              <span className="w-full border-t border-gray-500" />
              <span className="px-2 pt-1">N Σxᵢ² − (Σxᵢ)²</span>
            </span>
            <span className="text-gray-400">=</span>
            <span className="inline-flex flex-col items-center leading-tight text-orange-600 dark:text-orange-300">
              <span className="px-2 pb-1">
                {calc.n} × {calc.sumXY.toFixed(1)} − {calc.sumX.toFixed(1)} × {calc.sumY.toFixed(1)}
              </span>
              <span className="w-full border-t border-orange-400" />
              <span className="px-2 pt-1">
                {calc.n} × {calc.sumXX.toFixed(1)} − {calc.sumXsq.toFixed(1)}
              </span>
            </span>
            <span className="text-gray-400">=</span>
            <span className="inline-flex flex-col items-center leading-tight">
              <span className="px-2 pb-1">{(calc.n * calc.sumXY - calc.sumX * calc.sumY).toFixed(1)}</span>
              <span className="w-full border-t border-gray-500" />
              <span className="px-2 pt-1">{(calc.n * calc.sumXX - calc.sumXsq).toFixed(1)}</span>
            </span>
            <span className="font-bold text-orange-700 dark:text-orange-300">= {calc.w1.toFixed(7)}</span>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto rounded-lg border border-orange-200 bg-white p-4 dark:border-orange-800 dark:bg-gray-900">
          <p className="min-w-max font-mono text-sm text-gray-800 dark:text-gray-100">
            w₀ = ȳ − w₁x̄ = {calc.meanY.toFixed(6)} − {calc.w1.toFixed(7)} × {calc.meanX.toFixed(6)}
            <span className="ml-2 font-bold text-orange-700 dark:text-orange-300">= {calc.w0.toFixed(7)}</span>
          </p>
        </div>

        <div className="mt-4 rounded-lg border-2 border-orange-400 bg-white p-4 text-center dark:border-orange-600 dark:bg-gray-900">
          <p className="text-xs text-gray-500 dark:text-gray-400">회귀함수</p>
          <p className="mt-1 font-mono text-lg font-bold text-orange-700 dark:text-orange-300">
            y = {calc.w1.toFixed(7)}x + {calc.w0.toFixed(7)}
          </p>
          {lectureCheck && (
            <p
              className={`mt-2 flex items-center justify-center gap-1 text-xs ${
                Math.abs(calc.w1 - 0.8392857) <= tolFor(7)
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              <BadgeCheck size={13} />
              강의록 표기 y = 0.8392857x + 0.0714282 와 대조 — w₁ 차이{" "}
              {Math.abs(calc.w1 - 0.8392857).toExponential(1)}, w₀ 차이{" "}
              {Math.abs(calc.w0 - 0.0714282).toExponential(1)}
            </p>
          )}
          {isLecture && (
            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
              w₀는 ȳ − w₁x̄ = 0.0714286 이 정확한 값. 강의록에 인쇄된 0.0714282는 끝자리 표기 차이.
            </p>
          )}
        </div>
      </div>

      {/* 예측과 평가 */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">새로운 데이터 x_new에 대한 예측</h3>
          <p className="mb-3 font-mono text-xs text-gray-500 dark:text-gray-400">y_new = w₁ x_new + w₀</p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">x_new =</label>
            <input
              type="number"
              step={0.5}
              value={xNew}
              onChange={(e) => setXNew(e.target.value)}
              className="w-24 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-sm dark:border-gray-700 dark:bg-gray-800"
            />
            <span className="text-gray-400">→</span>
            <span className="rounded-lg bg-fuchsia-100 px-3 py-1 font-mono text-sm font-bold text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300">
              y_new = {yNew === null ? "—" : yNew.toFixed(4)}
            </span>
          </div>
          {isLecture && (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              데이터는 x = 7까지 있지만 x = 8을 회귀함수에 넣으면 y ≈ 6.78이 나옴. 이런 식으로 새로운 값을 예측.
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[8, 9, 10, 0].map((v) => (
              <button
                key={v}
                onClick={() => setXNew(String(v))}
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-600 hover:bg-fuchsia-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-fuchsia-900/20"
              >
                x = {v}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">테스트 데이터 집합에 대한 평가</h3>
          <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
            학습에 쓰지 않은 데이터 {"{"}(xⱼᵗˢᵗ, yⱼᵗˢᵗ){"}"}ⱼ₌₁,⋯,ₙ₍ₜₛₜ₎ 로 평가. 값을 바꿔 볼 수 있음.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[300px] text-xs">
              <thead className="text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-1 py-1 text-left font-medium">xⱼᵗˢᵗ</th>
                  <th className="px-1 py-1 text-left font-medium">yⱼᵗˢᵗ</th>
                  <th className="px-1 py-1 text-right font-medium">예측</th>
                  <th className="px-1 py-1 text-right font-medium">제곱오차</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {testEval.rows.map((r, i) => (
                  <tr key={i}>
                    <td className="px-1 py-1">
                      <input
                        type="number"
                        step={0.5}
                        value={testSet[i].x}
                        onChange={(e) => setTestVal(i, "x", e.target.value)}
                        className="w-14 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono dark:border-gray-700 dark:bg-gray-800"
                      />
                    </td>
                    <td className="px-1 py-1">
                      <input
                        type="number"
                        step={0.1}
                        value={testSet[i].y}
                        onChange={(e) => setTestVal(i, "y", e.target.value)}
                        className="w-16 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono dark:border-gray-700 dark:bg-gray-800"
                      />
                    </td>
                    <td className="px-1 py-1 text-right font-mono">{r.pred.toFixed(3)}</td>
                    <td className="px-1 py-1 text-right font-mono">{r.sq.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-center dark:border-orange-800 dark:bg-orange-950">
              <p className="text-xs text-gray-500 dark:text-gray-400">MSE 평균제곱오차</p>
              <p className="mt-1 font-mono text-lg font-bold text-orange-700 dark:text-orange-300">
                {testEval.mse.toFixed(4)}
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center dark:border-amber-800 dark:bg-amber-950">
              <p className="text-xs text-gray-500 dark:text-gray-400">RMSE 평균제곱근오차</p>
              <p className="mt-1 font-mono text-lg font-bold text-amber-700 dark:text-amber-300">
                {testEval.rmse.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex min-w-max items-center gap-2 font-mono text-sm text-gray-800 dark:text-gray-100">
            <span>MSE(w₁, w₀) =</span>
            <span className="inline-flex flex-col items-center leading-tight">
              <span className="px-1">1</span>
              <span className="w-full border-t border-gray-500" />
              <span className="px-1">N_tst</span>
            </span>
            <span>Σⱼ ( yⱼᵗˢᵗ − (w₁xⱼᵗˢᵗ + w₀) )²</span>
          </div>
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
            1/N_tst 항은 데이터 개수에 의존해 제곱오차가 너무 커지는 것을 막기 위한 것.
          </p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex min-w-max items-center gap-2 font-mono text-sm text-gray-800 dark:text-gray-100">
            <span>RMSE(w₁, w₀) = √</span>
            <span className="border-t-2 border-gray-500 pt-1">MSE(w₁, w₀)</span>
          </div>
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
            제곱을 하면 실제 차이값이 무엇인지 직관적으로 알기 어렵기 때문에, 제곱근을 씌워 원래 차이값의 스케일로 되돌려
            직관적으로 이해하기 위해 사용.
          </p>
        </div>
      </div>
    </section>
  );
}
