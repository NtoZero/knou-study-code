"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Card } from "@/components/dlShared/ui";
import { Sourced } from "@/components/dlShared/SourceFilter";

const tasks = [
  { id: "classify", title: "분류", icon: "한 장 → 한 범주", question: "이미지에 대표 객체가 무엇인가?", result: "이미지 전체에 하나의 범주를 붙임", labels: ["고양이", "강아지", "자동차"] },
  { id: "localize", title: "분류 + 지역화", icon: "한 장 → 범주 + 위치", question: "대표 객체가 무엇이고 어디에 있는가?", result: "범주와 객체를 둘러싼 위치 정보를 함께 출력", labels: ["강아지", "경계 상자"] },
  { id: "detect", title: "객체 탐지", icon: "여러 객체 → 범주 + 위치", question: "이미지 안의 객체 각각은 무엇이고 어디에 있는가?", result: "여러 객체를 각각 찾고 위치를 표시", labels: ["고양이", "강아지", "자전거"] },
  { id: "segment", title: "인스턴스 분할", icon: "픽셀 → 객체별 영역", question: "각 픽셀이 어느 객체에 속하는가?", result: "픽셀 단위로 영역을 나누고 같은 범주의 개체도 별도로 구분", labels: ["Dog 1", "Dog 2", "Cat 1"] },
  { id: "restore", title: "이미지 복원", icon: "저해상도 → 세밀한 영상", question: "부족한 픽셀 정보로 더 높은 해상도의 영상을 어떻게 복원할까?", result: "저해상도 입력에서 원래 영상과 가까운 고해상도 출력을 예측", labels: ["8 × 8 입력", "32 × 32 출력"] },
  { id: "colorize", title: "흑백 이미지 컬러화", icon: "밝기·형태 → 색상", question: "흑백 사진의 밝기와 형태를 바탕으로 어떤 색상을 예측할까?", result: "밝기와 형태 정보를 이용해 컬러 이미지를 예측", labels: ["그레이스케일", "색상 예측"] },
] as const;

type TaskId = (typeof tasks)[number]["id"];

