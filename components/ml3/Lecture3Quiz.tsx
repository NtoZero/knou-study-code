"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { CheckCircle, RotateCcw, XCircle } from "lucide-react";

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

const QUIZZES: Quiz[] = [
  /* ------------------------- 공식 연습문제 ------------------------- */
  {
    q: "회귀의 대표적인 응용 분야로 적합한 것은?",
    answer: 2,
    source: "공식 연습문제",
    basis:
      "회귀는 입력과 출력의 매핑 함수를 찾는 문제이며, 주가·환율 예측 같은 시계열 예측이 대표적인 응용이다.",
    examSkill: "회귀의 정의와 응용 분야를 구분하는 능력",
    choices: [
      {
        text: "저차원 특징 추출",
        isCorrect: false,
        explanation: {
          basis: "회귀의 출력은 연속적인 실수값이며 목표 출력값이 함께 주어진다.",
          reason:
            "저차원 특징 추출은 데이터를 어떻게 표현할지를 다루는 차원 축소 작업으로, 예측할 목표 출력값 자체가 없다. 입력과 출력의 매핑 관계를 찾는 회귀와는 목적이 다르다.",
        },
      },
      {
        text: "데이터 시각화",
        isCorrect: false,
        explanation: {
          basis: "회귀는 y = f(x; θ)라는 예측 함수를 만드는 것이 목표다.",
          reason:
            "데이터 시각화는 이미 가진 데이터를 사람이 보기 쉽게 표현하는 작업이다. 새로운 입력에 대한 값을 예측하는 함수를 만들어 내지 않으므로 회귀의 응용이라 할 수 없다.",
        },
      },
      {
        text: "주가 예측과 같은 시계열 예측",
        isCorrect: true,
        explanation: {
          basis: "회귀가 가장 대표적으로 적용되는 문제는 시계열 예측이다.",
          reason:
            "시간에 따라 변하는 과거 데이터를 분석해 앞으로 주어질 값을 예측하는 문제로, 주가 예측·환율 예측·시장 예측·판매 예측이 모두 여기에 해당한다. 출력이 연속적인 실수값이라는 회귀의 조건에도 맞는다.",
        },
      },
      {
        text: "특정 부류로 나누기",
        isCorrect: false,
        explanation: {
          basis: "출력의 유형에 따라 지도학습은 분류와 회귀로 나뉜다.",
          reason:
            "특정 부류, 즉 클래스로 나누는 것은 목표 출력값이 이산적인 클래스 레이블인 분류 문제다. 회귀의 출력은 연속적인 실수값이므로 이 선택지는 분류를 가리킨다.",
        },
      },
    ],
  },
  {
    q: "기저질환 유무·성별·나이 등을 입력받아 특정 질병 위험도를 평가하는 문제에 가장 적합한 방법은?",
    answer: 0,
    source: "공식 연습문제",
    basis:
      "여러 입력에서 연속적인 위험도 출력을 예측하는 것은 회귀 문제이며, 선형회귀·비선형회귀·SVM·신경망 등을 적용할 수 있다.",
    examSkill: "문제 상황을 보고 회귀 문제임을 판별하는 능력",
    choices: [
      {
        text: "선형회귀",
        isCorrect: true,
        explanation: {
          basis: "입력이 여러 개의 값으로 구성된 경우 다변량 선형회귀를 적용한다.",
          reason:
            "기저질환 유무·성별·나이는 여러 개의 입력 변수이고 질병 위험도는 연속적인 출력값이므로, 입력과 출력 사이의 관계를 찾는 회귀 문제다. 입력이 n차원 벡터인 다변량 선형회귀로 초평면을 찾으면 된다.",
        },
      },
      {
        text: "K-means",
        isCorrect: false,
        explanation: {
          basis: "목표 출력값이 있으면 지도학습, 없으면 비지도학습이다.",
          reason:
            "K-means는 목표 출력값 없이 입력만으로 데이터를 군집으로 나누는 비지도학습 방법이다. 이 문제에는 위험도라는 목표 출력값이 주어져 있으므로 군집화를 쓸 상황이 아니다.",
        },
      },
      {
        text: "K-NN",
        isCorrect: false,
        explanation: {
          basis: "분류의 출력은 이산적인 클래스 레이블이다.",
          reason:
            "K-최근접이웃은 가까운 학습 데이터들의 클래스 레이블을 보고 소속 클래스를 정하는 분류기다. 연속적인 실수값인 위험도를 매핑 함수로 예측하는 용도와는 출력 형태가 다르다.",
        },
      },
      {
        text: "t-SNE",
        isCorrect: false,
        explanation: {
          basis: "회귀는 새로운 입력에 대한 출력을 예측하는 함수를 만든다.",
          reason:
            "t-SNE는 고차원 데이터를 저차원으로 사상해 시각화하는 특징추출·차원축소 방법이다. 입력으로부터 위험도라는 출력을 계산해 주는 함수를 만들어 내지 않는다.",
        },
      },
    ],
  },
  {
    q: "선형회귀에 대한 설명으로 적절한 것은?",
    answer: 1,
    source: "공식 연습문제",
    basis:
      "선형회귀는 직선 형태의 함수를 찾고 최소제곱법으로 학습 데이터의 잔차 제곱합을 최소화한다. 다변량 입력도 처리하며, 데이터에 어느 정도 잡음이 있다고 가정한다.",
    examSkill: "선형회귀의 모델 형태·목적함수·가정을 정확히 구분하는 능력",
    choices: [
      {
        text: "입력과 출력의 관계를 나타내는 곡선 함수를 찾는다.",
        isCorrect: false,
        explanation: {
          basis: "선형회귀는 y = w₁x + w₀ + e 형태의 선형함수를 찾는다.",
          reason:
            "선형회귀가 찾는 것은 기울기 w₁과 절편 w₀로 결정되는 1차식, 즉 직선이다. 곡선 함수를 찾는 것은 비선형회귀이며, 이 선택지는 선형회귀가 아닌 다른 방법을 설명하고 있다.",
        },
      },
      {
        text: "모든 학습 데이터에 대해 잔차를 최소로 하는 것이 목적이다.",
        isCorrect: true,
        explanation: {
          basis: "좋은 선형회귀 모델은 모든 데이터에 대한 잔차가 가능한 작은 모델이다.",
          reason:
            "잔차 eᵢ = yᵢ − (w₁xᵢ + w₀)를 모든 학습 데이터에 대해 작게 만드는 것이 목적이며, 구체적으로는 최소제곱법으로 잔차의 제곱의 합 E(w₁, w₀) = Σeᵢ²를 최소화한다.",
        },
      },
      {
        text: "입력이 다차원 벡터이면 적용할 수 없다.",
        isCorrect: false,
        explanation: {
          basis: "다변량 선형회귀는 n차원 입력 벡터를 다룬다.",
          reason:
            "입력이 여러 개의 값으로 구성되면 다변량 선형회귀로 확장하여 n차원 공간의 초평면을 찾고, 최적 파라미터는 w = (XᵀX)⁻¹Xᵀy로 계산한다. 다차원 입력이라서 적용할 수 없다는 서술은 사실과 반대다.",
        },
      },
      {
        text: "학습 데이터는 잡음이 없다고 가정한다.",
        isCorrect: false,
        explanation: {
          basis: "데이터는 어느 정도의 잡음을 포함한다고 가정하므로 어느 정도의 오차는 허용한다.",
          reason:
            "잡음이 없다고 가정한다면 모든 점을 정확히 지나는 보간법을 써야 하고 제곱 오차가 0이 되어야 한다. 선형회귀는 오차를 허용하는 대신 데이터의 전체적인 경향을 보여주는 직선을 찾는다.",
        },
      },
    ],
  },
  {
    q: "선형회귀의 종속변수를 범주형으로 확장하여 분류에 사용할 수 있는 방법은?",
    answer: 3,
    source: "공식 연습문제",
    basis: "로지스틱 회귀는 선형회귀의 종속변수를 범주형으로 제한해 분류 문제에 적용하는 방법이다.",
    examSkill: "로지스틱 회귀의 정의를 다른 기법과 구분하는 능력",
    choices: [
      {
        text: "선형화",
        isCorrect: false,
        explanation: {
          basis: "종속변수(출력)를 범주형으로 바꾸는 것이 문제의 핵심 조건이다.",
          reason:
            "선형화는 복잡한 관계를 선형 형태로 근사해 다루는 일반적인 처리 방식을 가리키는 말일 뿐, 출력을 클래스 레이블로 바꾸어 분류에 쓰게 만드는 방법이 아니다.",
        },
      },
      {
        text: "랜덤 포레스트",
        isCorrect: false,
        explanation: {
          basis: "질문은 선형회귀를 확장한 방법을 묻고 있다.",
          reason:
            "랜덤 포레스트는 여러 개의 결정 트리를 결합하는 앙상블 모델로, 분류에 쓰이기는 하지만 선형회귀의 종속변수를 범주형으로 확장한 것이 아니다. 출발점이 되는 모델 자체가 다르다.",
        },
      },
      {
        text: "커널법",
        isCorrect: false,
        explanation: {
          basis: "범주형 확장은 출력 쪽을 바꾸는 것이다.",
          reason:
            "커널법은 입력 데이터를 고차원 특징 공간으로 사상해 비선형 문제를 다루는 기법으로, 바꾸는 대상이 입력 쪽이다. 출력을 확률값을 거쳐 클래스 레이블로 만드는 방법은 아니다.",
        },
      },
      {
        text: "로지스틱 회귀",
        isCorrect: true,
        explanation: {
          basis: "선형회귀분석의 종속변수(출력)를 범주형으로 확장한 것이 로지스틱 회귀다.",
          reason:
            "출력이 실수값이 아니라 클래스 레이블이 되므로 분류 문제에 적용할 수 있고, 로지스틱 함수로 출력값을 0과 1 사이의 확률값으로 변환해 각 클래스에 속할 확률을 예측한다.",
        },
      },
    ],
  },
  {
    q: "로지스틱 회귀와 관련된 설명으로 적합하지 못한 것은?",
    answer: 1,
    source: "공식 연습문제",
    basis: "오즈비는 전체 데이터에서의 클래스 비율이 아니라 입력이 각 클래스에 속할 확률의 비율이다.",
    examSkill: "오즈비·로짓·최대우도 추정 개념을 서로 혼동하지 않는 능력",
    choices: [
      {
        text: "로지스틱 함수의 출력은 항상 (0,1) 범위다.",
        isCorrect: false,
        explanation: {
          basis: "φ(x) = 1/(1 + e⁻ˣ)는 x ∈ (−∞, ∞)를 (0, 1)로 매핑한다.",
          reason:
            "이는 옳은 설명이므로 '적합하지 못한 것'을 고르는 이 문제의 답이 될 수 없다. 출력이 0과 1 사이이기 때문에 사후확률 P(y = 1|x)로 간주할 수 있는 것이다.",
        },
      },
      {
        text: "오즈비는 전체 데이터 중 각 클래스가 차지하는 비율이다.",
        isCorrect: true,
        explanation: {
          basis: "odds = P(y = 1|x) / (1 − P(y = 1|x)) = e^(mx+b)",
          reason:
            "오즈비는 전체 데이터 중 각 클래스가 차지하는 비율이 아니라, 특정 입력 x가 각 클래스에 속할 확률의 비율이다. 분자는 x가 C2에 속할 확률, 분모는 C1에 속할 확률이므로 데이터 전체의 구성비와는 무관하다. 따라서 이 설명이 적합하지 못하다.",
        },
      },
      {
        text: "매개변수는 최대우도 추정법으로 추정할 수 있다.",
        isCorrect: false,
        explanation: {
          basis: "로그 우도 l(m, b)를 목적함수로 하여 ∂l/∂m = 0, ∂l/∂b = 0을 푼다.",
          reason:
            "이는 옳은 설명이므로 답이 아니다. 다만 l(m, b)가 복잡한 비선형 함수여서 한 번에 풀리지 않고 수치적 최적화 방법으로 반복적 추정을 한다는 점이 함께 기억되어야 한다.",
        },
      },
      {
        text: "로짓 함수는 오즈비에 로그를 취한 함수다.",
        isCorrect: false,
        explanation: {
          basis: "logit(P) = log(P(y = 1|x) / (1 − P(y = 1|x))) = mx + b",
          reason:
            "이는 옳은 설명이므로 답이 아니다. 오즈비는 0부터 무한대까지의 비대칭 범위를 갖는데, 로그를 취하면 P = 0.5를 기준으로 대칭이 되고 값이 그대로 선형함수 mx + b가 된다.",
        },
      },
    ],
  },

  /* ----------------------------- 변형 ----------------------------- */
  {
    q: "데이터 7개에 대해 N = 7, Σxᵢ = 28, Σyᵢ = 24, Σxᵢyᵢ = 119.5, Σxᵢ² = 140 일 때 선형회귀의 기울기 w₁ 값은?",
    answer: 0,
    source: "변형",
    basis: "w₁ = (NΣyᵢxᵢ − Σxᵢ·Σyᵢ) / (NΣxᵢ² − (Σxᵢ)²) = (836.5 − 672) / (980 − 784) = 164.5 / 196",
    examSkill: "최적 매개변수 공식에 값을 대입해 계산하는 능력",
    choices: [
      {
        text: "0.8392857",
        isCorrect: true,
        explanation: {
          basis: "분자 7 × 119.5 − 28 × 24 = 164.5, 분모 7 × 140 − 28² = 196.",
          reason: "164.5를 196으로 나누면 0.8392857이 되며, 이 값이 회귀직선의 기울기 w₁이다.",
        },
      },
      {
        text: "0.0714282",
        isCorrect: false,
        explanation: {
          basis: "w₀ = ȳ − w₁x̄",
          reason:
            "이 값은 기울기가 아니라 절편 w₀이다. ȳ = 3.428571에서 w₁x̄ = 0.8392857 × 4를 뺀 결과이므로, w₁을 먼저 구한 뒤에야 얻어지는 값이다.",
        },
      },
      {
        text: "2.9911",
        isCorrect: false,
        explanation: {
          basis: "E(w₁, w₀) = Σeᵢ²",
          reason:
            "이 값은 매개변수가 아니라 구해진 회귀직선에 대한 잔차의 제곱의 합, 즉 오차함수의 값이다. 모델의 기울기와는 다른 양이다.",
        },
      },
      {
        text: "3.428571",
        isCorrect: false,
        explanation: {
          basis: "ȳ = (1/N)Σyᵢ = 24 / 7",
          reason:
            "이 값은 출력의 평균 ȳ이다. w₀를 구할 때 쓰이는 중간값일 뿐이며 기울기 w₁과는 무관하다.",
        },
      },
    ],
  },
  {
    q: "잔차의 단순 합 Σeᵢ 를 선형회귀의 평가 기준으로 쓸 수 없는 이유로 옳은 것은?",
    answer: 1,
    source: "변형",
    basis:
      "한쪽은 음의 부호로, 다른 쪽은 양의 부호로 같은 크기의 차이를 가지면 더했을 때 상쇄되어 잔차의 합이 0이 된다.",
    examSkill: "잔차 평가 기준의 타당성을 판단하는 능력",
    choices: [
      {
        text: "계산량이 너무 많아 실제로 구할 수 없기 때문",
        isCorrect: false,
        explanation: {
          basis: "Σeᵢ 는 덧셈만으로 구해진다.",
          reason:
            "잔차의 합은 오히려 제곱합보다 계산이 간단하다. 문제는 계산 비용이 아니라 서로 다른 직선을 구별해 주지 못한다는 점이다.",
        },
      },
      {
        text: "부호가 다른 잔차들이 서로 상쇄되어 나쁜 직선도 좋은 직선과 같은 평가를 받기 때문",
        isCorrect: true,
        explanation: {
          basis: "잔차의 제곱의 합은 주어진 데이터 집합에 대해 유일한 직선을 생성한다.",
          reason:
            "위아래로 같은 크기만큼 어긋난 직선은 양의 잔차와 음의 잔차가 더해져 합이 0이 되므로, 실제로 좋은 직선과 구별되지 않는다. 잔차를 제곱하면 부호가 사라져 이런 상쇄가 일어나지 않는다.",
        },
      },
      {
        text: "잔차의 합은 항상 음수가 되기 때문",
        isCorrect: false,
        explanation: {
          basis: "eᵢ = yᵢ − (w₁xᵢ + w₀)는 직선의 위·아래에 따라 부호가 달라진다.",
          reason:
            "잔차의 합은 직선의 위치에 따라 양수도 음수도 0도 될 수 있다. 항상 음수라는 전제 자체가 성립하지 않는다.",
        },
      },
      {
        text: "데이터 개수에 비례해 값이 커지기 때문",
        isCorrect: false,
        explanation: {
          basis: "데이터 개수 의존성은 1/N 항으로 해결하는 별개의 문제다.",
          reason:
            "데이터 개수에 따라 오차가 커지는 것을 막기 위한 장치가 MSE의 1/N 항이다. 이는 잔차의 제곱의 합에도 똑같이 해당하는 이야기이므로, 단순 합만 배제해야 할 이유가 되지 못한다.",
        },
      },
    ],
  },
  {
    q: "다변량 선형회귀에서 오차함수 E(w) = (y − Xw)ᵀ(y − Xw)를 최소화하는 최적 파라미터 w는?",
    answer: 2,
    source: "변형",
    basis: "∂E/∂w = 2Xᵀy − 2XᵀXw = 0 ⇒ XᵀXw = Xᵀy ⇒ 양변에 (XᵀX)⁻¹를 곱하면 w = (XᵀX)⁻¹Xᵀy",
    examSkill: "행렬 형태의 정규방정식과 그 해를 기억하는 능력",
    choices: [
      {
        text: "w = XᵀX y",
        isCorrect: false,
        explanation: {
          basis: "XᵀXw = Xᵀy 에서 좌변의 XᵀX를 없애려면 역행렬을 곱해야 한다.",
          reason:
            "XᵀX를 그대로 곱하면 방정식을 푼 것이 아니라 좌변을 한 번 더 키운 것이 된다. 차원도 맞지 않아 계산 자체가 성립하지 않는다.",
        },
      },
      {
        text: "w = (XXᵀ)⁻¹Xy",
        isCorrect: false,
        explanation: {
          basis: "X는 N × (n+1) 행렬이다.",
          reason:
            "XXᵀ는 N × N 행렬이 되어 (n+1)차원인 w를 만들어 낼 수 없다. 역행렬을 취해야 하는 대상은 (n+1) × (n+1)인 XᵀX다.",
        },
      },
      {
        text: "w = (XᵀX)⁻¹Xᵀy",
        isCorrect: true,
        explanation: {
          basis: "XᵀXw = Xᵀy 의 양변에 (XᵀX)⁻¹를 곱한 결과.",
          reason:
            "차원을 검산하면 ((n+1) × (n+1)) · ((n+1) × 1) = (n+1) × 1 로 w의 shape과 정확히 일치한다. 다변량에서도 매개변수가 주어진 데이터만으로 바로 계산됨을 보여 준다.",
        },
      },
      {
        text: "w = Xᵀ(y − Xw)",
        isCorrect: false,
        explanation: {
          basis: "최적해는 w가 좌변에만 남는 닫힌 형태여야 한다.",
          reason:
            "우변에 w가 다시 등장하므로 해가 아니라 미분 결과를 정리하다 만 식이다. 이 상태로는 값을 직접 계산할 수 없다.",
        },
      },
    ],
  },
  {
    q: "어떤 입력 x에 대해 P(y = 1|x) = 0.8 로 계산되었다. 오즈비와 로짓, 판정 결과를 옳게 짝지은 것은?",
    answer: 0,
    source: "변형",
    basis:
      "odds = 0.8 / 0.2 = 4, logit = log 4 > 0. 사후확률 > 0.5, 오즈비 > 1, 로짓함수 > 0 → x ∈ C2.",
    examSkill: "사후확률·오즈비·로짓의 대응 관계를 계산으로 확인하는 능력",
    choices: [
      {
        text: "오즈비 = 4, 로짓 > 0 → x ∈ C2",
        isCorrect: true,
        explanation: {
          basis: "odds = P/(1 − P) = 0.8/0.2 = 4, logit(P) = log(odds) = mx + b.",
          reason:
            "오즈비가 1보다 크므로 로그를 취한 로짓도 0보다 크고, 세 기준이 모두 C2를 가리킨다. 사후확률 0.8 > 0.5와도 일치한다.",
        },
      },
      {
        text: "오즈비 = 0.25, 로짓 < 0 → x ∈ C1",
        isCorrect: false,
        explanation: {
          basis: "오즈비의 분자는 P(y = 1|x), 분모는 1 − P(y = 1|x)다.",
          reason:
            "0.25는 분자와 분모를 뒤집어 0.2/0.8을 계산한 값이다. 정의대로라면 4가 되어야 하며, 판정도 C1이 아니라 C2가 된다.",
        },
      },
      {
        text: "오즈비 = 0.8, 로짓 = 0 → 결정경계 위",
        isCorrect: false,
        explanation: {
          basis: "결정경계는 logit(P) = mx + b = 0, 즉 P = 0.5인 지점이다.",
          reason:
            "오즈비를 사후확률과 같은 값으로 잘못 본 선택지다. 로짓이 0이 되려면 사후확률이 0.5여야 하는데 여기서는 0.8이므로 경계 위가 아니다.",
        },
      },
      {
        text: "오즈비 = 1.25, 로짓 > 0 → x ∈ C2",
        isCorrect: false,
        explanation: {
          basis: "odds = 0.8 / (1 − 0.8) = 4",
          reason:
            "1.25는 1/0.8을 계산한 값으로 오즈비의 정의와 다르다. 판정 결과 C2는 우연히 맞지만 오즈비 값이 틀렸다.",
        },
      },
    ],
  },
  {
    q: "로지스틱 회귀의 매개변수 m, b를 추정할 때 사용하는 확률분포와 목적함수를 옳게 짝지은 것은?",
    answer: 1,
    source: "변형",
    basis:
      "p(y|x)는 베르누이 분포를 따르며, 데이터 집합 D에 대한 로그 우도 l(m, b)를 목적함수로 삼아 최대우도 추정법으로 추정한다.",
    examSkill: "로지스틱 회귀의 확률 모델과 목적함수를 연결하는 능력",
    choices: [
      {
        text: "가우시안 분포 — 제곱오차",
        isCorrect: false,
        explanation: {
          basis: "yᵢ ∈ {0, 1} 인 이진 출력이다.",
          reason:
            "출력이 0 또는 1이라는 클래스 레이블이므로 연속적인 값을 전제하는 가우시안 분포와 제곱오차를 그대로 쓸 수 없다. 제곱오차는 선형회귀의 목적함수다.",
        },
      },
      {
        text: "베르누이 분포 — 로그 우도",
        isCorrect: true,
        explanation: {
          basis: "p(y|x) = {P(y = 1|x)}^y {1 − P(y = 1|x)}^(1−y)",
          reason:
            "시행 결과가 성공 / 실패 둘 중 하나인 베르누이 분포를 따르며, 데이터 전체에 대한 확률의 곱에 로그를 취한 로그 우도를 새로운 목적함수로 사용한다.",
        },
      },
      {
        text: "이항 분포 — 엔트로피",
        isCorrect: false,
        explanation: {
          basis: "강의에서 지정한 분포는 교재 3장의 베르누이 분포다.",
          reason:
            "이항 분포는 같은 시행을 여러 번 반복했을 때의 성공 횟수에 대한 분포다. 여기서는 데이터 하나마다 결과가 하나씩 관찰되는 경우이므로 베르누이 분포가 맞는다.",
        },
      },
      {
        text: "균등 분포 — 로그 우도",
        isCorrect: false,
        explanation: {
          basis: "P(y = 1|x)는 입력 x에 따라 달라지는 값이다.",
          reason:
            "균등 분포는 모든 결과의 확률이 같다고 보는 분포여서, 입력에 따라 클래스 확률이 달라진다는 로지스틱 회귀의 전제와 맞지 않는다. 목적함수만 맞고 분포가 틀렸다.",
        },
      },
    ],
  },
  {
    q: "테스트 데이터 평가에서 MSE에 제곱근을 씌운 RMSE를 사용하는 이유로 옳은 것은?",
    answer: 1,
    source: "변형",
    basis:
      "제곱을 하면 실제 차이값이 무엇인지 직관적으로 알기 어렵기 때문에, 원래 차이값을 직관적으로 이해하기 위해 제곱근을 사용한다.",
    examSkill: "MSE와 RMSE 각 항의 역할을 구분하는 능력",
    choices: [
      {
        text: "계산 속도를 빠르게 하기 위해",
        isCorrect: false,
        explanation: {
          basis: "RMSE는 MSE를 구한 뒤 제곱근을 한 번 더 취한다.",
          reason:
            "연산이 하나 늘어나므로 계산이 빨라질 수 없다. RMSE의 목적은 속도가 아니라 값의 해석 가능성이다.",
        },
      },
      {
        text: "제곱한 값을 원래 차이값의 스케일로 되돌려 직관적으로 이해하기 위해",
        isCorrect: true,
        explanation: {
          basis: "RMSE = √MSE",
          reason:
            "오차를 제곱하면 단위와 크기가 달라져 실제로 얼마나 빗나갔는지 감이 오지 않는다. 제곱근을 씌우면 목표 출력값과 같은 스케일로 돌아와 예측이 평균적으로 얼마나 틀렸는지 바로 읽을 수 있다.",
        },
      },
      {
        text: "오차를 항상 양수로 만들기 위해",
        isCorrect: false,
        explanation: {
          basis: "부호를 없애는 역할은 이미 제곱 연산이 하고 있다.",
          reason:
            "MSE 단계에서 각 오차를 제곱하므로 그 값은 이미 항상 0 이상이다. 제곱근은 부호 문제를 해결하려고 붙이는 것이 아니다.",
        },
      },
      {
        text: "데이터 개수의 영향을 없애기 위해",
        isCorrect: false,
        explanation: {
          basis: "데이터 개수 의존성을 없애는 것은 1/N_tst 항의 역할이다.",
          reason:
            "데이터 개수에 따라 제곱오차가 너무 커지는 것을 막는 장치는 MSE 안의 1/N_tst이다. 제곱근은 그 다음 단계에서 스케일을 되돌리는 별개의 역할을 한다.",
        },
      },
    ],
  },
  {
    q: "같은 데이터에 보간법과 회귀를 각각 적용했을 때의 비교로 옳은 것은?",
    answer: 2,
    source: "변형",
    basis:
      "보간법은 제곱 오차가 0이지만 매우 복잡한 곡선이 되고, 회귀는 어느 정도의 오차가 존재하지만 데이터의 전체적인 경향을 보여주는 입출력 관계 표현에 적합하다.",
    examSkill: "보간법과 회귀의 목적 차이를 설명하는 능력",
    choices: [
      {
        text: "보간법은 오차가 존재하지만 단순한 곡선을 만든다.",
        isCorrect: false,
        explanation: {
          basis: "보간법은 원래 점들을 모두 지난다.",
          reason:
            "오차와 곡선 복잡도를 모두 반대로 서술했다. 보간법은 제곱 오차가 0인 대신 곡선이 매우 복잡해진다.",
        },
      },
      {
        text: "회귀는 모든 점을 정확히 지나므로 제곱 오차가 0이다.",
        isCorrect: false,
        explanation: {
          basis: "회귀는 어느 정도의 오차가 존재한다.",
          reason:
            "모든 점을 정확히 지나 제곱 오차가 0이 되는 것은 보간법의 성질이다. 회귀는 데이터가 어느 정도의 잡음을 포함한다고 보고 오차를 허용한다.",
        },
      },
      {
        text: "보간법은 제곱 오차가 0이지만 곡선이 복잡하고, 회귀는 오차를 허용하는 대신 전체적인 경향을 보여준다.",
        isCorrect: true,
        explanation: {
          basis: "회귀는 데이터의 경향을 일종의 평균과 같은 값으로 되돌려 준다.",
          reason:
            "두 방법 모두 입력과 출력의 관계를 표현할 수 있지만 목적이 다르다. 알고 싶은 것이 개별 점이 아니라 데이터의 전체적인 경향일 때는 회귀가 적합하다.",
        },
      },
      {
        text: "두 방법 모두 제곱 오차를 0으로 만드는 것을 목표로 한다.",
        isCorrect: false,
        explanation: {
          basis: "회귀의 목표는 오차 0이 아니라 경향의 표현이다.",
          reason:
            "데이터에 잡음이 있다고 가정하는 이상 오차를 0으로 만드는 것은 오히려 잡음까지 따라가는 일이 된다. 회귀는 어느 정도의 오차를 허용하는 것을 전제로 한다.",
        },
      },
    ],
  },
];

