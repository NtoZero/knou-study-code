"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import type { SourceRef } from "@/lib/mlSources";

type QuizChoice = {
  text: string;
  isCorrect: boolean;
  explanation: { basis: string; reason: string };
};

type Quiz = {
  q: string;
  intro?: string;
  choices: QuizChoice[];
  answer: number;
  basis: string;
  examSkill: string;
  source: "공식 연습문제" | "변형";
  refs: SourceRef;
};

const QUIZZES: Quiz[] = [
  /* ─────────── 공식 연습문제 ─────────── */
  {
    q: "자연어처리에서 데이터 표현 방법과 거리가 먼 것은? (단어 하나를 하나의 토큰으로 간주)",
    answer: 0,
    source: "공식 연습문제",
    refs: {
      textbook: "13.2.2 자연어처리를 위한 머신러닝 기법 — (2) 전처리 · (3) 데이터 표현",
      slides: "NLP 응용을 위한 ML 시스템의 개발단계",
    },
    basis:
      "개발 단계는 데이터 수집 → 전처리(토큰화, 정제, 정규화, 품사 태깅) → 데이터 표현(원핫인코딩, BoW, TF-IDF) → 데이터 분석(워드 임베딩, 언어 모델)이다. tokenization은 전처리 단계의 작업이다.",
    examSkill: "개발 단계별 작업의 구분",
    choices: [
      {
        text: "tokenization",
        isCorrect: true,
        explanation: {
          basis: "토큰화 — 말뭉치를 의미 있는 기본 단위(“토큰”)로 나누는 작업",
          reason:
            "토큰화는 전처리 단계다. 문장을 토큰으로 쪼갤 뿐 숫자 벡터를 만들지 않는다. 데이터 표현은 이렇게 나눈 토큰을 머신러닝 시스템이 다룰 수 있는 숫자로 바꾸는 다음 단계다.",
        },
      },
      {
        text: "word embedding",
        isCorrect: false,
        explanation: {
          basis: "워드 임베딩 — 단어의 의미를 포함하는 벡터(“임베딩 벡터”)로 표현하는 방법",
          reason:
            "단어를 벡터로 표현하므로 표현 방법이 맞다. 개발 단계 그림에서는 학습이 필요한 데이터 분석 단계에 놓이지만, 공식 해설은 원핫·BoW와 함께 데이터 표현 방법으로 묶는다.",
        },
      },
      {
        text: "BoW",
        isCorrect: false,
        explanation: {
          basis: "BoW — 단어의 출현 빈도수를 고려한 텍스트 표현 방법",
          reason:
            "문장을 단어집합 크기의 벡터로 나타내고 각 위치에 출현 횟수를 적는다. 데이터 표현 단계의 대표 방법이다.",
        },
      },
      {
        text: "one-hot encoding",
        isCorrect: false,
        explanation: {
          basis: "원핫인코딩 — 단어집합의 각 단어를 고유 정수로 매핑한 후 원핫벡터로 표현",
          reason:
            "m개의 단어가 있으면 m차원 원핫벡터로 표현한다. 데이터 표현 단계의 가장 기본적인 방법이다.",
        },
      },
    ],
  },
  {
    q: "자연어처리 데이터 표현 방법에 대한 적절한 설명은?",
    answer: 0,
    source: "공식 연습문제",
    refs: {
      textbook: "13.2.2 자연어처리를 위한 머신러닝 기법 — (3) 데이터 표현 · (4) 데이터 분석",
      slides: "데이터표현 · 데이터분석 — 워드 임베딩 · Word2Vec",
      lecture: "실제로도 데이터를 일단 원핫 벡터로 표현한 뒤 임베딩 같은 추가 작업을 거치므로 원핫이 가장 기본이라고 강조",
    },
    basis:
      "워드 임베딩은 원핫벡터를 저차원 실수 공간의 벡터로 변환한다. Word2Vec은 원핫벡터를 저차원 벡터로 바꾸는 선형변환행렬 W를 학습으로 찾고, 입력 단어를 사영해 임베딩 벡터를 구한다. 출발점이 원핫벡터다.",
    examSkill: "표현 방법별 특성 판별",
    choices: [
      {
        text: "워드 임베딩은 기본적으로 원핫벡터를 기반으로 한다.",
        isCorrect: true,
        explanation: {
          basis: "워드 임베딩 — 원핫벡터를 저차원 실수 공간의 벡터로 변환",
          reason:
            "Word2Vec의 입력층은 원핫 벡터이고, 원핫 벡터에 W를 곱하면 W의 한 행이 골라져 임베딩 벡터가 된다. 임베딩은 원핫벡터를 바탕으로 만들어진다.",
        },
      },
      {
        text: "BoW는 단어의 의미까지 포함한다.",
        isCorrect: false,
        explanation: {
          basis: "BoW — 단어의 출현 빈도수를 고려한 텍스트 표현 방법",
          reason:
            "BoW의 각 원소는 출현 횟수일 뿐이다. 교재는 빈도수 기반 표현들이 단어 간의 의미 관계나 문맥 정보를 표현할 수 없다고 적는다. 의미를 담는 것은 워드 임베딩이다.",
        },
      },
      {
        text: "원핫인코딩은 자주 출현한 단어를 더 잘 표현한다.",
        isCorrect: false,
        explanation: {
          basis: "원핫벡터 — 해당 단어의 인덱스 원소만 1, 나머지는 0",
          reason:
            "원핫 벡터는 단어가 몇 번 나왔든 1과 0으로만 이루어져 빈도를 담지 못한다. ‘문서에 자주 출현하는 단어가 잘 표현됨’은 BoW의 특성이다.",
        },
      },
      {
        text: "TF-IDF는 특정 문서에 국한된 단어를 작은 값으로 표현한다.",
        isCorrect: false,
        explanation: {
          basis: "TF-IDF — 특정 문서에 국한된 단어는 큰 값, 일반적인 공용 단어는 낮은 값",
          reason:
            "방향이 거꾸로다. IDF가 log(N/DF(t))이므로 등장하는 문서 수 DF가 작을수록 값이 커진다. 예제에서 문서2에만 나오는 ‘토마토’는 0.602로, 두 문서에 나오는 ‘먹고’(0.301)보다 크다.",
        },
      },
    ],
  },
  {
    q: "워드 임베딩에 대한 설명으로 적절한 것은?",
    answer: 0,
    source: "공식 연습문제",
    refs: {
      textbook: "13.2.2 자연어처리를 위한 머신러닝 기법 — (4) 데이터 분석",
      slides: "데이터분석 — 워드 임베딩",
      lecture: "원핫은 0과 1, 임베딩은 실수값이라는 차이를 꼭 기억하라고 당부하고, 임베딩 차원은 보통 300 정도라고 보충",
    },
    basis:
      "워드 임베딩의 목적은 유사한 의미의 단어를 벡터 공간에서 가까운 위치에 표현하는 것, 곧 단어 간의 의미적 유사성을 벡터화하는 것이다. 대표 방법은 Word2Vec(CBOW, Skip-gram), LSA, GloVe 등이다.",
    examSkill: "워드 임베딩의 정의·목적·방법",
    choices: [
      {
        text: "유사한 의미의 단어를 벡터 공간에서 가깝게 표현한다.",
        isCorrect: true,
        explanation: {
          basis: "목적 → 유사한 의미의 단어를 벡터 공간에서 가까운 위치에 표현",
          reason:
            "임베딩 벡터는 의미·문맥의 유사성을 벡터 사이의 거리로 나타낸다. 그림 13-23처럼 단어 간의 의미 정보가 좌표 평면상의 벡터 관계로 표현된다.",
        },
      },
      {
        text: "대표적인 방법으로 BERT가 있다.",
        isCorrect: false,
        explanation: {
          basis: "방법 → Word2Vec(CBOW, Skip-gram), LSA(잠재의미분석), GloVe 등",
          reason:
            "BERT는 Transformer의 인코더에 기반한 언어 모델로, 사전 학습과 미세조정 전략을 쓴다. 워드 임베딩의 대표 방법 목록에는 들어 있지 않다.",
        },
      },
      {
        text: "원핫벡터를 밀집 고차원 벡터로 변환한다.",
        isCorrect: false,
        explanation: {
          basis: "원핫벡터: 고차원·희소 / 임베딩 벡터: 저차원·밀집",
          reason:
            "‘밀집’은 맞지만 ‘고차원’이 틀렸다. 고차원(=단어집합의 크기)인 것은 원핫벡터이고, 임베딩은 이를 저차원 실수 공간의 벡터로 바꾼다.",
        },
      },
      {
        text: "임베딩 벡터의 각 요소는 이진값이다.",
        isCorrect: false,
        explanation: {
          basis: "값 — 원핫벡터: 0과 1로 구성 / 임베딩 벡터: 실수값",
          reason:
            "0과 1만 갖는 것은 원핫벡터다. 임베딩 벡터는 연속한 실수값을 가지므로 딥러닝 모델의 입력으로 더 적합하다.",
        },
      },
    ],
  },
  {
    q: "자연어처리를 위한 언어 모델과 거리가 먼 것은?",
    answer: 0,
    source: "공식 연습문제",
    refs: {
      textbook: "13.2.2 (4) 데이터 분석 · 13.2.3 언어 모델을 위한 딥러닝",
      slides: "Word2Vec · 언어모델 · Seq2Seq 모델 · Attention 모델 · Transformer 모델",
      lecture: "Word2Vec은 가장 대표적인 워드 임베딩 방법, Seq2Seq·Attention·Transformer·BERT·GPT는 대표적인 언어 모델이라고 갈라 정리",
    },
    basis:
      "언어 모델은 단어 시퀀스를 입력으로 받아 확률값을 출력하는 함수이고, 딥러닝으로는 RNN 기반 언어 모델, Seq2Seq, Attention, Transformer, BERT가 있다. Word2Vec은 대표적인 워드 임베딩 방법이다.",
    examSkill: "워드 임베딩과 언어 모델의 구분",
    choices: [
      {
        text: "Word2Vec",
        isCorrect: true,
        explanation: {
          basis: "Word2Vec — 원핫벡터를 저차원 벡터로 변환하는 선형변환행렬 W를 학습",
          reason:
            "Word2Vec이 만드는 것은 단어 하나하나의 임베딩 벡터다. 단어 시퀀스 전체가 자연어로서 얼마나 적절한지를 확률로 내는 언어 모델과는 하는 일이 다르다. 개발 단계에서도 워드 임베딩과 언어 모델은 따로 적힌다.",
        },
      },
      {
        text: "Transformer",
        isCorrect: false,
        explanation: {
          basis: "Transformer — RNN 구조를 없애고 여러 개의 인코더와 Attention만으로 구현",
          reason:
            "언어 모델을 위한 딥러닝 모델이다. 교재는 이후에 개발되는 대규모 언어 모델이 트랜스포머 모델에 기반을 둔다고 적는다.",
        },
      },
      {
        text: "Attention",
        isCorrect: false,
        explanation: {
          basis: "Attention 모델 — 디코더에서 출력 단어를 생성할 때마다 인코더의 각 셀의 정보를 읽어 옴",
          reason:
            "Seq2Seq의 문제를 보완한 언어 모델이다. ‘언어 모델을 위한 딥러닝’ 단원에 속한다.",
        },
      },
      {
        text: "Seq2Seq",
        isCorrect: false,
        explanation: {
          basis: "Seq2Seq — 인코더와 디코더로 입력 시퀀스를 다른 시퀀스로 출력",
          reason:
            "RNN 언어 모델 구조를 확장한 모델로, 문장을 받아 문장을 출력한다. 언어 모델을 위한 딥러닝 모델이다.",
        },
      },
    ],
  },
  {
    q: "Seq2Seq 모델에 대한 설명으로 적절하지 못한 것은?",
    answer: 0,
    source: "공식 연습문제",
    refs: {
      textbook: "13.2.3 언어 모델을 위한 딥러닝 — (2) Seq2Seq 모델 · (3) Attention 모델",
      slides: "Seq2Seq 모델 · Attention 모델",
      lecture: "하나의 고정된 벡터로 압축하며 정보 손실이 생기고 입력 문장이 길수록 더 심해져, 이를 해결하려고 Attention이 등장했다고 순서대로 설명",
    },
    basis:
      "Seq2Seq은 입력 문장을 하나의 고정된 문맥 벡터로 요약·압축하므로 정보 손실이 생기고, 입력 문장이 길면 성능이 떨어진다. 이 문제를 해결하기 위해 Attention이 개발되었다. 해결한 쪽과 해결된 쪽이 거꾸로 적혀 있다.",
    examSkill: "모델 간 선후 관계",
    choices: [
      {
        text: "Attention 모델의 문제점을 해결하였다.",
        isCorrect: true,
        explanation: {
          basis: "Attention 모델 — Seq2Seq 모델의 문제를 Attention 모듈을 이용해 해결",
          reason:
            "선후가 뒤집혔다. 문맥 벡터 병목이라는 Seq2Seq의 문제를 Attention이 보완했다. Seq2Seq이 Attention의 문제를 해결한 것이 아니다.",
        },
      },
      {
        text: "시퀀스를 입력받아 축약과 복원을 거쳐 다른 시퀀스로 출력한다.",
        isCorrect: false,
        explanation: {
          basis: "인코더 출력 → 입력 시퀀스를 하나의 벡터로 압축한 문맥 벡터 / 디코더 → 단어 벡터를 순차적으로 출력",
          reason:
            "인코더가 입력을 문맥 벡터로 축약하고, 디코더가 그것을 다른 시퀀스로 풀어낸다. 적절한 설명이다.",
        },
      },
      {
        text: "인코더와 디코더로 구성된다.",
        isCorrect: false,
        explanation: {
          basis: "구성 → 인코더와 디코더",
          reason: "그림 13-25의 encoder와 decoder 두 모듈 그대로다. 적절한 설명이다.",
        },
      },
      {
        text: "LSTM 기반 RNN 구조를 갖는다.",
        isCorrect: false,
        explanation: {
          basis: "인코더와 디코더 → 각각 RNN(LSTM) 구조를 가짐",
          reason:
            "인코더와 디코더 모두 LSTM 셀을 사용하는 RNN으로, RNN 언어 모델과 같은 구조다. 적절한 설명이다.",
        },
      },
    ],
  },

  /* ─────────── 변형 ─────────── */
  {
    q: "음성 신호처리 응용에 대한 설명으로 적절한 것은?",
    answer: 2,
    source: "변형",
    refs: {
      textbook: "13.2.1 자연어처리 응용 — (1) 음성 신호처리",
      slides: "음성신호처리",
      lecture: "음성인식은 텍스트로 바꾸는 데까지, 화자인식은 신호 패턴의 고유 특징으로 발화자의 신원 확인이라고 구분",
    },
    basis:
      "음성인식과 화자인식은 같은 음성 신호를 입력받는 분류 문제이고, 입력에 대해 레이블링된 클래스 레이블의 종류가 다르다. 음성인식은 텍스트를, 화자인식은 발화자의 신원을 낸다. 음성합성은 반대로 텍스트를 받아 음성 신호를 만든다.",
    examSkill: "응용별 입력·출력 판별",
    choices: [
      {
        text: "음성인식은 발화자의 신호 패턴이 가지는 고유 정보로 발화자의 신원을 인식한다.",
        isCorrect: false,
        explanation: {
          basis: "음성인식 → speech-to-text 변환 / 화자인식 → 발화자의 신원",
          reason:
            "설명은 화자인식의 것이다. 음성인식은 발화자에 의한 변형이나 주변 소음에 상관없이 정확한 음절을 추출해 텍스트로 바꾸는 것이 목적이다.",
        },
      },
      {
        text: "음성합성은 음성 신호를 입력받아 텍스트로 변환하는 문제다.",
        isCorrect: false,
        explanation: {
          basis: "음성합성 → TTS(Text To Speech)",
          reason:
            "방향이 반대다. 음성합성은 텍스트 신호를 받아 음성 신호를 합성한다. 음성 신호를 텍스트로 바꾸는 것은 음성인식(speech-to-text)이다.",
        },
      },
      {
        text: "음성인식과 화자인식은 같은 음성 신호를 입력받지만 클래스 레이블의 종류가 다르다.",
        isCorrect: true,
        explanation: {
          basis: "두 경우 모두 음성 신호를 입력으로 하는 분류 문제이며, 레이블링된 클래스 레이블의 종류가 다름",
          reason:
            "입력은 같고 무엇으로 분류하느냐가 다르다. 음성인식은 음절·텍스트로, 화자인식은 발화자로 나눈다.",
        },
      },
      {
        text: "음성 신호처리는 텍스트화된 언어의 의미 정보에 초점을 맞춘다.",
        isCorrect: false,
        explanation: {
          basis: "음성 신호처리 연구 → 음성 신호의 고유 특성 분석, 잡음 제거 등 신호처리 기술에 초점",
          reason:
            "교재는 음성 신호처리가 텍스트의 의미 정보에 초점을 맞춘 다른 문제들과 거리가 있어, 좁은 의미의 자연어처리에서는 제외하기도 한다고 적는다.",
        },
      },
    ],
  },
  {
    q: "TF-IDF(d, t) = TF(d, t) × log(N / DF(t))로 계산할 때, 문서3 ‘크고 무거운 수박 수박’에서 단어 ‘수박’의 TF-IDF는? (N = 4, 상용로그)",
    intro:
      "말뭉치 — 문서1: 먹고 싶은 수박 / 문서2: 먹고 싶은 토마토 / 문서3: 크고 무거운 수박 수박 / 문서4: 과일 가격이 비싸다. log₁₀2 = 0.301, log₁₀4 = 0.602로 둔다.",
    answer: 1,
    source: "변형",
    refs: {
      textbook: "13.2.2 (3) 데이터 표현 — TF-IDF (식 13-1)",
      slides: "데이터표현 — TF-IDF",
    },
    basis:
      "TF(문서3, 수박) = 2, DF(수박) = 2(문서1과 문서3), N = 4. TF-IDF = 2 × log₁₀(4/2) = 2 × 0.301 = 0.602. 강의록 표의 값과 같다.",
    examSkill: "TF·DF·IDF를 나눠 계산",
    choices: [
      {
        text: "0.301",
        isCorrect: false,
        explanation: {
          basis: "TF(문서3, 수박) = 2",
          reason:
            "IDF 값 log₁₀2 = 0.301만 쓰고 TF를 1로 둔 값이다. 문서3에는 수박이 두 번 나오므로 2를 곱해야 한다. 0.301은 수박이 한 번 나오는 문서1의 값이다.",
        },
      },
      {
        text: "0.602",
        isCorrect: true,
        explanation: {
          basis: "TF-IDF = TF × log(N/DF) = 2 × log₁₀(4/2)",
          reason:
            "TF = 2, N/DF = 4/2 = 2, log₁₀2 = 0.301. 2 × 0.301 = 0.602. 교재 그림 13-21은 이 칸을 0.250으로 인쇄했지만, 같은 그림의 DF(수박) = 2와 식 13-1로 계산하면 0.602이고 강의록 표도 0.602다.",
        },
      },
      {
        text: "1.204",
        isCorrect: false,
        explanation: {
          basis: "DF(수박) = 2 — 수박은 문서1과 문서3에 나타남",
          reason:
            "DF를 1로 보고 2 × log₁₀4 = 2 × 0.602로 계산한 값이다. 수박은 문서1에도 나오므로 DF는 2다.",
        },
      },
      {
        text: "2",
        isCorrect: false,
        explanation: {
          basis: "TF-IDF = TF × IDF",
          reason:
            "TF만 적은 값이다. 문서-단어 행렬(Document-Term Matrix)의 값이지 TF-IDF가 아니다. 여러 문서에 나오는 정도를 IDF로 곱해 줄여야 한다.",
        },
      },
    ],
  },
  {
    q: "“The bird with black feathers is on the tree.”에서 윈도우 n = 2, 중심 단어가 ‘black’일 때 Skip-gram 모델의 학습 입·출력으로 옳은 것은?",
    answer: 3,
    source: "변형",
    refs: {
      textbook: "13.2.2 (4) 데이터 분석 — 그림 13-22 Word2Vec을 이용한 워드 임베딩",
      slides: "Word2Vec",
    },
    basis:
      "윈도우로 선택된 5개 단어 중 세 번째 단어 black이 중심 단어, 전후 2개씩 bird, with, feathers, is가 문맥 단어다. Skip-gram은 중심 단어를 입력으로 받아 주변 단어들을 예측한다.",
    examSkill: "CBoW와 Skip-gram의 입출력 구분",
    choices: [
      {
        text: "입력: bird, with, feathers, is → 출력: black",
        isCorrect: false,
        explanation: {
          basis: "CBoW → 주변 단어(문맥 앞뒤의 n개 단어)를 입력으로 받아 중심 단어를 예측",
          reason: "CBoW 모델의 입·출력이다. Skip-gram은 이 방향을 뒤집는다.",
        },
      },
      {
        text: "입력: black → 출력: feathers",
        isCorrect: false,
        explanation: {
          basis: "n = 2 → 문맥 단어는 앞뒤로 2개씩, 모두 4개",
          reason:
            "방향은 맞지만 출력이 하나뿐이다. n = 2이면 bird, with, feathers, is 네 단어를 모두 예측해야 한다. feathers 하나만 남은 것은 n = 1의 뒤쪽 절반이다.",
        },
      },
      {
        text: "입력: The, bird → 출력: with",
        isCorrect: false,
        explanation: {
          basis: "RNN 언어 모델 → 한 번에 한 단어씩 입력받아 바로 다음 단어를 출력",
          reason:
            "앞 단어들로 다음 단어를 맞히는 것은 언어 모델의 학습 방식이다. Word2Vec은 중심 단어의 앞과 뒤 문맥을 함께 쓴다.",
        },
      },
      {
        text: "입력: black → 출력: bird, with, feathers, is",
        isCorrect: true,
        explanation: {
          basis: "Skip-gram → 중심 단어를 입력으로 받아 주변 단어들을 예측",
          reason:
            "그림 13-22의 오른쪽 Skip-gram 모델 그대로다. black의 원핫 벡터 하나가 W로 사영된 뒤 W′를 거쳐 네 문맥 단어를 출력한다.",
        },
      },
    ],
  },
  {
    q: "그림 13-24의 RNN 언어 모델에서 “The bird with black feathers …”를 학습할 때, 첫 번째 LSTM 셀의 목표 출력은?",
    answer: 1,
    source: "변형",
    refs: {
      textbook: "13.2.3 언어 모델을 위한 딥러닝 — (1) 언어 모델을 위한 RNN 구조",
      slides: "RNN 기반 언어모델",
      lecture: "the 다음 bird, 그다음 with … 처럼 한 번에 한 단어씩 다음 단어를 출력하도록 학습시키는 것이 언어 모델의 기본 형태라고 강조",
    },
    basis:
      "각 LSTM 셀은 한 번에 한 단어씩 입력받고 바로 다음 단어를 출력하도록 학습한다. 첫 번째 셀의 입력은 The이고 목표 출력은 두 번째 단어인 bird다. 목표 출력은 이어지는 단어 시퀀스에서 쉽게 얻을 수 있다.",
    examSkill: "RNN 언어 모델의 목표 출력",
    choices: [
      {
        text: "The",
        isCorrect: false,
        explanation: {
          basis: "첫 번째 LSTM 셀의 입력 → The",
          reason:
            "The는 첫 번째 셀의 입력이다. 입력을 그대로 내놓는 것은 오토인코더의 목표이지 언어 모델의 목표가 아니다.",
        },
      },
      {
        text: "bird",
        isCorrect: true,
        explanation: {
          basis: "첫 번째 LSTM 셀의 목표 출력은 두 번째 단어인 ‘bird’",
          reason:
            "바로 다음 단어를 맞히도록 학습하므로 The 다음 단어인 bird가 목표다. 그래서 별도의 레이블 없이 문장만으로 목표 출력을 얻는다.",
        },
      },
      {
        text: "feathers",
        isCorrect: false,
        explanation: {
          basis: "그림 13-24 — 네 번째 셀(입력 black)의 출력이 feathers",
          reason:
            "그림에 그려진 feathers는 black을 입력받은 네 번째 셀의 출력이다. 첫 번째 셀이 아니다.",
        },
      },
      {
        text: "문장 전체에 대한 긍정/부정 레이블",
        isCorrect: false,
        explanation: {
          basis: "감성 분류 → 리뷰 문장을 입력으로 주고 분류 결과를 최종 목표 출력으로",
          reason:
            "RNN 언어 모델 구조를 텍스트 분류에 활용할 때의 목표 출력이다. 이때도 레이블은 마지막에 한 번 나오며, 첫 셀의 목표가 아니다.",
        },
      },
    ],
  },
  {
    q: "Transformer 모델에 대한 설명으로 적절하지 못한 것은?",
    answer: 2,
    source: "변형",
    refs: {
      slides: "Transformer 모델",
    },
    basis:
      "Transformer는 Seq2Seq의 인코더-디코더 구조를 쓰되 RNN 구조를 없애고 여러 개의 인코더와 Attention만으로 구현했다. 인코더는 한 번에 전체 시퀀스를 입력받고, 디코더는 한 번에 하나씩 순차적으로 생성한다.",
    examSkill: "인코더와 디코더의 처리 방식 구분",
    choices: [
      {
        text: "RNN 구조를 없애고 여러 개의 인코더와 Attention만으로 구현하였다.",
        isCorrect: false,
        explanation: {
          basis: "2017, “Attention is all you need”",
          reason:
            "강의록 문장 그대로다. 교재도 복잡한 RNN 구조를 없애면서 잘 설계된 주의집중 모델만 활용했다고 적는다.",
        },
      },
      {
        text: "단어의 순서 정보를 나타내기 위해 positional encoding을 사용한다.",
        isCorrect: false,
        explanation: {
          basis: "인코더 → 한 번에 전체 시퀀스를 입력 받음 → 순서 정보를 위해 positional encoding 사용",
          reason:
            "RNN처럼 한 단어씩 차례로 넣지 않으므로 순서를 따로 알려 주어야 한다. 적절한 설명이다.",
        },
      },
      {
        text: "디코더도 인코더처럼 한 번에 전체 출력 시퀀스를 생성한다.",
        isCorrect: true,
        explanation: {
          basis: "디코더 → 한 번에 하나씩 순차적으로 생성",
          reason:
            "‘한 번에 전체’는 인코더가 입력을 받는 방식이다. 디코더는 Seq2Seq처럼 출력 단어를 하나씩 순차적으로 만든다.",
        },
      },
      {
        text: "Seq2Seq 모델의 인코더-디코더 구조를 사용한다.",
        isCorrect: false,
        explanation: {
          basis: "Seq2Seq 모델의 인코더-디코더 구조 사용 — 인코더 #1~#6, 디코더 #1~#6",
          reason: "구조의 틀은 Seq2Seq에서 가져왔고, 안을 채운 것이 RNN에서 Attention으로 바뀌었다.",
        },
      },
    ],
  },
  {
    q: "BERT에 대한 설명으로 적절하지 못한 것은?",
    answer: 3,
    source: "변형",
    refs: {
      textbook: "13.2.4 최신 언어 모델과 활용",
      slides: "BERT · BERT: NLP 문제유형에 따른 BERT 모델의 4가지 구성방식",
      lecture: "BERT는 2018년 구글이 만든, 트랜스포머의 인코더 부분에 기반한 모델이라고 소개",
    },
    basis:
      "BERT(Bidirectional Encoder Representation from Transformers)는 구글이 만든, Transformer의 인코더 모델에 기반한 언어 모델이다. 사전 학습 후 미세조정하는 전략을 쓰며, 문제 유형에 따라 4가지 구성 방식을 갖는다.",
    examSkill: "BERT의 기반 구조와 학습 전략",
    choices: [
      {
        text: "방대한 데이터로 사전 학습한 모델을 특정 NLP 문제에 맞춰 미세조정한다.",
        isCorrect: false,
        explanation: {
          basis: "사전 학습 → 책 말뭉치(800M 단어)와 Wikipedia(2500M) / 미세조정 → 특정 NLP 문제에 맞춰 추가 학습",
          reason:
            "BERT는 발표 당시부터 사전학습과 미세조정 전략을 쓰도록 제안했다. 적절한 설명이다.",
        },
      },
      {
        text: "품사 태깅처럼 문장의 각 단어에 대응되는 출력을 내는 구성 방식이 있다.",
        isCorrect: false,
        explanation: {
          basis: "(d) Single Sentence Tagging — 품사 태깅",
          reason:
            "그림 13-28 (d)는 하나의 문장을 입력받아 각 단어에 대응되는 출력을 얻는 구조다. 적절한 설명이다.",
        },
      },
      {
        text: "12개의 자연어처리 문제에 대해 당시 최고 성능을 기록하였다.",
        isCorrect: false,
        explanation: {
          basis: "12개의 자연어처리 문제에 대해 당시 최고 성능을 기록",
          reason: "강의록과 교재가 함께 적는 내용이다. 적절한 설명이다.",
        },
      },
      {
        text: "Transformer의 디코더 모델에 기반한 LSTM 구조의 모델이다.",
        isCorrect: true,
        explanation: {
          basis: "BERT → Transformer의 인코더 모델에 기반 / RNN을 사용하지 않는 트랜스포머 기반",
          reason:
            "두 군데가 틀렸다. BERT의 E는 Encoder로, 디코더가 아니라 인코더에 기반한다. 또 LSTM 기반 Seq2Seq 구조를 가진 것은 ELMo이고, BERT와 GPT는 RNN을 사용하지 않는다.",
        },
      },
    ],
  },
  {
    q: "LLM 개발 및 활용의 4단계 중 LoRA, Adapters가 속하는 것은?",
    answer: 1,
    source: "변형",
    refs: { slides: "LLM 개발 및 활용의 4단계" },
    basis:
      "LoRA, Adapters는 전체 모델을 재학습하지 않고 일부 파라미터만 조정하는 매개변수 효율적 미세조정(PEFT)의 방법이다. PEFT는 지시학습, 정렬 학습과 함께 ⑵ 미세조정 단계에 속한다.",
    examSkill: "4단계와 세부 기법의 연결",
    choices: [
      {
        text: "⑴ 사전 학습 — 모델 아키텍처 및 세부 설정",
        isCorrect: false,
        explanation: {
          basis: "사전 학습 → 데이터 수집 및 전처리, 모델 아키텍처 및 세부 설정, 학습 기법 설계",
          reason:
            "사전 학습은 대규모 데이터로 기본 학습을 하는 단계다. LoRA는 이미 학습된 모델의 일부 파라미터를 조정하는 방법이라 그 뒤 단계에 온다.",
        },
      },
      {
        text: "⑵ 미세조정 — 매개변수 효율적 미세조정(PEFT)",
        isCorrect: true,
        explanation: {
          basis: "PEFT → LoRA, Adapters 같은 방법으로 전체 모델을 재학습하지 않고 일부 파라미터만 조정",
          reason:
            "특정 목적에 맞게 성능을 개선하는 추가 학습이므로 미세조정이고, 그중 일부 파라미터만 조정하는 효율적 방식이 PEFT다.",
        },
      },
      {
        text: "⑶ 추론 — 프롬프트 엔지니어링",
        isCorrect: false,
        explanation: {
          basis: "추론 → 학습된 LLM의 활용(프롬프트 엔지니어링, RAG)",
          reason:
            "프롬프트 엔지니어링은 파라미터를 조정하지 않고 프롬프트를 설계해 학습된 모델을 쓰는 방법이다. 파라미터를 조정하는 LoRA와 다르다.",
        },
      },
      {
        text: "⑷ 평가 — 벤치마크 과제",
        isCorrect: false,
        explanation: {
          basis: "평가 → 벤치마크 과제를 통한 성능 평가, 편향성·윤리성·안정성·개인정보 유출 가능성 등",
          reason: "평가는 모델을 바꾸지 않고 측정한다. LoRA는 모델의 파라미터를 바꾸는 학습 방법이다.",
        },
      },
    ],
  },
  {
    q: "다음 중 Zero-shot-CoT에 해당하는 프롬프트는?",
    answer: 2,
    source: "변형",
    refs: { slides: "프롬프트 엔지니어링 — Few-shot CoT vs Zero-shot CoT", lecture: "Zero-shot-CoT는 예시 없이 ‘단계별로 생각해 봐’ 한 줄만 덧붙여 추론을 끌어내는 기법이라고 정리" },
    basis:
      "Zero-shot은 예시 없이 풀 문제만 주는 것이고, CoT는 프롬프트에 문제 해결 과정을 포함해 유도하는 것이다. 예시 없이 “Let's think step by step.”만 덧붙인 (d)가 Zero-shot-CoT다.",
    examSkill: "예시 유무와 사고 과정 유도의 두 축 구분",
    choices: [
      {
        text: "예시 질문과 “The answer is 11.” 같은 답만 보여 준 뒤 새 문제를 묻는다.",
        isCorrect: false,
        explanation: {
          basis: "(a) Few-shot — 출력 The answer is 8. ✗",
          reason: "예시가 있으므로 Few-shot이고, 풀이 과정이 없으므로 CoT가 아니다.",
        },
      },
      {
        text: "예시 질문과 함께 풀이 과정을 담은 답을 보여 준 뒤 새 문제를 묻는다.",
        isCorrect: false,
        explanation: {
          basis: "(b) Few-shot-CoT — “Roger started with 5 balls. … 5 + 6 = 11.”",
          reason: "풀이 과정을 담은 예시로 유도했으므로 CoT는 맞지만, 예시가 있으므로 Few-shot-CoT다.",
        },
      },
      {
        text: "예시 없이 문제 뒤에 “Let's think step by step.”을 붙인다.",
        isCorrect: true,
        explanation: {
          basis: "(d) Zero-shot-CoT — 출력 … 4 blue golf balls. ✔",
          reason:
            "예시가 없으니 Zero-shot이고, 한 문장으로 단계적 사고를 유도했으니 CoT다. 모델이 16 → 8 → 4로 풀어 정답에 도달했다.",
        },
      },
      {
        text: "예시 없이 문제 뒤에 “The answer (arabic numerals) is”를 붙인다.",
        isCorrect: false,
        explanation: {
          basis: "(c) Zero-shot — 출력 8 ✗",
          reason: "예시가 없으니 Zero-shot이지만, 답의 형식만 요구할 뿐 풀이를 유도하지 않으므로 CoT가 아니다.",
        },
      },
    ],
  },
];

