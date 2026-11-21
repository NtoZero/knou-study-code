"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Scroller } from "@/components/dlShared/ui";

type Stage = {
  name: string;
  kind: "input" | "conv" | "pool" | "dense";
  output: string;
  operation: string;
  purpose: string;
};

const STAGES: Stage[] = [
  { name: "입력", kind: "input", output: "227×227×3", operation: "RGB 이미지", purpose: "컬러 이미지를 모델에 넣는다. 논문에는 224×224로 표기됐지만 실제 AlexNet 입력 크기는 227×227이다." },
  { name: "C1", kind: "conv", output: "55×55×96", operation: "11×11 · stride 4 · ReLU", purpose: "큰 필터와 큰 stride로 입력의 넓은 영역에서 초기 특징을 찾는다." },
  { name: "P1", kind: "pool", output: "27×27×96", operation: "3×3 최대 풀링 · stride 2", purpose: "특징 맵의 공간 크기를 줄인다. 창 크기보다 stride가 작아 창이 서로 겹친다." },
  { name: "C2", kind: "conv", output: "27×27×256", operation: "5×5 · stride 1 · padding 2 · ReLU", purpose: "256개의 특징 맵을 만든다. 표의 패딩 2로 가로·세로 크기를 유지한다." },
  { name: "P2", kind: "pool", output: "13×13×256", operation: "3×3 최대 풀링 · stride 2", purpose: "두 번째 풀링으로 공간 크기를 다시 줄인다." },
  { name: "C3", kind: "conv", output: "13×13×384", operation: "3×3 · stride 1 · padding 1 · ReLU", purpose: "384개의 특징 맵을 만들며, 입력의 공간 크기를 유지한다." },
  { name: "C4", kind: "conv", output: "13×13×384", operation: "3×3 · stride 1 · padding 1 · ReLU", purpose: "이전 특징 맵을 받아 더 깊은 특징을 만든다." },
  { name: "C5", kind: "conv", output: "13×13×256", operation: "3×3 · stride 1 · padding 1 · ReLU", purpose: "완전연결층으로 보내기 전 256개 특징 맵을 만든다." },
  { name: "P5", kind: "pool", output: "6×6×256", operation: "3×3 최대 풀링 · stride 2", purpose: "마지막 공간 축소 뒤 6×6×256 특징 맵을 완전연결층에 전달한다." },
  { name: "F6", kind: "dense", output: "4,096개", operation: "완전연결 · ReLU", purpose: "특징 맵을 펼친 벡터를 받아 각 범주를 구분하는 표현을 만든다." },
  { name: "F7", kind: "dense", output: "4,096개", operation: "완전연결 · ReLU", purpose: "다음 완전연결층에서 분류에 필요한 표현을 정리한다." },
  { name: "F8", kind: "dense", output: "1,000개", operation: "완전연결 · Softmax", purpose: "ImageNet의 1,000개 범주에 대한 확률을 출력한다. CIFAR-10 실습 코드에서는 마지막 출력이 10개다." },
];

const kindTone = {
  input: "border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200",
  conv: "border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-200",
  pool: "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
  dense: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
};

