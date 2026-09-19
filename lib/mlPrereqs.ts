/**
 * 머신러닝 1~8강을 따라가는 데 필요한 선행 개념.
 *
 * 교재 구성에서 2장(데이터 표현: 벡터와 행렬)과 3장(데이터 분포: 확률과 통계)은
 * 자율 학습 범위로 지정되어 있고, 강의는 이 내용을 이미 안다고 보고 진행한다.
 * 여기서는 1~8강 본문에서 실제로 쓰이는 것만 골라, 쓰이는 자리와 함께 정리한다.
 */

import { lecture5Prereqs, lecture5PrereqUsages } from "@/lib/mlPrereqAdditions/lecture5";
import { lecture6Prereqs, lecture6PrereqUsages } from "@/lib/mlPrereqAdditions/lecture6";
import { lecture7Prereqs, lecture7PrereqUsages } from "@/lib/mlPrereqAdditions/lecture7";
import { lecture8Prereqs, lecture8PrereqUsages } from "@/lib/mlPrereqAdditions/lecture8";

export type PrereqArea = "벡터와 행렬" | "확률과 통계" | "미분과 수식 표기";

export interface PrereqUsage {
  lecture: number;
  /** 이 개념이 실제로 쓰이는 자리 */
  where: string;
}

export interface PrereqEntry {
  id: string;
  term: string;
  en?: string;
  area: PrereqArea;
  /** 한 줄 정의 */
  short: string;
  /** 왜 필요한가 — 이걸 모르면 무엇이 막히는지 */
  why: string;
  definition: string;
  formula?: { expr: string; note?: string }[];
  /** 작은 수치 예 */
  example?: { setup: string; work: string[]; result: string };
  usedIn: PrereqUsage[];
  /** 자주 틀리는 지점 */
  pitfall?: string;
  /** 교재 대응 장 */
  chapter?: string;
}

