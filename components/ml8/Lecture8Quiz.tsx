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
    q: "SVM의 학습 목적과 관련이 없는 표현은?",
    answer: 1,
    source: "공식 연습문제",
    refs: { textbook: "10.2.1 최대 마진 분류기", slides: "SVM — 최대 마진 분류기" },
    basis: "교재 10.2.1 — 일반화 오차를 작게 하려면 두 클래스 간의 간격을 최대로, 곧 마진을 최대로 하는 결정경계를 찾음",
    examSkill: "최대화하는 대상과 최소화하는 대상의 구분",
    choices: [
      {
        text: "일반화 오차 최소화",
        isCorrect: false,
        explanation: {
          basis: "SVM = 일반화 오차를 최소화할 수 있는 방향으로 학습이 이루어지도록 설계된 선형 분류기",
          reason: "일반화 오차를 최소화하는 것이 SVM 설계의 출발점이다. 학습 목적과 관련 있는 표현이므로 정답이 아니다.",
        },
      },
      {
        text: "마진 최소화",
        isCorrect: true,
        explanation: {
          basis: "마진의 최대화 ⇔ ‖w‖의 최소화",
          reason:
            "SVM은 마진을 최소화하지 않고 최대화한다. 최소화되는 것은 마진이 아니라 ‖w‖(목적함수 J(w) = ‖w‖²/2)이며, 이 둘을 뒤섞은 표현이 '마진 최소화'다.",
        },
      },
      {
        text: "클래스 간 간격 최대화",
        isCorrect: false,
        explanation: {
          basis: "일반화 오차가 작아지기 위해서는 두 클래스 간의 간격을 최대로 하는 것이 좋음",
          reason: "두 클래스 간의 간격을 최대로 하는 것이 곧 마진 최대화다. 학습 목적과 관련 있는 표현이다.",
        },
      },
      {
        text: "결정경계와 가까운 데이터의 거리 최대화",
        isCorrect: false,
        explanation: {
          basis: "마진 = 결정경계에 가장 가까운 데이터로부터 결정경계까지의 거리",
          reason: "마진의 정의를 풀어 쓴 것이므로 '가까운 데이터의 거리 최대화'는 마진 최대화와 같은 말이다.",
        },
      },
    ],
  },
  {
    q: "결정경계에 가장 가까운 학습 데이터를 무엇이라고 하는가?",
    answer: 2,
    source: "공식 연습문제",
    refs: { textbook: "10.2.1 최대 마진 분류기", slides: "SVM — 서포트 벡터" },
    basis: "교재 10.2.1 — 결정경계에 가장 가까운 곳에 있는 데이터를 서포트 벡터라 함",
    examSkill: "마진(거리)과 서포트 벡터(데이터)의 구분",
    choices: [
      {
        text: "마진",
        isCorrect: false,
        explanation: {
          basis: "마진 = 결정경계에 가장 가까운 데이터로부터 결정경계까지의 거리",
          reason: "마진은 데이터가 아니라 거리다. 가장 가까운 데이터 '까지의 거리'가 마진이고, 그 데이터 자체는 서포트 벡터다.",
        },
      },
      {
        text: "슬랙 변수",
        isCorrect: false,
        explanation: {
          basis: "슬랙변수 = 잘못 분류된 데이터로부터 해당 클래스의 경계까지의 거리",
          reason: "슬랙변수는 선형 분리가 불가능할 때 오분류를 허용하는 정도를 나타내는 거리 값이지, 가장 가까운 데이터를 부르는 이름이 아니다.",
        },
      },
      {
        text: "서포트 벡터",
        isCorrect: true,
        explanation: {
          basis: "서포트 벡터(support vector) — 결정경계에 가장 가까운 곳에 있는 데이터",
          reason: "결정경계에 가장 가까운 학습 데이터가 서포트 벡터이며, 이 데이터가 마진을 결정한다. 학습 후에는 α̂ᵢ ≠ 0인 데이터로 나타난다.",
        },
      },
      {
        text: "커널 벡터",
        isCorrect: false,
        explanation: {
          basis: "커널 함수 k(x, y) = Φ(x)·Φ(y)",
          reason: "교재와 강의록에 '커널 벡터'라는 용어는 없다. 커널은 두 벡터의 내적을 대신하는 함수를 가리킨다.",
        },
      },
    ],
  },
  {
    q: "SVM 학습에서 사용·언급되지 않는 용어는?",
    answer: 0,
    source: "공식 연습문제",
    refs: { textbook: "10.2.2 SVM의 학습", slides: "SVM의 학습" },
    basis: "교재 10.2.2 — 라그랑주 승수로 라그랑주 함수를 만들고, 이원적 문제 Q(α)를 이차계획법으로 풂",
    examSkill: "SVM 학습 절차에 등장하는 용어 식별",
    choices: [
      {
        text: "오류 역전파 방법",
        isCorrect: true,
        explanation: {
          basis: "SVM 학습 흐름: 라그랑주 함수 → 미분 → 대입 → 이원적 문제 Q(α) → 이차계획법",
          reason: "오류 역전파는 신경망 학습에서 사용하는 방법이다. SVM의 학습 절차 어디에도 등장하지 않는다.",
        },
      },
      {
        text: "라그랑주 승수",
        isCorrect: false,
        explanation: {
          basis: "라그랑주 승수 αᵢ ≥ 0 (i = 1, …, N)를 도입해 목적함수와 조건을 하나의 함수식으로 표현",
          reason: "목적함수를 최소화하면서 조건도 만족해야 하므로 라그랑주 승수를 이용한 최적화 방법을 적용한다.",
        },
      },
      {
        text: "이원적 문제",
        isCorrect: false,
        explanation: {
          basis: "Q(α)로 표현된 최적화 문제 = 라그랑주 함수 J(w, w₀, α)에 대한 이원적 문제(dual problem)",
          reason: "J 대신 α만의 함수 Q(α)를 최적화해 파라미터를 얻는다. SVM 학습의 핵심 용어다.",
        },
      },
      {
        text: "이차계획법",
        isCorrect: false,
        explanation: {
          basis: "Q(α)는 αᵢ에 대한 이차함수 → 이차계획법(quadratic programming)으로 해를 구함",
          reason: "Q(α)를 최대화하는 추정치 α̂ᵢ를 찾는 방법이 이차계획법이다.",
        },
      },
    ],
  },
  {
    q: "SVM에 대한 설명 중 적절한 것은?",
    answer: 2,
    source: "공식 연습문제",
    refs: { textbook: "10.3.2 커널법과 SVM", slides: "커널법과 SVM" },
    basis: "교재 10.3 — 커널법은 고차원 매핑으로 비선형 문제를 선형화하고, 커널 함수로 계산량 증가 문제를 해결",
    examSkill: "학습 유형, 슬랙변수의 방향, 커널법의 역할, 이진 분류기라는 성질을 한꺼번에 점검",
    choices: [
      {
        text: "비지도학습이다.",
        isCorrect: false,
        explanation: {
          basis: "학습 데이터 {(xᵢ, yᵢ)}, yᵢ = +1 if xᵢ ∈ C₁, −1 if xᵢ ∈ C₂",
          reason: "SVM은 목표 출력값 yᵢ가 함께 주어지는 지도학습이다.",
        },
      },
      {
        text: "슬랙변수가 작을수록 더 심한 오분류를 허용한다.",
        isCorrect: false,
        explanation: {
          basis: "ξᵢ가 클수록 더 심한 오분류를 허용함을 의미",
          reason: "방향이 반대다. 슬랙변수가 클수록 경계에서 더 멀리 넘어간 데이터를 허용하므로 더 심한 오분류를 허용한다.",
        },
      },
      {
        text: "커널법으로 선형 분리가 불가능한 데이터도 처리할 수 있다.",
        isCorrect: true,
        explanation: {
          basis: "커널법 = 고차원 매핑을 통해 비선형 문제를 선형화하여 해결하면서 커널 함수로 계산량 증가 문제를 해결",
          reason: "원형 경계가 필요한 2차원 데이터도 Φ로 3차원에 보내면 평면 하나로 나뉜다. 커널법이 비선형 분류를 고차원 공간의 선형 문제로 바꾼다.",
        },
      },
      {
        text: "기본적으로 다중 클래스 분류용으로 설계되었다.",
        isCorrect: false,
        explanation: {
          basis: "SVM은 이진 분류기 → 다중 클래스는 1대 나머지 또는 1대 1 방법 적용",
          reason: "SVM은 이진 분류기이며, 다중 클래스 문제에는 여러 이진 SVM을 묶는 방법을 따로 적용한다.",
        },
      },
    ],
  },
  {
    q: "커널법에 관련된 설명으로 적절하지 못한 것은?",
    answer: 0,
    source: "공식 연습문제",
    refs: { textbook: "10.3.1 커널의 필요성 · 10.3.2 커널법과 SVM", slides: "비선형 분류 문제의 해결 방법" },
    basis: "교재 10.3.1 — 슬랙변수는 결국 선형 초평면을 결정경계로 사용하므로 한계를 극복할 수 없어 더 적극적인 해결책으로 커널법을 씀",
    examSkill: "슬랙변수와 커널법이 각각 무엇을 해결하는지의 구분",
    choices: [
      {
        text: "SVM에서는 커널법보다 슬랙변수가 비선형 분류 해결에 더 효과적이다.",
        isCorrect: true,
        explanation: {
          basis: "슬랙변수를 통해 선형 분리가 불가능한 경우에도 제한적인 해결 가능",
          reason:
            "슬랙변수는 오분류 허용 정도를 조절할 뿐 결정경계는 여전히 선형 초평면이라 비선형성을 직접 처리하지 못한다. 비선형 분류 문제의 대표적 해결 방법은 커널법이다.",
        },
      },
      {
        text: "커널 함수로 계산량 증가 문제를 해결할 수 있다.",
        isCorrect: false,
        explanation: {
          basis: "k(x, y) = Φ(x)·Φ(y) = (x·y)² — 3차원 벡터 연산 없이 원래 차원인 2차원 계산만으로 값을 얻음",
          reason: "커널 함수가 해결하는 문제가 바로 계산량 증가다. 적절한 설명이다.",
        },
      },
      {
        text: "SVM처럼 선형성을 가정하는 방법론에서 사용된다.",
        isCorrect: false,
        explanation: {
          basis: "커널법은 SVM을 비롯한 선형성을 가정하는 방법론에서 사용되고 있음",
          reason: "교재의 커널법 정의 바로 뒤에 나오는 서술 그대로다. 적절한 설명이다.",
        },
      },
      {
        text: "저차원 입력을 고차원 입력 공간의 값으로 변환한다.",
        isCorrect: false,
        explanation: {
          basis: "저차원의 입력 x를 좀 더 고차원 공간의 값 Φ(x)로 매핑시키는 함수 Φ",
          reason: "고차원 매핑이 커널법의 출발점이다. 적절한 설명이다.",
        },
      },
    ],
  },
  {
    q: "선형 분류기에 대한 설명으로 옳은 것은?",
    answer: 1,
    source: "변형",
    refs: { textbook: "10.1.2 선형 초평면 분류기", slides: "선형 초평면 분류기 — 특징" },
    basis: "교재 10.1.2 — 분류 복잡도가 가장 낮아 좋은 성능은 기대하기 힘드나 과다적합의 문제를 피할 수 있음",
    examSkill: "선형 분류기의 장단점 짝짓기",
    choices: [
      {
        text: "학습 시스템의 분류 복잡도가 가장 높다.",
        isCorrect: false,
        explanation: {
          basis: "선형 분류기는 학습 시스템의 분류 복잡도가 가장 낮은 분류기",
          reason: "복잡도가 가장 '낮은' 분류기다. 높은 쪽은 비선형 분류기다.",
        },
      },
      {
        text: "과다적합의 문제를 피할 수 있다.",
        isCorrect: true,
        explanation: {
          basis: "표현할 수 있는 결정경계에 제약이 많아 성능은 기대하기 힘드나 과다적합의 문제를 피할 수 있음",
          reason: "복잡도가 낮아 학습 데이터에만 지나치게 맞춘 경계를 만들 수 없으므로 과다적합을 피한다. SVM이 선형 분류기에서 설계를 시작하는 이유다.",
        },
      },
      {
        text: "표현할 수 있는 결정경계에 제약이 거의 없다.",
        isCorrect: false,
        explanation: {
          basis: "표현할 수 있는 결정경계에 제약이 많음",
          reason: "2차원에서는 직선, 그 이상에서는 초평면만 표현할 수 있어 제약이 많다.",
        },
      },
      {
        text: "학습 오차가 항상 0이 되도록 학습된다.",
        isCorrect: false,
        explanation: {
          basis: "그림 10-1(a) — 선형 분류기는 학습 데이터를 제대로 분류하지 못하여 학습 오차가 발생",
          reason: "선형 분리가 불가능한 학습 데이터에서는 선형 분류기에 학습 오차가 생긴다. 학습 오차가 없던 쪽은 비선형 분류기였다.",
        },
      },
    ],
  },
  {
    q: "학습으로 얻은 최대 마진 경계가 ŵ = (−0.5, 0.5), ŵ₀ = 0.5일 때 마진 M = 2/‖ŵ‖의 값은?",
    answer: 2,
    source: "변형",
    refs: { textbook: "10.2.1 최대 마진 분류기 (식 10-6)", slides: "마진 계산" },
    basis: "식 10-6 — M = (1/‖w‖)((wᵀχ⁺ + w₀) − (wᵀχ⁻ + w₀)) = 2/‖w‖",
    examSkill: "‖w‖ 계산과 마진 공식의 적용",
    choices: [
      {
        text: "약 0.71",
        isCorrect: false,
        explanation: {
          basis: "‖ŵ‖ = √(0.25 + 0.25) = √0.5 ≈ 0.71",
          reason: "0.71은 마진이 아니라 ‖ŵ‖ 자체다. 여기서 2를 나눠야 한다.",
        },
      },
      {
        text: "약 1.41",
        isCorrect: false,
        explanation: {
          basis: "결정경계에서 서포트 벡터까지의 거리 = 1/‖ŵ‖ ≈ 1.41",
          reason: "1.41은 한쪽 서포트 벡터에서 결정경계까지의 거리다. M은 χ⁺까지와 χ⁻까지 거리의 합이므로 두 배가 된다.",
        },
      },
      {
        text: "약 2.83",
        isCorrect: true,
        explanation: {
          basis: "M = 2/‖ŵ‖ = 2/√0.5 = 2√2",
          reason: "‖ŵ‖ = √0.5 ≈ 0.7071이므로 M = 2/0.7071 ≈ 2.83. ŵ₀는 경계의 위치만 바꿀 뿐 마진 크기에는 들어가지 않는다.",
        },
      },
      {
        text: "4",
        isCorrect: false,
        explanation: {
          basis: "M = 2/‖ŵ‖",
          reason: "2/0.5 = 4는 ‖ŵ‖ 대신 ‖ŵ‖² = 0.5로 나눈 값이다. 마진 공식의 분모는 노름 ‖ŵ‖이다.",
        },
      },
    ],
  },
  {
    q: "이원적 문제 Q(α)에 대한 설명으로 옳은 것은?",
    answer: 3,
    source: "변형",
    refs: { textbook: "10.2.2 SVM의 학습 (식 10-14, 10-15)", slides: "SVM의 학습 — 이원적 문제" },
    basis: "교재 10.2.2 — Q(α)는 αᵢ에 대한 이차함수로 이차계획법으로 간단히 해를 구할 수 있고 유일한 최대값을 가짐",
    examSkill: "Q(α)의 변수, 최적화 방향, 조건의 확인",
    choices: [
      {
        text: "Q(α)는 w와 w₀에 대한 함수이다.",
        isCorrect: false,
        explanation: {
          basis: "w = Σαᵢyᵢxᵢ와 Σαᵢyᵢ = 0을 대입해 α에 대하여 표현된 새로운 목적함수",
          reason: "w와 w₀를 대입해 없앴기 때문에 Q(α)에는 α만 남는다.",
        },
      },
      {
        text: "Q(α)를 최소화하는 α를 찾는다.",
        isCorrect: false,
        explanation: {
          basis: "Q(α)를 최대화하는 추정치 α̂ᵢ를 이차계획법에 의해 찾음",
          reason: "라그랑주 함수를 α에 대해서는 극대화하므로 Q(α)도 최대화한다.",
        },
      },
      {
        text: "조건은 αᵢ ≤ 0 이다.",
        isCorrect: false,
        explanation: {
          basis: "Σαᵢyᵢ = 0, αᵢ ≥ 0 (식 10-15)",
          reason: "라그랑주 승수는 0 이상이다. 부등호 방향이 반대다.",
        },
      },
      {
        text: "αᵢ에 대한 이차함수이므로 이차계획법으로 해를 구한다.",
        isCorrect: true,
        explanation: {
          basis: "Q(α) = Σαᵢ − ½ΣΣαᵢαⱼyᵢyⱼxᵢᵀxⱼ",
          reason: "αᵢαⱼ 항이 있는 이차함수이고, 이차계획법을 이용하면 간단히 해를 구할 수 있을 뿐 아니라 유일한 최대값을 갖게 된다.",
        },
      },
    ],
  },
  {
    q: "SVM으로 새 데이터를 분류할 때 모든 학습 데이터가 아니라 서포트 벡터만 저장해 두면 되는 이유는?",
    answer: 0,
    source: "변형",
    refs: { textbook: "10.2.3 SVM에 의한 분류", slides: "SVM의 학습 — 저장 데이터의 수와 계산량 문제" },
    basis: "교재 10.2.2~10.2.3 — 대부분의 α̂ᵢ는 0이 되고 yᵢ(wᵀxᵢ + w₀) − 1 = 0인 서포트 벡터만 α̂ᵢ ≠ 0",
    examSkill: "α̂ᵢ의 성질과 분류 함수 f(x)의 연결",
    choices: [
      {
        text: "서포트 벡터가 아닌 데이터의 α̂ᵢ는 0이라 분류 함수의 합에서 사라지기 때문",
        isCorrect: true,
        explanation: {
          basis: "f(x) = sign(Σα̂ᵢyᵢxᵢᵀx + ŵ₀)",
          reason: "합의 각 항이 α̂ᵢ와 곱해져 있으므로 α̂ᵢ = 0인 데이터는 결과에 영향이 없다. 저장할 데이터 수와 계산량이 현격히 줄어든다.",
        },
      },
      {
        text: "서포트 벡터는 항상 두 개뿐이기 때문",
        isCorrect: false,
        explanation: {
          basis: "그림 10-5 — 3개의 서포트 벡터와 초평면",
          reason: "서포트 벡터의 개수는 데이터에 따라 달라진다. 교재 그림 10-5에서는 3개이며, 강의록의 커널 실험에서는 5개(다항식 커널), 9개(가우시안 커널)가 나온다.",
        },
      },
      {
        text: "서포트 벡터가 아닌 데이터는 오분류된 데이터이기 때문",
        isCorrect: false,
        explanation: {
          basis: "결정경계와 떨어져 있는 대부분의 데이터는 yᵢ(wᵀxᵢ + w₀) − 1 ≥ 0을 만족",
          reason: "서포트 벡터가 아닌 데이터는 오히려 경계에서 멀리 떨어져 제대로 분류된 데이터다.",
        },
      },
      {
        text: "ŵ₀를 계산하는 데 모든 데이터가 필요 없기 때문",
        isCorrect: false,
        explanation: {
          basis: "②-4 ŵ₀ = (1/Nₛ) Σ_{xᵢ∈Xₛ}(yᵢ − Σα̂ⱼyⱼxⱼᵀxᵢ)",
          reason: "ŵ₀도 서포트 벡터로 계산하는 것은 맞지만, 그 자체가 이유는 아니다. 근본 이유는 서포트 벡터가 아닌 데이터의 α̂ᵢ가 0이라는 점이다.",
        },
      },
    ],
  },
  {
    q: "클래스가 5개인 문제에 1대 1 방법을 적용할 때 필요한 SVM의 개수는?",
    answer: 1,
    source: "변형",
    refs: { textbook: "10.2.3 SVM에 의한 분류 — 1대 1 방법", slides: "다중 클래스 분류 문제에 적용 방법" },
    basis: "1대 1 방법 — 가능한 모든 클래스의 쌍에 대해 k(k − 1)/2개의 SVM",
    examSkill: "1대 나머지(k개)와 1대 1(k(k − 1)/2개) 개수 공식 구분",
    choices: [
      {
        text: "5개",
        isCorrect: false,
        explanation: { basis: "1대 나머지 방법 — k개의 이진 분류기", reason: "5개는 1대 나머지 방법의 분류기 수다." },
      },
      {
        text: "10개",
        isCorrect: true,
        explanation: { basis: "k(k − 1)/2 = 5 × 4 / 2", reason: "모든 클래스 쌍의 수 5×4/2 = 10개의 SVM을 만들고 보팅으로 결합한다." },
      },
      {
        text: "20개",
        isCorrect: false,
        explanation: { basis: "k(k − 1)/2", reason: "5 × 4 = 20은 2로 나누지 않은 값이다. (A, B)와 (B, A)는 같은 쌍이다." },
      },
      {
        text: "25개",
        isCorrect: false,
        explanation: { basis: "k(k − 1)/2", reason: "k² = 25는 자기 자신과의 쌍과 순서가 다른 쌍까지 모두 센 값이다." },
      },
    ],
  },
  {
    q: "슬랙변수를 가진 SVM에서 하이퍼파라미터 c를 크게 하면?",
    answer: 2,
    source: "변형",
    refs: { textbook: "10.2.4 (2) 파라미터의 추정", slides: "슬랙변수와 커널을 가진 SVM 분류기의 학습과 인식 과정" },
    basis: "교재 10.2.4 — c의 값이 크면 ξᵢ의 값이 커지는 것을 강하게 저지하므로 오분류 오차가 적어짐",
    examSkill: "c와 ξ의 관계, 이원적 문제에서 c가 들어가는 자리",
    choices: [
      {
        text: "오분류 허용도가 높아진다.",
        isCorrect: false,
        explanation: { basis: "c의 값이 작아지면 오분류 허용도가 높아짐", reason: "허용도가 높아지는 쪽은 c를 작게 할 때다." },
      },
      {
        text: "이원적 문제 Q(α)의 식 자체가 바뀐다.",
        isCorrect: false,
        explanation: {
          basis: "최대화할 목적함수 Q(α)는 앞 항과 완전히 일치하고 αᵢ ≤ c 조건만 추가",
          reason: "c는 Q(α)의 식이 아니라 조건 0 ≤ αᵢ ≤ c에만 들어간다.",
        },
      },
      {
        text: "ξᵢ가 커지는 것을 강하게 저지해 오분류 오차가 적어진다.",
        isCorrect: true,
        explanation: {
          basis: "J(w, ξ) = ½‖w‖² + cΣξᵢ",
          reason: "c가 크면 cΣξᵢ 항의 비중이 커져 ξᵢ를 줄이는 쪽으로 학습된다. 앞의 실습에서도 c를 키울수록 Σξᵢ가 줄고 마진은 좁아졌다.",
        },
      },
      {
        text: "사용하는 커널 함수가 가우시안 커널로 바뀐다.",
        isCorrect: false,
        explanation: {
          basis: "① 하이퍼파라미터 c와 커널 함수 k(xᵢ, xⱼ)를 정의",
          reason: "c와 커널 함수는 각각 따로 정하는 것이다. c 값이 커널 종류를 결정하지 않는다.",
        },
      },
    ],
  },
  {
    q: "x = (1, 2), y = (3, 1)일 때 Φ(x₁, x₂) = (x₁², √2x₁x₂, x₂²)에 대한 커널 함수 k(x, y) = Φ(x)·Φ(y)의 값은?",
    answer: 2,
    source: "변형",
    refs: { textbook: "10.3.2 커널법과 SVM (식 10-31)", slides: "커널법과 SVM — k(x, y) = (x·y)²" },
    basis: "식 10-31 — k(x, y) = Φ(x)·Φ(y) = (x·y)²",
    examSkill: "커널 트릭으로 고차원 내적을 원래 차원에서 계산",
    choices: [
      {
        text: "5",
        isCorrect: false,
        explanation: { basis: "x·y = 1×3 + 2×1 = 5", reason: "5는 원래 차원의 내적 x·y다. 이 커널은 그 값을 제곱한다." },
      },
      {
        text: "10",
        isCorrect: false,
        explanation: { basis: "k(x, y) = (x·y)²", reason: "제곱 대신 2를 곱한 값이다." },
      },
      {
        text: "25",
        isCorrect: true,
        explanation: {
          basis: "Φ(x) = (1, 2√2, 4), Φ(y) = (9, 3√2, 1) → 9 + 12 + 4 = 25",
          reason: "3차원으로 보내 내적해도 9 + 12 + 4 = 25, 원래 2차원에서 (x·y)² = 5² = 25로 계산해도 같다. 이것이 커널 함수로 계산량을 줄이는 원리다.",
        },
      },
      {
        text: "125",
        isCorrect: false,
        explanation: { basis: "k(x, y) = (x·y)²", reason: "세제곱한 값이다. 이 매핑에 대응하는 커널은 제곱이다." },
      },
    ],
  },
  {
    q: "가우시안 커널의 파라미터 σ에 대한 설명으로 옳은 것은?",
    answer: 3,
    source: "변형",
    refs: {
      textbook: "10.3.2 커널법과 SVM (표 10-1)",
      slides: "비선형 결정경계를 가진 이진 분류의 예 — σ값에 따른 결정경계의 변화",
    },
    basis: "교재 표 10-1 — 각 커널 함수의 고유 파라미터는 문제의 성격에 맞추어 조정해 주어야 하는 사용자 정의 파라미터",
    examSkill: "하이퍼파라미터의 성격과 σ에 따른 결정경계 변화",
    choices: [
      {
        text: "σ는 학습을 통해 자동으로 결정된다.",
        isCorrect: false,
        explanation: {
          basis: "사용자 정의 파라미터(하이퍼파라미터)",
          reason: "σ는 학습 전에 사용자가 정하는 하이퍼파라미터다. 학습으로 정해지는 것은 α̂ᵢ와 ŵ₀다.",
        },
      },
      {
        text: "σ 값과 무관하게 결정경계의 모양은 같다.",
        isCorrect: false,
        explanation: {
          basis: "σ = 0.2, 0.5, 2.0, 5.0에 따른 결정경계의 변화",
          reason: "강의록 실험에서 σ에 따라 결정경계가 확연히 달라진다.",
        },
      },
      {
        text: "가우시안 커널은 두 벡터의 내적 x·y만으로 계산된다.",
        isCorrect: false,
        explanation: {
          basis: "k(x, y) = exp{−‖x − y‖² / 2σ²}",
          reason: "가우시안 커널은 두 벡터의 거리 ‖x − y‖²로 계산된다. 내적만 쓰는 것은 선형·다항식·시그모이드 커널이다.",
        },
      },
      {
        text: "σ를 매우 작게 하면 결정경계가 개별 데이터 주변을 좁게 감싸는 모양이 된다.",
        isCorrect: true,
        explanation: {
          basis: "강의록 실험 σ = 0.2 — 결정경계가 데이터 몇 개씩을 감싸는 작은 영역들로 나뉨",
          reason: "σ가 작으면 아주 가까운 점끼리만 k 값이 커서 경계가 데이터 하나하나에 붙는다. σ가 커질수록 경계가 완만해진다.",
        },
      },
    ],
  },
];

