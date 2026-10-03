"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, Formula, Hint, Scroller, Slider } from "./ui";
import { SIGMOID, crossEntropy, fmt, oneHot, softmax, squaredError } from "./mlpCore";

const M = 4;
const INIT_U = [0.4, 2.1, -0.3, 0.8];

export default function ErrorFunctionLab() {
  const [u, setU] = useState<number[]>(INIT_U);
  const [target, setTarget] = useState(1);
  const [mode, setMode] = useState<"softmax" | "sigmoid">("softmax");

  const y = useMemo(() => (mode === "softmax" ? softmax(u) : u.map(SIGMOID.f)), [u, mode]);
  const t = useMemo(() => oneHot(target, M), [target]);
  const sum = y.reduce((a, b) => a + b, 0);
  const sqr = squaredError(t, y);
  const crs = crossEntropy(t, y);

  const setAt = (k: number, v: number) => setU((prev) => prev.map((p, i) => (i === k ? v : p)));

  return (
    <section id="error-functions" className="scroll-mt-32">
      <SectionTitle
        title="오차함수와 출력층 — 제곱 오차, 교차엔트로피, 소프트맥스"
        subtitle="출력 뉴런의 가중합 uₖᵒ를 움직여 두 오차함수의 값을 직접 계산해 봅니다"
      />

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Sourced
            refs={{
              textbook: "11.3.3 학습 전략 — 오차함수(식 11-16)",
              slides: "MLP의 학습 전략 — 제곱 오차함수",
            }}
          >
            <Card className="h-full">
              <CardTitle>제곱 오차함수</CardTitle>
              <Formula note="목표 출력값이 연속한 실수값을 갖는 회귀 문제에 적합">
                E<sub>sqr</sub>(X, θ) = Σ<sub>p=1</sub><sup>N</sup> ‖t<sub>p</sub> − f(x<sub>p</sub>, θ)‖² = Σ
                <sub>p=1</sub><sup>N</sup> Σ<sub>k=1</sub><sup>M</sup> (t<sub>pk</sub> − f<sub>k</sub>(xᵢ, θ))²
              </Formula>
            </Card>
          </Sourced>

          <Sourced
            refs={{
              textbook: "11.3.3 학습 전략 — 오차함수(식 11-17)",
              slides: "MLP의 학습 전략 — 교차엔트로피 오차함수",
              lecture: "분류 문제에서 교차엔트로피 오차함수와 소프트맥스 함수는 하나의 쌍처럼 함께 쓰인다고 강조",
            }}
          >
            <Card className="h-full">
              <CardTitle>교차엔트로피 오차함수</CardTitle>
              <Formula note="목표 출력값이 0 또는 1을 갖는 분류 문제, 그리고 출력 노드의 활성화 함수로 소프트맥스를 사용할 때 적합">
                E<sub>crs</sub>(X, θ) = Σ<sub>p=1</sub><sup>N</sup> Σ<sub>k=1</sub><sup>M</sup> t<sub>pk</sub> ln
                f<sub>k</sub>(xᵢ, θ)
              </Formula>
              <p className="mt-2 text-[11.5px] leading-5 text-gray-600 dark:text-gray-400">
                이 식에는 앞에 음부호가 붙지 않습니다. 출력값 f<sub>k</sub>가 0과 1 사이이므로 ln f
                <sub>k</sub>는 0 이하이고, 따라서 <strong>E<sub>crs</sub>는 언제나 0 이하</strong>입니다.
                예측이 목표에 가까울수록 0에 가까워지고 멀어질수록 아래로 내려갑니다. 아래 계산기에서
                값의 부호와 변화 방향을 확인해 보세요.
              </p>
            </Card>
          </Sourced>
        </div>

        <Sourced
          refs={{
            textbook: "11.3.3 — 소프트맥스 함수(식 11-18)",
            slides: "MLP의 학습 전략 — 소프트맥스 함수",
          }}
        >
          <Card>
            <CardTitle>소프트맥스 계산기 — 출력 뉴런 4개</CardTitle>
            <Formula note="출력 노드의 중간 계산 결과 uₖᵒ에 대한 지수값들을 모두 더한 값에 대한 비율">
              yₖ = fₖ(xᵢ, θ) = exp(uₖᵒ) / Σ<sub>i=1</sub><sup>M</sup> exp(uᵢᵒ)
            </Formula>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-gray-500">출력층 활성화 함수</span>
              <Chip active={mode === "softmax"} onClick={() => setMode("softmax")}>
                소프트맥스
              </Chip>
              <Chip active={mode === "sigmoid"} onClick={() => setMode("sigmoid")}>
                시그모이드
              </Chip>
              <span className="ml-auto text-[11px] font-semibold text-gray-500">목표 클래스</span>
              {Array.from({ length: M }, (_, k) => (
                <Chip key={k} active={target === k} onClick={() => setTarget(k)}>
                  C{k + 1}
                </Chip>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className="space-y-2.5">
                {u.map((v, k) => (
                  <Slider
                    key={k}
                    label={`u${k + 1}ᵒ`}
                    value={v}
                    min={-3}
                    max={4}
                    step={0.1}
                    onChange={(nv) => setAt(k, nv)}
                    display={fmt(v, 1)}
                  />
                ))}
              </div>

              <div>
                <Scroller>
                  <table className="w-full min-w-[380px] text-[11.5px]">
                    <thead>
                      <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                        <th className="px-2 py-1.5 font-semibold">k</th>
                        <th className="px-2 py-1.5 font-semibold">uₖᵒ</th>
                        <th className="px-2 py-1.5 font-semibold">exp(uₖᵒ)</th>
                        <th className="px-2 py-1.5 font-semibold">yₖ</th>
                        <th className="px-2 py-1.5 font-semibold">tₖ</th>
                        <th className="px-2 py-1.5 font-semibold">분포</th>
                      </tr>
                    </thead>
                    <tbody>
                      {u.map((v, k) => (
                        <tr key={k} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="px-2 py-1.5 font-semibold">C{k + 1}</td>
                          <td className="px-2 py-1.5 font-mono">{fmt(v, 2)}</td>
                          <td className="px-2 py-1.5 font-mono text-gray-500">
                            {mode === "softmax" ? fmt(Math.exp(v), 4) : "—"}
                          </td>
                          <td className="px-2 py-1.5 font-mono font-bold text-sky-600 dark:text-sky-400">
                            {fmt(y[k], 4)}
                          </td>
                          <td className="px-2 py-1.5 font-mono">
                            <span className={t[k] === 1 ? "font-bold text-rose-600" : "text-gray-400"}>
                              {t[k]}
                            </span>
                          </td>
                          <td className="px-2 py-1.5">
                            <div className="h-2 w-full min-w-[60px] rounded bg-gray-100 dark:bg-gray-800">
                              <div
                                className="h-2 rounded bg-sky-500"
                                style={{ width: `${Math.min(100, y[k] * 100)}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="px-2 py-1.5 text-right text-[11px] font-semibold text-gray-500">
                          Σ yₖ =
                        </td>
                        <td className="px-2 py-1.5 font-mono font-bold">
                          <span className={mode === "softmax" ? "text-green-600" : "text-amber-600"}>
                            {fmt(sum, 4)}
                          </span>
                        </td>
                        <td colSpan={2} className="px-2 py-1.5 text-[10.5px] text-gray-500">
                          {mode === "softmax" ? "언제나 1" : "1이 된다는 보장이 없음"}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </Scroller>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800">
                    <p className="text-[11px] font-semibold text-gray-500">제곱 오차 Σₖ(tₖ − yₖ)²</p>
                    <p className="font-mono text-sm font-bold text-gray-800 dark:text-gray-100">{fmt(sqr, 5)}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800">
                    <p className="text-[11px] font-semibold text-gray-500">교차엔트로피 Σₖ tₖ ln yₖ</p>
                    <p className="font-mono text-sm font-bold text-gray-800 dark:text-gray-100">{fmt(crs, 5)}</p>
                  </div>
                </div>
                <Hint>
                  목표 클래스의 출력 y가 1에 가까워질수록 제곱 오차도 교차엔트로피도 0으로 갑니다. 반대로
                  목표 클래스의 출력이 0으로 떨어지면 제곱 오차는 1.5 부근에서 거의 더 늘지 않는 반면,
                  교차엔트로피는 ln y 때문에 −∞ 쪽으로 끝없이 벌어집니다. 목표 클래스의 슬라이더를 0에서
                  왼쪽 끝까지 내려 보면, 제곱 오차는 조금 움직이다 마는데 교차엔트로피는 계속 커지는 폭으로
                  내려갑니다. 목표에서 멀어질수록 더 세게 반응하는 쪽이 교차엔트로피입니다.
                </Hint>
              </div>
            </div>

            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              소프트맥스 함수는 <strong>최대값을 더욱 활성화하고 최대값이 아닌 값은 억제하여 0에 가깝게</strong>{" "}
              만드는 효과를 가졌으며, 단순히 최대값 여부에 따라 0과 1로 변환하는 맥스(max) 함수에 대한
              부드러운(soft) 버전이라는 의미입니다. 활성화 함수에 의한 출력값을 모두 더하면 1이 되므로,
              목표 출력값이 클래스 레이블인 분류 문제의 출력 노드 활성화 함수로 주로 사용됩니다.
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "데이터 셋팅 — 목표 출력값 설정",
          }}
        >
          <Card>
            <CardTitle>원-핫 벡터로 쓰는 목표 출력값</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              분류 문제에서는 <strong>출력 뉴런의 수 = 클래스 레이블의 수</strong>로 설정하고, i번째 클래스에
              속하는 데이터의 목표 출력값은 i번째 출력 뉴런만 1, 나머지는 0으로 둡니다. 위 표의 tₖ 열이 바로
              그 원-핫 벡터입니다.
            </p>
            <Scroller>
              <div className="mt-3 flex min-w-max items-end gap-1.5">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-gray-400">{i}</span>
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded border text-[11px] font-bold ${
                        i === 2
                          ? "border-rose-500 bg-rose-500 text-white"
                          : "border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800"
                      }`}
                    >
                      {i === 2 ? 1 : 0}
                    </div>
                  </div>
                ))}
                <span className="ml-2 self-center text-[11px] text-gray-500">
                  숫자 ‘2’의 목표 출력값 — 10개 원소 중 2번만 1
                </span>
              </div>
            </Scroller>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
