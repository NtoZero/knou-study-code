"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Chip } from "@/components/dlShared/ui";

const PIXELS = [
  "0001101100",
  "0011111110",
  "0111111111",
  "1110110111",
  "1111111111",
  "1111111111",
  "0110110110",
  "0011111100",
  "0001101100",
  "0011001100",
].map((row) => row.split("").map(Number));

const CHECKS = [
  {
    q: "10×10 픽셀에 3×3 필터를 한 번 적용해요. stride 1, 패딩 없음일 때 결과의 크기는?",
    choices: ["8×8", "7×7", "10×10"],
    answer: 0,
    explain: "필터가 3칸을 덮고 stride 1로 이동하므로 10−3+1=8칸이 남아요. 위·아래·왼쪽·오른쪽마다 한 번씩 좁아져 8×8이에요.",
  },
  {
    q: "VGG16에서 숫자 16은 무엇을 말하나요?",
    choices: ["최대 풀링 횟수", "가중치를 포함하는 층의 수", "필터의 가로 크기"],
    answer: 1,
    explain: "VGG16은 합성곱층 13개와 완전연결층 3개를 합한 16개를 뜻해요. 풀링층은 가중치를 포함하는 층으로 세지 않아요.",
  },
  {
    q: "고양이 사진을 좌우 반전해 학습 데이터로 추가했어요. 범주 표시는 어떻게 할까요?",
    choices: ["고양이 그대로", "새로운 범주로 변경", "정답 표시를 삭제"],
    answer: 0,
    explain: "이 예에서는 좌우 반전 뒤에도 이미지의 대상이 고양이로 남아요. 데이터 증강은 특징을 유지한 변형 입력을 더해 학습 다양성을 높여요.",
  },
];

const LESSON_STEPS = ["사진을 숫자로 보기", "작은 필터가 훑기", "필터를 쌓기", "입력을 다양하게", "스스로 확인"];

