"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  CLUSTER_COLORS,
  KM_MAX,
  KM_MIN,
  voronoiGrid,
  type KMeansFrame,
  type Point,
} from "./kmeansCore";

const SIZE = 320;
const PAD = 24;
const CELLS = 22;

function scaleX(x: number) {
  return PAD + ((x - KM_MIN) / (KM_MAX - KM_MIN)) * (SIZE - 2 * PAD);
}

function scaleY(y: number) {
  return SIZE - PAD - ((y - KM_MIN) / (KM_MAX - KM_MIN)) * (SIZE - 2 * PAD);
}

interface Props {
  points: Point[];
  frame: KMeansFrame;
  /** 그룹핑 단계에서 각 데이터 → 가장 가까운 대표 벡터 연결선 표시 */
  showLinks?: boolean;
  /** 보로노이 경계(격자 색칠) 표시 */
  showRegions?: boolean;
  /** 캔버스를 클릭해 대표 벡터를 직접 지정하는 모드 */
  onPick?: (p: Point) => void;
  /** 아직 확정되지 않은 직접 지정 중인 대표 벡터 */
  pending?: Point[];
  caption?: string;
}

export default function KMeansCanvas({
  points,
  frame,
  showLinks = true,
  showRegions = true,
  onPick,
  pending,
  caption,
}: Props) {
  const grid = useMemo(
    () => (showRegions ? voronoiGrid(frame.centroids, CELLS, KM_MIN, KM_MAX) : null),
    [frame.centroids, showRegions]
  );

  const cellSize = (SIZE - 2 * PAD) / CELLS;
  const linking = showLinks && frame.phase === "grouping";

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!onPick) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * SIZE;
    const py = ((event.clientY - rect.top) / rect.height) * SIZE;
    const x = KM_MIN + ((px - PAD) / (SIZE - 2 * PAD)) * (KM_MAX - KM_MIN);
    const y = KM_MIN + ((SIZE - PAD - py) / (SIZE - 2 * PAD)) * (KM_MAX - KM_MIN);
    if (x < KM_MIN || x > KM_MAX || y < KM_MIN || y > KM_MAX) return;
    onPick({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
  };

  return (
    <div>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        onClick={handleClick}
        className={`w-full rounded-lg bg-slate-50 text-slate-300 dark:bg-slate-900 dark:text-slate-700 ${
          onPick ? "cursor-crosshair" : ""
        }`}
      >
        {grid &&
          grid.map((row, r) =>
            row.map((cluster, c) => (
              <rect
                key={`${r}-${c}`}
                x={PAD + c * cellSize}
                y={PAD + (CELLS - 1 - r) * cellSize}
                width={cellSize + 0.5}
                height={cellSize + 0.5}
                fill={CLUSTER_COLORS[cluster % CLUSTER_COLORS.length]}
                opacity={0.09}
              />
            ))
          )}

        {/* 축 */}
        <line
          x1={PAD}
          y1={SIZE - PAD}
          x2={SIZE - PAD}
          y2={SIZE - PAD}
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1={PAD}
          y1={PAD}
          x2={PAD}
          y2={SIZE - PAD}
          stroke="currentColor"
          strokeWidth="1"
        />

        {/* 데이터 → 가장 가까운 대표 벡터 연결선 */}
        {linking &&
          points.map((p, i) => {
            const cluster = frame.assignment[i];
            const m = frame.centroids[cluster];
            if (!m) return null;
            return (
              <line
                key={`link-${i}`}
                x1={scaleX(p.x)}
                y1={scaleY(p.y)}
                x2={scaleX(m.x)}
                y2={scaleY(m.y)}
                stroke={CLUSTER_COLORS[cluster % CLUSTER_COLORS.length]}
                strokeWidth="0.8"
                opacity={0.45}
              />
            );
          })}

        {/* 데이터 */}
        {points.map((p, i) => {
          const cluster = frame.assignment[i];
          const color =
            cluster >= 0 ? CLUSTER_COLORS[cluster % CLUSTER_COLORS.length] : "#94a3b8";
          return (
            <circle
              key={`pt-${i}`}
              cx={scaleX(p.x)}
              cy={scaleY(p.y)}
              r={4}
              fill={color}
              fillOpacity={0.85}
            />
          );
        })}

        {/* 직접 지정 중인 대표 벡터 */}
        {pending?.map((p, i) => (
          <circle
            key={`pending-${i}`}
            cx={scaleX(p.x)}
            cy={scaleY(p.y)}
            r={7}
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
            strokeDasharray="3 2"
          />
        ))}

        {/* 대표 벡터 */}
        {frame.centroids.map((m, i) => {
          const color = CLUSTER_COLORS[i % CLUSTER_COLORS.length];
          return (
            <motion.g
              key={`centroid-${i}`}
              initial={false}
              animate={{ x: scaleX(m.x), y: scaleY(m.y) }}
              transition={{ type: "spring", stiffness: 150, damping: 18 }}
            >
              <circle r={9} fill="#ffffff" fillOpacity={0.75} />
              <circle r={9} fill="none" stroke={color} strokeWidth="2.5" />
              <line x1={-4} y1={0} x2={4} y2={0} stroke={color} strokeWidth="2" />
              <line x1={0} y1={-4} x2={0} y2={4} stroke={color} strokeWidth="2" />
            </motion.g>
          );
        })}
      </svg>
      {caption && (
        <p className="mt-2 text-center text-xs text-gray-500">{caption}</p>
      )}
    </div>
  );
}
