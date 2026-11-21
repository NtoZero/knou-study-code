import type { QuizItem } from "@/components/dlShared/Quiz";

/** 강의록·교재 개념을 새 문항으로 바꾸어 만든 8강 복습 퀴즈. */
export const QUIZZES: QuizItem[] = [
  {
    q: "AlexNet의 기본 구조를 알맞게 설명한 것은?",
    source: "변형",
    examSkill: "층 구성과 출력 역할 구분",
    answer: 1,
    basis:
      "AlexNet은 5개의 합성곱층과 3개의 완전연결층을 사용하고, 출력층은 소프트맥스로 1,000개 범주를 분류한다.",
    refs: { slides: "슬라이드 6–7 — AlexNet의 구조" },
    choices: [
      {
        text: "3개의 합성곱층 뒤에 5개의 완전연결층을 둔다.",
        isCorrect: false,
        explanation: {
          basis: "AlexNet의 C1–C5, F6–F8 구성",
          reason:
            "근거: 강의록은 C1–C5를 합성곱층, F6–F8을 완전연결층으로 표기한다. 오답 기준: 이 보기는 두 층의 개수를 서로 바꾸어 3개와 5개로 적었다.",
        },
      },
      {
        text: "5개의 합성곱층과 3개의 완전연결층 뒤에 소프트맥스 출력을 둔다.",
        isCorrect: true,
        explanation: {
          basis: "AlexNet의 C1–C5와 F6–F8",
          reason:
            "근거: 합성곱층은 5개, 완전연결층은 3개이며 마지막 층은 소프트맥스로 1,000개 범주를 출력한다. 오답 기준: 나머지 보기는 층 수를 바꾸거나 출력 함수·병렬 구조를 AlexNet 설명과 다르게 적었다.",
        },
      },
      {
        text: "5개의 합성곱층과 3개의 완전연결층을 두지만, 마지막 층은 LRN으로 범주를 분류한다.",
        isCorrect: false,
        explanation: {
          basis: "AlexNet의 출력층과 LRN",
          reason:
            "근거: 강의록의 마지막 층은 소프트맥스를 사용하고, LRN은 특징 맵의 국소 반응을 정규화하는 곳에 쓰인다. 오답 기준: LRN을 분류 출력 함수처럼 배치한 점이 층의 역할과 다르다.",
        },
      },
      {
        text: "두 개의 GPU를 쓰지 않고, 한 GPU에서만 순차 실행하도록 설계되었다.",
        isCorrect: false,
        explanation: {
          basis: "AlexNet의 GPU 병렬 구조",
          reason:
            "근거: AlexNet은 두 GPU에서 연산을 나눌 수 있는 병렬 구조로 설계되었다. 오답 기준: 한 GPU의 순차 실행만 지원한다는 설명은 강의록이 제시한 구조적 특징을 지운다.",
        },
      },
    ],
  },
  {
    q: "풀링 창이 3×3이고 stride가 2일 때, 창들이 서로 겹치는 까닭은?",
    source: "변형",
    examSkill: "창 크기와 이동 간격 판별",
    answer: 0,
    basis: "stride 2는 창의 크기 3보다 작으므로 이웃한 창은 한 칸의 입력을 공유한다.",
    refs: { slides: "슬라이드 7, 12 — AlexNet 세부 표와 오버래핑 최대 풀링" },
    choices: [
      {
        text: "한 번 이동하는 거리 2가 창 크기 3보다 작아 앞 창의 일부 영역을 다시 포함한다.",
        isCorrect: true,
        explanation: {
          basis: "오버래핑 최대 풀링의 정의",
          reason:
            "근거: 창 폭은 3, 이동 폭은 2이므로 이웃한 창이 한 입력 위치를 공유한다. 오답 기준: 창 크기보다 stride가 작을 때 겹친다는 조건과 달리 설명한 다른 선택지는 중복 영역을 만들지 않는다.",
        },
      },
      {
        text: "stride가 창 크기보다 커서 다음 창이 앞 창을 넘어간다.",
        isCorrect: false,
        explanation: {
          basis: "창 크기와 stride의 비교",
          reason:
            "근거: 여기서 stride는 2이고 창의 폭은 3이므로 stride가 더 크지 않다. 오답 기준: stride가 창 크기보다 크면 일부 입력 위치를 건너뛰며, 겹침은 생기지 않는다.",
        },
      },
      {
        text: "최대 풀링은 같은 값을 반복해서 출력하기 때문에 창 영역이 겹친다.",
        isCorrect: false,
        explanation: {
          basis: "최대 풀링과 창 이동",
          reason:
            "근거: 최대 풀링은 각 창 안의 최댓값을 출력한다. 오답 기준: 겹침 여부는 출력값이 반복되는지가 아니라 창의 크기와 stride로 결정된다.",
        },
      },
      {
        text: "입력 채널이 3개라서 가로 방향의 풀링 창이 겹친다.",
        isCorrect: false,
        explanation: {
          basis: "오버래핑 최대 풀링의 공간 이동",
          reason:
            "근거: 채널 수는 색상·특징의 깊이이고, 창 겹침은 공간 위치에서 stride가 창 크기보다 작은지로 정해진다. 오답 기준: RGB 채널 수는 이 가로·세로 이동 간격을 바꾸지 않는다.",
        },
      },
    ],
  },
  {
    q: "AlexNet에서 LRN을 사용한 목적을 가장 잘 설명한 것은?",
    source: "변형",
    examSkill: "정규화 기법의 대상과 역할 구분",
    answer: 2,
    basis: "LRN은 특정 특징 맵의 강한 반응이 주변 채널의 같은 위치 반응에 미치는 영향을 줄이는 정규화이다.",
    refs: { slides: "슬라이드 10–11 — LRN과 배치 정규화 비교" },
    choices: [
      {
        text: "미니배치마다 평균과 분산을 구해 각 채널 전체를 정규화한다.",
        isCorrect: false,
        explanation: {
          basis: "배치 정규화의 대상",
          reason:
            "근거: 미니배치의 같은 채널 통계를 이용하는 것은 배치 정규화의 설명이다. 오답 기준: LRN은 미니배치 전체의 평균·분산을 사용하는 기법으로 제시되지 않는다.",
        },
      },
      {
        text: "드롭아웃 대상 노드를 다시 선택해 학습 마스크를 만든다.",
        isCorrect: false,
        explanation: {
          basis: "드롭아웃과 LRN의 역할",
          reason:
            "근거: 무작위 노드 생략은 드롭아웃의 역할이다. 오답 기준: LRN은 노드를 끄는 규제가 아니라 같은 공간 위치의 채널 반응을 정규화한다.",
        },
      },
      {
        text: "한 위치에서 특정 특징 맵의 강한 반응이 인접 채널에 미치는 영향을 줄인다.",
        isCorrect: true,
        explanation: {
          basis: "LRN(Local Response Normalization)의 정의",
          reason:
            "근거: LRN은 이미지 한 장 안의 인접 채널을 보고 같은 위치의 반응을 조정한다. 오답 기준: 배치 평균·분산, 드롭아웃 마스크, 분류 확률은 각각 다른 절차의 설명이다.",
        },
      },
      {
        text: "마지막 출력 벡터를 1,000개 범주의 확률로 바꾼다.",
        isCorrect: false,
        explanation: {
          basis: "소프트맥스 출력과 LRN의 역할",
          reason:
            "근거: 소프트맥스가 마지막 출력값을 범주 확률로 바꾸는 역할을 한다. 오답 기준: LRN은 출력층의 범주 확률 함수가 아니라 중간 특징 맵의 국소 반응을 정규화한다.",
        },
      },
    ],
  },
  {
    q: "AlexNet 학습 데이터의 좌우 반전과 임의 크롭이 공통으로 노리는 것은?",
    source: "변형",
    examSkill: "데이터 증강의 목적 파악",
    answer: 3,
    basis: "두 방식은 이미지의 특징을 유지하며 학습 입력의 모양을 다양하게 만들어 데이터 증강을 수행한다.",
    refs: { slides: "슬라이드 13–15 — 미러링·랜덤 크롭·PCA 색상 증강" },
    choices: [
      {
        text: "정답 범주를 바꾸어 모델이 새 클래스를 학습하게 한다.",
        isCorrect: false,
        explanation: {
          basis: "데이터 증강에서 보존하는 것",
          reason:
            "근거: 강의록의 예시는 기존 이미지의 특성을 유지한 채 변형본을 만든다. 오답 기준: 입력 이미지만 변형하고 같은 대상의 범주를 유지하는 것이므로 새 정답 범주를 만드는 방식이 아니다.",
        },
      },
      {
        text: "훈련 이미지의 수와 형태를 줄여 모델을 더 단순하게 만든다.",
        isCorrect: false,
        explanation: {
          basis: "데이터 증강의 목적",
          reason:
            "근거: 미러링과 크롭은 원본에서 추가 학습 이미지를 만든다. 오답 기준: 표본을 줄이는 것이 아니라 다양한 입력을 늘려 학습에 사용한다.",
        },
      },
      {
        text: "모델의 은닉층 연결을 일부 생략한다.",
        isCorrect: false,
        explanation: {
          basis: "데이터 증강과 드롭아웃의 구분",
          reason:
            "근거: 은닉층 노드 일부를 생략하는 기법은 드롭아웃이다. 오답 기준: 미러링과 크롭은 네트워크 구조가 아니라 이미지 입력을 변형한다.",
        },
      },
      {
        text: "이미지의 특징을 유지하며 입력 형태를 다양하게 만들어 과적합을 줄인다.",
        isCorrect: true,
        explanation: {
          basis: "데이터 증강의 공통 목표",
          reason:
            "근거: 미러링·크롭·PCA 색상 증강은 이미지의 특성을 유지하며 변형된 학습 입력을 추가한다. 오답 기준: 다른 선택지는 정답 라벨을 바꾸거나 데이터를 줄이거나 입력이 아닌 네트워크 연결을 변경한다.",
        },
      },
    ],
  },
  {
    q: "VGG16의 이름에 들어간 숫자 16은 무엇을 세는가?",
    source: "변형",
    examSkill: "모델명 해석",
    answer: 0,
    basis: "VGGNet의 숫자는 가중치를 포함하는 층의 수이며, VGG16은 합성곱층과 완전연결층을 합해 16개이다.",
    refs: { slides: "슬라이드 25–27, 31 — VGGNet 구성" },
    choices: [
      {
        text: "합성곱층과 완전연결층처럼 가중치를 포함하는 층의 수",
        isCorrect: true,
        explanation: {
          basis: "VGGNet 모델명의 층수",
          reason:
            "근거: VGG16은 가중치를 포함하는 합성곱층 13개와 완전연결층 3개를 합한 16개를 뜻한다. 오답 기준: 풀링 횟수, 필터 개수, 학습 에폭 수는 모델명의 16이 세는 대상이 아니다.",
        },
      },
      {
        text: "최대 풀링을 적용하는 횟수",
        isCorrect: false,
        explanation: {
          basis: "VGG16의 가중치 층 구성",
          reason:
            "근거: 숫자 16은 가중치를 포함하는 층의 수이다. 오답 기준: VGG16의 풀링층은 공간 크기를 줄이는 층이며 16이라는 숫자에 포함되지 않는다.",
        },
      },
      {
        text: "각 합성곱층의 필터 개수",
        isCorrect: false,
        explanation: {
          basis: "conv 표기와 VGG16 모델명",
          reason:
            "근거: 필터 개수는 conv3-64처럼 합성곱 표기 뒤 숫자로 나타낸다. 오답 기준: VGG16의 16은 특정 층의 필터 수가 아니라 모델의 가중치 층 수이다.",
        },
      },
      {
        text: "전체 데이터셋을 반복 학습한 에폭 수",
        isCorrect: false,
        explanation: {
          basis: "VGG 모델명과 학습 횟수의 구분",
          reason:
            "근거: 에폭 수는 학습 설정이며 VGG 변형 모델의 이름에 해당하지 않는다. 오답 기준: VGG16은 층 구성을 가리키고, 에폭은 학습 과정에서 별도로 지정한다.",
        },
      },
    ],
  },
  {
    q: "VGG16에서 conv3-512라는 표기를 올바르게 읽은 것은?",
    source: "변형",
    examSkill: "합성곱 층 표기 해석",
    answer: 1,
    basis: "conv 뒤의 3은 필터 한 변의 크기, 512는 필터 수를 뜻한다.",
    refs: { slides: "슬라이드 25, 31, 34 — VGGNet 구조 표기" },
    choices: [
      {
        text: "512×512 필터 3개",
        isCorrect: false,
        explanation: {
          basis: "conv3-512 표기의 두 숫자",
          reason:
            "근거: 첫 숫자 3은 필터의 한 변 크기이고 뒤의 512는 필터 개수이다. 오답 기준: 이 선택지는 필터 크기와 개수를 거꾸로 읽었다.",
        },
      },
      {
        text: "3×3 필터 512개",
        isCorrect: true,
        explanation: {
          basis: "VGGNet 합성곱 표기법",
          reason:
            "근거: conv3-512는 3×3 크기의 필터 512개를 사용한다는 의미이다. 오답 기준: 뒤의 512는 입력 채널 수나 학습 횟수가 아니며, 앞의 3은 필터 개수가 아니다.",
        },
      },
      {
        text: "3개의 합성곱층과 각 층의 출력 채널 512개",
        isCorrect: false,
        explanation: {
          basis: "conv3-512의 표기 규칙",
          reason:
            "근거: 표기에서 3은 필터의 공간 크기이고 512는 필터 개수이다. 오답 기준: 3을 합성곱층 개수로 해석한 점이 잘못이다.",
        },
      },
      {
        text: "3×3 최대 풀링을 512회 수행",
        isCorrect: false,
        explanation: {
          basis: "합성곱 필터와 최대 풀링의 구분",
          reason:
            "근거: conv라는 표기는 합성곱층을 가리킨다. 오답 기준: 최대 풀링의 창 크기나 반복 횟수를 나타내는 표기가 아니다.",
        },
      },
    ],
  },
  {
    q: "한 입력 채널과 한 출력 채널을 가정할 때, 3×3 합성곱을 세 번 쌓아 7×7 필터와 비교한 설명은?",
    source: "변형",
    examSkill: "수용 영역과 가중치 수 비교",
    answer: 2,
    basis:
      "stride 1의 세 개 3×3 필터는 7×7 수용 영역을 만들며, 단일 채널 경로의 가중치 수는 27개로 7×7 필터의 49개보다 적다.",
    refs: { slides: "슬라이드 28–29 — 7×7과 세 번의 3×3 비교" },
    choices: [
      {
        text: "수용 영역은 3×3에 머물고 가중치는 9개다.",
        isCorrect: false,
        explanation: {
          basis: "stride 1 합성곱의 수용 영역 증가",
          reason:
            "근거: 합성곱을 연속 적용하면 각 층이 앞 층의 이웃까지 보므로 수용 영역이 3×3에서 5×5, 7×7로 커진다. 오답 기준: 9개는 한 번의 3×3 필터 가중치 수이며 세 층 전체가 아니다.",
        },
      },
      {
        text: "수용 영역은 7×7이고, 가중치는 한 번의 7×7 필터와 같은 49개다.",
        isCorrect: false,
        explanation: {
          basis: "교재의 단일 채널 가중치 비교",
          reason:
            "근거: 수용 영역 7×7에는 도달하지만 세 개 3×3 필터의 가중치는 9×3=27개이다. 오답 기준: 49개는 한 개 7×7 필터의 가중치 수다.",
        },
      },
      {
        text: "수용 영역은 7×7이며 가중치는 27개이고, 중간 활성함수도 반복 적용된다.",
        isCorrect: true,
        explanation: {
          basis: "VGGNet의 3×3 필터 적층",
          reason:
            "근거: stride 1에서 세 층을 쌓으면 수용 영역이 7×7로 커지고 3×3 가중치가 층마다 9개씩 있어 총 27개이다. 오답 기준: 단일 7×7 필터의 49개를 그대로 적용하거나 중간 층의 비선형 변환을 빠뜨린 선택지는 적층의 이점을 놓친다.",
        },
      },
      {
        text: "수용 영역은 9×9이고 가중치는 27개다.",
        isCorrect: false,
        explanation: {
          basis: "수용 영역의 층별 변화",
          reason:
            "근거: 각 3×3 층은 수용 영역의 한 변을 2씩 늘리므로 3, 5, 7이 된다. 오답 기준: 세 층 뒤의 크기를 9로 계산하면 한 층을 더한 값이다.",
        },
      },
    ],
  },
];
