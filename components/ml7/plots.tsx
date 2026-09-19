/**
 * 7강 공용 그림 — 2차원 결정 영역과 1차원 회귀함수.
 * 모든 그림은 treeCore의 실제 학습 결과로 그린다.
 */

import { allNodes, leaves, type Sample, type TreeNode } from "./treeCore";

export const C1_COLOR = "#0284c7";
export const C2_COLOR = "#ea580c";
export const C1_FILL = "#bae6fd";
export const C2_FILL = "#fed7aa";

interface Box {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

/** 노드 id → 그 노드가 담당하는 입력 공간의 직사각형 */
export function nodeBoxes(node: TreeNode, box: Box = { x0: 0, x1: 1, y0: 0, y1: 1 }): Map<number, Box> {
  const out = new Map<number, Box>([[node.id, box]]);
  if (node.left && node.right && node.feature !== undefined && node.threshold !== undefined) {
    const t = node.threshold;
    const lb = node.feature === 0 ? { ...box, x1: t } : { ...box, y1: t };
    const rb = node.feature === 0 ? { ...box, x0: t } : { ...box, y0: t };
    nodeBoxes(node.left, lb).forEach((v, k) => out.set(k, v));
    nodeBoxes(node.right, rb).forEach((v, k) => out.set(k, v));
  }
  return out;
}

const S = 300;
const PAD = 26;
const sx = (v: number) => PAD + v * (S - PAD - 8);
const sy = (v: number) => S - PAD - v * (S - PAD - 8);

/** 산점도 + 리프 영역 + 분할선 */
export function RegionPlot({
  tree,
  data,
  highlight,
  showTrue = true,
  size = S,
  mark,
}: {
  tree: TreeNode;
  data: Sample[];
  highlight?: number | null;
  showTrue?: boolean;
  size?: number;
  /** 질의점 표시 */
  mark?: [number, number];
}) {
  const boxes = nodeBoxes(tree);
  const lf = leaves(tree);
  const internals = allNodes(tree).filter((n) => n.left);
  const hb = highlight !== undefined && highlight !== null ? boxes.get(highlight) : undefined;
  return (
    <svg viewBox={`0 0 ${S} ${S}`} style={{ width: size, maxWidth: "100%" }} role="img" aria-label="결정 영역">
      {lf.map((n) => {
        const b = boxes.get(n.id)!;
        return (
          <rect
            key={n.id}
            x={sx(b.x0)}
            y={sy(b.y1)}
            width={sx(b.x1) - sx(b.x0)}
            height={sy(b.y0) - sy(b.y1)}
            fill={n.value === 0 ? C1_FILL : C2_FILL}
            opacity={0.75}
          />
        );
      })}
      {internals.map((n) => {
        const b = boxes.get(n.id)!;
        const t = n.threshold!;
        return n.feature === 0 ? (
          <line key={n.id} x1={sx(t)} y1={sy(b.y0)} x2={sx(t)} y2={sy(b.y1)} stroke="#334155" strokeWidth={1} />
        ) : (
          <line key={n.id} x1={sx(b.x0)} y1={sy(t)} x2={sx(b.x1)} y2={sy(t)} stroke="#334155" strokeWidth={1} />
        );
      })}
      {hb && (
        <rect
          x={sx(hb.x0)}
          y={sy(hb.y1)}
          width={sx(hb.x1) - sx(hb.x0)}
          height={sy(hb.y0) - sy(hb.y1)}
          fill="none"
          stroke="#059669"
          strokeWidth={3}
        />
      )}
      {showTrue && (
        <line x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(1)} stroke="#dc2626" strokeWidth={1.5} strokeDasharray="5 3" />
      )}
      {data.map((d, i) => (
        <circle
          key={i}
          cx={sx(d.x[0])}
          cy={sy(d.x[1])}
          r={2.8}
          fill={d.y === 0 ? C1_COLOR : C2_COLOR}
          stroke="#fff"
          strokeWidth={0.6}
        />
      ))}
      {mark && (
        <g>
          <circle cx={sx(mark[0])} cy={sy(mark[1])} r={6} fill="none" stroke="#059669" strokeWidth={2.5} />
          <circle cx={sx(mark[0])} cy={sy(mark[1])} r={1.8} fill="#059669" />
        </g>
      )}
      <rect x={sx(0)} y={sy(1)} width={sx(1) - sx(0)} height={sy(0) - sy(1)} fill="none" stroke="#94a3b8" />
      {[0, 0.5, 1].map((v) => (
        <g key={v}>
          <text x={sx(v)} y={S - 10} textAnchor="middle" fontSize={9} className="fill-gray-400">
            {v}
          </text>
          <text x={PAD - 4} y={sy(v) + 3} textAnchor="end" fontSize={9} className="fill-gray-400">
            {v}
          </text>
        </g>
      ))}
      <text x={sx(0.75)} y={S - 10} textAnchor="middle" fontSize={10} className="fill-gray-500">
        x₁
      </text>
      <text x={PAD - 4} y={sy(0.75) + 3} textAnchor="end" fontSize={10} className="fill-gray-500">
        x₂
      </text>
    </svg>
  );
}


