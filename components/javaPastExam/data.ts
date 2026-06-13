import type {
  JavaChoiceKey,
  JavaCodeBlock,
  JavaPastExamQuestion,
  JavaPastExamYear,
} from "./types";

const labels: Record<JavaChoiceKey, string> = {
  "1": "①",
  "2": "②",
  "3": "③",
  "4": "④",
};

type Spec = {
  year: JavaPastExamYear;
  number: number;
  lectureId: number;
  tag: string;
  prompt: string;
  choices: [string, string, string, string];
  correct: JavaChoiceKey;
  codeBlocks?: JavaCodeBlock[];
  skill?: string;
};

const lectureConcept: Record<number, string> = {
  1: "Java와 객체지향 프로그래밍",
  2: "Java 기본 문법",
  3: "배열·클래스 기초",
  4: "클래스와 상속",
  5: "인터페이스와 다형성",
  6: "제네릭과 람다식",
  7: "패키지와 예외처리",
  8: "java.lang 패키지",
  9: "java.io 패키지와 스트림",
  10: "java.nio 패키지",
  11: "컬렉션",
  12: "컬렉션과 스트림",
  13: "멀티 스레드 프로그래밍",
  14: "JDBC 프로그래밍",
  15: "라이브러리와 모듈",
};

const conceptBasis: Record<string, string> = {
  "Java 플랫폼": "JDK, Java VM, Java Platform은 Java 프로그램 작성과 실행에 필요한 구성요소이며, JavaScript용 도구는 Java 실행 환경이 아니다.",
  "배열": "배열은 같은 자료형 원소를 고정 길이로 다루며, 선언·생성·초기화 문법과 차원 수가 일치해야 한다.",
  "출력문": "println은 하나의 인수를 받으므로 여러 값을 출력하려면 문자열 연결 연산으로 하나의 표현식을 만들어야 한다.",
  "객체 생성": "new 표현식은 객체를 생성하고 생성자를 호출하며, 변수에는 객체 자체가 아니라 참조값이 저장된다.",
  "접근 제어": "public, protected, private, 생략 접근은 필드와 메소드의 사용 범위를 제한하는 접근 제어자이다.",
  "상속·구현": "클래스는 하나의 클래스를 extends로 상속하고, 인터페이스는 implements로 구현하며, 인터페이스끼리는 extends로 확장한다.",
  "추상 클래스와 인터페이스": "추상 클래스와 인터페이스는 직접 객체 생성 가능 여부, 필드·메소드 규칙, default 메소드 허용 여부로 구분한다.",
  "오버라이딩": "오버라이딩은 부모 메소드를 자식 클래스에서 같은 시그니처와 호환 반환형·접근 범위로 다시 정의하는 것이다.",
  "익명 클래스": "익명 클래스는 이름 없는 하위 클래스를 정의하면서 동시에 객체를 생성하는 표현이다.",
  "제네릭": "제네릭은 타입 매개변수로 컬렉션 원소 타입을 제한해 캐스팅과 타입 오류를 줄이며, raw 타입과 구분해야 한다.",
  "main 메소드": "응용 프로그램 시작점은 public static void main(String[] args) 형태이며, args는 문자열 배열이다.",
  "try-catch-finally": "try에서 예외가 발생하면 catch가 처리하고 finally는 마지막에 실행된다. 예외 타입과 변수 선언 문법도 함께 맞아야 한다.",
  "String": "String은 불변 객체이며 문자열 비교, 검색, 추출 메소드를 제공한다. 문자열 변경이 많은 경우 StringBuffer/StringBuilder를 구분한다.",
  "박싱": "박싱은 기본형 값을 래퍼 클래스 객체로 감싸는 변환이고, parseInt나 valueOf처럼 문자열 변환·파싱과 다르다.",
  "입출력 스트림": "java.io는 바이트 스트림과 문자 스트림을 구분하며, 파일 입출력 대상에 맞는 FileInputStream/FileOutputStream 또는 FileReader/FileWriter를 선택한다.",
  "java.nio": "Path는 파일 경로를 표현·조작하고, FileChannel과 Buffer는 채널 기반 입출력에서 사용된다.",
  "컬렉션": "Set은 중복 없는 집합, List는 순서 있는 목록, Map은 key-value 쌍을 다루므로 자료 구조의 의미와 메소드가 다르다.",
  "for-each": "향상된 for문은 for (원소자료형 변수 : 배열또는컬렉션) 형태로 순회한다.",
  "스레드": "Thread/Runnable, run, start, yield, join, synchronized, throws는 스레드 생성·제어·동기화의 핵심 키워드이다.",
  "AWT 이벤트": "AWT GUI는 컨트롤, 컨테이너, 배치관리자, 이벤트 소스와 리스너 인터페이스의 연결로 동작한다.",
  "JDBC": "JDBC는 DriverManager, Connection, Statement/PreparedStatement, ResultSet으로 DB 연결과 SQL 실행 결과 처리를 수행한다.",
};

function basisFor(spec: Spec) {
  return `강의와 교재의 ${lectureConcept[spec.lectureId]} 개념에서는 ${conceptBasis[spec.tag] ?? spec.tag} 이 문항은 ${spec.tag}의 정의와 코드 적용 조건을 함께 묻는다.`;
}

