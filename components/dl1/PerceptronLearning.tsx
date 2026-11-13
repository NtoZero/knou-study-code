"use client";

import { useState } from "react";
import { RotateCcw, ArrowRight } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import {
  Card,
  CardTitle,
  Formula,
  Hint,
  Slider,
  Scroller,
  ComputedNote,
  Tag,
  fmt,
  q12,
} from "@/components/dlShared/ui";

const r2 = (v: number) => Math.round(v * 100) / 100;

/** 공식 연습문제 3번이 준 값 — 처음 화면은 이 상태에서 시작한다 */
const START = { w1: -0.7, w2: 0.2, b: 0.5 };
const SAMPLE = { x1: 0.5, x2: 0.1, y: 0 as 0 | 1 };

interface Row {
  t: number;
  w1: number;
  w2: number;
  b: number;
  u: number;
  yhat: 0 | 1;
  delta: number;
}

export default function PerceptronLearning() {
  const [w1, setW1] = useState(START.w1);
  const [w2, setW2] = useState(START.w2);
  const [b, setB] = useState(START.b);
  const [x1, setX1] = useState(SAMPLE.x1);
  const [x2, setX2] = useState(SAMPLE.x2);
  const [y, setY] = useState<0 | 1>(SAMPLE.y);
  const [eta, setEta] = useState(0.1);
  const [rows, setRows] = useState<Row[]>([]);

  const u = q12(w1 * x1 + w2 * x2 + b);
  const yhat: 0 | 1 = u >= 0 ? 1 : 0;
  const delta = yhat - y;
  const nw1 = q12(w1 - eta * delta * x1);
  const nw2 = q12(w2 - eta * delta * x2);
  const nb = q12(b - eta * delta);

  const step = () => {
    setRows((prev) => [
      ...prev,
      { t: prev.length, w1, w2, b, u, yhat, delta },
    ]);
    setW1(nw1);
    setW2(nw2);
    setB(nb);
  };

  const reset = () => {
    setW1(START.w1);
    setW2(START.w2);
    setB(START.b);
    setX1(SAMPLE.x1);
    setX2(SAMPLE.x2);
    setY(SAMPLE.y);
    setEta(0.1);
    setRows([]);
  };

  return (
    <section id="perceptron-learning" className="scroll-mt-32">
      <SectionTitle
        title="퍼셉트론은 어떻게 학습하나"
        subtitle="오차 δ와 입력의 곱에 비례해 가중치와 바이어스를 조금씩 옮깁니다"
      />

      <div className="space-y-4">
        <Sourced
          refs={{
            slides: "2. 단층 퍼셉트론(Single-layer perceptron) — 퍼셉트론의 학습",
          }}
        >
          <Card>
            <CardTitle>지도학습 방식 — 학습표본 (x, y)의 집합</CardTitle>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[12px] font-bold text-gray-500">학습표본</p>
                <p className="mt-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                  <b>x</b> = [x₁ x₂ ⋯ x_d]ᵀ : 입력
                  <br />
                  <b>y</b> : 레이블
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[12px] font-bold text-gray-500">학습 대상 파라미터</p>
                <p className="mt-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                  <b>w</b> = [w₁ w₂ ⋯ w_d]ᵀ : 입력이 뉴런에 전달되는 연결의 가중치
                  <br />
                  <b>b</b> : 바이어스
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                <p className="text-[12.5px] font-bold text-gray-700 dark:text-gray-200">
                  Step 1. 파라미터(w와 b) 초기화
                </p>
                <p className="mt-1 text-[12.5px] leading-6 text-gray-600 dark:text-gray-300">
                  작은 크기의 랜덤 값으로 초기화함.
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                <p className="text-[12.5px] font-bold text-gray-700 dark:text-gray-200">
                  Step 2. 모든 학습 표본을 대상으로 파라미터 업데이트를 반복
                </p>
                <ol className="mt-2 space-y-2 text-[12.5px] leading-6 text-gray-600 dark:text-gray-300">
                  <li>
                    <b>①</b> t번 반복 업데이트된 w(t)와 b(t)를 이용하여 k번째 학습표본 x⁽ᵏ⁾에 대한 출력
                    ŷ⁽ᵏ⁾를 예측함.
                    <Formula className="mt-1">ŷ⁽ᵏ⁾ = φ_step( Σ wᵢ(t)·xᵢ⁽ᵏ⁾ + b(t) )</Formula>
                  </li>
                  <li>
                    <b>②</b> 오차 δ = ŷ⁽ᵏ⁾ − y⁽ᵏ⁾ 와 입력의 곱에 비례하여 w와 b를 업데이트함.
                    <Formula className="mt-1" note="η : 학습률">
                      wᵢ(t+1) = wᵢ(t) − ηδxᵢ⁽ᵏ⁾ ,&nbsp;&nbsp; b(t+1) = b(t) − ηδ
                    </Formula>
                  </li>
                </ol>
              </div>
            </div>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "2. 단층 퍼셉트론 — 퍼셉트론의 학습 (업데이트 식)",
            lecture: "ŷ와 y가 모두 0 또는 1이므로 δ는 0, 1, −1 세 값 중 하나가 된다",
          }}
        >
          <Card>
            <CardTitle>한 걸음씩 직접 업데이트해 보기</CardTitle>
            <p className="mb-3 text-[12.5px] leading-6 text-gray-600 dark:text-gray-300">
              처음 값은 <b>공식 연습문제 3번</b>과 같습니다 — 입력 (0.5, 0.1), 레이블 0, w = (−0.7, 0.2),
              b = 0.5, 학습률 0.1.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-gray-500">학습표본</p>
                <Slider label="x₁" value={x1} min={-2} max={2} step={0.1} onChange={(v) => setX1(r2(v))} display={fmt(x1, 2)} />
                <Slider label="x₂" value={x2} min={-2} max={2} step={0.1} onChange={(v) => setX2(r2(v))} display={fmt(x2, 2)} />
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">레이블 y</span>
                  {([0, 1] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setY(v)}
                      aria-pressed={y === v}
                      className={`rounded-full border px-3 py-0.5 text-[11px] font-bold ${
                        y === v
                          ? "border-teal-600 bg-teal-600 text-white"
                          : "border-gray-200 text-gray-500 dark:border-gray-700"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <Slider label="η (학습률)" value={eta} min={0.01} max={0.5} step={0.01} onChange={(v) => setEta(r2(v))} display={fmt(eta, 2)} />
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-gray-500">현재 파라미터</p>
                <Slider label="w₁" value={w1} min={-2} max={2} step={0.01} onChange={(v) => setW1(r2(v))} display={fmt(w1, 2)} />
                <Slider label="w₂" value={w2} min={-2} max={2} step={0.01} onChange={(v) => setW2(r2(v))} display={fmt(w2, 2)} />
                <Slider label="b" value={b} min={-2} max={2} step={0.01} onChange={(v) => setB(r2(v))} display={fmt(b, 2)} />
              </div>
            </div>

            <div className="mt-3 rounded-lg bg-gray-50 p-3 font-mono text-[12px] leading-6 text-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
              <p>
                u = x₁w₁ + x₂w₂ + b = ({fmt(x1, 2)})({fmt(w1, 2)}) + ({fmt(x2, 2)})({fmt(w2, 2)}) +{" "}
                {fmt(b, 2)} = <b>{fmt(u, 3)}</b>
              </p>
              <p>
                u {u >= 0 ? "≥" : "<"} 0 → ŷ = <b>{yhat}</b> , δ = ŷ − y = {yhat} − {y} ={" "}
                <b>{delta}</b>
              </p>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {delta === 0 ? (
                <Tag tone="teal">δ = 0 — 분류가 맞았으므로 파라미터가 변하지 않음</Tag>
              ) : (
                <Tag tone="rose">δ = {delta} — 파라미터를 업데이트함</Tag>
              )}
            </div>

            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {[
                { k: "w₁", cur: w1, next: nw1, term: `η·δ·x₁ = ${fmt(eta * delta * x1, 3)}` },
                { k: "w₂", cur: w2, next: nw2, term: `η·δ·x₂ = ${fmt(eta * delta * x2, 3)}` },
                { k: "b", cur: b, next: nb, term: `η·δ = ${fmt(eta * delta, 3)}` },
              ].map((c) => (
                <div
                  key={c.k}
                  className="rounded-lg border border-gray-200 p-2.5 text-center dark:border-gray-700"
                >
                  <p className="text-[11px] font-bold text-gray-500">{c.k}</p>
                  <p className="mt-1 flex items-center justify-center gap-1.5 font-mono text-[12.5px] text-gray-700 dark:text-gray-200">
                    {fmt(c.cur, 3)}
                    <ArrowRight size={11} className="text-teal-500" />
                    <b className={c.cur === c.next ? "" : "text-teal-600 dark:text-teal-400"}>
                      {fmt(c.next, 3)}
                    </b>
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-gray-400">− {c.term}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={step}
                className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white"
              >
                한 걸음 업데이트
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 dark:border-gray-700"
              >
                <RotateCcw size={12} />
                연습문제 값으로 되돌리기
              </button>
            </div>

            {rows.length > 0 && (
              <Scroller>
                <table className="mt-3 w-full min-w-[420px] border-collapse text-center font-mono text-[11.5px]">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700">
                      <th className="py-1 font-semibold">t</th>
                      <th className="py-1 font-semibold">w₁</th>
                      <th className="py-1 font-semibold">w₂</th>
                      <th className="py-1 font-semibold">b</th>
                      <th className="py-1 font-semibold">u</th>
                      <th className="py-1 font-semibold">ŷ</th>
                      <th className="py-1 font-semibold">δ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.t} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 text-gray-400">{r.t}</td>
                        <td className="py-1">{fmt(r.w1, 3)}</td>
                        <td className="py-1">{fmt(r.w2, 3)}</td>
                        <td className="py-1">{fmt(r.b, 3)}</td>
                        <td className="py-1">{fmt(r.u, 3)}</td>
                        <td className="py-1">{r.yhat}</td>
                        <td className={`py-1 ${r.delta === 0 ? "text-gray-400" : "text-rose-600"}`}>
                          {r.delta}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-teal-50 dark:bg-teal-950/40">
                      <td className="py-1 text-gray-400">{rows.length}</td>
                      <td className="py-1">{fmt(w1, 3)}</td>
                      <td className="py-1">{fmt(w2, 3)}</td>
                      <td className="py-1">{fmt(b, 3)}</td>
                      <td className="py-1">{fmt(u, 3)}</td>
                      <td className="py-1">{yhat}</td>
                      <td className={`py-1 ${delta === 0 ? "text-gray-400" : "text-rose-600"}`}>{delta}</td>
                    </tr>
                  </tbody>
                </table>
              </Scroller>
            )}

            <ComputedNote>
              슬라이더를 움직였을 때 나오는 값은 이 페이지에서 계산한 것입니다. 처음 상태(한 걸음)의 결과
              w₁ = −0.75, w₂ = 0.19, b = 0.4 는 공식 연습문제 3번의 해설과 같은 값입니다.
            </ComputedNote>

            <Hint>
              학습률 η 를 크게 올려 보면 파라미터가 한 번에 크게 움직입니다. 강의에서는 그래서 η 를 아주
              작은 값으로 두어, 발산하지 않고 조금씩 수렴하도록 만든다고 설명했습니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
