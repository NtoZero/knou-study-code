"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { covariance, dot, eigenSym, gaussian, meanVec, mulberry32, sample2D, sub, type Vec } from "./featureCore";
import { Card, Pill, Stat, CLASS_COLORS, SLATE, fmt, linScale } from "./ui";

/* ── [그림 7-7] 주성분분석이 적합하지 않은 데이터 — 세로로 긴 두 클래스가 나란히 ── */
const C1 = sample2D(mulberry32(301), 60, [-1.4, 0], 90, 3, 0.6);
const C2 = sample2D(mulberry32(302), 60, [1.4, 0], 90, 3, 0.6);

/* ── [그림 7-8] 비선형 구조 — 나선 모양 곡선 위의 데이터 ── */
const CURVE: { p: Vec; t: number }[] = (() => {
  const rng = mulberry32(88);
  return Array.from({ length: 140 }, (_, i) => {
    const t = i / 139;
    const phi = Math.PI * (0.25 + 2.1 * t);
    const r = 0.45 + 1.05 * t;
    return {
      t,
      p: [3 + r * Math.cos(phi) + gaussian(rng) * 0.05, 1.5 + r * Math.sin(phi) * 0.9 + gaussian(rng) * 0.05],
    };
  });
})();

/** 한 문턱값으로 두 클래스를 나눌 때 얻을 수 있는 최대 분류율 */
function bestSplitRate(a: number[], b: number[]) {
  const all = [...a.map((v) => ({ v, c: 0 })), ...b.map((v) => ({ v, c: 1 }))].sort((x, y) => x.v - y.v);
  let best = 0;
  let leftA = 0;
  let leftB = 0;
  for (let i = 0; i <= all.length; i++) {
    const r1 = (leftA + (b.length - leftB)) / all.length;
    const r2 = (leftB + (a.length - leftA)) / all.length;
    best = Math.max(best, r1, r2);
    if (i < all.length) {
      if (all[i].c === 0) leftA++;
      else leftB++;
    }
  }
  return best;
}

function histogram(vals: number[], lo: number, hi: number, bins: number) {
  const h = new Array(bins).fill(0);
  for (const v of vals) {
    const k = Math.min(bins - 1, Math.max(0, Math.floor(((v - lo) / (hi - lo)) * bins)));
    h[k]++;
  }
  return h;
}

/** 곡선 위치 t(0~1)를 색으로 */
const tColor = (t: number) => `hsl(${220 - t * 200}, 75%, 50%)`;

