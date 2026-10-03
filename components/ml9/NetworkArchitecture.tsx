"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";

type Flow = "feedforward" | "recurrent";

const W = 380;
const H = 250;

export default function NetworkArchitecture() {
  const [hiddenCount, setHiddenCount] = useState(1);
  const [hiddenSize, setHiddenSize] = useState(4);
  const [inputSize, setInputSize] = useState(3);
  const [outputSize, setOutputSize] = useState(2);
  const [flow, setFlow] = useState<Flow>("feedforward");

  /** 층별 뉴런 수 — 입력층, 은닉층 × hiddenCount, 출력층 */
  const layers = useMemo(
    () => [inputSize, ...Array.from({ length: hiddenCount }, () => hiddenSize), outputSize],
    [inputSize, hiddenCount, hiddenSize, outputSize],
  );

  /** 완전연결이므로 이웃한 두 층의 뉴런 수를 곱해 더한 것이 연결(가중치)의 수 */
  const connections = useMemo(
    () => layers.slice(0, -1).reduce((acc, n, i) => acc + n * layers[i + 1], 0),
    [layers],
  );
  /** 바이어스는 입력층을 뺀 모든 뉴런에 하나씩 */
  const biases = useMemo(() => layers.slice(1).reduce((a, b) => a + b, 0), [layers]);

  const kind =
    hiddenCount === 0 ? "단층 신경망" : hiddenCount === 1 ? "다층 신경망" : "다층(심층) 신경망";

  const positions = useMemo(() => {
    const gapX = layers.length > 1 ? (W - 80) / (layers.length - 1) : 0;
    const centerY = 120;
    return layers.map((n, li) => {
      const gapY = n > 1 ? Math.min(30, 150 / (n - 1)) : 0;
      return Array.from({ length: n }, (_, i) => ({
        x: 40 + li * gapX,
        y: centerY + (i - (n - 1) / 2) * gapY,
      }));
    });
  }, [layers]);

  const layerName = (li: number) =>
    li === 0 ? "입력층" : li === layers.length - 1 ? "출력층" : `은닉층${hiddenCount > 1 ? ` ${li}` : ""}`;

  return (
    <section id="architecture" className="scroll-mt-32">
      <SectionTitle
        title="11.1.3 ② 연결 구조 — 다층 전방향 신경망"
        subtitle="층 수와 뉴런 수를 바꾸면 완전연결의 가중치 개수가 실제로 어떻게 늘어나는지 세어 봄"
      />

      <Sourced
        refs={{
          textbook: "11.1.3 신경망의 구성 요소 (그림 11-4)",
          slides: "신경망의 구성 요소 ② 연결 구조",
          lecture: "같은 층 안에는 연결이 없고 이웃한 두 층의 모든 노드가 빠짐없이 이어진 구조를 완전연결(fully connected, dense)이라 부른다고 용어를 짚어 줌",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">층상 구조로 연결된 신경망</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            뉴런들이 층별로 그룹을 이룸. <strong>같은 층 안에서는 뉴런 간의 연결이 존재하지 않고</strong>,
            이웃한 두 층 사이에서는 모든 뉴런이 연결을 가짐. 가장 아래에 있는 첫 번째 층이 외부로부터
            입력을 받아들이는 <strong>입력층(input layer)</strong>, 마지막 층이 외부로 출력을 내는{" "}
            <strong>출력층(output layer)</strong>, 가운데에 있는 층은 외부와는 정보를 교환하지 않으며 다른
            신경세포들과만 입출력을 주고받는 <strong>은닉층(hidden layer)</strong>.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
            <div className="overflow-x-auto">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[340px] rounded-lg border border-gray-100 dark:border-gray-800">
                <rect x={0} y={0} width={W} height={H} fill="#ffffff" />

                {/* 층 사이 완전연결 */}
                {positions.slice(0, -1).map((layer, li) =>
                  layer.map((a, ai) =>
                    positions[li + 1].map((b, bi) => (
                      <line
                        key={`${li}-${ai}-${bi}`}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke="#d8b4fe"
                        strokeWidth={0.7}
                      />
                    )),
                  ),
                )}

                {/* 회귀 연결 — 출력층에서 입력층으로 되돌아감 */}
                {flow === "recurrent" && (
                  <g>
                    <path
                      d={`M${positions[positions.length - 1][0].x + 12},${positions[positions.length - 1][0].y} C${W - 6},${20} ${30},${18} ${positions[0][0].x},${positions[0][0].y - 12}`}
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth={1.8}
                      strokeDasharray="4 3"
                    />
                    <text x={W / 2} y={16} fontSize="9" textAnchor="middle" fill="#dc2626">
                      출력층의 신호를 다시 입력층으로 되돌림
                    </text>
                  </g>
                )}

                {/* 뉴런 */}
                {positions.map((layer, li) =>
                  layer.map((p, i) => (
                    <circle
                      key={`${li}-${i}`}
                      cx={p.x}
                      cy={p.y}
                      r={8}
                      fill={li === 0 ? "#dbeafe" : li === layers.length - 1 ? "#fed7aa" : "#fae8ff"}
                      stroke={li === 0 ? "#2563eb" : li === layers.length - 1 ? "#ea580c" : "#a21caf"}
                      strokeWidth={1.4}
                    />
                  )),
                )}

                {/* 층 이름 */}
                {positions.map((layer, li) => (
                  <text key={li} x={layer[0].x} y={H - 14} fontSize="9" textAnchor="middle" fill="#64748b">
                    {layerName(li)}
                  </text>
                ))}
                {positions.map((layer, li) => (
                  <text key={`n${li}`} x={layer[0].x} y={H - 3} fontSize="8" textAnchor="middle" fill="#94a3b8">
                    {layers[li]}개
                  </text>
                ))}

                {/* 정보 흐름 화살표 */}
                <path
                  d={`M44,${H - 32} L${W - 44},${H - 32}`}
                  stroke="#16a34a"
                  strokeWidth={1.2}
                />
                <path
                  d={`M${W - 50},${H - 36} L${W - 44},${H - 32} L${W - 50},${H - 28}`}
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth={1.2}
                />
                <text x={W / 2} y={H - 36} fontSize="8" textAnchor="middle" fill="#16a34a">
                  정보의 흐름 (전방향)
                </text>
              </svg>
            </div>

            <div>
              <div className="space-y-2">
                {[
                  { label: "입력층 뉴런 n", v: inputSize, set: setInputSize, min: 2, max: 6 },
                  { label: "은닉층 수", v: hiddenCount, set: setHiddenCount, min: 0, max: 4 },
                  { label: "은닉층 뉴런 m", v: hiddenSize, set: setHiddenSize, min: 1, max: 6 },
                  { label: "출력층 뉴런 M", v: outputSize, set: setOutputSize, min: 1, max: 4 },
                ].map((c) => (
                  <label key={c.label} className="flex items-center gap-3 text-xs">
                    <span className="w-24 shrink-0 font-semibold">{c.label}</span>
                    <input
                      type="range"
                      min={c.min}
                      max={c.max}
                      step={1}
                      value={c.v}
                      onChange={(e) => c.set(Number(e.target.value))}
                      disabled={c.label === "은닉층 뉴런 m" && hiddenCount === 0}
                      className="min-w-0 flex-1 accent-fuchsia-600 disabled:opacity-40"
                    />
                    <span className="w-6 shrink-0 text-right font-mono">{c.v}</span>
                  </label>
                ))}
              </div>

              <div className="mt-3 flex gap-1.5">
                {(
                  [
                    ["feedforward", "전방향 신경망"],
                    ["recurrent", "회귀 신경망 (RNN)"],
                  ] as [Flow, string][]
                ).map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setFlow(k)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      flow === k
                        ? "border-fuchsia-500 bg-fuchsia-500 text-white"
                        : "border-gray-200 bg-white text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-900"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-fuchsia-50 p-2.5 dark:bg-fuchsia-950/40">
                  <p className="text-[11px] text-gray-500">연결(가중치) 수</p>
                  <p className="font-mono text-lg font-bold text-fuchsia-700 dark:text-fuchsia-300">
                    {connections}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800/60">
                  <p className="text-[11px] text-gray-500">바이어스 수</p>
                  <p className="font-mono text-lg font-bold">{biases}</p>
                </div>
              </div>
              <div className="mt-2 overflow-x-auto rounded-lg bg-gray-50 p-3 font-mono text-[11px] leading-6 dark:bg-gray-800/60">
                <p className="min-w-[260px]">
                  {layers.slice(0, -1).map((n, i) => `${n}×${layers[i + 1]}`).join(" + ")} ={" "}
                  {connections}
                </p>
                <p className="min-w-[260px] text-gray-500">
                  학습해야 할 파라미터 = {connections} + {biases} = {connections + biases}개
                </p>
              </div>
              <p className="mt-2 rounded-lg bg-slate-100 p-2.5 text-xs leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                지금 구조는 <strong>{kind}</strong>
                {hiddenCount === 0
                  ? " — 입력층과 출력층으로만 구성됨."
                  : hiddenCount === 1
                    ? " — 입력층과 출력층 사이에 은닉층이 1개."
                    : " — 다수의 은닉층을 갖는 구조. 딥러닝의 대상이 되는 심층 신경망이 이 형태."}
              </p>
            </div>
          </div>
        </div>
      </Sourced>

      {/* ── 구분 기준 두 가지 ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Sourced
          refs={{
            textbook: "11.1.3 신경망의 구성 요소 (그림 11-5)",
            slides: "신경망의 구성 요소 ② 연결 구조 — 층수의 변화",
          }}
        >
          <div className="h-full rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-bold">은닉층의 존재 여부로 가름</p>
            <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              <li>
                <strong>단층 신경망</strong> (single-layer network) — 입력층과 출력층으로만 구성된 신경망.
              </li>
              <li>
                <strong>다층 신경망</strong> (multi-layer network) — 입력층과 출력층 사이에 1개 이상의
                은닉층을 가지는 구조의 신경망.
              </li>
              <li>
                <strong>심층 신경망</strong> — 다수의 은닉층을 갖는 신경망 모델. 딥러닝의 대상.
              </li>
            </ul>
          </div>
        </Sourced>
        <Sourced
          refs={{
            textbook: "11.1.3 신경망의 구성 요소 (그림 11-6)",
            slides: "신경망의 구성 요소 ② 연결 구조 — 정보 흐름의 방향",
          }}
        >
          <div className="h-full rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm font-bold">정보 흐름의 방향으로 가름</p>
            <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              <li>
                <strong>전방향 신경망</strong> (feed-forward) — 입력층에서 출력층으로 한 방향으로만 흐름.
                은닉층은 계산된 출력값을 입력층으로 되돌리지 않고 다음 층의 입력으로만 제공함. 다층
                전방향 신경망이 가장 널리 사용되는 구조.
              </li>
              <li>
                <strong>회귀 신경망</strong> (Recurrent Neural Network: RNN) — 출력층의 신호를 다시
                입력층으로 되돌리는 신경망. 그 밖에 같은 층 내에서 상호 연결을 허용하는 신경망, 층상
                구조를 이루지 않고 모든 뉴런이 서로서로 연결된 구조를 가지는 신경망도 있음.
              </li>
            </ul>
          </div>
        </Sourced>
      </div>

      <Sourced
        refs={{ slides: "신경망의 구성 요소 ② 연결 구조 — Fully connected network" }}
        className="mt-3"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm font-bold">완전연결 (fully connected network, dense network)</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
            다층 전방향 신경망은 기본적으로 층과 층 사이의 모든 노드가 빠짐없이 이어진 완전연결 구조.
            “전방향”은 정보가 한 방향으로 흐른다는 뜻일 뿐 완전연결과 같은 말이 아니며, 둘은 서로 다른
            기준이라는 점에 주의.
          </p>
        </div>
      </Sourced>
    </section>
  );
}
