"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";
import { Sourced } from "@/components/mlShared/SourceFilter";
import { Card, CardTitle, Chip, ComputedNote, Hint, Scroller, Slider, LectureNote } from "./ui";

/**
 * 13.2.3 — (2) Seq2Seq 모델, (3) Attention 모델.
 * 문장 예와 구조는 그림 13-25·13-26 그대로이고,
 * 주의 가중치 값과 병목 막대는 이 화면에서 정한 예시다.
 */

const ENC = ["I", "have", "the", "book"];
const DEC_IN = ["<sos>", "J'ai", "le", "livre"];
const DEC_OUT = ["J'ai", "le", "livre", "<eos>"];

/** ATT[j][i] — 디코더 j번째 출력을 낼 때 인코더 i번째 셀을 반영하는 정도 (예시 값, 행의 합 = 1) */
const ATT: number[][] = [
  [0.55, 0.35, 0.05, 0.05],
  [0.05, 0.1, 0.7, 0.15],
  [0.03, 0.04, 0.13, 0.8],
  [0.1, 0.15, 0.25, 0.5],
];

const LAST = ENC.length + DEC_OUT.length; // 0..3 인코더, 4 문맥 벡터, 5..8 디코더

const W = 780;
const H = 270;
const CELL_W = 66;
const encX = (i: number) => 20 + i * 80;
const decX = (j: number) => 440 + j * 82;
const CTX_X = 345;
const LSTM_Y = 120;

