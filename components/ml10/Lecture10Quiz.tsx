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
  intro?: string;
  choices: QuizChoice[];
  answer: number;
  basis: string;
  examSkill: string;
  source: "공식 연습문제" | "변형";
  refs: SourceRef;
};

const QUIZZES: Quiz[] = [
  {
    q: "MLP 학습에 대한 설명 중 적절하지 못한 것은?",
    answer: 3,
    source: "공식 연습문제",
    refs: { textbook: "11.3.1 다층 퍼셉트론의 학습", slides: "MLP의 학습 · 기울기 강하 학습법" },
    basis: "기울기 강하 학습법은 오차값이 줄어드는 방향, 곧 기울기가 감소하는 방향으로 가중치를 조정한다. 그래서 수정식에 −η가 붙는다.",
    examSkill: "수정 방향의 부호",
    choices: [
      {
        text: "오차함수로 주로 평균제곱오차를 사용한다.",
        isCorrect: false,
        explanation: {
          basis: "E(X, θ) = (1/2N) Σ ‖tᵢ − f(xᵢ, θ)‖² (식 11-7)",
          reason: "학습 데이터 전체 집합에 대한 오차는 평균 제곱 오차로 정의한다. 맞는 설명이다.",
        },
      },
      {
        text: "오차함수는 매우 복잡한 비선형 함수로 표현된다.",
        isCorrect: false,
        explanation: {
          basis: "f(x, θ)가 복잡한 비선형함수이므로 결과적으로 E(θ)도 매우 복잡한 형태의 비선형함수가 됨",
          reason: "그래서 선형회귀의 최소제곱법처럼 간단한 수식 계산으로 바로 최적해를 찾을 수 없다. 맞는 설명이다.",
        },
      },
      {
        text: "최소 오차를 찾기 위해 기울기 강하 학습법을 적용한다.",
        isCorrect: false,
        explanation: {
          basis: "비선형적인 함수의 최소값을 찾아가는 반복적 알고리즘 — 기울기 강하 학습법",
          reason: "이를 다층 퍼셉트론에 적용해 구현 가능하게 만든 것이 오류 역전파 학습 알고리즘이다. 맞는 설명이다.",
        },
      },
      {
        text: "오차함수의 기울기가 증가하는 방향으로 가중치를 조정한다.",
        isCorrect: true,
        explanation: {
          basis: "θ⁽τ⁺¹⁾ = θ⁽τ⁾ − η ∂E(θ⁽τ⁾)/∂θ (식 11-8)",
          reason:
            "오차를 줄이려면 기울기가 감소하는 방향, 곧 내리막 방향으로 조정해야 한다. 수정식의 −η가 바로 '기울기의 반대 방향'을 뜻한다.",
        },
      },
    ],
  },
  {
    q: "MLP 모델 설정 후 학습 알고리즘을 적용할 때 초기화 대상으로 거리가 먼 것은?",
    answer: 2,
    source: "공식 연습문제",
    refs: {
      textbook: "11.3.1 학습 알고리즘 ① · 11.3.2 은닉 뉴런의 수",
      slides: "MLP 학습: 오류역전파 학습 알고리즘 ① · MLP 학습의 고려사항 ④",
      lecture: "은닉 뉴런의 수는 학습을 시작하기 전 모델 구조를 설정하는 단계에서 이미 정해진 값이라고 갈라 설명",
    },
    basis: "가중치 파라미터·학습률·오차함수의 목표값은 학습 시작 시 설정 또는 초기화하지만, 은닉 뉴런의 수는 학습 전 모델 구조를 설정할 때 결정한다.",
    examSkill: "모델 구조 설정과 학습 알고리즘 초기화의 구분",
    choices: [
      {
        text: "가중치 파라미터",
        isCorrect: false,
        explanation: {
          basis: "① 임의의 작은 값으로 가중치 파라미터를 초기화",
          reason: "학습 알고리즘의 첫 단계가 가중치 초기화다. 초기화 대상이 맞다.",
        },
      },
      {
        text: "오차함수의 목표값",
        isCorrect: false,
        explanation: {
          basis: "① 학습률 η와 원하는 오차함수의 목표값을 설정",
          reason: "종료조건으로 쓸 희망 오차를 학습 시작 전에 설정한다. 초기화 단계에 포함된다.",
        },
      },
      {
        text: "은닉 뉴런의 수",
        isCorrect: true,
        explanation: {
          basis: "은닉층의 수와 은닉 뉴런의 수는 학습하기에 앞서 구조를 결정하는 단계에서 정함",
          reason:
            "은닉 뉴런의 수는 학습 알고리즘이 초기화하는 값이 아니라 모델 구조를 설정할 때 미리 결정되는 값이다. 학습 중에 바뀌지도 않는다.",
        },
      },
      {
        text: "학습률",
        isCorrect: false,
        explanation: {
          basis: "① 학습률 η 설정 — 1보다 작은 값에서 시작하여 진행 상황에 따라 조정",
          reason: "학습률은 학습 시작 시 설정하고 진행에 따라 조정하는 값이다. 초기화 대상이 맞다.",
        },
      },
    ],
  },
  {
    q: "위 지문의 설명에 해당하는 MLP 학습 모드는?",
    intro:
      "전체 데이터를 m개의 부분집합으로 나누어 m번의 가중치 수정 과정을 거친다. 데이터 규모가 큰 경우에 적합하고, 부분집합 크기는 사용자가 결정한다.",
    answer: 3,
    source: "공식 연습문제",
    refs: { textbook: "11.3.3 학습 전략 — 학습 모드의 설정", slides: "MLP의 학습 전략 — 학습 모드의 결정" },
    basis: "미니 배치 모드는 데이터를 작은 부분집합으로 나누어 한 번에 하나의 부분집합에 대해 가중치를 수정한다. N개를 m개의 그룹으로 나누면 m번 수정한다.",
    examSkill: "가중치 수정 횟수로 학습 모드 가려내기",
    choices: [
      {
        text: "온라인 모드",
        isCorrect: false,
        explanation: {
          basis: "각 데이터에 대해서 가중치 수정 — N개의 데이터 → N번의 수정",
          reason: "온라인 모드는 데이터 하나마다 수정하므로 수정 횟수가 N번이다. 지문의 m번과 다르다.",
        },
      },
      {
        text: "미니 온라인 모드",
        isCorrect: false,
        explanation: {
          basis: "학습 모드는 온라인 모드, 배치 모드, 미니 배치 모드로 구분",
          reason: "‘미니 온라인 모드’라는 용어는 교재·강의록에 없다. 만들어 낸 이름이다.",
        },
      },
      {
        text: "배치 모드",
        isCorrect: false,
        explanation: {
          basis: "N개의 모든 데이터에 대한 오차를 모두 더한 후 한 번의 가중치 수정",
          reason: "배치 모드는 한 에포크에 수정이 단 1번이다. 지문은 m번이라 했으므로 다르다.",
        },
      },
      {
        text: "미니 배치 모드",
        isCorrect: true,
        explanation: {
          basis: "데이터를 작은 부분집합으로 나누고 각 부분집합은 배치 모드로 처리 — N개를 m개 그룹으로 → m번 수정",
          reason:
            "부분집합 단위로 갱신하므로 수정 횟수가 그룹 수 m과 같고, 데이터 규모가 큰 경우에 적합하다는 설명도 일치한다.",
        },
      },
    ],
  },
  {
    q: "다층 퍼셉트론 학습과 관련해 적절하지 못한 것은?",
    answer: 0,
    source: "공식 연습문제",
    refs: {
      textbook: "11.3.3 학습 전략 — 모델 설정",
      slides: "MLP의 학습 전략 — 초기 조건 설정 · 활성화 함수",
    },
    basis: "초기 가중치는 동일한 값이 아니라 작은 범위의 서로 다른 랜덤값으로 설정해야 한다. 은닉층은 비선형 함수, 출력층은 문제에 맞는 함수를 사용한다.",
    examSkill: "‘작은 범위의 랜덤값’에서 ‘랜덤’을 빠뜨리지 않기",
    choices: [
      {
        text: "가중치를 작은 범위의 동일한 실수값으로 초기화한다.",
        isCorrect: true,
        explanation: {
          basis: "초기 가중치 → 작은 범위의 실수값으로 랜덤하게 설정",
          reason:
            "‘작은 범위’는 맞지만 ‘동일한 값’이 틀렸다. 모든 가중치가 같으면 은닉 노드들의 출력 zⱼ가 모두 같아지고 역전파되는 δⱼ도 같아져, 은닉 노드를 여러 개 두어도 하나짜리처럼만 동작한다.",
        },
      },
      {
        text: "학습률은 보통 1보다 작은 값에서 시작해 조정한다.",
        isCorrect: false,
        explanation: {
          basis: "학습률 → 1보다 작은 값에서 시작하여 진행 상황에 따라 조정",
          reason: "맞는 설명이다. η가 크면 빠르지만 불안정하고, 작으면 안정적이지만 느리다.",
        },
      },
      {
        text: "은닉 노드가 많으면 표현력이 좋아지지만 과다적합 가능성도 높다.",
        isCorrect: false,
        explanation: {
          basis: "은닉 노드의 수 — 많을수록 표현 가능한 함수가 다양해지나, 계산 비용과 일반화 성능을 고려해야 함",
          reason: "맞는 설명이다. 많으면 과다적합 발생 가능성이 높아진다는 점이 함께 언급된다.",
        },
      },
      {
        text: "출력층 활성화 함수로 선형 함수를 사용하기도 한다.",
        isCorrect: false,
        explanation: {
          basis: "목표 출력값이 임의의 실수값(회귀 문제) → 선형 함수",
          reason: "맞는 설명이다. 비선형함수를 반드시 써야 하는 쪽은 출력 노드가 아니라 은닉 노드다.",
        },
      },
    ],
  },
  {
    q: "다층 퍼셉트론 학습 전략에 대한 설명으로 가장 적절한 것은?",
    answer: 2,
    source: "공식 연습문제",
    refs: {
      textbook: "11.3.3 학습 전략 — 모델 설정과 오차함수",
      slides: "MLP의 학습 전략 — 활성화 함수 · 오차함수",
      lecture: "분류 문제에서 교차엔트로피와 소프트맥스는 하나의 쌍처럼 함께 쓰인다고 반복해 강조",
    },
    basis: "다중 클래스 분류에서는 출력층의 활성화 함수로 소프트맥스를 주로 사용하며 교차엔트로피 오차함수와 함께 쓴다.",
    examSkill: "회귀와 분류에 각각 어떤 활성화 함수·오차함수가 붙는지",
    choices: [
      {
        text: "분류 문제에서 출력층은 선형 함수가 바람직하다.",
        isCorrect: false,
        explanation: {
          basis: "목표 출력값이 클래스 레이블(분류 문제) → 시그모이드 함수, 소프트맥스 함수",
          reason: "선형 함수는 목표 출력값이 임의의 실수값인 회귀 문제에 쓴다. 분류와 회귀가 뒤바뀐 설명이다.",
        },
      },
      {
        text: "제곱 오차는 클래스 레이블 문제에 가장 적합하다.",
        isCorrect: false,
        explanation: {
          basis: "제곱 오차함수 → 목표 출력값이 연속적인 실수값을 갖는 회귀 문제에 적합",
          reason: "클래스 레이블, 곧 0 또는 1을 갖는 분류 문제에 적합한 것은 교차엔트로피 오차함수다.",
        },
      },
      {
        text: "분류 문제에서는 소프트맥스가 출력 노드 활성화 함수로 주로 사용된다.",
        isCorrect: true,
        explanation: {
          basis: "소프트맥스 활성화 함수는 목표 출력값이 클래스 레이블인 분류 문제의 출력 노드 활성화 함수로 주로 사용됨",
          reason:
            "출력값을 모두 더하면 1이 되므로 클래스별 확률처럼 읽을 수 있고, 교차엔트로피 오차함수와 쌍으로 쓰인다.",
        },
      },
      {
        text: "교차엔트로피는 회귀 문제에 더 적합하다.",
        isCorrect: false,
        explanation: {
          basis: "교차엔트로피 오차함수 → 목표 출력값이 0 또는 1의 값을 갖는 분류 문제에 적합",
          reason: "회귀 문제에 적합한 것은 제곱 오차함수다. 두 오차함수의 쓰임이 뒤바뀐 설명이다.",
        },
      },
    ],
  },

  /* ─────────── 변형 ─────────── */

  {
    q: "출력 뉴런의 오차 δₖ를 바르게 나타낸 것은?",
    answer: 1,
    source: "변형",
    refs: { textbook: "11.3.1 식 11-10", slides: "오류역전파 학습 — vⱼₖ의 수정식" },
    basis: "δₖ = −φᵒ′(uₖᵒ)(tₖ − yₖ). 활성화 함수의 미분값에 (목표 출력값 − 실제 출력값)을 곱하고 부호를 뒤집은 값이다.",
    examSkill: "δₖ의 구성 요소와 부호",
    choices: [
      {
        text: "δₖ = φᵒ′(uₖᵒ)(tₖ − yₖ)",
        isCorrect: false,
        explanation: {
          basis: "δₖ = −φᵒ′(uₖᵒ)(tₖ − yₖ)",
          reason: "앞의 음부호가 빠졌다. δₖ는 ∂E/∂uₖᵒ이고, E = ½(tₖ − yₖ)²을 미분하면 −(tₖ − yₖ)φᵒ′가 나온다.",
        },
      },
      {
        text: "δₖ = −φᵒ′(uₖᵒ)(tₖ − yₖ)",
        isCorrect: true,
        explanation: {
          basis: "식 11-10 — ∂E/∂vⱼₖ = δₖzⱼ, δₖ = −φᵒ′(uₖᵒ)(tₖ − yₖ)",
          reason:
            "출력 뉴런의 활성화 함수 미분값에 목표 출력값과 실제 출력값의 차이를 곱한 값이다. 시그모이드면 φᵒ′ = (1 − yₖ)yₖ로 간단히 계산된다.",
        },
      },
      {
        text: "δₖ = −φʰ′(uⱼʰ)(tₖ − yₖ)",
        isCorrect: false,
        explanation: {
          basis: "δₖ에는 출력 뉴런의 활성화 함수 φᵒ의 미분값이 들어간다",
          reason: "φʰ′(uⱼʰ)는 은닉 뉴런의 활성화 함수 미분값으로, δⱼ를 계산할 때 쓰인다. 층이 뒤바뀐 식이다.",
        },
      },
      {
        text: "δₖ = −η(tₖ − yₖ)zⱼ",
        isCorrect: false,
        explanation: {
          basis: "Δvⱼₖ = −η δₖ zⱼ",
          reason: "η와 zⱼ가 곱해지는 것은 δₖ가 아니라 가중치 수정항 Δvⱼₖ다. δₖ 자체에는 학습률이 들어가지 않는다.",
        },
      },
    ],
  },
  {
    q: "은닉 뉴런의 오차 δⱼ를 계산할 때 M개의 출력 뉴런에 대해 더해지는 항은?",
    answer: 2,
    source: "변형",
    refs: {
      textbook: "11.3.1 식 11-15",
      slides: "오류역전파 학습 — wᵢⱼ의 수정식",
    },
    basis: "δⱼ = φʰ′(uⱼʰ) Σₖ δₖvⱼₖ. 각 출력 뉴런이 오차에 미치는 영향 δₖ에 그 연결의 가중치 vⱼₖ를 곱해 모두 더한다.",
    examSkill: "역전파되는 양의 정체",
    choices: [
      {
        text: "δₖ xᵢ",
        isCorrect: false,
        explanation: {
          basis: "Δwᵢⱼ = −η δⱼ xᵢ",
          reason: "xᵢ는 입력층의 값으로, 가중치 수정항을 만들 때 δⱼ에 곱해진다. 역전파되는 합 안에는 들어가지 않는다.",
        },
      },
      {
        text: "δₖ zⱼ",
        isCorrect: false,
        explanation: {
          basis: "∂E/∂vⱼₖ = δₖzⱼ",
          reason: "δₖzⱼ는 은닉층에서 출력층으로의 가중치에 대한 편미분값이다. δⱼ를 만드는 합과는 다르다.",
        },
      },
      {
        text: "δₖ vⱼₖ",
        isCorrect: true,
        explanation: {
          basis: "δⱼ = ∂E/∂uⱼʰ = Σₖ (∂E/∂uₖᵒ)(∂uₖᵒ/∂uⱼʰ) = φʰ′(uⱼʰ) Σₖ δₖvⱼₖ",
          reason:
            "uⱼʰ는 모든 출력 뉴런의 가중합을 계산하는 데 쓰이므로, 각 출력 뉴런의 오차 δₖ에 그 경로의 가중치 vⱼₖ를 곱한 값을 전부 더해야 한다. 이것이 ‘거꾸로 전파된다’는 말의 내용이다.",
        },
      },
      {
        text: "η δₖ",
        isCorrect: false,
        explanation: {
          basis: "학습률 η는 가중치를 실제로 고칠 때 한 번만 곱해진다",
          reason: "역전파되는 오차의 계산에는 학습률이 들어가지 않는다. η는 Δv, Δw를 만들 때 붙는다.",
        },
      },
    ],
  },
  {
    q: "오류 역전파 학습 알고리즘에서 ‘거꾸로 전파’되는 것은 무엇인가?",
    answer: 1,
    source: "변형",
    refs: {
      textbook: "11.3.1 — 오류 역전파 계산의 개념도",
      slides: "오류역전파 학습 — 출력 뉴런의 오차가 은닉 뉴런에 거꾸로 전파되는 형태",
      lecture: "수식을 못 따라가더라도 ‘출력의 오차가 뒤로 전파된다’는 개념만은 반드시 가져가라고 당부",
    },
    basis: "출력 뉴런의 오차 δₖ가 은닉 뉴런의 δⱼ로 거꾸로 전파된다. 출력층에서 계산된 오차를 은닉층에서 재사용해 중복 계산을 피하는 것이 이 알고리즘의 특징이다.",
    examSkill: "전방향으로 흐르는 것과 역방향으로 흐르는 것의 구분",
    choices: [
      {
        text: "입력 데이터 x",
        isCorrect: false,
        explanation: {
          basis: "[전방향 계산] 입력 x → zⱼ → yₖ",
          reason: "입력은 전방향 계산에서 출력 쪽으로 흐른다. 역방향으로 전파되는 대상이 아니다.",
        },
      },
      {
        text: "출력 뉴런의 오차 δₖ",
        isCorrect: true,
        explanation: {
          basis: "출력 뉴런의 오차가 은닉 뉴런에 거꾸로 전파되어 오는 형태",
          reason:
            "δₖ에 가중치 vⱼₖ를 곱해 모두 더한 값으로 δⱼ가 만들어진다. 출력층에서 계산된 오차를 은닉층에서 재사용하므로 중복 계산을 피할 수 있다.",
        },
      },
      {
        text: "학습률 η",
        isCorrect: false,
        explanation: {
          basis: "η는 수정폭을 정하는 상수",
          reason: "학습률은 전파되는 값이 아니라 가중치를 고칠 때 곱하는 상수다.",
        },
      },
      {
        text: "은닉 뉴런의 출력값 zⱼ",
        isCorrect: false,
        explanation: {
          basis: "zⱼ = φʰ(uⱼʰ) — 전방향 계산의 결과",
          reason: "zⱼ는 전방향으로 출력층에 전달되는 값이다. 역방향 계산에서는 ∂E/∂vⱼₖ = δₖzⱼ처럼 재사용될 뿐이다.",
        },
      },
    ],
  },
  {
    q: "오차함수의 기울기가 완만한 지점에서 학습 속도가 급격히 느려지는 문제와, 이를 해결하기 위해 직전 수정항을 관성처럼 더해 주는 방법을 바르게 짝지은 것은?",
    answer: 0,
    source: "변형",
    refs: {
      textbook: "11.3.2 학습의 고려사항 — 수렴 속도의 문제",
      slides: "MLP 학습의 고려사항 — 수렴 속도의 문제",
    },
    basis: "기울기가 완만한 구간에서 학습이 느려지는 것이 플라토 문제이고, 직전 단계의 수정항을 추가로 더해 관성의 역할을 하도록 하는 것이 모멘텀 방법이다.",
    examSkill: "지역 극소의 문제와 수렴 속도의 문제를 섞지 않기",
    choices: [
      {
        text: "플라토 문제 — 모멘텀 방법",
        isCorrect: true,
        explanation: {
          basis: "플라토 문제(plateau problem) / 모멘텀(momentum) 방법",
          reason:
            "기울기가 완만한 지역에서의 학습이 전체 학습 시간의 대부분을 차지하는 현상이 플라토 문제이고, 직전 수정항을 더해 관성을 주는 가속화 방법이 모멘텀 방법이다.",
        },
      },
      {
        text: "지역 극소의 문제 — 시뮬레이티드 어닐링",
        isCorrect: false,
        explanation: {
          basis: "지역 극소의 문제 → 학습률의 적응적 조정, 시뮬레이티드 어닐링 등",
          reason:
            "짝 자체는 교재에 있는 올바른 조합이지만, 문제가 묻는 ‘기울기가 완만해 느려지는 현상’은 지역 극소가 아니라 수렴 속도의 문제다.",
        },
      },
      {
        text: "과다적합의 문제 — 조기 종료",
        isCorrect: false,
        explanation: {
          basis: "학습 종료점의 문제 → 검증 데이터 집합을 사용하는 방법",
          reason: "과다적합과 종료 시점에 관한 짝이다. 학습 속도가 느려지는 현상과는 다른 고려사항이다.",
        },
      },
      {
        text: "셀 포화의 문제 — 정규화",
        isCorrect: false,
        explanation: {
          basis: "신경세포의 입력값이 크면 셀 포화의 가능성이 높아짐 → 0~1 범위로 정규화",
          reason: "입력값 전처리에 관한 짝으로, MNIST 데이터 셋팅에서 다룬 내용이다. 플라토와는 다른 문제다.",
        },
      },
    ],
  },
  {
    q: "검증 데이터 집합을 따로 두고 학습 곡선을 관찰할 때, 학습을 마치기에 가장 바람직한 시점은?",
    answer: 2,
    source: "변형",
    refs: {
      textbook: "11.3.2 학습의 고려사항 — 학습 종료점의 문제(그림 11-16)",
      slides: "MLP 학습의 고려사항 — 학습 종료점의 문제",
    },
    basis: "학습 오차는 계속 줄어드는 반면 검증 오차는 어느 시점에서 다시 증가한다. 그 시점이 과다적합이 발생하는 지점이므로 거기서 학습을 완료하는 것이 가장 바람직하다.",
    examSkill: "학습 오차와 검증 오차 중 어느 쪽을 보고 멈추는가",
    choices: [
      {
        text: "학습 오차가 0이 되는 시점",
        isCorrect: false,
        explanation: {
          basis: "학습 오차가 작다고 해서 항상 좋은 결과를 주는 것은 아님",
          reason: "학습 데이터만 완벽히 맞히는 것은 과다적합의 신호에 가깝다. 멈추는 기준이 되지 못한다.",
        },
      },
      {
        text: "검증 오차가 학습 오차보다 커지는 시점",
        isCorrect: false,
        explanation: {
          basis: "기준은 검증 오차가 ‘다시 증가하기 시작하는’ 시점",
          reason:
            "검증 오차는 학습 오차보다 큰 것이 보통이며, 두 값의 대소 자체는 종료 기준이 아니다. 중요한 것은 검증 오차가 줄다가 돌아서는 지점이다.",
        },
      },
      {
        text: "검증 오차가 최소가 된 뒤 다시 증가하기 시작하는 시점",
        isCorrect: true,
        explanation: {
          basis: "검증 데이터에 대한 오차가 다시 증가하는 시점이 과다적합이 발생하는 지점",
          reason: "그 지점 이후가 과다적합 구간이므로, 검증 오차가 최소가 되는 지점에서 학습을 완료하는 것이 가장 바람직하다.",
        },
      },
      {
        text: "미리 정해 둔 학습 횟수를 모두 채운 시점",
        isCorrect: false,
        explanation: {
          basis: "종료조건 — 희망 오차, 수렴 속도, 학습 횟수",
          reason:
            "학습 횟수도 종료조건의 하나이지만, 과다적합을 피하기 위한 적절한 시점을 찾는 방법으로 교재가 제시하는 것은 검증 데이터 집합을 사용하는 방법이다.",
        },
      },
    ],
  },
  {
    q: "MNIST 숫자 인식에서 28 × 28 영상을 사용할 때의 설명으로 적절하지 못한 것은?",
    answer: 3,
    source: "변형",
    refs: {
      textbook: "11.3.2 — 은닉 뉴런의 수",
      slides: "데이터 준비 · 데이터 셋팅 · MLP 구조",
    },
    basis: "입력층은 28 × 28 = 784개, 출력층은 클래스 수와 같은 10개다. 은닉 노드 수는 20·50·100 등으로 바꿔 가며 성능을 평가한다.",
    examSkill: "데이터가 정해 주는 수와 설계자가 정하는 수의 구분",
    choices: [
      {
        text: "입력층의 노드 수는 784개가 된다.",
        isCorrect: false,
        explanation: {
          basis: "입력층 784개 (= 28 × 28)",
          reason: "영상을 1차원으로 펴면 픽셀 하나마다 입력 노드 하나가 필요하므로 784개다. 맞는 설명이다.",
        },
      },
      {
        text: "출력층의 노드 수는 클래스 수와 같은 10개로 둔다.",
        isCorrect: false,
        explanation: {
          basis: "출력 뉴런의 수 = 클래스 레이블의 수 — 0~9이므로 10개",
          reason: "i번째 클래스의 목표 출력값은 i번째 출력 뉴런만 1인 원-핫 벡터가 된다. 맞는 설명이다.",
        },
      },
      {
        text: "0~255의 픽셀값을 0~1 범위로 조정한다.",
        isCorrect: false,
        explanation: {
          basis: "x̃ = (x − 0)/(255 − 0)",
          reason: "신경세포의 입력값이 크면 셀 포화의 가능성이 높아져 학습이 어려워지므로 정규화한다. 맞는 설명이다.",
        },
      },
      {
        text: "은닉 노드의 수도 영상 크기에 의해 784개로 정해진다.",
        isCorrect: true,
        explanation: {
          basis: "은닉층의 노드 수는 20, 50, 100 등으로 변화시키며 성능을 평가",
          reason:
            "입력 노드와 출력 노드의 수만 주어진 데이터와 문제에 의해 정해진다. 은닉 노드의 수는 문제에 맞게 설계자가 정하는 값이며, 영상 크기가 정해 주지 않는다.",
        },
      },
    ],
  },
  {
    q: "소프트맥스 함수에 대한 설명으로 적절하지 못한 것은?",
    answer: 3,
    source: "변형",
    refs: {
      textbook: "11.3.3 — 소프트맥스 함수(식 11-18)",
      slides: "MLP의 학습 전략 — 오차함수 · 소프트맥스 함수",
    },
    basis: "소프트맥스는 출력값을 모두 더하면 1이 되며, 최대값을 더욱 활성화하고 나머지는 0에 가깝게 억제한다. 맥스 함수의 부드러운 버전이라는 뜻의 이름이다.",
    examSkill: "소프트맥스의 성질과 이름의 유래",
    choices: [
      {
        text: "출력값을 모두 더하면 1이 된다.",
        isCorrect: false,
        explanation: {
          basis: "uₖᵒ에 대한 지수값들을 모두 더한 값에 대한 비율로 나타내기 때문에 출력값을 모두 더하면 1이 됨",
          reason: "분모가 모든 지수값의 합이므로 비율의 총합은 반드시 1이다. 맞는 설명이다.",
        },
      },
      {
        text: "최대값을 더욱 활성화하고 최대값이 아닌 값은 0에 가깝게 억제한다.",
        isCorrect: false,
        explanation: {
          basis: "소프트맥스 함수는 최대값을 더욱 활성화하고 최대값이 아닌 값은 억제하여 0에 가깝게 만드는 효과를 가짐",
          reason: "지수를 취하기 때문에 큰 값과 작은 값의 차이가 더 벌어진다. 맞는 설명이다.",
        },
      },
      {
        text: "교차엔트로피 오차함수와 함께 분류 문제에 주로 사용된다.",
        isCorrect: false,
        explanation: {
          basis: "목표 출력값이 0 또는 1을 갖는 분류 문제, 그리고 출력 노드의 활성화 함수로 소프트맥스를 사용할 때 적합",
          reason: "분류 문제에서 두 가지가 한 쌍처럼 함께 쓰인다. 맞는 설명이다.",
        },
      },
      {
        text: "은닉 노드의 활성화 함수로 주로 사용된다.",
        isCorrect: true,
        explanation: {
          basis: "은닉 노드 → 시그모이드 함수, 하이퍼탄젠트 함수, ReLU 함수 / 소프트맥스는 출력 노드의 활성화 함수",
          reason:
            "소프트맥스는 같은 층의 모든 노드 값을 함께 써서 비율을 내는 함수로, 목표 출력값이 클래스 레이블인 분류 문제의 출력 노드에 쓴다. 은닉 노드에는 쓰지 않는다.",
        },
      },
    ],
  },
  {
    q: "한 에포크(epoch)에 대한 설명으로 가장 적절한 것은?",
    answer: 1,
    source: "변형",
    refs: {
      textbook: "11.3.1 학습 알고리즘 ③",
      slides: "MLP 학습: 오류역전파 학습 알고리즘 ③ · 학습 곡선",
    },
    basis: "전체 학습 데이터에 대하여 가중치 수정 과정이 한 번 완료된 것이 한 에포크다. 한 에포크가 끝날 때마다 학습 오차를 계산해 그 변화를 보는 그래프가 학습 곡선이다.",
    examSkill: "에포크와 가중치 수정 횟수의 관계",
    choices: [
      {
        text: "가중치를 한 번 수정하는 것",
        isCorrect: false,
        explanation: {
          basis: "온라인 모드 — N개의 데이터 → N번의 가중치 수정",
          reason:
            "온라인 모드에서는 한 에포크 동안 가중치를 N번 수정한다. 가중치 수정 한 번과 한 에포크는 같지 않다. 배치 모드일 때만 우연히 1번이 된다.",
        },
      },
      {
        text: "전체 학습 데이터에 대해 학습이 한 번 진행된 것",
        isCorrect: true,
        explanation: {
          basis: "③ 전체 학습 데이터에 대하여 ② 과정이 완료된 후, 학습 데이터 전체 집합 X에 대한 평균 제곱 오차를 계산",
          reason:
            "학습 데이터 전체를 한 번 돌고 나면 한 에포크가 끝난다. 그때마다 학습 오차를 계산해 종료조건을 확인한다.",
        },
      },
      {
        text: "학습 데이터와 테스트 데이터를 한 번씩 사용하는 것",
        isCorrect: false,
        explanation: {
          basis: "테스트 데이터 집합은 학습이 끝난 뒤 일반화 성능을 평가할 때 사용",
          reason: "테스트 데이터는 학습 과정에 참여하지 않는다. 에포크의 정의와 무관하다.",
        },
      },
      {
        text: "은닉층을 한 번 거쳐 출력을 만드는 것",
        isCorrect: false,
        explanation: {
          basis: "전방향 계산 — 데이터 하나에 대한 zⱼ, yₖ 계산",
          reason: "그것은 데이터 하나에 대한 전방향 계산이다. 에포크는 데이터 전체를 한 바퀴 도는 단위다.",
        },
      },
    ],
  },
];

