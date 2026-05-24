import { SortStep } from '../../types/sort';

interface ExplanationPanelProps {
  step: SortStep;
}

export function ExplanationPanel({ step }: ExplanationPanelProps) {
  return (
    <div className="rounded-2xl border border-emerald-300/25 bg-[#06251f] p-4 shadow-[0_14px_40px_rgba(16,185,129,0.10)]">
      <h4 className="mb-2 text-xs font-black uppercase tracking-wider text-emerald-200">현재 단계</h4>
      <p className="text-sm font-medium leading-relaxed text-emerald-50">{step.explanation}</p>
    </div>
  );
}
