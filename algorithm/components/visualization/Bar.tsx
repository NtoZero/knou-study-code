import { motion } from 'framer-motion';

interface BarProps {
  value: number;
  maxValue: number;
  color: string;
  width: number;
  index: number;
}

export function Bar({ value, maxValue, color, width, index }: BarProps) {
  const heightPercent = (value / maxValue) * 100;

  return (
    <div
      className="flex flex-col items-center justify-end h-full"
      style={{ width: `${width}%` }}
    >
      <motion.div
        className="rounded-t-sm relative"
        style={{ backgroundColor: color, width: '80%' }}
        animate={{ height: `${heightPercent}%` }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />
      <span className="text-[10px] text-slate-400 mt-1 select-none">
        {value}
      </span>
    </div>
  );
}
