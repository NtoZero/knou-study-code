"use client";

import { useState } from "react";
import { HelpCircle, Lightbulb } from "lucide-react";

/* ---------------------------------------------------------------
 * NetworkTerm — 용어 호버 툴팁 (정보통신망 study-hub 전용)
 *
 * 사용 예:
 *   <NetworkTerm term="Shannon" />
 *   <NetworkTerm term="encapsulation" label="캡슐화" />
 *
 * 정의는 1강 정리하기 원문 표현을 우선 사용. CPMTerm 구조 차용.
 * ------------------------------------------------------------- */

interface TermInfo {
  full: string;
  korean: string;
  def: string;
  formula?: string;
  intuition?: string;
}

const TERMS: Record<string, TermInfo> = {
  // Shannon-Weaver 6요소
  Shannon: {
    full: "Claude Shannon (1948)",
    korean: "섀넌",
    def: "1948년 통신의 수학적 이론을 정립한 공학자. 메시지를 확률적 기호열로 보고 채널 용량과 노이즈의 관계를 수식화함.",
    intuition:
      "통신을 '의미'가 아닌 '기호가 얼마나 정확히 전달되는가' 관점에서 모델화한 최초의 인물.",
  },
  Weaver: {
    full: "Warren Weaver (1949)",
    korean: "위버",
    def: "Shannon 모델을 의미(semantic)·효과(effectiveness) 차원까지 확장. 통신을 A 기술적 / B 의미론적 / C 효과성의 3단계 문제로 재정의.",
    intuition:
      "피드백 루프 개념을 추가해 단방향 Shannon 모델을 대화형으로 확장함.",
  },
  source: {
    full: "Information Source",
    korean: "정보원",
    def: "메시지를 생성하는 주체. 1강 통신 시스템 모델에서 입력 정보 m 을 만드는 최상류 지점.",
    intuition: "사람·센서·AI 추론 엔진 등 무엇이든 정보를 만드는 쪽이면 정보원.",
  },
  transmitter: {
    full: "Transmitter",
    korean: "송신기",
    def: "메시지를 채널이 전달할 수 있는 신호 s(t) 로 변환(인코딩·변조)하는 장치. 1강 송·수신 장치의 입력 쪽.",
    intuition: "모뎀·마이크·토크나이저가 모두 송신기 역할.",
  },
  channel: {
    full: "Channel",
    korean: "채널",
    def: "신호가 전달되는 매체. 유선(꼬임선·동축·광섬유), 무선(전파·마이크로파) 등 전송 경로 전체를 포함.",
    intuition: "물리적 매체 + 논리적 경로. HAC에서는 HTTPS API가 채널.",
  },
  receiver: {
    full: "Receiver",
    korean: "수신기",
    def: "수신 신호 r(t) 를 복원·복호화하여 원 메시지 추정치 m' 를 만드는 장치.",
    intuition: "HAC에서는 AI 전처리(토크나이저·임베딩)가 수신기.",
  },
  destination: {
    full: "Destination",
    korean: "목적지",
    def: "복원된 메시지가 최종 도달하는 지점. 사람·애플리케이션·추론 엔진 등.",
  },
  noise: {
    full: "Noise",
    korean: "노이즈",
    def: "전송 중 신호를 왜곡·변형시키는 요인. Shannon 모델은 물리적 잡음을 전제로 하지만, HAC에서는 의미론적 노이즈가 추가됨.",
    intuition: "전기적 간섭 → 환각·프롬프트 모호성으로 재해석되는 것이 HAC의 핵심.",
  },

  // 프로토콜 기능 (1강)
  protocol: {
    full: "Protocol",
    korean: "프로토콜",
    def: "통신을 원하는 두 개체 간에 무엇을, 어떻게, 언제 통신할 것인지를 서로 약속한 규약. 구문·의미·타이밍의 3요소로 구성.",
  },
  syntax: {
    full: "Syntax",
    korean: "구문",
    def: "데이터 형식이나 신호 수준 등을 규정하는 프로토콜의 기본 요소.",
  },
  semantic: {
    full: "Semantic",
    korean: "의미",
    def: "전송의 조정, 오류 관리를 위한 제어 정보를 규정하는 프로토콜 요소. HAC의 '의미론적 노이즈'는 이 계층의 문제.",
  },
  timing: {
    full: "Timing",
    korean: "타이밍",
    def: "전송 속도 조절 및 전송 순서 조정을 규정하는 프로토콜 요소.",
  },
  encapsulation: {
    full: "Encapsulation",
    korean: "캡슐화",
    def: "각 프로토콜에 적합한 데이터 블록에 플래그·주소·제어 정보·오류검출 부호 등을 부착하는 기능.",
    intuition: "HAI 헤더가 AI 페이로드 외부에 인간용 메타데이터를 붙이는 방식이 바로 캡슐화.",
  },
  flowControl: {
    full: "Flow Control",
    korean: "흐름제어",
    def: "데이터 양이나 통신 속도 등이 수신 측의 처리 능력을 초과하지 않도록 조정하는 기능.",
    intuition: "HAI에서 Impact-Level에 따라 인간 승인 대기를 거는 것은 흐름제어의 차용.",
  },
  errorControl: {
    full: "Error Control",
    korean: "오류제어",
    def: "전송 중 발생 가능한 오류를 검출하고 정정하는 기능.",
  },
  sequencing: {
    full: "Sequencing",
    korean: "순서 결정",
    def: "연결 위주 데이터 전송에서 송신 측이 보내는 데이터 단위 순서대로 수신 측에 전달하는 기능.",
    intuition: "HAI의 Session-ID 체인이 AI 간 대화 순서를 보존하는 것과 같은 원리.",
  },
  priority: {
    full: "Priority",
    korean: "우선순위",
    def: "전송 서비스에서 제공되는 기능으로, 중요도에 따라 통신 객체의 처리 우선순위를 조정함.",
  },
  multiplexing: {
    full: "Multiplexing",
    korean: "다중화",
    def: "하나의 통신로를 여러 개로 나누거나 여러 회선을 하나로 변환해 다수 가입자가 동시에 사용하게 하는 기능.",
    intuition: "멀티모달 HAC에서 텍스트·이미지·음성을 하나의 채널로 통합 전송하는 것과 같은 개념.",
  },
  fragmentation: {
    full: "Fragmentation",
    korean: "단편화",
    def: "송신 측에서 긴 데이터 블록을 크기가 똑같은 작은 블록으로 나누어 전송하는 기능.",
  },

  // OSI 계층
  OSI: {
    full: "Open Systems Interconnection",
    korean: "OSI 참조 모델",
    def: "ISO가 제안한 7계층 개방형 시스템 상호 연결 참조 모델. 각 계층은 고유의 역할과 기능을 수행하며 상호 독립성을 갖도록 설계됨.",
  },
  applicationLayer: {
    full: "Application Layer (Layer 7)",
    korean: "응용 계층",
    def: "사용자에게 OSI 모델로서의 접근과 분산 정보 서비스를 제공하는 최상위 계층. 이메일·파일 전송·웹 브라우징 등.",
  },
  presentationLayer: {
    full: "Presentation Layer (Layer 6)",
    korean: "표현 계층",
    def: "데이터의 표현상 상이점으로부터 응용 프로세스에 독립성 제공. 인코딩/디코딩, 암호화, 압축 등을 처리.",
    intuition: "HAI 헤더의 Intent-Summary(자연어 변환)는 표현 계층의 번역 기능과 유사.",
  },
  sessionLayer: {
    full: "Session Layer (Layer 5)",
    korean: "세션 계층",
    def: "응용 간의 통신을 위한 제어 구조 제공. 접속의 설정·유지·종결, 대화 관리, 동기점 설정.",
  },
  transportLayer: {
    full: "Transport Layer (Layer 4)",
    korean: "전송 계층",
    def: "종점 간(end-to-end)의 신뢰성 있고 투명한 데이터 전송 제공. 오류 복구와 흐름제어 담당. 데이터 단위는 세그먼트.",
  },
  networkLayer: {
    full: "Network Layer (Layer 3)",
    korean: "네트워크 계층",
    def: "시스템 간 데이터 전송과 교환 기법으로부터의 독립성을 상위 계층에 제공. 라우팅 기능 수행. 데이터 단위는 패킷.",
  },
  dataLinkLayer: {
    full: "Data Link Layer (Layer 2)",
    korean: "데이터 링크 계층",
    def: "물리 링크 간 신뢰성 있는 정보 전송을 위해 비트 스트림을 프레임으로 구조화. 동기화·오류제어·흐름제어 담당.",
  },
  physicalLayer: {
    full: "Physical Layer (Layer 1)",
    korean: "물리 계층",
    def: "물리적 전송 매체 상의 비트 스트림 전송 담당. 전압 레벨·핀 배치·케이블 규격 등 기계적·전기적·절차적 특성을 규정.",
  },

  // 전송 방향·동기성
  simplex: {
    full: "Simplex",
    korean: "단방향",
    def: "한쪽에서만 다른 쪽으로 데이터가 흐르는 전송 방식. 수신 측은 응답할 수 없음.",
  },
  halfDuplex: {
    full: "Half-Duplex",
    korean: "반이중",
    def: "양쪽 모두 데이터를 주고받을 수 있으나 동시에는 불가능한 전송 방식. 요청-응답(request-response) 패턴이 대표.",
    intuition: "ChatGPT 텍스트 대화 — 사용자가 말할 때는 AI가 듣고, AI가 답할 때는 사용자가 들음.",
  },
  fullDuplex: {
    full: "Full-Duplex",
    korean: "전이중",
    def: "양쪽이 동시에 데이터를 주고받을 수 있는 전송 방식. 실시간 음성 통화가 대표.",
    intuition: "GPT-4o 음성 모드처럼 발화 중 끼어들기가 가능한 통신.",
  },
  synchronous: {
    full: "Synchronous",
    korean: "동기",
    def: "송·수신 타이밍을 엄격히 일치시키며 데이터를 주고받는 방식. 즉각적 응답을 전제로 함.",
  },
  asynchronous: {
    full: "Asynchronous",
    korean: "비동기",
    def: "송·수신 타이밍이 독립적으로 동작. 데이터 송·수신과 데이터 처리 사이에 비동기성이 존재.",
    intuition: "에이전트 기반 HAC의 다단계 도구 호출은 각 단계가 비동기적으로 진행됨.",
  },

  // HAC 고유 개념
  HAC: {
    full: "Human-AI Communication",
    korean: "인간-AI 통신",
    def: "인간과 인공지능이 디지털 인터페이스를 매개로 자연어 또는 멀티모달 데이터를 교환하며, 상호 간의 의도를 해석하고 응답을 생성하는 양방향 정보통신 과정.",
  },
  HAI: {
    full: "Human Audit Interface",
    korean: "인간 감사 인터페이스",
    def: "AI-to-AI 통신의 모든 메시지에 인간이 해석 가능한 메타데이터(의도 요약·영향도·되돌림 가능 여부 등)를 의무적으로 부착하는 프로토콜 개념.",
    intuition: "응용 계층 상위에 '감사 계층'을 얹어 블랙박스화를 방지하는 설계.",
  },
  blackbox: {
    full: "Black-boxing",
    korean: "블랙박스화",
    def: "AI들이 최적화된 잠재 표현이나 바이너리 프로토콜로 소통하여 인간이 그 내용을 이해할 수 없게 되는 현상. 감독 불가·책임 불명·통제권 상실의 3대 위험을 야기.",
  },
  hallucination: {
    full: "Hallucination",
    korean: "환각",
    def: "LLM이 사실이 아닌 정보를 그럴듯하게 생성하는 현상. HAC에서의 대표적인 의미론적 노이즈.",
  },
  tokenizer: {
    full: "Tokenizer",
    korean: "토크나이저",
    def: "자연어 텍스트를 AI 모델이 처리할 수 있는 토큰 ID 시퀀스로 변환하는 전처리 모듈. HAC 맥락에서는 수신기 혹은 송신기 역할을 분담.",
  },
  embedding: {
    full: "Embedding",
    korean: "임베딩",
    def: "토큰이나 멀티모달 입력을 고차원 실수 벡터로 변환한 표현. AI 내부의 '공통 코드 체계' 역할.",
  },
  MCP: {
    full: "Model Context Protocol",
    korean: "MCP",
    def: "AI 모델과 외부 도구·데이터 소스를 표준화된 방식으로 연결하기 위한 프로토콜. 에이전트 기반 HAC의 대표 규약.",
  },
  impactLevel: {
    full: "Impact-Level",
    korean: "영향도 레벨",
    def: "HAI 헤더 필드 중 하나로, 메시지가 유발할 수 있는 결정의 영향도를 1(무시 가능)~5(치명적)로 수치화함. 영향 범위·재무 영향·되돌림 가능 여부의 3축으로 산정.",
    intuition: "흐름제어의 수신 측 처리 한계와 유사하게, 인간 감독자의 집중 자원을 배분하는 척도.",
  },
  humanInTheLoop: {
    full: "Human-in-the-Loop",
    korean: "인간 개입형",
    def: "AI 의사결정 흐름 중간에 인간의 검토·승인을 삽입하는 설계 원칙. Impact-Level에 따라 선택적으로 적용됨.",
  },
  reversibility: {
    full: "Reversibility",
    korean: "되돌림 가능성",
    def: "AI가 내린 결정을 사후에 원상복구할 수 있는지 여부. HAI 헤더의 Reversible 필드로 표현.",
  },
  auditTrail: {
    full: "Audit Trail",
    korean: "감사 로그",
    def: "하나의 작업에 관련된 모든 AI-to-AI 메시지를 Session-ID 체인으로 연결해 사후 추적 가능하게 만드는 기록.",
  },
  intentSummary: {
    full: "Intent-Summary",
    korean: "의도 요약",
    def: "HAI 헤더 필드 중 하나로, 메시지의 의도를 인간이 읽을 수 있는 자연어로 요약한 것.",
  },
};

