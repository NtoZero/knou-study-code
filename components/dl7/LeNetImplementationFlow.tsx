"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Card, Chip, Formula, Scroller } from "@/components/dlShared/ui";
import { Sourced } from "@/components/dlShared/SourceFilter";

const steps = [
  { id: "data", title: "데이터 읽기", short: "01" },
  { id: "prepare", title: "형태 맞추기", short: "02" },
  { id: "label", title: "정답 표현", short: "03" },
  { id: "model", title: "층 쌓기", short: "04" },
  { id: "train", title: "학습 실행", short: "05" },
  { id: "evaluate", title: "테스트 평가", short: "06" },
] as const;
type StepId = (typeof steps)[number]["id"];

const valAccuracy = [0.9742, 0.9757, 0.9813, 0.9838, 0.9850];

export default function LeNetImplementationFlow() {
  const [activeStep, setActiveStep] = useState<StepId>("data");
  const [mode, setMode] = useState<"paper" | "practice" | "modern">("practice");
  const [epoch, setEpoch] = useState(5);
  return (
    <section>
      <SectionTitle title="LeNet-5을 직접 구현하는 순서" subtitle="데이터를 준비하고 모델을 쌓은 뒤 학습·평가까지 흐름을 따라가세요" />
      <Sourced refs={{ slides: "강의록 7강 PDF 22–30쪽 — MNIST 불러오기·전처리·레이블·모델·학습·평가", lecture: "강의 7강 42:46–44:01, 53:54–55:07 — 레이블 형식과 구현 시 원형과 달라지는 부분" }}>
        <Card className="border-amber-200 dark:border-amber-900">
          <Scroller>
            <div className="flex min-w-max gap-2 pb-1">
              {steps.map((step) => (
                <button key={step.id} type="button" onClick={() => setActiveStep(step.id)} aria-pressed={activeStep === step.id} className={`rounded-xl border px-3 py-2 text-left ${activeStep === step.id ? "border-amber-500 bg-amber-100 dark:border-amber-700 dark:bg-amber-900/50" : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"}`}>
                  <span className="mr-2 font-mono text-[10px] text-amber-700 dark:text-amber-300">{step.short}</span><span className="text-[11px] font-bold">{step.title}</span>
                </button>
              ))}
            </div>
          </Scroller>

          <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-xl bg-gray-950 p-4 text-white">
              <StepContent step={activeStep} />
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><h3 className="text-xs font-bold">논문 구조와 코드 구현 비교</h3><p className="mt-1 text-[9px] text-gray-500">수업 코드는 LeNet-5 아이디어를 따라 직접 구성한 구현 예</p></div>
                  <div className="flex flex-wrap gap-1">
                    <Chip active={mode === "paper"} onClick={() => setMode("paper")}>LeNet-5 원형</Chip>
                    <Chip active={mode === "practice"} onClick={() => setMode("practice")}>강의 실습 코드</Chip>
                    <Chip active={mode === "modern"} onClick={() => setMode("modern")}>현대 분류 예</Chip>
                  </div>
                </div>
                <ModelMode mode={mode} />
              </div>

              <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div><h3 className="text-xs font-bold">강의 화면의 학습 예시</h3><p className="mt-1 text-[9px] text-gray-500">에폭별 검증 정확도 기록을 확인</p></div>
                  <label className="flex items-center gap-2 text-[10px] text-gray-500">에폭
                    <select value={epoch} onChange={(e) => setEpoch(Number(e.target.value))} className="rounded-md border border-gray-200 bg-white px-2 py-1 font-mono dark:border-gray-700 dark:bg-gray-900">
                      {valAccuracy.map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
                    </select>
                  </label>
                </div>
                <div className="mt-3 grid grid-cols-5 gap-1.5">
                  {valAccuracy.map((value, i) => <button key={i} type="button" onClick={() => setEpoch(i + 1)} className={`rounded-lg px-1.5 py-2 text-center ${epoch === i + 1 ? "bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-100" : "bg-gray-50 text-gray-500 dark:bg-gray-800"}`}><span className="block text-[8px]">E{i + 1}</span><span className="mt-1 block font-mono text-[9px]">{(value * 100).toFixed(2)}%</span></button>)}
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px]"><span className="text-gray-500">선택한 에폭 검증 정확도</span><b className="font-mono text-amber-700 dark:text-amber-300">{(valAccuracy[epoch - 1] * 100).toFixed(2)}%</b></div>
                <p className="mt-2 text-[9px] leading-4 text-gray-400">한 에폭은 전체 학습 데이터를 한 번 모두 학습하는 단위. 수업 화면에 제시된 결과이며 새로 학습을 실행한 결과가 아님.</p>
              </div>
            </div>
          </div>
        </Card>
      </Sourced>
    </section>
  );
}

