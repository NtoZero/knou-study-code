"use client";

import KeyPhrase from "@/components/dlShared/KeyPhrase";
import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Chip } from "@/components/dlShared/ui";

type Model = "alexnet" | "vgg";
type Step = "prepare" | "build" | "train" | "evaluate";
const STEPS: { id: Step; label: string }[] = [
  { id: "prepare", label: "① 데이터 준비" },
  { id: "build", label: "② 모델 구성" },
  { id: "train", label: "③ 학습" },
  { id: "evaluate", label: "④ 평가" },
];

const COPY: Record<Model, Record<Step, { title: string; code: string; note: string }>> = {
  alexnet: {
    prepare: {
      title: "CIFAR-10 이미지·레이블 준비",
      code: "(x_train, y_train), (x_test, y_test) = cifar10.load_data()\nx_train = x_train.astype('float32') / 255.0\nx_test = x_test.astype('float32') / 255.0\ny_train = to_categorical(y_train, 10)\ny_test = to_categorical(y_test, 10)",
      note: "픽셀을 0~1 범위로 정규화하고, 10개 범주의 정수 레이블을 원-핫 벡터로 바꾼다.",
    },
    build: {
      title: "227×227 입력과 층 구성",
      code: "layers.Resizing(227, 227)\nConv2D(96, (11, 11), strides=(4, 4), activation='relu')\n...\nDense(4096, activation='relu')\nDropout(0.5)\nDense(10, activation='softmax')",
      note: "강의 구현 예시는 CIFAR-10을 분류하므로 마지막 층은 10개 출력이다. AlexNet의 설명용 표는 1,000개 범주를 출력한다. 실습은 LRN 대신 배치 정규화를 쓰고, 두 번째 합성곱의 보폭도 달라진다. 원형은 보폭 1로 27×27을 유지하지만 실습의 보폭 2와 same 패딩은 14×14를 출력한다.",
    },
    train: {
      title: "손실·최적화기·학습 횟수 설정",
      code: "model.compile(optimizer='adam',\n              loss='categorical_crossentropy',\n              metrics=['accuracy'])\nmodel.fit(x_train, y_train, epochs=10)",
      note: "원-핫 레이블을 사용하는 categorical crossentropy와 Adam을 설정하고, 10 에폭 동안 학습한다.",
    },
    evaluate: {
      title: "테스트 데이터로 정확도 확인",
      code: "score = model.evaluate(x_test, y_test)\nprint('테스트 정확도:', score[1])",
      note: "학습에 쓰지 않은 테스트 이미지를 넣고 평가 결과를 확인한다.",
    },
  },
  vgg: {
    prepare: {
      title: "CIFAR-10을 VGG 입력 크기로 조정",
      code: "(x_train, y_train), (x_test, y_test) = cifar10.load_data()\nx_train, y_train = x_train[:2000], y_train[:2000]\nx_test, y_test = x_test[:500], y_test[:500]\nx_train = np.array([cv2.resize(img, (224, 224)) for img in x_train], dtype='float32') / 255.0\nx_test = np.array([cv2.resize(img, (224, 224)) for img in x_test], dtype='float32') / 255.0",
      note: "강의 실습은 학습 이미지 2,000장과 테스트 이미지 500장을 사용하고, 224×224×3 크기로 조정한다.",
    },
    build: {
      title: "3×3 합성곱 블록과 분류층",
      code: "x = Conv2D(64, (3, 3), padding='same', activation='relu')(x)\nx = Conv2D(64, (3, 3), padding='same', activation='relu')(x)\nx = MaxPooling2D((2, 2), strides=(2, 2))(x)\n...\nout = Dense(10, activation='softmax')(x)",
      note: "3×3 합성곱층을 블록마다 두세 번 쌓고 각 블록 뒤 2×2 최대 풀링으로 크기를 줄인다. CIFAR-10 예제의 분류 출력은 10개이다.",
    },
    train: {
      title: "희소 범주 레이블을 이용해 학습",
      code: "model.compile(optimizer='adam',\n              loss='sparse_categorical_crossentropy',\n              metrics=['accuracy'])\nmodel.fit(x_train, y_train, epochs=10)",
      note: "정수 레이블을 원-핫 인코딩하지 않고 sparse categorical crossentropy를 사용한다.",
    },
    evaluate: {
      title: "테스트 데이터로 정확도 확인",
      code: "score = model.evaluate(x_test, y_test)\nprint('테스트 정확도:', score[1])",
      note: "AlexNet 예제와 같이 별도 테스트 데이터로 분류 성능을 평가한다.",
    },
  },
};

