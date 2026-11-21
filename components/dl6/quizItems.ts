import type { QuizItem } from "@/components/dlShared/Quiz";

const cnnBasics = "강의록 6강 PDF 14–17·22–24쪽 — CNN과 MLP, 합성곱 필터와 채널";
const shapeRules = "강의록 6강 PDF 25–28쪽 — 스트라이드·패딩·특징 맵의 크기";
const poolingFlatten = "강의록 6강 PDF 31–38쪽 — 풀링·완전연결층·Flatten";
const visionTasks = "강의록 6강 PDF 9–11쪽 — 컴퓨터 비전에서 CNN 적용";

export const QUIZZES: QuizItem[] = [
  {
    q: "같은 크기의 이미지를 분류할 때 CNN이 MLP보다 공간 구조를 다루기 좋은 이유는 무엇인가요?",
    choices: [
      { text: "픽셀 위치를 모두 무시하고 이미지 전체의 평균만 비교하기 때문", isCorrect: false, explanation: { basis: cnnBasics, reason: "평균만 남기면 모서리·윤곽처럼 위치 관계를 가진 특징을 잃음. CNN은 이웃한 픽셀에 창을 적용해 공간적 패턴을 계산함." } },
      { text: "국소 영역에 필터를 반복 적용해 공간 패턴을 잡고, 같은 필터 가중치를 여러 위치에서 공유하기 때문", isCorrect: true, explanation: { basis: cnnBasics, reason: "필터는 입력의 여러 위치를 살피며 특징을 추출하고, 동일한 가중치 묶음을 재사용함. 2차원 배열을 처음부터 긴 벡터로 펼치는 MLP와 다른 점." } },
      { text: "합성곱 필터가 학습 전에 정해진 윤곽선 모양으로 고정되기 때문", isCorrect: false, explanation: { basis: cnnBasics, reason: "전통적 영상 필터는 사람이 값을 정할 수 있지만, CNN 필터 가중치는 학습 과정에서 결정됨. 고정된 에지 필터만 사용하는 것이 아님." } },
      { text: "이미지의 높이와 너비가 층을 지날 때마다 반드시 커지기 때문", isCorrect: false, explanation: { basis: shapeRules, reason: "출력 공간 크기는 필터·패딩·스트라이드의 설정에 따라 달라짐. CNN의 장점은 크기를 늘리는 데 있지 않음." } },
    ],
    answer: 1,
    basis: "국소적인 합성곱 연산과 가중치 공유가 이미지의 공간 특징을 효율적으로 학습하는 핵심.",
    examSkill: "MLP와 CNN의 입력 구조 구분",
    source: "변형",
    refs: { slides: cnnBasics, lecture: "강의 6강 23:32–24:01 — 공간 특징과 MLP 비교" },
  },
  {
    q: "입력 특징 맵이 8 × 8이고 3 × 3 필터, 스트라이드 2, 패딩 1을 적용합니다. 한 변의 출력 크기는 얼마인가요?",
    choices: [
      { text: "3", isCorrect: false, explanation: { basis: shapeRules, reason: "분자를 8−3+2×1=7로 계산한 뒤 스트라이드 2로 나누면 3.5임. 마지막에 1을 더하지 않아 한 위치를 빠뜨림." } },
      { text: "4", isCorrect: true, explanation: { basis: shapeRules, reason: "⌊(8−3+2×1)÷2⌋+1 = ⌊3.5⌋+1 = 4. 패딩이 입력의 양쪽에 각각 1칸 더해짐." } },
      { text: "5", isCorrect: false, explanation: { basis: shapeRules, reason: "분수 3.5를 올림해 4로 만든 뒤 시작 위치의 1을 더하면 5가 됨. 출력 크기 계산은 올림이 아니라 내림(⌊ ⌋)을 적용하므로 이 값은 맞지 않음." } },
      { text: "7", isCorrect: false, explanation: { basis: shapeRules, reason: "입력에서 필터 크기를 빼고 패딩을 더한 분자만 계산한 값. 스트라이드로 나누고 시작 위치의 1을 더해야 출력 칸 수가 됨." } },
    ],
    answer: 1,
    basis: "출력 한 변 = ⌊(입력 − 필터 + 2 × 패딩) ÷ 스트라이드⌋ + 1.",
    examSkill: "합성곱 출력 크기 계산",
    source: "변형",
    refs: { slides: shapeRules, lecture: "강의 6강 38:20–38:45 — 합성곱 창의 단계별 이동" },
  },
  {
    q: "RGB 입력에 필터 5개를 적용한 합성곱층의 출력 특징 맵은 어떤 깊이를 가지나요?",
    choices: [
      { text: "1개 — RGB 채널이 합쳐진 뒤 필터 수와 무관하게 한 장만 남음", isCorrect: false, explanation: { basis: cnnBasics, reason: "필터 하나가 R·G·B 각 채널에서 계산한 결과를 합쳐 특징 맵 하나를 냄. 하지만 필터를 5개 썼으므로 서로 다른 출력 맵 5개가 생김." } },
      { text: "3개 — 출력 깊이는 입력의 RGB 채널 수와 같음", isCorrect: false, explanation: { basis: cnnBasics, reason: "3은 입력 채널 수. 각 필터는 세 입력 채널을 모두 고려하지만, 출력 맵 수는 입력 채널 수가 아니라 필터 수로 정해짐." } },
      { text: "5개 — 필터 하나가 특징 맵 하나를 만듦", isCorrect: true, explanation: { basis: cnnBasics, reason: "각 필터는 입력 채널마다 별도 가중치로 연산한 결과를 합쳐 특징 맵 한 장을 만듦. 다섯 필터의 출력 깊이는 5." } },
      { text: "15개 — RGB 세 채널마다 필터 5개씩 독립된 맵을 출력함", isCorrect: false, explanation: { basis: cnnBasics, reason: "필터의 입력 가중치는 채널마다 있지만 채널별 계산값을 합산해 맵 하나를 구성함. 3×5로 나누어 출력하지 않음." } },
    ],
    answer: 2,
    basis: "입력 채널 수는 각 필터의 깊이를 정하고, 필터 수는 출력 특징 맵의 수를 정함.",
    examSkill: "입력 채널과 출력 채널 구분",
    source: "변형",
    refs: { slides: cnnBasics, lecture: "강의 6강 30:07–30:53 — 입력 채널·필터·커널" },
  },
  {
    q: "2 × 2 최대값 풀링을 4개의 채널에 적용하면 어떤 변화가 일어나나요?",
    choices: [
      { text: "높이와 너비가 줄고 채널 수 4는 그대로 유지됨", isCorrect: true, explanation: { basis: poolingFlatten, reason: "풀링은 각 채널에 독립적으로 적용되어 공간 크기를 다운샘플링함. 채널을 합치거나 제거하는 연산이 아님." } },
      { text: "높이와 너비는 그대로이고 채널 수가 1로 합쳐짐", isCorrect: false, explanation: { basis: poolingFlatten, reason: "풀링은 한 창에서 대표값을 뽑아 공간 위치 수를 줄임. 서로 다른 채널을 하나로 합치는 기능은 없음." } },
      { text: "높이와 너비가 줄고 채널 수도 필터 수만큼 새로 학습됨", isCorrect: false, explanation: { basis: poolingFlatten, reason: "풀링에는 합성곱 필터처럼 학습하는 가중치가 없음. 기존 각 채널의 창마다 최댓값을 선택해 크기를 줄임." } },
      { text: "채널마다 학습되는 2 × 2 필터로 합성곱함", isCorrect: false, explanation: { basis: poolingFlatten, reason: "최대값 풀링은 창 안의 값 중 최댓값을 선택하는 고정 연산. 2 × 2 가중치 행렬을 학습하는 합성곱과 구분됨." } },
    ],
    answer: 0,
    basis: "풀링은 공간 크기를 줄이고, 풀링에 전달된 채널별 특징 맵은 각각 유지.",
    examSkill: "풀링의 대상 축과 역할 구분",
    source: "변형",
    refs: { slides: poolingFlatten, lecture: "강의 6강 54:29–54:57 — 풀링의 공간 축소" },
  },
  {
    q: "합성곱·풀링으로 얻은 5 × 5 × 8 특징 맵을 완전연결층에 넣기 직전, 평탄화 결과의 원소 수는?",
    choices: [
      { text: "8개 — 각 채널을 대표하는 값 하나만 선택", isCorrect: false, explanation: { basis: poolingFlatten, reason: "평탄화는 채널별 대표값을 뽑는 선택 연산이 아님. 모든 공간 위치와 채널의 값을 한 줄로 재배열함." } },
      { text: "25개 — 높이와 너비의 위치만 이어 붙임", isCorrect: false, explanation: { basis: poolingFlatten, reason: "25는 한 채널의 공간 위치 수. 여덟 채널의 값까지 포함해야 하므로 25×8개가 됨." } },
      { text: "200개 — 5 × 5 × 8의 모든 값을 1차원으로 펼침", isCorrect: true, explanation: { basis: poolingFlatten, reason: "5×5×8 = 200. 평탄화는 원소를 빼지 않고 재배열해 1차원 벡터를 만듦." } },
      { text: "1,000개 — 공간 위치마다 채널 수를 다시 제곱함", isCorrect: false, explanation: { basis: poolingFlatten, reason: "텐서의 각 축 원소 수를 한 번씩 곱하면 됨. 채널 수를 추가로 제곱하지 않음." } },
    ],
    answer: 2,
    basis: "평탄화 벡터 길이는 높이 × 너비 × 채널 수이며, 원소 개수는 보존.",
    examSkill: "3차원 특징 맵의 벡터 크기 판단",
    source: "변형",
    refs: { slides: poolingFlatten },
  },
  {
    q: "한 장의 이미지에서 여러 종류의 물체를 각각 찾아 범주와 위치를 표시하려면 어떤 출력 과제가 알맞나요?",
    choices: [
      { text: "분류 — 이미지 전체에 대표 범주 하나를 붙임", isCorrect: false, explanation: { basis: visionTasks, reason: "분류는 이미지 안의 대표 객체를 하나의 범주로 나누는 과제. 여러 객체 각각의 위치까지 내지 않음." } },
      { text: "분류와 지역화 — 한 객체의 범주와 위치를 함께 찾음", isCorrect: false, explanation: { basis: visionTasks, reason: "분류+지역화는 이미지 안에 객체 하나가 있을 때 범주와 그 위치를 다룸. 여러 객체를 각각 찾는 조건과 다름." } },
      { text: "객체 탐지 — 객체마다 범주와 위치를 출력", isCorrect: true, explanation: { basis: visionTasks, reason: "객체 탐지는 한 이미지 안의 여러 객체의 존재를 파악하고, 각 객체의 위치 정보를 함께 출력함." } },
      { text: "인스턴스 분할 — 범주별 픽셀 영역만 만들고 개별 객체는 합침", isCorrect: false, explanation: { basis: visionTasks, reason: "인스턴스 분할은 픽셀 수준의 영역을 객체별로 구분함. 같은 범주의 여러 물체도 Dog 1, Dog 2처럼 다른 개체로 나눔." } },
    ],
    answer: 2,
    basis: "다중 객체의 범주와 위치를 함께 예측하는 과제가 객체 탐지.",
    examSkill: "분류·지역화·탐지·분할 비교",
    source: "변형",
    refs: { slides: visionTasks, lecture: "강의 6강 17:02–18:07 — 분류·지역화와 객체 수" },
  },
];