export default function NetworkTerm({
  term,
  label,
  className = "",
  tooltipSide = "bottom",
}: {
  term: string;
  label?: string;
  className?: string;
  tooltipSide?: "top" | "bottom";
}) {
  const [open, setOpen] = useState(false);
  const info = TERMS[term];
  const displayLabel = label ?? term;

  if (!info) return <span className={className}>{displayLabel}</span>;

  return (
    <span
      className={`relative inline-flex items-center gap-0.5 ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span>{displayLabel}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-orange-600 focus:text-orange-600 focus:outline-none"
        aria-label={`${info.full} (${info.korean}) 설명 보기`}
        title={`${info.full} (${info.korean})`}
      >
        <HelpCircle size={11} strokeWidth={2.5} />
      </button>
      {open && (
        <div
          role="tooltip"
          className={`absolute left-1/2 z-50 w-64 -translate-x-1/2 rounded-lg border-2 border-orange-300 bg-white p-3 text-left font-normal normal-case shadow-xl dark:border-orange-700 dark:bg-gray-900 ${
            tooltipSide === "top"
              ? "bottom-[calc(100%+6px)]"
              : "top-[calc(100%+6px)]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[11px] font-bold tracking-normal text-orange-700 dark:text-orange-300">
            {info.full}
          </div>
          <div className="text-[10px] text-gray-500">{info.korean}</div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-gray-700 dark:text-gray-300">
            {info.def}
          </p>
          {info.formula && (
            <div className="mt-1.5 rounded bg-orange-50 px-2 py-1 font-mono text-[10px] text-orange-800 dark:bg-orange-950/40 dark:text-orange-200">
              {info.formula}
            </div>
          )}
          {info.intuition && (
            <div className="mt-1.5 flex items-start gap-1 border-l-2 border-orange-400 bg-orange-50/40 py-1 pl-2 pr-1 text-[10px] text-gray-700 dark:bg-orange-950/20 dark:text-gray-300">
              <Lightbulb
                size={10}
                className="mt-0.5 shrink-0 text-orange-500"
              />
              <span>{info.intuition}</span>
            </div>
          )}
        </div>
      )}
    </span>
  );
}
