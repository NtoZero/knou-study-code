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
    q: "순환 신경망의 대표적인 응용은?",
    answer: 3,
    source: "공식 연습문제",
    refs: { textbook: "12.4.1 기본 RNN — RNN의 응용 분야", slides: "순환 신경망의 필요성" },
    basis:
      "RNN은 텍스트 처리와 음성 처리와 같이 시퀀스 형태를 다루는 데 주로 사용되며, 대표적인 응용 사례가 기계번역이다.",
    examSkill: "CNN의 응용과 RNN의 응용 구분",
    choices: [
      {
        text: "데이터 시각화",
        isCorrect: false,
        explanation: {
          basis: "데이터 시각화 — 고차원 데이터를 저차원으로 사영해 보여 주는 특징추출의 활용",
          reason:
            "순서 정보를 다루는 문제가 아니다. t-SNE 같은 차원축소 기법이 다루는 영역이며 RNN의 대표 응용이 아니다.",
        },
      },
      {
        text: "객체인식",
        isCorrect: false,
        explanation: {
          basis: "CNN은 주로 컴퓨터비전 분야에서 많이 사용되는 데 반해 RNN은 텍스트 처리와 음성 처리에 주로 사용",
          reason: "객체인식은 격자 구조의 영상을 다루는 CNN의 응용이다.",
        },
      },
      {
        text: "고해상도 문제",
        isCorrect: false,
        explanation: {
          basis: "영상의 해상도를 높이는 문제 — 컴퓨터비전 영역",
          reason: "한 시점의 이미지를 다루는 문제이므로 순차 데이터를 다루는 RNN의 응용이 아니다.",
        },
      },
      {
        text: "기계번역",
        isCorrect: true,
        explanation: {
          basis:
            "대표적인 응용 사례가 기계번역이며, 이는 번역하려는 입력 문장과 출력 문장이 모두 글자나 단어들이 순서를 가지고 연속적으로 나타나는 시퀀스 형태로 구성되기 때문",
          reason:
            "입력도 출력도 시퀀스이므로 순차 데이터를 다루는 RNN에 꼭 맞는다. 입·출력 관계로는 m:n 구조에 해당한다.",
        },
      },
    ],
  },
  {
    q: "RNN 셀의 활성화 함수로 주로 사용되는 것은?",
    answer: 1,
    source: "공식 연습문제",
    refs: {
      textbook: "12.4.1 — 식 12-10, RNN에서 활성화 함수로는 주로 tanh를 사용",
      slides: "RNN 셀의 구조 — tanh",
    },
    basis:
      "h_t = tanh(W_hh h_(t−1) + W_xh x_t + b_h). 은닉 셀에는 하이퍼탄젠트를 주로 쓰고, 출력층의 활성화 함수 φ로는 보통 소프트맥스를 쓴다.",
    examSkill: "은닉 셀의 활성화 함수와 출력층의 활성화 함수 구분",
    choices: [
      {
        text: "시그모이드",
        isCorrect: false,
        explanation: {
          basis: "tanh가 시그모이드 함수보다 기울기 소멸 문제에 좀 더 효과적이라는 것이 알려져 있음",
          reason:
            "시그모이드의 미분값은 최대 0.25이고 tanh는 최대 1이다. 시각마다 곱해지는 구조에서 이 차이가 거듭제곱으로 벌어지므로 tanh를 쓴다.",
        },
      },
      {
        text: "하이퍼탄젠트",
        isCorrect: true,
        explanation: {
          basis: "h_t = f_W(h_(t−1), x_t) = tanh(W_hh h_(t−1) + W_xh x_t + b_h) (식 12-10)",
          reason:
            "기본 RNN 셀의 활성화 함수는 tanh다. 출력이 −1에서 1 사이로 묶이므로 순환 구조에서 값이 지나치게 커지지 않는다.",
        },
      },
      {
        text: "ReLU",
        isCorrect: false,
        explanation: {
          basis: "ReLU 함수를 사용하면 순환적인 구조로 인해 h값이 지나치게 커질 수 있음",
          reason:
            "ReLU는 위쪽이 열려 있어 같은 가중치가 반복해서 곱해지는 순환 구조에서 상태가 발산할 수 있다. CNN에서는 자주 쓰이지만 RNN 셀에서는 아니다.",
        },
      },
      {
        text: "소프트맥스",
        isCorrect: false,
        explanation: {
          basis: "y_t = φ_softmax(W_hy h_t + b_o) (식 12-11)",
          reason:
            "소프트맥스는 은닉 셀이 아니라 출력층의 활성화 함수다. 묻는 자리가 ‘셀’임에 주의한다.",
        },
      },
    ],
  },
  {
    q: "RNN에 대한 설명으로 적절하지 못한 것은?",
    answer: 2,
    source: "공식 연습문제",
    refs: {
      textbook: "12.4.2 RNN 학습 — 기울기 소멸 문제",
      slides: "RNN 학습의 문제 — 기울기 소멸",
    },
    basis:
      "기울기 소멸 문제는 층의 개수가 아닌 곱해지는 값의 개수, 즉 시점 1에서 t까지의 길이(timestep t)에 영향을 받는다. 은닉층이 하나여도 긴 시퀀스에서는 기울기 소멸이 발생한다.",
    examSkill: "기울기 소멸의 원인이 층의 수가 아니라 timestep이라는 점",
    choices: [
      {
        text: "셀 출력이 자신의 입력으로 들어가는 순환 연결이 있다.",
        isCorrect: false,
        explanation: {
          basis: "RNN은 은닉 노드 사이에 가중치를 갖는 에지가 존재해서 직전에 발생한 정보를 현재의 입력으로 전달",
          reason: "순환 에지가 RNN을 전방향 신경망과 가르는 지점이다. 맞는 설명이다.",
        },
      },
      {
        text: "자연어 처리에 적합하다.",
        isCorrect: false,
        explanation: {
          basis: "RNN은 텍스트 처리와 음성 처리와 같이 시퀀스 형태를 다루는 데 주로 사용",
          reason: "문장은 단어의 나열이므로 순차 데이터다. 맞는 설명이다.",
        },
      },
      {
        text: "하나의 은닉층이므로 기울기 소멸 문제가 발생하지 않는다.",
        isCorrect: true,
        explanation: {
          basis:
            "RNN에서 기울기 소멸 문제는 층의 개수가 아닌 곱해지는 값의 개수, 즉 RNN의 계산에 참여하는 시점 1에서 t까지의 길이(timestep t)에 영향을 받음",
          reason:
            "역전파되는 기울기는 w φ′(·) 꼴의 항이 (t−1)번 연속해서 곱해지는 형태다. 은닉층이 하나뿐이어도 시퀀스가 길면 곱해지는 횟수가 늘어 기울기가 0에 가까워진다.",
        },
      },
      {
        text: "시간 역전파로 지도학습을 적용한다.",
        isCorrect: false,
        explanation: {
          basis: "RNN은 학습 데이터 집합 D = {(x_i, y_i)}를 사용하여 지도학습을 수행하며, 시간 역전파(BPTT) 학습 알고리즘이 사용됨",
          reason: "목표 출력값이 함께 주어지는 지도학습이며, 학습 알고리즘은 BPTT다. 맞는 설명이다.",
        },
      },
    ],
  },
  {
    q: "LSTM에서 사용되는 게이트에 해당하지 않는 것은?",
    answer: 1,
    source: "공식 연습문제",
    refs: {
      textbook: "12.4.3 LSTM과 GRU — 3개의 게이트 / GRU의 2개의 게이트",
      slides: "LSTM 셀의 기능 · GRU",
    },
    basis:
      "LSTM의 게이트는 망각 게이트(forget gate), 입력 게이트(input gate), 출력 게이트(output gate) 세 가지다. 갱신 게이트(update gate)는 GRU의 게이트다.",
    examSkill: "LSTM의 게이트와 GRU의 게이트 구분",
    choices: [
      {
        text: "input gate",
        isCorrect: false,
        explanation: {
          basis: "입력 게이트: 셀 상태에 새로운 정보를 추가하는 정도를 조정",
          reason: "i_t = σ(W_i[h_(t−1), x_t] + b_i). LSTM의 게이트가 맞다.",
        },
      },
      {
        text: "update gate",
        isCorrect: true,
        explanation: {
          basis: "GRU 셀은 2개의 게이트로 구성되는데, 갱신 게이트(update gate) z_t와 리셋 게이트(reset gate) r_t이다",
          reason:
            "갱신 게이트는 GRU의 것이다. LSTM 셀의 입력 게이트와 망각 게이트를 합친 역할을 한다.",
        },
      },
      {
        text: "forget gate",
        isCorrect: false,
        explanation: {
          basis: "망각 게이트: 셀 상태의 정보를 어느 정도 지우고 남길 것인지를 조정",
          reason:
            "f_t = σ(W_f[h_(t−1), x_t] + b_f). LSTM의 게이트가 맞다. 1997년 최초 제안에는 없었고 2000년에 추가되었다.",
        },
      },
      {
        text: "output gate",
        isCorrect: false,
        explanation: {
          basis: "출력 게이트: 현재 셀 상태의 중요도를 반영하여 출력 정도를 조정",
          reason: "o_t = σ(W_o[h_(t−1), x_t] + b_o). LSTM의 게이트가 맞다.",
        },
      },
    ],
  },
  {
    q: "다음 설명 중 적절한 것은?",
    answer: 0,
    source: "공식 연습문제",
    refs: {
      textbook: "12.4.3 — LSTM 셀의 구조(그림 12-27) · GRU 셀의 구조",
      slides: "LSTM 셀 구조 · GRU",
    },
    basis:
      "단순 RNN 셀과 비교해 LSTM은 시간 t에서의 셀의 출력 h_t뿐만 아니라 셀의 내부 상태를 나타내는 c_t도 순환의 대상이 된다.",
    examSkill: "LSTM과 GRU의 순환 대상·게이트 수·파라미터 수 비교",
    choices: [
      {
        text: "LSTM에서는 셀 상태와 셀 출력이 모두 순환 대상이다.",
        isCorrect: true,
        explanation: {
          basis:
            "단순 RNN 셀의 구조와 비교해 보면 시간 t에서의 셀의 출력 h_t뿐만 아니라 셀의 내부 상태(셀이 기억하고 있는 과거 내용)를 나타내는 c_t도 순환의 대상이 됨을 알 수 있다",
          reason:
            "LSTM 셀은 3개의 입력(x_t, c_(t−1), h_(t−1))을 받는다. 셀 상태가 따로 순환한다는 점이 GRU와 갈리는 지점이다.",
        },
      },
      {
        text: "LSTM은 GRU를 단순화한 모델이다.",
        isCorrect: false,
        explanation: {
          basis: "LSTM 셀 구조를 좀 더 단순하게 개선한 것이 바로 2014년에 제안된 GRU이다",
          reason: "방향이 반대다. GRU가 LSTM을 단순화한 것이다.",
        },
      },
      {
        text: "GRU는 3개 게이트를 사용한다.",
        isCorrect: false,
        explanation: {
          basis: "GRU 셀은 2개의 게이트로 구성되는데, 갱신 게이트 z_t와 리셋 게이트 r_t이다",
          reason: "게이트가 3개인 쪽은 LSTM이다. GRU는 2개다.",
        },
      },
      {
        text: "같은 입출력 차원과 은닉 노드 수라면 기본 RNN과 LSTM의 파라미터 수가 거의 같다.",
        isCorrect: false,
        explanation: {
          basis: "LSTM은 복잡한 연결 구조를 갖고, 이로 인해 많은 파라미터를 가진다",
          reason:
            "LSTM은 W_f, W_i, W_c, W_o 네 묶음을 학습하는 반면 기본 RNN은 한 묶음이다. 같은 조건에서 파라미터 수가 약 4배가 된다.",
        },
      },
    ],
  },

  /* ─────────── 변형 문제 ─────────── */

  {
    q: "순차 데이터의 특징으로 적절하지 못한 것은?",
    answer: 3,
    source: "변형",
    refs: {
      textbook: "12.4.1 — 순차 데이터의 특징",
      slides: "순환 신경망의 필요성 — 순차 데이터의 특징",
    },
    basis:
      "순차 데이터는 출현 순서가 중요하고, 길이가 고정되지 않고 순간마다 달라질 수 있으며, 데이터 안의 요소 사이에 문맥적인 의존성이 있다.",
    examSkill: "순차 데이터의 세 가지 특징 암기",
    choices: [
      {
        text: "데이터의 출현 순서가 중요하다.",
        isCorrect: false,
        explanation: {
          basis: "데이터가 나타나는 순서가 중요하다",
          reason: "같은 단어 묶음이라도 순서가 달라지면 뜻이 달라진다. 맞는 설명이다.",
        },
      },
      {
        text: "데이터 안의 요소 사이에 문맥적인 의존성이 존재한다.",
        isCorrect: false,
        explanation: {
          basis: "하나의 데이터 안의 요소 사이에 문맥적인 의존성이 있으므로 이전의 내용을 기억하고 적절한 순간에 활용해야 한다",
          reason: "이 특징 때문에 이전 상태를 전달하는 순환 에지가 필요해진다. 맞는 설명이다.",
        },
      },
      {
        text: "이전의 내용을 기억하고 활용하는 것이 중요하다.",
        isCorrect: false,
        explanation: {
          basis: "이전 내용을 기억/활용하는 것이 중요",
          reason: "문맥 의존성에서 따라 나오는 요구사항이다. 맞는 설명이다.",
        },
      },
      {
        text: "데이터의 길이가 항상 일정하게 고정되어 있다.",
        isCorrect: true,
        explanation: {
          basis: "데이터의 길이가 고정되지 않고 순간마다 달라질 수 있다",
          reason:
            "길이가 가변적이라는 것이 순차 데이터의 특징이다. 입력 차원이 고정된 MLP로 순차 데이터를 다루기 어려운 이유이기도 하다.",
        },
      },
    ],
  },
  {
    q: "RNN을 시간의 흐름에 따라 펼친 전개된 구조에 대한 설명으로 옳은 것은?",
    answer: 1,
    source: "변형",
    refs: {
      textbook: "12.4.1 — RNN의 표현 방법(그림 12-20), 식 12-9",
      slides: "RNN의 표현 방법 · RNN의 계산 과정 — 가중치 공유",
    },
    basis:
      "전개된 그림을 통해 RNN의 각 층은 시간의 흐름에 따라 새로운 입력을 받고 있지만, 실제로는 같은 층이기 때문에 가중치가 공유되고 있음을 알 수 있다.",
    examSkill: "전개 구조에서의 가중치 공유",
    choices: [
      {
        text: "시각마다 서로 다른 가중치를 학습하므로 펼친 길이에 비례해 파라미터가 늘어난다.",
        isCorrect: false,
        explanation: {
          basis: "실제로는 같은 층이기 때문에 가중치가 공유되고 있음",
          reason:
            "펼친 그림의 각 칸은 서로 다른 층이 아니라 같은 층을 시간에 따라 여러 번 그린 것이다. 가중치 수는 늘지 않는다.",
        },
      },
      {
        text: "각 시각의 층은 실제로는 같은 층이므로 가중치가 공유된다.",
        isCorrect: true,
        explanation: {
          basis: "그림 12-20(b) 전개된 구조 · 그림 12-21 RNN의 순차적인 계산 과정 — 가중치 W가 공유되고 있음",
          reason:
            "W_xh, W_hh, W_hy 세 묶음이 모든 시각에서 동일하다. 순환식 h_t = f_W(h_(t−1), x_t)에서 f_W의 아래첨자 W가 바뀌지 않는 것이 그 표시다.",
        },
      },
      {
        text: "축약 표현에서 입력층과 은닉층은 실제로 노드 하나씩으로 구성된다.",
        isCorrect: false,
        explanation: {
          basis: "실제로는 입력층과 은닉층은 다차원 벡터를 처리할 수 있도록 노드의 집합으로 이루어진다",
          reason: "축약 그림에서 노드 하나처럼 보이는 것은 표기를 줄인 것일 뿐이다.",
        },
      },
      {
        text: "전개하면 시각을 건너뛰어 h_t를 한 번에 계산할 수 있다.",
        isCorrect: false,
        explanation: {
          basis: "그림 12-21 — 순차적인 계산",
          reason:
            "h_t를 얻으려면 h_(t−1)이 먼저 나와야 한다. 전개는 계산의 모양을 보여 줄 뿐 순차성을 없애지 않는다.",
        },
      },
    ],
  },
  {
    q: "하나의 문장을 구성하는 단어들을 각 시점에서의 입력으로 받아 그 문장의 감정을 파악하는 응용에 알맞은 RNN 구조는?",
    answer: 2,
    source: "변형",
    refs: {
      textbook: "12.4.1 — 입·출력 관계에 따른 RNN의 다양한 구조(그림 12-23)",
      slides: "응용 목적에 따른 RNN의 구조",
    },
    basis:
      "순차적으로 여러 개의 입력을 받은 후 최종적으로 하나의 결과를 생성하는 m:1 구조가 감정 분류와 온라인 필기 문자 인식에 사용된다.",
    examSkill: "입·출력 대응 관계와 응용의 짝 맞추기",
    choices: [
      {
        text: "1:1",
        isCorrect: false,
        explanation: {
          basis: "그림 12-23(a) — 기본 구조",
          reason: "시간 순서에 따라 확장하기 전의 기본 구조로, 입력 하나에 출력 하나가 대응한다.",
        },
      },
      {
        text: "1:m",
        isCorrect: false,
        explanation: {
          basis: "그림 12-23(b) — 이미지 설명·묘사(image captioning)",
          reason:
            "하나의 입력(이미지의 특징벡터)에 대해 여러 출력(단어들)을 만드는 구조다. 입력이 여럿인 감정 분류와 맞지 않는다.",
        },
      },
      {
        text: "m:1",
        isCorrect: true,
        explanation: {
          basis:
            "순차적으로 여러 개의 입력을 받은 후 최종적으로 하나의 결과를 생성할 때 활용된다. 예를 들어 감정 분류 또는 온라인 필기 문자 인식과 같은 응용에서 사용된다",
          reason:
            "단어를 시각마다 입력으로 받고, 마지막 시각에서 감정 하나를 출력한다. 온라인 필기 문자 인식도 같은 구조다.",
        },
      },
      {
        text: "m:n",
        isCorrect: false,
        explanation: {
          basis: "그림 12-23(d)(e) — 기계번역 · 프레임 수준의 비디오 분류",
          reason:
            "입력도 출력도 여럿인 구조다. 감정 분류는 출력이 문장당 하나이므로 해당하지 않는다.",
        },
      },
    ],
  },
  {
    q: "RNN에서 기울기 소멸 문제의 정도에 직접 영향을 주는 것은?",
    answer: 2,
    source: "변형",
    refs: {
      textbook: "12.4.2 — 식 12-14, timestep t",
      slides: "RNN 학습의 문제 — 시점 1에서 시점 t까지의 길이(timestep)",
    },
    basis:
      "역전파되는 기울기는 w φ′(·)가 (t−1)번 연속해서 곱해지는 형태이므로, 곱해지는 값의 개수 즉 timestep t가 커질수록 기울기가 기하급수적으로 작아진다.",
    examSkill: "기울기 소멸의 원인 — 곱해지는 값의 개수",
    choices: [
      {
        text: "은닉층의 개수",
        isCorrect: false,
        explanation: {
          basis: "RNN에서 기울기 소멸 문제는 층의 개수가 아닌 곱해지는 값의 개수에 영향을 받음",
          reason:
            "MLP에서는 층이 깊어질수록 문제가 되지만, RNN의 은닉층은 하나인데도 기울기 소멸이 일어난다. 묻는 지점이 바로 이 차이다.",
        },
      },
      {
        text: "출력층의 노드 수",
        isCorrect: false,
        explanation: {
          basis: "식 12-14는 ∂h_k/∂h_(k−1) 항들의 곱으로만 이루어진다",
          reason: "출력층의 크기는 이 곱의 항 개수와 무관하다.",
        },
      },
      {
        text: "시점 1에서 t까지의 길이(timestep)",
        isCorrect: true,
        explanation: {
          basis:
            "RNN의 계산에 참여하는 시점 1에서 t까지의 길이(이를 timestep t라고 부름)에 영향을 받는다는 것을 알 수 있다",
          reason:
            "∂h_t/∂h₁ = w^(t−1) ∏φ′ 이므로 곱해지는 항이 (t−1)개다. 길이가 20이면 19번 곱해지고, 한 칸의 곱이 0.72여도 결과는 0.002 수준으로 떨어진다.",
        },
      },
      {
        text: "학습 데이터의 개수 N",
        isCorrect: false,
        explanation: {
          basis: "L(W) = Σ L_i(W) — 데이터 수는 손실의 합산 범위를 정할 뿐이다",
          reason: "데이터가 많고 적음은 기울기가 곱으로 줄어드는 구조 자체를 바꾸지 않는다.",
        },
      },
    ],
  },
  {
    q: "기울기 폭발 문제의 해결 방법으로 제시된 것은?",
    answer: 1,
    source: "변형",
    refs: {
      textbook: "12.4.2 — 기울기 클리핑(gradient clipping)",
      slides: "RNN 학습의 문제 — 기울기 클리핑으로 해결 가능",
    },
    basis:
      "기울기 폭발 문제는 간단히 기울기 클리핑 방법으로 해결할 수 있다. 기울기가 주어진 임계치보다 크면 그 값을 일정 범위에 있도록 조정한다.",
    examSkill: "기울기 소멸의 대책(LSTM·GRU)과 기울기 폭발의 대책(클리핑) 구분",
    choices: [
      {
        text: "드롭아웃",
        isCorrect: false,
        explanation: {
          basis: "드롭아웃 — 학습 과정에서 가중치를 수정할 때 임의로 선택한 은닉 노드의 일부를 제외하는 방법",
          reason: "과다적합을 막는 기법이다. 기울기의 크기를 제한하는 것과는 다른 문제를 다룬다.",
        },
      },
      {
        text: "기울기 클리핑",
        isCorrect: true,
        explanation: {
          basis:
            "기울기 클리핑은 기울기가 일정한 값을 초과하지 않도록 그 크기를 제한하기 위해 주어진 임계치보다 크면 그 값을 일정 범위에 있도록 조정하는 방법",
          reason:
            "폭발한 기울기를 임계치 안으로 눌러 준다. 다만 0으로 사그라든 기울기를 되살리지는 못하므로 기울기 소멸의 대책은 아니다.",
        },
      },
      {
        text: "배치 정규화",
        isCorrect: false,
        explanation: {
          basis: "배치 정규화 — 각 노드의 활성화 함수로 들어가는 입력이 셀 포화를 발생하지 않는 범위 내에 존재하도록 정규화",
          reason: "느린 학습 문제를 다루는 기법으로, 교재에서 기울기 폭발의 해법으로 제시한 것이 아니다.",
        },
      },
      {
        text: "조기 종료",
        isCorrect: false,
        explanation: {
          basis: "조기 종료 — 과다적합이 발생하기 전에 학습을 종료하는 방법",
          reason: "학습을 언제 멈출지의 문제이지 기울기의 크기를 다루는 방법이 아니다.",
        },
      },
    ],
  },
  {
    q: "양방향 RNN에 대한 설명으로 적절하지 못한 것은?",
    answer: 2,
    source: "변형",
    refs: {
      textbook: "12.4.1 — 양방향 RNN(그림 12-24)",
      slides: "RNN 구조의 확장 — 양방향 bidirectional RNN",
    },
    basis:
      "전방향으로 처리하는 은닉층과 역방향으로 처리하는 은닉층은 계층 구조를 이루지 않으며 아무런 연결 관계도 존재하지 않는다. 계층 구조를 이루는 것은 다층 RNN이다.",
    examSkill: "다층 RNN과 양방향 RNN의 구분",
    choices: [
      {
        text: "2개의 은닉층으로 구성되어 하나는 입력을 전방향으로, 다른 하나는 역방향으로 처리한다.",
        isCorrect: false,
        explanation: {
          basis: "2개의 은닉층으로 구성되어 하나는 입력을 전방향으로 처리하고, 다른 하나는 역방향으로 입력을 처리한다",
          reason: "양방향 RNN의 정의 그대로다. 맞는 설명이다.",
        },
      },
      {
        text: "시간 t의 입력 x_t는 두 은닉층으로 동시에 주어진다.",
        isCorrect: false,
        explanation: {
          basis: "시간 t의 입력 x_t는 두 은닉층으로 동시에 주어져서 처리되어 결과가 출력층으로 제공된다",
          reason: "맞는 설명이다. 그래서 하나의 출력에 앞뒤 정보가 함께 반영된다.",
        },
      },
      {
        text: "두 은닉층은 계층 구조를 이루어 아래 은닉층의 출력이 위 은닉층의 입력이 된다.",
        isCorrect: true,
        explanation: {
          basis:
            "비록 2개의 은닉층이 사용되지만 입력에 대해 전방향으로 처리하는 은닉층과 역방향으로 처리하는 은닉층은 계층 구조를 이루지 않으며 아무런 연결 관계도 존재하지 않는다",
          reason:
            "아래 은닉층의 출력이 위 은닉층의 입력이 되는 것은 다층 RNN이다. 양방향 RNN의 두 은닉층은 서로 연결되지 않는다.",
        },
      },
      {
        text: "문장의 앞뒤 문맥이 모두 중요한 기계번역에서 많이 활용된다.",
        isCorrect: false,
        explanation: {
          basis: "해당 입력의 앞쪽에 있는 정보와 뒤쪽에 있는 정보를 모두 활용할 목적을 갖고, 문장의 앞뒤 문맥이 모두 중요한 기계번역에서 많이 활용된다",
          reason: "맞는 설명이다. 양방향 구조를 쓰는 이유 자체다.",
        },
      },
    ],
  },
  {
    q: "LSTM의 셀 상태 갱신식 c_t = c_(t−1) ⊙ f_t + i_t ⊙ c̃_t 에서 망각 게이트의 값 f_t = 0일 때 일어나는 일은?",
    answer: 0,
    source: "변형",
    refs: {
      textbook: "12.4.3 (1) — 식 12-15 · 12-18, 망각 게이트의 범위",
      slides: "LSTM 셀의 기능 — 망각 게이트",
    },
    basis:
      "f_t가 0이면 곱해진 값도 0이 되어 셀 상태의 정보를 완전히 잊어버리게 되고, 1이면 c_(t−1)이 주어진 그대로 활용된다. 셀 상태 정보의 범위는 [0, c_(t−1)]이다.",
    examSkill: "게이트 값의 양 끝에서 식이 어떻게 되는지 읽기",
    choices: [
      {
        text: "이전 셀 상태의 정보를 완전히 잊고, 새로 더해지는 i_t ⊙ c̃_t만 남는다.",
        isCorrect: true,
        explanation: {
          basis: "f_t가 0이면 곱해진 값도 0이 되어 셀 상태의 정보를 완전히 잊어버리게 된다",
          reason:
            "c_(t−1) ⊙ 0 = 0이므로 첫 항이 사라지고 c_t = i_t ⊙ c̃_t만 남는다. 망각 게이트가 ‘완전 망각’인 상태다.",
        },
      },
      {
        text: "이전 셀 상태가 그대로 유지된다.",
        isCorrect: false,
        explanation: {
          basis: "f_t가 1이면 c_(t−1)이 주어진 그대로 활용된다",
          reason: "그대로 유지되는 쪽은 f_t = 1, 곧 ‘완전 기억’일 때다.",
        },
      },
      {
        text: "새로운 정보의 추가가 막혀 c_t = c_(t−1)이 된다.",
        isCorrect: false,
        explanation: {
          basis: "셀 상태에 새로운 정보를 추가하는 정도를 조정하는 것은 입력 게이트 i_t다",
          reason: "새 정보를 막는 것은 i_t = 0일 때의 일이다. 두 게이트의 역할이 바뀌었다.",
        },
      },
      {
        text: "셀의 출력 h_t가 0이 되어 아무것도 출력하지 않는다.",
        isCorrect: false,
        explanation: {
          basis: "h_t = o_t ⊙ tanh(c_t) (식 12-20)",
          reason:
            "출력의 크기를 정하는 것은 출력 게이트 o_t다. f_t = 0이어도 i_t ⊙ c̃_t가 남아 있으면 h_t는 0이 아니다.",
        },
      },
    ],
  },
  {
    q: "GRU에서 갱신 게이트의 값 z_t = 0일 때의 출력 h_t는?",
    intro: "h_t = (1 − z_t) ⊙ h_(t−1) + z_t ⊙ h̃_t   (식 12-25)",
    answer: 1,
    source: "변형",
    refs: {
      textbook: "12.4.3 (2) — 식 12-25와 갱신 게이트의 역할",
      slides: "GRU 셀의 기능 — 출력 h_t 계산",
    },
    basis:
      "z_t = 0이면 (1 − z_t)·h_(t−1) = h_(t−1)이 되어 망각 게이트로서의 기능은 없고 오직 입력 게이트만 동작하여 h̃_t를 차단하는 효과가 있다.",
    examSkill: "갱신 게이트 하나가 두 역할을 겸하는 방식",
    choices: [
      {
        text: "h_t = h̃_t — 새로운 내용만 출력된다.",
        isCorrect: false,
        explanation: {
          basis: "z_t = 1이면 z_t·h̃_t = h̃_t가 된다",
          reason: "새 내용만 남는 것은 z_t = 1일 때다. 이때는 이전의 내용을 완전히 잊어버린다.",
        },
      },
      {
        text: "h_t = h_(t−1) — 이전의 출력이 그대로 유지된다.",
        isCorrect: true,
        explanation: {
          basis: "z_t = 0이면 (1 − z_t)·h_(t−1) = h_(t−1)이 되어 h̃_t를 차단하는 효과가 있다",
          reason:
            "(1 − 0)·h_(t−1) + 0·h̃_t = h_(t−1)이다. 잊는 기능은 작동하지 않고 새 내용만 막힌다.",
        },
      },
      {
        text: "h_t = 0 — 두 항이 모두 사라진다.",
        isCorrect: false,
        explanation: {
          basis: "식 12-25의 첫 항 계수는 (1 − z_t)이다",
          reason: "z_t가 0이면 첫 항의 계수는 0이 아니라 1이 된다. 1−z를 놓치면 나오는 오답이다.",
        },
      },
      {
        text: "h_t = h_(t−1) + h̃_t — 두 값이 그대로 더해진다.",
        isCorrect: false,
        explanation: {
          basis: "h_t = (1 − z_t) ⊙ h_(t−1) + z_t ⊙ h̃_t — 두 계수의 합이 1인 비율 배분",
          reason:
            "갱신 게이트는 두 값을 비율로 나누어 섞는다. 계수가 모두 1이 되는 경우는 없다.",
        },
      },
    ],
  },
  {
    q: "LSTM과 GRU에 대한 설명으로 적절하지 못한 것은?",
    answer: 3,
    source: "변형",
    refs: {
      textbook: "12.4.3 (2) — LSTM과 GRU의 마무리",
      slides: "GRU · 정리하기 — LSTM과 GRU",
    },
    basis:
      "LSTM과 GRU의 학습법도 기본 RNN과 동일하게 BPTT 기법을 사용하며, 게이트를 위해 추가된 모든 파라미터에 동일한 방식으로 유도된 학습식이 적용된다.",
    examSkill: "LSTM·GRU가 기본 RNN과 공유하는 것과 달라지는 것",
    choices: [
      {
        text: "GRU의 갱신 게이트는 LSTM의 입력 게이트와 망각 게이트를 합친 역할을 한다.",
        isCorrect: false,
        explanation: {
          basis: "LSTM 셀의 입력 게이트와 망각 게이트를 합친 것이 갱신 게이트이다",
          reason: "맞는 설명이다. 그래서 GRU는 게이트가 둘로 줄어든다.",
        },
      },
      {
        text: "기본 RNN에 비해 파라미터 수가 더 많아짐에도 불구하고 학습이 더 잘되는 것으로 알려져 있다.",
        isCorrect: false,
        explanation: {
          basis:
            "게이트를 이용하여 정보량이 조정됨으로써 신경망이 가지는 시간 의존성을 자유롭게 제어할 수 있고, 이는 오류 신호의 역방향 전달에서도 동일하게 적용된다",
          reason: "맞는 설명이다. 게이트가 기울기의 전달 경로도 함께 열어 준다.",
        },
      },
      {
        text: "LSTM은 메모리 게이트로 각 입력값이 영향을 미칠 수 있는 범위를 확장시켜 장기 의존성 문제를 해결한다.",
        isCorrect: false,
        explanation: {
          basis:
            "LSTM은 셀에 여러 종류의 메모리 게이트가 존재하여, 이를 통해 입력과 계산 결과를 선별적으로 허용하여 각 입력값이 영향을 미칠 수 있는 범위를 확장시켜 장기 의존성 문제를 해결한다",
          reason: "맞는 설명이다. 기울기 소멸 문제도 어느 정도 함께 해결된다.",
        },
      },
      {
        text: "LSTM과 GRU는 게이트 구조가 다르므로 BPTT가 아닌 별도의 학습 알고리즘을 사용한다.",
        isCorrect: true,
        explanation: {
          basis: "LSTM과 GRU의 학습법도 기본 RNN과 동일하게 BPTT 기법을 사용한다",
          reason:
            "게이트를 위해 추가된 모든 파라미터에도 동일한 방식으로 유도된 학습식이 적용된다. 셀의 내부가 복잡해졌을 뿐 학습의 틀은 그대로다.",
        },
      },
    ],
  },
];

export default function Lecture12Quiz() {
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
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {qi + 1}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      quiz.source === "공식 연습문제"
                        ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {quiz.source}
                  </span>
                  <span className="text-[11px] text-gray-400">{quiz.examSkill}</span>
                </div>

                {quiz.intro && (
                  <p className="mb-2 overflow-x-auto rounded-lg bg-gray-50 p-3 text-[12.5px] leading-6 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    {quiz.intro}
                  </p>
                )}
                <h4 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">{quiz.q}</h4>

                <div className="space-y-2">
                  {quiz.choices.map((choice, ci) => {
                    let style =
                      "border-gray-200 bg-gray-50 hover:bg-red-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-red-900/10";
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
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20"
        >
          <div>
            <p className="text-lg font-bold text-red-600 dark:text-red-300">
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
            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            <RotateCcw size={14} />
            다시 풀기
          </button>
        </motion.div>
      )}
    </section>
  );
}
