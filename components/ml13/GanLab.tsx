"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Formula, Hint, Scroller } from "./ui";

/**
 * 13.1.4 영상변환 및 생성을 위한 딥러닝 — (2) GAN 모델.
 *
 * 구조·학습 순서·변형 모델은 교재와 강의록 그대로이고,
 * 아래 실습은 생성기와 판별기를 번갈아 학습시킨다는 점만 1차원 예로 실제 계산한 것이다.
 */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussians(n: number, seed: number): number[] {
  const rnd = mulberry32(seed);
  const out: number[] = [];
  while (out.length < n) {
    const u = Math.max(rnd(), 1e-9);
    const v = rnd();
    const r = Math.sqrt(-2 * Math.log(u));
    out.push(r * Math.cos(2 * Math.PI * v));
    if (out.length < n) out.push(r * Math.sin(2 * Math.PI * v));
  }
  return out;
}

/**
 * 표본의 평균을 정확히 0으로 맞춘다.
 * 이렇게 두어야 그림에 그린 분포의 중심과 아래에 적는 숫자가 같은 값을 가리킨다.
 */
function centered(n: number, seed: number): number[] {
  const g = gaussians(n, seed);
  const mean = g.reduce((s, v) => s + v, 0) / n;
  return g.map((v) => v - mean);
}

const sigmoid = (u: number) => 1 / (1 + Math.exp(-u));

const M = 64; // 한 번에 쓰는 표본 수
const REAL_MEAN = 3; // 진짜 데이터가 나오는 분포의 중심 — 이 화면에서 정한 값
const LR_D = 0.15;
const LR_G = 0.03;
const K_D = 4; // 생성기를 한 번 고칠 때마다 판별기를 고치는 횟수
const T = 300;

interface Frame {
  theta: number;
  w: number;
  b: number;
  dReal: number;
  dFake: number;
}

/** 표본 평균이 정확히 REAL_MEAN인 진짜 데이터 */
const REAL = centered(M, 7).map((z) => z + REAL_MEAN);
/** 표본 평균이 정확히 0인 잡음 — 따라서 생성 표본의 평균은 정확히 θ가 된다 */
const NOISE = centered(M, 11);
/** 화면이 기준으로 삼는 값 — 그려진 진짜 표본 64개의 평균 */
const REAL_SAMPLE_MEAN = REAL.reduce((s, v) => s + v, 0) / M;

function simulate(): Frame[] {
  let theta = -2; // 생성기의 파라미터 — 생성 분포의 중심
  let w = 0.8;
  let b = -0.5;

  const frames: Frame[] = [];
  for (let t = 0; t <= T; t += 1) {
    const fake = NOISE.map((z) => z + theta);
    const dR = REAL.map((x) => sigmoid(w * x + b));
    const dF = fake.map((x) => sigmoid(w * x + b));
    frames.push({
      theta,
      w,
      b,
      dReal: dR.reduce((s, v) => s + v, 0) / M,
      dFake: dF.reduce((s, v) => s + v, 0) / M,
    });
    if (t === T) break;

    // ① 판별기 — 진짜는 1, 가짜는 0이 나오도록
    for (let k = 0; k < K_D; k += 1) {
      const fk = NOISE.map((z) => z + theta);
      const dr = REAL.map((x) => sigmoid(w * x + b));
      const df = fk.map((x) => sigmoid(w * x + b));
      let gw = 0;
      let gb = 0;
      for (let i = 0; i < M; i += 1) {
        gw += (1 - dr[i]) * REAL[i] - df[i] * fk[i];
        gb += 1 - dr[i] - df[i];
      }
      w += (LR_D * gw) / M;
      b += (LR_D * gb) / M;
    }

    // ② 생성기 — 자신이 만든 것에 판별기가 1을 내도록
    const fake2 = NOISE.map((z) => z + theta);
    let gt = 0;
    for (let i = 0; i < M; i += 1) {
      gt += (1 - sigmoid(w * fake2[i] + b)) * w;
    }
    theta += (LR_G * gt) / M;
  }
  return frames;
}

const CW = 440;
const CH = 150;

function curve(mean: number, x: number) {
  return Math.exp(-((x - mean) ** 2) / 2);
}

