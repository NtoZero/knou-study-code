"use client";

import { useState } from "react";
import { ArrowDown, CornerDownLeft } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Formula, Hint, Scroller } from "./ui";

interface Stage {
  id: string;
  title: string;
  tag: string;
  items: string[];
  detail: React.ReactNode;
  loop?: string;
}

const STAGES: Stage[] = [
  {
    id: "init",
    title: "초기화",
    tag: "①",
    items: ["학습 데이터 준비", "가중치 초기화", "학습률 설정", "종료조건 설정"],
    detail: (
      <>
        <p>
          임의의 <strong>작은 값</strong>으로 가중치 파라미터를 초기화하고, 학습률 η와 원하는 오차함수의
          목표값을 설정합니다. 종료조건에는 희망 오차, 수렴 속도, 학습 횟수가 들어갑니다.
        </p>
        <p className="mt-1.5 text-gray-500">
          은닉 뉴런의 수는 여기에 없습니다. 은닉층의 수와 은닉 뉴런의 수는 학습을 시작하기 전
          <strong> 모델 구조를 설정하는 단계</strong>에서 결정됩니다.
        </p>
      </>
    ),
  },
  {
    id: "forward",
    title: "전방향 계산",
    tag: "②-1 · ②-2",
    items: ["학습 데이터 선택", "은닉 노드 출력값 zⱼ 계산", "출력 노드 출력값 yₖ 계산"],
    detail: (
      <>
        <p>
          현재의 가중치 wᵢⱼ, vⱼₖ를 이용하여 출력값을 계산합니다. 한 번에 하나의 데이터만 추출해 사용하는
          <strong> 온라인 학습</strong>입니다.
        </p>
        <div className="mt-2 space-y-1.5">
          <Formula>uⱼʰ = Σᵢ wᵢⱼxᵢ + w₀ⱼ , zⱼ = φʰ(uⱼʰ)</Formula>
          <Formula>uₖᵒ = Σⱼ vⱼₖzⱼ + v₀ₖ , yₖ = φᵒ(uₖᵒ)</Formula>
        </div>
      </>
    ),
  },
  {
    id: "backward",
    title: "역방향 가중치 수정",
    tag: "②-3 · ②-4 · ②-5",
    items: ["출력 노드 오차 δₖ 계산", "은닉 노드 오차 계산 (역전파)", "가중치 wᵢⱼ, vⱼₖ 수정"],
    detail: (
      <>
        <p>
          현재의 가중치를 이용해 오류를 계산합니다. 각 출력 노드의 출력값 yₖ와 목표 출력값 tₖ를 비교해
          출력 뉴런으로의 수정항을 구하고, 그 δₖ로 다시 은닉 뉴런으로의 수정항을 구합니다.
        </p>
        <div className="mt-2 space-y-1.5">
          <Formula>δₖ = −φᵒ′(uₖᵒ)(tₖ − yₖ) , ∂E/∂vⱼₖ = δₖzⱼ</Formula>
          <Formula>δⱼ = φʰ′(uⱼʰ) Σₖ δₖvⱼₖ , ∂E/∂wᵢⱼ = δⱼxᵢ</Formula>
          <Formula>
            w<sup>(τ+1)</sup> = w<sup>(τ)</sup> − η ∂E/∂wᵢⱼ , v<sup>(τ+1)</sup> = v<sup>(τ)</sup> − η ∂E/∂vⱼₖ
          </Formula>
        </div>
      </>
    ),
    loop: "학습 데이터 전체에 대해 수행 완료? — 아니면 다시 전방향 계산으로",
  },
  {
    id: "epoch",
    title: "종료조건 확인",
    tag: "③ · ④",
    items: ["학습 데이터 전체에 대한 오차 E(X) 계산", "종료조건 확인", "조건 만족?"],
    detail: (
      <>
        <p>
          전체 학습 데이터에 대하여 ② 과정이 한 번 완료된 것이 <strong>한 에포크(epoch)</strong>입니다.
          에포크가 끝날 때마다 학습 데이터 전체 집합 X에 대한 평균 제곱 오차를 계산하고, 그 값이 원하는
          목표값보다 작으면 학습을 마칩니다. 그렇지 않으면 ②~③ 과정을 반복합니다.
        </p>
        <Formula className="mt-2" note="식 11-7">
          E(X, θ) = (1/2N) Σ<sub>i=1</sub><sup>N</sup> ‖tᵢ − f(xᵢ, θ)‖²
        </Formula>
      </>
    ),
    loop: "조건을 만족하지 못하면 다시 ② 전방향 계산으로",
  },
  {
    id: "eval",
    title: "성능 평가",
    tag: "학습 종료",
    items: ["학습된 신경망", "성능 평가 (Performance Evaluation)"],
    detail: (
      <p>
        종료조건을 만족하면 학습을 마치고 학습된 신경망의 성능을 평가합니다. 일반화 성능은 학습에
        사용되지 않은 새로운 데이터, 곧 따로 수집한 테스트 데이터 집합으로 오차를 계산해 확인합니다.
      </p>
    ),
  },
];

export default function TrainingProcessFlow() {
  const [active, setActive] = useState(0);
  const s = STAGES[active];

  return (
    <section id="training-process" className="scroll-mt-32">
      <SectionTitle
        title="다층 퍼셉트론의 전체적인 학습 과정"
        subtitle="데이터 하나마다 도는 안쪽 고리와, 에포크마다 도는 바깥쪽 고리"
      />

      <Sourced
        refs={{
          textbook: "11.3.1 — 다층 퍼셉트론의 전체적인 학습 과정(그림 11-15)과 학습 알고리즘 ①~④",
          slides: "다층 퍼셉트론의 전체적인 학습 과정",
        }}
      >
        <Card>
          <Scroller>
            <div className="flex min-w-[560px] flex-col gap-1.5">
              {STAGES.map((st, i) => (
                <div key={st.id}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${
                      i === active
                        ? "border-sky-600 bg-sky-50 dark:bg-sky-950/40"
                        : "border-gray-200 bg-white hover:border-sky-300 dark:border-gray-700 dark:bg-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          i === active ? "bg-sky-600 text-white" : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                        }`}
                      >
                        {st.tag}
                      </span>
                      <span className="text-[13px] font-bold">{st.title}</span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {st.items.map((it) => (
                        <span
                          key={it}
                          className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                  </button>
                  {st.loop ? (
                    <div className="flex items-center gap-1.5 py-1 pl-3 text-[11px] text-rose-600 dark:text-rose-400">
                      <CornerDownLeft size={12} />
                      {st.loop}
                    </div>
                  ) : i < STAGES.length - 1 ? (
                    <div className="flex justify-center py-0.5 text-gray-300">
                      <ArrowDown size={14} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Scroller>

          <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50/50 p-3 text-[12.5px] leading-6 text-gray-700 dark:border-sky-900 dark:bg-sky-950/20 dark:text-gray-200">
            <p className="mb-1.5 text-[12px] font-bold text-sky-700 dark:text-sky-300">
              {s.tag} {s.title}
            </p>
            {s.detail}
          </div>

          <Hint>
            안쪽 고리는 학습 데이터 하나마다 돌고, 바깥쪽 고리는 에포크마다 돕니다. 데이터가 N개이면 한
            에포크 동안 가중치 수정이 N번 일어납니다.
          </Hint>
        </Card>
      </Sourced>
    </section>
  );
}
