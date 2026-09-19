import type { PrereqEntry } from "@/lib/mlPrereqs";

/** 5강에서 새로 필요한 선행 개념 */
export const lecture5Prereqs: PrereqEntry[] = [
  {
    id: "pre-unit-vector",
    term: "단위벡터와 사영",
    en: "unit vector / projection",
    area: "벡터와 행렬",
    chapter: "2장 데이터 표현: 벡터와 행렬",
    short: "크기가 1인 벡터. 단위벡터 w와 내적하면 x를 w 방향으로 사영한 크기가 나온다.",
    why: "선형변환에 의한 특징추출은 전부 사영이다. 특징값 y = wᵀx가 '사영한 크기'가 되려면 w가 단위벡터여야 한다는 조건을 모르면 6/√5 같은 값이 왜 나오는지 따라갈 수 없다.",
    definition:
      "크기(2차 노름)가 1인 벡터를 단위벡터라 한다. 벡터 x에서 w 방향 직선에 수선의 발을 내렸을 때, 원점에서 그 발까지의 부호 있는 길이가 x를 w 방향으로 사영한 크기이며 w가 단위벡터이면 내적 wᵀx와 같다. w가 단위벡터가 아니면 wᵀx를 ‖w‖로 나눠야 한다.",
    formula: [
      { expr: "‖w‖ = 1 이면  y = wᵀx", note: "x를 w 방향으로 사영한 크기" },
      { expr: "일반적인 w:  y = wᵀx / ‖w‖" },
      { expr: "w/‖w‖", note: "임의의 벡터를 단위벡터로 만드는 방법" },
    ],
    example: {
      setup: "x = [2, 2]ᵀ, w = [2, 1]ᵀ/√5",
      work: ["‖[2, 1]‖ = √5이므로 w는 단위벡터", "wᵀx = (2·2 + 1·2)/√5"],
      result: "y = 6/√5 ≈ 2.683",
    },
    usedIn: [{ lecture: 5, where: "특징값 yᵢ = wᵢᵀx — x를 W의 열벡터 wᵢ 위로 사영한 값" }],
    pitfall:
      "w = [1, 1]ᵀ처럼 크기가 1이 아닌 벡터로 그냥 내적하면 사영한 길이의 ‖w‖배가 나온다. 반드시 크기로 나누거나 미리 단위벡터로 바꿔 쓴다.",
  },
  {
    id: "pre-basis-vector",
    term: "기저벡터와 부분공간",
    en: "basis vector / subspace",
    area: "벡터와 행렬",
    chapter: "2장 데이터 표현: 벡터와 행렬",
    short: "공간의 모든 점을 조합으로 나타내는 기준 벡터들. 그중 일부가 이루는 공간이 부분공간.",
    why: "변환행렬 W의 각 열이 '사영할 저차원 부분공간의 기저'라는 문장이 5강의 핵심이다. 기저를 몇 개 고르느냐가 곧 몇 차원으로 줄이느냐다.",
    definition:
      "n차원 공간의 모든 벡터를 그 조합으로 나타낼 수 있는 벡터 집합을 기저라 한다. 서로 직교하고 크기가 1인 기저를 직교단위기저라 하며, 이때 x = Σⱼ(xᵀuⱼ)uⱼ처럼 각 기저 방향의 사영 크기를 계수로 쓴다. 기저벡터 중 m개만 골라 그 조합으로 만들 수 있는 벡터들의 모임이 m차원 부분공간이다.",
    formula: [
      { expr: "x = Σⱼ₌₁ⁿ (xᵀuⱼ)uⱼ", note: "직교단위기저 {u₁, …, u_n}로 나타낸 x" },
      { expr: "x̃ = Σⱼ₌₁ᵐ (xᵀuⱼ)uⱼ", note: "m개 기저로 근사 — m차원 부분공간으로의 사영" },
    ],
    example: {
      setup: "3차원에서 w₁ = [1, 0, 0]ᵀ, w₂ = [0, 1, 0]ᵀ",
      work: ["두 벡터는 서로 직교하고 크기가 1", "둘이 이루는 부분공간은 x₁–x₂ 평면"],
      result: "Wᵀx = [x₁, x₂]ᵀ — x를 그 평면으로 사영한 2차원 특징",
    },
    usedIn: [
      { lecture: 5, where: "부분공간분석 — 변환행렬 W의 각 열이 부분공간의 기저" },
      { lecture: 5, where: "PCA의 수학적 유도 — 식 7-5, 7-6" },
    ],
  },
  {
    id: "pre-eigen",
    term: "고유치와 고유벡터",
    en: "eigenvalue / eigenvector",
    area: "벡터와 행렬",
    chapter: "2장 데이터 표현: 벡터와 행렬",
    short: "행렬을 곱해도 방향이 바뀌지 않고 크기만 λ배 되는 벡터 u와 그 배율 λ.",
    why: "PCA는 공분산행렬, LDA는 S_W⁻¹S_B의 고유치 분석으로 변환행렬을 만든다. 고유치가 곧 그 방향의 분산이라는 해석을 알아야 '큰 고유치부터 m개'라는 규칙이 이해된다.",
    definition:
      "정방행렬 A에 대해 Au = λu를 만족하는 0이 아닌 벡터 u를 고유벡터, 그때의 스칼라 λ를 고유치라 한다. 대칭행렬(공분산행렬)은 서로 직교하는 고유벡터들로 A = UΛUᵀ처럼 분해할 수 있으며, Λ는 고유치를 대각 성분으로 가지는 고유치행렬, U는 고유벡터를 열벡터로 가지는 고유벡터행렬이다. 이 분해를 고유치 분석이라 한다.",
    formula: [
      { expr: "Au = λu" },
      { expr: "Σ = UΛUᵀ = [u₁, …, u_n] diag(λ₁, …, λ_n) [u₁, …, u_n]ᵀ", note: "고유치 분석(eigenvalue decomposition)" },
      { expr: "uᵀΣu = λ", note: "공분산행렬의 고유치 = 그 고유벡터로 사영한 값들의 분산" },
    ],
    example: {
      setup: "A = [[2, 0], [0, 1]]",
      work: ["A[1, 0]ᵀ = [2, 0]ᵀ = 2·[1, 0]ᵀ", "A[0, 1]ᵀ = [0, 1]ᵀ = 1·[0, 1]ᵀ"],
      result: "고유치 2, 1 — 고유벡터 [1, 0]ᵀ, [0, 1]ᵀ",
    },
    usedIn: [
      { lecture: 5, where: "PCA 수행 단계 ② — 공분산 Σₓ의 고유치 분석" },
      { lecture: 5, where: "LDA 수행 단계 ② — S_W⁻¹S_B의 고유치 분석" },
    ],
    pitfall:
      "계산 도구는 고유치를 작은 것부터 내놓기도 한다. 몇 번째 열인지가 아니라 고유치의 크기로 골라야 한다.",
  },
  {
    id: "pre-rank",
    term: "랭크",
    en: "rank",
    area: "벡터와 행렬",
    chapter: "2장 데이터 표현: 벡터와 행렬",
    short: "행렬 안에 서로 독립인 방향이 몇 개 들어 있는지. 0이 아닌 고유치의 개수와 관련된다.",
    why: "LDA의 특징이 최대 M − 1차원으로 제한되는 이유가 S_B의 랭크가 M − 1이기 때문이다.",
    definition:
      "행렬의 열(또는 행) 가운데 서로 선형 독립인 것의 최대 개수. 벡터 몇 개를 바깥곱해 더한 행렬의 랭크는 그 벡터들이 만드는 방향의 수를 넘지 못한다. 대칭행렬에서는 0이 아닌 고유치의 개수와 같다.",
    usedIn: [{ lecture: 5, where: "LDA — S_B의 랭크가 M − 1이라 0이 아닌 고유치가 최대 M − 1개" }],
  },
  {
    id: "pre-trace",
    term: "대각합(Trace)",
    en: "trace",
    area: "벡터와 행렬",
    chapter: "2장 데이터 표현: 벡터와 행렬",
    short: "정방행렬의 대각원소를 모두 더한 값.",
    why: "다중 클래스 LDA의 목적함수 J(W)가 Trace로 정의된다. 행렬을 숫자 하나로 요약해 최대화할 수 있게 해 준다.",
    definition: "정방행렬의 대각원소들의 합을 계산하는 연산.",
    formula: [{ expr: "Trace(A) = a₁₁ + a₂₂ + … + a_nn" }],
    example: { setup: "A = [[3, 1], [2, 5]]", work: ["대각원소 3과 5"], result: "Trace(A) = 8" },
    usedIn: [{ lecture: 5, where: "다중 클래스 LDA의 목적함수 J(W) = Trace{(WS_WWᵀ)⁻¹(WS_BWᵀ)}" }],
  },
];

