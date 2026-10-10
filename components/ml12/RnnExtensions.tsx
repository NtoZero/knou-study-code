"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, Hint, Scroller } from "./ui";

type Mode = "basic" | "stacked" | "bidir";

const N = 6;
const COL = 62;
const LEFT = 40;
const R = 12;
const W = LEFT + COL * (N - 1) + 36;

const SUB = "₁₂₃₄₅₆";

export default function RnnExtensions() {
  const [mode, setMode] = useState<Mode>("bidir");
  const [sel, setSel] = useState(3);

  /** 선택한 시각의 출력 y_t가 실제로 받아들이는 입력의 범위 */
  const contributing =
    mode === "bidir"
      ? Array.from({ length: N }, (_, i) => i)
      : Array.from({ length: sel + 1 }, (_, i) => i);

  const twoLayer = mode !== "basic";
  const yY = 26;
  const hiTop = 70;
  const hiBottom = twoLayer ? 118 : 70;
  const xY = 170;
  const height = 196;

  return (
    <section id="rnn-extensions" className="scroll-mt-32">
      <SectionTitle
        title="RNN 구조의 확장"
        subtitle="층을 쌓거나, 뒤에서 앞으로도 한 번 더 읽습니다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            textbook: "12.4.1 — 다층 RNN 구조, 양방향 RNN(그림 12-24)",
            slides: "RNN 구조의 확장 — 다층 RNN · 양방향 RNN",
          }}
        >
          <Card>
            <CardTitle>어느 입력까지 y_t에 반영되는가</CardTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              <Chip active={mode === "basic"} onClick={() => setMode("basic")}>
                기본 RNN
              </Chip>
              <Chip active={mode === "stacked"} onClick={() => setMode("stacked")}>
                다층 RNN
              </Chip>
              <Chip active={mode === "bidir"} onClick={() => setMode("bidir")}>
                양방향 RNN
              </Chip>
            </div>

            <Scroller>
              <svg viewBox={`0 0 ${W} ${height}`} className="h-auto w-full" style={{ minWidth: 420 }}>
                {Array.from({ length: N }, (_, i) => {
                  const x = LEFT + i * COL;
                  const on = contributing.includes(i);
                  const isSel = i === sel;
                  return (
                    <g key={i} onClick={() => setSel(i)} style={{ cursor: "pointer" }}>
                      {/* 아래 은닉층 — 전방향 */}
                      {i < N - 1 && (
                        <line
                          x1={x + R}
                          y1={hiBottom}
                          x2={x + COL - R}
                          y2={hiBottom}
                          stroke={on ? "#111827" : "#d1d5db"}
                          strokeWidth={1.8}
                          markerEnd={on ? "url(#ext-dark)" : "url(#ext-light)"}
                        />
                      )}
                      {/* 위 은닉층 */}
                      {twoLayer &&
                        (mode === "stacked" ? (
                          i < N - 1 && (
                            <line
                              x1={x + R}
                              y1={hiTop}
                              x2={x + COL - R}
                              y2={hiTop}
                              stroke={on ? "#111827" : "#d1d5db"}
                              strokeWidth={1.8}
                              markerEnd={on ? "url(#ext-dark)" : "url(#ext-light)"}
                            />
                          )
                        ) : (
                          i > 0 && (
                            <line
                              x1={x - R}
                              y1={hiTop}
                              x2={x - COL + R}
                              y2={hiTop}
                              stroke="#ef4444"
                              strokeWidth={1.8}
                              markerEnd="url(#ext-red)"
                            />
                          )
                        ))}

                      {/* 입력 → 은닉 */}
                      <line
                        x1={x}
                        y1={xY - R}
                        x2={x}
                        y2={hiBottom + R}
                        stroke={on ? "#6b7280" : "#e5e7eb"}
                        strokeWidth={1.4}
                      />
                      {twoLayer && (
                        <line
                          x1={x}
                          y1={mode === "stacked" ? hiBottom - R : xY - R}
                          x2={x}
                          y2={hiTop + R}
                          stroke={mode === "bidir" ? "#f97316" : on ? "#6b7280" : "#e5e7eb"}
                          strokeWidth={1.4}
                        />
                      )}
                      {/* 은닉 → 출력 */}
                      <line
                        x1={x}
                        y1={hiTop - R}
                        x2={x}
                        y2={yY + R}
                        stroke={isSel ? "#ef4444" : "#d1d5db"}
                        strokeWidth={isSel ? 2.2 : 1.2}
                      />
                      {mode === "bidir" && (
                        <path
                          d={`M ${x} ${hiBottom - R} Q ${x + 16} ${(hiBottom + yY) / 2} ${x} ${yY + R}`}
                          fill="none"
                          stroke={isSel ? "#ef4444" : "#d1d5db"}
                          strokeWidth={isSel ? 2.2 : 1.2}
                        />
                      )}

                      <circle
                        cx={x}
                        cy={xY}
                        r={R}
                        fill={on ? "#bbf7d0" : "#f3f4f6"}
                        stroke={on ? "#16a34a" : "#d1d5db"}
                        strokeWidth={1.5}
                      />
                      <text x={x} y={xY + 4} textAnchor="middle" className="fill-gray-700 text-[9px] font-bold">
                        x{SUB[i]}
                      </text>
                      <circle cx={x} cy={hiBottom} r={R} fill="#dbeafe" stroke="#2563eb" strokeWidth={1.4} />
                      {twoLayer && (
                        <circle
                          cx={x}
                          cy={hiTop}
                          r={R}
                          fill={mode === "bidir" ? "#ffedd5" : "#bfdbfe"}
                          stroke={mode === "bidir" ? "#f97316" : "#2563eb"}
                          strokeWidth={1.4}
                        />
                      )}
                      <circle
                        cx={x}
                        cy={yY}
                        r={R}
                        fill={isSel ? "#fde047" : "#fef9c3"}
                        stroke={isSel ? "#ef4444" : "#ca8a04"}
                        strokeWidth={isSel ? 2 : 1.4}
                      />
                      <text x={x} y={yY + 4} textAnchor="middle" className="fill-gray-700 text-[9px] font-bold">
                        y{SUB[i]}
                      </text>
                    </g>
                  );
                })}
                <defs>
                  <marker id="ext-dark" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                    <path d="M0,0 L6,3 L0,6 z" fill="#111827" />
                  </marker>
                  <marker id="ext-light" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                    <path d="M0,0 L6,3 L0,6 z" fill="#d1d5db" />
                  </marker>
                  <marker id="ext-red" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                    <path d="M0,0 L6,3 L0,6 z" fill="#ef4444" />
                  </marker>
                </defs>
              </svg>
            </Scroller>

            <p className="mt-2 text-[12px] text-gray-500">
              출력 동그라미를 눌러 시각을 바꿔 보세요. 지금 고른 것은 <strong>y{SUB[sel]}</strong>
              입니다.
            </p>

            <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
              <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                {mode === "bidir" ? (
                  <>
                    y{SUB[sel]}에 반영되는 입력:{" "}
                    <strong className="text-red-500">x₁부터 x₆까지 전부 ({N}개)</strong> — 전방향
                    은닉층이 x₁~x{SUB[sel]}를, 역방향 은닉층이 x{SUB[sel]}~x₆를 전달합니다.
                  </>
                ) : (
                  <>
                    y{SUB[sel]}에 반영되는 입력:{" "}
                    <strong className="text-red-500">
                      x₁부터 x{SUB[sel]}까지 ({sel + 1}개)
                    </strong>{" "}
                    — 뒤쪽 입력 {N - sel - 1}개는 아직 들어오지 않았으므로 쓸 수 없습니다.
                  </>
                )}
              </p>
            </div>
          </Card>
        </Sourced>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Sourced
            refs={{
              textbook: "12.4.1 — 다층 RNN",
              slides: "RNN 구조의 확장 — 다층 RNN",
            }}
            className="h-full"
          >
            <Card className="h-full">
              <CardTitle>다층 RNN</CardTitle>
              <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                입·출력 관계에 따른 구조에서 <strong>RNN 셀이 여러 층으로 구성되도록 확장</strong>한
                구조입니다. 아래 은닉층의 출력이 위 은닉층의 입력이 되며, 두 층은 계층 구조를
                이룹니다.
              </p>
            </Card>
          </Sourced>

          <Sourced
            refs={{
              textbook: "12.4.1 — 양방향 RNN(그림 12-24)",
              slides: "RNN 구조의 확장 — 양방향 bidirectional RNN",
            }}
            className="h-full"
          >
            <Card className="h-full">
              <CardTitle>양방향 RNN</CardTitle>
              <p className="text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                <strong>2개의 은닉층</strong>으로 구성되어 하나는 입력을 전방향으로 처리하고 다른
                하나는 역방향으로 처리합니다. 시간 t의 입력 x_t는 두 은닉층으로 동시에 주어져서
                처리되어 결과가 출력층으로 제공됩니다.
              </p>
              <div className="mt-2">
                <Hint>
                  2개의 은닉층이 사용되지만 전방향으로 처리하는 은닉층과 역방향으로 처리하는
                  은닉층은 <strong>계층 구조를 이루지 않으며 아무런 연결 관계도 존재하지
                  않습니다</strong>. 다층 RNN과 갈리는 지점입니다. 해당 입력의 앞쪽에 있는 정보와
                  뒤쪽에 있는 정보를 모두 활용할 목적을 가지며, 문장의 앞뒤 문맥이 모두 중요한
                  기계번역에서 많이 활용됩니다.
                </Hint>
              </div>
            </Card>
          </Sourced>
        </div>
      </div>
    </section>
  );
}
