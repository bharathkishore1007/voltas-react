/**
 * BatteryWidget.jsx
 * Visual 12V 14Ah battery state-of-charge indicator
 */
import { Battery, BatteryCharging, BatteryWarning } from 'lucide-react';
import { BATTERY_CUTOFF_V, BATTERY_FULL_V } from '../hooks/useMqtt';

function getSoC(voltage) {
  const v = parseFloat(voltage);
  if (isNaN(v)) return null;
  return Math.max(0, Math.min(100, ((v - BATTERY_CUTOFF_V) / (BATTERY_FULL_V - BATTERY_CUTOFF_V)) * 100));
}

function getSoCColor(soc) {
  if (soc >= 60) return { bar: 'from-emerald-400 to-teal-500', text: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
  if (soc >= 30) return { bar: 'from-amber-400 to-yellow-500', text: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
  return { bar: 'from-rose-400 to-red-500', text: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' };
}

export default function BatteryWidget({ voltage, current, runtime, disabled }) {
  const soc = getSoC(voltage);
  const colors = soc !== null ? getSoCColor(soc) : { bar: 'from-slate-300 to-slate-400', text: 'text-slate-400', bg: 'bg-slate-50 border-slate-200' };

  const isLoading = current === '--' || voltage === '--';
  const isIdle = !isLoading && parseFloat(current) <= 0.05;

  const Icon = soc !== null && soc < 20 ? BatteryWarning : isIdle ? Battery : BatteryCharging;

  return (
    <div className={`
      relative overflow-hidden rounded-2xl border p-5 bg-white/80 backdrop-blur-md
      shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg
      ${disabled ? 'opacity-50 grayscale' : colors.bg}
    `}>
      {/* Decorative blob */}
      <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${colors.bar} opacity-10 blur-2xl`} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">Battery</span>
        <Icon size={16} className={disabled ? 'text-slate-300' : colors.text} strokeWidth={2} />
      </div>

      {/* SoC */}
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className={`font-mono text-3xl font-extrabold tracking-tight ${disabled ? 'text-slate-300' : colors.text}`}>
          {soc !== null ? `${Math.round(soc)}` : '--'}
        </span>
        <span className="text-sm font-semibold text-slate-400">%</span>
      </div>
      <p className="mt-1 text-xs text-slate-400 font-medium">
        {voltage !== '--' ? `${voltage} V · 12V 14Ah` : 'Offline'}
      </p>

      {/* Bar */}
      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${colors.bar} transition-all duration-700`}
            style={{ width: `${soc ?? 0}%` }}
          />
        </div>
      </div>

      {/* Runtime */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Est. Runtime</span>
        <span className={`font-mono text-xs font-bold ${disabled ? 'text-slate-300' : colors.text}`}>
          {runtime !== '--' ? runtime : '—'}
        </span>
      </div>
    </div>
  );
}
