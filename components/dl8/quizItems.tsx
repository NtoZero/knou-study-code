import KeyPhrase from "@/components/dlShared/KeyPhrase";
import type { OfficialQuizItem } from "@/components/dlShared/Quiz";

/** U-KNOU 딥러닝 8강 공식 연습문제. 보기 순서와 정답은 학습창 기준. */
export const QUIZZES: OfficialQuizItem[] = [
  {
    q: "AlexNet의 특징이 아닌 것은?",
    choices: [
      "5개의 합성곱층과 3개의 완전연결층으로 구성된다.",
      "GPU 기반의 병렬 구조이다.",
      "Overlapping Pooling을 적용하였다.",
      "배치 정규화 기법을 적용하였다.",
    ],
    answer: 3,
    explanation: <>AlexNet은 정규화 기법으로 <KeyPhrase>LRN(Local Response Normalization)</KeyPhrase>을 적용하였다. LRN은 이미지의 인접한 픽셀에 영향을 주는 것을 방지시키기 위한 정규화 기법으로 AlexNet에서 처음 도입되었다.</>,
  },
  {
    q: "합성곱에서 3x3 크기의 필터를 깊게 쌓는 것이 핵심인 합성곱 신경망을 고르시오.",
    choices: [
      "AlexNet",
      "LeNet-5",
      "VGGNet",
      "CNN",
    ],
    answer: 2,
    explanation: <>VGGNet은 합성곱층에서 <KeyPhrase>3x3 크기의 필터</KeyPhrase>를 활용하여, 층을 깊게 쌓는 것이 주요 특징이다. 즉, 작은 크기의 필터를 사용함으로써 더 복잡한 패턴을 학습할 수 있게 하며, 이로 인해 깊은 신경망을 구축하는 데 성공하였다.</>,
  },
  {
    q: "Data Augmentation의 특징으로 올바른 것은?",
    choices: [
      "데이터 크기가 줄어들어 모델의 성능이 향상된다.",
      "모델의 복잡도가 감소하여 과적합을 유발한다.",
      "일반화 성능이 향상된다.",
      "데이터의 분포가 변경되어 모델의 정확도가 저하된다.",
    ],
    answer: 2,
    explanation: <>Data Augmentation은 <KeyPhrase>기존 데이터의 특성을 유지하면서</KeyPhrase> 다양한 형태로 확장하는 기술이다. 데이터의 다양성이 증가하기 때문에 다양한 패턴과 특징을 학습할 수 있다. 또한, 과적합을 방지하고 일반화 성능을 향상시킨다.</>,
  },
  {
    q: "VGGNet16에서 숫자 ‘16’의 의미로 올바른 것을 고르시오.",
    choices: [
      "파라미터",
      "층",
      "필터",
      "에포크",
    ],
    answer: 1,
    explanation: <>VGGNet은 11층, 13층, 16층, 19층의 모델이 있다. VGGNet16에서 숫자 "16"은 <KeyPhrase>네트워크의 층(layer) 수</KeyPhrase>를 의미한다.</>,
  },
  {
    q: "VGGNet에서 큰 크기의 필터 하나보다 작은 3×3 필터를 여러 번 사용하는 이유로 가장 적절한 것은?",
    choices: [
      "입력 이미지의 크기를 확대하고 출력 클래스의 수를 증가시키기 위해",
      "풀링층을 제거하고 합성곱 연산을 한 번만 수행하기 위해",
      "큰 필터와 유사한 수용 영역을 확보하면서 비선형성을 높이고, 가중치 수와 연산량을 줄이기 위해",
      "이미지의 색상 정보를 제거하고 특징 맵의 크기를 일정하게 유지하기 위해",
    ],
    answer: 2,
    explanation: <>작은 3×3 필터를 여러 층으로 쌓으면 <KeyPhrase>큰 필터와 유사한 수용 영역</KeyPhrase>을 확보할 수 있으며, 활성화 함수를 여러 번 적용하여 다양한 비선형 특징을 학습할 수 있다. 또한 큰 필터를 사용하는 것보다 가중치 수가 적어 연산량과 메모리 사용량을 줄일 수 있다.</>,
  },
];
