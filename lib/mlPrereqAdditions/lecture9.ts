import type { PrereqEntry } from "@/lib/mlPrereqs";

/** 9강에서 새로 필요한 선행 개념 */
export const lecture9Prereqs: PrereqEntry[] = [
  {
    id: "pre-composite-function",
    term: "합성함수",
    en: "composite function",
    area: "미분과 수식 표기",
    short: "함수의 출력을 다시 다른 함수의 입력으로 넣어 만든 함수 f(g(x)).",
    why: "다층 퍼셉트론의 식 11-4는 φ_o( Σ v φ_h( Σ w x ) )처럼 활성화 함수 안에 또 활성화 함수가 들어 있는 모양이다. 합성이 몇 겹인지, 안쪽 괄호부터 계산한다는 감각이 없으면 이 식이 한 덩어리 기호로만 보인다. 층을 쌓는다는 말이 곧 함수를 합성한다는 말이기도 하다.",
    definition:
      "두 함수 f와 g에 대해 g의 출력을 f의 입력으로 넣어 만든 함수를 f와 g의 합성함수라 하고 f(g(x)) 또는 (f∘g)(x)로 쓴다. 계산은 안쪽 g부터 하고 그 결과를 f에 넣는다. 신경망에서는 층 하나가 함수 하나에 해당하므로, 층을 쌓는 것은 함수를 합성하는 것과 같다.",
    formula: [
      { expr: "(f∘g)(x) = f(g(x))", note: "안쪽 g를 먼저 계산" },
      {
        expr: "y_k = φ_o( Σⱼ vⱼₖ φ_h( Σᵢ wᵢⱼxᵢ + w₀ⱼ ) + v₀ₖ )",
        note: "식 11-4 — 가중합 → φ_h → 가중합 → φ_o 네 단계의 합성",
      },
    ],
    example: {
      setup: "φ(u) = tanh(u), 은닉 뉴런 하나에 w = 2, w₀ = −1, 출력 가중치 v = 3, v₀ = 0.5, 입력 x = 1",
      work: [
        "안쪽 가중합: u^h = 2×1 − 1 = 1",
        "은닉 출력: z = tanh(1) ≈ 0.7616",
        "바깥 가중합: u^o = 3×0.7616 + 0.5 ≈ 2.785",
        "출력 뉴런이 선형함수면 y = 2.785",
      ],
      result: "y ≈ 2.785 — 안쪽부터 바깥으로 네 번 계산하면 끝난다",
    },
    usedIn: [
      { lecture: 9, where: "다층 퍼셉트론의 함수식 f_k(x, θ) (식 11-4, 11-5)와 표현 능력 (식 11-6)" },
      { lecture: 10, where: "오류 역전파에서 바깥 층부터 거슬러 미분을 전개할 때" },
    ],
    pitfall:
      "φ_h(Σwx)와 Σw·φ_h(x)는 전혀 다른 값이다. 활성화 함수는 가중합을 모두 끝낸 뒤 한 번만 적용한다.",
  },
  {
    id: "pre-vector-notation-bold",
    term: "벡터와 스칼라의 표기 구분",
    en: "bold notation for vectors",
    area: "벡터와 행렬",
    short: "진하게 쓴 x는 여러 값이 묶인 벡터, 가늘게 쓴 xᵢ는 그중 한 값.",
    why: "9강에서는 f(x; w)의 x와 w, xᵢ와 wᵢⱼ, 그리고 θ가 한 화면에 함께 나온다. 어느 것이 숫자 하나이고 어느 것이 묶음인지 구분하지 못하면 “신경망은 하나의 함수 y = f(x)”라는 그림과 Σwᵢxᵢ라는 식이 따로 놀게 된다.",
    definition:
      "벡터는 진하게(x, w), 그 안의 개별 성분은 가늘게 아래 첨자를 붙여(x₁, x₂, …) 쓴다. 신경망의 입력은 n차원 벡터 x = [x₁, …, xₙ], 출력은 M차원 벡터 y = [y₁, …, y_M]이며, 모든 가중치를 묶은 하나의 파라미터는 θ로 쓴다. 아래 첨자가 둘이면(wᵢⱼ) 두 노드를 잇는 가중치처럼 두 개의 번호가 필요한 값이다.",
    formula: [
      { expr: "x = [x₁, x₂, …, xₙ]", note: "n차원 입력 벡터 — 성분 하나하나가 입력 노드의 값" },
      { expr: "wᵢⱼ", note: "i번째 입력 노드에서 j번째 은닉 노드로 가는 가중치 — 번호가 둘" },
      { expr: "θ = W ∪ V", note: "모든 가중치를 묶은 학습 대상" },
    ],
    example: {
      setup: "입력 노드 3개, 은닉 노드 2개인 다층 퍼셉트론",
      work: [
        "x는 성분이 3개인 벡터 하나",
        "W는 3×2 = 6개의 wᵢⱼ와 은닉 바이어스 2개",
        "y₁ 하나는 숫자 하나, y는 그 숫자들을 묶은 벡터",
      ],
      result: "굵기와 첨자 개수만 보고도 그 기호가 숫자 하나인지 묶음인지 알 수 있다",
    },
    usedIn: [
      { lecture: 9, where: "f(x; w), 다층 퍼셉트론의 기호 체계 wᵢⱼ · vⱼₖ · θ" },
      { lecture: 10, where: "학습 데이터 {(xᵢ, tᵢ)}와 가중치 벡터의 갱신" },
    ],
    pitfall:
      "wᵢⱼ의 i와 j 순서가 바뀌면 다른 연결이 된다. 교재는 앞쪽 첨자를 보내는 노드, 뒤쪽 첨자를 받는 노드로 쓴다.",
  },
];

/** 이미 있는 선행 개념이 9강에서 쓰이는 자리 */
export const lecture9PrereqUsages: { id: string; where: string }[] = [
  { id: "pre-sigma", where: "가중합 u = Σᵢ₌₁ⁿ wᵢxᵢ, uⱼʰ = Σwᵢⱼxᵢ + w₀ⱼ, u_kᵒ = Σvⱼₖzⱼ + v₀ₖ" },
  { id: "pre-dot-product", where: "입력 벡터와 가중치 벡터의 같은 자리끼리 곱해 더하는 가중합" },
  { id: "pre-column-vector", where: "n차원 입력 벡터 x = [x₁, …, xₙ]와 M차원 출력 벡터 y" },
  { id: "pre-transpose", where: "지면을 아껴 가로로 쓴 입력 벡터 표기" },
  { id: "pre-exp-log", where: "시그모이드 1/(1 + e⁻ᵘ)와 하이퍼탄젠트 (1 − e⁻²ᵘ)/(1 + e⁻²ᵘ)의 지수함수" },
  { id: "pre-sign-function", where: "활성화 함수 중 부호함수 φ_sign(u)" },
  { id: "pre-hyperplane", where: "퍼셉트론의 선형 판별함수가 만드는 직선 결정경계와 XOR 문제" },
  { id: "pre-point-plane-distance", where: "결정경계의 어느 쪽에 있는지를 가중합의 부호로 판단하는 계단함수의 동작" },
];