function StepContent({ step }: { step: StepId }) {
  if (step === "data") return <>
    <Tag>keras.datasets.mnist</Tag><h3 className="mt-3 text-base font-bold">60,000개 학습 · 10,000개 테스트</h3>
    <p className="mt-2 text-xs leading-5 text-gray-300">각 이미지는 0~9 숫자의 28 × 28 그레이스케일 픽셀. 레이블은 이미지에 대응하는 숫자 범주.</p>
    <div className="mt-4 flex items-center justify-center gap-3"><MiniTile label="이미지 x" main="28 × 28"/><span className="text-slate-500">+</span><MiniTile label="레이블 y" main="0–9"/></div>
  </>;
  if (step === "prepare") return <>
    <Tag>reshape · pad · normalize</Tag><h3 className="mt-3 text-base font-bold">입력 텐서를 LeNet-5 형식으로</h3>
    <div className="mt-4 space-y-2 text-[10px]">
      <div className="flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2"><span>처음</span><b className="font-mono">28 × 28</b></div>
      <div className="flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2"><span>채널 축 추가</span><b className="font-mono">28 × 28 × 1</b></div>
      <div className="flex items-center justify-between rounded-lg bg-amber-950/50 px-3 py-2"><span>사방에 0 패딩 2칸</span><b className="font-mono">32 × 32 × 1</b></div>
      <div className="flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2"><span>픽셀 정규화</span><b className="font-mono">픽셀 ÷ 255 → 0~1</b></div>
    </div>
    <p className="mt-3 text-[9px] leading-4 text-gray-400">강의 실습 코드에는 데이터 배열을 0~1 범위로 바꾸는 단계가 포함.</p>
  </>;
  if (step === "label") return <>
    <Tag>to_categorical(y, 10)</Tag><h3 className="mt-3 text-base font-bold">정답의 저장 모양 결정</h3>
    <p className="mt-2 text-xs leading-5 text-gray-300">수업 구현은 정수 레이블을 원-핫 벡터로 바꾸어 10개 출력 노드와 맞춤. 일반 다중 분류에서는 클래스 인덱스 방식이 메모리를 절약할 수 있음.</p>
    <div className="mt-4 rounded-lg bg-slate-900 p-3 text-center"><div className="text-[9px] text-slate-400">정답 숫자 3의 원-핫 표현</div><div className="mt-2 font-mono text-sm font-bold text-amber-200">[0, 0, 0, 1, 0, 0, 0, 0, 0, 0]</div></div>
  </>;
  if (step === "model") return <>
    <Tag>Sequential · Conv2D · Pooling · Dense · RBF</Tag><h3 className="mt-3 text-base font-bold">층을 순서대로 연결</h3>
    <div className="mt-3 grid grid-cols-2 gap-1.5 text-[9px]">
      {["Conv 6 · 5×5 · tanh", "MaxPool 2×2", "Conv 16 · 5×5 · tanh", "MaxPool 2×2", "Conv 120 · 5×5 · tanh", "Flatten → Dense 120", "Dense 84 · tanh", "RBF 10"].map((layer, i) => <div key={i} className="rounded-md bg-slate-900 px-2 py-2"><span className="mr-1 text-amber-300">{String(i + 1).padStart(2, "0")}</span>{layer}</div>)}
    </div>
    <p className="mt-3 text-[9px] leading-4 text-gray-400">강의 실습에서는 C3의 원형 선택 연결을 그대로 구현하지 않음. `Conv2D(16, …)`로 층을 간단히 구성.</p>
  </>;
  if (step === "train") return <>
    <Tag>compile → fit</Tag><h3 className="mt-3 text-base font-bold">학습 설정과 반복</h3>
    <div className="mt-4 grid grid-cols-2 gap-2 text-[10px]">
      <div className="rounded-lg bg-slate-900 p-3"><div className="text-slate-400">손실함수</div><b className="mt-1 block">Mean Squared Error</b></div>
      <div className="rounded-lg bg-slate-900 p-3"><div className="text-slate-400">최적화기</div><b className="mt-1 block">Adam · 0.001</b></div>
      <div className="rounded-lg bg-slate-900 p-3"><div className="text-slate-400">학습 반복</div><b className="mt-1 block">10 에폭</b></div>
      <div className="rounded-lg bg-slate-900 p-3"><div className="text-slate-400">미니배치</div><b className="mt-1 block">64개</b></div>
    </div>
    <p className="mt-3 text-[9px] leading-4 text-gray-400">에폭 수와 배치 크기는 학습 과정 설정. 검증 데이터는 학습 중 성능을 확인하는 데 사용.</p>
  </>;
  return <>
    <Tag>evaluate(x_test, y_test)</Tag><h3 className="mt-3 text-base font-bold">학습에 쓰지 않은 테스트 데이터</h3>
    <p className="mt-2 text-xs leading-5 text-gray-300">테스트 이미지와 레이블로 최종 모델의 정확도와 손실을 계산. 강의 화면 예시에서 5 에폭 후 테스트 정확도는 약 98.5%로 제시.</p>
    <div className="mt-4 rounded-lg bg-slate-900 p-4"><div className="mb-2 flex justify-between text-[9px] text-gray-400"><span>테스트 정확도</span><span>강의 실행 예시 · 5 에폭 학습 후</span></div><div className="h-3 overflow-hidden rounded-full bg-gray-700"><div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400" style={{ width: "98.5%" }} /></div><div className="mt-2 text-right font-mono text-lg font-bold text-amber-200">98.50%</div></div>
    <p className="mt-3 text-[9px] leading-4 text-gray-400">강의 화면에 제시된 테스트 평가 결과이며, 사이트에서 학습을 다시 실행한 값은 아님.</p>
  </>;
}

