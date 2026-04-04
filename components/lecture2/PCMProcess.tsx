"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

const LEVELS = 8; // 3-bit quantization

export default function PCMProcess() {
  const [step, setStep] = useState(0); // 0: sampling, 1: quantization, 2: encoding
  const [sampleRate, setSampleRate] = useState(8); // number of samples

  // Generate analog signal points
  const analogSignal = Array.from({ length: 200 }, (_, i) => {
    const t = i / 200;
    return Math.sin(t * Math.PI * 2) * 0.7 + Math.sin(t * Math.PI * 6) * 0.3;
  });

  // Sample points
  const samples = Array.from({ length: sampleRate }, (_, i) => {
    const idx = Math.floor((i / sampleRate) * 200);
    return { idx, value: analogSignal[idx] };
  });

  // Quantize
  const quantized = samples.map((s) => {
    const level = Math.round(((s.value + 1) / 2) * (LEVELS - 1));
    return { ...s, level, quantizedValue: (level / (LEVELS - 1)) * 2 - 1 };
  });

  // Encode to binary
  const encoded = quantized.map((q) => ({
    ...q,
    binary: q.level.toString(2).padStart(3, "0"),
  }));

  const stepLabels = ["1단계: 표본화 (Sampling)", "2단계: 양자화 (Quantization)", "3단계: 부호화 (Encoding)"];

  return (
    <section>
      <SectionTitle
        title="PCM (Pulse Code Modulation)"
        subtitle="아날로그 신호를 디지털 신호로 변환하는 3단계 과정"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        {/* Step selector */}
        <div className="mb-6 flex gap-2">
          {stepLabels.map((label, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                step === i
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sampling rate slider */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm text-gray-500">표본화 빈도:</span>
          <input
            type="range"
            min={4}
            max={20}
            value={sampleRate}
            onChange={(e) => setSampleRate(Number(e.target.value))}
            className="w-48"
          />
          <span className="text-sm font-mono">{sampleRate}개</span>
          {sampleRate < 6 && (
            <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-600 dark:bg-red-900/30 dark:text-red-400">
              나이퀴스트 조건 미달 (fs &lt; 2fa)
            </span>
          )}
        </div>

        {/* Visualization */}
        <div className="relative h-64 w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
          <svg viewBox="0 0 400 200" className="h-full w-full">
            {/* Grid */}
            {step >= 1 &&
              Array.from({ length: LEVELS }, (_, i) => (
                <line
                  key={i}
                  x1={0}
                  y1={20 + (i * 160) / (LEVELS - 1)}
                  x2={400}
                  y2={20 + (i * 160) / (LEVELS - 1)}
                  stroke="#e5e7eb"
                  strokeDasharray="4"
                />
              ))}

            {/* Analog signal */}
            <path
              d={analogSignal
                .map((v, i) => {
                  const x = (i / 200) * 400;
                  const y = 100 - v * 80;
                  return `${i === 0 ? "M" : "L"}${x},${y}`;
                })
                .join(" ")}
              fill="none"
              stroke="#9ca3af"
              strokeWidth={1.5}
              opacity={step === 2 ? 0.3 : 1}
            />

            {/* Sample points */}
            {step >= 0 &&
              samples.map((s, i) => {
                const x = (s.idx / 200) * 400;
                const y = 100 - s.value * 80;
                return (
                  <g key={i}>
                    <line
                      x1={x}
                      y1={100}
                      x2={x}
                      y2={y}
                      stroke="#10b981"
                      strokeWidth={1}
                      strokeDasharray="2"
                    />
                    <circle cx={x} cy={y} r={3} fill="#10b981" />
                  </g>
                );
              })}

            {/* Quantized points & steps */}
            {step >= 1 &&
              quantized.map((q, i) => {
                const x = (q.idx / 200) * 400;
                const y = 100 - q.quantizedValue * 80;
                const origY = 100 - q.value * 80;
                return (
                  <g key={`q-${i}`}>
                    {/* Error line */}
                    <line
                      x1={x}
                      y1={origY}
                      x2={x}
                      y2={y}
                      stroke="#f59e0b"
                      strokeWidth={1}
                      strokeDasharray="2"
                    />
                    <rect
                      x={x - 4}
                      y={y - 4}
                      width={8}
                      height={8}
                      fill="#f59e0b"
                    />
                  </g>
                );
              })}

            {/* Binary labels */}
            {step >= 2 &&
              encoded.map((e, i) => {
                const x = (e.idx / 200) * 400;
                const y = 100 - e.quantizedValue * 80;
                return (
                  <text
                    key={`b-${i}`}
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    fontSize={9}
                    fontFamily="monospace"
                    fill="#3b82f6"
                  >
                    {e.binary}
                  </text>
                );
              })}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-4 rounded bg-gray-400" />
            아날로그 원본 신호
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            표본화 포인트
          </span>
          {step >= 1 && (
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 bg-amber-500" />
              양자화 레벨 (오차 = 점선)
            </span>
          )}
          {step >= 2 && (
            <span className="flex items-center gap-1">
              <span className="text-blue-500 font-mono">010</span>
              부호화 (3비트)
            </span>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm dark:bg-emerald-900/20">
          <p>
            <strong>나이퀴스트 정리:</strong> 표본화 주파수(fs)는 원래 신호의 최대 주파수(fa)의
            2배 이상이어야 원래 신호를 완벽히 복원 가능. <strong>fs ≥ 2fa</strong>
          </p>
          <p className="mt-2">
            표본화 간격이 <strong>너무 크면</strong> (= 표본화 빈도 낮음) 데이터양은 적지만 <strong>정확도가 저하</strong>되고,
            <strong> 너무 작으면</strong> (= 표본화 빈도 높음) 정확하지만 <strong>데이터양이 증가</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
