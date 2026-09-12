import type { GlossaryTerm } from "@/lib/mlGlossaryTypes";

/**
 * 4강 비지도학습: 군집화에서 다루는 용어.
 *
 * 정의는 강의록 표현을 보존하되 한 문장으로 읽히게 다듬었다.
 */
export const lecture4Terms: GlossaryTerm[] = [
  /* ─────────── 군집화의 개념 ─────────── */
  {
    id: "t-clustering",
    term: "군집화",
    en: "clustering",
    category: "개념",
    short: "데이터 집합을 서로 교차하지 않는 여러 부분집합으로 나누는 문제.",
    definition:
      "데이터 집합의 내재된 분포 특성을 분석하여 서로 교차하지 않는 복수 개의 부분집합으로 나누는 문제. 입력 데이터로부터 추출된 특징 공간에서 특징값의 유사성에 따라 스스로 비슷한 데이터끼리 묶어서 몇 개의 그룹으로 나눈다.",
    role: "목표 출력값이 주어지지 않는 데이터에서 구조를 찾아내는 비지도학습의 대표 문제.",
    formula: [
      { expr: "D = {x_i}, i = 1,…,N", note: "학습 데이터에 목표 출력값 y가 없다" },
      { expr: "D = D₁ ∪ D₂ ∪ … ∪ D_K", note: "학습 결과는 서로소인 K개의 부분집합" },
    ],
    example:
      "여러 장의 장면 영상을 아무 정보 없이 주고 비슷한 것끼리 묶게 하는 문제, 영상의 화소를 색상값의 유사성에 따라 영역으로 나누는 영상분할.",
    distinctions: [
      {
        from: "분류",
        how: "분류의 학습 데이터는 D = {(x_i, y_i)}로 클래스 레이블이 목표 출력값으로 함께 주어지는 지도학습이고, 군집화의 학습 데이터는 D = {x_i}로 레이블이 없는 비지도학습이다. 같은 점 구름이라도 색이 칠해져 주어졌는지 아닌지가 갈림길이다.",
      },
    ],
    prereqs: ["pre-euclidean", "pre-scatter"],
    related: [
      "t-cluster",
      "t-disjoint-subset",
      "t-kmeans",
      "t-hierarchical-clustering",
      "t-gaussian-mixture-model",
      "t-labeling-cost",
    ],
    lectures: [4],
    basis: "강의록 4강 군집화의 개념",
    emphasis:
      "군집화의 응용으로 제시되는 것은 영상 데이터 그룹핑과 영상분할이다. 데이터 시각화를 군집화의 적용이라고 한 선택지는 틀린 것으로, 시각화에는 특징추출 방법인 t-SNE가 주로 쓰인다.",
    aliases: ["clustering", "클러스터링", "군집분석"],
  },
  {
    id: "t-cluster",
    term: "군집",
    en: "cluster",
    category: "개념",
    short: "유사한 데이터끼리 묶인 하나의 그룹.",
    definition:
      "특징 공간에서 특징값이 서로 비슷한 데이터들을 하나로 묶은 부분집합. 군집화의 결과로 만들어지는 각각의 그룹이며, 클러스터라고도 부른다.",
    role: "군집화가 찾아내는 단위이자, K-평균의 C_k와 계층적 군집화의 C_i가 가리키는 대상.",
    distinctions: [
      {
        from: "클래스",
        how: "클래스는 사람이 미리 정해 레이블로 붙여 준 범주이고, 군집은 데이터의 유사성만으로 알고리즘이 스스로 묶어 낸 그룹이다. 군집에는 원래 이름이 없다.",
      },
    ],
    related: ["t-clustering", "t-disjoint-subset", "t-representative-vector"],
    lectures: [4],
    basis: "강의록 4강 군집화의 개념",
    aliases: ["cluster", "클러스터", "그룹"],
  },
  {
    id: "t-disjoint-subset",
    term: "서로소인 부분집합",
    en: "disjoint subset",
    category: "개념",
    short: "서로 겹치는 원소가 없도록 나눈 부분집합.",
    definition:
      "전체 데이터 집합 D를 D = D₁ ∪ D₂ ∪ … ∪ D_K로 나누되 부분집합 사이에 교집합이 없도록 한 결과. 군집화의 학습 결과를 표현하는 세 가지 방법 중 하나다.",
    role: "어느 데이터가 어느 군집에 속하는지만 나타내는, 가장 직접적인 군집화 결과 표현.",
    formula: [
      { expr: "D = D₁ ∪ D₂ ∪ … ∪ D_K", note: "i ≠ j이면 Dᵢ ∩ Dⱼ = ∅" },
    ],
    related: ["t-clustering", "t-cluster", "t-representative-vector"],
    lectures: [4],
    basis: "강의록 4강 군집화의 입출력 관계",
    emphasis:
      "군집화 일반의 학습 결과는 서로소인 부분집합, 대표 벡터의 집합, 각 클러스터의 확률분포 세 가지다. 그중 K-평균이 만들어 내는 것만 따로 묻는 문항이 나오므로 세 가지를 한 묶음으로 외우지 말고 어느 방법의 결과인지까지 붙여 두어야 한다.",
    aliases: ["disjoint", "서로소", "배타적 부분집합"],
  },
  {
    id: "t-image-segmentation",
    term: "영상분할",
    en: "image segmentation",
    category: "개념",
    short: "영상의 화소를 군집화하여 영역을 나누는 문제.",
    definition:
      "영상의 각 화소를 하나의 데이터로 취급하고, 각 화소가 가진 색상값의 유사성에 따라 비슷한 화소끼리 묶어 영역을 나누는 문제. 군집화의 대표적인 응용이다.",
    example:
      "풍경 사진에서 하늘·나무·건물에 해당하는 화소가 각각 하나의 영역으로 묶이는 결과.",
    related: ["t-clustering", "t-kmeans"],
    lectures: [4],
    basis: "강의록 4강 군집화 적용의 예",
    emphasis:
      "화소를 데이터로 취급해 비슷한 화소를 묶는 영상 문제에 K-평균을 적용할 수 있다는 서술은 맞는 설명이다. 부정형 문항에서 이 선택지를 답으로 고르지 않도록 주의할 것.",
    aliases: ["image segmentation", "세그멘테이션", "영상 분할"],
  },
  {
    id: "t-labeling-cost",
    term: "클래스 레이블링 비용",
    en: "class labeling cost",
    category: "개념",
    short: "데이터에 클래스 레이블을 붙이는 데 드는 비용.",
    definition:
      "데이터 하나하나에 클래스 레이블을 사람이 붙여 주는 데 드는 시간과 노력. 데이터가 적을 때는 문제가 되지 않지만 데이터가 많아지면 레이블링 자체에 큰 비용이 든다.",
    role: "군집화를 쓰는 이유를 설명하는 근거. 레이블이 아예 없는 경우와 레이블링 비용이 많이 드는 경우가 군집화 적용이 가능한 데이터다.",
    related: ["t-clustering"],
    lectures: [4],
    basis: "강의록 4강 군집화 적용이 가능한 데이터",
    aliases: ["labeling cost", "레이블링 비용", "라벨링 비용"],
  },
  {
    id: "t-gaussian-mixture-model",
    term: "가우시안 혼합 모델",
    en: "Gaussian mixture model",
    category: "알고리즘",
    short: "각 군집을 하나의 가우시안 분포로 보고 전체를 그 혼합으로 표현하는 방법.",
    definition:
      "각 클러스터를 확률분포로 표현하는 관점의 군집화 방법으로, 군집화의 대표적 적용 방법 중 K-평균 군집화·계층적 군집화와 함께 제시된다.",
    role: "학습 결과를 각 클러스터의 확률분포로 남기는 쪽에 해당하며, 새 데이터가 어느 군집에 속하는지를 Prob(x_new ∈ Dᵢ)로 판단해 argmax를 취하는 추론 형태와 이어진다.",
    distinctions: [
      {
        from: "K-평균 군집화",
        how: "K-평균의 학습 결과는 각 클러스터의 대표 벡터, 즉 평균 하나뿐이다. 가우시안 혼합 모델은 분포의 모수를 추정해 각 군집이 어떻게 퍼져 있는지까지 남긴다.",
      },
    ],
    prereqs: ["pre-gaussian", "pre-pdf"],
    related: ["t-clustering", "t-kmeans"],
    lectures: [4],
    basis: "강의록 4강 군집화의 입출력 관계",
    aliases: ["Gaussian mixture model", "GMM", "가우시안 믹스처"],
  },

  /* ─────────── K-평균 군집화 ─────────── */
  {
    id: "t-kmeans",
    term: "K-평균 군집화",
    en: "K-means clustering",
    category: "알고리즘",
    short: "평균 정보를 활용해 데이터를 K개의 그룹으로 묶는 군집화 알고리즘.",
    definition:
      "주어진 데이터 집합을 평균 정보를 활용하여 K개의 그룹으로 묶는 알고리즘. K개의 초기 대표 벡터를 정한 뒤 데이터 그룹핑과 대표 벡터 수정을 반복하며, 학습 결과는 각 그룹에 속하는 데이터들의 평균, 즉 대표 벡터의 집합이다.",
    role: "군집화의 가장 대표적인 방법. 구현이 간단하고 이론적 분석도 잘 되어 있어 널리 쓰인다.",
    formula: [
      {
        expr: "① 시작(초기화) → ② 데이터 그룹핑 → ③ 대표 벡터 수정 → ④ 반복 여부 결정",
        note: "②~③을 반복하며, 반복 여부는 ④에서 판단한다",
      },
    ],
    distinctions: [
      {
        from: "K-최근접이웃(K-NN)",
        how: "이름의 K가 가리키는 대상이 다르다. K-평균의 K는 만들 군집의 개수이고, K-최근접이웃의 K는 판정에 참여시킬 이웃 데이터의 개수다. 또 K-평균은 레이블 없이 수행하는 비지도학습이고 K-최근접이웃은 이웃의 레이블로 판정하는 지도학습 분류기다.",
      },
      {
        from: "계층적 군집화",
        how: "K-평균은 군집의 개수 K를 미리 정해 놓고 시작하고, 계층적 군집화는 개수를 정하지 않은 채 계층 구조를 만든 뒤 덴드로그램을 보고 군집 수를 결정한다.",
      },
    ],
    prereqs: ["pre-mean-vector", "pre-euclidean"],
    related: [
      "t-representative-vector",
      "t-data-grouping",
      "t-centroid-update",
      "t-iteration-decision",
      "t-kmeans-objective",
      "t-kmeans-k-selection",
    ],
    lectures: [4],
    basis: "강의록 4강 K-평균 군집화 알고리즘",
    emphasis:
      "K-평균의 수행 결과를 표현하는 방법을 묻는 문항의 답은 각 클러스터의 대표 벡터다. 서로소인 부분집합과 확률분포도 군집화 일반의 결과 표현이지만, 평균 정보를 활용하는 K-평균이 직접 계산해 내는 것은 대표 벡터다.",
    aliases: ["K-means", "K-means clustering", "K-민즈", "케이평균", "케이민즈"],
  },
  {
    id: "t-representative-vector",
    term: "대표 벡터",
    en: "representative vector",
    category: "개념",
    short: "한 클러스터에 속하는 데이터들의 평균 벡터.",
    definition:
      "각 그룹에 속하는 데이터들의 평균으로, K-평균 군집화 알고리즘의 학습 결과에 해당한다. 데이터 그룹핑에서는 각 데이터가 어느 클러스터에 속할지를 정하는 기준점으로 쓰인다.",
    role: "K개의 대표 벡터 m₁,…,m_K가 특징 공간을 나누는 경계를 만들고, 새 데이터는 가장 가까운 대표 벡터의 클러스터에 속한다.",
    formula: [
      {
        expr: "m_k^new = (1 / |C_k|) Σ_{x_j ∈ C_k} x_j",
        note: "클러스터에 속한 데이터를 모두 더한 뒤 개수로 나눈 평균 벡터",
      },
    ],
    example:
      "클러스터에 (1, 2), (3, 4), (2, 0) 세 데이터가 있으면 대표 벡터는 ((1+3+2)/3, (2+4+0)/3) = (2, 2).",
    distinctions: [
      {
        from: "군집의 확률분포",
        how: "대표 벡터는 군집의 중심이 어디인지만 알려 주고, 데이터가 그 주위에 어떻게 흩어져 있는지는 담지 않는다. 흩어진 정도까지 표현하려면 확률분포로 나타내야 한다.",
      },
    ],
    prereqs: ["pre-mean-vector"],
    related: ["t-kmeans", "t-cluster", "t-centroid-update", "t-centroid-linkage"],
    lectures: [4],
    basis: "강의록 4강 K-평균 군집화 알고리즘",
    aliases: ["representative vector", "중심 벡터", "센트로이드", "centroid", "평균 벡터"],
  },
  {
    id: "t-data-grouping",
    term: "데이터 그룹핑",
    en: "data grouping",
    category: "개념",
    short: "각 데이터를 가장 가까운 대표 벡터의 클러스터에 배정하는 단계.",
    definition:
      "각 데이터 x_j에 대해 K개의 대표 벡터와의 거리 d(x_j, m_k)를 계산하고, 가장 가까운 대표 벡터 m_k의 클러스터 C_k에 속하도록 레이블링하여 데이터 집합을 K개의 클러스터로 나누는 K-평균의 두 번째 단계.",
    role: "대표 벡터가 고정된 상태에서 목적함수 J를 최소로 만드는 배정을 정하는 과정.",
    formula: [
      {
        expr: "C_k = { x_j | d(x_j, m_k) ≤ d(x_j, m_i), i = 1,…,K }",
        note: "다른 어떤 대표 벡터보다 m_k에 더 가깝거나 같은 데이터들의 모임",
      },
    ],
    prereqs: ["pre-euclidean", "pre-argmax-argmin"],
    related: ["t-kmeans", "t-centroid-update", "t-rni", "t-kmeans-objective"],
    lectures: [4],
    basis: "강의록 4강 K-평균 군집화 알고리즘",
    emphasis:
      "대표 벡터가 고정된 상태에서 r_ni를 결정하는 최적화가 곧 이 그룹핑 단계다. 두 관점을 K-평균의 두 단계와 짝짓는 문항에서 그룹핑의 짝은 언제나 'mᵢ 고정'이다.",
    aliases: ["data grouping", "그룹핑", "할당", "assignment"],
  },
  {
    id: "t-centroid-update",
    term: "대표 벡터 수정",
    en: "centroid update",
    category: "개념",
    short: "그룹핑 결과로 각 클러스터의 평균을 다시 계산해 대표 벡터를 갱신하는 단계.",
    definition:
      "데이터 그룹핑에서 구한 새로운 클러스터들에서 각각의 대표 벡터를 그 클러스터에 속한 데이터들의 평균으로 갱신하는 K-평균의 세 번째 단계.",
    role: "클러스터 레이블 r_ni가 고정된 상태에서 J를 mᵢ에 대해 편미분하여 0으로 두면 그대로 이 수정식이 나온다. 즉 배정을 그대로 둔 채 J를 더 줄이는 과정이다.",
    formula: [
      { expr: "m_k^new = (1 / |C_k|) Σ_{x_j ∈ C_k} x_j" },
      {
        expr: "∂J / ∂mᵢ = 0 ⇒ mᵢ = Σ_n r_ni x_n / Σ_n r_ni",
        note: "분모는 클러스터에 속하는 데이터의 개수, 분자는 그 데이터를 모두 더한 값이므로 평균 벡터가 된다",
      },
    ],
    prereqs: ["pre-mean-vector", "pre-partial-derivative", "pre-sigma"],
    related: ["t-kmeans", "t-data-grouping", "t-representative-vector", "t-kmeans-objective"],
    lectures: [4],
    basis: "강의록 4강 알고리즘의 특성",
    emphasis:
      "r_ni가 고정되어 있을 때 mᵢ를 구하는 과정은 그룹핑이 아니라 대표 벡터 수정식에 대응한다. 두 관점의 짝을 뒤바꿔 놓은 선택지가 자주 나온다.",
    aliases: ["centroid update", "대표벡터 갱신", "평균 갱신", "update step"],
  },
  {
    id: "t-iteration-decision",
    term: "반복 여부 결정",
    en: "convergence check",
    category: "개념",
    short: "대표 벡터의 변화량을 보고 반복을 계속할지 판단하는 단계.",
    definition:
      "수정 전의 대표 벡터 m_k와 수정 후의 대표 벡터 m_k^new의 차이를 계산하여, 그 값에 변화가 없거나 설정된 반복 횟수에 도달할 때까지 데이터 그룹핑과 대표 벡터 수정을 반복하도록 하는 K-평균의 네 번째 단계.",
    role: "알고리즘의 종료 조건. 대표 벡터가 더 이상 움직이지 않으면 배정도 바뀌지 않으므로 목적함수 J도 더 줄지 않는다.",
    formula: [
      { expr: "‖m_k^new − m_k‖ 에 변화 없음 → 종료", note: "또는 설정된 반복 횟수 도달" },
    ],
    prereqs: ["pre-norm"],
    related: ["t-kmeans", "t-centroid-update", "t-kmeans-objective"],
    lectures: [4],
    basis: "강의록 4강 K-평균 군집화 알고리즘",
    aliases: ["convergence", "수렴 판정", "종료 조건", "반복 조건"],
  },
  {
    id: "t-kmeans-objective",
    term: "목적함수 J",
    en: "objective function",
    category: "수식·지표",
    short: "각 데이터와 자신이 속한 클러스터 대표 벡터 사이 거리 제곱의 총합.",
    definition:
      "K-평균 군집화 알고리즘이 줄여 나가는 값으로, 각 데이터 x_n과 그 데이터가 속한 클러스터의 대표 벡터 mᵢ 사이 거리의 제곱을 모두 더한 것. 각 클러스터 Cᵢ의 분산을 모두 더한 값에 해당한다.",
    role: "군집화는 결과가 잘된 것인지 평가하기가 분류처럼 명확하지 않으므로, 목적함수를 정의하고 반복 수행이 그 값을 줄여 나가는지로 성능을 대신 확인한다.",
    formula: [
      { expr: "J = Σ_{n=1}^{N} Σ_{i=1}^{K} r_ni ‖x_n − mᵢ‖²", note: "거리의 제곱을 더한다" },
      { expr: "J ↑ → 각 클러스터 내의 데이터들이 서로 뭉쳐 있지 않음" },
      { expr: "J ↓ → 각 클러스터 내에서는 데이터들이 잘 결집되어 있음" },
    ],
    example:
      "대표 벡터 m = (1.5, 1.7)에 데이터 (1.0, 1.5)가 배정되면 이 데이터가 J에 더하는 몫은 (1.0 − 1.5)² + (1.5 − 1.7)² = 0.29.",
    distinctions: [
      {
        from: "클러스터 사이의 거리",
        how: "J의 식에 들어가는 거리는 데이터와 자신이 속한 클러스터 대표 벡터 사이의 거리다. 서로 다른 클러스터 사이의 거리는 이 식에 등장하지 않는다.",
      },
    ],
    prereqs: ["pre-sigma", "pre-norm", "pre-variance"],
    related: ["t-rni", "t-data-grouping", "t-centroid-update", "t-local-minimum"],
    lectures: [4],
    basis: "강의록 4강 알고리즘의 특성",
    emphasis:
      "J는 거리의 제곱합이지 제곱근을 씌운 거리의 합이 아니다. 그리고 J가 크다는 것은 데이터가 퍼져 있다는 뜻이므로, J가 클수록 잘 결집되어 있다고 뒤집어 쓴 선택지는 틀린 것이다.",
    aliases: ["objective function", "J", "비용함수", "cost function", "SSE"],
  },
  {
    id: "t-rni",
    term: "클러스터 레이블 r_ni",
    en: "cluster indicator",
    category: "수식·지표",
    short: "데이터 x_n이 클러스터 i에 속하면 1, 아니면 0인 지시값.",
    definition:
      "목적함수 J에서 각 데이터가 어느 클러스터에 속하는지를 나타내는 값으로, 데이터 x_n에 가장 가까운 대표 벡터가 mᵢ일 때만 1이고 나머지는 0이다.",
    role: "대표 벡터 mᵢ와 함께 J의 값을 결정하는 두 파라미터 중 하나. r_ni를 정하는 것이 곧 데이터 그룹핑이다.",
    formula: [
      { expr: "r_ni = 1 if i = argmin_j ‖x_n − m_j‖², else 0" },
      {
        expr: "Σ_n r_ni = i번째 클러스터에 속하는 데이터의 개수",
        note: "0과 1만 갖는 값을 모든 데이터에 대해 더한 결과",
      },
    ],
    distinctions: [
      {
        from: "소속 확률",
        how: "r_ni는 0 아니면 1 두 값만 갖는 지시값이므로 확률이 아니다. 소속 확률로 표현하는 것은 각 클러스터를 확률분포로 보는 가우시안 혼합 모델 쪽 관점이다.",
      },
    ],
    prereqs: ["pre-argmax-argmin", "pre-norm"],
    related: ["t-kmeans-objective", "t-data-grouping", "t-centroid-update"],
    lectures: [4],
    basis: "강의록 4강 알고리즘의 특성",
    aliases: ["r_ni", "rni", "cluster indicator", "지시변수", "클러스터 레이블"],
  },
  {
    id: "t-local-minimum",
    term: "지역 극소점",
    en: "local minimum",
    category: "개념",
    short: "주변보다는 낮지만 전체에서 가장 낮다고는 할 수 없는 지점.",
    definition:
      "목적함수를 줄여 나가다가 도달하는, 그 주변에서 가장 작은 값을 갖는 지점. K-평균 군집화 알고리즘은 데이터 그룹핑과 대표 벡터 수정의 반복을 통해 목적함수 J를 극소화하는 지역 극소점을 찾는 것을 보장한다.",
    role: "반복 수행이 무엇을 보장하는지의 답. 한 번 반복할 때마다 J의 값이 줄어드는 방향으로 학습이 진행됨은 보장되지만, 그 도착지는 지역 극소점까지다.",
    distinctions: [
      {
        from: "전역 극소점",
        how: "지역 극소점은 주변만 보면 가장 낮은 곳이고, 전역 극소점은 전체 공간에서 가장 낮은 곳이다. K-평균이 보장하는 것은 앞쪽이며, 어느 지역 극소점에 도착하는지는 초기 대표 벡터가 정한다.",
      },
    ],
    prereqs: ["pre-local-global-min"],
    related: ["t-global-minimum", "t-kmeans-objective", "t-initialization-dependence"],
    lectures: [4],
    basis: "강의록 4강 알고리즘의 특성",
    emphasis:
      "K-평균이 보장하는 것은 지역 극소점까지다. 전역 극소점을 항상 찾는다고 서술한 선택지는 틀린 것이다.",
    aliases: ["local minimum", "국소 최솟값", "지역 최소점", "로컬 미니멈"],
  },
  {
    id: "t-global-minimum",
    term: "전역 극소점",
    en: "global minimum",
    category: "개념",
    short: "전체 공간에서 목적함수 값이 가장 작은 지점.",
    definition:
      "목적함수가 정의된 전체 공간에서 가장 작은 값을 갖는 지점. K-평균 군집화 알고리즘은 시작점인 초기 대표 벡터에 따라 결과가 달라지므로 전역 극소점을 찾는 것을 보장하지 못한다.",
    role: "K-평균이 보장하지 못하는 것의 이름. 이 한계가 초기값 의존성 문제와 직접 이어진다.",
    prereqs: ["pre-local-global-min"],
    related: ["t-local-minimum", "t-kmeans-objective", "t-initialization-dependence"],
    lectures: [4],
    basis: "강의록 4강 알고리즘의 특성",
    aliases: ["global minimum", "전역 최솟값", "전체 최소점", "글로벌 미니멈"],
  },
  {
    id: "t-initialization-dependence",
    term: "초기값 의존성",
    en: "initialization dependence",
    category: "개념",
    short: "초기 대표 벡터를 어떻게 잡느냐에 따라 최종 결과가 달라지는 성질.",
    definition:
      "초기에 임의로 결정하는 대표 벡터에 따라 K-평균 군집화의 최종적인 결과가 달라지는 문제. 같은 데이터라도 어떤 초기값에서는 일곱 번 반복 후, 다른 초기값에서는 두 번 반복 후 수렴하며, 심한 경우 적절한 클러스터를 찾지 못하기도 한다.",
    role: "실제 문제에 K-평균을 적용할 때 고려해야 할 세 가지 중 두 번째 사항.",
    example:
      "초기값을 설정하는 방법으로는 랜덤하게 임의로 정하는 방법, 어느 정도 거리가 떨어진 데이터를 고르는 방법, 입력 공간을 영역으로 나눈 뒤 각 영역에서 하나씩 고르는 방법, 초기값을 바꿔 가며 여러 번 수행하고 그중 좋은 결과를 선택하는 방법이 있다. K-평균은 학습에 시간이 많이 걸리지 않아 마지막 방법이 현실적으로 많이 쓰인다.",
    prereqs: ["pre-local-global-min"],
    related: ["t-local-minimum", "t-global-minimum", "t-kmeans", "t-kmeans-k-selection"],
    lectures: [4],
    basis: "강의록 4강 알고리즘의 특성",
    emphasis:
      "초기 대표 벡터와 무관하게 항상 같은 결과를 낸다는 서술은 사실과 정반대다. 초기값에 따라 반복 횟수도, 최종 군집도 달라진다.",
    aliases: ["initialization", "초기화 의존", "초기 대표 벡터 의존성"],
  },
  {
    id: "t-kmeans-k-selection",
    term: "K값 선택",
    en: "choice of K",
    category: "개념",
    short: "몇 개의 군집으로 나눌지를 학습 전에 정하는 문제.",
    definition:
      "데이터에 의존하는 적절한 K값을 어떻게 선택할 것인가 하는 문제. 적절한 K값의 선정은 주어진 문제에 지극히 의존하며, 다양한 K값에 대해 군집화 결과들을 비교하여 모델을 선택하거나 계층적 군집화 알고리즘을 사용하는 방법이 제시된다.",
    role: "실제 문제에 K-평균을 적용할 때 고려해야 할 세 가지 중 세 번째 사항이자, 계층적 군집화로 넘어가는 이유.",
    distinctions: [
      {
        from: "학습으로 정해지는 파라미터",
        how: "대표 벡터는 반복 수행을 통해 학습으로 얻어지지만, K는 학습이 시작되기 전에 사람이 문제의 성격을 보고 정하는 값이다.",
      },
    ],
    related: ["t-kmeans", "t-hierarchical-clustering", "t-cluster-count-decision", "t-knn-k-selection"],
    lectures: [4],
    basis: "4강 공식 연습문제 Q3",
    emphasis:
      "K가 학습을 통해 결정되는 군집의 개수라는 서술은 적절하지 못한 설명이다. K는 학습과 무관하게 문제의 성격에 따라 미리 정하는 값이고, 그 선택이 중요한 고려사항이라는 것이 강의의 요지다.",
    aliases: ["choice of K", "K 결정", "군집 개수 선택", "하이퍼파라미터 K"],
  },

  /* ─────────── 계층적 군집화 ─────────── */
  {
    id: "t-hierarchical-clustering",
    term: "계층적 군집화",
    en: "hierarchical clustering",
    category: "알고리즘",
    short: "큰 군집이 작은 군집을 포함하도록 계층 구조를 만드는 군집화 방법.",
    definition:
      "전체 데이터를 몇 개의 배타적인 그룹으로 나누는 대신, 큰 군집이 작은 군집을 포함하는 형태로 계층을 이루도록 군집화를 수행하여 그 구조를 살펴보는 방법.",
    role: "K-평균은 적절한 K를 결정하기 어렵다는 문제가 있으므로, 클러스터의 개수를 미리 정해 놓지 않고 군집화를 수행하는 대안으로 쓰인다.",
    distinctions: [
      {
        from: "K-평균 군집화",
        how: "K-평균은 군집 수 K를 미리 정해 놓고 데이터를 배타적인 K개 그룹으로 나눈다. 계층적 군집화는 개수를 정하지 않고 계층 구조를 만든 뒤, 덴드로그램을 보고 나중에 군집 수를 읽어 낸다.",
      },
    ],
    related: ["t-agglomerative", "t-divisive", "t-dendrogram", "t-inter-cluster-distance"],
    lectures: [4],
    basis: "강의록 4강 계층적 군집화 알고리즘",
    emphasis:
      "고려사항은 두 가지다. 군집 간의 거리를 어떤 방식으로 계산할 것인가, 그리고 덴드로그램에서 적절한 군집의 수를 어떻게 결정할 것인가.",
    aliases: ["hierarchical clustering", "계층 군집화", "계층적 클러스터링"],
  },
  {
    id: "t-agglomerative",
    term: "병합적 방법",
    en: "agglomerative, bottom-up",
    category: "알고리즘",
    short: "각 데이터가 하나의 군집인 상태에서 시작해 가까운 것끼리 합쳐 올라가는 방법.",
    definition:
      "각 데이터가 하나의 군집을 이루는 최소 군집에서 시작하여, 가까운 군집끼리 단계적으로 병합하여 더 큰 군집을 만들어 가는 계층적 군집화 방법. N개의 데이터에 대해 (N − 1)번의 병합 과정을 수행한다.",
    role: "분할적 방법이 비실용적이므로 계층적 군집화에서 실제로 사용하는 접근.",
    formula: [
      { expr: "① N개의 군집 C₁, C₂, …, C_N을 설정" },
      { expr: "② 가능한 모든 군집 쌍에 대해 군집 간의 거리를 계산" },
      { expr: "③ 거리가 가장 가까운 두 군집 Cᵢ, Cⱼ를 병합하여 Cᵢⱼ = Cᵢ ∪ Cⱼ 생성" },
      { expr: "④ Cᵢⱼ를 클러스터 풀에 넣고 원래 Cᵢ, Cⱼ를 제거" },
      { expr: "⑤ 오직 하나의 클러스터가 남을 때까지 ②~⑤를 반복" },
    ],
    example:
      "1차원 데이터 A = 1, B = 3, C = 9, D = 12에 최단연결법을 적용하면 거리 2에서 A와 B가, 거리 3에서 C와 D가, 거리 6에서 두 군집이 병합되어 병합이 모두 세 번 일어난다.",
    distinctions: [
      {
        from: "분할적 방법",
        how: "병합적 방법은 N개의 군집에서 시작해 1개가 될 때까지 아래에서 위로 합치고, 분할적 방법은 1개의 군집에서 시작해 위에서 아래로 나눈다. 시작 상태의 군집 개수가 정반대다.",
      },
    ],
    related: ["t-divisive", "t-hierarchical-clustering", "t-dendrogram", "t-inter-cluster-distance"],
    lectures: [4],
    basis: "4강 공식 연습문제 Q5",
    emphasis:
      "데이터가 N개이면 초기 군집도 N개이고 병합 횟수는 N − 1번이다. 초기 군집 개수를 묻는 문항에서 1은 분할적 방법의 시작이고, 덴드로그램을 잘라 읽은 군집 수와도 다른 값이다.",
    aliases: ["agglomerative", "bottom-up", "상향식", "병합 방법"],
  },
  {
    id: "t-divisive",
    term: "분할적 방법",
    en: "divisive, top-down",
    category: "알고리즘",
    short: "모든 데이터가 한 군집인 상태에서 시작해 쪼개 내려가는 방법.",
    definition:
      "N개의 모든 데이터가 하나의 군집에 속하는 최대 군집에서 시작하여, 특정 기준에 따라 군집들을 분할해 가는 계층적 군집화 방법.",
    role: "개념상 병합적 방법의 반대 방향이지만, 한 번 나누는 경우의 수만 해도 폭발적으로 늘어나 비실용적이라고 평가된다.",
    formula: [
      {
        expr: "N개로 이루어진 하나의 군집을 두 군집으로 분할하는 경우의 수 = 2^(N−1) − 1",
        note: "N = 4이면 7, N = 10이면 511, N = 20이면 524287",
      },
    ],
    distinctions: [
      {
        from: "병합적 방법",
        how: "분할적 방법은 하향식이고 군집 1개에서 출발한다. 병합적 방법은 상향식이고 군집 N개에서 출발한다.",
      },
    ],
    related: ["t-agglomerative", "t-hierarchical-clustering"],
    lectures: [4],
    basis: "강의록 4강 계층적 군집화 알고리즘",
    emphasis:
      "2^(N−1) − 1은 분할의 경우의 수이고 N − 1은 병합적 방법의 병합 횟수다. 두 수를 맞바꿔 놓은 선택지가 나온다.",
    aliases: ["divisive", "top-down", "하향식", "분할 방법"],
  },
  {
    id: "t-dendrogram",
    term: "덴드로그램",
    en: "dendrogram",
    category: "개념",
    short: "계층적인 군집화 결과를 보여 주는 나무 모양의 그림.",
    definition:
      "계층적인 군집화 결과를 보여 주는 그림. 가로축에는 데이터가 놓이고 세로축은 군집 간의 거리를 나타내며, 두 군집이 병합된 높이가 그때의 군집 간 거리가 된다.",
    role: "군집 수를 미리 정하지 않고도 적절한 군집의 수를 읽어 낼 수 있게 해 주는 결과 표현.",
    example:
      "A = 1, B = 3, C = 9, D = 12에 최단연결법을 적용하면 A·B가 높이 2에서, C·D가 높이 3에서, 두 군집이 높이 6에서 이어지는 덴드로그램이 그려진다.",
    related: ["t-agglomerative", "t-cluster-count-decision", "t-inter-cluster-distance"],
    lectures: [4],
    basis: "강의록 4강 병합적 방법의 수행 과정 예",
    emphasis:
      "세로축은 데이터 개수나 군집 번호가 아니라 군집 간의 거리다. 가로선의 높이를 거리로 읽지 못하면 군집 수를 결정하는 문항을 풀 수 없다.",
    aliases: ["dendrogram", "덴드로그램", "계통도", "트리 다이어그램"],
  },
  {
    id: "t-inter-cluster-distance",
    term: "군집 간의 거리",
    en: "inter-cluster distance",
    category: "개념",
    short: "두 군집이 얼마나 떨어져 있는지를 하나의 값으로 나타낸 것.",
    definition:
      "병합적 방법에서 어느 두 군집을 먼저 합칠지 정하기 위해 계산하는 값. 군집에는 데이터가 여러 개 들어 있으므로 어떤 데이터 쌍을 기준으로 삼느냐에 따라 최단연결법·최장연결법·중심연결법·평균연결법·Ward's 방법으로 나뉜다.",
    role: "계층적 군집화 알고리즘에서 고려해야 할 첫 번째 사항. 어떤 방식을 쓰느냐에 따라 병합 순서와 덴드로그램의 모양이 달라진다.",
    prereqs: ["pre-euclidean"],
    related: [
      "t-single-linkage",
      "t-complete-linkage",
      "t-centroid-linkage",
      "t-average-linkage",
      "t-ward-linkage",
      "t-dendrogram",
    ],
    lectures: [4],
    basis: "강의록 4강 계층적 군집화 알고리즘의 특성",
    aliases: ["linkage", "연결법", "군집 거리", "inter-cluster distance"],
  },
  {
    id: "t-single-linkage",
    term: "최단연결법",
    en: "minimum / single linkage",
    category: "수식·지표",
    short: "두 군집에서 가장 가까운 데이터 쌍 사이의 거리를 군집 간 거리로 삼는 방식.",
    definition:
      "두 군집에 속하는 데이터 쌍 중 가장 가까운 쌍의 거리를 군집 간의 거리로 정의하는 방식. 고립된 군집을 찾는 데 유용하다는 특징이 있다.",
    formula: [{ expr: "d(Cᵢ, Cⱼ) = min_{xᵢ∈Cᵢ, xⱼ∈Cⱼ} d(xᵢ, xⱼ)" }],
    example:
      "Cᵢ = {1, 3}, Cⱼ = {9, 12}이면 |9 − 3| = 6, |12 − 3| = 9, |9 − 1| = 8, |12 − 1| = 11 중 가장 작은 6이 군집 간의 거리.",
    distinctions: [
      {
        from: "최장연결법",
        how: "최단연결법은 가장 가까운 데이터 쌍을, 최장연결법은 가장 멀리 떨어진 데이터 쌍을 본다. 그래서 최단연결법은 군집이 한 데이터씩 길게 이어 붙는 모양이 되어 고립된 군집을 드러내는 데 유용하고, 최장연결법은 군집 전체가 좁게 모여 있어야 병합되므로 응집된 군집을 찾는 데 중점을 둔다.",
      },
    ],
    prereqs: ["pre-euclidean", "pre-argmax-argmin"],
    related: ["t-complete-linkage", "t-inter-cluster-distance", "t-outlier"],
    lectures: [4],
    basis: "강의록 4강 계층적 군집화 알고리즘의 특성",
    emphasis:
      "특징을 짝짓는 문항에서 최단연결법의 자리는 고립된 군집이다. 응집된 군집은 최장연결법, 특이값에 강건은 중심연결법, 작은 분산은 평균연결법, 비슷한 크기의 군집은 Ward's 방법이다.",
    aliases: ["single linkage", "minimum linkage", "최소연결법", "단일연결법"],
  },
  {
    id: "t-complete-linkage",
    term: "최장연결법",
    en: "maximum / complete linkage",
    category: "수식·지표",
    short: "두 군집에서 가장 멀리 떨어진 데이터 쌍 사이의 거리를 군집 간 거리로 삼는 방식.",
    definition:
      "두 군집에 속하는 데이터 쌍 중 가장 멀리 떨어진 쌍의 거리를 군집 간의 거리로 정의하는 방식. 응집된 군집을 찾는 데 중점을 둔다는 특징이 있다.",
    formula: [{ expr: "d(Cᵢ, Cⱼ) = max_{xᵢ∈Cᵢ, xⱼ∈Cⱼ} d(xᵢ, xⱼ)" }],
    example:
      "Cᵢ = {1, 3}, Cⱼ = {9, 12}이면 네 쌍의 거리 6, 9, 8, 11 중 가장 큰 11이 군집 간의 거리.",
    distinctions: [
      {
        from: "최단연결법",
        how: "같은 데이터에 두 방식을 적용하면 군집 간 거리가 정반대의 극단값으로 잡히므로 병합 순서와 덴드로그램의 모양이 달라진다. 두 방식 모두 데이터 쌍 하나에 의해 거리가 정해진다는 점은 같다.",
      },
    ],
    prereqs: ["pre-euclidean", "pre-argmax-argmin"],
    related: ["t-single-linkage", "t-inter-cluster-distance", "t-outlier"],
    lectures: [4],
    basis: "강의록 4강 계층적 군집화 알고리즘의 특성",
    aliases: ["complete linkage", "maximum linkage", "최대연결법", "완전연결법"],
  },
  {
    id: "t-centroid-linkage",
    term: "중심연결법",
    en: "centroid linkage",
    category: "수식·지표",
    short: "두 군집의 평균 사이의 거리를 군집 간 거리로 삼는 방식.",
    definition:
      "각 군집에 속하는 데이터들의 평균 mᵢ, mⱼ를 구한 뒤 두 평균 사이의 거리를 군집 간의 거리로 정의하는 방식. 특이값에 강건하다는 특징이 있다.",
    role: "특정한 하나의 데이터에 의존해 거리가 계산되는 최단·최장연결법의 약점을 피하려는 방법.",
    formula: [
      { expr: "d(Cᵢ, Cⱼ) = d(mᵢ, mⱼ)" },
      { expr: "mᵢ = (1 / |Cᵢ|) Σ_{x∈Cᵢ} x,  mⱼ = (1 / |Cⱼ|) Σ_{x∈Cⱼ} x" },
    ],
    example: "Cᵢ = {1, 3}의 평균은 2, Cⱼ = {9, 12}의 평균은 10.5이므로 군집 간의 거리는 8.5.",
    distinctions: [
      {
        from: "평균연결법",
        how: "중심연결법은 두 평균 사이의 거리 하나를 재고, 평균연결법은 모든 데이터 쌍의 거리를 구한 뒤 그 평균을 낸다. 평균은 군집의 중심이 어디인지만 알려 주고 데이터가 어떻게 흩어져 있는지는 담지 못하므로, 그 점을 보완한 것이 평균연결법이다.",
      },
    ],
    prereqs: ["pre-mean-vector", "pre-euclidean"],
    related: ["t-average-linkage", "t-representative-vector", "t-inter-cluster-distance"],
    lectures: [4],
    basis: "강의록 4강 계층적 군집화 알고리즘의 특성",
    emphasis:
      "중심연결법의 특징은 특이값에 강건이다. 비슷한 크기의 군집을 병합한다는 특징은 Ward's 방법의 것이므로, 이 둘을 바꿔 짝지은 선택지가 잘못된 짝이다.",
    aliases: ["centroid linkage", "중심 연결", "평균 간 거리"],
  },
  {
    id: "t-average-linkage",
    term: "평균연결법",
    en: "mean / average linkage",
    category: "수식·지표",
    short: "두 군집의 모든 데이터 쌍 거리의 평균을 군집 간 거리로 삼는 방식.",
    definition:
      "두 군집에 속하는 모든 데이터 쌍에 대해 거리를 구한 뒤 그 평균을 군집 간의 거리로 정의하는 방식. 작은 분산을 가지는 군집을 형성한다는 특징이 있다.",
    role: "군집의 중심만 보는 중심연결법이 데이터가 흩어진 정도를 담지 못하는 점을 보완한 방법.",
    formula: [
      { expr: "d(Cᵢ, Cⱼ) = (1 / |Cᵢ||Cⱼ|) Σ_{xᵢ∈Cᵢ} Σ_{xⱼ∈Cⱼ} d(xᵢ, xⱼ)" },
    ],
    example:
      "Cᵢ = {1, 3}, Cⱼ = {9, 12}이면 네 쌍의 거리 6, 9, 8, 11의 평균인 8.5가 군집 간의 거리.",
    prereqs: ["pre-sigma", "pre-euclidean"],
    related: ["t-centroid-linkage", "t-inter-cluster-distance"],
    lectures: [4],
    basis: "강의록 4강 계층적 군집화 알고리즘의 특성",
    aliases: ["average linkage", "mean linkage", "평균 연결", "UPGMA"],
  },
  {
    id: "t-ward-linkage",
    term: "Ward's 방법",
    en: "Ward's method",
    category: "수식·지표",
    short: "병합한 뒤 클러스터 내부에 생기는 분산값을 군집 간 거리로 삼는 방식.",
    definition:
      "두 군집을 합쳤을 때의 평균 m을 기준으로 각 군집의 평균이 얼마나 떨어지는지를 군집의 크기로 가중해 더한 값을 군집 간의 거리로 정의하는 방식. 병합 후의 클러스터 내부의 분산값을 뜻하며, 비슷한 크기의 군집을 병합한다는 특징이 있다.",
    role: "군집 간의 거리를 계산할 때 군집의 크기 정보까지 함께 이용하는 방법.",
    formula: [
      { expr: "d(Cᵢ, Cⱼ) = |Cᵢ| ‖mᵢ − m‖² + |Cⱼ| ‖mⱼ − m‖²" },
      {
        expr: "m = (1 / (|Cᵢ| + |Cⱼ|)) Σ_{x ∈ Cᵢ∪Cⱼ} x",
        note: "m은 두 군집을 합친 집합의 평균",
      },
    ],
    example:
      "Cᵢ = {1, 3}, Cⱼ = {9, 12}이면 mᵢ = 2, mⱼ = 10.5, m = 6.25이므로 d = 2 × (2 − 6.25)² + 2 × (10.5 − 6.25)² = 72.25.",
    prereqs: ["pre-mean-vector", "pre-norm", "pre-variance"],
    related: ["t-centroid-linkage", "t-inter-cluster-distance"],
    lectures: [4],
    basis: "강의록 4강 계층적 군집화 알고리즘의 특성",
    emphasis:
      "다섯 연결법 가운데 값의 단위가 다른 유일한 방식이다. 나머지 넷은 거리이지만 Ward's 방법은 거리의 제곱에 군집 크기를 곱한 분산값이므로 수치가 훨씬 크게 나온다.",
    aliases: ["Ward", "Ward's method", "워드 방법", "와드 연결법"],
  },
  {
    id: "t-outlier",
    term: "아웃라이어",
    en: "outlier",
    category: "개념",
    short: "그 군집의 특성에서 동떨어진 데이터.",
    definition:
      "어떤 군집의 특성에 대해 동떨어져 있는 데이터. 최단연결법과 최장연결법은 각각 가장 가까운 데이터 쌍과 가장 멀리 떨어진 데이터 쌍 하나로 군집 간의 거리를 정하므로, 이런 데이터 하나에 영향을 받게 된다.",
    role: "중심연결법과 평균연결법이 등장하는 이유. 특정한 하나의 데이터에 의존해 거리가 계산되는 것을 피하려고 두 군집의 평균 간 거리나 모든 쌍 거리의 평균을 쓴다.",
    related: ["t-single-linkage", "t-complete-linkage", "t-centroid-linkage", "t-average-linkage"],
    lectures: [4],
    basis: "강의록 4강 계층적 군집화 알고리즘의 특성",
    emphasis:
      "특이값에 강건하다는 특징이 붙는 것은 중심연결법이다. 최단·최장연결법은 강건한 쪽이 아니라 영향을 받는 쪽이다.",
    aliases: ["outlier", "특이값", "이상치", "이상값"],
  },
  {
    id: "t-cluster-count-decision",
    term: "군집 수 결정",
    en: "determining the number of clusters",
    category: "개념",
    short: "덴드로그램에서 군집 수가 오래 유지되는 구간을 골라 K를 정하는 방법.",
    definition:
      "덴드로그램으로부터 적합한 군집의 수를 결정하는 방법으로, 클러스터 간의 거리가 증가하는 동안 클러스터 수의 변화 없이 일정 기간 유지되는 지점을 선택한다.",
    role: "군집 수를 미리 정하지 않는 계층적 군집화가 최종적으로 K를 내놓는 방식이자, K-평균의 K 선택 문제에 대한 한 가지 대답.",
    example:
      "A = 1, B = 3, C = 9, D = 12 예제에서 병합 높이는 2, 3, 6이다. 거리 0~2 구간은 군집 4개, 2~3 구간은 3개, 3~6 구간은 2개가 유지되므로 가장 길게 유지되는 3~6 구간을 골라 K = 2로 정한다.",
    distinctions: [
      {
        from: "목적함수 J가 가장 작아지는 K를 고르기",
        how: "J는 K가 커질수록 계속 줄어들어 데이터 개수만큼 군집을 만드는 극단으로 가므로 K를 정하는 기준이 될 수 없다. 게다가 J는 K-평균의 목적함수여서 덴드로그램을 읽는 기준과는 무관하다.",
      },
    ],
    related: ["t-dendrogram", "t-hierarchical-clustering", "t-kmeans-k-selection"],
    lectures: [4],
    basis: "강의록 4강 계층적 군집화 알고리즘의 특성",
    emphasis:
      "기준은 유지되는 구간의 길이이지 병합이 일어난 순서가 아니다. 가장 먼저 병합된 높이에서 자르라는 선택지는 유지 구간을 전혀 보지 않은 기준이다.",
    aliases: ["number of clusters", "군집의 수", "클러스터 개수 결정", "절단선"],
  },
];
