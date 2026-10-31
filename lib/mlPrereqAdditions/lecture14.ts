import type { PrereqEntry } from "@/lib/mlPrereqs";

/** 14강에서 새로 필요한 선행 개념 */
export const lecture14Prereqs: PrereqEntry[] = [
  {
    id: "pre-log-base10",
    term: "상용로그",
    en: "common logarithm (base 10)",
    area: "미분과 수식 표기",
    short: "10을 몇 번 곱해야 그 수가 되는지. log₁₀ 100 = 2, log₁₀ 2 ≈ 0.301.",
    why: "TF-IDF 식의 IDF는 log(N/DF(t))다. 예제 표의 0.301과 0.602가 어디서 나왔는지 알려면 이 로그의 밑이 10이라는 것과, log₁₀2 ≈ 0.301을 알고 있어야 한다. 밑을 모르면 같은 식으로 다른 숫자를 얻게 된다.",
    definition:
      "log₁₀ x는 10^y = x를 만족하는 y. x = 1이면 0이고, x가 커질수록 커지지만 아주 천천히 커진다. 곱은 합으로 바뀌므로 log₁₀4 = log₁₀(2 × 2) = 2 × log₁₀2다. 그래서 log₁₀2 ≈ 0.301을 알면 log₁₀4 ≈ 0.602가 바로 나온다.",
    formula: [
      { expr: "log₁₀ 1 = 0,  log₁₀ 10 = 1" },
      { expr: "log₁₀ 2 ≈ 0.301,  log₁₀ 4 = 2 log₁₀ 2 ≈ 0.602" },
      { expr: "IDF(t) = log(N / DF(t))", note: "N/DF(t) = 1이면 0 — 모든 문서에 나오는 단어는 TF-IDF가 0이 된다" },
    ],
    example: {
      setup: "문서 N = 4개 중 ‘먹고’는 2개 문서, ‘토마토’는 1개 문서에 나온다",
      work: [
        "먹고: N/DF = 4/2 = 2 → log₁₀2 ≈ 0.301",
        "토마토: N/DF = 4/1 = 4 → log₁₀4 ≈ 0.602",
        "두 단어 모두 그 문서에서 한 번 나왔으니 TF = 1",
      ],
      result: "TF-IDF는 먹고 0.301, 토마토 0.602 — 한 문서에만 나오는 단어가 더 큰 값",
    },
    usedIn: [
      {
        lecture: 14,
        where: "TF-IDF(d, t) = TF(d, t) × log(N/DF(t)) — 예제 표의 0.301, 0.602 (식 13-1)",
      },
    ],
    pitfall:
      "자연로그(ln)로 계산하면 ln 2 ≈ 0.693이 나와 표와 맞지 않는다. 예제 표의 값은 상용로그 기준이다. 그리고 log는 N/DF가 1에 가까울수록 0에 가까워지므로, 여러 문서에 흔히 나오는 단어일수록 IDF가 작아진다.",
  },
  {
    id: "pre-prob-chain-rule",
    term: "결합확률을 조건부확률의 곱으로 나누기",
    en: "chain rule of probability",
    area: "확률과 통계",
    chapter: "3장 데이터 분포: 확률과 통계",
    short: "P(w₁, …, w_n)은 ‘앞 단어들이 주어졌을 때 다음 단어의 확률’을 차례로 곱한 것과 같다.",
    why: "언어 모델의 기존 구현 방법이 ∏ P(wᵢ | w₁, …, wᵢ₋₁)다. 단어 시퀀스 전체의 확률이 왜 이런 곱으로 바뀌는지, ∏ 기호가 무엇인지 모르면 식이 기호로만 보인다.",
    definition:
      "조건부확률의 정의 P(A | B) = P(A, B) / P(B)를 바꿔 쓰면 P(A, B) = P(B) × P(A | B)다. 이것을 단어마다 반복하면 n개 단어가 함께 나올 확률을 n개의 조건부확률의 곱으로 쓸 수 있다. ∏는 Σ의 곱셈 버전으로, 아래첨자 i = 1부터 n까지의 항을 모두 곱하라는 뜻이다.",
    formula: [
      { expr: "P(w₁, w₂) = P(w₁) × P(w₂ | w₁)" },
      {
        expr: "P(w₁, …, w_n) = ∏ᵢ₌₁ⁿ P(wᵢ | w₁, …, wᵢ₋₁)",
        note: "i = 1일 때의 항은 조건이 없는 P(w₁)",
      },
    ],
    example: {
      setup: "세 단어 시퀀스 ‘나는 버스를 탄다’",
      work: [
        "P(나는) × P(버스를 | 나는) × P(탄다 | 나는, 버스를)",
        "앞의 두 항은 ‘나는 버스를 태운다’와 같다",
        "마지막 항 P(탄다 | 나는, 버스를)와 P(태운다 | 나는, 버스를)만 다르다",
      ],
      result: "두 문장의 확률 차이는 마지막 조건부확률 하나에서 갈린다",
    },
    usedIn: [
      {
        lecture: 14,
        where: "언어 모델의 구현 방법 — 조건부확률 ∏ P(wᵢ | w₁, …, wᵢ₋₁)을 이용하는 방법",
      },
      {
        lecture: 14,
        where: "RNN 언어 모델 — 앞 단어들을 차례로 입력받아 바로 다음 단어를 출력하도록 학습",
      },
    ],
    pitfall:
      "∏를 Σ로 읽으면 안 된다. 더하는 것이 아니라 곱한다. 그리고 각 조건부확률은 1 이하이므로, 곱하는 항이 하나라도 아주 작으면(예: 의미상 어색한 마지막 단어) 문장 전체의 확률도 작아진다.",
  },
];

/** 이미 있는 선행 개념이 14강에서 쓰이는 자리 */
export const lecture14PrereqUsages: { id: string; where: string }[] = [
  {
    id: "pre-conditional-prob",
    where: "언어 모델의 P(wᵢ | w₁, …, wᵢ₋₁) — 앞 단어들이 주어졌을 때 다음 단어가 나올 확률",
  },
  {
    id: "pre-dot-product",
    where: "서로 다른 두 단어의 원핫 벡터는 내적이 항상 0 — 원핫인코딩이 단어 간 유사도를 반영하지 못하는 이유",
  },
  {
    id: "pre-matrix-mult",
    where: "Word2Vec — 원핫 벡터(1 × m)에 선형변환행렬 W(m × d)를 곱하면 W의 한 행이 골라지는 룩업 테이블",
  },
  {
    id: "pre-euclidean",
    where: "워드 임베딩 — 유사한 의미의 단어를 벡터 공간에서 가까운 위치에 표현",
  },
];
