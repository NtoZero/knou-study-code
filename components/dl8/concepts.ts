import type { ConceptGroup } from "@/components/dlShared/LectureConcepts";

/** 8강 핵심 용어를 교재·강의록 표현과 연결한 학습용 정의. */
export const conceptGroups: ConceptGroup[] = [
  {
    title: "AlexNet과 합성곱의 출력 읽기",
    source: "8강 강의록 슬라이드 4–7",
    lectureSource: "07:03–07:29, 14:41–14:55",
    textbook: "교재 6.2.1 162–167쪽",
    terms: [
      {
        name: "AlexNet",
        english: "AlexNet",
        definition:
          "2012년 ILSVRC(ImageNet Large Scale Visual Recognition Challenge)에서 우승한 합성곱 신경망이다. 합성곱층 5개와 완전연결층 3개를 두 GPU에서 병렬 처리하고, 마지막 소프트맥스로 1,000개 범주의 확률을 출력한다.",
        example:
          "C2에서는 두 GPU가 각각 128개 특징 맵을 만들어 합계 256개를 출력하고, C3에서는 양쪽 GPU의 특징을 함께 받아 합계 384개 특징 맵을 만든다.",
        anchor: "alexnet-architecture",
      },
      {
        name: "필터",
        english: "filter / kernel",
        definition:
          "필터는 입력의 작은 영역을 이동하며 각 위치의 가중합을 계산하는 학습 가능한 가중치 묶음이다. 필터 하나가 출력 특징 맵 하나를 만들며, 필터의 깊이는 그 필터가 연결된 입력 채널 전체를 덮는다.",
        example:
          "RGB 입력에 적용되는 C1 필터 하나의 크기는 11×11×3이고, 이런 필터 96개가 96장의 특징 맵을 만든다.",
        anchor: "alexnet-architecture",
      },
      {
        name: "특징 맵",
        english: "feature map",
        definition:
          "특징 맵은 한 필터를 입력의 여러 위치에 적용해 얻은 반응값을 공간 위치별로 배열한 결과다. 표기 55×55×96에서 96은 가중치 수가 아니라 출력 특징 맵의 장수다.",
        example:
          "C1의 96개 필터가 각각 55×55 반응 지도를 하나씩 만들어 55×55×96 출력을 이룬다.",
        anchor: "alexnet-architecture",
      },
      {
        name: "수용 영역",
        english: "receptive field",
        definition:
          "수용 영역은 깊은 층의 한 출력값에 영향을 주는 원래 입력의 공간 범위다. 층을 거치며 작은 필터를 반복 적용하면 한 출력이 참조하는 입력 영역이 점차 넓어진다.",
        example:
          "패딩 없이 stride 1인 3×3 합성곱 세 층을 거치면 마지막 층의 한 위치는 원래 입력의 7×7 영역에 의존한다.",
        anchor: "vgg-filters",
      },
      {
        name: "스트라이드",
        english: "stride",
        definition:
          "스트라이드는 필터나 풀링 창을 다음 위치로 옮길 때 입력 위에서 이동하는 칸 수다. 스트라이드가 커지면 같은 입력에서 계산하는 출력 위치 수가 줄어든다.",
        example:
          "227×227 입력에 11×11 필터를 stride 4로 적용하면 각 변의 출력은 (227−11)/4+1=55이므로 55×55가 된다.",
        anchor: "alexnet-architecture",
      },
      {
        name: "제로 패딩",
        english: "zero padding",
        definition:
          "제로 패딩은 합성곱을 적용하기 전에 입력 테두리에 0을 덧붙이는 방법이다. 필터가 가장자리에서도 같은 방식으로 움직이게 하고 출력의 가로·세로 크기를 조절한다.",
        example:
          "C2 입력이 27×27일 때 5×5 필터, stride 1, 패딩 2를 적용하면 (27+2×2−5)/1+1=27이므로 크기가 유지된다.",
        anchor: "alexnet-architecture",
      },
    ],
  },
  {
    title: "학습 속도와 과적합 대응",
    source: "8강 강의록 슬라이드 8–16",
    lectureSource: "15:04–15:54, 25:51–26:59, 33:29–33:48",
    textbook: "교재 6.2.1 164–167쪽, 6.2.2 168–169쪽, 4.5.3 111–112쪽",
    terms: [
      {
        name: "ReLU",
        english: "Rectified Linear Unit",
        definition:
          "ReLU는 입력이 0보다 작으면 0을, 0보다 크면 그 입력값을 그대로 출력하는 활성함수 f(x) = max(0, x)다. AlexNet에서는 tanh보다 같은 훈련 오류율에 더 빨리 도달해 깊은 망의 학습 시간을 줄였다.",
        example:
          "입력 −2, 0, 3에 ReLU를 적용하면 출력은 각각 0, 0, 3이다. 훈련 오류율 25%에 도달하는 시간은 tanh를 쓸 때보다 약 6배 짧았다.",
        anchor: "alexnet-training",
      },
      {
        name: "오버래핑 최대 풀링",
        english: "overlapping max pooling",
        definition:
          "오버래핑 최대 풀링은 각 창 안의 최댓값을 출력하면서 이웃한 창이 입력 위치를 일부 공유하도록 이동시키는 방식이다. 창의 한 변보다 stride가 작으면 창이 겹친다.",
        example:
          "3×3 창을 stride 2로 옮기면 가로·세로 이웃 창은 각각 한 칸을 공유한다. 첫 창이 0–2열, 다음 창이 2–4열을 보면 2열이 겹치며, 각 창에서 최댓값 하나를 남긴다.",
        anchor: "overlapping-pooling",
      },
      {
        name: "국소 반응 정규화",
        english: "Local Response Normalization (LRN)",
        definition:
          "LRN은 특정 위치의 한 특징 맵 반응을 같은 위치에 있는 인접 특징 맵의 반응과 함께 정규화한다. 학습되는 스케일·이동 파라미터 없이 강한 채널 반응을 주변 채널 반응에 비해 낮춘다.",
        example:
          "위치 (r,c)에서 특징 맵 10, 11, 12의 값이 각각 1, 8, 2라면, LRN은 8만 따로 두지 않고 같은 위치의 이웃 채널 반응과 함께 정규화한다.",
        anchor: "lrn",
      },
      {
        name: "배치 정규화",
        english: "Batch Normalization (BN)",
        definition:
          "배치 정규화는 미니배치에서 같은 채널의 값들을 기준으로 평균과 분산을 계산해 정규화한 뒤 학습되는 스케일과 이동값을 적용한다. LRN이 한 이미지 안의 인접 채널을 보는 것과 달리, BN은 미니배치의 동일 채널 통계를 이용한다.",
        example:
          "한 채널의 배치 값이 2, 4, 6이면 평균 4를 빼고 표준편차로 나누어 정규화한 뒤 학습된 값으로 크기와 위치를 조정한다.",
        anchor: "lrn",
      },
      {
        name: "데이터 증강",
        english: "data augmentation",
        definition:
          "데이터 증강은 이미지의 핵심 특징과 정답 범주를 보존하면서 입력 모양이나 색을 바꾸어 훈련 사례를 다양하게 만드는 방법이다. AlexNet은 미러링, 임의 크롭, PCA 색상 증강을 사용해 특정 이미지에만 맞춰지는 것을 줄이려 했다.",
        example:
          "고양이 사진을 좌우 반전하거나 조금 다른 위치에서 잘라 학습해도 고양이라는 레이블은 그대로 유지한다.",
        anchor: "data-augmentation",
      },
      {
        name: "미러링",
        english: "mirroring",
        definition:
          "미러링은 이미지를 좌우로 반전해 원본과 다른 학습 입력을 만드는 데이터 증강 방법이다. 반전 뒤에도 대상의 범주가 유지되는 이미지에서 같은 레이블을 사용한다.",
        example:
          "강아지 사진의 왼쪽과 오른쪽을 뒤집어도 대상은 강아지이므로 두 입력에 같은 범주 레이블을 붙인다.",
        anchor: "data-augmentation",
      },
      {
        name: "임의 크롭",
        english: "random crop",
        definition:
          "임의 크롭은 원본 이미지에서 위치를 달리해 일부 영역을 잘라내고 모델 입력 크기에 맞게 조정하는 데이터 증강 방법이다. 잘라낸 영역에도 원래 대상의 핵심 특징이 남도록 해야 정답 범주를 그대로 쓸 수 있다.",
        example:
          "256×256 이미지에서 서로 다른 위치의 영역을 잘라 입력 크기로 맞추면, 대상이 보이는 여러 구도의 훈련 예를 만들 수 있다.",
        anchor: "data-augmentation",
      },
      {
        name: "PCA 색상 증강",
        english: "PCA color augmentation",
        definition:
          "PCA 색상 증강은 RGB 채널 값의 변동 방향을 주성분 분석으로 구하고 그 방향으로 색을 조금씩 바꾸는 방법이다. 공간의 모양을 자르거나 뒤집는 대신 색상 채널의 변화를 학습 입력에 더한다.",
        example:
          "같은 사물 사진의 RGB 밝기·색조를 주성분 방향으로 조금 바꾸어도 사물의 정답 범주는 유지한다.",
        anchor: "data-augmentation",
      },
      {
        name: "드롭아웃",
        english: "dropout",
        definition:
          "드롭아웃은 훈련 단계마다 지정한 확률로 일부 은닉 뉴런의 출력을 다음 층에 전달하지 않는 규제 방법이다. Keras는 훈련 때 살아남은 출력에 1/(1−p)를 곱해 신호 크기를 보정하고, 추론 단계에서는 모든 뉴런을 동작시킨다.",
        example:
          "드롭아웃 비율이 0.5인 10개 은닉 뉴런 예에서는 평균 5개가 생략되고, Keras는 살아남은 출력에 1/(1−0.5)=2배 보정을 적용한다. 한 번의 훈련 단계에서 정확히 5개가 생략된다는 뜻은 아니다.",
        anchor: "dropout",
      },
    ],
  },
  {
    title: "VGGNet의 깊이와 구성 비교",
    source: "8강 강의록 슬라이드 25–29, 31–36",
    lectureSource: "42:59–43:48, 54:03–55:17",
    textbook: "교재 6.3.1 170–173쪽, 6.3.2 174–175쪽",
    terms: [
      {
        name: "VGGNet",
        english: "VGGNet",
        definition:
          "옥스퍼드 대학 Visual Geometry Group이 개발해 2014년 ILSVRC 준우승을 한 합성곱 신경망 계열이다. 3×3 합성곱을 반복하고 풀링으로 공간 크기를 줄이는 깊은 구조를 사용한다.",
        example:
          "VGG16의 입력 224×224는 다섯 번의 2×2, stride 2 최대 풀링을 거쳐 112→56→28→14→7의 공간 크기로 바뀐다.",
        anchor: "vgg-architecture",
      },
      {
        name: "VGG 구성표 A–E",
        english: "VGG configurations A–E",
        definition:
          "VGG 구성표는 블록마다 쌓는 합성곱층 수와 커널 크기를 바꾼 여러 구조를 A, A-LRN, B, C, D, E로 구분한다. 가중치 층 수는 A와 A-LRN이 11개, B가 13개, C와 D가 16개, E가 19개다.",
        example:
          "A와 A-LRN을 비교하면 첫 블록의 LRN 유무를 볼 수 있고, C와 D를 비교하면 같은 16개 가중치 층에서 C의 일부 1×1 합성곱과 D의 3×3 합성곱 구성이 어떻게 다른지 볼 수 있다.",
        anchor: "vgg-configurations",
      },
      {
        name: "VGG16-D",
        english: "VGG16-D",
        definition:
          "VGG16-D는 가중치를 학습하는 합성곱층 13개와 완전연결층 3개를 합해 16개 층을 갖는 구성 D다. 3×3 합성곱은 stride 1·패딩 1로 공간 크기를 유지하고, 다섯 블록 뒤 2×2 최대 풀링이 크기를 절반으로 줄인다.",
        example:
          "블록별 합성곱층 수는 2, 2, 3, 3, 3이며 필터 수는 64, 128, 256, 512, 512다. 각 블록 뒤에서 224×224 입력의 가로·세로 크기가 112, 56, 28, 14, 7로 줄어든다.",
        anchor: "vgg-configurations",
      },
      {
        name: "conv3-512 표기",
        english: "conv3-512",
        definition:
          "VGG의 conv3-512는 한 변이 3인 3×3 필터 512개를 사용하는 합성곱층을 뜻한다. 첫 숫자는 필터의 공간 크기이고 뒤 숫자는 필터 수이므로, 이 층은 512개 출력 특징 맵을 만든다.",
        example:
          "입력 채널이 256개인 층이라면 필터 하나의 전체 크기는 3×3×256이고, 같은 크기의 필터 512개가 출력 채널 512개를 만든다.",
        anchor: "vgg-configurations",
      },
      {
        name: "3×3 필터 반복",
        english: "stacked 3×3 convolutions",
        definition:
          "작은 3×3 합성곱을 stride 1로 여러 층 쌓으면 한 출력이 바라보는 원래 입력의 범위가 넓어지고, 층마다 활성함수가 적용되어 비선형 변환도 거듭된다. 가중치 수가 줄어드는 비교는 입력·출력 채널과 출력 크기 조건을 함께 고정해 해석해야 한다.",
        example:
          "단일 채널·패딩 없음 10×10 예에서 세 번의 3×3은 7×7 수용 영역과 27개 가중치를 만들지만, 출력 위치가 달라 곱셈은 8²×9+6²×9+4²×9=1,044회다. 한 번의 7×7은 49개 가중치, 4²×49=784회이므로 작은 필터가 언제나 총 곱셈을 줄인다고 할 수 없다.",
        anchor: "vgg-filters",
      },
    ],
  },
];
