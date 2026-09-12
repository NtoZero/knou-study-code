"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { BadgeCheck, Play, RotateCcw, Square } from "lucide-react";

/* ------------------------------------------------------------------ */
/* 데이터와 수치 계산                                                    */
/* ------------------------------------------------------------------ */

type BinPt = { x: number; y: 0 | 1 };

/** yᵢ ∈ {0, 1} 인 이진 분류 데이터. y = 0 이면 C1, y = 1 이면 C2 */
const BIN_DATA: BinPt[] = [
  { x: -3.0, y: 0 },
  { x: -2.4, y: 0 },
  { x: -1.8, y: 0 },
  { x: -1.2, y: 0 },
  { x: -0.6, y: 1 },
  { x: 0.4, y: 0 },
  { x: 0.9, y: 1 },
  { x: 1.5, y: 1 },
  { x: 2.2, y: 1 },
  { x: 3.0, y: 1 },
];

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

function logLikelihood(m: number, b: number) {
  const eps = 1e-12;
  return BIN_DATA.reduce((s, p) => {
    const q = sigmoid(m * p.x + b);
    return s + p.y * Math.log(q + eps) + (1 - p.y) * Math.log(1 - q + eps);
  }, 0);
}

function gradient(m: number, b: number) {
  let gm = 0;
  let gb = 0;
  BIN_DATA.forEach((p) => {
    const q = sigmoid(m * p.x + b);
    gm += (p.y - q) * p.x;
    gb += p.y - q;
  });
  return { gm, gb };
}

const M_MIN = 0;
const M_MAX = 8;
const B_MIN = -5;
const B_MAX = 5;

const clampM = (v: number) => Math.min(M_MAX, Math.max(M_MIN, v));
const clampB = (v: number) => Math.min(B_MAX, Math.max(B_MIN, v));

const PRESETS = [
  { label: "m = 2, b = 1", m: 2, b: 1 },
  { label: "m = 1, b = 1", m: 1, b: 1 },
  { label: "m = 0.5, b = 0.5", m: 0.5, b: 0.5 },
];

/* ------------------------------------------------------------------ */

