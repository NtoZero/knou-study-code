import type { GlossaryTerm } from "@/lib/mlGlossaryTypes";

/**
 * 12강 딥러닝 (2) — 교재 12.4 순환 신경망에서 다루는 용어.
 *
 * 정의는 교재·강의록 표현을 보존하되 한 문장으로 읽히게 다듬었다.
 */
export const lecture12Terms: GlossaryTerm[] = [
  /* ─────────── 순차 데이터와 RNN의 구조 ─────────── */
  {
    id: "t-sequential-data",
    term: "순차 데이터",
    en: "sequential data",
    category: "개념",
    short: "음성, 문장, 동영상, 주식 시세와 같이 순서 정보를 가진 데이터.",
    definition:
      "음성, 문장(단어의 나열), 동영상, 주식 시세와 같이 순서 정보(sequence)를 가진 데이터. 데이터가 나타나는 순서가 중요하고, 데이터의 길이가 고정되지 않고 순간마다 달라질 수 있으며, 하나의 데이터 안의 요소 사이에 문맥적인 의존성이 있으므로 이전의 내용을 기억하고 적절한 순간에 활용해야 하는 특징을 갖는다.",
    role: "한 시점의 이미지나 정보를 다루는 MLP·CNN으로는 적절히 다룰 수 없어, 시간에 따라 순차적으로 제공되는 정보를 다루는 신경망이 필요해지는 이유.",
    example: "문장은 단어의 나열이고 동영상은 프레임의 나열이다. 같은 단어 묶음이라도 순서가 달라지면 뜻이 달라진다.",
    distinctions: [
      {
        from: "격자 구조 데이터",
        how: "영상처럼 격자 구조를 가진 데이터는 한 시점의 정보이고 크기가 고정된다. 순차 데이터는 길이가 가변적이고 요소 사이에 시간적 의존성이 있다.",
      },
    ],
    prereqs: ["pre-sequence-index"],
    related: ["t-rnn", "t-long-term-dependency"],
    lectures: [12],
    basis: "교재 12.4.1 · 강의록 순환 신경망의 필요성 — 순차 데이터",
    emphasis:
      "세 가지 특징을 ‘출현 순서 중요 · 가변적 길이 · 문맥적 의존성’으로 묶어 외운다. 길이가 고정되어 있다는 서술은 틀린 설명이다.",
    aliases: ["sequential data", "시퀀스 데이터", "순서 데이터"],
  },
  {
    id: "t-rnn",
    term: "순환 신경망",
    en: "Recurrent Neural Network, RNN",
    category: "알고리즘",
    short: "시간에 따라 순차적으로 제공되는 데이터를 다루기 위한 신경망.",
    definition:
      "시간에 따라 순차적으로 제공되는 정보를 다루기 위한 신경망. 입력층, 하나의 은닉층, 그리고 출력층을 가진 전형적인 MLP의 구조와 유사하지만 정보가 전달되는 방향에서 차이가 있다. MLP는 정보의 흐름이 한 방향으로만 흐르는 전방향 신경망이지만, RNN은 은닉 노드 사이에 가중치를 갖는 에지가 존재해서 직전에 발생한 정보를 현재의 입력으로 전달한다.",
    role: "순차 데이터의 출현 순서, 가변적인 길이, 문맥 의존성을 충분히 반영하여 처리할 수 있는 신경망 모델.",
    formula: [
      { expr: "h_t = f_W(h_(t−1), x_t)", note: "식 12-8 — 특정 시간 t에서의 은닉층의 상태" },
      { expr: "W = (W_xh, W_hh, W_hy)", note: "RNN의 가중치 집합" },
    ],
    example:
      "CNN은 주로 컴퓨터비전 분야에서 많이 사용되는 데 반해 RNN은 텍스트 처리와 음성 처리와 같이 시퀀스 형태를 다루는 데 주로 사용된다. 대표적인 응용 사례가 기계번역이다.",
    distinctions: [
      {
        from: "전방향 신경망(MLP)",
        how: "정보 전달 방향. MLP는 한 방향으로만 흐르고, RNN은 은닉 노드 사이에 가중치를 갖는 순환 에지가 있어 직전 정보를 현재 입력으로 되돌린다.",
      },
    ],
    prereqs: ["pre-sequence-index", "pre-matrix-mult"],
    related: ["t-recurrent-network", "t-recurrent-edge", "t-hidden-state", "t-rnn-cell", "t-lstm", "t-gru", "t-feedforward", "t-mlp"],
    lectures: [12],
    basis: "교재 12.4.1 (그림 12-19, 식 12-8) · 강의록 기본적인 RNN의 구조",
    emphasis:
      "기본 형태를 ‘vanilla RNN’이라고도 부른다. 은닉층은 하나지만 시간 축으로 펼쳐지므로 깊은 신경망처럼 보인다 — 층이 깊은 것이 아니라 같은 층을 여러 번 쓰는 것이다.",
    aliases: ["RNN", "recurrent neural network", "vanilla RNN", "순환신경망"],
  },
  {
    id: "t-recurrent-edge",
    term: "순환 에지",
    en: "recurrent edge",
    category: "개념",
    short: "은닉 노드 사이에 존재하는, 가중치를 갖는 에지.",
    definition:
      "은닉 노드 사이에 존재해서 직전에 발생한 정보를 현재의 입력으로 전달하는, 가중치를 갖는 에지. 이전에 발생한 정보를 다음 순간으로 전달하는 역할을 수행하며, 이런 순환 구조를 통해 RNN은 순차 데이터의 특성을 반영하여 처리할 수 있게 된다. 순환 에지의 가중치가 W_hh에 해당한다.",
    role: "RNN을 전방향 신경망과 구별 짓는 구조적 특징.",
    related: ["t-rnn", "t-hidden-state", "t-weight-sharing"],
    lectures: [12],
    basis: "교재 12.4.1 (그림 12-19(b), 그림 12-20(a)) · 강의록 기본적인 RNN의 구조",
    aliases: ["recurrent edge", "순환 연결", "순환연결"],
  },
  {
    id: "t-hidden-state",
    term: "은닉 상태",
    en: "hidden state",
    category: "개념",
    short: "시간 t 이전에 신경망에 누적되고 기억된 정보를 담은 은닉층의 상태.",
    definition:
      "특정 시간 t에서 입력 x_t(입력 데이터의 t번째 요소)와 직전의 상태 정보 h_(t−1)을 함께 입력으로 받아서 생성되는 은닉층의 새로운 상태. h_(t−1)은 시간의 흐름에 따라 시간 t 이전에 신경망에 누적되고 기억된 정보다. W_hh h_(t−1) 항은 은닉층이 저장한 이전 상태에 은닉 노드끼리의 가중치 W_hh를 곱해서 은닉층의 상태를 갱신하는 역할을 수행한다.",
    formula: [
      {
        expr: "h_t = f_W(h_(t−1), x_t) = tanh(W_hh h_(t−1) + W_xh x_t + b_h)",
        note: "식 12-10 — b_h는 항상 1을 가지는 바이어스 노드와 연결된 가중치",
      },
      { expr: "y_t = φ_softmax(W_hy h_t + b_o)", note: "식 12-11 — 출력층의 계산" },
    ],
    prereqs: ["pre-sequence-index", "pre-matrix-mult"],
    related: ["t-rnn", "t-rnn-cell", "t-recurrent-edge", "t-cell-state", "t-hyperbolic-tangent", "t-softmax"],
    lectures: [12],
    basis: "교재 12.4.1 (식 12-8, 12-10, 12-11) · 강의록 RNN 셀의 구조",
    emphasis:
      "h₀는 아무것도 읽지 않은 처음 상태다. h_t의 아래첨자는 데이터 번호가 아니라 한 데이터 안의 시각을 가리킨다.",
    aliases: ["hidden state", "은닉층의 상태", "상태 정보"],
  },
  {
    id: "t-rnn-cell",
    term: "RNN 셀",
    en: "RNN cell",
    category: "개념",
    short: "은닉층을 이루는 계산 단위. tanh 하나로 상태를 갱신한다.",
    definition:
      "RNN의 은닉층을 구성하는 셀. 직전 상태 h_(t−1)에 W_hh를 곱한 것과 입력 x_t에 W_xh를 곱한 것을 더한 뒤 tanh를 적용하여 새로운 상태 h_t를 만들고, 여기에 W_hy를 곱해 출력 y_t를 계산한다. 축약된 그림에서는 입력층과 은닉층이 하나의 노드(셀)로 구성된 것처럼 보이지만, 실제로는 다차원 벡터를 처리할 수 있도록 노드의 집합으로 이루어진다.",
    role: "RNN의 구체적인 동작이 일어나는 자리. 이 셀을 LSTM 셀이나 GRU 셀로 바꾸면 그대로 LSTM·GRU가 된다.",
    example:
      "RNN에서 활성화 함수로는 주로 tanh를 사용한다. ReLU 함수를 사용하면 순환적인 구조로 인해 h값이 지나치게 커질 수 있고, 또한 시그모이드 함수보다는 기울기 소멸 문제에 좀 더 효과적이라는 것이 알려져 있기 때문이다.",
    distinctions: [
      {
        from: "LSTM 셀",
        how: "RNN 셀은 h_t만 순환시키지만 LSTM 셀은 셀 상태 c_t도 함께 순환시키고 3개의 게이트를 갖는다.",
      },
    ],
    related: ["t-rnn", "t-hidden-state", "t-hyperbolic-tangent", "t-lstm", "t-gru", "t-relu", "t-sigmoid"],
    lectures: [12],
    basis: "교재 12.4.1 (그림 12-22, 식 12-10) · 강의록 RNN 셀의 구조",
    aliases: ["RNN cell", "순환 신경망 셀", "단순 RNN 셀"],
  },
  {
    id: "t-unfolding",
    term: "전개된 구조",
    en: "unfolded structure, unfolding",
    category: "개념",
    short: "순환식을 시간의 흐름에 따라 옆으로 펼쳐 그린 RNN의 표현.",
    definition:
      "RNN을 축약된 형태로 간단히 표현한 것과 달리, 순환식을 전개하여 시간의 흐름에 따라 옆으로 펼친 표현. 전개된 그림을 통해 RNN의 각 층은 시간의 흐름에 따라 새로운 입력을 받고 있지만, 실제로는 같은 층이기 때문에 가중치가 공유되고 있음을 알 수 있다.",
    formula: [
      {
        expr: "h_t = f_W(f_W(f_W(⋯ f_W(f_W(h₀, x₁), x₂), ⋯, x_(t−2)), x_(t−1)), x_t)",
        note: "식 12-9 — 순환식을 h₀까지 전개한 모습",
      },
    ],
    role: "RNN이 실제로 계산될 때는 한 번에 하나씩 시간순으로 처리하기보다 일정 구간을 정하여 펼친 상태의 네트워크를 구성하여 계산한다.",
    prereqs: ["pre-time-unfolding", "pre-composite-function"],
    related: ["t-rnn", "t-weight-sharing", "t-bptt", "t-timestep"],
    lectures: [12],
    basis: "교재 12.4.1 (그림 12-20, 식 12-9) · 강의록 RNN의 표현 방법",
    emphasis:
      "펼친 그림을 ‘층이 t개인 깊은 신경망’으로 읽으면 안 된다. 층은 하나이고, 같은 층을 시간에 따라 여러 번 그린 것이다.",
    aliases: ["unfolding", "unfolded", "펼친 구조", "전개 구조"],
  },
  {
    id: "t-weight-sharing",
    term: "가중치 공유",
    en: "weight sharing",
    category: "개념",
    short: "서로 다른 시각(또는 위치)의 계산이 같은 가중치를 함께 쓰는 것.",
    definition:
      "RNN에서 전개된 각 시각의 층이 실제로는 같은 층이므로 같은 가중치 W = (W_xh, W_hh, W_hy)를 함께 쓰는 것. 순차적인 계산 과정을 그린 그림에서도 가중치 W가 공유되고 있음을 알 수 있다. 시각을 아무리 길게 펼쳐도 학습 대상인 가중치의 수는 늘어나지 않는다.",
    role: "가변적인 길이의 순차 데이터를 고정된 수의 파라미터로 처리할 수 있게 하는 장치.",
    distinctions: [
      {
        from: "시각마다 따로 학습하는 가중치",
        how: "펼친 길이에 비례해 파라미터가 늘어난다면 길이가 달라지는 데이터를 하나의 모델로 다룰 수 없다. RNN은 같은 W를 다시 쓴다.",
      },
    ],
    related: ["t-unfolding", "t-rnn", "t-recurrent-edge"],
    lectures: [12],
    basis: "교재 12.4.1 (그림 12-20, 12-21) · 강의록 RNN의 계산 과정 — 가중치 공유",
    aliases: ["weight sharing", "가중치공유", "파라미터 공유"],
  },

  /* ─────────── 입출력 구조와 확장 ─────────── */
  {
    id: "t-seq-io-structure",
    term: "입·출력 대응 관계에 따른 구조",
    en: "RNN input–output mapping structures",
    category: "개념",
    short: "응용 목적에 따라 입력 요소와 출력 요소가 몇 개씩 대응하는지로 갈리는 RNN의 변형.",
    definition:
      "기본적인 형태의 RNN은 매 시간 출력을 생성하지만, RNN은 응용 목적에 따라 입력 요소와 출력 요소의 대응 관계가 달라지며 이에 따라 다양한 변형된 구조를 가진다. 1:1(기본 구조), 1:m(이미지 캡셔닝), m:1(감정 분류, 온라인 필기 문자 인식), m:n(기계번역, 프레임 수준의 비디오 분류)이 있다.",
    example:
      "1:m은 하나의 입력에 대해 여러 차례의 순환 연산으로 여러 출력을 만들고, m:1은 순차적으로 여러 입력을 받은 후 최종적으로 하나의 결과를 생성한다.",
    related: ["t-rnn", "t-image-captioning", "t-sentiment-classification", "t-machine-translation", "t-unfolding"],
    lectures: [12],
    basis: "교재 12.4.1 (그림 12-23) · 강의록 응용 목적에 따른 RNN의 구조",
    emphasis:
      "은닉층과 그 사이의 순환 연결은 네 구조에서 모두 같다. 달라지는 것은 어느 시각에 입력을 넣고 어느 시각에서 출력을 꺼내는지뿐이다.",
    aliases: ["1:m", "m:1", "m:n", "입출력 구조", "sequence to sequence"],
  },
  {
    id: "t-image-captioning",
    term: "이미지 캡셔닝",
    en: "image captioning",
    category: "개념",
    short: "이미지를 설명·묘사하는 단어들을 각 시점에서 출력하는 1:m 응용.",
    definition:
      "이미지에 대한 적절한 처리를 거친 특징벡터가 입력으로 주어졌을 때 이미지를 설명·묘사할 수 있는 단어들을 각 시점에서의 결과로서 출력하는 문제. 특정 시점에 주어진 하나의 입력에 대해 여러 차례의 순환 연산을 통해 여러 출력을 만들어 내는 1:m 구조를 사용한다.",
    related: ["t-seq-io-structure", "t-rnn"],
    lectures: [12],
    basis: "교재 12.4.1 (그림 12-23(b)) · 강의록 응용 목적에 따른 RNN의 구조",
    aliases: ["image captioning", "이미지 설명", "이미지 묘사"],
  },
  {
    id: "t-sentiment-classification",
    term: "감정 분류",
    en: "sentiment classification",
    category: "개념",
    short: "문장의 단어들을 시점마다 입력받아 해당 문장의 감정을 판단하는 m:1 응용.",
    definition:
      "하나의 문장을 구성하는 단어들을 각 시점에서의 입력으로 받아서 해당 문장에서의 감정을 파악하는 응용. 순차적으로 여러 개의 입력을 받은 후 최종적으로 하나의 결과를 생성하는 m:1 구조를 사용하며, 온라인 필기 문자 인식도 같은 구조를 사용한다.",
    related: ["t-seq-io-structure", "t-rnn"],
    lectures: [12],
    basis: "교재 12.4.1 (그림 12-23(c)) · 강의록 응용 목적에 따른 RNN의 구조",
    aliases: ["sentiment classification", "감정분류", "온라인 필기 문자 인식"],
  },
  {
    id: "t-machine-translation",
    term: "기계번역",
    en: "machine translation",
    category: "개념",
    short: "시퀀스를 시퀀스로 매칭하는 m:n 구조의 대표 응용.",
    definition:
      "한글을 영어로 번역하는 것처럼 단어 단위의 입력을 모두 처리한 다음에 번역 문장(단어 단위의 출력)을 생성해야 하므로 시퀀스를 시퀀스로 매칭하는 m:n 구조를 가지는 응용. 번역하려는 입력 문장과 출력 문장이 모두 글자나 단어들이 순서를 가지고 연속적으로 나타나는 시퀀스 형태로 구성되기 때문에 RNN의 대표적인 응용 사례가 된다.",
    related: ["t-seq-io-structure", "t-rnn", "t-bidirectional-rnn"],
    lectures: [12],
    basis: "교재 12.4.1 (그림 12-23(d)) · 강의록 응용 목적에 따른 RNN의 구조",
    emphasis:
      "문장의 앞뒤 문맥이 모두 중요하므로 양방향 RNN이 많이 활용되는 응용이기도 하다.",
    aliases: ["machine translation", "번역"],
  },
  {
    id: "t-stacked-rnn",
    term: "다층 RNN",
    en: "stacked RNN, multi-layer RNN",
    category: "개념",
    short: "RNN 셀이 여러 층으로 구성되도록 확장한 구조.",
    definition:
      "입·출력 관계에 따른 구조에서 RNN 셀이 여러 층으로 구성되도록 확장한 구조. 아래 은닉층의 출력이 위 은닉층의 입력이 되어 두 층이 계층 구조를 이룬다.",
    distinctions: [
      {
        from: "양방향 RNN",
        how: "둘 다 은닉층이 둘 이상이지만, 다층 RNN의 은닉층들은 계층 구조를 이루고 양방향 RNN의 두 은닉층은 계층 구조를 이루지 않으며 아무런 연결 관계도 없다.",
      },
    ],
    related: ["t-rnn", "t-bidirectional-rnn"],
    lectures: [12],
    basis: "교재 12.4.1 · 강의록 RNN 구조의 확장 — 다층 RNN",
    aliases: ["stacked RNN", "multi-layer RNN", "다층 순환 신경망"],
  },
  {
    id: "t-bidirectional-rnn",
    term: "양방향 RNN",
    en: "bidirectional RNN",
    category: "개념",
    short: "전방향으로 처리하는 은닉층과 역방향으로 처리하는 은닉층을 함께 쓰는 구조.",
    definition:
      "2개의 은닉층으로 구성되어 하나는 입력을 전방향으로 처리하고 다른 하나는 역방향으로 입력을 처리하는 구조. 시간 t의 입력 x_t는 두 은닉층으로 동시에 주어져서 처리되어 결과가 출력층으로 제공된다. 비록 2개의 은닉층이 사용되지만 전방향으로 처리하는 은닉층과 역방향으로 처리하는 은닉층은 계층 구조를 이루지 않으며 아무런 연결 관계도 존재하지 않는다.",
    role: "입력 x_t를 처리할 때 해당 입력의 앞쪽에 있는 정보와 뒤쪽에 있는 정보를 모두 활용할 목적을 가지며, 문장의 앞뒤 문맥이 모두 중요한 기계번역에서 많이 활용된다.",
    distinctions: [
      {
        from: "다층 RNN",
        how: "두 은닉층 사이의 연결 관계. 양방향 RNN의 두 은닉층은 서로 연결되지 않으며 계층을 이루지 않는다.",
      },
    ],
    related: ["t-rnn", "t-stacked-rnn", "t-machine-translation"],
    lectures: [12],
    basis: "교재 12.4.1 (그림 12-24) · 강의록 RNN 구조의 확장 — 양방향 RNN",
    emphasis:
      "‘아래 은닉층의 출력이 위 은닉층의 입력이 된다’는 서술은 다층 RNN의 것이다. 양방향 RNN에 그대로 붙이면 틀린 설명이 된다.",
    aliases: ["bidirectional RNN", "BiRNN", "양방향 순환 신경망"],
  },

  /* ─────────── 학습과 그 문제 ─────────── */
  {
    id: "t-bptt",
    term: "시간 역전파 학습 알고리즘",
    en: "Backpropagation Through Time, BPTT",
    category: "알고리즘",
    short: "오류 역전파 학습 알고리즘을 시간축으로 개조한 RNN의 학습 알고리즘.",
    definition:
      "RNN은 시간성 정보를 가지므로 MLP에 적용되었던 오류 역전파 학습 알고리즘을 그대로 적용할 수 없고, 이를 개조한 시간 역전파(Backpropagation Through Time, BPTT) 학습 알고리즘을 사용한다. 시점 i = t에서 얻어진 손실에 대해 시점 i = 1까지 기울기를 역전파한다.",
    role: "RNN의 학습은 손실함수 L(W)를 최소로 하는 최적의 매개변수 W를 찾는 것이며, 그 기울기를 구하는 방법이 BPTT다.",
    formula: [
      { expr: "L(W) = Σ(i = 1 … t) L_i(W)", note: "식 12-12 — 매 시각의 손실을 모두 더한다" },
      {
        expr: "∂L/∂h₁ = (∂L/∂y_t)(∂y_t/∂h_t)(∂h_t/∂h_(t−1)) ⋯ (∂h₂/∂h₁)",
        note: "식 12-13 — 연쇄법칙을 적용한 편미분식",
      },
    ],
    example:
      "L_i(W)로는 평균 제곱 오차, 크로스 엔트로피(교차 엔트로피), 로그 우도 등이 사용된다. RNN은 학습 데이터 집합 D = {(x_i, y_i)}를 사용하는 지도학습 모델이다.",
    distinctions: [
      {
        from: "오류 역전파(BP)",
        how: "BP는 층을 거슬러 전파하고 BPTT는 시간을 거슬러 전파한다. LSTM과 GRU의 학습법도 기본 RNN과 동일하게 BPTT를 사용한다.",
      },
    ],
    prereqs: ["pre-chain-rule-deep", "pre-sigma", "pre-time-unfolding"],
    related: ["t-backpropagation", "t-vanishing-gradient", "t-timestep", "t-unfolding", "t-supervised-learning"],
    lectures: [12],
    basis: "교재 12.4.2 (그림 12-25, 식 12-12, 12-13) · 강의록 RNN 학습",
    emphasis:
      "셀이 LSTM이나 GRU로 복잡해져도 학습의 틀은 그대로 BPTT다. 게이트를 위해 추가된 모든 파라미터에 동일한 방식으로 유도된 학습식이 적용된다.",
    aliases: ["BPTT", "backpropagation through time", "시간역전파"],
  },
  {
    id: "t-timestep",
    term: "timestep",
    en: "timestep",
    category: "개념",
    short: "RNN의 계산에 참여하는 시점 1에서 t까지의 길이.",
    definition:
      "RNN의 계산에 참여하는 시점 1에서 t까지의 길이. 식 12-14에서 역방향으로 전달되는 기울기에 곱해지는 값의 개수가 바로 이 길이에서 1을 뺀 수이므로, RNN에서 기울기 소멸 문제는 층의 개수가 아닌 timestep t에 영향을 받는다.",
    related: ["t-vanishing-gradient", "t-bptt", "t-unfolding", "t-long-term-dependency"],
    lectures: [12],
    basis: "교재 12.4.2 (식 12-14) · 강의록 RNN 학습의 문제",
    emphasis:
      "‘은닉층이 하나뿐이니 기울기 소멸이 없다’는 서술이 틀린 이유가 바로 여기에 있다. 문제를 키우는 것은 층의 수가 아니라 곱해지는 값의 개수다.",
    aliases: ["timestep", "타임스텝", "시점의 길이"],
  },
  {
    id: "t-vanishing-gradient",
    term: "기울기 소멸",
    en: "gradient vanishing",
    category: "개념",
    short: "역전파되는 기울기가 기하급수적으로 작아져 0에 가까워지는 현상.",
    definition:
      "역방향으로 전달되는 기울기가 가중치와 활성화 함수의 미분값이 연속해서 곱해지는 형태로 계산되기 때문에, 활성화 함수의 미분값이 1보다 작다면 기울기가 기하급수적으로 작아지며 결국 0에 가까워져서 기울기 조정의 기능을 상실하는 현상.",
    formula: [
      {
        expr: "∂h_t/∂h₁ = ∏(k = 1 … t−1) w φ′(w h_(t−k)) = w^(t−1) ∏ φ′(w h_(t−k))",
        note: "식 12-14 — w는 은닉층의 가중치로 W_hh에 해당",
      },
    ],
    example:
      "한 칸의 곱이 0.72이고 timestep이 20이면 0.72의 19제곱, 곧 0.002 수준까지 떨어진다.",
    distinctions: [
      {
        from: "기울기 폭발",
        how: "곱해지는 값이 1보다 작으면 소멸, 1보다 크면 폭발이다. 폭발은 기울기 클리핑으로 간단히 막을 수 있지만 소멸은 LSTM·GRU 같은 정교한 셀이 필요하다.",
      },
    ],
    prereqs: ["pre-chain-rule-deep", "pre-numerical-stability"],
    related: ["t-gradient-explosion", "t-gradient-clipping", "t-timestep", "t-bptt", "t-lstm", "t-gru", "t-hyperbolic-tangent"],
    lectures: [12],
    basis: "교재 12.4.2 (식 12-14) · 강의록 RNN 학습의 문제 — 기울기 소멸",
    aliases: ["gradient vanishing", "vanishing gradient", "기울기소멸"],
  },
  {
    id: "t-gradient-explosion",
    term: "기울기 폭발",
    en: "gradient explosion",
    category: "개념",
    short: "역전파되는 기울기가 기하급수적으로 커지는 현상.",
    definition:
      "역전파 단계에서 곱해지는 값이 1보다 큰 값이라면 기울기가 기하급수적으로 커지는 현상. 기울기 클리핑 방법으로 간단히 해결할 수 있다.",
    related: ["t-vanishing-gradient", "t-gradient-clipping", "t-bptt"],
    lectures: [12],
    basis: "교재 12.4.2 · 강의록 RNN 학습의 문제 — 기울기 폭발",
    aliases: ["gradient explosion", "exploding gradient", "기울기폭발", "기울기 폭주"],
  },
  {
    id: "t-gradient-clipping",
    term: "기울기 클리핑",
    en: "gradient clipping",
    category: "알고리즘",
    short: "기울기가 임계치보다 크면 일정 범위에 있도록 조정하는 방법.",
    definition:
      "기울기가 일정한 값을 초과하지 않도록 그 크기를 제한하기 위해, 주어진 임계치보다 크면 그 값을 일정 범위에 있도록 조정하는 방법.",
    role: "기울기 폭발 문제의 해결책.",
    distinctions: [
      {
        from: "LSTM·GRU",
        how: "클리핑은 커진 기울기를 눌러 주지만 0으로 사그라든 기울기를 되살리지는 못한다. 기울기 소멸의 대책은 LSTM·GRU 같은 셀이다.",
      },
    ],
    related: ["t-gradient-explosion", "t-vanishing-gradient"],
    lectures: [12],
    basis: "교재 12.4.2 · 강의록 RNN 학습의 문제 — 기울기 클리핑",
    aliases: ["gradient clipping", "클리핑"],
  },

  /* ─────────── LSTM ─────────── */
  {
    id: "t-long-term-dependency",
    term: "장기 의존성 문제",
    en: "long-term dependency",
    category: "개념",
    short: "멀리 떨어진 두 입력 사이의 연관성 정보를 현재 작업에서 활용할 수 없는 문제.",
    definition:
      "기본 RNN은 입력이 순차적으로 들어오면 시간이 지남에 따라 앞쪽의 입력 정보는 약해지고 사라진다. 따라서 입력 요소가 시간적으로 멀리 떨어져 있을 때 두 요소 간의 연관성 정보를 현재의 작업에서 활용할 수 없는 문제.",
    role: "LSTM이 고안된 이유. 이전 시점에 얻어진 셀의 값이 다음 시점에 전달되는 정도를 조정함으로써 시간의 흐름과 무관하게 셀의 정보를 원하는 만큼 기억할 수 있어야 해결된다.",
    related: ["t-lstm", "t-gru", "t-vanishing-gradient", "t-timestep", "t-sequential-data"],
    lectures: [12],
    basis: "교재 12.4.3 (1) (그림 12-26) · 강의록 LSTM — 시간에 따른 입력 신호의 민감도",
    aliases: ["long-term dependency", "장기의존성", "장기 의존 문제"],
  },
  {
    id: "t-lstm",
    term: "LSTM",
    en: "Long Short Term Memory",
    category: "알고리즘",
    short: "시간의 흐름과 무관하게 셀의 정보를 원하는 만큼 기억할 수 있도록 고안된 순환 신경망 셀.",
    definition:
      "장기 의존성 문제의 해결을 위해 고안된 순환 신경망 셀. 단기 기억과 장기 기억(long-term memory) 기능을 모두 갖추고 있으며, 셀에 여러 종류의 메모리 게이트가 존재하여 이를 통해 입력과 계산 결과를 선별적으로 허용하여 각 입력값이 영향을 미칠 수 있는 범위를 확장시켜 장기 의존성 문제를 해결한다.",
    role: "이러한 기능은 학습을 통해 손실 신호가 전달될 때도 마찬가지로 적용되어 기본 RNN의 학습에서 발생하는 기울기 소멸 문제도 어느 정도 해결할 수 있다. 따라서 실제 순환 신경망을 사용할 때는 단순 RNN 셀보다는 LSTM 셀을 많이 사용한다.",
    formula: [
      { expr: "입력(h_(t−1), c_(t−1), x_t) · 출력(h_t, c_t, y_t)", note: "3개의 입력과 네 종류의 계산" },
      { expr: "학습 대상 — W_f, W_i, W_c, W_o", note: "3개의 게이트를 위한 가중치와 W_c" },
    ],
    distinctions: [
      {
        from: "기본 RNN 셀",
        how: "셀의 출력 h_t뿐만 아니라 셀의 내부 상태 c_t도 순환의 대상이 되며, 3개의 게이트가 추가된다.",
      },
      {
        from: "GRU",
        how: "GRU가 LSTM을 단순하게 개선한 것이다. LSTM은 셀 상태를 따로 두고 게이트가 3개, GRU는 셀 상태를 출력에 통합하고 게이트가 2개다.",
      },
    ],
    prereqs: ["pre-sequence-index"],
    related: ["t-cell-state", "t-gate", "t-forget-gate", "t-input-gate", "t-output-gate", "t-gru", "t-long-term-dependency", "t-rnn-cell", "t-bptt"],
    lectures: [12],
    basis: "교재 12.4.3 (1) (그림 12-27, 12-28) · 강의록 LSTM · LSTM 셀 구조",
    emphasis:
      "게이트의 개수는 3개다 — 망각·입력·출력. update gate는 GRU의 것이므로 LSTM의 게이트를 묻는 문제에서 바로 걸러 낸다.",
    aliases: ["LSTM", "long short term memory", "장단기 메모리"],
  },
  {
    id: "t-cell-state",
    term: "셀 상태",
    en: "cell state",
    category: "개념",
    short: "셀이 기억하고 있는 과거 내용을 나타내는 LSTM의 내부 상태.",
    definition:
      "LSTM 셀의 내부 상태로, 셀이 기억하고 있는 과거 내용을 나타내는 c_t. 단순 RNN 셀과 달리 시간 t에서의 셀의 출력 h_t뿐만 아니라 c_t도 순환의 대상이 된다. 망각 게이트에 의해 [0, c_(t−1)] 범위로 수정된 셀 상태 정보와 입력 게이트를 통해 [0, c̃_t] 범위로 조정된 셀 출력의 후보값을 더해서 새로운 셀 상태로 갱신된다.",
    formula: [
      { expr: "c_t = c_(t−1) ⊙ f_t + i_t ⊙ c̃_t", note: "식 12-18 — 셀 상태 갱신" },
    ],
    role: "이 식을 통해 LSTM 셀은 기억하거나 잊어야 할 정보의 일부를 결정하고 새로운 정보를 추가할 수 있으며, 이런 기능을 통해 장기 의존성 문제를 해결한다.",
    distinctions: [
      {
        from: "셀의 출력 h_t",
        how: "c_t는 셀이 안으로 들고 있는 기억이고, h_t는 그 기억에 tanh와 출력 게이트를 거쳐 밖으로 내보내는 값이다. GRU에는 c_t가 없고 h_t에 통합되어 있다.",
      },
    ],
    related: ["t-lstm", "t-forget-gate", "t-input-gate", "t-cell-candidate", "t-hadamard-product", "t-hidden-state"],
    lectures: [12],
    basis: "교재 12.4.3 (1) (식 12-18) · 강의록 LSTM 셀의 기능 — 셀 상태 갱신",
    aliases: ["cell state", "셀상태", "내부 상태"],
  },
  {
    id: "t-gate",
    term: "게이트",
    en: "gate",
    category: "개념",
    short: "0.0~1.0 사이의 실수값을 가지고 셀 내의 데이터 흐름을 제어하는 장치.",
    definition:
      "LSTM 셀과 GRU 셀에서 0.0~1.0 사이의 실수값을 가지고 셀 내의 데이터 흐름을 제어하는 부분. 시그모이드 활성화 함수를 거쳐 계산되며, 이 값이 신호에 곱해져 통과시킬 양을 정한다. 이전 시점에서의 뉴런(셀)의 출력이 다음 시점으로 전달될 때 게이트를 이용하여 정보량이 조정됨으로써 신경망이 가지는 시간 의존성을 자유롭게 제어할 수 있다.",
    formula: [
      { expr: "게이트 = σ( W [h_(t−1), x_t] + b )", note: "σ는 [0.0, 1.0] 범위의 실수를 출력" },
      { expr: "W [h_(t−1), x_t] = U h_(t−1) + V x_t", note: "직전 출력과 현재 입력에 각각 가중치를 곱해 더한 것" },
    ],
    example: "값이 0이면 완전 망각(완전 차단), 1이면 완전 기억(그대로 통과)이다.",
    prereqs: ["pre-exp-log"],
    related: ["t-lstm", "t-gru", "t-forget-gate", "t-input-gate", "t-output-gate", "t-update-gate", "t-reset-gate", "t-sigmoid"],
    lectures: [12],
    basis: "교재 12.4.3 · 강의록 LSTM 셀의 기능 · GRU 셀의 기능",
    aliases: ["gate", "메모리 게이트"],
  },
  {
    id: "t-forget-gate",
    term: "망각 게이트",
    en: "forget gate",
    category: "개념",
    short: "셀 상태의 정보를 어느 정도 지우고 남길 것인지를 조정하는 게이트.",
    definition:
      "셀 상태의 정보를 얼마나 잊어버릴 것인가를 결정하는 부분. 계산된 f_t가 셀 상태 c_(t−1)에 곱해지므로 망각 게이트에 의해 셀 상태 정보는 [0, c_(t−1)] 범위로 변경된다. f_t가 0이면 곱해진 값도 0이 되어 셀 상태의 정보를 완전히 잊어버리게 되고, 1이면 c_(t−1)이 주어진 그대로 활용된다.",
    formula: [{ expr: "f_t = σ( W_f [h_(t−1), x_t] + b_f )", note: "식 12-15" }],
    example:
      "망각 게이트는 1997년 제프 호크라이터(Sepp Hochreiter)가 LSTM을 제안할 당시에는 없었으며, 2000년 펠릭스 거스(Felix Gers)에 의해 추가되었고 현재에는 거의 표준처럼 사용되고 있다.",
    related: ["t-lstm", "t-gate", "t-cell-state", "t-input-gate", "t-update-gate", "t-hadamard-product"],
    lectures: [12],
    basis: "교재 12.4.3 (1) (식 12-15) · 강의록 LSTM 셀의 기능 — 망각 게이트",
    aliases: ["forget gate", "망각게이트"],
  },
  {
    id: "t-input-gate",
    term: "입력 게이트",
    en: "input gate",
    category: "개념",
    short: "셀 상태에 새로운 정보를 추가하는 정도를 조정하는 게이트.",
    definition:
      "셀 상태에 새로운 정보를 추가하는 정도를 조정하는 부분. 입력 게이트 i_t와 셀 상태의 후보 c̃_t 두 신호를 계산하고 두 신호를 곱해서 셀 상태에 더한다. 후보값을 얼마나 셀 상태로 전달할지를 결정하기 위해 입력 게이트의 값 i_t가 곱해져서 셀 출력 후보값은 [0, c̃_t] 범위로 조정된다.",
    formula: [{ expr: "i_t = σ( W_i [h_(t−1), x_t] + b_i )", note: "식 12-16" }],
    related: ["t-lstm", "t-gate", "t-cell-candidate", "t-cell-state", "t-forget-gate", "t-update-gate"],
    lectures: [12],
    basis: "교재 12.4.3 (1) (식 12-16) · 강의록 LSTM 셀의 기능 — 입력 게이트",
    aliases: ["input gate", "입력게이트"],
  },
  {
    id: "t-cell-candidate",
    term: "셀 상태의 후보",
    en: "cell state candidate",
    category: "수식·지표",
    short: "셀이 출력할 후보의 값, 곧 셀 상태에 추가될 새로운 정보.",
    definition:
      "셀이 출력할 후보의 값(또는 셀 상태에 추가될 새로운 정보) c̃_t. 입력 게이트와 거의 동일한 방식으로 계산하되 활성화 함수만 tanh를 사용한다. 이 후보값에 입력 게이트의 값이 곱해져 셀 상태에 더해진다.",
    formula: [{ expr: "c̃_t = tanh( W_c [h_(t−1), x_t] + b_c )", note: "식 12-17" }],
    distinctions: [
      {
        from: "입력 게이트 i_t",
        how: "i_t는 σ로 계산되어 ‘얼마나 통과시킬지’를 정하는 비율이고, c̃_t는 tanh로 계산되어 ‘무엇을 더할지’를 담은 내용이다.",
      },
    ],
    related: ["t-input-gate", "t-cell-state", "t-lstm", "t-hyperbolic-tangent"],
    lectures: [12],
    basis: "교재 12.4.3 (1) (식 12-17) · 강의록 LSTM 셀의 기능 — 입력 게이트",
    aliases: ["cell candidate", "셀 상태 후보", "c tilde"],
  },
  {
    id: "t-output-gate",
    term: "출력 게이트",
    en: "output gate",
    category: "개념",
    short: "현재 셀 상태의 중요도를 반영하여 출력 정도를 조정하는 게이트.",
    definition:
      "현재 셀 상태의 중요도를 반영하여 출력의 크기를 결정하는 부분. 셀의 출력 h_t는 새로운 셀 상태 c_t에 tanh 함수를 적용해서 결정하되, 이 값을 그대로 최종 출력으로 전달하는 것이 아니라 출력 게이트 o_t와 곱해져서 출력의 크기를 조절한다.",
    formula: [
      { expr: "o_t = σ( W_o [h_(t−1), x_t] + b_o )", note: "식 12-19" },
      { expr: "h_t = o_t ⊙ tanh(c_t)", note: "식 12-20 — 셀의 출력" },
      { expr: "y_t = φ_softmax( W_hy h_t + b_y )", note: "식 12-21 — 시점 t의 출력층의 결과" },
    ],
    distinctions: [
      {
        from: "GRU",
        how: "GRU에는 출력을 제어하는 출력 게이트가 없어지고 리셋 게이트가 추가되었다.",
      },
    ],
    related: ["t-lstm", "t-gate", "t-cell-state", "t-softmax", "t-hadamard-product"],
    lectures: [12],
    basis: "교재 12.4.3 (1) (식 12-19 ~ 12-21) · 강의록 LSTM 셀의 기능 — 출력 계산",
    aliases: ["output gate", "출력게이트"],
  },
  {
    id: "t-hadamard-product",
    term: "아다마르 곱",
    en: "Hadamard product",
    category: "선행 개념",
    short: "차원이 같은 두 행렬에서 요소별 곱셈.",
    definition:
      "차원이 같은 두 행렬(또는 벡터)에서 같은 자리의 요소끼리 곱하는 연산으로 기호 ⊙로 쓴다. 행렬 곱과 달리 결과의 차원이 입력과 같다. 게이트의 값을 신호에 곱해 통과시킬 양을 정할 때 쓰인다.",
    formula: [
      { expr: "c_t = c_(t−1) ⊙ f_t + i_t ⊙ c̃_t", note: "식 12-18에서 쓰이는 요소별 곱셈" },
      { expr: "h_t = o_t ⊙ tanh(c_t)", note: "식 12-20" },
    ],
    example: "[0.6, 0.2] ⊙ [0.8, 0.5] = [0.48, 0.10]",
    related: ["t-gate", "t-cell-state", "t-lstm", "t-gru"],
    lectures: [12],
    basis: "강의록 LSTM 셀의 기능 — ⊙ Hadamard product",
    aliases: ["Hadamard product", "요소별 곱", "element-wise product", "⊙"],
  },

  /* ─────────── GRU ─────────── */
  {
    id: "t-gru",
    term: "GRU",
    en: "Gated Recurrent Unit, 게이트 순환 유닛",
    category: "알고리즘",
    short: "LSTM 셀 구조를 좀 더 단순하게 개선한 2014년의 순환 신경망 셀.",
    definition:
      "기능적으로는 LSTM과 유사하지만 LSTM 셀 구조를 좀 더 단순하게 개선한 것으로 2014년에 제안되었다. 단순 RNN 셀과 마찬가지로 2개의 입력(h_(t−1), x_t)과 하나의 출력(h_t)만 존재한다. 즉, LSTM 셀과 달리 셀 상태 c_t를 사용하지 않고 셀 상태가 셀의 출력 h_t에 통합되었다. 또한 2개의 게이트로 구성되는데, 갱신 게이트 z_t와 리셋 게이트 r_t이다.",
    role: "LSTM이 복잡한 연결 구조와 많은 파라미터를 가지는 문제를 덜기 위해 제안되었다. 학습법은 기본 RNN·LSTM과 동일하게 BPTT를 사용한다.",
    formula: [
      { expr: "h̃_t = tanh( W_h [ r_t ⊙ h_(t−1), x_t ] + b_h )", note: "식 12-24 — 추가할 새로운 내용" },
      { expr: "h_t = (1 − z_t) ⊙ h_(t−1) + z_t ⊙ h̃_t", note: "식 12-25 — 셀의 최종 출력" },
    ],
    distinctions: [
      {
        from: "LSTM",
        how: "LSTM은 셀 상태 c_t를 따로 순환시키고 게이트가 3개(망각·입력·출력), GRU는 셀 상태가 출력에 통합되고 게이트가 2개(리셋·갱신)다. LSTM 셀의 입력 게이트와 망각 게이트를 합친 것이 갱신 게이트이고, 출력 게이트가 없어지고 리셋 게이트가 추가되었다.",
      },
    ],
    related: ["t-lstm", "t-update-gate", "t-reset-gate", "t-gate", "t-bptt", "t-rnn-cell"],
    lectures: [12],
    basis: "교재 12.4.3 (2) (그림 12-29, 식 12-22 ~ 12-25) · 강의록 GRU · GRU 셀의 구조",
    emphasis:
      "‘LSTM이 GRU를 단순화한 것’은 방향이 거꾸로 된 서술이다. GRU가 LSTM을 단순화한 쪽이다.",
    aliases: ["GRU", "gated recurrent unit", "게이트 순환 유닛"],
  },
  {
    id: "t-update-gate",
    term: "갱신 게이트",
    en: "update gate",
    category: "개념",
    short: "새로 받아들일 내용과 이전의 출력 내용의 비율을 조정하는 GRU의 게이트.",
    definition:
      "LSTM의 망각 게이트와 입력 게이트의 역할을 선별적으로 수행하는 GRU의 게이트. 현 시점의 출력을 위해 받아들일 새로운 내용과 이전의 출력 내용의 비율을 조정한다.",
    formula: [
      { expr: "z_t = σ( W_z [h_(t−1), x_t] + b_z )", note: "식 12-23" },
      { expr: "h_t = (1 − z_t) ⊙ h_(t−1) + z_t ⊙ h̃_t", note: "식 12-25 — 두 계수의 합이 1인 비율 배분" },
    ],
    example:
      "z_t = 1이면 (1 − z_t)가 0이 되어 이전의 내용을 완전히 잊어버리게 되고, z_t = 0이면 (1 − z_t)·h_(t−1) = h_(t−1)이 되어 망각 게이트로서의 기능은 없고 h̃_t를 차단하는 효과가 있다.",
    distinctions: [
      {
        from: "LSTM의 망각 게이트·입력 게이트",
        how: "LSTM은 남길 양과 더할 양을 두 게이트로 따로 정하지만, GRU는 하나의 z_t로 (1 − z_t) : z_t의 비율을 정해 두 역할을 겸한다.",
      },
    ],
    related: ["t-gru", "t-reset-gate", "t-gate", "t-forget-gate", "t-input-gate"],
    lectures: [12],
    basis: "교재 12.4.3 (2) (식 12-23, 12-25) · 강의록 GRU 셀의 기능 — 갱신 게이트",
    emphasis:
      "LSTM의 게이트를 묻는 문제에서 update gate가 보기로 나오면 그것이 답인 경우가 많다. 갱신 게이트는 GRU의 것이다.",
    aliases: ["update gate", "갱신게이트", "z_t"],
  },
  {
    id: "t-reset-gate",
    term: "리셋 게이트",
    en: "reset gate",
    category: "개념",
    short: "이전의 출력을 어느 정도 받아들일지 조정하는 GRU의 게이트.",
    definition:
      "이전의 출력 h_(t−1)을 어느 정도 받아들일지 조정하기 위해 0과 1 사이의 값을 h_(t−1)에 곱하는 GRU의 게이트. 리셋 게이트를 거친 이전 출력과 입력 x_t를 이용하여 시간 t에서 추가되는 새로운 내용 h̃_t를 계산한다.",
    formula: [
      { expr: "r_t = σ( W_r [h_(t−1), x_t] + b_r )", note: "식 12-22" },
      { expr: "h̃_t = tanh( W_h [ r_t ⊙ h_(t−1), x_t ] + b_h )", note: "식 12-24" },
    ],
    distinctions: [
      {
        from: "LSTM의 출력 게이트",
        how: "GRU에서는 출력을 제어하는 출력 게이트가 없어지고 리셋 게이트가 추가되었다. 리셋 게이트는 출력이 아니라 새로운 내용을 만들 때 쓰는 과거 정보의 양을 조절한다.",
      },
    ],
    related: ["t-gru", "t-update-gate", "t-gate", "t-output-gate", "t-hadamard-product"],
    lectures: [12],
    basis: "교재 12.4.3 (2) (식 12-22, 12-24) · 강의록 GRU 셀의 기능 — 리셋 게이트",
    aliases: ["reset gate", "리셋게이트", "r_t"],
  },
];