const choiceRules: Record<string, string> = {
  "Java 플랫폼": "Java 프로그램을 작성·실행하는 도구 묶음인지",
  "배열": "배열 선언, 생성식, 초기화 블록, 차원 수가 Java 문법에 맞는지",
  "출력문": "println에 전달되는 값이 하나의 Java 표현식인지",
  "객체 생성": "new 표현식의 메모리 할당, 참조 저장, 생성자 호출 단계와 맞는지",
  "접근 제어": "접근 제어자의 공개 범위가 public부터 private까지 어떻게 제한되는지",
  "상속·구현": "클래스와 인터페이스가 각각 extends와 implements를 올바르게 쓰는지",
  "추상 클래스와 인터페이스": "직접 객체 생성 가능 여부와 인터페이스 멤버 규칙에 맞는지",
  "오버라이딩": "메소드 시그니처, 반환형, 접근 범위가 부모 메소드 재정의 조건을 만족하는지",
  "익명 클래스": "이름 없는 하위 클래스를 선언하면서 객체를 생성하는 형태인지",
  "제네릭": "타입 매개변수에 참조형을 쓰고 raw 타입의 캐스팅 위험을 피하는지",
  "main 메소드": "시작점 매개변수가 String 배열 형태인지",
  "try-catch-finally": "예외 처리 블록 순서, catch 매개변수, throws 전파 규칙에 맞는지",
  "String": "불변 객체, 참조 비교, 내용 비교, StringBuffer와의 역할 차이를 구분하는지",
  "박싱": "기본형 값을 래퍼 클래스 객체로 감싸는 변환인지",
  "입출력 스트림": "문자 스트림과 바이트 스트림 중 파일 처리 단위에 맞는 클래스를 고르는지",
  "java.nio": "Path, Buffer, Channel이 경로 표현·버퍼 저장·채널 전송 중 어떤 역할인지",
  "컬렉션": "List, Set, Map의 저장 의미와 구현 클래스·메소드가 맞는지",
  "for-each": "콜론 왼쪽에 원소 변수, 오른쪽에 배열이나 컬렉션을 두는지",
  "스레드": "Thread/Runnable, yield, join, synchronized의 역할과 선언 위치가 맞는지",
  "AWT 이벤트": "컴포넌트 계층, 배치관리자, 이벤트 소스와 리스너 등록 관계가 맞는지",
  "JDBC": "Connection, Statement/PreparedStatement, ResultSet, execute 계열 메소드의 순서와 역할이 맞는지",
};

function isNegativePrompt(prompt: string) {
  return /잘못|아닌|적당하지|필요한 것이 아닌/.test(prompt);
}

function isDifferencePrompt(prompt: string) {
  return /다른 하나|결과가 다른/.test(prompt);
}

function correctReasonFor(spec: Spec, text: string) {
  const rule = choiceRules[spec.tag] ?? `${spec.tag}의 강의 개념`;
  if (isNegativePrompt(spec.prompt)) {
    return `${text}은/는 ${rule}라는 기준에서 어긋나므로, 부정형으로 묻는 이 문항의 정답이다.`;
  }
  if (isDifferencePrompt(spec.prompt)) {
    return `${text}은/는 ${rule}를 적용했을 때 다른 보기와 구별되는 실행 결과를 만들기 때문에 정답이다.`;
  }
  return `${text}은/는 ${rule}라는 기준을 충족하므로 정답이다.`;
}

function wrongReasonFor(spec: Spec, text: string) {
  const rule = choiceRules[spec.tag] ?? `${spec.tag}의 강의 개념`;
  if (isNegativePrompt(spec.prompt)) {
    return `${text}은/는 ${rule}라는 기준에 부합하므로, 잘못된 설명이나 예외 항목을 찾는 이 문항에서는 제외된다.`;
  }
  if (isDifferencePrompt(spec.prompt)) {
    return `${text}은/는 ${rule}를 적용했을 때 정답 보기처럼 결과 차이를 만드는 후보가 아니다.`;
  }
  return `${text}은/는 ${rule}라는 조건 중 하나가 맞지 않아 정답 후보에서 제외된다.`;
}

function makeQuestion(spec: Spec): JavaPastExamQuestion {
  const concept = lectureConcept[spec.lectureId];
  const correctText = spec.choices[Number(spec.correct) - 1];
  return {
    id: `java-${spec.year}-${spec.number}`,
    year: spec.year,
    semester: "1",
    examName: `${spec.year}학년도 1학기 기말`,
    number: spec.number,
    prompt: spec.prompt,
    codeBlocks: spec.codeBlocks,
    choices: spec.choices.map((text, index) => {
      const key = String(index + 1) as JavaChoiceKey;
      const verdict = key === spec.correct ? "correct" : "wrong";
      return {
        key,
        label: labels[key],
        text,
        explanation: {
          verdict,
          reason:
            verdict === "correct"
              ? correctReasonFor(spec, correctText)
              : wrongReasonFor(spec, text),
          conceptBasis: basisFor(spec),
        },
      };
    }),
    correctChoice: spec.correct,
    lectureRefs: [
      {
        lectureId: spec.lectureId,
        label: `${spec.lectureId}강 ${concept}`,
        href: `/java/lecture/${spec.lectureId}`,
        concept: spec.tag,
      },
    ],
    conceptTags: Array.from(new Set([spec.tag, concept])),
    basis: basisFor(spec),
    examSkill: spec.skill ?? `${spec.tag}을 코드·선택지 조건으로 판별`,
    answerSourceInternal: `기출정답 ${spec.year}학년도 1학기 Java프로그래밍 행`,
    questionSourceInternal: `${spec.year}학년도 1학기 Java프로그래밍 기말 ${spec.number}번`,
  };
}

