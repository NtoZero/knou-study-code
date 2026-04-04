"use client";

import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  step: number;
  totalSteps: number;
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function StepControls({
  step,
  totalSteps,
  playing,
  onPlay,
  onStop,
  onReset,
  onNext,
  onPrev,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onReset}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        title="초기화"
      >
        <RotateCcw size={16} />
      </button>
      <button
        onClick={onPrev}
        disabled={step <= 0}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
        title="이전"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={playing ? onStop : onPlay}
        className="rounded-lg bg-gray-900 p-2 text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
        title={playing ? "일시정지" : "재생"}
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <button
        onClick={onNext}
        disabled={step >= totalSteps - 1}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
        title="다음"
      >
        <ChevronRight size={16} />
      </button>
      <span className="ml-2 text-xs text-gray-400">
        {step + 1} / {totalSteps}
      </span>
    </div>
  );
}
