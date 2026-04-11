"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface MethodInfo {
  label: string;
  desc: string;
  example: string;
}

const methodInfo: Record<Method, MethodInfo> = {
  GET: {
    label: "GET",
    desc: "서버의 자원을 조회. 요청 보디 없이 URL로 자원 식별.",
    example: "GET /index.html HTTP/1.1\nHost: www.knou.ac.kr\nAccept-Language: ko-KR",
  },
  POST: {
    label: "POST",
    desc: "서버에 새로운 데이터를 제출. 메시지 보디에 전달할 내용을 포함.",
    example:
      "POST /login HTTP/1.1\nHost: www.knou.ac.kr\nContent-Type: application/x-www-form-urlencoded\n\nid=stuser&pw=1234",
  },
  PUT: {
    label: "PUT",
    desc: "자원을 교체하거나 생성. 해당 URI로 식별되는 자원 전체를 덮어쓰기.",
    example:
      "PUT /users/7 HTTP/1.1\nHost: www.knou.ac.kr\nContent-Type: application/json\n\n{\"name\": \"KNOU\"}",
  },
  DELETE: {
    label: "DELETE",
    desc: "지정한 URI의 자원을 삭제.",
    example: "DELETE /users/7 HTTP/1.1\nHost: www.knou.ac.kr",
  },
};

const timeline = [
  { year: "1989", event: "팀 버너스리(Tim Berners-Lee), CERN에서 WWW 제안" },
  { year: "1990", event: "최초의 웹 브라우저 · 서버 구현" },
  { year: "1991", event: "HTTP/0.9 공개, 전 세계 웹 서비스 확산" },
  { year: "1996", event: "HTTP/1.0 표준화" },
  { year: "1997", event: "HTTP/1.1 발표, 현재까지 기본 버전으로 사용" },
];

export default function HTTPRequestResponse() {
  const [method, setMethod] = useState<Method>("GET");
  const [showStateless, setShowStateless] = useState(false);
  const [showCookie, setShowCookie] = useState(false);

  return (
    <section>
      <SectionTitle
        title="HTTP 요청/응답 메시지"
        subtitle="팀 버너스리 WWW부터 무상태 특성·메시지 구조까지"
      />

      <div className="space-y-4">
        {/* Timeline */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h4 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">
            WWW 히스토리
          </h4>
          <ol className="relative ml-2 border-l-2 border-red-200 pl-4 dark:border-red-900">
            {timeline.map((t) => (
              <li key={t.year} className="mb-3 last:mb-0">
                <div className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full border-2 border-red-500 bg-white dark:bg-gray-900" />
                <div className="text-xs font-bold text-red-600 dark:text-red-300">
                  {t.year}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {t.event}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Request/Response structure */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">
                REQUEST
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                요청 메시지 구조
              </span>
            </div>
            <div className="space-y-1">
              <div className="rounded bg-red-50 px-3 py-2 text-xs dark:bg-red-900/20">
                <span className="font-semibold">요청 라인</span>{" "}
                <span className="text-gray-500">메소드 · URI · HTTP 버전</span>
              </div>
              <div className="rounded bg-gray-50 px-3 py-2 text-xs dark:bg-gray-800">
                <span className="font-semibold">헤더</span>{" "}
                <span className="text-gray-500">Host, Accept-Language 등</span>
              </div>
              <div className="rounded border border-dashed border-gray-300 px-3 py-1 text-[11px] text-gray-500 dark:border-gray-600">
                공백 라인 (필수)
              </div>
              <div className="rounded bg-gray-50 px-3 py-2 text-xs dark:bg-gray-800">
                <span className="font-semibold">메시지 보디</span>{" "}
                <span className="text-gray-500">POST/PUT 시 데이터</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded bg-gray-700 px-2 py-0.5 text-[11px] font-bold text-white">
                RESPONSE
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                응답 메시지 구조
              </span>
            </div>
            <div className="space-y-1">
              <div className="rounded bg-red-50 px-3 py-2 text-xs dark:bg-red-900/20">
                <span className="font-semibold">상태 라인</span>{" "}
                <span className="text-gray-500">
                  HTTP 버전 · 응답 코드 · 상태
                </span>
              </div>
              <div className="rounded bg-gray-50 px-3 py-2 text-xs dark:bg-gray-800">
                <span className="font-semibold">헤더</span>{" "}
                <span className="text-gray-500">Content-Type, Date 등</span>
              </div>
              <div className="rounded border border-dashed border-gray-300 px-3 py-1 text-[11px] text-gray-500 dark:border-gray-600">
                공백 라인 (필수)
              </div>
              <div className="rounded bg-gray-50 px-3 py-2 text-xs dark:bg-gray-800">
                <span className="font-semibold">메시지 보디</span>{" "}
                <span className="text-gray-500">HTML 본문 등</span>
              </div>
            </div>
          </div>
        </div>

        {/* Method tabs */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h4 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">
            요청 메소드 · 예시
          </h4>
          <div className="mb-3 flex flex-wrap gap-2">
            {(Object.keys(methodInfo) as Method[]).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  method === m
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-red-50 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={method}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <p className="mb-2 text-xs text-gray-600 dark:text-gray-400">
                {methodInfo[method].desc}
              </p>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-3 text-[11px] leading-relaxed text-green-300">
{methodInfo[method].example}
              </pre>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Stateless + Cookie toggles */}
        <div className="grid gap-3 md:grid-cols-2">
          <button
            onClick={() => setShowStateless((v) => !v)}
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-left transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:hover:bg-red-900/30"
          >
            <div className="text-sm font-bold text-red-700 dark:text-red-300">
              무상태(Stateless) · 비연결성(Connectionless) {showStateless ? "▼" : "▶"}
            </div>
            <AnimatePresence>
              {showStateless && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="mt-2 text-xs text-gray-700 dark:text-gray-300">
                    모든 요청과 응답은 이전의 것들과 상관없이 독립적. 해당 요청에
                    필요한 모든 정보를 처음부터 보내야 함. 불특정 다수를 대상으로
                    하는 서비스에 적합.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={() => setShowCookie((v) => !v)}
            className="rounded-xl border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-red-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-red-900/10"
          >
            <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
              쿠키(Cookie) · 세션(Session) 보완 {showCookie ? "▼" : "▶"}
            </div>
            <AnimatePresence>
              {showCookie && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    무상태의 단점을 보완하기 위해 쿠키(Cookie), 세션(Session) 등을
                    사용하여 사용자 상태를 유지. 로그인, 장바구니 등 지속적인
                    맥락이 필요한 서비스에 적용.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </section>
  );
}
