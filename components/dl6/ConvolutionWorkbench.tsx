"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Card, Chip, Formula, Scroller } from "@/components/dlShared/ui";
import { Sourced } from "@/components/dlShared/SourceFilter";

const image = [
  [0, 0, 1, 2, 2],
  [0, 1, 2, 2, 1],
  [0, 1, 3, 2, 0],
  [0, 0, 1, 1, 0],
  [1, 1, 0, 0, 0],
];

const kernels = {
  vertical: { label: "세로 경계", values: [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]] },
  horizontal: { label: "가로 경계", values: [[-1, -1, -1], [0, 0, 0], [1, 1, 1]] },
  center: { label: "중심 강조", values: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]] },
} as const;
type KernelKey = keyof typeof kernels;

function windowsFor(stride: number, padding: number) {
  const side = image.length + padding * 2;
  const count = Math.floor((side - 3) / stride) + 1;
  return Array.from({ length: count * count }, (_, i) => ({ row: Math.floor(i / count), col: i % count }));
}

function valueAt(row: number, col: number, padding: number) {
  const sourceRow = row - padding;
  const sourceCol = col - padding;
  return image[sourceRow]?.[sourceCol] ?? 0;
}

export default function ConvolutionWorkbench() {
  const [kernelKey, setKernelKey] = useState<KernelKey>("vertical");
  const [stride, setStride] = useState(1);
  const [padding, setPadding] = useState(0);
  const [step, setStep] = useState(0);
  const kernel = kernels[kernelKey].values;
  const windows = useMemo(() => windowsFor(stride, padding), [stride, padding]);
  const side = Math.floor((image.length + padding * 2 - 3) / stride) + 1;
  const results = windows.map(({ row, col }) => {
    let sum = 0;
    for (let r = 0; r < 3; r += 1) {
      for (let c = 0; c < 3; c += 1) {
        sum += valueAt(row * stride + r, col * stride + c, padding) * kernel[r][c];
      }
    }
    return sum;
  });
  const visibleResults = results.map((value, index) => (index < step ? value : null));
  const active = windows[Math.min(step, Math.max(0, windows.length - 1))];

  function changeShape(update: () => void) {
    update();
    setStep(0);
  }

  return (
    <section>
      <SectionTitle title="필터가 특징 맵을 만드는 과정" subtitle="창의 위치를 한 칸씩 옮기며 곱의 합을 직접 확인하세요" />
      <Sourced refs={{ slides: "강의록 6강 PDF 17–27쪽 — 합성곱 연산·채널·필터·스트라이드·패딩·특징 맵 크기", lecture: "강의 6강 30:07–30:53, 38:20–38:45 — 필터 이동과 4×4 입력 연산 추적" }}>
        <Card className="border-cyan-200 dark:border-cyan-900">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold">입력 이미지와 필터</h3>
              <p className="mt-1 text-xs text-gray-500">예시 숫자 행렬에 창을 적용한 계산 시연. 실제 CNN 필터의 가중치는 학습으로 정해짐.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(kernels) as KernelKey[]).map((key) => (
                <Chip key={key} active={kernelKey === key} onClick={() => changeShape(() => setKernelKey(key))}>
                  {kernels[key].label}
                </Chip>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_auto_0.9fr] lg:items-center">
            <Matrix title="입력" values={image} active={active} stride={stride} padding={padding} />
            <div className="hidden text-2xl font-light text-gray-300 lg:block" aria-hidden="true">×</div>
            <Matrix title={`필터 · ${kernels[kernelKey].label}`} values={kernel} active={{ row: 0, col: 0 }} stride={1} padding={0} />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[1.05fr_1fr]">
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-bold">특징 맵 · {side} × {side}</h4>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setStep(0)} className="rounded-md border border-gray-200 px-2 py-1 text-[11px] dark:border-gray-700">처음</button>
                  <button type="button" onClick={() => setStep((n) => Math.min(windows.length, n + 1))} disabled={step >= windows.length} className="rounded-md bg-cyan-600 px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-40">다음 창</button>
                  <button type="button" onClick={() => setStep(windows.length)} className="rounded-md border border-cyan-300 px-2 py-1 text-[11px] font-semibold text-cyan-700 dark:border-cyan-800 dark:text-cyan-300">모두 보기</button>
                </div>
              </div>
              <div className="mx-auto grid w-fit gap-1" style={{ gridTemplateColumns: `repeat(${side}, minmax(2.65rem, 1fr))` }}>
                {visibleResults.map((value, i) => (
                  <div key={i} className={`flex h-10 min-w-10 items-center justify-center rounded-lg border font-mono text-sm font-bold ${value === null ? "border-dashed border-gray-300 bg-white/60 text-gray-300 dark:border-gray-700 dark:bg-gray-900/40" : "border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950/50 dark:text-cyan-100"}`}>
                    {value === null ? "·" : value}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-center text-[11px] text-gray-500">{step === 0 ? "아직 계산하지 않음" : `${Math.min(step, windows.length)} / ${windows.length}개 위치 계산`}</p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="rounded-xl border border-gray-200 p-3 text-xs dark:border-gray-700">
                  <span className="mb-2 block font-semibold">스트라이드</span>
                  <select value={stride} onChange={(e) => changeShape(() => setStride(Number(e.target.value)))} className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 font-mono dark:border-gray-700 dark:bg-gray-900">
                    <option value={1}>1칸</option><option value={2}>2칸</option>
                  </select>
                  <span className="mt-1 block text-[10px] text-gray-500">창이 이동하는 간격</span>
                </label>
                <label className="rounded-xl border border-gray-200 p-3 text-xs dark:border-gray-700">
                  <span className="mb-2 block font-semibold">패딩</span>
                  <select value={padding} onChange={(e) => changeShape(() => setPadding(Number(e.target.value)))} className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 font-mono dark:border-gray-700 dark:bg-gray-900">
                    <option value={0}>0 · 없음</option><option value={1}>1 · 바깥 1칸</option>
                  </select>
                  <span className="mt-1 block text-[10px] text-gray-500">바깥에 0을 덧붙임</span>
                </label>
              </div>
              <Formula className="border-cyan-100 bg-cyan-50/70 text-cyan-900 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-100" note="높이와 너비에 같은 규칙을 적용">
                출력 크기 = ⌊(입력 − 필터 + 2 × 패딩) ÷ 스트라이드⌋ + 1
              </Formula>
              <p className="rounded-lg border-l-2 border-cyan-400 bg-cyan-50/60 px-3 py-2 text-[11px] leading-5 text-cyan-900 dark:bg-cyan-950/20 dark:text-cyan-100">
                현재 계산: ⌊(5 − 3 + 2 × {padding}) ÷ {stride}⌋ + 1 = <b>{side}</b>. 각 위치에서 겹치는 원소끼리 곱한 뒤 모두 더해 특징 맵의 한 값을 만듦.
              </p>
            </div>
          </div>
        </Card>
      </Sourced>
    </section>
  );
}

function Matrix({
  title,
  values,
  active,
  stride,
  padding,
}: {
  title: string;
  values: readonly (readonly number[])[];
  active: { row: number; col: number } | undefined;
  stride: number;
  padding: number;
}) {
  const isImage = title === "입력";
  const rows = isImage ? values.length + padding * 2 : values.length;
  const cols = isImage ? values[0].length + padding * 2 : values[0].length;
  return (
    <div>
      <div className="mb-2 text-center text-[11px] font-semibold text-gray-500">{title}</div>
      <Scroller>
        <div className="mx-auto grid w-fit gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(2.25rem, 1fr))` }}>
          {Array.from({ length: rows * cols }, (_, i) => {
            const r = Math.floor(i / cols);
            const c = i % cols;
            const v = isImage ? valueAt(r, c, padding) : values[r][c];
            const inWindow = isImage && active ? r >= active.row * stride && r < active.row * stride + 3 && c >= active.col * stride && c < active.col * stride + 3 : false;
            const padded = isImage && (r < padding || c < padding || r >= rows - padding || c >= cols - padding);
            return (
              <div key={i} className={`flex h-9 w-9 items-center justify-center rounded-md border font-mono text-xs ${padded ? "border-gray-200 bg-gray-100 text-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-700" : inWindow ? "border-cyan-500 bg-cyan-100 font-bold text-cyan-900 ring-2 ring-cyan-300 dark:bg-cyan-900/50 dark:text-cyan-100" : "border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"}`}>
                {v}
              </div>
            );
          })}
        </div>
      </Scroller>
      {isImage && padding > 0 && <p className="mt-1 text-center text-[10px] text-gray-400">회색 칸은 추가한 0 패딩</p>}
    </div>
  );
}
