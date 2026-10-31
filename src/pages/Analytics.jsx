/**
 * pages/Analytics.jsx — Historical trends and session performance
 */
import { BarChart3 } from 'lucide-react';
import KpiCard from '../components/shared/KpiCard';
import MiniChart from '../components/shared/MiniChart';
import SectionBox from '../components/shared/SectionBox';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const HOUR_BINS = [
  { label: '0-3h', color: '#6366f1' }, { label: '3-6h', color: '#06b6d4' },
  { label: '6-9h', color: '#10b981' }, { label: '9-12h', color: '#f59e0b' },
  { label: '12-15h', color: '#8b5cf6' }, { label: '15h+', color: '#ef4444' },
];

export default function Analytics({ state, isOnline }) {
  const avgCurrent = state.avgCurrent.count > 0
    ? (state.avgCurrent.sum / state.avgCurrent.count).toFixed(2)
    : '--';

  // Build session energy distribution estimate (proportional to history)
  const binSize = Math.max(1, Math.floor(state.history.length / 6));
  const bins = HOUR_BINS.map((b, i) => {
    const slice = state.history.slice(i * binSize, (i + 1) * binSize);
    const sum = slice.reduce((acc, p) => acc + (p.power ?? 0), 0);
    return { label: b.label, energy: parseFloat((sum / 3600).toFixed(4)), color: b.color };
  });

  return (
    <div className="space-y-5 fade-in">
      {/* Session KPIs */}
      <SectionBox icon={BarChart3} title="Power Analytics" sub="Historical trends and session performance">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <KpiCard label="Peak Voltage"  value={state.peakVoltage?.toFixed(2) ?? '--'}  unit="V"  borderColor="#6366f1" />
          <KpiCard label="Min Voltage"   value={state.minVoltage?.toFixed(2)  ?? '--'}  unit="V"  borderColor="#06b6d4" />
          <KpiCard label="Avg Current"   value={avgCurrent}                             unit="A"  borderColor="#10b981" />
          <KpiCard label="Peak Power"    value={state.peakPower?.toFixed(1)   ?? '--'}  unit="W"  borderColor="#f59e0b" />
          <KpiCard label="Energy Used"   value={state.sessionEnergy.toFixed(1)}         unit="Wh" borderColor="#8b5cf6" />
          <KpiCard label="State of Health" value="N/C" sub="Requires validated cycles" borderColor="#94a3b8" />
        </div>
      </SectionBox>

      {/* Session energy distribution bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-[13px] font-bold text-slate-700 mb-1">Session Energy Distribution (Estimated)</p>
        <p className="text-[10px] text-slate-400 mb-4">Proportional estimates — not per-hour metered values</p>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bins} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8', fontFamily: 'monospace' }} tickLine={false} axisLine={false} tickFormatter={v => `${v}Wh`} width={48} />
              <Tooltip formatter={v => [`${v} Wh`, 'Energy']} contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 11 }} />
              <Bar dataKey="energy" radius={[5, 5, 0, 0]} maxBarSize={64}>
                {bins.map((b, i) => <Cell key={i} fill={b.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Three mini charts with time filters */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <MiniChart title="SOC Trend"        data={state.history} dataKey="voltage" unit="V"  color="#6366f1" domain={[10,14]} />
        <MiniChart title="Voltage Trend"    data={state.history} dataKey="voltage" unit="V"  color="#06b6d4" domain={[10,14]} />
        <MiniChart title="Current & Power"  data={state.history} dataKey="current" unit="A"  color="#f59e0b" />
      </div>
    </div>
  );
}
