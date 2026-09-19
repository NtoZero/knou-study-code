"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { FACES, FACE_SIZE, faceEigen, meanReconError, reconstruct } from "./eigenfaceCore";
import { Card, Formula, Note, Stat, ROSE, SKY, SLATE, fmt, linScale } from "./ui";

/** 교재 7.2.2의 유도 흐름 — 식 번호는 교재 그대로 */
const DERIVATION = [
  {
    title: "파라미터 = 기저벡터",
    eq: "x = Σⱼ₌₁ⁿ (xᵀuⱼ)uⱼ",
    tag: "식 7-5",
    body: "선형 특징추출에서 찾아야 하는 파라미터는 특정 목적을 만족하는 기저벡터. n차원 입력공간을 나타내는 임의의 기저벡터 집합 {u₁, …, u_n}을 파라미터로 두면 임의의 데이터 x를 위와 같이 쓸 수 있음. 기저벡터는 서로 직교이면서 크기가 1인 직교단위기저라고 가정.",
  },
  {
    title: "m개만 골라 근사",
    eq: "x̃ = Σⱼ₌₁ᵐ (xᵀuⱼ)uⱼ",
    tag: "식 7-6",
    body: "n개의 기저벡터를 모두 쓰면 정보 손실이 없음. 그러나 저차원 특징을 얻는 것이 목적이므로 n개 중 m(m < n)개만 선택해 x를 근사함.",
  },
  {
    title: "정보손실량 J",
    eq: "J = (1/N) Σᵢ ‖xᵢ − x̃ᵢ‖² = (1/N) Σᵢ Σⱼ₌ₘ₊₁ⁿ (xᵢᵀuⱼ)² = Σⱼ₌ₘ₊₁ⁿ uⱼᵀSuⱼ",
    tag: "식 7-7",
    body: "원래 x와 근사한 x̃의 차이가 손실되는 정보. 데이터 집합 전체에 대해 두 벡터 차의 크기를 모두 합해 정보손실량을 정의함. 버린 기저벡터 방향의 성분만 남기 때문에 j = m+1부터 n까지의 합이 됨.",
  },
  {
    title: "S는 공분산행렬",
    eq: "S = (1/N) Σᵢ xᵢxᵢᵀ",
    tag: "식 7-8",
    body: "데이터들의 평균이 0이 되도록 센터링되었다고 가정하므로 S는 공분산행렬. 따라서 J를 최소화하는 것은 사영한 특징값들의 분산이 최소인 기저벡터를 찾아 제거하는 것, 바꿔 말하면 분산이 최대인 것부터 m개를 선택하고 나머지 n − m개를 버리는 것.",
  },
  {
    title: "단위벡터 조건 결합 — 라그랑주 승수",
    eq: "J̃(u) = uᵀSu − λ(1 − uᵀu)  →  Su = λu",
    tag: "식 7-9, 7-10",
    body: "기저벡터가 단위벡터여야 한다는 조건을 라그랑주 승수로 결합한 변형된 목적함수를 u에 대해 미분해 극값 지점을 찾으면 Su = λu. 고유벡터의 정의로부터, 목적함수를 최소화하는 u와 라그랑주 승수 λ는 각각 S의 고유벡터와 고유치.",
  },
  {
    title: "고유치 = 사영한 특징값의 분산",
    eq: "uᵀSu = λ",
    tag: "식 7-11",
    body: "Su = λu의 양변에 uᵀ를 곱한 식. S의 정의를 대입하면, 공분산행렬의 고유치는 해당 고유벡터로 데이터를 사영해 얻은 특징값들의 분산값을 나타냄.",
  },
  {
    title: "결론",
    eq: "J = Σⱼ₌ₘ₊₁ⁿ uⱼᵀSuⱼ = Σⱼ₌ₘ₊₁ⁿ λⱼ",
    tag: "식 7-12",
    body: "목적함수의 최소화는 공분산행렬의 고유치가 가장 큰 것부터 순서대로 m개의 기저벡터를 선택하고 나머지를 버림으로써 가능. 정보손실량은 버린 고유치의 합.",
  },
];

const THUMBS = [0, 3, 7, 12, 18, 25, 31, 36];

