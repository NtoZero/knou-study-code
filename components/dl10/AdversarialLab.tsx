"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Chip, Slider } from "@/components/dlShared/ui";

const batches = [
  {
    name: "실제 영상",
    path: ["실제 옷 영상 x", "판별기 D(x)", "목표 1"],
    why: "실제 Fashion-MNIST 영상에 높은 점수를 주도록 판별기의 가중치를 갱신합니다.",
    changes: "판별기 D",
    code: `# x에는 0~1로 정규화한 실제 옷 영상 64장이 들어 있다.
real_images = x.reshape(64, 28, 28, 1)
D.train_on_batch(real_images, np.ones((64, 1)))`,
  },
  {
    name: "생성 영상",
    path: ["노이즈 z → 생성기 G", "판별기 D(G(z))", "목표 0"],
    why: "생성기가 만든 영상에 낮은 점수를 주도록 판별기를 갱신합니다. 이 단계에서는 생성 영상을 판별기의 학습 표본으로 씁니다.",
    changes: "판별기 D",
    code: `z = np.random.normal(size=(64, 100))
fake_images = G.predict_on_batch(z)
D.train_on_batch(fake_images, np.zeros((64, 1)))`,
  },
  {
    name: "생성기 훈련",
    path: ["새 노이즈 z → G", "고정한 D를 통과", "목표 1"],
    why: "판별기의 가중치를 고정하고, 판별 결과가 1에 가까워지는 방향으로 생성기를 갱신합니다. 판별기를 통과한 오차가 생성기까지 전달됩니다.",
    changes: "생성기 G",
    code: `# GAN은 G와 D를 연결하고, D를 고정한 채 컴파일한 모델이다.
new_z = np.random.normal(size=(64, 100))
GAN.train_on_batch(new_z, np.ones((64, 1)))`,
  },
];

const real = [1, 4, 5, 6, 4];
const initial = [8, 5, 4, 2, 1];

export default function AdversarialLab() {
  const [step, setStep] = useState(0);
  const [blend, setBlend] = useState(0);
  const batch = batches[step];
  return (
    <section>
      <SectionTitle
        title="판별기를 속이는 동안 누구의 가중치가 바뀔까?"
        subtitle="오토인코더는 주어진 그림을 복원합니다. GAN의 생성기는 무작위 노이즈에서 출발해 실제 데이터와 비슷한 새 표본을 만듭니다."
      />
      <Sourced
        refs={{
          slides:
            "22~27쪽 · 생성기와 판별기의 목표, 29~36쪽 · Fashion-MNIST 학습",
          lecture: "34:40~35:03 · 두 모델의 역할 / 56:48~56:56 · 균형점",
        }}
      >
        <Card>
          <CardTitle>한 미니배치의 세 단계</CardTitle>
          <div className="flex flex-wrap gap-2">
            {batches.map((b, i) => (
              <Chip key={b.name} active={i === step} onClick={() => setStep(i)}>
                {i + 1}. {b.name}
              </Chip>
            ))}
          </div>
          <div className="mt-4" aria-live="polite">
            <ol className="grid gap-2 text-center sm:grid-cols-3">
              {batch.path.map((v, i) => (
                <li
                  key={v}
                  className="rounded-lg bg-rose-50 p-3 font-bold text-rose-900 dark:bg-rose-950 dark:text-rose-100"
                >
                  {v}
                  {i < 2 && (
                    <span aria-hidden className="ml-2">
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm font-bold">
              갱신되는 네트워크 · {batch.changes}
            </p>
            <p className="my-2 text-sm">{batch.why}</p>
            <pre className="overflow-x-auto rounded bg-slate-900 p-3 text-sm leading-6 text-white">
              <code>{batch.code}</code>
            </pre>
          </div>
          <details className="mt-4 rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700">
            <summary className="cursor-pointer font-semibold">
              목표를 식으로 확인하기
            </summary>
            <p className="mt-2">
              D는 실제 표본의 log D(x)와 생성 표본의 log(1 − D(G(z)))를 각각
              평균내어 더한 값을 최대화합니다. 실제에 1, 생성에 0을 주면 각
              로그가 log 1 = 0에 가까워집니다.
            </p>
            <p className="mt-2">
              G의 차례에는 실제 표본 항이 G에 의존하지 않습니다. 강의의 미니맥스
              식은 log(1 − D(G(z)))를 줄이고, 코드에서는 생성 표본에 목표 1을
              주어 −log D(G(z))를 줄입니다. 두 방식 모두 판별기가 생성 표본에 더
              높은 점수를 주도록 G를 움직입니다.
            </p>
          </details>
          <p className="mt-4 text-sm">
            실습에서 G는 길이 100의 노이즈를 받아 784개의 픽셀을 만들고
            28×28×1로 바꿉니다. D는 영상을 펼쳐 시그모이드 출력 하나로 실제일
            확률을 냅니다. 두 모델 모두 실제·생성 여부에 대한 이진 교차
            엔트로피를 사용합니다.
          </p>
        </Card>
        <div className="mt-4">
          <Card>
            <CardTitle>생성 분포가 실제 분포를 닮으면</CardTitle>
            <p className="mb-4 text-sm">
              영상에서 한 특징을 골라 다섯 구간으로 나눈 모형입니다. 각 분포에서
              표본을 같은 비율로 뽑습니다. 슬라이더를 움직여 두 분포가 같아지는
              순간을 찾아보세요.
            </p>
            <Slider
              label="두 분포가 일치하는 정도"
              value={blend}
              min={0}
              max={100}
              step={5}
              onChange={setBlend}
              display={`${blend}%`}
            />
            <div className="my-3 flex flex-wrap gap-5 text-xs">
              <span>
                <i
                  aria-hidden
                  className="mr-1 inline-block h-3 w-3 bg-blue-600"
                />
                실제 분포
              </span>
              <span>
                <i
                  aria-hidden
                  className="mr-1 inline-block h-3 w-3 bg-orange-500"
                />
                생성 분포
              </span>
            </div>
            <div
              className="grid grid-cols-5 gap-2 text-center"
              aria-live="polite"
            >
              {real.map((r, i) => {
                const g = initial[i] + ((r - initial[i]) * blend) / 100;
                return (
                  <div key={i}>
                    <div
                      className="flex h-24 items-end justify-center gap-1 border-b border-slate-400"
                      role="img"
                      aria-label={`구간 ${i + 1}, 실제 ${r * 5}%, 생성 ${(g * 5).toFixed(1)}%`}
                    >
                      <span
                        className="w-1/3 bg-blue-600"
                        style={{ height: `${(r / 8) * 100}%` }}
                      />
                      <span
                        className="w-1/3 bg-orange-500"
                        style={{ height: `${(g / 8) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs">구간 {i + 1}</p>
                    <p className="text-xs font-bold">
                      {Math.round((100 * r) / (r + g))}%
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-sm">
              아래 백분율은 그 구간에 들어온 전체 표본 중 실제 표본의
              비율입니다. 두 분포가 같아지면 모든 구간이 50%가 됩니다. 이상적인
              판별기도 이 특징만으로는 표본의 출처를 가를 수 없습니다.
            </p>
          </Card>
        </div>
      </Sourced>
    </section>
  );
}
