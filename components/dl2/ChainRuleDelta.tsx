"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Scroller, Tag } from "@/components/dlShared/ui";
import { F, Chip2 } from "@/components/dl2/ui2";

type Layer = "output" | "hidden";

interface Term {
  key: string;
  tex: React.ReactNode;
  name: string;
  body: string;
}

const OUT_TERMS: Term[] = [
  {
    key: "o-dEdw",
    tex: (
      <>
        ∂E / ∂w<sub>jk</sub><sup>(L)</sup>
      </>
    ),
    name: "구하려는 것",
    body: "출력층 k번 뉴런으로 들어오는 연결 가중치 하나를 조금 바꿨을 때 손실이 얼마나 변하는가. 이 값에 학습률을 곱한 만큼 가중치를 옮깁니다.",
  },
  {
    key: "o-delta",
    tex: (
      <>
        δ<sub>k</sub><sup>(L)</sup> = ∂E / ∂u<sub>k</sub><sup>(L)</sup>
      </>
    ),
    name: "델타 — 가중합에 대한 손실의 기울기",
    body: "가중합 u를 조금 바꿨을 때 손실이 얼마나 변하는가. 단층 퍼셉트론에서는 ŷ − y 를 델타로 썼지만, 역전파에서는 가중합 u로 손실함수를 편미분한 것을 델타라고 부릅니다.",
  },
  {
    key: "o-dudw",
    tex: (
      <>
        ∂u<sub>k</sub><sup>(L)</sup> / ∂w<sub>jk</sub><sup>(L)</sup> = o<sub>j</sub><sup>(L−1)</sup>
      </>
    ),
    name: "앞 층의 출력",
    body: "u는 앞 층 출력들에 가중치를 곱해 더한 값입니다. w_jk 로 편미분하면 그 가중치에 곱해져 있던 앞 층 출력 o_j 만 남습니다. 나머지 항은 상수라 미분하면 0입니다.",
  },
  {
    key: "o-expand",
    tex: (
      <>
        δ<sub>k</sub><sup>(L)</sup> = ŷ<sub>k</sub>(1 − ŷ<sub>k</sub>)(ŷ<sub>k</sub> − y<sub>k</sub>)
      </>
    ),
    name: "델타를 다시 체인 룰로 푼 결과",
    body: "δ를 (∂E/∂ŷ)·(∂ŷ/∂u)로 쪼갭니다. 앞쪽은 오차 제곱합을 미분해 ŷ − y, 뒤쪽은 시그모이드의 미분이라 ŷ(1 − ŷ). 둘을 곱하면 이 식이 됩니다.",
  },
];

const HID_TERMS: Term[] = [
  {
    key: "h-dEdw",
    tex: (
      <>
        ∂E / ∂w<sub>ij</sub><sup>(L)</sup>
      </>
    ),
    name: "구하려는 것",
    body: "은닉층 j번 뉴런으로 들어오는 연결 가중치에 대한 손실의 기울기. 은닉층에는 레이블이 없지만, 이 값은 구할 수 있습니다.",
  },
  {
    key: "h-delta",
    tex: (
      <>
        δ<sub>j</sub><sup>(L)</sup> = ∂E / ∂u<sub>j</sub><sup>(L)</sup>
      </>
    ),
    name: "은닉층의 델타",
    body: "모양은 출력층과 같습니다. 다만 손실과 직접 이어진 레이블이 없으므로, 다음 층의 델타를 빌려 와야 합니다.",
  },
  {
    key: "h-sum",
    tex: (
      <>
        ∂E / ∂o<sub>j</sub><sup>(L)</sup> = Σ<sub>k</sub> δ<sub>k</sub><sup>(L+1)</sup>{" "}
        · w<sub>jk</sub><sup>(L+1)</sup>
      </>
    ),
    name: "다음 층에서 되돌아오는 신호",
    body: "이 뉴런의 출력 o_j 는 다음 층의 모든 뉴런으로 퍼져 나갑니다. 그러므로 o_j 를 바꿨을 때의 손실 변화는 다음 층 뉴런들의 델타를 그 연결 가중치로 가중해 모두 더한 값입니다. 역전파라는 이름이 여기서 나옵니다.",
  },
  {
    key: "h-expand",
    tex: (
      <>
        δ<sub>j</sub><sup>(L)</sup> = o<sub>j</sub><sup>(L)</sup>(1 − o<sub>j</sub><sup>(L)</sup>)
        ( Σ<sub>k</sub> δ<sub>k</sub><sup>(L+1)</sup> · w<sub>jk</sub><sup>(L+1)</sup> )
      </>
    ),
    name: "은닉층 델타의 최종 모양",
    body: "되돌아온 신호에 그 뉴런 자신의 시그모이드 미분 o(1 − o)를 곱합니다. 이 값을 다시 앞 층으로 넘기면서 입력층 쪽으로 계속 내려갑니다.",
  },
];

