"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Formula, Hint, Scroller, Tag, num } from "./ui";
import { outSize } from "./cnn";

type Kind = "input" | "conv" | "pool" | "fc" | "out";

interface Layer {
  id: string;
  name: string;
  kind: Kind;
  size: number;
  depth: number;
  f?: number;
  s?: number;
  p?: number;
  calc: string;
  params: number;
  fcParams: number;
  detail: string;
}

/** 교재 [그림 12-18]의 LeNet-5 — 크기와 파라미터 수를 모두 다시 계산한다 */
function build(): Layer[] {
  const L: Layer[] = [];
  const push = (l: Layer) => L.push(l);
  const inSize = 32;
  push({
    id: "in",
    name: "입력",
    kind: "input",
    size: inSize,
    depth: 1,
    calc: "32×32×1",
    params: 0,
    fcParams: 0,
    detail: "32×32 크기의 흑백 필기 숫자 영상 한 장.",
  });
  const c1 = outSize(inSize, 5, 1, 0);
  push({
    id: "c1",
    name: "C1 콘볼루션층",
    kind: "conv",
    size: c1,
    depth: 6,
    f: 5,
    s: 1,
    p: 0,
    calc: `(32 + 2×0 − 5) ÷ 1 + 1 = ${c1}`,
    params: 6 * (5 * 5 * 1) + 6,
    fcParams: inSize * inSize * 1 * (c1 * c1 * 6) + c1 * c1 * 6,
    detail: "필터 5×5, 보폭 1, 패딩 없음, 필터 6개. 가장 낮은 수준의 에지 같은 특징을 뽑는다.",
  });
  const s2 = Math.floor((c1 - 2) / 2) + 1;
  push({
    id: "s2",
    name: "S2 풀링층",
    kind: "pool",
    size: s2,
    depth: 6,
    f: 2,
    s: 2,
    calc: `(${c1} − 2) ÷ 2 + 1 = ${s2}`,
    params: 0,
    fcParams: 0,
    detail: "2×2 평균 풀링, 보폭 2. 학습 대상 파라미터가 없고 특징맵의 수도 6으로 그대로다.",
  });
  const c3 = outSize(s2, 5, 1, 0);
  push({
    id: "c3",
    name: "C3 콘볼루션층",
    kind: "conv",
    size: c3,
    depth: 16,
    f: 5,
    s: 1,
    p: 0,
    calc: `(${s2} + 2×0 − 5) ÷ 1 + 1 = ${c3}`,
    params: 16 * (5 * 5 * 6) + 16,
    fcParams: s2 * s2 * 6 * (c3 * c3 * 16) + c3 * c3 * 16,
    detail: "필터 5×5, 필터 16개. 앞 블록의 특징을 묶어 더 복잡한 모양을 본다.",
  });
  const s4 = Math.floor((c3 - 2) / 2) + 1;
  push({
    id: "s4",
    name: "S4 풀링층",
    kind: "pool",
    size: s4,
    depth: 16,
    f: 2,
    s: 2,
    calc: `(${c3} − 2) ÷ 2 + 1 = ${s4}`,
    params: 0,
    fcParams: 0,
    detail: "2×2 평균 풀링, 보폭 2. 여기까지가 특징추출 부분이다.",
  });
  const c5 = outSize(s4, 5, 1, 0);
  push({
    id: "c5",
    name: "C5 콘볼루션층",
    kind: "conv",
    size: c5,
    depth: 120,
    f: 5,
    s: 1,
    p: 0,
    calc: `(${s4} + 2×0 − 5) ÷ 1 + 1 = ${c5}`,
    params: 120 * (5 * 5 * 16) + 120,
    fcParams: s4 * s4 * 16 * (c5 * c5 * 120) + c5 * c5 * 120,
    detail:
      "필터 5×5, 필터 120개. 입력이 이미 5×5라 필터가 한 번만 놓이므로 출력은 1×1×120이 되고, 결과적으로 완전연결과 같아진다.",
  });
  push({
    id: "f6",
    name: "F6 완전연결층",
    kind: "fc",
    size: 1,
    depth: 84,
    calc: "120 → 84",
    params: 84 * 120 + 84,
    fcParams: 84 * 120 + 84,
    detail: "분류를 위한 완전연결층. 교재는 120-84-10 구조라고 적는다.",
  });
  push({
    id: "out",
    name: "출력층",
    kind: "out",
    size: 1,
    depth: 10,
    calc: "84 → 10",
    params: 10 * 84 + 10,
    fcParams: 10 * 84 + 10,
    detail:
      "각 숫자를 나타내는 10개 노드. 활성화 함수로 소프트맥스 함수를 사용하며, 클래스의 개수 M은 숫자인식이므로 10이다.",
  });
  return L;
}

