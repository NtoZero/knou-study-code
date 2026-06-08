import {
  networkExamCategories as derivedNetworkExamCategories,
  networkFrequentConcepts as derivedNetworkFrequentConcepts,
} from "@/components/networkPastExam/data";
import type {
  NetworkExamCategory,
  NetworkFrequentConcept as DerivedNetworkFrequentConcept,
} from "@/components/networkPastExam/types";

export type NetworkExamPrepTrack =
  | "통신 기초"
  | "전송 기술"
  | "망 구조"
  | "TCP/IP"
  | "LAN"
  | "보안"
  | "신기술";

export type NetworkExamPrepLesson = {
  id: number;
  track: NetworkExamPrepTrack;
  priority: number;
  frequency: number;
  range: string;
  action: string;
};

export type NetworkCoveragePoint = {
  concept: string;
  source: string;
  examNeed: string;
  reinforcement: string;
  tags: string[];
};

export type NetworkFrequentConceptCategory = NetworkExamCategory;
export type NetworkFrequentConcept = DerivedNetworkFrequentConcept;

export const networkLectureExamHighlights: Record<number, string[]> = {
  1: ["OSI 모델", "프로토콜", "네트워크 규모"],
  2: ["PCM", "변조/복조", "전송 부호"],
  3: ["전송매체", "토폴로지", "네트워크 장비"],
  4: ["회선/패킷 교환", "다중화", "동기화"],
  5: ["오류검출", "ARQ", "슬라이딩 윈도우"],
  6: ["흐름제어", "혼잡제어", "라우팅"],
  7: ["OSI 7계층", "TCP/IP 4계층", "PDU/SDU/PCI"],
  8: ["IP", "ARP/RARP", "ICMP/DHCP"],
  9: ["TCP", "UDP", "3-way handshake"],
  10: ["HTTP/FTP", "DNS/DHCP", "메일 프로토콜"],
  11: ["LAN 분류", "CSMA/CD", "토큰링/토큰버스"],
  12: ["IEEE 802", "무선 LAN", "고속 LAN"],
  13: ["CIA", "공격 유형", "악성 프로그램"],
  14: ["암호화", "디지털 서명", "방화벽"],
  15: ["5G/IoT", "SDN/NFV", "MEC/SD-WAN"],
};