export default function GanLab() {
  const frames = useMemo(simulate, []);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setT((v) => {
        if (v >= frames.length - 1) {
          setPlaying(false);
          return v;
        }
        return v + 1;
      });
    }, 30);
    return () => window.clearInterval(id);
  }, [playing, frames.length]);

  const f = frames[t];
  const xMin = -6;
  const xMax = 8;
  const px = (x: number) => ((x - xMin) / (xMax - xMin)) * CW;
  const points = (mean: number) =>
    Array.from({ length: 120 }, (_, i) => {
      const x = xMin + ((xMax - xMin) * i) / 119;
      return `${px(x)},${CH - 24 - curve(mean, x) * 96}`;
    }).join(" ");

  const dLine = Array.from({ length: 120 }, (_, i) => {
    const x = xMin + ((xMax - xMin) * i) / 119;
    return `${px(x)},${CH - 24 - sigmoid(f.w * x + f.b) * 96}`;
  }).join(" ");

  const VARIANTS = [
    {
      name: "conditional GAN (cGAN)",
      where: "Image-to-Image Translation",
      detail:
        "생성기의 입력으로 단순 랜덤값이 아닌 에지 영상을 제공하고, 판별기에는 에지 영상과 컬러링된 영상의 쌍을 입력으로 주어 그 쌍이 원래 주어진 실제(real) 쌍인지 가짜(fake)인지를 판단하도록 구성한다.",
    },
    {
      name: "Cycle GAN (ICCV 2017)",
      where: "Unpaired Image-to-Image Translation",
      detail: "짝지어지지 않은 두 영상 집합 사이의 변환을 학습한다.",
    },
    {
      name: "Coupled GAN “CoGAN” (NIPS 2016)",
      where: "이미지의 속성 변환",
      detail: "머리색, 미소, 안경 같은 속성을 바꾼다.",
    },
    {
      name: "Progressive GAN (ICLR 2018)",
      where: "고해상도 영상 생성",
      detail: "고해상도 영상 생성을 위해 생성기와 판별기를 층별로 학습한다.",
    },
    {
      name: "Style GAN (CVPR 2019)",
      where: "스타일 조정",
      detail: "스타일 조정을 위한 매핑 모듈을 추가한다 — 성별, 포즈, 머리색, 피부색 등.",
    },
  ];

  return (
    <section id="gan" className="scroll-mt-32">
      <SectionTitle
        title="GAN — 만드는 쪽과 가려내는 쪽이 번갈아 배운다"
        subtitle="목표 출력값이 없는 문제를 어떻게 학습시키는가에 대한 답입니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "13.1.4 영상변환 및 생성을 위한 딥러닝 — (2) GAN 모델",
            slides: "GAN 모델 — Generative Adversarial Networks",
          }}
        >
          <Card>
            <CardTitle>왜 판별기가 필요한가</CardTitle>
            <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              GAN의 기본 목적은 영상생성이므로 생성기 G만 있으면 충분하다고 생각할 수 있다. 그런데
              문제는 <strong>G의 출력은 새로운 영상을 만들어 낸 것이므로 그에 대한 목표 출력값이 따로
              주어지지 않는다</strong>는 점이다. 따라서 학습을 위해서는 G의 출력값을 평가하여 손실
              신호를 만들어 주는 방법이 필요하다. 판별기 D는 이러한 역할을 위해 추가된 모듈이다.
            </p>

            <Scroller>
              <div className="mt-3 min-w-[380px] space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-28 shrink-0 rounded-md border border-gray-300 px-2 py-1.5 text-center text-[10.5px] font-semibold dark:border-gray-600">
                    Training samples
                    <br />
                    <span className="text-[9px] font-normal text-gray-400">
                      생성 영상과 같은 도메인
                    </span>
                  </div>
                  <span className="text-gray-300">→</span>
                  <div className="flex-1 rounded-md bg-emerald-600 py-2 text-center text-[11px] font-bold text-white">
                    Discriminator D — 판별기
                  </div>
                  <div className="w-20 shrink-0 text-[10.5px] font-mono text-gray-500">
                    1 real
                    <br />0 fake
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-28 shrink-0 rounded-md border border-gray-300 px-2 py-1.5 text-center text-[10.5px] font-semibold dark:border-gray-600">
                    random input
                  </div>
                  <span className="text-gray-300">→</span>
                  <div className="flex-1 rounded-md bg-blue-600 py-2 text-center text-[11px] font-bold text-white">
                    Generator G — 생성기
                  </div>
                  <div className="w-20 shrink-0 text-[10.5px] text-gray-500">fake image ↑</div>
                </div>
              </div>
            </Scroller>

            <ul className="mt-3 space-y-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              <li>
                • <strong>생성기 G</strong> — 주어진 랜덤 입력으로부터 영상 생성. 목표 출력값 없음.
              </li>
              <li>
                • <strong>판별기 D</strong> — 입력 영상이 실제 영상인지, G에 의해 만들어진 가짜
                영상인지 판별. G의 출력값을 평가하여 손실(오류) 신호를 만들어 주는 역할.
              </li>
              <li>
                • <strong>학습의 목적</strong> — 판별기를 속일 수 있는 최대한 진짜 같은 영상을 만드는
                것.
              </li>
            </ul>
            <Hint>
              Ian Goodfellow 등, NIPS 2014. 영상생성 모델로 출발해 영상변환 모델로 확장되었다.
              판별기는 학습 데이터로부터 추출한 영상에 대해서는 1의 출력을 내고 G로부터 생성된 영상은
              0의 출력을 내도록 학습하며, 생성기는 자신이 생성한 영상에 대해 판별기가 1의 출력을
              내도록 학습한다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced refs={{ slides: "GAN의 학습 — 두 네트워크의 상반된 학습" }}>
          <Card>
            <CardTitle>번갈아 학습시키면 어떻게 되는가</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              G와 D가 서로 상반된 학습을 <strong>번갈아 가면서</strong> 수행한다. 영상 대신 숫자 하나를
              만드는 가장 단순한 경우로 줄여서, 실제로 번갈아 학습시켜 보자. 진짜 데이터는 중심이{" "}
              {REAL_MEAN}인 분포에서 뽑은 표본 {M}개이고, 생성기는 자기가 만드는 표본의 평균 θ만
              조절할 수 있다. 아래에서 기준이 되는 것은 설정값 {REAL_MEAN}이 아니라{" "}
              <strong>그려진 진짜 표본 {M}개의 평균</strong>이다.
            </p>

            <Scroller>
              <svg
                width={CW}
                height={CH}
                viewBox={`0 0 ${CW} ${CH}`}
                className="min-w-[400px]"
                role="img"
                aria-label="진짜 분포와 생성 분포, 판별기의 출력"
              >
                <line
                  x1={0}
                  x2={CW}
                  y1={CH - 24}
                  y2={CH - 24}
                  stroke="currentColor"
                  className="text-gray-300 dark:text-gray-600"
                />
                {[-4, -2, 0, 2, 4, 6].map((x) => (
                  <g key={x}>
                    <line
                      x1={px(x)}
                      x2={px(x)}
                      y1={CH - 24}
                      y2={CH - 20}
                      stroke="currentColor"
                      className="text-gray-300 dark:text-gray-600"
                    />
                    <text
                      x={px(x)}
                      y={CH - 8}
                      textAnchor="middle"
                      fontSize={9}
                      className="fill-gray-400"
                    >
                      {x}
                    </text>
                  </g>
                ))}

                <polyline points={dLine} fill="none" stroke="#a855f7" strokeWidth={1.5} strokeDasharray="4 3" />
                <polyline points={points(REAL_SAMPLE_MEAN)} fill="none" stroke="#16a34a" strokeWidth={2.5} />
                <polyline points={points(f.theta)} fill="none" stroke="#2563eb" strokeWidth={2.5} />

                <text x={px(REAL_SAMPLE_MEAN) + 4} y={28} fontSize={10} fill="#16a34a" fontWeight={700}>
                  진짜 데이터
                </text>
                <text x={px(f.theta) + 4} y={44} fontSize={10} fill="#2563eb" fontWeight={700}>
                  생성기 G
                </text>
                <text x={6} y={16} fontSize={10} fill="#a855f7" fontWeight={700}>
                  판별기 D의 출력
                </text>
              </svg>
            </Scroller>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPlaying((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
              >
                {playing ? <Pause size={13} /> : <Play size={13} />}
                {playing ? "멈춤" : "번갈아 학습"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  setT(0);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:border-gray-600 dark:text-gray-300"
              >
                <RotateCcw size={13} />
                처음부터
              </button>
              <input
                type="range"
                min={0}
                max={frames.length - 1}
                step={1}
                value={t}
                onChange={(e) => {
                  setPlaying(false);
                  setT(Number(e.target.value));
                }}
                className="min-w-[140px] flex-1 accent-blue-600"
                aria-label="학습 횟수"
              />
              <span className="font-mono text-[11px] text-gray-500">
                {t} / {frames.length - 1}회
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Formula note={`생성 표본의 평균 — 진짜 표본의 평균 ${REAL_SAMPLE_MEAN}으로 다가간다`}>
                θ = {f.theta.toFixed(3)}
              </Formula>
              <Formula note="진짜 영상에 대한 판별기의 평균 출력">
                D(진짜) = {f.dReal.toFixed(3)}
              </Formula>
              <Formula note="가짜 영상에 대한 판별기의 평균 출력">
                D(가짜) = {f.dFake.toFixed(3)}
              </Formula>
            </div>

            <Hint>
              처음에는 두 분포가 멀리 떨어져 있어 D(진짜)는 1에, D(가짜)는 0에 가깝다. 판별기가 쉽게
              가려낸다는 뜻이다. 학습이 진행되면 θ가 진짜 표본의 평균({REAL_SAMPLE_MEAN}) 쪽으로 옮겨
              가고 — 곧 파란 곡선이 초록 곡선에 겹쳐 가고 — 두 출력이 함께 0.5 부근으로 모인다.{" "}
              <strong>판별기가 더 이상 구분하지 못하게 되는 것</strong>이 곧 생성기가 이긴 상태다.
              한쪽 학습을 완전히 끝낸 뒤 다른 쪽을 학습하는 방식이 아니라, 번갈아 가며 진행한다는
              점이 핵심이다.
            </Hint>

            <div className="mt-3">
              <ComputedNote>
                진짜 데이터를 뽑은 분포의 중심 {REAL_MEAN}, 표본 수 {M}개, 학습률, 생성기를 한 번 고칠
                때마다 판별기를 {K_D}번 고친다는 설정, 그리고 생성기가 표본의 평균만 조절한다는
                단순화는 모두 원자료에 없는 값으로 이 화면에서 정한 것입니다. 화면에 뜨는 θ와 D의
                출력값은 그 설정으로 판별기 → 생성기 순서를 번갈아 실제로 계산한 결과입니다. 두 표본은
                평균을 맞추어 뽑았으므로 진짜 표본의 평균은 {REAL_SAMPLE_MEAN}이고, 초록 곡선은 그
                평균에, 파란 곡선은 생성 표본의 평균인 θ에 정확히 놓입니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "13.1.4 영상변환 및 생성을 위한 딥러닝 — conditional GAN과 영상변환",
            slides: "GAN을 활용한 영상변환 · Cycle GAN · Coupled GAN · Progressive GAN · StyleGAN",
          }}
        >
          <Card>
            <CardTitle>GAN의 변형 모델들</CardTitle>
            <div className="space-y-2">
              {VARIANTS.map((v) => (
                <div
                  key={v.name}
                  className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <p className="text-[12px] font-bold text-gray-800 dark:text-gray-100">
                    {v.name}
                    <span className="ml-1.5 font-normal text-blue-600 dark:text-blue-400">
                      {v.where}
                    </span>
                  </p>
                  <p className="mt-0.5 text-[11.5px] leading-5 text-gray-600 dark:text-gray-300">
                    {v.detail}
                  </p>
                </div>
              ))}
            </div>
            <Hint>
              교재는 “초창기 모델에 의해 생성된 영상에는 부자연스러운 부분도 많이 포함되어 있었으나,
              최근에 개발된 progressive GAN이나 style GAN과 같은 모델은 사람이 판별기의 역할을 해도
              구분하기 힘들 정도의 자연스럽고 선명한 영상을 만들어 내고 있다”고 적는다. 강의록은
              여기에 더해, 단일 영상생성 모델에서 벗어나 Transformer · Self-Attention · Diffusion 같은
              최신 생성 모델들과 융합되고 있다고 덧붙인다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
