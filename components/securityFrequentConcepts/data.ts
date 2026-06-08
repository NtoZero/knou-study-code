export type SecurityFrequentConceptCategory =
  | "보안 목표"
  | "암호 기초"
  | "인증"
  | "공격 유형"
  | "서버·PC 보안"
  | "네트워크 보안"
  | "방화벽·VPN"
  | "IDS·IPS"
  | "이메일 보안"
  | "웹·무선 보안"
  | "디지털 포렌식";

export type SecurityFrequentConceptSpecial = "radix64" | "pgp" | "forensic";

export type SecurityFrequentConcept = {
  id: string;
  label: string;
  category: SecurityFrequentConceptCategory;
  lectureIds: number[];
  refs: string[];
  years: number[];
  frequency: number;
  sourceLabel: string;
  definition: string;
  examCue: string;
  surrounding: string[];
  variants: string[];
  special?: SecurityFrequentConceptSpecial;
  note?: string;
  visuals?: SecurityFrequentConceptVisual[];
};

export type SecurityFrequentConceptVisual = {
  src: string;
  alt: string;
  caption: string;
  sourceLabel: string;
  width: number;
  height: number;
};

type SecurityFrequentConceptInput = Omit<
  SecurityFrequentConcept,
  "years" | "frequency"
>;

export const securityFrequentConceptCategories: SecurityFrequentConceptCategory[] = [
  "보안 목표",
  "암호 기초",
  "인증",
  "공격 유형",
  "서버·PC 보안",
  "네트워크 보안",
  "방화벽·VPN",
  "IDS·IPS",
  "이메일 보안",
  "웹·무선 보안",
  "디지털 포렌식",
];

function visual(
  file: string,
  width: number,
  height: number,
  sourceLabel: string,
  caption: string,
): SecurityFrequentConceptVisual {
  return {
    src: `/security/frequent-concepts/figures/${file}`,
    alt: `${sourceLabel} 도식`,
    caption,
    sourceLabel,
    width,
    height,
  };
}

const securityConceptVisuals: Record<string, SecurityFrequentConceptVisual[]> = {
  "crypto-basic-terms": [
    visual(
      "encryption-decryption-loop.png",
      520,
      250,
      "교재 2장 암호화와 복호화",
      "암호화는 평문에서 암호문으로, 복호화는 암호문에서 평문으로 되돌리는 방향.",
    ),
  ],
  "public-key-crypto": [
    visual(
      "public-key-crypto-flow.png",
      720,
      240,
      "교재 2장 공개키 암호의 개념",
      "공개키로 암호화한 암호문은 대응하는 개인키로 복호화.",
    ),
  ],
  "server-intrusion-stages": [
    visual(
      "server-intrusion-stages.png",
      670,
      420,
      "교재 5장 서버 침입 및 정보유출 단계",
      "서버 침입은 정보획득, 권한획득, 공격, 재침입의 단계로 이어짐.",
    ),
  ],
  "ipsec-ah-esp": [
    visual(
      "ipsec-ah-format.png",
      580,
      400,
      "교재 6장 AH 형식과 위치",
      "AH는 IP 데이터그램의 무결성과 출처를 보장하지만 기밀성은 제공하지 않음.",
    ),
    visual(
      "ipsec-esp-format.png",
      590,
      290,
      "교재 6장 ESP 형식",
      "ESP는 페이로드를 보호해 기밀성을 제공하고 무결성·출처 확인과 함께 출제.",
    ),
  ],
  "firewall-configuration": [
    visual(
      "firewall-screening-router-bastion.png",
      780,
      510,
      "교재 7장 스크리닝 라우터와 베스천 호스트",
      "방화벽 구축 형태는 라우터, 베스천 호스트, 듀얼 홈, 스크린 호스트 위치로 구분.",
    ),
  ],
  "firewall-topologies": [
    visual(
      "firewall-screened-host-gateway.png",
      790,
      600,
      "교재 7장 듀얼 홈·스크린 호스트 게이트웨이",
      "스크린 호스트 게이트웨이는 스크리닝 라우터와 베스천 호스트를 조합.",
    ),
  ],
  "vpn-types": [
    visual(
      "vpn-implementation-types.png",
      670,
      510,
      "교재 7장 VPN 구현 형태",
      "VPN 구현 형태는 방화벽 기반, 라우터 기반, 전용 VPN, 소프트웨어 형태로 비교.",
    ),
  ],
  "ids-components": [
    visual(
      "ids-components.png",
      660,
      380,
      "교재 8장 IDS 구성요소",
      "IDS는 모니터링부, 분석 및 조치부, 관리부로 나뉘며 정보 수집·분석·통제를 담당.",
    ),
  ],
  "pgp-process": [
    visual(
      "pgp-auth-confidentiality.png",
      740,
      1100,
      "교재 9장 PGP 인증과 기밀성",
      "PGP는 해시, RSA, ZIP, 대칭키 암호를 조합해 인증과 기밀성을 제공.",
    ),
    visual(
      "pgp-message-format.png",
      570,
      380,
      "교재 9장 PGP 메시지 형식",
      "PGP 메시지는 세션키, 서명, 메시지 요소와 각각의 키 ID·타임스탬프를 포함.",
    ),
  ],
  "sql-injection": [
    visual(
      "sql-injection-impact.png",
      760,
      230,
      "교재 10장 SQL injection 공격 영향",
      "SQL injection은 웹 애플리케이션 입력이 데이터베이스 명령으로 섞이는 공격.",
    ),
  ],
  "xss": [
    visual(
      "reflected-xss-flow.png",
      540,
      360,
      "교재 10장 반사된 XSS",
      "반사형 XSS는 악성 스크립트를 포함한 URL 접근 후 웹 클라이언트에서 실행되는 흐름.",
    ),
  ],
  "forensic-procedure": [
    visual(
      "digital-forensic-procedure.png",
      660,
      270,
      "교재 11장 디지털 포렌식 절차",
      "사전준비, 증거수집, 포장 및 이송, 조사분석, 정밀검토, 보고서 작성 순서.",
    ),
  ],
};

