"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import {
  Card,
  CardTitle,
  Chip,
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
 * 14.2.2 심층 Q-신경망(DQN) 앞부분 — Q-테이블의 한계(그림 14-11), Q-신경망의 두 형태(그림 14-12),
 * 시점 t의 출력과 목표 출력값·목적함수(그림 14-13, 식 14-19 · 14-20).
 */

type Problem = "maze4" | "maze100" | "atari" | "go";

const PROBLEMS: Record<
  Problem,
  { label: string; size: React.ReactNode; digits: string; note: string; src: string }
> = {
  maze4: {
    label: "4×4 미로",
    size: <>16 × 4 = 64칸</>,
    digits: "두 자리",
    note: "앞에서 직접 채운 Q-테이블. 테이블로 충분하다.",
    src: "그림 14-8",
  },
  maze100: {
    label: "100×100 미로",
    size: (
      <>
        10<sup>4</sup> × 4칸
      </>
    ),
    digits: "다섯 자리 (40,000칸)",
    note: "미로 크기만 키웠는데 칸 수가 600배 넘게 늘었다.",
    src: "교재 14.2.2",
  },
  atari: {
    label: "아타리 게임",
    size: (
      <>
        256<sup>84×84×4</sup>개의 고유한 화면 상태
      </>
    ),
    digits: "약 67,971자리",
    note: "화면이 84×84×4 크기의 그레이 영상이고 하나의 화면 영상이 하나의 상태에 대응될 때.",
    src: "그림 14-11(a)",
  },
  go: {
    label: "바둑",
    size: (
      <>
        10<sup>170</sup>개의 고유한 상태
      </>
    ),
    digits: "171자리",
    note: "엄청난 크기의 테이블을 다루는 것은 비효율성을 넘어 현실적으로 불가능하다.",
    src: "그림 14-11(b)",
  },
};

