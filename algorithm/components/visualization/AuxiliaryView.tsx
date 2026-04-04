import { AuxiliaryData } from '../../types/sort';
import { BinarySearchTree } from './BinarySearchTree';
import { BalancedTreeView } from './BalancedTreeView';
import { HashTableView } from './HashTableView';
import { GraphView } from './GraphView';
import { DistanceMatrix } from './DistanceMatrix';

interface AuxiliaryViewProps {
  data: AuxiliaryData;
}

export function AuxiliaryView({ data }: AuxiliaryViewProps) {
  if (data.kind === 'counting') {
    const phaseLabel = data.phase === 'count' ? '빈도 수' : data.phase === 'cumulative' ? '누적합' : '배치';
    return (
      <div className="bg-slate-800/50 rounded-lg p-3">
        <p className="text-xs text-slate-400 mb-2">COUNT 배열 ({phaseLabel})</p>
        <div className="flex gap-1 flex-wrap">
          {data.counts.map((c, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className="w-6 rounded-t-sm bg-amber-500/80 flex items-end justify-center"
                style={{ height: Math.max(4, c * 12) }}
              >
                <span className="text-[9px] text-white">{c}</span>
              </div>
              <span className="text-[9px] text-slate-500">{i}</span>
            </div>
          ))}
        </div>
        {data.phase === 'place' && data.outputArray.some(v => v > 0) && (
          <div className="mt-2">
            <p className="text-xs text-slate-400 mb-1">출력 배열</p>
            <div className="flex gap-1">
              {data.outputArray.map((v, i) => (
                <div key={i} className="w-6 h-6 bg-emerald-600/60 rounded text-[10px] flex items-center justify-center text-white">
                  {v || ''}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (data.kind === 'radix') {
    return (
      <div className="bg-slate-800/50 rounded-lg p-3">
        <p className="text-xs text-slate-400 mb-2">버킷 (자릿수: {data.currentDigit + 1})</p>
        <div className="grid grid-cols-5 gap-1">
          {data.buckets.map((bucket, i) => (
            <div key={i} className="bg-slate-700/50 rounded p-1">
              <span className="text-[9px] text-violet-400 font-mono">{i}:</span>
              <div className="flex flex-wrap gap-0.5 mt-0.5">
                {bucket.map((v, j) => (
                  <span key={j} className="text-[10px] bg-violet-600/40 rounded px-1 text-white">{v}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.kind === 'bucket') {
    return (
      <div className="bg-slate-800/50 rounded-lg p-3">
        <p className="text-xs text-slate-400 mb-2">버킷</p>
        <div className="space-y-1">
          {data.buckets.map((bucket, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-[10px] text-blue-400 w-4 font-mono">{i}</span>
              <div className="flex gap-0.5 flex-1 bg-slate-700/30 rounded px-1 py-0.5 min-h-[20px]">
                {bucket.map((v, j) => (
                  <span key={j} className="text-[10px] bg-blue-600/40 rounded px-1 text-white">{v}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.kind === 'bst') {
    return <BinarySearchTree data={data} />;
  }

  if (data.kind === 'balanced-tree') {
    return <BalancedTreeView data={data} />;
  }

  if (data.kind === 'hash-table') {
    return <HashTableView data={data} />;
  }

  if (data.kind === 'graph') {
    return (
      <>
        <GraphView data={data} />
        {data.distMatrix && <DistanceMatrix data={data} />}
      </>
    );
  }

  return null;
}
