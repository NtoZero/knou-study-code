"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Formula, Hint, Chip, ComputedNote, Scroller, fmt } from "@/components/dlShared/ui";
import { gradJ, M } from "@/components/dl5/optimizers";

/* 벡터 그림에 쓸 한 걸음. 강의록 예시와 같은 목적함수를 쓰되
   그림이 보기 좋도록 이 페이지에서 고른 지점과 이전 속도를 사용한다. */
const W: [number, number] = [-2.0, 1.4];
const VPREV: [number, number] = [0.7, -0.5];
const ETA = 0.12;

function r2(v: number) {
  return Math.round(v * 100) / 100;
}

/** 벡터 다이어그램 — 경사를 어디에서 재는지가 다르다 */
function VectorDiagram({ nesterov }: { nesterov: boolean }) {
  const VIEW_W = 360;
  const VIEW_H = 230;
  // 좌표계: x1 ∈ [−2.4, −0.4], x2 ∈ [−0.2, 1.7]
  const sx = (x: number) => r2(30 + ((x + 2.4) / 2.0) * (VIEW_W - 60));
  const sy = (y: number) => r2(18 + ((1.7 - y) / 1.9) * (VIEW_H - 40));

  const mv: [number, number] = [r2(M * VPREV[0]), r2(M * VPREV[1])];
  const look: [number, number] = [r2(W[0] + mv[0]), r2(W[1] + mv[1])];
  const base = nesterov ? look : W;
  const g = gradJ(base[0], base[1]);
  const step: [number, number] = [r2(-ETA * g[0]), r2(-ETA * g[1])];
  // v(t) = m·v(t−1) − η∇J(·)
  const v: [number, number] = [r2(mv[0] + step[0]), r2(mv[1] + step[1])];
  const next: [number, number] = [r2(W[0] + v[0]), r2(W[1] + v[1])];
  // 경사 화살표는 '경사를 잰 위치'에서 그린다
  const gradFrom = nesterov ? look : W;
  const gradTo: [number, number] = [r2(gradFrom[0] + step[0]), r2(gradFrom[1] + step[1])];

  return (
    <div>
      <Scroller>
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-auto w-full min-w-[320px]"
          role="img"
          aria-label={
            nesterov
              ? "모멘텀만큼 이동한 위치에서 경사를 구해 다음 위치를 정하는 그림"
              : "현재 위치에서 경사를 구해 다음 위치를 정하는 그림"
          }
        >
          <defs>
            <marker id="dl5-ar-blue" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
              <path d="M0,0 L7,3 L0,6 z" fill="#2563eb" />
            </marker>
            <marker id="dl5-ar-green" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
              <path d="M0,0 L7,3 L0,6 z" fill="#0f766e" />
            </marker>
            <marker id="dl5-ar-red" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
              <path d="M0,0 L7,3 L0,6 z" fill="#dc2626" />
            </marker>
            <marker id="dl5-ar-violet" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
              <path d="M0,0 L8,3.5 L0,7 z" fill="#7c3aed" />
            </marker>
          </defs>

          {/* m·v(t−1) */}
          <line
            x1={sx(W[0])}
            y1={sy(W[1])}
            x2={sx(look[0])}
            y2={sy(look[1])}
            stroke="#2563eb"
            strokeWidth="2"
            markerEnd="url(#dl5-ar-blue)"
          />
          <text
            x={r2((sx(W[0]) + sx(look[0])) / 2 - 24)}
            y={r2((sy(W[1]) + sy(look[1])) / 2 - 8)}
            className="fill-blue-600 text-[10px] font-semibold"
          >
            m·v(t−1)
          </text>

          {/* −η∇J(·) */}
          <line
            x1={sx(gradFrom[0])}
            y1={sy(gradFrom[1])}
            x2={sx(gradTo[0])}
            y2={sy(gradTo[1])}
            stroke={nesterov ? "#dc2626" : "#0f766e"}
            strokeWidth="2"
            markerEnd={nesterov ? "url(#dl5-ar-red)" : "url(#dl5-ar-green)"}
          />
          <text
            x={sx(gradFrom[0]) + 6}
            y={sy(gradFrom[1]) - 8}
            className={nesterov ? "fill-red-600 text-[10px] font-semibold" : "fill-teal-700 text-[10px] font-semibold"}
          >
            {nesterov ? "−η∇J(w(t)+m·v(t−1))" : "−η∇J(w(t))"}
          </text>

          {/* 모멘텀일 때는 같은 경사를 m·v(t−1)의 끝에 이어 붙여 w(t+1)에 닿는다 */}
          {!nesterov && (
            <line
              x1={sx(look[0])}
              y1={sy(look[1])}
              x2={sx(next[0])}
              y2={sy(next[1])}
              stroke="#0f766e"
              strokeWidth="2"
              opacity="0.55"
              markerEnd="url(#dl5-ar-green)"
            />
          )}

          {/* 합 v(t) */}
          <line
            x1={sx(W[0])}
            y1={sy(W[1])}
            x2={sx(next[0])}
            y2={sy(next[1])}
            stroke="#7c3aed"
            strokeWidth="2.5"
            strokeDasharray="5 3"
            markerEnd="url(#dl5-ar-violet)"
          />

          {/* 점 */}
          <circle cx={sx(W[0])} cy={sy(W[1])} r="5" fill="#334155" />
          <text x={sx(W[0]) - 4} y={sy(W[1]) + 19} className="fill-slate-600 text-[10.5px] font-bold">
            w(t)
          </text>
          <circle cx={sx(look[0])} cy={sy(look[1])} r="3.5" fill="#2563eb" opacity="0.65" />
          <circle cx={sx(next[0])} cy={sy(next[1])} r="6" fill="#7c3aed" />
          <text x={sx(next[0]) + 9} y={sy(next[1]) + 4} className="fill-violet-700 text-[10.5px] font-bold">
            w(t+1)
          </text>
        </svg>
      </Scroller>
      <div className="mt-2 grid gap-1 text-[11px] text-gray-600 dark:text-gray-300 sm:grid-cols-3">
        <span>
          경사를 잰 위치 ·{" "}
          <b className={nesterov ? "text-red-600 dark:text-red-400" : "text-teal-700 dark:text-teal-300"}>
            ({fmt(gradFrom[0], 2)}, {fmt(gradFrom[1], 2)})
          </b>
        </span>
        <span>
          v(t) · <b className="text-violet-600 dark:text-violet-400">({fmt(v[0], 2)}, {fmt(v[1], 2)})</b>
        </span>
        <span>
          w(t+1) · <b className="text-violet-600 dark:text-violet-400">({fmt(next[0], 2)}, {fmt(next[1], 2)})</b>
        </span>
      </div>
    </div>
  );
}

