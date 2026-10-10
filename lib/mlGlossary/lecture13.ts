import type { GlossaryTerm } from "@/lib/mlGlossaryTypes";

export const lecture13Terms: GlossaryTerm[] = [
  /* ─────────── 컴퓨터비전 응용 ─────────── */
  {
    id: "t-computer-vision",
    term: "컴퓨터비전",
    en: "computer vision",
    category: "개념",
    short: "영상 데이터를 주요 처리 대상으로 하여 사람의 시각적인 정보처리를 기계에 구현하는 분야.",
    definition:
      "컴퓨터과학의 한 분야로, 영상 데이터를 주요 처리 대상으로 하여 사람이 수행하는 다양한 시각적인 정보처리를 기계에 구현하는 방법에 관하여 연구한다. 카메라·적외선 카메라·레이더·X-ray·초음파·CCTV·블랙박스 등 여러 입력기기로부터 획득되는 영상이나 동영상을 입력으로 하는 모든 문제를 포함하므로 종류가 매우 다양하다.",
    role: "고전적으로는 잘 설계된 특징을 추출해 사용했으나, 최근에는 딥러닝 특히 CNN 모델이 월등하게 우수한 성능을 보이면서 딥러닝의 주요 응용 분야로 자리 잡았다.",
    distinctions: [
      {
        from: "자연어처리",
        how: "다루는 데이터가 영상인가 텍스트인가. 둘을 함께 다루는 문제가 시각적 문답이다.",
      },
    ],
    related: ["t-image-understanding", "t-image-transformation", "t-image-generation", "t-cnn"],
    prereqs: [],
    lectures: [13],
    basis: "교재 13.1 컴퓨터비전 · 강의록 컴퓨터비전?",
    aliases: ["CV"],
  },
  {
    id: "t-image-understanding",
    term: "영상이해",
    en: "image understanding",
    category: "개념",
    short: "영상을 입력받아 추상적인 개념이나 정량적인 정보량을 출력하는 문제.",
    definition:
      "하나의 영상을 입력받아 그 안에 포함된 의미적 정보를 분석하여 추상적인 개념이나 정량적인 정보량을 출력하는 문제. 정량적인 정보량이란 객체 정보, 패턴 클래스, 두 영상 간의 의미적 유사도 등을 말한다. 입력은 영상으로 정해지지만 출력은 다양한 형태가 될 수 있다.",
    example: "객체인식, 객체의 위치 탐지(object detection & localization), 영상설명",
    distinctions: [
      { from: "영상변환", how: "출력이 영상인가 아닌가. 영상이해의 출력은 영상이 아니다." },
    ],
    related: ["t-object-recognition", "t-object-detection", "t-image-description", "t-computer-vision"],
    lectures: [13],
    basis: "교재 13.1.1 (1) 영상이해 · 강의록 (1) 영상이해 · 정리하기 컴퓨터비전 응용",
  },
  {
    id: "t-image-transformation",
    term: "영상변환",
    en: "image transformation",
    category: "개념",
    short: "입력과 출력이 모두 영상인 문제. 분석한 정보를 바탕으로 변환된 새 영상을 낸다.",
    definition:
      "영상이해와는 달리 입력과 출력이 모두 영상이다. 하나의 영상에 포함된 정보를 분석하여 원하는 형태로 변환된 새로운 영상을 출력한다. 변환의 형태는 응용 문제에 따라 매우 다양할 수 있다.",
    example:
      "의미적 영상분할, 영상개선(초고해상도 등), 사진을 풍경화로 바꾸거나 흑백을 컬러로 바꾸거나 특정 화가의 화풍에 맞게 바꾸는 기타 변환",
    distinctions: [
      {
        from: "영상생성",
        how: "입력이 영상인가 랜덤 노이즈·자연어 문장인가. 다만 기타 변환들은 새로운 정보를 생성해 내는 영상생성 작업에 가깝다고도 볼 수 있다.",
      },
    ],
    related: ["t-semantic-segmentation", "t-image-enhancement", "t-super-resolution", "t-image-understanding"],
    lectures: [13],
    basis: "교재 13.1.1 (2) 영상변환 · 강의록 (2) 영상변환 · 정리하기 컴퓨터비전 응용",
  },
  {
    id: "t-image-generation",
    term: "영상생성",
    en: "image generation",
    category: "개념",
    short: "출력으로 새로운 영상을 만들어 내는 문제. 일종의 창작 과정.",
    definition:
      "출력으로 새로운 영상을 생성하는 것을 의미하므로 일종의 창작 과정이라고 볼 수 있다. 임의의 값(랜덤 노이즈)을 입력으로 받아 얼굴 영상을 생성하거나, 자연어 문장을 입력으로 받아 그에 포함된 의미를 표현하는 영상을 생성한다.",
    role: "목표 출력값이 따로 주어지지 않으므로 기본적인 딥러닝 모델과는 조금 다른 특별한 형태의 학습 구조가 필요하며, 이를 위해 개발된 모델이 GAN이다.",
    related: ["t-gan", "t-image-transformation"],
    lectures: [13],
    basis: "교재 13.1.1 (3) 영상생성 · 강의록 (3) 영상생성",
  },
  {
    id: "t-object-recognition",
    term: "객체인식",
    en: "object recognition",
    category: "개념",
    short: "영상에 포함된 하나의 객체를 M개 클래스 중 하나로 인식하는 문제.",
    definition:
      "주어진 영상에 포함된 하나의 객체를 인식하는 문제. 학습 데이터에 포함된 객체들의 종류가 M개라고 가정하면, 주어진 영상 데이터를 M개의 클래스로 인식하는 분류 문제에 해당한다. 앞 장들에서 살펴본 숫자인식이나 얼굴인식도 모두 객체인식의 특별한 경우라고 볼 수 있다.",
    role: "딥러닝의 능력을 입증한 첫 번째 응용이며, 그 시작이 2012년 ILSVRC다.",
    distinctions: [
      {
        from: "객체의 위치 탐지",
        how: "위치까지 내는가. 객체인식의 출력은 클래스 레이블 하나이고, 위치 탐지는 객체마다 박스를 함께 낸다.",
      },
    ],
    related: ["t-object-detection", "t-ilsvrc", "t-classification"],
    lectures: [13],
    basis: "교재 13.1.1 (1) 영상이해 · 강의록 (1) 영상이해",
  },
  {
    id: "t-object-detection",
    term: "객체 검출 및 로컬화",
    en: "object detection & localization",
    category: "개념",
    short: "영상에 포함된 복수 개의 객체를 모두 찾고 각각의 위치를 박스로 표시하는 문제.",
    definition:
      "주어진 영상을 단순히 M개 패턴 중 하나로 인식하는 것을 넘어서서, 영상에 포함된 복수 개의 객체를 찾고(object detection) 그 객체들이 영상 내에서 어디에 위치하는지도 함께 찾아서(object localization) 직사각형 박스로 그 위치를 표시하는 문제.",
    role: "방범용 CCTV나 자율주행 자동차 등에서 성공적으로 활용되고 있다.",
    example:
      "가장 기본적인 접근법은 윈도우 크기를 정해 영상 전체를 훑는 윈도우 스캐닝이지만, 지나친 계산량을 요구해 실제 문제에서 활용되기는 힘들다.",
    related: ["t-bounding-box", "t-rcnn", "t-faster-rcnn", "t-yolo", "t-region-proposal"],
    prereqs: ["pre-bounding-box"],
    lectures: [13],
    basis: "교재 13.1.1 (1) 영상이해 · 13.1.3 (1) 객체 검출을 위한 딥러닝 모델 · 강의록 객체 검출을 위한 모델",
    aliases: ["다중 객체 검출"],
  },
  {
    id: "t-image-description",
    term: "영상설명",
    en: "image description · image captioning",
    category: "개념",
    short: "영상의 의미를 종합적으로 파악해 하나의 자연어 문장으로 설명하는 문제.",
    definition:
      "영상에 포함된 의미적 정보를 종합적으로 파악하여 하나의 자연어 문장으로 설명하는 문제. 비행기 3개가 줄지어 있는 영상에 “Three planes are lining”을 출력하려면 객체를 인식해야 하고 그 위치 관계도 파악해야 하며, 나아가 그것을 설명하는 자연어 문장을 생성하는 기능도 갖추어야 한다.",
    related: ["t-show-and-tell", "t-image-understanding"],
    lectures: [13],
    basis: "교재 13.1.1 (1) 영상이해 · 13.1.3 (2) 영상설명 모델 · 정리하기 영상이해를 위한 딥러닝",
  },
  {
    id: "t-semantic-segmentation",
    term: "의미적 영상분할",
    en: "semantic image segmentation",
    category: "개념",
    short: "각 화소가 여러 범주 중에서 하나에 속하도록 분류하는 문제.",
    definition:
      "원래 영상이 입력으로 주어지면 영상 영역들을 그 의미적 유사성에 따라 몇 개의 그룹으로 묶어서 분할한다. 강의록의 표현으로는 “각 화소가 여러 범주 중에서 하나에 속하도록 분류”하는 것이다.",
    role: "교재는 이를 군집화 문제에 해당한다고 볼 수 있다고 설명하면서, 영상이 복잡해지고 객체가 많아질수록 색상에 의존한 간단한 군집화만으로는 좋은 성능을 얻을 수 없고 정교화된 딥러닝 모델이 필요하다고 덧붙인다.",
    example:
      "치과 X-Ray 영상을 충치·에나멜·상아질·치수(펄프)·금속관(크라운)·보철물 복원·신경 치료의 7개 클래스로 분할",
    distinctions: [
      {
        from: "객체 검출",
        how: "출력의 단위. 검출은 객체마다 박스 하나를 내고, 분할은 화소마다 범주 하나를 낸다.",
      },
    ],
    related: ["t-image-transformation", "t-unet", "t-image-segmentation", "t-clustering"],
    lectures: [13],
    basis: "교재 13.1.1 (2) 영상변환 · 강의록 영상변환: 영상분할",
    aliases: ["영상분할", "semantic segmentation"],
  },
  {
    id: "t-image-enhancement",
    term: "영상개선",
    en: "image enhancement",
    category: "개념",
    short: "손상되거나 왜곡된 영상을 입력받아 개선된 영상을 출력하는 문제.",
    definition:
      "입력과 출력이 모두 영상이며, 입력은 손상되거나 왜곡된 영상이고 출력은 이를 개선한 영상이다. 입력 영상에 존재하는 왜곡이나 손상의 종류에 따라 문제들이 다시 세분된다 — 어두운 영상, 잡음이 포함된 영상, 초점이 흐려진 영상 등.",
    related: ["t-super-resolution", "t-image-transformation"],
    lectures: [13],
    basis: "교재 13.1.1 (2) 영상변환 · 정리하기 컴퓨터비전 응용",
  },
  {
    id: "t-super-resolution",
    term: "초고해상도",
    en: "super resolution",
    category: "개념",
    short: "저해상도 영상을 고해상도 영상으로 복원하는 문제.",
    definition:
      "영상개선 문제 중 하나로, 입력으로 주어진 저해상도 영상을 고해상도 영상으로 변환한다. 교재는 이를 위해 개발된 딥러닝 모델로 VDSR, EDSR, DBPN, SRGAN을 든다.",
    example:
      "강의록은 SRCNN(2014), VDSR(2016), SRGAN(2017), EDSR(2017), DBPN(2018)을 나열하며, DBPN(ICCV2018)이 초고해상도 경진대회 NTIRE2018의 우승 모델이라고 소개한다.",
    related: ["t-image-enhancement", "t-gan"],
    lectures: [13],
    basis: "교재 13.1.1 (2) 영상변환 · 강의록 영상변환: Super Resolution",
    aliases: ["SR"],
  },
  {
    id: "t-vqa",
    term: "시각적 문답",
    en: "Visual Question and Answering (VQA)",
    category: "개념",
    short: "영상과 그 영상에 대한 자연어 질문을 함께 입력받아 대답을 내놓는 멀티모달 문제.",
    definition:
      "영상과 함께 그 영상에 대해 질문하는 자연어 문장이 입력으로 주어지면, 딥러닝 모델은 영상의 의미 정보와 자연어 문장의 의미 정보를 함께 분석하여 적절한 대답을 제시하도록 설계되어야 한다.",
    example: "“What is the mustache made of?” → “Bananas”",
    role:
      "영상을 처리하는 CNN 기반의 모델과 자연어를 처리하는 RNN 기반의 모델이 결합된 형태의 구성이 활용될 수 있다.",
    related: ["t-cnn", "t-recurrent-network", "t-computer-vision"],
    lectures: [13],
    basis: "교재 13.1.1 (4) 다양한 입력 형태로의 확장 · 강의록 (4) 다양한 입력형태로의 확장",
    aliases: ["VQA", "멀티모달"],
  },

  /* ─────────── 객체인식을 위한 CNN 모델 ─────────── */
  {
    id: "t-ilsvrc",
    term: "ILSVRC",
    en: "ImageNet Large-Scale Visual Recognition Challenge",
    category: "개념",
    short: "ImageNet을 이용한 객체 분류 및 위치 탐지 경진대회. 2010년 시작.",
    definition:
      "ImageNet이라는 대규모 영상 데이터베이스를 이용한 대회로, 2010년부터 매년 열리고 있다. 객체 분류 및 위치 탐지를 위한 일종의 객체인식 경진대회다. 2012년부터 딥러닝 모델이 우승을 차지했다.",
    example:
      "2010 → 28.2%, 2011 → 25.8%, 2012 AlexNet 8층 16.4%, 2013 ZFNet 8층 11.7%, 2014 VGG-19 19층 7.3%(2위), 2014 GoogLeNet 22층 6.7%, 2015 ResNet 152층 3.57%",
    related: ["t-imagenet", "t-alexnet", "t-vgg", "t-googlenet", "t-resnet"],
    prereqs: ["pre-proportion"],
    lectures: [13],
    basis: "교재 13.1.2 객체인식을 위한 CNN 모델 · 강의록 객체인식과 ILSVRC · ILSVRC",
  },
  {
    id: "t-imagenet",
    term: "ImageNet",
    category: "개념",
    short: "1,000개 클래스, 120만 개 이상의 영상과 클래스 레이블로 이루어진 대규모 영상 데이터베이스.",
    definition:
      "총 1,000개의 클래스로 구성된 120만 개 이상의 영상 데이터에 대해 각 객체의 클래스 레이블이 함께 제공된다. 세분화된 동물의 종을 비롯하여 객체의 종류가 다양할 뿐 아니라, 배경이나 객체의 위치 등도 별도의 제약 없이 촬영된 영상이다.",
    distinctions: [
      {
        from: "MNIST",
        how: "규모와 난이도. MNIST는 비교적 제한된 변형을 가진 숫자 영상이고, ImageNet은 배경과 객체의 종류가 다양해 심층 신경망 같은 정교한 분류기가 필요하다.",
      },
    ],
    related: ["t-ilsvrc", "t-mnist", "t-benchmark-data"],
    lectures: [13],
    basis: "교재 13.1.2 객체인식을 위한 CNN 모델 · 강의록 객체인식과 ILSVRC",
  },
  {
    id: "t-cnn",
    term: "합성곱 신경망",
    en: "Convolutional Neural Network (CNN)",
    category: "알고리즘",
    short: "콘볼루션층과 풀링층, 마지막의 완전연결층으로 이루어진 신경망.",
    definition:
      "콘볼루션층과 풀링층을 쌓고 마지막에 완전연결층을 두는 신경망 구조. 13강에서 다루는 객체인식 모델들은 모두 이 구조를 바탕으로 하며, 필터의 크기와 개수, 층의 수, 결합 방식을 달리하면서 발전했다.",
    role:
      "컴퓨터비전 분야에서 고전적인 방법에 비해 월등하게 우수한 성능을 보임에 따라, 컴퓨터비전이 딥러닝의 주요 응용 분야로 자리 잡게 한 모델이다.",
    related: ["t-alexnet", "t-vgg", "t-googlenet", "t-resnet", "t-lenet5", "t-deep-learning"],
    lectures: [13],
    basis: "교재 13.1 컴퓨터비전 · 13.1.2 객체인식을 위한 CNN 모델",
    aliases: ["CNN", "콘볼루션 신경망"],
  },
  {
    id: "t-alexnet",
    term: "AlexNet",
    category: "알고리즘",
    short: "2012년 ILSVRC 우승 모델. 콘볼루션층 5개와 완전연결층 3개로 이루어진 8층 모델.",
    definition:
      "딥러닝 발전의 시발점이 되었던 2012년 ILSVRC 우승 모델. LeNet과 기본 구성은 동일하여 콘볼루션층과 풀링층, 마지막의 완전연결층을 가지며, 그 필터의 크기와 개수 등이 LeNet에 비해 크게 확장되었다. 당시에는 메모리 한계로 인해 2개의 CNN 구조로 나눈 듀얼 네트워크였고, 현재는 하나로 합쳐졌다.",
    example:
      "학습 설정 — 미니배치 크기 128, 모멘텀 0.9, 드롭아웃 0.5, 학습률 0.01(검증오차가 증가하면 1/10씩 감소), 정규항의 조정 파라미터 0.0005, 가중치 초기화는 평균 0·표준편차 0.01의 가우시안 분포",
    distinctions: [
      {
        from: "교재 본문의 ‘5개 층을 가진 AlexNet’",
        how: "콘볼루션층만 센 표현이다. ILSVRC 표와 정리하기는 완전연결층 3개를 포함한 8층으로 적는다.",
      },
    ],
    related: ["t-ilsvrc", "t-lenet5", "t-cnn", "t-momentum", "t-learning-rate", "t-weight-initialization"],
    lectures: [13],
    basis: "교재 13.1.2 객체인식을 위한 CNN 모델 · 강의록 AlexNet, Winner of 2012 · 정리하기",
    aliases: ["SuperVision"],
  },
  {
    id: "t-vgg",
    term: "VGG",
    category: "알고리즘",
    short: "2014년 ILSVRC 2위 모델. 층수와 필터 크기에 차이를 둔 여러 버전을 공개 소스로 제공한다.",
    definition:
      "ILSVRC2014에서 2위를 차지한 모델. 층수와 필터 크기에 차이를 둔 다양한 버전의 모델에 대하여 실험을 수행하고 ImageNet으로 학습된 모델들을 공개 소스로 제공하고 있어, 개발자들이 자신의 목적에 맞게 모델을 선택하여 활용하기 쉽다. VGG-11, VGG-13, VGG-16, VGG-19 등의 버전이 존재한다.",
    example:
      "VGG-16의 특징맵 크기 — 224×224×3 → 224×224×64 → 112×112×128 → 56×56×256 → 28×28×512 → 14×14×512 → 7×7×512 → 1×1×4096 → 1×1×1000",
    related: ["t-ilsvrc", "t-cnn", "t-softmax"],
    lectures: [13],
    basis: "교재 13.1.2 객체인식을 위한 CNN 모델 · 강의록 VGG Net · 정리하기",
  },
  {
    id: "t-googlenet",
    term: "GoogLeNet",
    category: "알고리즘",
    short: "2014년 ILSVRC 우승 모델. 인셉션 모듈을 쓴 22층 구조.",
    definition:
      "2014년에 1위를 차지한 모델로, 구글에서 개발하여 GoogLeNet이라고 명명하였다. 인셉션 모듈이라는 특이한 구조를 가지는데, 한 층에서 한 종류의 필터 크기만 사용하는 다른 모델과 달리 서로 다른 크기의 필터들을 사용하고 이를 효과적으로 결합하는 방법을 제시하였다.",
    role:
      "총 22개 층으로 이루어진 깊은 모델임에도 불구하고 AlexNet에 비해 12분의 1 정도의 파라미터만 가지는 효율적인 표현이 가능하였다. 강의록은 9개의 인셉션 모듈과 보조 분류기를 가진 구조로 보여 준다.",
    related: ["t-inception-module", "t-ilsvrc", "t-show-and-tell", "t-cnn"],
    lectures: [13],
    basis: "교재 13.1.2 객체인식을 위한 CNN 모델 · 강의록 GoogLeNet · 정리하기",
    aliases: ["InceptionNet"],
  },
  {
    id: "t-inception-module",
    term: "인셉션 모듈",
    en: "inception module",
    category: "알고리즘",
    short: "한 층에서 서로 다른 크기의 필터들을 함께 쓰고 그 결과를 채널 축으로 이어 붙이는 모듈.",
    definition:
      "한 층에서 서로 다른 크기의 필터들을 사용하고 이를 효과적으로 결합하는 모듈. 강의록 그림에서는 28 × 28 × 192 입력에 대해 1 × 1 CONV(64), 1 × 1 → 3 × 3 CONV(128), 1 × 1 → 5 × 5 CONV(32), MaxPool 3 × 3 s=1 → 1 × 1 CONV(32)의 네 갈래를 두고, DepthConcat으로 이어 붙여 28 × 28 × 256을 낸다.",
    role:
      "3 × 3, 5 × 5 콘볼루션 앞에 1 × 1 콘볼루션을 두어 차원 축소를 통해 계산 비용을 줄인다.",
    formula: [
      { expr: "64 + 128 + 32 + 32 = 256", note: "네 갈래의 채널 수를 이어 붙인 결과" },
    ],
    distinctions: [
      {
        from: "잔차 모듈",
        how: "노리는 바가 다르다. 인셉션 모듈은 계산 효율을, 잔차 모듈은 깊은 층의 학습 가능성을 겨냥한다.",
      },
    ],
    related: ["t-googlenet", "t-residual-module"],
    lectures: [13],
    basis: "교재 13.1.2 객체인식을 위한 CNN 모델 · 강의록 GoogLeNet — 인셉션 모듈",
  },
  {
    id: "t-resnet",
    term: "ResNet",
    category: "알고리즘",
    short: "2015년 ILSVRC 우승 모델. 잔차 모듈로 152층까지 확장했다.",
    definition:
      "층이 깊어질수록 오류 역전파 학습이 어려워지는 문제를 잔차 모듈로 극복하여 모델의 층수를 152개까지 확장하는 데 성공한 모델. 2015년 대회의 승자이며, ILSVRC2015에서 오류율 3.57%로 GoogLeNet의 6.7%를 50% 정도에 가깝게 감소시켰고 사람의 인식에 버금가는 성능을 보였다.",
    role:
      "34개 층을 가진 ResNet-34와 같은 층수를 가진 기본 모델, 그리고 VGG-19를 비교하여 잔차 모듈의 효과를 입증했다. 층의 개수를 달리한 여러 버전이 공개 소스로 제공된다.",
    example:
      "ResNet 이후에도 모델의 혁신적인 변화는 크지 않고, 계산량을 줄인 가벼운 모델이나 WideResNet처럼 각 층의 규모를 넓혀 성능을 개선한 모델 등이 개발되었다.",
    related: ["t-residual-module", "t-skip-connection", "t-ilsvrc", "t-cnn"],
    lectures: [13],
    basis: "교재 13.1.2 객체인식을 위한 CNN 모델 · 강의록 ResNet · 정리하기 · 공식 연습문제 Q1",
    aliases: ["Residual Net"],
  },
  {
    id: "t-residual-module",
    term: "잔차 모듈",
    en: "residual module",
    category: "알고리즘",
    short: "2개 층을 뛰어넘는 스킵 연결을 두어 출력이 H(𝒙) = F(𝒙) + 𝒙가 되게 한 모듈.",
    definition:
      "2개 층을 뛰어넘는 스킵 연결을 가지며, 모듈의 출력은 2개 층을 거쳐서 나온 출력 F(𝒙)에 해당 모듈의 원래 입력 𝒙가 더해져서 결정된다. 즉 이 모듈에서 학습해야 하는 정보는 원하는 출력값 전체 F(𝒙) + 𝒙가 아니라 원하는 출력과 입력 간의 잔차 F(𝒙)이다.",
    formula: [
      { expr: "H(𝒙) = F(𝒙) + 𝒙", note: "모듈의 출력" },
      { expr: "F(𝒙) = H(𝒙) − 𝒙", note: "‘잔차’ — 각 모듈이 실제로 학습하는 부분" },
      { expr: "∂H/∂𝒙 = ∂F/∂𝒙 + 1", note: "곱해지는 값에 1이 붙어 신호가 0으로 사라지지 않는다" },
    ],
    role:
      "각 모듈은 잔차 부분만 학습하면 되고, 스킵 연결을 통해 오차 신호도 좀 더 효과적으로 전달된다.",
    related: ["t-resnet", "t-skip-connection", "t-unet", "t-inception-module"],
    prereqs: ["pre-gradient"],
    lectures: [13],
    basis: "교재 13.1.2 객체인식을 위한 CNN 모델 · 강의록 ResNet — 잔차 모듈",
  },
  {
    id: "t-skip-connection",
    term: "스킵 연결",
    en: "skip connection",
    category: "개념",
    short: "중간 층들을 건너뛰어 입력을 그대로 뒤쪽에 전달하는 연결.",
    definition:
      "잔차 모듈에서 2개 층을 뛰어넘어 입력 𝒙를 모듈의 출력에 그대로 더해 주는 연결. U-Net에서도 중간층을 중심으로 대칭이 되는 입력 부분과 출력 부분 사이에 같은 성격의 연결이 존재한다.",
    role:
      "매우 깊은 층을 가진 네트워크도 성능 저하 없이 학습이 가능해진다. 잔차 블록의 학습이 용이해지고, 스킵 연결을 통해 오차 신호가 소멸되는 현상이 완화되는 등으로 인해 효과적인 역전파가 가능하다.",
    related: ["t-residual-module", "t-resnet", "t-unet", "t-backpropagation"],
    lectures: [13],
    basis: "교재 13.1.2 ResNet · 13.1.4 U-Net · 강의록 ResNet — 이점 · 정리하기",
  },

  /* ─────────── 영상이해를 위한 딥러닝 ─────────── */
  {
    id: "t-region-proposal",
    term: "관심 영역과 영역 제안",
    en: "Region of Interest (ROI) · region proposal",
    category: "개념",
    short: "객체가 있을 만한 영역의 후보 집합. 인식은 이 후보들에 대해서만 수행한다.",
    definition:
      "입력 이미지에 대해 기초적인 영상처리 기법들(분할, 에지, 색상 등)을 적용하여 객체가 있을 만한 관심 영역의 후보 집합을 추출한 것. R-CNN은 각 영역에 대해 객체인식 신경망으로 인식을 수행함으로써 실제로 객체가 있는 영역 후보들을 고른다.",
    distinctions: [
      {
        from: "윈도우 스캐닝",
        how: "영상 전체를 규칙적으로 훑는 대신 가능성 있는 자리만 골라 본다. 그래도 R-CNN 계열에서는 최대 2,000개의 후보에 대한 인식이 이루어져야 한다.",
      },
    ],
    related: ["t-rcnn", "t-faster-rcnn", "t-yolo", "t-object-detection"],
    lectures: [13],
    basis: "교재 13.1.3 (1) 객체 검출을 위한 딥러닝 모델 · 강의록 객체 검출을 위한 모델 · YOLO",
    aliases: ["ROI", "후보 영역 제안"],
  },
  {
    id: "t-rcnn",
    term: "R-CNN",
    en: "Region-based Convolutional Network",
    category: "알고리즘",
    short: "관심 영역 후보를 먼저 뽑고 영역마다 객체인식을 수행하는 검출 모델.",
    definition:
      "입력 이미지에 대해 기초적인 영상처리 기법들을 적용하여 관심 영역(ROI)의 후보 집합을 추출하고, 각 영역에 대해 기존에 만들어진 객체인식 신경망으로 인식을 수행함으로써 실제로 객체가 있는 영역 후보들을 고르는 방식. 네 단계는 입력 영상 → 영역 후보 추출(~2k) → CNN 특징 계산 → 영역 분류다.",
    distinctions: [
      {
        from: "Faster R-CNN",
        how: "특징 계산의 순서. R-CNN은 영역마다 따로 특징을 뽑고, Faster R-CNN은 앞 단계에서 먼저 특징을 뽑아 병렬적으로 처리한다.",
      },
    ],
    related: ["t-faster-rcnn", "t-yolo", "t-region-proposal"],
    lectures: [13],
    basis: "교재 13.1.3 (1) 객체 검출을 위한 딥러닝 모델 · 강의록 R-CNN, Faster R-CNN · 정리하기",
  },
  {
    id: "t-faster-rcnn",
    term: "Faster R-CNN",
    category: "알고리즘",
    short: "앞 단계에서 먼저 특징을 뽑아 병렬 처리하는 R-CNN의 후속 모델.",
    definition:
      "R-CNN의 높은 시간 복잡도를 해결하기 위해, 앞 단계에서 먼저 특징을 뽑아 병렬적으로 처리하는 방식의 기법을 적용한 모델. 인식 성능과 계산 시간 면에서 적절한 타협안을 제공하였다. 구조는 conv layers → Region Proposal Network → RoI pooling → classifier로 이루어진다.",
    example:
      "R-CNN에 비해 많은 시간 단축을 이루었으나, 기본적으로 최대 2,000개의 ROI에 대한 인식이 이루어져야 하므로 여전히 동영상에 대한 온라인 처리를 제공할 만한 속도를 달성하지는 못하였다.",
    related: ["t-rcnn", "t-yolo", "t-region-proposal"],
    lectures: [13],
    basis: "교재 13.1.3 (1) 객체 검출을 위한 딥러닝 모델 · 강의록 R-CNN, Faster R-CNN · 정리하기",
  },
  {
    id: "t-yolo",
    term: "YOLO",
    en: "You Only Look Once",
    category: "알고리즘",
    short: "검출과 인식을 한 번에 수행하는 모델. 영역 제안을 쓰지 않아 실시간 동영상에 쓸 수 있다.",
    definition:
      "검출과 인식을 여러 번 반복하지 않고 한 번에 모두 이루어지도록 설계한 모델(2016). R-CNN과 달리 ROI 또는 영역 제안이 사용되지 않는다. 기본적인 구조는 객체인식을 위한 CNN 모델과 크게 다르지 않으며, 다만 마지막 출력값의 구성이 다르다. 전체 영상을 그리드로 나누고 그리드별로 객체의 유무와, 객체가 있는 경우 바운딩 박스의 위치 등을 결정하도록 정의한다.",
    formula: [
      { expr: "7 × 7 × (5 × 2 + 20) = 7 × 7 × 30 = 1470", note: "그리드 7×7, 칸마다 박스 2개와 클래스 20개" },
    ],
    example:
      "박스 하나는 x, y(칸 안에서의 중심 좌표), w, h(영상 크기 기준 너비·높이), c(박스 신뢰도)의 5개 값으로 표현된다. 입력은 448 × 448 × 3이고 완전연결층의 출력 1470 × 1을 7 × 7 × 30으로 reshape한다.",
    distinctions: [
      {
        from: "Faster R-CNN",
        how: "속도와 성능의 맞바꿈. YOLO는 검출 성능이 다소 떨어지나 실시간 동영상에서도 검출 가능할 정도로 빠르다.",
      },
    ],
    related: ["t-bounding-box", "t-region-proposal", "t-faster-rcnn", "t-googlenet"],
    prereqs: ["pre-bounding-box", "pre-conditional-prob"],
    lectures: [13],
    basis: "교재 13.1.3 (1) 객체 검출을 위한 딥러닝 모델 · 강의록 YOLO · 공식 연습문제 Q2",
  },
  {
    id: "t-bounding-box",
    term: "바운딩 박스",
    en: "bounding box (bbox)",
    category: "개념",
    short: "객체가 위치하는 자리를 나타내는 직사각형. 검출 모델의 출력에 담긴다.",
    definition:
      "객체 검출의 출력값에 객체의 클래스명과 함께 담기는, 객체가 위치하는 직사각형. YOLO에서는 그리드 칸마다 박스를 몇 개씩 예측하며, 박스 하나는 중심 좌표 x·y, 너비 w, 높이 h, 그리고 박스 안에 객체가 있을 확률인 신뢰도 c로 표현된다.",
    related: ["t-yolo", "t-object-detection"],
    prereqs: ["pre-bounding-box"],
    lectures: [13],
    basis: "교재 13.1.3 (1) 객체 검출을 위한 딥러닝 모델 · 강의록 YOLO",
    aliases: ["bbox", "직사각형 박스"],
  },
  {
    id: "t-show-and-tell",
    term: "Show and Tell",
    category: "알고리즘",
    short: "영상을 설명하는 자연어 문장을 생성하는 최초의 모델. CNN과 RNN이 결합된 구조.",
    definition:
      "영상에 포함된 의미를 종합적으로 이해하고 이를 설명하는 자연어 문장을 생성하는 최초의 모델. 영상을 입력받아 설명 문장을 출력으로 내기 위해 영상처리를 위한 CNN 모델과 문장생성을 위한 RNN 모델이 결합된 구조를 가진다.",
    role:
      "영상처리를 위한 모델로 GoogLeNet을 사용하되, 인식 결과(클래스 레이블)를 도출하는 층이 아닌 그 이전 층의 출력을 일종의 특징값으로 취하여 RNN의 입력으로 제공한다. 이 특징값에 담긴 의미 정보가 자연어 문장으로 출력되는데, 이는 한 번에 한 단어씩 생성하는 LSTM의 시퀀스로 구현된다.",
    example:
      "“A group of people shopping at an outdoor market. There are many vegetables at the fruit stand.” (Vinyals et al., CVPR 2015) · 후속 모델로 Show, Attend and Tell(Xu et al., ICML 2015)이 있다.",
    related: ["t-image-description", "t-googlenet", "t-recurrent-network"],
    prereqs: ["pre-column-vector"],
    lectures: [13],
    basis: "교재 13.1.3 (2) 영상설명 모델 · 강의록 영상설명모델 · 공식 연습문제 Q4",
  },

  /* ─────────── 영상변환 및 생성을 위한 딥러닝 ─────────── */
  {
    id: "t-autoencoder",
    term: "오토인코더",
    en: "autoencoder",
    category: "알고리즘",
    short: "입력과 같은 형태의 출력을 내며 중간층에서 축약된 특징을 얻는 대칭 구조의 모델.",
    definition:
      "입력 𝑥를 받고 출력도 입력과 같은 형태의 𝑥′를 가지며, 중간층을 중심으로 대칭 구조를 가진다. 이때 중간층의 크기는 입력에 비해 작아지도록 설계한다. 출력 𝑥′가 𝑥와 같아지도록 학습함으로써, 중간층의 값 𝑧는 𝑥에 포함된 정보를 압축하였다가 다시 원래대로 복원할 수 있는 축약된 특징이 된다.",
    role:
      "𝑥에서 𝑧까지의 처리를 인코딩, 𝑧에서 다시 𝑥′까지의 처리를 디코딩이라 한다. 입력과 출력이 기본적으로 같은 영상이므로 클래스 레이블과 같은 목표 출력을 따로 만들어 줄 필요가 없어, 기본 오토인코더는 일종의 비지도학습을 수행하는 모델이라고 볼 수 있다.",
    distinctions: [
      {
        from: "GAN",
        how: "출력을 평가하는 방식. 오토인코더는 입력 자신이 목표 출력이지만, GAN은 목표 출력이 없어 판별기가 손실 신호를 만들어 준다.",
      },
    ],
    example:
      "기본적인 오토인코더는 다층 퍼셉트론과 같은 완전연결층으로 정의되었으나, 영상 데이터의 경우에는 콘볼루션층을 더 많이 사용한다. 영상분할이나 영상변환을 위한 목적으로 사용하는 경우에는 목표 출력값이 필요하다.",
    related: ["t-unet", "t-gan", "t-unsupervised-learning", "t-feature-extraction"],
    lectures: [13],
    basis: "교재 13.1.4 (1) 오토인코더 모델 · 강의록 오토인코더모델 · 정리하기",
    aliases: ["인코더", "디코더"],
  },
  {
    id: "t-unet",
    term: "U-Net",
    category: "알고리즘",
    short: "의료영상의 영상분할을 위해 개발된, CNN 기반의 변형된 오토인코더 구조.",
    definition:
      "CNN 기반의 변형된 오토인코더 구조를 가진 모델로, 의료영상에 대한 영상분할을 위해 개발되었다. 입력은 세포 영상과 같은 영상이 주어지고, 출력은 영상분할이 수행된 결과가 마스킹된 영상이다. 구조적 특징은 contracting path(“인코더”), expanding path(“디코더”), skip connection 세 가지다.",
    role:
      "572 × 572 크기의 2D 입력에서 시작하여 층을 거치면서 점점 작아져서 중간층에서 1024차원의 특징으로 변환되고, 이어서 같은 방식을 되짚어서 다시 확대되는 U자형 구조를 가진다. 중간층을 중심으로 대칭이 되는 입력 부분과 출력 부분 사이에 스킵 연결이 존재하는 일종의 잔차 모듈의 특성도 반영하였다.",
    distinctions: [
      {
        from: "GAN",
        how: "구성요소가 다르다. U-Net은 두 경로와 스킵 연결을 가지고, GAN은 생성기와 판별기를 가진다. 공식 연습문제가 바로 이 지점을 묻는다.",
      },
    ],
    example:
      "처음에 의료영상의 분할을 위해 개발되었으나, 이후 영상개선 등의 다른 목적을 위해 유사 구조의 모델이 다양하게 개발되었다.",
    related: ["t-autoencoder", "t-semantic-segmentation", "t-skip-connection", "t-residual-module"],
    lectures: [13],
    basis: "교재 13.1.4 U-Net · 강의록 오토인코더모델 — U-Net · 공식 연습문제 Q3",
  },
  {
    id: "t-gan",
    term: "GAN",
    en: "Generative Adversarial Network",
    category: "알고리즘",
    short: "생성기와 판별기가 상반된 목적으로 번갈아 학습하는 영상생성 모델.",
    definition:
      "“생성적 적대/대립 신경망”. 영상을 생성해 내는 모듈인 생성기(Generator, G)와 생성된 영상에 대한 평가를 수행하는 판별기(Discriminator, D)로 구성된다. 기본적으로 영상생성을 위해 개발되었으나 이후 영상변환을 위한 모델로도 확장되었다. Ian Goodfellow 등, NIPS 2014.",
    role:
      "G의 출력은 새로운 영상을 만들어 낸 것이므로 그에 대한 목표 출력값이 따로 주어지지 않는다. 따라서 학습을 위해서는 G의 출력값을 평가하여 손실 신호를 만들어 주는 방법이 필요하고, 판별기 D가 그 역할을 한다. 생성기 G의 학습 목적은 최대한 진짜에 가까운 영상을 만들어 판별기 D를 속이는 것이다.",
    example:
      "판별기는 학습 데이터로부터 추출한 영상에 대해서는 1, G로부터 생성된 영상은 0의 출력을 내도록 학습하고, 생성기는 자신이 생성한 영상에 대해 판별기가 1의 출력을 내도록 학습한다. 이 목적에 맞추어 손실함수를 정의한 후 D와 G를 번갈아 가면서 학습을 진행한다.",
    distinctions: [
      {
        from: "오토인코더",
        how: "입력. GAN의 생성기는 랜덤 노이즈를 받고, 오토인코더는 복원할 대상 영상 자체를 받는다.",
      },
    ],
    related: ["t-generator", "t-discriminator", "t-image-generation", "t-autoencoder"],
    prereqs: ["pre-gaussian"],
    lectures: [13],
    basis: "교재 13.1.4 (2) GAN 모델 · 강의록 GAN 모델 · GAN의 학습 · 공식 연습문제 Q5",
    aliases: ["생성적 적대 신경망", "생성적 대립 신경망"],
  },
  {
    id: "t-generator",
    term: "생성기",
    en: "Generator (G)",
    category: "개념",
    short: "주어진 랜덤 입력으로부터 영상을 생성하는 GAN의 모듈. 목표 출력값이 없다.",
    definition:
      "GAN에서 영상을 생성해 내는 모듈. 주어진 랜덤 입력으로부터 영상을 생성하며, 그 출력에 대한 목표 출력값은 따로 주어지지 않는다. 학습 목적은 판별기를 속일 수 있는 최대한 진짜 같은 영상을 만드는 것이다.",
    related: ["t-gan", "t-discriminator"],
    lectures: [13],
    basis: "교재 13.1.4 (2) GAN 모델 · 강의록 GAN 모델",
  },
  {
    id: "t-discriminator",
    term: "판별기",
    en: "Discriminator (D)",
    category: "개념",
    short: "입력 영상이 실제인지 생성기가 만든 가짜인지 판별해 손실 신호를 만들어 주는 모듈.",
    definition:
      "입력으로 주어지는 영상이 실제 영상인지 아니면 G에 의해 만들어진 가짜 영상인지를 판별하는 모듈. G의 출력값을 평가하여 손실(오류) 신호를 만들어 주는 역할을 한다. 학습 데이터에서 온 영상에는 1, G가 만든 영상에는 0을 내도록 학습한다.",
    role:
      "생성기만으로는 목표 출력값이 없어 학습이 성립하지 않으므로, 판별기는 그 빈자리를 메우기 위해 추가된 모듈이다.",
    related: ["t-gan", "t-generator"],
    lectures: [13],
    basis: "교재 13.1.4 (2) GAN 모델 · 강의록 GAN 모델 · GAN의 학습",
  },
];
