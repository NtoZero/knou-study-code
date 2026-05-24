"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { GraphView } from "../visualization/GraphView";
import type { GraphAux } from "../../types/sort";
import type { GraphInput, GraphVertex } from "../../types/graph";

type MatrixValue = number | string | null;

interface StepperProps {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onReset?: () => void;
  label?: string;
}

interface GridTableProps {
  title: string;
  rowLabels: string[];
  colLabels: string[];
  values: MatrixValue[][];
  highlight?: Set<string>;
  compact?: boolean;
}

interface BinItem {
  index: number;
  size: number;
}

interface BinState {
  load: number;
  items: BinItem[];
}

interface HuffmanNode {
  id: number;
  label: string;
  freq: number;
  char?: string;
  left?: HuffmanNode | null;
  right?: HuffmanNode | null;
}

interface HuffmanMergeStep {
  left: string;
  right: string;
  parent: string;
  queue: string[];
}

interface RabinKarpWindow {
  position: number;
  window: string;
  hash: number;
  candidate: boolean;
  match: boolean;
}

interface KmpStep {
  type: "match" | "fallback" | "found";
  textIndex: number;
  patternIndex: number;
  textChar?: string;
  patternChar?: string;
  fallbackTo?: number;
  matchPosition?: number;
  note: string;
}

interface BoyerMooreStep {
  alignment: number;
  mismatchIndex: number | null;
  textChar?: string;
  patternChar?: string;
  badShift: number;
  goodShift: number;
  move: number;
  matched: boolean;
  matchPosition?: number;
  note: string;
}

interface RleRun {
  char: string;
  count: number;
}

interface HuffmanTrace {
  frequencies: { char: string; freq: number }[];
  merges: HuffmanMergeStep[];
  codes: Record<string, string>;
  encoded: string;
}

interface Lz77Token {
  position: number;
  dist: number;
  length: number;
  next: string;
  window: string;
  lookahead: string;
  match: string;
}

interface ApproxVertexCoverResult {
  cover: number[];
  chosenEdges: number[];
}

interface MstResult {
  mstEdgeIndices: number[];
  order: number[];
}

function Stepper({ index, total, onPrev, onNext, onReset, label }: StepperProps) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2">
      <div className="text-xs text-slate-400">
        {label ? <span className="mr-2 font-semibold text-slate-200">{label}</span> : null}
        단계 {Math.min(index + 1, total)} / {total}
      </div>
      <div className="flex items-center gap-1">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-300 transition hover:border-slate-400 hover:text-white"
          >
            <RotateCcw size={12} />
          </button>
        )}
        <button
          type="button"
          onClick={onPrev}
          className="rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-300 transition hover:border-slate-400 hover:text-white"
        >
          <ChevronLeft size={12} />
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-300 transition hover:border-slate-400 hover:text-white"
        >
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

