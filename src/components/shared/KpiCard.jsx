/**
 * shared/KpiCard.jsx — left-bordered metric card like Battery Monitor
 */
export default function KpiCard({ label, value, unit, sub, borderColor = '#6366f1', disabled }) {
  return (
    <div className={`card-lift rounded-xl border border-slate-200 bg-white p-5 ${disabled ? 'opacity-50' : ''}`}
      style={{ borderLeftWidth: 3, borderLeftColor: borderColor }}>
      <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="font-mono text-[28px] font-black leading-none text-slate-800">{value}</span>
        {unit && <span className="text-sm font-semibold text-slate-400">{unit}</span>}
      </div>
      {sub && <p className={`mt-2 text-[11px] font-semibold`} style={{ color: borderColor }}>{sub}</p>}
    </div>
  );
}
