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
        className="relative rounded-t-md shadow-[0_0_18px_rgba(56,189,248,0.28)] ring-1 ring-white/25"
        style={{ backgroundColor: color, width: '82%' }}
        animate={{ height: `${heightPercent}%` }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />
      <span className="mt-1 select-none rounded bg-slate-950/70 px-1.5 py-0.5 text-[11px] font-bold text-cyan-100">
        {value}
      </span>
    </div>
  );
}
