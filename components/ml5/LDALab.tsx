"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import {
  angleOf,
  covariance,
  dirOf,
  eigenSym,
  fisherJ,
  inv2,
  matVec,
  meanVec,
  mulberry32,
  sample2D,
  scatter,
  matAdd,
  sub,
  unit,
} from "./featureCore";
import { Card, DefinitionBox, Formula, MatrixView, Note, Stat, CLASS_COLORS, SLATE, fmt, linScale } from "./ui";

/* [그림 7-9]처럼 비스듬히 길게 늘어선 두 클래스가 나란히 놓인 데이터 */
const LONG = 30;
const SEP = 110;
const CENTER: [number, number] = [0, 0];
const offs = dirOf(SEP).map((v) => v * 1.15);
const C1 = sample2D(mulberry32(501), 45, [CENTER[0] + offs[0], CENTER[1] + offs[1]], LONG, 2.2, 0.45);
const C2 = sample2D(mulberry32(502), 45, [CENTER[0] - offs[0], CENTER[1] - offs[1]], LONG, 2.2, 0.45);

const V = 280;
const R = 8;
const sx = linScale(-R, R, 10, V - 10);
const sy = linScale(-R, R, V - 10, 10);

const H_LO = -8;
const H_HI = 8;
const BINS = 40;

function hist(vals: number[]) {
  const h = new Array(BINS).fill(0);
  for (const v of vals) {
    const k = Math.min(BINS - 1, Math.max(0, Math.floor(((v - H_LO) / (H_HI - H_LO)) * BINS)));
    h[k]++;
  }
  return h;
}

