import { useEffect } from 'react';
import { useSortPlayer } from '../../hooks/useSortPlayer';
import { algorithms } from '../../algorithms';
import { BarChart } from './BarChart';
import { PlaybackControls } from '../controls/PlaybackControls';
import { PseudocodePanel } from '../panels/PseudocodePanel';
import { StatsPanel } from '../panels/StatsPanel';

interface ComparisonModeProps {
  algorithmIds: [string, string];
  array: number[];
}

export function ComparisonMode({ algorithmIds, array }: ComparisonModeProps) {
  const player1 = useSortPlayer();
  const player2 = useSortPlayer();

  useEffect(() => {
    const alg1 = algorithms[algorithmIds[0]];
    const alg2 = algorithms[algorithmIds[1]];
    if (alg1 && alg2) {
      player1.load(alg1.generator, array, algorithmIds[0]);
      player2.load(alg2.generator, array, algorithmIds[1]);
    }
  }, [algorithmIds, array]);

  const alg1 = algorithms[algorithmIds[0]];
  const alg2 = algorithms[algorithmIds[1]];

  if (!player1.currentStep || !player2.currentStep) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {[
        { player: player1, alg: alg1, id: algorithmIds[0] },
        { player: player2, alg: alg2, id: algorithmIds[1] },
      ].map(({ player, alg, id }) => (
        <div key={id} className="space-y-3">
          <h3 className="text-lg font-semibold text-center text-slate-200">{alg.meta.name}</h3>
          <BarChart step={player.currentStep!} />
          <PlaybackControls
            isPlaying={player.state.isPlaying}
            isAtStart={player.isAtStart}
            isAtEnd={player.isAtEnd}
            speed={player.state.speed}
            currentIndex={player.state.currentIndex}
            totalSteps={player.totalSteps}
            onPlay={player.play}
            onPause={player.pause}
            onStepForward={player.stepForward}
            onStepBackward={player.stepBackward}
            onReset={player.reset}
            onSetSpeed={player.setSpeed}
            onGoTo={player.goTo}
          />
          <StatsPanel step={player.currentStep!} />
          <PseudocodePanel pseudocode={alg.pseudocode} currentLine={player.currentStep!.codeLine} />
        </div>
      ))}
    </div>
  );
}
