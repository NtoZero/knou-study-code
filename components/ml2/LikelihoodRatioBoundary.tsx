"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

/* ---------- 수치 계산 (직접 구현) ---------- */

function gaussian(x: number, mu: number, sigma: number): number {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

const X_MIN = -2;
const X_MAX = 12;
const SAMPLES = 420;

const W = 720;
const H = 300;
const PAD = { left: 44, right: 16, top: 18, bottom: 38 };
const PW = W - PAD.left - PAD.right;
const PH = H - PAD.top - PAD.bottom;

const COLORS = {
  c1: "#8b5cf6",
  c2: "#d946ef",
  c3: "#64748b",
};

const CLASS_NAMES = ["C₁", "C₂", "C₃"];

type Curve = { x: number; vals: number[] };

function buildSamples(params: { mu: number; sigma: number }[], priors: number[]): Curve[] {
  const out: Curve[] = [];
  for (let i = 0; i < SAMPLES; i++) {
    const x = X_MIN + ((X_MAX - X_MIN) * i) / (SAMPLES - 1);
    out.push({
      x,
      vals: params.map((p, k) => gaussian(x, p.mu, p.sigma) * priors[k]),
    });
  }
  return out;
}

function argmax(arr: number[]): number {
  let best = 0;
  for (let i = 1; i < arr.length; i++) if (arr[i] > arr[best]) best = i;
  return best;
}

/* ---------- 컴포넌트 ---------- */

export default function LikelihoodRatioBoundary() {
  const [multi, setMulti] = useState(false);
  const [mu1, setMu1] = useState(3);
  const [mu2, setMu2] = useState(7);
  const [mu3, setMu3] = useState(10);
  const [sigma1, setSigma1] = useState(1.2);
  const [sigma2, setSigma2] = useState(1.2);
  const [priorC1, setPriorC1] = useState(0.5);
  const [xNew, setXNew] = useState(5);

  const priors = useMemo(
    () => (multi ? [1 / 3, 1 / 3, 1 / 3] : [priorC1, 1 - priorC1]),
    [multi, priorC1]
  );

  const params = useMemo(
    () =>
      multi
        ? [
            { mu: mu1, sigma: 1.2 },
            { mu: mu2, sigma: 1.2 },
            { mu: mu3, sigma: 1.2 },
          ]
        : [
            { mu: mu1, sigma: sigma1 },
            { mu: mu2, sigma: sigma2 },
          ],
    [multi, mu1, mu2, mu3, sigma1, sigma2]
  );

  const model = useMemo(() => {
    const samples = buildSamples(params, priors);
    const rawDensity = samples.map((s) => s.vals.map((v, k) => v / priors[k]));
    const alpha = multi ? 1 : (1 - priorC1) / priorC1;

    // y 스케일: 원 밀도곡선과 α·p(x|C₂) 보조곡선을 함께 담되,
    // α가 크더라도 원 곡선이 납작해지지 않도록 보조곡선 기여를 제한
    let baseMax = 0;
    rawDensity.forEach((row) => {
      row.forEach((v) => {
        if (v > baseMax) baseMax = v;
      });
    });
    let yMax = baseMax;
    let scaledMax = 0;
    if (!multi) {
      scaledMax = Math.max(...rawDensity.map((row) => row[1] * alpha));
      yMax = Math.max(yMax, Math.min(scaledMax, baseMax * 2.2));
    }
    yMax *= 1.12;
    // α가 크면 점선 곡선의 봉우리가 그림 위쪽으로 벗어남 (교차점은 그림 안에 남음)
    const dashedClipped = !multi && scaledMax > yMax;

    const labels = samples.map((s) => argmax(s.vals));

    // 결정경계: 판별함수 우열이 바뀌는 지점
    const boundaries: { x: number; from: number; to: number }[] = [];
    for (let i = 1; i < labels.length; i++) {
      if (labels[i] !== labels[i - 1]) {
        boundaries.push({
          x: (samples[i].x + samples[i - 1].x) / 2,
          from: labels[i - 1],
          to: labels[i],
        });
      }
    }

    // 결정영역 구간
    const regions: { start: number; end: number; cls: number }[] = [];
    let segStart = samples[0].x;
    let segCls = labels[0];
    for (let i = 1; i < labels.length; i++) {
      if (labels[i] !== segCls) {
        regions.push({ start: segStart, end: samples[i].x, cls: segCls });
        segStart = samples[i].x;
        segCls = labels[i];
      }
    }
    regions.push({ start: segStart, end: samples[samples.length - 1].x, cls: segCls });

    const idxNew = Math.min(
      SAMPLES - 1,
      Math.max(0, Math.round(((xNew - X_MIN) / (X_MAX - X_MIN)) * (SAMPLES - 1)))
    );
    const decided = labels[idxNew];
    const gValues = samples[idxNew].vals;

    return {
      samples,
      rawDensity,
      yMax,
      labels,
      boundaries,
      regions,
      alpha,
      decided,
      gValues,
      dashedClipped,
    };
  }, [params, priors, multi, priorC1, xNew]);

  const sx = (x: number) => PAD.left + ((x - X_MIN) / (X_MAX - X_MIN)) * PW;
  const sy = (v: number) => PAD.top + PH - (v / model.yMax) * PH;

  const path = (getter: (i: number) => number) => {
    let d = "";
    for (let i = 0; i < SAMPLES; i++) {
      const px = sx(model.samples[i].x);
      const py = sy(getter(i));
      d += `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`;
    }
    return d;
  };

  const classCount = multi ? 3 : 2;
  const priorEqual = multi || Math.abs(priorC1 - 0.5) < 0.005;

  return (
    <section>
      <SectionTitle
        title="베이즈 분류기의 결정경계 &mdash; 1차원 데이터"
        subtitle="사전확률이 같은 경우와 다른 경우, 그리고 다중 클래스 문제"
      />

      {/* 모드 전환 */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setMulti(false)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            !multi
              ? "bg-violet-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          이진 클래스
        </button>
        <button
          onClick={() => setMulti(true)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            multi
              ? "bg-violet-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          다중 클래스 (3개)
        </button>
      </div>

      {/* 결정규칙 표시 */}
      <div className="mb-4 rounded-xl border border-violet-200 bg-violet-50 p-3 dark:border-violet-800 dark:bg-violet-950">
        {multi ? (
          <div className="space-y-1 font-mono text-xs">
            <p>판별함수 gᵢ(x) = p(x|Cᵢ)p(Cᵢ)</p>
            <p>결정규칙 y(x) = argmaxᵢ gᵢ(x)</p>
            <p className="text-gray-500">p(C₁) = p(C₂) = p(C₃) 인 경우</p>
          </div>
        ) : priorEqual ? (
          <div className="space-y-1 font-mono text-xs">
            <p>p(C₁) = p(C₂) 인 경우</p>
            <p>y(x) = 1 if p(x|C₁) &gt; p(x|C₂), &minus;1 otherwise</p>
            <p className="text-gray-500">결정경계 조건: p(x|C₁) = p(x|C₂)</p>
          </div>
        ) : (
          <div className="space-y-1 font-mono text-xs">
            <p>p(C₁) ≠ p(C₂) 인 경우</p>
            <p>y(x) = 1 if p(x|C₁)p(C₁) &gt; p(x|C₂)p(C₂), &minus;1 otherwise</p>
            <p className="text-gray-500">
              p(C₂) = α·p(C₁) 이므로 결정경계 조건: p(x|C₁) = α·p(x|C₂)
              {model.alpha > 1 && " (α > 1)"}
            </p>
          </div>
        )}
      </div>

      {/* 그래프 */}
      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
          {/* 결정영역 채색 */}
          {model.regions.map((r, i) => (
            <rect
              key={i}
              x={sx(r.start)}
              y={PAD.top}
              width={Math.max(0, sx(r.end) - sx(r.start))}
              height={PH}
              fill={[COLORS.c1, COLORS.c2, COLORS.c3][r.cls]}
              opacity={0.09}
            />
          ))}

          {/* 축 */}
          <line
            x1={PAD.left}
            y1={PAD.top + PH}
            x2={PAD.left + PW}
            y2={PAD.top + PH}
            stroke="#9ca3af"
            strokeWidth="1"
          />
          <line
            x1={PAD.left}
            y1={PAD.top}
            x2={PAD.left}
            y2={PAD.top + PH}
            stroke="#9ca3af"
            strokeWidth="1"
          />
          <text x={PAD.left + PW} y={PAD.top + PH + 26} textAnchor="end" fontSize="11" fill="#9ca3af">
            x
          </text>
          <text x={PAD.left - 6} y={PAD.top + 10} textAnchor="end" fontSize="11" fill="#9ca3af">
            p(x|C)
          </text>

          {/* α·p(x|C₂) 보조 곡선 */}
          {!multi && Math.abs(model.alpha - 1) > 0.02 && (
            <path
              d={path((i) => model.rawDensity[i][1] * model.alpha)}
              fill="none"
              stroke={COLORS.c2}
              strokeWidth="1.6"
              strokeDasharray="5 4"
              opacity={0.8}
            />
          )}

          {/* 밀도 곡선 */}
          {Array.from({ length: classCount }).map((_, k) => (
            <path
              key={k}
              d={path((i) => model.rawDensity[i][k])}
              fill="none"
              stroke={[COLORS.c1, COLORS.c2, COLORS.c3][k]}
              strokeWidth="2.2"
            />
          ))}

          {/* 결정경계 */}
          {model.boundaries.map((b, i) => (
            <g key={i}>
              <line
                x1={sx(b.x)}
                y1={PAD.top}
                x2={sx(b.x)}
                y2={PAD.top + PH}
                stroke="#111827"
                strokeWidth="1.6"
                strokeDasharray="4 3"
                className="dark:stroke-gray-200"
              />
              <text
                x={sx(b.x)}
                y={PAD.top - 5}
                textAnchor="middle"
                fontSize="10"
                fill="#6b7280"
              >
                결정경계 {b.x.toFixed(2)}
              </text>
            </g>
          ))}

          {/* 결정영역 라벨 */}
          {model.regions
            .filter((r) => sx(r.end) - sx(r.start) > 46)
            .map((r, i) => (
              <text
                key={i}
                x={(sx(r.start) + sx(r.end)) / 2}
                y={PAD.top + PH + 18}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill={[COLORS.c1, COLORS.c2, COLORS.c3][r.cls]}
              >
                결정영역 {r.cls + 1}
              </text>
            ))}

          {/* 테스트 데이터 x_new */}
          <line
            x1={sx(xNew)}
            y1={PAD.top}
            x2={sx(xNew)}
            y2={PAD.top + PH}
            stroke={[COLORS.c1, COLORS.c2, COLORS.c3][model.decided]}
            strokeWidth="2"
          />
          <circle
            cx={sx(xNew)}
            cy={PAD.top + PH}
            r="5"
            fill={[COLORS.c1, COLORS.c2, COLORS.c3][model.decided]}
          />
          <text
            x={sx(xNew)}
            y={PAD.top + PH - 6}
            textAnchor="middle"
            fontSize="11"
            fontWeight="bold"
            fill={[COLORS.c1, COLORS.c2, COLORS.c3][model.decided]}
          >
            x_new
          </text>

          {/* 평균 눈금 */}
          {params.map((p, k) => (
            <text
              key={k}
              x={sx(p.mu)}
              y={PAD.top + PH + 32}
              textAnchor="middle"
              fontSize="10"
              fill={[COLORS.c1, COLORS.c2, COLORS.c3][k]}
            >
              μ{["₁", "₂", "₃"][k]}
            </text>
          ))}
        </svg>
      </div>

      {/* 판정 결과 */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
        <span className="text-sm text-gray-500">x_new = {xNew.toFixed(2)} 의 판정</span>
        <motion.span
          key={model.decided}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-full px-3 py-1 text-sm font-bold text-white"
          style={{ backgroundColor: [COLORS.c1, COLORS.c2, COLORS.c3][model.decided] }}
        >
          결정영역 {model.decided + 1} &rarr; x ∈ {CLASS_NAMES[model.decided]}
        </motion.span>
        <span className="font-mono text-[11px] text-gray-400">
          {model.gValues
            .map((v, k) => `g${["₁", "₂", "₃"][k]} = ${v.toFixed(4)}`)
            .join("  /  ")}
        </span>
      </div>

      {/* 슬라이더 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Slider
          label="μ₁ (C₁의 평균)"
          value={mu1}
          min={0}
          max={11}
          step={0.1}
          onChange={setMu1}
          color="accent-violet-500"
        />
        <Slider
          label="μ₂ (C₂의 평균)"
          value={mu2}
          min={0}
          max={11}
          step={0.1}
          onChange={setMu2}
          color="accent-fuchsia-500"
        />
        {multi ? (
          <Slider
            label="μ₃ (C₃의 평균)"
            value={mu3}
            min={0}
            max={11}
            step={0.1}
            onChange={setMu3}
            color="accent-slate-500"
          />
        ) : (
          <>
            <Slider
              label="σ₁ (C₁의 표준편차)"
              value={sigma1}
              min={0.4}
              max={3}
              step={0.05}
              onChange={setSigma1}
              color="accent-violet-500"
            />
            <Slider
              label="σ₂ (C₂의 표준편차)"
              value={sigma2}
              min={0.4}
              max={3}
              step={0.05}
              onChange={setSigma2}
              color="accent-fuchsia-500"
            />
            <div>
              <Slider
                label="사전확률 p(C₁)"
                value={priorC1}
                min={0.05}
                max={0.95}
                step={0.01}
                onChange={setPriorC1}
                color="accent-violet-500"
              />
              <p className="mt-1 text-[11px] text-gray-400">
                p(C₂) = {(1 - priorC1).toFixed(2)} / α = p(C₂)/p(C₁) = {model.alpha.toFixed(2)}
                {Math.abs(model.alpha - 1) > 0.02 &&
                  " — 점선이 α·p(x|C₂) 곡선이며, 이 곡선과 p(x|C₁)의 교차점이 옮겨진 결정경계"}
                {model.dashedClipped &&
                  ". α가 커서 점선의 봉우리는 그림 위로 벗어나 있으나, 교차점은 그림 안에 그대로 있음"}
              </p>
            </div>
          </>
        )}
        <Slider
          label="테스트 데이터 x_new"
          value={xNew}
          min={X_MIN}
          max={X_MAX}
          step={0.05}
          onChange={setXNew}
          color="accent-slate-500"
        />
      </div>

      <div className="mt-6 rounded-xl border-l-4 border-violet-400 bg-violet-50 p-4 text-sm dark:bg-violet-950">
        <p className="font-bold">읽는 법</p>
        <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
          <li>· 사전확률이 같으면 결정경계는 두 확률밀도 곡선이 만나는 교차점 그 자체.</li>
          <li>
            · 사전확률이 다르면 조건이 p(x|C₁) = α·p(x|C₂)로 바뀌어, 사전확률이 큰 클래스 쪽으로 결정영역이 넓어짐.
          </li>
          <li>
            · 클래스가 3개면 판별함수 gᵢ(x) = p(x|Cᵢ)p(Cᵢ)가 가장 큰 구간이 각각의 결정영역이 되고, 경계가 두 개 생김.
          </li>
        </ul>
      </div>
    </section>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  color,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="font-mono text-sm text-gray-500">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`mt-2 w-full ${color}`}
      />
    </div>
  );
}
