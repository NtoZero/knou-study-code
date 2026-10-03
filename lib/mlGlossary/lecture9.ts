import type { GlossaryTerm } from "@/lib/mlGlossaryTypes";

/**
 * 9강 신경망(1)(교재 11.1~11.2)에서 다루는 용어.
 *
 * 정의는 교재·강의록 표현을 보존하되 한 문장으로 읽히게 다듬었다.
 */
export const lecture9Terms: GlossaryTerm[] = [
  /* ─────────── 신경망 개요 ─────────── */
  {
    id: "t-neural-network",
    term: "신경망",
    en: "neural networks",
    category: "알고리즘",
    short: "생물학적 신경회로망을 모델링한 수학적 함수. 데이터로 입출력 매핑함수를 스스로 찾는다.",
    definition:
      "인간 뇌의 구조와 뇌에서 수행되는 정보처리 방식을 모방함으로써 인간이 지능적으로 처리하는 복잡한 정보처리 능력을 기계를 통해 실현하고자 하는 연구. 생물학적 신경회로망을 모델링한 수학적 함수이며, 데이터를 이용하여 원하는 입출력 매핑함수의 형태를 스스로 찾는 학습능력을 가진다. 생물학적 신경망과 구분이 필요한 경우에는 인공 신경망이라고도 한다.",
    role: "학습 능력과 적응 능력을 기계에 부여하기 위해 인간의 뇌에서 일어나는 정보처리 방식을 모델링하는 방식. 학습 방식 및 구조에 따라 다양한 모델이 존재한다.",
    formula: [{ expr: "y = f(x ; w)", note: "응용 관점에서 신경망은 입력 x를 받아 출력 y를 내는 하나의 함수" }],
    example: "뇌는 100억 개 이상의 신경세포와 60조 이상의 연결을 가지며, 그 연결은 자라면서 자극을 받는 과정에서 스스로 조정된다.",
    distinctions: [
      {
        from: "딥러닝",
        how: "신경망 모델 중 가장 발전된 형태인 심층 신경망을 이용해 데이터를 분석하는 머신러닝 기술이 딥러닝이다. 딥러닝의 출발이 신경망.",
      },
    ],
    prereqs: ["pre-vector-notation-bold"],
    related: ["t-deep-neural-network", "t-deep-learning", "t-artificial-neuron", "t-mlp", "t-connectionism"],
    lectures: [9],
    basis: "교재 11.1.1 신경망이란? · 강의록 신경망과 딥러닝",
    emphasis:
      "기호주의 인공지능과 갈리는 지점은 사람이 지식을 넣어 주지 않고 데이터로부터 입출력 매핑함수를 스스로 찾는다는 점.",
    aliases: ["neural network", "신경회로망", "인공 신경망", "artificial neural network", "NN"],
  },
  {
    id: "t-connectionism",
    term: "연결주의",
    en: "connectionist AI",
    category: "개념",
    short: "뇌에서 영감을 받아, 간단한 소자를 많이 연결해 병렬·분산 처리하는 인공지능 접근법.",
    definition:
      "인공지능의 두 가지 접근법 중 하나로, 뇌에서 영감을 받은 계산 모형을 바탕으로 한다. 신경세포들이 네트워크로 연결되어 정보를 처리하는 방식을 본떠, 데이터가 주어지면 학습이라는 과정을 통해 필요한 규칙이나 지식을 스스로 뽑아내 문제를 해결한다. 퍼셉트론 → 다층 퍼셉트론 → 딥러닝으로 이어진다.",
    distinctions: [
      {
        from: "기호주의 (symbolic AI)",
        how: "기호주의는 부울 논리와 규칙 기반 지식 표현을 바탕으로 탐색·추론으로 문제를 해결하며, 사람이 지식을 추출해 프로그램으로 옮긴다(PROLOG, IBM Deep Blue). 연결주의는 사람의 개입 없이 데이터로부터 학습한다.",
      },
    ],
    related: ["t-neural-network", "t-rule-based", "t-artificial-intelligence", "t-deep-learning"],
    lectures: [9],
    basis: "강의록 인공지능의 두 가지 접근법",
    aliases: ["connectionism", "기호주의", "symbolic AI", "커넥셔니즘"],
  },
  {
    id: "t-deep-neural-network",
    term: "심층 신경망",
    en: "deep neural network",
    category: "알고리즘",
    short: "다수의 은닉층을 갖는 신경망 모델. 신경망 모델 중 가장 발전된 형태.",
    definition:
      "다수의 은닉층을 갖는 신경망 모델로, 신경망 모델 중 가장 발전된 형태를 갖는 것. 이를 이용해 데이터를 분석(학습)하는 데 초점을 둔 머신러닝 기술이 딥러닝이다.",
    related: ["t-neural-network", "t-deep-learning", "t-hidden-layer", "t-mlp"],
    lectures: [9],
    basis: "교재 11.1.3 (그림 11-5) · 강의록 신경망과 딥러닝",
    aliases: ["deep neural network", "DNN", "deep networks"],
  },

  /* ─────────── 생물학적 신경망 ─────────── */
  {
    id: "t-synapse",
    term: "시냅스",
    en: "synapse",
    category: "개념",
    short: "두 신경세포가 연결되는 부분. 여기서 연결 강도에 따라 정보 전달이 이루어진다.",
    definition:
      "신경세포들이 서로 연결되어 있는 부분으로, 이 부분에서 실제 세포 간의 연결 강도에 의존하여 정보 전달이 이루어진다. 하나의 신경세포의 출력이 그대로 다음 신경세포로 전달되는 것이 아니라, 두 신경세포가 어떤 방식으로 어느 정도의 강도로 연결되어 있느냐에 따라 전달되는 정보의 양이 달라진다. 이를 가중 연결(weighted connection)이라 한다.",
    role: "인공 뉴런에서 가중치 wᵢ에 해당하는 자리.",
    related: ["t-weight", "t-excitatory-inhibitory", "t-artificial-neuron"],
    lectures: [9],
    basis: "교재 11.1.2 생물학적 신경망 (그림 11-1) · 강의록 생물학적 신경망 — 신경세포의 구조",
    emphasis:
      "신경세포는 수상돌기(입력) · 세포체(연산) · 축색(출력) · 시냅스(연결)로 나뉘고, 그중 시냅스가 가중치에 대응한다는 짝을 기억해 둘 것.",
    aliases: ["synapse", "수상돌기", "dendrite", "세포체", "cell body", "축색", "axon"],
  },
  {
    id: "t-weight",
    term: "가중치",
    en: "weight",
    category: "개념",
    short: "두 신경세포 사이의 연결 강도. 신경망 학습이 조정하는 바로 그 값.",
    definition:
      "신경세포 간 시냅스 연결의 강도를 나타내는 값. 하나의 신경세포의 출력이 그대로 전달되는 것이 아니라 이 연결 강도에 따라 전달되는 정보의 양이 달라진다. 인공 뉴런에서는 각 입력 xᵢ에 곱해지는 wᵢ이며, 신경망 학습에서 가장 핵심이 되는 것으로 학습이 조정하는 대상이다.",
    formula: [{ expr: "u = Σᵢ₌₁ⁿ wᵢxᵢ", note: "가중치를 곱해 모두 더한 것이 가중합" }],
    distinctions: [
      {
        from: "활성화 함수와 연결 구조",
        how: "활성화 함수와 연결 구조는 모델 설계 시점에 고정되고, 학습을 통해 정해지는 것은 가중치뿐이다.",
      },
    ],
    prereqs: ["pre-sigma", "pre-dot-product"],
    related: ["t-synapse", "t-excitatory-inhibitory", "t-weighted-sum", "t-bias", "t-weight-update"],
    lectures: [9],
    basis: "교재 11.1.2 생물학적 신경망 · 11.1.4 신경망의 특성 · 강의록 생물학적 신경망",
    emphasis: "자극이 그대로 넘어가는 것이 아니라 가중치(연결 강도)에 따라 달라진다는 점이 신경망의 출발점.",
    aliases: ["weight", "연결 강도", "연결강도"],
  },
  {
    id: "t-excitatory-inhibitory",
    term: "흥분성 연결과 억제성 연결",
    en: "excitatory / inhibitory connection",
    category: "개념",
    short: "양의 가중치는 흥분성, 음의 가중치는 억제성.",
    definition:
      "양의 가중치를 가지는 경우를 흥분성(excitatory) 연결, 음의 가중치를 가지는 경우를 억제성(inhibitory) 연결이라고 한다. 흥분성 연결은 정보를 받아들이는 신경세포의 활성화 정도를 증가시키는 역할을 하고, 억제성 연결은 반대로 활성화 정도를 감소시키는 역할을 한다.",
    example: "w₁ = 0.6인 입력은 가중합을 끌어올리고, w₂ = −0.8인 입력은 끌어내려 임계치에 닿기 어렵게 만든다.",
    related: ["t-weight", "t-synapse", "t-weighted-sum"],
    lectures: [9],
    basis: "교재 11.1.2 생물학적 신경망 · 강의록 생물학적 신경망 — 신경세포의 구조",
    emphasis: "부호와 이름의 짝 — 양이 흥분성, 음이 억제성. 뒤집어 외우기 쉬우니 한 번 더 확인할 것.",
    aliases: ["excitatory", "inhibitory", "흥분성", "억제성"],
  },
  {
    id: "t-layered-connection",
    term: "계층 연결",
    en: "layered connection",
    category: "개념",
    short: "세포들의 기능에 따라 층으로 나뉘어 한 방향으로 전달되는 연결 구조.",
    definition:
      "생물체의 신경 시스템에서 가장 대표적으로 관찰되는 연결 구조로, 층상 연결이라고도 한다. 인간의 망막에서도 바깥쪽 세포가 빛 자극에 반응하면 그 정보가 다음 단계로 전달되어 가장 안쪽의 신경절세포로 모인 후 시신경섬유를 통해 뇌로 전달된다. 이처럼 세포들의 기능에 따라 나뉜 층상 구조가 인공 신경망을 개발하는 데 기본적인 모델이 되었다.",
    related: ["t-layer-structure", "t-feedforward", "t-hidden-layer"],
    lectures: [9],
    basis: "교재 11.1.2 생물학적 신경망 · 강의록 생물학적 신경망 — 신경세포의 연결 구조",
    aliases: ["layered connection", "층상 연결", "망막"],
  },

  /* ─────────── 인공 신경세포 ─────────── */
  {
    id: "t-artificial-neuron",
    term: "인공 신경세포",
    en: "neuron, node, unit",
    category: "개념",
    short: "입력의 가중합을 구해 활성화 함수에 넣어 출력을 내는 계산 단위.",
    definition:
      "생물학적 뉴런의 구조와 기능을 모방하여 정의한 계산 단위. n개의 입력 (x₁, …, xₙ)에 대해 연결 강도에 해당하는 가중치 (w₁, …, wₙ)를 곱하여 모두 합한 가중합 u를 계산하고, 가중합은 다시 활성화 함수 φ를 통하여 다음 뉴런으로 전달될 출력이 결정된다. 신경망의 3가지 핵심 구성 요소 중 첫 번째.",
    formula: [
      { expr: "u = Σᵢ₌₁ⁿ wᵢxᵢ", note: "가중합" },
      { expr: "φ(u) = 1 (u ≥ θ), 0 (otherwise)", note: "식 11-1 — 가장 기본적인 활성화 함수" },
    ],
    prereqs: ["pre-sigma", "pre-dot-product"],
    related: ["t-weighted-sum", "t-activation-function", "t-weight", "t-mp-neuron", "t-neural-network"],
    lectures: [9],
    basis: "교재 11.1.3 신경망의 구성 요소 (그림 11-2, 식 11-1) · 강의록 신경망의 구성 요소 ① 인공 신경세포",
    emphasis:
      "신경망 모델을 파악하려면 신경세포 · 신경망 구조 · 학습 알고리즘 세 가지를 반드시 확인해야 하고, 그 첫 번째가 이것.",
    aliases: ["neuron", "node", "unit", "뉴런", "노드"],
  },
  {
    id: "t-weighted-sum",
    term: "가중합",
    en: "weighted sum",
    category: "수식·지표",
    short: "u = Σwᵢxᵢ. 입력에 가중치를 곱해 모두 더한 값.",
    definition:
      "각 입력 xᵢ에 그 연결의 가중치 wᵢ를 곱해 모두 더한 값. 활성화 함수에 들어가는 입력이며, 생물학적으로는 수상돌기를 통해 세포체로 흘러들어온 자극이 모두 합해진 양에 해당한다.",
    formula: [
      { expr: "u = Σᵢ₌₁ⁿ wᵢxᵢ" },
      { expr: "uⱼʰ = Σᵢ₌₁ⁿ wᵢⱼxᵢ + w₀ⱼ", note: "식 11-5 — 다층 퍼셉트론의 은닉 노드 가중합" },
      { expr: "u_kᵒ = Σⱼ₌₁ᵐ vⱼₖzⱼ + v₀ₖ", note: "식 11-5 — 출력 노드 가중합" },
    ],
    example: "x = (1, 0.5, 1), w = (0.6, −0.8, 0.5)이면 u = 0.6 − 0.4 + 0.5 = 0.7.",
    prereqs: ["pre-sigma", "pre-dot-product"],
    related: ["t-artificial-neuron", "t-activation-function", "t-bias", "t-weight"],
    lectures: [9],
    basis: "교재 11.1.3 (식 11-1) · 11.2.2 (식 11-5) · 강의록 신경망의 구성 요소 ① 인공 신경세포",
    aliases: ["weighted sum", "net input", "u"],
  },
  {
    id: "t-activation-function",
    term: "활성화 함수",
    en: "activation function",
    category: "수식·지표",
    short: "가중합을 출력으로 바꾸는 함수. 하나의 뉴런의 특성을 결정한다.",
    definition:
      "가중합 u를 받아 다음 뉴런으로 전달될 출력을 결정하는 함수. 하나의 뉴런의 특성을 결정하는 것이 바로 이 함수이며, 가장 기본적으로는 임계치 θ 이상일 때만 1을 내는 계단함수로 정의된다. 반드시 이 함수를 사용할 필요는 없으며, 활성화 함수를 적절히 정의해 줌으로써 원하는 특성을 가진 신경망 모델을 개발할 수 있다.",
    role: "자주 사용되는 것으로 계단함수 · 부호함수 · 선형함수 · 시그모이드 함수 · 하이퍼탄젠트 함수 · ReLU 함수가 있다.",
    distinctions: [
      {
        from: "오차함수 (loss function)",
        how: "활성화 함수는 뉴런 하나의 출력을 결정하는 함수이고, 오차함수는 목표 출력과 실제 출력의 차이를 나타내어 학습의 목표를 정의하는 함수다.",
      },
    ],
    related: [
      "t-step-function",
      "t-sign-function",
      "t-linear-function",
      "t-sigmoid",
      "t-hyperbolic-tangent",
      "t-relu",
      "t-error-function",
    ],
    lectures: [9],
    basis: "교재 11.1.3 신경망의 구성 요소 (그림 11-3) · 강의록 신경망의 구성 요소 ① 인공 신경세포 — 활성화 함수",
    emphasis: "여섯 가지 활성화 함수의 이름과 식, 그리고 미분 가능 여부는 꼭 외워 둘 것.",
    aliases: ["activation function", "전달 함수"],
  },
  {
    id: "t-step-function",
    term: "계단함수",
    en: "step function",
    category: "수식·지표",
    short: "u ≥ 0이면 1, 아니면 0. 미분 불가.",
    definition:
      "식 11-1에서 정의된 가장 기본적인 활성화 함수. 입력 자극이 어느 정도 수준(임계치 θ) 이상이 될 때만 활성화된다는 생물학적 뉴런의 성질을 그대로 수학적으로 표현한 것이다. u = 0에서 값이 뛰므로 미분할 수 없다.",
    formula: [{ expr: "φ_step(u) = 1 (u ≥ 0), 0 (otherwise)" }],
    distinctions: [
      {
        from: "부호함수",
        how: "출력값이 0과 1인 것이 계단함수, −1과 1로 바꾼 것이 부호함수다. 나머지 성질은 유사하다.",
      },
    ],
    related: ["t-activation-function", "t-sign-function", "t-mp-neuron", "t-perceptron"],
    lectures: [9],
    basis: "교재 11.1.3 (그림 11-3) · 강의록 활성화 함수",
    emphasis: "미분이 불가능하기 때문에 다층 퍼셉트론의 은닉 뉴런에는 쓸 수 없다.",
    aliases: ["step function", "계단 함수"],
  },
  {
    id: "t-sign-function",
    term: "부호함수",
    en: "sign function",
    category: "수식·지표",
    short: "u ≥ 0이면 1, 아니면 −1. 미분 불가.",
    definition:
      "계단함수의 출력값을 0과 1이 아닌 −1과 1로 바꾼 활성화 함수. 계단함수와 유사하며, 역시 u = 0에서 값이 뛰어 미분할 수 없다.",
    formula: [{ expr: "φ_sign(u) = 1 (u ≥ 0), −1 (otherwise)" }],
    related: ["t-activation-function", "t-step-function"],
    lectures: [9],
    basis: "교재 11.1.3 (그림 11-3) · 강의록 활성화 함수",
    aliases: ["sign function", "부호 함수"],
  },
  {
    id: "t-linear-function",
    term: "선형함수",
    en: "linear function",
    category: "수식·지표",
    short: "φ(u) = u. 가중합을 그대로 출력으로 내보낸다.",
    definition:
      "가중합을 그대로 출력으로 내보내는 활성화 함수. 다층 퍼셉트론에서는 출력 뉴런의 활성화 함수로 선형 가중합을 그대로 출력값으로 주기 위해 쓰이기도 한다.",
    formula: [{ expr: "φ_linear(u) = u" }],
    distinctions: [
      {
        from: "은닉 뉴런의 활성화 함수",
        how: "은닉 뉴런에는 반드시 비선형 함수를 써야 한다. 선형함수만 쌓으면 층을 아무리 쌓아도 결국 하나의 선형식이 되어 표현 능력이 늘지 않는다.",
      },
    ],
    related: ["t-activation-function", "t-mlp", "t-universal-approximation"],
    lectures: [9],
    basis: "교재 11.1.3 (그림 11-3) · 11.2.2 다층 퍼셉트론 · 강의록 활성화 함수",
    aliases: ["linear function", "항등함수"],
  },
  {
    id: "t-sigmoid",
    term: "시그모이드 함수",
    en: "sigmoid function",
    category: "수식·지표",
    short: "1/(1 + e⁻ᵘ). 미분 가능하고 출력이 0에서 1 사이.",
    definition:
      "계단함수나 부호함수와는 달리 미분 가능하다는 장점이 있으면서도 출력값이 0에서 1 사이로 제한되는 활성화 함수. 함수의 곡선 형태를 파라미터의 값에 따라 계단함수에서 선형함수에 이르기까지 자유롭게 근사할 수 있도록 조정할 수 있는 장점도 가진다.",
    formula: [
      { expr: "φ_sigmoid(u) = 1 / (1 + e⁻ᵘ)" },
      { expr: "φ′(u) = φ(u)(1 − φ(u))", note: "도함수가 자기 자신으로 표현됨" },
    ],
    prereqs: ["pre-exp-log"],
    related: ["t-activation-function", "t-hyperbolic-tangent", "t-logistic-function", "t-mlp"],
    lectures: [9],
    basis: "교재 11.1.3 (그림 11-3) · 강의록 활성화 함수 · 다층 퍼셉트론 — 뉴런",
    aliases: ["sigmoid", "시그모이드"],
  },
  {
    id: "t-hyperbolic-tangent",
    term: "하이퍼탄젠트 함수",
    en: "hyper tangent function",
    category: "수식·지표",
    short: "(1 − e⁻²ᵘ)/(1 + e⁻²ᵘ). 미분 가능하고 출력이 −1에서 1 사이.",
    definition:
      "시그모이드 함수와 마찬가지로 미분 가능하면서 출력값이 −1에서 1 사이로 제한되는 활성화 함수. 곡선 형태를 파라미터 값에 따라 계단함수에서 선형함수에 이르기까지 자유롭게 근사하도록 조정할 수 있다.",
    formula: [
      { expr: "φ_tanh(u) = (1 − e⁻²ᵘ) / (1 + e⁻²ᵘ)" },
      { expr: "φ′(u) = 1 − φ(u)²" },
    ],
    example: "φ_tanh(1) ≈ 0.7616, φ_tanh(−1) ≈ −0.7616 — 원점에 대해 대칭.",
    prereqs: ["pre-exp-log"],
    related: ["t-activation-function", "t-sigmoid", "t-universal-approximation", "t-mlp"],
    lectures: [9],
    basis: "교재 11.1.3 (그림 11-3) · 강의록 활성화 함수 · MLP의 표현 능력",
    emphasis: "“−1과 1 사이의 실수값을 가지며 미분 가능한 활성화 함수”라는 조건을 모두 만족하는 것은 이 함수뿐.",
    aliases: ["tanh", "하이퍼볼릭 탄젠트", "hyperbolic tangent"],
  },
  {
    id: "t-relu",
    term: "ReLU 함수",
    en: "ReLU function",
    category: "수식·지표",
    short: "max(0, u). 최근의 딥러닝 모델에서 주로 사용된다.",
    definition:
      "입력이 양수이면 그대로, 음수이면 0을 내보내는 활성화 함수. 최근의 딥러닝 모델에서 주로 사용된다. 출력에 위쪽 한계가 없고 u = 0에서 꺾인다.",
    formula: [{ expr: "φ_relu(u) = max(0, u)" }],
    related: ["t-activation-function", "t-sigmoid", "t-hyperbolic-tangent", "t-deep-learning"],
    lectures: [9],
    basis: "교재 11.1.3 (그림 11-3) · 강의록 활성화 함수",
    aliases: ["ReLU", "렐루", "rectified linear unit"],
  },

  /* ─────────── 연결 구조 ─────────── */
  {
    id: "t-layer-structure",
    term: "층상 구조",
    en: "layered structure",
    category: "개념",
    short: "뉴런들이 입력층 · 은닉층 · 출력층으로 그룹을 이룬 신경망의 대표적 연결 구조.",
    definition:
      "뉴런들이 층별로 그룹을 이루는 가장 대표적인 연결 구조. 같은 층 안에서는 뉴런 간의 연결이 존재하지 않고, 이웃한 두 층 사이에서는 모든 뉴런이 연결을 가진다. 가장 아래의 첫 번째 층이 외부로부터 입력을 받아들이는 입력층(input layer), 마지막 층이 외부로 출력을 내는 출력층(output layer), 가운데 층이 외부와는 정보를 교환하지 않고 다른 신경세포들과만 입출력을 주고받는 은닉층(hidden layer)이다.",
    prereqs: ["pre-vector-notation-bold"],
    related: ["t-hidden-layer", "t-fully-connected", "t-single-multi-layer", "t-layered-connection", "t-feedforward"],
    lectures: [9],
    basis: "교재 11.1.3 신경망의 구성 요소 (그림 11-4) · 강의록 신경망의 구성 요소 ② 연결 구조",
    aliases: ["입력층", "input layer", "출력층", "output layer", "layered structure"],
  },
  {
    id: "t-hidden-layer",
    term: "은닉층",
    en: "hidden layer",
    category: "개념",
    short: "입력층과 출력층 사이에서 외부와 정보를 교환하지 않는 층.",
    definition:
      "신경망에서 입력층과 출력층 사이에 있는 층으로, 외부와는 정보를 교환하지 않으며 다른 신경세포들과만 입출력을 주고받는다. 겉으로 드러나지 않고 숨어 있다는 뜻에서 은닉층이라 부른다. 은닉층이 1개 이상이면 다층 신경망, 다수의 은닉층을 가지면 심층 신경망이다. 비선형 결정경계를 만들 수 있게 해 주는 것이 바로 이 층이다.",
    role: "XOR처럼 직선 하나로 나눌 수 없는 문제에서 여러 개의 직선을 만들어 결합할 수 있게 한다.",
    related: ["t-layer-structure", "t-mlp", "t-deep-neural-network", "t-xor-problem", "t-universal-approximation"],
    lectures: [9],
    basis: "교재 11.1.3 신경망의 구성 요소 · 11.2.1 XOR 문제 · 강의록 연결 구조",
    emphasis:
      "당시에도 은닉층이 필요하다는 것은 알았지만 은닉 노드에는 목표 출력값을 줄 수 없어 가중치 수정 방법을 몰랐고, 그 방법이 1980년대의 오류 역전파다.",
    aliases: ["hidden layer", "히든 레이어", "은익층"],
  },
  {
    id: "t-single-multi-layer",
    term: "단층 신경망과 다층 신경망",
    en: "single-layer / multi-layer network",
    category: "개념",
    short: "은닉층이 없으면 단층, 1개 이상이면 다층, 다수이면 심층.",
    definition:
      "입력층과 출력층으로만 구성된 신경망을 단층 신경망(single-layer network), 입력층과 출력층 사이에 1개 이상의 은닉층을 가지는 구조의 신경망을 다층 신경망(multi-layer network)이라 한다. 딥러닝의 대상이 되는 심층 신경망은 다수의 은닉층을 갖는 신경망 모델이다.",
    distinctions: [
      {
        from: "전방향 / 회귀 신경망",
        how: "단층·다층은 은닉층의 존재 여부로 가르는 기준이고, 전방향·회귀는 정보 흐름의 방향으로 가르는 별개의 기준이다.",
      },
    ],
    related: ["t-hidden-layer", "t-layer-structure", "t-deep-neural-network", "t-feedforward", "t-perceptron", "t-mlp"],
    lectures: [9],
    basis: "교재 11.1.3 (그림 11-4, 11-5) · 강의록 연결 구조 — 층수의 변화",
    aliases: ["단층 신경망", "다층 신경망", "single-layer", "multi-layer"],
  },
  {
    id: "t-feedforward",
    term: "전방향 신경망",
    en: "feed-forward neural network",
    category: "개념",
    short: "정보가 입력층에서 출력층으로 한 방향으로만 흐르는 신경망.",
    definition:
      "층상 구조의 신경망에서 정보의 흐름이 주로 입력층에서 출력층으로 한 방향으로만 흐르는 신경망. 입력층은 첫 번째 은닉층으로 입력값을 주기만 하고, 은닉층은 계산된 출력값을 입력층으로 되돌리지 않고 다음 층의 입력으로만 제공한다. 다층 전방향 신경망이 가장 널리 사용되는 구조다.",
    distinctions: [
      {
        from: "완전연결",
        how: "전방향은 정보 흐름의 방향에 대한 말이고 완전연결은 연결의 촘촘함에 대한 말이다. 전방향이라는 말이 완전연결을 뜻하지는 않는다.",
      },
    ],
    related: ["t-recurrent-network", "t-fully-connected", "t-layer-structure", "t-perceptron", "t-mlp"],
    lectures: [9],
    basis: "교재 11.1.3 (그림 11-4, 11-6) · 강의록 연결 구조 — 정보 흐름의 방향",
    aliases: ["feed-forward", "feedforward", "전방향"],
  },
  {
    id: "t-recurrent-network",
    term: "회귀 신경망",
    en: "Recurrent Neural Network, RNN",
    category: "개념",
    short: "출력층의 신호를 다시 입력층으로 되돌리는 신경망.",
    definition:
      "출력층의 신호를 다시 입력층으로 되돌리는 신경망. 전방향 신경망의 변형으로, 그 밖에 같은 층 내에서 상호 연결을 허용하는 신경망이나 층상 구조를 이루지 않고 모든 뉴런이 서로서로 연결된 구조를 가지는 신경망도 있다.",
    related: ["t-feedforward", "t-layer-structure", "t-neural-network"],
    lectures: [9],
    basis: "교재 11.1.3 (그림 11-6) · 강의록 연결 구조 — 정보 흐름의 방향",
    aliases: ["RNN", "recurrent", "순환 신경망", "회귀신경망"],
  },
  {
    id: "t-fully-connected",
    term: "완전연결",
    en: "fully connected, dense",
    category: "개념",
    short: "이웃한 두 층의 모든 뉴런이 빠짐없이 이어진 구조.",
    definition:
      "같은 층 안에서는 연결이 없고 이웃한 두 층 사이에서는 모든 뉴런이 연결을 가지는 구조. 촘촘하게 연결되어 있다는 뜻에서 dense network라고도 한다. 다층 전방향 신경망은 기본적으로 완전연결이며, 퍼셉트론과 다층 퍼셉트론도 모두 완전연결 구조다.",
    formula: [{ expr: "연결 수 = Σ(이웃한 두 층의 뉴런 수의 곱)", note: "예: 3-4-2 구조이면 3×4 + 4×2 = 20개" }],
    distinctions: [
      {
        from: "전방향",
        how: "딥러닝에는 완전연결이 아닌 전방향 구조도 많아, 이와 구별하기 위해 완전연결이라는 이름을 따로 쓴다.",
      },
    ],
    related: ["t-feedforward", "t-layer-structure", "t-perceptron", "t-mlp"],
    lectures: [9],
    basis: "교재 11.1.3 (그림 11-4) · 강의록 연결 구조 — Fully connected network",
    emphasis: "“전방향 신경망은 항상 완전연결이다”는 틀린 말. 두 용어는 서로 다른 기준이다.",
    aliases: ["fully connected", "dense", "완전 연결", "FC"],
  },

  /* ─────────── 학습 ─────────── */
  {
    id: "t-hebbian-rule",
    term: "헤브의 학습 규칙",
    en: "Hebbian learning rule",
    category: "알고리즘",
    short: "연결된 두 신경세포가 동시에 활성화되면 가중치를 증가시킨다.",
    definition:
      "도널드 올딩 헤브(Donald Olding Hebb)에 의해 개발된 가장 기본적인 학습 방법으로, 연결된 두 신경세포가 동시에 활성화되면 가중치를 증가시키는 방향으로 학습한다. 이후 좀 더 발전된 형태로 퍼셉트론 학습과 델타 학습, 그리고 이를 발전시킨 오류 역전파 학습 알고리즘 등이 있다.",
    example: "파블로프의 개 실험 — 종소리와 먹이가 함께 주어지는 일이 반복되면 종소리 쪽 연결 강도가 커진다.",
    related: ["t-weight-update", "t-perceptron-learning-rule", "t-backpropagation", "t-weight"],
    lectures: [9],
    basis: "교재 11.1.3 신경망의 구성 요소 · 강의록 신경망의 구성 요소 ③ 학습 — 인간 뇌에서의 학습",
    aliases: ["Hebbian", "헤브", "헤비안", "파블로프"],
  },
  {
    id: "t-weight-update",
    term: "가중치 수정식",
    en: "weight update rule",
    category: "수식·지표",
    short: "w⁽ᵗ⁺¹⁾ = w⁽ᵗ⁾ + Δw⁽ᵗ⁾. Δw를 정하는 방법이 곧 학습 알고리즘.",
    definition:
      "신경망에서의 학습은 신경망이 원하는 기능을 수행할 수 있도록 시냅스의 연결 강도(가중치)를 변화시키는 것이며, 이를 반복적인 수정으로 표현한 식. 현재 가중치에 가중치 변화량을 더해 학습 후 가중치를 얻는다. 가중치 변화량을 결정하는 방법이 곧 학습 알고리즘이며, 여기에 학습 데이터가 쓰인다.",
    formula: [{ expr: "w⁽ᵗ⁺¹⁾ = w⁽ᵗ⁾ + Δw⁽ᵗ⁾", note: "학습 후 가중치 = 현재 가중치 + 가중치 변화량" }],
    related: ["t-hebbian-rule", "t-perceptron-learning-rule", "t-backpropagation", "t-learning-rate", "t-weight"],
    lectures: [9],
    basis: "교재 11.1.3 신경망의 구성 요소 · 강의록 신경망의 구성 요소 ③ 학습",
    aliases: ["weight update", "가중치 갱신", "가중치 변화량"],
  },

  /* ─────────── 다층 퍼셉트론 ─────────── */
  {
    id: "t-mp-neuron",
    term: "M-P 뉴런",
    en: "McCulloch-Pitts neuron",
    category: "알고리즘",
    short: "1943년의 첫 신경세포 모델. 계단함수로 이진 출력을 내 논리 함수를 구현한다.",
    definition:
      "1943년 워런 맥컬록(Warren MaCulloch)과 월터 피츠(Walter Pitts)에 의해 제안된, 신경망 연구의 첫 시도. 신경세포를 모방하여 논리 함수를 구현하는 모델을 만들기 위해 제안되었으며, 활성화 함수로 계단함수를 적용함으로써 이진 출력을 내도록 고안되었다.",
    formula: [{ expr: "yⱼ = φ_step( Σᵢ₌₁ⁿ wᵢⱼxᵢ + w₀ⱼ )", note: "식 11-2" }],
    related: ["t-perceptron", "t-step-function", "t-bias", "t-artificial-neuron"],
    lectures: [9],
    basis: "교재 11.2.1 M-P 뉴런과 퍼셉트론 (식 11-2) · 강의록 M-P 뉴런",
    aliases: ["MP 뉴런", "McCulloch", "Pitts", "1943"],
  },
  {
    id: "t-bias",
    term: "바이어스",
    en: "bias",
    category: "수식·지표",
    short: "임계치 θ를 식의 반대편으로 옮겨 쓴 가중치 w₀. w₀ = −θ.",
    definition:
      "식 11-2의 w₀로, 식 11-1의 θ와 동일한 임계치 역할을 하는 것. 입력의 가중합이 −w₀보다 크지 못하면 0의 출력을 낸다. 항상 1이 들어오는 입력 하나를 더 두고 그 가중치로 보면 다른 가중치와 똑같이 학습된다. 다층 퍼셉트론에서는 은닉 노드로의 바이어스 w₀ⱼ와 출력 노드로의 바이어스 v₀ₖ로 나타난다.",
    formula: [
      { expr: "u ≥ θ  ⇔  u + w₀ ≥ 0,  w₀ = −θ" },
      { expr: "uⱼʰ = Σᵢ wᵢⱼxᵢ + w₀ⱼ", note: "식 11-5" },
    ],
    distinctions: [
      {
        from: "임계치 θ",
        how: "같은 역할을 하는 값을 식의 어느 쪽에 쓰느냐의 차이다. 바이어스로 쓰면 임계치까지 학습 대상에 포함된다.",
      },
    ],
    related: ["t-mp-neuron", "t-weighted-sum", "t-weight", "t-mlp"],
    lectures: [9],
    basis: "교재 11.2.1 (식 11-2) · 11.2.2 (식 11-5) · 강의록 M-P 뉴런, 다층 퍼셉트론의 구조와 함수식",
    aliases: ["bias", "임계치", "threshold", "w0"],
  },
  {
    id: "t-perceptron",
    term: "퍼셉트론",
    en: "Perceptron",
    category: "알고리즘",
    short: "1958년 로젠블랫의 단층 전방향 신경망. 패턴인식을 수행하는 최초의 기계.",
    definition:
      "M-P 뉴런을 여러 개 결합하여 네트워크 형태를 갖춘 신경망으로, 1958년 프랭크 로젠블랫(Frank Rosenblatt)이 개발했다. 신경세포들의 연결을 통하여 패턴인식을 수행하는 최초의 기계이며 단층 전방향 신경망(single-layer feed forward network) 구조다. 뉴런은 M-P 뉴런(계단함수), 연결 구조는 단층·전방향·완전연결, 학습 규칙은 이진 입출력을 사용한 지도학습이다.",
    role: "처음 발표되었을 당시 주목받았던 가장 큰 이유는 원하는 패턴을 학습할 수 있는 학습 능력(가중치 조절 규칙)을 갖추고 있었기 때문.",
    distinctions: [
      {
        from: "다층 퍼셉트론",
        how: "퍼셉트론은 은닉층이 없어 결정경계가 직선 하나뿐이고 계단함수를 쓴다. 다층 퍼셉트론은 은닉층을 가지며 은닉 뉴런에 시그모이드·하이퍼탄젠트 같은 비선형 함수를 쓴다.",
      },
    ],
    prereqs: ["pre-hyperplane", "pre-sigma"],
    related: ["t-mp-neuron", "t-perceptron-learning-rule", "t-xor-problem", "t-mlp", "t-single-multi-layer", "t-fully-connected"],
    lectures: [9],
    basis: "교재 11.2.1 M-P 뉴런과 퍼셉트론 (그림 11-8) · 강의록 퍼셉트론",
    emphasis: "뉴런(계단함수) · 연결 구조(단층 전방향 완전연결) · 학습 규칙(이진 입출력 지도학습) 세 가지로 묶어 외울 것.",
    aliases: ["Perceptron", "퍼셉트론", "Rosenblatt", "로젠블랫", "1958"],
  },
  {
    id: "t-perceptron-learning-rule",
    term: "퍼셉트론 학습 규칙",
    en: "perceptron learning rule",
    category: "수식·지표",
    short: "wᵢⱼ ← wᵢⱼ + η(tⱼ − yⱼ)xᵢ. 목표와 실제의 차이에 입력을 곱해 가중치를 고친다.",
    definition:
      "“만일 어떤 입력 뉴런의 활성이 어떤 출력 뉴런이 잘못된 결과를 내는 데 공헌하였다면, 두 신경세포 간의 연결 가중치를 그것에 비례하여 조절해 주어야 한다”는 기본 규칙을 수식으로 표현한 것. 목표 출력값과 현재 출력값의 차이에 입력값을 곱하여 이에 비례하는 작은 값으로 가중치를 수정한다. 목표 출력값을 사용하므로 퍼셉트론은 지도학습을 하는 신경망이다.",
    formula: [{ expr: "wᵢⱼ⁽ᵗ⁺¹⁾ = wᵢⱼ⁽ᵗ⁾ + η(tⱼ − yⱼ)xᵢ", note: "식 11-3. tⱼ는 목표 출력값, η는 학습률" }],
    example:
      "t = 0인데 y = 1이면 (t − y) = −1이므로 가중치가 줄고, t = 1인데 y = 0이면 (t − y) = +1이므로 가중치가 는다. 맞혔으면 (t − y) = 0이라 변화가 없다.",
    prereqs: ["pre-sigma"],
    related: ["t-perceptron", "t-learning-rate", "t-weight-update", "t-supervised-learning", "t-target-output"],
    lectures: [9],
    basis: "교재 11.2.1 (식 11-3) · 강의록 퍼셉트론 — 학습 규칙",
    aliases: ["perceptron learning rule", "식 11-3"],
  },
  {
    id: "t-learning-rate",
    term: "학습률",
    en: "learning rate",
    category: "수식·지표",
    short: "가중치 변화량을 얼마만큼 반영할지 정하는 값 η.",
    definition:
      "가중치 수정식에서 계산된 변화량을 얼마만큼 반영할지를 결정하는 값. 이 값이 크면 가중치의 변화량이 크고, 작으면 변화가 작아 학습이 더 안정적으로 진행된다. 보통 1보다 작은 값을 쓴다.",
    formula: [{ expr: "Δwᵢⱼ = η(tⱼ − yⱼ)xᵢ", note: "η가 변화의 보폭" }],
    related: ["t-perceptron-learning-rule", "t-weight-update", "t-gradient-descent", "t-hyperparameter"],
    lectures: [9],
    basis: "교재 11.2.1 (식 11-3) · 강의록 퍼셉트론 — 학습 규칙",
    emphasis: "학습률은 보폭만 정할 뿐 결정경계가 표현할 수 있는 모양을 바꾸지는 못한다. XOR가 풀리지 않는 것은 학습률 탓이 아니다.",
    aliases: ["learning rate", "eta", "η", "학습율"],
  },
  {
    id: "t-xor-problem",
    term: "XOR 문제",
    en: "XOR problem",
    category: "개념",
    short: "직선 하나로는 나눌 수 없어 퍼셉트론이 풀 수 없는 논리 함수.",
    definition:
      "두 개의 입력 노드와 하나의 출력 노드를 가지는 퍼셉트론이 XOR 논리 함수를 표현하도록 학습하는 문제. 마빈 민스키(Marvin Minsky)와 시모어 페퍼트(Seymour Papert)가 퍼셉트론의 한계를 지적하며 예로 든 문제다. 퍼셉트론이 만드는 판별함수는 2차원 공간상 하나의 직선 z₁으로 나타나므로, 직선 z₁만을 사용해서는 XOR와 같은 출력을 내도록 결정경계를 만드는 것이 불가능하다.",
    role: "비선형 결정경계가 왜 필요한지, 그래서 은닉층이 왜 필요한지를 보여 주는 사례.",
    example:
      "(0,0)→0, (0,1)→1, (1,0)→1, (1,1)→0. 어떤 방향·절편의 직선을 그어도 네 점을 모두 맞힐 수 없고 최소 1개를 틀린다. 두 개의 직선을 결합해 그 사이의 띠만 1로 만들면 해결된다.",
    distinctions: [
      {
        from: "AND · OR 문제",
        how: "AND와 OR는 직선 하나로 나눌 수 있어 퍼셉트론 학습 규칙이 유한 번 만에 오분류 0에 도달한다. XOR는 도달하지 못한다.",
      },
    ],
    prereqs: ["pre-hyperplane"],
    related: ["t-perceptron", "t-mlp", "t-hidden-layer", "t-linear-separability", "t-decision-boundary"],
    lectures: [9],
    basis: "교재 11.2.1 M-P 뉴런과 퍼셉트론 — XOR 문제 (그림 11-9) · 강의록 퍼셉트론의 한계",
    emphasis:
      "퍼셉트론으로는 XOR를 해결할 수 없다는 지적이 신경망 연구가 한동안 가라앉는 계기가 되었고, 은닉층의 학습 방법은 1980년대 오류 역전파로 풀린다.",
    aliases: ["XOR", "배타적 논리합", "Minsky", "민스키", "Papert", "페퍼트"],
  },
  {
    id: "t-mlp",
    term: "다층 퍼셉트론",
    en: "Multi-Layer Perceptron, MLP",
    category: "알고리즘",
    short: "비선형 결정경계를 만들기 위해 은닉층을 추가한 다층 전방향 신경망.",
    definition:
      "1개 또는 그 이상의 은닉층을 가지는 다층 전방향 신경망 구조. 비선형 결정경계를 만들기 위하여 은닉층을 추가한 신경망을 다층 퍼셉트론이라고 한다. 뉴런은 비선형 매핑을 위한 활성화 함수(시그모이드·하이퍼탄젠트)를 쓰고, 연결 구조는 다층·전방향·완전연결이며, 학습 알고리즘은 지도학습인 오류 역전파 알고리즘이다.",
    role: "n개의 입력 뉴런, m개의 은닉 뉴런, M개의 출력 뉴런으로 구성되며, 입력 x가 주어졌을 때 k번째 출력은 함수 f_k(x, θ)로 나타난다.",
    formula: [
      { expr: "y_k = f_k(x, θ) = φ_o( Σⱼ₌₁ᵐ vⱼₖ φ_h( Σᵢ₌₁ⁿ wᵢⱼxᵢ + w₀ⱼ ) + v₀ₖ )", note: "식 11-4" },
      { expr: "y_k = φ_o(u_kᵒ),  u_kᵒ = Σⱼ vⱼₖzⱼ + v₀ₖ", note: "식 11-5" },
      { expr: "zⱼ = φ_h(uⱼʰ),  uⱼʰ = Σᵢ wᵢⱼxᵢ + w₀ⱼ", note: "식 11-5" },
      { expr: "θ = W ∪ V", note: "학습해야 할 모든 가중치" },
    ],
    distinctions: [
      {
        from: "퍼셉트론",
        how: "은닉층의 유무와 활성화 함수가 다르다. 퍼셉트론은 계단함수로 직선 하나만, 다층 퍼셉트론은 비선형 함수로 복잡한 결정경계를 만든다.",
      },
    ],
    prereqs: ["pre-composite-function", "pre-vector-notation-bold", "pre-sigma"],
    related: [
      "t-perceptron",
      "t-hidden-layer",
      "t-universal-approximation",
      "t-backpropagation",
      "t-sigmoid",
      "t-hyperbolic-tangent",
      "t-fully-connected",
    ],
    lectures: [9],
    basis: "교재 11.2.2 다층 퍼셉트론 (그림 11-10, 식 11-4, 11-5) · 강의록 다층 퍼셉트론의 구조와 함수식",
    emphasis: "네 개의 식(uⱼʰ, zⱼ, u_kᵒ, y_k)과 θ = W ∪ V라는 표기는 10강 학습 알고리즘에서 그대로 쓰이므로 반드시 익혀 둘 것.",
    aliases: ["MLP", "다층퍼셉트론", "Multi-Layer Perceptron", "다층 신경망"],
  },
  {
    id: "t-universal-approximation",
    term: "표현 능력",
    en: "representation ability / universal approximation",
    category: "개념",
    short: "하나의 은닉층을 가진 MLP는 어떠한 연속 함수도 원하는 오차만큼 가깝게 근사할 수 있다.",
    definition:
      "신경망은 입력과 출력을 매핑하는 어떤 형태의 함수도 표현할 수 있으며, 하나 이상의 은닉층을 가진 신경망은 어떤 형태의 함수도 원하는 오차 수준까지 근사 가능하다는 것이 수학적으로 이미 증명되어 있다. 하나의 은닉층(충분한 은닉 뉴런)을 가진 다층 퍼셉트론은 임의의 정확도로 모든 연속 함수의 근사 표현이 가능하므로 복잡한 비선형 결정경계도 표현할 수 있고, 따라서 복잡한 분류 문제도 성공적으로 해결할 수 있다.",
    formula: [
      {
        expr: "y = v₁₁tanh(w₁₁x₁ + w₀₁) + v₂₁tanh(w₁₂x₁ + w₀₂) + v₀₁",
        note: "식 11-6 — 은닉 뉴런 2개, 출력은 선형함수. 가중치만 바꿔도 매우 다양한 형태의 함수가 된다",
      },
    ],
    distinctions: [
      {
        from: "학습 능력",
        how: "표현 능력은 그런 가중치가 존재한다는 보장일 뿐이다. 무수히 많은 함수 중 주어진 문제에 맞는 것을 데이터로부터 찾아내는 것은 학습 능력의 몫이다.",
      },
    ],
    prereqs: ["pre-composite-function"],
    related: ["t-mlp", "t-hidden-layer", "t-hyperbolic-tangent", "t-decision-boundary", "t-backpropagation"],
    lectures: [9],
    basis: "교재 11.1.4 신경망의 특성 · 11.2.2 다층 퍼셉트론 (식 11-6, 그림 11-11) · 강의록 MLP의 표현 능력",
    emphasis: "표현 능력 자체는 더 이상 문제가 되지 않으며, 남은 문제는 그 함수를 찾아내는 학습이라고 정리.",
    aliases: ["universal approximation", "보편 근사", "표현능력", "일반화 능력", "학습 능력"],
  },
];
