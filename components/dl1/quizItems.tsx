import Image from "next/image";
import type { OfficialQuizItem } from "@/components/dlShared/Quiz";

/** U-KNOU 딥러닝 1강 공식 연습문제. 보기 순서와 정답은 학습창 기준. */
export const QUIZZES: OfficialQuizItem[] = [
  {
    q: "다음 중 인공 신경망에 대한 설명으로 옳은 것은?",
    choices: [
      "뉴런은 CPU와 같이 다양한 명령을 실행할 수 있는 프로세서이다.",
      "인공 뉴런은 생물학적 뉴런과 동일한 처리 구조를 구현한 것이다.",
      "뉴런의 활성함수는 비선형 특성을 갖는 함수를 사용하는 것이 일반적이다.",
      "뉴런의 가중치는 설계자가 주어진 문제에 맞게 직접 지정한다.",
    ],
    answer: 2,
    explanation: "인공 신경망은 생물학적 뉴런의 원리에 착안한 것이지만, 이를 그대로 구현하기 보다는 유사한 계산 원리로 동작하도록 설계된 것이다. 뉴런은 전달되는 신호의 가중 합을 구한 후 활성함수를 거쳐 출력을 만들어 내는 단순한 처리를 수행하며, 이때 활성함수는 뉴런의 출력이 입력에 따라 활성화될 수 있도록 하는 역할을 하는 비선형 함수를 사용한다. 입력이 뉴런에 전달되는 가중치는 학습 과정을 통해 결정된다.",
  },
  {
    q: "다음 중 활성함수에 대한 설명이 올바른 것은?",
    choices: [
      "단위 계단 함수: 전 구간에서 미분 가능한 연속함수이다.",
      "시그모이드: 입력 u가 0보다 큰 경우는 u를, 그 외의 경우에는 0을 출력한다.",
      "ReLU: 전 구간에서 미분 가능하며, 로지스틱 함수라고 부르기도 한다.",
      "GELU: 전 구간에서 미분 가능하도록 한 ReLU의 변형이다.",
    ],
    answer: 3,
    explanation: "단위 계단 함수는 입력의 부호에 따라 0 또는 1 출력하며, 따라서 입력이 0인 지점에서 불연속이며 미분을 구할 수 없다. 시그모이드는 ‘S’자 형태의 곡선이며 0부터 1 또는 –1부터 1 사이의 값을 갖는, 전 구간에서 미분 가능한 함수이다. ReLU는 입력 u에 대해 max(u, 0)을 출력하는 함수이다.",
  },
  {
    q: <>다음과 같이 2개의 입력이 연결된 퍼셉트론 학습에서 입력 (<i>x</i><sub>1</sub>, <i>x</i><sub>2</sub>)가 (0.5, 0.1)이고 이에 대한 레이블 <i>y</i>가 0이다. <i>w</i><sub>1</sub>과 <i>w</i><sub>2</sub>가 각각 -0.7과 0.2, <i>b</i>가 0.5일 때 업데이트 후 <i>w</i><sub>1</sub>, <i>w</i><sub>2</sub>, <i>b</i>의 값은? 단 학습률 <i>η</i>는 0.1이다.</>,
    context: <><span className="block"><Image src="/official-exercises/dl/1-3-0.png" alt="입력 x₁과 x₂에 각각 w₁과 w₂를 곱하고 편향 b를 더한 뒤 계단 함수로 출력을 구하는 퍼셉트론" width={546} height={145} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" /><br /></span></>,
    choices: [
      <><i>w</i><sub>1</sub> = -0.75, <i>w</i><sub>2</sub> = 0.19, <i>b</i> = 0.4</>,
      <><i>w</i><sub>1</sub> = -0.65, <i>w</i><sub>2</sub> = 0.21, <i>b</i> = 0.6</>,
      <><i>w</i><sub>1</sub> = -0.7, <i>w</i><sub>2</sub> = 0.2, <i>b</i> = 0.5</>,
      <><i>w</i><sub>1</sub> = -1.0, <i>w</i><sub>2</sub> = 0.1, <i>b</i> = 0.5</>,
    ],
    answer: 0,
    explanation: <><span className="block"><i>u</i>의 값은 <i>x</i><sub>1</sub><i>w</i><sub>1</sub> + <i>x</i><sub>2</sub><i>w</i><sub>2</sub> + <i>b</i> = 0.17이고, 이 값이 0보다 크므로 뉴런의 출력은 1이다. <i>δ</i>는 이 값과 레이블(0)의 차이므로 δ=1이다. 따라서 <i>w</i><sub>1</sub>, <i>w</i><sub>2</sub>, <i>b</i>는 다음과 같이 업데이트한다.</span><span className="block">&nbsp; <i>w</i><sub>1</sub> = <i>w</i><sub>1</sub> - <i>η δ x</i><sub>1</sub> = -0.7 – 0.1 × 1 × 0.5 = -0.75</span><span className="block">&nbsp; <i>w</i><sub>2</sub> = <i>w</i><sub>2</sub> - <i>η δ x</i><sub>2</sub> = 0.2 - 0.1 × 1 × 0.1 = 0.19</span><span className="block">&nbsp; <i>b</i> = <i>b</i> - <i>η δ&nbsp;</i>= 0.5 – 0.1 × 1 = 0.4</span></>,
  },
];
