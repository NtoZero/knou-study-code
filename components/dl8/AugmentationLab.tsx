"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Chip } from "@/components/dlShared/ui";

type Method = "mirror" | "crop" | "color";
const CROP_VIEWS = ["12 8 156 112", "20 14 140 100", "5 14 150 108"];

function CatSketch({ view = "0 0 180 130", mirror = false, hue = 0 }: { view?: string; mirror?: boolean; hue?: number }) {
  return (
    <svg viewBox={view} className="h-full w-full rounded-lg bg-amber-50 dark:bg-amber-950/30" role="img" aria-label="좌우 반전·크롭·색상 증강을 보여 주는 간단한 고양이 그림">
      <g style={{ filter: `hue-rotate(${hue}deg) saturate(1.1)` }} transform={mirror ? "translate(180 0) scale(-1 1)" : undefined}>
        <rect width="180" height="130" fill="#f8e6c8" />
        <circle cx="147" cy="25" r="11" fill="#f5c96b" />
        <path d="M28 116 Q46 80 81 103 Q113 77 150 116Z" fill="#bfd8d0" />
        <path d="M48 57 L52 17 L80 42 Q90 39 100 42 L128 17 L132 60 Q139 79 127 93 Q111 111 90 111 Q69 111 53 94 Q41 79 48 57Z" fill="#d8a77d" stroke="#755443" strokeWidth="3" strokeLinejoin="round" />
        <path d="M56 42 L59 25 L73 41Z M108 41 L122 25 L124 43Z" fill="#e88991" />
        <ellipse cx="72" cy="63" rx="5" ry="7" fill="#294e61" />
        <ellipse cx="108" cy="63" rx="5" ry="7" fill="#294e61" />
        <path d="M84 77 Q90 72 96 77 L90 83Z" fill="#9b5c5e" />
        <path d="M90 83 Q84 91 78 87 M90 83 Q96 91 102 87" fill="none" stroke="#755443" strokeWidth="2" strokeLinecap="round" />
        <path d="M52 77 L24 72 M53 83 L24 88 M128 77 L156 72 M127 83 L156 88" fill="none" stroke="#755443" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function AugmentationLab() {
  const [method, setMethod] = useState<Method>("mirror");
  const [crop, setCrop] = useState(0);
  const [hue, setHue] = useState(38);
  const [answer, setAnswer] = useState<boolean | null>(null);

  return (
    <section id="data-augmentation" className="scroll-mt-32">
      <SectionTitle
        title="이미지 한 장을 여러 학습 예제로"
        subtitle="AlexNet이 사용한 좌우 반전, 임의 크롭, PCA 색상 증강을 직접 바꾸어 보세요."
      />
      <Sourced refs={{ slides: "슬라이드 13–15 — 미러링·랜덤 크롭·PCA 색상 증강", lecture: "음성 전사 25:51–26:59 — 크롭과 PCA RGB 색상 변화" }}>
        <Card>
          <div className="mb-3 flex flex-wrap gap-2">
            <Chip active={method === "mirror"} onClick={() => { setMethod("mirror"); setAnswer(null); }}>좌우 반전</Chip>
            <Chip active={method === "crop"} onClick={() => { setMethod("crop"); setAnswer(null); }}>임의 크롭</Chip>
            <Chip active={method === "color"} onClick={() => { setMethod("color"); setAnswer(null); }}>PCA 색상 증강</Chip>
          </div>

          {method === "mirror" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                <CardTitle>원본 · 고양이</CardTitle>
                <div className="h-40"><CatSketch /></div>
              </div>
              <div className="rounded-xl border border-teal-300 p-3 dark:border-teal-800">
                <CardTitle>좌우 반전 · 같은 범주</CardTitle>
                <div className="h-40"><CatSketch mirror /></div>
              </div>
              <p className="sm:col-span-2 rounded-lg bg-teal-50 px-3 py-2 text-[12px] leading-5 text-teal-900 dark:bg-teal-950/35 dark:text-teal-100">
                그림을 좌우로 뒤집어도 여기서는 고양이라는 범주가 유지돼요. 강의록은 미러링으로 이미지 양을 2배로 늘리는 예를 보여 줘요.
              </p>
            </div>
          )}

          {method === "crop" && (
            <div className="grid gap-3 md:grid-cols-[1fr_0.9fr]">
              <div>
                <CardTitle>원본에서 자를 위치 선택</CardTitle>
                <div className="relative h-48 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <CatSketch />
                  <div className={`pointer-events-none absolute top-3 h-36 w-36 border-2 border-dashed border-teal-600 bg-teal-400/10 ${crop === 0 ? "left-3" : crop === 1 ? "left-10" : "right-3"}`} />
                </div>
                <div className="mt-2 flex gap-2">
                  {CROP_VIEWS.map((_, i) => <Chip key={i} active={crop === i} onClick={() => setCrop(i)}>크롭 {i + 1}</Chip>)}
                </div>
              </div>
              <div className="rounded-xl border border-teal-300 p-3 dark:border-teal-800">
                <CardTitle>잘라낸 예시 · 고양이</CardTitle>
                <div className="h-40"><CatSketch view={CROP_VIEWS[crop]} /></div>
                <p className="mt-2 text-[12px] leading-5 text-gray-600 dark:text-gray-300">
                  256×256 이미지에서 227×227 영역을 임의로 잘라 학습 이미지로 만들어요. 대상의 특징이 보이는 범위에서 위치를 바꾸면 같은 이미지로부터 다른 입력을 얻을 수 있어요.
                </p>
              </div>
            </div>
          )}

          {method === "color" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                <CardTitle>원본 RGB</CardTitle>
                <div className="h-40"><CatSketch /></div>
              </div>
              <div className="rounded-xl border border-violet-300 p-3 dark:border-violet-800">
                <CardTitle>색상 변형 · 같은 범주</CardTitle>
                <div className="h-40"><CatSketch hue={hue} /></div>
              </div>
              <label className="sm:col-span-2 block rounded-lg bg-gray-50 p-3 text-[12px] text-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
                색 변화 예시 <span className="ml-2 font-mono text-violet-700 dark:text-violet-300">{hue}°</span>
                <input aria-label="색상 변화 조절" type="range" min="0" max="180" step="6" value={hue} onChange={(e) => setHue(Number(e.target.value))} className="mt-2 w-full accent-violet-600" />
                <span className="mt-1 block text-[11px] leading-5 text-gray-500">주성분 분석(PCA)은 학습 이미지의 RGB 값이 함께 크게 변하는 방향을 찾습니다. 그 방향으로 색을 조금 옮기면 같은 고양이를 서로 다른 조명에서 본 듯한 학습 예가 생겨요. 이 막대는 색 변화의 예시이며 PCA를 계산하는 장치는 아니에요.</span>
              </label>
            </div>
          )}

          <div className="mt-4 rounded-xl border border-gray-200 p-3 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">확인: 데이터 증강은 무엇을 늘릴까요?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={() => setAnswer(true)} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${answer === true ? "border-teal-500 bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200" : "border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300"}`}>모델의 파라미터 수</button>
              <button type="button" onClick={() => setAnswer(false)} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${answer === false ? "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200" : "border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300"}`}>특징을 유지한 학습 이미지의 다양성</button>
            </div>
            {answer !== null && <p className={`mt-2 text-xs leading-5 ${answer ? "text-rose-700 dark:text-rose-300" : "text-teal-700 dark:text-teal-300"}`}>{answer ? "파라미터 수를 늘리는 것은 아니에요. 합성곱 신경망의 가중치는 그대로예요." : "맞아요. 변형한 입력을 더해 다양한 모습을 학습하고 일반화 성능을 높이는 데 도움을 줘요."}</p>}
          </div>
        </Card>
      </Sourced>
    </section>
  );
}