function GridTable({ title, rowLabels, colLabels, values, highlight = new Set<string>(), compact = false }: GridTableProps) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
      <div className="overflow-x-auto">
        <table className={`border-collapse font-mono ${compact ? "text-[10px]" : "text-xs"}`}>
          <thead>
            <tr>
              <th className="border border-slate-700 px-2 py-1 text-slate-500" />
              {colLabels.map((label, col) => (
                <th
                  key={label + col}
                  className="border border-slate-700 px-2 py-1 text-center text-slate-400"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {values.map((row, r) => (
              <tr key={r}>
                <th className="border border-slate-700 px-2 py-1 text-slate-400">{rowLabels[r]}</th>
                {row.map((value, c) => {
                  const key = `${r}-${c}`;
                  const isHighlighted = highlight.has(key);
                  const isBlank = value === null || value === undefined || value === "";
                  return (
                    <td
                      key={c}
                      className={`border border-slate-700 px-2 py-1 text-center ${
                        isHighlighted ? "bg-emerald-400/20 text-emerald-100" : "text-slate-200"
                      } ${isBlank ? "bg-slate-900/80 text-slate-600" : ""}`}
                    >
                      {isBlank ? "—" : value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function alphabetValue(ch: string): number {
  if (/^[0-9]$/.test(ch)) return Number(ch);
  return ch.codePointAt(0) ?? 0;
}

function formatBinSize(size: number): string {
  return size.toFixed(1).replace(/\.0$/, "");
}

function matrixChainOrder(dims: number[]) {
  const n = dims.length - 1;
  const cost = Array.from({ length: n }, () => Array<MatrixValue>(n).fill(null));
  const split = Array.from({ length: n }, () => Array<MatrixValue>(n).fill(null));
  const m = Array.from({ length: n }, () => Array(n).fill(0));
  const s = Array.from({ length: n }, () => Array(n).fill(0));

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      m[i][j] = Number.POSITIVE_INFINITY;
      for (let k = i; k < j; k++) {
        const q = m[i][k] + m[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
        if (q < m[i][j]) {
          m[i][j] = q;
          s[i][j] = k;
        }
      }
    }
  }

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      cost[i][j] = i === j ? 0 : m[i][j];
      split[i][j] = i === j ? 0 : s[i][j] + 1;
    }
  }

  const build = (i: number, j: number): string => {
    if (i === j) return `M${i + 1}`;
    const k = s[i][j];
    return `(${build(i, k)}${build(k + 1, j)})`;
  };

  return {
    cost,
    split,
    optimalCost: m[0][n - 1],
    parenthesization: build(0, n - 1),
  };
}

function lcsResult(x: string, y: string) {
  const n = x.length;
  const m = y.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = x[i - 1] === y[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const trace = new Set<string>();
  let i = n;
  let j = m;
  const chars: string[] = [];
  while (i > 0 && j > 0) {
    trace.add(`${i}-${j}`);
    if (x[i - 1] === y[j - 1]) {
      chars.push(x[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  trace.add("0-0");

  return {
    table: dp,
    trace,
    lcs: chars.reverse().join(""),
  };
}

function computePrefixFunction(pattern: string) {
  const pi = Array(pattern.length).fill(0);
  let j = 0;
  for (let i = 1; i < pattern.length; i++) {
    while (j > 0 && pattern[i] !== pattern[j]) {
      j = pi[j - 1];
    }
    if (pattern[i] === pattern[j]) {
      j++;
    }
    pi[i] = j;
  }
  return pi;
}

function rabinKarpTrace(text: string, pattern: string, base = 2, mod = 11) {
  const m = pattern.length;
  const windows: RabinKarpWindow[] = [];
  const matches: number[] = [];

  let patternHash = 0;
  let windowHash = 0;
  let highPow = 1;

  for (let i = 0; i < m - 1; i++) {
    highPow = (highPow * base) % mod;
  }
  for (let i = 0; i < m; i++) {
    patternHash = (base * patternHash + alphabetValue(pattern[i])) % mod;
    windowHash = (base * windowHash + alphabetValue(text[i])) % mod;
  }

  for (let i = 0; i <= text.length - m; i++) {
    const window = text.slice(i, i + m);
    const candidate = windowHash === patternHash;
    const match = candidate && window === pattern;
    if (match) matches.push(i);
    windows.push({
      position: i,
      window,
      hash: windowHash,
      candidate,
      match,
    });

    if (i < text.length - m) {
      const left = alphabetValue(text[i]);
      const right = alphabetValue(text[i + m]);
      windowHash = (base * (windowHash - left * highPow) + right) % mod;
      if (windowHash < 0) windowHash += mod;
    }
  }

  return { patternHash, windows, matches, modulus: mod };
}

function buildGoodSuffixShift(pattern: string) {
  const m = pattern.length;
  const shift = Array(m + 1).fill(0);
  const bpos = Array(m + 1).fill(0);
  let i = m;
  let j = m + 1;
  bpos[i] = j;

  while (i > 0) {
    while (j <= m && pattern[i - 1] !== pattern[j - 1]) {
      if (shift[j] === 0) {
        shift[j] = j - i;
      }
      j = bpos[j];
    }
    i--;
    j--;
    bpos[i] = j;
  }

  j = bpos[0];
  for (i = 0; i <= m; i++) {
    if (shift[i] === 0) {
      shift[i] = j;
    }
    if (i === j) {
      j = bpos[j];
    }
  }

  return shift;
}

function boyerMooreTrace(text: string, pattern: string) {
  const badChar = new Map<string, number>();
  for (let i = 0; i < pattern.length; i++) {
    badChar.set(pattern[i], i);
  }
  const goodSuffix = buildGoodSuffixShift(pattern);
  const steps: BoyerMooreStep[] = [];
  const matches: number[] = [];
  let s = 0;

  while (s <= text.length - pattern.length) {
    let j = pattern.length - 1;
    while (j >= 0 && pattern[j] === text[s + j]) {
      j--;
    }
    if (j < 0) {
      matches.push(s);
      steps.push({
        alignment: s,
        mismatchIndex: null,
        badShift: goodSuffix[0] || 1,
        goodShift: goodSuffix[0] || 1,
        move: Math.max(1, goodSuffix[0] || 1),
        matched: true,
        matchPosition: s,
        note: `전체 일치 → 패턴을 ${Math.max(1, goodSuffix[0] || 1)}칸 이동.`,
      });
      s += Math.max(1, goodSuffix[0] || 1);
    } else {
      const badShift = Math.max(1, j - (badChar.get(text[s + j]) ?? -1));
      const goodShiftValue = goodSuffix[j + 1] || 1;
      const move = Math.max(badShift, goodShiftValue);
      steps.push({
        alignment: s,
        mismatchIndex: j,
        textChar: text[s + j],
        patternChar: pattern[j],
        badShift,
        goodShift: goodShiftValue,
        move,
        matched: false,
        note: `불일치 문자 이동 ${badShift}칸, 일치 접미부 이동 ${goodShiftValue}칸 중 큰 값 ${move}칸 선택.`,
      });
      s += move;
    }
  }

  return {
    badChar: Object.fromEntries(badChar.entries()),
    goodSuffix,
    steps,
    matches,
  };
}

function rleEncode(input: string) {
  const runs: RleRun[] = [];
  let i = 0;
  while (i < input.length) {
    let j = i + 1;
    while (j < input.length && input[j] === input[i]) {
      j++;
    }
    runs.push({ char: input[i], count: j - i });
    i = j;
  }
  const encoded = runs.map((run) => `(${run.char}, ${run.count})`).join(" ");
  const decoded = runs.map((run) => run.char.repeat(run.count)).join("");
  return { runs, encoded, decoded };
}

function huffmanTrace(input: string): HuffmanTrace {
  const frequencies = Array.from(
    input.split("").reduce((map, ch) => map.set(ch, (map.get(ch) ?? 0) + 1), new Map<string, number>()),
    ([char, freq]) => ({ char, freq }),
  ).sort((a, b) => a.freq - b.freq || a.char.localeCompare(b.char));

  let nextId = 0;
  const makeNode = (char: string | undefined, freq: number, left?: HuffmanNode | null, right?: HuffmanNode | null): HuffmanNode => ({
    id: nextId++,
    label: char ?? "",
    char,
    freq,
    left: left ?? null,
    right: right ?? null,
  });

  let queue: HuffmanNode[] = frequencies.map(({ char, freq }) => makeNode(char, freq));
  const merges: HuffmanMergeStep[] = [];

  const nodeLabel = (node: HuffmanNode) => (node.char ? `${node.char}:${node.freq}` : `${node.label || "∑"}:${node.freq}`);

  while (queue.length > 1) {
    queue.sort((a, b) => a.freq - b.freq || nodeLabel(a).localeCompare(nodeLabel(b)));
    const left = queue.shift()!;
    const right = queue.shift()!;
    const parent = makeNode(undefined, left.freq + right.freq, left, right);
    merges.push({
      left: nodeLabel(left),
      right: nodeLabel(right),
      parent: nodeLabel(parent),
      queue: queue.map(nodeLabel),
    });
    queue.push(parent);
  }

  const root = queue[0] ?? null;
  const codes: Record<string, string> = {};
  const walk = (node: HuffmanNode | null, prefix: string) => {
    if (!node) return;
    if (node.char) {
      codes[node.char] = prefix || "0";
      return;
    }
    walk(node.left ?? null, `${prefix}0`);
    walk(node.right ?? null, `${prefix}1`);
  };
  walk(root, "");

  const encoded = input.split("").map((ch) => codes[ch]).join("");
  return { frequencies, merges, codes, encoded };
}

function lz77Trace(input: string, windowSize: number, lookaheadSize: number) {
  const tokens: Lz77Token[] = [];
  let i = 0;
  while (i < input.length) {
    const start = Math.max(0, i - windowSize);
    const window = input.slice(start, i);
    const lookahead = input.slice(i, Math.min(input.length, i + lookaheadSize));
    let bestDist = 0;
    let bestLen = 0;

    for (let dist = 1; dist <= window.length; dist++) {
      let len = 0;
      while (
        len < lookaheadSize - 1 &&
        i + len < input.length &&
        input[i + len] === input[i - dist + len]
      ) {
        len++;
      }
      if (len > bestLen) {
        bestLen = len;
        bestDist = dist;
      }
    }

    const next = input[i + bestLen] ?? "";
    const match = bestLen > 0 ? input.slice(i - bestDist, i - bestDist + bestLen) : "";
    tokens.push({
      position: i,
      dist: bestDist,
      length: bestLen,
      next,
      window,
      lookahead,
      match,
    });
    i += bestLen + 1;
  }
  return { tokens };
}

function placeItems(items: BinItem[], choose: (bins: BinState[], item: BinItem) => number, sortDescending = false) {
  const order = sortDescending ? [...items].sort((a, b) => b.size - a.size || a.index - b.index) : [...items];
  const bins: BinState[] = [];

  for (const item of order) {
    const index = choose(bins, item);
    if (!bins[index]) {
      bins[index] = { load: 0, items: [] };
    }
    bins[index].items.push(item);
    bins[index].load += item.size;
  }

  return { order, bins };
}

function firstFitBins(items: BinItem[], sortDescending = false) {
  return placeItems(
    items,
    (bins, item) => {
      const first = bins.findIndex((bin) => bin.load + item.size <= 1);
      return first >= 0 ? first : bins.length;
    },
    sortDescending,
  );
}

function bestFitBins(items: BinItem[], sortDescending = false) {
  return placeItems(
    items,
    (bins, item) => {
      let best = -1;
      let bestLeft = Number.POSITIVE_INFINITY;
      bins.forEach((bin, idx) => {
        const left = 1 - (bin.load + item.size);
        if (left >= 0 && left < bestLeft) {
          bestLeft = left;
          best = idx;
        }
      });
      return best >= 0 ? best : bins.length;
    },
    sortDescending,
  );
}

function approximateVertexCover(graph: GraphInput, edgeOrder: number[]): ApproxVertexCoverResult {
  const remaining = new Set(graph.edges.map((_, idx) => idx));
  const cover = new Set<number>();
  const chosenEdges: number[] = [];

  for (const edgeIndex of edgeOrder) {
    if (!remaining.has(edgeIndex)) continue;
    const edge = graph.edges[edgeIndex];
    chosenEdges.push(edgeIndex);
    cover.add(edge.from);
    cover.add(edge.to);
    graph.edges.forEach((candidate, idx) => {
      if (
        candidate.from === edge.from ||
        candidate.from === edge.to ||
        candidate.to === edge.from ||
        candidate.to === edge.to
      ) {
        remaining.delete(idx);
      }
    });
    if (remaining.size === 0) break;
  }

  return { cover: [...cover], chosenEdges };
}

function kruskalMst(graph: GraphInput): MstResult {
  const parents = new Map<number, number>();
  const rank = new Map<number, number>();
  graph.vertices.forEach((vertex) => {
    parents.set(vertex.id, vertex.id);
    rank.set(vertex.id, 0);
  });

  const find = (x: number): number => {
    const parent = parents.get(x)!;
    if (parent !== x) {
      parents.set(x, find(parent));
    }
    return parents.get(x)!;
  };

  const union = (a: number, b: number): boolean => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA === rootB) return false;
    const rankA = rank.get(rootA) ?? 0;
    const rankB = rank.get(rootB) ?? 0;
    if (rankA < rankB) {
      parents.set(rootA, rootB);
    } else if (rankA > rankB) {
      parents.set(rootB, rootA);
    } else {
      parents.set(rootB, rootA);
      rank.set(rootA, rankA + 1);
    }
    return true;
  };

  const sorted = graph.edges
    .map((edge, index) => ({ ...edge, index }))
    .sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0) || a.index - b.index);

  const mstEdgeIndices: number[] = [];
  for (const edge of sorted) {
    if (union(edge.from, edge.to)) {
      mstEdgeIndices.push(edge.index);
    }
  }

  const adjacency = new Map<number, number[]>();
  graph.vertices.forEach((vertex) => adjacency.set(vertex.id, []));
  mstEdgeIndices.forEach((edgeIndex) => {
    const edge = graph.edges[edgeIndex];
    adjacency.get(edge.from)?.push(edge.to);
    adjacency.get(edge.to)?.push(edge.from);
  });
  adjacency.forEach((neighbors) => neighbors.sort((a, b) => a - b));

  const visited = new Set<number>();
  const order: number[] = [];
  const start = graph.vertices[0]?.id ?? 0;
  const dfs = (v: number) => {
    visited.add(v);
    order.push(v);
    for (const next of adjacency.get(v) ?? []) {
      if (!visited.has(next)) dfs(next);
    }
  };
  dfs(start);

  return { mstEdgeIndices, order };
}

function cloneVerticesWithState(vertices: GraphVertex[], states: Partial<Record<number, GraphVertex["state"]>>) {
  return vertices.map((vertex) => ({
    ...vertex,
    state: states[vertex.id] ?? vertex.state ?? "unvisited",
  }));
}

function renderGridValues<T extends MatrixValue>(values: T[][]) {
  return values as MatrixValue[][];
}

const MATRIX_DIMS = [5, 4, 2, 3, 1, 6];
const LCS_X = "SNOWY";
const LCS_Y = "SUNNY";
const RK_TEXT = "10011100";
const RK_PATTERN = "0011";
const KMP_TEXT = "aabaabaaa";
const KMP_PATTERN = "aabaa";
const BM_TEXT = "abababcababcaba";
const BM_PATTERN = "ababcab";
const RLE_INPUT = "aaabbbbbaaccccbaaaaaaa";
const HUFFMAN_INPUT = "abababcdbabc";
const LZ77_INPUT = "abcdefgabcdehi";
const BIN_ITEMS = [0.3, 0.3, 0.3, 0.4, 0.3, 0.4].map((size, index) => ({
  index: index + 1,
  size,
}));

const VC_GRAPH: GraphInput = {
  vertices: [
    { id: 0, x: 90, y: 70, label: "A" },
    { id: 1, x: 40, y: 190, label: "B" },
    { id: 2, x: 170, y: 190, label: "C" },
    { id: 3, x: 230, y: 70, label: "D" },
  ],
  edges: [
    { from: 0, to: 1, weight: 1 },
    { from: 1, to: 2, weight: 1 },
    { from: 2, to: 3, weight: 1 },
  ],
  directed: false,
};

const TSP_GRAPH: GraphInput = {
  vertices: [
    { id: 0, x: 120, y: 50, label: "A" },
    { id: 1, x: 30, y: 170, label: "B" },
    { id: 2, x: 160, y: 180, label: "C" },
    { id: 3, x: 70, y: 300, label: "D" },
    { id: 4, x: 220, y: 300, label: "E" },
  ],
  edges: [
    { from: 0, to: 1, weight: 2 },
    { from: 0, to: 2, weight: 6 },
    { from: 0, to: 3, weight: 8 },
    { from: 0, to: 4, weight: 7 },
    { from: 1, to: 2, weight: 3 },
    { from: 1, to: 3, weight: 7 },
    { from: 1, to: 4, weight: 5 },
    { from: 2, to: 3, weight: 4 },
    { from: 2, to: 4, weight: 6 },
    { from: 3, to: 4, weight: 2 },
  ],
  directed: false,
};

function renderSelectedSetGraph(graph: GraphInput, selected: number[]) {
  const vertices = cloneVerticesWithState(
    graph.vertices,
    Object.fromEntries(selected.map((id) => [id, "visited"] as const)) as Partial<Record<number, GraphVertex["state"]>>,
  );
  const aux: GraphAux = {
    kind: "graph",
    vertices,
    edges: graph.edges,
    sets: [selected],
    setsLabel: "버텍스 커버",
  };
  return aux;
}

export function MatrixChainDemo() {
  const result = useMemo(() => matrixChainOrder(MATRIX_DIMS), []);
  const [view, setView] = useState<"cost" | "split" | "paren">("cost");
  const labels = MATRIX_DIMS.slice(0, -1).map((_, i) => `M${i + 1}`);
  const values = view === "cost" ? result.cost : result.split;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1">
        {[
          ["cost", "비용표"],
          ["split", "분할표"],
          ["paren", "최적 괄호"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setView(id as typeof view)}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              view === id ? "bg-emerald-400 text-slate-950" : "border border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === "paren" ? (
        <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
          <p className="text-xs text-slate-400">행렬 차원</p>
          <p className="mt-1 font-mono text-sm text-slate-200">
            {`P = [${MATRIX_DIMS.join(", ")}]`}
          </p>
          <div className="mt-3 rounded-md border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-100">
            최소 기본 곱셈 횟수는 <strong>{result.optimalCost}</strong>.
            <div className="mt-1 font-mono">{result.parenthesization}</div>
          </div>
        </div>
      ) : (
        <GridTable
          title={view === "cost" ? "C[i][j] 최소 비용" : "P[i][j] 분할 위치"}
          rowLabels={labels}
          colLabels={labels}
          values={renderGridValues(values)}
        />
      )}
    </div>
  );
}

export function LcsDemo() {
  const result = useMemo(() => lcsResult(LCS_X, LCS_Y), []);
  const [view, setView] = useState<"table" | "trace" | "result">("table");
  const rowLabels = ["", ...LCS_X.split("")];
  const colLabels = ["", ...LCS_Y.split("")];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1">
        {[
          ["table", "길이표"],
          ["trace", "추적"],
          ["result", "결과"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setView(id as typeof view)}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              view === id ? "bg-blue-400 text-slate-950" : "border border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === "result" ? (
        <div className="rounded-lg border border-blue-400/30 bg-blue-400/10 p-3">
          <p className="text-xs text-blue-200">최장 공통 부분 수열</p>
          <p className="mt-1 font-mono text-base text-blue-100">{result.lcs}</p>
          <p className="mt-2 text-xs text-slate-300">
            두 문자열 <span className="font-mono text-slate-100">{LCS_X}</span>와{" "}
            <span className="font-mono text-slate-100">{LCS_Y}</span>의 길이 {result.table[LCS_X.length][LCS_Y.length]}.
          </p>
        </div>
      ) : (
        <GridTable
          title={view === "table" ? "LCS 길이표" : "복원 경로"}
          rowLabels={rowLabels}
          colLabels={colLabels}
          values={renderGridValues(result.table)}
          highlight={view === "trace" ? result.trace : new Set<string>()}
          compact
        />
      )}
    </div>
  );
}

export function RabinKarpDemo() {
  const trace = useMemo(() => rabinKarpTrace(RK_TEXT, RK_PATTERN), []);
  const [index, setIndex] = useState(0);
  const current = trace.windows[index];

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-400">텍스트 / 패턴</p>
        <p className="mt-1 font-mono text-sm text-slate-200">
          T = {RK_TEXT}
        </p>
        <p className="font-mono text-sm text-slate-200">
          P = {RK_PATTERN}
        </p>
        <p className="mt-2 text-xs text-slate-300">
          패턴 해시 = <span className="font-mono text-amber-300">{trace.patternHash}</span>, 모듈러 = {trace.modulus}
        </p>
      </div>

      <Stepper
        index={index}
        total={trace.windows.length}
        onPrev={() => setIndex((value) => Math.max(0, value - 1))}
        onNext={() => setIndex((value) => Math.min(trace.windows.length - 1, value + 1))}
        onReset={() => setIndex(0)}
        label="윈도"
      />

      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-400">현재 윈도</p>
        <p className="mt-1 font-mono text-sm text-slate-100">
          위치 {current.position}: {current.window}
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className={`rounded-full px-2 py-1 ${current.candidate ? "bg-amber-400/20 text-amber-100" : "bg-slate-700/50 text-slate-300"}`}>
            해시 {current.hash}
          </span>
          <span className={`rounded-full px-2 py-1 ${current.candidate ? "bg-emerald-400/20 text-emerald-100" : "bg-slate-700/50 text-slate-300"}`}>
            {current.candidate ? "후보" : "후보 아님"}
          </span>
          <span className={`rounded-full px-2 py-1 ${current.match ? "bg-blue-400/20 text-blue-100" : "bg-slate-700/50 text-slate-300"}`}>
            {current.match ? "직접 일치" : "직접 불일치"}
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-300">
          {current.match
            ? "해시가 같고 문자도 같아 실제 매치로 인정."
            : current.candidate
              ? "해시는 같지만 직접 비교에서 불일치."
              : "해시가 달라 후보가 아님."}
        </p>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="mb-2 text-xs text-slate-400">윈도별 해시</p>
        <div className="flex flex-wrap gap-2">
          {trace.windows.map((window, idx) => (
            <button
              key={window.position}
              type="button"
              onClick={() => setIndex(idx)}
              className={`rounded-md border px-2 py-1 text-xs transition ${
                idx === index
                  ? "border-amber-300 bg-amber-400 text-slate-950"
                  : "border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
            >
              {window.position}:{window.hash}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400">매치 위치: [{trace.matches.join(", ")}]</p>
    </div>
  );
}

export function KmpDemo() {
  const pi = useMemo(() => computePrefixFunction(KMP_PATTERN), []);
  const trace = useMemo(() => {
    const steps: KmpStep[] = [];
    const matches: number[] = [];
    let j = 0;
    for (let i = 0; i < KMP_TEXT.length; i++) {
      while (j > 0 && KMP_TEXT[i] !== KMP_PATTERN[j]) {
        const fallbackTo = pi[j - 1];
        steps.push({
          type: "fallback",
          textIndex: i,
          patternIndex: j,
          textChar: KMP_TEXT[i],
          patternChar: KMP_PATTERN[j],
          fallbackTo,
          note: `불일치 → F[${j - 1}] = ${fallbackTo}로 되돌림.`,
        });
        j = fallbackTo;
      }
      if (KMP_TEXT[i] === KMP_PATTERN[j]) {
        steps.push({
          type: "match",
          textIndex: i,
          patternIndex: j,
          textChar: KMP_TEXT[i],
          patternChar: KMP_PATTERN[j],
          note: `T[${i}] = P[${j}]`,
        });
        j++;
        if (j === KMP_PATTERN.length) {
          const pos = i - j + 1;
          matches.push(pos);
          steps.push({
            type: "found",
            textIndex: i,
            patternIndex: j - 1,
            matchPosition: pos,
            note: `패턴 전체 일치 → 위치 ${pos}에서 발견.`,
          });
          j = pi[j - 1];
        }
      } else {
        steps.push({
          type: "match",
          textIndex: i,
          patternIndex: j,
          textChar: KMP_TEXT[i],
          patternChar: KMP_PATTERN[j],
          note: `T[${i}] = ${KMP_TEXT[i]}와 P[${j}] = ${KMP_PATTERN[j]} 불일치.`,
        });
      }
    }
    return { steps, matches };
  }, [pi]);
  const [index, setIndex] = useState(0);
  const current = trace.steps[index];

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-400">패턴 전처리 F 배열</p>
        <div className="mt-2 flex flex-wrap gap-1 font-mono text-xs">
          {pi.map((value, idx) => (
            <span key={idx} className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-slate-200">
              F[{idx}] = {value}
            </span>
          ))}
        </div>
      </div>

      <Stepper
        index={index}
        total={trace.steps.length}
        onPrev={() => setIndex((value) => Math.max(0, value - 1))}
        onNext={() => setIndex((value) => Math.min(trace.steps.length - 1, value + 1))}
        onReset={() => setIndex(0)}
        label="KMP"
      />

      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-400">현재 단계</p>
        <p className="mt-1 text-sm text-slate-100">{current.note}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-slate-700/50 px-2 py-1 text-slate-300">
            i = {current.textIndex}
          </span>
          <span className="rounded-full bg-slate-700/50 px-2 py-1 text-slate-300">
            j = {current.patternIndex}
          </span>
          {current.textChar && (
            <span className="rounded-full bg-blue-400/20 px-2 py-1 text-blue-100">
              T[i] = {current.textChar}
            </span>
          )}
          {current.patternChar && (
            <span className="rounded-full bg-emerald-400/20 px-2 py-1 text-emerald-100">
              P[j] = {current.patternChar}
            </span>
          )}
          {current.fallbackTo !== undefined && (
            <span className="rounded-full bg-amber-400/20 px-2 py-1 text-amber-100">
              Fallback → {current.fallbackTo}
            </span>
          )}
          {current.matchPosition !== undefined && (
            <span className="rounded-full bg-fuchsia-400/20 px-2 py-1 text-fuchsia-100">
              발견 위치 {current.matchPosition}
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-400">매치 위치: [{trace.matches.join(", ")}]</p>
    </div>
  );
}

export function BoyerMooreDemo() {
  const trace = useMemo(() => boyerMooreTrace(BM_TEXT, BM_PATTERN), []);
  const [index, setIndex] = useState(0);
  const current = trace.steps[index];

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-400">텍스트 / 패턴</p>
        <p className="mt-1 font-mono text-sm text-slate-200">
          T = {BM_TEXT}
        </p>
        <p className="font-mono text-sm text-slate-200">
          P = {BM_PATTERN}
        </p>
      </div>

      <Stepper
        index={index}
        total={trace.steps.length}
        onPrev={() => setIndex((value) => Math.max(0, value - 1))}
        onNext={() => setIndex((value) => Math.min(trace.steps.length - 1, value + 1))}
        onReset={() => setIndex(0)}
        label="Boyer-Moore"
      />

      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-400">현재 단계</p>
        <p className="mt-1 text-sm text-slate-100">{current.note}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-slate-700/50 px-2 py-1 text-slate-300">
            정렬 위치 {current.alignment}
          </span>
          <span className="rounded-full bg-amber-400/20 px-2 py-1 text-amber-100">
            bad shift {current.badShift}
          </span>
          <span className="rounded-full bg-blue-400/20 px-2 py-1 text-blue-100">
            good shift {current.goodShift}
          </span>
          <span className="rounded-full bg-emerald-400/20 px-2 py-1 text-emerald-100">
            이동 {current.move}
          </span>
          {current.matchPosition !== undefined && (
            <span className="rounded-full bg-fuchsia-400/20 px-2 py-1 text-fuchsia-100">
              발견 위치 {current.matchPosition}
            </span>
          )}
        </div>
        {current.mismatchIndex !== null && current.mismatchIndex !== undefined && (
          <p className="mt-2 text-xs text-slate-300">
            불일치 위치 j={current.mismatchIndex}, T[{current.alignment + current.mismatchIndex}] ={" "}
            {current.textChar}, P[{current.mismatchIndex}] = {current.patternChar}
          </p>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
          <p className="mb-2 text-xs text-slate-400">불일치 문자 테이블</p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(trace.badChar).map(([char, pos]) => (
              <span key={char} className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200">
                {char} → {pos}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
          <p className="mb-2 text-xs text-slate-400">일치 접미부 이동</p>
          <div className="flex flex-wrap gap-1 font-mono text-xs text-slate-200">
            {trace.goodSuffix.map((value, idx) => (
              <span key={idx} className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1">
                shift[{idx}] = {value}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400">매치 위치: [{trace.matches.join(", ")}]</p>
    </div>
  );
}

export function RleDemo() {
  const trace = useMemo(() => rleEncode(RLE_INPUT), []);
  const [view, setView] = useState<"encode" | "decode">("encode");

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {[
          ["encode", "인코딩"],
          ["decode", "디코딩"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setView(id as typeof view)}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              view === id ? "bg-indigo-400 text-slate-950" : "border border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-400">원본 문자열</p>
        <p className="mt-1 font-mono text-sm text-slate-100">{RLE_INPUT}</p>
      </div>

      {view === "encode" ? (
        <div className="rounded-lg border border-indigo-400/30 bg-indigo-400/10 p-3">
          <p className="text-xs text-indigo-200">RLE 인코딩 결과</p>
          <p className="mt-1 font-mono text-sm text-indigo-100">{trace.encoded}</p>
        </div>
      ) : (
        <div className="rounded-lg border border-indigo-400/30 bg-indigo-400/10 p-3">
          <p className="text-xs text-indigo-200">RLE 디코딩 결과</p>
          <p className="mt-1 font-mono text-sm text-indigo-100">{trace.decoded}</p>
        </div>
      )}

      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="mb-2 text-xs text-slate-400">run 목록</p>
        <div className="flex flex-wrap gap-2">
          {trace.runs.map((run, idx) => (
            <span key={idx} className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200">
              ({run.char}, {run.count})
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HuffmanDemo() {
  const trace = useMemo(() => huffmanTrace(HUFFMAN_INPUT), []);
  const [index, setIndex] = useState(0);
  const current = trace.merges[Math.min(index, trace.merges.length - 1)];
  const isFinished = index >= trace.merges.length;

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-400">빈도표</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {trace.frequencies.map((item) => (
            <span key={item.char} className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200">
              {item.char}: {item.freq}
            </span>
          ))}
        </div>
      </div>

      <Stepper
        index={index}
        total={trace.merges.length + 1}
        onPrev={() => setIndex((value) => Math.max(0, value - 1))}
        onNext={() => setIndex((value) => Math.min(trace.merges.length, value + 1))}
        onReset={() => setIndex(0)}
        label="Huffman"
      />

      {!isFinished && current ? (
        <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
          <p className="text-xs text-slate-400">현재 병합</p>
          <p className="mt-1 text-sm text-slate-100">
            {current.left} + {current.right} → {current.parent}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            남은 큐: {current.queue.length ? current.queue.join(", ") : "없음"}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3">
          <p className="text-xs text-emerald-200">허프만 코딩 결과</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(trace.codes).map(([char, code]) => (
              <span key={char} className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-xs text-emerald-100">
                {char} = {code}
              </span>
            ))}
          </div>
          <p className="mt-2 break-all font-mono text-sm text-emerald-100">{trace.encoded}</p>
        </div>
      )}

      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="mb-2 text-xs text-slate-400">접두부 코드 주의</p>
        <p className="text-xs text-slate-300">
          허프만 코딩은 빈도가 높은 문자에 더 짧은 코드를 부여하고, 같은 빈도일 때는 트리 모양이 달라질 수 있다.
        </p>
      </div>
    </div>
  );
}

export function Lz77Demo() {
  const trace = useMemo(() => lz77Trace(LZ77_INPUT, 7, 7), []);
  const [index, setIndex] = useState(0);
  const current = trace.tokens[index];

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-400">문자열</p>
        <p className="mt-1 font-mono text-sm text-slate-100">{LZ77_INPUT}</p>
      </div>

      <Stepper
        index={index}
        total={trace.tokens.length}
        onPrev={() => setIndex((value) => Math.max(0, value - 1))}
        onNext={() => setIndex((value) => Math.min(trace.tokens.length - 1, value + 1))}
        onReset={() => setIndex(0)}
        label="LZ77"
      />

      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-400">슬라이딩 윈도</p>
        <p className="mt-1 font-mono text-sm text-slate-100">
          window = {current.window || "∅"}
        </p>
        <p className="mt-1 font-mono text-sm text-slate-100">
          lookahead = {current.lookahead || "∅"}
        </p>
        <p className="mt-2 text-xs text-slate-300">
          일치 문자열: <span className="font-mono text-slate-100">{current.match || "없음"}</span>
        </p>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-400">현재 triple</p>
        <p className="mt-1 font-mono text-sm text-slate-100">
          ({current.dist}, {current.length}, {current.next || "∅"})
        </p>
        <p className="mt-2 text-xs text-slate-300">
          위치 {current.position}에서 시작하는 부분을 (거리, 길이, 다음 문자)로 변환.
        </p>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="mb-2 text-xs text-slate-400">전체 인코딩 결과</p>
        <div className="flex flex-wrap gap-2">
          {trace.tokens.map((token, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setIndex(idx)}
              className={`rounded-md border px-2 py-1 text-xs transition ${
                idx === index
                  ? "border-fuchsia-300 bg-fuchsia-400 text-slate-950"
                  : "border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
            >
              ({token.dist}, {token.length}, {token.next || "∅"})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ImageCompressionDemo() {
  const [mode, setMode] = useState<"jpeg" | "mpeg">("jpeg");
  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {[
          ["jpeg", "JPEG"],
          ["mpeg", "MPEG"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id as typeof mode)}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              mode === id ? "bg-cyan-400 text-slate-950" : "border border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        {mode === "jpeg" ? (
          <div className="space-y-2 text-sm text-slate-200">
            <p>2차원 이미지는 블록 단위로 나눠 변환과 양자화를 거친 뒤 부호화한다.</p>
            <div className="flex flex-wrap gap-2 text-xs">
              {["블록 분할", "DCT", "양자화", "엔트로피 부호화"].map((item) => (
                <span key={item} className="rounded-full bg-cyan-400/20 px-2 py-1 text-cyan-100">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm text-slate-200">
            <p>3차원 동영상은 시간 축의 중복을 활용하여 프레임 간 차이를 압축한다.</p>
            <div className="flex flex-wrap gap-2 text-xs">
              {["키 프레임", "예측 프레임", "움직임 보상", "차분 부호화"].map((item) => (
                <span key={item} className="rounded-full bg-cyan-400/20 px-2 py-1 text-cyan-100">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function NpTaxonomyDemo() {
  return (
    <div className="space-y-3">
      <div className="grid gap-2 md:grid-cols-2">
        {[
          { title: "P", body: "결정론적 튜링 기계로 다항 시간에 풀 수 있는 판정 문제." },
          { title: "NP", body: "비결정론적 튜링 기계로 다항 시간에 풀 수 있는 판정 문제." },
          { title: "NP-완전", body: "NP에 속하고, NP의 모든 문제가 다항 시간에 변환되는 문제." },
          { title: "NP-하드", body: "NP의 모든 문제가 다항 시간에 변환되는 문제. NP에 속할 필요는 없다." },
        ].map((item) => (
          <div key={item.title} className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
            <p className="text-sm font-semibold text-slate-100">{item.title}</p>
            <p className="mt-1 text-xs text-slate-300">{item.body}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-400">변환(reduction)</p>
        <p className="mt-1 text-sm text-slate-200">
          문제 Q의 입력과 출력을 문제 A의 입력과 출력 형태로 바꿀 수 있으면 Q가 A로 변환된다고 한다.
        </p>
      </div>
      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-400">대표 예시</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {["버텍스 커버", "해밀토니언 사이클", "외판원 문제", "통 채우기 문제"].map((item) => (
            <span key={item} className="rounded-full bg-fuchsia-400/20 px-2 py-1 text-fuchsia-100">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function VertexCoverDemo() {
  const [scenario, setScenario] = useState<"ab" | "bc">("ab");
  const order = scenario === "ab" ? [0, 2] : [1];
  const result = useMemo(() => approximateVertexCover(VC_GRAPH, order), [order]);
  const graph = useMemo(() => renderSelectedSetGraph(VC_GRAPH, result.cover), [result.cover]);

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {[
          ["ab", "첫 간선 (A,B)"],
          ["bc", "첫 간선 (B,C)"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setScenario(id as typeof scenario)}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              scenario === id ? "bg-emerald-400 text-slate-950" : "border border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <GraphView data={graph} />

      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-400">선택된 간선</p>
        <p className="mt-1 text-sm text-slate-200">
          {result.chosenEdges.map((idx) => {
            const edge = VC_GRAPH.edges[idx];
            const left = VC_GRAPH.vertices[edge.from].label ?? edge.from;
            const right = VC_GRAPH.vertices[edge.to].label ?? edge.to;
            return `(${left}, ${right})`;
          }).join(" → ")}
        </p>
        <p className="mt-2 text-xs text-slate-400">버텍스 커버</p>
        <p className="mt-1 font-mono text-sm text-emerald-100">
          {`{${result.cover.map((id) => VC_GRAPH.vertices[id].label ?? id).join(", ")}}`}
        </p>
      </div>
    </div>
  );
}

export function TspDemo() {
  const mst = useMemo(() => kruskalMst(TSP_GRAPH), []);
  const vertices = useMemo(
    () =>
      cloneVerticesWithState(
        TSP_GRAPH.vertices,
        Object.fromEntries(mst.order.map((id) => [id, "visited"] as const)) as Partial<Record<number, GraphVertex["state"]>>,
      ),
    [mst.order],
  );
  const graph: GraphAux = {
    kind: "graph",
    vertices,
    edges: TSP_GRAPH.edges,
    mstEdges: mst.mstEdgeIndices,
    order: mst.order,
    orderLabel: "DFS 순서",
  };
  const routeLabels = [...mst.order, mst.order[0]].map((id) => TSP_GRAPH.vertices[id].label ?? id);

  return (
    <div className="space-y-3">
      <GraphView data={graph} />
      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-400">근사 경로</p>
        <p className="mt-1 font-mono text-sm text-slate-100">
          {routeLabels.join(" → ")}
        </p>
        <p className="mt-2 text-xs text-slate-300">
          MST를 만든 뒤 DFS 순서대로 정점을 나열하고 마지막에 시작 도시로 돌아오는 방식.
        </p>
      </div>
    </div>
  );
}

export function BinPackingDemo() {
  const [strategy, setStrategy] = useState<"first" | "best" | "dfirst" | "dbest">("first");
  const result = useMemo(() => {
    if (strategy === "first") return firstFitBins(BIN_ITEMS, false);
    if (strategy === "best") return bestFitBins(BIN_ITEMS, false);
    if (strategy === "dfirst") return firstFitBins(BIN_ITEMS, true);
    return bestFitBins(BIN_ITEMS, true);
  }, [strategy]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
        {[
          ["first", "최초법"],
          ["best", "최선법"],
          ["dfirst", "감소순 최초법"],
          ["dbest", "감소순 최선법"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setStrategy(id as typeof strategy)}
            className={`rounded-md px-2 py-2 text-xs font-semibold transition ${
              strategy === id ? "bg-cyan-400 text-slate-950" : "border border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-400">물체 순서</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {result.order.map((item) => (
            <span key={item.index} className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200">
              {item.index}({formatBinSize(item.size)})
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-400">사용된 통 수: {result.bins.length}</p>
        <div className="mt-3 space-y-2">
          {result.bins.map((bin, idx) => (
            <div key={idx} className="rounded-md border border-slate-700 bg-slate-900/70 p-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>통 {idx + 1}</span>
                <span>남은 용량 {formatBinSize(1 - bin.load)}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {bin.items.map((item) => (
                  <span key={item.index} className="rounded-md bg-cyan-400/20 px-2 py-1 text-xs text-cyan-100">
                    {item.index}({formatBinSize(item.size)})
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400">
        감소순 변형은 먼저 크기 내림차순으로 정렬한 뒤 최초법/최선법을 적용.
      </p>
    </div>
  );
}