export default function ChainRuleDelta() {
  const [layer, setLayer] = useState<Layer>("output");
  const [open, setOpen] = useState<string | null>("o-delta");
  const terms = layer === "output" ? OUT_TERMS : HID_TERMS;
  const picked = terms.find((t) => t.key === open) ?? null;

  return (
    <section id="chain-rule-delta" className="scroll-mt-32">
      <SectionTitle
        title="체인 룰로 편미분을 쪼개기"
        subtitle="복잡한 미분을 한 번에 하지 않고, 중간 단계를 끼워 곱으로 나눕니다"
      />

      <Sourced
        refs={{
          slides: "3. 역전파 알고리즘 — 체인 룰(chain rule)을 이용한 편미분 계산",
        }}
      >
        <Card>
          <CardTitle>체인 룰 자체는 이것뿐</CardTitle>
          <div className="grid gap-3 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <Scroller>
              <svg viewBox="0 0 320 96" className="h-auto w-full min-w-[300px]" role="img">
                <title>x에서 y를 거쳐 z로 가는 두 단계로 나눈 함수</title>
                <line x1="18" y1="40" x2="70" y2="40" strokeWidth="1.5" className="stroke-gray-400" />
                <rect
                  x="70"
                  y="22"
                  width="56"
                  height="36"
                  rx="5"
                  className="fill-white stroke-indigo-400 dark:fill-gray-900"
                  strokeWidth="1.5"
                />
                <text x="98" y="45" textAnchor="middle" className="fill-indigo-600 text-[14px] font-bold dark:fill-indigo-300">
                  g
                </text>
                <line x1="126" y1="40" x2="186" y2="40" strokeWidth="1.5" className="stroke-gray-400" />
                <rect
                  x="186"
                  y="22"
                  width="56"
                  height="36"
                  rx="5"
                  className="fill-white stroke-indigo-400 dark:fill-gray-900"
                  strokeWidth="1.5"
                />
                <text x="214" y="45" textAnchor="middle" className="fill-indigo-600 text-[14px] font-bold dark:fill-indigo-300">
                  h
                </text>
                <line x1="242" y1="40" x2="296" y2="40" strokeWidth="1.5" className="stroke-gray-400" />
                <text x="8" y="44" className="fill-gray-600 text-[12px] font-bold dark:fill-gray-200">
                  x
                </text>
                <text x="150" y="32" textAnchor="middle" className="fill-gray-600 text-[12px] font-bold dark:fill-gray-200">
                  y
                </text>
                <text x="300" y="44" className="fill-gray-600 text-[12px] font-bold dark:fill-gray-200">
                  z
                </text>
                <rect
                  x="62"
                  y="12"
                  width="188"
                  height="56"
                  rx="8"
                  fill="none"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                  className="stroke-indigo-400"
                />
                <text x="156" y="84" textAnchor="middle" className="fill-indigo-500 text-[10px] font-bold">
                  f = h ∘ g
                </text>
              </svg>
            </Scroller>
            <div className="space-y-2">
              <F note="중간값 y를 끼워 두 미분의 곱으로 나눈다">
                ∂z/∂x = (∂z/∂y) · (∂y/∂x)
              </F>
              <Hint>
                z를 x로 직접 미분하기 어려울 때, 함수를 몇 단계로 나누고 각 단계의 미분을 곱해
                구합니다. 역전파는 이 분해를 층 수만큼 반복하는 것입니다.
              </Hint>
            </div>
          </div>
        </Card>
      </Sourced>

      <Sourced
        className="mt-4"
        refs={{
          slides:
            layer === "output"
              ? "3. 역전파 알고리즘 — 출력층 연결 가중치의 학습 (k번째 출력 뉴런)"
              : "3. 역전파 알고리즘 — 은닉층 연결 가중치의 학습 (j번째 은닉층 뉴런)",
          lecture:
            layer === "hidden"
              ? "은닉층에는 레이블이 제공되지 않지만, 같은 방법으로 가중치를 어떻게 업데이트할지 결정할 수 있다"
              : undefined,
        }}
      >
        <Card>
          <CardTitle>식의 각 조각을 눌러 뜻 확인하기</CardTitle>
          <div className="mb-3 flex flex-wrap gap-2">
            <Chip2
              active={layer === "output"}
              onClick={() => {
                setLayer("output");
                setOpen("o-delta");
              }}
            >
              출력층 가중치
            </Chip2>
            <Chip2
              active={layer === "hidden"}
              onClick={() => {
                setLayer("hidden");
                setOpen("h-sum");
              }}
            >
              은닉층 가중치
            </Chip2>
          </div>

          <Scroller>
            <div className="min-w-[340px]">
              <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                <button
                  type="button"
                  onClick={() => setOpen(terms[0].key)}
                  className={`rounded-md border px-2 py-1.5 text-[12px] font-semibold transition-colors ${
                    open === terms[0].key
                      ? "border-indigo-500 bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-200"
                      : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                  }`}
                >
                  {terms[0].tex}
                </button>
                <span className="text-gray-400">=</span>
                <button
                  type="button"
                  onClick={() => setOpen(terms[1].key)}
                  className={`rounded-md border px-2 py-1.5 text-[12px] font-semibold transition-colors ${
                    open === terms[1].key
                      ? "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200"
                      : "border-gray-200 bg-white text-gray-700 hover:border-rose-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                  }`}
                >
                  {layer === "output" ? (
                    <>
                      δ<sub>k</sub><sup>(L)</sup>
                    </>
                  ) : (
                    <>
                      δ<sub>j</sub><sup>(L)</sup>
                    </>
                  )}
                </button>
                <span className="text-gray-400">·</span>
                <button
                  type="button"
                  onClick={() => setOpen(terms[2].key)}
                  className={`rounded-md border px-2 py-1.5 text-[12px] font-semibold transition-colors ${
                    open === terms[2].key
                      ? "border-indigo-500 bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-200"
                      : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                  }`}
                >
                  {layer === "output" ? (
                    <>
                      o<sub>j</sub><sup>(L−1)</sup>
                    </>
                  ) : (
                    <>
                      o<sub>i</sub><sup>(L−1)</sup>
                    </>
                  )}
                </button>
                <span className="ml-2 text-[11px] text-gray-400">
                  … 여기서 델타는
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(terms[3].key)}
                  className={`rounded-md border px-2 py-1.5 text-[12px] font-semibold transition-colors ${
                    open === terms[3].key
                      ? "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200"
                      : "border-gray-200 bg-white text-gray-700 hover:border-rose-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                  }`}
                >
                  {terms[3].tex}
                </button>
              </div>
            </div>
          </Scroller>

          {picked && (
            <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 transition-colors dark:border-gray-700 dark:bg-gray-900">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <Tag tone="teal">{picked.name}</Tag>
                <span className="min-w-0 font-mono text-[12px] font-bold text-indigo-700 dark:text-indigo-300">
                  {picked.tex}
                </span>
              </div>
              <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
                {picked.body}
              </p>
            </div>
          )}

          {layer === "hidden" && (
            <Scroller>
              <svg viewBox="0 0 340 150" className="mt-3 h-auto w-full min-w-[320px]" role="img">
                <title>은닉층 뉴런 하나의 출력이 다음 층 여러 뉴런으로 퍼졌다가 델타로 되돌아오는 모습</title>
                {[40, 75, 110].map((y, i) => (
                  <line
                    key={i}
                    x1="112"
                    y1="75"
                    x2="226"
                    y2={y}
                    strokeWidth="1.4"
                    className="stroke-gray-300 dark:stroke-gray-600"
                  />
                ))}
                {[40, 75, 110].map((y) => (
                  <path
                    key={`back-${y}`}
                    d={`M 222 ${y + 6} Q 170 ${y + 26} 118 83`}
                    fill="none"
                    strokeWidth="1.6"
                    strokeDasharray="5 4"
                    className="stroke-rose-500"
                  />
                ))}
                <circle
                  cx="100"
                  cy="75"
                  r="17"
                  strokeWidth="1.8"
                  className="fill-indigo-50 stroke-indigo-500 dark:fill-indigo-950 dark:stroke-indigo-400"
                />
                <text x="100" y="80" textAnchor="middle" className="fill-indigo-700 text-[11px] font-bold dark:fill-indigo-200">
                  o
                </text>
                <text x="100" y="42" textAnchor="middle" className="fill-gray-500 text-[9px]">
                  은닉층 j
                </text>
                {[40, 75, 110].map((y, i) => (
                  <g key={`n-${i}`}>
                    <circle
                      cx="240"
                      cy={y}
                      r="14"
                      strokeWidth="1.6"
                      className="fill-white stroke-gray-400 dark:fill-gray-900 dark:stroke-gray-600"
                    />
                    <text x="240" y={y + 4} textAnchor="middle" className="fill-rose-600 text-[10px] font-bold dark:fill-rose-300">
                      δ
                    </text>
                  </g>
                ))}
                <text x="268" y="26" className="fill-gray-500 text-[9px]">
                  다음 층 (L+1)
                </text>
                <text x="130" y="140" className="fill-rose-500 text-[10px] font-bold">
                  δ를 가중치로 가중해 되돌려 더한다
                </text>
              </svg>
            </Scroller>
          )}
        </Card>
      </Sourced>
    </section>
  );
}
