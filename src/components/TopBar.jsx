/**
 * TopBar.jsx — Dashboard top header bar with breadcrumb and status chips
 */
import { useLocation } from 'react-router-dom';
import { Bell, RefreshCw } from 'lucide-react';

const PAGE_META = {
  '/':         { title: 'Overview',            sub: 'System summary and key metrics' },
  '/monitor':  { title: 'Live Monitoring',     sub: 'Real-time sensor readings' },
  '/analytics':{ title: 'Power Analytics',     sub: 'Historical trends and performance' },
  '/runtime':  { title: 'Runtime Prediction',  sub: 'Estimated remaining time at current load' },
  '/energy':   { title: 'Energy Consumption',  sub: 'Power usage and energy tracking' },
  '/relays':   { title: 'Relay Control',       sub: '4-channel ESP32 relay management' },
  '/thermal':  { title: 'Temperature',         sub: 'Chip thermal monitoring' },
  '/alerts':   { title: 'Alerts & Events',     sub: 'System notifications and event log' },
  '/settings': { title: 'Settings',            sub: 'Device configuration and thresholds' },
};

const STATUS_CHIP = {
  ONLINE:     'border-emerald-200 bg-emerald-50 text-emerald-700',
  CONNECTING: 'border-amber-200  bg-amber-50  text-amber-700',
  OFFLINE:    'border-rose-200   bg-rose-50   text-rose-700',
};

export default function TopBar({ status, lastSeen, alertCount = 0 }) {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] || PAGE_META['/'];
  const chip = STATUS_CHIP[status] || STATUS_CHIP.OFFLINE;

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6 shrink-0">
      {/* Breadcrumb */}
      <div>
        <h1 className="text-[15px] font-bold text-slate-800 leading-none">{meta.title}</h1>
        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{meta.sub}</p>
      </div>

      {/* Right side chips */}
      <div className="flex items-center gap-2.5">
        {/* Last seen */}
        {lastSeen && status === 'ONLINE' && (
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <RefreshCw size={11} className="text-slate-300" />
            {lastSeen}
          </div>
        )}

        {/* Status */}
        <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${chip}`}>
          <span className="relative flex h-1.5 w-1.5">
            {status === 'ONLINE' && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping-slow" />
            )}
            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
              status === 'ONLINE' ? 'bg-emerald-500' : status === 'CONNECTING' ? 'bg-amber-500' : 'bg-rose-500'
            }`} />
          </span>
          {status}
        </span>

        {/* ESP32 badge */}
        <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-600">
          ESP32
        </span>

        {/* Alerts bell */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
          <Bell size={16} />
          {alertCount > 0 && (
            <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white">{alertCount > 9 ? '9+' : alertCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}