export const networkExamPrepLessons: NetworkExamPrepLesson[] = [
  {
    id: 1,
    track: "통신 기초",
    priority: 4,
    frequency: 4,
    range: "통신 시스템과 프로토콜",
    action: "OSI 모델의 목적, 프로토콜 구성요소, LAN/MAN/WAN 구분을 한 표로 정리.",
  },
  {
    id: 2,
    track: "통신 기초",
    priority: 3,
    frequency: 3,
    range: "신호 변환과 부호화",
    action: "아날로그/디지털 신호 변환 방향과 PCM 처리 순서를 함께 암기.",
  },
  {
    id: 3,
    track: "통신 기초",
    priority: 3,
    frequency: 3,
    range: "전송매체와 접속 형태",
    action: "유선/무선 매체, 토폴로지, 장비의 OSI 계층을 짝지어 점검.",
  },
  {
    id: 4,
    track: "전송 기술",
    priority: 4,
    frequency: 4,
    range: "교환·다중화·동기화",
    action: "회선교환과 패킷교환, FDM/TDM, 비트·문자·프레임 동기 차이를 비교.",
  },
  {
    id: 5,
    track: "전송 기술",
    priority: 5,
    frequency: 5,
    range: "오류제어",
    action: "패리티, 검사합, CRC와 정지-대기/Go-Back-N/선택적 반복 ARQ를 계산 조건 중심으로 반복.",
  },
  {
    id: 6,
    track: "전송 기술",
    priority: 4,
    frequency: 4,
    range: "흐름·혼잡·라우팅",
    action: "슬라이딩 윈도우가 흐름제어인지 오류제어인지 문맥으로 판별하고, 라우팅 분류를 사례와 연결.",
  },
  {
    id: 7,
    track: "망 구조",
    priority: 5,
    frequency: 5,
    range: "계층 구조",
    action: "OSI 7계층 순서, TCP/IP 4계층 대응, PDU = SDU + PCI 관계를 먼저 고정.",
  },
  {
    id: 8,
    track: "TCP/IP",
    priority: 5,
    frequency: 5,
    range: "네트워크 계층",
    action: "IP의 비연결 특성, TTL, 라우팅 테이블, ARP/RARP/ICMP/DHCP 역할을 분리.",
  },
  {
    id: 9,
    track: "TCP/IP",
    priority: 5,
    frequency: 5,
    range: "전송 계층",
    action: "TCP와 UDP의 연결성, 신뢰성, 헤더 필드, 3-way handshake 순서를 묶어 점검.",
  },
  {
    id: 10,
    track: "TCP/IP",
    priority: 4,
    frequency: 4,
    range: "응용 계층",
    action: "FTP, HTTP, TELNET, SMTP/POP3/IMAP, DNS, DHCP가 사용하는 하위 전송 방식을 구분.",
  },
  {
    id: 11,
    track: "LAN",
    priority: 4,
    frequency: 4,
    range: "LAN 기초와 분류",
    action: "LAN 정의와 효과를 먼저 고정하고 위상, 전송 매체, 전송 방식, 매체접근 방법을 기준별로 분리.",
  },
  {
    id: 12,
    track: "LAN",
    priority: 4,
    frequency: 4,
    range: "IEEE 802와 LAN 모델",
    action: "IEEE 802 작업 그룹, LLC/MAC, 무선 LAN 통신 방식, 고속 LAN 종류를 표준 번호와 연결.",
  },
  {
    id: 13,
    track: "보안",
    priority: 5,
    frequency: 4,
    range: "네트워크 보안 기초",
    action: "CIA 보안 목표와 변조·가로채기·방해·위조·DoS·DDoS를 위협 목표별로 판별.",
  },
  {
    id: 14,
    track: "보안",
    priority: 5,
    frequency: 4,
    range: "네트워크 보안 기술",
    action: "대칭키/공개키/PKI/디지털 서명과 방화벽 종류를 키 방향과 네트워크 위치로 비교.",
  },
  {
    id: 15,
    track: "신기술",
    priority: 3,
    frequency: 3,
    range: "최신 정보통신 기술",
    action: "이동통신 세대, IoT 핵심기술, SDN/NFV/MEC 구성요소를 구조명 중심으로 묶어 점검.",
  },
];

export const networkPastExamFocus = [
  {
    title: "계층·주소·프로토콜",
    detail: "OSI와 TCP/IP 계층, IP·물리주소·포트번호, 응용 프로토콜의 위치를 반복 확인.",
  },
  {
    title: "전송 제어 절차",
    detail: "오류검출, ARQ, 슬라이딩 윈도우, TCP 연결 설정처럼 순서가 있는 개념을 우선 점검.",
  },
  {
    title: "비교형 선택지",
    detail: "TCP/UDP, 회선/패킷 교환, FDM/TDM, ARP/RARP처럼 이름이 비슷한 쌍을 대비.",
  },
] as const;