export default function ImplementationPipeline() {
  const [model, setModel] = useState<Model>("alexnet");
  const [step, setStep] = useState<Step>("prepare");
  const current = COPY[model][step];

  return (
    <section id="implementation" className="scroll-mt-32">
      <SectionTitle title="CIFAR-10으로 모델 구현 흐름 따라가기" subtitle="모델과 단계를 선택해 데이터 준비부터 평가까지 살펴보세요." />
      <Sourced refs={{ slides: "슬라이드 19–23, 32–36 — AlexNet·VGGNet 구현", lecture: model === "vgg" ? "음성 전사 54:03–54:52 — VGG16D 입력 크기와 정수 레이블" : "음성 전사 14:41–14:55 — AlexNet의 분류 출력과 소프트맥스" }}>
        <Card>
          <div className="mb-5 space-y-2 text-sm leading-6">
            <CardTitle>정답 범주가 3인 사진 한 장의 손실은 어떻게 구할까?</CardTitle>
            <p>마지막 완전연결층은 CIFAR-10의 열 범주에 점수를 하나씩 냅니다. 소프트맥스는 각 점수의 지수값을 열 지수값의 합으로 나누어 <KeyPhrase>합계가 1인 확률</KeyPhrase>로 바꿉니다. AlexNet 실습은 정답 3을 원-핫 벡터 [0, 0, 0, 1, 0, 0, 0, 0, 0, 0]으로 바꿉니다. VGG16 실습은 정수 3을 그대로 전달합니다. 두 표현 모두 0부터 세어 네 번째 범주를 가리킵니다.</p>
            <p>교차 엔트로피는 <KeyPhrase>정답 범주에 준 확률의 자연로그에 음수</KeyPhrase>를 붙입니다. 예를 들어 그 확률이 0.2이면 손실은 −ln(0.2) ≈ 1.61이고, 0.8이면 약 0.22입니다. 두 실습의 손실함수 이름에 붙는 <code>sparse</code>는 정답을 정수로 건넨다는 뜻입니다.</p>
            <p>정확도를 구할 때는 가장 높은 확률을 얻은 범주 번호와 정답 3이 일치하는지 셉니다. 이미 맞힌 사진에서도 정답 확률이 0.6에서 0.8로 오르면 정확도는 그대로이고 손실은 줄어듭니다.</p>
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Chip active={model === "alexnet"} onClick={() => { setModel("alexnet"); setStep("prepare"); }}>AlexNet 구현</Chip>
            <Chip active={model === "vgg"} onClick={() => { setModel("vgg"); setStep("prepare"); }}>VGG16 구현</Chip>
          </div>
          <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {STEPS.map((item) => <button key={item.id} type="button" onClick={() => setStep(item.id)} aria-pressed={step === item.id} className={`rounded-lg border px-2 py-2 text-xs font-semibold ${step === item.id ? "border-teal-500 bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200" : "border-gray-200 text-gray-500 dark:border-gray-700"}`}>{item.label}</button>)}
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <CardTitle>{current.title}</CardTitle>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11px] leading-5 text-gray-100"><code>{current.code}</code></pre>
            </div>
            <div className="flex flex-col justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
              <p className="text-sm leading-6 text-gray-700 dark:text-gray-200">{current.note}</p>
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[13px] leading-6 text-amber-900 dark:border-amber-900 dark:bg-amber-950/35 dark:text-amber-100">
                {model === "alexnet"
                  ? "Flatten은 마지막 특징 맵을 한 줄로 펼칩니다. 이 코드에서는 C2의 보폭이 2여서 공간 크기가 27 → 14 → 6으로 줄고, 마지막 풀링 뒤에는 2×2×256 = 1,024개 값이 첫 Dense 층으로 들어갑니다."
                  : "VGG16-D는 풀링 다섯 번으로 한 변을 224 → 112 → 56 → 28 → 14 → 7로 줄입니다. Flatten은 마지막 7×7×512를 25,088개 값으로 펼쳐 첫 Dense 층에 전달합니다. 펼치는 동안 가중치를 학습하지 않습니다."}
              </div>
            </div>
          </div>
        </Card>
      </Sourced>
    </section>
  );
}
