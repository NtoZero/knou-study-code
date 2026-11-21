import type { OfficialQuizItem } from "@/components/dlShared/Quiz";

/** U-KNOU 딥러닝 3강 공식 연습문제. 보기 순서와 정답은 학습창 기준. */
export const QUIZZES: OfficialQuizItem[] = [
  {
    q: "텐서플로에서 텐서에 대한 설명으로 옳은 것은?",
    choices: [
      "텐서의 연산은 CPU에서 계산되도록 정해져 있다.",
      "변수 텐서의 값을 변경하려면 assign 메소드를 사용한다.",
      "텐서의 행렬 연산은 텐서플로에 제공되지 않지만 대신 numpy의 함수를 이용하면 된다.",
      "텐서는 GPU에서 처리되어야 하므로 GPU가 없으면 텐서를 사용할 수 없다.",
    ],
    answer: 1,
    explanation: "텐서는 가장 빠른 처리를 할 수 있는 장치에서 처리되도록 만들어진다. GPU를 사용할 수 있다면 텐서의 device는 GPU로 설정되고, 그렇지 않으면 CPU로 설정될 것이다. 변수 텐서는 값을 변경할 수 있으나 ‘=’ 연산자가 아닌 assign 메소드를 이용한다. 텐서플로에는 텐서의 연산을 위한 tf.math, 선형대수 연산을 위한 tf.linalg가 포함되어 있다.",
  },
  {
    q: "다음 중 텐서플로의 실행 모드에 대한 설명으로 옳은 것은?",
    choices: [
      "텐서플로 2.x 버전에서는 지연 실행(lazy execution) 모드가 기본 실행 모드이다.",
      "즉시 실행(eager execution) 모드는 그래프 실행(graph execution) 모드에 비해 고속으로 실행된다.",
      "‘@tf.function’ 수식어가 사용된 함수는 자동적으로 텐서플로 그래프로 변환되어 실행된다.",
      "텐서플로 그래프를 인수로 전달하여 tf.function을 호출하면 즉시 실행 모드로 변환된 함수를 반환한다.",
    ],
    answer: 2,
    explanation: "텐서플로 1.x 버전에서는 지연 실행 모드를 사용하였지만, 2.x 버전에서는 즉시 실행 모드가 기본 모드로 사용되며, tf.function을 이용하면 이를 텐서플로 그래프로 변환하여 그래프 실행 모드로 고속 실행을 할 수 있다. tf.function을 이러한 변환을 위해 사용된다. tf.function을 호출하여 즉시 실행 모드의 함수를 그래프 모드로 동작할 수 있는 함수로 변환하거나 그래프 실행 모드로 사용하려는 함수를 ‘@tf.function’으로 수식하여 정의한다.",
  },
  {
    q: "다음 중 텐서플로에서 자동 미분을 위해 연산을 기록하는 역할을 하는 클래스는?",
    choices: [
      "tf.GradientTape",
      "tf.Graph",
      "tf.function",
      "tf.Variable",
    ],
    answer: 0,
    explanation: "자동 미분을 하려면 tf.GradientTape 문맥을 만든 후, 그 안에서 이루어지는 연산을 기록한다. 미분은 gradient 메소드로 구한다. tf.Graph는 데이터 흐름 그래프로 표현된 계산 구조를 나타내는 클래스이고, tf.function은 함수가 텐서플로 그래프 실행 방식으로 동작하게 만드는 용도로 사용하며, tf.Variable은 변수 텐서를 만들기 위한 클래스이다.",
  },
  {
    q: <>다음 문장에 대한 설명으로 옳지 <u>않은</u> 것은?</>,
    context: <><div className="my-2 whitespace-pre-wrap rounded-lg border p-3">h_layer = tf.keras.layers.Dense(3, activation='softmax')</div></>,
    choices: [
      "완전연결층을 만든다.",
      "이 층의 유닛에는 바이어스가 사용되지 않는다.",
      "이 층은 3개의 출력을 낸다.",
      "이 층의 출력은 0과 1 사이의 값이며, 전체 출력의 합은 1이다.",
    ],
    answer: 1,
    explanation: "Dense는 완전연결층을 만드는 클래스로, 첫째 인수는 유닛의 수로서, 그만큼의 출력을 낸다. 이 유닛에는 이전 층의 출력이 입력으로 연결되며, 입력의 수는 이전 층에 의해 결정되므로 이 문장만으로는 입력의 수는 알 수 없다. 각 Dense 층 유닛에는 기본적으로 바이어스가 사용되며, 바이어스를 사용하지 않으려면 use_bias 매개변수를 False로 지정해야 한다. 소프트맥스 활성함수가 지정되었으므로 출력은 확률분포를 나타내는 값의 벡터로 변환된다.",
  },
];
