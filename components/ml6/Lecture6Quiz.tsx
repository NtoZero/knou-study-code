"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import type { SourceRef } from "@/lib/mlSources";

type QuizChoice = {
  text: string;
  isCorrect: boolean;
  explanation: { basis: string; reason: string };
};

type Quiz = {
  q: string;
  choices: QuizChoice[];
  answer: number;
  basis: string;
  examSkill: string;
  source: "공식 연습문제" | "변형";
  refs: SourceRef;
};

const QUIZZES: Quiz[] = [
  {
    q: "간단한 학습기를 복수 개 결합해 더 좋은 학습기를 만드는 방법은?",
    answer: 0,
    source: "공식 연습문제",
    basis: "8.1 앙상블 학습의 개념 — 복수 개의 간단한 학습기를 결합하여 더 좋은 성능의 학습기를 만드는 방법",
    examSkill: "앙상블 학습의 정의를 다른 학습 방식과 구별",
    refs: { textbook: "8.1.1 학습기 결합의 필요성", slides: "앙상블 학습의 개념 — 학습기 결합" },
    choices: [
      {
        text: "앙상블 학습",
        isCorrect: true,
        explanation: {
          basis: "앙상블 학습 — 간단한 학습기로 학습을 수행하되 복수 개를 결합하여 더 좋은 성능의 학습기를 만드는 방법",
          reason: "선형 분류기처럼 간단한 학습기를 하나가 아니라 여러 개 쓰고, 그 결과를 결합해 최종 결과를 내는 것이 앙상블 학습의 정의다.",
        },
      },
      {
        text: "능동 학습",
        isCorrect: false,
        explanation: {
          basis: "1강 머신러닝의 고급 주제 — 능동 학습",
          reason: "능동 학습은 학습에 쓸 데이터를 선별적으로 골라 가며 학습하는 방법으로, 여러 학습기를 결합하는 방법이 아니다.",
        },
      },
      {
        text: "종단간 학습",
        isCorrect: false,
        explanation: {
          basis: "앙상블 학습의 정의 — 복수 개의 학습기 결합",
          reason: "종단간 학습은 복수 개의 간단한 학습기를 결합한다는 정의와 관련이 없다. 학습기의 결합을 정의로 삼는 것은 앙상블 학습이다.",
        },
      },
      {
        text: "메타 학습",
        isCorrect: false,
        explanation: {
          basis: "1강 머신러닝의 고급 주제 — 메타 학습",
          reason: "메타 학습은 복잡도 같은 하이퍼파라미터까지 학습으로 최적화하는 방법으로, 간단한 학습기 여럿을 결합하는 방법이 아니다.",
        },
      },
    ],
  },
  {
    q: "전체 학습 데이터에서 일부 집합을 추출해 각 학습기를 학습하는 방법은?",
    answer: 3,
    source: "공식 연습문제",
    basis: "8.1.2 앙상블 학습의 개요 — 리샘플링에 의한 방법(배깅, MadaBoost)",
    examSkill: "학습 데이터 생성 방식(필터링·리샘플링·가중치 조정)과 대표 방법 연결",
    refs: { textbook: "8.1.2 앙상블 학습의 개요", slides: "학습 데이터 생성 방법의 구분" },
    choices: [
      {
        text: "AdaBoost",
        isCorrect: false,
        explanation: {
          basis: "가중치 조정(reweighting)에 의한 방법 → AdaBoost",
          reason: "AdaBoost는 모든 학습기에 같은 학습 데이터를 쓰고, 각 데이터의 가중치만 바꾼다. 일부 집합을 추출하지 않는다.",
        },
      },
      {
        text: "캐스케이딩",
        isCorrect: false,
        explanation: {
          basis: "필터링(filtering)에 의한 방법 → 초기 부스팅, 캐스케이딩",
          reason: "캐스케이딩은 앞 단계 학습기가 제대로 처리하지 못한 데이터를 골라 다음 단계를 학습하는 필터링 방식에 해당한다.",
        },
      },
      {
        text: "커미티 머신",
        isCorrect: false,
        explanation: {
          basis: "보팅법(voting) = 커미티 머신 — 학습기 결합 방법",
          reason: "커미티 머신은 보팅법의 다른 이름으로, 학습 데이터를 만드는 방법이 아니라 학습기의 결과를 결합하는 방법이다.",
        },
      },
      {
        text: "배깅",
        isCorrect: true,
        explanation: {
          basis: "리샘플링(resampling)에 의한 방법 → 배깅",
          reason: "배깅은 전체 학습 데이터 X에서 Ñ개를 복원 추출해 Xᵢ를 만들고 이것으로 i번째 학습기를 학습한다. 전체에서 일부 집합을 추출한다는 서술과 정확히 맞는다.",
        },
      },
    ],
  },
  {
    q: "배깅과 보팅에 대한 설명으로 올바른 것은?",
    answer: 0,
    source: "공식 연습문제",
    basis: "8.2.1 배깅은 학습기 선택, 보팅은 학습기 결합과 관련된 방법",
    examSkill: "배깅(선택)과 보팅(결합)의 역할을 가르고, 배깅에 알맞은 학습기 모델 판단",
    refs: { textbook: "8.2.1 배깅에 의한 학습과 보팅에 의한 결합", slides: "배깅에 의한 학습 / 보팅에 의한 결합" },
    choices: [
      {
        text: "학습 데이터 생성에 리샘플링 기법을 사용한다.",
        isCorrect: true,
        explanation: {
          basis: "배깅 — 부트스트랩(리샘플링 기법)을 앙상블 학습에 적용",
          reason: "배깅은 bootstrap aggregating의 약자로, 제한된 데이터 집합에서 복원 추출로 학습 데이터 집합을 만드는 리샘플링 기법을 사용한다.",
        },
      },
      {
        text: "보팅은 학습기 선택과 관련된 방법이다.",
        isCorrect: false,
        explanation: {
          basis: "배깅은 학습기의 선택, 보팅은 학습기의 결합과 관련된 방법",
          reason: "두 역할이 뒤바뀌었다. 보팅은 M개 학습기의 결과를 동일한 정도로 반영하여 평균하는 결합 방법이다.",
        },
      },
      {
        text: "데이터 집합 변화에 민감하지 않은 학습기가 좋다.",
        isCorrect: false,
        explanation: {
          basis: "배깅 고려사항 — 판별함수가 데이터 집합의 변화에 민감한 모델 선택이 바람직(K-NN, 다층 퍼셉트론)",
          reason: "배깅은 데이터 집합만 달리해 학습기 간 차별성을 얻으므로, 데이터가 바뀌어도 결과가 같은 둔감한 학습기로는 결합 효과가 없다.",
        },
      },
      {
        text: "순차 학습으로 이전 학습기의 결점을 보완한다.",
        isCorrect: false,
        explanation: {
          basis: "부스팅 — 학습기들을 순차적으로 학습하여 이전 학습기의 결점을 보완",
          reason: "순차 학습과 결점 보완은 부스팅의 특징이다. 배깅은 확률적 리샘플링에만 의존해 학습기 간의 차이를 준다.",
        },
      },
    ],
  },
  {
    q: "AdaBoost에 대한 설명으로 적절하지 못한 것은?",
    answer: 3,
    source: "공식 연습문제",
    basis: "8.3 AdaBoost — 목표 출력 tⱼ ∈ {−1, 1}이 주어지는 이진 분류, 같은 데이터 집합, 분류기 중요도를 결합계수로 사용",
    examSkill: "AdaBoost의 특징(같은 데이터·가중치 조정·중요도 결합·이진 분류·지도학습) 판별",
    refs: { textbook: "8.3 부스팅 — AdaBoost", slides: "AdaBoost 알고리즘 — 특징" },
    choices: [
      {
        text: "이진 분류에 적합하다.",
        isCorrect: false,
        explanation: {
          basis: "AdaBoost — 이진 분류 문제에 적합한 방법",
          reason: "목표 출력값을 tⱼ ∈ {−1, 1}로 두고 최종 판별함수도 sign으로 정하므로 이진 분류에 적합하다. 올바른 설명이다.",
        },
      },
      {
        text: "모든 분류기가 같은 데이터 집합을 사용한다.",
        isCorrect: false,
        explanation: {
          basis: "AdaBoost — 같은 데이터 집합을 반복해서 사용",
          reason: "필터링에 의한 부스팅과 달리 같은 데이터 집합을 반복해서 쓰고 데이터별 가중치만 조정한다. 올바른 설명이다.",
        },
      },
      {
        text: "분류기 중요도를 결합계수로 사용한다.",
        isCorrect: false,
        explanation: {
          basis: "f_M(x) = sign(Σ αᵢhᵢ(x)) — 분류기의 중요도 αᵢ가 결합계수",
          reason: "②-3에서 구한 중요도 αᵢ가 최종 결합에서 가중치로 쓰인다. 올바른 설명이다.",
        },
      },
      {
        text: "비지도학습에 해당한다.",
        isCorrect: true,
        explanation: {
          basis: "학습 데이터 X = {(xⱼ, tⱼ)} — 목표 출력값 tⱼ가 주어짐",
          reason: "AdaBoost는 입출력 쌍과 목표 출력값으로 오분류율을 계산하는 지도학습 분류 방법이다. 비지도학습이라는 설명이 틀렸다.",
        },
      },
    ],
  },
  {
    q: "여러 복잡도의 학습기를 순차적으로 결합하는 전략은?",
    answer: 2,
    source: "공식 연습문제",
    basis: "8.4.2 캐스케이딩 — 여러 가지 복잡도를 가진 학습기를 순차적으로 결합",
    examSkill: "결합 방법별 핵심 키워드(복잡도·순차 → 캐스케이딩) 연결",
    refs: { textbook: "8.4.2 캐스케이딩", slides: "캐스케이딩 cascading" },
    choices: [
      {
        text: "다수결 보팅",
        isCorrect: false,
        explanation: {
          basis: "다수결 투표 — 최대 득표를 한 레이블을 출력",
          reason: "모든 학습기의 결과를 한 번에 모아 투표하는 병렬적 결합이며, 학습기의 복잡도 차이를 전략으로 쓰지 않는다.",
        },
      },
      {
        text: "AdaBoost",
        isCorrect: false,
        explanation: {
          basis: "AdaBoost — 같은 모델을 가중치만 달리해 학습하고 αᵢ로 가중 결합",
          reason: "학습은 순차적이지만 복잡도가 서로 다른 학습기를 단계별로 배치하는 전략이 아니며, 최종 결합은 가중 보팅이다.",
        },
      },
      {
        text: "캐스케이딩",
        isCorrect: true,
        explanation: {
          basis: "캐스케이딩 — 여러 가지 복잡도를 가진 학습기들의 순차적인 결합에 중점을 둔 전략",
          reason: "앞 단계에 간단하고 계산 비용이 적은 학습기, 뒤 단계로 갈수록 복잡하고 성능이 좋은 학습기를 두고 순차적으로 결합한다.",
        },
      },
      {
        text: "전문가 혼합",
        isCorrect: false,
        explanation: {
          basis: "전문가 혼합 — 입력에 대한 함수 πᵢ(x)로 복수 개의 학습기를 가중합",
          reason: "학습기들을 가중합하는 결합 방법으로, 복잡도가 다른 학습기를 순차적으로 배치하는 방식이 아니다.",
        },
      },
    ],
  },
  {
    q: "AdaBoost에서 i번째 분류기의 가중 오분류율이 εᵢ = 0.2일 때, 분류기의 중요도 αᵢ는?",
    answer: 1,
    source: "변형",
    basis: "8.3 AdaBoost ②-3 — αᵢ = ½ ln{(1 − εᵢ)/εᵢ}",
    examSkill: "중요도 αᵢ 식에 수치를 넣어 계산",
    refs: { textbook: "8.3 부스팅 — AdaBoost ②-3", slides: "AdaBoost에 의한 분류기의 학습과 분류 과정 ②-3" },
    choices: [
      {
        text: "약 0.347",
        isCorrect: false,
        explanation: {
          basis: "αᵢ = ½ ln(0.8/0.2)",
          reason: "½ ln 2 ≈ 0.347로 계산한 경우다. (1 − 0.2)/0.2 = 4이므로 ln 2가 아니라 ln 4를 써야 한다.",
        },
      },
      {
        text: "약 0.693",
        isCorrect: true,
        explanation: {
          basis: "αᵢ = ½ ln(0.8/0.2) = ½ ln 4 = ln 2",
          reason: "(1 − εᵢ)/εᵢ = 0.8/0.2 = 4, ½ ln 4 = ln 2 ≈ 0.693. εᵢ < 0.5이므로 양의 값이 나온다.",
        },
      },
      {
        text: "약 1.386",
        isCorrect: false,
        explanation: {
          basis: "αᵢ 식 앞의 계수 ½",
          reason: "ln 4 ≈ 1.386에서 ½을 곱하지 않은 값이다.",
        },
      },
      {
        text: "약 −0.693",
        isCorrect: false,
        explanation: {
          basis: "오분류율이 0.5보다 작으면 αᵢ는 양의 값",
          reason: "분자와 분모를 뒤집어 ½ ln(0.2/0.8)로 계산한 경우다. 랜덤보다 나은 분류기(εᵢ < 0.5)의 중요도는 양수다.",
        },
      },
    ],
  },
  {
    q: "AdaBoost의 가중치 수정 단계(②-4)에 대한 설명으로 옳은 것은? (단, εᵢ < 0.5)",
    answer: 2,
    source: "변형",
    basis: "8.3 AdaBoost ②-4 — 바른 출력이면 exp(−αᵢ) < 1, 틀린 출력이면 exp(αᵢ) > 1을 곱한 뒤 Zᵢ로 정규화",
    examSkill: "tⱼhᵢ(xⱼ)의 부호로 가중치 증감 방향 판단",
    refs: { textbook: "8.3 부스팅 — 그림 8-3(b)", slides: "AdaBoost 알고리즘 — ②-4 가중치 수정 비례상수", lecture: "tⱼ와 hᵢ(xⱼ)가 같으면 곱이 양수라 가중치가 줄고, 다르면 곱이 음수라 가중치가 는다고 두 경우를 나눠 설명함" },
    choices: [
      {
        text: "모든 데이터의 가중치에 같은 값 exp(−αᵢ)를 곱한다.",
        isCorrect: false,
        explanation: {
          basis: "곱하는 값 exp{−αᵢtⱼhᵢ(xⱼ)}는 tⱼhᵢ(xⱼ)의 부호에 따라 달라짐",
          reason: "모든 데이터에 같은 값을 곱하면 정규화 후 가중치가 그대로라 학습기 간 차별성이 생기지 않는다.",
        },
      },
      {
        text: "바르게 분류된 데이터의 가중치를 증가시킨다.",
        isCorrect: false,
        explanation: {
          basis: "hᵢ(xⱼ) = tⱼ → exp(−αᵢ) < 1",
          reason: "바르게 분류된 데이터에는 1보다 작은 값이 곱해져 가중치가 감소한다.",
        },
      },
      {
        text: "잘못 분류된 데이터에는 1보다 큰 exp(αᵢ)를 곱해 가중치를 증가시킨다.",
        isCorrect: true,
        explanation: {
          basis: "hᵢ(xⱼ) ≠ tⱼ → tⱼhᵢ(xⱼ) = −1 → exp(αᵢ) > 1",
          reason: "틀린 데이터의 가중치가 커져 다음 분류기가 그 데이터를 더 중요하게 다루게 된다. 이것이 이전 학습기의 결점을 보완하는 방향이다.",
        },
      },
      {
        text: "Zᵢ는 오분류된 데이터 가중치의 합이다.",
        isCorrect: false,
        explanation: {
          basis: "Zᵢ = Σⱼ wⱼ⁽ⁱ⁾ exp{−αᵢtⱼhᵢ(xⱼ)} — 가중치의 합이 1이 되도록 정규화하는 값",
          reason: "오분류된 데이터 가중치의 합은 εᵢ다. Zᵢ는 수정된 가중치 전체를 더한 정규화 값이다.",
        },
      },
    ],
  },
  {
    q: "배깅에서 전체 데이터가 충분히 크지 않아 Ñ = N으로 두었을 때에 대한 설명으로 옳은 것은?",
    answer: 1,
    source: "변형",
    basis: "8.2.1 배깅 고려사항 — Ñ = N이라도 복원 추출을 사용하므로 매 단계 생성되는 데이터의 집합은 동일하지 않음",
    examSkill: "복원 추출이 학습기 간 차이를 만드는 원리 이해",
    refs: { textbook: "8.2.1 배깅에 의한 학습 — 고려할 사항", slides: "배깅에 의한 학습 — 고려사항" },
    choices: [
      {
        text: "모든 학습기가 원래 데이터 집합 X와 똑같은 데이터로 학습된다.",
        isCorrect: false,
        explanation: {
          basis: "② 같은 데이터가 중복해서 선출되는 것도 허락(복원 추출)",
          reason: "크기가 N으로 같을 뿐, 어떤 데이터는 여러 번 뽑히고 어떤 데이터는 한 번도 뽑히지 않으므로 X와 같지 않다.",
        },
      },
      {
        text: "복원 추출이므로 매 단계 생성되는 데이터 집합은 서로 다르다.",
        isCorrect: true,
        explanation: {
          basis: "Ñ = N이라도 복원 추출을 사용하므로 매 단계 생성되는 데이터의 집합은 동일하지 않음",
          reason: "N번 뽑는 동안 중복이 허용되므로 각 Xᵢ의 구성이 달라지고, 그 결과 서로 다른 학습기가 만들어진다.",
        },
      },
      {
        text: "Ñ = N이면 학습기를 하나만 만들 수 있다.",
        isCorrect: false,
        explanation: {
          basis: "④ ②~③ 과정을 M번 반복하여 서로 다른 M개의 학습기를 생성",
          reason: "추출이 매번 새로 이루어지므로 Ñ = N이어도 M개의 서로 다른 학습기를 만들 수 있다.",
        },
      },
      {
        text: "이때는 복원 추출 대신 비복원 추출을 써야 한다.",
        isCorrect: false,
        explanation: {
          basis: "배깅의 ② 단계는 복원 추출",
          reason: "Ñ = N에서 비복원 추출을 쓰면 모든 Xᵢ가 X와 같아져 학습기 간 차이가 사라진다. 교재는 복원 추출을 그대로 쓴다.",
        },
      },
    ],
  },
  {
    q: "보팅으로 결합한 학습기의 일반화 오차가 개별 학습기 평균 일반화 오차의 1/M로 줄어들기 위한 조건은?",
    answer: 0,
    source: "변형",
    basis: "8.2.2 식 8-9, 8-10 — Eₓ[eᵢ(x)eⱼ(x)] = 0일 때 1/M배로 감소",
    examSkill: "식 8-10이 성립하는 가정과 실제 배깅의 한계 구분",
    refs: { textbook: "8.2.2 배깅과 보팅의 효과 — 식 8-9, 8-10", slides: "배깅과 보팅에 의한 효과_일반화 오차" },
    choices: [
      {
        text: "각 학습기가 내는 오차값들이 서로 독립적이다.",
        isCorrect: true,
        explanation: {
          basis: "Eₓ[eᵢ(x)eⱼ(x)] = 0 (식 8-9)",
          reason: "서로 다른 학습기 오차의 곱의 기대치가 0이 되어 식 8-8의 둘째 항이 사라지고, (1/M)·(평균 일반화 오차)만 남는다.",
        },
      },
      {
        text: "각 학습기의 오차가 양의 상관관계를 갖는다.",
        isCorrect: false,
        explanation: {
          basis: "양의 상관관계를 가지면 일반화 오차는 증가",
          reason: "단순한 배깅이 바로 이 경우라서 식 8-10만큼의 감소를 기대하기 어렵다.",
        },
      },
      {
        text: "모든 학습기가 같은 데이터로 학습된다.",
        isCorrect: false,
        explanation: {
          basis: "학습 데이터의 차별화 — 같은 모델을 다른 데이터로 학습",
          reason: "같은 데이터로 학습한 같은 모델은 거의 같은 오차를 내므로 오히려 상관관계가 커진다.",
        },
      },
      {
        text: "결합하는 학습기의 수 M이 1이다.",
        isCorrect: false,
        explanation: {
          basis: "식 8-10의 1/M",
          reason: "M = 1이면 결합이 없어 감소도 없다. 조건은 학습기 수가 아니라 오차의 독립성이다.",
        },
      },
    ],
  },
  {
    q: "세 분류기가 이진 분류 문제에서 클래스 C₁일 확률을 각각 0.9, 0.4, 0.4로 출력했다. 하드 보팅(다수결)과 소프트 보팅의 결과를 순서대로 고른 것은?",
    answer: 3,
    source: "변형",
    basis: "8.4.1 보팅법 — 하드 보팅 hᵢʲ(x) ∈ {0, 1}, 소프트 보팅 hᵢʲ(x) ∈ [0, 1]",
    examSkill: "하드·소프트 보팅을 직접 계산해 결과가 갈리는 경우 판단",
    refs: { textbook: "8.4.1 기본적인 결합 방법 — 보팅법", slides: "기본적인 결합 방법 — 보팅법" },
    choices: [
      {
        text: "C₁, C₁",
        isCorrect: false,
        explanation: {
          basis: "하드 보팅 — 각 분류기의 출력을 0 또는 1로 표현",
          reason: "두 번째와 세 번째 분류기는 C₁ 확률이 0.4라 C₂에 1표씩 준다. 하드 보팅은 C₂가 2 : 1로 이긴다.",
        },
      },
      {
        text: "C₂, C₂",
        isCorrect: false,
        explanation: {
          basis: "소프트 보팅 — 확률값을 그대로 더함",
          reason: "C₁ 확률 합은 0.9 + 0.4 + 0.4 = 1.7, C₂는 0.1 + 0.6 + 0.6 = 1.3이라 소프트 보팅은 C₁이다.",
        },
      },
      {
        text: "C₁, C₂",
        isCorrect: false,
        explanation: {
          basis: "두 방식의 계산 순서",
          reason: "결과를 뒤바꿔 적었다. 하드는 C₂(2표 대 1표), 소프트는 C₁(1.7 대 1.3)이다.",
        },
      },
      {
        text: "C₂, C₁",
        isCorrect: true,
        explanation: {
          basis: "하드: C₂ 2표 · C₁ 1표 / 소프트: C₁ 1.7 · C₂ 1.3",
          reason: "하드 보팅은 강하게 확신한 첫 분류기도 한 표로만 세지만, 소프트 보팅은 0.9라는 확신의 크기가 반영되어 결과가 C₁으로 바뀐다.",
        },
      },
    ],
  },
  {
    q: "AdaBoost의 결합과 전문가 혼합법의 결합을 비교한 설명으로 옳은 것은?",
    answer: 2,
    source: "변형",
    basis: "8.4.3 전문가 혼합 — 가중합 계수 πᵢ(x)가 입력에 대한 함수, AdaBoost의 αᵢ는 분류기마다 하나로 정해지는 값",
    examSkill: "결합 계수가 상수인지 입력의 함수인지로 결합 방법 구분",
    refs: { textbook: "8.4.3 전문가 혼합", slides: "전문가 혼합 mixture of experts", lecture: "AdaBoost의 αᵢ는 학습기마다 고정된 값이고 전문가 혼합의 πᵢ(x)는 입력에 따라 달라진다고 대비함" },
    choices: [
      {
        text: "두 방법 모두 결합 계수가 입력 x에 따라 달라진다.",
        isCorrect: false,
        explanation: {
          basis: "AdaBoost — αᵢ는 분류 성능에 의존해 각 분류기마다 하나로 정해짐",
          reason: "AdaBoost의 αᵢ는 입력과 무관한 상수다. 입력에 따라 달라지는 것은 전문가 혼합의 πᵢ(x)뿐이다.",
        },
      },
      {
        text: "전문가 혼합은 모든 학습기에 같은 가중치 1/M을 준다.",
        isCorrect: false,
        explanation: {
          basis: "단순 보팅(단순평균)의 계수 1/M",
          reason: "모두에게 같은 가중치를 주는 것은 단순 보팅이다.",
        },
      },
      {
        text: "전문가 혼합의 계수 πᵢ(x)는 입력의 함수라서 입력에 따라 중요하게 쓰는 학습기가 달라진다.",
        isCorrect: true,
        explanation: {
          basis: "f(x) = Σ πᵢ(x)hᵢ(x) (식 8-15)",
          reason: "입력 공간의 특정 영역을 담당하는 학습기가 그 영역에서 큰 계수를 받는다. '전문가'라는 이름도 여기서 왔다.",
        },
      },
      {
        text: "AdaBoost는 계수 없이 다수결로만 결합한다.",
        isCorrect: false,
        explanation: {
          basis: "f_M(x) = sign(Σ αᵢhᵢ(x))",
          reason: "AdaBoost는 분류기의 중요도 αᵢ를 가중치로 쓰는 가중 보팅이다.",
        },
      },
    ],
  },
  {
    q: "필터링에 의한 부스팅에서 새로운 데이터가 주어졌을 때 h₁의 결과는 C₂, h₂의 결과는 C₂, h₃의 결과는 C₁이었다. 최종 결과는?",
    answer: 1,
    source: "변형",
    basis: "8.3 필터링에 의한 부스팅 — h₁과 h₂의 결과가 일치하면 그 결과, 일치하지 않으면 h₃의 결과",
    examSkill: "필터링에 의한 부스팅의 추론 규칙 적용",
    refs: { textbook: "8.3 부스팅 — 필터링에 의한 부스팅", slides: "필터링에 의한 부스팅 — 추론 과정" },
    choices: [
      {
        text: "C₁ — 마지막 학습기 h₃의 결과를 항상 따른다.",
        isCorrect: false,
        explanation: {
          basis: "h₃는 h₁과 h₂가 불일치할 때만 사용",
          reason: "h₃는 h₁과 h₂의 결과가 서로 다른 데이터로 학습된 학습기라, 둘이 일치할 때는 쓰지 않는다.",
        },
      },
      {
        text: "C₂ — h₁과 h₂의 결과가 일치하므로 그 결과가 최종 결과다.",
        isCorrect: true,
        explanation: {
          basis: "if (h₁과 h₂의 결과가 일치) then 해당 결과가 최종 결과",
          reason: "h₁ = h₂ = C₂로 일치하므로 h₃의 결과와 상관없이 C₂가 최종 결과다.",
        },
      },
      {
        text: "C₁ — h₁과 h₂의 결과가 서로 다르므로 h₃의 결과를 따른다.",
        isCorrect: false,
        explanation: {
          basis: "h₁ = C₂, h₂ = C₂",
          reason: "h₁과 h₂는 모두 C₂로 일치한다. h₃는 두 결과가 불일치할 때만 쓰인다.",
        },
      },
      {
        text: "판단할 수 없다 — 결과를 기각한다.",
        isCorrect: false,
        explanation: {
          basis: "기각은 다수결 투표에 과반수 개념을 도입한 경우",
          reason: "필터링에 의한 부스팅은 항상 h₁·h₂ 또는 h₃의 결과를 최종 결과로 낸다.",
        },
      },
    ],
  },
  {
    q: "기본 학습기의 결과를 결합하는 학습기(결합기)를 학습할 때 기본 학습기의 학습에 사용되지 않은 새로운 데이터를 준비하는 이유는?",
    answer: 0,
    source: "변형",
    basis: "8.4.1 결합기 — 기본 학습기의 학습 데이터를 결합기의 학습 데이터로 사용하면 과다적합의 위험이 커짐",
    examSkill: "결합기 학습 데이터 구성 방법과 그 이유",
    refs: { textbook: "8.4.1 기본적인 결합 방법 — 결합기", slides: "기본적인 결합 방법 — 결합기를 사용하는 방법" },
    choices: [
      {
        text: "기본 학습기의 학습 데이터를 다시 쓰면 과다적합의 위험이 커지기 때문",
        isCorrect: true,
        explanation: {
          basis: "과다적합의 위험",
          reason: "기본 학습기가 이미 맞춰 둔 데이터에 대한 출력으로 결합기를 학습하면 결합기가 그 데이터에 과다적합되기 쉽다.",
        },
      },
      {
        text: "결합기의 입력이 원래 입력 x이기 때문",
        isCorrect: false,
        explanation: {
          basis: "결합기의 학습 데이터 ((zᵢ₁, …, zᵢ_M), yᵢ)",
          reason: "결합기의 입력은 원래 입력이 아니라 기본 학습기들의 출력값 zᵢⱼ다.",
        },
      },
      {
        text: "목표 출력값 yᵢ가 필요 없기 때문",
        isCorrect: false,
        explanation: {
          basis: "결합기의 학습 데이터에 목표 출력값 yᵢ 포함",
          reason: "결합기 학습 데이터에는 목표 출력값 yᵢ가 그대로 들어간다.",
        },
      },
      {
        text: "기본 학습기의 수 M을 줄이기 위해서",
        isCorrect: false,
        explanation: {
          basis: "결합기 학습 데이터 구성",
          reason: "새 데이터를 준비해도 기본 학습기 M개는 그대로이며, 각 학습기의 출력이 결합기 입력의 한 성분이 된다.",
        },
      },
    ],
  },
];


