"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

// 곡선 정의 — x: 입력 패킷 개수(0~100), y: 전송된 패킷 수
// 이상: 선형 y=x, 포화 100
// 혼잡제어: y=x 이후 80에서 포화
// A (버퍼 충분): P_A=70 정점, 그 후 완만히 감소 → G=95
// B (버퍼 부족): P_B=35 정점, 그 후 급격히 감소 → G=70

const P_A = 70;
const P_B = 35;
const G_A = 95;
const G_B = 70;
const WIDTH = 520;
const HEIGHT = 260;
const PAD = 40;

function ideal(x: number) {
  return Math.min(x, 100);
}
function withControl(x: number) {
  if (x <= 60) return x;
  return 60 + (80 - 60) * (1 - Math.exp(-(x - 60) / 20));
}
function curveA(x: number) {
  if (x <= P_A) return x * 0.95;
  if (x >= G_A) return 0;
  // 정점 이후 감소
  const t = (x - P_A) / (G_A - P_A);
  return P_A * 0.95 * (1 - t * t);
}
function curveB(x: number) {
  if (x <= P_B) return x * 0.9;
  if (x >= G_B) return 0;
  const t = (x - P_B) / (G_B - P_B);
  return P_B * 0.9 * (1 - t * 1.1);
}

function toPath(fn: (x: number) => number) {
  const pts: string[] = [];
  for (let x = 0; x <= 100; x += 2) {
    const px = PAD + (x / 100) * (WIDTH - 2 * PAD);
    const py = HEIGHT - PAD - (Math.max(0, fn(x)) / 100) * (HEIGHT - 2 * PAD);
    pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  return "M" + pts.join(" L");
}

const stages = [
  { key: "buffer", label: "버퍼 혼잡", desc: "여러 버퍼들의 오버플로우(overflow)", threshold: 25 },
  { key: "node", label: "노드 혼잡", desc: "한 노드 전체의 혼잡", threshold: 45 },
  { key: "local", label: "국부 혼잡", desc: "특정 노드들 영역의 혼잡", threshold: 65 },
  { key: "global", label: "전체 혼잡", desc: "전체 부네트워크로 확산", threshold: 85 },
];

export default function CongestionCurve() {
  const [load, setLoad] = useState(50);

  const pIdeal = useMemo(() => toPath(ideal), []);
  const pCtrl = useMemo(() => toPath(withControl), []);
  const pA = useMemo(() => toPath(curveA), []);
  const pB = useMemo(() => toPath(curveB), []);

  const xPos = PAD + (load / 100) * (WIDTH - 2 * PAD);

  const currentStage =
    [...stages].reverse().find((s) => load >= s.threshold) ?? null;

  return (
    <section>
      <SectionTitle
        title="혼잡 전송 곡선"
        subtitle="입력 패킷 수를 조절하며 과부하점 P_A, P_B 및 혼잡점 G의 거동을 관찰하세요"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full text-xs"
            style={{ minWidth: 480 }}
          >
            {/* 축 */}
            <line
              x1={PAD}
              y1={HEIGHT - PAD}
              x2={WIDTH - PAD / 2}
              y2={HEIGHT - PAD}
              stroke="currentColor"
              className="text-gray-400"
            />
            <line
              x1={PAD}
              y1={PAD / 2}
              x2={PAD}
              y2={HEIGHT - PAD}
              stroke="currentColor"
              className="text-gray-400"
            />
            {/* 축 레이블 */}
            <text
              x={WIDTH - PAD / 2}
              y={HEIGHT - PAD + 16}
              textAnchor="end"
              className="fill-gray-500"
            >
              부네트워크 입력 패킷 수 →
            </text>
            <text
              x={PAD - 6}
              y={PAD / 2 + 4}
              textAnchor="end"
              className="fill-gray-500"
            >
              전송 패킷 수
            </text>

            {/* 이상적 곡선 (점선) */}
            <path
              d={pIdeal}
              fill="none"
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <text
              x={WIDTH - PAD - 4}
              y={PAD + 14}
              textAnchor="end"
              className="fill-gray-500"
            >
              이상적
            </text>

            {/* 혼잡제어 있음 */}
            <path
              d={pCtrl}
              fill="none"
              stroke="#10b981"
              strokeWidth={2}
            />
            <text
              x={WIDTH - PAD - 4}
              y={PAD + 34}
              textAnchor="end"
              className="fill-emerald-600"
            >
              혼잡제어 있음
            </text>

            {/* A: 버퍼 충분 */}
            <path
              d={pA}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth={2}
            />
            <text
              x={WIDTH - PAD - 4}
              y={PAD + 54}
              textAnchor="end"
              className="fill-sky-600"
            >
              A (버퍼 충분)
            </text>

            {/* B: 버퍼 부족 */}
            <path
              d={pB}
              fill="none"
              stroke="#ef4444"
              strokeWidth={2}
            />
            <text
              x={WIDTH - PAD - 4}
              y={PAD + 74}
              textAnchor="end"
              className="fill-red-600"
            >
              B (버퍼 부족)
            </text>

            {/* 과부하점 표시 */}
            {[
              { x: P_A, label: "P_A", color: "#0ea5e9", y: curveA(P_A) },
              { x: P_B, label: "P_B", color: "#ef4444", y: curveB(P_B) },
            ].map((m) => {
              const px = PAD + (m.x / 100) * (WIDTH - 2 * PAD);
              const py = HEIGHT - PAD - (m.y / 100) * (HEIGHT - 2 * PAD);
              return (
                <g key={m.label}>
                  <circle cx={px} cy={py} r={4} fill={m.color} />
                  <text
                    x={px}
                    y={py - 8}
                    textAnchor="middle"
                    className="font-bold"
                    fill={m.color}
                  >
                    {m.label}
                  </text>
                </g>
              );
            })}

            {/* 혼잡점 G */}
            {[
              { x: G_A, color: "#0ea5e9" },
              { x: G_B, color: "#ef4444" },
            ].map((g, i) => {
              const px = PAD + (g.x / 100) * (WIDTH - 2 * PAD);
              const py = HEIGHT - PAD;
              return (
                <g key={i}>
                  <circle cx={px} cy={py} r={4} fill={g.color} />
                  <text
                    x={px}
                    y={py + 14}
                    textAnchor="middle"
                    className="font-bold"
                    fill={g.color}
                  >
                    G
                  </text>
                </g>
              );
            })}

            {/* 현재 load 세로선 */}
            <motion.line
              x1={xPos}
              y1={PAD / 2}
              x2={xPos}
              y2={HEIGHT - PAD}
              stroke="#7c3aed"
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
            {/* 현재 동작점 — 각 곡선 */}
            {[
              { fn: ideal, color: "#94a3b8" },
              { fn: withControl, color: "#10b981" },
              { fn: curveA, color: "#0ea5e9" },
              { fn: curveB, color: "#ef4444" },
            ].map((m, i) => {
              const y =
                HEIGHT - PAD - (Math.max(0, m.fn(load)) / 100) * (HEIGHT - 2 * PAD);
              return (
                <circle
                  key={i}
                  cx={xPos}
                  cy={y}
                  r={5}
                  fill="white"
                  stroke={m.color}
                  strokeWidth={2}
                />
              );
            })}
          </svg>
        </div>

        {/* 슬라이더 */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <label className="font-semibold">
              입력 패킷 수: <span className="text-sky-600">{load}</span>
            </label>
            <span className="text-gray-500">0 ~ 100</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={load}
            onChange={(e) => setLoad(parseInt(e.target.value))}
            className="w-full accent-sky-500"
          />
        </div>

        {/* 혼잡 단계 진행 바 */}
        <div className="mt-6">
          <h4 className="mb-2 text-sm font-bold">혼잡의 단계적 발생</h4>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
            {stages.map((s) => {
              const active = load >= s.threshold;
              return (
                <motion.div
                  key={s.key}
                  animate={{
                    scale: active ? 1.02 : 1,
                  }}
                  className={`rounded-lg border-2 p-2 text-xs transition-colors ${
                    active
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div
                    className={`font-bold ${
                      active ? "text-red-600 dark:text-red-300" : ""
                    }`}
                  >
                    {s.label}
                  </div>
                  <div className="text-gray-500">{s.desc}</div>
                </motion.div>
              );
            })}
          </div>
          {currentStage && (
            <div className="mt-3 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
              현재 상태: <strong>{currentStage.label}</strong> — {currentStage.desc}
            </div>
          )}
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          <strong>P_A, P_B</strong> = 과부하점(곡선의 정점). 이상의 부하부터 처리량이 감소하며, 처리량이 0에 가까워지는 지점이 <strong>혼잡점 G</strong>.
          혼잡제어가 없을 때는 부하 증가 시 혼잡점에 이르고, 혼잡제어가 있으면 처리량이 일정 수준으로 포화되어 이상적 곡선에 근접.
        </div>
      </div>
    </section>
  );
}
