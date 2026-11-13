"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Formula, Hint, Chip, Slider, ComputedNote, Scroller, Tag, fmt, q12 } from "@/components/dlShared/ui";

type Stage = "train" | "infer";

/** 미니배치 세 개 — 배치마다 분포가 다른 상황을 보여 주기 위한 이 페이지의 예시 */
const BATCHES: { name: string; xs: number[] }[] = [
  { name: "B₁", xs: [2.1, 3.4, 1.8, 4.1, 2.6] },
  { name: "B₂", xs: [-0.4, 1.2, 0.3, -1.1, 0.7] },
  { name: "B₃", xs: [5.2, 3.9, 6.4, 4.7, 5.8] },
];
const EPSILON = 0.0001;

function stats(xs: number[]) {
  const n = xs.length;
  const mu = q12(xs.reduce((a, v) => a + v, 0) / n);
  const va = q12(xs.reduce((a, v) => a + (v - mu) * (v - mu), 0) / n);
  return { mu, va };
}

function r2(v: number) {
  return Math.round(v * 100) / 100;
}

/* 점 그림 */
const VIEW_W = 400;
const VIEW_H = 112;
const dx = (v: number) => r2(VIEW_W / 2 + Math.max(-7.5, Math.min(7.5, v)) * 24);

function Row({ label, values, color }: { label: string; values: number[]; color: string }) {
  return (
    <g>
      <text x="6" y="0" className="fill-gray-500 text-[9.5px] font-semibold">
        {label}
      </text>
      {values.map((v, i) => (
        <circle key={i} cx={dx(v)} cy={-4} r="5" fill={color} opacity="0.85" />
      ))}
    </g>
  );
}