export default function Lecture6Quiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(QUIZZES.length).fill(null)
  );

  const answered = (i: number) => answers[i] !== null;
  const correctCount = answers.filter(
    (a, i) => a !== null && a === QUIZZES[i].answer
  ).length;
  const allAnswered = answers.every((a) => a !== null);

  const select = (qi: number, ci: number) => {
    if (answers[qi] !== null) return;
    setAnswers((prev) => prev.map((v, i) => (i === qi ? ci : v)));
  };

  return (
    <section>
      <SectionTitle
        title="복습 퀴즈"
        subtitle={`공식 연습문제 ${QUIZZES.filter((q) => q.source === "공식 연습문제").length}문항과 변형 문제 ${QUIZZES.filter((q) => q.source === "변형").length}문항`}
      />

      <div className="space-y-6">
        {QUIZZES.map((quiz, qi) => {
          const done = answered(qi);
          const isCorrect = answers[qi] === quiz.answer;
          return (
            <Sourced key={qi} refs={quiz.refs}>
            <div
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
                  {qi + 1}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    quiz.source === "공식 연습문제"
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {quiz.source}
                </span>
                <span className="text-[11px] text-gray-400">{quiz.examSkill}</span>
              </div>

              <h4 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">
                {quiz.q}
              </h4>

              <div className="space-y-2">
                {quiz.choices.map((choice, ci) => {
                  let style =
                    "border-gray-200 bg-gray-50 hover:bg-amber-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-amber-900/10";
                  if (done) {
                    if (choice.isCorrect) {
                      style =
                        "border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/20";
                    } else if (ci === answers[qi]) {
                      style =
                        "border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/20";
                    } else {
                      style =
                        "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800";
                    }
                  }
                  return (
                    <div key={ci}>
                      <button
                        onClick={() => select(qi, ci)}
                        disabled={done}
                        className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${style}`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="shrink-0 text-xs font-bold text-gray-400">
                            {String.fromCharCode(9312 + ci)}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {choice.text}
                          </span>
                          {done && choice.isCorrect && (
                            <CheckCircle
                              size={16}
                              className="ml-auto shrink-0 text-green-500"
                            />
                          )}
                          {done && ci === answers[qi] && !choice.isCorrect && (
                            <XCircle
                              size={16}
                              className="ml-auto shrink-0 text-red-500"
                            />
                          )}
                        </div>
                      </button>

                      <AnimatePresence>
                        {done && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-1 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                              <p className="text-[11px] font-bold text-gray-500">
                                근거 · {choice.explanation.basis}
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                                {choice.explanation.reason}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {done && (
                <div
                  className={`mt-4 rounded-lg p-3 ${
                    isCorrect
                      ? "bg-green-50 dark:bg-green-900/20"
                      : "bg-red-50 dark:bg-red-900/20"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      isCorrect
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    {isCorrect ? "정답" : "오답"} — 정답은{" "}
                    {String.fromCharCode(9312 + quiz.answer)}번
                  </p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {quiz.basis}
                  </p>
                </div>
              )}
            </div>
            </Sourced>
          );
        })}
      </div>

      {allAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20"
        >
          <div>
            <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
              결과: {correctCount} / {QUIZZES.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {correctCount === QUIZZES.length
                ? "완벽합니다."
                : correctCount >= QUIZZES.length - 3
                ? "잘 했습니다."
                : "복습이 필요합니다."}
            </p>
          </div>
          <button
            onClick={() => setAnswers(new Array(QUIZZES.length).fill(null))}
            className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
          >
            <RotateCcw size={14} />
            다시 풀기
          </button>
        </motion.div>
      )}
    </section>
  );
}
