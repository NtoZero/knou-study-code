"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, ComputedNote, Formula, Hint, Scroller, Slider } from "./ui";
import {
  SIGMOID,
  cloneMlp,
  deltas,
  fmt,
  forward,
  gradients,
  type Mlp,
} from "./mlpCore";

const INITIAL: Mlp = {
  n: 2,
  m: 2,
  M: 2,
  hidden: SIGMOID,
  output: SIGMOID,
  W: [
    [0.1, -0.2],
    [0.5, 0.3],
    [-0.4, 0.8],
  ],
  V: [
    [0.2, -0.1],
    [0.6, -0.5],
    [0.7, 0.4],
  ],
};

const X = [1, 0.5];
const T = [1, 0];

const errorOf = (y: number[]) => 0.5 * ((T[0] - y[0]) ** 2 + (T[1] - y[1]) ** 2);

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap border-b border-gray-200 px-2 py-1 text-left font-semibold text-gray-500 dark:border-gray-700">
      {children}
    </th>
  );
}
function Td({ children, mono = true }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <td
      className={`whitespace-nowrap border-b border-gray-100 px-2 py-1 dark:border-gray-800 ${
        mono ? "font-mono" : ""
      }`}
    >
      {children}
    </td>
  );
}

export default function BackpropStepLab() {
  const [net, setNet] = useState<Mlp>(() => cloneMlp(INITIAL));
  const [eta, setEta] = useState(0.5);
  const [history, setHistory] = useState<number[]>([]);

  const fw = useMemo(() => forward(net, X), [net]);
  const d = useMemo(() => deltas(net, fw, T), [net, fw]);
  const g = useMemo(() => gradients(net, X, fw, d), [net, fw, d]);
  const E = errorOf(fw.y);

  const applyOnce = () => {
    const next = cloneMlp(net);
    for (let i = 0; i < next.W.length; i += 1)
      for (let j = 0; j < next.W[i].length; j += 1) next.W[i][j] -= eta * g.dW[i][j];
    for (let j = 0; j < next.V.length; j += 1)
      for (let k = 0; k < next.V[j].length; k += 1) next.V[j][k] -= eta * g.dV[j][k];
    setHistory((h) => [...h, E]);
    setNet(next);
  };

  const reset = () => {
    setNet(cloneMlp(INITIAL));
    setHistory([]);
  };

  return (
    <section id="backprop-step" className="scroll-mt-32">
      <SectionTitle
        title="오류 역전파 한 걸음 — 숫자로 따라가기"
        subtitle="2–2–2 다층 퍼셉트론에서 전방향 계산과 역방향 계산을 실제 값으로 전부 보여 줍니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "11.3.1 — 오류 역전파 학습 알고리즘 ②-1 ~ ②-5",
            slides: "MLP 학습: 오류역전파 학습 알고리즘",
            lecture: "전방향으로 출력을 계산하고, 그 출력에 대한 오류로 가중치를 고치는 역방향 계산이 한 쌍을 이룬다는 점을 기억하라고 짚음",
          }}
        >
          <Card>
            <div className="mb-3 flex flex-wrap items-end gap-3">
              <div className="min-w-[160px] flex-1">
                <Slider
                  label="학습률 η"
                  value={eta}
                  min={0.05}
                  max={3}
                  step={0.05}
                  onChange={setEta}
                  display={fmt(eta, 2)}
                />
              </div>
              <button
                type="button"
                onClick={applyOnce}
                className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white"
              >
                가중치 수정 (②-5)
              </button>
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-300"
              >
                <RotateCcw size={13} />
                처음으로
              </button>
              <div className="ml-auto rounded-lg bg-gray-50 px-3 py-1.5 font-mono text-[11px] dark:bg-gray-800">
                수정 횟수 {history.length} · E(x, θ) ={" "}
                <span className="font-bold text-sky-600 dark:text-sky-400">{fmt(E, 6)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* 전방향 */}
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="mb-2 text-[12px] font-bold text-sky-700 dark:text-sky-300">
                  ②-1 · ②-2 전방향 계산 — x = [1, 0.5], t = [1, 0]
                </p>
                <Scroller>
                  <table className="w-full min-w-[300px] text-[11px]">
                    <thead>
                      <tr>
                        <Th>은닉 j</Th>
                        <Th>uⱼʰ = Σwᵢⱼxᵢ + w₀ⱼ</Th>
                        <Th>zⱼ = φ(uⱼʰ)</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {[0, 1].map((j) => (
                        <tr key={j}>
                          <Td mono={false}>{j + 1}</Td>
                          <Td>{fmt(fw.uh[j], 5)}</Td>
                          <Td>{fmt(fw.z[j], 5)}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <table className="mt-2 w-full min-w-[300px] text-[11px]">
                    <thead>
                      <tr>
                        <Th>출력 k</Th>
                        <Th>uₖᵒ = Σvⱼₖzⱼ + v₀ₖ</Th>
                        <Th>yₖ = φ(uₖᵒ)</Th>
                        <Th>tₖ − yₖ</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {[0, 1].map((k) => (
                        <tr key={k}>
                          <Td mono={false}>{k + 1}</Td>
                          <Td>{fmt(fw.uo[k], 5)}</Td>
                          <Td>{fmt(fw.y[k], 5)}</Td>
                          <Td>
                            <span className={T[k] - fw.y[k] >= 0 ? "text-sky-600" : "text-rose-600"}>
                              {fmt(T[k] - fw.y[k], 5)}
                            </span>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Scroller>
              </div>

              {/* 역방향 δ */}
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="mb-2 text-[12px] font-bold text-rose-700 dark:text-rose-300">
                  ②-3 출력 노드의 오차 δₖ
                </p>
                <Scroller>
                  <table className="w-full min-w-[320px] text-[11px]">
                    <thead>
                      <tr>
                        <Th>k</Th>
                        <Th>φᵒ′ = (1−yₖ)yₖ</Th>
                        <Th>δₖ = −φᵒ′(tₖ−yₖ)</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {[0, 1].map((k) => (
                        <tr key={k}>
                          <Td mono={false}>{k + 1}</Td>
                          <Td>{fmt((1 - fw.y[k]) * fw.y[k], 5)}</Td>
                          <Td>
                            <span className="font-bold text-rose-600 dark:text-rose-400">
                              {fmt(d.dk[k], 5)}
                            </span>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Scroller>
                <p className="mb-2 mt-3 text-[12px] font-bold text-rose-700 dark:text-rose-300">
                  ②-4 은닉 노드로 역전파된 오차 δⱼ
                </p>
                <Scroller>
                  <table className="w-full min-w-[320px] text-[11px]">
                    <thead>
                      <tr>
                        <Th>j</Th>
                        <Th>δ₁v<sub>j1</sub></Th>
                        <Th>δ₂v<sub>j2</sub></Th>
                        <Th>φʰ′ = (1−zⱼ)zⱼ</Th>
                        <Th>δⱼ</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {[0, 1].map((j) => (
                        <tr key={j}>
                          <Td mono={false}>{j + 1}</Td>
                          <Td>{fmt(d.back[j][0], 5)}</Td>
                          <Td>{fmt(d.back[j][1], 5)}</Td>
                          <Td>{fmt((1 - fw.z[j]) * fw.z[j], 5)}</Td>
                          <Td>
                            <span className="font-bold text-rose-600 dark:text-rose-400">
                              {fmt(d.dj[j], 5)}
                            </span>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Scroller>
              </div>
            </div>

            {/* 수정항 */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="mb-2 text-[12px] font-bold text-gray-700 dark:text-gray-200">
                  Δvⱼₖ = −η δₖ zⱼ (z₀ = 1)
                </p>
                <Scroller>
                  <table className="w-full min-w-[260px] text-[11px]">
                    <thead>
                      <tr>
                        <Th>vⱼₖ</Th>
                        <Th>현재값</Th>
                        <Th>Δvⱼₖ</Th>
                        <Th>수정 후</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {net.V.flatMap((row, j) =>
                        row.map((v, k) => (
                          <tr key={`${j}${k}`}>
                            <Td mono={false}>
                              v<sub>{j}{k + 1}</sub>
                            </Td>
                            <Td>{fmt(v, 4)}</Td>
                            <Td>
                              <span className={-eta * g.dV[j][k] >= 0 ? "text-sky-600" : "text-rose-600"}>
                                {fmt(-eta * g.dV[j][k], 5)}
                              </span>
                            </Td>
                            <Td>{fmt(v - eta * g.dV[j][k], 4)}</Td>
                          </tr>
                        )),
                      )}
                    </tbody>
                  </table>
                </Scroller>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="mb-2 text-[12px] font-bold text-gray-700 dark:text-gray-200">
                  Δwᵢⱼ = −η δⱼ xᵢ (x₀ = 1)
                </p>
                <Scroller>
                  <table className="w-full min-w-[260px] text-[11px]">
                    <thead>
                      <tr>
                        <Th>wᵢⱼ</Th>
                        <Th>현재값</Th>
                        <Th>Δwᵢⱼ</Th>
                        <Th>수정 후</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {net.W.flatMap((row, i) =>
                        row.map((w, j) => (
                          <tr key={`${i}${j}`}>
                            <Td mono={false}>
                              w<sub>{i}{j + 1}</sub>
                            </Td>
                            <Td>{fmt(w, 4)}</Td>
                            <Td>
                              <span className={-eta * g.dW[i][j] >= 0 ? "text-sky-600" : "text-rose-600"}>
                                {fmt(-eta * g.dW[i][j], 5)}
                              </span>
                            </Td>
                            <Td>{fmt(w - eta * g.dW[i][j], 4)}</Td>
                          </tr>
                        )),
                      )}
                    </tbody>
                  </table>
                </Scroller>
              </div>
            </div>

            {history.length > 0 && (
              <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <p className="mb-1.5 text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                  수정할 때마다의 오차 E(x, θ)
                </p>
                <Scroller>
                  <div className="flex min-w-max items-end gap-1">
                    {[...history, E].map((e, i) => (
                      <div key={i} className="flex flex-col items-center gap-0.5">
                        <div
                          className={`w-3 rounded-t ${i === history.length ? "bg-sky-600" : "bg-sky-300"}`}
                          style={{ height: `${Math.max(2, (e / Math.max(...history, E)) * 46)}px` }}
                        />
                        <span className="text-[8px] text-gray-400">{i}</span>
                      </div>
                    ))}
                  </div>
                </Scroller>
                <p className="mt-1.5 font-mono text-[10.5px] text-gray-600 dark:text-gray-300">
                  처음 {fmt(history[0], 6)} → 지금 {fmt(E, 6)}
                </p>
              </div>
            )}

            <ComputedNote>
              초기 가중치와 입력 x = [1, 0.5], 목표 출력 t = [1, 0]은 계산을 따라가기 위해 이 페이지에서 정한
              설명용 값입니다. 교재·강의록에는 이 수치 예가 없습니다. 식은 교재 11.3.1의 수정식을 그대로
              사용했습니다.
            </ComputedNote>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "11.3.1 — 가중치 수정식", slides: "오류역전파 학습" }}>
          <Card>
            <CardTitle>표에서 눈여겨볼 지점</CardTitle>
            <ul className="space-y-1.5 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              <li>
                · δₖ의 부호는 (tₖ − yₖ)의 반대입니다. 목표보다 덜 나온 출력(t₁ − y₁ &gt; 0)은 δ₁ &lt; 0이 되고,
                Δv = −ηδz가 양수가 되어 그 연결을 강화합니다.
              </li>
              <li>
                · 같은 j의 Δwᵢⱼ는 모두 δⱼ에 입력 xᵢ만 곱한 값입니다. 바이어스 자리(x₀ = 1)의 수정항이 δⱼ 그
                자체인 것은 그 때문입니다.
              </li>
              <li>
                · δⱼ는 δ₁v<sub>j1</sub>과 δ₂v<sub>j2</sub>를 더한 뒤 φʰ′를 곱한 값입니다. 두 출력 뉴런에서
                온 오류가 가중치만큼 섞여 들어온다는 뜻입니다.
              </li>
              <li>
                · η를 키우면 한 번의 수정으로 오차가 더 많이 줄어듭니다(η = 0.5면 첫 수정에서 0.1434 →
                0.1293, η = 3이면 0.0727). 다만 여기서는 데이터가 하나뿐이고 출력층이 시그모이드여서 δₖ의
                크기가 제한되므로, η를 끝까지 올려도 오차가 되튀지는 않습니다. η가 커서 생기는 불안정은
                데이터를 번갈아 넣는 아래 <strong>학습 모드</strong> 실험에서 볼 수 있습니다.
              </li>
            </ul>
            <Formula className="mt-3" note="수정은 언제나 기울기의 반대 방향">
              θ<sup>(τ+1)</sup> = θ<sup>(τ)</sup> − η ∂E/∂θ
            </Formula>
            <Hint>
              같은 데이터 하나만 계속 넣고 있으므로 이 실험에서는 그 데이터에 대한 오차만 줄어듭니다. 실제
              학습은 모든 학습 데이터에 대해 이 과정을 돌린 뒤 전체 평균 제곱 오차를 확인합니다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
