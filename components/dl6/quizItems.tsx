import Image from "next/image";
import type { OfficialQuizItem } from "@/components/dlShared/Quiz";

/** U-KNOU 딥러닝 6강 공식 연습문제. 보기 순서와 정답은 학습창 기준. */
export const QUIZZES: OfficialQuizItem[] = [
  {
    q: "다층 퍼셉트론(MLP)에 비해 합성곱 신경망(CNN)이 이미지 처리에 훨씬 더 효과적인 이유로 가장 적절한 것은?",
    choices: [
      "이미지 데이터를 전결합 형태로 완전히 평탄화(펼침)한 뒤 다루기 때문이다.",
      "필터 가중치를 공유(Weight Sharing)하고 데이터 고유의 공간적 구조 정보를 보존하기 때문이다.",
      "층을 깊게 쌓아도 파라미터가 급격히 늘어나는 특징이 존재하기 때문이다.",
      "기존에 사람이 만든 고정된 형태의 에지 검출 필터만을 학습에 활용하기 때문이다.",
    ],
    answer: 1,
    explanation: "합성곱 연산은 슬라이딩 윈도우 방식을 사용해 가중치를 공유(Weight Sharing)하므로 학습할 파라미터가 적고, 픽셀 주변부의 공간 구조(공간적 정보)를 파괴하지 않고 유지하면서 특징을 성공적으로 추출한다.",
  },
  {
    q: "합성곱 층에서 가상의 외곽 픽셀을 0과 같은 값으로 메우는 패딩(Padding)을 적용하는 주요 목적이 아닌 것은?",
    choices: [
      "이미지의 외곽 모서리에 분포한 고유의 정보 유실을 최소화하기 위함이다.",
      "합성곱 연산이 누적될수록 특징 맵의 공간 해상도가 급격히 축소되는 현상을 방지하기 위함이다.",
      "최종 모델이 연산해야 할 필터 자체의 가중치 파라미터 수를 줄이기 위함이다.",
      "스트라이드가 1일 때, 입력 데이터 크기와 출력 특징 맵 크기를 가급적 동일하게 맞추기 위함이다.",
    ],
    answer: 2,
    explanation: "패딩은 경계 영역의 연산 횟수를 보완하고 공간적 축소를 제어할 뿐, 필터 자체의 가중치 파라미터 수를 줄여주지는 않는다.",
  },
  {
    q: "다음 중 풀링층(Pooling Layer)의 특징에 대한 설명으로 올바르지 않은 것은?",
    choices: [
      "풀링층의 다운샘플링 과정은 대상의 미세한 위치나 왜곡에 대해 강건한 예측력을 제공한다.",
      "풀링 영역 내에서 미리 정해진 연산만을 수행하기 때문에 학습 가중치가 존재하지 않는다.",
      "풀링을 거친 후에는 입력 이미지 특징 맵의 채널 수가 1개로 압축된다.",
      "일반적으로 최대값 풀링(Max Pooling)과 평균값 풀링(Average Pooling) 등이 활용된다.",
    ],
    answer: 2,
    explanation: "풀링층은 채널별로 각각 독립적으로 작동하므로 연산 전후의 공간 크기(높이, 너비)만 바뀔 뿐 채널의 개수(깊이)는 그대로 유지된다.",
  },
  {
    q: "입력 데이터의 크기가 4 × 4이고, 합성곱 필터의 크기가 3 × 3, 패딩(Padding)이 0, 스트라이드(Stride)가 1일 때, 다음 입력 데이터와 필터를 이용한 합성곱 연산의 결과로 생성되는 특징 맵은?",
    context: <><span className="block"><Image src="/official-exercises/dl/6-4-0.png" alt="입력 행렬 [0 1 0 1; 0 1 1 0; 0 0 1 1; 1 0 0 0], 필터 [1 0 1; 0 1 1; 1 0 0]" width={675} height={161} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" /><br /></span></>,
    choices: [
      <><Image src="/official-exercises/dl/6-4-1.png" alt="첫째 행 2, 1. 둘째 행 0, 2." width={63} height={65} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" /><br /></>,
      <><Image src="/official-exercises/dl/6-4-2.png" alt="첫째 행 3, 2. 둘째 행 3, 3." width={64} height={63} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" /><br /></>,
      <><Image src="/official-exercises/dl/6-4-3.png" alt="첫째 행 3, 1. 둘째 행 3, 2." width={61} height={62} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" /><br /></>,
      <><Image src="/official-exercises/dl/6-4-4.png" alt="첫째 행 2, 3. 둘째 행 3, 3." width={63} height={62} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" /><br /></>,
    ],
    answer: 3,
    explanation: <><span className="block">합성곱 연산의 결과는 다음과 같이 계산할 수 있다.</span><span className="block">- (1, 1) : (0×1)+(1×0)+(0×1)+(0×0)+(1×1)+(1×1)+(0×1)+(0×0)+(1×0) = 2</span><span className="block">- (1, 2) : (1×1)+(0×0)+(1×1)+(1×0)+(1×1)+(0×1)+(0×1)+(1×0)+(1×0) = 3</span><span className="block">- (2, 1) : (0×1)+(1×0)+(1×1)+(0×0)+(0×1)+(1×1)+(1×1)+(0×0)+(0×0) = 3</span><span className="block">- (2, 2) : (1×1)+(1×0)+(0×1)+(0×0)+(1×1)+(1×1)+(0×1)+(0×0)+(0×0) = 3</span></>,
  },
  {
    q: "입력 데이터의 크기가 8 x 8이고, 합성곱 필터의 크기가 3 x 3, 패딩(Padding)이 2, 스트라이드(Stride)가 1일 때, 생성되는 최종 특징 맵의 크기는?",
    choices: [
      "6×6",
      "8×8",
      "10×10",
      "12×12",
    ],
    answer: 2,
    explanation: <><span className="block">특징 맵의 크기는 10×10로, 다음과 같이 계산할 수 있다.</span><span className="block"><Image src="/official-exercises/dl/6-5-0.png" alt="특징 맵의 크기 = (입력 데이터 크기 − 필터 크기 + 2 × 패딩 값) / 스트라이드 + 1" width={419} height={41} unoptimized className="inline-block h-auto max-w-full bg-white align-middle" /></span><span className="block">- 가로: 10 =(8-3+2×2)/ 1+1</span><span className="block">- 세로: 10 =(8-3+2×2)/ 1+1</span></>,
  },
  {
    q: "합성곱 및 풀링 단계를 거쳐 특징을 추출한 후, 다층 퍼셉트론(MLP)의 입력 구조인 완전연결층(Fully Connected Layer)으로 나아가기 위해 반드시 먼저 수행해야 하는 평탄화(Flatten) 연산의 역할은?",
    choices: [
      "다차원(높이, 너비, 채널) 형태로 존재하는 특징 맵 데이터를 1차원 벡터(배열) 형태로 전환한다.",
      "데이터의 분포가 양수와 음수에 걸쳐 평평하게 정규화되도록 분포를 강제 조절한다.",
      "필터들의 경계선을 완만하게 누그러뜨려 이미지를 전체적으로 부드럽게 보정한다.",
      "특징 맵 내에서 가장 중요한 특정 채널만 골라내고 나머지 정보를 배제시킨다.",
    ],
    answer: 0,
    explanation: "평탄화(Flatten)는 다차원 행렬(높이, 너비, 채널) 구조로 학습된 이미지의 국소 특징 데이터를 전결합(Dense) 완전연결층에 주입할 수 있도록 길게 늘어선 1차원 벡터(배열) 구조로 납작하게 변환해 주는 작업이다.",
  },
];
