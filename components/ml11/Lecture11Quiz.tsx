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
  {
    q: "오차함수가 충분히 작지 않은 지점에서 학습이 멈추어 원하는 결과를 얻지 못하는 문제는?",
    answer: 1,
    source: "공식 연습문제",
    refs: { textbook: "12.2.1 지역 극소", slides: "(1) 지역 극소 local minima" },
    basis:
      "지역 극소 문제는 기울기 강하 학습법의 근본적인 문제로, 오차가 충분히 작지 않은 지역 극소에서 학습이 멈춤으로써 원하는 결과를 얻지 못하고 학습이 실패하는 경우다.",
    examSkill: "‘멈춘다’와 ‘느려진다’를 가르는 기준",
    choices: [
      {
        text: "플라토 문제",
        isCorrect: false,
        explanation: {
          basis: "플라토 → 학습곡선에서 평평한 구간, 느린 학습의 원인",
          reason:
            "플라토에서는 학습이 멈추는 것이 아니라 매우 느리게 진행된다. 기울기가 0에 가깝지만 극소점은 아니다.",
        },
      },
      {
        text: "지역 극소의 문제",
        isCorrect: true,
        explanation: {
          basis: "오차가 충분히 작지 않은 지역 극소에서 학습이 멈춤 → ‘학습 실패’로 간주",
          reason:
            "기울기가 정확히 0인 극소점에 들어가면 더 이상 수정이 일어나지 않는다. 그 지점의 오차가 충분히 작지 않으면 학습은 실패한 것이다.",
        },
      },
      {
        text: "조기 종료의 문제",
        isCorrect: false,
        explanation: {
          basis: "조기 종료 → 과다적합이 발생하기 전에 학습을 종료하는 방법",
          reason: "조기 종료는 문제의 이름이 아니라 과다적합을 다루는 해결책이다.",
        },
      },
      {
        text: "기울기 소멸 문제",
        isCorrect: false,
        explanation: {
          basis: "기울기 소멸 → 오차 신호가 입력층으로 내려오면서 점점 약해지는 현상",
          reason: "느린 학습의 원인이며, 층이 많을 때 입력층 쪽 가중치가 잘 고쳐지지 않는 문제다.",
        },
      },
    ],
  },
  {
    q: "오차 신호가 출력층에서 입력층으로 전파되며 점점 약해져 학습이 느려지는 문제는?",
    answer: 3,
    source: "공식 연습문제",
    refs: { textbook: "12.2.2 느린 학습", slides: "(2) 느린 학습 — 기울기 소멸 문제" },
    basis:
      "기울기 소멸 문제는 특히 신경망의 층이 많은 경우 출력층으로부터의 오차 신호가 입력층으로 내려오면서 점점 약해져서 학습이 느려지거나 진행되지 않는 현상이다.",
    examSkill: "원인(셀 포화)과 현상(기울기 소멸)의 구분",
    choices: [
      {
        text: "셀 포화",
        isCorrect: false,
        explanation: {
          basis: "시그모이드에 큰 양수·음수가 들어오면 출력이 0 또는 1에 가까워지는 현상",
          reason:
            "셀 포화는 미분값을 0에 가깝게 만드는 ‘원인’이다. 그 결과로 오차 신호가 약해지는 현상이 기울기 소멸이다.",
        },
      },
      {
        text: "플라토",
        isCorrect: false,
        explanation: {
          basis: "학습곡선에서 평평한 구간 — 안장점에 의해 발생",
          reason: "플라토는 오차함수의 모양에서 비롯되는 문제로, 층을 거치며 신호가 약해지는 것과는 다르다.",
        },
      },
      {
        text: "기울기 폭발",
        isCorrect: false,
        explanation: {
          basis: "12장 주요용어에 기울기 폭발이 함께 제시됨",
          reason: "기울기가 작아지는 것이 아니라 커지는 반대 방향의 현상이다.",
        },
      },
      {
        text: "기울기 소멸",
        isCorrect: true,
        explanation: {
          basis: "1보다 작은 시그모이드 함수의 미분값들이 계속해서 곱해지면서 그 곱한 값이 점점 작아짐",
          reason:
            "층을 하나 지날 때마다 1보다 작은 값이 곱해지므로, 깊어질수록 입력층 쪽에 도달하는 기울기가 급격히 작아진다.",
        },
      },
    ],
  },
  {
    q: "신경망의 느린 학습 문제를 해결하는 방법으로 적절하지 못한 것은?",
    answer: 3,
    source: "공식 연습문제",
    refs: {
      textbook: "12.2.2 느린 학습의 개선 기법 · 12.2.3 과다적합",
      slides: "느린 학습의 개선 기법 ①~⑥ · 과다적합의 해결책 ①",
    },
    basis:
      "활성화 함수 변화, 가중치 초기화, 모멘텀, 적응적 학습률, 배치 정규화, 2차 미분 방법은 느린 학습의 개선 기법이다. 검증 데이터로 종료 시점을 정하는 조기 종료는 과다적합의 해결책이다.",
    examSkill: "기법이 어느 문제에 붙는지 가르기",
    choices: [
      {
        text: "가중치별 학습률을 적응적으로 조정한다.",
        isCorrect: false,
        explanation: {
          basis: "④ 적응적 학습률 — RMSProp, AdaDelta, Adam",
          reason: "가중치가 변화된 크기의 누적합을 이용해 학습률을 조정하는, 느린 학습의 개선 기법이다.",
        },
      },
      {
        text: "기울기 갱신에 이전 움직임을 반영한다.",
        isCorrect: false,
        explanation: {
          basis: "③ 모멘텀 — Δθ⁽τ⁾ = −η∇θE(θ⁽τ⁾) + γΔθ⁽τ⁻¹⁾ (식 12-2)",
          reason: "이전의 움직임(관성)을 반영해 학습 속도의 저하를 방지하는 기법이다.",
        },
      },
      {
        text: "오차함수의 2차 미분 정보를 활용한다.",
        isCorrect: false,
        explanation: {
          basis: "⑥ 2차 미분 방법 — 헤시안 행렬로 표현되는 곡률 정보 (식 12-4)",
          reason: "느린 학습의 개선 기법으로 소개된다. 다만 계산 시간이 길어 실질적 사용에는 한계가 있다.",
        },
      },
      {
        text: "검증 데이터로 과다적합 전에 학습을 종료한다.",
        isCorrect: true,
        explanation: {
          basis: "조기 종료 → 과다적합이 발생하기 전에 학습을 종료하는 방법",
          reason:
            "조기 종료는 과다적합에 대한 해결책이다. 학습을 일찍 끝내는 것이므로 느린 학습 자체를 개선하지는 않는다.",
        },
      },
    ],
  },
  {
    q: "과다적합을 피하고 일반화 성능을 높이는 기법으로 가장 적절한 것은?",
    answer: 3,
    source: "공식 연습문제",
    refs: { textbook: "12.2.3 (3) 드롭아웃", slides: "과다적합의 해결책 ③ 드롭아웃" },
    basis:
      "드롭아웃은 학습 과정에서 가중치를 수정할 때 임의로 선택한 은닉 노드의 일부를 제외하는 방법으로, 작은 모델의 앙상블 평균과 유사한 효과를 통해 일반화 성능을 향상한다.",
    examSkill: "기법을 세 문제(지역 극소·느린 학습·과다적합)로 분류하기",
    choices: [
      {
        text: "Adam",
        isCorrect: false,
        explanation: {
          basis: "④ 적응적 학습률 — Adam은 RMSProp과 모멘텀 방법의 결합",
          reason: "느린 학습을 개선하는 최적화 기법이다. 과다적합과는 직접 관계가 없다.",
        },
      },
      {
        text: "시뮬레이티드 어닐링",
        isCorrect: false,
        explanation: {
          basis: "지역 극소의 회피 대안 — 학습률을 처음에는 크게, 차차 줄여 나감",
          reason: "지역 극소를 피하기 위한 방법이다.",
        },
      },
      {
        text: "배치 정규화",
        isCorrect: false,
        explanation: {
          basis: "⑤ 배치 정규화 — 활성화 함수로 들어가는 입력이 셀 포화 범위를 벗어나지 않도록 정규화",
          reason: "학습의 속도를 높이기 위한 기법으로, 느린 학습 쪽에 속한다.",
        },
      },
      {
        text: "드롭아웃",
        isCorrect: true,
        explanation: {
          basis: "전체 모델이 가지는 복잡도보다 낮은 모델로 학습하는 효과 → 일반화 성능 향상",
          reason:
            "임의로 고른 은닉 노드 일부를 빼고 학습하므로 모델이 데이터의 잡음까지 외우기 어려워진다. 과다적합의 해결책이다.",
        },
      },
    ],
  },
  {
    q: "6×6×3 입력이 콘볼루션층을 거쳐 4×4×2가 되었다. 결과 표현의 숫자 2는 무엇을 뜻하는가?",
    answer: 2,
    source: "공식 연습문제",
    refs: {
      textbook: "12.3.1 콘볼루션 연산의 간략한 표현(그림 12-15)",
      slides: "콘볼루션층 — 콘볼루션 연산의 간략한 표현",
    },
    basis:
      "콘볼루션층의 ‘4×4×2’는 특징맵의 크기(4×4)와 개수(2)를 나타내며, 특징맵의 개수는 사용되는 필터의 개수와 같다.",
    examSkill: "‘크기×크기×개수’ 표기 읽기",
    choices: [
      {
        text: "보폭",
        isCorrect: false,
        explanation: {
          basis: "s(1) = 1 — 보폭은 따로 적는 사용자 정의 파라미터",
          reason: "보폭은 블록 표현의 숫자가 아니라 f·s·p와 함께 옆에 적는 값이다. 여기서는 s = 1이다.",
        },
      },
      {
        text: "채널 수",
        isCorrect: false,
        explanation: {
          basis: "입력층의 ‘6×6×3’에서 3이 채널의 수",
          reason:
            "채널 수는 입력 쪽 표기의 마지막 숫자다. 출력 쪽 마지막 숫자는 만들어진 특징맵의 개수를 뜻한다.",
        },
      },
      {
        text: "필터 개수",
        isCorrect: true,
        explanation: {
          basis: "특징맵의 개수는 사용되는 필터의 개수와 같다 — 2개 필터 → 4×4×2",
          reason: "필터 하나가 특징맵 하나를 만든다. 다양한 특징을 뽑으려면 필터를 여러 개 쓴다.",
        },
      },
      {
        text: "패딩 크기",
        isCorrect: false,
        explanation: {
          basis: "p(1) = 0 — 패딩이 추가되지 않음",
          reason: "패딩도 f·s와 함께 따로 적는 값이다. 6×6에서 4×4가 나온 것은 패딩이 0이기 때문이다.",
        },
      },
    ],
  },
  {
    q: "CNN 모델에 대한 설명 중 적절하지 못한 것은?",
    answer: 0,
    source: "공식 연습문제",
    refs: { textbook: "12.3 합성곱 신경망(CNN) · 12.3.1", slides: "합성곱 신경망 — 신경세포·네트워크 구조" },
    basis:
      "CNN은 이웃한 층의 노드들을 부분적으로만 연결해 신경망의 복잡도를 낮춘 모델이다. 완전연결 구조는 기존 MLP의 특징이며, CNN에서는 완전연결층에서만 쓰인다.",
    examSkill: "CNN과 MLP를 가르는 연결 방식",
    choices: [
      {
        text: "MLP처럼 이웃한 층의 모든 노드가 완전연결된 구조다.",
        isCorrect: true,
        explanation: {
          basis: "층과 층 사이는 부분적인 연결(local connection)을 가지며 커널로 표현되는 가중치를 공유",
          reason:
            "완전연결로 심층을 구성하면 가중치가 너무 많아 복잡도가 높아진다. CNN은 그 문제를 피하려고 부분연결과 가중치 공유를 쓴다. 완전연결층은 마지막 분류 부분에만 있다.",
        },
      },
      {
        text: "2차원 데이터 처리에 적합하다.",
        isCorrect: false,
        explanation: {
          basis: "영상 데이터처럼 격자 구조를 가진 데이터에 적합하도록 개발된 모델",
          reason: "입력층이 다중 채널로 이루어지는 2D 격자 구조의 데이터를 그대로 받는다. 맞는 설명이다.",
        },
      },
      {
        text: "세 가지 서로 다른 층으로 구성된다.",
        isCorrect: false,
        explanation: {
          basis: "콘볼루션층, 서브샘플링(풀링)층, 완전연결층",
          reason: "입력층과 출력층을 제외하고 세 가지 유형의 세포들이 층을 구성한다. 맞는 설명이다.",
        },
      },
      {
        text: "여러 필터로 다양한 특징을 추출할 수 있다.",
        isCorrect: false,
        explanation: {
          basis: "다양한 형태의 특징을 추출하기 위해 다수의 필터를 사용해서 다수의 특징맵을 생성",
          reason: "필터의 가중치가 어떤 특징을 추출할지를 규정하므로, 필터를 늘리면 특징의 종류가 늘어난다.",
        },
      },
    ],
  },
  {
    q: "CNN에 대한 설명으로 적절하지 않은 것은?",
    answer: 3,
    source: "공식 연습문제",
    refs: { textbook: "12.3.2 풀링층", slides: "풀링층(서브샘플링층)" },
    basis:
      "풀링 연산은 각 특징맵마다 독립적으로 수행되기 때문에 연산 전후의 특징맵의 수는 변하지 않고 그대로 유지된다. 줄어드는 것은 특징맵의 크기다.",
    examSkill: "풀링이 줄이는 것과 유지하는 것",
    choices: [
      {
        text: "풀링층의 필터는 학습 대상이 아니다.",
        isCorrect: false,
        explanation: {
          basis: "학습을 통해 결정될 파라미터는 없다. 즉, 풀링층에서는 학습이 수행되지 않는다",
          reason: "최대값이나 평균값을 구하는 연산일 뿐이므로 고칠 가중치가 없다. 맞는 설명이다.",
        },
      },
      {
        text: "풀링은 서브샘플링이라고도 한다.",
        isCorrect: false,
        explanation: {
          basis: "서브샘플링(풀링)층 subsampling/pooling layer",
          reason: "교재와 강의록 모두 두 이름을 함께 쓴다. 맞는 설명이다.",
        },
      },
      {
        text: "풀링층에서는 다중 필터를 적용할 수 없다.",
        isCorrect: false,
        explanation: {
          basis: "풀링 연산은 각 특징맵마다 독립적으로 수행",
          reason:
            "콘볼루션층은 필터를 여러 개 두어 특징맵을 늘리지만, 풀링은 특징맵 하나하나에 같은 창을 적용할 뿐이라 특징맵이 늘어나지 않는다. 맞는 설명이다.",
        },
      },
      {
        text: "풀링으로 특징맵의 크기와 개수를 줄일 수 있다.",
        isCorrect: true,
        explanation: {
          basis: "연산 전후의 특징맵의 수는 변하지 않고 그대로 유지되는 특징이 있다",
          reason:
            "6×6×3에 f = 2, s = 2의 풀링을 적용하면 3×3×3이 된다. 한 변의 크기는 절반이 되지만 장수 3은 그대로다.",
        },
      },
    ],
  },
  {
    q: "7×7 입력에 3×3 필터를 쓰면서 가장자리에 패딩 1을 주고 보폭을 2로 하면, 출력 특징맵의 한 변은?",
    answer: 1,
    source: "변형",
    refs: {
      textbook: "12.3.1 — 패딩(그림 12-12) · 보폭(그림 12-14)",
      slides: "콘볼루션층 — 패딩 · 보폭",
    },
    basis:
      "(7 + 2×1 − 3) ÷ 2 + 1 = 4. 교재 [그림 12-14](b)도 패딩 1을 준 7×7 입력에 보폭 2를 적용해 4×4 출력맵을 얻는다.",
    examSkill: "패딩·보폭이 들어간 출력 크기 계산",
    choices: [
      {
        text: "3",
        isCorrect: false,
        explanation: {
          basis: "(7 + 2 − 3) ÷ 2 + 1 = 4",
          reason: "6 ÷ 2 = 3에서 멈추면 3이 된다. 마지막에 1을 더하는 것을 빠뜨린 값이다.",
        },
      },
      {
        text: "4",
        isCorrect: true,
        explanation: {
          basis: "보폭을 2로 지정하면 2개의 노드마다 연산이 적용되므로 4×4 출력맵이 생성된다",
          reason:
            "패딩을 넣어 9×9가 된 입력에서 3×3 창이 두 칸씩 건너뛰며 놓이는 자리를 세면 가로·세로 각각 4곳이다.",
        },
      },
      {
        text: "5",
        isCorrect: false,
        explanation: {
          basis: "패딩 없이 보폭 1이면 (7 − 3) ÷ 1 + 1 = 5",
          reason: "패딩도 보폭도 적용하지 않은 경우의 값이다. 교재 [그림 12-11]의 상황이다.",
        },
      },
      {
        text: "7",
        isCorrect: false,
        explanation: {
          basis: "패딩 1에 보폭 1이면 (7 + 2 − 3) ÷ 1 + 1 = 7",
          reason: "패딩만 주고 보폭을 1로 두면 입력과 같은 크기가 된다. 보폭 2를 반영하지 않은 값이다.",
        },
      },
    ],
  },
  {
    q: "콘볼루션층에서 학습을 통해 결정되는 값은?",
    answer: 2,
    source: "변형",
    refs: { textbook: "12.3.1 콘볼루션층", slides: "콘볼루션층 — 학습 대상이 되는 가중치" },
    basis:
      "필터에 표현된 값이 CNN에서의 학습 대상이 되는 가중치다. 필터의 크기·보폭·패딩은 사용자가 정하는 파라미터다.",
    examSkill: "학습되는 값과 사람이 정하는 값의 구분",
    choices: [
      {
        text: "필터의 크기",
        isCorrect: false,
        explanation: {
          basis: "f(1) = 3 — 사용자 정의 파라미터",
          reason: "3×3, 5×5, 7×7처럼 설계 단계에서 사람이 정한다.",
        },
      },
      {
        text: "보폭과 패딩의 크기",
        isCorrect: false,
        explanation: {
          basis: "s(1) = 1, p(1) = 0 — 사용자 정의 파라미터",
          reason: "출력 특징맵의 크기를 조정하기 위해 사람이 정하는 값이다.",
        },
      },
      {
        text: "필터 안의 가중치 값",
        isCorrect: true,
        explanation: {
          basis: "여기에 표현된 값이 CNN에서의 학습 대상이 되는 가중치이다",
          reason:
            "필터의 가중치가 어떤 특징을 추출할지를 규정하므로, 설계자가 특징을 정해 주는 대신 학습으로 의미 있는 특징을 자동으로 추출하게 된다.",
        },
      },
      {
        text: "풀링 창 안에서 고를 최대값의 위치",
        isCorrect: false,
        explanation: {
          basis: "풀링층에서는 학습이 수행되지 않는다",
          reason: "최대값의 위치는 그때그때 입력에 따라 정해지는 결과이지 학습되는 파라미터가 아니다.",
        },
      },
    ],
  },
  {
    q: "RGB 컬러 영상처럼 입력이 3채널일 때, 3×3 필터 하나를 적용하면 결과는?",
    answer: 1,
    source: "변형",
    refs: {
      textbook: "12.3.1 — 다중 채널(그림 12-13)",
      slides: "콘볼루션층 — 2차원 격자 입력이 다중 채널을 형성하는 경우",
    },
    basis:
      "필터의 채널 수는 입력 데이터의 채널 수와 같아야 하며, 채널별 콘볼루션 결과를 모두 더하고 활성화 함수를 거쳐 하나의 특징맵이 된다.",
    examSkill: "채널 수와 특징맵 장수의 관계",
    choices: [
      {
        text: "채널마다 하나씩, 특징맵 3장이 생긴다.",
        isCorrect: false,
        explanation: {
          basis: "φ_ReLU(채널1 ∗ 필터1 + 채널2 ∗ 필터2 + 채널3 ∗ 필터3)",
          reason: "채널별 결과는 따로 남지 않고 더해진다. 특징맵의 장수를 정하는 것은 채널 수가 아니라 필터 개수다.",
        },
      },
      {
        text: "세 채널의 결과를 더해 특징맵 1장이 생긴다.",
        isCorrect: true,
        explanation: {
          basis: "3×3×3 필터 하나 → 5×5 특징맵 1장 (패딩이 없는 경우)",
          reason: "필터도 입력과 같은 3채널짜리이므로, 채널마다 곱해 더한 값 하나가 특징맵의 한 칸이 된다.",
        },
      },
      {
        text: "특징맵의 한 변이 입력의 3배가 된다.",
        isCorrect: false,
        explanation: {
          basis: "출력 한 변 = (입력 + 2×패딩 − 필터) ÷ 보폭 + 1",
          reason: "한 변의 크기는 채널 수와 무관하게 필터 크기·보폭·패딩이 정한다.",
        },
      },
      {
        text: "채널 수만큼 보폭이 늘어난다.",
        isCorrect: false,
        explanation: {
          basis: "보폭은 필터가 움직이는 간격 — 사용자가 정하는 값",
          reason: "채널 수와 보폭은 아무 관계가 없다.",
        },
      },
    ],
  },
  {
    q: "채널이 5개인 입력에 1×1 필터 2개를 적용했을 때 얻는 효과는?",
    answer: 2,
    source: "변형",
    refs: {
      textbook: "12.3.1 — 필터의 크기가 1×1인 경우",
      slides: "콘볼루션층 — 필터의 크기가 1×1인 경우",
    },
    basis:
      "1×1 필터는 입력과 출력의 크기를 같게 유지하지만, 5개 채널에 2개 필터가 적용되면 2개의 특징맵이 생성되므로 데이터의 차원이 축소되는 효과를 얻는다.",
    examSkill: "1×1 필터가 바꾸는 것은 크기가 아니라 깊이",
    choices: [
      {
        text: "특징맵의 한 변이 절반으로 줄어든다.",
        isCorrect: false,
        explanation: {
          basis: "필터의 크기가 1×1인 경우 → 입력과 출력은 동일한 크기",
          reason: "한 변을 줄이는 것은 보폭이나 풀링의 일이다.",
        },
      },
      {
        text: "아무 의미 없는 연산이 된다.",
        isCorrect: false,
        explanation: {
          basis: "단일 입력 데이터에 하나의 1×1 필터를 적용하면 기본적으로 모든 노드의 값을 일률적으로 변화시키므로 의미가 없다",
          reason:
            "‘의미가 없다’는 것은 채널이 하나이고 필터도 하나일 때의 이야기다. 다중 채널에 여러 필터를 적용할 때는 그렇지 않다.",
        },
      },
      {
        text: "크기는 그대로인 채 특징맵이 2장으로 줄어드는 차원 축소가 일어난다.",
        isCorrect: true,
        explanation: {
          basis: "5개의 채널에 2개의 필터가 적용되면 2개의 특징맵이 생성되기 때문에 데이터의 차원이 축소되는 효과",
          reason: "한 변의 크기는 그대로지만 깊이가 5에서 2로 줄어든다. 뒤 층이 다룰 값의 개수가 줄어든다.",
        },
      },
      {
        text: "학습해야 할 가중치가 사라진다.",
        isCorrect: false,
        explanation: {
          basis: "필터에 표현된 값이 학습 대상이 되는 가중치",
          reason: "1×1 필터에도 채널 수만큼의 가중치가 있다. 학습 대상이 없는 것은 풀링층이다.",
        },
      },
    ],
  },
  {
    q: "심층 신경망을 사용한 ‘종단간 학습’에 대한 설명으로 옳은 것은?",
    answer: 3,
    source: "변형",
    refs: {
      textbook: "12.1 — 얕은 신경망과 심층 신경망에서의 처리(그림 12-2)",
      slides: "MLP에서 심층 신경망으로 — 패러다임의 변화",
    },
    basis:
      "특징추출 과정과 특징에 의한 분류 과정을 한꺼번에 학습하는 방식을 종단간 학습이라고 한다. 앞 단계의 은닉층은 저급 수준의 특징을, 뒤쪽 은닉층은 고급 수준의 특징을 추출한다.",
    examSkill: "얕은 신경망의 처리 과정과 비교하기",
    choices: [
      {
        text: "HOG·LBP·PCA로 특징을 먼저 뽑고 신경망에 넣는 방식이다.",
        isCorrect: false,
        explanation: {
          basis: "(a) 얕은 신경망을 사용한 전통적인 방법 — 다양한 특징 추출 → 간단한 분류기",
          reason: "이것이 바로 종단간 학습과 대비되는 전통적인 방법이다. 특징을 사람이 설계한다.",
        },
      },
      {
        text: "은닉층을 하나만 사용해 학습 시간을 줄이는 방식이다.",
        isCorrect: false,
        explanation: {
          basis: "전통적으로 다층 퍼셉트론은 주로 하나의 은닉층만을 사용",
          reason: "은닉층이 하나인 것은 얕은 신경망의 특징이다. 종단간 학습은 층 수를 줄이는 이야기가 아니다.",
        },
      },
      {
        text: "학습을 마친 뒤 특징추출기를 따로 붙이는 방식이다.",
        isCorrect: false,
        explanation: {
          basis: "분류와 마찬가지로 특징추출도 학습으로 수행할 수 있다",
          reason: "따로 붙이는 것이 아니라 하나의 학습 과정 안에서 함께 결정된다.",
        },
      },
      {
        text: "특징추출 과정과 분류 과정을 한꺼번에 학습하는 방식이다.",
        isCorrect: true,
        explanation: {
          basis: "특징추출 과정과 특징에 의한 분류 과정을 한꺼번에 학습하는 방식을 종단간 학습이라고 한다",
          reason:
            "수많은 은닉층을 통해 다양한 특징 공간으로의 변환이 충분히 이루어지므로 입력 데이터 자체를 그대로 넣을 수 있다.",
        },
      },
    ],
  },
  {
    q: "심층 신경망의 가중치 초기화에 대한 설명으로 옳지 않은 것은?",
    answer: 2,
    source: "변형",
    refs: {
      textbook: "12.2.2 (2) 가중치 초기화",
      slides: "느린 학습의 개선 기법 ② 가중치 초기화",
    },
    basis:
      "가중치는 셀 포화가 일어나지 않도록 작은 값이면서도 각 뉴런의 가중치가 서로 달라지도록 랜덤한 값이어야 한다. 모두 0으로 주면 오류 역전파가 제대로 동작하지 않는다.",
    examSkill: "‘작게’와 ‘서로 다르게’ 두 조건을 모두 기억하기",
    choices: [
      {
        text: "모든 초기 가중치를 0으로 주면 오류 역전파가 제대로 동작하지 않는다.",
        isCorrect: false,
        explanation: {
          basis: "모든 초기 가중치를 0으로 주면 오류 역전파가 제대로 동작하지 않는다",
          reason: "교재의 서술 그대로다. 맞는 설명이다.",
        },
      },
      {
        text: "모두 동일한 값으로 초기화하면 모든 가중치가 동일하게 변경된다.",
        isCorrect: false,
        explanation: {
          basis: "모두 동일한 값으로 초기화하면 모든 가중치가 동일하게 변경되며",
          reason: "노드를 여러 개 두어도 끝까지 같은 값을 유지하므로 의미가 없다. 맞는 설명이다.",
        },
      },
      {
        text: "가중치가 클수록 셀 포화를 피할 수 있어 학습이 빨라진다.",
        isCorrect: true,
        explanation: {
          basis: "너무 큰 가중치는 학습이 수렴하지 않고 발산하게 만든다",
          reason:
            "가중치가 크면 가중합 u가 커져 오히려 셀 포화가 일어난다. 셀 포화를 피하려면 작은 값이어야 한다.",
        },
      },
      {
        text: "입력의 가중합 u가 좋은 범위에 있도록 작은 값으로 랜덤하게 설정한다.",
        isCorrect: false,
        explanation: {
          basis: "각 뉴런의 가중치가 서로 다르도록 작은 값으로 랜덤하게 설정",
          reason: "‘작게’와 ‘서로 다르게’라는 두 조건을 모두 담은 설명이다. 맞는 설명이다.",
        },
      },
    ],
  },
  {
    q: "플라토 구간이 생기는 원인으로 교재가 드는 것은?",
    answer: 1,
    source: "변형",
    refs: { textbook: "12.2.2 느린 학습 — 플라토(그림 12-3)", slides: "(2) 느린 학습 — 플라토 문제" },
    basis:
      "플라토는 오차함수에 무수히 많이 존재하는 극대·극소가 아닌 극점(안장점, saddle point)에 의해 발생한다.",
    examSkill: "안장점의 정의",
    choices: [
      {
        text: "학습률을 너무 크게 잡아 발산하기 때문",
        isCorrect: false,
        explanation: {
          basis: "학습률이 높으면 가중치가 급격히 변경되므로 발산하는 불안정한 형태가 된다",
          reason: "큰 학습률은 발산을 일으키는 다른 문제다. 플라토는 오차함수의 모양에서 비롯된다.",
        },
      },
      {
        text: "극대·극소가 아니면서 미분값이 0인 극점이 무수히 많기 때문",
        isCorrect: true,
        explanation: {
          basis: "안장점 → 극대·극소가 아닌 극점(미분값 = 0)",
          reason:
            "이 구간에서는 오차함수의 기울기 변화가 거의 없을 정도이기 때문에 학습이 매우 느리게 진행된다. 멈춘 것은 아니다.",
        },
      },
      {
        text: "학습 데이터에 노이즈가 섞여 있기 때문",
        isCorrect: false,
        explanation: {
          basis: "학습 데이터에 포함된 노이즈까지 학습하게 되어 — 과다적합의 설명",
          reason: "노이즈는 과다적합과 연결되는 이야기다.",
        },
      },
      {
        text: "은닉 노드의 일부를 임의로 제외했기 때문",
        isCorrect: false,
        explanation: {
          basis: "드롭아웃 — 과다적합의 해결책",
          reason: "드롭아웃은 사람이 일부러 거는 기법이지 플라토의 원인이 아니다.",
        },
      },
    ],
  },
];

export default function Lecture11Quiz() {
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
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-lime-600 text-xs font-bold text-white">
                    {qi + 1}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      quiz.source === "공식 연습문제"
                        ? "bg-lime-50 text-lime-700 dark:bg-lime-950/50 dark:text-lime-300"
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
                      "border-gray-200 bg-gray-50 hover:bg-lime-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-lime-900/10";
                    if (done) {
                      if (choice.isCorrect) {
                        style = "border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/20";
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
                        isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                      }`}
                    >
                      {isCorrect ? "정답" : "오답"} — 정답은 {String.fromCharCode(9312 + quiz.answer)}번
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
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-lime-200 bg-lime-50 p-6 dark:border-lime-800 dark:bg-lime-900/20"
        >
          <div>
            <p className="text-lg font-bold text-lime-700 dark:text-lime-300">
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
            className="flex items-center gap-2 rounded-lg bg-lime-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-lime-700"
          >
            <RotateCcw size={14} />
            다시 풀기
          </button>
        </motion.div>
      )}
    </section>
  );
}