export default function Lecture3Quiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(QUIZZES.length).fill(null)
  );

  const choose = (qi: number, ci: number) => {
    setAnswers((prev) => (prev[qi] !== null ? prev : prev.map((v, i) => (i === qi ? ci : v))));
  };

  const reset = () => setAnswers(new Array(QUIZZES.length).fill(null));

  const answered = answers.filter((a) => a !== null).length;
  const correct = answers.filter((a, i) => a !== null && a === QUIZZES[i].answer).length;
  const officialCount = QUIZZES.filter((q) => q.source === "공식 연습문제").length;

  return (
    <section>
      <SectionTitle
        title="07. 확인 문제"
        subtitle={`공식 연습문제 ${officialCount}문항 + 변형 ${QUIZZES.length - officialCount}문항`}
      />

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950">
        <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
          진행 {answered} / {QUIZZES.length} · 정답 {correct}개
        </p>
        <button
          onClick={reset}
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-orange-300 bg-white px-3 py-1.5 text-xs font-medium text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:bg-gray-900 dark:text-orange-300"
        >
          <RotateCcw size={13} /> 다시 풀기
        </button>
      </div>

      <div className="space-y-6">
        {QUIZZES.map((quiz, qi) => {
          const chosen = answers[qi];
          const isAnswered = chosen !== null;
          const isCorrect = chosen === quiz.answer;

          return (
            <div
              key={quiz.q}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  {qi + 1}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    quiz.source === "공식 연습문제"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {quiz.source}
                </span>
                <span className="text-[11px] text-gray-400">{quiz.examSkill}</span>
              </div>

              <p className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-100">{quiz.q}</p>

              <div className="space-y-2">
                {quiz.choices.map((choice, ci) => {
                  let cls =
                    "border-gray-200 bg-gray-50 hover:bg-orange-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-orange-900/20";
                  if (isAnswered) {
                    if (ci === quiz.answer)
                      cls = "border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950";
                    else if (ci === chosen)
                      cls = "border-rose-400 bg-rose-50 dark:border-rose-600 dark:bg-rose-950";
                    else cls = "border-gray-200 bg-gray-50 opacity-55 dark:border-gray-700 dark:bg-gray-800";
                  }
                  return (
                    <button
                      key={choice.text}
                      onClick={() => choose(qi, ci)}
                      disabled={isAnswered}
                      className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${cls}`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="shrink-0 text-xs font-bold text-gray-400">
                          {String.fromCharCode(9312 + ci)}
                        </span>
                        <span className="flex-1 text-gray-700 dark:text-gray-200">{choice.text}</span>
                        {isAnswered && ci === quiz.answer && (
                          <CheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                        )}
                        {isAnswered && ci === chosen && ci !== quiz.answer && (
                          <XCircle size={16} className="mt-0.5 shrink-0 text-rose-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <div
                      className={`rounded-lg p-4 ${
                        isCorrect ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-rose-50 dark:bg-rose-900/20"
                      }`}
                    >
                      <p
                        className={`text-sm font-bold ${
                          isCorrect
                            ? "text-emerald-700 dark:text-emerald-300"
                            : "text-rose-700 dark:text-rose-300"
                        }`}
                      >
                        {isCorrect ? "정답" : "오답"} — 정답은 {quiz.answer + 1}번
                      </p>

                      <div className="mt-3 space-y-3 text-xs">
                        {!isCorrect && (
                          <div className="rounded-lg border border-rose-200 bg-white p-3 dark:border-rose-800 dark:bg-gray-900">
                            <p className="font-semibold text-rose-600 dark:text-rose-400">
                              선택한 보기 — {quiz.choices[chosen].text}
                            </p>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">
                              근거: {quiz.choices[chosen].explanation.basis}
                            </p>
                            <p className="mt-1 text-gray-700 dark:text-gray-200">
                              {quiz.choices[chosen].explanation.reason}
                            </p>
                          </div>
                        )}

                        <div className="rounded-lg border border-emerald-200 bg-white p-3 dark:border-emerald-800 dark:bg-gray-900">
                          <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                            정답 보기 — {quiz.choices[quiz.answer].text}
                          </p>
                          <p className="mt-1 text-gray-500 dark:text-gray-400">
                            근거: {quiz.choices[quiz.answer].explanation.basis}
                          </p>
                          <p className="mt-1 text-gray-700 dark:text-gray-200">
                            {quiz.choices[quiz.answer].explanation.reason}
                          </p>
                        </div>

                        <details className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
                          <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-200">
                            나머지 보기는 왜 아닌가
                          </summary>
                          <ul className="mt-2 space-y-2">
                            {quiz.choices.map((c, ci) =>
                              ci === quiz.answer || ci === chosen ? null : (
                                <li key={c.text} className="border-l-2 border-gray-200 pl-2 dark:border-gray-700">
                                  <p className="font-medium text-gray-600 dark:text-gray-300">{c.text}</p>
                                  <p className="mt-0.5 text-gray-500 dark:text-gray-400">{c.explanation.reason}</p>
                                </li>
                              )
                            )}
                          </ul>
                        </details>

                        <p className="rounded-lg bg-gray-100 p-3 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          <span className="font-semibold">채점 근거 — </span>
                          {quiz.basis}
                        </p>
                      </div>
                    </div>
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