const basePrereqs: PrereqEntry[] = [
  /* ─────────── 벡터와 행렬 ─────────── */
  {
    id: "pre-column-vector",
    term: "열벡터와 행벡터",
    en: "column vector / row vector",
    area: "벡터와 행렬",
    chapter: "2장 데이터 표현: 벡터와 행렬",
    short: "n개의 값을 세로로 쌓으면 열벡터, 가로로 늘어놓으면 행벡터.",
    why: "머신러닝에서 하나의 데이터는 예외 없이 벡터로 표현된다. 데이터 하나가 세로로 선 숫자 묶음이라는 감각이 없으면 이후 모든 수식이 기호로만 보인다.",
    definition:
      "n개의 값을 가진 데이터를 n×1 크기로 세로로 쌓은 것이 열벡터, 1×n 크기로 가로로 늘어놓은 것이 행벡터. 벡터는 진하게, 소문자로 표기한다. n차원 열벡터 x는 n차원 공간상의 한 점에 해당한다.",
    formula: [
      { expr: "x = [x₁, x₂, …, x_n]ᵀ", note: "n×1 열벡터. ᵀ는 전치이므로 가로로 쓴 것을 세로로 세운다는 뜻" },
    ],
    example: {
      setup: "2차원 데이터 하나가 (2, 3)일 때",
      work: ["열벡터로 쓰면 세로로 2, 3 두 칸", "크기는 2×1", "2차원 평면에서 가로 2, 세로 3 위치의 점 하나"],
      result: "x = [2, 3]ᵀ",
    },
    usedIn: [
      { lecture: 1, where: "데이터 표현 — 7×5 이진 영상을 35차원 열벡터로 펴기" },
      { lecture: 2, where: "판별함수의 입력 x와 평균 벡터 μᵢ" },
      { lecture: 3, where: "다변량 선형회귀의 입력 벡터" },
      { lecture: 4, where: "데이터 xⱼ와 대표 벡터 m_k" },
    ],
    pitfall:
      "가로로 길게 쓴 [x₁, x₂, …, x_n]에 ᵀ가 붙어 있으면 그것은 행벡터가 아니라 열벡터다. 지면을 아끼려고 눕혀 쓴 것뿐이다.",
  },
  {
    id: "pre-transpose",
    term: "전치",
    en: "transpose",
    area: "벡터와 행렬",
    chapter: "2장 데이터 표현: 벡터와 행렬",
    short: "행과 열을 맞바꾸는 연산. 기호는 위첨자 ᵀ.",
    why: "xᵀu, wᵀx̃, (y−Xw)ᵀ(y−Xw), XᵀX처럼 강의에 나오는 거의 모든 행렬식이 전치를 포함한다. 전치가 크기를 어떻게 바꾸는지 모르면 식이 왜 하나의 숫자가 되는지 알 수 없다.",
    definition:
      "행렬의 i행 j열 원소를 j행 i열로 옮기는 연산. m×n 행렬을 전치하면 n×m이 된다. 열벡터(n×1)를 전치하면 행벡터(1×n)가 된다.",
    formula: [{ expr: "(Aᵀ)ᵢⱼ = Aⱼᵢ" }, { expr: "n×1  →ᵀ→  1×n" }],
    usedIn: [
      { lecture: 1, where: "사영의 특징값 xᵀu" },
      { lecture: 2, where: "이차형식 (x−μᵢ)ᵀΣᵢ⁻¹(x−μᵢ)" },
      { lecture: 3, where: "f(x) = wᵀx̃, 최적해 w = (XᵀX)⁻¹Xᵀy" },
    ],
  },
  {
    id: "pre-dot-product",
    term: "내적",
    en: "inner product / dot product",
    area: "벡터와 행렬",
    chapter: "2장 데이터 표현: 벡터와 행렬",
    short: "같은 자리끼리 곱해서 전부 더한 값. 결과는 벡터가 아니라 숫자 하나.",
    why: "사영으로 특징을 뽑는 계산이 곧 내적이다. 두 벡터에서 숫자 하나가 나온다는 점이 차원 축소의 핵심이다.",
    definition:
      "두 n차원 벡터의 같은 위치 원소끼리 곱한 뒤 모두 더한 것. 행벡터(1×n)와 열벡터(n×1)의 곱이므로 결과는 1×1, 즉 스칼라 하나다.",
    formula: [{ expr: "xᵀu = x₁u₁ + x₂u₂ + … + x_n u_n" }],
    example: {
      setup: "x = (2, 3), u = (1, 1)",
      work: ["같은 자리끼리 곱한다: 2×1 = 2, 3×1 = 3", "모두 더한다: 2 + 3"],
      result: "xᵀu = 5 — 두 개의 값이 하나의 값으로 줄었다",
    },
    usedIn: [
      { lecture: 1, where: "사영에 의한 특징추출 — 특징값 xᵀu" },
      { lecture: 2, where: "거리 함수 중 내적과 코사인 거리" },
    ],
  },
  {
    id: "pre-norm",
    term: "노름",
    en: "norm",
    area: "벡터와 행렬",
    chapter: "2장 데이터 표현: 벡터와 행렬",
    short: "벡터의 길이를 재는 방법. 재는 방식에 따라 1차·2차·p차 노름이 있다.",
    why: "거리 함수는 결국 두 점의 차 벡터의 노름이다. 노름이 여러 종류라는 것을 알아야 K-최근접이웃에서 거리 함수를 왜 고르는지 이해된다.",
    definition:
      "벡터의 크기를 나타내는 값. 2차 노름은 각 원소를 제곱해 더한 뒤 제곱근을 취한 것이고, 1차 노름은 각 원소의 절댓값을 더한 것, p차 노름은 p제곱해 더한 뒤 p제곱근을 취한 것이다.",
    formula: [
      { expr: "‖x‖₂ = √(x₁² + x₂² + … + x_n²)", note: "2차 노름" },
      { expr: "‖x‖₁ = |x₁| + |x₂| + … + |x_n|", note: "1차 노름" },
      { expr: "‖x‖_p = (Σ|xᵢ|ᵖ)^(1/p)", note: "p차 노름" },
    ],
    example: {
      setup: "x = (3, 4)",
      work: ["2차 노름: √(3² + 4²) = √25", "1차 노름: |3| + |4|"],
      result: "‖x‖₂ = 5, ‖x‖₁ = 7 — 같은 벡터라도 재는 방법에 따라 값이 다르다",
    },
    usedIn: [
      { lecture: 2, where: "K-최근접이웃의 거리 함수 — 2차 노름, 1차 노름, p차 노름" },
      { lecture: 3, where: "오차함수 E(w) = (y−Xw)ᵀ(y−Xw)" },
      { lecture: 4, where: "목적함수 J의 ‖x_n − mᵢ‖²" },
    ],
  },
  {
    id: "pre-euclidean",
    term: "유클리디안 거리",
    en: "Euclidean distance",
    area: "벡터와 행렬",
    chapter: "2장 데이터 표현: 벡터와 행렬",
    short: "두 점을 잇는 직선 길이. 차 벡터의 2차 노름.",
    why: "최소거리 분류기, K-최근접이웃, K-평균이 모두 거리 비교로 판단한다. 가장 기본이 되는 거리다.",
    definition: "두 점의 대응하는 좌표끼리 뺀 차를 제곱해 모두 더한 뒤 제곱근을 취한 값.",
    formula: [{ expr: "d(x, y) = √(Σ(xᵢ − yᵢ)²) = ‖x − y‖₂" }],
    example: {
      setup: "x = (1, 2), y = (4, 6)",
      work: ["좌표 차: (1−4, 2−6) = (−3, −4)", "제곱해 더함: 9 + 16 = 25", "제곱근"],
      result: "d = 5",
    },
    usedIn: [
      { lecture: 2, where: "최소거리 분류기, K-최근접이웃" },
      { lecture: 4, where: "데이터 그룹핑에서 대표 벡터와의 거리" },
    ],
    pitfall:
      "거리를 비교만 할 때는 제곱근을 생략해도 순서가 바뀌지 않는다. 강의에서 argmin을 제곱거리로 쓰는 이유가 이것이다.",
  },
  {
    id: "pre-matrix-mult",
    term: "행렬 곱과 크기 규칙",
    en: "matrix multiplication",
    area: "벡터와 행렬",
    chapter: "2장 데이터 표현: 벡터와 행렬",
    short: "(m×n)·(n×p) = (m×p). 안쪽 숫자가 같아야 곱할 수 있고, 결과는 바깥 숫자.",
    why: "다변량 선형회귀에서 y = Xw가 왜 N×1이 되는지, wᵀx̃가 왜 숫자 하나가 되는지는 이 규칙 하나로 전부 확인된다. 식을 외우지 않고 검산하는 방법이다.",
    definition:
      "왼쪽 행렬의 열 개수와 오른쪽 행렬의 행 개수가 같아야 곱할 수 있으며, 결과는 왼쪽의 행 개수 × 오른쪽의 열 개수 크기가 된다.",
    formula: [{ expr: "(m×n) · (n×p) = (m×p)", note: "가운데 n이 맞아떨어지며 사라진다" }],
    example: {
      setup: "입력이 n차원이고 데이터가 N개인 다변량 선형회귀",
      work: [
        "X는 각 행이 데이터 하나이고 앞에 1이 붙으므로 N×(n+1)",
        "w는 w₀부터 w_n까지이므로 (n+1)×1",
        "가운데 (n+1)이 맞아떨어진다",
      ],
      result: "y = Xw의 크기는 N×1 — 데이터마다 예측값 하나씩",
    },
    usedIn: [{ lecture: 3, where: "다변량 선형회귀의 행렬 표현과 차원 검산" }],
  },
  {
    id: "pre-identity",
    term: "단위행렬",
    en: "identity matrix",
    area: "벡터와 행렬",
    chapter: "2장 데이터 표현: 벡터와 행렬",
    short: "대각선만 1이고 나머지가 0인 정사각행렬. 곱해도 상대를 바꾸지 않는다.",
    why: "공분산행렬이 σ²I라는 조건이 왜 결정경계를 직선으로 만드는지 이해하려면, 단위행렬이 방향을 전혀 왜곡하지 않는다는 성질을 알아야 한다.",
    definition:
      "주대각 원소가 모두 1이고 나머지가 모두 0인 정사각행렬 I. 어떤 행렬에 곱해도 그 행렬이 그대로 나온다. 공분산이 σ²I이면 모든 축의 분산이 σ²로 같고 축 사이 상관이 0이라는 뜻이다.",
    formula: [{ expr: "AI = IA = A" }, { expr: "Σ = σ²I  ⇒  모든 방향으로 퍼짐이 같은 원형 분포" }],
    usedIn: [{ lecture: 2, where: "클래스 공통 단위 공분산행렬 → 최소거리 분류기" }],
  },
  {
    id: "pre-diagonal",
    term: "대각행렬",
    en: "diagonal matrix",
    area: "벡터와 행렬",
    chapter: "2장 데이터 표현: 벡터와 행렬",
    short: "대각선 밖이 전부 0인 행렬. 축 사이 상관이 없다는 뜻.",
    why: "공분산이 대각행렬일 때 마할라노비스 거리가 정규화된 유클리디안 거리가 되는 이유가 여기서 나온다.",
    definition:
      "주대각 원소만 값을 갖고 나머지가 모두 0인 행렬. 공분산행렬이 대각행렬이면 변수들 사이에 상관이 없고 각 축의 분산만 다르다.",
    usedIn: [{ lecture: 2, where: "마할라노비스 거리 → 정규화된 유클리디안 거리" }],
  },
  {
    id: "pre-determinant",
    term: "행렬식",
    en: "determinant",
    area: "벡터와 행렬",
    chapter: "2장 데이터 표현: 벡터와 행렬",
    short: "정사각행렬에서 얻는 하나의 수. 기호는 |A| 또는 det A.",
    why: "가우시안 판별함수의 ln|Σᵢ| 항이 바로 이것이다. 클래스마다 공분산이 다를 때 이 항이 남아서 결정경계가 곡선이 된다.",
    definition:
      "정사각행렬에 대응하는 하나의 수. 분포의 관점에서는 퍼짐의 부피에 해당해서, 값이 클수록 그 클래스의 분포가 넓게 퍼져 있다는 뜻이다.",
    formula: [{ expr: "2×2일 때  |A| = ad − bc", note: "A = [[a, b], [c, d]]" }],
    example: {
      setup: "Σ = [[4, 0], [0, 1]]",
      work: ["|Σ| = 4×1 − 0×0"],
      result: "|Σ| = 4 — 한 축으로 더 넓게 퍼진 분포",
    },
    usedIn: [{ lecture: 2, where: "판별함수의 ln|Σᵢ| 항, 일반적인 공분산행렬의 곡선 결정경계" }],
  },
  {
    id: "pre-inverse",
    term: "역행렬",
    en: "inverse matrix",
    area: "벡터와 행렬",
    chapter: "2장 데이터 표현: 벡터와 행렬",
    short: "곱해서 단위행렬이 되는 짝. 행렬판 나눗셈.",
    why: "다변량 회귀의 최적해 w = (XᵀX)⁻¹Xᵀy가 나오는 과정이 양변에 역행렬을 곱해 w를 떼어내는 것이다. 마할라노비스 거리의 Σ⁻¹도 같은 기호다.",
    definition:
      "A에 곱해서 단위행렬이 되는 행렬 A⁻¹. 수에서 양변을 같은 수로 나누는 것에 해당하며, 행렬에서는 나눗셈이 없으므로 역행렬을 곱해서 원하는 항을 떼어낸다.",
    formula: [
      { expr: "AA⁻¹ = A⁻¹A = I" },
      { expr: "XᵀXw = Xᵀy  ⇒  w = (XᵀX)⁻¹Xᵀy", note: "양변 왼쪽에 (XᵀX)⁻¹를 곱한 결과" },
    ],
    usedIn: [
      { lecture: 2, where: "마할라노비스 거리의 Σ⁻¹" },
      { lecture: 3, where: "다변량 선형회귀의 최적 파라미터" },
    ],
  },
  {
    id: "pre-quadratic-form",
    term: "이차형식",
    en: "quadratic form",
    area: "벡터와 행렬",
    chapter: "2장 데이터 표현: 벡터와 행렬",
    short: "(벡터)ᵀ(행렬)(벡터) 꼴. 결과는 숫자 하나이며 거리의 제곱 역할을 한다.",
    why: "가우시안 지수부와 마할라노비스 거리가 전부 이 꼴이다. 크기를 따라가 보면 이것이 왜 하나의 거리값인지 보인다.",
    definition:
      "행벡터, 정사각행렬, 열벡터를 차례로 곱한 식. 크기가 (1×n)·(n×n)·(n×1) = 1×1이므로 결과는 숫자 하나다. 가운데 행렬이 단위행렬이면 보통의 제곱거리가 된다.",
    formula: [
      { expr: "(x − μ)ᵀ Σ⁻¹ (x − μ)" },
      { expr: "Σ = I 이면  (x − μ)ᵀ(x − μ) = ‖x − μ‖²", note: "보통의 제곱거리" },
    ],
    usedIn: [{ lecture: 2, where: "가우시안 확률밀도함수의 지수부, 판별함수, 마할라노비스 거리" }],
  },
  {
    id: "pre-mean-vector",
    term: "평균 벡터",
    en: "mean vector",
    area: "벡터와 행렬",
    chapter: "2장 데이터 표현: 벡터와 행렬",
    short: "여러 벡터를 자리별로 평균 낸 벡터. 그 집단의 중심.",
    why: "베이즈 분류기의 μᵢ와 K-평균의 대표 벡터 m_k가 모두 평균 벡터다. 두 강의가 같은 개념을 다른 이름으로 부르고 있다.",
    definition:
      "여러 개의 벡터를 같은 자리끼리 더한 뒤 개수로 나눈 벡터. 그 데이터 집단의 중심 위치를 나타낸다.",
    formula: [{ expr: "m = (1/|C|) Σ_{x∈C} x" }],
    example: {
      setup: "(2, 4), (4, 6), (6, 8) 세 점",
      work: ["첫 자리 평균: (2+4+6)/3 = 4", "둘째 자리 평균: (4+6+8)/3 = 6"],
      result: "m = (4, 6)",
    },
    usedIn: [
      { lecture: 2, where: "클래스 평균 μᵢ" },
      { lecture: 4, where: "K-평균의 대표 벡터 m_k와 그 수정식" },
    ],
  },

  /* ─────────── 확률과 통계 ─────────── */
  {
    id: "pre-random-variable",
    term: "확률변수",
    en: "random variable",
    area: "확률과 통계",
    chapter: "3장 데이터 분포: 확률과 통계",
    short: "값이 확률적으로 정해지는 변수.",
    why: "머신러닝에서 데이터를 랜덤 벡터로 본다는 말은, 데이터 하나하나가 확률적으로 뽑힌 결과라는 뜻이다. 표본마다 결과가 달라지는 이유가 여기서 나온다.",
    definition:
      "어떤 값이 나올지 확률에 따라 결정되는 변수. 여러 개의 확률변수를 묶으면 랜덤 벡터가 되고, 머신러닝에서 데이터 하나는 랜덤 벡터로 표현된다.",
    usedIn: [{ lecture: 1, where: "데이터 표현 — 랜덤 벡터, 표본집합의 확률적 불확실성" }],
  },
  {
    id: "pre-pdf",
    term: "확률밀도함수",
    en: "probability density function",
    area: "확률과 통계",
    chapter: "3장 데이터 분포: 확률과 통계",
    short: "연속적인 값에서 어느 구간에 얼마나 몰려 있는지를 나타내는 함수.",
    why: "베이즈 분류기는 클래스마다 이 함수를 추정해서 비교한다. 곡선이 높은 쪽이 그 값이 나올 가능성이 크다는 감각이 필요하다.",
    definition:
      "연속 확률변수의 분포를 나타내는 함수 p(x). 값 자체가 확률은 아니고, 구간에 대해 적분한 넓이가 그 구간에 속할 확률이 된다. 곡선이 높은 구간일수록 데이터가 많이 모여 있다.",
    usedIn: [
      { lecture: 1, where: "모집단의 확률밀도함수, 등고선 표현, 일반화 오차의 p(x)" },
      { lecture: 2, where: "클래스별 확률밀도 p(x|Ck)와 결정경계" },
    ],
    pitfall:
      "밀도함수의 값은 확률이 아니라 밀도다. 그래서 1보다 클 수도 있다. 확률은 넓이로 읽어야 한다.",
  },
  {
    id: "pre-population-sample",
    term: "모집단과 표본집합",
    en: "population / sample",
    area: "확률과 통계",
    chapter: "3장 데이터 분포: 확률과 통계",
    short: "모집단은 전체, 표본집합은 거기서 뽑은 일부.",
    why: "학습 데이터가 표본집합 중 하나에 불과하다는 것이 과다적합과 일반화 오차를 이해하는 출발점이다.",
    definition:
      "관심 대상 전체가 모집단이고, 거기서 확률적으로 뽑아낸 일부가 표본집합이다. 같은 모집단에서 뽑아도 표본집합마다 모양이 다르며, 표본이 클수록 모집단의 분포에 가까워진다.",
    usedIn: [
      { lecture: 1, where: "데이터 분포 — 표본집합 4개 비교, 일반화 오차를 계산할 수 없는 이유" },
    ],
  },
  {
    id: "pre-expectation",
    term: "평균",
    en: "mean / expectation",
    area: "확률과 통계",
    chapter: "3장 데이터 분포: 확률과 통계",
    short: "값들을 모두 더해 개수로 나눈 값. 분포의 중심.",
    why: "회귀의 x̄, ȳ, K-평균의 대표 벡터, 가우시안의 μ가 모두 평균이다. 회귀라는 말 자체가 데이터를 평균 같은 값으로 되돌린다는 뜻이다.",
    definition: "모든 값을 더한 뒤 개수로 나눈 값. 분포의 중심 위치를 나타낸다.",
    formula: [{ expr: "x̄ = (1/N) Σ xᵢ" }],
    usedIn: [
      { lecture: 3, where: "최적 매개변수의 x̄, ȳ" },
      { lecture: 4, where: "대표 벡터 수정식" },
    ],
  },
  {
    id: "pre-variance",
    term: "분산과 표준편차",
    en: "variance / standard deviation",
    area: "확률과 통계",
    chapter: "3장 데이터 분포: 확률과 통계",
    short: "평균에서 얼마나 흩어져 있는지. 표준편차는 분산의 제곱근.",
    why: "군집화의 목표가 클러스터 내 분산 최소, 클러스터 간 분산 최대다. K-평균의 목적함수 J도 분산의 합이다.",
    definition:
      "각 값이 평균에서 떨어진 거리를 제곱해 평균 낸 것이 분산이고, 그 제곱근이 표준편차다. 값이 클수록 넓게 퍼져 있다는 뜻이다.",
    formula: [{ expr: "σ² = (1/N) Σ (xᵢ − x̄)²" }, { expr: "σ = √(σ²)" }],
    usedIn: [
      { lecture: 1, where: "데이터 분포 특성, 군집화의 학습 목표" },
      { lecture: 4, where: "목적함수 J는 각 클러스터 분산의 합" },
    ],
  },
  {
    id: "pre-covariance",
    term: "공분산",
    en: "covariance",
    area: "확률과 통계",
    chapter: "3장 데이터 분포: 확률과 통계",
    short: "두 변수가 함께 움직이는 정도. 양수면 같이 늘고, 음수면 반대로 움직인다.",
    why: "분포가 원형인지 기울어진 타원인지를 결정하는 값이다. 베이즈 분류기의 세 경우가 전부 이 값의 형태로 갈린다.",
    definition:
      "두 변수가 각자의 평균에서 벗어난 정도를 곱해 평균 낸 값. 0이면 두 변수 사이에 선형적인 연관이 없다는 뜻이고, 0이 아니면 분포가 기울어진 타원 모양이 된다.",
    formula: [{ expr: "Cov(x, y) = (1/N) Σ (xᵢ − x̄)(yᵢ − ȳ)" }],
    usedIn: [{ lecture: 2, where: "공분산행렬의 형태에 따른 판별함수" }],
  },
  {
    id: "pre-covariance-matrix",
    term: "공분산행렬",
    en: "covariance matrix",
    area: "확률과 통계",
    chapter: "3장 데이터 분포: 확률과 통계",
    short: "각 축의 분산과 축 사이 공분산을 한 표에 모은 정사각행렬. 기호는 Σ.",
    why: "2강 전체가 이 행렬의 형태에 따라 갈린다. σ²I면 원형이라 결정경계가 직선, 공통 Σ면 같은 방향 타원이라 여전히 직선, 클래스마다 다르면 곡선이 된다.",
    definition:
      "대각에는 각 축의 분산이, 대각 밖에는 축들 사이의 공분산이 들어가는 정사각행렬. 데이터 구름의 모양과 기울기를 결정한다.",
    formula: [
      { expr: "Σ = [[σ₁₁, σ₁₂], [σ₂₁, σ₂₂]]", note: "2차원일 때. σ₁₂ = σ₂₁" },
      { expr: "Σ = σ²I → 원형 / Σ 일반형 → 기울어진 타원" },
    ],
    usedIn: [{ lecture: 2, where: "가우시안 베이즈 분류기의 세 가지 경우" }],
    pitfall:
      "대문자 Σ가 두 가지로 쓰인다. 수식 앞에 붙어 여러 항을 더하라는 합 기호일 때와, 공분산행렬이라는 이름일 때다. 문맥으로 구분해야 한다.",
  },
  {
    id: "pre-gaussian",
    term: "정규분포",
    en: "Gaussian / normal distribution",
    area: "확률과 통계",
    chapter: "3장 데이터 분포: 확률과 통계",
    short: "평균을 중심으로 좌우 대칭인 종 모양 분포. 평균 μ와 공분산 Σ로 결정된다.",
    why: "베이즈 분류기를 실제로 구현할 때 클래스별 분포를 가우시안으로 가정한다. 판별함수의 모양이 전부 이 함수에서 나온다.",
    definition:
      "평균 주변에 데이터가 가장 많이 모이고 멀어질수록 급격히 줄어드는 종 모양 분포. 다차원에서는 평균 벡터 μ와 공분산행렬 Σ 두 가지로 모양이 완전히 정해진다. 등고선은 타원이 된다.",
    formula: [
      {
        expr: "p(x) = 1/√((2π)ⁿ|Σ|) · exp(−½(x−μ)ᵀΣ⁻¹(x−μ))",
        note: "지수부가 이차형식, 앞의 계수에 행렬식이 들어간다",
      },
    ],
    usedIn: [
      { lecture: 1, where: "데이터 분포 예시 — 평균 (3,3), 분산 단위행렬" },
      { lecture: 2, where: "가우시안 베이즈 분류기" },
    ],
  },
  {
    id: "pre-conditional-prob",
    term: "조건부확률",
    en: "conditional probability",
    area: "확률과 통계",
    chapter: "3장 데이터 분포: 확률과 통계",
    short: "B가 일어났다는 조건에서 A가 일어날 확률. 기호는 P(A|B).",
    why: "분류를 확률 기반으로 푸는 접근 전체가 조건부확률 P(Ck|x)를 추정하는 일이다. 세로줄의 오른쪽이 이미 주어진 조건이라는 것을 놓치면 베이즈 정리가 뒤집혀 읽힌다.",
    definition:
      "어떤 사건이 이미 일어났다고 할 때 다른 사건이 일어날 확률. 세로줄 오른쪽이 조건, 왼쪽이 관심 대상이다.",
    formula: [{ expr: "P(A|B) = P(A ∩ B) / P(B)" }],
    usedIn: [{ lecture: 2, where: "확률 기반 분류기 — P(Ck|x) 추정" }],
    pitfall:
      "P(x|Ck)와 P(Ck|x)는 완전히 다른 값이다. 앞은 그 클래스에서 이 데이터가 나올 가능성, 뒤는 이 데이터가 그 클래스일 가능성이다. 둘을 잇는 다리가 베이즈 정리다.",
  },
  {
    id: "pre-bayes-rule",
    term: "베이즈 정리",
    en: "Bayes' theorem",
    area: "확률과 통계",
    chapter: "3장 데이터 분포: 확률과 통계 (강의록에서 교재 63쪽 참조)",
    short: "조건을 뒤집는 공식. 사전확률로부터 사후확률을 계산한다.",
    why: "실제로 추정할 수 있는 것은 클래스별 밀도 p(x|Ck)인데, 판단에 필요한 것은 P(Ck|x)다. 이 둘의 방향을 바꿔 주는 것이 베이즈 정리이고, 2강의 축이다.",
    definition:
      "조건과 대상을 맞바꿔 확률을 계산하는 공식. 분자는 우도와 사전확률의 곱, 분모는 전체 확률이다.",
    formula: [
      { expr: "P(A|B) = P(B|A)P(A) / P(B)" },
      { expr: "P(Ck|x) = p(x|Ck)p(Ck) / p(x)", note: "분류에 적용한 형태" },
    ],
    usedIn: [{ lecture: 2, where: "베이즈 분류기의 판별함수와 결정경계 유도" }],
    pitfall:
      "분자에 사전확률 P(A)가 곱해진다는 점을 빠뜨리기 쉽다. P(A|B) = P(B|A)/P(B)로 쓰면 틀린 식이다.",
  },
  {
    id: "pre-prior-posterior",
    term: "사전확률과 사후확률",
    en: "prior / posterior probability",
    area: "확률과 통계",
    chapter: "3장 데이터 분포: 확률과 통계",
    short: "데이터를 보기 전의 확률이 사전확률, 보고 난 뒤 갱신된 확률이 사후확률.",
    why: "베이즈 결정규칙이 사후확률 비교이고, 사전확률이 달라지면 결정경계가 이동한다. 두 확률의 역할 차이를 알아야 경계가 왜 움직이는지 설명할 수 있다.",
    definition:
      "사전확률 p(Ck)는 데이터를 보기 전에 각 클래스가 차지하는 비율이고, 사후확률 P(Ck|x)는 데이터 x를 관찰한 뒤 갱신된 그 클래스일 확률이다. 선험확률, 후험확률이라고도 한다.",
    usedIn: [{ lecture: 2, where: "결정경계가 사전확률에 따라 이동하는 이유" }],
    pitfall:
      "사전확률은 전체에서 각 클래스가 차지하는 비율이고, 오즈비는 한 입력이 두 클래스에 속할 확률의 비율이다. 3강 연습문제에서 자주 뒤바뀐다.",
  },
  {
    id: "pre-likelihood",
    term: "우도",
    en: "likelihood",
    area: "확률과 통계",
    chapter: "3장 데이터 분포: 확률과 통계",
    short: "그 클래스나 그 매개변수에서 지금 데이터가 나올 가능성.",
    why: "우도비 검정에서 두 클래스의 우도를 나누고, 로지스틱 회귀에서는 우도를 최대로 만드는 매개변수를 찾는다. 두 강의를 관통하는 개념이다.",
    definition:
      "매개변수나 클래스가 주어졌을 때 지금 관찰된 데이터가 나올 확률밀도. 데이터를 고정해 두고 매개변수를 바꿔 가며 보는 관점이라는 점에서 확률과 방향이 반대다.",
    formula: [{ expr: "우도비 = p(x|C1) / p(x|C2)", note: "각 클래스에서 x가 관찰될 확률밀도의 비율" }],
    usedIn: [
      { lecture: 2, where: "우도비 검정으로 유도한 결정경계" },
      { lecture: 3, where: "로그 우도 목적함수와 최대우도 추정법" },
    ],
  },
  {
    id: "pre-bernoulli",
    term: "베르누이 분포",
    en: "Bernoulli distribution",
    area: "확률과 통계",
    chapter: "3장 데이터 분포: 확률과 통계 (강의록에서 교재 3장 72쪽 참조)",
    short: "결과가 둘 중 하나인 시행의 분포. 성공 확률 p, 실패 확률 1−p.",
    why: "로지스틱 회귀의 목표 출력이 0 또는 1이므로 p(y|x)가 베르누이 분포를 따른다. 로그 우도 목적함수가 그 모양인 이유가 여기 있다.",
    definition:
      "시행 결과가 성공과 실패 둘 중 하나로만 나오는 확률실험의 분포. y = 1일 확률이 p이면 y = 0일 확률은 1 − p다.",
    formula: [
      { expr: "p(y) = p^y (1−p)^(1−y)", note: "y = 1이면 p, y = 0이면 1−p가 되도록 한 줄로 묶은 식" },
    ],
    usedIn: [{ lecture: 3, where: "로지스틱 회귀의 매개변수 추정" }],
  },
  {
    id: "pre-mle",
    term: "최대우도 추정",
    en: "maximum likelihood estimation",
    area: "확률과 통계",
    chapter: "3장 데이터 분포: 확률과 통계",
    short: "지금 데이터가 관찰될 가능성을 가장 크게 만드는 매개변수를 고르는 방법.",
    why: "선형회귀는 오차를 최소화하지만 로지스틱 회귀는 우도를 최대화한다. 목적함수가 바뀌는 지점이라 두 방법의 결정적인 차이다.",
    definition:
      "주어진 데이터가 관찰될 확률을 최대로 만드는 매개변수를 선택하는 추정 방법. 곱셈이 길어지는 것을 피하려고 보통 로그를 취한 로그 우도를 최대화한다.",
    usedIn: [{ lecture: 3, where: "로지스틱 회귀의 m, b 추정" }],
  },
  {
    id: "pre-scatter",
    term: "산점도",
    en: "scatter plot",
    area: "확률과 통계",
    chapter: "3장 데이터 분포: 확률과 통계",
    short: "데이터를 점으로 찍어 분포 모양을 보는 그림.",
    why: "분포 특성을 눈으로 읽는 기본 도구다. 결정경계, 군집, 회귀선이 전부 이 위에 그려진다.",
    definition: "각 데이터를 좌표평면 위의 점으로 찍어, 점들이 어떤 모양으로 퍼져 있는지 보는 그림.",
    usedIn: [{ lecture: 1, where: "2차원 데이터 집합의 분포 특성" }],
  },

  /* ─────────── 미분과 수식 표기 ─────────── */
  {
    id: "pre-sigma",
    term: "시그마 표기",
    en: "summation notation",
    area: "미분과 수식 표기",
    short: "여러 항을 차례로 더하라는 기호. Σ 아래위에 범위를 쓴다.",
    why: "오차함수, 목적함수, 회귀 계산 공식이 전부 이 기호로 쓰여 있다. 읽는 법만 알면 복잡해 보이는 식이 단순한 덧셈으로 풀린다.",
    definition:
      "아래에 시작, 위에 끝을 적고 그 사이의 값을 차례로 대입해 모두 더하라는 기호. 데이터 N개에 대해 무언가를 더한다는 뜻으로 가장 많이 쓴다.",
    formula: [{ expr: "Σᵢ₌₁ᴺ xᵢ = x₁ + x₂ + … + x_N" }],
    example: {
      setup: "x = (1, 2, 3, 4)에 대해 Σxᵢ²",
      work: ["각 항을 제곱: 1, 4, 9, 16", "모두 더함"],
      result: "Σxᵢ² = 30",
    },
    usedIn: [
      { lecture: 1, where: "학습 오차·테스트 오차 수식" },
      { lecture: 3, where: "최적 매개변수 공식의 Σxᵢ, Σxᵢ², Σxᵢyᵢ" },
      { lecture: 4, where: "목적함수 J의 이중 합" },
    ],
    pitfall:
      "Σxᵢ²와 (Σxᵢ)²는 다르다. 앞은 제곱해서 더한 것, 뒤는 더해서 제곱한 것이다. 회귀 계수 공식의 분모에 둘이 함께 나오므로 반드시 구분해야 한다.",
  },
  {
    id: "pre-partial-derivative",
    term: "편미분",
    en: "partial derivative",
    area: "미분과 수식 표기",
    short: "변수가 여럿일 때 하나만 변수로 보고 나머지는 상수로 두고 미분하는 것.",
    why: "선형회귀의 w₁, w₀를 구하는 과정, 로지스틱 회귀의 최대우도, K-평균의 대표 벡터 수정식이 전부 편미분해서 0으로 놓는 방식이다.",
    definition:
      "여러 변수를 가진 함수에서 관심 있는 변수 하나만 변수로 취급하고 나머지는 상수로 고정한 채 미분하는 것. 기호는 ∂를 쓴다.",
    formula: [{ expr: "∂E(w₁, w₀)/∂w₀", note: "w₁은 상수로 두고 w₀에 대해서만 미분" }],
    usedIn: [
      { lecture: 3, where: "최적 매개변수 계산 과정, 다변량 최적해, 최대우도 추정" },
      { lecture: 4, where: "∂J/∂mᵢ = 0에서 대표 벡터 수정식 유도" },
    ],
  },
  {
    id: "pre-minimize-by-derivative",
    term: "미분해서 0으로 놓기",
    en: "first-order condition",
    area: "미분과 수식 표기",
    short: "아래로 볼록한 함수의 최솟값은 기울기가 0인 지점에서 나온다.",
    why: "최소제곱법이 왜 계산으로 풀리는지의 전부다. 오차함수가 매개변수에 대한 2차 함수이므로, 미분해서 0으로 놓으면 답이 바로 나온다.",
    definition:
      "함수가 최솟값이나 최댓값을 갖는 지점에서는 접선의 기울기가 0이다. 따라서 미분한 식을 0으로 놓고 풀면 그 지점의 좌표를 얻는다.",
    example: {
      setup: "E(w) = (w − 3)² 의 최솟값",
      work: ["미분: dE/dw = 2(w − 3)", "0으로 놓음: 2(w − 3) = 0"],
      result: "w = 3에서 최소",
    },
    usedIn: [{ lecture: 3, where: "오차함수를 w₁, w₀에 대해 편미분해 연립방정식으로 푸는 과정" }],
  },
  {
    id: "pre-chain-rule",
    term: "제곱 항의 미분",
    en: "chain rule",
    area: "미분과 수식 표기",
    short: "제곱을 미분하면 2가 앞으로 내려오고, 괄호 안을 한 번 더 미분해 곱한다.",
    why: "오차함수는 잔차의 제곱합이다. 편미분 결과에 왜 −2가 붙고 뒤에 xᵢ가 따라붙는지가 이 규칙으로 설명된다.",
    definition:
      "합성함수를 미분할 때 바깥 함수를 먼저 미분하고 안쪽 함수의 미분을 곱하는 규칙. 제곱 항에서는 지수 2가 앞으로 내려오고 괄호 안의 미분이 곱해진다.",
    formula: [
      { expr: "d/dw [f(w)]² = 2 f(w) · f′(w)" },
      { expr: "∂/∂w₁ (yᵢ − w₁xᵢ − w₀)² = −2(yᵢ − w₁xᵢ − w₀)·xᵢ", note: "안쪽을 w₁로 미분하면 −xᵢ" },
    ],
    usedIn: [{ lecture: 3, where: "최적 매개변수 계산 과정의 편미분" }],
  },
  {
    id: "pre-local-global-min",
    term: "지역 극소점과 전역 극소점",
    en: "local / global minimum",
    area: "미분과 수식 표기",
    short: "주변에서만 가장 낮으면 지역 극소점, 전체에서 가장 낮으면 전역 극소점.",
    why: "K-평균이 지역 극소점은 보장하지만 전역 극소점은 보장하지 않는다는 서술이 이 구분 위에 있다. 초기값에 따라 결과가 달라지는 이유이기도 하다.",
    definition:
      "주변 구간에서 가장 작은 값을 갖는 점이 지역 극소점이고, 정의역 전체에서 가장 작은 값을 갖는 점이 전역 극소점이다. 골짜기가 여러 개인 함수에서는 어느 골짜기로 내려가는지가 시작점에 따라 달라진다.",
    usedIn: [{ lecture: 4, where: "K-평균 알고리즘의 수렴 성질과 초기값 의존성" }],
  },
  {
    id: "pre-exp-log",
    term: "지수함수와 로그함수",
    en: "exponential / logarithm",
    area: "미분과 수식 표기",
    short: "서로 역함수. 로그를 취하면 곱이 합으로, 지수가 계수로 바뀐다.",
    why: "가우시안 판별함수에 ln을 씌워 지수부를 끌어내리고, 로지스틱 회귀에서 곱으로 된 우도에 로그를 씌워 합으로 바꾼다. 두 강의의 식 정리가 전부 이 성질을 쓴다.",
    definition:
      "eˣ와 ln x는 서로 역함수 관계다. 로그는 곱을 합으로, 거듭제곱을 계수로 바꾸며, 단조 증가 함수이므로 로그를 씌워도 크기 순서가 바뀌지 않는다.",
    formula: [
      { expr: "ln(ab) = ln a + ln b" },
      { expr: "ln(aᵇ) = b ln a" },
      { expr: "ln(eˣ) = x" },
    ],
    usedIn: [
      { lecture: 2, where: "lᵢ(x) = ln gᵢ(x)로 지수부를 내려 판별함수를 단순화" },
      { lecture: 3, where: "로지스틱 함수, 오즈비에 로그를 취한 로짓 함수, 로그 우도" },
    ],
    pitfall:
      "로그는 단조 증가라서, 판별함수에 로그를 씌워도 어느 클래스가 큰지의 순서는 그대로다. 그래서 argmax를 그대로 쓸 수 있다.",
  },
  {
    id: "pre-argmax-argmin",
    term: "argmax와 argmin",
    en: "argmax / argmin",
    area: "미분과 수식 표기",
    short: "가장 큰(작은) 값이 아니라, 그 값을 만드는 첨자를 돌려주는 연산.",
    why: "분류 결정규칙, 군집 배정, 최근접이웃이 전부 argmax나 argmin으로 쓰여 있다. 결과가 값이 아니라 인덱스라는 점이 핵심이다.",
    definition:
      "max는 최댓값 자체를 돌려주지만, argmax는 그 최댓값을 만드는 첨자를 돌려준다. 분류에서는 그 첨자가 곧 클래스 번호나 클러스터 번호가 된다.",
    formula: [{ expr: "y(x) = argmaxᵢ gᵢ(x)", note: "판별함수 값이 가장 큰 클래스 번호 i" }],
    example: {
      setup: "g₁ = 0.2, g₂ = 0.7, g₃ = 0.1",
      work: ["최댓값은 0.7", "그 값을 만드는 첨자는 2"],
      result: "max는 0.7, argmax는 2 — 분류 결과는 C₂",
    },
    usedIn: [
      { lecture: 1, where: "군집화 추론 — 소속 클러스터 결정" },
      { lecture: 2, where: "다중 클래스 결정규칙, 최근접이웃" },
      { lecture: 4, where: "데이터 그룹핑과 r_ni 정의" },
    ],
  },
  {
    id: "pre-linear-system",
    term: "연립방정식",
    en: "system of linear equations",
    area: "미분과 수식 표기",
    short: "미지수가 여러 개인 식을 함께 풀어 값을 정하는 것.",
    why: "선형회귀에서 편미분 결과 두 식을 연립해 w₁, w₀를 얻는다. 대입해서 하나씩 소거하는 익숙한 절차 그대로다.",
    definition:
      "여러 개의 식을 동시에 만족하는 미지수의 값을 구하는 문제. 하나의 식에서 한 미지수를 표현해 다른 식에 대입하는 방식으로 푼다.",
    usedIn: [{ lecture: 3, where: "w₀N + w₁Σxᵢ = Σyᵢ 와 w₀Σxᵢ + w₁Σxᵢ² = Σyᵢxᵢ 를 연립" }],
  },
  {
    id: "pre-numerical-optimization",
    term: "수치적 최적화",
    en: "numerical optimization",
    area: "미분과 수식 표기",
    short: "식을 한 번에 풀 수 없을 때 조금씩 값을 고쳐 가며 답에 접근하는 방법.",
    why: "선형회귀는 공식으로 바로 풀리지만 로지스틱 회귀는 그렇지 않다. 두 방법의 차이를 구분할 수 있어야 한다.",
    definition:
      "미분해서 0으로 놓은 식이 복잡한 비선형 함수여서 닫힌 형태로 풀리지 않을 때, 현재 값에서 목적함수가 좋아지는 방향으로 조금씩 이동하는 것을 반복해 최적값에 접근하는 방법.",
    usedIn: [{ lecture: 3, where: "로지스틱 회귀의 매개변수 m, b 추정" }],
  },
  {
    id: "pre-hyperplane",
    term: "직선·평면·초평면",
    en: "line / plane / hyperplane",
    area: "미분과 수식 표기",
    short: "공간을 둘로 가르는 평평한 경계. 2차원은 직선, 3차원은 평면, 그 이상은 초평면.",
    why: "결정경계와 다변량 회귀함수가 모두 이 형태다. 차원이 올라가도 성질은 같고 그릴 수만 없다는 점을 알면 낯설지 않다.",
    definition:
      "입력 변수들의 1차식으로 표현되는 평평한 경계. 2차원 공간에서는 직선, 3차원에서는 평면이며, 4차원 이상에서는 그릴 수 없어 초평면이라 부른다.",
    formula: [{ expr: "w₀ + w₁x₁ + w₂x₂ + … + w_n x_n = 0" }],
    usedIn: [
      { lecture: 2, where: "최소거리 분류기와 공통 공분산에서의 직선 결정경계" },
      { lecture: 3, where: "다변량 선형회귀가 찾는 초평면" },
    ],
  },
];

