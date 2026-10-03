"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Hint, Scroller } from "./ui";
import { fmt } from "./mlpCore";

const TEST_N = 10000;

/** 강의록 — 오차함수와 은닉 노드 수에 따른 성능(오분류율 %) 변화 */
const PERF = [
  { act: "시그모이드", err: "제곱오차", rates: { 20: 4.51, 50: 3.17, 100: 2.49 } },
  { act: "소프트맥스", err: "교차엔트로피", rates: { 20: 4.69, 50: 3.07, 100: 2.35 } },
] as const;

const H_LIST = [20, 50, 100] as const;

/** 강의록 — LeNet-5 논문(1998) 당시 기준, MNIST 대상 */
const LENET_TABLE = [
  { model: "LeNet-5", note: "CNN", rate: "0.95" },
  { model: "선형 분류기", note: "간단한 선형 판별함수", rate: "12.0" },
  { model: "K-NN", note: "K=3, 유클리디안 거리", rate: "3.3" },
  { model: "K-NN", note: "K=3, 탄젠트 거리, 속도/계산량 비효율", rate: "1.1" },
  { model: "SVM", note: "커널법, 비선형 결정경계", rate: "약 0.8 (직접 실험되지 않고 보고된 내용)" },
  { model: "MLP", note: "2개 은닉층(300-100)", rate: "1.6" },
  { model: "MLP (강의 언급 모델)", note: "1개 은닉층(100)", rate: "2.35" },
];

/** 강의록 — MNIST 숫자인식 성능 비교 */
const TIMELINE = [
  { year: 1998, model: "LeNet-5", err: 0.95, acc: "99.05", note: "최초 딥러닝 기반 MNIST 최고 성능" },
  { year: 2003, model: "SVM", err: 0.8, acc: "99.2", note: "커널 기반 비선형 분류" },
  { year: 2003, model: "KNN (탄젠트 거리)", err: 0.54, acc: "99.46", note: "계산량 비효율" },
  { year: 2012, model: "DropConnect", err: 0.21, acc: "99.79", note: "Dropout 변형" },
  { year: 2015, model: "ResNet", err: 0.23, acc: "99.77", note: "Residual Block" },
  { year: 2018, model: "GAN-based Data Augmentation", err: 0.18, acc: "99.82", note: "GAN 생성 데이터 활용" },
  {
    year: 2020,
    model: "Vision Transformer (ViT)",
    err: 0.23,
    acc: "99.77",
    note: "이미지를 패치 단위로 나누어 Transformer 인코더 처리",
  },
  { year: 2022, model: "ConvNeXt", err: 0.17, acc: "99.83", note: "Conv 기반 + Transformer 최적화" },
  { year: 2023, model: "Swin Transformer", err: 0.14, acc: "99.86", note: "계층형 윈도우 기반 Transformer" },
  {
    year: 2024,
    model: "Hybrid CNN + Transformer Ensembles",
    err: 0.12,
    acc: "99.88",
    note: "앙상블 모델 · 0.12 이하 → 99.88 이상",
  },
];

const TW = 440;
const TH = 180;
const TPAD = { l: 38, r: 14, t: 14, b: 28 };
const tx = (y: number) => TPAD.l + ((y - 1996) / 30) * (TW - TPAD.l - TPAD.r);
/** 오류율은 0.12~0.95로 좁아 로그 눈금으로 그린다. 위가 높은 오류율 */
const ty = (e: number) =>
  TPAD.t +
  ((Math.log10(e) - Math.log10(1.2)) / (Math.log10(0.1) - Math.log10(1.2))) * (TH - TPAD.t - TPAD.b);

