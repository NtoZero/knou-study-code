"use client";

import { useEffect, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Hint, Scroller, Slider } from "./ui";
import {
  TANH,
  fmt,
  forward,
  initMlp,
  meanSquaredError,
  misclassRate,
  mulberry32,
  onlineStep,
  shuffled,
  type Sample,
} from "./mlpCore";

/* ─────────── 초기 가중치 실험 ─────────── */

const EPOCHS = 200;
const HIDDEN = 6;

function cosData(n: number, seed: number): Sample[] {
  const rng = mulberry32(seed);
  const out: Sample[] = [];
  for (let i = 0; i < n; i += 1) {
    const x1 = (rng() * 3 - 1.5) * Math.PI;
    const x2 = rng() * 3 - 1.5;
    out.push({
      x: [x1 / (1.5 * Math.PI), x2 / 1.5],
      t: x2 > Math.cos(x1) ? [1, -1] : [-1, 1],
    });
  }
  return out;
}

interface InitRun {
  curve: number[];
  z: number[];
  err: number;
}

function initExperiment(): { random: InitRun; same: InitRun } {
  const data = cosData(200, 11);
  const build = (constant?: number) =>
    initMlp(2, HIDDEN, 2, mulberry32(constant === undefined ? 100 : 1), {
      scale: 0.8,
      hidden: TANH,
      output: TANH,
      constant,
    });
  const go = (constant?: number): InitRun => {
    const net = build(constant);
    const rng = mulberry32(42);
    const curve: number[] = [];
    for (let ep = 0; ep < EPOCHS; ep += 1) {
      for (const s of shuffled(data, rng)) onlineStep(net, s, 0.1);
      curve.push(meanSquaredError(net, data));
    }
    return { curve, z: forward(net, [0.3, -0.2]).z, err: misclassRate(net, data) };
  };
  return { random: go(), same: go(0.3) };
}

const CW = 420;
const CH = 160;
const CPAD = { l: 38, r: 12, t: 12, b: 24 };
const Y_MAX = 0.8;
const px = (e: number) => CPAD.l + (e / (EPOCHS - 1)) * (CW - CPAD.l - CPAD.r);
const py = (v: number) => CH - CPAD.b - (Math.min(v, Y_MAX) / Y_MAX) * (CH - CPAD.t - CPAD.b);

/* ─────────── 활성화 함수 표 ─────────── */

const ACT_TABLE = [
  {
    layer: "은닉 노드",
    rule: "반드시 비선형함수를 사용",
    picks: "시그모이드 함수 · 하이퍼탄젠트 함수 · ReLU 함수",
  },
  {
    layer: "출력 노드 — 회귀 문제",
    rule: "목표 출력값이 임의의 실수값",
    picks: "선형 함수",
  },
  {
    layer: "출력 노드 — 분류 문제",
    rule: "목표 출력값이 클래스 레이블",
    picks: "시그모이드 함수 · 소프트맥스 함수",
  },
];

