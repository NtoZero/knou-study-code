"use client";

import KeyPhrase from "@/components/dlShared/KeyPhrase";
import { useState } from "react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/dlShared/SourceFilter";
import { Card, CardTitle, Chip } from "@/components/dlShared/ui";

const experiments = [
  { label: "A와 A-LRN", variants: [
    { name: "A", counts: [1, 1, 2, 2, 2], detail: "모든 합성곱에 3×3 필터" },
    { name: "A-LRN", counts: [1, 1, 2, 2, 2], detail: "첫 합성곱 뒤에 LRN 추가" }],
    question: "정규화를 추가하면 정확도가 더 높아질까?",
    result: "두 구성은 각각 8개의 합성곱층과 3개의 완전연결층으로 11개 가중치 층을 갖습니다. LRN을 넣어도 정확도 향상은 크지 않았고, 더 깊은 B·C·D·E 구성에는 LRN을 두지 않았습니다." },
  { label: "C와 D", variants: [
    { name: "C", counts: [2, 2, 3, 3, 3], detail: "블록 3·4·5의 마지막 합성곱이 1×1" },
    { name: "D", counts: [2, 2, 3, 3, 3], detail: "같은 위치에도 3×3 필터" }],
    question: "같은 16층인데 구조가 어떻게 다를까?",
    result: "C의 1×1 합성곱은 한 위치에서 채널을 조합합니다. D의 3×3 합성곱은 그 위치를 둘러싼 이웃까지 봅니다. 층 수와 블록별 반복 수가 같아도 한 출력이 참조하는 입력 범위는 달라집니다." },
  { label: "B와 E", variants: [
    { name: "B", counts: [2, 2, 2, 2, 2], detail: "다섯 블록에 합성곱을 두 층씩 배치" },
    { name: "E", counts: [2, 2, 4, 4, 4], detail: "블록 3·4·5의 합성곱을 네 층으로 확장" }],
    question: "VGG13과 VGG19의 여섯 층 차이는 어디에 있을까?",
    result: "마지막 세 블록에 합성곱을 두 층씩 더하면 6개 층이 늘어납니다. 구성 A, B, D, E의 11·13·16·19층 비교에서는 더 깊은 구성에서 분류 오류율이 낮아지는 경향이 나타났습니다." },
];

export default function VGGConfigurations() {
  const [selected, setSelected] = useState(0);
  const experiment = experiments[selected];
  return (
    <section id="vgg-configurations" className="scroll-mt-32">
      <SectionTitle title="VGG 구성표로 실험 조건 비교하기" subtitle="두 모델에서 같게 둔 조건을 찾고, 어떤 층을 바꾸었는지 확인하세요." />
      <Sourced refs={{ slides: "슬라이드 25–26 — VGG 구성 A, A-LRN, B, C, D, E", lecture: "42:59–43:42 — LRN 생략과 모델 깊이에 따른 오류율 변화" }}>
        <Card>
          <div className="mb-4 rounded-xl border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-900 dark:bg-violet-950/30">
            <p className="text-sm font-bold text-violet-950 dark:text-violet-100">표의 층 수와 비교 짝을 먼저 읽어요</p>
            <p className="mt-1 text-[13px] leading-6 text-violet-900 dark:text-violet-200">VGG 이름의 층 수는 <KeyPhrase>가중치를 학습하는 합성곱층과 완전연결층을 합한 값</KeyPhrase>이에요. 예를 들어 D는 블록별 합성곱 2+2+3+3+3=13층에 완전연결 3층을 더해 16층이에요. 풀링층과 LRN은 이 합계에 들어가지 않아요.</p>
            <div className="mt-3 overflow-x-auto rounded-lg bg-white/80 dark:bg-gray-900/60">
              <table className="w-full min-w-[600px] text-left text-[13px] leading-6">
                <thead><tr className="border-b border-gray-200 text-gray-500 dark:border-gray-700"><th className="p-2">비교 짝</th><th className="p-2">같게 둔 조건</th><th className="p-2">바뀐 조건과 읽을 점</th></tr></thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-800"><th scope="row" className="p-2">A / A-LRN</th><td className="p-2">각각 8개 합성곱 + 3개 완전연결 = 11층</td><td className="p-2">A-LRN에만 LRN을 추가한다. 비교 결과 LRN의 정확도 향상은 크지 않아 더 깊은 B–E에는 두지 않았다.</td></tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800"><th scope="row" className="p-2">C / D</th><td className="p-2">블록별 2, 2, 3, 3, 3개 합성곱 + 완전연결 3개 = 16층</td><td className="p-2">C는 블록 3–5의 마지막 필터를 1×1로 두고, D는 같은 자리에 3×3을 둔다. 1×1은 같은 위치의 채널을 조합하고 3×3은 주변 공간도 본다.</td></tr>
                  <tr><th scope="row" className="p-2">B / E</th><td className="p-2">다섯 합성곱 블록과 완전연결 3층을 사용</td><td className="p-2">B는 합성곱 10+완전연결 3=13층, E는 합성곱 16+완전연결 3=19층이다. E는 마지막 세 블록에 두 층씩 더 쌓는다.</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[13px] leading-6 text-violet-900 dark:text-violet-200">구성 A, B, D, E의 11·13·16·19층 비교에서 깊어질수록 오류율이 낮아지는 경향이 관찰됐다. 짝 비교에서는 층 수뿐 아니라 필터 크기와 정규화처럼 실제로 달라진 조건도 함께 확인해요.</p>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">{experiments.map((item, i) => <Chip key={item.label} active={i === selected} onClick={() => setSelected(i)}>{item.label}</Chip>)}</div>
          <CardTitle>{experiment.question}</CardTitle>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] text-center text-sm">
              <caption className="mb-2 text-left text-xs text-gray-500">블록별 합성곱층 개수 · 가중치 층 합계에는 완전연결층 3개 포함</caption>
              <thead><tr className="border-b dark:border-gray-700"><th scope="col" className="p-2">구성</th>{[1, 2, 3, 4, 5].map(i => <th scope="col" key={i}>{i}블록</th>)}<th scope="col">층 합계</th></tr></thead>
              <tbody>{experiment.variants.map(variant => <tr key={variant.name} className="border-b dark:border-gray-700">
                <th className="p-2" scope="row">{variant.name}</th>{variant.counts.map((count, i) => <td key={i} className="font-mono">{count}</td>)}<td className="font-bold">{3 + variant.counts.reduce((a, b) => a + b, 0)}</td>
              </tr>)}</tbody>
            </table>
          </div>
          <div className="my-3 grid gap-2 sm:grid-cols-2">{experiment.variants.map(v => <p key={v.name} className="rounded-lg bg-violet-50 p-3 text-sm dark:bg-violet-950/40"><b>{v.name}</b> · {v.detail}</p>)}</div>
          <p className="text-sm leading-6">{experiment.result}</p>
        </Card>
      </Sourced>
    </section>
  );
}
