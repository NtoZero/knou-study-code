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
    q: "하나의 뉴런 특성을 결정하는 함수가 아닌 것은?",
    answer: 0,
    source: "공식 연습문제",
    refs: { textbook: "11.1.3 신경망의 구성 요소", slides: "신경망의 구성 요소 ① 인공 신경세포 — 활성화 함수" },
    basis: "하나의 뉴런의 특성을 결정하는 것은 활성화 함수이며, loss function은 목표 출력과 실제 출력의 차이를 나타내는 오차함수",
    examSkill: "활성화 함수와 오차함수의 구분",
    choices: [
      {
        text: "loss function",
        isCorrect: true,
        explanation: {
          basis: "활성화 함수가 뉴런의 출력을 결정함. loss function은 목표 출력과 실제 출력의 차이를 나타내는 오차함수",
          reason:
            "오차함수는 학습의 목표를 정의하는 함수로, 신경망 전체가 얼마나 틀렸는지를 재는 데 쓰인다. 뉴런 하나의 입출력 특성과는 다른 층위의 함수다.",
        },
      },
      {
        text: "step function",
        isCorrect: false,
        explanation: {
          basis: "φ_step(u) = 1 (u ≥ 0), 0 (otherwise) — 식 11-1에서 정의된 가장 기본적인 형태",
          reason: "계단함수는 활성화 함수의 하나로, M-P 뉴런과 퍼셉트론이 쓰는 함수다.",
        },
      },
      {
        text: "sigmoid function",
        isCorrect: false,
        explanation: {
          basis: "φ_sigmoid(u) = 1 / (1 + e⁻ᵘ)",
          reason: "미분 가능하면서 출력이 0에서 1 사이로 제한되는 활성화 함수로, 다층 퍼셉트론의 은닉 뉴런에 널리 쓰인다.",
        },
      },
      {
        text: "ReLU function",
        isCorrect: false,
        explanation: {
          basis: "φ_relu(u) = max(0, u)",
          reason: "최근의 딥러닝 모델에서 주로 사용되는 활성화 함수다.",
        },
      },
    ],
  },
  {
    q: "−1과 1 사이의 실수값을 가지며 미분 가능한 활성화 함수는?",
    answer: 0,
    source: "공식 연습문제",
    refs: { textbook: "11.1.3 신경망의 구성 요소 (그림 11-3)", slides: "신경망의 구성 요소 ① 인공 신경세포 — 활성화 함수" },
    basis: "하이퍼탄젠트는 −1과 1 사이의 실수를 출력하는 미분 가능한 S자 함수",
    examSkill: "활성화 함수별 출력 범위와 미분 가능 여부",
    choices: [
      {
        text: "하이퍼탄젠트 함수",
        isCorrect: true,
        explanation: {
          basis: "φ_tanh(u) = (1 − e⁻²ᵘ) / (1 + e⁻²ᵘ), 출력 범위 (−1, 1)",
          reason:
            "계단함수·부호함수와 달리 미분 가능하면서 출력값이 −1에서 1 사이로 제한된다. 두 조건을 모두 만족하는 것은 이 함수뿐이다.",
        },
      },
      {
        text: "ReLU 함수",
        isCorrect: false,
        explanation: {
          basis: "φ_relu(u) = max(0, u), 출력 범위 [0, ∞)",
          reason: "출력에 위쪽 한계가 없고 음수도 내지 않으므로 −1과 1 사이라는 조건에 맞지 않는다. u = 0에서 꺾이기도 한다.",
        },
      },
      {
        text: "시그모이드 함수",
        isCorrect: false,
        explanation: {
          basis: "φ_sigmoid(u) = 1 / (1 + e⁻ᵘ), 출력 범위 (0, 1)",
          reason: "미분 가능하다는 조건은 만족하지만 출력 범위가 0에서 1 사이다. −1까지 내려가지 않는다.",
        },
      },
      {
        text: "부호 함수",
        isCorrect: false,
        explanation: {
          basis: "φ_sign(u) = 1 (u ≥ 0), −1 (otherwise)",
          reason:
            "출력이 −1과 1 사이이기는 하나 두 값뿐인 이산 출력이고, u = 0에서 값이 뛰므로 미분 가능하지 않다.",
        },
      },
    ],
  },
  {
    q: "신경망에 대한 설명 중 적절한 것은?",
    answer: 1,
    source: "공식 연습문제",
    refs: {
      textbook: "11.1.3 신경망의 구성 요소 — 신경망에서의 학습",
      slides: "신경망의 구성 요소 ③ 학습 · ② 연결 구조",
    },
    basis: "신경망에서의 학습이란 신경망이 원하는 기능을 수행할 수 있도록 시냅스의 연결 강도(가중치)를 변화시키는 것",
    examSkill: "학습의 정의, 학습 유형, 연결 구조 용어를 한꺼번에 점검",
    choices: [
      {
        text: "학습은 네트워크 구조 자체를 바꾸는 것이다.",
        isCorrect: false,
        explanation: {
          basis: "함수 f를 결정하는 요소 — 활성화 함수와 연결 구조는 고정된 형태, 연결 가중치는 학습으로 결정",
          reason: "연결 구조와 활성화 함수는 모델 설계 시점에 고정된다. 학습이 바꾸는 것은 구조가 아니라 가중치다.",
        },
      },
      {
        text: "학습은 연결 강도의 조정을 통해 이루어진다.",
        isCorrect: true,
        explanation: {
          basis: "w⁽ᵗ⁺¹⁾ = w⁽ᵗ⁾ + Δw⁽ᵗ⁾ — 반복적인 가중치 수정을 통해 점점 원하는 기능에 근접해 감",
          reason:
            "입력 x가 주어졌을 때 출력 y가 원하는 값이 되도록 가중치(연결 강도) w를 조정하는 것이 신경망의 학습이다.",
        },
      },
      {
        text: "오류 역전파는 비지도학습이다.",
        isCorrect: false,
        explanation: {
          basis: "지도학습(교사학습) → 오류 역전파 학습 알고리즘",
          reason:
            "오류 역전파는 입력 xᵢ에 대한 목표 출력값 tᵢ가 함께 주어지는 지도학습 알고리즘이다. 비지도학습에는 self-organizing feature map, Boltzmann machine 등이 있다.",
        },
      },
      {
        text: "전방향 신경망은 항상 완전연결이다.",
        isCorrect: false,
        explanation: {
          basis: "전방향 = 정보의 흐름이 입력층에서 출력층으로 한 방향 · 완전연결 = 이웃한 두 층의 모든 노드가 연결",
          reason:
            "둘은 서로 다른 기준이다. 전방향이라는 말이 완전연결을 뜻하지는 않으며, 딥러닝에는 완전연결이 아닌 전방향 구조도 많다.",
        },
      },
    ],
  },
  {
    q: "퍼셉트론에 관련된 설명 중 적절한 것은?",
    answer: 2,
    source: "공식 연습문제",
    refs: { textbook: "11.2.1 M-P 뉴런과 퍼셉트론", slides: "퍼셉트론 Perceptron" },
    basis: "퍼셉트론은 단층·전방향·완전연결 구조이며 M-P 뉴런과 계단함수, 이진 입출력의 지도학습을 사용",
    examSkill: "퍼셉트론의 뉴런·연결 구조·학습 규칙 세 가지를 정확히 짚기",
    choices: [
      {
        text: "이진 입출력의 비지도학습을 수행한다.",
        isCorrect: false,
        explanation: {
          basis: "wᵢⱼ⁽ᵗ⁺¹⁾ = wᵢⱼ⁽ᵗ⁾ + η(tⱼ − yⱼ)xᵢ — tⱼ는 목표 출력값",
          reason:
            "이진 입출력이라는 부분은 맞지만 학습 유형이 틀렸다. 퍼셉트론은 목표 출력값을 사용하므로 지도학습을 하는 신경망이다.",
        },
      },
      {
        text: "시그모이드 함수를 사용한다.",
        isCorrect: false,
        explanation: {
          basis: "M-P 뉴런 → 계단함수, yⱼ = φ_step(Σwᵢⱼxᵢ + w₀ⱼ)",
          reason:
            "퍼셉트론의 뉴런은 M-P 뉴런이며 활성화 함수로 계단함수를 쓴다. 시그모이드나 하이퍼탄젠트를 쓰는 것은 다층 퍼셉트론이다.",
        },
      },
      {
        text: "완전연결이다.",
        isCorrect: true,
        explanation: {
          basis: "연결 구조 — 단층, 전방향, 완전 연결(fully-connected)",
          reason: "퍼셉트론은 입력층과 출력층 사이의 모든 노드가 이어진 단층 전방향 완전연결 신경망이다.",
        },
      },
      {
        text: "어떤 논리함수도 구현할 수 있다.",
        isCorrect: false,
        explanation: {
          basis: "선형 판별함수 사용 → 비선형 결정경계를 표현할 수 없음 (XOR 문제)",
          reason:
            "퍼셉트론은 직선 하나로 나눌 수 있는 논리함수만 구현할 수 있다. XOR는 직선 하나로 나눌 수 없어 구현하지 못한다.",
        },
      },
    ],
  },
  {
    q: "다층 퍼셉트론에 대한 설명으로 적절하지 않은 것은?",
    answer: 3,
    source: "공식 연습문제",
    refs: { textbook: "11.2.2 다층 퍼셉트론", slides: "다층 퍼셉트론 · MLP의 표현 능력" },
    basis: "다층 퍼셉트론의 은닉 뉴런에는 비선형 매핑을 위해 반드시 시그모이드나 하이퍼탄젠트 같은 비선형 함수를 사용",
    examSkill: "은닉 뉴런의 활성화 함수 조건",
    choices: [
      {
        text: "완전연결 전방향 네트워크다.",
        isCorrect: false,
        explanation: {
          basis: "연결 구조 — 다층, 전방향, 완전연결",
          reason: "다층 퍼셉트론은 1개 이상의 은닉층을 가지는 다층 전방향 신경망 구조이며 완전연결이다. 맞는 설명이다.",
        },
      },
      {
        text: "하나의 은닉층으로 어떤 연속 함수도 근사할 수 있다.",
        isCorrect: false,
        explanation: {
          basis: "하나의 은닉층을 가지는 다층 퍼셉트론으로 어떠한 연속 함수도 원하는 오차만큼 가깝게 근사할 수 있음이 증명됨",
          reason: "은닉층이 하나라도 은닉 뉴런이 충분하면 임의의 정확도로 모든 연속 함수를 근사할 수 있다. 맞는 설명이다.",
        },
      },
      {
        text: "지도학습을 수행한다.",
        isCorrect: false,
        explanation: {
          basis: "학습 알고리즘 — 지도학습 → 오류 역전파 알고리즘",
          reason: "다층 퍼셉트론은 목표 출력값을 사용하는 지도학습을 하며 오류 역전파 학습 알고리즘을 쓴다. 맞는 설명이다.",
        },
      },
      {
        text: "은닉층에서 계단 함수 또는 선형 함수도 사용할 수 있다.",
        isCorrect: true,
        explanation: {
          basis: "은닉 뉴런에는 반드시 시그모이드나 하이퍼탄젠트와 같은 비선형 함수를 사용",
          reason:
            "은닉층에는 비선형 매핑을 위해 비선형 활성화 함수가 필요하다. 계단함수는 미분이 불가능해 학습에 쓸 수 없고, 선형함수를 쓰면 층을 쌓아도 결국 하나의 선형식이 되어 표현력이 늘지 않는다. 선형함수를 쓸 수 있는 쪽은 출력 뉴런이다.",
        },
      },
    ],
  },

  /* ─────────── 변형 문제 ─────────── */
  {
    q: "생물학적 신경세포의 구성 요소와 기능이 잘못 짝지어진 것은?",
    answer: 2,
    source: "변형",
    refs: { textbook: "11.1.2 생물학적 신경망 (그림 11-1)", slides: "생물학적 신경망 — 신경세포의 구조" },
    basis: "축색은 출력 부분으로 처리된 정보를 다른 신경세포로 전달하기 위해 지나가는 경로",
    examSkill: "수상돌기·세포체·축색·시냅스의 기능 대응",
    choices: [
      {
        text: "수상돌기 — 입력. 다른 여러 신경세포로부터 입력을 받아들임",
        isCorrect: false,
        explanation: {
          basis: "수상돌기는 입력 부분으로 다른 여러 신경세포로부터 입력을 받아들이는 역할",
          reason: "올바른 짝이다. 인공 뉴런에서는 n개의 입력 x₁, …, xₙ이 들어오는 자리에 해당한다.",
        },
      },
      {
        text: "세포체 — 연산. 입력된 정보를 정해진 방식에 따라 처리",
        isCorrect: false,
        explanation: {
          basis: "세포체는 계산 부분으로, 다른 세포들로부터 입력된 정보를 정해진 방식에 따라 처리하는 부분",
          reason: "올바른 짝이다. 인공 뉴런에서는 가중합 u = Σwᵢxᵢ와 활성화 함수 φ에 해당한다.",
        },
      },
      {
        text: "축색 — 연결 강도. 자극을 얼마만큼 받아들일지 결정",
        isCorrect: true,
        explanation: {
          basis: "축색은 출력 부분으로 처리된 정보를 다른 신경세포로 전달하기 위해 지나가는 경로",
          reason:
            "연결 강도를 결정하는 것은 축색이 아니라 시냅스다. 축색은 활동전위를 다음 세포로 실어 나르는 출력 경로다.",
        },
      },
      {
        text: "시냅스 — 가중치. 두 세포가 어느 정도의 강도로 연결되어 있는지",
        isCorrect: false,
        explanation: {
          basis: "신경세포들은 시냅스를 통해 연결되어 있으며, 이 연결 강도를 가중치(weight)라고 함",
          reason:
            "올바른 짝이다. 하나의 출력이 그대로 전달되는 것이 아니라 연결 강도에 따라 전달되는 정보의 양이 달라진다.",
        },
      },
    ],
  },
  {
    q: "가중치의 부호에 대한 설명으로 옳은 것은?",
    answer: 1,
    source: "변형",
    refs: { textbook: "11.1.2 생물학적 신경망 — 흥분성·억제성 연결", slides: "생물학적 신경망 — 신경세포의 구조" },
    basis: "양의 가중치를 가지는 경우를 흥분성(excitatory) 연결, 음의 가중치를 가지는 경우를 억제성(inhibitory) 연결이라 함",
    examSkill: "흥분성·억제성 연결과 가중치 부호의 대응",
    choices: [
      {
        text: "양의 가중치는 억제성 연결로, 받아들이는 신경세포의 활성화 정도를 감소시킨다.",
        isCorrect: false,
        explanation: {
          basis: "양의 가중치 → 흥분성 연결, 음의 가중치 → 억제성 연결",
          reason: "부호와 이름이 뒤바뀌었다. 양의 가중치는 흥분성이며 활성화 정도를 증가시킨다.",
        },
      },
      {
        text: "음의 가중치는 억제성 연결로, 받아들이는 신경세포의 활성화 정도를 감소시킨다.",
        isCorrect: true,
        explanation: {
          basis: "억제성(inhibitory) 연결은 신경세포의 활성화 정도를 감소시키는 역할",
          reason: "음의 가중치가 걸린 입력은 가중합 u를 끌어내려 임계치에 도달하기 어렵게 만든다.",
        },
      },
      {
        text: "가중치의 부호는 정보 전달의 방향만 결정하고 전달량에는 영향을 주지 않는다.",
        isCorrect: false,
        explanation: {
          basis: "연결 강도에 의존하여 정보 전달이 이루어지며, 연결 강도에 따라 전달되는 정보의 양이 달라짐",
          reason: "가중치는 전달되는 정보의 양 자체를 바꾼다. 전방향·회귀는 정보 흐름의 방향을 가르는 별개의 기준이다.",
        },
      },
      {
        text: "가중치가 0이면 그 연결은 억제성 연결이 된다.",
        isCorrect: false,
        explanation: {
          basis: "양의 가중치 → 흥분성, 음의 가중치 → 억제성",
          reason: "억제성은 음의 가중치를 가리킨다. 0은 그 입력이 가중합에 아무 기여도 하지 않는다는 뜻이다.",
        },
      },
    ],
  },
  {
    q: "인공 신경망을 정의하는 3가지 핵심 구성 요소에 해당하지 않는 것은?",
    answer: 2,
    source: "변형",
    refs: {
      textbook: "11.1.3 신경망의 구성 요소",
      slides: "From 생물학적 신경망 To 인공 신경망 — 3가지 핵심 구성 요소",
    },
    basis: "신경망은 크게 세 가지 요소, 즉 인공 신경세포(뉴런) · 연결 구조 · 학습 규칙에 의해 정의됨",
    examSkill: "신경망 모델을 파악하는 세 가지 축",
    choices: [
      {
        text: "신경세포 — 하나의 신경세포가 수행하는 기능을 수학적 함수로 정의",
        isCorrect: false,
        explanation: {
          basis: "(1) 신경세포 neuron, node, unit",
          reason: "세 가지 구성 요소 중 첫 번째다. 활성화 함수를 무엇으로 두느냐가 여기에 해당한다.",
        },
      },
      {
        text: "신경망 구조 — 신경세포들 간의 정보 전달을 위한 연결 구조",
        isCorrect: false,
        explanation: {
          basis: "(2) 신경망 구조 network structure",
          reason: "세 가지 구성 요소 중 두 번째다. 층상 구조인지, 전방향인지 회귀인지가 여기에 해당한다.",
        },
      },
      {
        text: "학습 데이터 — 학습에 사용할 데이터 집합의 크기와 분포",
        isCorrect: true,
        explanation: {
          basis: "신경망의 3가지 핵심 구성 요소 — 신경세포, 신경망 구조, 학습 알고리즘",
          reason:
            "학습 데이터는 학습을 수행할 때 쓰는 재료이지 신경망 모델 자체를 정의하는 요소가 아니다. 세 번째 자리에 들어가는 것은 학습 알고리즘이다.",
        },
      },
      {
        text: "학습 알고리즘 — 연결 강도를 조정하는 방법",
        isCorrect: false,
        explanation: {
          basis: "(3) 학습 알고리즘 learning algorithm",
          reason:
            "세 가지 구성 요소 중 세 번째이자 가장 중요한 것으로, 신경망이 원하는 기능을 수행하도록 연결 강도를 조정하는 방법이다.",
        },
      },
    ],
  },
  {
    q: "다음 중 신경망 구조를 가르는 기준과 그 결과가 바르게 묶인 것은?",
    answer: 3,
    source: "변형",
    refs: { textbook: "11.1.3 신경망의 구성 요소 (그림 11-4~11-6)", slides: "신경망의 구성 요소 ② 연결 구조" },
    basis: "은닉층의 존재 여부 → 단층/다층(심층), 정보 흐름의 방향 → 전방향/회귀",
    examSkill: "두 가지 분류 기준을 섞지 않기",
    choices: [
      {
        text: "정보 흐름의 방향 → 단층 신경망과 다층 신경망",
        isCorrect: false,
        explanation: {
          basis: "정보 흐름의 방향 → 전방향 신경망, 회귀 신경망",
          reason: "기준과 결과가 어긋났다. 단층·다층을 가르는 것은 은닉층의 존재 여부다.",
        },
      },
      {
        text: "은닉층의 존재 여부 → 전방향 신경망과 회귀 신경망",
        isCorrect: false,
        explanation: {
          basis: "은닉층의 존재 여부 → 단층 신경망, 다층 신경망 → 심층 신경망",
          reason: "기준과 결과가 어긋났다. 전방향·회귀를 가르는 것은 정보 흐름의 방향이다.",
        },
      },
      {
        text: "활성화 함수의 종류 → 완전연결 신경망과 그렇지 않은 신경망",
        isCorrect: false,
        explanation: {
          basis: "완전연결(fully connected, dense) = 이웃한 두 층의 모든 뉴런이 연결된 구조",
          reason: "완전연결 여부는 연결의 촘촘함에 대한 말이지 활성화 함수와는 무관하다.",
        },
      },
      {
        text: "은닉층의 존재 여부 → 단층 신경망과 다층(심층) 신경망",
        isCorrect: true,
        explanation: {
          basis:
            "입력층과 출력층으로만 구성된 신경망을 단층 신경망, 1개 이상의 은닉층을 가지는 구조를 다층 신경망이라 함",
          reason: "다수의 은닉층을 갖는 다층 신경망이 딥러닝의 대상이 되는 심층 신경망이다.",
        },
      },
    ],
  },
  {
    q: "XOR 문제에 대한 설명으로 적절하지 않은 것은?",
    answer: 1,
    source: "변형",
    refs: {
      textbook: "11.2.1 M-P 뉴런과 퍼셉트론 — XOR 문제 (그림 11-9)",
      slides: "퍼셉트론의 한계",
    },
    basis: "XOR는 2차원 공간상 하나의 직선으로는 결정경계를 만들 수 없고, 두 개의 직선을 결합해야 해결됨",
    examSkill: "퍼셉트론의 한계가 어디에서 오는지",
    choices: [
      {
        text: "퍼셉트론이 만드는 판별함수는 2차원 공간상 하나의 직선으로 나타난다.",
        isCorrect: false,
        explanation: {
          basis: "선형 판별함수 사용 → 비선형 결정경계를 표현할 수 없음",
          reason: "맞는 설명이다. g(x) = w₁x₁ + w₂x₂ + w₀ = 0은 2차원에서 직선의 방정식이다.",
        },
      },
      {
        text: "학습률 η를 충분히 작게 하면 퍼셉트론도 XOR를 학습할 수 있다.",
        isCorrect: true,
        explanation: {
          basis: "직선 z₁만을 사용해서는 XOR와 같은 출력을 내도록 결정경계를 만드는 것이 불가능",
          reason:
            "학습률은 가중치를 얼마만큼 움직일지를 정할 뿐 결정경계의 모양을 바꾸지 못한다. 직선으로 나눌 수 없는 문제이므로 어떤 학습률로도 오분류가 0이 되지 않는다.",
        },
      },
      {
        text: "두 개의 직선을 결합하면 해결할 수 있으며, 이를 위해 은닉층이 필요하다.",
        isCorrect: false,
        explanation: {
          basis: "두 개의 직선을 결합하여 사용해야 하며, 이를 위해서는 은닉층을 가지는 신경망 구조를 만들어야 함",
          reason: "맞는 설명이다. 은닉 노드 둘이 각각 직선 하나씩을 만들고 출력 노드가 그 결과를 결합한다.",
        },
      },
      {
        text: "비선형 결정경계를 만들기 위해 은닉층을 추가한 신경망을 다층 퍼셉트론이라 한다.",
        isCorrect: false,
        explanation: {
          basis: "비선형 결정경계를 만들기 위하여 은닉층을 추가한 신경망을 다층 퍼셉트론(MLP)이라고 함",
          reason: "맞는 설명이자 다층 퍼셉트론의 정의 그대로다.",
        },
      },
    ],
  },
  {
    q: "다층 퍼셉트론의 함수식에서 기호의 뜻이 잘못된 것은?",
    answer: 0,
    source: "변형",
    refs: { textbook: "11.2.2 다층 퍼셉트론 (식 11-4, 11-5)", slides: "다층 퍼셉트론의 구조와 함수식" },
    basis: "uⱼʰ = Σwᵢⱼxᵢ + w₀ⱼ, zⱼ = φ_h(uⱼʰ), u_kᵒ = Σvⱼₖzⱼ + v₀ₖ, y_k = φ_o(u_kᵒ), θ = W ∪ V",
    examSkill: "다층 퍼셉트론의 기호 체계",
    choices: [
      {
        text: "wᵢⱼ — 은닉 노드 zⱼ 에서 출력 노드 y_k 로의 연결 가중치",
        isCorrect: true,
        explanation: {
          basis: "wᵢⱼ는 입력 노드 xᵢ에서 은닉 노드 zⱼ로의 연결 가중치, vⱼₖ는 은닉 노드 zⱼ에서 출력 노드 y_k로의 연결 가중치",
          reason: "두 가중치를 뒤섞었다. 은닉층에서 출력층으로 가는 가중치는 w가 아니라 v다.",
        },
      },
      {
        text: "uⱼʰ — j번째 은닉 노드로 들어가는 가중합",
        isCorrect: false,
        explanation: {
          basis: "uⱼʰ = Σᵢ₌₁ⁿ wᵢⱼxᵢ + w₀ⱼ",
          reason: "맞는 설명이다. 위첨자 h는 은닉(hidden)층의 가중합임을 나타낸다.",
        },
      },
      {
        text: "v₀ₖ — 출력 노드로의 바이어스 입력 가중치",
        isCorrect: false,
        explanation: {
          basis: "w₀ⱼ와 v₀ₖ는 각각 은닉 노드와 출력 노드로의 바이어스 입력 가중치",
          reason: "맞는 설명이다. 항상 1이 들어오는 입력에 곱해지는 가중치다.",
        },
      },
      {
        text: "θ — 모든 가중치를 묶어서 나타낸 하나의 파라미터",
        isCorrect: false,
        explanation: {
          basis: "θ = W ∪ V — 학습해야 할 대상",
          reason: "맞는 설명이다. 입력층↔은닉층의 W와 은닉층↔출력층의 V를 합쳐 θ로 쓴다.",
        },
      },
    ],
  },
  {
    q: "M-P 뉴런의 바이어스 w₀에 대한 설명으로 옳은 것은?",
    answer: 2,
    source: "변형",
    refs: { textbook: "11.2.1 M-P 뉴런과 퍼셉트론 (식 11-1, 11-2)", slides: "M-P 뉴런" },
    basis: "w₀는 식 11-1의 θ와 동일한 임계치 역할을 하는 것으로, 입력의 가중합이 −w₀보다 크지 못하면 0의 출력을 냄",
    examSkill: "임계치 θ와 바이어스 w₀의 관계",
    choices: [
      {
        text: "학습 중에는 바뀌지 않는 상수로, 모델 설계 시점에 사람이 정한다.",
        isCorrect: false,
        explanation: {
          basis: "wᵢⱼ⁽ᵗ⁺¹⁾ = wᵢⱼ⁽ᵗ⁾ + η(tⱼ − yⱼ)xᵢ — 바이어스도 항상 1이 들어오는 입력에 대한 가중치로 같은 식을 따름",
          reason: "바이어스도 학습으로 조정되는 가중치다. 설계 시점에 고정되는 것은 활성화 함수와 연결 구조다.",
        },
      },
      {
        text: "활성화 함수의 기울기를 조절하는 값이다.",
        isCorrect: false,
        explanation: {
          basis: "yⱼ = φ_step(Σwᵢⱼxᵢ + w₀ⱼ)",
          reason:
            "바이어스는 활성화 함수에 들어가는 값을 좌우로 밀 뿐 함수의 모양 자체를 바꾸지 않는다. 기울기를 좌우하는 것은 입력에 곱해지는 가중치다.",
        },
      },
      {
        text: "식 11-1의 임계치 θ와 같은 역할을 하며, 가중합이 −w₀보다 크지 못하면 0을 출력한다.",
        isCorrect: true,
        explanation: {
          basis: "w₀는 (식 11-1)의 θ와 동일한 임계치 역할을 하는 것으로 바이어스(bias)라고 부름",
          reason:
            "u ≥ θ 라는 조건을 u − θ ≥ 0으로 옮겨 쓴 것이 바이어스다. w₀ = −θ로 두면 임계치를 가중치처럼 함께 다룰 수 있다.",
        },
      },
      {
        text: "출력값의 범위를 0과 1 사이로 제한하는 역할을 한다.",
        isCorrect: false,
        explanation: {
          basis: "출력값의 범위는 활성화 함수가 정함 — 계단함수 {0, 1}, 부호함수 {−1, 1}, 시그모이드 (0, 1)",
          reason: "출력 범위는 어떤 활성화 함수를 쓰느냐로 정해진다. 바이어스가 하는 일이 아니다.",
        },
      },
    ],
  },
];

export default function Lecture9Quiz() {
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
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500 text-xs font-bold text-white">
                    {qi + 1}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      quiz.source === "공식 연습문제"
                        ? "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950/50 dark:text-fuchsia-300"
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
                      "border-gray-200 bg-gray-50 hover:bg-fuchsia-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-fuchsia-900/10";
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
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-fuchsia-200 bg-fuchsia-50 p-6 dark:border-fuchsia-800 dark:bg-fuchsia-900/20"
        >
          <div>
            <p className="text-lg font-bold text-fuchsia-700 dark:text-fuchsia-300">
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
            className="flex items-center gap-2 rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-fuchsia-700"
          >
            <RotateCcw size={14} />
            다시 풀기
          </button>
        </motion.div>
      )}
    </section>
  );
}
