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
  choices: QuizChoice[];
  answer: number;
  basis: string;
  examSkill: string;
  source: "공식 연습문제" | "변형";
  refs: SourceRef;
};

const QUIZZES: Quiz[] = [
  {
    q: "특징추출에 대한 설명으로 적절한 것은?",
    answer: 3,
    source: "공식 연습문제",
    basis: "교재 7장 도입·7.1 / 강의록 특징추출, 변환함수, 특징추출을 위한 접근 방법",
    examSkill: "특징추출의 목적과 접근 방법, 선형변환의 표현을 구분하는 판단",
    refs: { textbook: "7장 도입 — 특징추출과 변환함수", slides: "특징추출 / 변환함수 / 특징추출을 위한 접근 방법" },
    choices: [
      {
        text: "핵심 정보를 얻으려면 원래 데이터 차원을 가능한 최대한 줄여야 한다.",
        isCorrect: false,
        explanation: {
          basis: "특징추출의 목적 — 불필요한 정보 제거·핵심 정보 추출, 차원 축소로 효율 향상",
          reason:
            "특징추출의 목적은 분석 목적에 맞는 핵심 정보를 얻는 것이지 차원을 무조건 최대한 줄이는 것이 아니다. PCA도 정보 손실이 허용 범위(예: θ = 0.98) 안에 들도록 m을 정한다.",
        },
      },
      {
        text: "입력 데이터는 항상 목표 출력값과 함께 제공된다.",
        isCorrect: false,
        explanation: {
          basis: "학습 데이터 집합 D = {xᵢ} 또는 D = {(xᵢ, yᵢ)}",
          reason:
            "특징추출의 입력은 데이터만 들어올 수도(PCA처럼 비지도), 목표 출력값과 함께 들어올 수도(LDA처럼 지도) 있다. '항상'이 틀렸다.",
        },
      },
      {
        text: "개발자가 특징을 일일이 설계하는 과정을 표현학습이라고 한다.",
        isCorrect: false,
        explanation: {
          basis: "수작업에 의한 특징추출 vs 표현학습",
          reason:
            "개발자가 일일이 설계하는 것은 수작업에 의한 특징추출이다. 표현학습은 비선형 변환함수를 신경망 등 머신러닝 모델로 표현하고 학습을 통해 최적화된 변환함수를 찾는 것이다.",
        },
      },
      {
        text: "선형변환에 의한 특징추출의 변환함수는 행렬로 표현된다.",
        isCorrect: true,
        explanation: {
          basis: "선형변환 y = φ(x) = Wᵀx",
          reason:
            "선형변환은 n차원 열벡터 x에 n × m 변환행렬 W를 곱해 m차원 특징을 얻으므로 변환함수가 곧 행렬 W로 정의된다.",
        },
      },
    ],
  },
  {
    q: "사영 벡터 w = [2, 1]ᵀ/√5를 사용해 x = [2, 2]ᵀ를 1차원 특징으로 변환할 때 특징값은?",
    answer: 0,
    source: "공식 연습문제",
    basis: "교재 7.1 [그림 7-1] / 강의록 2차원 데이터 x를 1차원 특징값 y로의 변환",
    examSkill: "단위 사영 벡터로 y = wᵀx를 직접 계산하는 능력",
    refs: { textbook: "7.1 — [그림 7-1]", slides: "선형변환에 의한 특징추출 — 2차원 데이터 x를 1차원 특징값 y로의 변환" },
    choices: [
      {
        text: "6/√5",
        isCorrect: true,
        explanation: { basis: "y = wᵀx", reason: "wᵀx = (2·2 + 1·2)/√5 = 6/√5 ≈ 2.683. w는 이미 크기 1인 단위벡터이므로 그대로가 사영한 크기다." },
      },
      {
        text: "7/√5",
        isCorrect: false,
        explanation: { basis: "y = wᵀx", reason: "7이 나오려면 2·2 + 1·3이어야 한다. x의 두 번째 성분은 2다." },
      },
      {
        text: "8/√5",
        isCorrect: false,
        explanation: { basis: "y = wᵀx", reason: "두 성분 모두에 2를 곱한 (2·2 + 2·2)로 계산한 실수. w의 두 번째 성분은 1이다." },
      },
      {
        text: "9/√5",
        isCorrect: false,
        explanation: { basis: "y = wᵀx", reason: "성분끼리 곱해 더하면 2·2 + 1·2 = 6이다. 9는 어떤 성분 조합으로도 나오지 않는다." },
      },
    ],
  },
  {
    q: "주성분분석법에 대한 설명으로 틀린 것은?",
    answer: 0,
    source: "공식 연습문제",
    basis: "교재 7.2.1, 7.2.3 / 강의록 주성분분석 — 목적, PCA의 특성과 문제점",
    examSkill: "PCA가 찾는 방향(분산 최대)과 한계를 가려내는 판단",
    refs: { textbook: "7.2.1 주성분분석 알고리즘 · 7.2.3 특성과 문제점", slides: "주성분분석 — 목적 / PCA의 특성과 문제점" },
    choices: [
      {
        text: "데이터의 분산이 가장 작은 방향으로 선형변환을 수행한다.",
        isCorrect: true,
        explanation: {
          basis: "데이터 집합의 분산이 가장 큰 방향으로의 선형변환을 수행",
          reason: "PCA는 분산이 가장 큰 방향, 즉 공분산행렬의 최대 고유치에 대응하는 고유벡터 방향으로 사영한다. 가장 작은 방향은 버리는 쪽이다.",
        },
      },
      {
        text: "데이터의 비선형 구조를 제대로 반영하지 못한다.",
        isCorrect: false,
        explanation: { basis: "PCA의 특성과 문제점 — 선형변환의 한계", reason: "맞는 설명. 선형변환을 가정하므로 비선형 구조로 분포한 데이터는 어떤 방향으로 사영해도 구조를 표현하지 못한다." },
      },
      {
        text: "데이터가 가능한 넓게 퍼지는 방향으로 사영한다.",
        isCorrect: false,
        explanation: { basis: "주성분분석 — 목적", reason: "맞는 설명. 넓게 퍼지는 방향으로 사영해야 정보 손실이 최소가 된다." },
      },
      {
        text: "단순히 차원을 축소할 때 합리적인 방법이다.",
        isCorrect: false,
        explanation: { basis: "데이터 분석에 대한 특별한 목적이 없는 경우 가장 합리적인 차원 축소 방법", reason: "맞는 설명. 특별한 목적 없이 차원만 줄일 때 가장 합리적·일반적인 기준이다." },
      },
    ],
  },
  {
    q: "다음 설명 중 올바른 것은?",
    answer: 3,
    source: "공식 연습문제",
    basis: "교재 7.1, 7.2.1, 7.3.1 / 강의록 통계적 특징추출 방법",
    examSkill: "PCA와 LDA를 학습 유형과 목적으로 구분하는 판단",
    refs: { textbook: "7.1 — 주성분분석법과 선형판별분석법", slides: "통계적 특징추출 방법" },
    choices: [
      {
        text: "LDA는 비지도학습이다.",
        isCorrect: false,
        explanation: { basis: "LDA — 클래스 정보 사용 → 지도학습", reason: "LDA는 클래스 레이블에 따라 데이터를 나눠 S_B, S_W를 계산하므로 지도학습이다." },
      },
      {
        text: "PCA는 지도학습이다.",
        isCorrect: false,
        explanation: { basis: "PCA — 클래스 정보 미사용 → 비지도학습", reason: "PCA는 레이블 없이 전체 데이터의 공분산만 쓰는 비지도학습이다." },
      },
      {
        text: "LDA의 목적은 정보손실 최소화 특징을 찾는 것이다.",
        isCorrect: false,
        explanation: { basis: "LDA의 목적 — 클래스 간 판별이 잘 되는 방향으로 차원 축소", reason: "정보손실 최소화는 PCA의 목적이다. LDA는 클래스 간 거리는 멀게, 클래스 내는 결집되게 하는 방향을 찾는다." },
      },
      {
        text: "PCA의 목적은 차원축소에 따른 정보손실을 최소화하는 특징을 찾는 것이다.",
        isCorrect: true,
        explanation: { basis: "주성분분석법의 목적", reason: "변환 전 데이터가 가진 정보를 차원 축소 후에도 최대한 유지하는 W, 즉 정보손실을 최소화하는 기저벡터를 찾는 것이 PCA의 목적이다." },
      },
    ],
  },
  {
    q: "특징추출 방법 중 데이터 시각화에 주로 사용되는 것은?",
    answer: 2,
    source: "공식 연습문제",
    basis: "교재 7.4.3 / 강의록 거리 기반 차원 축소 방법의 특징 — 용도",
    examSkill: "거리 기반 방법의 용도를 선형변환 방법·분류기와 구분하는 판단",
    refs: { textbook: "7.4.3 거리 기반 차원 축소 방법의 특징", slides: "거리 기반 차원 축소 방법의 특징 — 용도 → 주로 데이터 시각화" },
    choices: [
      {
        text: "LDA",
        isCorrect: false,
        explanation: { basis: "선형변환에 의한 특징추출", reason: "LDA는 변환행렬 W를 얻어 새 데이터의 분류 같은 문제에 쓰는 특징추출 방법이다." },
      },
      {
        text: "PCA",
        isCorrect: false,
        explanation: { basis: "선형변환에 의한 특징추출", reason: "PCA도 새 데이터에 y = Wᵀx를 적용할 수 있는 선형변환 방법으로, 시각화 전용 방법으로 제시되지 않는다." },
      },
      {
        text: "t-SNE",
        isCorrect: true,
        explanation: { basis: "MDS나 t-SNE는 데이터 시각화의 용도로 주로 사용", reason: "매핑 함수가 없어 새 데이터의 특징은 못 구하지만, 현재 데이터 간 확률적 유사도를 2·3차원에서 잘 표현하므로 분포를 눈으로 확인하는 데 쓴다." },
      },
      {
        text: "MLP",
        isCorrect: false,
        explanation: { basis: "이 강의의 특징추출 방법 목록", reason: "5강에서 다룬 특징추출 방법(PCA, LDA, MDS, t-SNE, Isomap)에 속하지 않는다." },
      },
    ],
  },
  {
    q: "공분산행렬의 고유치가 6, 3, 0.8, 0.2인 4차원 데이터를 PCA로 m = 2차원까지 줄였다. 정보손실량 J와 표현 가능한 정보의 비율 r(4, 2)는?",
    answer: 0,
    source: "변형",
    basis: "교재 7.2.2 식 7-12, 식 7-13",
    examSkill: "버린 고유치의 합과 남긴 고유치의 비율을 계산하는 능력",
    refs: { textbook: "7.2.2 — 식 7-12, 7-13", slides: "PCA의 수학적 유도 — 축소되는 차원 m을 선택하는 기준" },
    choices: [
      { text: "J = 1.0, r(4, 2) = 0.9", isCorrect: true, explanation: { basis: "J = Σⱼ₌ₘ₊₁ⁿ λⱼ, r = Σᵢ₌₁ᵐ λᵢ / Σᵢ₌₁ⁿ λᵢ", reason: "버린 고유치 0.8 + 0.2 = 1.0이 정보손실량, 남긴 (6 + 3)/10 = 0.9가 표현 가능한 정보의 비율." } },
      { text: "J = 9, r(4, 2) = 0.9", isCorrect: false, explanation: { basis: "식 7-12", reason: "9는 남긴 고유치의 합이다. 정보손실량은 버린 쪽(λ₃ + λ₄)의 합이다." } },
      { text: "J = 1.0, r(4, 2) = 0.1", isCorrect: false, explanation: { basis: "식 7-13", reason: "0.1은 손실되는 정보량의 비중이다. r(n, m)은 m개 특징으로 표현 가능한 비율이므로 0.9." } },
      { text: "J = 0.2, r(4, 2) = 0.98", isCorrect: false, explanation: { basis: "식 7-12, 7-13", reason: "m = 3까지 남겼을 때의 값이다(버린 것 0.2, 비율 9.8/10)." } },
    ],
  },
  {
    q: "위 데이터(고유치 6, 3, 0.8, 0.2)에서 역치값 θ = 0.9를 쓰면 선택되는 m은?",
    answer: 2,
    source: "변형",
    basis: "교재 7.2.2 — Σᵢ₌₁ᵐ λᵢ / Σᵢ₌₁ⁿ λᵢ > θ가 되도록 m 결정",
    examSkill: "부등호 조건(>)을 정확히 적용해 m을 고르는 판단",
    refs: { textbook: "7.2.2 — 역치값 θ로 m 결정", slides: "PCA의 수학적 유도 — 선택할 고유벡터의 수(특징의 차수) m" },
    choices: [
      { text: "1", isCorrect: false, explanation: { basis: "r(4, 1) = 6/10 = 0.6", reason: "0.6은 0.9보다 작다." } },
      { text: "2", isCorrect: false, explanation: { basis: "r(4, 2) = 9/10 = 0.9", reason: "0.9는 θ와 같을 뿐 θ보다 크지 않다. 조건은 '> θ'." } },
      { text: "3", isCorrect: true, explanation: { basis: "r(4, 3) = 9.8/10 = 0.98", reason: "처음으로 0.9를 넘는 m이 3이다." } },
      { text: "4", isCorrect: false, explanation: { basis: "r(4, 4) = 1", reason: "조건은 만족하지만 차원이 전혀 줄지 않는다. 조건을 만족하는 가장 작은 m을 고른다." } },
    ],
  },
  {
    q: "w = [1, 1]ᵀ(단위벡터가 아님) 방향으로 x = [3, 1]ᵀ를 사영한 크기는?",
    answer: 1,
    source: "변형",
    basis: "강의록 선형변환에 의한 특징추출 — 특징값 yᵢ = wᵢᵀx (단, wᵢ는 단위벡터)",
    examSkill: "사영 벡터가 단위벡터가 아닐 때 크기로 나누는 처리",
    refs: { slides: "선형변환에 의한 특징추출 — 특징값 yᵢ = wᵢᵀx", lecture: "wᵢ가 단위벡터가 아니면 그 크기로 나눠야 한다고 짚음" },
    choices: [
      { text: "4", isCorrect: false, explanation: { basis: "wᵀx = 3 + 1 = 4", reason: "‖w‖ = √2로 나누지 않은 값. 사영한 길이의 √2배다." } },
      { text: "2√2", isCorrect: true, explanation: { basis: "wᵀx / ‖w‖", reason: "4/√2 = 2√2 ≈ 2.828. 단위벡터 w/‖w‖ = [1, 1]ᵀ/√2로 바꿔 내적한 것과 같다." } },
      { text: "√2", isCorrect: false, explanation: { basis: "wᵀx / ‖w‖", reason: "√2는 ‖w‖ 자체다. 사영한 크기는 wᵀx = 4를 ‖w‖ = √2로 나눈 값이다." } },
      { text: "8", isCorrect: false, explanation: { basis: "wᵀx / ‖w‖", reason: "wᵀx = 4에 ‖w‖² = 2를 곱한 값. 크기는 곱하는 것이 아니라 나눠야 한다." } },
    ],
  },
  {
    q: "공분산행렬 Σ의 고유벡터 u와 고유치 λ에 대해 uᵀΣu = λ가 뜻하는 것은?",
    answer: 2,
    source: "변형",
    basis: "교재 7.2.2 식 7-11",
    examSkill: "고유치가 사영 분산이라는 해석",
    refs: { textbook: "7.2.2 — 식 7-10, 7-11" },
    choices: [
      { text: "고유치는 u 방향으로 사영했을 때 버려지는 정보량이다.", isCorrect: false, explanation: { basis: "식 7-12", reason: "버려지는 정보량은 선택하지 않은 고유치들의 합이다. 한 고유치 자체는 그 방향의 분산이다." } },
      { text: "고유치는 u의 크기(길이)다.", isCorrect: false, explanation: { basis: "직교단위기저 가정", reason: "u는 크기 1인 단위벡터로 가정한다. λ는 길이가 아니다." } },
      { text: "고유치는 u로 데이터를 사영해 얻은 특징값들의 분산이다.", isCorrect: true, explanation: { basis: "식 7-11과 S의 정의(식 7-8)", reason: "uᵀΣu는 u 방향으로 사영한 값들의 분산이므로, 고유치가 클수록 그 방향으로 데이터가 넓게 퍼져 있다." } },
      { text: "고유치는 클래스 간 산점행렬의 랭크다.", isCorrect: false, explanation: { basis: "LDA의 랭크 제한", reason: "랭크 이야기는 LDA의 S_B에 관한 것이며 PCA의 고유치 해석과 무관하다." } },
    ],
  },
  {
    q: "10차원 입력 데이터가 4개의 클래스로 나뉘어 있다. LDA로 얻을 수 있는 특징벡터의 최대 차원은?",
    answer: 1,
    source: "변형",
    basis: "교재 7.3.2 / 강의록 LDA의 특성과 문제점 — 클래스 개수 M개 → 특징벡터는 최대 (M − 1)차원",
    examSkill: "S_B의 랭크 제한으로 LDA 특징 차원 상한을 구하는 능력",
    refs: { textbook: "7.3.2 — S_B의 랭크와 고유벡터 개수", slides: "LDA의 특성과 문제점 — 클래스 개수 = M개 → 특징벡터는 최대 (M − 1)차원" },
    choices: [
      { text: "1", isCorrect: false, explanation: { basis: "이진 분류의 경우", reason: "하나의 특징값만 얻는 것은 클래스가 2개일 때다." } },
      { text: "3", isCorrect: true, explanation: { basis: "rank(S_B) = M − 1", reason: "클래스 4개 → S_W⁻¹S_B에서 고유치가 0이 아닌 고유벡터는 최대 3개 → 특징은 최대 3차원." } },
      { text: "4", isCorrect: false, explanation: { basis: "rank(S_B) = M − 1", reason: "S_B는 전체 평균을 기준으로 M개 평균 벡터로 만들어져 랭크가 M − 1이다." } },
      { text: "10", isCorrect: false, explanation: { basis: "입력 차원", reason: "입력 차원과 무관하게 클래스 개수가 상한을 정한다." } },
    ],
  },
  {
    q: "150 × 100 흑백 영상 5,000장으로 LDA를 바로 적용하려 할 때 생기는 문제와 실용적 접근법으로 옳은 것은?",
    answer: 3,
    source: "변형",
    basis: "교재 7.3.2 / 강의록 LDA의 특성과 문제점 — 작은 표본집합의 문제",
    examSkill: "입력 차원과 데이터 수를 비교해 작은 표본 집합의 문제를 알아보는 판단",
    refs: { textbook: "7.3.2 — 작은 표본 집합의 문제", slides: "LDA의 특성과 문제점 — 작은 표본집합의 문제", lecture: "15,000차원 영상에 데이터가 5,000개뿐인 예를 듦" },
    choices: [
      { text: "클래스 간 산점행렬 S_B의 역행렬이 없으므로 S_B를 단위행렬로 바꾼다.", isCorrect: false, explanation: { basis: "S_W⁻¹S_B", reason: "역행렬이 필요한 것은 S_W다. S_B는 역행렬을 구하지 않는다." } },
      { text: "특징 차원이 M − 1로 제한되므로 클래스 수를 늘린다.", isCorrect: false, explanation: { basis: "고유벡터 개수 제한", reason: "M − 1 제한은 다른 문제다. 여기서의 문제는 N(5,000) ≤ n(15,000)이라 S_W가 특이행렬이 되는 것이다." } },
      { text: "데이터가 비선형 구조이므로 커널법을 먼저 적용한다.", isCorrect: false, explanation: { basis: "선형변환의 한계", reason: "비선형 구조 문제와는 별개. 데이터 수와 차원의 관계에서 생기는 문제다." } },
      { text: "S_W가 특이행렬이 되어 역행렬을 구할 수 없으므로, PCA로 먼저 차원을 줄인 뒤 LDA를 적용한다.", isCorrect: true, explanation: { basis: "작은 표본 집합의 문제", reason: "입력 차원 15,000 > 데이터 수 5,000 → S_W 역행렬이 존재하지 않음 → PCA로 차원을 축소한 특징에 대해 LDA를 수행한다." } },
    ],
  },
  {
    q: "거리 기반 차원 축소 방법에 대한 설명으로 옳지 않은 것은?",
    answer: 1,
    source: "변형",
    basis: "교재 7.4.1~7.4.3 / 강의록 거리 기반 차원 축소 방법의 특징",
    examSkill: "매핑 함수 부재가 새 데이터 처리에 미치는 영향을 이해하는 판단",
    refs: { textbook: "7.4.3 거리 기반 차원 축소 방법의 특징", slides: "거리 기반 차원 축소 방법의 특징" },
    choices: [
      { text: "MDS는 입력 좌표 없이 거리행렬만 주어져도 적용할 수 있다.", isCorrect: false, explanation: { basis: "7.4.3", reason: "맞는 설명. 6개 도시의 이동 비용표처럼 거리값만으로 2차원 좌표를 찾는다." } },
      { text: "학습이 끝나면 새로 주어지는 데이터의 특징값도 변환함수로 바로 계산할 수 있다.", isCorrect: true, explanation: { basis: "입력 데이터와 특징 데이터 간의 매핑 함수를 정의하지 않음", reason: "틀린 설명. 저차원 특징값 자체를 최적화하므로 변환함수가 남지 않고, 새 데이터에 대응하는 특징값은 찾을 수 없다." } },
      { text: "Isomap은 데이터를 정점으로 하는 그래프의 경로로 측지 거리를 구한다.", isCorrect: false, explanation: { basis: "Isomap", reason: "맞는 설명. 경로는 다익스트라 알고리즘으로 계산한다." } },
      { text: "t-SNE는 특징 데이터의 유사도에 t-분포를 사용한다.", isCorrect: false, explanation: { basis: "식 7-25", reason: "맞는 설명. 입력 데이터는 가우시안, 특징 데이터는 t-분포." } },
    ],
  },
  {
    q: "t-SNE가 특징 데이터 사이의 유사도를 정의할 때 정규분포 대신 t-분포를 쓰는 이유는?",
    answer: 0,
    source: "변형",
    basis: "교재 7.4.2 / 강의록 t-SNE",
    examSkill: "t-분포 사용의 목적을 기억하는지 확인",
    refs: { textbook: "7.4.2 — 식 7-25", slides: "t-SNE — 특징 데이터 → t-분포 사용", lecture: "t-분포를 쓰는 이유가 멀리 떨어진 데이터 사이의 관계를 더 잘 반영하기 위해서라고 짚음" },
    choices: [
      { text: "거리가 멀리 떨어진 데이터 사이의 관계를 더 잘 반영하기 위해", isCorrect: true, explanation: { basis: "식 7-25 설명", reason: "t-분포 (1 + d²)⁻¹은 거리가 커져도 천천히 줄어들어 먼 데이터 사이의 관계가 사라지지 않는다." } },
      { text: "새로 주어지는 데이터의 특징값을 계산하기 위해", isCorrect: false, explanation: { basis: "7.4.3", reason: "t-분포를 써도 매핑 함수는 생기지 않는다." } },
      { text: "클래스 레이블 정보를 활용하기 위해", isCorrect: false, explanation: { basis: "t-SNE의 유사도 정의", reason: "유사도는 거리로만 정의되며 레이블은 쓰지 않는다." } },
      { text: "공분산행렬의 고유치 분석을 가능하게 하기 위해", isCorrect: false, explanation: { basis: "t-SNE의 학습 과정", reason: "t-SNE는 KL-divergence를 줄이도록 특징값을 반복 업데이트할 뿐 고유치 분석을 하지 않는다." } },
    ],
  },
];

