import type { PrereqEntry } from "@/lib/mlPrereqs";

/** 8강에서 새로 필요한 선행 개념 */
export const lecture8Prereqs: PrereqEntry[] = [
  {
    id: "pre-lagrange",
    term: "라그랑주 승수법",
    en: "method of Lagrange multipliers",
    area: "미분과 수식 표기",
    short: "조건이 붙은 최적화 문제를, 조건마다 승수를 곱해 더한 하나의 함수로 바꿔 푸는 방법.",
    why: "SVM은 ‖w‖²/2를 최소화하면서 모든 데이터가 yᵢ(wᵀxᵢ + w₀) ≥ 1을 만족해야 한다. 목적과 조건을 한 함수로 묶는 이 방법을 모르면 라그랑주 함수와 이원적 문제 Q(α)가 어디서 나왔는지 따라갈 수 없다.",
    definition:
      "함수 f를 최적화하면서 조건 g ≥ 0을 만족해야 할 때, 조건마다 라그랑주 승수 α ≥ 0을 곱해 L = f − Σαg로 묶은 뒤 원래 변수에 대해 미분해 0으로 놓는 방법. 원래 변수에 대해서는 극소화, 승수에 대해서는 극대화한다. 조건이 여유 있게 만족되는(g > 0) 곳에서는 승수가 0이 된다.",
    formula: [
      { expr: "L(w, α) = f(w) − Σᵢ αᵢ gᵢ(w),  αᵢ ≥ 0" },
      { expr: "∂L/∂w = 0 으로 w를 α로 표현한 뒤 대입 → α만의 문제", note: "SVM의 이원적 문제가 이렇게 얻어짐" },
    ],
    example: {
      setup: "f(w) = ½w²를 조건 w − 1 ≥ 0 아래에서 최소화",
      work: [
        "L = ½w² − α(w − 1), α ≥ 0",
        "∂L/∂w = w − α = 0 → w = α",
        "대입하면 Q(α) = α − ½α², 이를 최대화하면 α = 1",
        "따라서 w = 1 — 조건 w ≥ 1의 경계에서 최솟값",
      ],
      result: "w = 1, α = 1 (조건이 딱 맞게 걸린 곳에서만 α ≠ 0)",
    },
    usedIn: [
      { lecture: 8, where: "라그랑주 함수 J(w, w₀, α) = ½‖w‖² − Σαᵢ{yᵢ(wᵀxᵢ + w₀) − 1}와 이원적 문제 Q(α)" },
    ],
    pitfall:
      "라그랑주 승수는 학습 데이터마다 하나씩 있다. 그중 서포트 벡터처럼 조건이 등호로 걸린 데이터만 0이 아닌 값을 갖는다.",
  },
  {
    id: "pre-sign-function",
    term: "부호함수",
    en: "sign function",
    area: "미분과 수식 표기",
    short: "입력이 양수이면 +1, 음수이면 −1을 내놓는 함수 sign(x).",
    why: "SVM의 결정규칙 f(x) = sign(g(x))는 판별함수 값의 부호만 보고 클래스를 정한다. 출력이 +1/−1 두 값뿐이라는 점이 목표 출력값 yᵢ ∈ {−1, 1}과 맞물린다.",
    definition: "x의 값이 양수이면 +1, 음수이면 −1의 출력값을 가지는 함수. 결정경계 위(x = 0)는 어느 쪽에도 속하지 않는 경계로 본다.",
    formula: [{ expr: "sign(x) = +1 (x > 0), −1 (x < 0)" }],
    example: {
      setup: "g(x) = 0.8, g(x) = −2.3일 때",
      work: ["sign(0.8) = +1 → C₁", "sign(−2.3) = −1 → C₂"],
      result: "값의 크기는 버리고 부호만 남긴다",
    },
    usedIn: [
      { lecture: 8, where: "결정규칙 f(x) = sign(g(x))와 SVM의 분류 함수 f(x) = sign(Σα̂ᵢyᵢxᵢᵀx + ŵ₀)" },
    ],
  },
  {
    id: "pre-point-plane-distance",
    term: "점과 초평면 사이의 거리",
    en: "distance from a point to a hyperplane",
    area: "벡터와 행렬",
    short: "점 x에서 초평면 wᵀx + w₀ = 0까지의 거리 d = (wᵀx + w₀)/‖w‖.",
    why: "마진은 결정경계에 가장 가까운 데이터까지의 거리다. 이 거리 공식이 있어야 마진 M = 2/‖w‖가 나오고, 마진 최대화가 ‖w‖ 최소화로 바뀌는 이유가 보인다.",
    definition:
      "x를 법선 벡터 w 방향으로 사영한 길이 wᵀx/‖w‖에서, 초평면 위의 점을 같은 방향으로 사영한 길이 −w₀/‖w‖를 뺀 값. 부호가 있어 초평면의 어느 쪽에 있는지도 알려 준다.",
    formula: [
      { expr: "d = wᵀx/‖w‖ − (−w₀/‖w‖) = (wᵀx + w₀)/‖w‖", note: "교재 식 10-4" },
    ],
    example: {
      setup: "w = (−0.5, 0.5), w₀ = 0.5, x = (2, 3)",
      work: ["wᵀx + w₀ = −1 + 1.5 + 0.5 = 1", "‖w‖ = √0.5 ≈ 0.707", "d = 1 / 0.707 ≈ 1.414"],
      result: "d ≈ 1.414 (= 1/‖w‖, 서포트 벡터에서 결정경계까지의 거리)",
    },
    usedIn: [{ lecture: 8, where: "한 점 x에서 결정경계까지의 거리 d와 마진 M = 2/‖w‖" }],
    pitfall: "w가 단위벡터가 아니므로 반드시 ‖w‖로 나눠야 한다. 나누지 않은 wᵀx + w₀는 거리가 아니라 판별함수 값이다.",
  },
];

/** 이미 있는 선행 개념이 8강에서 쓰이는 자리 */
export const lecture8PrereqUsages: { id: string; where: string }[] = [
  { id: "pre-dot-product", where: "판별함수 wᵀx, Q(α)의 xᵢᵀxⱼ, 커널 함수 k(x, y) = Φ(x)·Φ(y)" },
  { id: "pre-transpose", where: "선형 판별함수 g(x) = wᵀx + w₀" },
  { id: "pre-norm", where: "마진 M = 2/‖w‖와 목적함수 J(w) = ‖w‖²/2" },
  { id: "pre-unit-vector", where: "점에서 결정경계까지의 거리 — x를 w/‖w‖ 방향으로 사영" },
  { id: "pre-hyperplane", where: "선형 초평면 분류기의 결정경계 wᵀx + w₀ = 0, 플러스·마이너스 평면" },
  { id: "pre-partial-derivative", where: "라그랑주 함수를 w, w₀에 대해 미분 (식 10-12, 10-13)" },
  { id: "pre-sigma", where: "ŵ = Σα̂ᵢyᵢxᵢ, Q(α)의 이중 합 ΣΣαᵢαⱼyᵢyⱼxᵢᵀxⱼ" },
  { id: "pre-exp-log", where: "가우시안 커널 k(x, y) = exp{−‖x − y‖²/2σ²}" },
  { id: "pre-euclidean", where: "가우시안 커널의 ‖x − y‖²" },
];
