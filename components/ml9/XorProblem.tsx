"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { LOGIC_SETS, clipLine, fmt, makeScale, step, type Frame } from "./nn";

const F: Frame = { xMin: -0.5, xMax: 1.6, yMin: -0.5, yMax: 1.6, width: 250, height: 250, pad: 28 };
const s = makeScale(F);

const XOR = LOGIC_SETS.XOR;

/** 위 두 슬라이더의 기본값 — 예로 보여 줄 직선을 고를 때 이 방향에 가까운 쪽을 택한다 */
const DEFAULT_DEG = 135;

/**
 * 모든 방향과 절편을 훑어 직선 하나로 줄일 수 있는 최소 오분류를 구한다.
 * 예로 보여 줄 직선은 그중에서도 아래 슬라이더로 그대로 만들어 볼 수 있는 값(절편 0.05 간격,
 * |w₀| ≤ 2) 가운데 고른다. 같은 오분류라면 네 점에서 가장 멀리 떨어진 쪽, 그래도 같으면
 * 화면에 처음 놓인 방향에 가까운 쪽 — 눈금에 간신히 걸친 직선이 예로 뽑히지 않게 한다.
 */
function scanSingleLine() {
  let best = 5;
  let bestMargin = -1;
  let bestTurn = 360;
  let arg = { deg: DEFAULT_DEG, w0: 0 };
  for (let deg = 0; deg < 360; deg += 1) {
    const t = (deg * Math.PI) / 180;
    const w1 = Math.cos(t);
    const w2 = Math.sin(t);
    /** 기본 방향에서 몇 도 돌려야 하는지 — 0°와 359°가 1° 차이가 되도록 */
    const turn = Math.min(Math.abs(deg - DEFAULT_DEG), 360 - Math.abs(deg - DEFAULT_DEG));
    for (let b = -300; b <= 300; b += 1) {
      const w0 = b / 100;
      let e = 0;
      let margin = Infinity;
      for (const d of XOR) {
        const u = w1 * d.x1 + w2 * d.x2 + w0;
        if (step(u) !== d.t) e += 1;
        margin = Math.min(margin, Math.abs(u));
      }
      if (e < best) {
        /* 더 적은 오분류를 찾으면 예시 후보는 처음부터 다시 고른다 */
        best = e;
        bestMargin = -1;
        bestTurn = 360;
        arg = { deg, w0 };
      }
      const onSlider = b % 5 === 0 && Math.abs(w0) <= 2;
      if (e !== best || !onSlider) continue;
      /* 여유는 소수점 오차만큼 다를 수 있으므로 그 차이는 같은 것으로 보고 방향으로 가른다 */
      if (margin > bestMargin + 1e-9) {
        bestMargin = margin;
        bestTurn = turn;
        arg = { deg, w0 };
      } else if (margin > bestMargin - 1e-9 && turn < bestTurn) {
        bestMargin = Math.max(bestMargin, margin);
        bestTurn = turn;
        arg = { deg, w0 };
      }
    }
  }
  return { best, arg, tried: 360 * 601 };
}

type Mode = "one" | "two";

