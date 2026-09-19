"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Lightbulb, AlertTriangle, Box, ListChecks } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { WASH_DATA, type Amount, type Machine, type Weather } from "./treeCore";

/* 그림 9-1의 결정 트리 — 노드 id와 좌표 */
type NodeId = "root" | "hum" | "rainy" | "amt" | "humT" | "humF" | "amtL" | "amtS";

interface DrawNode {
  id: NodeId;
  x: number;
  y: number;
  label: string;
  kind: "root" | "internal" | "leaf";
  out?: Machine;
}

const NODES: DrawNode[] = [
  { id: "root", x: 260, y: 40, label: "Weather", kind: "root" },
  { id: "hum", x: 105, y: 140, label: "Humidity < 80", kind: "internal" },
  { id: "rainy", x: 260, y: 140, label: "OFF", kind: "leaf", out: "OFF" },
  { id: "amt", x: 415, y: 140, label: "Amount", kind: "internal" },
  { id: "humT", x: 50, y: 245, label: "ON", kind: "leaf", out: "ON" },
  { id: "humF", x: 160, y: 245, label: "OFF", kind: "leaf", out: "OFF" },
  { id: "amtL", x: 360, y: 245, label: "ON", kind: "leaf", out: "ON" },
  { id: "amtS", x: 470, y: 245, label: "OFF", kind: "leaf", out: "OFF" },
];

const EDGES: { from: NodeId; to: NodeId; label: string }[] = [
  { from: "root", to: "hum", label: "Sunny" },
  { from: "root", to: "rainy", label: "Rainy" },
  { from: "root", to: "amt", label: "Cloudy" },
  { from: "hum", to: "humT", label: "True" },
  { from: "hum", to: "humF", label: "False" },
  { from: "amt", to: "amtL", label: "Large" },
  { from: "amt", to: "amtS", label: "Small" },
];

const RULES: { text: string; leaf: NodeId }[] = [
  { text: "If (Weather == Rainy) then Machine = OFF", leaf: "rainy" },
  { text: "If (Weather == Sunny) and (Humidity < 80) then Machine = ON", leaf: "humT" },
  { text: "If (Weather == Sunny) and (Humidity >= 80) then Machine = OFF", leaf: "humF" },
  { text: "If (Weather == Cloudy) and (Amount == Large) then Machine = ON", leaf: "amtL" },
  { text: "If (Weather == Cloudy) and (Amount == Small) then Machine = OFF", leaf: "amtS" },
];

/** 루트에서 속성값에 따라 가지를 골라 내려가며 지나는 노드들 */
function tracePath(w: Weather, h: number, a: Amount): NodeId[] {
  if (w === "Rainy") return ["root", "rainy"];
  if (w === "Sunny") return ["root", "hum", h < 80 ? "humT" : "humF"];
  return ["root", "amt", a === "Large" ? "amtL" : "amtS"];
}

const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<NodeId, DrawNode>;

function outOf(path: NodeId[]): Machine {
  return nodeById[path[path.length - 1]].out ?? "OFF";
}

