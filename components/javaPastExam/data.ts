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
  15: "AWT GUI와 이벤트 처리",
};

type ChoiceExplanationSet = [string, string, string, string];

const choiceExplanationsByQuestion: Record<string, ChoiceExplanationSet> = {
  "2017-36": [
    "강의 4강의 클래스와 객체 설명에서 객체 변수 c는 Circle 객체 자체가 아니라 그 객체를 가리키는 참조값을 담는다.",
    "강의 4강의 객체 생성 흐름에서 new Circle(5)는 Circle 객체가 사용할 인스턴스 필드 공간을 만든다.",
    "강의 4강의 초기화 설명에서 초기화 블록은 객체 생성 중 실행되는 코드이지 별도로 할당되는 객체 구성요소가 아니다.",
    "강의 4강의 생성자 설명에 따르면 new Circle(5)는 인자 5를 받는 Circle 생성자를 호출한다.",
  ],
  "2017-37": [
    "강의 3강의 접근 제어자 표에서 접근 제어자를 생략하면 같은 패키지 범위로 제한되므로 가장 넓은 공개 범위가 아니다.",
    "강의 3강에서 protected는 같은 패키지와 상속 관계 하위 클래스에 허용되는 범위라 public보다 좁다.",
    "강의 3강에서 private은 선언한 클래스 내부에서만 접근 가능하므로 네 선택지 중 가장 좁은 범위이다.",
    "강의 3강의 접근 제어 규칙에서 public은 모든 클래스에서 접근 가능한 가장 넓은 사용 범위를 제공한다.",
  ],
  "2017-38": [
    "강의 5강의 인터페이스 멤버 규칙에서 인터페이스 데이터 필드는 public static final 상수로 취급되므로 맞는 설명이다.",
    "강의 5강에서 인터페이스의 default 메소드와 static 메소드는 선언만 두는 추상 메소드와 달리 몸체를 가져야 한다.",
    "강의 5강은 추상 클래스가 미완성 틀이므로 new로 직접 인스턴스를 만들 수 없다고 설명한다.",
    "강의 5강에서 추상 클래스는 추상 메소드뿐 아니라 몸체가 구현된 일반 메소드도 함께 가질 수 있다.",
  ],
  "2017-39": [
    "강의 5강의 타입 관계 문법에서 인터페이스 X는 클래스 A를 extends 할 수 없으므로 d만 잘못되었다.",
    "b는 클래스 A가 인터페이스 X, Y를 implements로 구현하는 문장이고, c는 인터페이스끼리 extends 하는 문장이어서 둘 다 올바르다.",
    "b는 클래스가 여러 인터페이스를 implements 하는 허용 형태이며, d만 인터페이스가 클래스를 상속하려는 오류이다.",
    "c는 인터페이스 X가 인터페이스 Y, Z를 확장하는 허용 형태이고, d만 클래스 A를 인터페이스가 확장하려는 오류이다.",
  ],
  "2017-40": [
    "강의 5강의 익명 클래스 설명에서 새로 정의되는 것은 기존 CSuper 클래스가 아니라 CSuper를 상속한 이름 없는 하위 클래스이다.",
    "new CSuper() 뒤의 중괄호 본문은 CSuper를 상속한 익명 하위 클래스를 만들고 그 객체를 즉시 생성하는 형식이다.",
    "강의 5강에서 Java 클래스는 다중 상속을 허용하지 않으며 이 구문도 CSuper와 익명 클래스를 동시에 상속하는 뜻이 아니다.",
    "제네릭 타입 매개변수는 꺾쇠괄호로 표현되며, new CSuper() { ... }는 매개변수화가 아니라 익명 클래스 본문이다.",
  ],
  "2017-41": [
    "강의 1강과 6강의 main 메소드 형식에서 문자 배열 Char[]가 아니라 문자열 배열 String[]가 매개변수로 쓰인다.",
    "String args는 문자열 하나를 받는 선언이므로 JVM이 찾는 main(String[] args) 시작점 형식과 다르다.",
    "public static void main(String[] args)는 Java 응용 프로그램의 표준 시작점이며 args는 문자열 배열이다.",
    "String[] args[]는 2차원 문자열 배열 선언으로 해석되어 표준 main 매개변수 String[] args와 차원이 다르다.",
  ],
  "2017-42": [
    "raw 타입 List에도 add 호출 자체는 허용되므로 list1.add(\"Hello\") 문장은 컴파일 오류의 직접 원인이 아니다.",
    "강의 6강의 raw 타입 설명처럼 list1.get(0)의 반환형은 Object로 취급되므로 String 변수에 넣으려면 명시적 형변환이 필요하다.",
    "List<String> list2의 add(\"Java\")는 원소 타입이 String으로 지정되어 있어 제네릭 타입 검사와 일치한다.",
    "List<String>에서 get(0)의 반환형은 String으로 알려져 있으므로 String s2 대입에 별도 형변환이 필요 없다.",
  ],
  "2017-43": [
    "강의 7강의 예외 처리 흐름에서 try 블록 실행 중 예외가 발생하면 남은 try 문장은 건너뛰고 catch 탐색으로 이동한다.",
    "try 블록에서 예외가 발생하지 않으면 처리할 예외가 없으므로 catch 블록은 실행되지 않는다.",
    "강의 7강에서 finally는 예외 발생 여부와 관계없이 정리 작업을 위해 마지막에 실행되는 블록으로 설명된다.",
    "강의 7강의 try-catch-finally 문법에서 finally는 선택 사항이며, 예외 처리 코드는 try-catch만으로도 작성할 수 있다.",
  ],
  "2017-44": [
    "강의 8강에서 String은 java.lang 패키지의 문자열 표현 클래스로 제시된다.",
    "강의 8강은 String이 문자열 비교, 검색, 추출을 위한 메소드를 제공한다고 설명한다.",
    "강의 8강의 불변 객체 설명에 따르면 String 객체의 내부 문자열은 생성 후 직접 수정되지 않는다.",
    "강의 8강은 반복적인 문자열 변경에는 새 String 객체가 계속 생기므로 StringBuffer나 StringBuilder가 더 적합하다고 설명한다.",
  ],
  "2017-45": [
    "Integer.toString(23)은 int 값을 문자열로 변환하는 메소드 호출이지 래퍼 객체에 담는 박싱 변환이 아니다.",
    "Integer.parseInt(\"34\")는 문자열을 int 기본형으로 파싱하므로 래퍼 객체 생성인 박싱과 방향이 다르다.",
    "new Integer(10)은 int 기본형 값 10을 Integer 래퍼 클래스 객체로 감싸므로 강의 8강의 박싱 개념에 해당한다.",
    "String.valueOf(34)는 값을 문자열로 만드는 변환이며 Integer 같은 포장 클래스 객체를 만드는 문장이 아니다.",
  ],
  "2017-46": [
    "FileInputStream은 바이트 단위 입력 스트림이므로 텍스트를 문자 단위로 파일에 출력하는 클래스가 아니다.",
    "강의 9강의 캐릭터 스트림 설명에서 FileWriter는 문자 단위로 파일에 쓰는 기본 출력 스트림이다.",
    "BufferedReader는 문자 입력 스트림에 버퍼와 readLine 기능을 더하는 보조 입력 스트림이라 파일 출력용 기본 스트림이 아니다.",
    "PrintWriter는 형식화된 문자 출력에 쓰일 수 있지만, 강의의 기본 파일 문자 출력 스트림으로 묻는 답은 FileWriter이다.",
  ],
  "2017-47": [
    "강의 10강에서 Path는 java.io.File보다 경로 표현과 조작 기능을 강화한 경로 타입으로 설명된다.",
    "Path는 파일시스템 안의 파일이나 디렉터리 위치를 표현하는 인터페이스라는 강의 10강 정의와 맞다.",
    "Path는 경로 생성, 부모·파일명 같은 요소 조회, 경로 비교와 조작을 제공한다.",
    "강의 10강에서 파일 내용 읽기와 쓰기는 Files나 FileChannel의 역할이며 Path 자체의 책임이 아니다.",
  ],
  "2017-48": [
    "향상된 for문의 콜론 왼쪽에는 원소 변수 선언이 와야 하는데 list : String element는 순서가 거꾸로이다.",
    "강의 12강의 향상된 for문 형식은 for (String element : list)처럼 원소 변수 뒤에 순회 대상 컬렉션을 둔다.",
    "list의 원소 타입은 String인데 int element로 받으면 컬렉션 원소 타입과 반복 변수 타입이 맞지 않는다.",
    "int i=0; i<=list.length; i++는 일반 for문 형식이고, List에는 배열 필드 length도 없다.",
  ],
  "2017-49": [
    "강의 11강에서 ArrayList는 List 인터페이스를 구현하는 대표 클래스라고 설명된다.",
    "ArrayList는 내부적으로 배열 구조를 이용해 여러 원소를 저장하는 List 구현으로 소개된다.",
    "List 계열은 원소의 저장 순서와 인덱스 접근이 의미를 가지며 ArrayList도 그 성질을 따른다.",
    "강의 11강에서 중복을 허용하지 않는 것은 Set이고, ArrayList 같은 List는 같은 값을 여러 번 저장할 수 있다.",
  ],
  "2017-50": [
    "강의 11강에서 Map은 Collection 계열과 별도로 key/value 쌍을 다루는 표준 인터페이스로 함께 다룬다.",
    "Map 원소는 key와 value의 쌍으로 저장된다는 강의 11강의 HashMap 설명과 맞다.",
    "LinkedList는 List와 Queue 구현으로 쓰이는 클래스이며, 해싱 기반 Map 구현 클래스는 HashMap이다.",
    "Map에서는 값을 저장할 때 put(key, value)를, 키로 값을 읽을 때 get(key)를 사용한다.",
  ],
  "2017-51": [
    "throw는 예외 객체를 실제로 던지는 실행 문장이고, 메소드 선언부에서 예외 전파를 표시하는 키워드가 아니다.",
    "강의 7강의 예외 전파 설명에서 메소드 선언부에 throws InterruptedException처럼 써서 호출자에게 처리를 위임한다.",
    "synchronize는 Java 예외 전파 키워드가 아니며, 스레드 동기화 키워드는 synchronized이다.",
    "interrupt는 스레드에 인터럽트를 거는 메소드 이름으로 쓰이며 예외 전파 선언 키워드가 아니다.",
  ],
  "2017-52": [
    "Thread.sleep()은 현재 실행 중인 스레드를 시간 동안 쉬게 하는 메소드이며 대상 스레드 t1, t2의 종료를 기다리지 않는다.",
    "Thread.sleep(t1)처럼 Thread 객체를 인자로 전달하는 호출은 sleep의 시간 인자 형식과 맞지 않는다.",
    "t1.sleep()처럼 호출해도 sleep은 정적 메소드 성격으로 현재 스레드를 쉬게 할 뿐 t1 종료 대기가 아니다.",
    "강의 13강에서 join은 대상 스레드가 끝날 때까지 현재 스레드를 기다리게 하므로 t1.join(); t2.join();이 필요하다.",
  ],
  "2017-53": [
    "Object를 상속해도 run, start 같은 스레드 실행 틀을 얻지 못하므로 MyThread1의 상위 클래스로 맞지 않는다.",
    "강의 13강의 스레드 생성 방법 중 하나는 Thread를 상속하고 run 메소드를 재정의한 뒤 start로 실행하는 것이다.",
    "Process는 운영체제의 독립 실행 단위를 가리키는 개념이지 Java Thread 클래스의 상위 클래스로 쓰는 답이 아니다.",
    "Runnable은 implements로 구현하는 인터페이스이며, 빈칸은 class MyThread1 extends ____ 형태라 Thread가 들어간다.",
  ],
  "2017-54": [
    "yield는 우선순위 값을 바꾸는 메소드가 아니며, 강의 13강의 우선순위 제어와 구분된다.",
    "강의 13강에서 Thread.yield()는 현재 스레드가 실행 기회를 잠시 양보해 다른 실행 가능 스레드가 실행될 수 있게 한다.",
    "공유 자원에 배타적으로 접근하게 하는 키워드는 synchronized이고 yield는 임계 영역 보호 기능을 제공하지 않는다.",
    "중단된 스레드를 깨우는 것은 notify/interrupt 같은 별도 동작과 관련되며 yield는 현재 실행 흐름의 양보이다.",
  ],
  "2017-55": [
    "Frame은 Window를 상속하는 최상위 창 컨테이너이므로 Container 클래스 계층에 포함된다.",
    "Panel은 여러 컴포넌트를 담는 컨테이너로 AWT Container의 하위 클래스이다.",
    "Window는 Frame의 상위에 있는 컨테이너 계층 클래스라 Container의 자식 계열에 속한다.",
    "List는 항목 목록을 보여주는 AWT 컴포넌트이지 다른 컴포넌트를 담는 Container 하위 클래스가 아니다.",
  ],
  "2017-56": [
    "GridLayout은 같은 크기의 격자 칸으로 컴포넌트를 배치하므로 한 줄 흐름 배치 화면과 다르다.",
    "강의 AWT 배치관리자 설명에서 FlowLayout은 컴포넌트를 왼쪽에서 오른쪽으로 한 줄 흐름에 따라 배치한다.",
    "BorderLayout은 North, South, East, West, Center 영역에 배치하므로 체크박스와 버튼이 이어지는 화면과 맞지 않는다.",
    "SpringLayout은 제약 기반 배치관리자이고 강의의 기본 한 줄 흐름 화면을 설명하는 답이 아니다.",
  ],
  "2017-57": [
    "AWT 이벤트 모델에서 이벤트 소스에 리스너 객체를 등록해야 콜백 메소드가 호출된다.",
    "강의의 이벤트 처리 설명에서 하나의 이벤트 소스에는 같은 종류 또는 여러 종류의 리스너를 둘 이상 등록할 수 있다.",
    "ActionEvent에는 ActionListener처럼 이벤트 클래스에 대응되는 리스너 인터페이스가 존재한다.",
    "WindowListener처럼 여러 추상 메소드를 가진 리스너를 편하게 쓰기 위해 WindowAdapter 같은 어댑터 클래스가 제공된다.",
  ],
  "2017-58": [
    "Action은 이벤트 리스너 인터페이스 이름이 아니며 addActionListener가 요구하는 타입과 다르다.",
    "ActionEvent는 발생한 이벤트 객체의 클래스이고, 이벤트를 처리할 리스너 구현 타입이 아니다.",
    "ActionAdapter라는 AWT 표준 어댑터는 ActionListener 문항의 답이 아니며 addActionListener 인자로 요구되지 않는다.",
    "aButton.addActionListener(new A())가 컴파일되려면 A는 강의의 버튼 이벤트 리스너인 ActionListener를 구현해야 한다.",
  ],
  "2017-59": [
    "강의 14강의 JDBC 흐름에서 DB 연결은 Connection, SQL 실행 객체는 Statement, SELECT 결과는 ResultSet으로 받는다.",
    "PreparedStatement는 매개변수 SQL을 준비할 때 쓰는 Statement 하위 타입이지만, 코드의 createStatement 호출 결과 변수에는 Statement가 알맞다.",
    "ConnectionEvent와 ResultStore는 이 JDBC 예제의 연결 객체와 결과 집합 타입으로 쓰이지 않는다.",
    "ConnectionPool과 ResultStore는 강의의 기본 DriverManager-Connection-Statement-ResultSet 예제 타입 배열이 아니다.",
  ],
  "2017-60": [
    "execute는 여러 종류의 SQL 실행에 쓰일 수 있지만 SELECT 결과를 ResultSet으로 바로 받는 대표 메소드는 executeQuery이다.",
    "강의 14강에서 SELECT 문 실행은 Statement.executeQuery(sql)로 수행하고 반환값은 ResultSet이다.",
    "executeUpdate는 INSERT, UPDATE, DELETE처럼 변경 행 수를 돌려주는 SQL에 쓰이며 SELECT 결과 테이블 반환과 다르다.",
    "executeSql은 강의 14강의 Statement API에서 제시되는 표준 JDBC 메소드 이름이 아니다.",
  ],

  "2018-36": [
    "Java Platform은 Java API와 실행 기반을 포함하는 실습 환경의 구성요소로 강의 1강에서 다룬다.",
    "Java VM은 바이트코드를 실행하는 핵심 엔진이므로 Java 프로그램 실습에 필요한 실행 구성이다.",
    "JDK는 javac와 java 같은 개발 도구를 제공하므로 Java 소스 작성과 컴파일 실습에 필요하다.",
    "Eclipse for JavaScript는 JavaScript 개발용 도구 이름이므로 Java 프로그래밍 실습 환경으로 묻는 항목과 맞지 않는다.",
  ],
  "2018-37": [
    "int[] a = new int[10];은 강의 3강의 배열 생성식처럼 대괄호에 길이를 써서 int 배열 객체를 만든다.",
    "int b[] = { 1, 2, 3, 4 };은 선언과 동시에 초기화 블록을 쓰는 올바른 1차원 배열 초기화이다.",
    "강의 3강의 배열 문법에서 초기화 블록만 단독 대입하려면 new int[]가 필요하므로 c = {1, 2, 3, 4};는 잘못되었다.",
    "int[][] d = new int[10][];은 첫 번째 차원만 먼저 만드는 가변 길이 2차원 배열 생성으로 허용된다.",
  ],
  "2018-38": [
    "System.out.println(i + j)는 두 int 값을 산술 덧셈한 결과 하나만 출력하므로 i와 j를 각각 구분해 출력하지 않는다.",
    "강의 3강의 문자열 결합 설명처럼 i + \",\" + j는 문자열이 끼어들어 두 값을 쉼표로 구분한 하나의 출력 인수가 된다.",
    "println은 쉼표로 여러 인수를 받는 형식이 아니므로 System.out.println(i, j)는 Java 출력문 문법과 맞지 않는다.",
    "System.out.println(i, \",=\", j)도 println에 세 인수를 넘기는 형태라 강의의 println 호출 형식이 아니다.",
  ],
  "2018-39": [
    "a는 클래스 A가 두 클래스 B, C를 동시에 extends 하려 하므로 Java의 단일 클래스 상속 규칙에 어긋나고, b도 클래스와 인터페이스를 함께 extends 해 잘못되었다.",
    "a는 다중 클래스 상속 오류이고, d는 인터페이스끼리 extends 하는 올바른 문장이므로 둘을 함께 고르면 안 된다.",
    "c는 클래스가 인터페이스 Y, Z를 implements 하는 올바른 문장이지만 d까지 함께 고르는 선택지가 원문 조건의 모든 정답이다.",
    "강의 5강에서 클래스는 여러 인터페이스를 implements 할 수 있고 인터페이스는 여러 인터페이스를 extends 할 수 있으므로 c와 d가 모두 올바르다.",
  ],
  "2018-40": [
    "a는 protected double compute(int x, int y)로 부모 메소드와 이름, 매개변수, 반환형, 접근 범위가 모두 같아 재정의 형식에 맞다.",
    "a는 동일 시그니처 재정의이고, b는 protected보다 넓은 public 접근으로 같은 double compute(int,int)를 재정의하므로 둘 다 가능하다.",
    "c는 반환형을 double에서 int로 바꾸므로 기본형 반환형의 오버라이딩 조건을 만족하지 못한다.",
    "c는 반환형이 다르고, d는 private으로 접근 범위가 좁아지며 매개변수도 3개라 부모 compute(int,int)의 재정의가 아니다.",
  ],
  "2018-41": [
    "new CSuper() { ... }에서 기존 CSuper 클래스를 새로 정의하는 것이 아니라 그 하위 익명 클래스를 정의한다.",
    "CSuper는 코드에서 class로 선언되어 있으므로 인터페이스 구현이라는 설명은 원문 프로그램 조각과 맞지 않는다.",
    "강의 5강의 익명 클래스 형식처럼 CSuper를 상속받는 이름 없는 클래스를 정의하고 동시에 객체를 만든다.",
    "매개변수화는 Data<String> 같은 제네릭 문법이고, new CSuper() 뒤의 중괄호는 익명 클래스 본문이다.",
  ],
  "2018-42": [
    "CSuper 클래스 하나만 세면 AnonymousTest와 익명 클래스가 빠지므로 원문 파일 컴파일 결과와 맞지 않는다.",
    "CSuper와 AnonymousTest 두 클래스 외에 new CSuper() { ... }에 해당하는 익명 클래스의 class 파일도 생성된다.",
    "강의 5강의 익명 클래스 컴파일 결과까지 포함하면 CSuper, AnonymousTest, 익명 하위 클래스의 세 class 파일이 생긴다.",
    "프로그램 조각에는 일반 클래스 두 개와 익명 클래스 하나가 있으므로 네 개의 class 파일이 만들어질 구조는 아니다.",
  ],
  "2018-43": [
    "강의 5강에서 추상 클래스는 의미적으로 가까운 클래스의 공통 틀과 구현 일부를 묶는 데 사용된다.",
    "추상 클래스는 인터페이스와 마찬가지로 직접 인스턴스를 생성할 수 없으며, 하위 클래스를 통해 사용해야 한다.",
    "인터페이스 데이터 필드는 public static final 상수로 취급된다는 강의 5강의 멤버 규칙과 맞다.",
    "추상 클래스와 인터페이스는 하위 클래스나 구현 클래스를 통해 구체 동작을 제공하도록 설계된다.",
  ],
  "2018-44": [
    "강의 6강에서 제네릭 타입 인자에는 int 같은 기본 자료형을 직접 사용할 수 없고 Integer 같은 참조형을 써야 한다.",
    "우측의 다이아몬드 <>는 좌측 타입 인자 추론에 쓰일 수 있으며, 문제의 핵심 오류는 좌측 Data<int>의 기본형 타입 인자이다.",
    "raw 타입은 타입 인자를 생략한 Data d 같은 형태이지 Object를 타입 매개변수로 반드시 써야 하는 규칙이 아니다.",
    "Data<int>가 기본 자료형 타입 인자를 사용하므로 강의 6강의 제네릭 타입 제한을 위반해 문제가 있다.",
  ],
  "2018-45": [
    "str2는 str1과 같은 String 객체를 참조하므로 str1==str2는 참조 비교 결과 true가 된다.",
    "str3는 내용은 Java로 같지만 new String으로 별도 객체가 되었으므로 str2==str3의 참조 비교 결과는 false이다.",
    "String.equals는 내용 비교를 하므로 str1과 str2가 같은 객체를 참조하는 이 식은 true이다.",
    "String.equals는 내용 비교를 하므로 서로 다른 객체라도 str2와 str3의 문자열 내용 Java가 같아 true이다.",
  ],
  "2018-46": [
    "강의 8강에서 String은 비교, 검색, 추출 같은 문자열 처리 메소드를 제공한다고 설명된다.",
    "String은 불변 객체라 반복 변경 때 새 객체가 많이 생기므로 빈번한 변경에는 StringBuffer/StringBuilder가 더 적합하다.",
    "StringBuffer는 가변 문자열 버퍼로 삽입, 삭제, 대체 같은 수정 메소드를 제공한다.",
    "StringBuffer 객체가 내부 버퍼를 가지고 문자열을 수정한다는 설명은 강의 8강의 가변 문자열 개념과 맞다.",
  ],
  "2018-47": [
    "FileReader는 문자 단위 파일 입력 스트림이므로 바이트 단위 입력 문항의 클래스가 아니다.",
    "강의 9강에서 파일을 데이터 소스로 하여 바이트 단위로 읽을 때 FileInputStream을 사용한다.",
    "File은 파일 경로나 파일 객체 정보를 표현하는 클래스이지 바이트 입력을 수행하는 스트림 클래스가 아니다.",
    "Path는 NIO의 경로 표현 인터페이스로 파일 주소를 다루며 바이트 입력 스트림이 아니다.",
  ],
  "2018-48": [
    "Charset.encode(data[i]) 호출은 문자열을 지정 문자 세트의 바이트 표현으로 인코딩하는 내용이 코드에 나타난다.",
    "encode 결과가 ByteBuffer buffer에 대입되므로 인코딩된 문자열이 버퍼에 담기는 흐름이 코드에 보인다.",
    "fileChannel.write(buffer)는 버퍼에 담긴 데이터를 파일 채널에 쓰는 호출로 강의 10강의 채널 입출력과 맞다.",
    "코드는 encode 후 write만 수행하고 fileChannel.read(buffer) 같은 파일에서 버퍼로 읽는 호출은 나타나지 않는다.",
  ],
  "2018-49": [
    "강의 11강에서 Set은 순서 의미가 없고 중복 원소를 허용하지 않는 집합형 컬렉션 인터페이스이다.",
    "List는 저장 순서와 인덱스가 의미 있고 중복도 허용하므로 순서 무관·중복 불허 조건과 다르다.",
    "Queue는 먼저 들어간 원소를 먼저 처리하는 대기열 의미가 핵심이며 중복 제거 집합을 뜻하지 않는다.",
    "Map은 key/value 쌍을 저장하는 구조로 단일 원소의 중복 없는 집합을 묻는 조건과 다르다.",
  ],
  "2018-50": [
    "HashSet은 Set 인터페이스의 구현 클래스이므로 Set<Integer> 변수에 담는 사용 예가 맞다.",
    "ArrayList는 List 구현 클래스이므로 변수 이름이 set이어도 List<Integer> 타입 대입 자체는 가능하다.",
    "LinkedList는 Queue 구현으로도 쓰일 수 있으므로 Queue<Integer> 변수에 담는 예가 가능하다.",
    "HashMap은 Map<K,V>처럼 키 타입과 값 타입 두 개가 필요하므로 Map<String>처럼 타입 인자 하나만 쓰는 선언은 잘못되었다.",
  ],
  "2018-51": [
    "yield는 우선순위 값을 낮추는 메소드가 아니라 실행 중인 스레드가 잠시 실행 기회를 양보하게 하는 메소드이다.",
    "강의 13강에서 Thread.yield()는 현재 스레드가 CPU 사용 기회를 양보해 두 스레드의 출력이 번갈아 나타날 수 있게 한다.",
    "한 스레드가 10회 모두 출력한 뒤 다음 스레드가 출력되는 순서를 보장하는 메소드는 yield가 아니다.",
    "finished가 마지막에 출력되는 것은 join 호출의 효과이며 yield 호출 자체의 기능 설명이 아니다.",
  ],
  "2018-52": [
    "join은 중단된 메인 스레드를 깨우는 동작이 아니라 메인 스레드가 대상 작업 스레드 종료를 기다리게 하는 동작이다.",
    "CPU 양보는 yield의 설명이고, join은 자발적 양보가 아니라 특정 스레드의 종료 대기이다.",
    "강의 13강에서 my_thread1.join(); my_thread2.join(); 뒤의 코드는 두 대상 스레드가 종료된 후 실행된다.",
    "공유 자원 배타 접근은 synchronized가 담당하며 join은 동기화 잠금을 제공하지 않는다.",
  ],
  "2018-53": [
    "throws만 쓰면 어떤 예외를 전파하는지 선언하지 않아 메소드 선언부의 완성된 형식이 아니다.",
    "extends는 클래스 상속에 쓰는 키워드이며 InterruptedException 처리 위임을 나타내지 않는다.",
    "Thread.join()이 던질 수 있는 예외는 InterruptedException이지 ArithmeticException이 아니다.",
    "강의 13강의 join 예제처럼 main 선언부에는 throws InterruptedException을 써서 join 호출 예외를 전파할 수 있다.",
  ],
  "2018-54": [
    "Button은 클릭 가능한 단일 버튼 컴포넌트라 그림의 여러 항목과 스크롤바가 있는 목록 형태와 다르다.",
    "Canvas는 사용자가 그림을 그리거나 paint로 출력하는 영역이며 항목 선택 목록 컨트롤이 아니다.",
    "Choice는 드롭다운 선택 컨트롤이고, 그림처럼 여러 항목이 보이고 스크롤되는 리스트박스가 아니다.",
    "강의 AWT 컨트롤에서 List는 여러 항목을 표시하고 선택할 수 있는 목록 컴포넌트이며 그림의 형태와 일치한다.",
  ],
  "2018-55": [
    "ActionEvent는 List 항목 더블클릭 때 발생할 수 있지만 단순 항목 선택 이벤트의 첫 번째 답은 ItemEvent이다.",
    "강의 AWT 이벤트 설명에서 List 항목 선택은 ItemEvent, 항목 더블클릭 같은 동작은 ActionEvent로 처리된다.",
    "KeyEvent는 키보드 입력 이벤트이므로 마우스로 목록 항목을 선택하는 상황의 이벤트가 아니다.",
    "WindowEvent는 창 열기·닫기 같은 윈도우 상태 이벤트라 List 항목 더블클릭 이벤트와 다르다.",
  ],
  "2018-56": [
    "강의 배치관리자 설명에서 GridLayout은 행과 열의 같은 크기 격자에 컴포넌트를 배치하며, 그림의 2행 3열 화면과 맞다.",
    "FlowLayout은 한 줄 흐름으로 컴포넌트를 배치하므로 같은 크기의 격자 화면을 설명하지 못한다.",
    "BorderLayout은 다섯 영역에 컴포넌트를 놓는 방식이라 2행 3열의 균등 격자와 다르다.",
    "ButtonAreaLayout은 강의 AWT 기본 배치관리자 목록에서 다룬 표준 배치관리자 이름이 아니다.",
  ],
  "2018-57": [
    "WindowListener는 구현해야 할 추상 메소드가 여러 개라 windowClosing만 작성한 MyListener 코드와 맞지 않는다.",
    "WindowAdapter는 클래스이므로 implements로 구현하는 대상이 아니라 extends로 상속해 필요한 메소드만 재정의한다.",
    "WindowListener는 인터페이스라 extends 대상 클래스처럼 쓸 수 없고, MyListener가 필요한 것은 어댑터 클래스 상속이다.",
    "강의 AWT 어댑터 설명처럼 WindowAdapter를 상속하면 windowClosing만 재정의해 닫기 이벤트를 처리할 수 있다.",
  ],
  "2018-58": [
    "프레임 닫기 이벤트를 받으려면 이벤트 소스인 Frame에 addWindowListener로 MyListener 객체를 등록해야 한다.",
    "new MyFrame()은 프레임 객체이지 WindowListener/WindowAdapter를 상속한 리스너 객체가 아니므로 등록 인자로 맞지 않는다.",
    "AWT 이벤트 등록 메소드 이름은 addWindowListener이고 addWindowAdapter라는 등록 메소드는 강의 API 형식에 없다.",
    "addWindowAdapter도 표준 등록 메소드가 아니며, MyFrame은 이벤트 처리 객체가 아니라 화면 프레임이다.",
  ],
  "2018-59": [
    "Connection 객체 생성이 첫 문장이라는 설명은 DriverManager.getConnection의 연결 획득을 객체 생성으로만 좁혀 말하고, 세 문장의 순서도 원문과 다르다.",
    "두 번째 문장을 SQL 질의 실행으로 보는 설명은 틀렸다. conn.createStatement()는 SQL을 실행하지 않고 Statement 객체를 만든다.",
    "JDBC 예제의 세 문장은 DBMS와 연결 획득, Statement 객체 생성, SELECT 질의 실행 순서로 진행된다.",
    "첫 문장은 연결 종료가 아니라 DriverManager.getConnection으로 DBMS 연결을 얻는 문장이다.",
  ],
  "2018-60": [
    "executeQuery가 SELECT 결과 테이블을 반환할 때 강의 14강의 반환 객체 타입은 ResultSet이다.",
    "ResultTable은 강의 14강의 JDBC 표준 결과 객체 이름이 아니다.",
    "Statement는 SQL을 실행하는 객체이고 SELECT 결과 행과 열을 담아 순회하는 반환 타입이 아니다.",
    "StatementTable은 JDBC 예제에서 executeQuery 반환 타입으로 쓰이는 표준 타입명이 아니다.",
  ],

  "2019-36": [
    "강의 3강의 배열 생성식처럼 int[] a = new int[10];은 길이 10의 int 배열 객체를 만드는 올바른 문장이다.",
    "int b[]는 1차원 int 배열 선언인데 오른쪽 초기화식은 중괄호가 한 단계 더 있는 2차원 형태라 차원이 맞지 않는다.",
    "배열 변수 c를 먼저 선언한 뒤 초기화 블록만 대입하려면 new int[]가 필요하므로 c = {1, 2, 3, 4};는 허용되지 않는다.",
    "int[][] d는 2차원 배열인데 new int[10]은 1차원 int 배열 생성식이라 선언 차원과 생성 차원이 맞지 않는다.",
  ],
  "2019-37": [
    "public은 인터페이스 메소드 공개 범위에 쓰일 수 있지만, 기본 몸체를 가진 인터페이스 메소드를 표시하는 키워드는 아니다.",
    "final은 재정의나 변경 제한을 나타내며, 인터페이스 default 메소드의 기본 구현을 선언하는 키워드가 아니다.",
    "abstract 메소드는 몸체가 없는 선언만 가진 메소드라, 문제의 '기본 몸체를 가지는 메소드'와 반대이다.",
    "강의 5강에서 인터페이스의 default 메소드는 메소드 몸체를 가진 기본 구현을 제공할 수 있다.",
  ],
  "2019-38": [
    "Salesman과 Developer가 Employee를 extends 하므로 원문 프로그램에는 클래스 간 상속 관계가 있다.",
    "Employee는 부모 클래스이고 Salesman, Developer가 이를 이용해 자식 클래스로 정의되어 있다.",
    "Employee 선언에는 abstract 키워드가 없고 doJob도 몸체가 있으므로 부모 클래스가 추상 클래스로 정의되었다는 설명은 틀렸다.",
    "Employee emp1, emp2 변수에 new Salesman(), new Developer() 객체를 대입하므로 상위 타입 참조의 다형성 예가 맞다.",
  ],
  "2019-39": [
    "강의 5강의 동적 바인딩 설명에 따르면 emp1은 Salesman 객체를 가리키므로 Employee의 doJob이 아니라 Salesman의 doJob이 실행된다.",
    "emp2는 Developer 객체를 가리키므로 두 번째 출력이 do something이 아니라 Developer의 doJob 결과가 된다.",
    "emp1이 Salesman 객체이므로 첫 번째 출력이 do something으로 남지 않고 재정의된 do sales가 출력된다.",
    "상위 타입 변수 emp1, emp2가 각각 Salesman과 Developer 객체를 참조하므로 재정의된 doJob이 실행되어 do sales와 do development가 출력된다.",
  ],
  "2019-40": [
    "\"abcde\"는 String 리터럴이므로 강의 8강의 문자열 객체 처리에서 String 값으로 다룬다.",
    "new String()은 빈 문자열을 담는 String 객체를 생성하는 표현식이다.",
    "i < 1000은 for문의 반복 조건식으로 boolean 결과를 내며 String 유형의 수식이 아니다.",
    "str + aValue는 문자열 결합 연산이며 피연산자 중 String이 있으므로 결과가 String이다.",
  ],
  "2019-41": [
    "프로그램은 String 변수와 문자열 결합 문법으로 작성되어 있어 컴파일 또는 실행 오류 없이 수행될 수 있다.",
    "강의 8강의 String 불변성 때문에 str = str + aValue가 반복될 때마다 이전 문자열을 바꾸지 않고 새 String 결과를 만든다.",
    "String은 immutable 클래스이므로 1,000번 반복 결합에서는 새 문자열 객체가 계속 생겨 메모리 낭비가 커질 수 있다.",
    "반복 횟수가 커질수록 누적 문자열이 길어지고 새 String 생성 비용이 늘어나므로 평균 실행 속도가 점점 빨라진다는 설명은 강의의 StringBuffer 권장 이유와 반대이다.",
  ],
  "2019-42": [
    "FileInputStream/FileOutputStream은 바이트 스트림 쌍이라 문제의 2바이트 문자 단위 텍스트 입출력 조건과 다르다.",
    "FileOutputStream/FileInputStream은 순서도 출력 뒤 입력으로 뒤집혀 있고 둘 다 바이트 스트림이다.",
    "강의 9강에서 FileReader는 문자 단위 파일 입력, FileWriter는 문자 단위 파일 출력에 쓰인다.",
    "FileWriter/FileReader는 문자 스트림 클래스이지만 문제의 순서가 파일로부터 읽은 후 파일에 출력이므로 입력과 출력 순서가 반대이다.",
  ],
  "2019-43": [
    "catch(java.io.IOException)는 catch 매개변수 이름이 없어서 강의 7강의 catch(예외타입 변수) 형식에 맞지 않는다.",
    "강의 7강의 예외 처리 문법처럼 catch(java.io.IOException e)는 예외 타입과 변수 이름을 함께 선언한다.",
    "catch(java.io.IOException ex)는 catch 변수 이름을 ex로 선언하므로 이어지는 System.out.println(e)에서 사용하는 e와 이름이 맞지 않는다.",
    "finally는 예외 처리의 마지막 정리 블록으로 쓸 수 있지만, IOException 객체를 받아 출력하는 catch 블록을 대체하지 않는다.",
  ],
  "2019-44": [
    "Buffer는 NIO 입출력 데이터를 임시로 담는 저장 공간이며 파일이나 디렉터리 경로를 표현하는 타입이 아니다.",
    "강의 10강에서 Path는 java.nio.file 패키지의 경로 표현 인터페이스로 java.io.File을 대신해 경로를 조작한다.",
    "FileReader는 java.io의 문자 입력 스트림으로 파일 내용을 읽는 클래스이며 경로 표현 인터페이스가 아니다.",
    "FileChannel은 버퍼와 함께 파일 내용을 읽고 쓰는 채널 클래스이며 경로 자체를 표현하는 Path와 역할이 다르다.",
  ],
  "2019-45": [
    "List<>처럼 좌측 타입 인자를 비워 두는 선언은 강의 6강과 11강의 제네릭 타입 지정 문법에 맞지 않는다.",
    "List<Integer>는 정수 원소용 선언이라, 이어지는 list.add(\"one\") 같은 문자열 추가 코드와 원소 타입이 맞지 않는다.",
    "강의 11강의 컬렉션 제네릭 사용처럼 List<String> list = new ArrayList<String>();은 문자열 원소를 저장하는 선언이다.",
    "List는 인터페이스라 new List<String>()로 직접 객체를 만들 수 없고, 구현 클래스 ArrayList를 생성해야 한다.",
  ],
  "2019-46": [
    "for-each문의 콜론 왼쪽에는 원소 변수의 자료형과 이름이 함께 필요하므로 s : list는 선언이 빠져 있다.",
    "for (s : ArrayList list)는 원소 변수 선언도 없고 오른쪽 순회 대상에 타입 선언을 섞어 쓴 잘못된 형식이다.",
    "강의 12강의 향상된 for문 형식처럼 for (String s : list)는 String 원소를 하나씩 꺼내 출력한다.",
    "오른쪽에는 이미 만들어진 컬렉션 객체 list가 와야 하며 ArrayList list처럼 변수 선언 형태를 둘 수 없다.",
  ],
  "2019-47": [
    "add(1, \"one\")은 인덱스 1에 삽입하므로 기존 one, three, two의 three 앞에 새 one이 들어가 결과가 one/two/three가 아니다.",
    "ArrayList의 add는 끝 추가, add(index, 원소)는 지정 위치 삽입이므로 순서는 one, one, three, two가 된다.",
    "새 원소 one은 끝에 붙지 않고 인덱스 1에 삽입되므로 one, three, two, one 순서가 아니다.",
    "강의 11강에서 ArrayList의 순서와 위치 삽입 규칙이 정해져 있으므로 이 코드는 예측 가능한 순서를 만든다.",
  ],
  "2019-48": [
    "delete와 insert는 강의 11강의 HashMap 원소 조회·추가 메소드 이름으로 제시되지 않는다.",
    "pop과 push는 스택 계열 동작 이름으로, key/value 쌍을 다루는 HashMap의 조회·추가 메소드가 아니다.",
    "remove(키)는 삭제에 쓰일 수 있지만 add(키, 값)은 Map에 값을 추가하는 메소드가 아니다.",
    "강의 11강에서 Map 계열은 get(키)로 값을 읽고 put(키, 값)으로 key/value 쌍을 저장한다.",
  ],
  "2019-49": [
    "원문 코드에는 Account 클래스나 Account 객체가 없으므로 공유 자원 후보로 삼을 수 없다.",
    "main에서 Counter c 하나를 만들고 두 MyThread 객체에 같은 c를 전달하므로 두 스레드가 공유하는 자원은 Counter 객체이다.",
    "increment()는 Counter 객체의 상태 c를 증가시키는 메소드이며, 공유되는 실체는 메소드 자체가 아니라 그 메소드를 가진 Counter 객체이다.",
    "getValue()는 Counter의 값을 읽는 메소드이고 두 스레드가 함께 전달받아 변경하는 공유 객체가 아니다.",
  ],
  "2019-50": [
    "Runnable은 인터페이스 이름이며 Thread의 서브 클래스를 정의하는 빈칸 extends 뒤에 들어갈 키워드가 아니다.",
    "SubClass는 Java 상속 문법의 키워드가 아니며 강의 13강의 Thread 하위 클래스 선언에 쓰이지 않는다.",
    "강의 13강에서 Thread 클래스를 상속해 스레드를 만들 때 class MyThread extends Thread처럼 extends를 사용한다.",
    "implements는 Runnable 같은 인터페이스를 구현할 때 쓰며 Thread 클래스를 상속하는 문장의 빈칸에는 맞지 않는다.",
  ],
  "2019-51": [
    "synchronized(this) 블록으로 c++ 임계 영역을 감싸면 Counter 객체에 대한 상호 배제가 이루어진다.",
    "synchronized public void increment()도 메소드 선언부의 동기화 지정으로 허용되는 수식어 배열이다.",
    "public synchronized void increment()는 강의 13강의 동기화 메소드 선언 예와 같은 올바른 형식이다.",
    "Java 메소드 선언에서 synchronized는 반환형 void 앞의 수식어 위치에 와야 하므로 public void synchronized increment()는 문법상 잘못되었다.",
  ],
  "2019-52": [
    "강의 13강에서 join은 대상 스레드가 종료될 때까지 main 스레드를 기다리게 하므로 두 작업 스레드 완료 후 값을 확인할 수 있다.",
    "notify는 wait 중인 스레드를 깨우는 객체 모니터 메소드이고, t1과 t2가 끝날 때까지 main을 기다리게 하지 않는다.",
    "sleep은 현재 스레드를 일정 시간 쉬게 하는 메소드라 작업 스레드 종료 시점을 보장하지 않는다.",
    "Thread.yield()는 실행 기회 양보이며 두 스레드가 모두 끝난 뒤 다음 문장을 실행하게 만드는 대기 메소드가 아니다.",
  ],
  "2019-53": [
    "throw는 예외 객체를 실제로 발생시키는 문장에 쓰이며, main 선언부에서 join 예외 처리를 위임하는 키워드가 아니다.",
    "join 호출이 던질 수 있는 InterruptedException 처리를 호출자에게 위임하려면 강의 7강의 throws 키워드를 메소드 선언부에 둔다.",
    "synchronize는 Java 예외 처리 키워드가 아니며 동기화 키워드는 synchronized이다.",
    "interrupt는 스레드에 인터럽트를 요청하는 메소드 이름이고 예외 전파 선언에 쓰는 키워드가 아니다.",
  ],
  "2019-54": [
    "그림의 AWT List는 리스트박스 형태로 여러 항목과 스크롤을 보여줄 수 있으므로 맞는 설명이다.",
    "AWT List는 생성자 설정에 따라 여러 항목을 선택할 수 있는 목록 컴포넌트로 사용할 수 있다.",
    "강의 AWT 이벤트에서 List는 항목 선택 때 ItemEvent, 더블클릭 등 동작 때 ActionEvent를 발생시킬 수 있다.",
    "모달 대화상자는 Dialog 계열의 창이며, 그림의 스크롤 가능한 항목 목록 컨트롤인 List를 설명하지 않는다.",
  ],
  "2019-55": [
    "강의 7강의 import 설명처럼 java.awt와 java.awt.event의 클래스·인터페이스를 아래 코드에서 단순 이름으로 쓰기 위한 선언이다.",
    "패키지를 결정하는 선언은 package이고, import는 현재 소스 파일의 클래스가 위치할 패키지를 정하지 않는다.",
    "import는 이미 있는 패키지의 타입 이름 해석을 돕는 선언이지 새 패키지를 정의하는 문장이 아니다.",
    "패키지는 상속 대상이 아니며 import 구문은 기존 패키지를 상속해 새 패키지를 만드는 기능을 하지 않는다.",
  ],
  "2019-56": [
    "버튼의 ActionEvent를 처리하려면 강의 AWT 이벤트 모델의 ActionListener 인터페이스를 implements 해야 한다.",
    "ActionListener는 인터페이스이므로 클래스가 extends로 상속하는 대상이 아니라 implements로 구현하는 대상이다.",
    "ActionAdapter라는 표준 어댑터는 이 문항의 버튼 ActionEvent 처리 인터페이스 이름이 아니다.",
    "ActionAdapter를 extends 하는 형태도 원문 코드의 ActionListener 구현 요구와 맞지 않는다.",
  ],
  "2019-57": [
    "GridLayout은 행·열 격자로 같은 크기의 칸에 배치하는 방식이라 버튼들이 한 줄로 흐르는 화면과 다르다.",
    "강의 AWT 배치관리자에서 FlowLayout은 컴포넌트를 한 줄 흐름으로 배치하므로 버튼 5개가 나란히 놓이는 코드와 맞다.",
    "BorderLayout은 동서남북중앙 영역 배치라 여러 버튼을 add한 순서대로 한 줄에 놓는 기본 화면을 설명하지 않는다.",
    "ButtonAreaLayout은 강의에서 다룬 표준 AWT 배치관리자 이름이 아니다.",
  ],
  "2019-58": [
    "addWindowListener는 윈도우 닫기 같은 WindowEvent 등록 메소드이며 버튼의 ActionEvent 등록에 쓰이지 않는다.",
    "new MyFrame()은 원문 코드에 정의된 ActionListener 구현 객체가 아니며 버튼 b1의 action 이벤트 등록 인자도 아니다.",
    "addActionListener()는 버튼 액션 리스너 등록 메소드 이름이지만 리스너 객체 인자가 빠져 있다.",
    "b1.addActionListener(new MyListener())처럼 ActionListener를 구현한 MyListener 객체를 버튼 이벤트 소스에 등록해야 한다.",
  ],
  "2019-59": [
    "prepare는 Connection에서 PreparedStatement를 만드는 JDBC 표준 메소드명이 아니다.",
    "create는 일반 객체 생성처럼 보이는 이름이며 강의 14강의 Connection API에서 매개변수 SQL 준비 메소드로 쓰이지 않는다.",
    "강의 14강에서 매개변수 표시 ?가 있는 SQL은 conn.prepareStatement(query)로 PreparedStatement 객체를 만든다.",
    "createStatement는 일반 Statement를 만들 때 쓰며 매개변수 SQL을 표현하는 PreparedStatement 생성 메소드가 아니다.",
  ],
  "2019-60": [
    "getResultSet은 이미 실행된 결과 집합을 얻는 성격의 메소드이지 INSERT PreparedStatement를 실행하는 메소드가 아니다.",
    "execute는 SQL을 실행할 수 있지만 반환이 boolean이라 삽입된 행 수를 resultCount에 담는 이 코드 흐름과 맞지 않는다.",
    "executeQuery는 SELECT처럼 ResultSet을 반환하는 질의에 쓰이며 insert 문 실행 결과 행 수를 반환하지 않는다.",
    "강의 14강에서 INSERT, UPDATE, DELETE 같은 변경 SQL은 executeUpdate()로 실행하고 변경된 행 수를 int로 받는다.",
  ],
};

