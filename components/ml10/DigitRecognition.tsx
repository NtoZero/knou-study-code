"use client";

import { useMemo, useState } from "react";
import { Eraser, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Formula, Hint, Scroller } from "./ui";
import { argmax, fmt } from "./mlpCore";

const SIZE = 28;
const PIXELS = SIZE * SIZE;

/** 설명용 숫자 ‘2’ 패턴 — 획을 따라 0~255 명도값을 찍는다 */
function makeTwo(): number[] {
  const g = new Array<number>(PIXELS).fill(0);
  const put = (cx: number, cy: number) => {
    for (let r = Math.floor(cy) - 2; r <= Math.floor(cy) + 2; r += 1) {
      for (let c = Math.floor(cx) - 2; c <= Math.floor(cx) + 2; c += 1) {
        if (r < 0 || r > SIZE - 1 || c < 0 || c > SIZE - 1) continue;
        const d = Math.hypot(c + 0.5 - cx, r + 0.5 - cy);
        const w = Math.max(0, 1 - d / 1.7);
        g[r * SIZE + c] = Math.min(255, g[r * SIZE + c] + 255 * w);
      }
    }
  };
  for (let a = Math.PI * 1.15; a >= -Math.PI * 0.12; a -= 0.02) put(14 + 6 * Math.cos(a), 11 - 6.5 * Math.sin(a));
  for (let s = 0; s <= 1; s += 0.008) put(19.5 - 11 * s, 13 + 9 * s);
  for (let s = 0; s <= 1; s += 0.008) put(8 + 13 * s, 22.5);
  return g.map((v) => Math.round(Math.min(255, v)));
}

const TWO = makeTwo();

/** 강의록 — MLP 구조 슬라이드가 보여 주는 출력층 10개의 신경망 출력값 */
const SLIDE_OUTPUT = [0.3, 0.1, 0.8, 0.3, 0.2, 0.2, 0.1, 0.1, 0.4, 0.2];

const FACTS = [
  { k: "데이터 개수", v: "7만 개 (학습용 6만, 테스트용 1만)" },
  { k: "영상 크기", v: "28 × 28 크기의 흑백 영상" },
  { k: "픽셀값", v: "각 픽셀은 0~255의 명도값" },
  { k: "레이블", v: "각 데이터에 대해 클래스 레이블 0~9가 함께 주어짐" },
];

