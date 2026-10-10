"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Hint, Scroller, Slider, Tag } from "./ui";
import { FILTERS, INPUT_7, convolve, convolveChannels, num, outSize, type Matrix } from "./cnn";

/** 교재 [그림 12-13]은 앞면 채널의 값만 보여 준다. 나머지 두 채널은 이 페이지에서 정한 값 */
const CH2: Matrix = [
  [3, 1, 0, 2, 4, 6, 1],
  [0, 5, 7, 1, 2, 0, 4],
  [6, 2, 1, 8, 3, 2, 0],
  [1, 4, 3, 0, 5, 7, 2],
  [2, 0, 6, 3, 1, 4, 8],
  [7, 3, 2, 5, 0, 1, 3],
  [0, 6, 4, 1, 7, 2, 5],
];

const CH3: Matrix = [
  [1, 2, 3, 0, 5, 4, 2],
  [4, 0, 1, 6, 2, 3, 7],
  [2, 7, 5, 1, 0, 6, 1],
  [3, 1, 0, 4, 8, 2, 5],
  [0, 5, 2, 7, 3, 1, 4],
  [6, 2, 8, 0, 1, 5, 2],
  [1, 3, 4, 2, 6, 0, 3],
];

const CHANNELS = [INPUT_7, CH2, CH3];
const CH_NAME = ["R 채널", "G 채널", "B 채널"];

function MiniGrid({ m, cell = 19, tone }: { m: Matrix; cell?: number; tone: "in" | "out" }) {
  const maxAbs = Math.max(1, ...m.flat().map((v) => Math.abs(v)));
  return (
    <div className="inline-grid gap-[1.5px]" style={{ gridTemplateColumns: `repeat(${m[0].length}, ${cell}px)` }}>
      {m.map((row, i) =>
        row.map((v, j) => (
          <div
            key={`${i}-${j}`}
            style={{
              width: cell,
              height: cell,
              background:
                tone === "in"
                  ? `rgba(251, 191, 36, ${0.1 + 0.35 * (Math.abs(v) / maxAbs)})`
                  : v >= 0
                    ? `rgba(101, 163, 13, ${0.12 + 0.6 * (Math.abs(v) / maxAbs)})`
                    : `rgba(2, 132, 199, ${0.12 + 0.6 * (Math.abs(v) / maxAbs)})`,
            }}
            className="flex items-center justify-center rounded-[2px] border border-gray-200 text-[9.5px] font-semibold tabular-nums text-gray-800 dark:border-gray-700 dark:text-gray-100"
          >
            {num(v, 0)}
          </div>
        )),
      )}
    </div>
  );
}

function Block({
  w,
  h,
  d,
  label,
  color,
}: {
  w: number;
  h: number;
  d: number;
  label: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: w + d * 3, height: h + d * 3 }}>
        {Array.from({ length: Math.min(d, 6) }, (_, k) => (
          <div
            key={k}
            style={{
              width: w,
              height: h,
              left: (Math.min(d, 6) - 1 - k) * 3,
              top: k * 3,
              background: color,
            }}
            className="absolute rounded-[3px] border border-white/70 opacity-90 dark:border-gray-900/60"
          />
        ))}
      </div>
      <p className="mt-1 font-mono text-[10.5px] text-gray-600 dark:text-gray-300">{label}</p>
    </div>
  );
}

