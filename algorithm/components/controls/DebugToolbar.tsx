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
        className="p-1.5 rounded hover:bg-slate-600 disabled:opacity-30 text-slate-300"
        title="Step Back (F9 / ←)"
      >
        <StepBack size={16} />
      </button>
      <button
        onClick={onStepForward}
        disabled={isAtEnd}
        className="p-1.5 rounded hover:bg-slate-600 disabled:opacity-30 text-slate-300"
        title="Step Over (F10 / → / Space)"
      >
        <StepForward size={16} />
      </button>

      <div className="w-px h-4 bg-slate-600 mx-1" />

      {isPlaying ? (
        <button
          onClick={onPause}
          className="p-1.5 rounded hover:bg-slate-600 text-amber-400"
          title="Pause"
        >
          <Square size={14} />
        </button>
      ) : (
        <button
          onClick={onPlay}
          disabled={isAtEnd}
          className="p-1.5 rounded hover:bg-slate-600 disabled:opacity-30 text-emerald-400"
          title="Run to End (F5)"
        >
          <Play size={14} />
        </button>
      )}

      <button
        onClick={onReset}
        disabled={isAtStart}
        className="p-1.5 rounded hover:bg-slate-600 disabled:opacity-30 text-slate-300"
        title="Reset (Shift+F5)"
      >
        <RotateCcw size={14} />
      </button>

      <div className="w-px h-4 bg-slate-600 mx-1" />

      <span className="text-xs text-slate-400 font-mono tabular-nums">
        Step {currentIndex} / {Math.max(totalSteps - 1, 0)}
      </span>
    </div>
  );
}
