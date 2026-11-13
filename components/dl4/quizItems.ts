import type { QuizItem } from "@/components/dlShared/Quiz";

/**
 * 4강 복습 퀴즈.
 * 공식 연습문제는 문항·보기·정답·해설을 원문 그대로 옮겼고,
 * 변형 문제는 강의록에 적힌 수식·값으로 답이 하나만 나오도록 만들었다.
 */
export const QUIZZES: QuizItem[] = [
  {
    q: "다음 중 경사 하강법에 대한 설명으로 옳은 것은?",
    examSkill: "경사 하강법의 기본 성질",
    source: "공식 연습문제",
    answer: 0,
    basis:
      "경사 하강법은 목적함수 경사의 음의 방향으로 파라미터를 업데이트하는 과정을 반복하는데, 만일 목적함수가 볼록함수가 아니라면 지역 최소점, 안장점 등에 의해 최적해를 찾지 못할 가능성이 있다. 학습률은 너무 큰 경우 파라미터가 과도하게 변화하여 해의 탐색에 실패하게 되고, 너무 작은 경우 학습의 진행이 너무 느리거나 진행을 멈출 수 있다.",
    refs: {
      slides: "1. 경사 하강법의 개념 — 경사 하강법의 문제점",
      lecture: "볼록함수가 아니면 편미분이 0인 자리가 최적해가 아닐 수 있다고 강조",
    },
    choices: [
      {
        text: "목적함수가 볼록함수가 아닌 경우 경사 하강법은 최적화에 실패할 수 있다.",
        isCorrect: true,
        explanation: {
          basis: "공식 해설",
          reason:
            "목적함수가 볼록함수가 아니라면 지역 최소점, 안장점 등에 의해 최적해를 찾지 못할 가능성이 있다.",
        },
      },
      {
        text: "경사 하강법을 진행하는 도중 안장점(saddle point)에 도달하면 최적해를 찾은 것이다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 — 경사 하강법의 문제점",
          reason:
            "안장점은 모든 파라미터에 대한 편미분이 0이지만 전역 최소치에 해당되지 않는 자리다. 더 이상 움직이지 못할 뿐 최적해가 아니다.",
        },
      },
      {
        text: "학습률은 큰 값을 사용하여 최적해에 빠르게 접근하게 하는 것이 좋다.",
        isCorrect: false,
        explanation: {
          basis: "공식 해설",
          reason:
            "학습률은 너무 큰 경우 파라미터가 과도하게 변화하여 해의 탐색에 실패하게 되고, 너무 작은 경우 학습의 진행이 너무 느리거나 진행을 멈출 수 있다.",
        },
      },
      {
        text: "목적함수 경사의 양의 방향으로 파라미터를 변화시킨다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 — x(t + 1) = x(t) − η∇J(x(t))",
          reason:
            "식에 −η가 붙어 있듯, 경사의 음의 방향으로 이동한다. 양의 방향은 목적함수가 커지는 쪽이다.",
        },
      },
    ],
  },
  {
    q: "다음 중 경사 하강법의 적용 방법에 대한 설명으로 옳은 것은? 단, 학습표본은 1000개가 있다.",
    examSkill: "배치 · 확률적 · 미니배치의 구분과 업데이트 횟수 계산",
    source: "공식 연습문제",
    answer: 1,
    basis:
      "배치 경사 하강법은 전체 학습표본에 대해 구한 손실함수 경사의 평균을 이용하여 파라미터를 업데이트한다. 미니배치 SGD는 전체 학습표본 집합을 정해진 크기의 부분집합으로 분할하여 각 부분집합 단위로 손실함수 경사의 평균을 구하여 파라미터를 업데이트한다. 이 문제의 경우 미니배치 크기가 20이라면 미니배치의 수는 50개이며 1회의 에폭에 파라미터를 50번 업데이트한다. 단순한 확률적 경사 하강법은 매 표본마다 손실함수의 경사를 구하므로 경사의 방향이 불규칙한 반면, 배치 경사 하강법은 모든 학습표본의 손실함수 경사를 평균을 파라미터 업데이트를 위한 경사로 사용하므로 파라미터 변화의 방향이 비교적 일정하다. 미니배치 방식은 훈련을 위한 행렬 연산을 최적화함으로써 계산 성능을 높일 수 있으며, 미니배치의 크기가 작은 것이 비해 큰 것이 이러한 성능 향상에 유리하다.",
    refs: {
      slides: "2. 경사 하강법의 구현 — 미니배치 확률적 경사 하강법(mini-batch SGD)",
    },
    choices: [
      {
        text: "배치 경사 하강법은 개별 학습표본 단위로 파라미터 업데이트를 한다.",
        isCorrect: false,
        explanation: {
          basis: "공식 해설",
          reason:
            "배치 경사 하강법은 전체 학습표본에 대해 구한 손실함수 경사의 평균을 이용하여 파라미터를 업데이트한다. 개별 표본 단위는 확률적 경사 하강법이다.",
        },
      },
      {
        text: "20개의 표본 단위로 미니배치를 구성할 경우 10회의 에폭이 진행되었다면 파라미터는 500번 업데이트된다.",
        isCorrect: true,
        explanation: {
          basis: "공식 해설",
          reason:
            "미니배치 크기가 20이라면 미니배치의 수는 50개이며 1회의 에폭에 파라미터를 50번 업데이트한다. 10에폭이면 500번이다.",
        },
      },
      {
        text: "배치 경사 하강법은 확률적 경사 하강법에 비해 파라미터의 변화 방향이 불규칙하다.",
        isCorrect: false,
        explanation: {
          basis: "공식 해설",
          reason:
            "배치 경사 하강법은 모든 학습표본의 손실함수 경사의 평균을 사용하므로 파라미터 변화의 방향이 비교적 일정하다. 불규칙한 쪽은 확률적 경사 하강법이다.",
        },
      },
      {
        text: "미니배치의 크기가 작을수록 계산 성능은 높아진다.",
        isCorrect: false,
        explanation: {
          basis: "공식 해설",
          reason:
            "미니배치 방식은 행렬 연산을 최적화함으로써 계산 성능을 높이며, 미니배치의 크기가 작은 것에 비해 큰 것이 이러한 성능 향상에 유리하다.",
        },
      },
    ],
  },
  {
    q: "다음 중 심층망의 학습에서 경사 소멸 문제를 개선하기 위해 사용할 수 있는 방법은?",
    examSkill: "경사 소멸 문제의 원인과 개선 방법",
    source: "공식 연습문제",
    answer: 3,
    basis:
      "경사 소멸 문제는 손실함수의 경사를 출력층으로부터 입력층 방향으로 역전파하는 과정에서 0에 근접하여 하위층에서 파라미터 변화가 일어나지 못하는 문제이다. 특히 시그모이드 활성함수의 경우 입력의 크기가 커지면 미분이 매우 작은 값을 갖게 되어 경사 소멸의 원인이 되며, 이를 ReLU 또는 ReLU의 변형에 해당되는 활성함수로 변경하여 문제를 개선할 수 있다.",
    refs: {
      slides: "1. 불안정한 경사(unstable gradient) 문제 — 경사 소멸 문제의 개선 방법",
      lecture: "시그모이드 미분의 최댓값 0.25를 계속 곱하면 아래층으로 갈수록 작아진다고 계산해 보임",
    },
    choices: [
      {
        text: "단위 계단 함수를 활성함수로 사용한다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 — 경사 소멸 문제의 개선 방법",
          reason:
            "개선 방법으로 제시된 것은 ReLU 유형의 활성함수, 스킵 연결, 가중치의 적절한 초기화, 배치 정규화다. 단위 계단 함수는 여기에 해당하지 않는다.",
        },
      },
      {
        text: "활성함수는 시그모이드를 사용하고 모든 가중치를 0으로 초기화한다.",
        isCorrect: false,
        explanation: {
          basis: "공식 해설",
          reason:
            "시그모이드는 입력의 크기가 커지면 미분이 매우 작아져 경사 소멸의 원인이 된다. 가중치를 0으로 두는 것도 적절한 초기화가 아니다.",
        },
      },
      {
        text: "심층망의 층 수를 더 늘린다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 — 경사 소멸(vanishing gradient) 문제",
          reason:
            "층이 깊어질수록 역전파에서 곱해지는 미분의 개수가 늘어 경사가 더 작아진다. 문제를 키우는 쪽이다.",
        },
      },
      {
        text: "시그모이드를 활성함수로 사용하는 대신 ReLU나 그 변형 함수를 사용한다.",
        isCorrect: true,
        explanation: {
          basis: "공식 해설",
          reason:
            "시그모이드는 입력의 크기가 커지면 미분이 매우 작은 값을 가져 경사 소멸의 원인이 되며, ReLU 또는 그 변형에 해당되는 활성함수로 변경하여 문제를 개선할 수 있다.",
        },
      },
    ],
  },
  {
    q: "다음과 같이 정의된 모델에서 Dense층의 가중치 초기화에 대한 설명으로 옳은 것은?",
    intro:
      "from tensorflow import keras\nfrom tensorflow.keras import layers\nseq_model = keras.Sequential([\n    layers.InputLayer(input_shape=(8,)),\n    layers.Dense(2, activation='relu', kernel_initializer='he_normal')\n])",
    examSkill: "He 초기화 식에 fan_in을 대입해 값 구하기",
    source: "공식 연습문제",
    answer: 2,
    basis:
      "커널 초기화기를 ‘he_normal’로 지정하였으므로 Kaiming He가 제안한 방식 중 평균이 0, 표준편차가 (2 / fan_in)0.5인 정규분포의 랜덤값으로 초기화한다. 이전 층이 8개의 입력을 받아 전달하므로 fan_in은 8이다. 표준편차는 0.5이다.",
    refs: {
      slides: "3. He 초기화 방법 — tf.keras.initializers.HeNormal",
    },
    choices: [
      {
        text: "모든 가중치는 0으로 초기화한다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 — HeNormal",
          reason: "he_normal은 평균이 0, 표준편차가 σ인 정규분포의 랜덤값으로 초기화한다. 모두 0이 아니다.",
        },
      },
      {
        text: "모든 가중치는 1로 초기화한다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 — HeNormal",
          reason: "정해진 분포에서 뽑은 랜덤값으로 초기화하므로 같은 값이 되지 않는다.",
        },
      },
      {
        text: "평균이 0, 표준편차가 0.5인 정규분포의 랜덤값으로 초기화한다.",
        isCorrect: true,
        explanation: {
          basis: "공식 해설",
          reason:
            "he_normal이므로 σ = √(2 / fan_in)이고, 이전 층이 8개의 입력을 전달하므로 fan_in은 8이다. √(2/8) = 0.5.",
        },
      },
      {
        text: "[-2, 2] 범위의 랜덤값으로 초기화한다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 — HeUniform / HeNormal",
          reason:
            "[-limit, limit] 범위의 균등분포는 he_uniform이고, 그때도 limit = √(6/8) ≈ 0.87이지 2가 아니다.",
        },
      },
    ],
  },
  {
    q: "x(1)은 얼마인가?",
    intro:
      "목적함수 J(x) = x₁² + 2x₂² − x₁x₂, x의 초깃값 x(0) = [−5 4]ᵀ, 학습률 η = 0.1로 경사 하강법을 적용한다. (∇J(x) = [2x₁ − x₂  4x₂ − x₁]ᵀ)",
    examSkill: "업데이트 식에 경사를 대입해 다음 위치 구하기",
    source: "변형",
    answer: 1,
    basis:
      "∇J(x(0)) = [2(−5) − 4, 4(4) − (−5)]ᵀ = [−14 21]ᵀ. x(1) = x(0) − η∇J(x(0)) = [−5 4]ᵀ − 0.1[−14 21]ᵀ = [−3.6 1.9]ᵀ.",
    refs: {
      slides: "1. 경사 하강법의 개념 — 경사 하강법을 이용한 볼록함수의 최적화 (예)",
    },
    choices: [
      {
        text: "[−14 21]ᵀ",
        isCorrect: false,
        explanation: {
          basis: "강의록 — 예제 계산",
          reason: "이것은 x(0)에서의 경사 ∇J(x(0))이다. 여기에 −η를 곱해 현재 위치에 더해야 x(1)이 된다.",
        },
      },
      {
        text: "[−3.6 1.9]ᵀ",
        isCorrect: true,
        explanation: {
          basis: "강의록 — 예제 계산",
          reason:
            "−5 − 0.1(−14) = −3.6, 4 − 0.1(21) = 1.9. 강의록에 적힌 x(1)과 같다.",
        },
      },
      {
        text: "[−6.4 6.1]ᵀ",
        isCorrect: false,
        explanation: {
          basis: "강의록 — x(t + 1) = x(t) − η∇J(x(t))",
          reason:
            "경사를 빼지 않고 더한 결과다. 경사의 양의 방향으로 가면 목적함수가 오히려 커진다.",
        },
      },
      {
        text: "[−5 4]ᵀ",
        isCorrect: false,
        explanation: {
          basis: "강의록 — 예제 계산",
          reason: "초깃값 x(0) 그대로다. 경사가 0이 아니므로 위치가 바뀌어야 한다.",
        },
      },
    ],
  },
  {
    q: "epoch = 500인 시점의 학습률 η는?",
    intro:
      "지수 함수 감쇠 스케줄러를 initial_learning_rate = 0.1, decay_steps = 500, decay_rate = 0.5, staircase = False로 설정하였다. (η = 0.1 · 0.5^(epoch/500))",
    examSkill: "동적 학습률 스케줄러 식에 에폭을 대입하기",
    source: "변형",
    answer: 2,
    basis: "η = 0.1 · 0.5^(500/500) = 0.1 × 0.5 = 0.05.",
    refs: {
      slides: "3. 동적 학습률 — 지수 함수 감쇠 스케줄러",
    },
    choices: [
      {
        text: "0.1",
        isCorrect: false,
        explanation: {
          basis: "강의록 — ExponentialDecay",
          reason: "epoch = 0일 때의 값이다. 지수가 0이라 0.5⁰ = 1이 되는 경우다.",
        },
      },
      {
        text: "0.01",
        isCorrect: false,
        explanation: {
          basis: "강의록 — PolynomialDecay",
          reason: "0.01은 다항식 감쇠 스케줄러의 end_learning_rate 값이고, 이 문항의 식과는 관계가 없다.",
        },
      },
      {
        text: "0.05",
        isCorrect: true,
        explanation: {
          basis: "강의록 — ExponentialDecay",
          reason: "500/500 = 1이므로 0.5¹ = 0.5, 따라서 η = 0.1 × 0.5 = 0.05.",
        },
      },
      {
        text: "0.025",
        isCorrect: false,
        explanation: {
          basis: "강의록 — ExponentialDecay",
          reason: "0.025는 epoch = 1000일 때의 값이다. 0.1 × 0.5² = 0.025.",
        },
      },
    ],
  },
  {
    q: "다음 중 Glorot 초기화와 He 초기화의 차이로 옳은 것은?",
    examSkill: "두 초기화 방법의 기준값과 적합한 활성함수 구분",
    source: "변형",
    answer: 0,
    basis:
      "Glorot는 팬-인과 팬-아웃에 따라 결정되는 범위를 쓰고(sigmoid 유형), He는 팬-인을 기준으로 정해지는 범위를 쓴다(ReLU 유형). 두 방법 모두 균등분포형과 정규분포형이 함께 제공된다.",
    refs: {
      slides: "2. Glorot 초기화 방법 / 3. He 초기화 방법",
      lecture: "Glorot는 팬-인과 팬-아웃을 모두 고려하고 He는 팬-인만 고려한다고 대비해 설명",
    },
    choices: [
      {
        text: "He 초기화는 팬-인만을 기준으로 범위를 정한다.",
        isCorrect: true,
        explanation: {
          basis: "강의록 — He 초기화 방법",
          reason:
            "He는 limit = √(6 / fan_in), σ = √(2 / fan_in)으로 팬-인만 쓴다. Glorot는 분모가 fan_in + fan_out이다.",
        },
      },
      {
        text: "Glorot 초기화는 균등분포만 제공하고 정규분포 방식은 없다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 — Glorot 초기화 방법",
          reason:
            "Keras의 initializers에 GlorotUniform과 GlorotNormal 두 가지 유형이 모두 제공된다.",
        },
      },
      {
        text: "He 초기화는 sigmoid 유형의 활성함수에 적합하도록 제안되었다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 — He 초기화 방법",
          reason:
            "He는 ReLU 유형의 활성함수를 사용하는 신경망에 적합한 초기화 방법이다. sigmoid 유형은 Glorot 쪽이다.",
        },
      },
      {
        text: "두 방법 모두 모든 가중치를 같은 값으로 초기화한다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 — Glorot / He 초기화 방법",
          reason:
            "두 방법 모두 정해진 범위나 분포에서 뽑은 랜덤 값으로 초기화한다. 같은 값으로 두지 않는다.",
        },
      },
    ],
  },
  {
    q: "다음 중 과적합 문제를 개선하는 방법으로 옳은 것은?",
    examSkill: "과적합의 뜻과 개선 방법 구분",
    source: "변형",
    answer: 0,
    basis:
      "과적합은 특정 학습 데이터 집합에 지나치게 맞추어져 학습되는 현상으로 일반화 오류가 발생한다. 개선 방법으로 드롭아웃, 규제, 데이터 증강 등이 제시된다.",
    refs: {
      slides: "2. 과적합(overfitting) 문제 — 과적합이란?",
      lecture: "드롭아웃을 모델 안의 유닛을 랜덤하게 잠시 꺼 버리는 방법이라고 설명",
    },
    choices: [
      {
        text: "드롭아웃으로 모델 안의 유닛 일부를 랜덤하게 꺼 가며 학습한다.",
        isCorrect: true,
        explanation: {
          basis: "강의록 — 과적합 문제의 개선 방법",
          reason: "개선 방법으로 드롭아웃, 규제, 데이터 증강 등이 제시되어 있다.",
        },
      },
      {
        text: "학습률을 크게 높여 학습 표본에 더 빨리 맞춘다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 — 경사 하강법의 개념 / 경사 폭발 문제",
          reason:
            "학습률을 지나치게 높이면 해의 탐색에 실패하거나 경사 폭발의 원인이 된다. 과적합과도 반대 방향이다.",
        },
      },
      {
        text: "학습 표본의 수를 줄여 모델이 외우기 쉽게 한다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 — 과적합 문제의 개선 방법",
          reason:
            "개선 방법에는 오히려 가공을 통해 표본을 늘리는 데이터 증강이 들어 있다. 표본을 줄이면 특정 데이터에 더 맞춰지게 된다.",
        },
      },
      {
        text: "모든 가중치를 0으로 초기화한다.",
        isCorrect: false,
        explanation: {
          basis: "강의록 — 가중치의 초기화",
          reason: "가중치 초기화는 불안정한 경사 문제와 관련된 기법이고, 0으로 두는 방식은 제시되지 않는다.",
        },
      },
    ],
  },
];
