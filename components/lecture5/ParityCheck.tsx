"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";

export default function ParityCheck() {
  const [mode, setMode] = useState<"simple" | "2d">("simple");
  const [parityType, setParityType] = useState<"even" | "odd">("even");
  const [bits, setBits] = useState([1, 0, 1, 1, 0, 0, 1]);

  // 2D parity data (4 characters x 7 bits)
  const [grid, setGrid] = useState([
    [1, 0, 1, 1, 0, 0, 1],
    [0, 1, 1, 0, 1, 0, 0],
    [1, 1, 0, 0, 1, 1, 0],
    [1, 0, 0, 1, 0, 1, 1],
  ]);

  const countOnes = (arr: number[]) => arr.filter((b) => b === 1).length;

  const getParityBit = (arr: number[]) => {
    const ones = countOnes(arr);
    return parityType === "even" ? ones % 2 : (ones + 1) % 2;
  };

  const toggleBit = (i: number) => {
    setBits((prev) => prev.map((b, idx) => (idx === i ? 1 - b : b)));
  };

  const toggleGridBit = (row: number, col: number) => {
    setGrid((prev) =>
      prev.map((r, ri) =>
        ri === row ? r.map((b, ci) => (ci === col ? 1 - b : b)) : r
      )
    );
  };

  // Simple parity
  const parityBit = getParityBit(bits);
  const totalOnes = countOnes(bits) + parityBit;
  const isValid =
    parityType === "even" ? totalOnes % 2 === 0 : totalOnes % 2 === 1;

  // 2D parity: row parities, column parities
  const rowParities = grid.map((row) => getParityBit(row));
  const colParities = Array.from({ length: 7 }, (_, col) =>
    getParityBit(grid.map((row) => row[col]))
  );

  return (
    <section>
      <SectionTitle
        title="패리티 검사 (Parity Check)"
        subtitle="오류발생 확률이 낮은 환경에서 가장 많이 사용하는 오류검출 방법. 비트를 클릭하여 오류를 시뮬레이션하세요."
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setMode("simple")}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              mode === "simple" ? "bg-rose-500 text-white" : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            단순 패리티 검사
          </button>
          <button
            onClick={() => setMode("2d")}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              mode === "2d" ? "bg-rose-500 text-white" : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            2차원 패리티 검사
          </button>
          <select
            value={parityType}
            onChange={(e) => setParityType(e.target.value as "even" | "odd")}
            className="rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="even">짝수 패리티</option>
            <option value="odd">홀수 패리티</option>
          </select>
        </div>

        {mode === "simple" ? (
          <div>
            <div className="mb-4 flex items-center gap-1">
              <span className="mr-2 text-sm text-gray-500">데이터 비트:</span>
              {bits.map((b, i) => (
                <button
                  key={i}
                  onClick={() => toggleBit(i)}
                  className={`flex h-10 w-10 items-center justify-center rounded text-sm font-mono font-bold transition-colors ${
                    b === 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {b}
                </button>
              ))}
              <span className="mx-2 text-gray-300">|</span>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded text-sm font-mono font-bold ${
                  parityBit === 1 ? "bg-rose-500 text-white" : "bg-rose-200 text-rose-700"
                }`}
              >
                {parityBit}
              </div>
              <span className="ml-1 text-xs text-gray-400">패리티</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-500">
                1의 개수: {countOnes(bits)} (데이터) + {parityBit} (패리티) = {totalOnes}
              </span>
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium ${
                  isValid
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {isValid ? "오류 없음" : "오류 검출!"}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="rounded-lg bg-rose-50 p-3 text-sm dark:bg-rose-900/20">
                <span className="font-semibold text-rose-700 dark:text-rose-300">검출 원리:</span>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  수신 측은 수신된 문자에서 1의 개수를 세어 {parityType === "even" ? "짝수" : "홀수"} 여부를 확인.
                  {parityType === "even"
                    ? " 짝수 패리티에서는 전체 1의 개수(데이터+패리티)가 짝수여야 정상."
                    : " 홀수 패리티에서는 전체 1의 개수(데이터+패리티)가 홀수여야 정상."}
                  {!isValid && " 현재 1의 개수가 조건을 만족하지 않으므로 오류가 검출되었습니다!"}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-800">
                <strong>한계:</strong> 동시에 짝수개(2, 4, 6...)의 비트 오류가 발생하면 1의 홀짝이 변하지 않아 검출 불가. 예를 들어 비트 2개가 동시에 뒤집히면 1의 총 개수가 변하지 않습니다. 오류발생 확률이 낮은 통신 환경에서 주로 사용하며, 특히 비동기식 전송에 적합합니다.
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="text-sm">
                <thead>
                  <tr>
                    <th className="p-1 text-xs text-gray-400">문자</th>
                    {Array.from({ length: 7 }, (_, i) => (
                      <th key={i} className="p-1 text-xs text-gray-400">b{i + 1}</th>
                    ))}
                    <th className="p-1 text-xs text-rose-400">행 패리티</th>
                  </tr>
                </thead>
                <tbody>
                  {grid.map((row, ri) => (
                    <tr key={ri}>
                      <td className="p-1 text-xs text-gray-400">C{ri + 1}</td>
                      {row.map((b, ci) => (
                        <td key={ci} className="p-0.5">
                          <button
                            onClick={() => toggleGridBit(ri, ci)}
                            className={`h-8 w-8 rounded text-xs font-mono font-bold ${
                              b === 1
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          >
                            {b}
                          </button>
                        </td>
                      ))}
                      <td className="p-0.5">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded text-xs font-mono font-bold ${
                            rowParities[ri] === 1
                              ? "bg-rose-500 text-white"
                              : "bg-rose-200 text-rose-700"
                          }`}
                        >
                          {rowParities[ri]}
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="p-1 text-xs text-rose-400">열 패리티</td>
                    {colParities.map((p, i) => (
                      <td key={i} className="p-0.5">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded text-xs font-mono font-bold ${
                            p === 1
                              ? "bg-rose-500 text-white"
                              : "bg-rose-200 text-rose-700"
                          }`}
                        >
                          {p}
                        </div>
                      </td>
                    ))}
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 space-y-2">
              <div className="rounded-lg bg-rose-50 p-3 text-sm dark:bg-rose-900/20">
                <span className="font-semibold text-rose-700 dark:text-rose-300">2차원 패리티 검사 원리:</span>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  단순 패리티의 단점을 보완. 블록 단위로 끊어 동일한 열(column) 위치에 대해서도 1의 개수를 세어 패리티 비트를 부가.
                  즉, <strong>문자 단위(행 패리티)</strong>와 <strong>블록 단위(열 패리티)</strong>를 중복 사용하여 수평+수직 방향의 패리티를 동시에 검사합니다.
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-800">
                <strong>검출 능력:</strong> 비트 오류를 <strong>3개까지 검출</strong> 가능. 하지만 4개 비트에 영향을 미치는 오류(예: 직사각형 패턴의 4비트 오류)는 행/열 패리티가 모두 정상으로 보여 검출하지 못하는 경우가 있습니다.
                비트를 클릭하여 1~3개를 변경하면 행 또는 열 패리티가 변하는 것을 확인해 보세요.
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