/** 격자 위 예측값(0/1)으로 칠한 결정 영역 — 랜덤 포레스트처럼 축에 평행한 사각형으로 나뉘지 않는 경우 */
export function GridPlot({
  grid,
  res,
  data,
  showTrue = true,
  size = S,
  mark,
}: {
  grid: number[];
  res: number;
  data: Sample[];
  showTrue?: boolean;
  size?: number;
  mark?: [number, number];
}) {
  const cw = (sx(1) - sx(0)) / res;
  /** 같은 값이 이어지는 칸을 한 사각형으로 묶어 요소 수를 줄인다 */
  const runs: { j: number; i0: number; i1: number; v: number }[] = [];
  for (let j = 0; j < res; j += 1) {
    let i0 = 0;
    for (let i = 1; i <= res; i += 1) {
      if (i === res || grid[j * res + i] !== grid[j * res + i0]) {
        runs.push({ j, i0, i1: i, v: grid[j * res + i0] });
        i0 = i;
      }
    }
  }
  return (
    <svg viewBox={`0 0 ${S} ${S}`} style={{ width: size, maxWidth: "100%" }} role="img" aria-label="결정 영역">
      {runs.map((r) => (
        <rect
          key={`${r.j}-${r.i0}`}
          x={sx(0) + r.i0 * cw}
          y={sy(0) - (r.j + 1) * cw}
          width={(r.i1 - r.i0) * cw + 0.4}
          height={cw + 0.4}
          fill={r.v === 0 ? C1_FILL : C2_FILL}
          opacity={0.75}
        />
      ))}
      {showTrue && (
        <line x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(1)} stroke="#dc2626" strokeWidth={1.5} strokeDasharray="5 3" />
      )}
      {data.map((d, i) => (
        <circle
          key={i}
          cx={sx(d.x[0])}
          cy={sy(d.x[1])}
          r={2.3}
          fill={d.y === 0 ? C1_COLOR : C2_COLOR}
          stroke="#fff"
          strokeWidth={0.5}
        />
      ))}
      {mark && (
        <g>
          <circle cx={sx(mark[0])} cy={sy(mark[1])} r={6} fill="none" stroke="#059669" strokeWidth={2.5} />
          <circle cx={sx(mark[0])} cy={sy(mark[1])} r={1.8} fill="#059669" />
        </g>
      )}
      <rect x={sx(0)} y={sy(1)} width={sx(1) - sx(0)} height={sy(0) - sy(1)} fill="none" stroke="#94a3b8" />
      {[0, 0.5, 1].map((v) => (
        <g key={v}>
          <text x={sx(v)} y={S - 10} textAnchor="middle" fontSize={9} className="fill-gray-400">
            {v}
          </text>
          <text x={PAD - 4} y={sy(v) + 3} textAnchor="end" fontSize={9} className="fill-gray-400">
            {v}
          </text>
        </g>
      ))}
      <text x={sx(0.75)} y={S - 10} textAnchor="middle" fontSize={10} className="fill-gray-500">
        x₁
      </text>
      <text x={PAD - 4} y={sy(0.75) + 3} textAnchor="end" fontSize={10} className="fill-gray-500">
        x₂
      </text>
    </svg>
  );
}