export default function QNetworkLab() {
  const [prob, setProb] = useState<Problem>("maze4");
  const [form, setForm] = useState<"a" | "b">("a");
  const [nActs, setNActs] = useState(4);
  const [out, setOut] = useState(0.4);

  const p = PROBLEMS[prob];
  const y = 0 + 0.9 * 1; // r = 0, γ = 0.9, max Q̂(15, a′) = 1
  const loss = (out - y) ** 2;

  return (
    <section id="q-network" className="scroll-mt-32">
      <SectionTitle
        title="Q-테이블에서 Q-신경망으로"
        subtitle="칸을 셀 수 없을 만큼 상태가 많아지면, 테이블 대신 근사함수를 쓴다"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "14.2.2 심층 Q-신경망 — 그림 14-11", slides: "Q-테이블에서 Q-신경망으로", lecture: "100×100 미로만 해도 1만 가지 상태 × 4가지 행동 = 4만 칸이 되고, 아타리·바둑으로 가면 테이블로 표현하기 어려워 Q-함수를 신경망으로 나타낸다고 설명" }}>
          <Card>
            <CardTitle>Q-테이블의 한계 — 실제 응용에서의 비효율성</CardTitle>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {(Object.keys(PROBLEMS) as Problem[]).map((k) => (
                <Chip key={k} active={prob === k} onClick={() => setProb(k)}>
                  {PROBLEMS[k].label}
                </Chip>
              ))}
            </div>
            <motion.div
              key={prob}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60"
            >
              <p className="font-mono text-[18px] font-bold text-gray-800 dark:text-gray-100">{p.size}</p>
              <p className="mt-1 text-[12px] text-gray-500">
                {p.src} · 수로 쓰면 {p.digits}
              </p>
              <p className="mt-2 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">{p.note}</p>
            </motion.div>
            <div className="mt-3 space-y-2">
              <P>
                Q-함수의 테이블 형태의 표현은 불가 → 이러한 상태를 표현할 수 있는 <strong>근사함수</strong>가
                필요하다. Q-함수를 테이블이 아닌 근사함수로, 신경망을 이용해서 표현하고 추정하는 것을{" "}
                <strong>Q-신경망(Q-network)</strong>이라고 한다.
              </P>
              <ComputedNote>
                ‘수로 쓰면 몇 자리’는 이 화면에서 계산한 것입니다. 256<sup>28224</sup>의 자릿수는 28224 ×
                log₁₀256 ≈ 67,970.2에서 나옵니다. 강의록 그림에는 아타리 상태 수가 256<sup>84×84</sup>로
                적혀 있고, 교재는 4개 프레임을 쌓은 입력 크기를 그대로 지수에 넣어 256<sup>84×84×4</sup>로
                적습니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "14.2.2 심층 Q-신경망 — 그림 14-12", slides: "Q-신경망 Q-Network", lecture: "기본 형태는 행동마다 Q-값을 따로 계산해야 해서 너무 복잡하므로, 딥마인드가 아타리에 적용하면서 상태만 넣고 모든 행동의 Q-값을 한꺼번에 내도록 다시 정의했고 출력 노드 수가 행동의 개수와 같아진다고 강조" }}>
          <Card>
            <CardTitle>Q-신경망의 두 형태</CardTitle>
            <div className="mb-3 flex flex-wrap gap-1.5">
              <Chip active={form === "a"} onClick={() => setForm("a")}>
                (a) 기본 형태
              </Chip>
              <Chip active={form === "b"} onClick={() => setForm("b")}>
                (b) 구글 딥마인드가 재정의한 형태
              </Chip>
            </div>
            <Scroller>
              <svg viewBox="0 0 460 170" className="w-full min-w-[400px]" role="img" aria-label="Q-신경망 구조">
                {/* 입력 */}
                <text x="40" y={form === "a" ? 62 : 90} textAnchor="middle" className="fill-gray-700 text-[12px] font-bold dark:fill-gray-200">
                  상태 s
                </text>
                {form === "a" && (
                  <text x="40" y="112" textAnchor="middle" className="fill-gray-700 text-[12px] font-bold dark:fill-gray-200">
                    행동 a
                  </text>
                )}
                {[0, 1, 2].map((i) => (
                  <circle key={`in${i}`} cx="110" cy={50 + i * 35} r="10" className="fill-sky-100 stroke-sky-500 dark:fill-sky-950" />
                ))}
                {[0, 1, 2, 3].map((i) => (
                  <circle key={`h${i}`} cx="210" cy={32 + i * 35} r="10" className="fill-gray-100 stroke-gray-400 dark:fill-gray-800" />
                ))}
                {[0, 1, 2].map((i) =>
                  [0, 1, 2, 3].map((j) => (
                    <line key={`e${i}${j}`} x1="120" y1={50 + i * 35} x2="200" y2={32 + j * 35} className="stroke-gray-300 dark:stroke-gray-700" />
                  )),
                )}
                {(form === "a" ? [85] : [32, 67, 102, 137]).map((cy, k) => (
                  <g key={`o${k}`}>
                    {[0, 1, 2, 3].map((j) => (
                      <line key={j} x1="220" y1={32 + j * 35} x2="300" y2={cy} className="stroke-gray-300 dark:stroke-gray-700" />
                    ))}
                    <circle cx="310" cy={cy} r="10" className="fill-cyan-100 stroke-cyan-600 dark:fill-cyan-950" />
                    <text x="330" y={cy + 4} className="fill-cyan-800 text-[11.5px] font-semibold dark:fill-cyan-200">
                      {form === "a" ? "Q̂(s, a)" : `Q̂(s, a${k + 1})`}
                    </text>
                  </g>
                ))}
                <text x="110" y="162" textAnchor="middle" className="fill-gray-400 text-[10px]">입력층</text>
                <text x="210" y="162" textAnchor="middle" className="fill-gray-400 text-[10px]">은닉층</text>
                <text x="310" y="162" textAnchor="middle" className="fill-gray-400 text-[10px]">출력층</text>
              </svg>
            </Scroller>
            <p className="mt-2 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              {form === "a"
                ? "입력으로 상태 s와 행동 a가 주어지고, 출력은 주어진 상태에서 해당 동작을 취하였을 때의 기대 보상 Q̂(s, a)가 된다."
                : "입력으로 상태 s만 주어지고, 출력층은 주어진 상태의 각 행동에 대한 Q-값으로 구성된다. 출력층은 주어진 상태의 모든 행동의 개수만큼의 노드로 구성된다."}
            </p>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <Slider
                label="고를 수 있는 행동의 개수"
                value={nActs}
                min={1}
                max={18}
                step={1}
                onChange={setNActs}
                display={`${nActs}개`}
              />
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className={`rounded-md p-2 ${form === "a" ? "bg-rose-50 dark:bg-rose-950/40" : "bg-gray-50 dark:bg-gray-800/60"}`}>
                  <p className="text-[10.5px] text-gray-500">(a)로 모든 Q-값 계산</p>
                  <p className="font-mono text-[14px] font-bold">신경망 {nActs}번</p>
                </div>
                <div className={`rounded-md p-2 ${form === "b" ? "bg-cyan-50 dark:bg-cyan-950/40" : "bg-gray-50 dark:bg-gray-800/60"}`}>
                  <p className="text-[10.5px] text-gray-500">(b)로 모든 Q-값 계산</p>
                  <p className="font-mono text-[14px] font-bold">신경망 1번</p>
                </div>
              </div>
            </div>
            <Hint>
              최적 행동을 고르려면 그 상태의 모든 행동의 Q-값이 필요하다. (a)는 행동마다 따로 신경망을
              통과시켜야 해서 매우 비효율적이고, 그래서 딥마인드는 한꺼번에 계산하는 (b)로 변형했다.
              아타리의 경우 출력 노드는 18개다.
            </Hint>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "14.2.2 심층 Q-신경망 — 그림 14-13 · 식 14-19 · 14-20", slides: "Q-신경망의 학습", lecture: "Q-학습의 갱신식 오른쪽이 곧 목표 출력값이 되고, 실제 출력과의 차이의 제곱을 줄이도록 오류역전파로 학습하므로 보상을 쓰는 강화학습이라는 큰 틀 안에서 지도학습을 수행하는 셈이라고 정리" }}>
          <Card>
            <CardTitle>Q-신경망의 학습 — 목표 출력값을 Q-학습이 만들어 준다</CardTitle>
            <Formula note="시점 t에서 학습 파라미터 θ에 대한 Q-신경망의 실제 출력">Q̂(sₜ, aₜ | θ)</Formula>
            <div className="mt-2">
              <Formula note="(식 14-19) 목표 출력값">
                yₜ = rₜ + γ max_a′ Q*(sₜ₊₁, a′) ≈ rₜ + γ max_a′ Q̂(sₜ₊₁, a′ | θ)
              </Formula>
            </div>
            <div className="mt-2">
              <Formula note="(식 14-20) 실제 출력과 목표 출력값으로 정의되는 목적함수">
                E(θ) = Σₜ₌₀ᵀ {"{"}Q̂(sₜ, aₜ | θ) − (rₜ + γ max_a′ Q̂(sₜ₊₁, a′ | θ)){"}"}²
              </Formula>
            </div>

            <div className="mt-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <P>
                앞의 4×4 미로를 신경망이 맡았다고 해 보자. 상태 11에서 D를 하면 r = 0, 다음 상태는 15,
                신경망이 15에 대해 내는 값이 {"{"}1, 0, 0, 0{"}"}이고 γ = 0.9라면 목표 출력값은 표에서 구한
                값과 같다.
              </P>
              <p className="mt-2 font-mono text-[12.5px] text-gray-700 dark:text-gray-200">
                y = 0 + 0.9 × max{"{"}1, 0, 0, 0{"}"} = <strong>{fmtQ(y)}</strong>
              </p>
              <div className="mt-2 max-w-sm">
                <Slider
                  label="신경망의 현재 출력 Q̂(11, D | θ)"
                  value={out}
                  min={0}
                  max={1.2}
                  step={0.05}
                  onChange={setOut}
                  display={out.toFixed(2)}
                />
              </div>
              <p className="mt-2 font-mono text-[12.5px] text-gray-700 dark:text-gray-200">
                (Q̂ − y)² = ({out.toFixed(2)} − 0.9)² ={" "}
                <strong className="text-cyan-700 dark:text-cyan-300">{fmtQ(loss, 4)}</strong>
              </p>
              <div className="mt-1 h-2.5 max-w-sm rounded-sm bg-gray-100 dark:bg-gray-800">
                <motion.div
                  className="h-2.5 rounded-sm bg-cyan-600"
                  animate={{ width: `${Math.min(100, (loss / 0.81) * 100)}%` }}
                  transition={{ duration: 0.15 }}
                />
              </div>
              <div className="mt-2">
                <ComputedNote>
                  신경망 출력 슬라이더는 이 화면에서 둔 것입니다. 목표값 0.9는 교재 식 14-15와 같은 계산입니다.
                </ComputedNote>
              </div>
            </div>

            <div className="mt-3">
              <ConceptRows
                rows={[
                  {
                    k: "직관",
                    v: "목표 출력값 yₜ가 생기면 남은 일은 익숙한 지도학습이다. Q-신경망 자체는 기울기 강하 학습법인 오류역전파 학습 알고리즘으로 목적함수 E(θ)를 줄인다.",
                  },
                  {
                    k: "오답 기준",
                    v: "목적함수 (식 14-20)는 Q-테이블로 표현할 때는 수렴하지만, 비선형 함수 근사기로서 Q-신경망을 사용할 때는 수렴이 보장되지 않는다. 목표 출력값 안에도 같은 θ가 들어 있다는 점을 놓치면 이유를 설명할 수 없다.",
                  },
                ]}
              />
            </div>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
