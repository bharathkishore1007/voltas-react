/**
 * pages/LiveMonitor.jsx — Real-time gauges + readings table
 */
import { Activity } from 'lucide-react';
import SectionBox from '../components/shared/SectionBox';
import ArcGauge from '../components/shared/ArcGauge';
import { calcSoC } from '../hooks/useMqtt';

function Row({ label, value, right }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 py-2.5 last:border-0">
      <span className="text-[12px] text-slate-400 font-medium">{label}</span>
      <span className="text-[12px] font-semibold text-slate-700 font-mono">{right ?? value}</span>
    </div>
  );
}

export default function LiveMonitor({ state, isOnline }) {
  const soc = calcSoC(state.voltage) ?? 0;
  const v = parseFloat(state.voltage), c = parseFloat(state.current), p = parseFloat(state.power), t = parseFloat(state.temperature);
  const vPct = isNaN(v) ? 0 : ((v - 10.5) / (12.7 - 10.5)) * 100;
  const cPct = isNaN(c) ? 0 : Math.min(100, (c / state.currentLimit) * 100);
  const pPct = isNaN(p) ? 0 : Math.min(100, (p / 50) * 100);
  const tPct = isNaN(t) ? 0 : Math.min(100, (t / 80) * 100);

  const socColor = soc >= 60 ? '#10b981' : soc >= 30 ? '#f59e0b' : '#ef4444';
  const tColor   = t > 60 ? '#ef4444' : t > 40 ? '#f59e0b' : '#06b6d4';

  return (
    <div className="space-y-5 fade-in">
      <SectionBox icon={Activity} title="Live Monitoring"
        sub="Real-time readings from PZEM-017 DC meter and ESP32 sensors"
        badge={isOnline ? '● Live' : '● Demo'} badgeColor={isOnline ? '#10b981' : '#f59e0b'}>

        {/* 4 gauges */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <ArcGauge pct={vPct} value={isOnline ? state.voltage : '--'} unit="VOLTS"   label="Voltage"     color="#6366f1" />
          <ArcGauge pct={cPct} value={isOnline ? state.current : '--'} unit="AMPERES" label="Current"     color="#10b981" />
          <ArcGauge pct={pPct} value={isOnline ? state.power   : '--'} unit="WATTS"   label="Power"       color="#f59e0b" />
          <ArcGauge pct={tPct} value={isOnline ? state.temperature : '--'} unit="°C"  label="Temperature" color={tColor}  />
        </div>
      </SectionBox>

      {/* SoC + Readings row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* SoC bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">State of Charge</p>
          <p className="font-mono text-4xl font-black text-slate-800" style={{ color: socColor }}>
            {soc > 0 || isOnline ? `${Math.round(soc)}%` : '--'}
          </p>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${soc}%`, background: `linear-gradient(90deg, ${socColor}cc, ${socColor})` }} />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-slate-400 font-medium">
            <span>0%</span>
            <span style={{ color: socColor }}>20% warning</span>
            <span>100%</span>
          </div>
        </div>

        {/* Readings table */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Readings</p>
          <Row label="Last reading"    value={state.lastSeen ?? '—'} />
          <Row label="Runtime left"    value={isOnline ? state.runtime : '—'} />
          <Row label="Battery status"  value={soc >= 50 ? 'Normal' : soc >= 20 ? 'Low' : 'Critical'} />
          <Row label="OC status"       value={state.warning ? '⚠ ALERT' : '✓ OK'} />
          <Row label="Current limit"   value={`${state.currentLimit} A`} />
          <Row label="Active channels" value={`${state.relays.filter(Boolean).length} / 4`} />
        </div>
      </div>
    </div>
  );
}