function ModelMode({ mode }: { mode: "paper" | "practice" | "modern" }) {
  const details = {
    paper: { pool: "평균 풀링", c3: "S2 맵 일부만 선택 연결", output: "RBF 출력 10개", loss: "MSE 계열", color: "border-cyan-200 bg-cyan-50/70 text-cyan-900 dark:border-cyan-900 dark:bg-cyan-950/20 dark:text-cyan-100", note: "LeNet-5 원 논문에 소개된 샘플링과 Gaussian/RBF 출력 구조." },
    practice: { pool: "최대값 풀링", c3: "일반 Conv2D로 단순 구현", output: "RBF 출력 10개", loss: "MSE 계열", color: "border-amber-200 bg-amber-50/70 text-amber-900 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-100", note: "강의 코드에서 MaxPooling2D를 사용하고, C3 선택 연결은 구현하지 않음. 원형과 같은 평균 풀링을 쓰려면 AveragePooling2D로 바꿀 수 있다고 설명." },
    modern: { pool: "풀링 방식은 선택", c3: "일반적인 학습 가능한 연결", output: "Softmax 출력", loss: "Cross-entropy", color: "border-violet-200 bg-violet-50/70 text-violet-900 dark:border-violet-900 dark:bg-violet-950/20 dark:text-violet-100", note: "강의의 비교표에서 현대 분류 모델은 클래스별 확률을 내는 Softmax와 Cross-entropy를 더 자주 사용한다고 구분." },
  }[mode];
  return (
    <div>
      <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {[details.pool, details.c3, details.output, details.loss].map((item) => <div key={item} className={`rounded-lg border px-2 py-2 text-center text-[9px] font-semibold ${details.color}`}>{item}</div>)}
      </div>
      <p className="mt-2 text-[9px] leading-4 text-gray-500">{details.note}</p>
    </div>
  );
}

function MiniTile({ label, main }: { label: string; main: string }) {
  return <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-center"><div className="text-[8px] text-slate-400">{label}</div><div className="mt-1 font-mono text-xs font-bold text-amber-100">{main}</div></div>;
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-amber-900/60 bg-amber-950/40 px-2 py-1 text-[9px] font-semibold text-amber-200">{children}</span>;
}
