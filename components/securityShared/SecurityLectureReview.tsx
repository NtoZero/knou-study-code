"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Binary,
  Calculator,
  CheckCircle,
  ChevronDown,
  FileCheck2,
  Fingerprint,
  KeyRound,
  ListChecks,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Shuffle,
  SplitSquareHorizontal,
  XCircle,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import type {
  SecurityConceptUnit,
  SecurityLab,
  SecurityLectureViewContent,
  SecurityQuiz,
} from "./types";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function modPow(base: number, exp: number, mod: number) {
  let result = 1;
  let b = base % mod;
  let e = exp;
  while (e > 0) {
    if (e % 2 === 1) result = (result * b) % mod;
    b = (b * b) % mod;
    e = Math.floor(e / 2);
  }
  return result;
}

function toyHash(value: string) {
  const n = Array.from(value).reduce(
    (acc, ch, idx) => (acc + ch.charCodeAt(0) * (idx + 11)) % 4093,
    173
  );
  return n.toString(16).toUpperCase().padStart(3, "0");
}

function shiftText(text: string, shift: number) {
  return text
    .toUpperCase()
    .split("")
    .map((ch) => {
      const idx = alphabet.indexOf(ch);
      if (idx < 0) return ch;
      return alphabet[(idx + shift + alphabet.length) % alphabet.length];
    })
    .join("");
}

