"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Chip, Formula } from "@/components/dlShared/ui";

const digits = {
  "0": [
    "00111100",
    "01100110",
    "01100110",
    "01100110",
    "01100110",
    "01100110",
    "01100110",
    "00111100",
  ],
  "4": [
    "00001100",
    "00011100",
    "00111100",
    "01101100",
    "11001100",
    "11111110",
    "00001100",
    "00001100",
  ],
  "7": [
    "01111110",
    "00000110",
    "00001100",
    "00001100",
    "00011000",
    "00011000",
    "00110000",
    "00110000",
  ],
};

function Raster({
  values,
  side,
  title,
}: {
  values: number[];
  side: number;
  title: string;
}) {
  return (
    <figure className="min-w-0 flex-1 text-center">
      <div
        role="img"
        aria-label={title}
        className="mx-auto grid aspect-square w-full max-w-40 overflow-hidden rounded-md border border-slate-300"
        style={{ gridTemplateColumns: `repeat(${side},1fr)` }}
      >
        {values.map((x, i) => (
          <span
            key={i}
            style={{ backgroundColor: `hsl(0 0% ${98 - 88 * x}%)` }}
          />
        ))}
      </div>
      <figcaption className="mt-2 text-sm font-semibold">{title}</figcaption>
    </figure>
  );
}

export default function AutoencoderLab() {
  const [digit, setDigit] = useState<keyof typeof digits>("4");
  const [block, setBlock] = useState(2);
  const input = digits[digit].join("").split("").map(Number);
  const side = 8 / block;
  const latent = Array.from({ length: side * side }, (_, index) => {
    const row = Math.floor(index / side) * block;
    const col = (index % side) * block;
    let sum = 0;
    for (let r = row; r < row + block; r++) {
      for (let c = col; c < col + block; c++) sum += input[r * 8 + c];
    }
    return sum / (block * block);
  });
  const restored = input.map(
    (_, i) =>
      latent[
        Math.floor(Math.floor(i / 8) / block) * side +
          Math.floor((i % 8) / block)
      ],
  );
  const mse =
    input.reduce((sum, x, i) => sum + (x - restored[i]) ** 2, 0) / input.length;
  return (
    <section>
      <SectionTitle
        title="숫자의 어느 부분이 압축 뒤에도 남을까?"
        subtitle="오토인코더는 입력 x를 작은 잠재 벡터 z에 담고, 디코더로 원래 모양을 재구성합니다. 숫자의 이름을 몰라도 원본 픽셀과 비교해 학습할 수 있습니다."
      />
      <Sourced
        refs={{
          slides: "4~10쪽 · 잠재 벡터, 복원 손실과 매니폴드",
          lecture: "07:17 · 이미지 압축과 손실",
        }}
      >
        <Card>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-bold">손글씨</span>
            {(Object.keys(digits) as (keyof typeof digits)[]).map((k) => (
              <Chip key={k} active={k === digit} onClick={() => setDigit(k)}>
                {k}
              </Chip>
            ))}
            <span className="ml-2 text-sm font-bold">남길 값</span>
            {[4, 2, 1].map((b) => (
              <Chip key={b} active={b === block} onClick={() => setBlock(b)}>
                {(8 / b) ** 2}개
              </Chip>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800 sm:gap-5">
            <Raster title="원본 x" values={input} side={8} />
            <span aria-hidden>→</span>
            <Raster
              title={`압축 z · ${side}×${side}`}
              values={latent}
              side={side}
            />
            <span aria-hidden>→</span>
            <Raster title="복원 ŷ" values={restored} side={8} />
          </div>
          <div className="mt-4" aria-live="polite">
            <Formula note="64개 픽셀에서 원본과 복원값의 차이를 제곱해 평균냅니다.">
              MSE = Σ(xᵢ − ŷᵢ)² / 64 = {mse.toFixed(4)}
            </Formula>
          </div>
          <p className="mt-3 text-sm">
            이 모형은 한 구역의 평균 밝기만 남깁니다. 같은 평균을 가진 두 구역은
            서로 다른 획도 같은 회색으로 복원됩니다. 실제 오토인코더는 훈련
            데이터를 보며 어떤 특징을 남길지 가중치로 학습합니다.
          </p>
        </Card>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardTitle>784개 픽셀을 좌표 몇 개로</CardTitle>
            <p className="text-sm">
              손글씨는 픽셀 수가 많아도 회전이나 획의 두께를 조금씩 바꾸면
              비슷한 이미지가 이어집니다. 이렇게 고차원 공간에 놓인 데이터가
              따르는 저차원 구조를 매니폴드라고 합니다. 잠재 좌표가 두세 개면
              점으로 그려 볼 수도 있습니다.
            </p>
          </Card>
          <Card>
            <CardTitle>차원이 늘면 표본 사이가 비는 이유</CardTitle>
            <p className="text-sm">
              각 축을 열 구간으로 나누면 한 축에는 10칸, 두 축에는 100칸, 세
              축에는 1,000칸이 생깁니다. 표본 수가 같으면 점점 많은 칸이 빕니다.
              중요한 특징으로 차원을 줄이는 것은 이 희소성을 다루는 한
              방법입니다.
            </p>
          </Card>
        </div>
      </Sourced>
    </section>
  );
}
