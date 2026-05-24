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
    <div className="w-full h-72 flex items-stretch gap-1 rounded-2xl border border-cyan-300/25 bg-[#071827] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),0_18px_50px_rgba(8,145,178,0.14)]">
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