export default function MomentumNag() {
  const [nesterov, setNesterov] = useState(false);

  return (
    <section id="momentum-nag" className="scroll-mt-32">
      <SectionTitle
        title="모멘텀과 네스테로프 가속 경사(NAG)"
        subtitle="이전 걸음의 변화량을 이어받고, 경사를 재는 위치를 한 발 앞으로 옮긴다"
      />

      <div className="space-y-5">
        <Sourced
          refs={{
            slides: "모멘텀(momentum)",
            lecture: "지역 최소점 탈출에 도움",
          }}
        >
          <Card>
            <CardTitle>모멘텀(momentum)</CardTitle>
            <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
              이전 단계에서의 파라미터 변화량(&lsquo;속도&rsquo;)을 일정 비율만큼 현재 단계의 업데이트에 반영함.
              학습 과정에서 <b>&lsquo;관성&rsquo;처럼 작용함</b>.
            </p>
            <div className="mt-3 space-y-2">
              <Formula>w(t+1) = w(t) + v(t)</Formula>
              <Formula note="m: 모멘텀 계수 · η: 학습률">
                v(t) = m·v(t−1) − Δw(t),&nbsp;&nbsp; Δw(t) = η∇J(w(t))
              </Formula>
            </div>
            <Hint>
              v(t)는 한 단계 동안 움직인 거리이므로 속도로 볼 수 있음. m이 클수록 이전 속도가 오래 남아 같은
              방향으로 계속 밀림.
            </Hint>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11.5px] leading-5 text-gray-100">
{`from tensorflow.keras import optimizers
optimizer = optimizers.SGD(0.1, momentum=0.9)`}
            </pre>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "네스테로프 가속 경사(NAG)",
            lecture: "한 발 앞에서 경사를 잼",
          }}
        >
          <Card>
            <CardTitle>경사를 어디에서 재는가 — 눌러서 비교</CardTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              <Chip active={!nesterov} onClick={() => setNesterov(false)}>
                모멘텀 (nesterov=False)
              </Chip>
              <Chip active={nesterov} onClick={() => setNesterov(true)}>
                NAG (nesterov=True)
              </Chip>
            </div>

            <Formula note="NAG는 w(t)가 아니라 w(t) + m·v(t−1)에서 경사를 구함">
              v(t) = m·v(t−1) − η∇J(w(t) + m·v(t−1)),&nbsp;&nbsp; w(t+1) = w(t) + v(t)
            </Formula>

            <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50/60 p-2 dark:border-gray-800 dark:bg-gray-950/40">
              <VectorDiagram nesterov={nesterov} />
            </div>

            <p className="mt-3 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              {nesterov
                ? "파란 화살표만큼 먼저 가 있다고 보고, 그 끝에서 경사를 잰다. 이미 이동할 방향을 알고 있는 상태에서 경사를 구하므로 더 바람직한 방향으로 다음 위치가 정해진다."
                : "지금 서 있는 자리에서 경사를 재고, 거기에 이전 속도를 더한다. 이미 많이 밀려 가고 있어도 그 사실이 경사 계산에는 반영되지 않는다."}
            </p>

            <ComputedNote>
              그림의 w(t)·v(t−1)·η 값은 벡터가 잘 보이도록 이 페이지에서 고른 예시임. 목적함수와 갱신식은 강의록과
              같음.
            </ComputedNote>

            <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11.5px] leading-5 text-gray-100">
{`from tensorflow.keras import optimizers
optimizer = optimizers.SGD(0.1, momentum=0.9, nesterov=True)`}
            </pre>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
