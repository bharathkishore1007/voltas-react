/**
 * pages/RelayControl.jsx — 4-channel relay management
 */
import { FlipHorizontal2, Zap, Power } from 'lucide-react';
import SectionBox from '../components/shared/SectionBox';
import { RELAY_LABELS, GPIO_PINS, RELAY_CURRENTS } from '../hooks/useMqtt';

const PALETTE = [
  { on: '#6366f1', bg: '#eef2ff', badge: '#6366f1' },
  { on: '#10b981', bg: '#d1fae5', badge: '#10b981' },
  { on: '#8b5cf6', bg: '#ede9fe', badge: '#8b5cf6' },
  { on: '#f59e0b', bg: '#fef3c7', badge: '#f59e0b' },
];

function fmtTime(s) {
  if (!s) return '0s';
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
  return h ? `${h}h ${m}m` : m ? `${m}m ${sec}s` : `${sec}s`;
}

export default function RelayControl({ state, isOnline, toggleRelayManual }) {
  const v = parseFloat(state.voltage) || 12;

  return (
    <div className="space-y-5 fade-in">
      <SectionBox icon={FlipHorizontal2} title="Relay Control"
        sub="4-channel ESP32 relay management via MQTT">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {state.relays.map((on, i) => {
            const pal = PALETTE[i];
            const pw  = on ? (RELAY_CURRENTS[i] * v).toFixed(2) : '0.00';
            return (
              <div key={i} className="rounded-xl border transition-all duration-300"
                style={{ borderColor: on ? pal.on + '50' : '#e2e8f0', background: on ? pal.bg : '#fafafa' }}>
                {/* Header strip */}
                <div className="flex items-center justify-between px-4 py-3 border-b"
                  style={{ borderColor: on ? pal.on + '30' : '#f1f5f9' }}>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ background: on ? pal.on + '20' : '#f1f5f9' }}>
                      <Zap size={16} style={{ color: on ? pal.on : '#94a3b8' }} className={on ? 'animate-pulse' : ''} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-700">{RELAY_LABELS[i]}</p>
                      <p className="text-[10px] font-mono text-slate-400">GPIO {GPIO_PINS[i]}</p>
                    </div>
                  </div>
                  <span className="rounded-full px-2.5 py-0.5 text-[11px] font-black border"
                    style={{ color: on ? pal.on : '#94a3b8', borderColor: on ? pal.on + '40' : '#e2e8f0', background: on ? pal.on + '15' : '#f8fafc' }}>
                    {on ? 'ON' : 'OFF'}
                  </span>
                </div>

                {/* Stats */}
                <div className="px-4 py-3 space-y-2 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Load current</span>
                    <span className="font-mono font-semibold text-slate-700">{RELAY_CURRENTS[i]} A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active power</span>
                    <span className="font-mono font-semibold" style={{ color: on ? pal.on : '#94a3b8' }}>{pw} W</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Session ON time</span>
                    <span className="font-mono font-semibold text-slate-600">{fmtTime(state.relayOnTime[i])}</span>
                  </div>
                </div>

                {/* Toggle */}
                <div className="border-t px-4 py-3 flex items-center justify-between"
                  style={{ borderColor: on ? pal.on + '20' : '#f1f5f9' }}>
                  <span className="text-[11px] text-slate-400 font-medium">Control Switch</span>
                  <button type="button" role="switch" aria-checked={on}
                    onClick={() => toggleRelayManual(i, !on)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none`}
                    style={{ background: on ? pal.on : '#cbd5e1' }}>
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${on ? 'translate-x-5' : 'translate-x-0'}`}>
                      <Power size={10} style={{ color: on ? pal.on : '#94a3b8' }} />
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </SectionBox>

      {/* All-channel controls */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-3 flex-wrap">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bulk Control</span>
        <button disabled={false} onClick={() => [0,1,2,3].forEach(i => toggleRelayManual(i, true))}
          className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[12px] font-semibold text-indigo-600 hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          Turn All ON
        </button>
        <button disabled={false} onClick={() => [0,1,2,3].forEach(i => toggleRelayManual(i, false))}
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-[12px] font-semibold text-rose-600 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          Turn All OFF
        </button>
      </div>
    </div>
  );
}