const concepts: SecurityFrequentConceptInput[] = [
  {
    id: "information-protection",
    label: "정보보호 정의",
    category: "보안 목표",
    lectureIds: [1],
    refs: ["2019-36"],
    sourceLabel: "1강·교재 1장",
    definition:
      "정보를 여러 가지 위협으로부터 보호하기 위한 정책 및 기법이라는 정의와 컴퓨터 보안과의 포함관계를 함께 확인.",
    examCue: "전달 중인 정보만 보호한다거나 컴퓨터 보안보다 좁은 개념이라는 설명을 배제.",
    surrounding: ["저장·전달 중 정보", "허락되지 않은 접근·수정·훼손·유출"],
    variants: ["정보보호", "컴퓨터 보안", "정책 및 기법"],
  },
  {
    id: "cia-triad",
    label: "CIA triad",
    category: "보안 목표",
    lectureIds: [1, 6],
    refs: ["2017-36", "2017-37", "2018-36", "2018-37", "2018-38", "2019-37"],
    sourceLabel: "1강·6강 / 교재 1장·6장",
    definition:
      "기밀성은 허락되지 않은 자가 정보의 내용을 알 수 없도록 하는 것, 무결성은 허락되지 않은 자가 정보를 임의로 수정할 수 없도록 하는 것, 가용성은 허락된 자의 정보 접근이 방해받지 않도록 하는 것.",
    examCue: "사례 문장에서 내용 노출, 변조, 서비스 이용 방해 중 무엇이 직접 조건인지 먼저 분리.",
    surrounding: ["접근제어", "인증", "부인방지", "암호화와 기밀성"],
    variants: ["기밀성", "무결성", "가용성", "confidentiality", "integrity", "availability"],
  },
  {
    id: "non-repudiation-auth-access",
    label: "부인방지·인증·접근제어 경계",
    category: "보안 목표",
    lectureIds: [1],
    refs: ["2017-36", "2019-38"],
    sourceLabel: "1강·교재 1장",
    definition:
      "부인방지는 행위 부인을 막고, 인증은 실체의 진실성을 확인하며, 접근제어는 허락된 접근만 허용.",
    examCue: "핵심 CIA 목표와 보조 보안 서비스가 섞인 보기에서 포함 여부를 구분.",
    surrounding: ["발신 부인방지", "수신 부인방지", "사용자 인증", "권한 확인"],
    variants: ["부인방지", "인증", "접근제어", "non-repudiation", "authentication"],
  },
  {
    id: "crypto-basic-terms",
    label: "암호 기본 용어",
    category: "암호 기초",
    lectureIds: [2],
    refs: ["2017-38", "2018-38", "2019-39"],
    sourceLabel: "2강·교재 2장",
    definition:
      "평문은 변환되기 전인 원래의 메시지, 암호문은 제3자가 보더라도 내용을 알 수 없도록 변환된 메시지. 암호화는 평문에서 암호문으로, 복호화는 암호문에서 평문으로 가는 과정.",
    examCue: "평문/암호문과 암호화/복호화 방향을 뒤집은 선택지를 빠르게 배제.",
    surrounding: ["키", "암호 알고리즘", "기밀성", "복호화"],
    variants: ["평문", "암호문", "암호화", "복호화", "키", "plaintext", "ciphertext"],
  },
  {
    id: "transposition-substitution",
    label: "전치법·치환법",
    category: "암호 기초",
    lectureIds: [2],
    refs: ["2017-39", "2018-39", "2019-40"],
    sourceLabel: "2강·교재 2장",
    definition:
      "전치법은 문자 위치를 바꾸고, 치환법은 문자를 다른 문자로 바꾼다. 스파르타 봉은 전치, 시저·시프트는 치환.",
    examCue: "문자 순서 변화인지 문자 대응표 변화인지로 고전 암호 보기를 판별.",
    surrounding: ["스파르타 봉", "시저 암호", "시프트 암호", "비즈네르 암호"],
    variants: ["전치법", "치환법", "스파르타 봉", "시프트", "시저", "비즈네르"],
  },
  {
    id: "symmetric-crypto",
    label: "대칭키 암호와 알고리즘",
    category: "암호 기초",
    lectureIds: [2, 12],
    refs: ["2017-40", "2018-40", "2018-41", "2019-41"],
    sourceLabel: "2강·12강 / 교재 2장·12장",
    definition:
      "대칭키 암호는 암호화와 복호화에 같은 비밀키 하나를 쓰며 DES, IDEA, AES가 대표 알고리즘.",
    examCue: "RSA, ECC, ElGamal은 공개키 쪽으로 분류하고 AES/DES/IDEA는 대칭키로 분류.",
    surrounding: ["블록 암호", "스트림 암호", "DES", "AES", "IDEA"],
    variants: ["대칭키", "비밀키", "AES", "DES", "IDEA", "블록 암호", "스트림 암호"],
  },
  {
    id: "public-key-crypto",
    label: "공개키 암호와 키 쌍",
    category: "암호 기초",
    lectureIds: [2, 13],
    refs: ["2017-41", "2018-40", "2018-41", "2019-42"],
    sourceLabel: "2강·13강 / 교재 2장·13장",
    definition:
      "공개키 암호는 공개키와 개인키를 분리해 사용한다. 누구나 공개키로 암호화할 수 있고 개인키 소유자만 복호화.",
    examCue: "속도가 빠르다거나 같은 키 하나를 사용한다는 설명은 대칭키와 뒤바뀐 보기.",
    surrounding: ["RSA", "ECC", "ElGamal", "키 분배", "개인키"],
    variants: ["공개키", "개인키", "RSA", "ECC", "ElGamal", "키 쌍"],
  },
  {
    id: "message-authentication",
    label: "메시지 인증·MAC",
    category: "인증",
    lectureIds: [3, 14],
    refs: ["2017-42"],
    sourceLabel: "3강·14강 / 교재 3장·14장",
    definition:
      "메시지 인증은 전송 중 메시지가 정확하고 완전하게 수신되었는지 확인한다. HMAC은 해시 기반, CMAC은 블록 암호 기반.",
    examCue: "HMAC을 공개키 암호 기반이라고 설명하는 보기를 배제.",
    surrounding: ["HMAC", "CMAC", "해시함수", "무결성"],
    variants: ["메시지 인증", "MAC", "HMAC", "CMAC", "해시"],
  },
  {
    id: "user-authentication",
    label: "사용자 인증 방식",
    category: "인증",
    lectureIds: [3],
    refs: ["2017-43", "2018-42", "2019-43"],
    sourceLabel: "3강·교재 3장",
    definition:
      "사용자 인증은 지식 기반, 소유 기반, 생체 기반 요소를 이용한다. 비밀번호는 원문 대신 해시코드 저장으로 보호.",
    examCue: "지문·홍채·음성은 생체, 스마트카드는 토큰, 비밀번호 유출 대비 저장값은 해시코드.",
    surrounding: ["비밀번호", "토큰", "생체인식", "해시코드", "2단계 인증"],
    variants: ["사용자 인증", "비밀번호", "스마트카드", "생체인식", "해시코드", "토큰"],
  },
  {
    id: "malware-family",
    label: "악성코드 분류",
    category: "공격 유형",
    lectureIds: [4],
    refs: [
      "2015-36",
      "2015-37",
      "2016-36",
      "2016-37",
      "2017-44",
      "2017-45",
      "2018-43",
      "2018-44",
      "2019-44",
      "2019-45",
    ],
    sourceLabel: "4강·교재 4장",
    definition:
      "악성코드는 바이러스, 웜, 트로이 목마, 백도어, 스파이웨어, 랜섬웨어 등을 포함. 웜은 네트워크를 통해 스스로 감염되고, 스파이웨어는 개인정보를 빼 가며, 랜섬웨어는 중요한 정보를 인질로 삼아 금전을 요구.",
    examCue: "감염 방식, 정상 프로그램 위장 여부, 개인정보 유출, 재침입 통로, 금전 요구 단서를 먼저 표시.",
    surrounding: ["바이러스", "웜", "트로이 목마", "백도어", "스파이웨어", "랜섬웨어"],
    variants: ["악성코드", "virus", "worm", "trojan", "backdoor", "spyware", "ransomware", "바이러스", "웜", "트로이 목마", "백도어", "스파이웨어", "랜섬웨어"],
  },
  {
    id: "network-attack-terms",
    label: "스캐닝·스푸핑·스니핑·DoS/DDoS",
    category: "공격 유형",
    lectureIds: [4, 6],
    refs: ["2015-38", "2015-39", "2016-38", "2016-39", "2017-46", "2018-45", "2019-46", "2019-47"],
    sourceLabel: "4강·6강 / 교재 4장·6장",
    definition:
      "스캐닝은 취약점 탐색, 스푸핑은 신뢰 호스트 가장, 스니핑은 도청, DoS/DDoS는 서비스나 자원의 가용성 저하 공격.",
    examCue: "데이터를 몰래 듣는지, 신뢰 주체를 가장하는지, 대량 트래픽으로 가용성을 떨어뜨리는지 구분.",
    surrounding: ["수동적 공격", "능동적 공격", "ARP 스푸핑", "가용성"],
    variants: ["스캐닝", "스푸핑", "스니핑", "DoS", "DDoS", "서비스 거부", "분산 서비스 거부"],
  },
  {
    id: "passive-active-attack",
    label: "수동적·능동적 공격과 스니핑",
    category: "공격 유형",
    lectureIds: [4, 6],
    refs: ["2015-38", "2017-48"],
    sourceLabel: "4강·6강 / 교재 4장·6장",
    definition:
      "수동적 공격은 통신회선상의 정보를 무단으로 취득하는 행위이고, 능동적 공격은 통신회선상의 정보를 변조 및 위조하는 행위. passive 스니핑은 조작 없이 도청하고, active 스니핑은 패킷 방향을 조작해 도청하거나 변조.",
    examCue: "무차별 모드로 단순 도청하면 passive 스니핑, ARP 스푸핑으로 패킷 방향을 조작하면 active 스니핑.",
    surrounding: ["도청", "무차별 모드", "ARP 스푸핑", "변조", "무결성"],
    variants: ["수동적 공격", "능동적 공격", "passive 스니핑", "active 스니핑", "promiscuous mode", "ARP 스푸핑"],
  },
  {
    id: "cyber-attack-evolution",
    label: "공격의 에이전트화·분산화·자동화·은닉화",
    category: "공격 유형",
    lectureIds: [4],
    refs: ["2015-40", "2016-40"],
    sourceLabel: "4강·교재 4장",
    definition:
      "최근 공격은 에이전트를 심고, 다수 시스템을 분산 활용하며, 자동화하고, 암호화·터널링으로 위치와 통신을 숨기는 방향으로 진화.",
    examCue: "원격 명령, 공격자 위치 감춤, 다수 시스템 동원, 탐지 회피 단서를 각 특징과 연결.",
    surrounding: ["에이전트", "분산 활용", "암호화된 통신", "터널링", "원격 명령"],
    variants: ["에이전트화", "분산화", "자동화", "은닉화", "터널링"],
  },
  {
    id: "buffer-overflow",
    label: "버퍼 오버플로 공격",
    category: "공격 유형",
    lectureIds: [5],
    refs: ["2016-49", "2017-47"],
    sourceLabel: "5강·교재 5장",
    definition:
      "버퍼 크기를 넘는 입력으로 복귀주소를 조작해 공격자가 원하는 코드를 실행하게 하는 시스템 취약점 공격.",
    examCue: "사전 공격·사회공학·스푸핑과 달리 메모리 버퍼와 복귀주소 조작 단서가 있음.",
    surrounding: ["시스템 취약점", "복귀주소", "스택", "권한획득"],
    variants: ["버퍼 오버플로", "buffer overflow", "복귀주소"],
  },
  {
    id: "account-social-attacks",
    label: "전수·사전·사회공학·레이스 컨디션",
    category: "서버·PC 보안",
    lectureIds: [5],
    refs: ["2015-49", "2016-49", "2018-47", "2019-48"],
    sourceLabel: "5강·교재 5장",
    definition:
      "전수 공격은 가능한 모든 조합, 사전 공격은 후보 단어 파일, 사회공학은 사람을 속이는 방식, 레이스 컨디션은 경쟁 상태 취약점 이용.",
    examCue: "ID/패스워드 후보를 미리 모은다는 표현은 사전 공격, 민감 정보를 속여 얻는 표현은 사회공학.",
    surrounding: ["계정 크랙", "패스워드 정책", "기본 설정 오류", "사용자 교육"],
    variants: ["전수 공격", "무차별 공격", "사전 공격", "사회공학", "레이스 컨디션"],
  },
  {
    id: "server-intrusion-stages",
    label: "서버 침입 및 정보유출 단계",
    category: "서버·PC 보안",
    lectureIds: [5],
    refs: ["2015-48", "2016-48", "2018-46"],
    sourceLabel: "5강·교재 5장",
    definition:
      "서버 침입은 정보획득, 권한획득, 공격, 재침입 단계로 이어진다. 백도어 설치와 흔적 삭제가 어느 단계인지 구분.",
    examCue: "포트 스캔은 정보획득, 관리자 권한 획득은 권한획득, 침입흔적 삭제는 공격, 백도어 설치는 재침입 준비와 연결.",
    surrounding: ["포트 스캔", "권한획득", "백도어", "로그 삭제"],
    variants: ["정보획득", "권한획득", "공격 단계", "재침입", "서버 침입"],
  },
  {
    id: "pc-security-measures",
    label: "PC 보안 대책",
    category: "서버·PC 보안",
    lectureIds: [5],
    refs: ["2015-46", "2016-47"],
    sourceLabel: "5강·교재 5장",
    definition:
      "기본 설정 오류를 줄이기 위해 공유 폴더와 관리자 암호를 취약한 암호로 두지 않고, 파일 시스템 백업 및 복구, 무결성 검사, 패치 관리를 수행.",
    examCue: "공유 폴더·관리자 암호의 잘못된 설정, 백업·복구, 보안 패치 적용 여부를 대책/취약점으로 판별.",
    surrounding: ["기본 설정 오류", "공유 폴더", "관리자 암호", "파일 시스템 백업", "패치 관리"],
    variants: ["PC 보안", "백업", "공유 폴더", "관리자 암호", "패치 관리", "무결성 검사"],
  },
  {
    id: "access-control-models",
    label: "시스템 접근제어 모델",
    category: "서버·PC 보안",
    lectureIds: [5],
    refs: ["2016-50"],
    sourceLabel: "5강·교재 5장",
    definition:
      "DAC는 관리자 혹은 자원 소유자가 접근권한을 다른 사용자에게 부여하는 기법, MAC은 객체에 비밀등급을 부여하고 사용자에게 허가등급을 부여해 사전 규칙에 따라 통제하는 기법, RBAC는 역할의 멤버가 됨으로써 권한을 배정받는 방식.",
    examCue: "자원 소유자, 비밀등급·허가등급, 역할의 멤버라는 표현을 기준으로 모델명을 고정.",
    surrounding: ["최소 권한", "ACL", "비밀등급", "허가등급", "역할 기반 접근제어"],
    variants: ["DAC", "MAC", "RBAC", "강제적 접근제어", "임의적 접근제어", "역할 기반 접근제어"],
  },
  {
    id: "ipv4-class-netid-hostid",
    label: "IPv4 클래스·netid·hostid",
    category: "네트워크 보안",
    lectureIds: [6],
    refs: ["2015-41", "2016-41"],
    sourceLabel: "2015·2016 기출 네트워크 기초 / 6강 IP 보안 배경",
    definition:
      "2015~2016 기출에 나온 네트워크 기초 개념. IPv4 주소는 클래스별로 netid와 hostid 크기가 다르므로 A/B/C 클래스의 첫 비트 패턴과 hostid 영역을 함께 판별.",
    examCue: "제시된 10진 주소와 이진수 첫 비트를 보고 클래스와 hostid 영역을 분리.",
    surrounding: ["IP 데이터그램", "IPv4", "주소 클래스", "네트워크 계층"],
    variants: ["IPv4", "Class A", "Class B", "Class C", "netid", "hostid"],
    note: "기출 네트워크 기초",
  },
  {
    id: "network-security-goals",
    label: "네트워크 보안 목표",
    category: "네트워크 보안",
    lectureIds: [6],
    refs: ["2015-42", "2016-42", "2017-48", "2017-49", "2019-49"],
    sourceLabel: "6강·교재 6장",
    definition:
      "네트워크 보안 목표는 기밀성, 무결성, 가용성, 부인방지, 사용자의 신분확인 및 인증, 데이터 발신처 확인, 접근제어 등.",
    examCue: "유일성·다양성처럼 교재의 네트워크 보안 목표 목록에 없는 일반어와 수동/능동 공격 방어 수단을 구분.",
    surrounding: ["수동적 공격", "능동적 공격", "IPsec", "TLS"],
    variants: ["네트워크 보안 목표", "유일성", "다양성", "접근제어", "부인방지"],
  },
  {
    id: "ipsec-ah-esp",
    label: "IPsec·AH·ESP",
    category: "네트워크 보안",
    lectureIds: [6],
    refs: ["2015-42", "2019-49"],
    sourceLabel: "6강·교재 6장",
    definition:
      "IPsec은 IP를 위한 보안 메커니즘. 인증 헤더(AH)는 IP 데이터그램의 무결성과 출처를 보장하지만 기밀성은 보장하지 않고, 캡슐화 보안 페이로드(ESP)는 기밀성을 보장하며 무결성과 출처도 보장.",
    examCue: "AH는 무결성·출처, ESP는 기밀성이라는 기능 구분을 먼저 확인.",
    surrounding: ["IP 데이터그램", "인증 헤더", "캡슐화 보안 페이로드", "무결성 확인값"],
    variants: ["IPsec", "AH", "ESP", "Authentication Header", "Encapsulating Security Payload"],
  },
  {
    id: "tls-ssl",
    label: "SSL/TLS 위치",
    category: "네트워크 보안",
    lectureIds: [6],
    refs: ["2016-43", "2019-49"],
    sourceLabel: "6강·교재 6장",
    definition:
      "SSL은 애플리케이션 계층과 TCP 사이에 위치해 웹 서버와 브라우저 간 트래픽을 보호하고, TLS는 SSL 버전 3.0을 기반으로 한 IETF 표준.",
    examCue: "SSL 기반 업그레이드와 트랜스포트 계층이라는 단서를 ICMP·ARP·IPsec과 분리.",
    surrounding: ["SSL 3.0", "트랜스포트 계층", "애플리케이션 계층과 TCP 사이", "핸드셰이크 프로토콜"],
    variants: ["TLS", "SSL", "트랜스포트 계층", "HTTPS"],
  },
  {
    id: "firewall-system-distinction",
    label: "방화벽·IDS·IPS·VPN 구분",
    category: "방화벽·VPN",
    lectureIds: [7, 8],
    refs: ["2015-50", "2016-51", "2017-50", "2019-51"],
    sourceLabel: "7강·8강 / 교재 7장·8장",
    definition:
      "방화벽은 접근 통제, IDS는 탐지와 알림, IPS는 탐지 후 자동 대응, VPN은 공중망을 사설망처럼 쓰는 기술.",
    examCue: "차단, 감지, 자동 대응, 사설망 연결이라는 동사를 먼저 표시.",
    surrounding: ["침입차단 시스템", "침입탐지 시스템", "침입방지 시스템", "가상사설망"],
    variants: ["방화벽", "IDS", "IPS", "VPN", "침입차단", "침입탐지", "침입방지"],
  },
  {
    id: "firewall-configuration",
    label: "방화벽 구성방식",
    category: "방화벽·VPN",
    lectureIds: [7],
    refs: ["2015-51", "2016-52", "2018-48"],
    sourceLabel: "7강·교재 7장",
    definition:
      "패킷 필터링은 헤더 기반, 서킷 게이트웨이는 회선 수준, 애플리케이션 게이트웨이는 응용 계층 프록시 기반.",
    examCue: "OSI 7계층 응용 계층, 서비스별 프록시, 속도 저하 단서는 애플리케이션 게이트웨이.",
    surrounding: ["패킷 필터링", "서킷 게이트웨이", "애플리케이션 게이트웨이", "하이브리드"],
    variants: ["패킷 필터링", "서킷 게이트웨이", "애플리케이션 게이트웨이", "프록시"],
  },
  {
    id: "firewall-topologies",
    label: "방화벽 구축 형태",
    category: "방화벽·VPN",
    lectureIds: [7],
    refs: ["2015-52", "2016-53", "2017-51"],
    sourceLabel: "7강·교재 7장",
    definition:
      "스크리닝 라우터, 듀얼 홈 호스트, 스크린 호스트 게이트웨이, 스크린 서브넷 게이트웨이와 DMZ 구성을 구분.",
    examCue: "중립 네트워크 DMZ는 스크린 서브넷 게이트웨이, 라우터를 쓰지 않는 형태는 듀얼 홈 호스트.",
    surrounding: ["스크리닝 라우터", "베스천 호스트", "듀얼 홈 호스트", "DMZ"],
    variants: ["스크린 호스트", "스크린 서브넷", "DMZ", "듀얼 홈", "베스천"],
  },
  {
    id: "ids-components",
    label: "IDS 구성요소와 역할",
    category: "IDS·IPS",
    lectureIds: [8],
    refs: ["2015-53", "2016-54", "2018-49"],
    sourceLabel: "8강·교재 8장",
    definition:
      "모니터링부는 정보수집, 분석 및 조치부는 분석과 침입탐지, 관리부는 보고·조치·통제·보안정책 제공.",
    examCue: "정보가공 및 축약은 분석 계열, 보안정책 제공은 관리부로 묶어 오답을 걸러냄.",
    surrounding: ["모니터링부", "분석 및 조치부", "관리부", "센서"],
    variants: ["IDS 구성", "모니터링부", "분석 및 조치부", "관리부"],
  },
  {
    id: "ids-analysis-methods",
    label: "IDS 분석방법",
    category: "IDS·IPS",
    lectureIds: [8],
    refs: ["2015-54", "2016-55", "2017-52", "2018-50", "2019-50"],
    sourceLabel: "8강·교재 8장",
    definition:
      "시그니처 분석은 알려진 공격 패턴, 통계적 분석은 정상행위 이탈, 무결성 분석은 파일이나 객체 변경 여부 확인.",
    examCue: "알려지지 않은 공격 가능성과 오탐 가능성은 통계적 분석, 정의된 패턴 매칭은 시그니처 분석.",
    surrounding: ["시그니처", "통계적 분석", "무결성 분석", "임의적 분석"],
    variants: ["시그니처 분석", "통계적 분석", "무결성 분석", "오탐", "패턴"],
  },
  {
    id: "ips",
    label: "IPS와 HIPS/NIPS",
    category: "IDS·IPS",
    lectureIds: [8],
    refs: ["2015-55", "2016-51"],
    sourceLabel: "8강·교재 8장",
    definition:
      "IPS는 침입 행위를 탐지한 뒤 자동 대응해 중지시키는 시스템이며 호스트 기반과 네트워크 기반으로 나뉜다.",
    examCue: "능동 대응, 자동 차단, 호스트 기반 침입방지 시스템 설명을 IDS와 구분.",
    surrounding: ["HIPS", "NIPS", "자동 대응", "능동 동작"],
    variants: ["IPS", "침입방지 시스템", "HIPS", "NIPS", "자동 대응"],
  },
  {
    id: "vpn-concept",
    label: "VPN 개념과 품질 조건",
    category: "방화벽·VPN",
    lectureIds: [7],
    refs: ["2015-56", "2016-56", "2018-51", "2019-51"],
    sourceLabel: "7강·교재 7장",
    definition:
      "VPN은 공중망을 이용해 사설망처럼 운용 관리하며, 저렴한 비용, 기밀정보 안전 전송, 서비스 품질 제공을 함께 다룸.",
    examCue: "공중망을 직접 운용하는 사설망처럼 쓴다는 정의와 비용·성능·QoS 오답을 구분.",
    surrounding: ["터널링", "기밀성", "QoS", "방화벽 기반 VPN"],
    variants: ["VPN", "가상사설망", "QoS", "공중망", "사설망"],
  },
  {
    id: "vpn-types",
    label: "VPN 구현 형태",
    category: "방화벽·VPN",
    lectureIds: [7],
    refs: ["2015-57", "2016-57"],
    sourceLabel: "7강·교재 7장",
    definition:
      "교재의 VPN 분류는 구현 형태를 기준으로 방화벽 기반의 VPN, 라우터 기반의 VPN, 전용 VPN 등으로 나뉜다. 방화벽 기반 VPN은 관리 포인트가 단순하지만 트래픽 증가 시 암·복호화에 따른 성능저하 우려가 있다.",
    examCue: "VPN 분류가 나오면 방화벽 기반, 라우터 기반, 전용 VPN이라는 교재 분류 축을 먼저 확인.",
    surrounding: ["방화벽 기반 VPN", "라우터 기반 VPN", "전용 VPN", "관리 포인트", "성능저하"],
    variants: ["방화벽 기반 VPN", "라우터 기반 VPN", "전용 VPN", "VPN 구현 형태"],
  },
  {
    id: "vpn-tunneling",
    label: "터널링 기술",
    category: "방화벽·VPN",
    lectureIds: [7],
    refs: ["2017-53", "2019-51"],
    sourceLabel: "7강·교재 7장",
    definition:
      "터널링은 인터넷상의 가상 정보 흐름 통로를 만들어 특정 사용자들이 전용망처럼 사용할 수 있게 하는 VPN 기반 기술.",
    examCue: "가상 정보 흐름 통로, 전용망처럼 사용이라는 표현이 나오면 터널링을 선택.",
    surrounding: ["캡슐화", "암호화", "VPN 관리", "키 관리"],
    variants: ["터널링", "tunneling", "가상 통로", "전용망"],
  },
  {
    id: "pgp-process",
    label: "PGP 보안 서비스·처리 순서",
    category: "이메일 보안",
    lectureIds: [9],
    refs: ["2015-43", "2016-44", "2017-54", "2018-52", "2019-52"],
    sourceLabel: "9강·교재 9장",
    definition:
      "PGP는 전자서명, 압축, 세션키 기반 암호화, 수신자 공개키 기반 세션키 보호, Radix-64 변환으로 전자우편을 보호.",
    examCue: "송신 측 순서는 서명 → 압축 → 암호화 → 기수 64 변환으로 정리.",
    surrounding: ["세션키", "공개키", "개인키", "SHA", "RSA"],
    variants: ["PGP", "세션키", "서명", "압축", "기밀성", "전자우편 호환성"],
    special: "pgp",
  },
  {
    id: "radix64",
    label: "Radix-64 변환 계산",
    category: "이메일 보안",
    lectureIds: [9],
    refs: ["2015-44", "2016-45", "2018-53", "2019-53"],
    sourceLabel: "9강·교재 9장",
    definition:
      "Radix-64는 데이터를 6비트 단위로 나누어 각 6비트를 하나의 문자로 표현하는 전자우편 호환성 변환.",
    examCue: "바이트 수에 8을 곱해 비트 수를 구하고 6으로 나눈 뒤, 패드 문자를 제외한 문자 수를 계산.",
    surrounding: ["Base64", "패드 문자", "6비트", "PGP"],
    variants: ["Radix-64", "Base64", "기수 64", "6비트", "패드"],
    special: "radix64",
  },
  {
    id: "smime",
    label: "S/MIME 개요와 동작",
    category: "이메일 보안",
    lectureIds: [9],
    refs: ["2015-45", "2016-46", "2017-55", "2018-54", "2019-54"],
    sourceLabel: "9강·교재 9장",
    definition:
      "S/MIME은 인터넷 이메일 형식 표준인 MIME의 보안기능을 강화하기 위해 공개키 암호기술을 적용한 것. MIME 형태의 메시지에 보안 메커니즘을 적용하여 S/MIME 메시지로 변환하고, 전자서명과 메시지 암호화를 수행.",
    examCue: "강력한 암호화, 전자서명, 사용용이성, 융통성, 상호운용성 목표와 전자서명·세션키 분배·해시함수·메시지 암호화 기능을 구분.",
    surrounding: ["MIME", "SMTP", "전자서명", "세션키 분배", "메시지 암호화"],
    variants: ["S/MIME", "MIME", "전자서명", "메시지 암호화", "세션키 분배", "해시함수"],
  },
  {
    id: "spam",
    label: "스팸과 메일 기반 공격",
    category: "공격 유형",
    lectureIds: [4, 9],
    refs: ["2015-47"],
    sourceLabel: "4강·9강 / 교재 4장·9장",
    definition:
      "스팸 메일은 불특정 다수를 대상으로 일방적이며 대량으로 전달되는 이메일로, 일반적으로 광고, 홍보, 비방 등의 목적으로 전송되는 메일.",
    examCue: "불특정 다수, 대량 전달, 전자우편 광고라는 단서로 피싱·스푸핑·스파이웨어와 구분.",
    surrounding: ["피싱", "스푸핑", "스파이웨어", "이메일 보안"],
    variants: ["스팸", "피싱", "스푸핑", "스파이웨어", "대량 전자우편"],
  },
  {
    id: "web-security-overview",
    label: "웹 보안 영역 구분",
    category: "웹·무선 보안",
    lectureIds: [10],
    refs: ["2019-55"],
    sourceLabel: "10강·교재 10장",
    definition:
      "웹 보안은 네트워크, 웹 서버, 웹 애플리케이션, 웹 클라이언트 영역의 위협과 대응을 함께 다룸.",
    examCue: "웹 클라이언트 부분을 백신만으로 해결할 수 있다는 단정형 보기를 배제.",
    surrounding: ["SSL/TLS", "웹 서버 패치", "웹 클라이언트", "웹 애플리케이션"],
    variants: ["웹 보안", "웹 서버", "웹 클라이언트", "SSL/TLS", "보안 패치"],
  },
  {
    id: "sql-injection",
    label: "SQL injection",
    category: "웹·무선 보안",
    lectureIds: [10],
    refs: ["2018-55"],
    sourceLabel: "10강·교재 10장",
    definition:
      "SQL injection은 웹 애플리케이션에서 사용하는 데이터베이스 쿼리, 즉 SQL문에 추가적인 SQL을 삽입함으로써 악의적인 행위를 가능하게 하는 공격.",
    examCue: "ID와 비밀번호 입력 자리에 SQL문을 넣어 인증 우회가 일어나는지를 직접 단서로 확인.",
    surrounding: ["입력값 검사", "매개변수화된 쿼리", "웹 애플리케이션", "접근제어 실패"],
    variants: ["SQL injection", "SQL 인젝션", "쿼리 삽입"],
  },
  {
    id: "xss",
    label: "XSS와 저장형·반사형",
    category: "웹·무선 보안",
    lectureIds: [10],
    refs: ["2017-56", "2018-56"],
    sourceLabel: "10강·교재 10장",
    definition:
      "XSS는 메일·웹페이지·게시판 등에 악성 스크립트를 포함시켜 웹 클라이언트에서 실행되게 하는 공격.",
    examCue: "게시판에 등록되어 사용자가 열 때 실행되면 저장형 XSS, 요청·응답에 반사되면 반사형 XSS.",
    surrounding: ["악성 스크립트", "저장형 XSS", "반사형 XSS", "웹 클라이언트"],
    variants: ["XSS", "크로스 사이트 스크립팅", "저장형", "반사형", "악성 스크립트"],
  },
  {
    id: "web-access-control-failure",
    label: "웹 접근제어 실패",
    category: "웹·무선 보안",
    lectureIds: [10],
    refs: ["2017-57", "2019-56"],
    sourceLabel: "10강·교재 10장",
    definition:
      "접근제어 실패는 사용자와 자원에 대한 접근제어가 완벽하지 못한 경우 발생. 관리자 페이지 자체에 접근권한을 설정해야 하며, 링크를 숨기거나 URL만 복잡하게 만드는 것은 충분한 대책이 아님.",
    examCue: "관리자 링크를 숨기는 것은 대책이 아니고 관리자 페이지 자체에 권한 설정이 필요.",
    surrounding: ["사용자와 자원에 대한 접근제어", "관리자 페이지", "접근권한 설정", "URL", "파라미터"],
    variants: ["접근제어 실패", "접근권한 설정", "관리자 페이지", "사용자 접근제어"],
  },
  {
    id: "wireless-lan-security",
    label: "무선 LAN 보안",
    category: "웹·무선 보안",
    lectureIds: [10],
    refs: ["2017-58", "2018-57", "2019-57"],
    sourceLabel: "10강·교재 10장",
    definition:
      "WEP의 취약성 이후 WPA, RSN, TKIP, CCMP, EAP 중심으로 무선 LAN 보안이 발전.",
    examCue: "현재 취약해 사용하지 않는 기밀성 알고리즘은 WEP, RSN 프로토콜이 아닌 것도 WEP.",
    surrounding: ["WEP", "WPA", "RSN", "TKIP", "CCMP", "EAP"],
    variants: ["무선 LAN", "WEP", "WPA", "WPA2", "RSN", "TKIP", "CCMP", "EAP"],
  },
  {
    id: "digital-evidence-examples",
    label: "디지털 증거 예시 판별",
    category: "디지털 포렌식",
    lectureIds: [11],
    refs: ["2015-58", "2016-58", "2017-59", "2019-58"],
    sourceLabel: "11강·교재 11장",
    definition:
      "디지털 증거는 컴퓨터나 디지털 저장매체, 네트워크를 통해 저장·전송되는 증거 가치 있는 정보.",
    examCue: "USB, 블랙박스, 스마트폰, 전자책, 스마트시계처럼 디지털 자료가 남는 물건과 비디지털 물건을 구분.",
    surrounding: ["USB 메모리", "블랙박스", "스마트폰", "디지털 액자", "전자책"],
    variants: ["디지털 증거", "USB", "블랙박스", "스마트폰", "전자책", "디지털 액자"],
  },
  {
    id: "digital-evidence-characteristics",
    label: "디지털 증거 특성",
    category: "디지털 포렌식",
    lectureIds: [11],
    refs: ["2016-60", "2017-60", "2018-59", "2019-59"],
    sourceLabel: "11강·교재 11장",
    definition:
      "디지털 증거는 비가시성, 변조 가능성, 복제 용이성, 대규모성, 휘발성, 초국경성 등의 특성을 가진다.",
    examCue: "가시성·지역성·영구성처럼 반대 성격의 단어를 배제하고 휘발성·대규모성·초국경성을 고름.",
    surrounding: ["휘발성", "대규모성", "비가시성", "복제 용이성", "초국경성"],
    variants: ["디지털 증거 특성", "휘발성", "대규모성", "비가시성", "초국경성", "복제 용이성"],
  },
  {
    id: "forensic-procedure",
    label: "디지털 포렌식 절차",
    category: "디지털 포렌식",
    lectureIds: [11],
    refs: ["2015-59", "2016-59", "2018-58"],
    sourceLabel: "11강·교재 11장",
    definition:
      "사전준비, 증거수집, 포장 및 이송, 조사분석, 정밀검토, 보고서 작성 순서로 증거를 처리.",
    examCue: "포장 및 이송은 증거수집 뒤, 정밀검토는 조사분석 뒤, 보고서는 마지막.",
    surrounding: ["사전준비", "증거수집", "포장 및 이송", "조사분석", "정밀검토", "보고서 작성"],
    variants: ["포렌식 절차", "증거수집", "포장 및 이송", "조사분석", "정밀검토", "보고서 작성"],
    special: "forensic",
  },
  {
    id: "forensic-integrity-rules",
    label: "포렌식 절차 준수사항",
    category: "디지털 포렌식",
    lectureIds: [11],
    refs: ["2018-60"],
    sourceLabel: "11강·교재 11장",
    definition:
      "적법절차 준수, 원본 보존, 증거 무결성 확보, 분석 결과 반복성, 모든 과정 기록이 절차상 중요.",
    examCue: "분석결과의 비반복성처럼 절차 신뢰성을 깨뜨리는 표현을 배제.",
    surrounding: ["적법절차", "원본 보존", "무결성", "반복성", "과정 기록"],
    variants: ["적법절차", "원본 보존", "증거 무결성", "반복성", "절차 준수"],
  },
  {
    id: "timeline-analysis",
    label: "타임라인 분석",
    category: "디지털 포렌식",
    lectureIds: [11],
    refs: ["2015-60"],
    sourceLabel: "11강·교재 11장",
    definition:
      "타임라인 분석은 파일 시스템과 파일 내부 메타데이터 등에 저장된 시간 정보를 이용해 사용자 행위를 추적.",
    examCue: "시간 정보와 사용자 행위 추적이라는 단서가 나오면 디스크 브라우징·데이터 뷰잉·파일 복구와 분리.",
    surrounding: ["메타데이터", "파일 시스템", "로그 분석", "행위 추적"],
    variants: ["타임라인 분석", "시간 정보", "메타데이터", "행위 추적"],
    note: "2015년에만 나온 주변 분석기술",
  },
  {
    id: "anti-forensics",
    label: "안티포렌식",
    category: "디지털 포렌식",
    lectureIds: [11],
    refs: ["2019-60"],
    sourceLabel: "11강·교재 11장",
    definition:
      "안티포렌식은 범죄자가 포렌식 기술에 대응하여 자신에게 불리하게 작용할 가능성이 있는 증거물을 차단하려는 활동. 데이터 완전 삭제, 데이터 변조, 데이터 암호화 등이 포함.",
    examCue: "포렌식 기술을 위해 증거를 온전하게 남긴다는 설명은 목적이 반대.",
    surrounding: ["데이터 완전 삭제", "데이터 변조", "데이터 암호화", "증거물 차단"],
    variants: ["안티포렌식", "완전 삭제", "데이터 변조", "데이터 암호화"],
  },
];

function yearFromRef(ref: string) {
  return Number(ref.slice(0, 4));
}

export const securityFrequentConcepts: SecurityFrequentConcept[] = concepts.map(
  (concept) => ({
    ...concept,
    visuals: securityConceptVisuals[concept.id],
    frequency: concept.refs.length,
    years: Array.from(new Set(concept.refs.map(yearFromRef))).sort((a, b) => a - b),
  }),
);

export const securityFrequentConceptYears = [2015, 2016, 2017, 2018, 2019] as const;