export default function Seq2SeqAttentionLab() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [attn, setAttn] = useState(false);
  const [len, setLen] = useState(4);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setStep((v) => {
        if (v >= LAST) {
          setPlaying(false);
          return v;
        }
        return v + 1;
      });
    }, 900);
    return () => window.clearInterval(id);
  }, [playing]);

  const encActive = step < ENC.length ? step : -1;
  const ctxActive = step === ENC.length;
  const decActive = step > ENC.length ? step - ENC.length - 1 : -1;
  const encDone = (i: number) => step > i;
  const decDone = (j: number) => decActive > j;

  const caption =
    step < ENC.length
      ? `인코더 ${step + 1}단계 — “${ENC[step]}”를 입력받아 정보를 축적한다.`
      : step === ENC.length
        ? attn
          ? "입력 문장의 끝. Attention 모델에서는 인코더 각 셀의 상태를 모두 남겨 두고 디코더가 필요할 때마다 읽어 온다."
          : "입력 문장의 끝. 지금까지의 정보가 하나의 고정된 문맥 벡터(CONTEXT)로 압축되어 디코더로 넘어간다."
        : decActive === 0
          ? `디코더 1단계 — 생성을 시작하는 특수 단어 <sos>를 입력으로 받아 “${DEC_OUT[0]}”을 낸다.`
          : decActive === DEC_OUT.length - 1
            ? "디코더 마지막 단계 — 문장의 끝을 의미하는 <eos>를 출력하면서 생성이 완료된다."
            : `디코더 ${decActive + 1}단계 — 앞에서 생성한 “${DEC_IN[decActive]}”가 다음 LSTM 셀의 입력으로 들어가 “${DEC_OUT[decActive]}”을 낸다.`;

  const cellFill = (on: boolean, done: boolean) =>
    on ? "fill-violet-600" : done ? "fill-violet-100 dark:fill-violet-900/50" : "fill-gray-100 dark:fill-gray-800";
  const cellText = (on: boolean) => (on ? "fill-white" : "fill-gray-600 dark:fill-gray-300");

  return (
    <section id="seq2seq-attention" className="scroll-mt-32">
      <SectionTitle
        title="Seq2Seq 모델과 Attention 모델"
        subtitle="문장을 받아 다른 문장으로 — 하나의 문맥 벡터에 담을 것인가, 매번 다시 읽어 올 것인가"
      />

      <div className="space-y-5">
        <Sourced refs={{ textbook: "13.2.3 — (2) Seq2Seq 모델", slides: "Seq2Seq 모델", lecture: "Seq2Seq은 2014년 기계번역을 위해 개발된 유명한 모델로, 초기 구글 번역기가 이 모델을 사용했다고 소개" }}>
          <Card>
            <CardTitle>Seq2Seq — 입력된 시퀀스로부터 다른 도메인의 시퀀스를 출력</CardTitle>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[11px] font-bold text-violet-600 dark:text-violet-400">인코더 (RNN·LSTM)</p>
                <p className="mt-1 text-[12px] leading-6 text-gray-700 dark:text-gray-200">
                  입력 → 임베딩 벡터로 표현된 단어의 시퀀스
                  <br />
                  출력 → 입력 시퀀스를 하나의 벡터로 압축한 <strong>문맥 벡터</strong>(context vector)
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-[11px] font-bold text-violet-600 dark:text-violet-400">디코더 (RNN·LSTM)</p>
                <p className="mt-1 text-[12px] leading-6 text-gray-700 dark:text-gray-200">
                  입력 → 인코더에서 출력된 문맥 벡터
                  <br />
                  출력 → 단어 벡터를 <strong>순차적으로</strong> 출력
                </p>
              </div>
            </div>
            <p className="mt-2 text-[12px] leading-6 text-gray-600 dark:text-gray-300">
              응용 → 기계번역, 대화, 질의응답, 요약, STT(speech-to-text). 교재는 이 구조를 “문장을
              입력받아 일단 특징벡터(context)로 변환하는 인코더모듈과 특징벡터를 다시 다른 시퀀스로 변환하여
              출력하는 디코더모듈로 구성된다”고 적는다.
            </p>
            <LectureNote>
              Seq2Seq은 2014년에 기계번역을 위해 개발된 유명한 모델로, 구글 번역기도 처음 시작할 당시에는 이 모델로 만들어졌다. 지금은 더 발전한 모델을 쓴다.
            </LectureNote>
          </Card>
        </Sourced>

        <Sourced
          refs={{
            textbook: "13.2.3 — (2) Seq2Seq 모델 · (3) Attention 모델",
            slides: "Seq2Seq 모델 · Attention 모델", lecture: "Attention은 디코더가 단어를 만들 때마다 인코더 정보 중 어느 부분을 골라 읽어 올지를 정하며, 그 선택이 곧 성능 향상의 포인트라고 강조",
          }}
        >
          <Card>
            <CardTitle>“I have the book” → “J’ai le livre” 한 단계씩 따라가기</CardTitle>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Chip active={!attn} onClick={() => setAttn(false)}>
                Seq2Seq (문맥 벡터 하나)
              </Chip>
              <Chip active={attn} onClick={() => setAttn(true)}>
                Attention 사용
              </Chip>
            </div>

            <Scroller>
              <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[640px] w-full" role="img" aria-label="인코더-디코더 구조">
                <text x={encX(0)} y={18} className="fill-gray-500 text-[11px] font-bold">인코더</text>
                <text x={decX(0)} y={18} className="fill-gray-500 text-[11px] font-bold">디코더</text>

                {/* 인코더 순환 화살표 */}
                {ENC.map((_, i) =>
                  i < ENC.length - 1 ? (
                    <line
                      key={`er${i}`}
                      x1={encX(i) + CELL_W}
                      y1={LSTM_Y + 14}
                      x2={encX(i + 1)}
                      y2={LSTM_Y + 14}
                      className={encDone(i + 1) || encActive === i + 1 ? "stroke-violet-500" : "stroke-gray-300 dark:stroke-gray-700"}
                      strokeWidth={2}
                    />
                  ) : null,
                )}
                {/* 인코더 → 문맥 벡터 */}
                {!attn && (
                  <>
                    <line
                      x1={encX(3) + CELL_W}
                      y1={LSTM_Y + 14}
                      x2={CTX_X}
                      y2={LSTM_Y + 14}
                      className={step >= ENC.length ? "stroke-violet-500" : "stroke-gray-300 dark:stroke-gray-700"}
                      strokeWidth={2}
                    />
                    <rect
                      x={CTX_X}
                      y={LSTM_Y - 4}
                      width={74}
                      height={36}
                      rx={6}
                      className={ctxActive ? "fill-amber-400" : step > ENC.length ? "fill-amber-100 dark:fill-amber-900/50" : "fill-gray-100 dark:fill-gray-800"}
                    />
                    <text x={CTX_X + 37} y={LSTM_Y + 18} textAnchor="middle" className="fill-gray-800 text-[11px] font-bold dark:fill-gray-100">
                      CONTEXT
                    </text>
                    <line
                      x1={CTX_X + 74}
                      y1={LSTM_Y + 14}
                      x2={decX(0)}
                      y2={LSTM_Y + 14}
                      className={step > ENC.length ? "stroke-amber-500" : "stroke-gray-300 dark:stroke-gray-700"}
                      strokeWidth={2}
                    />
                  </>
                )}

                {/* 주의집중 선 */}
                {attn &&
                  decActive >= 0 &&
                  ENC.map((_, i) => (
                    <path
                      key={`at${i}`}
                      d={`M ${encX(i) + CELL_W / 2} ${LSTM_Y} Q ${(encX(i) + decX(decActive)) / 2 + CELL_W / 2} ${LSTM_Y - 105} ${decX(decActive) + 8} ${LSTM_Y}`}
                      fill="none"
                      className="stroke-amber-500"
                      strokeWidth={1 + ATT[decActive][i] * 7}
                      strokeOpacity={0.15 + ATT[decActive][i] * 0.85}
                      strokeLinecap="round"
                    />
                  ))}
                {attn && decActive >= 0 && (
                  <text x={(encX(3) + decX(0)) / 2 + 30} y={LSTM_Y - 70} textAnchor="middle" className="fill-amber-600 text-[11px] font-bold">
                    Attention
                  </text>
                )}

                {/* 디코더 순환 화살표 */}
                {DEC_OUT.map((_, j) =>
                  j < DEC_OUT.length - 1 ? (
                    <line
                      key={`dr${j}`}
                      x1={decX(j) + CELL_W}
                      y1={LSTM_Y + 14}
                      x2={decX(j + 1)}
                      y2={LSTM_Y + 14}
                      className={decDone(j) ? "stroke-violet-500" : "stroke-gray-300 dark:stroke-gray-700"}
                      strokeWidth={2}
                    />
                  ) : null,
                )}

                {/* 인코더 셀 */}
                {ENC.map((w, i) => {
                  const on = encActive === i;
                  const done = encDone(i);
                  return (
                    <g key={`e${i}`}>
                      <rect x={encX(i)} y={LSTM_Y} width={CELL_W} height={28} rx={5} className={cellFill(on, done)} />
                      <text x={encX(i) + CELL_W / 2} y={LSTM_Y + 18} textAnchor="middle" className={`text-[11px] font-bold ${cellText(on)}`}>
                        LSTM
                      </text>
                      <rect x={encX(i)} y={LSTM_Y + 50} width={CELL_W} height={22} rx={4} className="fill-gray-50 stroke-gray-200 dark:fill-gray-900 dark:stroke-gray-700" />
                      <text x={encX(i) + CELL_W / 2} y={LSTM_Y + 65} textAnchor="middle" className="fill-gray-500 text-[10px]">
                        embedding
                      </text>
                      <line x1={encX(i) + CELL_W / 2} y1={LSTM_Y + 50} x2={encX(i) + CELL_W / 2} y2={LSTM_Y + 28} className="stroke-gray-300 dark:stroke-gray-600" />
                      <text x={encX(i) + CELL_W / 2} y={LSTM_Y + 96} textAnchor="middle" className={`text-[12px] font-bold ${on ? "fill-violet-600" : "fill-gray-700 dark:fill-gray-200"}`}>
                        {w}
                      </text>
                    </g>
                  );
                })}

                {/* 디코더 셀 */}
                {DEC_OUT.map((w, j) => {
                  const on = decActive === j;
                  const done = decDone(j);
                  const shown = on || done;
                  return (
                    <g key={`d${j}`}>
                      <rect x={decX(j)} y={LSTM_Y} width={CELL_W} height={28} rx={5} className={cellFill(on, done)} />
                      <text x={decX(j) + CELL_W / 2} y={LSTM_Y + 18} textAnchor="middle" className={`text-[11px] font-bold ${cellText(on)}`}>
                        LSTM
                      </text>
                      <line x1={decX(j) + CELL_W / 2} y1={LSTM_Y} x2={decX(j) + CELL_W / 2} y2={LSTM_Y - 38} className="stroke-gray-300 dark:stroke-gray-600" />
                      <rect
                        x={decX(j) + 4}
                        y={LSTM_Y - 64}
                        width={CELL_W - 8}
                        height={24}
                        rx={4}
                        className={shown ? "fill-violet-50 stroke-violet-400 dark:fill-violet-950/40" : "fill-transparent stroke-gray-300 dark:stroke-gray-700"}
                        strokeDasharray={shown ? undefined : "3 3"}
                      />
                      <text x={decX(j) + CELL_W / 2} y={LSTM_Y - 48} textAnchor="middle" className={`text-[11.5px] font-bold ${shown ? "fill-violet-700 dark:fill-violet-300" : "fill-gray-300"}`}>
                        {shown ? w : "?"}
                      </text>
                      <rect x={decX(j)} y={LSTM_Y + 50} width={CELL_W} height={22} rx={4} className="fill-gray-50 stroke-gray-200 dark:fill-gray-900 dark:stroke-gray-700" />
                      <text x={decX(j) + CELL_W / 2} y={LSTM_Y + 65} textAnchor="middle" className="fill-gray-500 text-[10px]">
                        embedding
                      </text>
                      <line x1={decX(j) + CELL_W / 2} y1={LSTM_Y + 50} x2={decX(j) + CELL_W / 2} y2={LSTM_Y + 28} className="stroke-gray-300 dark:stroke-gray-600" />
                      <text x={decX(j) + CELL_W / 2} y={LSTM_Y + 96} textAnchor="middle" className={`text-[12px] font-bold ${j === 0 ? "fill-gray-400" : "fill-gray-700 dark:fill-gray-200"}`}>
                        {DEC_IN[j]}
                      </text>
                      {/* 생성된 단어가 다음 입력으로 */}
                      {j > 0 && decDone(j - 1) && (
                        <path
                          d={`M ${decX(j - 1) + CELL_W / 2 + 18} ${LSTM_Y - 52} C ${decX(j) - 6} ${LSTM_Y - 52}, ${decX(j) + 4} ${LSTM_Y + 110}, ${decX(j) + CELL_W / 2 - 14} ${LSTM_Y + 84}`}
                          fill="none"
                          className="stroke-violet-300 dark:stroke-violet-700"
                          strokeDasharray="4 3"
                        />
                      )}
                    </g>
                  );
                })}
                <text x={W / 2} y={H - 10} textAnchor="middle" className="fill-gray-400 text-[10px]">
                  점선 — 앞에서 생성된 단어가 다음 LSTM 셀의 입력으로 들어간다
                </text>
              </svg>
            </Scroller>

            <p className="mt-2 min-h-[48px] rounded-lg bg-gray-50 p-3 text-[12.5px] leading-6 text-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
              {caption}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setStep((v) => Math.max(0, v - 1))}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-700"
              >
                <ChevronLeft size={13} /> 이전
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!playing && step >= LAST) setStep(0);
                  setPlaying((p) => !p);
                }}
                className="flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs text-white"
              >
                {playing ? <Pause size={13} /> : <Play size={13} />} {playing ? "멈춤" : "재생"}
              </button>
              <button
                type="button"
                onClick={() => setStep((v) => Math.min(LAST, v + 1))}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-700"
              >
                다음 <ChevronRight size={13} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(0);
                  setPlaying(false);
                }}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-700"
              >
                <RotateCcw size={13} /> 처음
              </button>
              <span className="text-[11px] text-gray-500">
                {step + 1} / {LAST + 1}
              </span>
            </div>

            {attn && decActive >= 0 && (
              <div className="mt-3 rounded-lg border border-amber-200 p-3 dark:border-amber-900">
                <p className="mb-2 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                  “{DEC_OUT[decActive]}”을 생성할 때 인코더 각 셀의 정보를 반영하는 정도
                </p>
                <div className="space-y-1">
                  {ENC.map((w, i) => (
                    <div key={w} className="flex items-center gap-2 text-[11px]">
                      <span className="w-12 font-mono text-gray-600 dark:text-gray-300">{w}</span>
                      <div className="h-2.5 flex-1 rounded-sm bg-gray-100 dark:bg-gray-800">
                        <div className="h-2.5 rounded-sm bg-amber-500" style={{ width: `${(ATT[decActive][i] * 100).toFixed(0)}%` }} />
                      </div>
                      <span className="w-10 text-right font-mono">{ATT[decActive][i].toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3">
              <ComputedNote>
                문장 예와 인코더·디코더 구조는 교재·강의록 그림 그대로입니다. Attention 모드의 선 굵기와
                막대 값은 “출력 단어마다 인코더 셀의 반영 정도가 달라진다”는 점을 보이려고 이 화면에서 정한
                예시이며, 실제로는 주의집중 모듈이 학습으로 자동 조절합니다.
              </ComputedNote>
            </div>
          </Card>
        </Sourced>

        <Sourced refs={{ textbook: "13.2.3 — (3) Attention 모델", slides: "Attention 모델 — Seq2Seq 모델의 문제", lecture: "하나의 고정된 벡터로 압축하는 과정에서 정보 손실이 생기고, 입력 문장이 길수록 더 심해진다고 강조" }}>
          <Card>
            <CardTitle>Seq2Seq 모델의 문제 — 문장이 길어질수록 한 벡터가 떠안는 짐</CardTitle>
            <Slider label="입력 문장의 길이" value={len} min={4} max={40} step={1} onChange={setLen} display={`${len}단어`} />
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-rose-300 p-3 dark:border-rose-800">
                <p className="text-[11px] font-bold text-rose-600">Seq2Seq — 고정된 문맥 벡터 1개</p>
                <div className="mt-2 flex flex-wrap gap-0.5">
                  {Array.from({ length: len }, (_, i) => (
                    <span key={i} className="h-2.5 w-2.5 rounded-sm bg-rose-400" />
                  ))}
                </div>
                <p className="mt-1 text-[10.5px] text-gray-400">↓ 모두 같은 크기의 상자 하나로</p>
                <div className="mt-1 h-6 w-20 rounded-md bg-amber-300 text-center text-[10px] font-bold leading-6">
                  CONTEXT
                </div>
                <p className="mt-2 text-[12px] text-gray-700 dark:text-gray-200">
                  벡터 하나가 떠안는 단어 수: <strong>{len}</strong>
                </p>
              </div>
              <div className="rounded-lg border border-violet-300 p-3 dark:border-violet-700">
                <p className="text-[11px] font-bold text-violet-600 dark:text-violet-400">Attention — 셀마다 상태를 남김</p>
                <div className="mt-2 flex flex-wrap gap-0.5">
                  {Array.from({ length: len }, (_, i) => (
                    <span key={i} className="h-2.5 w-2.5 rounded-sm bg-violet-400" />
                  ))}
                </div>
                <p className="mt-1 text-[10.5px] text-gray-400">↓ 출력 단어마다 필요한 셀을 골라 읽음</p>
                <div className="mt-1 flex flex-wrap gap-0.5">
                  {Array.from({ length: len }, (_, i) => (
                    <span key={i} className="h-2.5 w-2.5 rounded-sm border border-violet-400" />
                  ))}
                </div>
                <p className="mt-2 text-[12px] text-gray-700 dark:text-gray-200">
                  상태 하나가 떠안는 단어 수: <strong>1</strong> (읽을 수 있는 상태는 {len}개)
                </p>
              </div>
            </div>
            <ComputedNote>
              이 막대는 개수만 비교하는 정성적 그림입니다. 원자료가 말하는 것은 “하나의 고정된 특징벡터로
              요약·압축하면 정보 손실이 발생하고, 입력 문장의 길이가 긴 경우 성능 저하를 초래한다”는 데까지입니다.
            </ComputedNote>
            <ul className="mt-3 space-y-1 text-[12.5px] leading-6 text-gray-700 dark:text-gray-200">
              <li>
                • <strong>문제</strong> — 인코더로부터 얻어진 정보를 하나의 고정된 특징벡터로 요약·압축 →
                정보 손실 발생, 입력 문장이 길면 성능 저하.
              </li>
              <li>
                • <strong>해결</strong> — 디코더에서 출력 단어를 생성할 때마다 인코더의 전체 상태에 대한
                선택적 주의를 통해 각 셀의 정보를 읽어 온다. 출력 순서에 따라 읽어 오는 정보의 반영 정도를
                주의집중(attention) 모듈이 자동으로 조절한다.
              </li>
            </ul>
            <Hint>
              오답 기준 — “Seq2Seq가 Attention 모델의 문제점을 해결했다”는 순서를 뒤집은 진술이다. 문맥
              벡터 병목은 Seq2Seq의 문제이고, 이를 보완하려고 제안된 것이 Attention이다. Seq2Seq은
              처음 제안될 당시 최고 수준의 기계번역 성능을 보였으나 이후 이 한계가 지적되었다.
            </Hint>
          </Card>
        </Sourced>
      </div>
    </section>
  );
}
