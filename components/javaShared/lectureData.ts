import type { JavaLectureContent, JavaQuizChoice } from "./types";

const choice = (
  text: string,
  isCorrect: boolean,
  basis: string,
  reason: string,
): JavaQuizChoice => ({
  text,
  isCorrect,
  explanation: { basis, reason },
});

const quiz = (
  q: string,
  answer: string,
  distractors: string[],
  category: string,
  basis: string,
  examSkill: string,
) => ({
  q,
  category,
  basis,
  examSkill,
  choices: [
    choice(answer, true, basis, "문항에서 묻는 Java 규칙이나 강의 개념과 일치한다."),
    ...distractors.map((item) =>
      choice(item, false, basis, `오답 기준: ${item}은/는 ${category} 판단 조건과 맞지 않는다.`),
    ),
  ],
});

export const javaLectureData: Record<number, JavaLectureContent> = {
  1: {
    id: 1,
    title: "Java와 객체지향 프로그래밍",
    sourceLabel: "강의 1강·Java 언어 개요·JDK와 이클립스·Java 소스의 구성",
    intro:
      "Java 프로그램이 소스 코드에서 바이트코드로 변환되고 JVM 위에서 실행되는 흐름을 먼저 잡고, 객체지향 언어로서 클래스와 객체가 프로그램 구조를 만드는 방식을 학습한다.",
    goals: ["플랫폼 독립성과 바이트코드 실행 구조 설명", "JDK·JRE·JVM·이클립스 역할 구분", "public 클래스와 main 메소드, class 파일 생성 규칙 판별"],
    audit: {
      lecture: "Java 언어 개요, JDK와 이클립스 설치, Java 소스의 구성",
      definitions: "Java 플랫폼, JVM, 바이트코드, JDK, 클래스, 객체, public class, main 메소드",
      procedures: "소스 작성→javac 컴파일→.class 바이트코드 생성→JVM 실행→표준 출력",
      examples: "HelloWorld, public class A와 package-private class B를 한 파일에 둔 예",
      exercisePoint: "플랫폼 독립성, A.java 컴파일 결과, HelloWorld 작성",
      implementation: "개념 지도, 컴파일 흐름 추적, class 파일 생성 판별, 객관식·서술형 변형 퀴즈",
    },
    units: [
      {
        title: "Java 언어와 플랫폼 독립성",
        anchor: "1.1",
        summary: "Java는 소스 코드를 특정 운영체제의 기계어가 아니라 바이트코드로 컴파일하고, JVM이 이를 실행한다.",
        definition: "플랫폼 독립성은 똑같은 바이트코드가 Java 플랫폼이 설치된 다양한 하드웨어와 운영체제에서 수정 없이 실행될 수 있다는 의미.",
        why: "운영체제마다 다시 컴파일하는 언어와 달리, Java는 JVM 계층을 통해 실행 환경 차이를 흡수한다.",
        components: ["Java 소스 파일", "javac 컴파일러", "바이트코드(.class)", "Java 플랫폼", "JVM"],
        procedure: ["`.java` 파일 작성", "`javac`로 바이트코드 생성", "`java` 명령이 JVM을 통해 클래스 실행", "표준 출력·입력 같은 API 사용"],
        examples: ["Windows에서 컴파일한 .class를 macOS의 JVM에서 실행", "`System.out.println`으로 실행 결과를 콘솔에 출력"],
        mistake: "플랫폼 독립성을 엄격한 자료형 검사나 멀티 스레딩 지원과 혼동하면 오답이다.",
        examFocus: "바이트코드와 JVM이 들어간 보기는 플랫폼 독립성으로 연결한다.",
      },
      {
        title: "객체지향 프로그래밍의 기본 관점",
        anchor: "1.2",
        summary: "Java 프로그램은 클래스에 데이터와 동작을 묶고, 실행 중에는 클래스에서 객체를 만들어 상태를 다룬다.",
        definition: "클래스는 객체의 설계도이고 객체는 클래스를 바탕으로 생성된 실행 시점의 실체.",
        why: "2강 이후의 필드, 메소드, 생성자, 상속, 인터페이스는 모두 클래스와 객체 관계를 전제로 한다.",
        components: ["클래스", "객체", "필드", "메소드", "캡슐화", "상속", "다형성"],
        examples: ["성적을 저장하는 `Grade` 클래스와 학생별 `Grade` 객체", "`Circle` 클래스와 서로 다른 반지름을 가진 객체"],
        mistake: "클래스 이름만 있으면 객체가 자동으로 만들어진다고 생각하면 `new`와 생성자 호출을 놓친다.",
        examFocus: "클래스는 정의, 객체는 생성된 인스턴스라는 구분.",
      },
      {
        title: "JDK, JRE, JVM, 개발 도구",
        anchor: "1.3",
        summary: "JDK는 개발 도구를 포함하고, JRE는 실행 환경이며, JVM은 바이트코드를 실행하는 핵심 가상 머신이다.",
        definition: "JDK는 컴파일러와 실행 도구를 포함한 개발 키트이고, Eclipse 같은 IDE는 프로젝트와 소스 관리를 도와주는 개발 환경.",
        why: "설치와 실행 문제는 도구 이름을 묻기보다 어떤 단계에서 쓰이는지 묻는다.",
        components: ["JDK", "JRE", "JVM", "javac", "java", "IDE"],
        procedure: ["JDK 설치", "IDE에서 프로젝트 생성", "소스 파일 작성", "컴파일 오류 확인", "실행 구성 선택"],
        examples: ["`javac HelloWorld.java`는 컴파일", "`java HelloWorld`는 클래스 실행"],
        mistake: "JRE만 있으면 컴파일 도구까지 있다고 보는 선택지는 개발 도구와 실행 환경을 섞은 설명이다.",
        examFocus: "컴파일러와 실행기의 역할 구분.",
      },
      {
        title: "Java 소스의 구성과 main 메소드",
        anchor: "1.4",
        summary: "소스 파일에는 여러 클래스가 들어갈 수 있지만 public 클래스 이름은 파일 이름과 일치해야 한다.",
        definition: "`public static void main(String[] args)`는 Java 응용 프로그램의 시작점으로 사용되는 메소드 선언.",
        why: "컴파일 결과는 파일 수가 아니라 파일 안의 클래스 선언 수와 접근 제어 규칙에 따라 결정된다.",
        components: ["소스 파일명", "public class", "package-private class", "main 메소드", "class 파일"],
        examples: ["`A.java` 안의 `public class A { } class B { }`는 `A.class`와 `B.class`를 생성", "`HelloWorld`는 main에서 문자열 출력"],
        mistake: "public 클래스 하나만 class 파일이 된다고 단정하면 package-private 클래스의 컴파일 결과를 놓친다.",
        examFocus: "파일 이름 규칙과 class 파일 생성 규칙을 함께 본다.",
      },
    ],
    codeSteps: [
      {
        label: "소스 작성",
        code: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
        output: "HelloWorld.java",
        explanation: "public 클래스 이름과 파일 이름을 일치시키고, main 메소드 안에 출력 문장을 둔다.",
      },
      {
        label: "컴파일",
        code: `javac HelloWorld.java`,
        output: "HelloWorld.class",
        explanation: "javac가 소스 코드를 JVM이 실행할 수 있는 바이트코드 파일로 변환한다.",
      },
      {
        label: "실행",
        code: `java HelloWorld`,
        output: "Hello, World!",
        explanation: "java 명령은 클래스 이름을 받아 JVM에서 main 메소드를 시작한다.",
      },
    ],
    drill: {
      title: "class 파일 생성 판별",
      subtitle: "소스 파일 이름과 클래스 선언을 보고 컴파일 결과를 고른다.",
      cases: [
        { label: "A.java", input: "public class A { } class B { }", output: "A.class, B.class", rule: "파일 안의 두 클래스가 모두 바이트코드로 생성된다." },
        { label: "B.java", input: "public class A { }", output: "컴파일 오류", rule: "public 클래스 이름과 파일 이름이 맞지 않는다." },
        { label: "HelloWorld.java", input: "main 없음", output: "컴파일 가능, 실행 시작점 없음", rule: "컴파일과 응용 프로그램 실행 가능성은 구분한다." },
        { label: "Main.java", input: "System.out.println 사용", output: "표준 출력", rule: "System.out은 콘솔 출력 스트림이다." },
      ],
    },
    quizzes: [
      quiz("똑같은 바이트코드가 여러 운영체제에서 수정 없이 실행되는 Java 특징은?", "플랫폼에 독립적", ["엄격한 자료형의 검사", "예외처리 기능의 지원", "멀티 스레딩의 지원"], "언어 특징", "근거: 강의는 Java 플랫폼과 바이트코드 실행 구조를 플랫폼 독립성과 연결한다.", "플랫폼 독립성 판별"),
      quiz("`public class A { } class B { }`가 들어 있는 A.java를 컴파일하면?", "A.class와 B.class가 생성된다.", ["A.class만 생성된다.", "B.class만 생성된다.", "오류가 있어 컴파일되지 않는다."], "컴파일 결과", "근거: 한 소스 파일 안의 각 클래스가 별도 class 파일로 컴파일된다.", "class 파일 생성 규칙"),
      quiz("Java 응용 프로그램의 시작점으로 쓰이는 메소드 선언은?", "public static void main(String[] args)", ["public void start(String[] args)", "static class main(String args)", "private static int main()"], "main 메소드", "근거: Java 응용 프로그램은 정해진 형식의 main 메소드에서 시작한다.", "main 형식 판별"),
      quiz("JDK에 대한 설명으로 가장 알맞은 것은?", "컴파일러와 실행 도구를 포함한 Java 개발 키트", ["바이트코드만 실행하는 가상 머신", "문자열 처리를 위한 클래스", "데이터베이스 연결 인터페이스"], "개발 도구", "근거: JDK는 개발에 필요한 도구 묶음이고 JVM은 실행 계층이다.", "JDK/JVM 역할 구분"),
      quiz("`System.out.println(\"Hello, World!\");`의 역할은?", "문자열을 콘솔에 한 줄 출력한다.", ["클래스를 컴파일한다.", "객체를 직렬화한다.", "패키지를 선언한다."], "표준 출력", "근거: HelloWorld 예제는 System.out.println으로 화면 출력 수행.", "기본 출력문 이해"),
    ],
  },

  2: {
    id: 2,
    title: "Java 기본 문법(1)",
    sourceLabel: "강의 2강·Java 프로그램 기본 사항·자료형·연산자와 제어문",
    intro:
      "클래스와 객체를 쓰는 기본 프로그램 구조에서 출발해 식별자, 키워드, 변수, 자료형, 리터럴, 형변환, 연산자와 제어문을 Java 문법의 기준으로 정리한다.",
    goals: ["식별자·키워드·클래스 이름 구분", "기본 자료형·참조형·리터럴 값 판별", "반복문과 향상된 for문 변환"],
    audit: {
      lecture: "Java 프로그램 작성, 식별자, 키워드, 변수 종류와 자료형, 변수 범위, 기본 자료형, 리터럴, 참조형, 형변환, 연산자, 명령행 매개변수, 문장과 제어문",
      definitions: "식별자, 키워드, 지역변수, 멤버변수, 기본 자료형, 참조형, 리터럴, 형변환, 명령행 매개변수",
      procedures: "변수 선언→값 대입→연산→조건/반복 실행→배열 순회",
      examples: "Grade/GradeOutput, HelloApplication, 10·00001010·0x0A·0b0000_1010, 향상된 for문",
      exercisePoint: "boolean은 키워드, 00001010은 8진 리터럴, 향상된 for문 작성",
      implementation: "자료형 판별표, 리터럴 값 드릴, for문 변환 코드 추적, 객관식·서술형 변형 퀴즈",
    },
    units: [
      {
        title: "Java 프로그램 기본 구조",
        anchor: "2.1",
        summary: "Java 프로그램은 클래스를 정의하고, 필요한 객체를 생성한 뒤 필드와 메소드를 통해 작업을 수행한다.",
        definition: "메소드는 클래스 안에 정의된 동작이며, 객체는 필드 값을 독립적으로 가진다.",
        why: "같은 클래스에서 만든 두 객체가 서로 다른 점수를 저장하는 예처럼, 객체 상태와 메소드 호출을 분리해 이해해야 한다.",
        components: ["클래스 선언", "필드", "메소드", "객체 참조 변수", "`new` 연산자"],
        examples: ["`Grade g1, g2;`는 참조 변수 선언", "`g1 = new Grade();`는 객체 생성"],
        mistake: "참조 변수를 선언한 것만으로 객체가 생성되었다고 보면 NullPointerException 흐름을 이해하기 어렵다.",
        examFocus: "클래스, 객체, 필드, 메소드가 프로그램 안에서 맡는 역할.",
      },
      {
        title: "식별자와 키워드",
        anchor: "2.2",
        summary: "식별자는 개발자가 붙이는 이름이고, 키워드는 Java 문법에서 이미 예약된 단어라 이름으로 사용할 수 없다.",
        definition: "키워드는 자료형이나 제어문처럼 Java 언어가 특별한 의미로 예약한 단어.",
        why: "클래스 이름처럼 보이는 보기 사이에 `boolean` 같은 기본 자료형 키워드가 섞여 나온다.",
        components: ["클래스 이름", "변수 이름", "메소드 이름", "키워드", "대소문자 구분"],
        examples: ["`Integer`, `String`, `System`은 클래스 이름", "`boolean`은 기본 자료형 키워드"],
        mistake: "소문자로 시작하는 모든 단어가 변수 이름이라고 단정하면 `boolean`, `class`, `public` 같은 키워드를 놓친다.",
        examFocus: "클래스 이름과 키워드의 구분.",
      },
      {
        title: "자료형, 리터럴, 형변환",
        anchor: "2.3",
        summary: "Java 자료형은 기본 자료형과 참조형으로 나뉘며, 리터럴 표기는 값의 진법과 타입을 결정한다.",
        definition: "리터럴은 소스 코드에 직접 적은 값이며, 정수 리터럴은 10진·8진·16진·2진 표기를 사용할 수 있다.",
        why: "`00001010`은 앞의 0 때문에 10진수 1010이 아니라 8진 정수로 해석된다.",
        components: ["boolean", "char", "byte/short/int/long", "float/double", "참조형", "자동 형변환", "강제 형변환"],
        procedure: ["리터럴 접두사 확인", "기본 자료형 또는 참조형 판별", "대입 가능 범위 확인", "필요하면 명시적 형변환 적용"],
        examples: ["`0x0A`와 `0b0000_1010`은 10", "`00001010`은 8진수 520"],
        mistake: "앞자리에 0이 붙은 정수 리터럴을 단순한 자리 맞춤 표기로 보면 값이 달라진다.",
        examFocus: "정수 리터럴 값 비교와 형변환 가능성.",
      },
      {
        title: "연산자, 문장, 제어문",
        anchor: "2.4",
        summary: "명령문, 조건문, 반복문, 분기문은 연산 결과에 따라 프로그램 흐름을 제어한다.",
        definition: "향상된 for문은 배열이나 컬렉션의 원소를 순서대로 하나씩 꺼내 반복 변수에 대입하는 반복문.",
        why: "배열 인덱스를 직접 다루는 for문을 값 중심의 향상된 for문으로 변환하는 문제가 출제된다.",
        components: ["산술·관계·논리 연산자", "if/switch", "for/while/do-while", "break/continue", "명령행 매개변수"],
        examples: ["`for (int value : a)`는 배열 `a`를 순회", "`args[0]`은 첫 번째 명령행 인자"],
        mistake: "향상된 for문에서 원소 값을 바꾸면 원본 배열의 같은 위치가 항상 바뀐다고 생각하면 안 된다.",
        examFocus: "반복문 형태 변환과 제어문 역할 판별.",
      },
    ],
    codeSteps: [
      {
        label: "일반 for문",
        code: `for (int i = 0; i < a.length; i++) {
    System.out.print(a[i] + " ");
}`,
        output: "배열 인덱스로 순회",
        explanation: "인덱스 i를 직접 증가시키며 배열 원소에 접근한다.",
      },
      {
        label: "향상된 for문",
        code: `for (int value : a) {
    System.out.print(value + " ");
}`,
        output: "원소 값을 순서대로 출력",
        explanation: "배열 a의 각 원소가 차례대로 value에 대입된다.",
      },
      {
        label: "리터럴 비교",
        code: `System.out.println(10);
System.out.println(00001010);
System.out.println(0x0A);
System.out.println(0b0000_1010);`,
        output: "10 / 520 / 10 / 10",
        explanation: "`00001010`은 8진 정수로 해석되어 다른 값이 된다.",
      },
    ],
    drill: {
      title: "자료형·리터럴 판별",
      subtitle: "보기의 문법적 역할과 실제 값을 빠르게 구분한다.",
      cases: [
        { label: "boolean", input: "클래스 이름 후보", output: "클래스 이름 아님", rule: "boolean은 기본 자료형 키워드이다." },
        { label: "String", input: "클래스 이름 후보", output: "클래스 이름", rule: "String은 java.lang 패키지의 클래스이다." },
        { label: "00001010", input: "정수 리터럴", output: "8진수 520", rule: "앞의 0은 8진 표기이다." },
        { label: "0b0000_1010", input: "정수 리터럴", output: "10", rule: "0b 접두사는 2진 표기이고 밑줄은 가독성 표기이다." },
      ],
    },
    quizzes: [
      quiz("다음 중 클래스 이름에 해당하지 않는 것은?", "boolean", ["Integer", "String", "System"], "식별자", "근거: boolean은 Java 기본 자료형 키워드이다.", "키워드와 클래스 이름 구분"),
      quiz("다음 정수 리터럴 중 값이 다른 것은?", "00001010", ["10", "0x0A", "0b0000_1010"], "리터럴", "근거: 앞에 0이 붙은 정수 리터럴은 8진수로 해석된다.", "진법 표기 판별"),
      quiz("배열 `a`의 각 원소를 출력하는 향상된 for문 머리는?", "for (int value : a)", ["for (int value = a)", "for (a : int value)", "foreach int value in a"], "반복문", "근거: Java 향상된 for문은 `자료형 변수 : 배열/컬렉션` 형식을 사용한다.", "for문 변환"),
      quiz("참조형 변수 선언만 하고 객체를 만들지 않았을 때의 설명은?", "변수는 참조를 담을 수 있지만 아직 객체가 생성된 것은 아니다.", ["객체가 자동 생성된다.", "클래스 파일이 삭제된다.", "기본 자료형으로 바뀐다."], "객체 생성", "근거: 객체 생성은 `new` 연산자와 생성자 호출로 이루어진다.", "참조 변수와 객체 구분"),
      quiz("명령행 매개변수 `args`의 성격은?", "main 메소드로 전달되는 문자열 배열", ["클래스의 static 필드", "JVM 바이트코드 파일", "예외처리 키워드"], "명령행 매개변수", "근거: main의 `String[] args`는 실행 시 전달된 문자열 인자를 보관한다.", "main 인자 이해"),
    ],
  },

  3: {
    id: 3,
    title: "Java 기본 문법(2), 클래스와 상속(1)",
    sourceLabel: "강의 3강·배열·문자열·Scanner 클래스·클래스 정의·상속 기초",
    intro:
      "배열과 문자열, Scanner 입력을 다룬 뒤 클래스의 필드·메소드·접근 제어자를 정리하고 상속의 첫 개념으로 protected 접근 범위를 익힌다.",
    goals: ["1차원·2차원 배열 선언과 길이 사용", "문자열 결합과 Scanner 입력 코드 읽기", "클래스 구성요소와 접근 제어자 판별"],
    audit: {
      lecture: "배열, 배열 초기화와 생성, 배열 크기, String 클래스와 +연산자, Scanner 클래스, 클래스 정의, 메소드 정의, 클래스 접근 제어자, 데이터 필드 접근 제어자",
      definitions: "배열, 2차원 배열, String, Scanner, 클래스, 메소드, 접근 제어자, protected",
      procedures: "배열 생성→length 확인→중첩 반복→Scanner 입력→객체 필드 접근 가능성 판별",
      examples: "가변 길이 2차원 배열, `i + \" \" + j`, `Scanner sc = new Scanner(System.in)`, protected 필드 접근",
      exercisePoint: "올바른 배열 선언, 두 변수 사이 공백 출력, protected 필드 접근 불가 클래스",
      implementation: "배열 순회 추적, 문자열 결합 판별, 접근 제어 드릴, 객관식 변형 퀴즈",
    },
    units: [
      {
        title: "배열 선언, 생성, 초기화",
        anchor: "3.1",
        summary: "배열은 같은 자료형의 여러 값을 하나의 이름으로 다루는 참조형이며, 선언과 생성 문법을 구분한다.",
        definition: "배열 객체는 `new`로 생성되고, 각 원소는 인덱스로 접근하며 `length`로 크기를 확인한다.",
        why: "Java 배열 문법은 C식 표기와 비슷해 보이지만 `new int(10)`이나 `int[5] d` 같은 표기는 오류이다.",
        components: ["1차원 배열", "2차원 배열", "가변 길이 배열", "배열 초기화", "`length` 필드"],
        procedure: ["배열 변수 선언", "`new 자료형[크기]`로 생성", "인덱스 범위 확인", "반복문으로 원소 접근"],
        examples: ["`int[][] c = new int[5][];`는 행만 먼저 만든 2차원 배열", "`twoArray[i].length`는 각 행의 길이"],
        mistake: "`new int(10)`처럼 생성자 호출 형식으로 배열을 만들 수 없다.",
        examFocus: "문법적으로 올바른 배열 선언과 가변 길이 2차원 배열 판별.",
      },
      {
        title: "문자열과 + 연산자",
        anchor: "3.2",
        summary: "String은 문자열 객체를 표현하며, + 연산자는 문자열 결합과 산술 덧셈을 문맥에 따라 수행한다.",
        definition: "문자열이 하나라도 포함된 + 연산은 문자열 결합으로 진행된다.",
        why: "`i + \" \" + j`처럼 중간에 문자열 공백을 넣어야 두 정수 값을 구분해 출력할 수 있다.",
        components: ["String 클래스", "문자열 리터럴", "문자열 결합", "문자와 정수의 산술 변환"],
        examples: ["`System.out.println(i + \" \" + j);`는 두 값 사이 공백 출력", "`'A' + 0`은 65"],
        mistake: "`System.out.println(i, j)`처럼 여러 인자를 넘길 수 있다고 보면 Java 출력문 문법과 다르다.",
        examFocus: "문자열 결합 순서와 출력 결과 판별.",
      },
      {
        title: "Scanner 클래스 입력",
        anchor: "3.3",
        summary: "Scanner는 표준 입력 같은 입력 소스에서 토큰을 읽기 위한 클래스이며 `java.util.Scanner` import가 필요하다.",
        definition: "`Scanner sc = new Scanner(System.in);`은 키보드 입력을 읽는 Scanner 객체를 생성하는 문장.",
        why: "입력 예제는 반복 조건 `hasNextInt()`와 실제 읽기 `nextInt()`를 함께 사용한다.",
        components: ["import 선언", "System.in", "Scanner 생성자", "next/nextInt", "hasNextInt"],
        procedure: ["`import java.util.Scanner;` 작성", "Scanner 객체 생성", "입력 가능 여부 확인", "토큰 읽기"],
        examples: ["`String name = sc.next();`", "`while (sc.hasNextInt()) System.out.println(sc.nextInt());`"],
        mistake: "Scanner를 단순 이름으로 쓰면서 import를 빠뜨리면 컴파일 오류가 난다.",
        examFocus: "Scanner 사용 코드의 import와 입력 메소드 역할.",
      },
      {
        title: "클래스 정의와 접근 제어",
        anchor: "3.4",
        summary: "클래스는 필드와 메소드를 가지며, 접근 제어자는 다른 클래스나 패키지에서 사용할 수 있는 범위를 정한다.",
        definition: "protected 멤버는 같은 패키지 또는 상속 관계의 하위 클래스에서 접근할 수 있다.",
        why: "같은 패키지인지, 하위 클래스인지, 둘 다 아닌지에 따라 protected 필드 접근 가능성이 달라진다.",
        components: ["public", "protected", "package-private", "private", "필드", "메소드"],
        examples: ["`public double getArea()`는 외부 호출 가능", "다른 패키지의 무관한 `Gamma`는 protected 필드 접근 불가"],
        mistake: "protected를 public과 같다고 보면 패키지 밖의 무관 클래스 접근을 허용하는 오답이 된다.",
        examFocus: "접근 제어자별 접근 가능 범위 판별.",
      },
    ],
    codeSteps: [
      {
        label: "가변 배열 생성",
        code: `int[][] twoArray = { { 0, 1 }, { 10, 11, 12 } };`,
        output: "행마다 길이가 다름",
        explanation: "2차원 배열은 각 행이 별도 배열이므로 행 길이가 다를 수 있다.",
      },
      {
        label: "중첩 반복",
        code: `for (int i = 0; i < twoArray.length; i++)
    for (int j = 0; j < twoArray[i].length; j++)
        System.out.println(twoArray[i][j]);`,
        output: "0 / 1 / 10 / 11 / 12",
        explanation: "바깥 length는 행 수, 안쪽 length는 현재 행의 열 수이다.",
      },
      {
        label: "두 변수 출력",
        code: `System.out.println(i + " " + j);`,
        output: "i값 공백 j값",
        explanation: "문자열 공백이 포함되어 두 정수를 붙이지 않고 구분해 출력한다.",
      },
    ],
    drill: {
      title: "문법·접근 판별",
      subtitle: "배열 선언과 접근 제어 조건을 문장 단위로 판정한다.",
      cases: [
        { label: "int[][] c = new int[5][];", input: "배열 선언", output: "올바름", rule: "행 배열만 먼저 만들 수 있다." },
        { label: "int b[] = new int(10);", input: "배열 선언", output: "오류", rule: "배열 크기는 대괄호에 쓴다." },
        { label: "i + \" \" + j", input: "출력식", output: "두 값 사이 공백", rule: "문자열이 들어가면 결합 연산이 된다." },
        { label: "Gamma", input: "다른 패키지의 무관 클래스", output: "protected 필드 사용 불가", rule: "같은 패키지도 하위 클래스도 아니면 접근할 수 없다." },
      ],
    },
    quizzes: [
      quiz("문법적으로 올바른 배열 선언과 생성은?", "int[][] c = new int[5][];", ["int a[10] = new int[];", "int b[] = new int(10);", "int[5] d = {1, 2, 3, 4, 5};"], "배열 문법", "근거: Java 배열 생성은 `new int[크기]` 형식이며 2차원 배열은 첫 차원만 지정 가능하다.", "배열 선언 판별"),
      quiz("정수 i와 j 값을 공백으로 구분해 출력하는 문장은?", "System.out.println(i + \" \" + j);", ["System.out.println(i, j);", "System.out.println(i + j);", "System.out.println(i + '=' + j);"], "출력문", "근거: println은 단일 인자를 받고 문자열 공백을 결합해야 두 값을 구분한다.", "문자열 결합 이해"),
      quiz("Scanner를 단순 이름으로 사용하려면 필요한 선언은?", "import java.util.Scanner;", ["package java.util.Scanner;", "throws Scanner;", "extends Scanner;"], "import", "근거: Scanner는 java.util 패키지의 클래스이므로 import로 단순 이름을 사용할 수 있다.", "패키지 사용 준비"),
      quiz("protected 필드에 접근할 수 없는 경우는?", "다른 패키지의 무관한 클래스", ["같은 클래스", "하위 클래스", "같은 패키지 클래스"], "접근 제어", "근거: protected는 같은 패키지 또는 상속 관계 접근을 허용한다.", "protected 범위 판별"),
      quiz("`twoArray[i].length`가 의미하는 것은?", "i번째 행 배열의 길이", ["전체 행 수", "전체 원소 수", "배열의 자료형 이름"], "배열 크기", "근거: 2차원 배열의 각 행은 별도 배열 객체이고 length를 가진다.", "가변 2차원 배열 순회"),
    ],
  },

  4: {
    id: 4,
    title: "클래스와 상속(2)",
    sourceLabel: "강의 4강·static/final·초기화·오버로딩·상속·오버라이딩·this/super",
    intro:
      "클래스 멤버와 인스턴스 멤버를 구분하고 final, 초기화 블록, 생성자, 오버로딩을 다룬 뒤 상속 재사용과 오버라이딩, this와 super 참조를 연결한다.",
    goals: ["static과 인스턴스 멤버 구분", "final 클래스·메소드·필드 규칙 판별", "상속, 오버라이딩, this/super 실행 흐름 설명"],
    audit: {
      lecture: "static 필드와 메소드, final 필드와 메소드, 필드 초기화, 메소드 오버로딩, 클래스와 객체 사용 예, 클래스 재사용, 상속, 메소드 오버라이딩, this, super",
      definitions: "static, final, 초기화 블록, 생성자, 오버로딩, 상속, 오버라이딩, this, super",
      procedures: "클래스 로딩→static 초기화→객체 생성→인스턴스 초기화→생성자→메소드 호출→동적 바인딩",
      examples: "Circle.count, Math.sqrt, `static final double PI`, Rectangle 생성자, Cylinder가 Circle 사용, Shape/Triangle 오버라이딩",
      exercisePoint: "final 클래스 객체 생성 가능, PI 상수 선언, `this.radius = radius`",
      implementation: "멤버 구분 드릴, 초기화·오버라이딩 코드 추적, final 규칙 퀴즈",
    },
    units: [
      {
        title: "static 필드와 static 메소드",
        anchor: "4.1",
        summary: "static 멤버는 객체별 상태가 아니라 클래스에 소속되어 모든 객체가 공유한다.",
        definition: "static 필드는 클래스 변수로, static 메소드는 객체 생성 없이 클래스 이름으로 호출할 수 있는 메소드.",
        why: "객체마다 달라야 하는 값과 클래스 전체에서 공유할 값을 구분해야 설계와 출력 결과를 맞힐 수 있다.",
        components: ["클래스 변수", "인스턴스 변수", "클래스 메소드", "객체 참조", "공유 상태"],
        examples: ["`Circle.count`는 생성된 Circle 수를 공유 가능", "`Math.sqrt(4.0)`은 객체 없이 호출"],
        mistake: "static 메소드 안에서 객체 없이 인스턴스 필드를 직접 쓰려 하면 오류가 난다.",
        examFocus: "클래스 소속 멤버와 객체 소속 멤버 구분.",
      },
      {
        title: "final과 초기화",
        anchor: "4.2",
        summary: "final은 변수, 메소드, 클래스에 붙을 수 있으며 각각 값 변경, 재정의, 상속을 제한한다.",
        definition: "final 변수는 상수처럼 사용되고, final 메소드는 오버라이딩할 수 없으며, final 클래스는 하위 클래스를 만들 수 없다.",
        why: "final 클래스는 상속이 금지될 뿐 객체 생성 자체가 금지되는 것은 아니다.",
        components: ["final 필드", "final 메소드", "final 클래스", "인스턴스 초기화 블록", "static 초기화 블록", "생성자"],
        procedure: ["필드 기본값 설정", "명시적 초기화", "초기화 블록 실행", "생성자 실행"],
        examples: ["`static final double PI = 3.14;`", "생성자에서 매개변수로 필드 초기화"],
        mistake: "`const`는 Java 상수 선언 키워드가 아니다.",
        examFocus: "final이 제한하는 대상과 상수 선언 형식.",
      },
      {
        title: "오버로딩과 객체 조합",
        anchor: "4.3",
        summary: "오버로딩은 같은 이름의 메소드를 매개변수 목록이 다르게 여러 개 정의하는 것이다.",
        definition: "메소드 시그니처의 매개변수 개수나 타입이 다르면 같은 이름의 메소드를 함께 둘 수 있다.",
        why: "생성자 오버로딩과 메소드 오버로딩은 다양한 초기화·호출 형태를 제공한다.",
        components: ["메소드 이름", "매개변수 목록", "반환형", "생성자", "객체 포함 관계"],
        examples: ["`println()`과 `println(String x)`", "Cylinder가 Circle 객체를 필드로 보관해 부피 계산"],
        mistake: "반환형만 다른 두 메소드는 오버로딩으로 구분되지 않는다.",
        examFocus: "오버로딩 성립 조건과 객체 조합 예제 이해.",
      },
      {
        title: "상속, 오버라이딩, this와 super",
        anchor: "4.4",
        summary: "상속은 부모 클래스의 멤버를 재사용하고, 오버라이딩은 하위 클래스가 상속받은 메소드를 다시 정의하는 것이다.",
        definition: "`this`는 현재 객체를, `super`는 부모 클래스 부분을 가리키는 참조.",
        why: "필드 이름과 매개변수 이름이 같으면 `this.radius = radius`처럼 현재 객체 필드를 명확히 지정해야 한다.",
        components: ["extends", "부모 클래스", "자식 클래스", "오버라이딩", "동적 바인딩", "this", "super"],
        examples: ["`Shape t = new Triangle();`에서 `t.getArea()`는 Triangle 구현 실행", "`super`로 부모 생성자나 메소드 접근"],
        mistake: "부모 타입 참조 변수가 부모 메소드만 실행한다고 보면 다형성의 동적 바인딩을 놓친다.",
        examFocus: "상속 재사용, 오버라이딩 실행 결과, this 필드 지정.",
      },
    ],
    codeSteps: [
      {
        label: "상수 선언",
        code: `class Circle {
    static final double PI = 3.14;
    double radius;
}`,
        output: "클래스 상수",
        explanation: "원주율처럼 객체마다 달라지지 않는 값은 static final로 선언한다.",
      },
      {
        label: "this로 필드 지정",
        code: `public Circle(double radius) {
    this.radius = radius;
}`,
        output: "필드 radius에 매개변수 대입",
        explanation: "`this.radius`는 객체의 필드, 오른쪽 `radius`는 매개변수이다.",
      },
      {
        label: "오버라이딩 실행",
        code: `Shape t = new Triangle();
System.out.println(t.getArea(3.0, 4.0));`,
        output: "6.0",
        explanation: "참조 타입은 Shape이지만 실제 객체가 Triangle이므로 재정의된 메소드가 실행된다.",
      },
    ],
    drill: {
      title: "멤버·상속 규칙 판별",
      subtitle: "static, final, this/super 규칙을 보기 단위로 구분한다.",
      cases: [
        { label: "final class", input: "객체 생성", output: "가능", rule: "하위 클래스 정의만 금지된다." },
        { label: "final method", input: "자식 클래스 재정의", output: "불가", rule: "final 메소드는 오버라이딩할 수 없다." },
        { label: "static final PI", input: "원주율 상수", output: "적합", rule: "공유 상수는 클래스 필드로 둔다." },
        { label: "this.radius", input: "필드와 매개변수 이름 같음", output: "필드 지정", rule: "this는 현재 객체 멤버를 명확히 가리킨다." },
      ],
    },
    quizzes: [
      quiz("final에 관한 설명으로 틀린 것은?", "final 클래스의 객체를 생성할 수 없다.", ["final 클래스의 자식 클래스를 정의할 수 없다.", "final 메소드는 재정의될 수 없다.", "final 변수는 상수로 사용된다."], "final", "근거: final 클래스는 상속을 금지하지만 인스턴스 생성은 가능하다.", "final 규칙 판별"),
      quiz("Circle 클래스의 원주율 PI를 상수로 선언하는 가장 적당한 형식은?", "static final double PI = 3.14;", ["double PI = 3.14;", "final double PI = 3.14;", "const double PI = 3.14;"], "상수 선언", "근거: 객체마다 공유되는 불변 상수는 static final 필드로 선언한다.", "상수 선언 형식"),
      quiz("생성자 매개변수 `radius`를 같은 이름의 필드에 대입하는 문장은?", "this.radius = radius;", ["radius.this = radius;", "super.radius = this;", "Circle.radius = radius;"], "this", "근거: `this.radius`는 현재 객체의 필드를 가리킨다.", "필드와 매개변수 구분"),
      quiz("오버로딩이 성립하려면 무엇이 달라야 하는가?", "매개변수 목록", ["반환형만", "주석만", "메소드 본문 줄 수만"], "오버로딩", "근거: Java는 메소드 이름과 매개변수 목록으로 호출 대상을 구분한다.", "오버로딩 조건"),
      quiz("`Shape t = new Triangle(); t.getArea(...)`에서 실행 메소드가 결정되는 기준은?", "실제 객체의 재정의된 메소드", ["참조 변수 이름", "소스 파일 이름", "항상 부모 메소드"], "오버라이딩", "근거: 오버라이딩 메소드는 실행 시 실제 객체 타입에 따라 동적 바인딩된다.", "동적 바인딩 이해"),
    ],
  },

  5: {
    id: 5,
    title: "인터페이스와 다형성",
    sourceLabel: "강의 5강·추상 클래스와 인터페이스·다형성",
    intro:
      "추상 메소드와 추상 클래스로 미완성 설계를 표현하고, 인터페이스와 다중 구현을 통해 공통 규약을 정의한 뒤 다형성과 형변환, 익명 클래스를 학습한다.",
    goals: ["추상 클래스와 인터페이스의 역할 비교", "extends와 implements 사용 위치 판별", "다형성, 형변환, 익명 하위 클래스 의미 설명"],
    audit: {
      lecture: "추상 메소드, 추상 클래스, 인터페이스 정의·사용·상속·구현, 디폴트 메소드, 추상 클래스/인터페이스/클래스 형변환, 다형성과 오버라이딩",
      definitions: "abstract method, abstract class, interface, implements, default method, polymorphism, anonymous class",
      procedures: "규약 정의→구현 클래스 작성→상위 타입 참조→오버라이딩 메소드 호출→필요 시 형변환",
      examples: "Shape 추상 클래스, Figure 인터페이스, Movable/Scalable 다중 구현, `new CSuper() { }`",
      exercisePoint: "오버라이딩 출력 B, extends/implements 순서, 익명 하위 클래스 생성식",
      implementation: "인터페이스 구현 흐름, 키워드 드릴, 익명 클래스 코드 추적, 객관식 변형 퀴즈",
    },
    units: [
      {
        title: "추상 메소드와 추상 클래스",
        anchor: "5.1",
        summary: "추상 메소드는 본문이 없는 메소드이고, 추상 클래스는 직접 완성 객체를 만들 수 없는 설계 틀이다.",
        definition: "추상 클래스는 하나 이상의 추상 메소드를 포함할 수 있으며 하위 클래스가 이를 구현하도록 강제한다.",
        why: "모양이 정해지지 않은 Shape처럼 공통 타입은 필요하지만 구체 계산은 하위 클래스에 맡길 때 사용한다.",
        components: ["abstract 키워드", "추상 메소드", "추상 클래스", "구체 하위 클래스", "오버라이딩"],
        examples: ["`abstract public double getArea();`", "Triangle이 getArea를 구현"],
        mistake: "추상 클래스는 참조 변수 타입으로 사용할 수 없다고 보면 다형성 사용을 놓친다.",
        examFocus: "추상 메소드 구현 책임과 객체 생성 가능성 판별.",
      },
      {
        title: "인터페이스 정의와 구현",
        anchor: "5.2",
        summary: "인터페이스는 구현 클래스가 제공해야 할 메소드 규약을 정의하며 클래스는 implements로 이를 구현한다.",
        definition: "인터페이스는 상수, 추상 메소드, 디폴트 메소드 등을 포함할 수 있고, 클래스는 여러 인터페이스를 구현할 수 있다.",
        why: "상속은 단일 클래스 기반 재사용이고, 인터페이스 구현은 여러 규약을 동시에 만족시키는 방식이다.",
        components: ["interface", "implements", "extends", "default method", "다중 인터페이스 구현"],
        procedure: ["인터페이스 선언", "구현 클래스 작성", "모든 추상 메소드 구현", "인터페이스 타입으로 참조"],
        examples: ["`class Point implements Movable, Scalable`", "`interface SubInterface extends SuperInterface`"],
        mistake: "클래스가 인터페이스를 상속한다고 `extends`를 쓰면 키워드 선택이 틀린다.",
        examFocus: "extends와 implements의 위치와 의미.",
      },
      {
        title: "형변환과 다형성",
        anchor: "5.3",
        summary: "상위 타입 참조 변수는 하위 객체를 가리킬 수 있고, 오버라이딩 메소드는 실제 객체 기준으로 실행된다.",
        definition: "다형성은 같은 메시지가 객체의 실제 타입에 따라 서로 다른 동작을 수행하는 성질.",
        why: "실행 결과 문제는 변수 선언 타입보다 실제 생성 객체와 재정의 메소드가 무엇인지 보아야 한다.",
        components: ["상향 형변환", "하향 형변환", "instanceof", "동적 바인딩", "오버라이딩"],
        examples: ["부모 타입 변수에 자식 객체 대입", "A 타입 참조가 B 객체의 재정의 메소드 실행"],
        mistake: "참조 변수의 선언 타입만 보고 부모 메소드가 실행된다고 판단하면 출력 문제를 틀린다.",
        examFocus: "다형성 출력 결과와 형변환 가능성.",
      },
      {
        title: "익명 클래스",
        anchor: "5.4",
        summary: "익명 클래스는 이름 없이 일회성 하위 클래스나 구현 클래스를 정의하고 동시에 객체를 생성하는 문법이다.",
        definition: "`new CSuper() { ... }`는 CSuper를 상속한 익명 하위 클래스를 선언하면서 그 객체를 생성하는 식.",
        why: "간단한 콜백이나 일회성 구현에서 별도 클래스 이름 없이 구현을 제공할 수 있다.",
        components: ["new 식", "익명 하위 클래스", "오버라이딩 본문", "상위 타입 참조"],
        examples: ["`CSuper sub = new CSuper() { };`", "인터페이스 구현 객체를 즉석에서 생성"],
        mistake: "단순히 CSuper 객체를 생성하는 식이라고만 보면 중괄호 안의 하위 클래스 정의 의미를 놓친다.",
        examFocus: "익명 클래스 생성식의 정확한 설명.",
      },
    ],
    codeSteps: [
      {
        label: "인터페이스 선언",
        code: `interface Figure {
    double getArea();
}`,
        output: "면적 계산 규약",
        explanation: "Figure를 구현하는 클래스는 getArea를 제공해야 한다.",
      },
      {
        label: "구현 클래스",
        code: `class Triangle implements Figure {
    public double getArea() {
        return height * width * 0.5;
    }
}`,
        output: "삼각형 면적 구현",
        explanation: "클래스는 인터페이스를 implements로 구현한다.",
      },
      {
        label: "익명 클래스",
        code: `CSuper sub = new CSuper() {
    public void print() {
        System.out.println("B");
    }
};`,
        output: "이름 없는 하위 클래스 객체",
        explanation: "CSuper를 상속한 일회성 하위 클래스를 만들고 sub에 대입한다.",
      },
    ],
    drill: {
      title: "extends·implements 판별",
      subtitle: "클래스와 인터페이스 관계에 맞는 키워드를 고른다.",
      cases: [
        { label: "class B extends A", input: "클래스가 클래스를 물려받음", output: "extends", rule: "클래스 상속은 extends를 사용한다." },
        { label: "class Box implements Comparable<Box>", input: "클래스가 인터페이스 구현", output: "implements", rule: "인터페이스 구현은 implements를 사용한다." },
        { label: "interface Sub extends Super", input: "인터페이스가 인터페이스 확장", output: "extends", rule: "인터페이스끼리는 extends를 사용한다." },
        { label: "new CSuper() { }", input: "생성식 뒤 중괄호", output: "익명 하위 클래스", rule: "이름 없는 하위 클래스를 정의하며 객체를 생성한다." },
      ],
    },
    quizzes: [
      quiz("클래스가 부모 클래스를 상속하고 인터페이스를 구현할 때 키워드 순서는?", "extends, implements", ["extends, extends", "implements, implements", "implements, extends"], "키워드", "근거: 클래스 상속은 extends, 인터페이스 구현은 implements를 쓴다.", "상속/구현 키워드 판별"),
      quiz("`new CSuper() { }`의 의미로 가장 정확한 것은?", "CSuper를 상속한 익명 하위 클래스를 선언하고 객체를 생성한다.", ["CSuper의 static 필드를 삭제한다.", "CSuper 인터페이스를 import한다.", "CSuper 클래스 파일을 컴파일하지 않는다."], "익명 클래스", "근거: 생성식 뒤 중괄호는 익명 클래스 본문이다.", "익명 클래스 설명"),
      quiz("추상 메소드의 특징은?", "본문 없이 선언되고 하위 클래스 구현을 요구할 수 있다.", ["항상 static이어야 한다.", "항상 private이어야 한다.", "반환형을 가질 수 없다."], "추상 메소드", "근거: 추상 메소드는 구현을 하위 타입에 맡기는 메소드 선언이다.", "abstract 이해"),
      quiz("인터페이스에 관한 설명으로 알맞은 것은?", "클래스가 따라야 할 메소드 규약을 정의할 수 있다.", ["항상 객체 필드만 저장한다.", "클래스보다 먼저 실행된다.", "예외 클래스만 담을 수 있다."], "인터페이스", "근거: 인터페이스는 구현 클래스가 제공할 동작의 공통 규약이다.", "인터페이스 역할"),
      quiz("다형성 출력 문제에서 우선 확인할 것은?", "참조 변수가 가리키는 실제 객체와 오버라이딩 여부", ["소스 파일의 줄 수", "패키지 주석", "컴파일러 설치 경로"], "다형성", "근거: 오버라이딩 메소드는 실행 시 실제 객체 타입을 기준으로 선택된다.", "동적 바인딩 판별"),
    ],
  },

  6: {
    id: 6,
    title: "제네릭과 람다식",
    sourceLabel: "강의 6강·제네릭 타입·제네릭 메소드와 타입 제한·람다식",
    intro:
      "제네릭으로 타입 안정성을 확보하고 형변환을 줄이는 방법을 배운 뒤, 타입 제한과 raw 타입의 위험, 람다식과 표준 함수형 인터페이스의 문법을 연결한다.",
    goals: ["제네릭 클래스·인터페이스·메소드 문법 설명", "raw 타입과 타입 제한, 기본형 사용 오류 판별", "람다식과 Supplier<T> 형식 판별"],
    audit: {
      lecture: "제네릭 의미와 사용, 제네릭 클래스 정의, raw 타입, 제네릭 메소드, 타입 제한, 제네릭 타입과 형변환, 사용 시 유의 사항, 람다식",
      definitions: "generic type, type parameter, raw type, bounded type parameter, lambda expression, functional interface, Supplier",
      procedures: "타입 매개변수 선언→구체 타입 지정→컴파일 시 타입 검사→람다식으로 함수형 인터페이스 구현",
      examples: "Data<T>, Pair<K,V>, OrderedPair, `<T extends Number>`, Addable 람다, Supplier<T>.get()",
      exercisePoint: "제네릭에 기본형 int 사용 불가, 람다식 return 문법, Supplier<T>의 `T get()`",
      implementation: "제네릭 타입 안전성 추적, 람다 문법 드릴, 표준 함수형 인터페이스 퀴즈",
    },
    units: [
      {
        title: "제네릭 타입의 의미와 필요성",
        anchor: "6.1",
        summary: "제네릭은 클래스, 인터페이스, 메소드가 사용할 타입을 매개변수처럼 받아 컴파일 시점에 타입을 검사한다.",
        definition: "제네릭 타입은 타입 매개변수를 사용해 다양한 실제 타입에 대해 하나의 코드를 재사용하는 타입.",
        why: "Object 기반 코드는 강제 형변환과 실행 오류 위험이 있지만 제네릭은 컴파일 오류로 미리 잡을 수 있다.",
        components: ["타입 매개변수 T", "구체 타입 인자", "다이아몬드 연산자 <>", "컴파일 시 타입 검사", "형변환 제거"],
        examples: ["`Data<String> data = new Data<>();`", "`List<String>`에서 get 결과는 String"],
        mistake: "제네릭 타입 인자에 `int` 같은 기본 자료형을 직접 넣을 수 없다.",
        examFocus: "기본형 사용 오류와 타입 안정성 장점.",
      },
      {
        title: "제네릭 클래스, 인터페이스, raw 타입",
        anchor: "6.2",
        summary: "제네릭 클래스와 인터페이스는 타입 매개변수를 선언하고, raw 타입은 타입 인자를 생략한 과거 방식이다.",
        definition: "raw 타입은 제네릭 타입에서 타입 인자를 지정하지 않은 형태로, 컴파일 경고와 실행 오류 가능성을 남긴다.",
        why: "raw 타입은 문법상 허용되지만 제네릭이 주는 타입 안전성을 잃는다.",
        components: ["Data<T>", "Pair<K,V>", "OrderedPair<K,V>", "raw Data", "타입 소거"],
        examples: ["`Pair<String, Integer> p1`", "`Data d = new Data();`"],
        mistake: "raw 타입이 허용된다고 해서 좋은 제네릭 사용법이라고 판단하면 안 된다.",
        examFocus: "문법 오류와 경고 가능 표현 구분.",
      },
      {
        title: "제네릭 메소드와 타입 제한",
        anchor: "6.3",
        summary: "메소드 자체에 타입 매개변수를 선언할 수 있고, extends 제한으로 허용할 타입 범위를 좁힐 수 있다.",
        definition: "타입 제한은 `<T extends Number>`처럼 타입 매개변수가 특정 상위 타입의 하위 타입이어야 함을 지정하는 문법.",
        why: "제네릭의 재사용성을 유지하면서도 필요한 메소드나 연산을 안전하게 사용하려면 타입 범위를 제한해야 한다.",
        components: ["`<T>` 제네릭 메소드", "`<K,V>`", "`extends` 제한", "상속 관계와 제네릭 타입", "와일드카드 개념"],
        procedure: ["타입 매개변수 선언", "매개변수와 반환형에 사용", "필요하면 상한 제한", "호출 시 타입 추론 또는 명시"],
        examples: ["`public <T> void swap(T[] array, int i, int j)`", "`Data<T extends Number>`"],
        mistake: "`Data<Number>`와 `Data<Integer>`가 상속 관계라고 생각하면 대입 오류를 놓친다.",
        examFocus: "제네릭 타입 제한과 형변환 가능성.",
      },
      {
        title: "람다식과 함수형 인터페이스",
        anchor: "6.4",
        summary: "람다식은 함수형 인터페이스의 추상 메소드를 간결하게 구현하는 표현식이다.",
        definition: "함수형 인터페이스는 추상 메소드가 하나인 인터페이스이며, 람다식은 그 메소드 본문을 대신한다.",
        why: "본문이 식 하나이면 return과 중괄호를 생략할 수 있지만, return을 쓰려면 중괄호 블록이 필요하다.",
        components: ["매개변수 목록", "화살표 `->`", "식 본문", "블록 본문", "Supplier<T>", "Consumer/Function/Predicate"],
        examples: ["`(int a, int b) -> a + b`", "`Supplier<String> s = () -> \"Java\";`", "`T get()`"],
        mistake: "`(a, b) -> return (a + b)`는 return이 블록 밖에 있어 문법 오류이다.",
        examFocus: "람다식 문법과 표준 함수형 인터페이스 메소드 이름.",
      },
    ],
    codeSteps: [
      {
        label: "Object 기반",
        code: `Data data = new Data();
data.set(Integer.valueOf(20));
String s = (String) data.get();`,
        output: "실행 오류 가능",
        explanation: "컴파일은 지나갈 수 있지만 잘못된 형변환이 실행 시점에 드러난다.",
      },
      {
        label: "제네릭 기반",
        code: `Data<String> data = new Data<>();
data.set(Integer.valueOf(20));`,
        output: "컴파일 오류",
        explanation: "Data<String>에는 String만 넣을 수 있어 잘못된 값을 컴파일러가 막는다.",
      },
      {
        label: "람다식",
        code: `Addable ad = (a, b) -> (a + b);
Supplier<String> sp = () -> "Java";`,
        output: "함수형 인터페이스 구현",
        explanation: "람다식은 추상 메소드 하나의 구현을 짧게 제공한다.",
      },
    ],
    drill: {
      title: "제네릭·람다 문법 판별",
      subtitle: "문법 오류, 경고 가능 표현, 올바른 표현을 분리한다.",
      cases: [
        { label: "Data<int>", input: "제네릭 타입 인자", output: "오류", rule: "제네릭 타입 인자는 참조형이어야 한다." },
        { label: "Data<Integer>", input: "제네릭 타입 인자", output: "올바름", rule: "Integer는 int의 래퍼 클래스이다." },
        { label: "(a, b) -> return (a + b)", input: "람다식", output: "오류", rule: "return을 쓰려면 `{ return ...; }` 블록이 필요하다." },
        { label: "Supplier<T>", input: "추상 메소드", output: "T get()", rule: "Supplier는 인자를 받지 않고 값을 공급한다." },
      ],
    },
    quizzes: [
      quiz("제네릭 클래스 사용 중 문법적으로 오류가 있는 것은?", "Data<int> d = new Data<>();", ["Data<Integer> d = new Data<>();", "Data<String> d = new Data<String>();", "Data d = new Data();"], "제네릭 타입", "근거: 제네릭 타입 인자에는 기본형 int가 아니라 Integer 같은 참조형을 사용한다.", "제네릭 문법 오류 판별"),
      quiz("람다식 사용이 잘못된 것은?", "Addable ad = (a, b) -> return (a + b);", ["Addable ad = (int a, int b) -> { return (a + b); };", "Addable ad = (int a, int b) -> a + b;", "Addable ad = (a, b) -> (a + b);"], "람다식", "근거: return 문은 중괄호 블록 안에서 사용해야 한다.", "람다 문법 판별"),
      quiz("Supplier<T>의 추상 메소드 이름과 형식은?", "get, T get()", ["accept, void accept(T)", "apply, R apply(T)", "test, boolean test(T)"], "함수형 인터페이스", "근거: Supplier는 인자 없이 T 타입 값을 공급하는 함수형 인터페이스이다.", "표준 함수형 인터페이스 매칭"),
      quiz("raw 타입 사용의 핵심 위험은?", "컴파일 시 타입 검사를 잃어 실행 오류 가능성이 커진다.", ["항상 문법 오류가 난다.", "모든 타입 변환이 자동으로 안전해진다.", "JVM을 실행할 수 없다."], "raw 타입", "근거: raw 타입은 제네릭 타입 인자를 생략해 타입 안정성을 약화한다.", "raw 타입 이해"),
      quiz("`<T extends Number>`의 의미는?", "T가 Number 또는 그 하위 타입이어야 한다.", ["T가 반드시 String이어야 한다.", "T가 기본형이어야 한다.", "T가 인터페이스일 수 없다."], "타입 제한", "근거: 제네릭 타입 제한은 사용할 수 있는 타입 인자의 상한을 지정한다.", "bounded type parameter 이해"),
    ],
  },

  7: {
    id: 7,
    title: "패키지와 예외처리",
    sourceLabel: "강의 7강·패키지·사용자 정의 패키지·예외와 예외처리",
    intro:
      "패키지로 클래스를 논리적으로 묶고 import와 classpath로 클래스를 찾는 방법을 익힌 뒤, 예외 계층과 try-catch-finally, throw/throws 사용 기준을 학습한다.",
    goals: ["package와 import 선언 위치·역할 설명", "패키지 접근 제어와 classpath 흐름 판별", "예외 직접 처리와 위임 처리 구분"],
    audit: {
      lecture: "패키지, 시스템 패키지, 사용자 패키지 정의, import, 패키지 접근 제어, 클래스 찾기, 예외와 에러, 예외 클래스 계층, 예외처리 방법, try/catch/finally, throw/throws",
      definitions: "package, import, classpath, exception, error, checked exception, unchecked exception, try-catch-finally, throw, throws",
      procedures: "패키지 선언→import 선언→클래스 경로 탐색→예외 발생→직접 처리 또는 호출자에게 위임",
      examples: "`package myprogram.game;`, `import java.util.Scanner;`, `throws IOException`, 사용자 정의 패키지 접근 제어",
      exercisePoint: "패키지 선언, IOException 위임의 `throws`, Scanner import",
      implementation: "패키지/import 배치 추적, 예외 처리 흐름 드릴, 객관식 변형 퀴즈",
    },
    units: [
      {
        title: "패키지와 시스템 패키지",
        anchor: "7.1",
        summary: "패키지는 관련 클래스를 묶어 이름 충돌을 줄이고 클래스의 논리적 위치를 표현한다.",
        definition: "`package` 선언은 소스 파일 맨 위에서 해당 클래스가 속한 패키지를 지정하는 선언.",
        why: "패키지 이름은 디렉터리 구조와 연결되고, 완전한 클래스 이름은 패키지명과 클래스 이름을 포함한다.",
        components: ["package 선언", "시스템 패키지", "완전한 클래스 이름", "디렉터리 구조", "이름 충돌 방지"],
        examples: ["`package myprogram.game;`", "`java.util.Scanner`"],
        mistake: "`package myprogram.game.Client;`처럼 클래스 이름까지 package에 넣으면 패키지 선언이 아니다.",
        examFocus: "소스 파일 맨 위 package 선언 형식.",
      },
      {
        title: "import와 클래스 찾기",
        anchor: "7.2",
        summary: "import는 완전한 클래스 이름 대신 단순 이름을 사용할 수 있게 해 주며, JVM과 컴파일러는 classpath에서 클래스를 찾는다.",
        definition: "`import 패키지이름.클래스이름;` 또는 `import 패키지이름.*;`는 다른 패키지의 클래스를 소스에서 간단히 쓰게 하는 선언.",
        why: "import는 클래스를 포함시키는 명령이 아니라 이름 해석을 돕는 선언이다.",
        components: ["단일 타입 import", "와일드카드 import", "classpath", "컴파일 시 탐색", "실행 시 탐색"],
        examples: ["`import java.util.Scanner;` 후 `Scanner sc` 사용", "`import com.vehicle.*;`"],
        mistake: "import를 package 선언보다 위에 쓰거나 클래스 이름 생략 효과를 실행 시 로딩과 혼동하면 안 된다.",
        examFocus: "완전한 이름과 단순 이름 사용 조건.",
      },
      {
        title: "패키지 접근 제어",
        anchor: "7.3",
        summary: "패키지는 이름 공간일 뿐 아니라 package-private 접근 범위를 결정하는 기준이다.",
        definition: "접근 제어자가 없는 클래스나 멤버는 같은 패키지 안에서만 접근할 수 있다.",
        why: "같은 패키지인지, public인지, 상속 관계인지에 따라 사용할 수 있는 클래스와 멤버가 달라진다.",
        components: ["public class", "package-private class", "protected member", "private member", "같은 패키지"],
        examples: ["`class Car`는 패키지 밖에서 직접 사용 불가", "`public class Bus`는 import 후 사용 가능"],
        mistake: "와일드카드 import를 했다고 package-private 클래스까지 패키지 밖에서 사용할 수 있는 것은 아니다.",
        examFocus: "패키지와 접근 제어 조건 결합 문제.",
      },
      {
        title: "예외와 예외처리",
        anchor: "7.4",
        summary: "예외는 프로그램 실행 중 발생하는 비정상 상황이며, Java는 직접 처리하거나 호출자에게 처리를 위임할 수 있다.",
        definition: "`throws`는 메소드 선언부에서 발생 가능한 예외를 호출자에게 알리고 처리를 위임하는 키워드.",
        why: "`throw`는 예외 객체를 실제로 던지고, `throws`는 메소드가 던질 수 있음을 선언한다.",
        components: ["Throwable", "Exception", "RuntimeException", "Error", "try", "catch", "finally", "throw", "throws"],
        procedure: ["위험 코드 try에 배치", "예외 타입별 catch 작성", "정리 작업 finally 처리", "처리하지 않으면 throws로 위임"],
        examples: ["`throws IOException`", "`catch (Exception e) { ... }`"],
        mistake: "밑줄에 예외 위임 선언이 필요한데 `throw IOException`처럼 객체 생성 없이 쓰면 문법과 의미가 모두 다르다.",
        examFocus: "throw와 throws, 직접 처리와 위임 처리 구분.",
      },
    ],
    codeSteps: [
      {
        label: "패키지 선언",
        code: `package myprogram.game;

public class Client {
}`,
        output: "myprogram.game.Client",
        explanation: "package 선언은 소스 파일 맨 위에 두고 클래스의 소속 패키지를 지정한다.",
      },
      {
        label: "import 선언",
        code: `import java.util.Scanner;

Scanner sc = new Scanner(System.in);`,
        output: "단순 이름 Scanner 사용",
        explanation: "import 후에는 완전한 이름 대신 클래스 이름만 사용할 수 있다.",
      },
      {
        label: "예외 위임",
        code: `void readFile() throws IOException {
    // 파일 읽기
}`,
        output: "호출자에게 IOException 처리 요구",
        explanation: "throws는 메소드 선언부에 쓰며 예외 처리를 위임한다.",
      },
    ],
    drill: {
      title: "package·import·throws 판별",
      subtitle: "선언 위치와 키워드 의미를 분리해 본다.",
      cases: [
        { label: "package myprogram.game;", input: "소스 맨 위", output: "패키지 선언", rule: "클래스가 속한 패키지를 지정한다." },
        { label: "import java.util.Scanner;", input: "Scanner 단순 이름 사용", output: "올바름", rule: "완전한 이름 대신 단순 이름을 쓸 수 있다." },
        { label: "throws IOException", input: "메소드 선언부", output: "예외 위임", rule: "발생 가능한 예외를 호출자에게 알린다." },
        { label: "throw IOException", input: "메소드 선언부 빈칸", output: "오류", rule: "throw는 예외 객체를 던지는 문장이다." },
      ],
    },
    quizzes: [
      quiz("Client 클래스를 myprogram.game 패키지에 위치시키려면 소스 맨 위에 무엇을 써야 하는가?", "package myprogram.game;", ["package myprogram.game.Client;", "import myprogram.game;", "import myprogram.game.Client;"], "패키지 선언", "근거: package 선언에는 패키지 이름을 쓰며 클래스 이름을 포함하지 않는다.", "package 형식 판별"),
      quiz("메소드가 IOException 처리를 호출자에게 위임할 때 선언부에 들어갈 내용은?", "throws IOException", ["throw IOException", "throw FileNotFoundException", "throws Scanner"], "예외 위임", "근거: throws는 메소드 선언부에서 예외 위임을 나타낸다.", "throw/throws 구분"),
      quiz("Scanner를 단순 이름으로 사용하기 위한 import 선언은?", "import java.util.Scanner;", ["package java.util.Scanner;", "import java.util;", "throws java.util.Scanner;"], "import", "근거: java.util.Scanner 클래스를 단일 타입 import하면 `Scanner` 단순 이름을 사용할 수 있다.", "import 작성"),
      quiz("접근 제어자가 없는 클래스의 기본 접근 범위는?", "같은 패키지", ["모든 패키지", "하위 클래스만", "JVM 내부만"], "접근 제어", "근거: package-private 접근은 같은 패키지 안에서만 허용된다.", "패키지 접근 판별"),
      quiz("finally 블록의 주된 용도는?", "예외 발생 여부와 관계없이 정리 작업을 수행한다.", ["예외 클래스를 선언한다.", "패키지 이름을 바꾼다.", "컴파일러를 실행한다."], "예외처리", "근거: finally는 try-catch 흐름 이후 공통 정리 작업에 사용된다.", "try-catch-finally 역할"),
    ],
  },

  8: {
    id: 8,
    title: "java.lang 패키지",
    sourceLabel: "강의 8강·Object·String·StringBuffer·System 클래스",
    intro:
      "모든 클래스의 조상인 Object와 문자열 처리의 핵심인 String, 가변 문자열 클래스인 StringBuffer/StringBuilder, System 클래스의 표준 기능을 정리한다.",
    goals: ["Object의 주요 메소드와 재정의 의미 설명", "String 불변성과 문자열 비교·검색·변환 판별", "StringBuffer/StringBuilder와 System 클래스 역할 구분"],
    audit: {
      lecture: "java.lang 패키지, Object 클래스, toString/equals/clone/getClass, String 생성자·비교·검색·추출·변환, StringBuffer 생성자와 주요 메소드, System 클래스",
      definitions: "java.lang, Object, toString, equals, clone, getClass, String immutability, StringBuffer, StringBuilder, System.in/out/err",
      procedures: "객체 문자열 표현→동등성 비교→문자열 검색·추출·변환→가변 버퍼 수정→표준 입출력 사용",
      examples: "MyClass toString, Integer equals, Cloneable Box, String.valueOf, 반복 문자열 결합 시간 차이",
      exercisePoint: "String 변경 출력 Jovo, Object/String 설명의 오답, String과 StringBuffer/StringBuilder 성능 차이",
      implementation: "String 변경 흐름, Object 메소드 드릴, 불변/가변 문자열 퀴즈",
    },
    units: [
      {
        title: "java.lang과 Object 클래스",
        anchor: "8.1",
        summary: "java.lang은 자동으로 사용할 수 있는 핵심 패키지이고, 모든 클래스는 묵시적으로 Object를 상속한다.",
        definition: "Object 클래스는 모든 클래스의 최상위 클래스이며 toString, equals, clone, getClass 같은 공통 메소드를 제공한다.",
        why: "객체 출력, 동등성 비교, 복제, 클래스 정보 조회는 Object 메소드 재정의 여부에 따라 결과가 달라진다.",
        components: ["toString()", "equals()", "clone()", "getClass()", "Cloneable"],
        examples: ["toString을 재정의하면 객체 출력 문자열이 바뀜", "getClass로 클래스 이름·필드·메소드 정보 조회"],
        mistake: "모든 클래스가 Object를 상속한다는 사실을 놓치면 공통 메소드의 출처를 오해한다.",
        examFocus: "Object 메소드와 String 재정의 여부 판별.",
      },
      {
        title: "String 클래스와 불변성",
        anchor: "8.2",
        summary: "String 객체는 한 번 만들어진 문자열 내용을 바꾸지 않으며, 수정처럼 보이는 연산은 새 문자열 객체를 만든다.",
        definition: "String은 문자열을 표현하는 불변 객체이며, equals와 toString 등이 문자열 의미에 맞게 재정의되어 있다.",
        why: "반복 연결에서는 매번 새 객체가 생겨 시간이 늘어날 수 있으므로 가변 문자열 클래스와 비교해야 한다.",
        components: ["문자열 리터럴", "new String", "equals", "substring", "replace", "valueOf", "불변 객체"],
        procedure: ["문자열 생성", "검색·추출·변환 메소드 호출", "결과 문자열을 새 참조에 저장", "원본 변화 여부 확인"],
        examples: ["`String.valueOf(123)`은 `\"123\"`", "`replace` 결과를 받아야 변경된 문자열 사용 가능"],
        mistake: "String 메소드 호출이 기존 객체 내부를 직접 바꾼다고 보면 출력 결과를 틀린다.",
        examFocus: "문자열 변경 결과와 비교 메소드 판별.",
      },
      {
        title: "StringBuffer와 StringBuilder",
        anchor: "8.3",
        summary: "StringBuffer와 StringBuilder는 내부 버퍼를 바꾸는 가변 문자열 클래스다.",
        definition: "가변 문자열 클래스는 append, insert, delete, replace 같은 메소드로 같은 버퍼 내용을 수정한다.",
        why: "반복적인 문자열 결합에서는 String보다 불필요한 객체 생성을 줄일 수 있다.",
        components: ["StringBuffer", "StringBuilder", "append", "insert", "delete", "capacity", "가변 버퍼"],
        examples: ["반복 루프에서 `StringBuilder.append` 사용", "StringBuffer는 동기화된 가변 문자열 클래스"],
        mistake: "StringBuffer와 String을 모두 불변이라고 보면 성능 차이 설명이 불가능하다.",
        examFocus: "불변 String과 가변 버퍼 클래스 비교.",
      },
      {
        title: "System 클래스",
        anchor: "8.4",
        summary: "System 클래스는 표준 입출력 스트림, 시스템 속성, 시간, 배열 복사 같은 정적 기능을 제공한다.",
        definition: "System 클래스는 `in`, `out`, `err` 같은 표준 스트림을 static 필드로 제공한다.",
        why: "표준 입출력 스트림을 제공하는 것은 String 클래스가 아니라 System 클래스이다.",
        components: ["System.in", "System.out", "System.err", "currentTimeMillis", "arraycopy", "exit"],
        examples: ["`System.out.println`", "`System.currentTimeMillis()`로 시간 측정"],
        mistake: "String 클래스가 표준 입출력 스트림 static 필드를 제공한다고 하면 오답이다.",
        examFocus: "System과 String의 역할 구분.",
      },
    ],
    codeSteps: [
      {
        label: "String 변경",
        code: `String s = "Java";
s = s.replace('a', 'o');
System.out.println(s);`,
        output: "Jovo",
        explanation: "replace 결과로 새 문자열을 만들고 그 참조를 다시 s에 대입한다.",
      },
      {
        label: "Object 출력",
        code: `class MyClass2 {
    public String toString() {
        return "This MyClass2 class";
    }
}`,
        output: "재정의한 문자열 출력",
        explanation: "toString을 재정의하면 객체를 출력할 때 원하는 문자열이 나온다.",
      },
      {
        label: "가변 문자열",
        code: `StringBuilder sb = new StringBuilder("Java");
sb.append("Exam");`,
        output: "JavaExam",
        explanation: "StringBuilder는 내부 버퍼를 수정해 문자열을 누적한다.",
      },
    ],
    drill: {
      title: "Object·String 역할 판별",
      subtitle: "공통 메소드와 문자열 클래스의 차이를 고른다.",
      cases: [
        { label: "toString()", input: "객체 문자열 표현", output: "Object 메소드", rule: "필요하면 하위 클래스가 재정의한다." },
        { label: "equals()", input: "문자열 내용 비교", output: "String에서 재정의", rule: "String equals는 문자 순서를 비교한다." },
        { label: "System.out", input: "표준 출력 스트림", output: "System 클래스", rule: "String 클래스의 static 필드가 아니다." },
        { label: "StringBuffer", input: "반복 결합", output: "가변 버퍼", rule: "같은 버퍼를 수정해 객체 생성을 줄인다." },
      ],
    },
    quizzes: [
      quiz("Object 클래스와 String 클래스에 대한 설명 중 잘못된 것은?", "String 클래스는 표준 입출력 스트림을 위한 static 필드를 제공한다.", ["모든 클래스는 묵시적으로 Object 클래스를 상속받는다.", "Object 클래스에 toString()과 equals()가 정의되어 있다.", "String 클래스에 toString()과 equals()가 재정의되어 있다."], "java.lang", "근거: 표준 입출력 스트림은 System 클래스의 static 필드이다.", "Object/String/System 역할 구분"),
      quiz("반복 문자열 처리에서 String과 StringBuffer/StringBuilder 시간 차이가 생기는 핵심 이유는?", "String은 불변이라 반복 연결 때 새 객체가 계속 만들어진다.", ["String은 기본 자료형이기 때문이다.", "StringBuffer는 컴파일러이다.", "StringBuilder는 파일 스트림이다."], "문자열 처리", "근거: 강의는 String 불변성과 가변 버퍼의 내부 수정 차이를 다룬다.", "불변/가변 문자열 비교"),
      quiz("모든 클래스가 묵시적으로 상속하는 최상위 클래스는?", "Object", ["System", "String", "Scanner"], "Object", "근거: Object는 Java 클래스 계층의 최상위 클래스이다.", "Object 계층 이해"),
      quiz("객체의 실제 클래스 정보를 얻는 Object 메소드는?", "getClass()", ["getNameOnly()", "readClass()", "systemClass()"], "Object 메소드", "근거: getClass는 런타임 클래스 정보를 담은 Class 객체를 반환한다.", "Object 메소드 매칭"),
      quiz("표준 출력에 문자열을 쓰는 대표 문장은?", "System.out.println(\"Java\");", ["String.out.println(\"Java\");", "Object.println(\"Java\");", "Scanner.println(\"Java\");"], "System", "근거: System.out은 표준 출력 스트림이고 println은 출력 메소드이다.", "표준 출력 판별"),
    ],
  },

  9: {
    id: 9,
    title: "java.io 패키지와 스트림",
    sourceLabel: "강의 9강·입출력 스트림·바이트/캐릭터 스트림·파일 입출력·보조 스트림",
    intro:
      "입출력 스트림의 방향과 단위, 기본 스트림과 보조 스트림의 차이를 정리하고 File, RandomAccessFile, FileInputStream/FileReader, BufferedReader와 InputStreamReader 사용을 학습한다.",
    goals: ["입력/출력, 바이트/문자, 기본/보조 스트림 구분", "File과 RandomAccessFile, 파일 스트림 사용 흐름 설명", "BufferedReader와 InputStreamReader 역할 판별"],
    audit: {
      lecture: "입출력 스트림, 입력 스트림과 출력 스트림, 스트림 분류, InputStream/OutputStream/Reader/Writer, File, RandomAccessFile, FileInputStream/FileOutputStream, FileReader/FileWriter, Console, 보조 스트림",
      definitions: "stream, input stream, output stream, byte stream, character stream, node stream, filter stream, File, RandomAccessFile, BufferedReader, InputStreamReader",
      procedures: "기본 스트림 생성→보조 스트림으로 감싸기→read/write 반복→close 또는 try-with-resources 정리",
      examples: "FileInputStream+BufferedInputStream, RandomAccessFile seek, FileReader/FileWriter, System.in→InputStreamReader→BufferedReader",
      exercisePoint: "BufferedReader는 보조 스트림, 바이트 입력 기능 아님, InputStreamReader로 바이트→문자 변환",
      implementation: "스트림 분류 드릴, 변환 체인 코드 추적, 객관식 변형 퀴즈",
    },
    units: [
      {
        title: "입출력 스트림의 개념과 분류",
        anchor: "9.1",
        summary: "스트림은 프로그램과 데이터 소스·목적지 사이에서 데이터가 흐르는 통로이다.",
        definition: "입력 스트림은 외부 데이터를 프로그램으로 읽고, 출력 스트림은 프로그램 데이터를 외부로 내보낸다.",
        why: "스트림 문제는 방향, 데이터 단위, 기본/보조 여부를 동시에 묻는다.",
        components: ["입력 스트림", "출력 스트림", "바이트 스트림", "캐릭터 스트림", "기본 스트림", "보조 스트림"],
        examples: ["FileInputStream은 파일에서 바이트를 읽는 기본 스트림", "BufferedReader는 Reader를 감싸는 보조 스트림"],
        mistake: "보조 스트림은 독립적으로 데이터 원본에 연결된 기본 스트림이 아니다.",
        examFocus: "기본 스트림과 보조 스트림 분류.",
      },
      {
        title: "바이트 스트림과 캐릭터 스트림",
        anchor: "9.2",
        summary: "바이트 스트림은 8비트 단위 입출력, 캐릭터 스트림은 문자 단위 입출력을 다룬다.",
        definition: "Reader와 Writer 계열은 문자 데이터를 처리하고, InputStream과 OutputStream 계열은 바이트 데이터를 처리한다.",
        why: "한글 같은 문자 입력은 바이트 스트림을 문자 스트림으로 변환하는 과정이 필요할 수 있다.",
        components: ["InputStream", "OutputStream", "Reader", "Writer", "InputStreamReader", "OutputStreamWriter"],
        procedure: ["바이트 소스 확인", "문자 처리가 필요하면 변환 스트림 사용", "버퍼링이 필요하면 BufferedReader 등으로 감싸기"],
        examples: ["`new InputStreamReader(System.in)`", "`new BufferedReader(reader)`"],
        mistake: "BufferedReader를 바이트 단위 입력 클래스로 설명하면 Reader 계열이라는 사실과 맞지 않는다.",
        examFocus: "BufferedReader와 InputStreamReader 역할 구분.",
      },
      {
        title: "파일 입출력과 RandomAccessFile",
        anchor: "9.3",
        summary: "File은 파일·디렉터리 경로와 속성을 표현하고, 파일 스트림은 실제 내용을 읽고 쓴다.",
        definition: "RandomAccessFile은 파일의 임의 위치로 이동해 읽기와 쓰기를 수행할 수 있는 클래스.",
        why: "File은 파일 메타정보와 경로 처리를 담당하고, 내용 입출력은 스트림이나 RandomAccessFile이 담당한다.",
        components: ["File", "listFiles", "length", "FileInputStream", "FileOutputStream", "FileReader", "FileWriter", "seek"],
        examples: ["`raf.seek(i)` 후 `raf.read()`", "FileInputStream으로 읽고 FileOutputStream으로 복사"],
        mistake: "File 객체만 만들면 파일 내용 읽기/쓰기가 된다고 보면 역할을 혼동한 것이다.",
        examFocus: "File과 스트림, RandomAccessFile 기능 구분.",
      },
      {
        title: "콘솔 입출력과 보조 스트림",
        anchor: "9.4",
        summary: "보조 스트림은 기존 스트림에 버퍼링, 변환, 객체 처리 같은 기능을 덧붙인다.",
        definition: "BufferedReader는 문자 입력 스트림에 버퍼링 기능과 readLine 같은 편의 메소드를 제공하는 보조 스트림.",
        why: "키보드 입력의 System.in은 바이트 스트림이므로 문자 입력을 위해 InputStreamReader로 변환하고 BufferedReader로 감쌀 수 있다.",
        components: ["Console", "BufferedReader", "BufferedInputStream", "InputStreamReader", "readLine", "try-with-resources"],
        examples: ["`BufferedReader br = new BufferedReader(new InputStreamReader(System.in));`"],
        mistake: "BufferedReader가 기본 스트림이라고 보면 실제 데이터 소스와 직접 연결되는 클래스가 아님을 놓친다.",
        examFocus: "보조 스트림의 분류와 바이트→문자 변환 체인.",
      },
    ],
    codeSteps: [
      {
        label: "기본 스트림",
        code: `FileInputStream fis = new FileInputStream("text.txt");`,
        output: "파일 바이트 입력",
        explanation: "FileInputStream은 파일이라는 데이터 원본에 직접 연결되는 기본 스트림이다.",
      },
      {
        label: "보조 스트림",
        code: `BufferedInputStream bis = new BufferedInputStream(fis);`,
        output: "버퍼링 추가",
        explanation: "BufferedInputStream은 기존 입력 스트림에 버퍼 기능을 덧붙인다.",
      },
      {
        label: "문자 변환",
        code: `BufferedReader br =
    new BufferedReader(new InputStreamReader(System.in));`,
        output: "키보드 문자 입력",
        explanation: "System.in 바이트 스트림을 InputStreamReader로 문자 스트림으로 변환한 뒤 버퍼링한다.",
      },
    ],
    drill: {
      title: "스트림 분류 판별",
      subtitle: "클래스가 기본/보조, 바이트/문자 중 어디에 속하는지 고른다.",
      cases: [
        { label: "FileReader", input: "파일 문자 입력", output: "기본 캐릭터 스트림", rule: "파일에 직접 연결되고 문자 단위로 읽는다." },
        { label: "ByteArrayInputStream", input: "바이트 배열 입력", output: "기본 바이트 스트림", rule: "바이트 배열을 원본으로 직접 읽는다." },
        { label: "BufferedReader", input: "버퍼링 문자 입력", output: "보조 캐릭터 스트림", rule: "Reader를 감싸 기능을 추가한다." },
        { label: "InputStreamReader", input: "바이트→문자 변환", output: "변환 보조 스트림", rule: "InputStream을 Reader로 연결한다." },
      ],
    },
    quizzes: [
      quiz("입력 스트림 중 기본 스트림에 해당하지 않는 것은?", "BufferedReader", ["StringReader", "FileReader", "ByteArrayInputStream"], "스트림 분류", "근거: BufferedReader는 다른 Reader를 감싸는 보조 스트림이다.", "기본/보조 스트림 구분"),
      quiz("BufferedReader에 관한 설명으로 틀린 것은?", "바이트 단위의 입력 기능을 제공한다.", ["Reader의 자식 클래스이다.", "read()와 readLine() 등 입력 메소드를 제공한다.", "입력 과정에 버퍼링 기능을 제공한다."], "BufferedReader", "근거: BufferedReader는 문자 입력을 다루는 Reader 계열이다.", "문자/바이트 스트림 구분"),
      quiz("System.in을 문자 스트림으로 변환할 때 사용하는 클래스는?", "InputStreamReader", ["FileChannelReader", "StringBuilder", "DriverManager"], "변환 스트림", "근거: InputStreamReader는 바이트 입력 스트림을 Reader로 변환한다.", "바이트→문자 변환"),
      quiz("RandomAccessFile의 특징은?", "파일의 임의 위치로 이동해 읽기와 쓰기를 수행할 수 있다.", ["항상 네트워크만 감시한다.", "패키지 이름을 변경한다.", "람다식을 컴파일한다."], "파일 입출력", "근거: RandomAccessFile은 seek로 위치를 이동할 수 있다.", "임의 접근 파일 이해"),
      quiz("File 클래스의 주된 역할은?", "파일이나 디렉터리 경로와 속성을 표현한다.", ["JVM 바이트코드를 실행한다.", "SQL 결과 집합을 보관한다.", "함수형 인터페이스를 구현한다."], "File", "근거: File은 파일 시스템 객체의 경로·속성 조작에 쓰이며 내용 입출력은 스트림이 담당한다.", "File/스트림 역할 구분"),
    ],
  },

  10: {
    id: 10,
    title: "java.nio 패키지의 활용",
    sourceLabel: "강의 10강·java.nio·버퍼·FileChannel·WatchService",
    intro:
      "java.nio.file의 Path, FileSystem, FileStore, Files와 java.nio의 Buffer, FileChannel, Charset, WatchService를 통해 현대적인 파일 경로·채널 기반 입출력과 디렉터리 감시를 학습한다.",
    goals: ["Path와 Files 역할 구분", "Buffer와 FileChannel의 읽기·쓰기 흐름 설명", "WatchService와 WatchKey 이벤트 처리 판별"],
    audit: {
      lecture: "java.nio 패키지, Path, FileSystem/FileStore, Files, Buffer, FileChannel, WatchService",
      definitions: "Path, Paths, FileSystem, FileStore, Files, Buffer, ByteBuffer, FileChannel, Charset, WatchService, WatchKey",
      procedures: "Path 생성→Files로 속성/디렉터리 처리→ByteBuffer 준비→FileChannel read/write→WatchKey pollEvents/reset",
      examples: "Paths.get hosts 경로, Files.newDirectoryStream, FileChannel.open, Charset.encode, WatchService.take",
      exercisePoint: "Path는 내용 읽기/쓰기 담당 아님, FileChannelReader/Writer 없음, WatchKey pollEvents/reset",
      implementation: "Path/Files 역할 드릴, 버퍼 상태 흐름, WatchKey 이벤트 추적, 객관식 변형 퀴즈",
    },
    units: [
      {
        title: "Path, FileSystem, FileStore, Files",
        anchor: "10.1",
        summary: "Path는 파일 시스템 안의 파일이나 디렉터리 경로를 표현하고, Files는 파일 작업을 수행하는 유틸리티 메소드를 제공한다.",
        definition: "Path 인터페이스는 경로의 생성, 조작, 비교, 요소 조회 기능을 제공하지만 파일 내용 읽기·쓰기 자체의 중심 클래스는 아니다.",
        why: "Path와 Files를 구분해야 경로 표현과 실제 파일 작업을 혼동하지 않는다.",
        components: ["Path", "Paths.get", "getFileName", "getParent", "getNameCount", "FileSystem", "FileStore", "Files"],
        procedure: ["Paths.get으로 경로 생성", "Path 메소드로 요소 조회", "Files 메소드로 디렉터리·파일 작업", "FileStore로 저장소 정보 확인"],
        examples: ["`path.getFileName()`은 파일 이름", "`Files.newDirectoryStream(path)`는 디렉터리 항목 순회"],
        mistake: "Path가 파일 내용 읽기와 쓰기를 직접 제공한다고 하면 Files, Channel과 역할이 섞인다.",
        examFocus: "Path 인터페이스 설명 중 잘못된 보기 판별.",
      },
      {
        title: "Buffer의 상태와 메소드",
        anchor: "10.2",
        summary: "Buffer는 채널 입출력에서 데이터를 임시로 담는 공간이며 position, limit, capacity 같은 상태를 가진다.",
        definition: "Buffer는 데이터를 읽고 쓰기 위해 위치와 한계를 관리하는 NIO의 핵심 저장 구조.",
        why: "채널 기반 입출력은 스트림처럼 한 바이트씩만 보는 것이 아니라 버퍼에 담아 읽고 쓴다.",
        components: ["capacity", "position", "limit", "clear", "flip", "rewind", "ByteBuffer"],
        procedure: ["버퍼에 데이터 쓰기", "flip으로 읽기 모드 전환", "채널에 쓰거나 읽기", "clear로 다시 쓰기 준비"],
        examples: ["`ByteBuffer.allocate(1024)`", "`charset.encode(data[i])`"],
        mistake: "flip 없이 쓰기 모드 버퍼를 읽기 대상으로 쓰면 position/limit 상태가 맞지 않는다.",
        examFocus: "버퍼 상태 전환의 의미.",
      },
      {
        title: "FileChannel과 Charset",
        anchor: "10.3",
        summary: "FileChannel은 파일에 대한 채널 기반 읽기·쓰기를 제공하며 ByteBuffer와 함께 사용한다.",
        definition: "FileChannel은 java.nio.channels의 파일 채널 클래스이며 `open(path, options...)`으로 열 수 있다.",
        why: "FileChannel에는 FileChannelReader나 FileChannelWriter 같은 별도 클래스가 아니라 read/write와 Buffer가 사용된다.",
        components: ["FileChannel.open", "StandardOpenOption", "read", "write", "ByteBuffer", "Charset"],
        examples: ["`FileChannel.open(path, CREATE, WRITE)`", "`fileChannel.write(buffer)`"],
        mistake: "파일 입력용 FileChannelReader와 파일 출력용 FileChannelWriter가 있다고 보는 설명은 오답이다.",
        examFocus: "FileChannel 관련 존재하지 않는 클래스 판별.",
      },
      {
        title: "WatchService와 WatchKey",
        anchor: "10.4",
        summary: "WatchService는 디렉터리의 생성·수정·삭제 이벤트를 감시하고, 이벤트 발생 시 WatchKey를 반환한다.",
        definition: "WatchKey는 감시 대상에서 발생한 이벤트 묶음을 나타내며 `pollEvents()`로 이벤트를 얻고 `reset()`으로 다시 감시 대기 상태로 돌린다.",
        why: "take는 이벤트가 발생할 때까지 대기하고, 반환된 키는 처리 후 reset하지 않으면 지속 감시 흐름이 끊긴다.",
        components: ["WatchService", "register", "ENTRY_CREATE", "ENTRY_MODIFY", "ENTRY_DELETE", "take", "pollEvents", "reset"],
        procedure: ["WatchService 생성", "Path를 이벤트 종류와 함께 등록", "take로 WatchKey 수신", "pollEvents로 이벤트 처리", "reset으로 재등록 상태 유지"],
        examples: ["디렉터리에 파일이 생기면 ENTRY_CREATE 이벤트 수신"],
        mistake: "WatchKey를 이벤트 하나 자체로만 보면 한 키 안에 여러 이벤트가 들어갈 수 있음을 놓친다.",
        examFocus: "WatchKey의 pollEvents와 reset 역할 설명.",
      },
    ],
    codeSteps: [
      {
        label: "Path 조회",
        code: `Path path = Paths.get("C:\\\\windows\\\\system32\\\\drivers\\\\etc\\\\hosts");
System.out.println(path.getFileName());
System.out.println(path.getParent().getFileName());`,
        output: "hosts / etc",
        explanation: "Path는 경로 요소를 조회하고 조작하는 객체이다.",
      },
      {
        label: "FileChannel 쓰기",
        code: `FileChannel ch = FileChannel.open(path, CREATE, WRITE);
ByteBuffer buffer = charset.encode("Java");
ch.write(buffer);`,
        output: "버퍼 내용을 파일 채널에 기록",
        explanation: "문자열을 Charset으로 ByteBuffer에 인코딩한 뒤 채널에 쓴다.",
      },
      {
        label: "WatchKey 처리",
        code: `WatchKey key = watcher.take();
key.pollEvents();
key.reset();`,
        output: "이벤트 목록 처리 후 다시 감시",
        explanation: "reset을 호출해야 키가 다시 감시 대기 상태로 돌아간다.",
      },
    ],
    drill: {
      title: "NIO 역할 판별",
      subtitle: "Path, Files, Buffer, Channel, WatchKey의 책임을 분리한다.",
      cases: [
        { label: "Path", input: "경로 요소 조회", output: "적합", rule: "파일/디렉터리 경로를 표현한다." },
        { label: "Path", input: "파일 내용 직접 읽고 쓰기", output: "부적합", rule: "내용 작업은 Files나 Channel이 담당한다." },
        { label: "FileChannelReader", input: "파일 입력 클래스", output: "존재하지 않음", rule: "FileChannel은 Buffer와 read/write를 사용한다." },
        { label: "WatchKey.reset()", input: "이벤트 처리 후", output: "다시 감시 대기", rule: "키를 유효 상태로 되돌린다." },
      ],
    },
    quizzes: [
      quiz("Path 인터페이스 설명으로 잘못된 것은?", "파일 내용의 읽기와 쓰기 기능을 제공한다.", ["java.io.File 클래스를 대체할 수 있다.", "파일 또는 디렉터리의 경로를 표현한다.", "경로 생성, 조작/비교, 요소 조회 기능을 제공한다."], "Path", "근거: Path는 경로 표현 중심이고 내용 작업은 Files나 Channel이 담당한다.", "Path 역할 판별"),
      quiz("FileChannel 설명으로 틀린 것은?", "파일 입력을 위해 FileChannelReader, 파일 출력을 위해 FileChannelWriter를 사용한다.", ["java.io 파일 스트림을 대체하는 채널 기반 클래스이다.", "FileChannel.open(path)으로 객체를 생성할 수 있다.", "멀티 스레드 환경에서도 안전하게 사용할 수 있게 설계되었다."], "FileChannel", "근거: FileChannelReader/Writer라는 클래스 조합을 사용하지 않는다.", "존재하지 않는 클래스 판별"),
      quiz("WatchKey에서 감시 이벤트 목록을 얻는 메소드는?", "pollEvents()", ["getPath()", "readLine()", "executeQuery()"], "WatchKey", "근거: WatchKey는 pollEvents로 발생 이벤트 목록을 반환한다.", "WatchKey 메소드 매칭"),
      quiz("WatchKey 처리 후 다시 감시 대기 상태로 돌리는 메소드는?", "reset()", ["restart()", "rewatch()", "flush()"], "WatchKey", "근거: reset은 처리된 키를 다시 유효 상태로 만든다.", "WatchService 흐름"),
      quiz("Buffer에서 쓰기 후 읽기 모드로 전환할 때 대표적으로 쓰는 메소드는?", "flip()", ["throws()", "offer()", "prepareStatement()"], "Buffer", "근거: flip은 position과 limit를 읽기 준비 상태로 조정한다.", "Buffer 상태 전환"),
    ],
  },

  11: {
    id: 11,
    title: "컬렉션",
    sourceLabel: "강의 11강·JCF·HashSet·ArrayList·LinkedList·HashMap",
    intro:
      "Java Collections Framework의 Collection, List, Set, Queue, Map 구조를 잡고 HashSet, ArrayList, LinkedList, Iterator, HashMap/Hashtable의 사용 기준을 학습한다.",
    goals: ["JCF 인터페이스와 구현 클래스 연결", "List/Set/Queue/Map의 중복·순서·키값 특성 판별", "LinkedList 큐와 HashMap 사용 메소드 설명"],
    audit: {
      lecture: "JCF, Collection<E>, HashSet, ArrayList, Iterator, LinkedList, Queue, HashMap, Map<K,V>",
      definitions: "collection, JCF, Collection, List, Set, Queue, Map, HashSet, ArrayList, LinkedList, Iterator, HashMap, Hashtable",
      procedures: "컬렉션 선언→원소 추가→탐색→검색/수정/삭제→Map key/value 조회",
      examples: "Set<Integer> set = new HashSet<>(), ArrayList add/get/set/remove, Iterator, LinkedList offer/poll, HashMap put/get",
      exercisePoint: "ArrayList는 중복 허용, HashSet은 key/value 아님, Queue with LinkedList uses offer/poll",
      implementation: "JCF 분류 드릴, 큐 실행 흐름, 중복/순서/키값 판별 퀴즈",
    },
    units: [
      {
        title: "JCF 구조",
        anchor: "11.1",
        summary: "JCF는 여러 자료 묶음을 다루기 위한 인터페이스와 구현 클래스를 체계화한 프레임워크이다.",
        definition: "Collection 계열은 원소 묶음을, Map 계열은 key와 value의 쌍을 다룬다.",
        why: "문제는 클래스 이름보다 어떤 인터페이스 계열의 성질을 갖는지 묻는다.",
        components: ["Collection", "List", "Set", "Queue", "Map", "SortedMap"],
        examples: ["`Set<Integer> set = new HashSet<>();`", "`Map<String, Integer> map = new HashMap<>();`"],
        mistake: "Map을 Collection의 직접 하위 인터페이스처럼 외우면 key/value 구조를 놓친다.",
        examFocus: "JCF 인터페이스와 구현 클래스 매칭.",
      },
      {
        title: "HashSet과 Set",
        anchor: "11.2",
        summary: "HashSet은 Set 인터페이스 구현 클래스이며 원소 중복을 허용하지 않는다.",
        definition: "Set은 원소의 중복을 허용하지 않는 자료 묶음 인터페이스.",
        why: "중복 삽입, contains, remove 결과를 통해 Set의 동등성 판단을 확인한다.",
        components: ["add", "contains", "remove", "clear", "size", "equals/hashCode"],
        examples: ["이미 있는 `\"one\"`을 add하면 false", "`new String(\"one\")`도 내용이 같으면 중복"],
        mistake: "HashSet을 key/value 쌍 자료구조로 보면 Map과 혼동한 것이다.",
        examFocus: "Set의 중복 금지와 Map과의 차이.",
      },
      {
        title: "ArrayList, Iterator, LinkedList",
        anchor: "11.3",
        summary: "ArrayList는 순서가 있는 List로 중복을 허용하고, Iterator는 컬렉션 원소 탐색을 표준화한다.",
        definition: "List는 원소의 순서가 의미를 가지며 같은 자료를 중복 저장할 수 있는 인터페이스.",
        why: "ArrayList는 내부적으로 배열을 사용하지만 Set처럼 중복을 막지는 않는다.",
        components: ["ArrayList", "add(index)", "get", "set", "remove", "indexOf", "Iterator", "LinkedList"],
        examples: ["`list.add(1, \"one\")`로 위치 삽입", "향상된 for와 iterator로 탐색"],
        mistake: "ArrayList가 같은 자료를 중복 저장할 수 없다고 하면 Set의 성질을 잘못 옮긴 것이다.",
        examFocus: "ArrayList 특성 중 부적절한 설명 찾기.",
      },
      {
        title: "Queue와 Map",
        anchor: "11.4",
        summary: "LinkedList는 Queue로 사용할 수 있고, HashMap은 key/value 형태의 자료를 저장한다.",
        definition: "Queue는 먼저 들어간 자료를 먼저 꺼내는 자료구조로, `offer()`로 추가하고 `poll()`로 꺼내며 제거할 수 있다.",
        why: "큐와 Map은 메소드 이름과 저장 형태가 시험에서 직접 연결된다.",
        components: ["Queue", "offer", "poll", "Map", "HashMap", "Hashtable", "put", "get"],
        examples: ["`queue.offer(\"one\")` 후 `queue.poll()`", "`map.put(\"Kim\", 90)`"],
        mistake: "HashSet을 key/value 자료 묶음이라고 고르면 Map 계열을 놓친다.",
        examFocus: "Queue 메소드와 key/value 자료구조 판별.",
      },
    ],
    codeSteps: [
      {
        label: "List 선언",
        code: `List<String> list = new ArrayList<>();
list.add("one");
list.add("one");`,
        output: "중복 저장 가능",
        explanation: "ArrayList는 순서가 있는 List이므로 같은 값을 여러 번 저장할 수 있다.",
      },
      {
        label: "Set 선언",
        code: `Set<String> set = new HashSet<>();
System.out.println(set.add("one"));
System.out.println(set.add(new String("one")));`,
        output: "true / false",
        explanation: "HashSet은 동등한 원소의 중복 삽입을 허용하지 않는다.",
      },
      {
        label: "Queue 사용",
        code: `Queue<String> queue = new LinkedList<>();
queue.offer("one");
String s = queue.poll();`,
        output: "one",
        explanation: "offer는 뒤에 삽입하고 poll은 앞에서 꺼내며 제거한다.",
      },
    ],
    drill: {
      title: "컬렉션 선택 드릴",
      subtitle: "요구 조건에 맞는 JCF 타입을 고른다.",
      cases: [
        { label: "순서와 중복 필요", input: "학생 점수 목록", output: "ArrayList", rule: "List는 순서와 중복을 허용한다." },
        { label: "중복 제거", input: "태그 집합", output: "HashSet", rule: "Set은 중복 원소를 허용하지 않는다." },
        { label: "FIFO 처리", input: "대기열", output: "Queue/LinkedList", rule: "offer와 poll로 큐 동작을 구현한다." },
        { label: "이름→점수", input: "key/value", output: "HashMap", rule: "Map 계열은 key와 value 쌍을 저장한다." },
      ],
    },
    quizzes: [
      quiz("ArrayList 클래스 설명으로 적당하지 않은 것은?", "같은 자료를 중복으로 저장할 수 없다.", ["List 인터페이스를 구현한 클래스이다.", "여러 원소 저장을 위해 내부적으로 배열을 사용한다.", "원소의 순서가 의미를 가진다."], "ArrayList", "근거: List 계열인 ArrayList는 중복 저장을 허용한다.", "List/Set 특성 구분"),
      quiz("(key, value) 형태의 원소를 다루기 위한 인터페이스나 클래스가 아닌 것은?", "HashSet", ["HashMap", "Hashtable", "Map"], "Map", "근거: HashSet은 Set 계열이고 key/value 쌍은 Map 계열이다.", "Map 계열 판별"),
      quiz("LinkedList<E>를 Queue<E>로 사용할 때 자료 추가와 삭제 메소드는?", "offer(), poll()", ["put(), get()", "addKey(), removeValue()", "pushMap(), popMap()"], "Queue", "근거: Queue의 삽입은 offer, 꺼내며 삭제는 poll을 사용한다.", "Queue 메소드 매칭"),
      quiz("Iterator의 주된 역할은?", "컬렉션 원소를 순서대로 탐색한다.", ["SQL 질의를 실행한다.", "파일 경로를 감시한다.", "모듈 의존성을 선언한다."], "Iterator", "근거: Iterator는 hasNext와 next로 컬렉션 원소 탐색을 표준화한다.", "Iterator 역할"),
      quiz("HashSet에서 이미 존재하는 동등한 원소를 add하면 일반적으로?", "false가 반환되고 중복 저장되지 않는다.", ["항상 두 개가 저장된다.", "Map으로 변환된다.", "JVM이 종료된다."], "HashSet", "근거: Set은 중복을 허용하지 않는다.", "Set 중복 판별"),
    ],
  },

  12: {
    id: 12,
    title: "컬렉션과 스트림",
    sourceLabel: "강의 12강·forEach·스트림·스트림 파이프라인·중간/종료 연산",
    intro:
      "외부 반복과 내부 반복의 차이에서 출발해 숫자·배열·파일·컬렉션 스트림 생성, 순차/병렬 스트림, 파이프라인, 중간연산과 종료연산을 학습한다.",
    goals: ["forEach와 내부 반복 설명", "다양한 소스에서 스트림 생성", "중간연산과 종료연산 차이 및 파이프라인 흐름 판별"],
    audit: {
      lecture: "외부 반복, 내부 반복과 forEach, 스트림 정의와 특성, 숫자/배열/파일/컬렉션 스트림, 일반/병렬 스트림, 스트림 파이프라인, 중간연산, 종료연산, 메소드 체이닝, 필터링",
      definitions: "forEach, stream, pipeline, intermediate operation, terminal operation, lazy evaluation, filter, map, sorted, distinct, count, collect",
      procedures: "스트림 생성→중간연산 체인→종료연산 실행→결과 또는 부수효과 생성",
      examples: "Arrays.stream(numbers), Files.lines(path), set.parallelStream, map/filter/count, 길이 6 이상 단어 filter",
      exercisePoint: "배열 스트림은 Arrays.stream, 길이 조건은 filter, 중간연산과 종료연산 차이",
      implementation: "스트림 파이프라인 추적, 연산 분류 드릴, 객관식 변형 퀴즈",
    },
    units: [
      {
        title: "외부 반복과 forEach",
        anchor: "12.1",
        summary: "외부 반복은 반복 제어를 코드가 직접 담당하고, 내부 반복은 컬렉션이나 스트림 API가 반복을 수행한다.",
        definition: "`forEach`는 각 원소에 대해 전달된 동작을 수행하는 내부 반복 메소드.",
        why: "람다식과 함께 사용하면 반복 구조보다 수행할 작업에 집중할 수 있다.",
        components: ["외부 반복", "Iterator", "향상된 for문", "내부 반복", "forEach", "Consumer"],
        examples: ["`names.forEach(item -> System.out.println(item));`", "`list.forEach(System.out::println)`"],
        mistake: "forEach가 항상 원본 컬렉션을 변환해 새 컬렉션을 반환한다고 보면 종료연산/부수효과를 혼동한 것이다.",
        examFocus: "반복 주체와 람다식 사용 방식.",
      },
      {
        title: "스트림 생성과 특성",
        anchor: "12.2",
        summary: "스트림은 데이터 소스의 원소를 처리 연산의 흐름으로 다루는 API이며 원본 데이터를 직접 저장하지 않는다.",
        definition: "스트림은 배열, 파일, 컬렉션, 숫자 범위 같은 데이터 소스에서 생성되어 선언형 연산으로 데이터를 처리한다.",
        why: "배열은 `Arrays.stream`, 컬렉션은 `stream`, 파일은 `Files.lines`, 숫자는 IntStream 범위 메소드를 사용한다.",
        components: ["IntStream", "Arrays.stream", "Files.lines", "collection.stream", "parallelStream", "순차/병렬"],
        procedure: ["데이터 소스 확인", "맞는 생성 메소드 선택", "순차 또는 병렬 처리 선택", "파이프라인 구성"],
        examples: ["`Arrays.stream(numbers)`", "`IntStream.rangeClosed(1, 100).sum()`"],
        mistake: "배열에 `numbers.stream()`을 호출하면 컬렉션과 배열 생성 방법을 혼동한 것이다.",
        examFocus: "스트림 생성 메소드 매칭.",
      },
      {
        title: "스트림 파이프라인",
        anchor: "12.3",
        summary: "파이프라인은 원본 스트림에 중간연산을 연결하고 종료연산으로 실제 처리를 끝내는 구조이다.",
        definition: "중간연산은 스트림을 받아 다시 스트림을 반환하고 지연 실행되며, 종료연산은 결과를 만들고 파이프라인을 끝낸다.",
        why: "중간연산만 나열하면 실제 처리가 일어나지 않고, 종료연산이 있어야 계산이나 출력이 수행된다.",
        components: ["원본 스트림", "filter", "map", "sorted", "distinct", "peek", "count", "forEach", "collect"],
        examples: ["`map(String::toUpperCase).filter(...).count()`", "`books.stream().mapToInt(...).average()`"],
        mistake: "filter나 map을 종료연산으로 분류하면 스트림 반환 여부를 놓친 것이다.",
        examFocus: "중간연산과 종료연산 차이 설명.",
      },
      {
        title: "필터링과 변환",
        anchor: "12.4",
        summary: "filter는 조건에 맞는 원소만 통과시키고, map은 원소를 다른 값으로 변환한다.",
        definition: "filter는 Predicate 결과가 true인 원소만 남기는 중간연산.",
        why: "길이가 6 이상인 단어만 대문자로 바꾸려면 먼저 filter로 길이 조건을 적용한다.",
        components: ["Predicate", "filter", "map", "sorted", "distinct", "method chaining"],
        examples: ["`filter(word -> word.length() >= 6)`", "`map(String::toUpperCase)`"],
        mistake: "조건 선별에 map을 고르면 변환과 필터링 역할을 혼동한 것이다.",
        examFocus: "필터링 메소드 선택과 체이닝 순서.",
      },
    ],
    codeSteps: [
      {
        label: "배열 스트림",
        code: `int[] numbers = { 1, 2, 3 };
IntStream stream = Arrays.stream(numbers);`,
        output: "int 배열에서 IntStream 생성",
        explanation: "배열은 Arrays.stream으로 스트림을 만든다.",
      },
      {
        label: "중간연산",
        code: `words.stream()
    .filter(word -> word.length() >= 6)
    .map(String::toUpperCase)
    .sorted()`,
        output: "아직 실행 대기",
        explanation: "filter, map, sorted는 모두 다시 스트림을 반환하는 중간연산이다.",
      },
      {
        label: "종료연산",
        code: `.forEach(System.out::println);`,
        output: "조건에 맞는 단어 출력",
        explanation: "forEach가 호출되면 파이프라인이 실제로 실행되고 종료된다.",
      },
    ],
    drill: {
      title: "스트림 연산 분류",
      subtitle: "생성, 중간연산, 종료연산을 구분한다.",
      cases: [
        { label: "Arrays.stream(numbers)", input: "배열", output: "스트림 생성", rule: "배열에서 스트림을 만드는 표준 메소드이다." },
        { label: "filter", input: "길이 >= 6", output: "중간연산", rule: "조건에 맞는 원소만 통과시킨다." },
        { label: "map", input: "대문자 변환", output: "중간연산", rule: "원소를 다른 값으로 바꾼다." },
        { label: "count", input: "개수 계산", output: "종료연산", rule: "결과값을 만들고 스트림을 끝낸다." },
      ],
    },
    quizzes: [
      quiz("주어진 배열을 스트림으로 만들 때 알맞은 내용은?", "Arrays.stream(numbers)", ["IntStream.range(numbers)", "numbers.stream()", "numbers.getStream()"], "스트림 생성", "근거: 배열은 Arrays.stream을 사용해 스트림을 생성한다.", "배열 스트림 생성"),
      quiz("길이가 6 이상인 단어만 통과시키려면 사용할 메소드는?", "filter", ["peek", "map", "match"], "필터링", "근거: filter는 조건을 만족하는 원소만 남기는 중간연산이다.", "중간연산 역할 판별"),
      quiz("중간연산과 종료연산의 차이로 알맞은 것은?", "중간연산은 스트림을 반환하고 종료연산은 결과를 만들며 파이프라인을 끝낸다.", ["중간연산은 항상 파일을 삭제한다.", "종료연산은 항상 스트림을 반환한다.", "둘 다 실행 시점과 반환값이 같다."], "파이프라인", "근거: 강의는 중간연산의 지연 실행과 종료연산의 실행 완료를 구분한다.", "연산 종류 설명"),
      quiz("컬렉션에서 스트림을 만들 때 일반적으로 사용하는 메소드는?", "stream()", ["getClass()", "reset()", "executeQuery()"], "스트림 생성", "근거: Collection 계열은 stream 또는 parallelStream을 제공한다.", "컬렉션 스트림 생성"),
      quiz("병렬 스트림의 특징은?", "여러 스레드에서 원소 처리가 나뉠 수 있어 출력 순서가 달라질 수 있다.", ["항상 단일 스레드로만 실행된다.", "반드시 원본 컬렉션을 삭제한다.", "배열에서는 사용할 수 없다."], "병렬 스트림", "근거: parallelStream 예제는 worker 스레드와 main 스레드가 함께 처리하는 출력을 보여 준다.", "순차/병렬 차이"),
    ],
  },

  13: {
    id: 13,
    title: "멀티 스레드 프로그래밍",
    sourceLabel: "강의 13강·프로세스와 스레드·스레드 생성·제어·동기화",
    intro:
      "프로세스와 스레드의 차이, Thread 상속과 Runnable 구현을 통한 생성, start/run 실행 흐름, sleep/yield/join/interrupt/wait/notify 제어와 synchronized 동기화를 학습한다.",
    goals: ["프로세스와 스레드, 멀티 스레드 실행 특성 설명", "Thread/Runnable 생성 방식과 상태 제어 메소드 판별", "공유 객체 동기화와 synchronized 의미 설명"],
    audit: {
      lecture: "프로세스와 스레드, 멀티 스레드, Thread 클래스, Runnable 인터페이스, 스레드 실행, 스레드 상태와 상태 전이, sleep/yield/join/interrupt, wait/notify, 스레드 동기화",
      definitions: "process, thread, multi-thread, Thread, Runnable, start, run, sleep, yield, join, interrupt, wait, notify, synchronized",
      procedures: "Thread 객체 생성→start 호출→run 실행→상태 전이→join/interrupt 등 제어→공유 객체 synchronized 보호",
      examples: "Thread 상속, Runnable 구현, yield 출력, join 후 main thread 출력, interrupt 순환, synchronized 메소드",
      exercisePoint: "join은 this 스레드 종료까지 현재 스레드 대기, 동기화는 한 순간 한 스레드만 공유 객체 접근, synchronized 키워드",
      implementation: "스레드 실행 순서 추적, 제어 메소드 드릴, 동기화 퀴즈",
    },
    units: [
      {
        title: "프로세스와 스레드",
        anchor: "13.1",
        summary: "프로세스는 실행 중인 프로그램이고, 스레드는 프로세스 안에서 실행되는 작업 흐름 단위이다.",
        definition: "멀티 스레드는 하나의 프로세스 안에서 여러 스레드가 동시에 또는 번갈아 실행되는 구조.",
        why: "여러 스레드는 실행 순서가 매번 같다고 보장되지 않으므로 출력 예측에서는 비결정성을 고려해야 한다.",
        components: ["프로세스", "스레드", "main 스레드", "스케줄링", "공유 메모리"],
        examples: ["main, thd0, thd1 출력 순서가 섞임", "하나의 프로그램에서 입력 처리와 계산을 분리"],
        mistake: "멀티 스레드 출력 순서를 항상 코드 작성 순서와 같다고 보면 오답이 된다.",
        examFocus: "프로세스/스레드 차이와 실행 순서 비결정성.",
      },
      {
        title: "Thread 클래스와 Runnable 인터페이스",
        anchor: "13.2",
        summary: "스레드는 Thread를 상속하거나 Runnable을 구현한 객체를 Thread에 전달해 만들 수 있다.",
        definition: "`start()`는 새 스레드 실행을 요청하고, JVM이 해당 스레드에서 `run()`을 호출하게 한다.",
        why: "`run()`을 직접 호출하면 새 스레드가 아니라 현재 스레드의 일반 메소드 호출이 된다.",
        components: ["Thread 상속", "Runnable 구현", "run", "start", "currentThread", "getName"],
        procedure: ["Thread 객체 생성", "start 호출", "스케줄러가 run 실행", "작업 종료 후 terminated 상태"],
        examples: ["`new MyThread().start()`", "`new Thread(new MyThread(), \"thd0\").start()`"],
        mistake: "start와 run을 같은 실행 방식으로 보면 멀티 스레드 생성 여부를 구분하지 못한다.",
        examFocus: "스레드 생성 방식과 start/run 차이.",
      },
      {
        title: "스레드 상태 제어",
        anchor: "13.3",
        summary: "sleep, yield, join, interrupt, wait, notify는 스레드의 실행 상태와 대기 상태를 조절한다.",
        definition: "`join()`은 대상 스레드가 종료될 때까지 현재 스레드가 기다리게 하는 메소드.",
        why: "메소드 이름이 비슷해 보여도 기다리는 대상, 깨우는 대상, 인터럽트 처리 방식이 다르다.",
        components: ["sleep", "yield", "join", "interrupt", "wait", "notify", "notifyAll"],
        examples: ["`my_thread1.join();` 후 main thread 출력", "`Thread.yield()`로 실행 기회 양보"],
        mistake: "notify를 현재 스레드를 일정 시간 중지시키는 메소드로 보면 sleep과 혼동한 것이다.",
        examFocus: "상태 제어 메소드 설명 중 올바른 문장 판별.",
      },
      {
        title: "스레드 동기화",
        anchor: "13.4",
        summary: "여러 스레드가 공유 객체를 동시에 사용할 때 임계 영역을 보호해 데이터 불일치를 막아야 한다.",
        definition: "스레드 동기화는 한순간에 한 스레드만 공유 객체나 임계 영역에 접근할 수 있게 하는 것.",
        why: "동시에 접근할 수 있게 하는 것이 아니라 동시에 접근하지 못하도록 순서를 제어하는 것이 핵심이다.",
        components: ["공유 객체", "임계 영역", "synchronized", "모니터 락", "상호 배제"],
        procedure: ["공유 데이터 식별", "임계 영역 지정", "`synchronized` 적용", "락 획득 스레드만 실행", "종료 시 락 해제"],
        examples: ["`public synchronized void add()`", "`synchronized (shared) { ... }`"],
        mistake: "동기화를 여러 스레드가 동시에 공유 객체에 접근하게 하는 기능으로 설명하면 정반대이다.",
        examFocus: "동기화 의미와 synchronized 키워드.",
      },
    ],
    codeSteps: [
      {
        label: "Runnable 생성",
        code: `Thread t1 = new Thread(new MyThread(), "thd1");
t1.start();`,
        output: "새 스레드에서 run 실행",
        explanation: "Runnable 구현 객체를 Thread에 전달하고 start로 실행을 시작한다.",
      },
      {
        label: "join 대기",
        code: `my_thread1.start();
my_thread1.join();
System.out.println("main thread");`,
        output: "스레드 종료 후 main thread",
        explanation: "join은 대상 스레드가 끝날 때까지 현재 스레드를 기다리게 한다.",
      },
      {
        label: "동기화",
        code: `public synchronized void deposit(int amount) {
    balance += amount;
}`,
        output: "한 번에 한 스레드만 실행",
        explanation: "synchronized 메소드는 같은 객체에 대한 동시 접근을 제한한다.",
      },
    ],
    drill: {
      title: "스레드 메소드 판별",
      subtitle: "각 메소드가 어떤 상태 변화를 만드는지 구분한다.",
      cases: [
        { label: "start()", input: "스레드 시작", output: "새 실행 흐름 요청", rule: "JVM이 새 스레드에서 run을 호출한다." },
        { label: "join()", input: "대상 종료 대기", output: "현재 스레드 대기", rule: "this 스레드가 끝날 때까지 기다린다." },
        { label: "wait()", input: "모니터 안", output: "락을 놓고 대기", rule: "Object 메소드이며 notify/notifyAll로 깨어날 수 있다." },
        { label: "synchronized", input: "공유 객체 보호", output: "상호 배제", rule: "한 순간 한 스레드만 임계 영역에 들어간다." },
      ],
    },
    quizzes: [
      quiz("스레드 동기화 관련 설명 중 올바른 것은?", "메소드 join()은 this 스레드가 종료될 때까지 현재 스레드가 기다린다.", ["interrupt()는 현재 스레드가 인터럽트를 받은 적이 있는지 검사한다.", "notify()는 현재 실행 중인 스레드를 정해진 시간 동안 중지시킨다.", "wait()는 대기 상태의 스레드들 가운데 하나를 기다리게 한다."], "스레드 제어", "근거: join은 대상 스레드 종료까지 현재 스레드를 대기시킨다.", "join 의미 판별"),
      quiz("스레드 동기화의 의미로 가장 알맞은 것은?", "한순간에 한 스레드만 공유 객체에 접근할 수 있게 하는 것", ["메인 스레드가 가장 마지막에 종료되는 것을 보장하는 것", "공유 객체에 여러 스레드가 동시에 접근할 수 있게 하는 것", "여러 스레드가 반드시 생성 순서대로 수행되는 것"], "동기화", "근거: 동기화는 공유 객체 접근의 상호 배제를 보장하는 개념이다.", "동기화 정의"),
      quiz("공유 객체 메소드에 한 번에 하나의 스레드만 접근하도록 하는 Java 키워드는?", "synchronized", ["volatileOnly", "threadsafe", "exclusive"], "동기화 키워드", "근거: synchronized는 메소드나 블록의 임계 영역 접근을 제어한다.", "synchronized 키워드"),
      quiz("Runnable 방식으로 스레드를 만들 때 구현해야 하는 메소드는?", "run()", ["main()", "get()", "poll()"], "Runnable", "근거: Runnable은 run 메소드를 구현하고 Thread가 이를 실행한다.", "Runnable 구조"),
      quiz("`run()`을 직접 호출하는 것과 `start()` 호출의 차이는?", "start는 새 스레드 실행을 요청하고 run 직접 호출은 일반 메소드 호출이다.", ["둘은 완전히 같은 바이트코드를 만든다.", "run은 컴파일 명령이다.", "start는 예외 클래스이다."], "스레드 실행", "근거: 새 실행 흐름은 start 호출로 시작된다.", "start/run 차이"),
    ],
  },

  14: {
    id: 14,
    title: "JDBC 프로그래밍",
    sourceLabel: "강의 14강·JDBC와 MariaDB·서버 연결·연동 프로그래밍·메타데이터/PreparedStatement",
    intro:
      "데이터베이스와 관계형 DBMS 기본 개념, MariaDB 연결, JDBC 드라이버와 URL, Connection/Statement/ResultSet 흐름, PreparedStatement와 메타데이터 사용을 학습한다.",
    goals: ["JDBC 핵심 클래스와 인터페이스 구분", "SELECT와 INSERT/UPDATE/DELETE 실행 흐름 설명", "PreparedStatement와 ResultSet 역할 판별"],
    audit: {
      lecture: "데이터베이스 기초, 관계형 데이터베이스, DBMS 설치와 MariaDB, JDBC, MariaDB JDBC 드라이버, 연결 프로그램, 연동 프로그래밍 순서, Statement, ResultSet, executeQuery/executeUpdate/execute, DatabaseMetaData, PreparedStatement, ResultSetMetaData",
      definitions: "database, DBMS, RDBMS, JDBC, DriverManager, Connection, Statement, ResultSet, PreparedStatement, DatabaseMetaData, ResultSetMetaData",
      procedures: "드라이버 준비→URL/계정 설정→Connection 획득→Statement/PreparedStatement 생성→SQL 실행→ResultSet 처리→자원 해제",
      examples: "jdbc:mariadb URL, DriverManager.getConnection, stmt.executeQuery, ResultSet.next/getInt/getString, executeUpdate, PreparedStatement 매개변수",
      exercisePoint: "Runnable은 JDBC 아님, PreparedStatement는 Statement의 자식 인터페이스, executeQuery 결과는 ResultSet",
      implementation: "JDBC 객체 흐름 추적, SQL 실행 메소드 드릴, 객관식 변형 퀴즈",
    },
    units: [
      {
        title: "데이터베이스와 MariaDB",
        anchor: "14.1",
        summary: "데이터베이스는 관련 데이터를 체계적으로 저장하고, DBMS는 이를 관리하는 소프트웨어이다.",
        definition: "관계형 데이터베이스는 데이터를 테이블 형태로 표현하고 SQL로 질의·수정한다.",
        why: "JDBC 코드는 Java 객체와 SQL 기반 관계형 데이터베이스 사이의 연결 흐름을 다룬다.",
        components: ["데이터베이스", "DBMS", "관계형 데이터베이스", "테이블", "레코드", "SQL", "MariaDB"],
        examples: ["world 데이터베이스의 city 테이블", "SELECT, INSERT, UPDATE, DELETE"],
        mistake: "JDBC를 DBMS 자체로 보면 Java와 DBMS 사이의 표준 API라는 역할을 놓친다.",
        examFocus: "데이터베이스 기본 용어와 JDBC 위치.",
      },
      {
        title: "JDBC 연결 흐름",
        anchor: "14.2",
        summary: "JDBC는 Java 프로그램에서 데이터베이스에 접속하고 SQL을 실행하기 위한 표준 API이다.",
        definition: "DriverManager는 JDBC URL, 사용자, 비밀번호를 받아 데이터베이스 Connection을 생성한다.",
        why: "연결 문자열, 드라이버, Connection, Statement 생성 순서를 알아야 코드 빈칸을 채울 수 있다.",
        components: ["JDBC 드라이버", "JDBC URL", "DriverManager", "Connection", "try-with-resources"],
        procedure: ["드라이버 준비", "URL/user/password 설정", "getConnection 호출", "Statement 생성", "SQL 실행"],
        examples: ["`jdbc:mariadb://localhost:3306/world`", "`DriverManager.getConnection(url, user, pass)`"],
        mistake: "Runnable은 스레드용 인터페이스이며 JDBC 연결 API가 아니다.",
        examFocus: "JDBC 관련 클래스/인터페이스와 무관한 보기 판별.",
      },
      {
        title: "Statement와 ResultSet",
        anchor: "14.3",
        summary: "Statement는 SQL 문장을 실행하고, SELECT 결과는 ResultSet으로 받아 행 단위로 처리한다.",
        definition: "ResultSet은 SELECT 질의 결과를 테이블 형태로 나타내는 객체.",
        why: "`executeQuery()`는 결과 집합을 반환하고, `executeUpdate()`는 변경된 행 수를 반환한다.",
        components: ["Statement", "executeQuery", "executeUpdate", "execute", "getResultSet", "getUpdateCount", "ResultSet.next", "getInt/getString"],
        examples: ["`ResultSet rs = stmt.executeQuery(\"SELECT ...\")`", "`while (rs.next())`로 행 순회"],
        mistake: "executeQuery의 결과 타입을 Statement나 Connection으로 고르면 SQL 실행 결과 구조를 혼동한 것이다.",
        examFocus: "SQL 실행 메소드와 반환값 매칭.",
      },
      {
        title: "PreparedStatement와 메타데이터",
        anchor: "14.4",
        summary: "PreparedStatement는 매개변수가 있는 SQL을 미리 준비해 여러 번 실행하기에 적합하고, 메타데이터 객체는 DB/결과 구조 정보를 제공한다.",
        definition: "PreparedStatement는 Statement의 하위 인터페이스로, SQL 구문을 객체 생성 시 지정하고 매개변수를 설정할 수 있다.",
        why: "PreparedStatement가 Statement의 부모라는 선택지는 상속 방향을 반대로 설명한 것이다.",
        components: ["PreparedStatement", "setInt/setString", "DatabaseMetaData", "ResultSetMetaData", "SQL 매개변수", "반복 실행"],
        examples: ["`conn.prepareStatement(\"select * from city where id=?\")`", "`conn.getMetaData().getDriverName()`"],
        mistake: "PreparedStatement를 Statement의 부모로 보면 JDBC 인터페이스 계층을 반대로 이해한 것이다.",
        examFocus: "PreparedStatement 설명의 오답 기준.",
      },
    ],
    codeSteps: [
      {
        label: "연결",
        code: `String url = "jdbc:mariadb://localhost:3306/world";
Connection conn = DriverManager.getConnection(url, user, pass);`,
        output: "DB 연결 객체",
        explanation: "DriverManager가 URL과 계정 정보로 Connection을 만든다.",
      },
      {
        label: "SELECT 실행",
        code: `Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery("SELECT * FROM city");`,
        output: "ResultSet",
        explanation: "executeQuery는 SELECT 결과 테이블을 ResultSet으로 반환한다.",
      },
      {
        label: "행 처리",
        code: `while (rs.next()) {
    System.out.println(rs.getString("Name"));
}`,
        output: "각 행의 Name 출력",
        explanation: "ResultSet 커서를 다음 행으로 옮기며 컬럼 값을 읽는다.",
      },
    ],
    drill: {
      title: "JDBC 객체 흐름 판별",
      subtitle: "연결, 실행, 결과 처리 객체를 순서대로 맞춘다.",
      cases: [
        { label: "DriverManager", input: "URL로 접속", output: "Connection 생성", rule: "getConnection으로 연결 객체를 반환한다." },
        { label: "Statement", input: "SQL 실행", output: "executeQuery/executeUpdate", rule: "SQL 문장을 DBMS에 보낸다." },
        { label: "ResultSet", input: "SELECT 결과", output: "행과 컬럼 접근", rule: "next와 getXXX로 결과를 읽는다." },
        { label: "PreparedStatement", input: "매개변수 SQL 반복", output: "효율적", rule: "미리 준비된 SQL에 값을 바인딩한다." },
      ],
    },
    quizzes: [
      quiz("JDBC 프로그래밍에 사용되는 클래스나 인터페이스가 아닌 것은?", "Runnable", ["Connection", "DriverManager", "Statement"], "JDBC API", "근거: Runnable은 스레드 실행을 위한 인터페이스이고 JDBC 구성요소가 아니다.", "JDBC 관련/무관 판별"),
      quiz("PreparedStatement 설명으로 잘못된 것은?", "PreparedStatement는 Statement의 부모 인터페이스이다.", ["객체를 생성할 때 SQL 구문을 지정해야 한다.", "같은 SQL 구문을 여러 번 실행할 때 효율적이다.", "매개 변수를 가지는 SQL 구문을 저장할 수 있다."], "PreparedStatement", "근거: PreparedStatement는 Statement의 하위 인터페이스이다.", "상속 방향 판별"),
      quiz("Statement의 executeQuery()로 SELECT 구문을 실행하면 반환되는 타입은?", "ResultSet", ["Runnable", "WatchKey", "Supplier"], "ResultSet", "근거: executeQuery는 SELECT 결과 테이블을 ResultSet 객체로 반환한다.", "SQL 실행 반환 타입"),
      quiz("INSERT, UPDATE, DELETE처럼 변경 행 수를 얻는 데 주로 쓰는 메소드는?", "executeUpdate()", ["pollEvents()", "getClass()", "filter()"], "Statement", "근거: executeUpdate는 갱신 SQL 실행 후 영향을 받은 행 수를 반환한다.", "SQL 실행 메소드 구분"),
      quiz("try-with-resources를 JDBC 코드에서 쓰는 이유는?", "Connection, Statement, ResultSet 같은 자원을 자동으로 닫기 위해", ["패키지 이름을 자동 생성하기 위해", "스레드를 강제로 병렬화하기 위해", "모듈 의존성을 숨기기 위해"], "자원 관리", "근거: JDBC 객체는 외부 자원을 사용하므로 사용 후 닫아야 한다.", "자원 해제 흐름"),
    ],
  },

  15: {
    id: 15,
    title: "라이브러리와 모듈",
    sourceLabel: "강의 15강·라이브러리·모듈·Java 표준 모듈",
    intro:
      "JAR 라이브러리 제작과 사용, classpath 설정, Javadoc, Java 9 이후 모듈 시스템의 module-info.java, requires/exports, transitive 의존성과 표준 모듈 사용을 학습한다.",
    goals: ["라이브러리와 classpath 사용 흐름 설명", "module-info.java의 requires와 exports 판별", "java.base와 java.sql 같은 표준 모듈 의존성 구분"],
    audit: {
      lecture: "라이브러리, 라이브러리 만들기와 사용하기, 모듈, 모듈 정의, 모듈 제공 프로젝트, 모듈 사용 프로젝트, 모듈 의존 관계, Java 표준 모듈",
      definitions: "library, JAR, classpath, Javadoc, module, module-info.java, requires, exports, requires transitive, module path, java.base, java.sql",
      procedures: "클래스 작성→JAR 생성→classpath 추가→module-info 작성→exports 제공→requires 사용→표준 모듈 선언",
      examples: ".jar 배포 라이브러리, `module my_mod_a { requires my_mod_b; }`, `exports package_a;`, `requires java.sql;`",
      exercisePoint: ".jar 라이브러리는 Classpath, java.base는 requires 생략 가능, java.sql 사용 시 `requires java.sql;`",
      implementation: "classpath/modulepath 드릴, module-info 코드 추적, 객관식 변형 퀴즈",
    },
    units: [
      {
        title: "라이브러리와 JAR",
        anchor: "15.1",
        summary: "라이브러리는 재사용 가능한 클래스와 자원을 묶은 것이며, Java에서는 흔히 JAR 파일로 배포된다.",
        definition: "JAR는 Java Archive 형식으로 여러 class 파일과 자원을 하나의 파일로 묶어 배포하는 형식.",
        why: "외부 JAR 라이브러리를 전통적인 방식으로 사용하려면 classpath에 포함해야 한다.",
        components: ["라이브러리", "JAR", "class 파일", "classpath", "Javadoc", "재사용"],
        procedure: ["클래스 컴파일", "JAR 생성", "classpath에 JAR 추가", "import 후 사용", "문서가 필요하면 Javadoc 참고"],
        examples: ["`java -classpath lib/a.jar Main`", "IDE의 Build Path에 JAR 추가"],
        mistake: ".jar 파일을 Jarpath라는 환경 변수에 넣는다고 보면 Java의 classpath 개념과 다르다.",
        examFocus: "JAR 라이브러리 사용 위치와 classpath.",
      },
      {
        title: "모듈과 module-info.java",
        anchor: "15.2",
        summary: "모듈은 관련 패키지를 묶고 외부에 공개할 패키지와 필요한 다른 모듈을 명시하는 단위이다.",
        definition: "`module-info.java`는 모듈 이름, 의존 모듈, 외부 공개 패키지를 선언하는 모듈 기술자 파일.",
        why: "classpath가 클래스 검색 경로 중심이라면 모듈은 의존성과 공개 범위를 명시적으로 드러낸다.",
        components: ["module", "module-info.java", "requires", "exports", "module path", "패키지 공개"],
        procedure: ["모듈 이름 선언", "필요 모듈을 requires로 선언", "제공 패키지를 exports로 공개", "모듈 경로로 컴파일/실행"],
        examples: ["`module my_mod_a { requires my_mod_b; }`", "`exports package_a;`"],
        mistake: "requires는 패키지 이름이 아니라 모듈 이름을 대상으로 선언한다.",
        examFocus: "module-info.java 선언 위치와 키워드 의미.",
      },
      {
        title: "모듈 의존 관계",
        anchor: "15.3",
        summary: "모듈은 requires로 직접 의존성을 선언하고, requires transitive로 의존성을 사용하는 쪽에 전파할 수 있다.",
        definition: "`requires transitive B;`는 현재 모듈을 필요로 하는 다른 모듈도 B를 읽을 수 있게 하는 의존성 전파 선언.",
        why: "라이브러리를 모듈로 제공할 때 어떤 패키지를 공개하고 어떤 의존성을 사용자에게 드러낼지 설계해야 한다.",
        components: ["requires", "requires transitive", "exports", "readability", "모듈 그래프"],
        examples: ["`module A { requires B; }`", "API 타입에 B의 공개 타입이 노출되면 transitive 필요 가능"],
        mistake: "exports와 requires를 모두 패키지 공개 명령으로 보면 의존성과 공개 범위를 혼동한다.",
        examFocus: "의존 선언과 패키지 공개 선언의 차이.",
      },
      {
        title: "Java 표준 모듈",
        anchor: "15.4",
        summary: "Java 표준 라이브러리는 여러 표준 모듈로 나뉘며 java.base는 모든 모듈이 기본으로 읽는다.",
        definition: "java.base는 requires 선언 없이도 사용할 수 있는 기본 표준 모듈.",
        why: "java.lang 같은 기본 API는 java.base에 포함되지만, JDBC의 java.sql을 쓰려면 `requires java.sql;`을 명시해야 한다.",
        components: ["java.base", "java.sql", "java.desktop", "java.logging", "requires java.sql"],
        examples: ["`module MyApp { requires java.sql; }`", "Object, String, System은 java.base 계열 기본 API"],
        mistake: "java.lang을 모듈 이름으로 고르면 패키지 이름과 모듈 이름을 혼동한 것이다.",
        examFocus: "requires 생략 가능 모듈과 표준 모듈 선언.",
      },
    ],
    codeSteps: [
      {
        label: "JAR 사용",
        code: `javac -classpath lib/util.jar Main.java
java -classpath lib/util.jar:. Main`,
        output: "classpath에서 라이브러리 클래스 탐색",
        explanation: "전통적인 JAR 라이브러리 사용은 classpath에 JAR 파일을 넣는다.",
      },
      {
        label: "모듈 제공",
        code: `module my_mod_b {
    exports package_b;
}`,
        output: "package_b 공개",
        explanation: "exports로 외부 모듈에서 사용할 패키지를 공개한다.",
      },
      {
        label: "표준 모듈 사용",
        code: `module MyProject {
    requires java.sql;
}`,
        output: "java.sql 의존성 선언",
        explanation: "JDBC의 java.sql 패키지를 사용하려면 java.sql 모듈을 requires로 선언한다.",
      },
    ],
    drill: {
      title: "classpath·module-info 판별",
      subtitle: "라이브러리 사용 방식과 모듈 선언 키워드를 구분한다.",
      cases: [
        { label: ".jar 라이브러리", input: "전통적 사용", output: "Classpath", rule: "클래스 검색 경로에 JAR을 추가한다." },
        { label: "exports package_a;", input: "모듈 제공", output: "패키지 공개", rule: "외부 모듈에 패키지를 공개한다." },
        { label: "requires java.sql;", input: "JDBC 사용", output: "모듈 의존성", rule: "java.sql 표준 모듈을 읽겠다고 선언한다." },
        { label: "java.base", input: "표준 모듈", output: "requires 생략 가능", rule: "모든 모듈이 기본으로 읽는 표준 모듈이다." },
      ],
    },
    quizzes: [
      quiz(".jar 파일 형식으로 배포된 라이브러리를 사용하려면 무엇에 추가하는가?", "Classpath", ["Modulepath", "Javadoc", "Jarpath"], "라이브러리", "근거: 전통적인 JAR 라이브러리는 classpath에 포함해 클래스 검색 대상이 되게 한다.", "JAR 사용 위치"),
      quiz("requires 키워드 없이도 사용 가능한 Java 표준 모듈은?", "java.base", ["jdk.base", "jdk.lang", "java.lang"], "표준 모듈", "근거: java.base는 모든 모듈이 기본으로 읽는 표준 모듈이다.", "표준 모듈 판별"),
      quiz("java.sql 패키지를 사용하는 모듈 프로젝트의 module-info.java에 필요한 선언은?", "requires java.sql;", ["exports java.sql;", "classpath java.sql;", "package java.sql;"], "모듈 의존성", "근거: 다른 모듈을 사용하려면 requires로 모듈 의존성을 선언한다.", "module-info 작성"),
      quiz("모듈에서 외부에 공개할 패키지를 선언하는 키워드는?", "exports", ["throws", "implements", "pollEvents"], "모듈 공개", "근거: exports는 모듈의 특정 패키지를 외부 모듈에 공개한다.", "exports 의미"),
      quiz("Javadoc의 주된 용도는?", "소스의 문서 주석을 바탕으로 API 문서를 생성한다.", ["JAR 파일을 실행한다.", "스레드를 동기화한다.", "SQL 결과를 저장한다."], "문서화", "근거: 강의의 라이브러리 단원은 재사용을 위한 문서화와 Javadoc을 함께 다룬다.", "Javadoc 역할"),
    ],
  },
};