function questionKey(spec: Pick<Spec, "year" | "number">) {
  return `${spec.year}-${spec.number}`;
}

const rawGeneric2017: JavaCodeBlock[] = [
  {
    title: "제네릭 타입과 Raw 타입 예제(41-42번 공통)",
    code: `import java.util.*;

class ArrayList<E> implements List<E> {
  boolean add(E e) { ... }
  E get(int index) { ... }
  E remove(int index) { ... }
  ...
}

public class GenericTest {
  public static void main(____ ㄱ ____) {
    List list1 = new ArrayList();
    list1.add("Hello");      // a
    String s1 = list1.get(0); // b

    List<String> list2 = new ArrayList<String>();
    list2.add("Java");       // c
    String s2 = list2.get(0); // d
    ...
  }
}`,
  },
];

const joinTest2017: JavaCodeBlock[] = [
  {
    title: "멀티 스레드 프로그램 예제(51-54번 공통)",
    code: `public class JoinTest {
  public static void main(...) ____ ㄱ ____ InterruptedException {
    Thread t1 = new MyThread1(); t1.start();
    Thread t2 = new MyThread1(); t2.start();

    ____ ㄴ ____
    System.out.println("main");
  }
}

class MyThread1 extends ____ ㄷ ____ {
  public void run() {
    for (int i = 0; i < 1000; i++) {
      System.out.println(getName());
      Thread.yield();
    }
  }
}`,
  },
];