function Concepts({ units }: { units: SecurityConceptUnit[] }) {
  const [active, setActive] = useState(0);

  return (
    <section>
      <SectionTitle
        title="핵심 개념 흐름"
        subtitle="개념별 정의, 구성요소, 오답 기준, 출제 초점을 세로 흐름으로 정리"
      />

      <div className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 lg:sticky lg:top-6 lg:self-start">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">개념 목차</div>
              <div className="mt-1 text-xs text-gray-500">{units.length}개 단위</div>
            </div>
            <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 dark:bg-purple-950/40 dark:text-purple-200">
              {active + 1}/{units.length}
            </span>
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto pr-1 lg:max-h-[calc(100vh-12rem)]">
            {units.map((item, idx) => (
              <a
                key={item.title}
                href={`#lecture-concept-${idx + 1}`}
                onClick={() => setActive(idx)}
                className={`block rounded-lg border px-3 py-3 text-left transition-colors ${
                  active === idx
                    ? "border-purple-500 bg-purple-50 text-purple-800 dark:border-purple-700 dark:bg-purple-950/40 dark:text-purple-200"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-purple-300 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-gray-500 dark:bg-gray-900">
                    {item.anchor}
                  </span>
                  <span className="text-sm font-semibold leading-5">{item.title}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-5 opacity-80">{item.summary}</p>
              </a>
            ))}
          </div>
        </aside>

        <div className="min-w-0 space-y-5">
          {units.map((unit, idx) => (
            <motion.article
              id={`lecture-concept-${idx + 1}`}
              key={unit.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.18 }}
              className="scroll-mt-24 rounded-xl border border-purple-200 bg-white p-5 dark:border-purple-900 dark:bg-gray-900 lg:scroll-mt-8"
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-purple-600 px-2.5 py-1 text-xs font-bold text-white">
                  {unit.anchor}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {unit.title}
                </h3>
              </div>

              <p className="mb-4 text-sm leading-6 text-gray-700 dark:text-gray-300">
                {unit.summary}
              </p>

              <div className="mb-4 grid gap-2 text-xs sm:grid-cols-5">
                <div className="rounded-lg bg-purple-50 px-3 py-2 font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-200">
                  정의
                </div>
                <div className="rounded-lg bg-gray-50 px-3 py-2 text-gray-600 dark:bg-gray-800/70 dark:text-gray-300">
                  구성 {unit.components.length}
                </div>
                <div className="rounded-lg bg-gray-50 px-3 py-2 text-gray-600 dark:bg-gray-800/70 dark:text-gray-300">
                  예시 {unit.examples.length}
                </div>
                <div className="rounded-lg bg-amber-50 px-3 py-2 text-amber-700 dark:bg-amber-950/20 dark:text-amber-200">
                  오답 기준
                </div>
                <div className="rounded-lg bg-purple-600 px-3 py-2 font-semibold text-white">
                  기출 초점
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-3">
                  <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-950/30">
                    <div className="mb-1 flex items-center gap-2 text-sm font-bold text-purple-800 dark:text-purple-200">
                      <ShieldCheck size={15} />
                      정의
                    </div>
                    <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                      {unit.definition}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/70">
                    <div className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-100">
                      왜 중요한가
                    </div>
                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                      {unit.why}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                    <div className="mb-2 text-sm font-bold text-gray-800 dark:text-gray-100">
                      구성요소
                    </div>
                    <ul className="space-y-1.5">
                      {unit.components.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
                    <div className="mb-1 flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-200">
                      <AlertTriangle size={15} />
                      자주 틀리는 기준
                    </div>
                    <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                      {unit.mistake}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {unit.examples.map((example) => (
                  <div
                    key={example}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-400"
                  >
                    {example}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-lg bg-purple-600 px-4 py-3 text-sm text-white">
                <FileCheck2 size={16} className="mt-0.5 shrink-0" />
                <span>{unit.examFocus}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Terms({ content }: { content: SecurityLectureViewContent }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div>
          <h2 className="text-xl font-bold">용어 연결표</h2>
          <p className="mt-1 text-sm text-gray-500">
            퀴즈에 등장하는 전문용어가 어느 앞단에서 도입되는지 확인
          </p>
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {content.terms.map((term) => (
                <article
                  key={term.term}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/40"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-purple-600 px-2.5 py-1 text-xs font-bold text-white">
                      {term.term}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {term.parent}
                    </span>
                  </div>
                  <dl className="grid gap-2 text-xs sm:grid-cols-2">
                    <div>
                      <dt className="font-bold text-gray-800 dark:text-gray-100">선행 개념</dt>
                      <dd className="mt-1 leading-5 text-gray-600 dark:text-gray-400">{term.prereq}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-gray-800 dark:text-gray-100">처음 나오는 위치</dt>
                      <dd className="mt-1 leading-5 text-gray-600 dark:text-gray-400">{term.intro}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-gray-800 dark:text-gray-100">적용 위치</dt>
                      <dd className="mt-1 leading-5 text-gray-600 dark:text-gray-400">{term.apply}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-gray-800 dark:text-gray-100">복습 위치</dt>
                      <dd className="mt-1 leading-5 text-gray-600 dark:text-gray-400">{term.reinforce}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function LectureDensity({ content }: { content: SecurityLectureViewContent }) {
  const stats = [
    { label: "개념", value: content.units.length },
    { label: "용어", value: content.terms.length },
    { label: "실습", value: 1 },
    { label: "문항", value: content.quizzes.length },
  ];
  const flow = [
    "목표",
    ...content.units.map((unit) => unit.anchor),
    "용어",
    "실습",
    "퀴즈",
  ];

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">학습 밀도 맵</h2>
          <p className="mt-1 text-sm text-gray-500">강의 한 회차를 개념, 용어, 실습, 시험형 문항으로 압축</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {stats.map((item) => (
            <div
              key={item.label}
              className="min-w-14 rounded-lg bg-purple-50 px-3 py-2 text-center dark:bg-purple-950/30"
            >
              <div className="text-base font-bold text-purple-700 dark:text-purple-200">{item.value}</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {content.goals.map((goal) => (
          <div
            key={goal}
            className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-300"
          >
            {goal}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {flow.map((item, idx) => (
          <div key={`${item}-${idx}`} className="flex items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-[11px] font-bold text-white">
              {idx + 1}
            </span>
            <div className="min-w-0 flex-1 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 dark:bg-gray-800/70 dark:text-gray-300">
              {item}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TriadLab({ lab }: { lab: Extract<SecurityLab, { kind: "triad" }> }) {
  const [active, setActive] = useState(0);
  const scenario = lab.scenarios[active];
  const goals = ["기밀성", "무결성", "가용성", "인증", "부인방지"];

  return (
    <LabShell title={lab.title} subtitle={lab.subtitle} icon={<ShieldCheck size={18} />}>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-2">
          {lab.scenarios.map((item, idx) => (
            <button
              key={item.label}
              onClick={() => setActive(idx)}
              className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                active === idx
                  ? "border-purple-500 bg-purple-50 text-purple-800 dark:border-purple-700 dark:bg-purple-950/40 dark:text-purple-200"
                  : "border-gray-200 bg-white text-gray-600 hover:border-purple-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
              }`}
            >
              <div className="font-semibold">{item.label}</div>
              <div className="mt-1 text-xs opacity-80">{item.desc}</div>
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950/40">
          <div className="mb-4 text-sm font-bold text-gray-800 dark:text-gray-100">
            직접 침해된 목표
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {goals.map((goal) => {
              const selected = scenario.goals.includes(goal);
              return (
                <div
                  key={goal}
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    selected
                      ? "border-purple-500 bg-purple-600 font-bold text-white"
                      : "border-gray-200 bg-white text-gray-500 dark:border-gray-800 dark:bg-gray-900"
                  }`}
                >
                  {goal}
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-700 dark:text-gray-300">
            {scenario.why}
          </p>
        </div>
      </div>
    </LabShell>
  );
}

function CipherLab({ lab }: { lab: Extract<SecurityLab, { kind: "cipher" }> }) {
  const [shift, setShift] = useState(lab.shiftDefault);
  const shifted = shiftText(lab.plain, shift);
  const vigenere = lab.plain
    .split("")
    .map((ch, idx) => shiftText(ch, lab.vigenereKey[idx % lab.vigenereKey.length]))
    .join("");

  return (
    <LabShell title={lab.title} subtitle={lab.subtitle} icon={<Shuffle size={18} />}>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
          <div className="mb-2 text-sm font-bold">시프트 암호</div>
          <div className="mb-4 flex items-center gap-3">
            <button
              onClick={() => setShift((v) => (v + 25) % 26)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700"
            >
              -1
            </button>
            <div className="min-w-20 rounded-lg bg-purple-50 px-4 py-2 text-center text-sm font-bold text-purple-700 dark:bg-purple-950/40 dark:text-purple-200">
              k = {shift}
            </div>
            <button
              onClick={() => setShift((v) => (v + 1) % 26)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700"
            >
              +1
            </button>
          </div>
          <div className="space-y-2 font-mono text-sm">
            <div className="rounded bg-gray-50 px-3 py-2 dark:bg-gray-800">평문: {lab.plain}</div>
            <div className="rounded bg-purple-50 px-3 py-2 text-purple-800 dark:bg-purple-950/40 dark:text-purple-200">
              암호문: {shifted}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
          <div className="mb-2 text-sm font-bold">비즈네르 방식</div>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            여러 정수 키를 반복해 적용하면 키 공간이 커진다.
          </p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs sm:grid-cols-6">
            {lab.plain.split("").map((ch, idx) => (
              <div key={`${ch}-${idx}`} className="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                <div className="font-mono text-gray-500">{ch}</div>
                <div className="my-1 text-purple-600">+{lab.vigenereKey[idx % lab.vigenereKey.length]}</div>
                <div className="font-mono font-bold">{shiftText(ch, lab.vigenereKey[idx % lab.vigenereKey.length])}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 font-mono text-sm dark:bg-gray-800">
            {lab.plain} &rarr; {vigenere}
          </div>
        </div>
      </div>
    </LabShell>
  );
}

function MacLab({ lab }: { lab: Extract<SecurityLab, { kind: "mac" }> }) {
  const [tampered, setTampered] = useState(false);
  const sentMessage = lab.message;
  const receivedMessage = tampered ? lab.tampered : lab.message;
  const sentMac = toyHash(`${lab.key}:${sentMessage}`);
  const receivedMac = toyHash(`${lab.key}:${receivedMessage}`);
  const valid = sentMac === receivedMac;

  return (
    <LabShell title={lab.title} subtitle={lab.subtitle} icon={<Fingerprint size={18} />}>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setTampered(false)}
          className={`rounded-full px-4 py-2 text-sm ${!tampered ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}
        >
          정상 수신
        </button>
        <button
          onClick={() => setTampered(true)}
          className={`rounded-full px-4 py-2 text-sm ${tampered ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}
        >
          메시지 변조
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
          <div className="mb-2 text-sm font-bold">송신자가 보낸 값</div>
          <code className="block rounded bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800">{sentMessage}</code>
          <div className="mt-3 rounded bg-purple-50 px-3 py-2 font-mono text-sm text-purple-800 dark:bg-purple-950/40 dark:text-purple-200">
            MAC = {sentMac}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
          <div className="mb-2 text-sm font-bold">수신자가 재산출한 값</div>
          <code className="block rounded bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800">{receivedMessage}</code>
          <div className={`mt-3 rounded px-3 py-2 font-mono text-sm ${valid ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"}`}>
            MAC = {receivedMac}
          </div>
        </div>
      </div>

      <div className={`mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${valid ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"}`}>
        {valid ? <CheckCircle size={16} /> : <XCircle size={16} />}
        {valid ? "값이 같으므로 메시지 변조가 감지되지 않았다." : "값이 다르므로 메시지 또는 MAC 변조를 의심해야 한다."}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {lab.methods.map((method) => (
          <div key={method.label} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <div className="font-bold text-purple-700 dark:text-purple-300">{method.label}</div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{method.desc}</p>
          </div>
        ))}
      </div>
    </LabShell>
  );
}

function ClassifierLab({ lab }: { lab: Extract<SecurityLab, { kind: "classifier" }> }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  return (
    <LabShell title={lab.title} subtitle={lab.subtitle} icon={<ListChecks size={18} />}>
      <div className="mb-4 flex flex-wrap gap-2">
        {lab.categories.map((category) => (
          <span key={category} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {category}
          </span>
        ))}
      </div>

      <div className="space-y-4">
        {lab.cases.map((item, idx) => {
          const selected = answers[idx];
          const correct = selected === item.answer;
          return (
            <div key={item.prompt} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <p className="mb-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                {item.prompt}
              </p>
              <div className="flex flex-wrap gap-2">
                {lab.categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setAnswers((prev) => ({ ...prev, [idx]: category }))}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      selected === category
                        ? correct
                          ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300"
                          : "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"
                        : "border-gray-200 bg-white text-gray-600 hover:border-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {selected && (
                <div className={`mt-3 rounded-lg px-3 py-2 text-xs ${correct ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"}`}>
                  {correct ? "정답: " : `정답은 ${item.answer}: `}
                  {item.feedback}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </LabShell>
  );
}

function FlowLab({ lab }: { lab: Extract<SecurityLab, { kind: "flow" }> }) {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const step = lab.steps[active];

  return (
    <LabShell title={lab.title} subtitle={lab.subtitle} icon={<SplitSquareHorizontal size={18} />}>
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {lab.steps.map((item, idx) => (
          <button
            key={item.title}
            onClick={() => setActive(idx)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
              active === idx
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {idx + 1}. {item.title}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-purple-200 bg-purple-50 p-5 dark:border-purple-900 dark:bg-purple-950/30">
        <div className="mb-2 text-lg font-bold text-purple-900 dark:text-purple-100">
          {step.title}
        </div>
        <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">{step.desc}</p>
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-white px-4 py-3 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-300">
          <CheckCircle size={16} className="mt-0.5 shrink-0 text-purple-600" />
          {step.check}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {lab.decisionCards.map((card, idx) => {
          const seen = selected[idx];
          return (
            <button
              key={card.label}
              onClick={() => setSelected((prev) => ({ ...prev, [idx]: true }))}
              className={`rounded-xl border p-4 text-left transition-colors ${
                seen
                  ? card.correct
                    ? "border-green-400 bg-green-50 dark:bg-green-950/20"
                    : "border-red-400 bg-red-50 dark:bg-red-950/20"
                  : "border-gray-200 bg-white hover:border-purple-300 dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              <div className="flex items-start gap-2 text-sm font-semibold">
                {seen ? (
                  card.correct ? <CheckCircle size={16} className="mt-0.5 shrink-0 text-green-600" /> : <XCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
                ) : (
                  <ArrowRight size={16} className="mt-0.5 shrink-0 text-gray-400" />
                )}
                {card.label}
              </div>
              {seen && <p className="mt-2 text-xs leading-5 text-gray-600 dark:text-gray-400">{card.reason}</p>}
            </button>
          );
        })}
      </div>
    </LabShell>
  );
}

function BlockLab({ lab }: { lab: Extract<SecurityLab, { kind: "block" }> }) {
  const [modeName, setModeName] = useState(lab.modes[0].name);
  const [count, setCount] = useState(7);
  const mode = lab.modes.find((item) => item.name === modeName) ?? lab.modes[0];
  const sequence = useMemo(() => {
    const state = [...lab.lfsr.seed];
    const out = [...state];
    for (let i = 0; i < count; i += 1) {
      const next = lab.lfsr.taps.reduce((acc, tap) => acc ^ state[state.length - 1 - tap], 0);
      state.shift();
      state.push(next);
      out.push(next);
    }
    return out.join("");
  }, [count, lab.lfsr.seed, lab.lfsr.taps]);

  return (
    <LabShell title={lab.title} subtitle={lab.subtitle} icon={<Binary size={18} />}>
      <div className="mb-4 flex flex-wrap gap-2">
        {lab.modes.map((item) => (
          <button
            key={item.name}
            onClick={() => setModeName(item.name)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              item.name === modeName ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
          <div className="mb-2 text-lg font-bold">{mode.name} 모드</div>
          <code className="block rounded bg-gray-950 px-3 py-2 text-sm text-green-300">{mode.formula}</code>
          <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><strong className="text-gray-900 dark:text-gray-100">병렬성:</strong> {mode.parallel}</p>
            <p><strong className="text-gray-900 dark:text-gray-100">오류 영향:</strong> {mode.error}</p>
            <p><strong className="text-gray-900 dark:text-gray-100">사용:</strong> {mode.use}</p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
          <div className="mb-2 text-lg font-bold">LFSR 키 스트림</div>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            초깃값 {lab.lfsr.seed.join("")}, 탭 {lab.lfsr.taps.map((v) => `b-${v + 1}`).join(", ")}를 사용한 예시.
          </p>
          <div className="mb-3 break-all rounded bg-purple-50 px-3 py-2 font-mono text-sm text-purple-800 dark:bg-purple-950/40 dark:text-purple-200">
            {sequence}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCount((v) => Math.max(1, v - 1))} className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700">-1</button>
            <span className="text-sm text-gray-600 dark:text-gray-400">추가 {count}비트</span>
            <button onClick={() => setCount((v) => v + 1)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700">+1</button>
          </div>
        </div>
      </div>
    </LabShell>
  );
}

function RsaLab({ lab }: { lab: Extract<SecurityLab, { kind: "rsa" }> }) {
  const [p, setP] = useState(lab.defaults.p);
  const [q, setQ] = useState(lab.defaults.q);
  const [e, setE] = useState(lab.defaults.e);
  const [message, setMessage] = useState(lab.defaults.message);
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  const d = useMemo(() => {
    for (let i = 1; i < phi; i += 1) {
      if ((e * i) % phi === 1) return i;
    }
    return 1;
  }, [e, phi]);
  const c = modPow(message, e, n);
  const restored = modPow(c, d, n);

  return (
    <LabShell title={lab.title} subtitle={lab.subtitle} icon={<Calculator size={18} />}>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
          <div className="mb-3 text-sm font-bold">작은 수 입력</div>
          <NumberStepper label="p" value={p} setValue={setP} min={3} max={17} />
          <NumberStepper label="q" value={q} setValue={setQ} min={5} max={19} />
          <NumberStepper label="e" value={e} setValue={setE} min={3} max={11} />
          <NumberStepper label="M" value={message} setValue={setMessage} min={2} max={Math.max(2, n - 1)} />
        </div>

        <div className="rounded-xl border border-purple-200 bg-purple-50 p-5 dark:border-purple-900 dark:bg-purple-950/30">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoBox label="n = p x q" value={`${n}`} />
            <InfoBox label="phi(n)" value={`${phi}`} />
            <InfoBox label="공개키" value={`(e=${e}, n=${n})`} />
            <InfoBox label="개인키 d" value={`${d}`} />
            <InfoBox label="암호문 C" value={`${message}^${e} mod ${n} = ${c}`} />
            <InfoBox label="복호화 P" value={`${c}^${d} mod ${n} = ${restored}`} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {lab.problems.map((problem) => (
          <div key={problem.label} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <div className="font-bold text-purple-700 dark:text-purple-300">{problem.label}</div>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">쉬운 방향: {problem.easy}</p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">어려운 방향: {problem.hard}</p>
            <p className="mt-2 text-xs font-semibold text-gray-800 dark:text-gray-200">{problem.algorithms}</p>
          </div>
        ))}
      </div>
    </LabShell>
  );
}

function HashSignatureLab({ lab }: { lab: Extract<SecurityLab, { kind: "hash-signature" }> }) {
  const [message, setMessage] = useState(lab.messages[0]);
  const [tampered, setTampered] = useState(false);
  const signedHash = toyHash(message);
  const received = tampered ? `${message} ` : message;
  const receivedHash = toyHash(received);
  const valid = signedHash === receivedHash;

  return (
    <LabShell title={lab.title} subtitle={lab.subtitle} icon={<LockKeyhole size={18} />}>
      <div className="mb-4 flex flex-wrap gap-2">
        {lab.messages.map((item) => (
          <button
            key={item}
            onClick={() => {
              setMessage(item);
              setTampered(false);
            }}
            className={`rounded-full px-3 py-1.5 text-xs ${message === item ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <InfoBox label="메시지 해시" value={`H(M) = ${signedHash}`} />
        <InfoBox label="개인키 서명" value={`s = Sign(${signedHash})`} />
        <InfoBox label="공개키 검증" value={valid ? "유효" : "실패"} tone={valid ? "green" : "red"} />
      </div>

      <button
        onClick={() => setTampered((v) => !v)}
        className="mt-4 rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700"
      >
        {tampered ? "원래 메시지로 검증" : "메시지 한 글자 바꾸기"}
      </button>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        수신 메시지 해시: <code>{receivedHash}</code>. {valid ? "서명 시 해시와 같아 유효하다." : "서명 시 해시와 달라 변조로 판단한다."}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {lab.algorithms.map((item) => (
          <div key={item.name} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <div className="font-bold">{item.name}</div>
            <div className="mt-1 text-xs text-purple-700 dark:text-purple-300">{item.output}</div>
            <p className="mt-2 text-xs leading-5 text-gray-600 dark:text-gray-400">{item.status}</p>
          </div>
        ))}
      </div>
    </LabShell>
  );
}

function DhkeLab({ lab }: { lab: Extract<SecurityLab, { kind: "dhke" }> }) {
  const [mitm, setMitm] = useState(false);
  const { p, g, aliceSecret, bobSecret } = lab.defaults;
  const a = modPow(g, aliceSecret, p);
  const b = modPow(g, bobSecret, p);
  const kAlice = modPow(b, aliceSecret, p);
  const kBob = modPow(a, bobSecret, p);
  const attackA = modPow(g, 4, p);
  const attackB = modPow(g, 9, p);
  const k1 = modPow(attackB, aliceSecret, p);
  const k2 = modPow(attackA, bobSecret, p);

  return (
    <LabShell title={lab.title} subtitle={lab.subtitle} icon={<KeyRound size={18} />}>
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setMitm(false)} className={`rounded-full px-4 py-2 text-sm ${!mitm ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}>정상 DHKE</button>
        <button onClick={() => setMitm(true)} className={`rounded-full px-4 py-2 text-sm ${mitm ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"}`}>중간자 개입</button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
          <div className="mb-3 text-sm font-bold">공개 값과 개인 값</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoBox label="p, g" value={`${p}, ${g}`} />
            <InfoBox label="Alice s" value={`${aliceSecret}`} />
            <InfoBox label="Bob t" value={`${bobSecret}`} />
            <InfoBox label="A, B" value={`${a}, ${b}`} />
          </div>
        </div>
        <div className={`rounded-xl border p-5 ${mitm ? "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/20" : "border-green-300 bg-green-50 dark:border-green-900 dark:bg-green-950/20"}`}>
          <div className="mb-3 text-sm font-bold">{mitm ? "공격자가 두 키를 만든 상황" : "같은 공유키 도출"}</div>
          {mitm ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoBox label="Alice-Z K1" value={`${k1}`} tone="red" />
              <InfoBox label="Z-Bob K2" value={`${k2}`} tone="red" />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoBox label="Alice K=B^s mod p" value={`${kAlice}`} tone="green" />
              <InfoBox label="Bob K=A^t mod p" value={`${kBob}`} tone="green" />
            </div>
          )}
          <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
            {mitm ? "상대 인증이 없으면 공격자가 양쪽과 각각 다른 키를 공유할 수 있다." : "두 값이 같으므로 같은 비밀키를 공유한다."}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {lab.publicKeyMethods.map((method) => (
          <div key={method.name} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <div className="font-bold text-purple-700 dark:text-purple-300">{method.name}</div>
            <p className="mt-2 text-xs text-red-700 dark:text-red-300">위험: {method.risk}</p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">보완: {method.safePoint}</p>
          </div>
        ))}
      </div>
    </LabShell>
  );
}

function LabShell({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-white">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        {children}
      </div>
    </section>
  );
}

function InfoBox({
  label,
  value,
  tone = "purple",
}: {
  label: string;
  value: string;
  tone?: "purple" | "green" | "red";
}) {
  const toneClass =
    tone === "green"
      ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300"
      : tone === "red"
        ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"
        : "bg-purple-50 text-purple-800 dark:bg-purple-950/30 dark:text-purple-200";
  return (
    <div className={`rounded-lg px-4 py-3 ${toneClass}`}>
      <div className="text-xs font-medium opacity-70">{label}</div>
      <div className="mt-1 break-all font-mono text-sm font-bold">{value}</div>
    </div>
  );
}

function NumberStepper({
  label,
  value,
  setValue,
  min,
  max,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <span className="text-sm font-semibold">{label}</span>
      <div className="flex items-center gap-2">
        <button onClick={() => setValue(Math.max(min, value - 1))} className="rounded border border-gray-200 px-2 py-1 text-sm dark:border-gray-700">-</button>
        <span className="w-10 text-center font-mono text-sm">{value}</span>
        <button onClick={() => setValue(Math.min(max, value + 1))} className="rounded border border-gray-200 px-2 py-1 text-sm dark:border-gray-700">+</button>
      </div>
    </div>
  );
}

function VisualLab({ lab }: { lab: SecurityLab }) {
  switch (lab.kind) {
    case "triad":
      return <TriadLab lab={lab} />;
    case "cipher":
      return <CipherLab lab={lab} />;
    case "mac":
      return <MacLab lab={lab} />;
    case "classifier":
      return <ClassifierLab lab={lab} />;
    case "flow":
      return <FlowLab lab={lab} />;
    case "block":
      return <BlockLab lab={lab} />;
    case "rsa":
      return <RsaLab lab={lab} />;
    case "hash-signature":
      return <HashSignatureLab lab={lab} />;
    case "dhke":
      return <DhkeLab lab={lab} />;
  }
}

export function SecurityQuizSection({ quizzes, lectureId }: { quizzes: SecurityQuiz[]; lectureId: number }) {
  const [answers, setAnswers] = useState<Record<number, number | null>>(
    Object.fromEntries(quizzes.map((_, idx) => [idx, null]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState<Record<number, boolean>>({});

  const correctCount = quizzes.filter((quiz, idx) => {
    const selected = answers[idx];
    return selected !== null && quiz.choices[selected]?.isCorrect;
  }).length;

  function reset() {
    setAnswers(Object.fromEntries(quizzes.map((_, idx) => [idx, null])));
    setSubmitted(false);
    setOpen({});
  }

  return (
    <section>
      <SectionTitle
        title={`${lectureId}강 시험형 자가 점검`}
        subtitle="선택지별로 맞고 틀리는 이유를 확인"
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setSubmitted(true)}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white"
        >
          채점하기
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700"
        >
          <RotateCcw size={14} />
          다시 풀기
        </button>
        {submitted && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            {correctCount} / {quizzes.length} 정답
          </span>
        )}
      </div>

      <div className="space-y-5">
        {quizzes.map((quiz, qIdx) => {
          const selected = answers[qIdx];
          const selectedCorrect = selected !== null && quiz.choices[selected]?.isCorrect;
          return (
            <div
              key={quiz.q}
              className={`rounded-xl border p-5 ${
                submitted
                  ? selectedCorrect
                    ? "border-green-300 bg-green-50 dark:border-green-900 dark:bg-green-950/20"
                    : "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/20"
                  : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-purple-600 px-2.5 py-0.5 text-xs font-bold text-white">
                  Q{qIdx + 1}
                </span>
                <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-950/40 dark:text-purple-200">
                  {quiz.category}
                </span>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500 dark:bg-gray-800">
                  {quiz.examSkill}
                </span>
              </div>
              <p className="mb-4 text-sm font-semibold leading-6 text-gray-800 dark:text-gray-100">
                {quiz.q}
              </p>

              <div className="space-y-2">
                {quiz.choices.map((item, cIdx) => {
                  const isSelected = selected === cIdx;
                  const showCorrect = submitted && item.isCorrect;
                  const showWrong = submitted && isSelected && !item.isCorrect;
                  return (
                    <button
                      key={item.text}
                      onClick={() => {
                        if (!submitted) {
                          setAnswers((prev) => ({ ...prev, [qIdx]: cIdx }));
                        }
                      }}
                      className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                        showCorrect
                          ? "border-green-500 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                          : showWrong
                            ? "border-red-500 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                            : isSelected
                              ? "border-purple-500 bg-purple-50 text-purple-800 dark:bg-purple-950/40 dark:text-purple-200"
                              : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                      }`}
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                        {String.fromCharCode(65 + cIdx)}
                      </span>
                      <span className="leading-5">{item.text}</span>
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-4">
                  <button
                    onClick={() => setOpen((prev) => ({ ...prev, [qIdx]: !prev[qIdx] }))}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-300"
                  >
                    <ChevronDown size={14} className={`transition-transform ${open[qIdx] ? "rotate-180" : ""}`} />
                    해설 {open[qIdx] ? "접기" : "보기"}
                  </button>
                  <AnimatePresence>
                    {open[qIdx] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 rounded-lg bg-white p-4 text-xs leading-5 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                          <p className="mb-3 font-semibold">{quiz.basis}</p>
                          <div className="space-y-2">
                            {quiz.choices.map((item, idx) => (
                              <div key={item.text} className="rounded border border-gray-100 p-3 dark:border-gray-800">
                                <div className="font-bold">
                                  {String.fromCharCode(65 + idx)}. {item.isCorrect ? "정답" : "오답"}
                                </div>
                                <p className="mt-1">{item.explanation.basis}</p>
                                <p className="mt-1 text-gray-500 dark:text-gray-400">
                                  오답 기준: {item.explanation.reason}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function SecurityLectureReview({
  content,
}: {
  content: SecurityLectureViewContent;
}) {
  return (
    <>
      <section className="rounded-xl border border-purple-200 bg-purple-50 p-5 dark:border-purple-900 dark:bg-purple-950/30">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-purple-800 dark:text-purple-200">
          <ShieldCheck size={16} />
          학습 목표
        </div>
        <p className="mb-4 text-sm leading-6 text-gray-700 dark:text-gray-300">
          {content.intro}
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {content.goals.map((goal) => (
            <div
              key={goal}
              className="rounded-lg bg-white px-4 py-3 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-300"
            >
              {goal}
            </div>
          ))}
        </div>
      </section>

      <LectureDensity content={content} />
      <Concepts units={content.units} />
      <Terms content={content} />
      <VisualLab lab={content.lab} />
      <SecurityQuizSection quizzes={content.quizzes} lectureId={content.id} />
    </>
  );
}
