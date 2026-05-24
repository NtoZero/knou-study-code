import { AlgorithmMeta } from '../../types/sort';

interface InfoPanelProps {
  meta: AlgorithmMeta;
}

export function InfoPanel({ meta }: InfoPanelProps) {
  return (
    <div className="rounded-2xl border border-cyan-300/20 bg-[#081827] p-3">
      <h4 className="mb-2 text-xs font-black uppercase tracking-wider text-cyan-200">알고리즘 정보</h4>
      <h3 className="text-base font-black text-white">{meta.name} <span className="text-xs font-normal text-cyan-200">{meta.nameEn}</span></h3>
      <p className="mt-1 text-xs leading-5 text-slate-200">{meta.description}</p>

      <div className="mt-3 space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-300">시간복잡도 (최선)</span>
          <span className="font-mono font-bold text-emerald-200">{meta.timeComplexity.best}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">시간복잡도 (평균)</span>
          <span className="font-mono font-bold text-amber-200">{meta.timeComplexity.average}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">시간복잡도 (최악)</span>
          <span className="font-mono font-bold text-rose-200">{meta.timeComplexity.worst}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">공간복잡도</span>
          <span className="font-mono font-bold text-cyan-200">{meta.spaceComplexity}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">안정 정렬</span>
          <span className={meta.stable ? 'font-bold text-emerald-200' : 'font-bold text-rose-200'}>
            {meta.stable ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">강의</span>
          <span className="font-bold text-white">{meta.group}</span>
        </div>
      </div>
    </div>
  );
}
