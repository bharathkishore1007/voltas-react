/**
 * TelemetryCard.jsx
 * Light-theme glassmorphism card for real-time sensor metrics
 */

const COLOR_CONFIG = {
  cyan: {
    gradient: 'from-cyan-500 to-sky-500',
    iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    bar: 'from-cyan-400 to-sky-500',
    badge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    glow: 'shadow-cyan-100',
    value: 'text-cyan-700',
  },
  green: {
    gradient: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    bar: 'from-emerald-400 to-teal-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    glow: 'shadow-emerald-100',
    value: 'text-emerald-700',
  },
  amber: {
    gradient: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
    bar: 'from-amber-400 to-orange-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    glow: 'shadow-amber-100',
    value: 'text-amber-700',
  },
  rose: {
    gradient: 'from-rose-500 to-red-500',
    iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
    bar: 'from-rose-400 to-red-500',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    glow: 'shadow-rose-100',
    value: 'text-rose-700',
  },
  purple: {
    gradient: 'from-violet-500 to-purple-500',
    iconBg: 'bg-violet-50 text-violet-600 border-violet-200',
    bar: 'from-violet-400 to-purple-500',
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
    glow: 'shadow-violet-100',
    value: 'text-violet-700',
  },
};

export default function TelemetryCard({
  title,
  value = '--',
  unit = '',
  subtext = '',
  icon: Icon,
  percentage = null,
  color = 'cyan',
  disabled = false,
}) {
  const theme = COLOR_CONFIG[color] || COLOR_CONFIG.cyan;
  const pct = percentage !== null ? Math.max(0, Math.min(100, percentage)) : null;

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md
        border border-indigo-100 p-5
        shadow-md ${theme.glow}
        transition-all duration-300
        hover:shadow-lg hover:-translate-y-0.5 hover:border-indigo-200
        ${disabled ? 'opacity-50 grayscale pointer-events-none' : ''}
      `}
    >
      {/* Decorative gradient blob */}
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${theme.gradient} opacity-10 blur-2xl`}
      />

      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
          {title}
        </span>
        {Icon && (
          <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${theme.iconBg}`}>
            <Icon size={15} strokeWidth={2} />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mt-3 flex items-baseline gap-1">
        <span className={`font-mono text-3xl font-extrabold tracking-tight ${disabled ? 'text-slate-300' : theme.value}`}>
          {value}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-slate-400">{unit}</span>
        )}
      </div>

      {/* Subtext */}
      {subtext && (
        <p className="mt-1 text-xs font-medium text-slate-400">{subtext}</p>
      )}

      {/* Progress bar */}
      {pct !== null && (
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${theme.bar} transition-all duration-700`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-[10px] text-slate-300">0%</span>
            <span className={`text-[10px] font-semibold ${theme.value} opacity-70`}>{Math.round(pct)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
