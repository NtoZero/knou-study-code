"use client";

import { useMemo, useState } from "react";
import { Target } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { separableData } from "./svmData";
import { linearKernel, linearWeights, trainSvm, type Vec } from "./svmCore";
import {
  C1_COLOR,
  C2_COLOR,
  ERR_COLOR,
  SV_COLOR,
  bandPolygon,
  clipLine,
  fmt,
  makeScale,
  signed,
  type Frame,
} from "./plotUtils";

const F: Frame = { xMin: -1.5, xMax: 8.5, yMin: -1, yMax: 7.5, width: 340, height: 290, pad: 14 };
const s = makeScale(F);

const THETA_MIN = 90;
const THETA_MAX = 190;

/** 법선 방향 θ로 결정경계를 두 클래스 한가운데에 놓았을 때의 기하 */
function geometryAt(thetaDeg: number) {
  const t = (thetaDeg * Math.PI) / 180;
  const u: Vec = [Math.cos(t), Math.sin(t)];
  const proj = separableData.map((d) => d.x[0] * u[0] + d.x[1] * u[1]);
  const c1 = proj.filter((_, i) => separableData[i].y === 1);
  const c2 = proj.filter((_, i) => separableData[i].y === -1);
  const hi = Math.min(...c1);
  const lo = Math.max(...c2);
  const gap = hi - lo;
  const mid = (hi + lo) / 2;
  const svPlus = proj
    .map((_, i) => i)
    .filter((i) => separableData[i].y === 1 && Math.abs(proj[i] - hi) < 1e-6);
  const svMinus = proj
    .map((_, i) => i)
    .filter((i) => separableData[i].y === -1 && Math.abs(proj[i] - lo) < 1e-6);
  // 서포트 벡터에서 wᵀχ + w₀ = ±1 이 되도록 w, w₀의 비율을 조절
  const scale = gap > 0 ? 2 / gap : NaN;
  const w: Vec = [u[0] * scale, u[1] * scale];
  const w0 = -mid * scale;
  const errors = proj.filter((p, i) => (p - mid > 0 ? 1 : -1) !== separableData[i].y).length;
  return { u, gap, mid, svPlus, svMinus, w, w0, errors };
}

const svm = trainSvm(separableData, linearKernel);
const W_HAT = linearWeights(svm);
const W0_HAT = svm.w0;
const OPT_THETA = Math.round((Math.atan2(W_HAT[1], W_HAT[0]) * 180) / Math.PI);

const CURVE = (() => {
  const pts: { th: number; m: number }[] = [];
  for (let th = THETA_MIN; th <= THETA_MAX; th += 1) pts.push({ th, m: geometryAt(th).gap });
  return pts;
})();
const CURVE_MAX = Math.max(...CURVE.map((p) => p.m));

const CW = 340;
const CH = 150;
const cx = (th: number) => 30 + ((th - THETA_MIN) / (THETA_MAX - THETA_MIN)) * (CW - 45);
const cy = (m: number) => CH - 22 - (Math.max(m, -0.2) / (CURVE_MAX + 0.3)) * (CH - 40);

