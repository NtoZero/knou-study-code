"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { collectMerges, cutDendrogram, type HResult } from "./hierarchicalCore";

const W = 380;
const H = 260;
const PAD_L = 46;
const PAD_R = 16;
const PAD_T = 18;
const PAD_B = 46;

const CUT_COLORS = ["#0d9488", "#0891b2", "#059669", "#d97706", "#7c3aed", "#db2777"];

interface Props {
  values: number[];
  labels: string[];
  result: HResult;
  /** 앞에서부터 몇 번의 병합까지 그릴지 (생략하면 전부) */
  visibleMerges?: number;
  cutHeight?: number | null;
  band?: { from: number; to: number } | null;
  onPickHeight?: (h: number) => void;
}

export default function Dendrogram({
  values,
  labels,
  result,
  visibleMerges,
  cutHeight = null,
  band = null,
  onPickHeight,
}: Props) {
  const merges = useMemo(() => collectMerges(result.root), [result]);
  const shown = visibleMerges === undefined ? merges.length : visibleMerges;

  const maxHeight = Math.max(...result.heights, 1);
  const yMax = maxHeight * 1.18;
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const spanV = maxV - minV || 1;

  const px = (v: number) =>
    PAD_L + ((v - minV + spanV * 0.08) / (spanV * 1.16)) * (W - PAD_L - PAD_R);
  const py = (h: number) => H - PAD_B - (h / yMax) * (H - PAD_T - PAD_B);

  const cutClusters = useMemo(
    () => (cutHeight === null ? null : cutDendrogram(result, cutHeight)),
    [result, cutHeight]
  );

  /**
   * 병합 높이를 눈금으로 찍되, Ward's 방법처럼 낮은 높이가 촘촘히 몰리는 경우
   * 숫자가 겹쳐 읽히지 않으므로 11px 이내로 붙는 눈금은 건너뛴다.
   */
  const ticks = useMemo(() => {
    const sorted = [...result.heights].sort((a, b) => a - b);
    const out: number[] = [];
    let lastY = Number.POSITIVE_INFINITY;
    sorted.forEach((h) => {
      const y = py(h);
      if (lastY - y >= 11) {
        out.push(h);
        lastY = y;
      }
    });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, yMax]);

  const colorForMembers = (members: number[]) => {
    if (!cutClusters) return "#0d9488";
    const idx = cutClusters.findIndex((c) =>
      members.every((m) => c.members.includes(m))
    );
    return idx >= 0 ? CUT_COLORS[idx % CUT_COLORS.length] : "#94a3b8";
  };

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!onPickHeight) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const yPix = ((event.clientY - rect.top) / rect.height) * H;
    const h = ((H - PAD_B - yPix) / (H - PAD_T - PAD_B)) * yMax;
    onPickHeight(Math.max(0, Math.min(yMax, Math.round(h * 100) / 100)));
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      onClick={handleClick}
      className={`w-full text-slate-300 dark:text-slate-700 ${
        onPickHeight ? "cursor-ns-resize" : ""
      }`}
    >
      {band && (
        <rect
          x={PAD_L - 6}
          y={py(band.to)}
          width={W - PAD_L - PAD_R + 6}
          height={Math.max(1, py(band.from) - py(band.to))}
          fill="#0d9488"
          opacity={0.1}
        />
      )}

      {/* 축 */}
      <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="currentColor" />
      <line
        x1={PAD_L}
        y1={H - PAD_B}
        x2={W - PAD_R}
        y2={H - PAD_B}
        stroke="currentColor"
      />
      <text x={2} y={PAD_T - 6} fontSize="10" fill="#64748b">
        군집 간의 거리
      </text>
      <text x={W - PAD_R} y={H - 6} fontSize="10" textAnchor="end" fill="#64748b">
        데이터의 좌표값
      </text>

      {/* 거리 눈금 */}
      <text x={PAD_L - 6} y={H - PAD_B + 4} fontSize="10" textAnchor="end" fill="#94a3b8">
        0
      </text>
      {ticks.map((h, i) => (
          <g key={`tick-${i}`}>
            <line
              x1={PAD_L - 3}
              y1={py(h)}
              x2={PAD_L}
              y2={py(h)}
              stroke="#94a3b8"
            />
            <text
              x={PAD_L - 6}
              y={py(h) + 3}
              fontSize="10"
              textAnchor="end"
              fill="#94a3b8"
            >
              {Number.isInteger(h) ? h : h.toFixed(1)}
            </text>
          </g>
        ))}

      {/* 잎 노드 */}
      {values.map((v, i) => (
        <g key={`leaf-${i}`}>
          <line
            x1={px(v)}
            y1={H - PAD_B}
            x2={px(v)}
            y2={H - PAD_B - 4}
            stroke="#94a3b8"
          />
          <text
            x={px(v)}
            y={H - PAD_B + 15}
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            fill="#475569"
          >
            {labels[i]}
          </text>
          <text
            x={px(v)}
            y={H - PAD_B + 28}
            fontSize="10"
            textAnchor="middle"
            fill="#94a3b8"
          >
            {v}
          </text>
        </g>
      ))}

      {/* 병합 가로선 */}
      {merges.slice(0, shown).map((node, i) => {
        if (!node.children) return null;
        const [a, b] = node.children;
        const color = colorForMembers(node.members);
        const y = py(node.height);
        return (
          <motion.g
            key={`merge-${node.id}-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            <line
              x1={px(a.x)}
              y1={py(a.height)}
              x2={px(a.x)}
              y2={y}
              stroke={color}
              strokeWidth="2"
            />
            <line
              x1={px(b.x)}
              y1={py(b.height)}
              x2={px(b.x)}
              y2={y}
              stroke={color}
              strokeWidth="2"
            />
            <line
              x1={px(a.x)}
              y1={y}
              x2={px(b.x)}
              y2={y}
              stroke={color}
              strokeWidth="2"
            />
            <text
              x={px(node.x)}
              y={y - 5}
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
              fill={color}
            >
              {node.id}
            </text>
          </motion.g>
        );
      })}

      {cutHeight !== null && (
        <g>
          <line
            x1={PAD_L}
            y1={py(cutHeight)}
            x2={W - PAD_R}
            y2={py(cutHeight)}
            stroke="#dc2626"
            strokeWidth="1.8"
            strokeDasharray="5 3"
          />
          <text
            x={W - PAD_R}
            y={py(cutHeight) - 5}
            fontSize="10"
            textAnchor="end"
            fill="#dc2626"
          >
            절단선 {cutHeight.toFixed(2)}
          </text>
        </g>
      )}
    </svg>
  );
}
