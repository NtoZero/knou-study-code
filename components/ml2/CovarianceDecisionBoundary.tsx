"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";

/* ---------- 2×2 행렬 계산 (직접 구현) ---------- */

type Mat2 = { a: number; b: number; c: number }; // [[a, b], [b, c]]

function det2(m: Mat2): number {
  return m.a * m.c - m.b * m.b;
}

/** (x − μ)ᵀ Σ⁻¹ (x − μ) */
function mahalanobisSq(dx: number, dy: number, m: Mat2): number {
  const d = det2(m);
  if (Math.abs(d) < 1e-9) return Number.POSITIVE_INFINITY;
  // Σ⁻¹ = (1/det)[[c, −b], [−b, a]]
  const ix = (m.c * dx - m.b * dy) / d;
  const iy = (-m.b * dx + m.a * dy) / d;
  return dx * ix + dy * iy;
}

/** 고윳값·회전각 → 등고선 타원 */
function ellipseGeometry(m: Mat2) {
  const half = (m.a + m.c) / 2;
  const diff = (m.a - m.c) / 2;
  const tmp = Math.sqrt(diff * diff + m.b * m.b);
  const l1 = Math.max(half + tmp, 1e-6);
  const l2 = Math.max(half - tmp, 1e-6);
  const theta = 0.5 * Math.atan2(2 * m.b, m.a - m.c);
  return { rx: Math.sqrt(l1), ry: Math.sqrt(l2), deg: (theta * 180) / Math.PI };
}

/* ---------- 캔버스 설정 ---------- */

const DOM_MIN = -2;
const DOM_MAX = 4;
const SIZE = 360;
const GRID = 84;

const COLOR1 = "#8b5cf6";
const COLOR2 = "#d946ef";

const cases = [
  {
    key: "unit",
    tab: "① 클래스 공통 단위 공분산행렬",
    cond: "Σᵢ = σ²I (i = 1, ⋯, M)",
    condNote: "모든 클래스의 공분산이 동일하며, 단위행렬의 상수배인 행렬을 가지는 경우",
    disc: "lᵢ(x) = −1/(2σ²)(x − μᵢ)ᵀ(x − μᵢ) − n ln σ + const",
    discNote: "n과 σ는 모든 클래스에 공통이므로 비교에서 사라짐",
    rule: "y(x) = argminᵢ (x − μᵢ)ᵀ(x − μᵢ)",
    name: "최소거리 분류기 (minimum distance classifier)",
    shape: "결정경계는 두 평균을 잇는 선분의 수직이등분선 — 직선",
  },
  {
    key: "shared",
    tab: "② 클래스 공통 공분산행렬",
    cond: "Σᵢ = Σ (타원형 형태의 데이터 분포)",
    condNote: "모든 클래스가 동일한 공분산을 갖지만, 그 형태가 일반적인 행렬이 되는 경우",
    disc: "lᵢ(x) = −½(x − μᵢ)ᵀΣᵢ⁻¹(x − μᵢ)",
    discNote: "ln|Σᵢ| 항이 모든 클래스에 공통이므로 비교에서 사라짐",
    rule: "y(x) = argminᵢ (x − μᵢ)ᵀΣᵢ⁻¹(x − μᵢ)",
    name: "마할라노비스 거리 (Mahalanobis distance)",
    shape: "결정경계는 여전히 직선",
  },
  {
    key: "general",
    tab: "③ 일반적인 공분산행렬",
    cond: "Σᵢ ≠ Σⱼ (서로 다른 타원형 형태의 데이터 분포)",
    condNote: "각 클래스의 공분산이 서로 다른 일반적인 형태를 가지는 경우",
    disc: "lᵢ(x) = −½(x − μᵢ)ᵀΣᵢ⁻¹(x − μᵢ) − ½ln|Σᵢ| + const",
    discNote: "ln|Σᵢ| 항이 클래스마다 달라 그대로 남음",
    rule: "y(x) = argminᵢ [(x − μᵢ)ᵀΣᵢ⁻¹(x − μᵢ) + ln|Σᵢ|]",
    name: "이차 판별함수",
    shape: "결정경계는 곡선",
  },
] as const;

type CaseKey = (typeof cases)[number]["key"];