export default function LogisticRegressionLab() {
  const [m, setM] = useState(1);
  const [b, setB] = useState(1);
  const [xProbe, setXProbe] = useState(-0.5);
  const [showLinear, setShowLinear] = useState(false);
  const [running, setRunning] = useState(false);
  const iterRef = useRef(0);
  const [iter, setIter] = useState(0);

  /** 최대우도 해 — 경사상승을 충분히 반복해 얻은 기준값 */
  const optimum = useMemo(() => {
    let om = 0.5;
    let ob = 0;
    for (let i = 0; i < 6000; i += 1) {
      const { gm, gb } = gradient(om, ob);
      om += 0.05 * gm;
      ob += 0.05 * gb;
    }
    return { m: clampM(om), b: clampB(ob), l: logLikelihood(om, ob) };
  }, []);

  /** 이진 데이터에 그대로 선형회귀를 적용했을 때의 직선 */
  const linearFit = useMemo(() => {
    const n = BIN_DATA.length;
    const sx = BIN_DATA.reduce((s, p) => s + p.x, 0);
    const sy = BIN_DATA.reduce((s, p) => s + p.y, 0);
    const sxy = BIN_DATA.reduce((s, p) => s + p.x * p.y, 0);
    const sxx = BIN_DATA.reduce((s, p) => s + p.x * p.x, 0);
    const w1 = (n * sxy - sx * sy) / (n * sxx - sx * sx);
    const w0 = sy / n - (w1 * sx) / n;
    return { w1, w0 };
  }, []);

  const ll = useMemo(() => logLikelihood(m, b), [m, b]);
  const nearOptimum = ll >= optimum.l - 0.05;

  /* 자동 추정 — 수치적 최적화(경사상승)를 애니메이션으로 */
  const mRef = useRef(m);
  const bRef = useRef(b);
  mRef.current = m;
  bRef.current = b;

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      const { gm, gb } = gradient(mRef.current, bRef.current);
      const nextM = clampM(mRef.current + 0.06 * gm);
      const nextB = clampB(bRef.current + 0.06 * gb);
      mRef.current = nextM;
      bRef.current = nextB;
      setM(nextM);
      setB(nextB);
      iterRef.current += 1;
      setIter(iterRef.current);
      if (iterRef.current >= 300 || Math.abs(gm) + Math.abs(gb) < 0.01) setRunning(false);
    }, 40);
    return () => clearInterval(t);
  }, [running]);

  const probe = useMemo(() => {
    const z = m * xProbe + b;
    const p = sigmoid(z);
    const odds = p >= 1 ? Infinity : p / (1 - p);
    return { z, p, odds, logit: z };
  }, [m, b, xProbe]);

  const inC2 = probe.z > 0;
  const boundary = m !== 0 ? -b / m : null;

  /* ---------------------------- 차트 좌표 ---------------------------- */
  const W = 440;
  const H = 250;
  const PL = 40;
  const PR = 14;
  const PT = 16;
  const PB = 32;
  const XMIN = -5;
  const XMAX = 5;
  const sx = (x: number) => PL + ((x - XMIN) / (XMAX - XMIN)) * (W - PL - PR);
  const sy = (y: number) => H - PB - y * (H - PT - PB);

  const curve = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 160; i += 1) {
      const x = XMIN + ((XMAX - XMIN) * i) / 160;
      pts.push(`${sx(x).toFixed(1)},${sy(sigmoid(m * x + b)).toFixed(1)}`);
    }
    return pts.join(" ");
  }, [m, b]);

  /* -------------------- 오즈비 / 로짓 비교 차트 -------------------- */
  const CW = 210;
  const CH = 170;
  const cpl = 34;
  const cpb = 26;

  const oddsPath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 1; i <= 95; i += 1) {
      const p = i / 100;
      const o = Math.min(10, p / (1 - p));
      const x = cpl + p * (CW - cpl - 10);
      const y = CH - cpb - (o / 10) * (CH - cpb - 14);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  }, []);

  const logitPath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 1; i <= 99; i += 1) {
      const p = i / 100;
      const lg = Math.min(5, Math.max(-5, Math.log(p / (1 - p))));
      const x = cpl + p * (CW - cpl - 10);
      const y = CH / 2 - (lg / 5) * ((CH - cpb - 14) / 2);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  }, []);

  return (
    <section>
      <SectionTitle
        title="06. 로지스틱 회귀"
        subtitle="선형회귀의 종속변수(출력)를 범주형으로 확장하여 분류 문제에 적용"
      />

      {/* 개념 */}
      <div className="mb-8 rounded-xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-800 dark:bg-orange-950">
        <p className="text-sm text-gray-700 dark:text-gray-200">
          로지스틱 회귀는 선형회귀분석의 <strong>종속변수(출력)를 범주형으로 확장</strong>한 것. 여기서 범주는 클래스를 뜻하며,
          출력이 실수값이 아니라 클래스 레이블이 되므로 <strong>분류 문제에 적용 가능</strong>.
        </p>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
          입력값이 각 클래스에 속하는 <strong>확률값을 회귀분석으로 예측</strong>하는 방법.
        </p>
      </div>

      {/* 왜 S자인가 + m, b 조절 */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">
          왜 직선이 아니라 S자 곡선인가
        </h3>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          y = 1(빨강)과 y = 0(초록)만 있는 이진 분류 데이터. 선형회귀 직선을 겹쳐 보면 매핑 관계가 어색함을 확인할 수 있음.
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setM(p.m);
                setB(p.b);
                setRunning(false);
              }}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                Math.abs(m - p.m) < 1e-9 && Math.abs(b - p.b) < 1e-9
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-orange-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-orange-900/20"
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setShowLinear((v) => !v)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {showLinear ? "선형회귀 직선 숨기기" : "선형회귀 직선 보기"}
          </button>
        </div>

        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="로지스틱 곡선과 이진 분류 데이터">
            <line x1={PL} y1={sy(0)} x2={W - 6} y2={sy(0)} stroke="currentColor" className="text-gray-300 dark:text-gray-600" />
            <line x1={PL} y1={PT} x2={PL} y2={sy(0)} stroke="currentColor" className="text-gray-300 dark:text-gray-600" />
            {[0, 0.5, 1].map((v) => (
              <g key={v}>
                <line x1={PL} y1={sy(v)} x2={W - 6} y2={sy(v)} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeDasharray={v === 0.5 ? "4 3" : undefined} />
                <text x={PL - 6} y={sy(v) + 4} fontSize="9" textAnchor="end" fill="currentColor" className="text-gray-400">
                  {v}
                </text>
              </g>
            ))}
            {[-4, -2, 0, 2, 4].map((v) => (
              <text key={v} x={sx(v)} y={H - PB + 14} fontSize="9" textAnchor="middle" fill="currentColor" className="text-gray-400">
                {v}
              </text>
            ))}
            <text x={W - 14} y={sy(0) - 6} fontSize="10" fill="currentColor" className="text-gray-400">x</text>

            {/* 결정경계 */}
            {boundary !== null && boundary > XMIN && boundary < XMAX && (
              <g>
                <line x1={sx(boundary)} y1={PT} x2={sx(boundary)} y2={sy(0)} stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="5 4" />
                <text
                  x={sx(boundary) + (sx(boundary) > W - 70 ? -4 : 4)}
                  y={PT + 10}
                  fontSize="9"
                  textAnchor={sx(boundary) > W - 70 ? "end" : "start"}
                  fill="#8b5cf6"
                  fontWeight="bold"
                >
                  mx + b = 0
                </text>
              </g>
            )}

            {/* 선형회귀 직선 */}
            {showLinear && (
              <line
                x1={sx(XMIN)}
                y1={sy(linearFit.w1 * XMIN + linearFit.w0)}
                x2={sx(XMAX)}
                y2={sy(linearFit.w1 * XMAX + linearFit.w0)}
                stroke="#64748b"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
            )}

            {/* 로지스틱 곡선 */}
            <polyline points={curve} fill="none" stroke="#f97316" strokeWidth="2.5" />

            {/* 데이터 점 */}
            {BIN_DATA.map((p) => (
              <circle
                key={p.x}
                cx={sx(p.x)}
                cy={sy(p.y)}
                r="5"
                fill={p.y === 1 ? "#ef4444" : "#10b981"}
                opacity={0.85}
              />
            ))}

            {/* 프로브 */}
            <line x1={sx(xProbe)} y1={PT} x2={sx(xProbe)} y2={sy(0)} stroke="#d946ef" strokeWidth="1.2" />
            <circle cx={sx(xProbe)} cy={sy(probe.p)} r="6" fill="#fff" stroke="#d946ef" strokeWidth="2.5" />
          </svg>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-[#10b981]" /> y = 0 (C1)</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-[#ef4444]" /> y = 1 (C2)</span>
            <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-4 bg-[#f97316]" /> 로지스틱 곡선</span>
            {showLinear && <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-4 bg-[#64748b]" /> 선형회귀 직선</span>}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-300">
              <span>m (기울기)</span>
              <span className="font-mono text-orange-600 dark:text-orange-300">{m.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={M_MIN}
              max={M_MAX}
              step={0.05}
              value={m}
              onChange={(e) => {
                setRunning(false);
                setM(Number(e.target.value));
              }}
              className="mt-1 w-full accent-orange-500"
            />
          </label>
          <label className="block">
            <span className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-300">
              <span>b (절편)</span>
              <span className="font-mono text-orange-600 dark:text-orange-300">{b.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={B_MIN}
              max={B_MAX}
              step={0.05}
              value={b}
              onChange={(e) => {
                setRunning(false);
                setB(Number(e.target.value));
              }}
              className="mt-1 w-full accent-orange-500"
            />
          </label>
        </div>

        <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex min-w-max items-center gap-2 font-mono text-sm text-gray-800 dark:text-gray-100">
            <span>φ(x) =</span>
            <span className="inline-flex flex-col items-center leading-tight">
              <span className="px-1">1</span>
              <span className="w-full border-t border-gray-500" />
              <span className="px-1">1 + e⁻ˣ</span>
            </span>
            <span>=</span>
            <span className="inline-flex flex-col items-center leading-tight">
              <span className="px-1">eˣ</span>
              <span className="w-full border-t border-gray-500" />
              <span className="px-1">1 + eˣ</span>
            </span>
            <span className="ml-3 text-gray-400">|</span>
            <span className="ml-1">P(y = 1|x) = φ(mx + b) =</span>
            <span className="inline-flex flex-col items-center leading-tight text-orange-600 dark:text-orange-300">
              <span className="px-1">e^(mx+b)</span>
              <span className="w-full border-t border-orange-400" />
              <span className="px-1">1 + e^(mx+b)</span>
            </span>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          입력 x ∈ (−∞, ∞)를 항상 (0, 1) 범위로 매핑하는 S자 모양의 함수. 출력값을 클래스 레이블에 대한 사후확률
          P(y = 1|x)로 간주함.
        </p>
      </div>

      {/* 세 지표 동기화 패널 */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">
          사후확률 · 오즈비 · 로짓의 대응 관계
        </h3>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          x를 움직이면 세 지표가 동시에 갱신됨. 셋의 판정 결과는 항상 같음.
        </p>

        <label className="mb-4 block">
          <span className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-300">
            <span>입력 x</span>
            <span className="font-mono text-fuchsia-600 dark:text-fuchsia-300">{xProbe.toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.05}
            value={xProbe}
            onChange={(e) => setXProbe(Number(e.target.value))}
            className="mt-1 w-full accent-fuchsia-500"
          />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="사후확률 P(y = 1|x)"
            value={probe.p.toFixed(4)}
            rule={probe.p > 0.5 ? "> 0.5" : "≤ 0.5"}
            hot={inC2}
          />
          <MetricCard
            label="오즈비 odds"
            value={probe.odds > 999 ? "> 999" : probe.odds.toFixed(4)}
            rule={probe.odds > 1 ? "> 1" : "≤ 1"}
            hot={inC2}
          />
          <MetricCard
            label="로짓 logit(P)"
            value={probe.logit.toFixed(4)}
            rule={probe.logit > 0 ? "> 0" : "≤ 0"}
            hot={inC2}
          />
          <MetricCard label="mx + b" value={probe.z.toFixed(4)} rule={probe.z > 0 ? "> 0" : "≤ 0"} hot={inC2} />
        </div>

        <motion.div
          key={inC2 ? "c2" : "c1"}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mt-4 rounded-lg border-2 p-4 text-center ${
            inC2
              ? "border-rose-400 bg-rose-50 dark:border-rose-600 dark:bg-rose-950"
              : "border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950"
          }`}
        >
          <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
            판정: x = {xProbe.toFixed(2)} ∈ {inC2 ? "C2" : "C1"}
          </p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
            {inC2
              ? "사후확률 > 0.5, 오즈비 > 1, 로짓함수 > 0, mx + b > 0 → x ∈ C2"
              : "사후확률 ≤ 0.5, 오즈비 ≤ 1, 로짓함수 ≤ 0, mx + b ≤ 0 → x ∈ C1"}
          </p>
          {boundary !== null && (
            <p className="mt-1 font-mono text-xs text-violet-600 dark:text-violet-300">
              결정경계 logit(P) = mx + b = 0 → x = {boundary.toFixed(3)}
            </p>
          )}
        </motion.div>

        <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="min-w-max space-y-2 font-mono text-xs text-gray-800 dark:text-gray-100">
            <p>odds = P(y = 1|x) / (1 − P(y = 1|x)) = e^(mx+b)&nbsp;&nbsp;(0 ≤ odds ≤ ∞)</p>
            <p>logit(P) = log( P(y = 1|x) / (1 − P(y = 1|x)) ) = mx + b</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          오즈비(승산비)는 입력 x가 클래스 C1에 속할 확률과 C2에 속할 확률의 비율. P(y = 1|x)는 x가 C2에 속할 확률,
          1 − P(y = 1|x)는 C1에 속할 확률.
        </p>
      </div>

      {/* 오즈비 비대칭과 로짓 */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">
          오즈비는 왜 비대칭이고, 왜 로그를 취하는가
        </h3>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          두 곡선을 나란히 놓고 P = 0.5를 기준으로 좌우 모양을 비교.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 dark:border-rose-800 dark:bg-rose-950">
            <p className="mb-1 text-xs font-semibold text-rose-700 dark:text-rose-300">오즈비 P/(1−P) — 비대칭</p>
            <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full" role="img" aria-label="오즈비 곡선">
              <line x1={cpl} y1={CH - cpb} x2={CW - 6} y2={CH - cpb} stroke="currentColor" className="text-gray-300 dark:text-gray-600" />
              <line x1={cpl} y1={10} x2={cpl} y2={CH - cpb} stroke="currentColor" className="text-gray-300 dark:text-gray-600" />
              <line
                x1={cpl + 0.5 * (CW - cpl - 10)}
                y1={10}
                x2={cpl + 0.5 * (CW - cpl - 10)}
                y2={CH - cpb}
                stroke="#94a3b8"
                strokeDasharray="3 3"
              />
              <polyline points={oddsPath} fill="none" stroke="#e11d48" strokeWidth="2" />
              <text x={cpl - 5} y={CH - cpb + 4} fontSize="8" textAnchor="end" fill="currentColor" className="text-gray-400">0</text>
              <text x={cpl - 5} y={18} fontSize="8" textAnchor="end" fill="currentColor" className="text-gray-400">10</text>
              <text x={cpl + 0.5 * (CW - cpl - 10)} y={CH - cpb + 13} fontSize="8" textAnchor="middle" fill="currentColor" className="text-gray-400">P=0.5</text>
              <text x={CW - 8} y={CH - cpb + 13} fontSize="8" textAnchor="end" fill="currentColor" className="text-gray-400">P=1</text>
            </svg>
            <p className="mt-1 text-[11px] text-gray-600 dark:text-gray-300">
              확률이 커지면 무한대까지 가지만, 작아져도 0보다는 크거나 같음 → 양쪽의 증가폭이 서로 다름.
            </p>
          </div>
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-950">
            <p className="mb-1 text-xs font-semibold text-orange-700 dark:text-orange-300">로짓 log(P/(1−P)) — 대칭</p>
            <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full" role="img" aria-label="로짓 곡선">
              <line x1={cpl} y1={CH / 2} x2={CW - 6} y2={CH / 2} stroke="currentColor" className="text-gray-300 dark:text-gray-600" />
              <line x1={cpl} y1={10} x2={cpl} y2={CH - cpb} stroke="currentColor" className="text-gray-300 dark:text-gray-600" />
              <line
                x1={cpl + 0.5 * (CW - cpl - 10)}
                y1={10}
                x2={cpl + 0.5 * (CW - cpl - 10)}
                y2={CH - cpb}
                stroke="#94a3b8"
                strokeDasharray="3 3"
              />
              <polyline points={logitPath} fill="none" stroke="#f97316" strokeWidth="2" />
              <text x={cpl - 5} y={CH / 2 + 4} fontSize="8" textAnchor="end" fill="currentColor" className="text-gray-400">0</text>
              <text x={cpl + 0.5 * (CW - cpl - 10)} y={CH - cpb + 13} fontSize="8" textAnchor="middle" fill="currentColor" className="text-gray-400">P=0.5</text>
              <text x={cpl + 6} y={CH / 2 - 44} fontSize="8" fill="currentColor" className="text-gray-400">C2</text>
              <text x={cpl + 6} y={CH / 2 + 50} fontSize="8" fill="currentColor" className="text-gray-400">C1</text>
            </svg>
            <p className="mt-1 text-[11px] text-gray-600 dark:text-gray-300">
              오즈비에 로그를 취하면 P = 0.5를 기준으로 양쪽 모양이 대칭인 형태가 됨. 이것이 로짓 함수.
            </p>
          </div>
        </div>
      </div>

      {/* 매개변수 추정 */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-200">매개변수 m, b 추정</h3>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          데이터 D = {"{"}(xᵢ, yᵢ){"}"}ᵢ₌₁,⋯,ₙ, yᵢ ∈ {"{"}0, 1{"}"}. y = 0이면 C1, y = 1이면 C2.
        </p>

        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-200">베르누이 분포</p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              p(y|x)의 확률함수는 <strong>베르누이 분포</strong>(교재 3장 72쪽)를 따름. 확률실험의 시행 결과가 성공 / 실패 둘 중
              하나인 경우로, y = 1이 될 확률이 p이면 y = 0이 될 확률은 1 − p.
            </p>
            <div className="mt-2 overflow-x-auto">
              <p className="min-w-max font-mono text-xs text-gray-800 dark:text-gray-100">
                p(y|x) = {"{"}P(y = 1|x){"}"}^y {"{"}1 − P(y = 1|x){"}"}^(1−y)
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-200">새로운 목적함수 — 로그 우도</p>
            <div className="overflow-x-auto">
              <p className="min-w-max font-mono text-xs text-gray-800 dark:text-gray-100">
                l(m, b) = log Πᵢ₌₁ᴺ p(yᵢ|xᵢ)
              </p>
              <p className="mt-1 min-w-max font-mono text-xs text-gray-800 dark:text-gray-100">
                = Σᵢ [ yᵢ log( e^(mxᵢ+b) / (1 + e^(mxᵢ+b)) ) + (1 − yᵢ) log( 1 − e^(mxᵢ+b) / (1 + e^(mxᵢ+b)) ) ]
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
              출력값은 0과 1이라는 클래스 레이블인데 계산되는 것은 확률값이므로, 제곱오차 대신 새로운 형태의 목적함수가 필요.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div
            className={`rounded-lg border-2 p-4 text-center transition-colors ${
              nearOptimum
                ? "border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950"
                : "border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-950"
            }`}
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">현재 m, b에 대한 로그 우도 l(m, b)</p>
            <p className="mt-1 font-mono text-2xl font-bold text-gray-800 dark:text-gray-100">{ll.toFixed(4)}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              최대우도 해의 값 {optimum.l.toFixed(4)} (m ≈ {optimum.m.toFixed(2)}, b ≈ {optimum.b.toFixed(2)})
            </p>
            {nearOptimum && (
              <p className="mt-2 flex items-center justify-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <BadgeCheck size={15} /> 최대우도 해에 도달
              </p>
            )}
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <motion.div
                className="h-full bg-orange-500"
                animate={{
                  width: `${Math.min(100, Math.max(0, (1 - (optimum.l - ll) / Math.abs(optimum.l * 2)) * 100))}%`,
                }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
              슬라이더로 m, b를 조절해 로그 우도를 최대로 만들어 볼 것. 로그 우도는 항상 음수이며 0에 가까울수록 큼.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-200">최대우도 추정법</p>
            <div className="overflow-x-auto">
              <p className="min-w-max font-mono text-sm text-gray-800 dark:text-gray-100">
                ∂l(m, b)/∂m = 0,&nbsp;&nbsp; ∂l(m, b)/∂b = 0
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
              목적함수 l(m, b)는 매우 복잡한 비선형 함수이므로 한 번의 계산으로 값을 구할 수 없음.
              <strong> 수치적 최적화 방법으로 반복적인 추정</strong>을 통해 최적화함.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  if (running) {
                    setRunning(false);
                    return;
                  }
                  iterRef.current = 0;
                  setIter(0);
                  setRunning(true);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600"
              >
                {running ? <Square size={13} /> : <Play size={13} />}
                {running ? "정지" : "자동 추정 (반복적 추정)"}
              </button>
              <button
                onClick={() => {
                  setRunning(false);
                  setM(1);
                  setB(1);
                  iterRef.current = 0;
                  setIter(0);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <RotateCcw size={13} /> 초기화
              </button>
              <span className="font-mono text-xs text-gray-500 dark:text-gray-400">반복 {iter}회</span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950">
          <p className="mb-2 text-xs font-semibold text-violet-700 dark:text-violet-300">
            파라미터 추정 후 새로운 데이터 x_new의 분류 과정
          </p>
          <div className="overflow-x-auto">
            <p className="min-w-max font-mono text-sm text-gray-800 dark:text-gray-100">
              x_new ∈ C1 if m·x_new + b ≤ 0&nbsp;&nbsp;/&nbsp;&nbsp;x_new ∈ C2 if m·x_new + b &gt; 0
            </p>
          </div>
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
            로지스틱 회귀는 선형회귀를 분류 문제에 적용할 수 있도록 확장한 형태.
          </p>
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  rule,
  hot,
}: {
  label: string;
  value: string;
  rule: string;
  hot: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        hot
          ? "border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950"
          : "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950"
      }`}
    >
      <p className="text-[11px] text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 font-mono text-lg font-bold text-gray-800 dark:text-gray-100">{value}</p>
      <p
        className={`mt-0.5 font-mono text-xs font-semibold ${
          hot ? "text-rose-600 dark:text-rose-300" : "text-emerald-600 dark:text-emerald-300"
        }`}
      >
        {rule} → {hot ? "C2" : "C1"}
      </p>
    </div>
  );
}