export default function DigitRecognition() {
  const [grid, setGrid] = useState<number[]>(TWO);
  const [sel, setSel] = useState(14 * SIZE + 14);
  const [painting, setPainting] = useState<0 | 255 | null>(null);

  const nonZero = useMemo(() => grid.filter((v) => v > 0).length, [grid]);
  const row = Math.floor(sel / SIZE);
  const col = sel % SIZE;

  const paint = (i: number, value: 0 | 255) => {
    setSel(i);
    setGrid((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  };

  const best = argmax(SLIDE_OUTPUT);

  return (
    <section id="digit-recognition" className="scroll-mt-32">
      <SectionTitle
        title="응용 문제 — MNIST 숫자 인식"
        subtitle="28 × 28 영상이 어떻게 784개의 입력 노드가 되고, 10개의 출력이 어떻게 숫자 하나가 되는지"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            slides: "숫자인식 · 데이터 준비 — 벤치마크 데이터 MNIST",
          }}
        >
          <Card>
            <CardTitle>필기 숫자 인식과 MNIST</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              필기 숫자 인식은 손으로 쓴 숫자 영상을 10개의 클래스로 분류하는 문제로, 분류의 가장 대표적인
              문제 중 하나입니다. 벤치마크 데이터로는 <strong>MNIST</strong>(Modified National Institute of
              Standards and Technology database)를 사용합니다.
            </p>
            <Scroller>
              <table className="mt-3 w-full min-w-[380px] text-[12px]">
                <tbody>
                  {FACTS.map((f) => (
                    <tr key={f.k} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="whitespace-nowrap px-2 py-1.5 font-semibold text-sky-700 dark:text-sky-300">
                        {f.k}
                      </td>
                      <td className="px-2 py-1.5 text-gray-700 dark:text-gray-200">{f.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Scroller>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "MLP 구조 — 입력층 784개(=28×28)",
            lecture: "28×28 영상을 1차원으로 쭉 펴면 입력층 노드가 784개가 된다고 직접 계산해 보임",
          }}
        >
          <Card>
            <CardTitle>28 × 28 영상을 784차원 입력으로 펴기</CardTitle>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
              <div>
                <Scroller>
                  <div
                    className="mx-auto w-fit select-none"
                    onPointerUp={() => setPainting(null)}
                    onPointerLeave={() => setPainting(null)}
                  >
                    <div
                      className="grid gap-px rounded border border-gray-200 bg-gray-200 p-px dark:border-gray-700 dark:bg-gray-700"
                      style={{ gridTemplateColumns: `repeat(${SIZE}, 8px)` }}
                    >
                      {grid.map((v, i) => (
                        <button
                          key={i}
                          type="button"
                          aria-label={`${Math.floor(i / SIZE)}행 ${i % SIZE}열`}
                          onPointerDown={() => {
                            const value = grid[i] > 127 ? 0 : 255;
                            setPainting(value);
                            paint(i, value);
                          }}
                          onPointerEnter={() => {
                            if (painting !== null) paint(i, painting);
                          }}
                          className={`h-2 w-2 ${i === sel ? "ring-1 ring-sky-500" : ""}`}
                          style={{
                            backgroundColor: `rgb(${255 - v}, ${255 - v}, ${255 - v})`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </Scroller>
                <div className="mt-2 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGrid(TWO)}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-300"
                  >
                    <RotateCcw size={12} />
                    ‘2’로 되돌리기
                  </button>
                  <button
                    type="button"
                    onClick={() => setGrid(new Array(PIXELS).fill(0))}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-300"
                  >
                    <Eraser size={12} />
                    모두 지우기
                  </button>
                </div>
                <Hint>칸을 누르거나 끌어 직접 그려 볼 수 있습니다.</Hint>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg bg-gray-50 p-2.5 font-mono text-[11px] leading-6 dark:bg-gray-800">
                  <div>
                    입력층 노드 수 = 28 × 28 ={" "}
                    <span className="font-bold text-sky-600 dark:text-sky-400">784</span>
                  </div>
                  <div>출력층 노드 수 = 클래스 수 = 10</div>
                  <div className="mt-1 text-gray-500">0이 아닌 픽셀 {nonZero}개</div>
                </div>
                <div className="rounded-lg border border-gray-200 p-2.5 dark:border-gray-700">
                  <p className="text-[11px] font-semibold text-gray-500">선택한 픽셀</p>
                  <div className="mt-1 font-mono text-[11px] leading-6 text-gray-700 dark:text-gray-200">
                    <div>
                      {row}행 {col}열 → 입력 노드 x<sub>{row * SIZE + col + 1}</sub>
                    </div>
                    <div>원래 픽셀값 x = {grid[sel]}</div>
                    <div className="text-sky-600 dark:text-sky-400">
                      정규화 x̃ = {grid[sel]} / 255 = {fmt(grid[sel] / 255, 4)}
                    </div>
                  </div>
                </div>
                <Formula note="평면 영상을 한 줄로 펴면 행 번호 × 28 + 열 번호가 입력 노드의 번호가 된다">
                  i = 행 × 28 + 열
                </Formula>
              </div>
            </div>

            <p className="mb-1.5 mt-4 text-[11px] font-semibold text-gray-500">
              1차원으로 편 784개의 입력값 (왼쪽부터 0행 0열 → 27행 27열)
            </p>
            <Scroller>
              <div className="flex h-10 min-w-max items-end">
                {grid.map((v, i) => (
                  <div
                    key={i}
                    className={`w-[1.6px] ${i === sel ? "outline outline-1 outline-sky-500" : ""}`}
                    style={{
                      height: `${Math.max(1, (v / 255) * 38)}px`,
                      backgroundColor: v > 0 ? "#0284c7" : "#e2e8f0",
                    }}
                  />
                ))}
              </div>
            </Scroller>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "MLP 구조 — 출력층 10개, 시그모이드 함수 / 최대값 → 분류 결과",
          }}
        >
          <Card>
            <CardTitle>출력 10개에서 숫자 하나로</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              은닉층은 시그모이드 함수를 쓰고 노드 수를 20, 50, 100으로 바꿔 가며 성능을 평가합니다. 출력층은
              클래스 수와 같은 10개이며 역시 시그모이드 함수를 씁니다. 10개의 출력값 가운데 <strong>최대값</strong>
              을 내는 노드의 번호가 분류 결과가 됩니다.
            </p>
            <Scroller>
              <table className="mt-3 w-full min-w-[460px] text-[11.5px]">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                    <th className="px-2 py-1.5 font-semibold">숫자</th>
                    {SLIDE_OUTPUT.map((_, i) => (
                      <th key={i} className="px-1.5 py-1.5 text-center font-semibold">
                        {i}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="whitespace-nowrap px-2 py-1.5 font-semibold text-gray-600 dark:text-gray-300">
                      신경망 출력
                    </td>
                    {SLIDE_OUTPUT.map((v, i) => (
                      <td
                        key={i}
                        className={`px-1.5 py-1.5 text-center font-mono ${
                          i === best ? "rounded bg-sky-600 font-bold text-white" : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {v.toFixed(1)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-2 py-1.5 font-semibold text-gray-600 dark:text-gray-300">
                      목표 출력값
                    </td>
                    {SLIDE_OUTPUT.map((_, i) => (
                      <td
                        key={i}
                        className={`px-1.5 py-1.5 text-center font-mono ${
                          i === 2 ? "font-bold text-rose-600" : "text-gray-400"
                        }`}
                      >
                        {i === 2 ? 1 : 0}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </Scroller>
            <p className="mt-2 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              최대값은 {SLIDE_OUTPUT[best].toFixed(1)}로 {best}번 노드에서 나왔으므로 분류 결과는{" "}
              <strong>“{best}”</strong>입니다. 목표 출력값은 2번만 1인 원-핫 벡터이므로 이 데이터는 맞게
              분류된 것입니다.
            </p>
            <Hint>
              이 출력값은 강의록의 MLP 구조 슬라이드에 제시된 값입니다. 시그모이드를 쓰면 출력값은 각각
              0과 1 사이지만 모두 더해 1이 되지는 않습니다. 소프트맥스를 쓰면 합이 1이 됩니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
