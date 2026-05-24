import {
  StepForward, StepBack, Play, Square,
  RotateCcw,
} from 'lucide-react';

interface DebugToolbarProps {
  isPlaying: boolean;
  isAtStart: boolean;
  isAtEnd: boolean;
  currentIndex: number;
  totalSteps: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
}

export function DebugToolbar({
  isPlaying, isAtStart, isAtEnd,
  currentIndex, totalSteps,
  onPlay, onPause, onStepForward, onStepBackward, onReset,
}: DebugToolbarProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onStepBackward}
        disabled={isAtStart}
        className="rounded-lg p-1.5 text-cyan-100 hover:bg-cyan-300/20 disabled:opacity-30"
        title="Step Back (F9 / ←)"
      >
        <StepBack size={16} />
      </button>
      <button
        onClick={onStepForward}
        disabled={isAtEnd}
        className="rounded-lg p-1.5 text-cyan-100 hover:bg-cyan-300/20 disabled:opacity-30"
        title="Step Over (F10 / → / Space)"
      >
        <StepForward size={16} />
      </button>

      <div className="w-px h-4 bg-cyan-300/30 mx-1" />

      {isPlaying ? (
        <button
          onClick={onPause}
          className="rounded-lg p-1.5 text-amber-200 hover:bg-amber-300/20"
          title="Pause"
        >
          <Square size={14} />
        </button>
      ) : (
        <button
          onClick={onPlay}
          disabled={isAtEnd}
          className="rounded-lg p-1.5 text-emerald-200 hover:bg-emerald-300/20 disabled:opacity-30"
          title="Run to End (F5)"
        >
          <Play size={14} />
        </button>
      )}

      <button
        onClick={onReset}
        disabled={isAtStart}
        className="rounded-lg p-1.5 text-cyan-100 hover:bg-cyan-300/20 disabled:opacity-30"
        title="Reset (Shift+F5)"
      >
        <RotateCcw size={14} />
      </button>

      <div className="w-px h-4 bg-cyan-300/30 mx-1" />

      <span className="font-mono text-xs font-bold tabular-nums text-cyan-100">
        Step {currentIndex} / {Math.max(totalSteps - 1, 0)}
      </span>
    </div>
  );
}
