import type { GlossaryTerm } from "@/lib/mlGlossaryTypes";

/**
 * 3강 지도학습: 회귀에서 처음 깊이 다루는 용어.
 *
 * 정의는 강의록 표현을 보존하되 한 문장으로 읽히게 다듬었다.
 */
export const lecture3Terms: GlossaryTerm[] = [
  /* ─────────── 회귀의 개념 ─────────── */
  {
    id: "t-independent-variable",
    term: "독립 변수",
    en: "independent variable",
    category: "개념",
    short: "회귀에서 입력에 해당하는 변수를 통계학에서 부르는 이름.",
    definition:
      "입력 변수와 출력 변수 사이의 매핑 관계 y = f(x; θ)에서 입력 쪽에 해당하는 변수. 값이 다른 변수에 의해 정해지지 않고 주어지는 쪽이라는 뜻에서 독립 변수라 부른다.",
    role: "회귀함수에 넣는 값이며, 여러 개일 때는 n차원 입력 벡터가 된다.",
    example: "BMI로부터 체지방률을 예측하는 문제에서 BMI가 독립 변수.",
    related: ["t-dependent-variable", "t-multivariate-linear-regression"],
    lectures: [3],
    basis: "강의록 3강 회귀의 개념",
    aliases: ["independent variable", "입력 변수", "설명 변수"],
  },
  {
    id: "t-dependent-variable",
    term: "종속 변수",
    en: "dependent variable",
    category: "개념",
    short: "회귀에서 출력에 해당하는 변수. 값이 입력에 따라 정해진다.",
    definition:
      "입력 변수와 출력 변수 사이의 매핑 관계 y = f(x; θ)에서 출력 쪽에 해당하는 변수. 값이 독립 변수에 종속되어 결정되므로 종속 변수라 부르며, 회귀에서는 연속적인 실수값이다.",
    role: "이 변수의 유형을 실수값에서 범주형으로 바꾸면 로지스틱 회귀가 된다.",
    distinctions: [
      {
        from: "분류의 클래스 레이블",
        how: "회귀의 종속 변수는 연속적인 실수값이고 분류의 출력은 이산적인 클래스 레이블이다. 로지스틱 회귀는 종속 변수를 범주형으로 확장해 그 경계를 넘어간 것이다.",
      },
    ],
    related: ["t-independent-variable", "t-categorical", "t-logistic-regression"],
    lectures: [3],
    basis: "강의록 3강 회귀의 개념",
    emphasis:
      "로지스틱 회귀를 묻는 문항은 거의 항상 '종속 변수를 범주형으로 확장'이라는 표현으로 나온다. 확장되는 대상이 입력이 아니라 출력이라는 점을 붙잡아 두면 커널법·선형화 같은 오답을 걸러낼 수 있다.",
    aliases: ["dependent variable", "출력 변수", "반응 변수"],
  },
  {
    id: "t-time-series-forecast",
    term: "시계열 예측",
    en: "time series forecasting",
    category: "개념",
    short: "시간에 따라 변하는 데이터를 분석해 앞으로의 값을 예측하는 문제.",
    definition:
      "시간에 따라 데이터가 변하는 것을 분석하고 과거 데이터로 앞으로 주어질 값을 예측하는 문제로, 회귀가 가장 대표적으로 적용되는 응용 분야.",
    example: "주가 예측, 환율 예측, 시장 예측, 판매 예측.",
    related: ["t-linear-regression"],
    lectures: [3],
    basis: "강의록 3강 회귀의 개념",
    emphasis:
      "회귀의 대표 응용을 묻는 문항은 시계열 예측을 답으로 두고, 차원 축소·시각화·군집화를 오답으로 섞는다. 출력이 연속적인 실수값인지만 확인하면 갈린다.",
    aliases: ["time series", "시계열", "주가 예측", "판매 예측"],
  },
  {
    id: "t-interpolation",
    term: "보간법",
    en: "interpolation",
    category: "알고리즘",
    short: "데이터 점을 모두 정확히 지나는 곡선을 찾는 방법.",
    definition:
      "데이터의 입력과 출력의 관계를 표현하는 곡선을 찾되 주어진 점들을 모두 정확히 지나도록 하는 방법으로, 제곱 오차가 0이지만 매우 복잡한 곡선이 된다.",
    role: "회귀와 목적이 어떻게 다른지를 보여 주는 대조 사례.",
    distinctions: [
      {
        from: "회귀",
        how: "보간법은 제곱 오차가 0이 되는 대신 곡선이 매우 복잡해지고, 회귀는 어느 정도의 오차를 허용하는 대신 데이터의 전체적인 경향을 보여 준다. 데이터에 잡음이 있다고 보는 이상 오차 0을 목표로 삼으면 잡음까지 따라가게 된다.",
      },
    ],
    related: ["t-linear-regression", "t-sum-squared-residuals"],
    lectures: [3],
    basis: "강의록 3강 보간법과 회귀",
    emphasis:
      "제곱 오차가 0인 쪽이 보간법이고 오차를 허용하는 쪽이 회귀다. 둘을 뒤집어 기억하지 않도록 주의.",
    aliases: ["interpolation", "보간 곡선"],
  },
  {
    id: "t-least-squares",
    term: "최소제곱법",
    en: "least square method",
    category: "알고리즘",
    short: "제곱오차를 최소화하는 매개변수를 찾는 방법.",
    definition:
      "목표 출력값과 모델 출력값의 차이를 제곱해 더한 오차함수를 최소화하는 매개변수를 찾는 방법. 최소자승법이라고도 부른다.",
    formula: [
      {
        expr: "E(D; θ) = (1/N) Σ_{(xᵢ,yᵢ)∈D} ( yᵢ − f(xᵢ; θ) )²",
        note: "회귀의 오차함수. 이 값을 최소로 만드는 θ를 찾는 것이 학습 목표",
      },
    ],
    role: "회귀의 학습 목표인 '예측 오류를 최소화하는 최적의 회귀함수 찾기'를 구체적인 계산 문제로 바꿔 준다.",
    prereqs: [
      "pre-sigma",
      "pre-partial-derivative",
      "pre-minimize-by-derivative",
      "pre-chain-rule",
    ],
    related: ["t-optimal-parameters", "t-sum-squared-residuals", "t-linear-regression"],
    lectures: [3],
    basis: "강의록 3강 회귀시스템",
    aliases: ["least square method", "최소자승법", "OLS", "least squares"],
  },

  /* ─────────── 선형회귀 ─────────── */
  {
    id: "t-linear-regression",
    term: "선형회귀",
    en: "linear regression",
    category: "알고리즘",
    short: "입력과 출력의 관계를 직선으로 설명하는 회귀.",
    definition:
      "데이터 집합 D = {(xᵢ, yᵢ)}ᵢ₌₁,⋯,N (xᵢ ∈ R, yᵢ ∈ R)에 대해 (x, y) 관계를 설명할 수 있는 선형함수 y = w₁x + w₀ + e를 찾는 것.",
    formula: [
      { expr: "y = w₁x + w₀ + e", note: "w₁은 기울기, w₀는 절편, e는 오차 또는 잔차" },
      { expr: "y_new = w₁ x_new + w₀", note: "회귀함수를 구한 뒤 새로운 데이터에 대한 예측" },
    ],
    role: "잔차의 제곱의 합을 최소로 하는 w₁, w₀를 찾는 문제로 바뀌며, 그 값은 주어진 데이터로부터 반복 없이 바로 계산된다.",
    distinctions: [
      {
        from: "로지스틱 회귀",
        how: "선형회귀의 매개변수는 공식에 값을 대입해 한 번에 계산되지만, 로지스틱 회귀는 목적함수가 복잡한 비선형 함수여서 수치적 최적화로 반복 추정해야 한다.",
      },
      {
        from: "비선형회귀",
        how: "선형회귀가 찾는 것은 1차식, 즉 직선이다. 곡선 함수를 찾는다는 서술은 비선형회귀를 가리킨다.",
      },
    ],
    prereqs: ["pre-sigma", "pre-linear-system"],
    related: [
      "t-slope",
      "t-intercept",
      "t-residual",
      "t-optimal-parameters",
      "t-multivariate-linear-regression",
      "t-logistic-regression",
    ],
    lectures: [3],
    basis: "강의록 3강 선형회귀",
    emphasis:
      "선형회귀는 잡음이 없다고 가정하지 않는다. 데이터에 어느 정도의 잡음이 있다고 보고 오차를 허용하는 대신 전체적인 경향을 잡는다. '잡음이 없다고 가정한다'는 선택지는 틀린 서술이다.",
    aliases: ["linear regression", "선형 회귀"],
  },
  {
    id: "t-slope",
    term: "기울기",
    en: "slope",
    category: "수식·지표",
    short: "선형회귀 직선에서 입력 x에 곱해지는 계수 w₁.",
    definition:
      "선형함수 y = w₁x + w₀ + e에서 입력 x 앞에 붙는 계수 w₁로, x가 1만큼 변할 때 출력이 얼마나 변하는지를 나타낸다.",
    formula: [
      {
        expr: "w₁ = ( N Σyᵢxᵢ − Σxᵢ · Σyᵢ ) / ( N Σxᵢ² − (Σxᵢ)² )",
        note: "데이터의 합만으로 계산되는 닫힌 형태의 값",
      },
    ],
    example:
      "N = 7, Σxᵢ = 28, Σyᵢ = 24, Σxᵢyᵢ = 119.5, Σxᵢ² = 140이면 분자 7×119.5 − 28×24 = 164.5, 분모 7×140 − 28² = 196이므로 w₁ = 0.8392857.",
    related: ["t-intercept", "t-linear-regression", "t-optimal-parameters"],
    lectures: [3],
    basis: "강의록 3강 선형회귀",
    aliases: ["slope", "w1", "w₁"],
  },
  {
    id: "t-intercept",
    term: "절편",
    en: "intercept",
    category: "수식·지표",
    short: "선형회귀 직선에서 x가 0일 때의 값 w₀.",
    definition:
      "선형함수 y = w₁x + w₀ + e에서 상수항 w₀로, 직선이 y축과 만나는 값.",
    formula: [
      { expr: "w₀ = ȳ − w₁x̄", note: "x̄ = (1/N)Σxᵢ, ȳ = (1/N)Σyᵢ" },
    ],
    example: "ȳ = 3.428571, w₁ = 0.8392857, x̄ = 4이면 w₀ = 3.428571 − 0.8392857 × 4 = 0.0714286.",
    role: "w₁을 먼저 구해야 계산할 수 있다는 순서를 기억해 두면 유도 과정을 재현하기 쉽다.",
    related: ["t-slope", "t-optimal-parameters"],
    lectures: [3],
    basis: "강의록 3강 선형회귀의 최적 매개변수",
    aliases: ["intercept", "bias", "w0", "w₀"],
  },
  {
    id: "t-residual",
    term: "잔차",
    en: "residual",
    category: "수식·지표",
    short: "데이터의 실제 출력값과 직선이 주는 값의 차이.",
    definition:
      "목표 출력값 yᵢ와 선형함수가 주는 값 w₁xᵢ + w₀의 차이 eᵢ = yᵢ − (w₁xᵢ + w₀)로, 오차라고도 부른다.",
    formula: [{ expr: "eᵢ = yᵢ − (w₁xᵢ + w₀)" }],
    role: "좋은 선형회귀 모델은 모든 데이터에 대한 잔차가 가능한 한 작은 모델이므로, 잔차를 어떻게 모아 하나의 값으로 만들지가 다음 문제가 된다.",
    related: ["t-residual-sum", "t-sum-squared-residuals", "t-linear-regression"],
    lectures: [3],
    basis: "강의록 3강 좋은 선형회귀 모델",
    aliases: ["residual", "error", "오차", "e_i"],
  },
  {
    id: "t-residual-sum",
    term: "잔차의 합",
    en: "sum of residuals",
    category: "수식·지표",
    short: "잔차를 그대로 더한 값. 평가 기준으로는 부적합하다.",
    definition:
      "모든 데이터에 대한 잔차를 부호를 그대로 둔 채 더한 값 Σᵢ₌₁ᴺ eᵢ로, 선형회귀 모델의 평가 기준으로는 부적합한 방법.",
    formula: [{ expr: "Σᵢ₌₁ᴺ eᵢ = Σᵢ₌₁ᴺ ( yᵢ − (w₁xᵢ + w₀) )" }],
    example:
      "데이터가 직선 y = x + 1 위에 정확히 놓여 있을 때, 엉뚱한 직선 y = 0.5x + 2.5의 잔차는 −1, −0.5, 0, +0.5, +1이라 합이 0이 된다. 정답 직선의 잔차 합도 0이므로 둘을 구별하지 못한다.",
    distinctions: [
      {
        from: "잔차의 제곱의 합",
        how: "잔차의 합은 부호가 다른 잔차가 상쇄되어 나쁜 직선도 좋은 직선과 같은 값을 받는다. 제곱하면 부호가 사라져 상쇄가 일어나지 않고, 주어진 데이터 집합에 대해 유일한 직선이 결정된다.",
      },
    ],
    prereqs: ["pre-sigma"],
    related: ["t-sum-squared-residuals", "t-residual"],
    lectures: [3],
    basis: "강의록 3강 좋은 선형회귀 모델",
    emphasis:
      "잔차의 합을 쓰지 못하는 이유는 계산이 어려워서도, 값이 항상 음수여서도, 데이터 개수에 비례해서도 아니다. 부호가 상쇄된다는 한 가지 이유뿐이다.",
    aliases: ["sum of residuals", "잔차 합"],
  },
  {
    id: "t-sum-squared-residuals",
    term: "잔차의 제곱의 합",
    en: "sum of squared residuals",
    category: "수식·지표",
    short: "잔차를 제곱해 더한 값. 선형회귀의 오차함수.",
    definition:
      "모든 데이터에 대한 잔차를 제곱해 더한 값으로, 선형회귀의 오차함수 E(w₁, w₀)가 되며 주어진 데이터 집합에 대해 유일한 직선을 생성한다.",
    formula: [
      { expr: "E(w₁, w₀) = Σᵢ₌₁ᴺ eᵢ² = Σᵢ₌₁ᴺ ( yᵢ − (w₁xᵢ + w₀) )²" },
    ],
    example:
      "강의록 예제 7개 데이터의 잔차 제곱은 0.1687, 0.5625, 0.3473, 0.3265, 0.5896, 0.7972, 0.1993이고 그 합이 오차함수의 값이다.",
    role: "이 값을 최소로 만드는 w₁, w₀를 찾는 것이 선형회귀의 학습이다.",
    prereqs: ["pre-sigma"],
    related: ["t-residual-sum", "t-mse", "t-optimal-parameters", "t-least-squares"],
    lectures: [3],
    basis: "강의록 3강 좋은 선형회귀 모델",
    aliases: ["sum of squared residuals", "SSE", "RSS", "오차함수"],
  },
  {
    id: "t-optimal-parameters",
    term: "최적 매개변수",
    en: "optimal parameters",
    category: "수식·지표",
    short: "오차함수를 최소로 만드는 w₁, w₀. 데이터만으로 바로 계산된다.",
    definition:
      "오차함수 E(w₁, w₀)를 각 매개변수에 대해 편미분해 0이 되는 점을 찾아 얻는 w₁, w₀의 값으로, 주어진 데이터로부터 반복 없이 직접 계산된다.",
    formula: [
      {
        expr: "∂E/∂w₀ = −2 Σᵢ₌₁ᴺ ( yᵢ − (w₁xᵢ + w₀) ) = 0",
        note: "w₀에 대한 편미분. 안쪽 항의 미분값이 −1이라 xᵢ가 붙지 않는다",
      },
      {
        expr: "∂E/∂w₁ = −2 Σᵢ₌₁ᴺ ( yᵢ − (w₁xᵢ + w₀) ) xᵢ = 0",
        note: "w₁에 대한 편미분. 안쪽 항의 미분값이 −xᵢ라 xᵢ가 곱해져 남는다",
      },
      {
        expr: "w₀N + w₁Σxᵢ = Σyᵢ,  w₀Σxᵢ + w₁Σxᵢ² = Σyᵢxᵢ",
        note: "두 편미분식을 정리해 얻는 w₁, w₀에 대한 연립방정식",
      },
      { expr: "w₀ = ȳ − w₁x̄" },
      { expr: "w₁ = ( N Σyᵢxᵢ − Σxᵢ · Σyᵢ ) / ( N Σxᵢ² − (Σxᵢ)² )" },
    ],
    prereqs: [
      "pre-partial-derivative",
      "pre-minimize-by-derivative",
      "pre-chain-rule",
      "pre-linear-system",
      "pre-sigma",
    ],
    related: ["t-slope", "t-intercept", "t-least-squares", "t-multivariate-linear-regression"],
    lectures: [3],
    basis: "강의록 3강 최적의 매개변수 계산 과정",
    emphasis:
      "선형회귀의 매개변수는 반복 계산 없이 데이터의 합만으로 바로 얻어진다. 이 점이 반복적 추정이 필요한 로지스틱 회귀와 갈리는 자리다.",
    aliases: ["optimal parameters", "최적 파라미터", "normal equation"],
  },
  {
    id: "t-mse",
    term: "평균제곱오차",
    en: "Mean Squared Error",
    category: "수식·지표",
    short: "제곱오차의 평균. 테스트 데이터 평가 기준.",
    definition:
      "테스트 데이터 집합에 대해 목표 출력값과 예측값의 차이를 제곱해 더한 뒤 데이터 개수로 나눈 값.",
    formula: [
      {
        expr: "MSE(w₁, w₀) = (1/N_tst) Σⱼ₌₁^{N_tst} ( yⱼᵗˢᵗ − (w₁xⱼᵗˢᵗ + w₀) )²",
      },
    ],
    role: "1/N_tst 항은 데이터 개수에 의존해 제곱오차가 너무 커지는 것을 막는 역할을 한다.",
    distinctions: [
      {
        from: "평균제곱근 오차 RMSE",
        how: "MSE는 제곱한 상태의 값이라 실제 차이가 얼마인지 감이 오지 않는다. RMSE는 여기에 제곱근을 씌워 목표 출력값과 같은 스케일로 되돌린 값이다.",
      },
    ],
    prereqs: ["pre-sigma"],
    related: ["t-rmse", "t-sum-squared-residuals"],
    lectures: [3],
    basis: "강의록 3강 예측과 평가",
    aliases: ["MSE", "Mean Squared Error", "평균제곱 오차"],
  },
  {
    id: "t-rmse",
    term: "평균제곱근오차",
    en: "Root Mean Square Error",
    category: "수식·지표",
    short: "MSE에 제곱근을 씌워 원래 차이값의 스케일로 되돌린 값.",
    definition:
      "평균제곱오차에 제곱근을 취한 값으로, 제곱을 하면 실제 차이값이 무엇인지 직관적으로 알기 어렵기 때문에 원래 차이값의 스케일로 되돌려 이해하기 위해 사용한다.",
    formula: [
      {
        expr: "RMSE(w₁, w₀) = √( (1/N_tst) Σⱼ₌₁^{N_tst} ( yⱼᵗˢᵗ − (w₁xⱼᵗˢᵗ + w₀) )² )",
      },
    ],
    related: ["t-mse"],
    lectures: [3],
    basis: "강의록 3강 예측과 평가",
    emphasis:
      "제곱근을 씌우는 이유는 값을 해석할 수 있게 만들기 위해서다. 부호를 없애는 일은 이미 제곱이 했고, 데이터 개수의 영향을 없애는 일은 1/N_tst 항이 한다.",
    aliases: ["RMSE", "Root Mean Square Error", "평균제곱근 오차"],
  },

  /* ─────────── 다변량 선형회귀 ─────────── */
  {
    id: "t-multivariate-linear-regression",
    term: "다변량 선형회귀",
    en: "multivariate linear regression",
    category: "알고리즘",
    short: "여러 개의 입력으로 하나의 출력을 예측하는 선형회귀.",
    definition:
      "입력이 여러 개의 값으로 구성되어 n차원 입력 벡터 x = (x₁, x₂, ⋯, x_n)가 되는 경우의 선형회귀로, 입출력 관계를 설명하는 n차원 공간에서 초평면을 찾는 문제.",
    formula: [
      { expr: "f(x) = w₀ + w₁x₁ + w₂x₂ + ⋯ + w_n x_n", note: "(n+1)개의 파라미터 추정이 필요" },
      { expr: "E(w) = (y − Xw)ᵀ(y − Xw)", note: "행렬 형태의 오차함수" },
      {
        expr: "∂E(w)/∂w = 2Xᵀ(y − Xw) = 0 ⇒ XᵀXw = Xᵀy",
        note: "미분해서 0으로 놓고 정리한 식",
      },
      { expr: "w = (XᵀX)⁻¹Xᵀy", note: "양변에 (XᵀX)⁻¹를 곱해 얻는 최적 파라미터" },
      { expr: "f(x_new) = wᵀx̃_new", note: "새로운 데이터에 대한 예측" },
    ],
    example:
      "나이와 몸무게로 수축기 혈압을 예측하면 입력이 2차원이므로 3차원 공간의 평면 하나를 찾는 문제가 된다.",
    distinctions: [
      {
        from: "1차원 입력의 선형회귀",
        how: "찾는 대상이 직선에서 초평면으로 바뀌고 계산이 행렬 형태가 될 뿐, 오차함수를 미분해 0으로 놓고 매개변수를 바로 계산한다는 구조는 같다.",
      },
    ],
    prereqs: [
      "pre-matrix-mult",
      "pre-transpose",
      "pre-inverse",
      "pre-column-vector",
      "pre-hyperplane",
    ],
    related: ["t-hyperplane", "t-extended-input", "t-linear-regression", "t-optimal-parameters"],
    lectures: [3],
    basis: "강의록 3강 다변량 선형회귀",
    emphasis:
      "w = (XᵀX)⁻¹Xᵀy는 차원으로 검산하면 바로 확인된다. X가 N × (n+1)이므로 XᵀX는 (n+1) × (n+1)이고, 여기에 (n+1) × 1인 Xᵀy를 곱하면 w의 shape인 (n+1) × 1이 나온다. XXᵀ로 잘못 쓴 선택지는 이 검산에서 걸린다.",
    aliases: ["multivariate linear regression", "다중 선형회귀", "multiple linear regression"],
  },
  {
    id: "t-hyperplane",
    term: "초평면",
    en: "hyperplane",
    category: "개념",
    short: "n차원 공간에서 입출력 관계를 설명하는 평평한 면.",
    definition:
      "다변량 선형회귀가 찾는 대상으로, 입력 변수들의 1차식으로 표현되는 평평한 면. 2차원에서는 직선, 3차원에서는 평면이며 그 이상은 그릴 수 없으므로 초평면이라 부른다.",
    prereqs: ["pre-hyperplane"],
    related: ["t-multivariate-linear-regression"],
    lectures: [3],
    basis: "강의록 3강 다변량 선형회귀",
    aliases: ["hyperplane", "초평면"],
  },
  {
    id: "t-extended-input",
    term: "확장 입력",
    en: "augmented input",
    category: "수식·지표",
    short: "입력 앞에 상수값 1을 하나 붙여 w와 차원을 맞춘 벡터 x̃.",
    definition:
      "매개변수 w는 w₀부터 w_n까지 (n+1)차원인데 입력 x는 n차원이므로, 차원을 맞추기 위해 입력에 상수값 요소 1을 추가해 만든 (n+1)차원 벡터.",
    formula: [
      { expr: "x̃ = [1, x₁, x₂, ⋯, x_n]ᵀ", note: "(n+1) × 1" },
      { expr: "f(x) = [w₀, w₁, ⋯, w_n] x̃ = wᵀx̃", note: "(1 × (n+1)) · ((n+1) × 1) = 1 × 1" },
      { expr: "X = [x̃₁ᵀ; x̃₂ᵀ; ⋯; x̃_Nᵀ]", note: "각 데이터의 x̃ᵀ를 한 행씩 쌓은 N × (n+1) 행렬" },
    ],
    role: "상수항 w₀를 따로 떼어 쓰지 않고 행렬 곱 한 번으로 회귀함수를 표현할 수 있게 해 준다.",
    prereqs: ["pre-column-vector", "pre-transpose", "pre-dot-product", "pre-matrix-mult"],
    related: ["t-multivariate-linear-regression"],
    lectures: [3],
    basis: "강의록 3강 다변량 선형회귀",
    aliases: ["augmented input", "x tilde", "확장된 입력", "x̃"],
  },

  /* ─────────── 로지스틱 회귀 ─────────── */
  {
    id: "t-logistic-regression",
    term: "로지스틱 회귀",
    en: "logistic regression",
    category: "알고리즘",
    short: "선형회귀의 종속변수를 범주형으로 확장해 분류에 쓰는 방법.",
    definition:
      "선형회귀분석의 종속변수(출력)를 범주형으로 확장한 것으로, 종속변수의 결과가 범주형으로 제한되어 분류 문제에 적용할 수 있으며 입력값이 각 클래스에 속하는 확률값을 회귀분석으로 예측한다.",
    formula: [
      { expr: "P(y = 1|x) = φ(mx + b) = e^(mx+b) / (1 + e^(mx+b))" },
      { expr: "x_new ∈ C1 if m·x_new + b ≤ 0,  x_new ∈ C2 if m·x_new + b > 0" },
    ],
    role: "선형함수 mx + b를 로지스틱 함수에 통과시켜 출력을 확률로 바꾸고, 그 확률을 0.5와 견주어 클래스를 정한다.",
    distinctions: [
      {
        from: "선형회귀",
        how: "선형회귀의 매개변수는 데이터의 합만으로 공식에 대입해 바로 계산되지만, 로지스틱 회귀의 목적함수는 복잡한 비선형 함수여서 수치적 최적화로 반복 추정해야 한다. 목적함수도 제곱오차에서 로그 우도로 바뀐다.",
      },
    ],
    prereqs: ["pre-exp-log", "pre-conditional-prob"],
    related: [
      "t-logistic-function",
      "t-odds-ratio",
      "t-logit",
      "t-log-likelihood",
      "t-maximum-likelihood-estimation",
      "t-logistic-decision-boundary",
      "t-categorical",
      "t-linear-regression",
    ],
    lectures: [3],
    basis: "강의록 3강 로지스틱 회귀",
    aliases: ["logistic regression", "로지스틱회귀"],
  },
  {
    id: "t-categorical",
    term: "범주형",
    en: "categorical",
    category: "개념",
    short: "값이 실수가 아니라 클래스 레이블인 출력 형태.",
    definition:
      "출력의 결과가 몇 개의 범주 가운데 하나로 제한되는 형태. 여기서 범주는 클래스를 뜻하며, 출력이 실수값이 아니라 클래스 레이블이 되므로 분류 문제에 적용할 수 있다.",
    related: ["t-logistic-regression", "t-dependent-variable"],
    lectures: [3],
    basis: "강의록 3강 로지스틱 회귀",
    aliases: ["categorical", "범주", "클래스 레이블"],
  },
  {
    id: "t-logistic-function",
    term: "로지스틱 함수",
    en: "logistic function",
    category: "수식·지표",
    short: "실수 전체를 (0, 1)로 매핑하는 S자 모양의 함수.",
    definition:
      "입력 x ∈ (−∞, ∞)를 항상 (0, 1) 범위로 매핑하는 S자 모양의 함수로, 출력값이 0과 1 사이의 실수값이므로 클래스 레이블에 대한 사후확률 P(y = 1|x)로 간주할 수 있다.",
    formula: [
      { expr: "φ(x) = 1 / (1 + e⁻ˣ) = eˣ / (1 + eˣ)" },
      {
        expr: "P(y = 1|x) = φ(mx + b) = e^(mx+b) / (1 + e^(mx+b))",
        note: "파라미터 m과 b를 가진 선형함수를 넣어 사후확률을 추정",
      },
    ],
    example:
      "m과 b를 (2, 1), (1, 1), (0.5, 0.5)로 바꾸면 같은 S자 모양이 가팔라지거나 완만해지고 좌우로 이동한다.",
    role: "선형함수의 값을 확률로 바꿔 주므로, 결정규칙을 P(y = 1|x) ≤ 0.5이면 C1, > 0.5이면 C2로 세울 수 있다.",
    prereqs: ["pre-exp-log", "pre-conditional-prob", "pre-prior-posterior"],
    related: ["t-logistic-regression", "t-odds-ratio", "t-logistic-decision-boundary"],
    lectures: [3],
    basis: "강의록 3강 로지스틱 함수",
    emphasis:
      "로지스틱 함수의 출력은 0과 1 사이를 벗어나지 않는다. 이 성질 덕분에 확률로 읽을 수 있는 것이며, 출력 범위를 다르게 서술한 선택지는 옳지 않다.",
    aliases: ["logistic function", "sigmoid", "시그모이드", "S자 곡선"],
  },
  {
    id: "t-odds-ratio",
    term: "오즈비",
    en: "odds ratio",
    category: "수식·지표",
    short: "한 입력이 두 클래스에 속할 확률의 비율. 승산비.",
    definition:
      "한 입력 x가 두 클래스에 속할 확률의 비율. 식으로는 사후확률 P(y = 1|x)를 1에서 그 값을 뺀 것으로 나눈 P(C2)/P(C1) 형태이며 e^(mx+b)와 같다. 값의 범위는 0부터 무한대까지다. 강의록 문장은 C1·C2 순서로 읽히지만 판정은 식을 기준으로 하므로, 오즈비가 1보다 크면 C2다.",
    formula: [
      { expr: "odds = P(y = 1|x) / ( 1 − P(y = 1|x) ) = e^(mx+b)", note: "0 ≤ odds ≤ ∞" },
    ],
    example: "P(y = 1|x) = 0.8이면 odds = 0.8 / 0.2 = 4이고, 1보다 크므로 x ∈ C2.",
    distinctions: [
      {
        from: "사전확률",
        how: "사전확률은 데이터 전체에서 각 클래스가 차지하는 비율이고, 오즈비는 특정 입력 하나가 두 클래스에 속할 확률을 나눈 값이다. 오즈비는 입력 x가 정해질 때마다 달라진다.",
      },
    ],
    prereqs: ["pre-exp-log", "pre-conditional-prob"],
    related: ["t-logit", "t-logistic-function", "t-logistic-decision-boundary"],
    lectures: [3],
    basis: "강의록 3강 오즈비, 로짓함수, 결정경계",
    emphasis:
      "오즈비는 전체에서 각 클래스가 차지하는 비율이 아니라, 한 입력이 두 클래스에 속할 확률의 비율이다. 사전확률과 혼동하도록 만든 선택지가 실제로 출제된다.",
    aliases: ["odds ratio", "odds", "승산비", "오즈"],
  },
  {
    id: "t-logit",
    term: "로짓 함수",
    en: "logit function",
    category: "수식·지표",
    short: "오즈비에 로그를 취한 함수. 값이 그대로 mx + b가 된다.",
    definition:
      "오즈비에 대해 로그를 취한 것으로, 계산하면 선형함수 mx + b와 같아진다.",
    formula: [
      { expr: "logit(P) = log( P(y = 1|x) / ( 1 − P(y = 1|x) ) ) = mx + b" },
    ],
    role: "오즈비는 0부터 무한대까지의 비대칭한 범위를 갖지만, 로그를 취하면 P = 0.5를 기준으로 좌우가 대칭이 되고 값이 선형함수 그대로가 된다.",
    distinctions: [
      {
        from: "오즈비",
        how: "판정 기준이 각각 다르다. 오즈비는 1을 기준으로, 로짓은 0을 기준으로 갈린다. 오즈비 1에 로그를 취하면 0이므로 두 기준은 같은 경계를 가리킨다.",
      },
    ],
    prereqs: ["pre-exp-log"],
    related: ["t-odds-ratio", "t-logistic-decision-boundary", "t-logistic-function"],
    lectures: [3],
    basis: "강의록 3강 오즈비, 로짓함수, 결정경계",
    aliases: ["logit", "logit function", "로짓", "log odds"],
  },
  {
    id: "t-logistic-decision-boundary",
    term: "로지스틱 회귀의 결정경계",
    en: "decision boundary of logistic regression",
    category: "개념",
    short: "로짓 함수를 0으로 놓아 얻는 두 클래스의 경계.",
    definition:
      "logit(P) = log( P(y = 1|x) / (1 − P(y = 1|x)) ) = mx + b = 0을 만족하는 지점으로, 사후확률·오즈비·로짓 세 기준이 동시에 갈리는 자리.",
    formula: [
      { expr: "logit(P) = mx + b = 0" },
      {
        expr: "P(y = 1|x) ≤ 0.5, 오즈비 ≤ 1, 로짓함수 ≤ 0, mx + b ≤ 0 → x ∈ C1",
      },
      {
        expr: "P(y = 1|x) > 0.5, 오즈비 > 1, 로짓함수 > 0, mx + b > 0 → x ∈ C2",
      },
    ],
    prereqs: ["pre-exp-log", "pre-hyperplane"],
    related: ["t-logit", "t-odds-ratio", "t-logistic-function", "t-logistic-regression"],
    lectures: [3],
    basis: "강의록 3강 오즈비, 로짓함수, 결정경계",
    emphasis:
      "네 가지 표현은 같은 경계를 다르게 쓴 것뿐이다. 사후확률 0.5, 오즈비 1, 로짓 0, mx + b가 0인 지점이 모두 같은 곳이라는 대응을 외워 두면 어느 형태로 물어도 답할 수 있다.",
    aliases: ["decision boundary", "결정 경계", "판정 경계"],
  },
  {
    id: "t-bernoulli-distribution",
    term: "베르누이 분포",
    en: "Bernoulli distribution",
    category: "수식·지표",
    short: "결과가 둘 중 하나인 시행의 분포. 로지스틱 회귀의 p(y|x)가 따른다.",
    definition:
      "확률실험의 시행 결과가 성공과 실패 둘 중 하나인 경우의 분포로, 목표 출력이 yᵢ ∈ {0, 1}인 로지스틱 회귀에서 p(y|x)의 확률함수가 이 분포를 따른다.",
    formula: [
      { expr: "p(y|x) = {P(y = 1|x)}^y {1 − P(y = 1|x)}^(1−y)" },
      {
        expr: "= { e^(mx+b) / (1 + e^(mx+b)) }^y { 1 − e^(mx+b) / (1 + e^(mx+b)) }^(1−y)",
      },
    ],
    role: "이 확률함수를 데이터 전체에 대해 곱하고 로그를 취한 것이 로그 우도 목적함수다.",
    prereqs: ["pre-bernoulli", "pre-random-variable", "pre-conditional-prob"],
    related: ["t-log-likelihood", "t-logistic-regression"],
    lectures: [3],
    basis: "강의록 3강 매개변수 m, b 추정",
    aliases: ["Bernoulli distribution", "베르누이"],
  },
  {
    id: "t-log-likelihood",
    term: "로그 우도",
    en: "log likelihood",
    category: "수식·지표",
    short: "데이터 전체의 확률을 곱한 뒤 로그를 취한 목적함수.",
    definition:
      "데이터 집합 D에 대한 확률 p(yᵢ|xᵢ)를 모두 곱한 뒤 로그를 취한 값으로, 로지스틱 회귀의 새로운 목적함수.",
    formula: [
      { expr: "l(m, b) = log Πᵢ₌₁ᴺ p(yᵢ|xᵢ)" },
      {
        expr:
          "= Σᵢ [ yᵢ log( e^(mxᵢ+b) / (1 + e^(mxᵢ+b)) ) + (1 − yᵢ) log( 1 − e^(mxᵢ+b) / (1 + e^(mxᵢ+b)) ) ]",
      },
    ],
    role: "출력값은 0과 1이라는 클래스 레이블인데 모델이 계산하는 것은 확률값이므로, 제곱오차 대신 새로운 형태의 목적함수가 필요해서 도입된다.",
    distinctions: [
      {
        from: "제곱오차",
        how: "제곱오차는 선형회귀의 목적함수이고 최소화하는 대상이다. 로그 우도는 로지스틱 회귀의 목적함수이고 최대화하는 대상이다.",
      },
    ],
    prereqs: ["pre-likelihood", "pre-bernoulli", "pre-exp-log", "pre-sigma"],
    related: ["t-maximum-likelihood-estimation", "t-bernoulli-distribution", "t-logistic-regression"],
    lectures: [3],
    basis: "강의록 3강 매개변수 m, b 추정",
    emphasis:
      "곱을 로그로 바꾸면 합이 되므로 미분하기 쉬워진다. 로그를 취하는 이유가 여기에 있고, 로그는 증가함수라 최대가 되는 자리도 바뀌지 않는다.",
    aliases: ["log likelihood", "로그우도", "log-likelihood"],
  },
  {
    id: "t-maximum-likelihood-estimation",
    term: "최대우도 추정법",
    en: "maximum likelihood estimation",
    category: "알고리즘",
    short: "로그 우도를 최대로 만드는 매개변수를 고르는 추정 방법.",
    definition:
      "로그 우도 l(m, b)를 각 매개변수에 대해 편미분해 0이 되는 조건을 세워 매개변수를 추정하는 방법으로, 로지스틱 회귀의 m과 b가 이 방법으로 정해진다.",
    formula: [{ expr: "∂l(m, b)/∂m = 0,  ∂l(m, b)/∂b = 0" }],
    role: "선형회귀가 오차를 최소화하는 자리에, 로지스틱 회귀는 우도를 최대화하는 방법을 놓는다.",
    prereqs: ["pre-likelihood", "pre-mle", "pre-bernoulli", "pre-partial-derivative", "pre-argmax-argmin"],
    related: ["t-log-likelihood", "t-numerical-optimization", "t-logistic-regression"],
    lectures: [3],
    basis: "강의록 3강 매개변수 m, b 추정",
    aliases: ["maximum likelihood estimation", "MLE", "최대 우도 추정"],
  },
  {
    id: "t-numerical-optimization",
    term: "수치적 최적화",
    en: "numerical optimization",
    category: "알고리즘",
    short: "한 번에 풀리지 않는 식을 반복적인 추정으로 최적화하는 방법.",
    definition:
      "편미분해서 0으로 놓은 식이 복잡한 비선형 함수여서 직접 계산되지 않을 때, 반복적인 추정을 통해 최적값에 접근하는 방법.",
    role: "로지스틱 회귀의 m과 b는 이 방법으로 얻는다. 선형회귀처럼 공식 한 줄로 값이 나오지 않는다.",
    distinctions: [
      {
        from: "선형회귀의 직접 계산",
        how: "선형회귀는 연립방정식이 풀려서 w₁, w₀가 데이터의 합만으로 바로 계산되지만, 로지스틱 회귀의 목적함수는 매우 복잡한 비선형 함수여서 반복적 추정이 필요하다.",
      },
    ],
    prereqs: ["pre-numerical-optimization", "pre-local-global-min", "pre-partial-derivative"],
    related: ["t-maximum-likelihood-estimation", "t-logistic-regression", "t-optimal-parameters"],
    lectures: [3],
    basis: "강의록 3강 매개변수 m, b 추정",
    emphasis:
      "선형회귀는 공식으로 바로, 로지스틱 회귀는 반복해서. 두 방법의 계산 방식 차이를 묻는 자리가 시험에서 갈린다.",
    aliases: ["numerical optimization", "반복적 추정", "iterative estimation"],
  },
];
