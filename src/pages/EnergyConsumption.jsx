/**
 * pages/EnergyConsumption.jsx — Energy tracking with 3 trend charts
 */
import { Zap } from 'lucide-react';
import KpiCard from '../components/shared/KpiCard';
import MiniChart from '../components/shared/MiniChart';

export default function EnergyConsumption({ state, isOnline }) {
  const avgP  = state.avgCurrent.count > 0
    ? (state.avgCurrent.sum / state.avgCurrent.count * parseFloat(state.voltage || 12)).toFixed(1)
    : '--';

  return (
    <div className="space-y-5 fade-in">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Total Energy Consumed" value={state.sessionEnergy.toFixed(1)} unit="Wh" sub="Session total" borderColor="#6366f1" />
        <KpiCard label="Today's Energy"        value={state.sessionEnergy.toFixed(1)} unit="Wh" borderColor="#06b6d4" />
        <KpiCard label="Average Power"         value={avgP}                           unit="W"  borderColor="#10b981" />
        <KpiCard label="Peak Power"            value={state.peakPower?.toFixed(1) ?? '--'} unit="W" borderColor="#ef4444" />
        <KpiCard label="Current Power"         value={isOnline ? state.power : '--'}  unit="W"  borderColor="#8b5cf6" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <MiniChart title="Energy Accumulated (Wh) vs Time" data={state.history} dataKey="power"       unit="Wh" color="#10b981" />
        <MiniChart title="Instantaneous Power vs Time"     data={state.history} dataKey="power"       unit="W"  color="#f59e0b" />
        <MiniChart title="Voltage vs Time"                 data={state.history} dataKey="voltage"     unit="V"  color="#6366f1" domain={[10,14]} />
      </div>

      <MiniChart title="Current vs Time" data={state.history} dataKey="current" unit="A" color="#ef4444" />
    </div>
  );
}
