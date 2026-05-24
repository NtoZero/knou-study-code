"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail, Lock, AlertTriangle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

interface TimelineStage {
  id: string;
  name: string;
  year: string;
  color: string;
  bgLight: string;
  border: string;
  textColor: string;
  badge: string;
  shortDesc: string;
  details: string[];
  limitation: string;
}

const THREATS = [
  {
    icon: <AlertTriangle size={20} />,
    label: "도청",
    en: "Eavesdropping",
    desc: "전송 중인 이메일을 제3자가 몰래 읽는 공격. 기밀성(Confidentiality)을 위협.",
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-300",
  },
  {
    icon: <Lock size={20} />,
    label: "위조",
    en: "Spoofing / Masquerade",
    desc: "발신자 주소를 속여 다른 사람인 척 이메일을 보내는 공격. 인증(Authentication)을 위협.",
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-300",
  },
  {
    icon: <Mail size={20} />,
    label: "변조",
    en: "Modification",
    desc: "이메일 내용을 전송 중에 몰래 바꾸는 공격. 무결성(Integrity)을 위협.",
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-300",
  },
];

const TIMELINE: TimelineStage[] = [
  {
    id: "smtp",
    name: "SMTP",
    year: "1982",
    color: "bg-gray-500",
    bgLight: "bg-gray-50 dark:bg-gray-800/40",
    border: "border-gray-400",
    textColor: "text-gray-700 dark:text-gray-300",
    badge: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    shortDesc: "Simple Mail Transfer Protocol — 초기 이메일 프로토콜",
    details: [
      "ASCII 텍스트만 전송 가능",
      "첨부파일(바이너리) 전송 불가",
      "암호화·인증·서명 기능 전무",
      "RFC 821(1982) 표준화",
    ],
    limitation: "텍스트 전용, 보안 없음",
  },
  {
    id: "mime",
    name: "MIME",
    year: "1992",
    color: "bg-blue-500",
    bgLight: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-400",
    textColor: "text-blue-700 dark:text-blue-300",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-800/40 dark:text-blue-300",
    shortDesc: "Multipurpose Internet Mail Extensions — SMTP 확장",
    details: [
      "멀티파트(multipart) 메시지 구조 지원",
      "Base64·Quoted-Printable 인코딩으로 바이너리 전송",
      "Content-Type 헤더로 파일 형식 명시",
      "이미지, 오디오, 첨부파일 전송 가능",
      "여전히 암호화·서명 기능 없음",
    ],
    limitation: "바이너리 지원, 여전히 보안 없음",
  },
  {
    id: "smime",
    name: "S/MIME",
    year: "1995",
    color: "bg-rose-600",
    bgLight: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-500",
    textColor: "text-rose-700 dark:text-rose-300",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-800/40 dark:text-rose-300",
    shortDesc: "Secure/MIME — MIME + 보안 기능",
    details: [
      "MIME 구조 위에 보안 계층 추가",
      "디지털 서명으로 발신자 인증 + 무결성 보장",
      "AES 암호화로 기밀성 보장",
      "X.509 인증서 기반 PKI 신뢰 모델",
      "이메일 클라이언트(Outlook 등)에 내장 지원",
    ],
    limitation: "완전한 이메일 보안 솔루션",
  },
];

const MIME_CONTENT_TYPES = [
  { type: "Text", sub: "text/plain, text/html", desc: "일반 텍스트 또는 HTML 형식" },
  { type: "Multipart", sub: "multipart/mixed, multipart/alternative", desc: "여러 파트로 구성된 복합 메시지" },
  { type: "Message", sub: "message/rfc822", desc: "이메일 메시지 자체를 포함" },
  { type: "Image", sub: "image/jpeg, image/png", desc: "이미지 파일 첨부" },
  { type: "Video", sub: "video/mp4, video/mpeg", desc: "동영상 파일 첨부" },
  { type: "Audio", sub: "audio/mpeg, audio/wav", desc: "오디오 파일 첨부" },
  { type: "Application", sub: "application/pdf, application/zip", desc: "기타 이진 데이터 (문서, 압축파일 등)" },
];