const specs: Spec[] = [
  { year: 2017, number: 36, lectureId: 4, tag: "객체 생성", prompt: "다음 문장에 관한 설명으로 잘못된 것은?", codeBlocks: [{ title: "객체 생성 문장", code: "Circle c = new Circle(5);" }], choices: ["c는 참조형 변수이다.", "객체가 사용할 메모리 공간이 할당되었다.", "객체의 초기화 블록이 할당되고 실행된다.", "Circle 클래스의 생성자가 실행된다."], correct: "3" },
  { year: 2017, number: 37, lectureId: 3, tag: "접근 제어", prompt: "클래스의 데이터 필드나 메소드를 정의할 때 가장 넓은 사용 범위를 제공하는 접근제어자는 무엇인가?", choices: ["생략", "protected", "private", "public"], correct: "4" },
  { year: 2017, number: 38, lectureId: 5, tag: "추상 클래스와 인터페이스", prompt: "추상 클래스와 인터페이스에 관한 설명이다. 잘못된 것은?", choices: ["인터페이스는 public static final인 데이터 필드만 포함할 수 있다.", "인터페이스에서 default 메소드나 static 메소드는 몸체가 구현되어야 한다.", "추상 클래스를 사용하여 객체를 생성할 수 있다.", "추상 클래스는 몸체가 구현된 메소드를 포함할 수 있다."], correct: "3" },
  { year: 2017, number: 39, lectureId: 5, tag: "상속·구현", prompt: "A와 B가 클래스이고 X, Y, Z가 인터페이스라고 가정할 때, 다음 중 잘못된 것을 모두 고른 것은?", codeBlocks: [{ title: "상속과 구현 후보", code: "class A extends B { }      // a\nclass A implements X, Y { } // b\ninterface X extends Y, Z { } // c\ninterface X extends A { }   // d" }], choices: ["d", "b, c", "b, d", "c, d"], correct: "1" },
  { year: 2017, number: 40, lectureId: 5, tag: "익명 클래스", prompt: "아래 프로그램 조각에서 굵게 표시된 객체 생성 구문의 의미를 바르게 설명한 것은?", codeBlocks: [{ title: "익명 클래스 객체 생성", code: "CSuper sub = new CSuper() {\n  public int b = 20;\n  public void method1() { System.out.println(\"sub1\"); }\n  public void method3() { System.out.println(\"sub3\"); }\n};" }], choices: ["CSuper 클래스를 정의하며 동시에 객체를 생성한다.", "CSuper 클래스를 상속받는 익명 클래스를 정의하며 동시에 객체를 생성한다.", "CSuper 클래스와 익명 클래스로부터 다중 상속받는 객체를 생성한다.", "CSuper 클래스를 매개변수화하였으며 객체 생성 시 자료형을 제공한다."], correct: "2" },
  { year: 2017, number: 41, lectureId: 6, tag: "main 메소드", prompt: "main 함수의 정의를 위해 밑줄 친 ㄱ에 들어가야 할 내용은 무엇인가?", choices: ["Char[] args", "String args", "String[] args", "String[] args[]"], correct: "3" },
  { year: 2017, number: 42, lectureId: 6, tag: "제네릭", prompt: "명시적 형변환을 하지 않아서 컴파일 오류를 일으키는 문장은 무엇인가?", codeBlocks: [{ title: "Raw 타입과 제네릭 타입", code: "List list1 = new ArrayList();\nlist1.add(\"Hello\");      // a\nString s1 = list1.get(0); // b\n\nList<String> list2 = new ArrayList<String>();\nlist2.add(\"Java\");       // c\nString s2 = list2.get(0); // d" }], choices: ["a", "b", "c", "d"], correct: "2" },
  { year: 2017, number: 43, lectureId: 7, tag: "try-catch-finally", prompt: "try-catch-finally 구문의 실행에 관한 설명이다. 잘못된 것은?", choices: ["try 블록 실행 중 예외가 발생하면 try 블록은 즉시 종료된다.", "try 블록 실행 중 예외가 발생하지 않으면 어떤 catch 블록도 실행되지 않는다.", "finally 블록은 가장 마지막에 항상 실행된다.", "예외처리 코드를 작성할 때 finally 블록을 생략해서는 안 된다."], correct: "4" },
  { year: 2017, number: 44, lectureId: 8, tag: "String", prompt: "String 클래스에 관한 설명으로 잘못된 것은?", choices: ["java.lang 패키지에 존재하며 문자열을 표현하는 클래스이다.", "문자열의 비교, 검색, 추출 등을 위한 메소드를 제공한다.", "객체 생성 이후 문자열을 수정할 수 없는 immutable 클래스이다.", "문자열을 빈번하게 변경하는 프로그램에서 사용하면 실행 효율이 좋아진다."], correct: "4" },
  { year: 2017, number: 45, lectureId: 8, tag: "박싱", prompt: "기본형 데이터 값을 포장 클래스의 객체로 변환하는 것을 박싱이라고 한다. 다음 중 박싱이 발생하는 것은?", choices: ["String s = Integer.toString(23);", "int n = Integer.parseInt(\"34\");", "Integer i = new Integer(10);", "String s = String.valueOf(34);"], correct: "3" },
  { year: 2017, number: 46, lectureId: 9, tag: "입출력 스트림", prompt: "텍스트 파일을 다루기 위한 기본 스트림 중 하나로서 문자 단위로 파일에 출력할 때 사용해야 하는 클래스는 무엇인가?", choices: ["FileInputStream", "FileWriter", "BufferedReader", "PrintWriter"], correct: "2" },
  { year: 2017, number: 47, lectureId: 10, tag: "java.nio", prompt: "java.nio.file 패키지에 있는 Path 인터페이스에 관한 설명이다. 잘못된 것은?", choices: ["java.io.File 클래스를 대체할 수 있다.", "파일시스템에 존재하는 파일이나 디렉터리의 경로를 표현한다.", "경로의 생성, 조작/비교, 경로 요소 조회 기능을 제공한다.", "파일 내용의 읽기와 쓰기 기능을 제공한다."], correct: "4" },
  { year: 2017, number: 48, lectureId: 12, tag: "for-each", prompt: "for-each 구문을 사용하여 컬렉션 객체에 저장된 원소를 차례로 하나씩 다룬다고 할 때 밑줄 부분에 들어갈 내용으로 적합한 것은?", codeBlocks: [{ title: "for-each 문맥", code: "List<String> list = new ArrayList<String>();\nfor ( ________ ) {\n  System.out.println(element);\n}" }], choices: ["list : String element", "String element : list", "int element : list", "int i=0; i<=list.length; i++"], correct: "2" },
  { year: 2017, number: 49, lectureId: 11, tag: "컬렉션", prompt: "컬렉션 중 하나인 ArrayList 클래스에 관한 설명으로 적당하지 않은 것은?", choices: ["List 인터페이스를 구현한 클래스이다.", "여러 원소를 저장하기 위해 배열을 사용한다.", "원소의 순서가 의미를 가진다.", "같은 자료를 중복으로 저장할 수 없다."], correct: "4" },
  { year: 2017, number: 50, lectureId: 11, tag: "컬렉션", prompt: "Map 인터페이스에 관한 설명이다. 잘못된 것은?", choices: ["Map은 컬렉션을 다루기 위한 인터페이스이다.", "Map 유형의 컬렉션에서 원소의 형태는 (key, value)이다.", "LinkedList는 해싱을 이용하여 Map을 구현한 클래스이다.", "컬렉션에 원소를 저장할 때 put(), 조회할 때 get() 메소드를 사용한다."], correct: "3" },
  { year: 2017, number: 51, lectureId: 7, tag: "try-catch-finally", prompt: "예외의 전파를 위해 밑줄 친 ㄱ에 들어가야 할 키워드는 무엇인가?", choices: ["throw", "throws", "synchronize", "interrupt"], correct: "2" },
  { year: 2017, number: 52, lectureId: 13, tag: "스레드", prompt: "두 스레드 t1과 t2가 종료될 때까지 main 스레드가 기다리기 위해 밑줄 친 ㄴ에 들어가야 할 문장은 무엇인가?", choices: ["Thread.sleep();", "Thread.sleep(t1); Thread.sleep(t2);", "t1.sleep(); t2.sleep();", "t1.join(); t2.join();"], correct: "4" },
  { year: 2017, number: 53, lectureId: 13, tag: "스레드", prompt: "스레드 생성을 위해 MyThread1 클래스를 정의하였다. 밑줄 친 ㄷ에 들어갈 단어는 무엇일까?", choices: ["Object", "Thread", "Process", "Runnable"], correct: "2" },
  { year: 2017, number: 54, lectureId: 13, tag: "스레드", prompt: "run() 메소드는 Thread.yield()를 실행한다. 이것의 의미를 정확히 설명한 것은?", choices: ["현재 스레드의 우선 순위를 변경시킨다.", "실행을 잠시 멈추고 다른 스레드에게 CPU를 양보한다.", "공유 자원에 배타적으로 접근할 수 있게 요청한다.", "중단되었던 다른 스레드를 깨워 실행가능 상태로 만든다."], correct: "2" },
  { year: 2017, number: 55, lectureId: 15, tag: "AWT 이벤트", prompt: "GUI 컴포넌트의 클래스 계층 구조에서 Container 클래스의 자식 클래스가 아닌 것은?", choices: ["Frame", "Panel", "Window", "List"], correct: "4" },
  { year: 2017, number: 56, lectureId: 15, tag: "AWT 이벤트", prompt: "Checkbox와 버튼들이 한 행 흐름으로 배치된 결과를 보고 판단할 때, 프로그램에서 사용된 배치관리자는 무엇이라 생각되는가?", choices: ["GridLayout", "FlowLayout", "BorderLayout", "SpringLayout"], correct: "2" },
  { year: 2017, number: 57, lectureId: 15, tag: "AWT 이벤트", prompt: "이벤트 처리에 관한 설명이다. 잘못된 것은 무엇인가?", choices: ["이벤트 처리를 위해선 이벤트 소스에 리스너 객체를 등록해야 한다.", "하나의 이벤트 소스에는 하나의 이벤트 처리만 등록할 수 있다.", "이벤트 클래스에 대응되는 리스너 인터페이스가 존재한다.", "2개 이상의 추상 메소드를 가지는 리스너 인터페이스를 위해 어댑터 클래스가 존재한다."], correct: "2" },
  { year: 2017, number: 58, lectureId: 15, tag: "AWT 이벤트", prompt: "버튼 컴포넌트 aButton에 ActionEvent를 등록하는 문장이다. 클래스 A에서 구현해야 하는 인터페이스는 무엇인가?", codeBlocks: [{ title: "이벤트 등록", code: "aButton.addActionListener(new A());" }], choices: ["Action", "ActionEvent", "ActionAdapter", "ActionListener"], correct: "4" },
  { year: 2017, number: 59, lectureId: 14, tag: "JDBC", prompt: "JDBC 예제에서 밑줄 친 ㄱ, ㄴ, ㄷ에 들어갈 단어를 순서대로 정확하게 나열한 것은?", choices: ["Connection / Statement / ResultSet", "Connection / PreparedStatement / ResultSet", "ConnectionEvent / Statement / ResultStore", "ConnectionPool / PreparedStatement / ResultStore"], correct: "1" },
  { year: 2017, number: 60, lectureId: 14, tag: "JDBC", prompt: "JDBC 예제에서 SELECT 질의를 실행하는 밑줄 친 ㄹ에 들어갈 메소드의 이름은 무엇인가?", choices: ["execute", "executeQuery", "executeUpdate", "executeSql"], correct: "2" },

  { year: 2018, number: 36, lectureId: 1, tag: "Java 플랫폼", prompt: "Java 프로그램을 실습하기 위해 필요한 것이 아닌 것은?", choices: ["Java Platform", "Java VM", "JDK", "Eclipse for JavaScript"], correct: "4" },
  { year: 2018, number: 37, lectureId: 3, tag: "배열", prompt: "배열을 사용하는 다음 문장 중 잘못된 것은?", choices: ["int[] a = new int[10];", "int b[] = { 1, 2, 3, 4 };", "int[] c; c = {1, 2, 3, 4};", "int[][] d = new int[10][];"], correct: "3" },
  { year: 2018, number: 38, lectureId: 2, tag: "출력문", prompt: "int형 변수 i와 j 값을 각각 출력하기 위해 적당한 출력문은 무엇인가?", choices: ["System.out.println(i + j);", "System.out.println(i + \",\" + j);", "System.out.println(i, j);", "System.out.println(i, \",=\", j);"], correct: "2" },
  { year: 2018, number: 39, lectureId: 5, tag: "상속·구현", prompt: "B와 C가 클래스이고 Y와 Z가 인터페이스라고 가정할 때, 다음 중 올바른 것을 모두 고른 것은?", codeBlocks: [{ title: "상속과 구현 후보", code: "class A extends B, C { }      // a\nclass A extends B, Y { }      // b\nclass A implements Y, Z { }   // c\ninterface X extends Y, Z { }  // d" }], choices: ["a, b", "a, d", "c", "c, d"], correct: "4" },
  { year: 2018, number: 40, lectureId: 4, tag: "오버라이딩", prompt: "부모 클래스의 protected double compute(int x, int y)를 서브 클래스에서 재정의하기 위한 메소드 형식으로 적합한 것을 모두 고른 것은?", choices: ["a", "a, b", "a, b, c", "c, d"], correct: "2" },
  { year: 2018, number: 41, lectureId: 5, tag: "익명 클래스", prompt: "프로그램 조각에서 굵게 표시된 객체 생성 구문의 의미를 바르게 설명한 것은?", choices: ["CSuper 클래스를 정의하며 동시에 객체를 생성한다.", "CSuper 인터페이스를 구현하는 익명 클래스를 정의하며 동시에 객체를 생성한다.", "CSuper 클래스를 상속받는 익명 클래스를 정의하며 동시에 객체를 생성한다.", "CSuper 클래스를 매개변수화하였으며 객체 생성 시 자료형을 제공한다."], correct: "3" },
  { year: 2018, number: 42, lectureId: 5, tag: "익명 클래스", prompt: "AnonymousTest.java를 컴파일하면 몇 개의 class 파일이 생성되는가?", choices: ["1개", "2개", "3개", "4개"], correct: "3" },
  { year: 2018, number: 43, lectureId: 5, tag: "추상 클래스와 인터페이스", prompt: "추상 클래스 또는 인터페이스에 관한 일반적 설명이다. 잘못된 것은?", choices: ["의미적으로 유사한 클래스를 묶고자 할 때 추상 클래스를 사용한다.", "인터페이스와 다르게 추상 클래스는 인스턴스를 생성시킬 수 있다.", "인터페이스는 public static final인 데이터 필드만 포함할 수 있다.", "추상 클래스나 인터페이스는 자식 클래스로 상속되어 사용된다."], correct: "2" },
  { year: 2018, number: 44, lectureId: 6, tag: "제네릭", prompt: "Data가 제네릭 클래스일 때 `Data<int> d = new Data<>();` 문장의 문제점을 바르게 설명한 것은?", choices: ["제네릭 클래스의 타입 매개변수로 기본 자료형을 사용할 수 없다.", "대입 연산자 우측의 <>를 <int>로 바꾸어야 한다.", "Raw 타입을 사용하는 경우 타입 매개변수는 Object이어야 한다.", "문제가 없다."], correct: "1" },
  { year: 2018, number: 45, lectureId: 8, tag: "String", prompt: "보기의 내용이 밑줄 부분에 들어간다고 할 때 결과가 다른 하나는 무엇인가?", codeBlocks: [{ title: "String 비교 문맥", code: "String str1 = new String(\"Java\");\nString str2 = str1;\nString str3 = new String(\"Java\");\nSystem.out.println( ________ );" }], choices: ["str1==str2", "str2==str3", "str1.equals(str2)", "str2.equals(str3)"], correct: "2" },
  { year: 2018, number: 46, lectureId: 8, tag: "String", prompt: "String과 StringBuffer 클래스에 관한 설명이다. 잘못된 것은?", choices: ["String 클래스는 문자열의 비교, 검색, 추출 메소드를 제공한다.", "문자열을 빈번하게 변경하는 프로그램에서는 String 클래스를 사용하는 것이 좋다.", "StringBuffer 클래스는 문자열의 삽입, 삭제, 대체 메소드를 제공한다.", "StringBuffer 객체는 내부적으로 문자열 저장을 위한 버퍼를 가진다."], correct: "2" },
  { year: 2018, number: 47, lectureId: 9, tag: "입출력 스트림", prompt: "파일을 데이터 소스로 하여 바이트 단위 입력을 수행할 때 필요한 클래스는 무엇인가?", choices: ["FileReader", "FileInputStream", "File", "Path"], correct: "2" },
  { year: 2018, number: 48, lectureId: 10, tag: "java.nio", prompt: "프로그램 조각에서 명시적으로 나타나 있지 않은 내용은 무엇인가?", choices: ["charset에 지정된 문자 세트로 문자열을 인코딩한다.", "인코딩된 문자열을 buffer에 저장한다.", "buffer에 저장된 데이터를 파일에 기록한다.", "파일에 있는 데이터를 읽어 buffer에 기록한다."], correct: "4" },
  { year: 2018, number: 49, lectureId: 11, tag: "컬렉션", prompt: "자료의 순서는 의미가 없고 자료 중복을 허용하지 않는 자료를 관리하기 위한 컬렉션 인터페이스는 무엇인가?", choices: ["Set", "List", "Queue", "Map"], correct: "1" },
  { year: 2018, number: 50, lectureId: 11, tag: "컬렉션", prompt: "컬렉션 인터페이스 또는 클래스의 사용 예를 보여주는 보기 중 잘못된 것은 무엇인가?", choices: ["Set<Integer> set = new HashSet<>();", "List<Integer> set = new ArrayList<Integer>();", "Queue<Integer> set = new LinkedList<>();", "Map<String> set = new HashMap<>();"], correct: "4" },
  { year: 2018, number: 51, lectureId: 13, tag: "스레드", prompt: "Thread.yield()의 기능을 바르게 설명한 것은?", choices: ["현재 스레드의 우선 순위를 낮추어 이름을 교대로 출력시킨다.", "현재 스레드가 잠시 CPU를 양보함으로써 이름을 교대로 출력시킨다.", "한 스레드가 이름을 10회 모두 출력시킨 후 다음 스레드가 이름을 출력하게 한다.", "문자열 finished를 가장 마지막에 출력시킨다."], correct: "2" },
  { year: 2018, number: 52, lectureId: 13, tag: "스레드", prompt: "mythread1.join()과 mythread2.join()의 기능을 바르게 설명한 것은?", choices: ["중단되었던 메인 스레드를 깨워 finished를 가장 처음에 출력시킨다.", "두 스레드가 자발적으로 CPU를 양보함으로써 finished를 마지막에 출력시킨다.", "두 스레드가 종료될 때까지 기다린 후 메인 스레드가 finished를 마지막에 출력시킨다.", "두 스레드가 공유하는 자원에 배타적 접근을 보장한다."], correct: "3" },
  { year: 2018, number: 53, lectureId: 7, tag: "try-catch-finally", prompt: "예외의 전파를 위해 밑줄 친 부분에 들어가야 할 내용으로 적당한 것은?", choices: ["throws", "extends", "throws ArithmeticException", "throws InterruptedException"], correct: "4" },
  { year: 2018, number: 54, lectureId: 15, tag: "AWT 이벤트", prompt: "그림이 보여주는 AWT 컨트롤 클래스는 무엇인가?", choices: ["Button", "Canvas", "Choices", "List"], correct: "4" },
  { year: 2018, number: 55, lectureId: 15, tag: "AWT 이벤트", prompt: "그림의 항목을 마우스로 선택할 때와 더블 클릭할 때 발생하는 이벤트는 각각 무엇인가?", choices: ["ActionEvent / ItemEvent", "ItemEvent / ActionEvent", "KeyEvent / ActionEvent", "ItemEvent / WindowEvent"], correct: "2" },
  { year: 2018, number: 56, lectureId: 15, tag: "AWT 이벤트", prompt: "프로그램 결과 화면을 보고 판단할 때 사용된 배치관리자는 무엇이라 생각되는가?", choices: ["GridLayout", "FlowLayout", "BorderLayout", "ButtonAreaLayout"], correct: "1" },
  { year: 2018, number: 57, lectureId: 15, tag: "AWT 이벤트", prompt: "프레임 윈도우의 닫기 버튼을 눌렀을 때 윈도우를 종료시키려면 먼저 WindowListener 인터페이스를 구현하는 클래스가 필요하다. 밑줄 친 ㄱ에 들어갈 내용은?", choices: ["implements WindowListener", "implements WindowAdapter", "extends WindowListener", "extends WindowAdapter"], correct: "4" },
  { year: 2018, number: 58, lectureId: 15, tag: "AWT 이벤트", prompt: "이벤트 등록을 위해 밑줄 친 ㄴ에 들어갈 내용은?", choices: ["addWindowListener(new MyListener())", "addWindowListener(new MyFrame())", "addWindowAdapter(new MyListener())", "addWindowAdapter(new MyFrame())"], correct: "1" },
  { year: 2018, number: 59, lectureId: 14, tag: "JDBC", prompt: "JDBC 예제에서 굵은 글씨로 나타난 3개 문장의 의미를 순서대로 설명한 것은?", choices: ["Connection 객체 생성, Statement 객체 생성, DBMS와 연결", "DBMS와 연결, SQL 질의 실행, SQL 결과 처리", "DBMS와 연결, Statement 객체 생성, SQL 질의 실행", "DBMS와 연결 종료, Statement 객체 생성, SQL 질의 실행"], correct: "3" },
  { year: 2018, number: 60, lectureId: 14, tag: "JDBC", prompt: "executeQuery()는 질의 결과 테이블을 리턴한다. 리턴되는 객체의 유형은 무엇인가?", choices: ["ResultSet", "ResultTable", "Statement", "StatementTable"], correct: "1" },

  { year: 2019, number: 36, lectureId: 3, tag: "배열", prompt: "배열을 사용하는 다음 문장 중 올바른 것은?", choices: ["int[] a = new int[10];", "int b[] = { {1, 2, 3}, {4, 5} };", "int[] c; c = {1, 2, 3, 4};", "int[][] d = new int[10];"], correct: "1" },
  { year: 2019, number: 37, lectureId: 5, tag: "추상 클래스와 인터페이스", prompt: "인터페이스에서 기본 몸체를 가지는 메소드를 볼 수 있다. 밑줄 부분에 들어갈 키워드는 무엇인가?", choices: ["public", "final", "abstract", "default"], correct: "4" },
  { year: 2019, number: 38, lectureId: 5, tag: "상속·구현", prompt: "Employee, Salesman, Developer 프로그램에 관한 설명으로 잘못된 것은?", choices: ["클래스 간의 상속 관계가 존재한다.", "Employee 클래스를 이용하여 자식 클래스를 정의하였다.", "부모 클래스가 추상 클래스로 정의되어 있다.", "부모 유형의 변수에 자식 객체가 대입되었다."], correct: "3" },
  { year: 2019, number: 39, lectureId: 5, tag: "상속·구현", prompt: "EmployeeTest 프로그램을 실행할 때 출력되는 결과는?", choices: ["do something / do something", "do sales / do something", "do something / do sales", "do sales / do development"], correct: "4" },
  { year: 2019, number: 40, lectureId: 8, tag: "String", prompt: "문자열 abcde를 1,000번 연결하는 프로그램에 등장하는 수식 중 결과가 String 유형이 아닌 것은?", choices: ["\"abcde\"", "new String()", "i < 1000", "str + aValue"], correct: "3" },
  { year: 2019, number: 41, lectureId: 8, tag: "String", prompt: "문자열 연결 프로그램에 관한 설명으로 잘못된 것은?", choices: ["컴파일 또는 실행 오류는 발생하지 않는다.", "for문을 수행할 때마다 새로운 String 객체가 생성된다.", "immutable 클래스인 String을 사용하여 메모리 낭비가 심하다.", "반복횟수가 커질수록 평균 실행 속도는 점점 빨라진다."], correct: "4" },
  { year: 2019, number: 42, lectureId: 9, tag: "입출력 스트림", prompt: "파일로부터 2바이트 문자 단위로 데이터를 읽은 후 파일에 출력할 때, 밑줄 ㄱ과 ㄴ에 들어갈 입출력 스트림 클래스는 순서대로 무엇인가?", choices: ["FileInputStream / FileOutputStream", "FileOutputStream / FileInputStream", "FileReader / FileWriter", "FileWriter / FileReader"], correct: "3" },
  { year: 2019, number: 43, lectureId: 7, tag: "try-catch-finally", prompt: "예외처리를 위해 밑줄 친 ㄷ에 들어갈 적당한 내용은?", choices: ["catch(java.io.IOException)", "catch(java.io.IOException e)", "catch(java.io.IOException ex)", "finally"], correct: "2" },
  { year: 2019, number: 44, lectureId: 10, tag: "java.nio", prompt: "java.nio.file에 존재하며 java.io.File을 대신하고, 파일 또는 디렉터리 경로를 표현·조작하는 인터페이스 또는 클래스의 이름은 무엇인가?", choices: ["Buffer", "Path", "FileReader", "FileChannel"], correct: "2" },
  { year: 2019, number: 45, lectureId: 11, tag: "제네릭", prompt: "컬렉션 인터페이스나 클래스는 제네릭 타입으로 정의되어 있어 저장할 원소 타입을 지정하는 것이 좋다. 밑줄 ㄱ에 들어갈 선언으로 적당한 것은?", choices: ["List<> list = new ArrayList<>();", "List<Integer> list = new ArrayList<Integer>();", "List<String> list = new ArrayList<String>();", "ArrayList<String> list = new List<String>();"], correct: "3" },
  { year: 2019, number: 46, lectureId: 12, tag: "for-each", prompt: "for-each 구문을 사용하여 컬렉션에 저장된 원소를 순서대로 출력하려 한다. 밑줄 ㄴ에 들어갈 적당한 내용은 무엇인가?", choices: ["for (s : list) System.out.println(s);", "for (s : ArrayList list) System.out.println(s);", "for (String s : list) System.out.println(s);", "for (String s : ArrayList list) System.out.println(s);"], correct: "3" },
  { year: 2019, number: 47, lectureId: 11, tag: "컬렉션", prompt: "add는 리스트 끝에 원소를 추가하고 add(index, 원소)는 지정 위치에 추가한다. ArrayListTest의 출력 결과는 무엇인가?", choices: ["one / two / three", "one / one / three / two", "one / three / two / one", "결과를 예측할 수 없다"], correct: "2" },
  { year: 2019, number: 48, lectureId: 11, tag: "컬렉션", prompt: "HashMap 컬렉션 객체에 저장된 원소를 읽거나 원소를 추가할 때 사용되는 메소드는 각각 무엇인가?", choices: ["delete() / insert(원소)", "pop() / push(원소)", "remove(키) / add(키, 값)", "get(키) / put(키, 값)"], correct: "4" },
  { year: 2019, number: 49, lectureId: 13, tag: "스레드", prompt: "공유 자원을 사용하는 두 스레드 프로그램에서 공유 자원에 해당하는 것은 무엇인가?", choices: ["Account 객체", "Counter 객체", "increment() 메소드", "getValue() 메소드"], correct: "2" },
  { year: 2019, number: 50, lectureId: 13, tag: "스레드", prompt: "Thread의 서브 클래스를 정의하기 위해 밑줄 ㄱ에 들어갈 키워드는 무엇인가?", choices: ["Runnable", "SubClass", "extends", "implements"], correct: "3" },
  { year: 2019, number: 51, lectureId: 13, tag: "스레드", prompt: "공유 자원을 쓰는 스레드 간에 동기화가 필요하므로 increment() 메소드를 다시 정의해야 한다. 잘못된 것은?", choices: ["public void increment() { synchronized(this) { c++; } }", "synchronized public void increment() { c++; }", "public synchronized void increment() { c++; }", "public void synchronized increment() { c++; }"], correct: "4" },
  { year: 2019, number: 52, lectureId: 13, tag: "스레드", prompt: "모든 스레드 실행 종료 뒤 최종적으로 200000이 출력되는지 확인하려 한다. 밑줄 ㄷ에 들어갈 내용은 무엇인가?", choices: ["t1.join(); t2.join();", "t1.notify(); t2.notify();", "t1.sleep(); t2.sleep();", "Thread.yield();"], correct: "1" },
  { year: 2019, number: 53, lectureId: 7, tag: "try-catch-finally", prompt: "앞 문제에서 필요한 메소드를 호출하려면 예외처리 또는 예외 전파가 필요하다. 밑줄 ㄴ에 들어갈 키워드는 무엇인가?", choices: ["throw", "throws", "synchronize", "interrupt"], correct: "2" },
  { year: 2019, number: 54, lectureId: 15, tag: "AWT 이벤트", prompt: "그림이 보여주는 AWT 컨트롤에 관한 설명으로 잘못된 것은 무엇인가?", choices: ["리스트박스라고도 하며 스크롤이 가능하다.", "목록에 있는 항목 중 다중 선택이 가능하다.", "항목을 선택하거나 더블클릭할 때 이벤트가 발생한다.", "항목을 불러올 때 사용하는 모달 대화상자이다."], correct: "4" },
  { year: 2019, number: 55, lectureId: 15, tag: "AWT 이벤트", prompt: "첫 번째와 두 번째 라인에 나오는 import 구문의 의미를 잘 설명한 것은?", choices: ["아래 클래스 정의에서 다른 패키지의 클래스나 인터페이스를 사용하려는 것이다.", "두 개의 클래스 정의가 위치할 패키지를 결정하는 것이다.", "패키지 두 개를 새롭게 정의하는 것이다.", "기존 패키지를 상속받아 새로운 패키지를 정의하는 것이다."], correct: "1" },
  { year: 2019, number: 56, lectureId: 15, tag: "AWT 이벤트", prompt: "ActionEvent를 등록하려면 해당 이벤트의 리스너를 구현하는 클래스를 먼저 정의해야 한다. 밑줄 ㄱ에 들어갈 내용은?", choices: ["implements ActionListener", "extends ActionListener", "implements ActionAdapter", "extends ActionAdapter"], correct: "1" },
  { year: 2019, number: 57, lectureId: 15, tag: "AWT 이벤트", prompt: "버튼들이 한 줄로 배치된 실행 결과를 보고 배치관리자를 의미하는 밑줄 ㄴ에 들어갈 내용은 무엇인가?", choices: ["GridLayout", "FlowLayout", "BorderLayout", "ButtonAreaLayout"], correct: "2" },
  { year: 2019, number: 58, lectureId: 15, tag: "AWT 이벤트", prompt: "첫 번째 버튼 b1에 ActionEvent를 등록하려고 한다. 밑줄 ㄷ에 들어갈 적당한 내용은?", choices: ["addWindowListener()", "addWindowListener(new MyFrame())", "addActionListener()", "addActionListener(new MyListener())"], correct: "4" },
  { year: 2019, number: 59, lectureId: 14, tag: "JDBC", prompt: "매개변수를 가지는 SQL 구문을 표현하는 객체를 생성하기 위해 밑줄 ㄱ에 들어갈 적당한 메소드는?", choices: ["prepare", "create", "prepareStatement", "createStatement"], correct: "3" },
  { year: 2019, number: 60, lectureId: 14, tag: "JDBC", prompt: "표현된 SQL 구문을 실행하기 위해 밑줄 ㄴ에 들어갈 적당한 메소드는?", choices: ["getResultSet", "execute", "executeQuery", "executeUpdate"], correct: "4" },
];

export const javaPastExamQuestions = specs.map(makeQuestion);
export const javaPastExamYears: JavaPastExamYear[] = [2019, 2018, 2017];
export const javaPastExamQuestionById = new Map(javaPastExamQuestions.map((question) => [question.id, question]));