export default function AlexNetArchitectureLab() {
  const [active, setActive] = useState(0);
  const stage = STAGES[active];

  return (
    <section id="alexnet-architecture" className="scroll-mt-32">
      <SectionTitle
        title="AlexNet — 입력에서 분류까지"
        subtitle="층을 선택해 특징 맵의 크기와 각 층의 역할을 따라가 보세요."
      />

      <Sourced refs={{ slides: "슬라이드 4–7 — AlexNet 구조·세부 내용", lecture: "음성 전사 07:03–07:29, 14:41–14:55 — GPU·입력 크기·출력" }}>
        <Card>
          <p className="mb-4 text-sm leading-6">ImageNet의 이미지 분류 대회 ILSVRC에서는 2010~2011년 전통적인 컴퓨터 비전 기법이 우승했습니다. 2012년 AlexNet은 분류 오류율 16.4%로 우승하며 깊은 합성곱 신경망이 대규모 이미지 분류에서 어떤 성능을 낼 수 있는지 보여 주었습니다.</p>
          <div className="mb-5 rounded-xl border border-sky-200 bg-sky-50/70 p-4 dark:border-sky-900 dark:bg-sky-950/30">
            <p className="text-sm font-bold text-sky-950 dark:text-sky-100">출력 표를 직접 계산하기: C1 → P1 → C2</p>
            <p className="mt-1 text-[13px] leading-6 text-sky-900 dark:text-sky-200">출력 모양 <b>가로×세로×특징 맵 수</b>를 읽어요. 필터 수가 출력 맵 수를 정하고, 필터의 가중치 수는 커널 크기와 입력 채널 수로 계산해요.</p>
            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              <div className="rounded-lg bg-white/80 p-3 dark:bg-gray-900/60">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-100">① C1 · 합성곱</p>
                <p className="mt-2 font-mono text-[13px] leading-6 text-gray-700 dark:text-gray-200">(227−11)÷4+1=55<br />11×11×3=363개/필터<br />363×96=34,848개 가중치</p>
                <p className="mt-2 text-[13px] leading-6 text-gray-600 dark:text-gray-300">필터 96개가 55×55 지도 96장을 만듭니다. 가중치 수는 편향을 빼고 센 값이며, 출력 모양은 55×55×96입니다.</p>
              </div>
              <div className="rounded-lg bg-white/80 p-3 dark:bg-gray-900/60">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-100">② P1 · 최대 풀링</p>
                <p className="mt-2 font-mono text-[13px] leading-6 text-gray-700 dark:text-gray-200">(55−3)÷2+1=27<br />3×3 창 · stride 2<br />지도 수는 96장 그대로</p>
                <p className="mt-2 text-[13px] leading-6 text-gray-600 dark:text-gray-300">풀링은 각 지도를 따로 훑으며 창 안의 최댓값을 남깁니다. 가로·세로는 27로 줄지만 채널 수와 학습 가중치는 늘지 않아 출력은 27×27×96입니다.</p>
              </div>
              <div className="rounded-lg bg-white/80 p-3 dark:bg-gray-900/60">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-100">③ C2 · 두 GPU 그룹</p>
                <p className="mt-2 font-mono text-[13px] leading-6 text-gray-700 dark:text-gray-200">(27+2×2−5)÷1+1=27<br />2×128×5×5×48=307,200<br />출력 지도: 128×2=256장</p>
                <p className="mt-2 text-[13px] leading-6 text-gray-600 dark:text-gray-300">GPU마다 C1의 지도 48장을 받아 128개 필터를 적용합니다. 패딩 2가 공간 크기를 27로 유지하고, 두 그룹의 출력 지도를 합쳐 27×27×256이 됩니다. 가중치 수 역시 편향을 제외합니다.</p>
              </div>
            </div>
            <p className="mt-3 rounded-lg border border-sky-200 px-3 py-2 text-[13px] leading-6 text-sky-900 dark:border-sky-800 dark:text-sky-200">예를 들어 C1의 96은 출력 특징 맵 96장이고, C1의 가중치 34,848개는 각 11×11×3 필터의 계수를 모두 더한 수예요. 두 숫자는 서로 다른 것을 세므로 혼동하지 마세요.</p>
          </div>
          <div className="mb-4 grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg bg-sky-50 p-3 dark:bg-sky-950/35">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">합성곱층</p>
              <p className="mt-1 text-lg font-bold text-sky-950 dark:text-sky-100">5개 <span className="text-xs font-medium">C1–C5</span></p>
            </div>
            <div className="rounded-lg bg-violet-50 p-3 dark:bg-violet-950/35">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">완전연결층</p>
              <p className="mt-1 text-lg font-bold text-violet-950 dark:text-violet-100">3개 <span className="text-xs font-medium">F6–F8</span></p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/35">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">병렬 처리</p>
              <p className="mt-1 text-lg font-bold text-emerald-950 dark:text-emerald-100">2개의 GPU</p>
            </div>
          </div>

          <CardTitle>층 하나를 눌러 출력 크기 읽기</CardTitle>
          <Scroller>
            <div className="flex min-w-[760px] items-stretch gap-1.5 pb-1">
              {STAGES.map((item, i) => (
                <div key={item.name} className="flex min-w-0 flex-1 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={active === i}
                    className={`min-w-[56px] flex-1 rounded-lg border p-2 text-center transition ${kindTone[item.kind]} ${active === i ? "ring-2 ring-teal-500 ring-offset-1 dark:ring-offset-gray-900" : "opacity-75 hover:opacity-100"}`}
                  >
                    <span className="block text-[11px] font-bold">{item.name}</span>
                    <span className="mt-1 block text-[9px] font-mono">{item.output}</span>
                  </button>
                  {i < STAGES.length - 1 && <span className="text-xs text-gray-300">→</span>}
                </div>
              ))}
            </div>
          </Scroller>

          <div className="mt-4 grid gap-3 md:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-4 dark:border-teal-900 dark:bg-teal-950/30">
              <p className="text-xs font-bold text-teal-800 dark:text-teal-200">선택한 층 · {stage.name}</p>
              <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-100">{stage.operation}</p>
              <p className="mt-2 text-[12px] leading-5 text-gray-600 dark:text-gray-300">{stage.purpose}</p>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <div>
                <p className="text-[11px] font-semibold text-gray-500">이 층의 출력</p>
                <p className="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-white">{stage.output}</p>
              </div>
              <div className="text-right text-[11px] leading-5 text-gray-500">
                {stage.kind === "conv" && "필터로 특징 추출"}
                {stage.kind === "pool" && "공간 크기 축소"}
                {stage.kind === "dense" && "범주 판단에 연결"}
                {stage.kind === "input" && "원본 이미지"}
              </div>
            </div>
          </div>

          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[12px] leading-5 text-amber-900 dark:bg-amber-950/35 dark:text-amber-100">
            원래 AlexNet은 1,000개 범주를 출력해요. CIFAR-10은 범주가 10개이므로 이 데이터셋에 맞춘 모델은 마지막 Dense 층의 출력 수도 <b>10</b>으로 둬요.
          </p>
        </Card>
      </Sourced>
    </section>
  );
}