export default function XorProblem() {
  const [mode, setMode] = useState<Mode>("one");
  const [deg, setDeg] = useState(135);
  const [off, setOff] = useState(-0.5);
  const [b1, setB1] = useState(0.5);
  const [b2, setB2] = useState(1.5);

  const scan = useMemo(scanSingleLine, []);

  /* ── 직선 하나 ── */
  const t = (deg * Math.PI) / 180;
  const w1 = Math.cos(t);
  const w2 = Math.sin(t);
  const oneLine = clipLine(w1, w2, off, F);
  const oneResults = XOR.map((d) => {
    const y = step(w1 * d.x1 + w2 * d.x2 + off);
    return { ...d, y, wrong: y !== d.t };
  });
  const oneErrs = oneResults.filter((r) => r.wrong).length;

  /* ── 직선 두 개 (은닉 노드 z₁, z₂) ── */
  const twoResults = XOR.map((d) => {
    const u1 = d.x1 + d.x2 - b1;
    const u2 = d.x1 + d.x2 - b2;
    const z1 = step(u1);
    const z2 = step(u2);
    const uo = z1 - z2 - 0.5;
    const y = step(uo);
    return { ...d, u1, u2, z1, z2, uo, y, wrong: y !== d.t };
  });
  const twoErrs = twoResults.filter((r) => r.wrong).length;
  const lineZ1 = clipLine(1, 1, -b1, F);
  const lineZ2 = clipLine(1, 1, -b2, F);

  /* 띠(두 직선 사이) 다각형 — 0.5 ≤ x₁ + x₂ ≤ 1.5 꼴 */
  const bandPts = (() => {
    const corners: [number, number][] = [
      [F.xMin, F.yMin],
      [F.xMax, F.yMin],
      [F.xMax, F.yMax],
      [F.xMin, F.yMax],
    ];
    const clip = (poly: [number, number][], h: (p: [number, number]) => number) => {
      const out: [number, number][] = [];
      for (let i = 0; i < poly.length; i += 1) {
        const p = poly[i];
        const q = poly[(i + 1) % poly.length];
        const hp = h(p);
        const hq = h(q);
        if (hp >= 0) out.push(p);
        if (hp >= 0 !== hq >= 0) {
          const k = hp / (hp - hq);
          out.push([p[0] + k * (q[0] - p[0]), p[1] + k * (q[1] - p[1])]);
        }
      }
      return out;
    };
    let poly = clip(corners, (p) => p[0] + p[1] - b1);
    if (poly.length < 3) return "";
    poly = clip(poly, (p) => b2 - (p[0] + p[1]));
    if (poly.length < 3) return "";
    return poly.map((p) => `${s.sx(p[0])},${s.sy(p[1])}`).join(" ");
  })();

  const axes = (
    <g>
      <line x1={s.sx(F.xMin)} y1={s.sy(0)} x2={s.sx(F.xMax)} y2={s.sy(0)} stroke="#cbd5e1" />
      <line x1={s.sx(0)} y1={s.sy(F.yMin)} x2={s.sx(0)} y2={s.sy(F.yMax)} stroke="#cbd5e1" />
      <text x={s.sx(0) - 6} y={s.sy(1) + 3} fontSize="9" textAnchor="end" fill="#94a3b8">
        1
      </text>
      <text x={s.sx(0) - 6} y={s.sy(0) + 12} fontSize="9" textAnchor="end" fill="#94a3b8">
        0
      </text>
      <text x={s.sx(1)} y={s.sy(0) + 13} fontSize="9" textAnchor="middle" fill="#94a3b8">
        1
      </text>
      <text x={F.width - 6} y={s.sy(0) - 5} fontSize="9" textAnchor="end" fill="#94a3b8">
        x₁
      </text>
      <text x={s.sx(0) + 6} y={14} fontSize="9" fill="#94a3b8">
        x₂
      </text>
    </g>
  );

  const dots = (res: { x1: number; x2: number; t: number; wrong: boolean }[]) =>
    res.map((r, i) => (
      <g key={i}>
        <circle
          cx={s.sx(r.x1)}
          cy={s.sy(r.x2)}
          r={8}
          fill={r.t === 1 ? "#ffffff" : "#c2410c"}
          stroke={r.wrong ? "#dc2626" : r.t === 1 ? "#334155" : "#c2410c"}
          strokeWidth={r.wrong ? 3.2 : 1.8}
        />
        {r.wrong && (
          <text x={s.sx(r.x1)} y={s.sy(r.x2) + 3.5} fontSize="10" fontWeight="bold" textAnchor="middle" fill="#dc2626">
            ×
          </text>
        )}
      </g>
    ));

  return (
    <section id="xor" className="scroll-mt-32">
      <SectionTitle
        title="퍼셉트론의 한계와 XOR 문제"
        subtitle="직선 하나로는 안 되고 둘이면 된다 — 모든 직선을 실제로 훑어 확인"
      />

      <Sourced
        refs={{
          textbook: "11.2.1 M-P 뉴런과 퍼셉트론 — XOR 문제",
          slides: "퍼셉트론의 한계",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">XOR 문제 (Minsky &amp; Papert)</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            패턴 분류 문제에 적용되는 퍼셉트론의 가장 큰 약점은{" "}
            <strong>선형 판별함수를 가진다는 점</strong>. 마빈 민스키(Marvin Minsky)와 시모어
            페퍼트(Seymour Papert)는 퍼셉트론이 가지는 이러한 한계에 대해 XOR 문제를 예로 들어 지적함. XOR
            문제는 두 개의 입력 노드와 하나의 출력 노드를 가지는 퍼셉트론이 XOR 논리 함수를 표현하도록
            학습하는 것. 그런데 이 퍼셉트론이 만드는 판별함수는 2차원 공간상 하나의 직선 z₁으로 나타나므로,
            직선 z₁만을 사용해서는 XOR와 같은 출력을 내도록 결정경계를 만드는 것이 불가능함.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-[280px] text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-left text-[11px] text-gray-500 dark:border-gray-700">
                  <th className="px-3 py-1.5">x₁</th>
                  <th className="px-3 py-1.5">x₂</th>
                  <th className="px-3 py-1.5">XOR 출력 t</th>
                  <th className="px-3 py-1.5">그림에서</th>
                </tr>
              </thead>
              <tbody>
                {XOR.map((d) => (
                  <tr key={`${d.x1}${d.x2}`} className="border-b border-gray-100 font-mono dark:border-gray-800">
                    <td className="px-3 py-1.5">{d.x1}</td>
                    <td className="px-3 py-1.5">{d.x2}</td>
                    <td className="px-3 py-1.5 font-bold">{d.t}</td>
                    <td className="px-3 py-1.5 text-gray-500">{d.t === 1 ? "○ 흰 점" : "● 주황 점"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">
            두 입력이 서로 다를 때만 1을 내는 함수. 같은 값이면 0.
          </p>
        </div>
      </Sourced>

      {/* ── 직선 실험 ── */}
      <Sourced
        refs={{
          textbook: "11.2.1 M-P 뉴런과 퍼셉트론 (그림 11-9)",
          slides: "퍼셉트론의 한계 — XOR 문제",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold">직선을 직접 그어 보기</h3>
            <div className="flex gap-1.5">
              {(
                [
                  ["one", "직선 1개 — 퍼셉트론"],
                  ["two", "직선 2개 — 다층 퍼셉트론"],
                ] as [Mode, string][]
              ).map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                    mode === m
                      ? "border-fuchsia-500 bg-fuchsia-500 text-white"
                      : "border-gray-200 bg-white text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-900"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,250px)_minmax(0,1fr)]">
            <div className="overflow-x-auto">
              <svg viewBox={`0 0 ${F.width} ${F.height}`} className="w-full min-w-[240px] rounded-lg border border-gray-100 dark:border-gray-800">
                <rect x={0} y={0} width={F.width} height={F.height} fill="#ffffff" />
                {mode === "two" && bandPts && <polygon points={bandPts} fill="#c026d3" opacity={0.14} />}
                {axes}
                {mode === "one"
                  ? oneLine && (
                      <line
                        x1={s.sx(oneLine[0][0])}
                        y1={s.sy(oneLine[0][1])}
                        x2={s.sx(oneLine[1][0])}
                        y2={s.sy(oneLine[1][1])}
                        stroke="#a21caf"
                        strokeWidth={2.4}
                      />
                    )
                  : (
                      <g>
                        {lineZ1 && (
                          <line
                            x1={s.sx(lineZ1[0][0])}
                            y1={s.sy(lineZ1[0][1])}
                            x2={s.sx(lineZ1[1][0])}
                            y2={s.sy(lineZ1[1][1])}
                            stroke="#2563eb"
                            strokeWidth={2.2}
                          />
                        )}
                        {lineZ2 && (
                          <line
                            x1={s.sx(lineZ2[0][0])}
                            y1={s.sy(lineZ2[0][1])}
                            x2={s.sx(lineZ2[1][0])}
                            y2={s.sy(lineZ2[1][1])}
                            stroke="#16a34a"
                            strokeWidth={2.2}
                          />
                        )}
                        <text x={s.sx(F.xMin) + 4} y={s.sy(b1 - F.xMin) - 5} fontSize="9" fill="#2563eb">
                          z₁
                        </text>
                        <text x={s.sx(F.xMax) - 10} y={s.sy(b2 - F.xMax) + 12} fontSize="9" textAnchor="end" fill="#16a34a">
                          z₂
                        </text>
                        <text x={s.sx(0.55)} y={s.sy(0.5)} fontSize="9" fontWeight="bold" fill="#86198f">
                          y = 1
                        </text>
                        <text x={s.sx(0.02)} y={s.sy(-0.3)} fontSize="9" fontWeight="bold" fill="#64748b">
                          y = 0
                        </text>
                        <text x={s.sx(1.2)} y={s.sy(1.25)} fontSize="9" fontWeight="bold" fill="#64748b">
                          y = 0
                        </text>
                      </g>
                    )}
                {dots(mode === "one" ? oneResults : twoResults)}
                <text x={8} y={F.height - 8} fontSize="8" fill="#64748b">
                  ○ t = 1 · ● t = 0 · × = 틀린 점
                </text>
              </svg>
            </div>

            <div>
              {mode === "one" ? (
                <>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 text-xs">
                      <span className="w-20 shrink-0 font-semibold">기울기 방향</span>
                      <input
                        type="range"
                        min={0}
                        max={359}
                        step={1}
                        value={deg}
                        onChange={(e) => setDeg(Number(e.target.value))}
                        className="min-w-0 flex-1 accent-fuchsia-600"
                      />
                      <span className="w-12 shrink-0 text-right font-mono">{deg}°</span>
                    </label>
                    <label className="flex items-center gap-3 text-xs">
                      <span className="w-20 shrink-0 font-semibold">절편 w₀</span>
                      <input
                        type="range"
                        min={-2}
                        max={2}
                        step={0.05}
                        value={off}
                        onChange={(e) => setOff(Number(e.target.value))}
                        className="min-w-0 flex-1 accent-fuchsia-600"
                      />
                      <span className="w-12 shrink-0 text-right font-mono">{fmt(off, 2)}</span>
                    </label>
                  </div>
                  <div className="mt-3 overflow-x-auto rounded-lg bg-gray-50 p-3 font-mono text-[11px] leading-6 dark:bg-gray-800/60">
                    <p className="min-w-[300px]">
                      g(x) = {fmt(w1, 2)}x₁ + {fmt(w2, 2)}x₂ + {fmt(off, 2)}
                    </p>
                    {oneResults.map((r) => (
                      <p key={`${r.x1}${r.x2}`} className={`min-w-[300px] ${r.wrong ? "text-rose-600 dark:text-rose-400" : ""}`}>
                        ({r.x1}, {r.x2}) → g = {fmt(w1 * r.x1 + w2 * r.x2 + off, 2)} → y = {r.y}, t = {r.t}{" "}
                        {r.wrong ? "✗" : "✓"}
                      </p>
                    ))}
                  </div>
                  <div className="mt-3 rounded-lg bg-rose-50 p-3 dark:bg-rose-950/30">
                    <p className="text-sm font-bold text-rose-700 dark:text-rose-300">
                      지금 오분류 {oneErrs}개
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-rose-800 dark:text-rose-200">
                      방향 360가지 × 절편 601가지, 모두 {scan.tried.toLocaleString()}개의 직선을 전부 시험해
                      보아도 <strong>최소 오분류는 {scan.best}개</strong>(예: 방향 {scan.arg.deg}°, w₀ ={" "}
                      {fmt(scan.arg.w0, 2)}). 네 점을 모두 맞히는 직선은 존재하지 않음 — 이것이 퍼셉트론이
                      XOR를 해결할 수 없다는 뜻.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                    두 개의 직선을 결합해 사용하면 해결됨. 은닉 노드 z₁, z₂가 각각 하나의 직선을 만들고,
                    출력 노드가 두 결과를 결합해 띠 안쪽만 1로 만듦.
                  </p>
                  <p className="mt-2 rounded-lg bg-slate-100 p-2.5 text-[11px] leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                    아래 가중치(두 경계의 위치와 출력 노드의 z₁ − z₂ − 0.5)는 그림 11-9(b)의 띠와 (c)의 구조를
                    숫자로 옮겨 본 예시이며, 원문에 수치로 제시된 값은 아님. 경계를 움직여 보면 띠가 (0,1)과
                    (1,0)만 품어야 오분류가 0이 된다는 점을 확인할 수 있음.
                  </p>
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center gap-3 text-xs">
                      <span className="w-28 shrink-0 font-semibold text-blue-700 dark:text-blue-300">
                        z₁ 경계 x₁+x₂ =
                      </span>
                      <input
                        type="range"
                        min={0.1}
                        max={1.4}
                        step={0.1}
                        value={b1}
                        onChange={(e) => setB1(Number(e.target.value))}
                        className="min-w-0 flex-1 accent-blue-600"
                      />
                      <span className="w-10 shrink-0 text-right font-mono">{fmt(b1, 1)}</span>
                    </label>
                    <label className="flex items-center gap-3 text-xs">
                      <span className="w-28 shrink-0 font-semibold text-emerald-700 dark:text-emerald-300">
                        z₂ 경계 x₁+x₂ =
                      </span>
                      <input
                        type="range"
                        min={0.6}
                        max={2.2}
                        step={0.1}
                        value={b2}
                        onChange={(e) => setB2(Number(e.target.value))}
                        className="min-w-0 flex-1 accent-emerald-600"
                      />
                      <span className="w-10 shrink-0 text-right font-mono">{fmt(b2, 1)}</span>
                    </label>
                  </div>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full min-w-[380px] text-[11px]">
                      <thead>
                        <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                          <th className="py-1.5 pr-2">x₁, x₂</th>
                          <th className="py-1.5 pr-2">u₁ = x₁+x₂−{fmt(b1, 1)}</th>
                          <th className="py-1.5 pr-2">z₁</th>
                          <th className="py-1.5 pr-2">u₂ = x₁+x₂−{fmt(b2, 1)}</th>
                          <th className="py-1.5 pr-2">z₂</th>
                          <th className="py-1.5 pr-2">y = φ(z₁−z₂−0.5)</th>
                          <th className="py-1.5">t</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono">
                        {twoResults.map((r) => (
                          <tr
                            key={`${r.x1}${r.x2}`}
                            className={`border-b border-gray-100 dark:border-gray-800 ${
                              r.wrong ? "text-rose-600 dark:text-rose-400" : ""
                            }`}
                          >
                            <td className="py-1.5 pr-2">
                              {r.x1}, {r.x2}
                            </td>
                            <td className="py-1.5 pr-2">{fmt(r.u1, 1)}</td>
                            <td className="py-1.5 pr-2 font-bold">{r.z1}</td>
                            <td className="py-1.5 pr-2">{fmt(r.u2, 1)}</td>
                            <td className="py-1.5 pr-2 font-bold">{r.z2}</td>
                            <td className="py-1.5 pr-2 font-bold">{r.y}</td>
                            <td className="py-1.5">{r.t}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div
                    className={`mt-3 rounded-lg p-3 text-xs leading-relaxed ${
                      twoErrs === 0
                        ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                        : "bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-200"
                    }`}
                  >
                    {twoErrs === 0 ? (
                      <>
                        <strong>오분류 0개</strong> — 두 직선 사이의 띠에만 (0,1)과 (1,0)이 들어가고, (0,0)과
                        (1,1)은 띠 바깥에 놓임. 이처럼 비선형 결정경계를 만들기 위하여 은닉층을 추가한
                        신경망이 <strong>다층 퍼셉트론</strong>.
                      </>
                    ) : (
                      <>
                        <strong>오분류 {twoErrs}개</strong> — 두 경계가 (0,1)·(1,0)만 사이에 두도록 놓이지
                        않음. z₁ 경계를 0과 1 사이, z₂ 경계를 1과 2 사이로 두면 맞음.
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Sourced>

      {/* ── 은닉층을 가진 구조 ── */}
      <Sourced
        refs={{
          textbook: "11.2.1 M-P 뉴런과 퍼셉트론 (그림 11-9(c))",
          slides: "퍼셉트론의 한계 — 다층 퍼셉트론",
          lecture: "구조가 필요하다는 것은 당시에도 알았지만 은닉 노드의 목표 출력값이 없어 가중치를 어떻게 고칠지 몰랐고, 그 학습 방법이 1980년대 오류 역전파로 나왔다는 흐름을 짚음",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">두 직선을 만들려면 은닉층이 필요하다</h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
            <div className="overflow-x-auto">
              <svg viewBox="0 0 220 180" className="w-full min-w-[200px] rounded-lg border border-gray-100 dark:border-gray-800">
                <rect x={0} y={0} width={220} height={180} fill="#ffffff" />
                {/* 퍼셉트론 */}
                <text x={55} y={16} fontSize="9" textAnchor="middle" fill="#64748b">
                  퍼셉트론
                </text>
                <line x1={32} y1={120} x2={55} y2={60} stroke="#cbd5e1" strokeWidth={1.4} />
                <line x1={78} y1={120} x2={55} y2={60} stroke="#cbd5e1" strokeWidth={1.4} />
                <circle cx={55} cy={60} r={12} fill="#fae8ff" stroke="#a21caf" strokeWidth={1.4} />
                <text x={55} y={64} fontSize="9" textAnchor="middle" fill="#86198f">
                  z₁
                </text>
                <circle cx={32} cy={132} r={11} fill="#dbeafe" stroke="#2563eb" strokeWidth={1.3} />
                <text x={32} y={136} fontSize="9" textAnchor="middle" fill="#1e3a8a">
                  x₁
                </text>
                <circle cx={78} cy={132} r={11} fill="#dbeafe" stroke="#2563eb" strokeWidth={1.3} />
                <text x={78} y={136} fontSize="9" textAnchor="middle" fill="#1e3a8a">
                  x₂
                </text>
                <text x={36} y={95} fontSize="8" fill="#64748b">
                  w₁
                </text>
                <text x={70} y={95} fontSize="8" fill="#64748b">
                  w₂
                </text>
                <text x={55} y={162} fontSize="8" textAnchor="middle" fill="#dc2626">
                  직선 1개 → 불가
                </text>

                {/* 다층 퍼셉트론 */}
                <text x={160} y={16} fontSize="9" textAnchor="middle" fill="#64748b">
                  다층 퍼셉트론
                </text>
                {[
                  [137, 132],
                  [183, 132],
                ].map(([x, y], i) => (
                  <g key={`in${i}`}>
                    <circle cx={x} cy={y} r={11} fill="#dbeafe" stroke="#2563eb" strokeWidth={1.3} />
                    <text x={x} y={y + 4} fontSize="9" textAnchor="middle" fill="#1e3a8a">
                      x{i === 0 ? "₁" : "₂"}
                    </text>
                  </g>
                ))}
                {[
                  [137, 86],
                  [183, 86],
                ].map(([x, y], i) => (
                  <g key={`h${i}`}>
                    <circle cx={x} cy={y} r={11} fill="#fae8ff" stroke="#a21caf" strokeWidth={1.3} />
                    <text x={x} y={y + 4} fontSize="9" textAnchor="middle" fill="#86198f">
                      z{i === 0 ? "₁" : "₂"}
                    </text>
                  </g>
                ))}
                <circle cx={160} cy={44} r={11} fill="#fed7aa" stroke="#ea580c" strokeWidth={1.3} />
                <text x={160} y={48} fontSize="9" textAnchor="middle" fill="#9a3412">
                  y
                </text>
                {[137, 183].map((x) =>
                  [137, 183].map((hx) => (
                    <line key={`${x}-${hx}`} x1={x} y1={121} x2={hx} y2={97} stroke="#d8b4fe" strokeWidth={1.1} />
                  )),
                )}
                {[137, 183].map((hx) => (
                  <line key={`o${hx}`} x1={hx} y1={75} x2={160} y2={55} stroke="#d8b4fe" strokeWidth={1.1} />
                ))}
                <text x={160} y={162} fontSize="8" textAnchor="middle" fill="#16a34a">
                  직선 2개 → 가능
                </text>
              </svg>
            </div>
            <div>
              <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                이러한 문제를 해결하기 위해서는 두 개의 직선을 결합하여 사용해야 하며, 이를 위해서는 은닉층을
                가지는 신경망 구조를 만들어야 함. 이처럼{" "}
                <strong>비선형 결정경계를 만들기 위하여 은닉층을 추가한 신경망을 다층 퍼셉트론</strong>
                (Multi-Layer Perceptron: MLP)이라고 함.
              </p>
              <div className="mt-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
                <p className="text-xs font-bold text-amber-800 dark:text-amber-200">
                  구조는 알았지만 학습 방법을 몰랐던 시기
                </p>
                <p className="mt-1 text-xs leading-relaxed text-amber-900/90 dark:text-amber-100/90">
                  퍼셉트론의 학습 규칙은 목표 출력값 t가 있어야 쓸 수 있는데, 은닉 노드 z₁·z₂에 대해서는
                  목표 출력값을 줄 수가 없었음. 그래서 은닉층의 가중치를 어떻게 고쳐야 할지 알지 못했고,
                  그 방법인 오류 역전파 학습 알고리즘은 1980년대에 등장함. 10강에서 이어짐.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Sourced>
    </section>
  );
}
