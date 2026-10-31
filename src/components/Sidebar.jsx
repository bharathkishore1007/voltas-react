/**
 * Sidebar.jsx — Collapsible left navigation for NEURAVOLT
 */
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Activity, BarChart3, Timer, Zap, FlipHorizontal2,
  Bell, Settings, ChevronLeft, ChevronRight, Cpu, Thermometer,
} from 'lucide-react';

const NAV = [
  {
    group: 'DASHBOARD',
    items: [
      { to: '/',         icon: LayoutDashboard, label: 'Overview' },
      { to: '/monitor',  icon: Activity,        label: 'Live Monitoring' },
    ],
  },
  {
    group: 'ANALYTICS',
    items: [
      { to: '/analytics',  icon: BarChart3,        label: 'Power Analytics' },
      { to: '/runtime',    icon: Timer,             label: 'Runtime Prediction' },
      { to: '/energy',     icon: Zap,               label: 'Energy Consumption' },
    ],
  },
  {
    group: 'CONTROL',
    items: [
      { to: '/relays',  icon: FlipHorizontal2, label: 'Relay Control' },
      { to: '/thermal', icon: Thermometer,     label: 'Temperature' },
    ],
  },
  {
    group: 'SYSTEM',
    items: [
      { to: '/alerts',   icon: Bell,     label: 'Alerts & Events' },
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle, status }) {
  const activeDot = status === 'ONLINE' ? 'bg-emerald-500' : status === 'CONNECTING' ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <aside className={`
      relative flex flex-col border-r border-slate-200 bg-white
      transition-all duration-300 ease-in-out shrink-0
      ${collapsed ? 'w-[60px]' : 'w-[220px]'}
    `}>

      {/* Brand */}
      <div className={`flex h-14 items-center border-b border-slate-100 px-3 gap-2.5 overflow-hidden`}>
        {/* Logo mark */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-200">
          <Cpu size={16} className="text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="min-w-0 leading-none">
            <p className="text-[13px] font-black tracking-[0.12em] text-indigo-700">NEURAVOLT</p>
            <p className="text-[9px] font-semibold text-slate-400 tracking-widest mt-0.5">ESP32 · IoT</p>
          </div>
        )}
      </div>

      {/* Status dot */}
      {!collapsed && (
        <div className="mx-3 my-2 flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5">
          <span className="relative flex h-2 w-2 shrink-0">
            {status === 'ONLINE' && <span className={`absolute inline-flex h-full w-full rounded-full ${activeDot} opacity-60 animate-ping-slow`} />}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${activeDot}`} />
          </span>
          <span className="text-[11px] font-semibold text-slate-500 truncate">{status}</span>
        </div>
      )}

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        {NAV.map(({ group, items }) => (
          <div key={group} className="mb-1">
            {!collapsed && (
              <p className="px-3 py-1.5 text-[9px] font-bold tracking-[0.15em] text-slate-400 uppercase">{group}</p>
            )}
            {items.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `
                  relative flex items-center gap-3 px-3 py-2.5 mx-1.5 rounded-lg text-sm font-medium
                  transition-colors duration-150 group overflow-hidden
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-700 nav-active'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }
                `}
                title={collapsed ? label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={17} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                    {!collapsed && (
                      <span className="truncate text-[13px]">{label}</span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
      >
        {collapsed
          ? <ChevronRight size={12} className="text-slate-400" />
          : <ChevronLeft  size={12} className="text-slate-400" />
        }
      </button>

      {/* Bottom collapse label */}
      {!collapsed && (
        <button
          onClick={onToggle}
          className="flex items-center gap-2 border-t border-slate-100 px-3 py-3 text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ChevronLeft size={14} />
          <span>Collapse</span>
        </button>
      )}
    </aside>
  );
}
