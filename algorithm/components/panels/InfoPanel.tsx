import { AlgorithmMeta } from '../../types/sort';

interface InfoPanelProps {
  meta: AlgorithmMeta;
}

export function InfoPanel({ meta }: InfoPanelProps) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3">
      <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">알고리즘 정보</h4>
      <h3 className="text-base font-bold text-slate-200">{meta.name} <span className="text-xs text-slate-500 font-normal">{meta.nameEn}</span></h3>
      <p className="text-xs text-slate-400 mt-1">{meta.description}</p>

      <div className="mt-3 space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-500">시간복잡도 (최선)</span>
          <span className="text-emerald-400 font-mono">{meta.timeComplexity.best}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">시간복잡도 (평균)</span>
          <span className="text-amber-400 font-mono">{meta.timeComplexity.average}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">시간복잡도 (최악)</span>
          <span className="text-red-400 font-mono">{meta.timeComplexity.worst}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">공간복잡도</span>
          <span className="text-blue-400 font-mono">{meta.spaceComplexity}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">안정 정렬</span>
          <span className={meta.stable ? 'text-emerald-400' : 'text-red-400'}>
            {meta.stable ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">강의</span>
          <span className="text-slate-300">{meta.group}</span>
        </div>
      </div>
    </div>
  );
}
