"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import {
  Card,
  CardTitle,
  ComputedNote,
  ConceptRows,
  Formula,
  Hint,
  P,
  Scroller,
  Slider,
  fmtQ,
} from "./ui";

/**
 * 14.2.1 Q-학습 — 결정론적 모델과 비결정론적 모델, 신뢰 요소 α를 가진 갱신 규칙 (식 14-18).
 * 갱신식의 두 형태가 같은 값을 낸다는 것은 식을 전개한 결과이고,
 * 아래 그래프의 목표값 시퀀스(1과 0)는 이 화면에서 정한 것이다.
 */

// 같은 (s, a)를 반복해도 다음 상태가 달라져 r + γ max Q̂(s′, a′)가 매번 바뀌는 상황 — 화면에서 정한 값
const TARGETS = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1];

function trajectory(alpha: number): number[] {
  const out = [0];
  let q = 0;
  for (const y of TARGETS) {
    q = (1 - alpha) * q + alpha * y;
    out.push(q);
  }
  return out;
}

export default function NonDeterministicLab() {
  const [alpha, setAlpha] = useState(0.2);
  const [qOld, setQOld] = useState(0.5);
  const [target, setTarget] = useState(0.9);

  const formA = (1 - alpha) * qOld + alpha * target;
  const formB = qOld + alpha * (target - qOld);

  const det = useMemo(() => trajectory(1), []);
  const soft = useMemo(() => trajectory(alpha), [alpha]);

  const W = 440;
  const H = 150;
  const px = (i: number) => 30 + (i / TARGETS.length) * (W - 40);
  const py = (v: number) => H - 20 - v * (H - 35);
  const line = (arr: number[]) => arr.map((v, i) => `${px(i)},${py(v)}`).join(" ");

  return (
    <section id="non-deterministic" className="scroll-mt-32">
      <SectionTitle
        title="비결정론적 환경 — 신뢰 요소 α"
        subtitle="같은 행동을 해도 결과가 달라질 때, 새 정보를 얼마나 믿을 것인가"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "14.2.1 Q-학습 — 결정론적 모델과 비결정론적 모델", slides: "비결정론적 환경" }}>
          <Card>
            <CardTitle>결정론적 모델 vs 비결정론적 모델</CardTitle>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[12px] font-bold text-gray-800 dark:text-gray-100">
                  결정론적 deterministic 모델
                </p>
                <ul className="mt-1 space-y-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                  <li>• 모델의 출력과 행동이 어떤 임의성도 없이 초기 조건과 파라미터에 의해서만 전적으로 결정</li>
                  <li>• 확률적 불확실성이 존재하지 않음</li>
                  <li className="text-gray-500">예: 앞의 4×4 미로 찾기 — 하나의 상태로만 전이가 발생</li>
                </ul>
              </div>
              <div className="rounded-lg border border-cyan-300 p-3 dark:border-cyan-800">
                <p className="text-[12px] font-bold text-cyan-700 dark:text-cyan-300">
                  비결정론적 non-deterministic 모델
                </p>
                <ul className="mt-1 space-y-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
                  <li>• 모델에 내재적인 임의성이 존재</li>
                  <li>• 동일한 초기 조건과 파라미터 집합일지라도 서로 다른 여러 개의 출력을 생성 가능</li>
                  <li className="text-gray-500">예: 장기, 바둑, 체스 등 상대방과 번갈아 수를 결정하는 보드 게임</li>
                </ul>
              </div>
            </div>
            <Hint>
              지금까지의 Q-학습 알고리즘과 미로 찾기 예제는 기본적으로 결정론적 환경을 가정한 것이었다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "14.2.1 Q-학습 — 식 14-18", slides: "비결정론적 환경 — α를 가진 Q-학습의 갱신 규칙" }}>
          <Card>
            <CardTitle>α를 가진 Q-학습의 갱신 규칙</CardTitle>
            <ConceptRows
              rows={[
                {
                  k: "정의",
                  v: "상태 전이와 Q̂(s′, a′)가 비결정론적이면 결정론적 버전의 Q-학습이 제대로 동작하지 않는다. 해결책으로 학습률과 유사한 개념의 신뢰 요소(belief factor) α를 사용해서 Q̂(s′, a′)에 대해 신뢰하는 정도를 반영한다.",
                },
                {
                  k: "직관",
                  v: "옛 값 Q̂(s, a)를 1 − α만큼 남기고, 이번에 본 r + γ max Q̂(s′, a′)를 α만큼만 섞는다. 한 번의 결과로 값을 통째로 바꾸지 않는다.",
                },
                {
                  k: "오답 기준",
                  v: "α는 할인율 γ가 아니다. γ는 미래 보상을 얼마나 깎을지, α는 새 결과를 얼마나 믿고 반영할지를 정한다. 또 α = 1이면 (1 − α)Q̂ 항이 사라져 결정론적 규칙 Q̂(s, a) = r + γ max Q̂(s′, a′)와 같아진다(식 14-18에 α = 1을 대입해 이 화면에서 정리한 것).",
                },
              ]}
            />
            <div className="mt-3 space-y-2">
              <Formula>Q̂(s, a) ← (1 − α) Q̂(s, a) + α [r + γ max_a′ Q̂(s′, a′)]</Formula>
              <Formula note="두 식은 같은 식을 정리만 다르게 한 것이다 — 첫 식의 괄호를 풀면 두 번째 식이 된다">
                Q̂(s, a) ← Q̂(s, a) + α [r + γ max_a′ Q̂(s′, a′) − Q̂(s, a)]
              </Formula>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Slider label="신뢰 요소 α" value={alpha} min={0} max={1} step={0.05} onChange={setAlpha} display={alpha.toFixed(2)} />
              <Slider label="옛 값 Q̂(s, a)" value={qOld} min={0} max={1} step={0.05} onChange={setQOld} display={qOld.toFixed(2)} />
              <Slider
                label="이번 결과 r + γ max Q̂(s′, a′)"
                value={target}
                min={0}
                max={1}
                step={0.05}
                onChange={setTarget}
                display={target.toFixed(2)}
              />
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-md bg-gray-50 p-2 font-mono text-[12px] text-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
                (1 − {alpha.toFixed(2)}) × {qOld.toFixed(2)} + {alpha.toFixed(2)} × {target.toFixed(2)} ={" "}
                <strong className="text-cyan-700 dark:text-cyan-300">{fmtQ(formA, 4)}</strong>
              </div>
              <div className="rounded-md bg-gray-50 p-2 font-mono text-[12px] text-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
                {qOld.toFixed(2)} + {alpha.toFixed(2)} × ({target.toFixed(2)} − {qOld.toFixed(2)}) ={" "}
                <strong className="text-cyan-700 dark:text-cyan-300">{fmtQ(formB, 4)}</strong>
              </div>
            </div>

            <div className="mt-4">
              <P>
                같은 (s, a)를 스무 번 해 보았는데 다음 상태가 그때그때 달라 ‘이번 결과’가 1과 0으로
                바뀌었다고 하자. 회색 선은 α = 1(결정론적 규칙), 청록 선은 위에서 고른 α다.
              </P>
              <Scroller>
                <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full min-w-[380px]" role="img" aria-label="α에 따른 Q̂의 변화">
                  <line x1="30" y1={H - 20} x2={W - 10} y2={H - 20} className="stroke-gray-300 dark:stroke-gray-700" />
                  <line x1="30" y1="10" x2="30" y2={H - 20} className="stroke-gray-300 dark:stroke-gray-700" />
                  {[0, 0.5, 1].map((v) => (
                    <text key={v} x="26" y={py(v) + 3} textAnchor="end" className="fill-gray-400 text-[9px]">
                      {v}
                    </text>
                  ))}
                  {TARGETS.map((y, i) => (
                    <circle key={i} cx={px(i + 1)} cy={py(y)} r="2.5" className="fill-amber-400" />
                  ))}
                  <polyline points={line(det)} fill="none" className="stroke-gray-400" strokeWidth="1.5" />
                  <polyline points={line(soft)} fill="none" className="stroke-cyan-600" strokeWidth="2.5" />
                </svg>
              </Scroller>
              <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-gray-500">
                <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400" />그때그때의 결과</span>
                <span><span className="mr-1 inline-block h-0.5 w-3 bg-gray-400 align-middle" />α = 1</span>
                <span><span className="mr-1 inline-block h-0.5 w-3 bg-cyan-600 align-middle" />α = {alpha.toFixed(2)} → 마지막 값 {fmtQ(soft[soft.length - 1], 3)}</span>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <ComputedNote>
                그래프의 1과 0으로 이루어진 결과 시퀀스는 이 화면에서 정한 것입니다. 원자료는 갱신 규칙과
                함께, 이 비결정론적 학습 알고리즘의 수렴 특성이 증명되었다(Watkins and Dayan, 1992)는 점만
                적습니다.
              </ComputedNote>
              <Hint>
                α = 1이면 값이 매번 마지막 결과로 덮어써져 1과 0 사이를 오간다. α가 작을수록 한 번의 결과에
                덜 흔들린다 — 갱신 한 번에 움직이는 양이 α × (이번 결과 − 옛 값)이기 때문이다.
              </Hint>
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
