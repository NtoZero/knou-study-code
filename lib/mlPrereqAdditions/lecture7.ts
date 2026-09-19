import type { PrereqEntry } from "@/lib/mlPrereqs";

/** 7강에서 새로 필요한 선행 개념 */
export const lecture7Prereqs: PrereqEntry[] = [
  {
    id: "pre-proportion",
    term: "비율 (상대도수)",
    en: "proportion / relative frequency",
    area: "확률과 통계",
    chapter: "3장 데이터 분포: 확률과 통계",
    short: "전체 개수 가운데 어떤 그룹이 차지하는 몫. 개수 ÷ 전체 개수.",
    why: "지니 불순도의 pᵢ, 지니 평가지수의 가중치 |Cᵢ|/|R_a|, 회귀 트리의 리프 출력(1의 개수 ÷ 전체)이 모두 비율이다. 개수를 그대로 넣으면 식이 틀어진다.",
    definition:
      "전체 n개 가운데 어떤 조건을 만족하는 것이 k개일 때 k/n. 0과 1 사이의 값이며, 모든 그룹의 비율을 더하면 1이 된다. 표본에서 구한 비율은 그 그룹이 나올 확률의 추정값으로 쓸 수 있다.",
    formula: [
      { expr: "pᵢ = nᵢ / n", note: "nᵢ: i번째 클래스의 개수, n: 노드의 전체 데이터 개수" },
      { expr: "Σᵢ pᵢ = 1" },
    ],
    example: {
      setup: "노드에 ON 3개, OFF 2개가 있을 때",
      work: ["전체 n = 5", "p_ON = 3/5 = 0.6", "p_OFF = 2/5 = 0.4", "합 0.6 + 0.4 = 1"],
      result: "지니 불순도 = 1 − 0.6² − 0.4² = 0.48",
    },
    usedIn: [
      { lecture: 7, where: "지니 불순도의 pᵢ, 지니 평가지수의 가중치 |Cᵢ|/|R_a|, 회귀 트리 리프의 평균값" },
    ],
    pitfall:
      "지니 평가지수의 가중치는 부모 노드 전체(|R_a|) 대비 자식 노드 데이터 개수의 비율이다. 자식 노드 수로 나누는 단순 평균과 헷갈리지 말 것.",
  },
  {
    id: "pre-log-base2",
    term: "밑이 2인 로그",
    en: "logarithm base 2",
    area: "미분과 수식 표기",
    short: "2를 몇 번 곱해야 그 수가 되는지. log₂ 8 = 3.",
    why: "엔트로피 H = −Σ pᵢ log₂ pᵢ를 계산하려면 1보다 작은 비율의 로그 값이 음수라는 점과, 0·log 0을 0으로 두는 약속을 알아야 한다.",
    definition:
      "log₂ x는 2^y = x를 만족하는 y. x = 1이면 0, 0 < x < 1이면 음수다. 그래서 비율 pᵢ(0~1)의 로그는 음수이고, 엔트로피 식 앞의 마이너스 부호가 전체를 양수로 만든다. 다른 밑의 로그로 바꿀 때는 log₂ x = ln x / ln 2.",
    formula: [
      { expr: "log₂ x = ln x / ln 2" },
      { expr: "log₂ 1 = 0,  log₂ (1/2) = −1" },
      { expr: "0 · log₂ 0 = 0 으로 약속", note: "한 클래스만 있는 노드의 엔트로피가 0이 되는 이유" },
    ],
    example: {
      setup: "두 클래스가 반반(p = 0.5, 0.5)인 노드의 엔트로피",
      work: ["log₂ 0.5 = −1", "−(0.5 × −1) − (0.5 × −1) = 0.5 + 0.5"],
      result: "H = 1 (두 클래스일 때 최댓값). 한 클래스만 있으면 H = 0",
    },
    usedIn: [{ lecture: 7, where: "엔트로피와 정보 이득 — 분할 전후의 혼잡도 차이" }],
    pitfall: "비율의 로그는 음수이므로 −Σ를 빼먹으면 엔트로피가 음수로 나온다.",
  },
];

/** 이미 있는 선행 개념이 7강에서 쓰이는 자리 */
export const lecture7PrereqUsages: { id: string; where: string }[] = [
  { id: "pre-sigma", where: "지니 불순도 1 − Σpᵢ²와 지니 평가지수 Σ(|Cᵢ|/|R_a|)·I(Cᵢ)" },
  { id: "pre-argmax-argmin", where: "지니 평가지수가 최소인 속성을 루트·내부 노드에 배정" },
  { id: "pre-variance", where: "분산 감소량, 회귀 트리 노드의 제곱오차" },
  { id: "pre-exp-log", where: "엔트로피 −Σ pᵢ log₂ pᵢ의 로그" },
  { id: "pre-weighted-average", where: "지니 평가지수(자식 노드 불순도의 가중합)와 분산의 가중평균" },
  { id: "pre-sampling-with-replacement", where: "랜덤 포레스트에서 i번째 트리의 데이터 집합 Xᵢ를 복원추출로 생성" },
];
