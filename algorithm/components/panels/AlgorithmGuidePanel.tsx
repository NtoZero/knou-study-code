import { useState } from 'react';
import { algorithmGuides } from '../../data/algorithm-guide';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface AlgorithmGuidePanelProps {
  algorithmId: string;
}

export function AlgorithmGuidePanel({ algorithmId }: AlgorithmGuidePanelProps) {
  const [open, setOpen] = useState(true);
  const guide = algorithmGuides[algorithmId];
  if (!guide) return null;

  return (
    <div className="bg-slate-800/50 rounded-lg p-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 w-full text-left"
      >
        {open ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">알고리즘 개요</h4>
      </button>

      {open && (
        <div className="mt-2 space-y-2.5">
          <p className="text-sm text-slate-200 leading-relaxed">{guide.concept}</p>

          <div>
            <p className="text-[11px] font-semibold text-blue-400 mb-1">핵심 절차</p>
            <ol className="space-y-0.5">
              {guide.steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-xs text-slate-300">
                  <span className="text-blue-500 font-mono shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-emerald-400 mb-1">핵심 특징</p>
            <ul className="space-y-0.5">
              {guide.keyPoints.map((point, i) => (
                <li key={i} className="flex gap-2 text-xs text-slate-400">
                  <span className="text-emerald-600 shrink-0">·</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
