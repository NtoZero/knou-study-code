"use client";

import KeyPhrase from "@/components/dlShared/KeyPhrase";
import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Chip } from "@/components/dlShared/ui";

type Scene = "figure" | "alexnet";
const FIGURE = [
  [1, 3, 5, 5],
  [4, 1, 4, 9],
  [3, 2, 0, 1],
  [5, 2, 4, 6],
];
const ALEXNET = [
  [1, 4, 2, 8, 5, 3],
  [6, 2, 7, 1, 4, 8],
  [3, 9, 1, 5, 2, 6],
  [4, 7, 3, 8, 1, 2],
  [9, 2, 6, 4, 7, 5],
  [2, 5, 8, 1, 3, 9],
];

export default function OverlappingPoolingLab() {
  const [scene, setScene] = useState<Scene>("figure");
  const [selected, setSelected] = useState(0);
  const matrix = scene === "figure" ? FIGURE : ALEXNET;
  const kernel = scene === "figure" ? 2 : 3;
  const stride = scene === "figure" ? 1 : 2;
  const positions = useMemo(() => {
    const out: { r: number; c: number; outRow: number; outCol: number; value: number }[] = [];
    for (let r = 0; r <= matrix.length - kernel; r += stride) {
      for (let c = 0; c <= matrix[0].length - kernel; c += stride) {
        let value = -Infinity;
        for (let y = r; y < r + kernel; y++) for (let x = c; x < c + kernel; x++) value = Math.max(value, matrix[y][x]);
        out.push({ r, c, outRow: Math.floor(r / stride), outCol: Math.floor(c / stride), value });
      }
    }
    return out;
  }, [kernel, matrix, stride]);
  const activeIndex = Math.min(selected, positions.length - 1);
  const first = positions[activeIndex];
  const second = activeIndex + 1 < positions.length ? positions[activeIndex + 1] : null;

  return (
    <section id="overlapping-pooling" className="scroll-mt-32">
      <SectionTitle
        title="겹치는 창으로 최대 풀링하기"
        subtitle="창 위치를 바꾸며 겹친 입력이 어떤 최댓값으로 이어지는지 확인해요."
      />
      <Sourced refs={{ slides: "슬라이드 7, 12 — AlexNet 풀링 설정과 겹침 예시", lecture: "음성 전사 33:29–33:48 — 창 크기와 stride를 이용한 오버래핑 설명" }}>
        <Card>
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900 dark:bg-amber-950/30">
            <p className="text-sm font-bold text-amber-950 dark:text-amber-100">먼저 두 창을 손으로 옮겨 봐요</p>
            <p className="mt-1 text-[13px] leading-6 text-amber-900 dark:text-amber-200">최대 풀링은 현재 창의 값 중 최댓값 하나를 출력해요. 창이 한 번 이동하는 칸 수가 창 한 변보다 작으면, <KeyPhrase>이웃 창이 입력 칸을 다시 사용</KeyPhrase>해요.</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg bg-white/80 p-3 dark:bg-gray-900/60">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-100">간단한 수치 예 · 2×2 창 / stride 1</p>
                <p className="mt-2 font-mono text-[13px] leading-6 text-gray-700 dark:text-gray-200">첫 창: max(1, 3, 4, 1)=4<br />오른쪽 창: max(3, 5, 1, 4)=5</p>
                <p className="mt-2 text-[13px] leading-6 text-gray-600 dark:text-gray-300">첫 창은 1–2열, 다음은 2–3열을 보므로 2열을 공유해요. 공유된 값도 각 창에서 따로 최댓값 후보가 됩니다.</p>
              </div>
              <div className="rounded-lg bg-white/80 p-3 dark:bg-gray-900/60">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-100">AlexNet 표 · 3×3 창 / stride 2</p>
                <p className="mt-2 font-mono text-[13px] leading-6 text-gray-700 dark:text-gray-200">첫 창(1–3열): 최댓값 9<br />오른쪽 창(3–5열): 최댓값 8<br />6×6 입력 → ⌊(6−3)/2⌋+1=2</p>
                <p className="mt-2 text-[13px] leading-6 text-gray-600 dark:text-gray-300">첫 창과 오른쪽 창은 3열을 공유해요. 가로·세로 모두 두 위치이므로 이 6×6 예의 출력은 2×2이고, 값은 각 3×3 창의 최댓값이에요.</p>
              </div>
            </div>
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Chip active={scene === "figure"} onClick={() => { setScene("figure"); setSelected(0); }}>
              그림 예시 · 2×2 / stride 1
            </Chip>
            <Chip active={scene === "alexnet"} onClick={() => { setScene("alexnet"); setSelected(0); }}>
              AlexNet 표 · 3×3 / stride 2
            </Chip>
          </div>
          <p className="mb-3 text-[12px] leading-5 text-gray-600 dark:text-gray-300">
            창 크기 <b>{kernel}</b>, stride <b>{stride}</b>이므로 한 번 이동할 때 창이 <b>{kernel - stride}</b>칸 겹쳐요. 결과 칸을 눌러 현재 창을 옮기세요.
          </p>

          <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
            <div>
              <CardTitle>입력 특징 맵</CardTitle>
              <div
                className="mx-auto grid w-fit gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800"
                style={{ gridTemplateColumns: `repeat(${matrix[0].length}, minmax(2.4rem, 1fr))` }}
                role="grid"
                aria-label="최대 풀링 입력 특징 맵"
              >
                {matrix.flatMap((row, r) => row.map((value, c) => {
                  const inA = r >= first.r && r < first.r + kernel && c >= first.c && c < first.c + kernel;
                  const inB = second !== null && r >= second.r && r < second.r + kernel && c >= second.c && c < second.c + kernel;
                  const tone = inA && inB ? "bg-violet-300 text-violet-950 dark:bg-violet-700 dark:text-white" : inA ? "bg-amber-300 text-amber-950 dark:bg-amber-700 dark:text-white" : inB ? "bg-sky-200 text-sky-950 dark:bg-sky-800 dark:text-white" : "bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-200";
                  return <span key={`${r}-${c}`} role="gridcell" className={`flex h-10 w-10 items-center justify-center rounded text-sm font-mono font-bold ${tone}`}>{value}</span>;
                }))}
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-gray-500">
                <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-amber-400" />현재 창</span>
                <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-sky-300" />다음 창</span>
                <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-violet-400" />겹치는 위치</span>
              </div>
            </div>

            <div>
              <CardTitle>각 창의 최댓값</CardTitle>
              <div
                className="mx-auto grid w-fit gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800"
                style={{ gridTemplateColumns: `repeat(${scene === "figure" ? 3 : 2}, 2.5rem)` }}
                role="grid"
                aria-label="최대 풀링 결과"
              >
                {positions.map((position, i) => (
                  <button
                    key={`${position.r}-${position.c}`}
                    type="button"
                    onClick={() => setSelected(i)}
                    aria-label={`출력 행 ${position.outRow + 1}, 열 ${position.outCol + 1}: ${position.value}`}
                    aria-pressed={activeIndex === i}
                    className={`h-10 w-10 rounded font-mono text-sm font-bold ${activeIndex === i ? "bg-teal-600 text-white" : "bg-white text-gray-700 hover:bg-teal-50 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-teal-950"}`}
                  >
                    {position.value}
                  </button>
                ))}
              </div>
              <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-[12px] leading-5 text-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
                선택 창의 시작 위치는 <b>({first.r + 1}, {first.c + 1})</b>, 그 안의 최댓값은 <b>{first.value}</b>예요. {second ? "바로 다음 창과 겹치는 칸은 보라색으로 표시돼요." : "마지막 창을 선택했어요. 다음 창은 없어요."}
              </p>
            </div>
          </div>

          <p className="mt-3 text-[11px] leading-5 text-gray-500">
            창이 겹친다고 해도 같은 계산을 재사용해 결과를 복사하는 뜻은 아니에요. 공유 입력칸이 다시 비교되며, 각 새 창에서 최댓값을 다시 구해요.
          </p>
        </Card>
      </Sourced>
    </section>
  );
}
