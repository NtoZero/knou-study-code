import type { GlossaryTerm } from "@/lib/mlGlossaryTypes";

export const lecture2Terms: GlossaryTerm[] = [
  /* ---------- 분류의 개념 — 두 가지 접근법 ---------- */
  {
    id: "t-probabilistic-approach",
    term: "확률 기반 방법",
    en: "probabilistic approach",
    category: "개념",
    short: "조건부확률 P(Cₖ|x)를 추정하여 분류하는 접근법",
    definition:
      "결정경계를 얻기 위해 조건부확률 P(Cₖ|x)를 추정하고, 그 값이 가장 큰 클래스로 할당하는 접근법.",
    role: "클래스마다 확률모델을 세우고 그 모델로부터 결정경계를 유도한다. 대표적인 방법이 베이즈 분류기.",
    prereqs: ["pre-conditional-prob", "pre-random-variable"],
    related: ["t-data-driven-approach", "t-bayes-classifier", "t-posterior-probability"],
    lectures: [2],
    basis: "강의록 2강 분류 — 결정경계를 얻기 위한 두 가지 접근법",
    aliases: ["probabilistic", "확률기반"],
  },
  {
    id: "t-data-driven-approach",
    term: "데이터 기반 방법",
    en: "data-driven approach",
    category: "개념",
    short: "데이터 간의 관계를 바탕으로 분류하는 접근법",
    definition:
      "확률모델을 세우는 대신 데이터 간의 관계를 바탕으로 분류하는 접근법.",
    role: "새 데이터와 학습 데이터 사이의 거리를 직접 재서 클래스를 정한다. 대표적인 방법이 K-최근접이웃 분류기.",
    distinctions: [
      {
        from: "확률 기반 방법",
        how: "확률분포를 가정하고 추정하느냐(확률 기반), 아니면 가정 없이 데이터 사이의 거리를 직접 쓰느냐(데이터 기반)로 갈림.",
      },
    ],
    prereqs: ["pre-euclidean"],
    related: ["t-probabilistic-approach", "t-knn-classifier", "t-distance-function"],
    lectures: [2],
    basis: "강의록 2강 분류 — 결정경계를 얻기 위한 두 가지 접근법",
    aliases: ["data-driven", "데이터기반"],
  },
  {
    id: "t-decision-region",
    term: "결정영역",
    en: "decision region",
    category: "개념",
    short: "결정경계로 나뉜, 같은 클래스로 판정되는 입력 공간의 구역",
    definition:
      "결정경계를 기준으로 나뉜 입력 공간의 각 구역으로, 한 결정영역 안의 점은 모두 같은 클래스로 판정됨.",
    role: "결정경계가 선이라면 결정영역은 그 선이 갈라놓은 면이다. 분류 결과를 그림으로 읽을 때 실제로 보는 대상.",
    example:
      "1차원 이진 분류에서 p(x|C₁)p(C₁)가 더 큰 구간이 결정영역 1, p(x|C₂)p(C₂)가 더 큰 구간이 결정영역 2가 됨.",
    prereqs: ["pre-argmax-argmin"],
    related: ["t-decision-boundary", "t-bayes-decision-rule", "t-multiclass-discriminant"],
    lectures: [2],
    basis: "강의록 2강 베이즈 분류기: 결정경계",
    aliases: ["decision region"],
  },

  /* ---------- 베이즈 분류기 ---------- */
  {
    id: "t-bayes-classifier",
    term: "베이즈 분류기",
    en: "Bayes classifier",
    category: "알고리즘",
    short: "베이즈 정리로부터 유도된 결정경계를 이용한 분류",
    definition: "베이즈 정리로부터 유도된 결정경계를 이용한 분류.",
    role: "학습 단계에서 클래스별 확률밀도함수를 추정하고, 추론 단계에서 주어진 데이터에 대해 클래스별 판별함수 값이 가장 큰 클래스로 할당한다.",
    formula: [
      { expr: "g_i(x) = p(x|C_i)\\,p(C_i)", note: "클래스 C_i의 판별함수" },
      { expr: "y(x) = \\arg\\max_i g_i(x)", note: "판별함수 값이 가장 큰 클래스로 할당" },
    ],
    example:
      "분류 절차는 ① 학습 데이터 수집 ② 클래스별 분포함수 p(x|Cₖ) 추정 ③ 테스트 데이터 x_new 입력 ④ 클래스별 판별함수 값 계산 ⑤ 값이 가장 큰 클래스 k로 할당의 다섯 단계.",
    distinctions: [
      {
        from: "K-최근접이웃 분류기",
        how: "베이즈 분류기는 학습 때 추정한 평균과 표준편차만 있으면 되어 분류 과정에서 학습 데이터가 필요 없지만, K-NN은 새 데이터마다 학습 데이터 전체와 거리를 재야 해서 학습 데이터를 항상 저장해 두어야 함.",
      },
    ],
    prereqs: ["pre-bayes-rule", "pre-conditional-prob", "pre-pdf", "pre-argmax-argmin"],
    related: [
      "t-likelihood-ratio-test",
      "t-bayes-decision-rule",
      "t-gaussian-bayes-classifier",
      "t-knn-classifier",
    ],
    lectures: [2],
    basis: "강의록 2강 베이즈 분류기",
    emphasis:
      "‘사후확률이 가장 큰 클래스로 할당’이 원리이지만, 실제 계산은 분모 p(x)를 지운 p(x|Cᵢ)p(Cᵢ)의 비교로 이루어진다. 분모가 모든 클래스에 공통이라 비교 결과를 바꾸지 않기 때문.",
    aliases: ["Bayes", "베이즈분류기", "Bayesian classifier"],
  },
  {
    id: "t-conditional-probability",
    term: "조건부확률",
    en: "conditional probability",
    category: "수식·지표",
    short: "2강에서는 데이터 x가 주어졌을 때 클래스 Cₖ일 확률 P(Cₖ|x)",
    definition:
      "어떤 조건이 주어졌을 때의 확률로, 2강에서 확률 기반 방법이 추정 대상으로 삼는 것은 데이터 x가 주어졌을 때 그것이 클래스 Cₖ에서 나왔을 확률 P(Cₖ|x).",
    role: "확률 기반 분류기가 무엇을 계산하는지를 한 기호로 나타낸다. 이 값이 가장 큰 클래스가 분류 결과가 된다.",
    formula: [{ expr: "P(C_k|x)", note: "x가 주어졌을 때 클래스 C_k일 확률 — 사후확률" }],
    distinctions: [
      {
        from: "우도 p(x|Cₖ)",
        how: "둘 다 조건부 형태이지만 조건이 반대. P(Cₖ|x)는 데이터를 보고 클래스를 묻는 것이고, p(x|Cₖ)는 클래스를 알고 있을 때 그 데이터가 나올 확률밀도를 묻는 것.",
      },
    ],
    prereqs: ["pre-conditional-prob"],
    related: ["t-posterior-probability", "t-likelihood", "t-probabilistic-approach"],
    lectures: [2],
    basis: "강의록 2강 분류 — 확률 기반 방법",
    emphasis:
      "조건 안에 무엇이 들어 있는지를 매번 확인할 것. 세로줄 오른쪽이 ‘이미 아는 것’이다.",
    aliases: ["conditional probability", "조건부 확률"],
  },
  {
    id: "t-prior-probability",
    term: "사전확률",
    en: "prior probability",
    category: "수식·지표",
    short: "전체 데이터 집합에서 각 클래스가 차지하는 비율 p(Cₖ)",
    definition:
      "데이터를 보기 전에 각 클래스가 가질 확률로, 전체 데이터 집합에서 각 클래스가 차지하는 비율. 선험(prior)확률이라고도 함.",
    role: "판별함수 gᵢ(x) = p(x|Cᵢ)p(Cᵢ)에서 우도에 곱해지는 가중치 역할을 하며, 값이 달라지면 결정경계가 옮겨진다.",
    formula: [{ expr: "p(C_k)" }],
    example:
      "p(C₂) = α·p(C₁) (α > 1)이면 결정경계 조건이 p(x|C₁) = α·p(x|C₂)로 바뀌어, 사전확률이 큰 C₂의 결정영역이 넓어짐.",
    distinctions: [
      {
        from: "우도 p(x|Cₖ)",
        how: "사전확률은 데이터 x와 무관하게 정해진 클래스의 비율이고, 우도는 x가 어디에 있느냐에 따라 값이 달라지는 확률밀도.",
      },
      {
        from: "사후확률 P(Cₖ|x)",
        how: "사전확률은 x를 보기 전의 확률, 사후확률은 x를 보고 난 뒤 갱신된 확률.",
      },
    ],
    prereqs: ["pre-prior-posterior"],
    related: ["t-posterior-probability", "t-likelihood", "t-likelihood-ratio-test"],
    lectures: [2],
    basis: "강의록 2강 베이즈 분류기",
    emphasis:
      "사전확률이 큰 클래스일수록 결정영역이 넓어진다. 경계가 사전확률이 큰 쪽으로 끌려가는 것이 아니라, 그 반대쪽으로 밀려나 영역이 커진다는 방향을 헷갈리지 말 것.",
    aliases: ["prior", "선험확률", "prior probability"],
  },
  {
    id: "t-posterior-probability",
    term: "사후확률",
    en: "posterior probability",
    category: "수식·지표",
    short: "데이터 x를 관찰한 뒤 계산되는 클래스 확률 P(Cₖ|x)",
    definition:
      "주어진 데이터 x를 관찰한 뒤 베이즈 정리로 계산되는 각 클래스의 확률 P(Cₖ|x). 후험(posterior)확률이라고도 함.",
    role: "베이즈 분류기의 최종 판단 근거로, 사후확률이 가장 큰 클래스가 분류 결과가 된다.",
    formula: [
      { expr: "P(C_k|x) = \\dfrac{p(x|C_k)\\,p(C_k)}{p(x)}", note: "베이즈 정리" },
      { expr: "P(C_1|x) + P(C_2|x) = 1", note: "이진 분류에서 두 사후확률의 합" },
    ],
    prereqs: ["pre-bayes-rule", "pre-prior-posterior", "pre-conditional-prob"],
    related: ["t-prior-probability", "t-likelihood", "t-bayes-classifier"],
    lectures: [2],
    basis: "강의록 2강 베이즈 분류기 — 사전확률로부터 사후확률을 계산하는 식",
    aliases: ["posterior", "후험확률", "posterior probability"],
  },
  {
    id: "t-likelihood",
    term: "우도",
    en: "likelihood",
    category: "수식·지표",
    short: "각 클래스에서 x가 관찰될 확률밀도 p(x|Cₖ)",
    definition:
      "클래스 Cₖ가 주어졌을 때 데이터 x가 관찰될 확률밀도 p(x|Cₖ)로, 클래스별 확률밀도함수라고도 부름.",
    role: "베이즈 분류기가 학습 단계에서 추정하는 대상이 바로 이것이다. 클래스마다 하나씩 추정해 두고, 분류할 때 사전확률과 곱해 판별함수를 만든다.",
    formula: [{ expr: "p(x|C_k)" }],
    distinctions: [
      {
        from: "사전확률 p(Cₖ)",
        how: "우도는 x의 위치에 따라 달라지는 곡선이고, 사전확률은 x와 무관한 하나의 숫자.",
      },
      {
        from: "사후확률 P(Cₖ|x)",
        how: "우도는 클래스를 조건으로 두고 데이터를 보는 것이고, 사후확률은 데이터를 조건으로 두고 클래스를 보는 것. 베이즈 정리가 이 둘을 잇는다.",
      },
    ],
    prereqs: ["pre-likelihood", "pre-pdf", "pre-conditional-prob"],
    related: ["t-prior-probability", "t-posterior-probability", "t-likelihood-ratio"],
    lectures: [2],
    basis: "강의록 2강 베이즈 분류기",
    aliases: ["likelihood", "클래스별 확률밀도", "class-conditional density"],
  },
  {
    id: "t-likelihood-ratio",
    term: "우도비",
    en: "likelihood ratio",
    category: "수식·지표",
    short: "각 클래스에서 x가 관찰될 확률밀도의 비율",
    definition: "각 클래스에서 x가 관찰될 확률밀도의 비율 p(x|C₁)/p(x|C₂).",
    role: "두 클래스 중 어느 쪽이 이 데이터를 더 잘 설명하는지를 하나의 수로 요약한다. 이 값을 사전확률의 비율과 견주는 것이 우도비 검정.",
    formula: [{ expr: "\\dfrac{p(x|C_1)}{p(x|C_2)}" }],
    distinctions: [
      {
        from: "사전확률의 비율 p(C₂)/p(C₁)",
        how: "우도비는 데이터에서 오는 값이라 x에 따라 변하고, 사전확률의 비율은 전체 데이터 집합에서 각 클래스가 차지하는 비율이라 x와 무관하게 고정됨.",
      },
    ],
    prereqs: ["pre-likelihood", "pre-pdf"],
    related: ["t-likelihood", "t-likelihood-ratio-test", "t-prior-probability"],
    lectures: [2],
    basis: "강의록 2강 베이즈 분류기 — 우도비",
    emphasis:
      "우도비의 분자·분모 순서와 사전확률 비율의 분자·분모 순서가 서로 뒤집혀 있다. g_LRT에서 앞은 1이 위, 뒤는 2가 위다.",
    aliases: ["likelihood ratio", "LR"],
  },
  {
    id: "t-likelihood-ratio-test",
    term: "우도비 검정",
    en: "Likelihood Ratio Test, LRT",
    category: "수식·지표",
    short: "우도비와 사전확률 비율을 견주어 결정경계를 정하는 식",
    definition:
      "베이즈 정리로 세운 결정경계 식에서 분모 p(x)를 없애고 각 항을 p(x|C₂)p(C₁)로 나누어 얻는, 우도비와 사전확률 비율의 비교식.",
    role: "베이즈 분류기의 결정경계를 실제로 계산할 수 있는 꼴로 바꿔 준다. 이 식을 이용한 분류를 ‘우도비 분류’라고 부른다.",
    formula: [
      {
        expr: "g(x) = \\dfrac{p(x|C_1)p(C_1)}{p(x)} - \\dfrac{p(x|C_2)p(C_2)}{p(x)} = 0",
        note: "① 판별함수를 베이즈 정리로 전개",
      },
      { expr: "p(x|C_1)p(C_1) - p(x|C_2)p(C_2) = 0", note: "② 분모 제거" },
      {
        expr: "g_{LRT}(x) = \\dfrac{p(x|C_1)}{p(x|C_2)} - \\dfrac{p(C_2)}{p(C_1)} = 0",
        note: "③ 각 항을 p(x|C₂)p(C₁)로 나누어 정리",
      },
    ],
    prereqs: ["pre-likelihood", "pre-bayes-rule", "pre-conditional-prob"],
    related: ["t-likelihood-ratio", "t-bayes-classifier", "t-bayes-decision-rule"],
    lectures: [2],
    basis: "강의록 2강 베이즈 분류기 — 우도비 검정",
    emphasis:
      "나누는 항이 p(x|C₂)p(C₁)라는 점이 핵심. 이 조합으로 나누어야 앞 항은 우도만, 뒤 항은 사전확률만 남는다.",
    aliases: ["LRT", "Likelihood Ratio Test", "우도비검정", "우도비 분류"],
  },
  {
    id: "t-bayes-decision-rule",
    term: "베이즈 결정규칙",
    en: "Bayes decision rule",
    category: "수식·지표",
    short: "판별함수의 부호로 클래스를 정하는 규칙",
    definition:
      "판별함수 g_LRT(x) = p(x|C₁)p(C₁) − p(x|C₂)p(C₂)의 부호에 따라, 양수이면 x ∈ C₁로, 음수이면 x ∈ C₂로 할당하는 규칙.",
    formula: [
      { expr: "g_{LRT}(x) > 0 \\;\\Rightarrow\\; x \\in C_1" },
      { expr: "g_{LRT}(x) < 0 \\;\\Rightarrow\\; x \\in C_2" },
      { expr: "y(x) = 1 \\text{ if } g_{LRT}(x) > 0,\\; -1 \\text{ otherwise}" },
      {
        expr: "y(x) = 1 \\text{ if } p(x|C_1) - p(x|C_2) > 0,\\; -1 \\text{ otherwise}",
        note: "p(C₁) = p(C₂)인 경우 — 사전확률 항이 상쇄됨",
      },
    ],
    prereqs: ["pre-argmax-argmin"],
    related: ["t-likelihood-ratio-test", "t-decision-region", "t-multiclass-discriminant"],
    lectures: [2],
    basis: "강의록 2강 베이즈 분류기 — 결정규칙",
    emphasis:
      "사전확률이 같을 때만 두 확률밀도의 크기 비교로 줄어든다. 사전확률이 다르면 반드시 p(Cₖ)를 곱한 채로 비교할 것.",
    aliases: ["decision rule", "Bayes decision rule"],
  },
  {
    id: "t-bayes-discriminant-function",
    term: "베이즈 분류기의 판별함수",
    en: "discriminant function of the Bayes classifier",
    category: "수식·지표",
    short: "클래스별 우도와 사전확률의 곱 gᵢ(x) = p(x|Cᵢ)p(Cᵢ)",
    definition:
      "베이즈 분류기에서 각 클래스마다 계산하는 값으로, 이진 분류에서는 두 사후확률의 차 g(x) = P(C₁|x) − P(C₂|x)로, 다중 클래스에서는 gᵢ(x) = p(x|Cᵢ)p(Cᵢ)로 쓰임.",
    role: "이 값의 크기 비교만으로 분류가 끝난다. 확률 그 자체가 아니어도 순서만 같으면 되기 때문에 분모 p(x)를 지울 수 있다.",
    formula: [
      { expr: "g(x) = P(C_1|x) - P(C_2|x)", note: "이진 분류" },
      { expr: "g_i(x) = p(x|C_i)\\,p(C_i)", note: "다중 클래스" },
    ],
    prereqs: ["pre-pdf", "pre-argmax-argmin"],
    related: ["t-decision-function", "t-bayes-decision-rule", "t-multiclass-discriminant"],
    lectures: [2],
    basis: "강의록 2강 베이즈 분류기 — 판별함수",
    aliases: ["discriminant function", "판별함수"],
  },
  {
    id: "t-multiclass-discriminant",
    term: "다중 클래스 판별함수",
    en: "multi-class discriminant function",
    category: "수식·지표",
    short: "클래스마다 gᵢ(x)를 두고 가장 큰 것을 고르는 방식",
    definition:
      "클래스가 셋 이상일 때 각 클래스 Cᵢ에 대해 판별함수 gᵢ(x) = p(x|Cᵢ)p(Cᵢ)를 두고, 그 값이 가장 큰 클래스로 레이블을 정하는 방식.",
    formula: [
      { expr: "g_i(x) = p(x|C_i)\\,p(C_i)" },
      { expr: "y(x) = \\arg\\max_i g_i(x)" },
    ],
    example:
      "클래스가 3개이고 사전확률이 모두 같으면, 이웃한 확률밀도 곡선끼리 만나는 두 지점이 결정경계가 되고 입력 공간은 결정영역 1·2·3으로 나뉨.",
    distinctions: [
      {
        from: "이진 분류의 판별함수",
        how: "이진 분류는 두 값의 차 하나의 부호로 끝나지만, 다중 클래스는 차를 쓸 수 없어 여러 값 중 최대를 고르는 argmax 형태가 됨.",
      },
    ],
    prereqs: ["pre-argmax-argmin", "pre-pdf"],
    related: ["t-bayes-discriminant-function", "t-decision-region", "t-bayes-classifier"],
    lectures: [2],
    basis: "강의록 2강 베이즈 분류기: 다중 클래스 문제",
    aliases: ["multiclass", "다중클래스"],
  },

  /* ---------- 가우시안 모델로 구현 ---------- */
  {
    id: "t-gaussian-pdf",
    term: "가우시안 확률밀도함수",
    en: "Gaussian probability density function",
    category: "수식·지표",
    short: "평균 벡터와 공분산행렬로 정해지는 종 모양의 확률밀도",
    definition:
      "평균 벡터 μᵢ와 공분산행렬 Σᵢ로 정해지는 확률밀도함수로, 베이즈 분류기에서 클래스별 밀도함수 p(x|Cᵢ)를 모형화할 때 쓰임.",
    role: "우도를 함수 꼴로 정해 주어, 평균과 공분산만 추정하면 분류기가 완성되게 한다.",
    formula: [
      {
        expr:
          "p(x|C_i) = G(x; \\mu_i, \\Sigma_i) = \\dfrac{1}{\\sqrt{(2\\pi)^n |\\Sigma_i|}} \\exp\\!\\left(-\\tfrac{1}{2}(x-\\mu_i)^T \\Sigma_i^{-1} (x-\\mu_i)\\right)",
      },
      {
        expr:
          "l_i(x) = \\ln g_i(x) = -\\tfrac{1}{2}(x-\\mu_i)^T \\Sigma_i^{-1}(x-\\mu_i) - \\tfrac{1}{2}\\ln|\\Sigma_i| + const",
        note: "로그를 취한 판별함수 — 사전확률이 모두 동일하다고 가정",
      },
      {
        expr:
          "y(x) = \\arg\\min_i \\left[(x-\\mu_i)^T \\Sigma_i^{-1}(x-\\mu_i) + \\ln|\\Sigma_i|\\right]",
        note: "앞의 −½을 떼면서 최대 찾기가 최소 찾기로 바뀜. 로그 자체는 순서를 바꾸지 않는다",
      },
    ],
    prereqs: [
      "pre-gaussian",
      "pre-pdf",
      "pre-covariance-matrix",
      "pre-quadratic-form",
      "pre-inverse",
      "pre-determinant",
      "pre-exp-log",
    ],
    related: [
      "t-class-covariance-matrix",
      "t-gaussian-bayes-classifier",
      "t-mahalanobis-distance",
    ],
    lectures: [2],
    basis: "강의록 2강 베이즈 분류기: 구현",
    emphasis:
      "로그는 단조 증가 함수라 어느 클래스가 큰지의 순서를 바꾸지 않는다. 강의록도 로그를 씌운 뒤 y(x) = argmaxᵢ lᵢ(x)를 그대로 쓴다. argmin으로 바뀌는 것은 그 다음 단계에서 앞의 −½을 떼기 때문이며, 이후 세 가지 경우의 결정규칙이 모두 argmin인 이유가 여기에 있다.",
    aliases: ["Gaussian", "정규분포", "normal distribution", "가우시안 분포"],
  },
  {
    id: "t-class-covariance-matrix",
    term: "공분산행렬",
    en: "covariance matrix",
    category: "수식·지표",
    short: "클래스별 데이터가 퍼진 모양을 담은 행렬 Σᵢ",
    definition:
      "클래스별 데이터가 어느 방향으로 얼마나 퍼져 있는지를 담은 행렬로, 가우시안 베이즈 분류기에서는 이 행렬의 형태에 따라 판별함수의 형태가 달라짐.",
    role: "분류기의 난이도를 결정한다. 형태가 단순할수록 추정할 값이 줄고 결정경계도 단순해진다.",
    example:
      "형태에 따라 세 경우로 나뉨 — 클래스 공통 단위 공분산행렬 Σᵢ = σ²I, 클래스 공통 공분산행렬 Σᵢ = Σ, 일반적인 공분산행렬 Σᵢ ≠ Σⱼ.",
    prereqs: ["pre-covariance-matrix", "pre-covariance", "pre-variance"],
    related: [
      "t-common-unit-covariance",
      "t-common-covariance",
      "t-general-covariance",
      "t-gaussian-pdf",
    ],
    lectures: [2],
    basis: "강의록 2강 베이즈 분류기: 구현 — 각 클래스의 공분산행렬 Σᵢ의 형태에 따른 판별함수",
    aliases: ["covariance matrix", "Sigma", "공분산 행렬"],
  },
  {
    id: "t-common-unit-covariance",
    term: "클래스 공통 단위 공분산행렬",
    en: "common identity covariance matrix",
    category: "개념",
    short: "모든 클래스의 공분산이 같고 단위행렬의 상수배인 경우 Σᵢ = σ²I",
    definition:
      "모든 클래스의 공분산이 동일하며, 단위행렬의 상수배인 행렬을 가지는 경우.",
    role: "판별함수에서 n과 σ가 모든 클래스에 공통이라 비교에서 사라지고, 결정규칙이 평균까지의 거리 비교만 남아 최소거리 분류기가 된다.",
    formula: [
      { expr: "\\Sigma_i = \\sigma^2 I \\quad (i = 1, \\cdots, M)" },
      {
        expr: "l_i(x) = -\\dfrac{1}{2\\sigma^2}(x-\\mu_i)^T(x-\\mu_i) - n\\ln\\sigma + const",
      },
      { expr: "y(x) = \\arg\\min_i (x-\\mu_i)^T(x-\\mu_i)" },
    ],
    prereqs: ["pre-identity", "pre-euclidean", "pre-covariance-matrix", "pre-quadratic-form"],
    related: ["t-minimum-distance-classifier", "t-common-covariance", "t-general-covariance"],
    lectures: [2],
    basis: "강의록 2강 베이즈 분류기의 구현 ① 클래스 공통 단위 공분산행렬",
    emphasis:
      "공분산이 단위행렬의 상수배로 모두 같을 때만 최소거리 분류기가 된다. ‘모두 같다’와 ‘단위행렬의 상수배’ 두 조건이 함께 필요하다. 시험에서는 둘 중 하나만 만족시킨 보기를 섞어 낸다.",
    aliases: ["identity covariance", "단위 공분산", "sigma squared I"],
  },
  {
    id: "t-common-covariance",
    term: "클래스 공통 공분산행렬",
    en: "common covariance matrix",
    category: "개념",
    short: "모든 클래스가 같은 공분산을 갖되 그 형태는 일반적인 경우 Σᵢ = Σ",
    definition:
      "모든 클래스가 동일한 공분산을 갖지만, 그 형태가 일반적인 행렬이 되는 경우로 데이터 분포가 타원형이 됨.",
    role: "ln|Σᵢ| 항이 모든 클래스에 공통이라 비교에서 사라지고, 결정규칙이 마할라노비스 거리 비교로 줄어든다.",
    formula: [
      { expr: "\\Sigma_i = \\Sigma" },
      { expr: "l_i(x) = -\\dfrac{1}{2}(x-\\mu_i)^T \\Sigma_i^{-1}(x-\\mu_i)" },
      { expr: "y(x) = \\arg\\min_i (x-\\mu_i)^T \\Sigma_i^{-1}(x-\\mu_i)" },
    ],
    distinctions: [
      {
        from: "일반적인 공분산행렬 Σᵢ ≠ Σⱼ",
        how: "공분산이 같으면 ln|Σᵢ| 항이 지워지고 결정경계가 직선으로 남지만, 다르면 그 항이 남고 이차항도 상쇄되지 않아 결정경계가 곡선이 됨.",
      },
    ],
    prereqs: ["pre-covariance-matrix", "pre-inverse", "pre-quadratic-form", "pre-determinant"],
    related: [
      "t-mahalanobis-distance",
      "t-normalized-euclidean-distance",
      "t-common-unit-covariance",
      "t-general-covariance",
    ],
    lectures: [2],
    basis: "강의록 2강 베이즈 분류기의 구현 ② 클래스 공통 공분산행렬",
    emphasis:
      "데이터 분포가 타원형으로 기울어져 있어도 결정경계는 여전히 직선이다. 타원이 기울었다는 이유로 경계도 휜다고 답하지 말 것.",
    aliases: ["shared covariance", "공통 공분산"],
  },
  {
    id: "t-general-covariance",
    term: "일반적인 공분산행렬",
    en: "general covariance matrix",
    category: "개념",
    short: "클래스마다 공분산이 다른 경우 Σᵢ ≠ Σⱼ",
    definition:
      "각 클래스의 공분산이 서로 다른 일반적인 형태를 가지는 경우로, 클래스마다 서로 다른 타원형 분포가 됨.",
    role: "ln|Σᵢ| 항이 클래스마다 달라 판별함수에 그대로 남고, 결정경계가 곡선이 된다.",
    formula: [
      { expr: "\\Sigma_i \\neq \\Sigma_j" },
      {
        expr:
          "y(x) = \\arg\\min_i \\left[(x-\\mu_i)^T \\Sigma_i^{-1}(x-\\mu_i) + \\ln|\\Sigma_i|\\right]",
      },
    ],
    prereqs: ["pre-covariance-matrix", "pre-inverse", "pre-determinant", "pre-quadratic-form"],
    related: ["t-common-covariance", "t-mahalanobis-distance", "t-class-covariance-matrix"],
    lectures: [2],
    basis: "강의록 2강 베이즈 분류기의 구현 ③ 일반적인 공분산행렬",
    emphasis:
      "결정경계가 휘는 원인은 Σ₁⁻¹과 Σ₂⁻¹이 달라 이차항이 상쇄되지 않기 때문이다. ln|Σᵢ| 항은 경계를 한쪽으로 밀어 행렬식이 큰 클래스의 결정영역을 좁힐 뿐, 경계를 휘게 하는 항이 아니다.",
    aliases: ["general covariance", "서로 다른 공분산"],
  },
  {
    id: "t-minimum-distance-classifier",
    term: "최소거리 분류기",
    en: "minimum distance classifier",
    category: "알고리즘",
    short: "각 클래스 평균까지의 거리가 가장 짧은 클래스로 할당",
    definition:
      "공분산행렬이 모두 단위행렬의 같은 상수배일 때 판별함수가 평균까지의 거리 비교로 줄어드는 분류기로, x와 평균 μₖ와의 거리를 비교하여 가까운 쪽의 클래스로 할당함.",
    formula: [{ expr: "y(x) = \\arg\\min_i (x-\\mu_i)^T (x-\\mu_i)" }],
    example:
      "두 클래스만 있고 사전확률도 같다면 결정경계는 두 평균을 잇는 선분의 수직이등분선이 됨.",
    distinctions: [
      {
        from: "마할라노비스 거리를 쓰는 분류기",
        how: "최소거리 분류기는 모든 방향을 똑같이 재는 유클리디안 거리를 쓰고, 마할라노비스 거리는 공분산 Σ로 방향마다 다른 자를 댐.",
      },
    ],
    prereqs: ["pre-euclidean", "pre-identity", "pre-argmax-argmin", "pre-mean-vector"],
    related: ["t-common-unit-covariance", "t-mahalanobis-distance", "t-gaussian-bayes-classifier"],
    lectures: [2],
    basis: "강의록 2강 베이즈 분류기의 구현 ① 클래스 공통 단위 공분산행렬",
    emphasis:
      "σ를 아무리 바꿔도 모든 클래스에 공통이므로 결정경계는 움직이지 않는다. 퍼진 정도가 달라지면 경계도 움직인다고 착각하기 쉬운 지점.",
    aliases: ["minimum distance classifier", "최소 거리 분류기"],
  },
  {
    id: "t-mahalanobis-distance",
    term: "마할라노비스 거리",
    en: "Mahalanobis distance",
    category: "수식·지표",
    short: "공분산의 역행렬을 끼워 재는 거리",
    definition:
      "공분산행렬의 역행렬을 끼워 넣어 계산하는 거리 (x − μ)ᵀΣ⁻¹(x − μ)로, 클래스 공통 공분산행렬을 가정한 베이즈 분류기의 결정규칙에 나타남.",
    role: "데이터가 많이 퍼진 방향에서는 같은 거리도 가깝게, 적게 퍼진 방향에서는 멀게 재어 분포의 모양을 반영한다.",
    formula: [{ expr: "(x-\\mu_i)^T \\Sigma_i^{-1} (x-\\mu_i)" }],
    distinctions: [
      {
        from: "유클리디안 거리",
        how: "Σ가 단위행렬이면 마할라노비스 거리는 유클리디안 제곱거리와 정확히 같아진다. 즉 유클리디안 거리는 마할라노비스 거리의 특수한 경우.",
      },
      {
        from: "정규화된 유클리디안 거리",
        how: "Σ가 대각행렬이기만 하면 정규화된 유클리디안 거리가 되고, 대각 밖 성분까지 있는 일반적인 Σ여야 마할라노비스 거리의 온전한 형태가 됨.",
      },
    ],
    prereqs: ["pre-quadratic-form", "pre-inverse", "pre-covariance-matrix", "pre-euclidean"],
    related: [
      "t-common-covariance",
      "t-normalized-euclidean-distance",
      "t-minimum-distance-classifier",
      "t-distance-function",
    ],
    lectures: [2],
    basis: "강의록 2강 베이즈 분류기의 구현 ② 클래스 공통 공분산행렬",
    aliases: ["Mahalanobis", "마할라노비스"],
  },
  {
    id: "t-normalized-euclidean-distance",
    term: "정규화된 유클리디안 거리",
    en: "normalized Euclidean distance",
    category: "수식·지표",
    short: "요소별로 표준편차로 나눈 뒤 재는 유클리디안 거리",
    definition:
      "요소별로 표준편차 값으로 나누어 준 후 유클리디안 거리를 계산하는 것으로, 공분산 Σ가 대각행렬일 때의 마할라노비스 거리.",
    role: "축마다 단위나 퍼진 정도가 다를 때, 한 축이 거리를 독차지하는 것을 막는다.",
    distinctions: [
      {
        from: "유클리디안 거리",
        how: "각 축을 표준편차로 나누는 단계가 있느냐 없느냐로 갈림. 모든 축의 표준편차가 같으면 둘은 상수배 차이만 남음.",
      },
    ],
    prereqs: ["pre-euclidean", "pre-diagonal", "pre-variance", "pre-covariance-matrix"],
    related: ["t-mahalanobis-distance", "t-common-covariance", "t-distance-function"],
    lectures: [2],
    basis: "강의록 2강 베이즈 분류기의 구현 ② 클래스 공통 공분산행렬",
    emphasis:
      "‘대각행렬’이 조건이다. 단위행렬이 조건이라고 답하면 그것은 최소거리 분류기 쪽 이야기가 된다.",
    aliases: ["normalized Euclidean distance", "정규화 유클리디안"],
  },
  {
    id: "t-gaussian-bayes-classifier",
    term: "가우시안 베이즈 분류기",
    en: "Gaussian Bayes classifier",
    category: "알고리즘",
    short: "클래스별 밀도를 가우시안으로 가정한 베이즈 분류기",
    definition:
      "각 클래스에 대한 확률분포함수를 가우시안으로 미리 가정하고 추정하는 베이즈 분류기.",
    role: "학습 데이터를 통해 평균과 표준편차만 추정하여 활용하므로, 분류 과정에서는 학습 데이터가 필요 없다.",
    example:
      "공분산행렬 Σₖ가 모두 단위행렬로 동일하면 최소거리 분류기가 되고, 모두 동일하다고 가정하면 하나의 Σ만 추정하여 마할라노비스 거리로 계산함. 일반적으로 공분산행렬이 동일하다고 볼 수는 없으나 계산이 간단하여 널리 사용됨.",
    distinctions: [
      {
        from: "K-최근접이웃 분류기",
        how: "가우시안 베이즈는 분포 모델을 미리 가정하고 파라미터만 남겨 학습 데이터를 버릴 수 있지만, K-NN은 모델을 가정하지 않는 대신 학습 데이터를 항상 저장해야 하고 계산량과 메모리 비용이 커짐.",
      },
    ],
    prereqs: ["pre-gaussian", "pre-mean-vector", "pre-covariance-matrix", "pre-mle"],
    related: ["t-bayes-classifier", "t-gaussian-pdf", "t-knn-classifier"],
    lectures: [2],
    basis: "강의록 2강 가우시안 베이즈 분류기 vs K-최근접이웃 분류기",
    emphasis:
      "데이터 분포가 복잡한 비선형 구조를 가지면, 클래스마다 가우시안 하나만 씌우는 가정 때문에 결정경계가 데이터를 따라가지 못한다. 이때는 K-NN 쪽이 더 나은 경계를 만든다.",
    aliases: ["Gaussian Bayes", "가우시안베이즈"],
  },

  /* ---------- K-최근접이웃 분류기 ---------- */
  {
    id: "t-nearest-neighbor-classifier",
    term: "최근접이웃 분류기",
    en: "nearest neighbor classifier",
    category: "알고리즘",
    short: "가장 가까운 학습 데이터 한 개의 클래스로 할당",
    definition:
      "클래스와 상관없이 모든 데이터 중에서 가장 작은 거리값을 갖는 데이터의 클래스로 할당하는 분류기로, K-최근접이웃 분류기에서 K = 1인 경우.",
    formula: [
      { expr: "x_{min} = \\arg\\min_{x_i \\in X} d(x, x_i)" },
      { expr: "y(x) = y(x_{min})" },
    ],
    example:
      "수행 단계는 ① 주어진 데이터 x와 모든 학습 데이터와의 거리를 계산 ② 거리가 가장 가까운 데이터를 찾아 x_min으로 둠 ③ x_min이 속하는 클래스에 할당의 세 단계.",
    distinctions: [
      {
        from: "K-최근접이웃 분류기",
        how: "거리를 계산하는 학습 데이터는 양쪽 모두 전체이며, 거리 계산이 끝난 뒤 클래스 결정에 참여하는 데이터 개수가 1개냐 K개냐로 갈림.",
      },
    ],
    prereqs: ["pre-euclidean", "pre-argmax-argmin"],
    related: ["t-knn-classifier", "t-knn-overfitting", "t-distance-function"],
    lectures: [2],
    basis: "강의록 2강 최근접이웃 분류기",
    emphasis:
      "‘거리 계산에 참여하는 개수’와 ‘클래스 결정에 참여하는 개수’를 구분할 것. 최근접이웃도 모든 학습 데이터와 거리를 계산하며, 달라지는 것은 그 다음 단계다.",
    aliases: ["NN", "nearest neighbor", "1-NN", "최근접 이웃"],
  },
  {
    id: "t-knn-classifier",
    term: "K-최근접이웃 분류기",
    en: "K-Nearest Neighbor classifier",
    category: "알고리즘",
    short: "가까운 K개 이웃의 최빈 클래스로 할당",
    definition:
      "주어진 데이터와 모든 학습 데이터와의 거리를 계산한 후, 거리가 가장 가까운 K개의 데이터에 대해 가장 많은 빈도수를 차지하는 클래스로 할당하는 분류기.",
    role: "확률분포 모델을 미리 가정하지 않고 데이터 집합을 이용하여 추정하는 데이터 기반 방법의 대표.",
    formula: [{ expr: "y(x) = \\arg\\max \\{K_1(x), K_2(x)\\}" }],
    example:
      "K = 5일 때 후보집합 안에 C₁이 2개(K₁ = 2), C₂가 3개(K₂ = 3)이면 빈도수가 더 큰 C₂로 할당됨.",
    distinctions: [
      {
        from: "가우시안 베이즈 분류기",
        how: "K-NN은 새 데이터가 주어질 때마다 학습 데이터 전체와의 거리 계산이 필요해 항상 학습 데이터를 저장해 두어야 하고 계산량과 메모리 비용이 커짐. 베이즈 쪽은 추정한 파라미터만 남기면 됨.",
      },
    ],
    prereqs: ["pre-euclidean", "pre-argmax-argmin"],
    related: [
      "t-nearest-neighbor-classifier",
      "t-candidate-set",
      "t-knn-k-selection",
      "t-distance-function",
      "t-gaussian-bayes-classifier",
    ],
    lectures: [2],
    basis: "강의록 2강 K-최근접이웃 분류기",
    emphasis:
      "‘분류 과정에서도 모든 학습 데이터가 사용된다’가 K-NN의 핵심 성질. 학습이라 부를 단계가 따로 없고 비용이 추론 시점으로 미뤄진다.",
    aliases: ["K-NN", "KNN", "K-Nearest Neighbor", "K최근접이웃"],
  },
  {
    id: "t-candidate-set",
    term: "후보집합",
    en: "candidate set",
    category: "개념",
    short: "거리가 가까운 순서대로 고른 K개의 학습 데이터",
    definition:
      "거리가 가장 가까운 것부터 순서대로 K개의 데이터를 찾아 만든 집합 N(x) = {x₁, x₂, ⋯, x_K}.",
    role: "투표에 참여할 이웃을 확정하는 단계로, 이 집합 안의 레이블 빈도가 곧 분류 결과가 된다.",
    formula: [{ expr: "N(x) = \\{x_1, x_2, \\cdots, x_K\\}" }],
    example:
      "수행 단계는 ① 모든 학습 데이터와의 거리 계산 ② 가까운 순서로 K개를 골라 후보집합 구성 ③ 각 원소의 레이블값 확인 ④ 가장 많은 빈도수를 차지하는 클래스로 할당.",
    prereqs: ["pre-argmax-argmin"],
    related: ["t-knn-classifier", "t-knn-k-selection", "t-nearest-neighbor-classifier"],
    lectures: [2],
    basis: "강의록 2강 K-최근접이웃 분류기 — 수행 단계",
    aliases: ["candidate set", "이웃 집합", "N(x)"],
  },
  {
    id: "t-knn-k-selection",
    term: "K값 선택",
    en: "choice of K",
    category: "개념",
    short: "이웃을 몇 개까지 볼지 정하는 설계 고려사항",
    definition:
      "K-최근접이웃 분류기의 설계 고려사항 중 하나로, 클래스 결정에 참여시킬 이웃의 개수 K를 정하는 문제.",
    role: "K가 결정경계의 복잡도를 좌우한다. 작으면 데이터를 지나치게 따라가고, 크면 지역 정보를 잃는다.",
    example:
      "K = 1이면 바로 이웃한 데이터에만 의존하여 노이즈에 민감하고 과다적합이 발생하며, K ≫ 1이면 주어진 데이터 주변 영역이 아닌 전체 데이터 영역에서 각 클래스가 차지하는 비율(사전확률)에 의존하게 됨.",
    prereqs: ["pre-prior-posterior"],
    related: ["t-knn-classifier", "t-knn-overfitting", "t-candidate-set", "t-kmeans-k-selection"],
    lectures: [2],
    basis: "강의록 2강 K-최근접이웃 분류기의 설계 고려사항 ⑴ 적절한 K값의 결정",
    emphasis:
      "K는 주어진 문제(학습 데이터)에 의존적이며 정해진 정답이 없다. 실용적으로는 학습 데이터에 대한 분류를 통해 가장 좋은 성능을 주는 값을 고르는 방법도 쓴다.",
    aliases: ["K value", "K 결정", "choice of K"],
  },
  {
    id: "t-knn-overfitting",
    term: "과다적합",
    en: "overfitting",
    category: "개념",
    short: "학습 데이터에 지나치게 맞춰 새 데이터에서 오차가 커지는 현상",
    definition:
      "학습 데이터에 지나치게 맞춘 복잡한 결정경계가 만들어져, 테스트 데이터에서는 오히려 오차가 커지는 현상.",
    role: "K를 1보다 크게 잡아 이웃 여러 개의 다수결로 결정하는 K-최근접이웃 분류기가 나온 이유가 된다.",
    example:
      "같은 데이터에서 베이즈 분류기의 테스트 오차가 6.5%인 반면, 최근접이웃 분류기는 학습 데이터에 맞춘 복잡한 경계 탓에 13.5%로 커짐.",
    prereqs: [],
    related: ["t-nearest-neighbor-classifier", "t-knn-k-selection", "t-knn-classifier"],
    lectures: [2],
    basis: "강의록 2강 최근접이웃 분류기의 문제점",
    emphasis:
      "학습 데이터에서의 오차가 작은 것과 좋은 분류기인 것은 다르다. 최근접이웃은 학습 데이터를 거의 다 맞히지만 테스트 오차가 더 크다.",
    aliases: ["overfitting", "과적합", "과대적합"],
  },
  {
    id: "t-distance-function",
    term: "거리 함수",
    en: "distance function",
    category: "개념",
    short: "주어진 데이터와 학습 데이터 간의 거리 계산 방법",
    definition:
      "K-최근접이웃 분류기의 설계 고려사항 중 하나로, 주어진 데이터와 학습 데이터 간의 거리를 어떻게 계산할지 정하는 방법.",
    role: "어떤 함수를 쓰느냐에 따라 후보집합에 들어오는 이웃이 달라지고, 따라서 분류 결과도 달라진다.",
    example:
      "2차 노름(유클리디안 거리), 1차 노름, p차 노름, 내적, 코사인 거리, 정규화된 유클리디안 거리, 마할라노비스 거리가 쓰임.",
    prereqs: ["pre-norm", "pre-euclidean"],
    related: [
      "t-l2-norm",
      "t-l1-norm",
      "t-lp-norm",
      "t-cosine-distance",
      "t-inner-product-distance",
      "t-normalized-euclidean-distance",
      "t-mahalanobis-distance",
    ],
    lectures: [2],
    basis: "강의록 2강 K-최근접이웃 분류기의 설계 고려사항 ⑵ 거리 함수",
    aliases: ["distance function", "거리함수", "metric"],
  },
  {
    id: "t-l2-norm",
    term: "2차 노름",
    en: "L2 norm",
    category: "수식·지표",
    short: "성분별 차이를 제곱해 더한 뒤 제곱근을 취한 거리",
    definition:
      "두 벡터의 성분별 차이를 제곱하여 더한 뒤 제곱근을 취하는 거리로, 유클리디안 거리라고 부름.",
    formula: [{ expr: "d(x, x_i) = \\sqrt{\\sum_j (x_j - x_{ij})^2}" }],
    prereqs: ["pre-norm", "pre-euclidean"],
    related: ["t-l1-norm", "t-lp-norm", "t-distance-function", "t-normalized-euclidean-distance"],
    lectures: [2],
    basis: "강의록 2강 설계 고려사항 ⑵ 거리 함수",
    aliases: ["L2", "L2 norm", "유클리디안 거리", "Euclidean distance", "이차 노름"],
  },
  {
    id: "t-l1-norm",
    term: "1차 노름",
    en: "L1 norm, Manhattan distance",
    category: "수식·지표",
    short: "성분별 차이의 절댓값을 모두 더한 거리 — 맨해튼 거리",
    definition:
      "두 벡터의 성분별 차이의 절댓값을 모두 더한 거리로, 맨해튼 거리(Manhattan distance)라고 부름.",
    role: "축 방향으로만 이동했을 때의 이동 거리 합에 해당한다.",
    formula: [{ expr: "d(x, x_i) = \\sum_j |x_j - x_{ij}|" }],
    distinctions: [
      {
        from: "2차 노름(유클리디안 거리)",
        how: "차이를 절댓값으로 더하느냐(1차), 제곱해 더한 뒤 제곱근을 취하느냐(2차)로 갈림. 같은 두 점이라도 1차 노름 쪽 값이 더 크거나 같다.",
      },
    ],
    prereqs: ["pre-norm"],
    related: ["t-l2-norm", "t-lp-norm", "t-distance-function"],
    lectures: [2],
    basis: "강의록 2강 설계 고려사항 ⑵ 거리 함수",
    emphasis:
      "‘1차 노름을 가리키는 다른 이름’을 묻는 문항이 나오면 답은 맨해튼 거리다. 마할라노비스 거리·코사인 거리와 헷갈리지 말 것.",
    aliases: [
      "L1",
      "L1 norm",
      "Manhattan distance",
      "맨해튼 거리",
      "맨하탄 거리",
      "일차 노름",
      "시가지 거리",
    ],
  },
  {
    id: "t-lp-norm",
    term: "p차 노름",
    en: "Lp norm",
    category: "수식·지표",
    short: "성분별 차이를 p제곱해 더한 뒤 p제곱근을 취한 거리",
    definition:
      "두 벡터의 성분별 차이를 p제곱하여 더한 뒤 p제곱근을 취하는 거리로, 1차 노름과 2차 노름을 포함하는 일반형.",
    formula: [{ expr: "d(x, x_i) = \\left(\\sum_j |x_j - x_{ij}|^p\\right)^{1/p}" }],
    example: "p = 1이면 1차 노름, p = 2이면 2차 노름과 같아짐.",
    prereqs: ["pre-norm"],
    related: ["t-l1-norm", "t-l2-norm", "t-distance-function"],
    lectures: [2],
    basis: "강의록 2강 설계 고려사항 ⑵ 거리 함수",
    aliases: ["Lp", "Lp norm", "p norm", "민코프스키 거리", "Minkowski distance"],
  },
  {
    id: "t-inner-product-distance",
    term: "내적",
    en: "inner product",
    category: "수식·지표",
    short: "두 벡터의 성분별 곱의 합 — 클수록 가까운 것으로 간주",
    definition:
      "두 벡터의 성분별 곱을 모두 더한 값으로, 거리 함수로 쓸 때는 값이 클수록 가까운 것으로 보아 이웃의 순위를 매김.",
    formula: [{ expr: "x \\cdot x_i = \\sum_j x_j\\, x_{ij}" }],
    distinctions: [
      {
        from: "다른 거리 함수",
        how: "나머지는 값이 작을수록 가까운 것이지만, 내적은 값이 클수록 가까운 것이라 순위를 매기는 방향이 반대.",
      },
    ],
    prereqs: ["pre-dot-product"],
    related: ["t-cosine-distance", "t-distance-function"],
    lectures: [2],
    basis: "강의록 2강 설계 고려사항 ⑵ 거리 함수",
    aliases: ["inner product", "dot product", "내적 거리"],
  },
  {
    id: "t-cosine-distance",
    term: "코사인 거리",
    en: "cosine distance",
    category: "수식·지표",
    short: "1에서 코사인 유사도를 뺀 값 — 크기를 빼고 방향만 비교",
    definition:
      "두 벡터의 내적을 각 벡터의 크기로 나눈 코사인 유사도를 1에서 뺀 값으로, 벡터의 크기를 무시하고 방향만 비교하는 거리.",
    formula: [
      { expr: "d(x, x_i) = 1 - \\dfrac{x \\cdot x_i}{\\|x\\|\\,\\|x_i\\|}" },
    ],
    distinctions: [
      {
        from: "유클리디안 거리",
        how: "코사인 거리는 원점에서의 방향만 보므로 크기가 크게 달라도 같은 방향이면 가깝다고 판정하지만, 유클리디안 거리는 크기 차이를 그대로 반영함.",
      },
    ],
    prereqs: ["pre-dot-product", "pre-norm"],
    related: ["t-inner-product-distance", "t-distance-function", "t-l2-norm"],
    lectures: [2],
    basis: "강의록 2강 설계 고려사항 ⑵ 거리 함수",
    aliases: ["cosine distance", "cosine similarity", "코사인 유사도"],
  },

  /* ---------- 그 밖의 분류기들 ---------- */
  {
    id: "t-logistic-regression",
    term: "로지스틱 회귀",
    en: "logistic regression",
    category: "알고리즘",
    short: "회귀 기법을 분류 문제로 확장한 방법",
    definition: "회귀 기법을 분류 문제로 확장한 분류 방법.",
    prereqs: ["pre-exp-log"],
    related: ["t-probabilistic-approach", "t-bayes-classifier"],
    lectures: [2],
    basis: "강의록 2강 그 밖의 분류기들",
    aliases: ["logistic regression", "로지스틱회귀"],
  },
  {
    id: "t-decision-tree",
    term: "결정 트리",
    en: "decision tree",
    category: "알고리즘",
    short: "속성 정보를 순차적으로 적용하여 분류",
    definition:
      "속성들의 정보를 순차적으로 적용하여 분류하는 방법으로, 판단 결과에 대한 설명력이 우수함.",
    prereqs: [],
    related: ["t-random-forest", "t-svm", "t-neural-network"],
    lectures: [2],
    basis: "강의록 2강 그 밖의 분류기들",
    emphasis:
      "결정 트리가 내세우는 장점은 정확도가 아니라 설명력이다. 왜 그렇게 분류했는지를 조건의 연쇄로 되짚을 수 있다는 점.",
    aliases: ["decision tree", "결정트리", "의사결정나무"],
  },
  {
    id: "t-random-forest",
    term: "랜덤 포레스트",
    en: "random forest",
    category: "알고리즘",
    short: "분류에 사용되는 대표적인 방법 중 하나",
    definition: "분류에 사용되는 대표적인 방법 중 하나로, 결정 트리를 바탕으로 한 분류기.",
    prereqs: [],
    related: ["t-decision-tree", "t-svm"],
    lectures: [2],
    basis: "강의록 2강 분류 — 분류에 사용되는 방법",
    aliases: ["random forest", "랜덤포레스트", "RF"],
  },
  {
    id: "t-svm",
    term: "서포트벡터머신",
    en: "Support Vector Machine, SVM",
    category: "알고리즘",
    short: "결정경계의 마진을 최대화하는 목적함수를 사용",
    definition:
      "결정경계의 마진을 최대화하는 목적함수를 사용하는 분류기로, 일반화 성능이 우수함.",
    prereqs: ["pre-hyperplane"],
    related: ["t-margin", "t-decision-tree", "t-neural-network"],
    lectures: [2],
    basis: "강의록 2강 그 밖의 분류기들",
    aliases: ["SVM", "Support Vector Machine", "서포트 벡터 머신", "최대 마진 분류기"],
  },
  {
    id: "t-margin",
    term: "마진",
    en: "margin",
    category: "개념",
    short: "결정경계와 가장 가까운 데이터 사이의 여유",
    definition:
      "결정경계와 가장 가까운 데이터 사이의 여유로, 서포트벡터머신은 이 마진을 최대화하는 결정경계를 찾음.",
    role: "마진이 클수록 경계가 데이터에 아슬아슬하게 붙지 않아 일반화 성능이 좋아진다.",
    prereqs: ["pre-hyperplane", "pre-euclidean"],
    related: ["t-svm", "t-decision-boundary"],
    lectures: [2],
    basis: "강의록 2강 그 밖의 분류기들 — 서포트벡터머신(SVM)",
    aliases: ["margin", "최대 마진", "maximum margin"],
  },
  {
    id: "t-neural-network",
    term: "신경망",
    en: "neural network",
    category: "알고리즘",
    short: "복잡한 결정경계를 신경망 모델로 정의하여 학습",
    definition:
      "복잡한 결정경계를 신경망 모델로 정의하여 학습하는 방법으로, 특징추출 단계까지 한 번에 학습함.",
    example: "MLP, CNN, LSTM 등이 분류에 사용되는 신경망 모델로 언급됨.",
    prereqs: [],
    related: ["t-svm", "t-decision-tree", "t-feature-extraction"],
    lectures: [2],
    basis: "강의록 2강 그 밖의 분류기들 — 신경망(딥러닝 모델)",
    emphasis:
      "다른 분류기들이 이미 뽑아 놓은 특징을 입력으로 받는 것과 달리, 신경망은 특징추출 단계까지 학습에 포함한다는 점이 구별되는 성질.",
    aliases: ["neural network", "딥러닝", "deep learning", "MLP", "CNN", "LSTM"],
  },
  {
    id: "t-feature-extraction",
    term: "특징추출",
    en: "feature extraction",
    category: "개념",
    short: "분류기에 넣을 특징을 뽑아내는 단계 — 분류기 자체가 아님",
    definition:
      "원 데이터에서 분류에 쓸 특징을 뽑아내는 단계로, 분류기와는 구별되는 별도의 처리 과정.",
    example: "PCA와 LDA가 특징추출 방법에 해당하며, 분류기 목록에 넣을 수 없음.",
    distinctions: [
      {
        from: "분류기",
        how: "특징추출은 입력을 다루기 좋은 형태로 바꾸는 앞단계이고, 분류기는 그 결과로 클래스를 정하는 단계. 신경망은 이 둘을 한 번에 학습함.",
      },
    ],
    prereqs: [],
    related: ["t-neural-network"],
    lectures: [2],
    basis: "2강 공식 연습문제 Q1",
    emphasis:
      "분류기를 나열한 보기 안에 PCA나 LDA가 섞여 있으면 그 보기는 틀린 것. 둘은 분류기가 아니라 특징추출 방법이다.",
    aliases: ["feature extraction", "PCA", "LDA", "특징 추출"],
  },
];
