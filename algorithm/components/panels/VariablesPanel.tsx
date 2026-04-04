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
        className="flex items-center gap-1 text-xs text-slate-300 hover:text-slate-100 w-full py-0.5"
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
      <span className="text-slate-500">{name}:</span>
      <span className={color || 'text-slate-200'}>{value}</span>
    </div>
  );
}

export function VariablesPanel({ step }: VariablesPanelProps) {
  const highlightMap = new Map<number, HighlightType>();
  step.highlights.forEach(h => highlightMap.set(h.index, h.type));

  return (
    <div className="bg-slate-800/50 rounded-lg p-3 overflow-y-auto">
      <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Variables</h4>

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
                    className="w-7 h-6 rounded text-[10px] flex items-center justify-center text-white font-mono"
                    style={{ backgroundColor: ht ? highlightColors[ht] : '#374151' }}
                  >
                    {v}
                  </span>
                  <span className="text-[9px] text-slate-600">{i}</span>
                </div>
              );
            })}
          </div>
        </TreeNode>

        <TreeNode label="highlights">
          {step.highlights.length === 0 ? (
            <span className="text-xs text-slate-600 italic">none</span>
          ) : (
            <div className="flex flex-wrap gap-1 py-0.5">
              {step.highlights.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[10px] rounded px-1.5 py-0.5 text-white"
                  style={{ backgroundColor: highlightColors[h.type] + '80' }}
                >
                  [{h.index}] {highlightLabels[h.type]}
                </span>
              ))}
            </div>
          )}
        </TreeNode>

        <TreeNode label="stats">
          <VarLine name="comparisons" value={step.stats.comparisons} color="text-amber-400" />
          <VarLine name="swaps" value={step.stats.swaps} color="text-red-400" />
        </TreeNode>

        <VarLine name="codeLine" value={step.codeLine} color="text-blue-400" />

        {step.auxiliaryData && (
          <TreeNode label="auxiliaryData" defaultOpen={false}>
            <VarLine name="kind" value={step.auxiliaryData.kind} color="text-violet-400" />
            {step.auxiliaryData.kind === 'heap' && (
              <VarLine name="heapSize" value={step.auxiliaryData.heapSize} color="text-cyan-400" />
            )}
            {step.auxiliaryData.kind === 'counting' && (
              <>
                <VarLine name="phase" value={step.auxiliaryData.phase} color="text-cyan-400" />
                <VarLine name="counts" value={`[${step.auxiliaryData.counts.join(', ')}]`} />
              </>
            )}
            {step.auxiliaryData.kind === 'radix' && (
              <VarLine name="currentDigit" value={step.auxiliaryData.currentDigit} color="text-cyan-400" />
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
