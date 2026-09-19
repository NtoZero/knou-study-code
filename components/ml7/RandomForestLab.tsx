"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { GridPlot, RegressionPlot, gridCenters, sampleXs } from "./plots";
import {
  NOISY_FLIP,
  NOISY_SEED,
  SINE_SEED,
  VALID_SEED,
  buildForest,
  makeDiagonalData,
  makeSineData,
  predict,
} from "./treeCore";

const M_MAX = 100;
const QUICK = [1, 3, 10, 100];
const RES = 60;
const CENTERS = gridCenters(RES);

/* 분류 — 그림 9-12 형태: 노이즈가 섞인 더 많은 데이터 */
const TRAIN = makeDiagonalData(300, NOISY_SEED, NOISY_FLIP);
const VALID = makeDiagonalData(300, VALID_SEED, NOISY_FLIP);

/* 회귀 — 그림 9-13 형태: 그림 9-9와 같은 데이터 */
const SINE = makeSineData(80, SINE_SEED);
const XS = sampleXs();

function Slider({ m, setM }: { m: number; setM: (v: number) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold">
        결정 트리의 수 M = <span className="font-mono text-emerald-600 dark:text-emerald-400">{m}</span>
      </span>
      <input
        type="range"
        min={1}
        max={M_MAX}
        value={m}
        onChange={(e) => setM(Number(e.target.value))}
        className="min-w-[140px] flex-1 accent-emerald-600"
        aria-label="결정 트리의 수 M"
      />
      <div className="flex gap-1">
        {QUICK.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setM(v)}
            className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${
              m === v
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RandomForestLab() {
  const [mc, setMc] = useState(1);
  const [mr, setMr] = useState(1);

  /** 트리마다 격자·검증 데이터 예측을 미리 계산해 두고 M에 따라 앞에서부터 합친다 */
  const cls = useMemo(() => {
    const forest = buildForest(TRAIN, "classification", M_MAX, Infinity, 77);
    const gridPred = forest.trees.map((t) => CENTERS.map((c) => predict(t, c)));
    const validPred = forest.trees.map((t) => VALID.map((d) => predict(t, d.x)));
    // M = 1…100일 때의 검증 분류율 (보팅, 동수이면 C₁)
    const votes = new Array(VALID.length).fill(0);
    const accByM: number[] = [];
    for (let m = 0; m < M_MAX; m += 1) {
      validPred[m].forEach((p, i) => (votes[i] += p));
      const M = m + 1;
      accByM.push(VALID.filter((d, i) => (votes[i] * 2 > M ? 1 : 0) === d.y).length / VALID.length);
    }
    return { gridPred, accByM };
  }, []);

  const reg = useMemo(() => {
    const forest = buildForest(SINE, "regression", M_MAX, Infinity, 3);
    return forest.trees.map((t) => XS.map((x) => predict(t, [x])));
  }, []);

  const grid = useMemo(
    () =>
      CENTERS.map((_, k) => {
        let v = 0;
        for (let m = 0; m < mc; m += 1) v += cls.gridPred[m][k];
        return v * 2 > mc ? 1 : 0;
      }),
    [cls, mc],
  );

  const regYs = useMemo(
    () =>
      XS.map((_, k) => {
        let s = 0;
        for (let m = 0; m < mr; m += 1) s += reg[m][k];
        return s / mr;
      }),
    [reg, mr],
  );
  /** 그림 9-9 데이터를 만든 곡선 sin x와의 평균 제곱 차이 */
  const truthErr = regYs.reduce((s, y, i) => s + (y - Math.sin(XS[i])) ** 2, 0) / XS.length;
  const quickErr = useMemo(
    () =>
      QUICK.map(
        (m) =>
          XS.reduce((s, x, k) => {
            let a = 0;
            for (let j = 0; j < m; j += 1) a += reg[j][k];
            return s + (a / m - Math.sin(x)) ** 2;
          }, 0) / XS.length,
      ),
    [reg],
  );

  const AW = 280;
  const AH = 110;
  const ax = (m: number) => 30 + ((m - 1) / (M_MAX - 1)) * (AW - 40);
  const minA = Math.min(...cls.accByM);
  const maxA = Math.max(...cls.accByM);
  const ay = (a: number) => 10 + ((maxA - a) / Math.max(1e-6, maxA - minA)) * (AH - 34);
  const accPath = cls.accByM.map((a, i) => `${i === 0 ? "M" : "L"}${ax(i + 1).toFixed(1)},${ay(a).toFixed(1)}`).join(" ");

  return (
    <section>
      <SectionTitle
        title="⑼ 랜덤 포레스트를 이용한 분류와 회귀"
        subtitle="결정 트리의 수 M이 증가함에 따라 정교한 결정경계, 일반화 성능 향상"
      />

      <Sourced
        className="mb-6"
        refs={{
          textbook: "9.2.2 그림 9-12 분류 문제에 적용된 랜덤 포레스트의 예",
          slides: "랜덤 포레스트를 이용한 분류",
          lecture: "트리 하나일 때 생기는 복잡한 섬 모양 영역은 과다적합이고, 100개일 때는 실제 결정경계와 거의 비슷해진다는 점을 그림으로 비교함",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-1 text-base font-bold">분류 — 보팅으로 결합</h3>
          <p className="mb-3 text-xs text-gray-500">
            학습 데이터 300개(레이블 노이즈 약 {Math.round(NOISY_FLIP * 100)}%), 각 트리는 복원추출로 뽑은 300개로 모든
            리프가 순수해질 때까지 학습. 빨간 점선이 실제 결정경계 x₁ = x₂.
          </p>
          <Slider m={mc} setM={setMc} />
          <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
            <div className="flex justify-center">
              <GridPlot grid={grid} res={RES} data={TRAIN} />
            </div>
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <svg viewBox={`0 0 ${AW} ${AH}`} className="w-full min-w-[260px] max-w-[420px]" role="img" aria-label="M에 따른 검증 분류율">
                  <path d={accPath} fill="none" stroke="#059669" strokeWidth={2} />
                  <line x1={ax(mc)} y1={8} x2={ax(mc)} y2={AH - 22} stroke="#0f172a" strokeDasharray="3 3" opacity={0.5} />
                  <circle cx={ax(mc)} cy={ay(cls.accByM[mc - 1])} r={4} fill="#047857" />
                  <text x={ax(1)} y={AH - 8} fontSize={9} className="fill-gray-400">
                    M = 1
                  </text>
                  <text x={ax(M_MAX)} y={AH - 8} textAnchor="end" fontSize={9} className="fill-gray-400">
                    M = 100
                  </text>
                  <text x={4} y={ay(maxA) + 3} fontSize={8} className="fill-gray-400">
                    {(maxA * 100).toFixed(0)}%
                  </text>
                  <text x={4} y={ay(minA) + 3} fontSize={8} className="fill-gray-400">
                    {(minA * 100).toFixed(0)}%
                  </text>
                </svg>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                검증 데이터 300개(학습에 쓰지 않음) 분류율:{" "}
                <strong className="font-mono text-emerald-700 dark:text-emerald-300">
                  {(cls.accByM[mc - 1] * 100).toFixed(1)}%
                </strong>
                {"  "}(M = 1: {(cls.accByM[0] * 100).toFixed(1)}% → M = 100: {(cls.accByM[M_MAX - 1] * 100).toFixed(1)}%)
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[260px] text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700">
                      {QUICK.map((m) => (
                        <th key={m} className="py-1 text-right">
                          M = {m}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="font-mono">
                      {QUICK.map((m) => (
                        <td key={m} className="py-1 text-right">
                          {(cls.accByM[m - 1] * 100).toFixed(1)}%
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="rounded-lg bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                M이 커질수록 노이즈 점을 감싸던 작은 섬들이 사라지고 경계가 실제 결정경계에 가까워짐 → 정교한
                결정경계, 일반화 성능 향상. 트리 수에 따라 조금씩 오르내리지만 전체 경향은 상승.
              </p>
            </div>
          </div>
        </div>
      </Sourced>

      <Sourced
        refs={{
          textbook: "9.2.2 그림 9-13 회귀 문제에 적용된 랜덤 포레스트의 예",
          slides: "랜덤 포레스트를 이용한 회귀",
        }}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-1 text-base font-bold">회귀 — 출력값의 평균으로 결합</h3>
          <p className="mb-3 text-xs text-gray-500">
            ⑹의 데이터 80개. 각 트리는 끝까지(과다적합될 만큼) 깊게 학습. M개 트리 출력의 평균이 회귀함수.
          </p>
          <Slider m={mr} setM={setMr} />
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
            <div className="overflow-x-auto">
              <RegressionPlot data={SINE} xs={XS} ys={regYs} showTruth />
            </div>
            <div className="space-y-2 text-xs">
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
                <p>
                  데이터를 만든 곡선 y = sin x(빨간 점선)와의 평균 제곱 차이:{" "}
                  <strong className="font-mono">{truthErr.toFixed(4)}</strong>
                </p>
                <div className="mt-2 grid grid-cols-4 gap-1 text-center font-mono">
                  {QUICK.map((m, i) => (
                    <div key={m} className="rounded bg-white p-1 dark:bg-gray-900">
                      <p className="text-[10px] text-gray-500">M={m}</p>
                      <p>{quickErr[i].toFixed(3)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="rounded-lg bg-emerald-50 p-3 leading-relaxed text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                깊이를 늘린 단일 결정 트리(⑹의 깊이 6 이상)는 노이즈 점마다 뾰족하게 튀었지만, 트리 수 M이 늘면
                튀는 부분이 평균으로 눌려 과다적합이 많이 완화되고 회귀함수가 정교해짐.
              </p>
            </div>
          </div>
        </div>
      </Sourced>
    </section>
  );
}
