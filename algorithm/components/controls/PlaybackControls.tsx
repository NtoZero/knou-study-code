import {
  Play, Pause, SkipBack, SkipForward,
  RotateCcw, ChevronFirst, ChevronLast,
} from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  isAtStart: boolean;
  isAtEnd: boolean;
  speed: number;
  currentIndex: number;
  totalSteps: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSetSpeed: (speed: number) => void;
  onGoTo: (index: number) => void;
}

const speeds = [
  { label: '0.25x', value: 1200 },
  { label: '0.5x', value: 600 },
  { label: '1x', value: 300 },
  { label: '2x', value: 150 },
  { label: '4x', value: 75 },
];

export function PlaybackControls({
  isPlaying, isAtStart, isAtEnd, speed,
  currentIndex, totalSteps,
  onPlay, onPause, onStepForward, onStepBackward,
  onReset, onSetSpeed, onGoTo,
}: PlaybackControlsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center gap-2">
        <button onClick={onReset} disabled={isAtStart} className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 text-slate-300">
          <RotateCcw size={16} />
        </button>
        <button onClick={() => onGoTo(0)} disabled={isAtStart} className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 text-slate-300">
          <ChevronFirst size={16} />
        </button>
        <button onClick={onStepBackward} disabled={isAtStart} className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 text-slate-300">
          <SkipBack size={16} />
        </button>
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={isAtEnd && !isPlaying}
          className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button onClick={onStepForward} disabled={isAtEnd} className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 text-slate-300">
          <SkipForward size={16} />
        </button>
        <button onClick={() => onGoTo(totalSteps - 1)} disabled={isAtEnd} className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 text-slate-300">
          <ChevronLast size={16} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 w-12 text-right">{currentIndex}</span>
        <input
          type="range"
          min={0}
          max={Math.max(totalSteps - 1, 0)}
          value={currentIndex}
          onChange={(e) => onGoTo(Number(e.target.value))}
          className="flex-1 h-1 accent-blue-500"
        />
        <span className="text-xs text-slate-500 w-12">{totalSteps - 1}</span>
      </div>

      {/* Speed control */}
      <div className="flex items-center justify-center gap-1">
        {speeds.map(s => (
          <button
            key={s.value}
            onClick={() => onSetSpeed(s.value)}
            className={`px-2 py-0.5 text-xs rounded ${
              speed === s.value ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
