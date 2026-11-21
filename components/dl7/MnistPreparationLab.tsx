"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Card, Chip, Formula } from "@/components/dlShared/ui";
import { Sourced } from "@/components/dlShared/SourceFilter";

export default function MnistPreparationLab() {
  const [pixel, setPixel] = useState(204);
  const [label, setLabel] = useState(7);
  const [encoding, setEncoding] = useState<"index" | "onehot">("index");
  const normalized = pixel / 255;
  const rawTanh = Math.tanh(pixel);
  const scaledTanh = Math.tanh(normalized);
  const rawGradient = 1 - rawTanh ** 2;
  const scaledGradient = 1 - scaledTanh ** 2;
  const oneHot = Array.from({ length: 10 }, (_, i) => i === label ? 1 : 0);

  return (
    <section>
      <SectionTitle title="MNIST 입력과 레이블 표현" subtitle="픽셀 크기 조정과 클래스 표기 방식을 바꿔 학습 입력의 모양을 확인하세요" />
      <Sourced refs={{ slides: "강의록 7강 PDF 7–8·23–26쪽 — MNIST 입력·패딩·정규화·레이블 인코딩", lecture: "강의 7강 15:22–15:53, 42:46–44:01 — 입력 크기와 클래스 인덱스/원-핫" }}>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <div className="mb-3">
              <h3 className="text-sm font-bold">28 × 28 숫자 이미지 준비</h3>
              <p className="mt-1 text-xs leading-5 text-gray-500">MNIST 숫자는 그레이스케일 픽셀값으로 구성. LeNet-5 입력에서는 테두리 패딩으로 32 × 32 크기에 맞춤.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-[0.8fr_1.2fr] sm:items-center">
              <div className="mx-auto w-full max-w-[12rem] rounded-xl border border-gray-200 bg-gray-950 p-3 dark:border-gray-700">
                <div className="grid aspect-square grid-cols-8 gap-[2px] rounded-md bg-gray-800 p-2">
                  {Array.from({ length: 64 }, (_, i) => {
                    const row = Math.floor(i / 8);
                    const col = i % 8;
                    const stroke = (row === 1 && col > 1 && col < 6) || (row === 2 && col === 1) || (row === 2 && col === 6) || (row === 3 && col > 1 && col < 6) || (row === 4 && col === 6) || (row === 5 && col > 1 && col < 6) || (row === 6 && col === 1);
                    return <div key={i} className={`rounded-[2px] ${stroke ? "bg-white" : "bg-gray-900"}`} style={{ opacity: stroke ? 0.35 + (pixel / 255) * 0.65 : 1 }} />;
                  })}
                </div>
                <div className="mt-2 text-center text-[9px] text-gray-400">손글씨 숫자 픽셀의 간단한 도식</div>
              </div>
              <div className="space-y-3">
                <label className="block rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <span className="flex justify-between text-[11px] font-semibold"><span>선택한 원 픽셀값</span><span className="font-mono">{pixel} / 255</span></span>
                  <input type="range" min="0" max="255" step="1" value={pixel} onChange={(e) => setPixel(Number(e.target.value))} className="mt-2 w-full accent-amber-500" />
                  <div className="mt-2 grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800"><div className="text-[9px] text-gray-500">정규화 전</div><div className="font-mono text-sm font-bold">{pixel}</div></div>
                    <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-950/30"><div className="text-[9px] text-amber-700 dark:text-amber-300">0~1 범위로</div><div className="font-mono text-sm font-bold text-amber-800 dark:text-amber-100">{normalized.toFixed(3)}</div></div>
                  </div>
                </label>
                <Formula className="border-amber-100 bg-amber-50/70 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
                  정규화한 픽셀 = 원 픽셀 ÷ 255
                </Formula>
              </div>
            </div>
            <div className="mt-3 rounded-lg border-l-2 border-amber-400 bg-amber-50/60 px-3 py-2 text-[10px] leading-5 text-amber-950 dark:bg-amber-950/20 dark:text-amber-100">
              단일 픽셀값을 바로 tanh에 넣는 단순 시연: tanh({pixel}) = {rawTanh.toFixed(3)}, 미분 크기 {rawGradient.toFixed(4)} · tanh({normalized.toFixed(3)}) = {scaledTanh.toFixed(3)}, 미분 크기 {scaledGradient.toFixed(3)}. 큰 값이 활성함수의 포화 영역에 들어갈 수 있음을 보여주는 직관이며, 실제 층의 입력은 가중합 결과에 따라 달라짐.
            </div>
          </Card>

          <Card>
            <div>
              <h3 className="text-sm font-bold">정답 레이블을 나타내는 두 방식</h3>
              <p className="mt-1 text-xs leading-5 text-gray-500">클래스 인덱스는 각 범주에 정수 번호를 지정. 원-핫 벡터는 정답 위치만 1, 나머지는 0으로 표시.</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">정답 숫자
                <select value={label} onChange={(e) => setLabel(Number(e.target.value))} className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 font-mono dark:border-gray-700 dark:bg-gray-900">
                  {Array.from({ length: 10 }, (_, i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </label>
              <div className="flex gap-1">
                <Chip active={encoding === "index"} onClick={() => setEncoding("index")}>클래스 인덱스</Chip>
                <Chip active={encoding === "onehot"} onClick={() => setEncoding("onehot")}>원-핫</Chip>
              </div>
            </div>
            {encoding === "index" ? (
              <div className="mt-5 rounded-xl bg-gray-950 p-5 text-center text-white">
                <div className="text-[10px] text-gray-400">정답 레이블 · 정수 하나</div>
                <div className="mt-2 font-mono text-4xl font-black text-amber-300">{label}</div>
                <div className="mt-2 text-[10px] text-gray-400">10개 숫자 범주에 각각 0부터 9까지 부여</div>
              </div>
            ) : (
              <div className="mt-5 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/70">
                <div className="mb-2 text-center text-[10px] text-gray-500">정답 위치 하나만 1인 벡터</div>
                <div className="flex flex-wrap justify-center gap-1">
                  {oneHot.map((value, index) => <div key={index} className={`flex h-10 w-10 flex-col items-center justify-center rounded-lg border font-mono text-xs ${value ? "border-amber-400 bg-amber-100 font-bold text-amber-900 dark:border-amber-700 dark:bg-amber-900/50 dark:text-amber-100" : "border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900"}`}><span>{value}</span><span className="text-[8px]">{index}</span></div>)}
                </div>
              </div>
            )}
            <div className="mt-4 rounded-lg border-l-2 border-amber-400 bg-amber-50/60 px-3 py-2 text-[11px] leading-5 text-amber-950 dark:bg-amber-950/20 dark:text-amber-100">선택한 숫자 <b>{label}</b>은 클래스 인덱스 방식에서 <b>{label}</b>, 원-핫 방식에서 <span className="font-mono">[{oneHot.join(",")}]</span>으로 표현.</div>
          </Card>
        </div>
      </Sourced>
    </section>
  );
}
