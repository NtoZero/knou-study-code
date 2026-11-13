"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Scroller, ComputedNote, Tag } from "@/components/dlShared/ui";
import { F, Chip2, Cell, r2 } from "@/components/dl2/ui2";

interface Piece {
  key: string;
  name: string;
  role: string;
  body: string;
  code: string[];
}

/** 강의록 실습 코드에서 역전파의 뼈대에 해당하는 부분만 추렸다. */
const PIECES: Piece[] = [
  {
    key: "act",
    name: "활성함수",
    role: "미분 가능해야 한다",
    body: "시그모이드를 그대로 구현합니다. 미분 역시 자기 출력만으로 구해지므로 따로 식을 유도할 필요가 없습니다.",
    code: ["def sigmoid(x):", "    return 1 / (1 + np.exp(-x))"],
  },
  {
    key: "loss",
    name: "손실함수",
    role: "학습 경과를 보기 위한 것",
    body: "평균제곱오차입니다. 다만 이 함수는 학습 중 손실 변화를 확인하기 위한 것으로, 역전파 훈련 함수가 직접 쓰지는 않습니다.",
    code: [
      "def loss_mse(y, y_hat):",
      "    loss = 0.0",
      "    for i in range(len(y)):",
      "        err = y_hat[i] - y[i]",
      "        loss += np.dot(err, err)",
      "    return loss / len(y)",
    ],
  },
  {
    key: "dense",
    name: "Dense 클래스",
    role: "완전연결층 하나",
    body: "층 하나를 맡습니다. 가중치 w와 바이어스 b, 활성함수, ∂E/∂u와 ∂o/∂u를 계산하는 함수, 모멘텀을 적용한 변화량(속도), 그리고 역전파에 쓸 입력·출력 보관 자리를 갖습니다.",
    code: [
      "def output(self, X):",
      "    self.in_vec = X          # 역전파에 쓰려고 입력 보관",
      "    u = ... np.dot(self.w[i], X) + self.b[i] ...",
      "    self.out_vec = self.activation(u)   # 출력도 보관",
      "    return self.out_vec",
    ],
  },
  {
    key: "gd",
    name: "경사 하강 갱신",
    role: "모멘텀이 들어가는 자리",
    body: "전달받은 dw·db는 이미 학습률이 반영된 변화량입니다. 직전 속도에 모멘텀을 곱해 이어받고 변화량을 빼서 새 속도를 만든 뒤, 그 속도만큼 w와 b를 옮깁니다.",
    code: [
      "def gd(self, dw, db, momentum=0):",
      "    self.velocity_w = self.velocity_w * momentum - dw",
      "    self.velocity_b = self.velocity_b * momentum - db",
      "    self.w += self.velocity_w",
      "    self.b += self.velocity_b",
    ],
  },
  {
    key: "model",
    name: "BP_Model 클래스",
    role: "층을 쌓은 모델",
    body: "각 층의 유닛 수를 입력층→출력층 순으로 나열한 리스트를 받아 Dense 층을 쌓습니다. predict는 첫 층부터 끝 층까지 차례로 출력을 흘려보내고, fit은 표본마다 순전파 뒤 출력층에서 입력층 방향으로 역전파합니다.",
    code: [
      "# 출력층",
      "delta = currLayer.dE_du(y[m])",
      "du_dw = currLayer.in_vec",
      "# 은닉층 — 뒤 층에서 거꾸로 내려온다",
      "for iCurrLayer in range(self.nLayers-2, -1, -1):",
      "    sDeltaW = nextDelta * nextLayer.w[:, nO]",
      "    delta = dE_do * currLayer.do_du()",
    ],
  },
];

