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
  /** 리프 노드 그림이 필요한 문항 */
  leafFigure?: { name: string; labels: ("ON" | "OFF")[] }[];
};

const QUIZZES: Quiz[] = [
  {
    q: "결정 트리의 문제점으로 가장 적절한 것은?",
    answer: 0,
    source: "공식 연습문제",
    basis: "강의록 7강 결정 트리의 문제 — 과다적합 / 교재 9.1.3, 9.2.1",
    examSkill: "결정 트리의 장점(설명력·빠른 학습·회귀 확장)과 단점(과다적합)을 가르는 판단",
    refs: {
      textbook: "9.1.3 결정 트리를 이용한 2차원 데이터 분류 · 9.2.1 랜덤 포레스트 알고리즘",
      slides: "결정 트리의 문제 — 과다적합",
    },
    choices: [
      {
        text: "과다적합이 발생할 수 있다.",
        isCorrect: true,
        explanation: {
          basis: "과다적합 — 모든 학습 데이터에 대해 노이즈까지 완벽히 학습",
          reason:
            "복잡한 함수를 표현하려면 트리의 깊이가 깊어져야 하고, 그 과정에서 데이터의 노이즈에 민감해져 일반화 성능이 떨어진다. 이 문제를 풀기 위해 조기 종료·가지치기, 나아가 랜덤 포레스트가 등장했다.",
        },
      },
      {
        text: "회귀에는 적용하기 어렵다.",
        isCorrect: false,
        explanation: {
          basis: "결정 트리 — 분류 문제를 위해 개발 → 회귀 문제로 확장(CART)",
          reason:
            "결정 트리는 회귀 문제로 확장되어 CART(Classification And Regression Trees)라 불린다. 리프 노드의 출력값을 해당 노드 데이터의 목표 출력값 평균으로 두면 그대로 회귀에 쓸 수 있다.",
        },
      },
      {
        text: "결과 생성 과정을 이해하기 어렵다.",
        isCorrect: false,
        explanation: {
          basis: "결정 트리 — 뛰어난 설명 능력 제공",
          reason:
            "트리 구조에 각 입력 요소의 역할이 잘 표현되어 학습 결과를 설명할 수 있다는 것이 결정 트리의 대표적인 장점이다. 결과를 이해하기 어려운 것은 블랙박스 형태의 분류기다.",
        },
      },
      {
        text: "학습이 느리다.",
        isCorrect: false,
        explanation: {
          basis: "랜덤 포레스트의 장점 — (결정 트리) 높은 설명 능력, 빠른 학습",
          reason: "빠른 학습은 결정 트리의 장점으로 제시된다. 랜덤 포레스트가 이 장점을 이어받는다.",
        },
      },
    ],
  },
  {
    q: "그림의 네 리프 A~D 중 지니 불순도가 가장 낮은 것은? 그림에서는 A·C·D가 혼합 레이블이고, B 리프의 레이블이 모두 OFF로 동일하다.",
    answer: 1,
    source: "공식 연습문제",
    basis: "강의록 7강 결정 트리의 학습 — 지니 불순도 / 교재 식 9-1",
    examSkill: "레이블이 한 가지뿐인 노드의 지니 불순도가 0임을 식 없이 판단",
    refs: {
      textbook: "9.1.2 지니 불순도 (식 9-1)",
      slides: "결정 트리의 학습 — 지니 불순도",
    },
    leafFigure: [
      { name: "A", labels: ["OFF", "OFF", "ON", "ON", "ON"] },
      { name: "B", labels: ["OFF", "OFF", "OFF", "OFF"] },
      { name: "C", labels: ["OFF", "OFF", "OFF", "ON", "ON"] },
      { name: "D", labels: ["ON", "OFF"] },
    ],
    choices: [
      {
        text: "A",
        isCorrect: false,
        explanation: {
          basis: "하나의 그룹 안에 서로 다른 클래스 레이블이 혼재할수록 불순도는 높아짐",
          reason: "ON과 OFF가 섞여 있으므로 지니 불순도가 0보다 크다. 그림의 구성이라면 1 − (3/5)² − (2/5)² = 0.48.",
        },
      },
      {
        text: "B",
        isCorrect: true,
        explanation: {
          basis: "I(N) = 1 − Σ(pᵢ)², 한 클래스의 비율이 1이면 I = 1 − 1² = 0",
          reason:
            "모든 레이블이 OFF로 동일하므로 OFF의 비율이 1, ON의 비율이 0이다. 지니 불순도는 1 − 0² − 1² = 0으로 가능한 가장 낮은 값이며, 더 나눌 필요가 없는 리프 노드다.",
        },
      },
      {
        text: "C",
        isCorrect: false,
        explanation: {
          basis: "혼합 레이블 노드의 지니 불순도 > 0",
          reason: "ON/OFF가 혼재해 불순도가 0보다 크다. 그림의 구성이라면 1 − (2/5)² − (3/5)² = 0.48.",
        },
      },
      {
        text: "D",
        isCorrect: false,
        explanation: {
          basis: "두 클래스가 반반일 때 지니 불순도가 가장 큼",
          reason: "ON 1개, OFF 1개로 반반이면 1 − (1/2)² − (1/2)² = 0.5로 오히려 가장 높다.",
        },
      },
    ],
  },
  {
    q: "결정 트리에서 속성 노드 선택과 관련해 적절한 설명은?",
    answer: 1,
    source: "공식 연습문제",
    basis: "강의록 7강 속성 선택을 위한 평가 기준, 그 밖의 평가지수 / 교재 9.1.2",
    examSkill: "지니 불순도·지니 평가지수·정보 이득의 정의와 선택 방향(최소/최대)을 정확히 구분",
    refs: {
      textbook: "9.1.2 지니 불순도, 지니 평가지수",
      slides: "결정 트리의 학습 — 속성 선택을 위한 평가 기준 / 그 밖의 평가지수",
      lecture: "루트 노드부터 지니 평가지수를 최소화하는 속성 노드를 선택해 레벨을 확장한다고 정리함",
    },
    choices: [
      {
        text: "클래스 레이블이 서로 다를수록 지니 불순도가 낮다.",
        isCorrect: false,
        explanation: {
          basis: "하나의 그룹 안에 서로 다른 클래스 레이블이 혼재할수록 불순도는 높아짐",
          reason: "방향이 반대다. 레이블이 섞일수록 지니 불순도는 높아지고, 모두 같으면 0이 된다.",
        },
      },
      {
        text: "지니 평가지수가 최소인 속성을 선택한다.",
        isCorrect: true,
        explanation: {
          basis: "지니 평가지수를 최소화하는 속성 노드를 선택하여 레벨을 확장",
          reason:
            "세탁기 예에서 G(R_Weather) = 0.3429가 Temperature 0.4405, Amount 0.4286보다 작으므로 Weather를 루트 노드에 배정한다.",
        },
      },
      {
        text: "지니 불순도는 자식 노드 지니 평가지수의 가중합이다.",
        isCorrect: false,
        explanation: {
          basis: "지니 평가지수 — 부모 노드 R_a에서 자식 노드들의 지니 불순도의 가중합",
          reason:
            "두 용어의 자리가 바뀌었다. 지니 불순도는 노드 하나의 혼합 정도이고, 그 불순도를 자식 노드별로 가중합한 것이 지니 평가지수다.",
        },
      },
      {
        text: "데이터 혼잡도가 높을수록 정보 이득이 높다.",
        isCorrect: false,
        explanation: {
          basis: "엔트로피 → 주어진 데이터 집합의 혼잡도 ⇒ (엔트로피↑, 정보 이득↓)",
          reason: "혼잡도(엔트로피)가 높으면 정보 이득은 낮다. 정보 이득이 높은 속성을 기준으로 선택한다.",
        },
      },
    ],
  },
  {
    q: "다음 설명 중 적절하지 못한 것은?",
    answer: 3,
    source: "공식 연습문제",
    basis: "강의록 7강 랜덤 포레스트? / 정리하기 / 교재 9.2.2",
    examSkill: "랜덤 포레스트가 결정 트리의 과다적합을 완화하는 방법이라는 관계를 뒤집은 진술 찾기",
    refs: {
      textbook: "9.2.1 랜덤 포레스트 알고리즘 · 9.2.2 랜덤 포레스트를 이용한 분류와 회귀",
      slides: "랜덤 포레스트? / 정리하기 — 랜덤 포레스트",
    },
    choices: [
      {
        text: "랜덤 포레스트는 리샘플링을 사용한다.",
        isCorrect: false,
        explanation: {
          basis: "배깅 방법으로 데이터를 리샘플링하여 M개의 결정 트리를 학습",
          reason: "옳은 설명이다. 각 트리의 학습 데이터 Xᵢ는 전체 데이터 X에서 복원추출로 다시 뽑은 것이다.",
        },
      },
      {
        text: "랜덤 포레스트에는 앙상블 학습이 적용된다.",
        isCorrect: false,
        explanation: {
          basis: "결정 트리와 앙상블 학습 기법을 결합한 방법",
          reason: "옳은 설명이다. 랜덤 포레스트의 정의 자체가 결정 트리 + 앙상블 학습이다.",
        },
      },
      {
        text: "결정 트리와 배깅을 결합하면 일반화 성능을 향상할 수 있다.",
        isCorrect: false,
        explanation: {
          basis: "결정 트리의 수가 증가함에 따라 정교한 결정경계를 생성, 일반화 성능 향상",
          reason: "옳은 설명이다. 결정 트리는 앙상블 학습과 결합될 때 일반화 성능 향상 효과가 매우 뛰어나다.",
        },
      },
      {
        text: "랜덤 포레스트는 결정 트리보다 과다적합 가능성이 높다.",
        isCorrect: true,
        explanation: {
          basis: "노이즈를 포함하는 데이터에 대하여 과다적합되는 현상이 많이 완화됨",
          reason:
            "적절하지 못한 설명이다. 랜덤 포레스트는 결정 트리의 과다적합 문제를 해결하기 위해 등장한 발전된 해결책이며, 트리 수가 늘수록 과다적합이 완화된다.",
        },
      },
    ],
  },
  {
    q: "어떤 노드에 ON 레이블 데이터 3개와 OFF 레이블 데이터 2개가 할당되어 있다. 이 노드의 지니 불순도는?",
    answer: 1,
    source: "변형",
    basis: "교재 식 9-1, 식 9-3 / 강의록 결정 트리의 학습 — I(C₁) = 0.48",
    examSkill: "비율을 구해 I = 1 − Σpᵢ²에 대입하는 계산",
    refs: {
      textbook: "9.1.2 식 9-3",
      slides: "결정 트리의 학습 — 지니 불순도 계산",
    },
    choices: [
      {
        text: "0.24",
        isCorrect: false,
        explanation: {
          basis: "I = Σ pᵢ(1 − pᵢ)",
          reason: "0.6 × 0.4 = 0.24는 한 클래스 항만 계산한 값이다. 두 클래스의 항을 모두 더하면 0.24 + 0.24 = 0.48.",
        },
      },
      {
        text: "0.48",
        isCorrect: true,
        explanation: {
          basis: "I = 1 − (3/5)² − (2/5)² = 1 − 0.36 − 0.16",
          reason: "ON 비율 3/5, OFF 비율 2/5를 제곱해 1에서 빼면 0.48. 교재 그림 9-3(a)의 C₁(Sunny)과 같은 구성이다.",
        },
      },
      {
        text: "0.5",
        isCorrect: false,
        explanation: {
          basis: "두 클래스가 반반일 때 0.5",
          reason: "0.5는 두 클래스가 정확히 반반일 때의 최댓값이다. 3:2는 반반이 아니므로 그보다 작다.",
        },
      },
      {
        text: "0.6",
        isCorrect: false,
        explanation: {
          basis: "pᵢ는 비율이지 불순도가 아님",
          reason: "0.6은 ON 클래스의 비율 p₁ 자체다. 불순도는 비율을 식에 넣어 계산해야 한다.",
        },
      },
    ],
  },
  {
    q: "14개 데이터를 속성 Weather로 나눴더니 자식 노드가 5개, 4개, 5개이고 각각의 지니 불순도가 0.48, 0, 0.48이었다. 지니 평가지수 G(R_Weather)는?",
    answer: 2,
    source: "변형",
    basis: "교재 식 9-4, 식 9-5 / 강의록 결정 트리의 학습 — G(R_weather) = 0.3429",
    examSkill: "자식 노드 불순도를 데이터 개수 비율로 가중합하는 계산",
    refs: {
      textbook: "9.1.2 식 9-4, 식 9-5",
      slides: "결정 트리의 학습 — 지니 평가지수 계산",
    },
    choices: [
      {
        text: "0.96",
        isCorrect: false,
        explanation: {
          basis: "G(R_a) = Σ (|Cᵢ|/|R_a|)·I(Cᵢ)",
          reason: "0.48 + 0 + 0.48을 가중치 없이 단순히 더한 값이다.",
        },
      },
      {
        text: "0.32",
        isCorrect: false,
        explanation: {
          basis: "가중치는 데이터 개수 비율",
          reason: "세 불순도의 단순 평균 (0.48 + 0 + 0.48)/3 = 0.32다. 자식 노드마다 데이터 개수가 다르므로 개수 비율로 가중해야 한다.",
        },
      },
      {
        text: "0.3429",
        isCorrect: true,
        explanation: {
          basis: "5/14 × 0.48 + 4/14 × 0 + 5/14 × 0.48 = 0.3429",
          reason: "분할 전 I(R) = 0.4592보다 줄었고, Temperature(0.4405)·Amount(0.4286)보다도 작아 Weather가 루트로 선택된다.",
        },
      },
      {
        text: "0.4592",
        isCorrect: false,
        explanation: {
          basis: "I(R) = 1 − (5/14)² − (9/14)² = 0.4592",
          reason: "분할하기 전 루트 노드의 지니 불순도다. 지니 평가지수는 분할 후 자식 노드들로 계산한다.",
        },
      },
    ],
  },
  {
    q: "회귀 문제를 위한 결정 트리에서, 어떤 리프 노드에 목표 출력값 y = 0인 데이터 3개와 y = 1인 데이터 8개가 할당되었다. 이 리프 노드의 출력값은?",
    answer: 1,
    source: "변형",
    basis: "교재 9.1.4 그림 9-7(b) / 강의록 회귀를 위한 결정 트리 — 노드의 출력값",
    examSkill: "분류 트리(다수 클래스)와 회귀 트리(목표 출력값의 평균)의 리프 출력 구분",
    refs: {
      textbook: "9.1.4 회귀를 위한 결정 트리",
      slides: "회귀를 위한 결정 트리 — 노드의 출력값",
    },
    choices: [
      {
        text: "class = 1",
        isCorrect: false,
        explanation: {
          basis: "분류 문제 — 다수의 데이터가 포함된 클래스를 해당 노드의 레이블로",
          reason: "분류 트리로 접근했을 때의 출력이다. 회귀 트리의 출력은 클래스 레이블이 아니라 실수값이다.",
        },
      },
      {
        text: "0.727",
        isCorrect: true,
        explanation: {
          basis: "노드의 출력값 → 해당 노드에 속한 데이터의 목표 출력값의 평균",
          reason: "(0×3 + 1×8)/11 = 8/11 = 0.727. 교재 그림 9-7(b)의 맨 왼쪽 리프 노드와 같다.",
        },
      },
      {
        text: "0.198",
        isCorrect: false,
        explanation: {
          basis: "squared_error = 평균 (y − 0.727)²",
          reason: "0.198은 같은 리프 노드의 제곱오차다. 노드가 표시하는 값이지만 출력값은 아니다.",
        },
      },
      {
        text: "0.397",
        isCorrect: false,
        explanation: {
          basis: "gini = 1 − (3/11)² − (8/11)²",
          reason: "0.397은 분류 트리로 봤을 때 이 노드의 지니 불순도다.",
        },
      },
    ],
  },
  {
    q: "결정 트리의 학습 과정에서 어떤 노드가 더 이상 분할할 필요가 없는 리프 노드가 되는 경우는?",
    answer: 2,
    source: "변형",
    basis: "교재 9.1.2 결정 트리의 학습 / 강의록 결정 트리의 학습 — 학습 과정",
    examSkill: "학습 과정에서 분할을 멈추는 조건 판단",
    refs: {
      textbook: "9.1.2 결정 트리의 학습",
      slides: "결정 트리의 학습 — 학습 과정",
    },
    choices: [
      {
        text: "할당된 데이터의 지니 불순도가 0.5일 때",
        isCorrect: false,
        explanation: {
          basis: "두 클래스가 반반이면 불순도 최대",
          reason: "0.5는 가장 많이 섞인 상태이므로 오히려 분할이 가장 필요한 노드다.",
        },
      },
      {
        text: "할당된 데이터가 부모 노드보다 적을 때",
        isCorrect: false,
        explanation: {
          basis: "자식 노드는 부모 노드 데이터를 나눠 받음",
          reason: "자식 노드의 데이터는 언제나 부모 노드보다 적거나 같다. 이것은 분할 중단의 기준이 아니다.",
        },
      },
      {
        text: "할당된 데이터의 클래스 레이블이 모두 동일할 때",
        isCorrect: true,
        explanation: {
          basis: "어떤 자식 노드에 할당된 데이터의 클래스 레이블이 모두 동일하면 리프 노드가 됨",
          reason: "그룹을 더 나눌 필요가 없으므로 리프 노드가 된다. 세탁기 예의 Rainy 노드(모두 OFF)가 여기에 해당한다.",
        },
      },
      {
        text: "속성이 연속한 실수값을 가질 때",
        isCorrect: false,
        explanation: {
          basis: "연속값 속성은 속성값(기준값)으로 분할",
          reason: "연속값 속성도 x₁ ≤ 0.555처럼 기준값을 정해 얼마든지 분할할 수 있다.",
        },
      },
    ],
  },
  {
    q: "결정 트리의 과다적합을 줄이기 위해 전체 트리를 만든 후 불필요한 노드들을 제거하는 방법은?",
    answer: 1,
    source: "변형",
    basis: "강의록 7강 결정 트리의 문제 — 간단한 해결책 / 교재 9.2.1",
    examSkill: "조기 종료(분할을 도중에 멈춤)와 가지치기(다 만든 뒤 제거)의 시점 구분",
    refs: {
      textbook: "9.2.1 랜덤 포레스트 알고리즘 (도입부 — 가지치기)",
      slides: "결정 트리의 문제 — 간단한 해결책",
    },
    choices: [
      {
        text: "조기 종료",
        isCorrect: false,
        explanation: {
          basis: "조기 종료 — 더 분할해도 성능이 향상되지 않은 시점에 노드의 분할을 종료",
          reason: "조기 종료는 트리를 만드는 도중에 분할을 멈춰 깊이를 조절한다. 다 만든 뒤 제거하는 방법이 아니다.",
        },
      },
      {
        text: "가지치기",
        isCorrect: true,
        explanation: {
          basis: "가지치기 pruning — 전체 트리를 만든 후 불필요한 노드들을 제거",
          reason: "먼저 전체 트리를 만든 다음 불필요한 노드를 잘라 내는 방법이다.",
        },
      },
      {
        text: "배깅",
        isCorrect: false,
        explanation: {
          basis: "배깅 — 데이터를 리샘플링해 여러 학습기를 만드는 앙상블 방법",
          reason: "배깅은 랜덤 포레스트가 쓰는 발전된 해결책의 재료이지, 한 트리의 노드를 제거하는 방법이 아니다.",
        },
      },
      {
        text: "보팅",
        isCorrect: false,
        explanation: {
          basis: "보팅 — 분류 문제에서 여러 트리 출력을 결합하는 방법",
          reason: "보팅은 결합 방법이다. 트리 구조를 바꾸지 않는다.",
        },
      },
    ],
  },
  {
    q: "랜덤 포레스트라는 이름에서 '랜덤'이 가리키는 것으로 가장 적절한 것은?",
    answer: 2,
    source: "변형",
    basis: "강의록 7강 랜덤 포레스트? — “포레스트”, “랜덤” / 교재 9.2.1",
    examSkill: "용어의 유래를 알고리즘 단계(리샘플링)와 연결",
    refs: {
      textbook: "9.2.1 랜덤 포레스트 알고리즘",
      slides: "랜덤 포레스트? — “랜덤”",
    },
    choices: [
      {
        text: "결합할 때 M개의 트리 가운데 하나를 랜덤하게 골라 출력한다.",
        isCorrect: false,
        explanation: {
          basis: "결합 방법 → 분류(주로 보팅), 회귀(출력값의 평균)",
          reason: "모든 트리의 결과를 보팅이나 평균으로 결합한다. 하나만 골라 쓰지 않는다.",
        },
      },
      {
        text: "학습 데이터의 클래스 레이블을 랜덤하게 바꿔 학습한다.",
        isCorrect: false,
        explanation: {
          basis: "리샘플링은 데이터를 다시 뽑는 것",
          reason: "레이블은 바꾸지 않는다. 원래 데이터에서 Ñ개를 복원추출로 다시 뽑을 뿐이다.",
        },
      },
      {
        text: "결정 트리 간의 차이가 랜덤하게 추출된 데이터 샘플에 기인한다.",
        isCorrect: true,
        explanation: {
          basis: "“랜덤” → 결정 트리 간의 차이가 랜덤하게 추출된 데이터 샘플에 기인",
          reason: "각 트리는 랜덤하게 복원추출한 서로 다른 Xᵢ로 학습되므로 서로 다른 트리가 된다. “포레스트”는 그런 M개의 트리가 모인 숲 구조를 가리킨다.",
        },
      },
      {
        text: "각 트리의 깊이가 랜덤하게 정해진다.",
        isCorrect: false,
        explanation: {
          basis: "② i번째 결정 트리를 학습하기 위해 트리의 깊이를 결정",
          reason: "깊이는 학습 전에 정하는 값이다. 이름의 ‘랜덤’은 데이터 샘플의 무작위 추출에서 왔다.",
        },
      },
    ],
  },
  {
    q: "랜덤 포레스트의 학습 과정에 대한 설명으로 옳은 것은?",
    answer: 0,
    source: "변형",
    basis: "교재 9.2.1 랜덤 포레스트의 학습 ①~④ / 강의록 랜덤 포레스트의 학습",
    examSkill: "리샘플링 크기 Ñ, 복원추출, 문제 유형별 결합 방법을 한꺼번에 점검",
    refs: {
      textbook: "9.2.1 랜덤 포레스트의 학습 ①~④",
      slides: "랜덤 포레스트의 학습",
    },
    choices: [
      {
        text: "i번째 트리의 데이터 집합 Xᵢ에는 같은 데이터가 중복해서 들어갈 수 있다.",
        isCorrect: true,
        explanation: {
          basis: "② 같은 데이터가 중복해서 선출되는 것도 허락한다(복원추출)",
          reason: "복원추출이므로 한 데이터가 여러 번 뽑힐 수도, 한 번도 뽑히지 않을 수도 있다.",
        },
      },
      {
        text: "각 트리의 학습 데이터 크기 Ñ은 전체 데이터 개수 N보다 커야 한다.",
        isCorrect: false,
        explanation: {
          basis: "① 각 결정 트리의 학습에 사용될 데이터 집합의 크기 Ñ (Ñ ≤ N)",
          reason: "Ñ은 N 이하로 정한다.",
        },
      },
      {
        text: "M개의 트리는 모두 같은 데이터 집합 X로 학습한다.",
        isCorrect: false,
        explanation: {
          basis: "② X로부터 Ñ개를 랜덤하게 선출하여 데이터 집합 Xᵢ를 만든다",
          reason: "트리마다 서로 다른 Xᵢ로 학습하기 때문에 서로 다른 M개의 트리가 생긴다. 모두 같은 X로 학습하면 같은 트리만 M개 나온다.",
        },
      },
      {
        text: "회귀 문제에서는 M개 트리의 출력을 보팅으로 결합한다.",
        isCorrect: false,
        explanation: {
          basis: "결합 방법 → 분류(주로 보팅법), 회귀(출력값의 평균)",
          reason: "회귀 문제는 출력값의 평균으로 결합한다. 보팅은 분류 문제의 결합 방법이다.",
        },
      },
    ],
  },
  {
    q: "2차원 연속값 데이터에 결정 트리를 적용했을 때 얻어지는 결정경계에 대한 설명으로 옳은 것은?",
    answer: 3,
    source: "변형",
    basis: "교재 9.1.3 그림 9-6 / 강의록 결정 트리를 이용한 분류 — 결정경계",
    examSkill: "결정 트리 결정경계의 모양과 깊이를 늘릴 때의 한계를 연결",
    refs: {
      textbook: "9.1.3 결정 트리를 이용한 2차원 데이터 분류 (그림 9-6)",
      slides: "결정 트리를 이용한 분류 — 결정경계",
    },
    choices: [
      {
        text: "실제 결정경계가 대각선이면 트리도 대각선 결정경계를 찾는다.",
        isCorrect: false,
        explanation: {
          basis: "각 노드는 속성 하나의 기준값으로 분할",
          reason: "분할선이 모두 축에 평행하므로 대각선 x₁ = x₂를 정확히 표현할 수 없고, 계단 모양으로 근사할 뿐이다.",
        },
      },
      {
        text: "깊이를 계속 늘려 모든 학습 데이터를 완벽히 분류하면 일반화 성능도 가장 좋아진다.",
        isCorrect: false,
        explanation: {
          basis: "모든 학습 데이터를 완벽하게 분류할 때까지 깊이를 늘리는 방법으로는 일반화 성능이 좋은 결정경계를 찾을 수 없음",
          reason: "오히려 노이즈에 민감해져 일반화 성능이 떨어질 수 있다. 적절한 깊이를 사전에 정해 두는 방법이 권장된다.",
        },
      },
      {
        text: "베이즈 분류기와 같은 매끄러운 곡선 형태가 된다.",
        isCorrect: false,
        explanation: {
          basis: "결정 트리의 결정경계는 베이즈나 K-최근접이웃 분류기와 달리 계단 형태",
          reason: "결정 트리는 축에 평행한 분할의 조합이라 매끄러운 곡선이 나오지 않는다.",
        },
      },
      {
        text: "계단 형태의 불연속 함수로 주어진다.",
        isCorrect: true,
        explanation: {
          basis: "결정 트리의 결정경계는 계단 형태의 불연속 함수로 주어짐",
          reason: "속성과 속성값으로 나눈 영역들의 경계이므로 계단 모양이며, 깊이가 얕을수록 불연속성이 더 뚜렷하다.",
        },
      },
    ],
  },
];