function FaceImg({
  data,
  size = 64,
  signed = false,
  label,
  ring = false,
}: {
  data: number[];
  size?: number;
  signed?: boolean;
  label?: string;
  ring?: boolean;
}) {
  const maxAbs = signed ? Math.max(...data.map((v) => Math.abs(v))) || 1 : 1;
  return (
    <figure className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${FACE_SIZE} ${FACE_SIZE}`}
        width={size}
        height={size}
        shapeRendering="crispEdges"
        className={`rounded ${ring ? "ring-2 ring-rose-500" : "ring-1 ring-gray-200 dark:ring-gray-700"}`}
      >
        {data.map((v, k) => {
          const t = signed ? 0.5 + v / (2 * maxAbs) : v;
          const g = Math.round(Math.min(1, Math.max(0, t)) * 255);
          return (
            <rect key={k} x={k % FACE_SIZE} y={Math.floor(k / FACE_SIZE)} width={1} height={1} fill={`rgb(${g},${g},${g})`} />
          );
        })}
      </svg>
      {label && <figcaption className="mt-1 text-center text-[10px] text-gray-500">{label}</figcaption>}
    </figure>
  );
}

export default function PCADerivation() {
  const [dstep, setDstep] = useState(0);
  const pca = useMemo(() => faceEigen(), []);
  const K = pca.values.length;
  const [face, setFace] = useState(0);
  const [m, setM] = useState(5);
  const [theta, setTheta] = useState(0.98);

  const cumulative = useMemo(() => {
    let c = 0;
    return pca.values.map((v) => (c += v) / pca.total);
  }, [pca]);
  const mTheta = cumulative.findIndex((r) => r > theta) + 1;

  const rec = reconstruct(FACES[face], pca, m);
  const r = m === 0 ? 0 : cumulative[m - 1];
  const lossEig = pca.values.slice(m).reduce((s, v) => s + v, 0);
  const lossMeasured = useMemo(() => meanReconError(pca, m), [pca, m]);

  const bx = linScale(0, K, 34, 400);
  const by = linScale(0, pca.values[0] * 1.08, 150, 12);
  const ry = linScale(0, 1, 150, 12);

  const d = DERIVATION[dstep];

  return (
    <section>
      <SectionTitle
        title="7.2.2 주성분분석법의 수학적 유도"
        subtitle="정보손실 최소화 = 분산 최대화 = 공분산행렬의 큰 고유치부터 m개"
      />

      <div className="space-y-6">
        <Sourced
          refs={{
            textbook: "7.2.2 주성분분석법의 수학적 유도 (식 7-5 ~ 7-12)",
          }}
        >
          <Card title="유도 따라가기">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {DERIVATION.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setDstep(i)}
                  className={`h-7 w-7 rounded-full text-xs font-bold ${
                    dstep === i ? "bg-rose-500 text-white" : i < dstep ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300" : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={dstep} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }} className="min-h-[170px]">
                <p className="mb-2 text-sm font-bold text-rose-600 dark:text-rose-400">{d.title}</p>
                <Formula tag={d.tag}>{d.eq}</Formula>
                <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{d.body}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-3 flex justify-between">
              <button type="button" disabled={dstep === 0} onClick={() => setDstep((s) => s - 1)} className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-600 disabled:opacity-40 dark:bg-gray-800 dark:text-gray-300">
                <ChevronLeft size={13} /> 이전
              </button>
              <button type="button" disabled={dstep === DERIVATION.length - 1} onClick={() => setDstep((s) => s + 1)} className="flex items-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-xs text-white disabled:opacity-40">
                다음 <ChevronRight size={13} />
              </button>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7.2.2 — 식 7-13, 역치값 θ",
            slides: "PCA의 수학적 유도 — 축소되는 차원 m을 선택하는 기준",
          }}
        >
          <Card title="몇 차원으로 줄일 것인가 — r(n, m)과 θ">
            <Formula tag="식 7-13">r(n, m) = Σᵢ₌₁ᵐ λᵢ / Σᵢ₌₁ⁿ λᵢ ,  m은 Σᵢ₌₁ᵐ λᵢ / Σᵢ₌₁ⁿ λᵢ &gt; θ 가 되도록 결정</Formula>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              (식 7-12)의 우변을 전체 고유치 합으로 나누면 손실되는 정보량의 비중, 반대로 r(n, m)은 m개의
              특징으로 표현 가능한 정보의 비율. θ = 0.98은 정보 손실량이 전체의 2% 이하라는 뜻. 미리
              비율을 정하는 방법 외에 고유치의 변화를 이용해 m을 정하는 방법도 있음.
            </p>

            <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-950">
              <svg viewBox="0 0 410 170" className="w-full min-w-[360px] text-gray-200 dark:text-gray-800">
                <line x1={34} y1={150} x2={402} y2={150} stroke="currentColor" />
                <line x1={34} y1={12} x2={34} y2={150} stroke="currentColor" />
                <text x={2} y={12} fontSize="9" fill={SLATE}>
                  λ
                </text>
                <text x={380} y={165} fontSize="9" fill={SLATE}>
                  순서
                </text>
                {pca.values.map((v, i) => (
                  <rect
                    key={i}
                    x={bx(i) + 1}
                    y={by(v)}
                    width={Math.max(1, bx(1) - bx(0) - 2)}
                    height={150 - by(v)}
                    fill={i < m ? ROSE : "#cbd5e1"}
                    opacity={i < m ? 0.9 : 0.6}
                  />
                ))}
                <path d={cumulative.map((c, i) => `${i ? "L" : "M"}${bx(i + 0.5)},${ry(c)}`).join(" ")} fill="none" stroke={SKY} strokeWidth="1.8" />
                <line x1={34} y1={ry(theta)} x2={402} y2={ry(theta)} stroke={SKY} strokeDasharray="4 3" />
                <text x={400} y={ry(theta) - 3} fontSize="9" textAnchor="end" fill={SKY}>
                  θ = {theta.toFixed(2)}
                </text>
                <line x1={bx(mTheta)} y1={12} x2={bx(mTheta)} y2={150} stroke="#059669" strokeDasharray="3 2" />
                <text x={bx(mTheta) + 3} y={24} fontSize="9" fill="#059669" fontWeight="bold">
                  m = {mTheta}
                </text>
              </svg>
            </div>
            <p className="mt-1 text-[11px] text-gray-400">막대: 고유치 λᵢ (큰 것부터) · 파란 선: 누적 비율 r(n, m)</p>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-xs text-gray-500">
                역치값 θ = {theta.toFixed(2)}
                <input type="range" min={0.7} max={0.99} step={0.01} value={theta} onChange={(e) => setTheta(+e.target.value)} className="w-full accent-sky-500" />
              </label>
              <div className="flex items-end">
                <button type="button" onClick={() => setM(mTheta)} className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-600">
                  r(n, m) &gt; θ 를 만족하는 최소 m = {mTheta} 적용
                </button>
              </div>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "[예] 얼굴 영상의 표현 — Eigenface",
          }}
        >
          <Card title="[예] 얼굴 영상의 표현 — 아이겐페이스로 복원하기">
            <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              n차원 얼굴 영상을 m개의 기저벡터로 표현(n ≫ m). W를 구성하는 좋은 기저벡터가{" "}
              <strong>Eigenface</strong> — 얼굴 영상에 PCA를 적용하여 찾아진 고유벡터를 영상으로 표현한 것.
            </p>
            <Formula>y = Wᵀx  ⇒  x ≈ Wy = y₁w₁ + y₂w₂ + … + y_m w_m</Formula>
            <p className="mt-1 text-[11px] text-gray-400">
              영상으로 보이기 위해 평균 얼굴을 뺀 뒤 사영하고, 복원한 뒤 평균 얼굴을 다시 더함.
            </p>

            <div className="mt-4">
              <p className="mb-1.5 text-xs text-gray-500">얼굴 영상 고르기 (16 × 16 = 256차원)</p>
              <div className="flex flex-wrap gap-2">
                {THUMBS.map((i) => (
                  <button key={i} type="button" onClick={() => setFace(i)} aria-label={`얼굴 ${i + 1}`}>
                    <FaceImg data={FACES[i]} size={40} ring={face === i} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[auto_minmax(0,1fr)]">
              <div className="flex items-center gap-3">
                <FaceImg data={FACES[face]} size={96} label="원 영상 x" />
                <span className="text-lg text-gray-400">≈</span>
                <FaceImg data={rec.image} size={96} label={`복원 영상 (m = ${m})`} />
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-gray-500">
                  사용할 아이겐페이스 수 m = {m}
                  <input type="range" min={0} max={K} value={m} onChange={(e) => setM(+e.target.value)} className="w-full accent-rose-500" />
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Stat label="r(n, m)" value={fmt(r, 4)} tone="accent" />
                  <Stat label="손실 비중 1 − r" value={`${fmt((1 - r) * 100, 2)}%`} />
                  <Stat label="Σⱼ₌ₘ₊₁ λⱼ (식 7-12)" value={fmt(lossEig, 4)} />
                  <Stat label="(1/N)Σ‖xᵢ − x̃ᵢ‖² (식 7-7)" value={fmt(lossMeasured, 4)} tone="good" />
                </div>
                <p className="text-xs leading-relaxed text-gray-500">
                  오른쪽 두 값은 서로 다른 방법으로 구한 것 — 하나는 버린 고유치를 더했고, 하나는 40장을
                  실제로 복원해 오차를 잰 것. 항상 일치함.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-1.5 text-xs text-gray-500">
                평균 얼굴과 아이겐페이스 u₁ ~ u₈ (회색 = 0, 밝을수록 +, 어두울수록 −)
              </p>
              <div className="flex flex-wrap gap-2">
                <FaceImg data={pca.mean} size={52} label="평균" />
                {pca.vectors.slice(0, 8).map((u, j) => (
                  <FaceImg key={j} data={u} size={52} signed label={`u${j + 1} · y=${fmt(rec.ys[j] ?? 0, 2)}`} ring={j < m} />
                ))}
              </div>
            </div>
          </Card>
        </Sourced>

        <Note>
          실습 영상은 얼굴 윤곽·눈·입·머리카락의 위치와 크기를 조금씩 바꿔 그린 16 × 16 영상 40장.
          이 데이터에서 0이 아닌 고유치는 {K}개. 고유치·아이겐페이스·복원 영상·오차는 모두
          화면에서 직접 계산함.
        </Note>
      </div>
    </section>
  );
}