export default function Lecture8Quiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUIZZES.length).fill(null));

  const officialCount = QUIZZES.filter((q) => q.source === "공식 연습문제").length;
  const correctCount = answers.filter((a, i) => a !== null && a === QUIZZES[i].answer).length;
  const allAnswered = answers.every((a) => a !== null);

  const select = (qi: number, ci: number) => {
    if (answers[qi] !== null) return;
    setAnswers((prev) => prev.map((v, i) => (i === qi ? ci : v)));
  };

  return (
    <section>
      <SectionTitle
        title="복습 퀴즈"
        subtitle={`정리하기 공식 연습문제 ${officialCount}문항과 변형 문제 ${QUIZZES.length - officialCount}문항`}
      />

      <div className="space-y-6">
        {QUIZZES.map((quiz, qi) => {
          const done = answers[qi] !== null;
          const isCorrect = answers[qi] === quiz.answer;
          return (
            <Sourced key={qi} refs={quiz.refs}>
              <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    {qi + 1}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      quiz.source === "공식 연습문제"
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {quiz.source}
                  </span>
                  <span className="text-[11px] text-gray-400">{quiz.examSkill}</span>
                </div>

                <h4 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">{quiz.q}</h4>

                <div className="space-y-2">
                  {quiz.choices.map((choice, ci) => {
                    let style =
                      "border-gray-200 bg-gray-50 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-indigo-900/10";
                    if (done) {
                      if (choice.isCorrect) {
                        style = "border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/20";
                      } else if (ci === answers[qi]) {
                        style = "border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/20";
                      } else {
                        style = "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800";
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
                            <span className="text-gray-700 dark:text-gray-300">{choice.text}</span>
                            {done && choice.isCorrect && (
                              <CheckCircle size={16} className="ml-auto shrink-0 text-green-500" />
                            )}
                            {done && ci === answers[qi] && !choice.isCorrect && (
                              <XCircle size={16} className="ml-auto shrink-0 text-red-500" />
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
                      isCorrect ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                      }`}
                    >
                      {isCorrect ? "정답" : "오답"} — 정답은 {String.fromCharCode(9312 + quiz.answer)}번
                    </p>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{quiz.basis}</p>
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
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-800 dark:bg-indigo-900/20"
        >
          <div>
            <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
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
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <RotateCcw size={14} />
            다시 풀기
          </button>
        </motion.div>
      )}
    </section>
  );
}
