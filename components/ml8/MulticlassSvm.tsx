"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { multiclassData } from "./svmData";
import { decision, linearKernel, trainSvm, type Vec } from "./svmCore";
import { makeScale, type Frame } from "./plotUtils";

const F: Frame = { xMin: 0, xMax: 8, yMin: 0, yMax: 7.5, width: 320, height: 300, pad: 12 };
const s = makeScale(F);
const COLORS = ["#4f46e5", "#f59e0b", "#10b981"];
const NAMES = ["C₁", "C₂", "C₃"];
const K = 3;
/** 이진 SVM 학습에 쓰는 하이퍼파라미터 c */
const C_BIN = 10;

const OVR = Array.from({ length: K }, (_, k) =>
  trainSvm(
    multiclassData.map((d) => ({ x: d.x, y: d.k === k ? (1 as const) : (-1 as const) })),
    linearKernel,
    C_BIN,
  ),
);

const PAIRS: [number, number][] = [];
for (let a = 0; a < K; a += 1) for (let b = a + 1; b < K; b += 1) PAIRS.push([a, b]);
const OVO = PAIRS.map(([a, b]) =>
  trainSvm(
    multiclassData
      .filter((d) => d.k === a || d.k === b)
      .map((d) => ({ x: d.x, y: d.k === a ? (1 as const) : (-1 as const) })),
    linearKernel,
    C_BIN,
  ),
);

const RES = 48;

type Verdict = { cls: number | null; detail: string; none?: boolean };

function judgeOvr(x: Vec): Verdict {
  const pos = OVR.map((m, k) => (decision(m, x) > 0 ? k : -1)).filter((k) => k >= 0);
  if (pos.length === 1) return { cls: pos[0], detail: `양수인 분류기: ${NAMES[pos[0]]} 하나` };
  if (pos.length === 0) return { cls: null, detail: "양수인 분류기가 없음", none: true };
  return { cls: null, detail: `양수인 분류기가 ${pos.map((k) => NAMES[k]).join(", ")} 둘 이상` };
}

function judgeOvo(x: Vec): Verdict {
  const votes = new Array(K).fill(0);
  OVO.forEach((m, i) => {
    votes[decision(m, x) > 0 ? PAIRS[i][0] : PAIRS[i][1]] += 1;
  });
  const best = Math.max(...votes);
  const winners = votes.map((v, k) => (v === best ? k : -1)).filter((k) => k >= 0);
  const detail = votes.map((v, k) => `${NAMES[k]} ${v}표`).join(" · ");
  return { cls: winners.length === 1 ? winners[0] : null, detail };
}