const MIME_ENCODINGS = [
  { enc: "7bit", desc: "7비트 ASCII 텍스트만 전송 가능. 기본값.", safe: true },
  { enc: "8bit", desc: "8비트 데이터 전송. 일부 서버에서 지원.", safe: true },
  { enc: "binary", desc: "원시 이진 데이터. 대부분 서버에서 처리 불가.", safe: false },
  { enc: "quoted-printable", desc: "가독성 텍스트 + 일부 이진 문자 인코딩. 유럽어 문자에 적합.", safe: true },
  { enc: "base64", desc: "이진 데이터를 64개 ASCII 문자로 인코딩. 범용적으로 사용.", safe: true },
  { enc: "x-token", desc: "비표준 확장 인코딩. 구현별로 다름.", safe: false },
];

export default function EmailSecurityOverview() {
  const [openStage, setOpenStage] = useState<string | null>("smime");
  const [threatOpen, setThreatOpen] = useState(false);
  const [showMimeDetail, setShowMimeDetail] = useState(false);

  return (
    <section>
      <SectionTitle
        title="이메일 보안의 필요성과 프로토콜 발전"
        subtitle="SMTP → MIME → S/MIME 발전 과정과 이메일 보안 위협"
      />

      {/* 이메일 위협 카드 */}
      <div className="mb-8">
        <button
          onClick={() => setThreatOpen((v) => !v)}
          className="mb-3 flex w-full items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-left dark:border-rose-800 dark:bg-rose-900/20"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-rose-600" />
            <span className="font-bold text-rose-700 dark:text-rose-300">
              왜 이메일 보안이 필요한가? — 3가지 핵심 위협
            </span>
          </div>
          <motion.div animate={{ rotate: threatOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={18} className="text-rose-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {threatOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="grid gap-3 sm:grid-cols-3">
                {THREATS.map((t) => (
                  <div
                    key={t.label}
                    className={`rounded-xl border ${t.border} ${t.bg} p-4`}
                  >
                    <div className={`flex items-center gap-2 font-bold ${t.color}`}>
                      {t.icon}
                      <span>{t.label}</span>
                      <span className="text-xs font-normal text-gray-500">({t.en})</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 타임라인 */}
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">
        이메일 프로토콜 발전 타임라인
      </h3>

      {/* 가로 화살표 진행선 */}
      <div className="mb-6 hidden sm:flex items-center gap-0">
        {TIMELINE.map((stage, i) => (
          <div key={stage.id} className="flex items-center flex-1">
            <button
              onClick={() => setOpenStage((v) => (v === stage.id ? null : stage.id))}
              className={`flex-1 rounded-xl border-2 ${stage.border} ${stage.bgLight} px-4 py-3 text-center transition-all hover:shadow-md ${openStage === stage.id ? "shadow-md" : ""}`}
            >
              <div className={`text-lg font-black ${stage.textColor}`}>{stage.name}</div>
              <div className="text-xs text-gray-500">{stage.year}</div>
              <div className="mt-1 text-xs font-medium text-gray-600 dark:text-gray-400 line-clamp-1">
                {stage.shortDesc.split(" — ")[1]}
              </div>
            </button>
            {i < TIMELINE.length - 1 && (
              <div className="flex items-center px-1">
                <div className="h-0.5 w-4 bg-gray-300" />
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid transparent",
                    borderLeft: "8px solid #d1d5db",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 모바일 세로 타임라인 */}
      <div className="sm:hidden space-y-3 mb-6">
        {TIMELINE.map((stage) => (
          <button
            key={stage.id}
            onClick={() => setOpenStage((v) => (v === stage.id ? null : stage.id))}
            className={`w-full rounded-xl border-2 ${stage.border} ${stage.bgLight} px-4 py-3 text-left transition-all`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className={`font-black ${stage.textColor}`}>{stage.name}</span>
                <span className="ml-2 text-xs text-gray-500">{stage.year}</span>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${openStage === stage.id ? "rotate-180" : ""}`} />
            </div>
          </button>
        ))}
      </div>

      {/* 상세 펼침 */}
      <AnimatePresence mode="wait">
        {openStage && (() => {
          const stage = TIMELINE.find((s) => s.id === openStage)!;
          return (
            <motion.div
              key={openStage}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className={`rounded-xl border-2 ${stage.border} bg-white p-5 dark:bg-gray-900`}
            >
              <div className="mb-3 flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${stage.badge}`}>
                  {stage.name} ({stage.year})
                </span>
                <span className="text-sm text-gray-500">{stage.shortDesc}</span>
              </div>
              <ul className="mb-4 space-y-2">
                {stage.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${stage.color}`} />
                    {d}
                  </li>
                ))}
              </ul>
              <div className={`rounded-lg ${stage.bgLight} border ${stage.border} px-4 py-2 text-sm`}>
                <span className="font-bold text-gray-600 dark:text-gray-400">특징: </span>
                <span className={stage.textColor}>{stage.limitation}</span>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* MIME 헤더 상세 */}
      <div className="mt-6 rounded-xl border border-blue-200 dark:border-blue-800 overflow-hidden">
        <button
          onClick={() => setShowMimeDetail((v) => !v)}
          className="flex w-full items-center justify-between bg-blue-50 dark:bg-blue-900/20 px-5 py-4 text-left hover:bg-blue-100 dark:hover:bg-blue-900/30"
        >
          <span className="font-bold text-blue-800 dark:text-blue-200">
            MIME 헤더 상세 — Content-Type 7종 · Content-Transfer-Encoding 6종
          </span>
          <motion.div animate={{ rotate: showMimeDetail ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={18} className="text-blue-400" />
          </motion.div>
        </button>
        <AnimatePresence>
          {showMimeDetail && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-gray-900 p-5 space-y-6">
                {/* Content-Type 7종 */}
                <div>
                  <h4 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-100">
                    Content-Type 7종
                    <span className="ml-2 text-xs font-normal text-gray-500">— 메시지의 데이터 유형 지정</span>
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <th className="px-3 py-2 text-left font-bold text-gray-500 uppercase">타입</th>
                          <th className="px-3 py-2 text-left font-bold text-gray-500 uppercase">예시 서브타입</th>
                          <th className="px-3 py-2 text-left font-bold text-gray-500 uppercase hidden sm:table-cell">설명</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {MIME_CONTENT_TYPES.map((r, i) => (
                          <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                            <td className="px-3 py-2 font-mono font-bold text-blue-700 dark:text-blue-300">{r.type}</td>
                            <td className="px-3 py-2 font-mono text-gray-500 dark:text-gray-400">{r.sub}</td>
                            <td className="px-3 py-2 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{r.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Content-Transfer-Encoding 6종 */}
                <div>
                  <h4 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-100">
                    Content-Transfer-Encoding 6종
                    <span className="ml-2 text-xs font-normal text-gray-500">— 전송 시 인코딩 방식 지정</span>
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <th className="px-3 py-2 text-left font-bold text-gray-500 uppercase">인코딩</th>
                          <th className="px-3 py-2 text-left font-bold text-gray-500 uppercase">설명</th>
                          <th className="px-3 py-2 text-center font-bold text-gray-500 uppercase">범용성</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {MIME_ENCODINGS.map((r, i) => (
                          <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                            <td className="px-3 py-2 font-mono font-bold text-blue-700 dark:text-blue-300">{r.enc}</td>
                            <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{r.desc}</td>
                            <td className="px-3 py-2 text-center">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${r.safe ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>
                                {r.safe ? "범용" : "제한"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-xs text-gray-400 italic">
                    * base64가 가장 범용적 — 이진 파일 첨부에 표준으로 사용. SMTP의 7비트 제약을 우회하기 위해 도입됨.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
