"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";

export default function EfficiencyCalculator() {
  const [charCount, setCharCount] = useState(200);
  const [bitsPerChar, setBitsPerChar] = useState(8);
  const [synCount, setSynCount] = useState(2);
  const [startBits, setStartBits] = useState(1);
  const [stopBits, setStopBits] = useState(1);
  const [parityBits, setParityBits] = useState(1);

  const dataBits = charCount * bitsPerChar;
  const asyncTotal = charCount * (startBits + bitsPerChar + parityBits + stopBits);
  const asyncEff = ((dataBits / asyncTotal) * 100).toFixed(1);
  const syncOverhead = synCount * bitsPerChar;
  const syncTotal = syncOverhead + dataBits;
  const syncEff = ((dataBits / syncTotal) * 100).toFixed(1);

  return (
    <section>
      <SectionTitle
        title="전송 효율 계산기"
        subtitle="동기식과 비동기식 전송 효율을 비교합니다"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm">
            <span className="text-gray-500">전송 문자 수</span>
            <input type="number" value={charCount} onChange={(e) => setCharCount(Number(e.target.value))}
              className="mt-1 w-full rounded border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
          </label>
          <label className="text-sm">
            <span className="text-gray-500">문자당 비트 수</span>
            <input type="number" value={bitsPerChar} onChange={(e) => setBitsPerChar(Number(e.target.value))}
              className="mt-1 w-full rounded border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
          </label>
          <label className="text-sm">
            <span className="text-gray-500">SYN 문자 수 (동기식)</span>
            <input type="number" value={synCount} onChange={(e) => setSynCount(Number(e.target.value))}
              className="mt-1 w-full rounded border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
          </label>
          <label className="text-sm">
            <span className="text-gray-500">시작 비트 수 (비동기)</span>
            <input type="number" value={startBits} onChange={(e) => setStartBits(Number(e.target.value))}
              className="mt-1 w-full rounded border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
          </label>
          <label className="text-sm">
            <span className="text-gray-500">정지 비트 수 (비동기)</span>
            <input type="number" value={stopBits} onChange={(e) => setStopBits(Number(e.target.value))}
              className="mt-1 w-full rounded border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
          </label>
          <label className="text-sm">
            <span className="text-gray-500">패리티 비트 수 (비동기)</span>
            <input type="number" value={parityBits} onChange={(e) => setParityBits(Number(e.target.value))}
              className="mt-1 w-full rounded border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
          </label>
        </div>

        {/* Results */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
            <div className="text-sm font-semibold text-amber-700 dark:text-amber-300">비동기식 전송</div>
            <div className="mt-1 text-xs text-gray-500">
              총 비트 = {charCount} × ({startBits}+{bitsPerChar}+{parityBits}+{stopBits}) = {asyncTotal}비트
            </div>
            <div className="mt-2">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-amber-600">{asyncEff}%</span>
              </div>
              <div className="mt-2 h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-3 rounded-full bg-amber-500 transition-all"
                  style={{ width: `${asyncEff}%` }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
            <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">동기식 전송</div>
            <div className="mt-1 text-xs text-gray-500">
              총 비트 = {synCount}×{bitsPerChar} + {charCount}×{bitsPerChar} = {syncTotal}비트
            </div>
            <div className="mt-2">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-emerald-600">{syncEff}%</span>
              </div>
              <div className="mt-2 h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-3 rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${syncEff}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
