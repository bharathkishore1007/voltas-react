/**
 * pages/Temperature.jsx — Chip thermal monitoring
 */
import { Thermometer } from 'lucide-react';
import SectionBox from '../components/shared/SectionBox';
import ArcGauge from '../components/shared/ArcGauge';
import MiniChart from '../components/shared/MiniChart';

export default function Temperature({ state, isOnline }) {
  const t = parseFloat(state.temperature);
  const pct = isNaN(t) ? 0 : Math.min(100, (t / 80) * 100);
  const color = t > 65 ? '#ef4444' : t > 45 ? '#f59e0b' : '#06b6d4';
  const status = t > 65 ? 'Critical — Thermal Throttling Risk' : t > 45 ? 'Warm — Normal Operation' : 'Cool — Optimal';

  return (
    <div className="space-y-5 fade-in">
      <SectionBox icon={Thermometer} title="Temperature" sub="ESP32 internal chip thermal sensor">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <ArcGauge pct={pct} value={isOnline ? state.temperature : '--'} unit="°C"
            label="Chip Temperature" color={color} size={160} sw={13} />
          <div className="flex-1 space-y-3">
            <div className="rounded-lg border p-4" style={{ borderColor: color + '30', background: color + '08' }}>
              <p className="text-[11px] font-bold tracking-wider uppercase" style={{ color }}>Status</p>
              <p className="mt-1 text-[13px] font-semibold text-slate-700">{isOnline ? status : 'Offline'}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Safe Max',   val: '80°C',  color: '#ef4444' },
                { label: 'Warn Above', val: '45°C',  color: '#f59e0b' },
                { label: 'Optimal',    val: '< 40°C',color: '#10b981' },
                { label: 'Current',    val: isOnline ? `${state.temperature}°C` : '--', color },
              ].map(({ label, val, color: c }) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
                  <p className="font-mono text-lg font-black" style={{ color: c }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionBox>
      <MiniChart title="Temperature Trend" data={state.history} dataKey="temperature" unit="°C" color={color} domain={[0, 80]} />
    </div>
  );
}