export default function BatchNormStages() {
  const [stage, setStage] = useState<Stage>("train");
  const [bi, setBi] = useState(0);
  const [gamma, setGamma] = useState(1.5);
  const [beta, setBeta] = useState(0.5);
  const [probe, setProbe] = useState(3.0);

  const batch = BATCHES[bi];
  const { mu, va } = stats(batch.xs);
  const sd = q12(Math.sqrt(va + EPSILON));
  const xhat = batch.xs.map((v) => q12((v - mu) / sd));
  const z = xhat.map((v) => q12(gamma * v + beta));

  // 추론 단계: 전체 학습 표본 집합에 대한 추정치
  const NB = BATCHES[0].xs.length;
  const allMu = q12(BATCHES.reduce((a, b) => a + stats(b.xs).mu, 0) / BATCHES.length);
  const meanVar = q12(BATCHES.reduce((a, b) => a + stats(b.xs).va, 0) / BATCHES.length);
  const varX = q12((NB / (NB - 1)) * meanVar);
  const probeHat = q12((probe - allMu) / q12(Math.sqrt(varX + EPSILON)));
  const probeZ = q12(gamma * probeHat + beta);

  return (
    <section id="batch-normalization" className="scroll-mt-32">
      <SectionTitle
        title="배치 정규화"
        subtitle="내부 공변량 변화를 줄이기 위해 정규화한 뒤, 스케일 및 이동 변환을 적용한다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            slides: "내부 공변량 변화",
            lecture: "미니배치마다 분포가 다름",
          }}
        >
          <Card>
            <CardTitle>내부 공변량 변화(internal covariate shift)</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              학습 중 각 층의 활성함수 입력 분포가 이전 층의 파라미터 변경에 의해 변화하는 현상. 심층망의 학습
              효율이 낮아지는 문제의 원인이 됨.
            </p>
            <ul className="mt-2 space-y-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              <li>· 작은 학습률을 사용해야 해서 학습이 느리게 진행됨</li>
              <li>· 파라미터 초기화를 주의 깊게 할 필요가 있음</li>
              <li>· 포화 비선형 활성함수를 사용하는 모델의 학습이 어려움</li>
            </ul>
            <p className="mt-3 rounded-lg bg-violet-50 px-3 py-2 text-[12.5px] leading-6 text-violet-900 dark:bg-violet-950/40 dark:text-violet-100">
              Sergey Ioffe 등(2015): <b>배치 정규화(batch normalization)</b>를 통해 학습 성능을 개선할 수 있음.
            </p>
            <Hint>
              정규화(normalization)는 입력 분포의 평균이 0, 분산이 1이 되도록 만드는 것. 다만 정규화만 하면 그 층에서
              표현하려는 정보에 변화가 발생하므로 — 예를 들어 시그모이드에서는 선형 영역에만 국한됨 — 스케일 및
              이동 변환 z⁽ᵏ⁾ = γ⁽ᵏ⁾x̂⁽ᵏ⁾ + β⁽ᵏ⁾를 이어서 적용함.
            </Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "배치 정규화 — 학습·추론",
            lecture: "γ와 β도 역전파로 업데이트",
          }}
        >
          <Card>
            <CardTitle>학습 단계와 추론 단계는 무엇이 다른가</CardTitle>

            <div className="mb-3 flex flex-wrap gap-2">
              <Chip active={stage === "train"} onClick={() => setStage("train")}>
                학습 단계
              </Chip>
              <Chip active={stage === "infer"} onClick={() => setStage("infer")}>
                추론 단계
              </Chip>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Slider
                label={<span>스케일 γ</span>}
                value={gamma}
                min={0.2}
                max={3}
                step={0.1}
                onChange={setGamma}
                display={fmt(gamma, 1)}
              />
              <Slider
                label={<span>이동 β</span>}
                value={beta}
                min={-2}
                max={2}
                step={0.1}
                onChange={setBeta}
                display={fmt(beta, 1)}
              />
            </div>

            {stage === "train" ? (
              <>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {BATCHES.map((b, i) => (
                    <Chip key={b.name} active={bi === i} onClick={() => setBi(i)}>
                      미니배치 {b.name}
                    </Chip>
                  ))}
                </div>

                <div className="mt-3 space-y-2">
                  <Formula note="현재 미니배치의 평균과 분산">
                    μ_B ← (1/N_B)·Σ xᵢ,&nbsp;&nbsp; σ²_B ← (1/N_B)·Σ (xᵢ − μ_B)²
                  </Formula>
                  <Formula>x̂ᵢ ← (xᵢ − μ_B) / √(σ²_B + ε)</Formula>
                  <Formula note="γ와 β는 학습을 통해 구하는 파라미터">zᵢ ← γ·x̂ᵢ + β</Formula>
                </div>

                <Scroller>
                  <svg
                    viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                    className="mt-3 h-auto w-full min-w-[340px]"
                    role="img"
                    aria-label="미니배치의 원래 값, 정규화한 값, 스케일·이동 변환한 값의 분포 비교"
                  >
                    <line x1="0" y1={VIEW_H - 8} x2={VIEW_W} y2={VIEW_H - 8} stroke="#e2e8f0" strokeWidth="1" />
                    <line x1={dx(0)} y1="8" x2={dx(0)} y2={VIEW_H - 8} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                    <text x={dx(0) + 4} y={VIEW_H - 1} className="fill-gray-400 text-[9px]">
                      0
                    </text>
                    <g transform="translate(0,34)">
                      <Row label={`xᵢ — ${batch.name}의 원래 값`} values={batch.xs} color="#f59e0b" />
                    </g>
                    <g transform="translate(0,70)">
                      <Row label="x̂ᵢ — 정규화 (평균 0, 분산 1)" values={xhat} color="#0ea5e9" />
                    </g>
                    <g transform="translate(0,104)">
                      <Row label="zᵢ — 스케일 및 이동 변환" values={z} color="#8b5cf6" />
                    </g>
                  </svg>
                </Scroller>

                <Scroller>
                  <table className="mt-3 w-full min-w-[380px] border-collapse text-[12px]">
                    <tbody className="text-gray-700 dark:text-gray-200">
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1.5 pr-2 text-gray-500">μ_B</td>
                        <td className="py-1.5 pr-2 font-mono">{fmt(mu, 3)}</td>
                        <td className="py-1.5 pr-2 text-gray-500">σ²_B</td>
                        <td className="py-1.5 font-mono">{fmt(va, 3)}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 text-gray-500">정규화 뒤 평균·분산</td>
                        <td className="py-1.5 pr-2 font-mono" colSpan={3}>
                          0, 1 — 어느 미니배치를 골라도 같음
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Scroller>

                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[12.5px] leading-6 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
                  미니배치를 바꿔 보면 원래 값(주황)의 위치는 크게 다르지만, 정규화한 값(파랑)의 분포는 거의 같아짐.
                  내부 공변량 변화가 줄어드는 것이 이 지점임. <b>역전파가 진행되는 동안 γ와 β에 대한 손실함수의
                  경사를 구하여 업데이트</b>함.
                </p>
              </>
            ) : (
              <>
                <div className="mt-3 space-y-2">
                  <Formula note="미니배치가 아니라 전체 학습 표본 집합에 대해 추정한 값을 쓴다">
                    x̂ᵢ = (xᵢ − E(x)) / √(Var(x) + ε)
                  </Formula>
                  <Formula>Var(x) = N_B/(N_B − 1) · E_B(σ²_B)</Formula>
                </div>

                <div className="mt-3">
                  <Slider
                    label={<span>추론할 입력 하나 x</span>}
                    value={probe}
                    min={-2}
                    max={8}
                    step={0.1}
                    onChange={setProbe}
                    display={fmt(probe, 1)}
                  />
                </div>

                <Scroller>
                  <table className="mt-3 w-full min-w-[380px] border-collapse text-[12px]">
                    <tbody className="text-gray-700 dark:text-gray-200">
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1.5 pr-2 text-gray-500">E(x) — 전체 추정 평균</td>
                        <td className="py-1.5 font-mono">{fmt(allMu, 3)}</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1.5 pr-2 text-gray-500">E_B(σ²_B) — 미니배치 분산의 평균</td>
                        <td className="py-1.5 font-mono">{fmt(meanVar, 3)}</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1.5 pr-2 text-gray-500">
                          Var(x) = {NB}/{NB - 1} × {fmt(meanVar, 3)}
                        </td>
                        <td className="py-1.5 font-mono">{fmt(varX, 3)}</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1.5 pr-2 text-gray-500">x̂ — 정규화한 값</td>
                        <td className="py-1.5 font-mono">{fmt(probeHat, 3)}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 text-gray-500">z = γx̂ + β</td>
                        <td className="py-1.5 font-mono font-bold text-violet-600 dark:text-violet-400">
                          {fmt(probeZ, 3)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Scroller>

                <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-[12.5px] leading-6 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
                  추론 시에는 미니배치가 아닌 <b>개별 입력</b>에 대한 출력을 구해야 함. 표본 하나로는 평균·분산을
                  구할 수 없으므로, 전체 학습 표본 집합에 대해 추정한 평균 및 분산을 이용하여 입력을 정규화한 후
                  출력을 구함. γ와 β는 학습으로 이미 정해져 있으므로 그대로 사용함.
                </p>
              </>
            )}

            <div className="mt-3 flex flex-wrap gap-1.5">
              <Tag tone={stage === "train" ? "teal" : "gray"}>학습: 미니배치의 평균·분산</Tag>
              <Tag tone={stage === "infer" ? "teal" : "gray"}>추론: 전체 학습 표본의 추정 평균·분산</Tag>
              <Tag>γ·β는 두 단계 모두 같은 학습된 값</Tag>
            </div>

            <ComputedNote>
              미니배치의 값들과 γ·β의 기본값은 이 페이지에서 정한 예시이며, ε은 0.0001을 사용함. 변환식은 강의록
              표기를 그대로 따름.
            </ComputedNote>
          </Card>
        </Sourced>

        <Sourced refs={{ slides: "텐서플로에서의 적용" }}>
          <Card>
            <CardTitle>텐서플로에서의 적용 — 활성함수를 층에서 떼어 낸다</CardTitle>
            <div className="grid gap-3 lg:grid-cols-2">
              {/* 칸 안의 코드 줄이 길어 min-w-0 없이는 칸이 화면 밖으로 벌어진다 */}
              <div className="min-w-0">
                <p className="mb-1.5 text-[11px] font-bold text-gray-500">적용 전</p>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11.5px] leading-5 text-gray-100">
{`model = Sequential([keras.Input(shape=(10,)),
    layers.Dense(32, activation='relu'),
    layers.Dense(4, activation='softmax')])`}
                </pre>
              </div>
              <div className="min-w-0">
                <p className="mb-1.5 text-[11px] font-bold text-violet-600 dark:text-violet-400">적용 후</p>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11.5px] leading-5 text-gray-100">
{`model = Sequential([keras.Input(shape=(10,)),
    layers.Dense(32),
    layers.BatchNormalization(),
    layers.ReLU(),
    layers.Dense(4, activation='softmax')])`}
                </pre>
              </div>
            </div>
            <Hint>
              Dense에서 activation을 지정하지 않으면 가중합까지만 계산된다. 그 사이에 배치 정규화를 넣고, 그 뒤에
              ReLU 층을 두어 &lsquo;가중합 → 배치 정규화 → 활성함수&rsquo; 순서를 만든다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