export default function DecisionTreeConcept() {
  const [weather, setWeather] = useState<Weather>("Sunny");
  const [humidity, setHumidity] = useState(60);
  const [amount, setAmount] = useState<Amount>("Small");
  const [showParts, setShowParts] = useState(true);
  const [pickedRow, setPickedRow] = useState<number | null>(null);

  const path = useMemo(() => tracePath(weather, humidity, amount), [weather, humidity, amount]);
  const onPath = (id: NodeId) => path.includes(id);
  const result = outOf(path);
  const firedRule = RULES.find((r) => r.leaf === path[path.length - 1]);

  const tableCheck = useMemo(
    () =>
      WASH_DATA.map((r) => {
        const p = tracePath(r.weather, r.humidity, r.amount);
        return { row: r, pred: outOf(p), ok: outOf(p) === r.label };
      }),
    [],
  );
  const allCorrect = tableCheck.every((c) => c.ok);

  const pickRow = (i: number) => {
    const r = WASH_DATA[i];
    setWeather(r.weather);
    setHumidity(r.humidity);
    setAmount(r.amount);
    setPickedRow(i);
  };

  const kindColor = (n: DrawNode) => {
    if (n.kind === "leaf") return n.out === "ON" ? "#059669" : "#e11d48";
    return n.kind === "root" ? "#0f766e" : "#0d9488";
  };

  return (
    <section>
      <SectionTitle
        title="⑴ 결정 트리의 개념"
        subtitle="주어진 문제에 관해 결정을 내리는 함수를 트리 형태로 구성한 것"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Sourced
          className="md:col-span-3"
          refs={{
            textbook: "9.1.1 결정 트리 개요",
            slides: "결정 트리 decision tree",
          }}
        >
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/40">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wide text-emerald-700 dark:text-emerald-300">
              <GitBranch size={14} />
              결정 트리 decision tree
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              <strong>주어진 문제(또는 입력)에 관해 결정을 내리는 함수를 트리 형태로 구성한 것.</strong>{" "}
              결정사항이 주로 몇 가지 선택지 중 하나가 되는 경우가 많아 기본적으로{" "}
              <strong>분류 문제</strong>를 위해 개발되었고, 이후 <strong>회귀 문제</strong>로
              확장되어 <strong className="text-emerald-700 dark:text-emerald-300">CART</strong>
              (Classification And Regression Trees)라는 이름으로도 불림.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              트리 구조를 이용한 데이터 분석으로 분류나 회귀를 수행하는 방식 — 베이즈 분류기,
              K-최근접이웃 분류기, 신경망, SVM과는 다른 독특한 방식이며 여기서 결정 트리만의 고유한
              특성이 나옴.
            </p>
          </div>
        </Sourced>

        <Sourced
          className="flex flex-col"
          refs={{
            textbook: "9장 도입 — 결정 트리의 설명력",
            slides: "결정 트리 — 뛰어난 설명 능력 제공",
            lecture: "신경망·딥러닝은 안에서 무슨 처리가 일어나는지 알기 어려운 블랙박스로 보는 것과 대비함",
          }}
        >
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-300">
              <Lightbulb size={15} /> 장점 — 뛰어난 설명 능력
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              학습으로 얻은 트리 구조에 데이터의 각 입력 요소의 역할이 잘 나타나, 학습 결과가 왜
              나왔는지 설명 가능. 이를 결과에 대한 <strong>설명력(explainability)</strong>이라 함.
            </p>
          </div>
        </Sourced>

        <Sourced
          className="flex flex-col"
          refs={{
            textbook: "9장 도입 — 블랙박스 형태의 분류기",
            slides: "결정 트리 — 뛰어난 설명 능력 제공",
          }}
        >
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300">
              <Box size={15} /> 대비 — 블랙박스 형태의 분류기
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              신경망과 같은 분류기는 입력이 주어지면 결과가 나올 뿐, 내부에서 어떤 처리가 일어나
              그 결과가 나왔는지 이해하기 어려움. 결정 트리의 설명력은 블랙박스 형태의 분류기가
              갖추지 못한 장점.
            </p>
          </div>
        </Sourced>

        <Sourced
          className="flex flex-col"
          refs={{
            textbook: "9장 도입 — 노이즈에 민감해지는 문제",
            slides: "결정 트리 — 과다적합 문제 발생",
          }}
        >
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="flex items-center gap-1.5 text-sm font-bold text-rose-600 dark:text-rose-400">
              <AlertTriangle size={15} /> 단점 — 과다적합 문제
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              간단한 문제에는 잘 적용되지만, 복잡한 함수를 표현하려면 트리의 깊이가 깊어져야 하고
              그 과정에서 데이터의 노이즈에 민감해짐 → 앙상블 학습 기법을 결합한{" "}
              <strong>랜덤 포레스트</strong> 등장.
            </p>
          </div>
        </Sourced>
      </div>

      {/* 그림 9-1 인터랙티브 */}
      <Sourced
        className="mb-6"
        refs={{
          textbook: "9.1.1 그림 9-1 세탁기 동작 여부 결정",
          slides: "결정 트리 — 세탁기의 동작 여부 예",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold">세탁기를 돌릴까? — 트리를 따라 내려가 보기</h3>
            <label className="flex items-center gap-1.5 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={showParts}
                onChange={(e) => setShowParts(e.target.checked)}
                className="accent-emerald-600"
              />
              구성 요소 이름 표시
            </label>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_260px]">
            <div className="overflow-x-auto">
              <svg viewBox="0 0 520 290" className="min-w-[460px] w-full" role="img" aria-label="세탁기 결정 트리">
                {EDGES.map((e) => {
                  const a = nodeById[e.from];
                  const b = nodeById[e.to];
                  const active = onPath(e.from) && onPath(e.to);
                  return (
                    <g key={`${e.from}-${e.to}`}>
                      <line
                        x1={a.x}
                        y1={a.y + 16}
                        x2={b.x}
                        y2={b.y - 16}
                        stroke={active ? "#059669" : "#cbd5e1"}
                        strokeWidth={active ? 3 : 1.5}
                      />
                      <text
                        x={(a.x + b.x) / 2 + (b.x < a.x ? -8 : b.x > a.x ? 8 : 6)}
                        y={(a.y + b.y) / 2 + 2}
                        textAnchor={b.x < a.x ? "end" : b.x > a.x ? "start" : "start"}
                        className={active ? "fill-emerald-700 dark:fill-emerald-300" : "fill-gray-500"}
                        fontSize={11}
                        fontWeight={active ? 700 : 500}
                      >
                        {e.label}
                      </text>
                    </g>
                  );
                })}
                {NODES.map((n) => {
                  const active = onPath(n.id);
                  const w = n.kind === "leaf" ? 52 : n.label.length * 7.2 + 22;
                  return (
                    <g key={n.id}>
                      <motion.rect
                        x={n.x - w / 2}
                        y={n.y - 16}
                        width={w}
                        height={32}
                        rx={n.kind === "leaf" ? 6 : 16}
                        fill={active ? kindColor(n) : "#ffffff"}
                        stroke={kindColor(n)}
                        strokeWidth={active ? 2.5 : 1.5}
                        animate={{ opacity: active ? 1 : 0.85 }}
                      />
                      <text
                        x={n.x}
                        y={n.y + 4}
                        textAnchor="middle"
                        fontSize={12}
                        fontWeight={700}
                        fill={active ? "#ffffff" : kindColor(n)}
                      >
                        {n.label}
                      </text>
                    </g>
                  );
                })}
                {showParts && (
                  <g fontSize={10} className="fill-gray-500">
                    <text x={330} y={30}>← 루트 노드 (속성)</text>
                    <text x={470} y={112} textAnchor="middle">내부 노드 (속성)</text>
                    <text x={290} y={205}>← 가지 (속성값)</text>
                    <text x={260} y={284} textAnchor="middle">리프 노드 (최종 결정 결과)</text>
                  </g>
                )}
              </svg>
            </div>

            <div className="space-y-3">
              <div>
                <p className="mb-1 text-xs font-semibold text-gray-500">날씨 Weather</p>
                <div className="flex gap-1">
                  {(["Sunny", "Rainy", "Cloudy"] as Weather[]).map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => {
                        setWeather(w);
                        setPickedRow(null);
                      }}
                      className={`flex-1 rounded-md border px-2 py-1 text-xs font-semibold ${
                        weather === w
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-gray-200 text-gray-600 hover:border-emerald-300 dark:border-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1 flex justify-between text-xs font-semibold text-gray-500">
                  <span>습도 Humidity</span>
                  <span className="font-mono text-gray-700 dark:text-gray-200">{humidity}</span>
                </p>
                <input
                  type="range"
                  min={40}
                  max={100}
                  value={humidity}
                  onChange={(e) => {
                    setHumidity(Number(e.target.value));
                    setPickedRow(null);
                  }}
                  className="w-full accent-emerald-600"
                  aria-label="습도"
                />
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold text-gray-500">세탁량 Amount</p>
                <div className="flex gap-1">
                  {(["Large", "Small"] as Amount[]).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => {
                        setAmount(a);
                        setPickedRow(null);
                      }}
                      className={`flex-1 rounded-md border px-2 py-1 text-xs font-semibold ${
                        amount === a
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-gray-200 text-gray-600 hover:border-emerald-300 dark:border-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div
                className={`rounded-lg p-3 text-center ${
                  result === "ON"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                }`}
              >
                <p className="text-[11px] font-semibold opacity-80">세탁기 동작 여부</p>
                <p className="text-2xl font-black">{result}</p>
              </div>
              <p className="text-[11px] leading-relaxed text-gray-500">
                지나온 경로:{" "}
                {path.map((id) => nodeById[id].label).join(" → ")}
                {weather !== "Sunny" && " · 습도는 이 경로에서 쓰이지 않음"}
                {weather === "Rainy" && " · 세탁량도 쓰이지 않음"}
              </p>
            </div>
          </div>

          <p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
            <strong>루트 노드와 내부 노드</strong>는 판단에 사용하는 결정 요인(<strong>속성</strong>)에 대응되며, 그 요인의
            값에 따라 <strong>가지</strong>가 나뉨. 루트 노드에서 시작해 속성값에 따라 가지를 선택해 내려가는 과정을
            반복해 도달하는 <strong>리프 노드</strong>가 최종 결정 결과(ON 또는 OFF).
          </p>
        </div>
      </Sourced>

      {/* 결정 트리 vs 규칙 */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Sourced
          className="flex flex-col"
          refs={{
            textbook: "9.1.1 결정 트리와 규칙의 집합",
            slides: "결정 트리 vs 규칙 기반의 표현",
          }}
        >
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="mb-2 text-sm font-bold">규칙(IF ~ THEN ~)의 집합으로의 표현</p>
            <div className="overflow-x-auto">
              <div className="min-w-[420px] space-y-1 font-mono text-[11px]">
                {RULES.map((r) => {
                  const on = firedRule?.leaf === r.leaf;
                  return (
                    <p
                      key={r.text}
                      className={`rounded px-2 py-1 transition-colors ${
                        on
                          ? "bg-emerald-100 font-bold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
                          : "text-gray-500"
                      }`}
                    >
                      {r.text}
                    </p>
                  );
                })}
              </div>
            </div>
            <p className="mt-2 text-[11px] text-gray-500">
              위 트리에서 선택한 입력에 해당하는 규칙이 강조됨 — 리프 노드 하나가 규칙 하나.
            </p>
          </div>
        </Sourced>

        <Sourced
          className="flex flex-col"
          refs={{
            textbook: "9.1.1 결정 트리와 규칙의 집합",
            slides: "결정 트리 vs 규칙 기반의 표현",
            lecture: "문제가 작으면 트리든 규칙이든 별 차이가 없지만, 문제가 커지면 개발자가 규칙을 일일이 정의하기 어렵다는 점을 강조",
          }}
        >
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="mb-3 text-sm font-bold">결정 트리가 규칙의 집합과 다른 점</p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px] text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700">
                    <th className="py-1.5 pr-2"></th>
                    <th className="py-1.5 pr-2">규칙 기반의 표현</th>
                    <th className="py-1.5">결정 트리</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 pr-2 font-semibold text-gray-500">만드는 주체</td>
                    <td className="py-2 pr-2">개발자·전문가가 임의로 규칙을 정의하고 표현</td>
                    <td className="py-2 font-semibold text-emerald-700 dark:text-emerald-300">
                      데이터를 이용한 학습으로 자동으로 트리 생성
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-2 font-semibold text-gray-500">문제 규모</td>
                    <td className="py-2 pr-2">간단한 문제는 사용자가 쉽게 정의 가능</td>
                    <td className="py-2">
                      사용자가 일일이 규칙을 만들 수 있는 범위를 넘어서는 문제 → 학습 과정이 반드시 필요
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              핵심은 트리를 얻어 내는 과정이 <strong>학습</strong>으로 진행된다는 점. 학습이 끝나 트리가 만들어진 뒤
              새로 주어지는 입력값에 대해 트리로 결정을 내리는 과정이 학습 시스템을 이용한{" "}
              <strong>추론</strong> 과정.
            </p>
          </div>
        </Sourced>
      </div>

      {/* 표 9-1 */}
      <Sourced
        refs={{
          textbook: "9.1.1 표 9-1 세탁기의 동작 여부 결정을 위한 데이터 예",
          slides: "결정 트리의 학습 — 학습 데이터의 예",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-base font-bold">
              <ListChecks size={16} className="text-emerald-500" />
              학습 데이터 14개 — 행을 누르면 위 트리에 입력
            </h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                allCorrect
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              트리 출력 = 표의 동작 여부 {tableCheck.filter((c) => c.ok).length}/14
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700">
                  <th className="py-1.5 text-left">#</th>
                  <th className="py-1.5 text-left">날씨 Weather</th>
                  <th className="py-1.5 text-left">온도 Temperature</th>
                  <th className="py-1.5 text-right">습도 Humidity</th>
                  <th className="py-1.5 pl-3 text-left">세탁량 Amount</th>
                  <th className="py-1.5 text-center">동작 여부</th>
                  <th className="py-1.5 text-center">트리 출력</th>
                </tr>
              </thead>
              <tbody>
                {tableCheck.map((c, i) => (
                  <tr
                    key={c.row.no}
                    onClick={() => pickRow(i)}
                    className={`cursor-pointer border-b border-gray-100 transition-colors dark:border-gray-800 ${
                      pickedRow === i
                        ? "bg-emerald-50 dark:bg-emerald-950/40"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/60"
                    }`}
                  >
                    <td className="py-1.5 text-gray-400">{c.row.no}</td>
                    <td className="py-1.5">{c.row.weather}</td>
                    <td className="py-1.5 text-gray-400">{c.row.temperature}</td>
                    <td className="py-1.5 text-right font-mono">{c.row.humidity}</td>
                    <td className="py-1.5 pl-3">{c.row.amount}</td>
                    <td className="py-1.5 text-center">
                      <span
                        className={`rounded px-1.5 py-0.5 font-bold ${
                          c.row.label === "ON"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                        }`}
                      >
                        {c.row.label}
                      </span>
                    </td>
                    <td className="py-1.5 text-center font-bold text-gray-500">{c.pred}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            판단의 기준이 되는 속성들(날씨, 온도, 습도, 세탁량)의 값과 그에 따른 동작 여부(ON/OFF)가 주어지면, 이를
            이용해 그림 9-1과 같은 트리를 만듦. 완성된 트리는 온도(회색 열)를 전혀 쓰지 않고도 14개 모두를 표의 값대로
            결정함.
          </p>
        </div>
      </Sourced>
    </section>
  );
}
