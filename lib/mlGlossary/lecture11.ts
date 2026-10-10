import type { GlossaryTerm } from "@/lib/mlGlossaryTypes";

/**
 * 11강 딥러닝 (1) — 교재 12.1 딥러닝의 등장, 12.2 학습 성능 향상을 위한 기법,
 * 12.3 합성곱 신경망(CNN)에서 다루는 용어.
 *
 * 정의는 교재·강의록 표현을 보존하되 한 문장으로 읽히게 다듬었다.
 */
export const lecture11Terms: GlossaryTerm[] = [
  /* ─────────── 딥러닝의 등장 ─────────── */
  {
    id: "t-deep-learning",
    term: "딥러닝",
    en: "deep learning",
    category: "개념",
    short: "심층 신경망 기반의 머신러닝 분야.",
    definition:
      "심층 신경망(deep neural network) 기반의 머신러닝 분야. 1980년대 오류 역전파 학습 알고리즘으로 2차 붐을 맞은 신경망은 느린 학습 때문에 2010년 정도까지 침체기를 겪었고, 큰 학습 데이터 집합·GPU를 활용한 컴퓨팅 파워·다양한 학습 기법·CNN과 LSTM 같은 정교한 모델이라는 네 가지 요인으로 그 어려움을 극복하면서 활발히 사용되기 시작하였다.",
    role: "특징추출과 분류를 한꺼번에 학습하는 종단간 학습을 가능하게 해, 사람이 특징을 설계하던 방식을 대체했다.",
    related: ["t-deep-neural-network", "t-shallow-network", "t-end-to-end-learning", "t-cnn"],
    lectures: [11],
    basis: "교재 12.1 · 강의록 MLP에서 심층 신경망으로",
    aliases: ["deep learning", "답러닝"],
  },
  {
    id: "t-deep-neural-network",
    term: "심층 신경망",
    en: "deep neural network",
    category: "개념",
    short: "입력층과 출력층을 제외하고 많은 수의 은닉층을 갖는 다층 퍼셉트론 형태의 신경망.",
    definition:
      "입력층과 출력층을 제외하고 많은 수(심지어 수십 개에서 수백 개)의 은닉층을 갖는 다층 퍼셉트론 형태의 신경망. ‘심층(deep)’은 층이 깊다는 의미이며, 이 용어는 힌턴(Hinton)에 의해 개발된 모델(층의 수가 4~5개에 불과)에서 처음 사용되었다. 은닉층의 개수를 늘려 가중치 개수가 늘어나면 신경망의 복잡도가 높아지고 표현 효율이 향상되어 아무리 복잡한 학습 문제라도 해결할 수 있게 된다.",
    role: "같은 가중치 개수라면 많은 노드를 하나의 은닉층으로 구성하는 것보다 다층으로 깊게 구성하는 쪽이 더 효율적인 표현이 가능하다.",
    distinctions: [
      {
        from: "얕은 신경망",
        how: "전통적인 다층 퍼셉트론은 주로 하나의 은닉층만을 사용한다. 심층 신경망은 그 반대 개념이다.",
      },
    ],
    prereqs: ["pre-matrix-mult"],
    related: ["t-deep-learning", "t-mlp", "t-shallow-network", "t-hidden-layer"],
    lectures: [11],
    basis: "교재 12.1(그림 12-1) · 강의록 MLP에서 심층 신경망으로",
    emphasis:
      "장점은 더 효율적인 표현이 가능하다는 것이고, 단점은 학습의 어려움 — 느린 수렴 속도와 낮은 일반화 성능이다.",
    aliases: ["DNN", "deep neural network"],
  },
  {
    id: "t-shallow-network",
    term: "얕은 신경망",
    en: "shallow network",
    category: "개념",
    short: "심층 신경망과 반대되는 개념으로, 은닉층이 적은 전통적인 신경망.",
    definition:
      "심층 신경망과 반대되는 개념으로 사용하는 용어. 전통적인 MLP처럼 은닉층을 하나만 두는 신경망을 가리킨다. 얕은 신경망을 사용하는 접근 방법에서는 원본 데이터를 입력으로 그대로 사용하면 은닉층 자체를 통한 충분한 특징추출을 할 수 없으므로 낮은 성능을 얻게 된다.",
    role: "따라서 별도의 특징추출 과정을 통해 입력 데이터로부터 특징벡터를 추출하고, 이를 신경망의 입력으로 제공한다.",
    example: "HOG·LBP·PCA 등으로 특징을 뽑은 뒤 MLP나 SVM 같은 간단한 분류기에 넣는 전통적인 얼굴인식 방식.",
    related: ["t-deep-neural-network", "t-end-to-end-learning", "t-feature-extraction", "t-mlp"],
    lectures: [11],
    basis: "교재 12.1(그림 12-2) · 강의록 신경망을 통한 처리 과정에 대한 패러다임의 변화",
    aliases: ["shallow network", "shallow neural network"],
  },
  {
    id: "t-end-to-end-learning",
    term: "종단간 학습",
    en: "end-to-end learning",
    category: "개념",
    short: "특징추출 과정과 특징에 의한 분류 과정을 한꺼번에 학습하는 방식.",
    definition:
      "특징추출 과정과 특징에 의한 분류 과정을 한꺼번에 학습하는 방식. 심층 신경망에서는 분류와 마찬가지로 특징추출도 학습으로 수행할 수 있는데, 수많은 은닉층을 통해 다양한 특징 공간으로의 변환이 충분히 이루어지기 때문에 입력 데이터 자체를 신경망의 입력으로 제공하면 앞 단계의 은닉층을 통해서는 저급 수준의 특징을 추출하고 뒤쪽의 은닉층으로 갈수록 좀 더 추상적이고 고급 수준의 특징을 추출한다.",
    role: "사람이 특징을 설계하던 단계를 학습으로 대체한다. 이것이 신경망을 통한 처리 과정에 일어난 패러다임의 변화다.",
    distinctions: [
      {
        from: "얕은 신경망을 사용한 전통적인 방법",
        how: "전통적인 방법은 특징추출과 분류가 별개의 단계이고 특징을 사람이 정한다. 종단간 학습은 둘을 한 번에 학습한다.",
      },
    ],
    related: ["t-shallow-network", "t-representation-learning", "t-deep-learning"],
    lectures: [11],
    basis: "교재 12.1(그림 12-2) · 강의록 패러다임의 변화",
    aliases: ["end-to-end", "종단간"],
  },

  /* ─────────── 지역 극소 ─────────── */
  {
    id: "t-stochastic-gradient-descent",
    term: "확률적 기울기 강하 학습법",
    en: "stochastic gradient descent",
    category: "알고리즘",
    short: "한 번에 하나의 샘플만 사용해서 학습을 진행하는 방법.",
    definition:
      "한 번에 하나의 샘플만 사용해서 학습을 진행하는 기울기 강하 학습법. 10강에서 본 온라인 학습법과 같은 방식이며, 지역 극소를 피할 수 있는 대안의 하나로 제시된다.",
    role: "샘플마다 오차함수의 모양이 조금씩 다르므로 수정 방향이 흔들리고, 그 흔들림이 얕은 지역 극소를 빠져나오는 데 도움이 된다.",
    distinctions: [
      {
        from: "시뮬레이티드 어닐링",
        how: "어닐링은 학습률을 처음에 크게 두었다가 줄여 가는 방법이고, 확률적 기울기 강하는 한 번에 하나의 샘플만 쓰는 방법이다. 둘 다 지역 극소의 회피 대안이다.",
      },
    ],
    prereqs: ["pre-gradient"],
    related: ["t-local-minimum", "t-simulated-annealing", "t-online-batch-mode", "t-gradient-descent"],
    lectures: [11],
    basis: "교재 12.2.1 · 강의록 (1) 지역 극소 — 회피 대안",
    aliases: ["SGD", "온라인 학습법", "stochastic gradient descent"],
  },

  /* ─────────── 느린 학습 ─────────── */
  {
    id: "t-slow-learning",
    term: "느린 학습",
    en: "slow learning",
    category: "개념",
    short: "신경망의 가장 대표적인 문제. 플라토 문제 또는 기울기 소멸 문제에 기인한다.",
    definition:
      "학습이 매우 느리게 진행되어 비전문가 입장에서는 학습이 안 된다고 여길 수 있을 정도가 되는 신경망의 가장 대표적인 문제. 플라토 문제(plateau problem) 또는 기울기 소멸 문제(gradient vanishing problem)에 기인한다.",
    role: "오류 역전파 학습 알고리즘의 최대 단점으로, 신경망이 2010년 무렵까지 침체기를 겪은 이유다.",
    related: ["t-plateau", "t-vanishing-gradient", "t-relu", "t-momentum", "t-adaptive-learning-rate"],
    lectures: [11],
    basis: "교재 12.2.2 · 강의록 (2) 느린 학습",
    aliases: ["slow learning"],
  },
  {
    id: "t-plateau",
    term: "플라토",
    en: "plateau",
    category: "개념",
    short: "기울기 강하 학습법의 오차함수의 학습곡선에서 평평한 구간.",
    definition:
      "기울기 강하 학습법의 오차함수의 학습곡선(learning curve)에서 평평한 구간. 오차함수에 무수히 많이 존재하는 극대·극소가 아닌 극점(안장점)에 의해 발생하며, 이 구간에서는 오차함수의 기울기 변화가 거의 없을 정도이기 때문에 학습이 매우 느리게 진행된다.",
    distinctions: [
      {
        from: "지역 극소",
        how: "지역 극소에서는 학습이 멈추지만, 플라토에서는 멈춘 것이 아니라 아주 느리게 진행된다.",
      },
    ],
    prereqs: ["pre-gradient"],
    related: ["t-saddle-point", "t-slow-learning", "t-local-minimum", "t-learning-curve"],
    lectures: [11],
    basis: "교재 12.2.2(그림 12-3) · 강의록 (2) 느린 학습 — 플라토 문제",
    aliases: ["plateau", "평평한 구간"],
  },
  {
    id: "t-saddle-point",
    term: "안장점",
    en: "saddle point",
    category: "개념",
    short: "극대·극소가 아닌 극점. 미분값이 0이지만 최소도 최대도 아닌 지점.",
    definition:
      "미분값이 0이면서 극대도 극소도 아닌 극점. 오차함수에는 이런 안장점이 무수히 많이 존재하며, 그 주변이 평평한 구간(플라토)을 만든다.",
    role: "기울기가 0에 가까우므로 수정폭이 거의 사라져 학습이 느려지는 자리를 설명한다.",
    prereqs: ["pre-gradient", "pre-local-global-min"],
    related: ["t-plateau", "t-local-minimum", "t-global-minimum"],
    lectures: [11],
    basis: "교재 12.2.2 · 강의록 (2) 느린 학습 — 안장점",
    aliases: ["saddle point", "saddle"],
  },
  {
    id: "t-vanishing-gradient",
    term: "기울기 소멸 문제",
    en: "gradient vanishing problem",
    category: "개념",
    short: "출력층으로부터의 오차 신호가 입력층으로 내려오면서 점점 약해져 학습이 진행되지 않는 현상.",
    definition:
      "특히 신경망의 층이 많은 경우 출력층으로부터의 오차 신호가 입력층으로 내려오면서 점점 약해져서 학습이 느려지거나 진행되지 않는 현상. 가중치 수정폭은 기울기의 크기에 의존(Δθ ∝ ∂E/∂θ)하는데, 출력층에서 입력층으로 오차 신호가 역전파되면서 1보다 작은 시그모이드 함수의 미분값들이 계속해서 곱해지고, 많은 은닉층을 거치면서 그 곱한 값이 점점 작아져 결국 가중치의 수정이 제대로 이루어지지 못하게 된다.",
    formula: [
      { expr: "Δθ ∝ ∂E/∂θ", note: "수정폭은 기울기의 크기에 비례" },
      {
        expr: "∂E/∂w₁ = (∂E/∂출력)(∂출력/∂은닉2)(∂은닉2/∂은닉1)(∂은닉1/∂w₁)",
        note: "층을 하나 지날 때마다 활성화 함수의 미분값이 한 번 더 곱해진다",
      },
    ],
    example:
      "시그모이드의 미분값이 0.1인 자리를 5층 거치면 0.1⁵ = 0.00001이 되어, 입력층 쪽 가중치는 사실상 고쳐지지 않는다.",
    prereqs: ["pre-chain-rule-deep", "pre-numerical-stability"],
    related: ["t-saturation", "t-relu", "t-slow-learning", "t-backpropagation", "t-batch-normalization"],
    lectures: [11],
    basis: "교재 12.2.2 · 강의록 (2) 느린 학습 — 기울기 소멸 문제",
    emphasis: "원인은 셀 포화, 현상은 기울기 소멸이다. 둘을 같은 말로 쓰지 않도록 구분한다.",
    aliases: ["gradient vanishing", "기울기 소실", "vanishing gradient"],
  },
  {
    id: "t-saturation",
    term: "셀 포화",
    en: "cell saturation",
    category: "개념",
    short: "시그모이드에 큰 양수·음수가 들어와 출력이 0이나 1에 붙고 미분값이 0에 가까워지는 현상.",
    definition:
      "시그모이드 함수에 큰 양수·음수가 들어오면 출력이 0 또는 1에 가까워지는 현상. 이때 함수의 미분값인 기울기도 작아져서 0에 가까워진다.",
    role: "기울기 소멸 문제의 원인이 된다. 가중치 초기화와 배치 정규화가 모두 이 현상을 막으려는 기법이다.",
    formula: [{ expr: "φ′(u) = φ(u)(1 − φ(u))", note: "φ′의 최대값은 u = 0에서 0.25" }],
    prereqs: ["pre-numerical-stability"],
    related: ["t-vanishing-gradient", "t-sigmoid", "t-batch-normalization", "t-weight-initialization", "t-relu"],
    lectures: [11],
    basis: "교재 12.2.2(그림 12-4) · 강의록 (2) 느린 학습 — 셀 포화",
    aliases: ["cell saturation", "포화"],
  },
  {
    id: "t-relu",
    term: "ReLU 함수",
    en: "rectified linear unit",
    category: "수식·지표",
    short: "φ_ReLU(u) = max(0, u). 입력을 그대로 전달하고 미분값도 0이 아닌 1이 된다.",
    definition:
      "φ_ReLU(u) = max(0, u)로 정의되는 활성화 함수. 함수의 입력값을 시그모이드 함수와 같이 셀 포화가 되어 0~1 사이로 만드는 것이 아니라 함수의 입력을 그대로 전달하며, 미분값도 0이 아닌 1이 된다. 또한 이러한 값들의 계산이 빠르게 수행되는 장점이 있다.",
    role: "기울기 소멸 문제는 활성화 함수에 기인하므로, 기울기가 줄어들지 않는 ReLU로 바꾸면 이를 해결할 수 있다. 심층 신경망의 기본 활성화 함수다.",
    formula: [
      { expr: "φ_ReLU(u) = max(0, u)", note: "그림 12-5" },
      { expr: "φ′_ReLU(u) = 1 (u > 0), 0 (u < 0)", note: "양수 구간에서는 몇 층을 거쳐도 1" },
    ],
    related: ["t-relu-variants", "t-vanishing-gradient", "t-activation-function", "t-sigmoid"],
    lectures: [11],
    basis: "교재 12.2.2 (1) 활성화 함수의 변화(그림 12-5) · 강의록 느린 학습의 개선 기법 ①",
    aliases: ["ReLU", "렐루", "rectified linear unit"],
  },
  {
    id: "t-relu-variants",
    term: "ReLU의 변형",
    en: "softplus / leaky ReLU / pReLU",
    category: "수식·지표",
    short: "심층 신경망에서 ReLU와 함께 쓰이는 변형 활성화 함수들.",
    definition:
      "심층 신경망에서는 활성화 함수로 ReLU 함수와 이를 변형한 softplus, leaky ReLU, pReLU 등을 사용한다. 모두 기울기가 줄어들지 않는 함수라는 공통점을 가진다.",
    formula: [
      { expr: "φ_softplus(u) = ln(1 + eᵘ)", note: "ReLU의 꺾인 모서리를 매끄럽게 만든 형태" },
      { expr: "leaky ReLU: u (u > 0), au (u ≤ 0)", note: "음수 쪽에도 작은 기울기 a를 남긴다" },
    ],
    related: ["t-relu", "t-activation-function", "t-vanishing-gradient"],
    lectures: [11],
    basis: "교재 12.2.2 (1) · 강의록 느린 학습의 개선 기법 ①",
    aliases: ["softplus", "leaky ReLU", "pReLU", "PReLU"],
  },
  {
    id: "t-momentum",
    term: "모멘텀",
    en: "momentum",
    category: "알고리즘",
    short: "파라미터 변화량에 이전의 움직임(관성)을 반영하는 항.",
    definition:
      "기울기 강하 학습법의 수정식에서 파라미터 변화량에 이전의 움직임(관성)을 반영한 항. 이를 통해 학습 속도의 저하를 방지하거나 학습의 불안정성을 감소시킬 수 있다. γ는 적용되는 모멘텀항의 비율을 나타내는 관성률(momentum rate)로서 작은 값으로 지정한다.",
    formula: [
      { expr: "θ⁽τ⁺¹⁾ = θ⁽τ⁾ + Δθ⁽τ⁾", note: "식 12-1" },
      { expr: "Δθ⁽τ⁾ = −η ∇θ E(θ⁽τ⁾) + γ Δθ⁽τ⁻¹⁾", note: "식 12-2 — 뒤의 항이 모멘텀항" },
    ],
    example:
      "평평한 구간처럼 기울기가 작지만 방향이 한결같은 곳에서는 같은 방향의 수정이 계속 쌓여 보폭이 커진다.",
    prereqs: ["pre-gradient"],
    related: ["t-nag", "t-adaptive-learning-rate", "t-slow-learning", "t-gradient-descent"],
    lectures: [11],
    basis: "교재 12.2.2 (3) 모멘텀(식 12-1, 12-2) · 강의록 느린 학습의 개선 기법 ③",
    aliases: ["momentum", "관성률", "momentum rate"],
  },
  {
    id: "t-nag",
    term: "NAG",
    en: "Nesterov Accelerated Gradient",
    category: "알고리즘",
    short: "기본 모멘텀의 개념을 변형시킨 기법.",
    definition:
      "기본 모멘텀의 개념을 변형시킨 방법. 관성으로 미리 이동한 자리에서 기울기를 구해 수정량을 계산한다.",
    formula: [{ expr: "Δθ⁽τ⁾ = −η ∇θ E(θ⁽τ⁾ + γΔθ⁽τ⁻¹⁾) + γΔθ⁽τ⁻¹⁾", note: "식 12-3" }],
    distinctions: [
      {
        from: "모멘텀",
        how: "모멘텀은 현재 위치의 기울기를 쓰고, NAG는 관성항만큼 미리 움직인 위치의 기울기를 쓴다.",
      },
    ],
    related: ["t-momentum", "t-adaptive-learning-rate"],
    lectures: [11],
    basis: "교재 12.2.2 (3)(식 12-3) · 강의록 느린 학습의 개선 기법 ③",
    aliases: ["NAG", "Nesterov"],
  },
  {
    id: "t-adaptive-learning-rate",
    term: "적응적 학습률",
    en: "adaptive learning rate",
    category: "알고리즘",
    short: "가중치마다 서로 다른 학습률을 두고 변화폭에 따라 조정하는 방법.",
    definition:
      "학습률을 하나로 고정해 사용하기보다 가중치마다 서로 다른 학습률을 갖고, 가중치가 변화된 크기의 누적합을 활용하여 변화폭에 따라 학습률을 적응적으로 결정하는 방법. 대표적인 방법으로 RMSProp, AdaDelta, Adam(Adaptive momentum)이 있으며, 특히 Adam은 RMSProp과 모멘텀 방법을 결합한 것으로 딥러닝에서 가장 많이 사용되고 있다.",
    role:
      "학습률이 높으면 가중치가 급격히 변경되어 발산하는 불안정한 형태가 되고, 너무 작으면 안정적이기는 하지만 극소점에 도달하는 데 오랜 시간이 걸린다. 그 사이를 자동으로 맞춘다.",
    related: ["t-learning-rate", "t-momentum", "t-slow-learning", "t-hyperparameter"],
    lectures: [11],
    basis: "교재 12.2.2 (4) 적응적 학습률(그림 12-6) · 강의록 느린 학습의 개선 기법 ④",
    aliases: ["RMSProp", "AdaDelta", "Adam", "adaptive learning rate"],
  },
  {
    id: "t-batch-normalization",
    term: "배치 정규화",
    en: "batch normalization",
    category: "알고리즘",
    short: "활성화 함수로 들어가는 배치 입력이 셀 포화 범위를 벗어나지 않도록 정규화하는 방법.",
    definition:
      "학습하는 동안 각 노드의 활성화 함수로 들어가는 데이터 배치에 대한 입력이 셀 포화를 발생하지 않는 범위 내에 존재하도록 정규화시키는 방법. 이렇게 함으로써 활성화 함수에 대한 입력 분포를 항상 일정하게 유지하여 학습 효율을 높일 수 있다.",
    role: "학습의 속도를 높이기 위해 실제 응용에서 많이 사용된다.",
    distinctions: [
      {
        from: "입력 데이터의 정규화",
        how: "입력 정규화는 신경망에 들어가기 전 한 번이지만, 배치 정규화는 학습 중 각 노드의 활성화 함수 앞에서 계속 수행된다.",
      },
    ],
    related: ["t-saturation", "t-input-normalization", "t-slow-learning", "t-relu"],
    lectures: [11],
    basis: "교재 12.2.2 (5) 배치 정규화 · 강의록 느린 학습의 개선 기법 ⑤",
    aliases: ["batch normalization", "BN"],
  },
  {
    id: "t-hessian",
    term: "헤시안 행렬",
    en: "Hessian matrix",
    category: "수식·지표",
    short: "다차원 오차함수의 2차 미분(곡률) 정보를 담은 행렬.",
    definition:
      "다차원인 오차함수에 대한 곡률(curvature) 정보를 표시하는 행렬. 기울기의 변화량을 결정할 때 오차함수의 2차 미분인 곡률 정보를 함께 사용하는 2차 미분 방법에서 쓰인다.",
    formula: [{ expr: "Δθ⁽τ⁾ = −η (H(θ⁽τ⁾))⁻¹ ∇θ E(θ⁽τ⁾)", note: "식 12-4" }],
    role:
      "곡률이라는 고차 정보를 추가로 활용하므로 이론적으로는 좋은 학습기법이지만, 계산에 오랜 시간이 걸려서 작은 모델을 제외하고는 실질적으로 사용하는 데 한계가 있다.",
    prereqs: ["pre-partial-derivative", "pre-inverse"],
    related: ["t-gradient-descent", "t-slow-learning"],
    lectures: [11],
    basis: "교재 12.2.2 (6) 2차 미분 방법(식 12-4) · 강의록 느린 학습의 개선 기법 ⑥",
    aliases: ["Hessian", "곡률", "curvature", "2차 미분 방법"],
  },

  /* ─────────── 과다적합 ─────────── */
  {
    id: "t-dropout",
    term: "드롭아웃",
    en: "dropout",
    category: "알고리즘",
    short: "학습 과정에서 가중치를 수정할 때 임의로 선택한 은닉 노드의 일부를 제외하는 것.",
    definition:
      "학습 과정에서 가중치를 수정할 때 임의로 선택한 은닉 노드의 일부를 제외하는 방법. 랜덤하게 선택된 일부 파라미터들이 학습에 참여하지 못하므로 결국 전체 모델이 가지는 복잡도보다는 낮은 모델로 학습하는 효과를 가지며, 작은 모델의 앙상블 평균과 유사한 효과를 통해 일반화 성능을 향상한다.",
    role: "과다적합을 다루기 위해 실제로 많이 사용되는 방법이다.",
    distinctions: [
      {
        from: "정규항 추가",
        how: "정규항은 가중치의 크기를 작게 눌러 복잡한 함수가 되는 것을 막고, 드롭아웃은 매 수정마다 쓰이는 노드 자체를 줄인다.",
      },
    ],
    related: ["t-overfitting", "t-regularization-term", "t-early-stopping", "t-ensemble-learning"],
    lectures: [11],
    basis: "교재 12.2.3 (3) 드롭아웃(그림 12-8) · 강의록 과다적합의 해결책 ③",
    aliases: ["dropout"],
  },
  {
    id: "t-data-augmentation",
    term: "데이터 증대",
    en: "data augmentation",
    category: "알고리즘",
    short: "원래 데이터에 인위적인 변형을 가해 추가적인 학습 데이터를 생성하는 것.",
    definition:
      "학습 데이터가 충분하지 못한 경우에도 과다적합이 발생할 수 있으므로, 원래 데이터에 대해 인위적인 변형을 가하여 추가적인 데이터를 생성해서 많은 학습 데이터를 만들어 사용하는 방법.",
    example:
      "영상 데이터의 경우에는 크기 조정, 회전, 위치 이동, 자르기 등의 연산을 통해 변형된 많은 이미지를 생성할 수 있다. 일반 데이터의 경우에는 노이즈를 추가한다.",
    related: ["t-overfitting", "t-dropout", "t-generalization-error", "t-training-data"],
    lectures: [11],
    basis: "교재 12.2.3 (4) 데이터 증대 · 강의록 과다적합의 해결책 ④",
    aliases: ["data augmentation", "데이터 증강"],
  },
  {
    id: "t-regularization-term",
    term: "정규항",
    en: "regularization term",
    category: "수식·지표",
    short: "오차함수에 더하는 가중치 벡터의 2차 노름 항.",
    definition:
      "가중치가 너무 크게 되면 복잡한 형태의 함수가 생성되어 과다적합이 발생한다는 사실에 착안하여, 학습하는 동안 가중치가 지나치게 커지는 것을 방지하기 위해 원래 오차함수에 추가하는 가중치 벡터의 2차 노름에 해당하는 항. λ는 정규항의 영향을 조정하는 사용자 정의 파라미터다.",
    formula: [{ expr: "E_reg(X; θ) = E_sqr(X; θ) + λ‖θ‖²", note: "식 12-5" }],
    role: "오차를 줄임과 동시에 가중치도 되도록 작은 값을 유지하도록 유도한다.",
    prereqs: ["pre-norm"],
    related: ["t-overfitting", "t-dropout", "t-error-function", "t-model-complexity"],
    lectures: [11],
    basis: "교재 12.2.3 (2) 정규항 추가(식 12-5) · 강의록 과다적합의 해결책 ②",
    aliases: ["regularization", "규제항", "정규화항"],
  },
  {
    id: "t-early-stopping",
    term: "조기 종료",
    en: "early stopping",
    category: "알고리즘",
    short: "과다적합이 발생하기 전에 학습을 종료하는 방법.",
    definition:
      "학습이 진행되는 과정에서 과다적합이 발생하기 전에 학습을 종료하는 방법. 학습 데이터와 별도로 검증용 데이터 집합을 마련하여 한 번 혹은 여러 차례의 학습 에포크를 수행할 때마다 검증 데이터 집합에 대한 오차를 확인하고, 오차가 증가하는 시점을 종료 시점으로 결정한다.",
    distinctions: [
      {
        from: "느린 학습의 개선 기법",
        how: "조기 종료는 과다적합의 해결책이다. 학습을 일찍 끝내는 것이므로 학습 속도 자체를 개선하지는 않는다.",
      },
    ],
    related: ["t-overfitting", "t-validation-error", "t-dropout", "t-epoch"],
    lectures: [11],
    basis: "교재 12.2.3 (1) 조기 종료(그림 12-7) · 강의록 과다적합의 해결책 ①",
    aliases: ["early stopping"],
  },

  /* ─────────── 합성곱 신경망 ─────────── */
  {
    id: "t-cnn",
    term: "합성곱 신경망",
    en: "Convolutional Neural Network",
    category: "알고리즘",
    short: "격자 구조를 가진 데이터에 적합하도록 개발된, 부분연결과 가중치 공유를 쓰는 심층 신경망.",
    definition:
      "인간의 시각 피질에 존재하는 신경세포들의 정보처리 기제로부터 영감을 받아서 영상 데이터처럼 격자 구조를 가진 데이터에 적합하도록 개발된 모델. 이웃한 층의 노드들을 부분적으로만 연결해 신경망의 복잡도를 낮추면서 효율적인 학습이 이루어지도록 설계되었다. 입력층과 출력층을 제외하고 콘볼루션층, 서브샘플링(풀링)층, 완전연결층의 세 가지 유형의 세포들이 층을 구성한다.",
    role: "최근의 딥러닝 응용에서 가장 많이 사용되는 심층 신경망의 형태다. 학습은 기본적으로 오류 역전파 학습 알고리즘을 바탕으로 수행된다.",
    distinctions: [
      {
        from: "기존 MLP",
        how: "MLP는 이웃한 층의 각 노드가 완전연결된 구조라 심층으로 구성하면 가중치가 너무 많아진다. CNN은 부분연결과 가중치 공유로 복잡도를 낮춘다.",
      },
    ],
    related: ["t-convolution-layer", "t-pooling-layer", "t-fully-connected", "t-weight-sharing", "t-lenet5"],
    lectures: [11],
    basis: "교재 12.3 · 강의록 합성곱 신경망",
    aliases: ["CNN", "convolutional neural network", "콘볼루션 신경망"],
  },
  {
    id: "t-convolution-layer",
    term: "콘볼루션층",
    en: "convolution layer",
    category: "개념",
    short: "주어진 2D 입력에 콘볼루션 연산을 반복 적용하여 특징맵을 생성하는 층.",
    definition:
      "주어진 2D 입력에 대해 콘볼루션 연산을 반복적으로 수행하여 특징맵을 생성하는 층. 원본 데이터로부터 의미 있는 특징을 추출하는 역할을 담당하기 때문에, 설계자가 따로 정해 주는 특징을 사용하는 대신 필터 가중치의 학습을 통해 의미 있는 특징을 자동으로 추출할 수 있다.",
    formula: [
      { expr: "u₁,₁ = x₀:₂,₀:₂ ∗ w = Σᵢ₌₀² Σⱼ₌₀² xᵢ,ⱼ wᵢ,ⱼ", note: "식 12-6" },
      { expr: "y₁,₁ = φ(u₁,₁ + b) = φ(x₀:₂,₀:₂ ∗ w + b)", note: "식 12-7 — 바이어스를 더하고 활성화 함수를 거친다" },
    ],
    prereqs: ["pre-convolution", "pre-sigma"],
    related: ["t-convolution", "t-filter", "t-feature-map", "t-pooling-layer", "t-convolution-block"],
    lectures: [11],
    basis: "교재 12.3.1(식 12-6, 12-7) · 강의록 콘볼루션층",
    aliases: ["convolution layer", "합성곱층"],
  },
  {
    id: "t-convolution",
    term: "콘볼루션 연산",
    en: "convolution operation",
    category: "수식·지표",
    short: "해당하는 위치의 요소에 가중치를 곱해서 모두 더하는 간단한 선형 연산.",
    definition:
      "해당하는 위치의 요소에 가중치를 곱해서 모두 더하는 간단한 선형 연산. 영상처리와 신호처리에서 기본적인 연산으로 많이 사용된다. 필터를 2D 입력 행렬 전체에 대해 옮겨 가면서 모든 위치에 적용하면 특징맵의 모든 출력값이 얻어진다.",
    example:
      "7×7 입력의 왼쪽 위 3×3 창 [[0,1,2],[1,8,2],[2,1,2]]에 필터 [[−1,0,1],[−1,0,1],[−1,0,1]]를 적용하면 (2+2+2) − (0+1+2) = 3이 된다.",
    prereqs: ["pre-convolution", "pre-dot-product"],
    related: ["t-convolution-layer", "t-filter", "t-padding", "t-stride"],
    lectures: [11],
    basis: "교재 12.3.1(그림 12-11) · 강의록 콘볼루션층 — 콘볼루션 연산",
    aliases: ["convolution", "합성곱 연산"],
  },
  {
    id: "t-filter",
    term: "필터(커널·마스크·윈도)",
    en: "filter / kernel / mask / window",
    category: "개념",
    short: "콘볼루션 연산에 쓰이는 작은 가중치 행렬. 여기 적힌 값이 학습 대상이다.",
    definition:
      "콘볼루션 연산에서 입력 위를 옮겨 다니며 곱해지는 가중치 행렬. 커널(kernel), 필터(filter), 마스크(mask) 또는 윈도(window)라고 부르며, 크기는 3×3, 5×5, 7×7과 같이 주어진다. 여기에 표현된 값이 CNN에서의 학습 대상이 되는 가중치다.",
    role: "사용하는 필터에 따라 서로 다른 형태의 특징이 추출된다. 즉 필터의 가중치가 어떤 특징을 추출할지를 규정한다.",
    example:
      "수평 에지는 [[−1,−1,−1],[0,0,0],[1,1,1]], 수직 에지는 [[−1,0,1],[−1,0,1],[−1,0,1]]로 추출한다.",
    distinctions: [
      {
        from: "풀링의 필터",
        how: "콘볼루션의 필터는 학습되는 가중치를 담지만, 풀링의 필터는 최대·평균을 취할 창의 크기일 뿐이라 학습 대상이 없다.",
      },
    ],
    related: ["t-convolution", "t-feature-map", "t-weight-sharing", "t-multi-channel"],
    lectures: [11],
    basis: "교재 12.3.1 · 강의록 콘볼루션층 — 커널/마스크/윈도",
    aliases: ["kernel", "filter", "mask", "window", "커널", "마스크", "윈도"],
  },
  {
    id: "t-feature-map",
    term: "특징맵",
    en: "feature map",
    category: "개념",
    short: "콘볼루션 연산의 결과로 만들어지는 2차원 출력. 개수는 필터의 개수와 같다.",
    definition:
      "콘볼루션층이 생성하는 2차원 출력. 콘볼루션층과 풀링층은 각각 여러 개의 2차원 특징맵으로 이루어지고, 특징맵의 개수는 학습에 사용되는 커널(필터)의 개수에 의존한다.",
    formula: [
      {
        expr: "출력 한 변 = (입력 + 2×패딩 − 필터) ÷ 보폭 + 1",
        note: "7×7 입력에 3×3 필터, 패딩 0·보폭 1이면 5×5",
      },
    ],
    example:
      "입력층(6×6×3)에 3×3 필터 2개를 보폭 1·패딩 0으로 적용하면 콘볼루션층은 4×4×2가 된다 — 4×4는 특징맵의 크기, 2는 개수다.",
    related: ["t-convolution-layer", "t-filter", "t-padding", "t-stride", "t-pooling-layer"],
    lectures: [11],
    basis: "교재 12.3·12.3.1(그림 12-15) · 강의록 콘볼루션층 — 간략한 표현",
    emphasis: "‘4×4×2’에서 마지막 숫자는 채널 수가 아니라 특징맵의 개수(= 필터의 개수)다.",
    aliases: ["feature map", "특징앱", "plane"],
  },
  {
    id: "t-padding",
    term: "패딩",
    en: "zero padding",
    category: "개념",
    short: "입력 데이터의 가장자리를 0값으로 채워 가장자리에도 필터를 적용할 수 있게 하는 것.",
    definition:
      "입력의 가장자리에서 필터를 적용할 때는 필터가 입력 데이터 영역의 바깥으로 나가게 되어 적용할 수 없으므로, 입력 데이터의 가장자리에 0값으로 채워진 영역을 추가하는 것. 이렇게 하면 데이터의 가장자리에 대해서도 동일한 처리를 할 수 있어 원래 입력과 동일한 크기의 특징맵을 생성할 수 있다. 필터의 크기에 따라 패딩의 크기도 달라진다.",
    example:
      "패딩이 없으면 7×7 입력의 상하좌우 가장자리가 연산에서 제외되어 특징맵이 중앙의 5×5 영역에서만 값을 갖지만, 3×3 필터에 패딩 1을 주면 7×7 특징맵이 된다.",
    related: ["t-stride", "t-feature-map", "t-convolution"],
    lectures: [11],
    basis: "교재 12.3.1(그림 12-12) · 강의록 콘볼루션층 — 패딩",
    aliases: ["zero padding", "padding"],
  },
  {
    id: "t-stride",
    term: "보폭",
    en: "stride",
    category: "개념",
    short: "필터가 움직이는 간격. 조정하면 출력 특징맵의 크기가 바뀐다.",
    definition:
      "콘볼루션 연산에서 필터가 움직이는 간격. 보폭이 1이면 한 노드에 대해 연산을 적용한 후 바로 이웃한 노드로 이동한다. 보폭을 조정하면 출력 특징맵의 크기를 조정할 수 있고, 보폭이 s라면 출력 특징맵의 크기는 입력 데이터 크기의 1/s로 조정된다.",
    example: "패딩 1을 준 7×7 입력에 3×3 필터를 보폭 2로 적용하면 4×4 출력맵이 생성된다.",
    prereqs: ["pre-matrix-stride"],
    related: ["t-padding", "t-feature-map", "t-convolution", "t-pooling-layer"],
    lectures: [11],
    basis: "교재 12.3.1(그림 12-14) · 강의록 콘볼루션층 — 보폭",
    aliases: ["stride", "스트라이드"],
  },
  {
    id: "t-multi-channel",
    term: "다중 채널",
    en: "multiple channels",
    category: "개념",
    short: "컬러 영상처럼 2D 격자 입력이 여러 장으로 이루어진 경우.",
    definition:
      "2D 격자 구조의 입력이 여러 장을 형성하는 경우. 예를 들어 입력 영상이 RGB 컬러 영상이면 세 가지 색상에 따른 3개의 채널을 갖게 되므로 입력 영상은 3D 텐서에 해당한다. 필터의 채널 수는 입력 데이터의 채널 수와 같아야 하며, 채널별 콘볼루션 결과를 더한 뒤 활성화 함수를 거쳐 하나의 특징맵이 된다.",
    example:
      "7×7×3 입력에 3×3×3 필터 2개를 패딩 없이 적용하면 특징맵은 5×5×2가 된다. 채널 수가 3이어도 필터 하나는 특징맵 한 장을 만든다.",
    related: ["t-feature-map", "t-filter", "t-cnn", "t-convolution"],
    lectures: [11],
    basis: "교재 12.3.1(그림 12-13) · 강의록 콘볼루션층 — 다중 채널",
    aliases: ["multi channel", "채널", "3D 텐서"],
  },
  {
    id: "t-local-connection",
    term: "부분연결",
    en: "local connection",
    category: "개념",
    short: "출력의 각 노드가 필터가 적용되는 영역에만 연결되는 것.",
    definition:
      "출력(특징맵)의 각 노드가 입력의 모든 노드와 가중치로 완전연결된 것이 아니라, 필터가 적용되는 영역에 국한되어 연결되는 것.",
    distinctions: [
      {
        from: "완전연결",
        how: "완전연결은 이웃한 층의 모든 노드 쌍마다 가중치가 하나씩 있다. 부분연결은 필터가 덮는 영역에만 연결이 있다.",
      },
    ],
    related: ["t-weight-sharing", "t-fully-connected", "t-cnn", "t-filter"],
    lectures: [11],
    basis: "교재 12.3·12.3.1 · 강의록 합성곱 신경망 — 부분적인 연결",
    aliases: ["local connection", "부분적인 연결"],
  },
  {
    id: "t-weight-sharing",
    term: "가중치 공유",
    en: "shared weight",
    category: "개념",
    short: "입력의 모든 노드에 동일한 필터(가중치)가 적용되는 것.",
    definition:
      "입력의 모든 노드에 동일한 필터(가중치)가 적용되는 개념. 층과 층 사이의 부분연결과 가중치 공유 기법으로 인해 CNN에서 다루어야 할 가중치의 개수가 MLP에 비해 훨씬 적기 때문에 모델의 복잡도도 크게 낮아진다.",
    example:
      "6×6×3 입력에서 3×3 필터 2개로 4×4×2를 만들면 가중치는 2×(3×3×3) = 54개다. 같은 입출력을 완전연결로 이으면 108×32 = 3,456개가 필요하다.",
    related: ["t-local-connection", "t-filter", "t-cnn", "t-model-complexity"],
    lectures: [11],
    basis: "교재 12.3·12.3.1 · 강의록 합성곱 신경망 — 가중치 공유",
    aliases: ["shared weight", "weight sharing"],
  },
  {
    id: "t-pooling-layer",
    term: "풀링층(서브샘플링층)",
    en: "pooling / subsampling layer",
    category: "개념",
    short: "특징맵의 크기를 작게 만들어 계산 속도를 높이고 정보를 추상화하는 층.",
    definition:
      "콘볼루션층을 수행한 다음에 거치는 층으로, 서브샘플링이라고도 한다. 풀링 연산은 특징맵의 크기를 작게 만듦으로써 계산 속도를 높일 뿐 아니라 정보의 추상화를 진행한다. 풀링 연산은 단순히 필터 내의 값들에 대해 최대값 또는 평균값을 구하는 연산이기 때문에 학습을 통해 결정될 파라미터는 없다 — 즉 풀링층에서는 학습이 수행되지 않는다.",
    role:
      "풀링 연산은 각 특징맵마다 독립적으로 수행되기 때문에 연산 전후의 특징맵의 수는 변하지 않고 그대로 유지된다.",
    example: "6×6×3 특징맵에 f = 2, s = 2의 최대 풀링을 적용하면 3×3×3이 된다 — 크기만 줄고 장수는 그대로다.",
    distinctions: [
      {
        from: "콘볼루션층",
        how: "콘볼루션층의 필터에는 학습되는 가중치가 있고 필터 개수만큼 특징맵이 늘어나지만, 풀링층은 학습 파라미터가 없고 특징맵의 수도 그대로다.",
      },
    ],
    related: ["t-max-pooling", "t-convolution-layer", "t-transition-invariant", "t-feature-map"],
    lectures: [11],
    basis: "교재 12.3.2(그림 12-16, 12-17) · 강의록 풀링층(서브샘플링층)",
    emphasis: "풀링이 줄이는 것은 특징맵의 크기이지 개수가 아니다.",
    aliases: ["pooling", "subsampling", "서브샘플링"],
  },
  {
    id: "t-max-pooling",
    term: "최대 풀링",
    en: "max pooling",
    category: "수식·지표",
    short: "필터에 속한 노드 중에서 가장 큰 값만 출력하는 연산.",
    definition:
      "풀링 방법 가운데 가장 많이 사용되는 것으로, 필터에 속한 노드 중에서 가장 큰 값만 출력하는 연산. 이 밖에 값들의 평균값을 구하는 평균 풀링(average pooling), 가중치 평균 풀링 등이 있다.",
    example:
      "4×4 특징맵 [[10,17,20,0],[8,13,2,6],[31,11,0,8],[4,10,3,5]]에 2×2 풀링을 적용하면 최대 풀링은 17·20·31·8, 평균 풀링은 12·7·14·4가 된다.",
    related: ["t-pooling-layer", "t-transition-invariant", "t-feature-map"],
    lectures: [11],
    basis: "교재 12.3.2(그림 12-16) · 강의록 풀링층 — 최대 풀링·평균 풀링",
    aliases: ["max pooling", "평균 풀링", "average pooling", "가중치 평균 풀링"],
  },
  {
    id: "t-transition-invariant",
    term: "위치 이동에 대한 불변성",
    en: "transition-invariant",
    category: "개념",
    short: "데이터의 작은 이동에 대해서는 풀링 결과값이 변하지 않는 성질.",
    definition:
      "풀링 연산이 가지는 성질로, 데이터의 작은 이동에 대해서는 결과값이 변화되지 않는 것. 필터의 크기가 커질수록 그 효과는 더 커진다.",
    role: "물체인식이나 영상처리 등의 응용에서 매우 유용하다.",
    related: ["t-pooling-layer", "t-max-pooling", "t-cnn"],
    lectures: [11],
    basis: "교재 12.3.2 · 강의록 풀링층 — 왜 풀링인가?",
    aliases: ["transition invariant", "이동 불변"],
  },
  {
    id: "t-convolution-block",
    term: "콘볼루션 블록",
    en: "convolution block",
    category: "개념",
    short: "콘볼루션층과 이웃한 풀링층을 합쳐 부르는 단위. 여러 번 반복된다.",
    definition:
      "콘볼루션층과 이웃한 풀링층을 합쳐 부르는 단위. CNN은 이 블록이 여러 번 반복되는 구조를 가진다. 이러한 처리 과정은 주어진 입력에 대해 학습을 통해 서로 다른 수준에서의 특징을 추출하는 과정으로 볼 수 있다.",
    related: ["t-convolution-layer", "t-pooling-layer", "t-representation-learning", "t-cnn"],
    lectures: [11],
    basis: "교재 12.3 · 강의록 합성곱 신경망 — convolution block",
    aliases: ["convolution block"],
  },
  {
    id: "t-representation-learning",
    term: "표현학습(특징학습)",
    en: "representation learning / feature learning",
    category: "개념",
    short: "심층 신경망이 학습을 통해 서로 다른 수준의 특징을 스스로 추출하는 것.",
    definition:
      "콘볼루션 블록이 반복되는 처리 과정은 주어진 입력에 대해 학습을 통해 서로 다른 수준에서의 특징을 추출하는 과정으로 볼 수 있으며, 그런 의미에서 심층 신경망에서의 학습을 특징학습(feature learning) 또는 표현학습(representation learning)이라고도 한다.",
    distinctions: [
      {
        from: "사람이 설계한 특징",
        how: "얕은 신경망에서는 HOG·LBP·PCA처럼 사람이 정한 방법으로 특징을 뽑지만, 표현학습에서는 필터 가중치의 학습으로 특징이 정해진다.",
      },
    ],
    related: ["t-end-to-end-learning", "t-convolution-block", "t-feature-extraction", "t-cnn"],
    lectures: [11],
    basis: "교재 12.3 · 강의록 합성곱 신경망",
    aliases: ["representation learning", "feature learning", "특징학습"],
  },
  {
    id: "t-flatten",
    term: "flattening",
    en: "flattening",
    category: "개념",
    short: "행렬 형태의 특징을 벡터 형태로 변환하는 연산.",
    definition:
      "행렬을 벡터 형태로 변환하는 연산. 완전연결층은 앞선 층에서 추출된 행렬 형태의 특징을 벡터 형태로 입력받아 전통적인 MLP에서와 같은 분류 작업을 수행한다.",
    example: "4×4 특징맵 20장을 펴면 4 × 4 × 20 = 320개의 값을 가진 벡터 하나가 된다.",
    related: ["t-fully-connected", "t-feature-map", "t-cnn"],
    lectures: [11],
    basis: "교재 12.3 · 강의록 합성곱 신경망 — 완전연결층",
    aliases: ["flatten", "flattening", "평탄화"],
  },
  {
    id: "t-lenet5",
    term: "LeNet-5",
    en: "LeNet-5",
    category: "알고리즘",
    short: "1998년 얀 르쿤이 필기 숫자인식을 위해 개발한, 첫 번째 CNN 성공 사례.",
    definition:
      "초창기 대표적인 CNN으로, 1998년 얀 르쿤(Yann LeCun)에 의해 필기 숫자인식을 위해 개발되어 첫 번째의 CNN 성공 사례로 여겨진다. 특징추출을 위해 3개의 콘볼루션층(C1, C3, C5)과 2개의 풀링층(S2, S4)으로 구성되고, 분류를 위해 하나의 은닉층을 가진 MLP 구조인 완전연결층(120-84-10)으로 구성된다. 출력층은 각 숫자를 나타내는 10개 노드로 구성되고 활성화 함수로는 소프트맥스 함수를 사용한다.",
    example:
      "32×32×1 → C1 28×28×6 → S2 14×14×6 → C3 10×10×16 → S4 5×5×16 → C5 1×1×120 → F6 84 → 10. 콘볼루션층은 모두 f = 5, s = 1, p = 0이고 풀링은 f = 2, s = 2의 평균 풀링이다.",
    role:
      "완전연결층으로만 이루어진 MLP 구조보다 훨씬 작은 수의 파라미터들로 더 좋은 인식 성능을 얻을 수 있음을 보였다.",
    related: ["t-cnn", "t-convolution-layer", "t-pooling-layer", "t-softmax", "t-mnist"],
    lectures: [11],
    basis: "교재 12.3.3(그림 12-18) · 강의록 CNN의 예: LeNet-5",
    emphasis: "교재는 1998년으로 적고, 강의록 제목 줄에는 1988로 적혀 있다. 인식률 99.05%는 강의록에만 나온다.",
    aliases: ["LeNet", "LeNet5", "르넷"],
  },
];