const LAYERS = build();
const TOTAL = LAYERS.reduce((a, l) => a + l.params, 0);

const TONE: Record<Kind, string> = {
  input: "border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200",
  conv: "border-lime-400 bg-lime-100 text-lime-900 dark:border-lime-700 dark:bg-lime-950/60 dark:text-lime-100",
  pool: "border-amber-400 bg-amber-100 text-amber-900 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-100",
  fc: "border-sky-400 bg-sky-100 text-sky-900 dark:border-sky-700 dark:bg-sky-950/60 dark:text-sky-100",
  out: "border-rose-400 bg-rose-100 text-rose-900 dark:border-rose-700 dark:bg-rose-950/60 dark:text-rose-100",
};

export default function LeNetLab() {
  const [sel, setSel] = useState("c1");
  const layer = LAYERS.find((l) => l.id === sel)!;

  return (
    <section id="lenet" className="scroll-mt-32">
      <SectionTitle
        title="CNN의 예 — LeNet-5"
        subtitle="층마다의 크기와 파라미터 수를 식으로 다시 계산하며 구조를 따라갑니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.3.3 CNN의 예: LeNet(그림 12-18)",
            slides: "CNN의 예: LeNet-5",
          }}
        >
          <Card>
            <CardTitle>첫 번째 CNN 성공 사례</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              초창기 대표적인 CNN인 <strong>LeNet-5</strong>는 1998년 얀 르쿤(Yann LeCun)에 의해{" "}
              <strong>필기 숫자인식</strong>을 위해 개발되어, 첫 번째의 CNN 성공 사례로 여겨지고 있습니다.
              LeNet-5는 특징추출을 위해 <strong>3개의 콘볼루션층(C1, C3, C5)</strong>과{" "}
              <strong>2개의 풀링층(S2, S4)</strong>으로 구성되고, 분류를 위해 하나의 은닉층을 가진 MLP 구조, 즉
              완전연결층으로 구성됩니다. 강의록은 이 모델의 인식률을 99.05%로 적고 있습니다.
            </p>
            <p className="mt-2 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              강의록은 LeNet-5가 실제로 추출한 특징을 층별 영상으로 보여 줍니다. 앞쪽 층(C1·S2)에서는 숫자의
              획 조각처럼 눈에 보이는 모양이 남아 있고, 뒤쪽 층(C3·S4·C5)으로 갈수록 알아보기 어려운 추상적인
              패턴이 됩니다 — 앞 단계는 저급 수준의 특징을, 뒤쪽은 고급 수준의 특징을 뽑는다는 설명이 그림으로
              확인되는 자리입니다. 같은 구조를 교통표지판 인식에 적용한 예도 함께 제시됩니다.
            </p>
            <Hint>발표 연도는 교재가 1998년으로 적고, 강의록 제목 줄에는 1988로 적혀 있습니다.</Hint>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "12.3.3 — LeNet-5의 구조", slides: "CNN의 예: LeNet-5 — 구조도" }}>
          <Card>
            <CardTitle>층을 눌러 크기를 확인하기</CardTitle>
            <Scroller>
              <div className="flex min-w-[600px] items-end gap-1 pb-2">
                {LAYERS.map((l, i) => (
                  <div key={l.id} className="flex items-end gap-1">
                    <button
                      type="button"
                      onClick={() => setSel(l.id)}
                      className={`w-[72px] rounded-lg border px-1 py-2 text-center transition-all ${TONE[l.kind]} ${
                        sel === l.id ? "ring-2 ring-lime-500 ring-offset-1 dark:ring-offset-gray-900" : "opacity-80"
                      }`}
                      style={{ height: `${44 + Math.min(56, l.size * 1.7)}px` }}
                    >
                      <span className="block text-[10px] font-bold leading-3">{l.name.split(" ")[0]}</span>
                      <span className="mt-1 block font-mono text-[9.5px] leading-3">
                        {l.size > 1 ? `${l.size}×${l.size}×${l.depth}` : `${l.depth}`}
                      </span>
                    </button>
                    {i < LAYERS.length - 1 && <span className="pb-5 text-xs text-gray-400">→</span>}
                  </div>
                ))}
              </div>
            </Scroller>
            <div className="-mt-1 flex gap-1 text-[10px] text-gray-500">
              <span className="flex-1 rounded bg-lime-50 py-1 text-center dark:bg-lime-950/40">
                특징 추출 (C1 ~ S4)
              </span>
              <span className="w-[200px] rounded bg-sky-50 py-1 text-center dark:bg-sky-950/40">분류 (C5 ~ 출력)</span>
            </div>

            <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <div className="flex flex-wrap items-center gap-2">
                <Tag tone="lime">{layer.name}</Tag>
                {layer.f && (
                  <span className="font-mono text-[11px] text-gray-500">
                    f = {layer.f}, s = {layer.s}
                    {layer.p !== undefined ? `, p = ${layer.p}` : ""}
                    {layer.kind === "conv" ? `, nf = ${layer.depth}` : ""}
                  </span>
                )}
              </div>
              <p className="mt-1.5 font-mono text-[11.5px] text-lime-700 dark:text-lime-400">{layer.calc}</p>
              <p className="mt-1.5 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">{layer.detail}</p>
            </div>

            <Formula className="mt-3" note="출력층의 활성화 함수 — 식 11-18, M은 클래스의 개수로 여기서는 10">
              yₖ = exp(uₖᵒ) / Σᵢ₌₁ᴹ exp(uᵢᵒ)
            </Formula>
            <Hint>
              위 띠의 경계는 교재 [그림 12-18]·강의록 구조도의 점선을 따랐습니다. 그림은 C5부터를 분류 쪽으로
              묶지만, 본문은 C5를 특징추출용 콘볼루션층 셋 중 하나로 셉니다 — C5가 콘볼루션층이면서 동시에
              완전연결과 같아지는 자리이기 때문입니다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "12.3.3 — MLP보다 훨씬 작은 수의 파라미터" }}>
          <Card>
            <CardTitle>파라미터를 직접 세어 보면</CardTitle>
            <Scroller>
              <table className="w-full min-w-[520px] text-[11.5px]">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                    <th className="px-2 py-1.5 font-semibold">층</th>
                    <th className="px-2 py-1.5 font-semibold">출력</th>
                    <th className="px-2 py-1.5 font-semibold">학습 파라미터</th>
                    <th className="px-2 py-1.5 font-semibold">완전연결로 이었다면</th>
                  </tr>
                </thead>
                <tbody>
                  {LAYERS.slice(1).map((l) => (
                    <tr key={l.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-2 py-1.5 font-semibold">{l.name}</td>
                      <td className="px-2 py-1.5 font-mono">
                        {l.size > 1 ? `${l.size}×${l.size}×${l.depth}` : l.depth}
                      </td>
                      <td className="px-2 py-1.5 font-mono">
                        {l.params === 0 ? (
                          <span className="text-amber-600">없음 (학습하지 않음)</span>
                        ) : (
                          num(l.params)
                        )}
                      </td>
                      <td className="px-2 py-1.5 font-mono text-gray-500">
                        {l.fcParams === 0 ? "—" : num(l.fcParams)}
                        {l.fcParams > 0 && l.params > 0 && l.fcParams / l.params > 1.5 && (
                          <span className="ml-1 text-rose-600">
                            ({num(Math.round(l.fcParams / l.params))}배)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td className="px-2 py-1.5">합계</td>
                    <td className="px-2 py-1.5" />
                    <td className="px-2 py-1.5 font-mono text-lime-700 dark:text-lime-400">
                      {num(TOTAL)}
                    </td>
                    <td className="px-2 py-1.5" />
                  </tr>
                </tbody>
              </table>
            </Scroller>

            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              이 LeNet 구조를 이용하면 완전연결층으로만 이루어진 MLP 구조보다 <strong>훨씬 작은 수의
              파라미터들로 더 좋은 인식 성능</strong>을 얻을 수 있습니다. 표의 마지막 열이 그 차이입니다. C1은
              같은 입출력을 완전연결로 이으면 480만 개가 넘는 가중치가 필요하지만 콘볼루션층은 156개면 됩니다.
              풀링층 S2·S4는 학습 대상 파라미터가 아예 없습니다. 반대로 C5는 5×5 입력에 5×5 필터라 필터가 한 번만
              놓이므로 완전연결과 똑같은 수가 되는데, 이것이 특징추출이 끝나고 분류가 시작되는 지점입니다.
            </p>

            <ComputedNote>
              층마다의 크기(28×28×6, 14×14×6, 10×10×16, 5×5×16, 1×1×120, 84, 10)는 교재 [그림 12-18]·강의록
              구조도의 값과 같고, 이 페이지에서 출력 크기 식으로 다시 계산해 모두 일치함을 확인했습니다. 파라미터
              개수는 교재·강의록에 없는 값으로, 콘볼루션층은 <span className="font-mono">필터 개수 ×
              (f×f×입력 채널 수) + 바이어스</span>로 직접 센 것입니다. 앞 층의 모든 특징맵이 다음 콘볼루션층의
              모든 필터에 연결된다고 보고 셌습니다.
            </ComputedNote>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
