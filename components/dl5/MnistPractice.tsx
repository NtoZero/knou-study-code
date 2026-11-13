"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Hint, ComputedNote, Scroller, Tag, num, fmt } from "@/components/dlShared/ui";

/** 강의록 'History 객체' 슬라이드에 출력된 5에폭 실행 결과 그대로 */
const HIST_LOSS = [
  0.31359416246414185, 0.14779123663902283, 0.10216694325208664, 0.07658225297927856, 0.05885574221611023,
];
const HIST_VAL_LOSS = [
  0.1986924409866333, 0.14397640526294708, 0.11934574693441391, 0.1061328873038292, 0.10009947419166565,
];

interface Step {
  id: string;
  title: string;
  code: string;
  notes: string[];
}

const STEPS: Step[] = [
  {
    id: "import",
    title: "필요한 패키지 불러오기",
    code: `import matplotlib.pyplot as plt
from tensorflow.keras import datasets
from tensorflow.keras import Sequential, Input, optimizers, callbacks
from tensorflow.keras.layers import Flatten, Dense`,
    notes: [
      "datasets: MNIST 데이터 집합을 포함한 몇 가지 데이터 집합 모듈 포함",
      "callbacks: 다양한 콜백 클래스 제공 — 조기 종료의 EarlyStopping이 여기에 있음",
      "Flatten: 고차원 배열 형태의 입력을 1차원으로 벡터로 변환하는 층",
    ],
  },
  {
    id: "load",
    title: "MNIST 데이터 로드 및 정규화",
    code: `# MNIST 데이터베이스에서 훈련용 및 평가용 이미지와 레이블 로드
(train_imgs, train_labels), (test_imgs, test_labels) = \\
                                   datasets.mnist.load_data()
# 픽셀 값을 0~1 사이로 정규화
train_imgs, test_imgs = train_imgs / 255.0, test_imgs / 255.0`,
    notes: [
      "tf.keras.datasets.mnist 모듈의 load_data() 함수로 MNIST 데이터 집합을 로드함",
      "0~255의 값으로 표현된 픽셀 값을 [0, 1] 범위의 실수로 정규화함",
    ],
  },
  {
    id: "model",
    title: "2층 피드포워드 네트워크 구성",
    code: `model = Sequential([
    Input(shape=(28, 28)),
    Flatten(),
    Dense(128, activation='sigmoid'),
    Dense(10, activation='softmax')
])
model.summary()`,
    notes: [
      "Flatten: 28 × 28 크기의 이미지를 1차원으로 펼침 (크기가 784인 1차원 벡터)",
      "Dense(128, sigmoid): 128개의 뉴런으로 구성된 완전연결층 — 은닉층",
      "Dense(10, softmax): 10개의 뉴런으로 구성된 완전연결층 — 출력층, 숫자 0~9에 대응",
    ],
  },
  {
    id: "compile",
    title: "모델 컴파일",
    code: `model.compile(optimizer=optimizers.SGD(0.1, momentum=0.9),
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])`,
    notes: [
      "최적화기는 학습률 0.1, 모멘텀 0.9의 확률적 경사 하강법",
      "metrics에 지정한 항목이 그대로 History의 키가 됨",
    ],
  },
  {
    id: "fit",
    title: "모델 학습",
    code: `hist = model.fit(train_imgs, train_labels, epochs=50,
                 validation_split=0.2)`,
    notes: [
      "전체 데이터 중 20%는 검증용으로 사용하고 나머지 80%만 훈련에 사용함",
      "학습 과정의 History 객체를 hist에 저장함",
    ],
  },
  {
    id: "history",
    title: "학습 이력의 시각화",
    code: `def plot_metric(h, metric):
    train_history = h.history[metric]
    val_history = h.history['val_'+metric]
    epochs = range(1, len(train_history) + 1)
    plt.plot(epochs, train_history)
    plt.plot(epochs, val_history)
    plt.legend(['training '+metric, 'validation '+metric])
    plt.title('Training and validation ' + metric)
    plt.xlabel("Epochs")
    plt.ylabel(metric)
    plt.show()

plot_metric(hist, 'accuracy')
plot_metric(hist, 'loss')`,
    notes: [
      "History 객체의 history는 딕셔너리형 속성임",
      "history의 키: 훈련 데이터에 대한 'loss'와 compile 메소드의 매개변수 metrics에 지정된 항목",
      "훈련 단계에서 검증 과정을 수행하였다면 검증 집합에 대한 키와 값 리스트도 포함됨",
    ],
  },
  {
    id: "early",
    title: "조기 종료를 적용한 모델 학습",
    code: `early_stop = callbacks.EarlyStopping(monitor='val_loss',
                                     min_delta=0,
                                     patience=10,
                                     verbose=1,
                                     restore_best_weights=True)

hist = model.fit(train_imgs, train_labels, epochs=50,
                 callbacks=[early_stop], validation_split=0.2)`,
    notes: [
      "훈련용 데이터에 대해서는 'loss', 'accuracy' 등이 개선되고 있으나 검증용 데이터에 대해서는 오히려 손실이나 정확도가 악화되거나 변화가 정체되는 경우, 지정된 에폭을 모두 실행하지 않고 조기에 학습을 종료함",
      "EarlyStopping 콜백 인스턴스를 생성하여 모델의 fit 메소드에 콜백으로 등록함",
    ],
  },
];

