import { SortStep } from '../../types/sort';

interface ExplanationPanelProps {
  step: SortStep;
}

export function ExplanationPanel({ step }: ExplanationPanelProps) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3">
      <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">현재 단계</h4>
      <p className="text-sm text-slate-200 leading-relaxed">{step.explanation}</p>
    </div>
  );
}
