"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

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
};

const QUIZZES: Quiz[] = [
  {
    q: "군집화에 대한 설명으로 적합한 것은?",
    answer: 0,
    source: "공식 연습문제",
    basis: "강의록 4강 군집화의 개념 — 분류 vs 군집화, 군집화의 입출력 관계",
    examSkill: "지도학습과 비지도학습을 목표 출력값의 유무로 가르는 판단",
    choices: [
      {
        text: "학습 데이터에는 목표 출력값이 포함되지 않는다.",
        isCorrect: true,
        explanation: {
          basis: "군집화의 학습 데이터 집합은 D = {xᵢ} i=1…N",
          reason:
            "군집화는 클래스 관련 정보, 즉 바람직한 출력에 대한 정보 없이 입력 데이터만 주어지는 문제다. 학습 데이터에 목표 출력값이 포함되지 않는다는 서술이 군집화의 정의와 정확히 일치한다.",
        },
      },
      {
        text: "K-Nearest Neighbor 방법을 사용한다.",
        isCorrect: false,
        explanation: {
          basis: "군집화의 대표적 적용 방법 — K-평균 군집화, 계층적 군집화, 가우시안 혼합 모델",
          reason:
            "K-최근접이웃은 이웃한 데이터의 클래스 레이블로 판정하는 지도학습 분류기다. 이름에 K가 들어간다는 점이 K-평균과 닮았을 뿐, 군집화에 사용하는 방법으로 제시된 적이 없다.",
        },
      },
      {
        text: "데이터 시각화에 적용할 수 있다.",
        isCorrect: false,
        explanation: {
          basis: "군집화의 응용 — 장면 영상 데이터의 군집화, 영상 화소의 군집화에 의한 영상분할",
          reason:
            "군집화의 응용으로 제시된 것은 영상 데이터 그룹핑과 영상분할이다. 데이터 시각화에는 특징추출 방법인 t-SNE가 주로 사용되므로, 시각화를 군집화의 적용으로 드는 것은 적합하지 않다.",
        },
      },
      {
        text: "지도학습을 사용한다.",
        isCorrect: false,
        explanation: {
          basis: "분류는 지도학습, 군집화는 비지도학습",
          reason:
            "목표 출력값이 있느냐 없느냐에 따라 사용할 수 있는 학습 방법이 갈린다. 군집화는 목표 출력값이 없으므로 지도학습이 아니라 비지도학습을 사용한다.",
        },
      },
    ],
  },
  {
    q: "K-평균 알고리즘의 군집화 수행 결과를 표현하는 방법은?",
    answer: 1,
    source: "공식 연습문제",
    basis: "강의록 4강 K-평균 군집화 알고리즘 — 학습 결과는 각 그룹에 속하는 데이터들의 평균, 즉 대표 벡터",
    examSkill: "군집화 일반의 세 가지 학습 결과 중 K-평균이 만들어 내는 것을 가려내는 판단",
    choices: [
      {
        text: "서로소인 K개의 부분집합",
        isCorrect: false,
        explanation: {
          basis: "군집화의 학습 결과 ① 서로소인 부분집합 Dᵢ",
          reason:
            "서로소인 부분집합은 군집화 일반의 학습 결과 표현 중 하나이지, 평균 정보를 활용하는 K-평균이 계산해 내는 결과를 가리키는 표현은 아니다.",
        },
      },
      {
        text: "각 클러스터의 대표 벡터",
        isCorrect: true,
        explanation: {
          basis: "m_k^new = (1/|C_k|) Σ_{xⱼ∈C_k} xⱼ",
          reason:
            "K-평균은 각 그룹에 속하는 데이터들의 평균을 구하며, 이 평균이 곧 대표 벡터다. 알고리즘이 반복을 마치고 남기는 학습 결과가 바로 이 대표 벡터의 집합이다.",
        },
      },
      {
        text: "각 군집의 확률분포",
        isCorrect: false,
        explanation: {
          basis: "군집화의 학습 결과 ③ 각 클러스터의 확률분포",
          reason:
            "확률분포로 표현하는 것은 가우시안 혼합 모델처럼 분포를 추정하는 방법의 결과다. K-평균은 분포의 모수를 추정하지 않고 평균만 계산한다.",
        },
      },
      {
        text: "각 부분집합의 최솟값 또는 최댓값",
        isCorrect: false,
        explanation: {
          basis: "K-평균 군집화 = 평균 정보를 활용하여 K개의 그룹으로 묶는 알고리즘",
          reason:
            "최솟값·최댓값은 군집화의 학습 결과로 제시된 세 가지 어디에도 해당하지 않는다. 최솟값·최댓값을 쓰는 것은 계층적 군집화의 최단·최장연결법에서 군집 간 거리를 계산할 때이며, K-평균의 학습 결과와는 무관하다.",
        },
      },
    ],
  },
  {
    q: "K-평균 방법에 대한 설명으로 적절하지 못한 것은?",
    answer: 2,
    source: "공식 연습문제",
    basis: "강의록 4강 알고리즘의 특성 ⑶ — 적절한 K값의 선정은 주어진 문제에 지극히 의존",
    examSkill: "학습으로 정해지는 값과 학습 전에 사람이 정하는 값의 구분",
    choices: [
      {
        text: "군집화 문제에 사용된다.",
        isCorrect: false,
        explanation: {
          basis: "K-평균 군집화 K-means clustering",
          reason:
            "K-평균은 주어진 데이터 집합을 K개의 그룹으로 묶는 군집화 알고리즘이며, 군집화의 대표적 적용 방법으로 제시된다. 적절한 설명이므로 정답이 아니다.",
        },
      },
      {
        text: "화소를 데이터로 취급해 비슷한 화소를 그룹으로 묶는 영상 문제에 적용할 수 있다.",
        isCorrect: false,
        explanation: {
          basis: "영상 화소의 군집화에 의한 영상분할",
          reason:
            "영상의 각 화소를 하나의 데이터로 취급하고 색상값의 유사성에 따라 영역을 나누는 영상분할이 군집화 적용의 예로 제시되어 있다. 적절한 설명이므로 정답이 아니다.",
        },
      },
      {
        text: "K는 학습을 통해 결정되는 군집의 개수이다.",
        isCorrect: true,
        explanation: {
          basis: "⑶ 데이터에 의존하는 적절한 K값을 어떻게 선택할 것인가",
          reason:
            "K는 학습을 통해 결정되는 값이 아니라, 학습을 시작하기 전에 문제의 성격에 따라 사람이 정하는 값이다. 군집의 개수가 학습 결과로 얻어진다는 서술이 틀렸으므로 이 선택지가 '적절하지 못한 것'이다.",
        },
      },
      {
        text: "비지도학습을 사용한다.",
        isCorrect: false,
        explanation: {
          basis: "군집화는 목표 출력값이 없으므로 비지도학습 수행",
          reason:
            "K-평균은 목표 출력값 없이 입력 데이터만으로 그룹을 나누므로 비지도학습에 해당한다. 적절한 설명이므로 정답이 아니다.",
        },
      },
    ],
  },
  {
    q: "K-means 알고리즘에 대한 설명으로 적절한 것은?",
    answer: 3,
    source: "공식 연습문제",
    basis: "강의록 4강 알고리즘의 특성 ⑴⑵ — 지역 극소점 보장, 초기값 의존성",
    examSkill: "K-평균이 보장하는 것과 보장하지 못하는 것의 구분",
    choices: [
      {
        text: "목적함수의 전역 극소점을 항상 찾는다.",
        isCorrect: false,
        explanation: {
          basis: "K-평균은 목적함수 J를 극소화하는 지역 극소점을 찾는 것을 보장",
          reason:
            "한 번 반복할 때마다 J가 줄어드는 방향은 보장되지만, 전체 공간에서 가장 작은 전역 극소점에 도달하는지는 시작점에 달려 있다. '항상 찾는다'는 서술이 이 보장의 범위를 넘어선다.",
        },
      },
      {
        text: "n개 데이터에 대해 n개 군집으로 시작한다.",
        isCorrect: false,
        explanation: {
          basis: "① 시작(초기화) — 임의로 K개의 벡터를 선택하여 K개의 초기 대표 벡터 집합 생성",
          reason:
            "n개 데이터를 n개 군집으로 두고 시작하는 것은 계층적 군집화의 병합적 방법이다. K-평균은 데이터 개수와 무관하게 K개의 초기 대표 벡터에서 시작한다.",
        },
      },
      {
        text: "초기 대표 벡터와 무관하게 항상 같은 결과를 낸다.",
        isCorrect: false,
        explanation: {
          basis: "⑵ 초기값에 대한 의존성 문제 — 초기에 임의로 결정하는 대표 벡터에 따라 최종적인 결과가 달라짐",
          reason:
            "같은 데이터라도 초기 대표 벡터에 따라 한쪽은 7번, 다른 쪽은 2번 반복 후 수렴하며, 심한 경우 적절한 클러스터를 찾지 못하기도 한다. 초기값과 무관하다는 서술이 사실과 반대다.",
        },
      },
      {
        text: "데이터 그룹핑과 대표 벡터 수정 과정을 반복한다.",
        isCorrect: true,
        explanation: {
          basis: "수행 단계 ①초기화 – ②데이터 그룹핑 – ③대표 벡터 수정 – ④반복 여부 결정",
          reason:
            "K-평균은 ②데이터 그룹핑과 ③대표 벡터 수정을, 대표 벡터의 변화가 없거나 설정된 반복 횟수에 도달할 때까지 반복한다. 알고리즘의 핵심 구조를 그대로 서술한 선택지다.",
        },
      },
    ],
  },
  {
    q: "{A, B, C, D} 4개의 데이터에 병합적 계층 군집화를 적용할 때 초기 군집 개수는?",
    answer: 3,
    source: "공식 연습문제",
    basis: "강의록 4강 병합적 방법의 수행 단계 ① — 각 데이터가 각각의 군집이 되도록 N개의 군집을 설정",
    examSkill: "병합적 방법의 시작 상태와 종료 상태를 구분하는 판단",
    choices: [
      {
        text: "1",
        isCorrect: false,
        explanation: {
          basis: "분할적 방법은 모든 데이터가 하나의 군집에 속하는 최대 군집에서 시작",
          reason:
            "군집 1개에서 출발하는 것은 분할적 방법이다. 병합적 방법에서 군집이 1개가 되는 것은 모든 병합이 끝난 마지막 상태이지 시작 상태가 아니다.",
        },
      },
      {
        text: "2",
        isCorrect: false,
        explanation: {
          basis: "덴드로그램에서 거리 3~6 구간의 클러스터 개수가 2",
          reason:
            "2는 이 예제의 덴드로그램을 잘라 읽어 낸 적절한 군집의 수이지, 알고리즘이 출발하는 시점의 군집 개수가 아니다.",
        },
      },
      {
        text: "3",
        isCorrect: false,
        explanation: {
          basis: "N개의 데이터 → (N − 1)번의 병합 과정 수행",
          reason:
            "3개는 C_A와 C_B가 한 번 병합되어 C_AB가 만들어진 뒤의 상태다. 병합이 한 번이라도 일어난 뒤의 개수이므로 초기 군집 개수가 아니다.",
        },
      },
      {
        text: "4",
        isCorrect: true,
        explanation: {
          basis: "C_A, C_B, C_C, C_D 네 개의 군집으로 출발",
          reason:
            "병합적 방법은 각 데이터가 각각의 군집이 되도록 N개의 군집 C₁,…,C_N을 설정하고 시작한다. 데이터가 4개이므로 초기 군집도 4개다.",
        },
      },
    ],
  },
  {
    q: "K-평균 군집화 알고리즘의 수행 단계를 순서대로 바르게 나열한 것은?",
    answer: 1,
    source: "변형",
    basis: "강의록 4강 K-평균 군집화 알고리즘 — 수행 단계",
    examSkill: "반복 구간(②~③)과 그 바깥에 있는 단계를 구분하는 판단",
    choices: [
      {
        text: "시작(초기화) → 대표 벡터 수정 → 데이터 그룹핑 → 반복 여부 결정",
        isCorrect: false,
        explanation: {
          basis: "② 데이터 그룹핑 뒤에 ③ 대표 벡터 수정",
          reason:
            "대표 벡터를 먼저 수정하려면 각 클러스터에 어떤 데이터가 속하는지 이미 정해져 있어야 한다. 그룹핑 전에는 평균을 계산할 대상 자체가 없으므로 두 단계의 순서가 뒤바뀌었다.",
        },
      },
      {
        text: "시작(초기화) → 데이터 그룹핑 → 대표 벡터 수정 → 반복 여부 결정",
        isCorrect: true,
        explanation: {
          basis: "①시작(초기화) – ②데이터 그룹핑 – ③대표 벡터 수정 – ④반복 여부 결정",
          reason:
            "초기 대표 벡터를 만든 뒤 각 데이터를 가장 가까운 대표 벡터로 묶고, 그 결과로 평균을 갱신한 다음 반복 여부를 판단한다. 강의록의 네 단계 순서와 일치한다.",
        },
      },
      {
        text: "데이터 그룹핑 → 시작(초기화) → 반복 여부 결정 → 대표 벡터 수정",
        isCorrect: false,
        explanation: {
          basis: "① 시작(초기화)에서 K개의 초기 대표 벡터를 생성",
          reason:
            "그룹핑은 대표 벡터와의 거리를 계산하는 단계이므로 초기화보다 앞설 수 없다. 초기화가 두 번째에 놓인 순간 알고리즘이 성립하지 않는다.",
        },
      },
      {
        text: "시작(초기화) → 반복 여부 결정 → 데이터 그룹핑 → 대표 벡터 수정",
        isCorrect: false,
        explanation: {
          basis: "④ 반복 여부 결정 — 수정 전후 대표 벡터의 차이를 계산",
          reason:
            "반복 여부는 수정 전 m_k와 수정 후 m_k^new의 차이를 보고 판단하므로, 대표 벡터 수정이 끝난 뒤에만 내릴 수 있다. 반복 여부 결정이 두 번째에 오는 순서는 성립하지 않는다.",
        },
      },
    ],
  },
  {
    q: "K-평균 군집화의 목적함수 J = Σₙ Σᵢ r_ni ‖xₙ − mᵢ‖² 에 대한 설명으로 옳은 것은?",
    answer: 1,
    source: "변형",
    basis: "강의록 4강 알고리즘의 특성 ⑴ — 목적함수 J와 J 값의 해석",
    examSkill: "목적함수 값의 크기와 클러스터 결집 정도의 대응 관계 해석",
    choices: [
      {
        text: "J가 클수록 각 클러스터 내의 데이터들이 잘 결집되어 있다.",
        isCorrect: false,
        explanation: {
          basis: "J ↑ → 각 클러스터 내의 데이터들이 서로 뭉쳐 있지 않음",
          reason:
            "J가 크다는 것은 데이터와 대표 벡터 사이의 거리 제곱합이 크다는 뜻이므로 데이터가 퍼져 있다는 의미다. 결집 정도와의 대응이 정반대로 서술되어 있다.",
        },
      },
      {
        text: "J는 각 클러스터의 분산을 모두 더한 값이며, J가 작을수록 클러스터 내 데이터들이 잘 결집되어 있다.",
        isCorrect: true,
        explanation: {
          basis: "각 클러스터 Cᵢ의 분산을 모두 더한 값 / J ↓ → 데이터들이 잘 결집",
          reason:
            "J는 각 클러스터에 속한 데이터와 그 대표 벡터 사이 거리의 제곱을 모두 더한 값, 즉 클러스터별 분산의 합이다. 값이 작을수록 각 클러스터 안에서 데이터가 잘 모여 있다는 해석이 그대로 맞다.",
        },
      },
      {
        text: "J는 클러스터 사이의 거리를 모두 더한 값이다.",
        isCorrect: false,
        explanation: {
          basis: "J = Σₙ Σᵢ r_ni ‖xₙ − mᵢ‖²",
          reason:
            "식에 들어가는 거리는 데이터 xₙ과 자신이 속한 클러스터의 대표 벡터 mᵢ 사이의 거리다. 서로 다른 클러스터 사이의 거리는 이 식에 등장하지 않는다.",
        },
      },
      {
        text: "r_ni는 데이터 xₙ이 클러스터 Cᵢ에 속할 확률을 나타낸다.",
        isCorrect: false,
        explanation: {
          basis: "r_ni = 1 if i = argminⱼ‖xₙ − mⱼ‖², else 0",
          reason:
            "r_ni는 가장 가까운 대표 벡터일 때 1, 아니면 0을 갖는 값이다. 0과 1 두 값만 가지므로 확률이 아니라 클러스터 레이블을 나타내는 지시값이다.",
        },
      },
    ],
  },
  {
    q: "목적함수 J를 최소화하는 두 가지 관점에 대한 설명으로 옳지 않은 것은?",
    answer: 3,
    source: "변형",
    basis: "강의록 4강 — mᵢ 고정 시 r_ni 결정, r_ni 고정 시 mᵢ 수정",
    examSkill: "목적함수 최적화의 두 관점을 K-평균의 두 단계와 짝짓는 판단",
    choices: [
      {
        text: "mᵢ가 고정되어 있을 때 r_ni를 결정하는 과정은 K-평균의 그룹핑 과정과 같다.",
        isCorrect: false,
        explanation: {
          basis: "경우 1 ⇒ K-평균 알고리즘의 그룹핑 과정",
          reason:
            "대표 벡터가 고정된 상태에서 J를 최소화하려면 각 데이터를 가장 가까운 대표 벡터에 배정해야 하며, 이것이 곧 그룹핑이다. 옳은 설명이므로 정답이 아니다.",
        },
      },
      {
        text: "r_ni가 고정되어 있을 때 ∂J/∂mᵢ = 0을 풀면 mᵢ = Σₙ r_ni xₙ / Σₙ r_ni가 된다.",
        isCorrect: false,
        explanation: {
          basis: "∂J/∂mᵢ = 0 ⇒ mᵢ = Σₙ r_ni xₙ / Σₙ r_ni",
          reason:
            "클러스터 레이블이 고정된 상태에서 J를 mᵢ로 편미분해 0으로 두면 그대로 이 식이 나온다. 강의록의 유도와 일치하므로 정답이 아니다.",
        },
      },
      {
        text: "Σₙ r_ni는 i번째 클러스터에 속하는 데이터의 개수를 의미한다.",
        isCorrect: false,
        explanation: {
          basis: "r_ni는 속하면 1, 아니면 0",
          reason:
            "0과 1만 갖는 값을 모든 데이터에 대해 더하면 그 클러스터에 속하는 데이터의 개수가 된다. 옳은 설명이므로 정답이 아니다.",
        },
      },
      {
        text: "r_ni가 고정되어 있을 때 mᵢ를 구하는 과정은 K-평균의 그룹핑 과정과 같다.",
        isCorrect: true,
        explanation: {
          basis: "경우 2 ⇒ K-평균 알고리즘의 대표 벡터 수정식",
          reason:
            "클러스터 레이블이 고정된 상태에서 mᵢ를 구하면 평균 벡터가 나오므로, 이는 그룹핑이 아니라 ③대표 벡터 수정식에 대응한다. 두 관점의 짝이 뒤바뀌었으므로 옳지 않은 설명이다.",
        },
      },
    ],
  },
  {
    q: "계층적 군집화의 분할적 방법에서 N개로 이루어진 하나의 군집을 두 군집으로 분할하는 경우의 수는?",
    answer: 1,
    source: "변형",
    basis: "강의록 4강 계층적 군집화 알고리즘 — 분할적 방법(divisive, top-down)",
    examSkill: "분할적 방법이 비실용적이라고 평가되는 근거를 식으로 확인",
    choices: [
      {
        text: "N − 1",
        isCorrect: false,
        explanation: {
          basis: "N개의 데이터 → (N − 1)번의 병합 과정",
          reason:
            "N − 1은 병합적 방법에서 하나의 군집이 될 때까지 수행하는 병합 횟수다. 분할 경우의 수가 아니라 병합 횟수를 묻는 값이므로 자리가 다르다.",
        },
      },
      {
        text: "2^(N−1) − 1",
        isCorrect: true,
        explanation: {
          basis: "N개로 이루어진 하나의 군집을 두 군집으로 분할하는 경우의 수 → (2^(N−1) − 1)개",
          reason:
            "N이 조금만 커져도 값이 폭발적으로 늘어나 모든 경우를 따지는 것이 사실상 불가능해진다. 분할적 방법을 비실용적이라고 평가하는 근거가 되는 식이다.",
        },
      },
      {
        text: "N(N−1)/2",
        isCorrect: false,
        explanation: {
          basis: "② 가능한 모든 군집 쌍에 대해 군집 간의 거리를 계산",
          reason:
            "N(N−1)/2는 N개 군집에서 만들 수 있는 군집 쌍의 개수, 즉 거리 행렬에서 계산해야 할 칸의 수다. 분할 경우의 수와는 다른 값이다.",
        },
      },
      {
        text: "2^N",
        isCorrect: false,
        explanation: {
          basis: "(2^(N−1) − 1)개",
          reason:
            "N개 원소의 부분집합 전체 개수가 2^N이지만, 두 군집으로 나누는 분할은 어느 쪽을 먼저 세든 같은 분할이고 한쪽이 비는 경우도 제외해야 한다. 그 보정을 거치면 2^(N−1) − 1이 된다.",
        },
      },
    ],
  },
  {
    q: "병합적 방법으로 N개의 데이터를 하나의 군집이 될 때까지 병합할 때 수행되는 병합 횟수는?",
    answer: 1,
    source: "변형",
    basis: "강의록 4강 계층적 군집화 알고리즘 — 병합적 방법(agglomerative, bottom-up)",
    examSkill: "한 번 병합할 때마다 군집이 하나씩 줄어든다는 구조의 파악",
    choices: [
      {
        text: "N",
        isCorrect: false,
        explanation: {
          basis: "N개의 군집에서 시작해 1개가 될 때까지",
          reason:
            "N번 병합하면 군집이 0개가 되어야 하는데 그런 상태는 없다. 시작이 N개, 끝이 1개이므로 병합 횟수는 N보다 하나 적다.",
        },
      },
      {
        text: "N − 1",
        isCorrect: true,
        explanation: {
          basis: "N개의 데이터 → (N − 1)번의 병합 과정 수행",
          reason:
            "한 번 병합할 때마다 클러스터가 하나씩 줄어들므로, N개에서 1개가 되려면 정확히 N − 1번의 병합이 필요하다. 데이터 4개인 강의록 예제에서도 병합이 3번 일어난다.",
        },
      },
      {
        text: "log₂N",
        isCorrect: false,
        explanation: {
          basis: "⑤ 오직 하나의 클러스터가 남을 때까지 ②~⑤ 반복",
          reason:
            "매 단계에서 군집 수가 절반으로 줄어드는 것이 아니라 한 쌍씩만 병합되어 하나씩 줄어든다. 절반씩 줄어드는 구조를 가정한 값이라 맞지 않는다.",
        },
      },
      {
        text: "N(N−1)/2",
        isCorrect: false,
        explanation: {
          basis: "② 가능한 모든 군집 쌍에 대해 거리를 계산",
          reason:
            "N(N−1)/2는 첫 단계에서 거리를 계산해야 하는 군집 쌍의 개수다. 거리를 계산하는 횟수와 실제로 병합이 일어나는 횟수를 혼동한 값이다.",
        },
      },
    ],
  },
  {
    q: "군집 간의 거리 계산 방식과 그 특징이 잘못 짝지어진 것은?",
    answer: 2,
    source: "변형",
    basis: "강의록 4강 계층적 군집화 알고리즘의 특성 ⑴ — 군집 간의 거리를 계산하는 방식",
    examSkill: "다섯 가지 연결법의 정의·의미·특징을 서로 구분하는 판단",
    choices: [
      {
        text: "최단연결법 — 고립된 군집을 찾는 데 유용",
        isCorrect: false,
        explanation: {
          basis: "최단연결법의 특징 — 고립된 군집을 찾는 데 유용",
          reason:
            "가장 가까운 데이터 쌍 간의 거리를 쓰므로 다른 군집과 멀리 떨어진 고립 군집을 잘 드러낸다. 바르게 짝지어졌으므로 정답이 아니다.",
        },
      },
      {
        text: "최장연결법 — 응집된 군집을 찾는 데 중점",
        isCorrect: false,
        explanation: {
          basis: "최장연결법의 특징 — 응집된 군집을 찾는 데 중점을 둠",
          reason:
            "가장 멀리 떨어진 데이터 쌍 간의 거리를 기준으로 삼으므로, 군집 전체가 좁게 모여 있어야 병합된다. 바르게 짝지어졌으므로 정답이 아니다.",
        },
      },
      {
        text: "중심연결법 — 비슷한 크기의 군집을 병합",
        isCorrect: true,
        explanation: {
          basis: "중심연결법의 특징은 특이값에 강건 / 비슷한 크기의 군집을 병합하는 것은 Ward's 방법",
          reason:
            "중심연결법은 두 군집의 평균 간 거리를 쓰므로 특이값에 강건하다는 것이 그 특징이다. 비슷한 크기의 군집을 병합한다는 특징은 군집 크기 정보까지 이용하는 Ward's 방법의 것이므로 짝이 잘못되었다.",
        },
      },
      {
        text: "평균연결법 — 작은 분산을 가지는 군집을 형성",
        isCorrect: false,
        explanation: {
          basis: "평균연결법의 특징 — 작은 분산을 가지는 군집을 형성함",
          reason:
            "각 군집에 속하는 모든 데이터 쌍 간 거리의 평균을 쓰므로 한 데이터에 휘둘리지 않고 분산이 작은 군집을 만든다. 바르게 짝지어졌으므로 정답이 아니다.",
        },
      },
    ],
  },
  {
    q: "덴드로그램으로부터 적합한 군집의 수를 결정하는 방법으로 옳은 것은?",
    answer: 1,
    source: "변형",
    basis: "강의록 4강 계층적 군집화 알고리즘의 특성 ⑵ — 덴드로그램으로부터 적합한 군집의 수를 결정하는 방법",
    examSkill: "덴드로그램의 세로축(군집 간의 거리)에서 유지 구간을 읽는 판단",
    choices: [
      {
        text: "가장 먼저 병합이 일어난 높이에서 자른다.",
        isCorrect: false,
        explanation: {
          basis: "클러스터 간의 거리가 증가하는 동안 클러스터 수의 변화 없이 일정 기간 유지되는 지점을 선택",
          reason:
            "가장 먼저 병합이 일어나는 높이는 가장 가까운 두 데이터가 묶이는 지점일 뿐이며, 그 높이에서 자르면 거의 모든 데이터가 따로 남는다. 유지 구간의 길이를 전혀 보지 않은 기준이다.",
        },
      },
      {
        text: "클러스터 간의 거리가 증가하는 동안 클러스터 수의 변화 없이 일정 기간 유지되는 지점을 선택한다.",
        isCorrect: true,
        explanation: {
          basis: "예제 덴드로그램에서 거리 3~6 구간의 클러스터 개수가 2로 유지 → K = 2",
          reason:
            "거리를 올려도 한동안 군집 수가 바뀌지 않는다는 것은 그만큼 군집들이 서로 확실히 떨어져 있다는 뜻이다. 강의록이 제시한 군집 수 결정 기준 그대로다.",
        },
      },
      {
        text: "항상 전체 데이터 수의 절반으로 정한다.",
        isCorrect: false,
        explanation: {
          basis: "적절한 K값의 선정은 주어진 문제에 지극히 의존",
          reason:
            "군집의 수는 데이터의 분포에 따라 정해지는 것이지 데이터 개수로부터 기계적으로 계산되지 않는다. 덴드로그램을 읽을 필요조차 없는 기준이므로 맞지 않는다.",
        },
      },
      {
        text: "목적함수 J가 가장 작아지는 K를 고른다.",
        isCorrect: false,
        explanation: {
          basis: "J는 K-평균 군집화 알고리즘의 목적함수",
          reason:
            "J는 K가 커질수록 계속 줄어들기 때문에 J만으로 K를 고르면 데이터 개수만큼 군집을 만드는 극단으로 간다. 게다가 J는 K-평균의 목적함수이므로 덴드로그램에서 군집 수를 읽는 기준이 아니다.",
        },
      },
    ],
  },
];

