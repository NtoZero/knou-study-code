"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

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
};

const quizzes: Quiz[] = [
  {
    q: "다음 설명 중 적절한 것은?",
    source: "공식 연습문제",
    basis: "강의록 1강 머신러닝의 개념 — 인공지능·머신러닝·딥러닝의 관계",
    examSkill: "개념 정의 판별",
    answer: 0,
    choices: [
      {
        text: "머신러닝에서 학습이란 입력과 출력의 관계를 나타내는 매핑 함수를 찾는 것이다.",
        isCorrect: true,
        explanation: {
          basis: "강의록 1강 머신러닝의 기본 요소 — 학습 시스템",
          reason:
            "학습 시스템은 입·출력 매핑 형태의 함수 y = f(x; θ)로 정의되고, 학습은 데이터를 이용해 그 함수 f, 즉 매개변수 θ를 찾는 것. 선택지의 서술과 정확히 일치.",
        },
      },
      {
        text: "알파고는 강인공지능 시스템에 속한다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 머신러닝의 개념 — 약인공지능과 강인공지능",
          reason:
            "알파고는 바둑이라는 정의된 특정 목적만 달성하면 되는 약인공지능의 대표 사례. 강인공지능은 스스로 문제를 정의·해결하고 자의식과 감정까지 포함하는 수준을 뜻하므로 알파고와 다름.",
        },
      },
      {
        text: "딥러닝은 기존의 모든 학습 방법을 깊이 있게 다루는 접근법을 총칭한다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 머신러닝의 개념 — 딥러닝",
          reason:
            "딥러닝은 '깊이 있게 다루는 접근법의 총칭'이 아니라 심층 신경망 기반의 머신러닝 분야로 한정됨. '깊다'는 것은 다루는 깊이가 아니라 신경망의 층이 많다는 뜻.",
        },
      },
      {
        text: "머신러닝은 명시적인 지식표현이나 처리 절차가 존재하는 문제에 효과적이다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 머신러닝의 개념 — 머신러닝은 왜 필요한가",
          reason:
            "머신러닝이 필요한 경우는 오히려 그 반대로, 명시적인 지식 표현이나 프로그램을 만드는 것이 어렵거나 불가능한 경우. 처리 절차가 이미 존재하면 기존 문제 풀이 방법으로 프로그램을 만들면 됨.",
        },
      },
    ],
  },
  {
    q: "머신러닝의 기본적인 처리 단계와 과정에 대한 설명으로 적절한 것은?",
    source: "공식 연습문제",
    basis: "강의록 1강 머신러닝의 처리 과정 — 학습 단계와 추론 단계",
    examSkill: "처리 단계 구분",
    answer: 3,
    choices: [
      {
        text: "학습 단계는 학습 데이터를 통해 시스템의 실제 성능을 평가하기 위한 단계이다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 머신러닝의 처리 과정",
          reason:
            "학습 단계는 시스템을 개발하는 단계로, 데이터를 분석해 입·출력 매핑 함수를 찾는 것이 목적. 실제 성능 평가는 테스트 데이터를 사용하는 추론 단계에서 이뤄지므로 서술이 뒤바뀜.",
        },
      },
      {
        text: "입력 데이터를 분석에 쉬운 형태로 가공·변환하는 과정을 정제화라고 한다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 머신러닝의 처리 과정 — 전처리",
          reason:
            "중복·불필요한 데이터를 제거하고 분석에 용이한 형태로 가공·변환하는 과정의 이름은 '정제화'가 아니라 전처리(preprocessing).",
        },
      },
      {
        text: "데이터에 대한 효과적인 전처리 기술은 머신러닝의 주요 핵심 주제 중 하나이다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 머신러닝의 처리 과정 — 전처리",
          reason:
            "전처리는 문제 및 입력 데이터 유형에 의존적이며 머신러닝과 직접 관련이 없음. 머신러닝의 주요 문제 영역은 특징추출과 분류·회귀·군집화.",
        },
      },
      {
        text: "추론 단계에서는 테스트 데이터만 필요하다.",
        isCorrect: true,
        explanation: {
          basis: "강의록 1강 머신러닝의 처리 과정 — 추론 단계",
          reason:
            "추론 단계는 학습이 끝난 시스템을 실제 데이터에 적용하는 단계이므로, 학습 데이터가 아니라 테스트 데이터를 입력으로 사용하며 실제 시스템의 성능 평가도 이 단계에서 수행. 다만 학습 때와 동일한 전처리·특징추출은 그대로 거침.",
        },
      },
    ],
  },
  {
    q: "오차함수를 사용한 성능 평가 기준 중 실용적인 관점에서 시스템 성능을 평가하기 위한 가장 현실적인 기준은?",
    source: "공식 연습문제",
    basis: "강의록 1강 머신러닝의 기본 요소 — 성능 평가",
    examSkill: "성능 평가 기준 선택",
    answer: 2,
    choices: [
      {
        text: "일반화 오차",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 성능 평가 — 일반화 오차",
          reason:
            "일반화 오차의 최소화가 실제 원하는 궁극적 목표이기는 하지만, 식에 모집단의 확률밀도 p(x)가 들어가고 이 p(x)를 알 수 없어 실제 계산이 불가능. 그래서 '현실적인 기준'은 될 수 없음.",
        },
      },
      {
        text: "실용 오차",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 성능 평가 — 오차함수를 사용한 성능 평가 기준",
          reason:
            "'실용 오차'라는 기준은 강의록에 존재하지 않음. 오차함수를 사용한 성능 평가 기준은 학습 오차, 테스트 오차, 일반화 오차의 세 가지.",
        },
      },
      {
        text: "테스트 오차",
        isCorrect: true,
        explanation: {
          basis: "강의록 1강 성능 평가 — 테스트 오차",
          reason:
            "계산이 불가능한 일반화 오차를 대신하여 실제 시스템의 성능을 평가하는 기준. 일반화 오차에 대한 경험치이므로 경험 오차(empirical error)라고도 부름.",
        },
      },
      {
        text: "학습 오차",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 성능 평가 — 학습 오차",
          reason:
            "학습 오차는 학습에 이미 사용한 학습 데이터 집합을 대상으로 계산되므로, 앞으로 주어질 새로운 데이터에 대한 성능을 나타내지 못함.",
        },
      },
    ],
  },
  {
    q: "주식시장에서 주가를 예측하는 시스템에 적용할 머신러닝 기법으로 가장 적절한 것은?",
    source: "공식 연습문제",
    basis: "강의록 1강 머신러닝에서의 주제 — 회귀",
    examSkill: "문제 유형 판별과 방법 선택",
    answer: 1,
    choices: [
      {
        text: "K-최근접이웃 방법",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 데이터 분석 — 분류",
          reason:
            "K-최근접이웃 방법은 분류를 위한 방법으로 제시된 것으로, 출력이 이산적인 클래스 레이블. 주가처럼 연속적인 실수값을 예측하는 문제에는 맞지 않음.",
        },
      },
      {
        text: "선형 회귀",
        isCorrect: true,
        explanation: {
          basis: "강의록 1강 데이터 분석 — 회귀",
          reason:
            "주가는 연속적인 실수값이므로 입력과 출력의 매핑 관계를 찾는 회귀 문제이며, 주가 예측은 시계열 예측의 대표 사례로 제시됨. 선형회귀는 회귀에 적용하는 대표적인 방법.",
        },
      },
      {
        text: "결정 트리",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 데이터 분석 — 분류",
          reason:
            "결정 트리 역시 베이즈 분류기·랜덤 포레스트와 함께 분류 문제를 다루기 위한 방법으로 제시됨.",
        },
      },
      {
        text: "t-SNE",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 데이터 표현 — 특징추출",
          reason:
            "t-SNE는 PCA·LDA·MDS와 함께 특징추출 방법이며, 특히 데이터 시각화 용도로 사용. 값을 예측하는 기법이 아님.",
        },
      },
    ],
  },
  {
    q: "영상 분할과 같은 문제에 가장 적합한 머신러닝 유형은?",
    source: "공식 연습문제",
    basis: "강의록 1강 학습 시스템 관련 개념 — 머신러닝의 유형",
    examSkill: "학습 유형 판별",
    answer: 0,
    choices: [
      {
        text: "비지도학습",
        isCorrect: true,
        explanation: {
          basis: "강의록 1강 데이터 분석 — 군집화 / 머신러닝의 유형",
          reason:
            "영상 분할은 각 화소를 하나의 데이터로 취급해 값의 유사성에 따라 묶는 군집화 문제이며, 군집화는 목표 출력값 없이 학습하는 비지도학습에 해당.",
        },
      },
      {
        text: "교사학습",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 머신러닝의 유형 — 지도학습",
          reason:
            "교사학습은 지도학습의 다른 이름으로, 목표 출력값을 함께 제공해야 함. 영상 분할은 그런 목표 출력값 없이 화소를 묶는 문제이므로 해당하지 않음. 지도학습이 연결되는 주제는 분류와 회귀.",
        },
      },
      {
        text: "강화학습",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 머신러닝의 유형 — 강화학습",
          reason:
            "강화학습은 원하는 출력값을 모르거나 알 수 없는 경우 보상(reward) 형태의 교사 신호를 사용하는 방식으로, 주로 바둑·게임·제어 문제에서 사용.",
        },
      },
      {
        text: "자기지도학습",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 머신러닝의 유형 — 클래스 레이블링 문제",
          reason:
            "자기지도학습은 클래스 레이블링 비용 문제를 완화하기 위해 레이블이 없는 데이터에 스스로 레이블을 붙이는 지도학습의 변형. 영상 분할을 설명하는 기본 유형으로는 비지도학습이 적절.",
        },
      },
    ],
  },
  {
    q: "강의록이 인공지능·머신러닝·딥러닝 각 영역의 대표 사례로 제시한 것으로 옳은 것은?",
    source: "변형",
    basis: "강의록 1강 머신러닝의 개념 — 인공지능 ⊃ 머신러닝 ⊃ 딥러닝",
    examSkill: "사례 매칭",
    answer: 0,
    choices: [
      {
        text: "인공지능 — IBM Deep Blue (1997, 체스 프로그램)",
        isCorrect: true,
        explanation: {
          basis: "강의록 1강 인공지능, 머신러닝, 딥러닝의 관계",
          reason:
            "인공지능은 '지능적인 기계 또는 프로그램의 개발'로 설명되며, 그 예로 1997년 체스 프로그램인 IBM 딥 블루가 제시됨.",
        },
      },
      {
        text: "머신러닝 — ChatGPT",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 인공지능, 머신러닝, 딥러닝의 관계",
          reason:
            "ChatGPT는 알파고와 함께 '심층 신경망 기반의 학습 방법', 즉 딥러닝의 예로 제시됨. 머신러닝 칸에 놓인 사례는 IBM 왓슨.",
        },
      },
      {
        text: "딥러닝 — IBM Watson (2011, 퀴즈 프로그램)",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 인공지능, 머신러닝, 딥러닝의 관계",
          reason:
            "IBM 왓슨은 '학습 능력을 활용한 문제 풀이', 즉 머신러닝의 예로 제시되었고 이후 의료 진단 시스템으로 발전. 딥러닝의 예는 알파고와 ChatGPT.",
        },
      },
      {
        text: "머신러닝 — 퍼셉트론",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 인공지능의 역사",
          reason:
            "퍼셉트론은 1957년에 등장한 최초의 신경망 모델로 인공지능의 역사에서 다룬 항목이며, 세 영역의 관계를 설명하는 대표 사례로 제시된 것이 아님.",
        },
      },
    ],
  },
  {
    q: "특징추출과 사영(projection)에 대한 설명으로 옳지 않은 것은?",
    source: "변형",
    basis: "강의록 1강 머신러닝의 기본 요소 — 특징추출",
    examSkill: "정의·계산 확인",
    answer: 2,
    choices: [
      {
        text: "특징추출의 목적은 계산량·메모리 등 비용 절감과 데이터에 포함된 불필요한 정보 제거이다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 특징추출 — 목적",
          reason:
            "강의록이 밝힌 특징추출의 목적과 그대로 일치하는 옳은 설명이므로, '옳지 않은 것'을 고르는 이 문항의 답이 될 수 없음.",
        },
      },
      {
        text: "x = (2, 3)을 u = (1, 1) 방향으로 사영하면 특징값은 xᵀu = 5이다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 특징추출 — 사영에 의한 특징추출",
          reason:
            "xᵀu = 2 + 3 = 5로 강의에서 든 계산 예시와 정확히 일치하는 옳은 설명. 두 개의 값이 5라는 하나의 값으로 축소됨.",
        },
      },
      {
        text: "사영은 차원만 줄이면 되므로 어느 방향으로 사영해도 무관하다.",
        isCorrect: true,
        explanation: {
          basis: "강의록 1강 특징추출 — 어떤 방향으로 사영하는 것이 좋은가",
          reason:
            "단순한 차원 축소가 아니라 데이터 처리를 위한 핵심 정보의 추출이 더 중요하며, 주어진 데이터의 분포 특성을 가장 잘 나타낼 수 있는 방향을 찾아야 함. 따라서 이 서술이 옳지 않음.",
        },
      },
      {
        text: "120 × 120 영상을 12 × 12 격자 특징으로 표현하면 144차원이 된다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 특징추출 — 격자 특징",
          reason:
            "12 × 12 = 144이므로 옳은 설명. 원영상을 flatten한 14,400차원과 비교하면 차원이 크게 줄어듦.",
        },
      },
    ],
  },
  {
    q: "머신러닝에서의 데이터 표현과 데이터 분포에 대한 설명으로 옳은 것은?",
    source: "변형",
    basis: "강의록 1강 머신러닝의 기본 요소 — 데이터 표현·데이터 분포",
    examSkill: "표기 규칙과 분포 이해",
    answer: 1,
    choices: [
      {
        text: "7 × 5 이진 영상을 flatten하면 12차원 벡터가 된다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 데이터 표현",
          reason:
            "flatten은 2차원 배열을 1차원으로 펴는 것이므로 차원은 7 × 5 = 35. 7 + 5를 더한 12가 아님.",
        },
      },
      {
        text: "n차원 데이터가 N개 모인 데이터 집합은 n × N 행렬로 표현한다.",
        isCorrect: true,
        explanation: {
          basis: "강의록 1강 데이터 분포 — 데이터 집합",
          reason:
            "하나의 데이터가 n × 1 열벡터이고 그런 데이터가 N개 있으므로 데이터 집합 X = [x₁, x₂, ⋯, x_N]은 n × N 행렬이 됨.",
        },
      },
      {
        text: "같은 모집단에서 뽑은 표본집합들은 언제나 동일한 분포 모양을 보인다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 데이터 분포 — 표본집합",
          reason:
            "같은 모집단에서 50개씩 4개의 표본집합을 뽑으면 각 표본집합이 서로 모두 다름. 확률적 불확실성이 존재하기 때문.",
        },
      },
      {
        text: "학습 데이터의 개수가 적을수록 모집단의 분포에 더 가까워진다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 데이터 분포 — 표본집합과 모집단",
          reason:
            "반대로 N = 50일 때보다 N = 10⁴일 때의 분포가 원래 모집단에 더 가까움. 그래서 학습할 때는 가능한 많은 양의 데이터를 사용하는 것이 좋음.",
        },
      },
    ],
  },
  {
    q: "군집화 시스템에 대한 설명으로 옳지 않은 것은?",
    source: "변형",
    basis: "강의록 1강 데이터 분석 — 군집화",
    examSkill: "학습 목표 서술 검증",
    answer: 2,
    choices: [
      {
        text: "학습 데이터에 목표 출력값이 주어지지 않는다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 군집화 — 입·출력 관계",
          reason:
            "군집화의 학습 데이터는 D = {xᵢ}로 목표 출력값 yᵢ가 없음. 옳은 설명이므로 이 문항의 답이 아님.",
        },
      },
      {
        text: "학습 결과는 서로소인 K개의 부분집합으로 표현할 수 있다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 군집화 — 학습 결과",
          reason:
            "D = D₁ ∪ D₂ ∪ ⋯ ∪ D_K 형태의 서로소(disjoint) 부분집합이 군집화의 학습 결과. 옳은 설명.",
        },
      },
      {
        text: "최적의 클러스터란 클러스터 내의 분산이 최대이고 클러스터 간의 분산이 최소인 상태를 말한다.",
        isCorrect: true,
        explanation: {
          basis: "강의록 1강 군집화 — 학습 목표",
          reason:
            "'최적'은 클러스터 내의 분산은 최소, 클러스터 간의 분산은 최대인 상태. 선택지는 두 조건을 서로 뒤바꿔 서술했으므로 옳지 않음.",
        },
      },
      {
        text: "각 클러스터의 대표 벡터나 분포함수로도 학습 결과를 나타낼 수 있다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 군집화 — 학습 결과",
          reason:
            "학습 결과는 부분집합 외에 각 클러스터의 대표 벡터 또는 각 클러스터의 분포함수 형태로도 표현 가능하다고 제시됨. 옳은 설명.",
        },
      },
    ],
  },
  {
    q: "과다적합(overfitting)에 대한 설명으로 적절하지 않은 것은?",
    source: "변형",
    basis: "강의록 1강 학습 시스템 관련 개념 — 과다적합",
    examSkill: "과다적합 판단",
    answer: 2,
    choices: [
      {
        text: "원인은 학습 데이터의 확률적 잡음과 학습 데이터 개수의 부족이다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 과다적합 — 원인",
          reason: "강의록이 제시한 과다적합의 두 가지 원인 그대로이므로 적절한 설명.",
        },
      },
      {
        text: "일반화 성능의 저하를 초래한다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 과다적합 — 영향",
          reason:
            "과다적합의 영향은 일반화 성능 저하, 즉 일반화 오차가 커지는 것이므로 적절한 설명.",
        },
      },
      {
        text: "학습 오차가 작아지면 검증 오차도 항상 함께 작아진다.",
        isCorrect: true,
        explanation: {
          basis: "강의록 1강 학습 시스템의 복잡도 — 조기 종료",
          reason:
            "학습 오차는 계속 떨어지는데 어느 순간 검증 오차가 다시 올라가는 지점이 생기고, 그 지점에서 과다적합이 발생했다고 보고 학습을 멈추는 것이 조기 종료. 따라서 '항상 함께 작아진다'는 서술은 사실과 반대.",
        },
      },
      {
        text: "정규항을 가진 오차함수를 사용하여 복잡도를 조정할 수 있다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 과다적합 — 복잡도를 조정하는 방법",
          reason:
            "충분한 학습 데이터 사용, 조기 종료, 정규항을 가진 오차함수 사용, 여러 복잡도의 후보 모델 중 최적 모델 선택의 네 가지 중 하나이므로 적절한 설명.",
        },
      },
    ],
  },
  {
    q: "교차검증법에 대한 설명으로 옳은 것은?",
    source: "변형",
    basis: "강의록 1강 성능 평가 — 교차검증법",
    examSkill: "교차검증 절차 이해",
    answer: 0,
    choices: [
      {
        text: "제한된 데이터 집합을 이용하여 일반화 오차에 좀 더 근접한 오차값을 얻어 내기 위한 방법이다.",
        isCorrect: true,
        explanation: {
          basis: "강의록 1강 성능 평가 — 교차검증법",
          reason: "강의록에 제시된 교차검증법의 정의 그대로.",
        },
      },
      {
        text: "K-분절 교차검증법에서는 K개의 분절을 모두 학습에만 사용한다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 K-분절 교차검증법",
          reason:
            "각 회차마다 한 분절을 학습에서 빼고 테스트에만 사용하며, 이를 분절 수만큼 반복. 모든 분절을 학습에만 쓰면 테스트할 데이터가 남지 않음.",
        },
      },
      {
        text: "각 회차의 학습 오차를 평균 내어 교차검증 오차를 구한다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 K-분절 교차검증법",
          reason:
            "평균을 내는 대상은 학습 오차가 아니라 각 회차의 테스트 오차 E_test(Xᵢ). 그 평균이 교차검증 오차 E_cv.",
        },
      },
      {
        text: "교차검증을 사용하면 일반화 오차를 정확히 계산할 수 있다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 성능 평가 — 일반화 오차",
          reason:
            "일반화 오차는 모집단의 확률밀도 p(x)를 알 수 없어 계산 자체가 불가능. 교차검증은 그 값에 '좀 더 근접한' 오차값을 얻기 위한 방법일 뿐.",
        },
      },
    ],
  },
  {
    q: "2차원 분류 문제에서 결정경계가 g(x) = g(x₁, x₂) = x₂ − x₁ = 0으로 주어졌을 때의 설명으로 옳은 것은?",
    source: "변형",
    basis: "강의록 1강 데이터 분석 — 분류의 용어와 성능 평가 척도",
    examSkill: "분류 용어 구분",
    answer: 0,
    choices: [
      {
        text: "g(x) 자체를 결정함수 또는 판별함수라고 부른다.",
        isCorrect: true,
        explanation: {
          basis: "강의록 1강 데이터 분석: 분류 — 2차원 분류 예제",
          reason:
            "g(x) = 0으로 경계 지어지는 입력 공간상의 경계가 결정경계이고, g(x) 자체는 결정함수 또는 판별함수라고 부름.",
        },
      },
      {
        text: "g(x) = 0을 만족하는 점들의 집합을 결정규칙이라고 부른다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 데이터 분석: 분류 — 용어",
          reason:
            "g(x) = 0을 만족하는 경계는 결정경계. 결정규칙은 g(x)를 이용해 데이터가 최종적으로 어떤 클래스에 속할지 판정하는 규칙(예: g(x) ≥ 0이면 C1, g(x) < 0이면 C2)을 뜻함.",
        },
      },
      {
        text: "분류율(%)은 분류 실패 데이터 개수를 전체 데이터 개수로 나눈 뒤 100을 곱한 값이다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 데이터 분석: 분류 — 성능 평가 척도",
          reason:
            "그것은 분류 오차(%)의 정의. 분류율(%)은 분류 성공 데이터 개수를 전체 데이터 개수로 나눈 뒤 100을 곱한 값.",
        },
      },
      {
        text: "오차식의 δ 함수는 괄호 안의 값이 0이면 1을 돌려준다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 1강 데이터 분석: 분류 — 오차식의 δ 함수",
          reason:
            "δ 함수는 괄호 안의 값이 0이면 0을, 0이 아니면 1을 돌려줌. 목표 출력값과 시스템 출력값이 다른 경우, 즉 잘못된 것만 개수를 세기 위한 장치.",
        },
      },
    ],
  },
];