/** 격자 칸 중심 좌표 (행 우선, 아래쪽 행부터) */
export function gridCenters(res: number): number[][] {
  const out: number[][] = [];
  for (let j = 0; j < res; j += 1) {
    for (let i = 0; i < res; i += 1) out.push([(i + 0.5) / res, (j + 0.5) / res]);
  }
  return out;
}

/* ─────────── 1차원 회귀 그림 ─────────── */

export const RX_MIN = 0;
export const RX_MAX = 5;
export const RY_MIN = -2.1;
export const RY_MAX = 2.1;
const RW = 440;
const RH = 230;
const rx = (x: number) => 34 + ((x - RX_MIN) / (RX_MAX - RX_MIN)) * (RW - 46);
const ry = (y: number) => 12 + ((RY_MAX - y) / (RY_MAX - RY_MIN)) * (RH - 38);

/** x를 촘촘히 훑어 얻은 회귀함수 값으로 그린 선 */
export function RegressionPlot({
  data,
  xs,
  ys,
  color = "#2563eb",
  splits = [],
  showTruth = false,
}: {
  data: Sample[];
  xs: number[];
  ys: number[];
  color?: string;
  splits?: number[];
  showTruth?: boolean;
}) {
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${rx(x).toFixed(1)},${ry(ys[i]).toFixed(1)}`).join(" ");
  const truth = xs.map((x, i) => `${i === 0 ? "M" : "L"}${rx(x).toFixed(1)},${ry(Math.sin(x)).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${RW} ${RH}`} className="w-full min-w-[360px]" role="img" aria-label="회귀함수">
      <line x1={rx(RX_MIN)} y1={ry(0)} x2={rx(RX_MAX)} y2={ry(0)} stroke="#e2e8f0" />
      {[0, 1, 2, 3, 4, 5].map((v) => (
        <text key={v} x={rx(v)} y={RH - 10} textAnchor="middle" fontSize={9} className="fill-gray-400">
          {v}
        </text>
      ))}
      {[-2, -1, 0, 1, 2].map((v) => (
        <text key={v} x={rx(RX_MIN) - 6} y={ry(v) + 3} textAnchor="end" fontSize={9} className="fill-gray-400">
          {v}
        </text>
      ))}
      {splits.map((s, i) => (
        <line key={i} x1={rx(s)} y1={12} x2={rx(s)} y2={RH - 26} stroke="#94a3b8" strokeDasharray="2 3" strokeWidth={0.8} />
      ))}
      {showTruth && <path d={truth} fill="none" stroke="#dc2626" strokeWidth={1.2} strokeDasharray="5 3" opacity={0.7} />}
      {data.map((d, i) => (
        <circle key={i} cx={rx(d.x[0])} cy={ry(d.y)} r={2.6} fill="#d97706" opacity={0.85} />
      ))}
      <path d={path} fill="none" stroke={color} strokeWidth={2} />
      <text x={rx(4.5)} y={RH - 10} textAnchor="middle" fontSize={10} className="fill-gray-500">
        x
      </text>
      <text x={rx(RX_MIN) - 6} y={ry(1.5) + 3} textAnchor="end" fontSize={10} className="fill-gray-500">
        y
      </text>
    </svg>
  );
}

/** 회귀함수를 그리기 위한 x 표본 */
export function sampleXs(n = 500): number[] {
  return Array.from({ length: n + 1 }, (_, i) => RX_MIN + ((RX_MAX - RX_MIN) * i) / n);
}

/** 트리의 모든 분할 기준값 (1차원) */
export function splitPoints(tree: TreeNode): number[] {
  return allNodes(tree)
    .filter((n) => n.left)
    .map((n) => n.threshold!);
}

