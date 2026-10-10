"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Hint, Scroller, Tag } from "./ui";
import { outSize } from "./cnn";

type StageKind = "input" | "conv" | "pool" | "flatten" | "fc" | "out";

interface Stage {
  id: string;
  name: string;
  kind: StageKind;
  /** 한 변의 크기와 장수 */
  size: number;
  depth: number;
  detail: string;
  calc?: string;
}

/** 교재 [그림 12-10]의 CNN 구조 예 — 크기는 모두 식으로 다시 계산한 값 */
function buildStages(): Stage[] {
  const s: Stage[] = [];
  const inSize = 28;
  s.push({
    id: "in",
    name: "입력층",
    kind: "input",
    size: inSize,
    depth: 1,
    detail: "28×28 흑백 숫자 영상. MLP와 달리 1D 벡터가 아니라 2D 격자 구조의 데이터를 그대로 입력받는다.",
  });
  const c1 = outSize(inSize, 5, 1, 0);
  s.push({
    id: "c1",
    name: "콘볼루션층",
    kind: "conv",
    size: c1,
    depth: 10,
    detail:
      "5×5 커널 10개. 콘볼루션 연산을 수행하여 특징맵을 형성한다. 특징맵의 개수는 사용한 커널(필터)의 개수와 같다.",
    calc: `(28 + 2×0 − 5) ÷ 1 + 1 = ${c1}`,
  });
  const p1 = outSize(c1, 2, 2, 0);
  s.push({
    id: "p1",
    name: "풀링층",
    kind: "pool",
    size: p1,
    depth: 10,
    detail: "2×2 최대 풀링. 콘볼루션 연산의 결과에 풀링 연산을 적용하여 특징맵을 다운샘플링한다.",
    calc: `(${c1} − 2) ÷ 2 + 1 = ${p1}`,
  });
  const c2 = outSize(p1, 5, 1, 0);
  s.push({
    id: "c2",
    name: "콘볼루션층",
    kind: "conv",
    size: c2,
    depth: 20,
    detail: "5×5 커널 20개. 앞선 블록보다 더 추상적인 수준의 특징을 뽑는다.",
    calc: `(${p1} + 2×0 − 5) ÷ 1 + 1 = ${c2}`,
  });
  const p2 = outSize(c2, 2, 2, 0);
  s.push({
    id: "p2",
    name: "풀링층",
    kind: "pool",
    size: p2,
    depth: 20,
    detail: "2×2 최대 풀링. 여기까지가 특징을 뽑는 부분이고, 두 번 반복된 콘볼루션 블록에 해당한다.",
    calc: `(${c2} − 2) ÷ 2 + 1 = ${p2}`,
  });
  s.push({
    id: "flat",
    name: "flattening",
    kind: "flatten",
    size: 1,
    depth: p2 * p2 * 20,
    detail: "행렬 형태의 특징을 벡터 형태로 바꾸는 연산. 완전연결층은 이 벡터를 입력으로 받는다.",
    calc: `${p2} × ${p2} × 20 = ${p2 * p2 * 20}`,
  });
  s.push({
    id: "fc",
    name: "완전연결층",
    kind: "fc",
    size: 1,
    depth: 100,
    detail:
      "기존의 MLP에 해당하는 구조. 그림에서는 이 층에 드롭아웃(0.25)도 함께 걸어 과다적합을 줄인다.",
  });
  s.push({
    id: "out",
    name: "출력층",
    kind: "out",
    size: 1,
    depth: 10,
    detail: "숫자 10개에 대응하는 10개 노드. Log Softmax를 거쳐 분류 결과를 낸다.",
  });
  return s;
}

const STAGES = buildStages();

const KIND_TONE: Record<StageKind, string> = {
  input: "border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200",
  conv: "border-lime-400 bg-lime-100 text-lime-900 dark:border-lime-700 dark:bg-lime-950/60 dark:text-lime-100",
  pool: "border-amber-400 bg-amber-100 text-amber-900 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-100",
  flatten: "border-slate-400 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200",
  fc: "border-sky-400 bg-sky-100 text-sky-900 dark:border-sky-700 dark:bg-sky-950/60 dark:text-sky-100",
  out: "border-rose-400 bg-rose-100 text-rose-900 dark:border-rose-700 dark:bg-rose-950/60 dark:text-rose-100",
};

