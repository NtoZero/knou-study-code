"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Lightbulb,
  Megaphone,
  MessageSquareQuote,
  MonitorPlay,
  TriangleAlert,
  X,
} from "lucide-react";
import { mlLectures } from "@/lib/constants";
import { getMlBrief, type BriefBlock, type BriefDemo, type BriefSlide } from "@/lib/mlBriefs";
import { SourceBadges } from "@/components/mlShared/SourceFilter";

/** `**굵게**`만 해석하는 아주 작은 표기 */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold text-gray-900 dark:text-gray-50">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

function SayLine({ text }: { text: string }) {
  return (
    <div className="mt-2 flex gap-2 rounded-lg bg-violet-50 px-3 py-2 text-sm leading-6 text-violet-950 dark:bg-violet-950/40 dark:text-violet-100">
      <MessageSquareQuote size={15} className="mt-1 shrink-0 text-violet-500" />
      <span>
        “<Rich text={text} />”
      </span>
    </div>
  );
}

function LectureLine({ text }: { text: string }) {
  return (
    <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-gray-500 dark:text-gray-400">
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200">
        <Megaphone size={10} />
        강의 강조
      </span>
      <span>{text}</span>
    </p>
  );
}

function SlideRow({
  slide,
  accentBg,
  accentBorder,
  onZoom,
}: {
  slide: BriefSlide;
  accentBg: string;
  accentBorder: string;
  onZoom: (src: string, alt: string) => void;
}) {
  const skip = Boolean(slide.skip);
  const label = `p.${slide.page}`;
  return (
    <div
      className={`grid gap-4 border-t border-dashed border-gray-200 py-4 first:border-t-0 dark:border-gray-800 ${
        skip ? "sm:grid-cols-[130px_minmax(0,1fr)]" : "sm:grid-cols-[220px_minmax(0,1fr)]"
      }`}
    >
      <button
        type="button"
        onClick={() => onZoom(slide.img, `${label} ${slide.title}`)}
        aria-label={`${label} 슬라이드 크게 보기`}
        className={`relative block w-full cursor-zoom-in self-start overflow-hidden rounded-lg border bg-white ${
          slide.key ? accentBorder : "border-gray-200 dark:border-gray-700"
        } ${skip ? "max-w-[240px] opacity-80" : ""}`}
      >
        <img src={slide.img} alt={`${label} ${slide.title}`} loading="lazy" className="block h-auto w-full" />
        <span
          className={`absolute left-1.5 top-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-bold text-white ${
            slide.key ? accentBg : "bg-gray-900/75"
          }`}
        >
          {label}
          {slide.key ? " ★" : ""}
        </span>
      </button>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-gray-50">{slide.title}</h3>
          {slide.skip && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              {slide.skip}
            </span>
          )}
        </div>

        {slide.points && (
          <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-6 text-gray-700 dark:text-gray-300">
            {slide.points.map((p) => (
              <li key={p}>
                <Rich text={p} />
              </li>
            ))}
          </ul>
        )}

        {slide.table && (
          <div className="mt-2 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-gray-50 text-xs text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
                <tr>
                  {slide.table.head.map((h) => (
                    <th key={h} className="whitespace-nowrap px-3 py-2 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slide.table.rows.map((row) => (
                  <tr key={row.join("|")} className="border-t border-gray-100 dark:border-gray-800">
                    {row.map((c, i) => (
                      <td key={i} className="px-3 py-1.5 text-gray-700 dark:text-gray-300">
                        <Rich text={c} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {slide.formula && (
          <div className="mt-2 overflow-x-auto rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2 dark:border-blue-900/60 dark:bg-blue-950/30">
            <div className="whitespace-nowrap text-[13px] font-semibold text-blue-900 dark:text-blue-100">
              {slide.formula.expr}
            </div>
            <div className="mt-0.5 text-[11px] text-blue-700/80 dark:text-blue-300/80">{slide.formula.read}</div>
          </div>
        )}

        {slide.say && <SayLine text={slide.say} />}
        {slide.lecture && <LectureLine text={slide.lecture} />}
        {slide.note && <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{slide.note}</p>}
      </div>
    </div>
  );
}

function DemoCard({ demo, lectureId, accentText }: { demo: BriefDemo; lectureId: number; accentText: string }) {
  return (
    <div className="my-4 rounded-xl border border-sky-200 bg-sky-50/50 p-4 dark:border-sky-900 dark:bg-sky-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <MonitorPlay size={16} className="text-sky-600 dark:text-sky-400" />
        <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">강의 페이지에서 시연</span>
        <span className="text-sm font-bold text-gray-900 dark:text-gray-50">{demo.title}</span>
        <Link
          href={`/ml/lecture/${lectureId}#${demo.anchor}`}
          className={`ml-auto inline-flex items-center gap-1 rounded-full border border-current px-2.5 py-0.5 text-xs font-semibold ${accentText}`}
        >
          이 섹션 열기
          <ChevronRight size={12} />
        </Link>
      </div>
      <ol className="mt-3 space-y-3">
        {demo.steps.map((st, i) => (
          <li key={st.act} className="flex gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-600 text-[11px] font-bold text-white">
              {i + 1}
            </span>
            <div className="min-w-0 text-sm leading-6">
              <div className="font-semibold text-gray-900 dark:text-gray-50">{st.act}</div>
              <div className="text-gray-600 dark:text-gray-400">
                {st.see}
                {st.computed && (
                  <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-200">
                    보충 계산
                  </span>
                )}
              </div>
              {st.say && <SayLine text={st.say} />}
            </div>
          </li>
        ))}
      </ol>
      {demo.note && <p className="mt-3 text-xs leading-5 text-gray-500 dark:text-gray-400">{demo.note}</p>}
    </div>
  );
}

function Block({
  block,
  lectureId,
  accent,
  onZoom,
}: {
  block: BriefBlock;
  lectureId: number;
  accent: { bg: string; border: string; text: string };
  onZoom: (src: string, alt: string) => void;
}) {
  switch (block.kind) {
    case "slide":
      return <SlideRow slide={block} accentBg={accent.bg} accentBorder={accent.border} onZoom={onZoom} />;
    case "demo":
      return <DemoCard demo={block} lectureId={lectureId} accentText={accent.text} />;
    case "sub":
      return <h3 className="mt-4 text-sm font-bold text-gray-700 dark:text-gray-200">{block.text}</h3>;
    case "analogy":
      return (
        <div className="my-3 flex gap-2.5 rounded-xl bg-violet-50 px-4 py-3 text-sm leading-6 text-gray-700 dark:bg-violet-950/30 dark:text-gray-300">
          <Lightbulb size={16} className="mt-1 shrink-0 text-violet-500" />
          <div>
            <span className="mr-1.5 font-bold text-violet-700 dark:text-violet-300">비유 · {block.title}</span>
            <Rich text={block.body} />
          </div>
        </div>
      );
    case "warn":
      return (
        <div className="my-3 flex gap-2.5 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          <TriangleAlert size={16} className="mt-1 shrink-0 text-amber-500" />
          <div>
            <span className="mr-1.5 font-bold">{block.title}</span>
            <Rich text={block.body} />
          </div>
        </div>
      );
  }
}

function Accordion({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-100">
        <ChevronRight size={14} className="shrink-0 text-gray-400 transition-transform group-open:rotate-90" />
        {q}
      </summary>
      <div className="border-t border-gray-100 px-4 py-3 text-sm leading-6 text-gray-700 dark:border-gray-800 dark:text-gray-300">
        <Rich text={a} />
      </div>
    </details>
  );
}

function QuizItem({ n, item }: { n: number; item: { q: string; options: string[]; answer: number; why?: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="text-sm font-semibold text-gray-900 dark:text-gray-50">
        Q{n}. {item.q}
      </div>
      <ol className="mt-2 grid gap-1 text-sm text-gray-700 sm:grid-cols-2 dark:text-gray-300">
        {item.options.map((o, i) => (
          <li
            key={o}
            className={`rounded-md px-2 py-1 ${
              open && i === item.answer ? "bg-emerald-50 font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200" : ""
            }`}
          >
            {"①②③④"[i]} {o}
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-2 rounded-md border border-dashed border-gray-300 px-2 py-0.5 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-gray-100"
      >
        {open ? "정답 가리기" : "정답 보기"}
      </button>
      {open && (
        <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
          정답 {"①②③④"[item.answer]} — {item.why}
        </span>
      )}
    </li>
  );
}

export default function LectureBrief({ lectureId }: { lectureId: number }) {
  const brief = getMlBrief(lectureId);
  const lec = mlLectures.find((l) => l.id === lectureId);
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

  if (!brief || !lec) return null;

  const accent = { bg: lec.bgClass, border: lec.borderClass, text: lec.textClass };
  const onZoom = (src: string, alt: string) => setZoom({ src, alt });
  const total = brief.flow.reduce((a, f) => a + f.minutes, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 max-sm:pl-16">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link href="/ml" className="hover:text-gray-900 dark:hover:text-gray-200">
          머신러닝
        </Link>
        <ChevronRight size={14} />
        <Link href={`/ml/lecture/${lectureId}`} className="hover:text-gray-900 dark:hover:text-gray-200">
          {lectureId}강. {lec.title}
        </Link>
        <ChevronRight size={14} />
        <span className={`font-medium ${lec.textClass}`}>발표 간소화판</span>
      </div>

      <div className={`mb-8 rounded-xl border-l-4 ${lec.borderClass} ${lec.bgLightClass} p-6`}>
        <div className={`text-xs font-semibold ${lec.textClass}`}>발표 간소화판 · 강의록 슬라이드 순서</div>
        <h1 className="mt-1 text-2xl font-bold">
          {lectureId}강. {lec.title}
        </h1>
        <p className="mt-2 text-[15px] leading-7 text-gray-700 dark:text-gray-200">
          <Rich text={brief.oneLine} />
        </p>
        <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
          강의록 PDF 슬라이드 한 장마다 핵심 2~3줄과 그대로 읽을 멘트 한 문장만 담았습니다. 썸네일을 누르면 크게
          보입니다. <span className="font-semibold">★</span>는 꼭 말할 슬라이드, 회색 표시는 넘겨도 되는 슬라이드입니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/ml/lecture/${lectureId}`}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white ${lec.bgClass}`}
          >
            <ChevronLeft size={12} />
            강의 페이지로
          </Link>
          {brief.sections.map((sec) => (
            <a
              key={sec.id}
              href={`#brief-${sec.id}`}
              className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-gray-700 hover:bg-white dark:bg-gray-900/70 dark:text-gray-200"
            >
              {sec.title}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold">한눈에 보기</h2>
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <Clock size={13} />
              발표 {total}분 기준
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {brief.overview.map((o) => (
              <div key={o.title} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className={`text-sm font-bold ${lec.textClass}`}>{o.title}</div>
                <div className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{o.body}</div>
              </div>
            ))}
          </div>
          {brief.overviewAnalogy && (
            <Block block={{ kind: "analogy", ...brief.overviewAnalogy }} lectureId={lectureId} accent={accent} onZoom={onZoom} />
          )}

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
                  <tr>
                    <th className="px-3 py-2">발표 흐름</th>
                    <th className="px-3 py-2">슬라이드</th>
                    <th className="px-3 py-2">시간</th>
                  </tr>
                </thead>
                <tbody>
                  {brief.flow.map((f) => (
                    <tr key={f.part} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="px-3 py-2">
                        <div className="font-semibold text-gray-800 dark:text-gray-100">{f.part}</div>
                        <div className="text-xs text-gray-500">{f.gist}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-gray-600 dark:text-gray-400">{f.pages}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-gray-600 dark:text-gray-400">{f.minutes}분</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
                  <tr>
                    <th className="px-3 py-2">먼저 알아둘 말</th>
                    <th className="px-3 py-2">쉬운 뜻</th>
                  </tr>
                </thead>
                <tbody>
                  {brief.terms.map((t) => (
                    <tr key={t.term} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="whitespace-nowrap px-3 py-2 font-semibold text-gray-800 dark:text-gray-100">{t.term}</td>
                      <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                        {t.easy}
                        <div className="text-xs text-gray-400">{t.where}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {brief.emphasis && (
            <div className="mt-4 text-sm leading-6 text-gray-700 dark:text-gray-300">
              <LectureLine text={brief.emphasis.replace(/\*\*/g, "")} />
            </div>
          )}
        </section>

        {brief.sections.map((sec) => (
          <section key={sec.id} id={`brief-${sec.id}`} className="scroll-mt-16">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold">{sec.title}</h2>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold text-white ${lec.bgClass}`}>{sec.pages}</span>
            </div>
            <SourceBadges refs={sec.refs} className="mb-3" />
            <div className="rounded-xl border border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
              {sec.blocks
                .filter((b) => b.kind === "slide")
                .map((b, i) => (
                  <Block key={i} block={b} lectureId={lectureId} accent={accent} onZoom={onZoom} />
                ))}
            </div>
            {sec.blocks
              .filter((b) => b.kind !== "slide")
              .map((b, i) => (
                <Block key={i} block={b} lectureId={lectureId} accent={accent} onZoom={onZoom} />
              ))}
          </section>
        ))}

        <section id="brief-checkpoints" className="scroll-mt-16">
          <div className="mb-6">
            <h2 className="text-xl font-bold">헷갈리는 지점 · 예상 질문</h2>
            <p className="mt-1 text-sm text-gray-500">질문을 먼저 읽고 청중이 답을 떠올리게 한 뒤 펼칩니다</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500">헷갈리는 지점</div>
              {brief.checkpoints.map((c) => (
                <Accordion key={c.q} q={c.q} a={c.a} />
              ))}
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500">예상 질문</div>
              {brief.faqs.map((c) => (
                <Accordion key={c.q} q={c.q} a={c.a} />
              ))}
            </div>
          </div>
        </section>

        <section id="brief-closing" className="scroll-mt-16">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold">마무리 · 공식 연습문제</h2>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold text-white ${lec.bgClass}`}>p.{brief.closing.page}</span>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
            <SlideRow slide={brief.closing} accentBg={accent.bg} accentBorder={accent.border} onZoom={onZoom} />
          </div>
          <ol className="mt-4 space-y-3">
            {brief.quiz.map((q, i) => (
              <QuizItem key={q.q} n={i + 1} item={q} />
            ))}
          </ol>
        </section>
      </div>

      <div className="mt-16 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
        <Link
          href={`/ml/lecture/${lectureId}`}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <ChevronLeft size={16} />
          {lectureId}강 강의 페이지
        </Link>
      </div>

      {zoom && (
        <div
          role="dialog"
          aria-label={zoom.alt}
          onClick={() => setZoom(null)}
          className="fixed inset-0 z-[60] flex cursor-zoom-out items-center justify-center bg-black/80 p-3"
        >
          <button
            type="button"
            aria-label="닫기"
            className="absolute right-4 top-4 rounded-full bg-white/90 p-1.5 text-gray-800"
          >
            <X size={18} />
          </button>
          <img src={zoom.src} alt={zoom.alt} className="max-h-[92vh] max-w-[96vw] rounded-md bg-white" />
        </div>
      )}
    </div>
  );
}