export default function VisionTaskSelector() {
  const [selected, setSelected] = useState<TaskId>("classify");
  const task = tasks.find((item) => item.id === selected)!;
  return (
    <section>
      <SectionTitle title="이미지에서 무엇을 알아낼까?" subtitle="출력 요구가 달라지면 CNN이 풀 문제의 형태도 달라집니다" />
      <Sourced refs={{ slides: "강의록 6강 PDF 4–11쪽 — 영상처리·컴퓨터 비전·CNN 적용 과제", lecture: "강의 6강 16:48–18:07 — 분류·지역화와 단일/다중 객체" }}>
        <Card>
          <div className="mb-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"><div className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300">영상처리</div><p className="mt-1 text-[10px] leading-4 text-gray-500">이미지를 좋게 만들거나 변형하는 기술. 밝기 조정·노이즈 제거·블러·샤픈 등이 예.</p></div>
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"><div className="text-[10px] font-bold text-fuchsia-700 dark:text-fuchsia-300">컴퓨터 비전</div><p className="mt-1 text-[10px] leading-4 text-gray-500">컴퓨터가 이미지의 대상을 이해하고 판단하는 기술. 분류·객체 탐지·얼굴 인식 등이 예.</p></div>
          </div>
          <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {tasks.map((item) => (
                <button key={item.id} type="button" onClick={() => setSelected(item.id)} aria-pressed={selected === item.id} className={`rounded-xl border p-3 text-left transition-colors ${selected === item.id ? "border-cyan-400 bg-cyan-50 dark:border-cyan-800 dark:bg-cyan-950/30" : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold">{item.title}</span>
                    <span className="text-[9px] text-gray-400">{item.icon}</span>
                  </div>
                  <p className="mt-1 text-[10px] leading-4 text-gray-500">{item.question}</p>
                </button>
              ))}
            </div>
            <div className="rounded-xl bg-slate-950 p-4 text-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-cyan-300">현재 과제</div>
                  <h3 className="mt-1 text-lg font-bold">{task.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-300">{task.result}</p>
                </div>
                <div className="rounded-lg border border-slate-700 px-2 py-1 text-[9px] text-slate-400">출력 보기</div>
              </div>
              <div className="relative mx-auto mt-4 aspect-[1.7/1] max-w-md overflow-hidden rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
                {(selected === "restore" || selected === "colorize") && (
                  <div className="absolute inset-0 flex items-center justify-center gap-5 p-5">
                    <div className="text-center">
                      <div className={`mx-auto grid aspect-square w-24 grid-cols-4 gap-0.5 rounded-md p-1 ${selected === "colorize" ? "bg-gray-500" : "bg-slate-700"}`}>
                        {Array.from({ length: 16 }, (_, i) => <span key={i} className={`rounded-[2px] ${selected === "colorize" ? "bg-gray-300" : "bg-cyan-300"}`} style={{ opacity: 0.24 + ((i * 5) % 10) / 13 }} />)}
                      </div>
                      <span className="mt-1 block text-[9px] text-slate-300">{selected === "colorize" ? "흑백 입력" : "8 × 8 입력"}</span>
                    </div>
                    <span className="text-xl text-cyan-300" aria-hidden="true">→</span>
                    <div className="text-center">
                      <div className={`mx-auto grid aspect-square w-32 grid-cols-8 gap-0.5 rounded-md p-1 ${selected === "colorize" ? "bg-blue-950" : "bg-slate-700"}`}>
                        {Array.from({ length: 64 }, (_, i) => <span key={i} className={`rounded-[1px] ${selected === "colorize" ? ["bg-sky-300", "bg-amber-300", "bg-rose-300", "bg-emerald-300"][Math.floor(i / 16)] : "bg-cyan-300"}`} style={{ opacity: 0.16 + ((i * 7) % 12) / 15 }} />)}
                      </div>
                      <span className="mt-1 block text-[9px] text-slate-300">{selected === "colorize" ? "컬러 예측" : "32 × 32 복원"}</span>
                    </div>
                  </div>
                )}
                {selected !== "restore" && selected !== "colorize" && <>
                <div className="absolute bottom-[19%] left-[17%] h-24 w-28 rounded-[45%] bg-amber-300/80 blur-[1px]" />
                <div className="absolute bottom-[39%] left-[30%] h-14 w-16 rotate-[-20deg] rounded-[45%] bg-amber-200" />
                <div className="absolute bottom-[66%] left-[29%] h-9 w-8 rotate-[-18deg] rounded-t-[80%] rounded-b-md bg-amber-100" />
                <div className="absolute bottom-[66%] left-[44%] h-9 w-8 rotate-[18deg] rounded-t-[80%] rounded-b-md bg-amber-100" />
                <div className="absolute bottom-[29%] left-[20%] h-9 w-20 rounded-full border-2 border-slate-900/40" />
                <div className="absolute bottom-[30%] left-[24%] h-2 w-2 rounded-full bg-slate-900" />
                <div className="absolute bottom-[13%] left-[12%] h-3 w-3 rounded-full bg-slate-700" />
                <div className="absolute bottom-[13%] left-[47%] h-3 w-3 rounded-full bg-slate-700" />
                {selected === "localize" && <div className="absolute bottom-[15%] left-[11%] h-[74%] w-[44%] rounded-lg border-2 border-cyan-300"><span className="absolute -top-5 left-0 rounded bg-cyan-300 px-1.5 py-0.5 text-[9px] font-bold text-slate-950">강아지</span></div>}
                {selected === "detect" && <><div className="absolute bottom-[15%] left-[11%] h-[74%] w-[44%] rounded-lg border-2 border-cyan-300"><span className="absolute -top-5 left-0 rounded bg-cyan-300 px-1.5 py-0.5 text-[9px] font-bold text-slate-950">강아지</span></div><div className="absolute right-[14%] top-[16%] h-[43%] w-[29%] rounded-lg border-2 border-rose-300"><span className="absolute -top-5 left-0 rounded bg-rose-300 px-1.5 py-0.5 text-[9px] font-bold text-slate-950">공</span></div></>}
                {selected === "segment" && <><div className="absolute bottom-[19%] left-[17%] h-24 w-28 rounded-[45%] border-4 border-emerald-300/80" /><div className="absolute bottom-[39%] left-[30%] h-14 w-16 rotate-[-20deg] rounded-[45%] border-4 border-emerald-300/80" /><div className="absolute bottom-[66%] left-[29%] h-9 w-8 rotate-[-18deg] rounded-t-[80%] rounded-b-md border-4 border-emerald-300/80" /><div className="absolute bottom-[66%] left-[44%] h-9 w-8 rotate-[18deg] rounded-t-[80%] rounded-b-md border-4 border-emerald-300/80" /><div className="absolute bottom-[15%] left-[11%] h-[74%] w-[44%] rounded-lg border border-dashed border-emerald-200" /></>}
                {selected === "classify" && <div className="absolute right-3 top-3 rounded-full border border-cyan-300/60 bg-cyan-500/20 px-3 py-1.5 text-[11px] font-bold text-cyan-100">강아지 · 0.96</div>}
                </>}
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-[10px] text-slate-400">{task.question}</p>
                <div className="flex flex-wrap gap-1">{task.labels.map((label) => <span key={label} className="rounded-full bg-slate-800 px-2 py-1 text-[9px] text-slate-300">{label}</span>)}</div>
              </div>
            </div>
          </div>
        </Card>
      </Sourced>
    </section>
  );
}
