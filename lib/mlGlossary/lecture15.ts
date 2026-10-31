import type { GlossaryTerm } from "@/lib/mlGlossaryTypes";

export const lecture15Terms: GlossaryTerm[] = [
  /* ─────────── 강화학습의 개요 ─────────── */
  {
    id: "t-reinforcement-learning",
    term: "강화학습",
    en: "reinforcement learning",
    category: "학습 유형",
    short: "목표 출력값 대신 행동 결과에 대한 보상으로, 누적 보상을 최대화하는 행동을 배우는 학습.",
    definition:
      "목표 출력값을 제공하지 않는다. 최종적인 목표를 지정하고 매 순간 학습 시스템이 취하는 행동(action)의 결과에 따라 보상(reward)을 제공한다. 강화학습 알고리즘의 목적은 최종적으로 얻게 되는 누적 보상을 최대화하는 것이므로, 순간의 이익보다는 누적 보상이 최대가 되도록 매 순간 최적의 행동을 결정해야 한다.",
    role: "목표 달성에 적절한(좋은) 행동에는 양의 보상, 부적절한(나쁜) 행동에는 음의 보상(벌점)을 주고, 이 보상과 벌점으로 좋은 행동과 나쁜 행동을 배워 행동 방식을 긍정적 방향으로 강화한다. 주로 주어진 조건이나 상황에서 어떤 동작을 취해야 할지를 결정하는 제어 문제를 표현하고 해결하는 방법으로 사용된다.",
    example:
      "AlphaGo·AlphaGo Zero·AlphaZero 같은 보드게임, 49종의 아타리 비디오 게임(DQN), 로봇 제어, 데이터 센터 냉방 시스템 최적화, 전자상거래의 실시간 입찰·광고·상품 추천.",
    distinctions: [
      {
        from: "지도학습",
        how: "학습할 때 목표 출력값(교사)을 함께 주는가. 강화학습은 정확한 목표값 대신 보상을 주며, 그 보상은 출력값 각각에 대해 즉시 주어지지 않을 수도 있다.",
      },
      {
        from: "비지도학습",
        how: "출력에 대한 신호가 있는가. 비지도학습은 목표 출력값에 대한 아무런 정보 없이 학습하고, 강화학습은 보상 형태의 신호를 받는다.",
      },
    ],
    related: ["t-reward", "t-agent", "t-environment", "t-mdp", "t-control-problem", "t-q-learning"],
    lectures: [15],
    basis: "교재 14.1.1 강화학습의 계산 모델 · 강의록 머신러닝의 유형 · 강화학습",
    emphasis:
      "학습의 목적은 누적 보상의 최대화다. ‘상태 전이확률을 최적화한다’는 학습 목적이 아니다 — 공식 연습문제의 오답 선택지다.",
    aliases: ["reinforcement learning", "RL"],
  },
  {
    id: "t-reward",
    term: "보상",
    en: "reward",
    category: "개념",
    short: "에이전트가 취한 행동의 결과에 따라 환경이 주는 교사 신호.",
    definition:
      "강화학습에서 출력값에 대한 교사 신호가 주어지는 형태. 정확한 목표값이 아니라 행동 결과에 대한 평가이며, 목표 달성에 좋은 행동이면 양의 보상, 나쁜 행동이면 음의 보상(벌점)을 줄 수 있다. 행동 Aₜ를 취해 상태가 Sₜ₊₁로 전이되면, 전이된 상태의 상대적 효과나 가치에 따라 보상 Rₜ₊₁이 결정된다.",
    example:
      "보드게임: 이기면 1, 지면 −1, 중간 과정 0. 4×4 미로: 함정 −1, 목표 1, 나머지 0. 그림 14-6 미로: 회색 칸 선택 −1, 이동 가능 0, 목표 도착 5.",
    distinctions: [
      {
        from: "보상 함수 R",
        how: "보상은 한 시점에 받는 값이고, MDP의 보상 함수 Rᵃₛ = E[Rₜ₊₁ | Sₜ = s, Aₜ = a]는 상태 s에서 행동 a를 했을 때 얻을 보상의 기대치다.",
      },
      {
        from: "수익 Gₜ",
        how: "수익은 시점 t 이후 보상들에 할인율을 곱해 합한 총할인 보상이다.",
      },
    ],
    related: ["t-reinforcement-learning", "t-return", "t-mdp"],
    lectures: [15],
    basis: "교재 14.1.1 강화학습의 계산 모델 · 강의록 상태와 보상의 예",
    aliases: ["reward", "벌점", "음의 보상"],
  },
  {
    id: "t-control-problem",
    term: "제어 문제",
    category: "개념",
    short: "주어진 조건이나 상황에서 어떤 동작을 취해야 할지를 결정하는 문제.",
    definition:
      "주어진 조건이나 상황에서 어떤 동작을 취해야 할지를 결정하는 문제. 게임도 결국 일련의 취할 동작을 선택하는 제어 문제이고, 보행 로봇이 걸음마를 배우는 문제, 자동차 자율주행 문제도 모두 제어 문제다.",
    role: "시간에 따른 순차적인 개념이 존재해서 이전 시점의 상황이 현재 시점의 결정에 영향을 미친다. 최적의 제어 신호에 대한 정확한 목표값을 주기는 힘들지만 수행 결과의 성공 여부는 평가할 수 있어서 강화학습이 주로 쓰인다.",
    related: ["t-reinforcement-learning", "t-imitation-learning"],
    lectures: [15],
    basis: "교재 14장 도입 · 강의록 강화학습의 응용 분야",
  },
  {
    id: "t-imitation-learning",
    term: "모방학습",
    en: "imitation learning",
    category: "학습 유형",
    short: "보여 준 동작을 그대로 흉내 내어 같은 동작을 하도록 배우는 학습.",
    definition:
      "로봇이 수행해야 할 동작을 먼저 보여 주면 그것을 그대로 흉내 내어 같은 동작을 하도록 학습함으로써 다양한 유형의 동작을 배우는 기술. 강의록은 비디오 이미지를 보고 로봇이 흉내 내서 동작을 배우도록 학습한다고 적는다.",
    role: "제어할 대상의 원하는 동작을 정확한 수치로 지정하는 것이 매우 어렵거나 불가능한 로봇 제어에서 쓰인다.",
    related: ["t-control-problem", "t-reinforcement-learning"],
    lectures: [15],
    basis: "교재 14장 도입 — 그림 14-2 · 강의록 강화학습의 적용 사례 — 로봇 제어",
  },
  {
    id: "t-agent",
    term: "에이전트",
    en: "agent",
    category: "개념",
    short: "환경의 현재 상태를 입력받아 행동을 결정하는 주체.",
    definition:
      "강화학습에서 순간마다 행동을 결정하는 주체. 환경의 현재 상태 Sₜ를 입력받아 파악하고 적절한 행동 Aₜ를 결정하는데, 순간의 관점이 아닌 긴 시간 동안의 누적 보상을 최대화할 수 있는 행동을 선택해야 한다. 에이전트는 정책에 따라 행동을 결정한다.",
    example: "아타리 게임 그림에서는 게임 플레이어의 두뇌가 에이전트지만, 실제 학습 상황에서는 학습할 머신이 에이전트다.",
    distinctions: [
      { from: "환경", how: "에이전트는 행동을 결정하고, 환경은 그 행동에 따른 다음 상태와 보상을 결정한다." },
    ],
    related: ["t-environment", "t-policy", "t-reinforcement-learning"],
    lectures: [15],
    basis: "교재 14.1.1 강화학습의 계산 모델 — 그림 14-3 · 강의록 강화학습의 표준 계산 모델",
    aliases: ["agent"],
  },
  {
    id: "t-environment",
    term: "환경",
    en: "environment",
    category: "개념",
    short: "에이전트의 행동에 따라 상태를 바꾸고 보상을 결정하는 주체.",
    definition:
      "강화학습에서 상태를 변화시키고 보상을 결정하는 주체. 에이전트가 행동 Aₜ를 취하면 현재 상태가 Sₜ에서 Sₜ₊₁로 전이되고, 전이된 상태의 상대적 효과나 가치에 따라 보상 Rₜ₊₁이 결정된다. 환경은 주어진 MDP에 따라 다음 상태와 보상을 결정한다.",
    example: "아타리 게임에서는 게임기가 환경이다. 조이스틱 조작(행동)을 반영해 화면(상태)이 바뀌고 게임 점수(보상)가 변한다.",
    related: ["t-agent", "t-mdp", "t-transition-probability"],
    lectures: [15],
    basis: "교재 14.1.1 강화학습의 계산 모델 — 그림 14-4 · 강의록 강화학습의 표준 계산 모델",
    aliases: ["environment"],
  },
  {
    id: "t-state-action",
    term: "상태와 행동",
    en: "state / action",
    category: "개념",
    short: "상태 Sₜ는 시점 t에 환경을 정의하는 변수의 값, 행동 Aₜ는 그 상태에서 에이전트가 고르는 동작.",
    definition:
      "하나의 상태 Sₜ는 특정 시점 t에 환경을 정의하는 변수의 값으로 정의된다. 강화학습 알고리즘은 상태들의 집합 S, 에이전트가 각 상태에서 취할 수 있는 행동의 집합 A, 보상 신호의 집합 R로 구성되므로 이 세 집합의 정의가 우선 필요하다.",
    example:
      "미로 찾기: S는 움직일 수 있는 모든 위치, A는 상·하·좌·우 이동 방향. 보드게임: 모든 유효한 보드판의 구성이 S, 보드판 위의 움직임이 A(게임 종류에 따라 다름).",
    related: ["t-agent", "t-mdp", "t-policy"],
    lectures: [15],
    basis: "교재 14.1.1 강화학습의 계산 모델 · 강의록 상태와 보상의 예",
    aliases: ["state", "action", "상태 집합", "행동 집합"],
  },

  /* ─────────── MDP ─────────── */
  {
    id: "t-mdp",
    term: "마르코프 결정 프로세스",
    en: "Markov Decision Process, MDP",
    category: "개념",
    short: "에이전트–환경 상호작용을 수학적으로 표현한 <S, A, P, R, γ>의 튜플.",
    definition:
      "에이전트와 환경의 상호작용을 위해 문제를 정의할 때 주어지는 정보를 수학적으로 표현한 것. 마르코프 결정 프로세스는 <S, A, P, R, γ>의 튜플이다. S는 가능한 상태의 유한집합, A는 가능한 행동의 유한집합, P는 상태 전이확률, R은 보상 함수, γ는 보상을 계산할 때 사용되는 할인율이다.",
    role: "에이전트는 정책에 따라 행동을 결정하고, 환경은 주어진 MDP에 따라 다음 상태와 보상을 결정한다. 강화학습 알고리즘은 주어진 MDP에서 누적 보상을 최대화하는 최적의 행동을 결정하는 정책을 찾는다.",
    formula: [
      { expr: "Pᵃₛₛ′ = ℙ[Sₜ₊₁ = s′ | Sₜ = s, Aₜ = a]", note: "상태 전이확률" },
      { expr: "Rᵃₛ = E[Rₜ₊₁ | Sₜ = s, Aₜ = a]", note: "보상 함수 — 보상의 기대치" },
      { expr: "γ ∈ [0, 1]", note: "할인율" },
    ],
    example:
      "그림 14-6 미로: S = {1, 2, 3, 4, 6, 9, 11, 12, 14, 15, 17, 18, 23, 24, 25}, A = {상, 하, 좌, 우}, P는 행렬 형태, R = {−1, 0, 5}.",
    distinctions: [
      { from: "정책", how: "MDP는 문제(환경)의 정의이고, 정책은 그 MDP 안에서 학습으로 찾는 행동 선택 규칙이다." },
    ],
    related: ["t-markov-property", "t-transition-probability", "t-discount-factor", "t-policy"],
    lectures: [15],
    basis: "교재 14.1.2 마르코프 결정 프로세스 · 강의록 마르코프 결정 프로세스 · 미로 찾기 과업을 정의하는 MDP의 예",
    aliases: ["MDP", "Markov Decision Process", "마르코프 결정 과정"],
  },
  {
    id: "t-markov-property",
    term: "마르코프 성질",
    en: "Markov property",
    category: "개념",
    short: "다음 행동은 현재의 상태에 의해서만 결정되고 이전 선택은 영향을 미치지 않는다는 성질.",
    definition:
      "“현재 상태에서 선택할 다음 행동은 현재의 상태(상황)에 의해서만 결정된다.” 이전의 선택/결정들이 영향을 미치지 않으므로 현재 상태만 판단하면 된다. 이런 성질을 지닌 과제를 MDP라고 부른다.",
    role: "강화학습은 기본적으로 마르코프 성질을 만족한다는 가정에서 동작한다. 그래서 먼저 문제를 MDP로 모형화하고, 만족하지 못하는 경우라면 근사적으로라도 만들어야 한다. 이렇게 하면 이전 이력을 고려할 필요가 없어 문제의 해법이 단순해진다.",
    example: "미로 찾기, 보드게임, 로봇 제어, 자동차 운전, 주어진 목적지까지 최단 경로 찾기.",
    related: ["t-mdp"],
    lectures: [15],
    basis: "교재 14.1.2 마르코프 결정 프로세스 · 강의록 마르코프 결정 프로세스 · 공식 연습문제 Q2",
    emphasis: "‘다음 행동은 이전 선택과 현재 상태를 종합해 결정된다’는 공식 연습문제의 틀린 설명이다.",
    aliases: ["Markov property"],
  },
  {
    id: "t-transition-probability",
    term: "상태 전이확률",
    en: "transition probability",
    category: "수식·지표",
    short: "상태 s에서 행동 a를 했을 때 상태 s′로 전이될 확률 Pᵃₛₛ′.",
    definition:
      "한 상태에서 다른 상태로의 전이는 종종 확률적 불확실성을 포함하는데, 이를 전이확률로 표현한다. MDP의 P는 상태 s에서 행동 a를 취했을 때 상태 s′로 전이될 확률값 Pᵃₛₛ′로 정의된다.",
    formula: [{ expr: "Pᵃₛₛ′ = ℙ[Sₜ₊₁ = s′ | Sₜ = s, Aₜ = a]" }],
    example: "그림 14-6 미로에서 P는 로봇이 해당 위치에서 움직여 다른 위치로 이동할 확률로, 행렬 형태로 표현된다.",
    distinctions: [
      { from: "정책 π(a|s)", how: "전이확률은 행동 뒤에 어떤 상태가 될지(환경)의 확률, 정책은 상태에서 어떤 행동을 고를지(에이전트)의 확률이다." },
    ],
    related: ["t-mdp", "t-environment", "t-nondeterministic-model"],
    lectures: [15],
    basis: "교재 14.1.1 · 14.1.2 · 강의록 마르코프 결정 프로세스",
    aliases: ["전이확률", "P"],
  },
  {
    id: "t-discount-factor",
    term: "할인율",
    en: "discount factor",
    category: "수식·지표",
    short: "먼 미래의 보상일수록 덜 반영하도록 곱하는 값 γ (0 ≤ γ ≤ 1).",
    definition:
      "보상을 계산할 때 사용되는 값 γ ∈ [0, 1]. 먼 미래의 보상보다 최근의 보상이 더 크게 반영되도록, 현재 시점에서부터 멀어질수록 보상을 할인하여 수익 Gₜ에 대한 기여도를 낮추기 위한 것이다.",
    role: "Q-함수 갱신 규칙 Q̂(s, a) = r + γ max Q̂(s′, a′)에 적용하면, 목표까지의 경로가 여럿일 때 빠른(짧은) 경로가 더 좋게 평가된다.",
    formula: [{ expr: "Gₜ = Σₖ₌₀^∞ γᵏ Rₜ₊ₖ₊₁" }],
    example: "γ = 0.9일 때 상태 11에서 15만 거치는 경로는 Q̂(11, D) = 0.9, 10·14·15를 거치는 경로는 Q̂(11, L) = 0.729.",
    distinctions: [
      { from: "신뢰 요소 α", how: "γ는 미래 보상을 얼마나 깎을지, α는 비결정론적 환경에서 새 결과를 얼마나 믿을지를 정한다." },
    ],
    related: ["t-return", "t-discounted-future-reward", "t-mdp", "t-belief-factor"],
    prereqs: ["pre-geometric-discount"],
    lectures: [15],
    basis: "교재 14.1.2 · 14.1.3 · 14.2.1 · 강의록 마르코프 결정 프로세스 · 더 좋은 경로에 대한 선택",
    aliases: ["discount factor", "할인률", "γ", "감마"],
  },

  /* ─────────── 정책과 가치함수 ─────────── */
  {
    id: "t-policy",
    term: "정책",
    en: "policy",
    category: "개념",
    short: "상태 Sₜ와 행동 Aₜ의 시퀀스를 결정하는 함수적 규칙 π(a|s).",
    definition:
      "에이전트가 행동을 선택할 때 사용하는 규칙. 정책 π는 상태 Sₜ와 행동 Aₜ의 시퀀스를 결정하는 함수적인 규칙으로, 주어진 상태에 대한 행동의 조건부확률로 표기하고 정의한다.",
    formula: [
      { expr: "(S₀, A₀) —R₁→ (S₁, A₁) —R₂→ ⋯ → (Sₜ, Aₜ) —Rₜ₊₁→ (Sₜ₊₁, Aₜ₊₁) —Rₜ₊₂→ ⋯", note: "식 14-1" },
      { expr: "π(a|s) = ℙ[Aₜ = a | Sₜ = s]", note: "식 14-2" },
    ],
    example: "그림 14-6 미로의 상태 1에서 같은 확률로 고른다면, 오른쪽과 아래로만 이동할 수 있으므로 π(우|1) = π(하|1) = 1/2 (식 14-3).",
    distinctions: [
      { from: "수익", how: "수익 Gₜ는 정책을 평가하는 기준값(총할인 보상)이지 행동을 고르는 규칙이 아니다." },
      { from: "행동 가치함수(Q-함수)", how: "Q-함수는 상태–행동 쌍의 기대 보상을 돌려주는 평가 함수다." },
    ],
    related: ["t-optimal-policy", "t-return", "t-state-value-function", "t-action-value-function"],
    prereqs: ["pre-conditional-prob"],
    lectures: [15],
    basis: "교재 14.1.3 정책과 가치함수 · 강의록 정책과 가치함수 · 공식 연습문제 Q3",
    aliases: ["policy", "π"],
  },
  {
    id: "t-return",
    term: "수익",
    en: "return, gain",
    category: "수식·지표",
    short: "시점 t부터 얻는 보상에 할인율을 곱해 더한 총할인 보상 Gₜ.",
    definition:
      "‘좋은 정책’에 대한 평가 기준. 시점 t에서부터 얻어지는 보상에 대해 할인율 γ를 곱하여 합산되는 총할인 보상(total discount reward)이다. 이익(이득, gain)이라고도 한다.",
    formula: [{ expr: "Gₜ = Rₜ₊₁ + γRₜ₊₂ + γ²Rₜ₊₃ + ⋯ = Σₖ₌₀^∞ γᵏ Rₜ₊ₖ₊₁", note: "식 14-4" }],
    example: "4×4 미로에서 1 → 2 → 3 → 7 → 11 → 10 → 14 → 15 → 16으로 8번 움직여 마지막에만 보상 1을 받으면 G = γ⁷.",
    related: ["t-discount-factor", "t-state-value-function", "t-discounted-future-reward"],
    prereqs: ["pre-sigma", "pre-geometric-discount"],
    lectures: [15],
    basis: "교재 14.1.3 정책과 가치함수 — 식 14-4 · 강의록 정책과 가치함수",
    aliases: ["return", "gain", "이익", "이득", "총할인 보상", "total discount reward", "Gt"],
  },
  {
    id: "t-state-value-function",
    term: "상태 가치함수",
    en: "state-value function",
    category: "수식·지표",
    short: "상태 s에서 정책 π를 따를 때 얻을 수 있는 기대 보상 vπ(s).",
    definition:
      "상태 s에서 시작해서 정책 π에 따라 행동을 취하였을 때 얻을 수 있는 기대 보상(expected reward: 보상의 평균).",
    formula: [{ expr: "vπ(s) = Eπ[Gₜ | Sₜ = s]", note: "식 14-5" }],
    role: "모든 정책을 하나하나 평가하는 것은 정책공간이 너무 방대해 불가능하므로, 상태와 행동의 가치를 평가하는 함수로 정책의 좋은 정도를 평가한다.",
    distinctions: [
      { from: "행동 가치함수", how: "입력에 행동 a가 들어가는가. 반환하는 것은 둘 다 누적 보상의 기대치다." },
    ],
    related: ["t-action-value-function", "t-optimal-value-function", "t-return"],
    prereqs: ["pre-expectation", "pre-conditional-prob"],
    lectures: [15],
    basis: "교재 14.1.3 정책과 가치함수 — 식 14-5 · 강의록 정책과 가치함수 · 공식 연습문제 Q4",
    aliases: ["state-value function", "v(s)", "vπ"],
  },
  {
    id: "t-action-value-function",
    term: "행동 가치함수",
    en: "action-value function",
    category: "수식·지표",
    short: "정책 π에 따라 상태 s에서 행동 a를 선택했을 때 얻을 수 있는 기대 보상 qπ(s, a).",
    definition:
      "주어진 정책 π에 따라 상태 s에서 행동 a를 선택하였을 때 얻을 수 있는 기대 보상. 이 함수를 흔히 Q-함수(Q-function)라고 한다.",
    formula: [
      { expr: "qπ(s, a) = E[Gₜ | Sₜ = s, Aₜ = a]", note: "식 14-6" },
      { expr: "Qπ(s, a) = Eπ[Gₜ | s, a]", note: "식 14-10 — Q-함수로 간단히 쓴 형태" },
    ],
    distinctions: [
      { from: "상태 가치함수", how: "상태만 받는가, 상태와 행동을 함께 받는가." },
      { from: "정책", how: "행동 가치함수는 값을 돌려주는 평가 함수이고, 정책은 행동을 고르는 규칙이다." },
    ],
    related: ["t-q-function", "t-state-value-function", "t-optimal-value-function"],
    prereqs: ["pre-expectation"],
    lectures: [15],
    basis: "교재 14.1.3 · 14.2.1 · 강의록 정책과 가치함수 · Q-학습",
    aliases: ["action-value function", "q(s, a)", "qπ"],
  },
  {
    id: "t-optimal-value-function",
    term: "최적 가치함수",
    en: "optimal value function",
    category: "수식·지표",
    short: "가능한 모든 정책에 대해 최대값을 갖는 상태 가치함수 v*(s)와 행동 가치함수 q*(s, a).",
    definition:
      "최적 상태 가치함수(optimal state-value function) v*(s)는 모든 정책에 대해 최대값을 갖는 상태 가치함수이고, 최적 행동 가치함수(optimal action-value function) q*(s, a)는 모든 정책에 대해 최대값을 갖는 행동 가치함수다.",
    formula: [
      { expr: "v*(s) = max_π vπ(s)", note: "식 14-7" },
      { expr: "q*(s, a) = max_π qπ(s, a)", note: "식 14-8" },
    ],
    related: ["t-optimal-policy", "t-state-value-function", "t-action-value-function"],
    lectures: [15],
    basis: "교재 14.1.3 정책과 가치함수 — 식 14-7 · 14-8 · 강의록 최적 가치함수와 최적 정책",
    aliases: ["최적 상태 가치함수", "최적 행동 가치함수", "v*", "q*"],
  },
  {
    id: "t-optimal-policy",
    term: "최적 정책",
    en: "optimal policy",
    category: "개념",
    short: "최종적인 누적 보상을 최대화하는 정책 π*. q*(s, a)를 최대화하는 행동에 확률 1을 준다.",
    definition:
      "최종적인 누적 보상을 최대화하는 최적 정책 π*: S ↦ A. 최적 행동 가치함수 q*(s, a)를 최대화하는 행동을 찾으면 된다.",
    formula: [
      { expr: "π*(a|s) = 1 if a = argmax_(a∈A) q*(s, a), 0 otherwise", note: "식 14-9" },
    ],
    example: "상태 11에서 Q̂(11, D) = 0.9, Q̂(11, L) = 0.729, 나머지 0이라면 D에만 1을 준다.",
    related: ["t-optimal-value-function", "t-policy", "t-q-learning"],
    prereqs: ["pre-argmax-argmin"],
    lectures: [15],
    basis: "교재 14.1.3 정책과 가치함수 — 식 14-9 · 강의록 최적 가치함수와 최적 정책",
    aliases: ["optimal policy", "π*"],
  },

  /* ─────────── Q-학습 ─────────── */
  {
    id: "t-q-function",
    term: "Q-함수",
    en: "Q-function",
    category: "수식·지표",
    short: "행동 가치함수의 다른 이름. 그 값은 Q-값(주어진 상태-행동 쌍의 기대 보상).",
    definition:
      "주어진 상태에서 어떤 동작을 취하였을 때의 기대 보상을 나타내는 행동 가치함수를 흔히 Q-함수라고 한다. 주어진 상태-행동 쌍의 기대 보상, 즉 Q-함수의 값을 Q-값(Q-value)이라고 한다.",
    formula: [{ expr: "Qπ(s, a) = Eπ[Gₜ | s, a]", note: "식 14-10" }],
    related: ["t-action-value-function", "t-q-learning", "t-q-table"],
    lectures: [15],
    basis: "교재 14.2.1 Q-학습 · 강의록 Q-학습 · 공식 연습문제 Q5",
    aliases: ["Q-function", "Q-값", "Q-value", "Q 함수"],
  },
  {
    id: "t-q-learning",
    term: "Q-학습",
    en: "Q-learning",
    category: "알고리즘",
    short: "최적 정책을 얻기 위해 최적 Q-함수 Q*(s, a)를 추정하는 방법.",
    definition:
      "최적 정책 π*를 얻기 위해 최적 Q-함수 Q*(s, a)를 추정하는 방법. ① 각 상태 s와 행동 a에 대해 Q̂(s, a)를 0으로 초기화 ② 임의의 상태 s를 현재 상태로 지정 ③ 다음 과정을 무한히 반복: ③-1 행동 a를 선택하고 실행, ③-2 즉각적인 보상 r을 얻음, ③-3 새로운 상태 s′를 얻음, ③-4 보상 r과 새로운 상태 s′ 정보를 사용해서 Q̂(s, a)를 갱신, ③-5 s ← s′.",
    formula: [
      { expr: "Q̂(s, a) = r + max_a′ Q̂(s′, a′)", note: "기본 갱신 규칙 (식 14-11의 형태)" },
      { expr: "Q̂(s, a) = r + γ max_a′ Q̂(s′, a′)", note: "할인율을 적용한 갱신 규칙 (식 14-14)" },
    ],
    example:
      "4×4 미로: Q̂(1, R) ← 0 + max{0, 0, 0, 0} = 0, Q̂(15, R) ← 1 + max{0, 0, 0, 0} = 1, Q̂(14, R) ← 0 + max{1, 0, 0, 0} = 1.",
    distinctions: [
      { from: "Q-신경망", how: "Q-학습의 기본형은 Q-값을 테이블로 갱신하고, Q-신경망은 Q-함수를 신경망으로 근사한다." },
    ],
    related: ["t-q-table", "t-q-function", "t-epsilon-greedy", "t-discounted-future-reward", "t-q-network"],
    prereqs: ["pre-argmax-argmin"],
    lectures: [15],
    basis: "교재 14.2.1 Q-학습 · 강의록 Q-학습 알고리즘 · Q-학습의 예",
    aliases: ["Q-learning", "Q 학습", "큐러닝"],
  },
  {
    id: "t-q-table",
    term: "Q-테이블",
    en: "Q-table",
    category: "개념",
    short: "이산적인 값을 갖는 Q-함수의 값을 상태 × 행동 테이블로 표현한 것.",
    definition:
      "Q-값이 이산적이므로 테이블 형태로 표현할 수 있다. 4×4 미로에서는 16가지 상태 × 4가지 행동이며, 각 칸을 사선으로 4개 구역으로 나눠 상하좌우 행동의 Q-값 Q̂(s, U), Q̂(s, R), Q̂(s, D), Q̂(s, L)을 표시한다.",
    role: "실제 응용에서는 비효율적이다. 100×100 미로는 10⁴ × 4, 아타리 게임은 256^(84×84×4)개의 화면 상태, 바둑은 10¹⁷⁰개의 상태라서 테이블 표현이 불가능하다.",
    related: ["t-q-learning", "t-q-network"],
    lectures: [15],
    basis: "교재 14.2.1 그림 14-8 · 14.2.2 그림 14-11 · 강의록 Q-테이블 · Q-테이블에서 Q-신경망으로",
    aliases: ["Q-table", "Q 테이블"],
  },
  {
    id: "t-exploration-exploitation",
    term: "탐험과 탐사",
    en: "exploration / exploitation",
    category: "개념",
    short: "탐험은 랜덤하게 다른 행동을, 탐사는 현재 Q-함수로 최적 행동을 선택하는 전략.",
    definition:
      "행동 선택에서 쓸 수 있는 두 가지 전략. 탐험(exploration)은 탐색공간 전체를 골고루 찾는 것으로, Q-학습에서는 랜덤하게 다른 행동을 선택한다. 탐사(exploitation)는 특정한 곳을 중심으로 주변을 집중적으로 찾는 것으로, 현재의 Q-함수 정보를 바탕으로 최적의 행동을 선택한다.",
    role: "하나의 경로가 찾아진 뒤 탐사만 하면 해당 경로만 계속 찾아지는 문제가 생기므로, 둘을 적절히 혼합해야 한다.",
    distinctions: [
      { from: "엡실론 탐욕", how: "엡실론 탐욕은 탐험과 탐사를 섞는 구체적인 방법이다." },
    ],
    related: ["t-epsilon-greedy", "t-q-learning"],
    lectures: [15],
    basis: "교재 14.2.1 Q-학습 · 강의록 행동 선택을 위한 전략",
    aliases: ["exploration", "exploitation", "탐험", "탐사"],
  },
  {
    id: "t-epsilon-greedy",
    term: "엡실론 탐욕 방법",
    en: "ε-greedy",
    category: "알고리즘",
    short: "ε의 확률로 탐험, 1 − ε의 확률로 탐사를 적용하는 혼합 선택 전략.",
    definition:
      "탐험과 탐사가 혼합된 선택 전략. ε의 확률로 탐험을 적용하고, 1 − ε의 확률로 탐사를 적용한다. 교재는 고정된 값 대신 학습이 진행됨에 따라 ε를 점차 줄여 나가는 방법을 소개한다.",
    formula: [
      { expr: "ε = 0.1/(t + 1)", note: "if rand(1) < ε → 임의로 행동 a 선택(탐험), else → a = argmax Q(s, a)(탐사)" },
    ],
    example: "t = 0이면 ε = 0.1, t = 4이면 ε = 0.02, t = 9이면 ε = 0.01. 시간이 지남에 따라 탐험의 정도는 줄고 탐사의 정도는 늘어난다.",
    related: ["t-exploration-exploitation", "t-q-learning", "t-dqn"],
    prereqs: ["pre-argmax-argmin"],
    lectures: [15],
    basis: "교재 14.2.1 Q-학습 · 강의록 행동 선택을 위한 전략",
    aliases: ["epsilon-greedy", "ε-greedy", "엡실론 그리디", "입실론 탐욕"],
  },
  {
    id: "t-discounted-future-reward",
    term: "할인된 미래 보상",
    en: "discounted future reward",
    category: "수식·지표",
    short: "미래에 얻게 될 보상에 할인율 γ를 적용한 것. Gₜ = Rₜ + γGₜ₊₁.",
    definition:
      "미래에 얻게 될 보상에 할인율 γ를 적용한 것으로, (식 14-4)의 총할인 보상과 개념적으로 동일하다. 하나 이상의 해(경로)를 찾았을 때 빠른(짧은) 경로가 더 좋은 것으로 평가되도록 학습에 적용한다.",
    formula: [
      { expr: "Gₜ = Rₜ + γRₜ₊₁ + γ²Rₜ₊₂ + ⋯ + γⁿ⁻ᵗRₙ = Rₜ + γGₜ₊₁", note: "식 14-13" },
      { expr: "Q̂(s, a) = r + γ max_a′ Q̂(s′, a′)", note: "식 14-14 — 알고리즘 ③-4에서 사용" },
    ],
    example:
      "γ = 0.9: Q̂(11, D) = 0 + 0.9 × 1 = 0.9, Q̂(10, D) = 0 + 0.9 × 0.9 = 0.81, Q̂(11, L) = 0 + 0.9 × 0.81 = 0.729 → 상태 11에서 15만 거치는 아래쪽 경로가 더 좋다.",
    related: ["t-discount-factor", "t-return", "t-q-learning"],
    prereqs: ["pre-geometric-discount"],
    lectures: [15],
    basis: "교재 14.2.1 Q-학습 — 식 14-13 ~ 14-17 · 강의록 더 좋은 경로에 대한 선택",
    aliases: ["discounted future reward"],
  },
  {
    id: "t-deterministic-model",
    term: "결정론적 모델과 비결정론적 모델",
    en: "deterministic / non-deterministic model",
    category: "개념",
    short: "임의성 없이 초기 조건과 파라미터로만 결정되는 모델 vs 내재적 임의성이 있는 모델.",
    definition:
      "결정론적(deterministic) 모델은 모델의 출력과 행동이 어떠한 임의성도 없이 초기 조건과 파라미터에 의해서만 전적으로 결정되는 모델로, 확률적인 불확실성이 존재하지 않는다. 비결정론적(non-deterministic) 모델은 모델에 내재적인 임의성이 존재하여, 동일한 초기 조건과 파라미터의 집합일지라도 서로 다른 여러 개의 출력이 만들어질 수 있다.",
    example: "4×4 미로 예제는 결정론적 환경을 가정했다. 장기, 바둑, 체스처럼 상대방과 번갈아 수를 결정하는 보드게임은 비결정적이라고 할 수 있다.",
    related: ["t-belief-factor", "t-transition-probability"],
    lectures: [15],
    basis: "교재 14.2.1 Q-학습 · 강의록 비결정론적 환경",
    aliases: ["deterministic", "non-deterministic", "결정론적", "비결정론적"],
  },
  {
    id: "t-belief-factor",
    term: "신뢰 요소",
    en: "belief factor",
    category: "수식·지표",
    short: "비결정론적 환경의 Q-학습에서 Q̂(s′, a′)에 대해 신뢰하는 정도를 반영하는 α. 학습률과 유사한 개념.",
    definition:
      "비결정론적 환경에서는 상태 전이와 Q̂(s′, a′)가 비결정론적이라 결정론적 Q-학습 알고리즘이 제대로 동작하지 않는다. 해결책으로 학습률과 유사한 개념의 신뢰 요소 α를 사용해 Q̂(s′, a′)에 대해 신뢰하는 정도를 반영한다. 이 비결정론적 학습 알고리즘의 수렴 특성은 이미 증명되었다(Watkins and Dayan, 1992).",
    formula: [
      { expr: "Q̂(s, a) ← (1 − α)Q̂(s, a) + α[r + γ max_a′ Q̂(s′, a′)]", note: "식 14-18" },
      { expr: "Q̂(s, a) ← Q̂(s, a) + α[r + γ max_a′ Q̂(s′, a′) − Q̂(s, a)]", note: "같은 식을 정리한 형태" },
    ],
    distinctions: [
      { from: "할인율 γ", how: "γ는 미래 보상의 할인, α는 새 결과에 대한 신뢰 정도. 식 14-18에 α = 1을 대입하면 결정론적 규칙과 같아진다." },
    ],
    related: ["t-deterministic-model", "t-q-learning", "t-learning-rate"],
    lectures: [15],
    basis: "교재 14.2.1 Q-학습 — 식 14-18 · 강의록 비결정론적 환경",
    aliases: ["belief factor", "α", "알파"],
  },

  /* ─────────── Q-신경망과 DQN ─────────── */
  {
    id: "t-q-network",
    term: "Q-신경망",
    en: "Q-network",
    category: "알고리즘",
    short: "Q-함수를 테이블이 아닌 근사함수로, 신경망을 이용해서 표현하고 추정하는 것.",
    definition:
      "실세계 응용에서는 Q-함수를 Q-테이블로 표현하는 데 한계가 있어 상태를 표현할 수 있는 근사함수가 필요하다. Q-함수를 테이블이 아닌 근사함수로 신경망을 이용해서 표현하고 추정하는 것을 Q-신경망이라고 한다.",
    role: "기본 형태는 상태 s와 행동 a를 입력받아 Q̂(s, a)를 출력한다. 모든 동작에 대해 개별적으로 Q-값을 계산하는 것이 매우 비효율적이라, 구글 딥마인드는 상태 s만 입력받고 출력층이 각 행동의 Q-값으로 구성되도록(출력 노드 수 = 행동의 개수) 재정의했다.",
    formula: [
      { expr: "yₜ = rₜ + γ max_a′ Q*(sₜ₊₁, a′) ≈ rₜ + γ max_a′ Q̂(sₜ₊₁, a′ | θ)", note: "목표 출력값 (식 14-19)" },
      { expr: "E(θ) = Σₜ₌₀ᵀ {Q̂(sₜ, aₜ | θ) − (rₜ + γ max_a′ Q̂(sₜ₊₁, a′ | θ))}²", note: "목적함수 (식 14-20)" },
    ],
    distinctions: [
      { from: "Q-테이블", how: "Q-테이블에서는 (식 14-20)이 수렴하지만, 비선형 함수 근사기인 Q-신경망에서는 수렴이 보장되지 않는다." },
    ],
    related: ["t-q-table", "t-dqn", "t-backpropagation", "t-gradient-descent"],
    lectures: [15],
    basis: "교재 14.2.2 심층 Q-신경망 — 그림 14-12 · 14-13 · 강의록 Q-신경망 Q-Network · Q-신경망의 학습",
    emphasis: "Q-신경망 자체는 기울기 강하 학습법인 오류역전파 학습 알고리즘을 사용하는 지도학습을 수행한다.",
    aliases: ["Q-network", "Q 신경망", "Q-네트워크"],
  },
  {
    id: "t-dqn",
    term: "DQN",
    en: "Deep Q-Network",
    category: "알고리즘",
    short: "CNN으로 원래 영상의 픽셀을 입력받아 미래 보상을 추정하는 행동 가치함수의 근사함수. 심층 Q-신경망.",
    definition:
      "합성곱 신경망(CNN) 구조를 이용하여 원래 영상의 픽셀 데이터를 입력으로 받아들여 미래 보상을 추정하는 행동 가치함수의 근사함수(function approximator). Q-신경망 학습의 불안정성에 대한 해결책으로 아타리 비디오 게임에 적용되었다.",
    role: "입력층: 최근 4개 프레임을 110×84 그레이 영상으로 축소한 뒤 가운데 84×84만 잘라 쌓은 84×84×4. 첫 번째 콘볼루션층: 보폭 4, 8×8 필터 16개 + ReLU. 두 번째 콘볼루션층: 보폭 2, 4×4 필터 32개 + ReLU. 첫 번째 완전연결층: 256개 노드 + ReLU. 두 번째 완전연결층: 각 유효한 행동에 단일 출력을 갖도록 선형 완전연결. 출력층: 18가지 조이스틱 조작 행동의 Q-값. 2015년 논문에서는 세 번째 콘볼루션층(보폭 1, 3×3 필터 64개)과 512개 노드의 은닉층이 사용되었다.",
    distinctions: [
      { from: "LSTM 기반 모델", how: "DQN은 CNN 기반이다. 공식 연습문제의 ‘LSTM 기반의 심층 신경망 모델’은 틀린 설명이다." },
    ],
    related: ["t-q-network", "t-experience-replay", "t-target-network", "t-cnn", "t-epsilon-greedy"],
    lectures: [15],
    basis: "교재 14.2.2 심층 Q-신경망 — 그림 14-14 · 강의록 Deep Q-Network · DQN 학습 알고리즘 · 공식 연습문제 Q5",
    emphasis: "아타리 49종 게임에 동일한 구조와 파라미터를 쓰는 하나의 신경망을 사용했다 — CNN과 Q-학습의 결합.",
    aliases: ["DQN", "Deep Q-Network", "심층 Q-신경망", "심층 Q-학습", "Deep Q-learning"],
  },
  {
    id: "t-experience-replay",
    term: "경험 재현",
    en: "experience replay",
    category: "알고리즘",
    short: "경험을 재현 메모리에 저장했다가 균등 무작위 추출로 미니배치를 만들어 데이터 간 상관관계를 줄이는 기법.",
    definition:
      "재현(replay)을 통해 학습 데이터의 시퀀스를 재구성하는 기법. 용량 N인 재현 메모리 D를 초기화한 후, 에이전트의 경험 eₜ = (sₜ, aₜ, rₜ, sₜ₊₁)를 시간 간격 단위로 Dₜ = {e₁, …, eₜ}에 저장해 두고, 저장된 D로부터 균등 무작위 추출 (s, a, r, s′) ~ U(D)을 통해 미니배치를 구성하여 학습한다.",
    role: "데이터 간의 높은 상관관계에 따른 학습 불안정성을 해결한다. 데이터 사용의 효율성이 높아지고, 미니배치가 순차적인 데이터로 구성되지 않아 상관관계가 상당히 줄며, 과거 경험에 대한 반복 학습이 가능하다.",
    distinctions: [
      { from: "목표망", how: "경험 재현은 데이터 간 상관관계, 목표망은 목표 출력값의 시변성을 해결한다." },
    ],
    related: ["t-dqn", "t-target-network"],
    lectures: [15],
    basis: "교재 14.2.2 심층 Q-신경망 · 강의록 경험 재현, 목표망",
    aliases: ["experience replay", "재현 메모리", "replay memory"],
  },
  {
    id: "t-target-network",
    term: "목표망",
    en: "target network",
    category: "알고리즘",
    short: "주 Q-신경망과 같은 구조, 다른 파라미터 θ⁻로 목표 출력값을 계산하고 매 C단계마다만 갱신되는 별도의 신경망.",
    definition:
      "원래의 Q-신경망(주 Q-신경망)과는 별도로 만들어 함께 사용하는 신경망. 같은 구조를 갖지만 다른 파라미터 θ⁻를 가지며 Q-학습의 목표 출력값 계산에 사용된다. θ⁻는 매 C단계마다 주기적으로 주 Q-신경망의 파라미터 θ로 갱신한다.",
    role: "Q-함수를 갱신하면 목표 출력값도 함께 움직이는 시변적인(non-stationary) 목표 출력값 문제를 해결한다. C번의 반복 동안에는 θ⁻가 갱신되지 않으므로 목표 출력값이 움직이는 현상을 방지한다.",
    formula: [
      { expr: "E(θ) = Σₜ₌₀ᵀ {Q̂(sₜ, aₜ | θ) − (rₜ + γ max_a′ Q̂(sₜ₊₁, a′ | θ⁻))}²", note: "식 14-21" },
    ],
    distinctions: [
      { from: "경험 재현", how: "목표망은 시변적인 목표 출력값, 경험 재현은 데이터 간 상관관계 문제에 대응한다." },
    ],
    related: ["t-dqn", "t-experience-replay", "t-q-network"],
    lectures: [15],
    basis: "교재 14.2.2 심층 Q-신경망 — 식 14-21 · 강의록 경험 재현, 목표망 · DQN 학습 알고리즘",
    aliases: ["target network", "θ⁻"],
  },
];
