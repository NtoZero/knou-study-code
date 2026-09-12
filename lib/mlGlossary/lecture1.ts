import type { GlossaryTerm } from "@/lib/mlGlossaryTypes";

/**
 * 1강 머신러닝 소개에서 등장하는 용어.
 *
 * 정의는 강의록 표현을 보존하되 한 문장으로 읽히게 다듬었다.
 * 2~4강에서 다시 나오는 용어는 여기서 처음 소개된 뜻을 기준으로 삼는다.
 */
export const lecture1Terms: GlossaryTerm[] = [
  /* ─────────── 머신러닝의 개념 ─────────── */
  {
    id: "t-artificial-intelligence",
    term: "인공지능",
    en: "artificial intelligence, AI",
    category: "개념",
    short: "인간 지능을 모방하여 사람처럼 학습·이해하는 기계를 만드는 분야.",
    definition:
      "인간 지능을 모방하여 문제 해결을 위해 사람처럼 학습하고 이해하는 기계를 만드는 분야. 지능이 ‘주어진 문제를 해결하기 위해 이해하고 학습하는 능력’이라면, 그 능력을 기계에 구현하려는 분야가 인공지능이다.",
    role: "머신러닝과 딥러닝을 모두 품는 가장 넓은 테두리.",
    distinctions: [
      {
        from: "머신러닝",
        how: "인공지능 ⊃ 머신러닝 ⊃ 딥러닝의 포함 관계이며, 인공지능은 지능적인 기계 또는 프로그램의 개발 전체를, 머신러닝은 그중 학습 능력을 활용한 문제 풀이를 가리킨다.",
      },
    ],
    related: ["t-weak-ai", "t-strong-ai", "t-machine-learning", "t-deep-learning"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 개념 — 인공지능",
    example: "IBM Deep Blue(1997, 체스 프로그램)가 인공지능 영역의 대표 사례로 제시된다.",
    aliases: ["AI", "artificial intelligence", "에이아이"],
  },
  {
    id: "t-weak-ai",
    term: "약인공지능",
    en: "weak AI",
    category: "개념",
    short: "지능을 실제로 가졌는지와 무관하게 지능적인 것처럼 행동하는 기계.",
    definition:
      "실제 지능의 소유 여부 또는 처리 메커니즘과는 상관없이 지능적인 것처럼 행동하는 기계로, 단지 정의된 특정 목적을 달성하고 문제를 해결하여 나타나는 행동의 결과만 중시한다.",
    role: "지금까지 개발된 대부분의 인공지능 시스템이 속하는 범주.",
    example:
      "알파고는 인간의 지능을 실제로 가졌는지가 관심사가 아니라 바둑만 잘 두면 되는 시스템이므로 약인공지능이다.",
    distinctions: [
      {
        from: "강인공지능",
        how: "인간의 지능 수준을 어디까지 구현하느냐로 갈린다. 약인공지능은 행동의 결과만 보고, 강인공지능은 실제로 인간처럼 생각하는 것을 요구한다.",
      },
    ],
    related: ["t-strong-ai", "t-artificial-intelligence"],
    lectures: [1],
    basis: "1강 공식 연습문제 Q1",
    emphasis:
      "알파고가 약인공지능인지 강인공지능인지는 그대로 시험 문항이 된다. 특정 목적 하나만 달성하면 되는 시스템은 전부 약인공지능이라고 정리해 두면 흔들리지 않는다.",
    aliases: ["weak AI", "약 인공지능", "narrow AI"],
  },
  {
    id: "t-strong-ai",
    term: "강인공지능",
    en: "strong AI",
    category: "개념",
    short: "지능의 모방이 아니라 실제로 인간처럼 생각하는 기계.",
    definition:
      "지능의 모방이 아닌 실제로 인간처럼 생각하는 기계로, 스스로 문제를 정의하고 해결하며 지속적인 학습, 자의식, 감정 등의 광범위한 지적 능력을 포함한다.",
    role: "인공지능이 목표로 삼는 수준을 나타내는 기준점.",
    related: ["t-weak-ai", "t-artificial-intelligence"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 개념 — 인공지능",
    aliases: ["strong AI", "AGI", "Artificial General Intelligence", "Human-level AI", "범용 인공지능"],
  },
  {
    id: "t-turing-test",
    term: "튜링 테스트",
    en: "Turing test",
    category: "개념",
    short: "기계에 지능이 있는지를 대화로 판단하는 시험.",
    definition:
      "1950년 앨런 튜링이 제안한, 기계의 지능 유무를 판단하는 시험. 칸막이를 사이에 두고 질문자가 기계와 또 다른 사람에게 질문을 보낸 뒤 돌아온 답만으로 어느 쪽이 기계인지 판단하지 못하면 그 기계는 지능이 있다고 본다.",
    related: ["t-artificial-intelligence"],
    lectures: [1],
    basis: "강의록 1강 인공지능의 역사",
    aliases: ["Turing test", "튜링테스트", "앨런 튜링"],
  },
  {
    id: "t-ai-winter",
    term: "인공지능의 겨울",
    en: "AI winter",
    category: "개념",
    short: "인공지능에 대한 관심과 투자가 꺾였던 두 시기.",
    definition:
      "인공지능에 대한 관심이 올라가다가 꺾인 시기로, 1974년부터 1980년까지와 1987년부터 1993년 무렵까지 두 차례가 있었다. 두 번째 겨울을 지나 1990년대부터 머신러닝이 독립적인 분야로 자리 잡는다.",
    related: ["t-artificial-intelligence", "t-machine-learning"],
    lectures: [1],
    basis: "강의록 1강 인공지능의 역사",
    aliases: ["AI winter", "인공지능 겨울", "1974", "1987"],
  },
  {
    id: "t-machine-learning",
    term: "머신러닝",
    en: "machine learning",
    category: "개념",
    short: "데이터를 분석해 규칙이나 지식을 기계 스스로 추출하는 분야.",
    definition:
      "인간이 갖고 있는 고유의 지능적 기능인 학습 능력을 기계를 통해 구현하는 방법에 관한 분야로, 주어진 데이터를 분석하여 그로부터 일반적인 규칙이나 새로운 지식을 기계 스스로가 자동으로 추출하기 위한 접근 방법이다.",
    role: "명시적인 지식 표현이나 프로그램을 만드는 것이 어렵거나 불가능한 문제를 다루는 수단.",
    example:
      "같은 숫자 4라도 쓰는 사람마다 모양이 제각각이어서 규칙을 일일이 적기 어렵다. 이런 다양한 변형을 다루기 위해 머신러닝을 사용한다.",
    distinctions: [
      {
        from: "기존 문제 풀이 방법",
        how: "기존 방법은 사람이 규칙을 찾아 프로그램으로 만들고 데이터는 처리 대상이 된다. 머신러닝은 사람의 개입 없이 기계가 데이터로부터 규칙을 찾아내고, 데이터는 학습이나 테스트에 쓰이는 재료가 된다.",
      },
    ],
    related: ["t-artificial-intelligence", "t-deep-learning", "t-learning-system"],
    lectures: [1],
    basis: "1강 공식 연습문제 Q1",
    emphasis:
      "머신러닝이 언제 필요한지를 뒤집어 놓은 선택지가 자주 나온다. 명시적인 지식 표현이나 처리 절차가 이미 있는 문제는 머신러닝이 아니라 기존 방식으로 프로그램을 짜면 된다.",
    aliases: ["machine learning", "ML", "기계학습"],
  },
  {
    id: "t-deep-learning",
    term: "딥러닝",
    en: "deep learning",
    category: "개념",
    short: "심층 신경망을 기반으로 하는 머신러닝 분야.",
    definition:
      "심층 신경망 기반의 머신러닝 분야. 우리말로는 심층학습이라 하며, ‘깊다’는 말은 다루는 내용의 깊이가 아니라 신경망의 층이 많다는 뜻이다.",
    example: "알파고와 ChatGPT가 딥러닝 기술을 활용한 시스템의 대표 사례로 제시된다.",
    distinctions: [
      {
        from: "머신러닝",
        how: "딥러닝은 머신러닝의 한 분야이며, 학습 방법이 심층 신경망 기반인 경우로 한정된다. 기존의 모든 학습 방법을 깊이 있게 다루는 접근법을 총칭하는 말이 아니다.",
      },
    ],
    related: ["t-deep-neural-network", "t-hidden-layer", "t-machine-learning"],
    lectures: [1],
    basis: "1강 공식 연습문제 Q1",
    emphasis:
      "‘딥러닝은 기존의 모든 학습 방법을 깊이 있게 다루는 접근법’이라는 문장은 오답으로 그대로 쓰인다. 딥러닝의 범위는 심층 신경망 기반의 머신러닝으로 한정된다.",
    aliases: ["deep learning", "DL", "심층학습"],
  },
  {
    id: "t-deep-neural-network",
    term: "심층 신경망",
    en: "deep neural network",
    category: "개념",
    short: "입력층과 출력층 사이에 은닉층이 많이 쌓인 신경망.",
    definition:
      "입력층과 출력층 사이의 은닉층이 여러 층으로 깊게 쌓인 신경망. 은닉층이 몇십 개나 몇백 개인 경우도 있으며, 이런 신경망을 기반으로 하는 머신러닝 분야가 딥러닝이다.",
    related: ["t-deep-learning", "t-hidden-layer"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 개념 — 딥러닝",
    aliases: ["deep neural network", "DNN", "신경망"],
  },
  {
    id: "t-hidden-layer",
    term: "은닉층",
    en: "hidden layer",
    category: "개념",
    short: "신경망의 입력층과 출력층 사이에 숨어 있는 층.",
    definition:
      "신경망에서 입력층과 출력층 사이에 있는 층으로, 겉으로 드러나지 않고 숨어 있다는 뜻에서 은닉층이라 부른다. 은닉층이 많이 쌓인 신경망이 심층 신경망이다.",
    related: ["t-deep-neural-network", "t-deep-learning"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 개념 — 딥러닝",
    aliases: ["hidden layer", "히든 레이어", "은익층"],
  },

  /* ─────────── 머신러닝의 처리 과정 ─────────── */
  {
    id: "t-learning-stage",
    term: "학습 단계",
    en: "learning stage",
    category: "개념",
    short: "학습 데이터를 분석해 입·출력 매핑 함수를 찾는, 시스템을 개발하는 단계.",
    definition:
      "주어진 학습 데이터 집합을 입력받아 전처리와 특징추출을 거쳐 분석하고, 입력과 출력을 잘 매핑해 주는 함수 y = f(x)를 찾는 단계. 곧 시스템을 개발하는 단계다.",
    distinctions: [
      {
        from: "추론 단계",
        how: "학습 단계는 함수를 찾아 시스템을 만드는 단계이고, 추론 단계는 학습이 끝난 시스템을 실제 데이터에 적용하는 단계다. 시스템의 실제 성능 평가는 추론 단계에서 이뤄진다.",
      },
    ],
    related: ["t-inference-stage", "t-training-data", "t-learning-system"],
    lectures: [1],
    basis: "1강 공식 연습문제 Q2",
    emphasis:
      "학습 단계를 ‘시스템의 실제 성능을 평가하는 단계’라고 써 놓은 선택지가 나온다. 학습 단계는 개발, 성능 평가는 추론 단계라고 붙여서 외우면 된다.",
    aliases: ["learning stage", "training stage", "훈련 단계"],
  },
  {
    id: "t-inference-stage",
    term: "추론 단계",
    en: "inference stage",
    category: "개념",
    short: "학습이 끝난 시스템을 테스트 데이터에 적용하는 단계.",
    definition:
      "학습이 끝난 후 그 시스템을 실제 데이터에 적용하는 단계. 테스트 데이터에도 학습 때와 같은 전처리와 특징추출을 적용한 뒤, 학습 결과인 함수를 이용해 분류·회귀·군집화를 수행하여 판단 결과를 얻는다.",
    related: ["t-learning-stage", "t-test-data", "t-test-error"],
    lectures: [1],
    basis: "1강 공식 연습문제 Q2",
    emphasis:
      "추론 단계에는 테스트 데이터만 있으면 된다는 것이 답이지만, 전처리와 특징추출을 건너뛴다는 뜻은 아니다. 두 단계 모두 같은 전처리와 특징추출을 거친다.",
    aliases: ["inference stage", "test stage", "적용 단계"],
  },
  {
    id: "t-training-data",
    term: "학습 데이터",
    en: "training data",
    category: "개념",
    short: "학습 단계에서 사용하는 입력 데이터.",
    definition:
      "학습 단계에서 사용하는 입력 데이터. 시스템을 개발하려면 충분히 많은 양의 학습 데이터가 필요하며, 이 데이터로 계산한 오차가 학습 오차다.",
    distinctions: [
      {
        from: "테스트 데이터",
        how: "학습 데이터는 함수를 찾는 데 쓰고, 테스트 데이터는 학습이 끝난 뒤 성능을 평가하는 데 쓴다. 둘은 서로 같지 않은 데이터여야 한다.",
      },
    ],
    related: ["t-test-data", "t-training-error", "t-distribution-property"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 처리 과정 — 입력 데이터",
    aliases: ["training data", "훈련 데이터", "트레이닝 데이터"],
  },
  {
    id: "t-test-data",
    term: "테스트 데이터",
    en: "test data",
    category: "개념",
    short: "추론 단계에서 사용하는, 학습에 쓰지 않은 입력 데이터.",
    definition:
      "추론 단계에서 사용하는 입력 데이터로, 학습 데이터와 같지 않은 데이터를 사용한다. 이 데이터로 계산한 오차가 테스트 오차이며, 시스템의 실제 성능 평가에 사용된다.",
    related: ["t-training-data", "t-test-error", "t-inference-stage"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 처리 과정 — 입력 데이터",
    aliases: ["test data", "시험 데이터"],
  },
  {
    id: "t-preprocessing",
    term: "전처리",
    en: "preprocessing",
    category: "개념",
    short: "중복·불필요한 데이터를 없애고 분석하기 좋은 형태로 데이터를 가공·변환하는 과정.",
    definition:
      "중복되거나 불필요한 데이터를 제거하고 분석에 용이한 형태로 데이터를 가공·변환하는 과정. 문제 및 입력 데이터 유형에 의존적이며 머신러닝과 직접 관련이 없다.",
    example:
      "영상들의 크기가 서로 다르면 크기를 일정하게 맞추고, 입력값들의 범위가 서로 다르면 그 범위를 일정하게 만들어 준다.",
    distinctions: [
      {
        from: "특징추출",
        how: "전처리는 데이터를 다루기 좋은 형태로 손질하는 단계로 머신러닝과 직접 관련이 없고, 특징추출은 분석에 핵심이 되는 정보를 뽑아내는 단계로 머신러닝의 주요 문제 영역이다.",
      },
    ],
    related: ["t-feature-extraction", "t-learning-stage"],
    lectures: [1],
    basis: "1강 공식 연습문제 Q2",
    emphasis:
      "전처리를 머신러닝의 주요 핵심 주제라고 써 놓은 선택지는 틀린 것이다. 머신러닝이 관심을 갖는 자리는 특징추출과 분류·회귀·군집화다.",
    aliases: ["preprocessing", "전처리 과정", "정제"],
  },
  {
    id: "t-feature-extraction",
    term: "특징추출",
    en: "feature extraction",
    category: "개념",
    short: "데이터를 처리하는 데 핵심이 되는 정보를 뽑아내는 것.",
    definition:
      "주어진 데이터를 처리하는 데 핵심이 되는 정보를 추출하는 것. 목적은 계산량과 메모리 같은 비용을 절감하고 데이터에 포함된 불필요한 정보를 제거하는 데 있다.",
    role: "어떤 핵심 정보를 추출할 것인가는 머신러닝의 주요 문제 영역이며, 데이터 표현이라는 주제 자체이기도 하다.",
    example:
      "120 × 120 영상을 flatten하면 14,400차원이지만, 수평·수직으로 12개씩 나눈 격자 특징으로 표현하면 12 × 12 = 144차원이 된다.",
    formula: [
      { expr: "120 × 120 = 14,400", note: "원영상을 그대로 flatten한 차원" },
      { expr: "12 × 12 = 144", note: "격자 특징으로 표현한 차원" },
    ],
    prereqs: ["pre-dot-product"],
    related: ["t-projection", "t-transform-function", "t-representation-learning", "t-preprocessing"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 기본 요소 — 특징추출",
    emphasis:
      "격자 특징 144차원과 원영상 14,400차원은 계산까지 그대로 물어볼 수 있는 숫자다. 격자 특징 말고도 수직 히스토그램과 8개 방향 성분이 영상에 직관적으로 쓰이는 특징으로 함께 제시된다.",
    aliases: ["feature extraction", "특징 추출", "피처 추출"],
  },

  /* ─────────── 데이터 표현과 분포 ─────────── */
  {
    id: "t-random-vector",
    term: "랜덤 벡터",
    en: "random vector",
    category: "개념",
    short: "머신러닝에서 하나의 데이터를 나타내는 n차원 열벡터.",
    definition:
      "머신러닝에서 데이터를 표현하는 방식으로, n개의 값을 갖는 하나의 데이터를 n차원 열벡터로 나타낸 것. 진하게 소문자로 쓰며, n차원 공간상의 한 점에 해당한다.",
    formula: [
      { expr: "x = [x₁, x₂, …, xₙ]ᵀ", note: "크기는 n × 1이지만 세로로 쓰기 어려워 전치해 1 × n으로 적기도 함" },
    ],
    prereqs: ["pre-column-vector", "pre-transpose", "pre-random-variable"],
    related: ["t-dataset", "t-flatten"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 기본 요소 — 데이터 표현",
    aliases: ["random vector", "랜덤벡터", "데이터 벡터", "열벡터 표현"],
  },
  {
    id: "t-flatten",
    term: "flatten",
    en: "flatten",
    category: "개념",
    short: "2차원 배열을 1차원으로 쭉 펴는 것.",
    definition:
      "데이터를 1차원으로 쭉 변환하여 평평하게 만드는 것. 7 × 5 이진 영상을 flatten하면 35차원 벡터가 되고, 28 × 28 영상이면 784차원이 된다.",
    formula: [{ expr: "7 × 5 → 35차원", note: "x = [1,1,1,1,0, …, 1,1,1,1,1]ᵀ" }],
    prereqs: ["pre-column-vector"],
    related: ["t-random-vector", "t-feature-extraction"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 기본 요소 — 데이터 표현",
    emphasis:
      "flatten한 차원 수는 가로와 세로를 곱한 값이다. 7 × 5를 더해 12라고 적어 놓은 선택지가 나오므로 곱셈인지 확인하고 넘어가야 한다.",
    aliases: ["flatten", "플래튼", "평탄화", "1차원 변환"],
  },
  {
    id: "t-dataset",
    term: "데이터 집합",
    en: "data set",
    category: "개념",
    short: "n차원 데이터 N개를 모아 만든 n × N 행렬.",
    definition:
      "하나의 데이터가 n × 1 열벡터이고 그런 데이터가 N개 있을 때, 이들을 나란히 모아 만든 n × N 행렬. X = [x₁, x₂, ⋯, x_N]으로 쓴다.",
    formula: [{ expr: "X = [x₁, x₂, ⋯, x_N]  (n × N)", note: "행 개수 n은 차원, 열 개수 N은 데이터 개수" }],
    prereqs: ["pre-column-vector", "pre-matrix-mult"],
    related: ["t-random-vector", "t-distribution-property"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 기본 요소 — 데이터 분포",
    emphasis:
      "행렬의 크기를 N × n으로 뒤집어 놓은 선택지가 나온다. 데이터 하나가 세로로 서고 그것이 옆으로 N개 늘어선다고 그림을 떠올리면 n × N이 된다.",
    aliases: ["data set", "dataset", "데이터집합", "n×N 행렬"],
  },
  {
    id: "t-distribution-property",
    term: "분포 특성",
    en: "distribution property",
    category: "개념",
    short: "데이터들이 해당 공간에서 어떤 모양으로 퍼져 있는지를 나타내는 성질.",
    definition:
      "데이터 집합의 데이터들이 해당 공간상에서 분포된 모양. 2차원 데이터의 분포 특성은 산점도로 확인하며, 각 축의 값이 어떤 관계를 가지고 어떻게 흩어져 있는지를 함께 본다.",
    example:
      "가우시안 분포, 평균 (3, 3), 분산이 단위행렬인 모집단에서 N = 50개를 뽑아 산점도로 그린 것이 강의록의 예다.",
    prereqs: ["pre-scatter", "pre-population-sample", "pre-gaussian"],
    related: ["t-dataset", "t-training-data", "t-projection"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 기본 요소 — 데이터 분포",
    emphasis:
      "같은 모집단에서 50개씩 뽑아도 표본집합은 매번 다르다. 우리가 쓰는 학습 데이터 집합은 그런 표본집합 중 하나에 불과하므로, 학습 데이터에 집착하지 말고 모집단의 분포를 고민해야 하며 데이터는 많을수록 모집단에 가까워진다.",
    aliases: ["distribution", "분포특성", "데이터 분포"],
  },
  {
    id: "t-projection",
    term: "사영",
    en: "projection",
    category: "수식·지표",
    short: "데이터에서 어떤 방향으로 수선을 내려 하나의 특징값을 얻는 것.",
    definition:
      "데이터 x에서 방향 벡터 u 쪽으로 수선을 내려 특징값 xᵀu를 얻는 것. 데이터 유형에 덜 의존적이고 일반적으로 사용할 수 있는 특징추출 방법이다.",
    role: "n차원 데이터를 하나의 값으로 줄이는 차원 축소의 가장 기본적인 형태.",
    formula: [{ expr: "특징값 = xᵀu = uᵀx" }],
    example:
      "x = (2, 3)을 u = (1, 1) 방향으로 사영하면 xᵀu = 2 + 3 = 5. 두 개의 값이 5라는 하나의 값으로 축소된다. x축으로 내리면 2, x₂축으로 내리면 3이다.",
    prereqs: ["pre-dot-product", "pre-transpose"],
    related: ["t-feature-extraction", "t-pca", "t-lda"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 기본 요소 — 특징추출",
    emphasis:
      "어느 방향으로 사영해도 상관없다는 서술은 틀린 것이다. 단순한 차원 축소가 아니라 핵심 정보의 추출이 목적이므로, 주어진 데이터의 분포 특성을 가장 잘 나타낼 수 있는 방향을 찾아야 한다.",
    aliases: ["projection", "프로젝션", "정사영", "사영에 의한 특징추출"],
  },

  /* ─────────── 학습 시스템과 성능 평가 ─────────── */
  {
    id: "t-learning-system",
    term: "학습 시스템",
    en: "learning system",
    category: "개념",
    short: "데이터로부터 추출하려는 정보를 입·출력 매핑 함수로 표현한 시스템.",
    definition:
      "데이터로부터 학습을 통해 추출하고자 하는 정보를 표현하는 시스템으로, 입력 x를 출력 y로 보내는 입·출력 매핑 형태의 함수 y = f(x; θ)로 정의된다.",
    role: "학습이란 데이터를 이용해 이 함수 f를 찾는 것이고, 함수의 모양은 매개변수 θ가 결정하므로 결국 θ를 찾는 일이다.",
    formula: [{ expr: "y = f(x; θ)" }],
    related: ["t-parameter", "t-objective-function", "t-model-complexity"],
    lectures: [1],
    basis: "1강 공식 연습문제 Q1",
    emphasis:
      "머신러닝에서 학습이 무엇이냐를 묻는 문항의 답은 늘 ‘입력과 출력의 관계를 나타내는 매핑 함수를 찾는 것’이다. 학습의 궁극적 목표는 학습 데이터가 아니라 앞으로 주어질 새로운 데이터에 대한 성능을 최대로 하는 것이다.",
    aliases: ["learning system", "학습시스템", "모델"],
  },
  {
    id: "t-parameter",
    term: "매개변수",
    en: "parameter",
    category: "개념",
    short: "학습 시스템의 함수 모양을 결정하는 값.",
    definition:
      "학습 시스템의 함수 f(x; θ)에서 그 함수의 모양을 결정하는 값 θ. 데이터를 이용해 이 매개변수를 찾는 것이 곧 학습이다.",
    distinctions: [
      {
        from: "하이퍼파라미터",
        how: "매개변수는 학습으로 찾는 값이고, 학습 시스템의 복잡도처럼 학습 전에 정해 두는 값은 하이퍼파라미터다. 하이퍼파라미터까지 학습으로 최적화하려는 방법이 메타학습과 자동 머신러닝이다.",
      },
    ],
    related: ["t-learning-system", "t-meta-learning"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 기본 요소 — 성능평가",
    aliases: ["parameter", "세타", "theta", "θ", "파라미터"],
  },
  {
    id: "t-objective-function",
    term: "목적함수",
    en: "objective function",
    category: "수식·지표",
    short: "학습 시스템이 달성해야 하는 목표를 기계가 알 수 있는 수식으로 적어 둔 함수.",
    definition:
      "주어진 데이터 집합을 이용하여 학습 시스템이 달성해야 하는 목표를 기계가 알 수 있는 수학적 함수로 정의한 것. 이 함수를 최적화하는 것이 학습의 목표가 된다.",
    role: "‘새로운 데이터에 대한 성능을 최대로 하라’는 말을 컴퓨터가 실행할 수 있는 형태로 바꿔 주는 장치.",
    distinctions: [
      {
        from: "오차함수",
        how: "오차함수는 목적함수 중 가장 대표적인 것이다. 목적함수가 더 넓은 이름이고, 오차함수는 목표를 ‘오차를 줄이는 것’으로 구체화한 경우다.",
      },
    ],
    related: ["t-error-function", "t-learning-system"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 기본 요소 — 성능평가",
    aliases: ["objective function", "목적 함수"],
  },
  {
    id: "t-error-function",
    term: "오차함수",
    en: "error function",
    category: "수식·지표",
    short: "원하는 출력값과 시스템 출력값의 차이로 정의한 대표적인 목적함수.",
    definition:
      "원하는 출력값 yᵢ와 학습 시스템의 출력값 f(xᵢ; θ)의 차이, 곧 ‘오차’로 정의한 함수이며 가장 대표적인 목적함수. 학습의 목적은 이 오차를 최소화하는 것이다.",
    role: "목적에 따라 제곱오차, 크로스엔트로피 오차 등 여러 형태가 쓰인다.",
    related: ["t-objective-function", "t-loss-function", "t-squared-error", "t-training-error"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 기본 요소 — 성능평가",
    aliases: ["error function", "오차 함수", "크로스엔트로피 오차"],
  },
  {
    id: "t-loss-function",
    term: "손실함수 · 비용함수",
    en: "loss function / cost function",
    category: "수식·지표",
    short: "딥러닝에서 오차함수를 부르는 다른 이름.",
    definition:
      "오차함수를 딥러닝 분야에서 부르는 이름. 가리키는 대상은 같으며, 원하는 출력값과 시스템 출력값의 차이를 나타내고 이를 최소화하는 방향으로 학습을 진행한다.",
    related: ["t-error-function"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 기본 요소 — 성능평가",
    aliases: ["loss function", "cost function", "손실 함수", "비용 함수"],
  },
  {
    id: "t-training-error",
    term: "학습 오차",
    en: "training error",
    category: "수식·지표",
    short: "학습 데이터 집합을 대상으로 계산된 오차.",
    definition:
      "학습 데이터 집합 X_train을 대상으로 계산된 오차로, 목표 출력값과 시스템 출력값의 차이를 제곱해 평균 낸 값이다.",
    formula: [{ expr: "E_train = (1 / |X_train|) Σ_{xᵢ ∈ X_train} ( yᵢ − f(xᵢ; θ) )²" }],
    distinctions: [
      {
        from: "테스트 오차",
        how: "학습에 이미 사용한 데이터로 계산하므로 시스템의 실제 성능을 나타내지 못한다. 실제 성능 평가는 학습에 쓰지 않은 테스트 데이터로 계산한 테스트 오차로 한다.",
      },
    ],
    prereqs: ["pre-sigma"],
    related: ["t-test-error", "t-generalization-error", "t-error-function"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 기본 요소 — 성능평가",
    aliases: ["training error", "E_train", "훈련 오차"],
  },
  {
    id: "t-test-error",
    term: "테스트 오차",
    en: "test error",
    category: "수식·지표",
    short: "테스트 데이터 집합을 대상으로 계산된 오차.",
    definition:
      "테스트 데이터 집합 X_test를 대상으로 계산된 오차. 학습이 끝난 뒤 추론 단계에서 계산하며, 계산이 불가능한 일반화 오차를 대신하여 시스템의 실제 성능을 평가하는 데 사용된다.",
    formula: [{ expr: "E_test = (1 / |X_test|) Σ_{xᵢ ∈ X_test} ( yᵢ − f(xᵢ; θ) )²" }],
    prereqs: ["pre-sigma"],
    related: ["t-generalization-error", "t-empirical-error", "t-training-error"],
    lectures: [1],
    basis: "1강 공식 연습문제 Q3",
    emphasis:
      "실용적인 관점에서 시스템 성능을 평가하는 가장 현실적인 기준을 물으면 답은 테스트 오차다. 일반화 오차는 이론적 기준이지 현실적 기준이 아니다.",
    aliases: ["test error", "E_test", "시험 오차"],
  },
  {
    id: "t-generalization-error",
    term: "일반화 오차",
    en: "generalization error",
    category: "수식·지표",
    short: "관찰될 수 있는 모든 데이터를 대상으로 정의되는 오차.",
    definition:
      "관찰될 수 있는 모든 데이터를 대상으로 정의되는 오차로, 입력 데이터의 모든 분포에 대한 평균 기대치로 계산된다. 이 오차의 최소화가 실제 원하는 궁극적 목표다.",
    formula: [
      {
        expr: "E_gen = ∫_{−∞}^{∞} ( yᵢ − f(xᵢ; θ) )² p(x) dx",
        note: "p(x)는 모집단의 확률밀도함수",
      },
    ],
    distinctions: [
      {
        from: "테스트 오차",
        how: "일반화 오차는 궁극적 목표이지만 p(x)를 모르므로 계산이 불가능하고, 테스트 오차는 그 값에 대한 경험치로 실제 계산이 가능하다.",
      },
    ],
    prereqs: ["pre-pdf", "pre-population-sample", "pre-sigma"],
    related: ["t-test-error", "t-empirical-error", "t-cross-validation", "t-overfitting"],
    lectures: [1],
    basis: "1강 공식 연습문제 Q3",
    emphasis:
      "일반화 오차는 식에 모집단의 확률밀도 p(x)가 들어가서 실제로는 계산이 불가능하다. 그래서 시험에서 실용적 기준을 물으면 답은 테스트 오차다.",
    aliases: ["generalization error", "E_gen", "일반화오차"],
  },
  {
    id: "t-empirical-error",
    term: "경험 오차",
    en: "empirical error",
    category: "수식·지표",
    short: "테스트 오차의 다른 이름. 일반화 오차에 대한 경험치라는 뜻.",
    definition:
      "일반화 오차에 대한 경험치에 불과하다는 뜻에서 테스트 오차를 달리 부르는 이름. 이론적으로는 일반화 오차가 기준이지만 현실적으로 사용할 수 없으므로, 경험 오차로 시스템의 실제 성능을 평가한다.",
    related: ["t-test-error", "t-generalization-error"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 기본 요소 — 성능평가",
    aliases: ["empirical error", "경험오차"],
  },
  {
    id: "t-cross-validation",
    term: "교차검증법",
    en: "cross validation method",
    category: "알고리즘",
    short: "제한된 데이터로 일반화 오차에 더 가까운 오차값을 얻어 내는 방법.",
    definition:
      "제한된 데이터 집합을 이용하여 일반화 오차에 좀 더 근접한 오차값을 얻어 내기 위한 방법.",
    distinctions: [
      {
        from: "일반화 오차의 계산",
        how: "교차검증은 일반화 오차에 ‘좀 더 근접한’ 값을 얻는 방법일 뿐, 일반화 오차를 정확히 계산해 주지는 않는다. p(x)를 모른다는 사정은 그대로다.",
      },
    ],
    related: ["t-k-fold-cross-validation", "t-cv-error", "t-generalization-error"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 기본 요소 — 성능평가",
    aliases: ["cross validation", "교차 검증", "CV"],
  },
  {
    id: "t-k-fold-cross-validation",
    term: "K-분절 교차검증법",
    en: "K-fold cross validation",
    category: "알고리즘",
    short: "데이터를 K개로 나눠 한 분절씩 돌아가며 테스트에만 쓰는 교차검증.",
    definition:
      "데이터 집합을 K개의 분절로 나눈 뒤, 회차마다 한 분절을 학습에서 빼고 그 분절만 테스트에 사용하기를 K번 반복하는 방법. 각 회차의 테스트 오차를 평균 내어 교차검증 오차를 얻는다.",
    example:
      "5-분절이면 1회차는 X₁을 빼고 학습해 X₁로 테스트, 2회차는 X₂를 빼고 학습해 X₂로 테스트하는 식으로 5번 반복한다.",
    formula: [{ expr: "E_cv = (1 / K) Σ_{i=1}^{K} E_test(Xᵢ)" }],
    prereqs: ["pre-sigma"],
    related: ["t-cross-validation", "t-cv-error", "t-test-error"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 기본 요소 — 성능평가",
    emphasis:
      "평균을 내는 대상은 학습 오차가 아니라 각 회차의 테스트 오차다. 모든 분절을 학습에만 쓴다는 서술도 틀린 것이다.",
    aliases: ["K-fold", "k-fold cross validation", "K분절 교차검증", "5-분절"],
  },
  {
    id: "t-cv-error",
    term: "교차검증 오차",
    en: "cross validation error",
    category: "수식·지표",
    short: "각 회차의 테스트 오차를 평균 낸 값.",
    definition:
      "K-분절 교차검증법에서 각 회차의 테스트 오차 E_test(Xᵢ)를 모두 평균 낸 값 E_cv. 일반화 오차에 좀 더 근접한 오차값으로 사용한다.",
    prereqs: ["pre-sigma"],
    related: ["t-k-fold-cross-validation", "t-generalization-error"],
    lectures: [1],
    basis: "강의록 1강 머신러닝의 기본 요소 — 성능평가",
    aliases: ["E_cv", "cross validation error", "교차검증오차"],
  },

  /* ─────────── 머신러닝에서 다루는 주제 ─────────── */
  {
    id: "t-data-analysis",
    term: "데이터 분석",
    en: "data analysis",
    category: "개념",
    short: "분류·회귀·군집화를 묶어 부르는 머신러닝의 문제 영역.",
    definition:
      "머신러닝이 다루는 두 문제 영역 중 하나로, 분류·회귀·군집화가 여기에 속한다. 나머지 하나는 데이터 표현이다.",
    related: ["t-classification", "t-regression", "t-clustering", "t-data-representation"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제",
    aliases: ["data analysis", "데이터분석"],
  },
  {
    id: "t-data-representation",
    term: "데이터 표현",
    en: "data representation",
    category: "개념",
    short: "학습하기 좋도록 데이터를 어떻게 나타낼지 다루는 문제 영역.",
    definition:
      "머신러닝이 다루는 두 문제 영역 중 하나로, 학습하기 좋도록 데이터를 효율적으로 표현하는 방법을 다루며 특징추출이 여기에 속한다.",
    related: ["t-feature-extraction", "t-representation-learning", "t-data-analysis"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제",
    aliases: ["data representation", "데이터표현"],
  },
  {
    id: "t-classification",
    term: "분류",
    en: "classification",
    category: "개념",
    short: "입력 데이터가 어떤 부류에 속하는지를 자동으로 판단하는 문제.",
    definition:
      "입력 데이터가 이미 정해진 몇 개의 부류(class) 중 어디에 속하는지를 자동으로 판단하는 문제. 학습 데이터는 D = {(xᵢ, yᵢ)}이고 목표 출력값은 yᵢ ∈ {0, 1, ⋯, M−1}이다.",
    role: "개발되는 머신러닝 시스템 중 가장 많은 비중을 차지하는 문제 유형.",
    example: "숫자 인식, 얼굴 인식, 생체 인식, 음성 인식, 객체 인식처럼 ‘~ 인식’이라 부르는 문제들.",
    distinctions: [
      {
        from: "회귀",
        how: "분류의 출력은 0부터 M−1 중 하나인 이산적인 값이고 회귀의 출력은 연속적인 실수값이다. 그래서 분류는 회귀의 특별한 경우로 볼 수 있다.",
      },
    ],
    related: ["t-decision-boundary", "t-classification-rate", "t-regression", "t-supervised-learning"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제 — 데이터 분석: 분류",
    emphasis:
      "적용 방법으로는 베이즈 분류기, K-최근접이웃 방법, 결정 트리, 랜덤 포레스트, SVM, 신경망(MLP, CNN, LSTM)이 제시된다. 문제 유형과 방법을 짝지어 고르는 문항에서 그대로 쓰인다.",
    aliases: ["classification", "클래스피케이션", "인식"],
  },
  {
    id: "t-target-output",
    term: "목표 출력값",
    en: "target output",
    category: "개념",
    short: "학습할 때 시스템이 내야 할 정답으로 함께 주어지는 값.",
    definition:
      "학습 데이터 (xᵢ, yᵢ)에서 yᵢ에 해당하는 값으로, 그 입력에 대해 시스템이 출력해야 할 값. 지도학습에서는 이 값이 학습의 방향을 알려 주는 교사 역할을 한다.",
    example: "숫자 인식이라면 5라는 영상과 함께 ‘이것은 5라는 클래스에 속한다’를 붙여 하나의 학습 데이터를 만든다.",
    distinctions: [
      {
        from: "군집화의 학습 데이터",
        how: "분류와 회귀의 학습 데이터에는 목표 출력값이 함께 주어지지만, 군집화의 학습 데이터에는 목표 출력값이 없다.",
      },
    ],
    related: ["t-supervised-learning", "t-class-labeling", "t-classification", "t-regression"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제 — 데이터 분석: 분류",
    aliases: ["target output", "교사", "supervisor", "레이블", "정답값"],
  },
  {
    id: "t-decision-boundary",
    term: "결정경계",
    en: "decision boundary",
    category: "개념",
    short: "g(x; θ) = 0으로 경계 지어지는 입력 공간상의 경계.",
    definition:
      "결정함수가 0이 되는 자리, 곧 g(x; θ) = 0으로 경계 지어지는 입력 공간상의 경계. 분류의 학습 결과이며, 분류오차를 최소화하는 최적의 결정경계를 찾는 것이 학습 목표다.",
    example:
      "2차원 분류 예제에서 g(x) = g(x₁, x₂) = x₂ − x₁ = 0이면 결정경계는 x₂ = x₁ 직선이 된다.",
    prereqs: ["pre-hyperplane"],
    related: ["t-decision-function", "t-decision-rule", "t-classification", "t-model-complexity"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제 — 데이터 분석: 분류",
    emphasis:
      "결정경계·결정함수·결정규칙 셋을 서로 바꿔 놓은 선택지가 자주 나온다. 경계는 g(x) = 0인 자리, 함수는 g(x) 자체, 규칙은 부호를 보고 클래스를 정하는 방식이다.",
    aliases: ["decision boundary", "결정 경계", "판별 경계"],
  },
  {
    id: "t-decision-function",
    term: "결정함수",
    en: "decision function",
    category: "개념",
    short: "분류에 쓰이는 함수 g(x) 자체. 판별함수라고도 한다.",
    definition:
      "분류 시스템이 학습 결과로 만들어 내는 함수 g(x; θ) 자체를 가리키는 이름이며, 판별함수라고도 부른다. 이 함수가 0이 되는 자리가 결정경계다.",
    related: ["t-decision-boundary", "t-decision-rule"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제 — 데이터 분석: 분류",
    aliases: ["decision function", "discriminant function", "판별함수", "판별 함수", "g(x)"],
  },
  {
    id: "t-decision-rule",
    term: "결정규칙",
    en: "decision rule",
    category: "개념",
    short: "결정함수 값을 보고 최종 클래스를 정하는 규칙.",
    definition:
      "결정함수 g(x)를 이용해 데이터가 최종적으로 어떤 클래스에 속할지를 판정하는 규칙. 이진 클래스라면 g(x_new) ≥ 0이면 C₁, g(x_new) < 0이면 C₂로 판정한다.",
    formula: [{ expr: "y(x) = 1  if g(x) ≥ 0  (x ∈ C₁)  /  y(x) = 0  if g(x) < 0  (x ∈ C₂)" }],
    related: ["t-decision-function", "t-decision-boundary", "t-classification"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제 — 데이터 분석: 분류",
    aliases: ["decision rule", "결정 규칙", "판정 규칙"],
  },
  {
    id: "t-classification-rate",
    term: "분류율",
    en: "classification rate",
    category: "수식·지표",
    short: "분류 성공 데이터 개수를 전체 개수로 나눈 백분율.",
    definition:
      "전체 데이터 중 분류에 성공한 데이터의 비율을 백분율로 나타낸 분류 성능 평가 척도.",
    formula: [{ expr: "분류율(%) = (분류 성공 데이터 개수 / 전체 데이터 개수) × 100" }],
    distinctions: [
      {
        from: "분류 오차",
        how: "분류율은 성공한 개수, 분류 오차는 실패한 개수를 세며 둘을 더하면 100%가 된다.",
      },
    ],
    related: ["t-classification-error", "t-classification"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제 — 데이터 분석: 분류",
    aliases: ["classification rate", "분류 성공률", "정확도"],
  },
  {
    id: "t-classification-error",
    term: "분류 오차",
    en: "classification error",
    category: "수식·지표",
    short: "분류 실패 데이터 개수를 전체 개수로 나눈 백분율.",
    definition:
      "전체 데이터 중 분류에 실패한 데이터의 비율을 백분율로 나타낸 척도로, 델타 함수를 이용해 잘못 분류된 개수만 세는 식으로 정의된다.",
    formula: [{ expr: "E(D; θ) = (1 / N) Σ_{(xᵢ, yᵢ) ∈ D} δ( yᵢ − y(xᵢ) )" }],
    prereqs: ["pre-sigma"],
    related: ["t-classification-rate", "t-delta-function", "t-classification"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제 — 데이터 분석: 분류",
    aliases: ["classification error", "오분류율", "분류오차"],
  },
  {
    id: "t-delta-function",
    term: "델타 함수",
    en: "delta function",
    category: "수식·지표",
    short: "괄호 안이 0이면 0, 0이 아니면 1을 돌려주는 함수.",
    definition:
      "분류 오차식에 쓰이는 함수로, 괄호 안의 값이 0이면 0을, 0이 아니면 1을 돌려준다. 목표 출력값과 시스템 출력값이 같으면 학습이 잘된 것이고 다르면 잘못된 것이므로, 잘못된 것만 개수를 세는 장치다.",
    related: ["t-classification-error"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제 — 데이터 분석: 분류",
    emphasis:
      "0이면 1을 돌려준다고 뒤집어 놓은 선택지가 나온다. 세려는 것이 ‘틀린 개수’라는 점을 떠올리면 0일 때 0이 맞다.",
    aliases: ["delta function", "δ", "델타"],
  },
  {
    id: "t-regression",
    term: "회귀",
    en: "regression",
    category: "개념",
    short: "입력 변수와 출력 변수 사이의 매핑 관계를 찾는 문제.",
    definition:
      "입력 변수와 출력 변수 사이의 매핑 관계 y = f(x; θ)를 찾는 문제. 학습 데이터는 D = {(xᵢ, yᵢ)}이고 목표 출력값 yᵢ는 연속적인 실수값이다.",
    example:
      "주가 예측·환율 예측·판매 예측 같은 시계열 예측, BMI 수치로 체지방률 추정, 기저질환·성별·나이로 질병 위험도 판정, 국어·영어·수학 점수로 합격 가능성 평가.",
    distinctions: [
      {
        from: "분류",
        how: "출력이 연속적인 실수값이면 회귀, 0부터 M−1 중 하나인 이산적인 값이면 분류다.",
      },
    ],
    related: ["t-regression-function", "t-squared-error", "t-classification", "t-supervised-learning"],
    lectures: [1],
    basis: "1강 공식 연습문제 Q4",
    emphasis:
      "주가 예측에 맞는 기법을 고르라는 문항의 답은 선형회귀다. 예측할 값이 연속적인 실수인지부터 확인하면 K-최근접이웃·결정 트리 같은 분류 방법과 t-SNE 같은 특징추출 방법을 걸러낼 수 있다.",
    aliases: ["regression", "리그레션", "회기"],
  },
  {
    id: "t-regression-function",
    term: "회귀함수",
    en: "regression function",
    category: "개념",
    short: "회귀의 학습 결과로 얻는 입·출력 매핑 함수.",
    definition:
      "회귀 시스템이 학습 결과로 만들어 내는 함수 y = f(x; θ). 새로운 데이터 x_new를 넣으면 예측 결과 y_new를 돌려준다. 회귀오차를 최소화하는 최적의 회귀함수를 찾는 것이 학습 목표다.",
    related: ["t-regression", "t-squared-error"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제 — 데이터 분석: 회귀",
    aliases: ["regression function", "회귀 함수"],
  },
  {
    id: "t-squared-error",
    term: "제곱오차",
    en: "squared error",
    category: "수식·지표",
    short: "목표 출력값과 시스템 출력값의 차이를 제곱해 평균 낸 오차.",
    definition:
      "회귀오차를 나타내는 대표적인 방식으로, 목표 출력값 yᵢ와 시스템의 출력값 f(xᵢ; θ)의 차이를 제곱해 모든 데이터에 대해 평균 낸 값.",
    formula: [{ expr: "E(D; θ) = (1 / N) Σ_{(xᵢ, yᵢ) ∈ D} ( yᵢ − f(xᵢ; θ) )²" }],
    prereqs: ["pre-sigma"],
    related: ["t-regression", "t-error-function", "t-training-error"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제 — 데이터 분석: 회귀",
    aliases: ["squared error", "제곱 오차", "회귀오차"],
  },
  {
    id: "t-clustering",
    term: "군집화",
    en: "clustering",
    category: "개념",
    short: "입력값의 유사성에 따라 비슷한 데이터끼리 묶는 문제.",
    definition:
      "주어진 데이터 집합을 단순히 입력값의 유사성에 따라 서로 비슷한 임의의 복수 개의 그룹(군집)으로 묶는 문제. 학습 데이터는 D = {xᵢ}로 목표 출력값이 없다.",
    example:
      "여러 영상을 산·호수·빌딩이 있는 그림끼리 묶는 데이터 그룹핑, 화소를 데이터로 보고 묶는 영상 분할.",
    distinctions: [
      {
        from: "분류",
        how: "분류는 목표 출력값이 함께 주어지는 지도학습이고, 군집화는 목표 출력값 없이 입력 데이터만으로 구분하는 비지도학습이다.",
      },
    ],
    related: ["t-cluster", "t-disjoint", "t-representative-vector", "t-unsupervised-learning"],
    lectures: [1],
    basis: "1강 공식 연습문제 Q5",
    emphasis:
      "적용 방법은 K-평균 군집화, 계층적 군집화, 가우시안 혼합 모델이다. 영상 분할처럼 레이블 없이 묶는 문제가 나오면 군집화이고 곧 비지도학습이다.",
    aliases: ["clustering", "클러스터링", "군집"],
  },
  {
    id: "t-disjoint",
    term: "서로소",
    en: "disjoint",
    category: "개념",
    short: "부분집합 사이에 교집합이 없다는 뜻.",
    definition:
      "부분집합 간에 교집합이 없어 겹치는 데이터가 하나도 없는 상태. 군집화의 학습 결과인 K개의 클러스터는 서로소인 부분집합이다.",
    related: ["t-cluster", "t-clustering"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제 — 데이터 분석: 군집화",
    aliases: ["disjoint", "서로소 집합", "디스조인트"],
  },
  {
    id: "t-representative-vector",
    term: "대표 벡터",
    en: "representative vector",
    category: "개념",
    short: "각 클러스터를 대표하는 벡터. 그 클러스터에 속한 데이터의 평균.",
    definition:
      "각 클러스터를 하나의 벡터로 나타낸 것으로, 그 클러스터에 속한 데이터들의 평균에 해당한다. 군집화의 학습 결과를 표현하는 한 방법이다.",
    formula: [{ expr: "D₁의 평균 = m₁,  D₂의 평균 = m₂,  D₃의 평균 = m₃" }],
    prereqs: ["pre-mean-vector"],
    related: ["t-cluster", "t-clustering", "t-within-between-variance"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제 — 데이터 분석: 군집화",
    aliases: ["representative vector", "대표벡터", "중심", "centroid", "평균 벡터"],
  },
  {
    id: "t-within-between-variance",
    term: "클러스터 내의 분산과 클러스터 간의 분산",
    en: "within-cluster / between-cluster variance",
    category: "수식·지표",
    short: "군집화의 좋고 나쁨을 재는 두 가지 분산.",
    definition:
      "클러스터 내의 분산은 같은 클러스터에 속한 데이터들이 흩어진 정도, 클러스터 간의 분산은 서로 다른 클러스터들이 떨어진 정도. 최적의 클러스터란 클러스터 내의 분산은 최소이고 클러스터 간의 분산은 최대인 상태다.",
    role: "같은 클러스터 안의 유사성은 높이고 다른 클러스터와의 유사성은 낮추려는 목표를 수치로 표현한 것.",
    prereqs: ["pre-variance", "pre-mean-vector"],
    related: ["t-clustering", "t-representative-vector"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제 — 데이터 분석: 군집화",
    emphasis:
      "내의 분산과 간의 분산을 서로 바꿔 놓은 선택지가 나온다. 안쪽은 모으고 바깥쪽은 벌린다, 곧 내는 최소 간은 최대로 기억하면 된다.",
    aliases: ["within-cluster variance", "between-cluster variance", "클러스터 내 분산", "클러스터 간 분산"],
  },
  {
    id: "t-transform-function",
    term: "변환함수",
    en: "embedding / transformation function",
    category: "개념",
    short: "특징추출의 학습 결과로 얻는, 데이터를 특징벡터로 바꾸는 함수.",
    definition:
      "특징추출 시스템이 학습 결과로 만들어 내는 함수 z = f(x; θ). 새로운 데이터 x_new를 넣으면 특징벡터 z_new를 돌려준다.",
    related: ["t-feature-extraction", "t-feature-vector"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제 — 데이터 표현: 특징추출",
    aliases: ["transformation function", "embedding function", "변환 함수", "임베딩"],
  },
  {
    id: "t-feature-vector",
    term: "특징벡터",
    en: "feature vector",
    category: "개념",
    short: "변환함수를 거쳐 얻은, 원래 데이터보다 낮은 차원의 벡터.",
    definition:
      "변환함수 z = f(x; θ)를 거쳐 얻은 벡터 z. 원래 데이터가 갖는 정보 중 분석에 필요한 핵심만 남긴 표현이다.",
    prereqs: ["pre-column-vector"],
    related: ["t-transform-function", "t-feature-extraction"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제 — 데이터 표현: 특징추출",
    aliases: ["feature vector", "특징 벡터", "z"],
  },
  {
    id: "t-pca",
    term: "주성분분석 (PCA)",
    en: "principal component analysis",
    category: "알고리즘",
    short: "정보 손실량을 최소화하며 차원을 줄이는 특징추출 방법.",
    definition:
      "차원을 축소하되 원래 데이터가 갖는 정보의 손실량을 최소화하는 데 초점을 맞춘 특징추출 방법.",
    distinctions: [
      {
        from: "LDA",
        how: "PCA는 정보 손실량 최소화가 목적이고, LDA는 분류를 위해 필요한 정보를 최대한 유지하는 것이 목적이다.",
      },
    ],
    prereqs: ["pre-covariance-matrix"],
    related: ["t-lda", "t-projection", "t-feature-extraction"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제 — 데이터 표현: 특징추출",
    aliases: ["PCA", "principal component analysis", "주성분 분석"],
  },
  {
    id: "t-lda",
    term: "선형판별분석 (LDA)",
    en: "linear discriminant analysis",
    category: "알고리즘",
    short: "분류에 필요한 정보를 최대한 지키며 차원을 줄이는 특징추출 방법.",
    definition:
      "차원은 축소하되 분류를 위해 필요한 정보를 최대한 유지하는 데 초점을 맞춘 특징추출 방법.",
    prereqs: ["pre-covariance-matrix"],
    related: ["t-pca", "t-projection", "t-classification"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제 — 데이터 표현: 특징추출",
    emphasis:
      "PCA와 LDA의 목적을 맞바꿔 놓은 선택지가 나온다. 이름에 ‘판별’이 들어간 LDA가 분류 정보를 지키는 쪽이라고 연결해 두면 헷갈리지 않는다.",
    aliases: ["LDA", "linear discriminant analysis", "선형 판별 분석"],
  },
  {
    id: "t-mds",
    term: "MDS",
    en: "multidimensional scaling",
    category: "알고리즘",
    short: "특징추출 방법의 하나로 제시되는 다차원 척도법.",
    definition:
      "PCA·LDA·t-SNE와 함께 특징추출 방법으로 제시되는 방법.",
    prereqs: ["pre-euclidean"],
    related: ["t-pca", "t-lda", "t-tsne", "t-feature-extraction"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제 — 데이터 표현: 특징추출",
    aliases: ["MDS", "multidimensional scaling", "다차원 척도법"],
  },
  {
    id: "t-tsne",
    term: "t-SNE",
    en: "t-SNE",
    category: "알고리즘",
    short: "특히 데이터 시각화 용도로 많이 쓰이는 특징추출 방법.",
    definition:
      "특징추출 방법 중 특히 데이터 시각화 용도로 많이 사용되는 방법. 고차원 데이터를 2차원으로 줄여 분포를 눈으로 확인할 수 있게 한다.",
    example:
      "하나의 데이터가 28 × 28이면 flatten 시 784차원이 되지만, t-SNE로 2차원으로 줄이면 숫자별로 색을 달리해 분포를 볼 수 있다.",
    related: ["t-pca", "t-lda", "t-mds", "t-feature-extraction"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제 — 데이터 표현: 특징추출",
    emphasis:
      "t-SNE는 값을 예측하는 방법이 아니다. 주가 예측 같은 회귀 문항의 오답 선택지로 등장하므로 시각화·차원 축소 쪽 방법이라고 위치를 잡아 두어야 한다.",
    aliases: ["t-SNE", "tSNE", "티에스엔이", "TSNE"],
  },
  {
    id: "t-representation-learning",
    term: "표현학습",
    en: "representation learning",
    category: "개념",
    short: "특징추출을 딥러닝에서 부르는 이름.",
    definition:
      "데이터 표현이라는 문제 영역, 곧 특징추출을 딥러닝 분야에서 부르는 이름.",
    related: ["t-feature-extraction", "t-data-representation", "t-deep-learning"],
    lectures: [1],
    basis: "강의록 1강 머신러닝에서의 주제",
    aliases: ["representation learning", "표현 학습", "레프리젠테이션 러닝"],
  },

  /* ─────────── 학습 시스템 관련 개념 ─────────── */
  {
    id: "t-supervised-learning",
    term: "지도학습",
    en: "supervised learning",
    category: "학습 유형",
    short: "목표 출력값을 함께 주고 학습시키는 방식.",
    definition:
      "학습할 때 시스템에 출력해야 할 목표 출력값(‘교사’)을 함께 제공하는 학습 유형. 이 목표 출력값이 어떤 입력에 대해 어느 방향으로 가야 하는지 학습 방향을 알려 준다.",
    role: "분류와 회귀가 지도학습에 해당한다.",
    distinctions: [
      {
        from: "비지도학습",
        how: "목표 출력값이 함께 주어지면 지도학습, 아무런 정보 없이 입력값만 주어지면 비지도학습이다.",
      },
    ],
    related: ["t-unsupervised-learning", "t-target-output", "t-class-labeling"],
    lectures: [1],
    basis: "강의록 1강 학습 시스템 관련 개념 — 머신러닝의 유형",
    aliases: ["supervised learning", "교사학습", "슈퍼바이즈드 러닝"],
  },
  {
    id: "t-unsupervised-learning",
    term: "비지도학습",
    en: "unsupervised learning",
    category: "학습 유형",
    short: "목표 출력값 없이 입력값만으로 학습하는 방식.",
    definition:
      "목표 출력값에 대한 아무런 정보 없이 입력값 xᵢ만 주어진 상태에서 학습을 진행하는 유형.",
    role: "군집화가 비지도학습에 해당한다.",
    related: ["t-supervised-learning", "t-clustering", "t-image-segmentation"],
    lectures: [1],
    basis: "1강 공식 연습문제 Q5",
    emphasis:
      "영상 분할처럼 레이블을 붙이지 않고 비슷한 것끼리 묶는 문제가 나오면 비지도학습이 답이다. 자기지도학습은 레이블을 스스로 붙여 지도학습처럼 쓰는 변형이므로 기본 유형을 묻는 자리의 답이 아니다.",
    aliases: ["unsupervised learning", "비교사학습", "언슈퍼바이즈드 러닝"],
  },
  {
    id: "t-reinforcement-learning",
    term: "강화학습",
    en: "reinforcement learning",
    category: "학습 유형",
    short: "정확한 정답 대신 보상을 신호로 받아 학습하는 방식.",
    definition:
      "원하는 출력값을 모르거나 알 수 없는 경우에 사용하는 유형으로, 출력값에 대한 교사 신호가 ‘보상’ 형태로 주어진다. 교사 신호는 정확한 값이 아니고 출력값 각각에 대해 즉시 주어지지 않을 수도 있다.",
    example: "바둑이나 게임, 제어 문제에서 주로 사용된다.",
    related: ["t-reward", "t-supervised-learning"],
    lectures: [1],
    basis: "강의록 1강 학습 시스템 관련 개념 — 머신러닝의 유형",
    emphasis: "교재 14장에서 다시 자세히 다루는 내용이다.",
    aliases: ["reinforcement learning", "RL", "리인포스먼트 러닝"],
  },
  {
    id: "t-reward",
    term: "보상",
    en: "reward",
    category: "개념",
    short: "강화학습에서 정답 대신 주어지는 교사 신호.",
    definition:
      "강화학습에서 출력값에 대해 주어지는 교사 신호의 형태. 잘했다·못했다, 성공했다·실패했다와 같은 신호이며, 이 보상을 모아 최적화하는 방향으로 학습을 진행한다.",
    related: ["t-reinforcement-learning"],
    lectures: [1],
    basis: "강의록 1강 학습 시스템 관련 개념 — 머신러닝의 유형",
    aliases: ["reward", "리워드", "보상 신호"],
  },
  {
    id: "t-class-labeling",
    term: "클래스 레이블링",
    en: "class labeling",
    category: "개념",
    short: "학습 데이터에 목표 출력값을 붙이는 작업.",
    definition:
      "지도학습에 필요한 목표 출력값 yᵢ를 데이터마다 만들어 붙이는 작업. 인터넷에서 모은 영상마다 사람 얼굴·동물 얼굴·산·건물이라고 일일이 붙여야 하므로 비용이 많이 들고 어렵다.",
    role: "이 비용 문제 때문에 준지도학습·약지도학습·자기지도학습 같은 변형된 학습 방법이 쓰인다.",
    related: ["t-supervised-learning", "t-semi-supervised", "t-weakly-supervised", "t-self-supervised"],
    lectures: [1],
    basis: "강의록 1강 학습 시스템 관련 개념 — 머신러닝의 유형",
    aliases: ["class labeling", "labeling", "레이블링", "라벨링"],
  },
  {
    id: "t-semi-supervised",
    term: "준지도학습",
    en: "semi-supervised learning",
    category: "학습 유형",
    short: "지도학습과 비지도학습을 섞어, 레이블 없는 데이터도 함께 쓰는 방식.",
    definition:
      "지도학습과 비지도학습을 섞어서 사용하는 방법으로, 레이블이 있는 데이터와 없는 데이터를 함께 학습에 사용한다.",
    related: ["t-class-labeling", "t-weakly-supervised", "t-self-supervised"],
    lectures: [1],
    basis: "강의록 1강 학습 시스템 관련 개념 — 머신러닝의 유형",
    aliases: ["semi-supervised learning", "반지도학습", "세미 지도학습"],
  },
  {
    id: "t-weakly-supervised",
    term: "약지도학습",
    en: "weakly supervised learning",
    category: "학습 유형",
    short: "부정확하거나 대략적인 레이블만으로 학습하는 방식.",
    definition: "부정확한 레이블, 곧 정확하지 않거나 대략적인 레이블만 가지고도 학습을 수행하는 방법.",
    related: ["t-class-labeling", "t-semi-supervised", "t-self-supervised"],
    lectures: [1],
    basis: "강의록 1강 학습 시스템 관련 개념 — 머신러닝의 유형",
    aliases: ["weakly supervised learning", "약 지도학습", "위클리 지도학습"],
  },
  {
    id: "t-self-supervised",
    term: "자기지도학습",
    en: "self-supervised learning",
    category: "학습 유형",
    short: "레이블 없는 데이터에 스스로 레이블을 붙인 뒤 학습하는 방식.",
    definition:
      "레이블이 없는 많은 양의 데이터가 주어지면 스스로 무엇인지 레이블을 붙이고, 그런 다음 학습을 수행하는 방법.",
    related: ["t-class-labeling", "t-semi-supervised", "t-weakly-supervised"],
    lectures: [1],
    basis: "강의록 1강 학습 시스템 관련 개념 — 머신러닝의 유형",
    aliases: ["self-supervised learning", "셀프 지도학습", "자기 지도학습"],
  },
  {
    id: "t-model-complexity",
    term: "학습 시스템의 복잡도",
    en: "model complexity",
    category: "개념",
    short: "결정경계를 얼마나 복잡하게 만들 수 있는지를 나타내는 정도.",
    definition:
      "학습 시스템이 만들어 낼 수 있는 결정경계의 복잡한 정도. 복잡도가 낮으면 선형 결정경계에 그치고 높으면 비선형 결정경계를 만들 수 있으며, 복잡도가 과다적합과 직결된다.",
    role: "복잡도가 너무 낮으면 과소적합, 너무 높으면 과다적합이 되므로 최적의 복잡도를 찾아야 한다.",
    related: ["t-overfitting", "t-underfitting", "t-early-stopping", "t-decision-boundary"],
    lectures: [1],
    basis: "강의록 1강 학습 시스템 관련 개념 — 학습 시스템의 복잡도",
    emphasis:
      "학습 데이터에서는 복잡한 결정경계가 오차가 더 적지만 테스트 데이터에서는 오히려 오차가 커질 수 있다. 학습을 잘 시키면 일반화 성능도 반드시 좋아질 것이라는 생각이 깨지는 지점이다.",
    aliases: ["model complexity", "복잡도", "시스템 복잡도"],
  },
  {
    id: "t-overfitting",
    term: "과다적합",
    en: "overfitting",
    category: "개념",
    short: "학습 데이터에만 지나치게 맞춰 결정경계가 형성되는 현상.",
    definition:
      "학습 시스템이 학습 데이터에 대해서만 지나치게 적합한 형태로 결정경계가 형성되는 현상. 전체 데이터의 특성을 반영하지 못하고 학습 데이터에만 맞춰진 상태다.",
    role: "원인은 학습 데이터의 확률적 잡음과 학습 데이터 개수의 부족이고, 영향은 일반화 성능 저하다.",
    example:
      "복잡도를 조정하는 방법으로는 다양한 변형을 가진 충분한 학습 데이터 사용, 조기 종료, 정규항을 가진 오차함수 사용, 여러 복잡도의 후보 모델을 학습한 후 최적 모델 선택이 제시된다.",
    distinctions: [
      {
        from: "과소적합",
        how: "과다적합은 복잡도가 최적보다 높아 학습 데이터에만 맞은 상태이고, 과소적합은 복잡도가 최적보다 낮아 학습 데이터조차 제대로 맞추지 못한 상태다.",
      },
    ],
    prereqs: ["pre-population-sample"],
    related: ["t-underfitting", "t-early-stopping", "t-regularization-term", "t-generalization-error"],
    lectures: [1],
    basis: "강의록 1강 학습 시스템 관련 개념 — 과다적합",
    emphasis:
      "학습 오차가 줄면 검증 오차도 함께 준다는 서술은 틀린 것이다. 학습 오차는 계속 떨어지는데 검증 오차가 다시 올라가는 구간이 바로 과다적합이다.",
    aliases: ["overfitting", "과적합", "오버피팅"],
  },
  {
    id: "t-underfitting",
    term: "과소적합",
    en: "underfitting",
    category: "개념",
    short: "복잡도가 모자라 학습 데이터조차 제대로 맞추지 못하는 상태.",
    definition:
      "학습 시스템의 복잡도가 최적의 복잡도보다 낮아, 오차 곡선에서 학습 오차와 검증 오차가 모두 높게 남아 있는 구간.",
    related: ["t-overfitting", "t-model-complexity"],
    lectures: [1],
    basis: "강의록 1강 학습 시스템 관련 개념 — 과다적합",
    aliases: ["underfitting", "언더피팅", "과소 적합"],
  },
  {
    id: "t-early-stopping",
    term: "조기 종료",
    en: "early stopping",
    category: "알고리즘",
    short: "검증 오차가 다시 올라가는 지점에서 학습을 멈추는 방법.",
    definition:
      "별도의 검증용 데이터를 만들어 학습할 때마다 함께 성능을 평가하고, 학습 오차는 계속 떨어지는데 어느 순간 검증 오차가 다시 올라가면 그 지점에서 과다적합이 발생했다고 보아 학습을 멈추는 방법.",
    role: "과다적합을 막기 위해 학습 시스템의 복잡도를 조정하는 네 가지 방법 중 하나.",
    related: ["t-overfitting", "t-validation-error", "t-model-complexity"],
    lectures: [1],
    basis: "강의록 1강 학습 시스템 관련 개념 — 과다적합",
    emphasis:
      "멈추는 기준은 학습 오차가 아니라 검증 오차가 다시 올라가는 지점이다. 그 지점이 곧 최적의 복잡도다.",
    aliases: ["early stopping", "조기종료", "얼리 스토핑"],
  },
  {
    id: "t-regularization-term",
    term: "정규항",
    en: "regularization term",
    category: "수식·지표",
    short: "복잡한 결정경계에 벌점을 주려고 오차함수에 덧붙이는 항.",
    definition:
      "복잡한 결정경계가 만들어지면 페널티를 주도록 오차함수에 추가하는 항. 정규항을 가진 오차함수를 사용하는 것이 과다적합을 막는 방법 중 하나다.",
    related: ["t-overfitting", "t-error-function", "t-model-complexity"],
    lectures: [1],
    basis: "강의록 1강 학습 시스템 관련 개념 — 과다적합",
    aliases: ["regularization", "정규화 항", "규제항", "정규항"],
  },
  {
    id: "t-validation-error",
    term: "검증 오차",
    en: "validation error",
    category: "수식·지표",
    short: "별도의 검증용 데이터로 학습 도중에 계산하는 오차.",
    definition:
      "학습 도중 별도의 검증용 데이터를 이용해 함께 평가하는 오차. 복잡도를 올릴수록 학습 오차는 계속 떨어지지만 검증 오차는 어느 지점부터 다시 올라가며, 그 최저점이 최적의 복잡도다.",
    distinctions: [
      {
        from: "학습 오차",
        how: "학습 오차는 학습에 쓴 데이터로 계산하므로 복잡도를 올릴수록 계속 줄어들지만, 검증 오차는 학습에 쓰지 않은 데이터로 계산하므로 과다적합 구간에서 다시 커진다.",
      },
    ],
    related: ["t-early-stopping", "t-overfitting", "t-training-error", "t-cross-validation"],
    lectures: [1],
    basis: "강의록 1강 학습 시스템 관련 개념 — 과다적합",
    aliases: ["validation error", "검증오차", "밸리데이션 오차"],
  },
  {
    id: "t-ensemble-learning",
    term: "앙상블 학습",
    en: "ensemble learning",
    category: "알고리즘",
    short: "간단한 학습 시스템 여러 개를 결합해 일반화 성능을 높이는 방법.",
    definition:
      "복수 개의 간단한 학습 시스템을 결합하여 일반화 성능을 향상시키는 방법.",
    related: ["t-generalization-error", "t-overfitting"],
    lectures: [1],
    basis: "강의록 1강 학습 시스템 관련 개념 — 머신러닝의 고급 주제",
    emphasis: "교재 8장에서 다시 다루는 고급 주제다.",
    aliases: ["ensemble learning", "앙상블", "앙상블학습"],
  },
  {
    id: "t-active-learning",
    term: "능동 학습",
    en: "active learning",
    category: "알고리즘",
    short: "학습에 쓸 데이터를 선별적으로 골라 가며 수행하는 방법.",
    definition: "학습 과정에서 데이터를 선별적으로 선택하여 수행하는 방법.",
    related: ["t-training-data"],
    lectures: [1],
    basis: "강의록 1강 학습 시스템 관련 개념 — 머신러닝의 고급 주제",
    aliases: ["active learning", "액티브 러닝", "능동학습"],
  },
  {
    id: "t-meta-learning",
    term: "메타학습",
    en: "meta-learning",
    category: "알고리즘",
    short: "복잡도 같은 하이퍼파라미터까지 학습으로 최적화하는 방법.",
    definition:
      "학습 시스템의 복잡도 등의 하이퍼파라미터까지 학습을 통해 최적화하는 방법.",
    related: ["t-auto-ml", "t-model-complexity", "t-parameter"],
    lectures: [1],
    basis: "강의록 1강 학습 시스템 관련 개념 — 머신러닝의 고급 주제",
    aliases: ["meta-learning", "메타 학습", "메타러닝"],
  },
  {
    id: "t-auto-ml",
    term: "자동 머신러닝",
    en: "auto ML",
    category: "알고리즘",
    short: "하이퍼파라미터 최적화까지 자동화한 머신러닝.",
    definition:
      "메타학습과 함께 제시되는 방법으로, 학습 시스템의 복잡도 등의 하이퍼파라미터까지 학습을 통해 최적화한다.",
    related: ["t-meta-learning", "t-model-complexity"],
    lectures: [1],
    basis: "강의록 1강 학습 시스템 관련 개념 — 머신러닝의 고급 주제",
    aliases: ["auto ML", "AutoML", "자동머신러닝"],
  },
  {
    id: "t-continual-learning",
    term: "지속 · 증분학습",
    en: "continual / incremental learning",
    category: "알고리즘",
    short: "이미 배운 것을 잃지 않고 새 내용을 덧붙여 학습하는 방법.",
    definition:
      "기존에 학습된 내용에 대한 손실 없이 새로운 내용을 추가로 학습하는 방법.",
    related: ["t-training-data", "t-learning-system"],
    lectures: [1],
    basis: "강의록 1강 학습 시스템 관련 개념 — 머신러닝의 고급 주제",
    aliases: ["continual learning", "incremental learning", "지속학습", "증분학습"],
  },
];