export default function IrisBinary() {
  const [sel, setSel] = useState(PIECES[2].key);
  const piece = PIECES.find((p) => p.key === sel) ?? PIECES[0];

  // 결정경계 도식 — 꽃잎 길이·폭 평면
  const SX = (v: number) => r2(((v - 0.6) / 6.6) * 200);
  const SY = (v: number) => r2(150 - ((v - 0) / 3.1) * 140);
  const SETOSA: [number, number][] = [
    [1.3, 0.2], [1.5, 0.2], [1.4, 0.3], [1.6, 0.2], [1.2, 0.2], [1.5, 0.4], [1.7, 0.3], [1.4, 0.1],
  ];
  const VERSI: [number, number][] = [
    [4.0, 1.2], [4.5, 1.5], [4.7, 1.4], [4.2, 1.3], [3.9, 1.1], [4.9, 1.5], [4.4, 1.4], [3.5, 1.0],
  ];
  const VIRGI: [number, number][] = [
    [5.8, 2.2], [6.1, 2.5], [5.5, 2.1], [6.6, 2.1], [5.9, 1.8], [6.3, 1.8], [5.6, 2.4], [6.9, 2.3],
  ];

  return (
    <section id="iris-binary" className="scroll-mt-32">
      <SectionTitle
        title="붓꽃 식별 — 역전파 모델을 코드로"
        subtitle="층 하나를 맡는 Dense와 그 층을 쌓는 BP_Model, 두 덩어리로 나뉩니다"
      />

      <Sourced
        refs={{
          slides: "1. 붓꽃 식별을 위한 역전파 모델의 구현 — 활성함수·손실함수·Dense 클래스·BP_Model 클래스",
          lecture: "입력과 출력을 보관해 두는 이유는 역전파할 때 다시 계산하지 않기 위해서다",
        }}
      >
        <Card>
          <CardTitle>조각을 눌러 그 자리가 하는 일 보기</CardTitle>
          <div className="mb-3 flex flex-wrap gap-2">
            {PIECES.map((p) => (
              <Chip2 key={p.key} active={sel === p.key} onClick={() => setSel(p.key)}>
                {p.name}
              </Chip2>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Tag tone="teal">{piece.role}</Tag>
              </div>
              <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">{piece.body}</p>
            </div>
            <Scroller>
              <pre className="min-w-[300px] overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11.5px] leading-5 text-gray-100 dark:bg-gray-950">
                <code>{piece.code.join("\n")}</code>
              </pre>
            </Scroller>
          </div>
        </Card>
      </Sourced>

      <Sourced
        className="mt-4"
        refs={{
          slides: "1. 붓꽃 식별을 위한 역전파 모델의 구현 — BP_Model 객체 생성 및 학습 / 2. 학습된 모델의 추론 결과",
        }}
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Card className="min-w-0">
            <CardTitle>이렇게 만들고 이렇게 훈련한다</CardTitle>
            <Scroller>
              <pre className="min-w-[300px] overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11.5px] leading-5 text-gray-100 dark:bg-gray-950">
                <code>{`bp_iris = BP_Model([nDim, 4, 1], loss='mse',
                   activation_h='sigmoid',
                   activation_o='sigmoid')
bp_iris.fit(X_tr, y_tr, nSamples,
            epochs=1000, eta=0.1, momentum=0.9)`}</code>
              </pre>
            </Scroller>
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              <Cell label="입력" value="2개" highlight />
              <Cell label="은닉" value="4개" highlight />
              <Cell label="출력" value="1개" highlight />
              <Cell label="반복" value="1000" />
              <Cell label="학습률 η" value="0.1" />
              <Cell label="모멘텀 m" value="0.9" />
            </div>
            <Hint>
              입력은 꽃잎의 길이와 폭 두 가지이고, 출력이 하나이므로 versicolor인지 아닌지를 가르는
              이진 분류입니다. 은닉층과 출력층 모두 시그모이드를 씁니다.
            </Hint>
            <F className="mt-3" note="학습 중 손실을 재는 데 쓰는 평균제곱오차">
              E = (1/n<sub>s</sub>) Σ<sub>i</sub> Σ<sub>k</sub> (ŷ<sub>k</sub><sup>(i)</sup> − y<sub>k</sub><sup>(i)</sup>)²
            </F>
          </Card>

          <Card className="min-w-0">
            <CardTitle>학습된 결정경계 — &lsquo;versicolor&rsquo;와 나머지</CardTitle>
            <Scroller>
              <svg viewBox="0 0 215 170" className="h-auto w-full min-w-[230px]" role="img">
                <title>꽃잎 길이와 폭 평면에서 versicolor만 띠 모양으로 감싸는 결정 영역</title>
                <rect
                  x="0"
                  y="8"
                  width="200"
                  height="142"
                  rx="4"
                  className="fill-blue-50 dark:fill-blue-950/30"
                />
                <path
                  d={`M ${SX(2.4)} ${SY(0)} L ${SX(5.2)} ${SY(3.1)} L ${SX(6.3)} ${SY(3.1)} L ${SX(3.4)} ${SY(0)} Z`}
                  className="fill-pink-100 dark:fill-pink-950/50"
                />
                {SETOSA.map(([a, b], i) => (
                  <circle key={`s-${i}`} cx={SX(a)} cy={SY(b)} r="2.8" className="fill-blue-600" />
                ))}
                {VIRGI.map(([a, b], i) => (
                  <circle key={`g-${i}`} cx={SX(a)} cy={SY(b)} r="2.8" className="fill-blue-600" />
                ))}
                {VERSI.map(([a, b], i) => (
                  <circle key={`v-${i}`} cx={SX(a)} cy={SY(b)} r="2.8" className="fill-fuchsia-500" />
                ))}
                <line x1="0" y1={SY(0)} x2="200" y2={SY(0)} className="stroke-gray-400" />
                <line x1={SX(0.6)} y1="8" x2={SX(0.6)} y2={SY(0)} className="stroke-gray-400" />
                <text x="150" y="166" className="fill-gray-500 text-[8px]">
                  petal length →
                </text>
                <text x="2" y="16" className="fill-gray-500 text-[8px]">
                  ↑ petal width
                </text>
                <g transform="translate(118, 22)">
                  <circle cx="4" cy="0" r="3" className="fill-fuchsia-500" />
                  <text x="11" y="3" className="fill-gray-600 text-[8px] dark:fill-gray-300">
                    (1) versicolor
                  </text>
                  <circle cx="4" cy="12" r="3" className="fill-blue-600" />
                  <text x="11" y="15" className="fill-gray-600 text-[8px] dark:fill-gray-300">
                    (0) the others
                  </text>
                </g>
              </svg>
            </Scroller>
            <Hint>
              직선 하나로는 가운데 무리만 떼어 낼 수 없습니다. 은닉층이 생기면서 양쪽을 동시에
              자르는 띠 모양의 경계를 학습했습니다.
            </Hint>
            <ComputedNote>
              위 그림은 강의록의 결과 그래프를 읽고 다시 그린 도식입니다. 점의 좌표는 실제 학습
              결과가 아니라 모양을 전달하기 위한 배치입니다.
            </ComputedNote>
          </Card>
        </div>
      </Sourced>
    </section>
  );
}