export default function LDALab() {
  const base = useMemo(() => {
    const m1 = meanVec(C1);
    const m2 = meanVec(C2);
    const SW = matAdd(scatter(C1, m1), scatter(C2, m2));
    const SWi = inv2(SW)!;
    const wLda = unit(matVec(SWi, sub(m1, m2)));
    const wMean = unit(sub(m1, m2));
    const all = [...C1, ...C2];
    const wPca = eigenSym(covariance(all)).vectors[0];
    const curve = Array.from({ length: 181 }, (_, d) => ({ d, J: fisherJ(C1, C2, dirOf(d)).J }));
    return {
      m1,
      m2,
      SW,
      mu: meanVec(all),
      dirs: [
        { key: "pca", label: "PCA 1차 주성분", deg: angleOf(wPca), color: "#059669" },
        { key: "mean", label: "평균의 차 m₁ − m₂", deg: angleOf(wMean), color: "#d97706" },
        { key: "lda", label: "LDA  w ∝ S_W⁻¹(m₁ − m₂)", deg: angleOf(wLda), color: "#e11d48" },
      ],
      curve,
    };
  }, []);

  const [deg, setDeg] = useState(Math.round(base.dirs[0].deg));
  const w = dirOf(deg);
  const f = fisherJ(C1, C2, w);
  // 투영값을 전체 평균 기준으로 옮겨 그림
  const shift = w[0] * base.mu[0] + w[1] * base.mu[1];
  const h1 = hist(f.p1.map((v) => v - shift));
  const h2 = hist(f.p2.map((v) => v - shift));
  const hMax = Math.max(...h1, ...h2, 1);
  const hx = linScale(0, BINS, 16, 384);
  const hy = linScale(0, hMax, 0, 56);

  const jMax = Math.max(...base.curve.map((c) => c.J));
  const cx = linScale(0, 180, 34, 400);
  const cy = linScale(0, jMax * 1.12, 130, 12);

  return (
    <section>
      <SectionTitle
        title="7.3.1 선형판별분석 알고리즘"
        subtitle="클래스 간 거리는 멀게, 같은 클래스 안은 결집되게 — 분류에 적합한 사영 방향"
      />

      <div className="space-y-6">
        <Sourced
          refs={{
            textbook: "7.3.1 선형판별분석 알고리즘",
            slides: "선형판별분석 — 목적",
          }}
        >
          <DefinitionBox label="선형판별분석법의 목적">
            <p>
              주성분분석과 마찬가지로 (식 7-2)와 같은 선형변환으로 특징을 추출하지만, 변환행렬 W를
              최적화하는 목적함수를 정의하면서 <strong>클래스 정보를 적극적으로 활용</strong>. 클래스 간
              판별이 잘 되는 방향으로 차원을 축소함.
            </p>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              분류에 적합한 특징의 방향 → 각 클래스가 가능한 서로 멀리 떨어질 수 있도록 그 거리를 유지하는
              방향.
            </p>
          </DefinitionBox>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7.3.1 — 식 7-14 ~ 7-18",
            slides: "LDA: 이진 분류",
            lecture: "s_k에는 1/N이 없어 엄밀히 분산은 아니고 클래스별 분산에 비례하는 값이며, J를 키우려면 분모는 작고 분자는 커야 한다고 풀어 설명함",
          }}
        >
          <Card title="이진 분류 — 클래스 간 거리에 대한 목적함수">
            <div className="space-y-2">
              <Formula tag="식 7-14">J = (m₂ − m₁)² / (s₁² + s₂²)</Formula>
              <Formula tag="식 7-15">m_k = (1/|C_k|) Σ<sub>xᵢ∈C_k</sub> wᵀxᵢ = wᵀm_k</Formula>
              <Formula tag="식 7-16">s_k = Σ<sub>xᵢ∈C_k</sub> (wᵀxᵢ − m_k)² = Σ<sub>xᵢ∈C_k</sub> wᵀ(xᵢ − m_k)(xᵢ − m_k)ᵀw</Formula>
              <Formula tag="식 7-17">J(w) = wᵀ(m₁ − m₂)(m₁ − m₂)ᵀw / wᵀ Σₖ Σ<sub>xᵢ∈C_k</sub> (xᵢ − m_k)(xᵢ − m_k)ᵀ w = wᵀS_B w / wᵀS_W w</Formula>
              <Formula tag="식 7-18">w ∝ S_W⁻¹(m₁ − m₂)</Formula>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg bg-rose-50 p-3 text-xs leading-relaxed text-gray-700 dark:bg-rose-950/30 dark:text-gray-300">
                <strong>분자</strong> — 클래스 C_k에 속하는 데이터를 w로 사영해 얻은 1차원 특징값의 평균
                m_k(= 평균 벡터 m_k를 w 방향으로 사영한 값) 사이의 거리. 클수록 두 평균이 멀리 떨어져 분류가
                쉬워짐. <strong>S_B</strong>는 두 클래스 간의 흩어진 정도 — 클래스 간 산점행렬(between-scatter
                matrix).
              </div>
              <div className="rounded-lg bg-sky-50 p-3 text-xs leading-relaxed text-gray-700 dark:bg-sky-950/30 dark:text-gray-300">
                <strong>분모</strong> — s_k는 변환 후 특징 데이터 집합에서 클래스별 분산에 비례하는 값.
                작을수록 같은 클래스 안에서 서로 결집됨. <strong>S_W</strong>는 각 클래스 내에서 데이터가
                흩어진 정도를 모두 합한 것 — 클래스 내 산점행렬(within-scatter matrix).
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              J를 최대로 하는 w는 분자를 최대로, 분모를 최소로 하는 방향. 만약 S_W를 고려하지 않으면 w는 두
              평균의 차 벡터에 비례하는 형태가 됨.
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-gray-400">
              (식 7-14)의 분모는 s₁² + s₂²로 적혀 있지만 (식 7-16)의 s_k는 이미 제곱의 합이므로, (식
              7-17)로 옮긴 분모 wᵀS_W w는 (식 7-16)의 s₁ + s₂와 같음. 아래 계산은 (식 7-17)을 그대로 따름.
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7.3.1 — [그림 7-9] 클래스 레이블을 고려한 선형변환",
            slides: "선형판별분석 — 분류에 적합한 1차원 특징을 찾으려면 어느 방향으로 사영?",
          }}
        >
          <Card title="방향을 돌려 J(w) 재 보기">
            <div className="mb-3 flex flex-wrap gap-2">
              {base.dirs.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setDeg(Math.round(d.deg * 2) / 2)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-white"
                  style={{ backgroundColor: d.color }}
                >
                  {d.label} ({fmt(d.deg, 1)}°)
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
              <svg viewBox={`0 0 ${V} ${V}`} className="w-full rounded-lg border border-gray-200 bg-white text-gray-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-800">
                <line x1={sx(0)} y1={10} x2={sx(0)} y2={V - 10} stroke="currentColor" />
                <line x1={10} y1={sy(0)} x2={V - 10} y2={sy(0)} stroke="currentColor" />
                <line x1={sx(base.mu[0] - w[0] * 9)} y1={sy(base.mu[1] - w[1] * 9)} x2={sx(base.mu[0] + w[0] * 9)} y2={sy(base.mu[1] + w[1] * 9)} stroke="#111827" strokeWidth="1.5" className="dark:stroke-gray-200" />
                {C1.map((p, i) => (
                  <circle key={`a${i}`} cx={sx(p[0])} cy={sy(p[1])} r={2.6} fill="none" stroke={CLASS_COLORS[0]} />
                ))}
                {C2.map((p, i) => (
                  <text key={`b${i}`} x={sx(p[0])} y={sy(p[1]) + 3} fontSize="8" textAnchor="middle" fill={CLASS_COLORS[1]}>
                    +
                  </text>
                ))}
                {[base.m1, base.m2].map((mm, k) => (
                  <circle key={k} cx={sx(mm[0])} cy={sy(mm[1])} r={5} fill={CLASS_COLORS[k]} stroke="white" strokeWidth="1.5" />
                ))}
              </svg>

              <div className="space-y-3">
                <label className="block text-xs text-gray-500">
                  사영 방향 {fmt(deg, 1)}°
                  <input type="range" min={0} max={180} step={0.5} value={deg} onChange={(e) => setDeg(+e.target.value)} className="w-full accent-rose-500" />
                </label>
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-950">
                  <svg viewBox="0 0 400 124" className="w-full min-w-[320px] text-gray-200 dark:text-gray-800">
                    <line x1={16} y1={62} x2={384} y2={62} stroke="currentColor" />
                    {h1.map((c, k) => (
                      <rect key={`x${k}`} x={hx(k) + 0.5} y={62 - hy(c)} width={hx(1) - hx(0) - 1} height={hy(c)} fill={CLASS_COLORS[0]} opacity={0.75} />
                    ))}
                    {h2.map((c, k) => (
                      <rect key={`y${k}`} x={hx(k) + 0.5} y={62} width={hx(1) - hx(0) - 1} height={hy(c)} fill={CLASS_COLORS[1]} opacity={0.75} />
                    ))}
                  </svg>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-950">
                  <svg viewBox="0 0 410 150" className="w-full min-w-[320px] text-gray-200 dark:text-gray-800">
                    <line x1={34} y1={130} x2={400} y2={130} stroke="currentColor" />
                    <line x1={34} y1={10} x2={34} y2={130} stroke="currentColor" />
                    <text x={4} y={16} fontSize="10" fill={SLATE}>
                      J(w)
                    </text>
                    {[0, 45, 90, 135, 180].map((d) => (
                      <text key={d} x={cx(d)} y={143} fontSize="9" textAnchor="middle" fill={SLATE}>
                        {d}°
                      </text>
                    ))}
                    <path d={base.curve.map((c, i) => `${i ? "L" : "M"}${cx(c.d)},${cy(c.J)}`).join(" ")} fill="none" stroke="#64748b" strokeWidth="1.8" />
                    {base.dirs.map((d) => (
                      <line key={d.key} x1={cx(d.deg)} y1={12} x2={cx(d.deg)} y2={130} stroke={d.color} strokeDasharray="3 2" />
                    ))}
                    <circle cx={cx(deg)} cy={cy(f.J)} r={5} fill="#e11d48" />
                  </svg>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <Stat label="m₁ = wᵀm₁" value={fmt(f.mt1, 3)} />
                  <Stat label="m₂ = wᵀm₂" value={fmt(f.mt2, 3)} />
                  <Stat label="분자 (m₂ − m₁)²" value={fmt(f.num, 3)} />
                  <Stat label="s₁ (식 7-16)" value={fmt(f.s1, 2)} />
                  <Stat label="s₂ (식 7-16)" value={fmt(f.s2, 2)} />
                  <Stat label="J(w) = wᵀS_Bw / wᵀS_Ww" value={fmt(f.J, 4)} tone="accent" />
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              J 곡선은 0°~180° 모든 방향에서 직접 계산한 값. 분산이 가장 큰 PCA 방향에서는 두 클래스가 겹쳐 J가
              작고, 평균의 차 방향은 그보다 낫지만 최대는 아님. 최댓값은 정확히 S_W⁻¹(m₁ − m₂) 방향에서
              나옴.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
              <span>이 데이터의 S_W =</span>
              <MatrixView rows={base.SW} digits={1} />
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7.3.1 — 식 7-19, 7-20",
            slides: "LDA: 다중 클래스 분류",
          }}
        >
          <Card title="다중 클래스 분류로 확장 — 벡터 w에서 행렬 W로">
            <p className="mb-3 text-xs text-gray-500">목적함수 → 각 클래스 내의 산점도는 작게, 클래스 간의 산점도는 크게</p>
            <div className="space-y-2">
              <Formula tag="식 7-19">J(W) = Trace{"{"}(WS_WWᵀ)⁻¹(WS_BWᵀ){"}"}</Formula>
              <Formula tag="식 7-20">S_W = Σₖ₌₁ᴹ S_k = Σₖ₌₁ᴹ Σ<sub>xᵢ∈C_k</sub> (xᵢ − m_k)(xᵢ − m_k)ᵀ</Formula>
              <Formula>S_B = Σₖ₌₁ᴹ N_k (m_k − m)(m_k − m)ᵀ</Formula>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <li>· Trace → 정방행렬의 대각원소의 합을 계산하는 연산</li>
              <li>· N_k → 클래스 C_k에 속한 데이터의 수, m → 전체 데이터 집합에 대한 평균</li>
              <li>
                · 목적함수를 최대로 하는 W → <strong>S_W⁻¹S_B의 고유치 분석</strong>을 통해 m개의 고유벡터들을
                열벡터로 가지는 행렬: S_W⁻¹S_B = UΛUᵀ, W = [u₁, …, u_m]
              </li>
            </ul>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7.3.1 — 선형판별분석(LDA) 알고리즘의 수행 단계",
            slides: "LDA 알고리즘의 수행 단계",
          }}
        >
          <Card title="PCA와 LDA의 수행 단계 나란히 보기">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-xs">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="border-b border-gray-200 p-2 dark:border-gray-700">단계</th>
                    <th className="border-b border-gray-200 p-2 text-sky-600 dark:border-gray-700">PCA</th>
                    <th className="border-b border-gray-200 p-2 text-rose-600 dark:border-gray-700">LDA</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  {[
                    ["①", "입력 데이터 X의 평균 μₓ와 공분산 Σₓ 계산", "X를 클래스 레이블에 따라 M개 클래스로 나누어 각각 평균 m_k와 S_B, S_W 계산 — m_k = (1/N_k) Σ(xᵢ∈C_k) xᵢ"],
                    ["②", "고유치 분석 Σₓ = UΛUᵀ", "고유치 분석 S_W⁻¹S_B = UΛUᵀ"],
                    ["③", "고유치가 큰 것부터 m개 선택", "고유치가 큰 것부터 m개 선택"],
                    ["④", "W = [u₁, …, u_m] 생성", "W = [u₁, …, u_m] 생성"],
                    ["⑤", "Y = WᵀX", "Y = WᵀX"],
                  ].map(([s, a, b]) => (
                    <tr key={s} className={s === "①" || s === "②" ? "bg-rose-50/50 dark:bg-rose-950/20" : ""}>
                      <td className="border-b border-gray-100 p-2 font-bold dark:border-gray-800">{s}</td>
                      <td className="border-b border-gray-100 p-2 dark:border-gray-800">{a}</td>
                      <td className="border-b border-gray-100 p-2 dark:border-gray-800">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-500">색칠된 ①, ②단계만 다르고 ③~⑤는 같음.</p>
          </Card>
        </Sourced>

        <Note>
          두 클래스는 30° 방향으로 길게 늘어선 정규분포에서 45개씩 뽑은 데이터(시드 고정). m₁, m₂, S_W,
          J(w)와 세 방향은 모두 화면에서 직접 계산함.
        </Note>
      </div>
    </section>
  );
}