export default function MnistPerformance() {
  const [hidden, setHidden] = useState<20 | 50 | 100>(100);
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section id="mnist-performance" className="scroll-mt-32">
      <SectionTitle
        title="학습 곡선과 성능 평가"
        subtitle="은닉 노드 수와 오차함수의 조합이 일반화 성능을 어떻게 바꾸는지"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            slides: "학습 곡선 — 학습 곡선을 이용한 학습 상황 관찰",
            lecture: "학습 곡선이 평평해지면 은닉 노드를 늘리고, 곡선이 갑자기 튀면 학습률을 조정하는 식으로 다음 수를 정한다고 활용법을 설명",
          }}
        >
          <Card>
            <CardTitle>학습 곡선(learning curve)</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              한 에포크가 끝날 때마다 학습 오차를 계산하여 그 변화를 살펴보는 그래프입니다. 강의록은 MNIST에서
              은닉 노드가 20개·50개·100개일 때의 학습 곡선을 겹쳐 보여 주는데, 100 에포크까지 세 곡선 모두
              제곱오차가 가파르게 떨어진 뒤 완만해지며, <strong>은닉 노드가 많을수록 곡선이 아래쪽에</strong>{" "}
              놓입니다.
            </p>
            <Hint>
              학습 곡선은 학습이 어떻게 진행되는지를 보고 다음 수를 정하는 데 쓰입니다. 변화가 없으면 은닉층의
              노드 수를 늘려 보고, 곡선이 갑자기 달라지면 학습률을 조정합니다. 위 ‘간단한 분류 실험’에서
              학습을 돌리면 같은 모양의 곡선이 그려지는 것을 볼 수 있습니다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "성능 평가 — 오차함수와 은닉 노드 수에 따른 성능(오분류율 %) 변화",
          }}
        >
          <Card>
            <CardTitle>일반화 성능 — 테스트 데이터 1만 개에 대한 오분류율</CardTitle>
            <p className="mb-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              일반화 성능은 학습에 사용되지 않은 새로운 데이터에 대한 신경망 출력의 정확도입니다. 평가 방법은
              테스트 데이터 집합을 별도로 수집하여 오차를 계산하는 것입니다.
            </p>

            <Scroller>
              <table className="w-full min-w-[420px] text-[12px]">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                    <th className="px-2 py-1.5 font-semibold">활성화 함수</th>
                    <th className="px-2 py-1.5 font-semibold">오차함수</th>
                    {H_LIST.map((h) => (
                      <th key={h} className="px-2 py-1.5 text-center font-semibold">
                        H = {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERF.map((p) => (
                    <tr key={p.act} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="whitespace-nowrap px-2 py-1.5 font-semibold text-sky-700 dark:text-sky-300">
                        {p.act}
                      </td>
                      <td className="whitespace-nowrap px-2 py-1.5 text-gray-600 dark:text-gray-300">
                        {p.err}
                      </td>
                      {H_LIST.map((h) => (
                        <td
                          key={h}
                          className={`px-2 py-1.5 text-center font-mono ${
                            h === hidden
                              ? "bg-sky-50 font-bold text-sky-700 dark:bg-sky-950/50 dark:text-sky-200"
                              : "text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {p.rates[h].toFixed(2)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Scroller>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
              <div>
                <p className="mb-1.5 text-[11px] font-semibold text-gray-500">은닉 노드 수 H</p>
                <div className="flex gap-1.5">
                  {H_LIST.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHidden(h)}
                      className={`flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-semibold ${
                        h === hidden
                          ? "border-sky-600 bg-sky-600 text-white"
                          : "border-gray-200 text-gray-500 dark:border-gray-700"
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-2.5 font-mono text-[11px] leading-6 dark:bg-gray-800">
                {PERF.map((p) => (
                  <div key={p.act}>
                    {p.act} + {p.err} → {p.rates[hidden].toFixed(2)}% ×{" "}
                    {TEST_N.toLocaleString()}개 ={" "}
                    <span className="font-bold text-sky-600 dark:text-sky-400">
                      {Math.round((p.rates[hidden] / 100) * TEST_N).toLocaleString()}개
                    </span>{" "}
                    오인식 (정확도 {fmt(100 - p.rates[hidden], 2)}%)
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              은닉 노드가 많아질수록 오분류율이 줄어듭니다. 그리고 H = 50, H = 100에서는{" "}
              <strong>소프트맥스 + 교차엔트로피</strong> 쪽이 시그모이드 + 제곱오차보다 낮습니다. 분류 문제에서
              이 둘이 한 쌍으로 쓰인다는 설명이 수치로도 확인되는 지점입니다. 다만 H = 20에서는 4.69로
              오히려 높아, 은닉 노드가 적을 때는 조합의 이점이 나타나지 않습니다.
            </p>
          </Card>
        </Sourced>

        <Sourced refs={{ slides: "LeNet-5 — 1998, Yann LeCun → 합성곱 신경망(CNN)" }}>
          <Card>
            <CardTitle>LeNet-5와 1998년 당시의 비교</CardTitle>
            <p className="mb-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              1998년 Yann LeCun이 발표한 합성곱 신경망(CNN) 모델로, 논문 제목은 “Gradient-Based Learning
              Applied to Document Recognition”입니다. 아래 표는 그 논문이 당시 기준으로 MNIST에서 비교한
              모델별 오분류율입니다.
            </p>
            <Scroller>
              <table className="w-full min-w-[460px] text-[12px]">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                    <th className="px-2 py-1.5 font-semibold">모델(방법)</th>
                    <th className="px-2 py-1.5 font-semibold">특징</th>
                    <th className="px-2 py-1.5 font-semibold">오분류율(%)</th>
                  </tr>
                </thead>
                <tbody>
                  {LENET_TABLE.map((r, i) => (
                    <tr
                      key={`${r.model}-${i}`}
                      className={`border-b border-gray-100 dark:border-gray-800 ${
                        r.model.startsWith("MLP (강의") ? "bg-sky-50/60 dark:bg-sky-950/30" : ""
                      }`}
                    >
                      <td className="whitespace-nowrap px-2 py-1.5 font-semibold text-gray-700 dark:text-gray-200">
                        {r.model}
                      </td>
                      <td className="px-2 py-1.5 text-gray-600 dark:text-gray-300">{r.note}</td>
                      <td className="whitespace-nowrap px-2 py-1.5 font-mono">{r.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Scroller>
            <Hint>
              파란 줄이 앞의 성능 표에서 가장 좋았던 조합(은닉층 1개, 노드 100개)입니다. 2강에서 배운 K-NN,
              8강에서 배운 SVM과 같은 표 위에서 비교해 볼 수 있습니다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "MNIST 숫자인식 성능 비교",
            lecture: "MNIST는 사실상 해결된 문제로 보고, 지금은 새로 만든 모델의 구조를 검증하는 용도로 쓴다고 정리",
          }}
        >
          <Card>
            <CardTitle>연도별 성능 비교</CardTitle>
            <Scroller>
              <svg viewBox={`0 0 ${TW} ${TH}`} className="h-auto w-full min-w-[420px]">
                <line x1={TPAD.l} y1={TH - TPAD.b} x2={TW - TPAD.r} y2={TH - TPAD.b} stroke="#cbd5e1" />
                <line x1={TPAD.l} y1={TPAD.t} x2={TPAD.l} y2={TH - TPAD.b} stroke="#cbd5e1" />
                {[1.0, 0.5, 0.2, 0.1].map((v) => (
                  <g key={v}>
                    <line
                      x1={TPAD.l}
                      y1={ty(v)}
                      x2={TW - TPAD.r}
                      y2={ty(v)}
                      stroke="#f1f5f9"
                      strokeWidth={1}
                    />
                    <text x={TPAD.l - 4} y={ty(v) + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
                      {v}
                    </text>
                  </g>
                ))}
                {[2000, 2005, 2010, 2015, 2020, 2025].map((y) => (
                  <text key={y} x={tx(y)} y={TH - 12} fontSize="8" textAnchor="middle" fill="#94a3b8">
                    {y}
                  </text>
                ))}
                <polyline
                  points={[...TIMELINE]
                    .sort((a, b) => a.year - b.year)
                    .map((d) => `${tx(d.year)},${ty(d.err)}`)
                    .join(" ")}
                  fill="none"
                  stroke="#bae6fd"
                  strokeWidth={1.5}
                />
                {TIMELINE.map((d, i) => (
                  <g key={`${d.year}-${d.model}`} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                    <circle
                      cx={tx(d.year)}
                      cy={ty(d.err)}
                      r={hover === i ? 6 : 4}
                      fill={hover === i ? "#0369a1" : "#0284c7"}
                    />
                    <circle cx={tx(d.year)} cy={ty(d.err)} r={10} fill="transparent" />
                  </g>
                ))}
                <text x={TPAD.l + 4} y={TPAD.t + 9} fontSize="9" fill="#94a3b8">
                  오류율(%)
                </text>
              </svg>
            </Scroller>
            {hover !== null && (
              <p className="mt-1 text-[11.5px] text-sky-700 dark:text-sky-300">
                {TIMELINE[hover].year} · {TIMELINE[hover].model} — 오류율 {TIMELINE[hover].err}% → 정확도{" "}
                {TIMELINE[hover].acc}% · {TIMELINE[hover].note}
              </p>
            )}

            <Scroller>
              <table className="mt-3 w-full min-w-[500px] text-[11.5px]">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                    <th className="px-2 py-1.5 font-semibold">연도</th>
                    <th className="px-2 py-1.5 font-semibold">모델</th>
                    <th className="px-2 py-1.5 font-semibold">오류율 → 정확도(%)</th>
                    <th className="px-2 py-1.5 font-semibold">특징 / 비고</th>
                  </tr>
                </thead>
                <tbody>
                  {TIMELINE.map((d, i) => (
                    <tr
                      key={`${d.year}-${d.model}`}
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover(null)}
                      className={`border-b border-gray-100 dark:border-gray-800 ${
                        hover === i ? "bg-sky-50 dark:bg-sky-950/40" : ""
                      }`}
                    >
                      <td className="px-2 py-1.5 font-mono">{d.year}</td>
                      <td className="whitespace-nowrap px-2 py-1.5 font-semibold text-gray-700 dark:text-gray-200">
                        {d.model}
                      </td>
                      <td className="whitespace-nowrap px-2 py-1.5 font-mono">
                        {d.err} → {d.acc}
                      </td>
                      <td className="px-2 py-1.5 text-gray-600 dark:text-gray-300">{d.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Scroller>

            <p className="mt-3 rounded-lg bg-sky-50 p-3 text-[12.5px] leading-6 text-sky-900 dark:bg-sky-950/40 dark:text-sky-100">
              MNIST는 사실상 <strong>“해결된 문제”</strong>로 간주됩니다. 지금은 새로운 아키텍처를 검증하는
              벤치마크로 활용됩니다.
            </p>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