export const networkCoverageNotes: Record<number, NetworkCoveragePoint[]> = {
  1: [
    {
      concept: "OSI 모델과 프로토콜",
      source: "강의 1강: 통신 시스템은 계층화된 모델과 프로토콜을 통해 송수신 규칙을 정의.",
      examNeed: "계층 모델의 목적, 프로토콜의 의미, 네트워크 규모 구분이 선택지 비교로 자주 등장.",
      reinforcement: "모델·프로토콜·표준의 역할을 분리하고 LAN/MAN/WAN 범위를 함께 확인.",
      tags: ["OSI", "프로토콜", "LAN/WAN"],
    },
  ],
  2: [
    {
      concept: "PCM과 신호 변환",
      source: "강의 2강: PCM은 표본화, 양자화, 부호화 과정을 통해 아날로그 신호를 디지털 신호로 변환.",
      examNeed: "변조/복조, 아날로그/디지털 변환 방향, 전송 부호의 기능을 혼동시키는 문항에 대비.",
      reinforcement: "신호 종류와 변환 방향을 먼저 고정한 뒤 PCM 단계 순서를 점검.",
      tags: ["PCM", "변조", "부호화"],
    },
  ],
  3: [
    {
      concept: "전송매체·토폴로지·장비",
      source: "강의 3강: 통신선로, 전송매체, 네트워크 토폴로지와 장비는 연결 방식과 계층 역할로 구분.",
      examNeed: "버스/스타/링 형태, 허브·브리지·라우터의 역할, 유선/무선 매체 특성을 묻는 문제에 대비.",
      reinforcement: "모양 암기보다 장애 영향, 중앙 장치 존재, OSI 계층 매핑으로 판단.",
      tags: ["토폴로지", "라우터", "매체"],
    },
  ],
  4: [
    {
      concept: "교환 방식과 다중화",
      source: "강의 4강: 회선교환은 전용 경로 설정, 패킷교환은 패킷 단위 저장·전달 방식.",
      examNeed: "회선/패킷 교환 장단점, FDM/TDM, 동기화 단위를 비교하는 선택지에 대비.",
      reinforcement: "자원 점유 방식과 전송 단위를 기준으로 교환·다중화·동기화를 분리.",
      tags: ["회선교환", "패킷교환", "다중화"],
    },
  ],
  5: [
    {
      concept: "오류검출과 ARQ",
      source: "강의 5강: 오류제어는 오류검출 부호와 재전송 기반 ARQ로 신뢰성 있는 전송을 지원.",
      examNeed: "정지-대기, Go-Back-N, 선택적 반복 ARQ의 재전송 범위와 윈도우 조건을 구분해야 함.",
      reinforcement: "오류가 난 프레임만 재전송하는지, 이후 프레임까지 되돌리는지를 먼저 판별.",
      tags: ["ARQ", "CRC", "윈도우"],
    },
  ],
  6: [
    {
      concept: "흐름제어·혼잡제어·라우팅",
      source: "강의 6강: 흐름제어는 송수신 처리 속도 조절, 혼잡제어는 망 부하 완화, 라우팅은 경로 선택.",
      examNeed: "슬라이딩 윈도우가 오류제어와 흐름제어 양쪽 문맥에서 쓰이며, 라우팅 분류도 사례로 출제.",
      reinforcement: "제어 대상이 수신자, 네트워크 부하, 경로 중 어디인지로 개념을 나누어 판단.",
      tags: ["흐름제어", "혼잡제어", "라우팅"],
    },
  ],
  7: [
    {
      concept: "OSI 7계층과 TCP/IP 4계층",
      source: "강의 7강: OSI 참조 모델은 7계층, TCP/IP는 응용·전송·인터넷·네트워크 액세스 계층으로 설명.",
      examNeed: "계층 순서, DoD 모델 대응, PDU/SDU/PCI 관계, 동등 계층 통신 용어가 반복 출제형.",
      reinforcement: "계층명 순서와 데이터 단위 공식을 먼저 외운 뒤 대표 프로토콜을 계층에 배치.",
      tags: ["OSI", "TCP/IP", "PDU"],
    },
  ],
  8: [
    {
      concept: "IP와 보조 프로토콜",
      source: "강의 8강: IP는 비연결 데이터그램 전달을 담당하며 ARP, RARP, ICMP, IGMP, DHCP가 보조 기능 수행.",
      examNeed: "TTL, 라우팅 테이블 항목, ARP/RARP 방향, ICMP 오류 보고, DHCP 자동 설정을 구분해야 함.",
      reinforcement: "각 프로토콜을 주소 변환, 오류 보고, 그룹 관리, 자동 설정 기능으로 분류.",
      tags: ["IP", "ARP", "DHCP"],
    },
  ],
  9: [
    {
      concept: "TCP와 UDP",
      source: "강의 9강: TCP는 연결형 신뢰성 전송, UDP는 비연결형 데이터그램 전송.",
      examNeed: "전송 계층 소속, 연결성, 신뢰성, 순서 제어, 3-way handshake 단서를 묻는 문항에 대비.",
      reinforcement: "TCP는 연결 설정과 순서·재전송, UDP는 단순 헤더와 낮은 오버헤드로 대비.",
      tags: ["TCP", "UDP", "handshake"],
    },
  ],
  10: [
    {
      concept: "응용 계층 프로토콜",
      source: "강의 10강: HTTP/HTTPS, FTP, TELNET/SSH, 메일, DNS, DHCP 등 응용 프로토콜은 목적과 하위 전송 방식으로 구분.",
      examNeed: "FTP·TELNET·SMTP는 TCP 기반, DNS·DHCP는 UDP 기반이라는 식의 프로토콜 매칭을 점검.",
      reinforcement: "서비스 목적, 포트, TCP/UDP 사용 여부를 한 줄 카드로 반복.",
      tags: ["HTTP", "DNS", "메일"],
    },
  ],
  11: [
    {
      concept: "LAN 분류 기준",
      source: "강의 11강: LAN은 위상, 전송 매체, 전송 방식, 매체접근 방법에 따라 분류.",
      examNeed: "성형·버스형·트리형·환형, 베이스밴드·브로드밴드, CSMA/CD·토큰링·토큰버스를 기준별로 구분.",
      reinforcement: "이름을 외우기보다 분류 기준이 모양, 물리 통로, 신호 방식, 접근 권한 중 무엇인지 먼저 판별.",
      tags: ["LAN", "위상", "매체접근"],
    },
  ],
  12: [
    {
      concept: "IEEE 802와 LAN 모델",
      source: "강의 12강: IEEE 802.2는 LLC, 802.3은 CSMA/CD, 802.11은 무선 LAN과 관련.",
      examNeed: "표준 번호와 기술명, LLC/MAC 역할, 애드혹·인프라스트럭처 방식, 고속 LAN 종류를 연결.",
      reinforcement: "표준 번호는 작업 그룹, 무선 구조는 AP 유무, 고속 LAN은 전송속도와 매체로 분리.",
      tags: ["IEEE 802", "무선 LAN", "고속 LAN"],
    },
  ],
  13: [
    {
      concept: "네트워크 보안 위협",
      source: "강의 13강: 보안 목표는 기밀성·무결성·가용성이고 네트워크 보안 요구사항은 실체 인증, 데이터 무결성, 데이터 보안성, 데이터 인증, 부인 방지.",
      examNeed: "변조·가로채기·방해·위조·DoS·DDoS와 바이러스·웜·트로이 목마·피싱·스미싱·파밍을 구분.",
      reinforcement: "공격 행위가 노출, 변경, 사용 불능, 거짓 삽입, 감염, 사용자 유인 중 어디에 해당하는지 판별.",
      tags: ["CIA", "공격 유형", "악성 프로그램"],
    },
  ],
  14: [
    {
      concept: "암호화와 보안 장치",
      source: "강의 14강: 암호화는 기밀성·무결성·정당성 보장을 제공하며, 디지털 서명과 방화벽은 각각 인증·부인 방지와 패킷 통제를 담당.",
      examNeed: "대칭키·공개키·PKI·디지털 서명, 배스천 호스트·스크리닝 라우터·스크린 서브넷·프락시 서버를 비교.",
      reinforcement: "키가 같은지 다른지, 개인키로 서명하는지, 패킷을 어디에서 검사하는지로 선택지를 줄임.",
      tags: ["암호화", "디지털 서명", "방화벽"],
    },
  ],
  15: [
    {
      concept: "신기술 구조와 구성요소",
      source: "강의 15강: 이동통신, IoT, SDN, NFV, MEC, 메타버스, 양자컴퓨팅, SD-WAN을 최신 정보통신 기술로 정리.",
      examNeed: "1G~5G 세대 특징, IoT 3대 핵심 기술, SDN 3계층, NFV 구성요소, MEC 구성요소를 묻는 문항에 대비.",
      reinforcement: "새 용어는 기능을 중앙으로 옮기는지, 소프트웨어로 가상화하는지, 사용자 가까이에서 처리하는지로 구분.",
      tags: ["5G", "SDN/NFV", "MEC"],
    },
  ],
};