export default function Lecture4Quiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(QUIZZES.length).fill(null)
  );

  const answered = (i: number) => answers[i] !== null;
  const correctCount = answers.filter(
    (a, i) => a !== null && a === QUIZZES[i].answer
  ).length;
  const allAnswered = answers.every((a) => a !== null);

  const select = (qi: number, ci: number) => {
    if (answers[qi] !== null) return;
    setAnswers((prev) => prev.map((v, i) => (i === qi ? ci : v)));
  };

  return (
    <section>
      <SectionTitle
        title="복습 퀴즈"
        subtitle="정리하기 공식 연습문제 5문항과 변형 문제 7문항"
      />

      <div className="space-y-6">
        {QUIZZES.map((quiz, qi) => {
          const done = answered(qi);
          const isCorrect = answers[qi] === quiz.answer;
          return (
            <div
              key={qi}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                  {qi + 1}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    quiz.source === "공식 연습문제"
                      ? "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {quiz.source}
                </span>
                <span className="text-[11px] text-gray-400">{quiz.examSkill}</span>
              </div>

              <h4 className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-200">
                {quiz.q}
              </h4>

              <div className="space-y-2">
                {quiz.choices.map((choice, ci) => {
                  let style =
                    "border-gray-200 bg-gray-50 hover:bg-teal-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-teal-900/10";
                  if (done) {
                    if (choice.isCorrect) {
                      style =
                        "border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/20";
                    } else if (ci === answers[qi]) {
                      style =
                        "border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900/20";
                    } else {
                      style =
                        "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800";
                    }
                  }
                  return (
                    <div key={ci}>
                      <button
                        onClick={() => select(qi, ci)}
                        disabled={done}
                        className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${style}`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="shrink-0 text-xs font-bold text-gray-400">
                            {String.fromCharCode(9312 + ci)}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {choice.text}
                          </span>
                          {done && choice.isCorrect && (
                            <CheckCircle
                              size={16}
                              className="ml-auto shrink-0 text-green-500"
                            />
                          )}
                          {done && ci === answers[qi] && !choice.isCorrect && (
                            <XCircle
                              size={16}
                              className="ml-auto shrink-0 text-red-500"
                            />
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
                    isCorrect
                      ? "bg-green-50 dark:bg-green-900/20"
                      : "bg-red-50 dark:bg-red-900/20"
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
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {quiz.basis}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20"
        >
          <div>
            <p className="text-lg font-bold text-teal-700 dark:text-teal-300">
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
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
          >
            <RotateCcw size={14} />
            다시 풀기
          </button>
        </motion.div>
      )}
    </section>
  );
}
