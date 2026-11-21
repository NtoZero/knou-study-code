import Image from "next/image";
import type { OfficialQuizItem } from "@/components/dlShared/Quiz";

/** U-KNOU 딥러닝 2강 공식 연습문제. 보기 순서와 정답은 학습창 기준. */
export const QUIZZES: OfficialQuizItem[] = [
  {
    q: "다음 중 다층 퍼셉트론(MLP)에 대한 설명으로 옳은 문장을 모두 나열한 것은?",
    context: <><div className="my-2 whitespace-pre-wrap rounded-lg border p-3"><span className="block">㈀ MLP의 학습을 위한 학습 데이터에는 은닉층에 대한 레이블이 제공된다.</span><span className="block">㈁ 층 수가 증가하면 MLP 모델의 표현력이 감소한다.</span><span className="block">㈂ 일반적으로 은닉층의 활성함수는 비선형 함수를 사용한다.</span><span className="block">㈃ 역전파는 MLP의 학습에 활용할 수 있는 학습 알고리즘이다.</span><span className="block">㈄ MLP는 순환연결 방식의 구조이다.</span></div></>,
    choices: [
      "㈀, ㈁, ㈃",
      "㈁, ㈃, ㈄",
      "㈂, ㈃",
      "㈁, ㈄",
    ],
    answer: 2,
    explanation: "MLP는 피드포워드 신경망 구조이다. 역전파 알고리즘을 이용하여 학습할 수 있으며, 학습 데이터 집합은 입력 데이터와 출력층의 레이블로 구성된다. 단층 퍼셉트론은 선형 경계로 표현될 수 있는 문제만 해결할 수 있으나, 층 수가 증가할수록 고차원적인 특징을 표현할 수 있어 복잡한 결정경계를 학습할 수 있다. 일반적으로 은닉층의 활성함수는 비선형 함수를 사용하며, 선형 함수를 사용할 경우 그 은닉층이 없이도 동등한 출력을 낼 수 있는 망으로 표현할 수 있어 층을 추가하여 얻을 수 있는 표현력의 개선 효과가 없다.",
  },
  {
    q: "다음 중 역전파 알고리즘에 대한 설명으로 적절한 것은?",
    choices: [
      "뉴런의 활성함수는 단위 계단 함수를 사용해야 한다.",
      "학습 데이터에 은닉층 뉴런에 대한 레이블도 제공되어야 한다.",
      "입력층에서 출력층 방향의 순서로 오차를 전파하여 연결 가중치를 업데이트한다.",
      "연결 가중치에 대한 손실함수의 편미분을 체인 룰에 따라 구하여 경사 하강법으로 연결 가중치를 업데이트한다.",
    ],
    answer: 3,
    explanation: "단위 계단 함수는 입력이 0인 경우 미분을 구할 수 없고, 그 외의 경우에는 미분이 0이어서 경사 하강법을 적용할 수 없다. 학습 데이터의 레이블은 출력층에 대한 것만 제공된다. 학습은 출력층에서 입력층 방향으로 역방향 진행을 하며 체인 룰에 따라 각 층의 연결 가중치에 대한 손실함수의 편미분을 구한 후 이를 적절히 정한 학습률에 따라 반영하여 그 가중치를 업데이트한다.",
  },
  {
    q: <>다음 그림에서 손실함수 <Image src="/official-exercises/dl/2-3-0.png" alt="E(ŷ, y)" width={44} height={19} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" />를 출력층인 <i>L</i>층의 <i>k</i>번 뉴런에 연결되는 연결 가중치 <Image src="/official-exercises/dl/2-3-1.png" alt="∂wⱼₖ⁽ᴸ⁾" width={37} height={29} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" />에 대해 편미분을 하려고 한다. 다음 중 이 편미분을 체인 룰을 이용하여 표현한 것으로 적절한 것은?</>,
    context: <><span className="block"><Image src="/official-exercises/dl/2-3-2.png" alt="은닉층 j의 출력에서 가중치 wⱼₖ⁽ᴸ⁾, 가중합 uₖ⁽ᴸ⁾, 출력층 활성값 oₖ⁽ᴸ⁾를 거쳐 예측값을 구하는 연결" width={623} height={243} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" /><br /></span></>,
    choices: [
      <><Image src="/official-exercises/dl/2-3-3.png" alt="∂E/∂wⱼₖ = (∂E/∂oₖ)(∂oₖ/∂uₖ)(∂uₖ/∂wⱼₖ)" width={212} height={49} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" /><br /></>,
      <><Image src="/official-exercises/dl/2-3-4.png" alt="∂E/∂wⱼₖ = (∂E/∂uₖ)(∂oₖ/∂wⱼₖ)" width={172} height={49} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" /><br /></>,
      <><Image src="/official-exercises/dl/2-3-5.png" alt="∂E/∂wⱼₖ = ∂E/∂oₖ + ∂oₖ/∂uₖ + ∂uₖ/∂wⱼₖ" width={241} height={49} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" /><br /></>,
      <><Image src="/official-exercises/dl/2-3-6.png" alt="∂E/∂wⱼₖ = (∂E/∂uₖ)wⱼₖ" width={157} height={50} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" /><br /></>,
    ],
    answer: 0,
    explanation: <>체인 룰에 따르면 함수 <i>f</i>가 <i>g</i>의 함수이고, <i>g</i>가 <i>x</i>의 함수인 경우 <i>f</i>를 <i>x</i>로 미분하는 것은 <i>g</i>에 대한 <i>f</i>의 미분과 <i>x</i>에 대한 <i>g</i>의 미분을 곱하여 구할 수 있다. 손실함수 <i>E</i>는 <Image src="/official-exercises/dl/2-3-7.png" alt="ŷ" width={37} height={27} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" />(과 같음)의 함수이고, <Image src="/official-exercises/dl/2-3-8.png" alt="oₖ⁽ᴸ⁾" width={25} height={26} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" />은 <Image src="/official-exercises/dl/2-3-9.png" alt="oₖ⁽ᴸ⁾" width={25} height={23} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" />의 함수이며, <Image src="/official-exercises/dl/2-3-10.png" alt="uₖ⁽ᴸ⁾" width={23} height={24} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" />은 <Image src="/official-exercises/dl/2-3-11.png" alt="w⁽ᴸ⁾" width={29} height={21} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" />의 함수이다. 따라서 체인 룰에 따라 세 함수의 편미분을 곱하여 <Image src="/official-exercises/dl/2-3-12.png" alt="∂wⱼₖ⁽ᴸ⁾" width={33} height={26} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" />에 대한 <Image src="/official-exercises/dl/2-3-13.png" alt="E(ŷ, y)" width={45} height={20} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" />의 편미분을 구할 수 있다.﻿﻿</>,
  },
  {
    q: "다음 중 역전파 알고리즘에서 모멘텀의 용도는 무엇인가?",
    choices: [
      "학습 과정에서 체인 룰을 적용할 필요가 없어진다.",
      "연결 가중치의 변화가 과거 변화의 경향을 유지함으로써 변화의 방향이 급격히 변화하는 것을 완화한다.",
      "학습 시작 전 가중치 및 바이어스 등의 파라미터를 초기화한다.",
      "특정 가중치를 고정하고, 나머지 파라미터만 업데이트되도록 학습한다.",
    ],
    answer: 1,
    explanation: "모멘텀은 이전 단계의 가중치 변화량을 모멘텀 m의 비율로 반영하여 현 단계의 가중치 변화량을 정한다. 그 결과 연결 가중치의 변화가 과거 변화의 경향을 유지함으로써 변화의 방향이 급격히 변화하는 것을 완화함으로써 기본적인 경사 하강법의 성능을 개선할 수 있다.",
  },
  {
    q: "다음 중 소프트맥스 활성함수에 대한 설명으로 틀린 것은?",
    choices: [
      "각각의 출력은 0과 1 사이의 값이다.",
      "모든 출력의 합은 1이다.",
      "여러 개의 클래스 중 하나로 분류하는 문제에 적합하다.",
      "선형함수에 해당된다.",
    ],
    answer: 3,
    explanation: "소프트맥스 함수는 N개의 입력에 대해 각 입력의 exp함수 값을 구한 후 이 값을 N개의 값의 합계로 나눈 것이다. 그 결과 각각의 출력은 0과 1 사이의 값을 갖게 되고, 출력의 총 합은 1이다. 그 결과 각 출력에 대한 확률값을 출력하며, 그 중 가장 큰 값을 갖는 출력에 대한 클래스로 분류한다.",
  },
];
