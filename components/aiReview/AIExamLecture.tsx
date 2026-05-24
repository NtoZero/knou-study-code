"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BrainCircuit,
  CheckCircle2,
  GitBranch,
  Layers,
  Play,
  Sigma,
  Table2,
  Target,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { AIAdvancedLecture } from "./AIAdvancedLecture";
import { AIVisualizationLab } from "./AIVisualizationLabs";

type Topic = {
  name: string;
  definition: string;
  exam: string;
  example: string;
};

type Quiz = {
  q: string;
  choices: string[];
  answer: number;
  explain: string;
};

type LectureReview = {
  id: number;
  source: string;
  flow: string[];
  topics: Topic[];
  checkpoints: string[];
  quiz: Quiz[];
};

type VisualPoint = {
  title: string;
  concept: string;
  why: string;
  interaction: string;
  steps: string[];
};

type ApplicationDrill = {
  title: string;
  prompt: string;
  choices: string[];
  answer: number;
  explain: string;
};

type LectureEnhancement = {
  coverage: string[];
  visualPoints: VisualPoint[];
  drills: ApplicationDrill[];
};

const lectureReviews: Record<number, LectureReview> = {
  6: {
    id: 6,
    source: "6강: 명제논리, 술어논리, 술어논리의 추론",
    flow: ["명제와 논리식 구성", "진리표로 의미 확인", "술어·항·한정자로 표현 확장", "절 변환 후 도출연역 적용"],
    topics: [
      { name: "명제논리", definition: "참 또는 거짓을 판정할 수 있는 명제를 논리연결자로 결합하여 지식을 표현하는 방법.", exam: "진리표, 항진식, 모순식, 논리적 귀결 판정.", example: "P→Q와 P가 참이면 Q를 결론으로 얻는 Modus Ponens." },
      { name: "술어논리", definition: "객체, 속성, 관계를 술어와 항으로 표현하고 한정자로 범위를 지정하는 논리.", exam: "∀, ∃의 의미와 변수 범위, 부정 이동을 구분.", example: "∀x Human(x)→Mortal(x)는 모든 인간이 죽는다는 지식 표현." },
      { name: "도출연역", definition: "절 형태의 논리식에서 상보 리터럴을 제거하여 새 절을 만들고 모순 여부를 확인하는 추론.", exam: "CNF 변환, 절 집합, 공절 도출 여부 추적.", example: "{P∨Q, ¬P}에서 Q를 도출." },
    ],
    checkpoints: ["논리식이 well-formed formula인지 확인", "한정자 부정 규칙 적용 가능", "도출연역에서 상보 리터럴을 정확히 선택"],
    quiz: [
      { q: "∀x P(x)의 부정은?", choices: ["∀x ¬P(x)", "∃x ¬P(x)", "¬∃x P(x)"], answer: 1, explain: "모든 x가 P라는 명제의 부정은 P가 아닌 x가 적어도 하나 존재한다는 뜻." },
      { q: "도출연역에서 두 절이 제거할 수 있는 리터럴 관계는?", choices: ["동일 리터럴", "상보 리터럴", "임의 리터럴"], answer: 1, explain: "P와 ¬P처럼 서로 부정 관계인 리터럴을 해소." },
    ],
  },
  7: {
    id: 7,
    source: "7강: 퍼지집합, 퍼지논리, 퍼지추론",
    flow: ["소속함수로 정도 표현", "퍼지집합 연산 적용", "규칙의 발화 강도 계산", "비퍼지화로 제어값 결정"],
    topics: [
      { name: "퍼지집합", definition: "원소가 집합에 속하는 정도를 0과 1 사이의 소속도 함수로 표현하는 집합.", exam: "고전집합과 달리 부분 소속을 허용한다는 점.", example: "온도 27도는 '따뜻함'에 0.7, '더움'에 0.3 소속 가능." },
      { name: "퍼지논리", definition: "참과 거짓의 중간 정도를 허용하는 다치 논리.", exam: "AND는 min, OR는 max, NOT은 1-μ로 계산하는 대표 방식.", example: "느림 0.6 AND 혼잡 0.8이면 규칙 강도 0.6." },
      { name: "퍼지추론", definition: "IF-THEN 규칙의 조건부 소속도를 이용해 결론 퍼지집합을 만들고 최종 값을 산출하는 과정.", exam: "규칙 평가, 결합, 비퍼지화 순서.", example: "온도와 습도 규칙으로 냉방 세기를 결정." },
    ],
    checkpoints: ["소속도는 확률이 아니라 정도임을 구분", "min/max 연산의 입력값을 정확히 선택", "퍼지제어의 규칙 기반 흐름 설명"],
    quiz: [
      { q: "퍼지집합에서 μA(x)=0.4의 의미는?", choices: ["40% 확률로 속함", "0.4의 정도로 속함", "속하지 않음"], answer: 1, explain: "소속도는 확률이 아니라 해당 개념에 부합하는 정도." },
      { q: "대표적인 퍼지 NOT 연산은?", choices: ["1-μ", "min(μ1, μ2)", "max(μ1, μ2)"], answer: 0, explain: "보수 집합의 소속도는 일반적으로 1에서 원 소속도를 뺀 값." },
    ],
  },
  8: {
    id: 8,
    source: "8강: 컴퓨터 시각의 개념, 디지털 영상, 전처리, 영상 분할",
    flow: ["영상 획득", "디지털 영상 표현", "전처리와 필터링", "임계치·영역·경계 기반 분할"],
    topics: [
      { name: "디지털 영상", definition: "2차원 좌표의 화소마다 밝기나 색상 값을 갖는 이산 데이터.", exam: "해상도, 화소, 명암도, 컬러 채널 개념.", example: "흑백 영상은 각 픽셀을 0~255 밝기값으로 표현." },
      { name: "전처리", definition: "인식이나 분할 전에 잡음 제거, 명암 보정, 특징 강조를 수행하는 과정.", exam: "평활화와 경계 강조 필터의 목적 구분.", example: "평균 필터는 잡음을 줄이지만 경계를 흐릴 수 있음." },
      { name: "영상 분할", definition: "영상을 의미 있는 영역이나 객체 단위로 나누는 처리.", exam: "임계치 이진화, 영역 기반, 경계 기반 방법 비교.", example: "문서 이미지에서 글자와 배경을 임계값으로 분리." },
    ],
    checkpoints: ["합성곱 필터의 중심 이동 방식 이해", "임계값 변화가 분할 결과에 미치는 영향 설명", "전처리와 분할의 순서 구분"],
    quiz: [
      { q: "영상 평활화의 주된 목적은?", choices: ["잡음 감소", "파일 암호화", "학습률 조절"], answer: 0, explain: "평활화는 주변 화소 정보를 이용해 급격한 잡음 변화를 완화." },
      { q: "이진화에서 임계값보다 큰 화소를 객체로 두는 방법은?", choices: ["경로 탐색", "임계치 분할", "오차역전파"], answer: 1, explain: "화소 값을 기준으로 두 영역으로 나누는 대표 분할 방법." },
    ],
  },
  9: {
    id: 9,
    source: "9강: 정규화, 영상의 표현, 거리측정자, 패턴인식",
    flow: ["입력 정규화", "특징 추출", "거리 또는 확률로 비교", "분류기 결정"],
    topics: [
      { name: "정규화", definition: "크기, 위치, 회전, 밝기 차이를 줄여 비교 가능한 형태로 맞추는 처리.", exam: "패턴 차이가 아니라 촬영 조건 차이를 줄이는 목적.", example: "손글씨 숫자 크기를 같은 박스 크기로 변환." },
      { name: "거리측정자", definition: "두 특징 벡터가 얼마나 다른지 수치화하는 함수.", exam: "유클리드 거리, 맨해튼 거리, 유사도와의 관계.", example: "최근접 이웃 분류기는 가장 가까운 학습 샘플의 클래스를 선택." },
      { name: "베이즈 분류기", definition: "사후확률이 가장 큰 클래스를 선택하는 확률 기반 분류기.", exam: "사전확률, 우도, 사후확률의 역할 구분.", example: "특징 x가 주어졌을 때 P(class|x)가 최대인 클래스를 선택." },
    ],
    checkpoints: ["정규화와 특징 추출의 차이 설명", "거리 기반 분류의 결정 기준 계산", "베이즈 분류에서 확률 항의 의미 구분"],
    quiz: [
      { q: "패턴인식에서 특징 벡터를 쓰는 이유는?", choices: ["원본을 항상 크게 만들기 위해", "분류에 필요한 정보를 수치 형태로 표현하기 위해", "정답을 숨기기 위해"], answer: 1, explain: "분류기는 특징 공간에서 거리, 확률, 판별식을 계산." },
      { q: "최근접 이웃 방식의 핵심 결정 기준은?", choices: ["가장 가까운 샘플", "가장 오래된 샘플", "가장 큰 파일"], answer: 0, explain: "거리측정자로 가까운 훈련 패턴을 찾아 클래스를 결정." },
    ],
  },
  10: {
    id: 10,
    source: "10강: 학습, 귀납적 학습, 결정트리 학습",
    flow: ["학습 유형 구분", "훈련 사례에서 일반 규칙 추출", "불순도 기준으로 속성 선택", "결정트리로 분류"],
    topics: [
      { name: "지도학습", definition: "입력과 정답 레이블의 쌍으로부터 함수를 학습하는 방법.", exam: "비지도·강화학습과 구분.", example: "스팸/정상 메일 레이블로 분류 모델 학습." },
      { name: "귀납적 학습", definition: "구체적 사례들로부터 일반적인 규칙이나 함수를 추론하는 학습.", exam: "훈련 데이터 밖 일반화가 핵심.", example: "여러 날씨 사례로 경기 진행 여부 규칙 도출." },
      { name: "결정트리", definition: "속성 검사 노드와 분기, 리프의 클래스로 구성된 트리형 분류 모델.", exam: "엔트로피, 정보이득, 지니 불순도 기준.", example: "가장 분류력이 큰 속성을 루트로 선택." },
    ],
    checkpoints: ["학습 유형별 정답 데이터 존재 여부 구분", "정보이득은 불확실성 감소량임을 설명", "과적합된 트리의 위험 이해"],
    quiz: [
      { q: "정답 레이블 없이 데이터 구조를 찾는 학습은?", choices: ["지도학습", "비지도학습", "도출연역"], answer: 1, explain: "군집화처럼 레이블 없이 패턴을 찾는 방식." },
      { q: "결정트리에서 좋은 분기 속성은?", choices: ["불순도를 많이 낮추는 속성", "항상 첫 번째 속성", "값이 가장 큰 속성"], answer: 0, explain: "정보이득이 큰 속성이 클래스를 잘 나눔." },
    ],
  },
  11: {
    id: 11,
    source: "11강: 선형회귀, 로지스틱 회귀, 군집화",
    flow: ["손실함수 정의", "기울기 계산", "파라미터 갱신", "분류 또는 군집 결과 해석"],
    topics: [
      { name: "선형회귀", definition: "입력 특성의 선형 결합으로 연속값 출력을 예측하는 모델.", exam: "MSE, 기울기, 절편, 경사하강법 갱신.", example: "공부 시간으로 점수를 예측하는 직선 적합." },
      { name: "로지스틱 회귀", definition: "선형 결합을 시그모이드 또는 소프트맥스로 변환해 클래스 확률을 예측하는 모델.", exam: "이진/다항 분류, 교차 엔트로피 손실.", example: "확률이 0.5 이상이면 양성 클래스로 분류." },
      { name: "k-means", definition: "데이터를 k개 중심에 반복 할당하고 중심을 갱신하는 군집화 방법.", exam: "초기 중심, 거리 계산, 중심 재계산 단계.", example: "고객 데이터를 구매 패턴이 비슷한 그룹으로 묶음." },
    ],
    checkpoints: ["회귀와 분류의 출력 형태 구분", "경사하강법은 손실을 낮추는 방향으로 갱신", "k-means는 비지도학습임을 확인"],
    quiz: [
      { q: "선형회귀에서 MSE가 측정하는 것은?", choices: ["예측 오차의 제곱 평균", "클래스 개수", "트리 깊이"], answer: 0, explain: "예측값과 실제값 차이를 제곱해 평균." },
      { q: "k-means의 k는?", choices: ["학습률", "군집 수", "특징 수"], answer: 1, explain: "미리 정한 군집 개수." },
    ],
  },
  12: {
    id: 12,
    source: "12강: 인공 신경망의 개념, 퍼셉트론 학습",
    flow: ["가중합 계산", "활성함수 적용", "오차 확인", "가중치와 바이어스 갱신"],
    topics: [
      { name: "인공 신경망", definition: "뉴런 모델을 계층적으로 연결해 입력에서 출력으로의 함수를 학습하는 계산 모델.", exam: "입력층, 은닉층, 출력층, 가중치, 바이어스.", example: "이미지 픽셀을 입력으로 받아 숫자 클래스를 출력." },
      { name: "활성함수", definition: "뉴런의 가중합을 비선형 출력으로 변환하는 함수.", exam: "계단, 시그모이드, ReLU의 용도와 차이.", example: "ReLU는 양수는 통과시키고 음수는 0으로 둠." },
      { name: "퍼셉트론", definition: "선형 결정경계를 학습하는 단층 신경망 모델.", exam: "학습 규칙과 XOR 한계.", example: "AND, OR는 학습 가능하지만 XOR는 단층으로 불가능." },
    ],
    checkpoints: ["가중합과 활성함수의 순서 설명", "학습률이 갱신 크기에 미치는 영향", "퍼셉트론의 선형 분리 한계 이해"],
    quiz: [
      { q: "퍼셉트론이 단층으로 풀기 어려운 대표 문제는?", choices: ["AND", "OR", "XOR"], answer: 2, explain: "XOR는 선형 결정경계 하나로 분리되지 않음." },
      { q: "바이어스의 역할은?", choices: ["결정경계 이동", "데이터 삭제", "학습 중지"], answer: 0, explain: "바이어스는 가중합에 상수항을 더해 경계를 이동." },
    ],
  },
  13: {
    id: 13,
    source: "13강: 오차역전파, 제한 볼츠만 머신, 자기조직화 지도와 LVQ",
    flow: ["순전파", "손실 계산", "출력층에서 은닉층으로 오차 전파", "가중치 갱신"],
    topics: [
      { name: "오차역전파", definition: "연쇄법칙으로 손실의 기울기를 뒤쪽 층부터 계산해 가중치를 갱신하는 학습 알고리즘.", exam: "순전파와 역전파의 방향, 기울기 의미.", example: "출력층 오차가 은닉층 가중치 갱신에 반영." },
      { name: "제한 볼츠만 머신", definition: "가시층과 은닉층 사이 연결만 갖는 에너지 기반 확률 신경망.", exam: "층 내부 연결이 없다는 구조적 특징.", example: "특징 학습과 DBN 사전학습에 활용." },
      { name: "SOM/LVQ", definition: "경쟁학습 기반으로 입력 패턴을 대표 벡터나 지도 구조에 배치하는 신경망 방법.", exam: "지도학습 LVQ와 비지도 SOM 구분.", example: "비슷한 데이터가 지도 위 가까운 위치에 배치." },
    ],
    checkpoints: ["역전파는 출력에서 입력 방향으로 기울기 전달", "RBM은 가시-은닉 간 이분 구조", "SOM과 LVQ의 학습 방식 구분"],
    quiz: [
      { q: "오차역전파의 수학적 기반은?", choices: ["연쇄법칙", "진리표", "해시 함수"], answer: 0, explain: "복합함수 미분의 연쇄법칙으로 각 가중치의 기울기를 계산." },
      { q: "SOM의 대표적 특징은?", choices: ["비지도 경쟁학습", "정확한 논리 증명", "최대 유량 계산"], answer: 0, explain: "입력 분포를 저차원 지도에 보존하려는 비지도 학습." },
    ],
  },
  14: {
    id: 14,
    source: "14강: 딥러닝 개요, 학습 개선, 합성곱 신경망",
    flow: ["깊은 층 구성", "활성함수·초기화·규제로 학습 안정화", "합성곱으로 특징 추출", "풀링과 분류층 연결"],
    topics: [
      { name: "딥러닝", definition: "여러 은닉층을 가진 신경망으로 데이터의 계층적 표현을 학습하는 방법.", exam: "깊은 신경망의 표현력과 학습 난점.", example: "낮은 층은 경계, 높은 층은 객체 부품을 학습." },
      { name: "학습 개선", definition: "경사 소멸, 과적합, 초기화 문제를 줄이기 위한 활성함수, 규제, 드롭아웃 등의 기법.", exam: "ReLU, 가중치 초기화, 드롭아웃 목적.", example: "드롭아웃은 일부 뉴런을 학습 중 제외해 과적합을 줄임." },
      { name: "CNN", definition: "합성곱 필터로 지역 특징을 추출하고 풀링으로 공간 크기를 줄이는 영상 처리 신경망.", exam: "필터, stride, padding, feature map, pooling.", example: "3x3 필터가 이미지 전체를 이동하며 특징맵 생성." },
    ],
    checkpoints: ["출력 크기 계산에서 필터·패딩·스트라이드 반영", "합성곱층과 완전연결층 역할 구분", "드롭아웃은 평가 시 동작이 달라짐"],
    quiz: [
      { q: "CNN에서 padding의 대표 목적은?", choices: ["출력 크기 조절과 경계 정보 보존", "학습률 제거", "클래스 이름 변경"], answer: 0, explain: "입력 가장자리에도 필터가 적용되도록 보완하고 출력 크기를 조절." },
      { q: "과적합 완화에 쓰이는 기법은?", choices: ["드롭아웃", "진입차수", "잔여 용량"], answer: 0, explain: "학습 중 일부 연결을 무작위로 제외하여 특정 패턴 의존을 줄임." },
    ],
  },
  15: {
    id: 15,
    source: "15강: 심층 CNN, 순환 신경망, 트랜스포머",
    flow: ["깊은 CNN의 성능 개선", "순차 데이터에서 은닉상태 전달", "장기 의존성 보완", "attention으로 토큰 관계 계산"],
    topics: [
      { name: "ResNet", definition: "잔차 연결을 통해 입력을 몇 개 층 뒤 출력에 더하여 깊은 신경망 학습을 돕는 CNN 구조.", exam: "잔차 블록과 skip connection의 목적.", example: "F(x)+x 형태로 기울기 흐름을 개선." },
      { name: "RNN/LSTM/GRU", definition: "순차 데이터의 이전 상태를 현재 계산에 반영하는 신경망과 장기 의존성을 보완한 변형.", exam: "BPTT, 장기 의존성, 게이트 구조.", example: "문장 앞 단어 정보가 뒤 단어 예측에 사용." },
      { name: "트랜스포머", definition: "self-attention으로 입력 토큰 사이의 관계를 병렬적으로 계산하는 딥러닝 구조.", exam: "query, key, value, attention weight, positional encoding.", example: "문장 속 단어들이 서로 얼마나 관련 있는지 가중합으로 표현." },
    ],
    checkpoints: ["잔차 연결은 입력을 더해 깊은 모델 학습을 보조", "RNN은 순서 처리에 강하지만 병렬화가 제한", "트랜스포머는 self-attention과 위치 정보가 핵심"],
    quiz: [
      { q: "트랜스포머가 순서 정보를 보완하기 위해 쓰는 것은?", choices: ["positional encoding", "해시 체인", "퍼지 보수"], answer: 0, explain: "self-attention만으로는 순서가 직접 표현되지 않아 위치 정보를 추가." },
      { q: "ResNet의 skip connection이 돕는 것은?", choices: ["깊은 네트워크 학습", "진리표 작성", "최대 유량 증가"], answer: 0, explain: "잔차 경로가 기울기 전달을 개선해 매우 깊은 CNN을 학습하기 쉽게 함." },
    ],
  },
};

