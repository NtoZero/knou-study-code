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
    q: "강화학습의 학습 목적에 대한 설명으로 거리가 먼 것은?",
    answer: 2,
    source: "공식 연습문제",
    refs: { textbook: "14.1.1 강화학습의 계산 모델 · 14.1.2 마르코프 결정 프로세스", slides: "강화학습 — 학습의 목적" },
    basis:
      "강화학습은 누적 보상을 최대화하기 위해 최적 정책과 매 순간의 최적 행동을 찾는다. 상태 전이확률은 MDP로 주어진 환경의 성질이며, 학습이 최적화하는 대상이 아니다.",
    examSkill: "학습 목적과 MDP 구성요소의 구분",
    choices: [
      {
        text: "누적 보상을 최대화한다.",
        isCorrect: false,
        explanation: {
          basis: "강화학습 알고리즘의 목적은 최종적으로 얻게 되는 누적 보상을 최대화하는 것",
          reason: "학습의 목적 그 자체다. 순간의 이익이 아니라 누적 보상이 최대가 되도록 하는 것이 핵심이다.",
        },
      },
      {
        text: "최적 정책을 찾는다.",
        isCorrect: false,
        explanation: {
          basis: "주어진 MDP에서 누적 보상을 최대화하는 최적의 행동을 결정하는 정책을 찾는 것",
          reason: "학습 알고리즘이 해야 하는 일은 최적 정책 π*: S ↦ A를 찾는 것이므로 학습 목적에 해당한다.",
        },
      },
      {
        text: "최적 상태 전이확률을 구한다.",
        isCorrect: true,
        explanation: {
          basis: "P → 상태 전이확률, 환경은 주어진 MDP에 따라 다음 상태와 보상을 결정",
          reason:
            "상태 전이확률 Pᵃₛₛ′는 MDP 튜플의 한 요소로 환경이 정하는 값이다. 에이전트가 최적화하는 것은 그 환경 안에서의 정책과 행동이지 전이확률이 아니다.",
        },
      },
      {
        text: "매 순간 최적 행동을 결정한다.",
        isCorrect: false,
        explanation: {
          basis: "누적 보상이 최대가 되도록 매 순간 최적의 행동을 결정해야 한다",
          reason: "교재 문장 그대로 학습 목적에 포함된다. 다만 ‘순간 보상이 최대인 행동’이 아니라 누적 보상 기준의 최적 행동이다.",
        },
      },
    ],
  },
  {
    q: "MDP와 관련된 설명으로 적절하지 못한 것은?",
    answer: 3,
    source: "공식 연습문제",
    refs: { textbook: "14.1.2 마르코프 결정 프로세스", slides: "마르코프 결정 프로세스" },
    basis:
      "마르코프 성질은 “현재 상태에서 선택할 다음 행동은 현재의 상태(상황)에 의해서만 결정된다”는 것이다. 이전의 선택/결정들은 영향을 미치지 않는다.",
    examSkill: "마르코프 성질의 정의",
    choices: [
      {
        text: "상태·행동 유한집합, 전이확률, 보상 함수, 할인율로 구성된다.",
        isCorrect: false,
        explanation: {
          basis: "마르코프 결정 프로세스는 <S, A, P, R, γ>의 튜플이다",
          reason: "S와 A는 유한집합, P는 상태 전이확률, R은 보상 함수, γ는 할인율 — MDP의 정의 그대로다.",
        },
      },
      {
        text: "에이전트는 정책에 따라 행동을 결정한다.",
        isCorrect: false,
        explanation: {
          basis: "정책 → 에이전트가 행동을 선택할 때 사용하는 규칙",
          reason: "에이전트가 행동을 고르는 근거가 정책이므로 옳은 설명이다.",
        },
      },
      {
        text: "환경은 MDP에 따라 다음 상태와 보상을 결정한다.",
        isCorrect: false,
        explanation: {
          basis: "에이전트는 정책에 따라 행동을 결정하고, 환경은 주어진 MDP에 따라 다음 상태와 보상을 결정",
          reason: "역할 분담이 정확하다. 다음 상태와 보상은 에이전트가 아니라 환경이 정한다.",
        },
      },
      {
        text: "다음 행동은 이전 선택과 현재 상태를 종합해 결정된다.",
        isCorrect: true,
        explanation: {
          basis: "마르코프 성질 — 이전의 선택/결정들이 영향을 미치지 않음 → 현재 상태만 판단하면 됨",
          reason:
            "이전 선택을 함께 고려한다는 부분이 마르코프 성질에 어긋난다. 강화학습은 이 성질을 만족한다는 가정에서 동작한다.",
        },
      },
    ],
  },
  {
    q: "상태와 행동의 시퀀스를 결정하는 함수적 규칙은?",
    answer: 0,
    source: "공식 연습문제",
    refs: { textbook: "14.1.3 정책과 가치함수 — 식 14-1 · 14-2", slides: "정책과 가치함수 — 정책 π" },
    basis:
      "정책 π는 상태 Sₜ와 행동 Aₜ의 시퀀스를 결정하는 함수적 규칙으로, π(a|s) = ℙ[Aₜ = a | Sₜ = s]로 정의한다.",
    examSkill: "정책·수익·가치함수의 정의 구분",
    choices: [
      {
        text: "정책",
        isCorrect: true,
        explanation: {
          basis: "정책 π — 상태 Sₜ와 행동 Aₜ의 시퀀스를 결정하는 함수적 규칙",
          reason: "주어진 상태에 대한 행동의 조건부확률로 표기되며, 에이전트가 행동을 선택할 때 사용하는 규칙이다.",
        },
      },
      {
        text: "수익",
        isCorrect: false,
        explanation: {
          basis: "수익 Gₜ = Σ γᵏRₜ₊ₖ₊₁ — 총할인 보상",
          reason: "수익은 ‘좋은 정책’을 평가하는 기준값(보상의 할인합)이다. 행동을 고르는 규칙이 아니다.",
        },
      },
      {
        text: "행동 가치함수",
        isCorrect: false,
        explanation: {
          basis: "qπ(s, a) = E[Gₜ | Sₜ = s, Aₜ = a]",
          reason: "정책 π에 따라 상태 s에서 행동 a를 선택했을 때의 기대 보상을 돌려주는 평가 함수다. 정책을 전제로 하지, 정책 자체가 아니다.",
        },
      },
      {
        text: "Q-함수",
        isCorrect: false,
        explanation: {
          basis: "행동 가치함수를 “Q-함수”라고 함",
          reason: "Q-함수는 행동 가치함수의 다른 이름이므로 바로 앞 선택지와 같은 이유로 답이 아니다.",
        },
      },
    ],
  },
  {
    q: "상태 가치함수와 행동 가치함수가 반환하는 결과는?",
    answer: 1,
    source: "공식 연습문제",
    refs: { textbook: "14.1.3 정책과 가치함수 — 식 14-5 · 14-6", slides: "정책과 가치함수 — 가치함수" },
    basis:
      "vπ(s) = Eπ[Gₜ | Sₜ = s], qπ(s, a) = E[Gₜ | Sₜ = s, Aₜ = a] — 두 함수 모두 정책에 따른 기대 보상, 곧 누적 보상(수익 Gₜ)의 기대치를 반환한다.",
    examSkill: "가치함수의 입력과 출력",
    choices: [
      {
        text: "다음 상태",
        isCorrect: false,
        explanation: {
          basis: "환경은 주어진 MDP에 따라 다음 상태와 보상을 결정",
          reason: "다음 상태는 상태 전이확률 P에 따라 환경이 정한다. 가치함수는 상태를 돌려주지 않고 값(기대 보상)을 돌려준다.",
        },
      },
      {
        text: "누적 보상의 기대치",
        isCorrect: true,
        explanation: {
          basis: "상태 s에서 시작해서 정책 π에 따라 행동을 취하였을 때 얻을 수 있는 기대 보상(보상의 평균)",
          reason: "두 식 모두 E[Gₜ | …] 꼴이다. 차이는 조건에 행동 a가 들어가느냐뿐이다.",
        },
      },
      {
        text: "현재 상태의 최적 정책",
        isCorrect: false,
        explanation: {
          basis: "최적 정책은 최적 행동 가치함수 q*(s, a)를 최대화하는 행동을 찾으면 됨",
          reason: "최적 정책은 가치함수의 값을 이용해 따로 구하는 것이다. 가치함수가 정책을 직접 반환하지는 않는다.",
        },
      },
      {
        text: "보상에 적용할 할인율",
        isCorrect: false,
        explanation: {
          basis: "γ → 보상을 계산할 때 사용되는 할인율 (γ ∈ [0, 1])",
          reason: "할인율은 MDP에 주어지는 상수다. 가치함수는 그 할인율을 써서 만든 수익의 기대치를 돌려준다.",
        },
      },
    ],
  },
  {
    q: "Q-학습과 관련된 설명 중 적절하지 못한 것은?",
    answer: 3,
    source: "공식 연습문제",
    refs: { textbook: "14.2.1 Q-학습 · 14.2.2 심층 Q-신경망", slides: "Q-학습 · Q-신경망 · Deep Q-Network" },
    basis:
      "DQN은 CNN 구조를 이용하여 원래 영상의 픽셀 데이터를 입력으로 받아 미래 보상을 추정하는 행동 가치함수의 근사함수다. LSTM 기반이 아니며, 학습 불안정성은 경험 재현과 목표망으로 완화한다.",
    examSkill: "Q-함수·Q-학습·Q-신경망·DQN의 구분",
    choices: [
      {
        text: "Q-함수는 정책에 따른 상태-행동 쌍의 가치를 평가한다.",
        isCorrect: false,
        explanation: {
          basis: "Qπ(s, a) = Eπ[Gₜ | s, a], Q-값 → 주어진 상태-행동 쌍의 기대 보상",
          reason: "Q-함수는 행동 가치함수이므로 옳은 설명이다.",
        },
      },
      {
        text: "Q-학습은 최적 정책을 위해 최적 Q-함수를 추정한다.",
        isCorrect: false,
        explanation: {
          basis: "Q-학습 — 최적 정책 π*를 얻기 위해서 최적 Q-함수 Q*(s, a)를 추정하는 방법",
          reason: "Q-학습의 정의 그대로다.",
        },
      },
      {
        text: "Q-신경망은 Q-함수를 신경망으로 표현·추정한다.",
        isCorrect: false,
        explanation: {
          basis: "Q-함수를 테이블이 아닌 근사함수로 신경망을 이용해서 표현하고 추정하는 것",
          reason: "Q-테이블의 한계를 넘기 위한 방법으로 옳은 설명이다.",
        },
      },
      {
        text: "DQN은 LSTM 기반의 심층 신경망 모델이다.",
        isCorrect: true,
        explanation: {
          basis: "DQN — 합성곱 신경망(CNN) 구조, 아타리 게임을 위한 신경망 구조",
          reason:
            "DQN의 입력은 84×84×4 영상이고, 콘볼루션층 2개(나중에 하나 추가)와 완전연결층 2개로 구성된다. 순환 신경망 계열인 LSTM이 아니다.",
        },
      },
    ],
  },
  {
    q: "4×4 미로에서 γ = 0.9인 갱신 규칙을 쓴다. Q̂(14, R) = 0.9이고 상태 14의 나머지 Q̂는 0일 때, 상태 10에서 D를 선택해 14로 이동(보상 0)했다면 갱신된 Q̂(10, D)는?",
    answer: 1,
    source: "변형",
    refs: { textbook: "14.2.1 Q-학습 — 식 14-16", slides: "더 좋은 경로에 대한 선택 — 상태 11에서의 Q-값" },
    basis:
      "Q̂(10, D) ← r + γ max Q̂(14, a′) = 0 + 0.9 × max{0.9, 0, 0, 0} = 0.81. 교재 식 14-16과 같은 계산이다.",
    examSkill: "할인율을 적용한 Q-값 갱신 계산",
    choices: [
      {
        text: "0.9",
        isCorrect: false,
        explanation: {
          basis: "Q̂(14, R) = 0.9는 다음 상태 14의 최대 Q̂ 값",
          reason: "max Q̂(14, a′)를 그대로 옮겨 적은 값이다. 한 칸 거꾸로 올 때 γ = 0.9를 한 번 더 곱해야 한다.",
        },
      },
      {
        text: "0.81",
        isCorrect: true,
        explanation: {
          basis: "Q̂(s, a) = r + γ max Q̂(s′, a′) (식 14-14)",
          reason: "0 + 0.9 × 0.9 = 0.81. 목표에서 한 칸 멀어질 때마다 γ가 한 번씩 더 곱해진다.",
        },
      },
      {
        text: "0.729",
        isCorrect: false,
        explanation: {
          basis: "Q̂(11, L) = 0 + 0.9 × 0.81 = 0.729 (식 14-17)",
          reason: "이 값은 상태 10의 다음 단계, 즉 상태 11에서 L을 갱신할 때 나오는 값이다. γ를 한 번 더 곱했다.",
        },
      },
      {
        text: "1",
        isCorrect: false,
        explanation: {
          basis: "할인율이 없는 규칙 Q̂(s, a) = r + max Q̂(s′, a′)",
          reason: "할인 없는 규칙이라면 같은 경로를 반복할 때 경로 위 값이 모두 1이 되지만, 문제는 γ = 0.9를 쓰므로 해당하지 않는다.",
        },
      },
    ],
  },
  {
    q: "할인율 γ (0 < γ < 1)를 Q-함수 갱신에 적용하는 이유로 가장 적절한 것은?",
    answer: 0,
    source: "변형",
    refs: { textbook: "14.2.1 Q-학습 — 할인된 미래 보상, 그림 14-10", slides: "더 좋은 경로에 대한 선택" },
    basis:
      "하나 이상의 경로를 찾았을 때 빠른(짧은) 경로가 더 좋게 평가되도록 하기 위해서다. 상태 11에서 15만 거치는 경로는 Q̂(11, D) = 0.9, 돌아가는 경로는 Q̂(11, L) = 0.729가 된다.",
    examSkill: "할인된 미래 보상의 역할",
    choices: [
      {
        text: "목표까지의 경로가 여럿일 때 짧은 경로가 더 큰 값을 받도록 하기 위해",
        isCorrect: true,
        explanation: {
          basis: "미로 찾기의 경우에는 빠른(짧은) 경로가 더 좋은 것으로 평가되어야 한다",
          reason: "한 걸음 멀어질 때마다 γ가 곱해지므로, 같은 목표 보상이라도 오래 걸리는 경로일수록 작게 평가된다.",
        },
      },
      {
        text: "함정에서 받는 음의 보상을 상쇄하기 위해",
        isCorrect: false,
        explanation: {
          basis: "함정 방향을 선택하면 원래 자리에 머물며 보상 −1",
          reason: "할인율은 보상의 부호와 무관하게 시점에 따라 무게를 줄일 뿐이다. 음의 보상을 상쇄하는 장치가 아니다.",
        },
      },
      {
        text: "비결정론적 환경에서 갱신값이 흔들리지 않게 하기 위해",
        isCorrect: false,
        explanation: {
          basis: "비결정론적 환경 → 신뢰 요소 belief factor α 도입",
          reason: "새 결과를 얼마나 믿을지 정하는 것은 α다. γ와 α를 섞어 쓰면 틀린다.",
        },
      },
      {
        text: "학습이 진행될수록 탐험의 비율을 줄이기 위해",
        isCorrect: false,
        explanation: {
          basis: "엡실론 탐욕 — ε = 0.1/(t + 1)",
          reason: "탐험 비율을 줄이는 것은 시간에 따라 작아지는 ε의 역할이다. 할인율은 행동 선택 전략과 관계없다.",
        },
      },
    ],
  },
  {
    q: "강의록의 엡실론 탐욕 방법(ε = 0.1/(t + 1))에 대한 설명으로 옳은 것은?",
    answer: 2,
    source: "변형",
    refs: { textbook: "14.2.1 Q-학습 — 엡실론 탐욕 방법", slides: "행동 선택을 위한 전략" },
    basis:
      "ε의 확률로 탐험(랜덤하게 행동 선택), 1 − ε의 확률로 탐사(argmax Q(s, a))를 적용한다. t = 4이면 ε = 0.1/5 = 0.02이고, t가 커질수록 탐험은 줄고 탐사는 늘어난다.",
    examSkill: "탐험·탐사의 구분과 ε 계산",
    choices: [
      {
        text: "시간이 지날수록 탐험의 정도가 늘어난다.",
        isCorrect: false,
        explanation: {
          basis: "시간이 지남에 따라 탐험 정도는 감소, 탐사 정도는 증가",
          reason: "t가 커지면 ε = 0.1/(t + 1)이 작아지므로 반대다.",
        },
      },
      {
        text: "ε의 확률로 현재 Q-함수에서 가장 큰 값을 주는 행동을 고른다.",
        isCorrect: false,
        explanation: {
          basis: "if rand(1) < ε → randomly select a #탐험, else → a = argmax Q(s, a) #탐사",
          reason: "ε의 확률로 하는 것은 랜덤 선택(탐험)이다. argmax 선택은 1 − ε의 확률로 한다.",
        },
      },
      {
        text: "t = 4일 때 랜덤하게 행동을 고를 확률은 0.02다.",
        isCorrect: true,
        explanation: {
          basis: "ε = 0.1/(t + 1)",
          reason: "0.1/(4 + 1) = 0.02. 이 확률로 탐험하고, 0.98의 확률로 탐사한다.",
        },
      },
      {
        text: "탐험은 현재의 Q-함수 정보를 바탕으로 최적의 행동을 선택하는 전략이다.",
        isCorrect: false,
        explanation: {
          basis: "탐사 → 현재의 Q-함수 정보를 바탕으로 최적의 행동을 선택",
          reason: "설명된 내용은 탐사(exploitation)다. 탐험(exploration)은 탐색공간 전체를 골고루 찾기 위해 랜덤하게 다른 행동을 선택한다.",
        },
      },
    ],
  },
  {
    q: "4×4 미로에서 상태 5의 Q̂가 모두 0일 때, 상태 5에서 함정(6) 방향인 R을 선택했다. 할인 없는 규칙으로 갱신한 Q̂(5, R)과 새로운 상태 s′는?",
    answer: 0,
    source: "변형",
    refs: { textbook: "14.2.1 Q-학습 — 그림 14-7", slides: "4×4 미로 찾기에서 Q-학습의 예" },
    basis:
      "함정에 빠지는 방향을 선택하면 원래 자리에 머물며 보상 −1을 받는다. 따라서 s′ = 5이고 Q̂(5, R) ← −1 + max Q̂(5, a′) = −1 + 0 = −1.",
    examSkill: "보상 규칙을 적용한 Q-값 갱신",
    choices: [
      {
        text: "Q̂(5, R) = −1, s′ = 5",
        isCorrect: true,
        explanation: {
          basis: "로봇이 함정에 빠지는 방향을 선택하면 원래 자리에 머물며 보상 −1",
          reason: "r = −1, s′ = 5, max Q̂(5, a′) = 0이므로 −1 + 0 = −1이다.",
        },
      },
      {
        text: "Q̂(5, R) = −1, s′ = 6",
        isCorrect: false,
        explanation: {
          basis: "함정 방향 → 원래 자리에 머묾",
          reason: "보상은 맞지만 상태가 틀렸다. 이 예에서는 함정 칸으로 들어가지 않고 제자리에 머문다.",
        },
      },
      {
        text: "Q̂(5, R) = 0, s′ = 6",
        isCorrect: false,
        explanation: {
          basis: "R = {−1, 1, 0} — 함정, 목표 지점, 나머지",
          reason: "보상 0은 함정도 목표도 아닌 ‘나머지’ 이동에만 주어진다.",
        },
      },
      {
        text: "Q̂(5, R) = 1, s′ = 6",
        isCorrect: false,
        explanation: {
          basis: "목표 지점에 도착하면 보상 1",
          reason: "보상 1은 목표 16에 도착할 때만 받는다. 함정 방향과는 부호부터 반대다.",
        },
      },
    ],
  },
  {
    q: "비결정론적 환경에서의 Q-학습에 대한 설명으로 옳은 것은?",
    answer: 3,
    source: "변형",
    refs: { textbook: "14.2.1 Q-학습 — 식 14-18", slides: "비결정론적 환경" },
    basis:
      "Q̂(s, a) ← (1 − α)Q̂(s, a) + α[r + γ max Q̂(s′, a′)]에서 α = 1이면 (1 − α)Q̂(s, a) 항이 사라져 결정론적 규칙과 같아진다(식 14-18에 α = 1을 대입해 정리한 것).",
    examSkill: "신뢰 요소 α의 역할",
    choices: [
      {
        text: "4×4 미로 찾기 예제는 대표적인 비결정론적 환경이다.",
        isCorrect: false,
        explanation: {
          basis: "결정론적 → 하나의 상태로만 전이가 발생",
          reason: "4×4 미로 예제는 상태 전이가 확률적 불확실성 없이 행동에 의해서만 결정되는 결정론적 환경으로 가정되었다.",
        },
      },
      {
        text: "결정론적 버전의 Q-학습을 그대로 써도 잘 동작한다.",
        isCorrect: false,
        explanation: {
          basis: "상태 전이와 Q̂(s′, a′) → 비결정론적 → 결정론적 버전의 Q-학습이 제대로 동작하지 않음",
          reason: "그래서 신뢰 요소 α를 도입한 갱신 규칙이 필요하다.",
        },
      },
      {
        text: "신뢰 요소 α는 미래 보상을 할인하는 비율이다.",
        isCorrect: false,
        explanation: {
          basis: "학습률과 유사한 개념의 신뢰 요소(belief factor) α",
          reason: "미래 보상을 할인하는 것은 γ다. α는 Q̂(s′, a′)에 대해 신뢰하는 정도를 반영하는 신뢰 요소다.",
        },
      },
      {
        text: "α = 1이면 갱신 규칙이 결정론적 규칙 Q̂(s, a) = r + γ max Q̂(s′, a′)와 같아진다.",
        isCorrect: true,
        explanation: {
          basis: "Q̂(s, a) ← (1 − α)Q̂(s, a) + α[r + γ max Q̂(s′, a′)]",
          reason: "(1 − 1)Q̂(s, a) = 0이므로 옛 값은 사라지고 새 결과만 남는다. α가 작을수록 옛 값을 많이 남긴다.",
        },
      },
    ],
  },
  {
    q: "구글 딥마인드가 재정의한 Q-신경망 형태에 대한 설명으로 옳은 것은?",
    answer: 2,
    source: "변형",
    refs: { textbook: "14.2.2 심층 Q-신경망 — 그림 14-12", slides: "Q-신경망 Q-Network" },
    basis:
      "기본 형태는 상태 s와 행동 a를 입력받아 Q̂(s, a) 하나를 출력한다. 딥마인드는 이를 변형해 상태 s만 입력받고, 출력층이 주어진 상태의 각 행동에 대한 Q-값으로 구성되도록 했다.",
    examSkill: "Q-신경망 두 형태의 입출력 구분",
    choices: [
      {
        text: "입력으로 상태 s와 행동 a가 주어지고 출력은 Q̂(s, a) 하나다.",
        isCorrect: false,
        explanation: {
          basis: "그림 14-12(a) Q-신경망의 기본 형태",
          reason: "기본 형태의 설명이다. 행동마다 따로 계산해야 해서 매우 비효율적이라 재정의되었다.",
        },
      },
      {
        text: "출력층의 노드 수는 가능한 상태의 개수와 같다.",
        isCorrect: false,
        explanation: {
          basis: "출력층은 주어진 상태의 모든 행동의 개수만큼의 노드로 구성",
          reason: "기준은 상태의 수가 아니라 행동의 수다. 아타리의 경우 18가지 조이스틱 조작 행동에 대응한다.",
        },
      },
      {
        text: "입력으로 상태 s만 주어지고, 출력층이 각 행동의 Q-값으로 구성된다.",
        isCorrect: true,
        explanation: {
          basis: "그림 14-12(b) 딥마인드가 재정의한 Q-신경망 형태",
          reason: "주어진 상태에 대해 모든 동작의 Q-값을 한꺼번에 계산하는 구조다.",
        },
      },
      {
        text: "Q-값을 이산적인 테이블에 저장해 두고 필요한 칸을 찾아 쓴다.",
        isCorrect: false,
        explanation: {
          basis: "Q-테이블 — Q-값이 이산적이므로 테이블 형태로 표현 가능",
          reason: "그것은 Q-테이블 방식이다. Q-신경망은 테이블로 표현할 수 없을 만큼 상태가 많을 때 근사함수로 Q-함수를 표현한다.",
        },
      },
    ],
  },
  {
    q: "DQN에서 ‘목표 출력값이 시간에 따라 변하는’ 문제를 해결하기 위해 사용한 방법은?",
    answer: 1,
    source: "변형",
    refs: { textbook: "14.2.2 심층 Q-신경망 — 경험 재현 · 목표망", slides: "Q-신경망 학습의 불안정성 · 경험 재현, 목표망" },
    basis:
      "목표망은 원래 Q-신경망과 같은 구조, 다른 파라미터 θ⁻를 가진 별도의 신경망으로 목표 출력값을 계산한다. θ⁻는 매 C단계마다 θ로 갱신되므로 그 사이에는 목표가 움직이지 않는다.",
    examSkill: "불안정성의 원인과 해결책 짝짓기",
    choices: [
      {
        text: "경험 재현",
        isCorrect: false,
        explanation: {
          basis: "경험 재현 → 데이터 간의 높은 상관관계에 따른 문제 해결",
          reason: "경험 재현은 다른 원인(순차 데이터의 상관관계)에 대응한다. 두 해결책의 짝을 바꾸면 틀린다.",
        },
      },
      {
        text: "목표망",
        isCorrect: true,
        explanation: {
          basis: "목표망 → 시변적인 목표 출력값 문제 해결",
          reason: "(식 14-21)에서 목표값 rₜ + γ max Q̂(sₜ₊₁, a′ | θ⁻)에 θ가 아닌 θ⁻가 들어가므로 θ를 갱신해도 목표가 따라 움직이지 않는다.",
        },
      },
      {
        text: "엡실론 탐욕 방법",
        isCorrect: false,
        explanation: {
          basis: "DQN 학습 알고리즘 ① ε-탐욕 방법에 의한 행동 선택",
          reason: "DQN 알고리즘에 들어 있지만 역할은 탐험과 탐사의 혼합이다. 학습 불안정성의 해결책으로 제시된 것이 아니다.",
        },
      },
      {
        text: "신뢰 요소 α",
        isCorrect: false,
        explanation: {
          basis: "비결정론적 환경 → 신뢰 요소 α 도입",
          reason: "α는 Q-테이블 방식의 Q-학습을 비결정론적 환경에 맞춘 장치다. DQN의 불안정성 해결책은 경험 재현과 목표망이다.",
        },
      },
    ],
  },
  {
    q: "마르코프 결정 프로세스 <S, A, P, R, γ>에서 R에 대한 설명으로 옳은 것은?",
    answer: 2,
    source: "변형",
    refs: { textbook: "14.1.2 마르코프 결정 프로세스 — 정의", slides: "마르코프 결정 프로세스 — 튜플" },
    basis:
      "R은 보상 함수로, 상태 s에서 행동 a를 취했을 때 얻어질 보상의 기대치 Rᵃₛ = E[Rₜ₊₁ | Sₜ = s, Aₜ = a]이며 스칼라 값으로 주어진다.",
    examSkill: "MDP 튜플 요소의 정의",
    choices: [
      {
        text: "상태 s에서 행동 a를 취했을 때 상태 s′로 전이될 확률값",
        isCorrect: false,
        explanation: {
          basis: "P → 상태 전이확률 Pᵃₛₛ′ = ℙ[Sₜ₊₁ = s′ | Sₜ = s, Aₜ = a]",
          reason: "P의 정의다. R과 P는 조건(Sₜ = s, Aₜ = a)이 같아 헷갈리기 쉽지만 P는 확률, R은 보상의 기대치다.",
        },
      },
      {
        text: "보상을 계산할 때 사용되는 0과 1 사이의 값",
        isCorrect: false,
        explanation: {
          basis: "γ → 보상을 계산할 때 사용되는 할인율 (γ ∈ [0, 1])",
          reason: "할인율 γ의 정의다.",
        },
      },
      {
        text: "상태 s에서 행동 a를 취했을 때 얻어질 보상의 기대치",
        isCorrect: true,
        explanation: {
          basis: "R → 보상 함수, Rᵃₛ = E[Rₜ₊₁ | Sₜ = s, Aₜ = a]",
          reason: "보상 함수의 정의 그대로다. 그림 14-6의 미로에서는 R = {−1, 0, 5}로 주어진다.",
        },
      },
      {
        text: "에이전트가 행동을 선택할 때 사용하는 규칙",
        isCorrect: false,
        explanation: {
          basis: "정책 policy → 에이전트가 행동을 선택할 때 사용하는 규칙",
          reason: "정책 π의 정의다. 정책은 MDP 튜플의 요소가 아니라 MDP 안에서 학습으로 찾는 대상이다.",
        },
      },
    ],
  },
];

export default function Lecture15Quiz() {
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
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-600 text-xs font-bold text-white">
                    {qi + 1}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      quiz.source === "공식 연습문제"
                        ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300"
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
                      "border-gray-200 bg-gray-50 hover:bg-cyan-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-cyan-900/10";
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
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan-200 bg-cyan-50 p-6 dark:border-cyan-800 dark:bg-cyan-900/20"
        >
          <div>
            <p className="text-lg font-bold text-cyan-700 dark:text-cyan-300">
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
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-700"
          >
            <RotateCcw size={14} />
            다시 풀기
          </button>
        </motion.div>
      )}
    </section>
  );
}
