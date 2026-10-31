/**
 * pages/Alerts.jsx — System notifications and event log
 */
import { Bell, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

const ICONS = { warn: AlertTriangle, info: Info, ok: CheckCircle };
const COLORS = { warn: { bg: 'bg-amber-50 border-amber-200', icon: 'text-amber-500', text: 'text-amber-800' },
                 info: { bg: 'bg-blue-50 border-blue-200',   icon: 'text-blue-500',   text: 'text-blue-800'  },
                 ok:   { bg: 'bg-emerald-50 border-emerald-200', icon: 'text-emerald-500', text: 'text-emerald-800' } };

export default function Alerts({ state }) {
  const alerts = [
    ...(state.warning ? [{ id: 0, time: state.lastSeen, msg: `Overcurrent: ${state.current} A ≥ ${state.currentLimit} A`, level: 'warn' }] : []),
    ...state.alerts,
    { id: -1, time: '--', msg: 'NEURAVOLT dashboard connected to MQTT broker.', level: 'info' },
    { id: -2, time: '--', msg: 'Subscribed to all voltas/* topics successfully.', level: 'ok' },
  ].slice(0, 20);

  return (
    <div className="space-y-4 fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-slate-400" />
          <h2 className="text-[13px] font-bold text-slate-700">Alerts & Events</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-500">{alerts.length} events</span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {alerts.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-sm text-slate-300">No events recorded</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {alerts.map((a) => {
              const c = COLORS[a.level] || COLORS.info;
              const Icon = ICONS[a.level] || Info;
              return (
                <div key={a.id} className={`flex items-start gap-3 px-5 py-4`}>
                  <Icon size={16} className={`shrink-0 mt-0.5 ${c.icon}`} strokeWidth={2} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] font-semibold ${c.text}`}>{a.msg}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{a.time || 'Session start'}</p>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${c.bg} ${c.text}`}>{a.level}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
