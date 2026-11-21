"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Card, Formula } from "@/components/dlShared/ui";
import { Sourced } from "@/components/dlShared/SourceFilter";

const centers = [
  { name: "숫자 0", x: 2, y: 2, color: "bg-cyan-500", bar: "bg-cyan-500" },
  { name: "숫자 3", x: 7, y: 3, color: "bg-amber-500", bar: "bg-amber-500" },
  { name: "숫자 8", x: 5, y: 8, color: "bg-violet-500", bar: "bg-violet-500" },
];

export default function RbfDistanceLab() {
  const [x, setX] = useState(6);
  const [y, setY] = useState(5);
  const [gamma, setGamma] = useState(0.08);
  const responses = centers.map((center) => {
    const distanceSquared = (x - center.x) ** 2 + (y - center.y) ** 2;
    return { ...center, distance: Math.sqrt(distanceSquared), response: Math.exp(-gamma * distanceSquared) };
  });
  const winner = responses.reduce((best, item) => item.response > best.response ? item : best, responses[0]);

  return (
    <section>
      <SectionTitle title="LeNet-5 출력의 RBF 연결" subtitle="입력 표현이 각 기준점에 가까운지, 거리에 따라 반응하는 모습을 실험하세요" />
      <Sourced refs={{ slides: "강의록 7강 PDF 17–19·27쪽 — RBF 출력·거리 계산·RBF 층 구현", lecture: "강의 7강 26:48–27:03, 33:23–33:52 — RBF 출력과 현대 분류 출력 비교" }}>
        <Card>
          <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
            <div className="rounded-xl border border-gray-200 bg-slate-950 p-4 text-white dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold">저차원 특징 공간</h3>
                  <p className="mt-1 text-[10px] text-slate-400">가독성을 위해 숫자 0·3·8 기준점 세 개만 그린 거리 비교 시연</p>
                </div>
                <span className="rounded-lg border border-slate-700 px-2 py-1 font-mono text-[10px] text-cyan-100">입력: ({x}, {y})</span>
              </div>
              <div className="relative mx-auto mt-4 aspect-square max-w-[19rem] rounded-lg border border-slate-700 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:10%_10%]">
                {[...Array(10)].map((_, i) => <div key={i} className="absolute left-0 right-0 border-t border-slate-800/70" style={{ top: `${i * 10}%` }} />)}
                {centers.map((center) => (
                  <div key={center.name} className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white ${center.color}`} style={{ left: `${center.x * 10}%`, top: `${100 - center.y * 10}%` }} title={`${center.name} 중심`}>
                    <span className="absolute left-4 top-[-5px] whitespace-nowrap text-[9px] text-slate-300">{center.name}</span>
                  </div>
                ))}
                <div className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm border-2 border-white bg-white shadow-[0_0_14px_3px_rgba(255,255,255,0.55)]" style={{ left: `${x * 10}%`, top: `${100 - y * 10}%` }} title="현재 입력" />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Slider label="입력 x 좌표" value={x} min={0} max={9} onChange={setX} />
                <Slider label="입력 y 좌표" value={y} min={0} max={9} onChange={setY} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-2 text-xs font-bold">거리 기반 출력</div>
                <div className="space-y-2">
                  {responses.map((item) => (
                    <div key={item.name} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                      <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
                        <span className="font-semibold">{item.name}</span>
                        <span className="font-mono text-gray-500">거리 {item.distance.toFixed(2)} · 반응 {item.response.toFixed(3)}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"><div className={`h-full rounded-full ${item.bar}`} style={{ width: `${item.response * 100}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
              <label className="block rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <span className="flex items-center justify-between text-[11px] font-semibold"><span>거리 민감도 γ</span><span className="font-mono text-violet-600 dark:text-violet-300">{gamma.toFixed(2)}</span></span>
                <input type="range" min="0.02" max="0.3" step="0.01" value={gamma} onChange={(e) => setGamma(Number(e.target.value))} className="mt-2 w-full accent-violet-600" />
                <span className="block text-[10px] leading-4 text-gray-500">γ를 높이면 중심에서 조금만 멀어져도 반응이 더 빠르게 작아짐.</span>
              </label>
              <Formula className="border-violet-100 bg-violet-50/70 text-violet-950 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-100" note="교육용 2차원 가우시안 RBF 예시">
                RBF(x, μ) = exp(−γ · ‖x − μ‖²)
              </Formula>
              <div className="rounded-lg border-l-2 border-violet-400 bg-violet-50/60 px-3 py-2 text-[11px] leading-5 text-violet-950 dark:bg-violet-950/20 dark:text-violet-100">
                현재 가장 크게 반응하는 기준은 <b>{winner.name}</b>. LeNet-5에서는 F6의 표현을 10개 숫자 범주의 출력으로 연결하며, RBF는 입력과 가중치 사이의 거리를 이용하는 활성 함수로 소개됨.
              </div>
            </div>
          </div>
        </Card>
      </Sourced>
    </section>
  );
}

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <label className="block rounded-lg border border-slate-800 bg-slate-900/70 p-2">
      <span className="flex justify-between text-[10px] text-slate-300"><span>{label}</span><b className="font-mono text-white">{value}</b></span>
      <input type="range" min={min} max={max} step={1} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full accent-cyan-400" />
    </label>
  );
}