export default function ModelSetting() {
  const [res, setRes] = useState<{ random: InitRun; same: InitRun } | null>(null);
  const [imgW, setImgW] = useState(70);
  const [imgH, setImgH] = useState(50);

  useEffect(() => {
    setRes(initExperiment());
  }, []);

  return (
    <section id="model-setting" className="scroll-mt-32">
      <SectionTitle
        title="모델 설정 — 은닉 노드 수, 초기 가중치, 학습률, 활성화 함수"
        subtitle="학습을 시작하기 전에 정해 두어야 하는 것들"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "11.3.2 학습의 고려사항 — 은닉 뉴런의 수",
            slides: "MLP 학습의 고려사항 — 은닉 뉴런의 수",
            lecture: "은닉 뉴런의 수는 학습 알고리즘이 초기화하는 값이 아니라, 학습 전 모델 구조를 설정할 때 결정되는 값이라고 분명히 갈라 설명",
          }}
        >
          <Card>
            <CardTitle>구조부터 정한다 — 입력·출력 뉴런과 은닉층</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              다층 퍼셉트론을 학습하기에 앞서 먼저 구조를 결정해야 합니다. 입력 뉴런과 출력 뉴런의 수는 주어진
              데이터에 의해 결정되는 값이므로 문제에 맞게 설정하면 됩니다. 은닉층의 수는 기본적인 모델에서는
              <strong> 한 개</strong>를 사용합니다. 한 개의 은닉층만 사용하더라도 은닉 뉴런의 수만 충분히
              주어지면 원하는 형태의 함수를 모두 근사해 낼 수 있음이 증명되어 있기 때문입니다.
            </p>

            <div className="mt-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <p className="mb-2 text-[12px] font-bold text-sky-700 dark:text-sky-300">
                교재의 예 — 숫자 패턴 0부터 9까지를 인식하는 문제
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Slider label="영상 가로" value={imgW} min={8} max={100} step={1} onChange={setImgW} display={`${imgW}픽셀`} />
                  <Slider label="영상 세로" value={imgH} min={8} max={100} step={1} onChange={setImgH} display={`${imgH}픽셀`} />
                </div>
                <div className="rounded-lg bg-gray-50 p-2.5 font-mono text-[11px] leading-6 dark:bg-gray-800">
                  <div>
                    입력층 = {imgW} × {imgH} ={" "}
                    <span className="font-bold text-sky-600 dark:text-sky-400">
                      {(imgW * imgH).toLocaleString()}개
                    </span>
                  </div>
                  <div>출력층 = 숫자 패턴당 하나 = 10개</div>
                  <div>은닉층 = 1개</div>
                  <div className="mt-1 text-gray-500">
                    은닉 뉴런의 수 = 문제에 의존 — 정해진 답 없음
                  </div>
                </div>
              </div>
              <Hint>
                교재의 예는 70 × 50 = 3,500개입니다. 한 픽셀마다 입력 뉴런 하나가 필요하므로 영상 크기가
                곧 입력층의 크기입니다.
              </Hint>
            </div>

            <p className="mt-3 text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              은닉 뉴런의 수는 실제 문제에서 학습의 속도와 찾아지는 해의 성능을 좌우합니다. 다분히 문제에
              의존적인 값이어서 정확한 해답은 주어지지 않으며, 입력 데이터의 차원과 데이터의 개수 등을
              고려해 조정하는 기술이 필요합니다. 은닉 노드의 수가 많을수록 표현 가능한 함수가 다양하고
              복잡해지지만, <strong>계산 비용</strong>과 <strong>일반화 성능</strong>(많으면 과다적합 발생
              가능성이 높아짐)을 함께 고려해야 합니다.
            </p>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "11.3.3 학습 전략 — 모델 설정(초기 가중치, 학습률)",
            slides: "MLP의 학습 전략 — 초기 조건 설정",
          }}
        >
          <Card>
            <CardTitle>초기 조건 — 가중치는 작은 범위의 랜덤값, 학습률은 1보다 작은 값에서</CardTitle>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-2.5 dark:border-gray-700">
                <p className="text-[12px] font-bold text-sky-700 dark:text-sky-300">초기 가중치</p>
                <p className="mt-1 text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                  작은 범위의 실수값으로 <strong>랜덤하게</strong> 설정합니다.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-2.5 dark:border-gray-700">
                <p className="text-[12px] font-bold text-sky-700 dark:text-sky-300">학습률</p>
                <p className="mt-1 text-[12px] leading-5 text-gray-700 dark:text-gray-200">
                  1보다 작은 값에서 시작하여 학습 진행 상황에 따라 조정합니다.
                </p>
              </div>
            </div>

            <p className="mb-2 mt-4 text-[12px] font-bold text-gray-700 dark:text-gray-200">
              모든 가중치를 같은 값으로 두면 어떻게 되는가
            </p>
            {!res ? (
              <p className="py-10 text-center text-xs text-gray-400">학습 중…</p>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                  <Scroller>
                    <svg viewBox={`0 0 ${CW} ${CH}`} className="h-auto w-full min-w-[380px]">
                      <line x1={CPAD.l} y1={CH - CPAD.b} x2={CW - CPAD.r} y2={CH - CPAD.b} stroke="#cbd5e1" />
                      <line x1={CPAD.l} y1={CPAD.t} x2={CPAD.l} y2={CH - CPAD.b} stroke="#cbd5e1" />
                      {[0, 0.2, 0.4, 0.6, 0.8].map((v) => (
                        <g key={v}>
                          <line x1={CPAD.l - 3} y1={py(v)} x2={CPAD.l} y2={py(v)} stroke="#cbd5e1" />
                          <text x={CPAD.l - 5} y={py(v) + 3} fontSize="8" textAnchor="end" fill="#94a3b8">
                            {v.toFixed(1)}
                          </text>
                        </g>
                      ))}
                      <polyline
                        points={res.random.curve.map((v, i) => `${px(i)},${py(v)}`).join(" ")}
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth={1.8}
                      />
                      <polyline
                        points={res.same.curve.map((v, i) => `${px(i)},${py(v)}`).join(" ")}
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth={1.8}
                        strokeDasharray="5 3"
                      />
                      <text x={CW - CPAD.r} y={CH - 4} fontSize="9" textAnchor="end" fill="#94a3b8">
                        학습 에포크 수
                      </text>
                      <text x={CPAD.l + 4} y={CPAD.t + 9} fontSize="9" fill="#94a3b8">
                        E(X, θ)
                      </text>
                    </svg>
                    <div className="mt-1 flex flex-wrap gap-3 pl-9 text-[10px]">
                      <span className="flex items-center gap-1 text-sky-600">
                        <span className="inline-block h-0.5 w-4 bg-sky-600" />
                        작은 범위의 랜덤값 (±0.8)
                      </span>
                      <span className="flex items-center gap-1 text-rose-600">
                        <span className="inline-block h-0.5 w-4 border-t border-dashed border-rose-600" />
                        모두 0.3으로 동일
                      </span>
                    </div>
                  </Scroller>

                  <div className="space-y-2">
                    <div className="rounded-lg bg-gray-50 p-2.5 font-mono text-[10.5px] leading-5 dark:bg-gray-800">
                      <div className="font-bold text-sky-600 dark:text-sky-400">랜덤 초기화</div>
                      <div>마지막 오차 {fmt(res.random.curve[EPOCHS - 1], 4)}</div>
                      <div>오분류율 {fmt(res.random.err * 100, 1)}%</div>
                      <div className="mt-1 text-[9.5px] text-gray-500">
                        은닉 노드 출력 z = [{res.random.z.map((v) => fmt(v, 2)).join(", ")}]
                      </div>
                    </div>
                    <div className="rounded-lg bg-rose-50 p-2.5 font-mono text-[10.5px] leading-5 dark:bg-rose-950/30">
                      <div className="font-bold text-rose-600 dark:text-rose-400">모두 같은 값</div>
                      <div>마지막 오차 {fmt(res.same.curve[EPOCHS - 1], 4)}</div>
                      <div>오분류율 {fmt(res.same.err * 100, 1)}%</div>
                      <div className="mt-1 text-[9.5px] text-gray-500">
                        은닉 노드 출력 z = [{res.same.z.map((v) => fmt(v, 2)).join(", ")}]
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                  가중치를 전부 같은 값으로 두면 은닉 노드 {HIDDEN}개의 출력 zⱼ가 모두 같은 값이 됩니다. 입력에
                  곱해지는 가중치가 같으니 uⱼʰ가 같고, 역전파되어 오는 δⱼ도 같으니 수정량도 같아 영원히 같은
                  값을 유지합니다. 결국 은닉 노드를 {HIDDEN}개 두었어도 사실상 하나짜리 신경망으로만
                  동작합니다. 붉은 곡선이 초반에 조금 떨어졌다가 더 내려가지 못하고 오히려 되올라가는 것이
                  그 때문입니다. 초기 가중치를 랜덤하게 두라는 말은 이 이유에서 나옵니다.
                </p>
                <ComputedNote>
                  이 비교 실험의 수치는 이 페이지에서 직접 학습시켜 얻은 값입니다. 교재·강의록에는 초기
                  가중치를 작은 범위의 실수값으로 랜덤하게 설정한다는 설명만 있습니다.
                </ComputedNote>
              </>
            )}
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "11.3.3 학습 전략 — 활성화 함수의 선택",
            slides: "MLP의 학습 전략 — 활성화 함수",
          }}
        >
          <Card>
            <CardTitle>활성화 함수의 선택</CardTitle>
            <Scroller>
              <table className="w-full min-w-[440px] text-[12px]">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                    <th className="px-2 py-1.5 font-semibold">자리</th>
                    <th className="px-2 py-1.5 font-semibold">기준</th>
                    <th className="px-2 py-1.5 font-semibold">선택</th>
                  </tr>
                </thead>
                <tbody>
                  {ACT_TABLE.map((r) => (
                    <tr key={r.layer} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="whitespace-nowrap px-2 py-1.5 font-semibold text-sky-700 dark:text-sky-300">
                        {r.layer}
                      </td>
                      <td className="px-2 py-1.5 text-gray-600 dark:text-gray-300">{r.rule}</td>
                      <td className="px-2 py-1.5 text-gray-700 dark:text-gray-200">{r.picks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Scroller>
            <Hint>
              은닉 노드에는 비선형함수를 써야 한다는 것이 조건입니다. 다층 퍼셉트론 자체가 비선형 결정경계를
              만들기 위해 은닉층을 추가한 모델이고, 역전파 식에서도 은닉 노드로 전파되는 오류에 활성화 함수의
              미분값 φʰ′(uⱼʰ)가 곱해집니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