const jdbc2017: JavaCodeBlock[] = [
  {
    title: "JDBC 프로그래밍 예제(59-60번 공통)",
    code: `____ ㄱ ____ conn = null;  ____ ㄴ ____ stmt = null;  ____ ㄷ ____ rs = null;
try {
  String url = "jdbc:mysql://localhost/test";
  String user = "사용자";
  String pass = "비밀번호";
  conn = DriverManager.getConnection(url, user, pass);
  stmt = conn.createStatement();
  rs = stmt.____ ㄹ ____("SELECT * FROM book");
  System.out.println("제목\\t저자\\t가격");
  while (rs.next()) {
    System.out.print(rs.getString("title") + "\\t");
    System.out.print(rs.getString("author") + "\\t");
    System.out.println(rs.getInt("price") + "\\t");
  }
  ...
}`,
  },
];

const anonymous2018: JavaCodeBlock[] = [
  {
    title: "AnonymousTest.java 프로그램 조각(41-42번 공통)",
    code: `class CSuper {
  public int a = 10;
  public void method1() { System.out.println("super1"); }
  public void method2() { System.out.println("super2"); }
}

public class AnonymousTest {
  public static void main(String args[]) {
    CSuper sub = new CSuper() {
      public int b = 20;
      public void method1() { System.out.println("sub1"); }
      public void method3() { System.out.println("sub3"); }
    };
    // ...
  }
}`,
  },
];