export default function MaxMarginClassifier() {
  const [theta, setTheta] = useState(105);
  const [probe, setProbe] = useState<Vec>([2, 3]);
  const geo = useMemo(() => geometryAt(theta), [theta]);
  const separable = geo.gap > 0;
  const isOpt = theta === OPT_THETA;

  const boundary = clipLine(geo.u, -geo.mid, F);
  const plus = separable ? clipLine(geo.u, -geo.mid - geo.gap / 2, F) : null;
  const minus = separable ? clipLine(geo.u, -geo.mid + geo.gap / 2, F) : null;

  // 마진 띠 (마이너스 평면과 플러스 평면 사이)
  const band = separable ? bandPolygon(geo.u, -geo.mid, -geo.gap / 2, geo.gap / 2, F) : [];
  const bandPoints = band.map((p) => `${s.sx(p[0])},${s.sy(p[1])}`).join(" ");

  const svSet = new Set([...geo.svPlus, ...geo.svMinus]);

  /* 한 점에서 결정경계까지의 거리 — 최대 마진 해 ŵ, ŵ₀ 기준 */
  const wn = Math.hypot(W_HAT[0], W_HAT[1]);
  const uHat: Vec = [W_HAT[0] / wn, W_HAT[1] / wn];
  const term1 = (W_HAT[0] * probe[0] + W_HAT[1] * probe[1]) / wn;
  const term2 = -W0_HAT / wn;
  const dist = term1 - term2;
  const optBoundary = clipLine(W_HAT, W0_HAT, F);

  const onPick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const m = svg.getScreenCTM();
    if (!m) return;
    const p = pt.matrixTransform(m.inverse());
    const [x, y] = s.inv(p.x, p.y);
    setProbe([
      Math.max(F.xMin, Math.min(F.xMax, Number(x.toFixed(1)))),
      Math.max(F.yMin, Math.min(F.yMax, Number(y.toFixed(1)))),
    ]);
  };

  const axes = (
    <g>
      <line x1={s.sx(F.xMin)} y1={s.sy(0)} x2={s.sx(F.xMax)} y2={s.sy(0)} stroke="#e2e8f0" />
      <line x1={s.sx(0)} y1={s.sy(F.yMin)} x2={s.sx(0)} y2={s.sy(F.yMax)} stroke="#e2e8f0" />
      <text x={s.sx(0) + 3} y={s.sy(0) + 10} fontSize="8" fill="#94a3b8">
        O
      </text>
    </g>
  );

  const dots = (ring: Set<number>) =>
    separableData.map((d, i) => (
      <g key={i}>
        {ring.has(i) && (
          <circle cx={s.sx(d.x[0])} cy={s.sy(d.x[1])} r={9} fill={SV_COLOR} opacity={0.35} />
        )}
        <circle
          cx={s.sx(d.x[0])}
          cy={s.sy(d.x[1])}
          r={4.5}
          fill={d.y === 1 ? C1_COLOR : "#ffffff"}
          stroke={d.y === 1 ? C1_COLOR : C2_COLOR}
          strokeWidth={d.y === 1 ? 1 : 2}
        />
      </g>
    ));

  return (
    <section>
      <SectionTitle
        title="10.2.1 최대 마진 분류기"
        subtitle="결정경계를 돌려 가며 마진을 재고, 마진이 가장 큰 경계를 찾기"
      />

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <Sourced refs={{ textbook: "10.2.1 최대 마진 분류기", slides: "SVM — 마진" }}>
          <div className="h-full rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/40">
            <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">마진 (margin)</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              학습 데이터 중에서 <strong>결정경계에 가장 가까운 데이터로부터 결정경계까지의 거리</strong>.
            </p>
          </div>
        </Sourced>
        <Sourced
          refs={{
            textbook: "10.2.1 최대 마진 분류기",
            slides: "SVM — 서포트 벡터",
            lecture: "마진과 서포트 벡터는 결정경계가 어떻게 주어지느냐에 따라 달라진다는 점을 같은 데이터에 두 경계를 그려 보여 줌",
          }}
        >
          <div className="h-full rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
              서포트 벡터 (support vector)
            </p>
            <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              <strong>결정경계에 가장 가까운 곳에 있는 데이터.</strong> 학습 데이터가 정해져 있어도
              마진과 서포트 벡터는 결정경계에 따라 달라짐.
            </p>
          </div>
        </Sourced>
        <Sourced
          refs={{
            textbook: "10.2.1 최대 마진 분류기",
            slides: "SVM — 최대 마진 분류기",
            lecture: "일반화 오차를 작게 하려면 클래스 간 간격, 곧 마진을 최대로 하는 결정경계를 찾는다는 SVM의 개념을 확실히 정리해 두라고 강조",
          }}
        >
          <div className="h-full rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-bold">최대 마진 분류기 = SVM</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              일반화 오차를 작게 하려면 두 클래스 간의 간격을 최대로 하는 것이 좋으므로, 마진을
              최대로 하는 결정경계를 찾는 것이 바람직함. 이 목적에 맞추어 최적화된 선형 결정경계를
              찾는 분류기를 <strong>최대 마진 분류기(maximum margin classifier)</strong>라 하며,
              일반적으로 서포트 벡터 머신으로 알려짐.
            </p>
          </div>
        </Sourced>
      </div>

      <Sourced
        refs={{
          textbook: "10.2.1 최대 마진 분류기 (식 10-3, 10-4, 그림 10-4)",
          slides: "최대 마진 분류기 — 한 점 x에서 결정경계까지의 거리 d",
        }}
        className="mb-8"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">한 점 x에서 결정경계까지의 거리 d</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            g(x) = wᵀx + w₀ = 0 (식 10-3)에서 <strong>w는 초평면의 법선 벡터</strong>, w₀는 원점에서
            직선까지의 거리를 결정하는 값. 이 데이터의 최대 마진 경계(바로 아래에서 직접 찾아봄) ŵ = ({fmt(W_HAT[0], 2)},{" "}
            {fmt(W_HAT[1], 2)}), ŵ₀ = {fmt(W0_HAT, 2)}를 쓰고, 그림을 눌러 점 x를 옮겨 볼 것.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
            <svg
              viewBox={`0 0 ${F.width} ${F.height}`}
              className="w-full cursor-crosshair rounded-lg border border-gray-100 dark:border-gray-800"
              onClick={onPick}
            >
              <rect x={0} y={0} width={F.width} height={F.height} fill="#ffffff" />
              {axes}
              {optBoundary && (
                <line
                  x1={s.sx(optBoundary[0][0])}
                  y1={s.sy(optBoundary[0][1])}
                  x2={s.sx(optBoundary[1][0])}
                  y2={s.sy(optBoundary[1][1])}
                  stroke="#c026d3"
                  strokeWidth="2"
                />
              )}
              {dots(new Set())}
              {/* 원점을 지나는 w 방향 축 */}
              {(() => {
                const a: Vec = [uHat[0] * -3, uHat[1] * -3];
                const b: Vec = [uHat[0] * 3, uHat[1] * 3];
                return (
                  <line
                    x1={s.sx(a[0])}
                    y1={s.sy(a[1])}
                    x2={s.sx(b[0])}
                    y2={s.sy(b[1])}
                    stroke="#94a3b8"
                    strokeDasharray="2 3"
                  />
                );
              })()}
              {/* ① x를 w 방향으로 사영 */}
              {(() => {
                const f1: Vec = [uHat[0] * term1, uHat[1] * term1];
                const f2: Vec = [uHat[0] * term2, uHat[1] * term2];
                return (
                  <g>
                    <line x1={s.sx(probe[0])} y1={s.sy(probe[1])} x2={s.sx(f1[0])} y2={s.sy(f1[1])} stroke="#16a34a" strokeDasharray="3 2" />
                    <line x1={s.sx(0)} y1={s.sy(0) - 3} x2={s.sx(f1[0])} y2={s.sy(f1[1]) - 3} stroke="#16a34a" strokeWidth="3" />
                    <line x1={s.sx(0)} y1={s.sy(0) + 3} x2={s.sx(f2[0])} y2={s.sy(f2[1]) + 3} stroke="#2563eb" strokeWidth="3" />
                    <circle cx={s.sx(f1[0])} cy={s.sy(f1[1])} r={3} fill="#16a34a" />
                    <circle cx={s.sx(f2[0])} cy={s.sy(f2[1])} r={3} fill="#2563eb" />
                    <text x={s.sx(f1[0]) - 6} y={s.sy(f1[1]) - 6} fontSize="10" fontWeight="bold" fill="#16a34a" textAnchor="end">
                      ①
                    </text>
                    <text x={s.sx(f2[0]) + 6} y={s.sy(f2[1]) + 12} fontSize="10" fontWeight="bold" fill="#2563eb">
                      ②
                    </text>
                  </g>
                );
              })()}
              <circle cx={s.sx(probe[0])} cy={s.sy(probe[1])} r={6} fill="#dc2626" stroke="#fff" strokeWidth="1.5" />
              <text x={s.sx(probe[0]) + 8} y={s.sy(probe[1]) - 6} fontSize="10" fontWeight="bold" fill="#dc2626">
                x
              </text>
            </svg>

            <div className="space-y-3">
              <div className="overflow-x-auto rounded-lg bg-gray-50 p-3 font-mono text-xs leading-6 dark:bg-gray-800/60">
                <p className="min-w-[300px]">x = ({probe[0]}, {probe[1]}), ‖ŵ‖ = {fmt(wn, 4)}</p>
                <p className="min-w-[300px] text-green-700 dark:text-green-400">
                  ① ŵᵀx / ‖ŵ‖ = {fmt(W_HAT[0] * probe[0] + W_HAT[1] * probe[1], 3)} / {fmt(wn, 4)} ={" "}
                  {fmt(term1, 3)}
                </p>
                <p className="min-w-[300px] text-blue-700 dark:text-blue-400">
                  ② −ŵ₀ / ‖ŵ‖ = {fmt(-W0_HAT, 3)} / {fmt(wn, 4)} = {fmt(term2, 3)}
                </p>
                <p className="min-w-[300px] font-bold">
                  d = ① − ② = (ŵᵀx + ŵ₀) / ‖ŵ‖ = {fmt(W_HAT[0] * probe[0] + W_HAT[1] * probe[1] + W0_HAT, 3)} /{" "}
                  {fmt(wn, 4)} = {fmt(dist, 3)}
                </p>
                <p className="min-w-[300px]">
                  ŵᵀx + ŵ₀ {dist > 0 ? "> 0 → C₁ 영역" : dist < 0 ? "< 0 → C₂ 영역" : "= 0 → 결정경계 위"}
                </p>
              </div>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                ①은 x를 w 방향으로 사영한 길이. w가 단위벡터가 아니므로 ‖w‖로 나눔. ②는 결정경계 위의
                점을 같은 방향으로 사영한 길이로, 경계 위의 점은 wᵀx̃ + w₀ = 0을 만족하므로 wᵀx̃ = −w₀가
                되어 −w₀/‖w‖. 둘의 차가 곧 거리 d{" "}
                <span className="font-mono">(식 10-4)</span>. d의 부호가 양이면 C₁ 쪽, 음이면 C₂ 쪽.
              </p>
              <p className="rounded-lg bg-emerald-50 p-2 text-xs leading-relaxed text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                서포트 벡터 (2, 3)을 누르면 d = 1/‖ŵ‖ = {fmt(1 / wn, 3)}, 곧 한쪽 마진. 반대편 서포트
                벡터 (5, 2)는 d = −{fmt(1 / wn, 3)}. 두 거리의 합 {fmt(2 / wn, 3)}이 마진 M = 2/‖ŵ‖.
              </p>
              <p className="text-[11px] text-gray-400">
                현재 d {signed(dist, 3)} — {Math.abs(Math.abs(dist) - 1 / wn) < 1e-9 ? "서포트 벡터와 같은 거리" : Math.abs(dist) < 1 / wn ? "마진 안쪽" : "마진 바깥"}
              </p>
            </div>
          </div>
        </div>
      </Sourced>
      <Sourced
        refs={{
          textbook: "10.2.1 최대 마진 분류기 (그림 10-3, 식 10-5, 10-6)",
          slides: "마진 계산",
          lecture: "마진을 최대화하는 것은 곧 법선 벡터 w의 크기를 최소화하는 것과 같다고 동등하게 이해하라고 짚음",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">결정경계를 돌려 가며 마진 비교</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            ● C₁(yᵢ = +1), ○ C₂(yᵢ = −1). 법선 벡터 w의 방향 θ를 바꾸면 결정경계가 회전함. 경계는
            항상 두 클래스의 가장 가까운 데이터 한가운데에 두고, 그 데이터(서포트 벡터, 초록 원)에서
            wᵀχ + w₀ = ±1이 되도록 w와 w₀의 비율을 조절해 플러스·마이너스 평면을 그림.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
            <svg viewBox={`0 0 ${F.width} ${F.height}`} className="w-full rounded-lg border border-gray-100 dark:border-gray-800">
              <rect x={0} y={0} width={F.width} height={F.height} fill="#ffffff" />
              {axes}
              {band.length > 2 && <polygon points={bandPoints} fill={SV_COLOR} opacity={0.12} />}
              {plus && (
                <line
                  x1={s.sx(plus[0][0])}
                  y1={s.sy(plus[0][1])}
                  x2={s.sx(plus[1][0])}
                  y2={s.sy(plus[1][1])}
                  stroke={C1_COLOR}
                  strokeDasharray="5 3"
                  strokeWidth="1.3"
                />
              )}
              {minus && (
                <line
                  x1={s.sx(minus[0][0])}
                  y1={s.sy(minus[0][1])}
                  x2={s.sx(minus[1][0])}
                  y2={s.sy(minus[1][1])}
                  stroke={C2_COLOR}
                  strokeDasharray="5 3"
                  strokeWidth="1.3"
                />
              )}
              {boundary && (
                <line
                  x1={s.sx(boundary[0][0])}
                  y1={s.sy(boundary[0][1])}
                  x2={s.sx(boundary[1][0])}
                  y2={s.sy(boundary[1][1])}
                  stroke={separable ? "#c026d3" : ERR_COLOR}
                  strokeWidth="2.2"
                />
              )}
              {dots(separable ? svSet : new Set())}
              <text x={F.width - 8} y={20} fontSize="10" textAnchor="end" fill={C1_COLOR}>
                wᵀx + w₀ = +1 (플러스 평면)
              </text>
              <text x={F.width - 8} y={34} fontSize="10" textAnchor="end" fill="#c026d3">
                wᵀx + w₀ = 0 (결정경계)
              </text>
              <text x={F.width - 8} y={48} fontSize="10" textAnchor="end" fill="#b45309">
                wᵀx + w₀ = −1 (마이너스 평면)
              </text>
            </svg>

            <div>
              <label className="flex items-center gap-3 text-sm">
                <span className="shrink-0 font-bold">w의 방향 θ</span>
                <input
                  type="range"
                  min={THETA_MIN}
                  max={THETA_MAX}
                  step={1}
                  value={theta}
                  onChange={(e) => setTheta(Number(e.target.value))}
                  className="min-w-0 flex-1 accent-indigo-600"
                />
                <span className="w-12 text-right font-mono">{theta}°</span>
              </label>
              <button
                onClick={() => setTheta(OPT_THETA)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Target size={14} />
                마진이 최대인 경계로
              </button>

              {separable ? (
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800/60">
                      <p className="text-[11px] text-gray-500">한쪽 마진 (경계 ↔ 가장 가까운 데이터)</p>
                      <p className="font-mono text-lg font-bold">{fmt(geo.gap / 2, 3)}</p>
                    </div>
                    <div className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-950/40">
                      <p className="text-[11px] text-gray-500">마진 M (χ⁺ ~ 경계 ~ χ⁻)</p>
                      <p className="font-mono text-lg font-bold text-indigo-700 dark:text-indigo-300">
                        {fmt(geo.gap, 3)}
                      </p>
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-lg bg-gray-50 p-3 font-mono text-xs leading-6 dark:bg-gray-800/60">
                    <p className="min-w-[260px]">
                      w = ({fmt(geo.w[0], 3)}, {fmt(geo.w[1], 3)}), w₀ = {fmt(geo.w0, 3)}
                    </p>
                    <p className="min-w-[260px]">‖w‖ = {fmt(Math.hypot(geo.w[0], geo.w[1]), 4)}</p>
                    <p className="min-w-[260px] font-bold">
                      M = 2 / ‖w‖ = {fmt(2 / Math.hypot(geo.w[0], geo.w[1]), 3)}
                    </p>
                    <p className="min-w-[260px] text-gray-500">
                      서포트 벡터: C₁ {geo.svPlus.map((i) => `(${separableData[i].x.join(", ")})`).join(" ")}
                      {" · "}C₂ {geo.svMinus.map((i) => `(${separableData[i].x.join(", ")})`).join(" ")}
                    </p>
                  </div>
                  <p
                    className={`rounded-lg p-2 text-xs leading-relaxed ${
                      isOpt
                        ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                        : "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
                    }`}
                  >
                    {isOpt
                      ? `최대 마진. 서포트 벡터가 3개로 늘어나며, 이 w와 w₀는 다음 절에서 이원적 문제를 풀어 얻는 ŵ = (${fmt(W_HAT[0], 3)}, ${fmt(W_HAT[1], 3)}), ŵ₀ = ${fmt(W0_HAT, 3)}와 같음.`
                      : "학습 오차는 0이지만 마진이 최대가 아님. 아래 그래프에서 봉우리 쪽으로 θ를 옮겨 볼 것."}
                  </p>
                </div>
              ) : (
                <p className="mt-4 rounded-lg bg-rose-50 p-3 text-xs leading-relaxed text-rose-800 dark:bg-rose-950/30 dark:text-rose-200">
                  이 방향의 직선으로는 두 클래스를 분리할 수 없음 — 가운데에 경계를 두어도 학습 오차{" "}
                  {geo.errors}개 발생. 플러스·마이너스 평면을 정의할 수 없음.
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <p className="mb-1 text-xs font-bold text-gray-500">w의 방향 θ에 따른 마진 M</p>
            <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full min-w-[320px] max-w-[520px]">
              <line x1={30} y1={cy(0)} x2={CW - 10} y2={cy(0)} stroke="#cbd5e1" />
              <line x1={30} y1={10} x2={30} y2={CH - 22} stroke="#cbd5e1" />
              <text x={4} y={16} fontSize="9" fill="#64748b">
                M
              </text>
              <text x={CW - 10} y={CH - 6} fontSize="9" textAnchor="end" fill="#64748b">
                θ
              </text>
              {[90, 110, 130, 150, 170, 190].map((t) => (
                <text key={t} x={cx(t)} y={CH - 8} fontSize="8" textAnchor="middle" fill="#94a3b8">
                  {t}°
                </text>
              ))}
              <path
                d={CURVE.map((p, i) => `${i === 0 ? "M" : "L"}${cx(p.th).toFixed(1)},${cy(p.m).toFixed(1)}`).join(" ")}
                fill="none"
                stroke={C1_COLOR}
                strokeWidth="2"
              />
              <line
                x1={cx(OPT_THETA)}
                y1={cy(CURVE_MAX)}
                x2={cx(OPT_THETA)}
                y2={cy(0)}
                stroke={SV_COLOR}
                strokeDasharray="3 2"
              />
              <text x={cx(OPT_THETA)} y={cy(CURVE_MAX) - 4} fontSize="9" textAnchor="middle" fill="#059669">
                최대 M = {fmt(CURVE_MAX, 3)}
              </text>
              <circle cx={cx(theta)} cy={cy(geo.gap)} r={4.5} fill={separable ? "#c026d3" : ERR_COLOR} />
              <text x={34} y={cy(0) - 3} fontSize="8" fill="#94a3b8">
                M ≤ 0: 선형 분리 불가
              </text>
            </svg>
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg bg-indigo-50 p-3 dark:bg-indigo-950/40">
            <p className="min-w-[380px] font-mono text-sm">
              M = (1/‖w‖)((wᵀχ⁺ + w₀) − (wᵀχ⁻ + w₀)) = 2 / ‖w‖{" "}
              <span className="ml-1 text-xs text-gray-500">(식 10-6)</span>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              마진 M은 결정경계에서 χ⁺까지의 거리와 χ⁻까지의 거리의 합. 서포트 벡터에서 wᵀχ⁺ + w₀ =
              +1, wᵀχ⁻ + w₀ = −1이므로 괄호 안이 2가 됨. 따라서{" "}
              <strong>마진의 최대화 ⇔ ‖w‖의 최소화</strong>.
            </p>
          </div>
        </div>
      </Sourced>

    </section>
  );
}
