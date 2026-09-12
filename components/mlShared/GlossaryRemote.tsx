"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  BookOpen,
  ArrowLeft,
  Layers,
  Sigma,
  Lightbulb,
  GitCompare,
  Link2,
  CornerDownRight,
  Command,
} from "lucide-react";
import { allTerms, termById, type ResolvedEntry } from "@/lib/mlGlossary";

type Filter = "전체" | "1강" | "2강" | "3강" | "4강" | "선행 개념";

const FILTERS: Filter[] = ["전체", "1강", "2강", "3강", "4강", "선행 개념"];

function matches(entry: ResolvedEntry, q: string) {
  if (!q) return true;
  const hay = [
    entry.term,
    entry.en ?? "",
    entry.short,
    entry.definition,
    ...(entry.kind === "term" ? (entry.aliases ?? []) : []),
    ...(entry.formula ?? []).map((f) => f.expr),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

function inFilter(entry: ResolvedEntry, f: Filter) {
  if (f === "전체") return true;
  if (f === "선행 개념") return entry.kind === "prereq";
  const n = Number(f[0]);
  return entry.kind === "term" && entry.lectures.includes(n);
}

export default function GlossaryRemote() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("전체");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  const openDetail = useCallback(
    (id: string) => {
      setDetailId((cur) => {
        if (cur) setHistory((h) => [...h, cur]);
        return id;
      });
    },
    [],
  );

  const goBack = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) {
        setDetailId(null);
        return h;
      }
      const next = [...h];
      const prev = next.pop()!;
      setDetailId(prev);
      return next;
    });
  }, []);

  const closeAll = useCallback(() => {
    setOpen(false);
    setDetailId(null);
    setHistory([]);
  }, []);

  /* 키보드: / 로 열기, Esc 로 닫기 */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      const typing =
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable);

      if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
        window.setTimeout(() => inputRef.current?.focus(), 60);
      }
      if (e.key === "Escape") {
        if (detailId) goBack();
        else if (open) setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, detailId, goBack]);

  /* 모달 열렸을 때 배경 스크롤 잠금 */
  useEffect(() => {
    if (!detailId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [detailId]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allTerms
      .filter((t) => inFilter(t, filter) && matches(t, q))
      .sort((a, b) => {
        if (!q) return a.term.localeCompare(b.term, "ko");
        const aStart = a.term.toLowerCase().startsWith(q) ? 0 : 1;
        const bStart = b.term.toLowerCase().startsWith(q) ? 0 : 1;
        if (aStart !== bStart) return aStart - bStart;
        return a.term.localeCompare(b.term, "ko");
      });
  }, [query, filter]);

  const detail = detailId ? termById[detailId] : null;

  if (!mounted) return null;

  return createPortal(
    <>
      {/* ── 리모컨 버튼 ── */}
      <button
        onClick={() => {
          setOpen((v) => !v);
          window.setTimeout(() => inputRef.current?.focus(), 60);
        }}
        aria-label="용어집 열기"
        className="fixed bottom-5 right-5 z-[60] flex h-13 items-center gap-2 rounded-full bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 dark:bg-white dark:text-gray-900"
      >
        <BookOpen size={17} />
        <span className="hidden sm:inline">용어집</span>
      </button>

      {/* ── 검색 패널 ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-20 right-5 z-[60] flex max-h-[70vh] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex items-center gap-2 border-b border-gray-100 p-3 dark:border-gray-800">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="용어 검색 — 과다적합, 오즈비, 공분산…"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-2 text-sm outline-none focus:border-cyan-400 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="닫기"
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex gap-1 overflow-x-auto border-b border-gray-100 px-3 py-2 dark:border-gray-800">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    filter === f
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
              {results.length === 0 && (
                <p className="p-6 text-center text-xs text-gray-400">
                  일치하는 용어가 없습니다.
                </p>
              )}
              {results.map((t) => (
                <button
                  key={t.id}
                  onClick={() => openDetail(t.id)}
                  className="flex w-full items-start gap-2 rounded-lg p-2.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <span
                    className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                      t.kind === "prereq" ? "bg-amber-400" : "bg-cyan-500"
                    }`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-1.5">
                      <span className="text-sm font-semibold">{t.term}</span>
                      {t.en && (
                        <span className="text-[10px] text-gray-400">{t.en}</span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-4 text-gray-500">
                      {t.short}
                    </span>
                  </span>
                  <span className="mt-0.5 shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {t.kind === "prereq" ? "선행" : t.lectures.map((n) => `${n}강`).join("·")}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 border-t border-gray-100 px-3 py-2 text-[10px] text-gray-400 dark:border-gray-800">
              <Command size={10} />
              <span>
                <kbd className="rounded border border-gray-300 px-1 dark:border-gray-600">/</kbd>{" "}
                로 열기 ·{" "}
                <kbd className="rounded border border-gray-300 px-1 dark:border-gray-600">Esc</kbd>{" "}
                로 닫기 · 전체 {allTerms.length}개
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 상세 모달 ── */}
      <AnimatePresence>
        {detail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
            onClick={closeAll}
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={`${detail.term} 상세`}
              className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-gray-900 sm:rounded-2xl"
            >
              <div className="flex items-start gap-2 border-b border-gray-100 p-4 dark:border-gray-800">
                {(history.length > 0 || true) && (
                  <button
                    onClick={goBack}
                    aria-label="뒤로"
                    className="mt-0.5 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <ArrowLeft size={16} />
                  </button>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h2 className="text-lg font-bold">{detail.term}</h2>
                    {detail.en && (
                      <span className="text-xs text-gray-400">{detail.en}</span>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        detail.kind === "prereq"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300"
                      }`}
                    >
                      {detail.kind === "prereq" ? detail.area : detail.category}
                    </span>
                    {detail.kind === "term" &&
                      detail.lectures.map((n) => (
                        <span
                          key={n}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        >
                          {n}강
                        </span>
                      ))}
                  </div>
                </div>
                <button
                  onClick={closeAll}
                  aria-label="닫기"
                  className="mt-0.5 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4">
                {/* 왜 필요한가 (선행 개념) */}
                {detail.kind === "prereq" && detail.why && (
                  <div className="rounded-xl border-l-[3px] border-amber-400 bg-amber-50 p-3 dark:bg-amber-950/30">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      왜 필요한가
                    </div>
                    <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
                      {detail.why}
                    </p>
                  </div>
                )}

                {/* 정의 */}
                <section>
                  <h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    정의
                  </h3>
                  <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
                    {detail.definition}
                  </p>
                </section>

                {detail.kind === "term" && detail.role && (
                  <section>
                    <h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      하는 일
                    </h3>
                    <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
                      {detail.role}
                    </p>
                  </section>
                )}

                {/* 수식 */}
                {detail.formula && detail.formula.length > 0 && (
                  <section>
                    <h3 className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      <Sigma size={10} /> 수식
                    </h3>
                    <div className="space-y-2">
                      {detail.formula.map((f, i) => (
                        <div
                          key={i}
                          className="overflow-x-auto rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                        >
                          <code className="block whitespace-nowrap font-mono text-[13px] text-gray-800 dark:text-gray-100">
                            {f.expr}
                          </code>
                          {f.note && (
                            <p className="mt-1 whitespace-normal text-[11px] text-gray-500">
                              {f.note}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 예 */}
                {detail.kind === "prereq" && detail.example && (
                  <section>
                    <h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      예
                    </h3>
                    <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                      <p className="text-[12px] font-medium text-gray-600 dark:text-gray-300">
                        {detail.example.setup}
                      </p>
                      <ol className="mt-2 space-y-1">
                        {detail.example.work.map((w, i) => (
                          <li
                            key={i}
                            className="flex gap-1.5 text-[12px] leading-5 text-gray-600 dark:text-gray-300"
                          >
                            <CornerDownRight size={11} className="mt-1 shrink-0 text-gray-400" />
                            {w}
                          </li>
                        ))}
                      </ol>
                      <p className="mt-2 rounded-lg bg-cyan-50 px-2.5 py-1.5 text-[12px] font-semibold text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-200">
                        {detail.example.result}
                      </p>
                    </div>
                  </section>
                )}
                {detail.kind === "term" && detail.example && (
                  <section>
                    <h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      예
                    </h3>
                    <p className="rounded-xl border border-gray-200 p-3 text-[13px] leading-6 text-gray-700 dark:border-gray-700 dark:text-gray-200">
                      {detail.example}
                    </p>
                  </section>
                )}

                {/* 구분 */}
                {detail.kind === "term" &&
                  detail.distinctions &&
                  detail.distinctions.length > 0 && (
                    <section>
                      <h3 className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        <GitCompare size={10} /> 헷갈리는 것과의 구분
                      </h3>
                      <div className="space-y-2">
                        {detail.distinctions.map((d, i) => (
                          <div
                            key={i}
                            className="rounded-lg border border-gray-200 p-2.5 dark:border-gray-700"
                          >
                            <div className="text-[12px] font-semibold text-gray-700 dark:text-gray-200">
                              vs. {d.from}
                            </div>
                            <p className="mt-0.5 text-[12px] leading-5 text-gray-600 dark:text-gray-300">
                              {d.how}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                {/* 자주 틀리는 지점 / 강조 */}
                {((detail.kind === "term" && detail.emphasis) ||
                  (detail.kind === "prereq" && detail.pitfall)) && (
                  <section>
                    <div className="flex gap-2 rounded-xl border-l-[3px] border-cyan-500 bg-cyan-50/60 p-3 dark:bg-cyan-950/30">
                      <Lightbulb size={14} className="mt-0.5 shrink-0 text-cyan-600" />
                      <p className="text-[13px] leading-6 text-gray-700 dark:text-gray-200">
                        {detail.kind === "term" ? detail.emphasis : detail.pitfall}
                      </p>
                    </div>
                  </section>
                )}

                {/* 선행 개념 */}
                {detail.kind === "term" &&
                  detail.prereqs &&
                  detail.prereqs.length > 0 && (
                    <section>
                      <h3 className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        <Layers size={10} /> 먼저 알아야 하는 것
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {detail.prereqs.map((pid) => {
                          const p = termById[pid];
                          if (!p) return null;
                          return (
                            <button
                              key={pid}
                              onClick={() => openDetail(pid)}
                              className="rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-800 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
                            >
                              {p.term}
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  )}

                {/* 쓰이는 자리 (선행 개념) */}
                {detail.kind === "prereq" && detail.usedIn.length > 0 && (
                  <section>
                    <h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      어디서 쓰이는가
                    </h3>
                    <ul className="space-y-1.5">
                      {detail.usedIn.map((u, i) => (
                        <li key={i} className="flex gap-2 text-[12px] leading-5">
                          <span className="mt-0.5 shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {u.lecture}강
                          </span>
                          <span className="text-gray-600 dark:text-gray-300">{u.where}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* 함께 보기 */}
                {detail.kind === "term" &&
                  detail.related &&
                  detail.related.length > 0 && (
                    <section>
                      <h3 className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        <Link2 size={10} /> 함께 보기
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {detail.related.map((rid) => {
                          const r = termById[rid];
                          if (!r) return null;
                          return (
                            <button
                              key={rid}
                              onClick={() => openDetail(rid)}
                              className="rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                              {r.term}
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  )}

                {/* 근거 */}
                <p className="border-t border-gray-100 pt-3 text-[11px] text-gray-400 dark:border-gray-800">
                  {detail.kind === "term"
                    ? `근거: ${detail.basis}`
                    : detail.chapter
                      ? `교재 대응: ${detail.chapter}`
                      : ""}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
}
