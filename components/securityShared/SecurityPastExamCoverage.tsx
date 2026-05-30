import Link from "next/link";
import { BookOpenCheck, CheckCircle2, FileText, ListChecks } from "lucide-react";
import { securityLectures } from "@/lib/constants";
import { securityPastExamQuestions } from "@/components/securityPastExam/data";

type CoveragePoint = {
  concept: string;
  source: string;
  examNeed: string;
  reinforcement: string;
  tags: string[];
};

const coverageNotes: Record<number, CoveragePoint[]> = {
  1: [
    {
      concept: "정보보호 정의와 범위",
      source: "강의 1강·교재 1장: 정보보호는 저장·처리·전달 중인 정보를 허락되지 않은 접근·수정·훼손·유출로부터 보호하는 정책과 기법",
      examNeed: "2019년 36번은 전달 중인 정보만 보호 대상으로 보거나 컴퓨터 보안을 정보보호보다 넓게 보는 설명을 배제해야 한다.",
      reinforcement: "기본 개념은 정보의 상태, 위협 유형, 컴퓨터 보안의 포함관계를 한 번에 비교하도록 보강.",
      tags: ["정보보호", "포함관계", "위협"],
    },
    {
      concept: "CIA triad와 부가 목표",
      source: "강의 1강·교재 1장: 기밀성, 무결성, 가용성이 핵심목표이며 인증·접근제어·부인방지는 구분되는 보안 서비스",
      examNeed: "2017~2019년 반복 문항은 기밀성·무결성·가용성 정의와 부인방지, 인증, 접근제어의 오답 경계를 묻는다.",
      reinforcement: "목표별 침해 사례와 부가 목표의 역할 차이를 기본 개념 카드와 퀴즈에서 함께 설명.",
      tags: ["CIA", "인증", "부인방지"],
    },
  ],
  2: [
    {
      concept: "암호 기본 용어",
      source: "강의 2강·교재 2장: 평문, 암호문, 암호화, 복호화, 키의 방향과 역할",
      examNeed: "2017년 38번, 2019년 39번은 평문·암호문·복호화·암호화 정의를 바꿔 놓은 선택지를 배제해야 한다.",
      reinforcement: "용어 정의를 변환 방향 중심으로 재정리하고, 키가 암호화와 복호화 모두에 중요하다는 기준을 명시.",
      tags: ["평문", "암호문", "키"],
    },
    {
      concept: "전치법·치환법과 스파르타 봉 암호",
      source: "강의 2강·교재 2장: 전치법은 문자 위치를 바꾸고, 치환법은 문자를 다른 문자로 대체",
      examNeed: "2017년 39번은 봉 암호 후보 배열을, 2018년 39번과 2019년 40번은 전치·치환 설명을 구분한다.",
      reinforcement: "숫자 배열 후보도 단순 정답 비교가 아니라 전치 규칙 후보인지 설명하도록 보강.",
      tags: ["전치", "치환", "스파르타 봉"],
    },
    {
      concept: "대칭키·공개키 암호",
      source: "강의 2강·교재 2장: 대칭키는 같은 비밀키, 공개키는 공개키·개인키 한 쌍 사용",
      examNeed: "2017~2019년은 AES/DES/IDEA와 RSA/ECC/ElGamal의 분류, 키 개수, 속도와 키 분배 문제를 반복해서 묻는다.",
      reinforcement: "알고리즘명과 키 구조를 같은 표에서 연결하고, 공개키 암호의 속도와 키 분배 장단점을 분리 설명.",
      tags: ["AES", "RSA", "키 구조"],
    },
  ],
  3: [
    {
      concept: "메시지 인증과 MAC",
      source: "강의 3강·교재 3장: 메시지 인증은 전송 중 메시지가 정확·완전하게 수신되었는지 확인하며 HMAC은 해시 기반, CMAC은 블록 암호 기반",
      examNeed: "2017년 42번은 HMAC을 공개키 기반으로 잘못 연결한 선택지를 배제해야 한다.",
      reinforcement: "메시지 인증의 무결성 확인 기능과 MAC 계열의 기반 기술 차이를 선택지별 해설에 반영.",
      tags: ["메시지 인증", "HMAC", "CMAC"],
    },
    {
      concept: "사용자 인증 방식",
      source: "강의 3강·교재 3장: 비밀번호는 지식 기반, 토큰·스마트카드는 소유 기반, 지문·홍채·음성은 생체 기반",
      examNeed: "2017년 43번, 2018년 42번, 2019년 43번은 인증 요소와 저장 해시코드 개념을 묻는다.",
      reinforcement: "비밀번호 자체 저장 대신 해시코드를 저장하는 기준과 토큰·생체의 판별 기준을 기본 개념에 연결.",
      tags: ["비밀번호", "해시코드", "토큰"],
    },
  ],
  4: [
    {
      concept: "악성코드 분류",
      source: "강의 4강·교재 4장: 바이러스, 웜, 트로이 목마, 백도어, 랜섬웨어는 감염 방식과 목적이 다름",
      examNeed: "보기의 가/나/다 라벨로 제시된 2017~2019년 문항은 라벨을 실제 악성코드명으로 확장해 읽어야 한다.",
      reinforcement: "라벨 선택지를 바이러스·웜·트로이 목마·백도어·랜섬웨어 본문으로 확장하고 각 오답 개념을 따로 설명.",
      tags: ["바이러스", "웜", "랜섬웨어"],
    },
    {
      concept: "사이버 공격 유형",
      source: "강의 4강·교재 4장: 스캐닝, 스푸핑, 스니핑, DoS/DDoS, 버퍼 오버플로, 사전 공격, 사회공학은 행위와 결과로 구분",
      examNeed: "2017~2019년은 도청, 가장, 취약점 수집, 가용성 저하, 계정 대입 같은 사례를 공격명으로 바꾸는 능력을 요구한다.",
      reinforcement: "각 공격의 동작 단서를 기본 개념에 세로 목록으로 묶고, 기출 해설은 선택지 본문 자체를 기준으로 판별.",
      tags: ["스푸핑", "스니핑", "DDoS"],
    },
  ],
  5: [
    {
      concept: "서버 침입 단계",
      source: "강의 5강·교재 5장: 정보획득, 권한획득, 공격, 재침입 준비 또는 은닉 단계로 침입 흐름을 분석",
      examNeed: "2018년 46번은 백도어 설치를 재침입 준비와 연결하고, 침입흔적 삭제를 공격 단계로 섞은 설명을 구분한다.",
      reinforcement: "단계별 행위를 순서 암기가 아니라 목적별로 설명해 오답 선택지의 단계 혼동을 잡도록 보강.",
      tags: ["정보획득", "권한획득", "재침입"],
    },
  ],
  6: [
    {
      concept: "수동적 공격과 능동적 공격",
      source: "강의 6강·교재 6장: 수동적 공격은 무단 취득·도청, 능동적 공격은 데이터 변조·위조",
      examNeed: "2017년 48번은 암호화와 무결성 확인이 각각 어떤 공격 대응에 가까운지 묻는다.",
      reinforcement: "수동적 공격 대응은 회선 데이터 암호화, 능동적 공격 대응은 변조 확인과 무결성 검사로 분리 설명.",
      tags: ["수동적 공격", "능동적 공격", "무결성"],
    },
    {
      concept: "네트워크 보안 목표와 IPsec",
      source: "강의 6강·교재 6장: 네트워크 보안 목표에는 기밀성·무결성·가용성·인증·접근제어·부인방지가 포함되고, IPsec은 IP 데이터그램 보호 메커니즘",
      examNeed: "2017년 49번, 2019년 49번은 목표 목록과 IPsec·SSL·TLS·MAC의 역할을 구분한다.",
      reinforcement: "IPsec을 네트워크 계층 보호로, SSL/TLS를 전송 계층 보안으로, MAC을 무결성 확인 값으로 구분해 기술.",
      tags: ["IPsec", "SSL/TLS", "MAC"],
    },
  ],
  7: [
    {
      concept: "방화벽 구축 형태",
      source: "강의 7강·교재 7장: 스크리닝 라우터, 베스천 호스트, 스크린 호스트 게이트웨이, 스크린 서브넷 게이트웨이를 구분",
      examNeed: "2017년 50~51번, 2018년 48번은 트래픽 통제, DMZ, 애플리케이션 게이트웨이의 단서를 묻는다.",
      reinforcement: "DMZ는 스크린 서브넷 게이트웨이, 프록시 기반 응용 계층 처리는 애플리케이션 게이트웨이로 연결.",
      tags: ["방화벽", "DMZ", "프록시"],
    },
    {
      concept: "VPN 기반 기술과 운용 기준",
      source: "강의 7강·교재 7장: VPN 기반 기술은 터널링, 키 관리, VPN 관리이며 QoS와 비용 절감 요구를 함께 다룸",
      examNeed: "2017년 53번, 2018년 51번, 2019년 51번은 터널링과 공중망 기반 사설망 운용 설명을 반복한다.",
      reinforcement: "멀티캐스트는 VPN 기반 기술이 아님을 명시하고, 높은 비용·QoS 미제공 같은 오답 문장을 교재 기준으로 배제.",
      tags: ["VPN", "터널링", "QoS"],
    },
  ],
  8: [
    {
      concept: "IDS 구성요소",
      source: "강의 8강·교재 8장: IDS는 모니터링부, 분석 및 조치부, 관리부로 구성",
      examNeed: "2018년 49번은 관리부의 역할을 보고 및 조치로만 좁히는 선택지를 배제해야 한다.",
      reinforcement: "정보수집, 분석·침입탐지, 통제·관리·보안정책 제공의 담당 부위를 구분해 설명.",
      tags: ["IDS", "모니터링", "관리부"],
    },
    {
      concept: "IDS 분석 방법",
      source: "강의 8강·교재 8장: 시그니처 분석, 통계적 분석, 무결성 분석을 기본 분류로 사용",
      examNeed: "2017년 52번, 2018년 50번, 2019년 50번은 알려진 패턴, 미지 공격 탐지, 오탐, 실시간성의 차이를 묻는다.",
      reinforcement: "임의적 분석은 기본 분류가 아님을 명시하고, 무결성 분석을 실시간 대응에 적합하다고 단정하는 오답을 배제.",
      tags: ["시그니처", "통계적 분석", "무결성 분석"],
    },
  ],
  9: [
    {
      concept: "PGP 서비스와 키",
      source: "강의 9강·교재 9장: PGP는 인증, 기밀성, 압축, 전자우편 호환성을 제공하며 세션키·공개키·개인키를 사용",
      examNeed: "2017년 54번, 2018년 52번은 평문구문과 유니코드 변환 같은 혼동 선택지를 배제해야 한다.",
      reinforcement: "전자우편 호환성은 Unicode가 아니라 Radix-64 같은 인쇄 가능한 문자 부호화와 연결한다고 보강.",
      tags: ["PGP", "세션키", "Radix-64"],
    },
    {
      concept: "Radix-64 계산과 S/MIME 구성",
      source: "강의 9강·교재 9장: Radix-64는 6비트 단위 문자 변환이며, S/MIME은 봉인·서명·클리어 서명·서명 및 봉인 데이터 형식을 구분",
      examNeed: "2018년 53~54번, 2019년 53~54번은 바이트를 비트로 바꾼 뒤 6비트 단위로 나누고 S/MIME 메시지 구성을 판별한다.",
      reinforcement: "6바이트는 8문자, 9바이트는 12문자로 계산하도록 해설을 수치화하고, 클리어 서명과 서명된 데이터의 base64 적용 범위를 분리.",
      tags: ["S/MIME", "base64", "계산"],
    },
    {
      concept: "일반 전자우편의 노출과 변조 위험",
      source: "강의 9강·교재 9장: 일반 전자우편은 송수신자 주소와 내용 노출, 전송 중 변조 가능성을 고려",
      examNeed: "2019년 52번은 도청은 가능하지만 변조는 불가능하다는 문장을 배제한다.",
      reinforcement: "메일 보안 필요성을 기밀성뿐 아니라 무결성 보호까지 연결해 기술.",
      tags: ["메일 보안", "도청", "변조"],
    },
  ],
  10: [
    {
      concept: "웹 공격과 접근제어 실패",
      source: "강의 10강·교재 10장: SQL injection, XSS, 접근제어 실패, 웹 서버 공격은 공격 지점과 방식이 다름",
      examNeed: "2017~2019년은 악성 스크립트 실행, DB 질의 조작, URL 사용자 ID 노출, 관리자 페이지 권한 설정을 구분한다.",
      reinforcement: "관리자 링크 숨김은 권한 설정이 아니며, URL 식별자 노출은 접근제어 실패 위험으로 설명.",
      tags: ["SQL injection", "XSS", "접근제어"],
    },
    {
      concept: "웹 보안 적용 범위",
      source: "강의 10강·교재 10장: 네트워크 부분은 SSL/TLS 적용이 가능하지만 클라이언트, 서버, 응용, DB 보안은 별도 대책 필요",
      examNeed: "2019년 55번은 웹 클라이언트 부분을 백신으로만 해결할 수 있다는 선택지를 배제해야 한다.",
      reinforcement: "웹 서버 취약점 점검·보안 패치, 디렉터리 목록 비활성화, 클라이언트 스크립트 위험을 함께 기술.",
      tags: ["SSL/TLS", "웹 서버", "클라이언트"],
    },
    {
      concept: "무선 LAN 보안 발전",
      source: "강의 10강·교재 10장: WEP 취약성 이후 TKIP, WPA, RSN, CCMP, EAP 중심으로 보안이 강화",
      examNeed: "2017년 58번, 2018년 57번, 2019년 57번은 WEP, TKIP, WPA, RSN 구성요소를 묻는다.",
      reinforcement: "WEP는 취약한 초기 기밀성 알고리즘, TKIP는 WEP 장비 보완, RSN은 802.11i 보안 네트워크로 정리.",
      tags: ["WEP", "TKIP", "RSN"],
    },
  ],
  11: [
    {
      concept: "디지털 증거와 특성",
      source: "강의 11강·교재 11장: 디지털 증거는 저장매체·네트워크에서 생성·저장·전송되며 비가시성, 변조 가능성, 휘발성, 대규모성, 초국경성을 가짐",
      examNeed: "2017년 59~60번, 2018년 59번, 2019년 58~59번은 증거 매체와 특성의 예외를 묻는다.",
      reinforcement: "종이사전·진주목걸이처럼 디지털 저장·처리 기능이 없는 사물과 USB·블랙박스·디지털 액자를 구분.",
      tags: ["디지털 증거", "휘발성", "초국경성"],
    },
    {
      concept: "포렌식 절차와 원칙",
      source: "강의 11강·교재 11장: 절차는 사전준비, 증거수집, 포장 및 이송, 조사분석, 정밀검토, 보고서 작성 순서이며 적법절차·원본보존·무결성·반복성이 요구",
      examNeed: "2018년 58~60번은 절차 순서와 분석결과의 반복성 기준을 묻는다.",
      reinforcement: "비반복성은 오답이며, 같은 절차로 다시 확인 가능한 반복성이 포렌식 결과의 신뢰 조건임을 명시.",
      tags: ["절차", "무결성", "반복성"],
    },
    {
      concept: "안티 포렌식",
      source: "강의 11강·교재 11장: 완전 삭제, 메타데이터 변조, 암호화 등은 증거 수집과 분석을 방해",
      examNeed: "2019년 60번은 증거물을 온전하게 남기려는 활동을 안티 포렌식으로 볼 수 없음을 묻는다.",
      reinforcement: "안티 포렌식은 포렌식 보존 활동이 아니라 분석 방해 활동이라는 기준으로 설명.",
      tags: ["안티 포렌식", "완전 삭제", "암호화"],
    },
  ],
};

