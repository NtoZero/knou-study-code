"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, Split } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Card, CardTitle, Tag } from "@/components/dlShared/ui";
import { Sourced } from "@/components/dlShared/SourceFilter";

const groups = [
  {
    id: "stem",
    title: "시작 부분 · Stem",
    tint: "border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/30",
    steps: ["입력 224×224×3", "7×7 합성곱 · 64 · 보폭 2", "3×3 최대 풀링 · 보폭 2", "3×3 합성곱 · 192", "3×3 최대 풀링 · 보폭 2"],
    detail: "처음부터 여러 갈래를 펼치지 않고 기본 합성곱과 풀링으로 출발합니다. 강의 실습의 입력은 224×224×3이며, 합성곱에는 ReLU 활성화가 적용됩니다.",
  },
  {
    id: "middle",
    title: "중간 부분 · 9개 인셉션",
    tint: "border-cyan-200 bg-cyan-50 dark:border-cyan-900 dark:bg-cyan-950/30",
    steps: ["3a → 3b", "풀링 → 4a · 보조 분류기 1", "4b → 4c → 4d · 보조 분류기 2", "4e → 풀링", "5a → 5b"],
    detail: "중간 모듈의 공간 크기는 풀링 전 28×28, 첫 다운샘플 뒤 14×14, 다음 다운샘플 뒤 7×7입니다. 각 인셉션 모듈은 네 갈래 출력을 채널 축으로 붙여 다음 모듈에 전달합니다.",
  },
  {
    id: "head",
    title: "끝 부분 · 분류 출력",
    tint: "border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/30",
    steps: ["전역 평균 풀링", "드롭아웃 · 0.4", "완전연결층 · 10개 출력", "소프트맥스"],
    detail: "각 특징 맵을 하나의 평균값으로 줄여 벡터를 만든 뒤 분류합니다. 강의 실습은 CIFAR-10의 10개 클래스에 맞춰 주 출력과 보조 출력 두 개를 함께 구성합니다.",
  },
];

