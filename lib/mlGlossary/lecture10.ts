import type { GlossaryTerm } from "@/lib/mlGlossaryTypes";

/**
 * 10강 신경망 (2) — 교재 11.3 학습 알고리즘과 숫자 인식 응용에서 다루는 용어.
 *
 * 정의는 교재·강의록 표현을 보존하되 한 문장으로 읽히게 다듬었다.
 */
export const lecture10Terms: GlossaryTerm[] = [
  /* ─────────── 학습의 틀 ─────────── */
  {
    id: "t-gradient-descent",
    term: "기울기 강하 학습법",
    en: "gradient descent learning method",
    category: "알고리즘",
    short: "비선형적인 함수의 최소값을 찾아가는 반복적 알고리즘.",
    definition:
      "비선형적인 함수의 최소값을 찾아가는 반복적 알고리즘. 한 번에 전체 탐색공간의 최적해를 얻는 것이 아니라, 어떤 시점 τ의 파라미터 θ⁽τ⁾ 주변 정보만으로 오차값을 감소시킬 수 있는 방향을 찾아 θ⁽τ⁺¹⁾을 얻는 과정을 반복한다. 오차값을 감소시키는 방향은 오차함수를 파라미터로 편미분해 얻는 기울기에 비례한다.",
    role: "다층 퍼셉트론의 오차함수가 복잡한 비선형함수여서 선형회귀의 최소제곱법처럼 바로 풀 수 없을 때, 조금씩 해를 찾아가는 방법.",
    formula: [
      { expr: "θ⁽τ⁺¹⁾ = θ⁽τ⁾ + Δθ⁽τ⁾ = θ⁽τ⁾ − η ∂E(θ⁽τ⁾)/∂θ", note: "식 11-8" },
    ],
    distinctions: [
      {
        from: "최소제곱법",
        how: "선형회귀의 최적 파라미터는 한 번의 수식 계산으로 바로 구해지지만, 다층 퍼셉트론의 오차함수는 복잡한 비선형함수라 반복적으로 조금씩 찾아가야 한다.",
      },
    ],
    prereqs: ["pre-gradient", "pre-partial-derivative", "pre-local-global-min"],
    related: ["t-backpropagation", "t-learning-rate", "t-local-minimum", "t-plateau"],
    lectures: [10],
    basis: "교재 11.3.1 · 강의록 기울기 강하 학습법",
    emphasis:
      "수정폭을 충분히 작게 하면 기울기가 0이 되는 점에서 멈추므로 극소값에 도달하는 것은 보장된다. 다만 그것이 전역 극소라는 보장은 전혀 없다.",
    aliases: ["gradient descent", "경사하강법", "기울기 하강"],
  },
  {
    id: "t-backpropagation",
    term: "오류 역전파 학습 알고리즘",
    en: "error backpropagation learning algorithm",
    category: "알고리즘",
    short: "기울기 강하 학습법을 다층 퍼셉트론에 적용하여 실제로 구현 가능한 알고리즘으로 만든 것.",
    definition:
      "기울기 강하 학습법을 다층 퍼셉트론에 적용하여 실제로 구현 가능한 알고리즘화한 것. 학습 데이터의 출력값과 목표 출력값을 비교하여 출력 뉴런으로의 가중치 수정항을 계산하고, 다시 출력 뉴런의 오차를 이용하여 각 은닉 뉴런으로의 가중치 수정항을 계산하여 가중치를 조정한다. 출력 뉴런의 오차가 은닉 뉴런에 거꾸로 전파되어 오는 형태를 가지므로 오류 역전파라고 부른다.",
    role: "다층 퍼셉트론의 지도학습을 실제로 수행하는 표준 알고리즘. 딥러닝의 학습도 개념적으로 같은 방법을 사용한다.",
    formula: [
      { expr: "Δvⱼₖ = −η ∂E/∂vⱼₖ = −η δₖzⱼ", note: "은닉층 → 출력층" },
      { expr: "Δwᵢⱼ = −η ∂E/∂wᵢⱼ = −η δⱼxᵢ", note: "입력층 → 은닉층" },
    ],
    example:
      "출력층에서 계산된 오차를 은닉층에서 다시 재사용하므로 중복 계산을 피할 수 있다. 이것이 알고리즘의 핵심적인 특징이다.",
    distinctions: [
      {
        from: "SVM의 학습",
        how: "SVM은 라그랑주 승수와 이차계획법으로 이원적 문제를 풀어 학습한다. 오류 역전파는 신경망의 학습 방법이다.",
      },
    ],
    prereqs: ["pre-chain-rule-deep", "pre-partial-derivative"],
    related: [
      "t-gradient-descent",
      "t-forward-pass",
      "t-backward-pass",
      "t-output-delta",
      "t-hidden-delta",
      "t-mlp",
      "t-epoch",
    ],
    lectures: [10],
    basis: "교재 11.3.1 · 강의록 오류역전파 학습, MLP 학습: 오류역전파 학습 알고리즘",
    emphasis:
      "수식 유도를 다 따라가지 못하더라도 ‘출력의 오차가 거꾸로 전파되면서 가중치를 고친다’는 개념만은 반드시 가져가야 한다. 은닉층이 여러 개여도 같은 방식으로 계속 전달된다.",
    aliases: ["backpropagation", "역전파", "오류역전파", "BP"],
  },
  {
    id: "t-learning-rate",
    term: "학습률",
    en: "learning rate",
    category: "수식·지표",
    short: "학습의 속도를 조정하는 작은 실수값 η. 한 번에 고치는 폭을 정한다.",
    definition:
      "기울기 강하 학습법의 수정식에서 기울기에 곱해지는 상수값 η로, 학습의 속도를 조정하는 작은 실수값. η값이 크면 학습 속도가 빨라지나 학습이 불안정해지고, 반대로 작으면 안정적으로 학습할 수 있으나 속도가 느려진다.",
    role: "문제에 적합한 값을 정하여 학습 속도를 적절히 조정해 주어야 한다. 보통 1보다 작은 값에서 시작하여 학습 진행 상황에 따라 조정한다.",
    formula: [{ expr: "Δθ⁽τ⁾ = −η ∂E/∂θ" }],
    distinctions: [
      {
        from: "모멘텀 계수",
        how: "학습률은 현재 기울기에 곱해지는 값이고, 모멘텀 계수는 직전 단계의 수정항에 곱해져 관성의 역할을 하는 값이다.",
      },
    ],
    related: ["t-gradient-descent", "t-backpropagation", "t-hyperparameter", "t-plateau"],
    lectures: [10],
    basis: "교재 11.3.1 · 11.3.3 모델 설정 · 강의록 기울기 강하 학습법, MLP의 학습 전략",
    emphasis: "지역 극소를 벗어나기 위해 학습률을 적응적으로 조정하는 방법이 쓰인다.",
    aliases: ["eta", "η", "learning rate"],
  },
  {
    id: "t-forward-pass",
    term: "전방향 계산",
    en: "forward computation",
    category: "개념",
    short: "현재의 가중치로 입력에서 출력까지를 계산하는 단계.",
    definition:
      "현재의 가중치 wᵢⱼ, vⱼₖ를 이용하여 출력값을 계산하는 단계. 하나의 입력 데이터에 대하여 각 은닉 뉴런의 출력 zⱼ를 계산하고, 이어서 출력 뉴런의 출력값 yₖ를 계산한다.",
    formula: [
      { expr: "uⱼʰ = Σᵢ wᵢⱼxᵢ + w₀ⱼ , zⱼ = φʰ(uⱼʰ)" },
      { expr: "uₖᵒ = Σⱼ vⱼₖzⱼ + v₀ₖ , yₖ = φᵒ(uₖᵒ)" },
    ],
    related: ["t-backward-pass", "t-backpropagation", "t-mlp"],
    lectures: [10],
    basis: "교재 11.3.1 학습 알고리즘 ②-1, ②-2 · 강의록 MLP 학습: 오류역전파 학습 알고리즘",
    emphasis: "오류 역전파는 전방향 계산과 역방향 계산 두 단계가 한 쌍을 이룬다는 점을 기억해야 한다.",
    aliases: ["순전파", "forward pass"],
  },
  {
    id: "t-backward-pass",
    term: "역방향 계산",
    en: "backward computation",
    category: "개념",
    short: "출력의 오차를 거꾸로 전파해 가중치 수정항을 계산하는 단계.",
    definition:
      "현재의 가중치를 이용하여 오류를 계산하는 단계. 각 출력 노드의 출력값 yₖ와 목표 출력값 tₖ를 비교해 출력 뉴런으로의 가중치 수정항을 계산하고, 계산된 δₖ를 이용해 각 은닉 뉴런으로의 가중치 수정항을 계산한 뒤, 수정항과 학습률로 가중치 파라미터를 수정한다.",
    related: ["t-forward-pass", "t-output-delta", "t-hidden-delta", "t-weight-update"],
    lectures: [10],
    basis: "교재 11.3.1 학습 알고리즘 ②-3 ~ ②-5 · 강의록 MLP 학습: 오류역전파 학습 알고리즘",
    aliases: ["backward pass", "역전파 계산"],
  },
  {
    id: "t-output-delta",
    term: "출력 뉴런의 오차 δₖ",
    en: "output delta",
    category: "수식·지표",
    short: "k번째 출력 뉴런의 가중합에 대한 오차함수의 미분값. 목표 출력값과의 차이에 비례한다.",
    definition:
      "∂E/∂uₖᵒ에 해당하는 값으로, k번째 출력 뉴런의 출력값과 목표 출력값의 차이에 비례한다. 비례상수인 φᵒ′(uₖᵒ)는 출력 뉴런의 활성화 함수의 미분값으로 활성화 함수의 형태에 따라 달라진다.",
    formula: [
      { expr: "δₖ = −φᵒ′(uₖᵒ)(tₖ − yₖ)", note: "식 11-10" },
      { expr: "시그모이드 φᵒ′(uₖᵒ) = (1 − yₖ)yₖ" },
      { expr: "하이퍼탄젠트 φᵒ′(uₖᵒ) = (1 − yₖ)(1 + yₖ)" },
    ],
    role: "출력층 가중치의 수정항 ∂E/∂vⱼₖ = δₖzⱼ를 만들고, 은닉 뉴런의 δⱼ를 계산할 때 다시 쓰인다.",
    prereqs: ["pre-partial-derivative"],
    related: ["t-hidden-delta", "t-backpropagation", "t-weight-update", "t-saturation"],
    lectures: [10],
    basis: "교재 11.3.1 식 11-10 · 강의록 오류역전파 학습",
    aliases: ["delta_k", "δk", "출력 오차"],
  },
  {
    id: "t-hidden-delta",
    term: "은닉 뉴런의 오차 δⱼ",
    en: "hidden delta",
    category: "수식·지표",
    short: "모든 출력 뉴런의 δₖ에 가중치 vⱼₖ를 곱해 모두 더한 뒤 φʰ′를 곱한 값.",
    definition:
      "∂E/∂uⱼʰ에 해당하는 값으로, j번째 은닉 뉴런이 출력값의 오차에 어느 정도 영향을 미치고 있는지를 뜻한다. uⱼʰ는 모든 출력 뉴런의 가중합 uₖᵒ를 계산하는 데 쓰이므로, 각각의 출력 뉴런이 오차에 미치는 영향 δₖ에 가중치 vⱼₖ를 곱한 값을 모두 더해 얻는다.",
    formula: [
      { expr: "δⱼ = ∂E/∂uⱼʰ = Σₖ (∂E/∂uₖᵒ)(∂uₖᵒ/∂uⱼʰ) = φʰ′(uⱼʰ) Σₖ δₖvⱼₖ", note: "식 11-12 ~ 11-15" },
      { expr: "∂uₖᵒ/∂uⱼʰ = φʰ′(uⱼʰ) vⱼₖ", note: "식 11-14" },
    ],
    distinctions: [
      {
        from: "출력 뉴런의 오차 δₖ",
        how: "δₖ는 목표 출력값과의 차이에서 바로 계산되지만, 은닉 뉴런은 목표값과 직접 비교할 수 없으므로 δⱼ는 δₖ를 가중치로 섞어 거꾸로 받아 계산한다.",
      },
    ],
    prereqs: ["pre-chain-rule-deep"],
    related: ["t-output-delta", "t-backpropagation", "t-backward-pass", "t-hidden-layer"],
    lectures: [10],
    basis: "교재 11.3.1 식 11-15 · 강의록 오류역전파 학습",
    emphasis:
      "단순히 전달되는 것이 아니라 가중치를 곱한 다음 모두 더하는 형태로 전파된다. 이것이 ‘역전파’라는 이름의 내용이다.",
    aliases: ["delta_j", "δj", "은닉 오차"],
  },
  {
    id: "t-weight-update",
    term: "가중치 수정식",
    en: "weight update rule",
    category: "수식·지표",
    short: "수정항은 δ에 그 연결의 입력값을 곱한 것이고, 여기에 −η를 곱해 가중치를 고친다.",
    definition:
      "기울기 강하 학습법의 일반식에 각 층의 편미분값을 대입해 얻는 식. 출력 뉴런으로의 가중치 vⱼₖ는 각 출력 노드의 출력값과 목표 출력값의 차이 δₖ에 비례하는 만큼 수정하고, 각 은닉 뉴런으로의 가중치 wᵢⱼ는 각 출력 뉴런이 오차에 미치는 영향 δₖ에 가중치 vⱼₖ를 곱해 모두 더한 값에 비례하여 수정한다.",
    formula: [
      { expr: "Δvⱼₖ = −η ∂E/∂vⱼₖ = −η δₖzⱼ", note: "z₀ = 1 (바이어스)" },
      { expr: "Δwᵢⱼ = −η ∂E/∂wᵢⱼ = −η δⱼxᵢ", note: "x₀ = 1 (바이어스)" },
    ],
    related: ["t-backpropagation", "t-learning-rate", "t-output-delta", "t-hidden-delta"],
    lectures: [10],
    basis: "교재 11.3.1 학습 알고리즘 ②-5 · 교재 11장 요약 · 강의록 오류역전파 학습",
    aliases: ["수정항", "update rule"],
  },
  {
    id: "t-epoch",
    term: "에포크",
    en: "epoch",
    category: "개념",
    short: "전체 학습 데이터에 대하여 학습이 한 번 진행된 것.",
    definition:
      "전체 학습 데이터에 대하여 가중치 수정 과정이 한 번 완료된 것. 한 에포크가 끝날 때마다 학습 데이터 전체 집합 X에 대한 평균 제곱 오차를 계산하고, 그 값이 원하는 목표값보다 작으면 학습을 마치며 그렇지 않으면 반복한다.",
    distinctions: [
      {
        from: "가중치 수정 한 번",
        how: "온라인 모드에서는 한 에포크 동안 가중치를 N번 수정한다. 배치 모드일 때만 한 에포크에 수정이 한 번이다.",
      },
    ],
    related: ["t-online-batch-mode", "t-learning-curve", "t-early-stopping", "t-backpropagation"],
    lectures: [10],
    basis: "교재 11.3.1 학습 알고리즘 ③ · 강의록 학습 곡선",
    aliases: ["epoch", "학습 횟수"],
  },

  /* ─────────── 학습의 고려사항 ─────────── */
  {
    id: "t-local-minimum",
    term: "지역 극소",
    en: "local minimum",
    category: "개념",
    short: "주변에서만 가장 낮은 점. 기울기 강하 학습법이 멈추는 곳.",
    definition:
      "기울기가 0이 되어 더 이상 움직이지 않는 점 가운데, 전체 탐색공간에서 가장 낮은 전역 극소가 아닌 것. 파라미터가 움직이기 시작하는 점이 전역 극소에서 멀리 떨어져 있으면 학습 도중 처음 만나는 지역 극소에 도달한 후 더 이상 움직이지 않게 되는데, 이를 지역 극소의 문제라고 한다.",
    role: "기울기 강하 학습법이 극소값 도달은 보장하지만 전역 최적해는 보장하지 못한다는 한계를 드러내는 지점.",
    example:
      "해결책 — 학습률을 적응적으로 조정, 시뮬레이티드 어닐링, 초기치를 변화시키며 여러 번 학습, 충분히 많은 수의 은닉 노드 사용.",
    related: ["t-global-minimum", "t-gradient-descent", "t-simulated-annealing", "t-weight-initialization"],
    lectures: [10],
    basis: "교재 11.3.2 (1) 지역 극소의 문제 · 강의록 MLP 학습의 고려사항",
    emphasis:
      "찾아진 지역 극소가 원하는 정도의 오차값을 준다면 크게 문제되지 않는다는 점도 함께 짚는다.",
    aliases: ["local minima", "지역 극소점", "극소점"],
  },
  {
    id: "t-simulated-annealing",
    term: "시뮬레이티드 어닐링",
    en: "simulated annealing",
    category: "알고리즘",
    short: "학습 초기 단계에서 지역 극소로부터 빠져나올 여지를 만들어 주는 기법.",
    definition:
      "지역 극소의 문제를 해결하기 위해 쓰이는 기법으로, 학습의 초기 단계에서는 지역 극소로부터 빠져나올 수 있는 여지를 만들어 준다.",
    related: ["t-local-minimum", "t-gradient-descent"],
    lectures: [10],
    basis: "교재 11.3.2 (1) · 강의록 MLP 학습의 고려사항 — 지역 극소의 문제",
    aliases: ["simulated annealing", "담금질 기법"],
  },
  {
    id: "t-plateau",
    term: "플라토",
    en: "plateau",
    category: "개념",
    short: "오차함수의 기울기가 완만해 학습 속도가 급격히 느려지는 구간.",
    definition:
      "기울기를 따라 강하하는 방법에서 오차함수의 기울기가 완만한 지점에서 급격히 학습 속도가 느려지는 현상이 나타나는 구간. 많은 경우 기울기가 완만한 지역에서의 학습이 전체 학습 시간의 대부분을 차지하게 되어 결과적으로 학습이 매우 느려지는데, 이를 플라토 문제라고 한다.",
    distinctions: [
      {
        from: "지역 극소의 문제",
        how: "지역 극소는 기울기가 0이 되어 멈춰 버리는 문제이고, 플라토는 멈추지는 않지만 지나치게 느려지는 수렴 속도의 문제다.",
      },
    ],
    related: ["t-momentum", "t-gradient-descent", "t-local-minimum", "t-learning-rate"],
    lectures: [10],
    basis: "교재 11.3.2 (2) 수렴 속도의 문제 · 강의록 MLP 학습의 고려사항",
    aliases: ["plateau", "플래토", "플라토 문제"],
  },
  {
    id: "t-momentum",
    term: "모멘텀 방법",
    en: "momentum",
    category: "알고리즘",
    short: "직전 단계의 수정항을 추가로 더해 관성의 역할을 하도록 하는 가속화 방법.",
    definition:
      "플라토 문제를 해결하기 위해 바로 직전 단계의 수정에 사용된 수정항을 추가로 더해 주어 관성의 역할을 하도록 하는 방법. 이 밖의 가속화 방법으로 오차함수의 2차 미분을 사용하는 뉴턴 방법, 기울기를 새롭게 정의하여 사용하는 자연 기울기 방법 등이 제안되었다.",
    formula: [{ expr: "Δθ⁽τ⁾ = −η ∂E/∂θ + α Δθ⁽τ⁻¹⁾", note: "α는 직전 수정항에 곱해지는 계수" }],
    related: ["t-plateau", "t-gradient-descent", "t-learning-rate"],
    lectures: [10],
    basis: "교재 11.3.2 (2) · 강의록 MLP 학습의 고려사항 — 다양한 가속화 방법",
    aliases: ["momentum", "관성항"],
  },
  {
    id: "t-early-stopping",
    term: "학습 종료점",
    en: "early stopping",
    category: "개념",
    short: "검증 오차가 다시 증가하기 시작하는 지점에서 학습을 멈추는 것.",
    definition:
      "과다적합을 피할 수 있는 적절한 학습 종료 시점. 학습 데이터 집합 외에 검증 데이터 집합을 따로 두어 학습이 진행되는 과정에서 검증 집합에 대한 오차도 함께 계산하면, 학습 오차는 계속 줄어드는 반면 검증 오차는 어느 시점에서 다시 증가한다. 그 시점이 학습 데이터에 대한 과다적합이 발생하는 지점이므로 거기서 학습을 완료하는 것이 가장 바람직하다.",
    distinctions: [
      {
        from: "희망 오차에 의한 종료",
        how: "많은 경우 원하는 학습 오차를 시작 전에 알기 힘들고, 학습 오차가 작다고 해서 항상 좋은 결과를 주는 것도 아니다.",
      },
    ],
    related: ["t-overfitting", "t-validation-error", "t-learning-curve", "t-epoch", "t-generalization-error"],
    lectures: [10],
    basis: "교재 11.3.2 (3) 학습 종료점의 문제(그림 11-16) · 강의록 MLP 학습의 고려사항",
    aliases: ["early stopping", "조기 종료", "학습 종료 시점"],
  },
  {
    id: "t-hidden-node-count",
    term: "은닉 뉴런의 수",
    en: "number of hidden neurons",
    category: "개념",
    short: "학습 전 모델 구조를 설정할 때 정하는 값. 학습 속도와 해의 성능을 좌우한다.",
    definition:
      "은닉층에 두는 뉴런의 개수. 입력 뉴런과 출력 뉴런의 수는 주어진 데이터에 의해 결정되지만, 은닉 뉴런의 수는 실제 문제에서 학습의 속도와 찾아지는 해의 성능을 좌우하므로 문제에 맞게 적절히 정해야 한다. 다분히 문제에 의존적인 값이어서 정확한 해답은 주어지지 않으며, 입력 데이터의 차원과 데이터의 개수 등을 고려해 조정한다.",
    role: "많을수록 표현 가능한 함수가 다양하고 복잡해지지만, 계산 비용과 일반화 성능(많으면 과다적합 발생 가능성이 높아짐)을 함께 고려해야 한다.",
    example:
      "70 × 50 크기의 영상으로 숫자 0~9를 인식한다면 입력층은 3,500개, 출력층은 10개가 된다. 은닉층의 수는 기본 모델에서 한 개를 사용한다.",
    distinctions: [
      {
        from: "가중치·학습률·오차함수 목표값",
        how: "이들은 학습 알고리즘이 시작할 때 초기화·설정하는 값이지만, 은닉 뉴런의 수는 학습 전 모델 구조를 설정하는 단계에서 결정된다.",
      },
    ],
    related: ["t-hidden-layer", "t-overfitting", "t-model-complexity", "t-universal-approximation"],
    lectures: [10],
    basis: "교재 11.3.2 (4) 은닉 뉴런의 수 · 11.3.3 모델 설정 · 강의록 MLP 학습의 고려사항",
    emphasis:
      "은닉층은 기본적으로 한 개를 사용한다. 은닉 뉴런의 수만 충분하면 한 개의 은닉층으로도 원하는 형태의 함수를 모두 근사할 수 있음이 증명되어 있기 때문이다.",
    aliases: ["은닉 노드의 수", "hidden units"],
  },

  /* ─────────── 학습 전략 ─────────── */
  {
    id: "t-online-batch-mode",
    term: "학습 모드",
    en: "online / batch / mini-batch mode",
    category: "학습 유형",
    short: "한 에포크 동안 가중치를 몇 번 수정하는지로 갈리는 세 가지 학습 방식.",
    definition:
      "학습을 진행하는 방식의 구분. 온라인 모드는 각 데이터에 대해 가중치를 수정하므로 N개의 데이터에 대해 N번 수정하며, 오차가 감소하는 속도는 빠르나 학습이 불안정하다. 배치 모드는 N개의 모든 데이터에 대한 오차를 모두 더하여 한 번의 가중치 수정이 이루어지며, 오차의 감소 속도는 느리지만 안정적이다. 미니 배치 모드는 데이터를 작은 부분집합으로 나누어 한 번에 하나의 부분집합에 대해 가중치를 수정하는 것으로, N개의 데이터를 m개의 그룹으로 나누어 m번 수정하며 데이터의 규모가 큰 경우에 적합하다.",
    formula: [{ expr: "온라인 N번 · 배치 1번 · 미니 배치 m번 (한 에포크 기준)" }],
    related: ["t-epoch", "t-backpropagation", "t-mse"],
    lectures: [10],
    basis: "교재 11.3.3 (1) 학습 모드의 설정 · 강의록 MLP의 학습 전략",
    aliases: ["온라인 모드", "배치 모드", "미니 배치 모드", "mini-batch"],
  },
  {
    id: "t-weight-initialization",
    term: "초기 가중치 설정",
    en: "weight initialization",
    category: "개념",
    short: "작은 범위의 실수값으로 랜덤하게 설정한다.",
    definition:
      "학습을 시작할 때 가중치 파라미터에 넣어 두는 값. 신경망 모델의 초기 가중치는 작은 범위의 실수값으로 랜덤하게 설정하며, 학습률은 1보다 작은 값에서부터 시작하여 학습 진행 상황에 따라 조정한다.",
    role: "탐색의 시작점을 결정하므로, 초기치를 변화시키면서 여러 번 학습을 시도하는 것이 지역 극소 문제의 현실적인 해결책이 된다.",
    distinctions: [
      {
        from: "모두 같은 값으로 두는 것",
        how: "모든 가중치가 같으면 은닉 노드의 출력 zⱼ가 전부 같아지고 역전파되는 δⱼ도 같아져 수정량까지 같아진다. 은닉 노드를 여러 개 두어도 하나짜리 신경망처럼만 동작한다.",
      },
    ],
    related: ["t-local-minimum", "t-learning-rate", "t-hidden-node-count", "t-saturation"],
    lectures: [10],
    basis: "교재 11.3.3 (2) 모델 설정 · 강의록 MLP의 학습 전략 — 초기 조건 설정 · 공식 연습문제",
    emphasis: "‘임의의 작은 값’에서 ‘임의’, 곧 랜덤이라는 조건이 핵심이다.",
    aliases: ["초기 가중치", "weight initialization"],
  },
  {
    id: "t-output-activation",
    term: "출력층 활성화 함수",
    en: "output layer activation function",
    category: "개념",
    short: "회귀 문제는 선형 함수, 분류 문제는 시그모이드·소프트맥스를 쓴다.",
    definition:
      "출력 노드에서 사용하는 활성화 함수. 목표 출력값의 유형에 따라 선택하며, 목표 출력값이 임의의 실수값인 회귀 문제는 선형 함수를, 목표 출력값이 클래스 레이블인 분류 문제는 시그모이드 함수나 소프트맥스 함수를 선택한다.",
    distinctions: [
      {
        from: "은닉 노드의 활성화 함수",
        how: "은닉 노드는 비선형함수를 사용해야 하며, 시그모이드 함수·하이퍼탄젠트 함수·ReLU 함수를 쓴다. 소프트맥스는 은닉 노드에는 쓰지 않는다.",
      },
    ],
    related: ["t-softmax", "t-sigmoid", "t-activation-function", "t-cross-entropy", "t-squared-error"],
    lectures: [10],
    basis: "교재 11.3.3 (2) 모델 설정 · 강의록 MLP의 학습 전략 — 활성화 함수",
    aliases: ["출력 노드 활성화 함수"],
  },
  {
    id: "t-softmax",
    term: "소프트맥스 함수",
    en: "softmax function",
    category: "수식·지표",
    short: "출력 노드의 지수값들의 합에 대한 비율. 모두 더하면 1이 된다.",
    definition:
      "출력 노드의 중간 계산 결과 uₖᵒ에 대한 지수값들을 모두 더한 값에 대한 비율로 나타내는 활성화 함수. 최대값을 더욱 활성화하고 최대값이 아닌 값은 억제하여 0에 가깝게 만드는 효과를 가졌으며, 단순히 최대값 여부에 따라 0과 1로 변환하는 맥스(max) 함수에 대한 부드러운(soft) 버전이라는 의미이다.",
    formula: [{ expr: "yₖ = fₖ(xᵢ, θ) = exp(uₖᵒ) / Σᵢ exp(uᵢᵒ)", note: "식 11-18" }],
    role: "목표 출력값이 클래스 레이블인 분류 문제의 출력 노드 활성화 함수로 주로 사용되며, 교차엔트로피 오차함수와 함께 쓰인다.",
    distinctions: [
      {
        from: "시그모이드 함수",
        how: "시그모이드는 각 출력 노드를 따로 0~1로 만들 뿐 출력값의 합이 1이 된다는 보장이 없다. 소프트맥스는 같은 층의 모든 값을 함께 써서 비율을 내므로 합이 반드시 1이 된다.",
      },
    ],
    prereqs: ["pre-exp-log", "pre-numerical-stability"],
    related: ["t-cross-entropy", "t-output-activation", "t-one-hot", "t-sigmoid"],
    lectures: [10],
    basis: "교재 11.3.3 식 11-18 · 강의록 MLP의 학습 전략 — 오차함수",
    emphasis: "활성화 함수에 의한 출력값을 모두 더하면 1이 된다는 점이 이 함수의 핵심 성질이다.",
    aliases: ["softmax", "소프트맥스"],
  },
  {
    id: "t-cross-entropy",
    term: "교차엔트로피 오차함수",
    en: "cross entropy error function",
    category: "수식·지표",
    short: "목표 출력값이 0 또는 1을 갖는 분류 문제에 적합한 오차함수.",
    definition:
      "목표 출력값과 실제 출력값의 차이를 로그로 계산하는 오차함수. 목표 출력값이 0 또는 1을 갖는 분류 문제, 그리고 출력 노드의 활성화 함수로 소프트맥스 함수를 사용할 때 적합하다.",
    formula: [{ expr: "E_crs(X, θ) = Σ_p Σ_k t_pk ln fₖ(xᵢ, θ)", note: "식 11-17" }],
    distinctions: [
      {
        from: "제곱 오차함수",
        how: "제곱 오차함수는 목표 출력값이 연속한 실수값을 갖는 회귀 문제에 적합하고, 교차엔트로피는 클래스 레이블을 갖는 분류 문제에 적합하다.",
      },
    ],
    prereqs: ["pre-exp-log"],
    related: ["t-softmax", "t-squared-error", "t-one-hot", "t-output-activation", "t-error-function"],
    lectures: [10],
    basis: "교재 11.3.3 식 11-17 · 강의록 MLP의 학습 전략 — 오차함수",
    emphasis: "분류 문제에서 교차엔트로피 오차함수와 소프트맥스 함수는 하나의 쌍처럼 함께 사용된다.",
    aliases: ["cross entropy", "교차 엔트로피"],
  },
  {
    id: "t-squared-error",
    term: "제곱 오차함수",
    en: "squared error function",
    category: "수식·지표",
    short: "목표 출력값과 실제 출력값 차이의 제곱을 모두 더한 오차함수.",
    definition:
      "목표 출력값과 실제 출력값의 차이를 제곱해 모든 데이터와 모든 출력 노드에 대해 더한 오차함수. 목표 출력값이 연속한 실수값을 갖는 회귀 문제에 적합하다.",
    formula: [{ expr: "E_sqr(X, θ) = Σ_p ‖t_p − f(x_p, θ)‖² = Σ_p Σ_k (t_pk − fₖ(xᵢ, θ))²", note: "식 11-16" }],
    related: ["t-cross-entropy", "t-mse", "t-error-function", "t-output-activation"],
    lectures: [10],
    basis: "교재 11.3.3 식 11-16 · 강의록 MLP의 학습 전략 — 오차함수",
    aliases: ["squared error", "제곱오차"],
  },
  {
    id: "t-mse",
    term: "평균 제곱 오차",
    en: "mean squared error",
    category: "수식·지표",
    short: "학습 데이터 전체 집합에 대한 오차를 데이터 개수로 나눈 값.",
    definition:
      "학습 데이터 전체 집합 X에 대한 오차를 목표 출력값과 신경망 출력값 차이의 제곱의 평균으로 정의한 것. 식 앞의 계수 1/2은 추후 학습식의 유도가 간단해지도록 추가한 값이다.",
    formula: [{ expr: "E(X, θ) = (1/2N) Σᵢ ‖tᵢ − f(xᵢ, θ)‖²", note: "식 11-7" }],
    role: "다층 퍼셉트론 학습의 목적함수. 최적의 가중치 θ*는 이 값을 최소화하는 θ다.",
    related: ["t-squared-error", "t-objective-function", "t-epoch", "t-learning-curve"],
    lectures: [10],
    basis: "교재 11.3.1 식 11-7 · 강의록 MLP의 학습",
    aliases: ["MSE", "평균제곱오차"],
  },
  {
    id: "t-one-hot",
    term: "원-핫 벡터",
    en: "one-hot vector",
    category: "개념",
    short: "해당 클래스 자리만 1이고 나머지는 모두 0인 목표 출력 벡터.",
    definition:
      "분류 문제에서 목표 출력값을 나타내는 방식. 출력 뉴런의 수를 클래스 레이블의 수로 설정하고, i번째 클래스에 속하는 데이터의 목표 출력값은 i번째 출력 뉴런만 1, 나머지는 0의 값으로 설정한다.",
    example: "MNIST에서 숫자 ‘2’의 목표 출력값은 10개 원소 중 2번만 1이고 나머지 9개가 0인 벡터.",
    related: ["t-softmax", "t-cross-entropy", "t-target-output", "t-mnist"],
    lectures: [10],
    basis: "강의록 데이터 셋팅 — 목표 출력값 설정 · 교재 11.3.3",
    aliases: ["one-hot", "원핫 벡터", "원핫벡터"],
  },

  /* ─────────── 숫자 인식 응용 ─────────── */
  {
    id: "t-mnist",
    term: "MNIST",
    en: "Modified National Institute of Standards and Technology database",
    category: "개념",
    short: "필기 숫자 인식의 벤치마크 데이터. 28×28 흑백 영상 7만 개.",
    definition:
      "손으로 쓴 숫자 영상을 10개의 클래스로 분류하는 문제에 쓰이는 벤치마크 데이터. 데이터 개수는 7만 개로 학습용 6만 개와 테스트용 1만 개로 나뉘며, 28×28 크기의 흑백 영상이고 각 픽셀은 0~255의 명도값을 가진다. 각 데이터에 대해 클래스 레이블 0~9가 함께 주어진다.",
    example:
      "28×28을 1차원으로 펴면 입력층의 노드 수는 784개가 되고, 출력층은 클래스 수와 같은 10개가 된다.",
    related: ["t-benchmark-data", "t-one-hot", "t-input-normalization", "t-lenet5", "t-flatten"],
    lectures: [10],
    basis: "강의록 데이터 준비 — 벤치마크 데이터",
    emphasis:
      "MNIST는 사실상 ‘해결된 문제’로 간주되어, 지금은 새로운 아키텍처를 검증하는 벤치마크로 활용된다.",
    aliases: ["엠니스트", "MNIST 데이터"],
  },
  {
    id: "t-benchmark-data",
    term: "벤치마크 데이터",
    en: "benchmark data",
    category: "개념",
    short: "여러 모델의 성능을 같은 기준으로 비교하기 위해 공통으로 쓰는 데이터 집합.",
    definition:
      "같은 문제에 대한 여러 방법의 성능을 비교할 수 있도록 널리 공유되는 데이터 집합. 필기 숫자 인식에서는 MNIST가 기본적으로 사용된다.",
    related: ["t-mnist", "t-generalization-error", "t-test-data"],
    lectures: [10],
    basis: "강의록 데이터 준비 — 벤치마크 데이터",
    aliases: ["benchmark"],
  },
  {
    id: "t-input-normalization",
    term: "입력값의 정규화",
    en: "normalization",
    category: "개념",
    short: "데이터가 가지는 값이 일정 범위 안에 있도록 조정하는 전처리.",
    definition:
      "데이터가 가지는 값이 일정 범위 안에 있도록 조정하는 것. 신경세포의 입력값이 크면 셀 포화의 가능성이 높아져 학습에 어려움이 있으므로, MNIST에서는 0~255 범위의 값을 0~1 범위의 값으로 조정한다.",
    formula: [{ expr: "x̃ = (x − 0) / (255 − 0)" }],
    related: ["t-saturation", "t-mnist", "t-preprocessing"],
    lectures: [10],
    basis: "강의록 데이터 셋팅 — 입력값의 전처리: 정규화",
    aliases: ["normalization", "정규화"],
  },
  {
    id: "t-saturation",
    term: "셀 포화",
    en: "saturation",
    category: "개념",
    short: "가중합이 너무 커지거나 작아져 활성화 함수의 출력이 0 또는 1에 붙어 버리는 구간.",
    definition:
      "신경세포로 들어오는 가중합이 어느 정도 이상 커지거나 작아져서 활성화 함수의 값이 거의 1 또는 거의 0이 되어 서로 구분되지 않는 구간. 이 구간에 있으면 학습이 어려워지는 문제가 생긴다.",
    role: "입력값을 일정 범위로 정규화해야 하는 이유.",
    example:
      "시그모이드에서 u가 커지면 φ′(u) = (1 − y)y가 0에 가까워진다. φ′은 δₖ와 δⱼ 양쪽에 곱해지므로 수정량 Δw도 함께 0에 가까워진다.",
    related: ["t-input-normalization", "t-sigmoid", "t-output-delta", "t-hidden-delta", "t-weight-initialization"],
    lectures: [10],
    basis: "강의록 데이터 셋팅 — 정규화의 필요성",
    emphasis:
      "활성화 함수의 값이 거의 0이나 1에 다 붙어 서로 구분이 안 되는 구간이 셀 포화이며, 여기에 들어가면 학습이 어려워진다.",
    aliases: ["saturation", "포화"],
  },
  {
    id: "t-learning-curve",
    term: "학습 곡선",
    en: "learning curve",
    category: "개념",
    short: "한 에포크가 끝날 때마다 학습 오차를 계산해 그 변화를 살펴보는 그래프.",
    definition:
      "한 에포크가 끝날 때마다 학습 오차를 계산하여 그 변화를 살펴보는 그래프. 학습이 어떻게 진행되고 있는지를 관찰하는 데 쓰인다.",
    role: "곡선의 모양을 보고 은닉 노드 수나 학습률 같은 설정을 조정하는 근거로 삼는다.",
    example:
      "MNIST에서 은닉 노드 20·50·100개의 학습 곡선을 겹쳐 보면, 은닉 노드가 많을수록 곡선이 아래쪽에 놓인다.",
    related: ["t-epoch", "t-early-stopping", "t-mse", "t-hidden-node-count"],
    lectures: [10],
    basis: "강의록 학습 곡선 — 학습 곡선을 이용한 학습 상황 관찰",
    emphasis:
      "학습 곡선이 평평해지면 은닉 노드 수를 늘려 보고, 곡선이 갑자기 달라지면 학습률을 조정하는 식으로 다음 수를 정한다.",
    aliases: ["learning curve"],
  },
  {
    id: "t-lenet5",
    term: "LeNet-5",
    en: "LeNet-5",
    category: "알고리즘",
    short: "1998년 Yann LeCun이 발표한 합성곱 신경망(CNN) 모델.",
    definition:
      "1998년 Yann LeCun이 논문 “Gradient-Based Learning Applied to Document Recognition”에서 발표한 합성곱 신경망(CNN) 모델. 당시 MNIST에서 오분류율 0.95%를 기록했다.",
    example:
      "같은 논문의 당시 비교 — 선형 분류기 12.0%, K-NN(K=3, 유클리디안 거리) 3.3%, K-NN(K=3, 탄젠트 거리) 1.1%, SVM 약 0.8%, MLP(은닉층 2개 300-100) 1.6%.",
    related: ["t-mnist", "t-deep-learning", "t-benchmark-data", "t-knn-classifier", "t-svm"],
    lectures: [10],
    basis: "강의록 LeNet-5 · MNIST 숫자인식 성능 비교",
    aliases: ["르넷", "LeNet"],
  },
];
