"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, Slider, ComputedNote, Scroller, Tag, fmt } from "@/components/dlShared/ui";
import {
  CONTOUR_LEVELS,
  OPTIMIZERS,
  START,
  contour,
  trajectory,
  type OptKind,
} from "@/components/dl5/optimizers";

const STEPS = 100;
const VIEW_W = 400;
const VIEW_H = 360;
const PAD = 30;
const RANGE = 5.8;

function r2(v: number) {
  return Math.round(v * 100) / 100;
}
const sx = (x: number) => r2(PAD + ((x + RANGE) / (2 * RANGE)) * (VIEW_W - 2 * PAD));
const sy = (y: number) => r2(PAD + ((RANGE - y) / (2 * RANGE)) * (VIEW_H - 2 * PAD));

/** 강의록이 적어 둔 100회 반복 후의 결과 */
const SLIDE_RESULTS: { label: string; eta: string; value: string }[] = [
  { label: "momentum = 0", eta: "η = 0.01", value: "x = [−0.663  −0.107]" },
  { label: "momentum = 0.9", eta: "η = 0.01", value: "x = [−0.020  −0.0230]" },
  { label: "momentum = 0.9, nesterov = True", eta: "η = 0.01", value: "x = [−0.00850  −0.00174]" },
];

export default function OptimizerPaths() {
  const [active, setActive] = useState<Set<OptKind>>(new Set<OptKind>(["gd", "momentum", "nag"]));
  const [eta, setEta] = useState(0.01);
  const [step, setStep] = useState(100);

  const paths = useMemo(() => {
    const map = {} as Record<OptKind, ReturnType<typeof trajectory>>;
    for (const o of OPTIMIZERS) map[o.key] = trajectory(o.key, eta, STEPS);
    return map;
  }, [eta]);

  const toggle = (k: OptKind) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const contours = useMemo(() => CONTOUR_LEVELS.map((lv) => ({ lv, pts: contour(lv) })), []);

  return (
    <section id="optimizer-paths" className="scroll-mt-32">
      <SectionTitle
        title="같은 오차 지형에서 경로 겹쳐 보기"
        subtitle="강의록의 목적함수 J(x) = x₁² + 2x₂² − x₁x₂, x(0) = [−5 4]ᵀ를 그대로 사용"
      />

      <Sourced
        refs={{
          slides: "최적화기 예시 — 100회",
          lecture: "오버슛과 지역 최소점 탈출",
        }}
      >
        <Card>
          <CardTitle>비교할 최적화기를 고르고, 걸음을 밀어 보기</CardTitle>

          <div className="mb-3 flex flex-wrap gap-1.5">
            {OPTIMIZERS.map((o) => {
              const on = active.has(o.key);
              return (
                <button
                  key={o.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(o.key)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-semibold transition-colors ${
                    on
                      ? "border-transparent text-white"
                      : "border-gray-200 bg-white text-gray-400 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500"
                  }`}
                  style={on ? { backgroundColor: o.color } : undefined}
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: on ? "rgba(255,255,255,0.85)" : o.color }}
                  />
                  {o.label}
                </button>
              );
            })}
          </div>

          <div className="mb-3 grid gap-3 sm:grid-cols-2">
            <Slider
              label={<span>걸음 t</span>}
              value={step}
              min={1}
              max={STEPS}
              step={1}
              onChange={setStep}
              display={`${step} / ${STEPS}`}
            />
            <div>
              <Slider
                label={<span>학습률 η</span>}
                value={eta}
                min={0.005}
                max={0.2}
                step={0.005}
                onChange={setEta}
                display={fmt(eta, 3)}
              />
              <div className="mt-1 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setEta(0.01)}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-[10.5px] font-semibold text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                >
                  0.01 — 강의록 모멘텀·NAG 설정
                </button>
                <button
                  type="button"
                  onClick={() => setEta(0.1)}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-[10.5px] font-semibold text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                >
                  0.1 — 강의록 AdaGrad·RMSProp 설정
                </button>
              </div>
            </div>
          </div>

          <Scroller>
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="h-auto w-full min-w-[320px]"
              role="img"
              aria-label="등고선 위에 그린 최적화기별 파라미터 이동 경로"
            >
              <rect
                x={PAD}
                y={PAD}
                width={VIEW_W - 2 * PAD}
                height={VIEW_H - 2 * PAD}
                className="fill-white dark:fill-gray-950"
                stroke="#cbd5e1"
                strokeWidth="1"
              />
              {/* 축 */}
              <line x1={sx(0)} y1={PAD} x2={sx(0)} y2={VIEW_H - PAD} stroke="#e2e8f0" strokeWidth="1" />
              <line x1={PAD} y1={sy(0)} x2={VIEW_W - PAD} y2={sy(0)} stroke="#e2e8f0" strokeWidth="1" />
              <text x={VIEW_W - PAD - 14} y={sy(0) - 5} className="fill-gray-400 text-[9px]">
                x₁
              </text>
              <text x={sx(0) + 5} y={PAD + 11} className="fill-gray-400 text-[9px]">
                x₂
              </text>

              {/* 등고선 */}
              {contours.map(({ lv, pts }) => (
                <polygon
                  key={lv}
                  points={pts.map((p) => `${sx(p.x1)},${sy(p.x2)}`).join(" ")}
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="0.9"
                  opacity="0.55"
                />
              ))}

              {/* 경로 */}
              {OPTIMIZERS.filter((o) => active.has(o.key)).map((o) => {
                const pts = paths[o.key].slice(0, step + 1);
                return (
                  <polyline
                    key={o.key}
                    points={pts.map((p) => `${sx(p.x1)},${sy(p.x2)}`).join(" ")}
                    fill="none"
                    stroke={o.color}
                    strokeWidth="2"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />
                );
              })}
              {OPTIMIZERS.filter((o) => active.has(o.key)).map((o) => {
                const p = paths[o.key][step];
                return <circle key={o.key} cx={sx(p.x1)} cy={sy(p.x2)} r="4.5" fill={o.color} />;
              })}

              {/* 시작점과 최적점 */}
              <circle cx={sx(START[0])} cy={sy(START[1])} r="5" fill="#1d4ed8" />
              <text x={sx(START[0]) + 8} y={sy(START[1]) + 4} className="fill-blue-700 text-[9.5px] font-bold">
                x(0)
              </text>
              <circle cx={sx(0)} cy={sy(0)} r="5" fill="#dc2626" />
              <text x={sx(0) + 8} y={sy(0) + 14} className="fill-red-600 text-[9.5px] font-bold">
                최적점
              </text>
            </svg>
          </Scroller>

          <Scroller>
            <table className="mt-3 w-full min-w-[420px] border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                  <th className="py-1.5 pr-2 font-semibold">최적화기</th>
                  <th className="py-1.5 pr-2 font-semibold">t = {step}에서의 x</th>
                  <th className="py-1.5 font-semibold">성격</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-200">
                {OPTIMIZERS.filter((o) => active.has(o.key)).map((o) => {
                  const p = paths[o.key][step];
                  return (
                    <tr key={o.key} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 pr-2">
                        <span className="inline-flex items-center gap-1.5 font-semibold">
                          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: o.color }} />
                          {o.label}
                        </span>
                      </td>
                      <td className="py-2 pr-2 font-mono">
                        [{fmt(p.x1, 4)} {fmt(p.x2, 4)}]
                      </td>
                      <td className="py-2 text-gray-500 dark:text-gray-400">{o.gist}</td>
                    </tr>
                  );
                })}
                {active.size === 0 && (
                  <tr>
                    <td colSpan={3} className="py-3 text-center text-gray-400">
                      위에서 최적화기를 하나 이상 고르세요.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Scroller>

          <Hint>
            η = 0.01에서 기본 경사 하강법은 평탄한 쪽으로 천천히 기어가고, 모멘텀은 빠르게 내려가되 최적점을 지나쳐
            도는 오버슛이 보인다. NAG는 그 도는 양이 줄어든다. η = 0.1로 올리면 AdaGrad는 누적값이 커져 중간에서
            멈춰 서고, RMSProp은 목표 방향으로 계속 내려간다.
          </Hint>

          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
            <p className="mb-2 text-[11.5px] font-bold text-emerald-900 dark:text-emerald-200">
              강의록이 적어 둔 100회 반복 후의 결과
            </p>
            <ul className="space-y-1 text-[12px] text-emerald-900/90 dark:text-emerald-100/90">
              {SLIDE_RESULTS.map((r) => (
                <li key={r.label} className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <Tag>{r.eta}</Tag>
                  <span className="font-semibold">{r.label}</span>
                  <span className="font-mono">{r.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <ComputedNote>
            위 그림의 좌표는 강의록의 식과 설정으로 이 페이지가 브라우저에서 다시 계산한 값임. 경로의 모양(수렴
            속도·오버슛)은 강의록 그림과 같지만, 강의록이 적어 둔 끝자리 수치와는 조금 다름 — 강의록 값은 텐서플로로
            돌린 결과이고 이 페이지 값은 같은 식을 직접 반복한 결과임. 시험에서 외울 수치는 위 초록 상자의 강의록
            값임.
          </ComputedNote>
        </Card>
      </Sourced>
    </section>
  );
}