const additions = [
  { lecture: 5, entries: lecture5Prereqs, usages: lecture5PrereqUsages },
  { lecture: 6, entries: lecture6Prereqs, usages: lecture6PrereqUsages },
  { lecture: 7, entries: lecture7Prereqs, usages: lecture7PrereqUsages },
  { lecture: 8, entries: lecture8Prereqs, usages: lecture8PrereqUsages },
];

/**
 * 5강부터 추가된 선행 개념을 합친다. 같은 id가 여러 강의에서 추가되면
 * 먼저 나온 정의를 쓰고 쓰이는 자리만 합친다.
 */
function mergePrereqs(): PrereqEntry[] {
  const map = new Map<string, PrereqEntry>(
    basePrereqs.map((p) => [p.id, { ...p, usedIn: [...p.usedIn] }]),
  );
  for (const { entries } of additions) {
    for (const e of entries) {
      const existing = map.get(e.id);
      if (existing) existing.usedIn.push(...e.usedIn);
      else map.set(e.id, { ...e, usedIn: [...e.usedIn] });
    }
  }
  for (const { lecture, usages } of additions) {
    for (const u of usages) {
      map.get(u.id)?.usedIn.push({ lecture, where: u.where });
    }
  }
  return Array.from(map.values());
}

export const prereqs: PrereqEntry[] = mergePrereqs();

export const prereqById: Record<string, PrereqEntry> = Object.fromEntries(
  prereqs.map((p) => [p.id, p]),
);

export const prereqAreas: PrereqArea[] = [
  "벡터와 행렬",
  "확률과 통계",
  "미분과 수식 표기",
];

export function prereqsForLecture(lecture: number) {
  return prereqs.filter((p) => p.usedIn.some((u) => u.lecture === lecture));
}