type BoolOp = "or" | "and" | "imp" | "iff";

const truthRows = [
  { p: true, q: true },
  { p: true, q: false },
  { p: false, q: true },
  { p: false, q: false },
];

const opLabels: Record<BoolOp, { label: string; formula: string; note: string }> = {
  or: { label: "선언 OR", formula: "p ∨ q", note: "둘 중 하나 이상 참이면 참" },
  and: { label: "연언 AND", formula: "p ∧ q", note: "둘 다 참일 때만 참" },
  imp: { label: "조건명제", formula: "p → q", note: "p가 참인데 q가 거짓인 경우만 거짓" },
  iff: { label: "동치", formula: "p ↔ q", note: "p와 q의 진릿값이 같을 때 참" },
};

function boolText(value: boolean) {
  return value ? "T" : "F";
}

function evalOp(op: BoolOp, p: boolean, q: boolean) {
  if (op === "or") return p || q;
  if (op === "and") return p && q;
  if (op === "imp") return !p || q;
  return p === q;
}

function AI6LearningFlow() {
  const flow = [
    "명제와 기본명제",
    "논리연산자와 진리표",
    "정형식과 표준형",
    "항진식·모순식 판정",
    "술어·객체·항·한정자",
    "단일화와 절 분리",
    "도출연역 정리 증명",
    "기출형 객관식 점검",
  ];
  const competencies = [
    "조건명제의 거짓 행 찾기",
    "p→q를 ~p∨q로 변환",
    "CNF와 DNF의 절 구조 판별",
    "정형식과 비정형식 구분",
    "객체상수·객체변수·함수로 항 구성",
    "∀, ∃의 부정 변환",
    "단일화 치환을 적용해 술어 객체 일치",
    "술어논리식을 절 형태로 분리",
    "상보 리터럴 제거 후 새 절 도출",
    "정리의 부정을 넣고 false 도출 여부로 증명 판정",
  ];

  return (
    <section className="rounded-lg border border-indigo-200 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-gray-900">
      <SectionTitle
        title="6강 학습 흐름과 핵심 역량"
        subtitle="명제논리에서 술어논리 추론까지 시험 문제를 푸는 순서로 연결"
      />
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
            개념 이해 flow
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {flow.map((item, index) => (
              <div key={item} className="flex items-center gap-2 rounded-md bg-white p-3 text-sm dark:bg-gray-900">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {index + 1}
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 dark:border-violet-900 dark:bg-violet-950/40">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">
            시험 전 수행 가능해야 할 일
          </div>
          <div className="space-y-2">
            {competencies.map((item) => (
              <div key={item} className="flex items-start gap-2 rounded-md bg-white p-3 text-sm dark:bg-gray-900">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-violet-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TruthTableLab() {
  const [op, setOp] = useState<BoolOp>("imp");
  const [focusRow, setFocusRow] = useState(1);
  const focused = truthRows[focusRow];

  return (
    <section className="rounded-lg border border-violet-200 bg-white p-6 shadow-sm dark:border-violet-900 dark:bg-gray-900">
      <SectionTitle
        title="명제논리 진리표 실험실"
        subtitle="조건명제 진리표와 논리 연산자 완전집합을 직접 확인"
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(opLabels) as BoolOp[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setOp(key)}
            className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
              op === key
                ? "border-violet-500 bg-violet-500 text-white"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:border-violet-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
            }`}
          >
            {opLabels[key].formula}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-center text-sm">
            <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-950">
              <tr>
                <th className="px-3 py-2">p</th>
                <th className="px-3 py-2">q</th>
                <th className="px-3 py-2">~p</th>
                <th className="px-3 py-2">~p ∨ q</th>
                <th className="px-3 py-2">{opLabels[op].formula}</th>
              </tr>
            </thead>
            <tbody>
              {truthRows.map((row, index) => {
                const result = evalOp(op, row.p, row.q);
                const implicationEquivalent = !row.p || row.q;
                return (
                  <tr
                    key={`${row.p}-${row.q}`}
                    onClick={() => setFocusRow(index)}
                    className={`cursor-pointer border-t border-gray-200 transition dark:border-gray-800 ${
                      focusRow === index ? "bg-violet-50 dark:bg-violet-950/50" : "hover:bg-gray-50 dark:hover:bg-gray-950"
                    }`}
                  >
                    <td className="px-3 py-3 font-mono">{boolText(row.p)}</td>
                    <td className="px-3 py-3 font-mono">{boolText(row.q)}</td>
                    <td className="px-3 py-3 font-mono">{boolText(!row.p)}</td>
                    <td className="px-3 py-3 font-mono">{boolText(implicationEquivalent)}</td>
                    <td className={`px-3 py-3 font-mono font-bold ${result ? "text-emerald-600" : "text-rose-600"}`}>
                      {boolText(result)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 dark:border-violet-900 dark:bg-violet-950/40">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
            <Table2 size={16} />
            선택 행 해석
          </div>
          <div className="rounded-md bg-white p-3 text-sm leading-6 dark:bg-gray-900">
            <div className="font-mono text-base">
              p={boolText(focused.p)}, q={boolText(focused.q)} → {opLabels[op].formula}=
              {boolText(evalOp(op, focused.p, focused.q))}
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{opLabels[op].note}</p>
          </div>
          <div className="mt-3 rounded-md bg-white p-3 text-xs leading-5 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
            핵심 등식: <span className="font-mono font-bold">p → q ≡ ~p ∨ q</span>. 위 표의
            조건명제 열과 <span className="font-mono">~p ∨ q</span> 열이 모든 행에서 같으면 동치 확인 완료.
          </div>
        </div>
      </div>
    </section>
  );
}

const wffCandidates = [
  {
    formula: "p",
    isWff: true,
    reason: "기본명제는 그 자체로 정형식.",
  },
  {
    formula: "~p",
    isWff: true,
    reason: "p가 정형식이면 그 부정 ~p도 정형식.",
  },
  {
    formula: "p → q",
    isWff: true,
    reason: "p와 q가 정형식이면 p→q도 정형식.",
  },
  {
    formula: "p q →",
    isWff: false,
    reason: "연산자의 피연산자 결합 구조가 식으로 드러나지 않아 정형식 규칙에 맞지 않음.",
  },
  {
    formula: "(p ∨ ~q) ∧ (~r ∨ s ∨ t)",
    isWff: true,
    reason: "부정된 기본명제와 논리연산자로 결합된 식이며, 연언표준형의 절 구조를 가짐.",
  },
  {
    formula: "→ p q",
    isWff: false,
    reason: "강의의 논리식 표기에서는 조건명제가 두 정형식 사이에 놓여야 함.",
  },
];

function WffBuilderLab() {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const candidate = wffCandidates[candidateIndex];
  const isCorrect = answer === candidate.isWff;

  return (
    <section className="rounded-lg border border-fuchsia-200 bg-white p-6 shadow-sm dark:border-fuchsia-900 dark:bg-gray-900">
      <SectionTitle
        title="정형식 판별 드릴"
        subtitle="기본명제에서 복합 논리식으로 넘어갈 때 well-formed formula 규칙을 적용"
      />
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-2">
          {wffCandidates.map((item, index) => (
            <button
              key={item.formula}
              type="button"
              onClick={() => {
                setCandidateIndex(index);
                setAnswer(null);
              }}
              className={`w-full rounded-lg border p-3 text-left font-mono text-sm transition ${
                candidateIndex === index
                  ? "border-fuchsia-400 bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-fuchsia-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
              }`}
            >
              {item.formula}
            </button>
          ))}
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-fuchsia-700 dark:text-fuchsia-300">
            선택한 식
          </div>
          <div className="rounded-md bg-white p-4 font-mono text-lg font-bold dark:bg-gray-900">{candidate.formula}</div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              { label: "정형식", value: true },
              { label: "정형식 아님", value: false },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setAnswer(option.value)}
                className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                  answer === option.value
                    ? isCorrect
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950"
                      : "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950"
                    : "border-gray-200 bg-white hover:border-fuchsia-300 dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {answer !== null && (
            <div
              className={`mt-4 rounded-md p-3 text-sm leading-6 ${
                isCorrect
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                  : "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
              }`}
            >
              <div className="font-bold">{isCorrect ? "정답입니다." : "오답입니다."}</div>
              <div>
                정답: {candidate.isWff ? "정형식" : "정형식 아님"}. {candidate.reason}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const standardForms = [
  {
    title: "연언표준형 CNF",
    form: "(p ∨ ~q) ∧ (~r ∨ s ∨ t)",
    rule: "절들의 논리곱. 각 절은 리터럴들의 논리합.",
    parts: ["절 F1 = p ∨ ~q", "절 F2 = ~r ∨ s ∨ t", "전체 = F1 ∧ F2"],
  },
  {
    title: "선언표준형 DNF",
    form: "(~p ∧ r) ∨ (~q ∧ s ∧ t)",
    rule: "절들의 논리합. 각 절은 리터럴들의 논리곱.",
    parts: ["절 G1 = ~p ∧ r", "절 G2 = ~q ∧ s ∧ t", "전체 = G1 ∨ G2"],
  },
  {
    title: "조건명제 제거",
    form: "p → q  ≡  ~p ∨ q",
    rule: "함의는 부정과 선언으로 바꿔 표준형 변환의 출발점으로 사용.",
    parts: ["p가 참이고 q가 거짓일 때만 F", "~p ∨ q도 같은 행에서만 F", "따라서 두 식은 동치"],
  },
];

const standardConcepts = [
  {
    term: "기본명제",
    definition: "참 또는 거짓을 구분할 수 있는 명제를 하나의 기호로 나타낸 것.",
    example: "p, q, r",
  },
  {
    term: "리터럴",
    definition: "기본명제 또는 기본명제의 부정.",
    example: "p, ~q, r",
  },
  {
    term: "절",
    definition: "여러 리터럴을 같은 종류의 논리연산자로 묶은 작은 논리식.",
    example: "p ∨ ~q 또는 ~p ∧ r",
  },
  {
    term: "연언",
    definition: "논리곱 AND. 연결된 항목이 모두 참일 때만 참.",
    example: "F1 ∧ F2",
  },
  {
    term: "선언",
    definition: "논리합 OR. 연결된 항목 중 하나 이상이 참이면 참.",
    example: "p ∨ q",
  },
];

const standardExamples = [
  {
    formula: "(p ∨ ~q) ∧ (~r ∨ s ∨ t)",
    kind: "연언표준형",
    outer: "겉 연결: ∧",
    inner: "각 절 내부: ∨",
    reason: "리터럴들의 논리합으로 이루어진 절들이 논리곱으로 연결되어 있음.",
  },
  {
    formula: "(~p ∧ r) ∨ (~q ∧ s ∧ t)",
    kind: "선언표준형",
    outer: "겉 연결: ∨",
    inner: "각 절 내부: ∧",
    reason: "리터럴들의 논리곱으로 이루어진 절들이 논리합으로 연결되어 있음.",
  },
  {
    formula: "(p ∧ q) ∨ (~r ∧ s)",
    kind: "선언표준형",
    outer: "겉 연결: ∨",
    inner: "각 절 내부: ∧",
    reason: "겉이 ∨이고 각 묶음이 리터럴들의 ∧이므로 연언표준형이 아니라 선언표준형.",
  },
];

function StandardFormConceptPrimer() {
  const [termIndex, setTermIndex] = useState(0);
  const [exampleIndex, setExampleIndex] = useState(0);
  const concept = standardConcepts[termIndex];
  const example = standardExamples[exampleIndex];

  return (
    <section className="rounded-lg border border-cyan-200 bg-white p-6 shadow-sm dark:border-cyan-900 dark:bg-gray-900">
      <SectionTitle
        title="표준형 개념 먼저 잡기"
        subtitle="연언표준형을 판별하기 전에 리터럴, 절, 논리합, 논리곱의 관계를 확인"
      />
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
            용어 사다리
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {standardConcepts.map((item, index) => (
              <button
                key={item.term}
                type="button"
                onClick={() => setTermIndex(index)}
                className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                  termIndex === index
                    ? "border-cyan-500 bg-cyan-500 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-cyan-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                }`}
              >
                {item.term}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={concept.term}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-md bg-white p-4 dark:bg-gray-900"
            >
              <div className="text-base font-bold text-cyan-700 dark:text-cyan-300">{concept.term}</div>
              <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">{concept.definition}</p>
              <div className="mt-3 rounded-md bg-cyan-50 p-3 font-mono text-sm dark:bg-cyan-950/50">{concept.example}</div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
            표준형 판별의 핵심
          </div>
          <div className="rounded-md bg-white p-4 text-sm leading-6 dark:bg-gray-900">
            <p>
              <span className="font-bold">연언표준형</span>은 리터럴들의 <span className="font-bold">논리합</span>으로
              이루어진 절들이 <span className="font-bold">논리곱</span>으로 연결된 형태.
            </p>
            <p className="mt-2">
              <span className="font-bold">선언표준형</span>은 리터럴들의 <span className="font-bold">논리곱</span>으로
              이루어진 절들이 <span className="font-bold">논리합</span>으로 연결된 형태.
            </p>
          </div>
          <div className="mt-4 space-y-2">
            {standardExamples.map((item, index) => (
              <button
                key={item.formula}
                type="button"
                onClick={() => setExampleIndex(index)}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  exampleIndex === index
                    ? "border-cyan-400 bg-cyan-50 text-cyan-800 dark:bg-cyan-950"
                    : "border-gray-200 bg-white hover:border-cyan-300 dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                <div className="font-mono text-sm">{item.formula}</div>
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-md bg-white p-4 text-sm leading-6 dark:bg-gray-900">
            <div className="font-bold text-cyan-700 dark:text-cyan-300">{example.kind}</div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="rounded-md bg-gray-50 p-2 dark:bg-gray-950">{example.outer}</div>
              <div className="rounded-md bg-gray-50 p-2 dark:bg-gray-950">{example.inner}</div>
            </div>
            <p className="mt-3 text-gray-600 dark:text-gray-300">{example.reason}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StandardFormExplorer() {
  const [index, setIndex] = useState(0);
  const item = standardForms[index];

  return (
    <section className="rounded-lg border border-sky-200 bg-white p-6 shadow-sm dark:border-sky-900 dark:bg-gray-900">
      <SectionTitle
        title="정형식과 표준형 변환"
        subtitle="정형식, 연언표준형, 선언표준형을 절 단위로 분해"
      />
      <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-2">
          {standardForms.map((candidate, candidateIndex) => (
            <button
              key={candidate.title}
              type="button"
              onClick={() => setIndex(candidateIndex)}
              className={`w-full rounded-lg border p-3 text-left text-sm font-semibold transition ${
                index === candidateIndex
                  ? "border-sky-400 bg-sky-50 text-sky-700 dark:bg-sky-950"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-sky-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
              }`}
            >
              {candidate.title}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950"
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-sky-700 dark:text-sky-300">
              <Sigma size={16} />
              {item.title}
            </div>
            <div className="rounded-md bg-white p-3 font-mono text-sm dark:bg-gray-900">{item.form}</div>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.rule}</p>
            <div className="mt-4 grid gap-2">
              {item.parts.map((part) => (
                <div
                  key={part}
                  className="rounded-md border border-sky-100 bg-white px-3 py-2 text-xs dark:border-sky-900 dark:bg-gray-900"
                >
                  {part}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

const tautologyCases = [
  {
    title: "배중률",
    formula: "p ∨ ~p",
    eval: (p: boolean, _q: boolean) => p || !p,
    isTautology: true,
    note: "p가 참이어도, 거짓이어도 p와 그 부정 중 하나는 참.",
  },
  {
    title: "긍정논법을 식으로 표현",
    formula: "(p ∧ (p → q)) → q",
    eval: (p: boolean, q: boolean) => !(p && (!p || q)) || q,
    isTautology: true,
    note: "전제 p와 p→q가 모두 참이면 q가 반드시 참이므로 모든 행에서 참.",
  },
  {
    title: "모순식",
    formula: "p ∧ ~p",
    eval: (p: boolean, _q: boolean) => p && !p,
    isTautology: false,
    note: "p와 ~p는 동시에 참일 수 없어 모든 행에서 거짓.",
  },
  {
    title: "일반 조건식",
    formula: "p → ~p",
    eval: (p: boolean, _q: boolean) => !p || !p,
    isTautology: false,
    note: "p가 참이면 ~p가 거짓이므로 조건명제가 거짓인 행이 존재.",
  },
];

function TautologyChallenge() {
  const [caseIndex, setCaseIndex] = useState(1);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const item = tautologyCases[caseIndex];
  const rows = truthRows.map((row) => ({ ...row, result: item.eval(row.p, row.q) }));
  const isCorrect = answer === item.isTautology;

  return (
    <section className="rounded-lg border border-teal-200 bg-white p-6 shadow-sm dark:border-teal-900 dark:bg-gray-900">
      <SectionTitle
        title="항진식 판정 챌린지"
        subtitle="진리표의 모든 행이 참인지 확인하여 항진식과 비항진식을 구분"
      />
      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-2">
          {tautologyCases.map((candidate, index) => (
            <button
              key={candidate.formula}
              type="button"
              onClick={() => {
                setCaseIndex(index);
                setAnswer(null);
              }}
              className={`w-full rounded-lg border p-3 text-left transition ${
                caseIndex === index
                  ? "border-teal-400 bg-teal-50 text-teal-700 dark:bg-teal-950"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-teal-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
              }`}
            >
              <div className="text-xs font-bold">{candidate.title}</div>
              <div className="mt-1 font-mono text-sm">{candidate.formula}</div>
            </button>
          ))}
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-4 rounded-md bg-white p-3 font-mono text-base font-bold dark:bg-gray-900">{item.formula}</div>
          <div className="mb-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="w-full text-center text-sm">
              <thead className="bg-gray-100 text-xs text-gray-500 dark:bg-gray-900">
                <tr>
                  <th className="px-3 py-2">p</th>
                  <th className="px-3 py-2">q</th>
                  <th className="px-3 py-2">결과</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={`${item.formula}-${row.p}-${row.q}`} className="border-t border-gray-200 dark:border-gray-800">
                    <td className="px-3 py-2 font-mono">{boolText(row.p)}</td>
                    <td className="px-3 py-2 font-mono">{boolText(row.q)}</td>
                    <td className={`px-3 py-2 font-mono font-bold ${row.result ? "text-emerald-600" : "text-rose-600"}`}>
                      {boolText(row.result)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { label: "항진식", value: true },
              { label: "항진식 아님", value: false },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setAnswer(option.value)}
                className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                  answer === option.value
                    ? isCorrect
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950"
                      : "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950"
                    : "border-gray-200 bg-white hover:border-teal-300 dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {answer !== null && (
            <div
              className={`mt-4 rounded-md p-3 text-sm leading-6 ${
                isCorrect
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                  : "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
              }`}
            >
              <div className="font-bold">{isCorrect ? "정답입니다." : "오답입니다."}</div>
              <div>
                정답: {item.isTautology ? "항진식" : "항진식 아님"}. {item.note}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const predicateDomain = [
  { name: "영수", human: true, mortal: true },
  { name: "존", human: true, mortal: false },
  { name: "로봇R", human: false, mortal: false },
];

function PredicateLogicLab() {
  const [statement, setStatement] = useState<"forall" | "exists" | "notforall">("forall");
  const rows = predicateDomain;
  const values = rows.map((row) => ({
    ...row,
    implication: !row.human || row.mortal,
  }));
  const result =
    statement === "forall"
      ? values.every((row) => row.implication)
      : statement === "exists"
        ? values.some((row) => row.human && row.mortal)
        : values.some((row) => row.human && !row.mortal);

  return (
    <section className="rounded-lg border border-emerald-200 bg-white p-6 shadow-sm dark:border-emerald-900 dark:bg-gray-900">
      <SectionTitle
        title="술어논리와 한정자 판정"
        subtitle="객체상수, 술어, 변수, 한정자의 의미를 작은 해석 모델에서 확인"
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          ["forall", "∀x Human(x) → Mortal(x)"],
          ["exists", "∃x Human(x) ∧ Mortal(x)"],
          ["notforall", "∃x Human(x) ∧ ~Mortal(x)"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setStatement(key as "forall" | "exists" | "notforall")}
            className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
              statement === key
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:border-emerald-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.75fr]">
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-center text-sm">
            <thead className="bg-gray-100 text-xs text-gray-500 dark:bg-gray-950">
              <tr>
                <th className="px-3 py-2">객체</th>
                <th className="px-3 py-2">Human(x)</th>
                <th className="px-3 py-2">Mortal(x)</th>
                <th className="px-3 py-2">Human(x) → Mortal(x)</th>
              </tr>
            </thead>
            <tbody>
              {values.map((row) => (
                <tr key={row.name} className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-3 py-3 font-semibold">{row.name}</td>
                  <td className="px-3 py-3 font-mono">{boolText(row.human)}</td>
                  <td className="px-3 py-3 font-mono">{boolText(row.mortal)}</td>
                  <td className={`px-3 py-3 font-mono font-bold ${row.implication ? "text-emerald-600" : "text-rose-600"}`}>
                    {boolText(row.implication)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">선택한 문장</div>
          <div className="mt-2 rounded-md bg-white p-3 font-mono text-sm dark:bg-gray-900">
            {statement === "forall"
              ? "∀x Human(x) → Mortal(x)"
              : statement === "exists"
                ? "∃x Human(x) ∧ Mortal(x)"
                : "∃x Human(x) ∧ ~Mortal(x)"}
          </div>
          <div className={`mt-3 rounded-md p-3 text-sm font-bold ${result ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900" : "bg-rose-100 text-rose-700 dark:bg-rose-900"}`}>
            이 해석에서 결과: {boolText(result)}
          </div>
          <p className="mt-3 text-xs leading-5 text-gray-600 dark:text-gray-300">
            ∀는 모든 객체가 조건을 만족해야 참. ∃는 조건을 만족하는 객체가 하나라도 있으면 참.
            조건명제는 앞 조건이 거짓인 객체에서는 자동으로 참이 됨.
          </p>
        </div>
      </div>
    </section>
  );
}

const predicateBlocks = [
  {
    title: "객체상수",
    formula: "Man(SOCRATES)",
    source: "소크라테스는 사람이다.",
    explain: "객체를 하나의 고정된 이름으로 나타냄. SOCRATES, PLATO, A, B처럼 특정 대상을 가리킴.",
  },
  {
    title: "관계 술어",
    formula: "On(X, Y)",
    source: "X가 Y의 위에 있다.",
    explain: "술어는 하나 이상의 객체를 받을 수 있음. On은 두 객체 사이의 관계를 표현하는 2항 술어.",
  },
  {
    title: "함수",
    formula: "Korean(father(철수))",
    source: "철수의 아버지는 한국인이다.",
    explain: "father(철수)는 철수의 아버지라는 객체를 돌려주는 함수항. 그 항이 Korean 술어의 객체가 됨.",
  },
  {
    title: "객체변수와 한정기호",
    formula: "∀x Bird(x) → HasWings(x)",
    source: "모든 새는 날개가 있다.",
    explain: "객체변수 x의 범위를 전칭기호 ∀로 정의역 전체에 확장. 존재기호 ∃는 조건을 만족하는 원소가 적어도 하나 있음을 뜻함.",
  },
];

const predicateWffRules = [
  "객체상수와 객체변수는 항.",
  "t1, t2, ..., tn이 항이고 f가 n변수 함수기호이면 f(t1, t2, ..., tn)은 항.",
  "T와 F는 모두 wff.",
  "t1, t2, ..., tn이 항이고 P가 n개의 항을 수식하는 술어논리기호이면 P(t1, t2, ..., tn)은 wff.",
  "P, Q가 wff이면 ~P, P→Q도 wff.",
  "P가 wff이고 x가 객체변수이면 ∀x P, ∃x P는 wff.",
];

function PredicateStructureExplorer() {
  const [index, setIndex] = useState(0);
  const item = predicateBlocks[index];

  return (
    <section className="rounded-lg border border-emerald-200 bg-white p-6 shadow-sm dark:border-emerald-900 dark:bg-gray-900">
      <SectionTitle
        title="술어논리식 구성요소"
        subtitle="명제논리로 표현하기 어려운 일반 규칙을 객체, 술어, 항, 한정기호로 확장"
      />
      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-2">
          {predicateBlocks.map((block, blockIndex) => (
            <button
              key={block.title}
              type="button"
              onClick={() => setIndex(blockIndex)}
              className={`w-full rounded-lg border p-3 text-left text-sm font-semibold transition ${
                index === blockIndex
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-emerald-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
              }`}
            >
              {block.title}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950"
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
              <Layers size={16} />
              {item.title}
            </div>
            <div className="rounded-md bg-white p-3 font-mono text-sm font-bold dark:bg-gray-900">{item.formula}</div>
            <div className="mt-3 rounded-md border border-emerald-100 bg-white p-3 text-sm dark:border-emerald-900 dark:bg-gray-900">
              {item.source}
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.explain}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
          항(term)과 술어논리 wff 규칙
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {predicateWffRules.map((rule, ruleIndex) => (
            <div key={rule} className="flex items-start gap-2 rounded-md bg-white p-3 text-sm dark:bg-gray-900">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                {ruleIndex + 1}
              </span>
              {rule}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const quantifierLaws = [
  {
    name: "존재 부정",
    before: "~∃x P(x)",
    after: "∀x ~P(x)",
    note: "조건을 만족하는 x가 존재하지 않음은 모든 x가 P가 아님과 같음.",
  },
  {
    name: "전칭 부정",
    before: "~∀x P(x)",
    after: "∃x ~P(x)",
    note: "모든 x가 P라는 말의 부정은 P가 아닌 x가 적어도 하나 존재한다는 뜻.",
  },
  {
    name: "전칭과 연언",
    before: "∀x {P(x) ∧ Q(x)}",
    after: "∀x P(x) ∧ ∀y Q(y)",
    note: "모든 원소가 두 조건을 모두 만족하면, 각 조건도 정의역 전체에 대해 성립.",
  },
  {
    name: "존재와 선언",
    before: "∃x {P(x) ∨ Q(x)}",
    after: "∃x P(x) ∨ ∃y Q(y)",
    note: "둘 중 하나를 만족하는 원소가 존재하면, P 또는 Q를 만족하는 존재명제로 분리 가능.",
  },
];

function QuantifierLawDrill() {
  const [lawIndex, setLawIndex] = useState(1);
  const [choice, setChoice] = useState<number | null>(null);
  const law = quantifierLaws[lawIndex];
  const choices = [law.after, law.before, law.after.replace("∀", "∃"), law.after.replace("~", "")];
  const correct = choice === 0;

  return (
    <section className="rounded-lg border border-lime-200 bg-white p-6 shadow-sm dark:border-lime-900 dark:bg-gray-900">
      <SectionTitle
        title="한정기호 등식 드릴"
        subtitle="∀, ∃의 부정과 분배 규칙을 문제 풀이 전에 먼저 적용"
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {quantifierLaws.map((item, index) => (
          <button
            key={item.name}
            type="button"
            onClick={() => {
              setLawIndex(index);
              setChoice(null);
            }}
            className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
              lawIndex === index
                ? "border-lime-500 bg-lime-500 text-white"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:border-lime-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-lime-700 dark:text-lime-300">
            변환 대상
          </div>
          <div className="rounded-md bg-white p-4 font-mono text-base font-bold dark:bg-gray-900">{law.before}</div>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{law.note}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-3 text-sm font-bold">동치식을 고르기</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {choices.map((item, index) => (
              <button
                key={`${law.name}-${item}-${index}`}
                type="button"
                onClick={() => setChoice(index)}
                className={`rounded-md border px-3 py-2 text-left font-mono text-sm transition ${
                  choice === index
                    ? index === 0
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950"
                      : "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950"
                    : "border-gray-200 bg-white hover:border-lime-300 dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          {choice !== null && (
            <div
              className={`mt-3 rounded-md p-3 text-xs leading-5 ${
                correct
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                  : "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
              }`}
            >
              <div className="font-bold">{correct ? "정답입니다." : "오답입니다."}</div>
              정답은 <span className="font-mono">{law.after}</span>. 한정기호를 바꿀 때 부정의 범위와 변수 이름 충돌을 함께 확인.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const inferenceExamples = [
  {
    title: "긍정논법 Modus Ponens",
    premises: ["p", "p → q"],
    steps: ["전제 p를 확인", "전제 p → q를 ~p ∨ q로 볼 수 있음", "p가 성립하므로 결론 q 도출"],
    conclusion: "q",
  },
  {
    title: "부정논법 Modus Tollens",
    premises: ["~q", "p → q"],
    steps: ["결론 q가 거짓임을 확인", "p → q가 참이려면 p는 참일 수 없음", "따라서 ~p 도출"],
    conclusion: "~p",
  },
  {
    title: "도출연역 Resolution",
    premises: ["p ∨ q", "~p"],
    steps: ["절 p ∨ q와 절 ~p 선택", "상보 리터럴 p와 ~p 제거", "남은 리터럴 q 도출"],
    conclusion: "q",
  },
];

function InferenceStepper() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [step, setStep] = useState(0);
  const example = inferenceExamples[exampleIndex];

  return (
    <section className="rounded-lg border border-orange-200 bg-white p-6 shadow-sm dark:border-orange-900 dark:bg-gray-900">
      <SectionTitle
        title="추론 규칙 단계 실행"
        subtitle="연역, 긍정논법, 부정논법, 도출연역을 단계별로 추적"
      />
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-2">
          {inferenceExamples.map((candidate, index) => (
            <button
              key={candidate.title}
              type="button"
              onClick={() => {
                setExampleIndex(index);
                setStep(0);
              }}
              className={`w-full rounded-lg border p-3 text-left text-sm font-semibold transition ${
                exampleIndex === index
                  ? "border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-950"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-orange-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
              }`}
            >
              {candidate.title}
            </button>
          ))}
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-orange-700 dark:text-orange-300">
            <GitBranch size={16} />
            {example.title}
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {example.premises.map((premise) => (
              <span key={premise} className="rounded-md bg-white px-3 py-2 font-mono text-sm dark:bg-gray-900">
                {premise}
              </span>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${example.title}-${step}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-md bg-white p-4 text-sm leading-6 dark:bg-gray-900"
            >
              <div className="mb-1 text-xs font-bold text-orange-500">{step + 1}단계</div>
              {example.steps[step]}
            </motion.div>
          </AnimatePresence>
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((value) => Math.max(0, value - 1))}
              className="rounded-md border border-gray-200 px-3 py-2 text-xs font-semibold dark:border-gray-800"
            >
              이전
            </button>
            <div className="text-xs text-gray-500">
              {step + 1}/{example.steps.length}
            </div>
            <button
              type="button"
              onClick={() => setStep((value) => Math.min(example.steps.length - 1, value + 1))}
              className="rounded-md bg-orange-500 px-3 py-2 text-xs font-semibold text-white"
            >
              다음
            </button>
          </div>
          {step === example.steps.length - 1 && (
            <div className="mt-4 rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              도출 결론: <span className="font-mono">{example.conclusion}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const resolutionPractice = {
  clauses: ["~p ∨ q ∨ r", "~q ∨ s"],
  pairChoices: ["q 와 ~q", "~p 와 ~q", "r 와 s", "q 와 s"],
  resultChoices: ["q", "~p ∨ r ∨ s", "~p ∨ ~q ∨ r", "~p ∨ q ∨ ~q ∨ r ∨ s"],
  correctPair: 0,
  correctResult: 1,
};

function ResolutionPractice() {
  const [pair, setPair] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);

  return (
    <section className="rounded-lg border border-rose-200 bg-white p-6 shadow-sm dark:border-rose-900 dark:bg-gray-900">
      <SectionTitle
        title="도출연역 선택 실습"
        subtitle="두 절에서 상보 리터럴을 고르고 제거 후 남는 절을 직접 선택"
      />
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-300">절 집합</div>
          <div className="space-y-2">
            {resolutionPractice.clauses.map((clause) => (
              <div key={clause} className="rounded-md bg-white p-3 font-mono text-sm font-bold dark:bg-gray-900">
                {clause}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-gray-600 dark:text-gray-300">
            도출연역은 서로 부정 관계인 상보 리터럴 하나씩을 제거하고, 남은 리터럴을 논리합으로 묶어 새 절을 만듦.
          </p>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-3 text-sm font-bold">1. 어떤 리터럴 쌍을 해소할 수 있는가?</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {resolutionPractice.pairChoices.map((choice, index) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => setPair(index)}
                  className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                    pair === index
                      ? index === resolutionPractice.correctPair
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950"
                        : "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950"
                      : "border-gray-200 bg-white hover:border-rose-300 dark:border-gray-800 dark:bg-gray-900"
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
            {pair !== null && (
              <div className="mt-3 rounded-md bg-white p-3 text-xs leading-5 dark:bg-gray-900">
                {pair === resolutionPractice.correctPair
                  ? "정답입니다. q와 ~q는 상보 리터럴이므로 함께 제거할 수 있음."
                  : "오답입니다. 도출연역에서는 같은 변수의 긍정/부정 쌍만 제거할 수 있음."}
              </div>
            )}
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-3 text-sm font-bold">2. 제거 후 얻는 절은?</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {resolutionPractice.resultChoices.map((choice, index) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => setResult(index)}
                  className={`rounded-md border px-3 py-2 text-left font-mono text-sm transition ${
                    result === index
                      ? index === resolutionPractice.correctResult
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950"
                        : "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950"
                      : "border-gray-200 bg-white hover:border-rose-300 dark:border-gray-800 dark:bg-gray-900"
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
            {result !== null && (
              <div className="mt-3 rounded-md bg-white p-3 text-xs leading-5 dark:bg-gray-900">
                {result === resolutionPractice.correctResult
                  ? "정답입니다. q와 ~q를 제거하고 남은 ~p, r, s를 모아 ~p ∨ r ∨ s가 됨."
                  : "오답입니다. 해소한 상보 리터럴을 결과 절에 다시 남기면 도출연역 결과가 아님."}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const unificationCases = [
  {
    label: "객체가 이미 일치",
    parentA: "~Father(A, B) ∨ Male(A)",
    parentB: "Father(A, B)",
    substitution: "치환 없음",
    result: "Male(A)",
    resolvable: true,
    reason: "Father(A, B)와 ~Father(A, B)가 상보 리터럴이고 객체도 같음.",
  },
  {
    label: "객체 불일치",
    parentA: "~Father(A, B) ∨ Male(A)",
    parentB: "Father(C, D)",
    substitution: "불가능",
    result: "도출 불가",
    resolvable: false,
    reason: "A,B와 C,D가 서로 다른 객체상수라서 같은 술어로 맞출 수 없음.",
  },
  {
    label: "단일화 필요",
    parentA: "~Father(x, y) ∨ Male(x)",
    parentB: "Father(A, B)",
    substitution: "x ← A, y ← B",
    result: "Male(A)",
    resolvable: true,
    reason: "객체변수 x,y를 A,B로 대체하면 Father(A,B)와 ~Father(A,B)가 되어 해소 가능.",
  },
];

function PredicateResolutionLab() {
  const [caseIndex, setCaseIndex] = useState(2);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const item = unificationCases[caseIndex];
  const correct = answer === item.resolvable;

  return (
    <section className="rounded-lg border border-rose-200 bg-white p-6 shadow-sm dark:border-rose-900 dark:bg-gray-900">
      <SectionTitle
        title="술어논리 도출연역과 단일화"
        subtitle="객체를 포함한 논리식은 상보 리터럴뿐 아니라 객체 일치 여부까지 확인"
      />
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-2">
          {unificationCases.map((candidate, index) => (
            <button
              key={candidate.label}
              type="button"
              onClick={() => {
                setCaseIndex(index);
                setAnswer(null);
              }}
              className={`w-full rounded-lg border p-3 text-left text-sm font-semibold transition ${
                caseIndex === index
                  ? "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-rose-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
              }`}
            >
              {candidate.label}
            </button>
          ))}
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">부모절</div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-md bg-white p-3 font-mono text-sm dark:bg-gray-900">{item.parentA}</div>
            <div className="rounded-md bg-white p-3 font-mono text-sm dark:bg-gray-900">{item.parentB}</div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              { label: "도출 가능", value: true },
              { label: "도출 불가", value: false },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setAnswer(option.value)}
                className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                  answer === option.value
                    ? correct
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950"
                      : "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950"
                    : "border-gray-200 bg-white hover:border-rose-300 dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-md border border-rose-100 bg-white p-3 text-sm leading-6 dark:border-rose-900 dark:bg-gray-900">
            <div>
              치환: <span className="font-mono font-bold">{item.substitution}</span>
            </div>
            <div>
              도출절: <span className="font-mono font-bold">{item.result}</span>
            </div>
          </div>
          {answer !== null && (
            <div
              className={`mt-3 rounded-md p-3 text-xs leading-5 ${
                correct
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                  : "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
              }`}
            >
              <div className="font-bold">{correct ? "정답입니다." : "오답입니다."}</div>
              {item.reason}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const clauseSteps = [
  {
    title: "함의 제거",
    before: "P(x) → P(f(x,y))",
    after: "~P(x) ∨ P(f(x,y))",
    rule: "p→q를 ~p∨q로 표현.",
  },
  {
    title: "부정 범위 축소",
    before: "~∀y {~Q(x,y) ∨ P(y)}",
    after: "∃y {Q(x,y) ∧ ~P(y)}",
    rule: "드모르강 법칙과 한정기호 부정 등식 적용.",
  },
  {
    title: "변수 표준화",
    before: "∃y {Q(x,y) ∧ ~P(y)}",
    after: "∃w {Q(x,w) ∧ ~P(w)}",
    rule: "다른 범위의 변수 이름 충돌을 막기 위해 변수명을 바꿈.",
  },
  {
    title: "존재기호 제거",
    before: "∃w {Q(x,w) ∧ ~P(w)}",
    after: "Q(x,g(x)) ∧ ~P(g(x))",
    rule: "존재변수는 앞의 전칭변수에 의존하는 스콜렘 함수로 대체.",
  },
  {
    title: "관두형으로 표현",
    before: "~P(x) ∨ ~P(y) ∨ P(f(x,y))",
    after: "∀x∀y {~P(x) ∨ ~P(y) ∨ P(f(x,y))}",
    rule: "한정기호를 식의 앞쪽으로 모음.",
  },
  {
    title: "연언표준형 변환",
    before: "A ∨ (B ∧ C)",
    after: "(A ∨ B) ∧ (A ∨ C)",
    rule: "도출연역을 위해 절들의 논리곱 형태로 분리.",
  },
  {
    title: "전칭기호와 ∧ 제거",
    before: "∀x∀y {C1 ∧ C2 ∧ C3}",
    after: "C1, C2, C3",
    rule: "절 집합에서는 전칭기호를 생략하고 각 절을 리스트 항목으로 둠.",
  },
  {
    title: "변수 이름 재표준화",
    before: "~P(x) ∨ Q(x,g(x))",
    after: "~P(x2) ∨ Q(x2,g(x2))",
    rule: "절마다 변수 이름을 다르게 하여 이후 단일화 혼동을 줄임.",
  },
];

function ClauseSeparationTimeline() {
  const [step, setStep] = useState(0);
  const item = clauseSteps[step];

  return (
    <section className="rounded-lg border border-violet-200 bg-white p-6 shadow-sm dark:border-violet-900 dark:bg-gray-900">
      <SectionTitle
        title="술어논리식 절 분리 절차"
        subtitle="도출연역에 넣기 전 복잡한 술어논리식을 절 집합으로 바꾸는 단계"
      />
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {clauseSteps.map((candidate, index) => (
            <button
              key={candidate.title}
              type="button"
              onClick={() => setStep(index)}
              className={`rounded-lg border p-3 text-left text-sm transition ${
                step === index
                  ? "border-violet-400 bg-violet-50 text-violet-700 dark:bg-violet-950"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-violet-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
              }`}
            >
              <span className="mr-2 font-mono text-xs">{index + 1}</span>
              {candidate.title}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950"
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
              <Play size={16} />
              {step + 1}. {item.title}
            </div>
            <div className="grid gap-3">
              <div className="rounded-md bg-white p-3 dark:bg-gray-900">
                <div className="mb-1 text-xs font-bold text-gray-500">변환 전</div>
                <div className="font-mono text-sm">{item.before}</div>
              </div>
              <div className="rounded-md bg-white p-3 dark:bg-gray-900">
                <div className="mb-1 text-xs font-bold text-gray-500">변환 후</div>
                <div className="font-mono text-sm font-bold text-violet-700 dark:text-violet-300">{item.after}</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.rule}</p>
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep((value) => Math.max(0, value - 1))}
                className="rounded-md border border-gray-200 px-3 py-2 text-xs font-semibold dark:border-gray-800"
              >
                이전
              </button>
              <span className="text-xs text-gray-500">{step + 1}/{clauseSteps.length}</span>
              <button
                type="button"
                onClick={() => setStep((value) => Math.min(clauseSteps.length - 1, value + 1))}
                className="rounded-md bg-violet-500 px-3 py-2 text-xs font-semibold text-white"
              >
                다음
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

const proofSteps = [
  {
    title: "증명 목표 부정",
    active: ["~Above(A,TABLE)"],
    explain: "증명하려는 Above(A,TABLE)을 부정하여 절 리스트에 넣음.",
  },
  {
    title: "전이 공리와 해소",
    active: ["~Above(x,y) ∨ ~Above(y,z) ∨ Above(x,z)", "~Above(A,TABLE)"],
    explain: "x←A, z←TABLE로 단일화하여 ~Above(A,y) ∨ ~Above(y,TABLE)을 얻는 방향으로 진행.",
  },
  {
    title: "On이면 Above 공리 적용",
    active: ["~On(u,v) ∨ Above(u,v)", "~Above(A,y) ∨ ~Above(y,TABLE)"],
    explain: "Above 조건을 On 조건으로 바꾸어 관측 사실과 연결할 수 있는 절을 만듦.",
  },
  {
    title: "관측 사실 On(A,B) 사용",
    active: ["On(A,B)", "~On(A,y) ∨ ~On(y,TABLE)"],
    explain: "y←B로 단일화하면 ~On(B,TABLE)이 남음.",
  },
  {
    title: "관측 사실 On(B,TABLE) 사용",
    active: ["On(B,TABLE)", "~On(B,TABLE)"],
    explain: "상보 리터럴을 해소하면 false가 도출됨.",
  },
  {
    title: "false 도출",
    active: ["false"],
    explain: "목표의 부정에서 모순이 생겼으므로 Above(A,TABLE)이 참임이 증명됨.",
  },
];

function ResolutionProofSimulator() {
  const [step, setStep] = useState(0);
  const item = proofSteps[step];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gray-900">
      <SectionTitle
        title="도출연역 정리 증명 시뮬레이터"
        subtitle="정리를 부정해 절 리스트에 넣고 false가 도출되는지 단계별 확인"
      />
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            블록 관계와 공리
          </div>
          <div className="mb-4 flex items-end justify-center gap-3 rounded-md bg-white p-4 dark:bg-gray-900">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-20 items-center justify-center rounded-md bg-violet-500 font-bold text-white">A</div>
              <div className="flex h-12 w-20 items-center justify-center rounded-md bg-cyan-500 font-bold text-white">B</div>
              <div className="flex h-8 w-28 items-center justify-center rounded-md bg-gray-700 text-xs font-bold text-white">TABLE</div>
            </div>
            <div className="text-xs leading-6 text-gray-600 dark:text-gray-300">
              <div>On(A,B)</div>
              <div>On(B,TABLE)</div>
            </div>
          </div>
          <div className="space-y-2 text-xs leading-5">
            <div className="rounded-md bg-white p-3 font-mono dark:bg-gray-900">On(x,y) → Above(x,y)</div>
            <div className="rounded-md bg-white p-3 font-mono dark:bg-gray-900">Above(x,y) ∧ Above(y,z) → Above(x,z)</div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">
            {step + 1}. {item.title}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-2"
            >
              {item.active.map((clause) => (
                <div
                  key={clause}
                  className={`rounded-md p-3 font-mono text-sm font-bold ${
                    clause === "false"
                      ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200"
                      : "bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                  }`}
                >
                  {clause}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
          <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.explain}</p>
          <div className="mt-5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((value) => Math.max(0, value - 1))}
              className="rounded-md border border-gray-200 px-3 py-2 text-xs font-semibold dark:border-gray-800"
            >
              이전
            </button>
            <span className="text-xs text-gray-500">{step + 1}/{proofSteps.length}</span>
            <button
              type="button"
              onClick={() => setStep((value) => Math.min(proofSteps.length - 1, value + 1))}
              className="rounded-md bg-slate-700 px-3 py-2 text-xs font-semibold text-white"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const ai6ExamQuestions = [
  {
    q: "다음 중 조건명제 p → q와 논리적으로 동치인 것은?",
    choices: ["p ∨ q", "~p ∨ q", "p ∧ ~q", "~p ∧ q"],
    answer: 1,
    explain: "p → q는 p가 참이고 q가 거짓인 경우에만 거짓. ~p ∨ q도 같은 진리표를 가지며, p∨q나 p∧~q는 그 거짓 행이 다름.",
  },
  {
    q: "다음 중 연언표준형에 해당하는 식은?",
    choices: [
      "(p ∧ q) ∨ (~r ∧ s)",
      "(~p ∨ q) ∧ (r ∨ s ∨ p)",
      "~(p ∨ q) ∧ (~r ∨ s)",
      "~(p ∧ q) ∨ ~(~r ∧ s)",
    ],
    answer: 1,
    explain: "연언표준형은 리터럴들의 논리합으로 된 절들을 논리곱으로 연결한 형식. 논리곱 절을 논리합으로 묶은 식은 선언표준형 쪽에 가까움.",
  },
  {
    q: "다음 중 ∀x {P(x) → Q(x)}의 부정과 동치인 것은?",
    choices: [
      "∀x {P(x) ∧ ~Q(x)}",
      "∀x {P(x) ∨ Q(x)}",
      "∃x {P(x) ∧ ~Q(x)}",
      "∃x {P(x) ∨ Q(x)}",
    ],
    answer: 2,
    explain: "전체 부정은 ∃로 바뀌고, P→Q는 ~P∨Q이므로 그 부정은 P∧~Q. ∀가 그대로 남은 선택지는 한정자 부정 규칙을 놓친 것.",
  },
  {
    q: "전제 p → q와 ~q가 주어졌을 때 도출되는 결론은?",
    choices: ["p", "~p", "q", "p ∧ q"],
    answer: 1,
    explain: "부정논법(modus tollens): p이면 q인데 q가 거짓이면 p도 거짓이어야 함. q를 결론으로 내는 것은 긍정논법의 구조.",
  },
  {
    q: "두 절 ~p ∨ q ∨ r 과 ~q ∨ s를 도출연역할 때 q와 ~q를 해소하면 얻는 절은?",
    choices: ["q", "~p ∨ r ∨ s", "~p ∨ ~q ∨ r", "~p ∨ q ∨ ~q ∨ r ∨ s"],
    answer: 1,
    explain: "상보 리터럴 q와 ~q를 제거하고 남은 리터럴들을 모아 ~p ∨ r ∨ s를 얻음. 상보 리터럴을 남긴 선택지는 도출연역 결과가 아님.",
  },
  {
    q: "다음 중 정형식 구성 규칙에 맞지 않는 것은?",
    choices: ["p", "~p", "p → q", "p q →"],
    answer: 3,
    explain: "기본명제 p, 그 부정 ~p, 두 정형식을 조건명제로 결합한 p→q는 정형식. p q →는 강의의 논리식 결합 규칙을 따르지 않음.",
  },
  {
    q: "다음 중 항진식에 해당하는 것은?",
    choices: ["p ∧ ~p", "p ∨ ~p", "p → ~p", "p ∧ q"],
    answer: 1,
    explain: "p∨~p는 p가 참이든 거짓이든 항상 참. p∧~p는 항상 거짓이고, p→~p와 p∧q는 거짓 행이 존재함.",
  },
  {
    q: "∀x P(x)의 부정으로 알맞은 것은?",
    choices: ["∀x ~P(x)", "∃x ~P(x)", "~∃x ~P(x)", "∃x P(x)"],
    answer: 1,
    explain: "전체 대상이 P라는 명제의 부정은 P가 아닌 대상이 적어도 하나 존재한다는 뜻. 따라서 ∀는 ∃로 바뀌고 술어가 부정됨.",
  },
  {
    q: "술어논리에서 father(철수)가 항(term)이 되는 이유로 알맞은 것은?",
    choices: ["술어이기 때문", "객체상수이기 때문", "함수기호가 항을 받아 정의역의 원소를 나타내기 때문", "한정기호이기 때문"],
    answer: 2,
    explain: "항은 객체상수·객체변수이거나, 함수기호가 항들을 인수로 받아 만든 표현. father(철수)는 함수항이며 Korean(father(철수))처럼 술어의 객체가 될 수 있음.",
  },
  {
    q: "~Father(x,y) ∨ Male(x)와 Father(A,B)를 도출연역할 때 필요한 단일화는?",
    choices: ["x←B, y←A", "x←A, y←B", "A←x, B←y", "단일화 불가능"],
    answer: 1,
    explain: "Father(x,y)를 Father(A,B)와 일치시키려면 첫 번째 인수 x를 A로, 두 번째 인수 y를 B로 치환. 그러면 Male(A)가 도출됨.",
  },
  {
    q: "도출연역에 의한 정리 증명 알고리즘에서 false가 도출되면 무엇을 의미하는가?",
    choices: ["증명하려던 정리가 참임", "공리가 모두 삭제됨", "정리가 항상 거짓임", "단일화를 할 수 없음"],
    answer: 0,
    explain: "증명할 정리를 부정하여 공리 리스트에 추가한 뒤 모순(false)이 나오면, 그 부정이 성립할 수 없으므로 원래 정리가 참임이 증명됨.",
  },
];

function AI6ExamPractice() {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const correct = ai6ExamQuestions.reduce(
    (count, question, index) => count + (selected[index] === question.answer ? 1 : 0),
    0,
  );

  return (
    <section className="rounded-lg border border-indigo-200 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-gray-900">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <SectionTitle
          title="실전형 객관식 문제"
          subtitle="기출 기반 변형 문제: 논리식 변환, 표준형 판별, 추론 결론을 묻는 객관식"
        />
        <div className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          정답 {correct}/{ai6ExamQuestions.length}
        </div>
      </div>
      <div className="space-y-4">
        {ai6ExamQuestions.map((question, questionIndex) => {
          const chosen = selected[questionIndex];
          return (
            <div key={question.q} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <div className="mb-3 flex items-start gap-2 text-sm font-bold leading-6">
                <Target size={16} className="mt-1 shrink-0 text-indigo-500" />
                {questionIndex + 1}. {question.q}
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {question.choices.map((choice, choiceIndex) => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => setSelected((prev) => ({ ...prev, [questionIndex]: choiceIndex }))}
                    className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                      chosen === choiceIndex
                        ? choiceIndex === question.answer
                          ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950"
                          : "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950"
                        : "border-gray-200 bg-gray-50 hover:border-indigo-300 dark:border-gray-800 dark:bg-gray-950"
                    }`}
                  >
                    <span className="mr-2 font-mono text-xs">{choiceIndex + 1}</span>
                    {choice}
                  </button>
                ))}
              </div>
              {chosen !== undefined && (
                <div
                  className={`mt-3 rounded-md p-3 text-xs leading-5 ${
                    chosen === question.answer
                      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                      : "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
                  }`}
                >
                  <div className="mb-1 font-bold">
                    {chosen === question.answer ? "정답입니다." : "오답입니다."}
                    <span className="ml-2">
                      정답: {question.answer + 1}번 {question.choices[question.answer]}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">해설: </span>
                    {question.explain}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AI6DeepDive() {
  return (
    <div className="space-y-8">
      <AI6LearningFlow />
      <TruthTableLab />
      <WffBuilderLab />
      <StandardFormConceptPrimer />
      <StandardFormExplorer />
      <TautologyChallenge />
      <PredicateStructureExplorer />
      <QuantifierLawDrill />
      <PredicateLogicLab />
      <InferenceStepper />
      <ResolutionPractice />
      <PredicateResolutionLab />
      <ClauseSeparationTimeline />
      <ResolutionProofSimulator />
      <AI6ExamPractice />
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <SectionTitle title="6강 시험 전 체크" subtitle="핵심 개념별 최소 통과 기준" />
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "조건명제 p→q가 거짓인 행을 직접 찾을 수 있음",
            "p→q를 ~p∨q로 바꿔 같은 진리표를 확인할 수 있음",
            "정형식과 비정형식을 구성 규칙으로 판별할 수 있음",
            "CNF와 DNF에서 절과 리터럴의 결합 방향을 구분할 수 있음",
            "진리표의 모든 행을 확인해 항진식 여부를 말할 수 있음",
            "객체상수, 객체변수, 함수항을 구분할 수 있음",
            "술어논리식의 항과 wff 구성 규칙을 말할 수 있음",
            "∀와 ∃의 부정을 서로 바꾸어 쓸 수 있음",
            "긍정논법과 부정논법의 전제-결론 구조를 구분할 수 있음",
            "도출연역에서 상보 리터럴을 제거해 새 절을 만들 수 있음",
            "단일화 치환을 적용해 술어논리 도출 가능 여부를 판단할 수 있음",
            "술어논리식을 절 형태로 바꾸는 주요 절차를 순서대로 설명할 수 있음",
            "정리의 부정에서 false가 나오면 원 정리가 증명됨을 설명할 수 있음",
          ].map((item) => (
            <label
              key={item}
              className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm leading-5 dark:border-gray-800 dark:bg-gray-950"
            >
              <input type="checkbox" className="mt-1 h-4 w-4 accent-violet-500" />
              {item}
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}

function sourceEvidence(text: string) {
  if (text.startsWith("강의") || text.startsWith("교재")) return text;
  return `강의·교재의 정의와 공식에 따라, ${text}`;
}

const lectureEnhancements: Record<number, LectureEnhancement> = {
  7: {
    coverage: [
      "퍼지집합: 소속함수 μA(x): X → [0,1]와 고전집합의 특수 경우",
      "퍼지집합 연산: 여집합 1-μ, 합집합 max, 교집합 min",
      "퍼지집합 연산의 예외: A∪A보수≠U, A∩A보수≠공집합",
      "퍼지논리: 고전논리와 달리 연속적인 논리값을 허용",
      "퍼지추론: 규칙 평가, 결론 퍼지집합 결합, 비퍼지화 순서",
    ],
    visualPoints: [
      {
        title: "소속함수 곡선",
        concept: "정상 체온과 고열처럼 경계가 모호한 대상을 0~1 소속도로 표현",
        why: "37.9도처럼 이분법으로 자르기 어려운 값을 정도로 읽어야 함.",
        interaction: "값을 바꾸며 정상·고열 소속도가 동시에 변하는 구조 확인",
        steps: ["입력값 x 선택", "각 퍼지집합의 μ 계산", "μ는 확률이 아니라 소속 정도로 해석"],
      },
      {
        title: "min/max 연산 표",
        concept: "A∪B는 max, A∩B는 min, A보수는 1-μA",
        why: "시험에서 숫자 표가 주어지면 연산자 선택이 곧 정답 기준이 됨.",
        interaction: "행을 선택해 합집합·교집합·여집합 값을 계산",
        steps: ["μA와 μB 확인", "합집합은 큰 값 선택", "교집합은 작은 값 선택", "보수는 1에서 뺌"],
      },
      {
        title: "퍼지추론 파이프라인",
        concept: "IF-THEN 규칙의 발화 강도를 계산한 뒤 결론을 결합하고 비퍼지화",
        why: "퍼지제어 문제는 규칙 평가와 최종 수치화 순서를 구분해야 함.",
        interaction: "조건 소속도를 고르고 규칙 강도와 결론 단계를 추적",
        steps: ["입력 퍼지화", "규칙별 min 또는 max 적용", "결론 퍼지집합 결합", "비퍼지화"],
      },
    ],
    drills: [
      {
        title: "퍼지 연산 판정",
        prompt: "μA(c)=0.4, μB(c)=0.5일 때 μA∪B(c)는?",
        choices: ["0.1", "0.4", "0.5", "0.9"],
        answer: 2,
        explain: "퍼지 합집합은 max(μA, μB)이므로 max(0.4, 0.5)=0.5.",
      },
      {
        title: "보수 예외 확인",
        prompt: "μA(x)=0.6이면 min(μA(x), 1-μA(x))는?",
        choices: ["0", "0.4", "0.6", "1"],
        answer: 1,
        explain: "A∩A보수는 min(0.6,0.4)=0.4로, 고전집합처럼 항상 공집합이 아님.",
      },
    ],
  },
  8: {
    coverage: [
      "컴퓨터 시각 시스템 단계: 영상 취득 → 전처리 → 영상 분할 → 정규화 → 영상 표현 → 분석",
      "디지털 영상: g(x,y), 해상도, 픽셀, RGB 색 좌표계",
      "4-이웃 연결성과 8-이웃 연결성의 경로 차이",
      "전처리: 잡음 제거, 명암·대비 개선, 영상 변환",
      "영상 분할: 임계치, 영역 기반, 경계 기반 분할",
    ],
    visualPoints: [
      {
        title: "컴퓨터 시각 처리 파이프라인",
        concept: "취득한 영상을 처리하기 좋은 형태로 바꾸고, 영역·특징·인식으로 이어지는 흐름",
        why: "전처리, 분할, 정규화, 표현의 역할이 섞이면 서술형 답안이 흔들림.",
        interaction: "단계를 클릭해 입력과 출력이 무엇인지 확인",
        steps: ["영상 취득", "전처리", "영상 분할", "정규화", "영상 표현", "분석"],
      },
      {
        title: "픽셀 연결성",
        concept: "4-이웃은 상하좌우, 8-이웃은 대각선까지 연결로 인정",
        why: "같은 두 픽셀이 4-이웃에서는 분리되고 8-이웃에서는 연결될 수 있음.",
        interaction: "연결성 기준을 바꿔 p1에서 p2까지 경로 존재 여부 판정",
        steps: ["중심 픽셀 p 확인", "상하좌우만 보면 4-이웃", "대각선 포함 시 8-이웃", "분할 결과 차이 해석"],
      },
      {
        title: "임계치 분할",
        concept: "픽셀 밝기값을 기준으로 객체와 배경을 이진화",
        why: "임계값 변화가 객체 크기와 잡음 포함 여부를 바꿈.",
        interaction: "임계값을 바꾸며 객체 픽셀 수 변화를 비교",
        steps: ["밝기 행렬 확인", "임계값 선택", "객체/배경 판정", "분할 품질 평가"],
      },
    ],
    drills: [
      {
        title: "연결성 판정",
        prompt: "두 픽셀이 대각선으로만 닿아 있을 때 4-이웃 연결성에서는?",
        choices: ["항상 연결", "연결 경로 없음", "RGB일 때만 연결", "임계값이 없어야 연결"],
        answer: 1,
        explain: "4-이웃은 상하좌우만 인정하므로 대각선 접촉만으로는 연결되지 않음.",
      },
      {
        title: "전처리 목적",
        prompt: "영상 취득 과정에서 생긴 잡음을 줄이고 대비를 개선하는 단계는?",
        choices: ["영상 취득", "전처리", "영상 표현", "분석"],
        answer: 1,
        explain: "전처리는 잡음 제거, 명암·대비 개선, 영상 변환을 수행.",
      },
    ],
  },
  9: {
    coverage: [
      "정규화: 위치, 크기, 진폭 변형을 기준 패턴으로 회복",
      "특징: 선, 에지, 모퉁이, 덩어리, 획 정보",
      "특징 형태: 기호 특징과 벡터 특징, 특징공간",
      "HOG와 PCA: 방향성 히스토그램, 주성분 기반 차원 축소",
      "거리측정자 공리와 최근접 이웃·베이즈 분류기의 결정 기준",
    ],
    visualPoints: [
      {
        title: "정규화 전후 비교",
        concept: "크기·위치·진폭 차이를 줄여 같은 기준에서 비교",
        why: "분류기는 촬영 조건 차이가 아니라 패턴 차이를 봐야 함.",
        interaction: "변형 유형을 선택해 어떤 정규화가 필요한지 판정",
        steps: ["원 패턴 관찰", "위치/크기/진폭 차이 찾기", "기준 형태로 변환", "특징 추출"],
      },
      {
        title: "특징 벡터와 특징공간",
        concept: "d개의 특징 요소가 d차원 특징공간의 한 점을 만듦",
        why: "거리측정자와 분류기는 원영상이 아니라 특징공간에서 작동.",
        interaction: "두 특징 벡터를 비교해 거리와 가까운 클래스 확인",
        steps: ["특징 선택", "벡터 구성", "거리 계산", "분류 결정"],
      },
      {
        title: "PCA 방향",
        concept: "가장 큰 변동을 보이는 주성분을 찾아 직교변환",
        why: "차원 축소와 특징 추출의 기준을 말로만 외우면 적용 문제가 어려움.",
        interaction: "분산이 큰 축과 작은 축을 구분",
        steps: ["데이터 분포 확인", "최대 분산 방향 선택", "직교 축 구성", "저차원 표현"],
      },
    ],
    drills: [
      {
        title: "거리측정자 공리",
        prompt: "거리 J(x,y)가 0이 되는 경우로 알맞은 것은?",
        choices: ["항상 0", "x=y일 때", "x와 y가 다를 때", "차원이 클 때"],
        answer: 1,
        explain: "거리측정자는 J(x,y)=0 iff x=y 조건을 만족해야 함.",
      },
      {
        title: "특징 선택",
        prompt: "다각형 패턴만 분류한다면 강의 예처럼 가장 직접적인 특징은?",
        choices: ["파일명", "꼭짓점의 개수", "촬영 날짜", "배경색만"],
        answer: 1,
        explain: "대상이 다각형으로 한정되면 꼭짓점 개수가 분류에 유용한 특징이 될 수 있음.",
      },
    ],
  },
  10: {
    coverage: [
      "학습 유형: 지도, 비지도, 준지도, 자기지도, 전이, 강화학습",
      "귀납적 학습: 일부 학습표본에서 일반화된 가설 h를 형성",
      "이진 분류기 분할표: TP, FN, FP, TN",
      "평가 지표: 정확도, 정밀도, 재현율, F1의 의미",
      "결정트리: 속성 검사, 분기, 리프, 불순도 감소 기준",
    ],
    visualPoints: [
      {
        title: "학습 유형 분류기",
        concept: "레이블 유무, 보상 유무, 사전학습 활용 여부로 학습 유형을 구분",
        why: "시험 선택지는 레이블 조건을 바꿔 혼동을 유도함.",
        interaction: "데이터 조건을 보고 지도/비지도/강화/전이학습 선택",
        steps: ["입력만 있는가", "정답 레이블이 있는가", "보상이 있는가", "기존 모델을 활용하는가"],
      },
      {
        title: "분할표 계산",
        concept: "양성/음성 실제 레이블과 예측 결과로 TP, FN, FP, TN을 채움",
        why: "분류기 평가 문제는 표 위치를 틀리면 지표가 모두 틀어짐.",
        interaction: "사례를 분할표 셀에 배치하고 평가 지표 해석",
        steps: ["실제 양성/음성 확인", "예측 양성/음성 확인", "TP/FN/FP/TN 배치", "지표 계산"],
      },
      {
        title: "결정트리 분기",
        concept: "불순도를 가장 많이 줄이는 속성을 선택해 트리를 확장",
        why: "단순 암기가 아니라 왜 그 속성이 루트가 되는지 설명해야 함.",
        interaction: "후보 속성의 불순도 감소량을 비교",
        steps: ["훈련 사례 확인", "후보 속성별 분할", "불순도 감소 비교", "노드 선택"],
      },
    ],
    drills: [
      {
        title: "학습 유형 판정",
        prompt: "입력과 기대 출력 레이블 쌍이 함께 주어지는 학습은?",
        choices: ["지도학습", "비지도학습", "강화학습", "전이학습"],
        answer: 0,
        explain: "지도학습은 입력에 대해 기대하는 출력 또는 레이블을 학습 데이터로 제시.",
      },
      {
        title: "분할표 위치",
        prompt: "실제 양성인데 분류기가 음성으로 예측한 경우는?",
        choices: ["TP", "FP", "FN", "TN"],
        answer: 2,
        explain: "양성 표본을 놓친 경우이므로 거짓 음성(False Negative).",
      },
    ],
  },
  11: {
    coverage: [
      "선형회귀: HL(x)=w0+w1x, 다중 선형회귀 HL(x)=w^T x",
      "비용함수: 평균제곱오차 MSE와 argmin 개념",
      "경사하강법: 기울기의 음의 방향으로 w0, w1 갱신",
      "로지스틱 회귀: 시그모이드/소프트맥스를 통한 클래스 확률",
      "군집화: k-means의 할당과 중심 갱신 반복",
    ],
    visualPoints: [
      {
        title: "선형가설과 오차",
        concept: "예측 직선과 표본 사이 차이를 비용함수로 모음",
        why: "회귀의 목표는 점을 지나는 직선이 아니라 MSE가 작은 가중치 찾기.",
        interaction: "w0, w1 변화에 따라 예측값과 오차 방향 확인",
        steps: ["표본 확인", "HL(x) 계산", "오차 제곱", "MSE 비교"],
      },
      {
        title: "경사하강 갱신",
        concept: "w(k+1)=w(k)-η∇C",
        why: "학습률과 기울기 부호가 갱신 방향을 결정.",
        interaction: "기울기가 양/음일 때 가중치가 어느 방향으로 움직이는지 선택",
        steps: ["현재 w 선택", "기울기 계산", "음의 방향으로 이동", "비용 감소 확인"],
      },
      {
        title: "k-means 반복",
        concept: "가까운 중심에 할당하고 각 군집 평균으로 중심을 갱신",
        why: "비지도 군집화의 핵심은 레이블이 아니라 거리와 중심.",
        interaction: "표본을 중심에 배정하고 새 중심 위치를 계산",
        steps: ["초기 중심 선택", "거리 기반 할당", "군집 평균 계산", "중심 갱신 반복"],
      },
    ],
    drills: [
      {
        title: "MSE 해석",
        prompt: "예측 오차가 -3, 1이면 제곱오차 합은?",
        choices: ["-2", "4", "10", "16"],
        answer: 2,
        explain: "(-3)^2 + 1^2 = 10. 평균제곱오차는 이를 표본 수로 나눈 값.",
      },
      {
        title: "k-means 결정",
        prompt: "k-means에서 표본을 군집에 배정하는 직접 기준은?",
        choices: ["정답 레이블", "가장 가까운 중심", "가장 큰 학습률", "가장 작은 클래스 번호"],
        answer: 1,
        explain: "k-means는 각 표본을 가장 가까운 중심에 할당한 뒤 중심을 갱신.",
      },
    ],
  },
  12: {
    coverage: [
      "뉴런 모델: 입력, 가중치, 바이어스, 가중합, 활성함수, 출력",
      "활성함수: 단위 계단, 시그모이드, tanh, ReLU",
      "연결 형태: 흥분성/금지, 층내/층간, 피드포워드/순환",
      "학습 절차: 손실함수, 하이퍼파라미터, 초기화, 훈련, 검증, 테스트",
      "퍼셉트론 학습: 선형 결정경계와 XOR 한계",
    ],
    visualPoints: [
      {
        title: "뉴런 계산 흐름",
        concept: "y=f(Σ xi wi + b)",
        why: "가중합과 활성함수의 순서가 신경망 계산의 기본.",
        interaction: "입력과 가중치 부호를 바꾸며 출력 변화 확인",
        steps: ["입력 xi 확인", "가중치 wi 곱", "합과 바이어스 더하기", "활성함수 적용"],
      },
      {
        title: "활성함수 비교",
        concept: "계단, 시그모이드, tanh, ReLU의 출력 범위와 미분 가능성",
        why: "함수의 그래프 성질이 학습 가능성과 연결됨.",
        interaction: "입력값을 넣고 함수별 출력 범위 비교",
        steps: ["x 선택", "계단함수 판정", "시그모이드 출력", "tanh/ReLU 출력 비교"],
      },
      {
        title: "연결 구조 지도",
        concept: "신호 방향과 되먹임 여부에 따라 피드포워드와 순환 연결 구분",
        why: "12강의 연결 형태는 15강 RNN 이해의 선행 개념.",
        interaction: "연결 그림을 보고 구조 이름 선택",
        steps: ["뉴런 사이 방향 확인", "층 내부/층 사이 여부 확인", "순환 경로 존재 확인", "구조명 판정"],
      },
    ],
    drills: [
      {
        title: "뉴런 출력 계산",
        prompt: "x=(1,2), w=(3,-1), b=1이면 가중합은?",
        choices: ["0", "2", "4", "6"],
        answer: 1,
        explain: "1*3 + 2*(-1) + 1 = 2.",
      },
      {
        title: "ReLU 판정",
        prompt: "ReLU(-2)의 값은?",
        choices: ["-2", "0", "0.5", "2"],
        answer: 1,
        explain: "ReLU는 max(0,x)이므로 음수 입력은 0.",
      },
    ],
  },
  13: {
    coverage: [
      "다층 퍼셉트론: 은닉층으로 비선형 결정경계를 표현",
      "오차역전파: 미분 가능한 활성함수와 경사하강법 사용",
      "체인 룰: 출력층에서 은닉층 방향으로 오차를 전달",
      "모멘텀: 이전 Δw를 반영해 지역최소치·고원 문제 개선",
      "RBM, SOM, LVQ의 구조와 학습 방식 차이",
    ],
    visualPoints: [
      {
        title: "역전파 방향",
        concept: "순전파로 출력과 손실을 계산한 뒤 출력층에서 입력층 방향으로 기울기 전달",
        why: "전파 방향을 틀리면 은닉층 가중치 갱신식을 해석할 수 없음.",
        interaction: "순전파/역전파 단계를 순서대로 배열",
        steps: ["입력층에서 출력 계산", "손실함수 계산", "출력층 δ 계산", "은닉층 δ 전달", "가중치 갱신"],
      },
      {
        title: "체인 룰 분해",
        concept: "∂C/∂w = ∂C/∂y * ∂y/∂u * ∂u/∂w",
        why: "오차역전파의 계산 근거는 연쇄법칙.",
        interaction: "각 항이 무엇을 의미하는지 선택",
        steps: ["손실 변화", "활성함수 변화", "가중합 변화", "곱으로 결합"],
      },
      {
        title: "경쟁학습 비교",
        concept: "SOM은 비지도 경쟁학습, LVQ는 지도 경쟁학습",
        why: "둘 다 대표 벡터를 쓰지만 레이블 사용 여부가 다름.",
        interaction: "학습 데이터 조건을 보고 SOM/LVQ 판정",
        steps: ["레이블 유무 확인", "승자 뉴런 선택", "대표 벡터 이동", "지도/비지도 구분"],
      },
    ],
    drills: [
      {
        title: "역전파 전제",
        prompt: "오차역전파에서 시그모이드처럼 미분 가능한 활성함수를 쓰는 이유는?",
        choices: ["파일 크기 감소", "기울기 계산", "픽셀 연결", "퍼지화"],
        answer: 1,
        explain: "가중치별 손실 기울기를 연쇄법칙으로 계산해야 하므로 미분 가능성이 중요.",
      },
      {
        title: "모멘텀 역할",
        prompt: "모멘텀 항 αΔw(n-1)의 목적은?",
        choices: ["이전 갱신 방향 일부 반영", "입력 삭제", "레이블 자동 생성", "합성곱 크기 계산"],
        answer: 0,
        explain: "이전 단계의 변화량을 반영해 훈련을 빠르게 하고 지역최소치나 고원 문제를 완화.",
      },
    ],
  },
  14: {
    coverage: [
      "심층 신경망 문제: 경사 소멸, 과적합, 데이터 부족, 계산량 증가",
      "학습 개선: ReLU 계열 활성함수, 가중치 초기화, GPU/TPU 병렬처리",
      "규제: 가중치 감쇠, L1/L2 규제, 드롭아웃",
      "CNN 구조: 합성곱층, 풀링층, ReLU층, 완전연결층",
      "합성곱 파라미터: 필터, stride, padding, feature map",
    ],
    visualPoints: [
      {
        title: "경사 소멸 경로",
        concept: "체인 룰로 입력층 방향으로 갈수록 경사가 지수적으로 작아질 수 있음",
        why: "딥러닝 학습 개선 기법의 원인이 되는 핵심 문제.",
        interaction: "활성함수와 층 수를 바꿔 경사 흐름을 비교",
        steps: ["출력층 오차", "연쇄 미분", "은닉층으로 전달", "초기 층 경사 약화"],
      },
      {
        title: "드롭아웃 훈련/평가",
        concept: "훈련 중 일부 뉴런을 무작위 제거하고, 훈련 후에는 모든 뉴런 사용",
        why: "과적합 완화 기법의 동작 시점이 시험에 자주 나옴.",
        interaction: "훈련 모드와 평가 모드를 전환해 활성 뉴런 확인",
        steps: ["훈련 중 확률 p 적용", "일부 뉴런 일시 제거", "가중치 공동적응 감소", "평가 시 전체 사용"],
      },
      {
        title: "합성곱 출력 크기",
        concept: "출력 크기는 입력, 필터, 패딩, 스트라이드에 의해 결정",
        why: "CNN 문제는 구조 이름뿐 아니라 feature map 크기 계산을 요구.",
        interaction: "입력 크기와 stride를 바꿔 출력 위치 수 계산",
        steps: ["입력 크기 확인", "필터 크기 확인", "padding 반영", "stride 간격으로 이동", "출력 크기 계산"],
      },
    ],
    drills: [
      {
        title: "드롭아웃 시점",
        prompt: "드롭아웃은 주로 언제 뉴런을 무작위 제거하는가?",
        choices: ["훈련 중", "최종 평가 후", "데이터 수집 전", "정답 채점 중"],
        answer: 0,
        explain: "드롭아웃은 훈련 중 일부 뉴런을 일시 제거하고 훈련 후에는 모든 뉴런을 사용.",
      },
      {
        title: "CNN 구성요소",
        prompt: "영상의 지역 특징을 필터로 추출하는 층은?",
        choices: ["합성곱층", "완전연결층", "출력 레이블", "분할표"],
        answer: 0,
        explain: "합성곱층은 필터를 이동시키며 지역 특징을 feature map으로 추출.",
      },
    ],
  },
  15: {
    coverage: [
      "심층 CNN: 저층은 낮은 수준 특징, 고층은 복합 특징",
      "ResNet: 잔차 블록 H(x)=F(x)+x, 스킵 연결과 1x1 합성곱",
      "RNN: ht=fh(Wx xt + Wh ht-1 + bh), 시퀀스와 기억",
      "BPTT: 시간 단계의 역순으로 경사가 전달",
      "LSTM/GRU와 Transformer: 장기 의존성 보완, self-attention과 위치 정보",
    ],
    visualPoints: [
      {
        title: "ResNet 잔차 블록",
        concept: "Layer 출력 F(x)에 입력 x를 더해 H(x)=F(x)+x를 구성",
        why: "깊은 네트워크가 층을 더 쌓아도 학습 품질을 유지하는 핵심 장치.",
        interaction: "채널 수가 같을 때 identity, 다를 때 1x1 Conv 사용 여부 판정",
        steps: ["입력 x 보존", "층을 거쳐 F(x) 계산", "x와 더하기", "ReLU 적용"],
      },
      {
        title: "RNN unroll",
        concept: "은닉상태 ht가 이전 ht-1과 현재 입력 xt를 함께 반영",
        why: "순환 구조를 시간축으로 펼쳐야 BPTT와 장기 의존성 문제를 이해.",
        interaction: "시간 단계를 이동하며 이전 상태가 현재 출력에 미치는 영향 확인",
        steps: ["x0 입력", "h0 계산", "x1과 h0로 h1 계산", "시간 역순으로 BPTT"],
      },
      {
        title: "Transformer attention",
        concept: "self-attention은 query, key, value로 토큰 사이 관계를 계산",
        why: "RNN과 달리 토큰 관계를 병렬적으로 계산하되 위치 정보가 별도로 필요.",
        interaction: "토큰 쌍의 관련도를 보고 attention weight 해석",
        steps: ["Q/K/V 생성", "관련도 점수 계산", "가중치 정규화", "value 가중합", "positional encoding 결합"],
      },
    ],
    drills: [
      {
        title: "잔차 연결 조건",
        prompt: "잔차 블록에서 F(x)와 x의 채널 수가 다르면 강의에서 제시한 보정 방법은?",
        choices: ["1x1 합성곱", "진리표", "퍼지 보수", "k-means"],
        answer: 0,
        explain: "Layer-2 출력과 x의 규격이 다르면 1x1 합성곱으로 규격을 맞출 수 있음.",
      },
      {
        title: "RNN 처리 대상",
        prompt: "RNN이 직접 겨냥하는 데이터 유형은?",
        choices: ["순서가 있는 시퀀스", "무작위 집합만", "고전집합", "정적 분할표"],
        answer: 0,
        explain: "RNN은 시계열, 문장처럼 연속적으로 발생하는 시퀀스 데이터를 처리.",
      },
    ],
  },
};

const extraQuizQuestions: Record<number, Quiz[]> = {
  7: [
    { q: "퍼지집합 A의 보수 소속도 μA보수(x)는?", choices: ["μA(x)", "1-μA(x)", "max(μA,μB)", "min(μA,μB)"], answer: 1, explain: "퍼지 보수는 1에서 원 소속도를 뺀 값." },
    { q: "퍼지 합집합 A∪B의 대표 연산은?", choices: ["min", "max", "평균만", "항상 0"], answer: 1, explain: "강의의 대표 퍼지 합집합 연산은 max." },
    { q: "퍼지 소속도에 대한 설명으로 알맞은 것은?", choices: ["항상 0 또는 1", "확률과 완전히 동일", "0과 1 사이의 소속 정도", "정답 레이블"], answer: 2, explain: "퍼지집합은 대상이 집합에 속하는 정도를 0~1 값으로 표현." },
  ],
  8: [
    { q: "컴퓨터 시각 시스템 처리 단계에서 영상 해석 단위를 다른 부분과 구분하는 처리는?", choices: ["영상 분할", "전이학습", "도출연역", "오차역전파"], answer: 0, explain: "영상 분할은 유사한 성격의 부분을 영역으로 묶고 다른 부분과 구분." },
    { q: "RGB 색 좌표계에서 한 픽셀 g(x,y)가 표현하는 것은?", choices: ["정답 레이블", "R/G/B 성분", "경사하강 횟수", "퍼지 규칙"], answer: 1, explain: "컬러 영상의 픽셀은 R, G, B 성분으로 색 정보를 표현." },
    { q: "8-이웃 연결성이 4-이웃보다 더 넓은 이유는?", choices: ["대각선 이웃 포함", "색상 삭제", "레이블 추가", "필터 제거"], answer: 0, explain: "8-이웃은 상하좌우 네 방향에 대각선 네 방향을 더함." },
  ],
  9: [
    { q: "HOG 특징이 주로 다루는 정보는?", choices: ["기울기 방향 히스토그램", "정답 문장", "학습률", "퍼지 보수"], answer: 0, explain: "HOG는 경사 방향의 분포를 히스토그램 형태로 표현." },
    { q: "PCA의 목적에 가까운 것은?", choices: ["차원 축소와 특징 추출", "뉴런 제거", "보상 최대화", "진리표 작성"], answer: 0, explain: "PCA는 큰 변동 성분을 찾아 상관을 줄이는 공간으로 변환." },
    { q: "최근접 이웃 분류에서 클래스 결정 기준은?", choices: ["가장 가까운 학습 샘플", "가장 큰 파일", "가장 마지막 레이블", "가장 높은 학습률"], answer: 0, explain: "특징공간에서 거리측정자로 가장 가까운 훈련 패턴을 선택." },
  ],
  10: [
    { q: "준지도학습에 대한 설명으로 알맞은 것은?", choices: ["레이블 없는 데이터만 사용", "대량의 무레이블과 소량의 레이블 데이터 사용", "보상만 사용", "이미지 필터만 사용"], answer: 1, explain: "준지도학습은 많은 무레이블 데이터와 적은 레이블 데이터를 함께 사용." },
    { q: "자기지도학습의 특징은?", choices: ["스스로 레이블을 자동 생성", "항상 사람이 모든 레이블 입력", "보상 함수만 사용", "절 분리 수행"], answer: 0, explain: "자기지도학습은 레이블 없는 데이터에서 학습 알고리즘이 레이블을 구성." },
    { q: "결정트리 리프 노드가 나타내는 것은?", choices: ["최종 클래스 또는 출력", "입력 픽셀", "학습률", "가중치 초기값만"], answer: 0, explain: "결정트리의 리프는 분류 결과인 클래스에 해당." },
  ],
  11: [
    { q: "선형회귀의 단순 선형가설은?", choices: ["HL(x)=w0+w1x", "μ=1-x", "h_t=Wx_t", "F(x)+x"], answer: 0, explain: "단순 선형회귀는 독립변수 하나에 대해 w0+w1x 형태." },
    { q: "경사하강법에서 η는 무엇인가?", choices: ["학습률", "클래스 수", "픽셀값", "한정기호"], answer: 0, explain: "η는 기울기 방향으로 이동하는 크기를 조절하는 학습률." },
    { q: "로지스틱 회귀의 주된 용도는?", choices: ["분류 확률 예측", "픽셀 연결성 계산", "전칭기호 제거", "합집합 계산"], answer: 0, explain: "로지스틱 회귀는 선형 결합을 확률로 바꾸어 분류에 사용." },
  ],
  12: [
    { q: "뉴런에서 b가 의미하는 것은?", choices: ["바이어스", "픽셀", "분할표", "보상"], answer: 0, explain: "b는 가중합에 더해지는 바이어스 또는 임계치 역할." },
    { q: "피드포워드 연결의 특징은?", choices: ["입력에서 출력 방향으로 신호 전달", "항상 순환 경로 포함", "레이블 자동 생성", "보수 연산"], answer: 0, explain: "피드포워드는 되먹임 없이 입력층에서 출력층 방향으로 전달." },
    { q: "퍼셉트론의 대표 한계는?", choices: ["XOR 같은 선형 분리 불가능 문제", "AND 학습 불가", "OR 학습 불가", "입력이 없어도 학습"], answer: 0, explain: "단층 퍼셉트론은 하나의 선형 결정경계로 분리되지 않는 XOR에 한계." },
  ],
  13: [
    { q: "다층 퍼셉트론에서 은닉층이 필요한 주된 이유는?", choices: ["비선형 결정경계 표현", "픽셀 삭제", "고전집합 연산", "한정기호 제거"], answer: 0, explain: "은닉층은 선형 분리가 어려운 문제를 여러 단계 표현으로 해결." },
    { q: "출력층 오차가 은닉층으로 전달되는 수학적 기반은?", choices: ["체인 룰", "드모르간 법칙", "분할표", "PCA"], answer: 0, explain: "오차역전파는 합성함수 미분의 체인 룰로 기울기를 계산." },
    { q: "SOM의 학습 방식은?", choices: ["비지도 경쟁학습", "도출연역", "강화학습만", "진리표 탐색"], answer: 0, explain: "SOM은 입력 분포를 지도 구조에 배치하는 비지도 경쟁학습." },
  ],
  14: [
    { q: "경사 소멸 문제 개선에 도움이 되는 활성함수는?", choices: ["ReLU", "항진식", "유클리드 거리", "전칭기호"], answer: 0, explain: "ReLU 계열은 포화 영역 문제를 줄여 깊은 신경망 학습을 돕는다." },
    { q: "가중치 감쇠, L1/L2 규제, 드롭아웃의 공통 목적은?", choices: ["과적합 완화", "임계값 이진화", "절 분리", "색 좌표 변환"], answer: 0, explain: "규제 기법은 모델 복잡도와 데이터 의존을 줄여 과적합을 완화." },
    { q: "stride가 커지면 일반적으로 합성곱 출력 위치 수는?", choices: ["줄어듦", "항상 증가", "변하지 않음", "항상 1"], answer: 0, explain: "필터 이동 간격이 커지면 적용 위치가 줄어 출력 크기도 줄어드는 경향." },
  ],
  15: [
    { q: "ResNet의 핵심 수식은?", choices: ["H(x)=F(x)+x", "μ=1-x", "p→q=~p∧q", "MSE=max"], answer: 0, explain: "잔차 블록은 층의 출력 F(x)에 입력 x를 더하는 스킵 연결을 사용." },
    { q: "BPTT에서 경사는 어떤 방향으로 전달되는가?", choices: ["시간 단계의 역순", "항상 무작위", "입력 전처리 순서", "RGB 채널 순서"], answer: 0, explain: "BPTT는 펼친 RNN에서 시간 단계의 역순으로 오차를 전파." },
    { q: "Transformer가 순서 정보를 보완하기 위해 추가하는 것은?", choices: ["positional encoding", "퍼지 보수", "분할표", "평균제곱오차"], answer: 0, explain: "self-attention 자체는 순서를 직접 담지 않으므로 위치 정보를 추가." },
  ],
};

function LectureEnhancementLab({ lectureId }: { lectureId: number }) {
  const data = lectureEnhancements[lectureId];
  const [drillAnswers, setDrillAnswers] = useState<Record<number, number>>({});

  if (!data) return null;

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-violet-200 bg-white p-6 shadow-sm dark:border-violet-900 dark:bg-gray-900">
        <SectionTitle
          title="핵심 개념 정리"
          subtitle="정의, 공식, 절차, 예외를 문제 풀이 전에 확인"
        />
        <div className="grid gap-2 md:grid-cols-2">
          {data.coverage.map((item) => (
            <div key={item} className="flex items-start gap-2 rounded-lg bg-violet-50 p-3 text-sm leading-5 dark:bg-violet-950/40">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-violet-500" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <AIVisualizationLab lectureId={lectureId} />

      <section className="rounded-lg border border-rose-200 bg-white p-6 shadow-sm dark:border-rose-900 dark:bg-gray-900">
        <SectionTitle
          title="판별 연습"
          subtitle="객관식 문제 전에 정답 기준과 오답 기준을 먼저 적용"
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {data.drills.map((drill, drillIndex) => {
            const selected = drillAnswers[drillIndex];
            return (
              <div key={drill.title} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
                <div className="mb-2 text-sm font-bold text-rose-700 dark:text-rose-300">{drill.title}</div>
                <p className="mb-3 text-sm leading-6">{drill.prompt}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {drill.choices.map((choice, choiceIndex) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => setDrillAnswers((prev) => ({ ...prev, [drillIndex]: choiceIndex }))}
                      className={`rounded-md border px-3 py-2 text-left text-xs transition ${
                        selected === choiceIndex
                          ? choiceIndex === drill.answer
                            ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950"
                            : "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950"
                          : "border-gray-200 bg-white hover:border-rose-300 dark:border-gray-800 dark:bg-gray-900"
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
                {selected !== undefined && (
                  <div className="mt-3 rounded-md bg-white p-3 text-xs leading-5 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                    <div className="font-bold">{selected === drill.answer ? "정답입니다." : "오답입니다."}</div>
                    <div className="mt-1">
                      <span className="font-bold text-rose-700 dark:text-rose-300">근거: </span>
                      {sourceEvidence(drill.explain)}
                    </div>
                    <div className="mt-1">
                      <span className="font-bold text-rose-700 dark:text-rose-300">오답 기준: </span>
                      정답 선택지 &quot;{drill.choices[drill.answer]}&quot;이 충족하는 정의·공식·절차의 핵심 조건과 맞지 않으면 제외.
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export function AIExamLecture({ lectureId }: { lectureId: number }) {
  if (lectureId === 6) return <AI6DeepDive />;
  if (lectureId >= 7 && lectureId <= 15) return <AIAdvancedLecture lectureId={lectureId} />;

  const review = lectureReviews[lectureId];
  const [topicIndex, setTopicIndex] = useState(0);
  const [flowIndex, setFlowIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const topic = review.topics[topicIndex];
  const quizItems = useMemo(
    () => [...review.quiz, ...(extraQuizQuestions[lectureId] ?? [])],
    [lectureId, review.quiz],
  );
  const selectedCount = useMemo(
    () => Object.keys(answers).filter((key) => Number(key) >= 0).length,
    [answers],
  );

  if (!review) return null;

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-indigo-200 bg-white p-6 shadow-sm dark:border-indigo-900 dark:bg-gray-900">
        <SectionTitle
          title="시험 대비 핵심 개념 맵"
          subtitle={`${review.source}의 핵심 정의와 판단 기준을 정리`}
        />
        <div className="grid gap-3 md:grid-cols-3">
          {review.topics.map((item, index) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setTopicIndex(index)}
              className={`rounded-lg border p-4 text-left transition ${
                topicIndex === index
                  ? "border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950/60"
                  : "border-gray-200 bg-gray-50 hover:border-indigo-300 dark:border-gray-800 dark:bg-gray-950"
              }`}
            >
              <div className="mb-2 flex items-center gap-2 text-sm font-bold">
                <BrainCircuit size={16} className="text-indigo-500" />
                {item.name}
              </div>
              <p className="text-xs leading-5 text-gray-500">{item.exam}</p>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={topic.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950"
          >
            <h3 className="text-lg font-bold">{topic.name}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">{topic.definition}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-md bg-white p-3 text-sm dark:bg-gray-900">
                <div className="mb-1 text-xs font-bold text-indigo-500">시험 포인트</div>
                {topic.exam}
              </div>
              <div className="rounded-md bg-white p-3 text-sm dark:bg-gray-900">
                <div className="mb-1 text-xs font-bold text-emerald-500">예시</div>
                {topic.example}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      <section className="rounded-lg border border-cyan-200 bg-white p-6 shadow-sm dark:border-cyan-900 dark:bg-gray-900">
        <SectionTitle title="단계별 처리 흐름" subtitle="시험 서술형·계산형 답안을 쓰는 순서로 확인" />
        <div className="mb-4 flex flex-wrap gap-2">
          {review.flow.map((step, index) => (
            <button
              key={step}
              type="button"
              onClick={() => setFlowIndex(index)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                flowIndex === index
                  ? "border-cyan-400 bg-cyan-500 text-white"
                  : "border-gray-200 text-gray-500 hover:border-cyan-300 dark:border-gray-800"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="rounded-lg bg-cyan-50 p-5 dark:bg-cyan-950/40">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-cyan-700 dark:text-cyan-300">
            <Play size={15} />
            {flowIndex + 1}단계
          </div>
          <p className="text-base font-semibold">{review.flow[flowIndex]}</p>
        </div>
      </section>

      <LectureEnhancementLab lectureId={lectureId} />

      <section className="rounded-lg border border-orange-200 bg-white p-6 shadow-sm dark:border-orange-900 dark:bg-gray-900">
        <SectionTitle title="마무리 점검" subtitle="개념·계산·비교 문제로 바로 연결되는 체크포인트" />
        <div className="grid gap-3 md:grid-cols-3">
          {review.checkpoints.map((item) => (
            <label
              key={item}
              className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm leading-5 dark:border-gray-800 dark:bg-gray-950"
            >
              <input type="checkbox" className="mt-1 h-4 w-4 accent-orange-500" />
              {item}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5 flex items-center justify-between gap-4">
          <SectionTitle title="퀴즈" subtitle="선택 후 해설로 검산" />
          <div className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {selectedCount}/{quizItems.length}
          </div>
        </div>
        <div className="space-y-4">
          {quizItems.map((quiz, quizIndex) => {
            const selected = answers[quizIndex];
            return (
              <div key={quiz.q} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                <div className="mb-3 flex items-start gap-2 text-sm font-bold">
                  <Target size={16} className="mt-0.5 shrink-0 text-indigo-500" />
                  {quiz.q}
                </div>
                <div className="grid gap-2 md:grid-cols-3">
                  {quiz.choices.map((choice, choiceIndex) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [quizIndex]: choiceIndex }))}
                      className={`rounded-md border px-3 py-2 text-left text-xs transition ${
                        selected === choiceIndex
                          ? choiceIndex === quiz.answer
                            ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950"
                            : "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950"
                          : "border-gray-200 hover:border-indigo-300 dark:border-gray-800"
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
                {selected !== undefined && (
                  <div className="mt-3 flex items-start gap-2 rounded-md bg-gray-50 p-3 text-xs leading-5 text-gray-600 dark:bg-gray-950 dark:text-gray-300">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                    <div>
                      <div className="font-bold">
                        {selected === quiz.answer ? "정답입니다." : "오답입니다."}
                        <span className="ml-2">
                          정답: {quiz.choices[quiz.answer]}
                        </span>
                      </div>
                      <div className="mt-1">
                        <span className="font-bold text-indigo-700 dark:text-indigo-300">근거: </span>
                        {sourceEvidence(quiz.explain)}
                      </div>
                      <div className="mt-1">
                        <span className="font-bold text-indigo-700 dark:text-indigo-300">오답 기준: </span>
                        정답 선택지 &quot;{quiz.choices[quiz.answer]}&quot;이 충족하는 강의의 정의, 공식, 절차, 예외 조건과 맞지 않는 선택지는 제외.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
