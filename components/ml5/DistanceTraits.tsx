"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, Formula, Pill } from "./ui";

type Kind = "linear" | "distance";

const ROWS: { label: string; linear: string; distance: string }[] = [
  { label: "대표 방법", linear: "PCA, LDA", distance: "MDS, t-SNE, Isomap" },
  {
    label: "최적화 대상",
    linear: "변환행렬 W — 특징값 분포가 원하는 통계적 특성을 갖도록",
    distance: "저차원 특징값 {y₁, …, y_N} 자체 — 거리(유사도) 관계를 유지하도록",
  },
  { label: "입력 → 특징 매핑 함수", linear: "있음 (y = Wᵀx)", distance: "정의하지 않음" },
  { label: "새로 주어지는 데이터", linear: "y_new = Wᵀx_new로 바로 특징 계산", distance: "그에 대응하는 특징을 찾는 방법이 없음" },
  { label: "입력 좌표가 없고 거리만 있을 때", linear: "입력 데이터 X가 있어야 Y = WᵀX 계산", distance: "MDS는 거리 함수만 주어져도 적용 가능" },
  { label: "주된 용도", linear: "새 데이터의 분류 같은 문제를 풀기 위한 특징추출", distance: "현재 데이터의 분포를 이해하는 데이터 시각화" },
];

export default function DistanceTraits() {
  const [kind, setKind] = useState<Kind>("linear");
  const [newCame, setNewCame] = useState(false);

  /* 선형변환 쪽 예 — 교재 [그림 7-1]의 w = [2, 1]ᵀ/√5 */
  const xNew = [3, 1];
  const yNew = (2 * xNew[0] + 1 * xNew[1]) / Math.sqrt(5);

  return (
    <section>
      <SectionTitle
        title="7.4.3 거리 기반 차원 축소 방법의 특징"
        subtitle="매핑 함수가 없으므로 새 데이터에는 쓸 수 없고, 주로 데이터 시각화에 쓰임"
      />

      <div className="space-y-6">
        <Sourced
          refs={{
            textbook: "7.4.3 거리 기반 차원 축소 방법의 특징",
            slides: "거리 기반 차원 축소 방법의 특징 — 입력 데이터와 특징 데이터 간의 매핑 함수를 정의하지 않음",
            lecture: "학습에 쓴 데이터가 아닌 새 데이터가 들어오면 특징값을 얻을 수 없다는 점을 일반적인 특징추출과의 가장 큰 차이로 반복해 짚음",
          }}
        >
          <Card title="새 데이터가 들어오면?">
            <div className="mb-3 flex flex-wrap gap-2">
              <Pill on={kind === "linear"} onClick={() => { setKind("linear"); setNewCame(false); }}>
                선형변환 (PCA · LDA)
              </Pill>
              <Pill on={kind === "distance"} onClick={() => { setKind("distance"); setNewCame(false); }}>
                거리 기반 (MDS · t-SNE · Isomap)
              </Pill>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-500">학습이 끝나고 남은 것</p>
                {kind === "linear" ? (
                  <Formula className="mt-2">W = [2, 1]ᵀ/√5  (변환함수 y = Wᵀx)</Formula>
                ) : (
                  <Formula className="mt-2">{"{"}y₁, y₂, …, y_N{"}"}  (학습 데이터의 특징값만)</Formula>
                )}
              </div>
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-gray-500">새 데이터 x_new = [3, 1]ᵀ</p>
                  <button type="button" onClick={() => setNewCame(true)} className="rounded-lg bg-rose-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-rose-600">
                    넣어 보기
                  </button>
                </div>
                <AnimatePresence mode="wait">
                  {newCame && (
                    <motion.div key={kind} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2">
                      {kind === "linear" ? (
                        <p className="flex items-start gap-1.5 text-sm text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
                          y_new = Wᵀx_new = (2·3 + 1·1)/√5 = 7/√5 ≈ {yNew.toFixed(3)}
                        </p>
                      ) : (
                        <p className="flex items-start gap-1.5 text-sm text-amber-700 dark:text-amber-300">
                          <XCircle size={15} className="mt-0.5 shrink-0" />
                          x_new를 y로 바꾸는 함수가 없음 — 저차원 특징값에 대한 목적함수를 최적화해 얻은 것은 학습
                          데이터의 {"{"}y₁, …, y_N{"}"}뿐
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              거리 기반 방법은 저차원 특징값 {"{"}y₁, …, y_N{"}"}에 대한 목적함수를 정의하고 이를 최적화하는 값을
              찾는 과정. 얻어진 특징값은 현재 주어진(학습) 데이터를 잘 표현하지만, 고차원 입력을 저차원 특징으로
              변환하는 함수가 얻어지지 않으므로 새 데이터의 특징은 찾을 수 없음. MDS는 입력 좌표값 없이 데이터 간
              거리 함수만 주어진 경우에도 적용할 수 있음.
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7.4.3 — [그림 7-12] 손으로 쓴 숫자 영상(MNIST) 데이터에 t-SNE를 적용한 결과",
            slides: "거리 기반 차원 축소 방법의 특징 — 용도 → 주로 데이터 시각화",
            lecture: "28 × 28 숫자 영상은 784차원이라 그대로는 분포를 볼 수 없으므로, t-SNE로 2차원에 뿌려 숫자별로 모이는 모습을 눈으로 확인하는 것이 시각화 용도라고 설명함",
          }}
        >
          <Card title="용도 — 데이터 시각화 data visualization">
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              MDS나 t-SNE로 고차원 데이터를 2차원 또는 3차원으로 축소해 주어진 데이터들이 어떻게 분포하는지를
              보여 줌. 이때는 각 데이터의 구체적인 값보다 데이터 간의 상호 관계(유사도나 거리)가 더 중요하므로
              거리 기반 차원 축소가 유용함.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-lg bg-gray-100 px-3 py-2 font-mono dark:bg-gray-800">28 × 28 숫자 영상 = 784차원</span>
              <span className="text-gray-400">→ t-SNE →</span>
              <span className="rounded-lg bg-rose-100 px-3 py-2 font-mono text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">2차원 좌표</span>
              <span className="text-gray-500">비슷한 패턴(같은 클래스)의 숫자 영상들이 가깝게 뭉쳐 있음</span>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              거리 함수의 정의에 따라 방법이 매우 다양하고 얻어지는 저차원 특징도 전혀 다른 형태가 되므로, 데이터의
              특성과 분석 목적을 고려해 적합한 방법을 고르는 것은 개발자의 몫.
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7.4.3 거리 기반 차원 축소 방법의 특징",
            slides: "거리 기반 차원 축소 방법의 특징",
          }}
        >
          <Card title="선형변환 방법 vs 거리 기반 방법">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-xs">
                <thead>
                  <tr className="text-left">
                    <th className="border-b border-gray-200 p-2 text-gray-500 dark:border-gray-700" />
                    <th className="border-b border-gray-200 p-2 text-sky-600 dark:border-gray-700">선형변환에 의한 특징추출</th>
                    <th className="border-b border-gray-200 p-2 text-rose-600 dark:border-gray-700">거리 기반 차원 축소</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  {ROWS.map((r) => (
                    <tr key={r.label}>
                      <td className="border-b border-gray-100 p-2 font-semibold text-gray-500 dark:border-gray-800">{r.label}</td>
                      <td className="border-b border-gray-100 p-2 dark:border-gray-800">{r.linear}</td>
                      <td className="border-b border-gray-100 p-2 dark:border-gray-800">{r.distance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
