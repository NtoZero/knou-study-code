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
    q: "분류와 관련된 설명으로 적절한 것은?",
    source: "공식 연습문제",
    answer: 0,
    basis: "강의록 2강 분류의 개념 — 분류기의 입출력 관계 D = {(xᵢ, yᵢ)}, yᵢ ∈ {0, 1, ⋯, M − 1}",
    examSkill: "분류가 지도학습인 이유와 출력의 형태(이산적 클래스 레이블)를 구분하는 능력",
    choices: [
      {
        text: "학습 데이터에는 교사 신호를 함께 제공한다.",
        isCorrect: true,
        explanation: {
          basis: "학습 데이터 집합은 입력 xᵢ와 목표 출력값 yᵢ의 쌍으로 주어짐",
          reason:
            "이 목표 출력값(클래스 레이블)이 곧 교사 신호이며, 그래서 분류는 지도학습으로 분류된다.",
        },
      },
      {
        text: "분류기는 기본적으로 특정 범위의 실수값을 출력한다.",
        isCorrect: false,
        explanation: {
          basis: "yᵢ ∈ {0, 1, ⋯, M − 1}",
          reason:
            "분류기의 출력은 이산적인 클래스 레이블이며, 특정 범위의 실수값을 출력하는 것은 3강에서 다루는 회귀다.",
        },
      },
      {
        text: "베이즈 방법, SVM, PCA, LDA 등이 대표적으로 사용된다.",
        isCorrect: false,
        explanation: {
          basis: "분류에 사용되는 방법 — 베이즈 분류기, K-최근접이웃 방법, 결정 트리, 랜덤 포레스트, SVM, 신경망",
          reason:
            "PCA와 LDA는 분류기가 아니라 특징추출 방법이므로 분류기 나열에 들어갈 수 없다.",
        },
      },
      {
        text: "객체인식은 비지도학습에 해당한다.",
        isCorrect: false,
        explanation: {
          basis: "숫자 인식(MNIST), 얼굴 인식(FERET)이 분류의 대표 예",
          reason:
            "객체인식은 미리 정의된 클래스 레이블을 목표 출력값으로 사용하므로 비지도학습이 아니라 지도학습이다.",
        },
      },
    ],
  },
  {
    q: "주어진 데이터가 각 클래스로부터 생성되었을 조건부확률을 추정하여 분류하는 방법은?",
    source: "공식 연습문제",
    answer: 1,
    basis: "강의록 2강 — 결정경계를 얻기 위한 두 가지 접근법 중 확률 기반 방법",
    examSkill: "확률 기반 방법과 데이터 기반 방법의 대표 분류기를 구분하는 능력",
    choices: [
      {
        text: "최대 마진 분류기",
        isCorrect: false,
        explanation: {
          basis: "SVM은 결정경계의 마진을 최대화하는 목적함수를 사용",
          reason:
            "마진을 최대화하는 경계를 찾을 뿐 클래스별 조건부확률을 추정하지 않는다.",
        },
      },
      {
        text: "베이즈 분류기",
        isCorrect: true,
        explanation: {
          basis: "조건부확률 P(Cₖ|x)를 추정하여 분류",
          reason:
            "클래스별 확률밀도 p(x|Cₖ)와 사전확률 p(Cₖ)로 사후확률을 계산해 가장 큰 클래스로 할당한다.",
        },
      },
      {
        text: "최근접이웃 분류기",
        isCorrect: false,
        explanation: {
          basis: "데이터 간의 관계를 바탕으로 분류하는 데이터 기반 방법",
          reason:
            "확률분포 모델을 가정하지 않고 학습 데이터와의 거리만으로 분류하므로 조건부확률 추정과 무관하다.",
        },
      },
      {
        text: "선형 분류기",
        isCorrect: false,
        explanation: {
          basis: "결정경계 g(x; θ) = 0의 형태에 관한 구분",
          reason:
            "선형 분류기는 결정경계가 직선·초평면이라는 형태를 가리키는 말이지, 확률을 추정하는 방법을 가리키지 않는다.",
        },
      },
    ],
  },
  {
    q: "베이즈 정리에 해당하는 식은?",
    source: "공식 연습문제",
    answer: 3,
    basis: "강의록 2강 베이즈 분류기 — 사전확률로부터 사후확률을 계산하는 식 P(Cₖ|x) = p(x|Cₖ)p(Cₖ)/p(x)",
    examSkill: "우도·사전확률·증거 확률이 베이즈 정리에서 놓이는 자리를 정확히 아는 능력",
    choices: [
      {
        text: "P(A|B) = P(B|A) / P(A)",
        isCorrect: false,
        explanation: {
          basis: "분자는 우도 × 사전확률, 분모는 증거 확률",
          reason:
            "분자에 곱해져야 할 사전확률 P(A)가 오히려 분모에 놓였고, 분모의 P(B)가 빠졌다.",
        },
      },
      {
        text: "P(A|B) = P(B|A) / P(B)",
        isCorrect: false,
        explanation: {
          basis: "P(Cₖ|x) = p(x|Cₖ)p(Cₖ)/p(x)",
          reason: "분모 P(B)는 맞지만 분자에서 사전확률 P(A)를 곱하는 항이 통째로 빠졌다.",
        },
      },
      {
        text: "P(A|B) = P(B|A)P(B) / P(A)",
        isCorrect: false,
        explanation: {
          basis: "사전확률은 곱하고 증거 확률로 나눈다",
          reason: "곱하는 것과 나누는 것이 뒤바뀌어, 사전확률 P(A)로 나누고 P(B)를 곱한 형태가 되었다.",
        },
      },
      {
        text: "P(A|B) = P(B|A)P(A) / P(B)",
        isCorrect: true,
        explanation: {
          basis: "P(Cₖ|x) = p(x|Cₖ)p(Cₖ)/p(x)",
          reason:
            "우도 P(B|A)에 사전확률 P(A)를 곱하고 증거 확률 P(B)로 나눈 형태로, 강의록의 베이즈 정리와 같은 꼴이다.",
        },
      },
    ],
  },
  {
    q: "가우시안 베이즈 분류기가 각 클래스 평균까지의 거리가 최소인 클래스로 분류하기 위한 조건은?",
    source: "공식 연습문제",
    answer: 2,
    basis: "강의록 2강 베이즈 분류기의 구현 ① 클래스 공통 단위 공분산행렬 Σᵢ = σ²I",
    examSkill: "공분산행렬의 형태가 판별함수를 어떻게 단순화하는지 판단하는 능력",
    choices: [
      {
        text: "공분산행렬이 서로 다른 일반형",
        isCorrect: false,
        explanation: {
          basis: "Σᵢ ≠ Σⱼ 인 일반적인 공분산행렬의 경우",
          reason:
            "ln|Σᵢ| 항이 클래스마다 달라 그대로 남으므로 결정경계가 곡선이 되고, 평균까지의 단순 거리 비교로 줄어들지 않는다.",
        },
      },
      {
        text: "일반형 공분산행렬을 공통으로 가짐",
        isCorrect: false,
        explanation: {
          basis: "Σᵢ = Σ 인 클래스 공통 공분산행렬의 경우",
          reason:
            "이때는 마할라노비스 거리가 되어 공분산으로 가중된 거리를 비교하는 것이지, 평균까지의 단순 거리를 비교하는 것이 아니다.",
        },
      },
      {
        text: "단위행렬의 상수배인 공분산행렬을 공통으로 가짐",
        isCorrect: true,
        explanation: {
          basis: "Σᵢ = σ²I 이면 lᵢ(x) = −1/(2σ²)(x − μᵢ)ᵀ(x − μᵢ) − n ln σ + const",
          reason:
            "n과 σ가 모든 클래스에 공통이라 비교에서 사라지고 y(x) = argminᵢ (x − μᵢ)ᵀ(x − μᵢ), 곧 최소거리 분류기가 된다.",
        },
      },
      {
        text: "상수배 차이가 나는 일반형 공분산행렬",
        isCorrect: false,
        explanation: {
          basis: "단위행렬의 상수배와 일반형 행렬의 상수배는 다르다",
          reason:
            "일반형이면 상수배 관계라도 Σ⁻¹에 의한 방향별 가중이 남아, 평균과의 유클리디안 거리 비교로 단순화되지 않는다.",
        },
      },
    ],
  },
  {
    q: "최근접이웃 분류기와 K-최근접이웃 분류기의 차이점은?",
    source: "공식 연습문제",
    answer: 1,
    basis: "강의록 2강 K-최근접이웃 분류기의 수행 단계 — 후보집합 N(x) = {x₁, x₂, ⋯, x_K}",
    examSkill: "두 분류기의 수행 단계를 단계별로 대조하여 실제로 달라지는 지점을 짚는 능력",
    choices: [
      {
        text: "거리 계산에 참여하는 학습 데이터 개수",
        isCorrect: false,
        explanation: {
          basis: "두 방법 모두 1단계에서 모든 학습 데이터 x₁, ⋯, x_N 과의 거리를 계산",
          reason: "거리 계산 단계는 동일하므로 여기서는 차이가 생기지 않는다.",
        },
      },
      {
        text: "거리 계산 완료 후 클래스 결정에 참여하는 데이터 개수",
        isCorrect: true,
        explanation: {
          basis: "최근접이웃은 K-NN에서 K = 1인 경우",
          reason:
            "최근접이웃은 x_min 한 개로 결정하고, K-NN은 가까운 K개로 후보집합을 만들어 최빈 클래스를 고른다.",
        },
      },
      {
        text: "학습 데이터 개수",
        isCorrect: false,
        explanation: {
          basis: "학습 데이터 집합 X는 두 방법이 동일하게 사용",
          reason: "학습 데이터 자체를 다르게 모으는 것이 아니라, 같은 데이터에서 몇 개를 고르는지가 다르다.",
        },
      },
      {
        text: "후보 클래스 개수",
        isCorrect: false,
        explanation: {
          basis: "클래스 개수 M은 분류 문제 자체가 정하는 값",
          reason: "K값과 클래스 개수는 별개이며, 두 방법 모두 같은 클래스 집합을 대상으로 한다.",
        },
      },
    ],
  },
  {
    q: "K-최근접이웃 분류기에 대한 설명 중 적절한 것은?",
    source: "공식 연습문제",
    answer: 0,
    basis: "강의록 2강 가우시안 베이즈 분류기 vs K-최근접이웃 분류기 비교",
    examSkill: "K-NN이 학습 데이터를 저장해야 하는 이유와 설계 고려사항을 연결하는 능력",
    choices: [
      {
        text: "분류 과정에서도 모든 학습 데이터가 사용된다.",
        isCorrect: true,
        explanation: {
          basis: "새 데이터가 주어질 때마다 학습 데이터 전체와의 거리 계산이 필요",
          reason:
            "그래서 항상 학습 데이터를 필요로 하고 저장해야 하며, 계산량과 메모리 비용이 증가한다.",
        },
      },
      {
        text: "특정 확률분포 모델을 가정한다.",
        isCorrect: false,
        explanation: {
          basis: "확률분포 모델을 미리 가정하지 않고 데이터 집합을 이용하여 추정",
          reason:
            "가우시안 분포를 미리 가정하는 쪽은 가우시안 베이즈 분류기이며, K-NN은 그 반대의 데이터 기반 방법이다.",
        },
      },
      {
        text: "비지도학습에 해당한다.",
        isCorrect: false,
        explanation: {
          basis: "후보집합의 레이블값 y(x₁), ⋯, y(x_K)을 찾아 최빈 클래스로 할당",
          reason: "학습 데이터의 클래스 레이블을 그대로 사용하므로 목표 출력값이 있는 지도학습이다.",
        },
      },
      {
        text: "거리 함수와 성능은 무관하다.",
        isCorrect: false,
        explanation: {
          basis: "설계 고려사항 ⑴ 적절한 K값, ⑵ 거리 함수",
          reason:
            "거리 함수는 K값과 함께 명시된 설계 고려사항이며, 어떤 거리를 쓰느냐에 따라 후보집합 자체가 달라진다.",
        },
      },
    ],
  },

  /* ---------- 변형 문항 ---------- */

  {
    q: "우도비 검정 g_LRT(x) = p(x|C₁)/p(x|C₂) − p(C₂)/p(C₁) = 0 에서 앞의 항 p(x|C₁)/p(x|C₂)가 뜻하는 것은?",
    source: "변형",
    answer: 0,
    basis: "강의록 2강 베이즈 분류기 — 우도비(likelihood ratio)의 정의",
    examSkill: "우도비 검정 식의 각 항이 무엇의 비율인지 구분하는 능력",
    choices: [
      {
        text: "각 클래스에서 x가 관찰될 확률밀도의 비율",
        isCorrect: true,
        explanation: {
          basis: "우도비 likelihood ratio",
          reason: "p(x|C₁)과 p(x|C₂)는 각 클래스의 확률밀도이므로 그 비가 곧 우도비다.",
        },
      },
      {
        text: "전체 데이터 집합에서 각 클래스가 차지하는 비율",
        isCorrect: false,
        explanation: {
          basis: "사전확률의 비율 p(C₂)/p(C₁)",
          reason: "이 설명은 식의 뒤쪽 항인 사전확률 비율에 해당하며, 앞의 항과 자리를 바꿔 놓은 것이다.",
        },
      },
      {
        text: "두 클래스의 사후확률의 비율",
        isCorrect: false,
        explanation: {
          basis: "사후확률 P(Cₖ|x) = p(x|Cₖ)p(Cₖ)/p(x)",
          reason:
            "사후확률의 비라면 사전확률 p(Cₖ)까지 곱해진 형태여야 하는데, 여기에는 확률밀도만 남아 있다.",
        },
      },
      {
        text: "분류오차와 분류율의 비율",
        isCorrect: false,
        explanation: {
          basis: "분류율의 최대화 또는 분류오차의 최소화는 학습 목표에 관한 표현",
          reason: "분류율과 분류오차는 학습 목표를 기술하는 성능 지표일 뿐, 우도비 검정 식에 등장하지 않는다.",
        },
      },
    ],
  },
  {
    q: "이진 분류에서 p(C₂) = α·p(C₁) (α > 1)일 때, 결정경계를 정하는 조건은?",
    source: "변형",
    answer: 1,
    basis: "강의록 2강 베이즈 분류기의 결정경계 — p(C₁) ≠ p(C₂)인 경우",
    examSkill: "사전확률 차이가 결정경계를 어느 쪽으로 옮기는지 식으로 설명하는 능력",
    choices: [
      {
        text: "p(x|C₁) = p(x|C₂)",
        isCorrect: false,
        explanation: {
          basis: "이 조건은 p(C₁) = p(C₂)인 경우의 결정경계",
          reason: "사전확률이 서로 다른 상황인데 사전확률 항을 빼 버려, 경계가 옮겨지는 효과가 사라진다.",
        },
      },
      {
        text: "p(x|C₁) = α·p(x|C₂)",
        isCorrect: true,
        explanation: {
          basis: "p(x|C₁)p(C₁) = p(x|C₂)p(C₂)에 p(C₂) = α·p(C₁)를 대입",
          reason:
            "양변을 p(C₁)로 나누면 p(x|C₁) = α·p(x|C₂)가 되어, α배로 키운 곡선과의 교차점이 새로운 결정경계가 된다.",
        },
      },
      {
        text: "α·p(x|C₁) = p(x|C₂)",
        isCorrect: false,
        explanation: {
          basis: "α는 p(C₂)/p(C₁)로 정의됨",
          reason: "α를 곱하는 쪽이 반대로 되어 있어, 사전확률이 큰 C₂ 쪽이 오히려 좁아지는 잘못된 경계가 나온다.",
        },
      },
      {
        text: "p(x|C₁) + p(x|C₂) = α",
        isCorrect: false,
        explanation: {
          basis: "결정경계는 판별함수의 차 g(x) = 0에서 얻어짐",
          reason: "두 확률밀도의 합은 판별함수와 아무 관련이 없고, α는 합의 기준값이 아니라 사전확률의 비율이다.",
        },
      },
    ],
  },
  {
    q: "클래스 공통 공분산행렬 Σ가 대각행렬일 때 마할라노비스 거리는 무엇이 되는가?",
    source: "변형",
    answer: 1,
    basis: "강의록 2강 베이즈 분류기의 구현 ② 클래스 공통 공분산행렬",
    examSkill: "공분산 구조의 특수한 경우에 거리 척도가 어떻게 바뀌는지 아는 능력",
    choices: [
      {
        text: "유클리디안 거리",
        isCorrect: false,
        explanation: {
          basis: "유클리디안 거리는 Σ = σ²I인 경우에 대응",
          reason:
            "대각행렬이라도 요소별 분산이 서로 다르면 축마다 다른 가중이 남으므로 그냥 유클리디안 거리가 되지는 않는다.",
        },
      },
      {
        text: "정규화된 유클리디안 거리",
        isCorrect: true,
        explanation: {
          basis: "normalized Euclidean distance — 요소별로 표준편차 값으로 나누어 준 후 유클리디안 거리를 계산",
          reason:
            "대각행렬이면 Σ⁻¹도 대각이므로 각 요소를 해당 표준편차로 나눈 뒤 유클리디안 거리를 구하는 형태가 된다.",
        },
      },
      {
        text: "Manhattan distance",
        isCorrect: false,
        explanation: {
          basis: "Manhattan distance는 1차 노름의 다른 이름",
          reason: "차이의 절댓값을 더하는 거리로, 제곱형인 마할라노비스 거리에서 유도되지 않는다.",
        },
      },
      {
        text: "코사인 거리",
        isCorrect: false,
        explanation: {
          basis: "코사인 거리는 두 벡터의 방향을 비교하는 척도",
          reason: "크기를 무시하고 방향만 보는 척도여서, 평균과의 편차에 Σ⁻¹을 곱하는 계산과 형태가 다르다.",
        },
      },
    ],
  },
  {
    q: "K-최근접이웃 분류기에서 K값을 매우 크게(K ≫ 1) 잡으면 분류 결과는 무엇에 의존하게 되는가?",
    source: "변형",
    answer: 2,
    basis: "강의록 2강 K-최근접이웃 분류기의 설계 고려사항 ⑴ 적절한 K값의 결정",
    examSkill: "K값의 양 극단에서 생기는 현상(과다적합 / 사전확률 의존)을 구분하는 능력",
    choices: [
      {
        text: "바로 이웃한 데이터 한 개의 레이블",
        isCorrect: false,
        explanation: {
          basis: "K = 1 → 바로 이웃한 데이터에만 의존하여 클래스가 결정",
          reason: "이것은 K를 키운 경우가 아니라 K = 1일 때의 설명이며, 노이즈에 민감해 과다적합이 생긴다.",
        },
      },
      {
        text: "각 클래스의 공분산행렬의 행렬식",
        isCorrect: false,
        explanation: {
          basis: "ln|Σᵢ| 항은 가우시안 베이즈 분류기의 판별함수에 등장",
          reason: "K-NN은 확률분포 모델을 가정하지 않으므로 공분산행렬 자체를 추정하지 않는다.",
        },
      },
      {
        text: "전체 데이터 영역에서 각 클래스가 차지하는 비율(사전확률)",
        isCorrect: true,
        explanation: {
          basis: "K ≫ 1 → 주어진 데이터 주변 영역이 아닌 전체 데이터 영역에서 각 클래스가 차지하는 비율에 의존",
          reason:
            "후보집합이 넓어져 x 주변의 지역적 정보가 희석되고, 다수결 결과가 전체 비율 쪽으로 쏠린다.",
        },
      },
      {
        text: "결정경계의 마진 크기",
        isCorrect: false,
        explanation: {
          basis: "마진 최대화는 SVM의 목적함수",
          reason: "K-NN에는 마진이라는 개념 자체가 없고, 다수결로 클래스를 정한다.",
        },
      },
    ],
  },
  {
    q: "다중 클래스 문제에서 베이즈 분류기의 결정규칙으로 옳은 것은?",
    source: "변형",
    answer: 1,
    basis: "강의록 2강 베이즈 분류기: 다중 클래스 문제 — gᵢ(x) = p(x|Cᵢ)p(Cᵢ), y(x) = argmaxᵢ gᵢ(x)",
    examSkill: "판별함수의 정의와 argmax/argmin 방향을 정확히 쓰는 능력",
    choices: [
      {
        text: "y(x) = argminᵢ p(x|Cᵢ)p(Cᵢ)",
        isCorrect: false,
        explanation: {
          basis: "판별함수 값이 가장 큰 클래스로 할당",
          reason: "최솟값을 고르면 확률이 가장 낮은 클래스를 택하게 되어 결정규칙의 방향이 반대다.",
        },
      },
      {
        text: "y(x) = argmaxᵢ p(x|Cᵢ)p(Cᵢ)",
        isCorrect: true,
        explanation: {
          basis: "gᵢ(x) = p(x|Cᵢ)p(Cᵢ), y(x) = argmaxᵢ gᵢ(x)",
          reason:
            "확률밀도와 사전확률의 곱이 가장 큰 클래스가 사후확률도 가장 크므로, 그 클래스로 할당한다.",
        },
      },
      {
        text: "y(x) = argmaxᵢ p(Cᵢ)",
        isCorrect: false,
        explanation: {
          basis: "사후확률은 우도와 사전확률을 함께 사용",
          reason:
            "사전확률만 보면 입력 x를 전혀 쓰지 않게 되어, 어떤 데이터가 들어와도 항상 같은 클래스가 나온다.",
        },
      },
      {
        text: "y(x) = argminᵢ d(x, μᵢ) — 언제나 성립",
        isCorrect: false,
        explanation: {
          basis: "최소거리 분류기는 Σᵢ = σ²I인 특수한 경우",
          reason:
            "평균까지의 거리 비교로 줄어드는 것은 공분산이 단위행렬의 상수배로 공통일 때뿐이라 '언제나'가 틀렸다.",
        },
      },
    ],
  },
  {
    q: "K-최근접이웃 분류기의 거리 함수 중 1차 노름을 가리키는 다른 이름은?",
    source: "변형",
    answer: 0,
    basis: "강의록 2강 설계 고려사항 ⑵ 거리 함수 목록",
    examSkill: "거리 함수의 이름과 계산 방식을 짝짓는 능력",
    choices: [
      {
        text: "Manhattan distance",
        isCorrect: true,
        explanation: {
          basis: "1차 노름 — Manhattan distance",
          reason: "각 요소별 차이의 절댓값을 더하는 계산으로, 강의록에서 1차 노름에 붙인 이름이다.",
        },
      },
      {
        text: "마할라노비스 거리",
        isCorrect: false,
        explanation: {
          basis: "마할라노비스 거리는 Σ⁻¹로 가중한 거리",
          reason: "데이터 분포의 공분산을 반영하는 별개의 거리이며, 노름의 차수와는 다른 축의 개념이다.",
        },
      },
      {
        text: "코사인 거리",
        isCorrect: false,
        explanation: {
          basis: "코사인 거리는 두 벡터가 이루는 각도로 유사도를 잼",
          reason: "요소별 차이를 더하는 것이 아니라 내적을 크기로 나누어 계산하므로 1차 노름과 무관하다.",
        },
      },
      {
        text: "정규화된 유클리디안 거리",
        isCorrect: false,
        explanation: {
          basis: "요소별로 표준편차 값으로 나누어 준 후 유클리디안 거리를 계산",
          reason: "2차 노름을 표준편차로 정규화한 것이므로 1차 노름이 아니다.",
        },
      },
    ],
  },
  {
    q: "가우시안 베이즈 분류기가 분류 과정에서 학습 데이터를 필요로 하지 않는 이유는?",
    source: "변형",
    answer: 1,
    basis: "강의록 2강 가우시안 베이즈 분류기 vs K-최근접이웃 분류기 비교표",
    examSkill: "두 분류기의 저장·계산 비용 차이가 어디에서 오는지 설명하는 능력",
    choices: [
      {
        text: "학습 데이터를 압축하여 분류기 안에 저장해 두기 때문",
        isCorrect: false,
        explanation: {
          basis: "→ 분류 과정에서 학습 데이터 불필요",
          reason: "데이터를 압축해 보관하는 것이 아니라 아예 보관하지 않아도 되며, 이 점이 K-NN과 다르다.",
        },
      },
      {
        text: "학습 단계에서 추정한 평균과 표준편차만으로 판별함수를 계산할 수 있기 때문",
        isCorrect: true,
        explanation: {
          basis: "학습 데이터를 통해 평균과 표준편차만 추정하여 활용",
          reason:
            "gᵢ(x) = p(x|Cᵢ)p(Cᵢ) 계산에 필요한 것은 추정된 분포의 파라미터뿐이라 원 데이터가 있을 필요가 없다.",
        },
      },
      {
        text: "거리 계산을 전혀 하지 않기 때문",
        isCorrect: false,
        explanation: {
          basis: "Σᵢ = σ²I이면 최소거리 분류기, Σᵢ = Σ이면 마할라노비스 거리",
          reason:
            "가우시안 베이즈 분류기도 평균과의 거리를 계산하며, 다만 그 거리가 학습 데이터가 아니라 평균에 대한 것이다.",
        },
      },
      {
        text: "사전확률을 항상 동일하다고 가정하기 때문",
        isCorrect: false,
        explanation: {
          basis: "사전확률이 다르면 결정경계가 이동하는 경우를 별도로 다룸",
          reason:
            "사전확률이 같다는 가정은 판별함수를 단순화할 때 쓰는 조건일 뿐, 학습 데이터 저장 여부와는 관계가 없다.",
        },
      },
    ],
  },
];

