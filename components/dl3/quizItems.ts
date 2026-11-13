import type { QuizItem } from "@/components/dlShared/Quiz";

/**
 * 공식 연습문제는 문구·보기·정답·해설을 원문 그대로 옮겼다.
 * 변형 문제는 정답이 하나뿐인지 확인하여 덧붙였다.
 */
export const QUIZZES: QuizItem[] = [
  {
    q: "텐서플로에서 텐서에 대한 설명으로 옳은 것은?",
    source: "공식 연습문제",
    examSkill: "텐서의 장치 배치와 값 변경 방법",
    answer: 1,
    basis:
      "텐서는 가장 빠른 처리를 할 수 있는 장치에서 처리되도록 만들어진다. GPU를 사용할 수 있다면 텐서의 device는 GPU로 설정되고, 그렇지 않으면 CPU로 설정될 것이다. 변수 텐서는 값을 변경할 수 있으나 ‘=’ 연산자가 아닌 assign 메소드를 이용한다. 텐서플로에는 텐서의 연산을 위한 tf.math, 선형대수 연산을 위한 tf.linalg가 포함되어 있다.",
    refs: { slides: "2. 텐서플로와 텐서 / 3. 텐서의 사용 예" },
    choices: [
      {
        text: "텐서의 연산은 CPU에서 계산되도록 정해져 있다.",
        isCorrect: false,
        explanation: {
          basis: "공식 해설",
          reason:
            "텐서는 가장 빠른 처리를 할 수 있는 장치에서 처리되도록 만들어진다. CPU로 정해져 있는 것이 아니라, GPU를 쓸 수 있으면 device가 GPU로 설정된다.",
        },
      },
      {
        text: "변수 텐서의 값을 변경하려면 assign 메소드를 사용한다.",
        isCorrect: true,
        explanation: {
          basis: "공식 해설",
          reason:
            "변수 텐서는 값을 변경할 수 있으나 ‘=’ 연산자가 아닌 assign 메소드를 이용한다. assign, assign_add, assign_sub가 있다.",
        },
      },
      {
        text: "텐서의 행렬 연산은 텐서플로에 제공되지 않지만 대신 numpy의 함수를 이용하면 된다.",
        isCorrect: false,
        explanation: {
          basis: "공식 해설",
          reason:
            "텐서플로에는 텐서의 연산을 위한 tf.math, 선형대수 연산을 위한 tf.linalg가 포함되어 있다. tf.matmul로 행렬 곱을 바로 계산할 수 있다.",
        },
      },
      {
        text: "텐서는 GPU에서 처리되어야 하므로 GPU가 없으면 텐서를 사용할 수 없다.",
        isCorrect: false,
        explanation: {
          basis: "공식 해설",
          reason: "GPU를 사용할 수 없으면 device가 CPU로 설정될 뿐이며, 텐서는 그대로 사용할 수 있다.",
        },
      },
    ],
  },
  {
    q: "다음 중 텐서플로의 실행 모드에 대한 설명으로 옳은 것은?",
    source: "공식 연습문제",
    examSkill: "지연·즉시·그래프 실행 모드의 구분",
    answer: 2,
    basis:
      "텐서플로 1.x 버전에서는 지연 실행 모드를 사용하였지만, 2.x 버전에서는 즉시 실행 모드가 기본 모드로 사용되며, tf.function을 이용하면 이를 텐서플로 그래프로 변환하여 그래프 실행 모드로 고속 실행을 할 수 있다. tf.function을 이러한 변환을 위해 사용된다. tf.function을 호출하여 즉시 실행 모드의 함수를 그래프 모드로 동작할 수 있는 함수로 변환하거나 그래프 실행 모드로 사용하려는 함수를 ‘@tf.function’으로 수식하여 정의한다.",
    refs: { slides: "3. 텐서플로의 실행 모드 / 4. 그래프 실행 모드의 활용" },
    choices: [
      {
        text: "텐서플로 2.x 버전에서는 지연 실행(lazy execution) 모드가 기본 실행 모드이다.",
        isCorrect: false,
        explanation: {
          basis: "공식 해설",
          reason:
            "텐서플로 1.x 버전에서는 지연 실행 모드를 사용하였지만, 2.x 버전에서는 즉시 실행 모드가 기본 모드로 사용된다.",
        },
      },
      {
        text: "즉시 실행(eager execution) 모드는 그래프 실행(graph execution) 모드에 비해 고속으로 실행된다.",
        isCorrect: false,
        explanation: {
          basis: "공식 해설",
          reason:
            "방향이 반대다. tf.function으로 그래프로 변환하면 그래프 실행 모드로 고속 실행을 할 수 있다.",
        },
      },
      {
        text: "‘@tf.function’ 수식어가 사용된 함수는 자동적으로 텐서플로 그래프로 변환되어 실행된다.",
        isCorrect: true,
        explanation: {
          basis: "공식 해설",
          reason:
            "그래프 실행 모드로 사용하려는 함수를 ‘@tf.function’으로 수식하여 정의하면 자동으로 텐서플로 그래프로 변환되어 실행된다.",
        },
      },
      {
        text: "텐서플로 그래프를 인수로 전달하여 tf.function을 호출하면 즉시 실행 모드로 변환된 함수를 반환한다.",
        isCorrect: false,
        explanation: {
          basis: "공식 해설",
          reason:
            "tf.function은 즉시 실행 모드의 함수를 그래프 모드로 동작할 수 있는 함수로 변환하기 위해 사용된다. 전달하는 것도 그래프가 아니라 파이썬 함수이고, 변환의 방향도 반대다.",
        },
      },
    ],
  },
  {
    q: "다음 중 텐서플로에서 자동 미분을 위해 연산을 기록하는 역할을 하는 클래스는?",
    source: "공식 연습문제",
    examSkill: "자동 미분 관련 클래스의 역할 구분",
    answer: 0,
    basis:
      "자동 미분을 하려면 tf.GradientTape 문맥을 만든 후, 그 안에서 이루어지는 연산을 기록한다. 미분은 gradient 메소드로 구한다. tf.Graph는 데이터 흐름 그래프로 표현된 계산 구조를 나타내는 클래스이고, tf.function은 함수가 텐서플로 그래프 실행 방식으로 동작하게 만드는 용도로 사용하며, tf.Variable은 변수 텐서를 만들기 위한 클래스이다.",
    refs: { slides: "1. 텐서플로의 자동 미분 / 4. 그래프 실행 모드의 활용" },
    choices: [
      {
        text: "tf.GradientTape",
        isCorrect: true,
        explanation: {
          basis: "공식 해설",
          reason:
            "자동 미분을 하려면 tf.GradientTape 문맥을 만든 후, 그 안에서 이루어지는 연산을 기록한다. 미분은 gradient 메소드로 구한다.",
        },
      },
      {
        text: "tf.Graph",
        isCorrect: false,
        explanation: {
          basis: "공식 해설",
          reason: "tf.Graph는 데이터 흐름 그래프로 표현된 계산 구조를 나타내는 클래스이다.",
        },
      },
      {
        text: "tf.function",
        isCorrect: false,
        explanation: {
          basis: "공식 해설",
          reason:
            "tf.function은 함수가 텐서플로 그래프 실행 방식으로 동작하게 만드는 용도로 사용한다.",
        },
      },
      {
        text: "tf.Variable",
        isCorrect: false,
        explanation: {
          basis: "공식 해설",
          reason: "tf.Variable은 변수 텐서를 만들기 위한 클래스이다.",
        },
      },
    ],
  },
  {
    q: "다음 문장에 대한 설명으로 옳지 않은 것은? h_layer = tf.keras.layers.Dense(3, activation='softmax')",
    source: "공식 연습문제",
    examSkill: "Dense 층의 매개변수 해석",
    answer: 1,
    basis:
      "Dense는 완전연결층을 만드는 클래스로, 첫째 인수는 유닛의 수로서, 그만큼의 출력을 낸다. 이 유닛에는 이전 층의 출력이 입력으로 연결되며, 입력의 수는 이전 층에 의해 결정되므로 이 문장만으로는 입력의 수는 알 수 없다. 각 Dense 층 유닛에는 기본적으로 바이어스가 사용되며, 바이어스를 사용하지 않으려면 use_bias 매개변수를 False로 지정해야 한다. 소프트맥스 활성함수가 지정되었으므로 출력은 확률분포를 나타내는 값의 벡터로 변환된다.",
    refs: { slides: "2. 예: 텐서플로를 이용한 다층 퍼셉트론 구현 — tf.keras.layers.Dense 클래스" },
    choices: [
      {
        text: "완전연결층을 만든다.",
        isCorrect: false,
        explanation: {
          basis: "공식 해설",
          reason: "Dense는 완전연결층을 만드는 클래스다. 옳은 설명이므로 답이 아니다.",
        },
      },
      {
        text: "이 층의 유닛에는 바이어스가 사용되지 않는다.",
        isCorrect: true,
        explanation: {
          basis: "공식 해설",
          reason:
            "각 Dense 층 유닛에는 기본적으로 바이어스가 사용되며, 바이어스를 사용하지 않으려면 use_bias 매개변수를 False로 지정해야 한다. 옳지 않은 설명이므로 이것이 답이다.",
        },
      },
      {
        text: "이 층은 3개의 출력을 낸다.",
        isCorrect: false,
        explanation: {
          basis: "공식 해설",
          reason:
            "첫째 인수는 유닛의 수로서, 그만큼의 출력을 낸다. 옳은 설명이므로 답이 아니다.",
        },
      },
      {
        text: "이 층의 출력은 0과 1 사이의 값이며, 전체 출력의 합은 1이다.",
        isCorrect: false,
        explanation: {
          basis: "공식 해설",
          reason:
            "소프트맥스 활성함수가 지정되었으므로 출력은 확률분포를 나타내는 값의 벡터로 변환된다. 옳은 설명이므로 답이 아니다.",
        },
      },
    ],
  },
  {
    q: "지연 실행 모드에서 아래 코드를 실행했을 때 출력으로 옳은 것은?",
    intro:
      "a = tf.placeholder(tf.float32) / b = tf.placeholder(tf.float32) / c = a + b / print('c =', c)",
    source: "변형",
    examSkill: "지연 실행 모드에서 c가 가리키는 것",
    answer: 1,
    basis:
      "지연 실행 모드에서 c = a + b 는 덧셈을 지금 하라는 뜻이 아니라 add 노드를 그래프에 만드는 것이다. c는 계산된 값이 아니라 add 연산을 가리키므로 값 대신 그 노드가 출력된다.",
    refs: {
      slides: "3. 텐서플로의 실행 모드 — 지연 실행 모드의 계산 그래프 구성",
      lecture: "c를 출력하면 값이 아니라 add 연산 노드가 출력된다고 짚음",
    },
    choices: [
      {
        text: "c = 5.0",
        isCorrect: false,
        explanation: {
          basis: "3강 지연 실행 모드 슬라이드",
          reason:
            "5.0은 세션을 생성해 {a:2., b:3.} 을 전달하고 sess.run(c) 를 실행한 뒤에야 얻어지는 값이다. 아직 a와 b에 값이 없다.",
        },
      },
      {
        text: 'c = Tensor("add:0", dtype=float32)',
        isCorrect: true,
        explanation: {
          basis: "3강 지연 실행 모드 슬라이드의 출력",
          reason:
            "c는 add 연산에 해당하는 노드를 가리킨다. 계산된 값이 아니므로 그 노드의 이름과 자료형이 출력된다.",
        },
      },
      {
        text: "c = tf.Tensor(5.0, shape=(), dtype=float32)",
        isCorrect: false,
        explanation: {
          basis: "3강 즉시 실행 모드 슬라이드의 출력",
          reason:
            "이것은 즉시 실행 모드에서 tf.constant로 만든 a, b를 더했을 때 나오는 출력이다. 실행 모드가 다르다.",
        },
      },
      {
        text: "오류가 발생한다.",
        isCorrect: false,
        explanation: {
          basis: "3강 지연 실행 모드 슬라이드",
          reason:
            "placeholder에 값이 없어도 그래프를 구성하는 것은 정상적인 동작이다. 오류가 아니라 노드가 출력된다.",
        },
      },
    ],
  },
  {
    q: "tf.GradientTape 문맥에서 t.watch(x)를 반드시 지정해야 하는 텐서는?",
    source: "변형",
    examSkill: "추적 대상 지정이 필요한 경우",
    answer: 1,
    basis:
      "변수 텐서는 trainable 속성의 기본값이 True이므로 기본적으로 추적 대상이며 별도로 지정할 필요가 없다. trainable을 False로 지정하면 추적 대상에서 빠지므로 watch로 명시해야 한다.",
    refs: {
      slides: "1. 텐서플로의 자동 미분 — 테이프의 watch 메소드로 추적할 텐서를 지정",
      lecture: "강의록 예제에서 x2에만 watch를 쓴 이유를 trainable=False로 설명",
    },
    choices: [
      {
        text: "tf.Variable로 만들고 trainable을 지정하지 않은 텐서",
        isCorrect: false,
        explanation: {
          basis: "3강 자동 미분 슬라이드",
          reason:
            "trainable 속성의 기본값이 True이므로 기본적으로 추적 대상이다. 별도로 추적 대상으로 지정할 필요가 없다.",
        },
      },
      {
        text: "tf.Variable로 만들면서 trainable=False로 지정한 텐서",
        isCorrect: true,
        explanation: {
          basis: "3강 자동 미분 계산 예 — x2 = tf.Variable(1., trainable=False)",
          reason:
            "trainable이 False이면 추적 대상에서 빠진다. 이 텐서에 대한 편미분을 구하려면 t.watch로 추적하도록 명시해야 한다.",
        },
      },
      {
        text: "문맥 안에서 계산되는 모든 중간 결과",
        isCorrect: false,
        explanation: {
          basis: "3강 자동 미분 슬라이드",
          reason:
            "정방향 진행의 연산은 문맥 안에서 자동으로 테이프에 기록된다. watch는 중간 결과를 기록시키는 장치가 아니라, 무엇에 대해 미분할지 추적 대상을 지정하는 장치다.",
        },
      },
      {
        text: "손실함수의 값을 담은 텐서",
        isCorrect: false,
        explanation: {
          basis: "3강 자동 미분을 이용한 선형 회귀의 학습",
          reason:
            "손실함수 값은 미분의 대상이 아니라 미분하는 쪽, 즉 gradient(loss, [w, b]) 의 첫 인수로 넘기는 값이다.",
        },
      },
    ],
  },
  {
    q: "shape가 (4, 3, 2)인 텐서 c에 대해 tf.reduce_sum(c, axis=2) 의 결과 shape는?",
    source: "변형",
    examSkill: "축을 따라 합산할 때 모양의 변화",
    answer: 0,
    basis:
      "합산한 축이 사라진다. shape (4, 3, 2) 에서 2번 자리의 2가 빠져 (4, 3) 이 된다. 강의록 출력도 shape=(4, 3) 이다.",
    refs: {
      slides: "3. 텐서의 사용 예 — tf.math.reduce_sum(c, axis=2) 의 출력 shape=(4, 3)",
      lecture: "0번 축, 1번 축, 2번 축 중 2번 축이면 맨 마지막 축이라고 설명",
    },
    choices: [
      {
        text: "(4, 3)",
        isCorrect: true,
        explanation: {
          basis: "3강 텐서의 사용 예 슬라이드의 출력",
          reason:
            "2번 축의 길이 2가 합산되어 사라지므로 앞의 두 자리만 남아 (4, 3) 이 된다. 강의록 출력도 shape=(4, 3) 이다.",
        },
      },
      {
        text: "(3, 2)",
        isCorrect: false,
        explanation: {
          basis: "축의 번호",
          reason: "0번 축을 합산했을 때 남는 모양이다. 지정한 축은 2번이다.",
        },
      },
      {
        text: "(4, 2)",
        isCorrect: false,
        explanation: {
          basis: "축의 번호",
          reason: "1번 축을 합산했을 때 남는 모양이다. 지정한 축은 2번이다.",
        },
      },
      {
        text: "(4, 3, 2)",
        isCorrect: false,
        explanation: {
          basis: "3강 텐서의 사용 예 슬라이드",
          reason: "합산한 축은 결과에서 사라지므로 모양이 그대로 남지 않는다.",
        },
      },
    ],
  },
  {
    q: "잔차 학습 블록처럼 비순차적 연결이 있는 모델을 구성하려고 한다. 알맞은 방법은?",
    source: "변형",
    examSkill: "모델 구성 방법의 선택 기준",
    answer: 1,
    basis:
      "함수형 API는 다양한 형태의 층과 비순차적 연결이 존재하는 모델의 구성에 활용한다. 각 층의 출력에 해당하는 텐서를 이어지는 층의 인스턴스에 전달하는 형식으로 그래프를 구성한다.",
    refs: {
      slides: "2. 예: 텐서플로를 이용한 다층 퍼셉트론 구현 — 함수형 API를 이용한 모델 구성(잔차 학습 블록)",
    },
    choices: [
      {
        text: "tf.keras.Sequential 클래스에 층을 순서대로 add 한다.",
        isCorrect: false,
        explanation: {
          basis: "3강 Keras의 개요",
          reason:
            "Sequential은 순차적으로 층이 연결된 모델을 구성하는 클래스다. 건너뛰는 연결은 표현할 수 없다.",
        },
      },
      {
        text: "Keras의 함수형 API로 각 층의 출력 텐서를 이어지는 층에 전달한다.",
        isCorrect: true,
        explanation: {
          basis: "3강 함수형 API를 이용한 모델 구성 슬라이드",
          reason:
            "함수형 API는 다양한 형태의 층과 비순차적 연결이 존재하는 모델의 구성에 활용한다. 강의록이 든 예가 바로 잔차 학습 블록이다.",
        },
      },
      {
        text: "tf.function으로 모델 함수를 그래프로 변환한다.",
        isCorrect: false,
        explanation: {
          basis: "3강 그래프 실행 모드의 활용",
          reason:
            "tf.function은 실행 모드를 바꾸어 계산 성능을 높이는 도구이지, 모델의 구조를 구성하는 방법이 아니다.",
        },
      },
      {
        text: "tf.GradientTape 문맥 안에서 층을 정의한다.",
        isCorrect: false,
        explanation: {
          basis: "3강 텐서플로의 자동 미분",
          reason:
            "tf.GradientTape는 자동 미분을 위해 연산을 기록하는 문맥이다. 모델의 연결 구조를 정하는 것과는 관계가 없다.",
        },
      },
    ],
  },
];