const legacyNetworkFrequentConceptCategories = [
  "통신 모델",
  "데이터 표현",
  "전송 매체",
  "전송 제어",
  "경로 제어",
  "TCP/IP",
];

const legacyNetworkFrequentConcepts = [
  {
    id: "osi-tcpip-layering",
    label: "OSI 7계층과 TCP/IP 4계층",
    category: "통신 모델",
    lectureIds: [1, 7],
    frequency: 5,
    definition: "계층별 기능을 분리해 통신 과정을 표준화하고, TCP/IP는 실제 인터넷 통신망 구조를 4계층으로 설명.",
    examCue: "계층 순서, 계층별 대표 기능, OSI와 DoD/TCP/IP 대응 관계를 바꿔 제시.",
    sourceLabel: "1강·7강",
    variants: ["OSI 참조 모델", "DoD 모델", "TCP/IP 계층"],
    surrounding: ["프로토콜", "캡슐화", "동등 계층 통신"],
  },
  {
    id: "pdu-sdu-pci",
    label: "PDU, SDU, PCI",
    category: "통신 모델",
    lectureIds: [7],
    frequency: 4,
    definition: "동등 계층 간 데이터 전송단위인 PDU는 상위 계층 데이터 SDU에 제어정보 PCI가 덧붙은 형태.",
    examCue: "괄호 채우기나 용어 정의 문항에서 PDU/SDU/PCI의 위치를 교차.",
    sourceLabel: "7강",
    variants: ["프로토콜 데이터 단위", "서비스 데이터 단위", "프로토콜 제어정보"],
    surrounding: ["캡슐화", "헤더", "계층 인터페이스"],
  },
  {
    id: "pcm",
    label: "PCM 처리 과정",
    category: "데이터 표현",
    lectureIds: [2],
    frequency: 3,
    definition: "PCM은 표본화, 양자화, 부호화 과정을 거쳐 아날로그 음성 신호를 디지털 부호로 바꾸는 방식.",
    examCue: "처리 순서 또는 각 단계의 역할을 바꾼 선택지를 제시.",
    sourceLabel: "2강",
    variants: ["표본화", "양자화", "부호화"],
    surrounding: ["변조", "복조", "전송 부호"],
  },
  {
    id: "topology-devices",
    label: "토폴로지와 네트워크 장비",
    category: "전송 매체",
    lectureIds: [3],
    frequency: 3,
    definition: "네트워크 토폴로지는 노드 연결 형태이며, 장비는 계층과 전달 범위에 따라 허브, 브리지, 스위치, 라우터 등으로 구분.",
    examCue: "스타형·버스형·링형 특징 또는 장비의 OSI 계층을 혼합.",
    sourceLabel: "3강",
    variants: ["버스형", "스타형", "라우터"],
    surrounding: ["전송매체", "LAN", "브리지"],
  },
  {
    id: "switching-multiplexing",
    label: "교환 방식과 다중화",
    category: "전송 제어",
    lectureIds: [4],
    frequency: 4,
    definition: "교환 방식은 데이터를 전달할 경로와 단위를 정하고, 다중화는 하나의 전송매체를 여러 신호가 공유하도록 함.",
    examCue: "회선교환과 패킷교환, FDM과 TDM의 기준을 서로 바꿔 설명.",
    sourceLabel: "4강",
    variants: ["회선교환", "패킷교환", "FDM", "TDM"],
    surrounding: ["동기화", "전용 회선", "저장 후 전달"],
  },
  {
    id: "error-control-arq",
    label: "오류제어와 ARQ",
    category: "전송 제어",
    lectureIds: [5],
    frequency: 5,
    definition: "오류제어는 오류를 검출하거나 정정하고, ARQ는 오류 발생 시 재전송으로 신뢰성을 확보하는 방식.",
    examCue: "정지-대기, Go-Back-N, 선택적 반복 ARQ의 재전송 범위와 윈도우 크기 조건을 비교.",
    sourceLabel: "5강",
    variants: ["정지-대기 ARQ", "Go-Back-N ARQ", "선택적 반복 ARQ"],
    surrounding: ["패리티", "검사합", "CRC", "슬라이딩 윈도우"],
  },
  {
    id: "flow-congestion-routing",
    label: "흐름제어, 혼잡제어, 라우팅",
    category: "경로 제어",
    lectureIds: [6],
    frequency: 4,
    definition: "흐름제어는 송수신자 간 속도 조절, 혼잡제어는 네트워크 부하 조절, 라우팅은 목적지까지의 경로 선택.",
    examCue: "제어 대상이 수신자, 망 부하, 경로 중 어디인지 구분하게 함.",
    sourceLabel: "6강",
    variants: ["슬라이딩 윈도우", "분산형 라우팅", "비적응적 라우팅"],
    surrounding: ["혼잡", "경로선택", "ARPANET"],
  },
  {
    id: "ip-helper-protocols",
    label: "IP와 ARP/RARP/ICMP/DHCP",
    category: "TCP/IP",
    lectureIds: [8],
    frequency: 5,
    definition: "IP는 비연결 데이터그램 전달을 담당하고, 보조 프로토콜은 주소 변환, 오류 보고, 그룹 관리, 자동 설정 기능을 맡음.",
    examCue: "ARP와 RARP의 변환 방향, ICMP와 DHCP의 기능, IP 헤더 필드 의미를 혼동시킴.",
    sourceLabel: "8강",
    variants: ["ARP", "RARP", "ICMP", "DHCP"],
    surrounding: ["TTL", "라우팅 테이블", "IP 데이터그램"],
  },
  {
    id: "tcp-udp",
    label: "TCP와 UDP",
    category: "TCP/IP",
    lectureIds: [7, 9],
    frequency: 5,
    definition: "TCP는 연결형 신뢰성 전송 서비스를 제공하고, UDP는 비연결형 데이터그램 전송 서비스를 제공.",
    examCue: "연결성, 신뢰성, 계층 위치, 헤더 필드, 3-way handshake 여부를 바꿔 제시.",
    sourceLabel: "7강·9강",
    variants: ["연결형", "비연결형", "3-way handshake"],
    surrounding: ["포트 번호", "세그먼트", "데이터그램"],
  },
  {
    id: "application-protocols",
    label: "응용 계층 프로토콜",
    category: "TCP/IP",
    lectureIds: [7, 10],
    frequency: 4,
    definition: "응용 계층 프로토콜은 파일 전송, 웹, 원격 접속, 전자우편, 이름 해석, 자동 주소 설정 같은 서비스를 제공.",
    examCue: "FTP, TELNET, SMTP, DNS, DHCP가 TCP 또는 UDP 중 무엇을 이용하는지 비교.",
    sourceLabel: "7강·10강",
    variants: ["FTP", "HTTP", "TELNET", "SMTP", "DNS", "DHCP"],
    surrounding: ["포트", "메일", "웹"],
  },
];

void legacyNetworkFrequentConceptCategories;
void legacyNetworkFrequentConcepts;

export const networkFrequentConceptCategories: NetworkFrequentConceptCategory[] =
  derivedNetworkExamCategories;

export const networkFrequentConcepts: NetworkFrequentConcept[] =
  derivedNetworkFrequentConcepts;
