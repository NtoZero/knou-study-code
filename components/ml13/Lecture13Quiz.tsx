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
    q: "다음 딥러닝 모델 중 가장 많은 층을 갖는 것은?",
    answer: 2,
    source: "공식 연습문제",
    refs: { slides: "ILSVRC", textbook: "13.1.2 객체인식을 위한 CNN 모델" },
    basis:
      "ILSVRC 표의 층수는 AlexNet 8층, ZFNet 8층, VGG-19 19층, GoogLeNet 22층, ResNet 152층이다. 가장 많은 층을 가진 것은 ResNet이다.",
    examSkill: "모델별 층수 비교",
    choices: [
      {
        text: "VGG",
        isCorrect: false,
        explanation: {
          basis: "VGG(2014, 11/13/16/19층)",
          reason:
            "버전에 따라 11~19층이다. ILSVRC 표에 오른 VGG-19도 19층이므로 152층에는 미치지 못한다.",
        },
      },
      {
        text: "AlexNet",
        isCorrect: false,
        explanation: {
          basis: "AlexNet(2012, 8층) — 콘볼루션층 5개와 완전연결층 3개",
          reason: "8층으로 여기 나온 모델 중 가장 얕은 축에 속한다.",
        },
      },
      {
        text: "ResNet",
        isCorrect: true,
        explanation: {
          basis: "ResNet(2015, 152층, 스킵 연결, 잔차 모듈)",
          reason:
            "잔차 모듈과 스킵 연결로 깊은 모델의 학습을 가능하게 만들어, 층수를 152개까지 확장하는 데 성공했다. ILSVRC2015 우승 모델이며 Top-5 오류율은 3.57%다.",
        },
      },
      {
        text: "GoogLeNet",
        isCorrect: false,
        explanation: {
          basis: "GoogLeNet(2014, 22층, 인셉션 모듈)",
          reason:
            "22층으로 2014년까지는 가장 깊은 축이었으나 ResNet의 152층에는 크게 못 미친다. 깊이는 ResNet이, 파라미터 효율은 GoogLeNet이 앞선다.",
        },
      },
    ],
  },
  {
    q: "딥러닝 모델에 대한 설명으로 적절한 것은?",
    answer: 1,
    source: "공식 연습문제",
    refs: {
      textbook: "13.1.3 영상이해를 위한 딥러닝",
      slides: "YOLO · 영상설명모델 · R-CNN, Faster R-CNN",
    },
    basis:
      "YOLO는 객체 탐지와 인식을 한 번에 수행하므로 간단하고 빨라 실시간 동영상에서 사용 가능하다. Show and Tell은 다중 객체 검출이 아니라 영상설명 모델이다.",
    examSkill: "모델과 그 역할의 연결",
    choices: [
      {
        text: "Faster R-CNN은 영상과 자연어처리 기법이 결합된 모델이다.",
        isCorrect: false,
        explanation: {
          basis: "Faster R-CNN — 다중 객체 검출 모델, Region Proposal Network",
          reason:
            "영상과 자연어처리 기법이 결합된 모델은 Show and Tell(CNN + RNN)이다. Faster R-CNN은 영상 안에서 객체를 찾고 위치를 내는 검출 모델이다.",
        },
      },
      {
        text: "YOLO는 동영상에서 실시간 객체 검출이 가능하다.",
        isCorrect: true,
        explanation: {
          basis:
            "검출과 인식을 여러 번 반복하지 않고 한 번에 모두 이루어지도록 설계 → 간단하고 빠름 → 실시간 동영상에서 사용 가능",
          reason:
            "R-CNN 계열은 최대 2,000개의 관심 영역마다 인식을 수행해야 해서 동영상의 온라인 처리에 필요한 속도를 내지 못했다. YOLO는 영역 제안 없이 한 번에 처리해 그 속도를 얻었다.",
        },
      },
      {
        text: "Show and Tell은 다중 객체 검출을 위해 개발되었다.",
        isCorrect: false,
        explanation: {
          basis: "Show and Tell — 영상에 포함된 의미를 설명하는 자연어 문장을 생성하는 최초의 모델",
          reason:
            "다중 객체 검출은 R-CNN·Faster R-CNN·YOLO가 맡는다. Show and Tell의 출력은 박스가 아니라 문장이다.",
        },
      },
      {
        text: "AlexNet은 인셉션·잔차 모듈로 깊은 모델 학습을 가능하게 했다.",
        isCorrect: false,
        explanation: {
          basis: "인셉션 모듈 → GoogLeNet, 잔차 모듈 → ResNet",
          reason:
            "AlexNet은 콘볼루션층 5개와 완전연결층 3개를 가진 8층 모델로, 두 모듈 어느 것도 가지고 있지 않다.",
        },
      },
    ],
  },
  {
    q: "U-Net의 구조적 특징과 거리가 먼 것은?",
    answer: 3,
    source: "공식 연습문제",
    refs: {
      textbook: "13.1.4 영상변환 및 생성을 위한 딥러닝 — U-Net",
      slides: "오토인코더모델 — U-Net의 구조적 특징",
    },
    basis:
      "U-Net의 구조적 특징은 contracting path(인코더), expanding path(디코더), skip connection이다. generator와 discriminator는 GAN의 두 네트워크다.",
    examSkill: "U-Net과 GAN의 구성요소 구분",
    choices: [
      {
        text: "contraction path",
        isCorrect: false,
        explanation: {
          basis: "contracting path(“인코더”)",
          reason:
            "572 × 572 입력에서 시작해 층을 거치면서 점점 작아져 중간층의 28 × 28에 이르는 쪽이다. U-Net의 구조적 특징이 맞다. 문항은 contraction path로, 강의록 본문은 contracting path로 적는데 가리키는 것은 같다.",
        },
      },
      {
        text: "expanding path",
        isCorrect: false,
        explanation: {
          basis: "expanding path(“디코더”)",
          reason:
            "중간층에서 같은 방식을 되짚어 다시 확대되는 쪽이다. 마지막에 388 × 388의 분할 결과를 낸다. U-Net의 구조적 특징이 맞다.",
        },
      },
      {
        text: "skip connection",
        isCorrect: false,
        explanation: {
          basis:
            "중간층을 중심으로 대칭이 되는 입력 부분과 출력 부분 사이에 스킵 연결이 존재하는 일종의 잔차 모듈의 특성도 반영",
          reason:
            "인코더 쪽 특징맵을 잘라(copy and crop) 디코더 쪽에 붙인다. U-Net의 구조적 특징이 맞다.",
        },
      },
      {
        text: "generator & discriminator",
        isCorrect: true,
        explanation: {
          basis: "GAN은 생성기(Generator, G)와 판별기(Discriminator, D)로 구성된다",
          reason:
            "생성기와 판별기는 GAN의 두 네트워크다. U-Net은 오토인코더 계열이고 GAN은 생성 모델 계열이라 구성 자체가 다르다.",
        },
      },
    ],
  },
  {
    q: "딥러닝 모델과 기본 응용 분야의 연결로 적절한 것은?",
    answer: 3,
    source: "공식 연습문제",
    refs: {
      textbook: "13.1.3 영상이해를 위한 딥러닝 · 13.1.4 영상변환 및 생성을 위한 딥러닝",
      slides: "정리하기 — 영상이해를 위한 딥러닝 · 영상변환 및 생성을 위한 딥러닝",
    },
    basis:
      "Show and Tell은 영상을 자연어 문장으로 설명하는 영상설명(image description) 모델이다. U-Net은 분할, YOLO는 객체 검출에 쓰인다.",
    examSkill: "모델과 응용 분야의 짝짓기",
    choices: [
      {
        text: "U-Net – object recognition",
        isCorrect: false,
        explanation: {
          basis: "U-Net → 의료영상에 대한 영상분할을 위해 개발",
          reason:
            "U-Net의 출력은 클래스 레이블이 아니라 분할이 수행된 결과가 마스킹된 영상이다. image segmentation과 이어야 한다.",
        },
      },
      {
        text: "ResNet – image segmentation",
        isCorrect: false,
        explanation: {
          basis: "ResNet → ILSVRC2015 우승 모델, 객체인식",
          reason:
            "ResNet은 객체인식을 위한 CNN 모델이다. 영상분할에 해당하는 모델은 U-Net이다.",
        },
      },
      {
        text: "YOLO – image generation",
        isCorrect: false,
        explanation: {
          basis: "YOLO → 객체 탐지와 인식을 한 번에 수행",
          reason:
            "YOLO의 출력은 바운딩 박스와 클래스명이지 새로운 영상이 아니다. 영상생성을 위해 개발된 대표적인 모델은 GAN이다.",
        },
      },
      {
        text: "Show and Tell – image description",
        isCorrect: true,
        explanation: {
          basis:
            "영상에 포함된 의미를 종합적으로 이해하고 이를 설명하는 자연어 문장을 생성하는 최초의 모델",
          reason:
            "영상처리를 위한 CNN(GoogLeNet)과 문장생성을 위한 RNN(LSTM)이 결합된 구조로, 한 번에 한 단어씩 설명 문장을 만든다.",
        },
      },
    ],
  },
  {
    q: "GAN 모델의 설명 중 적절하지 못한 것은?",
    answer: 3,
    source: "공식 연습문제",
    refs: {
      textbook: "13.1.4 영상변환 및 생성을 위한 딥러닝 — (2) GAN 모델",
      slides: "GAN 모델 · GAN의 학습",
    },
    basis:
      "GAN은 생성기와 판별기를 번갈아 가면서 학습한다. 한쪽 학습을 완전히 끝낸 뒤 다른 쪽을 학습하는 방식이 아니다.",
    examSkill: "GAN 학습 순서",
    choices: [
      {
        text: "랜덤 노이즈로 영상을 생성한다.",
        isCorrect: false,
        explanation: {
          basis: "Generator(“생성기”, G) → 주어진 랜덤 입력으로부터 영상 생성",
          reason: "랜덤 노이즈 ~ N(0, 1)을 입력으로 받아 새로운 영상을 만든다. 맞는 설명이다.",
        },
      },
      {
        text: "학습 데이터는 생성 영상과 같은 도메인이다.",
        isCorrect: false,
        explanation: {
          basis: "먼저 생성하고자 하는 영상과 같은 도메인에 있는 영상들을 학습 데이터로 준비한다",
          reason:
            "숫자 영상을 생성하려면 숫자 영상 데이터를 준비한다. 판별기가 ‘진짜란 이런 것’을 배울 기준이 되기 때문이다. 맞는 설명이다.",
        },
      },
      {
        text: "생성기와 판별기는 상반된 목적을 갖는다.",
        isCorrect: false,
        explanation: {
          basis: "G와 D가 서로 상반된(adversarial) 학습을 번갈아 가면서 수행 → G는 D를 속이고, D는 G를 구분",
          reason:
            "판별기는 가짜에 0을, 생성기는 자기 출력에 판별기가 1을 내도록 학습한다. 목적이 정반대다. 맞는 설명이다.",
        },
      },
      {
        text: "생성기 학습 완료 후 판별기를 학습해야 효율적이다.",
        isCorrect: true,
        explanation: {
          basis: "D와 G를 번갈아 가면서 학습을 진행한다",
          reason:
            "한쪽을 끝까지 학습시키고 다른 쪽을 학습하는 방식이 아니다. 생성기가 조금 좋아지면 판별기도 그에 맞게 날카로워져야 다시 생성기에게 쓸모 있는 손실 신호를 줄 수 있다.",
        },
      },
    ],
  },
  {
    q: "컴퓨터비전 응용 중 입력과 출력이 모두 영상인 문제로 묶인 것은?",
    answer: 1,
    source: "변형",
    refs: {
      textbook: "13.1.1 컴퓨터비전 응용 — (1) 영상이해 · (2) 영상변환",
      slides: "(1) 영상이해 · (2) 영상변환",
    },
    basis:
      "영상변환은 영상이해와 달리 입력과 출력이 모두 영상이다. 의미적 영상분할과 초고해상도가 여기에 속한다.",
    examSkill: "입력·출력 기준의 응용 구분",
    choices: [
      {
        text: "객체인식 · 영상설명",
        isCorrect: false,
        explanation: {
          basis: "영상이해 → 추상적인 개념이나 정량적인 정보량을 출력",
          reason:
            "객체인식의 출력은 클래스 레이블, 영상설명의 출력은 자연어 문장이다. 둘 다 출력이 영상이 아니다.",
        },
      },
      {
        text: "의미적 영상분할 · 초고해상도",
        isCorrect: true,
        explanation: {
          basis: "영상변환 → 입력과 출력이 모두 영상",
          reason:
            "영상분할은 범주가 매겨진 영상을, 초고해상도는 고해상도로 복원된 영상을 출력한다. 둘 다 영상변환에 속한다.",
        },
      },
      {
        text: "객체의 위치 탐지 · 시각적 문답",
        isCorrect: false,
        explanation: {
          basis: "위치 탐지의 출력은 직사각형 박스, 시각적 문답의 출력은 자연어 대답",
          reason:
            "위치 탐지는 영상이해에, 시각적 문답은 다양한 입력 형태로의 확장에 속한다. 어느 쪽도 영상을 출력하지 않는다.",
        },
      },
      {
        text: "랜덤 노이즈에서의 영상생성 · 객체인식",
        isCorrect: false,
        explanation: {
          basis: "영상생성 → 출력으로 새로운 영상을 생성, 일종의 창작 과정",
          reason:
            "영상생성은 출력이 영상이지만 입력은 랜덤 노이즈나 자연어 문장이므로 ‘입력도 영상’이 아니다. 객체인식은 출력이 영상이 아니다.",
        },
      },
    ],
  },
  {
    q: "GoogLeNet의 인셉션 모듈에서 1 × 1 콘볼루션을 사용하는 이유는?",
    answer: 1,
    source: "변형",
    refs: {
      textbook: "13.1.2 객체인식을 위한 CNN 모델 — GoogLeNet",
      slides: "GoogLeNet — 인셉션 모듈",
    },
    basis:
      "강의록은 “1 × 1 콘볼루션 사용 → 차원 축소를 통해 계산 비용을 줄임”이라고 적는다. 3 × 3, 5 × 5 콘볼루션 앞에서 채널 수를 먼저 줄여 두는 역할이다.",
    examSkill: "인셉션 모듈의 설계 의도",
    choices: [
      {
        text: "특징맵의 가로·세로 크기를 절반으로 줄이기 위해",
        isCorrect: false,
        explanation: {
          basis: "인셉션 모듈의 네 갈래는 모두 28 × 28로 크기가 같다",
          reason:
            "가로·세로 크기를 줄이면 마지막에 채널 축으로 이어 붙일 수 없다. 풀링 갈래의 스트라이드를 s = 1로 둔 것도 크기를 유지하기 위해서다.",
        },
      },
      {
        text: "차원 축소를 통해 계산 비용을 줄이기 위해",
        isCorrect: true,
        explanation: {
          basis: "1 × 1 콘볼루션 사용 → 차원 축소를 통해 계산 비용을 줄임",
          reason:
            "3 × 3 갈래에서는 채널을 192에서 96으로, 5 × 5 갈래에서는 192에서 16으로 먼저 줄인 뒤 큰 필터를 적용한다. 출력 크기는 그대로인데 곱셈 횟수만 크게 줄어든다.",
        },
      },
      {
        text: "활성화 함수를 ReLU에서 시그모이드로 바꾸기 위해",
        isCorrect: false,
        explanation: {
          basis: "강의록·교재 어디에도 그런 설명은 없다",
          reason: "1 × 1 콘볼루션은 채널 방향의 가중합일 뿐, 활성화 함수의 선택과는 다른 이야기다.",
        },
      },
      {
        text: "스킵 연결을 만들어 기울기 소멸을 막기 위해",
        isCorrect: false,
        explanation: {
          basis: "스킵 연결은 ResNet의 잔차 모듈이 가진 특징이다",
          reason:
            "인셉션 모듈은 서로 다른 크기의 필터를 한 층에서 함께 쓰고 결합하는 구조이고, 스킵 연결은 ResNet의 것이다. 두 모듈을 섞지 않도록 주의해야 한다.",
        },
      },
    ],
  },
  {
    q: "ResNet의 잔차 모듈에 대한 설명으로 옳은 것은?",
    answer: 0,
    source: "변형",
    refs: {
      textbook: "13.1.2 객체인식을 위한 CNN 모델 — ResNet",
      slides: "ResNet — 잔차 모듈",
    },
    basis:
      "모듈의 출력은 2개 층을 거쳐 나온 출력 F(𝒙)에 원래 입력 𝒙가 더해져 결정된다. 즉 H(𝒙) = F(𝒙) + 𝒙이고, 학습해야 하는 정보는 출력 전체가 아니라 잔차 F(𝒙)다.",
    examSkill: "잔차 모듈의 출력 식과 학습 대상",
    choices: [
      {
        text: "모듈의 출력은 H(𝒙) = F(𝒙) + 𝒙이고, 학습 대상은 잔차 F(𝒙)이다.",
        isCorrect: true,
        explanation: {
          basis: "H(𝒙) = F(𝒙) + 𝒙 — 이 모듈에서 학습해야 하는 정보는 원하는 출력과 입력 간의 잔차",
          reason:
            "스킵 연결이 입력 𝒙를 그대로 건너뛰게 하므로, 각 모듈은 원하는 출력 전체가 아니라 입력과의 차이만 만들어 내면 된다.",
        },
      },
      {
        text: "모듈의 출력은 H(𝒙) = F(𝒙) − 𝒙이고, 입력을 빼서 잡음을 제거한다.",
        isCorrect: false,
        explanation: {
          basis: "H(𝒙) = F(𝒙) + 𝒙",
          reason:
            "부호가 반대다. F(𝒙) = H(𝒙) − 𝒙라는 식은 ‘잔차가 무엇인가’를 설명하는 식이지 모듈의 출력식이 아니다.",
        },
      },
      {
        text: "스킵 연결은 한 층을 뛰어넘어 바로 다음 층으로 이어진다.",
        isCorrect: false,
        explanation: {
          basis: "이 모듈은 2개 층을 뛰어넘는 스킵 연결을 가지고 있다",
          reason: "교재와 강의록 그림 모두 weight layer 두 개를 건너뛰는 연결을 보여 준다.",
        },
      },
      {
        text: "잔차 모듈을 쓰면 층수를 늘리지 않고도 성능이 올라간다.",
        isCorrect: false,
        explanation: {
          basis: "매우 깊은 층을 가진 네트워크도 성능 저하 없이 학습이 가능",
          reason:
            "잔차 모듈의 이점은 ‘층을 깊게 쌓아도 학습이 된다’는 것이다. ResNet은 바로 그 덕분에 152층까지 확장했다. 층수를 늘리지 않는 것과는 반대 방향이다.",
        },
      },
    ],
  },
  {
    q: "CIFAR-10 실험에서 56층 모델이 20층 모델보다 성능이 나빴던 까닭으로 가장 적절한 것은?",
    intro:
      "강의록은 10개 클래스, 32 × 32 크기, 학습 데이터 50,000개와 테스트 데이터 10,000개로 이루어진 CIFAR-10에서 20층과 56층을 비교한 결과를 보여 준다. 56층 모델은 학습오차와 테스트 오차가 모두 20층 모델보다 컸다.",
    answer: 1,
    source: "변형",
    refs: {
      textbook: "13.1.2 객체인식을 위한 CNN 모델 — 층수와 성능",
      slides: "층수와 성능?",
    },
    basis:
      "강의록은 “역전파 시 기울기 소멸 문제 등으로 인해 층수가 더 많음에도 불구하고 성능은 떨어짐”이라고 적는다. 교재도 층이 깊어지면 오류 역전파 학습이 점점 더 어려워지기 때문이라고 설명한다.",
    examSkill: "깊은 모델의 학습 실패와 과다적합의 구분",
    choices: [
      {
        text: "층이 많아 학습 데이터에 과다적합되었기 때문",
        isCorrect: false,
        explanation: {
          basis: "56층 모델은 학습오차도 20층 모델보다 컸다",
          reason:
            "과다적합이라면 학습오차는 오히려 더 작아지고 테스트 오차만 커져야 한다. 두 오차가 함께 커졌다는 것은 애초에 학습 자체가 잘 되지 않았다는 뜻이다.",
        },
      },
      {
        text: "역전파 시 기울기 소멸 등으로 학습 자체가 어려워졌기 때문",
        isCorrect: true,
        explanation: {
          basis: "역전파 시 기울기 소멸 문제 등으로 인해 층수가 더 많음에도 불구하고 성능은 떨어짐",
          reason:
            "층이 깊어지면 오류 역전파 학습이 점점 더 어려워지므로, 반드시 층수에 비례하여 성능이 향상된다고 볼 수는 없다. 이 문제를 극복한 것이 ResNet의 잔차 모듈이다.",
        },
      },
      {
        text: "CIFAR-10의 영상 크기가 32 × 32로 너무 작기 때문",
        isCorrect: false,
        explanation: {
          basis: "20층 모델과 56층 모델은 같은 데이터로 학습했다",
          reason:
            "데이터가 같으므로 데이터의 성질로는 두 모델의 차이를 설명할 수 없다. 달라진 것은 층수뿐이다.",
        },
      },
      {
        text: "클래스가 10개뿐이라 모델의 표현력이 남아돌았기 때문",
        isCorrect: false,
        explanation: {
          basis: "강의록·교재 어디에도 그런 설명은 없다",
          reason:
            "표현력이 남아도는 것이 문제라면 학습오차는 0에 가까워야 한다. 실제로는 학습오차부터 컸다.",
        },
      },
    ],
  },
  {
    q: "YOLO의 출력이 7 × 7 × 30 텐서가 되는 구성으로 옳은 것은?",
    intro:
      "교재 그림의 설정에서 그리드는 7 × 7이고, 그리드 칸마다 바운딩 박스 2개를 예측하며 클래스는 20개다. 바운딩 박스 하나는 x, y, w, h, c의 5개 값으로 표현된다.",
    answer: 2,
    source: "변형",
    refs: {
      textbook: "13.1.3 영상이해를 위한 딥러닝 — YOLO 모델의 구조와 출력값 정의",
      slides: "YOLO — Tensor values interpretation",
    },
    basis:
      "칸 하나가 들고 있는 값은 5 × 2 + 20 = 30개이고, 칸이 7 × 7 = 49개이므로 출력은 7 × 7 × 30 = 1470이다. 교재 그림의 완전연결층 출력도 1470 × 1이다.",
    examSkill: "출력 텐서의 구성 계산",
    choices: [
      {
        text: "(7 × 7) 칸 × (박스 2개 + 클래스 20개 + 신뢰도 8개)",
        isCorrect: false,
        explanation: {
          basis: "바운딩 박스 하나가 x, y, w, h, c의 5개 값을 가진다",
          reason:
            "신뢰도 c는 박스마다 하나씩 붙어 이미 5개 값 안에 들어 있다. 따로 떼어 더하면 중복이다.",
        },
      },
      {
        text: "(7 × 7) 칸 × (박스 2개 × 4개 좌표 + 클래스 20개)",
        isCorrect: false,
        explanation: {
          basis: "x, y, w, h, c — 박스 하나는 좌표 4개가 아니라 값 5개",
          reason:
            "박스 신뢰도 c를 빠뜨린 구성이다. 2 × 4 + 20 = 28이어서 칸 하나가 30개 값을 가지지 못하고, 7 × 7 × 28 = 1372로 1470에도 미치지 못한다.",
        },
      },
      {
        text: "(7 × 7) 칸 × (5 × 박스 2개 + 클래스 20개)",
        isCorrect: true,
        explanation: {
          basis: "two bboxes for each grid cell — x, y, w, h, c / 20 = number of classes",
          reason:
            "5 × 2 + 20 = 30이고 7 × 7 × 30 = 1470이다. 교재 그림에서 완전연결층의 출력 벡터가 1470 × 1이고 이를 7 × 7 × 30으로 reshape한다.",
        },
      },
      {
        text: "(7 × 7) 칸 × (클래스 20개 × 박스 2개 − 10)",
        isCorrect: false,
        explanation: {
          basis: "클래스 점수는 칸마다 20개이지 박스마다 20개가 아니다",
          reason:
            "클래스 점수는 그리드 칸 하나에 20개가 붙는다. 박스 수를 곱하는 구성이 아니다.",
        },
      },
    ],
  },
  {
    q: "기본 오토인코더가 일종의 비지도학습을 수행하는 모델이라고 보는 이유는?",
    answer: 1,
    source: "변형",
    refs: {
      textbook: "13.1.4 영상변환 및 생성을 위한 딥러닝 — (1) 오토인코더 모델",
      slides: "오토인코더모델 — 기본 구조",
    },
    basis:
      "입력과 출력이 기본적으로 같은 영상이므로 클래스 레이블과 같은 목표 출력을 따로 만들어 줄 필요가 없다. 그래서 기본 오토인코더는 일종의 비지도학습을 수행하는 모델로 본다.",
    examSkill: "오토인코더의 목표 출력",
    choices: [
      {
        text: "학습 데이터를 쓰지 않고 랜덤 입력만으로 학습하기 때문",
        isCorrect: false,
        explanation: {
          basis: "오토인코더의 입력은 𝑥이고 출력 𝑥′가 𝑥와 같아지도록 학습한다",
          reason:
            "학습 데이터는 그대로 쓴다. 랜덤 입력으로부터 영상을 만드는 것은 GAN의 생성기다.",
        },
      },
      {
        text: "입력 자신이 목표 출력이 되어 레이블을 따로 만들 필요가 없기 때문",
        isCorrect: true,
        explanation: {
          basis:
            "입력과 출력이 기본적으로 같은 영상이므로 클래스 레이블과 같은 목표 출력을 따로 만들어 줄 필요가 없다",
          reason:
            "레이블링 비용이 들지 않는다는 점이 핵심이다. 다만 영상분할이나 영상변환을 위한 목적으로 사용하는 경우에는 목표 출력값이 필요하다.",
        },
      },
      {
        text: "중간층의 크기가 입력보다 작아 정보가 손실되기 때문",
        isCorrect: false,
        explanation: {
          basis: "중간층의 크기는 입력에 비해 작아지도록 설계한다",
          reason:
            "중간층을 작게 두는 것은 축약된 특징 𝑧를 얻기 위해서다. 지도·비지도를 가르는 기준은 목표 출력값이 주어지는가이지 중간층의 크기가 아니다.",
        },
      },
      {
        text: "인코더와 디코더가 서로 상반된 목적으로 경쟁하기 때문",
        isCorrect: false,
        explanation: {
          basis: "서로 상반된(adversarial) 학습은 GAN의 생성기와 판별기가 하는 것이다",
          reason:
            "인코더와 디코더는 경쟁하지 않는다. 𝑥′가 𝑥와 같아진다는 하나의 목적을 향해 함께 학습한다.",
        },
      },
    ],
  },
];

export default function Lecture13Quiz() {
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
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {qi + 1}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      quiz.source === "공식 연습문제"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
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
                      "border-gray-200 bg-gray-50 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-blue-900/10";
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
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20"
        >
          <div>
            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
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
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <RotateCcw size={14} />
            다시 풀기
          </button>
        </motion.div>
      )}
    </section>
  );
}