const LAYER_TYPES = [
  {
    name: "콘볼루션층 convolution layer",
    role: "영상처리와 신호처리에서 기본적인 연산으로 많이 사용되는 콘볼루션 연산을 수행하여 특징맵을 형성한다.",
  },
  {
    name: "서브샘플링(풀링)층 subsampling/pooling layer",
    role: "콘볼루션 연산의 결과에 대해 풀링 연산을 적용하여 특징맵을 다운샘플링한다.",
  },
  {
    name: "완전연결층 fully connected layer",
    role:
      "기존의 MLP에 해당하는 구조를 갖는 부분. 앞선 층에서 추출된 행렬 형태의 특징을 벡터 형태로 입력받아 전통적인 MLP에서와 같은 분류 작업을 수행한다.",
  },
];

export default function CnnOverview() {
  const [sel, setSel] = useState("c1");
  const stage = STAGES.find((s) => s.id === sel)!;
  const idx = STAGES.findIndex((s) => s.id === sel);
  const prev = idx > 0 ? STAGES[idx - 1] : null;

  return (
    <section id="cnn-overview" className="scroll-mt-32">
      <SectionTitle
        title="합성곱 신경망(CNN) — 세 가지 유형의 층"
        subtitle="완전연결이 왜 버거운지에서 시작해 CNN의 구조를 따라갑니다"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "12.3 합성곱 신경망(CNN)", slides: "정교화된 심층 신경망 모델의 등장" }}>
          <Card>
            <CardTitle>완전연결로 깊게 쌓으면 무엇이 문제인가</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              기존의 MLP는 이웃한 층의 각 노드가 <strong>완전연결(fully connected)</strong>된 구조를 갖습니다.
              따라서 기존 MLP에 단순히 많은 은닉층을 추가해서 심층으로 구성하면 가중치가 너무 많아서 신경망의
              복잡도가 높아지며 학습은 느리고 과다적합에 빠질 가능성도 커집니다. 반면 CNN은{" "}
              <strong>이웃한 층의 노드들을 부분적으로만 연결</strong>해 신경망의 복잡도를 낮추면서 효율적인 학습이
              이루어지도록 설계된 모델입니다.
            </p>
            <p className="mt-2 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              CNN(Convolutional Neural Network, 합성곱 신경망)은 <strong>인간의 시각 피질에 존재하는
              신경세포들의 정보처리 기제로부터 영감</strong>을 받아서, 영상 데이터처럼 <strong>격자 구조를 가진
              데이터</strong>에 적합하도록 개발된 모델입니다. 최근의 딥러닝 응용에서 가장 많이 사용되는 심층
              신경망의 형태입니다.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {LAYER_TYPES.map((t, i) => (
                <div key={t.name} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className="text-[12px] font-bold text-gray-800 dark:text-gray-100">
                    {i + 1}. {t.name}
                  </p>
                  <p className="mt-1 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">{t.role}</p>
                </div>
              ))}
            </div>
            <Hint>
              강의록은 같은 자리에서 순환 신경망(RNN)도 함께 소개합니다. 기본 RNN의 발전된 모델로 LSTM·GRU가
              등장했고, 음성·텍스트와 같은 시계열 데이터 처리에 적합한 모델이라고 정리하며 다음 강의로 넘깁니다.
            </Hint>
            <Hint>
              콘볼루션층과 이웃한 풀링층을 합쳐 <strong>콘볼루션 블록</strong>이라고 하며, 이 블록이 여러 번
              반복되는 구조를 가집니다. 이 과정은 학습을 통해 서로 다른 수준에서의 특징을 추출하는 과정이므로,
              심층 신경망에서의 학습을 <strong>특징학습</strong>(feature learning) 또는{" "}
              <strong>표현학습</strong>(representation learning)이라고도 합니다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "12.3 — CNN 구조의 예(그림 12-10)" }}>
          <Card>
            <CardTitle>층을 지날 때마다 데이터가 어떻게 바뀌는가</CardTitle>
            <Scroller>
              <div className="flex min-w-[560px] items-end gap-1 pb-2">
                {STAGES.map((s, i) => (
                  <div key={s.id} className="flex items-end gap-1">
                    <button
                      type="button"
                      onClick={() => setSel(s.id)}
                      className={`w-[68px] rounded-lg border px-1.5 py-2 text-center transition-all ${
                        KIND_TONE[s.kind]
                      } ${sel === s.id ? "ring-2 ring-lime-500 ring-offset-1 dark:ring-offset-gray-900" : "opacity-80"}`}
                      style={{ height: `${40 + Math.min(60, s.size * 1.6)}px` }}
                    >
                      <span className="block text-[10px] font-bold leading-3">{s.name}</span>
                      <span className="mt-1 block font-mono text-[10px]">
                        {s.size > 1 ? `${s.size}×${s.size}×${s.depth}` : `${s.depth}`}
                      </span>
                    </button>
                    {i < STAGES.length - 1 && <span className="pb-4 text-xs text-gray-400">→</span>}
                  </div>
                ))}
              </div>
            </Scroller>

            <div className="mt-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <div className="flex flex-wrap items-center gap-2">
                <Tag tone="lime">{stage.name}</Tag>
                <span className="font-mono text-[11.5px] text-gray-600 dark:text-gray-300">
                  {prev
                    ? `${prev.size > 1 ? `${prev.size}×${prev.size}×${prev.depth}` : prev.depth} → ${
                        stage.size > 1 ? `${stage.size}×${stage.size}×${stage.depth}` : stage.depth
                      }`
                    : `${stage.size}×${stage.size}×${stage.depth}`}
                </span>
              </div>
              {stage.calc && (
                <p className="mt-1.5 font-mono text-[11.5px] text-lime-700 dark:text-lime-400">
                  한 변의 크기: {stage.calc}
                </p>
              )}
              <p className="mt-1.5 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">{stage.detail}</p>
            </div>

            <ComputedNote>
              막대에 적힌 크기는 교재 [그림 12-10]에 쓰인 값과 같고, 이 페이지에서 출력 크기 식으로 다시 계산해
              붙인 것입니다. 다만 flattening 뒤의 320은 그림에 적혀 있지 않아 4×4×20을 곱해 구했습니다. 막대의
              높이는 특징맵 한 변의 크기에 비례하게 그렸습니다.
            </ComputedNote>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "12.3 — 네트워크 구조와 학습", slides: "합성곱 신경망 — 네트워크 구조 · 학습 알고리즘" }}>
          <Card>
            <CardTitle>구조와 학습을 한 문단으로</CardTitle>
            <ul className="space-y-1.5 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              <li>
                • <strong>층상 구조</strong>(layered structure)이며, 입력층은 1D 벡터 형태의 입력을 사용하는 MLP와는
                달리 <strong>다중 채널로 이루어지는 2D 격자 구조</strong>의 데이터를 입력받는다.
              </li>
              <li>
                • 콘볼루션층과 풀링층은 각각 여러 개의 2차원 특징맵으로 이루어지고,{" "}
                <strong>특징맵의 개수는 학습에 사용되는 커널(필터)의 개수에 의존</strong>한다.
              </li>
              <li>
                • 층과 층 사이는 <strong>부분적인 연결</strong>을 가지며 커널로 표현되는{" "}
                <strong>가중치를 공유</strong>함으로써 신경망의 복잡도가 낮아진다.
              </li>
              <li>
                • 학습은 기본적으로 MLP에서 사용되는 <strong>오류 역전파 학습 알고리즘</strong>을 바탕으로, 앞서
                본 다양한 학습 기법을 함께 적용하여 수행된다.
              </li>
            </ul>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