const overriding2018: JavaCodeBlock[] = [
  {
    title: "부모 클래스 메소드와 재정의 후보(40번)",
    code: `부모 클래스 메소드
protected double compute(int x, int y)

재정의 후보
a. protected double compute(int x, int y)
b. public double compute(int x, int y)
c. protected int compute(int x, int y)
d. private double compute(int x, int y, int z)`,
  },
];

const nio2018: JavaCodeBlock[] = [
  {
    title: "java.nio 파일 쓰기 프로그램 조각(48번)",
    code: `String data[];
FileChannel fileChannel;
...
Charset charset = Charset.defaultCharset();
ByteBuffer buffer;
int byteCount = 0;
for (int i = 0; i < data.length; i++) {
  buffer = charset.encode(data[i]);
  byteCount = fileChannel.write(buffer);
}
...`,
  },
];

const thread2018: JavaCodeBlock[] = [
  {
    title: "멀티 스레드 프로그램(51-53번 공통)",
    code: `class MyThread implements Runnable {
  public void run() {
    for (int i = 0; i < 10; i++) {
      System.out.print(Thread.currentThread().getName() + " ");
      Thread.yield(); // 51번
    }
  }
}

public class JoinTest {
  public static void main(String args[]) ____ ____ {
    Thread my_thread1 = new Thread(new MyThread(), "thd1");
    Thread my_thread2 = new Thread(new MyThread(), "thd2");
    my_thread1.start();   my_thread2.start();
    my_thread1.join();    my_thread2.join(); // 52번
    System.out.println("finished");
  }
}`,
  },
];

