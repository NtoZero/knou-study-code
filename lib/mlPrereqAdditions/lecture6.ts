import type { PrereqEntry } from "@/lib/mlPrereqs";

/** 6강에서 새로 필요한 선행 개념 */
export const lecture6Prereqs: PrereqEntry[] = [
  {
    id: "pre-sampling-with-replacement",
    term: "복원 추출",
    en: "sampling with replacement",
    area: "확률과 통계",
    chapter: "3장 데이터 분포: 확률과 통계",
    short: "뽑은 것을 다시 넣고 또 뽑는 추출. 같은 데이터가 여러 번 뽑힐 수 있다.",
    why: "배깅의 부트스트랩은 전체 학습 데이터에서 Ñ개를 복원 추출한다. 중복을 허락한다는 점을 알아야 Ñ = N으로 두어도 학습기마다 데이터 집합이 달라지는 이유가 보인다.",
    definition:
      "모집단에서 하나를 뽑은 뒤 그것을 다시 넣고 다음 것을 뽑는 방식. 매번 N개 모두가 같은 확률 1/N로 뽑힐 수 있으므로, 같은 데이터가 여러 번 나오거나 한 번도 나오지 않을 수 있다. 뽑은 것을 다시 넣지 않으면 비복원 추출이다.",
    formula: [
      { expr: "P(특정 데이터가 한 번 추출에서 뽑힘) = 1/N" },
      {
        expr: "P(Ñ번 동안 한 번도 뽑히지 않음) = (1 − 1/N)^Ñ",
        note: "매 추출이 서로 독립이므로 곱으로 계산",
      },
    ],
    example: {
      setup: "데이터 {1, 2, 3, 4, 5}에서 5개를 복원 추출",
      work: [
        "뽑을 때마다 5개 모두가 다시 후보가 됨",
        "한 번의 결과 예: {2, 2, 4, 5, 5}",
        "1과 3은 한 번도 뽑히지 않았고 2와 5는 두 번씩 뽑힘",
      ],
      result: "크기는 원래와 같은 5지만 구성은 다른 데이터 집합",
    },
    usedIn: [
      { lecture: 6, where: "배깅 ② 단계 — X에서 Ñ개를 랜덤하게 선출해 Xᵢ를 만들 때 중복 선출 허락" },
    ],
    pitfall:
      "Ñ = N이면 원래 데이터와 똑같아진다고 생각하기 쉽다. 그것은 비복원 추출일 때의 이야기이고, 복원 추출에서는 매번 구성이 달라진다.",
  },
  {
    id: "pre-weighted-average",
    term: "가중평균",
    en: "weighted average",
    area: "확률과 통계",
    chapter: "3장 데이터 분포: 확률과 통계",
    short: "값마다 중요도(가중치)를 곱해 더한 평균. 가중치의 합은 1.",
    why: "앙상블의 결합은 거의 전부 평균의 변형이다. 단순평균(1/M), 가중평균(wᵢ), AdaBoost의 αᵢ 가중 결합, 전문가 혼합의 πᵢ(x) 가중합을 한 줄로 이어 보려면 가중평균의 모양을 알아야 한다.",
    definition:
      "값 h₁, …, h_M에 0 이상의 가중치 w₁, …, w_M을 곱해 더한 값. 가중치의 합이 1이면 가중평균이 되고, 모든 가중치가 1/M로 같으면 단순평균이 된다. 가중치가 큰 값일수록 결과에 더 많이 반영된다.",
    formula: [
      { expr: "Σᵢ wᵢ hᵢ,  wᵢ ≥ 0, Σᵢ wᵢ = 1" },
      { expr: "wᵢ = 1/M 이면 (1/M) Σᵢ hᵢ", note: "단순평균은 가중평균의 특별한 경우" },
    ],
    example: {
      setup: "세 학습기의 출력 9.6, 10.3, 13.0 과 가중치 0.45, 0.45, 0.1",
      work: [
        "단순평균 = (9.6 + 10.3 + 13.0)/3 ≈ 10.967",
        "가중평균 = 0.45×9.6 + 0.45×10.3 + 0.1×13.0 = 4.32 + 4.635 + 1.3",
      ],
      result: "가중평균 = 10.255 — 성능이 나쁜 13.0의 영향이 줄어듦",
    },
    usedIn: [
      { lecture: 6, where: "평균법의 단순평균(식 8-11)과 가중평균(식 8-12), 가중 보팅(식 8-14)" },
      { lecture: 6, where: "전문가 혼합의 가중합 Σπᵢ(x)hᵢ(x) (식 8-15)" },
    ],
    pitfall:
      "가중평균은 가중치의 합이 1이어야 한다. 합이 1이 아닌 가중치를 쓰려면 먼저 전체 합으로 나눠 맞춘다. AdaBoost의 αᵢ는 합이 1일 필요가 없는데, 최종 판별에 부호(sign)만 쓰기 때문이다.",
  },
];

/** 이미 있는 선행 개념이 6강에서 쓰이는 자리 */
export const lecture6PrereqUsages: { id: string; where: string }[] = [
  { id: "pre-expectation", where: "일반화 오차 E_gen = Eₓ[e(f(x), t)]와 식 8-7~8-10의 기대치 계산" },
  { id: "pre-pdf", where: "일반화 오차를 입력 x의 확률분포 p(x)에 대해 적분 (식 8-4)" },
  { id: "pre-covariance", where: "학습기 오차의 상관관계 Eₓ[eᵢ(x)eⱼ(x)] — 0이면 일반화 오차가 1/M로 감소" },
  { id: "pre-sigma", where: "보팅 (1/M)Σhᵢ(x), 가중 오분류율 εᵢ = Σⱼ wⱼ⁽ⁱ⁾ I(hᵢ(xⱼ) ≠ tⱼ), 정규화 값 Zᵢ" },
  { id: "pre-exp-log", where: "AdaBoost 중요도 αᵢ = ½ ln{(1−εᵢ)/εᵢ}와 가중치 수정 배수 exp{−αᵢtⱼhᵢ(xⱼ)}" },
  { id: "pre-argmax-argmin", where: "다수결 투표 f(x) = argmaxⱼ Σᵢ hᵢʲ(x)와 가중 보팅" },
  { id: "pre-dot-product", where: "선형 분류기 hᵢ(x) = sign(wᵢᵀx) (식 8-6)" },
  { id: "pre-hyperplane", where: "배깅으로 얻은 선형 분류기들의 직선 결정경계와 그 결합" },
  { id: "pre-sign-function", where: "hᵢ(x) = sign(wᵢᵀx)와 AdaBoost 최종 판별함수 f_M(x) = sign(Σαᵢhᵢ(x))" },
];