export default function PCALimits() {
  const [axis, setAxis] = useState<"pca" | "horizontal">("pca");

  const caseA = useMemo(() => {
    const all = [...C1, ...C2];
    const mu = meanVec(all);
    const eig = eigenSym(covariance(all, mu));
    return { mu, eig };
  }, []);
  const u = axis === "pca" ? caseA.eig.vectors[0] : [1, 0];
  const p1 = C1.map((x) => dot(u, sub(x, caseA.mu)));
  const p2 = C2.map((x) => dot(u, sub(x, caseA.mu)));
  const rate = bestSplitRate(p1, p2);
  const H_LO = -8;
  const H_HI = 8;
  const BINS = 24;
  const h1 = histogram(p1, H_LO, H_HI, BINS);
  const h2 = histogram(p2, H_LO, H_HI, BINS);
  const hMax = Math.max(...h1, ...h2);

  const caseB = useMemo(() => {
    const X = CURVE.map((c) => c.p);
    const mu = meanVec(X);
    const eig = eigenSym(covariance(X, mu));
    const y1 = X.map((x) => dot(eig.vectors[0], sub(x, mu)));
    return { mu, eig, y1 };
  }, []);

  const ax = linScale(-8.5, 8.5, 10, 230);
  const ay = linScale(-8.5, 8.5, 230, 10);
  const hx = linScale(0, BINS, 20, 380);
  const hy = linScale(0, hMax, 0, 60);

  const bx = linScale(1.3, 5.1, 10, 250);
  const by = linScale(0.2, 2.9, 180, 10);
  const yLo = Math.min(...caseB.y1);
  const yHi = Math.max(...caseB.y1);
  const sx1 = linScale(yLo, yHi, 20, 380);

  return (
    <section>
      <SectionTitle
        title="7.2.3 주성분분석법의 특성과 문제점"
        subtitle="특별한 목적이 없을 때 가장 합리적인 차원 축소 — 그러나 클래스 정보와 비선형 구조는 담지 못함"
      />

      <div className="space-y-6">
        <Sourced
          refs={{
            textbook: "7.2.3 주성분분석법의 특성과 문제점",
            slides: "PCA의 특성과 문제점",
            lecture: "무엇을 할지 정해지지 않았지만 데이터가 너무 클 때 일단 차원을 줄이고 보자는 상황이라면 PCA가 가장 합리적이라고 설명함",
          }}
        >
          <Card title="특성">
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              입력으로 주어진 고차원 데이터의 정보를 최대한 손실하지 않는 방향으로 차원 축소를 수행.
              데이터 분석에 대한 <strong>특별한 목적이 없는 경우</strong>에는 가장 합리적인(일반적인) 차원
              축소의 기준. 기본적으로 입력 데이터 전체의 2차 통계량(공분산)을 분석의 기준으로 둠.
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7.2.3 — [그림 7-7] 주성분분석이 적합하지 않은 데이터 집합의 예",
            slides: "PCA의 특성과 문제점 — 비지도학습",
          }}
        >
          <Card title="문제점 ① 비지도학습 — 분류의 핵심 정보를 잃을 수 있음">
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              각 데이터의 클래스 레이블 정보를 활용하지 않는 비지도학습. 클래스 구분 없이 전체 데이터에
              대한 주성분을 찾으면 수직축에 가까운 벡터가 나옴.
            </p>
            <div className="mb-3 flex flex-wrap gap-2">
              <Pill on={axis === "pca"} onClick={() => setAxis("pca")}>
                PCA 1차 주성분으로 사영
              </Pill>
              <Pill on={axis === "horizontal"} onClick={() => setAxis("horizontal")}>
                비교 — 가로축으로 사영
              </Pill>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
              <svg viewBox="0 0 240 240" className="w-full rounded-lg border border-gray-200 bg-white text-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-800">
                <line x1={ax(0)} y1={10} x2={ax(0)} y2={230} stroke="currentColor" />
                <line x1={10} y1={ay(0)} x2={230} y2={ay(0)} stroke="currentColor" />
                <line x1={ax(caseA.mu[0] - u[0] * 12)} y1={ay(caseA.mu[1] - u[1] * 12)} x2={ax(caseA.mu[0] + u[0] * 12)} y2={ay(caseA.mu[1] + u[1] * 12)} stroke="#059669" strokeWidth="2" />
                {C1.map((p, i) => (
                  <circle key={`a${i}`} cx={ax(p[0])} cy={ay(p[1])} r={2.4} fill="none" stroke={CLASS_COLORS[0]} />
                ))}
                {C2.map((p, i) => (
                  <circle key={`b${i}`} cx={ax(p[0])} cy={ay(p[1])} r={2.2} fill={CLASS_COLORS[1]} opacity={0.8} />
                ))}
              </svg>
              <div>
                <p className="mb-1 text-xs text-gray-500">사영한 1차원 특징값의 클래스별 히스토그램</p>
                <div className="overflow-x-auto">
                  <svg viewBox="0 0 400 140" className="w-full min-w-[320px] text-gray-200 dark:text-gray-800">
                    <line x1={20} y1={70} x2={380} y2={70} stroke="currentColor" />
                    {h1.map((c, k) => (
                      <rect key={`h1${k}`} x={hx(k) + 0.5} y={70 - hy(c)} width={hx(1) - hx(0) - 1} height={hy(c)} fill={CLASS_COLORS[0]} opacity={0.75} />
                    ))}
                    {h2.map((c, k) => (
                      <rect key={`h2${k}`} x={hx(k) + 0.5} y={70} width={hx(1) - hx(0) - 1} height={hy(c)} fill={CLASS_COLORS[1]} opacity={0.75} />
                    ))}
                    <text x={22} y={12} fontSize="9" fill={CLASS_COLORS[0]}>
                      C₁ (위)
                    </text>
                    <text x={22} y={136} fontSize="9" fill={CLASS_COLORS[1]}>
                      C₂ (아래)
                    </text>
                  </svg>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Stat label="사영 방향" value={`[${fmt(u[0], 2)}, ${fmt(u[1], 2)}]ᵀ`} />
                  <Stat label="문턱값 하나로 얻는 최대 분류율" value={`${fmt(rate * 100, 1)}%`} tone={rate > 0.9 ? "good" : "bad"} />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                  {axis === "pca"
                    ? "두 클래스의 히스토그램이 거의 겹침 — 이 특징만으로 분류하면 클래스 정보를 모두 잃은 상태로 분류하게 됨."
                    : "분산은 작지만 클래스가 잘 갈라지는 방향. 이런 방향을 클래스 정보로 찾는 것이 다음 절 선형판별분석."}
                </p>
              </div>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7.2.3 — [그림 7-8] 비선형 구조를 가진 데이터에 대해 주성분분석에 의해 얻어진 1차원 특징",
            slides: "PCA의 특성과 문제점 — 선형변환의 한계",
            lecture: "PCA와 LDA 모두 선형변환이므로 데이터가 비선형이면 제대로 처리하지 못한다는 근본적인 한계를 짚음",
          }}
        >
          <Card title="문제점 ② 선형변환의 한계 — 비선형 구조를 반영하지 못함">
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              기본적으로 선형변환을 가정하므로 데이터 자체가 비선형 구조로 분포하면 이를 반영하는 저차원
              특징을 찾을 수 없음. 어떤 방향으로 사영해도 데이터가 가지는 2차원 구조를 제대로 표현하지
              못함.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
              <svg viewBox="0 0 260 190" className="w-full rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
                {caseB.eig.vectors.map((v, k) => (
                  <g key={k}>
                    <line x1={bx(caseB.mu[0] - v[0] * 3)} y1={by(caseB.mu[1] - v[1] * 3)} x2={bx(caseB.mu[0] + v[0] * 3)} y2={by(caseB.mu[1] + v[1] * 3)} stroke={k === 0 ? "#dc2626" : "#059669"} strokeWidth={1.8} />
                    <text x={bx(caseB.mu[0] + v[0] * 2.6) + 3} y={by(caseB.mu[1] + v[1] * 2.6) - 3} fontSize="9" fill={k === 0 ? "#dc2626" : "#059669"} fontWeight="bold">
                      주성분{k + 1}
                    </text>
                  </g>
                ))}
                {CURVE.map((c, i) => (
                  <circle key={i} cx={bx(c.p[0])} cy={by(c.p[1])} r={2.3} fill={tColor(c.t)} />
                ))}
              </svg>
              <div>
                <p className="mb-1 text-xs text-gray-500">주성분1로 사영한 1차원 특징 (색 = 곡선을 따라간 위치)</p>
                <div className="overflow-x-auto">
                  <svg viewBox="0 0 400 60" className="w-full min-w-[320px]">
                    <line x1={20} y1={30} x2={380} y2={30} stroke={SLATE} />
                    {CURVE.map((c, i) => (
                      <circle key={i} cx={sx1(caseB.y1[i])} cy={30 + ((i % 5) - 2) * 4} r={2.6} fill={tColor(c.t)} opacity={0.85} />
                    ))}
                  </svg>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-gray-500">
                  <span>곡선의 시작</span>
                  <span className="h-2 flex-1 rounded-full" style={{ background: "linear-gradient(90deg, hsl(220,75%,50%), hsl(120,75%,50%), hsl(20,75%,50%))" }} />
                  <span>곡선의 끝</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                  곡선을 따라 멀리 떨어진 점(파랑과 주황)이 같은 값 근처로 겹쳐짐 — 곡선이라는 구조가 1차원
                  특징에 남지 않음. 해결 방법으로 커널 함수를 사용하는 방법, 비선형 매니폴드 학습법 등이
                  개발됨.
                </p>
                <p className="mt-1 text-[11px] text-gray-400">
                  고유치 λ₁ = {fmt(caseB.eig.values[0], 3)}, λ₂ = {fmt(caseB.eig.values[1], 3)} — 두 값의
                  차이가 크지 않아 어느 한 방향으로도 곡선 구조를 대표하지 못함.
                </p>
              </div>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
