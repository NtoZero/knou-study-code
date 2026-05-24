import { useState } from 'react';
import { SortStep, HighlightType } from '../../types/sort';
import { highlightColors, highlightLabels } from '../../utils/colors';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface VariablesPanelProps {
  step: SortStep;
}

function TreeNode({ label, defaultOpen = true, children }: { label: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-xs text-cyan-100 hover:text-white w-full py-0.5"
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <span className="font-semibold">{label}</span>
      </button>
      {open && <div className="ml-4">{children}</div>}
    </div>
  );
}

function VarLine({ name, value, color }: { name: string; value: React.ReactNode; color?: string }) {
  return (
    <div className="flex items-center gap-1.5 py-px text-xs font-mono">
      <span className="text-cyan-200/80">{name}:</span>
      <span className={color || 'text-slate-100'}>{value}</span>
    </div>
  );
}

export function VariablesPanel({ step }: VariablesPanelProps) {
  const highlightMap = new Map<number, HighlightType>();
  step.highlights.forEach(h => highlightMap.set(h.index, h.type));

  return (
    <div className="overflow-y-auto rounded-2xl border border-cyan-300/20 bg-[#081827] p-3">
      <h4 className="mb-2 text-xs font-black uppercase tracking-wider text-cyan-200">Variables</h4>

      <div className="space-y-1">
        <TreeNode label="array">
          <div className="flex flex-wrap gap-1 py-1">
            {step.array.map((v, i) => {
              const ht = highlightMap.get(i);
              return (
                <div
                  key={i}
                  className="flex flex-col items-center"
                >
                  <span
                    className="w-7 h-6 rounded-md text-[10px] flex items-center justify-center text-slate-950 font-black font-mono ring-1 ring-white/25"
                    style={{ backgroundColor: ht ? highlightColors[ht] : '#38bdf8' }}
                  >
                    {v}
                  </span>
                  <span className="text-[9px] font-bold text-cyan-200/70">{i}</span>
                </div>
              );
            })}
          </div>
        </TreeNode>

        <TreeNode label="highlights">
          {step.highlights.length === 0 ? (
            <span className="text-xs text-slate-400 italic">none</span>
          ) : (
            <div className="flex flex-wrap gap-1 py-0.5">
              {step.highlights.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-950"
                  style={{ backgroundColor: highlightColors[h.type] }}
                >
                  [{h.index}] {highlightLabels[h.type]}
                </span>
              ))}
            </div>
          )}
        </TreeNode>

        <TreeNode label="stats">
          <VarLine name="comparisons" value={step.stats.comparisons} color="text-amber-200" />
          <VarLine name="swaps" value={step.stats.swaps} color="text-rose-200" />
        </TreeNode>

        <VarLine name="codeLine" value={step.codeLine} color="text-cyan-200" />

        {step.auxiliaryData && (
          <TreeNode label="auxiliaryData" defaultOpen={false}>
            <VarLine name="kind" value={step.auxiliaryData.kind} color="text-fuchsia-200" />
            {step.auxiliaryData.kind === 'heap' && (
              <VarLine name="heapSize" value={step.auxiliaryData.heapSize} color="text-cyan-200" />
            )}
            {step.auxiliaryData.kind === 'counting' && (
              <>
                <VarLine name="phase" value={step.auxiliaryData.phase} color="text-cyan-200" />
                <VarLine name="counts" value={`[${step.auxiliaryData.counts.join(', ')}]`} />
              </>
            )}
            {step.auxiliaryData.kind === 'radix' && (
              <VarLine name="currentDigit" value={step.auxiliaryData.currentDigit} color="text-cyan-200" />
            )}
            {step.auxiliaryData.kind === 'bucket' && (
              <VarLine name="buckets" value={`${step.auxiliaryData.buckets.length} buckets`} />
            )}
          </TreeNode>
        )}
      </div>
    </div>
  );
}