const windowEvent2018: JavaCodeBlock[] = [
  {
    title: "윈도우 이벤트 프로그램(57-58번 공통)",
    code: `import java.awt.*;
import java.awt.event.*;

class MyListener ____ ㄱ ____ {
  public void windowClosing(WindowEvent ev) {
    System.exit(0);
  }
}

class MyFrame extends Frame {
  public MyFrame(String title) {
    super(title);
    this.setSize(400, 300);
    this.setVisible(true);
    this.____ ㄴ ____; // 이벤트 리스너 등록
  }
  public void paint(Graphics g) {
    g.drawString("Hello AWT", 150, 150);
  }
}

public class WindowEventTest2 {
  public static void main(String args[]) {
    MyFrame myFrame = new MyFrame("Hello AWT");
  }
}`,
  },
];

const jdbc2018: JavaCodeBlock[] = [
  {
    title: "JDBC 초기 작업 예제(59-60번 공통)",
    code: `import java.sql.*;

public class JDBCTest {
  public static void main(String[] args) {
    Connection conn = null;  Statement stmt = null;
    ResultSet rs = null;
    try {
      conn = DriverManager.getConnection("jdbc:mysql://localhost/my_db", "root", "admin");
      stmt = conn.createStatement();
      rs = stmt.executeQuery("SELECT * FROM book");
      ...
    }
  }
}`,
  },
];

const interface2019: JavaCodeBlock[] = [
  {
    title: "default 메소드를 가진 인터페이스(37번)",
    code: `public interface Test {
  ____ void aMethod(String aValue) {
    System.out.println("Hi" + aValue);
  }
}`,
  },
];

const employee2019: JavaCodeBlock[] = [
  {
    title: "Employee 상속 프로그램(38-39번 공통)",
    code: `class Employee {
  int nSalary;
  String szDept;
  public void doJob() { System.out.println("do something"); }
}

class Salesman ____ Employee {
  public Salesman() { szDept = "Sales. Dept"; }
  public void doJob() { System.out.println("do sales"); }
}

class Developer ____ Employee {
  public Developer() { szDept = "Dev. Dept"; }
  public void doJob() { System.out.println("do development"); }
}

public class EmployeeTest {
  public static void main(String args[]) {
    Employee emp1, emp2;
    emp1 = new Salesman();
    emp2 = new Developer();
    emp1.doJob();
    emp2.doJob();
  }
}`,
  },
];

const stringTest2019: JavaCodeBlock[] = [
  {
    title: "문자열 반복 연결 프로그램(40-41번 공통)",
    code: `public class StringTest {
  public static void main(String args[]) {
    final String aValue = "abcde";
    String str = new String();

    for (int i = 0; i < 1000; i++)
      str = str + aValue;
    System.out.println(str);
  }
}`,
  },
];

const copyFile2019: JavaCodeBlock[] = [
  {
    title: "파일 복사 프로그램(42-43번 공통)",
    code: `public class CopyFile {
  public static void main(String args[]) {
    ____ ㄱ ____ in = null;
    ____ ㄴ ____ out = null;
    try {
      in = new ____ ㄱ ____("input.txt");
      out = new ____ ㄴ ____("output.txt");
      int c;
      while ((c = in.read()) != -1) {
        out.write(c);
      }
      in.close();
      out.close();
    } ____ ㄷ ____ {
      System.out.println(e);
    }
  }
}`,
  },
];

const arrayList2019: JavaCodeBlock[] = [
  {
    title: "ArrayList 사용 예제(45-47번 공통)",
    code: `import java.util.*;

public class ArrayListTest {
  public static void main(String args[]) {
    ____ ㄱ ____
    list.add("one");   list.add("three");
    list.add("two");   list.add(1, "one"); // 삽입

    ____ ㄴ ____
  }
}`,
  },
];

const counter2019: JavaCodeBlock[] = [
  {
    title: "공유 자원 Counter 스레드 프로그램(49-53번 공통)",
    code: `class Counter {
  private int c = 0;
  public void increment() { c++; }
  public int getValue() { return c; }
}

class MyThread ____ ㄱ ____ Thread {
  Counter c;
  public MyThread(Counter c) { this.c = c; }
  public void run() {
    for (int i = 0; i < 10000; i++) c.increment();
  }
}

public class CounterTest {
  public static void main(String args[]) ____ ㄴ ____ Exception {
    Counter c = new Counter();
    Thread t1 = new MyThread(c); t1.start();
    Thread t2 = new MyThread(c); t2.start();
    ____ ㄷ ____
    System.out.println(c.getValue());
  }
}`,
  },
];