export default function MultiChannelFilters() {
  const [chCount, setChCount] = useState(3);
  const [filterId, setFilterId] = useState("vertical");
  const [relu, setRelu] = useState(true);

  const [inN, setInN] = useState(6);
  const [inC, setInC] = useState(3);
  const [f, setF] = useState(3);
  const [s, setS] = useState(1);
  const [p, setP] = useState(0);
  const [nf, setNf] = useState(2);

  const filter = FILTERS.find((x) => x.id === filterId)!;
  const chans = CHANNELS.slice(0, chCount);

  const perChannel = useMemo(
    () => chans.map((c) => convolve(c, filter.w, { stride: 1, padding: 0 }).map),
    [chans, filter],
  );
  const merged = useMemo(
    () => convolveChannels(chans, chans.map(() => filter.w), { stride: 1, padding: 0, relu }),
    [chans, filter, relu],
  );
  const second = useMemo(
    () =>
      convolveChannels(
        chans,
        chans.map(() => FILTERS[1].w),
        { stride: 1, padding: 0, relu },
      ),
    [chans, relu],
  );

  const outN = outSize(inN, f, s, p);

  return (
    <section id="channels-filters" className="scroll-mt-32">
      <SectionTitle
        title="다중 채널과 다중 필터"
        subtitle="컬러 영상처럼 채널이 여럿일 때, 필터가 여럿일 때 특징맵이 어떻게 되는지 계산합니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.3.1 — 다중 채널 입력에 대해 다중 필터를 적용한 콘볼루션 연산(그림 12-13)",
            slides: "콘볼루션층 — 2차원 격자 입력이 다중 채널을 형성하는 경우",
          }}
        >
          <Card>
            <CardTitle>채널이 여럿이면 채널마다 곱한 뒤 더한다</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              2D 격자 구조의 입력이 다중 채널을 형성하는 경우, 예를 들어 입력 영상이 RGB 컬러 영상의 경우에는 세
              가지 색상에 따른 3개의 채널을 갖게 되므로 입력 영상은 <strong>3D 텐서</strong>에 해당합니다. 필터도
              채널 수만큼의 층을 가지며, <strong>채널별 콘볼루션 결과를 모두 더한 뒤 활성화 함수를 거쳐</strong>{" "}
              하나의 특징맵이 됩니다. 채널이 3개여도 특징맵은 1장입니다.
            </p>

            <div className="mb-3 mt-3 flex flex-wrap items-center gap-2">
              {[1, 2, 3].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setChCount(c)}
                  aria-pressed={chCount === c}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    chCount === c
                      ? "border-lime-600 bg-lime-600 text-white"
                      : "border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  }`}
                >
                  채널 {c}개
                </button>
              ))}
              <button
                type="button"
                onClick={() => setRelu(!relu)}
                aria-pressed={relu}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  relu
                    ? "border-lime-600 bg-lime-600 text-white"
                    : "border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                }`}
              >
                ReLU 적용
              </button>
              {FILTERS.slice(0, 2).map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setFilterId(x.id)}
                  aria-pressed={filterId === x.id}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    filterId === x.id
                      ? "border-gray-700 bg-gray-700 text-white"
                      : "border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  }`}
                >
                  필터1 = {x.name}
                </button>
              ))}
            </div>

            <Scroller>
              <div className="flex min-w-[620px] items-start gap-3">
                {chans.map((c, k) => (
                  <div key={k}>
                    <p className="mb-1 text-[10.5px] font-bold text-gray-500">{CH_NAME[k]}</p>
                    <MiniGrid m={c} tone="in" />
                    <p className="mt-1.5 text-[10px] text-gray-400">↓ 같은 필터로 콘볼루션</p>
                    <MiniGrid m={perChannel[k]} cell={19} tone="out" />
                  </div>
                ))}
                <div className="pt-6 text-center">
                  <p className="text-[18px] text-gray-400">＋</p>
                  <p className="mt-6 text-[18px] text-gray-400">↓</p>
                </div>
                <div>
                  <p className="mb-1 text-[10.5px] font-bold text-lime-700 dark:text-lime-400">
                    특징맵 1 {relu ? "(ReLU 통과)" : ""}
                  </p>
                  <MiniGrid m={merged} cell={22} tone="out" />
                </div>
              </div>
            </Scroller>

            <div className="mt-3 rounded-lg bg-gray-50 p-3 font-mono text-[11px] leading-6 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <div>
                입력 7×7×{chCount} ∗ 필터 3×3×{chCount} → 특징맵 {merged.length}×{merged.length}×1
              </div>
              <div>
                왼쪽 위 한 칸: {perChannel.map((m) => num(m[0][0], 0)).join(" + ")} ={" "}
                {perChannel.reduce((a, m) => a + m[0][0], 0)}
                {relu ? ` → ReLU → ${num(merged[0][0], 0)}` : ""}
              </div>
            </div>

            <ComputedNote>
              앞면 채널(R)의 값은 교재 [그림 12-13]·강의록 슬라이드의 값이고, 필터는 강의록 다중 채널 슬라이드와
              교재 12.3.1의 방향별 에지 필터를 따라 −1 0 1 세 줄의 수직 에지 필터로 두었습니다. 교재 [그림
              12-13]의 필터1은 셋째 행만 −1 1 1로 인쇄되어 있어 이 값과 다릅니다. 나머지 두 채널의 값은 두 자료 모두 앞면만 보여 주어 이
              페이지에서 정했고, 필터의 세 장도 같은 값으로 두었습니다(실제로는 장마다 다른 값을 가질 수
              있습니다). 계산 결과는 모두 여기서 직접 구했습니다.
              교재 그림은 패딩을 추가하지 않았기 때문에 특징맵의 크기가 5×5라고 적고 있고, 위 계산도 5×5가
              나옵니다.
            </ComputedNote>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.3.1 — 다수의 필터로 다수의 특징맵",
            slides: "콘볼루션층 — 다양한 형태의 특징을 추출하려는 경우",
          }}
        >
          <Card>
            <CardTitle>필터가 여럿이면 특징맵도 그만큼</CardTitle>
            <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              콘볼루션 연산에서는 사용하는 필터에 따라 서로 다른 형태의 특징이 추출되므로, CNN은 다양한 형태의
              특징을 추출하기 위해 하나의 필터가 아닌 <strong>다수의 필터를 사용해서 다수의 특징맵을 생성</strong>
              합니다. 아래는 같은 입력에 서로 다른 두 필터를 적용한 결과입니다.
            </p>
            <Scroller>
              <div className="mt-3 flex min-w-[460px] items-start gap-5">
                <div>
                  <div className="mb-1 flex items-center gap-1.5">
                    <Tag tone="lime">필터 1</Tag>
                    <span className="text-[10.5px] text-gray-500">{filter.name}</span>
                  </div>
                  <MiniGrid m={merged} cell={22} tone="out" />
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-1.5">
                    <Tag tone="lime">필터 2</Tag>
                    <span className="text-[10.5px] text-gray-500">{FILTERS[1].name}</span>
                  </div>
                  <MiniGrid m={second} cell={22} tone="out" />
                </div>
                <div className="pt-5">
                  <p className="font-mono text-[11.5px] leading-6 text-gray-700 dark:text-gray-200">
                    7×7×{chCount} ∗ (3×3×{chCount}) × 2개
                    <br />→ 5×5×<span className="font-bold text-lime-700 dark:text-lime-400">2</span>
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-gray-500">
                    특징맵의 개수는 사용한 필터의 개수와 같습니다. 두 특징맵의 같은 자리 값이 서로 다른 것은, 필터가
                    서로 다른 특징을 보고 있기 때문입니다.
                  </p>
                </div>
              </div>
            </Scroller>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "12.3.1 — 1×1 필터 · 콘볼루션 연산의 간략한 표현(그림 12-15)",
            slides: "콘볼루션층 — 필터의 크기가 1×1인 경우 · 콘볼루션 연산의 간략한 표현",
          }}
        >
          <Card>
            <CardTitle>크기와 개수만으로 적는 간략한 표현</CardTitle>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
              <div className="space-y-2.5">
                <Slider label="입력 한 변" value={inN} min={4} max={16} step={1} onChange={setInN} display={`${inN}`} />
                <Slider label="입력 채널 수" value={inC} min={1} max={5} step={1} onChange={setInC} display={`${inC}`} />
                <Slider
                  label="필터 크기 f"
                  value={f}
                  min={1}
                  max={7}
                  step={2}
                  onChange={setF}
                  display={`${f}×${f}`}
                />
                <Slider label="보폭 s" value={s} min={1} max={3} step={1} onChange={setS} display={`${s}`} />
                <Slider label="패딩 p" value={p} min={0} max={3} step={1} onChange={setP} display={`${p}`} />
                <Slider label="필터 개수 nf" value={nf} min={1} max={6} step={1} onChange={setNf} display={`${nf}개`} />
              </div>

              <div>
                <Scroller>
                  <div className="flex min-w-[360px] items-center justify-around gap-4 py-2">
                    <Block
                      w={Math.min(90, inN * 9)}
                      h={Math.min(90, inN * 9)}
                      d={inC}
                      label={`${inN}×${inN}×${inC}`}
                      color="#cbd5e1"
                    />
                    <div className="text-center">
                      <p className="font-mono text-[10.5px] leading-5 text-gray-500">
                        f = {f}
                        <br />s = {s}
                        <br />p = {p}
                        <br />
                        {nf}개 필터
                      </p>
                      <p className="mt-1 text-gray-400">→</p>
                    </div>
                    <Block
                      w={Math.max(10, Math.min(90, outN * 9))}
                      h={Math.max(10, Math.min(90, outN * 9))}
                      d={nf}
                      label={`${outN}×${outN}×${nf}`}
                      color="#a3e635"
                    />
                  </div>
                </Scroller>

                <div className="rounded-lg bg-gray-50 p-3 font-mono text-[11px] leading-6 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  <div>
                    한 변: ({inN} + 2×{p} − {f}) ÷ {s} + 1 ={" "}
                    <span className="font-bold text-lime-700 dark:text-lime-400">{outN}</span>
                  </div>
                  <div>
                    깊이: 필터 개수 ={" "}
                    <span className="font-bold text-lime-700 dark:text-lime-400">{nf}</span>
                  </div>
                  <div className="text-gray-500">
                    필터의 채널 수는 입력 데이터의 채널 수({inC})와 같아야 한다
                  </div>
                </div>

                <p className="mt-2 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                  교재 [그림 12-15]는 6×6×3 입력에 f = 3, s = 1, p = 0인 필터 2개를 적용해 4×4×2를 얻습니다. 위
                  슬라이더를 그 값으로 두면 같은 결과가 나옵니다. 필터 크기를 1×1로 두면 입력과 출력의 한 변이
                  같아지고 깊이만 필터 개수로 바뀝니다 — 다중 채널 입력에 1×1 필터를 여러 개 적용하면{" "}
                  <strong>데이터의 차원 축소 효과</strong>를 얻습니다. 예를 들어 5개 채널의 입력에 1×1 필터 2개를
                  적용하면 크기는 그대로인 채 특징맵이 2장으로 줄어듭니다.
                </p>
              </div>
            </div>
            <Hint>
              블록 그림의 겹친 장 수는 최대 6장까지만 그렸습니다. 숫자는 모두 위 식으로 계산한 값입니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
