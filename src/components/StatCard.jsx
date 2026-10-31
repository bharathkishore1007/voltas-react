/**
 * StatCard.jsx — compact metric tile used in the KPI strip
 */
export default function StatCard({ label, value, unit, sub, icon: Icon, color = 'indigo', trend = null }) {
  const COLORS = {
    indigo: { bg: 'bg-indigo-50 border-indigo-100', icon: 'bg-indigo-100 text-indigo-600', val: 'text-indigo-700' },
    cyan:   { bg: 'bg-cyan-50 border-cyan-100',     icon: 'bg-cyan-100 text-cyan-600',     val: 'text-cyan-700' },
    green:  { bg: 'bg-emerald-50 border-emerald-100', icon: 'bg-emerald-100 text-emerald-600', val: 'text-emerald-700' },
    amber:  { bg: 'bg-amber-50 border-amber-100',   icon: 'bg-amber-100 text-amber-600',   val: 'text-amber-700' },
    rose:   { bg: 'bg-rose-50 border-rose-100',     icon: 'bg-rose-100 text-rose-600',     val: 'text-rose-700' },
    violet: { bg: 'bg-violet-50 border-violet-100', icon: 'bg-violet-100 text-violet-600', val: 'text-violet-700' },
  };
  const c = COLORS[color] || COLORS.indigo;

  return (
    <div className={`flex items-center gap-4 rounded-2xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${c.bg}`}>
      {Icon && (
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${c.icon}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase truncate">{label}</p>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className={`font-mono text-2xl font-extrabold ${c.val}`}>{value}</span>
          {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
        </div>
        {sub && <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{sub}</p>}
      </div>
    </div>
  );
}
