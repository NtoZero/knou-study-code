import { SortStep } from '../../types/sort';
import { getBarColor } from '../../utils/colors';
import { Bar } from './Bar';

interface BarChartProps {
  step: SortStep;
}

export function BarChart({ step }: BarChartProps) {
  const maxValue = Math.max(...step.array);
  const barWidth = 100 / step.array.length;

  return (
    <div className="w-full h-64 flex items-stretch gap-px p-4 bg-slate-800/50 rounded-lg">
      {step.array.map((value, index) => (
        <Bar
          key={index}
          value={value}
          maxValue={maxValue}
          color={getBarColor(index, step.highlights)}
          width={barWidth}
          index={index}
        />
      ))}
    </div>
  );
}
