/**
 * pages/Overview.jsx — System summary & key metrics
 */
import { Monitor, Power } from 'lucide-react';
import KpiCard from '../components/shared/KpiCard';
import SectionBox from '../components/shared/SectionBox';
import { calcSoC, RELAY_LABELS, RELAY_CURRENTS } from '../hooks/useMqtt';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';

function statusLabel(v, low = 10.5, warn = 11.5) {
  const n = parseFloat(v);
  if (isNaN(n)) return null;
  if (n >= warn) return { txt: '● Normal', color: '#10b981' };
  if (n >= low)  return { txt: '● Warning', color: '#f59e0b' };
  return { txt: '● Critical', color: '#ef4444' };
}

export default function Overview({ state, isOnline, toggleRelayManual }) {
  const soc   = calcSoC(state.voltage);
  const socPct = soc ?? 0;
  const v = parseFloat(state.voltage), c = parseFloat(state.current);

  const vStatus = isOnline ? statusLabel(state.voltage) : null;
  const cStatus = isOnline ? (c >= state.currentLimit ? { txt: '● High', color: '#ef4444' } : { txt: '● Normal', color: '#10b981' }) : null;

  const relayRows = state.relays.map((on, i) => ({
    name: `CH${i+1}`, power: on ? +(RELAY_CURRENTS[i] * (isNaN(v) ? 12 : v)).toFixed(2) : 0,
    color: ['#6366f1','#10b981','#8b5cf6','#f59e0b'][i],
  }));

  return (
    <div className="space-y-5 fade-in">

      {/* Offline notice */}
      {!isOnline && (
        <div className="flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <span className="font-bold">⚠ Device Offline</span>
          <span className="text-amber-600">— Connect your ESP32 to broker.emqx.io and publish to voltas/status = online</span>
        </div>
      )}

      {/* System overview panel */}
      <SectionBox icon={Monitor} title="System Overview" sub="Live battery metrics and status"
        badge={isOnline ? 'Normal' : 'Offline'} badgeColor={isOnline ? '#10b981' : '#ef4444'}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KpiCard label="Battery Voltage" value={isOnline ? state.voltage : '--'} unit="V"
            sub={vStatus?.txt} borderColor={vStatus?.color ?? '#6366f1'} />
          <KpiCard label="Battery Current" value={isOnline ? state.current : '--'} unit="A"
            sub={cStatus?.txt} borderColor={cStatus?.color ?? '#f59e0b'} />
          <KpiCard label="Battery Power" value={isOnline ? state.power : '--'} unit="W"
            sub={isOnline ? '● Normal' : null} borderColor="#10b981" />
          <KpiCard label="Temperature" value={isOnline ? state.temperature : '--'} unit="°C"
            sub={isOnline ? (parseFloat(state.temperature) > 60 ? '● Hot' : '● Normal') : null} borderColor="#06b6d4" />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KpiCard label="State of Charge" value={soc !== null ? `${Math.round(socPct)}%` : '--'}
            sub={socPct >= 50 ? '● Good' : socPct >= 20 ? '● Low' : '● Critical'}
            borderColor={socPct >= 50 ? '#10b981' : socPct >= 20 ? '#f59e0b' : '#ef4444'} />
          <KpiCard label="Remaining Runtime" value={isOnline ? state.runtime : '--'}
            sub="Estimated · varies with load" borderColor="#8b5cf6" />
          <KpiCard label="Energy Consumed" value={isOnline ? state.sessionEnergy.toFixed(1) : '--'} unit="Wh"
            sub="This session" borderColor="#06b6d4" />
          <KpiCard label="Current Limit" value={state.currentLimit} unit="A"
            sub={state.warning ? '● ALERT' : '● OK'} borderColor={state.warning ? '#ef4444' : '#6366f1'} />
        </div>
      </SectionBox>

      {/* Two column: voltage trend + relay power */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Voltage trend mini chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-3">Voltage Trend</p>
          <div className="h-40">
            {state.history.length < 2
              ? <div className="flex h-full items-center justify-center text-xs text-slate-300 animate-pulse">Waiting for data…</div>
              : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={state.history} margin={{ top: 4, right: 2, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ov-v" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                    <XAxis dataKey="t" tick={{ fontSize: 8, fill: '#cbd5e1', fontFamily: 'monospace' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis domain={[10, 14]} tick={{ fontSize: 8, fill: '#cbd5e1', fontFamily: 'monospace' }} tickLine={false} axisLine={false} width={40} tickFormatter={v => `${v}V`} />
                    <Tooltip formatter={v => [`${v?.toFixed(2)} V`, 'Voltage']} contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 11 }} />
                    <Area type="monotone" dataKey="voltage" stroke="#6366f1" strokeWidth={2} fill="url(#ov-v)" dot={false} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              )
            }
          </div>
        </div>

        {/* Relay power bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-3">Active Power per Relay</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={relayRows} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: '#94a3b8', fontFamily: 'monospace' }} tickLine={false} axisLine={false} tickFormatter={v => `${v}W`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} tickLine={false} axisLine={false} width={32} />
                <Tooltip formatter={v => [`${v.toFixed(2)} W`, 'Power']} contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 11 }} />
                <Bar dataKey="power" radius={[0, 5, 5, 0]} maxBarSize={20}>
                  {relayRows.map((r, i) => <Cell key={i} fill={state.relays[i] ? r.color : '#e2e8f0'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Relay status — interactive toggle cards */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">Relay Status</p>
          <span className="text-[10px] text-slate-400 font-medium">Click to toggle</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {state.relays.map((on, i) => {
            const COLORS = [['#6366f1','#eef2ff'],['#10b981','#d1fae5'],['#8b5cf6','#ede9fe'],['#f59e0b','#fef3c7']];
            const [c, bg] = COLORS[i];
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggleRelayManual(i, !on)}
                className="flex items-center gap-3 rounded-lg border p-3 transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-pointer w-full text-left group"
                style={{
                  borderColor: on ? c + '60' : '#e2e8f0',
                  background: on ? bg : '#f8fafc',
                  boxShadow: on ? `0 2px 10px ${c}20` : undefined,
                }}>
                {/* Status dot with pulse when ON */}
                <span className="relative flex h-3 w-3 shrink-0">
                  {on && <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping-slow" style={{ background: c }} />}
                  <span className="relative inline-flex h-3 w-3 rounded-full" style={{ background: on ? c : '#cbd5e1' }} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-slate-700 truncate">{RELAY_LABELS[i]}</p>
                  <p className="text-[10px] font-mono text-slate-400">{RELAY_CURRENTS[i]} A</p>
                </div>
                {/* Toggle switch */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] font-black" style={{ color: on ? c : '#94a3b8' }}>{on ? 'ON' : 'OFF'}</span>
                  <div className="relative h-5 w-8 rounded-full transition-colors duration-300"
                    style={{ background: on ? c : '#e2e8f0' }}>
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${on ? 'translate-x-3' : 'translate-x-0.5'}`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