const button2019: JavaCodeBlock[] = [
  {
    title: "버튼 이벤트 프로그램(55-58번 공통)",
    code: `import java.awt.*;
import java.awt.event.*;

class MyListener ____ ㄱ ____ {
  public void actionPerformed(ActionEvent ev) {
    System.out.println(ev.getActionCommand());
  }
}

public class ButtonTest extends Frame {
  public ButtonTest(String title) {
    super(title);
    setLayout(new ____ ㄴ ____());
    Button b1 = new Button("버튼1"); add(b1);
    Button b2 = new Button("버튼2"); add(b2);
    Button b3 = new Button("버튼3"); add(b3);
    Button b4 = new Button("버튼4"); add(b4);
    Button b5 = new Button("버튼5"); add(b5);
    b1.____ ㄷ ____;
    this.setSize(400, 100);
    setVisible(true);
  }
  public static void main(String args[]) {
    new ButtonTest("Test Program");
  }
}`,
  },
];

const jdbc2019: JavaCodeBlock[] = [
  {
    title: "JDBC PreparedStatement 예제(59-60번 공통)",
    code: `import java.sql.*;

public class JDBCTest {
  public static void main(String[] args) {
    Connection conn = null;
    PreparedStatement ps = null;
    int resultCount = 0;
    try {
      // DB와 연결 정보 생략
      conn = DriverManager.getConnection(url, user, pass);
      String query = "insert into book values(?, ?, ?)";
      ps = conn.____ ㄱ ____(query);
      ps.setString(1, "삼국지");
      ps.setString(2, "나관중");
      ps.setInt(3, 500);
      resultCount = ps.____ ㄴ ____();
    } catch (Exception ex) {
      // 이하 생략
    }
  }
}`,
  },
];

const checkboxLayout2017: JavaCodeBlock[] = [
  {
    title: "실행 결과 화면 설명(56번)",
    code: `창 제목: Checkbox
한 행에 다음 컨트롤이 왼쪽에서 오른쪽으로 배치됨
[ ] Whiskey   [ ] Beer   ( ) Yes   ( ) No

문항은 컨트롤이 한 줄 흐름으로 놓인 실행 결과를 보고 배치관리자를 판별한다.`,
  },
];

const awtList2018: JavaCodeBlock[] = [
  {
    title: "AWT 컨트롤 화면(54-55번 공통)",
    code: `창 제목: Test
목록 항목:
  Red
  Green
  Blue   <- 선택됨
  Yello
오른쪽에 세로 스크롤바가 있는 목록 컨트롤이다.

문항은 이 컨트롤의 클래스와 항목 선택/더블클릭 이벤트를 묻는다.`,
  },
];

const layout2018: JavaCodeBlock[] = [
  {
    title: "배치관리자 실행 화면(56번)",
    code: `창 제목: Layout
2행 x 3열처럼 일정한 격자에 컨트롤이 배치됨

1행: [button1] [textarea] [Welcome]
2행: [button2] [Whiskey] [Red 선택 콤보]

문항은 같은 크기의 격자 칸에 컴포넌트를 배치한 화면을 보고 배치관리자를 판별한다.`,
  },
];

const awtList2019: JavaCodeBlock[] = [
  {
    title: "AWT 컨트롤 화면(54번)",
    code: `창 제목: Test
목록 항목:
  Red
  Green
  Blue
  Yello
오른쪽에 세로 스크롤바가 있는 리스트박스 형태이다.

문항은 이 컨트롤에 대한 설명 중 잘못된 것을 고른다.`,
  },
];