export default function Lecture5Quiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUIZZES.length).fill(null));

  const correctCount = answers.filter((a, i) => a !== null && a === QUIZZES[i].answer).length;
  const allAnswered = answers.every((a) => a !== null);
  const officialCount = QUIZZES.filter((q) => q.source === "공식 연습문제").length;

  const select = (qi: number, ci: number) => {
    if (answers[qi] !== null) return;
    setAnswers((prev) => prev.map((v, i) => (i === qi ? ci : v)));
  };

  return (
    <section>
      <SectionTitle
        title="복습 퀴즈"
        subtitle={`정리하기 공식 연습문제 ${officialCount}문항과 변형 문제 ${QUIZZES.length - officialCount}문항`}
      />

      <div className="space-y-6">
        {QUIZZES.map((quiz, qi) => {
          const done = answers[qi] !== null;
          const isCorrect = answers[qi] === quiz.answer;
          return (
            <Sourced key={qi} refs={quiz.refs}>
              <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                    {qi + 1}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      quiz.source === "공식 연습문제"
                        ? "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {quiz.source}
                  </span>
                  <span className="text-[11px] text-gray-400">{quiz.examSkill}</span>
                </div>

                <h4 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">{quiz.q}</h4>

                <div className="space-y-2">
                  {quiz.choices.map((choice, ci) => {
                    let style =
                      "border-gray-200 bg-gray-50 hover:bg-rose-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-rose-900/10";
                    if (done) {
                      if (choice.isCorrect) style = "border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/20";
                      else if (ci === answers[qi]) style = "border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/20";
                      else style = "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800";
                    }
                    return (
                      <div key={ci}>
                        <button
                          onClick={() => select(qi, ci)}
                          disabled={done}
                          className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${style}`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="shrink-0 text-xs font-bold text-gray-400">{String.fromCharCode(9312 + ci)}</span>
                            <span className="text-gray-700 dark:text-gray-300">{choice.text}</span>
                            {done && choice.isCorrect && <CheckCircle size={16} className="ml-auto shrink-0 text-green-500" />}
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
                                <p className="text-[11px] font-bold text-gray-500">근거 · {choice.explanation.basis}</p>
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
                  <div className={`mt-4 rounded-lg p-3 ${isCorrect ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
                    <p className={`text-sm font-medium ${isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
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
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-800 dark:bg-rose-900/20"
        >
          <div>
            <p className="text-lg font-bold text-rose-700 dark:text-rose-300">
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
            className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700"
          >
            <RotateCcw size={14} />
            다시 풀기
          </button>
        </motion.div>
      )}
    </section>
  );
}