export default function Lecture10Quiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUIZZES.length).fill(null));

  const officialCount = QUIZZES.filter((q) => q.source === "공식 연습문제").length;
  const correctCount = answers.filter((a, i) => a !== null && a === QUIZZES[i].answer).length;
  const allAnswered = answers.every((a) => a !== null);

  const select = (qi: number, ci: number) => {
    if (answers[qi] !== null) return;
    setAnswers((prev) => prev.map((v, i) => (i === qi ? ci : v)));
  };

  return (
    <section id="quiz" className="scroll-mt-32">
      <SectionTitle
        title="복습 퀴즈"
        subtitle={`정리하기 공식 연습문제 ${officialCount}문항과 변형 문제 ${QUIZZES.length - officialCount}문항`}
      />

      <div className="space-y-6">
        {QUIZZES.map((quiz, qi) => {
          const done = answers[qi] !== null;
          const isCorrect = answers[qi] === quiz.answer;
          return (
            <Sourced key={quiz.q} refs={quiz.refs}>
              <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
                    {qi + 1}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      quiz.source === "공식 연습문제"
                        ? "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {quiz.source}
                  </span>
                  <span className="text-[11px] text-gray-400">{quiz.examSkill}</span>
                </div>

                {quiz.intro && (
                  <p className="mb-2 rounded-lg bg-gray-50 p-3 text-[12.5px] leading-6 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    {quiz.intro}
                  </p>
                )}
                <h4 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">{quiz.q}</h4>

                <div className="space-y-2">
                  {quiz.choices.map((choice, ci) => {
                    let style =
                      "border-gray-200 bg-gray-50 hover:bg-sky-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-sky-900/10";
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
                      <div key={choice.text}>
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
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-200 bg-sky-50 p-6 dark:border-sky-800 dark:bg-sky-900/20"
        >
          <div>
            <p className="text-lg font-bold text-sky-700 dark:text-sky-300">
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
            className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700"
          >
            <RotateCcw size={14} />
            다시 풀기
          </button>
        </motion.div>
      )}
    </section>
  );
}
