"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { ArrowDown, ArrowRight, Quote } from "lucide-react";

/* ------------------------------------------------------------------ */
/* 판매 예측 (시계열 예측 응용)                                          */
/* ------------------------------------------------------------------ */

type SalesPoint = { year: number; a: number; b: number };

const SALES: SalesPoint[] = [
  { year: 2010, a: 22, b: 10 },
  { year: 2011, a: 26, b: 12 },
  { year: 2012, a: 29, b: 11 },
  { year: 2013, a: 33, b: 13 },
  { year: 2014, a: 36, b: 12 },
  { year: 2015, a: 40, b: 14 },
  { year: 2016, a: 43, b: 13 },
  { year: 2017, a: 47, b: 15 },
  { year: 2018, a: 50, b: 14 },
];

const FORECAST = { year: 2019.8, a: 53, b: 15 };

function SalesForecastChart() {
  const W = 420;
  const H = 210;
  const pad = { l: 34, r: 58, t: 14, b: 26 };
  const x0 = 2010;
  const x1 = 2019.8;
  const yMax = 60;

  const sx = (year: number) =>
    pad.l + ((year - x0) / (x1 - x0)) * (W - pad.l - pad.r);
  const sy = (v: number) => H - pad.b - (v / yMax) * (H - pad.t - pad.b);

  const lineA = SALES.map((d) => `${sx(d.year)},${sy(d.a)}`).join(" ");
  const lineB = SALES.map((d) => `${sx(d.year)},${sy(d.b)}`).join(" ");
  const last = SALES[SALES.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="판매 예측 시계열 그래프">
      <line
        x1={pad.l}
        y1={H - pad.b}
        x2={W - pad.r + 44}
        y2={H - pad.b}
        stroke="currentColor"
        className="text-gray-300 dark:text-gray-600"
        strokeWidth="1"
      />
      <line
        x1={pad.l}
        y1={pad.t}
        x2={pad.l}
        y2={H - pad.b}
        stroke="currentColor"
        className="text-gray-300 dark:text-gray-600"
        strokeWidth="1"
      />
      {[2010, 2012, 2014, 2016, 2018].map((y) => (
        <text
          key={y}
          x={sx(y)}
          y={H - pad.b + 15}
          textAnchor="middle"
          fontSize="9"
          fill="currentColor"
          className="text-gray-400"
        >
          {y}
        </text>
      ))}

      {/* 관측 구간 / 예측 구간 경계 */}
      <line
        x1={sx(last.year)}
        y1={pad.t}
        x2={sx(last.year)}
        y2={H - pad.b}
        stroke="currentColor"
        className="text-orange-300 dark:text-orange-700"
        strokeWidth="1"
        strokeDasharray="3 3"
      />

      <polyline points={lineA} fill="none" stroke="#f97316" strokeWidth="2" />
      <polyline points={lineB} fill="none" stroke="#0ea5e9" strokeWidth="2" />

      {/* 예측 구간 */}
      <line
        x1={sx(last.year)}
        y1={sy(last.a)}
        x2={sx(FORECAST.year)}
        y2={sy(FORECAST.a)}
        stroke="#f97316"
        strokeWidth="2"
        strokeDasharray="4 3"
      />
      <line
        x1={sx(last.year)}
        y1={sy(last.b)}
        x2={sx(FORECAST.year)}
        y2={sy(FORECAST.b)}
        stroke="#0ea5e9"
        strokeWidth="2"
        strokeDasharray="4 3"
      />

      {SALES.map((d) => (
        <g key={d.year}>
          <circle cx={sx(d.year)} cy={sy(d.a)} r="2.5" fill="#f97316" />
          <circle cx={sx(d.year)} cy={sy(d.b)} r="2.5" fill="#0ea5e9" />
        </g>
      ))}

      <circle cx={sx(FORECAST.year)} cy={sy(FORECAST.a)} r="4" fill="#fff" stroke="#f97316" strokeWidth="2" />
      <circle cx={sx(FORECAST.year)} cy={sy(FORECAST.b)} r="4" fill="#fff" stroke="#0ea5e9" strokeWidth="2" />

      <text x={sx(FORECAST.year) + 8} y={sy(FORECAST.a) - 12} fontSize="9" fill="currentColor" className="text-gray-500">
        2019.8 예측
      </text>
      <text x={sx(FORECAST.year) + 8} y={sy(FORECAST.a) + 2} fontSize="10" fill="#f97316" fontWeight="bold">
        상품A : {FORECAST.a}
      </text>
      <text x={sx(FORECAST.year) + 8} y={sy(FORECAST.b) + 4} fontSize="10" fill="#0ea5e9" fontWeight="bold">
        상품B : {FORECAST.b}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 회귀 시스템 입·출력 도식                                              */
/* ------------------------------------------------------------------ */

const systemFlow = [
  {
    label: "학습 데이터 집합",
    formula: "D = {(xᵢ, yᵢ)}ᵢ₌₁…ₙ,  yᵢ ∈ R",
    note: "입력 xᵢ와 목표 출력값 yᵢ의 쌍. 목표 출력값이 있으므로 지도학습.",
    tone: "orange",
  },
  {
    label: "학습 (데이터 분석)",
    formula: "θ ← D",
    note: "데이터를 분석·학습하여 매개변수 θ를 결정.",
    tone: "orange",
  },
  {
    label: "회귀함수",
    formula: "y = f(x; θ)",
    note: "학습 단계의 결과물. 입력과 출력의 매핑 관계를 표현.",
    tone: "amber",
  },
  {
    label: "테스트 데이터",
    formula: "x_new",
    note: "학습에 쓰이지 않은 새로운 입력.",
    tone: "slate",
  },
  {
    label: "예측 결과",
    formula: "y_new = f(x_new; θ)",
    note: "추론 단계. 회귀함수에 새 입력을 넣어 연속적인 실수값을 예측.",
    tone: "rose",
  },
];

const flowTone: Record<string, string> = {
  orange: "border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-950",
  amber: "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950",
  slate: "border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-900",
  rose: "border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950",
};

/* ------------------------------------------------------------------ */
/* 분류 vs 회귀                                                         */
/* ------------------------------------------------------------------ */

const compare = {
  분류: {
    output: "이산적인 값 — 클래스 레이블",
    dataset: "D = {(xᵢ, yᵢ)},  yᵢ ∈ {0, 1, ⋯, M−1}",
    result: "입력이 어떤 클래스에 속하는지를 출력",
    example: "손글씨 숫자를 0~9 중 하나로 판정",
    tone: "text-violet-600 dark:text-violet-300",
  },
  회귀: {
    output: "연속적인 실수값",
    dataset: "D = {(xᵢ, yᵢ)},  yᵢ ∈ R",
    result: "입력에 대응하는 실수값을 예측",
    example: "BMI로부터 체지방률을 예측, 주가·환율 예측",
    tone: "text-orange-600 dark:text-orange-300",
  },
} as const;

type CompareKey = keyof typeof compare;

/* ------------------------------------------------------------------ */
/* 보간법 vs 회귀                                                       */
/* ------------------------------------------------------------------ */

type Pt = { x: number; y: number };

const CURVE_DATA: Pt[] = [
  { x: 0.5, y: 1.2 },
  { x: 1.2, y: 2.8 },
  { x: 2.0, y: 1.8 },
  { x: 2.8, y: 3.6 },
  { x: 3.6, y: 2.9 },
  { x: 4.4, y: 4.6 },
  { x: 5.0, y: 3.9 },
];

function catmullRomPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(
      2
    )} ${p2.y.toFixed(2)}`;
  }
  return d;
}

type CurveMode = "data" | "interpolation" | "regression";

function InterpolationVsRegression() {
  const [mode, setMode] = useState<CurveMode>("data");

  const fit = useMemo(() => {
    const n = CURVE_DATA.length;
    const sx = CURVE_DATA.reduce((s, p) => s + p.x, 0);
    const sy = CURVE_DATA.reduce((s, p) => s + p.y, 0);
    const sxy = CURVE_DATA.reduce((s, p) => s + p.x * p.y, 0);
    const sxx = CURVE_DATA.reduce((s, p) => s + p.x * p.x, 0);
    const w1 = (n * sxy - sx * sy) / (n * sxx - sx * sx);
    const w0 = sy / n - (w1 * sx) / n;
    const sse = CURVE_DATA.reduce((s, p) => {
      const e = p.y - (w1 * p.x + w0);
      return s + e * e;
    }, 0);
    return { w1, w0, sse };
  }, []);

  const W = 320;
  const H = 240;
  const pad = 34;
  const sx = (x: number) => pad + (x / 5.5) * (W - pad * 1.4);
  const sy = (y: number) => H - pad - (y / 5.5) * (H - pad * 1.4);

  const screenPts = CURVE_DATA.map((p) => ({ x: sx(p.x), y: sy(p.y) }));
  const interpPath = catmullRomPath(screenPts);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["data", "데이터"],
            ["interpolation", "보간 곡선"],
            ["regression", "회귀 직선"],
          ] as [CurveMode, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === key
                ? "border-orange-500 bg-orange-500 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:bg-orange-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-orange-900/20"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="보간 곡선과 회귀 직선 비교">
            <line x1={pad} y1={H - pad} x2={W - 10} y2={H - pad} stroke="currentColor" className="text-gray-300 dark:text-gray-600" />
            <line x1={pad} y1={14} x2={pad} y2={H - pad} stroke="currentColor" className="text-gray-300 dark:text-gray-600" />
            <text x={pad - 10} y={sy(5) + 4} fontSize="10" fill="currentColor" className="text-gray-400">5</text>
            <text x={pad - 10} y={sy(0) + 4} fontSize="10" fill="currentColor" className="text-gray-400">0</text>
            <text x={sx(5)} y={H - pad + 15} fontSize="10" textAnchor="middle" fill="currentColor" className="text-gray-400">5</text>
            <text x={W - 16} y={H - pad - 6} fontSize="10" fill="currentColor" className="text-gray-400">x</text>
            <text x={pad + 6} y={20} fontSize="10" fill="currentColor" className="text-gray-400">y</text>

            <AnimatePresence>
              {mode === "interpolation" && (
                <motion.path
                  key="interp"
                  d={interpPath}
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              )}
              {mode === "regression" && (
                <motion.g key="reg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {CURVE_DATA.map((p) => (
                    <line
                      key={`r-${p.x}`}
                      x1={sx(p.x)}
                      y1={sy(p.y)}
                      x2={sx(p.x)}
                      y2={sy(fit.w1 * p.x + fit.w0)}
                      stroke="#fb923c"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                  ))}
                  <line
                    x1={sx(0)}
                    y1={sy(fit.w0)}
                    x2={sx(5.4)}
                    y2={sy(fit.w1 * 5.4 + fit.w0)}
                    stroke="#f97316"
                    strokeWidth="2.5"
                  />
                </motion.g>
              )}
            </AnimatePresence>

            {CURVE_DATA.map((p) => (
              <circle key={p.x} cx={sx(p.x)} cy={sy(p.y)} r="4" fill="#1f2937" className="dark:fill-gray-100" />
            ))}
          </svg>
        </div>

        <div className="space-y-3 text-sm">
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-950">
            <p className="font-semibold text-rose-700 dark:text-rose-300">보간법 interpolation</p>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              원래 점들을 모두 지나므로 <strong>제곱 오차가 0</strong>. 하지만 매우 복잡한 곡선이 됨.
            </p>
            <p className="mt-2 font-mono text-xs text-rose-600 dark:text-rose-300">Σeᵢ² = 0.000</p>
          </div>
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950">
            <p className="font-semibold text-orange-700 dark:text-orange-300">회귀 regression</p>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              어느 정도의 오차가 존재하지만, <strong>데이터의 전체적인 경향을 보여주는 입출력 관계</strong> 표현에 적합.
            </p>
            <p className="mt-2 font-mono text-xs text-orange-600 dark:text-orange-300">
              Σeᵢ² = {fit.sse.toFixed(3)} &nbsp;/&nbsp; y = {fit.w1.toFixed(3)}x + {fit.w0.toFixed(3)}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            주어진 데이터는 <strong>어느 정도의 잡음을 포함</strong>하고 있다고 가정하므로, 완벽하고 정확한 곡선을 찾는 것이 아니라
            어느 정도의 오차는 허용함.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 본체                                                                */
/* ------------------------------------------------------------------ */

export default function RegressionConcept() {
  const [cmp, setCmp] = useState<CompareKey>("회귀");

  return (
    <section>
      <SectionTitle
        title="01. 회귀의 개념"
        subtitle="입력과 출력 사이의 매핑 관계를 찾는 문제 — 출력은 연속적인 실수값"
      />

      {/* 정의 */}
      <div className="mb-8 rounded-xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-800 dark:bg-orange-950">
        <p className="text-sm text-gray-600 dark:text-gray-300">회귀란</p>
        <p className="mt-2 text-lg font-bold text-orange-700 dark:text-orange-300">
          입력 변수와 출력 변수 사이의 매핑 관계 <span className="font-mono">y = f(x; θ)</span> 를 찾는 것
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-orange-200 bg-white p-3 text-sm dark:border-orange-800 dark:bg-gray-900">
            <span className="font-semibold text-orange-600 dark:text-orange-300">입력 변수 x</span>
            <span className="ml-2 text-gray-500">통계학 용어로 </span>
            <strong className="text-gray-700 dark:text-gray-200">독립 변수</strong>
          </div>
          <div className="rounded-lg border border-orange-200 bg-white p-3 text-sm dark:border-orange-800 dark:bg-gray-900">
            <span className="font-semibold text-orange-600 dark:text-orange-300">출력 변수 y</span>
            <span className="ml-2 text-gray-500">통계학 용어로 </span>
            <strong className="text-gray-700 dark:text-gray-200">종속 변수</strong>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          바꿔 말하면 함수의 모양을 결정하는 매개변수 θ를 찾는 것이 회귀. 입력(BMI)도 출력(체지방률)도 모두 실수값이라는 점이 회귀의 특징.
        </p>
      </div>

      {/* 응용 */}
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">
            대표 응용 — 시계열 예측
          </h3>
          <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
            시간에 따라 데이터가 변하는 것을 분석하고 과거 데이터로 앞으로의 값을 예측.
          </p>
          <SalesForecastChart />
          <div className="mt-3 flex flex-wrap gap-2">
            {["주가 예측", "환율 예측", "시장 예측", "판매 예측"].map((t) => (
              <span
                key={t}
                className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">회귀에 적용할 수 있는 방법</h3>
          <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
            같은 회귀 문제라도 매핑 함수의 형태에 따라 방법이 달라짐.
          </p>
          <ul className="space-y-2 text-sm">
            {[
              ["선형회귀", "직선(1차식) 형태의 매핑 — 이 강의의 02절"],
              ["비선형회귀", "직선으로 설명되지 않는 관계를 곡선으로 표현"],
              ["로지스틱 회귀", "출력을 범주형으로 확장 — 이 강의의 03절"],
              ["SVM", "마진을 최대화하는 회귀·분류 모델"],
              ["신경망", "복잡한 매핑 관계를 다층 구조로 학습"],
            ].map(([name, desc]) => (
              <li
                key={name}
                className="flex flex-col gap-0.5 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-100">{name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 회귀 시스템 도식 */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">회귀 시스템의 입·출력 관계</h3>
        <div className="space-y-2">
          {systemFlow.map((node, i) => (
            <div key={node.label}>
              <div className={`rounded-lg border p-3 ${flowTone[node.tone]}`}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{node.label}</span>
                  <span className="font-mono text-xs text-gray-600 dark:text-gray-300">{node.formula}</span>
                </div>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{node.note}</p>
              </div>
              {i < systemFlow.length - 1 && (
                <div className="flex justify-center py-1 text-gray-400">
                  <ArrowDown size={16} />
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          위쪽 세 단계가 <strong>학습 단계</strong>, 아래쪽 두 단계가 <strong>추론 단계</strong>.
        </p>
      </div>

      {/* 분류 vs 회귀 */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">출력의 유형에 따른 구분 — 분류 vs 회귀</h3>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          지도학습이 다루는 문제는 목표 출력값의 유형에 따라 두 가지로 나뉨. 버튼을 눌러 비교.
        </p>
        <div className="mb-4 flex gap-2">
          {(Object.keys(compare) as CompareKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setCmp(k)}
              className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition-colors ${
                cmp === k
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-orange-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-orange-900/20"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.dl
            key={cmp}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {(
              [
                ["목표 출력값", compare[cmp].output],
                ["데이터 집합", compare[cmp].dataset],
                ["결과", compare[cmp].result],
                ["예", compare[cmp].example],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div key={k} className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                <dt className="text-xs text-gray-500 dark:text-gray-400">{k}</dt>
                <dd className={`mt-1 text-sm font-medium ${compare[cmp].tone}`}>{v}</dd>
              </div>
            ))}
          </motion.dl>
        </AnimatePresence>
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-700 dark:bg-amber-950">
          <ArrowRight size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-gray-700 dark:text-gray-200">
            분류의 클래스 레이블도 결국 값을 출력하는 것이므로, <strong>분류 문제는 회귀의 특별한 경우로 간주할 수 있음</strong>.
          </p>
        </div>
      </div>

      {/* 학습 목표와 오차함수 */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">학습 목표와 오차함수</h3>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          예측 오류를 최소화하는 최적의 회귀함수 y = f(x; θ)를 찾는 것.
        </p>
        <div className="overflow-x-auto rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex min-w-max items-center gap-3 font-mono text-sm text-gray-800 dark:text-gray-100">
            <span>E(D; θ) =</span>
            <span className="inline-flex flex-col items-center leading-tight">
              <span className="px-1">1</span>
              <span className="w-full border-t border-gray-500" />
              <span className="px-1">N</span>
            </span>
            <span className="inline-flex flex-col items-center text-[10px] leading-tight">
              <span className="text-lg leading-none">Σ</span>
              <span>(xᵢ, yᵢ) ∈ D</span>
            </span>
            <span>( yᵢ − f(xᵢ; θ) )²</span>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-orange-300 bg-orange-50 p-4 dark:border-orange-700 dark:bg-orange-950">
          <p className="text-sm text-gray-700 dark:text-gray-200">
            이 제곱오차를 최소화하는 매개변수를 찾는 방법을
            <strong className="mx-1 text-orange-700 dark:text-orange-300">최소제곱법</strong>
            또는
            <strong className="mx-1 text-orange-700 dark:text-orange-300">최소자승법</strong>
            <span className="font-mono text-xs text-gray-500">(least square method)</span>
            이라고 부름.
          </p>
        </div>
      </div>

      {/* 보간법과 회귀 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">보간법과 회귀</h3>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          데이터의 입력과 출력의 관계를 가장 잘 표현하는 직선 / 곡선을 찾는 경우 — 같은 데이터에 두 방법을 적용해 비교.
        </p>
        <InterpolationVsRegression />
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950">
          <Quote size={18} className="mt-0.5 shrink-0 text-orange-500" />
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              &ldquo;회귀&rdquo; → &ldquo;데이터의 경향을 일종의 평균과 같은 값으로 되돌려준다&rdquo;
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              회귀(regression)라는 단어는 원래 자리로 돌아오다라는 뜻. 회귀에서 알고 싶은 것은 개별 점이 아니라 데이터의
              전체적인 경향이므로, 그 경향을 보여 줄 수 있는 입출력 관계이면 충분함.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
