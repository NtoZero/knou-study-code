import type { GlossaryTerm } from "@/lib/mlGlossaryTypes";

export const lecture14Terms: GlossaryTerm[] = [
  /* ─────────── 자연어처리 응용 ─────────── */
  {
    id: "t-nlp",
    term: "자연어처리",
    en: "NLP, Natural Language Processing",
    category: "개념",
    short: "컴퓨터로 자연어를 이해하고, 번역/해석하고, 조작하기 위한 인공지능의 한 분야.",
    definition:
      "컴퓨터로 자연어를 이해(understanding)하고, 번역/해석(translation/interpretation)하고, 조작(manipulation)하기 위한 인공지능의 한 분야. 자연어는 한국어·영어처럼 인간의 문화에서 자연스럽게 발생한 ‘인간 언어’로, 특정 목적을 위해 인위적으로 만든 인공언어(C, 파이썬, 자바 등 프로그래밍 언어)에 대응되는 개념이다.",
    role: "컴퓨터비전이 영상에 담긴 정보를 처리한다면, 자연어처리는 텍스트의 시퀀스에 담긴 정보를 처리한다. 그래서 머신러닝 기법도 컴퓨터비전과는 다른 형태로 독자적으로 개발되어 왔다.",
    example: "음성 신호처리, 대화 수행, 텍스트 분석",
    distinctions: [
      {
        from: "인공언어",
        how: "인공언어는 특정 목적을 위해 인위적으로 만들었고 자연어보다 엄격한 문법을 가진다.",
      },
      {
        from: "컴퓨터비전",
        how: "처리 대상이 영상인가, 텍스트의 시퀀스인가.",
      },
    ],
    related: ["t-speech-signal-processing", "t-dialogue-action", "t-text-analysis", "t-computer-vision"],
    emphasis: "음성 신호처리·대화 수행·텍스트 분석의 세 갈래는 이해를 쉽게 하려고 나눈 것이라 분류 자체에 큰 의미를 둘 필요는 없다고 강의에서 짚었다.",
    lectures: [14],
    basis: "교재 13.2 자연어처리 · 강의록 자연어처리",
    aliases: ["NLP", "자연어", "인공언어"],
  },
  {
    id: "t-speech-signal-processing",
    term: "음성 신호처리",
    en: "speech signal processing",
    category: "개념",
    short: "사람의 목소리로 발화된 음성 신호에 포함된 언어 정보를 처리하는 분야.",
    definition:
      "사람의 목소리로 발화된 음성 신호에 포함된 언어 정보를 처리하는 분야. 음성인식·화자인식처럼 음성 신호를 입력받아 의미 정보를 추출하는 문제와, 음성합성처럼 텍스트를 입력받아 음성 신호로 변환하는 문제로 나뉜다.",
    role: "AI 스피커 등에 적용되어 실제 시스템에서 활용된다. 다만 신호 고유의 특성 분석과 잡음 제거 같은 신호처리 기술에 초점이 있어, 좁은 의미의 자연어처리에서는 음성 신호를 포함하지 않기도 한다.",
    example:
      "음성인식(ASR, speech-to-text → 텍스트), 화자인식(→ 발화자의 신원), 음성합성(TTS, Text To Speech)",
    distinctions: [
      {
        from: "음성인식 vs 화자인식",
        how: "둘 다 같은 음성 신호를 입력으로 하는 분류 문제이고, 레이블링된 클래스 레이블의 종류가 다르다. 음성인식은 음절·텍스트를, 화자인식은 발화자의 신원을 낸다.",
      },
      {
        from: "음성합성",
        how: "방향이 반대다. 텍스트 신호를 받아 음성 신호를 합성한다.",
      },
    ],
    related: ["t-nlp", "t-dialogue-action"],
    lectures: [14],
    basis: "교재 13.2.1 (1) 음성 신호처리 · 강의록 음성신호처리",
    aliases: ["음성인식", "화자인식", "음성합성", "ASR", "TTS", "speech recognition", "speaker recognition"],
  },
  {
    id: "t-dialogue-action",
    term: "대화 수행",
    en: "dialogue action",
    category: "개념",
    short: "상대방과 문장을 주고받는 형식으로 진행되는 작업. AI 스피커·챗봇의 핵심 기술.",
    definition:
      "상대방이 따로 존재하여 문장을 주고받는 형식으로 진행되는 작업으로, AI 스피커나 챗봇 등에 들어가는 핵심 기술이다. 정보검색, 질의응답, 목적 지향 대화가 대표 응용이다.",
    example:
      "정보검색(오늘 날씨 검색 요청), 질의응답(질의의 의도를 파악해 대답 생성), 목적 지향 대화(비행기표 예매, 민원 상담)",
    distinctions: [
      {
        from: "정보검색·질의응답 vs 목적 지향 대화",
        how: "정보검색·질의응답은 보통 한 번의 요청과 대응으로 이루어지고 의도가 명확해 핵심 키워드 파악에 초점을 맞춘다. 목적 지향 대화는 일련의 대화를 통해 필요한 정보를 추출해 가는 계획적 대화와 앞 대화를 기억하는 능력이 필요해 상당히 어렵다.",
      },
      {
        from: "채팅",
        how: "특정 목적 없이 오가는 채팅은 입력에 대한 정확한 정답이 정해져 있지 않아 오히려 다루기 쉬운 문제로 볼 수 있다. 의도 파악과 제대로 된 문장 생성이 중요하다.",
      },
    ],
    related: ["t-nlp", "t-task-oriented-dialogue"],
    emphasis: "잡담은 옳고 그름도 이전 대화의 기억도 필요 없어 어렵지 않지만, 목적 지향 대화는 사용자가 말하지 않은 정보까지 뽑아내고 이전 대화를 기억해야 해서 어렵다고 강의에서 대비했다.",
    lectures: [14],
    basis: "교재 13.2.1 (2) 대화 수행 · 강의록 대화수행",
    aliases: ["dialog action", "정보검색", "질의응답", "information retrieval", "question-answering", "챗봇"],
  },
  {
    id: "t-task-oriented-dialogue",
    term: "목적 지향 대화",
    en: "task-oriented dialogue",
    category: "개념",
    short: "비행기표 예매처럼 특정 목적을 가지고 일련의 대화를 이어 가는 대화 수행 문제.",
    definition:
      "비행기표 예매나 민원 상담 등 특정 목적을 가지고 대화를 진행하는 문제. 대화의 최종 목적이 명확하고, 사용자가 요구사항을 한 문장에 모두 담지 않으므로 일련의 대화로 필요한 정보를 추출해 가는 계획적 대화와, 앞에서 이루어진 대화 내용을 기억하는 능력이 필요하다.",
    role: "고전적 방법은 목적 달성에 필요한 정보(출발지, 목적지, 시간, 사람 수 등)의 템플릿을 미리 만들어 두고 대화로 빈칸을 채워 갔다. 최근에는 대화의 의도 파악, 이전 대화 내용 기억 같은 일반 태스크를 수행하는 딥러닝 모델도 개발되고 있다.",
    related: ["t-dialogue-action"],
    lectures: [14],
    basis: "교재 13.2.1 (2) 대화 수행 · 강의록 대화수행 — 목적 지향 대화 시스템",
  },
  {
    id: "t-text-analysis",
    term: "텍스트 분석",
    en: "text analysis",
    category: "개념",
    short: "일련의 텍스트 정보를 입력받아 의미적 내용과 문맥 등을 분석해 원하는 결과를 도출하는 것.",
    definition:
      "일련의 텍스트 정보를 입력으로 받아 그 의미적 내용과 문맥 등을 분석하여 원하는 결과를 도출하는 것. 머신러닝에서 주로 쓰는 분류나 군집화 등의 기법이 잘 적용될 수 있는 문제다.",
    example: "텍스트 분류(스팸 필터링, 감성인식, 주제분류), 기계번역, 텍스트 요약",
    related: ["t-text-classification", "t-machine-translation", "t-text-summarization", "t-nlp"],
    lectures: [14],
    basis: "교재 13.2.1 (3) 텍스트 분석 · 강의록 텍스트분석",
  },
  {
    id: "t-text-classification",
    term: "텍스트 분류",
    en: "text classification",
    category: "개념",
    short: "주어진 일련의 텍스트를 미리 정해진 몇 개의 클래스로 나누는 것.",
    definition:
      "주어진 일련의 텍스트(문구, 문장, 문단, 기사, 논문 등)를 미리 정해진 몇 개의 클래스로 나누는 것. 감성인식, 주제분류, 스팸 필터링이 주된 응용이다.",
    role: "텍스트 입력에서 핵심 정보를 잘 추출해 표현해 주기만 하면 기존 머신러닝의 분류기를 활용할 수 있어 가장 활발하게 연구된 분야다.",
    example:
      "감성인식(리뷰가 긍정적인지 부정적인지), 주제분류(text categorization — 기사를 사회·경제·연예·스포츠 등으로), 스팸 필터링(광고성·유해 메일인지 아닌지의 이원 분류)",
    related: ["t-sentiment-classification", "t-text-analysis", "t-bert-configurations"],
    lectures: [14],
    basis: "교재 13.2.1 (3) 텍스트 분석 · 강의록 텍스트분석: 텍스트분류",
    aliases: ["주제분류", "text categorization", "스팸 필터링", "spam filtering"],
  },
  {
    id: "t-sentiment-classification",
    term: "감성인식",
    en: "sentiment classification",
    category: "개념",
    short: "문장이나 문단에 내재된 감성을 인식하는 텍스트 분류 문제.",
    definition:
      "문장이나 문단에 내재된 감성을 인식하는 것. 영화나 홈쇼핑 등의 리뷰 문장을 받아 그 리뷰가 긍정적인지 부정적인지 분류한다.",
    lectures: [14],
    basis: "교재 13.2.1 (3) 텍스트 분석 · 강의록 텍스트분석: 텍스트분류",
    aliases: ["감성인식", "감성 분류"],
  },
  {
    id: "t-machine-translation",
    term: "기계번역",
    en: "machine translation",
    category: "개념",
    short: "문장을 입력받아 같은 의미를 가진 다른 언어의 문장을 생성하는 문제.",
    definition:
      "문장을 입력받아 같은 의미를 가진 다른 언어의 문장을 생성한다. 원래 문장의 의미를 파악한 후 같은 의미의 다른 언어 문장을 생성하는 두 단계가 필요하다. 방언을 표준어로, 어투를 바꾸는 응용에도 적용된다.",
    lectures: [14],
    basis: "교재 13.2.1 (3) 텍스트 분석 · 강의록 텍스트분석: 기계번역",
    aliases: ["NMT", "Neural Machine Translation", "신경망 기반 기계번역"],
  },
  {
    id: "t-text-summarization",
    term: "텍스트 요약",
    en: "text summarization",
    category: "개념",
    short: "긴 분량의 텍스트를 입력받아 짧게 요약된 문장으로 출력하는 문제.",
    definition:
      "신문기사나 논문처럼 긴 분량의 텍스트를 입력받아 짧게 요약된 문장으로 출력하는 문제. 의미와 문맥의 파악뿐 아니라 완성된 문장의 생성 기술도 함께 요구된다.",
    distinctions: [
      {
        from: "추출(extractive) 요약 vs 추상적(abstractive) 요약",
        how: "추출 요약은 가장 적절한 문장을 선택하여 조합한다(기존 문장들의 단순한 편집). 추상적 요약은 새로운 문장을 사용하여 요약한다.",
      },
    ],
    related: ["t-text-analysis"],
    lectures: [14],
    basis: "교재 13.2.1 (3) 텍스트 분석 · 강의록 텍스트분석: 텍스트요약",
    aliases: ["추출 요약", "추상적 요약", "extractive", "abstractive"],
  },

  /* ─────────── 개발 단계: 수집·전처리 ─────────── */
  {
    id: "t-nlp-development-stages",
    term: "NLP 응용을 위한 ML 시스템의 개발 단계",
    category: "개념",
    short: "데이터 수집 → 데이터 전처리 → 데이터 표현 → 데이터 분석(학습).",
    definition:
      "자연어처리 응용을 위한 머신러닝 시스템은 데이터 수집(Corpus collection) → 데이터 전처리(Tokenization, Cleaning, Normalization) → 데이터 표현(One-hot vector, Bag of words, TF-IDF) → 데이터 분석(학습)(Word Embedding, Language model)의 단계로 개발한다. 분석 결과는 문장 유사도, 텍스트 분류, 문장 생성 등에 쓰인다.",
    distinctions: [
      {
        from: "전처리 vs 데이터 표현",
        how: "전처리는 텍스트를 다듬고 토큰으로 나누는 단계, 데이터 표현은 토큰을 숫자 벡터로 바꾸는 단계다. 토큰화는 데이터 표현이 아니다.",
      },
    ],
    related: ["t-corpus", "t-tokenization", "t-one-hot-encoding", "t-word-embedding", "t-language-model"],
    lectures: [14],
    basis: "교재 13.2.2 그림 13-19 · 강의록 NLP 응용을 위한 ML 시스템의 개발단계 · 공식 연습문제 Q1",
  },
  {
    id: "t-corpus",
    term: "말뭉치",
    en: "text corpus",
    category: "개념",
    short: "일반적으로 사용되는 문장들로부터 얻어진 크고 구조화된 텍스트 데이터 집합.",
    definition:
      "일반적으로 사용되는 문장들로부터 얻어진 크고 구조화된 텍스트 데이터 집합. 신문기사·논문·SNS 등 다양한 정보원으로부터 획득한다. 개발자가 직접 수집(crawling)할 수도 있지만 연구용 대규모 말뭉치도 제공된다.",
    example:
      "구글 n-gram 말뭉치, COCA(Corpus of Contemporary American English — 4억 2,500만 개 단어, 1990~2011, 무료 온라인 검색 서비스), 국립국어원 ‘모두의 말뭉치’. 사전 형태의 데이터베이스인 WordNet(“A lexical database for English”)도 분석에 활용된다.",
    related: ["t-nlp-development-stages", "t-tokenization"],
    lectures: [14],
    basis: "교재 13.2.2 (1) 데이터 수집 · 강의록 데이터수집",
    aliases: ["corpus", "텍스트 말뭉치", "COCA", "WordNet"],
  },
  {
    id: "t-tokenization",
    term: "토큰화",
    en: "tokenization",
    category: "개념",
    short: "말뭉치를 의미 있는 기본 단위(“토큰”)로 나누는 전처리 작업.",
    definition:
      "말뭉치를 의미 있는 기본 단위(“토큰”)로 나누는 작업. 토큰의 기준은 문장, 구, 단어, 형태소 등으로 목적과 응용에 따라 달라진다.",
    example:
      "“Time is an illusion.” → “Time”, “is”, “an”, “illusion”. 한국어 “철수는 책을 읽었다.” → 자립형태소(철수, 책), 의존형태소(는, 을, 읽-, 었-, -다)",
    distinctions: [
      {
        from: "데이터 표현",
        how: "토큰화는 나누기만 할 뿐 벡터를 만들지 않는다. 공식 연습문제에서 데이터 표현 방법과 거리가 먼 것으로 출제되었다.",
      },
    ],
    role: "구두점·특수문자($50.50, 25/10/15, AT&T, Ph.D), 줄임말, 단어 내 띄어쓰기를 고려해야 하고, 한국어는 조사·어간과 어미의 분리가 필요하다. 한국어는 이미 개발된 복수 개의 형태소 분석기를 문제에 맞게 선택해 쓰는 흐름이 주를 이룬다.",
    related: ["t-cleaning-normalization", "t-pos-tagging", "t-nlp-development-stages"],
    emphasis: "의존형태소는 목적에 따라 버리거나 살린다 — 주제 분류라면 ‘는·을·었’은 버려도 되지만, 번역에서는 과거를 나타내는 ‘었’을 버리면 안 된다(강의 예시).",
    lectures: [14],
    basis: "교재 13.2.2 (2) 전처리 · 강의록 텍스트전처리 — 토큰화 · 공식 연습문제 Q1",
    aliases: ["token", "토큰", "형태소", "자립형태소", "의존형태소"],
  },
  {
    id: "t-cleaning-normalization",
    term: "정제와 정규화",
    en: "cleaning / normalization",
    category: "개념",
    short: "정제는 분석에 방해되는 노이즈 제거, 정규화는 표현 방법이 다른 단어들을 하나로 통합.",
    definition:
      "정제(cleaning)는 말뭉치로부터 데이터 분석에 방해되는 노이즈 데이터를 제거하는 것이다 — 등장빈도가 적은 단어, 길이가 짧은 단어(it, at, to, on, in, by 등), 정규표현식으로 찾은 해시태그·기사의 날짜 등. 정규화(normalization)는 표현 방법이 다른 단어들을 하나의 단어로 통합시키는 것이다 — US와 USA, 대소문자 통합.",
    distinctions: [
      {
        from: "정제 vs 정규화",
        how: "정제는 지운다, 정규화는 합친다. US·USA를 하나로 만드는 것은 정규화다.",
      },
    ],
    related: ["t-tokenization", "t-pos-tagging"],
    lectures: [14],
    basis: "교재 13.2.2 (2) 전처리 · 강의록 텍스트전처리 — 정제, 정규화",
    aliases: ["cleaning", "normalization", "정제", "정규화"],
  },
  {
    id: "t-pos-tagging",
    term: "품사 태깅",
    en: "part-of-speech tagging",
    category: "개념",
    short: "토큰화된 데이터의 품사를 결정하는 작업.",
    definition:
      "토큰화된 데이터의 품사를 결정하는 작업. 같은 단어라도 품사에 따라 의미가 전혀 달라지는 경우가 있기 때문에 필요하다. 딥러닝을 이용한 자연어처리에서도 기본적인 학습 태스크로 다루어진다.",
    example:
      "영어 ‘fly’는 동사일 때 ‘날다’, 명사일 때 ‘파리’. 강의록 예: “열심히 공부한 당신, 연휴에는 여행을 가봐요” → (‘열심히’,‘부사’), (‘공부’,‘명사’), (‘당신’,‘명사’), (‘여행’,‘명사’), (‘가봐요’,‘동사’) …",
    related: ["t-tokenization", "t-bert-configurations"],
    lectures: [14],
    basis: "교재 13.2.2 (2) 전처리 · 강의록 토큰의 품사 태깅",
    aliases: ["POS tagging", "품사"],
  },

  /* ─────────── 데이터 표현 ─────────── */
  {
    id: "t-one-hot-encoding",
    term: "원핫인코딩(자연어처리)",
    en: "one-hot encoding",
    category: "개념",
    short: "단어집합의 각 단어를 고유 정수로 매핑한 후 원핫벡터로 표현. m개 단어 → m차원.",
    definition:
      "말뭉치로부터 획득한 단어집합의 각 단어를 고유 정수로 매핑한 후 원핫벡터로 표현한다. m개의 단어가 있으면 m차원 원핫벡터가 되고, 그 단어의 인덱스에 해당하는 원소만 1, 나머지는 0이다.",
    example: "9개 단어(먹고0 … 비싸다8)의 말뭉치에서 ‘수박’(인덱스 2) → [0,0,1,0,0,0,0,0,0]",
    distinctions: [
      {
        from: "한계점",
        how: "단어 수가 많아지면 차원이 높아진다. 단어 간 유사도의 반영이 불가능하다 — 서로 다른 두 단어의 원핫 벡터는 겹치는 1이 없다.",
      },
      {
        from: "BoW",
        how: "원핫은 단어 하나를 나타내고 빈도를 담지 않는다. 자주 출현한 단어가 잘 표현되는 것은 BoW의 특성이다.",
      },
    ],
    related: ["t-one-hot", "t-bow", "t-word-embedding"],
    emphasis: "희소해서 효율은 떨어지지만, 실제로도 데이터를 일단 원핫 벡터로 표현한 뒤 추가 작업을 거치므로 가장 기본이 되는 방법이라고 강의에서 강조했다.",
    lectures: [14],
    basis: "교재 13.2.2 (3) 데이터 표현 — 그림 13-20 · 강의록 데이터표현 — 원핫인코딩",
    aliases: ["원핫벡터", "one-hot vector"],
  },
  {
    id: "t-bow",
    term: "BoW",
    en: "Bag of Words",
    category: "개념",
    short: "단어의 출현 빈도수를 고려한 텍스트 표현 방법.",
    definition:
      "단어의 출현 빈도수를 고려한 텍스트 표현 방법. ① 단어집합의 각 단어에 고유한 정수 인덱스를 부여하고 ② 입력 텍스트에서 각 단어의 출현 횟수를 계산한 뒤 ③ 각 단어의 대응 위치(인덱스)에 출현 횟수를 정수값으로 표현한다.",
    example: "“무거운 수박이 크고 수박 가격이 비싸다” → [0, 0, 2, 0, 1, 1, 0, 1, 1] (수박이 두 번 → 인덱스 2의 값 2)",
    distinctions: [
      {
        from: "장단점",
        how: "문서에 자주 출현하는 단어가 잘 표현되지만, 단어의 발생 위치는 고려되지 못한다. 빈도수의 절대값을 그대로 써서 말뭉치 규모에 따라 벡터값이 달라진다.",
      },
      {
        from: "의미",
        how: "BoW는 의미가 아니라 출현 빈도를 담는다.",
      },
    ],
    related: ["t-one-hot-encoding", "t-tf-idf"],
    lectures: [14],
    basis: "교재 13.2.2 (3) 데이터 표현 — 그림 13-20 · 강의록 데이터표현 — BoW · 공식 연습문제 Q2",
    aliases: ["Bag of Words", "백오브워즈"],
  },
  {
    id: "t-tf-idf",
    term: "TF-IDF",
    en: "Term Frequency-Inverse Document Frequency",
    category: "수식·지표",
    short: "문서 내 단어의 빈도수와 그 단어가 나타나는 문서의 빈도를 함께 고려한 표현 방식.",
    definition:
      "문서 내 각 단어의 빈도수(TF)와 문서의 빈도(DF)를 함께 고려한 표현 방식. TF(d, t)는 d번째 문서에 t번째 단어가 나타나는 횟수이고, 이 값들을 원소로 하는 행렬이 문서-단어 행렬(Document-Term Matrix)이다. DF(t)는 단어 t가 나타나는 문서의 개수이며, IDF(t)는 DF(t)에 반비례하는 값이다.",
    formula: [
      { expr: "TF-IDF(d, t) = TF(d, t) × IDF(t) = TF(d, t) × log(N / DF(t))", note: "식 13-1, N은 문서 수" },
    ],
    example:
      "N = 4. ‘토마토’는 문서2에만 → 1 × log₁₀(4/1) = 0.602. ‘수박’은 문서1·3에 → 문서3에서 2 × log₁₀(4/2) = 0.602, 문서1에서 0.301.",
    distinctions: [
      {
        from: "값의 방향",
        how: "특정 문서에 국한된 단어는 큰 값, 일반적인 공용 단어는 낮은 값을 가진다. ‘특정 문서 단어를 작은 값으로’는 반대로 쓴 오답이다.",
      },
      {
        from: "BoW",
        how: "BoW는 빈도의 절대값만 쓰지만, TF-IDF는 많은 문서에 나오는 단어(관사·대명사 등 의미 없는 단어일 가능성)의 값을 낮춘다.",
      },
    ],
    related: ["t-bow", "t-one-hot-encoding"],
    prereqs: ["pre-log-base10"],
    lectures: [14],
    basis: "교재 13.2.2 (3) 데이터 표현 — 그림 13-21, 식 13-1 · 강의록 데이터표현 — TF-IDF · 공식 연습문제 Q2",
    emphasis:
      "교재 그림 13-21은 ‘수박’ 칸을 0.125·0.250으로 인쇄했지만, 식과 DF(수박) = 2로 계산하면 강의록 표처럼 0.301·0.602다. 강의에서는 IDF에 로그를 쓰는 이유(문서 수가 커질 때 값이 지나치게 커지는 것을 막음)와, 실제 계산에서 DF가 0이 되지 않도록 분모에 1을 더한다는 점을 보충했다.",
    aliases: ["TF", "DF", "IDF", "Document-Term Matrix", "문서-단어 행렬", "DTM"],
  },

  /* ─────────── 데이터 분석: 워드 임베딩 ─────────── */
  {
    id: "t-word-embedding",
    term: "워드 임베딩",
    en: "word embedding",
    category: "개념",
    short: "단어의 의미를 포함하는 벡터(“임베딩 벡터”)로 표현하는 방법.",
    definition:
      "단어의 의미를 포함하는 벡터(“임베딩 벡터”)로 표현하는 방법. 원핫벡터를 저차원 실수 공간의 벡터로 변환한다. 원핫벡터가 고차원(=단어집합의 크기)·희소·수동 표현·0과 1인 데 비해, 임베딩 벡터는 저차원·밀집·학습 데이터로부터 학습·실수값이다.",
    role: "목적은 유사한 의미의 단어를 벡터 공간에서 가까운 위치에 표현하는 것, 곧 단어 간의 의미적 유사성을 벡터화하는 것이다. 연속한 실수값을 가지므로 딥러닝 모델의 입력으로 더 적합하다.",
    example: "Word2Vec(CBOW, Skip-gram), LSA(잠재의미분석), GloVe 등",
    distinctions: [
      {
        from: "원핫인코딩",
        how: "임베딩은 원핫벡터를 바탕으로 한 저차원·밀집·실수 벡터다. ‘밀집 고차원’, ‘각 요소가 이진값’은 오답이다.",
      },
      {
        from: "언어 모델",
        how: "워드 임베딩은 단어 하나의 벡터를 만들고, 언어 모델은 단어 시퀀스의 확률을 낸다. BERT는 워드 임베딩의 대표 방법으로 꼽히지 않는다.",
      },
    ],
    related: ["t-word2vec", "t-one-hot-encoding", "t-language-model"],
    prereqs: ["pre-euclidean"],
    emphasis: "강의 보충 — 원핫 벡터는 보통 수십만~수백만 차원, 임베딩 벡터는 보통 300차원 정도. PCA처럼 x에 변환행렬 W를 곱해 저차원 y로 바꾸는 것이라고 설명했다.",
    lectures: [14],
    basis: "교재 13.2.2 (4) 데이터 분석 · 강의록 데이터분석 — 워드 임베딩 · 공식 연습문제 Q2·Q3",
    aliases: ["임베딩 벡터", "embedding vector", "LSA", "GloVe", "잠재의미분석"],
  },
  {
    id: "t-word2vec",
    term: "Word2Vec",
    category: "알고리즘",
    short: "원핫벡터를 저차원 벡터로 변환하는 선형변환행렬 W를 학습으로 찾아 임베딩 벡터를 구하는 방법.",
    definition:
      "원핫벡터를 저차원의 벡터로 변환하는 선형변환행렬 W를 학습으로 찾고, 이를 이용하여 입력 단어를 사영함으로써 임베딩 벡터를 구한다. 말뭉치의 문맥 정보를 활용하여 학습하며, 은닉층이 1개인 간단한 구조의 신경망을 사용한다. projection layer는 일반적인 은닉층과 달리 활성화 함수가 없고 룩업 테이블이라는 연산을 수행한다.",
    example:
      "“The bird with black feathers is on the tree.”에서 sliding window(n = 2), 중심 단어 black, 문맥 단어 bird·with·feathers·is",
    distinctions: [
      {
        from: "CBoW vs Skip-gram",
        how: "CBoW는 주변 단어를 입력으로 중심 단어를 예측하고, Skip-gram은 중심 단어를 입력으로 주변 단어들을 예측한다.",
      },
      {
        from: "언어 모델",
        how: "Word2Vec은 대표적인 워드 임베딩 방법이다. Seq2Seq·Attention·Transformer와 달리 언어 모델로 분류되지 않는다.",
      },
    ],
    related: ["t-cbow-skipgram", "t-word-embedding"],
    prereqs: ["pre-matrix-mult"],
    emphasis: "원핫 벡터는 1인 자리가 하나뿐이라 W 전체를 곱할 필요 없이 그 행만 가져오면 되므로 룩업 테이블과 같다. 벡터의 덧셈·뺄셈도 의미를 가진다 — ‘사랑 − 이별 + 만남 = 인연’(강의 예시).",
    lectures: [14],
    basis: "교재 13.2.2 (4) 데이터 분석 — 그림 13-22·13-23 · 강의록 Word2Vec · 공식 연습문제 Q4",
    aliases: ["word2vec", "projection layer", "투사층", "룩업 테이블", "lookup table"],
  },
  {
    id: "t-cbow-skipgram",
    term: "CBoW와 Skip-gram",
    en: "Continuous Bag of Words / Skip-gram",
    category: "알고리즘",
    short: "Word2Vec의 두 학습 방식. CBoW는 문맥 → 중심 단어, Skip-gram은 중심 단어 → 문맥.",
    definition:
      "Word2Vec은 학습 방식에 따라 두 가지 모델이 있다. CBoW(Continuous Bag of Words)는 주변 단어(문맥 앞뒤의 n개 단어)를 입력으로 받아 중심 단어를 예측한다. Skip-gram은 중심 단어를 입력으로 받아 주변 단어들을 예측한다.",
    example:
      "n = 2, 중심 단어 black → CBoW: (bird, with, feathers, is) → black / Skip-gram: black → (bird, with, feathers, is)",
    related: ["t-word2vec"],
    emphasis: "두 모델 모두 파이썬 패키지로 제공되며, 실제로는 Skip-gram이 조금 더 많이 쓰이는 것으로 보인다고 강의에서 언급했다.",
    lectures: [14],
    basis: "교재 13.2.2 (4) 데이터 분석 — 그림 13-22 · 강의록 Word2Vec",
    aliases: ["CBoW", "CBOW", "Skip-gram", "skipgram", "sliding window", "중심 단어", "문맥 단어"],
  },

  /* ─────────── 언어 모델을 위한 딥러닝 ─────────── */
  {
    id: "t-language-model",
    term: "언어 모델",
    en: "language model",
    category: "개념",
    short: "단어 시퀀스를 입력으로 받아 확률값을 출력하는 일종의 함수.",
    definition:
      "단어 시퀀스를 입력으로 받아 확률값을 출력하는 일종의 함수. P(w₁, …, w_n)은 주어진 단어의 시퀀스가 실제로 사용되는 자연어 표현에서 관찰될 가능성, 즉 자연어 표현으로서 얼마나 적절한지를 평가하는 값이다. 오타, 문법 오류, 의미상 부적절한 표현은 낮은 확률값을 가져야 한다.",
    formula: [
      { expr: "P(w₁, …, w_n) = ∏ᵢ₌₁ⁿ P(wᵢ | w₁, …, wᵢ₋₁)", note: "조건부확률을 이용하는 방법" },
    ],
    role: "구현 방법은 조건부확률을 이용하는 방법과 신경망(딥러닝, 주로 RNN)을 이용하는 방법이 있다. 활용은 문장 생성(요약, 번역 등), 오타 교정.",
    example:
      "P(“나는 버스를 탄다”) > P(“나는 버스를 태운다”), P(“빠르게 달려갔다”) > P(“빠르게 잘려갔다”)",
    distinctions: [
      {
        from: "워드 임베딩",
        how: "임베딩은 단어 하나의 벡터, 언어 모델은 단어 시퀀스의 확률이다.",
      },
    ],
    related: ["t-rnn-language-model", "t-seq2seq", "t-word-embedding"],
    prereqs: ["pre-prob-chain-rule", "pre-conditional-prob"],
    lectures: [14],
    basis: "교재 13.2.3 언어 모델을 위한 딥러닝 · 강의록 언어모델",
    aliases: ["LM", "언어모델"],
  },
  {
    id: "t-rnn-language-model",
    term: "RNN 기반 언어 모델",
    category: "알고리즘",
    short: "LSTM 순환 신경망이 한 번에 한 단어씩 입력받아 바로 다음 단어를 출력하도록 학습하는 언어 모델.",
    definition:
      "LSTM 기반의 순환 신경망을 이용하여 한 번에 한 단어씩 차례로 입력받아 처리한다. 입력 단어는 먼저 원핫벡터로 표현하고 워드 임베딩을 적용해 저차원 실수 벡터를 얻은 뒤 LSTM의 입력으로 전달한다. 각 LSTM 셀은 바로 다음 단어를 출력하도록 학습한다.",
    example: "“The bird with black feathers …”에서 첫 번째 LSTM 셀(입력 The)의 목표 출력은 ‘bird’",
    role: "텍스트 분류(감성분류, 주제분류 등)에도 활용된다 — 리뷰 문장을 입력으로 주고 긍정·부정을 최종 목표 출력으로 학습한다. 문장을 다른 문장으로 바꾸는 문제에는 Seq2Seq으로 확장한다.",
    related: ["t-language-model", "t-lstm", "t-seq2seq"],
    lectures: [14],
    basis: "교재 13.2.3 (1) 언어 모델을 위한 RNN 구조 — 그림 13-24 · 강의록 RNN 기반 언어모델",
  },
  {
    id: "t-seq2seq",
    term: "Seq2Seq 모델",
    en: "Sequence-to-Sequence Model",
    category: "알고리즘",
    short: "입력된 시퀀스로부터 다른 도메인의 시퀀스를 출력하는 인코더-디코더 모델.",
    definition:
      "입력된 시퀀스로부터 다른 도메인의 시퀀스를 출력한다. 인코더와 디코더로 구성되며 각각 RNN(LSTM) 구조를 가진다. 인코더는 임베딩 벡터로 표현된 단어 시퀀스를 입력받아 하나의 벡터로 압축한 문맥 벡터(context vector)를 출력하고, 디코더는 문맥 벡터를 입력받아 단어 벡터를 순차적으로 출력한다.",
    example:
      "“I have the book” → CONTEXT → <sos> J'ai le livre <eos>. 디코더의 최초 입력은 생성을 시작하는 특수 단어 sos(start of sentence), 마지막 출력은 문장의 끝 eos(end of sentence).",
    role: "응용 — 기계번역, 대화, 질의응답, 요약, STT(speech-to-text)",
    distinctions: [
      {
        from: "Attention",
        how: "Seq2Seq은 하나의 고정된 문맥 벡터로 요약·압축하므로 정보 손실이 생기고 입력이 길면 성능이 떨어진다. 이 문제를 Attention이 해결했다 — 반대가 아니다.",
      },
    ],
    related: ["t-context-vector", "t-attention", "t-machine-translation", "t-rnn-language-model"],
    emphasis: "강의 보충 — 2014년 기계번역을 위해 개발되었고, 초기 구글 번역기가 이 모델을 사용했다. 정보 손실은 입력 문장이 길수록 심해진다.",
    lectures: [14],
    basis: "교재 13.2.3 (2) Seq2Seq 모델 — 그림 13-25 · 강의록 Seq2Seq 모델 · 공식 연습문제 Q5",
    aliases: ["seq2seq", "sequence-to-sequence", "인코더", "디코더", "encoder", "decoder", "sos", "eos"],
  },
  {
    id: "t-context-vector",
    term: "문맥 벡터",
    en: "context vector",
    category: "개념",
    short: "Seq2Seq 인코더가 입력 시퀀스를 하나의 벡터로 압축한 결과.",
    definition:
      "Seq2Seq 인코더의 출력으로, 입력 시퀀스를 하나의 벡터로 압축한 것. 디코더의 은닉층 LSTM 셀에 입력으로 들어가 입력 문장의 정보를 전달한다. 교재는 특징벡터(context)라고도 부른다.",
    distinctions: [
      {
        from: "Attention",
        how: "고정된 하나의 벡터에 모든 정보를 담아야 하므로 정보 손실이 생긴다. Attention은 디코더가 매 단계 인코더의 각 셀 정보를 읽어 오게 해 이 병목을 보완한다.",
      },
    ],
    related: ["t-seq2seq", "t-attention"],
    lectures: [14],
    basis: "교재 13.2.3 (2) Seq2Seq 모델 · 강의록 Seq2Seq 모델",
    aliases: ["CONTEXT", "특징벡터"],
  },
  {
    id: "t-attention",
    term: "Attention 모델",
    en: "attention",
    category: "알고리즘",
    short: "디코더에서 출력 단어를 생성할 때마다 인코더의 전체 상태에 선택적 주의를 기울여 정보를 읽어 오는 방식.",
    definition:
      "Seq2Seq 모델의 문제(하나의 고정된 특징벡터로 요약·압축 → 정보 손실, 긴 입력 문장의 성능 저하)를 해결하기 위해 제안되었다. 디코더에서 출력 단어를 생성할 때마다 인코더의 전체 상태에 대한 선택적 주의를 통해 각 셀의 정보를 읽어 오며, 출력 순서에 따라 읽어 오는 정보의 반영 정도를 주의집중 모듈이 자동으로 조절한다.",
    role: "효과가 실험으로 입증되면서 연구가 활발해졌고, 트랜스포머는 RNN 구조를 없애고 잘 설계된 주의집중 모델만 활용했다.",
    related: ["t-seq2seq", "t-context-vector", "t-transformer"],
    emphasis: "디코더가 단어를 만들 때마다 인코더 정보 중 어느 부분을 골라 읽어 올지가 곧 성능 향상의 포인트라고 강의에서 강조했다.",
    lectures: [14],
    basis: "교재 13.2.3 (3) Attention 모델 — 그림 13-26 · 강의록 Attention 모델 · 공식 연습문제 Q5",
    aliases: ["주의집중", "주의집중 모듈", "Attention 모듈"],
  },
  {
    id: "t-transformer",
    term: "Transformer 모델",
    en: "Transformer",
    category: "알고리즘",
    short: "RNN 구조를 없애고 여러 개의 인코더와 Attention만으로 구현한 인코더-디코더 모델.",
    definition:
      "2017년 “Attention is all you need”에서 발표되었다. Seq2Seq 모델의 인코더-디코더 구조를 사용하되 RNN 구조를 없애고 여러 개의 인코더와 Attention만으로 구현했다(인코더 #1~#6, 디코더 #1~#6). 인코더는 한 번에 전체 시퀀스를 입력받으며, 단어의 순서 정보를 나타내기 위해 positional encoding을 사용한다. 디코더는 한 번에 하나씩 순차적으로 생성한다.",
    role: "빠른 학습과 우수한 성능을 보였고, 이후 개발되는 대규모 언어 모델은 트랜스포머 모델에 기반을 둔다.",
    distinctions: [
      {
        from: "인코더 vs 디코더",
        how: "‘한 번에 전체 시퀀스’는 인코더의 입력 방식이고, 디코더는 하나씩 순차적으로 생성한다.",
      },
    ],
    related: ["t-attention", "t-bert", "t-llm"],
    emphasis: "Attention으로 필요한 부분을 골라 읽으면 순서가 덜 중요해져 RNN을 쓰지 않게 되었다(강의는 이를 셀프 어텐션이라 부름). 그래도 순서 정보는 유지해야 해서 positional encoding을 쓴다.",
    lectures: [14],
    basis: "강의록 Transformer 모델 · 교재 13.2.3 (3) Attention 모델 · 13.2.4",
    aliases: ["트랜스포머", "positional encoding", "Attention is all you need"],
  },
  {
    id: "t-bert",
    term: "BERT",
    en: "Bidirectional Encoder Representation from Transformers",
    category: "알고리즘",
    short: "구글이 만든 Transformer 인코더 기반 언어 모델. 사전 학습 후 미세조정.",
    definition:
      "구글에서 만든 언어 모델로, Transformer의 인코더 모델에 기반한다. 3종류의 임베딩을 수행한다. 사전 학습(pre-training) 단계에서 방대한 데이터(책 말뭉치 800M 단어, Wikipedia 2500M)로 언어 모델을 구축하고, 미세조정(fine-tuning) 단계에서 사전에 학습된 모델을 특정 NLP 문제에 맞춰 추가 학습한다. 12개의 자연어처리 문제에서 당시 최고 성능을 기록했다.",
    role: "학습된 모델과 한국어 버전도 제공되어 다양한 자연어처리 문제에 활용된다.",
    distinctions: [
      {
        from: "ELMo, GPT",
        how: "ELMo는 LSTM 기반 Seq2Seq 구조다. BERT와 GPT는 RNN을 사용하지 않는 트랜스포머 기반 모델이다.",
      },
      {
        from: "워드 임베딩",
        how: "BERT는 언어 모델이다. 워드 임베딩의 대표 방법(Word2Vec, LSA, GloVe)과 구분한다.",
      },
    ],
    related: ["t-transformer", "t-pretraining-finetuning", "t-bert-configurations"],
    emphasis: "강의 보충 — 2018년 구글이 발표. 3종류의 임베딩은 위치 정보, 문장 A/B 구분, 서브워드 단위(사전에 없는 단어도 처리). 방대한 사전 학습은 정보를 많이 가진 구글이었기에 가능했다고 덧붙였다.",
    lectures: [14],
    basis: "교재 13.2.4 최신 언어 모델과 활용 — 그림 13-27 · 강의록 BERT",
    aliases: ["ELMo", "GPT", "Bidirectional Encoder Representations from Transformers"],
  },
  {
    id: "t-pretraining-finetuning",
    term: "사전 학습과 미세조정",
    en: "pre-training / fine-tuning",
    category: "학습 유형",
    short: "방대한 데이터로 먼저 충분히 학습한 뒤, 특정 문제에 맞춰 추가 학습하는 전략.",
    definition:
      "방대한 양의 데이터를 이용하여 충분히 학습한 언어 모델을 먼저 구축하고(사전 학습), 특정 문제를 풀고자 할 때 그에 맞는 데이터로 사전에 학습된 모델을 추가로 학습한다(미세조정). BERT가 처음 발표할 때부터 제안한 전략이며, LLM 개발 및 활용의 4단계에서도 앞의 두 단계가 된다.",
    role: "초창기에는 문제에 특화된 모델을 처음부터 설계했으나, 최근에는 대규모 데이터로 충분히 학습된 언어 모델을 활용하는 방식으로 바뀌고 있다.",
    related: ["t-bert", "t-llm-four-stages"],
    lectures: [14],
    basis: "교재 13.2.4 최신 언어 모델과 활용 · 강의록 BERT · LLM 개발 및 활용의 4단계",
    aliases: ["pre-training", "fine-tuning", "사전학습", "미세 조정"],
  },
  {
    id: "t-bert-configurations",
    term: "BERT 모델의 4가지 구성 방식",
    category: "개념",
    short: "NLP 문제 유형에 따라 BERT를 쓰는 네 가지 구조.",
    definition:
      "(a) 두 문장을 입력받아 분류(Sentence Pair Classification) — 문장 간의 유사도 평가, 질의-응답 문장의 적절성 평가. (b) 한 문장을 입력받아 분류(Single Sentence Classification) — 감성 분류, 기사 분류. (c) 하나의 질문과 관련 문단을 입력받아 응답 문장을 출력(Question Answering). (d) 한 문장을 입력받아 각 단어에 대응되는 출력(Single Sentence Tagging) — 품사 태깅.",
    related: ["t-bert", "t-pos-tagging", "t-text-classification"],
    lectures: [14],
    basis: "교재 13.2.4 — 그림 13-28 BERT의 활용 방안 · 강의록 BERT: NLP 문제유형에 따른 BERT 모델의 4가지 구성방식",
  },

  /* ─────────── 대규모 언어 모델 ─────────── */
  {
    id: "t-llm",
    term: "대규모 언어 모델",
    en: "LLM, Large Language Models",
    category: "개념",
    short: "사전 학습된 언어 모델(PLM)의 규모를 확대하여 대용량의 데이터를 학습한 언어 모델.",
    definition:
      "사전 학습된(Pre-trained) 언어 모델(PLM)의 규모를 확대하여 대용량의 데이터를 학습한 언어 모델. 100억 이상의 파라미터를 가지며, 대표적 모델은 GPT3/3.5/…, LLaMA다.",
    example: "PLM — BERT(3.3억), GPT2(15억) / LLM — GPT3(1750억), PaLM(5400억), LLaMA(~650억)",
    distinctions: [
      {
        from: "PLM",
        how: "규모의 차이다. LLM은 PLM의 규모를 확대한 것이며, 소규모 PLM이 가지지 못하는 창발적 능력을 보여 준다.",
      },
    ],
    related: ["t-emergent-ability", "t-llm-four-stages", "t-transformer"],
    emphasis: "강의에서 대규모 언어 모델 단원은 교재에 없는 보충 자료라고 직접 밝혔다. 타임라인에서 2022년 이후 instruction-tuned 모델의 증가와 LLaMA 2 이후 오픈소스 생태계라는 두 흐름을 짚었다.",
    lectures: [14],
    basis: "강의록 대규모언어모델 LLM, Large Language Models",
    aliases: ["LLM", "PLM", "Pre-trained Language Model", "GPT3", "LLaMA", "PaLM"],
  },
  {
    id: "t-emergent-ability",
    term: "창발적 능력",
    en: "emergent ability",
    category: "개념",
    short: "소규모 PLM이 가지지 못하는 새로운 능력/특성을 LLM이 보여 주는 것.",
    definition:
      "LLM이 소규모 PLM이 가지지 못하는 새로운 능력/특성을 보여 주는 것. 문맥/맥락 내 학습(In-context learning)을 통해 새로운 태스크 수행이 가능하다.",
    related: ["t-llm"],
    emphasis: "In-context learning은 모델을 추가 학습(파인튜닝)하지 않고 입력에 예시 몇 가지를 보여 주는 것만으로 새 태스크를 수행하는 능력이라고 강의에서 설명했다.",
    lectures: [14],
    basis: "강의록 대규모언어모델 — LLM의 창발적 능력",
    aliases: ["In-context learning", "문맥 내 학습", "맥락 내 학습"],
  },
  {
    id: "t-llm-four-stages",
    term: "LLM 개발 및 활용의 4단계",
    category: "개념",
    short: "⑴ 사전 학습 → ⑵ 미세조정 → ⑶ 추론 → ⑷ 평가.",
    definition:
      "⑴ 사전 학습 — 대규모 데이터를 이용한 기본 학습(데이터 수집 및 전처리, 모델 아키텍처 및 세부 설정, 학습 기법 설계). ⑵ 미세조정 — 특정 목적에 맞게 성능 개선을 위한 추가 학습(지시학습, 정렬 학습, PEFT). ⑶ 추론 — 학습된 LLM의 활용(프롬프트 엔지니어링, RAG). ⑷ 평가 — 다양한 벤치마크 과제를 통한 성능 평가, 편향성·윤리성·안정성·개인정보 유출 가능성 등 다양한 측면의 평가.",
    distinctions: [
      {
        from: "미세조정 vs 추론",
        how: "미세조정은 모델을 추가 학습시키고, 추론은 학습된 모델을 활용한다. 프롬프트 엔지니어링과 RAG는 추론 단계다.",
      },
    ],
    related: ["t-llm", "t-fine-tuning-methods", "t-prompt-engineering", "t-rag"],
    lectures: [14],
    basis: "강의록 LLM 개발 및 활용의 4단계",
    aliases: ["사전 학습", "미세조정", "추론", "평가", "Inference", "Evaluation"],
  },
  {
    id: "t-fine-tuning-methods",
    term: "지시학습·정렬 학습·PEFT",
    en: "Instruction Tuning / Alignment Tuning / PEFT",
    category: "학습 유형",
    short: "LLM 미세조정 단계의 세 방법.",
    definition:
      "지시학습(Instruction Tuning)은 ‘질문-대답’ 형식에 맞춘 샘플을 이용한 지도학습이다. 정렬 학습(Alignment Tuning)은 인간의 선호에 맞는 응답을 만들기 위한 강화학습이다. 매개변수 효율적 미세조정(PEFT: Parameter-Efficient Fine-Tuning)은 LoRA, Adapters 같은 방법으로 전체 모델을 재학습하지 않고 일부 파라미터만 조정한다.",
    distinctions: [
      {
        from: "학습 유형",
        how: "지시학습은 지도학습, 정렬 학습은 강화학습이다.",
      },
    ],
    related: ["t-llm-four-stages", "t-supervised-learning", "t-reinforcement-learning"],
    lectures: [14],
    basis: "강의록 LLM 개발 및 활용의 4단계 — ⑵ 미세조정",
    aliases: ["Instruction Tuning", "Alignment Tuning", "PEFT", "LoRA", "Adapters", "지시학습", "정렬 학습"],
  },
  {
    id: "t-prompt-engineering",
    term: "프롬프트 엔지니어링",
    en: "prompt engineering",
    category: "개념",
    short: "다양한 과제에 적합한 프롬프트를 설계하는 것. 추론 단계의 방법.",
    definition:
      "다양한 과제에 적합한 프롬프트를 설계하는 것. 제로샷(Zero-shot), 퓨샷(Few-shot), 사고과정 유도 프롬팅(CoT, Chain-of-Thought), ReAct 기법 등이 있다. 사고과정 유도 프롬팅은 프롬프트에 문제 해결 과정을 포함하여 유도한다.",
    example:
      "(a) Few-shot: 예시 답만 → 8 ✗ / (b) Few-shot-CoT: 풀이를 담은 예시 → 4 ✔ / (c) Zero-shot → 8 ✗ / (d) Zero-shot-CoT: “Let's think step by step.” → 4 ✔",
    distinctions: [
      {
        from: "Few-shot vs CoT",
        how: "Few-shot은 예시를 넣는가, CoT는 풀이 과정을 유도하는가의 축이다. 둘은 독립이어서 네 조합이 나온다.",
      },
    ],
    related: ["t-llm-four-stages", "t-rag"],
    emphasis: "강의 보충 — 구글은 CoT로 초등학생 수학 문제 DB의 정답률을 17%에서 58%로 높였다. Zero-shot-CoT는 ‘단계별로 생각해 봐’ 한 줄로 프롬프트를 줄이면서 정확도를 높인다.",
    lectures: [14],
    basis: "강의록 LLM 개발 및 활용의 4단계 — ⑶ 추론 · 프롬프트 엔지니어링",
    aliases: ["CoT", "Chain-of-Thought", "사고과정 유도 프롬팅", "Zero-shot", "Few-shot", "제로샷", "퓨샷", "Few-shot-CoT", "Zero-shot-CoT", "ReAct"],
  },
  {
    id: "t-rag",
    term: "RAG",
    en: "Retrieval-Augmented Generation",
    category: "알고리즘",
    short: "외부 지식을 검색해서, 그 정보를 바탕으로 응답을 생성하는 방식.",
    definition:
      "외부 지식을 검색해서 그 정보를 바탕으로 응답을 생성하는 방식. LLM의 사실성 문제와 환각(hallucination) 현상을 해결하기 위한 접근 방식이다. 구성요소(단계별 절차)는 입력(사용자의 질문·쿼리) → 인덱싱(관련 문서를 청킹하여 색인화) → 검색(쿼리와 관련된 문서 검색) → 생성(쿼리와 검색된 문서를 프롬프트와 함께 LLM에 입력하여 응답 생성)이다.",
    distinctions: [
      {
        from: "미세조정",
        how: "RAG는 학습된 LLM을 활용하는 추론 단계의 방법이다. 모델을 추가 학습시키지 않는다.",
      },
    ],
    related: ["t-llm-four-stages", "t-prompt-engineering"],
    emphasis: "강의 보충 — 학습 데이터가 고정되어 낡거나 빠지는 정보와 환각이 생기므로 필요하다. 인덱싱은 청크를 임베딩 벡터로 만들어 벡터 DB에 저장하고, 검색은 쿼리 벡터와의 유사성으로 찾는다. 법률·의료·산업 설비처럼 높은 신뢰가 필요한 분야의 핵심 기술.",
    lectures: [14],
    basis: "강의록 RAG Retrieval-Augmented Generation",
    aliases: ["검색 증강 생성", "검색 기반 생성", "hallucination", "환각", "청킹", "chunking"],
  },
];
