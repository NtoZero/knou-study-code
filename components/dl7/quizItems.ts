import type { QuizItem } from "@/components/dlShared/Quiz";

const lenetShape = "강의록 7강 PDF 4–11쪽 — LeNet-5 구조와 입력·C1·S2 계층";
const c3Links = "강의록 7강 PDF 11–13쪽 — C3의 선택적 입력 연결";
const rbfOutput = "강의록 7강 PDF 17–19·27쪽 — RBF 출력과 거리 기반 계산";
const preprocess = "강의록 7강 PDF 7–8·24쪽 — MNIST 모양 변환·패딩·정규화";
const labelEncoding = "강의록 7강 PDF 25–26쪽 — 원-핫과 클래스 인덱스";
const implementation = "강의록 7강 PDF 28–30쪽 — 모델 정의·학습·테스트 평가";

export const QUIZZES: QuizItem[] = [
  {
    q: "LeNet-5 입력을 준비할 때 28 × 28 그레이스케일 이미지에 각 변 2픽셀의 패딩을 더하면 입력 모양은 어떻게 되나요?",
    choices: [
      { text: "32 × 32 × 1", isCorrect: true, explanation: { basis: preprocess, reason: "높이와 너비에 위·아래, 좌·우 각각 2칸씩 0 패딩을 더하므로 28+4=32. 그레이스케일 채널은 1개." } },
      { text: "30 × 30 × 1", isCorrect: false, explanation: { basis: preprocess, reason: "패딩을 한쪽에만 더하거나, 각 변에서 2를 빼는 것으로 계산한 값. 입력 가장자리의 네 방향 모두 바깥쪽으로 확장." } },
      { text: "32 × 32 × 3", isCorrect: false, explanation: { basis: preprocess, reason: "공간 크기 32×32는 맞지만 그레이스케일 이미지는 채널 1개. RGB일 때 채널 수가 3." } },
      { text: "28 × 28 × 1", isCorrect: false, explanation: { basis: preprocess, reason: "패딩을 적용하지 않은 원래 MNIST 이미지 크기. LeNet-5의 32×32 입력을 맞추려면 네 가장자리에 2픽셀 추가." } },
    ],
    answer: 0,
    basis: "MNIST의 28 × 28 × 1 입력을 네 변에 2칸씩 패딩해 32 × 32 × 1로 준비.",
    examSkill: "이미지 텐서의 높이·너비·채널 계산",
    source: "변형",
    refs: { slides: preprocess, lecture: "강의 7강 15:22–15:53 — 28×28 MNIST와 LeNet 입력" },
  },
  {
    q: "32 × 32 × 1 입력에 5 × 5 필터 6개를 스트라이드 1, 패딩 0으로 적용하는 LeNet-5 C1의 출력 크기는?",
    choices: [
      { text: "28 × 28 × 6", isCorrect: true, explanation: { basis: lenetShape, reason: "공간 크기는 (32−5+0)÷1+1=28. 필터를 6개 적용하므로 특징 맵이 6장." } },
      { text: "28 × 28 × 1", isCorrect: false, explanation: { basis: lenetShape, reason: "공간 크기 계산은 맞지만 출력 깊이를 입력 채널 수 1로 유지한다고 착각. C1의 출력 맵 수는 필터 수 6." } },
      { text: "32 × 32 × 6", isCorrect: false, explanation: { basis: lenetShape, reason: "필터 수로 출력 깊이 6은 맞지만, 패딩 0이고 5×5 창을 이동하므로 입력보다 가로·세로가 4씩 감소." } },
      { text: "27 × 27 × 6", isCorrect: false, explanation: { basis: lenetShape, reason: "입력에서 필터 크기를 뺀 32−5=27만 셈. 가능한 시작 위치 수에는 마지막의 +1이 더해져 28." } },
    ],
    answer: 0,
    basis: "합성곱 출력은 28 × 28이고, 6개 필터가 6개의 특징 맵을 생성.",
    examSkill: "LeNet-5 계층 출력 모양 추적",
    source: "변형",
    refs: { slides: lenetShape },
  },
  {
    q: "LeNet-5 C3에서 출력 특징 맵 0번을 계산할 때 입력으로 연결되는 S2 특징 맵은 무엇인가요?",
    choices: [
      { text: "S2의 0·1·2번", isCorrect: true, explanation: { basis: c3Links, reason: "C3 맵 0은 여섯 입력 맵 전부가 아니라 S2 맵 0, 1, 2번만 받아 합성곱함. 각 출력 맵의 연결 패턴은 서로 다름." } },
      { text: "S2의 0번만", isCorrect: false, explanation: { basis: c3Links, reason: "각 C3 출력에는 하나의 입력 맵만 연결되는 구조가 아님. 출력 맵 0은 세 개의 입력 맵 0, 1, 2를 결합." } },
      { text: "S2의 0·1·2·3·4·5번 모두", isCorrect: false, explanation: { basis: c3Links, reason: "모든 입력 맵을 전부 잇지 않는 것이 C3의 선택 연결 특징. 맵 15는 여섯 맵 모두를 쓰지만 맵 0은 0, 1, 2만 사용." } },
      { text: "S2의 3·4·5번", isCorrect: false, explanation: { basis: c3Links, reason: "이 조합은 C3 맵 0의 연결이 아님. 실제 표에서 맵 0은 첫 세 입력 맵 0, 1, 2에 연결." } },
    ],
    answer: 0,
    basis: "C3는 일부 입력 맵만 선택해 연산량을 줄이고 서로 다른 조합의 상호보완 특징을 추출.",
    examSkill: "LeNet-5의 선택 연결 읽기",
    source: "변형",
    refs: { slides: c3Links, lecture: "강의 7강 20:30–20:59 — C3 연결의 계산량 배경과 현재 사용 여부" },
  },
  {
    q: "원형 LeNet-5와 강의 실습 코드의 풀링 방식을 올바르게 짝지은 것은?",
    choices: [
      { text: "원형은 평균 풀링, 실습 코드는 최대값 풀링", isCorrect: true, explanation: { basis: implementation, reason: "원래 구조의 S2·S4는 평균 풀링. 강의 코드에서는 MaxPooling2D를 사용하고, AveragePooling2D로 바꾸면 원형 방식에 맞출 수 있다고 설명." } },
      { text: "원형은 최대값 풀링, 실습 코드는 평균 풀링", isCorrect: false, explanation: { basis: implementation, reason: "원형의 평균 풀링과 실습 코드의 MaxPooling2D 사용을 서로 뒤집은 조합." } },
      { text: "원형과 실습 코드 모두 평균 풀링", isCorrect: false, explanation: { basis: implementation, reason: "논문 원형의 풀링 방식은 맞지만, 실습 코드의 층은 MaxPooling2D로 정의." } },
      { text: "원형과 실습 코드 모두 최대값 풀링", isCorrect: false, explanation: { basis: implementation, reason: "실습 코드의 MaxPooling2D와는 맞지만, 원형 LeNet-5는 AveragePooling2D를 사용." } },
    ],
    answer: 0,
    basis: "논문 원형과 강의 구현 코드에서는 풀링 연산이 다름.",
    examSkill: "논문 구조와 구현 코드 비교",
    source: "변형",
    refs: { slides: implementation, lecture: "강의 7강 53:54–54:27 — 구현 코드의 MaxPooling2D" },
  },
  {
    q: "LeNet-5 원형의 RBF 출력과 현대적인 Softmax 분류 출력을 비교한 설명으로 옳은 것은?",
    choices: [
      { text: "RBF는 입력과 가중치 사이의 거리를 이용하고, Softmax는 클래스별 점수를 확률 분포로 변환", isCorrect: true, explanation: { basis: rbfOutput, reason: "강의는 RBF를 입력과 기준 가중치 사이 거리 기반 함수로 설명하고, 현대 분류 방식의 Softmax는 각 클래스 점수를 합이 1인 확률로 해석하도록 변환한다고 구분." } },
      { text: "RBF와 Softmax 모두 항상 입력 픽셀의 밝기만 출력", isCorrect: false, explanation: { basis: rbfOutput, reason: "RBF는 입력과 가중치 사이 거리를 계산해 반응하고, Softmax는 여러 클래스 점수를 정규화. 입력 밝기를 그대로 내는 층이 아님." } },
      { text: "RBF는 클래스 확률을 합이 1이 되도록 정규화하고, Softmax는 거리만 계산", isCorrect: false, explanation: { basis: rbfOutput, reason: "두 출력의 역할을 서로 바꾼 설명. 합이 1인 클래스 확률 표현은 Softmax, 거리 기반 반응은 RBF에 해당." } },
      { text: "각 기준점에서 멀어질수록 RBF 반응값이 더 커짐", isCorrect: false, explanation: { basis: rbfOutput, reason: "Gaussian RBF는 거리 제곱에 음의 계수를 곱해 지수화하므로, 기준점에서 멀어질수록 반응값이 작아짐." } },
    ],
    answer: 0,
    basis: "RBF는 거리 기반 출력, Softmax는 클래스별 확률 분포 출력으로 구분.",
    examSkill: "원형 출력과 현대 분류 출력 비교",
    source: "변형",
    refs: { slides: rbfOutput, lecture: "강의 7강 26:48–27:03, 33:23–33:52 — RBF와 Softmax 비교" },
  },
  {
    q: "숫자 3을 10개 클래스의 원-핫 레이블로 바꾸면 어떻게 표현하나요?",
    choices: [
      { text: "[0, 0, 0, 1, 0, 0, 0, 0, 0, 0]", isCorrect: true, explanation: { basis: labelEncoding, reason: "인덱스 3에 해당하는 네 번째 위치만 1, 나머지 클래스 위치는 0으로 설정." } },
      { text: "[3]", isCorrect: false, explanation: { basis: labelEncoding, reason: "3은 클래스 인덱스 방식으로 저장한 정수 레이블. 원-핫 방식에서는 10개 위치의 벡터가 필요." } },
      { text: "[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]", isCorrect: false, explanation: { basis: labelEncoding, reason: "모든 범주를 정답으로 표시한 벡터. 단일 정답 숫자 3만 1로 표시해야 함." } },
      { text: "[0, 0, 0, 0, 0, 0, 0, 0, 0, 1]", isCorrect: false, explanation: { basis: labelEncoding, reason: "10개 클래스 중 마지막 숫자 9에 해당하는 위치만 1. 클래스 인덱스 3은 네 번째 위치." } },
    ],
    answer: 0,
    basis: "정수 레이블 3을 원-핫으로 바꾸면 길이 10의 벡터에서 클래스 3 위치 하나만 1.",
    examSkill: "정수 인덱스와 원-핫 인코딩 구분",
    source: "변형",
    refs: { slides: labelEncoding, lecture: "강의 7강 42:46–44:01 — 메모리 효율과 원-핫 사용 맥락" },
  },
  {
    q: "강의 실습에 제시된 LeNet-5 모델 학습 설정에 가장 가까운 것은?",
    choices: [
      { text: "MSE 손실, Adam 학습률 0.001, 10 에폭 학습 후 테스트 데이터 평가", isCorrect: true, explanation: { basis: implementation, reason: "슬라이드의 compile 설정은 Mean Squared Error와 Adam(0.001), fit 설정은 epochs=10과 batch_size=64. 이후 x_test, y_test로 evaluate." } },
      { text: "교차 엔트로피 손실, 확률적 경사 하강법, 학습 데이터로만 최종 평가", isCorrect: false, explanation: { basis: implementation, reason: "교차 엔트로피는 현대 Softmax 분류의 비교 항목이고, 강의 실습의 compile은 MSE+Adam. 최종 평가는 테스트 데이터로 수행." } },
      { text: "MSE 손실, Adam 학습률 0.1, 테스트 데이터로 가중치 학습", isCorrect: false, explanation: { basis: implementation, reason: "손실 종류는 MSE지만 슬라이드의 Adam 학습률은 0.001. 테스트 집합은 학습이 아니라 평가에 사용." } },
      { text: "정확도 손실, Softmax, 학습을 생략하고 검증 데이터만 평가", isCorrect: false, explanation: { basis: implementation, reason: "정확도는 측정 지표로 표시되지만 손실함수는 MSE. 모델은 fit으로 학습한 뒤 테스트 데이터에 evaluate를 적용." } },
    ],
    answer: 0,
    basis: "compile에서 손실함수와 최적화기를 정하고 fit으로 학습한 뒤 evaluate로 테스트 성능 계산.",
    examSkill: "모델 컴파일·학습·평가 순서 확인",
    source: "변형",
    refs: { slides: implementation, lecture: "강의 7강 53:54–55:07 — 모델 구성 및 원형과 코드 차이" },
  },
];