function makeQuestion(spec: Spec): JavaPastExamQuestion {
  const concept = lectureConcept[spec.lectureId];
  const explanationSet = choiceExplanationsByQuestion[questionKey(spec)];
  const correctReason = explanationSet?.[Number(spec.correct) - 1];

  if (!explanationSet) {
    throw new Error(`Missing Java past exam explanations for ${questionKey(spec)}`);
  }

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
          reason: explanationSet[index],
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
    answerExplanation: correctReason,
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
  { year: 2017, number: 41, lectureId: 6, tag: "main 메소드", prompt: "main 함수의 정의를 위해 밑줄 친 ㄱ에 들어가야 할 내용은 무엇인가?", codeBlocks: rawGeneric2017, choices: ["Char[] args", "String args", "String[] args", "String[] args[]"], correct: "3" },
  { year: 2017, number: 42, lectureId: 6, tag: "제네릭", prompt: "명시적 형변환을 하지 않아서 컴파일 오류를 일으키는 문장은 무엇인가?", codeBlocks: [{ title: "Raw 타입과 제네릭 타입", code: "List list1 = new ArrayList();\nlist1.add(\"Hello\");      // a\nString s1 = list1.get(0); // b\n\nList<String> list2 = new ArrayList<String>();\nlist2.add(\"Java\");       // c\nString s2 = list2.get(0); // d" }], choices: ["a", "b", "c", "d"], correct: "2" },
  { year: 2017, number: 43, lectureId: 7, tag: "try-catch-finally", prompt: "try-catch-finally 구문의 실행에 관한 설명이다. 잘못된 것은?", choices: ["try 블록 실행 중 예외가 발생하면 try 블록은 즉시 종료된다.", "try 블록 실행 중 예외가 발생하지 않으면 어떤 catch 블록도 실행되지 않는다.", "finally 블록은 가장 마지막에 항상 실행된다.", "예외처리 코드를 작성할 때 finally 블록을 생략해서는 안 된다."], correct: "4" },
  { year: 2017, number: 44, lectureId: 8, tag: "String", prompt: "String 클래스에 관한 설명으로 잘못된 것은?", choices: ["java.lang 패키지에 존재하며 문자열을 표현하는 클래스이다.", "문자열의 비교, 검색, 추출 등을 위한 메소드를 제공한다.", "객체 생성 이후 문자열을 수정할 수 없는 immutable 클래스이다.", "문자열을 빈번하게 변경하는 프로그램에서 사용하면 실행 효율이 좋아진다."], correct: "4" },
  { year: 2017, number: 45, lectureId: 8, tag: "박싱", prompt: "기본형 데이터 값을 포장 클래스의 객체로 변환하는 것을 박싱이라고 한다. 다음 중 박싱이 발생하는 것은?", choices: ["String s = Integer.toString(23);", "int n = Integer.parseInt(\"34\");", "Integer i = new Integer(10);", "String s = String.valueOf(34);"], correct: "3" },
  { year: 2017, number: 46, lectureId: 9, tag: "입출력 스트림", prompt: "텍스트 파일을 다루기 위한 기본 스트림 중 하나로서 문자 단위로 파일에 출력할 때 사용해야 하는 클래스는 무엇인가?", choices: ["FileInputStream", "FileWriter", "BufferedReader", "PrintWriter"], correct: "2" },
  { year: 2017, number: 47, lectureId: 10, tag: "java.nio", prompt: "java.nio.file 패키지에 있는 Path 인터페이스에 관한 설명이다. 잘못된 것은?", choices: ["java.io.File 클래스를 대체할 수 있다.", "파일시스템에 존재하는 파일이나 디렉터리의 경로를 표현한다.", "경로의 생성, 조작/비교, 경로 요소 조회 기능을 제공한다.", "파일 내용의 읽기와 쓰기 기능을 제공한다."], correct: "4" },
  { year: 2017, number: 48, lectureId: 12, tag: "for-each", prompt: "for-each 구문을 사용하여 컬렉션 객체에 저장된 원소를 차례로 하나씩 다룬다고 할 때 밑줄 부분에 들어갈 내용으로 적합한 것은?", codeBlocks: [{ title: "for-each 문맥", code: "List<String> list = new ArrayList<String>();\nfor ( ________ ) {\n  System.out.println(element);\n}" }], choices: ["list : String element", "String element : list", "int element : list", "int i=0; i<=list.length; i++"], correct: "2" },
  { year: 2017, number: 49, lectureId: 11, tag: "컬렉션", prompt: "컬렉션 중 하나인 ArrayList 클래스에 관한 설명으로 적당하지 않은 것은?", choices: ["List 인터페이스를 구현한 클래스이다.", "여러 원소를 저장하기 위해 배열을 사용한다.", "원소의 순서가 의미를 가진다.", "같은 자료를 중복으로 저장할 수 없다."], correct: "4" },
  { year: 2017, number: 50, lectureId: 11, tag: "컬렉션", prompt: "Map 인터페이스에 관한 설명이다. 잘못된 것은?", choices: ["Map은 컬렉션을 다루기 위한 인터페이스이다.", "Map 유형의 컬렉션에서 원소의 형태는 (key, value)이다.", "LinkedList는 해싱을 이용하여 Map을 구현한 클래스이다.", "컬렉션에 원소를 저장할 때 put(), 조회할 때 get() 메소드를 사용한다."], correct: "3" },
  { year: 2017, number: 51, lectureId: 7, tag: "try-catch-finally", prompt: "예외의 전파를 위해 밑줄 친 ㄱ에 들어가야 할 키워드는 무엇인가?", codeBlocks: joinTest2017, choices: ["throw", "throws", "synchronize", "interrupt"], correct: "2" },
  { year: 2017, number: 52, lectureId: 13, tag: "스레드", prompt: "두 스레드 t1과 t2가 종료될 때까지 main 스레드가 기다리기 위해 밑줄 친 ㄴ에 들어가야 할 문장은 무엇인가?", codeBlocks: joinTest2017, choices: ["Thread.sleep();", "Thread.sleep(t1); Thread.sleep(t2);", "t1.sleep(); t2.sleep();", "t1.join(); t2.join();"], correct: "4" },
  { year: 2017, number: 53, lectureId: 13, tag: "스레드", prompt: "스레드 생성을 위해 MyThread1 클래스를 정의하였다. 밑줄 친 ㄷ에 들어갈 단어는 무엇일까?", codeBlocks: joinTest2017, choices: ["Object", "Thread", "Process", "Runnable"], correct: "2" },
  { year: 2017, number: 54, lectureId: 13, tag: "스레드", prompt: "run() 메소드는 Thread.yield()를 실행한다. 이것의 의미를 정확히 설명한 것은?", codeBlocks: joinTest2017, choices: ["현재 스레드의 우선 순위를 변경시킨다.", "실행을 잠시 멈추고 다른 스레드에게 CPU를 양보한다.", "공유 자원에 배타적으로 접근할 수 있게 요청한다.", "중단되었던 다른 스레드를 깨워 실행가능 상태로 만든다."], correct: "2" },
  { year: 2017, number: 55, lectureId: 15, tag: "AWT 이벤트", prompt: "GUI 컴포넌트의 클래스 계층 구조에서 Container 클래스의 자식 클래스가 아닌 것은?", choices: ["Frame", "Panel", "Window", "List"], correct: "4" },
  { year: 2017, number: 56, lectureId: 15, tag: "AWT 이벤트", prompt: "Checkbox와 버튼들이 한 행 흐름으로 배치된 결과를 보고 판단할 때, 프로그램에서 사용된 배치관리자는 무엇이라 생각되는가?", codeBlocks: checkboxLayout2017, choices: ["GridLayout", "FlowLayout", "BorderLayout", "SpringLayout"], correct: "2" },
  { year: 2017, number: 57, lectureId: 15, tag: "AWT 이벤트", prompt: "이벤트 처리에 관한 설명이다. 잘못된 것은 무엇인가?", choices: ["이벤트 처리를 위해선 이벤트 소스에 리스너 객체를 등록해야 한다.", "하나의 이벤트 소스에는 하나의 이벤트 처리만 등록할 수 있다.", "이벤트 클래스에 대응되는 리스너 인터페이스가 존재한다.", "2개 이상의 추상 메소드를 가지는 리스너 인터페이스를 위해 어댑터 클래스가 존재한다."], correct: "2" },
  { year: 2017, number: 58, lectureId: 15, tag: "AWT 이벤트", prompt: "버튼 컴포넌트 aButton에 ActionEvent를 등록하는 문장이다. 클래스 A에서 구현해야 하는 인터페이스는 무엇인가?", codeBlocks: [{ title: "이벤트 등록", code: "aButton.addActionListener(new A());" }], choices: ["Action", "ActionEvent", "ActionAdapter", "ActionListener"], correct: "4" },
  { year: 2017, number: 59, lectureId: 14, tag: "JDBC", prompt: "JDBC 예제에서 밑줄 친 ㄱ, ㄴ, ㄷ에 들어갈 단어를 순서대로 정확하게 나열한 것은?", codeBlocks: jdbc2017, choices: ["Connection / Statement / ResultSet", "Connection / PreparedStatement / ResultSet", "ConnectionEvent / Statement / ResultStore", "ConnectionPool / PreparedStatement / ResultStore"], correct: "1" },
  { year: 2017, number: 60, lectureId: 14, tag: "JDBC", prompt: "JDBC 예제에서 SELECT 질의를 실행하는 밑줄 친 ㄹ에 들어갈 메소드의 이름은 무엇인가?", codeBlocks: jdbc2017, choices: ["execute", "executeQuery", "executeUpdate", "executeSql"], correct: "2" },

  { year: 2018, number: 36, lectureId: 1, tag: "Java 플랫폼", prompt: "Java 프로그램을 실습하기 위해 필요한 것이 아닌 것은?", choices: ["Java Platform", "Java VM", "JDK", "Eclipse for JavaScript"], correct: "4" },
  { year: 2018, number: 37, lectureId: 3, tag: "배열", prompt: "배열을 사용하는 다음 문장 중 잘못된 것은?", choices: ["int[] a = new int[10];", "int b[] = { 1, 2, 3, 4 };", "int[] c; c = {1, 2, 3, 4};", "int[][] d = new int[10][];"], correct: "3" },
  { year: 2018, number: 38, lectureId: 2, tag: "출력문", prompt: "int형 변수 i와 j 값을 각각 출력하기 위해 적당한 출력문은 무엇인가?", choices: ["System.out.println(i + j);", "System.out.println(i + \",\" + j);", "System.out.println(i, j);", "System.out.println(i, \",=\", j);"], correct: "2" },
  { year: 2018, number: 39, lectureId: 5, tag: "상속·구현", prompt: "B와 C가 클래스이고 Y와 Z가 인터페이스라고 가정할 때, 다음 중 올바른 것을 모두 고른 것은?", codeBlocks: [{ title: "상속과 구현 후보", code: "class A extends B, C { }      // a\nclass A extends B, Y { }      // b\nclass A implements Y, Z { }   // c\ninterface X extends Y, Z { }  // d" }], choices: ["a, b", "a, d", "c", "c, d"], correct: "4" },
  { year: 2018, number: 40, lectureId: 4, tag: "오버라이딩", prompt: "부모 클래스의 protected double compute(int x, int y)를 서브 클래스에서 재정의하기 위한 메소드 형식으로 적합한 것을 모두 고른 것은?", codeBlocks: overriding2018, choices: ["a", "a, b", "a, b, c", "c, d"], correct: "2" },
  { year: 2018, number: 41, lectureId: 5, tag: "익명 클래스", prompt: "프로그램 조각에서 굵게 표시된 객체 생성 구문의 의미를 바르게 설명한 것은?", codeBlocks: anonymous2018, choices: ["CSuper 클래스를 정의하며 동시에 객체를 생성한다.", "CSuper 인터페이스를 구현하는 익명 클래스를 정의하며 동시에 객체를 생성한다.", "CSuper 클래스를 상속받는 익명 클래스를 정의하며 동시에 객체를 생성한다.", "CSuper 클래스를 매개변수화하였으며 객체 생성 시 자료형을 제공한다."], correct: "3" },
  { year: 2018, number: 42, lectureId: 5, tag: "익명 클래스", prompt: "AnonymousTest.java를 컴파일하면 몇 개의 class 파일이 생성되는가?", codeBlocks: anonymous2018, choices: ["1개", "2개", "3개", "4개"], correct: "3" },
  { year: 2018, number: 43, lectureId: 5, tag: "추상 클래스와 인터페이스", prompt: "추상 클래스 또는 인터페이스에 관한 일반적 설명이다. 잘못된 것은?", choices: ["의미적으로 유사한 클래스를 묶고자 할 때 추상 클래스를 사용한다.", "인터페이스와 다르게 추상 클래스는 인스턴스를 생성시킬 수 있다.", "인터페이스는 public static final인 데이터 필드만 포함할 수 있다.", "추상 클래스나 인터페이스는 자식 클래스로 상속되어 사용된다."], correct: "2" },
  { year: 2018, number: 44, lectureId: 6, tag: "제네릭", prompt: "Data가 제네릭 클래스일 때 `Data<int> d = new Data<>();` 문장의 문제점을 바르게 설명한 것은?", choices: ["제네릭 클래스의 타입 매개변수로 기본 자료형을 사용할 수 없다.", "대입 연산자 우측의 <>를 <int>로 바꾸어야 한다.", "Raw 타입을 사용하는 경우 타입 매개변수는 Object이어야 한다.", "문제가 없다."], correct: "1" },
  { year: 2018, number: 45, lectureId: 8, tag: "String", prompt: "보기의 내용이 밑줄 부분에 들어간다고 할 때 결과가 다른 하나는 무엇인가?", codeBlocks: [{ title: "String 비교 문맥", code: "String str1 = new String(\"Java\");\nString str2 = str1;\nString str3 = new String(\"Java\");\nSystem.out.println( ________ );" }], choices: ["str1==str2", "str2==str3", "str1.equals(str2)", "str2.equals(str3)"], correct: "2" },
  { year: 2018, number: 46, lectureId: 8, tag: "String", prompt: "String과 StringBuffer 클래스에 관한 설명이다. 잘못된 것은?", choices: ["String 클래스는 문자열의 비교, 검색, 추출 메소드를 제공한다.", "문자열을 빈번하게 변경하는 프로그램에서는 String 클래스를 사용하는 것이 좋다.", "StringBuffer 클래스는 문자열의 삽입, 삭제, 대체 메소드를 제공한다.", "StringBuffer 객체는 내부적으로 문자열 저장을 위한 버퍼를 가진다."], correct: "2" },
  { year: 2018, number: 47, lectureId: 9, tag: "입출력 스트림", prompt: "파일을 데이터 소스로 하여 바이트 단위 입력을 수행할 때 필요한 클래스는 무엇인가?", choices: ["FileReader", "FileInputStream", "File", "Path"], correct: "2" },
  { year: 2018, number: 48, lectureId: 10, tag: "java.nio", prompt: "프로그램 조각에서 명시적으로 나타나 있지 않은 내용은 무엇인가?", codeBlocks: nio2018, choices: ["charset에 지정된 문자 세트로 문자열을 인코딩한다.", "인코딩된 문자열을 buffer에 저장한다.", "buffer에 저장된 데이터를 파일에 기록한다.", "파일에 있는 데이터를 읽어 buffer에 기록한다."], correct: "4" },
  { year: 2018, number: 49, lectureId: 11, tag: "컬렉션", prompt: "자료의 순서는 의미가 없고 자료 중복을 허용하지 않는 자료를 관리하기 위한 컬렉션 인터페이스는 무엇인가?", choices: ["Set", "List", "Queue", "Map"], correct: "1" },
  { year: 2018, number: 50, lectureId: 11, tag: "컬렉션", prompt: "컬렉션 인터페이스 또는 클래스의 사용 예를 보여주는 보기 중 잘못된 것은 무엇인가?", choices: ["Set<Integer> set = new HashSet<>();", "List<Integer> set = new ArrayList<Integer>();", "Queue<Integer> set = new LinkedList<>();", "Map<String> set = new HashMap<>();"], correct: "4" },
  { year: 2018, number: 51, lectureId: 13, tag: "스레드", prompt: "Thread.yield()의 기능을 바르게 설명한 것은?", codeBlocks: thread2018, choices: ["현재 스레드의 우선 순위를 낮추어 이름을 교대로 출력시킨다.", "현재 스레드가 잠시 CPU를 양보함으로써 이름을 교대로 출력시킨다.", "한 스레드가 이름을 10회 모두 출력시킨 후 다음 스레드가 이름을 출력하게 한다.", "문자열 finished를 가장 마지막에 출력시킨다."], correct: "2" },
  { year: 2018, number: 52, lectureId: 13, tag: "스레드", prompt: "mythread1.join()과 mythread2.join()의 기능을 바르게 설명한 것은?", codeBlocks: thread2018, choices: ["중단되었던 메인 스레드를 깨워 finished를 가장 처음에 출력시킨다.", "두 스레드가 자발적으로 CPU를 양보함으로써 finished를 마지막에 출력시킨다.", "두 스레드가 종료될 때까지 기다린 후 메인 스레드가 finished를 마지막에 출력시킨다.", "두 스레드가 공유하는 자원에 배타적 접근을 보장한다."], correct: "3" },
  { year: 2018, number: 53, lectureId: 7, tag: "try-catch-finally", prompt: "예외의 전파를 위해 밑줄 친 부분에 들어가야 할 내용으로 적당한 것은?", codeBlocks: thread2018, choices: ["throws", "extends", "throws ArithmeticException", "throws InterruptedException"], correct: "4" },
  { year: 2018, number: 54, lectureId: 15, tag: "AWT 이벤트", prompt: "그림이 보여주는 AWT 컨트롤 클래스는 무엇인가?", codeBlocks: awtList2018, choices: ["Button", "Canvas", "Choices", "List"], correct: "4" },
  { year: 2018, number: 55, lectureId: 15, tag: "AWT 이벤트", prompt: "그림의 항목을 마우스로 선택할 때와 더블 클릭할 때 발생하는 이벤트는 각각 무엇인가?", codeBlocks: awtList2018, choices: ["ActionEvent / ItemEvent", "ItemEvent / ActionEvent", "KeyEvent / ActionEvent", "ItemEvent / WindowEvent"], correct: "2" },
  { year: 2018, number: 56, lectureId: 15, tag: "AWT 이벤트", prompt: "프로그램 결과 화면을 보고 판단할 때 사용된 배치관리자는 무엇이라 생각되는가?", codeBlocks: layout2018, choices: ["GridLayout", "FlowLayout", "BorderLayout", "ButtonAreaLayout"], correct: "1" },
  { year: 2018, number: 57, lectureId: 15, tag: "AWT 이벤트", prompt: "프레임 윈도우의 닫기 버튼을 눌렀을 때 윈도우를 종료시키려면 먼저 WindowListener 인터페이스를 구현하는 클래스가 필요하다. 밑줄 친 ㄱ에 들어갈 내용은?", codeBlocks: windowEvent2018, choices: ["implements WindowListener", "implements WindowAdapter", "extends WindowListener", "extends WindowAdapter"], correct: "4" },
  { year: 2018, number: 58, lectureId: 15, tag: "AWT 이벤트", prompt: "이벤트 등록을 위해 밑줄 친 ㄴ에 들어갈 내용은?", codeBlocks: windowEvent2018, choices: ["addWindowListener(new MyListener())", "addWindowListener(new MyFrame())", "addWindowAdapter(new MyListener())", "addWindowAdapter(new MyFrame())"], correct: "1" },
  { year: 2018, number: 59, lectureId: 14, tag: "JDBC", prompt: "JDBC 예제에서 굵은 글씨로 나타난 3개 문장의 의미를 순서대로 설명한 것은?", codeBlocks: jdbc2018, choices: ["Connection 객체 생성, Statement 객체 생성, DBMS와 연결", "DBMS와 연결, SQL 질의 실행, SQL 결과 처리", "DBMS와 연결, Statement 객체 생성, SQL 질의 실행", "DBMS와 연결 종료, Statement 객체 생성, SQL 질의 실행"], correct: "3" },
  { year: 2018, number: 60, lectureId: 14, tag: "JDBC", prompt: "executeQuery()는 질의 결과 테이블을 리턴한다. 리턴되는 객체의 유형은 무엇인가?", codeBlocks: jdbc2018, choices: ["ResultSet", "ResultTable", "Statement", "StatementTable"], correct: "1" },

  { year: 2019, number: 36, lectureId: 3, tag: "배열", prompt: "배열을 사용하는 다음 문장 중 올바른 것은?", choices: ["int[] a = new int[10];", "int b[] = { {1, 2, 3}, {4, 5} };", "int[] c; c = {1, 2, 3, 4};", "int[][] d = new int[10];"], correct: "1" },
  { year: 2019, number: 37, lectureId: 5, tag: "추상 클래스와 인터페이스", prompt: "인터페이스에서 기본 몸체를 가지는 메소드를 볼 수 있다. 밑줄 부분에 들어갈 키워드는 무엇인가?", codeBlocks: interface2019, choices: ["public", "final", "abstract", "default"], correct: "4" },
  { year: 2019, number: 38, lectureId: 5, tag: "상속·구현", prompt: "Employee, Salesman, Developer 프로그램에 관한 설명으로 잘못된 것은?", codeBlocks: employee2019, choices: ["클래스 간의 상속 관계가 존재한다.", "Employee 클래스를 이용하여 자식 클래스를 정의하였다.", "부모 클래스가 추상 클래스로 정의되어 있다.", "부모 유형의 변수에 자식 객체가 대입되었다."], correct: "3" },
  { year: 2019, number: 39, lectureId: 5, tag: "상속·구현", prompt: "EmployeeTest 프로그램을 실행할 때 출력되는 결과는?", codeBlocks: employee2019, choices: ["do something / do something", "do sales / do something", "do something / do sales", "do sales / do development"], correct: "4" },
  { year: 2019, number: 40, lectureId: 8, tag: "String", prompt: "문자열 abcde를 1,000번 연결하는 프로그램에 등장하는 수식 중 결과가 String 유형이 아닌 것은?", codeBlocks: stringTest2019, choices: ["\"abcde\"", "new String()", "i < 1000", "str + aValue"], correct: "3" },
  { year: 2019, number: 41, lectureId: 8, tag: "String", prompt: "문자열 연결 프로그램에 관한 설명으로 잘못된 것은?", codeBlocks: stringTest2019, choices: ["컴파일 또는 실행 오류는 발생하지 않는다.", "for문을 수행할 때마다 새로운 String 객체가 생성된다.", "immutable 클래스인 String을 사용하여 메모리 낭비가 심하다.", "반복횟수가 커질수록 평균 실행 속도는 점점 빨라진다."], correct: "4" },
  { year: 2019, number: 42, lectureId: 9, tag: "입출력 스트림", prompt: "파일로부터 2바이트 문자 단위로 데이터를 읽은 후 파일에 출력할 때, 밑줄 ㄱ과 ㄴ에 들어갈 입출력 스트림 클래스는 순서대로 무엇인가?", codeBlocks: copyFile2019, choices: ["FileInputStream / FileOutputStream", "FileOutputStream / FileInputStream", "FileReader / FileWriter", "FileWriter / FileReader"], correct: "3" },
  { year: 2019, number: 43, lectureId: 7, tag: "try-catch-finally", prompt: "예외처리를 위해 밑줄 친 ㄷ에 들어갈 적당한 내용은?", codeBlocks: copyFile2019, choices: ["catch(java.io.IOException)", "catch(java.io.IOException e)", "catch(java.io.IOException ex)", "finally"], correct: "2" },
  { year: 2019, number: 44, lectureId: 10, tag: "java.nio", prompt: "java.nio.file에 존재하며 java.io.File을 대신하고, 파일 또는 디렉터리 경로를 표현·조작하는 인터페이스 또는 클래스의 이름은 무엇인가?", choices: ["Buffer", "Path", "FileReader", "FileChannel"], correct: "2" },
  { year: 2019, number: 45, lectureId: 11, tag: "제네릭", prompt: "컬렉션 인터페이스나 클래스는 제네릭 타입으로 정의되어 있어 저장할 원소 타입을 지정하는 것이 좋다. 밑줄 ㄱ에 들어갈 선언으로 적당한 것은?", codeBlocks: arrayList2019, choices: ["List<> list = new ArrayList<>();", "List<Integer> list = new ArrayList<Integer>();", "List<String> list = new ArrayList<String>();", "ArrayList<String> list = new List<String>();"], correct: "3" },
  { year: 2019, number: 46, lectureId: 12, tag: "for-each", prompt: "for-each 구문을 사용하여 컬렉션에 저장된 원소를 순서대로 출력하려 한다. 밑줄 ㄴ에 들어갈 적당한 내용은 무엇인가?", codeBlocks: arrayList2019, choices: ["for (s : list) System.out.println(s);", "for (s : ArrayList list) System.out.println(s);", "for (String s : list) System.out.println(s);", "for (String s : ArrayList list) System.out.println(s);"], correct: "3" },
  { year: 2019, number: 47, lectureId: 11, tag: "컬렉션", prompt: "add는 리스트 끝에 원소를 추가하고 add(index, 원소)는 지정 위치에 추가한다. ArrayListTest의 출력 결과는 무엇인가?", codeBlocks: arrayList2019, choices: ["one / two / three", "one / one / three / two", "one / three / two / one", "결과를 예측할 수 없다"], correct: "2" },
  { year: 2019, number: 48, lectureId: 11, tag: "컬렉션", prompt: "HashMap 컬렉션 객체에 저장된 원소를 읽거나 원소를 추가할 때 사용되는 메소드는 각각 무엇인가?", choices: ["delete() / insert(원소)", "pop() / push(원소)", "remove(키) / add(키, 값)", "get(키) / put(키, 값)"], correct: "4" },
  { year: 2019, number: 49, lectureId: 13, tag: "스레드", prompt: "공유 자원을 사용하는 두 스레드 프로그램에서 공유 자원에 해당하는 것은 무엇인가?", codeBlocks: counter2019, choices: ["Account 객체", "Counter 객체", "increment() 메소드", "getValue() 메소드"], correct: "2" },
  { year: 2019, number: 50, lectureId: 13, tag: "스레드", prompt: "Thread의 서브 클래스를 정의하기 위해 밑줄 ㄱ에 들어갈 키워드는 무엇인가?", codeBlocks: counter2019, choices: ["Runnable", "SubClass", "extends", "implements"], correct: "3" },
  { year: 2019, number: 51, lectureId: 13, tag: "스레드", prompt: "공유 자원을 쓰는 스레드 간에 동기화가 필요하므로 increment() 메소드를 다시 정의해야 한다. 잘못된 것은?", codeBlocks: counter2019, choices: ["public void increment() { synchronized(this) { c++; } }", "synchronized public void increment() { c++; }", "public synchronized void increment() { c++; }", "public void synchronized increment() { c++; }"], correct: "4" },
  { year: 2019, number: 52, lectureId: 13, tag: "스레드", prompt: "모든 스레드 실행 종료 뒤 최종적으로 200000이 출력되는지 확인하려 한다. 밑줄 ㄷ에 들어갈 내용은 무엇인가?", codeBlocks: counter2019, choices: ["t1.join(); t2.join();", "t1.notify(); t2.notify();", "t1.sleep(); t2.sleep();", "Thread.yield();"], correct: "1" },
  { year: 2019, number: 53, lectureId: 7, tag: "try-catch-finally", prompt: "앞 문제에서 필요한 메소드를 호출하려면 예외처리 또는 예외 전파가 필요하다. 밑줄 ㄴ에 들어갈 키워드는 무엇인가?", codeBlocks: counter2019, choices: ["throw", "throws", "synchronize", "interrupt"], correct: "2" },
  { year: 2019, number: 54, lectureId: 15, tag: "AWT 이벤트", prompt: "그림이 보여주는 AWT 컨트롤에 관한 설명으로 잘못된 것은 무엇인가?", codeBlocks: awtList2019, choices: ["리스트박스라고도 하며 스크롤이 가능하다.", "목록에 있는 항목 중 다중 선택이 가능하다.", "항목을 선택하거나 더블클릭할 때 이벤트가 발생한다.", "항목을 불러올 때 사용하는 모달 대화상자이다."], correct: "4" },
  { year: 2019, number: 55, lectureId: 15, tag: "AWT 이벤트", prompt: "첫 번째와 두 번째 라인에 나오는 import 구문의 의미를 잘 설명한 것은?", codeBlocks: button2019, choices: ["아래 클래스 정의에서 다른 패키지의 클래스나 인터페이스를 사용하려는 것이다.", "두 개의 클래스 정의가 위치할 패키지를 결정하는 것이다.", "패키지 두 개를 새롭게 정의하는 것이다.", "기존 패키지를 상속받아 새로운 패키지를 정의하는 것이다."], correct: "1" },
  { year: 2019, number: 56, lectureId: 15, tag: "AWT 이벤트", prompt: "ActionEvent를 등록하려면 해당 이벤트의 리스너를 구현하는 클래스를 먼저 정의해야 한다. 밑줄 ㄱ에 들어갈 내용은?", codeBlocks: button2019, choices: ["implements ActionListener", "extends ActionListener", "implements ActionAdapter", "extends ActionAdapter"], correct: "1" },
  { year: 2019, number: 57, lectureId: 15, tag: "AWT 이벤트", prompt: "버튼들이 한 줄로 배치된 실행 결과를 보고 배치관리자를 의미하는 밑줄 ㄴ에 들어갈 내용은 무엇인가?", codeBlocks: button2019, choices: ["GridLayout", "FlowLayout", "BorderLayout", "ButtonAreaLayout"], correct: "2" },
  { year: 2019, number: 58, lectureId: 15, tag: "AWT 이벤트", prompt: "첫 번째 버튼 b1에 ActionEvent를 등록하려고 한다. 밑줄 ㄷ에 들어갈 적당한 내용은?", codeBlocks: button2019, choices: ["addWindowListener()", "addWindowListener(new MyFrame())", "addActionListener()", "addActionListener(new MyListener())"], correct: "4" },
  { year: 2019, number: 59, lectureId: 14, tag: "JDBC", prompt: "매개변수를 가지는 SQL 구문을 표현하는 객체를 생성하기 위해 밑줄 ㄱ에 들어갈 적당한 메소드는?", codeBlocks: jdbc2019, choices: ["prepare", "create", "prepareStatement", "createStatement"], correct: "3" },
  { year: 2019, number: 60, lectureId: 14, tag: "JDBC", prompt: "표현된 SQL 구문을 실행하기 위해 밑줄 ㄴ에 들어갈 적당한 메소드는?", codeBlocks: jdbc2019, choices: ["getResultSet", "execute", "executeQuery", "executeUpdate"], correct: "4" },
];

export const javaPastExamQuestions = specs.map(makeQuestion);
export const javaPastExamYears: JavaPastExamYear[] = [2019, 2018, 2017];
export const javaPastExamQuestionById = new Map(javaPastExamQuestions.map((question) => [question.id, question]));