export default function MulticlassSvm() {
  const [mode, setMode] = useState<"ovr" | "ovo">("ovr");
  const [probe, setProbe] = useState<Vec>([4, 4.2]);
  const [k, setK] = useState(4);

  const cells = useMemo(() => {
    const judge = mode === "ovr" ? judgeOvr : judgeOvo;
    const out: { x: number; y: number; cls: number | null; none: boolean }[] = [];
    const dx = (F.xMax - F.xMin) / RES;
    const dy = (F.yMax - F.yMin) / RES;
    for (let r = 0; r < RES; r += 1) {
      for (let c = 0; c < RES; c += 1) {
        const x = F.xMin + (c + 0.5) * dx;
        const y = F.yMin + (r + 0.5) * dy;
        const v = judge([x, y]);
        out.push({ x, y, cls: v.cls, none: Boolean(v.none) });
      }
    }
    return out;
  }, [mode]);

  const ambiguousShare = cells.filter((c) => c.cls === null).length / cells.length;
  const noneShare = cells.filter((c) => c.none).length / cells.length;
  const cw = (F.width - 2 * F.pad) / RES;
  const ch = (F.height - 2 * F.pad) / RES;
  const shading = useMemo(
    () =>
      cells.map((c, i) => (
        <rect
          key={i}
          x={s.sx(c.x) - cw / 2}
          y={s.sy(c.y) - ch / 2}
          width={cw + 0.4}
          height={ch + 0.4}
          fill={c.cls === null ? "url(#ml8-hatch)" : COLORS[c.cls]}
          opacity={c.cls === null ? 0.9 : 0.16}
        />
      )),
    [cells, cw, ch],
  );
  const verdict = mode === "ovr" ? judgeOvr(probe) : judgeOvo(probe);

  const onPick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const m = svg.getScreenCTM();
    if (!m) return;
    const p = pt.matrixTransform(m.inverse());
    const [x, y] = s.inv(p.x, p.y);
    setProbe([
      Math.max(F.xMin, Math.min(F.xMax, Number(x.toFixed(2)))),
      Math.max(F.yMin, Math.min(F.yMax, Number(y.toFixed(2)))),
    ]);
  };

  return (
    <section>
      <SectionTitle
        title="10.2.3 다중 클래스 분류 문제에 적용"
        subtitle="이진 분류기인 SVM을 여러 개 묶어 k개의 클래스를 나누는 두 가지 방법"
      />

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <Sourced
          refs={{
            textbook: "10.2.3 SVM에 의한 분류 — 1대 나머지 방법",
            slides: "다중 클래스 분류 문제에 적용 방법 — 1대 나머지 방법",
          }}
        >
          <div className="h-full rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/40">
            <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
              1대 나머지 방법 (one-versus-the-rest)
            </p>
            <ul className="mt-2 space-y-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              <li>· 가장 보편적인 방법. k개의 개별적인 이진 SVM 분류기를 만들어 해결</li>
              <li>
                · k번째 분류기는 k번째 클래스와 나머지 (k − 1)개 클래스를 분류 — 클래스 C_k 데이터는
                +1, 나머지 데이터는 −1이 되도록 학습 데이터를 만듦
              </li>
              <li>· 분류: k개의 분류기를 각각 계산한 뒤 양수에 해당하는 클래스로 할당</li>
              <li className="text-rose-700 dark:text-rose-300">
                · 문제: 애매모호한 결정 영역(이론상 하나만 양수여야 하나 실제로는 그렇지 못한 경우),
                학습 데이터 집합의 크기가 불균형
              </li>
            </ul>
          </div>
        </Sourced>
        <Sourced
          refs={{
            textbook: "10.2.3 SVM에 의한 분류 — 1대 1 방법",
            slides: "다중 클래스 분류 문제에 적용 방법 — 1대 1 방법",
          }}
        >
          <div className="h-full rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
            <p className="text-sm font-bold text-amber-700 dark:text-amber-300">1대 1 방법 (one-versus-one)</p>
            <ul className="mt-2 space-y-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              <li>· 가능한 모든 클래스의 쌍에 대해 분류를 수행하는 k(k − 1)/2개의 서로 다른 SVM을 만듦</li>
              <li>· 각 이진 분류기의 결과에 대한 보팅(voting)을 통해 최종 클래스를 결정</li>
              <li className="text-rose-700 dark:text-rose-300">
                · 문제: 최종 클래스가 하나로 정해지지 않는 애매모호한 영역, 학습과 테스트에 계산 비용이
                많이 소요
              </li>
            </ul>
          </div>
        </Sourced>
      </div>

      <Sourced
        refs={{
          textbook: "10.2.3 SVM에 의한 분류 — 다중 클래스 분류",
          slides: "다중 클래스 분류 문제에 적용 방법",
        }}
        className="mb-6"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">세 클래스 데이터에 두 방법 적용</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            k = 3. 각 이진 SVM을 실제로 학습(하이퍼파라미터 c = {C_BIN})한 뒤 평면의 모든 위치를
            판정해 색칠. 회색 빗금은 클래스가 하나로 정해지지 않는 애매한 영역. 그림을 누르면 그
            위치의 판정 과정을 보여 줌.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["ovr", `1대 나머지 — 분류기 ${K}개`],
                ["ovo", `1대 1 — 분류기 ${(K * (K - 1)) / 2}개 + 보팅`],
              ] as const
            ).map(([m, lbl]) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === m
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
            <svg
              viewBox={`0 0 ${F.width} ${F.height}`}
              className="w-full cursor-crosshair rounded-lg border border-gray-100 dark:border-gray-800"
              onClick={onPick}
            >
              <defs>
                <pattern id="ml8-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="6" height="6" fill="#f1f5f9" />
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#94a3b8" strokeWidth="1.2" />
                </pattern>
              </defs>
              <rect x={0} y={0} width={F.width} height={F.height} fill="#ffffff" />
              {shading}
              {multiclassData.map((d, i) => (
                <circle
                  key={i}
                  cx={s.sx(d.x[0])}
                  cy={s.sy(d.x[1])}
                  r={4.2}
                  fill={COLORS[d.k]}
                  stroke="#fff"
                  strokeWidth="1"
                />
              ))}
              <circle cx={s.sx(probe[0])} cy={s.sy(probe[1])} r={6} fill="none" stroke="#0f172a" strokeWidth="2" />
              <line x1={s.sx(probe[0]) - 9} y1={s.sy(probe[1])} x2={s.sx(probe[0]) + 9} y2={s.sy(probe[1])} stroke="#0f172a" />
              <line x1={s.sx(probe[0])} y1={s.sy(probe[1]) - 9} x2={s.sx(probe[0])} y2={s.sy(probe[1]) + 9} stroke="#0f172a" />
            </svg>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-3 text-xs">
                {NAMES.map((n, i) => (
                  <span key={n} className="inline-flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    {n}
                  </span>
                ))}
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-xs leading-6 dark:bg-gray-800/60">
                <p className="font-mono">
                  x = ({probe[0]}, {probe[1]})
                </p>
                {mode === "ovr" ? (
                  OVR.map((m, kk) => {
                    const g = decision(m, probe);
                    return (
                      <p key={kk} className="font-mono">
                        {NAMES[kk]} 대 나머지: g = {g.toFixed(2)} {g > 0 ? "(양수)" : "(음수)"}
                      </p>
                    );
                  })
                ) : (
                  OVO.map((m, i) => {
                    const g = decision(m, probe);
                    const [a, b] = PAIRS[i];
                    return (
                      <p key={i} className="font-mono">
                        {NAMES[a]} 대 {NAMES[b]}: g = {g.toFixed(2)} → {NAMES[g > 0 ? a : b]}에 1표
                      </p>
                    );
                  })
                )}
                <p className="mt-1">{verdict.detail}</p>
                <p className="font-bold">
                  판정:{" "}
                  {verdict.cls === null ? (
                    <span className="text-rose-600">애매한 영역 — 클래스를 하나로 정할 수 없음</span>
                  ) : (
                    <span style={{ color: COLORS[verdict.cls] }}>{NAMES[verdict.cls]}</span>
                  )}
                </p>
              </div>
              <p className="rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-gray-600 dark:bg-slate-900/60 dark:text-gray-400">
                이 데이터에서 애매한 영역은 그림 전체의 {(ambiguousShare * 100).toFixed(1)}%.{" "}
                {mode === "ovr"
                  ? `양수인 분류기가 하나도 없는 곳이 ${(noneShare * 100).toFixed(1)}%, 둘 이상인 곳이 ${((ambiguousShare - noneShare) * 100).toFixed(1)}%.`
                  : "보팅이 1표씩 갈리는 곳만 애매한 영역이 되는데, 이 데이터처럼 클래스가 고르게 떨어져 있으면 세 경계가 거의 한 점에서 만나 그 영역이 거의 생기지 않음. 클래스가 더 많거나 겹쳐 있으면 애매한 영역이 나타날 수 있음."}
              </p>
            </div>
          </div>
        </div>
      </Sourced>

      <Sourced
        refs={{
          textbook: "10.2.3 SVM에 의한 분류 — 1대 나머지·1대 1 방법",
          slides: "다중 클래스 분류 문제에 적용 방법",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-base font-bold">클래스 수 k에 따른 필요한 SVM의 개수</h3>
          <label className="mt-3 flex items-center gap-3 text-sm">
            <span className="shrink-0 font-bold">k</span>
            <input
              type="range"
              min={2}
              max={10}
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              className="min-w-0 flex-1 accent-indigo-600"
            />
            <span className="w-8 text-right font-mono">{k}</span>
          </label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-indigo-50 p-3 text-center dark:bg-indigo-950/40">
              <p className="text-[11px] text-gray-500">1대 나머지 = k</p>
              <p className="font-mono text-2xl font-bold text-indigo-700 dark:text-indigo-300">{k}</p>
              <p className="text-[11px] text-gray-500">각 분류기가 전체 데이터로 학습 (+1은 한 클래스뿐)</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3 text-center dark:bg-amber-950/30">
              <p className="text-[11px] text-gray-500">1대 1 = k(k − 1)/2</p>
              <p className="font-mono text-2xl font-bold text-amber-700 dark:text-amber-300">
                {(k * (k - 1)) / 2}
              </p>
              <p className="text-[11px] text-gray-500">
                {k}×{k - 1}/2 — 테스트 때도 이만큼 계산해 보팅
              </p>
            </div>
          </div>
        </div>
      </Sourced>
    </section>
  );
}