function r2(v: number) {
  return Math.round(v * 100) / 100;
}

export default function MnistPractice() {
  const [step, setStep] = useState(0);
  const cur = STEPS[step];

  const VIEW_W = 360;
  const VIEW_H = 160;
  const maxLoss = 0.35;
  const px = (i: number) => r2(36 + (i / (HIST_LOSS.length - 1)) * (VIEW_W - 54));
  const py = (v: number) => r2(12 + (1 - Math.min(v, maxLoss) / maxLoss) * (VIEW_H - 38));
  const line = (arr: number[]) => arr.map((v, i) => `${i === 0 ? "M" : "L"}${px(i)},${py(v)}`).join(" ");

  return (
    <section id="mnist-early-stopping" className="scroll-mt-32">
      <SectionTitle
        title="[실습] MNIST 필기 숫자 인식 — 조기 종료"
        subtitle="데이터 준비부터 학습 이력 확인, 조기 종료 적용까지"
      />

      <div className="space-y-5">
        <Sourced refs={{ slides: "MNIST 데이터베이스" }}>
          <Card>
            <CardTitle>MNIST 데이터베이스</CardTitle>
            <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-gray-700 dark:text-gray-200">
              <span className="rounded-lg bg-violet-50 px-3 py-1.5 font-semibold text-violet-800 dark:bg-violet-950/50 dark:text-violet-200">
                훈련용 {num(60000)}개
              </span>
              <span className="rounded-lg bg-gray-100 px-3 py-1.5 font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                테스트용 {num(10000)}개
              </span>
              <span>이미지와 레이블로 구성됨</span>
            </div>
            <Hint>tf.keras.datasets.mnist 모듈의 load_data() 함수로 로드할 수 있음.</Hint>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            slides: "MNIST MLP 구성과 학습",
            lecture: "hello world 같은 기본 데이터",
          }}
        >
          <Card>
            <CardTitle>단계를 눌러 가며 따라가기</CardTitle>

            <Scroller>
              <div className="flex min-w-[360px] gap-1.5 pb-1">
                {STEPS.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStep(i)}
                    aria-pressed={step === i}
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      step === i
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-gray-200 bg-white text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    }`}
                  >
                    {i + 1}. {s.title}
                  </button>
                ))}
              </div>
            </Scroller>

            <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11.5px] leading-5 text-gray-100">
              {cur.code}
            </pre>

            <ul className="mt-3 space-y-1.5 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              {cur.notes.map((n) => (
                <li key={n} className="flex gap-2">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-violet-500" />
                  <span>{n}</span>
                </li>
              ))}
            </ul>

            {cur.id === "model" && (
              <Scroller>
                <svg
                  viewBox="0 0 360 96"
                  className="mt-3 h-auto w-full min-w-[320px]"
                  role="img"
                  aria-label="28×28 이미지가 Flatten을 거쳐 784차원이 되고, 128개 은닉층을 지나 10개 출력으로 이어지는 구조"
                >
                  {[
                    { x: 10, w: 72, t1: "Input", t2: "28 × 28" },
                    { x: 96, w: 64, t1: "Flatten", t2: "784" },
                    { x: 174, w: 82, t1: "Dense · sigmoid", t2: "128" },
                    { x: 270, w: 80, t1: "Dense · softmax", t2: "10" },
                  ].map((b, i) => (
                    <g key={b.t1}>
                      <rect
                        x={b.x}
                        y="22"
                        width={b.w}
                        height="52"
                        rx="6"
                        className="fill-violet-50 dark:fill-violet-950/50"
                        stroke="#8b5cf6"
                        strokeWidth="1.3"
                      />
                      <text x={b.x + b.w / 2} y="44" textAnchor="middle" className="fill-violet-800 text-[9.5px] font-bold dark:fill-violet-200">
                        {b.t1}
                      </text>
                      <text x={b.x + b.w / 2} y="62" textAnchor="middle" className="fill-gray-500 text-[11px] font-mono">
                        {b.t2}
                      </text>
                      {i < 3 && (
                        <line
                          x1={b.x + b.w}
                          y1="48"
                          x2={b.x + b.w + 14}
                          y2="48"
                          stroke="#8b5cf6"
                          strokeWidth="1.4"
                          markerEnd="url(#dl5-mnist-ar)"
                        />
                      )}
                    </g>
                  ))}
                  <defs>
                    <marker id="dl5-mnist-ar" markerWidth="8" markerHeight="8" refX="6.5" refY="3" orient="auto">
                      <path d="M0,0 L7,3 L0,6 z" fill="#8b5cf6" />
                    </marker>
                  </defs>
                </svg>
              </Scroller>
            )}

            {cur.id === "history" && (
              <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-950/40">
                <p className="mb-2 text-[11px] font-bold text-gray-500">
                  강의록의 5에폭 실행 결과를 그대로 그린 것
                </p>
                <Scroller>
                  <svg
                    viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                    className="h-auto w-full min-w-[320px]"
                    role="img"
                    aria-label="5에폭 동안의 훈련 손실과 검증 손실"
                  >
                    <line x1="36" y1={VIEW_H - 26} x2={VIEW_W - 14} y2={VIEW_H - 26} stroke="#cbd5e1" strokeWidth="1" />
                    <line x1="36" y1="10" x2="36" y2={VIEW_H - 26} stroke="#cbd5e1" strokeWidth="1" />
                    <text x="2" y="16" className="fill-gray-400 text-[9px]">
                      0.35
                    </text>
                    <text x={VIEW_W - 36} y={VIEW_H - 10} className="fill-gray-400 text-[9px]">
                      에폭
                    </text>
                    <path d={line(HIST_VAL_LOSS)} fill="none" stroke="#f97316" strokeWidth="2.2" />
                    <path d={line(HIST_LOSS)} fill="none" stroke="#2563eb" strokeWidth="2.2" />
                    {HIST_LOSS.map((v, i) => (
                      <circle key={`l${i}`} cx={px(i)} cy={py(v)} r="3.2" fill="#2563eb" />
                    ))}
                    {HIST_VAL_LOSS.map((v, i) => (
                      <circle key={`v${i}`} cx={px(i)} cy={py(v)} r="3.2" fill="#f97316" />
                    ))}
                  </svg>
                </Scroller>
                <div className="mt-1 flex flex-wrap gap-3 text-[11px]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-0.5 w-5 bg-blue-600" /> loss
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-0.5 w-5 bg-orange-500" /> val_loss
                  </span>
                </div>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11px] leading-5 text-gray-100">
{`>>> hist.history.keys()
dict_keys(['loss', 'accuracy', 'val_loss', 'val_accuracy'])`}
                </pre>
                <p className="mt-2 text-[12px] leading-6 text-gray-600 dark:text-gray-300">
                  훈련 손실은 {fmt(HIST_LOSS[0], 3)}에서 {fmt(HIST_LOSS[4], 3)}까지 꾸준히 내려가지만, 검증 손실은{" "}
                  {fmt(HIST_VAL_LOSS[0], 3)}에서 {fmt(HIST_VAL_LOSS[4], 3)}로 완만해진다. 50에폭까지 돌린 강의록
                  그림에서는 검증 손실이 포화되고 때로는 조금씩 증가한다.
                </p>
              </div>
            )}

            {cur.id === "early" && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Tag tone="teal">monitor=&apos;val_loss&apos;</Tag>
                <Tag>min_delta=0 — 변화가 없는 상태</Tag>
                <Tag>patience=10 — 10에폭까지 기다림</Tag>
                <Tag tone="teal">restore_best_weights=True</Tag>
              </div>
            )}
          </Card>
        </Sourced>

        <Sourced refs={{ slides: "훈련·테스트 인식률 출력" }}>
          <Card>
            <CardTitle>훈련용 집합과 테스트용 집합의 인식률</CardTitle>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-violet-50 p-3 dark:bg-violet-950/40">
                <p className="text-[11px] font-bold text-violet-700 dark:text-violet-300">훈련 데이터 인식률</p>
                <p className="mt-0.5 text-2xl font-bold text-violet-700 dark:text-violet-200">0.9957</p>
                <p className="text-[10.5px] font-mono text-gray-500">0.9957166910171509</p>
              </div>
              <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800/70">
                <p className="text-[11px] font-bold text-gray-600 dark:text-gray-300">테스트 데이터 인식률</p>
                <p className="mt-0.5 text-2xl font-bold text-gray-800 dark:text-gray-100">0.9801</p>
                <p className="text-[10.5px] font-mono text-gray-500">0.9800999760627747</p>
              </div>
            </div>
            <Hint>
              훈련용 집합에서는 거의 100%에 가깝지만 테스트용 집합에서는 그만큼 나오지 않는다. 훈련 데이터 집합에
              더 가깝게 맞춰져 있는 것이고, 이 차이를 줄이려는 것이 이번 강의의 규제 기법들이다.
            </Hint>
            <ComputedNote>
              위 두 수치와 앞의 손실 값들은 강의록에 출력된 실행 결과를 그대로 옮긴 것임.
            </ComputedNote>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