export default function BeginnerWalkthrough() {
  const [step, setStep] = useState(0);
  const [row, setRow] = useState(3);
  const [col, setCol] = useState(3);
  const [layerCount, setLayerCount] = useState(3);
  const [transform, setTransform] = useState<"mirror" | "crop" | "color">("mirror");
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [done, setDone] = useState(false);
  const windowSum = useMemo(() => PIXELS.slice(row, row + 3).reduce((sum, line) => sum + line.slice(col, col + 3).reduce((a, b) => a + b, 0), 0), [row, col]);
  const receptive = 2 * layerCount + 1;

  const choose = (question: number, choice: number) => setAnswers((current) => ({ ...current, [question]: choice }));
  const reset = () => { setStep(0); setRow(3); setCol(3); setLayerCount(3); setAnswers({}); setDone(false); };

  return (
    <article className="mx-auto max-w-5xl px-4 py-8 max-sm:pl-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/dl/lecture/8" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900 dark:text-teal-300 dark:hover:text-teal-100">
          <ArrowLeft size={16} /> 8강 학습으로 돌아가기
        </Link>
        <Link href="/dl/lecture/8#quiz" className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">복습 퀴즈 바로가기</Link>
      </div>

      <header className="mb-8 rounded-2xl border-l-4 border-teal-500 bg-teal-50 p-6 dark:bg-teal-950/40">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">딥러닝 · 8강 쉬운 설명</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">사진을 나누어 보고, 작은 필터를 쌓아 보기</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-700 dark:text-gray-200">
          합성곱 신경망이 처음이라도 괜찮아요. 고양이 그림 한 장으로 픽셀, 3×3 필터, VGGNet의 층 쌓기, 이미지 변형을 차례로 따라가요.
        </p>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {LESSON_STEPS.map((label, i) => <button key={label} type="button" onClick={() => setStep(i)} aria-pressed={step === i} className={`rounded-lg border px-2 py-2 text-left text-[11px] font-semibold ${step === i ? "border-teal-500 bg-teal-50 text-teal-900 dark:bg-teal-950/50 dark:text-teal-100" : "border-gray-200 text-gray-500 dark:border-gray-700"}`}>
          <span className="mr-1 text-gray-400">{i + 1}</span>{label}
        </button>)}
      </div>

      <section className="mb-6">
        <SectionTitle title={LESSON_STEPS[step]} subtitle={`단계 ${step + 1} / ${LESSON_STEPS.length}`} />

        {step === 0 && (
          <Sourced refs={{ slides: "슬라이드 6–7 — AlexNet 입력·특징 맵" }}>
            <Card>
              <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
                  <CardTitle>이 그림은 작은 고양이 사진이라고 해 볼게요</CardTitle>
                  <div className="mx-auto grid w-fit gap-[2px] rounded-md border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-gray-950" style={{ gridTemplateColumns: "repeat(10, 1.25rem)" }} role="img" aria-label="0과 1로 표시한 10 곱하기 10 고양이 사진 예시">
                    {PIXELS.flatMap((line, y) => line.map((pixel, x) => <span key={`${y}-${x}`} className={`h-5 w-5 rounded-[2px] ${pixel ? "bg-slate-700 dark:bg-slate-300" : "bg-slate-100 dark:bg-slate-800"}`} />))}
                  </div>
                  <p className="mt-3 text-center text-[11px] leading-5 text-gray-500">밝은 칸은 0, 어두운 칸은 1로 단순화한 그림</p>
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg border border-sky-200 p-3 dark:border-sky-900">
                    <p className="text-xs font-bold text-sky-800 dark:text-sky-200">픽셀</p>
                    <p className="mt-1 text-[12px] leading-5 text-gray-700 dark:text-gray-300">사진을 이루는 작은 칸 하나. 실제 컬러 사진은 칸마다 빨강·초록·파랑 값이 있어요.</p>
                  </div>
                  <div className="rounded-lg border border-violet-200 p-3 dark:border-violet-900">
                    <p className="text-xs font-bold text-violet-800 dark:text-violet-200">필터</p>
                    <p className="mt-1 text-[12px] leading-5 text-gray-700 dark:text-gray-300">작은 창 안의 픽셀을 한 번에 살펴보는 계산 도구. 학습을 거치며 어떤 무늬에 반응할지 가중치가 정해져요.</p>
                  </div>
                  <div className="rounded-lg border border-amber-200 p-3 dark:border-amber-900">
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-200">특징 맵</p>
                    <p className="mt-1 text-[12px] leading-5 text-gray-700 dark:text-gray-300">필터를 사진 위로 움직여 계산한 결과를 모아 만든 새 그림. 뒤쪽 층은 이 결과를 받아 더 복잡한 모양을 찾을 수 있어요.</p>
                  </div>
                </div>
              </div>
            </Card>
          </Sourced>
        )}

        {step === 1 && (
          <Sourced refs={{ slides: "슬라이드 28–29 — 3×3 필터 연산과 특징 맵" }}>
            <Card>
              <p className="mb-3 text-[12px] leading-5 text-gray-700 dark:text-gray-300">
                초록 창을 그림 위에서 움직여 보세요. 계산을 쉽게 보려고 이 예제의 3×3 필터는 모든 가중치가 1이라고 가정해요. 창 안의 어두운 칸 개수가 이 위치의 출력이에요. 실제 신경망은 학습된 가중치를 사용해요.
              </p>
              <div className="grid gap-4 md:grid-cols-[1fr_0.8fr]">
                <div>
                  <div className="mx-auto grid w-fit gap-[2px] rounded-md border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-gray-950" style={{ gridTemplateColumns: "repeat(10, 1.25rem)" }} role="img" aria-label="위치를 바꿀 수 있는 3 곱하기 3 필터 창">
                    {PIXELS.flatMap((line, y) => line.map((pixel, x) => {
                      const inside = y >= row && y < row + 3 && x >= col && x < col + 3;
                      return <span key={`${y}-${x}`} className={`flex h-5 w-5 items-center justify-center rounded-[2px] text-[10px] ${inside ? "bg-emerald-300 text-emerald-950 ring-1 ring-emerald-700 dark:bg-emerald-700 dark:text-white" : pixel ? "bg-slate-700 text-white dark:bg-slate-300 dark:text-gray-900" : "bg-slate-100 text-gray-400 dark:bg-slate-800"}`}>{pixel}</span>;
                    }))}
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">창을 오른쪽으로
                      <input aria-label="필터 창의 가로 위치" type="range" min="0" max="7" value={col} onChange={(e) => setCol(Number(e.target.value))} className="mt-1 w-full accent-emerald-600" />
                    </label>
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">창을 아래로
                      <input aria-label="필터 창의 세로 위치" type="range" min="0" max="7" value={row} onChange={(e) => setRow(Number(e.target.value))} className="mt-1 w-full accent-emerald-600" />
                    </label>
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/25">
                  <CardTitle>창 안에서 직접 더하기</CardTitle>
                  <div className="grid w-fit grid-cols-3 gap-1 rounded-lg bg-white p-2 font-mono text-sm font-bold text-gray-800 dark:bg-gray-900 dark:text-gray-100">
                    {PIXELS.slice(row, row + 3).flatMap((line) => line.slice(col, col + 3).map((pixel, i) => <span key={i} className="flex h-8 w-8 items-center justify-center rounded bg-emerald-100 dark:bg-emerald-900/50">{pixel}</span>))}
                  </div>
                  <p className="mt-3 font-mono text-lg font-bold text-emerald-800 dark:text-emerald-200">출력 = {windowSum}</p>
                  <p className="mt-1 text-[11px] leading-5 text-gray-600 dark:text-gray-300">이 작은 덧셈 결과도 전체 위치에서 모으면 특징 맵 한 장이 돼요.</p>
                </div>
              </div>
            </Card>
          </Sourced>
        )}

        {step === 2 && (
          <Sourced refs={{ slides: "슬라이드 28–29 — 7×7 필터와 세 번의 3×3 비교" }}>
            <Card>
              <p className="mb-3 text-[12px] leading-5 text-gray-700 dark:text-gray-300">VGGNet은 작은 3×3 필터를 반복해서 쌓아요. 몇 층을 겹칠지 선택해 보세요. 여기서는 10×10 그림, stride 1, 패딩 없음, 한 입력 채널과 한 출력 채널을 가정해요.</p>
              <div className="mb-4 flex flex-wrap gap-2">{[1, 2, 3].map((n) => <Chip key={n} active={layerCount === n} onClick={() => setLayerCount(n)}>{n}층</Chip>)}</div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-violet-50 p-3 dark:bg-violet-950/35"><p className="text-[10px] font-bold text-violet-800 dark:text-violet-200">입력 크기</p><p className="mt-1 font-mono text-lg font-bold">10×10 → {Array.from({ length: layerCount }, (_, i) => 10 - 2 * (i + 1)).join(" → ")}</p><p className="mt-1 text-[10px] text-gray-500">3×3 유효 합성곱을 층마다 적용</p></div>
                <div className="rounded-lg bg-sky-50 p-3 dark:bg-sky-950/35"><p className="text-[10px] font-bold text-sky-800 dark:text-sky-200">한 점이 보는 범위</p><p className="mt-1 font-mono text-lg font-bold">{receptive}×{receptive}</p><p className="mt-1 text-[10px] text-gray-500">3 → 5 → 7로 넓어짐</p></div>
                <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950/35"><p className="text-[10px] font-bold text-amber-800 dark:text-amber-200">가중치</p><p className="mt-1 font-mono text-lg font-bold">{9 * layerCount}개</p><p className="mt-1 text-[10px] text-gray-500">한 번의 7×7 필터는 49개</p></div>
              </div>
              <p className="mt-3 rounded-lg bg-gray-50 p-3 text-[12px] leading-5 text-gray-700 dark:bg-gray-800/60 dark:text-gray-200">3층을 고르면 큰 7×7 필터와 같은 범위를 보면서, 이 단순 비교에서 가중치는 27개예요. 층마다 활성함수가 들어가 여러 번 비선형 변환을 할 수 있어요.</p>
            </Card>
          </Sourced>
        )}

        {step === 3 && (
          <Sourced refs={{ slides: "슬라이드 13–16 — 데이터 증강·드롭아웃" }}>
            <Card>
              <CardTitle>사진을 바꾸는 방법과 모델을 바꾸는 방법</CardTitle>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-teal-200 p-4 dark:border-teal-900">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {(["mirror", "crop", "color"] as const).map((item) => <Chip key={item} active={transform === item} onClick={() => setTransform(item)}>{item === "mirror" ? "반전" : item === "crop" ? "크롭" : "색 변화"}</Chip>)}
                  </div>
                  <div className="flex h-32 items-center justify-center overflow-hidden rounded-lg bg-amber-50 dark:bg-amber-950/30">
                    <div className={`text-7xl transition-transform ${transform === "mirror" ? "scale-x-[-1]" : transform === "crop" ? "scale-125 translate-x-3" : "hue-rotate-60"}`}>🐈</div>
                  </div>
                  <p className="mt-2 text-[11px] leading-5 text-gray-600 dark:text-gray-300">좌우 반전, 임의 크롭, RGB 색상 변화로 입력을 다양하게 만들어요. 여기서 색 변화는 눈으로 보는 예시이며 강의의 PCA 색상 증강은 채널별 분산을 이용해요.</p>
                </div>
                <div className="rounded-xl border border-violet-200 p-4 dark:border-violet-900">
                  <p className="text-sm font-bold text-violet-900 dark:text-violet-100">드롭아웃은 사진이 아니라 학습 중 연결을 바꿔요</p>
                  <div className="my-4 flex items-center justify-center gap-5" aria-label="드롭아웃으로 일부 은닉 뉴런을 생략하는 예">
                    {[0, 1, 2, 3, 4].map((node) => <span key={node} className={`h-8 w-8 rounded-full border-2 ${node === 1 || node === 3 ? "border-dashed border-gray-300 bg-gray-100 dark:bg-gray-800" : "border-violet-500 bg-violet-200 dark:bg-violet-900"}`} />)}
                  </div>
                  <p className="text-[11px] leading-5 text-gray-600 dark:text-gray-300">학습 중 은닉층 노드 일부를 생략해 과적합을 줄이는 방법이에요. 입력 이미지를 바꾸는 데이터 증강과는 조작 대상이 달라요.</p>
                </div>
              </div>
            </Card>
          </Sourced>
        )}

        {step === 4 && (
          <Card>
            <p className="mb-3 text-[12px] leading-5 text-gray-600 dark:text-gray-300">각 문항을 골라 바로 확인해요. 틀려도 다시 선택할 수 있어요.</p>
            <div className="space-y-4">
              {CHECKS.map((check, qi) => {
                const selected = answers[qi];
                const correct = selected === check.answer;
                return <div key={check.q} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{qi + 1}. {check.q}</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    {check.choices.map((choice, ci) => <button key={choice} type="button" onClick={() => choose(qi, ci)} className={`rounded-lg border p-2 text-left text-xs ${selected === ci ? ci === check.answer ? "border-teal-500 bg-teal-50 text-teal-900 dark:bg-teal-950/40 dark:text-teal-100" : "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100" : "border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300"}`}>{choice}</button>)}
                  </div>
                  {selected !== undefined && selected !== null && <p className={`mt-2 text-[11px] leading-5 ${correct ? "text-teal-800 dark:text-teal-200" : "text-rose-800 dark:text-rose-200"}`}>{correct ? "맞았어요. " : "다시 생각해 볼게요. "}{check.explain}</p>}
                </div>;
              })}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => setDone(true)} className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700">내 결과 확인</button>
              <button type="button" onClick={reset} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300"><RotateCcw size={13} />처음부터</button>
              {done && <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">맞힌 문항 {CHECKS.filter((check, i) => answers[i] === check.answer).length} / {CHECKS.length}</span>}
            </div>
          </Card>
        )}
      </section>

      <div className="flex items-center justify-between border-t border-gray-200 pt-5 dark:border-gray-800">
        <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"><ArrowLeft size={14} />이전</button>
        <span className="text-[11px] text-gray-400">{step + 1} / {LESSON_STEPS.length}</span>
        <button type="button" onClick={() => setStep((current) => Math.min(LESSON_STEPS.length - 1, current + 1))} disabled={step === LESSON_STEPS.length - 1} className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40">다음<ArrowRight size={14} /></button>
      </div>
      <p className="mt-6 text-center text-[11px] leading-5 text-gray-400">더 자세한 구조와 인터랙티브 실험은 <Link className="font-semibold text-teal-700 hover:underline dark:text-teal-300" href="/dl/lecture/8">8강 학습 페이지</Link>에서 이어가요.</p>
    </article>
  );
}
