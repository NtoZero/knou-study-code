"use client";

import { useMemo, useState } from "react";
import { Shuffle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import {
  bootstrapIndices,
  fitLinear,
  linearPredict,
  mulberry32,
  type Label,
  type Pt,
} from "./ensembleCore";

/** 실제 결정경계 — 꺾인 경계라 직선 하나로는 나눌 수 없다 */
const truth = (p: Pt): Label => (p.y > 6.5 - Math.abs(p.x - 5) ? 1 : -1);

/** 학습 데이터 20개 (실제 결정경계로 레이블을 붙임) */
const DATA: Pt[] = [
  { x: 7, y: 0.8 }, { x: 4.6, y: 1.2 }, { x: 7.4, y: 4.8 }, { x: 4.9, y: 2 },
  { x: 2.9, y: 5.5 }, { x: 2.3, y: 1.3 }, { x: 6.9, y: 4.8 }, { x: 7.6, y: 8.4 },
  { x: 3.4, y: 6.7 }, { x: 3.1, y: 6.5 }, { x: 5.2, y: 8 }, { x: 5.4, y: 0.6 },
  { x: 8.4, y: 3.3 }, { x: 8.9, y: 7.4 }, { x: 4.3, y: 6.9 }, { x: 1.9, y: 3.8 },
  { x: 7, y: 0.5 }, { x: 0.6, y: 4.8 }, { x: 8.3, y: 5.9 }, { x: 6.6, y: 7.6 },
];
const LABELS: Label[] = DATA.map(truth);

/** 평가 격자 50×50 — 실제 결정경계와 비교해 분류 오차를 잰다 */
const EVAL: Pt[] = [];
for (let i = 0; i < 50; i += 1) for (let j = 0; j < 50; j += 1) EVAL.push({ x: i * 0.2 + 0.1, y: j * 0.2 + 0.1 });
const EVAL_T = EVAL.map(truth);

const MAX_M = 15;
const LINE_COLORS = ["#2563eb", "#16a34a", "#9333ea", "#dc2626", "#0891b2", "#ca8a04", "#db2777"];

const S = 260;
const P = 16;
const sx = (x: number) => P + (x / 10) * (S - 2 * P);
const sy = (y: number) => S - P - (y / 10) * (S - 2 * P);

/** w₀ + w₁x + w₂y = 0 을 [0,10]² 안으로 자른 선분 */
function clipLine(w: [number, number, number]) {
  const pts: Pt[] = [];
  const [a, b, c] = w;
  if (Math.abs(c) > 1e-9) {
    for (const x of [0, 10]) {
      const y = -(a + b * x) / c;
      if (y >= 0 && y <= 10) pts.push({ x, y });
    }
  }
  if (Math.abs(b) > 1e-9) {
    for (const y of [0, 10]) {
      const x = -(a + c * y) / b;
      if (x >= 0 && x <= 10) pts.push({ x, y });
    }
  }
  return pts.length >= 2 ? [pts[0], pts[pts.length - 1]] : null;
}

const errRate = (pred: (p: Pt) => Label) =>
  EVAL.filter((p, k) => pred(p) !== EVAL_T[k]).length / EVAL.length;

export default function VotingEffect() {
  const [m, setM] = useState(3);
  const [nTilde, setNTilde] = useState(8);
  const [seed, setSeed] = useState(1);
  const [showLines, setShowLines] = useState(true);

  const learners = useMemo(() => {
    const rand = mulberry32(seed * 101 + nTilde * 7);
    return Array.from({ length: MAX_M }, () => {
      const idx = bootstrapIndices(DATA.length, nTilde, rand);
      return fitLinear(
        idx.map((i) => DATA[i]),
        idx.map((i) => LABELS[i]),
      );
    });
  }, [seed, nTilde]);

  const active = useMemo(() => learners.slice(0, m), [learners, m]);

  const grid = useMemo(() => {
    const cells: { x: number; y: number; v: Label }[] = [];
    for (let i = 0; i < 40; i += 1)
      for (let j = 0; j < 40; j += 1) {
        const p = { x: i * 0.25 + 0.125, y: j * 0.25 + 0.125 };
        const s = active.reduce((acc, w) => acc + linearPredict(w, p), 0);
        cells.push({ x: i * 0.25, y: j * 0.25, v: s >= 0 ? 1 : -1 });
      }
    return cells;
  }, [active]);

  const indivErr = active.map((w) => errRate((p) => linearPredict(w, p)));
  const meanIndiv = indivErr.reduce((a, b) => a + b, 0) / indivErr.length;
  const ensErr = useMemo(
    () =>
      errRate((p) =>
        active.reduce((acc, w) => acc + linearPredict(w, p), 0) >= 0 ? 1 : -1,
      ),
    [active],
  );

  /* 일반화 오차 계산기 */
  const [gm, setGm] = useState(10);
  const [rho, setRho] = useState(0);
  const ebar = 1;
  const rhoMin = gm > 1 ? -1 / (gm - 1) : 0;
  const rhoEff = Math.max(rho, rhoMin);
  const combined = ebar * (1 / gm + ((gm - 1) / gm) * rhoEff);

  return (
    <section id="voting" className="scroll-mt-32">
      <SectionTitle
        title="03. 보팅에 의한 결합과 배깅·보팅의 효과"
        subtitle="M개의 학습기 결과를 동일한 정도로 반영하여 평균 — 결정경계와 일반화 오차 두 측면에서 확인"
      />

      <Sourced
        className="mb-6"
        refs={{
          textbook: "8.2.1 배깅에 의한 학습과 보팅에 의한 결합 — 식 8-5",
          slides: "보팅에 의한 결합",
        }}
      >
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/40">
          <p className="text-xs font-bold tracking-wide text-amber-600 dark:text-amber-400">
            보팅법 (voting, 투표법) · 커미티 머신 (committee machine)
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
            M개의 학습기 결과를 모두 동일한 정도로 반영하여 평균한 결과를 얻는 방법 →{" "}
            <strong>단순평균법</strong>. 각 학습기가 일종의 위원회(committee) 역할을 하여 최종
            결과에 각각 한 표씩 투표하는 것으로 볼 수 있음. 학습기의 <strong>결합</strong>과
            관련된 방법.
          </p>
          <div className="mt-3 overflow-x-auto">
            <p className="min-w-[340px] font-mono text-base">
              f(x) = f(h₁(x), h₂(x), …, h_M(x)) = (1/M) Σ<sub>i=1</sub>
              <sup>M</sup> hᵢ(x) <span className="text-xs text-gray-500">(식 8-5)</span>
            </p>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <p className="rounded-lg bg-white p-3 text-xs leading-relaxed text-gray-700 dark:bg-gray-900 dark:text-gray-300">
              엄밀히 말하면 각 hᵢ(x)와 f(x)가 <strong>연속된 실수값</strong>을 내야 하는 함수
              근사 문제에 적합.
            </p>
            <p className="rounded-lg bg-white p-3 text-xs leading-relaxed text-gray-700 dark:bg-gray-900 dark:text-gray-300">
              분류 문제에서는 결합함수의 결과를 이용하여 최종 분류 결과(클래스 레이블)를
              결정해 주는 <strong>추가 처리 과정</strong>이 필요. 아래 실습에서는 평균의 부호를
              취함.
            </p>
          </div>
        </div>
      </Sourced>

      <Sourced
        className="mb-8"
        refs={{
          textbook: "8.2.2 배깅과 보팅의 효과 — 식 8-6, 그림 8-2",
          slides: "배깅과 보팅에 의한 효과_결정경계",
          lecture: "선형 분류기 하나는 직선 경계밖에 못 그리지만 결합하면 복잡하고 다양한 형태의 결정경계를 나타낼 수 있다고 강조함",
        }}
      >
        <h3 className="mb-1 text-base font-bold">배깅 + 보팅이 만드는 결정경계</h3>
        <p className="mb-3 text-sm text-gray-500">
          이진 분류, hᵢ(x) = sign(wᵢᵀx). 매번 부트스트랩 표본 Xᵢ로 최소제곱법을 써서 wᵢ를 구한
          선형 분류기 M개를 보팅으로 결합. 점선은 실제 결정경계.
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
            <svg viewBox={`0 0 ${S} ${S}`} className="w-full">
              {grid.map((c) => (
                <rect
                  key={`${c.x}-${c.y}`}
                  x={sx(c.x)}
                  y={sy(c.y + 0.25)}
                  width={sx(0.25) - sx(0) + 0.3}
                  height={sy(0) - sy(0.25) + 0.3}
                  fill={c.v === 1 ? "#fde68a" : "#e0f2fe"}
                  opacity={0.75}
                />
              ))}
              <polyline
                points={[0, 5, 10].map((x) => `${sx(x)},${sy(6.5 - Math.abs(x - 5))}`).join(" ")}
                fill="none"
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="5 3"
              />
              {showLines &&
                active.map((w, i) => {
                  const seg = clipLine(w);
                  if (!seg) return null;
                  return (
                    <line
                      key={i}
                      x1={sx(seg[0].x)}
                      y1={sy(seg[0].y)}
                      x2={sx(seg[1].x)}
                      y2={sy(seg[1].y)}
                      stroke={LINE_COLORS[i % LINE_COLORS.length]}
                      strokeWidth="1.2"
                      opacity={0.8}
                    />
                  );
                })}
              {DATA.map((p, i) =>
                LABELS[i] === 1 ? (
                  <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={4.5} fill="#d97706" stroke="#fff" strokeWidth="1" />
                ) : (
                  <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={4} fill="#fff" stroke="#0284c7" strokeWidth="1.8" />
                ),
              )}
              <rect x={P} y={P} width={S - 2 * P} height={S - 2 * P} fill="none" stroke="#94a3b8" />
            </svg>
            <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-600" /> C₁ (t = +1)
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-sky-600" /> C₂ (t = −1)
              </span>
              <span>배경색 = 보팅 결과 영역</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
              <label className="flex items-center gap-2 text-sm">
                <span className="font-semibold">M</span>
                <input
                  type="range"
                  min={1}
                  max={MAX_M}
                  step={2}
                  value={m}
                  onChange={(e) => setM(Number(e.target.value))}
                  className="w-28 accent-amber-500"
                />
                <span className="w-5 font-mono font-bold">{m}</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <span className="font-semibold">Ñ</span>
                <input
                  type="range"
                  min={6}
                  max={20}
                  value={nTilde}
                  onChange={(e) => setNTilde(Number(e.target.value))}
                  className="w-28 accent-amber-500"
                />
                <span className="w-5 font-mono font-bold">{nTilde}</span>
              </label>
              <button
                onClick={() => setSeed((s) => s + 1)}
                className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-600"
              >
                <Shuffle size={12} />
                다시 부트스트랩
              </button>
              <label className="flex items-center gap-1.5 text-xs text-gray-500">
                <input
                  type="checkbox"
                  checked={showLines}
                  onChange={(e) => setShowLines(e.target.checked)}
                  className="accent-amber-500"
                />
                개별 결정경계 표시
              </label>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
              <p className="mb-2 text-xs font-semibold text-gray-500">
                평가 격자 2,500점에서 잰 분류 오차 (N = 20, M은 동점이 없도록 홀수)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {indivErr.map((e, i) => (
                  <span
                    key={i}
                    className="rounded-md border px-2 py-1 font-mono text-[11px]"
                    style={{ borderColor: LINE_COLORS[i % LINE_COLORS.length] }}
                  >
                    h{i + 1}: {(e * 100).toFixed(1)}%
                  </span>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                  <p className="text-[11px] text-gray-500">개별 학습기 평균 오차</p>
                  <p className="text-lg font-bold">{(meanIndiv * 100).toFixed(1)}%</p>
                </div>
                <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950/40">
                  <p className="text-[11px] text-gray-500">보팅 결합 f 오차</p>
                  <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
                    {(ensErr * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            <p className="rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
              개별 경계는 모두 직선이지만, 보팅 결과 영역의 경계는 여러 직선 조각이 이어진
              꺾인 모양이 됨 — 간단한 학습기를 복수 개 결합하여 얻어지는 함수는 개별 분류기
              모델의 표현 능력을 능가하는 새로운 모델을 표현할 수 있음. Ñ를 N = 20까지 키우면
              표본이 서로 비슷해져 직선들이 거의 겹치는 것도 확인할 수 있음 — 뒤에서 볼 양의
              상관관계.
            </p>
          </div>
        </div>
      </Sourced>

      <Sourced
        className="mb-4"
        refs={{
          textbook: "8.2.2 배깅과 보팅의 효과 — 식 8-7~8-10",
          slides: "배깅과 보팅에 의한 효과_일반화 오차",
          lecture: "1/M 감소는 오차가 서로 독립일 때만이고, 단순 배깅은 양의 상관관계를 가져 그만큼의 향상은 기대하기 어렵다고 짚음",
        }}
      >
        <h3 className="mb-3 text-base font-bold">일반화 오차 측면의 효과</h3>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="space-y-2 overflow-x-auto font-mono text-sm">
            <p className="min-w-[360px]">
              <span className="mr-2 text-[11px] font-sans font-bold text-amber-600">식 8-7</span>
              Eₓ[eᵢ²(x)] = Eₓ[{"{"}hᵢ(x) − f*(x){"}"}²]
            </p>
            <p className="min-w-[360px]">
              <span className="mr-2 text-[11px] font-sans font-bold text-amber-600">식 8-8</span>
              Eₓ[{"{"}f(x) − f*(x){"}"}²] = Eₓ[{"{"}(1/M) Σᵢ hᵢ(x) − f*(x){"}"}²] = Eₓ[{"{"}(1/M) Σᵢ eᵢ(x){"}"}²]
            </p>
            <p className="min-w-[360px] pl-14">
              = (1/M²) Σᵢ Eₓ[eᵢ²(x)] + (1/M²) Σ<sub>i,j (i≠j)</sub> Eₓ[eᵢ(x)eⱼ(x)]
            </p>
            <p className="min-w-[360px]">
              <span className="mr-2 text-[11px] font-sans font-bold text-amber-600">식 8-9</span>
              Eₓ[eᵢ(x)eⱼ(x)] = 0 <span className="font-sans text-xs text-gray-500">(각 학습기의 오차값들이 서로 독립적인 경우)</span>
            </p>
            <p className="min-w-[360px] rounded-md bg-amber-50 px-2 py-1 dark:bg-amber-950/40">
              <span className="mr-2 text-[11px] font-sans font-bold text-amber-600">식 8-10</span>
              Eₓ[{"{"}f(x) − f*(x){"}"}²] = (1/M) · {"{"}(1/M) Σᵢ Eₓ[eᵢ²(x)]{"}"}
            </p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            결합된 학습기의 일반화 오차가 각 개별 학습기의 <strong>평균적인 일반화 오차의 1/M배</strong>로
            감소. 단, (식 8-9)처럼 각 학습기가 내는 오차값들이 서로 독립적일 때만 성립.
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <p className="mb-1 text-sm font-bold">식 8-8에 수치를 넣어 보기</p>
          <p className="mb-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            계산을 위해 모든 학습기의 일반화 오차가 Eₓ[eᵢ²] = 1로 같고, 서로 다른 두
            학습기의 오차 곱의 기대치가 Eₓ[eᵢeⱼ] = ρ로 같다고 두면 식 8-8은{" "}
            <span className="font-mono">1/M + (M−1)ρ/M</span>이 됨.
          </p>
          <div className="mb-3 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <span className="font-semibold">M</span>
              <input
                type="range"
                min={1}
                max={50}
                value={gm}
                onChange={(e) => setGm(Number(e.target.value))}
                className="w-32 accent-amber-500"
              />
              <span className="w-6 font-mono font-bold">{gm}</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <span className="font-semibold">ρ</span>
              <input
                type="range"
                min={-0.2}
                max={1}
                step={0.01}
                value={rho}
                onChange={(e) => setRho(Number(e.target.value))}
                className="w-32 accent-amber-500"
              />
              <span className="w-12 font-mono font-bold">{rhoEff.toFixed(2)}</span>
            </label>
          </div>
          <div className="space-y-2">
            {[
              { label: "개별 학습기 평균 일반화 오차", v: ebar, color: "bg-gray-400" },
              { label: "오차가 독립(ρ = 0)일 때 — 식 8-10", v: 1 / gm, color: "bg-emerald-500" },
              { label: `현재 ρ = ${rhoEff.toFixed(2)}일 때 결합 학습기`, v: combined, color: "bg-amber-500" },
            ].map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-400">
                  <span>{b.label}</span>
                  <span className="font-mono">{b.v.toFixed(3)}</span>
                </div>
                <div className="h-3 w-full rounded-full bg-white dark:bg-gray-800">
                  <div className={`h-3 rounded-full ${b.color}`} style={{ width: `${Math.max(0, Math.min(1, b.v)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            {rhoEff > 0.005
              ? "양의 상관관계 → 일반화 오차가 1/M만큼 줄지 않음. 단순한 배깅은 각 학습기가 서로 양의 상관관계를 가진다고 볼 수 있어 식 8-10만큼의 감소를 기대하기 어려움."
              : rhoEff < -0.005
                ? "음의 상관관계를 가지도록 학습되면 일반화 오차는 1/M보다도 더욱 감소. 단순한 배깅보다 정교한 방법을 적용하면 더 큰 성능 향상을 기대할 수 있음."
                : "독립 — 식 8-10 그대로 개별 학습기 평균 일반화 오차의 1/M."}
            {rho < rhoMin && " (M개가 모두 서로 음의 상관을 가지려면 ρ ≥ −1/(M−1)이어야 하므로 그 값으로 맞춤.)"}
          </p>
        </div>
      </Sourced>
    </section>
  );
}
