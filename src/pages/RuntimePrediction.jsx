/**
 * pages/RuntimePrediction.jsx — Scenario-based runtime calculator
 */
import { useState } from 'react';
import { Timer } from 'lucide-react';
import { calcRuntime, BATTERY_CAPACITY_AH } from '../hooks/useMqtt';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SCENARIOS = [
  { label: 'Current Load',    multiplier: 1.00, color: '#6366f1' },
  { label: 'Light Load (50%)',multiplier: 0.50, color: '#10b981' },
  { label: 'Heavy Load (150%)',multiplier: 1.50, color: '#ef4444' },
  { label: 'Bulb Only (~6A)', current: 6.0,    color: '#f59e0b' },
  { label: 'Motor Only (~3A)',current: 3.0,     color: '#8b5cf6' },
];

function hm(str) {
  if (!str || str === '--' || str === 'Idle' || str.startsWith('<') || str.startsWith('>')) return str;
  return str;
}

export default function RuntimePrediction({ state, isOnline }) {
  const [selected, setSelected] = useState(0);
  const v = state.voltage, c = parseFloat(state.current);

  const rows = SCENARIOS.map(s => {
    const effective = s.current ?? (isNaN(c) ? 0 : c * s.multiplier);
    const rt = calcRuntime(v, effective);
    return { ...s, effective, runtime: rt };
  });

  const active = rows[selected];
  const wh = (() => {
    const soc = (() => {
      const vn = parseFloat(v);
      if (isNaN(vn)) return 0;
      return Math.max(0, Math.min(1, (vn - 10.5) / (12.7 - 10.5)));
    })();
    return (BATTERY_CAPACITY_AH * soc * parseFloat(v || 12)).toFixed(1);
  })();

  const powerW = (active.effective * parseFloat(v || 12)).toFixed(1);

  return (
    <div className="space-y-5 fade-in">
      {/* Scenario selector */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">Load Scenario</p>
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((s, i) => (
            <button key={i} onClick={() => setSelected(i)}
              className={`rounded-lg px-4 py-2 text-[12px] font-semibold border transition-all
                ${selected === i ? 'text-white shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
              style={selected === i ? { background: s.color, borderColor: s.color } : {}}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active scenario stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Predicted Runtime',  value: hm(active.runtime), sub: 'Estimate — not guaranteed', color: active.color },
          { label: 'Scenario Load',      value: powerW, unit: 'W', sub: `@ ${active.effective.toFixed(1)} A`, color: '#f59e0b' },
          { label: 'Remaining Energy',   value: wh, unit: 'Wh', sub: 'Estimated from SoC', color: '#10b981' },
          { label: 'Current SoC',        value: (() => { const vn = parseFloat(v); return isNaN(vn) ? '--' : `${Math.round(Math.max(0, Math.min(100, (vn-10.5)/(12.7-10.5)*100)))}%`; })(), sub: '12V 14Ah SLA', color: '#8b5cf6' },
        ].map(({ label, value, unit, sub, color }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-4"
            style={{ borderLeftWidth: 3, borderLeftColor: color }}>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">{label}</p>
            <p className="font-mono text-2xl font-black text-slate-800" style={{ color }}>{value} {unit && <span className="text-sm font-semibold text-slate-400">{unit}</span>}</p>
            <p className="text-[10px] text-slate-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Scenario comparison bars */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-[13px] font-bold text-slate-700 mb-4">Scenario Comparison</p>
        <div className="space-y-3">
          {rows.map((r, i) => {
            const hours = (() => {
              const str = r.runtime;
              if (!str || str === 'Idle' || str === '--') return 0;
              if (str.startsWith('>')) return 99;
              if (str.startsWith('<')) return 0.08;
              const hm = str.match(/(\d+)h\s*(\d+)?m?/);
              if (hm) return parseInt(hm[1]) + (parseInt(hm[2]||0)/60);
              const m = str.match(/(\d+)\s*min/);
              if (m) return parseInt(m[1]) / 60;
              return 0;
            })();
            const maxH = 24;
            const pct = Math.min(100, (hours / maxH) * 100);
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="w-36 text-[12px] font-medium text-slate-600 shrink-0">{r.label}</span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: r.color }} />
                </div>
                <span className="w-14 text-right text-[12px] font-bold font-mono" style={{ color: r.color }}>{r.runtime}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
