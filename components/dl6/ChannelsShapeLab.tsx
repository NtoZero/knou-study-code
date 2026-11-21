"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Card, Formula, Scroller } from "@/components/dlShared/ui";
import { Sourced } from "@/components/dlShared/SourceFilter";

export default function ChannelsShapeLab() {
  const [color, setColor] = useState(true);
  const [filters, setFilters] = useState(3);
  const [kernel, setKernel] = useState(3);
  const [stride, setStride] = useState(1);
  const [padding, setPadding] = useState(1);
  const [activation, setActivation] = useState<"relu" | "tanh" | "sigmoid">("relu");
  const [preActivation, setPreActivation] = useState(0.6);
  const channels = color ? 3 : 1;
  const input = 8;
  const output = Math.floor((input - kernel + 2 * padding) / stride) + 1;
  const activationValue = activation === "relu" ? Math.max(0, preActivation) : activation === "tanh" ? Math.tanh(preActivation) : 1 / (1 + Math.exp(-preActivation));

  return (
    <section>
      <SectionTitle title="채널 수와 필터 수를 구분하기" subtitle="필터 하나는 입력의 모든 채널을 함께 훑고, 특징 맵 하나를 냅니다" />
      <Sourced refs={{ slides: "강의록 6강 PDF 16–29쪽 — 입력 형식·합성곱층·필터 수·Conv2D API", lecture: "강의 6강 29:35–30:53, 49:06–50:06 — 채널 형식과 필터·커널·스트라이드·패딩·활성함수" }}>
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold">입력의 깊이에서 출력의 깊이로</h3>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500">컬러 이미지는 R·G·B 세 채널을 갖지만, 필터가 하나라면 채널별 연산 결과를 합쳐 특징 맵 하나를 만듦. 출력 특징 맵 수는 적용한 필터 수와 같음.</p>
            </div>
            <div className="flex rounded-lg border border-gray-200 p-1 dark:border-gray-700">
              <button type="button" aria-pressed={color} onClick={() => setColor(true)} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${color ? "bg-cyan-600 text-white" : "text-gray-500"}`}>RGB 컬러</button>
              <button type="button" aria-pressed={!color} onClick={() => setColor(false)} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${!color ? "bg-cyan-600 text-white" : "text-gray-500"}`}>그레이스케일</button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto_1.15fr_auto_0.9fr] lg:items-center">
            <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
              <div className="mb-2 flex items-center justify-between text-[11px] font-bold"><span>입력 이미지</span><span className="font-mono text-gray-400">8 × 8 × {channels}</span></div>
              <div className={`mx-auto grid aspect-square max-w-44 gap-0.5 rounded-lg p-1 ${color ? "grid-cols-3 bg-slate-100 dark:bg-slate-800" : "grid-cols-1 bg-slate-100 dark:bg-slate-800"}`}>
                {(color ? ["R", "G", "B"] : ["Gray"]).map((channel, i) => (
                  <div key={channel} className="rounded-md border border-white/70 bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
                    <div className={`mb-1 text-center text-[9px] font-bold ${i === 0 && color ? "text-rose-500" : i === 1 && color ? "text-emerald-500" : i === 2 && color ? "text-blue-500" : "text-gray-500"}`}>{channel}</div>
                    <div className="grid grid-cols-4 gap-0.5">
                      {Array.from({ length: 16 }, (_, n) => <div key={n} className={`aspect-square rounded-[2px] ${color && i === 0 ? "bg-rose-400" : color && i === 1 ? "bg-emerald-400" : color && i === 2 ? "bg-blue-400" : "bg-gray-400"}`} style={{ opacity: 0.18 + (((n * 7 + i * 3) % 11) / 12) }} />)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-center text-[10px] text-gray-500">각 채널의 같은 위치를 살핌</div>
            </div>

            <div className="hidden text-xl text-gray-300 lg:block" aria-hidden="true">→</div>

            <div className="rounded-xl border border-cyan-200 bg-cyan-50/40 p-3 dark:border-cyan-900 dark:bg-cyan-950/15">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] font-bold">채널별 연산 후 합산</div>
                <label className="flex items-center gap-2 text-[10px] text-gray-600 dark:text-gray-300">필터 수
                  <select value={filters} onChange={(e) => setFilters(Number(e.target.value))} className="rounded-md border border-gray-200 bg-white px-2 py-1 font-mono dark:border-gray-700 dark:bg-gray-900">
                    <option value={1}>1</option><option value={3}>3</option><option value={6}>6</option>
                  </select>
                </label>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: channels }, (_, channel) => (
                  <div key={channel} className="flex h-14 w-14 flex-col items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                    <span className="font-mono text-lg font-bold text-cyan-700 dark:text-cyan-300">Σ</span>
                    <span className="text-[9px] text-gray-400">{color ? ["R", "G", "B"][channel] : "Gray"}</span>
                  </div>
                ))}
                <span className="text-xs text-gray-400">채널별 결과 더하기</span>
                <span className="text-gray-300">→</span>
                <div className="grid grid-cols-2 gap-1">
                  {Array.from({ length: filters }, (_, filter) => <div key={filter} className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-300 bg-cyan-100 text-[10px] font-bold text-cyan-900 dark:border-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-100">맵 {filter + 1}</div>)}
                </div>
              </div>
              <p className="mt-3 text-center text-[10px] leading-4 text-gray-500">필터 1개 = 입력 채널 전체를 보는 가중치 묶음 1개 = 출력 특징 맵 1개</p>
            </div>

            <div className="hidden text-xl text-gray-300 lg:block" aria-hidden="true">→</div>

            <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4 text-center dark:border-violet-900 dark:bg-violet-950/20">
              <div className="text-[10px] font-semibold text-violet-700 dark:text-violet-300">특징 맵 텐서</div>
              <div className="mt-2 font-mono text-lg font-bold">{output} × {output} × {filters}</div>
              <div className="mt-1 text-[10px] text-gray-500">공간 크기 × 필터 수</div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1.2fr]">
            <div className="grid grid-cols-3 gap-2">
              <Select label="커널" value={kernel} onChange={setKernel} options={[3, 5]} square />
              <Select label="스트라이드" value={stride} onChange={setStride} options={[1, 2]} suffix="칸" />
              <Select label="패딩" value={padding} onChange={setPadding} options={[0, 1, 2]} suffix="칸" />
            </div>
            <Formula className="border-cyan-100 bg-cyan-50/70 text-cyan-950 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-100" note={`현재 공간 크기: ⌊(8 − ${kernel} + 2 × ${padding}) ÷ ${stride}⌋ + 1 = ${output}`}>
              출력 특징 맵의 수 = 필터의 수 = {filters}
            </Formula>
          </div>
          <div className="mt-4 grid gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-700 md:grid-cols-[0.7fr_0.9fr_1.4fr] md:items-center">
            <div>
              <div className="text-[11px] font-bold">합성곱 출력 뒤 활성함수</div>
              <p className="mt-1 text-[9px] leading-4 text-gray-500">비선형 패턴 학습에 사용</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {(["relu", "tanh", "sigmoid"] as const).map((item) => <button key={item} type="button" aria-pressed={activation === item} onClick={() => setActivation(item)} className={`rounded-md border px-2 py-1 text-[10px] font-mono ${activation === item ? "border-cyan-600 bg-cyan-600 text-white" : "border-gray-200 text-gray-500 dark:border-gray-700"}`}>{item}</button>)}
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <label className="text-[10px] text-gray-500">입력값 z = {preActivation.toFixed(1)}<input type="range" min="-3" max="3" step="0.1" value={preActivation} onChange={(e) => setPreActivation(Number(e.target.value))} className="mt-1 block w-full accent-cyan-600" /></label>
              <span className="text-center text-gray-300" aria-hidden="true">→</span>
              <div className="rounded-lg bg-cyan-50 px-3 py-2 text-center dark:bg-cyan-950/30"><span className="text-[9px] text-gray-500">{activation}(z)</span><span className="ml-2 font-mono text-sm font-bold text-cyan-800 dark:text-cyan-200">{activationValue.toFixed(3)}</span></div>
            </div>
          </div>
          <p className="mt-2 text-[9px] text-gray-400">ReLU는 CNN에서 자주 쓰이는 활성함수의 한 예. 다중 클래스 출력층에서는 문제 유형에 따라 소프트맥스 등을 적용.</p>
        </Card>
      </Sourced>
    </section>
  );
}

function Select({ label, value, onChange, options, suffix, square = false }: { label: string; value: number; onChange: (n: number) => void; options: number[]; suffix?: string; square?: boolean }) {
  return (
    <label className="rounded-lg border border-gray-200 px-2.5 py-2 text-[10px] dark:border-gray-700">
      <span className="mb-1 block font-semibold text-gray-500">{label}</span>
      <select value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full bg-transparent font-mono text-xs">
        {options.map((option) => <option key={option} value={option}>{square ? `${option} × ${option}` : `${option}${suffix ?? ""}`}</option>)}
      </select>
    </label>
  );
}