export default function Lecture14Quiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUIZZES.length).fill(null));

  const officialCount = QUIZZES.filter((q) => q.source === "공식 연습문제").length;
  const correctCount = answers.filter((a, i) => a !== null && a === QUIZZES[i].answer).length;
  const allAnswered = answers.every((a) => a !== null);

  const select = (qi: number, ci: number) => {
    if (answers[qi] !== null) return;
    setAnswers((prev) => prev.map((v, i) => (i === qi ? ci : v)));
  };

  return (
    <section id="quiz" className="scroll-mt-32">
      <SectionTitle
        title="복습 퀴즈"
        subtitle={`정리하기 공식 연습문제 ${officialCount}문항과 변형 문제 ${QUIZZES.length - officialCount}문항`}
      />

      <div className="space-y-6">
        {QUIZZES.map((quiz, qi) => {
          const done = answers[qi] !== null;
          const isCorrect = answers[qi] === quiz.answer;
          return (
            <Sourced key={quiz.q} refs={quiz.refs}>
              <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                    {qi + 1}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      quiz.source === "공식 연습문제"
                        ? "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {quiz.source}
                  </span>
                  <span className="text-[11px] text-gray-400">{quiz.examSkill}</span>
                </div>

                {quiz.intro && (
                  <p className="mb-2 rounded-lg bg-gray-50 p-3 text-[12.5px] leading-6 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    {quiz.intro}
                  </p>
                )}
                <h4 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">{quiz.q}</h4>

                <div className="space-y-2">
                  {quiz.choices.map((choice, ci) => {
                    let style =
                      "border-gray-200 bg-gray-50 hover:bg-violet-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-violet-900/10";
                    if (done) {
                      if (choice.isCorrect) {
                        style =
                          "border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/20";
                      } else if (ci === answers[qi]) {
                        style = "border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/20";
                      } else {
                        style = "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800";
                      }
                    }
                    return (
                      <div key={choice.text}>
                        <button
                          onClick={() => select(qi, ci)}
                          disabled={done}
                          className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${style}`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="shrink-0 text-xs font-bold text-gray-400">
                              {String.fromCharCode(9312 + ci)}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">{choice.text}</span>
                            {done && choice.isCorrect && (
                              <CheckCircle size={16} className="ml-auto shrink-0 text-green-500" />
                            )}
                            {done && ci === answers[qi] && !choice.isCorrect && (
                              <XCircle size={16} className="ml-auto shrink-0 text-red-500" />
                            )}
                          </div>
                        </button>

                        <AnimatePresence>
                          {done && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-1 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                                <p className="text-[11px] font-bold text-gray-500">
                                  근거 · {choice.explanation.basis}
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                                  {choice.explanation.reason}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {done && (
                  <div
                    className={`mt-4 rounded-lg p-3 ${
                      isCorrect ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        isCorrect
                          ? "text-green-700 dark:text-green-300"
                          : "text-red-700 dark:text-red-300"
                      }`}
                    >
                      {isCorrect ? "정답" : "오답"} — 정답은{" "}
                      {String.fromCharCode(9312 + quiz.answer)}번
                    </p>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{quiz.basis}</p>
                  </div>
                )}
              </div>
            </Sourced>
          );
        })}
      </div>

      {allAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50 p-6 dark:border-violet-800 dark:bg-violet-900/20"
        >
          <div>
            <p className="text-lg font-bold text-violet-700 dark:text-violet-300">
              결과: {correctCount} / {QUIZZES.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {correctCount === QUIZZES.length
                ? "완벽합니다."
                : correctCount >= QUIZZES.length - 3
                  ? "잘 했습니다."
                  : "복습이 필요합니다."}
            </p>
          </div>
          <button
            onClick={() => setAnswers(new Array(QUIZZES.length).fill(null))}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
          >
            <RotateCcw size={14} />
            다시 풀기
          </button>
        </motion.div>
      )}
    </section>
  );
}
