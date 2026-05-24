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
    <div className="rounded-2xl border border-cyan-300/20 bg-[#082033] p-4 shadow-[0_14px_40px_rgba(8,145,178,0.12)]">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 w-full text-left"
      >
        {open ? <ChevronDown size={14} className="text-cyan-200" /> : <ChevronRight size={14} className="text-cyan-200" />}
        <h4 className="text-xs font-black uppercase tracking-wider text-cyan-200">알고리즘 개요</h4>
      </button>

      {open && (
        <div className="mt-2 space-y-2.5">
          <p className="text-sm text-slate-50 leading-relaxed">{guide.concept}</p>

          <div>
            <p className="mb-1 text-[11px] font-black text-yellow-200">핵심 절차</p>
            <ol className="space-y-0.5">
              {guide.steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-xs text-slate-100">
                  <span className="text-yellow-300 font-mono shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p className="mb-1 text-[11px] font-black text-emerald-200">핵심 특징</p>
            <ul className="space-y-0.5">
              {guide.keyPoints.map((point, i) => (
                <li key={i} className="flex gap-2 text-xs text-slate-100">
                  <span className="text-emerald-300 shrink-0">·</span>
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
