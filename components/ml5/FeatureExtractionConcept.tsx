"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowDown, Cpu, PenTool, Layers } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, DefinitionBox, Formula, Pill } from "./ui";

type Stage = "learn" | "apply";

const HANDCRAFTED = [
  {
    domain: "숫자인식",
    items: ["원영상 120×120", "격자 특징 12×12", "수직 히스토그램", "방향 성분"],
  },
  { domain: "영상분석", items: ["에지", "가로/세로 방향 성분"] },
  { domain: "문서분석", items: ["단어의 발생 빈도"] },
];

/** 표현학습 예 — 얼굴인식 신경망에서 층이 깊어질수록 특징이 추상화되는 흐름 */
const DEEP_LEVELS = [
  { label: "앞쪽 층", desc: "저수준(low-level) 특징 — 얼굴과 비슷한 모양이 그대로 보임" },
  { label: "중간 층", desc: "특징이 점점 추상화·개념화됨" },
  { label: "뒤쪽 층", desc: "고수준(high-level) 특징 — 집약된 특징 벡터" },
  { label: "분류", desc: "집약된 특징으로 이 사람이 누구인지 판정" },
];

export default function FeatureExtractionConcept() {
  const [stage, setStage] = useState<Stage>("learn");
  const [kind, setKind] = useState<"linear" | "nonlinear">("linear");
  const [approach, setApproach] = useState<"hand" | "repr">("hand");

  return (
    <section>
      <SectionTitle
        title="특징추출과 변환함수"
        subtitle="원래 데이터 x를 변환해 새로운 특징벡터 y로 표현하는 과정"
      />

      <div className="space-y-6">
        <Sourced
          refs={{
            textbook: "7장 도입 — 특징추출",
            slides: "특징추출",
          }}
        >
          <DefinitionBox label="특징추출">
            <p>
              분류기나 군집분석기를 수행함에 앞서 원래 데이터를 그대로 쓰는 대신 분석에 불필요한
              정보를 제거하고 핵심이 되는 정보만 추출하거나, 데이터의 차원 축소를 통해
              학습시스템의 효율을 향상하기 위한 목적으로 원래 데이터 x를 변환하여 새로운{" "}
              <strong>특징벡터 y</strong>로 표현하는 과정.
            </p>
            <div className="mt-3">
              <Formula tag="n차원 x → m차원 y">y = φ(x)</Formula>
            </div>
          </DefinitionBox>
        </Sourced>

        <Sourced
          refs={{
            slides: "특징추출 — 학습 데이터 집합과 변환함수",
          }}
        >
          <Card title="특징추출의 입출력 관계">
            <div className="mb-4 flex flex-wrap gap-2">
              <Pill on={stage === "learn"} onClick={() => setStage("learn")}>
                학습 단계
              </Pill>
              <Pill on={stage === "apply"} onClick={() => setStage("apply")}>
                새 데이터에 적용
              </Pill>
            </div>
            <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
              <FlowBox
                active={stage === "learn"}
                title="학습 데이터 집합"
                body={
                  <>
                    D = {"{"}xᵢ{"}"}ᵢ₌₁…N
                    <br />
                    또는 D = {"{"}(xᵢ, yᵢ){"}"}ᵢ₌₁…N
                  </>
                }
              />
              <Arrow />
              <FlowBox
                active
                title="변환함수"
                body={<>y = φ(x; θ)</>}
                note={stage === "learn" ? "학습(데이터 분석)의 결과물" : "학습이 끝나 θ가 정해진 상태"}
              />
              <Arrow />
              <FlowBox
                active={stage === "apply"}
                title="테스트 데이터 → 특징벡터"
                body={<>y_new = φ(x_new; θ)</>}
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              입력에는 데이터만 들어올 수도 있고(xᵢ), 목표 출력값이 함께 들어올 수도 있음(xᵢ, yᵢ).
              어느 쪽이든 학습의 결과물은 x를 y로 바꾸는 변환함수.
            </p>
          </Card>
        </Sourced>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Sourced
            refs={{
              textbook: "7장 도입 — 특징추출의 목적",
              slides: "특징추출 — 목적",
            }}
          >
            <Card title="목적 ① 핵심 정보만 추출" className="h-full">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                데이터 분석에 불필요한 정보를 제거하고 핵심이 되는 정보만 추출. 원래 입력 데이터를
                그대로 쓰면 분석에 불필요한 정보까지 함께 사용하게 되어 성능 저하의 원인이 되기도
                함.
              </p>
            </Card>
          </Sourced>
          <Sourced
            refs={{
              textbook: "7장 도입 — 특징추출의 목적",
              slides: "특징추출 — 목적",
            }}
          >
            <Card title="목적 ② 차원 축소로 효율 향상" className="h-full">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                n차원 입력을 그보다 낮은 m차원 특징으로 바꿔(n &gt; m) 학습 시스템의 효율을
                향상. 효율은 계산량과 메모리를 줄이는 것이고, 더 나아가 성능도 향상시킬 수 있음.
              </p>
            </Card>
          </Sourced>
        </div>

        <Sourced
          refs={{
            textbook: "7장 도입 — 변환함수(선형변환·비선형변환)",
            slides: "변환함수 — 변환함수의 종류",
          }}
        >
          <Card title="변환함수의 종류">
            <p className="mb-3 text-xs text-gray-500">
              변환함수(transformation function, embedding function)는 선형변환과 비선형변환으로
              구분.
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              <Pill on={kind === "linear"} onClick={() => setKind("linear")}>
                선형변환
              </Pill>
              <Pill on={kind === "nonlinear"} onClick={() => setKind("nonlinear")}>
                비선형변환
              </Pill>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={kind}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                {kind === "linear" ? (
                  <>
                    <Formula>y = φ(x) = Wᵀx</Formula>
                    <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                      <li>· n차원 열벡터 x에 변환행렬 W(n × m)를 곱해 m차원 특징을 획득</li>
                      <li>
                        · 통계적 방법을 사용해서 특징벡터 y가 <strong>원하는 분포</strong>가
                        되도록 하는 W를 찾는 것이 목적
                      </li>
                      <li className="text-xs text-gray-500">
                        이번 강의에서 중점적으로 다루는 방법 (PCA, LDA)
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <Formula>y = φ(x), φ는 복잡한 비선형함수</Formula>
                    <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                      <li>· 복잡한 비선형함수 φ(x)를 이용하여 n차원 벡터를 m차원 벡터로 매핑</li>
                      <li>
                        · 접근 방법 → 데이터 특성을 고려해 방법을 설계하는{" "}
                        <strong>수작업에 의한 특징추출</strong>, 딥러닝 등으로 변환함수를 학습하는{" "}
                        <strong>표현학습</strong>
                      </li>
                    </ul>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7장 도입 — 표현학습 / 7.1 선형변환에 의한 특징추출",
            slides: "특징추출을 위한 접근 방법 — 수작업에 의한 특징추출, 표현학습",
            lecture:
              "표현학습에서는 앞쪽 층에서 저수준 특징이, 뒤쪽으로 갈수록 추상화된 고수준 특징이 추출된다는 점을 얼굴인식 예로 설명함",
          }}
        >
          <Card title="특징추출을 위한 접근 방법">
            <div className="mb-4 flex flex-wrap gap-2">
              <Pill on={approach === "hand"} onClick={() => setApproach("hand")}>
                <span className="inline-flex items-center gap-1.5">
                  <PenTool size={13} /> 수작업에 의한 특징추출
                </span>
              </Pill>
              <Pill on={approach === "repr"} onClick={() => setApproach("repr")}>
                <span className="inline-flex items-center gap-1.5">
                  <Cpu size={13} /> 표현학습
                </span>
              </Pill>
            </div>

            {approach === "hand" ? (
              <div>
                <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
                  입력 데이터의 종류, 특성과 분석 목적에 맞는 적절한 특징을{" "}
                  <strong>개발자가 일일이 설계</strong>. 기존의 다양한 특징추출 방법 중 목적에 맞는
                  것을 골라 쓰는 것도 포함.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {HANDCRAFTED.map((h) => (
                    <div
                      key={h.domain}
                      className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                    >
                      <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{h.domain}</p>
                      <ul className="mt-1.5 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                        {h.items.map((it) => (
                          <li key={it}>· {it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-gray-500">
                  영상·음성·텍스트는 특성이 매우 달라서 각각에 맞게 설계된 특징추출 기법이 따로
                  존재함. 이처럼 특징추출 방법은 특정 데이터 집합이나 학습 시스템의 목적에 특화된
                  경우가 많음.
                </p>
              </div>
            ) : (
              <div>
                <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
                  특징추출을 위한 비선형 변환함수를 <strong>신경망 등의 머신러닝 모델</strong>로
                  표현하고, 학습을 통해 분석이 잘 되도록 하는 최적화된 변환함수를 찾는 것. 예: 딥러닝
                  모델(DeepFace)을 이용한 얼굴인식용 특징추출.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                  {DEEP_LEVELS.map((lv, i) => (
                    <div key={lv.label} className="flex flex-1 flex-col items-center gap-2 sm:flex-row">
                      <div
                        className="w-full flex-1 rounded-lg border border-rose-200 bg-rose-50/60 p-3 dark:border-rose-900 dark:bg-rose-950/30"
                        style={{ opacity: 0.55 + i * 0.15 }}
                      >
                        <p className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                          <Layers size={12} />
                          {lv.label}
                        </p>
                        <p className="mt-1 text-[11px] leading-snug text-gray-600 dark:text-gray-400">
                          {lv.desc}
                        </p>
                      </div>
                      {i < DEEP_LEVELS.length - 1 && (
                        <>
                          <ArrowRight size={14} className="hidden shrink-0 text-gray-400 sm:block" />
                          <ArrowDown size={14} className="shrink-0 text-gray-400 sm:hidden" />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "7.1 선형변환에 의한 특징추출",
          }}
        >
          <div className="rounded-xl border-l-4 border-rose-500 bg-rose-50 p-4 dark:bg-rose-950/30">
            <p className="text-sm font-bold text-rose-700 dark:text-rose-300">
              이번 강의의 초점 — 선형변환에 의한 특징추출
            </p>
            <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
              데이터 종류마다 따로 설계하는 수작업 특징과 달리, 데이터의 특성에 의존하지 않고
              일반적인 데이터에 적용할 수 있는 방법.
            </p>
          </div>
        </Sourced>
      </div>
    </section>
  );
}

function FlowBox({
  active,
  title,
  body,
  note,
}: {
  active: boolean;
  title: string;
  body: React.ReactNode;
  note?: string;
}) {
  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0.4, scale: active ? 1 : 0.98 }}
      className={`rounded-lg border p-3 text-center ${
        active
          ? "border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/40"
          : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40"
      }`}
    >
      <p className="text-xs font-bold text-gray-500">{title}</p>
      <p className="mt-1 font-mono text-sm text-gray-800 dark:text-gray-100">{body}</p>
      {note && <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400">{note}</p>}
    </motion.div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center text-gray-400">
      <ArrowRight size={18} className="hidden md:block" />
      <ArrowDown size={18} className="md:hidden" />
    </div>
  );
}
