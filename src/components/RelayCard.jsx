/**
 * RelayCard.jsx
 * Interactive relay switch card with optimistic UI feedback
 */
import { Zap, Power } from 'lucide-react';

// GPIO pins mirror the hardware: RELAY_PIN[4] = {26, 27, 14, 32}
const GPIO_PINS = [26, 27, 14, 32];
const RELAY_LABELS = ['Channel 1', 'Channel 2', 'Channel 3', 'Channel 4'];
const RELAY_CURRENTS = [1.0, 2.5, 0.5, 0.8]; // from firmware defaults

const ACCENT_COLORS = [
  { active: 'border-indigo-300 bg-gradient-to-b from-indigo-50 to-white shadow-indigo-100', dot: 'bg-indigo-500', icon: 'text-indigo-500 bg-indigo-50 border-indigo-200', toggle: 'bg-indigo-500', badge: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { active: 'border-emerald-300 bg-gradient-to-b from-emerald-50 to-white shadow-emerald-100', dot: 'bg-emerald-500', icon: 'text-emerald-500 bg-emerald-50 border-emerald-200', toggle: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { active: 'border-violet-300 bg-gradient-to-b from-violet-50 to-white shadow-violet-100', dot: 'bg-violet-500', icon: 'text-violet-500 bg-violet-50 border-violet-200', toggle: 'bg-violet-500', badge: 'bg-violet-100 text-violet-700 border-violet-200' },
  { active: 'border-amber-300 bg-gradient-to-b from-amber-50 to-white shadow-amber-100', dot: 'bg-amber-500', icon: 'text-amber-500 bg-amber-50 border-amber-200', toggle: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
];

export default function RelayCard({ index, state = false, disabled = false, onToggle }) {
  const color = ACCENT_COLORS[index % ACCENT_COLORS.length];

  function handleClick() {
    if (!disabled) onToggle(index, !state);
  }

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-5 border
        shadow-md transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-lg
        ${state
          ? `${color.active} shadow-lg`
          : 'border-slate-200 bg-white/70 backdrop-blur-md shadow-slate-100 hover:border-slate-300'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
      `}
      onClick={handleClick}
    >
      {/* Decorative blob when ON */}
      {state && (
        <div className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full ${color.dot} opacity-10 blur-2xl`} />
      )}

      {/* Top: icon + label + GPIO */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${state ? color.icon : 'border-slate-200 bg-slate-50 text-slate-400'}`}>
            <Zap size={18} strokeWidth={2} className={state ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-700">{RELAY_LABELS[index]}</h4>
          </div>
        </div>

        {/* ON / OFF badge */}
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-widest uppercase border transition-all ${
          state
            ? `${color.badge} shadow-sm`
            : 'bg-slate-100 text-slate-400 border-slate-200'
        }`}>
          {state ? 'ON' : 'OFF'}
        </span>
      </div>

      {/* Divider + toggle row */}
      <div className={`mt-4 flex items-center justify-between border-t pt-4 ${state ? 'border-slate-200/80' : 'border-slate-100'}`}>
        <span className="text-xs font-medium text-slate-400">Control Switch</span>

        {/* Toggle switch */}
        <button
          type="button"
          role="switch"
          aria-checked={state}
          onClick={(e) => { e.stopPropagation(); handleClick(); }}
          className={`
            relative inline-flex h-7 w-12 shrink-0 rounded-full border-2 border-transparent
            transition-colors duration-300 focus:outline-none
            focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2
            ${state ? color.toggle + ' shadow-md' : 'bg-slate-200'}
          `}
        >
          <span className="sr-only">Toggle {RELAY_LABELS[index]}</span>
          <span
            className={`
              pointer-events-none inline-flex h-6 w-6 items-center justify-center
              rounded-full bg-white shadow-md ring-0
              transition-transform duration-300
              ${state ? 'translate-x-5' : 'translate-x-0'}
            `}
          >
            <Power size={11} className={state ? 'text-slate-600' : 'text-slate-300'} />
          </span>
        </button>
      </div>
    </div>
  );
}