/** 이미 있는 선행 개념이 5강에서 쓰이는 자리 */
export const lecture5PrereqUsages: { id: string; where: string }[] = [
  { id: "pre-column-vector", where: "n차원 열벡터 x와 m차원 특징벡터 y" },
  { id: "pre-transpose", where: "y = Wᵀx — n × m인 W를 전치해 m × n으로 곱함" },
  { id: "pre-matrix-mult", where: "Y = WᵀX의 크기 (m × n)(n × N) = m × N" },
  { id: "pre-dot-product", where: "특징값 yᵢ = wᵢᵀx" },
  { id: "pre-norm", where: "단위벡터 조건 ‖w‖ = 1, 정보손실량 ‖x − x̃‖²" },
  { id: "pre-euclidean", where: "MDS의 특징 간 거리, Isomap과 비교하는 직선 거리" },
  { id: "pre-mean-vector", where: "PCA의 μₓ, LDA의 클래스 평균 m_k와 전체 평균 m" },
  { id: "pre-variance", where: "사영한 특징값들의 분산 — PCA가 최대화하는 값" },
  { id: "pre-covariance-matrix", where: "PCA 수행 단계 ① 공분산 Σₓ = (1/N)(X − Mₓ)(X − Mₓ)ᵀ" },
  { id: "pre-diagonal", where: "고유치행렬 Λ, 모든 주성분을 쓴 특징의 대각 공분산" },
  { id: "pre-inverse", where: "LDA의 S_W⁻¹ — 작은 표본 집합에서는 존재하지 않음" },
  { id: "pre-quadratic-form", where: "J(w) = wᵀS_Bw / wᵀS_Ww, uᵀSu = λ" },
  { id: "pre-sigma", where: "정보손실량 J = Σⱼ₌ₘ₊₁ⁿ λⱼ, r(n, m)" },
  { id: "pre-partial-derivative", where: "라그랑주 승수로 만든 목적함수를 u로 미분해 Su = λu 유도" },
  { id: "pre-lagrange", where: "PCA 유도 — 단위벡터 조건을 결합한 J̃(u) = uᵀSu − λ(1 − uᵀu) (식 7-9)" },
  { id: "pre-gaussian", where: "SNE의 입력 데이터 유사도 — 가우시안 분포 가정" },
  { id: "pre-conditional-prob", where: "t-SNE의 유사도 p_{j|i}, q_{j|i}" },
  { id: "pre-exp-log", where: "SNE의 exp(−‖xᵢ − xⱼ‖²/2σᵢ²)" },
  { id: "pre-scatter", where: "특징 분포를 2차원 산점도로 보는 데이터 시각화" },
];