const OFFICIAL = QUIZZES.filter((q) => q.source === "공식 연습문제").length;

function LeafFigure({ leaves }: { leaves: NonNullable<Quiz["leafFigure"]> }) {
  return (
    <div className="mb-4 overflow-x-auto">
      <div className="flex min-w-[320px] items-start justify-center gap-3">
        {leaves.map((l) => (
          <div key={l.name} className="flex flex-col items-center">
            <div className="w-14 rounded-md border border-gray-300 bg-gray-50 p-1 text-center dark:border-gray-600 dark:bg-gray-800">
              {l.labels.map((lab, i) => (
                <p
                  key={i}
                  className={`text-[10px] font-bold ${lab === "ON" ? "text-emerald-600" : "text-rose-600"}`}
                >
                  {lab}
                </p>
              ))}
            </div>
            <span className="mt-1 text-xs font-bold">{l.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Lecture7Quiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUIZZES.length).fill(null));

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
        subtitle={`정리하기 공식 연습문제 ${OFFICIAL}문항과 변형 문제 ${QUIZZES.length - OFFICIAL}문항`}
      />

      <div className="space-y-6">
        {QUIZZES.map((quiz, qi) => {
          const done = answers[qi] !== null;
          const isCorrect = answers[qi] === quiz.answer;
          return (
            <Sourced key={qi} refs={quiz.refs}>
              <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                    {qi + 1}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      quiz.source === "공식 연습문제"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {quiz.source}
                  </span>
                  <span className="text-[11px] text-gray-400">{quiz.examSkill}</span>
                </div>

                <h4 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">{quiz.q}</h4>

                {quiz.leafFigure && <LeafFigure leaves={quiz.leafFigure} />}

                <div className="space-y-2">
                  {quiz.choices.map((choice, ci) => {
                    let style =
                      "border-gray-200 bg-gray-50 hover:bg-emerald-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-emerald-900/10";
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
                          type="button"
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
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-900/20"
        >
          <div>
            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
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
            type="button"
            onClick={() => setAnswers(new Array(QUIZZES.length).fill(null))}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <RotateCcw size={14} />
            다시 풀기
          </button>
        </motion.div>
      )}
    </section>
  );
}