export default function GoogLeNetPipeline() {
  const [selected, setSelected] = useState("middle");
  const [auxiliary, setAuxiliary] = useState(true);
  const active = groups.find((group) => group.id === selected) ?? groups[1];

  return (
    <section id="googlenet-flow" className="scroll-mt-32">
      <SectionTitle
        title="GoogLeNet의 흐름: 시작·중간·끝"
        subtitle="중간 인셉션 모듈을 중심으로 보조 분류기와 마지막 분류 출력을 연결"
      />
      <Sourced refs={{ slides: "9강 강의록 5–6쪽, 10–13쪽, 22–25쪽 · GoogLeNet 구조·보조 분류기·학습", lecture: "09:20–11:03 · output size와 가중치 학습 계층 수 depth 구분; 19:52–20:43 · 중간 분류기의 역할" }}>
        <Card className="mb-4 border-cyan-200 bg-cyan-50/40 dark:border-cyan-900 dark:bg-cyan-950/20">
          <CardTitle>구조표의 인셉션 3a 행 읽기</CardTitle>
          <p className="mt-1 text-[13px] leading-6 text-gray-700 dark:text-gray-300">
            입력은 <span className="font-mono">28×28×192</span>이고, 네 갈래의 가로·세로는 그대로 둔 채 채널 축으로 결과를 붙입니다. 표의 숫자를 역할별로 읽으면 중간 채널 수와 최종 채널 수를 혼동하지 않을 수 있습니다.
          </p>
          <div className="mt-3 overflow-x-auto rounded-lg border border-cyan-200 bg-white dark:border-cyan-900 dark:bg-gray-900">
            <table className="min-w-[720px] w-full border-collapse text-left text-[13px]">
              <thead className="bg-cyan-50 text-[10px] text-gray-600 dark:bg-cyan-950/50 dark:text-gray-300">
                <tr><th className="p-2">출력 크기</th><th className="p-2">#1×1</th><th className="p-2">#3×3 reduce</th><th className="p-2">#3×3</th><th className="p-2">#5×5 reduce</th><th className="p-2">#5×5</th><th className="p-2">pool proj</th><th className="p-2">Params</th><th className="p-2">Ops</th></tr>
              </thead>
              <tbody><tr className="divide-x divide-cyan-100 dark:divide-cyan-900">
                <td className="p-2 font-mono font-bold">28×28×256</td><td className="p-2">64</td><td className="p-2">96</td><td className="p-2">128</td><td className="p-2">16</td><td className="p-2">32</td><td className="p-2">32</td><td className="p-2">159K</td><td className="p-2">128M</td>
              </tr></tbody>
            </table>
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <div className="rounded-lg border border-cyan-200 bg-white p-3 dark:border-cyan-900 dark:bg-gray-900">
              <p className="text-[10px] font-bold text-cyan-800 dark:text-cyan-200">각 숫자가 가리키는 것</p>
              <p className="mt-1 text-[13px] leading-6 text-gray-700 dark:text-gray-300">
                <strong>#3×3 reduce 96</strong>은 3×3 필터 수가 아닙니다. 먼저 1×1 합성곱 96개로 <span className="font-mono">28×28×96</span> 중간 맵을 만들고, 그 뒤 <strong>#3×3 128</strong>개 필터가 출력 맵 128개를 만듭니다. 풀링 갈래는 3×3 최대 풀링 뒤 1×1 투영 필터 32개를 적용해 <span className="font-mono">28×28×32</span>를 냅니다. 따라서 연결 뒤 채널 수는 <span className="font-mono">64+128+32+32=<strong>256</strong></span>입니다.
              </p>
            </div>
            <div className="rounded-lg border border-cyan-200 bg-white p-3 dark:border-cyan-900 dark:bg-gray-900">
              <p className="text-[10px] font-bold text-cyan-800 dark:text-cyan-200">Params와 Ops를 검산하는 단위</p>
              <p className="mt-1 font-mono text-[13px] leading-6 text-gray-700 dark:text-gray-300">
                가중치 수 = 192×64 + 192×96 + 3×3×96×128<br />+ 192×16 + 5×5×16×32 + 192×32 = <strong>163,328</strong>
              </p>
              <p className="mt-1 text-[13px] leading-6 text-gray-700 dark:text-gray-300">
                이는 편향을 제외한 학습 가중치 계수 수입니다. 각 계수는 28×28개 위치에서 곱해지므로 <span className="font-mono">163,328×784=128,049,152</span>, 약 <strong>128M 곱셈</strong>이며 표의 Ops와 맞는 규모입니다. 표의 Params는 159K라고 적혀 있지만 K의 기준과 편향 집계가 제시되지 않아, 이 계산과 정밀하게 같다고 단정하지 않습니다.
              </p>
            </div>
          </div>
        </Card>
        <Card className="mb-4 border-rose-200 bg-rose-50/30 dark:border-rose-900 dark:bg-rose-950/15">
          <CardTitle>중간 분류기 두 개가 손실과 기울기를 나누는 과정</CardTitle>
          <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-300">
            GoogLeNet의 주 경로는 4a 이후에도 계속 깊어집니다. 강의 코드는 4a와 4d의 특징 맵에서 보조 분류 가지를 각각 만들고, 세 분류 손실을 한 학습 목표에 합칩니다. 중간 예측은 최종 출력을 대신하는 것이 아니라 그 지점까지의 공유 계층에도 학습 신호를 보탭니다.
          </p>
          <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-lg border border-rose-200 bg-white p-3 dark:border-rose-900 dark:bg-gray-900">
              <p className="text-[10px] font-bold text-rose-800 dark:text-rose-200">구조를 따라 읽기</p>
              <p className="mt-2 font-mono text-[13px] leading-6 text-gray-700 dark:text-gray-300">공유 경로: Stem → 3a → 3b → 4a<br />├ 보조 분류 1<br />└ 4b → 4c → 4d<br />　 ├ 보조 분류 2<br />　 └ 4e → 5a → 5b → 주 출력</p>
              <p className="mt-2 text-[13px] leading-6 text-gray-700 dark:text-gray-300">보조 분류는 평균 풀링 5×5(stride 3) → 1×1 합성곱 128 → Flatten → Dense 1024(ReLU) → Dense 10(softmax) 순으로 진행.</p>
              <p className="mt-2 text-[13px] leading-6 text-gray-700 dark:text-gray-300">Stem부터 4a까지의 계층은 세 손실에서, 4b–4d는 주 손실과 보조 2에서 기울기를 받음. 4e 이후에는 주 손실의 기울기만 도달.</p>
            </div>
            <div className="rounded-lg border border-rose-200 bg-white p-3 dark:border-rose-900 dark:bg-gray-900">
              <p className="text-[10px] font-bold text-rose-800 dark:text-rose-200">1 · 손실 가중치를 직접 계산</p>
              <p className="mt-1 font-mono text-[13px] font-bold">L = L주 + 0.3L보조1 + 0.3L보조2</p>
              <p className="mt-1 text-[13px] leading-6 text-gray-700 dark:text-gray-300">예시 손실이 주 0.8, 보조1 1.2, 보조2 0.5라면 L=0.8+0.36+0.15=<strong>1.31</strong>.</p>
              <p className="mt-3 text-[10px] font-bold text-rose-800 dark:text-rose-200">2 · 공유 가중치의 기울기 경로</p>
              <p className="mt-1 text-[13px] leading-6 text-gray-700 dark:text-gray-300">한 가중치가 세 경로에 공통이라고 하고 기울기가 주 2, 보조1 −1, 보조2 3이면, 세 손실이 닿는 앞쪽 계층에서 합산 기울기는 2+0.3(−1)+0.3(3)=<strong>2.6</strong>.</p>
              <p className="mt-1 text-[13px] leading-6 text-gray-700 dark:text-gray-300">4b–4d 안의 가중치에는 보조1이 닿지 않아 주 2+보조2 0.3×3=<strong>2.9</strong>; 4d 뒤 가중치에는 주 경로의 기울기만 전달. 숫자는 경로 계산을 보여 주는 예시값.</p>
            </div>
          </div>
          <p className="mt-3 text-[10px] leading-4 text-gray-500">계수 0.3은 보조 손실의 상대 가중치이지, 보조 분류의 정답 확률이나 학습 횟수를 뜻하지 않습니다.</p>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-500">그룹을 선택하면 역할을 읽을 수 있습니다</p>
                <h3 className="mt-1 font-bold">22층 신경망의 큰 구조</h3>
              </div>
              <button
                type="button"
                aria-pressed={auxiliary}
                onClick={() => setAuxiliary((value) => !value)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${auxiliary ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}
              >
                <Split size={14} /> {auxiliary ? "보조 가지 표시" : "보조 가지 숨김"}
              </button>
            </div>

            <div className="grid gap-3">
              {groups.map((group, groupIndex) => (
                <button
                  type="button"
                  key={group.id}
                  aria-pressed={selected === group.id}
                  onClick={() => setSelected(group.id)}
                  className={`rounded-xl border p-3 text-left transition ${group.tint} ${selected === group.id ? "ring-2 ring-cyan-500 ring-offset-2 dark:ring-offset-gray-900" : "opacity-80 hover:opacity-100"}`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-200">{groupIndex + 1}</span>
                    <span className="text-xs font-bold">{group.title}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {group.steps.map((step, stepIndex) => (
                      <span key={step} className="inline-flex items-center gap-1.5">
                        <span className="rounded-md bg-white/80 px-2 py-1 text-[10px] font-medium text-gray-700 dark:bg-gray-900/80 dark:text-gray-200">{step}</span>
                        {stepIndex < group.steps.length - 1 && <span className="text-gray-400">›</span>}
                        {auxiliary && group.id === "middle" && (step.includes("4a") || step.includes("4d")) && (
                          <span className="rounded-md border border-rose-300 bg-rose-50 px-1.5 py-1 text-[9px] font-bold text-rose-700 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200">보조 출력</span>
                        )}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 flex justify-center text-cyan-700 dark:text-cyan-300"><ArrowDown size={18} /></div>
            <AnimatePresence mode="wait">
              <motion.div key={active.id + String(auxiliary)} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                <p className="text-xs font-bold text-cyan-800 dark:text-cyan-200">{active.title}</p>
                <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">{active.detail}</p>
                {selected === "middle" && auxiliary && <p className="mt-3 rounded-lg border-l-4 border-rose-400 bg-rose-50 p-3 text-[13px] leading-6 text-rose-900 dark:bg-rose-950/30 dark:text-rose-100">4a와 4d에서 분류용 경로가 갈라집니다. 4a에서 예측을 마친 뒤에도 그 특징 맵은 주 경로의 다음 인셉션 모듈로 전달됩니다.</p>}
                {selected === "middle" && !auxiliary && (
                  <p className="mt-3 text-xs leading-5 text-gray-500">보조 가지를 화면에서 숨긴 상태입니다. 실제 강의 모델에는 중간 분류기가 두 곳에 배치됩니다.</p>
                )}
              </motion.div>
            </AnimatePresence>
          </Card>

          <Card className="h-fit">
            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">output size와 depth 구분</p>
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
              표의 <strong>output size</strong>는 층을 지난 특징 맵의 크기 <span className="font-mono">H×W×C</span>입니다. <strong>depth</strong>는 채널 수가 아니라, 모듈의 경로에서 가중치를 학습하는 계층이 몇 개인지를 셉니다.
            </p>
            <div className="mt-4 space-y-2">
              <div className="rounded-lg bg-sky-50 p-3 dark:bg-sky-950/30"><p className="text-[10px] text-gray-500">output size 예</p><p className="mt-1 font-mono text-sm font-bold">14 × 14 × 480</p><p className="mt-1 text-[10px] text-gray-500">가로 × 세로 × 채널 수</p></div>
              <div className="rounded-lg bg-cyan-50 p-3 dark:bg-cyan-950/30"><p className="text-[10px] text-gray-500">인셉션 경로의 depth 예</p><p className="mt-1 font-mono text-sm font-bold">0 · 1 · 2</p><p className="mt-1 text-[10px] leading-4 text-gray-500">합성곱처럼 가중치를 학습하는 계층 수. 풀링은 가중치가 없어 depth에 세지 않음.</p></div>
            </div>
            <div className="mt-3 rounded-lg border border-sky-200 bg-white p-3 dark:border-sky-900 dark:bg-gray-900">
              <p className="text-[10px] font-bold text-sky-800 dark:text-sky-200">구조표에 적힌 3a–5b 출력</p>
              <p className="mt-1 font-mono text-[13px] leading-6 text-gray-700 dark:text-gray-300">3a 28×28×256 → 3b 28×28×480 → pool 14×14×480 → 4a–4c 14×14×512 → 4d 14×14×528 → 4e 14×14×832 → pool 7×7×832 → 5a 7×7×832 → 5b 7×7×1024</p>
            </div>
            <div className="mt-3"><Tag tone="teal">C = 특징 맵 채널 수</Tag></div>
            <p className="mt-3 text-[11px] leading-5 text-gray-500">이 출력 크기는 강의 구조표의 값입니다. 실습 코드의 3·4번째 풀링층은 <code>padding</code>을 생략해 Keras의 기본값 <code>valid</code>를 쓰므로, 실제 텐서 크기를 추적할 때는 표의 크기를 그대로 대입하지 말고 코드 설정을 따라야 합니다.</p>
          </Card>
        </div>
      </Sourced>
    </section>
  );
}
