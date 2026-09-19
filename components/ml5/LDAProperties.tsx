"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ArrowDown, AlertTriangle, CheckCircle2 } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { gaussian, ldaEigen, ldaStats, mulberry32, type Vec } from "./featureCore";
import { Card, Pill, Stat, ROSE, SLATE, fmt, linScale } from "./ui";

const DIM = 6;
const PER = 20;

/** 6차원 공간에 M개 클래스 — 클래스마다 20개 */
function makeClasses(M: number): Vec[][] {
  const rng = mulberry32(700 + M);
  const out: Vec[][] = [];
  for (let k = 0; k < M; k++) {
    const c = Array.from({ length: DIM }, () => gaussian(rng) * 2.2);
    out.push(Array.from({ length: PER }, () => c.map((v) => v + gaussian(rng))));
  }
  return out;
}

const IMAGE_PRESETS = [
  { label: "150 × 100 영상", n: 15000 },
  { label: "28 × 28 영상", n: 784 },
  { label: "8 × 8 영상", n: 64 },
];

export default function LDAProperties() {
  const [M, setM] = useState(3);
  const eig = useMemo(() => {
    const st = ldaStats(makeClasses(M));
    return ldaEigen(st.SW, st.SB);
  }, [M]);
  const values = eig?.values ?? [];
  const nonzero = values.filter((v) => v > 1e-8).length;
  const vMax = Math.max(...values, 1e-9);
  const bx = linScale(0, DIM, 40, 380);
  const by = linScale(0, vMax * 1.1, 130, 12);

  const [nIdx, setNIdx] = useState(0);
  const [N, setN] = useState(5000);
  const n = IMAGE_PRESETS[nIdx].n;
  const singular = N <= n;

  return (
    <section>
      <SectionTitle
        title="7.3.2 선형판별분석법의 특성과 문제점"
        subtitle="PCA와 처리 단계가 비슷해 문제점도 대부분 공유 — 여기에 LDA만의 제약 두 가지"
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Sourced
            refs={{
              textbook: "7.3.2 선형판별분석법의 특성과 문제점",
              slides: "LDA의 특성과 문제점 — 지도학습 능력",
            }}
          >
            <Card title="지도학습 능력" className="h-full">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                여러 계산상의 제약점과 불안정성이 있지만, 주성분분석이나 요인분석 등이 가지지 못하는{" "}
                <strong>지도학습 능력</strong>을 갖추고 있어 주성분분석으로 만족할 만한 결과를 얻지 못할 때
                그 대안으로 널리 사용됨.
              </p>
            </Card>
          </Sourced>
          <Sourced
            refs={{
              textbook: "7.3.2 — 첫째, 선형변환의 한계",
              slides: "LDA의 특성과 문제점 — 선형변환의 한계",
            }}
          >
            <Card title="선형변환의 한계" className="h-full">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                선형변환에 의한 특징추출이므로 데이터 집합 전체, 또는 각 클래스 집합이 복잡한 비선형 구조를
                가진 경우에는 적절한 변환이 불가.
              </p>
              <p className="mt-2 text-xs text-gray-500">해결 방안 → 커널법, 비선형 매니폴드 학습법 등 활용</p>
            </Card>
          </Sourced>
        </div>

        <Sourced
          refs={{
            textbook: "7.3.2 — 둘째, 고유벡터 개수 m의 결정과 S_B의 랭크",
            slides: "LDA의 특성과 문제점 — 선택하는 고유벡터의 개수(축소된 특징 차원) m의 결정",
            lecture: "클래스가 M개면 고유치가 0이 아닌 고유벡터는 M − 1개로 제한되고, 이진 분류라면 특징은 값 하나뿐이라는 점을 기억하라고 강조함",
          }}
        >
          <Card title="고유벡터의 개수 m — 최대 M − 1">
            <ul className="mb-4 space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
              <li>
                · 일반적 방법 → PCA의 (식 7-13) 같은 명시적인 값을 찾기 힘들어, 직접 분류를 수행해 얻어지는{" "}
                <strong>분류율</strong>을 기준으로 선택
              </li>
              <li>
                · 그에 앞서 유의할 점 — S_B는 클래스 개수만큼 주어지는 평균 벡터 m_k로 정의되는 행렬이라 그
                랭크가 클래스 개수에 한정됨. 클래스가 M개면 S_B의 랭크는 M − 1, 따라서 S_W⁻¹S_B의 랭크도 최대
                M − 1
              </li>
              <li>
                · ⇒ 고유치가 0이 아닌 고유벡터는 최대 M − 1개 → LDA로 찾는 특징벡터는{" "}
                <strong className="text-rose-600 dark:text-rose-400">최대 (M − 1)차원</strong>
              </li>
            </ul>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500">클래스 개수 M</span>
              {[2, 3, 4, 5].map((k) => (
                <Pill key={k} on={M === k} onClick={() => setM(k)}>
                  M = {k}
                </Pill>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-950">
                <svg viewBox="0 0 390 150" className="w-full min-w-[320px] text-gray-200 dark:text-gray-800">
                  <line x1={40} y1={130} x2={384} y2={130} stroke="currentColor" />
                  <line x1={40} y1={10} x2={40} y2={130} stroke="currentColor" />
                  <text x={4} y={14} fontSize="9" fill={SLATE}>
                    고유치
                  </text>
                  {values.map((v, i) => (
                    <g key={i}>
                      <rect x={bx(i) + 8} y={by(Math.max(v, 0))} width={bx(1) - bx(0) - 16} height={130 - by(Math.max(v, 0))} fill={v > 1e-8 ? ROSE : "#cbd5e1"} />
                      <text x={bx(i + 0.5)} y={144} fontSize="9" textAnchor="middle" fill={SLATE}>
                        λ{i + 1}
                      </text>
                      <text x={bx(i + 0.5)} y={by(Math.max(v, 0)) - 3} fontSize="9" textAnchor="middle" fill={v > 1e-8 ? ROSE : SLATE}>
                        {v > 1e-8 ? fmt(v, 2) : "0"}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
              <div className="space-y-2">
                <Stat label="입력 차원 n" value={DIM} />
                <Stat label="고유치가 0이 아닌 고유벡터" value={`${nonzero}개`} tone="accent" />
                <Stat label="M − 1" value={M - 1} />
              </div>
            </div>
            <p className="mt-2 text-[11px] text-gray-400">
              6차원 데이터, 클래스마다 20개(시드 고정). S_W, S_B를 계산한 뒤 S_W⁻¹S_B의 고유치를 직접 구한
              결과. 입력이 6차원이어도 클래스가 M개면 0이 아닌 고유치는 M − 1개뿐.
            </p>
            <div className="mt-3 rounded-lg border-l-4 border-rose-500 bg-rose-50 p-3 text-xs leading-relaxed text-gray-700 dark:bg-rose-950/30 dark:text-gray-300">
              <strong>이진 분류(M = 2)</strong>이면 하나의 특징값만 찾을 수 있고, 찾아진 특징값의 범위에 따라
              클래스가 정해지므로 특징추출 과정이 곧 판별함수를 계산하는 것과 같아짐 — &lsquo;선형판별분석법&rsquo;이라는
              이름이 붙은 이유.
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7.3.2 — 작은 표본 집합의 문제",
            slides: "LDA의 특성과 문제점 — 작은 표본집합의 문제",
            lecture: "150 × 100 영상이면 입력이 15,000차원인데 데이터가 5,000개뿐인 경우처럼, 영상에서 흔히 생긴다는 예를 듦",
          }}
        >
          <Card title="작은 표본 집합의 문제 small sample set problem">
            <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              고유치 분석을 위해 S_W의 역행렬을 계산해야 하는데, 데이터의 수가 입력 차원보다 크지 않으면
              S_W가 특이행렬이 되어 역행렬을 찾을 수 없음 → 고유치 분석 불가. 입력 차원이 큰 영상 데이터에서
              자주 발생.
            </p>
            <div className="mb-3 flex flex-wrap gap-2">
              {IMAGE_PRESETS.map((p, i) => (
                <Pill key={p.label} on={nIdx === i} onClick={() => setNIdx(i)}>
                  {p.label}
                </Pill>
              ))}
            </div>
            <label className="block text-xs text-gray-500">
              학습 데이터 수 N = {N.toLocaleString()}
              <input type="range" min={100} max={20000} step={100} value={N} onChange={(e) => setN(+e.target.value)} className="w-full accent-rose-500" />
            </label>

            <div className="mt-3 grid grid-cols-1 items-stretch gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
              <FlowCell title="입력" body={`n = ${n.toLocaleString()}차원, N = ${N.toLocaleString()}개`} />
              <FlowArrow />
              {singular ? (
                <FlowCell title="바로 LDA" body="N ≤ n → S_W 역행렬이 존재하지 않음" tone="bad" />
              ) : (
                <FlowCell title="바로 LDA" body="N > n → 데이터 수가 입력 차원보다 많아 작은 표본 집합의 문제 조건에는 해당하지 않음" tone="good" />
              )}
              <FlowArrow />
              <FlowCell
                title="실용적 접근법"
                body="PCA로 먼저 차원을 축소한 특징을 얻고, 그 특징 데이터에 대해 LDA 적용"
                tone="accent"
              />
            </div>
          </Card>
        </Sourced>

      </div>
    </section>
  );
}

function FlowCell({
  title,
  body,
  tone = "default",
}: {
  title: string;
  body: string;
  tone?: "default" | "good" | "bad" | "accent";
}) {
  const tones = {
    default: "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50",
    good: "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40",
    bad: "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40",
    accent: "border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/40",
  } as const;
  return (
    <div className={`rounded-lg border p-3 ${tones[tone]}`}>
      <p className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-300">
        {tone === "bad" && <AlertTriangle size={12} className="text-amber-600" />}
        {tone === "good" && <CheckCircle2 size={12} className="text-emerald-600" />}
        {title}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">{body}</p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex items-center justify-center text-gray-400">
      <ArrowRight size={16} className="hidden md:block" />
      <ArrowDown size={16} className="md:hidden" />
    </div>
  );
}
