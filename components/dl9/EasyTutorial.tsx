"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, CheckCircle2, CircleHelp, RotateCcw, Sparkles } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Card, CardTitle, Formula, Slider, Tag } from "@/components/dlShared/ui";
import { Sourced } from "@/components/dlShared/SourceFilter";

const steps = ["먼저 용어 익히기", "채널 축소 계산", "숏컷 덧셈", "스스로 확인"];
const fixedOps = 14 * 14 * 480 * 5 * 5 * 48;
const compressOps = (middle: number) => 14 * 14 * 480 * middle + 14 * 14 * middle * 5 * 5 * 48;

export default function EasyTutorial() {
  const [step, setStep] = useState(0);
  const [channels, setChannels] = useState(16);
  const [input, setInput] = useState(3);
  const [change, setChange] = useState(-2);
  const [sameShape, setSameShape] = useState(true);
  const [answer, setAnswer] = useState<number | null>(null);
  const [cellValues, setCellValues] = useState([1, 2, 3, 6]);
  const average = cellValues.reduce((sum, value) => sum + value, 0) / cellValues.length;
  const result = Math.max(0, input + change);

  const next = () => setStep((current) => Math.min(steps.length - 1, current + 1));
  const previous = () => setStep((current) => Math.max(0, current - 1));

  return (
    <section>
      <SectionTitle title="짧은 예제로 한 걸음씩" subtitle="화면 위에서 값을 바꿔 보고, 계산 결과가 어떻게 달라지는지 확인하세요" />
      <Card className="mb-5">
        <div className="mb-4 flex flex-wrap gap-2">
          {steps.map((label, index) => (
            <button key={label} type="button" onClick={() => setStep(index)} aria-current={step === index ? "step" : undefined} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${step === index ? "border-cyan-700 bg-cyan-700 text-white" : "border-gray-200 text-gray-500 hover:border-cyan-300 dark:border-gray-700 dark:text-gray-400"}`}>
              {index + 1}. {label}
            </button>
          ))}
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"><motion.div className="h-full rounded-full bg-cyan-600" animate={{ width: `${((step + 1) / steps.length) * 100}%` }} transition={{ duration: 0.25 }} /></div>
      </Card>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
          {step === 0 && (
            <Sourced refs={{ slides: "9강 강의록 5쪽, 7–9쪽 · 출력 크기·depth 표기와 인셉션 모듈", lecture: "09:44–11:03 · depth는 가중치를 학습하는 계층 수" }}>
              <Card>
                <div className="flex items-center gap-2"><Sparkles size={17} className="text-cyan-700 dark:text-cyan-300" /><CardTitle>먼저 그림을 읽는 말 세 가지</CardTitle></div>
                <p className="mb-4 text-sm leading-6 text-gray-600 dark:text-gray-300">신경망 그림의 네모 한 칸은 숫자 하나가 아니라, 보통 여러 개의 특징을 쌓은 <strong>특징 맵</strong>입니다. 그림의 크기와 그 특징의 수를 따로 읽으면 인셉션과 ResNet의 흐름이 쉬워집니다.</p>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-900 dark:bg-sky-950/30"><p className="font-mono text-base font-bold">H × W</p><p className="mt-1 text-xs font-bold">공간 크기</p><p className="mt-2 text-xs leading-5 text-gray-600 dark:text-gray-300">특징 맵의 가로와 세로. 예를 들어 14×14는 위치가 14칸씩 있다는 뜻입니다.</p></div>
                  <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-900 dark:bg-cyan-950/30"><p className="font-mono text-base font-bold">C</p><p className="mt-1 text-xs font-bold">채널 수</p><p className="mt-2 text-xs leading-5 text-gray-600 dark:text-gray-300">한 위치마다 쌓인 특징의 수. 14×14 크기의 특징 맵 480장이 쌓여 있어 한 위치에는 값이 480개입니다.</p></div>
                  <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-900 dark:bg-violet-950/30"><p className="font-mono text-base font-bold">k × k</p><p className="mt-1 text-xs font-bold">합성곱 필터</p><p className="mt-2 text-xs leading-5 text-gray-600 dark:text-gray-300">주변을 살피는 작은 창. 3×3보다 5×5가 더 넓은 주변의 정보를 한 번에 봅니다.</p></div>
                </div>
                <div className="mt-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/70">
                  <p className="text-xs font-bold">인셉션의 생각</p>
                  <p className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-300">작은 창과 큰 창을 하나만 고르지 않고 <strong>병렬로</strong> 적용합니다. 그래서 작은 무늬와 넓은 형태처럼 크기가 다른 특징을 동시에 얻을 수 있습니다. 이후 네 갈래의 결과를 채널 쪽으로 이어 붙입니다.</p>
                </div>
                <p className="mt-3 rounded-lg border-l-4 border-amber-400 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100"><strong>용어 구분:</strong> 출력 크기의 세 번째 값 <span className="font-mono">C</span>는 채널 수입니다. GoogLeNet 표의 <span className="font-mono">depth</span>는 가중치를 학습하는 계층 수이며, 가중치가 없는 풀링은 세지 않습니다.</p>
              </Card>
            </Sourced>
          )}

          {step === 1 && (
            <Sourced refs={{ slides: "9강 강의록 9쪽 · 1×1 축소 전 112.9M, 축소 뒤 5.3M 연산 예", lecture: "27:13–27:33 · 480개 채널을 16개로 줄이는 설명" }}>
              <Card>
                <div className="flex items-center gap-2"><CircleHelp size={17} className="text-cyan-700 dark:text-cyan-300" /><CardTitle>1×1 합성곱은 채널을 먼저 줄일 수 있어요</CardTitle></div>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">이미지의 가로·세로가 아니라 한 위치에 쌓인 채널 수를 줄입니다. 다음 5×5 합성곱이 읽을 값이 적어져, 연산량이 크게 줄 수 있습니다.</p>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 dark:border-rose-900 dark:bg-rose-950/20">
                    <p className="text-xs font-bold text-rose-800 dark:text-rose-200">축소 없이 바로 5×5</p>
                    <div className="my-3 flex flex-wrap items-center gap-2 font-mono text-sm font-bold"><span className="rounded bg-white px-2 py-1 dark:bg-gray-900">14×14×480</span><ArrowRight size={14} /><span className="rounded bg-white px-2 py-1 dark:bg-gray-900">5×5 → 48개 출력</span></div>
                    <p className="font-mono text-[11px] leading-5 text-gray-600 dark:text-gray-400">14×14×480×5×5×48</p>
                    <p className="mt-1 text-2xl font-extrabold text-rose-700 dark:text-rose-200">{(fixedOps / 1_000_000).toFixed(1)}M</p>
                  </div>
                  <div className="rounded-xl border border-cyan-200 bg-cyan-50/70 p-4 dark:border-cyan-900 dark:bg-cyan-950/20">
                    <p className="text-xs font-bold text-cyan-800 dark:text-cyan-200">1×1로 줄인 뒤 5×5</p>
                    <div className="my-3 flex flex-wrap items-center gap-2 font-mono text-sm font-bold"><span className="rounded bg-white px-2 py-1 dark:bg-gray-900">14×14×480</span><ArrowRight size={14} /><span className="rounded bg-white px-2 py-1 dark:bg-gray-900">1×1 → {channels}개 채널</span></div>
                    <p className="font-mono text-[11px] leading-5 text-gray-600 dark:text-gray-400">14×14×480×{channels} + 14×14×{channels}×5×5×48</p>
                    <p className="mt-1 text-2xl font-extrabold text-cyan-800 dark:text-cyan-200">{(compressOps(channels) / 1_000_000).toFixed(1)}M</p>
                  </div>
                </div>
                <div className="mt-4"><Slider label="1×1 축소 뒤 채널 수" value={channels} min={8} max={64} step={8} onChange={setChannels} display={`${channels}개`} /></div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Formula note="강의 예시의 중간 채널이 16일 때">480 → 16 → 48</Formula>
                  <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"><p className="text-[10px] font-bold text-gray-500">두 계산의 차이</p><p className="mt-1 text-xs leading-5 text-gray-700 dark:text-gray-300">16채널이면 112.9M에서 5.3M으로 감소합니다. 1×1 합성곱의 연산을 추가해도 5×5 연산을 크게 줄이기 때문입니다.</p></div>
                </div>
                <p className="mt-3 text-[10px] leading-5 text-gray-500">※ 14×14×480, 48개 출력 필터와 교재·강의 예시의 계산을 사용합니다. 슬라이더는 중간 채널 수에 따른 차이를 직접 비교하는 조작입니다.</p>
              </Card>
            </Sourced>
          )}

          {step === 2 && (
            <Sourced refs={{ slides: "9강 강의록 30–31쪽, 36쪽 · 잔차 학습 블록과 숏컷 크기 조정", lecture: "63:01–63:30 · 원본 입력을 더해 차이만 학습; 71:33–72:20 · main·skip 경로 처리" }}>
              <Card>
                <div className="flex items-center gap-2"><CardTitle>ResNet은 원래 입력에 변화량을 더합니다</CardTitle></div>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">일반 층이 목표 결과 <span className="font-mono">H(x)</span>를 바로 만들도록 학습한다면, 잔차 학습은 입력 <span className="font-mono">x</span>를 숏컷으로 보내고 주 경로가 변화량 <span className="font-mono">F(x)=H(x)−x</span>를 학습합니다.</p>
                <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                    <div className="rounded-xl bg-white p-4 dark:bg-gray-900"><p className="text-xs font-bold text-gray-500">주 경로: 변화량</p><p className="mt-2 font-mono text-xl font-bold">F(x) = {change}</p><p className="mt-1 text-[10px] text-gray-500">층들이 학습한 값</p></div>
                    <div className="flex items-center justify-center text-cyan-700 dark:text-cyan-300"><span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-cyan-300 bg-white text-2xl font-bold dark:border-cyan-800 dark:bg-gray-900">+</span></div>
                    <div className="rounded-xl bg-white p-4 dark:bg-gray-900"><p className="text-xs font-bold text-gray-500">숏컷 경로: 입력</p><p className="mt-2 font-mono text-xl font-bold">x = {input}</p><p className="mt-1 text-[10px] text-gray-500">더하기 지점까지 전달</p></div>
                  </div>
                  <div className="my-4 flex justify-center text-cyan-700 dark:text-cyan-300"><ArrowDown size={18} /></div>
                  <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-center dark:border-violet-900 dark:bg-violet-950/30"><p className="text-xs font-bold text-violet-800 dark:text-violet-200">합친 뒤 ReLU</p><p className="mt-1 font-mono text-sm">H(x) = ReLU(F(x) + x) = ReLU({change} + {input})</p><p className="mt-1 text-3xl font-extrabold text-violet-800 dark:text-violet-100">{result}</p></div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Slider label="입력 x" value={input} min={-4} max={6} step={1} onChange={setInput} />
                  <Slider label="주 경로의 F(x)" value={change} min={-6} max={6} step={1} onChange={setChange} />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg bg-cyan-50 p-3 text-xs leading-5 text-cyan-950 dark:bg-cyan-950/40 dark:text-cyan-100"><Tag tone="teal">핵심 관찰</Tag><p>주 경로가 <span className="font-mono">F(x)=0</span>을 내더라도 입력 <span className="font-mono">x</span>가 더해집니다. 강의의 설명처럼 이미 전달된 입력을 바탕으로 달라질 부분을 학습할 수 있습니다.</p></div>
                <div className="mt-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <div className="mb-2 flex items-center justify-between gap-2"><p className="text-xs font-bold">두 경로의 크기는 언제 맞춰야 할까요?</p><button type="button" aria-pressed={!sameShape} onClick={() => setSameShape((value) => !value)} className="rounded-lg bg-gray-100 px-3 py-1.5 text-[10px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">{sameShape ? "크기 바꾸기" : "같은 크기로"}</button></div>
                  <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">{sameShape ? "크기가 같으면 x를 항등 숏컷으로 바로 전달해 더합니다." : "예: 입력 32×32×64를 16×16×128로 바꾸려면 숏컷에도 보폭 2의 1×1 합성곱을 적용해 주 경로와 크기를 맞춥니다."}</p>
                </div>
              </Card>
            </Sourced>
          )}

          {step === 3 && (
            <Sourced refs={{ slides: "9강 강의록 9쪽, 12–13쪽, 27–31쪽 · 채널 축소·전역 평균 풀링·잔차 학습" }}>
              <Card>
                <div className="flex items-center gap-2"><CheckCircle2 size={17} className="text-cyan-700 dark:text-cyan-300" /><CardTitle>핵심 구분을 직접 확인해 보세요</CardTitle></div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">정답을 누르면 선택지마다 왜 맞거나 다른지 설명이 나옵니다.</p>

                <div className="mt-5 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-sm font-bold">1. 1×1 합성곱을 5×5 합성곱 앞에 두는 주된 이유는 무엇일까요?</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {["입력의 가로·세로를 키워 더 많은 위치를 만들기", "채널 수를 줄여 뒤따르는 큰 필터의 연산량을 줄이기", "모든 특징 맵을 같은 값으로 바꾸기", "최종 분류 클래스 수를 늘리기"].map((choice, index) => (
                      <button key={choice} type="button" onClick={() => setAnswer(index)} className={`rounded-lg border p-3 text-left text-xs leading-5 transition ${answer === index ? (index === 1 ? "border-green-400 bg-green-50 dark:border-green-700 dark:bg-green-950/30" : "border-rose-400 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/30") : "border-gray-200 bg-gray-50 hover:border-cyan-300 dark:border-gray-700 dark:bg-gray-800"}`}>
                        <span className="mr-2 font-bold text-gray-400">{String.fromCharCode(9312 + index)}</span>{choice}
                      </button>
                    ))}
                  </div>
                  <AnimatePresence>
                    {answer !== null && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={`mt-3 overflow-hidden rounded-lg p-3 text-xs leading-5 ${answer === 1 ? "bg-green-50 text-green-900 dark:bg-green-950/30 dark:text-green-100" : "bg-rose-50 text-rose-900 dark:bg-rose-950/30 dark:text-rose-100"}`}>
                      {answer === 1 ? "맞았습니다. 1×1 합성곱은 가로·세로 위치를 유지하면서 특징 맵의 수를 조절할 수 있습니다. 그래서 그 뒤의 3×3·5×5 합성곱에서 계산할 값이 줄어듭니다." : `다시 생각해 보세요. ‘${["가로·세로를 키운다", "채널 수를 줄인다", "특징 맵을 같은 값으로 만든다", "출력 클래스를 늘린다"][answer]}’는 1×1 합성곱의 목적과 다릅니다. 강의 예시에서는 공간 크기는 14×14로 유지하고 채널 수를 480에서 16으로 줄였습니다.`}
                    </motion.p>}
                  </AnimatePresence>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/70">
                    <p className="text-xs font-bold">2. 한 채널의 전역 평균 구하기</p>
                    <p className="mt-1 text-[10px] text-gray-500">칸을 눌러 숫자를 바꾸고 평균이 어떻게 움직이는지 확인하세요.</p>
                    <div className="mt-3 grid w-fit grid-cols-2 gap-1.5">
                      {cellValues.map((value, index) => <button type="button" key={index} onClick={() => setCellValues((current) => current.map((v, i) => i === index ? (v + 1) % 10 : v))} className="flex h-10 w-10 items-center justify-center rounded-lg bg-white font-mono font-bold text-cyan-900 shadow-sm dark:bg-gray-900 dark:text-cyan-100">{value}</button>)}
                    </div>
                    <p className="mt-2 font-mono text-xs">(모든 칸의 합) ÷ 4 = {average.toFixed(2)}</p>
                    <p className="mt-1 text-[10px] leading-4 text-gray-500">각 특징 맵에서 모든 위치의 평균 하나를 만듭니다. 최댓값 하나만 고르는 최대 풀링과 다릅니다.</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/70">
                    <p className="text-xs font-bold">3. 숏컷 연결은 무엇을 더하나요?</p>
                    <p className="mt-2 text-sm font-mono font-bold text-cyan-800 dark:text-cyan-200">H(x) = F(x) + x</p>
                    <p className="mt-2 text-[11px] leading-5 text-gray-600 dark:text-gray-300">입력 x를 주 경로를 건너뛰어 전달하고, 주 경로가 학습한 변화량 F(x)를 더합니다. 깊은 층에서 입력 정보와 기울기의 전달을 돕습니다.</p>
                  </div>
                </div>
                <button type="button" onClick={() => { setAnswer(null); setChannels(16); setInput(3); setChange(-2); setSameShape(true); setCellValues([1, 2, 3, 6]); }} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"><RotateCcw size={13} /> 튜토리얼 값 초기화</button>
              </Card>
            </Sourced>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button type="button" onClick={previous} disabled={step === 0} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition enabled:hover:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"><ArrowLeft size={15} /> 이전</button>
        <span className="text-xs text-gray-500">{step + 1} / {steps.length}</span>
        <button type="button" onClick={next} disabled={step === steps.length - 1} className="inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-40">다음 <ArrowRight size={15} /></button>
      </div>
    </section>
  );
}