function formatQuestion(question: (typeof securityPastExamQuestions)[number]) {
  return `${question.year}-${question.number}`;
}

export default function SecurityPastExamCoverage({ lectureId }: { lectureId: number }) {
  const lecture = securityLectures.find((item) => item.id === lectureId);
  const questions = securityPastExamQuestions.filter((question) =>
    question.lectureRefs.some((ref) => ref.lectureId === lectureId)
  );
  const notes = coverageNotes[lectureId] ?? [];

  if (questions.length === 0 && notes.length === 0) return null;

  const conceptCounts = Array.from(
    questions.reduce<Map<string, number>>((acc, question) => {
      const concept = question.lectureRefs.find((ref) => ref.lectureId === lectureId)?.concept;
      if (concept) acc.set(concept, (acc.get(concept) ?? 0) + 1);
      return acc;
    }, new Map())
  );

  return (
    <section className="rounded-xl border border-cyan-200 bg-cyan-50/70 p-5 dark:border-cyan-900 dark:bg-cyan-950/20">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-3 py-1 text-xs font-bold text-white">
            <BookOpenCheck size={14} />
            기출 개념 커버리지
          </div>
          <h2 className="text-xl font-bold text-gray-950 dark:text-gray-50">
            {lectureId}강 기본 개념이 설명해야 하는 기출 범위
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
            2017~2019 기출에서 이 강의로 연결된 문항을 기준으로, 부족했던 설명은 강의·교재 기준으로 보강했습니다.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-3">
          <div className="rounded-lg border border-cyan-200 bg-white px-3 py-2 dark:border-cyan-900 dark:bg-gray-950">
            <div className="font-mono text-lg font-bold text-cyan-800 dark:text-cyan-100">
              {questions.length}
            </div>
            <div className="text-gray-500">문항</div>
          </div>
          <div className="rounded-lg border border-cyan-200 bg-white px-3 py-2 dark:border-cyan-900 dark:bg-gray-950">
            <div className="font-mono text-lg font-bold text-cyan-800 dark:text-cyan-100">
              {conceptCounts.length}
            </div>
            <div className="text-gray-500">개념축</div>
          </div>
          <div className="rounded-lg border border-cyan-200 bg-white px-3 py-2 dark:border-cyan-900 dark:bg-gray-950 max-sm:col-span-2">
            <div className="font-mono text-lg font-bold text-cyan-800 dark:text-cyan-100">
              {notes.length}
            </div>
            <div className="text-gray-500">보강 포인트</div>
          </div>
        </div>
      </div>

      <div className="mb-5 grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-cyan-200 bg-white p-4 dark:border-cyan-900 dark:bg-gray-950">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
            <ListChecks size={16} />
            연결 문항
          </div>
          <div className="flex flex-wrap gap-2">
            {questions.map((question) => (
              <Link
                key={question.id}
                href="/security/past-exam"
                className="rounded-lg bg-cyan-100 px-2.5 py-1 text-xs font-bold text-cyan-800 transition-colors hover:bg-cyan-200 dark:bg-cyan-950 dark:text-cyan-100 dark:hover:bg-cyan-900"
              >
                {formatQuestion(question)}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-cyan-200 bg-white p-4 dark:border-cyan-900 dark:bg-gray-950">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
            <FileText size={16} />
            개념별 출제량
          </div>
          <div className="flex flex-wrap gap-2">
            {conceptCounts.map(([concept, count]) => (
              <span
                key={concept}
                className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:border-gray-800 dark:text-gray-300"
              >
                {concept} {count}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <article
            key={note.concept}
            className="rounded-lg border border-cyan-200 bg-white p-4 dark:border-cyan-900 dark:bg-gray-950"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-cyan-700 px-2.5 py-1 text-xs font-bold text-white">
                {lecture?.title ?? `${lectureId}강`}
              </span>
              <h3 className="text-base font-bold text-gray-950 dark:text-gray-50">
                {note.concept}
              </h3>
              {note.tags.map((tag) => (
                <span
                  key={`${note.concept}-${tag}`}
                  className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-900 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              <div>
                <div className="mb-1 text-xs font-bold uppercase text-cyan-700 dark:text-cyan-200">
                  강의·교재 근거
                </div>
                <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                  {note.source}
                </p>
              </div>
              <div>
                <div className="mb-1 text-xs font-bold uppercase text-cyan-700 dark:text-cyan-200">
                  기출 요구
                </div>
                <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                  {note.examNeed}
                </p>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-1 text-xs font-bold uppercase text-cyan-700 dark:text-cyan-200">
                  <CheckCircle2 size={13} />
                  보강 내용
                </div>
                <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                  {note.reinforcement}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