const simplify = [
  {
    title: "공분산행렬 Σₖ가 모두 단위행렬로 동일한 경우",
    body: "(최소거리 분류기) x와 평균 μₖ와의 거리를 비교하여 가까운 쪽의 클래스로 할당.",
  },
  {
    title: "공분산행렬 Σₖ가 모두 동일하다고 가정한 경우",
    body: "(마할라노비스 거리) 하나의 Σ만 추정하여 평균과의 거리 계산에 활용.",
  },
  {
    title: "일반적인 경우",
    body: "공분산행렬이 동일하다고 볼 수 없으나, 계산이 간단하여 널리 사용됨.",
  },
];

export default function CovarianceDecisionBoundary() {
  const [caseKey, setCaseKey] = useState<CaseKey>("unit");
  const [mu1x, setMu1x] = useState(0.3);
  const [mu1y, setMu1y] = useState(0.4);
  const [mu2x, setMu2x] = useState(2.2);
  const [mu2y, setMu2y] = useState(2.1);
  const [sigma, setSigma] = useState(0.8); // ① 공통 σ
  const [sVarX, setSVarX] = useState(1.1); // ② 공통 Σ
  const [sVarY, setSVarY] = useState(0.35);
  const [sCorr, setSCorr] = useState(0.6);
  const [g1VarX, setG1VarX] = useState(0.9); // ③ 클래스별 Σ
  const [g1VarY, setG1VarY] = useState(0.25);
  const [g1Corr, setG1Corr] = useState(0.5);
  const [g2VarX, setG2VarX] = useState(1.3);
  const [g2VarY, setG2VarY] = useState(1.3);
  const [g2Corr, setG2Corr] = useState(-0.4);

  const activeCase = cases.find((c) => c.key === caseKey) ?? cases[0];

  const mats = useMemo<[Mat2, Mat2]>(() => {
    if (caseKey === "unit") {
      const v = sigma * sigma;
      return [
        { a: v, b: 0, c: v },
        { a: v, b: 0, c: v },
      ];
    }
    if (caseKey === "shared") {
      const cov = sCorr * Math.sqrt(sVarX * sVarY);
      const m = { a: sVarX, b: cov, c: sVarY };
      return [m, { ...m }];
    }
    return [
      { a: g1VarX, b: g1Corr * Math.sqrt(g1VarX * g1VarY), c: g1VarY },
      { a: g2VarX, b: g2Corr * Math.sqrt(g2VarX * g2VarY), c: g2VarY },
    ];
  }, [caseKey, sigma, sVarX, sVarY, sCorr, g1VarX, g1VarY, g1Corr, g2VarX, g2VarY, g2Corr]);

  /** 격자 위에서 판별함수를 계산해 결정영역 구간(run)과 경계 셀을 뽑는다 */
  const field = useMemo(() => {
    const [S1, S2] = mats;
    const ln1 = Math.log(Math.max(det2(S1), 1e-9));
    const ln2 = Math.log(Math.max(det2(S2), 1e-9));
    const step = (DOM_MAX - DOM_MIN) / GRID;

    const runs: { row: number; from: number; to: number; cls: number }[] = [];
    const edge: { row: number; col: number }[] = [];

    for (let r = 0; r < GRID; r++) {
      const yv = DOM_MIN + (r + 0.5) * step;
      let runStart = 0;
      let runCls = -1;
      for (let c = 0; c < GRID; c++) {
        const xv = DOM_MIN + (c + 0.5) * step;
        const d1 = mahalanobisSq(xv - mu1x, yv - mu1y, S1) + ln1;
        const d2 = mahalanobisSq(xv - mu2x, yv - mu2y, S2) + ln2;
        const cls = d1 <= d2 ? 0 : 1;
        if (c === 0) {
          runCls = cls;
          runStart = 0;
        } else if (cls !== runCls) {
          runs.push({ row: r, from: runStart, to: c, cls: runCls });
          edge.push({ row: r, col: c });
          runCls = cls;
          runStart = c;
        }
      }
      runs.push({ row: r, from: runStart, to: GRID, cls: runCls });
    }
    return { runs, edge, step };
  }, [mats, mu1x, mu1y, mu2x, mu2y]);

  const sc = (v: number) => ((v - DOM_MIN) / (DOM_MAX - DOM_MIN)) * SIZE;
  const scY = (v: number) => SIZE - sc(v);
  const unit = SIZE / (DOM_MAX - DOM_MIN);
  const cell = (field.step / (DOM_MAX - DOM_MIN)) * SIZE;

  const isDiagonal = caseKey === "shared" && Math.abs(sCorr) < 0.02;

  return (
    <section>
      <SectionTitle
        title="공분산행렬의 형태와 결정경계"
        subtitle="클래스별 확률밀도가 가우시안 분포를 따를 때 판별함수가 어떻게 달라지는가"
      />

      {/* 가우시안 확률밀도함수 */}
      <div className="mb-4 overflow-x-auto rounded-xl border border-gray-200 p-4 dark:border-gray-800">
        <p className="mb-2 text-xs font-medium text-gray-500">가우시안 분포의 확률밀도함수</p>
        <div className="flex min-w-max items-center gap-1 font-mono text-sm">
          <span>p(x|Cᵢ) = G(x; μᵢ, Σᵢ) =</span>
          <span className="inline-flex flex-col items-center leading-tight">
            <span className="border-b border-current px-1.5 pb-0.5">1</span>
            <span className="px-1.5 pt-0.5">√((2π)ⁿ|Σᵢ|)</span>
          </span>
          <span>· exp(−½(x − μᵢ)ᵀΣᵢ⁻¹(x − μᵢ))</span>
        </div>
        <div className="mt-3 space-y-1 border-t border-gray-100 pt-3 font-mono text-xs text-gray-600 dark:border-gray-800 dark:text-gray-400">
          <p>gᵢ(x) = p(x|Cᵢ)p(Cᵢ) — 사전확률 p(Cᵢ)가 모두 동일하다고 가정</p>
          <p>lᵢ(x) = ln gᵢ(x) = −½(x − μᵢ)ᵀΣᵢ⁻¹(x − μᵢ) − ½ln|Σᵢ| + const</p>
          <p>y(x) = argmaxᵢ lᵢ(x) = argminᵢ [(x − μᵢ)ᵀΣᵢ⁻¹(x − μᵢ) + ln|Σᵢ|]</p>
        </div>
      </div>

      {/* 케이스 탭 */}
      <div className="mb-4 flex flex-wrap gap-2">
        {cases.map((c) => (
          <button
            key={c.key}
            onClick={() => setCaseKey(c.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
              caseKey === c.key
                ? "bg-violet-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {c.tab}
          </button>
        ))}
      </div>

      <div className="mb-4 rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950">
        <p className="font-mono text-sm font-bold">{activeCase.cond}</p>
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{activeCase.condNote}</p>
        <div className="mt-3 space-y-1 overflow-x-auto">
          <p className="min-w-max font-mono text-xs">판별함수 {activeCase.disc}</p>
          <p className="text-[11px] text-gray-500">{activeCase.discNote}</p>
          <p className="min-w-max font-mono text-xs">결정규칙 {activeCase.rule}</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-violet-500 px-3 py-1 text-xs font-bold text-white">
            {activeCase.name}
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-violet-700 dark:bg-gray-900 dark:text-violet-300">
            {activeCase.shape}
          </span>
        </div>
        {isDiagonal && (
          <p className="mt-3 rounded-lg bg-white p-3 text-xs dark:bg-gray-900">
            지금처럼 공분산 Σ가 <span className="font-bold">대각행렬</span>이면 마할라노비스 거리는{" "}
            <span className="font-bold text-violet-600 dark:text-violet-400">
              정규화된 유클리디안 거리(normalized Euclidean distance)
            </span>
            가 됨 — 요소별로 표준편차 값으로 나누어 준 후 유클리디안 거리를 계산.
          </p>
        )}
      </div>

      {/* 캔버스 + 컨트롤 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <div className="rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full" role="img">
            {/* 결정영역 */}
            {field.runs.map((run, i) => (
              <rect
                key={i}
                x={run.from * cell}
                y={SIZE - (run.row + 1) * cell}
                width={(run.to - run.from) * cell}
                height={cell + 0.5}
                fill={run.cls === 0 ? COLOR1 : COLOR2}
                opacity={0.13}
              />
            ))}
            {/* 경계 셀 강조 */}
            {field.edge.map((e, i) => (
              <rect
                key={i}
                x={e.col * cell - cell * 0.5}
                y={SIZE - (e.row + 1) * cell}
                width={cell * 1.6}
                height={cell + 0.5}
                fill="#111827"
                opacity={0.55}
                className="dark:fill-gray-100"
              />
            ))}

            {/* 축 눈금 */}
            {[-2, -1, 0, 1, 2, 3, 4].map((t) => (
              <g key={t}>
                <line x1={sc(t)} y1={0} x2={sc(t)} y2={SIZE} stroke="#9ca3af" strokeWidth="0.4" opacity={0.4} />
                <line x1={0} y1={scY(t)} x2={SIZE} y2={scY(t)} stroke="#9ca3af" strokeWidth="0.4" opacity={0.4} />
                <text
                  x={Math.min(sc(t) + 3, SIZE - 9)}
                  y={SIZE - 4}
                  fontSize="9"
                  fill="#9ca3af"
                >
                  {t}
                </text>
                {t !== DOM_MIN && (
                  <text x={3} y={Math.max(scY(t) - 3, 9)} fontSize="9" fill="#9ca3af">
                    {t}
                  </text>
                )}
              </g>
            ))}

            {/* 등고선 (타원) */}
            {[
              { m: mats[0], mx: mu1x, my: mu1y, color: COLOR1, label: "μ₁" },
              { m: mats[1], mx: mu2x, my: mu2y, color: COLOR2, label: "μ₂" },
            ].map((g, gi) => {
              const geo = ellipseGeometry(g.m);
              return (
                <g key={gi} transform={`translate(${sc(g.mx)} ${scY(g.my)}) rotate(${-geo.deg})`}>
                  {[1, 2].map((k) => (
                    <ellipse
                      key={k}
                      rx={geo.rx * k * unit}
                      ry={geo.ry * k * unit}
                      fill="none"
                      stroke={g.color}
                      strokeWidth={k === 1 ? 2 : 1.2}
                      opacity={k === 1 ? 0.95 : 0.55}
                    />
                  ))}
                </g>
              );
            })}

            {/* 평균 */}
            {[
              { mx: mu1x, my: mu1y, color: COLOR1, label: "μ₁", cls: "C₁" },
              { mx: mu2x, my: mu2y, color: COLOR2, label: "μ₂", cls: "C₂" },
            ].map((g, gi) => (
              <g key={gi}>
                <circle cx={sc(g.mx)} cy={scY(g.my)} r="5" fill={g.color} stroke="#fff" strokeWidth="1.5" />
                <text
                  x={sc(g.mx) + 9}
                  y={scY(g.my) - 7}
                  fontSize="12"
                  fontWeight="bold"
                  fill={g.color}
                >
                  {g.label} ({g.cls})
                </text>
              </g>
            ))}
          </svg>
          <p className="px-2 pb-1 text-[11px] text-gray-400">
            진한 띠가 결정경계, 옅은 색이 각 클래스의 결정영역, 타원은 가우시안 확률밀도의 등고선.
          </p>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Num label="μ₁ x" value={mu1x} min={-1.5} max={3.5} step={0.05} onChange={setMu1x} accent="accent-violet-500" />
            <Num label="μ₁ y" value={mu1y} min={-1.5} max={3.5} step={0.05} onChange={setMu1y} accent="accent-violet-500" />
            <Num label="μ₂ x" value={mu2x} min={-1.5} max={3.5} step={0.05} onChange={setMu2x} accent="accent-fuchsia-500" />
            <Num label="μ₂ y" value={mu2y} min={-1.5} max={3.5} step={0.05} onChange={setMu2y} accent="accent-fuchsia-500" />
          </div>

          {caseKey === "unit" && (
            <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
              <p className="mb-2 text-xs font-medium text-gray-500">공통 σ (Σᵢ = σ²I)</p>
              <Num label="σ" value={sigma} min={0.3} max={1.6} step={0.02} onChange={setSigma} accent="accent-violet-500" />
              <p className="mt-2 text-[11px] text-gray-400">
                σ를 바꿔도 두 클래스에 공통이므로 결정경계(수직이등분선)는 움직이지 않음.
              </p>
            </div>
          )}

          {caseKey === "shared" && (
            <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
              <p className="mb-2 text-xs font-medium text-gray-500">공통 Σ (두 클래스가 같은 공분산)</p>
              <div className="space-y-2">
                <Num label="분산 σ²ₓ" value={sVarX} min={0.1} max={1.6} step={0.02} onChange={setSVarX} accent="accent-violet-500" />
                <Num label="분산 σ²ᵧ" value={sVarY} min={0.1} max={1.6} step={0.02} onChange={setSVarY} accent="accent-violet-500" />
                <Num label="상관 ρ" value={sCorr} min={-0.9} max={0.9} step={0.02} onChange={setSCorr} accent="accent-violet-500" />
              </div>
              <p className="mt-2 font-mono text-[11px] text-gray-400">
                Σ = [[{sVarX.toFixed(2)}, {(sCorr * Math.sqrt(sVarX * sVarY)).toFixed(2)}], [
                {(sCorr * Math.sqrt(sVarX * sVarY)).toFixed(2)}, {sVarY.toFixed(2)}]]
              </p>
            </div>
          )}

          {caseKey === "general" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-violet-200 p-3 dark:border-violet-800">
                <p className="mb-2 text-xs font-medium text-violet-600 dark:text-violet-400">Σ₁ (C₁)</p>
                <div className="space-y-2">
                  <Num label="분산 σ²ₓ" value={g1VarX} min={0.1} max={1.6} step={0.02} onChange={setG1VarX} accent="accent-violet-500" />
                  <Num label="분산 σ²ᵧ" value={g1VarY} min={0.1} max={1.6} step={0.02} onChange={setG1VarY} accent="accent-violet-500" />
                  <Num label="상관 ρ" value={g1Corr} min={-0.9} max={0.9} step={0.02} onChange={setG1Corr} accent="accent-violet-500" />
                </div>
                <p className="mt-2 font-mono text-[11px] text-gray-400">
                  ln|Σ₁| = {Math.log(Math.max(det2(mats[0]), 1e-9)).toFixed(3)}
                </p>
              </div>
              <div className="rounded-xl border border-fuchsia-200 p-3 dark:border-fuchsia-800">
                <p className="mb-2 text-xs font-medium text-fuchsia-600 dark:text-fuchsia-400">Σ₂ (C₂)</p>
                <div className="space-y-2">
                  <Num label="분산 σ²ₓ" value={g2VarX} min={0.1} max={1.6} step={0.02} onChange={setG2VarX} accent="accent-fuchsia-500" />
                  <Num label="분산 σ²ᵧ" value={g2VarY} min={0.1} max={1.6} step={0.02} onChange={setG2VarY} accent="accent-fuchsia-500" />
                  <Num label="상관 ρ" value={g2Corr} min={-0.9} max={0.9} step={0.02} onChange={setG2Corr} accent="accent-fuchsia-500" />
                </div>
                <p className="mt-2 font-mono text-[11px] text-gray-400">
                  ln|Σ₂| = {Math.log(Math.max(det2(mats[1]), 1e-9)).toFixed(3)}
                </p>
              </div>
              <p className="text-[11px] text-gray-500">
                결정경계가 곡선이 되는 것은 Σ₁⁻¹ ≠ Σ₂⁻¹ 이어서 이차항이 서로 상쇄되지 않기 때문. 여기에 더해 두 ln|Σᵢ| 값이 다르면 그 차이만큼 경계가 한쪽으로 밀려, 행렬식이 큰 클래스의 결정영역이 좁아짐.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 간소화 방법 */}
      <h3 className="mb-2 mt-8 text-base font-bold">가우시안 모델을 따르는 경우의 간소화 방법</h3>
      <div className="mb-3 overflow-x-auto rounded-xl border border-gray-200 p-4 dark:border-gray-800">
        <p className="min-w-max font-mono text-sm">
          p(x|Cₖ) ∝ 1/√(det Σₖ) · exp(−½(x − μₖ)ᵀΣₖ⁻¹(x − μₖ))
        </p>
        <p className="mt-2 text-xs text-gray-500">
          각 클래스의 평균 μₖ와 공분산행렬 Σₖ를 각각 추정해야 함.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {simplify.map((s) => (
          <div
            key={s.title}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <p className="text-xs font-bold text-violet-600 dark:text-violet-400">{s.title}</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Num({
  label,
  value,
  min,
  max,
  step,
  onChange,
  accent,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  accent: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium">{label}</span>
        <span className="font-mono text-xs text-gray-500">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`mt-1 w-full ${accent}`}
      />
    </div>
  );
}
