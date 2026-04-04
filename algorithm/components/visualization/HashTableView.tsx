import { HashTableAux } from '../../types/sort';

interface HashTableViewProps {
  data: HashTableAux;
}

export function HashTableView({ data }: HashTableViewProps) {
  const { table, chains, probeSequence, hashType, tombstones } = data;
  const isOpen = hashType === 'open';
  const subtitle = isOpen ? '(개방 해싱)' : '(폐쇄 해싱)';
  const probeSet = new Set(probeSequence ?? []);

  return (
    <div className="bg-slate-800/50 rounded-lg p-3">
      <p className="text-xs text-slate-400 mb-2 px-1">
        해시 테이블 <span className="text-slate-500">{subtitle}</span>
      </p>

      {isOpen ? (
        /* Open hashing (chaining) */
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {(chains ?? []).map((chain, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <span className="text-[10px] text-slate-500 w-5 text-right shrink-0">
                {idx}
              </span>
              <div className="w-8 h-6 flex items-center justify-center rounded text-[10px] text-slate-300 bg-slate-700 shrink-0">
                {idx}
              </div>
              {chain.length > 0 && (
                <span className="text-slate-500 text-[10px] shrink-0">&rarr;</span>
              )}
              {chain.map((val, ci) => (
                <div key={ci} className="flex items-center gap-1">
                  <div className="h-6 px-2 flex items-center justify-center rounded text-[10px] text-white font-medium bg-blue-600/60">
                    {val}
                  </div>
                  {ci < chain.length - 1 && (
                    <span className="text-slate-500 text-[10px]">&rarr;</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        /* Closed hashing (probing) */
        <div className="space-y-0.5 max-h-64 overflow-y-auto">
          {table.map((val, idx) => {
            const isTombstone = tombstones?.[idx] ?? false;
            const isProbed = probeSet.has(idx);
            const isEmpty = val === null && !isTombstone;

            let bgClass: string;
            if (isTombstone) {
              bgClass = 'bg-red-900/40';
            } else if (isProbed) {
              bgClass = 'bg-amber-500/60';
            } else if (isEmpty) {
              bgClass = 'bg-slate-700/30';
            } else {
              bgClass = 'bg-blue-600/60';
            }

            return (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500 w-5 text-right shrink-0">
                  {idx}
                </span>
                <div
                  className={`h-6 flex-1 flex items-center justify-center rounded text-[11px] font-medium ${bgClass}`}
                >
                  {isTombstone ? (
                    <span className="text-red-400">&times;</span>
                  ) : val !== null ? (
                    <span className="text-white">{val}</span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