export default function Lecture2Quiz() {
  const [picked, setPicked] = useState<Record<number, number>>({});

  const answeredCount = Object.keys(picked).length;
  const correctCount = Object.entries(picked).filter(
    ([qi, ci]) => quizzes[Number(qi)].answer === ci
  ).length;

  return (
    <section>
      <SectionTitle
        title="확인 문제"
        subtitle="정리하기의 연습문제 6문항과 변형 문항 7문항"
      />

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950">
        <span className="text-sm">
          진행 <span className="font-bold">{answeredCount}</span> / {quizzes.length}
        </span>
        <span className="text-sm">
          정답 <span className="font-bold text-violet-600 dark:text-violet-400">{correctCount}</span>
        </span>
        <button
          onClick={() => setPicked({})}
          className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-white dark:hover:bg-gray-800"
        >
          <RotateCcw size={14} />
          다시 풀기
        </button>
      </div>

      <div className="space-y-4">
        {quizzes.map((quiz, qi) => {
          const chosen = picked[qi];
          const answered = chosen !== undefined;
          return (
            <div
              key={qi}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    quiz.source === "공식 연습문제"
                      ? "bg-violet-500 text-white"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                  }`}
                >
                  {quiz.source}
                </span>
                <span className="text-[11px] text-gray-400">Q{qi + 1}</span>
              </div>
              <p className="mb-3 font-medium">{quiz.q}</p>

              <div className="space-y-2">
                {quiz.choices.map((choice, ci) => {
                  const isPicked = chosen === ci;
                  const reveal = answered;
                  return (
                    <button
                      key={ci}
                      onClick={() => !answered && setPicked((p) => ({ ...p, [qi]: ci }))}
                      disabled={answered}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                        reveal && choice.isCorrect
                          ? "border-violet-400 bg-violet-50 dark:border-violet-600 dark:bg-violet-950"
                          : reveal && isPicked
                            ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950"
                            : "border-gray-200 hover:border-violet-300 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 text-xs font-bold text-gray-400">
                          {ci + 1}
                        </span>
                        <span className="flex-1">{choice.text}</span>
                        {reveal &&
                          (choice.isCorrect ? (
                            <CheckCircle size={16} className="mt-0.5 shrink-0 text-violet-500" />
                          ) : isPicked ? (
                            <XCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                          ) : null)}
                      </div>
                      {reveal && (
                        <div className="mt-2 border-t border-gray-100 pt-2 text-xs dark:border-gray-800">
                          <p className="text-gray-500">
                            <span className="font-medium text-violet-600 dark:text-violet-400">
                              근거{" "}
                            </span>
                            {choice.explanation.basis}
                          </p>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            {choice.explanation.reason}
                          </p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-800"
                  >
                    <p>
                      <span className="font-bold text-violet-600 dark:text-violet-400">정답 </span>
                      {quiz.answer + 1}번
                    </p>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      <span className="font-medium">출처 </span>
                      {quiz.basis}
                    </p>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      <span className="font-medium">출제 포인트 </span>
                      {quiz.examSkill}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