export default function Lecture1Quiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(quizzes.length).fill(null)
  );

  const handlePick = (qi: number, ci: number) => {
    if (answers[qi] !== null) return;
    setAnswers((prev) => prev.map((v, i) => (i === qi ? ci : v)));
  };

  const answered = answers.filter((a) => a !== null).length;
  const correct = answers.filter((a, i) => a !== null && a === quizzes[i].answer).length;

  return (
    <section>
      <SectionTitle
        title="1강 확인 문제"
        subtitle="정리하기의 연습문제 5문항과 강의록 근거 기반 변형 문항 7문항"
      />

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-900 dark:bg-cyan-950/40">
        <div>
          <p className="text-xs text-cyan-700 dark:text-cyan-300">진행</p>
          <p className="text-lg font-bold tabular-nums text-cyan-900 dark:text-cyan-100">
            {answered} / {quizzes.length}
          </p>
        </div>
        <div>
          <p className="text-xs text-cyan-700 dark:text-cyan-300">정답</p>
          <p className="text-lg font-bold tabular-nums text-cyan-900 dark:text-cyan-100">
            {correct}개{answered > 0 && ` (${Math.round((correct / answered) * 100)}%)`}
          </p>
        </div>
        <button
          onClick={() => setAnswers(new Array(quizzes.length).fill(null))}
          className="ml-auto flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
        >
          <RotateCcw size={14} /> 다시 풀기
        </button>
      </div>

      <div className="space-y-6">
        {quizzes.map((quiz, qi) => {
          const picked = answers[qi];
          const done = picked !== null;
          return (
            <div
              key={qi}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded bg-cyan-600 px-2 py-0.5 text-xs font-bold text-white">
                  Q{qi + 1}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    quiz.source === "공식 연습문제"
                      ? "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  {quiz.source}
                </span>
                <span className="text-[11px] text-gray-400">{quiz.examSkill}</span>
              </div>

              <p className="mb-4 text-sm font-medium leading-relaxed text-gray-800 dark:text-gray-100">
                {quiz.q}
              </p>

              <div className="space-y-2">
                {quiz.choices.map((c, ci) => {
                  const isPicked = picked === ci;
                  const showState = done;
                  const stateCls = !showState
                    ? "border-gray-200 hover:border-cyan-400 hover:bg-cyan-50 dark:border-gray-700 dark:hover:bg-cyan-950/40"
                    : c.isCorrect
                      ? "border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40"
                      : isPicked
                        ? "border-red-400 bg-red-50 dark:border-red-800 dark:bg-red-950/40"
                        : "border-gray-200 opacity-70 dark:border-gray-700";
                  return (
                    <div key={ci}>
                      <button
                        onClick={() => handlePick(qi, ci)}
                        disabled={done}
                        className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors ${stateCls}`}
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px] font-bold text-gray-500">
                          {ci + 1}
                        </span>
                        <span className="flex-1 leading-relaxed text-gray-800 dark:text-gray-100">
                          {c.text}
                        </span>
                        {showState &&
                          (c.isCorrect ? (
                            <CheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                          ) : isPicked ? (
                            <XCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                          ) : null)}
                      </button>
                      <AnimatePresence initial={false}>
                        {done && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-1 ml-8 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                              <p className="text-[11px] font-semibold text-gray-500">
                                {c.explanation.basis}
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                                {c.explanation.reason}
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
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-900 dark:bg-cyan-950/40"
                >
                  <p className="text-xs font-semibold text-cyan-800 dark:text-cyan-200">
                    정답 {quiz.answer + 1}번 · 출제 근거
                  </p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{quiz.basis}</p>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
