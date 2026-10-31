/**
 * Header.jsx
 * Dashboard Top Navigation & Status Bar
 */
import { Activity, Wifi, WifiOff, Loader2 } from 'lucide-react';

const STATUS_CONFIG = {
  ONLINE: {
    dot: 'bg-emerald-500',
    ping: 'bg-emerald-400',
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    icon: Wifi,
    label: 'Online',
  },
  CONNECTING: {
    dot: 'bg-amber-500',
    ping: 'bg-amber-400',
    badge: 'border-amber-200 bg-amber-50 text-amber-700',
    icon: Loader2,
    label: 'Connecting',
  },
  OFFLINE: {
    dot: 'bg-rose-500',
    ping: null,
    badge: 'border-rose-200 bg-rose-50 text-rose-700',
    icon: WifiOff,
    label: 'Offline',
  },
};

export default function Header({ status, lastSeen }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.OFFLINE;
  const StatusIcon = cfg.icon;

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-indigo-100/80 shadow-sm shadow-indigo-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-lg shadow-indigo-200">
            <Activity size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-indigo-900 sm:text-lg">
                VOLTAS IoT
              </h1>
              <span className="hidden sm:inline rounded-md bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 border border-indigo-200">
                ESP32
              </span>
            </div>
            <p className="hidden text-[11px] text-slate-400 font-medium sm:block">
              4-Channel Relay · 12V 14Ah Power Dashboard
            </p>
          </div>
        </div>

        {/* Status badge */}
        <div className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all ${cfg.badge}`}>
          {/* Animated dot */}
          <span className="relative flex h-2 w-2">
            {cfg.ping && (
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${cfg.ping} opacity-60`} />
            )}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${cfg.dot}`} />
          </span>

          <StatusIcon
            size={13}
            strokeWidth={2.5}
            className={status === 'CONNECTING' ? 'animate-spin' : ''}
          />
          <span>{cfg.label}</span>

          {lastSeen && status === 'ONLINE' && (
            <span className="hidden sm:inline border-l border-slate-200 pl-2 text-[10px] text-slate-400 font-normal">
              {lastSeen}
            </span>
          )}
        </div>

      </div>
    </header>
  );
}
